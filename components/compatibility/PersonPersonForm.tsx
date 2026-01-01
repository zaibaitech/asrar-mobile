/**
 * Person ↔ Person Compatibility Form
 * Universal form for marriage, friendship, family, work
 */

import React, { useState } from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { ABJAD_MAGHRIBI } from '../../constants/abjad-maps';
import {
    calculatePersonPersonCompatibility
} from '../../services/compatibility/engine';
import { PersonPersonCompatibility } from '../../services/compatibility/types';
import { buildDestiny } from '../../services/ilm-huruf/core';

interface PersonPersonFormProps {
  language: 'en' | 'ar';
  onCalculate: (result: PersonPersonCompatibility) => void;
}

export function PersonPersonForm({ language, onCalculate }: PersonPersonFormProps) {
  const [person1Name, setPerson1Name] = useState('');
  const [person1Arabic, setPerson1Arabic] = useState('');
  const [person2Name, setPerson2Name] = useState('');
  const [person2Arabic, setPerson2Arabic] = useState('');
  const [relationshipType, setRelationshipType] = useState<'marriage' | 'friendship' | 'family' | 'work' | 'universal'>('universal');
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState('');

  const relationshipTypes = [
    { value: 'universal', labelEn: 'Universal', labelAr: 'شامل' },
    { value: 'marriage', labelEn: 'Marriage', labelAr: 'زواج' },
    { value: 'friendship', labelEn: 'Friendship', labelAr: 'صداقة' },
    { value: 'family', labelEn: 'Family', labelAr: 'عائلة' },
    { value: 'work', labelEn: 'Work', labelAr: 'عمل' }
  ] as const;

  const handleCalculate = async () => {
    setError('');
    
    // Validation
    if (!person1Arabic.trim() || !person2Arabic.trim()) {
      setError(language === 'en' 
        ? 'Both Arabic names are required'
        : 'الأسماء العربية مطلوبة لكلا الطرفين');
      return;
    }

    setIsCalculating(true);

    try {
      // Calculate Spiritual Destiny for both persons
      const destiny1 = buildDestiny(person1Arabic, undefined, ABJAD_MAGHRIBI);
      const destiny2 = buildDestiny(person2Arabic, undefined, ABJAD_MAGHRIBI);

      // Calculate compatibility
      const result = calculatePersonPersonCompatibility(
        person1Name || person1Arabic,
        person1Arabic,
        destiny1,
        person2Name || person2Arabic,
        person2Arabic,
        destiny2,
        relationshipType
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
      <Text style={styles.sectionTitle}>
        {language === 'en' ? 'Relationship Context' : 'سياق العلاقة'}
      </Text>
      
      {/* Relationship Type Selector */}
      <View style={styles.relationshipTypes}>
        {relationshipTypes.map((type) => (
          <TouchableOpacity
            key={type.value}
            style={[
              styles.relationshipChip,
              relationshipType === type.value && styles.relationshipChipActive
            ]}
            onPress={() => setRelationshipType(type.value)}
          >
            <Text style={[
              styles.relationshipChipText,
              relationshipType === type.value && styles.relationshipChipTextActive
            ]}>
              {language === 'en' ? type.labelEn : type.labelAr}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Person 1 */}
      <Text style={styles.sectionTitle}>
        {language === 'en' ? 'Person 1' : 'الشخص الأول'}
      </Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          {language === 'en' ? 'Display Name (Optional)' : 'الاسم للعرض (اختياري)'}
        </Text>
        <TextInput
          style={styles.input}
          value={person1Name}
          onChangeText={setPerson1Name}
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
          value={person1Arabic}
          onChangeText={setPerson1Arabic}
          placeholder="أحمد"
          placeholderTextColor="#64748b"
        />
      </View>

      {/* Person 2 */}
      <Text style={styles.sectionTitle}>
        {language === 'en' ? 'Person 2' : 'الشخص الثاني'}
      </Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          {language === 'en' ? 'Display Name (Optional)' : 'الاسم للعرض (اختياري)'}
        </Text>
        <TextInput
          style={styles.input}
          value={person2Name}
          onChangeText={setPerson2Name}
          placeholder={language === 'en' ? 'e.g., Fatima' : 'مثال: فاطمة'}
          placeholderTextColor="#64748b"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          {language === 'en' ? 'Arabic Name *' : 'الاسم العربي *'}
        </Text>
        <TextInput
          style={[styles.input, styles.arabicInput]}
          value={person2Arabic}
          onChangeText={setPerson2Arabic}
          placeholder="فاطمة"
          placeholderTextColor="#64748b"
        />
      </View>

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
  relationshipTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
    gap: 8,
  },
  relationshipChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  relationshipChipActive: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderColor: '#8b5cf6',
  },
  relationshipChipText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '500',
  },
  relationshipChipTextActive: {
    color: '#a78bfa',
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
    fontFamily: 'System',
  },
  errorContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
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
    marginTop: 8,
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
