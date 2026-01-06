/**
 * Name Destiny Results Screen - Enhanced UX
 * Staged revelation with beginner-friendly presentation
 */

import { AIBadge } from '@/components/divine-timing/AIBadge';
import {
    AccordionSection,
    DestinyHeader,
    ElementHeroCard,
    ElementProgressBar,
    InfoNoticeCard,
    KeyTakeawaysCard,
    PracticalGuidanceCard,
    SacredNumberCard
} from '@/components/nameDestiny';
import { QuranResonanceCard } from '@/components/quran/QuranResonanceCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProfile } from '@/contexts/ProfileContext';
import { DivineResonanceCard } from '@/features/name-destiny/components';
import type { NameDestinyResult } from '@/features/name-destiny/types';
import { InputType, UnderstandingLevel } from '@/features/name-destiny/types/enums';
import { generateKeyTakeaways } from '@/features/name-destiny/utils/takeawayGenerator';
import { enhanceNameDestinyWithAI, isAIAvailable, loadAISettings } from '@/services/AIReflectionService';
import { getQuranResonance, type QuranResonance } from '@/services/QuranResonanceService';
import { getBalancingActions, getPracticalGuidance } from '@/utils/elementBalancing';
import { getElementFromString, getElementTheme } from '@/utils/elementTheme';
import { calculateLetterElementDistribution, getDominantElement } from '@/utils/relationshipCompatibility';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AlertCircle, Calendar, Clock, HelpCircle, Sparkles, Star } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * Alignment mode configuration
 * If true: Best Time day will match Power Day (from Burj ruler)
 * If false: Best Time follows element-based schedule independently
 */
const ALIGN_BEST_TIME_WITH_POWER_DAY = false;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

// Format number with thousands separator
function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}

// Get friendly label for input type
function getInputTypeLabel(
  inputType: InputType,
  language: 'en' | 'fr' | 'ar'
): string {
  const labels = {
    en: {
      [InputType.NAME_PERSON]: 'Name only',
      [InputType.NAME_MOTHER_PAIR]: 'Name + Mother (Lineage)',
      [InputType.DIVINE_NAME]: 'Divine Name',
      [InputType.QURAN_VERSE]: 'Quranic Verse',
      [InputType.SENTENCE]: 'Sentence/Phrase',
      [InputType.FREE_TEXT]: 'Free Text',
    },
    fr: {
      [InputType.NAME_PERSON]: 'Nom seulement',
      [InputType.NAME_MOTHER_PAIR]: 'Nom + Mère (Lignée)',
      [InputType.DIVINE_NAME]: 'Nom Divin',
      [InputType.QURAN_VERSE]: 'Verset Coranique',
      [InputType.SENTENCE]: 'Phrase',
      [InputType.FREE_TEXT]: 'Texte Libre',
    },
    ar: {
      [InputType.NAME_PERSON]: 'الاسم فقط',
      [InputType.NAME_MOTHER_PAIR]: 'الاسم + الأم (النسب)',
      [InputType.DIVINE_NAME]: 'الاسم الإلهي',
      [InputType.QURAN_VERSE]: 'آية قرآنية',
      [InputType.SENTENCE]: 'جملة',
      [InputType.FREE_TEXT]: 'نص حر',
    },
  };
  return labels[language][inputType] || labels.en[inputType];
}

// Compute dominant and weak elements from composition
function computeDominantAndWeakElements(composition: {
  fire: number;
  air: number;
  water: number;
  earth: number;
}): {
  dominant: { element: string; percentage: number };
  weak: { element: string; percentage: number };
} {
  const total = composition.fire + composition.air + composition.water + composition.earth;
  const percentages = {
    fire: (composition.fire / total) * 100,
    air: (composition.air / total) * 100,
    water: (composition.water / total) * 100,
    earth: (composition.earth / total) * 100,
  };

  const sorted = Object.entries(percentages).sort((a, b) => b[1] - a[1]);
  
  return {
    dominant: {
      element: sorted[0][0].charAt(0).toUpperCase() + sorted[0][0].slice(1),
      percentage: Math.round(sorted[0][1]),
    },
    weak: {
      element: sorted[sorted.length - 1][0].charAt(0).toUpperCase() + sorted[sorted.length - 1][0].slice(1),
      percentage: Math.round(sorted[sorted.length - 1][1]),
    },
  };
}

