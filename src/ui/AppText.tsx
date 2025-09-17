import React from 'react';
import { Text as RNText, StyleSheet, type TextProps } from 'react-native';
import { useTheme } from '../theme';
import type { TypographyVariant } from '../theme/typography';

type Props = TextProps & {
  variant?: TypographyVariant;
  color?: string;
};

export default function AppText({ style, variant = 'body', color, ...rest }: Props) {
  const t = useTheme();
  const resolvedColor = color || t.colors.onBackground;

  return (
    <RNText
      style={[styles.base, t.typography[variant], { color: resolvedColor }, style]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
  },
});
