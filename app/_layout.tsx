import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="register" />
        <Stack.Screen name="personalize-name" />
        <Stack.Screen name="home" />
        <Stack.Screen name="extrato" />
        <Stack.Screen name="transacao/[id]" />
        <Stack.Screen name="transacao/[id]/categoria" />
      </Stack>
    </SafeAreaProvider>
  );
}
