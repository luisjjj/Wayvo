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
  const getPlatformColor = (p: string) => {
    switch (p) {
      case 'instagram': return colors.platform.instagram;
      case 'tiktok': return colors.platform.tiktok;
      case 'whatsapp': return colors.platform.whatsapp;
      case 'facebook': return colors.platform.facebook;
      case 'youtube': return colors.platform.youtube;
      default: return colors.text.secondary;
    }
  };

  const getContainerStyle = (): ViewStyle[] => {
    const base: ViewStyle[] = [styles.container];
    if (variant === 'platform' && platform) {
      return [...base, { backgroundColor: `${getPlatformColor(platform)}15`, borderColor: `${getPlatformColor(platform)}30` }];
    }
    switch (variant) {
      case 'success': return [...base, styles.success];
      case 'warning': return [...base, styles.warning];
      case 'danger': return [...base, styles.danger];
      case 'info': return [...base, styles.info];
      default: return base;
    }
  };

  const getTextColor = (): string => {
    if (variant === 'platform' && platform) return getPlatformColor(platform);
    switch (variant) {
      case 'success': return colors.semantic.success;
      case 'warning': return colors.semantic.warning;
      case 'danger': return colors.semantic.danger;
      case 'info': return colors.semantic.info;
      default: return colors.text.tertiary;
    }
  };

  return (
    <View style={[...getContainerStyle(), size === 'md' && styles.md, style]}>
      <Text style={[styles.text, size === 'md' && styles.textMd, { color: getTextColor() }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  md: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  text: {
    fontFamily: FontFamily.medium,
    fontSize: 11,
    letterSpacing: 0.2,
  },
  textMd: {
    fontSize: 12,
  },
  success: {
    backgroundColor: 'rgba(92,240,200,0.10)',
    borderColor: 'rgba(92,240,200,0.18)',
  },
  warning: {
    backgroundColor: 'rgba(252,185,92,0.10)',
    borderColor: 'rgba(252,185,92,0.18)',
  },
  danger: {
    backgroundColor: 'rgba(244,63,94,0.10)',
    borderColor: 'rgba(244,63,94,0.18)',
  },
  info: {
    backgroundColor: 'rgba(56,189,248,0.10)',
    borderColor: 'rgba(56,189,248,0.18)',
  },
});
