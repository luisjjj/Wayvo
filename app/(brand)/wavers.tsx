import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { SearchIcon } from '@/components/icons';
import { PaywallModal } from '@/components/ui/PaywallModal';

export default function WaversScreen() {
  const [showPaywall, setShowPaywall] = React.useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Waver Directory</Text>
      </View>

      <GlassCard style={styles.upgradeCard}>
        <SearchIcon size={48} color={colors.accent.primary} />
        <Text style={styles.upgradeTitle}>Unlock Waver Directory</Text>
        <Text style={styles.upgradeText}>
          Find and recruit the best Wavers for your campaigns with Brand Pro.
        </Text>
        <Button
          title="Upgrade to Brand Pro"
          onPress={() => setShowPaywall(true)}
          fullWidth
        />
      </GlassCard>

      <PaywallModal
        visible={showPaywall}
        onClose={() => setShowPaywall(false)}
        onSubscribe={() => setShowPaywall(false)}
        title="Brand Pro"
        price="₦9,000"
        plan="brand_pro"
        features={[
          'Unlimited active campaigns',
          'Full Waver directory access',
          'Advanced campaign analytics',
          'Priority support',
          'Early access to new features',
        ]}
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
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontFamily: typography.fontFamily.display,
    fontWeight: '700',
    fontSize: typography.fontSize['2xl'],
    color: colors.text.primary,
  },
  upgradeCard: {
    alignItems: 'center',
    padding: 32,
    gap: 12,
  },
  upgradeIcon: {
    fontSize: 48,
  },
  upgradeTitle: {
    fontFamily: typography.fontFamily.displayBold,
    fontSize: typography.fontSize.lg,
    color: colors.text.primary,
  },
  upgradeText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
