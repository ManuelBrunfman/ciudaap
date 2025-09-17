import React from 'react';
import { View, StyleSheet, type ViewProps } from 'react-native';
import { useTheme } from '../theme';

export default function Card({ style, ...rest }: ViewProps) {
  const t = useTheme();
  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: t.colors.surface,
          borderRadius: t.radius.l,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: t.colors.border,
          shadowColor: t.colors.overlay,
          elevation: t.elevation.sm,
        },
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
});
