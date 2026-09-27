import React from 'react';
import { View } from 'react-native';
import { QuizOption } from '@/components/onboarding/QuizOption';
import { STRUGGLE_OPTIONS } from '@/components/onboarding/quiz';
import { StepScaffold } from '@/components/onboarding/StepScaffold';
import { useOnboardingNav } from '@/components/onboarding/useOnboardingNav';
import { useProfileStore } from '@/store/useProfileStore';
import { QuizAnswers } from '@/types';

export default function StruggleStep() {
  const { next } = useOnboardingNav('struggle');
  const saved = useProfileStore((s) => s.profile.quiz?.nothingToWear);
  const setQuiz = useProfileStore((s) => s.setQuiz);
  const [value, setValue] = React.useState<QuizAnswers['nothingToWear']>(saved);
  return (
    <StepScaffold
      kicker="quick quiz · 2 of 3"
      title="how often do you think “i have nothing to wear”?"
      body="no judgement. we’ve all stared into a full closet."
      ctaLabel="next"
      ctaDisabled={!value}
      onNext={() => {
        setQuiz({ nothingToWear: value });
        next();
      }}
    >
      <View style={{ gap: 10 }}>
        {STRUGGLE_OPTIONS.map((o) => (
          <QuizOption key={o.key} emoji={o.emoji} title={o.title} sub={o.sub} selected={value === o.key} onPress={() => setValue(o.key)} />
        ))}
      </View>
    </StepScaffold>
  );
}
