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
  const valid = name.trim().length > 0;
  const submit = () => {
    if (!valid) return;
    setProfile({ name: name.trim() });
    next();
  };
  return (
    <StepScaffold
      kicker="nice to meet you"
      title="what should we call you?"
      body="first name, nickname, alter ego — whatever feels right."
      ctaLabel="next"
      ctaDisabled={!valid}
      onNext={submit}
    >
      <SInput
        icon="user"
        placeholder="your name"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        autoComplete="given-name"
        returnKeyType="next"
        onSubmitEditing={submit}
        autoFocus
      />
    </StepScaffold>
  );
}
