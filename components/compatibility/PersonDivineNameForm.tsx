/**
 * Person ↔ Divine Name Compatibility Form
 */

import React, { useState } from 'react';
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
import { calculatePersonDivineNameCompatibility } from '../../services/compatibility/divineNameCompatibility';
import {
    getAllCompatibilityDivineNames
} from '../../services/compatibility/divineNamesData';
import {
    DivineNameMetadata,
    PersonDivineNameCompatibility
} from '../../services/compatibility/types';
import { buildDestiny } from '../../services/ilm-huruf/core';

interface PersonDivineNameFormProps {
  language: 'en' | 'ar';
  onCalculate: (result: PersonDivineNameCompatibility) => void;
}

export function PersonDivineNameForm({ language, onCalculate }: PersonDivineNameFormProps) {
  const [personName, setPersonName] = useState('');
  const [personArabic, setPersonArabic] = useState('');
  const [selectedDivineName, setSelectedDivineName] = useState<DivineNameMetadata | null>(null);
  const [showNamePicker, setShowNamePicker] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState('');

  const divineNames = getAllCompatibilityDivineNames();

  const handleCalculate = async () => {
    setError('');
    
    if (!personArabic.trim()) {
      setError(language === 'en' ? 'Arabic name is required' : 'الاسم العربي مطلوب');
      return;
    }

    if (!selectedDivineName) {
      setError(language === 'en' ? 'Please select a Divine Name' : 'يرجى اختيار اسم إلهي');
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
      setError(language === 'en' 
        ? 'Calculation failed. Please check your inputs.'
        : 'فشل الحساب. يرجى التحقق من المدخلات.');
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Person Input */}
      <Text style={styles.sectionTitle}>
        {language === 'en' ? 'Your Information' : 'معلوماتك'}
      </Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          {language === 'en' ? 'Display Name (Optional)' : 'الاسم للعرض (اختياري)'}
        </Text>
        <TextInput
          style={styles.input}
          value={personName}
          onChangeText={setPersonName}
          placeholder={language === 'en' ? 'e.g., Ahmed' : 'مثال: أحمد'}
          placeholderTextColor="#64748b"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          {language === 'en' ? 'Arabic Name *' : 'الاسم العربي *'}
        </Text>
        <TextInput
          style={[styles.input, styles.arabicInput]}
          value={personArabic}
          onChangeText={setPersonArabic}
          placeholder="أحمد"
          placeholderTextColor="#64748b"
        />
      </View>

      {/* Divine Name Selection */}
      <Text style={styles.sectionTitle}>
        {language === 'en' ? 'Select Divine Name' : 'اختر الاسم الإلهي'}
      </Text>

      <TouchableOpacity
        style={styles.namePickerButton}
        onPress={() => setShowNamePicker(true)}
      >
        <Text style={styles.namePickerButtonText}>
          {selectedDivineName 
            ? `${selectedDivineName.arabic} (${selectedDivineName.transliteration})`
            : (language === 'en' ? 'Choose a Divine Name' : 'اختر اسماً إلهياً')}
        </Text>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>

      {selectedDivineName && (
        <View style={styles.namePreview}>
          <Text style={styles.namePreviewMeaning}>
            {language === 'en' 
              ? selectedDivineName.meaning.en 
              : selectedDivineName.meaning.ar}
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
                {language === 'en' ? 'Select Divine Name' : 'اختر الاسم الإلهي'}
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
            {language === 'en' ? 'Calculate Resonance' : 'حساب الرنين'}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
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
  label: {
    color: '#cbd5e1',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
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
