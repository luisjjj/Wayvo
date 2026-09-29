import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';

export default function OTPVerificationScreen() {
  const { phone, mode } = useLocalSearchParams<{ phone: string; mode?: string }>();
  const role = mode === 'brand' || mode === 'waver' ? mode : undefined;
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { verifyOtp, sendOtp } = useAuth();

  const handleVerify = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter the 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await verifyOtp(phone!, otp);
      router.replace(role ? { pathname: '/(auth)/mode-select', params: { mode: role } } : '/(auth)/mode-select');
    } catch (err: any) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await sendOtp(phone!);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to resend');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Verify your number</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit code sent to{'\n'}
          <Text style={styles.phone}>{phone}</Text>
        </Text>

        <Input
          label="Verification Code"
          placeholder="000000"
          value={otp}
          onChangeText={setOtp}
          keyboardType="number-pad"
          maxLength={6}
          error={error}
        />

        <Button
          title="Verify"
          onPress={handleVerify}
          loading={loading}
          fullWidth
        />

        <Button
          title="Resend Code"
          onPress={handleResend}
          variant="ghost"
          fullWidth
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
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
    marginBottom: 32,
    lineHeight: 22,
  },
  phone: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily.medium,
  },
});
