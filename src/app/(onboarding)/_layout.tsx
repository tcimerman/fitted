import { Stack, useRouter, useSegments } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useOnboardingNav } from '@/components/onboarding/useOnboardingNav';
import { SIconButton, SProgress } from '@/components/sorbet';
import { BARE_STEPS, ONBOARDING_STEPS, OnboardingStep, useProfileStore } from '@/store/useProfileStore';
import { colors } from '@/theme/tokens';

function Header({ step }: { step: OnboardingStep }) {
  const { back, index } = useOnboardingNav(step);
  // progress runs over the steps that show the header
  const counted = ONBOARDING_STEPS.filter((s) => !BARE_STEPS.includes(s));
  const pos = counted.indexOf(step);
  const pct = ((pos + 1) / counted.length) * 100;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 20, paddingTop: 8, paddingBottom: 2 }}>
      <SIconButton icon="chevronL" size={40} onPress={back} accessibilityLabel="back" disabled={index <= 0} />
      <View style={{ flex: 1 }}>
        <SProgress pct={pct} />
      </View>
    </View>
  );
}

export default function OnboardingLayout() {
  const segments = useSegments();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const savedStep = useProfileStore((s) => s.onboardingStep);

  // resume mid-flow: if the app was killed at step N, jump back there once
  const resumed = React.useRef(false);
  React.useEffect(() => {
    if (resumed.current) return;
    resumed.current = true;
    if (savedStep > 0 && savedStep < ONBOARDING_STEPS.length - 1) {
      const step = ONBOARDING_STEPS[savedStep] === 'building' ? 'plan' : ONBOARDING_STEPS[savedStep];
      router.replace(`/(onboarding)/${step}` as never);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const last = segments[segments.length - 1] as string;
  const current = (ONBOARDING_STEPS.includes(last as OnboardingStep) ? last : 'index') as OnboardingStep;
  const showHeader = !BARE_STEPS.includes(current);

  return (
    <View style={{ flex: 1, backgroundColor: colors.petal, paddingTop: insets.top }}>
      {showHeader ? <Header step={current} /> : null}
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.petal }, animation: 'slide_from_right' }} />
    </View>
  );
}
