import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { UIcon, IconName } from './icons';
import { Springy } from './Springy';
import { colors, radii } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

type Variant = 'primary' | 'secondary' | 'mint' | 'ghost' | 'outline';
type Size = 'sm' | 'md' | 'lg';

const PADS: Record<Size, { v: number; h: number }> = { sm: { v: 10, h: 16 }, md: { v: 13, h: 22 }, lg: { v: 16, h: 28 } };
const FONTS: Record<Size, number> = { sm: 14, md: 15.5, lg: 17 };

const VARIANTS: Record<Variant, { bg: string; fg: string; bd: string }> = {
  primary: { bg: colors.punch, fg: '#fff', bd: 'transparent' },
  secondary: { bg: colors.grape, fg: '#fff', bd: 'transparent' },
  mint: { bg: colors.mint, fg: colors.mintInk, bd: 'transparent' },
  ghost: { bg: colors.punchSoft, fg: colors.punch, bd: 'transparent' },
  outline: { bg: 'transparent', fg: colors.plum, bd: colors.plum },
};

interface SButtonProps {
  variant?: Variant;
  size?: Size;
  icon?: IconName;
  full?: boolean;
  disabled?: boolean;
  loading?: boolean;
  onPress?: () => void;
  children: React.ReactNode;
}

export function SButton({ variant = 'primary', size = 'md', icon, full, disabled, loading, onPress, children }: SButtonProps) {
  const v = VARIANTS[variant];
  const fontSize = FONTS[size];
  return (
    <Springy
      onPress={onPress}
      disabled={disabled || loading}
      style={{
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
        backgroundColor: v.bg, borderWidth: 2, borderColor: v.bd, borderRadius: radii.pill,
        paddingVertical: PADS[size].v, paddingHorizontal: PADS[size].h,
        alignSelf: full ? 'stretch' : 'flex-start',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {loading ? (
        <ActivityIndicator size="small" color={v.fg} />
      ) : icon ? (
        <UIcon name={icon} size={fontSize + 3} color={v.fg} stroke={2.4} />
      ) : null}
      <Text style={{ fontFamily: fonts.display800, fontSize, letterSpacing: -0.15, color: v.fg }}>{children}</Text>
      {full ? <View /> : null}
    </Springy>
  );
}
