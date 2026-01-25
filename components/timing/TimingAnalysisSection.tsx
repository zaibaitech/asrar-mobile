/**
 * Timing Analysis Section Component
 * ==================================
 * Comprehensive timing intelligence display for detail screens.
 * Shows WHY the current timing is favorable/moderate/challenging,
 * provides actionable guidance, and helps users understand their
 * personalized spiritual timing.
 * 
 * Used on:
 * - Daily Energy Detail Screen
 * - Manazil Detail Screen  
 * - Moment Alignment Detail Screen
 * - Planet Transit Detail Screen
 */

import { Borders, DarkTheme, Spacing } from '@/constants/DarkTheme';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProfile } from '@/contexts/ProfileContext';
import {
    analyzeTimingForPractice,
    buildCurrentMoment,
    findNextOptimalWindow,
    profileToSpiritualProfile,
    type AsrariyaTimingResult,
    type CurrentMoment,
    type PracticeCategory,
    type RecommendationLevel
} from '@/services/AsrariyaTimingEngine';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

// ============================================================================
// TYPES
// ============================================================================

export type AnalysisContext = 'daily' | 'manazil' | 'moment' | 'transit' | 'general';

export interface TimingAnalysisSectionProps {
  /** Analysis context determines category weighting and recommendations */
  context: AnalysisContext;
  
  /** Optional specific practice category override */
  practiceCategory?: PracticeCategory;
  
  /** Optional pre-built moment (for testing or when already calculated) */
  moment?: CurrentMoment;
  
  /** Show compact version */
  compact?: boolean;
  
  /** Hide specific sections */
  hideSections?: ('breakdown' | 'guidance' | 'enhancements' | 'alternatives')[];
  
  /** Location for accurate calculations */
  location?: { latitude: number; longitude: number };
  
