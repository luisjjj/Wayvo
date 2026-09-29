import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { CloseIcon, BellIcon } from '@/components/icons';

export default function Step3Screen() {
  const params = useLocalSearchParams();
  const [assets, setAssets] = useState<string[]>([]);

  const pickImage = async () => {
    if (assets.length >= 3) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setAssets([...assets, result.assets[0].uri]);
    }
  };

  const removeAsset = (index: number) => {
    setAssets(assets.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    router.push({
      pathname: '/(brand)/campaigns/create/step4',
      params: { ...params, assets: assets.join(',') },
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Button title="← Back" onPress={() => router.back()} variant="ghost" size="sm" />
        <Text style={styles.stepIndicator}>Step 3 of 4</Text>
      </View>

      <Text style={styles.title}>Campaign Assets</Text>
      <Text style={styles.subtitle}>
        Upload images or videos for Wavers to use (optional)
      </Text>

      <View style={styles.uploadZone}>
        {assets.map((uri, index) => (
          <View key={index} style={styles.assetPreview}>
            <Image source={{ uri }} style={styles.assetImage} />
            <Button
              title=""
              onPress={() => removeAsset(index)}
              variant="danger"
              size="sm"
              style={styles.removeButton}
              icon={<CloseIcon size={14} color={colors.semantic.danger} />}
            />
          </View>
        ))}

        {assets.length < 3 && (
          <Button
            title="+ Add Asset"
            onPress={pickImage}
            variant="secondary"
            style={styles.addButton}
          />
        )}
      </View>

      <GlassCard style={styles.tipCard}>
        <BellIcon size={20} color={colors.accent.primary} />
        <Text style={styles.tipText}>
          Assets help Wavers create better content. Upload your logo, product photos, or campaign visuals. Max 3 files, 50MB each.
        </Text>
      </GlassCard>

      <Button
        title="Next: Review & Pay"
        onPress={handleNext}
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
  uploadZone: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  assetPreview: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 0,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  assetImage: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 0,
  },
  addButton: {
    width: 100,
    height: 100,
    borderRadius: 0,
    borderStyle: 'dashed',
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
