import { handleAuthCallback } from '@/services/AuthService';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, StyleSheet, Text, View } from 'react-native';

/**
 * OAuth / Email-verification callback screen.
 *
 * Route: asrariya://auth/callback  (deep link)
 *        /auth/callback            (in-app)
 *
 * Enterprise-grade branded loading screen with:
 * - Full-screen dark background matching app theme
 * - Smooth fade animation
 * - Single execution guarantee
 * - Instant redirect after session processing
 * - No headers, no fallback UI, no flashing
 *
 * For Google OAuth (PKCE):
 *   WebBrowser.openAuthSessionAsync() already intercepts the redirect,
 *   so this screen is rarely reached during OAuth. It serves as a
 *   safety-net: if the URL does arrive here, we process it and redirect.
 *
 * For email-verification / password-reset links:
 *   Supabase sends `asrariya://auth/callback?type=signup&access_token=…`
 *   which lands here when the app is opened from a cold start.
 */
export default function AuthCallbackScreen() {
  const router = useRouter();
  const params = useGlobalSearchParams<{
    code?: string;
    access_token?: string;
    refresh_token?: string;
    type?: string;
    error?: string;
    error_description?: string;
  }>();

  // Prevent double execution (Android re-render protection)
  const hasProcessed = useRef(false);
  
  // Fade animation for smooth entrance
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Start fade-in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    // Process callback only once
    if (hasProcessed.current) {
      return;
    }
    hasProcessed.current = true;

    async function process() {
      try {
        // OAuth PKCE flow — has `code`, handled by AuthService's WebBrowser listener
        if (params.code && !params.type) {
          // AuthService already exchanged the code. Redirect instantly.
          router.replace('/(tabs)');
          return;
        }

        // Error from Supabase
        if (params.error) {
          console.error('[auth/callback] Error:', params.error, params.error_description);
          router.replace('/auth');
          return;
        }

        // Email verification or password reset
        if (params.access_token && params.refresh_token) {
          const result = await handleAuthCallback({
            access_token: params.access_token,
            refresh_token: params.refresh_token,
            type: params.type,
            error: params.error,
            error_description: params.error_description,
          });

          if (result.error) {
            console.error('[auth/callback] handleAuthCallback error:', result.error.message);
            router.replace('/auth');
            return;
          }

          if (params.type === 'recovery') {
            router.replace('/reset-password');
          } else {
            router.replace('/(tabs)');
          }
          return;
        }

        // Fallback — nothing useful in the URL, go home
        router.replace('/(tabs)');
      } catch (err) {
        console.error('[auth/callback] Unexpected error:', err);
        router.replace('/(tabs)');
      }
    }

    process();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text style={styles.text}>Completing secure sign-in…</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#070A1A', // App dark theme background
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: '500',
    color: '#94A3B8',
    letterSpacing: 0.3,
  },
});
