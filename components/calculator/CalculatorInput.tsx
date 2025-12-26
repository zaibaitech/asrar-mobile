import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Modal, SafeAreaView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { CalculatorColors } from '../../constants/CalculatorColors';
import { CalculationType } from '../../types/calculator-enhanced';
import { DivineNamesPicker } from './DivineNamesPicker';
import { SurahAyahSelector } from './SurahAyahSelector';

interface CalculatorInputProps {
  calculationType: CalculationType;
  system: 'maghribi' | 'mashriqi';
  onSystemChange: (system: 'maghribi' | 'mashriqi') => void;
  
  // Generic text input
  arabicInput: string;
  onArabicInputChange: (text: string) => void;
  
  // Lineage inputs
  yourName: string;
  onYourNameChange: (text: string) => void;
  motherName: string;
  onMotherNameChange: (text: string) => void;
  
  // Divine name selection
  selectedDivineName: number | null;
  onDivineNameChange: (number: number | null) => void;
  
  // Quran selection
  selectedSurah: number | null;
  onSurahChange: (number: number | null) => void;
  selectedAyah: number | null;
  onAyahChange: (number: number | null) => void;
  
  // Phrase options
  removeVowels: boolean;
  onRemoveVowelsChange: (value: boolean) => void;
  ignorePunctuation: boolean;
  onIgnorePunctuationChange: (value: boolean) => void;
  ignoreSpaces: boolean;
  onIgnoreSpacesChange: (value: boolean) => void;
  
  // Actions
  onCalculate: () => void;
  isLoading: boolean;
}

