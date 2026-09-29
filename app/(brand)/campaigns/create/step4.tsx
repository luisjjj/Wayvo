import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { WebView } from 'react-native-webview';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { SplitPreview } from '@/components/brand/SplitPreview';
import { LockIcon } from '@/components/icons';
import { useAuth } from '@/hooks/useAuth';
import { useCampaigns } from '@/hooks/useCampaigns';
import { usePaystack } from '@/hooks/usePaystack';
import { config } from '@/constants/config';

export default function Step4Screen() {
  const params = useLocalSearchParams();
  const { user } = useAuth();
  const { createCampaign, activateCampaign, matchAndAssign } = useCampaigns();
  const { initializePayment, payOnWeb } = usePaystack();
  const [loading, setLoading] = useState(false);
  const [payError, setPayError] = useState('');
  const [paymentData, setPaymentData] = useState<any>(null);
  const [createdCampaign, setCreatedCampaign] = useState<any>(null);

  const budget = parseInt(params.budget as string) || 50000;
  const platforms = (params.platforms as string)?.split(',') || [];
  const niches = (params.niches as string)?.split(',') || [];
  const duration = parseInt(params.duration as string) || 7;
  const minViews = parseInt(params.minViews as string) || 500;

  const fee = Math.round(budget * (config.WAYVO_FEE_PERCENTAGE / 100));
  const waverPool = budget - fee;
  const numWavers = Math.floor(waverPool / config.MIN_WAVER_PAYOUT);
  const perWaverPayout = numWavers > 0 ? Math.floor(waverPool / numWavers) : 0;

  const handlePay = async () => {
    setLoading(true);
    try {
      const reference = `WVO_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

      const campaign = await createCampaign({
        brand_id: user?.id || '',
        title: params.title as string,
        brief: params.brief as string,
        suggested_caption: params.caption as string,
        target_niche: niches,
        platforms,
        total_budget: budget,
        wayvo_fee: fee,
        waver_pool: waverPool,
        per_waver_payout: perWaverPayout,
        num_wavers: numWavers,
        min_views: minViews,
        duration_days: duration,
        status: config.CAMPAIGN_STATUSES.PENDING_PAYMENT,
        paystack_reference: reference,
        payment_status: 'pending',
        escrow_held: false,
        asset_urls: params.assets ? (params.assets as string).split(',') : [],
        location_target: null,
        starts_at: null,
        ends_at: null,
      });

      setCreatedCampaign(campaign);

      const email = user?.email || `${user?.phone}@wayvo.app`;

      // Web has no WebView postMessage bridge — pay inline in the page.
      if (Platform.OS === 'web') {
        try {
          await payOnWeb(email, budget, reference);
          await activateCampaign(campaign.id, duration);
          try {
            await matchAndAssign(campaign.id);
          } catch (matchError) {
            console.error('Fit-engine matching failed:', matchError);
          }
          setLoading(false);
          router.replace('/(brand)');
        } catch (webPayError: any) {
          setPayError(webPayError?.message || 'Payment failed. Please try again.');
          setLoading(false);
        }
        return;
      }

      const payment = initializePayment(
        email,
        budget,
        reference,
        async (ref) => {
          // Payment successful → go live immediately so wavers see it,
          // then run the fit engine to map best-fit wavers.
          try {
            await activateCampaign(campaign.id, duration);
            try {
              await matchAndAssign(campaign.id);
            } catch (matchError) {
              console.error('Fit-engine matching failed:', matchError);
            }
          } catch (activateError) {
            console.error('Campaign activation failed:', activateError);
          } finally {
            setLoading(false);
            router.replace('/(brand)');
          }
        },
        (error) => {
          setLoading(false);
          console.error('Payment error:', error);
        }
      );

      setPaymentData(payment);
    } catch (error) {
      setLoading(false);
      console.error('Campaign creation error:', error);
    }
  };

  if (paymentData) {
    return (
      <View style={styles.container}>
        <WebView
          source={{ html: paymentData.html }}
          onMessage={paymentData.onMessage}
          style={styles.webview}
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Button title="← Back" onPress={() => router.back()} variant="ghost" size="sm" />
        <Text style={styles.stepIndicator}>Step 4 of 4</Text>
      </View>

      <Text style={styles.title}>Review & Pay</Text>
      <Text style={styles.subtitle}>
        Review your campaign details before going live
      </Text>

      <GlassCard style={styles.reviewCard}>
        <Text style={styles.reviewTitle}>{params.title}</Text>
        <Text style={styles.reviewBrief} numberOfLines={3}>{params.brief}</Text>

        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Platforms</Text>
          <Text style={styles.reviewValue}>{platforms.join(', ')}</Text>
        </View>
        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Duration</Text>
          <Text style={styles.reviewValue}>{duration} days</Text>
        </View>
        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Min Views</Text>
          <Text style={styles.reviewValue}>{minViews.toLocaleString()}</Text>
        </View>
      </GlassCard>

      <SplitPreview
        totalBudget={budget}
        wayvoFee={fee}
        waverPool={waverPool}
        numWavers={numWavers}
        perWaverPayout={perWaverPayout}
        estimatedReach={numWavers * 1500}
      />

      <GlassCard style={styles.escrowCard}>
        <LockIcon size={24} color={colors.semantic.success} />
        <Text style={styles.escrowText}>
          Funds held securely in escrow until results verified. Released to Wavers only after proof is approved.
        </Text>
      </GlassCard>

      <Button
        title={`Pay ₦${budget.toLocaleString()} & Launch Campaign`}
        onPress={handlePay}
        loading={loading}
        fullWidth
      />
      {payError ? <Text style={styles.payError}>{payError}</Text> : null}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepIndicator: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
  },
  title: {
    fontFamily: typography.fontFamily.display,
    fontWeight: '700',
    fontSize: typography.fontSize['2xl'],
    color: colors.text.primary,
  },
  subtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
  },
  reviewCard: {
    gap: 12,
  },
  reviewTitle: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize.lg,
    color: colors.text.primary,
  },
  reviewBrief: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reviewLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
  },
  reviewValue: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
  },
  escrowCard: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  escrowIcon: {
    fontSize: 24,
  },
  escrowText: {
    flex: 1,
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
    lineHeight: 18,
  },
  webview: {
    flex: 1,
  },
  payError: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.semantic.danger,
    textAlign: 'center',
  },
});
