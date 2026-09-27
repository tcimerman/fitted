// Offline "quick spin": a rule-based outfit composer used when no Gemini key is
// configured (or as a fallback). No network, no AI — it scores closet pieces by
// warmth vs. the forecast, formality vs. the occasion and style-tag overlap,
// then spins 2-3 distinct combos. Same output shape as gemini/generateOutfits.
import { Garment, Outfit, OutfitSlot, Slot } from '@/types';
import { uid } from '@/utils';
import type { GenerateOpts } from './gemini/generateOutfits';

const SLOT_CATEGORIES: Record<Slot, string[]> = {
  top: ['top', 'dress'],
  bottom: ['bottom', 'dress'],
  shoes: ['shoes'],
  socks: ['socks'],
  accessory: ['accessory'],
  outerwear: ['outerwear'],
};

const FORMALITY_HINTS: [RegExp, number][] = [
  [/wedding|gala|black tie|ceremony|opera/i, 5],
  [/interview|meeting|office|work|business|client|presentation|conference/i, 4],
  [/dinner|date|party|drinks|brunch|theatre|theater/i, 3],
  [/gym|run|yoga|hike|workout|sport|beach|lounge|chill|home/i, 1],
];

function targetFormality(occasion: string): number {
  for (const [re, f] of FORMALITY_HINTS) if (re.test(occasion)) return f;
  return 2;
}

function targetWarmth(tempC?: number): number {
  if (tempC == null) return 3;
  if (tempC <= 0) return 5;
  if (tempC <= 8) return 4;
  if (tempC <= 15) return 3;
  if (tempC <= 22) return 2;
  return 1;
}

const WHY = {
  cold: ['layered up and still cute — the cold never stood a chance.', 'cozy mode: on. frostbite: cancelled.'],
  warm: ['light, breezy, zero sweat. the sun approves.', 'summer brain, main-character fit.'],
  formal: ['boardroom-ready without trying too hard.', 'polished enough to close the deal, comfy enough to survive it.'],
  casual: ['effortless, but make it intentional.', 'the “i just threw this on” that took zero minutes. literally.'],
  sporty: ['move-ready and still coordinated. rare combo.', 'sweat-proof and screenshot-worthy.'],
};

const pick = <T,>(arr: T[], seed: number) => arr[Math.abs(seed) % arr.length];

export function spinLocally(opts: Pick<GenerateOpts, 'occasion' | 'weather' | 'profile' | 'enabledSlots' | 'garments' | 'avoidSets'>): Outfit[] {
  const { occasion, weather, profile, enabledSlots, garments, avoidSets } = opts;
  const wantF = targetFormality(occasion);
  const wantW = targetWarmth(weather?.tempC);
  const cold = weather ? weather.tempC <= 15 : false;
  const prefs = new Set(profile.preferredStyles.map((s) => s.toLowerCase()));

  const score = (g: Garment) => {
    const styleHit = g.styleTags.some((t) => prefs.has(t.toLowerCase())) ? 1.5 : 0;
    return -Math.abs(g.warmth - wantW) * 1.4 - Math.abs(g.formality - wantF) + styleHit + Math.random() * 1.6;
  };

  const slots = enabledSlots.filter((s) => s !== 'outerwear' || cold || !weather);
  const ranked = new Map<Slot, Garment[]>();
  for (const slot of slots) {
    const pool = garments.filter((g) => SLOT_CATEGORIES[slot].includes(g.category));
    if (pool.length) ranked.set(slot, pool.map((g) => ({ g, s: score(g) })).sort((a, b) => b.s - a.s).map((x) => x.g));
  }
  if (!ranked.has('top') && !ranked.has('bottom')) return [];

  const avoid = new Set(avoidSets.map((set) => [...set].sort().join('|')));
  const seen = new Set<string>();
  const outfits: Outfit[] = [];

  for (let attempt = 0; attempt < 12 && outfits.length < 3; attempt++) {
    const outfitSlots: OutfitSlot[] = [];
    let dress: Garment | undefined;
    for (const slot of slots) {
      const list = ranked.get(slot);
      if (!list) continue;
      if (slot === 'bottom' && dress) {
        outfitSlots.push({ slot, itemId: dress.id, alternatives: [] });
        continue;
      }
      // later attempts reach deeper into the ranking to stay distinct
      const idx = Math.min(list.length - 1, Math.floor(Math.random() * Math.min(list.length, 1 + attempt)));
      const item = list[idx];
      if (slot === 'top' && item.category === 'dress') dress = item;
      const alternatives = list.filter((g) => g.id !== item.id).slice(0, 3).map((g) => g.id);
      outfitSlots.push({ slot, itemId: item.id, alternatives });
    }
    if (outfitSlots.length === 0) continue;
    const sig = [...new Set(outfitSlots.map((s) => s.itemId))].sort().join('|');
    if (seen.has(sig) || avoid.has(sig)) continue;
    seen.add(sig);

    const byId = new Map(garments.map((g) => [g.id, g]));
    const items = outfitSlots.map((s) => byId.get(s.itemId)!).filter(Boolean);
    const fit = items.reduce((acc, g) => acc - Math.abs(g.warmth - wantW) * 3 - Math.abs(g.formality - wantF) * 3, 0) / Math.max(1, items.length);
    const mood = wantF >= 4 ? WHY.formal : wantF === 1 ? WHY.sporty : cold ? WHY.cold : weather && weather.tempC > 22 ? WHY.warm : WHY.casual;

    outfits.push({
      id: uid(),
      occasion,
      slots: outfitSlots,
      matchScore: Math.max(62, Math.min(94, Math.round(90 + fit - outfits.length * 3))),
      why: pick(mood, attempt + outfits.length),
      weather,
      createdAt: Date.now(),
      isFavorite: false,
    });
  }
  return outfits;
}
