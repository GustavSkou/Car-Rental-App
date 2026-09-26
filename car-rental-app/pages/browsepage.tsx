import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';

  function Header() {
    return (
      <View style={styles.header}>
        <Text style={styles.headerTitle}> Browse Cars</Text>
        <View style={styles.headerIcons}>
          <Pressable hitSlop={8} accessibilityLabel="Notifications">
            <Feather name="bell" size={22} color="#111" />
            <View style={styles.badgeDot} />
          </Pressable>
          <Pressable hitSlop={8} accessibilityLabel="Profile">
            <Feather name="user" size={22} color="#111" />
          </Pressable>
        </View>
      </View> 
    )
  }
export default function Browsepage() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar style="dark" />
      <Header />
      {/* Resten af siden kommer her */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
 
  header: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#111' },
  headerIcons: {
    position: 'absolute',
    right: 20,
    flexDirection: 'row',
    gap: 20,
  },
  badgeDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#111',
  }
});