import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '@/constants/colors';
import { FontFamily } from '@/constants/fonts';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'platform';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  platform?: string;
  style?: ViewStyle;
}

export function Badge({
  label,
  variant = 'default',
  size = 'sm',
  platform,
  style,
}: BadgeProps) {
  const getTextColor = (): string => {
    switch (variant) {
      case 'success':
        return colors.text.primary;
      case 'warning':
        return colors.semantic.warning;
      case 'danger':
        return colors.semantic.danger;
      case 'info':
        return colors.text.primary;
      default:
        return colors.text.tertiary;
    }
  };

  return (
    <View style={[styles.container, size === 'md' && styles.md, style]}>
      <Text style={[styles.text, size === 'md' && styles.textMd, { color: getTextColor() }]}>
        {label.toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: colors.glass.border,
    backgroundColor: 'transparent',
    alignSelf: 'flex-start',
  },
  md: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  text: {
    fontFamily: FontFamily.medium,
    fontSize: 10,
    letterSpacing: 1.5,
  },
  textMd: {
    fontSize: 11,
  },
});
