/**
 * Authentication Screen
 * ====================
 * Sign Up / Sign In page for account creation
 * 
 * Features:
 * - Tab switcher (Sign Up / Sign In)
 * - Email + Password authentication
 * - Guest mode option (skip)
 * - Profile migration (guest → account)
 * - Privacy-first messaging
 */

import { DarkTheme } from '@/constants/DarkTheme';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProfile } from '@/contexts/ProfileContext';
import { checkAuthBackendHealth, getAuthBackendPrereq, loadProfileFromCloud, requestPasswordReset, signIn, signUp } from '@/services/AuthService';
import { clearGuestMode } from '@/services/SessionModeService';
import { evaluatePasswordStrength, getPasswordStrengthLabel } from '@/utils/passwordStrength';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type AuthMode = 'signin' | 'signup';

type BackendStatus = {
  configured: boolean;
  missing: string[];
  health: 'unknown' | 'ok' | 'failed';
  error: string | null;
  checking: boolean;
};

export default function AuthScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const { profile, setProfile } = useProfile();
  
  const [mode, setMode] = useState<AuthMode>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [backendStatus, setBackendStatus] = useState<BackendStatus>({
    configured: true,
    missing: [],
    health: 'unknown',
    error: null,
    checking: false,
  });
  
  // Password strength indicator
  const passwordStrength = evaluatePasswordStrength(password);

  const hasEssentialProfileData =
    !!(profile.nameAr || profile.nameLatin || profile.dobISO);

  const runBackendCheck = useCallback(async () => {
    const prereq = getAuthBackendPrereq();

    setBackendStatus({
      configured: prereq.configured,
      missing: prereq.missing,
      health: prereq.configured ? 'unknown' : 'failed',
      error: prereq.configured ? null : `Missing: ${prereq.missing.join(', ')}`,
      checking: prereq.configured,
    });

    if (!prereq.configured) {
      if (__DEV__) {
        console.log('[AuthScreen] Backend prereq failed:', { missing: prereq.missing });
      }
      return;
    }

    const health = await checkAuthBackendHealth({ timeoutMs: 6000 });

    if (!health.ok) {
      if (__DEV__) {
        console.log('[AuthScreen] Backend health failed:', {
          code: health.error?.code,
          message: health.error?.message,
        });
      }
    }

    setBackendStatus({
      configured: prereq.configured,
      missing: prereq.missing,
      health: health.ok ? 'ok' : 'failed',
      error: health.error?.message ?? null,
      checking: false,
    });
  }, []);

  useEffect(() => {
    runBackendCheck();
  }, [runBackendCheck]);
  
  // Helper function for user-friendly error messages
  const getErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case 'auth/email-already-in-use':
      case 'User already registered':
      case 'SIGNUP_FAILED':
        return 'This email is already registered. Try signing in instead.';
      
      case 'auth/invalid-email':
      case 'Invalid email':
        return 'Please enter a valid email address.';
      
      case 'auth/weak-password':
      case 'Password should be at least 6 characters':
        return 'Password must be at least 6 characters.';
      
      case 'auth/network-request-failed':
      case 'Network request failed':
      case 'NETWORK_ERROR':
        return 'No internet connection. Please check your network.';
      
      case 'NOT_CONFIGURED':
        return 'Backend is not configured. Please check environment variables.';

      case 'TIMEOUT':
        return 'Backend check timed out. Please try again.';

      case 'HEALTH_CHECK_FAILED':
        return 'Backend is unreachable. Please check your network and try again.';
      
      default:
        return 'Something went wrong. Please try again.';
    }
  };
  
  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    
    try {
      setLoading(true);
      const result = await signUp({ email, password });
      
      if (result.session) {
        // ✅ SUCCESS - Account created and auto-signed in (no email verification required)
        await clearGuestMode(); // Clear guest mode on successful signup
        await setProfile({ 
          mode: 'account',
          account: {
            email: result.session.email || email,
            userId: result.session.userId,
          },
        });

        // After signup, always take the user to Profile to complete their details.
        Alert.alert(
          '✅ Account Created!',
          'Please complete your profile to unlock personalized features.',
          [
            {
              text: 'Continue',
              onPress: () => router.replace('/profile?postSave=home'),
            },
          ]
        );
      } else if (result.error?.code === 'EMAIL_EXISTS' ||
                 result.error?.message?.includes('already registered') ||
                 result.error?.message?.includes('already been registered')) {
        // User already exists
        Alert.alert(
          'Account Exists',
          'This email is already registered. Please sign in instead.',
          [
            {
              text: 'Sign In',
              onPress: () => setMode('signin'),
            },
            {
              text: 'OK',
              style: 'cancel'
            }
          ]
        );
      } else if (result.error?.code === 'EMAIL_CONFIRMATION_REQUIRED') {
        // Fallback if backend still requires email verification
        Alert.alert(
          'Email Verification Required',
          'Please verify your email address, then return and sign in. If this keeps happening, email verification is still enabled on the backend.',
          [
            {
              text: 'OK',
            },
          ]
        );
      } else {
        // ❌ ACTUAL ERROR - Only show error for real failures
        const errorMessage = getErrorMessage(result.error?.code || result.error?.message || '');
        Alert.alert('Error', errorMessage);
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
      console.error('Sign up error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    try {
      setLoading(true);
      const result = await signIn({ email, password });
      
      if (result.session) {
        // Clear guest mode on successful sign in
        await clearGuestMode();
        
        // Try to load profile from cloud first - pass the session directly to avoid race condition
        const cloudResult = await loadProfileFromCloud(result.session);
        
        if (__DEV__) {
          console.log('[AuthScreen] Cloud profile result:', cloudResult.profile ? 'Found' : 'Not found', cloudResult.error?.code || '');
        }
        
        if (cloudResult.profile) {
          // Cloud profile found - restore it with account mode
          // Also restore account info from session
          await setProfile({
            ...cloudResult.profile,
            mode: 'account',
            account: {
              ...cloudResult.profile.account,
              email: result.session.email,
              userId: result.session.userId,
            },
          });
          
          Alert.alert(
            'Welcome Back!',
            'Your profile has been restored.',
            [
              {
                text: 'Continue',
                onPress: () => router.replace('/(tabs)'),
              },
            ]
          );
        } else {
          // No cloud profile - user needs to set up profile
          await setProfile({ 
            mode: 'account',
            account: {
              email: result.session.email || email,
              userId: result.session.userId,
            },
          });

          Alert.alert(
            'Welcome Back!',
            'Please complete your profile to unlock personalized features.',
            [
              {
                text: 'Continue',
                onPress: () => router.replace('/profile?postSave=home'),
              },
            ]
          );
        }
      } else if (result.error?.code === 'EMAIL_CONFIRMATION_REQUIRED') {
        // Email not confirmed yet
        Alert.alert(
          'Email Not Confirmed',
          'Please check your email and click the confirmation link before signing in. Check your spam folder if you don\'t see it.',
          [
            {
              text: 'OK',
            },
          ]
        );
      } else {
        Alert.alert('Error', result.error?.message || 'Failed to sign in');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
      console.error('Sign in error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleContinueAsGuest = () => {
    router.replace('/(tabs)');
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Email required', 'Please enter your email first.');
      return;
    }

    try {
      setLoading(true);
      const result = await requestPasswordReset(email);

      if (result.success) {
        Alert.alert(
          'Reset link sent',
          'Check your email for a password reset link. Open it on this device to continue in the app.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Error', result.error?.message || 'Failed to send reset email');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send reset email');
      console.error('Forgot password error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      
      <LinearGradient
        colors={['#0f172a', '#1e1b4b', '#1A1625']}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Logo & Title */}
            <View style={styles.header}>
              <Text style={styles.logo}>Asrariya ✦</Text>
              <Text style={styles.subtitle}>Sacred Numerology & Mysticism</Text>
            </View>
            
            {/* Tab Switcher */}
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tab, mode === 'signup' && styles.tabActive]}
                onPress={() => setMode('signup')}
              >
                <Text style={[styles.tabText, mode === 'signup' && styles.tabTextActive]}>
                  {t('auth.signUp')}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.tab, mode === 'signin' && styles.tabActive]}
                onPress={() => setMode('signin')}
              >
                <Text style={[styles.tabText, mode === 'signin' && styles.tabTextActive]}>
                  {t('auth.signIn')}
                </Text>
              </TouchableOpacity>
            </View>
            
            {/* Backend Not Configured Notice */}
            {(backendStatus.health === 'failed' || !backendStatus.configured) && (
              <View style={styles.notConfiguredBanner}>
                <Ionicons name="information-circle" size={24} color="#f59e0b" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.notConfiguredTitle}>
                    {backendStatus.configured ? 'Backend Unreachable' : 'Accounts Not Available'}
                  </Text>
                  <Text style={styles.notConfiguredText}>
                    {backendStatus.error ||
                      (backendStatus.configured
                        ? 'We could not reach the backend. You can still try signing in/up to see the exact error.'
                        : 'Missing backend configuration. You can still try signing in/up to see the exact error.')}
                  </Text>
                  {!backendStatus.configured && backendStatus.missing.length > 0 && (
                    <Text style={[styles.notConfiguredText, { marginTop: 6, opacity: 0.85 }]}>
                      Missing: {backendStatus.missing.join(', ')}
                    </Text>
                  )}
                </View>

                <TouchableOpacity
                  style={styles.retryButton}
                  onPress={runBackendCheck}
                  disabled={backendStatus.checking || loading}
                >
                  {backendStatus.checking ? (
                    <ActivityIndicator color="#f59e0b" />
                  ) : (
                    <Ionicons name="refresh" size={18} color="#f59e0b" />
                  )}
                </TouchableOpacity>
              </View>
            )}
            
            {/* Benefits Card */}
            <View style={styles.benefitsCard}>
              <Text style={styles.benefitsTitle}>
                {mode === 'signup' ? 'Create an Account' : 'Welcome Back'}
              </Text>
              <Text style={styles.benefitsSubtitle}>
                {mode === 'signup' 
                  ? 'Unlock premium features and sync across devices'
                  : 'Sign in to access your account'}
              </Text>
              
              {mode === 'signup' && (
                <View style={styles.benefitsList}>
                  <View style={styles.benefitItem}>
                    <Ionicons name="cloud-upload" size={20} color="#10b981" />
                    <Text style={styles.benefitText}>Cloud sync across devices</Text>
                  </View>
                  <View style={styles.benefitItem}>
                    <Ionicons name="shield-checkmark" size={20} color="#10b981" />
                    <Text style={styles.benefitText}>Secure backup of your data</Text>
                  </View>
                  <View style={styles.benefitItem}>
                    <Ionicons name="star" size={20} color="#10b981" />
                    <Text style={styles.benefitText}>Access to premium features</Text>
                  </View>
                </View>
              )}
            </View>
            
            {/* Form */}
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t('auth.email')}</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="mail" size={20} color={DarkTheme.textSecondary} />
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder={t('auth.emailPlaceholder')}
                    placeholderTextColor={DarkTheme.textSecondary}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                  />
                </View>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t('auth.password')}</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed" size={20} color={DarkTheme.textSecondary} />
                  <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder={t('auth.passwordPlaceholder')}
                    placeholderTextColor={DarkTheme.textSecondary}
                    secureTextEntry
                    autoComplete="password"
                  />
                </View>
                {/* Password Strength Indicator (only for signup) */}
                {mode === 'signup' && password.length > 0 && (
                  <View style={styles.passwordStrength}>
                    <View style={[styles.strengthBar, { width: `${passwordStrength.score}%`, backgroundColor: passwordStrength.color }]} />
                    <Text style={[styles.strengthText, { color: passwordStrength.color }]}>
                      {getPasswordStrengthLabel(passwordStrength.strength)}
                    </Text>
                  </View>
                )}
              </View>
              
              {mode === 'signup' && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Confirm Password</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="lock-closed" size={20} color={DarkTheme.textSecondary} />
                    <TextInput
                      style={styles.input}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      placeholder="••••••••"
                      placeholderTextColor={DarkTheme.textSecondary}
                      secureTextEntry
                      autoComplete="password"
                    />
                  </View>
                </View>
              )}
              
              {/* Submit Button */}
              <TouchableOpacity
                style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                onPress={mode === 'signup' ? handleSignUp : handleSignIn}
                disabled={loading}
              >
                <LinearGradient
                  colors={['#8B7355', '#6B5645']}
                  style={styles.submitGradient}
                >
                  {loading ? (
                    <>
                      <ActivityIndicator color="#fff" />
                      <Text style={styles.submitText}>
                        {mode === 'signup' ? 'Creating Account...' : 'Signing In...'}
                      </Text>
                    </>
                  ) : (
                    <>
                      <Ionicons 
                        name={mode === 'signup' ? 'person-add' : 'log-in'} 
                        size={20} 
                        color="#fff" 
                      />
                      <Text style={styles.submitText}>
                        {mode === 'signup' ? 'Create Account' : 'Sign In'}
                      </Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
              
              {/* Forgot Password */}
              {mode === 'signin' && (
                <TouchableOpacity style={styles.forgotButton} onPress={handleForgotPassword}>
                  <Text style={styles.forgotText}>{t('auth.forgotPassword')}</Text>
                </TouchableOpacity>
              )}
            </View>
            
            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>
            
            {/* Continue as Guest */}
            <TouchableOpacity
              style={styles.guestButton}
              onPress={handleContinueAsGuest}
            >
              <Ionicons name="person-outline" size={20} color={DarkTheme.textSecondary} />
              <Text style={styles.guestButtonText}>{t('auth.continueAsGuest')}</Text>
            </TouchableOpacity>
            
            {/* Privacy Notice */}
            <View style={styles.privacyNotice}>
              <Ionicons name="shield-checkmark" size={16} color="#10b981" />
              <Text style={styles.privacyText}>
                Your data is encrypted and secure. We never share your personal information.
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1625',
  },
  gradient: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  
  // Header
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 20,
  },
  logo: {
    fontSize: 36,
    fontWeight: 'bold',
    color: DarkTheme.textPrimary,
    letterSpacing: 1,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: DarkTheme.textSecondary,
    letterSpacing: 0.5,
  },
  
  // Tab Switcher
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: 'rgba(139, 115, 85, 0.3)',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: DarkTheme.textSecondary,
  },
  tabTextActive: {
    color: '#8B7355',
  },
  
  // Not Configured Banner
  notConfiguredBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  notConfiguredTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#f59e0b',
    marginBottom: 4,
  },
  notConfiguredText: {
    fontSize: 13,
    color: DarkTheme.textSecondary,
    lineHeight: 18,
  },

  retryButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.25)',
  },
  
  // Benefits
  benefitsCard: {
    backgroundColor: 'rgba(139, 115, 85, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(139, 115, 85, 0.2)',
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: DarkTheme.textPrimary,
    marginBottom: 4,
  },
  benefitsSubtitle: {
    fontSize: 14,
    color: DarkTheme.textSecondary,
    marginBottom: 16,
  },
  benefitsList: {
    gap: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  benefitText: {
    fontSize: 14,
    color: DarkTheme.textSecondary,
  },
  
  // Form
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: DarkTheme.textPrimary,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    paddingHorizontal: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: DarkTheme.textPrimary,
  },
  submitButton: {
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  submitText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  forgotButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  forgotText: {
    fontSize: 14,
    color: '#8B7355',
  },
  
  // Password Strength
  passwordStrength: {
    marginTop: 8,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
    position: 'relative',
  },
  strengthBar: {
    height: '100%',
    borderRadius: 2,
  },
  strengthText: {
    position: 'absolute',
    right: 0,
    top: 6,
    fontSize: 12,
    fontWeight: '600',
  },
  
  // Divider
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  dividerText: {
    fontSize: 14,
    color: DarkTheme.textSecondary,
  },
  
  // Guest Button
  guestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    gap: 8,
  },
  guestButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: DarkTheme.textSecondary,
  },
  
  // Privacy
  privacyNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 24,
    padding: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.1)',
  },
  privacyText: {
    flex: 1,
    fontSize: 12,
    color: DarkTheme.textSecondary,
    lineHeight: 18,
  },
});
