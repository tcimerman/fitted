import React from 'react';
import { View } from 'react-native';
import { QuizOption } from '@/components/onboarding/QuizOption';
import { ONBOARDING_GOALS } from '@/components/onboarding/quiz';
import { StepScaffold } from '@/components/onboarding/StepScaffold';
import { useOnboardingNav } from '@/components/onboarding/useOnboardingNav';
import { useProfileStore } from '@/store/useProfileStore';

export default function GoalsStep() {
  const { next } = useOnboardingNav('goals');
  const saved = useProfileStore((s) => s.profile.quiz?.goals ?? []);
  const setQuiz = useProfileStore((s) => s.setQuiz);
  const [goals, setGoals] = React.useState<string[]>(saved);
  const toggle = (k: string) => setGoals((cur) => (cur.includes(k) ? cur.filter((x) => x !== k) : [...cur, k]));
  return (
    <StepScaffold
      kicker="quick quiz · 1 of 3"
      title="what would make your mornings better?"
      body="pick all that apply — your stylist tunes itself to this."
      ctaLabel={goals.length ? 'next' : 'pick at least one'}
      ctaDisabled={goals.length === 0}
      onNext={() => {
        setQuiz({ goals });
        next();
      }}
    >
      <View style={{ gap: 10 }}>
        {ONBOARDING_GOALS.map((g) => (
          <QuizOption key={g.key} multi emoji={g.emoji} title={g.title} sub={g.sub} selected={goals.includes(g.key)} onPress={() => toggle(g.key)} />
        ))}
      </View>
    </StepScaffold>
  );
}
