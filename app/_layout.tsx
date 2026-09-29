import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { colors } from '@/constants/colors';
import { ResponsiveFrame } from '@/components/ui/ResponsiveFrame';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="dark" />
      <ResponsiveFrame>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background.primary },
          }}
        />
      </ResponsiveFrame>
    </QueryClientProvider>
  );
}
