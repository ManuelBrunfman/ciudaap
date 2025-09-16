export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 20,
  xl: 28,
} as const;

export type Spacing = keyof typeof spacing;
