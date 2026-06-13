// The core AI loop: occasion + weather + wardrobe catalog (metadata only, zero
// images) → 2-3 outfits with per-slot ranked alternatives. responseSchema
// constrains shape; referential integrity is enforced by validateOutfits below.
import { uid } from '@/utils';
import { Garment, Outfit, OutfitSlot, Slot, UserProfile, WeatherSnapshot } from '@/types';
import { BadResponseError, extractText, generateContent, MODELS, parseJson } from './client';

const SCHEMA = {
  type: 'OBJECT',
  properties: {
    outfits: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          slots: {
            type: 'ARRAY',
            items: {
              type: 'OBJECT',
              properties: {
                slot: { type: 'STRING', enum: ['top', 'bottom', 'shoes', 'socks', 'accessory', 'outerwear'] },
                itemId: { type: 'STRING' },
                alternativeIds: { type: 'ARRAY', items: { type: 'STRING' }, maxItems: 3 },
              },
              required: ['slot', 'itemId', 'alternativeIds'],
            },
          },
          matchScore: { type: 'INTEGER' },
          why: { type: 'STRING' },
        },
        required: ['slots', 'matchScore', 'why'],
      },
    },
  },
  required: ['outfits'],
};

interface RawSlot { slot: Slot; itemId: string; alternativeIds: string[] }
interface RawOutfit { slots: RawSlot[]; matchScore: number; why: string }
interface RawResponse { outfits: RawOutfit[] }

// which garment categories may fill a slot
const SLOT_CATEGORIES: Record<Slot, string[]> = {
  top: ['top', 'dress'],
  bottom: ['bottom', 'dress'],
  shoes: ['shoes'],
  socks: ['socks'],
  accessory: ['accessory'],
  outerwear: ['outerwear'],
};

function catalogLines(garments: Garment[]): string {
  return garments
    .map((g) =>
      JSON.stringify({
        id: g.id, cat: g.category, name: g.name, colors: g.colors,
        tags: g.styleTags, warmth: g.warmth, formality: g.formality, desc: g.description,
      }),
    )
    .join('\n');
}

function buildPrompt(opts: GenerateOpts, correction?: string): string {
  const { occasion, weather, profile, enabledSlots, garments, avoidSets } = opts;
  const weatherLine = weather
    ? `today's weather in ${weather.city}: ${Math.round(weather.tempC)}°C (feels ${Math.round(weather.feelsLikeC)}°C, low ${Math.round(weather.tempMinC)}° high ${Math.round(weather.tempMaxC)}°), ${weather.summary}, ${weather.precipProbability}% chance of precipitation.`
    : 'weather unknown — assume mild.';
  return `You are fitted, an upbeat personal stylist. Compose outfits ONLY from the user's closet catalog below.

USER: gender presentation ${profile.genderPresentation}; preferred styles: ${profile.preferredStyles.join(', ') || 'no strong preference'}.
WEATHER: ${weatherLine}
OCCASION: ${occasion || 'a regular day'}

CLOSET CATALOG (one JSON per line; "id" is the only valid identifier):
${catalogLines(garments)}

RULES:
- Build 2-3 complete, distinct outfits for this occasion and weather.
- Fill exactly these slots: ${enabledSlots.join(', ')}. A dress may fill BOTH top and bottom (use the same dress id in both slots). Skip a slot only if the closet has nothing suitable for it.
- Every itemId and alternativeId MUST be an "id" copied verbatim from the catalog, and category-appropriate for its slot (top slot → cat top or dress; bottom → bottom or dress; shoes → shoes; socks → socks; accessory → accessory; outerwear → outerwear). Include outerwear only when weather or occasion calls for it${enabledSlots.includes('outerwear') ? '' : ' — but outerwear is disabled today, so never include it'}.
- alternativeIds: up to 3 ranked same-slot swaps that keep the rest of the outfit working. Never repeat the slot's itemId.
- matchScore: 0-100 honest fit for occasion + weather + the user's style.
- why: one lowercase line (max 120 chars), hype-friend voice, e.g. "the pink cargos are calling. answer them."
${avoidSets.length ? `- Do NOT repeat these exact outfit combinations: ${avoidSets.map((s) => `[${s.join(', ')}]`).join(' ')}` : ''}
${correction ?? ''}`;
}

export interface GenerateOpts {
  occasion: string;
  weather?: WeatherSnapshot;
  profile: UserProfile;
  enabledSlots: Slot[];
  garments: Garment[];
  avoidSets: string[][];
}

export function validateOutfits(raw: RawResponse, garments: Garment[], enabledSlots: Slot[]): Outfit[] {
  const byId = new Map(garments.map((g) => [g.id, g]));
  const validFor = (id: string, slot: Slot) => {
    const g = byId.get(id);
    return !!g && SLOT_CATEGORIES[slot].includes(g.category);
  };
  const outfits: Outfit[] = [];
  for (const o of raw.outfits ?? []) {
    if (!Array.isArray(o.slots)) continue;
    const slots: OutfitSlot[] = [];
    let broken = false;
    const seenSlots = new Set<string>();
    for (const s of o.slots) {
      if (!enabledSlots.includes(s.slot) || seenSlots.has(s.slot)) continue;
      seenSlots.add(s.slot);
      const alternatives = (s.alternativeIds ?? []).filter((id) => id !== s.itemId && validFor(id, s.slot));
      let itemId = s.itemId;
      if (!validFor(itemId, s.slot)) {
        if (alternatives.length) itemId = alternatives.shift()!;
        else {
          // a missing core slot breaks the outfit; missing extras are tolerable
          if (s.slot === 'top' || s.slot === 'bottom' || s.slot === 'shoes') broken = true;
          continue;
        }
      }
      slots.push({ slot: s.slot, itemId, alternatives: [...new Set(alternatives)] });
    }
    // a dress can legitimately cover both top+bottom; require at least top or bottom present
    const hasCore = slots.some((s) => s.slot === 'top' || s.slot === 'bottom');
    if (broken || !hasCore || slots.length === 0) continue;
    outfits.push({
      id: uid(),
      occasion: '',
      slots,
      matchScore: Math.min(100, Math.max(0, Math.round(o.matchScore ?? 70))),
      why: (o.why || 'this one just works, trust').slice(0, 140),
      createdAt: Date.now(),
      isFavorite: false,
    });
  }
  return outfits;
}

export async function generateOutfits(opts: GenerateOpts): Promise<Outfit[]> {
  const attempt = async (correction?: string): Promise<Outfit[]> => {
    const res = await generateContent({
      model: MODELS.reasoning,
      parts: [{ text: buildPrompt(opts, correction) }],
      responseSchema: SCHEMA,
      temperature: 0.8,
      timeoutMs: 60_000,
    });
    const raw = parseJson<RawResponse>(extractText(res));
    const outfits = validateOutfits(raw, opts.garments, opts.enabledSlots);
    return outfits.map((o) => ({ ...o, occasion: opts.occasion, weather: opts.weather }));
  };

  let outfits = await attempt();
  if (outfits.length === 0) {
    outfits = await attempt(
      '- IMPORTANT: your previous answer used ids that are not in the catalog or were category-mismatched. Use ONLY verbatim ids from the catalog, matched to the correct slot.',
    );
  }
  if (outfits.length === 0) throw new BadResponseError('no valid outfits after retry');
  return outfits;
}
