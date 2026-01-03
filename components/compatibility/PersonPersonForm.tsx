/**
 * Person ↔ Person Compatibility Form
 * Universal form for marriage, friendship, family, work
 */

import { LinearGradient } from 'expo-linear-gradient';
import { Keyboard } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
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
import ArabicKeyboard from '../istikhara/ArabicKeyboard';
import NameAutocomplete from '../NameAutocomplete';

interface PersonPersonFormProps {
  language: 'en' | 'ar';
  onCalculate: (result: PersonPersonCompatibility) => void;
}

export function PersonPersonForm({ language, onCalculate }: PersonPersonFormProps) {
  const [person1Name, setPerson1Name] = useState('');
  const [person1Arabic, setPerson1Arabic] = useState('');
  const [person1Latin, setPerson1Latin] = useState('');
  const [person2Name, setPerson2Name] = useState('');
  const [person2Arabic, setPerson2Arabic] = useState('');
  const [person2Latin, setPerson2Latin] = useState('');
  const [relationshipType, setRelationshipType] = useState<'marriage' | 'friendship' | 'family' | 'work' | 'universal'>('universal');
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState('');

  // Arabic keyboard state
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [activeInput, setActiveInput] = useState<'person1' | 'person2' | null>(null);
  const [cursorPosition, setCursorPosition] = useState(0);
  const person1InputRef = useRef<TextInput>(null);
  const person2InputRef = useRef<TextInput>(null);

  const relationshipTypes = [
    { value: 'universal', labelEn: 'Universal', labelAr: 'شامل' },
    { value: 'marriage', labelEn: 'Marriage', labelAr: 'زواج' },
    { value: 'friendship', labelEn: 'Friendship', labelAr: 'صداقة' },
    { value: 'family', labelEn: 'Family', labelAr: 'عائلة' },
    { value: 'work', labelEn: 'Work', labelAr: 'عمل' }
  ] as const;

  // Keyboard handlers
  const handleKeyPress = (key: string) => {
    if (activeInput === 'person1') {
      const newText = person1Arabic.slice(0, cursorPosition) + key + person1Arabic.slice(cursorPosition);
      setPerson1Arabic(newText);
      setCursorPosition(cursorPosition + 1);
    } else if (activeInput === 'person2') {
      const newText = person2Arabic.slice(0, cursorPosition) + key + person2Arabic.slice(cursorPosition);
      setPerson2Arabic(newText);
      setCursorPosition(cursorPosition + 1);
    }
  };

  const handleBackspace = () => {
    if (cursorPosition === 0) return;
    
    if (activeInput === 'person1') {
      const newText = person1Arabic.slice(0, cursorPosition - 1) + person1Arabic.slice(cursorPosition);
      setPerson1Arabic(newText);
      setCursorPosition(cursorPosition - 1);
    } else if (activeInput === 'person2') {
      const newText = person2Arabic.slice(0, cursorPosition - 1) + person2Arabic.slice(cursorPosition);
      setPerson2Arabic(newText);
      setCursorPosition(cursorPosition - 1);
    }
  };

  const handleSpace = () => {
    handleKeyPress(' ');
  };

  const openKeyboard = (inputType: 'person1' | 'person2') => {
    setActiveInput(inputType);
    if (inputType === 'person1') {
      setCursorPosition(person1Arabic.length);
    } else {
      setCursorPosition(person2Arabic.length);
    }
    setShowKeyboard(true);
  };

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
      <View style={styles.inputSection}>
        <LinearGradient
          colors={['rgba(147, 51, 234, 0.3)', 'rgba(236, 72, 153, 0.2)']}
          style={styles.inputGradient}
        >
          <View style={styles.inputHeader}>
            <View style={styles.inputTitleRow}>
              <Text style={styles.inputEmoji}>👤</Text>
              <Text style={styles.inputTitle}>
                {language === 'en' ? 'Person 1' : 'الشخص الأول'}
              </Text>
            </View>
          </View>

          {/* Display Name */}
          <View style={styles.inputWrapper}>
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

          {/* Latin Name Autocomplete */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>
              {language === 'en' ? 'Latin Name (English/French)' : 'الاسم اللاتيني (إنجليزي/فرنسي)'}
            </Text>
            <NameAutocomplete
              value={person1Latin}
              onChange={setPerson1Latin}
              onArabicSelect={(arabic, latin) => {
                setPerson1Arabic(arabic);
                setPerson1Latin(latin);
              }}
              placeholder="e.g., Fatima, Ibrahima, Amadou"
              showHelper={false}
              language={language}
            />
          </View>

          {/* Arabic Name Input */}
          <View style={styles.inputWrapper}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>
                {language === 'en' ? 'Arabic Name *' : 'الاسم العربي *'}
              </Text>
              <TouchableOpacity
                style={styles.keyboardButton}
                onPress={() => openKeyboard('person1')}
              >
                <Keyboard size={14} color="#a78bfa" strokeWidth={2} />
                <Text style={styles.keyboardButtonText}>
                  {language === 'en' ? 'Keyboard' : 'لوحة'}
                </Text>
              </TouchableOpacity>
            </View>
            <TextInput
              ref={person1InputRef}
              style={[styles.input, styles.arabicInput]}
              value={person1Arabic}
              onChangeText={(text) => {
                setPerson1Arabic(text);
                setCursorPosition(text.length);
              }}
              onSelectionChange={(e) => setCursorPosition(e.nativeEvent.selection.start)}
              placeholder="أحمد"
              placeholderTextColor="#64748b"
              editable={!showKeyboard || activeInput !== 'person1'}
            />
          </View>
        </LinearGradient>
      </View>

      {/* Person 2 */}
      <View style={styles.inputSection}>
        <LinearGradient
          colors={['rgba(79, 70, 229, 0.3)', 'rgba(59, 130, 246, 0.2)']}
          style={styles.inputGradient}
        >
          <View style={styles.inputHeader}>
            <View style={styles.inputTitleRow}>
              <Text style={styles.inputEmoji}>👥</Text>
              <Text style={styles.inputTitle}>
                {language === 'en' ? 'Person 2' : 'الشخص الثاني'}
              </Text>
            </View>
          </View>

          {/* Display Name */}
          <View style={styles.inputWrapper}>
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

          {/* Latin Name Autocomplete */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>
              {language === 'en' ? 'Latin Name (English/French)' : 'الاسم اللاتيني (إنجليزي/فرنسي)'}
            </Text>
            <NameAutocomplete
              value={person2Latin}
              onChange={setPerson2Latin}
              onArabicSelect={(arabic, latin) => {
                setPerson2Arabic(arabic);
                setPerson2Latin(latin);
              }}
              placeholder="e.g., Fatima, Khadija, Aisha"
              showHelper={false}
              language={language}
            />
          </View>

          {/* Arabic Name Input */}
          <View style={styles.inputWrapper}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>
                {language === 'en' ? 'Arabic Name *' : 'الاسم العربي *'}
              </Text>
              <TouchableOpacity
                style={styles.keyboardButton}
                onPress={() => openKeyboard('person2')}
              >
                <Keyboard size={14} color="#a78bfa" strokeWidth={2} />
                <Text style={styles.keyboardButtonText}>
                  {language === 'en' ? 'Keyboard' : 'لوحة'}
                </Text>
              </TouchableOpacity>
            </View>
            <TextInput
              ref={person2InputRef}
              style={[styles.input, styles.arabicInput]}
              value={person2Arabic}
              onChangeText={(text) => {
                setPerson2Arabic(text);
                setCursorPosition(text.length);
              }}
              onSelectionChange={(e) => setCursorPosition(e.nativeEvent.selection.start)}
              placeholder="فاطمة"
              placeholderTextColor="#64748b"
              editable={!showKeyboard || activeInput !== 'person2'}
            />
          </View>
        </LinearGradient>
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
    borderRadius: 16,
    padding: 18,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    marginTop: 16,
  },
  inputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  inputTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  inputEmoji: {
    fontSize: 24,
  },
  inputTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#f8fafc',
  },
  inputWrapper: {
    marginTop: 12,
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
