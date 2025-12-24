import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
    AlertCircle,
    BookOpen,
    CheckCircle,
    ChevronDown,
    ChevronUp,
    Lightbulb,
    Shield,
    Users,
} from 'lucide-react-native';
import React, { useState } from 'react';
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
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ResponsiveAppHeader from '../../components/AppHeader';
import { useLanguage } from '../../contexts/LanguageContext';
import { buildDestiny } from '@/features/name-destiny/services/nameDestinyCalculator';
import { ABJAD_MAGHRIBI, ABJAD_MASHRIQI } from '@/features/name-destiny/constants/abjadMaps';
import { useAbjad } from '@/features/name-destiny/contexts/AbjadContext';

export default function NameDestinyForm() {
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const { abjadSystem } = useAbjad();
  const insets = useSafeAreaInsets();
  
  const [personName, setPersonName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Collapsible section states
  const [educationExpanded, setEducationExpanded] = useState(false);
  const [discoveryExpanded, setDiscoveryExpanded] = useState(false);
  const [examplesExpanded, setExamplesExpanded] = useState(false);
  const [privacyExpanded, setPrivacyExpanded] = useState(false);
  
  // Validation states
  const [touched, setTouched] = useState({ person: false, mother: false });

  const validateName = (name: string) => {
    return name.trim().length > 0;
  };

  const personValid = validateName(personName);
  const motherValid = validateName(motherName);
  const isFormValid = personValid && motherValid;

  const handleCalculate = async () => {
    if (!isFormValid) {
      Alert.alert('Missing Information', 'Please enter both names to continue.');
      return;
    }

    // Provide haptic feedback
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    setLoading(true);
    
    try {
      // Get the correct abjad map based on system
      const abjadMap = abjadSystem === 'mashriqi' ? ABJAD_MASHRIQI : ABJAD_MAGHRIBI;
      
      // Calculate destiny
      const result = buildDestiny(personName.trim(), motherName.trim(), abjadMap);
      
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Navigate to results
      router.push({
        pathname: '/name-destiny/results',
        params: {
          data: JSON.stringify(result),
          personName: personName.trim(),
          motherName: motherName.trim(),
        },
      });
    } catch (err) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Calculation Error', 'An error occurred during calculation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.outerContainer}>
      <ResponsiveAppHeader
        currentLanguage={language === 'en' ? 'EN' : 'FR'}
        onLanguageChange={(lang) => setLanguage(lang.toLowerCase() as 'en' | 'fr')}
        onProfilePress={() => router.push('/modal')}
        onMenuPress={() => console.log('Menu pressed')}
      />
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
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerIcon}>📜</Text>
            <Text style={styles.headerTitle}>Name Destiny Calculator</Text>
            <Text style={styles.headerSubtitle}>
              Discover the spiritual significance and destiny encoded in names
            </Text>
          </View>

          {/* Educational Section - Collapsible */}
          <TouchableOpacity
            style={styles.collapsibleHeader}
            onPress={() => {
              setEducationExpanded(!educationExpanded);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={['rgba(59, 130, 246, 0.2)', 'rgba(79, 70, 229, 0.1)']}
              style={styles.collapsibleGradient}
            >
              <View style={styles.collapsibleHeaderContent}>
                <View style={styles.collapsibleTitleRow}>
                  <BookOpen size={20} color="#60a5fa" />
                  <Text style={styles.collapsibleTitle}>What is Name Destiny?</Text>
                </View>
                {educationExpanded ? (
                  <ChevronUp size={20} color="#60a5fa" />
                ) : (
                  <ChevronDown size={20} color="#60a5fa" />
                )}
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {educationExpanded && (
            <View style={styles.collapsibleContent}>
              <Text style={styles.collapsibleText}>
                Name Destiny (Qadr al-Asmāʾ) is an ancient Islamic practice that reveals the spiritual blueprint encoded in your name and your mother's name. Through sacred numerology (Abjad), we calculate your unique spiritual signature—the numbers, elements, and celestial influences that shape your path.
              </Text>
            </View>
          )}

          {/* What You'll Discover - Collapsible */}
          <TouchableOpacity
            style={styles.collapsibleHeader}
            onPress={() => {
              setDiscoveryExpanded(!discoveryExpanded);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={['rgba(168, 85, 247, 0.2)', 'rgba(139, 92, 246, 0.1)']}
              style={styles.collapsibleGradient}
            >
              <View style={styles.collapsibleHeaderContent}>
                <View style={styles.collapsibleTitleRow}>
                  <Lightbulb size={20} color="#c084fc" />
                  <Text style={styles.collapsibleTitle}>What You'll Discover</Text>
                </View>
                {discoveryExpanded ? (
                  <ChevronUp size={20} color="#c084fc" />
                ) : (
                  <ChevronDown size={20} color="#c084fc" />
                )}
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {discoveryExpanded && (
            <View style={styles.collapsibleContent}>
              {[
                { icon: '🔢', title: 'Sacred Numbers', desc: 'Your Kabir (grand total) and Saghir (spiritual essence)' },
                { icon: '🔥', title: 'Elemental Nature', desc: 'Your core element: Fire, Earth, Air, or Water' },
                { icon: '⭐', title: 'Zodiac Influence', desc: 'Your ruling Burj (constellation) and planetary hour' },
                { icon: '🌙', title: 'Spiritual Path', desc: 'Understanding your destiny through sacred wisdom' },
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
            style={styles.collapsibleHeader}
            onPress={() => {
              setExamplesExpanded(!examplesExpanded);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={['rgba(34, 197, 94, 0.2)', 'rgba(22, 163, 74, 0.1)']}
              style={styles.collapsibleGradient}
            >
              <View style={styles.collapsibleHeaderContent}>
                <View style={styles.collapsibleTitleRow}>
                  <Users size={20} color="#4ade80" />
                  <Text style={styles.collapsibleTitle}>Example Names</Text>
                </View>
                {examplesExpanded ? (
                  <ChevronUp size={20} color="#4ade80" />
                ) : (
                  <ChevronDown size={20} color="#4ade80" />
                )}
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {examplesExpanded && (
            <View style={styles.collapsibleContent}>
              <Text style={styles.collapsibleText}>
                For accurate results, names should be in Arabic script. Examples:{'\n\n'}
                • محمد (Muhammad){'\n'}
                • علي (Ali){'\n'}
                • فاطمة (Fatima){'\n'}
                • عائشة (Aisha){'\n'}
                • حسن (Hassan){'\n'}
                • خديجة (Khadija)
              </Text>
            </View>
          )}

          {/* Privacy Section - Collapsible */}
          <TouchableOpacity
            style={styles.collapsibleHeader}
            onPress={() => {
              setPrivacyExpanded(!privacyExpanded);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={['rgba(59, 130, 246, 0.2)', 'rgba(37, 99, 235, 0.1)']}
              style={styles.collapsibleGradient}
            >
              <View style={styles.collapsibleHeaderContent}>
                <View style={styles.collapsibleTitleRow}>
                  <Shield size={20} color="#60a5fa" />
                  <Text style={styles.collapsibleTitle}>Your Privacy</Text>
                </View>
                {privacyExpanded ? (
                  <ChevronUp size={20} color="#60a5fa" />
                ) : (
                  <ChevronDown size={20} color="#60a5fa" />
                )}
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {privacyExpanded && (
            <View style={styles.collapsibleContent}>
              <Text style={styles.collapsibleText}>
                🔒 Your data is never stored or shared. All calculations happen instantly on your device and are discarded after your session. We respect your privacy and spiritual journey.
              </Text>
            </View>
          )}

          {/* Main Form */}
          <View style={styles.formCard}>
            <LinearGradient
              colors={['rgba(15, 23, 42, 0.8)', 'rgba(30, 41, 59, 0.8)']}
              style={styles.formGradient}
            >
              <Text style={styles.formTitle}>Enter Names for Calculation</Text>
              <Text style={styles.formSubtitle}>
                Both names must be in Arabic script for accurate spiritual analysis
              </Text>

              {/* Person's Name Input */}
              <View style={styles.inputSection}>
                <LinearGradient
                  colors={['rgba(147, 51, 234, 0.3)', 'rgba(236, 72, 153, 0.2)']}
                  style={styles.inputGradient}
                >
                  <View style={styles.inputHeader}>
                    <View style={styles.inputTitleRow}>
                      <Text style={styles.inputEmoji}>👤</Text>
                      <Text style={styles.inputTitle}>Your Name</Text>
                    </View>
                    {touched.person && personValid && (
                      <CheckCircle size={20} color="#86efac" />
                    )}
                  </View>

                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Arabic Name *</Text>
                    <TextInput
                      style={[
                        styles.input,
                        touched.person && !personValid && styles.inputError,
                        touched.person && personValid && styles.inputSuccess,
                      ]}
                      placeholder="محمد"
                      placeholderTextColor="rgba(255, 255, 255, 0.3)"
                      value={personName}
                      onChangeText={(text) => {
                        setPersonName(text);
                        if (!touched.person) setTouched({ ...touched, person: true });
                      }}
                      textAlign="right"
                      editable={!loading}
                      autoCapitalize="none"
                      autoCorrect={false}
                      returnKeyType="next"
                      onSubmitEditing={() => Keyboard.dismiss()}
                    />
                    {touched.person && !personValid && (
                      <View style={styles.errorRow}>
                        <AlertCircle size={14} color="#fca5a5" />
                        <Text style={styles.errorText}>Please enter a valid name</Text>
                      </View>
                    )}
                  </View>
                </LinearGradient>
              </View>

              {/* Mother's Name Input */}
              <View style={styles.inputSection}>
                <LinearGradient
                  colors={['rgba(79, 70, 229, 0.3)', 'rgba(59, 130, 246, 0.2)']}
                  style={styles.inputGradient}
                >
                  <View style={styles.inputHeader}>
                    <View style={styles.inputTitleRow}>
                      <Text style={styles.inputEmoji}>👩</Text>
                      <Text style={styles.inputTitle}>Mother's Name</Text>
                    </View>
                    {touched.mother && motherValid && (
                      <CheckCircle size={20} color="#86efac" />
                    )}
                  </View>

                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Arabic Name *</Text>
                    <TextInput
                      style={[
                        styles.input,
                        touched.mother && !motherValid && styles.inputError,
                        touched.mother && motherValid && styles.inputSuccess,
                      ]}
                      placeholder="فاطمة"
                      placeholderTextColor="rgba(255, 255, 255, 0.3)"
                      value={motherName}
                      onChangeText={(text) => {
                        setMotherName(text);
                        if (!touched.mother) setTouched({ ...touched, mother: true });
                      }}
                      textAlign="right"
                      editable={!loading}
                      autoCapitalize="none"
                      autoCorrect={false}
                      returnKeyType="done"
                      onSubmitEditing={() => {
                        Keyboard.dismiss();
                        if (isFormValid) handleCalculate();
                      }}
                    />
                    {touched.mother && !motherValid && (
                      <View style={styles.errorRow}>
                        <AlertCircle size={14} color="#fca5a5" />
                        <Text style={styles.errorText}>Please enter a valid name</Text>
                      </View>
                    )}
                  </View>
                </LinearGradient>
              </View>

              {/* Calculate Button */}
              <TouchableOpacity
                style={[
                  styles.calculateButton,
                  !isFormValid && styles.calculateButtonDisabled,
                ]}
                onPress={handleCalculate}
                disabled={!isFormValid || loading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={
                    isFormValid && !loading
                      ? ['#8b5cf6', '#7c3aed', '#6d28d9']
                      : ['#4b5563', '#374151', '#1f2937']
                  }
                  style={styles.calculateGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  {loading ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="small" color="#ffffff" />
                      <Text style={styles.calculateButtonText}>Calculating...</Text>
                    </View>
                  ) : (
                    <Text style={styles.calculateButtonText}>
                      ✨ Calculate Destiny
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </View>

          {/* Bottom spacing for safe area */}
          <View style={{ height: Math.max(insets.bottom, 20) }} />
        </ScrollView>
      </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#cbd5e1',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  collapsibleHeader: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  collapsibleGradient: {
    padding: 16,
  },
  collapsibleHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  collapsibleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  collapsibleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f1f5f9',
  },
  collapsibleContent: {
    marginHorizontal: 16,
    marginTop: -8,
    marginBottom: 12,
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderRadius: 12,
    padding: 16,
  },
  collapsibleText: {
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 22,
  },
  discoveryItem: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  discoveryIcon: {
    fontSize: 24,
    marginRight: 12,
    marginTop: 2,
  },
  discoveryTextContainer: {
    flex: 1,
  },
  discoveryTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#f1f5f9',
    marginBottom: 4,
  },
  discoveryDesc: {
    fontSize: 13,
    color: '#94a3b8',
    lineHeight: 19,
  },
  formCard: {
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  formGradient: {
    padding: 20,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 14,
    color: '#cbd5e1',
    marginBottom: 24,
    lineHeight: 20,
  },
  inputSection: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  inputGradient: {
    padding: 16,
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
    gap: 8,
  },
  inputEmoji: {
    fontSize: 20,
  },
  inputTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f1f5f9',
  },
  inputWrapper: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#cbd5e1',
  },
  input: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderWidth: 2,
    borderColor: 'rgba(148, 163, 184, 0.2)',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '500',
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
    marginTop: 4,
  },
  errorText: {
    fontSize: 12,
    color: '#fca5a5',
  },
  calculateButton: {
    marginTop: 24,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  calculateButtonDisabled: {
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
  calculateGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calculateButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});
