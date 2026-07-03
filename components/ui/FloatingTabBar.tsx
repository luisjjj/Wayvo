import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { colors } from '@/constants/colors';

interface TabItem {
  key: string;
  icon: React.ReactNode;
  onPress: () => void;
}

interface FloatingTabBarProps {
  tabs: TabItem[];
  activeTab: string;
}

function TabButton({ tab, isActive }: { tab: TabItem; isActive: boolean }) {
  return (
    <TouchableOpacity
      onPress={tab.onPress}
      activeOpacity={0.7}
      style={[styles.tab, isActive && styles.activeTab]}
    >
      {tab.icon}
    </TouchableOpacity>
  );
}

export function FloatingTabBar({ tabs, activeTab }: FloatingTabBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.pill}>
        {tabs.map((tab) => (
          <TabButton
            key={tab.key}
            tab={tab}
            isActive={activeTab === tab.key}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 32 : 24,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100,
  },
  pill: {
    flexDirection: 'row',
    backgroundColor: 'rgba(18, 18, 31, 0.92)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    paddingHorizontal: 8,
    paddingVertical: 8,
    gap: 4,
    ...(Platform.OS === 'ios'
      ? {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.3,
          shadowRadius: 24,
        }
      : { elevation: 16 }),
  },
  tab: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: 'rgba(255, 77, 0, 0.2)',
  },
});
