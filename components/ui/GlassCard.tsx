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
      <View style={styles.edgeTop} />
      <View style={styles.edgeLeft} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.glass.bg,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.glass.border,
    padding: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  elevated: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  edgeTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  edgeLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
});
