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
  const { t, language } = useLanguage();

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
            {planet} @ {degree.toFixed(1)}° {sign}
          </Text>
        </View>

        {analysis.warnings.length > 0 && (
          <View style={styles.compactWarnings}>
            {analysis.warnings.slice(0, 2).map((warning, idx) => (
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
            {planet} {isRetrograde && '℞'}
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
            POWER
          </Text>
          <Text style={[styles.powerValue, { color: powerColor }]}>
            {analysis.finalPower}%
          </Text>
        </LinearGradient>
      </View>

      {/* Formula Breakdown */}
      <View style={styles.formulaCard}>
        <Text style={styles.formulaTitle}>Calculation Breakdown</Text>
        <View style={styles.formulaRow}>
          <FactorBadge label="Degree" value={analysis.degreeInfo.quality} score={analysis.degreeStrength * 100} />
          <Text style={styles.times}>×</Text>
          <FactorBadge label="Dignity" value={analysis.dignityInfo.status} score={analysis.dignityModifier * 100} />
          <Text style={styles.times}>×</Text>
          <FactorBadge label="Combustion" value={analysis.combustionInfo.status} score={analysis.combustionModifier * 100} />
        </View>

        {isRetrograde && (
          <View style={[styles.formulaRow, { marginTop: Spacing.xs }]}>
            <Text style={styles.formulaText}>
              × Retrograde ({analysis.retrogradeModifier * 100}%)
            </Text>
          </View>
        )}

        <View style={[styles.formulaRow, { marginTop: Spacing.sm, paddingTop: Spacing.sm, borderTopWidth: 1, borderTopColor: DarkTheme.textTertiary }]}>
          <Text style={styles.formulaText}>
            = {analysis.finalPower}% Final Power
          </Text>
        </View>
      </View>

      {/* Degree Strength Detail */}
      <AnalysisCard
        title="Degree Position"
        icon="📍"
        analysis={analysis.degreeInfo}
        color={getDegreeColor(analysis.degreeInfo.quality)}
      />

      {/* Essential Dignity Detail */}
      <AnalysisCard
        title="Essential Dignity"
        icon="♔"
        analysis={analysis.dignityInfo}
        color={getDignityColor(analysis.dignityInfo.status)}
      />

      {/* Combustion Detail */}
      {!['Sun', 'Moon'].includes(planet) && (
        <AnalysisCard
          title="Sun Proximity"
          icon="☀️"
          analysis={analysis.combustionInfo}
          color={analysis.combustionInfo.isCombust ? '#ef4444' : '#8b7355'}
        />
      )}

      {/* Retrograde Detail */}
      {isRetrograde && (
        <View style={styles.retrogradeCard}>
          <View style={styles.retrogradeHeader}>
            <Text style={styles.retrogradeIcon}>℞</Text>
            <View>
              <Text style={styles.retrogradeTitle}>Retrograde Motion</Text>
              <Text style={styles.retrogradeSubtitle}>Limited for outer work</Text>
            </View>
          </View>
          <Text style={styles.retrogradeDescription}>
            {analysis.retrogradeInfo.description}
          </Text>
        </View>
      )}

      {/* Warnings */}
      {analysis.warnings.length > 0 && (
        <View style={styles.warningsContainer}>
          <Text style={styles.warningsTitle}>⚠️ Challenges</Text>
          <FlatList
            data={analysis.warnings}
            renderItem={({ item }) => (
              <Text style={styles.warningItem}>• {item}</Text>
            )}
            scrollEnabled={false}
          />
        </View>
      )}

      {/* Recommendations */}
      {analysis.recommendations.length > 0 && (
        <View style={styles.recommendationsContainer}>
          <Text style={styles.recommendationsTitle}>✅ Recommendations</Text>
          <FlatList
            data={analysis.recommendations}
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
          <Text style={styles.suitabilityLabel}>Outer Work (Material/External)</Text>
        </View>
        <View style={[styles.suitabilityRow, { opacity: analysis.suitability.inner ? 1 : 0.5 }]}>
          <Text style={styles.suitabilityIcon}>
            {analysis.suitability.inner ? '✓' : '✗'}
          </Text>
          <Text style={styles.suitabilityLabel}>Inner Work (Spiritual/Reflection)</Text>
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
