import { useState } from 'react';
import { router, Redirect } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput } from 'react-native';
import { ScreenShell } from '@/Components/ScreenShell';
import { useAuth } from '@/Context/AuthContext';
import { CarRequest, Renter, TimePeriod } from '@/Models';
import { CarRequestService, UserService } from '@/Services';

const carRequestService = new CarRequestService();
const userService = new UserService();

export default function NewRequestScreen() {
  const { isLoggedIn, userEmail } = useAuth();
  const [budget, setBudget] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');

  if (!isLoggedIn || !userEmail) {
    return <Redirect href="/auth/login?redirect=/requests/new" />;
  }

  const authenticatedEmail = userEmail;

  function handleSubmit() {
    const renter = userService.getUserByEmail(authenticatedEmail);
    const parsedBudget = Number(budget);
    const parsedStartDate = new Date(`${startDate}T00:00:00`);
    const parsedEndDate = new Date(`${endDate}T00:00:00`);

    if (!renter || !budget || !Number.isFinite(parsedBudget) || parsedBudget <= 0) {
      setError('Enter a budget greater than zero.');
      return;
    }

    if (!startDate || !endDate || Number.isNaN(parsedStartDate.getTime()) || Number.isNaN(parsedEndDate.getTime())) {
      setError('Enter valid start and end dates.');
      return;
    }

    const period = new TimePeriod(parsedStartDate, parsedEndDate);
    if (!period.isValid()) {
      setError('The end date must be on or after the start date.');
      return;
    }

    const now = new Date();
    carRequestService.createRequest(
      new CarRequest(
        `request-${Date.now()}`,
        new Renter(
          renter.id,
          renter.firstName,
          renter.lastName,
          renter.email,
          renter.phoneNumber,
          renter.role,
          renter.isVerified,
          renter.createdAt,
          renter.updatedAt,
        ),
        parsedBudget,
        'DKK',
        period,
        undefined,
        now,
        now,
      ),
    );

    router.replace('/requests');
  }

  return (
    <ScreenShell backHref="/requests" eyebrow="New request" title="Add request" description="Set your budget and rental period so owners can respond.">
      <Text style={styles.label}>Maximum budget (DKK)</Text>
      <TextInput
        keyboardType="decimal-pad"
        onChangeText={(value) => {
          setBudget(value);
          setError('');
        }}
        placeholder="750"
        placeholderTextColor="#8a8a8a"
        style={styles.input}
        value={budget}
      />

      <Text style={styles.label}>Start date</Text>
      <TextInput
        autoCapitalize="none"
        onChangeText={(value) => {
          setStartDate(value);
          setError('');
        }}
        placeholder="YYYY-MM-DD"
        placeholderTextColor="#8a8a8a"
        style={styles.input}
        value={startDate}
      />

      <Text style={styles.label}>End date</Text>
      <TextInput
        autoCapitalize="none"
        onChangeText={(value) => {
          setEndDate(value);
          setError('');
        }}
        onSubmitEditing={handleSubmit}
        placeholder="YYYY-MM-DD"
        placeholderTextColor="#8a8a8a"
        returnKeyType="done"
        style={styles.input}
        value={endDate}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable accessibilityRole="button" onPress={handleSubmit} style={styles.submitButton}>
        <Text style={styles.submitText}>Save request</Text>
      </Pressable>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  label: { color: '#172321', fontSize: 15, fontWeight: '700', marginTop: 6 },
  input: {
    backgroundColor: '#ffffff',
    borderColor: '#dce5e2',
    borderRadius: 10,
    borderWidth: 1,
    color: '#172321',
    fontSize: 16,
    height: 52,
    paddingHorizontal: 14,
  },
  error: { color: '#b42318', fontSize: 14 },
  submitButton: { alignItems: 'center', backgroundColor: '#426b63', borderRadius: 10, marginTop: 8, padding: 16 },
  submitText: { color: '#ffffff', fontSize: 16, fontWeight: '800' },
});