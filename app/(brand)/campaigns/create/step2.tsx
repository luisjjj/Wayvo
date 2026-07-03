import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { Button } from '@/components/ui/Button';
import { BudgetSlider } from '@/components/brand/BudgetSlider';
import { SplitPreview } from '@/components/brand/SplitPreview';
import { config } from '@/constants/config';

export default function Step2Screen() {
  const params = useLocalSearchParams<{ title: string; brief: string; caption: string }>();
  const [budget, setBudget] = useState(50000);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['instagram']);
  const [selectedNiches, setSelectedNiches] = useState<string[]>([]);
  const [duration, setDuration] = useState(7);
  const [minViews, setMinViews] = useState(500);

  const fee = Math.round(budget * (config.WAYVO_FEE_PERCENTAGE / 100));
  const waverPool = budget - fee;
  const numWavers = Math.floor(waverPool / config.MIN_WAVER_PAYOUT);
  const perWaverPayout = numWavers > 0 ? Math.floor(waverPool / numWavers) : 0;
  const estimatedReach = numWavers * 1500;

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
    );
  };

  const toggleNiche = (niche: string) => {
    setSelectedNiches((prev) =>
      prev.includes(niche) ? prev.filter((n) => n !== niche) : [...prev, niche]
    );
  };

  const handleNext = () => {
    router.push({
      pathname: '/(brand)/campaigns/create/step3',
      params: {
        ...params,
        budget: budget.toString(),
        platforms: selectedPlatforms.join(','),
        niches: selectedNiches.join(','),
        duration: duration.toString(),
        minViews: minViews.toString(),
      },
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Button title="← Back" onPress={() => router.back()} variant="ghost" size="sm" />
        <Text style={styles.stepIndicator}>Step 2 of 4</Text>
      </View>

      <Text style={styles.title}>Targeting & Budget</Text>
      <Text style={styles.subtitle}>
        Choose who should see your campaign and how much to spend
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Platforms</Text>
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
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Target Niches</Text>
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
      </View>

      <BudgetSlider value={budget} onValueChange={setBudget} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Duration</Text>
        <View style={styles.chipContainer}>
          {[3, 5, 7, 14].map((d) => (
            <Button
              key={d}
              title={`${d} days`}
              onPress={() => setDuration(d)}
              variant={duration === d ? 'primary' : 'secondary'}
              size="sm"
            />
          ))}
        </View>
      </View>

      <SplitPreview
        totalBudget={budget}
        wayvoFee={fee}
        waverPool={waverPool}
        numWavers={numWavers}
        perWaverPayout={perWaverPayout}
        estimatedReach={estimatedReach}
      />

      <Button
        title="Next: Assets"
        onPress={handleNext}
        fullWidth
        disabled={selectedPlatforms.length === 0}
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
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
