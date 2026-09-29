import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { config } from '@/constants/config';

export default function ProfileSetupScreen() {
  const { mode } = useLocalSearchParams<{ mode: string }>();
  const { user, updateProfile } = useAuth();  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Waver fields
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [selectedNiches, setSelectedNiches] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  // Brand fields
  const [businessName, setBusinessName] = useState('');
  const [industry, setIndustry] = useState('');
  const [website, setWebsite] = useState('');

  const isWaver = mode === 'waver';
  const isBrand = mode === 'brand';

  // Reject unknown/missing roles instead of silently falling into brand setup.
  useEffect(() => {
    if (!isWaver && !isBrand) {
      router.replace('/(auth)/mode-select');
    }
  }, [mode]);

  const toggleNiche = (niche: string) => {
    setSelectedNiches((prev) =>
      prev.includes(niche) ? prev.filter((n) => n !== niche) : [...prev, niche]
    );
  };

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
    );
  };

  const handleComplete = async () => {
    if (!isWaver && !isBrand) {
      router.replace('/(auth)/mode-select');
      return;
    }
    setLoading(true);
    setError('');

    try {
      await updateProfile({
        full_name: isWaver ? fullName : businessName,
        active_mode: isWaver ? 'waver' : 'brand',
        is_waver: isWaver,
        is_brand: !isWaver,
      });

      if (isWaver) {
        const { data: existing } = await supabase
          .from('waver_profiles')
          .select('id')
          .eq('user_id', user?.id)
          .maybeSingle();

        if (existing) {
          const { error: updateError } = await supabase
            .from('waver_profiles')
            .update({ bio, location, niche_tags: selectedNiches, platforms: selectedPlatforms })
            .eq('id', existing.id);
          if (updateError) throw updateError;
        } else {
          const { error: insertError } = await supabase.from('waver_profiles').insert({
            user_id: user?.id,
            bio,
            location,
            niche_tags: selectedNiches,
            platforms: selectedPlatforms,
            wayvo_score: config.NEW_WAVER_SCORE,
          });
          if (insertError) throw insertError;
        }
      } else {
        const { data: existing } = await supabase
          .from('brand_profiles')
          .select('id')
          .eq('user_id', user?.id)
          .maybeSingle();

        if (existing) {
          const { error: updateError } = await supabase
            .from('brand_profiles')
            .update({ business_name: businessName, industry, website })
            .eq('id', existing.id);
          if (updateError) throw updateError;
        } else {
          const { error: insertError } = await supabase.from('brand_profiles').insert({
            user_id: user?.id,
            business_name: businessName,
            industry,
            website,
          });
          if (insertError) throw insertError;
        }
      }

      if (isWaver) {
        router.replace('/(waver)');
      } else {
        router.replace('/(brand)');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (!isWaver && !isBrand) {
    return null;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>
        {isWaver ? 'Set up your Waver profile' : 'Set up your Brand profile'}
      </Text>
      <Text style={styles.subtitle}>
        {isWaver
          ? 'Tell us about yourself so brands can find you'
          : 'Tell us about your business'}
      </Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {isWaver ? (
        <>
          <Input
            label="Full Name"
            placeholder="Your full name"
            value={fullName}
            onChangeText={setFullName}
          />

          <Input
            label="Bio"
            placeholder="Tell brands about yourself"
            value={bio}
            onChangeText={setBio}
            multiline
          />

          <Input
            label="Location"
            placeholder="e.g. Lagos, Abuja"
            value={location}
            onChangeText={setLocation}
          />

          <Text style={styles.sectionTitle}>Your Niches</Text>
          <View style={styles.chipContainer}>
            {config.NICHES.map((niche) => (
              <Button
                key={niche}
                title={niche}
                onPress={() => toggleNiche(niche)}
                variant={selectedNiches.includes(niche) ? 'primary' : 'secondary'}
                size="sm"
              />
            ))}
          </View>

          <Text style={styles.sectionTitle}>Your Platforms</Text>
          <View style={styles.chipContainer}>
            {config.PLATFORMS.map((platform) => (
              <Button
                key={platform}
                title={platform.charAt(0).toUpperCase() + platform.slice(1)}
                onPress={() => togglePlatform(platform)}
                variant={selectedPlatforms.includes(platform) ? 'primary' : 'secondary'}
                size="sm"
              />
            ))}
          </View>
        </>
      ) : (
        <>
          <Input
            label="Business Name"
            placeholder="Your business name"
            value={businessName}
            onChangeText={setBusinessName}
          />

          <Input
            label="Industry"
            placeholder="e.g. Food, Fashion, Tech"
            value={industry}
            onChangeText={setIndustry}
          />

          <Input
            label="Website (optional)"
            placeholder="https://yourbusiness.com"
            value={website}
            onChangeText={setWebsite}
            keyboardType="url"
          />
        </>
      )}

      <Button
        title="Complete Setup"
        onPress={handleComplete}
        loading={loading}
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
  sectionTitle: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
    marginBottom: 12,
    marginTop: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  submitButton: {
    marginTop: 16,
  },
});
