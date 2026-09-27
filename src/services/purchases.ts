// In-app purchases for OutfitSpin Plus.
//
// ┌──────────────────────────────────────────────────────────────────────────┐
// │  MOCK MODE — NO REAL PAYMENTS HAPPEN HERE.                               │
// │  purchasePlan() / restorePurchases() only simulate the App Store / Play  │
// │  flow so the paywall can be clicked through on web and in Expo Go.       │
// │  The fake "store receipt" lives in AsyncStorage under MOCK_RECEIPT_KEY   │
// │  (outside the app's own stores, so "clear all data" + "restore" behaves  │
// │  like a real store account).                                             │
// └──────────────────────────────────────────────────────────────────────────┘
//
// Going live = swap the three functions below for RevenueCat
// (`react-native-purchases`, needs an EAS dev build — not Expo Go):
//
//   import Purchases from 'react-native-purchases';
//   Purchases.configure({ apiKey: Platform.OS === 'ios' ? RC_IOS_KEY : RC_ANDROID_KEY });
//   const offerings = await Purchases.getOfferings();          // → loadPlans()
//   const pkg = offerings.current?.availablePackages.find(p => p.product.identifier === PLANS[id].productId);
//   const { customerInfo } = await Purchases.purchasePackage(pkg); // → purchasePlan()
//   const info = await Purchases.restorePurchases();               // → restorePurchases()
//   const plus = info.entitlements.active[ENTITLEMENT_ID];         // → isActive / expirationDate / periodType === 'TRIAL'
//
// Screens never call this file directly — they go through useSubscriptionStore.
import AsyncStorage from '@react-native-async-storage/async-storage';

export const IS_MOCK_PURCHASES = true;
export const ENTITLEMENT_ID = 'plus';

export type PlanId = 'plus_yearly' | 'plus_monthly';

export interface Plan {
  id: PlanId;
  productId: string; // App Store Connect / Play Console product id
  period: 'year' | 'month';
  price: number; // list price in the store's base currency
  trialDays: number;
}

// Prices: EUR base (Europe) — the same numbers in USD for the US store.
// Real stores return localized priceString; this is only for the mock.
export const PLANS: Record<PlanId, Plan> = {
  plus_yearly: { id: 'plus_yearly', productId: 'outfitspin_plus_yearly', period: 'year', price: 39.99, trialDays: 7 },
  plus_monthly: { id: 'plus_monthly', productId: 'outfitspin_plus_monthly', period: 'month', price: 7.99, trialDays: 0 },
};

const DAY = 24 * 60 * 60 * 1000;

function currencyCode(): 'EUR' | 'USD' {
  try {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale ?? '';
    return /-(US|PR)$/i.test(locale) ? 'USD' : 'EUR';
  } catch {
    return 'EUR';
  }
}

export function formatPrice(amount: number): string {
  const currency = currencyCode();
  try {
    return new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'en-IE', { style: 'currency', currency }).format(amount);
  } catch {
    return `${currency === 'USD' ? '$' : '€'}${amount.toFixed(2)}`;
  }
}

/** Yearly price broken down per month, e.g. "€3.33". */
export const perMonth = (plan: Plan) => formatPrice(plan.period === 'year' ? Math.floor((plan.price / 12) * 100) / 100 : plan.price);

/** How much cheaper yearly is vs 12× monthly, in whole percent. */
export const yearlySavingsPct = () =>
  Math.round((1 - PLANS.plus_yearly.price / (PLANS.plus_monthly.price * 12)) * 100);

export interface Entitlement {
  planId: PlanId;
  status: 'trial' | 'active';
  purchasedAt: number;
  trialEndsAt?: number;
  renewsAt: number;
  source: 'mock' | 'store';
}

const MOCK_RECEIPT_KEY = 'outfitspin-mock-store-receipt';
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** MOCK: pretends to open the native purchase sheet and succeed. */
export async function purchasePlan(planId: PlanId): Promise<Entitlement> {
  const plan = PLANS[planId];
  await sleep(900); // feels like the store sheet
  const now = Date.now();
  const trialEndsAt = plan.trialDays > 0 ? now + plan.trialDays * DAY : undefined;
  const periodMs = plan.period === 'year' ? 365 * DAY : 30 * DAY;
  const ent: Entitlement = {
    planId,
    status: trialEndsAt ? 'trial' : 'active',
    purchasedAt: now,
    trialEndsAt,
    renewsAt: trialEndsAt ?? now + periodMs,
    source: 'mock',
  };
  await AsyncStorage.setItem(MOCK_RECEIPT_KEY, JSON.stringify(ent));
  return ent;
}

/** MOCK: finds the fake receipt written by purchasePlan(). null = nothing to restore. */
export async function restorePurchases(): Promise<Entitlement | null> {
  await sleep(700);
  const raw = await AsyncStorage.getItem(MOCK_RECEIPT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Entitlement;
  } catch {
    return null;
  }
}

/** MOCK: simulates cancelling in the store's subscription settings. */
export async function cancelMockSubscription(): Promise<void> {
  await AsyncStorage.removeItem(MOCK_RECEIPT_KEY);
}

/** Trial timeline dates for the paywall ("today · day 5 · day 7"). */
export function trialTimeline(plan: Plan, from = new Date()) {
  const reminder = new Date(from.getTime() + Math.max(0, plan.trialDays - 2) * DAY);
  const charge = new Date(from.getTime() + plan.trialDays * DAY);
  return { reminder, charge };
}
