import type { TextStyle } from 'react-native';

export const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
} as const;

export const fontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
} as const;

export type TypographyVariant =
  | 'heading1'
  | 'heading2'
  | 'subtitle'
  | 'body'
  | 'caption'
  | 'button';

export const typography: Record<TypographyVariant, TextStyle> = {
  heading1: {
    fontSize: fontSizes.xxl,
    fontWeight: fontWeights.bold,
    lineHeight: 40,
  },
  heading2: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    lineHeight: 26,
  },
  body: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.regular,
    lineHeight: 22,
  },
  caption: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.regular,
    lineHeight: 18,
  },
  button: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
    lineHeight: 20,
    textAlign: 'center',
  },
};

export type AppTypography = typeof typography;
