import React from 'react';
import { Text, View } from 'react-native';
import { StepScaffold } from '@/components/onboarding/StepScaffold';
import { useOnboardingNav } from '@/components/onboarding/useOnboardingNav';
import { SInput, UIcon } from '@/components/sorbet';
import { useProfileStore } from '@/store/useProfileStore';
import { colors } from '@/theme/tokens';
import { type } from '@/theme/typography';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function EmailStep() {
  const { next } = useOnboardingNav('email');
  const profile = useProfileStore((s) => s.profile);
  const setProfile = useProfileStore((s) => s.setProfile);
  const [email, setEmail] = React.useState(profile.email);
  const valid = EMAIL_RE.test(email.trim());
  const submit = () => {
    if (!valid) return;
    setProfile({ email: email.trim() });
    next();
  };
  return (
    <StepScaffold
      kicker="save your style profile"
      title="where should we send it?"
      body="we’ll email your style profile and a heads-up before any trial ends. no spam, pinky promise."
      ctaLabel="save & continue"
      ctaDisabled={!valid}
      onNext={submit}
      skipLabel="skip for now"
      onSkip={() => next()}
    >
      <SInput
        icon="mail"
        placeholder="you@example.com"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        returnKeyType="next"
        onSubmitEditing={submit}
        autoFocus
      />
      <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', marginTop: 14 }}>
        <UIcon name="lock" size={15} color={colors.muted} />
        <Text style={[type.small, { flex: 1 }]}>your closet and photos stay on this phone.</Text>
      </View>
    </StepScaffold>
  );
}
