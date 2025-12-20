import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useIstikhara } from '../../hooks/useIstikhara';
import * as Haptics from 'expo-haptics';

export default function IstikharaForm() {
  const router = useRouter();
  const { calculate, loading, error, result } = useIstikhara();
  
  const [personName, setPersonName] = useState('');
  const [motherName, setMotherName] = useState('');

  const isFormValid = personName.trim().length > 0 && motherName.trim().length > 0;

  const handleCalculate = async () => {
    if (!isFormValid) {
      Alert.alert('Missing Information', 'Please enter both names to continue.');
      return;
    }

    // Provide haptic feedback
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      await calculate(personName.trim(), motherName.trim(), 'en');
      
      // If calculation was successful, navigate to results
      if (!error) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        // Note: We'll pass result via route params
        router.push({
          pathname: '/istikhara/results',
          params: {
            personName: personName.trim(),
            motherName: motherName.trim(),
          },
        });
      }
    } catch (err) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  // Show error alert when error changes
  React.useEffect(() => {
    if (error) {
      console.error('Displaying error to user:', error);
      Alert.alert('Calculation Error', String(error), [
        { text: 'OK', onPress: () => {} },
      ]);
    }
  }, [error]);

  // Navigate to results when result is available
  React.useEffect(() => {
    if (result && !loading && !error) {
      console.log('Navigating to results with data:', result.data);
      try {
        router.push({
          pathname: '/istikhara/results',
          params: {
            data: JSON.stringify(result.data),
            personName: personName.trim(),
            motherName: motherName.trim(),
          },
        });
      } catch (navError) {
        console.error('Navigation error:', navError);
        Alert.alert('Error', 'Failed to navigate to results');
      }
    }
  }, [result, loading, error]);

  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e', '#0f3460']}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerIcon}>✨</Text>
            <Text style={styles.headerTitle}>Enter Names</Text>
            <Text style={styles.headerSubtitle}>
              Please provide the names for spiritual calculation
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.formContainer}>
            {/* Person Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Person's Name</Text>
              <TextInput
                style={styles.input}
                placeholder="محمد (e.g., Muhammad)"
                placeholderTextColor="#8892b0"
                value={personName}
                onChangeText={setPersonName}
                autoCapitalize="words"
                autoCorrect={false}
                editable={!loading}
              />
              <Text style={styles.inputHint}>
                Enter the full name of the person
              </Text>
            </View>

            {/* Mother Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Mother's Name</Text>
              <TextInput
                style={styles.input}
                placeholder="فاطمة (e.g., Fatima)"
                placeholderTextColor="#8892b0"
                value={motherName}
                onChangeText={setMotherName}
                autoCapitalize="words"
                autoCorrect={false}
                editable={!loading}
              />
              <Text style={styles.inputHint}>
                Enter the mother's full name
              </Text>
            </View>

            {/* Info Card */}
            <View style={styles.infoCard}>
              <Text style={styles.infoIcon}>ℹ️</Text>
              <Text style={styles.infoText}>
                The calculation uses Abjad numerology to determine your spiritual profile 
                based on the numerical values of the Arabic letters in both names.
              </Text>
            </View>

            {/* Calculate Button */}
            <TouchableOpacity
              style={[styles.calculateButton, !isFormValid && styles.calculateButtonDisabled]}
              onPress={handleCalculate}
              disabled={!isFormValid || loading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={
                  isFormValid && !loading
                    ? ['#e94560', '#c72c41']
                    : ['#4a5568', '#2d3748']
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.calculateButtonGradient}
              >
                {loading ? (
                  <>
                    <ActivityIndicator color="#ffffff" size="small" />
                    <Text style={styles.calculateButtonText}>Calculating...</Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.calculateButtonIcon}>🔮</Text>
                    <Text style={styles.calculateButtonText}>Calculate Istikhara</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Cancel Button */}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => router.back()}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  headerIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#a8b2d1',
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#ffffff',
  },
  inputHint: {
    fontSize: 13,
    color: '#8892b0',
    marginTop: 6,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(147, 197, 253, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#e0e6f0',
    lineHeight: 20,
  },
  calculateButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#e94560',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  calculateButtonDisabled: {
    shadowOpacity: 0,
    elevation: 0,
  },
  calculateButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
    gap: 12,
  },
  calculateButtonIcon: {
    fontSize: 24,
  },
  calculateButtonText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  cancelButton: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#a8b2d1',
    fontWeight: '500',
  },
});
