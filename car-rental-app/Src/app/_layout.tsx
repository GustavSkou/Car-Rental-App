import { Stack } from 'expo-router';
import { AuthProvider } from '@/Context/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }} />
    </AuthProvider>
  );
}