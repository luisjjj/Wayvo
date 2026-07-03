import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { CampaignTracker } from '@/components/brand/CampaignTracker';
import { useCampaigns } from '@/hooks/useCampaigns';

export default function CampaignTrackerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { fetchCampaign, currentCampaign, fetchAssignments, assignments } = useCampaigns();

  useEffect(() => {
    if (id) {
      fetchCampaign(id);
      fetchAssignments(id);
    }
  }, [id]);

  if (!currentCampaign) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading campaign...</Text>
      </View>
    );
  }

  const totalViews = assignments.reduce((sum, a) => sum + ((a as any).ocr_views_extracted || 0), 0);
  const releasedAmount = assignments
    .filter((a) => a.status === 'paid')
    .reduce((sum, a) => sum + (a.payout_amount || 0), 0);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Button title="← Back" onPress={() => router.back()} variant="ghost" size="sm" />
        <Text style={styles.title}>Campaign Tracker</Text>
      </View>

      <GlassCard style={styles.campaignInfo}>
        <Text style={styles.campaignTitle}>{currentCampaign.title}</Text>
        <View style={styles.campaignMeta}>
          <Text style={styles.metaText}>Status: {currentCampaign.status}</Text>
          <Text style={styles.metaText}>
            Budget: ₦{currentCampaign.total_budget.toLocaleString()}
          </Text>
        </View>
      </GlassCard>

      <CampaignTracker
        assignments={assignments as any}
        totalBudget={currentCampaign.total_budget}
        releasedAmount={releasedAmount}
        totalViews={totalViews}
      />
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
    paddingBottom: 48,
    gap: 16,
  },
  header: {
    gap: 8,
  },
  title: {
    fontFamily: typography.fontFamily.display,
    fontWeight: '700',
    fontSize: typography.fontSize['2xl'],
    color: colors.text.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
  },
  loadingText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
  },
  campaignInfo: {
    gap: 8,
  },
  campaignTitle: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize.lg,
    color: colors.text.primary,
  },
  campaignMeta: {
    gap: 4,
  },
  metaText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
  },
});
