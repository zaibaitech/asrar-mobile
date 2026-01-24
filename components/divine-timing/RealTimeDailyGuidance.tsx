/**
 * Real-Time Daily Guidance Card
 * ==============================
 * Shows current day's spiritual timing guidance
 * Always displays real-time data (not dependent on check-ins)
 * 
 * Enhanced with Asrariya Timing Engine for personalized practice timing
 */

import { Borders, DarkTheme, Spacing, Typography } from '@/constants/DarkTheme';
import { useLanguage } from '@/contexts/LanguageContext';
import { DailyGuidance } from '@/services/DailyGuidanceService';
import { getDayRuler, getPlanetInfo } from '@/services/PlanetaryHoursService';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { usePracticeTiming } from '../home/PracticeTimingBadge';

interface RealTimeDailyGuidanceProps {
  guidance: DailyGuidance | null;
  loading?: boolean;
  compact?: boolean;
  showDayLabel?: boolean;
  dayLabel?: string;
  showDetailsHint?: boolean;
}

export function RealTimeDailyGuidance({ 
  guidance, 
  loading, 
  compact = false,
  showDayLabel = false,
  dayLabel = '',
  showDetailsHint = false,
}: RealTimeDailyGuidanceProps) {
  const router = useRouter();
  const { t } = useLanguage();

  const getElementColor = React.useCallback((element?: string) => {
    switch (element) {
      case 'fire':
        return '#fb7185';
      case 'water':
        return '#60a5fa';
      case 'air':
        return '#a78bfa';
      case 'earth':
        return '#4ade80';
      default:
        return '#64B5F6';
    }
  }, []);

  const getObjectiveTimingQuality = React.useCallback((dayRuler: string): DailyGuidance['timingQuality'] => {
    switch (dayRuler) {
      case 'Sun':
      case 'Jupiter':
      case 'Venus':
        return 'favorable';
      case 'Mars':
        return 'transformative';
      case 'Moon':
      case 'Saturn':
        return 'delicate';
      case 'Mercury':
      default:
        return 'neutral';
    }
  }, []);
  
  const handlePress = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      // Haptics not available - fail silently
    }
    
    // Navigate to daily guidance details with data
    if (guidance) {
      const now = new Date();
      const ruler = getDayRuler(now);
      const rulerInfo = getPlanetInfo(ruler);
      const objectiveQuality = getObjectiveTimingQuality(ruler);

      const dayOfWeek = now.getDay();
      const dayKeys = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;
      const dayKey = dayKeys[dayOfWeek] ?? 'Sunday';
      const dayName = t(`home.dailyGuidanceDetails.days.${dayKey}`);

      const genericMessageKey = `home.dailyGuidanceContent.generic.${rulerInfo.element}.message`;
      const genericMessageParams = { day: dayName };
      const genericBestForKeys = [0, 1, 2, 3].map(i => `home.dailyGuidanceContent.generic.${rulerInfo.element}.bestFor.${i}`);
      const genericAvoidKeys = [0, 1, 2].map(i => `home.dailyGuidanceContent.generic.${rulerInfo.element}.avoid.${i}`);

      router.push({
        pathname: '/(tabs)/daily-guidance-details',
        params: {
          timingQuality: objectiveQuality,
          dayElement: rulerInfo.element,
          userElement: '',
          relationship: 'neutral',
          messageKey: genericMessageKey,
          messageParams: JSON.stringify(genericMessageParams),
          bestForKeys: JSON.stringify(genericBestForKeys),
          avoidKeys: JSON.stringify(genericAvoidKeys),
          peakHoursKey: '',
        },
      });
    }
  };
  
  const getStatusColor = (quality?: string) => {
    switch (quality) {
      case 'favorable':
        return '#10b981'; // Green
      case 'transformative':
        return '#f59e0b'; // Amber
      case 'delicate':
        return '#ef4444'; // Red
      default:
        return '#64B5F6'; // Blue
    }
  };
  
  const getStatusLabel = (quality?: string) => {
    switch (quality) {
      case 'favorable':
        return t('widgets.dailyEnergy.windows.favorable');
      case 'transformative':
        return t('widgets.dailyEnergy.windows.transformative');
      case 'delicate':
        return t('widgets.dailyEnergy.windows.delicate');
      default:
        return t('widgets.dailyEnergy.windows.neutral');
    }
  };
  
  const getElementIcon = (element?: string) => {
    switch (element) {
      case 'fire':
        return '🔥';
      case 'water':
        return '💧';
      case 'air':
        return '🌬️';
      case 'earth':
        return '🌱';
      default:
        return '✨';
    }
  };
  
  const getElementLabel = (element?: string) => {
    if (!element) return '';
    return t(`elements.${element}`);
  };
  
  // Get day ruler
  const now = new Date();
  const dayRuler = getDayRuler(now);
  const dayRulerInfo = getPlanetInfo(dayRuler);

  // Use personalized timing quality from guidance (already considers user element)
  // Falls back to objective quality only if guidance somehow doesn't have it
  const timingQuality = guidance?.timingQuality || getObjectiveTimingQuality(dayRuler);
  const statusColor = getStatusColor(timingQuality);
  const statusLabel = getStatusLabel(timingQuality);

  // Objective sections derived from day element + day ruler
  const elementColor = getElementColor(dayRulerInfo.element);
  const energyDescription = t(`widgets.dailyEnergy.energyDescriptions.${dayRulerInfo.element}`);

  const bestForKeys = [0, 1, 3].map(i => `home.dailyGuidanceContent.generic.${dayRulerInfo.element}.bestFor.${i}`);
  const bestForText = bestForKeys.map(key => t(key)).filter(Boolean).join(', ');
  const hasBestFor = bestForText.length > 0;
  
  return (
    <Pressable
      style={[styles.container, compact && styles.containerCompact]}
      onPress={handlePress}
      android_ripple={{ color: 'rgba(255, 255, 255, 0.1)' }}
    >
      <View
        style={[
          compact ? styles.gradientCompact : styles.gradient,
          { backgroundColor: `${statusColor}0d` },
        ]}
      >
        <View style={styles.body}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <View style={styles.titleContainer}>
                {showDayLabel && dayLabel && (
                  <Text style={[styles.dayBadge, compact && styles.dayBadgeCompact]} numberOfLines={1}>
                    {dayLabel}
                  </Text>
                )}
                <Text
                  style={[styles.title, compact && styles.titleCompact]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.85}
                >
                  🌍 {t('widgets.dailyEnergy.title')}
                </Text>
              </View>
            </View>
            <View style={[styles.windowBadge, { backgroundColor: `${statusColor}15`, borderColor: `${statusColor}35` }]}> 
              <Text
                style={[styles.windowText, { color: statusColor }]}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.85}
              >
                {statusLabel}
              </Text>
            </View>
          </View>
          
          {/* Day Ruler Row */}
          <View style={styles.rulerRow}>
            <Text style={styles.rulerIcon}>{dayRulerInfo.symbol}</Text>
            <Text style={styles.rulerLabel} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>
              {t('widgets.dailyEnergy.dayRuler')}:
            </Text>
            <Text style={styles.rulerText} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>
              {t(`planets.${dayRuler.toLowerCase()}`)}
            </Text>
            <Text style={styles.rulerArabic} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>
              ({dayRulerInfo.arabicName})
            </Text>
          </View>

          {/* Today's Element (Objective) */}
          <View style={styles.elementSection}>
            <Text style={styles.elementSectionLabel} numberOfLines={1}>
              {t('widgets.dailyEnergy.todaysElement')}
            </Text>
            <View
              style={[
                styles.elementBadge,
                compact && styles.elementBadgeCompact,
                { backgroundColor: `${elementColor}26`, borderColor: `${elementColor}44` },
              ]}
            >
              <Text style={styles.elementIcon}>{getElementIcon(dayRulerInfo.element)}</Text>
              <Text
                style={[styles.elementLabel, compact && styles.elementLabelCompact]}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.85}
              >
                {getElementLabel(dayRulerInfo.element)}
              </Text>
            </View>
          </View>

          {/* Energy Description */}
          <View style={styles.energyDescriptionRow}>
            <Text style={styles.energyBullet}>●</Text>
            <Text style={styles.energyDescriptionText} numberOfLines={1}>
              {energyDescription}
            </Text>
          </View>
          
          {/* Best For */}
          {hasBestFor && (
            <View style={styles.bestForCard}>
              <View style={styles.bestForHeader}>
                <Ionicons name="checkmark-circle" size={12} color="#10b981" />
                <Text style={styles.bestForLabel}>{t('widgets.dailyEnergy.bestFor')}</Text>
              </View>
              <Text style={styles.bestForText} numberOfLines={2} ellipsizeMode="tail">
                {bestForText}
              </Text>
            </View>
          )}

          {/* Asrariya Practice Timing */}
          <AsrariyaTimingIndicator compact={compact} t={t} />

        </View>

        {/* Footer (pinned) */}
        <View style={[styles.footer, compact && styles.footerCompact]}>
          <View style={styles.disclaimerRow}>
            <Ionicons name="information-circle-outline" size={12} color={DarkTheme.textTertiary} />
            <Text style={styles.disclaimerText} numberOfLines={1}>
              {t('widgets.dailyEnergy.forReflection')}
            </Text>
          </View>
          <Text style={styles.ctaText} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>
            {t('widgets.dailyEnergy.viewDetails')} →
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

