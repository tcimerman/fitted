import React from 'react';
import { Text, View } from 'react-native';
import { UIcon, IconName } from './icons';
import { colors } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

type Tone = 'mint' | 'punch' | 'grape' | 'lemon';

export function SWeatherPill({ tone = 'mint', icon = 'sun', children }: { tone?: Tone; icon?: IconName; children: React.ReactNode }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7, alignSelf: 'flex-start', backgroundColor: colors[tone], borderRadius: 999, paddingVertical: 7, paddingHorizontal: 14 }}>
      <UIcon name={icon} size={15} color="#fff" stroke={2.2} />
      <Text style={{ fontFamily: fonts.body700, fontSize: 13, color: '#fff' }}>{children}</Text>
    </View>
  );
}
