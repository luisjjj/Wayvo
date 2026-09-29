import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PlusIcon } from '@/components/icons';
import { useAuth } from '@/hooks/useAuth';
import { useCampaigns } from '@/hooks/useCampaigns';

export default function BrandDashboardScreen() {
  const { user, brandProfile } = useAuth();
  const { myCampaigns, fetchMyCampaigns } = useCampaigns();
  const [stats, setStats] = useState({
    activeCampaigns: 0,
    totalReach: 0,
    totalSpent: 0,
  });

  useEffect(() => {
    if (user) {
      fetchMyCampaigns(user.id);
    }
  }, [user]);

  useEffect(() => {
    const active = myCampaigns.filter((c) => c.status === 'active').length;
    setStats({
      activeCampaigns: active,
      totalReach: brandProfile?.total_spent || 0,
      totalSpent: brandProfile?.total_spent || 0,
    });
  }, [myCampaigns, brandProfile]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>Brand Studio</Text>
          <Text style={styles.greeting}>{brandProfile?.business_name || 'Brand'}</Text>
          <Text style={styles.subGreeting}>Here's your campaign overview</Text>
        </View>
        <Button
          title="+ New Campaign"
          onPress={() => router.push('/(brand)/campaigns/create/step1')}
          size="sm"
        />
      </View>

      <View style={styles.statsGrid}>
        <GlassCard style={styles.statCard}>
          <Text style={styles.statValue}>{stats.activeCampaigns}</Text>
          <Text style={styles.statLabel}>Active Campaigns</Text>
        </GlassCard>
        <GlassCard style={styles.statCard}>
          <Text style={[styles.statValue, { color: colors.semantic.success }]}>
            ₦{stats.totalSpent.toLocaleString()}
          </Text>
          <Text style={styles.statLabel}>Total Spent</Text>
        </GlassCard>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Campaigns</Text>
          <Button
            title="View All"
            onPress={() => router.push('/(brand)/campaigns')}
            variant="ghost"
            size="sm"
          />
        </View>

        {myCampaigns.slice(0, 3).map((campaign) => (
          <GlassCard key={campaign.id} style={styles.campaignCard}>
            <View style={styles.campaignHeader}>
              <Text style={styles.campaignTitle} numberOfLines={1}>
                {campaign.title}
              </Text>
              <Badge
                label={campaign.status}
                variant={campaign.status === 'active' ? 'success' : 'default'}
              />
            </View>
            <View style={styles.campaignStats}>
              <Text style={styles.campaignStat}>
                Budget: ₦{campaign.total_budget.toLocaleString()}
              </Text>
              <Text style={styles.campaignStat}>
                {campaign.platforms.join(', ')}
              </Text>
            </View>
          </GlassCard>
        ))}

        {myCampaigns.length === 0 && (
          <GlassCard style={styles.emptyCard}>
            <PlusIcon size={48} color={colors.accent.primary} />
            <Text style={styles.emptyTitle}>No campaigns yet</Text>
            <Text style={styles.emptyText}>
              Create your first campaign to reach real audiences
            </Text>
            <Button
              title="Create Campaign"
              onPress={() => router.push('/(brand)/campaigns/create/step1')}
              fullWidth
            />
          </GlassCard>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 100,
    gap: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    fontFamily: typography.fontFamily.displayBold,
    fontSize: 34,
    letterSpacing: -0.5,
    color: colors.text.primary,
  },
  eyebrow: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 11,
    letterSpacing: 2.5,
    color: colors.text.tertiary,
    marginBottom: 6,
  },
  subGreeting: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  statValue: {
    fontFamily: typography.fontFamily.displayBold,
    fontSize: typography.fontSize.xl,
    color: colors.text.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.displayBold,
    fontSize: typography.fontSize.lg,
    letterSpacing: 0.5,
    color: colors.text.primary,
  },
  campaignCard: {
    gap: 8,
  },
  campaignHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  campaignTitle: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
    flex: 1,
    marginRight: 8,
  },
  campaignStats: {
    flexDirection: 'row',
    gap: 16,
  },
  campaignStat: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
  },
  emptyCard: {
    alignItems: 'center',
    padding: 32,
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
    marginBottom: 16,
  },
});
