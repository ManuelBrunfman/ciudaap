import React from 'react';
import { Text as RNText, TextProps, StyleSheet } from 'react-native';
import { useTheme } from '../theme';

type Props = TextProps & { variant?: 'heading1' | 'heading2' | 'subtitle' | 'body' | 'caption' | 'button' };

export default function AppText({ style, variant = 'body', ...rest }: Props) {
  const t = useTheme();
  return (
    <RNText
      style={[styles.base, { color: t.colors.onBackground }, t.typography[variant], style]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
  },
});

