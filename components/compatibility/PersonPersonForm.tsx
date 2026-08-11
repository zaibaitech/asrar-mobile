/**
 * Person ↔ Person Compatibility Form
 * Universal form for marriage, friendship, family, work
 */

import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, Keyboard } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useLanguage } from '../../contexts/LanguageContext';
import { useProfile } from '../../contexts/ProfileContext';
import {
    calculatePersonPersonCompatibilityMixed,
    DobDerivationError,
    type PersonPersonParticipantInput
} from '../../services/compatibility/engine';
import { PersonPersonCompatibility } from '../../services/compatibility/types';
import ArabicKeyboard from '../istikhara/ArabicKeyboard';
import NameAutocomplete from '../NameAutocomplete';

interface PersonPersonFormProps {
  language: 'en' | 'fr' | 'ar';
  onCalculate: (result: PersonPersonCompatibility) => void;
}

export function PersonPersonForm({ language, onCalculate }: PersonPersonFormProps) {
  const { t } = useLanguage();
  const { profile } = useProfile();
  const [person1Name, setPerson1Name] = useState('');
  const [person1Arabic, setPerson1Arabic] = useState('');
  const [person1Latin, setPerson1Latin] = useState('');
  const [person2Name, setPerson2Name] = useState('');
  const [person2Arabic, setPerson2Arabic] = useState('');
  const [person2Latin, setPerson2Latin] = useState('');
  const [relationshipType, setRelationshipType] = useState<'marriage' | 'friendship' | 'family' | 'work' | 'universal'>('universal');
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState('');

  // Per-person input method: an Arabic name (abjad, the default) or a date of
  // birth (zodiac/burj, a complementary alternative for those without an
  // Arabic name spelling). The two people can use different methods.
  const [person1InputMethod, setPerson1InputMethod] = useState<'name' | 'dob'>('name');
  const [person2InputMethod, setPerson2InputMethod] = useState<'name' | 'dob'>('name');
  const [person1DOB, setPerson1DOB] = useState<Date | null>(null);
  const [person2DOB, setPerson2DOB] = useState<Date | null>(null);
  const [showPerson1DatePicker, setShowPerson1DatePicker] = useState(false);
  const [showPerson2DatePicker, setShowPerson2DatePicker] = useState(false);
  const hasPrefilledPerson1 = useRef(false);
  const dateLocale = language === 'fr' ? 'fr-FR' : language === 'ar' ? 'ar' : 'en-US';

  // Arabic keyboard state
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [activeInput, setActiveInput] = useState<'person1' | 'person2' | null>(null);
  const [cursorPosition, setCursorPosition] = useState(0);
  const person1InputRef = useRef<TextInput>(null);
  const person2InputRef = useRef<TextInput>(null);

  // Prefill Person 1 from the saved profile (once) and auto-select the
  // matching input method — name if a name is on file, DOB otherwise.
  // Person 2 is never auto-filled.
  useEffect(() => {
    if (hasPrefilledPerson1.current) return;
    if (profile.nameAr) {
      setPerson1Arabic(profile.nameAr);
      if (profile.nameLatin) setPerson1Latin(profile.nameLatin);
      setPerson1InputMethod('name');
      hasPrefilledPerson1.current = true;
    } else if (profile.dobISO) {
      setPerson1DOB(new Date(profile.dobISO));
      setPerson1InputMethod('dob');
      hasPrefilledPerson1.current = true;
    }
  }, [profile.nameAr, profile.nameLatin, profile.dobISO]);

  const relationshipTypes = [
    { value: 'universal' },
    { value: 'marriage' },
    { value: 'friendship' },
    { value: 'family' },
    { value: 'work' }
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

  const person1Valid = person1InputMethod === 'name' ? person1Arabic.trim().length > 0 : person1DOB !== null;
  const person2Valid = person2InputMethod === 'name' ? person2Arabic.trim().length > 0 : person2DOB !== null;

  const buildParticipantInput = (
    method: 'name' | 'dob',
    arabic: string,
    displayName: string,
    dob: Date | null
  ): PersonPersonParticipantInput => {
    if (method === 'name') {
      return { inputMethod: 'name', name: displayName || arabic, arabicName: arabic };
    }
    const dobDate = dob as Date;
    return {
      inputMethod: 'dob',
      dobISO: dobDate.toISOString().split('T')[0],
      dobLabel: dobDate.toLocaleDateString(dateLocale, { year: 'numeric', month: 'long', day: 'numeric' }),
    };
  };

  const handleCalculate = async () => {
    setError('');

    // Validation
    if (!person1Valid || !person2Valid) {
      setError(t('compatibility.form.errors.mixedValidation'));
      return;
    }

    setIsCalculating(true);

    try {
      const person1Input = buildParticipantInput(person1InputMethod, person1Arabic, person1Name, person1DOB);
      const person2Input = buildParticipantInput(person2InputMethod, person2Arabic, person2Name, person2DOB);

      const result = calculatePersonPersonCompatibilityMixed(person1Input, person2Input, relationshipType);

      onCalculate(result);
    } catch (err) {
      if (err instanceof DobDerivationError) {
        setError(t('compatibility.form.inputMethod.dobDerivationFailed'));
      } else {
        console.error('Compatibility calculation error:', err);
        setError(language === 'en'
          ? 'Calculation failed. Please check your inputs.'
          : 'فشل الحساب. يرجى التحقق من المدخلات.');
      }
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>
        {t('compatibility.form.context.title')}
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
              {t(`compatibility.form.context.${type.value}`)}
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
                {t('compatibility.form.person1')}
              </Text>
            </View>
          </View>

          {/* Input method toggle */}
          <View style={styles.methodToggle}>
            <TouchableOpacity
              style={[styles.methodChip, person1InputMethod === 'name' && styles.methodChipActive]}
              onPress={() => setPerson1InputMethod('name')}
            >
              <Text style={[styles.methodChipText, person1InputMethod === 'name' && styles.methodChipTextActive]}>
                {t('compatibility.form.inputMethod.useNameLabel')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.methodChip, person1InputMethod === 'dob' && styles.methodChipActive]}
              onPress={() => setPerson1InputMethod('dob')}
            >
              <Text style={[styles.methodChipText, person1InputMethod === 'dob' && styles.methodChipTextActive]}>
                {t('compatibility.form.inputMethod.useDobLabel')}
              </Text>
            </TouchableOpacity>
          </View>

          {person1InputMethod === 'name' ? (
            <>
              {/* Latin Name Autocomplete */}
              <View style={[styles.inputWrapper, { zIndex: 10 }]}>
                <Text style={styles.label}>
                  {t('compatibility.form.latinName')}
                </Text>
                <NameAutocomplete
                  value={person1Latin}
                  onChange={setPerson1Latin}
                  onArabicSelect={(arabic, latin) => {
                    setPerson1Arabic(arabic);
                    setPerson1Latin(latin);
                  }}
                  placeholder={t('compatibility.form.exampleFatima')}
                  showHelper={false}
                  language={language}
                />
              </View>

              {/* Arabic Name Input */}
              <View style={[styles.inputWrapper, { zIndex: 1 }]}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>
                    {t('compatibility.form.arabicName')} *
                  </Text>
                  <TouchableOpacity
                    style={styles.keyboardButton}
                    onPress={() => openKeyboard('person1')}
                  >
                    <Keyboard size={14} color="#a78bfa" strokeWidth={2} />
                    <Text style={styles.keyboardButtonText}>
                      {t('compatibility.form.keyboard')}
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
            </>
          ) : (
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>
                {t('compatibility.form.inputMethod.dobLabel')}
              </Text>
              <Pressable style={styles.datePickerButton} onPress={() => setShowPerson1DatePicker(true)}>
                <Calendar size={18} color="#a78bfa" />
                <Text style={[styles.datePickerText, language === 'ar' && styles.textRTL]}>
                  {person1DOB
                    ? person1DOB.toLocaleDateString(dateLocale, { year: 'numeric', month: 'long', day: 'numeric' })
                    : t('compatibility.form.inputMethod.datePickerPlaceholder')}
                </Text>
              </Pressable>
              <Text style={[styles.hintText, language === 'ar' && styles.textRTL]}>{t('compatibility.form.inputMethod.dobHint')}</Text>
              {showPerson1DatePicker && (
                <DateTimePicker
                  value={person1DOB || new Date(2000, 0, 1)}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(event, selectedDate) => {
                    setShowPerson1DatePicker(Platform.OS === 'ios');
                    if (selectedDate) setPerson1DOB(selectedDate);
                  }}
                  maximumDate={new Date()}
                  minimumDate={new Date(1900, 0, 1)}
                />
              )}
            </View>
          )}
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
                {t('compatibility.form.person2')}
              </Text>
            </View>
          </View>

          {/* Input method toggle */}
          <View style={styles.methodToggle}>
            <TouchableOpacity
              style={[styles.methodChip, person2InputMethod === 'name' && styles.methodChipActive]}
              onPress={() => setPerson2InputMethod('name')}
            >
              <Text style={[styles.methodChipText, person2InputMethod === 'name' && styles.methodChipTextActive]}>
                {t('compatibility.form.inputMethod.useNameLabel')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.methodChip, person2InputMethod === 'dob' && styles.methodChipActive]}
              onPress={() => setPerson2InputMethod('dob')}
            >
              <Text style={[styles.methodChipText, person2InputMethod === 'dob' && styles.methodChipTextActive]}>
                {t('compatibility.form.inputMethod.useDobLabel')}
              </Text>
            </TouchableOpacity>
          </View>

          {person2InputMethod === 'name' ? (
            <>
              {/* Latin Name Autocomplete */}
              <View style={[styles.inputWrapper, { zIndex: 10 }]}>
                <Text style={styles.label}>
                  {t('compatibility.form.latinName')}
                </Text>
                <NameAutocomplete
                  value={person2Latin}
                  onChange={setPerson2Latin}
                  onArabicSelect={(arabic, latin) => {
                    setPerson2Arabic(arabic);
                    setPerson2Latin(latin);
                  }}
                  placeholder={t('compatibility.form.exampleKhadija')}
                  showHelper={false}
                  language={language}
                />
              </View>

              {/* Arabic Name Input */}
              <View style={[styles.inputWrapper, { zIndex: 1 }]}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>
                    {t('compatibility.form.arabicName')} *
                  </Text>
                  <TouchableOpacity
                    style={styles.keyboardButton}
                    onPress={() => openKeyboard('person2')}
                  >
                    <Keyboard size={14} color="#a78bfa" strokeWidth={2} />
                    <Text style={styles.keyboardButtonText}>
                      {t('compatibility.form.keyboard')}
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
            </>
          ) : (
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>
                {t('compatibility.form.inputMethod.dobLabel')}
              </Text>
              <Pressable style={styles.datePickerButton} onPress={() => setShowPerson2DatePicker(true)}>
                <Calendar size={18} color="#a78bfa" />
                <Text style={[styles.datePickerText, language === 'ar' && styles.textRTL]}>
                  {person2DOB
                    ? person2DOB.toLocaleDateString(dateLocale, { year: 'numeric', month: 'long', day: 'numeric' })
                    : t('compatibility.form.inputMethod.datePickerPlaceholder')}
                </Text>
              </Pressable>
              <Text style={[styles.hintText, language === 'ar' && styles.textRTL]}>{t('compatibility.form.inputMethod.dobHint')}</Text>
              {showPerson2DatePicker && (
                <DateTimePicker
                  value={person2DOB || new Date(2000, 0, 1)}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(event, selectedDate) => {
                    setShowPerson2DatePicker(Platform.OS === 'ios');
                    if (selectedDate) setPerson2DOB(selectedDate);
                  }}
                  maximumDate={new Date()}
                  minimumDate={new Date(1900, 0, 1)}
                />
              )}
            </View>
          )}
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
            {t('compatibility.form.cta')}
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
  textRTL: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  inputSection: {
    marginBottom: 8,
  },
  inputGradient: {
    borderRadius: 16,
    padding: 18,
    overflow: 'visible' as const,
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
  methodToggle: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  methodChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  methodChipActive: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderColor: '#8b5cf6',
  },
  methodChipText: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '500',
  },
  methodChipTextActive: {
    color: '#a78bfa',
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
  },
  datePickerText: {
    color: '#ffffff',
    fontSize: 15,
  },
  hintText: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 6,
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
