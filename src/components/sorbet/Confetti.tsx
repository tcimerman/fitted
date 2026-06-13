// Confetti pop in the four Sorbet accents — reanimated particles, no deps.
import React from 'react';
import { Dimensions, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { colors } from '@/theme/tokens';

const ACCENTS = [colors.punch, colors.grape, colors.mint, colors.lemon];
const COUNT = 36;

// deterministic pseudo-random per index so render is stable
const rand = (i: number, salt: number) => {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

function Particle({ i, run }: { i: number; run: number }) {
  const { width, height } = Dimensions.get('window');
  const t = useSharedValue(0);
  React.useEffect(() => {
    t.set(0);
    t.set(withDelay(rand(i, run) * 200, withTiming(1, { duration: 1400 + rand(i, run + 1) * 700, easing: Easing.out(Easing.quad) })));
  }, [run, i, t]);
  const startX = width / 2;
  const driftX = (rand(i, 2) - 0.5) * width * 1.3;
  const peak = -(120 + rand(i, 3) * 220);
  const fall = height * 0.75;
  const size = 7 + rand(i, 4) * 7;
  const color = ACCENTS[i % ACCENTS.length];
  const round = rand(i, 5) > 0.5;
  const style = useAnimatedStyle(() => {
    const p = t.get();
    // simple ballistic arc: up fast then down
    const y = peak * (1 - (2 * p - 1) * (2 * p - 1)) + fall * p * p;
    return {
      opacity: p < 0.85 ? 1 : (1 - p) / 0.15,
      transform: [
        { translateX: startX + driftX * p - size / 2 },
        { translateY: height * 0.45 + y },
        { rotate: `${p * (rand(i, 6) - 0.5) * 720}deg` },
      ],
    };
  });
  return (
    <Animated.View
      pointerEvents="none"
      style={[{ position: 'absolute', width: size, height: round ? size : size * 0.45, borderRadius: round ? size / 2 : 2, backgroundColor: color }, style]}
    />
  );
}

export function Confetti({ run }: { run: number }) {
  if (run <= 0) return null;
  return (
    <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99 }}>
      {Array.from({ length: COUNT }).map((_, i) => (
        <Particle key={`${run}-${i}`} i={i} run={run} />
      ))}
    </View>
  );
}
