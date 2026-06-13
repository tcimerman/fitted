// Virtual try-on: compose the user's face/body photos with the outfit's garment
// shots into one image of the user wearing the outfit.
import { toBase64 } from '@/services/images';
import { Garment, UserProfile } from '@/types';
import { extractImage, generateContent, MODELS, Part } from './client';

const MAX_PARTS = 8;

export async function generateTryOn(profile: UserProfile, garments: Garment[]): Promise<string> {
  const parts: Part[] = [];
  const photoUris: { uri: string; label: string }[] = [];
  if (profile.facePhotoUri) photoUris.push({ uri: profile.facePhotoUri, label: 'face photo of the person' });
  if (profile.bodyPhotos.front) photoUris.push({ uri: profile.bodyPhotos.front, label: 'full-body front photo of the person' });
  if (profile.bodyPhotos.side) photoUris.push({ uri: profile.bodyPhotos.side, label: 'side profile photo of the person' });

  const budget = MAX_PARTS - photoUris.length;
  const outfitGarments = garments.slice(0, Math.max(1, budget));

  const labels: string[] = [];
  for (const p of photoUris) {
    parts.push({ inlineData: { mimeType: 'image/jpeg', data: await toBase64(p.uri, 768) } });
    labels.push(p.label);
  }
  for (const g of outfitGarments) {
    parts.push({ inlineData: { mimeType: 'image/jpeg', data: await toBase64(g.enhancedUri ?? g.originalUri, 768) } });
    labels.push(`garment: ${g.name} (${g.category})`);
  }

  const prompt = `The images provided are, in order: ${labels.map((l, i) => `(${i + 1}) ${l}`).join('; ')}.
Generate ONE photorealistic full-body photo of this exact person wearing exactly these garments together as one outfit.
- preserve the person's face, hair, skin tone, and body shape faithfully from their photos
- the garments must keep their exact colors, patterns, and details
- natural standing pose, soft studio lighting, plain soft-pink background (#FFF6FB)
- no text, no watermarks, nothing else in frame`;

  parts.unshift({ text: prompt });

  const res = await generateContent({
    model: MODELS.image,
    parts,
    responseModalities: ['IMAGE'],
    timeoutMs: 120_000,
  });
  return extractImage(res);
}
