/**
 * Name Destiny Screen - Input & Analysis
 * Mobile Implementation - Expo Go 54
 */

import ArabicKeyboard from '@/components/istikhara/ArabicKeyboard';
import { PremiumSection } from '@/components/subscription/PremiumSection';
import { DarkTheme, ElementAccents, Spacing, Typography } from '@/constants/DarkTheme';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DivineResonanceCard } from '../components/DivineResonanceCard';
import { ABJAD_MAGHRIBI, ABJAD_MASHRIQI } from '../constants/abjadMaps';
import { useAbjad } from '../contexts/AbjadContext';
import { buildDestiny } from '../services/nameDestinyCalculator';
import { NameDestinyResult } from '../types';

type ReadingType = 'explore' | 'personal';

export default function NameDestinyHomeScreen() {
  const { abjadSystem } = useAbjad();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);

  // Form state
  const [readingType, setReadingType] = useState<ReadingType>('personal');
  const [nameLatin, setNameLatin] = useState('');
  const [nameArabic, setNameArabic] = useState('');
  const [motherLatin, setMotherLatin] = useState('');
  const [motherArabic, setMotherArabic] = useState('');
  
  // UI state
  const [showNameKeyboard, setShowNameKeyboard] = useState(false);
  const [showMotherKeyboard, setShowMotherKeyboard] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<NameDestinyResult | null>(null);

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!nameLatin.trim()) {
      newErrors.nameLatin = 'Name is required';
    }
    
    if (readingType === 'personal' && !motherLatin.trim()) {
      newErrors.motherLatin = "Mother's name is required for personal reading";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle analysis
  const handleAnalyze = () => {
    Keyboard.dismiss();
    
    if (!validateForm()) {
      return;
    }

    // Use Arabic names if provided, otherwise use Latin names
    const finalName = nameArabic.trim() || nameLatin.trim();
    const finalMotherName = readingType === 'personal' 
      ? (motherArabic.trim() || motherLatin.trim())
      : undefined;

    // Get the correct abjad map based on system
    const abjadMap = abjadSystem === 'mashriqi' ? ABJAD_MASHRIQI : ABJAD_MAGHRIBI;

    // Calculate destiny
    const calculatedResult = buildDestiny(finalName, finalMotherName, abjadMap);
    setResult(calculatedResult);

    // Scroll to results after a brief delay
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  // Arabic keyboard handlers
  const handleNameKeyPress = (key: string) => {
    setNameArabic(prev => prev + key);
    setErrors(prev => ({ ...prev, nameLatin: '' }));
  };

  const handleNameBackspace = () => {
    setNameArabic(prev => prev.slice(0, -1));
  };

  const handleMotherKeyPress = (key: string) => {
    setMotherArabic(prev => prev + key);
    setErrors(prev => ({ ...prev, motherLatin: '' }));
  };

  const handleMotherBackspace = () => {
    setMotherArabic(prev => prev.slice(0, -1));
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Section */}
          <View style={styles.header}>
            <Text style={styles.headerEmoji}>📜</Text>
            <Text style={styles.headerTitle}>Discover Your Name Destiny</Text>
            <Text style={styles.headerSubtitle}>
              Discover the spiritual essence encoded in your name
            </Text>
          </View>

          {/* Reading Type Selector */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Choose Your Reading Type</Text>
            
            <Pressable
              style={[
                styles.readingCard,
                readingType === 'explore' && styles.readingCardSelected,
              ]}
              onPress={() => setReadingType('explore')}
            >
              <View style={styles.readingCardIcon}>
                <Text style={styles.readingCardIconText}>📖</Text>
              </View>
              <View style={styles.readingCardContent}>
                <Text style={[
                  styles.readingCardTitle,
                  readingType === 'explore' && styles.readingCardTitleSelected,
                ]}>
                  Explore a Name
                </Text>
                <Text style={styles.readingCardDescription}>
                  Discover the spiritual meaning and general characteristics of any name
                </Text>
                <Text style={styles.readingCardBest}>
                  Best for: Learning about names, cultural exploration, general insights
                </Text>
              </View>
            </Pressable>

            <Pressable
              style={[
                styles.readingCard,
                readingType === 'personal' && styles.readingCardSelected,
              ]}
              onPress={() => setReadingType('personal')}
            >
              <View style={styles.readingCardIconContainer}>
                {readingType === 'personal' && (
                  <View style={styles.recommendedBadge}>
                    <Text style={styles.recommendedText}>⭐ Recommended</Text>
                  </View>
                )}
                <View style={styles.readingCardIcon}>
                  <Text style={styles.readingCardIconText}>✨</Text>
                </View>
              </View>
              <View style={styles.readingCardContent}>
                <Text style={[
                  styles.readingCardTitle,
                  readingType === 'personal' && styles.readingCardTitleSelected,
                ]}>
                  My Personal Reading
                </Text>
                <Text style={styles.readingCardDescription}>
                  Get YOUR unique spiritual profile - personalized to your exact soul blueprint
                </Text>
                <Text style={styles.readingCardBest}>
                  Best for: Self-discovery, spiritual guidance, personal transformation
                </Text>
              </View>
            </Pressable>
          </View>

          {/* Name Input Section */}
          <View style={styles.section}>
            <Text style={styles.label}>
              Name (Latin script) <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, errors.nameLatin && styles.inputError]}
              placeholder="e.g., Fatima, Ibrahima, Amadou"
              placeholderTextColor="#999"
              value={nameLatin}
              onChangeText={(text) => {
                setNameLatin(text);
                setErrors(prev => ({ ...prev, nameLatin: '' }));
              }}
              autoCapitalize="words"
            />
            {errors.nameLatin && (
              <Text style={styles.errorText}>{errors.nameLatin}</Text>
            )}
            
            <Text style={styles.helperText}>
              Type your name in Latin letters - we'll show the Arabic equivalent
            </Text>

            {/* Arabic Name Input */}
            <View style={styles.arabicInputContainer}>
              <Text style={styles.label}>Or in Arabic (Optional)</Text>
              <View style={styles.arabicInputRow}>
                <TextInput
                  style={[styles.input, styles.arabicInput]}
                  value={nameArabic}
                  onChangeText={setNameArabic}
                  placeholder="اكتب بالعربية"
                  placeholderTextColor="#999"
                  textAlign="right"
                  editable={!showNameKeyboard}
                />
                <TouchableOpacity
                  style={styles.keyboardButton}
                  onPress={() => {
                    Keyboard.dismiss();
                    setShowNameKeyboard(!showNameKeyboard);
                  }}
                >
                  <Text style={styles.keyboardButtonText}>
                    {showNameKeyboard ? '⌨️ Hide' : '⌨️ Show Keyboard'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Mother's Name Section (only for Personal Reading) */}
          {readingType === 'personal' && (
            <View style={styles.section}>
              <View style={styles.motherNameHeader}>
                <Text style={styles.label}>
                  Mother's Name <Text style={styles.required}>*</Text>
                </Text>
                <View style={styles.infoBadge}>
                  <Text style={styles.infoBadgeText}>Required for Personal</Text>
                </View>
              </View>
              
              <Text style={styles.personalNote}>
                Your unique reading - requires mother's name
              </Text>

              <Text style={styles.subLabel}>Type in Latin letters</Text>
              <TextInput
                style={[styles.input, errors.motherLatin && styles.inputError]}
                placeholder="e.g., Fatima, Khadija, Aisha"
                placeholderTextColor="#999"
                value={motherLatin}
                onChangeText={(text) => {
                  setMotherLatin(text);
                  setErrors(prev => ({ ...prev, motherLatin: '' }));
                }}
                autoCapitalize="words"
              />
              {errors.motherLatin && (
                <Text style={styles.errorText}>{errors.motherLatin}</Text>
              )}

              {/* Arabic Mother Name Input */}
              <View style={styles.arabicInputContainer}>
                <Text style={styles.label}>Or in Arabic</Text>
                <View style={styles.arabicInputRow}>
                  <TextInput
                    style={[styles.input, styles.arabicInput]}
                    value={motherArabic}
                    onChangeText={setMotherArabic}
                    placeholder="فاطمة"
                    placeholderTextColor="#999"
                    textAlign="right"
                    editable={!showMotherKeyboard}
                  />
                  <TouchableOpacity
                    style={styles.keyboardButton}
                    onPress={() => {
                      Keyboard.dismiss();
                      setShowMotherKeyboard(!showMotherKeyboard);
                    }}
                  >
                    <Text style={styles.keyboardButtonText}>
                      {showMotherKeyboard ? '⌨️ Hide' : '⌨️ Show Keyboard'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* Results Section - Guided Spiritual Insight */}
          {result && (
            <View style={styles.resultsSection}>
              {/* Hero Section - Spiritual Overview */}
              <View style={styles.heroSection}>
                <Text style={styles.heroIcon}>✨</Text>
                <Text style={styles.heroTitle}>Your Spiritual Essence</Text>
                <Text style={styles.heroSubtitle}>
                  {result.personName}
                  {result.motherName && ` • ${result.motherName}`}
                </Text>
              </View>

              {/* Core Insight - Primary Spiritual Pattern */}
              <LinearGradient
                colors={['rgba(139, 92, 246, 0.15)', 'rgba(79, 70, 229, 0.1)']}
                style={styles.coreInsightCard}
              >
                <View style={styles.coreInsightHeader}>
                  <View style={styles.coreInsightIconContainer}>
                    <Text style={styles.coreInsightIcon}>🌙</Text>
                  </View>
                  <Text style={styles.coreInsightLabel}>Core Spiritual Pattern</Text>
                </View>
                
                <Text style={styles.coreInsightValue}>
                  {result.element.en} Nature with {result.burj.en} Influence
                </Text>
                
                <Text style={styles.coreInsightDescription}>
                  The spiritual pattern surrounding your name shows a dominant {result.element.en.toLowerCase()} energy, 
                  guided by the qualities of {result.burj.en}. This combination suggests a path of{' '}
                  {result.element.en === 'Fire' ? 'transformation and spiritual illumination' :
                   result.element.en === 'Water' ? 'emotional depth and intuitive wisdom' :
                   result.element.en === 'Air' ? 'intellectual clarity and spiritual communication' :
                   'groundedness and spiritual stability'}.
                </Text>
              </LinearGradient>

              {/* Supporting Signs - Compact Cards */}
              <View style={styles.supportingSignsSection}>
                <Text style={styles.supportingSignsTitle}>Spiritual Indicators</Text>
                
                <View style={styles.supportingSignsGrid}>
                  {/* Element Harmony */}
                  <View style={styles.signCard}>
                    <Text style={styles.signIcon}>🌊</Text>
                    <Text style={styles.signLabel}>Element</Text>
                    <Text style={styles.signValue}>{result.element.en}</Text>
                    <Text style={styles.signArabic}>{result.element.ar}</Text>
                  </View>

                  {/* Celestial Alignment */}
                  <View style={styles.signCard}>
                    <Text style={styles.signIcon}>⭐</Text>
                    <Text style={styles.signLabel}>Celestial</Text>
                    <Text style={styles.signValue}>{result.burj.en}</Text>
                    <Text style={styles.signArabic}>{result.burj.ar}</Text>
                  </View>

                  {/* Temporal Quality */}
                  <View style={styles.signCard}>
                    <Text style={styles.signIcon}>🕰️</Text>
                    <Text style={styles.signLabel}>Hour</Text>
                    <Text style={styles.signValue}>{result.hour.name}</Text>
                    <Text style={styles.signArabic}>{result.hour.ar}</Text>
                  </View>
                </View>
              </View>

              {/* Recommended Spiritual Actions */}
              <View style={styles.recommendedActionsSection}>
                <LinearGradient
                  colors={['rgba(79, 70, 229, 0.15)', 'rgba(99, 102, 241, 0.1)']}
                  style={styles.recommendedActionsCard}
                >
                  <View style={styles.recommendedActionsHeader}>
                    <Text style={styles.recommendedActionsIcon}>🤲</Text>
                    <Text style={styles.recommendedActionsTitle}>Spiritual Guidance</Text>
                  </View>
                  
                  <View style={styles.guidanceItem}>
                    <Text style={styles.guidanceDot}>•</Text>
                    <Text style={styles.guidanceText}>
                      Reflect during {result.hour.name} hours for enhanced clarity
                    </Text>
                  </View>
                  
                  <View style={styles.guidanceItem}>
                    <Text style={styles.guidanceDot}>•</Text>
                    <Text style={styles.guidanceText}>
                      Embrace {result.element.en.toLowerCase()} qualities through mindful presence
                    </Text>
                  </View>
                  
                  <View style={styles.guidanceItem}>
                    <Text style={styles.guidanceDot}>•</Text>
                    <Text style={styles.guidanceText}>
                      Contemplate {result.burj.en} wisdom in moments of decision
                    </Text>
                  </View>
                </LinearGradient>
              </View>

              {/* Divine Resonance - Enhanced Presentation */}
              {result.divineResonance && (
                <View style={styles.divineResonanceSection}>
                  <DivineResonanceCard resonance={result.divineResonance} />
                </View>
              )}

              {/* Collapsible Spiritual Details - Premium */}
              <PremiumSection
                featureId="spiritualGuidance"
                title={t('premiumSections.spiritualDetails.title')}
                description={t('premiumSections.spiritualDetails.description')}
                icon="📊"
              >
                <Pressable
                  style={styles.detailsToggle}
                  onPress={() => setShowDetails(!showDetails)}
                >
                  <View style={styles.detailsToggleHeader}>
                    <Text style={styles.detailsToggleIcon}>📊</Text>
                    <Text style={styles.detailsToggleText}>
                      {showDetails ? 'Hide' : 'Show'} Spiritual Details
                    </Text>
                  </View>
                  <Text style={styles.detailsToggleChevron}>
                    {showDetails ? '▲' : '▼'}
                  </Text>
                </Pressable>

                {showDetails && (
                  <View style={styles.detailsSection}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailRowLabel}>Total Kabīr</Text>
                      <Text style={styles.detailRowValue}>{result.totalKabir}</Text>
                    </View>
                    
                    <View style={styles.detailRow}>
                      <Text style={styles.detailRowLabel}>Ṣaghīr</Text>
                      <Text style={styles.detailRowValue}>{result.saghir}</Text>
                    </View>
                    
                    <View style={styles.detailRow}>
                      <Text style={styles.detailRowLabel}>Planetary Ruler</Text>
                      <Text style={styles.detailRowValue}>{result.burj.planet}</Text>
                    </View>

                    <Text style={styles.detailNote}>
                      These values represent the traditional Abjad calculations following the Maghribi system.
                    </Text>
                  </View>
                )}
              </PremiumSection>
            </View>
          )}

          {/* Bottom spacing for button */}
          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* Sticky Analyze Button */}
        <View style={[styles.buttonContainer, { paddingBottom: Math.max(insets.bottom, Spacing.cardMargin) }]}>
          <TouchableOpacity
            style={[
              styles.analyzeButton,
              (!nameLatin.trim() || (readingType === 'personal' && !motherLatin.trim())) && styles.analyzeButtonDisabled,
            ]}
            onPress={handleAnalyze}
            disabled={!nameLatin.trim() || (readingType === 'personal' && !motherLatin.trim())}
          >
            <LinearGradient
              colors={['#4f46e5', '#7c3aed']}
              style={styles.analyzeButtonGradient}
            >
              <Text style={styles.analyzeButtonText}>
                {result ? '🔄 Recalculate' : '✨ Analyze Destiny'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Arabic Keyboards */}
      <ArabicKeyboard
        visible={showNameKeyboard}
        onClose={() => setShowNameKeyboard(false)}
        onKeyPress={handleNameKeyPress}
        onBackspace={handleNameBackspace}
        onSpace={() => handleNameKeyPress(' ')}
      />

      <ArabicKeyboard
        visible={showMotherKeyboard}
        onClose={() => setShowMotherKeyboard(false)}
        onKeyPress={handleMotherKeyPress}
        onBackspace={handleMotherBackspace}
        onSpace={() => handleMotherKeyPress(' ')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DarkTheme.screenBackground,
  },
  flex: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 140,
  },
  header: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
    backgroundColor: DarkTheme.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: DarkTheme.borderSubtle,
  },
  headerEmoji: {
    fontSize: 40,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  headerTitle: {
    fontSize: Typography.h2,
    fontWeight: Typography.weightBold,
    color: DarkTheme.textPrimary,
    textAlign: 'center',
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: Typography.label,
    color: DarkTheme.textTertiary,
    textAlign: 'center',
  },
  section: {
    backgroundColor: DarkTheme.cardBackground,
    marginTop: Spacing.cardMargin,
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.cardPadding,
  },
  sectionTitle: {
    fontSize: Typography.h3,
    fontWeight: Typography.weightBold,
    color: DarkTheme.textPrimary,
    marginBottom: Spacing.lg,
  },
  readingCard: {
    borderWidth: 2,
    borderColor: DarkTheme.borderSubtle,
    borderRadius: 12,
    padding: Spacing.lg,
    marginBottom: Spacing.cardMargin,
    backgroundColor: DarkTheme.cardBackgroundAlt,
  },
  readingCardSelected: {
    borderColor: ElementAccents.fire.primary,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
  },
  readingCardIconContainer: {
    position: 'relative',
  },
  recommendedBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: ElementAccents.fire.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  recommendedText: {
    color: DarkTheme.textPrimary,
    fontSize: 11,
    fontWeight: Typography.weightBold,
  },
  readingCardIcon: {
    marginBottom: Spacing.cardMargin,
  },
  readingCardIconText: {
    fontSize: 32,
  },
  readingCardContent: {
    marginTop: 4,
  },
  readingCardTitle: {
    fontSize: Typography.h3,
    fontWeight: Typography.weightBold,
    color: DarkTheme.textSecondary,
    marginBottom: Spacing.sm,
  },
  readingCardTitleSelected: {
    color: ElementAccents.fire.primary,
  },
  readingCardDescription: {
    fontSize: Typography.label,
    color: DarkTheme.textTertiary,
    marginBottom: Spacing.cardMargin,
    lineHeight: 20,
  },
  readingCardBest: {
    fontSize: Typography.caption,
    color: DarkTheme.textMuted,
    fontStyle: 'italic',
  },
  label: {
    fontSize: Typography.body,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textSecondary,
    marginBottom: Spacing.sm,
  },
  subLabel: {
    fontSize: Typography.label,
    fontWeight: Typography.weightMedium,
    color: DarkTheme.textTertiary,
    marginBottom: 6,
    marginTop: Spacing.cardMargin,
  },
  required: {
    color: ElementAccents.fire.primary,
  },
  input: {
    backgroundColor: DarkTheme.cardBackgroundLight,
    borderWidth: 1,
    borderColor: DarkTheme.borderSubtle,
    borderRadius: 8,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.cardMargin,
    fontSize: Typography.body,
    color: DarkTheme.textPrimary,
  },
  inputError: {
    borderColor: ElementAccents.fire.primary,
  },
  arabicInput: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  errorText: {
    color: ElementAccents.fire.primary,
    fontSize: Typography.label,
    marginTop: 6,
  },
  helperText: {
    fontSize: Typography.label,
    color: DarkTheme.textMuted,
    marginTop: Spacing.sm,
    fontStyle: 'italic',
  },
  arabicInputContainer: {
    marginTop: Spacing.lg,
  },
  arabicInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  keyboardButton: {
    backgroundColor: DarkTheme.cardBackgroundLight,
    paddingHorizontal: Spacing.cardMargin,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: DarkTheme.borderSubtle,
  },
  keyboardButtonText: {
    color: DarkTheme.textSecondary,
    fontSize: Typography.label,
    fontWeight: Typography.weightSemibold,
  },
  motherNameHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  infoBadge: {
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  infoBadgeText: {
    color: ElementAccents.fire.primary,
    fontSize: 11,
    fontWeight: Typography.weightBold,
  },
  personalNote: {
    fontSize: Typography.label,
    color: ElementAccents.fire.secondary,
    marginBottom: Spacing.lg,
    fontWeight: Typography.weightMedium,
  },
  resultsSection: {
    backgroundColor: DarkTheme.screenBackground,
    marginTop: Spacing.cardMargin,
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.sectionGap,
  },
  // Hero Section - Spiritual Overview
  heroSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    paddingVertical: Spacing.lg,
  },
  heroIcon: {
    fontSize: 48,
    marginBottom: Spacing.sm,
  },
  heroTitle: {
    fontSize: Typography.h1,
    fontWeight: Typography.weightBold,
    color: DarkTheme.textPrimary,
    marginBottom: 6,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: Typography.body,
    color: DarkTheme.textTertiary,
    textAlign: 'center',
  },
  // Core Insight Card
  coreInsightCard: {
    borderRadius: 16,
    padding: Spacing.cardPadding,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  coreInsightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  coreInsightIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.cardMargin,
  },
  coreInsightIcon: {
    fontSize: 20,
  },
  coreInsightLabel: {
    fontSize: Typography.label,
    color: '#c084fc',
    fontWeight: Typography.weightSemibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  coreInsightValue: {
    fontSize: 24,
    fontWeight: Typography.weightBold,
    color: DarkTheme.textPrimary,
    marginBottom: Spacing.cardMargin,
  },
  coreInsightDescription: {
    fontSize: Typography.body,
    color: DarkTheme.textSecondary,
    lineHeight: 22,
  },
  // Supporting Signs Section
  supportingSignsSection: {
    marginBottom: Spacing.lg,
  },
  supportingSignsTitle: {
    fontSize: Typography.h3,
    fontWeight: Typography.weightBold,
    color: DarkTheme.textSecondary,
    marginBottom: Spacing.lg,
  },
  supportingSignsGrid: {
    flexDirection: 'row',
    gap: Spacing.cardMargin,
  },
  signCard: {
    flex: 1,
    backgroundColor: DarkTheme.cardBackgroundAlt,
    borderRadius: 12,
    padding: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: DarkTheme.borderSubtle,
  },
  signIcon: {
    fontSize: 28,
    marginBottom: Spacing.sm,
  },
  signLabel: {
    fontSize: Typography.caption,
    color: DarkTheme.textTertiary,
    fontWeight: Typography.weightSemibold,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  signValue: {
    fontSize: Typography.body,
    fontWeight: Typography.weightBold,
    color: DarkTheme.textPrimary,
    textAlign: 'center',
    marginBottom: 2,
  },
  signArabic: {
    fontSize: Typography.label,
    color: DarkTheme.textTertiary,
  },
  // Recommended Actions Section
  recommendedActionsSection: {
    marginBottom: Spacing.lg,
  },
  recommendedActionsCard: {
    borderRadius: 16,
    padding: Spacing.cardPadding,
    borderWidth: 1,
    borderColor: 'rgba(79, 70, 229, 0.3)',
  },
  recommendedActionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  recommendedActionsIcon: {
    fontSize: 24,
    marginRight: Spacing.sm,
  },
  recommendedActionsTitle: {
    fontSize: Typography.h3,
    fontWeight: Typography.weightBold,
    color: DarkTheme.textPrimary,
  },
  guidanceItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.cardMargin,
  },
  guidanceDot: {
    fontSize: Typography.h3,
    color: '#818cf8',
    marginRight: Spacing.sm,
    lineHeight: 22,
  },
  guidanceText: {
    flex: 1,
    fontSize: Typography.body,
    color: DarkTheme.textSecondary,
    lineHeight: 22,
  },
  // Collapsible Details
  detailsToggle: {
    backgroundColor: DarkTheme.cardBackgroundAlt,
    borderRadius: 12,
    padding: Spacing.lg,
    marginTop: Spacing.cardMargin,
    marginBottom: Spacing.cardMargin,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: DarkTheme.borderSubtle,
  },
  detailsToggleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsToggleIcon: {
    fontSize: 20,
    marginRight: Spacing.sm,
  },
  detailsToggleText: {
    fontSize: Typography.body,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textSecondary,
  },
  detailsToggleChevron: {
    fontSize: 16,
    color: DarkTheme.textTertiary,
  },
  detailsSection: {
    backgroundColor: DarkTheme.cardBackgroundAlt,
    borderRadius: 12,
    padding: Spacing.cardPadding,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: DarkTheme.borderSubtle,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.cardMargin,
    borderBottomWidth: 1,
    borderBottomColor: DarkTheme.borderSubtle,
  },
  detailRowLabel: {
    fontSize: Typography.body,
    color: DarkTheme.textTertiary,
    fontWeight: Typography.weightMedium,
  },
  detailRowValue: {
    fontSize: Typography.h3,
    color: DarkTheme.textPrimary,
    fontWeight: Typography.weightBold,
  },
  detailNote: {
    fontSize: Typography.label,
    color: DarkTheme.textMuted,
    fontStyle: 'italic',
    marginTop: Spacing.lg,
    lineHeight: 18,
  },
  divineResonanceSection: {
    marginTop: Spacing.cardMargin,
  },
  bottomSpacer: {
    height: 20,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: DarkTheme.cardBackground,
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.cardMargin,
    borderTopWidth: 1,
    borderTopColor: DarkTheme.borderSubtle,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  analyzeButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  analyzeButtonDisabled: {
    opacity: 0.5,
  },
  analyzeButtonGradient: {
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  analyzeButtonText: {
    color: DarkTheme.textPrimary,
    fontSize: Typography.h3,
    fontWeight: Typography.weightBold,
  },
});
