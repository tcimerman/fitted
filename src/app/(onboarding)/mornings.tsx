import React from 'react';
import { View } from 'react-native';
import { QuizOption } from '@/components/onboarding/QuizOption';
import { MORNING_OPTIONS } from '@/components/onboarding/quiz';
import { StepScaffold } from '@/components/onboarding/StepScaffold';
import { useOnboardingNav } from '@/components/onboarding/useOnboardingNav';
import { useProfileStore } from '@/store/useProfileStore';

export default function MorningsStep() {
  const { next } = useOnboardingNav('mornings');
  const saved = useProfileStore((s) => s.profile.quiz?.morningMinutes);
  const setQuiz = useProfileStore((s) => s.setQuiz);
  const [value, setValue] = React.useState<number | undefined>(saved);
  return (
    <StepScaffold
      kicker="quick quiz · 3 of 3"
      title="how long does picking an outfit take you?"
      body="on a normal weekday morning, be honest."
      ctaLabel="next"
      ctaDisabled={value == null}
      onNext={() => {
        setQuiz({ morningMinutes: value });
        next();
      }}
    >
      <View style={{ gap: 10 }}>
        {MORNING_OPTIONS.map((o) => (
          <QuizOption key={o.minutes} emoji={o.emoji} title={o.title} sub={o.sub} selected={value === o.minutes} onPress={() => setValue(o.minutes)} />
        ))}
      </View>
    </StepScaffold>
  );
}
