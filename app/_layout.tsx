import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import NoticeHost from '../src/components/NoticeHost';
import { SessionProvider, useSession } from '../src/context/SessionContext';
import { colors } from '../src/theme/tokens';

SplashScreen.preventAutoHideAsync().catch(() => {
});

const AUTH_ROUTES = new Set(['register', 'forgot-password']);

function useAuthRedirect() {
  const { user, loading } = useSession();
  const segments = useSegments();
  const router = useRouter();
  const firstSegment: string | undefined = segments[0];

  useEffect(() => {
    if (loading) return;
    const inAuthArea = firstSegment === undefined || AUTH_ROUTES.has(firstSegment);
    if (!user && !inAuthArea) router.replace('/');
    else if (user && inAuthArea) router.replace(user.preferredName ? '/home' : '/personalize-name');
  }, [loading, user, firstSegment, router]);

  useEffect(() => {
    if (!loading) SplashScreen.hideAsync().catch(() => undefined);
  }, [loading]);
}

function RootNavigator() {
  useAuthRedirect();
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right', contentStyle: { backgroundColor: colors.navy } }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="register" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="personalize-name" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="orcamento" />
      <Stack.Screen name="orcamento-editar" />
      <Stack.Screen name="transaction/[id]" />
      <Stack.Screen name="transaction/[id]/category" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <SessionProvider>
        <RootNavigator />
        <NoticeHost />
      </SessionProvider>
    </SafeAreaProvider>
  );
}
