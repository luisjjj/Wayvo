export const colors = {
  background: {
    primary: '#0A0A12',
    surface: '#12121F',
    elevated: '#1A1A2E',
  },
  glass: {
    bg: 'rgba(255,255,255,0.05)',
    bgHover: 'rgba(255,255,255,0.08)',
    border: 'rgba(255,255,255,0.10)',
    borderSubtle: 'rgba(255,255,255,0.06)',
  },
  accent: {
    primary: '#FF4D00',
    secondary: '#FC5C7D',
    gradient: 'linear-gradient(135deg, #FF4D00, #FC5C7D)',
  },
  semantic: {
    success: '#5CF0C8',
    successSoft: 'rgba(92,240,200,0.12)',
    warning: '#FCB95C',
    warningSoft: 'rgba(252,185,92,0.12)',
    danger: '#F43F5E',
    dangerSoft: 'rgba(244,63,94,0.12)',
    info: '#38BDF8',
  },
  text: {
    primary: '#F0EEFF',
    secondary: 'rgba(240,238,255,0.6)',
    tertiary: 'rgba(240,238,255,0.35)',
    inverse: '#0A0A12',
  },
  platform: {
    instagram: '#E4405F',
    tiktok: '#00F2EA',
    whatsapp: '#25D366',
    facebook: '#1877F2',
    youtube: '#FF0000',
  },
  white: '#FFFFFF',
  black: '#000000',
} as const;

export type ColorToken = typeof colors;
