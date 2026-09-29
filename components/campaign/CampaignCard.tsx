import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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
  matchScore?: number | null;
}

export function CampaignCard({ campaign, onPress, matchScore = null }: CampaignCardProps) {
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
              {(campaign.brand_profiles?.business_name || 'Brand').toUpperCase()}
            </Text>
            <Text style={styles.title} numberOfLines={1}>
              {campaign.title}
            </Text>
            {matchScore !== null && matchScore > 0 && (
              <Text style={styles.matchText}>{matchScore}% MATCH FOR YOU</Text>
            )}
          </View>
          <View style={styles.payoutBlock}>
            <Text style={styles.payoutValue}>
              ₦{campaign.per_waver_payout.toLocaleString()}
            </Text>
            <Text style={styles.payoutLabel}>Per post</Text>
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
              {slotsFilled} WAVERS ASSIGNED
            </Text>
            {hoursLeft !== null && (
              <Text style={[styles.deadlineText, isUrgent && styles.deadlineUrgent]}>
                {isUrgent ? 'ENDING SOON · ' : ''}{hoursLeft}H LEFT
              </Text>
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
    fontSize: 10,
    letterSpacing: 2,
    color: colors.text.tertiary,
    marginBottom: 2,
  },
  title: {
    fontFamily: typography.fontFamily.displayBold,
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
  },
  payoutBlock: {
    alignItems: 'flex-end',
    borderLeftWidth: 1,
    borderLeftColor: colors.glass.border,
    paddingLeft: 12,
  },
  payoutValue: {
    fontFamily: typography.fontFamily.displayBold,
    fontSize: typography.fontSize.base,
    color: colors.black,
  },
  payoutLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 10,
    letterSpacing: 1.5,
    color: colors.text.tertiary,
  },
  matchText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 10,
    letterSpacing: 1.5,
    color: colors.accent.primary,
    marginTop: 2,
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
    fontSize: 10,
    letterSpacing: 1.5,
    color: colors.text.tertiary,
  },
  deadlineText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 10,
    letterSpacing: 1.5,
    color: colors.text.tertiary,
  },
  deadlineUrgent: {
    color: colors.semantic.danger,
  },
});
