// Today's ephemeral suggestions + durable saved/worn outfits (SQLite-backed).
import { create } from 'zustand';
import * as db from '@/services/db';
import { Outfit } from '@/types';

interface OutfitState {
  // ephemeral — current suggestion session on Today
  suggestions: Outfit[];
  suggestionIndex: number;
  occasion: string;
  generating: boolean;
  // durable
  saved: Outfit[];
  hydrated: boolean;
  hydrate: () => Promise<void>;
  setSuggestions: (outfits: Outfit[], occasion: string) => void;
  setSuggestionIndex: (i: number) => void;
  setGenerating: (v: boolean) => void;
  updateSuggestion: (o: Outfit) => void;
  persistOutfit: (o: Outfit) => Promise<void>;
  removeSaved: (id: string) => Promise<void>;
  clear: () => void;
}

export const useOutfitStore = create<OutfitState>()((set, get) => ({
  suggestions: [],
  suggestionIndex: 0,
  occasion: '',
  generating: false,
  saved: [],
  hydrated: false,
  hydrate: async () => {
    const saved = await db.listSavedOutfits();
    set({ saved, hydrated: true });
  },
  setSuggestions: (suggestions, occasion) => set({ suggestions, occasion, suggestionIndex: 0 }),
  setSuggestionIndex: (suggestionIndex) => set({ suggestionIndex }),
  setGenerating: (generating) => set({ generating }),
  updateSuggestion: (o) =>
    set((s) => ({ suggestions: s.suggestions.map((x) => (x.id === o.id ? o : x)) })),
  persistOutfit: async (o) => {
    await db.upsertOutfit(o);
    const saved = get().saved.filter((x) => x.id !== o.id);
    if (o.isFavorite || o.wornOn) saved.unshift(o);
    saved.sort((a, b) => b.createdAt - a.createdAt);
    set({ saved });
  },
  removeSaved: async (id) => {
    await db.deleteOutfit(id);
    set((s) => ({ saved: s.saved.filter((x) => x.id !== id) }));
  },
  clear: () => set({ suggestions: [], suggestionIndex: 0, occasion: '', saved: [], hydrated: false }),
}));
