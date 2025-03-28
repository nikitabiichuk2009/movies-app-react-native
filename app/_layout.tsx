import { Stack } from 'expo-router';
import './globals.css';
import { ToastProvider } from '@/hooks/toastContenxt';

export default function RootLayout() {
  return (
    <ToastProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="movies/[id]" options={{ headerShown: false }} />
      </Stack>
    </ToastProvider>
  );
}
