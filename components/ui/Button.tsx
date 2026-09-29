import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors } from '@/constants/colors';
import { FontFamily } from '@/constants/fonts';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  icon,
  style,
  textStyle,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const sizeStyles = {
    sm: { paddingVertical: 9, paddingHorizontal: 14, fontSize: 12 },
    md: { paddingVertical: 14, paddingHorizontal: 20, fontSize: 13 },
    lg: { paddingVertical: 16, paddingHorizontal: 24, fontSize: 14 },
  };

  const getContainerStyle = (): ViewStyle[] => {
    const base: ViewStyle[] = [
      styles.container,
      {
        paddingVertical: sizeStyles[size].paddingVertical,
        paddingHorizontal: sizeStyles[size].paddingHorizontal,
      },
      ...(fullWidth ? [styles.fullWidth] : []),
    ];

    switch (variant) {
      case 'primary':
        return [...base, styles.primaryContainer];
      case 'secondary':
        return [...base, styles.secondaryContainer];
      case 'outline':
        return [...base, styles.outlineContainer];
      case 'ghost':
        return [...base, styles.ghostContainer];
      case 'danger':
        return [...base, styles.dangerContainer];
      case 'success':
        return [...base, styles.successContainer];
      default:
        return base;
    }
  };

  const getTextStyle = (): TextStyle[] => {
    const base: TextStyle[] = [
      styles.text,
      { fontSize: sizeStyles[size].fontSize },
      textStyle as TextStyle,
    ];

    switch (variant) {
      case 'primary':
        return [...base, styles.primaryText];
      case 'secondary':
        return [...base, styles.secondaryText];
      case 'outline':
        return [...base, styles.outlineText];
      case 'ghost':
        return [...base, styles.ghostText];
      case 'danger':
        return [...base, styles.dangerText];
      case 'success':
        return [...base, styles.successText];
      default:
        return base;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.75}
      style={[
        ...getContainerStyle(),
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' || variant === 'success' ? colors.white : colors.black}
          size="small"
        />
      ) : (
        <View style={styles.content}>
          {icon}
          <Text style={[...getTextStyle(), isDisabled && styles.disabledText]}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 0,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  fullWidth: {
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  text: {
    fontFamily: FontFamily.medium,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  primaryContainer: {
    backgroundColor: colors.black,
    borderColor: colors.black,
  },
  primaryText: {
    color: colors.white,
  },
  secondaryContainer: {
    backgroundColor: colors.white,
    borderColor: colors.black,
  },
  secondaryText: {
    color: colors.black,
  },
  outlineContainer: {
    backgroundColor: 'transparent',
    borderColor: colors.glass.border,
  },
  outlineText: {
    color: colors.text.primary,
  },
  ghostContainer: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  ghostText: {
    color: colors.text.primary,
  },
  dangerContainer: {
    backgroundColor: colors.white,
    borderColor: colors.semantic.danger,
  },
  dangerText: {
    color: colors.semantic.danger,
  },
  successContainer: {
    backgroundColor: colors.black,
    borderColor: colors.black,
  },
  successText: {
    color: colors.white,
  },
  disabled: {
    opacity: 0.35,
  },
  disabledText: {
    opacity: 0.7,
  },
});
