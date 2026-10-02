import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { CarFilterButtons } from "@/Components/CarFilterButtons";
import { NavigationBar } from "@/Components/NavigationBar";
import { SearchBar } from "@/Components/SearchBar";
import { carService } from "@/Services";
import { colors } from "@/Theme";

const BRANDS = ["All", "Volvo", "Toyota", "Ford"];
export default function CarsScreen() {
  const [city, setCity] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [sortAscending, setSortAscending] = useState(true);
  const [availableCars, setAvailableCars] = useState(() =>
    carService.getAvailableCars(),
  );
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadCars() {
      try {
        await carService.importCarsFromApi();
        if (isMounted) setAvailableCars(carService.getAvailableCars());
      } catch (error: unknown) {
        console.error("Failed to load cars from the remote catalogue.", error);
        if (isMounted) {
          setLoadError(
            "Unable to refresh the car catalogue. Showing saved cars instead.",
          );
          setAvailableCars(carService.getAvailableCars());
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void loadCars();
    return () => {
      isMounted = false;
    };
  }, []);

  const visibleCars = useMemo(
    () =>
      availableCars
        .filter((car) => {
          const matchesCity = car.location.city
            .toLowerCase()
            .includes(city.trim().toLowerCase());
          const matchesBrand =
            selectedBrand === "All" || car.brand === selectedBrand;
          return matchesCity && matchesBrand;
        })
        .sort((firstCar, secondCar) =>
          sortAscending
            ? firstCar.dailyPrice - secondCar.dailyPrice
            : secondCar.dailyPrice - firstCar.dailyPrice,
        ),
    [availableCars, city, selectedBrand, sortAscending],
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Browse Cars</Text>
        <View style={styles.headerIcons}>
          <Pressable accessibilityLabel="Notifications" hitSlop={8}>
            <Feather name="bell" size={22} color={colors.text} />
            <View style={styles.badgeDot} />
          </Pressable>
          <Pressable accessibilityLabel="Profile" hitSlop={8}>
            <Feather name="user" size={22} color={colors.text} />
          </Pressable>
        </View>
      </View>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headingRow}>
          <View>
            <Text style={styles.eyebrow}>Browse</Text>
            <Text style={styles.title}>Available cars</Text>
          </View>
          <Text style={styles.resultCount}>
            {isLoading ? "Loading..." : `${visibleCars.length} cars`}
          </Text>
        </View>

        {loadError ? <Text style={styles.loadError}>{loadError}</Text> : null}

        <SearchBar
          autoCapitalize="words"
          onChangeText={setCity}
          placeholder="Search by city"
          placeholderTextColor={colors.mutedText}
          value={city}
        />

        <View style={styles.controlRow}>
          <CarFilterButtons
            onSelect={setSelectedBrand}
            options={BRANDS}
            selectedOption={selectedBrand}
          />
          <Pressable
            accessibilityRole="button"
            onPress={() => setSortAscending((current) => !current)}
            style={styles.sortButton}
          >
            <Text style={styles.sortText}>
              {sortAscending ? "Price +" : "Price -"}
            </Text>
          </Pressable>
        </View>

        <View style={styles.list}>
          {visibleCars.length ? (
            visibleCars.map((car) => (
              <Pressable
                key={car.id}
                onPress={() => router.push(`/cars/${car.id}` as never)}
                style={({ pressed }) => [
                  styles.carCard,
                  pressed && styles.pressed,
                ]}
              >
                {car.imageUrls[0] ? (
                  <Image
                    source={{ uri: car.imageUrls[0] }}
                    style={styles.carImage}
                  />
                ) : (
                  <View style={[styles.carImage, styles.imagePlaceholder]}>
                    <Feather
                      name="image"
                      size={22}
                      color={colors.secondaryText}
                    />
                  </View>
                )}
                <View style={styles.carBody}>
                  <Text style={styles.carName}>
                    {car.brand} {car.model}
                  </Text>
                  <Text style={styles.carMeta}>
                    {car.year} · {car.location.city}
                  </Text>
                  <Text style={styles.carPrice}>
                    {car.dailyPrice} {car.currency} / day
                  </Text>
                </View>
                <Feather name="chevron-right" size={20} color={colors.text} />
              </Pressable>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No cars found</Text>
              <Text style={styles.emptyText}>
                Try another city or clear the brand filter.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      <NavigationBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    paddingBottom: 24,
    paddingHorizontal: 18,
  },
  header: {
    alignItems: "center",
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: 56,
    justifyContent: "center",
    marginBottom: 16,
    marginTop: 35,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "700",
  },
  headerIcons: {
    flexDirection: "row",
    gap: 20,
    position: "absolute",
    right: 20,
  },
  badgeDot: {
    backgroundColor: colors.primary,
    borderRadius: 4,
    height: 7,
    position: "absolute",
    right: -2,
    top: -2,
    width: 7,
  },
  headingRow: {
    alignItems: "flex-end",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "600",
    marginTop: 3,
  },
  resultCount: {
    color: colors.secondaryText,
    fontSize: 14,
    marginBottom: 4,
  },
  loadError: {
    color: colors.error,
    fontSize: 14,
    marginTop: 8,
  },
  controlRow: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: 12,
  },
  sortButton: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  sortText: {
    color: colors.text,
    fontSize: 13,
  },
  list: {
    gap: 14,
    marginTop: 18,
  },
  carCard: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    marginHorizontal: 0,
    padding: 12,
  },
  carImage: {
    borderRadius: 12,
    height: 96,
    width: 128,
  },
  imagePlaceholder: {
    alignItems: "center",
    backgroundColor: colors.mutedText,
    borderColor: colors.border,
    borderWidth: 1,
    justifyContent: "center",
  },
  carBody: {
    flex: 1,
  },
  carName: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
  },
  carMeta: {
    color: colors.secondaryText,
    fontSize: 14,
    marginTop: 6,
  },
  carPrice: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: "700",
    marginTop: 8,
  },
  pressed: {
    opacity: 0.6,
  },
  emptyState: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    padding: 24,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
  },
  emptyText: {
    color: colors.secondaryText,
    fontSize: 14,
    marginTop: 6,
  },
});
