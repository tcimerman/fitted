import React from 'react';
import { Text, View } from 'react-native';
import { Image } from 'expo-image';
import { colors } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

type Tone = 'grape' | 'punch' | 'mint' | 'lemon';

export function SAvatar({ letter = 'f', tone = 'grape', size = 44, uri }: { letter?: string; tone?: Tone; size?: number; uri?: string }) {
  if (uri) {
    return <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2 }} contentFit="cover" />;
  }
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: colors[tone], alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontFamily: fonts.display800, fontSize: size * 0.42, color: '#fff' }}>{letter}</Text>
    </View>
  );
}
