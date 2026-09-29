import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { GlassCard } from '@/components/ui/GlassCard';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { WayvoScoreCard } from '@/components/waver/WayvoScoreCard';
import { useAuth } from '@/hooks/useAuth';

export default function WaverProfileScreen() {
  const { user, waverProfile, signOut } = useAuth();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <View style={styles.profileSection}>
        <Avatar uri={user?.avatar_url} name={user?.full_name} size="xl" />
        <Text style={styles.name}>{user?.full_name}</Text>
        <Badge label={user?.active_mode === 'waver' ? 'Waver' : 'Brand'} variant="info" />
      </View>

      <WayvoScoreCard
        score={waverProfile?.wayvo_score || 50}
        rank={waverProfile?.score_rank || 'New Waver'}
        campaignsCompleted={waverProfile?.total_campaigns_completed || 0}
        completionRate={waverProfile?.completion_rate || 0}
        avgViews={waverProfile?.avg_views || 0}
        totalEarned={waverProfile?.total_earned || 0}
      />

      <GlassCard style={styles.section}>
        <Text style={styles.sectionTitle}>Social Handles</Text>
        <View style={styles.handleRow}>
          <Text style={styles.handleLabel}>Instagram</Text>
          <Text style={styles.handleValue}>{waverProfile?.instagram_handle || 'Not connected'}</Text>
        </View>
        <View style={styles.handleRow}>
          <Text style={styles.handleLabel}>TikTok</Text>
          <Text style={styles.handleValue}>{waverProfile?.tiktok_handle || 'Not connected'}</Text>
        </View>
        <View style={styles.handleRow}>
          <Text style={styles.handleLabel}>YouTube</Text>
          <Text style={styles.handleValue}>{waverProfile?.youtube_handle || 'Not connected'}</Text>
        </View>
      </GlassCard>

      <GlassCard style={styles.section}>
        <Text style={styles.sectionTitle}>Bank Details</Text>
        <View style={styles.handleRow}>
          <Text style={styles.handleLabel}>Bank</Text>
          <Text style={styles.handleValue}>{waverProfile?.bank_name || 'Not set'}</Text>
        </View>
        <View style={styles.handleRow}>
          <Text style={styles.handleLabel}>Account</Text>
          <Text style={styles.handleValue}>{waverProfile?.bank_account_number || 'Not set'}</Text>
        </View>
      </GlassCard>

      <Button
        title="Settings"
        onPress={() => router.push('/(waver)/profile/settings')}
        variant="secondary"
        fullWidth
      />

      <Button
        title="Sign Out"
        onPress={async () => { await signOut(); router.replace('/(auth)/onboarding'); }}
        variant="ghost"
        fullWidth
        style={styles.signOutButton}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 48,
    gap: 16,
  },
  header: {
    marginBottom: 8,
  },
  title: {
    fontFamily: typography.fontFamily.display,
    fontWeight: '700',
    fontSize: typography.fontSize['2xl'],
    color: colors.text.primary,
  },
  profileSection: {
    alignItems: 'center',
    gap: 12,
  },
  name: {
    fontFamily: typography.fontFamily.displayBold,
    fontSize: typography.fontSize.xl,
    color: colors.text.primary,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
  },
  handleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  handleLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
  },
  handleValue: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
  },
  signOutButton: {
    marginTop: 8,
  },
});
