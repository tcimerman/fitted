import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { GenderPresentation, QuizAnswers, UserProfile } from '@/types';

// quiz → personalisation → "aha" (insight + your plan) → email → paywall → done
export const ONBOARDING_STEPS = [
  'index', 'goals', 'struggle', 'mornings', 'style', 'name', 'location', 'insight',
  'body-photos', 'face-photo', 'wardrobe', 'reminder', 'building', 'plan', 'email', 'paywall', 'done',
] as const;
// steps without the back button / progress header
export const BARE_STEPS: readonly OnboardingStep[] = ['index', 'building', 'paywall', 'done'];
export type OnboardingStep = (typeof ONBOARDING_STEPS)[number];

interface ProfileState {
  profile: UserProfile;
  onboardingCompleted: boolean;
  onboardingStep: number;
  hasHydrated: boolean;
  setProfile: (patch: Partial<UserProfile>) => void;
  setBodyPhoto: (key: 'front' | 'side' | 'back', uri: string) => void;
  setQuiz: (patch: Partial<QuizAnswers>) => void;
  setOnboardingStep: (step: number) => void;
  completeOnboarding: () => void;
  resetAll: () => void;
}

const emptyProfile = (): UserProfile => ({
  name: '',
  email: '',
  genderPresentation: 'unspecified' as GenderPresentation,
  preferredStyles: [],
  bodyPhotos: {},
  facePhotoUri: undefined,
  quiz: { goals: [] },
  createdAt: Date.now(),
});

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: emptyProfile(),
      onboardingCompleted: false,
      onboardingStep: 0,
      hasHydrated: false,
      setProfile: (patch) => set((s) => ({ profile: { ...s.profile, ...patch } })),
      setBodyPhoto: (key, uri) =>
        set((s) => ({ profile: { ...s.profile, bodyPhotos: { ...s.profile.bodyPhotos, [key]: uri } } })),
      setQuiz: (patch) =>
        set((s) => ({ profile: { ...s.profile, quiz: { goals: [], ...s.profile.quiz, ...patch } } })),
      setOnboardingStep: (step) => set({ onboardingStep: step }),
      completeOnboarding: () => set({ onboardingCompleted: true, onboardingStep: 0 }),
      resetAll: () => set({ profile: emptyProfile(), onboardingCompleted: false, onboardingStep: 0 }),
    }),
    {
      name: 'fitted-profile', // legacy key from the "fitted" era — renaming it would wipe local profiles
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ profile: s.profile, onboardingCompleted: s.onboardingCompleted, onboardingStep: s.onboardingStep }),
      onRehydrateStorage: () => () => {
        useProfileStore.setState({ hasHydrated: true });
      },
    },
  ),
);
