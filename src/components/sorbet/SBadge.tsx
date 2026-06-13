import React from 'react';
import { Text, View } from 'react-native';
import { UIcon, IconName } from './icons';
import { colors } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

type Tone = 'mint' | 'punch' | 'grape' | 'lemon' | 'neutral';

const MAP: Record<Tone, { bg: string; fg: string }> = {
  mint: { bg: colors.mintSoft, fg: colors.mintDeep },
  punch: { bg: colors.punchSoft, fg: colors.punch },
  grape: { bg: colors.grapeSoft, fg: colors.grape },
  lemon: { bg: colors.lemonSoft, fg: colors.lemonInk },
  neutral: { bg: colors.petalDeep, fg: colors.muted },
};

export function SBadge({ children, tone = 'mint', icon }: { children: React.ReactNode; tone?: Tone; icon?: IconName }) {
  const m = MAP[tone];
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, alignSelf: 'flex-start', backgroundColor: m.bg, borderRadius: 999, paddingVertical: 5, paddingHorizontal: 11 }}>
      {icon ? <UIcon name={icon} size={13} color={m.fg} stroke={2.4} /> : null}
      <Text style={{ fontFamily: fonts.body700, fontSize: 12, color: m.fg }}>{children}</Text>
    </View>
  );
}
