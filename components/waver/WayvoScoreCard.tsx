import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { GlassCard } from '@/components/ui/GlassCard';

interface WayvoScoreCardProps {
  score: number;
  rank: string;
  campaignsCompleted: number;
  completionRate: number;
  avgViews: number;
  totalEarned: number;
}

export function WayvoScoreCard({
  score,
  rank,
  campaignsCompleted,
  completionRate,
  avgViews,
  totalEarned,
}: WayvoScoreCardProps) {
  return (
    <GlassCard style={styles.card}>
      <Text style={styles.eyebrow}>Wayvo Score</Text>
      <View style={styles.scoreRow}>
        <Text style={styles.scoreValue}>{score}</Text>
        <Text style={styles.scoreMax}>/ 1000</Text>
      </View>
      <Text style={styles.rankText}>{rank.toUpperCase()}</Text>

      <View style={styles.divider} />

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{campaignsCompleted}</Text>
          <Text style={styles.statLabel}>CAMPAIGNS</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{completionRate}%</Text>
          <Text style={styles.statLabel}>COMPLETION</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{avgViews.toLocaleString()}</Text>
          <Text style={styles.statLabel}>AVG VIEWS</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>₦{totalEarned.toLocaleString()}</Text>
          <Text style={styles.statLabel}>EARNED</Text>
        </View>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
  },
  eyebrow: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 11,
    letterSpacing: 2.5,
    color: colors.text.tertiary,
    marginBottom: 4,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  scoreValue: {
    fontFamily: typography.fontFamily.displayBold,
    fontSize: 56,
    lineHeight: 60,
    color: colors.black,
    letterSpacing: -1,
  },
  scoreMax: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.lg,
    color: colors.text.tertiary,
  },
  rankText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 11,
    letterSpacing: 2,
    color: colors.black,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: colors.glass.border,
    marginVertical: 16,
  },
  statsRow: {
    flexDirection: 'row',
  },
  stat: {
    flex: 1,
  },
  statValue: {
    fontFamily: typography.fontFamily.displayBold,
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 9,
    letterSpacing: 1.5,
    color: colors.text.tertiary,
  },
});
