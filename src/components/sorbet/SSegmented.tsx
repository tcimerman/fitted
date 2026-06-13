import React from 'react';
import { Text, View } from 'react-native';
import { Springy } from './Springy';
import { colors, radii, shadow } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

interface SSegmentedProps {
  options: string[];
  index: number;
  onChange: (i: number) => void;
}

export function SSegmented({ options, index, onChange }: SSegmentedProps) {
  return (
    <View style={{ flexDirection: 'row', alignSelf: 'flex-start', backgroundColor: colors.petalDeep, borderRadius: radii.pill, padding: 4, gap: 2 }}>
      {options.map((o, i) => (
        <Springy
          key={o}
          onPress={() => onChange(i)}
          style={[
            { paddingVertical: 9, paddingHorizontal: 20, borderRadius: radii.pill, backgroundColor: i === index ? colors.white : 'transparent' },
            i === index ? shadow('sm') : null,
          ] as any}
        >
          <Text style={{ fontFamily: fonts.body700, fontSize: 14, color: i === index ? colors.punch : colors.muted }}>{o}</Text>
        </Springy>
      ))}
    </View>
  );
}
