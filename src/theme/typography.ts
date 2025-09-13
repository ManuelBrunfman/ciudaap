export const fontSizes = {
  heading1: 32,
  heading2: 24,
  subtitle: 18,
  body: 16,
  caption: 14,
};

export const fontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  bold: '700' as const,
};

export const typography = {
  heading1: { fontSize: fontSizes.heading1, fontWeight: fontWeights.bold },
  heading2: { fontSize: fontSizes.heading2, fontWeight: fontWeights.bold },
  subtitle: { fontSize: fontSizes.subtitle, fontWeight: fontWeights.regular },
  body: { fontSize: fontSizes.body, fontWeight: fontWeights.regular },
  button: { fontSize: fontSizes.body, fontWeight: fontWeights.bold },
  caption: { fontSize: fontSizes.caption, fontWeight: fontWeights.regular },
};

export type TypographyVariant = keyof typeof typography;
