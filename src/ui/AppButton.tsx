import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  type GestureResponderEvent,
  type ViewStyle,
} from 'react-native';
import { useTheme, type AppTheme } from '../theme';
import AppText from './AppText';

type Variant = 'filled' | 'outline' | 'ghost';

type Props = {
  title: string;
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: Variant;
  style?: ViewStyle | ViewStyle[];
};

export default function AppButton({
  title,
  onPress,
  disabled,
  loading,
  variant = 'filled',
  style,
}: Props) {
  const t = useTheme();
  const isDisabled = disabled || loading;

  const baseStyle = [
    styles.base,
    {
      paddingVertical: t.spacing.sm,
      paddingHorizontal: t.spacing.md,
      borderRadius: t.radius.xl,
    },
    variantStyles(variant, t),
    isDisabled && { opacity: t.opacity.disabled },
    style,
  ];

  const textColor = variant === 'filled' ? t.colors.onPrimary : t.colors.primary;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={baseStyle}
      onPress={onPress}
      disabled={isDisabled}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <AppText style={styles.label} color={textColor} variant="button">
          {title}
        </AppText>
      )}
    </TouchableOpacity>
  );
}

const variantStyles = (variant: Variant, t: AppTheme) => {
  if (variant === 'outline') {
    return {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: t.colors.primary,
    } as const;
  }
  if (variant === 'ghost') {
    return {
      backgroundColor: 'transparent',
    } as const;
  }
  return {
    backgroundColor: t.colors.primary,
  } as const;
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  label: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
