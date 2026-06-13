// Shared press interaction: scale to 0.96 on press, release with overshoot.
import React from 'react';
import { Pressable, PressableProps, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { PRESS_SCALE, springPress } from '@/theme/motion';
import { hapticTap } from '@/utils/feedback';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface SpringyProps extends PressableProps {
  style?: ViewStyle | ViewStyle[];
  haptic?: boolean;
  children?: React.ReactNode;
}

export function Springy({ style, haptic = true, onPressIn, onPressOut, onPress, ...rest }: SpringyProps) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));
  return (
    <AnimatedPressable
      {...rest}
      style={[style, animStyle]}
      onPressIn={(e) => {
        scale.set(withSpring(PRESS_SCALE, springPress));
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.set(withSpring(1, springPress));
        onPressOut?.(e);
      }}
      onPress={(e) => {
        if (haptic) hapticTap();
        onPress?.(e);
      }}
    />
  );
}

// Enter animation wrapper: scale 0.9→1 + fade, springy
export function EnterIn({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: ViewStyle }) {
  const t = useSharedValue(0);
  React.useEffect(() => {
    const id = setTimeout(() => {
      t.set(withSpring(1, { damping: 14, stiffness: 220, mass: 0.8 }));
    }, delay);
    return () => clearTimeout(id);
  }, [delay, t]);
  const anim = useAnimatedStyle(() => ({
    opacity: t.get(),
    transform: [{ scale: 0.9 + 0.1 * t.get() }],
  }));
  return <Animated.View style={[style, anim]}>{children}</Animated.View>;
}
