import { useRouter } from 'expo-router';
import { ONBOARDING_STEPS, OnboardingStep, useProfileStore } from '@/store/useProfileStore';

// steps that must never be revisited with "back" (they auto-advance)
const SKIP_ON_BACK: readonly OnboardingStep[] = ['building'];

export function useOnboardingNav(current: OnboardingStep) {
  const router = useRouter();
  const setStep = useProfileStore((s) => s.setOnboardingStep);
  const index = ONBOARDING_STEPS.indexOf(current);

  const go = (i: number, mode: 'push' | 'replace') => {
    const target = ONBOARDING_STEPS[i];
    if (!target) return;
    setStep(i);
    const href = (target === 'index' ? '/(onboarding)' : `/(onboarding)/${target}`) as never;
    if (mode === 'replace') router.replace(href);
    else router.push(href);
  };

  /** Forward one step. `replace` keeps transient steps (loading) out of history. */
  const next = (opts?: { replace?: boolean }) => go(index + 1, opts?.replace ? 'replace' : 'push');

  const back = () => {
    let i = index - 1;
    while (i > 0 && SKIP_ON_BACK.includes(ONBOARDING_STEPS[i])) i--;
    if (i < 0) return;
    setStep(i);
    if (router.canGoBack()) router.back();
    else go(i, 'replace');
  };

  return { next, back, index, total: ONBOARDING_STEPS.length };
}
