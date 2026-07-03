import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { GlassCard } from '@/components/ui/GlassCard';

interface SplitPreviewProps {
  totalBudget: number;
  wayvoFee: number;
  waverPool: number;
  numWavers: number;
  perWaverPayout: number;
  estimatedReach: number;
}

export function SplitPreview({
  totalBudget,
  wayvoFee,
  waverPool,
  numWavers,
  perWaverPayout,
  estimatedReach,
}: SplitPreviewProps) {
  return (
    <GlassCard style={styles.card}>
      <Text style={styles.title}>Budget Breakdown</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Total you pay</Text>
        <Text style={styles.totalValue}>₦{totalBudget.toLocaleString()}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.label}>Wayvo fee (25%)</Text>
        <Text style={styles.feeValue}>₦{wayvoFee.toLocaleString()}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Waver pool (75%)</Text>
        <Text style={[styles.value, { color: colors.semantic.success }]}>
          ₦{waverPool.toLocaleString()}
        </Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.label}>Number of Wavers</Text>
        <Text style={styles.value}>{numWavers}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Per Waver payout</Text>
        <Text style={[styles.value, { color: colors.semantic.success }]}>
          ₦{perWaverPayout.toLocaleString()}
        </Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.label}>Estimated combined reach</Text>
        <Text style={[styles.value, { color: colors.semantic.info }]}>
          {estimatedReach.toLocaleString()} views
        </Text>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 12,
  },
  title: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  value: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
  },
  totalValue: {
    fontFamily: typography.fontFamily.displayBold,
    fontSize: typography.fontSize.lg,
    color: colors.text.primary,
  },
  feeValue: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.glass.borderSubtle,
  },
});
