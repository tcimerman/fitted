import React from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EnterIn, Garment, SButton } from '@/components/sorbet';
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
        <Text style={{ fontFamily: fonts.display800, fontSize: 64, letterSpacing: -2.2, color: colors.plum, lineHeight: 66 }}>
          fit<Text style={{ color: colors.punch }}>t</Text>ed
        </Text>
        <Text style={{ fontFamily: fonts.display600, fontSize: 24, color: colors.plum, marginTop: 10 }}>
          your fit, but make it fun.
        </Text>
        <Text style={[type.bodyMuted, { fontSize: 16, lineHeight: 24, marginTop: 14, maxWidth: 300 }]}>
          the wardrobe helper that picks what to wear, every single day — from clothes you already own.
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
        <SButton variant="primary" size="lg" full icon="bolt" onPress={next}>
          let&apos;s get you fitted
        </SButton>
      </View>
    </View>
  );
}
