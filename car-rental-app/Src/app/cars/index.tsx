import { useState } from 'react';
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationBar } from '@/Components/NavigationBar';
import { CarService } from '@/Services/CarService';

const BRANDS = ['All', 'Volvo', 'Toyota', 'Ford'];
const CAR_ACCENTS: Record<string, string> = {
  Volvo: '#dce8e6',
  Toyota: '#e8e1d8',
  Ford: '#e1e5ed',
};
const carService = new CarService();

export default function CarsScreen() {
  const [city, setCity] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [sortAscending, setSortAscending] = useState(true);
  const [availableCars] = useState(() => carService.getAvailableCars());

  const visibleCars = availableCars
    .filter((car) => {
      const matchesCity = car.location.city.toLowerCase().includes(city.trim().toLowerCase());
      const matchesBrand = selectedBrand === 'All' || car.brand === selectedBrand;
      return matchesCity && matchesBrand;
    })
    .sort((firstCar, secondCar) =>
      sortAscending ? firstCar.dailyPrice - secondCar.dailyPrice : secondCar.dailyPrice - firstCar.dailyPrice,
    );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topBar}>
          <View style={styles.wordmark}>
            <View style={styles.wordmarkLine} />
            <Text style={styles.wordmarkText}>DRIVE</Text>
          </View>
          <View style={styles.profileIcon}>
            <View style={styles.profileHead} />
            <View style={styles.profileBody} />
          </View>
        </View>

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
          placeholder="City"
          placeholderTextColor="#777777"
          style={styles.searchInput}
          value={city}
        />

        <View style={styles.controlRow}>
          <ScrollView contentContainerStyle={styles.brandFilters} horizontal showsHorizontalScrollIndicator={false}>
            {BRANDS.map((brand) => (
              <Pressable
                key={brand}
                onPress={() => setSelectedBrand(brand)}
                style={[styles.filterButton, selectedBrand === brand && styles.filterButtonSelected]}
              >
                <Text style={[styles.filterText, selectedBrand === brand && styles.filterTextSelected]}>{brand}</Text>
              </Pressable>
            ))}
          </ScrollView>
          <Pressable onPress={() => setSortAscending((current) => !current)} style={styles.sortButton}>
            <Text style={styles.sortText}>{sortAscending ? 'Price +' : 'Price -'}</Text>
          </Pressable>
        </View>

        <View style={styles.list}>
          {visibleCars.length ? (
            visibleCars.map((car) => (
              <Link key={car.id} href={`/cars/${car.id}` as never} asChild>
                <Pressable style={({ pressed }) => [styles.carCard, pressed && styles.carCardPressed]}>
                  <View style={[styles.carImage, { backgroundColor: CAR_ACCENTS[car.brand] ?? '#e5e5e5' }]}>
                    <View style={styles.carImageFrame}>
                      <Text style={styles.carImageText}>CAR</Text>
                    </View>
                  </View>
                  <View style={styles.carInfo}>
                    <View style={styles.carTitleRow}>
                      <Text style={styles.carName}>{car.brand} {car.model}</Text>
                      <Text style={styles.chevron}>›</Text>
                    </View>
                    <Text style={styles.carMeta}>{car.year}  |  Available</Text>
                    <Text style={styles.carLocation}>{car.location.city}</Text>
                    <Text style={styles.carPrice}>{car.dailyPrice} {car.currency} <Text style={styles.priceUnit}>/ day</Text></Text>
                  </View>
                </Pressable>
              </Link>
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
  safeArea: { backgroundColor: '#ffffff', flex: 1 },
  content: { paddingBottom: 28, paddingHorizontal: 24, paddingTop: 14 },
  topBar: {
    alignItems: 'center',
    borderColor: '#222222',
    borderWidth: 1.5,
    flexDirection: 'row',
    height: 58,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  wordmark: { alignItems: 'center', flexDirection: 'row', gap: 8 },
  wordmarkLine: { backgroundColor: '#222222', height: 4, width: 42 },
  wordmarkText: { color: '#222222', fontSize: 14, fontWeight: '800', letterSpacing: 1.8 },
  profileIcon: { height: 36, position: 'relative', width: 36 },
  profileHead: {
    borderColor: '#263140',
    borderRadius: 12,
    borderWidth: 2,
    height: 21,
    left: 7,
    position: 'absolute',
    top: 0,
    width: 21,
  },
  profileBody: {
    borderColor: '#263140',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 2,
    bottom: 0,
    height: 17,
    position: 'absolute',
    width: 36,
  },
  headingRow: { alignItems: 'flex-end', flexDirection: 'row', justifyContent: 'space-between', marginTop: 26 },
  eyebrow: { color: '#426b63', fontSize: 13, fontWeight: '800', letterSpacing: 1.2, textTransform: 'uppercase' },
  title: { color: '#111111', fontSize: 28, fontWeight: '600', marginTop: 3 },
  resultCount: { color: '#666666', fontSize: 14, marginBottom: 4 },
  searchInput: {
    borderColor: '#222222',
    borderWidth: 1.5,
    color: '#111111',
    fontSize: 17,
    height: 48,
    marginTop: 20,
    paddingHorizontal: 14,
  },
  controlRow: { alignItems: 'center', flexDirection: 'row', marginTop: 12 },
  brandFilters: { alignItems: 'center', gap: 8, paddingRight: 10 },
  filterButton: { borderColor: '#222222', borderWidth: 1, paddingHorizontal: 13, paddingVertical: 8 },
  filterButtonSelected: { backgroundColor: '#3157c8' },
  filterText: { color: '#222222', fontSize: 14 },
  filterTextSelected: { color: '#ffffff', fontWeight: '700' },
  sortButton: { borderColor: '#222222', borderWidth: 1, paddingHorizontal: 10, paddingVertical: 8 },
  sortText: { color: '#222222', fontSize: 13 },
  list: { gap: 12, marginTop: 18 },
  carCard: { borderColor: '#222222', borderWidth: 1.5, flexDirection: 'row', minHeight: 136, padding: 10 },
  carCardPressed: { backgroundColor: '#f1f1f1' },
  carImage: { alignItems: 'center', justifyContent: 'center', width: 118 },
  carImageFrame: { alignItems: 'center', borderColor: '#53606a', borderWidth: 1, height: 66, justifyContent: 'center', width: 88 },
  carImageText: { color: '#53606a', fontSize: 13, fontWeight: '700', letterSpacing: 1.5 },
  carInfo: { flex: 1, paddingLeft: 14, paddingVertical: 2 },
  carTitleRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  carName: { color: '#111111', flex: 1, fontSize: 18, fontWeight: '700' },
  chevron: { color: '#3157c8', fontSize: 28, lineHeight: 24, paddingLeft: 4 },
  carMeta: { color: '#555555', fontSize: 13, marginTop: 7 },
  carLocation: { color: '#555555', fontSize: 13, marginTop: 3 },
  carPrice: { color: '#111111', fontSize: 16, fontWeight: '700', marginTop: 10 },
  priceUnit: { color: '#666666', fontSize: 12, fontWeight: '400' },
  emptyState: { borderColor: '#222222', borderWidth: 1, padding: 24 },
  emptyTitle: { color: '#111111', fontSize: 18, fontWeight: '700' },
  emptyText: { color: '#666666', fontSize: 14, marginTop: 6 },
});
