import { Platform } from 'react-native';

// Editorial type pairing: Didone serif for display, neutral grotesque for body.
// Falls back gracefully if a face is missing on-device.
export const FontFamily = Platform.select({
  ios: {
    thin: 'Helvetica Neue',
    ultraLight: 'Helvetica Neue',
    light: 'Helvetica Neue',
    regular: 'Helvetica Neue',
    medium: 'Helvetica Neue',
    semibold: 'Helvetica Neue',
    bold: 'Helvetica Neue',
    heavy: 'Helvetica Neue',
    black: 'Helvetica Neue',
    display: 'Didot',
    displayRegular: 'Didot',
    displayMedium: 'Didot',
    displaySemibold: 'Didot-Bold',
    displayBold: 'Didot-Bold',
    displayHeavy: 'Didot-Bold',
  },
  default: {
    thin: 'sans-serif-light',
    ultraLight: 'sans-serif-light',
    light: 'sans-serif-light',
    regular: 'sans-serif',
    medium: 'sans-serif-medium',
    semibold: 'sans-serif-medium',
    bold: 'sans-serif',
    heavy: 'sans-serif',
    black: 'sans-serif',
    display: 'serif',
    displayRegular: 'serif',
    displayMedium: 'serif',
    displaySemibold: 'serif',
    displayBold: 'serif',
    displayHeavy: 'serif',
  },
});

export type FontWeight = keyof typeof FontFamily;
