// WAYVO — Editorial (ZARA-inspired) light theme
// Pure white canvas, black ink, hairline rules, monochrome accents.
export const colors = {
  background: {
    primary: '#FFFFFF',
    surface: '#FAFAFA',
    elevated: '#F4F4F4',
  },
  glass: {
    bg: '#FFFFFF',
    bgHover: '#F7F7F7',
    border: '#E5E5E5',
    borderSubtle: '#EFEFEF',
  },
  accent: {
    primary: '#FF4D00',
    secondary: '#FC5C7D',
    gradient: 'linear-gradient(135deg, #FF4D00, #FC5C7D)',
  },
  semantic: {
    success: '#0E9F6E',
    successSoft: 'rgba(14,159,110,0.10)',
    warning: '#B45309',
    warningSoft: 'rgba(180,83,9,0.10)',
    danger: '#B42318',
    dangerSoft: 'rgba(180,35,24,0.08)',
    info: '#175CD3',
  },
  text: {
    primary: '#000000',
    secondary: 'rgba(0,0,0,0.64)',
    tertiary: 'rgba(0,0,0,0.42)',
    inverse: '#FFFFFF',
  },
  platform: {
    instagram: '#E4405F',
    tiktok: '#000000',
    whatsapp: '#1DA851',
    facebook: '#1877F2',
    youtube: '#E30000',
  },
  white: '#FFFFFF',
  black: '#000000',
} as const;

export type ColorToken = typeof colors;
