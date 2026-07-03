import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { EarningsRow } from '@/components/waver/EarningsRow';
import { WalletIcon } from '@/components/icons';
import { useAuth } from '@/hooks/useAuth';
import { useWallet } from '@/hooks/useWallet';
import { WalletTransaction } from '@/types/database';

export default function WalletScreen() {
  const { user, waverProfile } = useAuth();
  const { fetchTransactions, requestWithdrawal } = useWallet();
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadTransactions();
    }
  }, [user]);

  const loadTransactions = async () => {
    if (!user) return;
    const data = await fetchTransactions(user.id);
    setTransactions(data);
  };

  const handleWithdraw = async () => {
    if (!user || !waverProfile) return;
    setLoading(true);
    try {
      await requestWithdrawal(user.id, waverProfile.wallet_balance);
      loadTransactions();
    } catch (error) {
      console.error('Withdrawal error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Wallet</Text>
      </View>

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            <GlassCard style={styles.balanceCard}>
              <Text style={styles.balanceLabel}>Total Balance</Text>
              <Text style={styles.balanceValue}>₦{waverProfile?.wallet_balance?.toLocaleString() || '0'}</Text>
              <Button
                title="Withdraw"
                onPress={handleWithdraw}
                loading={loading}
                disabled={!waverProfile?.wallet_balance || waverProfile.wallet_balance < 2000}
                fullWidth
                style={styles.withdrawButton}
              />
              <Text style={styles.minNote}>Minimum withdrawal: ₦2,000</Text>
            </GlassCard>

            <Text style={styles.sectionTitle}>Transaction History</Text>
          </>
        }
        renderItem={({ item }) => (
          <EarningsRow
            type={item.type as any}
            amount={item.amount}
            description={item.description || 'Transaction'}
            date={new Date(item.created_at).toLocaleDateString()}
            status={item.status}
          />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <GlassCard style={styles.emptyCard}>
            <WalletIcon size={48} color={colors.accent.primary} />
            <Text style={styles.emptyTitle}>No transactions yet</Text>
            <Text style={styles.emptyText}>Complete campaigns to start earning</Text>
          </GlassCard>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  title: {
    fontFamily: typography.fontFamily.display,
    fontWeight: '700',
    fontSize: typography.fontSize['2xl'],
    color: colors.text.primary,
  },
  list: {
    paddingHorizontal: 16,
    gap: 12,
  },
  balanceCard: {
    alignItems: 'center',
    padding: 24,
  },
  balanceLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
    marginBottom: 4,
  },
  balanceValue: {
    fontFamily: typography.fontFamily.displayBold,
    fontSize: typography.fontSize['4xl'],
    color: colors.semantic.success,
    marginBottom: 16,
  },
  withdrawButton: {
    width: '100%',
  },
  minNote: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
    marginTop: 8,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    marginTop: 8,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    marginBottom: 8,
  },
  emptyText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
});
