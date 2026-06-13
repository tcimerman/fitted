import React from 'react';
import { StepScaffold } from '@/components/onboarding/StepScaffold';
import { useOnboardingNav } from '@/components/onboarding/useOnboardingNav';
import { SInput } from '@/components/sorbet';
import { useProfileStore } from '@/store/useProfileStore';

export default function NameStep() {
  const { next } = useOnboardingNav('name');
  const profile = useProfileStore((s) => s.profile);
  const setProfile = useProfileStore((s) => s.setProfile);
  const [name, setName] = React.useState(profile.name);
  return (
    <StepScaffold
      kicker="02 · the basics"
      title="what should we call you?"
      body="first name, nickname, alter ego — whatever feels right."
      ctaLabel="next"
      ctaDisabled={name.trim().length < 1}
      onNext={() => {
        setProfile({ name: name.trim() });
        next();
      }}
    >
      <SInput icon="user" placeholder="your name" value={name} onChangeText={setName} autoCapitalize="words" autoFocus />
    </StepScaffold>
  );
}
