/**
 * Name Destiny Results Screen - Premium Enhanced
 * Mobile-first dark theme with subtle personal element theming
 */

import { BalanceGuidanceCard, DestinyHeader, DominantElementCard, ElementHeroCard, ElementProgressBar, InfoNoticeCard, SacredNumberCard } from '@/components/nameDestiny';
import { QuranResonanceCard } from '@/components/quran/QuranResonanceCard';
import { useLanguage } from '@/contexts/LanguageContext';
import type { NameDestinyResult } from '@/features/name-destiny/types';
import { getQuranResonance, type QuranResonance } from '@/services/QuranResonanceService';
import { getElementFromString, getElementTheme } from '@/utils/elementTheme';
import { calculateLetterElementDistribution, getDominantElement } from '@/utils/relationshipCompatibility';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Calendar, Clock, HelpCircle, Sparkles, Star } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Format number with thousands separator
function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}

export default function ResultsScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const insets = useSafeAreaInsets();

  // Qur'anic Resonance state
  const [quranResonance, setQuranResonance] = useState<QuranResonance | null>(null);
  const [quranLoading, setQuranLoading] = useState(false);
  const [quranError, setQuranError] = useState<string | null>(null);

  const result: NameDestinyResult | null = params.data ? JSON.parse(params.data as string) : null;
  const personName = params.personName as string;
  const motherName = params.motherName as string;

  // Load Qur'anic Resonance on mount
  useEffect(() => {
    if (result?.personKabir) {
      loadQuranResonance();
    }
  }, [result?.personKabir, language]);

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
          <Text style={styles.errorText}>No results to display</Text>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  const elementType = getElementFromString(result.element?.en);
  const theme = getElementTheme(elementType);

  // Calculate letter-based element composition (distinct from Personal Element)
  const fullName = `${personName}${motherName ? ' ' + motherName : ''}`;
  const letterDistribution = calculateLetterElementDistribution(fullName);
  const dominantLetterElement = getDominantElement(letterDistribution);

  if (__DEV__) {
    console.log('[name-destiny/results] Displaying results:', {
      element: elementType,
      totalKabir: result.totalKabir,
      saghir: result.saghir,
      burj: result.burj?.en,
    });
  }

  return (
    <SafeAreaView style={styles.root}>
      <LinearGradient colors={['#0f172a', '#1e1b4b', '#312e81']} style={styles.gradient}>
        <DestinyHeader
          title="Your Destiny"
          onBack={() => router.back()}
          language={language === 'ar' ? 'en' : language}
          onLanguageChange={setLanguage}
        />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* New Calculation Button */}
          <TouchableOpacity
            style={styles.newCalcButton}
            onPress={() => router.back()}
            activeOpacity={0.75}
          >
            <Sparkles size={16} color="#a78bfa" strokeWidth={2.5} />
            <Text style={styles.newCalcText}>New Calculation</Text>
          </TouchableOpacity>

          {/* Hero Title */}
          <View style={styles.heroSection}>
            <Text style={styles.heroTitle}>✨ Your Destiny Revealed</Text>
            <Text style={styles.heroNames}>
              {personName} • {motherName}
            </Text>
          </View>

          {/* Sacred Numbers */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sacred Numbers</Text>
            <View style={styles.numbersRow}>
              <SacredNumberCard
                label="Total (Kabīr)"
                value={formatNumber(result.totalKabir)}
                description="Grand Total"
                gradientColors={['rgba(168, 85, 247, 0.25)', 'rgba(139, 92, 246, 0.15)']}
                accentColor="#a78bfa"
              />
              <SacredNumberCard
                label="Digital Root (Ṣaghīr)"
                value={result.saghir.toString()}
                description="Spiritual Essence"
                gradientColors={['rgba(236, 72, 153, 0.25)', 'rgba(219, 39, 119, 0.15)']}
                accentColor="#ec4899"
              />
            </View>
          </View>

          {/* Element Hero Card - PRIMARY FOCUS */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Personal Element</Text>
            <ElementHeroCard
              element={elementType}
              elementAr={result.element?.ar}
              elementFr={result.element?.fr}
            />
          </View>

          {/* Name Element Chart - LETTER-BASED COMPOSITION */}
          <View style={styles.section}>
            <View style={styles.chartHeaderContainer}>
              <Text style={styles.sectionTitle}>Name Element Chart</Text>
              <Text style={styles.chartSubtitle}>
                {language === 'ar'
                  ? 'التركيب العنصري بناءً على حروف اسمك'
                  : language === 'fr'
                  ? 'Composition élémentaire basée sur les lettres de votre nom'
                  : 'Elemental composition based on the letters of your name'}
              </Text>
            </View>

            {/* Element Progress Bars */}
            <View style={styles.chartBarsContainer}>
              <ElementProgressBar
                element="fire"
                percentage={letterDistribution.fire}
                isDominant={dominantLetterElement === 'fire'}
                language={language === 'ar' ? 'ar' : language === 'fr' ? 'fr' : 'en'}
              />
              <ElementProgressBar
                element="air"
                percentage={letterDistribution.air}
                isDominant={dominantLetterElement === 'air'}
                language={language === 'ar' ? 'ar' : language === 'fr' ? 'fr' : 'en'}
              />
              <ElementProgressBar
                element="water"
                percentage={letterDistribution.water}
                isDominant={dominantLetterElement === 'water'}
                language={language === 'ar' ? 'ar' : language === 'fr' ? 'fr' : 'en'}
              />
              <ElementProgressBar
                element="earth"
                percentage={letterDistribution.earth}
                isDominant={dominantLetterElement === 'earth'}
                language={language === 'ar' ? 'ar' : language === 'fr' ? 'fr' : 'en'}
              />
            </View>

            {/* Dominant Element Summary */}
            <DominantElementCard
              element={dominantLetterElement}
              percentage={letterDistribution[dominantLetterElement]}
              language={language === 'ar' ? 'ar' : language === 'fr' ? 'fr' : 'en'}
            />

            {/* Balance & Guidance */}
            <View style={{ marginTop: 14 }}>
              <BalanceGuidanceCard
                element={dominantLetterElement}
                language={language === 'ar' ? 'ar' : language === 'fr' ? 'fr' : 'en'}
              />
            </View>

            {/* Important Distinction Notice */}
            <View style={{ marginTop: 14 }}>
              <InfoNoticeCard language={language === 'ar' ? 'ar' : language === 'fr' ? 'fr' : 'en'} />
            </View>
          </View>

          {/* Zodiac Influence */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Zodiac Influence</Text>
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
                        <Text style={styles.infoLabel}>Ruling Planet</Text>
                        <Text style={styles.infoValue}>{result.burj.planet}</Text>
                      </View>
                    </View>
                  )}

                  {/* Day */}
                  {result.burjDay && (
                    <View style={styles.infoRow}>
                      <View style={styles.infoIcon}>
                        <Calendar size={14} color="#60a5fa" />
                      </View>
                      <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Day of Power</Text>
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
                        <View style={styles.labelWithTooltip}>
                          <Text style={styles.infoLabel}>Active Hour Planet</Text>
                          <HelpCircle size={12} color="#64748b" />
                        </View>
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
          </View>

          {/* Qur'anic Resonance */}
          <View style={styles.section}>
            <QuranResonanceCard
              resonance={quranResonance}
              loading={quranLoading}
              error={quranError || undefined}
              accentColor={theme.accentColor}
              language={language === 'ar' ? 'ar' : language === 'fr' ? 'fr' : 'en'}
              onRetry={loadQuranResonance}
            />
          </View>

          {/* Spiritual Guidance */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Spiritual Guidance</Text>
            <View style={styles.guidanceCard}>
              <LinearGradient
                colors={['rgba(30, 41, 59, 0.75)', 'rgba(15, 23, 42, 0.85)']}
                style={styles.cardGradient}
              >
                {/* Key Takeaways */}
                <View style={styles.takeawaysSection}>
                  <Text style={styles.takeawaysTitle}>Key Insights</Text>
                  <View style={styles.bulletPoint}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.bulletText}>
                      Your Kabir ({formatNumber(result.totalKabir)}) and Saghir ({result.saghir}) reveal your spiritual blueprint
                    </Text>
                  </View>
                  <View style={styles.bulletPoint}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.bulletText}>
                      {elementType} element connects you to specific practices and power times
                    </Text>
                  </View>
                  <View style={styles.bulletPoint}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.bulletText}>
                      {result.burj?.en} influence marks your most potent spiritual moments
                    </Text>
                  </View>
                </View>

                {/* Main Guidance */}
                <View style={styles.guidanceDivider} />
                <Text style={styles.guidanceText}>
                  Your destiny is encoded in the sacred numerology of your name. The Kabir represents
                  your overall spiritual journey, while the Saghir reveals your essential nature.
                  {'\n\n'}
                  Your {elementType} element provides guidance on spiritual practices and power times.
                  The {result.burj?.en} constellation and active planetary hour {result.hour?.name}{' '}
                  mark moments of heightened spiritual potential.
                  {'\n\n'}
                  Use this knowledge for self-understanding and spiritual growth. Remember: destiny is
                  a guide, not a fixed path. Your choices and devotion shape your journey.
                </Text>
              </LinearGradient>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              For reflection only • Not divination or legal ruling
            </Text>
          </View>

          <View style={{ height: Math.max(insets.bottom, 20) }} />
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
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  heroNames: {
    fontSize: 15,
    color: '#94a3b8',
    textAlign: 'center',
    fontWeight: '500',
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
  guidanceCard: {
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: 'rgba(30, 41, 59, 0.35)',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.12)',
  },
  takeawaysSection: {
    marginBottom: 16,
  },
  takeawaysTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#a78bfa',
    marginBottom: 12,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 10,
  },
  bullet: {
    fontSize: 16,
    color: '#a78bfa',
    fontWeight: '700',
    marginTop: 1,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 20,
  },
  guidanceDivider: {
    height: 1,
    backgroundColor: 'rgba(148, 163, 184, 0.15)',
    marginVertical: 16,
  },
  guidanceText: {
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
  errorText: {
    fontSize: 16,
    color: '#f87171',
    textAlign: 'center',
    marginTop: 40,
  },
  chartHeaderContainer: {
    marginBottom: 18,
  },
  chartSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
    lineHeight: 18,
  },
  chartBarsContainer: {
    marginBottom: 18,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.08)',
  },
});
