// Hot in-memory wardrobe, hydrated from SQLite at launch; SQLite is the
// durability layer, this store is the read layer screens subscribe to.
import { create } from 'zustand';
import * as db from '@/services/db';
import { deleteGarmentFiles } from '@/services/images';
import { Garment } from '@/types';

interface WardrobeState {
  garments: Garment[];
  hydrated: boolean;
  hydrate: () => Promise<void>;
  add: (g: Garment) => Promise<void>;
  update: (g: Garment) => Promise<void>;
  patch: (id: string, patch: Partial<Garment>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  clear: () => void;
}

export const useWardrobeStore = create<WardrobeState>()((set, get) => ({
  garments: [],
  hydrated: false,
  hydrate: async () => {
    const garments = await db.listGarments();
    set({ garments, hydrated: true });
  },
  add: async (g) => {
    await db.insertGarment(g);
    set((s) => ({ garments: [g, ...s.garments] }));
  },
  update: async (g) => {
    await db.updateGarment(g);
    set((s) => ({ garments: s.garments.map((x) => (x.id === g.id ? g : x)) }));
  },
  patch: async (id, patch) => {
    const current = get().garments.find((g) => g.id === id);
    if (!current) return;
    const next = { ...current, ...patch };
    await db.updateGarment(next);
    set((s) => ({ garments: s.garments.map((x) => (x.id === id ? next : x)) }));
  },
  remove: async (id) => {
    await db.archiveGarment(id);
    await deleteGarmentFiles(id).catch(() => {});
    set((s) => ({ garments: s.garments.filter((g) => g.id !== id) }));
  },
  clear: () => set({ garments: [], hydrated: false }),
}));
