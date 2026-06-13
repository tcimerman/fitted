import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { GenderPresentation, UserProfile } from '@/types';

export const ONBOARDING_STEPS = [
  'index', 'email', 'name', 'style', 'location', 'body-photos', 'face-photo', 'wardrobe', 'done',
] as const;
export type OnboardingStep = (typeof ONBOARDING_STEPS)[number];

interface ProfileState {
  profile: UserProfile;
  onboardingCompleted: boolean;
  onboardingStep: number;
  hasHydrated: boolean;
  setProfile: (patch: Partial<UserProfile>) => void;
  setBodyPhoto: (key: 'front' | 'side' | 'back', uri: string) => void;
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
      setOnboardingStep: (step) => set({ onboardingStep: step }),
      completeOnboarding: () => set({ onboardingCompleted: true, onboardingStep: 0 }),
      resetAll: () => set({ profile: emptyProfile(), onboardingCompleted: false, onboardingStep: 0 }),
    }),
    {
      name: 'fitted-profile',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ profile: s.profile, onboardingCompleted: s.onboardingCompleted, onboardingStep: s.onboardingStep }),
      onRehydrateStorage: () => () => {
        useProfileStore.setState({ hasHydrated: true });
      },
    },
  ),
);
