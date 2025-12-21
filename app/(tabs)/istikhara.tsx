/**
 * Istikhara Tab - Archived/Hidden
 * This tab is hidden from navigation (href: null in _layout.tsx)
 * Main Istikhara form is now on the Calculator tab (index.tsx)
 */
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default function IstikharaTab() {
  const router = useRouter();

  // Redirect to the main calculator tab if accessed directly
  useEffect(() => {
    router.replace('/(tabs)/');
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
    paddingVertical: 20,
    paddingHorizontal: 32,
  },
  primaryButtonIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  primaryButtonText: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 24,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  historyButtonIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  historyButtonText: {
    fontSize: 15,
    color: '#ffffff',
    fontWeight: '500',
  },
  footer: {
    marginTop: 32,
    paddingHorizontal: 16,
    maxWidth: 400,
  },
  footerText: {
    fontSize: 13,
    color: '#8892b0',
    textAlign: 'center',
    lineHeight: 20,
  },
});
