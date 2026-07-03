import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { CameraIcon, ImageIcon } from '@/components/icons';
import { extractInsightNumbers } from '@/lib/ocr';

interface ProofUploaderProps {
  onProofReady: (proof: {
    uri: string;
    type: 'screenshot' | 'screen_recording';
    ocr: { views: number | null; reach: number | null; interactions: number | null };
  }) => void;
}

export function ProofUploader({ onProofReady }: ProofUploaderProps) {
  const [image, setImage] = useState<string | null>(null);
  const [ocrResult, setOcrResult] = useState<{
    views: number | null;
    reach: number | null;
    interactions: number | null;
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      setImage(uri);
      processImage(uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return;

    const result = await ImagePicker.launchCameraAsync({
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      setImage(uri);
      processImage(uri);
    }
  };

  const processImage = async (uri: string) => {
    setIsProcessing(true);
    try {
      const ocr = await extractInsightNumbers(uri);
      setOcrResult(ocr);
      onProofReady({
        uri,
        type: 'screenshot',
        ocr,
      });
    } catch (error) {
      console.error('OCR error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Proof</Text>
      <Text style={styles.subtitle}>Screenshot or screen recording of your post insights</Text>

      {image ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: image }} style={styles.preview} />
          {isProcessing && (
            <View style={styles.processingOverlay}>
              <ActivityIndicator color={colors.accent.primary} size="large" />
              <Text style={styles.processingText}>Analyzing insights...</Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.uploadOptions}>
          <TouchableOpacity style={styles.uploadButton} onPress={takePhoto}>
            <CameraIcon size={32} color={colors.accent.primary} />
            <Text style={styles.uploadText}>Take Screenshot</Text>
            <Text style={styles.uploadSubtext}>Show your post insights</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
            <ImageIcon size={32} color={colors.accent.primary} />
            <Text style={styles.uploadText}>Choose from Gallery</Text>
            <Text style={styles.uploadSubtext}>Upload a saved screenshot</Text>
          </TouchableOpacity>
        </View>
      )}

      {ocrResult && (
        <GlassCard style={styles.ocrCard}>
          <Text style={styles.ocrTitle}>Extracted Insights</Text>
          <View style={styles.ocrRow}>
            <Text style={styles.ocrLabel}>Views</Text>
            <Text style={[styles.ocrValue, { color: colors.semantic.success }]}>
              {ocrResult.views?.toLocaleString() || 'Not detected'}
            </Text>
          </View>
          <View style={styles.ocrRow}>
            <Text style={styles.ocrLabel}>Reach</Text>
            <Text style={[styles.ocrValue, { color: colors.semantic.info }]}>
              {ocrResult.reach?.toLocaleString() || 'Not detected'}
            </Text>
          </View>
          <View style={styles.ocrRow}>
            <Text style={styles.ocrLabel}>Interactions</Text>
            <Text style={[styles.ocrValue, { color: colors.accent.secondary }]}>
              {ocrResult.interactions?.toLocaleString() || 'Not detected'}
            </Text>
          </View>
        </GlassCard>
      )}

      {image && !isProcessing && (
        <Button
          title="Retake"
          onPress={() => {
            setImage(null);
            setOcrResult(null);
          }}
          variant="ghost"
          fullWidth
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  title: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize.lg,
    color: colors.text.primary,
  },
  subtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
  },
  uploadOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  uploadButton: {
    flex: 1,
    backgroundColor: colors.glass.bg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.glass.border,
    borderStyle: 'dashed',
    padding: 20,
    alignItems: 'center',
    gap: 8,
  },
  uploadIcon: {
    fontSize: 32,
  },
  uploadText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
  },
  uploadSubtext: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  previewContainer: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
  },
  preview: {
    width: '100%',
    height: 200,
    borderRadius: 16,
  },
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  processingText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
  },
  ocrCard: {
    gap: 12,
  },
  ocrTitle: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
  },
  ocrRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ocrLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  ocrValue: {
    fontFamily: typography.fontFamily.displayBold,
    fontSize: typography.fontSize.base,
  },
});
