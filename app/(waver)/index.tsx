import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { GlassCard } from '@/components/ui/GlassCard';
import { WayvoScoreCard } from '@/components/waver/WayvoScoreCard';
import { WalletStrip } from '@/components/waver/WalletStrip';
import { CampaignCard } from '@/components/campaign/CampaignCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { InboxIcon } from '@/components/icons';
import { useAuth } from '@/hooks/useAuth';
import { useCampaigns } from '@/hooks/useCampaigns';

export default function WaverHomeScreen() {
  const { user, waverProfile } = useAuth();
  const { campaigns, fetchActiveCampaigns, isLoading } = useCampaigns();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

  useEffect(() => {
    fetchActiveCampaigns();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchActiveCampaigns();
    setRefreshing(false);
  };

  const filteredCampaigns = selectedPlatform
    ? campaigns.filter((c) => c.platforms.includes(selectedPlatform))
    : campaigns;

  const firstName = user?.full_name?.split(' ')[0] || 'Waver';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent.primary} />}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hey, {firstName}</Text>
          <Text style={styles.subGreeting}>Ready to earn today?</Text>
        </View>
      </View>

      <WayvoScoreCard
        score={waverProfile?.wayvo_score || config.NEW_WAVER_SCORE}
        rank={waverProfile?.score_rank || 'New Waver'}
        campaignsCompleted={waverProfile?.total_campaigns_completed || 0}
        completionRate={waverProfile?.completion_rate || 0}
        avgViews={waverProfile?.avg_views || 0}
        totalEarned={waverProfile?.total_earned || 0}
      />

      <WalletStrip
        balance={waverProfile?.wallet_balance || 0}
        pendingAmount={0}
        onWithdraw={() => router.push('/(waver)/wallet')}
      />

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Open Campaigns</Text>
          <Badge label={`${filteredCampaigns.length} available`} variant="success" />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filters}>
          <Button
            title="All"
            onPress={() => setSelectedPlatform(null)}
            variant={selectedPlatform === null ? 'primary' : 'secondary'}
            size="sm"
          />
          {config.PLATFORMS.map((platform) => (
            <Button
              key={platform}
              title={platform.charAt(0).toUpperCase() + platform.slice(1)}
              onPress={() => setSelectedPlatform(platform)}
              variant={selectedPlatform === platform ? 'primary' : 'secondary'}
              size="sm"
            />
          ))}
        </ScrollView>

        {filteredCampaigns.length === 0 ? (
          <GlassCard style={styles.emptyCard}>
            <InboxIcon size={48} color={colors.accent.primary} />
            <Text style={styles.emptyTitle}>No campaigns yet</Text>
            <Text style={styles.emptyText}>
              New campaigns matching your profile will appear here
            </Text>
          </GlassCard>
        ) : (
          filteredCampaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              onPress={() => router.push(`/(waver)/campaigns/${campaign.id}`)}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
}

const config = { NEW_WAVER_SCORE: 50, PLATFORMS: ['instagram', 'tiktok', 'whatsapp', 'facebook'] };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontFamily: typography.fontFamily.displayBold,
    fontWeight: '700',
    fontSize: typography.fontSize['2xl'],
    color: colors.text.primary,
  },
  subGreeting: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
    marginTop: 4,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize.lg,
    color: colors.text.primary,
  },
  filters: {
    marginBottom: 16,
    gap: 8,
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
