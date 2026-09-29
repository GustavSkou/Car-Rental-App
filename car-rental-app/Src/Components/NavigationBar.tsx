import { router, usePathname } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '@/Context/AuthContext';

type NavigationItem = {
  label: string;
  path: '/cars' | '/bookings' | '/listings' |'/requests';
  requiresAuth?: boolean;
};

const NAVIGATION_ITEMS: NavigationItem[] = [
  { label: 'Browse', path: '/cars' },
  { label: 'Bookings', path: '/bookings', requiresAuth: true },
  { label: 'Listings', path: '/listings', requiresAuth: true },
  { label: 'Requests', path: '/requests', requiresAuth: true },
];

export function NavigationBar() {
  const pathname = usePathname();
  const { isLoggedIn } = useAuth();

  function navigate(item: NavigationItem) {
    if (item.requiresAuth && !isLoggedIn) {
      router.push({ pathname: '/auth/login', params: { redirect: item.path } } as never);
      return;
    }

    router.push(item.path as never);
  }

  return (
    <View style={styles.navigationBar}>
      {NAVIGATION_ITEMS.map((item) => {
        const isActive = pathname === item.path || (item.path === '/cars' && pathname.startsWith('/cars/'));

        return (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={item.label}
            key={item.path}
            onPress={() => navigate(item)}
            style={({ pressed }) => [styles.navigationItem, isActive && styles.navigationItemActive, pressed && styles.navigationItemPressed]}
          >
            <Text style={[styles.navigationText, isActive && styles.navigationTextActive]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  navigationBar: { backgroundColor: '#ffffff', borderColor: '#222222', borderTopWidth: 1.5, flexDirection: 'row', height: 56 },
  navigationItem: { alignItems: 'center', justifyContent: 'center', flex: 1, paddingHorizontal: 4 },
  navigationItemActive: { backgroundColor: '#000000' },
  navigationItemPressed: { opacity: 0.7 },
  navigationText: { color: '#111111', fontSize: 13, fontWeight: '600', textAlign: 'center' },
  navigationTextActive: { color: '#ffffff' },
});
