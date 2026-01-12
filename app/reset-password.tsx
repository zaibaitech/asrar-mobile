/**
 * Reset Password Screen
 * =====================
 * Used after opening Supabase recovery deep link (type=recovery).
 */

import { DarkTheme } from '@/constants/DarkTheme';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProfile } from '@/contexts/ProfileContext';
import { updatePassword } from '@/services/AuthService';
import { clearGuestMode } from '@/services/SessionModeService';
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

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const { setProfile } = useProfile();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const result = await updatePassword(password);

      if (result.success) {
        await clearGuestMode();
        await setProfile({ mode: 'account' });

        Alert.alert(
          'Password updated',
          'Your password has been updated successfully.',
          [{ text: 'Continue', onPress: () => router.replace('/(tabs)') }]
        );
      } else {
        Alert.alert('Error', result.error?.message || 'Failed to update password');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update password');
      console.error('Reset password error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      <LinearGradient colors={['#0f172a', '#1e1b4b', '#1A1625']} style={styles.gradient}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            <View style={styles.header}>
              <Text style={styles.title}>{t('auth.resetPasswordTitle') || 'Reset Password'}</Text>
              <Text style={styles.subtitle}>
                {t('auth.resetPasswordSubtitle') || 'Set a new password for your account.'}
              </Text>
            </View>

            <View style={styles.formCard}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t('auth.password') || 'Password'}</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed" size={20} color={DarkTheme.textSecondary} />
                  <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="••••••••"
                    placeholderTextColor={DarkTheme.textSecondary}
                    secureTextEntry
                    autoComplete="password-new"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t('auth.confirmPassword') || 'Confirm Password'}</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed" size={20} color={DarkTheme.textSecondary} />
                  <TextInput
                    style={styles.input}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="••••••••"
                    placeholderTextColor={DarkTheme.textSecondary}
                    secureTextEntry
                    autoComplete="password-new"
                  />
                </View>
              </View>

              <TouchableOpacity
                style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                onPress={handleUpdate}
                disabled={loading}
              >
                <LinearGradient colors={['#8B7355', '#6B5645']} style={styles.submitGradient}>
                  {loading ? (
                    <>
                      <ActivityIndicator color="#fff" />
                      <Text style={styles.submitText}>Updating...</Text>
                    </>
                  ) : (
                    <>
                      <Ionicons name="checkmark-circle" size={20} color="#fff" />
                      <Text style={styles.submitText}>{t('auth.updatePasswordButton') || 'Update Password'}</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1625' },
  gradient: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 40 },

  header: { alignItems: 'center', marginTop: 24, marginBottom: 24 },
  title: { fontSize: 28, fontWeight: '700', color: DarkTheme.textPrimary, marginBottom: 8 },
  subtitle: { fontSize: 14, color: DarkTheme.textSecondary, textAlign: 'center', maxWidth: 320 },

  formCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 13, color: DarkTheme.textSecondary, marginBottom: 8 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  input: { flex: 1, color: DarkTheme.textPrimary, fontSize: 16 },

  submitButton: { marginTop: 8, borderRadius: 14, overflow: 'hidden' },
  submitButtonDisabled: { opacity: 0.7 },
  submitGradient: { paddingVertical: 14, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 10 },
  submitText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
