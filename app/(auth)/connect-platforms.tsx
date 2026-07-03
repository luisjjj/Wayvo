import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { InstagramIcon, TikTokIcon, YouTubeIcon, FacebookIcon, WhatsAppIcon } from '@/components/icons';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

export default function ConnectPlatformsScreen() {
  const { user, updateProfile } = useAuth();
  const [instagram, setInstagram] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [youtube, setYoutube] = useState('');
  const [facebook, setFacebook] = useState('');
  const [whatsapp, setWhatsapp] = useState(user?.phone || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleComplete = async () => {
    setLoading(true);
    setError('');

    try {
      const { error: updateError } = await supabase
        .from('waver_profiles')
        .update({
          instagram_handle: instagram || null,
          tiktok_handle: tiktok || null,
          youtube_handle: youtube || null,
          facebook_handle: facebook || null,
          whatsapp_number: whatsapp || null,
          platforms: [
            instagram && 'instagram',
            tiktok && 'tiktok',
            youtube && 'youtube',
            facebook && 'facebook',
          ].filter(Boolean) as string[],
        })
        .eq('user_id', user?.id);

      if (updateError) throw updateError;
      router.replace('/(waver)');
    } catch (err: any) {
      setError(err.message || 'Failed to save platforms');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Connect your platforms</Text>
      <Text style={styles.subtitle}>
        Add your social media handles so brands can find you
      </Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Input
        label="Instagram"
        placeholder="@yourhandle"
        value={instagram}
        onChangeText={setInstagram}
        leftIcon={<InstagramIcon size={18} />}
      />

      <Input
        label="TikTok"
        placeholder="@yourhandle"
        value={tiktok}
        onChangeText={setTiktok}
        leftIcon={<TikTokIcon size={18} />}
      />

      <Input
        label="YouTube (optional)"
        placeholder="Channel name"
        value={youtube}
        onChangeText={setYoutube}
        leftIcon={<YouTubeIcon size={18} />}
      />

      <Input
        label="Facebook (optional)"
        placeholder="Profile URL"
        value={facebook}
        onChangeText={setFacebook}
        leftIcon={<FacebookIcon size={18} />}
      />

      <Input
        label="WhatsApp Number"
        placeholder="08012345678"
        value={whatsapp}
        onChangeText={setWhatsapp}
        keyboardType="phone-pad"
        leftIcon={<WhatsAppIcon size={18} />}
      />

      <Button
        title="Complete Setup"
        onPress={handleComplete}
        loading={loading}
        fullWidth
      />

      <Button
        title="Skip for now"
        onPress={() => router.replace('/(waver)')}
        variant="ghost"
        fullWidth
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
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
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
    marginBottom: 32,
  },
  error: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.semantic.danger,
    marginBottom: 16,
    padding: 12,
    backgroundColor: 'rgba(244,63,94,0.1)',
    borderRadius: 8,
  },
});
