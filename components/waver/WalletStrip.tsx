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
        <Text style={styles.balanceLabel}>AVAILABLE BALANCE</Text>
        <Text style={styles.balanceValue}>₦{balance.toLocaleString()}</Text>
        {pendingAmount > 0 && (
          <Text style={styles.pendingText}>
            ₦{pendingAmount.toLocaleString()} PENDING
          </Text>
        )}
      </View>
      <Button
        title="Withdraw"
        onPress={onWithdraw}
        variant="secondary"
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
    backgroundColor: colors.black,
    padding: 20,
    marginTop: 12,
  },
  balanceSection: {
    flex: 1,
  },
  balanceLabel: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 10,
    letterSpacing: 2,
    color: 'rgba(255,255,255,0.55)',
    marginBottom: 4,
  },
  balanceValue: {
    fontFamily: typography.fontFamily.displayBold,
    fontSize: typography.fontSize['2xl'],
    color: colors.white,
    letterSpacing: -0.5,
  },
  pendingText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 10,
    letterSpacing: 1.5,
    color: 'rgba(255,255,255,0.55)',
    marginTop: 4,
  },
});
