import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { NavigationBar } from '@/Components/NavigationBar';
import { CarService } from '@/Services/CarService';

const BRANDS = ['All', 'Volvo', 'Toyota', 'Ford'];
const carService = new CarService();

export default function CarsScreen() {
  const [city, setCity] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [sortAscending, setSortAscending] = useState(true);
  const availableCars = useMemo(() => carService.getAvailableCars(), []);

  const visibleCars = useMemo(
    () =>
      availableCars
        .filter((car) => {
          const matchesCity = car.location.city.toLowerCase().includes(city.trim().toLowerCase());
          const matchesBrand = selectedBrand === 'All' || car.brand === selectedBrand;
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
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Browse Cars</Text>
        <View style={styles.headerIcons}>
          <Pressable accessibilityLabel="Notifications" hitSlop={8}>
            <Feather name="bell" size={22} color="#111" />
            <View style={styles.badgeDot} />
          </Pressable>
          <Pressable accessibilityLabel="Profile" hitSlop={8}>
            <Feather name="user" size={22} color="#111" />
          </Pressable>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headingRow}>
          <View>
            <Text style={styles.eyebrow}>Browse</Text>
            <Text style={styles.title}>Available cars</Text>
          </View>
          <Text style={styles.resultCount}>{visibleCars.length} cars</Text>
        </View>

        <TextInput
          autoCapitalize="words"
          onChangeText={setCity}
          placeholder="Search by city"
          placeholderTextColor="#777"
          style={styles.searchInput}
          value={city}
        />

        <View style={styles.controlRow}>
          <ScrollView
            contentContainerStyle={styles.brandFilters}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {BRANDS.map((brand) => (
              <Pressable
                accessibilityRole="button"
                key={brand}
                onPress={() => setSelectedBrand(brand)}
                style={[styles.filterButton, selectedBrand === brand && styles.filterButtonSelected]}
              >
                <Text style={[styles.filterText, selectedBrand === brand && styles.filterTextSelected]}>
                  {brand}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
          <Pressable
            accessibilityRole="button"
            onPress={() => setSortAscending((current) => !current)}
            style={styles.sortButton}
          >
            <Text style={styles.sortText}>{sortAscending ? 'Price +' : 'Price -'}</Text>
          </Pressable>
        </View>

        <View style={styles.list}>
          {visibleCars.length ? (
            visibleCars.map((car) => (
              <Pressable
                key={car.id}
                onPress={() => router.push(`/cars/${car.id}` as never)}
                style={({ pressed }) => [styles.carCard, pressed && styles.pressed]}
              >
                {car.imageUrls[0] ? (
                  <Image source={{ uri: car.imageUrls[0] }} style={styles.carImage} />
                ) : (
                  <View style={[styles.carImage, styles.imagePlaceholder]}>
                    <Feather name="image" size={22} color="#888" />
                  </View>
                )}
                <View style={styles.carBody}>
                  <Text style={styles.carName}>{car.brand} {car.model}</Text>
                  <Text style={styles.carMeta}>{car.year} · {car.location.city}</Text>
                  <Text style={styles.carPrice}>{car.dailyPrice} {car.currency} / day</Text>
                </View>
                <Feather name="chevron-right" size={20} color="#111" />
              </Pressable>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No cars found</Text>
              <Text style={styles.emptyText}>Try another city or clear the brand filter.</Text>
            </View>
          )}
        </View>
      </ScrollView>
      <NavigationBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { backgroundColor: '#fff', flex: 1 },
  content: { paddingBottom: 24, paddingHorizontal: 18 },
  header: {
    alignItems: 'center',
    borderBottomColor: '#ccc',
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: 56,
    justifyContent: 'center',
    marginBottom: 16,
    marginTop: 35,
  },
  headerTitle: { color: '#111', fontSize: 20, fontWeight: '700' },
  headerIcons: { flexDirection: 'row', gap: 20, position: 'absolute', right: 20 },
  badgeDot: { backgroundColor: '#111', borderRadius: 4, height: 7, position: 'absolute', right: -2, top: -2, width: 7 },
  headingRow: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  eyebrow: {
    color: '#426b63',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  title: { color: '#111', fontSize: 28, fontWeight: '600', marginTop: 3 },
  resultCount: { color: '#666', fontSize: 14, marginBottom: 4 },
  searchInput: {
    borderColor: '#222',
    borderWidth: 1,
    color: '#111',
    fontSize: 16,
    height: 46,
    paddingHorizontal: 14,
  },
  controlRow: { alignItems: 'center', flexDirection: 'row', marginTop: 12 },
  brandFilters: { alignItems: 'center', gap: 8, paddingRight: 8 },
  filterButton: { borderColor: '#1a1a1a', borderWidth: 1, paddingHorizontal: 12, paddingVertical: 8 },
  filterButtonSelected: { backgroundColor: '#111' },
  filterText: { color: '#222', fontSize: 14 },
  filterTextSelected: { color: '#fff', fontWeight: '700' },
  sortButton: { borderColor: '#1a1a1a', borderWidth: 1, paddingHorizontal: 10, paddingVertical: 8 },
  sortText: { color: '#222', fontSize: 13 },
  list: { gap: 12, marginTop: 18 },
  carCard: { alignItems: 'center', borderColor: '#1a1a1a', borderRadius: 10, borderWidth: 1, flexDirection: 'row', gap: 12, marginHorizontal: 0, padding: 12 },
  carImage: { borderRadius: 4, height: 96, width: 128 },
  imagePlaceholder: { alignItems: 'center', backgroundColor: '#ddd', borderColor: '#999', borderWidth: 1, justifyContent: 'center' },
  carBody: { flex: 1 },
  carName: { color: '#111', fontSize: 18, fontWeight: '700' },
  carMeta: { color: '#6b6b6b', fontSize: 14, marginTop: 6 },
  carPrice: { color: '#111', fontSize: 18, fontWeight: '700', marginTop: 8 },
  pressed: { opacity: 0.6 },
  emptyState: { borderColor: '#222', borderWidth: 1, padding: 24 },
  emptyTitle: { color: '#111', fontSize: 18, fontWeight: '700' },
  emptyText: { color: '#666', fontSize: 14, marginTop: 6 },
});
