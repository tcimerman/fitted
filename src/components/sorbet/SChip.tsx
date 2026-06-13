import React from 'react';
import { Text } from 'react-native';
import { Springy } from './Springy';
import { colors, radii } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

type Tone = 'punch' | 'grape' | 'mint' | 'lemon' | 'plum';

interface SChipProps {
  children: React.ReactNode;
  active?: boolean;
  tone?: Tone;
  onPress?: () => void;
}

export function SChip({ children, active, tone = 'punch', onPress }: SChipProps) {
  const c = colors[tone] ?? colors.punch;
  return (
    <Springy
      onPress={onPress}
      style={{
        paddingVertical: 9, paddingHorizontal: 16, borderRadius: radii.chip,
        backgroundColor: active ? c : colors.white,
        borderWidth: 1.5, borderColor: active ? c : colors.rule,
      }}
    >
      <Text style={{ fontFamily: active ? fonts.body700 : fonts.body600, fontSize: 13.5, color: active ? '#fff' : colors.muted }}>
        {children}
      </Text>
    </Springy>
  );
}