/**
 * Get Best Time Window based on element and optionally aligned with Power Day
 * @param dominantElement - The dominant element type
 * @param powerDay - The power day from Burj ruler (e.g., "Sunday")
 * @param language - Display language
 * @returns Best time window string with day, time of day, and season
 */
function getBestTimeWindow(
  dominantElement: 'Fire' | 'Air' | 'Water' | 'Earth',
  powerDay: string | undefined,
  language: 'en' | 'fr' | 'ar'
): string {
  // Get the base best time from element (contains day + time + season)
  const elementGuidance = getPracticalGuidance(dominantElement, language);
  const baseBestTime = elementGuidance.bestTime;

  // If alignment is disabled or no power day, return as-is
  if (!ALIGN_BEST_TIME_WITH_POWER_DAY || !powerDay) {
    return baseBestTime;
  }

  // Replace the day in bestTime with powerDay
  // Pattern: "DayName at/morning/evening/night • Season"
  // We need to extract everything after the day
  
  const dayMapping: Record<string, { en: string; fr: string; ar: string }> = {
    Sunday: { en: 'Sunday', fr: 'Dimanche', ar: 'الأحد' },
    Monday: { en: 'Monday', fr: 'Lundi', ar: 'الإثنين' },
    Tuesday: { en: 'Tuesday', fr: 'Mardi', ar: 'الثلاثاء' },
    Wednesday: { en: 'Wednesday', fr: 'Mercredi', ar: 'الأربعاء' },
    Thursday: { en: 'Thursday', fr: 'Jeudi', ar: 'الخميس' },
    Friday: { en: 'Friday', fr: 'Vendredi', ar: 'الجمعة' },
    Saturday: { en: 'Saturday', fr: 'Samedi', ar: 'السبت' },
  };

  const translatedPowerDay = dayMapping[powerDay]?.[language] || powerDay;

  // Extract time of day and season from baseBestTime
  // English pattern: "Day at time • season"
  // French pattern: "Jour au/matin/soir • saison"
  // Arabic pattern: "اليوم في/صباحًا/مساءً • الموسم"
  
  const parts = baseBestTime.split(/(?:at |au |في |morning|matin|صباحًا|evening|soir|مساءً|night|nuit|ليلاً)/);
  const timeAndSeasonPart = baseBestTime.substring(baseBestTime.indexOf(' '));

  return `${translatedPowerDay}${timeAndSeasonPart}`;
}

