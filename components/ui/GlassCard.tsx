import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '@/constants/colors';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'interactive';
  onPress?: () => void;
}

export function GlassCard({
  children,
  style,
  variant = 'default',
}: GlassCardProps) {
  return (
    <View
      style={[
        styles.card,
        variant === 'elevated' && styles.elevated,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: colors.glass.border,
    padding: 16,
  },
  elevated: {
    backgroundColor: colors.background.surface,
  },
});
