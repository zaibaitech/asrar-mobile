/**
 * Who Am I Tab - Personal Analysis Calculator
 * Deep self-discovery through sacred numerology (name + mother's name analysis)
 */
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
    BookOpen,
    Calendar,
    ChevronDown,
    ChevronUp,
    FileText,
    Lightbulb,
    Shield,
    Users
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import NameAutocomplete from '../../components/NameAutocomplete';
import { useLanguage } from '../../contexts/LanguageContext';
import { useProfile } from '../../contexts/ProfileContext';
import { useIstikhara } from '../../hooks/useIstikhara';
import { HistoryService } from '../../services/HistoryService';
import { deriveBurjFromDOB, deriveElementFromBurj } from '../../services/ProfileDerivationService';
import { getBurujData } from '../../services/istikhara/calculations';

type CalculationMethod = 'name' | 'birthdate';
type BirthInputMode = 'full' | 'monthDay';

export default function WhoAmICalculator() {
  const router = useRouter();
  const { t } = useLanguage();
  const { profile } = useProfile();
  const { calculate, loading, error, result } = useIstikhara();
  
  // Calculation method selection
  const [calculationMethod, setCalculationMethod] = useState<CalculationMethod>('name');
  
  // Name-based calculation states
  const [personName, setPersonName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [personLatin, setPersonLatin] = useState('');
  const [motherLatin, setMotherLatin] = useState('');
  
  // Date-based calculation states
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [birthInputMode, setBirthInputMode] = useState<BirthInputMode>('full');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');
  
  // Auto-fill from profile if available
  useEffect(() => {
    if (profile.nameAr && !personName) {
      setPersonName(profile.nameAr);
      if (profile.nameLatin) {
        setPersonLatin(profile.nameLatin);
      }
    }
    if (profile.motherName && !motherName) {
      setMotherName(profile.motherName);
    }
    if (profile.dobISO && !birthDate) {
      setBirthDate(new Date(profile.dobISO));
      setBirthInputMode('full');
    }
  }, [profile.nameAr, profile.nameLatin, profile.motherName, profile.dobISO]);
  
  // Collapsible section states - ALL COLLAPSED BY DEFAULT
  const [educationExpanded, setEducationExpanded] = useState(false);
  const [discoveryExpanded, setDiscoveryExpanded] = useState(false);
  const [examplesExpanded, setExamplesExpanded] = useState(false);
  const [privacyExpanded, setPrivacyExpanded] = useState(false);
  
  // Validation states
  const [touched, setTouched] = useState({ person: false, mother: false, birthDate: false, birthMonth: false, birthDay: false });

  const validateName = (name: string) => {
    return name.trim().length > 0;
  };

  const personValid = validateName(personName);
  const motherValid = validateName(motherName);
  const birthDateValid = birthDate !== null;

  const birthMonthNum = parseInt(birthMonth, 10);
  const birthDayNum = parseInt(birthDay, 10);
  const birthMonthDayValid = (() => {
    if (!Number.isFinite(birthMonthNum) || !Number.isFinite(birthDayNum)) return false;
    if (birthMonthNum < 1 || birthMonthNum > 12) return false;
    if (birthDayNum < 1 || birthDayNum > 31) return false;

    // Validate actual calendar day (use leap-safe year 2000).
    const test = new Date(Date.UTC(2000, birthMonthNum - 1, birthDayNum, 12, 0, 0));
    return test.getUTCMonth() + 1 === birthMonthNum && test.getUTCDate() === birthDayNum;
  })();
  
  // Form validity based on selected method
  const isFormValid = calculationMethod === 'name' 
    ? (personValid && motherValid)
    : (birthInputMode === 'full' ? birthDateValid : birthMonthDayValid);

  const handleCalculate = async () => {
    if (!isFormValid) {
      const message = calculationMethod === 'name'
        ? t('istikhara.validation.missingNames') || 'Please enter both names to continue.'
        : 'Please select your birth date to continue.';
      Alert.alert(t('common.error'), message);
      return;
    }

    // Provide haptic feedback
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      if (calculationMethod === 'name') {
        // Name-based calculation (existing logic)
        await calculate(personName.trim(), motherName.trim(), 'en');
        
        // If calculation was successful, navigate to results
        if (!error) {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          router.push({
            pathname: '/(tabs)/results',
            params: {
              personName: personName.trim(),
              motherName: motherName.trim(),
            },
          });
        }
      } else {
        // Date-based calculation (new logic)
        let dobDate: Date;
        let dobLabel: string;

        if (birthInputMode === 'full') {
          if (!birthDate) return;
          dobDate = birthDate;
          dobLabel = birthDate.toLocaleDateString();
        } else {
          if (!birthMonthDayValid) return;

          // When the year is unknown (calculating for someone else), we only need month/day
          // to derive Burj and element. We use a fixed leap-safe year for date construction.
          dobDate = new Date(Date.UTC(2000, birthMonthNum - 1, birthDayNum, 12, 0, 0));
          dobLabel = dobDate.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
          });
        }

        const dobISO = dobDate.toISOString();
        const burjData = deriveBurjFromDOB(dobISO);
        
        if (!burjData) {
          Alert.alert(t('common.error'), 'Unable to calculate astrological data from birth date.');
          return;
        }
        
        // Map tropical zodiac index (0-11) to the existing Istikhara Buruj remainder (1-12)
        // so Results tabs can reuse the full local buruj profile dataset.
        const burujRemainder = burjData.burjIndex + 1;
        const burujProfile = getBurujData(burujRemainder);

        const element = burujProfile.element ?? deriveElementFromBurj(burjData.burjIndex);
        // Year is not required for burj/element. Manazil baseline depends on full DOB year,
        // so we intentionally avoid using it in this quick path.
        
        // Create a result object that matches the expected format
        const birthdateResult = {
          success: true,
          data: {
            personName: `Birth Date: ${dobLabel}`,
            motherName: '',
            personTotal: 0,
            motherTotal: 0,
            combinedTotal: burujRemainder,
            burujRemainder: burujRemainder,
            element: element,
            // Full profile expected by the Results tabs (personality/career/blessed day/etc)
            burujProfile: burujProfile,
            // Provide a sane non-zero target so the Spiritual Practice counter works.
            repetitionCount: 33,
            calculationMethod: 'birthdate' as const,
          }
        };
        
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        
        // Navigate to results with birthdate data
        router.push({
          pathname: '/(tabs)/results',
          params: {
            data: JSON.stringify(birthdateResult.data),
            personName: `Birth Date: ${dobLabel}`,
            motherName: '',
            calculationMethod: 'birthdate',
          },
        });
      }
    } catch (err) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  // Show error alert when error changes
  React.useEffect(() => {
    if (error) {
      console.error('Displaying error to user:', error);
      Alert.alert('Calculation Error', String(error), [
        { text: 'OK', onPress: () => {} },
      ]);
    }
  }, [error]);

  // Navigate to results when result is available
  React.useEffect(() => {
    if (result && !loading && !error) {
      console.log('Navigating to results with data:', result.data);
      
      // Save to history
      HistoryService.saveCalculation(result.data, personName.trim(), motherName.trim());
      
      try {
        router.push({
          pathname: '/(tabs)/results',
          params: {
            data: JSON.stringify(result.data),
            personName: personName.trim(),
            motherName: motherName.trim(),
          },
        });
      } catch (navError) {
        console.error('Navigation error:', navError);
        Alert.alert('Error', 'Failed to navigate to results');
      }
    }
  }, [result, loading, error]);

  return (
    <LinearGradient
      colors={['#0f172a', '#1e1b4b', '#312e81']}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
        >
          {/* Minimal Header - Reduced visual weight */}
          <View style={styles.headerMinimal}>
            <Text style={styles.headerTitleMinimal}>{t('istikhara.title')}</Text>
            <Text style={styles.headerSubtitleMinimal}>
              {t('istikhara.formInstruction')}
            </Text>
          </View>

          {/* METHOD SELECTOR */}
          <View style={styles.methodSelectorContainer}>
            <Text style={styles.methodSelectorLabel}>Choose Calculation Method:</Text>
            
            {/* Name-Based Method Button */}
            <TouchableOpacity
              style={[
                styles.methodButton,
                calculationMethod === 'name' && styles.methodButtonSelected
              ]}
              onPress={() => {
                setCalculationMethod('name');
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={
                  calculationMethod === 'name'
                    ? ['rgba(139, 92, 246, 0.2)', 'rgba(124, 58, 237, 0.3)']
                    : ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)']
                }
                style={styles.methodButtonGradient}
              >
                <View style={styles.methodButtonContent}>
                  <FileText 
                    size={24} 
                    color={calculationMethod === 'name' ? '#a78bfa' : 'rgba(255, 255, 255, 0.5)'} 
                  />
                  <View style={styles.methodButtonTextContainer}>
                    <Text style={[
                      styles.methodButtonTitle,
                      calculationMethod === 'name' && styles.methodButtonTitleSelected
                    ]}>
                      Name-Based
                    </Text>
                    <View style={styles.methodBadge}>
                      <Text style={styles.methodBadgeText}>CLASSICAL</Text>
                    </View>
                    <Text style={styles.methodButtonDescription}>
                      Traditional ʿIlm al-Ḥurūf method using your name + mother's name
                    </Text>
                  </View>
                </View>
                {calculationMethod === 'name' && (
                  <View style={styles.selectedIndicator} />
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Birth Date Method Button */}
            <TouchableOpacity
              style={[
                styles.methodButton,
                calculationMethod === 'birthdate' && styles.methodButtonSelected
              ]}
              onPress={() => {
                setCalculationMethod('birthdate');
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={
                  calculationMethod === 'birthdate'
                    ? ['rgba(139, 92, 246, 0.2)', 'rgba(124, 58, 237, 0.3)']
                    : ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)']
                }
                style={styles.methodButtonGradient}
              >
                <View style={styles.methodButtonContent}>
                  <Calendar 
                    size={24} 
                    color={calculationMethod === 'birthdate' ? '#a78bfa' : 'rgba(255, 255, 255, 0.5)'} 
                  />
                  <View style={styles.methodButtonTextContainer}>
                    <Text style={[
                      styles.methodButtonTitle,
                      calculationMethod === 'birthdate' && styles.methodButtonTitleSelected
                    ]}>
                      Birth Date
                    </Text>
                    <View style={[styles.methodBadge, styles.methodBadgeQuick]}>
                      <Text style={styles.methodBadgeText}>QUICK</Text>
                    </View>
                    <Text style={styles.methodButtonDescription}>
                      Simpler method using only your date of birth
                    </Text>
                  </View>
                </View>
                {calculationMethod === 'birthdate' && (
                  <View style={styles.selectedIndicator} />
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* MAIN FORM - Conditional based on method */}
          <View style={styles.formCard}>
            <LinearGradient
              colors={['rgba(15, 23, 42, 0.9)', 'rgba(30, 41, 59, 0.9)']}
              style={styles.formGradient}
            >
              {calculationMethod === 'name' ? (
                // NAME-BASED FORM
                <>
                  {/* Person's Name Input */}
                  <View style={styles.nameSection}>
                    <View style={styles.nameSectionHeader}>
                      <Text style={styles.nameSectionIcon}>👤</Text>
                      <Text style={styles.nameSectionTitle}>{t('istikhara.form.personName')}</Text>
                    </View>
                    <Text style={styles.nameLabel}>{t('istikhara.form.latinName')}</Text>
                    <NameAutocomplete
                      value={personLatin}
                      onChange={(text) => {
                        setPersonLatin(text);
                        if (!touched.person) setTouched({ ...touched, person: true });
                      }}
                      onArabicSelect={(arabic, latin) => {
                        setPersonName(arabic);
                        setPersonLatin(latin);
                        if (!touched.person) setTouched({ ...touched, person: true });
                      }}
                      placeholder={t('istikhara.form.personNamePlaceholder') || 'e.g., Ahmed, Rahim'}
                      showHelper={true}
                      language="en"
                    />
                    <Text style={styles.nameLabel}>{t('istikhara.arabicName')} *</Text>
                    <View style={styles.arabicInputWrapper}>
                      <TextInput
                        value={personName}
                        onChangeText={(text) => {
                          setPersonName(text);
                          if (!touched.person) setTouched({ ...touched, person: true });
                        }}
                        placeholder="أدخل الاسم بالعربية"
                        placeholderTextColor="rgba(255, 255, 255, 0.4)"
                        style={styles.arabicInput}
                        textAlign="right"
                        autoCorrect={false}
                        autoCapitalize="none"
                      />
                    </View>
                    {!personValid && touched.person && (
                      <Text style={styles.errorText}>{t('istikhara.validation.nameRequired')}</Text>
                    )}
                  </View>

                  {/* Mother's Name Input */}
                  <View style={styles.nameSection}>
                    <View style={styles.nameSectionHeader}>
                      <Text style={styles.nameSectionIcon}>👩</Text>
                      <Text style={styles.nameSectionTitle}>{t('istikhara.form.motherName')}</Text>
                    </View>
                    <Text style={styles.nameLabel}>{t('istikhara.form.latinName')}</Text>
                    <NameAutocomplete
                      value={motherLatin}
                      onChange={(text) => {
                        setMotherLatin(text);
                        if (!touched.mother) setTouched({ ...touched, mother: true });
                      }}
                      onArabicSelect={(arabic, latin) => {
                        setMotherName(arabic);
                        setMotherLatin(latin);
                        if (!touched.mother) setTouched({ ...touched, mother: true });
                      }}
                      placeholder={t('istikhara.form.motherNamePlaceholder') || 'e.g., Fatima, Aisha'}
                      showHelper={true}
                      language="en"
                    />
                    <Text style={styles.nameLabel}>{t('istikhara.arabicName')} *</Text>
                    <View style={styles.arabicInputWrapper}>
                      <TextInput
                        value={motherName}
                        onChangeText={(text) => {
                          setMotherName(text);
                          if (!touched.mother) setTouched({ ...touched, mother: true });
                        }}
                        placeholder="أدخل الاسم بالعربية"
                        placeholderTextColor="rgba(255, 255, 255, 0.4)"
                        style={styles.arabicInput}
                        textAlign="right"
                        autoCorrect={false}
                        autoCapitalize="none"
                      />
                    </View>
                    {!motherValid && touched.mother && (
                      <Text style={styles.errorText}>{t('istikhara.validation.nameRequired')}</Text>
                    )}
                  </View>
                </>
              ) : (
                // BIRTH DATE FORM
                <View style={styles.birthdateSection}>
                  <View style={styles.nameSectionHeader}>
                    <Calendar size={24} color="#a78bfa" />
                    <Text style={styles.nameSectionTitle}>Select Your Birth Date</Text>
                  </View>

                  {/* Full DOB vs Month/Day only */}
                  <View style={styles.birthInputModeRow}>
                    <TouchableOpacity
                      style={[
                        styles.birthInputModeChip,
                        birthInputMode === 'full' && styles.birthInputModeChipSelected,
                      ]}
                      onPress={() => setBirthInputMode('full')}
                      activeOpacity={0.8}
                    >
                      <Text style={[
                        styles.birthInputModeChipText,
                        birthInputMode === 'full' && styles.birthInputModeChipTextSelected,
                      ]}>
                        Full date
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.birthInputModeChip,
                        birthInputMode === 'monthDay' && styles.birthInputModeChipSelected,
                      ]}
                      onPress={() => setBirthInputMode('monthDay')}
                      activeOpacity={0.8}
                    >
                      <Text style={[
                        styles.birthInputModeChipText,
                        birthInputMode === 'monthDay' && styles.birthInputModeChipTextSelected,
                      ]}>
                        Month & day only
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.birthInputHint}>
                    {birthInputMode === 'full'
                      ? 'Best when using your own saved profile.'
                      : 'Recommended when calculating for someone else (year not required for Burj/element).'}
                  </Text>

                  {birthInputMode === 'full' ? (
                    <>
                      <Pressable
                        style={styles.datePickerButton}
                        onPress={() => {
                          setShowDatePicker(true);
                          if (!touched.birthDate) setTouched({ ...touched, birthDate: true });
                        }}
                      >
                        <Calendar size={20} color="#a78bfa" />
                        <Text style={styles.datePickerText}>
                          {birthDate ? birthDate.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) : 'Tap to select your birth date'}
                        </Text>
                      </Pressable>

                      {!birthDateValid && touched.birthDate && (
                        <Text style={styles.errorText}>Please select your birth date</Text>
                      )}

                      {showDatePicker && (
                        <DateTimePicker
                          value={birthDate || new Date()}
                          mode="date"
                          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                          onChange={(event, selectedDate) => {
                            setShowDatePicker(Platform.OS === 'ios');
                            if (selectedDate) {
                              setBirthDate(selectedDate);
                            }
                          }}
                          maximumDate={new Date()}
                          minimumDate={new Date(1900, 0, 1)}
                        />
                      )}
                    </>
                  ) : (
                    <View style={styles.monthDayRow}>
                      <View style={styles.monthDayField}>
                        <Text style={styles.monthDayLabel}>Month (1-12)</Text>
                        <TextInput
                          value={birthMonth}
                          onChangeText={(text) => {
                            setBirthMonth(text.replace(/[^0-9]/g, ''));
                            if (!touched.birthMonth) setTouched({ ...touched, birthMonth: true });
                          }}
                          keyboardType="number-pad"
                          placeholder="MM"
                          placeholderTextColor="rgba(255, 255, 255, 0.4)"
                          style={styles.monthDayInput}
                          maxLength={2}
                        />
                      </View>

                      <View style={styles.monthDayField}>
                        <Text style={styles.monthDayLabel}>Day (1-31)</Text>
                        <TextInput
                          value={birthDay}
                          onChangeText={(text) => {
                            setBirthDay(text.replace(/[^0-9]/g, ''));
                            if (!touched.birthDay) setTouched({ ...touched, birthDay: true });
                          }}
                          keyboardType="number-pad"
                          placeholder="DD"
                          placeholderTextColor="rgba(255, 255, 255, 0.4)"
                          style={styles.monthDayInput}
                          maxLength={2}
                        />
                      </View>
                    </View>
                  )}
                  
                  <View style={styles.birthdateInfoBox}>
                    <Text style={styles.birthdateInfoTitle}>✨ What You'll Discover:</Text>
                    <Text style={styles.birthdateInfoText}>• Your Burj (zodiac sign)</Text>
                    <Text style={styles.birthdateInfoText}>• Your elemental nature</Text>
                    {birthInputMode === 'full' ? (
                      <Text style={styles.birthdateInfoText}>• Optional lunar timing baselines (requires full DOB year)</Text>
                    ) : (
                      <Text style={styles.birthdateInfoText}>• Year is not needed for Burj/element calculations</Text>
                    )}
                  </View>
                </View>
              )}

              {/* Calculate Button */}
              <TouchableOpacity
                style={[styles.calculateButton, !isFormValid && styles.calculateButtonDisabled]}
                onPress={handleCalculate}
                disabled={!isFormValid || loading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={
                    isFormValid && !loading
                      ? ['#8b5cf6', '#7c3aed', '#6d28d9']
                      : ['#4a5568', '#2d3748', '#1a202c']
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.calculateButtonGradient}
                >
                  {loading ? (
                    <>
                      <ActivityIndicator color="#ffffff" size="small" />
                      <Text style={styles.calculateButtonText}>{t('common.loading')}</Text>
                    </>
                  ) : (
                    <>
                      <Text style={styles.calculateButtonIcon}>🔮</Text>
                      <Text style={styles.calculateButtonText}>{t('common.calculate')}</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Mini helper text */}
              <Text style={styles.helperText}>
                {t('istikhara.helperText')}
              </Text>
            </LinearGradient>
          </View>

          {/* Educational Content - Below the form, collapsed by default */}
          <View style={styles.educationalSection}>
            {/* What is this? - Collapsible */}
            <TouchableOpacity
              style={styles.collapsibleHeaderCompact}
              onPress={() => {
                setEducationExpanded(!educationExpanded);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              activeOpacity={0.7}
            >
              <View style={styles.collapsibleHeaderContentCompact}>
                <View style={styles.collapsibleTitleRow}>
                  <BookOpen size={16} color="rgba(96, 165, 250, 0.8)" />
                  <Text style={styles.collapsibleTitleCompact}>{t('istikhara.educationTitle')}</Text>
                </View>
                {educationExpanded ? (
                  <ChevronUp size={16} color="rgba(255, 255, 255, 0.5)" />
                ) : (
                  <ChevronDown size={16} color="rgba(255, 255, 255, 0.5)" />
                )}
              </View>
            </TouchableOpacity>

            {educationExpanded && (
              <View style={styles.collapsibleContent}>
                <Text style={styles.collapsibleText}>
                  {t('istikhara.educationText') || "Ilm al-Ḥurūf (Science of Letters) is an ancient Islamic mystical tradition that explores the spiritual significance of Arabic letters and their numerical values."}
                </Text>
              </View>
            )}

          {/* What You'll Discover - Collapsible */}
          <TouchableOpacity
            style={styles.collapsibleHeaderCompact}
            onPress={() => {
              setDiscoveryExpanded(!discoveryExpanded);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            activeOpacity={0.7}
          >
            <View style={styles.collapsibleHeaderContentCompact}>
              <View style={styles.collapsibleTitleRow}>
                <Lightbulb size={16} color="rgba(167, 139, 250, 0.8)" />
                <Text style={styles.collapsibleTitleCompact}>{t('istikhara.discoveryTitle')}</Text>
              </View>
              {discoveryExpanded ? (
                <ChevronUp size={16} color="rgba(255, 255, 255, 0.5)" />
              ) : (
                <ChevronDown size={16} color="rgba(255, 255, 255, 0.5)" />
              )}
            </View>
          </TouchableOpacity>

          {discoveryExpanded && (
            <View style={styles.collapsibleContent}>
              {[
                { icon: '🔥', title: t('istikhara.discovery.element.title'), desc: t('istikhara.discovery.element.desc') },
                { icon: '🌟', title: t('istikhara.discovery.personality.title'), desc: t('istikhara.discovery.personality.desc') },
                { icon: '💼', title: t('istikhara.discovery.career.title'), desc: t('istikhara.discovery.career.desc') },
                { icon: '📅', title: t('istikhara.discovery.powerDay.title'), desc: t('istikhara.discovery.powerDay.desc') },
                { icon: '🤲', title: t('istikhara.discovery.spiritual.title'), desc: t('istikhara.discovery.spiritual.desc') },
              ].map((item, idx) => (
                <View key={idx} style={styles.discoveryItem}>
                  <Text style={styles.discoveryIcon}>{item.icon}</Text>
                  <View style={styles.discoveryTextContainer}>
                    <Text style={styles.discoveryTitle}>{item.title}</Text>
                    <Text style={styles.discoveryDesc}>{item.desc}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Example Names - Collapsible */}
          <TouchableOpacity
            style={styles.collapsibleHeaderCompact}
            onPress={() => {
              setExamplesExpanded(!examplesExpanded);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            activeOpacity={0.7}
          >
            <View style={styles.collapsibleHeaderContentCompact}>
              <View style={styles.collapsibleTitleRow}>
                <Users size={16} color="rgba(74, 222, 128, 0.8)" />
                <Text style={styles.collapsibleTitleCompact}>{t('istikhara.examplesTitle')}</Text>
              </View>
              {examplesExpanded ? (
                <ChevronUp size={16} color="rgba(255, 255, 255, 0.5)" />
              ) : (
                <ChevronDown size={16} color="rgba(255, 255, 255, 0.5)" />
              )}
            </View>
          </TouchableOpacity>

          {examplesExpanded && (
            <View style={styles.collapsibleContent}>
              <Text style={styles.collapsibleText}>
                {t('istikhara.examplesText') || "For accurate results, names should be in Arabic script. Examples: محمد (Muhammad), علي (Ali), فاطمة (Fatima)"}
              </Text>
            </View>
          )}

          {/* Privacy Section - Collapsible */}
          <TouchableOpacity
            style={styles.collapsibleHeaderCompact}
            onPress={() => {
              setPrivacyExpanded(!privacyExpanded);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            activeOpacity={0.7}
          >
            <View style={styles.collapsibleHeaderContentCompact}>
              <View style={styles.collapsibleTitleRow}>
                <Shield size={16} color="rgba(96, 165, 250, 0.8)" />
                <Text style={styles.collapsibleTitleCompact}>{t('istikhara.privacyTitle')}</Text>
              </View>
              {privacyExpanded ? (
                <ChevronUp size={16} color="rgba(255, 255, 255, 0.5)" />
              ) : (
                <ChevronDown size={16} color="rgba(255, 255, 255, 0.5)" />
              )}
            </View>
          </TouchableOpacity>

          {privacyExpanded && (
            <View style={styles.collapsibleContent}>
              <Text style={styles.collapsibleText}>
                {t('istikhara.privacyText') || "🔒 Your data is never stored or shared. All calculations happen instantly."}
              </Text>
            </View>
          )}
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 16, // Reduced from 24
    paddingHorizontal: 16,
  },
  
  // Minimal header - reduced visual weight
  headerMinimal: {
    alignItems: 'center',
    marginBottom: 16, // Reduced from 24
    paddingTop: 8,
  },
  headerTitleMinimal: {
    fontSize: 24, // Reduced from 28
    fontWeight: '700', // Changed from 'bold'
    color: '#ffffff',
    marginBottom: 6, // Reduced from 8
  },
  headerSubtitleMinimal: {
    fontSize: 13, // Reduced from 14
    color: 'rgba(255, 255, 255, 0.6)', // More faded
    textAlign: 'center',
    paddingHorizontal: 20,
  },

  // Main form - HERO ELEMENT with enhanced visual prominence
  formCard: {
    marginBottom: 20, // Changed from marginTop: 8
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(139, 92, 246, 0.3)', // Purple accent border
    // Glow effect
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  formGradient: {
    padding: 20,
  },
  helperText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },

  // Educational section - below form, lower visual weight
  educationalSection: {
    marginTop: 8,
  },

  // Compact collapsible sections
  collapsibleHeaderCompact: {
    marginBottom: 8, // Reduced from 12
    borderRadius: 10, // Reduced from 12
    backgroundColor: 'rgba(255, 255, 255, 0.05)', // Subtle background
    borderWidth: 1, // Reduced from 2
    borderColor: 'rgba(255, 255, 255, 0.08)', // More subtle
  },
  collapsibleHeaderContentCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12, // Reduced from 16
  },
  collapsibleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // Reduced from 10
    flex: 1,
  },
  collapsibleTitleCompact: {
    fontSize: 13, // Reduced from 15
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)', // Slightly faded
  },
  collapsibleContent: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    padding: 16,
    marginTop: -8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  collapsibleText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 22,
  },
  discoveryItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    marginBottom: 8,
  },
  discoveryIcon: {
    fontSize: 24,
  },
  discoveryTextContainer: {
    flex: 1,
  },
  discoveryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  discoveryDesc: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 18,
  },

  // Calculate button
  calculateButton: {
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 8,
    marginBottom: 12,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  calculateButtonDisabled: {
    shadowOpacity: 0,
    elevation: 0,
  },
  calculateButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
    gap: 12,
  },
  calculateButtonIcon: {
    fontSize: 24,
  },
  calculateButtonText: {
    fontSize: 17,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  
  // Name section styles
  nameSection: {
    marginBottom: 20,
  },
  nameSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  nameSectionIcon: {
    fontSize: 22,
  },
  nameSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  nameLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 8,
    marginTop: 8,
  },
  arabicInputWrapper: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderWidth: 2,
    borderColor: 'rgba(148, 163, 184, 0.25)',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    minHeight: 50,
  },
  arabicInput: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'right',
    fontWeight: '500',
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 6,
  },

  // Method Selector Styles
  methodSelectorContainer: {
    marginBottom: 20,
  },
  methodSelectorLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 12,
    textAlign: 'center',
  },
  methodButton: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  methodButtonSelected: {
    borderColor: 'rgba(139, 92, 246, 0.5)',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  methodButtonGradient: {
    padding: 16,
    position: 'relative',
  },
  methodButtonContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  methodButtonTextContainer: {
    flex: 1,
  },
  methodButtonTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 6,
  },
  methodButtonTitleSelected: {
    color: '#ffffff',
  },
  methodButtonDescription: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: 18,
    marginTop: 4,
  },
  methodBadge: {
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  methodBadgeQuick: {
    backgroundColor: 'rgba(34, 197, 94, 0.3)',
  },
  methodBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  selectedIndicator: {
    position: 'absolute',
    right: 16,
    top: 16,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#8b5cf6',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Birth Date Form Styles
  birthdateSection: {
    marginBottom: 20,
  },
  birthInputModeRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  birthInputModeChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.25)',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    alignItems: 'center',
  },
  birthInputModeChipSelected: {
    backgroundColor: 'rgba(139, 92, 246, 0.18)',
    borderColor: 'rgba(139, 92, 246, 0.5)',
  },
  birthInputModeChipText: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 13,
    fontWeight: '600',
  },
  birthInputModeChipTextSelected: {
    color: '#ffffff',
  },
  birthInputHint: {
    marginTop: 10,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: 16,
  },
  monthDayRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  monthDayField: {
    flex: 1,
  },
  monthDayLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 6,
    fontWeight: '600',
  },
  monthDayInput: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderWidth: 2,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderWidth: 2,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  datePickerText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
    flex: 1,
  },
  birthdateInfoBox: {
    marginTop: 16,
    padding: 16,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
  birthdateInfoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  birthdateInfoText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
    marginBottom: 4,
  },
});
