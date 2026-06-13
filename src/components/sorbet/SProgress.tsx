import React from 'react';
import { Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { colors } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

export function SProgress({ pct, label }: { pct: number; label?: string }) {
  const fill = useAnimatedStyle(() => ({ width: withTiming(`${Math.max(0, Math.min(100, pct))}%`, { duration: 300 }) }));
  return (
    <View style={{ width: '100%' }}>
      {label ? (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 7 }}>
          <Text style={{ fontFamily: fonts.body700, fontSize: 13, color: colors.plum }}>{label}</Text>
          <Text style={{ fontFamily: fonts.body700, fontSize: 13, color: colors.grape }}>{Math.round(pct)}%</Text>
        </View>
      ) : null}
      <View style={{ height: 10, backgroundColor: colors.petalDeep, borderRadius: 999, overflow: 'hidden' }}>
        <Animated.View style={[{ height: 10, borderRadius: 999, overflow: 'hidden' }, fill]}>
          <LinearGradient colors={[colors.punch, colors.grape]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flex: 1 }} />
        </Animated.View>
      </View>
    </View>
  );
}
