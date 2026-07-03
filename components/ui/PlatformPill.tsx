import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '@/constants/colors';
import { FontFamily } from '@/constants/fonts';
import {
  InstagramIcon,
  TikTokIcon,
  WhatsAppIcon,
  FacebookIcon,
  YouTubeIcon,
} from '@/components/icons';

type PlatformType = 'instagram' | 'tiktok' | 'whatsapp' | 'facebook' | 'youtube';

interface PlatformPillProps {
  platform: string;
  label?: string;
  style?: ViewStyle;
}

const platformConfig: Record<string, { Icon: any; color: string; label: string }> = {
  instagram: { Icon: InstagramIcon, color: colors.platform.instagram, label: 'Instagram' },
  tiktok: { Icon: TikTokIcon, color: colors.platform.tiktok, label: 'TikTok' },
  whatsapp: { Icon: WhatsAppIcon, color: colors.platform.whatsapp, label: 'WhatsApp' },
  facebook: { Icon: FacebookIcon, color: colors.platform.facebook, label: 'Facebook' },
  youtube: { Icon: YouTubeIcon, color: colors.platform.youtube, label: 'YouTube' },
};

export function PlatformPill({ platform, label, style }: PlatformPillProps) {
  const config = platformConfig[platform] || { Icon: InstagramIcon, color: colors.text.tertiary, label: platform };

  return (
    <View
      style={[
        styles.pill,
        { backgroundColor: `${config.color}15`, borderColor: `${config.color}30` },
        style,
      ]}
    >
      <config.Icon size={12} color={config.color} />
      <Text style={[styles.text, { color: config.color }]}>
        {label || config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    gap: 4,
  },
  text: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    letterSpacing: 0.1,
  },
});
