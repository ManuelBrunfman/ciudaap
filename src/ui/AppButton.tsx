import React from 'react';
import { ActivityIndicator, GestureResponderEvent, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { useTheme } from '../theme';

type Variant = 'filled' | 'outline' | 'ghost';

type Props = {
  title: string;
  onPress?: (e: GestureResponderEvent) => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: Variant;
  style?: ViewStyle | ViewStyle[];
};

export default function AppButton({ title, onPress, disabled, loading, variant = 'filled', style }: Props) {
  const t = useTheme();
  const isDisabled = disabled || loading;

  const base = [styles.base, { borderRadius: t.radius.xl }];
  const filled = [{ backgroundColor: t.colors.primary }];
  const outline = [{ backgroundColor: 'transparent', borderWidth: 1, borderColor: t.colors.primary }];
  const ghost = [{ backgroundColor: 'transparent' }];

  const containerStyle = [
    base,
    variant === 'filled' ? filled : variant === 'outline' ? outline : ghost,
    isDisabled && { opacity: 0.6 },
    style,
  ];

  const textColor = variant === 'filled' ? t.colors.onPrimary : t.colors.primary;

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} disabled={isDisabled} style={containerStyle}>
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[styles.text, { color: textColor }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

