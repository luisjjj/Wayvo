import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { WayvoLogo } from '@/components/icons';
import { useAuth } from '@/hooks/useAuth';

type AuthMode = 'phone' | 'email_signin' | 'email_signup';

export default function PhoneInputScreen() {
  const { sendOtp, signInWithEmail, signUpWithEmail } = useAuth();
  const [authMode, setAuthMode] = useState<AuthMode>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Phone fields
  const [phone, setPhone] = useState('');

  // Email fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const handleSendOtp = async () => {
    if (!phone || phone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await sendOtp(phone);
      router.push({ pathname: '/(auth)/otp', params: { phone } });
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignIn = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await signInWithEmail(email, password);
      router.replace('/(auth)/mode-select');
    } catch (err: any) {
      setError(err.message || 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignUp = async () => {
    if (!email || !password || !fullName) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await signUpWithEmail(email, password, fullName);
      router.replace('/(auth)/mode-select');
    } catch (err: any) {
      setError(err.message || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <WayvoLogo size={56} />
            <Text style={styles.title}>Wayvo</Text>
          </View>

          {authMode === 'phone' && (
            <>
              <Text style={styles.heading}>Enter your phone number</Text>
              <Text style={styles.subtitle}>
                We'll send you a one-time password to verify your account
              </Text>

              <Input
                label="Phone Number"
                placeholder="08012345678"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                error={error}
                leftIcon={<Text style={styles.phonePrefix}>+234</Text>}
              />

              <Button
                title="Send OTP"
                onPress={handleSendOtp}
                loading={loading}
                fullWidth
              />

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              <Button
                title="Sign in with Email"
                onPress={() => { setAuthMode('email_signin'); setError(''); }}
                variant="secondary"
                fullWidth
              />

              <Button
                title="Create Account with Email"
                onPress={() => { setAuthMode('email_signup'); setError(''); }}
                variant="ghost"
                fullWidth
              />
            </>
          )}

          {authMode === 'email_signin' && (
            <>
              <Text style={styles.heading}>Welcome back</Text>
              <Text style={styles.subtitle}>
                Sign in with your email and password
              </Text>

              <Input
                label="Email"
                placeholder="you@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />

              <Input
                label="Password"
                placeholder="Your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                error={error}
              />

              <Button
                title="Sign In"
                onPress={handleEmailSignIn}
                loading={loading}
                fullWidth
              />

              <Button
                title="Back to Phone"
                onPress={() => { setAuthMode('phone'); setError(''); }}
                variant="ghost"
                fullWidth
              />

              <Button
                title="Create Account"
                onPress={() => { setAuthMode('email_signup'); setError(''); }}
                variant="ghost"
                fullWidth
              />
            </>
          )}

          {authMode === 'email_signup' && (
            <>
              <Text style={styles.heading}>Create your account</Text>
              <Text style={styles.subtitle}>
                Join Wayvo and start earning or running campaigns
              </Text>

              <Input
                label="Full Name"
                placeholder="Your full name"
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
              />

              <Input
                label="Email"
                placeholder="you@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />

              <Input
                label="Password"
                placeholder="Min. 6 characters"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                error={error}
              />

              <Button
                title="Create Account"
                onPress={handleEmailSignUp}
                loading={loading}
                fullWidth
              />

              <Button
                title="Back to Phone"
                onPress={() => { setAuthMode('phone'); setError(''); }}
                variant="ghost"
                fullWidth
              />

              <Button
                title="Already have an account? Sign In"
                onPress={() => { setAuthMode('email_signin'); setError(''); }}
                variant="ghost"
                fullWidth
              />
            </>
          )}

          <Text style={styles.terms}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 48,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
    gap: 8,
  },
  title: {
    fontFamily: typography.fontFamily.displayBold,
    fontWeight: '700',
    fontSize: typography.fontSize['2xl'],
    color: colors.text.primary,
  },
  heading: {
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
    lineHeight: 20,
  },
  phonePrefix: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.glass.border,
  },
  dividerText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
  },
  terms: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
    textAlign: 'center',
    marginTop: 24,
  },
});
