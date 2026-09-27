// Big tappable answer card for onboarding quiz steps: emoji + title + sub,
// punch border + check when selected (single- or multi-select).
import React from 'react';
import { Text, View } from 'react-native';
import { Springy, UIcon } from '@/components/sorbet';
import { colors, radii } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

interface QuizOptionProps {
  emoji: string;
  title: string;
  sub?: string;
  selected: boolean;
  multi?: boolean;
  onPress: () => void;
}

export function QuizOption({ emoji, title, sub, selected, multi, onPress }: QuizOptionProps) {
  return (
    <Springy
      onPress={onPress}
      accessibilityRole={multi ? 'checkbox' : 'radio'}
      accessibilityState={{ checked: selected }}
      accessibilityLabel={title}
      style={{
        flexDirection: 'row', alignItems: 'center', gap: 14,
        backgroundColor: selected ? colors.punchSoft : colors.white,
        borderWidth: 2, borderColor: selected ? colors.punch : colors.rule,
        borderRadius: radii.tile, paddingVertical: 14, paddingHorizontal: 16,
      }}
    >
      <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: selected ? colors.white : colors.petalDeep, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 22 }}>{emoji}</Text>
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={{ fontFamily: fonts.body700, fontSize: 15.5, color: colors.plum }}>{title}</Text>
        {sub ? <Text style={{ fontFamily: fonts.body400, fontSize: 13, color: colors.muted, marginTop: 1 }}>{sub}</Text> : null}
      </View>
      <View
        style={{
          width: 24, height: 24, borderRadius: multi ? 8 : 12, borderWidth: 2,
          borderColor: selected ? colors.punch : colors.rule, backgroundColor: selected ? colors.punch : 'transparent',
          alignItems: 'center', justifyContent: 'center',
        }}
      >
        {selected ? <UIcon name="check" size={14} color="#fff" stroke={2.8} /> : null}
      </View>
    </Springy>
  );
}
