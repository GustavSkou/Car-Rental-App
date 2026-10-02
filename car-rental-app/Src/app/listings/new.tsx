import { useState } from "react";
import { Redirect, router } from "expo-router";
import { Pressable, StyleSheet, Text, TextInput } from "react-native";
import { ScreenShell } from "@/Components/ScreenShell";
import { useAuth } from "@/Context/AuthContext";
import { Car, CarStatus, Location } from "@/Models";
import { carService } from "@/Services";
import { colors } from "@/Theme";

export default function NewListingScreen() {
  const { isLoggedIn, userId } = useAuth();
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [dailyPrice, setDailyPrice] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState("");

  if (!isLoggedIn || userId === null) {
    return <Redirect href="/auth/login?redirect=/listings/new" />;
  }
  const ownerId = userId;

  function handleSubmit() {
    const parsedYear = Number(year);
    const parsedPrice = Number(dailyPrice);
    if (
      !brand.trim() ||
      !model.trim() ||
      !city.trim() ||
      !Number.isInteger(parsedYear) ||
      parsedYear < 1886 ||
      !Number.isFinite(parsedPrice) ||
      parsedPrice <= 0
    ) {
      setError(
        "Enter a brand, model, valid year, city, and daily price greater than zero.",
      );
      return;
    }

    const now = new Date();
    carService.createCar(
      new Car(
        0,
        ownerId,
        brand,
        model,
        parsedYear,
        CarStatus.Available,
        parsedPrice,
        "DKK",
        new Location("Denmark", city),
        [],
        now,
        now,
      ),
    );
    router.replace("/listings");
  }

  return (
    <ScreenShell
      backHref="/listings"
      eyebrow="Listings"
      title="Add new car"
      description="Publish a car with its basic rental details."
    >
      <Field
        label="Brand"
        value={brand}
        onChangeText={setBrand}
        placeholder="Volvo"
      />
      <Field
        label="Model"
        value={model}
        onChangeText={setModel}
        placeholder="XC40"
      />
      <Field
        label="Year"
        value={year}
        onChangeText={setYear}
        placeholder="2024"
        keyboardType="number-pad"
      />
      <Field
        label="Daily price (DKK)"
        value={dailyPrice}
        onChangeText={setDailyPrice}
        placeholder="525"
        keyboardType="decimal-pad"
      />
      <Field
        label="City"
        value={city}
        onChangeText={setCity}
        placeholder="Odense"
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Pressable
        accessibilityRole="button"
        onPress={handleSubmit}
        style={styles.submitButton}
      >
        <Text style={styles.submitText}>Publish listing</Text>
      </Pressable>
    </ScreenShell>
  );
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  keyboardType?: "number-pad" | "decimal-pad";
}) {
  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        autoCapitalize="words"
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedText}
        style={styles.input}
        value={value}
      />{" "}
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "700",
    marginTop: 6,
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    color: colors.text,
    fontSize: 16,
    height: 52,
    paddingHorizontal: 14,
  },
  error: {
    color: colors.error,
    fontSize: 14,
  },
  submitButton: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 16,
    marginTop: 8,
    padding: 16,
  },
  submitText: {
    color: colors.textOnDark,
    fontSize: 16,
    fontWeight: "800",
  },
});
