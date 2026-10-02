import { PropsWithChildren } from "react";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { NavigationBar } from "./NavigationBar";
import { colors } from "../Theme";

type ScreenShellProps = PropsWithChildren<{
  eyebrow?: string;
  title: string;
  description?: string;
  backHref?: string;
}>;

export function ScreenShell({
  eyebrow,
  title,
  description,
  backHref,
  children,
}: ScreenShellProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        {backHref ? (
          <Link href={backHref as never} asChild>
            <Pressable style={styles.backButton}>
              <Text style={styles.backText}>Back</Text>
            </Pressable>
          </Link>
        ) : null}
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.title}>{title}</Text>
        {description ? (
          <Text style={styles.description}>{description}</Text>
        ) : null}
        <View style={styles.body}>{children}</View>
      </ScrollView>
      <NavigationBar />
    </SafeAreaView>
  );
}

export function RouteLink({
  href,
  label,
  detail,
}: {
  href: string;
  label: string;
  detail?: string;
}) {
  return (
    <Link href={href as never} asChild>
      <Pressable style={styles.routeLink}>
        <Text style={styles.routeLabel}>{label}</Text>
        {detail ? <Text style={styles.routeDetail}>{detail}</Text> : null}
      </Pressable>
    </Link>
  );
}

export function ActionButton({
  href,
  label,
  onPress,
}: {
  href?: string;
  label: string;
  onPress?: () => void;
}) {
  if (onPress) {
    return (
      <Pressable onPress={onPress} style={styles.actionButton}>
        <Text style={styles.actionText}>{label}</Text>
      </Pressable>
    );
  }

  return (
    <Link href={href! as never} asChild>
      <Pressable style={styles.actionButton}>
        <Text style={styles.actionText}>{label}</Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 24,
    paddingBottom: 48,
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 28,
  },
  backText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "700",
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  title: {
    color: colors.text,
    fontSize: 34,
    fontWeight: "800",
    marginTop: 8,
  },
  description: {
    color: colors.secondaryText,
    fontSize: 16,
    lineHeight: 24,
    marginTop: 10,
  },
  body: {
    gap: 12,
    marginTop: 28,
  },
  routeLink: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 10,
    borderWidth: 1,
    padding: 18,
  },
  routeLabel: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "700",
  },
  routeDetail: {
    color: colors.secondaryText,
    fontSize: 14,
    marginTop: 5,
  },
  actionButton: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 16,
  },
  actionText: {
    color: colors.textOnDark,
    fontSize: 16,
    fontWeight: "800",
  },
});
