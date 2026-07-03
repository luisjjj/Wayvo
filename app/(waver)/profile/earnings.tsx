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

export default function EarningsHistoryScreen() {
  const { user } = useAuth();
  const { fetchTransactions } = useWallet();
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);

  useEffect(() => {
    if (user) {
      loadTransactions();
    }
  }, [user]);

  const loadTransactions = async () => {
    if (!user) return;
    const data = await fetchTransactions(user.id);
    setTransactions(data.filter((t) => t.type === 'payout' || t.type === 'credit'));
  };

  const totalEarned = transactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button title="← Back" onPress={() => router.back()} variant="ghost" size="sm" />
        <Text style={styles.title}>Earnings History</Text>
      </View>

      <GlassCard style={styles.totalCard}>
        <Text style={styles.totalLabel}>Total Earned</Text>
        <Text style={styles.totalValue}>₦{totalEarned.toLocaleString()}</Text>
      </GlassCard>

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EarningsRow
            type={item.type as any}
            amount={item.amount}
            description={item.description || 'Campaign payout'}
            date={new Date(item.created_at).toLocaleDateString()}
            status={item.status}
          />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <GlassCard style={styles.emptyCard}>
            <WalletIcon size={48} color={colors.accent.primary} />
            <Text style={styles.emptyTitle}>No earnings yet</Text>
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
    gap: 8,
  },
  title: {
    fontFamily: typography.fontFamily.display,
    fontWeight: '700',
    fontSize: typography.fontSize['2xl'],
    color: colors.text.primary,
  },
  totalCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    alignItems: 'center',
    padding: 24,
  },
  totalLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
    marginBottom: 4,
  },
  totalValue: {
    fontFamily: typography.fontFamily.displayBold,
    fontSize: typography.fontSize['4xl'],
    color: colors.semantic.success,
  },
  list: {
    paddingHorizontal: 16,
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
