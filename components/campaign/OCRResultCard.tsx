import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { GlassCard } from '@/components/ui/GlassCard';
import { WarningIcon } from '@/components/icons';
import { Badge } from '@/components/ui/Badge';

interface OCRResultCardProps {
  views: number | null;
  reach: number | null;
  interactions: number | null;
  minViews: number;
  confidence?: number;
}

export function OCRResultCard({
  views,
  reach,
  interactions,
  minViews,
  confidence,
}: OCRResultCardProps) {
  const qualifies = views !== null && views >= minViews;

  return (
    <GlassCard style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Verification Results</Text>
        {confidence !== undefined && (
          <Badge
            label={`${Math.round(confidence * 100)}% confidence`}
            variant={confidence > 0.8 ? 'success' : 'warning'}
          />
        )}
      </View>

      <View style={styles.metrics}>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Views</Text>
          <Text style={[styles.metricValue, { color: colors.semantic.success }]}>
            {views?.toLocaleString() || '—'}
          </Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Reach</Text>
          <Text style={[styles.metricValue, { color: colors.semantic.info }]}>
            {reach?.toLocaleString() || '—'}
          </Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Interactions</Text>
          <Text style={[styles.metricValue, { color: colors.accent.secondary }]}>
            {interactions?.toLocaleString() || '—'}
          </Text>
        </View>
      </View>

      <View style={styles.qualification}>
        <Text style={styles.qualificationLabel}>Minimum views required: {minViews.toLocaleString()}</Text>
        <Badge
          label={qualifies ? 'Qualifies ✓' : 'Does not qualify'}
          variant={qualifies ? 'success' : 'danger'}
          size="md"
        />
      </View>

      {qualifies && (
        <View style={styles.fraudNote}>
          <WarningIcon size={16} color={colors.semantic.warning} />
          <Text style={styles.fraudText}>
            Your proof will be reviewed for authenticity. Fraudulent submissions may result in penalties.
          </Text>
        </View>
      )}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
  },
  metrics: {
    flexDirection: 'row',
    gap: 12,
  },
  metric: {
    flex: 1,
    backgroundColor: colors.glass.bg,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  metricLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
    marginBottom: 4,
  },
  metricValue: {
    fontFamily: typography.fontFamily.displayBold,
    fontSize: typography.fontSize.base,
  },
  qualification: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  qualificationLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  fraudNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.semantic.warningSoft,
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  fraudIcon: {
    fontSize: 16,
  },
  fraudText: {
    flex: 1,
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.xs,
    color: colors.semantic.warning,
    lineHeight: 18,
  },
});
