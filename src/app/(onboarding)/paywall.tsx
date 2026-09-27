// Onboarding paywall (soft: closable, "continue with the free plan").
import React from 'react';
import { useOnboardingNav } from '@/components/onboarding/useOnboardingNav';
import { PaywallView } from '@/components/paywall/PaywallView';

export default function OnboardingPaywall() {
  const { next } = useOnboardingNav('paywall');
  return <PaywallView reason="onboarding" onDone={() => next({ replace: true })} />;
}
