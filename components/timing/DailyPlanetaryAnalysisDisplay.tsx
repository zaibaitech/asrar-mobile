/**
 * Daily Planetary Analysis Display Component
 * ===========================================
 * 
 * Shows enhanced classical astrology factors for each planet
 * Displays why some planets are strong/weak and what to use instead
 */

import { DarkTheme, Spacing } from '@/constants/DarkTheme';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDailyPlanetaryAnalysis } from '@/hooks/useDailyPlanetaryAnalysis';
import { getDayRulerImpactOnDailyScore } from '@/services/DayRulingPlanetService';
import type { Planet } from '@/services/PlanetaryHoursService';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export interface DailyPlanetaryAnalysisDisplayProps {
  /** Show compact or expanded view */
  expanded?: boolean;

  /** Optional override for Moon strength percentage (0-100). */
  moonStrengthOverride?: number;
}

/**
 * Display panel showing today's planetary strength analysis
 */
export function DailyPlanetaryAnalysisDisplay({
  expanded = false,
  moonStrengthOverride,
}: DailyPlanetaryAnalysisDisplayProps) {
  const { t } = useLanguage();
  const { analysis: rawAnalysis, dailyScore, bestHours, loading, error, refresh } =
    useDailyPlanetaryAnalysis();

  const analysis = React.useMemo(() => {
    if (!rawAnalysis) return null;
    if (typeof moonStrengthOverride !== 'number' || Number.isNaN(moonStrengthOverride)) {
      return rawAnalysis;
    }

    const moon = rawAnalysis.planets?.Moon;
    if (!moon) return rawAnalysis;

    const clampedMoon = Math.max(0, Math.min(100, Math.round(moonStrengthOverride)));

    return {
      ...rawAnalysis,
      planets: {
        ...rawAnalysis.planets,
        Moon: {
          ...moon,
          finalPower: clampedMoon,
        },
      },
    };
  }, [rawAnalysis, moonStrengthOverride]);

  const [expandedPlanet, setExpandedPlanet] = React.useState<Planet | null>(null);

  const getQualityKeyFromStrength = (
    strength: number
  ): 'excellent' | 'good' | 'moderate' | 'weak' | 'veryWeak' => {
    if (strength >= 80) return 'excellent';
    if (strength >= 60) return 'good';
    if (strength >= 40) return 'moderate';
    if (strength >= 20) return 'weak';
    return 'veryWeak';
  };

  const getLocalizedPlanetName = (planet: string) => {
    const key = planet.toLowerCase();
    const translated = t(`dailyEnergy.planets.${key}`);
    return translated || planet;
  };

  const getLocalizedQualityLabel = (strength: number) => {
    const key = getQualityKeyFromStrength(strength);
    return t(`dailyEnergy.planetaryStrength.qualities.${key}`);
  };

  const getLocalizedBestHourQuality = (quality: 'excellent' | 'good' | 'moderate') => {
    if (quality === 'excellent') return t('dailyEnergy.planetaryStrength.qualities.excellent');
    if (quality === 'good') return t('dailyEnergy.planetaryStrength.qualities.good');
    return t('dailyEnergy.planetaryStrength.qualities.moderate');
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

  const getLocalizedPlanetWarnings = (planetData: any): string[] => {
    const warnings: string[] = [];

    const degree: number = typeof planetData?.degree === 'number' ? planetData.degree : 0;
    const degreeQuality: string | undefined = planetData?.degreeInfo?.quality;
    if (degreeQuality === 'Weak') {
      warnings.push(t('dailyEnergy.breakdown.todaysRuler.degreeEarly', { degree: degree.toFixed(1) }));
    }

    const dignityStatus: string | undefined = planetData?.dignityInfo?.status;
    if (dignityStatus === 'Fall') warnings.push(t('dailyEnergy.breakdown.todaysRuler.dignityFall'));
    if (dignityStatus === 'Detriment') warnings.push(t('dailyEnergy.breakdown.todaysRuler.dignityDetriment'));

    const combustionStatus: string | undefined = planetData?.combustionInfo?.status;
    if (combustionStatus === 'combust') warnings.push(t('dailyEnergy.breakdown.todaysRuler.combust'));
    if (combustionStatus === 'beams') warnings.push(t('dailyEnergy.breakdown.todaysRuler.beams'));

    if (planetData?.retrogradeInfo?.suitable?.outer === false) {
      warnings.push(t('dailyEnergy.breakdown.todaysRuler.retrograde'));
    }

    return warnings;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Ionicons name="planet-outline" size={20} color="#8B7355" />
          <Text style={styles.title}>{t('dailyEnergy.planetaryStrength.title')}</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#8B7355" />
        </View>
      </View>
    );
  }

  if (error || !analysis) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Ionicons name="alert-circle-outline" size={20} color="#ef4444" />
          <Text style={styles.title}>{t('dailyEnergy.planetaryStrength.dataUnavailableTitle')}</Text>
        </View>
        <Text style={styles.errorText}>{t('dailyEnergy.planetaryStrength.unableToLoadData')}</Text>
        <TouchableOpacity onPress={refresh} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>{t('common.retry')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const localizedRecommendations: string[] = (() => {
    const recs: string[] = [];

    // Day ruler guidance
    if (analysis.dayRulingPlanet && typeof analysis.dayRulingStrength === 'number') {
      const key = getQualityKeyFromStrength(analysis.dayRulingStrength);
      const adviceKeyMap: Record<string, string> = {
        excellent: 'veryStrong',
        good: 'strong',
        moderate: 'moderate',
        weak: 'weak',
        veryWeak: 'veryWeak',
      };

      const adviceKey = adviceKeyMap[key];
      if (adviceKey) {
        recs.push(
          t(`dailyEnergy.planetaryStrength.rulerAdvice.${adviceKey}`, {
            planet: getLocalizedPlanetName(analysis.dayRulingPlanet),
          })
        );
      }
    }

    // Best planets
    if (analysis.bestForGeneralWork) {
      const power = analysis.planets?.[analysis.bestForGeneralWork]?.finalPower;
      if (typeof power === 'number') {
        recs.push(
          t('dailyEnergy.guidance.useStrongHours', {
            planet: getLocalizedPlanetName(analysis.bestForGeneralWork),
            percent: power,
          })
        );
      }
    }

    if (analysis.bestForSpiritualWork && analysis.bestForSpiritualWork !== analysis.bestForGeneralWork) {
      const power = analysis.planets?.[analysis.bestForSpiritualWork]?.finalPower;
      if (typeof power === 'number') {
        recs.push(
          t('dailyEnergy.guidance.useStrongHoursSpiritual', {
            planet: getLocalizedPlanetName(analysis.bestForSpiritualWork),
            percent: power,
          })
        );
      }
    }

    // Avoid planets
    if (analysis.planetsToAvoid?.length) {
      const [p1, p2] = analysis.planetsToAvoid;
      if (p1 && p2) {
        recs.push(
          t('dailyEnergy.guidance.avoidWeakHours', {
            planet: getLocalizedPlanetName(p1),
            planet2: getLocalizedPlanetName(p2),
          })
        );
      }
    }

    return recs;
  })();

  const localizedCriticalWarnings: string[] = (() => {
    const warnings: string[] = [];
    const planets = Object.keys(analysis.planets || {}) as Planet[];
    for (const planet of planets) {
      const planetData = analysis.planets[planet];
      if (!planetData) continue;
      const w = getLocalizedPlanetWarnings(planetData);
      w.forEach((msg) => warnings.push(`${getLocalizedPlanetName(planet)}: ${msg}`));
    }
    return warnings.slice(0, 3);
  })();
  const bestGeneral = analysis.bestForGeneralWork;
  const bestSpiritual = analysis.bestForSpiritualWork;
  const planets = Object.keys(analysis.planets) as Planet[];

  if (!expanded) {
    // Compact summary view
    return (
      <View style={styles.compactContainer}>
        <View style={styles.header}>
          <Ionicons name="planet-outline" size={20} color="#8B7355" />
          <Text style={styles.title}>{t('dailyEnergy.planetaryStrength.title')}</Text>
        </View>

        {/* Daily Score */}
        {dailyScore !== null && (
          <View style={styles.scoreRow}>
            <Text style={styles.scoreLabel}>{t('dailyEnergy.planetaryStrength.todaysEnergy')}:</Text>
            <View style={[styles.scoreBadge, { backgroundColor: getScoreColor(dailyScore) + '20' }]}>
              <Text style={[styles.scoreValue, { color: getScoreColor(dailyScore) }]}>
                {dailyScore}%
              </Text>
            </View>
          </View>
        )}

        {/* Day Ruling Planet (Compact) */}
        {analysis.dayRulingPlanet && analysis.dayRulingStrength !== undefined && (
          (() => {
            const rulerStrength = analysis.dayRulingStrength;
            const impact = getDayRulerImpactOnDailyScore(rulerStrength);
            const isPositive = impact >= 0;
            const impactColor = isPositive ? '#10b981' : '#ef4444';

            return (
              <View style={styles.compactRulerRow}>
                <View style={styles.compactRulerInfo}>
                  <Text style={styles.compactRulerLabel}>{t('dailyEnergy.planetaryStrength.rulerLabel')}:</Text>
                  <Text style={styles.compactRulerPlanet}>{getLocalizedPlanetName(analysis.dayRulingPlanet)}</Text>
                </View>
                <View style={styles.compactRulerStrength}>
                  <Text style={[styles.compactRulerValue, { color: getScoreColor(rulerStrength) }]}>
                    {rulerStrength.toFixed(0)}%
                  </Text>
                </View>
                <View style={[styles.compactRulerImpact, { backgroundColor: impactColor + '20' }]}>
                  <Text style={[styles.compactImpactText, { color: impactColor }]}>
                    {isPositive ? '+' : ''}{impact}
                  </Text>
                </View>
              </View>
            );
          })()
        )}

        {/* Best Planets */}
        {(bestGeneral || bestSpiritual) && (
          <View style={styles.bestPlanetsRow}>
            {bestGeneral && (
              <View style={styles.bestPlanetTag}>
                <Text style={styles.bestPlanetLabel}>{t('dailyEnergy.planetaryStrength.bestWork')}:</Text>
                <Text style={styles.bestPlanetName}>{getLocalizedPlanetName(bestGeneral)}</Text>
              </View>
            )}
            {bestSpiritual && bestSpiritual !== bestGeneral && (
              <View style={styles.bestPlanetTag}>
                <Text style={styles.bestPlanetLabel}>{t('dailyEnergy.planetaryStrength.bestReflection')}:</Text>
                <Text style={styles.bestPlanetName}>{getLocalizedPlanetName(bestSpiritual)}</Text>
              </View>
            )}
          </View>
        )}

        {/* Critical Warnings */}
        {localizedCriticalWarnings.length > 0 && (
          <View style={styles.warningBox}>
            <Text style={styles.warningTitle}>⚠️ {t('dailyEnergy.planetaryStrength.watchOut')}</Text>
            {localizedCriticalWarnings.slice(0, 2).map((warning, idx) => (
              <Text key={idx} style={styles.warningText}>
                • {warning.substring(0, 60)}...
              </Text>
            ))}
          </View>
        )}
      </View>
    );
  }

  // Expanded detailed view
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="planet-outline" size={20} color="#8B7355" />
        <Text style={styles.title}>{t('dailyEnergy.planetaryStrength.title')}</Text>
        <TouchableOpacity onPress={refresh}>
          <Ionicons name="refresh-outline" size={18} color={DarkTheme.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Daily Score */}
      {dailyScore !== null && (
        <LinearGradient
          colors={[`${getScoreColor(dailyScore)}20`, `${getScoreColor(dailyScore)}08`]}
          style={styles.scoreCard}
        >
          <Text style={styles.scoreCardLabel}>{t('dailyEnergy.planetaryStrength.todaysOverallEnergy')}</Text>
          <Text style={[styles.scoreCardValue, { color: getScoreColor(dailyScore) }]}>
            {dailyScore}%
          </Text>
          <Text style={styles.scoreCardHint}>{t('dailyEnergy.planetaryStrength.averageOfAll')}</Text>
        </LinearGradient>
      )}

      {/* Day Ruling Planet Strength */}
      {analysis.dayRulingPlanet && analysis.dayRulingStrength !== undefined && (
        (() => {
          const rulerStrength = analysis.dayRulingStrength;
          const impact = getDayRulerImpactOnDailyScore(rulerStrength);
          const isPositive = impact >= 0;
          const impactColor = isPositive ? '#10b981' : '#ef4444';
          
          let quality: string;
          quality = getLocalizedQualityLabel(rulerStrength);

          return (
            <LinearGradient
              colors={['#8B735520', '#8B735508']}
              style={styles.rulerCard}
            >
              <View style={styles.rulerHeader}>
                <Text style={styles.rulerLabel}>{t('dailyEnergy.planetaryStrength.todaysRuler')}:</Text>
                <Text style={styles.rulerPlanet}>{getLocalizedPlanetName(analysis.dayRulingPlanet)}</Text>
              </View>
              
              <View style={styles.rulerStrengthRow}>
                <View style={styles.rulerStrengthBar}>
                  <View
                    style={[
                      styles.rulerStrengthFill,
                      { width: `${rulerStrength}%`, backgroundColor: getScoreColor(rulerStrength) },
                    ]}
                  />
                </View>
                <Text style={[styles.rulerStrengthValue, { color: getScoreColor(rulerStrength) }]}>
                  {rulerStrength.toFixed(0)}%
                </Text>
              </View>

              <View style={styles.rulerDetailsRow}>
                <View style={styles.rulerQuality}>
                  <Text style={styles.rulerQualityLabel}>{t('dailyEnergy.planetaryStrength.quality')}:</Text>
                  <Text style={styles.rulerQualityValue}>{quality}</Text>
                </View>
                
                <View style={[styles.rulerImpact, { borderLeftColor: impactColor }]}>
                  <Text style={styles.rulerImpactLabel}>{t('dailyEnergy.planetaryStrength.impactOnDaily')}:</Text>
                  <Text style={[styles.rulerImpactValue, { color: impactColor }]}>
                    {t('dailyEnergy.planetaryStrength.points', { value: `${isPositive ? '+' : ''}${impact}` })}
                  </Text>
                </View>
              </View>

              <Text style={styles.rulerExplanation}>
                {(() => {
                  const key = getQualityKeyFromStrength(rulerStrength);
                  const adviceKeyMap: Record<string, string> = {
                    excellent: 'veryStrong',
                    good: 'strong',
                    moderate: 'moderate',
                    weak: 'weak',
                    veryWeak: 'veryWeak',
                  };
                  const adviceKey = adviceKeyMap[key];
                  return adviceKey
                    ? t(`dailyEnergy.planetaryStrength.rulerAdvice.${adviceKey}`, {
                        planet: getLocalizedPlanetName(analysis.dayRulingPlanet),
                      })
                    : '';
                })()}
              </Text>
            </LinearGradient>
          );
        })()
      )}

      {/* Best Hours Summary */}
      {bestHours && bestHours.length > 0 && (
        <View style={styles.bestHoursCard}>
          <Text style={styles.bestHoursTitle}>⏰ {t('dailyEnergy.planetaryStrength.recommendedHours')}</Text>
          <FlatList
            data={bestHours.slice(0, 5)}
            renderItem={({ item }) => (
              <View style={styles.bestHourRow}>
                <Text style={styles.bestHourPlanet}>{getLocalizedPlanetName(item.planet)}</Text>
                <View
                  style={[
                    styles.bestHourQuality,
                    {
                      backgroundColor:
                        item.quality === 'excellent'
                          ? '#10b98120'
                          : item.quality === 'good'
                            ? '#60a5fa20'
                            : '#f59e0b20',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.bestHourQualityText,
                      {
                        color:
                          item.quality === 'excellent'
                            ? '#10b981'
                            : item.quality === 'good'
                              ? '#60a5fa'
                              : '#f59e0b',
                      },
                    ]}
                  >
                    {getLocalizedBestHourQuality(item.quality)}
                  </Text>
                </View>
              </View>
            )}
            scrollEnabled={false}
          />
        </View>
      )}

      {/* Recommendations */}
      {localizedRecommendations.length > 0 && (
        <View style={styles.recommendationsCard}>
          <Text style={styles.recommendationsTitle}>✅ {t('dailyEnergy.guidance.title')}</Text>
          <FlatList
            data={localizedRecommendations}
            renderItem={({ item }) => (
              <Text style={styles.recommendationItem}>• {item}</Text>
            )}
            scrollEnabled={false}
          />
        </View>
      )}

      {/* Critical Warnings */}
      {localizedCriticalWarnings.length > 0 && (
        <View style={styles.criticalCard}>
          <Text style={styles.criticalTitle}>⚠️ {t('dailyEnergy.guidance.cautions')}</Text>
          <FlatList
            data={localizedCriticalWarnings}
            renderItem={({ item }) => (
              <Text style={styles.criticalItem}>{item}</Text>
            )}
            scrollEnabled={false}
          />
        </View>
      )}

      {/* Detailed Planet Analysis */}
      <Text style={styles.sectionTitle}>{t('dailyEnergy.planetaryStrength.detailedAnalysis')}</Text>
      <FlatList
        data={planets}
        renderItem={({ item: planet }) => {
          const planetData = analysis.planets[planet];
          if (!planetData) return null;

          const isExpanded = expandedPlanet === planet;

          return (
            <TouchableOpacity
              key={planet}
              style={[styles.planetCard, isExpanded && styles.planetCardExpanded]}
              onPress={() => setExpandedPlanet(isExpanded ? null : planet)}
            >
              <View style={styles.planetCardHeader}>
                <View style={styles.planetCardLeft}>
                  <Text style={styles.planetCardName}>{getLocalizedPlanetName(planet)}</Text>
                  <Text style={styles.planetCardPosition}>
                    {planetData.degree.toFixed(1)}° {planetData.sign}
                  </Text>
                </View>
                <View
                  style={[
                    styles.planetCardPower,
                    { backgroundColor: `${getPowerColor(planetData.finalPower)}20` },
                  ]}
                >
                  <Text style={[styles.planetCardPowerText, { color: getPowerColor(planetData.finalPower) }]}>
                    {planetData.finalPower}%
                  </Text>
                </View>
                <Ionicons
                  name={isExpanded ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={DarkTheme.textSecondary}
                />
              </View>

              {isExpanded && (
                <View style={styles.planetCardDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>{t('dailyEnergy.planetaryStrength.degreeStrength')}:</Text>
                    <Text style={styles.detailValue}>{Math.round(planetData.degreeInfo.strength * 100)}%</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>{t('dailyEnergy.planetaryStrength.dignityLabel')}:</Text>
                    <Text style={styles.detailValue}>{getLocalizedDignityStatus(planetData.dignityInfo.status)}</Text>
                  </View>
                  {getLocalizedPlanetWarnings(planetData).map((w, idx) => (
                    <Text key={idx} style={styles.detailWarning}>⚠️ {w}</Text>
                  ))}
                </View>
              )}
            </TouchableOpacity>
          );
        }}
        scrollEnabled={false}
      />
    </View>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    backgroundColor: DarkTheme.screenBackground,
    borderRadius: 12,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
    padding: Spacing.md,
  },
  compactContainer: {
    backgroundColor: `${DarkTheme.cardBackground}dd`,
    borderRadius: 12,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
    padding: Spacing.md,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: DarkTheme.textPrimary,
  },

  // Loading/Error
  loadingContainer: {
    paddingVertical: Spacing.lg,
  },
  errorText: {
    color: DarkTheme.textSecondary,
    fontSize: 13,
    marginBottom: Spacing.sm,
  },
  retryButton: {
    backgroundColor: '#8B7355',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },

  // Compact mode
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  scoreLabel: {
    color: DarkTheme.textSecondary,
    fontSize: 12,
  },
  scoreBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 6,
  },
  scoreValue: {
    fontSize: 14,
    fontWeight: '700',
  },

  bestPlanetsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  bestPlanetTag: {
    flex: 1,
    backgroundColor: '#8B735520',
    borderRadius: 6,
    padding: Spacing.xs,
  },
  bestPlanetLabel: {
    fontSize: 10,
    color: DarkTheme.textTertiary,
  },
  bestPlanetName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8B7355',
  },

  warningBox: {
    backgroundColor: '#ef444420',
    borderLeftWidth: 3,
    borderLeftColor: '#ef4444',
    borderRadius: 6,
    padding: Spacing.sm,
  },
  warningTitle: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  warningText: {
    color: DarkTheme.textSecondary,
    fontSize: 11,
    marginBottom: 2,
  },

  // Compact Ruler
  compactRulerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.xs,
    paddingVertical: Spacing.xs,
    backgroundColor: '#8B735510',
    borderRadius: 6,
  },
  compactRulerInfo: {
    flex: 1,
  },
  compactRulerLabel: {
    color: DarkTheme.textTertiary,
    fontSize: 9,
  },
  compactRulerPlanet: {
    color: '#8B7355',
    fontSize: 12,
    fontWeight: '700',
  },
  compactRulerStrength: {
    alignItems: 'center',
  },
  compactRulerValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  compactRulerImpact: {
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: 4,
    minWidth: 30,
    alignItems: 'center',
  },
  compactImpactText: {
    fontSize: 11,
    fontWeight: '700',
  },

  // Expanded mode
  scoreCard: {
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  scoreCardLabel: {
    color: DarkTheme.textSecondary,
    fontSize: 12,
    marginBottom: Spacing.xs,
  },
  scoreCardValue: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  scoreCardHint: {
    color: DarkTheme.textTertiary,
    fontSize: 11,
  },

  // Day Ruler Card
  rulerCard: {
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: '#8B7355',
  },
  rulerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  rulerLabel: {
    color: DarkTheme.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  rulerPlanet: {
    color: '#8B7355',
    fontSize: 16,
    fontWeight: '700',
  },
  
  rulerStrengthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  rulerStrengthBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#ffffff20',
    borderRadius: 4,
    overflow: 'hidden',
  },
  rulerStrengthFill: {
    height: '100%',
    borderRadius: 4,
  },
  rulerStrengthValue: {
    fontSize: 14,
    fontWeight: '700',
    minWidth: 40,
    textAlign: 'right',
  },

  rulerDetailsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  rulerQuality: {
    flex: 1,
  },
  rulerQualityLabel: {
    color: DarkTheme.textTertiary,
    fontSize: 10,
    marginBottom: 2,
  },
  rulerQualityValue: {
    color: DarkTheme.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },

  rulerImpact: {
    flex: 1,
    paddingLeft: Spacing.sm,
    borderLeftWidth: 2,
  },
  rulerImpactLabel: {
    color: DarkTheme.textTertiary,
    fontSize: 10,
    marginBottom: 2,
  },
  rulerImpactValue: {
    fontSize: 12,
    fontWeight: '700',
  },

  rulerExplanation: {
    color: DarkTheme.textSecondary,
    fontSize: 11,
    lineHeight: 16,
  },

  bestHoursCard: {
    backgroundColor: `${DarkTheme.cardBackground}dd`,
    borderRadius: 8,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
  },
  bestHoursTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: DarkTheme.textPrimary,
    marginBottom: Spacing.sm,
  },
  bestHourRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: `${DarkTheme.textTertiary}20`,
  },
  bestHourPlanet: {
    fontSize: 12,
    color: DarkTheme.textPrimary,
    fontWeight: '500',
  },
  bestHourQuality: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  bestHourQualityText: {
    fontSize: 11,
    fontWeight: '600',
  },

  recommendationsCard: {
    backgroundColor: '#10b98120',
    borderLeftWidth: 3,
    borderLeftColor: '#10b981',
    borderRadius: 8,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
  },
  recommendationsTitle: {
    color: '#10b981',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  recommendationItem: {
    color: DarkTheme.textSecondary,
    fontSize: 12,
    marginBottom: Spacing.xs,
    lineHeight: 16,
  },

  criticalCard: {
    backgroundColor: '#ef444420',
    borderLeftWidth: 3,
    borderLeftColor: '#ef4444',
    borderRadius: 8,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
  },
  criticalTitle: {
    color: '#ef4444',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  criticalItem: {
    color: DarkTheme.textSecondary,
    fontSize: 12,
    marginBottom: Spacing.xs,
    lineHeight: 16,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: DarkTheme.textPrimary,
    marginBottom: Spacing.sm,
    marginTop: Spacing.md,
  },

  planetCard: {
    backgroundColor: `${DarkTheme.cardBackground}dd`,
    borderRadius: 8,
    padding: Spacing.sm,
    marginBottom: Spacing.xs,
    borderLeftWidth: 3,
    borderLeftColor: DarkTheme.textTertiary,
  },
  planetCardExpanded: {
    borderLeftColor: '#8B7355',
  },
  planetCardDetails: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: `${DarkTheme.textTertiary}40`,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  detailLabel: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '600',
    color: DarkTheme.textPrimary,
  },
  detailWarning: {
    fontSize: 11,
    color: '#ef4444',
    marginBottom: 4,
  },
  planetCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  planetCardLeft: {
    flex: 1,
  },
  planetCardName: {
    fontSize: 13,
    fontWeight: '600',
    color: DarkTheme.textPrimary,
  },
  planetCardPosition: {
    fontSize: 11,
    color: DarkTheme.textSecondary,
    marginTop: 2,
  },
  planetCardPower: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  planetCardPowerText: {
    fontSize: 12,
    fontWeight: '700',
  },
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getScoreColor(score: number): string {
  if (score >= 70) return '#10b981';
  if (score >= 50) return '#60a5fa';
  if (score >= 30) return '#f59e0b';
  return '#ef4444';
}

function getPowerColor(power: number): string {
  if (power >= 80) return '#10b981';
  if (power >= 60) return '#60a5fa';
  if (power >= 40) return '#f59e0b';
  return '#ef4444';
}
