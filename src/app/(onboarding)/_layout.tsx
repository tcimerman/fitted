import { Stack, useRouter, useSegments } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SProgress } from '@/components/sorbet';
import { ONBOARDING_STEPS, useProfileStore } from '@/store/useProfileStore';
import { colors } from '@/theme/tokens';

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
      router.replace(`/(onboarding)/${ONBOARDING_STEPS[savedStep]}` as never);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const current = segments[segments.length - 1] as string;
  const index = Math.max(0, ONBOARDING_STEPS.indexOf(current as (typeof ONBOARDING_STEPS)[number]));
  const showProgress = index > 0 && current !== 'done';

  return (
    <View style={{ flex: 1, backgroundColor: colors.petal, paddingTop: insets.top }}>
      {showProgress ? (
        <View style={{ paddingHorizontal: 24, paddingTop: 10, paddingBottom: 4 }}>
          <SProgress pct={(index / (ONBOARDING_STEPS.length - 1)) * 100} />
        </View>
      ) : null}
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.petal }, animation: 'slide_from_right' }} />
    </View>
  );
}
