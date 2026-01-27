/**
 * Planetary Strength Analysis Component
 * ======================================
 * 
 * Displays classical Islamic astrology factors affecting planetary power:
 * - Degree strength (Quwwat al-Darajāt)
 * - Essential dignities (Al-Karāmāt al-Dhātīyah)
 * - Combustion rules (Al-Iḥtirāq)
 * - Retrograde status (Al-Rujūʿ)
 * 
 * Shows why a planet is weak/strong and what to do instead.
 */

import { DarkTheme, Spacing } from '@/constants/DarkTheme';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Planet } from '@/services/PlanetaryHoursService';
import {
    calculateEnhancedPlanetaryPower
} from '@/services/PlanetaryStrengthService';
import type { PlanetTransit, ZodiacSign } from '@/types/planetary-systems';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    View,
} from 'react-native';

// ============================================================================
// TYPES
// ============================================================================

export interface PlanetaryStrengthAnalysisProps {
  planet: Planet | string;
  transit?: PlanetTransit;
  sign?: ZodiacSign;
  degree?: number;
  longitude?: number;
  sunLongitude?: number;
  isRetrograde?: boolean;
  compact?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function PlanetaryStrengthAnalysis({
  planet: planetProp,
  transit,
  sign: signProp,
  degree: degreeProp,
  longitude: longitudeProp,
  sunLongitude = 0,
  isRetrograde: isRetrogradeProp,
  compact = false,
}: PlanetaryStrengthAnalysisProps) {
  const { t } = useLanguage();

  // Extract data from transit or individual props
  const planet = (planetProp || transit?.planet) as Planet;
  const sign = signProp || transit?.sign || 'aries';
  const degree = degreeProp ?? transit?.signDegree ?? 0;
  const longitude = longitudeProp ?? transit?.longitude ?? 0;
  const isRetrograde = isRetrogradeProp ?? transit?.isRetrograde ?? false;

  // Calculate enhanced power
  const analysis = useMemo(() => {
    return calculateEnhancedPlanetaryPower(
      planet,
      sign,
      degree,
      longitude,
      sunLongitude,
      isRetrograde
    );
  }, [planet, sign, degree, longitude, sunLongitude, isRetrograde]);

  // Determine color based on final power
  const powerColor = getPowerColor(analysis.finalPower);
  const isWeak = analysis.finalPower < 50;

  const getLocalizedPlanetName = (p: string) => {
    const key = p.toLowerCase();
    const translated = t(`dailyEnergy.planets.${key}`);
    return translated || p;
  };

  const getLocalizedDegreeQuality = (quality: string) => {
    const keyMap: Record<string, string> = {
      Weak: 'degreeWeak',
      Moderate: 'degreeModerate',
      Strong: 'degreeStrong',
      Weakening: 'degreeWeakening',
    };
    const key = keyMap[quality];
    return key ? t(`planetaryStrengthAnalysis.statuses.${key}`) : quality;
  };

  const getLocalizedDignityStatus = (status: string) => {
    const keyMap: Record<string, string> = {
      Domicile: 'dignityDomicile',
      Exalted: 'dignityExalted',
      Detriment: 'dignityDetriment',
      Fall: 'dignityFall',
      Neutral: 'dignityNeutral',
    };
    const key = keyMap[status];
    return key ? t(`planetaryStrengthAnalysis.statuses.${key}`) : status;
  };

  const getLocalizedCombustionStatus = (status: string) => {
    const keyMap: Record<string, string> = {
      clear: 'combustionClear',
      beams: 'combustionBeams',
      combust: 'combustionCombust',
    };
    const key = keyMap[status];
    return key ? t(`planetaryStrengthAnalysis.statuses.${key}`) : status;
  };

  const localizedDegreeDescription = (() => {
    const q = analysis.degreeInfo.quality;
    if (q === 'Weak') return t('dailyEnergy.breakdown.todaysRuler.degreeEarly', { degree: degree.toFixed(1) });
    if (q === 'Moderate') return t('dailyEnergy.breakdown.todaysRuler.degreeGaining', { degree: degree.toFixed(1) });
    if (q === 'Strong') return t('dailyEnergy.breakdown.todaysRuler.degreePeak', { degree: degree.toFixed(1) });
    if (q === 'Weakening') return t('dailyEnergy.breakdown.todaysRuler.degreeWeakening', { degree: degree.toFixed(1) });
    return analysis.degreeInfo.description;
  })();

  const localizedDignityDescription = (() => {
    const s = analysis.dignityInfo.status;
    if (s === 'Domicile') return t('dailyEnergy.breakdown.todaysRuler.dignityOwn');
    if (s === 'Exalted') return t('dailyEnergy.breakdown.todaysRuler.dignityExalted');
    if (s === 'Detriment') return t('dailyEnergy.breakdown.todaysRuler.dignityDetriment');
    if (s === 'Fall') return t('dailyEnergy.breakdown.todaysRuler.dignityFall');
    if (s === 'Neutral') return t('dailyEnergy.breakdown.todaysRuler.dignityNeutral');
    return analysis.dignityInfo.description;
  })();

  const localizedCombustionDescription = (() => {
    const s = analysis.combustionInfo.status;
    if (s === 'combust') return t('dailyEnergy.breakdown.todaysRuler.combust');
    if (s === 'beams') return t('dailyEnergy.breakdown.todaysRuler.beams');
    if (s === 'clear') return t('dailyEnergy.breakdown.todaysRuler.clear');
    return analysis.combustionInfo.description;
  })();

  const localizedRetrogradeDescription = isRetrograde
    ? t('dailyEnergy.breakdown.todaysRuler.retrograde')
    : analysis.retrogradeInfo.description;

  const localizedWarnings: string[] = (() => {
    const w: string[] = [];
    if (analysis.degreeInfo.quality === 'Weak') w.push(t('dailyEnergy.breakdown.todaysRuler.degreeEarly', { degree: degree.toFixed(1) }));
    if (analysis.dignityInfo.status === 'Fall') w.push(t('dailyEnergy.breakdown.todaysRuler.dignityFall'));
    if (analysis.dignityInfo.status === 'Detriment') w.push(t('dailyEnergy.breakdown.todaysRuler.dignityDetriment'));
    if (analysis.combustionInfo.status === 'combust') w.push(t('dailyEnergy.breakdown.todaysRuler.combust'));
    if (analysis.combustionInfo.status === 'beams') w.push(t('dailyEnergy.breakdown.todaysRuler.beams'));
    if (isRetrograde) w.push(t('dailyEnergy.breakdown.todaysRuler.retrograde'));
    return w;
  })();

  const localizedRecommendations: string[] = (() => {
    const recs: string[] = [];
    if (analysis.degreeInfo.quality === 'Strong') {
      recs.push(t('dailyEnergy.breakdown.todaysRuler.degreePeak', { degree: degree.toFixed(1) }));
    } else if (analysis.degreeInfo.quality === 'Moderate') {
      recs.push(t('dailyEnergy.breakdown.todaysRuler.degreeGaining', { degree: degree.toFixed(1) }));
    }

    if (analysis.dignityInfo.status === 'Exalted') recs.push(t('dailyEnergy.breakdown.todaysRuler.dignityExalted'));
    if (analysis.dignityInfo.status === 'Domicile') recs.push(t('dailyEnergy.breakdown.todaysRuler.dignityOwn'));

    if (isRetrograde) recs.push(t('planetaryStrengthAnalysis.suitability.innerWork'));
    return recs;
  })();

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <View style={styles.compactHeader}>
          <View style={[styles.powerBadge, { backgroundColor: `${powerColor}20` }]}>
            <Text style={[styles.powerValue, { color: powerColor }]}>
              {analysis.finalPower}%
            </Text>
          </View>
          <Text style={styles.compactLabel}>
            {getLocalizedPlanetName(planet)} @ {degree.toFixed(1)}° {sign}
          </Text>
        </View>

        {localizedWarnings.length > 0 && (
          <View style={styles.compactWarnings}>
            {localizedWarnings.slice(0, 2).map((warning, idx) => (
              <Text key={idx} style={styles.warningText}>
                • {warning}
              </Text>
            ))}
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header: Planet Name and Final Power */}
      <View style={styles.header}>
        <View>
          <Text style={styles.planetName}>
            {getLocalizedPlanetName(planet)} {isRetrograde && '℞'}
          </Text>
          <Text style={styles.position}>
            {degree.toFixed(1)}° {sign}
          </Text>
        </View>
        <LinearGradient
          colors={[`${powerColor}30`, `${powerColor}10`]}
          style={[styles.powerCard, { borderColor: powerColor }]}
        >
          <Text style={[styles.powerLabel, { color: powerColor }]}>
            {t('planetaryStrengthAnalysis.labels.power')}
          </Text>
          <Text style={[styles.powerValue, { color: powerColor }]}>
            {analysis.finalPower}%
          </Text>
        </LinearGradient>
      </View>

      {/* Formula Breakdown */}
      <View style={styles.formulaCard}>
        <Text style={styles.formulaTitle}>{t('planetaryStrengthAnalysis.labels.calculationBreakdown')}</Text>
        <View style={styles.formulaRow}>
          <FactorBadge label={t('planetaryStrengthAnalysis.labels.degree')} value={getLocalizedDegreeQuality(analysis.degreeInfo.quality)} score={analysis.degreeStrength * 100} />
          <Text style={styles.times}>×</Text>
          <FactorBadge label={t('planetaryStrengthAnalysis.labels.dignity')} value={getLocalizedDignityStatus(analysis.dignityInfo.status)} score={analysis.dignityModifier * 100} />
          <Text style={styles.times}>×</Text>
          <FactorBadge label={t('planetaryStrengthAnalysis.labels.combustion')} value={getLocalizedCombustionStatus(analysis.combustionInfo.status)} score={analysis.combustionModifier * 100} />
        </View>

        {isRetrograde && (
          <View style={[styles.formulaRow, { marginTop: Spacing.xs }]}>
            <Text style={styles.formulaText}>
              {t('planetaryStrengthAnalysis.formula.retrograde', {
                percent: Math.round(analysis.retrogradeModifier * 100),
              })}
            </Text>
          </View>
        )}

        <View style={[styles.formulaRow, { marginTop: Spacing.sm, paddingTop: Spacing.sm, borderTopWidth: 1, borderTopColor: DarkTheme.textTertiary }]}>
          <Text style={styles.formulaText}>
            {t('planetaryStrengthAnalysis.formula.finalPower', { value: analysis.finalPower })}
          </Text>
        </View>
      </View>

      {/* Degree Strength Detail */}
      <AnalysisCard
        title={t('planetaryStrengthAnalysis.cards.degreePosition')}
        icon="📍"
        analysis={{
          ...analysis.degreeInfo,
          quality: getLocalizedDegreeQuality(analysis.degreeInfo.quality),
          description: localizedDegreeDescription,
        }}
        color={getDegreeColor(analysis.degreeInfo.quality)}
      />

      {/* Essential Dignity Detail */}
      <AnalysisCard
        title={t('planetaryStrengthAnalysis.cards.essentialDignity')}
        icon="♔"
        analysis={{
          ...analysis.dignityInfo,
          status: getLocalizedDignityStatus(analysis.dignityInfo.status),
          description: localizedDignityDescription,
        }}
        color={getDignityColor(analysis.dignityInfo.status)}
      />

      {/* Combustion Detail */}
      {!['Sun', 'Moon'].includes(planet) && (
        <AnalysisCard
          title={t('planetaryStrengthAnalysis.cards.sunProximity')}
          icon="☀️"
          analysis={{
            ...analysis.combustionInfo,
            status: getLocalizedCombustionStatus(analysis.combustionInfo.status),
            description: localizedCombustionDescription,
          }}
          color={analysis.combustionInfo.isCombust ? '#ef4444' : '#8b7355'}
        />
      )}

      {/* Retrograde Detail */}
      {isRetrograde && (
        <View style={styles.retrogradeCard}>
          <View style={styles.retrogradeHeader}>
            <Text style={styles.retrogradeIcon}>℞</Text>
            <View>
              <Text style={styles.retrogradeTitle}>{t('planetaryStrengthAnalysis.cards.retrogradeMotion')}</Text>
              <Text style={styles.retrogradeSubtitle}>{t('planetaryStrengthAnalysis.suitability.limitedOuterWork')}</Text>
            </View>
          </View>
          <Text style={styles.retrogradeDescription}>
            {localizedRetrogradeDescription}
          </Text>
        </View>
      )}

      {/* Warnings */}
      {localizedWarnings.length > 0 && (
        <View style={styles.warningsContainer}>
          <Text style={styles.warningsTitle}>{t('planetaryStrengthAnalysis.sections.challengesTitle')}</Text>
          <FlatList
            data={localizedWarnings}
            renderItem={({ item }) => (
              <Text style={styles.warningItem}>• {item}</Text>
            )}
            scrollEnabled={false}
          />
        </View>
      )}

      {/* Recommendations */}
      {localizedRecommendations.length > 0 && (
        <View style={styles.recommendationsContainer}>
          <Text style={styles.recommendationsTitle}>{t('planetaryStrengthAnalysis.sections.recommendationsTitle')}</Text>
          <FlatList
            data={localizedRecommendations}
            renderItem={({ item }) => (
              <Text style={styles.recommendationItem}>• {item}</Text>
            )}
            scrollEnabled={false}
          />
        </View>
      )}

      {/* Suitability Guide */}
      <View style={styles.suitabilityContainer}>
        <View style={[styles.suitabilityRow, { opacity: analysis.suitability.outer ? 1 : 0.5 }]}>
          <Text style={styles.suitabilityIcon}>
            {analysis.suitability.outer ? '✓' : '✗'}
          </Text>
          <Text style={styles.suitabilityLabel}>{t('planetaryStrengthAnalysis.suitability.outerWork')}</Text>
        </View>
        <View style={[styles.suitabilityRow, { opacity: analysis.suitability.inner ? 1 : 0.5 }]}>
          <Text style={styles.suitabilityIcon}>
            {analysis.suitability.inner ? '✓' : '✗'}
          </Text>
          <Text style={styles.suitabilityLabel}>{t('planetaryStrengthAnalysis.suitability.innerWork')}</Text>
        </View>
      </View>
    </View>
  );
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

interface FactorBadgeProps {
  label: string;
  value: string;
  score: number;
}

function FactorBadge({ label, value, score }: FactorBadgeProps) {
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#60a5fa' : score >= 40 ? '#f59e0b' : '#ef4444';
  
  return (
    <View style={styles.factorBadge}>
      <Text style={styles.factorLabel}>{label}</Text>
      <View style={[styles.factorScore, { backgroundColor: `${color}20` }]}>
        <Text style={[styles.factorValue, { color }]}>
          {Math.round(score)}%
        </Text>
      </View>
      <Text style={styles.factorStatus}>{value}</Text>
    </View>
  );
}

interface AnalysisCardProps {
  title: string;
  icon: string;
  analysis: any; // DegreeStrengthInfo | DignityInfo | CombustionInfo
  color: string;
}

function AnalysisCard({ title, icon, analysis, color }: AnalysisCardProps) {
  return (
    <View style={[styles.detailCard, { borderLeftColor: color }]}>
      <View style={styles.detailHeader}>
        <Text style={styles.detailIcon}>{icon}</Text>
        <View>
          <Text style={styles.detailTitle}>{title}</Text>
          <Text style={[styles.detailStatus, { color }]}>
            {analysis.status || analysis.quality}
            {analysis.arabicTerm && ` - ${analysis.arabicTerm}`}
          </Text>
        </View>
      </View>
      <Text style={styles.detailDescription}>{analysis.description}</Text>
    </View>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  // Compact mode
  compactContainer: {
    backgroundColor: `${DarkTheme.cardBackground}dd`,
    borderRadius: 8,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  compactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  powerBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 6,
  },
  powerValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  compactLabel: {
    flex: 1,
    color: DarkTheme.textSecondary,
    fontSize: 13,
  },
  compactWarnings: {
    marginTop: Spacing.xs,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: `${DarkTheme.textTertiary}40`,
  },
  warningText: {
    color: DarkTheme.textTertiary,
    fontSize: 12,
    marginTop: 4,
  },

  // Main container
  container: {
    gap: Spacing.sm,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  planetName: {
    fontSize: 18,
    fontWeight: '700',
    color: DarkTheme.textPrimary,
  },
  position: {
    fontSize: 13,
    color: DarkTheme.textSecondary,
    marginTop: 2,
  },
  powerCard: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  powerLabel: {
    fontSize: 10,
    fontWeight: '600',
  },

  // Formula Card
  formulaCard: {
    backgroundColor: `${DarkTheme.cardBackground}dd`,
    borderRadius: 8,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  formulaTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: DarkTheme.textSecondary,
    marginBottom: Spacing.xs,
  },
  formulaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  times: {
    color: DarkTheme.textTertiary,
    fontSize: 14,
    fontWeight: '600',
  },
  formulaText: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
  },

  // Factor Badges
  factorBadge: {
    alignItems: 'center',
    flex: 1,
  },
  factorLabel: {
    fontSize: 10,
    color: DarkTheme.textTertiary,
    marginBottom: 2,
  },
  factorScore: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 2,
  },
  factorValue: {
    fontSize: 12,
    fontWeight: '600',
  },
  factorStatus: {
    fontSize: 9,
    color: DarkTheme.textTertiary,
  },

  // Detail Cards
  detailCard: {
    backgroundColor: `${DarkTheme.cardBackground}dd`,
    borderLeftWidth: 3,
    borderRadius: 8,
    padding: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  detailIcon: {
    fontSize: 20,
    marginRight: Spacing.xs,
  },
  detailTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: DarkTheme.textPrimary,
  },
  detailStatus: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: '500',
  },
  detailDescription: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
    lineHeight: 16,
  },

