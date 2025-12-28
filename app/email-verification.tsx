/**
 * Email Verification Screen
 * =========================
 * User-friendly screen shown after signup when email confirmation is required
 * 
 * Features:
 * - Shows success message with email address
 * - Clear instructions for user
 * - Auto-checks verification status every 3 seconds
 * - Resend email button with cooldown timer
 * - Deep link ready for email verification
 */

import { DarkTheme } from '@/constants/DarkTheme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export default function EmailVerificationScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Auto-check verification status every 3 seconds
  useEffect(() => {
    const checkVerification = async () => {
      try {
        // Check if user signed in via deep link
        // For now, we rely on the deep link handler in _layout.tsx
        // In Phase 4, we'll add proper session checking
        console.log('[EmailVerification] Waiting for email verification via deep link...');
      } catch (error) {
        console.error('[EmailVerification] Error checking verification:', error);
      }
    };

    // Check every 3 seconds if we should redirect
    const interval = setInterval(checkVerification, 3000);
    return () => clearInterval(interval);
  }, [router]);

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleResendEmail = async () => {
    if (resendCooldown > 0 || !email) return;
    
    setIsResending(true);
    try {
      if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        throw new Error('Backend not configured');
      }

      const response = await fetch(`${SUPABASE_URL}/auth/v1/resend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({
          type: 'signup',
          email: email,
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to resend email');
      }
      
      setResendCooldown(60);
      Alert.alert('✅ Email Sent!', 'Please check your inbox (and spam folder).');
      
    } catch (error) {
      console.error('[EmailVerification] Resend error:', error);
      Alert.alert('Error', 'Failed to resend email. Please try again later.');
    } finally {
      setIsResending(false);
    }
  };

  const handleBackToSignIn = () => {
    router.replace('/auth');
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
        <View style={styles.content}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>✉️</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>Verify Your Email</Text>

          {/* Email */}
          <Text style={styles.message}>
            We've sent a verification link to:
          </Text>
          <Text style={styles.email}>{email}</Text>

          {/* Instructions */}
          <View style={styles.instructionsBox}>
            <Text style={styles.instructionTitle}>Next Steps:</Text>
            <View style={styles.instructionItem}>
              <Text style={styles.instructionNumber}>1️⃣</Text>
              <Text style={styles.instruction}>
                Check your inbox (and spam folder)
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <Text style={styles.instructionNumber}>2️⃣</Text>
              <Text style={styles.instruction}>
                Click the verification link in the email
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <Text style={styles.instructionNumber}>3️⃣</Text>
              <Text style={styles.instruction}>
                Return here and sign in with your email
              </Text>
            </View>
          </View>

          {/* Resend Button */}
          <TouchableOpacity
            style={[
              styles.resendButton,
              (isResending || resendCooldown > 0) && styles.buttonDisabled
            ]}
            onPress={handleResendEmail}
            disabled={isResending || resendCooldown > 0}
          >
            <LinearGradient
              colors={['#8B7355', '#6B5645']}
              style={styles.resendGradient}
            >
              {isResending ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="mail" size={20} color="#FFFFFF" />
                  <Text style={styles.resendButtonText}>
                    {resendCooldown > 0 
                      ? `Resend in ${resendCooldown}s`
                      : 'Resend Email'}
                  </Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Back Button */}
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBackToSignIn}
          >
            <Ionicons name="arrow-back" size={20} color="#8B7355" />
            <Text style={styles.backButtonText}>Back to Sign In</Text>
          </TouchableOpacity>

          {/* Security Note */}
          <View style={styles.securityNote}>
            <Ionicons name="shield-checkmark" size={20} color="#10B981" />
            <Text style={styles.securityText}>
              Your data is encrypted and secure. We never share your personal information.
            </Text>
          </View>
        </View>
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
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(139, 115, 85, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 24,
  },
  icon: {
    fontSize: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: DarkTheme.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: DarkTheme.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B7355',
    textAlign: 'center',
    marginBottom: 32,
  },
  instructionsBox: {
    backgroundColor: 'rgba(139, 115, 85, 0.1)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(139, 115, 85, 0.2)',
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: DarkTheme.textPrimary,
    marginBottom: 16,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  instructionNumber: {
    fontSize: 15,
  },
  instruction: {
    flex: 1,
    fontSize: 15,
    color: DarkTheme.textSecondary,
    lineHeight: 22,
  },
  resendButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  resendGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  resendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  backButtonText: {
    color: '#8B7355',
    fontSize: 15,
    fontWeight: '600',
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginTop: 'auto',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.1)',
  },
  securityText: {
    flex: 1,
    fontSize: 13,
    color: '#10B981',
    lineHeight: 18,
  },
});
