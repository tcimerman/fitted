import React from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EnterIn, Garment, SButton, SWordmark } from '@/components/sorbet';
import { useOnboardingNav } from '@/components/onboarding/useOnboardingNav';
import { colors } from '@/theme/tokens';
import { fonts, type } from '@/theme/typography';

const TILES = [
  { type: 'tee', color: colors.punch },
  { type: 'pants', color: colors.grape },
  { type: 'shoe', color: colors.mint },
  { type: 'tote', color: colors.lemon },
] as const;

export default function Welcome() {
  const { next } = useOnboardingNav('index');
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: colors.petal, paddingHorizontal: 24, justifyContent: 'center' }}>
      <EnterIn>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 26 }}>
          {[colors.punch, colors.grape, colors.mint, colors.lemon].map((c) => (
            <View key={c} style={{ width: 46, height: 14, borderRadius: 999, backgroundColor: c }} />
          ))}
        </View>
        <SWordmark size={54} />
        <Text style={{ fontFamily: fonts.display600, fontSize: 24, color: colors.plum, marginTop: 10 }}>
          spin your closet into a fit.
        </Text>
        <Text style={[type.bodyMuted, { fontSize: 16, lineHeight: 24, marginTop: 14, maxWidth: 310 }]}>
          your ai stylist picks what to wear every day — from clothes you already own, matched to the weather and your plans.
        </Text>
      </EnterIn>
      <EnterIn delay={150}>
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 34 }}>
          {TILES.map((t, i) => (
            <View key={i} style={{ flex: 1, aspectRatio: 1, borderRadius: 18, backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.rule, alignItems: 'center', justifyContent: 'center' }}>
              <Garment type={t.type} color={t.color} size={46} />
            </View>
          ))}
        </View>
      </EnterIn>
      <View style={{ position: 'absolute', left: 24, right: 24, bottom: Math.max(insets.bottom, 16) + 8 }}>
        <SButton variant="primary" size="lg" full icon="bolt" onPress={() => next()}>
          let&apos;s spin my first fit
        </SButton>
        <Text style={[type.small, { textAlign: 'center', marginTop: 12 }]}>takes about 2 minutes · free to start</Text>
      </View>
    </View>
  );
}
