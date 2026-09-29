import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { colors } from '@/constants/colors';
import { FontFamily } from '@/constants/fonts';

interface TabItem {
  key: string;
  label: string;
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
      style={styles.tab}
    >
      {tab.icon}
      <Text style={[styles.label, isActive && styles.labelActive]}>
        {tab.label.toUpperCase()}
      </Text>
    </TouchableOpacity>
  );
}

export function FloatingTabBar({ tabs, activeTab }: FloatingTabBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.bar}>
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
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.glass.border,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    paddingTop: 8,
    zIndex: 100,
  },
  bar: {
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  label: {
    fontFamily: FontFamily.medium,
    fontSize: 9,
    letterSpacing: 1.5,
    color: '#999999',
  },
  labelActive: {
    color: colors.black,
  },
});
