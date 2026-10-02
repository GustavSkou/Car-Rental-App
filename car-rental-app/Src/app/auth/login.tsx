import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/Context/AuthContext";
import { NavigationBar } from "@/Components/NavigationBar";
import { colors } from "@/Theme";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const { redirect } = useLocalSearchParams<{ redirect?: string }>();

  function handleLogin() {
    if (login(email, password)) {
      const destination =
        redirect === "/bookings" ||
        redirect === "/requests" ||
        redirect === "/cars" ||
        redirect?.startsWith("/cars/")
          ? redirect
          : "/listings";

      router.replace(destination as never);
      return;
    }

    setError("The email or password is incorrect.");
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
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

          <View style={styles.form}>
            <Text style={styles.title}>Log in to continue</Text>

            <Text style={styles.label}>Email</Text>
            <TextInput
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              keyboardType="email-address"
              onChangeText={(value) => {
                setEmail(value);
                setError("");
              }}
              placeholder="name@gmail.com"
              placeholderTextColor={colors.mutedText}
              style={styles.input}
              value={email}
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              autoCapitalize="none"
              autoComplete="current-password"
              onChangeText={(value) => {
                setPassword(value);
                setError("");
              }}
              onSubmitEditing={handleLogin}
              placeholder="**********"
              placeholderTextColor={colors.mutedText}
              returnKeyType="done"
              secureTextEntry
              style={styles.input}
              value={password}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Log in"
              onPress={handleLogin}
              style={({ pressed }) => [
                styles.loginButton,
                pressed && styles.loginButtonPressed,
              ]}
            >
              <Text style={styles.loginText}>Log In</Text>
            </Pressable>

            <Pressable
              onPress={() => router.push("/auth/register" as never)}
              style={styles.registerLink}
            >
              <Text style={styles.registerText}>Need an account? Register</Text>
            </Pressable>
          </View>
        </ScrollView>

        <NavigationBar />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 44,
    paddingTop: 14,
  },
  topBar: {
    alignItems: "center",
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    height: 64,
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  wordmark: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  wordmarkLine: {
    backgroundColor: colors.primary,
    borderRadius: 2,
    height: 4,
    width: 42,
  },
  wordmarkText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 1.8,
  },
  profileIcon: {
    height: 42,
    position: "relative",
    width: 42,
  },
  profileHead: {
    borderColor: colors.primary,
    borderRadius: 14,
    borderWidth: 2,
    height: 25,
    left: 8,
    position: "absolute",
    top: 0,
    width: 25,
  },
  profileBody: {
    borderColor: colors.primary,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 2,
    bottom: 0,
    height: 20,
    position: "absolute",
    width: 42,
  },
  form: {
    paddingTop: 46,
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "500",
    marginBottom: 14,
  },
  label: {
    color: colors.text,
    fontSize: 20,
    marginBottom: 10,
    marginTop: 2,
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    color: colors.text,
    fontSize: 18,
    height: 54,
    marginBottom: 12,
    paddingHorizontal: 14,
  },
  error: {
    color: colors.error,
    fontSize: 14,
    marginBottom: 4,
  },
  loginButton: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 14,
    paddingVertical: 13,
    width: 142,
  },
  loginButtonPressed: {
    opacity: 0.75,
  },
  loginText: {
    color: colors.textOnDark,
    fontSize: 19,
    fontWeight: "700",
  },
  registerLink: {
    alignSelf: "flex-start",
    marginTop: 24,
  },
  registerText: {
    color: colors.secondaryText,
    fontSize: 15,
    textDecorationLine: "underline",
  },
});
