/**
 * Istikhara Tab - Archived/Hidden
 * This tab is hidden from navigation (href: null in _layout.tsx)
 * Main Istikhara form is now on the Calculator tab (index.tsx)
 */
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export default function IstikharaTab() {
  const router = useRouter();

  // Redirect to the main calculator tab if accessed directly
  useEffect(() => {
    router.replace('/(tabs)');
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#7C3AED" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
  },
});
