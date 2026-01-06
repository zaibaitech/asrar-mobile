/**
 * Istikhara Tab - Main Istikhara Calculator
 * Full Istikhara form for sacred numerology calculations
 */
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
    BookOpen,
    ChevronDown,
    ChevronUp,
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
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import NameInputSection from '../../components/istikhara/NameInputSection';
import { useLanguage } from '../../contexts/LanguageContext';
import { useProfile } from '../../contexts/ProfileContext';
import { useIstikhara } from '../../hooks/useIstikhara';
import { useNameSuggestions } from '../../hooks/useNameSuggestions';
import { HistoryService } from '../../services/HistoryService';

export default function IstikharaCalculator() {
  const router = useRouter();
  const { t } = useLanguage();
  const { profile } = useProfile();
  const { calculate, loading, error, result } = useIstikhara();
  
  const [personName, setPersonName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [personLatin, setPersonLatin] = useState('');
  const [motherLatin, setMotherLatin] = useState('');
  
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
  }, [profile.nameAr, profile.nameLatin, profile.motherName]);
  
  // Collapsible section states - ALL COLLAPSED BY DEFAULT
  const [educationExpanded, setEducationExpanded] = useState(false);
  const [discoveryExpanded, setDiscoveryExpanded] = useState(false);
  const [examplesExpanded, setExamplesExpanded] = useState(false);
  const [privacyExpanded, setPrivacyExpanded] = useState(false);
  
  // Validation states
  const [touched, setTouched] = useState({ person: false, mother: false });
  
  // Name suggestions
  const personSuggestions = useNameSuggestions(personLatin);
  const motherSuggestions = useNameSuggestions(motherLatin);

  const validateName = (name: string) => {
    return name.trim().length > 0;
  };

  const personValid = validateName(personName);
  const motherValid = validateName(motherName);
  const isFormValid = personValid && motherValid;

  const handleCalculate = async () => {
    if (!isFormValid) {
      Alert.alert(t('common.error'), t('istikhara.validation.missingNames') || 'Please enter both names to continue.');
      return;
    }

    // Provide haptic feedback
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      await calculate(personName.trim(), motherName.trim(), 'en');
      
      // If calculation was successful, navigate to results
      if (!error) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        // Note: We'll pass result via route params
        router.push({
          pathname: '/(tabs)/results',
          params: {
            personName: personName.trim(),
            motherName: motherName.trim(),
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

          {/* MAIN FORM - ACTION FIRST! */}
          <View style={styles.formCard}>
            <LinearGradient
              colors={['rgba(15, 23, 42, 0.9)', 'rgba(30, 41, 59, 0.9)']}
              style={styles.formGradient}
            >
              {/* Person's Name Input */}
              <NameInputSection
                title={t('istikhara.form.personName')}
                icon="👤"
                latinValue={personLatin}
                arabicValue={personName}
                onLatinChange={(text) => {
                  setPersonLatin(text);
                  if (!touched.person) setTouched({ ...touched, person: true });
                }}
                onArabicChange={(text) => {
                  setPersonName(text);
                  if (!touched.person) setTouched({ ...touched, person: true });
                }}
                suggestions={personSuggestions.suggestions}
                borderColor="#10B981"
                isValid={personValid}
                touched={touched.person}
              />

              {/* Mother's Name Input */}
              <NameInputSection
                title={t('istikhara.form.motherName')}
                icon="👩"
                latinValue={motherLatin}
                arabicValue={motherName}
                onLatinChange={(text) => {
                  setMotherLatin(text);
                  if (!touched.mother) setTouched({ ...touched, mother: true });
                }}
                onArabicChange={(text) => {
                  setMotherName(text);
                  if (!touched.mother) setTouched({ ...touched, mother: true });
                }}
                suggestions={motherSuggestions.suggestions}
                borderColor="#3B82F6"
                isValid={motherValid}
                touched={touched.mother}
              />

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
});
