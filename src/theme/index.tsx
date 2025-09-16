import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { spacing } from './spacing';
import { typography } from './typography';
import { AppColors, darkColors, lightColors } from './colors';

type Radius = {
  s: number;
  m: number;
  l: number;
  xl: number;
};

export type AppTheme = {
  colors: AppColors;
  spacing: typeof spacing;
  radius: Radius;
  typography: typeof typography;
  scheme: 'light' | 'dark';
};

const ThemeContext = createContext<AppTheme | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const value = useMemo<AppTheme>(() => ({
    colors: scheme === 'dark' ? darkColors : lightColors,
    spacing,
    radius: { s: 6, m: 10, l: 14, xl: 20 },
    typography,
    scheme,
  }), [scheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export function useTheme(): AppTheme {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

// Optional mapping for React Navigation theming
export const getNavigationTheme = (theme: AppTheme) => ({
  dark: theme.scheme === 'dark',
  colors: {
    primary: theme.colors.primary,
    background: theme.colors.background,
    card: theme.colors.surface,
    text: theme.colors.onBackground,
    border: theme.colors.border,
    notification: theme.colors.primary,
  },
  // Some navigators read theme.fonts.medium; provide a minimal mapping
  fonts: {
    regular: { fontFamily: undefined as any, fontWeight: '400' as const },
    medium: { fontFamily: undefined as any, fontWeight: '500' as const },
    bold: { fontFamily: undefined as any, fontWeight: '700' as const },
  },
});

export * from './colors';
export * from './spacing';
export * from './typography';
