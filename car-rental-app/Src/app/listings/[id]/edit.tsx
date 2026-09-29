import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';
import { ScreenShell } from '@/Components/ScreenShell';
import { useAuth } from '@/Context/AuthContext';
import { CarService } from '@/Services';

const carService = new CarService();

export default function EditListingScreen() {
  const { isLoggedIn, userId } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();
  const listing = userId === null ? undefined : carService.getCarsForOwner(userId).find((car) => car.id === Number(id));

  if (!isLoggedIn || userId === null) {
    return <Redirect href="/auth/login?redirect=/listings" />;
  }

  if (!listing) {
    return <ScreenShell backHref="/listings" eyebrow="Listings" title="Listing not found" description="This listing does not belong to your account or no longer exists." />;
  }
  const ownerId = userId;
  const currentListing = listing;

  function handleDelete() {
    if (carService.deleteCar(currentListing.id, ownerId)) {
      router.replace('/listings');
    }
  }

  return (
    <ScreenShell backHref={`/listings/${currentListing.id}`} eyebrow="Listings" title="Edit listing" description={`Manage your ${currentListing.brand} ${currentListing.model} listing.`}>
      <Pressable accessibilityRole="button" onPress={handleDelete} style={styles.deleteButton}>
        <Text style={styles.deleteText}>Delete listing</Text>
      </Pressable>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  deleteButton: { alignItems: 'center', borderColor: '#b42318', borderRadius: 10, borderWidth: 1, padding: 16 },
  deleteText: { color: '#b42318', fontSize: 16, fontWeight: '800' },
});