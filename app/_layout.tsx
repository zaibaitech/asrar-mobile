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
import { NotificationInitializer } from '@/components/NotificationInitializer';
import { NotificationTapHandler } from '@/components/NotificationTapHandler';
import { useColorScheme } from '@/components/useColorScheme';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ProfileProvider, useProfile } from '@/contexts/ProfileContext';
import { handleAuthCallback } from '@/services/AuthService';
import { getOnboardingCompleted } from '@/services/OnboardingService';

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  // Ensure proper initial route handling
  initialRouteName: '(onboarding)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

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
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav showAnimatedSplash={showAnimatedSplash} setShowAnimatedSplash={setShowAnimatedSplash} />;
}

function RootLayoutNav({ showAnimatedSplash, setShowAnimatedSplash }: { showAnimatedSplash: boolean; setShowAnimatedSplash: (val: boolean) => void }) {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <ProfileProvider>
        <LanguageProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <RootLayoutContent showAnimatedSplash={showAnimatedSplash} setShowAnimatedSplash={setShowAnimatedSplash} />
          </ThemeProvider>
        </LanguageProvider>
      </ProfileProvider>
    </SafeAreaProvider>
  );
}

function RootLayoutContent({ showAnimatedSplash, setShowAnimatedSplash }: { showAnimatedSplash: boolean; setShowAnimatedSplash: (val: boolean) => void }) {
  return (
    <>
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
              <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
              <Stack.Screen name="email-verification" options={{ headerShown: false }} />
              <Stack.Screen name="auth" options={{ headerShown: false }} />
              <Stack.Screen name="reset-password" options={{ headerShown: false }} />
              <Stack.Screen name="profile" options={{ headerShown: false }} />
            </Stack>
            {showAnimatedSplash && (
              <AnimatedSplash onFinish={() => setShowAnimatedSplash(false)} />
            )}
          </>
  );
}

// Onboarding Gate - Redirect to onboarding if not completed
function OnboardingGate() {
  const router = useRouter();
  const segments = useSegments();
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);

  useEffect(() => {
    checkOnboarding();
  }, []);

  const checkOnboarding = async () => {
    try {
      const completed = await getOnboardingCompleted();
      const inOnboarding = segments[0] === '(onboarding)';
      
      // If onboarding not completed and not already in onboarding, redirect
      if (!completed && !inOnboarding) {
        router.replace('/(onboarding)');
      }
      
      setIsCheckingOnboarding(false);
    } catch (error) {
      console.error('Error checking onboarding:', error);
      setIsCheckingOnboarding(false);
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
      const { path, queryParams } = Linking.parse(event.url);

      console.log('📱 Deep link received:', event.url);
      console.log('📱 Path:', path);
      console.log('📱 Query params:', queryParams);

      // Check if it's auth callback
      if (path === 'auth/callback' || path?.includes('auth/callback')) {
        const { access_token, refresh_token, type, error, error_description } = queryParams as {
          access_token?: string;
          refresh_token?: string;
          type?: string;
          error?: string;
          error_description?: string;
        };

        // Handle errors from email verification
        if (error) {
          console.error('❌ Auth callback error:', error, error_description);
          Alert.alert(
            'Verification Failed',
            error_description || error,
            [{ text: 'OK', onPress: () => router.replace('/auth') }]
          );
          return;
        }

        if (type === 'recovery' && access_token && refresh_token) {
          // Password reset flow - keep user in app
          const result = await handleAuthCallback({
            access_token,
            refresh_token,
            type,
            error,
            error_description,
            expires_in: (queryParams as any)?.expires_in,
            token_type: (queryParams as any)?.token_type,
          });

          if (result.error) {
            Alert.alert(
              'Reset Link Invalid',
              result.error.message,
              [{ text: 'OK', onPress: () => router.replace('/auth') }]
            );
            return;
          }

          await setProfile({ mode: 'account' });
          router.replace('/reset-password');
          return;
        }

        if (type === 'signup' && access_token && refresh_token) {
          try {
            console.log('✅ Email verified! Processing...');
            
            // Update profile to account mode
            await setProfile({ mode: 'account' });
            
            // Check if profile has essential data
            const hasEssentialData = profile.nameAr || profile.nameLatin || profile.dobISO;
            
            if (!hasEssentialData) {
              // Redirect to profile screen to complete setup
              Alert.alert(
                '✅ Email Verified!',
                'Please complete your profile to unlock personalized features.',
                [
                  {
                    text: 'Complete Profile',
                    onPress: () => router.replace('/profile?postSave=home'),
                  }
                ]
              );
            } else {
              // Profile already has data, go to home
              Alert.alert(
                '✅ Welcome!',
                'Your email has been verified successfully.',
                [
                  {
                    text: 'Continue',
                    onPress: () => router.replace('/(tabs)'),
                  }
                ]
              );
            }
            
          } catch (error) {
            console.error('❌ Verification processing failed:', error);
            Alert.alert(
              'Error',
              'Verification failed. Please try signing in manually.',
              [{ text: 'OK', onPress: () => router.replace('/auth') }]
            );
          }
        }
      }
    };

    // Listen for deep links while app is open
    const subscription = Linking.addEventListener('url', handleDeepLink);

    // Check if app was opened via deep link
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    return () => subscription.remove();
  }, [profile, setProfile, router]);

  return null; // This component doesn't render anything
}
