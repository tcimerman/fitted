// Garment ingestion: vision analysis of a clothing photo → structured metadata.
import { toBase64 } from '@/services/images';
import { GarmentCategory } from '@/types';
import { BadResponseError, extractText, generateContent, MODELS, parseJson } from './client';

export interface GarmentAnalysis {
  isClothing: boolean;
  category: GarmentCategory;
  name: string;
  colors: string[];
  styleTags: string[];
  warmth: number;
  formality: number;
  description: string;
}

const SCHEMA = {
  type: 'OBJECT',
  properties: {
    isClothing: { type: 'BOOLEAN' },
    category: { type: 'STRING', enum: ['top', 'bottom', 'shoes', 'socks', 'accessory', 'dress', 'outerwear'] },
    name: { type: 'STRING' },
    colors: { type: 'ARRAY', items: { type: 'STRING' }, maxItems: 4 },
    styleTags: { type: 'ARRAY', items: { type: 'STRING' }, maxItems: 5 },
    warmth: { type: 'INTEGER' },
    formality: { type: 'INTEGER' },
    description: { type: 'STRING' },
  },
  required: ['isClothing', 'category', 'name', 'colors', 'styleTags', 'warmth', 'formality', 'description'],
};

const PROMPT = `You are a fashion cataloging assistant. Analyze the garment in this photo.
- isClothing: false if the photo does not contain a clothing item, shoes, or a wearable accessory.
- category: the single best fit. Hats, bags, scarves, belts, jewelry, sunglasses → accessory. Jackets/coats/blazers worn over other clothes → outerwear.
- name: short lowercase name like "black slim-fit jeans" or "white linen shirt".
- colors: dominant colors, primary first, lowercase.
- styleTags: from casual, business, streetwear, elegant, sporty, boho, edgy, classic, romantic, formal.
- warmth: 1 (summer-only) to 5 (deep winter).
- formality: 1 (loungewear) to 5 (black tie).
- description: one concise line a stylist would use to pick it for an outfit (fit, fabric, vibe).`;

export async function analyzeGarment(photoUri: string): Promise<GarmentAnalysis> {
  const data = await toBase64(photoUri, 768);
  const res = await generateContent({
    model: MODELS.reasoning,
    parts: [{ text: PROMPT }, { inlineData: { mimeType: 'image/jpeg', data } }],
    responseSchema: SCHEMA,
    temperature: 0.2,
  });
  const out = parseJson<GarmentAnalysis>(extractText(res));
  if (!out || typeof out.isClothing !== 'boolean') throw new BadResponseError('analysis shape mismatch');
  out.warmth = Math.min(5, Math.max(1, Math.round(out.warmth)));
  out.formality = Math.min(5, Math.max(1, Math.round(out.formality)));
  return out;
}
