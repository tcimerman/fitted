// OutfitSpin Plus: entitlement state + free-tier usage counters.
// Persisted locally (AsyncStorage). Purchases go through services/purchases.ts
// (currently a MOCK — see the banner there).
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  cancelMockSubscription, Entitlement, PlanId, purchasePlan, restorePurchases,
} from '@/services/purchases';
import { todayKey } from '@/utils';

// Free tier. Spins = one AI styling round (2-3 outfits). Plus caps try-ons at a
// fair-use number because every render is a paid image-model call.
export const FREE_LIMITS = { spinsPerDay: 3, tryOnsPerMonth: 3, closetPieces: 30, planAheadDays: 1 } as const;
export const PLUS_LIMITS = { spinsPerDay: Infinity, tryOnsPerMonth: 50, closetPieces: Infinity, planAheadDays: 6 } as const;

export type PaywallReason = 'onboarding' | 'spins' | 'tryon' | 'closet' | 'planner' | 'profile';

const monthKey = (d = new Date()) => todayKey(d).slice(0, 7);

interface Usage {
  spinsDay: string;
  spins: number;
  tryOnMonth: string;
  tryOns: number;
}

interface SubscriptionState {
  entitlement?: Entitlement;
  usage: Usage;
  referralCode: string;
  busy: boolean;
  purchase: (planId: PlanId) => Promise<boolean>;
  restore: () => Promise<boolean>;
  cancel: () => Promise<void>;
  recordSpin: () => void;
  recordTryOn: () => void;
  // dev-only helpers (component gallery)
  devSetPlus: (on: boolean) => void;
  devMaxUsage: () => void;
  devResetUsage: () => void;
  resetAll: () => void;
}

const freshUsage = (): Usage => ({ spinsDay: todayKey(), spins: 0, tryOnMonth: monthKey(), tryOns: 0 });

function makeCode(): string {
  const abc = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 6; i++) s += abc[Math.floor(Math.random() * abc.length)];
  return s;
}

// roll counters over when the day / month changes
function current(u: Usage): Usage {
  const t = todayKey();
  const m = monthKey();
  return {
    spinsDay: t,
    spins: u.spinsDay === t ? u.spins : 0,
    tryOnMonth: m,
    tryOns: u.tryOnMonth === m ? u.tryOns : 0,
  };
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      entitlement: undefined,
      usage: freshUsage(),
      referralCode: makeCode(),
      busy: false,
      purchase: async (planId) => {
        set({ busy: true });
        try {
          const entitlement = await purchasePlan(planId);
          set({ entitlement });
          return true;
        } catch {
          return false;
        } finally {
          set({ busy: false });
        }
      },
      restore: async () => {
        set({ busy: true });
        try {
          const entitlement = await restorePurchases();
          if (entitlement) set({ entitlement });
          return !!entitlement;
        } catch {
          return false;
        } finally {
          set({ busy: false });
        }
      },
      cancel: async () => {
        await cancelMockSubscription().catch(() => {});
        set({ entitlement: undefined });
      },
      recordSpin: () => {
        const u = current(get().usage);
        set({ usage: { ...u, spins: u.spins + 1 } });
      },
      recordTryOn: () => {
        const u = current(get().usage);
        set({ usage: { ...u, tryOns: u.tryOns + 1 } });
      },
      devSetPlus: (on) =>
        set({
          entitlement: on
            ? { planId: 'plus_yearly', status: 'active', purchasedAt: Date.now(), renewsAt: Date.now() + 365 * 864e5, source: 'mock' }
            : undefined,
        }),
      devMaxUsage: () =>
        set({ usage: { spinsDay: todayKey(), spins: FREE_LIMITS.spinsPerDay, tryOnMonth: monthKey(), tryOns: FREE_LIMITS.tryOnsPerMonth } }),
      devResetUsage: () => set({ usage: freshUsage() }),
      // keeps the (mock) store receipt on purpose — "restore purchases" still works after a wipe
      resetAll: () => set({ entitlement: undefined, usage: freshUsage() }),
    }),
    {
      name: 'outfitspin-subscription',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ entitlement: s.entitlement, usage: s.usage, referralCode: s.referralCode }),
    },
  ),
);

/** Derived entitlement + remaining free quota. Use this in screens. */
export function useEntitlements() {
  const entitlement = useSubscriptionStore((s) => s.entitlement);
  const rawUsage = useSubscriptionStore((s) => s.usage);
  const usage = current(rawUsage);
  const isPlus = !!entitlement;
  const limits = isPlus ? PLUS_LIMITS : FREE_LIMITS;
  return {
    isPlus,
    entitlement,
    limits,
    usage,
    spinsLeft: Math.max(0, limits.spinsPerDay - usage.spins),
    tryOnsLeft: Math.max(0, limits.tryOnsPerMonth - usage.tryOns),
  };
}

/** Non-hook check for use inside event handlers / services-facing hooks. */
export function entitlementSnapshot() {
  const s = useSubscriptionStore.getState();
  const usage = current(s.usage);
  const isPlus = !!s.entitlement;
  const limits = isPlus ? PLUS_LIMITS : FREE_LIMITS;
  return {
    isPlus,
    limits,
    spinsLeft: Math.max(0, limits.spinsPerDay - usage.spins),
    tryOnsLeft: Math.max(0, limits.tryOnsPerMonth - usage.tryOns),
  };
}
