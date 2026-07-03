import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CampaignIcon } from '@/components/icons';
import { useAuth } from '@/hooks/useAuth';
import { useCampaigns } from '@/hooks/useCampaigns';

export default function BrandCampaignsScreen() {
  const { user } = useAuth();
  const { myCampaigns, fetchMyCampaigns } = useCampaigns();

  useEffect(() => {
    if (user) {
      fetchMyCampaigns(user.id);
    }
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'completed': return 'success';
      case 'pending_payment': return 'warning';
      case 'cancelled': return 'danger';
      default: return 'default';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Campaigns</Text>
        <Button
          title="+ New"
          onPress={() => router.push('/(brand)/campaigns/create/step1')}
          size="sm"
        />
      </View>

      <FlatList
        data={myCampaigns}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <GlassCard style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
              <Badge label={item.status} variant={getStatusColor(item.status)} />
            </View>
            <View style={styles.cardStats}>
              <Text style={styles.stat}>₦{item.total_budget.toLocaleString()}</Text>
              <Text style={styles.stat}>{item.platforms.join(', ')}</Text>
              <Text style={styles.stat}>{item.duration_days} days</Text>
            </View>
            <Text style={styles.date}>
              Created: {new Date(item.created_at).toLocaleDateString()}
            </Text>
          </GlassCard>
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <GlassCard style={styles.emptyCard}>
            <CampaignIcon size={48} color={colors.accent.primary} />
            <Text style={styles.emptyTitle}>No campaigns yet</Text>
            <Button
              title="Create Campaign"
              onPress={() => router.push('/(brand)/campaigns/create/step1')}
              fullWidth
            />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  card: {
    gap: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    flex: 1,
    marginRight: 8,
  },
  cardStats: {
    flexDirection: 'row',
    gap: 16,
  },
  stat: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
  },
  date: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
  },
  emptyCard: {
    alignItems: 'center',
    padding: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    marginBottom: 16,
  },
});
