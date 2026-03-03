import { Stack } from 'expo-router';

/**
 * Auth routes layout configuration
 * 
 * Ensures all auth-related screens have no headers
 * for a clean, branded experience.
 */
export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        // Prevent back navigation to callback screen
        gestureEnabled: false,
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="callback" 
        options={{ 
          headerShown: false,
          // Prevent back navigation from callback
          gestureEnabled: false,
        }} 
      />
    </Stack>
  );
}
