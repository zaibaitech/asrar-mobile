import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { CalculatorColors } from '../../constants/CalculatorColors';

interface CalculatorInputProps {
  latinInput: string;
  arabicInput: string;
  onLatinChange: (text: string) => void;
  onArabicChange: (text: string) => void;
  onCalculate: () => void;
  isLoading: boolean;
  system: 'maghribi' | 'mashriqi';
  onSystemChange: (system: 'maghribi' | 'mashriqi') => void;
}

export const CalculatorInput: React.FC<CalculatorInputProps> = ({
  latinInput,
  arabicInput,
  onLatinChange,
  onArabicChange,
  onCalculate,
  isLoading,
  system,
  onSystemChange
}) => {
  const colors = CalculatorColors;

  return (
    <View style={styles.container}>
      {/* System Selector with Premium Design */}
      <View style={styles.selectorContainer}>
        <Text style={styles.selectorLabel}>🎯 Abjad System</Text>
        <View style={styles.systemSelector}>
          <TouchableOpacity
            style={styles.systemButtonWrapper}
            onPress={() => onSystemChange('maghribi')}
          >
            {system === 'maghribi' ? (
              <LinearGradient
                colors={['#6366f1', '#8b5cf6']}
                style={styles.systemButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.systemTextActive}>🌙 Maghribi</Text>
              </LinearGradient>
            ) : (
              <View style={[styles.systemButton, styles.systemButtonInactive]}>
                <Text style={styles.systemTextInactive}>Maghribi</Text>
              </View>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.systemButtonWrapper}
            onPress={() => onSystemChange('mashriqi')}
          >
            {system === 'mashriqi' ? (
              <LinearGradient
                colors={['#6366f1', '#8b5cf6']}
                style={styles.systemButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.systemTextActive}>☀️ Mashriqi</Text>
              </LinearGradient>
            ) : (
              <View style={[styles.systemButton, styles.systemButtonInactive]}>
                <Text style={styles.systemTextInactive}>Mashriqi</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Arabic Input - Premium Card */}
      <View style={styles.inputCard}>
        <View style={styles.inputHeader}>
          <Text style={styles.inputLabel}>حروف Arabic Text</Text>
          <Text style={styles.inputHint}>RTL supported</Text>
        </View>
        <TextInput
          style={styles.arabicInput}
          value={arabicInput}
          onChangeText={onArabicChange}
          placeholder="أدخل النص العربي"
          placeholderTextColor="#64748b"
          multiline
        />
      </View>

      {/* Latin Input - Premium Card */}
      <View style={styles.inputCard}>
        <View style={styles.inputHeader}>
          <Text style={styles.inputLabel}>🅰️ Latin Text</Text>
          <Text style={styles.inputHint}>Auto-transliterate</Text>
        </View>
        <TextInput
          style={styles.latinInput}
          value={latinInput}
          onChangeText={onLatinChange}
          placeholder="Enter text in Latin"
          placeholderTextColor="#64748b"
          multiline
        />
      </View>

      {/* Calculate Button - Premium Gradient */}
      <TouchableOpacity
        style={[styles.calculateWrapper, isLoading && styles.disabled]}
        onPress={onCalculate}
        disabled={isLoading || (!arabicInput && !latinInput)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={isLoading ? ['#64748b', '#475569'] : ['#6366f1', '#8b5cf6', '#a855f7']}
          style={styles.calculateButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.calculateText}>
            {isLoading ? '⌛ Calculating...' : '✨ Calculate Abjad Value'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    padding: 20, 
    gap: 20,
    backgroundColor: '#0f172a',
  },
  
  // System Selector
  selectorContainer: {
    gap: 12,
  },
  selectorLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f1f5f9',
    textAlign: 'center',
  },
  systemSelector: { 
    flexDirection: 'row', 
    gap: 12,
  },
  systemButtonWrapper: {
    flex: 1,
  },
  systemButton: { 
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  systemButtonInactive: {
    backgroundColor: '#1e293b',
    borderWidth: 2,
    borderColor: '#334155',
    elevation: 0,
  },
  systemTextActive: { 
    fontSize: 16, 
    fontWeight: '800',
    color: '#fff',
  },
  systemTextInactive: { 
    fontSize: 16, 
    fontWeight: '700',
    color: '#94a3b8',
  },
  
  // Input Cards
  inputCard: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: '#334155',
    gap: 12,
  },
  inputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputLabel: { 
    fontSize: 16, 
    fontWeight: '700',
    color: '#f1f5f9',
  },
  inputHint: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6366f1',
  },
  arabicInput: { 
    minHeight: 100,
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 16,
    fontSize: 22,
    textAlign: 'right',
    color: '#f1f5f9',
    textAlignVertical: 'top',
    borderWidth: 2,
    borderColor: '#475569',
  },
  latinInput: { 
    minHeight: 100,
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 16,
    fontSize: 18,
    textAlign: 'left',
    color: '#f1f5f9',
    textAlignVertical: 'top',
    borderWidth: 2,
    borderColor: '#475569',
  },
  
  // Calculate Button
  calculateWrapper: {
    marginTop: 8,
  },
  calculateButton: { 
    paddingVertical: 20,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 12,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  calculateText: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  disabled: { 
    opacity: 0.5,
  },
});
