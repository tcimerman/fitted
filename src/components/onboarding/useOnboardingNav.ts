import { useRouter } from 'expo-router';
import { ONBOARDING_STEPS, OnboardingStep, useProfileStore } from '@/store/useProfileStore';

export function useOnboardingNav(current: OnboardingStep) {
  const router = useRouter();
  const setStep = useProfileStore((s) => s.setOnboardingStep);
  const index = ONBOARDING_STEPS.indexOf(current);
  const next = () => {
    const target = ONBOARDING_STEPS[index + 1];
    if (!target) return;
    setStep(index + 1);
    router.push(`/(onboarding)/${target}` as never);
  };
  return { next, index, total: ONBOARDING_STEPS.length };
}
