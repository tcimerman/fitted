// Image pipeline: capture/pick → downscale → store under documentDirectory.
// The only module allowed to touch the filesystem. Base64 is produced solely at
// API-call time and never persisted.
import * as FileSystem from 'expo-file-system/legacy';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';

const ROOT = `${FileSystem.documentDirectory}photos/`;
const DIRS = ['originals', 'enhanced', 'thumbs', 'profile', 'tryon'] as const;
type Dir = (typeof DIRS)[number];

export async function ensureDirs(): Promise<void> {
  for (const d of DIRS) {
    const info = await FileSystem.getInfoAsync(ROOT + d);
    if (!info.exists) await FileSystem.makeDirectoryAsync(ROOT + d, { intermediates: true });
  }
}

export type PickSource = 'camera' | 'library';

export async function pickImage(source: PickSource): Promise<string | null> {
  if (source === 'camera') {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) return null;
    const res = await ImagePicker.launchCameraAsync({ quality: 0.9 });
    return res.canceled ? null : res.assets[0].uri;
  }
  const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!perm.granted) return null;
  const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.9 });
  return res.canceled ? null : res.assets[0].uri;
}

async function resizeTo(uri: string, maxEdge: number, compress: number): Promise<string> {
  const out = await ImageManipulator.manipulateAsync(uri, [{ resize: { width: maxEdge } }], {
    compress,
    format: ImageManipulator.SaveFormat.JPEG,
  });
  return out.uri;
}

async function moveInto(tempUri: string, dir: Dir, name: string): Promise<string> {
  await ensureDirs();
  const dest = `${ROOT}${dir}/${name}.jpg`;
  await FileSystem.moveAsync({ from: tempUri, to: dest });
  return dest;
}

/** Store a garment photo: 1280px original + 256px thumb. */
export async function storeGarmentPhoto(sourceUri: string, garmentId: string): Promise<{ originalUri: string; thumbUri: string }> {
  const original = await resizeTo(sourceUri, 1280, 0.8);
  const originalUri = await moveInto(original, 'originals', garmentId);
  const thumb = await resizeTo(originalUri, 256, 0.7);
  const thumbUri = await moveInto(thumb, 'thumbs', garmentId);
  return { originalUri, thumbUri };
}

/** Store a Gemini-enhanced product shot (base64) and refresh the thumb from it.
 *  The thumb gets a new filename (-e suffix) so expo-image's URI cache misses. */
export async function storeEnhancedPhoto(base64: string, garmentId: string): Promise<{ enhancedUri: string; thumbUri: string }> {
  await ensureDirs();
  const enhancedUri = `${ROOT}enhanced/${garmentId}.jpg`;
  await FileSystem.writeAsStringAsync(enhancedUri, base64, { encoding: FileSystem.EncodingType.Base64 });
  const thumb = await resizeTo(enhancedUri, 256, 0.7);
  const thumbUri = await moveInto(thumb, 'thumbs', `${garmentId}-e`);
  await FileSystem.deleteAsync(`${ROOT}thumbs/${garmentId}.jpg`, { idempotent: true });
  return { enhancedUri, thumbUri };
}

/** Store a profile photo (body front/side/back or face). */
export async function storeProfilePhoto(sourceUri: string, key: 'front' | 'side' | 'back' | 'face'): Promise<string> {
  const resized = await resizeTo(sourceUri, 1280, 0.8);
  await FileSystem.deleteAsync(`${ROOT}profile/${key}.jpg`, { idempotent: true });
  // unique suffix busts expo-image's URI-keyed cache after a re-upload
  const name = `${key}-${Date.now()}`;
  const old = await FileSystem.readDirectoryAsync(`${ROOT}profile/`).catch(() => [] as string[]);
  for (const f of old) if (f.startsWith(`${key}-`)) await FileSystem.deleteAsync(`${ROOT}profile/${f}`, { idempotent: true });
  return moveInto(resized, 'profile', name);
}

/** Store a try-on render (base64 from Gemini). */
export async function storeTryOnImage(base64: string, outfitId: string): Promise<string> {
  await ensureDirs();
  const uri = `${ROOT}tryon/${outfitId}.jpg`;
  await FileSystem.writeAsStringAsync(uri, base64, { encoding: FileSystem.EncodingType.Base64 });
  return uri;
}

export async function deleteGarmentFiles(garmentId: string): Promise<void> {
  for (const d of ['originals', 'enhanced', 'thumbs'] as const) {
    await FileSystem.deleteAsync(`${ROOT}${d}/${garmentId}.jpg`, { idempotent: true });
  }
  await FileSystem.deleteAsync(`${ROOT}thumbs/${garmentId}-e.jpg`, { idempotent: true });
}

/** Read an image as base64 for an API call, optionally re-downscaled first. */
export async function toBase64(uri: string, maxEdge?: number): Promise<string> {
  let target = uri;
  if (maxEdge) target = await resizeTo(uri, maxEdge, 0.7);
  return FileSystem.readAsStringAsync(target, { encoding: FileSystem.EncodingType.Base64 });
}

export async function wipeAllPhotos(): Promise<void> {
  await FileSystem.deleteAsync(ROOT, { idempotent: true });
  await ensureDirs();
}
