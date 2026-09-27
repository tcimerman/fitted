import React from 'react';
import { View } from 'react-native';
import { PhotoSlot } from '@/components/onboarding/PhotoSlot';
import { StepScaffold } from '@/components/onboarding/StepScaffold';
import { useOnboardingNav } from '@/components/onboarding/useOnboardingNav';
import { toast } from '@/components/sorbet';
import { storeProfilePhoto } from '@/services/images';
import { useProfileStore } from '@/store/useProfileStore';

const SLOTS = [
  { key: 'front', label: 'from the front' },
  { key: 'side', label: 'side profile' },
  { key: 'back', label: 'from the back' },
] as const;

export default function BodyPhotosStep() {
  const { next } = useOnboardingNav('body-photos');
  const bodyPhotos = useProfileStore((s) => s.profile.bodyPhotos);
  const setBodyPhoto = useProfileStore((s) => s.setBodyPhoto);

  const handlePicked = async (key: 'front' | 'side' | 'back', sourceUri: string) => {
    try {
      const stored = await storeProfilePhoto(sourceUri, key);
      setBodyPhoto(key, stored);
    } catch {
      toast("couldn't save that photo — try again", 'punch', 'x');
    }
  };

  const count = Object.values(bodyPhotos).filter(Boolean).length;

  return (
    <StepScaffold
      kicker="your fit model: you"
      title="show us your angles"
      body="front, side, and back — these power the magic try-on, where you see yourself wearing the outfit before you commit. photos stay on your phone."
      ctaLabel={count > 0 ? 'next' : 'add at least the front'}
      ctaDisabled={!bodyPhotos.front}
      onNext={() => next()}
      skipLabel="skip — no try-on for now"
      onSkip={() => next()}
    >
      <View style={{ flexDirection: 'row', gap: 12 }}>
        {SLOTS.map((s) => (
          <PhotoSlot key={s.key} label={s.label} uri={bodyPhotos[s.key]} onPicked={(uri) => void handlePicked(s.key, uri)} />
        ))}
      </View>
    </StepScaffold>
  );
}
