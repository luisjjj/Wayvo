import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { BellIcon } from '@/components/icons';

export default function Step1Screen() {
  const [title, setTitle] = useState('');
  const [brief, setBrief] = useState('');
  const [caption, setCaption] = useState('');

  const handleNext = () => {
    router.push({
      pathname: '/(brand)/campaigns/create/step2',
      params: { title, brief, caption },
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Button title="← Back" onPress={() => router.back()} variant="ghost" size="sm" />
        <Text style={styles.stepIndicator}>Step 1 of 4</Text>
      </View>

      <Text style={styles.title}>Campaign Brief</Text>
      <Text style={styles.subtitle}>
        Tell Wavers what you want them to share with their audience
      </Text>

      <Input
        label="Campaign Name"
        placeholder="e.g. Summer Suya Promo"
        value={title}
        onChangeText={setTitle}
      />

      <Input
        label="Campaign Brief"
        placeholder="What should Wavers convey? What's the key message?"
        value={brief}
        onChangeText={setBrief}
        multiline
        numberOfLines={6}
        style={styles.textArea}
      />

      <Input
        label="Suggested Caption (optional)"
        placeholder="Pre-written caption for Wavers to copy"
        value={caption}
        onChangeText={setCaption}
        multiline
        numberOfLines={4}
        style={styles.textArea}
      />

      <GlassCard style={styles.tipCard}>
        <BellIcon size={20} color={colors.accent.primary} />
        <Text style={styles.tipText}>
          A good brief is specific and clear. Include what action you want Wavers to take, what they should say, and any hashtags to use.
        </Text>
      </GlassCard>

      <Button
        title="Next: Targeting & Budget"
        onPress={handleNext}
        fullWidth
        disabled={!title || !brief}
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
    marginBottom: 8,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  tipCard: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  tipIcon: {
    fontSize: 20,
  },
  tipText: {
    flex: 1,
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
    lineHeight: 18,
  },
});
