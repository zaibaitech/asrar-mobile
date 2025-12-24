/**
 * Name Destiny Feature Entry Point
 * Mobile Implementation - Expo Go 54
 */

import { Stack } from 'expo-router';
import { AbjadProvider } from '@/features/name-destiny/contexts/AbjadContext';

export default function NameDestinyLayout() {
  return (
    <AbjadProvider>
      <Stack
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#4f46e5',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{ headerTitle: 'Name Destiny' }}
        />
        <Stack.Screen 
          name="input" 
          options={{ headerTitle: 'Calculate Destiny' }} 
        />
        <Stack.Screen 
          name="results" 
          options={{ headerTitle: 'Your Destiny' }} 
        />
        <Stack.Screen 
          name="history" 
          options={{ headerTitle: 'History' }} 
        />
      </Stack>
    </AbjadProvider>
  );
}
