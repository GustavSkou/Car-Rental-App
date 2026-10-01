import { Pressable, StyleSheet, Text } from 'react-native';
import { useState } from 'react';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { ScreenShell } from '@/Components/ScreenShell';
import { useAuth } from '@/Context/AuthContext';
import { carService } from '@/Services';

export default function ListingDetailsScreen() {
  const { isLoggedIn, userId } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const car = userId === null ? undefined : carService.getCarsForOwner(userId).find((candidate) => candidate.id === Number(id));

  if (!isLoggedIn || userId === null) {
    return <Redirect href="/auth/login?redirect=/listings" />;
  }
  const ownerId = userId;
  if (!car) {
    return <ScreenShell backHref="/listings" eyebrow="Listings" title="Listing not found" description="This listing does not belong to your account or no longer exists." />;
  }
  const listing = car;

  function handleDelete() {
    if (!carService.deleteCar(listing.id, ownerId)) {
      return;
    }

    router.replace('/listings');
  }

  return (
    <ScreenShell backHref="/listings" eyebrow="My listing" title={`${listing.brand} ${listing.model}`} description={`${listing.year} · ${listing.location.city} · ${listing.dailyPrice} ${listing.currency} per day`}>
      <Text style={styles.detail}>Status: {listing.status}</Text>
      <Text style={styles.detail}>Pickup location: {listing.location.country}, {listing.location.city}</Text>
      {isConfirmingDelete ? (
        <>
          <Text style={styles.confirmation}>Are you sure you want to remove this listing?</Text>
          <Pressable accessibilityRole="button" onPress={handleDelete} style={styles.deleteButton}>
            <Text style={styles.deleteText}>Confirm delete</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={() => setIsConfirmingDelete(false)} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Keep listing</Text>
          </Pressable>
        </>
      ) : (
        <Pressable accessibilityRole="button" onPress={() => setIsConfirmingDelete(true)} style={styles.deleteButton}>
          <Text style={styles.deleteText}>Delete listing</Text>
        </Pressable>
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  detail: { color: '#60706d', fontSize: 16 },
  confirmation: { color: '#172321', fontSize: 15 },
  deleteButton: { alignItems: 'center', borderColor: '#b42318', borderRadius: 10, borderWidth: 1, marginTop: 8, padding: 16 },
  deleteText: { color: '#b42318', fontSize: 16, fontWeight: '800' },
  cancelButton: { alignItems: 'center', borderColor: '#dce5e2', borderRadius: 10, borderWidth: 1, padding: 16 },
  cancelText: { color: '#426b63', fontSize: 16, fontWeight: '800' },
});
