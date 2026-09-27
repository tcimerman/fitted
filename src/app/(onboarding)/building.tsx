// Labor-illusion loader between the quiz and the plan (Noom / Cal AI pattern).
import React from 'react';
import { Text, View } from 'react-native';
import { useOnboardingNav } from '@/components/onboarding/useOnboardingNav';
import { EnterIn, SProgress, UIcon } from '@/components/sorbet';
import { colors } from '@/theme/tokens';
import { fonts, type } from '@/theme/typography';

const STEPS = ['reading your vibe', 'checking your forecast', 'sorting your closet', 'tuning your stylist'];
const DURATION = 3400;

export default function BuildingStep() {
  const { next } = useOnboardingNav('building');
  const [pct, setPct] = React.useState(0);

  React.useEffect(() => {
    const started = Date.now();
    const t = setInterval(() => {
      const p = Math.min(100, ((Date.now() - started) / DURATION) * 100);
      setPct(p);
      if (p >= 100) clearInterval(t);
    }, 60);
    return () => clearInterval(t);
  }, []);

  React.useEffect(() => {
    if (pct < 100) return;
    const t = setTimeout(() => next({ replace: true }), 450);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pct >= 100]);

  const doneCount = Math.floor((pct / 100) * STEPS.length + 0.001);

  return (
    <View style={{ flex: 1, backgroundColor: colors.petal, paddingHorizontal: 28, justifyContent: 'center' }}>
      <EnterIn>
        <Text style={{ fontFamily: fonts.display900, fontSize: 64, color: colors.plum, letterSpacing: -2 }}>{Math.round(pct)}%</Text>
        <Text style={[type.h2, { marginTop: 4, marginBottom: 18 }]}>building your personal stylist…</Text>
        <SProgress pct={pct} />
        <View style={{ marginTop: 26, gap: 14 }}>
          {STEPS.map((s, i) => {
            const done = i < doneCount;
            return (
              <View key={s} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, opacity: done || i === doneCount ? 1 : 0.4 }}>
                <View style={{ width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: done ? colors.mint : colors.petalDeep }}>
                  {done ? <UIcon name="check" size={14} color="#fff" stroke={2.8} /> : null}
                </View>
                <Text style={{ fontFamily: fonts.body600, fontSize: 15.5, color: colors.plum }}>{s}</Text>
              </View>
            );
          })}
        </View>
      </EnterIn>
    </View>
  );
}
