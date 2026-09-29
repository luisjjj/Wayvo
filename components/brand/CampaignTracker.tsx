import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { GlassCard } from '@/components/ui/GlassCard';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface WaverAssignment {
  id: string;
  waver: {
    full_name: string;
    avatar_url: string | null;
  };
  waver_profile: {
    wayvo_score: number;
  };
  status: string;
  payout_amount: number;
}

interface CampaignTrackerProps {
  assignments: WaverAssignment[];
  totalBudget: number;
  releasedAmount: number;
  totalViews: number;
}

export function CampaignTracker({
  assignments,
  totalBudget,
  releasedAmount,
  totalViews,
}: CampaignTrackerProps) {
  const proofCount = assignments.filter(
    (a) => a.status === 'proof_approved' || a.status === 'paid'
  ).length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
      case 'proof_approved':
        return 'success';
      case 'proof_submitted':
        return 'warning';
      case 'posted':
        return 'info';
      case 'accepted':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <GlassCard style={styles.card}>
      <Text style={styles.title}>Campaign Progress</Text>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{proofCount}/{assignments.length}</Text>
          <Text style={styles.statLabel}>Proofs verified</Text>
        </View>
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: colors.semantic.success }]}>
            {totalViews.toLocaleString()}
          </Text>
          <Text style={styles.statLabel}>Total views</Text>
        </View>
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: colors.semantic.success }]}>
            ₦{releasedAmount.toLocaleString()}
          </Text>
          <Text style={styles.statLabel}>Released</Text>
        </View>
      </View>

      <ProgressBar
        progress={assignments.length > 0 ? proofCount / assignments.length : 0}
        color={colors.semantic.success}
      />

      <View style={styles.waverList}>
        {assignments.map((assignment) => (
          <View key={assignment.id} style={styles.waverRow}>
            <Avatar
              uri={assignment.waver?.avatar_url}
              name={assignment.waver?.full_name}
              size="sm"
            />
            <View style={styles.waverInfo}>
              <Text style={styles.waverName}>{assignment.waver?.full_name}</Text>
              <Text style={styles.waverScore}>Score: {assignment.waver_profile?.wayvo_score}</Text>
            </View>
            <Badge
              label={assignment.status.replace('_', ' ')}
              variant={getStatusColor(assignment.status) as any}
            />
          </View>
        ))}
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 16,
  },
  title: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.glass.bg,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: colors.glass.borderSubtle,
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
  waverList: {
    gap: 12,
  },
  waverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  waverInfo: {
    flex: 1,
  },
  waverName: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
  },
  waverScore: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
  },
});
