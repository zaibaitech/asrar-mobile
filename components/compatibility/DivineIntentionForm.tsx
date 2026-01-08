/**
 * Divine Name ↔ Intention Compatibility Form
 */

import React, { useState } from 'react';
import {
    ActivityIndicator,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { calculateDivineNameIntentionCompatibility } from '../../services/compatibility/divineNameCompatibility';
import {
    getAllCompatibilityDivineNames
} from '../../services/compatibility/divineNamesData';
import {
    DivineNameIntentionCompatibility,
    DivineNameMetadata,
    IntentionCategory
} from '../../services/compatibility/types';

interface DivineIntentionFormProps {
  language: 'en' | 'fr' | 'ar';
  onCalculate: (result: DivineNameIntentionCompatibility) => void;
}

export function DivineIntentionForm({ language, onCalculate }: DivineIntentionFormProps) {
  const [selectedIntention, setSelectedIntention] = useState<IntentionCategory | null>(null);
  const [selectedDivineName, setSelectedDivineName] = useState<DivineNameMetadata | null>(null);
  const [showNamePicker, setShowNamePicker] = useState(false);
  const [showIntentionPicker, setShowIntentionPicker] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState('');

  const divineNames = getAllCompatibilityDivineNames();
  
  const intentions: Array<{ value: IntentionCategory; labelEn: string; labelAr: string; icon: string }> = [
    { value: 'clarity', labelEn: 'Clarity', labelAr: 'الوضوح', icon: '💡' },
    { value: 'patience', labelEn: 'Patience', labelAr: 'الصبر', icon: '🕊️' },
    { value: 'provision', labelEn: 'Provision', labelAr: 'الرزق', icon: '🌾' },
    { value: 'healing', labelEn: 'Healing', labelAr: 'الشفاء', icon: '💚' },
    { value: 'protection', labelEn: 'Protection', labelAr: 'الحماية', icon: '🛡️' },
    { value: 'guidance', labelEn: 'Guidance', labelAr: 'الهداية', icon: '🧭' },
    { value: 'strength', labelEn: 'Strength', labelAr: 'القوة', icon: '💪' },
    { value: 'peace', labelEn: 'Peace', labelAr: 'السلام', icon: '☮️' },
    { value: 'knowledge', labelEn: 'Knowledge', labelAr: 'المعرفة', icon: '📚' },
    { value: 'forgiveness', labelEn: 'Forgiveness', labelAr: 'المغفرة', icon: '🤲' }
  ];

  const handleCalculate = async () => {
    setError('');
    
    if (!selectedIntention) {
      setError(language === 'en' ? 'Please select an intention' : 'يرجى اختيار نية');
      return;
    }

    if (!selectedDivineName) {
      setError(language === 'en' ? 'Please select a Divine Name' : 'يرجى اختيار اسم إلهي');
      return;
    }

    setIsCalculating(true);

    try {
      const result = calculateDivineNameIntentionCompatibility(
        selectedDivineName,
        selectedIntention,
        divineNames
      );

      onCalculate(result);
    } catch (err) {
      console.error('Compatibility calculation error:', err);
      setError(language === 'en' 
        ? 'Calculation failed.'
        : 'فشل الحساب.');
    } finally {
      setIsCalculating(false);
    }
  };

  const selectedIntentionData = intentions.find(i => i.value === selectedIntention);

  return (
    <View style={styles.container}>
      {/* Intention Selection */}
      <Text style={styles.sectionTitle}>
        {language === 'en' ? 'Your Spiritual Intention' : 'نيتك الروحية'}
      </Text>

      <TouchableOpacity
        style={styles.pickerButton}
        onPress={() => setShowIntentionPicker(true)}
      >
        <Text style={styles.pickerButtonText}>
          {selectedIntentionData 
            ? `${selectedIntentionData.icon} ${language === 'en' ? selectedIntentionData.labelEn : selectedIntentionData.labelAr}`
            : (language === 'en' ? 'Choose Your Intention' : 'اختر نيتك')}
        </Text>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>

      {/* Divine Name Selection */}
      <Text style={styles.sectionTitle}>
        {language === 'en' ? 'Divine Name to Evaluate' : 'الاسم الإلهي للتقييم'}
      </Text>

      <TouchableOpacity
        style={styles.pickerButton}
        onPress={() => setShowNamePicker(true)}
      >
        <Text style={styles.pickerButtonText}>
          {selectedDivineName 
            ? `${selectedDivineName.arabic} (${selectedDivineName.transliteration})`
            : (language === 'en' ? 'Choose a Divine Name' : 'اختر اسماً إلهياً')}
        </Text>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>

      {/* Intention Picker Modal */}
      <Modal
        visible={showIntentionPicker}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowIntentionPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {language === 'en' ? 'Select Intention' : 'اختر النية'}
              </Text>
              <TouchableOpacity onPress={() => setShowIntentionPicker(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.itemList}>
              {intentions.map((intention) => (
                <TouchableOpacity
                  key={intention.value}
                  style={[
                    styles.item,
                    selectedIntention === intention.value && styles.itemActive
                  ]}
                  onPress={() => {
                    setSelectedIntention(intention.value);
                    setShowIntentionPicker(false);
                  }}
                >
                  <Text style={styles.itemIcon}>{intention.icon}</Text>
                  <Text style={styles.itemText}>
                    {language === 'en' ? intention.labelEn : intention.labelAr}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

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

            <ScrollView style={styles.itemList}>
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
            {language === 'en' ? 'Evaluate Alignment' : 'تقييم التوافق'}
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
  pickerButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  chevron: {
    color: '#64748b',
    fontSize: 24,
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
  itemList: {
    padding: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    marginBottom: 8,
  },
  itemActive: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderWidth: 1,
    borderColor: '#8b5cf6',
  },
  itemIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  itemText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
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
