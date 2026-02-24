import { Link, Stack, usePathname } from 'expo-router';
import { ActivityIndicator, StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';

export default function NotFoundScreen() {
  const pathname = usePathname();

  // OAuth callbacks may briefly land here while AuthService processes the redirect.
  // Show a silent loading state instead of the "Oops" error.
  if (pathname?.includes('auth/callback') || pathname?.includes('auth%2Fcallback')) {
    return (
      <>
        <Stack.Screen options={{ title: '', headerShown: false }} />
        <View style={styles.container}>
          <ActivityIndicator size="large" />
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <Text style={styles.title}>This screen doesn't exist.</Text>

        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
