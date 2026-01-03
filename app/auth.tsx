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
import { useProfile } from '@/contexts/ProfileContext';
import { signIn, signUp } from '@/services/AuthService';
import { evaluatePasswordStrength, getPasswordStrengthLabel } from '@/utils/passwordStrength';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
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

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';
const IS_BACKEND_CONFIGURED = !!(SUPABASE_URL && SUPABASE_ANON_KEY);

export default function AuthScreen() {
  const router = useRouter();
  const { profile, setProfile } = useProfile();
  
  const [mode, setMode] = useState<AuthMode>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Password strength indicator
  const passwordStrength = evaluatePasswordStrength(password);
  
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
        return 'Account creation is not available. Please continue as Guest.';
      
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
        await setProfile({ 
          mode: 'account',
        });
        
        Alert.alert(
          '✅ Account Created!',
          'Welcome to Asrar! Your account is ready to use.',
          [
            {
              text: 'Continue',
              onPress: () => router.replace('/(tabs)'),
            },
          ]
        );
      } else if (result.error?.code === 'EMAIL_CONFIRMATION_REQUIRED') {
        // Email confirmation is enabled in backend - show configuration help
        Alert.alert(
          '⚠️ Email Confirmation Enabled',
          'Please disable email confirmation in Supabase Dashboard:\n\nAuthentication → Settings → Email Auth → Uncheck "Enable email confirmations"',
          [
            {
              text: 'Continue as Guest',
              onPress: () => router.replace('/(tabs)'),
            },
            {
              text: 'OK',
              style: 'cancel'
            }
          ]
        );
      } else if (result.error?.message?.includes('User already registered') || 
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
        // Update profile to account mode
        await setProfile({ 
          mode: 'account',
        });
        
        Alert.alert(
          'Welcome Back!',
          'You are now signed in.',
          [
            {
              text: 'Continue',
              onPress: () => router.replace('/(tabs)'),
            },
          ]
        );
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
              <Text style={styles.logo}>Asrār ✦</Text>
              <Text style={styles.subtitle}>Sacred Numerology & Mysticism</Text>
            </View>
            
            {/* Tab Switcher */}
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tab, mode === 'signup' && styles.tabActive]}
                onPress={() => setMode('signup')}
              >
                <Text style={[styles.tabText, mode === 'signup' && styles.tabTextActive]}>
                  Sign Up
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.tab, mode === 'signin' && styles.tabActive]}
                onPress={() => setMode('signin')}
              >
                <Text style={[styles.tabText, mode === 'signin' && styles.tabTextActive]}>
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
            
            {/* Backend Not Configured Notice */}
            {!IS_BACKEND_CONFIGURED && (
              <View style={styles.notConfiguredBanner}>
                <Ionicons name="information-circle" size={24} color="#f59e0b" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.notConfiguredTitle}>Accounts Not Available</Text>
                  <Text style={styles.notConfiguredText}>
                    Account creation requires backend setup. Please continue as Guest to use all features.
                  </Text>
                </View>
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
                <Text style={styles.label}>Email</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="mail" size={20} color={DarkTheme.textSecondary} />
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="your@email.com"
                    placeholderTextColor={DarkTheme.textSecondary}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                  />
                </View>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed" size={20} color={DarkTheme.textSecondary} />
                  <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="••••••••"
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
                style={[styles.submitButton, (!IS_BACKEND_CONFIGURED || loading) && styles.submitButtonDisabled]}
                onPress={mode === 'signup' ? handleSignUp : handleSignIn}
                disabled={loading || !IS_BACKEND_CONFIGURED}
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
                <TouchableOpacity style={styles.forgotButton}>
                  <Text style={styles.forgotText}>Forgot Password?</Text>
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
              <Text style={styles.guestButtonText}>Continue as Guest</Text>
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
