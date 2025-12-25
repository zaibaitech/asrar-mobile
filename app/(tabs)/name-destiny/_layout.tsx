/**
 * Name Destiny Stack Navigator (inside Tabs)
 * This keeps bottom tabs visible throughout the Name Destiny flow
 */

import { AbjadProvider } from '@/features/name-destiny/contexts/AbjadContext';
import { Stack } from 'expo-router';

export default function NameDestinyStackLayout() {
  return (
    <AbjadProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{ 
            headerShown: false,
            title: 'Name Destiny',
          }} 
        />
        <Stack.Screen 
          name="form" 
          options={{ 
            headerShown: false,
            title: 'Name Destiny Calculator',
          }} 
        />
        <Stack.Screen 
          name="results" 
          options={{ 
            headerShown: false,
            title: 'Your Destiny',
          }} 
        />
      </Stack>
    </AbjadProvider>
  );
}
