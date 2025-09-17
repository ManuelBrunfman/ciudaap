import React from 'react';
import { View, StyleSheet, type ViewProps } from 'react-native';
import { useTheme } from '../theme';

export default function Divider({ style, ...props }: ViewProps) {
  const t = useTheme();
  return (
    <View
      style={[
        styles.base,
        { backgroundColor: t.colors.border, opacity: t.opacity.faint },
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
  },
});
