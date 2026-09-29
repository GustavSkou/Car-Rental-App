import React from 'react';
import { View, Text, StyleSheet, Pressable, ListRenderItem } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import Header from '../components/Header';
import { Car, MOCK_CARS } from '../components/cars';
import { CarCard } from '../components/cars';

export default function Browsepage() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar style="dark" />
      <Header />
      <CarCard car={MOCK_CARS[0]} onPress={() => console.log('Car pressed')} />
      <CarCard car={MOCK_CARS[1]} onPress={() => console.log('Car pressed')} />
      <CarCard car={MOCK_CARS[2]} onPress={() => console.log('Car pressed')} />
      {/* Resten af siden kommer her */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  outlineButton: {
    flex: 1,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#1a1a1a',
    borderRadius: 6,
  },
  outlineButtonText: { fontSize: 18, fontWeight: '700', color: '#111' },
  pressed: { opacity: 0.6 },
});

export function OutlineButton({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.outlineButton, pressed && styles.pressed]}
      accessibilityRole="button"
    >
      <Feather name={icon} size={18} color="#111" />
      <Text style={styles.outlineButtonText}>{label}</Text>
    </Pressable>
  );
}
