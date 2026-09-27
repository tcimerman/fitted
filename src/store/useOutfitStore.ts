// Today's ephemeral suggestions + durable saved/worn outfits (SQLite-backed).
import { create } from 'zustand';
import * as db from '@/services/db';
import { isConfigured } from '@/services/gemini/client';
import { generateOutfits, GenerateOpts } from '@/services/gemini/generateOutfits';
import { spinLocally } from '@/services/localStylist';
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
  /** One styling round: Gemini when a key is configured, offline quick-spin otherwise. */
  spin: (opts: GenerateOpts) => Promise<{ outfits: Outfit[]; offline: boolean }>;
  /** Instant offline preview (no AI, no quota) — used for the onboarding "aha". */
  previewSpin: (opts: GenerateOpts) => Outfit | undefined;
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
  spin: async (opts) => {
    if (isConfigured()) return { outfits: await generateOutfits(opts), offline: false };
    await new Promise((r) => setTimeout(r, 1100)); // let the spin animation breathe
    return { outfits: spinLocally(opts), offline: true };
  },
  previewSpin: (opts) => spinLocally(opts)[0],
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
