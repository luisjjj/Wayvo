import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { GlassCard } from '@/components/ui/GlassCard';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { CampaignIcon } from '@/components/icons';
import { useAuth } from '@/hooks/useAuth';
import { useCampaigns } from '@/hooks/useCampaigns';

export default function WaverCampaignsScreen() {
  const { user } = useAuth();
  const { fetchMyAssignments } = useCampaigns();
  const [assignments, setAssignments] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      loadAssignments();
    }
  }, [user]);

  const loadAssignments = async () => {
    if (!user) return;
    const data = await fetchMyAssignments(user.id);
    setAssignments(data || []);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'success';
      case 'proof_approved': return 'success';
      case 'proof_submitted': return 'warning';
      case 'posted': return 'info';
      case 'accepted': return 'default';
      default: return 'default';
    }
  };

  const renderAssignment = ({ item }: { item: any }) => {
    const campaign = item.campaigns;
    const brand = campaign?.brand_profiles;

    return (
      <GlassCard style={styles.card}>
        <View style={styles.campaignHeader}>
          <Avatar uri={brand?.logo_url} name={brand?.business_name || 'Brand'} size="md" />
          <View style={styles.headerInfo}>
            <Text style={styles.brandName}>{brand?.business_name || 'Brand'}</Text>
            <Text style={styles.campaignTitle} numberOfLines={1}>{campaign?.title}</Text>
          </View>
          <Badge label={item.status.replace('_', ' ')} variant={getStatusColor(item.status)} />
        </View>

        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Payout</Text>
            <Text style={[styles.statValue, { color: colors.semantic.success }]}>
              ₦{item.payout_amount?.toLocaleString()}
            </Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Platform</Text>
            <Text style={styles.statValue}>{campaign?.platforms?.[0]}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Deadline</Text>
            <Text style={styles.statValue}>
              {campaign?.ends_at ? new Date(campaign.ends_at).toLocaleDateString() : '—'}
            </Text>
          </View>
        </View>
      </GlassCard>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Campaigns</Text>
      </View>

      <FlatList
        data={assignments}
        keyExtractor={(item) => item.id}
        renderItem={renderAssignment}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <GlassCard style={styles.emptyCard}>
            <CampaignIcon size={48} color={colors.accent.primary} />
            <Text style={styles.emptyTitle}>No campaigns yet</Text>
            <Text style={styles.emptyText}>Accept campaigns from the Home tab to get started</Text>
          </GlassCard>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  title: {
    fontFamily: typography.fontFamily.display,
    fontWeight: '700',
    fontSize: typography.fontSize['2xl'],
    color: colors.text.primary,
  },
  list: {
    paddingHorizontal: 16,
    gap: 12,
  },
  card: {
    gap: 12,
  },
  campaignHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerInfo: {
    flex: 1,
  },
  brandName: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
  },
  campaignTitle: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
  },
  stats: {
    flexDirection: 'row',
    gap: 16,
  },
  stat: {
    flex: 1,
  },
  statLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
    marginBottom: 2,
  },
  statValue: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    marginBottom: 8,
  },
  emptyText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
});
