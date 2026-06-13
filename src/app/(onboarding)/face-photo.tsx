import React from 'react';
import { View } from 'react-native';
import { PhotoSlot } from '@/components/onboarding/PhotoSlot';
import { StepScaffold } from '@/components/onboarding/StepScaffold';
import { useOnboardingNav } from '@/components/onboarding/useOnboardingNav';
import { toast } from '@/components/sorbet';
import { storeProfilePhoto } from '@/services/images';
import { useProfileStore } from '@/store/useProfileStore';

export default function FacePhotoStep() {
  const { next } = useOnboardingNav('face-photo');
  const facePhotoUri = useProfileStore((s) => s.profile.facePhotoUri);
  const setProfile = useProfileStore((s) => s.setProfile);

  const handlePicked = async (sourceUri: string) => {
    try {
      const stored = await storeProfilePhoto(sourceUri, 'face');
      setProfile({ facePhotoUri: stored });
    } catch {
      toast("couldn't save that photo — try again", 'punch', 'x');
    }
  };

  return (
    <StepScaffold
      kicker="06 · say cheese"
      title="now your face"
      body="a clear, well-lit selfie keeps the try-on looking like you — not your distant cousin."
      ctaLabel="next"
      ctaDisabled={!facePhotoUri}
      onNext={next}
      skipLabel="skip for now"
      onSkip={next}
    >
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1 }} />
        <View style={{ flex: 2 }}>
          <PhotoSlot label="your face, front-on" uri={facePhotoUri} aspect={0.9} onPicked={(uri) => void handlePicked(uri)} />
        </View>
        <View style={{ flex: 1 }} />
      </View>
    </StepScaffold>
  );
}
