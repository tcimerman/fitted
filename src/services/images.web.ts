// Web fallback for images.ts: no filesystem in the browser, so images live as
// data URIs stored alongside the rows in IndexedDB. Sizes are kept smaller than
// native to stay light. Same exported API; metro picks this file on web.
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';

export type PickSource = 'camera' | 'library';

export async function ensureDirs(): Promise<void> {
  // no-op on web
}

export async function pickImage(source: PickSource): Promise<string | null> {
  // browser camera capture isn't supported by launchCameraAsync — use the file picker
  void source;
  const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.9 });
  return res.canceled ? null : res.assets[0].uri;
}

async function toDataUri(uri: string, maxEdge: number, compress: number): Promise<string> {
  const out = await ImageManipulator.manipulateAsync(uri, [{ resize: { width: maxEdge } }], {
    compress,
    format: ImageManipulator.SaveFormat.JPEG,
    base64: true,
  });
  return `data:image/jpeg;base64,${out.base64}`;
}

export async function storeGarmentPhoto(sourceUri: string, _garmentId: string): Promise<{ originalUri: string; thumbUri: string }> {
  const originalUri = await toDataUri(sourceUri, 768, 0.75);
  const thumbUri = await toDataUri(sourceUri, 256, 0.7);
  return { originalUri, thumbUri };
}

export async function storeEnhancedPhoto(base64: string, _garmentId: string): Promise<{ enhancedUri: string; thumbUri: string }> {
  const enhancedUri = `data:image/jpeg;base64,${base64}`;
  const thumbUri = await toDataUri(enhancedUri, 256, 0.7);
  return { enhancedUri, thumbUri };
}

export async function storeProfilePhoto(sourceUri: string, _key: 'front' | 'side' | 'back' | 'face'): Promise<string> {
  return toDataUri(sourceUri, 768, 0.75);
}

export async function storeTryOnImage(base64: string, _outfitId: string): Promise<string> {
  return `data:image/jpeg;base64,${base64}`;
}

export async function deleteGarmentFiles(_garmentId: string): Promise<void> {
  // data URIs live inside the rows — nothing separate to delete
}

export async function toBase64(uri: string, maxEdge?: number): Promise<string> {
  if (maxEdge) {
    const out = await ImageManipulator.manipulateAsync(uri, [{ resize: { width: maxEdge } }], {
      compress: 0.7,
      format: ImageManipulator.SaveFormat.JPEG,
      base64: true,
    });
    return out.base64 ?? '';
  }
  if (uri.startsWith('data:')) return uri.slice(uri.indexOf(',') + 1);
  const out = await ImageManipulator.manipulateAsync(uri, [], { format: ImageManipulator.SaveFormat.JPEG, base64: true });
  return out.base64 ?? '';
}

export async function wipeAllPhotos(): Promise<void> {
  // no-op on web
}
