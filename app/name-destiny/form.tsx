import { CollapsibleSection, DestinyHeader } from '@/components/nameDestiny';
import { useLanguage } from '@/contexts/LanguageContext';
import { ABJAD_MAGHRIBI, ABJAD_MASHRIQI } from '@/features/name-destiny/constants/abjadMaps';
import { useAbjad } from '@/features/name-destiny/contexts/AbjadContext';
import { buildDestiny } from '@/features/name-destiny/services/nameDestinyCalculator';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { AlertCircle, BookOpen, CheckCircle, Lightbulb, Shield, Sparkles, Users } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
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
  const { language, setLanguage } = useLanguage();
  const { abjadSystem } = useAbjad();
  const insets = useSafeAreaInsets();

  const [personName, setPersonName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [touched, setTouched] = useState({ person: false, mother: false });
  const [loading, setLoading] = useState(false);

  const [educationOpen, setEducationOpen] = useState(false);
  const [insightsOpen, setInsightsOpen] = useState(false);
  const [examplesOpen, setExamplesOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  const isPersonValid = useMemo(() => personName.trim().length > 0, [personName]);
  const isMotherValid = useMemo(() => motherName.trim().length > 0, [motherName]);
  const isFormValid = isPersonValid && isMotherValid;

  const handleCalculate = async () => {
    if (!isFormValid || loading) {
      if (!isFormValid) {
        Alert.alert('Incomplete Form', 'Please enter both names to continue.');
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
        pathname: '/name-destiny/results',
        params: {
          data: JSON.stringify(result),
          personName: trimmedPerson,
          motherName: trimmedMother,
        },
      });
    } catch (error) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Calculation Error', 'Something went wrong while generating the destiny insights.');
      console.error('[name-destiny/form] calculation failure', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <LinearGradient colors={['#0f172a', '#1e1b4b', '#312e81']} style={styles.gradient}>
        <DestinyHeader
          title="Name Destiny"
          onBack={() => router.back()}
          language={language === 'ar' ? 'en' : language}
          onLanguageChange={setLanguage}
        />

        <KeyboardAvoidingView
          style={styles.keyboardAvoider}
          behavior={Platform.select({ ios: 'padding', default: undefined })}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Hero Section */}
            <View style={styles.hero}>
              <Sparkles size={40} color="#a78bfa" />
              <Text style={styles.heroTitle}>Name Destiny Calculator</Text>
              <Text style={styles.heroSubtitle}>
                Discover the spiritual blueprint encoded in your name through sacred Abjad numerology
              </Text>
            </View>

            {/* Input Section - MUST BE FIRST */}
            <View style={styles.inputSection}>
              <Text style={styles.sectionTitle}>Enter Names</Text>
              <Text style={styles.sectionSubtitle}>Both names must be in Arabic script</Text>

              {/* Person Name Input */}
              <LinearGradient
                colors={['rgba(147, 51, 234, 0.25)', 'rgba(236, 72, 153, 0.15)']}
                style={styles.inputCard}
              >
                <View style={styles.inputHeader}>
                  <Text style={styles.inputLabel}>Your Name</Text>
                  {touched.person && isPersonValid && <CheckCircle size={18} color="#86efac" />}
                </View>
                <TextInput
                  style={[
                    styles.input,
                    touched.person && !isPersonValid && styles.inputError,
                    touched.person && isPersonValid && styles.inputSuccess,
                  ]}
                  placeholder="محمد"
                  placeholderTextColor="rgba(255, 255, 255, 0.3)"
                  value={personName}
                  onChangeText={(text) => {
                    setPersonName(text);
                    if (!touched.person) setTouched((prev) => ({ ...prev, person: true }));
                  }}
                  textAlign="right"
                  editable={!loading}
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                />
                {touched.person && !isPersonValid && (
                  <View style={styles.errorRow}>
                    <AlertCircle size={14} color="#fca5a5" />
                    <Text style={styles.errorText}>Please enter a valid Arabic name</Text>
                  </View>
                )}
              </LinearGradient>

              {/* Mother Name Input */}
              <LinearGradient
                colors={['rgba(79, 70, 229, 0.25)', 'rgba(59, 130, 246, 0.15)']}
                style={styles.inputCard}
              >
                <View style={styles.inputHeader}>
                  <Text style={styles.inputLabel}>Mother's Name</Text>
                  {touched.mother && isMotherValid && <CheckCircle size={18} color="#86efac" />}
                </View>
                <TextInput
                  style={[
                    styles.input,
                    touched.mother && !isMotherValid && styles.inputError,
                    touched.mother && isMotherValid && styles.inputSuccess,
                  ]}
                  placeholder="فاطمة"
                  placeholderTextColor="rgba(255, 255, 255, 0.3)"
                  value={motherName}
                  onChangeText={(text) => {
                    setMotherName(text);
                    if (!touched.mother) setTouched((prev) => ({ ...prev, mother: true }));
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
                {touched.mother && !isMotherValid && (
                  <View style={styles.errorRow}>
                    <AlertCircle size={14} color="#fca5a5" />
                    <Text style={styles.errorText}>Please enter a valid Arabic name</Text>
                  </View>
                )}
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
                      <Text style={styles.calculateText}>Calculating...</Text>
                    </View>
                  ) : (
                    <Text style={styles.calculateText}>✨ Calculate Destiny</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Info Sections - AFTER INPUTS */}
            <View style={styles.infoSection}>
              <CollapsibleSection
                title="What is Name Destiny?"
                icon={BookOpen}
                tintColor="#60a5fa"
                open={educationOpen}
                onToggle={() => setEducationOpen((prev) => !prev)}
              >
                <Text style={styles.infoText}>
                  Name Destiny (Qadr al-Asmāʾ) reveals the spiritual blueprint encoded within your name
                  and your mother's name. Using Abjad numerology, we uncover the sacred numbers, elemental
                  balance, and celestial influences guiding your life path.
                </Text>
              </CollapsibleSection>

              <CollapsibleSection
                title="What You'll Discover"
                icon={Lightbulb}
                tintColor="#c084fc"
                open={insightsOpen}
                onToggle={() => setInsightsOpen((prev) => !prev)}
              >
                {[
                  { icon: '🔢', title: 'Sacred Numbers', desc: 'Kabir (grand total) and Saghir (essence)' },
                  { icon: '💧', title: 'Element', desc: 'Your Tab element—Water, Fire, Earth, or Air' },
                  { icon: '⭐', title: 'Zodiac', desc: 'Your Burj (constellation) and ruling planet' },
                  { icon: '🌙', title: 'Guidance', desc: 'Spiritual insights for your journey' },
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
                title="Example Names"
                icon={Users}
                tintColor="#4ade80"
                open={examplesOpen}
                onToggle={() => setExamplesOpen((prev) => !prev)}
              >
                <Text style={styles.infoText}>
                  All entries should be in Arabic script for accurate calculation:
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
                title="Your Privacy"
                icon={Shield}
                tintColor="#60a5fa"
                open={privacyOpen}
                onToggle={() => setPrivacyOpen((prev) => !prev)}
              >
                <Text style={styles.infoText}>
                  🔒 Calculations happen entirely on your device. Your names are never stored, synced, or
                  shared—preserving the privacy of your sacred journey.
                </Text>
              </CollapsibleSection>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>For reflection only • Not divination or legal ruling</Text>
            </View>

            <View style={{ height: Math.max(insets.bottom, 24) }} />
          </ScrollView>
        </KeyboardAvoidingView>
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
  inputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f1f5f9',
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
