import { Stack } from 'expo-router';
import './globals.css';
import { ToastProvider } from '@/context/toastContenxt';
import UserProvider from '@/context/userContext';

export default function RootLayout() {
  return (
    <ToastProvider>
      <UserProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="movies/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="profile/[id]" options={{ headerShown: false }} />
        </Stack>
      </UserProvider>
    </ToastProvider>
  );
}
