import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
  const scorePercent = score / 1000;

  return (
    <GlassCard variant="elevated" style={styles.card}>
      <View style={styles.edgeTop} />
      <LinearGradient
        colors={[colors.accent.primary, colors.accent.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.scoreSection}
      >
        <Text style={styles.scoreLabel}>Wayvo Score</Text>
        <View style={styles.scoreRow}>
          <Text style={styles.scoreValue}>{score}</Text>
          <Text style={styles.scoreMax}>/ 1000</Text>
        </View>
        <View style={styles.rankBadge}>
          <Text style={styles.rankText}>{rank}</Text>
        </View>
      </LinearGradient>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{campaignsCompleted}</Text>
          <Text style={styles.statLabel}>Campaigns</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>{completionRate}%</Text>
          <Text style={styles.statLabel}>Completion</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>{avgViews.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Avg Views</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: colors.semantic.success }]}>
            ₦{totalEarned.toLocaleString()}
          </Text>
          <Text style={styles.statLabel}>Earned</Text>
        </View>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 0,
    overflow: 'hidden',
  },
  edgeTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    zIndex: 1,
  },
  scoreSection: {
    padding: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  scoreLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  scoreValue: {
    fontFamily: typography.fontFamily.displayBold,
    fontSize: typography.fontSize['4xl'],
    color: colors.white,
  },
  scoreMax: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.lg,
    color: 'rgba(255,255,255,0.6)',
  },
  rankBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  rankText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.xs,
    color: colors.white,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.glass.bg,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: typography.fontFamily.displayBold,
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    marginBottom: 2,
  },
  statLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.glass.border,
  },
});
