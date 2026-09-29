import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';

// Typer
export type Car = {
    id: string;
    title: string;
    year: number;
    transmission: 'Automatic' | 'Manual';
    pricePerDay: number;
    imageUrl?: string;   
};

export type Props = {
    onOpenCar?: (car: Car) => void;
    onOpenFilter?: () => void;
    onOpenSort?: () => void;
    onPickDate?: (which: 'start' | 'end') => void;
};

export const MOCK_CARS: Car[] = [
  { id: '1', title: 'Kia Picanto', year: 2021, transmission: 'Automatic', pricePerDay: 48 },
  { id: '2', title: 'BMW X3', year: 2020, transmission: 'Automatic', pricePerDay: 72 },
  { id: '3', title: 'Toyota Corolla', year: 2022, transmission: 'Manual', pricePerDay: 55 },
];

export function CarCard({ car, onPress }: { car: Car; onPress?: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={`${car.title}, ${car.pricePerDay} dollars per day`}
    >
      {car.imageUrl ? (
        <Image source={{ uri: car.imageUrl }} style={styles.cardImage} />
      ) : (
        <View style={[styles.cardImage, styles.imagePlaceholder]}>
          <Feather name="image" size={22} color="#888" />
        </View>
      )}
 
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{car.title}</Text>
        <Text style={styles.cardMeta}>
          {car.year} · {car.transmission}
        </Text>
        <Text style={styles.cardPrice}>${car.pricePerDay} / day</Text>
      </View>
 
      <Feather name="chevron-right" size={20} color="#111" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1a1a1a',
    borderRadius: 10,
    padding: 12,
    gap: 12,
    marginRight: 18,
    marginLeft: 18,
  },
  cardImage: { width: 128, height: 96, borderRadius: 4 },
  imagePlaceholder: {
    backgroundColor: '#ddd',
    borderWidth: 1,
    borderColor: '#999',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: { flex: 1 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#111' },
  cardMeta: { fontSize: 14, color: '#6b6b6b', marginTop: 6 },
  cardPrice: { fontSize: 18, fontWeight: '700', color: '#111', marginTop: 8 },
    pressed: { opacity: 0.6 },
});
