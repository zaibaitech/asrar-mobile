/**
 * Name Destiny Feature Entry Point
 * Mobile Implementation - Expo Go 54
 */

import { AbjadProvider } from '@/features/name-destiny/contexts/AbjadContext';
import { Stack } from 'expo-router';

export default function NameDestinyLayout() {
  return (
    <AbjadProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="form" options={{ headerShown: false }} />
        <Stack.Screen name="input" options={{ headerShown: false }} />
        <Stack.Screen name="results" options={{ headerShown: false }} />
        <Stack.Screen
          name="history"
          options={{
            headerShown: true,
            headerTitle: 'History',
            headerStyle: {
              backgroundColor: '#4f46e5',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: '600',
            },
          }}
        />
      </Stack>
    </AbjadProvider>
  );
}
