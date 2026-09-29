import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { GlassCard } from '@/components/ui/GlassCard';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';

export default function BrandProfileScreen() {
  const { user, brandProfile, signOut } = useAuth();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <View style={styles.profileSection}>
        <Avatar uri={brandProfile?.logo_url} name={brandProfile?.business_name} size="xl" />
        <Text style={styles.name}>{brandProfile?.business_name}</Text>
        <Badge label="Brand" variant="info" />
      </View>

      <GlassCard style={styles.section}>
        <Text style={styles.sectionTitle}>Business Info</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Industry</Text>
          <Text style={styles.infoValue}>{brandProfile?.industry || 'Not set'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Website</Text>
          <Text style={styles.infoValue}>{brandProfile?.website || 'Not set'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Total Spent</Text>
          <Text style={[styles.infoValue, { color: colors.semantic.success }]}>
            ₦{brandProfile?.total_spent?.toLocaleString() || '0'}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Campaigns Run</Text>
          <Text style={styles.infoValue}>{brandProfile?.total_campaigns_run || 0}</Text>
        </View>
      </GlassCard>

      <GlassCard style={styles.section}>
        <Text style={styles.sectionTitle}>Subscription</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Current Plan</Text>
          <Badge label={user?.subscription_plan || 'free'} variant="info" />
        </View>
      </GlassCard>

      <Button title="Sign Out" onPress={async () => { await signOut(); router.replace('/(auth)/onboarding'); }} variant="ghost" fullWidth />
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
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
  },
  infoValue: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
  },
});
