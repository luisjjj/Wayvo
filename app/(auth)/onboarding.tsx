import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { Button } from '@/components/ui/Button';
import { TargetIcon, WalletIcon, WayvoLogo } from '@/components/icons';

export default function OnboardingScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.background}>
        <View style={styles.content}>
          <WayvoLogo size={80} />
          <Text style={styles.title}>Wayvo</Text>
          <Text style={styles.subtitle}>
            Connect with real people.{'\n'}Real reach. Real results.
          </Text>

          <View style={styles.features}>
            <View style={styles.feature}>
              <TargetIcon size={32} color={colors.accent.primary} />
              <Text style={styles.featureText}>For Brands</Text>
              <Text style={styles.featureDesc}>Run campaigns with real micro-influencers</Text>
            </View>
            <View style={styles.feature}>
              <WalletIcon size={32} color={colors.accent.primary} />
              <Text style={styles.featureText}>For Wavers</Text>
              <Text style={styles.featureDesc}>Earn by posting to your existing audience</Text>
            </View>
          </View>
        </View>

        <View style={styles.buttons}>
          <Button
            title="Get Started"
            onPress={() => router.push('/(auth)/phone')}
            variant="primary"
            fullWidth
          />
          <Button
            title="I already have an account"
            onPress={() => router.push('/(auth)/phone')}
            variant="ghost"
            fullWidth
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    backgroundColor: colors.black,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 48,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontFamily: typography.fontFamily.displayBold,
    fontWeight: '700',
    fontSize: typography.fontSize['4xl'],
    color: colors.white,
    marginBottom: 16,
  },
  subtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.lg,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    lineHeight: 28,
  },
  features: {
    flexDirection: 'row',
    gap: 24,
    marginTop: 64,
  },
  feature: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.background.surface,
    borderRadius: 20,
    padding: 20,
  },
  featureText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.base,
    color: colors.accent.primary,
    marginBottom: 4,
  },
  featureDesc: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.xs,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    lineHeight: 18,
  },
  buttons: {
    gap: 12,
  },
});
