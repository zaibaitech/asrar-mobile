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
}

/**
 * Display panel showing today's planetary strength analysis
 */
export function DailyPlanetaryAnalysisDisplay({
  expanded = false,
}: DailyPlanetaryAnalysisDisplayProps) {
  const { t } = useLanguage();
  const { analysis, dailyScore, bestHours, loading, error, refresh } =
    useDailyPlanetaryAnalysis();

  const [expandedPlanet, setExpandedPlanet] = React.useState<Planet | null>(null);

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Ionicons name="planet-outline" size={20} color="#8B7355" />
          <Text style={styles.title}>Planetary Strength Today</Text>
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
          <Text style={styles.title}>Planetary Data Unavailable</Text>
        </View>
        <Text style={styles.errorText}>{error?.message || 'Unable to load planetary data'}</Text>
        <TouchableOpacity onPress={refresh} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const criticalWarnings = analysis.criticalWarnings || [];
  const recommendations = analysis.practiceRecommendations || [];
  const bestGeneral = analysis.bestForGeneralWork;
  const bestSpiritual = analysis.bestForSpiritualWork;
  const planets = Object.keys(analysis.planets) as Planet[];

  if (!expanded) {
    // Compact summary view
    return (
      <View style={styles.compactContainer}>
        <View style={styles.header}>
          <Ionicons name="planet-outline" size={20} color="#8B7355" />
          <Text style={styles.title}>Planetary Strength</Text>
        </View>

        {/* Daily Score */}
        {dailyScore !== null && (
          <View style={styles.scoreRow}>
            <Text style={styles.scoreLabel}>Today's Energy:</Text>
            <View style={[styles.scoreBadge, { backgroundColor: getScoreColor(dailyScore) + '20' }]}>
              <Text style={[styles.scoreValue, { color: getScoreColor(dailyScore) }]}>
                {dailyScore}%
              </Text>
            </View>
          </View>
        )}

        {/* Best Planets */}
        {(bestGeneral || bestSpiritual) && (
          <View style={styles.bestPlanetsRow}>
            {bestGeneral && (
              <View style={styles.bestPlanetTag}>
                <Text style={styles.bestPlanetLabel}>Best Work:</Text>
                <Text style={styles.bestPlanetName}>{bestGeneral}</Text>
              </View>
            )}
            {bestSpiritual && bestSpiritual !== bestGeneral && (
              <View style={styles.bestPlanetTag}>
                <Text style={styles.bestPlanetLabel}>Best Reflection:</Text>
                <Text style={styles.bestPlanetName}>{bestSpiritual}</Text>
              </View>
            )}
          </View>
        )}

        {/* Critical Warnings */}
        {criticalWarnings.length > 0 && (
          <View style={styles.warningBox}>
            <Text style={styles.warningTitle}>⚠️ Watch Out</Text>
            {criticalWarnings.slice(0, 2).map((warning, idx) => (
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
        <Text style={styles.title}>Planetary Strength Analysis</Text>
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
          <Text style={styles.scoreCardLabel}>Today's Overall Energy</Text>
          <Text style={[styles.scoreCardValue, { color: getScoreColor(dailyScore) }]}>
            {dailyScore}%
          </Text>
          <Text style={styles.scoreCardHint}>Average of all planetary strengths</Text>
        </LinearGradient>
      )}

      {/* Best Hours Summary */}
      {bestHours && bestHours.length > 0 && (
        <View style={styles.bestHoursCard}>
          <Text style={styles.bestHoursTitle}>⏰ Recommended Planetary Hours</Text>
          <FlatList
            data={bestHours.slice(0, 5)}
            renderItem={({ item }) => (
              <View style={styles.bestHourRow}>
                <Text style={styles.bestHourPlanet}>{item.planet}</Text>
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
                    {item.quality.charAt(0).toUpperCase() + item.quality.slice(1)}
                  </Text>
                </View>
              </View>
            )}
            scrollEnabled={false}
          />
        </View>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <View style={styles.recommendationsCard}>
          <Text style={styles.recommendationsTitle}>✅ Today's Guidance</Text>
          <FlatList
            data={recommendations}
            renderItem={({ item }) => (
              <Text style={styles.recommendationItem}>• {item}</Text>
            )}
            scrollEnabled={false}
          />
        </View>
      )}

      {/* Critical Warnings */}
      {criticalWarnings.length > 0 && (
        <View style={styles.criticalCard}>
          <Text style={styles.criticalTitle}>⚠️ Cautions</Text>
          <FlatList
            data={criticalWarnings}
            renderItem={({ item }) => (
              <Text style={styles.criticalItem}>{item}</Text>
            )}
            scrollEnabled={false}
          />
        </View>
      )}

      {/* Detailed Planet Analysis */}
      <Text style={styles.sectionTitle}>Detailed Planet Analysis</Text>
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
                  <Text style={styles.planetCardName}>{planet}</Text>
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
                    <Text style={styles.detailLabel}>Degree Strength:</Text>
                    <Text style={styles.detailValue}>{Math.round(planetData.degreeInfo.strength * 100)}%</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Dignity:</Text>
                    <Text style={styles.detailValue}>{planetData.dignityInfo.status}</Text>
                  </View>
                  {planetData.warnings.map((w, idx) => (
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