function AsrariyaTimingIndicator({
  compact,
  t,
}: {
  compact: boolean;
  t: (key: string) => string;
}) {
  const { timing, isLoading } = usePracticeTiming('general');
  if (isLoading || !timing) return null;

  const colorMap: Record<string, string> = {
    optimal: '#10b981',
    favorable: '#60A5FA',
    moderate: '#f59e0b',
    challenging: '#f97316',
    avoid: '#ef4444',
  };
  const color = colorMap[timing.level] ?? '#64B5F6';

  return (
    <View style={[styles.asrariyaRow, compact && styles.asrariyaRowCompact, { borderColor: `${color}35`, backgroundColor: `${color}12` }]}>
      <Text style={styles.asrariyaIcon}>🕰️</Text>
      <Text style={styles.asrariyaLabel} numberOfLines={1}>
        {t('asrariya.title')}
      </Text>
      <View style={[styles.asrariyaChip, { backgroundColor: `${color}18`, borderColor: `${color}35` }]}>
        <Text style={[styles.asrariyaChipText, { color }]} numberOfLines={1}>
          {timing.label}
        </Text>
      </View>
    </View>
  );
}

function getHarmonyColor(level: string): string {
  switch (level) {
    case 'Harmonious':
      return '#10b981'; // Green
    case 'Supportive':
      return '#059669'; // Darker green (matches Favorable Window tone)
    case 'Challenging':
      return '#ef4444'; // Red
    default:
      return '#64748b'; // Gray
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Borders.radiusLg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    backgroundColor: 'rgba(30, 20, 36, 0.65)',
  },
  containerCompact: {
    minHeight: 380,
    maxHeight: 400,
  },
  gradient: {
    flex: 1,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.xxl,
    gap: 12,
  },
  gradientCompact: {
    flex: 1,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.xxl,
    gap: 12,
  },

  body: {
    gap: 12,
  },

  asrariyaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  asrariyaRowCompact: {
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  asrariyaIcon: {
    fontSize: 12,
  },
  asrariyaLabel: {
    flex: 1,
    fontSize: 12,
    color: DarkTheme.textSecondary,
    fontWeight: Typography.weightMedium as any,
  },
  asrariyaChip: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  asrariyaChipText: {
    fontSize: 11,
    fontWeight: Typography.weightSemibold as any,
  },
  
  // Header
  header: {
    gap: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  titleContainer: {
    flex: 1,
    minWidth: 0,
  },
  dayBadge: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.6)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  dayBadgeCompact: {
    fontSize: Typography.caption,
    opacity: 0.7,
    marginBottom: 0,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: DarkTheme.textPrimary,
  },
  titleCompact: {
    fontSize: 32,
  },
  windowBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  windowText: {
    fontSize: 13,
    fontWeight: '600',
  },
  
  // Day Ruler Row
  rulerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: Spacing.xs,
  },
  rulerIcon: {
    fontSize: 14,
  },
  rulerLabel: {
    fontSize: 11,
    color: DarkTheme.textTertiary,
    fontWeight: '600',
  },
  rulerText: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
    fontWeight: '700',
  },
  rulerArabic: {
    fontSize: 11,
    color: DarkTheme.textTertiary,
  },
  
  // Elements Container
  elementSection: {
    gap: 8,
  },
  elementSectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.7)',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  elementBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    maxWidth: '100%',
  },
  elementBadgeCompact: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Spacing.md,
  },
  elementIcon: {
    fontSize: 14,
  },
  elementLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: DarkTheme.textSecondary,
    flexShrink: 1,
  },
  elementLabelCompact: {
    fontSize: Typography.caption,
    fontWeight: Typography.weightMedium,
  },
  
  // Message
  message: {
    fontSize: 14,
    lineHeight: 20,
    color: DarkTheme.textPrimary,
    marginTop: Spacing.xs,
  },
  messageCompact: {
    fontSize: Typography.label,
    lineHeight: Typography.label * Typography.lineHeightNormal,
    color: DarkTheme.textPrimary,
    marginTop: Spacing.xs,
  },
  
  // Activity
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  activityRowCompact: {
    gap: Spacing.xs,
  },
  activityText: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
    flex: 1,
  },
  activityTextCompact: {
    fontSize: Typography.caption,
    color: DarkTheme.textTertiary,
  },

  // Best For Card
  bestForCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderRadius: 10,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    gap: 6,
  },
  bestForHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bestForLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#10b981',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bestForText: {
    fontSize: 11,
    color: DarkTheme.textSecondary,
    lineHeight: 16,
  },

  // Energy Description
  energyDescriptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  energyBullet: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  energyDescriptionText: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.8)',
    fontStyle: 'italic',
    flex: 1,
  },

  
  // Peak Hours
  peakHoursBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  peakHoursBadgeCompact: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Spacing.md,
  },
  peakHoursText: {
    fontSize: 11,
    fontWeight: '600',
  },
  peakHoursTextCompact: {
    fontSize: Typography.caption,
    fontWeight: Typography.weightMedium,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  detailsText: {
    fontSize: 11,
    color: DarkTheme.textTertiary,
    fontWeight: Typography.weightMedium,
    flex: 1,
    minWidth: 0,
  },
  
  // Footer
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    justifyContent: 'space-between',
  },
  footerCompact: {
    marginTop: 0,
  },
  disclaimerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  disclaimerText: {
    fontSize: 9,
    color: DarkTheme.textTertiary,
  },
  ctaText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#B481C4',
    flex: 1,
    textAlign: 'right',
  },
  
  // Loading
  loadingText: {
    fontSize: 14,
    color: DarkTheme.textSecondary,
    textAlign: 'center',
    paddingVertical: 20,
  },
});
