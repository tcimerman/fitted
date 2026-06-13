// Sorbet design tokens — ported verbatim from design/project/sorbet-tokens.jsx
import { Platform, ViewStyle } from 'react-native';

export const colors = {
  petal: '#FFF6FB',
  white: '#FFFFFF',
  plum: '#311938',
  ink: '#311938',
  punch: '#FF4D8D',
  grape: '#7A4DFF',
  mint: '#3FD9B0',
  lemon: '#FFD23F',
  muted: '#A07FA0',
  rule: '#F3DCE9',
  line: '#EAD9E6',
  // soft tints (surfaces / fills)
  punchSoft: '#FFE3EE',
  grapeSoft: '#ECE5FF',
  mintSoft: '#DEF7EF',
  lemonSoft: '#FFF1C9',
  petalDeep: '#FCE7F1',
  // dark-on-accent text
  mintInk: '#0C3D30',
  mintDeep: '#0C8763',
  lemonInk: '#9A7A00',
} as const;

export const radii = {
  card: 24,
  tile: 18,
  field: 16,
  pill: 999,
  chip: 999,
} as const;

export const spacing = (n: number) => n * 4;

// Brand shadow "0 14px 34px rgba(122,77,255,.14)" with Android elevation fallback.
export function shadow(size: 'sm' | 'md' | 'fab' = 'md'): ViewStyle {
  if (Platform.OS === 'android') {
    return { elevation: size === 'sm' ? 3 : size === 'fab' ? 8 : 6, shadowColor: colors.grape };
  }
  const map: Record<string, ViewStyle> = {
    md: { shadowColor: colors.grape, shadowOffset: { width: 0, height: 14 }, shadowOpacity: 0.14, shadowRadius: 34 },
    sm: { shadowColor: colors.grape, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.12, shadowRadius: 16 },
    fab: { shadowColor: colors.punch, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.4, shadowRadius: 22 },
  };
  return map[size];
}
