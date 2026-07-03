import { Platform } from 'react-native';

export const FontFamily = Platform.select({
  ios: {
    thin: 'SF Pro Text',
    ultraLight: 'SF Pro Text',
    light: 'SF Pro Text',
    regular: 'SF Pro Text',
    medium: 'SF Pro Text',
    semibold: 'SF Pro Text',
    bold: 'SF Pro Text',
    heavy: 'SF Pro Text',
    black: 'SF Pro Text',
    display: 'SF Pro Display',
    displayRegular: 'SF Pro Display',
    displayMedium: 'SF Pro Display',
    displaySemibold: 'SF Pro Display',
    displayBold: 'SF Pro Display',
    displayHeavy: 'SF Pro Display',
  },
  default: {
    thin: 'System',
    ultraLight: 'System',
    light: 'System',
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
    heavy: 'System',
    black: 'System',
    display: 'System',
    displayRegular: 'System',
    displayMedium: 'System',
    displaySemibold: 'System',
    displayBold: 'System',
    displayHeavy: 'System',
  },
});

export type FontWeight = keyof typeof FontFamily;
