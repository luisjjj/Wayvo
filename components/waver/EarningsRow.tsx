import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { DownloadIcon, UploadIcon } from '@/components/icons';
import { typography } from '@/constants/typography';

interface EarningsRowProps {
  type: 'credit' | 'debit' | 'withdrawal' | 'payout' | 'refund';
  amount: number;
  description: string;
  date: string;
  status: string;
}

export function EarningsRow({ type, amount, description, date, status }: EarningsRowProps) {
  const isCredit = type === 'credit' || type === 'payout' || type === 'refund';

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return colors.semantic.success;
      case 'pending':
        return colors.semantic.warning;
      case 'failed':
        return colors.semantic.danger;
      default:
        return colors.text.tertiary;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {isCredit ? (
          <DownloadIcon size={16} color={colors.semantic.success} />
        ) : (
          <UploadIcon size={16} color={colors.semantic.danger} />
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.description} numberOfLines={1}>
          {description}
        </Text>
        <Text style={styles.date}>{date}</Text>
      </View>
      <View style={styles.amountSection}>
        <Text
          style={[
            styles.amount,
            { color: isCredit ? colors.semantic.success : colors.semantic.danger },
          ]}
        >
          {isCredit ? '+' : '-'}₦{amount.toLocaleString()}
        </Text>
        <Text style={[styles.status, { color: getStatusColor() }]}>
          {status}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.glass.borderSubtle,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.glass.bgHover,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 16,
  },
  info: {
    flex: 1,
  },
  description: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
  },
  date: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  amountSection: {
    alignItems: 'flex-end',
  },
  amount: {
    fontFamily: typography.fontFamily.displayBold,
    fontSize: typography.fontSize.sm,
  },
  status: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.xs,
    marginTop: 2,
    textTransform: 'capitalize',
  },
});
