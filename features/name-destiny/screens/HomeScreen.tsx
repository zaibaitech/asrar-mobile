/**
 * Name Destiny Screen - Input & Analysis
 * Mobile Implementation - Expo Go 54
 */

import ArabicKeyboard from '@/components/istikhara/ArabicKeyboard';
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

          {/* Results Section */}
          {result && (
            <View style={styles.resultsSection}>
              <Text style={styles.resultsTitle}>✨ Your Spiritual Destiny</Text>
              
              <LinearGradient
                colors={['#4f46e5', '#7c3aed']}
                style={styles.resultCard}
              >
                <Text style={styles.resultLabel}>Name</Text>
                <Text style={styles.resultValue}>{result.personName}</Text>
                {result.motherName && (
                  <>
                    <Text style={[styles.resultLabel, styles.mtSmall]}>Mother's Name</Text>
                    <Text style={styles.resultValue}>{result.motherName}</Text>
                  </>
                )}
              </LinearGradient>

              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <Text style={styles.statLabel}>Total Kabir</Text>
                  <Text style={styles.statValue}>{result.totalKabir}</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statLabel}>Saghir</Text>
                  <Text style={styles.statValue}>{result.saghir}</Text>
                </View>
              </View>

              <View style={styles.elementCard}>
                <Text style={styles.elementLabel}>Element</Text>
                <Text style={styles.elementValue}>{result.element.en}</Text>
                <Text style={styles.elementArabic}>{result.element.ar}</Text>
              </View>

              <View style={styles.burjCard}>
                <Text style={styles.burjLabel}>Zodiac Sign</Text>
                <Text style={styles.burjValue}>{result.burj.en}</Text>
                <Text style={styles.burjArabic}>{result.burj.ar}</Text>
                <Text style={styles.burjPlanet}>Planet: {result.burj.planet}</Text>
              </View>

              <View style={styles.hourCard}>
                <Text style={styles.hourLabel}>Planetary Hour</Text>
                <Text style={styles.hourValue}>{result.hour.name}</Text>
                <Text style={styles.hourArabic}>{result.hour.ar}</Text>
              </View>

              {/* Divine Resonance */}
              {result.divineResonance && (
                <View style={styles.divineResonanceSection}>
                  <DivineResonanceCard resonance={result.divineResonance} />
                </View>
              )}
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
    backgroundColor: DarkTheme.cardBackground,
    marginTop: Spacing.cardMargin,
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.sectionGap,
  },
  resultsTitle: {
    fontSize: Typography.h2,
    fontWeight: Typography.weightBold,
    color: DarkTheme.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  resultCard: {
    padding: Spacing.cardPadding,
    borderRadius: 16,
    marginBottom: Spacing.lg,
  },
  resultLabel: {
    fontSize: Typography.label,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: Typography.weightSemibold,
    textTransform: 'uppercase',
  },
  resultValue: {
    fontSize: 24,
    color: DarkTheme.textPrimary,
    fontWeight: Typography.weightBold,
    marginTop: 4,
  },
  mtSmall: {
    marginTop: Spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.cardMargin,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: DarkTheme.cardBackgroundAlt,
    padding: Spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: DarkTheme.borderSubtle,
  },
  statLabel: {
    fontSize: Typography.label,
    color: DarkTheme.textTertiary,
    fontWeight: Typography.weightSemibold,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 28,
    color: ElementAccents.fire.primary,
    fontWeight: Typography.weightBold,
  },
  elementCard: {
    backgroundColor: DarkTheme.cardBackgroundAlt,
    padding: Spacing.cardPadding,
    borderRadius: 12,
    marginBottom: Spacing.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: ElementAccents.air.primary,
  },
  elementLabel: {
    fontSize: Typography.label,
    color: ElementAccents.air.primary,
    fontWeight: Typography.weightSemibold,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  elementValue: {
    fontSize: 26,
    color: DarkTheme.textPrimary,
    fontWeight: Typography.weightBold,
  },
  elementArabic: {
    fontSize: Typography.h3,
    color: ElementAccents.air.secondary,
    marginTop: 4,
  },
  burjCard: {
    backgroundColor: DarkTheme.cardBackgroundAlt,
    padding: Spacing.cardPadding,
    borderRadius: 12,
    marginBottom: Spacing.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: ElementAccents.earth.primary,
  },
  burjLabel: {
    fontSize: Typography.label,
    color: ElementAccents.earth.primary,
    fontWeight: Typography.weightSemibold,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  burjValue: {
    fontSize: 26,
    color: DarkTheme.textPrimary,
    fontWeight: Typography.weightBold,
  },
  burjArabic: {
    fontSize: Typography.h3,
    color: ElementAccents.earth.secondary,
    marginTop: 4,
  },
  burjPlanet: {
    fontSize: Typography.label,
    color: DarkTheme.textTertiary,
    marginTop: Spacing.sm,
    fontWeight: Typography.weightMedium,
  },
  hourCard: {
    backgroundColor: DarkTheme.cardBackgroundAlt,
    padding: Spacing.cardPadding,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: ElementAccents.water.primary,
  },
  hourLabel: {
    fontSize: Typography.label,
    color: ElementAccents.water.primary,
    fontWeight: Typography.weightSemibold,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  hourValue: {
    fontSize: 26,
    color: DarkTheme.textPrimary,
    fontWeight: Typography.weightBold,
  },
  hourArabic: {
    fontSize: Typography.h3,
    color: ElementAccents.water.secondary,
    marginTop: 4,
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