  /** Callback when analysis completes */
  onAnalysisComplete?: (result: AsrariyaTimingResult) => void;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const CONTEXT_TO_CATEGORY: Record<AnalysisContext, PracticeCategory> = {
  daily: 'general',
  manazil: 'guidance',
  moment: 'general',
  transit: 'manifestation',
  general: 'general',
};

const LEVEL_CONFIG: Record<RecommendationLevel, {
  icon: string;
  color: string;
  gradient: readonly [string, string];
  badge: string;
  label: { en: string; fr: string; ar: string };
}> = {
  'highly-favorable': {
    icon: '✨',
    color: '#10b981',
    gradient: ['#10b98120', '#10b98108'] as const,
    badge: 'OPTIMAL',
    label: { en: 'Optimal', fr: 'Optimal', ar: 'مثالي' },
  },
  'favorable': {
    icon: '🌟',
    color: '#60A5FA',
    gradient: ['#60A5FA20', '#60A5FA08'] as const,
    badge: 'ACT',
    label: { en: 'Good Time', fr: 'Bon Moment', ar: 'وقت جيد' },
  },
  'moderate': {
    icon: '⚖️',
    color: '#f59e0b',
    gradient: ['#f59e0b20', '#f59e0b08'] as const,
    badge: 'MAINTAIN',
    label: { en: 'Maintain', fr: 'Maintenir', ar: 'حافظ' },
  },
  'cautious': {
    icon: '⚠️',
    color: '#f97316',
    gradient: ['#f9731620', '#f9731608'] as const,
    badge: 'CAREFUL',
    label: { en: 'Careful', fr: 'Prudence', ar: 'حذر' },
  },
  'challenging': {
    icon: '⏸️',
    color: '#7C3AED',
    gradient: ['#7C3AED20', '#7C3AED08'] as const,
    badge: 'HOLD',
    label: { en: 'Hold', fr: 'Attendre', ar: 'توقف' },
  },
};

const LAYER_LABELS: Record<string, { en: string; fr: string; ar: string; icon: string }> = {
  elementCompatibility: {
    en: 'Element Harmony',
    fr: 'Harmonie élémentaire',
    ar: 'انسجام العناصر',
    icon: '🔮',
  },
  planetaryResonance: {
    en: 'Planetary Resonance',
    fr: 'Résonance planétaire',
    ar: 'رنين كوكبي',
    icon: '🪐',
  },
  manazilAlignment: {
    en: 'Manazil Alignment',
    fr: 'Alignement des Manazil',
    ar: 'محاذاة المنازل',
    icon: '🌙',
  },
  practiceMapping: {
    en: 'Practice Suitability',
    fr: 'Adéquation pratique',
    ar: 'ملاءمة الممارسة',
    icon: '📿',
  },
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function TimingAnalysisSection({
  context,
  practiceCategory,
  moment: providedMoment,
  compact = false,
  hideSections = [],
  location,
  onAnalysisComplete,
}: TimingAnalysisSectionProps) {
  const { t, language } = useLanguage();
  const { profile } = useProfile();

  const onAnalysisCompleteRef = useRef(onAnalysisComplete);
  useEffect(() => {
    onAnalysisCompleteRef.current = onAnalysisComplete;
  }, [onAnalysisComplete]);

  const stableLocation = useMemo(() => {
    if (!location) return undefined;
    if (typeof location.latitude !== 'number' || typeof location.longitude !== 'number') return undefined;
    return { latitude: location.latitude, longitude: location.longitude };
  }, [location?.latitude, location?.longitude]);
  
  const [result, setResult] = useState<AsrariyaTimingResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorKey, setErrorKey] = useState<'unableToCalculateTiming' | null>(null);
  // Default to expanded for better UX - users should see reasoning immediately
  const [expandedSection, setExpandedSection] = useState<string | null>('breakdown');
  const [nextWindow, setNextWindow] = useState<{ startTime: Date; description: string } | null>(null);

  const resultRef = useRef<AsrariyaTimingResult | null>(null);
  useEffect(() => {
    resultRef.current = result;
  }, [result]);

  const analysisInFlightRef = useRef(false);

  const category = practiceCategory || CONTEXT_TO_CATEGORY[context];
  const lang = (language || 'en') as 'en' | 'fr' | 'ar';

  const headerTitle = useMemo(() => {
    const labels = {
      daily: { en: 'Daily Overview', fr: 'Aperçu du jour', ar: 'نظرة يومية' },
      manazil: { en: 'Timing Analysis', fr: 'Analyse du timing', ar: 'تحليل التوقيت' },
      moment: { en: 'Timing Analysis', fr: 'Analyse du timing', ar: 'تحليل التوقيت' },
      transit: { en: 'Timing Analysis', fr: 'Analyse du timing', ar: 'تحليل التوقيت' },
      general: { en: 'Timing Analysis', fr: 'Analyse du timing', ar: 'تحليل التوقيت' },
    } as const;
    return labels[context][lang];
  }, [context, lang]);

  const actionLabelOverride = useMemo(() => {
    const labels = {
      proceed: { en: null, fr: null, ar: null },
      'proceed-with-care': { en: 'Proceed Mindfully', fr: 'Avancer avec attention', ar: 'تابع بوعي' },
      modify: { en: 'Adjust Practice', fr: 'Ajuster la pratique', ar: 'عدّل الممارسة' },
      wait: { en: 'Wait if Possible', fr: 'Attendre si possible', ar: 'انتظر إن أمكن' },
    } as const;
    return labels;
  }, []);

  const runAnalysis = useCallback(async () => {
    if (!profile) {
      setLoading(false);
      setRefreshing(false);
      return;
    }

    if (analysisInFlightRef.current) return;
    analysisInFlightRef.current = true;

    const shouldBlockUI = !resultRef.current;
    if (shouldBlockUI) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }
    setErrorKey(null);

    try {
      // Build spiritual profile from user profile
      const spiritualProfile = profileToSpiritualProfile(profile);
      
      // Build or use provided moment
      const builtMoment = providedMoment || await buildCurrentMoment(stableLocation);
      // Daily context should not mix "Daily" title with hourly-only analysis.
      // We intentionally analyze the day ruler as a day-level overview.
      const currentMoment: CurrentMoment =
        context === 'daily' && !providedMoment
          ? {
              ...builtMoment,
              planetaryHourPlanet: builtMoment.dayRuler,
              planetaryHourElement: builtMoment.dayElement,
              planetaryHourRemainingSeconds: 0,
            }
          : builtMoment;
      
      // Run full analysis
      const analysisResult = await analyzeTimingForPractice(
        spiritualProfile,
        { category },
        { location: stableLocation, moment: currentMoment, language: lang }
      );
      
      setResult(analysisResult);
      onAnalysisCompleteRef.current?.(analysisResult);
      
      // Find next optimal window if current is suboptimal
      if (analysisResult.overallScore < 60) {
        const next = await findNextOptimalWindow(
          spiritualProfile,
          { category },
          { location: stableLocation, lookAheadHours: 12, minimumScore: 70, language: lang }
        );
        if (next) {
          setNextWindow({ startTime: next.startTime, description: next.description });
        }
      }
    } catch (err) {
      console.error('[TimingAnalysis] Error:', err);
      setErrorKey('unableToCalculateTiming');
    } finally {
      analysisInFlightRef.current = false;
      if (shouldBlockUI) {
        setLoading(false);
      } else {
        setRefreshing(false);
      }
    }
  }, [profile, providedMoment, stableLocation, category, lang]);

