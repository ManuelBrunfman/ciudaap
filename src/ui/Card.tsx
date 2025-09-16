import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { useTheme } from '../theme';

type Props = ViewProps;

export default function Card({ style, ...rest }: Props) {
  const t = useTheme();
  return (
    <View
      style={[styles.base, { backgroundColor: t.colors.surface, borderRadius: t.radius.l } , style]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
});

