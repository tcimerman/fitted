import React from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';
import { UIcon, IconName } from './icons';
import { colors, radii } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

interface SInputProps extends TextInputProps {
  label?: string;
  icon?: IconName;
  pill?: boolean;
}

export function SInput({ label, icon, pill, style, ...rest }: SInputProps) {
  return (
    <View style={{ gap: 7 }}>
      {label ? <Text style={{ fontFamily: fonts.body700, fontSize: 13, color: colors.plum }}>{label}</Text> : null}
      <View
        style={{
          flexDirection: 'row', alignItems: 'center', gap: 10,
          backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.rule,
          borderRadius: pill ? radii.pill : radii.field, paddingHorizontal: 16, paddingVertical: 2,
        }}
      >
        {icon ? <UIcon name={icon} size={19} color={colors.muted} /> : null}
        <TextInput
          placeholderTextColor={colors.muted}
          selectionColor={colors.punch}
          style={[{ flex: 1, fontFamily: fonts.body600, fontSize: 15, color: colors.plum, paddingVertical: 13 }, style]}
          {...rest}
        />
      </View>
    </View>
  );
}
