import { Pressable, StyleSheet, Text } from "react-native";
import { useState } from "react";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { ScreenShell } from "@/Components/ScreenShell";
import { useAuth } from "@/Context/AuthContext";
import { carService } from "@/Services";
import { colors } from "@/Theme";

export default function ListingDetailsScreen() {
  const { isLoggedIn, userId } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const car =
    userId === null
      ? undefined
      : carService
          .getCarsForOwner(userId)
          .find((candidate) => candidate.id === Number(id));

  if (!isLoggedIn || userId === null) {
    return <Redirect href="/auth/login?redirect=/listings" />;
  }
  const ownerId = userId;
  if (!car) {
    return (
      <ScreenShell
        backHref="/listings"
        eyebrow="Listings"
        title="Listing not found"
        description="This listing does not belong to your account or no longer exists."
      />
    );
  }
  const listing = car;

  function handleDelete() {
    if (!carService.deleteCar(listing.id, ownerId)) {
      return;
    }

    router.replace("/listings");
  }

  return (
    <ScreenShell
      backHref="/listings"
      eyebrow="My listing"
      title={`${listing.brand} ${listing.model}`}
      description={`${listing.year} · ${listing.location.city} · ${listing.dailyPrice} ${listing.currency} per day`}
    >
      <Text style={styles.detail}>Status: {listing.status}</Text>
      <Text style={styles.detail}>
        Pickup location: {listing.location.country}, {listing.location.city}
      </Text>
      {isConfirmingDelete ? (
        <>
          <Text style={styles.confirmation}>
            Are you sure you want to remove this listing?
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={handleDelete}
            style={styles.deleteButton}
          >
            <Text style={styles.deleteText}>Confirm delete</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => setIsConfirmingDelete(false)}
            style={styles.cancelButton}
          >
            <Text style={styles.cancelText}>Keep listing</Text>
          </Pressable>
        </>
      ) : (
        <Pressable
          accessibilityRole="button"
          onPress={() => setIsConfirmingDelete(true)}
          style={styles.deleteButton}
        >
          <Text style={styles.deleteText}>Delete listing</Text>
        </Pressable>
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  detail: {
    color: colors.secondaryText,
    fontSize: 16,
  },
  confirmation: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "600",
  },
  deleteButton: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.error,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 8,
    padding: 16,
  },
  deleteText: {
    color: colors.error,
    fontSize: 16,
    fontWeight: "800",
  },
  cancelButton: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  cancelText: {
    color: colors.textOnDark,
    fontSize: 16,
    fontWeight: "800",
  },
});
