// Sorbet motion: springy, never sluggish.
// Enter: scale 0.9→1 + fade, ~240ms. Tap: press to 0.96, release with overshoot.
import { WithSpringConfig, WithTimingConfig } from 'react-native-reanimated';

export const springEnter: WithSpringConfig = { damping: 14, stiffness: 220, mass: 0.8 };
export const springPress: WithSpringConfig = { damping: 12, stiffness: 400, mass: 0.6 };
export const springBouncy: WithSpringConfig = { damping: 10, stiffness: 180, mass: 0.9 };
export const fadeTiming: WithTimingConfig = { duration: 240 };

export const PRESS_SCALE = 0.96;
