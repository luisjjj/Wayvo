import React from 'react';
import { ExpoRoot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

export default function App() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return <ExpoRoot context={(require as any).context('./app', true, /.tsx$/)} />;
}
