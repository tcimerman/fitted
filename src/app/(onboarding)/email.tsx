import React from 'react';
import { StepScaffold } from '@/components/onboarding/StepScaffold';
import { useOnboardingNav } from '@/components/onboarding/useOnboardingNav';
import { SInput } from '@/components/sorbet';
import { useProfileStore } from '@/store/useProfileStore';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function EmailStep() {
  const { next } = useOnboardingNav('email');
  const profile = useProfileStore((s) => s.profile);
  const setProfile = useProfileStore((s) => s.setProfile);
  const [email, setEmail] = React.useState(profile.email);
  const valid = EMAIL_RE.test(email.trim());
  return (
    <StepScaffold
      kicker="01 · the basics"
      title="what's your email?"
      body="we keep everything on your phone — this is just so your closet has a name on the door."
      ctaLabel="next"
      ctaDisabled={!valid}
      onNext={() => {
        setProfile({ email: email.trim() });
        next();
      }}
    >
      <SInput
        icon="mail"
        placeholder="you@example.com"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        autoFocus
      />
    </StepScaffold>
  );
}
