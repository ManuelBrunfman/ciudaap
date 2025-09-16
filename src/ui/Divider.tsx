import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { useTheme } from '../theme';

export default function Divider(props: ViewProps) {
  const t = useTheme();
  return <View style={[styles.base, { backgroundColor: t.colors.border }]} {...props} />;
}

const styles = StyleSheet.create({
  base: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
  },
});

