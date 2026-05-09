import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as Linking from 'expo-linking';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AnimatedSplash } from '@/components/AnimatedSplash';
import { AppErrorBoundary } from '@/components/AppErrorBoundary';
import { NotificationInitializer } from '@/components/NotificationInitializer';
import { NotificationTapHandler } from '@/components/NotificationTapHandler';
import { useColorScheme } from '@/components/useColorScheme';
import { AdProvider } from '@/contexts/AdContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ProfileProvider, useProfile } from '@/contexts/ProfileContext';
import { SubscriptionProvider } from '@/contexts/SubscriptionContext';
import { ZikrProvider } from '@/features/zikr';
import { prefetchCoreCaches } from '@/services/AppPrefetchService';
import { handleAuthCallback } from '@/services/AuthService';
import { getOnboardingCompleted } from '@/services/OnboardingService';
import type { PartialProfileUpdate, UserProfile } from '@/types/user-profile';
import { installGlobalErrorHandlers } from '@/utils/globalErrorHandlers';
import { initializeStorage } from '@/utils/storageInitializer';

type RootLayoutNavProps = Readonly<{
  showAnimatedSplash: boolean;
  setShowAnimatedSplash: (val: boolean) => void;
}>;

type AuthCallbackQueryParams = {
  access_token?: string;
  refresh_token?: string;
  type?: string;
  error?: string;
  error_description?: string;
  code?: string;
  expires_in?: string;
  token_type?: string;
};

const ALLOWED_DEEP_LINK_ROUTES = new Set([
  'share',
  'quran',
  'auth',
  'email-verification',
  'reset-password',
  '(screens)',
]);

function isAllowedDeepLinkRoute(rootSegment?: string): boolean {
  return !!rootSegment && ALLOWED_DEEP_LINK_ROUTES.has(rootSegment);
}

function profileHasEssentialData(profile: { nameAr?: string; nameLatin?: string; dobISO?: string }): boolean {
  return Boolean(profile.nameAr || profile.nameLatin || profile.dobISO);
}

function showRouteAlert(
  title: string,
  message: string,
  buttonText: string,
  onPress: () => void,
): void {
  Alert.alert(title, message, [{ text: buttonText, onPress }]);
}

async function handleRecoveryDeepLink(
  queryParams: AuthCallbackQueryParams,
  setProfile: (updates: PartialProfileUpdate) => Promise<void>,
  router: ReturnType<typeof useRouter>,
): Promise<boolean> {
  const { access_token, refresh_token, type, error, error_description, expires_in, token_type } = queryParams;
  if (type !== 'recovery' || !access_token || !refresh_token) {
    return false;
  }

  const result = await handleAuthCallback({
    access_token,
    refresh_token,
    type,
    error,
    error_description,
    expires_in,
    token_type,
  });

  if (result.error) {
    showRouteAlert('Reset Link Invalid', result.error.message, 'OK', () => router.replace('/auth'));
    return true;
  }

  await setProfile({ mode: 'account' });
  router.replace('/reset-password');
  return true;
}

async function handleSignupDeepLink(
  queryParams: AuthCallbackQueryParams,
  profile: Pick<UserProfile, 'nameAr' | 'nameLatin' | 'dobISO'>,
  setProfile: (updates: PartialProfileUpdate) => Promise<void>,
  router: ReturnType<typeof useRouter>,
): Promise<boolean> {
  const { access_token, refresh_token, type } = queryParams;
  if (type !== 'signup' || !access_token || !refresh_token) {
    return false;
  }

  console.log('✅ Email verified! Processing...');
  await setProfile({ mode: 'account' });

  if (profileHasEssentialData(profile)) {
    showRouteAlert('✅ Welcome!', 'Your email has been verified successfully.', 'Continue', () => router.replace('/(tabs)'));
    return true;
  }

  showRouteAlert(
    '✅ Email Verified!',
    'Please complete your profile to unlock personalized features.',
    'Complete Profile',
    () => router.replace('/profile?postSave=home'),
  );
  return true;
}

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  // Ensure proper initial route handling
  initialRouteName: '(onboarding)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
void SplashScreen.preventAutoHideAsync().catch(() => {
  // best-effort; ignore
});

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });
  const [showAnimatedSplash, setShowAnimatedSplash] = useState(true);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      void SplashScreen.hideAsync().catch(() => {
        // best-effort; ignore
      });
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav showAnimatedSplash={showAnimatedSplash} setShowAnimatedSplash={setShowAnimatedSplash} />;
}

