/**
 * Person ↔ Divine Name Compatibility Form
 */

import { LinearGradient } from 'expo-linear-gradient';
import { Keyboard } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import {
    ActivityIndicator,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { ABJAD_MAGHRIBI } from '../../constants/abjad-maps';
import { useLanguage } from '../../contexts/LanguageContext';
import { calculatePersonDivineNameCompatibility } from '../../services/compatibility/divineNameCompatibility';
import {
    getAllCompatibilityDivineNames
} from '../../services/compatibility/divineNamesData';
import {
    DivineNameMetadata,
    PersonDivineNameCompatibility
} from '../../services/compatibility/types';
import { buildDestiny } from '../../services/ilm-huruf/core';
import ArabicKeyboard from '../istikhara/ArabicKeyboard';
import NameAutocomplete from '../NameAutocomplete';

interface PersonDivineNameFormProps {
  onCalculate: (result: PersonDivineNameCompatibility) => void;
}

export function PersonDivineNameForm({ onCalculate }: PersonDivineNameFormProps) {
  const { language, t } = useLanguage();
  const [personName, setPersonName] = useState('');
  const [personArabic, setPersonArabic] = useState('');
  const [personLatin, setPersonLatin] = useState('');
  const [selectedDivineName, setSelectedDivineName] = useState<DivineNameMetadata | null>(null);
  const [showNamePicker, setShowNamePicker] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState('');

  // Arabic keyboard state
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const personInputRef = useRef<TextInput>(null);

  const divineNames = getAllCompatibilityDivineNames();

  // Keyboard handlers
  const handleKeyPress = (key: string) => {
    const newText = personArabic.slice(0, cursorPosition) + key + personArabic.slice(cursorPosition);
    setPersonArabic(newText);
    setCursorPosition(cursorPosition + 1);
  };

  const handleBackspace = () => {
    if (cursorPosition === 0) return;
    const newText = personArabic.slice(0, cursorPosition - 1) + personArabic.slice(cursorPosition);
    setPersonArabic(newText);
    setCursorPosition(cursorPosition - 1);
  };

  const handleSpace = () => {
    handleKeyPress(' ');
  };

  const openKeyboard = () => {
    setCursorPosition(personArabic.length);
    setShowKeyboard(true);
  };

  const handleCalculate = async () => {
    setError('');
    
    if (!personArabic.trim()) {
      setError(t('compatibility.form.errors.arabicNameRequired'));
      return;
    }

    if (!selectedDivineName) {
      setError(t('compatibility.form.errors.divineNameRequired'));
      return;
    }

    setIsCalculating(true);

    try {
      const destiny = buildDestiny(personArabic, undefined, ABJAD_MAGHRIBI);

      const result = calculatePersonDivineNameCompatibility(
        personName || personArabic,
        personArabic,
        destiny,
        selectedDivineName
      );

      onCalculate(result);
    } catch (err) {
      console.error('Compatibility calculation error:', err);
      setError(t('compatibility.form.errors.calculationFailed'));
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Person Input */}
      <View style={styles.inputSection}>
        <LinearGradient
          colors={['rgba(147, 51, 234, 0.3)', 'rgba(236, 72, 153, 0.2)']}
          style={styles.inputGradient}
        >
          <View style={styles.inputHeader}>
            <View style={styles.inputTitleRow}>
              <Text style={styles.inputEmoji}>👤</Text>
              <Text style={styles.inputTitle}>
                {t('compatibility.form.personInfo.title')}
              </Text>
            </View>
          </View>

          {/* Display Name */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>
              {t('compatibility.form.personInfo.displayName.label')}
            </Text>
            <TextInput
              style={styles.input}
              value={personName}
              onChangeText={setPersonName}
              placeholder={t('compatibility.form.personInfo.displayName.placeholder')}
              placeholderTextColor="#64748b"
            />
          </View>

          {/* Latin Name Autocomplete */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>
              {t('compatibility.form.personInfo.latinName.label')}
            </Text>
            <NameAutocomplete
              value={personLatin}
              onChange={setPersonLatin}
              onArabicSelect={(arabic, latin) => {
                setPersonArabic(arabic);
                setPersonLatin(latin);
              }}
              placeholder={t('compatibility.form.personInfo.latinName.placeholder')}
              showHelper={false}
              language={language}
            />
          </View>

          {/* Arabic Name Input */}
          <View style={styles.inputWrapper}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>
                {t('compatibility.form.personInfo.arabicName.label')}
              </Text>
              <TouchableOpacity
                style={styles.keyboardButton}
                onPress={openKeyboard}
              >
                <Keyboard size={14} color="#a78bfa" strokeWidth={2} />
                <Text style={styles.keyboardButtonText}>
                  {t('compatibility.form.personInfo.keyboard')}
                </Text>
              </TouchableOpacity>
            </View>
            <TextInput
              ref={personInputRef}
              style={[styles.input, styles.arabicInput]}
              value={personArabic}
              onChangeText={(text) => {
                setPersonArabic(text);
                setCursorPosition(text.length);
              }}
              onSelectionChange={(e) => setCursorPosition(e.nativeEvent.selection.start)}
              placeholder={t('compatibility.form.personInfo.arabicName.placeholder')}
              placeholderTextColor="#64748b"
              editable={!showKeyboard}
            />
          </View>
        </LinearGradient>
      </View>

      {/* Divine Name Selection */}
      <Text style={styles.sectionTitle}>
        {t('compatibility.form.divineName.title')}
      </Text>

      <TouchableOpacity
        style={styles.namePickerButton}
        onPress={() => setShowNamePicker(true)}
      >
        <Text style={styles.namePickerButtonText}>
          {selectedDivineName 
            ? `${selectedDivineName.arabic} (${selectedDivineName.transliteration})`
            : t('compatibility.form.divineName.placeholder')}
        </Text>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>

      {selectedDivineName && (
        <View style={styles.namePreview}>
          <Text style={styles.namePreviewMeaning}>
            {language === 'ar' 
              ? selectedDivineName.meaning.ar 
              : selectedDivineName.meaning.en}
          </Text>
        </View>
      )}

      {/* Divine Name Picker Modal */}
      <Modal
        visible={showNamePicker}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowNamePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {t('compatibility.form.divineName.title')}
              </Text>
              <TouchableOpacity onPress={() => setShowNamePicker(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.nameList}>
              {divineNames.map((name) => (
                <TouchableOpacity
                  key={name.number}
                  style={[
                    styles.nameItem,
                    selectedDivineName?.number === name.number && styles.nameItemActive
                  ]}
                  onPress={() => {
                    setSelectedDivineName(name);
                    setShowNamePicker(false);
                  }}
                >
                  <Text style={styles.nameNumber}>{name.number}</Text>
                  <View style={styles.nameDetails}>
                    <Text style={styles.nameArabic}>{name.arabic}</Text>
                    <Text style={styles.nameTransliteration}>{name.transliteration}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Error Message */}
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {/* Calculate Button */}
      <TouchableOpacity
        style={[styles.calculateButton, isCalculating && styles.calculateButtonDisabled]}
        onPress={handleCalculate}
        disabled={isCalculating}
      >
        {isCalculating ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.calculateButtonText}>
            {t('compatibility.form.cta2.calculateResonance')}
          </Text>
        )}
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
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  inputSection: {
    marginBottom: 8,
  },
  inputGradient: {
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputHeader: {
    marginBottom: 16,
  },
  inputTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inputEmoji: {
    fontSize: 24,
  },
  inputTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#ffffff',
  },
  inputWrapper: {
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    marginTop: 16,
  },
  inputGroup: {
    marginBottom: 16,
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
    fontWeight: '500',
  },
  keyboardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.4)',
  },
  keyboardButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#a78bfa',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    color: '#ffffff',
    fontSize: 16,
  },
  arabicInput: {
    textAlign: 'right',
  },
  namePickerButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  namePickerButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  chevron: {
    color: '#64748b',
    fontSize: 24,
  },
  namePreview: {
    marginTop: 8,
    padding: 12,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 8,
  },
  namePreviewMeaning: {
    color: '#cbd5e1',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1e293b',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  modalClose: {
    color: '#94a3b8',
    fontSize: 24,
  },
  nameList: {
    padding: 16,
  },
  nameItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    marginBottom: 8,
  },
  nameItemActive: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderWidth: 1,
    borderColor: '#8b5cf6',
  },
  nameNumber: {
    color: '#64748b',
    fontSize: 14,
    width: 40,
  },
  nameDetails: {
    flex: 1,
  },
  nameArabic: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  nameTransliteration: {
    color: '#94a3b8',
    fontSize: 14,
  },
  errorContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
  },
  calculateButton: {
    backgroundColor: '#8b5cf6',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  calculateButtonDisabled: {
    opacity: 0.6,
  },
  calculateButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
