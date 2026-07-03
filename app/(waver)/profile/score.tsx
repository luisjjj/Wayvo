import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { TrendingUpIcon, ClockIcon, CheckCircleIcon, StarIcon } from '@/components/icons';
import { useAuth } from '@/hooks/useAuth';

export default function WayvoScoreScreen() {
  const { waverProfile } = useAuth();

  const score = waverProfile?.wayvo_score || 50;
  const avgViewsScore = Math.min(400, (waverProfile?.avg_views || 0) / 1000 * 400);
  const completionScore = Math.min(300, (waverProfile?.completion_rate || 0) / 100 * 300);
  const speedScore = waverProfile?.posting_speed_score || 0;
  const ratingScore = Math.min(150, ((waverProfile?.brand_rating_avg || 0) / 5) * 150);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Button title="← Back" onPress={() => router.back()} variant="ghost" size="sm" />
        <Text style={styles.title}>Wayvo Score</Text>
      </View>

      <GlassCard style={styles.scoreCard}>
        <Text style={styles.scoreLabel}>Your Score</Text>
        <Text style={styles.scoreValue}>{score}</Text>
        <Text style={styles.scoreMax}>/ 1000</Text>
        <Text style={styles.scoreRank}>{waverProfile?.score_rank || 'New Waver'}</Text>
      </GlassCard>

      <GlassCard style={styles.breakdownCard}>
        <Text style={styles.breakdownTitle}>Score Breakdown</Text>

        <View style={styles.componentRow}>
          <Text style={styles.componentLabel}>Avg Views (40%)</Text>
          <Text style={styles.componentValue}>{Math.round(avgViewsScore)}</Text>
        </View>
        <ProgressBar progress={avgViewsScore / 400} />

        <View style={styles.componentRow}>
          <Text style={styles.componentLabel}>Completion Rate (30%)</Text>
          <Text style={styles.componentValue}>{Math.round(completionScore)}</Text>
        </View>
        <ProgressBar progress={completionScore / 300} />

        <View style={styles.componentRow}>
          <Text style={styles.componentLabel}>Posting Speed (15%)</Text>
          <Text style={styles.componentValue}>{Math.round(speedScore)}</Text>
        </View>
        <ProgressBar progress={speedScore / 150} />

        <View style={styles.componentRow}>
          <Text style={styles.componentLabel}>Brand Rating (15%)</Text>
          <Text style={styles.componentValue}>{Math.round(ratingScore)}</Text>
        </View>
        <ProgressBar progress={ratingScore / 150} />
      </GlassCard>

      <GlassCard style={styles.tipsCard}>
        <Text style={styles.tipsTitle}>How to Improve Your Score</Text>
        <View style={styles.tipItem}>
          <TrendingUpIcon size={16} color={colors.semantic.success} />
          <Text style={styles.tipText}>Get more views on your posts by posting at peak hours</Text>
        </View>
        <View style={styles.tipItem}>
          <ClockIcon size={16} color={colors.accent.primary} />
          <Text style={styles.tipText}>Post content within 12 hours of accepting a campaign</Text>
        </View>
        <View style={styles.tipItem}>
          <CheckCircleIcon size={16} color={colors.semantic.success} />
          <Text style={styles.tipText}>Complete all assigned campaigns to maintain high completion rate</Text>
        </View>
        <View style={styles.tipItem}>
          <StarIcon size={16} color={colors.semantic.warning} filled />
          <Text style={styles.tipText}>Deliver quality work to earn better ratings from brands</Text>
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
  scoreCard: {
    alignItems: 'center',
    padding: 32,
  },
  scoreLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
    marginBottom: 8,
  },
  scoreValue: {
    fontFamily: typography.fontFamily.displayBold,
    fontSize: 72,
    color: colors.semantic.success,
  },
  scoreMax: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.lg,
    color: colors.text.tertiary,
  },
  scoreRank: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.sm,
    color: colors.accent.primary,
    marginTop: 8,
  },
  breakdownCard: {
    gap: 12,
  },
  breakdownTitle: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    marginBottom: 4,
  },
  componentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  componentLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  componentValue: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
  },
  tipsCard: {
    gap: 16,
  },
  tipsTitle: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
  },
  tipItem: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  tipIcon: {
    fontSize: 16,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    lineHeight: 22,
  },
});
