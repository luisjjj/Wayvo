import React from 'react';
import { View, Image, Text, StyleSheet, ViewStyle, ImageStyle } from 'react-native';
import { colors } from '@/constants/colors';
import { FontFamily } from '@/constants/fonts';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface AvatarProps {
  uri?: string | null;
  name?: string;
  size?: AvatarSize;
  style?: ViewStyle | ImageStyle;
}

const sizeMap: Record<AvatarSize, { container: number; text: number; radius: number }> = {
  xs: { container: 18, text: 8, radius: 9 },
  sm: { container: 28, text: 10, radius: 14 },
  md: { container: 36, text: 13, radius: 18 },
  lg: { container: 48, text: 16, radius: 24 },
  xl: { container: 64, text: 22, radius: 32 },
  '2xl': { container: 80, text: 28, radius: 40 },
};

export function Avatar({ uri, name, size = 'md', style }: AvatarProps) {
  const { container, text: fontSize, radius } = sizeMap[size];

  const initials = name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?';

  const bgColor = name
    ? '#F0F0F0'
    : '#F0F0F0';

  if (uri) {
    const imageStyle: ImageStyle = { width: container, height: container, borderRadius: radius };
    return (
      <Image
        source={{ uri }}
        style={[imageStyle, style as ImageStyle]}
      />
    );
  }

  return (
    <View
      style={[
        styles.container,
        { width: container, height: container, borderRadius: radius, backgroundColor: bgColor },
        style,
      ]}
    >
      <Text style={[styles.text, { fontSize }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: FontFamily.semibold,
    color: colors.black,
  },
});
