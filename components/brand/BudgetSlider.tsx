import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { config } from '@/constants/config';

interface BudgetSliderProps {
  value: number;
  onValueChange: (value: number) => void;
  minimumValue?: number;
  maximumValue?: number;
}

export function BudgetSlider({
  value,
  onValueChange,
  minimumValue = config.MIN_CAMPAIGN_BUDGET,
  maximumValue = 500000,
}: BudgetSliderProps) {
  const fee = Math.round(value * (config.WAYVO_FEE_PERCENTAGE / 100));
  const waverPool = value - fee;
  const numWavers = Math.floor(waverPool / config.MIN_WAVER_PAYOUT);
  const perWaverPayout = numWavers > 0 ? Math.floor(waverPool / numWavers) : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Campaign Budget</Text>
      <Text style={styles.value}>₦{value.toLocaleString()}</Text>

      <Slider
        value={value}
        onValueChange={onValueChange}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        step={5000}
        minimumTrackTintColor={colors.accent.primary}
        maximumTrackTintColor={colors.glass.bgHover}
        thumbTintColor={colors.accent.primary}
        style={styles.slider}
      />

      <View style={styles.rangeRow}>
        <Text style={styles.rangeText}>₦{minimumValue.toLocaleString()}</Text>
        <Text style={styles.rangeText}>₦{maximumValue.toLocaleString()}</Text>
      </View>

      <View style={styles.breakdown}>
        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>Wayvo fee (25%)</Text>
          <Text style={styles.breakdownValue}>₦{fee.toLocaleString()}</Text>
        </View>
        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>Waver pool</Text>
          <Text style={[styles.breakdownValue, { color: colors.semantic.success }]}>
            ₦{waverPool.toLocaleString()}
          </Text>
        </View>
        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>Number of Wavers</Text>
          <Text style={styles.breakdownValue}>{numWavers}</Text>
        </View>
        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>Per Waver payout</Text>
          <Text style={[styles.breakdownValue, { color: colors.semantic.success }]}>
            ₦{perWaverPayout.toLocaleString()}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  label: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  value: {
    fontFamily: typography.fontFamily.displayBold,
    fontSize: typography.fontSize['2xl'],
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 16,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  rangeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  rangeText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
  },
  breakdown: {
    backgroundColor: colors.glass.bg,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: colors.glass.border,
    padding: 16,
    gap: 12,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakdownLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  breakdownValue: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
  },
});
