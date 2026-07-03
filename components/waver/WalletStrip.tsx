import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { Button } from '@/components/ui/Button';

interface WalletStripProps {
  balance: number;
  pendingAmount: number;
  onWithdraw: () => void;
}

export function WalletStrip({ balance, pendingAmount, onWithdraw }: WalletStripProps) {
  return (
    <View style={styles.container}>
      <View style={styles.balanceSection}>
        <Text style={styles.balanceLabel}>Available Balance</Text>
        <Text style={styles.balanceValue}>₦{balance.toLocaleString()}</Text>
        {pendingAmount > 0 && (
          <Text style={styles.pendingText}>
            ₦{pendingAmount.toLocaleString()} pending
          </Text>
        )}
      </View>
      <Button
        title="Withdraw"
        onPress={onWithdraw}
        variant="primary"
        size="sm"
        disabled={balance < 2000}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.glass.bg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.glass.border,
    padding: 16,
  },
  balanceSection: {
    flex: 1,
  },
  balanceLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
    marginBottom: 2,
  },
  balanceValue: {
    fontFamily: typography.fontFamily.displayBold,
    fontSize: typography.fontSize.xl,
    color: colors.semantic.success,
  },
  pendingText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.xs,
    color: colors.semantic.warning,
    marginTop: 2,
  },
});
