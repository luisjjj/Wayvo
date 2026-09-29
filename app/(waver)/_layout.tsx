import React from 'react';
import { Tabs, Redirect } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import {
  HomeIcon,
  CampaignIcon,
  WalletIcon,
  ProfileIcon,
} from '@/components/icons';
import { colors } from '@/constants/colors';
import { FontFamily } from '@/constants/fonts';
import { useAuthStore } from '@/stores/authStore';

function ZaraTabBar({ state, navigation }: any) {
  const tabDefs = [
    { name: 'index', label: 'Home', icon: HomeIcon },
    { name: 'campaigns', label: 'Campaigns', icon: CampaignIcon },
    { name: 'wallet', label: 'Wallet', icon: WalletIcon },
    { name: 'profile', label: 'Profile', icon: ProfileIcon },
  ];

  return (
    <View style={barStyles.container}>
      <View style={barStyles.bar}>
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
              style={barStyles.tab}
            >
              <Icon
                size={20}
                color={isFocused ? colors.accent.primary : '#999999'}
                focused={isFocused}
              />
              <Text style={[barStyles.label, isFocused && barStyles.labelActive]}>
                {tab.label.toUpperCase()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function WaverLayout() {
  const { user, isLoading, isAuthenticated } = useAuthStore();

  // Role guard: keep brand-mode users and guests out of waver routes.
  // Strict opposite-role check only — avoids redirect loops on unknown modes.
  if (!isLoading) {
    if (!isAuthenticated || !user) {
      return <Redirect href="/(auth)/onboarding" />;
    }
    if (user.active_mode === 'brand') {
      return <Redirect href="/(brand)" />;
    }
  }

  return (
    <Tabs
      tabBar={(props) => <ZaraTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="campaigns" />
      <Tabs.Screen name="wallet" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

const barStyles = StyleSheet.create({
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
    color: colors.accent.primary,
  },
});
