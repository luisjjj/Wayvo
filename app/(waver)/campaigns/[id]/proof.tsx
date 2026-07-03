import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { ProofUploader } from '@/components/campaign/ProofUploader';
import { OCRResultCard } from '@/components/campaign/OCRResultCard';
import { CheckCircleIcon } from '@/components/icons';
import { useCampaigns } from '@/hooks/useCampaigns';

export default function ProofSubmissionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { submitProof } = useCampaigns();
  const [proof, setProof] = useState<{
    uri: string;
    type: 'screenshot' | 'screen_recording';
    ocr: { views: number | null; reach: number | null; interactions: number | null };
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!proof || !id) return;

    setLoading(true);
    try {
      // In a real app, upload the file to Supabase Storage first
      const fileUrl = proof.uri;

      await submitProof(id, {
        proof_type: proof.type,
        file_url: fileUrl,
        platform: 'instagram',
        ocr_views_extracted: proof.ocr.views || undefined,
        ocr_reach_extracted: proof.ocr.reach || undefined,
        ocr_interactions_extracted: proof.ocr.interactions || undefined,
      });

      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting proof:', error);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <View style={styles.successContainer}>
        <GlassCard style={styles.successCard}>
          <CheckCircleIcon size={64} color={colors.semantic.success} />
          <Text style={styles.successTitle}>Proof Submitted!</Text>
          <Text style={styles.successText}>
            Your proof has been submitted for verification. You'll receive a notification once it's reviewed.
          </Text>
          <Button
            title="Back to Campaigns"
            onPress={() => router.push('/(waver)/campaigns')}
            fullWidth
          />
        </GlassCard>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Submit Proof</Text>
      <Text style={styles.subtitle}>
        Upload a screenshot or screen recording of your post insights
      </Text>

      <View style={styles.steps}>
        <View style={styles.step}>
          <View style={[styles.stepDot, styles.stepDotActive]}>
            <CheckCircleIcon size={16} color={colors.white} />
          </View>
          <Text style={styles.stepText}>Accepted</Text>
        </View>
        <View style={styles.stepLine} />
        <View style={styles.step}>
          <View style={[styles.stepDot, styles.stepDotActive]}>
            <Text style={styles.stepNumber}>2</Text>
          </View>
          <Text style={styles.stepText}>Submit Proof</Text>
        </View>
        <View style={styles.stepLine} />
        <View style={styles.step}>
          <View style={styles.stepDot}>
            <Text style={styles.stepNumber}>3</Text>
          </View>
          <Text style={styles.stepText}>Get Paid</Text>
        </View>
      </View>

      <ProofUploader onProofReady={setProof} />

      {proof && proof.ocr.views && (
        <OCRResultCard
          views={proof.ocr.views}
          reach={proof.ocr.reach}
          interactions={proof.ocr.interactions}
          minViews={500}
        />
      )}

      <Button
        title={`Submit Proof — claim ₦${(7500).toLocaleString()}`}
        onPress={handleSubmit}
        loading={loading}
        disabled={!proof}
        fullWidth
        style={styles.submitButton}
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
    marginBottom: 24,
  },
  steps: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    gap: 8,
  },
  step: {
    alignItems: 'center',
    gap: 4,
  },
  stepDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.glass.bg,
    borderWidth: 1,
    borderColor: colors.glass.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotActive: {
    backgroundColor: colors.accent.primary,
    borderColor: colors.accent.primary,
  },
  stepNumber: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.xs,
    color: colors.white,
  },
  stepText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: colors.glass.border,
    marginBottom: 20,
  },
  submitButton: {
    marginTop: 24,
  },
  successContainer: {
    flex: 1,
    backgroundColor: colors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  successCard: {
    alignItems: 'center',
    padding: 32,
  },
  successIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  successTitle: {
    fontFamily: typography.fontFamily.displayBold,
    fontSize: typography.fontSize.xl,
    color: colors.text.primary,
    marginBottom: 8,
  },
  successText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
});
