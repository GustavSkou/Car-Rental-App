import { useState } from 'react';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput } from 'react-native';
import { ScreenShell } from '@/Components/ScreenShell';
import { User } from '@/Models';
import { userService } from '@/Services';

export default function RegisterScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');

  function register() {
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password || !phoneNumber.trim()) {
      setError('Please complete all fields.');
      return;
    }

    try {
      userService.createUser(new User(
        0,
        firstName.trim(),
        lastName.trim(),
        email.trim(),
        phoneNumber.trim(),
        false,
        new Date(),
        new Date(),
        password,
      ));
      router.replace('/auth/login' as never);
    } catch (registrationError) {
      setError(registrationError instanceof Error ? registrationError.message : 'Unable to create account.');
    }
  }

  return (
    <ScreenShell backHref="/auth/login" eyebrow="Get started" title="Register" description="Set up an account to rent a car or publish your own listing.">
      {[
        ['First name', firstName, setFirstName],
        ['Last name', lastName, setLastName],
        ['Email', email, setEmail],
        ['Phone number', phoneNumber, setPhoneNumber],
      ].map(([label, value, setValue]) => (
        <TextInput
          key={label as string}
          autoCapitalize={label === 'Email' ? 'none' : 'words'}
          keyboardType={label === 'Email' ? 'email-address' : 'default'}
          onChangeText={setValue as (value: string) => void}
          placeholder={label as string}
          style={styles.input}
          value={value as string}
        />
      ))}
      <TextInput
        autoCapitalize="none"
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={password}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Pressable onPress={register} style={styles.button}>
        <Text style={styles.buttonText}>Create account</Text>
      </Pressable>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  input: { backgroundColor: '#ffffff', borderColor: '#dce5e2', borderWidth: 1, borderRadius: 8, padding: 14 },
  error: { color: '#b42318' },
  button: { alignItems: 'center', backgroundColor: '#426b63', borderRadius: 8, padding: 16 },
  buttonText: { color: '#ffffff', fontWeight: '800' },
});