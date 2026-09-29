import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PlatformPill } from '@/components/ui/PlatformPill';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useCampaigns } from '@/hooks/useCampaigns';
import { CampaignWithBrand } from '@/types/campaign';
import { useAuth } from '@/hooks/useAuth';

export default function CampaignDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { fetchCampaign, currentCampaign: rawCampaign, claimAndAccept } = useCampaigns();
  const currentCampaign = rawCampaign as CampaignWithBrand | undefined;
  const [loading, setLoading] = useState(false);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCampaign(id);
    }
  }, [id]);

  const handleAccept = async () => {
    if (!currentCampaign || !user) return;
    setLoading(true);
    try {
      await claimAndAccept(currentCampaign.id, user.id, currentCampaign.per_waver_payout);
      setAccepted(true);
      router.push(`/(waver)/campaigns/${currentCampaign.id}/proof`);
    } catch (error) {
      console.error('Error accepting campaign:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!currentCampaign) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading campaign...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.heroBrand}>
          {(currentCampaign.brand_profiles?.business_name || 'Brand').toUpperCase()}
        </Text>
        <Text style={styles.heroTitle}>{currentCampaign.title}</Text>
        <View style={styles.heroRule} />
      </View>

      <GlassCard style={styles.payoutCard}>
        <Text style={styles.payoutLabel}>Your Payout</Text>
        <Text style={styles.payoutValue}>₦{currentCampaign.per_waver_payout.toLocaleString()}</Text>
        <Text style={styles.payoutSubtext}>Minimum views: {currentCampaign.min_views.toLocaleString()}</Text>
      </GlassCard>

      <View style={styles.infoGrid}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Duration</Text>
          <Text style={styles.infoValue}>{currentCampaign.duration_days} days</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Slots</Text>
          <Text style={styles.infoValue}>{currentCampaign.num_wavers} Wavers</Text>
        </View>
      </View>

      <View style={styles.platforms}>
        {currentCampaign.platforms.map((platform) => (
          <PlatformPill key={platform} platform={platform} />
        ))}
      </View>

      <GlassCard style={styles.briefCard}>
        <Text style={styles.briefTitle}>Campaign Brief</Text>
        <Text style={styles.briefText}>{currentCampaign.brief}</Text>
      </GlassCard>

      {currentCampaign.suggested_caption && (
        <GlassCard style={styles.captionCard}>
          <Text style={styles.captionTitle}>Suggested Caption</Text>
          <Text style={styles.captionText}>{currentCampaign.suggested_caption}</Text>
          <Button
            title="Copy Caption"
            onPress={() => {}}
            variant="secondary"
            size="sm"
          />
        </GlassCard>
      )}

      <Button
        title={accepted ? 'Submit Proof' : `Accept Campaign — earn ₦${currentCampaign.per_waver_payout.toLocaleString()}`}
        onPress={accepted ? () => router.push(`/(waver)/campaigns/${currentCampaign.id}/proof`) : handleAccept}
        loading={loading}
        fullWidth
        style={styles.ctaButton}
      />

      <Text style={styles.payoutNote}>
        Payout released within 24hrs of verified proof
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    paddingBottom: 48,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
  },
  loadingText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
  },
  hero: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 8,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.glass.border,
  },
  heroBrand: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 11,
    letterSpacing: 2.5,
    color: colors.text.tertiary,
    marginBottom: 8,
  },
  heroTitle: {
    fontFamily: typography.fontFamily.displayBold,
    fontSize: typography.fontSize['3xl'],
    letterSpacing: -0.5,
    color: colors.black,
  },
  heroRule: {
    width: 40,
    height: 2,
    backgroundColor: colors.black,
    marginTop: 16,
  },
  payoutCard: {
    marginHorizontal: 16,
    marginTop: 16,
    alignItems: 'center',
  },
  payoutLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
    marginBottom: 4,
  },
  payoutValue: {
    fontFamily: typography.fontFamily.displayBold,
    fontSize: typography.fontSize['4xl'],
    color: colors.semantic.success,
  },
  payoutSubtext: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
    marginTop: 4,
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 16,
    marginTop: 16,
  },
  infoItem: {
    flex: 1,
    backgroundColor: colors.glass.bg,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: colors.glass.border,
    padding: 12,
    alignItems: 'center',
  },
  infoLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
    marginBottom: 4,
  },
  infoValue: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
  },
  platforms: {
    flexDirection: 'row',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 16,
  },
  briefCard: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  briefTitle: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
    marginBottom: 8,
  },
  briefText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  captionCard: {
    marginHorizontal: 16,
    marginTop: 12,
  },
  captionTitle: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
    marginBottom: 8,
  },
  captionText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    lineHeight: 22,
    marginBottom: 12,
  },
  ctaButton: {
    marginHorizontal: 16,
    marginTop: 24,
  },
  payoutNote: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
    textAlign: 'center',
    marginTop: 12,
  },
});
