import { Text, View } from '@/components/Themed';
import { handleAuthCallback } from '@/services/AuthService';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';

/**
 * OAuth / Email-verification callback screen.
 *
 * Route: asrariya://auth/callback  (deep link)
 *        /auth/callback            (in-app)
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

  useEffect(() => {
    async function process() {
      try {
        // OAuth PKCE flow — has `code`, handled by AuthService's WebBrowser listener
        if (params.code && !params.type) {
          // AuthService already exchanged the code. Just wait briefly and go home.
          await new Promise((r) => setTimeout(r, 500));
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
      <ActivityIndicator size="large" color="#6366f1" />
      <Text style={styles.text}>Completing sign-in…</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f172a',
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: '#94a3b8',
  },
});
