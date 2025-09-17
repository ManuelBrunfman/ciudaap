export type AppColors = {
  primary: string;
  primaryMuted: string;
  background: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  overlay: string;
  overlayStrong: string;
  onBackground: string;
  onSurface: string;
  onSurfaceMuted: string;
  onPrimary: string;
  muted: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
};

const shared = {
  primary: '#009DE0',
  primaryMuted: '#6CCCF3',
  onPrimary: '#FFFFFF',
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#0EA5E9',
} as const;

export const lightColors: AppColors = {
  ...shared,
  background: '#FFFFFF',
  surface: '#F5F7F6',
  surfaceAlt: '#FFFFFF',
  border: '#D7DEDB',
  overlay: 'rgba(17, 24, 23, 0.35)',
  overlayStrong: 'rgba(17, 24, 23, 0.7)',
  onBackground: '#121513',
  onSurface: '#1B201D',
  onSurfaceMuted: '#4D5550',
  muted: '#6B746F',
};

export const darkColors: AppColors = {
  ...shared,
  background: '#0C1411',
  surface: '#121B17',
  surfaceAlt: '#16211C',
  border: '#1C2824',
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayStrong: 'rgba(0, 0, 0, 0.7)',
  onBackground: '#F1F5F3',
  onSurface: '#E3EAE6',
  onSurfaceMuted: '#9AA59F',
  muted: '#89948F',
};

export type ThemeScheme = 'light' | 'dark';
