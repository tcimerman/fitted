import React from 'react';
import { Text, View } from 'react-native';
import { StepScaffold } from '@/components/onboarding/StepScaffold';
import { useOnboardingNav } from '@/components/onboarding/useOnboardingNav';
import { SChip } from '@/components/sorbet';
import { useProfileStore } from '@/store/useProfileStore';
import { GenderPresentation } from '@/types';
import { type } from '@/theme/typography';

const PRESENTATIONS: { key: GenderPresentation; label: string }[] = [
  { key: 'feminine', label: 'feminine' },
  { key: 'masculine', label: 'masculine' },
  { key: 'androgynous', label: 'androgynous' },
  { key: 'unspecified', label: 'surprise me' },
];

const STYLES = ['casual', 'business', 'streetwear', 'elegant', 'sporty', 'boho', 'edgy', 'classic', 'romantic'];

export default function StyleStep() {
  const { next } = useOnboardingNav('style');
  const profile = useProfileStore((s) => s.profile);
  const setProfile = useProfileStore((s) => s.setProfile);
  const [presentation, setPresentation] = React.useState<GenderPresentation>(profile.genderPresentation);
  const [styles, setStyles] = React.useState<string[]>(profile.preferredStyles);

  const toggleStyle = (s: string) =>
    setStyles((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]));

  return (
    <StepScaffold
      kicker="your vibe"
      title="how do you like to dress?"
      body="this shapes what the stylist reaches for. you can change it anytime in settings."
      ctaLabel="next"
      ctaDisabled={styles.length === 0}
      onNext={() => {
        setProfile({ genderPresentation: presentation, preferredStyles: styles });
        next();
      }}
    >
      <Text style={[type.label, { marginBottom: 10 }]}>I lean…</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 26 }}>
        {PRESENTATIONS.map((p) => (
          <SChip key={p.key} active={presentation === p.key} tone="grape" onPress={() => setPresentation(p.key)}>
            {p.label}
          </SChip>
        ))}
      </View>
      <Text style={[type.label, { marginBottom: 10 }]}>my styles (pick at least one)</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {STYLES.map((s) => (
          <SChip key={s} active={styles.includes(s)} onPress={() => toggleStyle(s)}>
            {s}
          </SChip>
        ))}
      </View>
    </StepScaffold>
  );
}
