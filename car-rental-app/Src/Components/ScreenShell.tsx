import { PropsWithChildren } from 'react';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NavigationBar } from './NavigationBar';

type ScreenShellProps = PropsWithChildren<{
  eyebrow?: string;
  title: string;
  description?: string;
  backHref?: string;
}>;

export function ScreenShell({ eyebrow, title, description, backHref, children }: ScreenShellProps) {
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
        {description ? <Text style={styles.description}>{description}</Text> : null}
        <View style={styles.body}>{children}</View>
      </ScrollView>
      <NavigationBar />
    </SafeAreaView>
  );
}

export function RouteLink({ href, label, detail }: { href: string; label: string; detail?: string }) {
  return (
    <Link href={href as never} asChild>
      <Pressable style={styles.routeLink}>
        <Text style={styles.routeLabel}>{label}</Text>
        {detail ? <Text style={styles.routeDetail}>{detail}</Text> : null}
      </Pressable>
    </Link>
  );
}

export function ActionButton({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href as never} asChild>
      <Pressable style={styles.actionButton}>
        <Text style={styles.actionText}>{label}</Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f4f6f8' },
  content: { padding: 24, paddingBottom: 48 },
  backButton: { alignSelf: 'flex-start', marginBottom: 28 },
  backText: { color: '#426b63', fontSize: 15, fontWeight: '700' },
  eyebrow: { color: '#b46b35', fontSize: 12, fontWeight: '800', letterSpacing: 1.5, textTransform: 'uppercase' },
  title: { color: '#172321', fontSize: 34, fontWeight: '800', marginTop: 8 },
  description: { color: '#60706d', fontSize: 16, lineHeight: 24, marginTop: 10 },
  body: { gap: 12, marginTop: 28 },
  routeLink: { backgroundColor: '#ffffff', borderColor: '#dce5e2', borderRadius: 10, borderWidth: 1, padding: 18 },
  routeLabel: { color: '#172321', fontSize: 17, fontWeight: '700' },
  routeDetail: { color: '#6f7d7a', fontSize: 14, marginTop: 5 },
  actionButton: { alignItems: 'center', backgroundColor: '#426b63', borderRadius: 10, padding: 16 },
  actionText: { color: '#ffffff', fontSize: 16, fontWeight: '800' },
});