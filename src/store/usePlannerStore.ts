// Weekly outfit planner: one planned outfit per calendar day ('YYYY-MM-DD').
// Stores a snapshot of the outfit (ids + why), so plans survive even when the
// outfit was never favourited / worn. Past days are pruned on load.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Outfit } from '@/types';
import { todayKey } from '@/utils';

interface PlannerState {
  plans: Record<string, Outfit>;
  plan: (day: string, outfit: Outfit) => void;
  unplan: (day: string) => void;
  resetAll: () => void;
}

export const usePlannerStore = create<PlannerState>()(
  persist(
    (set) => ({
      plans: {},
      plan: (day, outfit) => set((s) => ({ plans: { ...s.plans, [day]: { ...outfit, occasion: outfit.occasion } } })),
      unplan: (day) =>
        set((s) => {
          const next = { ...s.plans };
          delete next[day];
          return { plans: next };
        }),
      resetAll: () => set({ plans: {} }),
    }),
    {
      name: 'outfitspin-planner',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ plans: s.plans }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        const today = todayKey();
        const kept = Object.fromEntries(Object.entries(state.plans).filter(([day]) => day >= today));
        usePlannerStore.setState({ plans: kept });
      },
    },
  ),
);
