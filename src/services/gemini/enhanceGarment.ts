// White-background product-shot enhancement via gemini-2.5-flash-image.
// Runs through a sequential queue (concurrency 1, spaced) to respect free-tier
// rate limits when several garments are added at once. Failures are silent at
// the queue level — the original photo is the permanent fallback.
import { storeEnhancedPhoto, toBase64 } from '@/services/images';
import { useWardrobeStore } from '@/store/useWardrobeStore';
import { extractImage, generateContent, isConfigured, MODELS } from './client';

const PROMPT = `Re-render this exact garment as a clean e-commerce product photo:
- pure white background (#FFFFFF), soft even studio lighting, gentle shadow
- flat-lay or ghost-mannequin presentation, garment fills most of the frame
- preserve the garment's exact colors, pattern, fabric texture, and details
- no humans, no hangers, no text, no logos added, nothing else in frame`;

export async function enhanceGarment(photoUri: string): Promise<string> {
  const data = await toBase64(photoUri, 1024);
  const res = await generateContent({
    model: MODELS.image,
    parts: [{ text: PROMPT }, { inlineData: { mimeType: 'image/jpeg', data } }],
    responseModalities: ['IMAGE'],
    timeoutMs: 90_000,
  });
  return extractImage(res);
}

/* ---------- sequential enhancement queue ---------- */

const queue: string[] = [];
let running = false;
const SPACING_MS = 4000;

export function queueEnhancement(garmentId: string): void {
  if (!isConfigured()) return;
  if (queue.includes(garmentId)) return;
  queue.push(garmentId);
  void drain();
}

async function drain(): Promise<void> {
  if (running) return;
  running = true;
  while (queue.length) {
    const id = queue.shift()!;
    try {
      const garment = useWardrobeStore.getState().garments.find((g) => g.id === id);
      if (!garment || garment.enhancedUri) continue;
      const base64 = await enhanceGarment(garment.originalUri);
      const { enhancedUri, thumbUri } = await storeEnhancedPhoto(base64, id);
      // bust expo-image cache by appending a version param is not possible for
      // file URIs consumed elsewhere; thumb path is stable but content changed —
      // patch triggers re-render and expo-image re-reads on key change in tiles.
      await useWardrobeStore.getState().patch(id, { enhancedUri, thumbUri });
    } catch {
      // original photo remains the fallback; never crash the queue
    }
    if (queue.length) await new Promise((r) => setTimeout(r, SPACING_MS));
  }
  running = false;
}
