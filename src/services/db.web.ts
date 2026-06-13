// Web fallback for db.ts: IndexedDB instead of SQLite (expo-sqlite has no
// drop-in web support without wasm/COEP setup). Same exported API; rows are
// stored as plain objects. Metro picks this file automatically on web.
import { Garment, Outfit } from '@/types';

const DB_NAME = 'fitted';
const VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;

function open(): Promise<IDBDatabase> {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains('garments')) db.createObjectStore('garments', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('outfits')) db.createObjectStore('outfits', { keyPath: 'id' });
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }
  return dbPromise;
}

function tx<T>(store: 'garments' | 'outfits', mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return open().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const t = db.transaction(store, mode);
        const req = fn(t.objectStore(store));
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      }),
  );
}

/* ---------- garments ---------- */

export async function listGarments(): Promise<Garment[]> {
  const all = await tx<Garment[]>('garments', 'readonly', (s) => s.getAll() as IDBRequest<Garment[]>);
  return all.filter((g) => !g.isArchived).sort((a, b) => b.createdAt - a.createdAt);
}

export async function insertGarment(g: Garment): Promise<void> {
  await tx('garments', 'readwrite', (s) => s.put(g));
}

export async function updateGarment(g: Garment): Promise<void> {
  await tx('garments', 'readwrite', (s) => s.put(g));
}

export async function archiveGarment(id: string): Promise<void> {
  const g = await tx<Garment | undefined>('garments', 'readonly', (s) => s.get(id) as IDBRequest<Garment | undefined>);
  if (g) await tx('garments', 'readwrite', (s) => s.put({ ...g, isArchived: true }));
}

export async function getGarment(id: string): Promise<Garment | null> {
  const g = await tx<Garment | undefined>('garments', 'readonly', (s) => s.get(id) as IDBRequest<Garment | undefined>);
  return g ?? null;
}

/* ---------- outfits ---------- */

export async function listSavedOutfits(): Promise<Outfit[]> {
  const all = await tx<Outfit[]>('outfits', 'readonly', (s) => s.getAll() as IDBRequest<Outfit[]>);
  return all.filter((o) => o.isFavorite || o.wornOn).sort((a, b) => b.createdAt - a.createdAt);
}

export async function upsertOutfit(o: Outfit): Promise<void> {
  await tx('outfits', 'readwrite', (s) => s.put(o));
}

export async function deleteOutfit(id: string): Promise<void> {
  await tx('outfits', 'readwrite', (s) => s.delete(id));
}

export async function wipeDatabase(): Promise<void> {
  await tx('garments', 'readwrite', (s) => s.clear());
  await tx('outfits', 'readwrite', (s) => s.clear());
}