export default function ResultsScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const { profile } = useProfile();
  const insets = useSafeAreaInsets();

  // Qur'anic Resonance state
  const [quranResonance, setQuranResonance] = useState<QuranResonance | null>(null);
  const [quranLoading, setQuranLoading] = useState(false);
  const [quranError, setQuranError] = useState<string | null>(null);

  // AI Enhancement state
  const [aiEnhanced, setAiEnhanced] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiElementExplanation, setAiElementExplanation] = useState('');
  const [aiBurjExplanation, setAiBurjExplanation] = useState('');
  const [aiPersonalizedInsight, setAiPersonalizedInsight] = useState<string | undefined>();
  const [aiAvailable, setAiAvailable] = useState(false);

  const result: NameDestinyResult | null = params.data ? JSON.parse(params.data as string) : null;
  const personName = params.personName as string;
  const motherName = params.motherName as string;
  const inputType = (params.inputType as InputType) || InputType.NAME_MOTHER_PAIR;
  const understandingLevel =
    (params.understandingLevel as UnderstandingLevel) || UnderstandingLevel.BEGINNER;

  // Check AI availability on mount
  useEffect(() => {
    checkAIAvailability();
  }, []);

  const checkAIAvailability = async () => {
    const available = await isAIAvailable();
    setAiAvailable(available);
  };

  // Load Qur'anic Resonance on mount
  useEffect(() => {
    if (result?.personKabir) {
      loadQuranResonance();
    }
  }, [result?.personKabir, language]);

  const handleEnhanceWithAI = async () => {
    if (!result || aiLoading || aiEnhanced) return;

    setAiLoading(true);
    try {
      const settings = await loadAISettings();
      
      const response = await enhanceNameDestinyWithAI({
        element: result.element?.en || '',
        burj: result.burj?.en || '',
        planetaryRuler: result.burj?.planet,
        userElement: profile.derived?.element,
        userBurj: profile.derived?.burj,
        userLocationCity: profile.location?.label,
        tone: settings.tone,
        language: language === 'ar' ? 'ar' : language === 'fr' ? 'fr' : 'en',
      });

      if (response.aiAssisted) {
        setAiEnhanced(true);
        setAiElementExplanation(response.elementExplanation);
        setAiBurjExplanation(response.burjExplanation);
        setAiPersonalizedInsight(response.personalizedInsight);
      }
    } catch (error) {
      if (__DEV__) {
        console.error('[AI Enhancement] Failed:', error);
      }
    } finally {
      setAiLoading(false);
    }
  };

  const loadQuranResonance = async () => {
    setQuranLoading(true);
    setQuranError(null);
    try {
      const resonance = await getQuranResonance(
        result!.personKabir, // ✅ Use personKabir instead of totalKabir to match web app
        language === 'ar' ? 'ar' : language === 'fr' ? 'fr' : 'en'
      );
      setQuranResonance(resonance);
    } catch (err) {
      console.error('[QuranResonance] Failed to load:', err);
      setQuranError('Failed to load verse');
    } finally {
      setQuranLoading(false);
    }
  };

  if (!result) {
    return (
      <SafeAreaView style={styles.root}>
        <LinearGradient colors={['#0f172a', '#1e1b4b', '#312e81']} style={styles.gradient}>
          <View style={styles.errorContainer}>
            <AlertCircle size={48} color="#ef4444" />
            <Text style={styles.errorText}>{t('nameDestiny.results.noResults')}</Text>
            <TouchableOpacity onPress={() => router.back()} style={styles.errorButton}>
              <Text style={styles.errorButtonText}>{t('nameDestiny.results.goBack')}</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  const elementType = getElementFromString(result.element?.en);
  const theme = getElementTheme(elementType);

  // Calculate letter-based element composition
  const fullName = `${personName}${motherName ? ' ' + motherName : ''}`;
  const letterDistribution = calculateLetterElementDistribution(fullName);
  const dominantLetterElement = getDominantElement(letterDistribution);

  // Find the weakest element for balancing tips
  const elementEntries = Object.entries(letterDistribution) as [
    'fire' | 'air' | 'water' | 'earth',
    number
  ][];
  const sortedElements = elementEntries.sort((a, b) => a[1] - b[1]);
  const weakestElement = sortedElements[0][0];
  const weakestElementType =
    weakestElement.charAt(0).toUpperCase() + weakestElement.slice(1);

  // Generate content
  const lang = language === 'ar' ? 'ar' : language === 'fr' ? 'fr' : 'en';
  const keyTakeaways = generateKeyTakeaways(
    result.totalKabir,
    result.saghir,
    elementType,
    result.burj?.en || 'Pisces',
    inputType,
    lang
  );
  const balancingActions = getBalancingActions(
    weakestElementType as any,
    lang
  );
  const practicalGuidance = getPracticalGuidance(elementType, lang);
  
  // Get best time window (optionally aligned with power day)
  const bestTimeWindow = getBestTimeWindow(
    elementType,
    result.burjDay?.en,
    lang
  );

  // Compute dominant and weak elements for composition summary
  const elementStats = computeDominantAndWeakElements(letterDistribution);

  // Determine what sections to show based on understanding level
  const showAdvanced = understandingLevel !== UnderstandingLevel.BEGINNER;
  const showClassical = understandingLevel === UnderstandingLevel.CLASSICAL;

  if (__DEV__) {
    console.log('[name-destiny/results] Displaying results:', {
      element: elementType,
      totalKabir: result.totalKabir,
      saghir: result.saghir,
      burj: result.burj?.en,
      inputType,
      understandingLevel,
    });
  }

  return (
    <SafeAreaView style={styles.root}>
      <LinearGradient colors={['#0f172a', '#1e1b4b', '#312e81']} style={styles.gradient}>
        {/* 1) Header */}
        <DestinyHeader
          title={t('nameDestiny.results.yourResults')}
          onBack={() => router.back()}
          language={language === 'ar' ? 'en' : language}
          onLanguageChange={setLanguage}
        />

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 24 }, // Safe area + buffer
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* New Calculation Button */}
          <TouchableOpacity
            style={styles.newCalcButton}
            onPress={() => router.back()}
            activeOpacity={0.75}
          >
            <Sparkles size={16} color="#a78bfa" strokeWidth={2.5} />
            <Text style={styles.newCalcText}>
              {t('nameDestiny.results.newCalculation')}
            </Text>
          </TouchableOpacity>

          {/* 2) Identity Summary Card */}
          <View style={styles.identityCard}>
            <Text style={styles.identityName}>✨ {personName}</Text>
            {motherName && <Text style={styles.identityMother}>{motherName}</Text>}
            
            {/* MAGHRIBI SYSTEM Badge */}
            <View style={styles.maghribiBadge}>
              <Text style={styles.maghribiText}>MAGHRIBI SYSTEM</Text>
            </View>
            
            {/* Calculation Context Chip */}
            <View style={styles.contextChip}>
              <Text style={styles.contextText}>
                {getInputTypeLabel(inputType, lang)} • Abjad Kabīr + Ṣaghīr
              </Text>
            </View>
          </View>

          {/* 3) Sacred Numbers */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('nameDestiny.results.sacredNumbers')}
            </Text>
            <View style={styles.numbersRow}>
              <SacredNumberCard
                label={
                  showClassical
                    ? t('nameDestiny.results.kabir')
                    : t('nameDestiny.results.total')
                }
                value={formatNumber(result.totalKabir)}
                description={t('nameDestiny.results.completSum')}
                gradientColors={['rgba(168, 85, 247, 0.25)', 'rgba(139, 92, 246, 0.15)']}
                accentColor="#a78bfa"
              />
              <SacredNumberCard
                label={
                  showClassical
                    ? t('nameDestiny.results.saghir')
                    : t('nameDestiny.results.essence')
                }
                value={result.saghir.toString()}
                description={t('nameDestiny.results.digitalRoot')}
                gradientColors={['rgba(236, 72, 153, 0.25)', 'rgba(219, 39, 119, 0.15)']}
                accentColor="#ec4899"
              />
            </View>
          </View>

          {/* 4) Your Personal Element (Ṭabʿ) */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('nameDestiny.results.yourPersonalElement')}
            </Text>
            <ElementHeroCard
              element={elementType}
              elementAr={result.element?.ar}
              elementFr={result.element?.fr}
            />

            {/* AI Enhancement Button */}
            {aiAvailable && !aiEnhanced && (
              <TouchableOpacity
                style={styles.aiEnhanceButton}
                onPress={handleEnhanceWithAI}
                disabled={aiLoading}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={['rgba(139, 115, 85, 0.3)', 'rgba(139, 115, 85, 0.15)']}
                  style={styles.aiEnhanceGradient}
                >
                  <Sparkles size={18} color="#8B7355" />
                  <Text style={styles.aiEnhanceText}>
                    {aiLoading
                      ? t('nameDestiny.results.enhancing')
                      : t('nameDestiny.results.personalizeExplanation')}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            )}

            {/* AI Enhanced Content */}
            {aiEnhanced && aiElementExplanation && (
              <View style={styles.aiEnhancedCard}>
                <View style={styles.aiEnhancedHeader}>
                  <Sparkles size={16} color="#8B7355" />
                  <Text style={styles.aiEnhancedTitle}>
                    {t('nameDestiny.results.enhancedExplanation')}
                  </Text>
                  <AIBadge size="small" />
                </View>
                <Text style={styles.aiEnhancedText}>{aiElementExplanation}</Text>
                
                {aiPersonalizedInsight && (
                  <View style={styles.personalizedInsightCard}>
                    <Text style={styles.personalizedInsightLabel}>
                      {t('nameDestiny.results.personalizedInsight')}
                    </Text>
                    <Text style={styles.personalizedInsightText}>{aiPersonalizedInsight}</Text>
                  </View>
                )}
              </View>
            )}
          </View>

          {/* Divine Name Resonance */}
          {result.divineResonance && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {language === 'ar'
                  ? 'رنين الاسم الإلهي'
                  : language === 'fr'
                  ? 'Résonance du Nom Divin'
                  : 'Divine Name Resonance'}
              </Text>
              <Text style={styles.sectionExplainer}>
                {language === 'ar'
                  ? 'الاسم الإلهي الذي يتردد صداه مع اسمك'
                  : language === 'fr'
                  ? 'Le Nom Divin qui résonne avec votre nom'
                  : 'The Divine Name that resonates with your name'}
              </Text>
              <DivineResonanceCard resonance={result.divineResonance} />
            </View>
          )}

          {/* 5) Elemental Composition with Dominance Summary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {language === 'ar'
                ? 'التكوين العنصري'
                : language === 'fr'
                ? 'Composition Élémentaire'
                : 'Elemental Composition'}
            </Text>
            <Text style={styles.sectionExplainer}>
              {language === 'ar'
                ? 'بناءً على الحروف في اسمك (التعبير الخارجي).'
                : language === 'fr'
                ? 'Basé sur les lettres de votre nom (expression extérieure).'
                : 'Based on letters in your name (outward expression).'}
            </Text>
            
            {/* Dominance Summary */}
            <View style={styles.dominanceSummary}>
              <Text style={styles.dominanceText}>
                <Text style={styles.dominanceLabel}>
                  {t('nameDestiny.results.dominantExpression')}
                </Text>
                <Text style={[styles.dominanceValue, { color: getElementTheme(elementStats.dominant.element as any).accentColor }]}>
                  {elementStats.dominant.element} ({elementStats.dominant.percentage}%)
                </Text>
              </Text>
              <Text style={styles.dominanceText}>
                <Text style={styles.dominanceLabel}>
                  {t('nameDestiny.results.weakElement')}
                </Text>
                <Text style={[styles.dominanceValue, { color: getElementTheme(elementStats.weak.element as any).accentColor }]}>
                  {elementStats.weak.element} ({elementStats.weak.percentage}%)
                </Text>
              </Text>
            </View>

            {/* Element Bars */}
            <View style={styles.elementBars}>
              {Object.entries(letterDistribution).map(([element, count]) => {
                const total =
                  letterDistribution.fire +
                  letterDistribution.air +
                  letterDistribution.water +
                  letterDistribution.earth;
                const percentage = Math.round((count / total) * 100);
                const isDominant = element === elementStats.dominant.element.toLowerCase();
                
                return (
                  <ElementProgressBar
                    key={element}
                    element={element as 'fire' | 'air' | 'water' | 'earth'}
                    percentage={percentage}
                    isDominant={isDominant}
                    language={lang}
                  />
                );
              })}
            </View>
          </View>

          {/* 6) Balancing Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('nameDestiny.results.balancingActions')}
            </Text>
            <Text style={styles.sectionExplainer}>
              {language === 'ar'
                ? `لتقوية ${weakestElementType} (العنصر الأضعف):`
                : language === 'fr'
                ? `Pour renforcer ${weakestElementType} (l'élément faible) :`
                : `To strengthen ${weakestElementType} (weakest element):`}
            </Text>
            <View style={styles.balancingList}>
              {balancingActions.map((action, index) => (
                <View key={index} style={styles.balancingItem}>
                  <View style={styles.balancingBullet} />
                  <Text style={styles.balancingText}>{action}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* 7) Zodiac Influence */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('nameDestiny.results.zodiacInfluence')}
            </Text>
            <Text style={styles.sectionExplainer}>
              {t('nameDestiny.results.zodiacInfluenceSubtitle')}
            </Text>
            
            {/* Helper Caption */}
            <View style={styles.helperCaption}>
              <HelpCircle size={14} color="#94a3b8" strokeWidth={2} />
              <Text style={styles.helperCaptionText}>
                {t('nameDestiny.results.zodiacInfluenceTooltip')}
              </Text>
            </View>

            <View style={[styles.zodiacCard, { borderColor: `${theme.accentColor}40` }]}>
              <View style={[styles.topAccent, { backgroundColor: theme.accentColor }]} />
              <LinearGradient
                colors={['rgba(30, 41, 59, 0.85)', 'rgba(15, 23, 42, 0.9)']}
                style={styles.cardGradient}
              >
                {/* Zodiac Header */}
                <View style={styles.zodiacHeader}>
                  <View style={styles.zodiacIconCircle}>
                    <Star size={32} color="#fbbf24" fill="#fbbf24" strokeWidth={1.5} />
                  </View>
                  <View style={styles.zodiacInfo}>
                    <Text style={styles.zodiacName}>{result.burj?.en || 'Pisces'}</Text>
                    <Text style={styles.zodiacArabic}>{result.burj?.ar || 'الحوت'}</Text>
                  </View>
                </View>

                {/* Zodiac Details */}
                <View style={styles.zodiacDetails}>
                  {/* Ruling Planet */}
                  {result.burj?.planet && (
                    <View style={styles.infoRow}>
                      <View style={styles.infoIcon}>
                        <Star size={14} color="#fbbf24" />
                      </View>
                      <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>
                          {t('nameDestiny.results.rulingPlanet')}
                        </Text>
                        <Text style={styles.infoValue}>{result.burj.planet}</Text>
                      </View>
                    </View>
                  )}

                  {/* Power Day (Burj Ruler) */}
                  {result.burjDay && (
                    <View style={styles.infoRow}>
                      <View style={styles.infoIcon}>
                        <Calendar size={14} color="#60a5fa" />
                      </View>
                      <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>
                          {t('nameDestiny.results.dayOfPower')}
                        </Text>
                        <Text style={styles.infoValue}>
                          {result.burjDay.en}{' '}
                          <Text style={styles.infoValueAr}>({result.burjDay.ar})</Text>
                        </Text>
                      </View>
                    </View>
                  )}

                  {/* Active Hour Planet */}
                  {result.hour && (
                    <View style={styles.infoRow}>
                      <View style={styles.infoIcon}>
                        <Clock size={14} color="#a78bfa" />
                      </View>
                      <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>
                          {t('nameDestiny.results.activeHourPlanet')}
                        </Text>
                        <Text style={styles.infoValue}>
                          {result.hour.name}{' '}
                          <Text style={styles.infoValueAr}>({result.hour.ar})</Text>
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              </LinearGradient>
            </View>

            {/* AI Enhanced Burj Explanation */}
            {aiEnhanced && aiBurjExplanation && (
              <View style={styles.aiEnhancedCard}>
                <View style={styles.aiEnhancedHeader}>
                  <Sparkles size={16} color="#fbbf24" />
                  <Text style={styles.aiEnhancedTitle}>
                    {t('nameDestiny.results.burjInsight')}
                  </Text>
                  <AIBadge size="small" />
                </View>
                <Text style={styles.aiEnhancedText}>{aiBurjExplanation}</Text>
              </View>
            )}
          </View>

          {/* 8) Qur'anic Resonance with Reflection Prompt */}
          <View style={styles.section}>
            <QuranResonanceCard
              resonance={quranResonance}
              loading={quranLoading}
              error={quranError || undefined}
              accentColor={theme.accentColor}
              language={lang}
              onRetry={loadQuranResonance}
            />
            {quranResonance && (
              <View style={styles.reflectionPrompt}>
                <HelpCircle size={16} color="#a78bfa" strokeWidth={2} />
                <Text style={styles.reflectionText}>
                  {t('nameDestiny.results.reflectionPrompt')}
                </Text>
              </View>
            )}
          </View>

          {/* 9) Key Takeaways + Practical Guidance - MOVED HERE */}
          <View style={styles.section}>
            <KeyTakeawaysCard takeaways={keyTakeaways} language={lang} />
          </View>

          <View style={styles.section}>
            <PracticalGuidanceCard
              doActions={practicalGuidance.doActions}
              avoidActions={practicalGuidance.avoidActions}
              bestTime={bestTimeWindow}
              language={lang}
            />
          </View>

          {/* 10) Advanced/Classical Sections - LAST */}
          {showAdvanced && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {t('nameDestiny.results.advancedContent')}
              </Text>

              <AccordionSection
                title={t('nameDestiny.results.classicalDetails')}
                subtitle={t('nameDestiny.results.classicalDetailsSubtitle')}
                defaultOpen={showClassical}
                accentColor="#a78bfa"
              >
                <View style={styles.advancedContent}>
                  <View style={styles.advancedRow}>
                    <Text style={styles.advancedLabel}>Tab Index (Ṭabʿ):</Text>
                    <Text style={styles.advancedValue}>
                      {result.tabIndex || 'N/A'} → {result.element?.en}
                    </Text>
                  </View>
                  <View style={styles.advancedRow}>
                    <Text style={styles.advancedLabel}>Burj Index:</Text>
                    <Text style={styles.advancedValue}>
                      {result.burjIndex || 'N/A'}/12 → {result.burj?.en}
                    </Text>
                  </View>
                  <View style={styles.advancedRow}>
                    <Text style={styles.advancedLabel}>{t('nameDestiny.results.personKabir')}</Text>
                    <Text style={styles.advancedValue}>{formatNumber(result.personKabir)}</Text>
                  </View>
                  {result.motherKabir > 0 && (
                    <View style={styles.advancedRow}>
                      <Text style={styles.advancedLabel}>{t('nameDestiny.results.motherKabir')}</Text>
                      <Text style={styles.advancedValue}>{formatNumber(result.motherKabir)}</Text>
                    </View>
                  )}
                  <View style={styles.advancedRow}>
                    <Text style={styles.advancedLabel}>{t('nameDestiny.results.divisibleBy4')}</Text>
                    <Text style={styles.advancedValue}>
                      {result.totalKabir % 4 === 0 ? t('nameDestiny.results.yes') : t('nameDestiny.results.no')}
                    </Text>
                  </View>
                  <View style={styles.advancedRow}>
                    <Text style={styles.advancedLabel}>{t('nameDestiny.results.divisibleBy12')}</Text>
                    <Text style={styles.advancedValue}>
                      {result.totalKabir % 12 === 0 ? t('nameDestiny.results.yes') : t('nameDestiny.results.no')}
                    </Text>
                  </View>
                </View>
              </AccordionSection>

              <AccordionSection
                title={t('nameDestiny.results.deepInterpretation')}
                subtitle={t('nameDestiny.results.deepInterpretationSubtitle')}
                defaultOpen={false}
                accentColor="#ec4899"
              >
                <View style={styles.advancedContent}>
                  <Text style={styles.advancedText}>
                    {language === 'ar'
                      ? 'هذا القسم محجوز للتفسير الكلاسيكي المتقدم للسر (الجوهر الخفي)، البسط (التوسع)، والكمال (الكمال). قد يتم إضافة حسابات إضافية في التحديثات المستقبلية.'
                      : language === 'fr'
                      ? 'Cette section est réservée à l\'interprétation classique avancée de Sirr (essence cachée), Basṭ (expansion) et Kamāl (perfection). Des calculs supplémentaires peuvent être ajoutés dans les futures mises à jour.'
                      : 'This section is reserved for advanced classical interpretation of Sirr (hidden essence), Basṭ (expansion), and Kamāl (perfection). Additional calculations may be added in future updates.'}
                  </Text>
                </View>
              </AccordionSection>
            </View>
          )}

          {/* Distinction Notice */}
          <View style={styles.section}>
            <InfoNoticeCard language={lang} />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {t('nameDestiny.results.disclaimer')}
            </Text>
          </View>
        </ScrollView>
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
  scrollContent: {
    paddingBottom: 16,
  },
  newCalcButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 12,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    backgroundColor: 'rgba(167, 139, 250, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.25)',
  },
  newCalcText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#a78bfa',
    letterSpacing: 0.3,
  },
  heroSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#94a3b8',
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 12,
  },
  identityCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 18,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.25)',
    alignItems: 'center',
    gap: 10,
  },
  identityName: {
    fontSize: 26,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  identityMother: {
    fontSize: 18,
    color: '#94a3b8',
    textAlign: 'center',
    fontWeight: '500',
  },
  maghribiBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    marginTop: 4,
  },
  maghribiText: {
    fontSize: 11,
    color: '#a78bfa',
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  contextChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: 'rgba(100, 116, 139, 0.15)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  contextText: {
    fontSize: 12,
    color: '#cbd5e1',
    fontWeight: '600',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  sectionExplainer: {
    fontSize: 13,
    color: '#94a3b8',
    marginBottom: 12,
    marginTop: -8,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  helperCaption: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 14,
    padding: 10,
    backgroundColor: 'rgba(148, 163, 184, 0.08)',
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#94a3b8',
  },
  helperCaptionText: {
    flex: 1,
    fontSize: 12,
    color: '#94a3b8',
    lineHeight: 17,
  },
  dominanceSummary: {
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.1)',
  },
  dominanceText: {
    fontSize: 14,
    lineHeight: 20,
  },
  dominanceLabel: {
    color: '#94a3b8',
    fontWeight: '600',
  },
  dominanceValue: {
    fontWeight: '700',
    fontSize: 15,
  },
  elementBars: {
    gap: 10,
  },
  balancingList: {
    gap: 10,
  },
  balancingItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.08)',
  },
  balancingBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#a78bfa',
    marginTop: 6,
  },
  balancingText: {
    flex: 1,
    fontSize: 14,
    color: '#e2e8f0',
    lineHeight: 20,
  },
  reflectionPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 12,
    padding: 12,
    backgroundColor: 'rgba(167, 139, 250, 0.08)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.15)',
  },
  reflectionText: {
    flex: 1,
    fontSize: 13,
    color: '#cbd5e1',
    lineHeight: 19,
    fontStyle: 'italic',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 16,
  },
  errorText: {
    fontSize: 18,
    color: '#f87171',
    textAlign: 'center',
    fontWeight: '600',
  },
  errorButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: 'rgba(167, 139, 250, 0.2)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#a78bfa',
  },
  errorButtonText: {
    fontSize: 16,
    color: '#a78bfa',
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: 14,
    letterSpacing: 0.3,
  },
  numbersRow: {
    flexDirection: 'row',
    gap: 12,
  },
  zodiacCard: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(30, 41, 59, 0.4)',
    borderWidth: 1.5,
  },
  topAccent: {
    height: 3,
  },
  cardGradient: {
    padding: 20,
  },
  zodiacHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 18,
  },
  zodiacIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(251, 191, 36, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(251, 191, 36, 0.25)',
  },
  zodiacInfo: {
    flex: 1,
  },
  zodiacName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#f1f5f9',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  zodiacArabic: {
    fontSize: 18,
    color: '#cbd5e1',
    fontWeight: '600',
  },
  zodiacDetails: {
    gap: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.08)',
  },
  infoIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(148, 163, 184, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  infoContent: {
    flex: 1,
  },
  labelWithTooltip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  infoLabel: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
    marginBottom: 4,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 15,
    color: '#f1f5f9',
    fontWeight: '600',
  },
  infoValueAr: {
    fontSize: 16,
    color: '#cbd5e1',
  },
  advancedContent: {
    gap: 12,
  },
  advancedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.1)',
  },
  advancedLabel: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '600',
  },
  advancedValue: {
    fontSize: 14,
    color: '#f1f5f9',
    fontWeight: '600',
  },
  advancedText: {
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  
  // AI Enhancement styles
  aiEnhanceButton: {
    marginTop: 16,
    overflow: 'hidden',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 115, 85, 0.3)',
  },
  aiEnhanceGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 8,
  },
  aiEnhanceText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#8B7355',
  },
  aiEnhancedCard: {
    marginTop: 16,
    backgroundColor: 'rgba(139, 115, 85, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(139, 115, 85, 0.2)',
  },
  aiEnhancedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  aiEnhancedTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B7355',
    flex: 1,
  },
  aiEnhancedText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#e2e8f0',
  },
  personalizedInsightCard: {
    marginTop: 12,
    padding: 12,
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#fbbf24',
  },
  personalizedInsightLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fbbf24',
    marginBottom: 6,
  },
  personalizedInsightText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#f1f5f9',
  },
});