  useEffect(() => {
    runAnalysis();
  }, [runAnalysis]);

  // Loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#8B7355" />
        <Text style={styles.loadingText}>
          {t('asrariya.analyzing')}
        </Text>
      </View>
    );
  }

  // No profile
  if (!profile) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>👤</Text>
        <Text style={styles.emptyText}>
          {t('asrariya.noProfile')}
        </Text>
      </View>
    );
  }

  // Error state
  if (errorKey || !result) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorText}>
          {errorKey
            ? t(`asrariya.errors.${errorKey}`)
            : t('asrariya.errors.unableToLoadAnalysis')}
        </Text>
        <TouchableOpacity onPress={runAnalysis} style={styles.retryButton}>
          <Text style={styles.retryText}>{t('common.retry')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const levelConfig = LEVEL_CONFIG[result.level];
  const actionOverride = actionLabelOverride[result.action]?.[lang] ?? null;
  const displayLevelLabel = actionOverride || levelConfig.label[lang];

  return (
    <View style={styles.container}>
      {/* Header with Score */}
      <LinearGradient
        colors={levelConfig.gradient}
        style={styles.headerCard}
      >
        <View style={styles.headerRow}>
          <View style={styles.scoreSection}>
            <Text style={styles.scoreIcon}>{levelConfig.icon}</Text>
            <View style={styles.scoreTextContainer}>
              <Text style={styles.sectionTitle}>
                {headerTitle}
              </Text>
              <Text style={[styles.levelLabel, { color: levelConfig.color }]}>
                {displayLevelLabel}
              </Text>
            </View>
          </View>
          <View style={[styles.scoreBadge, { borderColor: levelConfig.color }]}>
            <Text style={[styles.scoreValue, { color: levelConfig.color }]}>
              {result.overallScore}%
            </Text>
          </View>
        </View>
        
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${result.overallScore}%`, backgroundColor: levelConfig.color }
              ]} 
            />
          </View>
        </View>

        {/* Short Summary */}
          <Text style={styles.summaryText}>
            {result.action === 'proceed-with-care' ? (lang === 'fr' ? 'Quelques signaux demandent de la prudence.' : lang === 'ar' ? 'بعض الإشارات تتطلب الحذر.' : 'Some signals suggest extra care.') : result.shortSummary}
          </Text>
      </LinearGradient>

      {/* Layer Breakdown */}
      {!hideSections.includes('breakdown') && (
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.sectionHeader}
            onPress={() => setExpandedSection(expandedSection === 'breakdown' ? null : 'breakdown')}
          >
            <View style={styles.sectionHeaderLeft}>
              <Ionicons name="analytics-outline" size={18} color="#8B7355" />
              <Text style={styles.sectionHeaderText}>
                {t('asrariya.whyThisRating')}
              </Text>
            </View>
            <Ionicons 
              name={expandedSection === 'breakdown' ? 'chevron-up' : 'chevron-down'} 
              size={20} 
              color={DarkTheme.textSecondary} 
            />
          </TouchableOpacity>

          {(expandedSection === 'breakdown' || !compact) && (
            <View style={styles.breakdownContainer}>
              {Object.entries(result.layers).map(([key, layer]) => {
                const layerLabel = LAYER_LABELS[key];
                const scoreColor = layer.score >= 70 ? '#10b981' : layer.score >= 40 ? '#f59e0b' : '#ef4444';
                
                return (
                  <View key={key} style={styles.layerRow}>
                    <View style={styles.layerInfo}>
                      <Text style={styles.layerIcon}>{layerLabel.icon}</Text>
                      <View style={styles.layerTextContainer}>
                        <Text style={styles.layerName}>{layerLabel[lang]}</Text>
                        <Text style={styles.layerReasoning} numberOfLines={2}>
                          {lang === 'ar'
                            ? (layer.reasoningAr || layer.reasoning)
                            : lang === 'fr'
                              ? (layer.reasoningFr || layer.reasoning)
                              : layer.reasoning}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.layerScoreContainer}>
                      <View style={styles.miniProgressTrack}>
                        <View 
                          style={[
                            styles.miniProgressFill, 
                            { width: `${layer.score}%`, backgroundColor: scoreColor }
                          ]} 
                        />
                      </View>
                      <Text style={[styles.layerScore, { color: scoreColor }]}>
                        {layer.score}%
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      )}

      {/* Detailed Reasoning */}
      {!hideSections.includes('guidance') && (
        <View style={styles.section}>
          <View style={styles.guidanceHeader}>
            <Text style={styles.guidanceIcon}>🎯</Text>
            <Text style={styles.guidanceTitle}>
              {t('asrariya.whatThisMeans')}
            </Text>
          </View>
          <Text style={styles.reasoningText}>{result.reasoning}</Text>
          
          {/* Actions based on level */}
          <View style={styles.actionsContainer}>
            {/* Recommended Actions */}
            {result.enhancements.length > 0 && !hideSections.includes('enhancements') && (
              <View style={styles.actionList}>
                <Text style={styles.actionListTitle}>
                  ✅ {t('asrariya.recommended')}
                </Text>
                {result.enhancements.slice(0, 4).map((enh, idx) => (
                  <View key={idx} style={styles.actionItem}>
                    <Text style={styles.actionIcon}>{enh.icon || '•'}</Text>
                    <Text style={styles.actionText}>
                      {lang === 'ar' && enh.textAr ? enh.textAr : 
                       lang === 'fr' && enh.textFr ? enh.textFr : enh.text}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Cautions */}
            {result.cautions.length > 0 && (
              <View style={styles.actionList}>
                <Text style={[styles.actionListTitle, { color: '#f97316' }]}>
                  ⚠️ {t('asrariya.cautions')}
                </Text>
                {result.cautions.slice(0, 3).map((caution, idx) => (
                  <View key={idx} style={styles.actionItem}>
                    <Text style={styles.actionIcon}>•</Text>
                    <Text style={[styles.actionText, { color: DarkTheme.textSecondary }]}>
                      {caution}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      )}

      {/* Better Timing Suggestion */}
      {!hideSections.includes('alternatives') && nextWindow && result.overallScore < 60 && (
        <View style={[styles.section, styles.alternativeSection]}>
          <View style={styles.alternativeHeader}>
            <Ionicons name="time-outline" size={18} color="#60A5FA" />
            <Text style={styles.alternativeTitle}>
              {t('asrariya.betterTiming')}
            </Text>
          </View>
          <Text style={styles.alternativeText}>
            {nextWindow.description}
          </Text>
          <Text style={styles.alternativeTime}>
            {nextWindow.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      )}

      {/* Optimal Window End */}
      {result.optimalWindowEnd && result.overallScore >= 70 && (
        <View style={[styles.section, styles.windowSection]}>
          <View style={styles.windowHeader}>
            <Ionicons name="hourglass-outline" size={16} color="#10b981" />
            <Text style={styles.windowText}>
              {t('asrariya.optimalUntil')}{' '}
              <Text style={styles.windowTime}>
                {result.optimalWindowEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

// ============================================================================
// COMPACT VARIANT - For inline use in widgets
// ============================================================================

export function TimingAnalysisCompact({
  context,
  practiceCategory,
  location,
}: Pick<TimingAnalysisSectionProps, 'context' | 'practiceCategory' | 'location'>) {
  return (
    <TimingAnalysisSection
      context={context}
      practiceCategory={practiceCategory}
      location={location}
      compact
      hideSections={['alternatives', 'enhancements']}
    />
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  
  // Loading/Empty/Error states
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
    gap: 8,
  },
  loadingText: {
    color: DarkTheme.textSecondary,
    fontSize: 13,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: Spacing.xl,
    gap: 8,
  },
  emptyIcon: {
    fontSize: 24,
  },
  emptyText: {
    color: DarkTheme.textSecondary,
    fontSize: 13,
    textAlign: 'center',
  },
  errorContainer: {
    alignItems: 'center',
    padding: Spacing.lg,
    gap: 8,
  },
  errorIcon: {
    fontSize: 20,
  },
  errorText: {
    color: DarkTheme.textSecondary,
    fontSize: 13,
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(139, 115, 85, 0.2)',
    borderRadius: 8,
  },
  retryText: {
    color: '#8B7355',
    fontSize: 13,
    fontWeight: '500',
  },

  // Header Card
  headerCard: {
    borderRadius: Borders.radiusMd,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  scoreSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  scoreIcon: {
    fontSize: 28,
  },
  scoreTextContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  levelLabel: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 2,
  },
  scoreBadge: {
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: '700',
  },

  // Progress bar
  progressContainer: {
    marginTop: 12,
  },
  progressTrack: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  summaryText: {
    marginTop: 12,
    fontSize: 14,
    color: DarkTheme.textPrimary,
    lineHeight: 20,
  },

  // Section
  section: {
    backgroundColor: 'rgba(30, 20, 36, 0.6)',
    borderRadius: Borders.radiusMd,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: DarkTheme.textPrimary,
  },

  // Breakdown
  breakdownContainer: {
    padding: Spacing.md,
    gap: 12,
  },
  layerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  layerInfo: {
    flexDirection: 'row',
    flex: 1,
    gap: 8,
  },
  layerIcon: {
    fontSize: 16,
    marginTop: 2,
  },
  layerTextContainer: {
    flex: 1,
  },
  layerName: {
    fontSize: 13,
    fontWeight: '600',
    color: DarkTheme.textPrimary,
  },
  layerReasoning: {
    fontSize: 11,
    color: DarkTheme.textTertiary,
    marginTop: 2,
    lineHeight: 15,
  },
  layerScoreContainer: {
    alignItems: 'flex-end',
    gap: 4,
  },
  miniProgressTrack: {
    width: 50,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  miniProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  layerScore: {
    fontSize: 12,
    fontWeight: '600',
  },

  // Guidance
  guidanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: Spacing.md,
    paddingBottom: 0,
  },
  guidanceIcon: {
    fontSize: 16,
  },
  guidanceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: DarkTheme.textPrimary,
  },
  reasoningText: {
    fontSize: 13,
    color: DarkTheme.textSecondary,
    lineHeight: 20,
    padding: Spacing.md,
    paddingTop: 8,
  },

  // Actions
  actionsContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    paddingTop: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    gap: 16,
  },
  actionList: {
    gap: 6,
  },
  actionListTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10b981',
    marginBottom: 4,
  },
  actionItem: {
    flexDirection: 'row',
    gap: 8,
    paddingLeft: 4,
  },
  actionIcon: {
    fontSize: 12,
    color: DarkTheme.textTertiary,
    marginTop: 2,
  },
  actionText: {
    flex: 1,
    fontSize: 13,
    color: DarkTheme.textPrimary,
    lineHeight: 18,
  },

  // Alternative timing
  alternativeSection: {
    borderColor: 'rgba(96, 165, 250, 0.2)',
    backgroundColor: 'rgba(96, 165, 250, 0.08)',
  },
  alternativeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: Spacing.md,
    paddingBottom: 4,
  },
  alternativeTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#60A5FA',
  },
  alternativeText: {
    fontSize: 13,
    color: DarkTheme.textSecondary,
    paddingHorizontal: Spacing.md,
    lineHeight: 18,
  },
  alternativeTime: {
    fontSize: 15,
    fontWeight: '600',
    color: DarkTheme.textPrimary,
    padding: Spacing.md,
    paddingTop: 8,
  },

  // Optimal window
  windowSection: {
    borderColor: 'rgba(16, 185, 129, 0.2)',
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    padding: Spacing.md,
  },
  windowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  windowText: {
    fontSize: 13,
    color: DarkTheme.textSecondary,
  },
  windowTime: {
    fontWeight: '600',
    color: '#10b981',
  },
});

export default TimingAnalysisSection;
