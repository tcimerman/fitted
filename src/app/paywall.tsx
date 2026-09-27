// Contextual soft paywall: /paywall?reason=spins|tryon|closet|planner|profile
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { PaywallView } from '@/components/paywall/PaywallView';
import { PaywallReason } from '@/store/useSubscriptionStore';

const REASONS: PaywallReason[] = ['spins', 'tryon', 'closet', 'planner', 'profile'];

export default function PaywallModal() {
  const router = useRouter();
  const { reason } = useLocalSearchParams<{ reason?: string }>();
  const r = (REASONS.includes(reason as PaywallReason) ? reason : 'profile') as PaywallReason;
  const close = () => (router.canGoBack() ? router.back() : router.replace('/(tabs)' as never));
  return <PaywallView reason={r} onDone={close} />;
}
