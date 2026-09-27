// "plus" pill — grape→punch gradient with a crown. Marks paid features / Plus members.
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Text } from 'react-native';
import { UIcon } from './icons';
import { colors } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

export function SPlusBadge({ label = 'plus', size = 'md' }: { label?: string; size?: 'sm' | 'md' }) {
  const sm = size === 'sm';
  return (
    <LinearGradient
      colors={[colors.grape, colors.punch]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', borderRadius: 999, paddingVertical: sm ? 3 : 5, paddingHorizontal: sm ? 8 : 11 }}
    >
      <UIcon name="crown" size={sm ? 11 : 13} color="#fff" stroke={2.4} />
      <Text style={{ fontFamily: fonts.body800, fontSize: sm ? 10.5 : 12, color: '#fff', letterSpacing: 0.2 }}>{label}</Text>
    </LinearGradient>
  );
}
