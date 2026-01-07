import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import { Modal, SafeAreaView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { CalculatorColors } from '../../constants/CalculatorColors';
import { useLanguage } from '../../contexts/LanguageContext';
import { CalculationType } from '../../types/calculator-enhanced';
import NameAutocomplete from '../NameAutocomplete';
import ArabicKeyboard from './ArabicKeyboard';
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
  selectedAyah: number | 'basmalah' | null;
  onAyahChange: (number: number | 'basmalah' | null) => void;
  
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
  const { t } = useLanguage();
  const [showDivineNamesPicker, setShowDivineNamesPicker] = useState(false);
  const [showSurahSelector, setShowSurahSelector] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [activeInput, setActiveInput] = useState<'arabic' | 'yourName' | 'motherName' | null>(null);
  
  // Latin autocomplete states
  const [nameLatin, setNameLatin] = useState('');
  const [yourNameLatin, setYourNameLatin] = useState('');
  const [motherNameLatin, setMotherNameLatin] = useState('');
  
  // Refs for text inputs to track cursor position
  const arabicInputRef = useRef<TextInput>(null);
  const yourNameInputRef = useRef<TextInput>(null);
  const motherNameInputRef = useRef<TextInput>(null);
  const [cursorPosition, setCursorPosition] = useState(0);
  
  // Keyboard handlers
  const handleKeyPress = (key: string) => {
    if (activeInput === 'arabic') {
      const newText = arabicInput.slice(0, cursorPosition) + key + arabicInput.slice(cursorPosition);
      onArabicInputChange(newText);
      setCursorPosition(cursorPosition + 1);
    } else if (activeInput === 'yourName') {
      const newText = yourName.slice(0, cursorPosition) + key + yourName.slice(cursorPosition);
      onYourNameChange(newText);
      setCursorPosition(cursorPosition + 1);
    } else if (activeInput === 'motherName') {
      const newText = motherName.slice(0, cursorPosition) + key + motherName.slice(cursorPosition);
      onMotherNameChange(newText);
      setCursorPosition(cursorPosition + 1);
    }
  };
  
  const handleBackspace = () => {
    if (cursorPosition === 0) return;
    
    if (activeInput === 'arabic') {
      const newText = arabicInput.slice(0, cursorPosition - 1) + arabicInput.slice(cursorPosition);
      onArabicInputChange(newText);
      setCursorPosition(cursorPosition - 1);
    } else if (activeInput === 'yourName') {
      const newText = yourName.slice(0, cursorPosition - 1) + yourName.slice(cursorPosition);
      onYourNameChange(newText);
      setCursorPosition(cursorPosition - 1);
    } else if (activeInput === 'motherName') {
      const newText = motherName.slice(0, cursorPosition - 1) + motherName.slice(cursorPosition);
      onMotherNameChange(newText);
      setCursorPosition(cursorPosition - 1);
    }
  };
  
  const handleSpace = () => {
    handleKeyPress(' ');
  };
  
  const openKeyboard = (inputType: 'arabic' | 'yourName' | 'motherName') => {
    setActiveInput(inputType);
    // Set cursor to end of current text
    if (inputType === 'arabic') {
      setCursorPosition(arabicInput.length);
    } else if (inputType === 'yourName') {
      setCursorPosition(yourName.length);
    } else if (inputType === 'motherName') {
      setCursorPosition(motherName.length);
    }
    setShowKeyboard(true);
  };

  // Render type-specific inputs
  const renderTypeSpecificInputs = () => {
    switch (calculationType) {
      case 'name':
        return (
          <View style={styles.inputCard}>
            <View style={styles.inputHeader}>
              <Text style={styles.inputLabel}>👤 {t('calculator.form.name')}</Text>
            </View>
            
            {/* Latin Name Autocomplete */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>{t('calculator.inputs.latinName')}</Text>
              <NameAutocomplete
                value={nameLatin}
                onChange={setNameLatin}
                onArabicSelect={(arabic, latin) => {
                  onArabicInputChange(arabic);
                  setNameLatin(latin);
                }}
                placeholder={t('calculator.inputs.latinNamePlaceholder')}
                showHelper={false}
                language="en"
              />
            </View>
            
            {/* Arabic Name Input */}
            <View style={styles.inputWrapper}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>{t('calculator.inputs.arabicNameRequired')}</Text>
                <TouchableOpacity 
                  style={styles.keyboardButton}
                  onPress={() => openKeyboard('arabic')}
                >
                  <Text style={styles.keyboardButtonText}>⌨️ {t('calculator.inputs.keyboard')}</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                ref={arabicInputRef}
                style={styles.arabicInput}
                value={arabicInput}
                onChangeText={onArabicInputChange}
                onSelectionChange={(e) => setCursorPosition(e.nativeEvent.selection.start)}
                placeholder="محمد"
                placeholderTextColor="#64748b"
                editable={!showKeyboard || activeInput !== 'arabic'}
              />
            </View>
          </View>
        );

      case 'lineage':
        return (
          <>
            <View style={styles.inputCard}>
              <View style={styles.inputHeader}>
                <Text style={styles.inputLabel}>👤 {t('calculator.form.yourName')}</Text>
              </View>
              
              {/* Latin Name Autocomplete */}
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>{t('calculator.inputs.latinName')}</Text>
                <NameAutocomplete
                  value={yourNameLatin}
                  onChange={setYourNameLatin}
                  onArabicSelect={(arabic, latin) => {
                    onYourNameChange(arabic);
                    setYourNameLatin(latin);
                  }}
                  placeholder={t('calculator.inputs.latinNamePlaceholder')}
                  showHelper={false}
                  language="en"
                />
              </View>
              
              {/* Arabic Name Input */}
              <View style={styles.inputWrapper}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>{t('calculator.inputs.arabicNameRequired')}</Text>
                  <TouchableOpacity 
                    style={styles.keyboardButton}
                    onPress={() => openKeyboard('yourName')}
                  >
                    <Text style={styles.keyboardButtonText}>⌨️ {t('calculator.inputs.keyboard')}</Text>
                  </TouchableOpacity>
                </View>
                <TextInput
                  ref={yourNameInputRef}
                  style={styles.arabicInput}
                  value={yourName}
                  onChangeText={onYourNameChange}
                  onSelectionChange={(e) => setCursorPosition(e.nativeEvent.selection.start)}
                  placeholder="محمد"
                  placeholderTextColor="#64748b"
                  editable={!showKeyboard || activeInput !== 'yourName'}
                />
              </View>
            </View>
            
            <View style={styles.inputCard}>
              <View style={styles.inputHeader}>
                <Text style={styles.inputLabel}>👩 {t('calculator.form.motherName')}</Text>
              </View>
              
              {/* Latin Name Autocomplete */}
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>{t('calculator.inputs.latinName')}</Text>
                <NameAutocomplete
                  value={motherNameLatin}
                  onChange={setMotherNameLatin}
                  onArabicSelect={(arabic, latin) => {
                    onMotherNameChange(arabic);
                    setMotherNameLatin(latin);
                  }}
                  placeholder={t('calculator.inputs.motherLatinPlaceholder')}
                  showHelper={false}
                  language="en"
                />
              </View>
              
              {/* Arabic Name Input */}
              <View style={styles.inputWrapper}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>{t('calculator.inputs.arabicNameRequired')}</Text>
                  <TouchableOpacity 
                    style={styles.keyboardButton}
                    onPress={() => openKeyboard('motherName')}
                  >
                    <Text style={styles.keyboardButtonText}>⌨️ {t('calculator.inputs.keyboard')}</Text>
                  </TouchableOpacity>
                </View>
                <TextInput
                  ref={motherNameInputRef}
                  style={styles.arabicInput}
                  value={motherName}
                  onChangeText={onMotherNameChange}
                  onSelectionChange={(e) => setCursorPosition(e.nativeEvent.selection.start)}
                  placeholder="فاطمة"
                  placeholderTextColor="#64748b"
                  editable={!showKeyboard || activeInput !== 'motherName'}
                />
              </View>
            </View>
          </>
        );
      
      case 'phrase':
        return (
          <>
            <View style={styles.inputCard}>
              <View style={styles.inputHeader}>
                <Text style={styles.inputLabel}>📝 {t('calculator.form.phraseOrSentence')}</Text>
                <TouchableOpacity 
                  style={styles.keyboardButton}
                  onPress={() => openKeyboard('arabic')}
                >
                  <Text style={styles.keyboardButtonText}>⌨️</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                ref={arabicInputRef}
                style={[styles.arabicInput, { minHeight: 120 }]}
                value={arabicInput}
                onChangeText={onArabicInputChange}
                onSelectionChange={(e) => setCursorPosition(e.nativeEvent.selection.start)}
                placeholder="بسم الله الرحمن الرحيم"
                placeholderTextColor="#64748b"
                multiline
              />
            </View>
            
            <View style={styles.optionCard}>
              <View style={styles.optionRow}>
                <Text style={styles.optionLabel}>{t('calculator.options.removeVowels')}</Text>
                <Switch
                  value={removeVowels}
                  onValueChange={onRemoveVowelsChange}
                  trackColor={{ false: '#334155', true: '#6366f1' }}
                  thumbColor={removeVowels ? '#fff' : '#94a3b8'}
                />
              </View>
              <View style={styles.optionRow}>
                <Text style={styles.optionLabel}>{t('calculator.options.ignorePunctuation')}</Text>
                <Switch
                  value={ignorePunctuation}
                  onValueChange={onIgnorePunctuationChange}
                  trackColor={{ false: '#334155', true: '#6366f1' }}
                  thumbColor={ignorePunctuation ? '#fff' : '#94a3b8'}
                />
              </View>
              <View style={styles.optionRow}>
                <Text style={styles.optionLabel}>{t('calculator.options.ignoreSpaces')}</Text>
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
                  ? selectedAyah === 'basmalah'
                    ? `📿 Basmalah (بِسْمِ ٱللَّهِ)`
                    : `📖 Surah ${selectedSurah}, Ayah ${selectedAyah}`
                  : `📖 ${t('calculator.inputs.selectSurahAyah')}`}
              </Text>
            </TouchableOpacity>

            <Text style={styles.orText}>{t('calculator.inputs.orDivider')}</Text>

            <View style={styles.inputCard}>
              <View style={styles.inputHeader}>
                <Text style={styles.inputLabel}>{t('calculator.form.pasteArabicText')}</Text>
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
                      <Text style={styles.modalCloseText}>✕ {t('calculator.actions.close')}</Text>
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
                  : `🤲 ${t('calculator.inputs.selectDivineName')}`}
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
              <Text style={styles.inputLabel}>🔤 {t('calculator.form.anyText')}</Text>
              <TouchableOpacity 
                style={styles.keyboardButton}
                onPress={() => openKeyboard('arabic')}
              >
                <Text style={styles.keyboardButtonText}>⌨️</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              ref={arabicInputRef}
              style={styles.arabicInput}
              value={arabicInput}
              onChangeText={onArabicInputChange}
              onSelectionChange={(e) => setCursorPosition(e.nativeEvent.selection.start)}
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
        <Text style={styles.selectorLabel}>🎯 {t('calculator.form.abjadSystem')}</Text>
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
                <Text style={styles.systemTextActive}>🌙 {t('calculator.abjad.maghribi')}</Text>
              </LinearGradient>
            ) : (
              <View style={[styles.systemButton, styles.systemButtonInactive]}>
                <Text style={styles.systemTextInactive}>{t('calculator.abjad.maghribi')}</Text>
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
                <Text style={styles.systemTextActive}>☀️ {t('calculator.abjad.mashriqi')}</Text>
              </LinearGradient>
            ) : (
              <View style={[styles.systemButton, styles.systemButtonInactive]}>
                <Text style={styles.systemTextInactive}>{t('calculator.abjad.mashriqi')}</Text>
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
            {isLoading ? `⌛ ${t('calculator.actions.calculating')}` : `✨ ${t('calculator.actions.calculate')}`}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
      
      {/* Arabic Keyboard */}
      <ArabicKeyboard
        visible={showKeyboard}
        onClose={() => setShowKeyboard(false)}
        onKeyPress={handleKeyPress}
        onBackspace={handleBackspace}
        onSpace={handleSpace}
      />
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
  inputWrapper: {
    marginBottom: 8,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    color: '#cbd5e1',
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
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
  
  // Arabic Keyboard Button
  keyboardButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  
  keyboardButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
});
