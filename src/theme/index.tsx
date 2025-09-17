import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { lightColors, darkColors, type AppColors, type ThemeScheme } from './colors';
import { spacing } from './spacing';
import { typography, type AppTypography } from './typography';

const radius = {
  s: 6,
  m: 10,
  l: 14,
  xl: 20,
  pill: 999,
} as const;

const elevation = {
  none: 0,
  xs: 1,
  sm: 2,
  md: 4,
  lg: 8,
} as const;

const opacity = {
  disabled: 0.4,
  faint: 0.08,
  overlay: 0.6,
} as const;

export type AppRadius = typeof radius;
export type AppElevation = typeof elevation;
export type AppOpacity = typeof opacity;

export type AppTheme = {
  scheme: ThemeScheme;
  colors: AppColors;
  spacing: typeof spacing;
  typography: AppTypography;
  radius: AppRadius;
  elevation: AppElevation;
  opacity: AppOpacity;
};

const ThemeContext = createContext<AppTheme | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const scheme: ThemeScheme = useColorScheme() === 'dark' ? 'dark' : 'light';

  const value = useMemo<AppTheme>(
    () => ({
      scheme,
      colors: scheme === 'dark' ? darkColors : lightColors,
      spacing,
      typography,
      radius,
      elevation,
      opacity,
    }),
    [scheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export function useTheme(): AppTheme {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}

export const getNavigationTheme = (t: AppTheme) => ({
  dark: t.scheme === 'dark',
  colors: {
    primary: t.colors.primary,
    background: 'transparent',
    card: t.colors.surface,
    text: t.colors.onBackground,
    border: t.colors.border,
    notification: t.colors.primary,
  },
  fonts: {
    regular: { fontFamily: undefined as any, fontWeight: '400' as const },
    medium: { fontFamily: undefined as any, fontWeight: '500' as const },
    bold: { fontFamily: undefined as any, fontWeight: '700' as const },
  },
});

export * from './colors';
export * from './spacing';
export * from './typography';
