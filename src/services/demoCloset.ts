// DEV ONLY: a tagged sample closet (flat SVG silhouettes as data URIs) so the
// spin / planner / limits can be tried without photos or a Gemini key.
// Reachable from You → component gallery → "load demo closet".
import { Garment, GarmentCategory } from '@/types';
import { uid } from '@/utils';

const PATHS: Record<string, string> = {
  tee: 'M21 9 L12 17 L7 24 L14 31 L21 26 L21 54 Q21 56 23 56 L41 56 Q43 56 43 54 L43 26 L50 31 L57 24 L52 17 L43 9 L39 9 Q32 17 25 9 Z',
  sweater: 'M21 10 L11 18 L6 26 L13 33 L21 28 L21 53 Q21 56 24 56 L40 56 Q43 56 43 53 L43 28 L51 33 L58 26 L53 18 L43 10 L39 10 Q32 17 25 10 Z',
  pants: 'M22 8 H42 L44 57 H34 L32 27 L30 57 H20 Z',
  skirt: 'M19 21 H45 L51 53 Q51 56 48 56 L16 56 Q13 56 13 53 Z M19 21 L18 14 H46 L45 21 Z',
  shoe: 'M7 41 Q7 34 16 34 L29 34 L41 42 L53 44 Q58 45 58 50 L58 53 Q58 55 56 55 L9 55 Q7 55 7 53 Z',
  jacket: 'M21 9 L12 17 L7 24 L14 31 L20 27 L20 54 Q20 56 22 56 L42 56 Q44 56 44 54 L44 27 L50 31 L57 24 L52 17 L43 9 L39 9 Q32 17 25 9 Z',
  tote: 'M23 25 Q23 16 32 16 Q41 16 41 25 M15 25 H49 L47 55 Q47 57 45 57 L19 57 Q17 57 17 55 Z',
  dress: 'M23 9 L15 21 L21 27 L23 23 L17 53 Q17 56 20 56 L44 56 Q47 56 47 53 L41 23 L43 27 L49 21 L41 9 L38 9 Q32 16 26 9 Z',
};

const svg = (shape: string, color: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="256" height="256"><rect width="64" height="64" fill="#ffffff"/><path d="${PATHS[shape]}" fill="${color}" stroke="rgba(0,0,0,0.22)" stroke-width="1.5" stroke-linejoin="round"/></svg>`,
  )}`;

const ITEMS: [GarmentCategory, string, string, string, string[], number, number][] = [
  ['top', 'white oversized tee', 'tee', '#F4F1EA', ['casual', 'streetwear'], 1, 1],
  ['top', 'lilac knit sweater', 'sweater', '#B9A3F5', ['casual', 'romantic'], 4, 2],
  ['top', 'crisp blue shirt', 'tee', '#8FB3E8', ['business', 'classic'], 2, 4],
  ['bottom', 'black straight jeans', 'pants', '#2B2830', ['casual', 'edgy'], 3, 2],
  ['bottom', 'beige wide trousers', 'pants', '#D9C6A5', ['business', 'classic'], 2, 4],
  ['bottom', 'pink pleated skirt', 'skirt', '#FF8DB5', ['romantic', 'casual'], 2, 3],
  ['dress', 'green slip dress', 'dress', '#5CC99B', ['elegant', 'romantic'], 1, 4],
  ['shoes', 'white sneakers', 'shoe', '#FFFFFF', ['casual', 'sporty'], 2, 1],
  ['shoes', 'black loafers', 'shoe', '#27222B', ['business', 'classic'], 2, 4],
  ['outerwear', 'camel coat', 'jacket', '#C8955C', ['classic', 'elegant'], 5, 4],
  ['outerwear', 'denim jacket', 'jacket', '#6C8FC7', ['casual', 'streetwear'], 3, 2],
  ['accessory', 'yellow tote', 'tote', '#FFD23F', ['casual', 'boho'], 1, 2],
];

export function buildDemoCloset(): Garment[] {
  const now = Date.now();
  return ITEMS.map(([category, name, shape, color, styleTags, warmth, formality], i) => {
    const uri = svg(shape, color);
    return {
      id: uid(), category, name, colors: [color], styleTags, warmth, formality,
      description: `demo piece — ${name}`, originalUri: uri, thumbUri: uri,
      createdAt: now - i * 1000, isArchived: false,
    };
  });
}