export const CalculatorInput: React.FC<CalculatorInputProps> = ({
  calculationType,
  system,
  onSystemChange,
  arabicInput,
  onArabicInputChange,
  yourName,
  onYourNameChange,
  motherName,
  onMotherNameChange,
  selectedDivineName,
  onDivineNameChange,
  selectedSurah,
  onSurahChange,
  selectedAyah,
  onAyahChange,
  removeVowels,
  onRemoveVowelsChange,
  ignorePunctuation,
  onIgnorePunctuationChange,
  ignoreSpaces,
  onIgnoreSpacesChange,
  onCalculate,
  isLoading,
}) => {
  const colors = CalculatorColors;
  const [showDivineNamesPicker, setShowDivineNamesPicker] = useState(false);
  const [showSurahSelector, setShowSurahSelector] = useState(false);

  // Render type-specific inputs
  const renderTypeSpecificInputs = () => {
    switch (calculationType) {
      case 'name':
        return (
          <View style={styles.inputCard}>
            <View style={styles.inputHeader}>
              <Text style={styles.inputLabel}>👤 Name</Text>
              <Text style={styles.inputHint}>Arabic or transliterated</Text>
            </View>
            <TextInput
              style={styles.arabicInput}
              value={arabicInput}
              onChangeText={onArabicInputChange}
              placeholder="محمد"
              placeholderTextColor="#64748b"
            />
          </View>
        );

      case 'lineage':
        return (
          <>
            <View style={styles.inputCard}>
              <View style={styles.inputHeader}>
                <Text style={styles.inputLabel}>👤 Your Name</Text>
                <Text style={styles.inputHint}>Arabic or transliterated</Text>
              </View>
              <TextInput
                style={styles.arabicInput}
                value={yourName}
                onChangeText={onYourNameChange}
                placeholder="محمد"
                placeholderTextColor="#64748b"
              />
            </View>
            
            <View style={styles.inputCard}>
              <View style={styles.inputHeader}>
                <Text style={styles.inputLabel}>👩 Mother's Name</Text>
                <Text style={styles.inputHint}>Arabic or transliterated</Text>
              </View>
              <TextInput
                style={styles.arabicInput}
                value={motherName}
                onChangeText={onMotherNameChange}
                placeholder="فاطمة"
                placeholderTextColor="#64748b"
              />
            </View>
          </>
        );
      
      case 'phrase':
        return (
          <>
            <View style={styles.inputCard}>
              <View style={styles.inputHeader}>
                <Text style={styles.inputLabel}>📝 Phrase or Sentence</Text>
                <Text style={styles.inputHint}>Any length</Text>
              </View>
              <TextInput
                style={[styles.arabicInput, { minHeight: 120 }]}
                value={arabicInput}
                onChangeText={onArabicInputChange}
                placeholder="بسم الله الرحمن الرحيم"
                placeholderTextColor="#64748b"
                multiline
              />
            </View>
            
            <View style={styles.optionCard}>
              <View style={styles.optionRow}>
                <Text style={styles.optionLabel}>Remove vowels/harakat</Text>
                <Switch
                  value={removeVowels}
                  onValueChange={onRemoveVowelsChange}
                  trackColor={{ false: '#334155', true: '#6366f1' }}
                  thumbColor={removeVowels ? '#fff' : '#94a3b8'}
                />
              </View>
              <View style={styles.optionRow}>
                <Text style={styles.optionLabel}>Ignore punctuation</Text>
                <Switch
                  value={ignorePunctuation}
                  onValueChange={onIgnorePunctuationChange}
                  trackColor={{ false: '#334155', true: '#6366f1' }}
                  thumbColor={ignorePunctuation ? '#fff' : '#94a3b8'}
                />
              </View>
              <View style={styles.optionRow}>
                <Text style={styles.optionLabel}>Ignore spaces</Text>
                <Switch
                  value={ignoreSpaces}
                  onValueChange={onIgnoreSpacesChange}
                  trackColor={{ false: '#334155', true: '#6366f1' }}
                  thumbColor={ignoreSpaces ? '#fff' : '#94a3b8'}
                />
              </View>
            </View>
          </>
        );
      
      case 'quran':
        return (
          <>
            <TouchableOpacity
              style={styles.selectorButton}
              onPress={() => setShowSurahSelector(true)}
            >
              <Text style={styles.selectorButtonText}>
                {selectedSurah && selectedAyah
                  ? `📖 Surah ${selectedSurah}, Ayah ${selectedAyah}`
                  : '📖 Select Surah & Ayah'}
              </Text>
            </TouchableOpacity>

            <Text style={styles.orText}>— OR —</Text>

            <View style={styles.inputCard}>
              <View style={styles.inputHeader}>
                <Text style={styles.inputLabel}>Paste Arabic Text</Text>
              </View>
              <TextInput
                style={[styles.arabicInput, { minHeight: 100 }]}
                value={arabicInput}
                onChangeText={onArabicInputChange}
                placeholder="بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِیمِ"
                placeholderTextColor="#64748b"
                multiline
              />
            </View>

            {showSurahSelector && (
              <Modal
                visible
                animationType="slide"
                onRequestClose={() => setShowSurahSelector(false)}
              >
                <SafeAreaView style={styles.modalContainer}>
                  <View style={styles.modalHeader}>
                    <TouchableOpacity
                      onPress={() => setShowSurahSelector(false)}
                      style={styles.modalCloseButton}
                    >
                      <Text style={styles.modalCloseText}>✕ Close</Text>
                    </TouchableOpacity>
                  </View>
                  <SurahAyahSelector
                    selectedSurah={selectedSurah}
                    selectedAyah={selectedAyah}
                    onSelect={(surahNumber, ayahNumber) => {
                      onSurahChange(surahNumber);
                      onAyahChange(ayahNumber);
                      setShowSurahSelector(false);
                    }}
                  />
                </SafeAreaView>
              </Modal>
            )}
          </>
        );
      
      case 'dhikr':
        return (
          <>
            <TouchableOpacity
              style={styles.selectorButton}
              onPress={() => setShowDivineNamesPicker(true)}
            >
              <Text style={styles.selectorButtonText}>
                {selectedDivineName
                  ? `🤲 Name #${selectedDivineName}`
                  : '🤲 Select Divine Name'}
              </Text>
            </TouchableOpacity>

            {showDivineNamesPicker && (
              <DivineNamesPicker
                  selectedNameNumber={selectedDivineName}
                  onSelect={(divineName) => {
                    onDivineNameChange(divineName.number);
                    setShowDivineNamesPicker(false);
                  }}
              />
            )}
          </>
        );
      
      case 'general':
        return (
          <View style={styles.inputCard}>
            <View style={styles.inputHeader}>
              <Text style={styles.inputLabel}>🔤 Any Text</Text>
              <Text style={styles.inputHint}>Word, name, or phrase</Text>
            </View>
            <TextInput
              style={styles.arabicInput}
              value={arabicInput}
              onChangeText={onArabicInputChange}
              placeholder="أي نص عربي"
              placeholderTextColor="#64748b"
              multiline
            />
          </View>
        );

      default:
        return null;
    }
  };

  const canCalculate = () => {
    switch (calculationType) {
      case 'name':
      case 'phrase':
      case 'general':
        return arabicInput.trim().length > 0;
      case 'lineage':
        return yourName.trim().length > 0 && motherName.trim().length > 0;
      case 'quran':
        return (selectedSurah && selectedAyah) || arabicInput.trim().length > 0;
      case 'dhikr':
        return selectedDivineName !== null;
      default:
        return false;
    }
  };

  return (
    <View style={styles.container}>
      {/* System Selector */}
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

      {/* Type-Specific Inputs */}
      {renderTypeSpecificInputs()}

      {/* Calculate Button */}
      <TouchableOpacity
        style={[styles.calculateWrapper, (!canCalculate() || isLoading) && styles.disabled]}
        onPress={onCalculate}
        disabled={!canCalculate() || isLoading}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={isLoading ? ['#64748b', '#475569'] : ['#6366f1', '#8b5cf6', '#a855f7']}
          style={styles.calculateButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.calculateText}>
            {isLoading ? '⌛ Calculating...' : '✨ Calculate'}
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

  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  modalHeader: {
    padding: 20,
    alignItems: 'flex-end',
  },
  modalCloseButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
  },
  modalCloseText: {
    color: '#f1f5f9',
    fontSize: 14,
    fontWeight: '600',
  },
  
  // Type-specific styles
  formulaChip: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#6366f1',
  },
  
  formulaText: {
    fontSize: 13,
    color: '#a5b4fc',
    textAlign: 'center',
    fontWeight: '600',
  },
  
  optionCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 12,
  },
  
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  optionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#cbd5e1',
  },
  
  hintText: {
    fontSize: 12,
    color: '#64748b',
    fontStyle: 'italic',
    marginTop: 4,
  },
  
  // Phase 2 Selector Buttons
  selectorButton: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#6366f1',
    alignItems: 'center',
  },
  
  selectorButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#a5b4fc',
  },
  
  orText: {
    textAlign: 'center',
    color: '#64748b',
    fontSize: 14,
    fontWeight: '600',
    marginVertical: 12,
  },
});
