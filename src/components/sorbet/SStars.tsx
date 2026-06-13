import React from 'react';
import { View } from 'react-native';
import { UIcon } from './icons';
import { colors } from '@/theme/tokens';

export function SStars({ n = 5, of = 5, size = 16 }: { n?: number; of?: number; size?: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {Array.from({ length: of }).map((_, i) => (
        <UIcon key={i} name="star" size={size} color={i < n ? colors.lemon : colors.rule} stroke={2} fill={i < n} />
      ))}
    </View>
  );
}
