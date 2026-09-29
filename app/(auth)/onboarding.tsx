import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { Button } from '@/components/ui/Button';

export default function OnboardingScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.background}>
        <View style={styles.content}>
          <Text style={styles.eyebrow}>Micro-Influencer Marketplace</Text>
          <Text style={styles.title}>WAYVO</Text>
          <View style={styles.rule} />
          <Text style={styles.subtitle}>
            Real people. Real reach.{'\n'}Real results.
          </Text>

          <Text style={styles.roleHint}>Choose your path to continue</Text>
          <View style={styles.features}>
            <TouchableOpacity
              style={styles.feature}
              activeOpacity={0.7}
              onPress={() => router.push({ pathname: '/(auth)/phone', params: { mode: 'brand' } })}
            >
              <Text style={styles.featureText}>For Brands</Text>
              <Text style={styles.featureDesc}>
                Run campaigns with real micro-influencers
              </Text>
              <Text style={styles.featureCta}>Continue →</Text>
            </TouchableOpacity>
            <View style={styles.featureDivider} />
            <TouchableOpacity
              style={styles.feature}
              activeOpacity={0.7}
              onPress={() => router.push({ pathname: '/(auth)/phone', params: { mode: 'waver' } })}
            >
              <Text style={styles.featureText}>For Wavers</Text>
              <Text style={styles.featureDesc}>
                Earn by posting to your existing audience
              </Text>
              <Text style={styles.featureCta}>Continue →</Text>
            </TouchableOpacity>
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
    backgroundColor: colors.white,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 100,
    paddingBottom: 48,
  },
  content: {
    alignItems: 'center',
  },
  eyebrow: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 11,
    letterSpacing: 3,
    color: colors.accent.primary,
    marginBottom: 12,
  },
  title: {
    fontFamily: typography.fontFamily.display,
    fontSize: 72,
    letterSpacing: 6,
    color: colors.black,
    textAlign: 'center',
  },
  rule: {
    width: 48,
    height: 2,
    backgroundColor: colors.accent.primary,
    marginVertical: 24,
  },
  subtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 26,
  },
  roleHint: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 11,
    letterSpacing: 2.5,
    color: colors.text.tertiary,
    marginTop: 40,
  },
  features: {
    flexDirection: 'row',
    marginTop: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.glass.border,
  },
  feature: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 12,
  },
  featureDivider: {
    width: 1,
    backgroundColor: colors.glass.border,
  },
  featureText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 11,
    letterSpacing: 2,
    color: colors.black,
    marginBottom: 8,
  },
  featureDesc: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 18,
  },
  featureCta: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 11,
    letterSpacing: 1.5,
    color: colors.accent.primary,
    marginTop: 12,
  },
  buttons: {
    gap: 4,
  },
});
