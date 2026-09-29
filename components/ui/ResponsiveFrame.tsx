import React from 'react';
import { Platform, StyleSheet, useWindowDimensions, View } from 'react-native';
import { colors } from '@/constants/colors';

// Phone-column width for wide (desktop) browsers.
const MAX_WEB_WIDTH = 480;

function ResponsiveFrame({ children }: { children: React.ReactNode }) {
  const { width } = useWindowDimensions();

  // Native + narrow browsers: full-bleed as before.
  if (Platform.OS !== 'web' || width <= MAX_WEB_WIDTH + 48) {
    return <>{children}</>;
  }

  // Wide browsers: center the app in a phone-width column.
  return (
    <View style={styles.page}>
      <View style={styles.column}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#E4E4E4',
    alignItems: 'center',
  },
  column: {
    flex: 1,
    width: MAX_WEB_WIDTH,
    maxWidth: '100%',
    backgroundColor: colors.background.primary,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#D4D4D4',
    // subtle elevation so the column reads as a surface
    ...Platform.select({
      web: {
        boxShadow: '0 0 48px rgba(0,0,0,0.12)',
      } as any,
      default: {},
    }),
  },
});

export { ResponsiveFrame, MAX_WEB_WIDTH };
