import { TextStyle } from 'react-native';
import { FontFamily } from './fonts';

export const typography = {
  fontFamily: FontFamily,
  fontSize: {
    xs: 11,
    sm: 13,
    base: 15,
    lg: 17,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeight: {
    tight: 1.1,
    snug: 1.2,
    normal: 1.4,
    relaxed: 1.5,
    loose: 1.625,
  },
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 1.5,
    wider: 2.5,
  },
} as const;

export const textStyles: Record<string, TextStyle> = {
  h1: {
    fontFamily: FontFamily.displayBold,
    fontSize: typography.fontSize['3xl'],
    lineHeight: typography.fontSize['3xl'] * typography.lineHeight.tight,
    color: '#000000',
    letterSpacing: -0.5,
  },
  h2: {
    fontFamily: FontFamily.displayBold,
    fontSize: typography.fontSize['2xl'],
    lineHeight: typography.fontSize['2xl'] * typography.lineHeight.snug,
    color: '#000000',
    letterSpacing: -0.3,
  },
  h3: {
    fontFamily: FontFamily.display,
    fontSize: typography.fontSize.xl,
    lineHeight: typography.fontSize.xl * typography.lineHeight.snug,
    color: '#000000',
    letterSpacing: -0.2,
  },
  h4: {
    fontFamily: FontFamily.semibold,
    fontSize: typography.fontSize.lg,
    lineHeight: typography.fontSize.lg * typography.lineHeight.normal,
    color: '#000000',
  },
  body: {
    fontFamily: FontFamily.regular,
    fontSize: typography.fontSize.base,
    lineHeight: typography.fontSize.base * typography.lineHeight.relaxed,
    color: 'rgba(0,0,0,0.64)',
  },
  bodySmall: {
    fontFamily: FontFamily.regular,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.fontSize.sm * typography.lineHeight.relaxed,
    color: 'rgba(0,0,0,0.64)',
  },
  label: {
    fontFamily: FontFamily.medium,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.fontSize.sm * typography.lineHeight.normal,
    color: '#000000',
  },
  caption: {
    fontFamily: FontFamily.regular,
    fontSize: typography.fontSize.xs,
    lineHeight: typography.fontSize.xs * typography.lineHeight.normal,
    color: 'rgba(0,0,0,0.42)',
  },
  // ZARA-style micro label: uppercase, wide-tracked, ink.
  eyebrow: {
    fontFamily: FontFamily.medium,
    fontSize: 11,
    lineHeight: 11 * typography.lineHeight.normal,
    color: '#000000',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },
  eyebrowMuted: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    lineHeight: 11 * typography.lineHeight.normal,
    color: 'rgba(0,0,0,0.42)',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  metric: {
    fontFamily: FontFamily.displayBold,
    fontSize: typography.fontSize['2xl'],
    lineHeight: typography.fontSize['2xl'] * typography.lineHeight.tight,
    color: '#000000',
    letterSpacing: -0.3,
  },
  button: {
    fontFamily: FontFamily.medium,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.fontSize.sm * typography.lineHeight.normal,
    color: '#FFFFFF',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  buttonSmall: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    lineHeight: 12 * typography.lineHeight.normal,
    color: '#FFFFFF',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
};
