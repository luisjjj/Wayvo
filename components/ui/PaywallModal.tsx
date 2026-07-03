import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { Button } from './Button';

interface PaywallModalProps {
  visible: boolean;
  onClose: () => void;
  onSubscribe: () => void;
  title: string;
  features: string[];
  price: string;
  plan: 'waver_pro' | 'brand_pro';
}

export function PaywallModal({
  visible,
  onClose,
  onSubscribe,
  title,
  features,
  price,
  plan,
}: PaywallModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.edgeTop} />
          <View style={styles.edgeLeft} />

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.price}>{price}</Text>
          <Text style={styles.period}>/month</Text>

          <View style={styles.features}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureRow}>
                <Text style={styles.check}>✓</Text>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>

          <Button
            title="Subscribe Now"
            onPress={onSubscribe}
            variant="primary"
            fullWidth
          />

          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>Maybe later</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  container: {
    backgroundColor: colors.glass.bg,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.glass.border,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    position: 'relative',
    overflow: 'hidden',
  },
  edgeTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  edgeLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  title: {
    fontFamily: typography.fontFamily.displayBold,
    fontSize: typography.fontSize.xl,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  price: {
    fontFamily: typography.fontFamily.displayBold,
    fontSize: typography.fontSize['3xl'],
    color: colors.semantic.success,
    textAlign: 'center',
  },
  period: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
    textAlign: 'center',
    marginBottom: 24,
  },
  features: {
    marginBottom: 24,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  check: {
    color: colors.semantic.success,
    fontSize: 16,
    fontWeight: '700',
  },
  featureText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    flex: 1,
  },
  closeButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  closeText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
  },
});
