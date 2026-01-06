import ArabicKeyboard from '@/components/istikhara/ArabicKeyboard';
import NameAutocomplete from '@/components/NameAutocomplete';
import { CollapsibleSection, DestinyHeader } from '@/components/nameDestiny';
import { useLanguage } from '@/contexts/LanguageContext';
import { ABJAD_MAGHRIBI, ABJAD_MASHRIQI } from '@/features/name-destiny/constants/abjadMaps';
import { useAbjad } from '@/features/name-destiny/contexts/AbjadContext';
import { buildDestiny } from '@/features/name-destiny/services/nameDestinyCalculator';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { AlertCircle, BookOpen, CheckCircle, Keyboard as KeyboardIcon, Lightbulb, Shield, Sparkles, Users } from 'lucide-react-native';
import React, { useMemo, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const EXAMPLE_NAMES = ['محمد', 'علي', 'فاطمة', 'خديجة', 'حسن', 'عائشة'];

export default function NameDestinyForm() {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const { abjadSystem } = useAbjad();
  const insets = useSafeAreaInsets();

  const [personName, setPersonName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [personLatin, setPersonLatin] = useState('');
  const [motherLatin, setMotherLatin] = useState('');
  const [touched, setTouched] = useState({ person: false, mother: false });
  const [loading, setLoading] = useState(false);

  // Arabic keyboard state
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [activeInput, setActiveInput] = useState<'person' | 'mother' | null>(null);
  const [cursorPosition, setCursorPosition] = useState(0);
  const personInputRef = useRef<TextInput>(null);
  const motherInputRef = useRef<TextInput>(null);

  const [educationOpen, setEducationOpen] = useState(false);
  const [insightsOpen, setInsightsOpen] = useState(false);
  const [examplesOpen, setExamplesOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  const isPersonValid = useMemo(() => personName.trim().length > 0, [personName]);
  const isMotherValid = useMemo(() => motherName.trim().length > 0, [motherName]);
  const isFormValid = isPersonValid && isMotherValid;

  // Keyboard handlers
  const handleKeyPress = (key: string) => {
    if (activeInput === 'person') {
      const newText = personName.slice(0, cursorPosition) + key + personName.slice(cursorPosition);
      setPersonName(newText);
      setCursorPosition(cursorPosition + 1);
      if (!touched.person) setTouched((prev) => ({ ...prev, person: true }));
    } else if (activeInput === 'mother') {
      const newText = motherName.slice(0, cursorPosition) + key + motherName.slice(cursorPosition);
      setMotherName(newText);
      setCursorPosition(cursorPosition + 1);
      if (!touched.mother) setTouched((prev) => ({ ...prev, mother: true }));
    }
  };

  const handleBackspace = () => {
    if (cursorPosition === 0) return;
    
    if (activeInput === 'person') {
      const newText = personName.slice(0, cursorPosition - 1) + personName.slice(cursorPosition);
      setPersonName(newText);
      setCursorPosition(cursorPosition - 1);
    } else if (activeInput === 'mother') {
      const newText = motherName.slice(0, cursorPosition - 1) + motherName.slice(cursorPosition);
      setMotherName(newText);
      setCursorPosition(cursorPosition - 1);
    }
  };

  const handleSpace = () => {
    handleKeyPress(' ');
  };

  const openKeyboard = (inputType: 'person' | 'mother') => {
    setActiveInput(inputType);
    if (inputType === 'person') {
      setCursorPosition(personName.length);
    } else {
      setCursorPosition(motherName.length);
    }
    setShowKeyboard(true);
  };

  const handleCalculate = async () => {
    if (!isFormValid || loading) {
      if (!isFormValid) {
        Alert.alert(t('nameDestiny.form.incompleteForm'), t('nameDestiny.form.incompleteMessage'));
      }
      return;
    }

    Keyboard.dismiss();
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);

    try {
      const trimmedPerson = personName.trim();
      const trimmedMother = motherName.trim();
      const abjadMap = abjadSystem === 'mashriqi' ? ABJAD_MASHRIQI : ABJAD_MAGHRIBI;

      const result = buildDestiny(trimmedPerson, trimmedMother, abjadMap);

      if (__DEV__) {
        const tabRemainder = result.totalKabir % 4 || 4;
        console.log('[name-destiny/form] Calculation complete:', {
          personKabir: result.personKabir,
          motherKabir: result.motherKabir,
          totalKabir: result.totalKabir,
          saghir: result.saghir,
          tabRemainder,
          tabIndex: result.tabIndex,
          element: result.element?.en,
          burjIndex: result.burjIndex,
          burj: result.burj?.en,
        });
      }

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      router.push({
        pathname: '/(tabs)/name-destiny/results',
        params: {
          data: JSON.stringify(result),
          personName: trimmedPerson,
          motherName: trimmedMother,
        },
      });
    } catch (error) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(t('nameDestiny.form.calculationError'), t('nameDestiny.form.calculationErrorMessage'));
      console.error('[name-destiny/form] calculation failure', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <LinearGradient colors={['#0f172a', '#1e1b4b', '#312e81']} style={styles.gradient}>
        <DestinyHeader
          title={t('nameDestiny.form.title')}
          onBack={() => router.back()}
          language={language === 'ar' ? 'en' : language}
          onLanguageChange={setLanguage}
        />

        <KeyboardAvoidingView
          style={styles.keyboardAvoider}
          behavior={Platform.select({ ios: 'padding', android: 'height', default: undefined })}
          keyboardVerticalOffset={Platform.select({ ios: 0, android: 20 })}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
          >
            {/* Hero Section */}
            <View style={styles.hero}>
              <Sparkles size={40} color="#a78bfa" />
              <Text style={styles.heroTitle}>{t('nameDestiny.form.heroTitle')}</Text>
              <Text style={styles.heroSubtitle}>
                {t('nameDestiny.form.heroSubtitle')}
              </Text>
            </View>

            {/* Input Section - MUST BE FIRST */}
            <View style={styles.inputSection}>
              <Text style={styles.sectionTitle}>{t('nameDestiny.form.enterNames')}</Text>
              <Text style={styles.sectionSubtitle}>{t('nameDestiny.form.bothArabic')}</Text>

              {/* Person Name Input */}
              <LinearGradient
                colors={['rgba(147, 51, 234, 0.3)', 'rgba(236, 72, 153, 0.2)']}
                style={styles.inputGradient}
              >
                <View style={styles.inputHeader}>
                  <View style={styles.inputTitleRow}>
                    <Text style={styles.inputEmoji}>👤</Text>
                    <Text style={styles.inputTitle}>{t('nameDestiny.form.yourName')}</Text>
                  </View>
                  {touched.person && isPersonValid && (
                    <CheckCircle size={20} color="#86efac" />
                  )}
                </View>

                {/* Latin Name Autocomplete */}
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>{t('nameDestiny.form.latinNameLabel')}</Text>
                  <NameAutocomplete
                    value={personLatin}
                    onChange={setPersonLatin}
                    onArabicSelect={(arabic, latin) => {
                      setPersonName(arabic);
                      setPersonLatin(latin);
                      if (!touched.person) setTouched((prev) => ({ ...prev, person: true }));
                    }}
                    placeholder={t('nameDestiny.form.latinPlaceholderPerson')}
                    showHelper={false}
                    language={language}
                  />
                </View>

                {/* Arabic Name Input */}
                <View style={styles.inputWrapper}>
                  <View style={styles.labelWithButton}>
                    <Text style={styles.inputLabel}>{t('nameDestiny.form.arabicNameLabel')}</Text>
                    <TouchableOpacity
                      style={styles.keyboardButton}
                      onPress={() => openKeyboard('person')}
                    >
                      <KeyboardIcon size={14} color="#e0e7ff" strokeWidth={2} />
                      <Text style={styles.keyboardButtonText}>{t('nameDestiny.form.keyboardButton')}</Text>
                    </TouchableOpacity>
                  </View>
                  <TextInput
                    ref={personInputRef}
                    style={[
                      styles.input,
                      touched.person && !isPersonValid && styles.inputError,
                      touched.person && isPersonValid && styles.inputSuccess,
                    ]}
                    placeholder={t('nameDestiny.form.arabicPlaceholderPerson')}
                    placeholderTextColor="rgba(255, 255, 255, 0.3)"
                    value={personName}
                    onChangeText={(text) => {
                      setPersonName(text);
                      setCursorPosition(text.length);
                      if (!touched.person) setTouched((prev) => ({ ...prev, person: true }));
                    }}
                    onSelectionChange={(e) => setCursorPosition(e.nativeEvent.selection.start)}
                    textAlign="right"
                    editable={!loading && (!showKeyboard || activeInput !== 'person')}
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="next"
                    blurOnSubmit={false}
                  />
                  {touched.person && !isPersonValid && (
                    <View style={styles.errorRow}>
                      <AlertCircle size={14} color="#fca5a5" />
                      <Text style={styles.errorText}>{t('nameDestiny.form.validationError')}</Text>
                    </View>
                  )}
                </View>
              </LinearGradient>

              {/* Mother Name Input */}
              <LinearGradient
                  colors={['rgba(79, 70, 229, 0.3)', 'rgba(59, 130, 246, 0.2)']}
                  style={styles.inputGradient}
                >
                  <View style={styles.inputHeader}>
                    <View style={styles.inputTitleRow}>
                      <Text style={styles.inputEmoji}>👩</Text>
                      <Text style={styles.inputTitle}>{t('nameDestiny.form.mothersName')}</Text>
                    </View>
                    {touched.mother && isMotherValid && (
                      <CheckCircle size={20} color="#86efac" />
                    )}
                  </View>

                  {/* Latin Name Autocomplete */}
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>{t('nameDestiny.form.latinNameLabel')}</Text>
                    <NameAutocomplete
                      value={motherLatin}
                      onChange={setMotherLatin}
                      onArabicSelect={(arabic, latin) => {
                        setMotherName(arabic);
                        setMotherLatin(latin);
                        if (!touched.mother) setTouched((prev) => ({ ...prev, mother: true }));
                      }}
                      placeholder={t('nameDestiny.form.latinPlaceholderMother')}
                      showHelper={false}
                      language={language}
                    />
                  </View>

                  {/* Arabic Name Input */}
                  <View style={styles.inputWrapper}>
                    <View style={styles.labelWithButton}>
                      <Text style={styles.inputLabel}>{t('nameDestiny.form.arabicNameLabel')}</Text>
                      <TouchableOpacity
                        style={styles.keyboardButton}
                        onPress={() => openKeyboard('mother')}
                      >
                        <KeyboardIcon size={14} color="#e0e7ff" strokeWidth={2} />
                        <Text style={styles.keyboardButtonText}>{t('nameDestiny.form.keyboardButton')}</Text>
                      </TouchableOpacity>
                    </View>
                    <TextInput
                      ref={motherInputRef}
                      style={[
                        styles.input,
                        touched.mother && !isMotherValid && styles.inputError,
                        touched.mother && isMotherValid && styles.inputSuccess,
                      ]}
                      placeholder={t('nameDestiny.form.arabicPlaceholderMother')}
                      placeholderTextColor="rgba(255, 255, 255, 0.3)"
                      value={motherName}
                      onChangeText={(text) => {
                        setMotherName(text);
                        setCursorPosition(text.length);
                        if (!touched.mother) setTouched((prev) => ({ ...prev, mother: true }));
                      }}
                      onSelectionChange={(e) => setCursorPosition(e.nativeEvent.selection.start)}
                      textAlign="right"
                      editable={!loading && (!showKeyboard || activeInput !== 'mother')}
                      autoCapitalize="none"
                      autoCorrect={false}
                      returnKeyType="done"
                      onSubmitEditing={() => {
                        Keyboard.dismiss();
                        if (isFormValid) handleCalculate();
                      }}
                    />
                    {touched.mother && !isMotherValid && (
                      <View style={styles.errorRow}>
                        <AlertCircle size={14} color="#fca5a5" />
                        <Text style={styles.errorText}>{t('nameDestiny.form.validationError')}</Text>
                      </View>
                    )}
                  </View>
                </LinearGradient>

              {/* Calculate Button */}
              <TouchableOpacity
                style={[styles.calculateButton, (!isFormValid || loading) && styles.calculateDisabled]}
                disabled={!isFormValid || loading}
                onPress={handleCalculate}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={
                    !isFormValid || loading ? ['#4b5563', '#334155'] : ['#8b5cf6', '#7c3aed', '#6d28d9']
                  }
                  style={styles.calculateGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  {loading ? (
                    <View style={styles.loadingRow}>
                      <ActivityIndicator size="small" color="#ffffff" />
                      <Text style={styles.calculateText}>{t('nameDestiny.form.calculating')}</Text>
                    </View>
                  ) : (
                    <Text style={styles.calculateText}>{t('nameDestiny.form.calculateButton')}</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Info Sections - AFTER INPUTS */}
            <View style={styles.infoSection}>
              <CollapsibleSection
                title={t('nameDestiny.form.educationTitle')}
                icon={BookOpen}
                tintColor="#60a5fa"
                open={educationOpen}
                onToggle={() => setEducationOpen((prev) => !prev)}
              >
                <Text style={styles.infoText}>
                  {t('nameDestiny.form.educationContent')}
                </Text>
              </CollapsibleSection>

              <CollapsibleSection
                title={t('nameDestiny.form.discoveryTitle')}
                icon={Lightbulb}
                tintColor="#c084fc"
                open={insightsOpen}
                onToggle={() => setInsightsOpen((prev) => !prev)}
              >
                {[
                  { icon: '🔢', title: t('nameDestiny.form.discoveryItems.numbers.title'), desc: t('nameDestiny.form.discoveryItems.numbers.desc') },
                  { icon: '💧', title: t('nameDestiny.form.discoveryItems.element.title'), desc: t('nameDestiny.form.discoveryItems.element.desc') },
                  { icon: '⭐', title: t('nameDestiny.form.discoveryItems.zodiac.title'), desc: t('nameDestiny.form.discoveryItems.zodiac.desc') },
                  { icon: '🌙', title: t('nameDestiny.form.discoveryItems.guidance.title'), desc: t('nameDestiny.form.discoveryItems.guidance.desc') },
                ].map((item) => (
                  <View key={item.title} style={styles.discoveryRow}>
                    <Text style={styles.discoveryIcon}>{item.icon}</Text>
                    <View style={styles.discoveryText}>
                      <Text style={styles.discoveryTitle}>{item.title}</Text>
                      <Text style={styles.discoveryDesc}>{item.desc}</Text>
                    </View>
                  </View>
                ))}
              </CollapsibleSection>

              <CollapsibleSection
                title={t('nameDestiny.form.examplesTitle')}
                icon={Users}
                tintColor="#4ade80"
                open={examplesOpen}
                onToggle={() => setExamplesOpen((prev) => !prev)}
              >
                <Text style={styles.infoText}>
                  {t('nameDestiny.form.examplesContent')}
                </Text>
                <View style={styles.chipRow}>
                  {EXAMPLE_NAMES.map((name) => (
                    <View key={name} style={styles.nameChip}>
                      <Text style={styles.nameChipText}>{name}</Text>
                    </View>
                  ))}
                </View>
              </CollapsibleSection>

              <CollapsibleSection
                title={t('nameDestiny.form.privacyTitle')}
                icon={Shield}
                tintColor="#60a5fa"
                open={privacyOpen}
                onToggle={() => setPrivacyOpen((prev) => !prev)}
              >
                <Text style={styles.infoText}>
                  {t('nameDestiny.form.privacyContent')}
                </Text>
              </CollapsibleSection>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>{t('nameDestiny.form.footer')}</Text>
            </View>

            <View style={{ height: Math.max(insets.bottom, 24) }} />
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Arabic Keyboard */}
        <ArabicKeyboard
          visible={showKeyboard}
          onClose={() => setShowKeyboard(false)}
          onKeyPress={handleKeyPress}
          onBackspace={handleBackspace}
          onSpace={handleSpace}
        />
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  gradient: {
    flex: 1,
  },
  keyboardAvoider: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  hero: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#cbd5e1',
    textAlign: 'center',
    lineHeight: 20,
  },
  inputSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#94a3b8',
    marginBottom: 16,
  },
  inputCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  inputGradient: {
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
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
  inputHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#cbd5e1',
    marginBottom: 8,
  },
  labelWithButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  keyboardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.4)',
  },
  keyboardButtonText: {
    fontSize: 11,
    color: '#e0e7ff',
    fontWeight: '600',
  },
  inputSection: {
    marginBottom: 0,
  },
  inputSectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#cbd5e1',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(148, 163, 184, 0.25)',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 18,
    fontWeight: '500',
    color: '#ffffff',
  },
  inputError: {
    borderColor: '#fca5a5',
  },
  inputSuccess: {
    borderColor: '#86efac',
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#fca5a5',
  },
  calculateButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
    shadowColor: '#8b5cf6',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 8,
  },
  calculateDisabled: {
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
  calculateGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calculateText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoSection: {
    paddingHorizontal: 20,
    gap: 0,
  },
  infoText: {
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 22,
  },
  discoveryRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 14,
  },
  discoveryIcon: {
    fontSize: 24,
  },
  discoveryText: {
    flex: 1,
    gap: 4,
  },
  discoveryTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#f8fafc',
  },
  discoveryDesc: {
    fontSize: 13,
    lineHeight: 19,
    color: '#94a3b8',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  nameChip: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: 'rgba(124, 58, 237, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(124, 58, 237, 0.4)',
  },
  nameChipText: {
    fontSize: 15,
    color: '#ede9fe',
    fontWeight: '500',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
