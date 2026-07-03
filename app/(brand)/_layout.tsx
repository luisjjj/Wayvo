import React from 'react';
import { Tabs } from 'expo-router';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import {
  DashboardIcon,
  CampaignIcon,
  PeopleIcon,
  ProfileIcon,
} from '@/components/icons';
import { colors } from '@/constants/colors';

function PillTabBar({ state, navigation }: any) {
  const tabDefs = [
    { name: 'index', icon: DashboardIcon },
    { name: 'campaigns', icon: CampaignIcon },
    { name: 'wavers', icon: PeopleIcon },
    { name: 'profile', icon: ProfileIcon },
  ];

  return (
    <View style={pillStyles.container}>
      <View style={pillStyles.pill}>
        {state.routes.map((route: any, index: number) => {
          const isFocused = state.index === index;
          const tab = tabDefs[index];
          if (!tab) return null;
          const Icon = tab.icon;

          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => navigation.navigate(route.name)}
              activeOpacity={0.7}
              style={[pillStyles.tab, isFocused && pillStyles.activeTab]}
            >
              <Icon
                size={21}
                color={isFocused ? colors.accent.primary : colors.text.tertiary}
                focused={isFocused}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function BrandLayout() {
  return (
    <Tabs
      tabBar={(props) => <PillTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="campaigns" />
      <Tabs.Screen name="wavers" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

const pillStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 28 : 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100,
    pointerEvents: 'box-none',
  },
  pill: {
    flexDirection: 'row',
    backgroundColor: 'rgba(18, 18, 31, 0.95)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 6,
    paddingVertical: 6,
    gap: 2,
    ...(Platform.OS === 'ios'
      ? {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.4,
          shadowRadius: 24,
        }
      : { elevation: 16 }),
  },
  tab: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: 'rgba(255, 77, 0, 0.18)',
  },
});
