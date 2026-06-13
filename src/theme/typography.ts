// Gabarito (display, lowercase headlines) × Hanken Grotesk (body/UI)
import { TextStyle } from 'react-native';
import { colors } from './tokens';

export const fonts = {
  display500: 'Gabarito_500Medium',
  display600: 'Gabarito_600SemiBold',
  display700: 'Gabarito_700Bold',
  display800: 'Gabarito_800ExtraBold',
  display900: 'Gabarito_900Black',
  body400: 'HankenGrotesk_400Regular',
  body500: 'HankenGrotesk_500Medium',
  body600: 'HankenGrotesk_600SemiBold',
  body700: 'HankenGrotesk_700Bold',
  body800: 'HankenGrotesk_800ExtraBold',
} as const;

export const type = {
  hero: { fontFamily: fonts.display800, fontSize: 44, letterSpacing: -1.3, lineHeight: 46, color: colors.plum } as TextStyle,
  h1: { fontFamily: fonts.display800, fontSize: 27, letterSpacing: -0.5, color: colors.plum } as TextStyle,
  h2: { fontFamily: fonts.display800, fontSize: 24, letterSpacing: -0.5, color: colors.plum } as TextStyle,
  h3: { fontFamily: fonts.display700, fontSize: 20, letterSpacing: -0.3, color: colors.plum } as TextStyle,
  displaySub: { fontFamily: fonts.display600, fontSize: 21, lineHeight: 28, color: colors.plum } as TextStyle,
  body: { fontFamily: fonts.body400, fontSize: 15, lineHeight: 22, color: colors.plum } as TextStyle,
  bodyMuted: { fontFamily: fonts.body400, fontSize: 15, lineHeight: 22, color: colors.muted } as TextStyle,
  bodyBold: { fontFamily: fonts.body700, fontSize: 15, color: colors.plum } as TextStyle,
  label: { fontFamily: fonts.body700, fontSize: 13, color: colors.plum } as TextStyle,
  small: { fontFamily: fonts.body600, fontSize: 12.5, color: colors.muted } as TextStyle,
  kicker: {
    fontFamily: fonts.body800, fontSize: 12, letterSpacing: 1.8, textTransform: 'uppercase', color: colors.punch,
  } as TextStyle,
  overline: {
    fontFamily: fonts.body700, fontSize: 12, letterSpacing: 0.5, textTransform: 'uppercase', color: colors.muted,
  } as TextStyle,
} as const;
