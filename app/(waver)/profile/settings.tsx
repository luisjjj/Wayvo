import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';

export default function SettingsScreen() {
  const { user, waverProfile, brandProfile, updateProfile, signOut } = useAuth();

  const toggleMode = async () => {
    if (!user) return;
    const newMode = user.active_mode === 'waver' ? 'brand' : 'waver';
    // Never strand a user in a role they haven't set up — send them
    // through profile setup for the missing role instead.
    if (newMode === 'brand' && !brandProfile) {
      await updateProfile({ active_mode: 'brand' });
      router.replace('/(auth)/profile-setup?mode=brand');
      return;
    }
    if (newMode === 'waver' && !waverProfile) {
      await updateProfile({ active_mode: 'waver' });
      router.replace('/(auth)/profile-setup?mode=waver');
      return;
    }
    await updateProfile({ active_mode: newMode });
    if (newMode === 'brand') {
      router.replace('/(brand)');
    } else {
      router.replace('/(waver)');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button
          title="← Back"
          onPress={() => router.back()}
          variant="ghost"
          size="sm"
        />
        <Text style={styles.title}>Settings</Text>
      </View>

      <GlassCard style={styles.section}>
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Active Mode</Text>
            <Text style={styles.settingValue}>
              {user?.active_mode === 'waver' ? 'Waver Mode' : 'Brand Mode'}
            </Text>
          </View>
          <Switch
            value={user?.active_mode === 'brand'}
            onValueChange={toggleMode}
            trackColor={{ false: '#D9D9D9', true: colors.accent.primary }}
            thumbColor={colors.white}
          />
        </View>
      </GlassCard>

      <GlassCard style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <Button title="Edit Profile" onPress={() => {}} variant="ghost" fullWidth />
        <Button title="Bank Details" onPress={() => {}} variant="ghost" fullWidth />
        <Button title="Notifications" onPress={() => {}} variant="ghost" fullWidth />
      </GlassCard>

      <GlassCard style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <Button title="Help Center" onPress={() => {}} variant="ghost" fullWidth />
        <Button title="Terms of Service" onPress={() => {}} variant="ghost" fullWidth />
        <Button title="Privacy Policy" onPress={() => {}} variant="ghost" fullWidth />
      </GlassCard>

      <Button
        title="Sign Out"
        onPress={async () => { await signOut(); router.replace('/(auth)/onboarding'); }}
        variant="danger"
        fullWidth
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    paddingHorizontal: 16,
    paddingTop: 60,
    gap: 16,
  },
  header: {
    gap: 8,
  },
  title: {
    fontFamily: typography.fontFamily.display,
    fontWeight: '700',
    fontSize: typography.fontSize['2xl'],
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
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
  },
  settingValue: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
  },
});
