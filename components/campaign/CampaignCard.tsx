import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { PlatformPill } from '@/components/ui/PlatformPill';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Avatar } from '@/components/ui/Avatar';
import { Campaign } from '@/types/database';

interface CampaignCardProps {
  campaign: Campaign & { brand_profiles?: { business_name: string; logo_url: string | null } };
  onPress: () => void;
}

export function CampaignCard({ campaign, onPress }: CampaignCardProps) {
  const slotsFilled = campaign.num_wavers;
  const progress = Math.min(slotsFilled / (campaign.num_wavers + 2), 1);

  const deadline = campaign.ends_at ? new Date(campaign.ends_at) : null;
  const now = new Date();
  const hoursLeft = deadline
    ? Math.max(0, Math.floor((deadline.getTime() - now.getTime()) / (1000 * 60 * 60)))
    : null;
  const isUrgent = hoursLeft !== null && hoursLeft < 6;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <GlassCard style={styles.card}>
        <View style={styles.header}>
          <Avatar
            uri={campaign.brand_profiles?.logo_url}
            name={campaign.brand_profiles?.business_name || 'Brand'}
            size="md"
          />
          <View style={styles.headerInfo}>
            <Text style={styles.brandName}>
              {campaign.brand_profiles?.business_name || 'Brand'}
            </Text>
            <Text style={styles.title} numberOfLines={1}>
              {campaign.title}
            </Text>
          </View>
          <View style={styles.payoutBadge}>
            <LinearGradient
              colors={[colors.semantic.success, '#009966']}
              style={styles.payoutGradient}
            >
              <Text style={styles.payoutText}>
                ₦{campaign.per_waver_payout.toLocaleString()}
              </Text>
            </LinearGradient>
          </View>
        </View>

        <View style={styles.platforms}>
          {campaign.platforms.map((platform) => (
            <PlatformPill key={platform} platform={platform} />
          ))}
        </View>

        <View style={styles.progressSection}>
          <ProgressBar progress={progress} />
          <View style={styles.progressInfo}>
            <Text style={styles.progressText}>
              {slotsFilled} Wavers assigned
            </Text>
            {hoursLeft !== null && (
              <View style={styles.deadlineRow}>
                {isUrgent && <View style={styles.urgentDot} />}
                <Text
                  style={[
                    styles.deadlineText,
                    isUrgent && styles.deadlineUrgent,
                  ]}
                >
                  {hoursLeft}h left
                </Text>
              </View>
            )}
          </View>
        </View>
      </GlassCard>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  headerInfo: {
    flex: 1,
  },
  brandName: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  title: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
  },
  payoutBadge: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  payoutGradient: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  payoutText: {
    fontFamily: typography.fontFamily.displayBold,
    fontSize: typography.fontSize.sm,
    color: colors.text.inverse,
  },
  platforms: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  progressSection: {
    gap: 6,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
  },
  deadlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  urgentDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.semantic.danger,
  },
  deadlineText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
  },
  deadlineUrgent: {
    color: colors.semantic.warning,
  },
});
