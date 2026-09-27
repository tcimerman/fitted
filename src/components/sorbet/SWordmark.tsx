// OutfitSpin wordmark: lowercase Gabarito, "spin" in punch.
import React from 'react';
import { Text, TextStyle } from 'react-native';
import { colors } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

export function SWordmark({ size = 18, style }: { size?: number; style?: TextStyle }) {
  return (
    <Text
      accessibilityRole="header"
      accessibilityLabel="OutfitSpin"
      style={[{ fontFamily: fonts.display800, fontSize: size, letterSpacing: -size * 0.034, lineHeight: size * 1.04, color: colors.plum }, style]}
    >
      outfit<Text style={{ color: colors.punch }}>spin</Text>
    </Text>
  );
}
