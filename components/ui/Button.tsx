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
import { LinearGradient } from 'expo-linear-gradient';
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
    sm: { paddingVertical: 8, paddingHorizontal: 14, fontSize: 13 },
    md: { paddingVertical: 12, paddingHorizontal: 20, fontSize: 15 },
    lg: { paddingVertical: 14, paddingHorizontal: 24, fontSize: 16 },
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
        return base;
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

  if (variant === 'primary' || variant === 'danger' || variant === 'success') {
    const gradientColors: [string, string] =
      variant === 'primary'
        ? [colors.accent.primary, colors.accent.secondary]
        : variant === 'danger'
        ? ['#C70036', '#F43F5E']
        : ['#009966', '#5CF0C8'];

    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.8}
        style={[style, isDisabled && styles.disabled]}
      >
        <LinearGradient
          colors={(isDisabled ? ['#333', '#444'] : gradientColors) as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[...getContainerStyle(), isDisabled && styles.disabledGradient]}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} size="small" />
          ) : (
            <View style={styles.content}>
              {icon}
              <Text style={[...getTextStyle(), isDisabled && styles.disabledText]}>{title}</Text>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={[
        ...getContainerStyle(),
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'ghost' ? colors.text.primary : colors.white}
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
    borderRadius: 14,
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
    fontFamily: FontFamily.semibold,
    letterSpacing: 0.1,
  },
  primaryText: {
    color: colors.white,
  },
  secondaryContainer: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  secondaryText: {
    color: colors.text.primary,
  },
  outlineContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  outlineText: {
    color: colors.text.primary,
  },
  ghostContainer: {
    backgroundColor: 'transparent',
  },
  ghostText: {
    color: colors.text.primary,
  },
  dangerContainer: {},
  dangerText: {
    color: colors.white,
  },
  successContainer: {},
  successText: {
    color: colors.text.inverse,
  },
  disabled: {
    opacity: 0.4,
  },
  disabledGradient: {
    opacity: 0.4,
  },
  disabledText: {
    opacity: 0.6,
  },
});
