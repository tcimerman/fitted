import React from 'react';
import { Pressable } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { colors } from '@/theme/tokens';
import { springPress } from '@/theme/motion';
import { hapticTap } from '@/utils/feedback';

export function SToggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  const knob = useAnimatedStyle(() => ({
    transform: [{ translateX: withSpring(value ? 22 : 0, springPress) }],
  }));
  return (
    <Pressable
      onPress={() => {
        hapticTap();
        onChange(!value);
      }}
      style={{ width: 52, height: 30, borderRadius: 999, padding: 3, backgroundColor: value ? colors.mint : colors.rule }}
    >
      <Animated.View
        style={[
          { width: 24, height: 24, borderRadius: 12, backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 5, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
          knob,
        ]}
      />
    </Pressable>
  );
}