  // Retrograde Card
  retrogradeCard: {
    backgroundColor: `#8b735520`,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#8b7355',
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  retrogradeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  retrogradeIcon: {
    fontSize: 24,
  },
  retrogradeTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8b7355',
  },
  retrogradeSubtitle: {
    fontSize: 11,
    color: DarkTheme.textSecondary,
    marginTop: 2,
  },
  retrogradeDescription: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
    lineHeight: 16,
  },

  // Warnings Container
  warningsContainer: {
    backgroundColor: `#ef444420`,
    borderRadius: 8,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: '#ef4444',
  },
  warningsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ef4444',
    marginBottom: Spacing.xs,
  },
  warningItem: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
    marginBottom: 4,
    lineHeight: 16,
  },

  // Recommendations Container
  recommendationsContainer: {
    backgroundColor: `#10b98120`,
    borderRadius: 8,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: '#10b981',
  },
  recommendationsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#10b981',
    marginBottom: Spacing.xs,
  },
  recommendationItem: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
    marginBottom: 4,
    lineHeight: 16,
  },

  // Suitability Container
  suitabilityContainer: {
    backgroundColor: `${DarkTheme.cardBackground}dd`,
    borderRadius: 8,
    padding: Spacing.sm,
    gap: Spacing.xs,
  },
  suitabilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  suitabilityIcon: {
    fontSize: 18,
    width: 24,
    textAlign: 'center',
  },
  suitabilityLabel: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
    flex: 1,
  },
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getPowerColor(power: number): string {
  if (power >= 80) return '#10b981'; // Green - Excellent
  if (power >= 60) return '#60a5fa'; // Blue - Good
  if (power >= 40) return '#f59e0b'; // Amber - Moderate
  return '#ef4444'; // Red - Weak
}

function getDegreeColor(quality: string): string {
  const colors: Record<string, string> = {
    Strong: '#10b981',
    Moderate: '#60a5fa',
    Weak: '#f59e0b',
    Weakening: '#f59e0b',
  };
  return colors[quality] || '#8b7355';
}

function getDignityColor(status: string): string {
  const colors: Record<string, string> = {
    Exalted: '#10b981',
    Domicile: '#60a5fa',
    Neutral: '#f59e0b',
    Detriment: '#f59e0b',
    Fall: '#ef4444',
  };
  return colors[status] || '#8b7355';
}
