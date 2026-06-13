import React from 'react';
import { UIcon, IconName } from './icons';
import { Springy } from './Springy';
import { colors } from '@/theme/tokens';

const TONES = { plum: colors.plum, punch: colors.punch, grape: colors.grape } as const;

interface SIconButtonProps {
  icon?: IconName;
  tone?: keyof typeof TONES;
  filled?: boolean;
  size?: number;
  onPress?: () => void;
}

export function SIconButton({ icon = 'heart', tone = 'plum', filled, size = 46, onPress }: SIconButtonProps) {
  const c = TONES[tone];
  return (
    <Springy
      onPress={onPress}
      style={{
        width: size, height: size, borderRadius: size / 2, alignItems: 'center', justifyContent: 'center',
        backgroundColor: filled ? c : colors.white,
        borderWidth: 1.5, borderColor: filled ? c : colors.rule,
      }}
    >
      <UIcon name={icon} size={size * 0.43} color={filled ? '#fff' : c} stroke={2} fill={filled} />
    </Springy>
  );
}
