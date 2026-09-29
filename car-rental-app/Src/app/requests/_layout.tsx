import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/Context/AuthContext';

export default function RequestsLayout() {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Redirect href="/auth/login" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
