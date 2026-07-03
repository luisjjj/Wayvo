import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useCampaigns } from '@/hooks/useCampaigns';

export default function CampaignAnalyticsScreen() {
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
        <Text style={styles.loadingText}>Loading analytics...</Text>
      </View>
    );
  }

  const totalViews = assignments.reduce((sum, a) => sum + ((a as any).ocr_views_extracted || 0), 0);
  const totalReach = assignments.reduce((sum, a) => sum + ((a as any).ocr_reach_extracted || 0), 0);
  const verifiedCount = assignments.filter(
    (a) => a.status === 'proof_approved' || a.status === 'paid'
  ).length;
  const submittedCount = assignments.filter(
    (a) => a.status === 'proof_submitted'
  ).length;
  const completionRate = assignments.length > 0 ? (verifiedCount / assignments.length) * 100 : 0;
  const costPerView = totalViews > 0 ? currentCampaign.total_budget / totalViews : 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Button title="← Back" onPress={() => router.back()} variant="ghost" size="sm" />
        <Text style={styles.title}>Analytics</Text>
      </View>

      <GlassCard style={styles.campaignHeader}>
        <Text style={styles.campaignTitle}>{currentCampaign.title}</Text>
      </GlassCard>

      <View style={styles.statsGrid}>
        <GlassCard style={styles.statCard}>
          <Text style={[styles.statValue, { color: colors.semantic.success }]}>
            {totalViews.toLocaleString()}
          </Text>
          <Text style={styles.statLabel}>Total Views</Text>
        </GlassCard>
        <GlassCard style={styles.statCard}>
          <Text style={[styles.statValue, { color: colors.semantic.info }]}>
            {totalReach.toLocaleString()}
          </Text>
          <Text style={styles.statLabel}>Total Reach</Text>
        </GlassCard>
      </View>

      <View style={styles.statsGrid}>
        <GlassCard style={styles.statCard}>
          <Text style={styles.statValue}>{verifiedCount}/{assignments.length}</Text>
          <Text style={styles.statLabel}>Verified</Text>
        </GlassCard>
        <GlassCard style={styles.statCard}>
          <Text style={styles.statValue}>{submittedCount}</Text>
          <Text style={styles.statLabel}>Pending Review</Text>
        </GlassCard>
      </View>

      <GlassCard style={styles.card}>
        <Text style={styles.cardTitle}>Performance Metrics</Text>

        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Completion Rate</Text>
          <Text style={styles.metricValue}>{completionRate.toFixed(1)}%</Text>
        </View>
        <ProgressBar progress={completionRate / 100} color="#4ADE80" />

        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Cost per View</Text>
          <Text style={styles.metricValue}>₦{costPerView.toFixed(2)}</Text>
        </View>

        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Budget Spent</Text>
          <Text style={styles.metricValue}>
            ₦{currentCampaign.total_budget.toLocaleString()}
          </Text>
        </View>
      </GlassCard>
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
  campaignHeader: {
    padding: 16,
  },
  campaignTitle: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize.lg,
    color: colors.text.primary,
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
  card: {
    gap: 16,
  },
  cardTitle: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  metricValue: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
  },
});
