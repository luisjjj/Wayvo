import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { WalletIcon, TargetIcon } from '@/components/icons';
import { useAuth } from '@/hooks/useAuth';

export default function ModeSelectScreen() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const { updateProfile } = useAuth();
  const [error, setError] = useState('');
  const [selecting, setSelecting] = useState(false);
  const autoSelected = useRef(false);

  const selectMode = async (mode: 'waver' | 'brand') => {
    if (selecting) return;
    setSelecting(true);
    try {
      await updateProfile({ active_mode: mode });
    } catch (err: any) {
      setError(err.message || 'Failed to save');
      setSelecting(false);
      return;
    }
    router.replace(`/(auth)/profile-setup?mode=${mode}`);
  };

  // Role pre-selected on onboarding (For Brands / For Wavers cards) —
  // skip the question and continue straight to profile setup.
  const preselected = mode === 'waver' || mode === 'brand';
  useEffect(() => {
    if (!autoSelected.current && preselected) {
      autoSelected.current = true;
      selectMode(mode);
    }
  }, [mode]);

  // Don't flash the role cards while auto-continuing.
  if (preselected && !error) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>How do you want to use Wayvo?</Text>
        <Text style={styles.subtitle}>
          Choose your primary mode. You can switch between modes later in Settings.
        </Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={styles.modeCard}
          onPress={() => selectMode('waver')}
          activeOpacity={0.8}
        >
          <WalletIcon size={48} color={colors.semantic.success} />
          <Text style={styles.modeTitle}>I want to earn</Text>
          <Text style={styles.modeDesc}>
            Join campaigns as a Waver. Post content on your social media and get paid.
          </Text>
          <Text style={styles.modeLabel}>Waver Mode</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modeCard, styles.brandCard]}
          onPress={() => selectMode('brand')}
          activeOpacity={0.8}
        >
          <TargetIcon size={48} color={colors.accent.primary} />
          <Text style={styles.modeTitle}>I want to run campaigns</Text>
          <Text style={styles.modeDesc}>
            Create campaigns and reach real audiences through micro-influencers.
          </Text>
          <Text style={[styles.modeLabel, styles.brandLabel]}>Brand Mode</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  title: {
    fontFamily: typography.fontFamily.display,
    fontWeight: '700',
    fontSize: typography.fontSize['2xl'],
    color: colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
    marginBottom: 40,
  },
  modeCard: {
    backgroundColor: colors.glass.bg,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: colors.glass.border,
    padding: 24,
    marginBottom: 16,
  },
  brandCard: {
    borderColor: colors.accent.primary,
  },
  modeIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  modeTitle: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize.xl,
    color: colors.text.primary,
    marginBottom: 8,
  },
  modeDesc: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginBottom: 16,
    lineHeight: 22,
  },
  modeLabel: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.sm,
    color: colors.semantic.success,
  },
  brandLabel: {
    color: colors.accent.primary,
  },
  error: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.semantic.danger,
    marginBottom: 16,
    padding: 12,
    backgroundColor: 'rgba(244,63,94,0.1)',
    borderRadius: 8,
  },
});
