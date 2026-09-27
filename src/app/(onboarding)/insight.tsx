// "Aha" #1 — personalised payoff from the quiz (Cal AI-style comparison bars).
import React from 'react';
import { Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withSpring } from 'react-native-reanimated';
import { goalTitle, hoursSavedPerYear } from '@/components/onboarding/quiz';
import { StepScaffold } from '@/components/onboarding/StepScaffold';
import { useOnboardingNav } from '@/components/onboarding/useOnboardingNav';
import { SWordmark } from '@/components/sorbet';
import { useProfileStore } from '@/store/useProfileStore';
import { colors, radii, shadow } from '@/theme/tokens';
import { fonts, type } from '@/theme/typography';

const BAR_H = 170;

function Bar({ minutes, max, color, label, delay }: { minutes: number; max: number; color: string; label: React.ReactNode; delay: number }) {
  const t = useSharedValue(0);
  React.useEffect(() => {
    t.set(withDelay(delay, withSpring(1, { damping: 14, stiffness: 120 })));
  }, [delay, t]);
  const h = Math.max(26, (minutes / max) * BAR_H);
  const anim = useAnimatedStyle(() => ({ height: h * t.get() }));
  return (
    <View style={{ flex: 1, alignItems: 'center', gap: 10 }}>
      <View style={{ height: BAR_H, justifyContent: 'flex-end', width: '100%', alignItems: 'center' }}>
        <Animated.View style={[{ width: '78%', borderRadius: 16, backgroundColor: color, alignItems: 'center', justifyContent: 'flex-start', paddingTop: 8, overflow: 'hidden' }, anim]}>
          <Text style={{ fontFamily: fonts.display800, fontSize: 16, color: '#fff' }}>{minutes}m</Text>
        </Animated.View>
      </View>
      {label}
    </View>
  );
}

export default function InsightStep() {
  const { next } = useOnboardingNav('insight');
  const quiz = useProfileStore((s) => s.profile.quiz);
  const name = useProfileStore((s) => s.profile.name);
  const minutes = quiz?.morningMinutes ?? 10;
  const hours = hoursSavedPerYear(quiz);
  const topGoal = quiz?.goals?.[0];

  return (
    <StepScaffold
      kicker={name ? `made for you, ${name}` : 'made for you'}
      title={`${hours} hours a year back in your pocket`}
      body={`that’s what a ${minutes}-minute outfit crisis costs you. with a daily spin it’s about 2 minutes${topGoal ? ` — and you’ll ${goalTitle(topGoal)}` : ''}.`}
      ctaLabel="love that — continue"
      onNext={() => next()}
    >
      <View style={[{ backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.rule, borderRadius: radii.card, padding: 20, paddingBottom: 18 }, shadow('sm')]}>
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <Bar
            minutes={minutes}
            max={Math.max(minutes, 10)}
            color={colors.muted}
            delay={100}
            label={<Text style={[type.label, { color: colors.muted }]}>on your own</Text>}
          />
          <Bar minutes={2} max={Math.max(minutes, 10)} color={colors.punch} delay={350} label={<SWordmark size={15} />} />
        </View>
        <Text style={[type.small, { textAlign: 'center', marginTop: 14 }]}>minutes spent picking an outfit, per morning</Text>
      </View>
    </StepScaffold>
  );
}
