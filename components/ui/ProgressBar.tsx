import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ViewStyle, Animated } from 'react-native';
import { colors } from '@/constants/colors';
import { FontFamily } from '@/constants/fonts';

interface ProgressBarProps {
  progress: number;
  color?: string;
  height?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
}

export function ProgressBar({
  progress,
  color = colors.accent.primary,
  height = 6,
  showLabel = false,
  size = 'md',
  style,
}: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  const animatedWidth = useRef(new Animated.Value(0)).current;

  const heightMap = { sm: 3, md: 6, lg: 10 };
  const actualHeight = heightMap[size];

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: clampedProgress,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [clampedProgress]);

  const widthInterpolated = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={[styles.container, style]}>
      {showLabel && (
        <View style={styles.labelRow}>
          <Text style={styles.label}>{Math.round(clampedProgress)}%</Text>
        </View>
      )}
      <View style={[styles.track, { height: actualHeight, borderRadius: actualHeight / 2 }]}>
        <Animated.View
          style={[
            styles.bar,
            { height: actualHeight, borderRadius: actualHeight / 2 },
            { width: widthInterpolated, backgroundColor: color },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: colors.text.secondary,
    letterSpacing: 0.1,
  },
  track: {
    width: '100%',
    backgroundColor: '#ECECEC',
    overflow: 'hidden',
  },
  bar: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
});
