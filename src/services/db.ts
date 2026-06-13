// SQLite persistence for garments + outfits. Arrays/objects stored as JSON text;
// images are NEVER stored here — file URIs only.
import * as SQLite from 'expo-sqlite';
import { Garment, Outfit } from '@/types';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

async function open(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = (async () => {
      const db = await SQLite.openDatabaseAsync('fitted.db');
      await migrate(db);
      return db;
    })();
  }
  return dbPromise;
}

async function migrate(db: SQLite.SQLiteDatabase) {
  const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  const version = row?.user_version ?? 0;
  if (version < 1) {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS garments (
        id TEXT PRIMARY KEY,
        category TEXT NOT NULL,
        name TEXT NOT NULL,
        colors TEXT NOT NULL,
        styleTags TEXT NOT NULL,
        warmth INTEGER NOT NULL,
        formality INTEGER NOT NULL,
        description TEXT NOT NULL,
        originalUri TEXT NOT NULL,
        enhancedUri TEXT,
        thumbUri TEXT NOT NULL,
        createdAt INTEGER NOT NULL,
        isArchived INTEGER NOT NULL DEFAULT 0
      );
      CREATE INDEX IF NOT EXISTS idx_garments_category ON garments(category);
      CREATE INDEX IF NOT EXISTS idx_garments_archived ON garments(isArchived);
      CREATE TABLE IF NOT EXISTS outfits (
        id TEXT PRIMARY KEY,
        occasion TEXT NOT NULL,
        slots TEXT NOT NULL,
        matchScore INTEGER NOT NULL,
        why TEXT NOT NULL,
        weather TEXT,
        createdAt INTEGER NOT NULL,
        isFavorite INTEGER NOT NULL DEFAULT 0,
        wornOn TEXT,
        tryOnUri TEXT
      );
      CREATE INDEX IF NOT EXISTS idx_outfits_fav ON outfits(isFavorite);
      CREATE INDEX IF NOT EXISTS idx_outfits_worn ON outfits(wornOn);
      PRAGMA user_version = 1;
    `);
  }
}

/* ---------- garments ---------- */

interface GarmentRow {
  id: string; category: string; name: string; colors: string; styleTags: string;
  warmth: number; formality: number; description: string;
  originalUri: string; enhancedUri: string | null; thumbUri: string;
  createdAt: number; isArchived: number;
}

const rowToGarment = (r: GarmentRow): Garment => ({
  id: r.id,
  category: r.category as Garment['category'],
  name: r.name,
  colors: JSON.parse(r.colors),
  styleTags: JSON.parse(r.styleTags),
  warmth: r.warmth,
  formality: r.formality,
  description: r.description,
  originalUri: r.originalUri,
  enhancedUri: r.enhancedUri ?? undefined,
  thumbUri: r.thumbUri,
  createdAt: r.createdAt,
  isArchived: !!r.isArchived,
});

export async function listGarments(): Promise<Garment[]> {
  const db = await open();
  const rows = await db.getAllAsync<GarmentRow>('SELECT * FROM garments WHERE isArchived = 0 ORDER BY createdAt DESC');
  return rows.map(rowToGarment);
}

export async function insertGarment(g: Garment): Promise<void> {
  const db = await open();
  await db.runAsync(
    `INSERT INTO garments (id, category, name, colors, styleTags, warmth, formality, description, originalUri, enhancedUri, thumbUri, createdAt, isArchived)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    g.id, g.category, g.name, JSON.stringify(g.colors), JSON.stringify(g.styleTags), g.warmth, g.formality,
    g.description, g.originalUri, g.enhancedUri ?? null, g.thumbUri, g.createdAt, g.isArchived ? 1 : 0,
  );
}

export async function updateGarment(g: Garment): Promise<void> {
  const db = await open();
  await db.runAsync(
    `UPDATE garments SET category=?, name=?, colors=?, styleTags=?, warmth=?, formality=?, description=?, enhancedUri=?, thumbUri=?, isArchived=? WHERE id=?`,
    g.category, g.name, JSON.stringify(g.colors), JSON.stringify(g.styleTags), g.warmth, g.formality,
    g.description, g.enhancedUri ?? null, g.thumbUri, g.isArchived ? 1 : 0, g.id,
  );
}

export async function archiveGarment(id: string): Promise<void> {
  const db = await open();
  await db.runAsync('UPDATE garments SET isArchived = 1 WHERE id = ?', id);
}

export async function getGarment(id: string): Promise<Garment | null> {
  const db = await open();
  const row = await db.getFirstAsync<GarmentRow>('SELECT * FROM garments WHERE id = ?', id);
  return row ? rowToGarment(row) : null;
}

/* ---------- outfits ---------- */

interface OutfitRow {
  id: string; occasion: string; slots: string; matchScore: number; why: string;
  weather: string | null; createdAt: number; isFavorite: number; wornOn: string | null; tryOnUri: string | null;
}

const rowToOutfit = (r: OutfitRow): Outfit => ({
  id: r.id,
  occasion: r.occasion,
  slots: JSON.parse(r.slots),
  matchScore: r.matchScore,
  why: r.why,
  weather: r.weather ? JSON.parse(r.weather) : undefined,
  createdAt: r.createdAt,
  isFavorite: !!r.isFavorite,
  wornOn: r.wornOn ?? undefined,
  tryOnUri: r.tryOnUri ?? undefined,
});

export async function listSavedOutfits(): Promise<Outfit[]> {
  const db = await open();
  const rows = await db.getAllAsync<OutfitRow>(
    'SELECT * FROM outfits WHERE isFavorite = 1 OR wornOn IS NOT NULL ORDER BY createdAt DESC',
  );
  return rows.map(rowToOutfit);
}

export async function upsertOutfit(o: Outfit): Promise<void> {
  const db = await open();
  await db.runAsync(
    `INSERT INTO outfits (id, occasion, slots, matchScore, why, weather, createdAt, isFavorite, wornOn, tryOnUri)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET occasion=excluded.occasion, slots=excluded.slots, matchScore=excluded.matchScore,
       why=excluded.why, weather=excluded.weather, isFavorite=excluded.isFavorite, wornOn=excluded.wornOn, tryOnUri=excluded.tryOnUri`,
    o.id, o.occasion, JSON.stringify(o.slots), o.matchScore, o.why,
    o.weather ? JSON.stringify(o.weather) : null, o.createdAt, o.isFavorite ? 1 : 0, o.wornOn ?? null, o.tryOnUri ?? null,
  );
}

export async function deleteOutfit(id: string): Promise<void> {
  const db = await open();
  await db.runAsync('DELETE FROM outfits WHERE id = ?', id);
}

export async function wipeDatabase(): Promise<void> {
  const db = await open();
  await db.execAsync('DELETE FROM garments; DELETE FROM outfits;');
}