function RootLayoutNav({ showAnimatedSplash, setShowAnimatedSplash }: RootLayoutNavProps) {
  const colorScheme = useColorScheme();

  useEffect(() => {
    installGlobalErrorHandlers();
    // Initialize storage with automatic error handling and cleanup
    initializeStorage().catch((error) => {
      console.error('Storage initialization failed:', error);
    });
  }, []);

  // Best-effort prefetch so tabs/widgets can render instantly.
  // Avoids repeated network bursts during transitions.
  useEffect(() => {
    prefetchCoreCaches().catch(() => {
      // best-effort; ignore
    });
  }, []);

  return (
    <SafeAreaProvider>
      <ProfileProvider>
        <SubscriptionProvider>
          <AdProvider>
            <LanguageProvider>
              <ZikrProvider>
                <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                  <RootLayoutContent showAnimatedSplash={showAnimatedSplash} setShowAnimatedSplash={setShowAnimatedSplash} />
                </ThemeProvider>
              </ZikrProvider>
            </LanguageProvider>
          </AdProvider>
        </SubscriptionProvider>
      </ProfileProvider>
    </SafeAreaProvider>
  );
}

function RootLayoutContent({ showAnimatedSplash, setShowAnimatedSplash }: RootLayoutNavProps) {
  return (
    <AppErrorBoundary>
      <OnboardingGate />
      <DeepLinkHandler />
      <NotificationInitializer />
      <NotificationTapHandler />
      <Stack>
        <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="compatibility" 
          options={{ 
            headerShown: true,
            headerTitle: 'Compatibility Analysis',
            headerStyle: {
              backgroundColor: '#1A1625',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }} 
        />
        <Stack.Screen 
          name="dhikr-counter" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="zikr" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        <Stack.Screen name="email-verification" options={{ headerShown: false }} />
        <Stack.Screen name="reset-password" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
      </Stack>
      {showAnimatedSplash && (
        <AnimatedSplash onFinish={() => setShowAnimatedSplash(false)} />
      )}
    </AppErrorBoundary>
  );
}

// Onboarding Gate - Handle initial routing based on onboarding completion
// If onboarding is done, always go to (tabs). Auth is optional (cloud sync only).
// The app works fully offline with local profile — no reason to force re-login.
function OnboardingGate() {
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // Small delay to let expo-router finish initial mount before navigating
    const timer = setTimeout(() => {
      checkInitialRoute();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const checkInitialRoute = async () => {
    try {
      const completed = await getOnboardingCompleted();
      const rootSegment = segments[0];
      const inOnboarding = rootSegment === '(onboarding)';
      const inTabs = rootSegment === '(tabs)';
      const inAllowedDeepLinkRoute = isAllowedDeepLinkRoute(rootSegment);

      if (!completed) {
        // Onboarding not finished -> show onboarding.
        if (inOnboarding) return;
        router.replace('/(onboarding)');
        return;
      }

      // Onboarding completed -> go to main app unless an explicit deep-link route is active.
      // Auth/sign-in is available from profile screen, not forced on startup.
      if (inTabs || inAllowedDeepLinkRoute) return;
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error checking initial route:', error);
      // Fallback: if anything fails, go to onboarding
    }
  };

  // Don't render anything, this just handles navigation
  return null;
}

// Deep Link Handler Component
function DeepLinkHandler() {
  const router = useRouter();
  const { profile, setProfile } = useProfile();

  // Deep link handler for email verification
  useEffect(() => {
    const handleDeepLink = async (event: { url: string }) => {
      try {
        const { path, queryParams } = Linking.parse(event.url);
        const authParams = (queryParams || {}) as AuthCallbackQueryParams;

        console.log('📱 Deep link received:', event.url);
        console.log('📱 Path:', path);
        console.log('📱 Query params:', queryParams);

        // Check if it's auth callback
        if (path === 'auth/callback' || path?.includes('auth/callback')) {
          // If this is an OAuth callback (has 'code' parameter), 
          // the Linking listener in AuthService will handle it
          // Just return and don't interfere
          if (authParams.code && !authParams.type) {
            console.log('📱 OAuth callback detected - handled by AuthService');
            return;
          }

          // Handle errors from email verification
          if (authParams.error) {
            console.error('❌ Auth callback error:', authParams.error, authParams.error_description);
            showRouteAlert('Verification Failed', authParams.error_description || authParams.error, 'OK', () => router.replace('/auth'));
            return;
          }

          if (await handleRecoveryDeepLink(authParams, setProfile, router)) {
            return;
          }

          if (await handleSignupDeepLink(authParams, profile, setProfile, router)) {
            return;
          }
        }
      } catch (error) {
        console.error('❌ Deep link handler failed:', error);
        Alert.alert(
          'Link Error',
          'We could not open that link. Please try again from inside the app.',
          [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
        );
      }
    };

    // Listen for deep links while app is open
    const subscription = Linking.addEventListener('url', handleDeepLink);

    // Check if app was opened via deep link
    Linking.getInitialURL()
      .then((url) => {
        if (url) {
          handleDeepLink({ url }).catch(() => {
            // ignore
          });
        }
      })
      .catch(() => {
        // ignore
      });

    return () => subscription.remove();
  }, [profile, setProfile, router]);

  return null; // This component doesn't render anything
}
