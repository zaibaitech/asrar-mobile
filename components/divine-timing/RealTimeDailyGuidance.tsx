/**
 * Real-Time Daily Guidance Card
 * ==============================
 * Shows current day's spiritual timing guidance
 * Always displays real-time data (not dependent on check-ins)
 */

import { DarkTheme, Spacing, Typography } from '@/constants/DarkTheme';
import { useLanguage } from '@/contexts/LanguageContext';
import { DailyGuidance } from '@/services/DailyGuidanceService';
import { calculateElementalHarmony } from '@/services/ElementalHarmonyService';
import { getDayRuler, getPlanetInfo } from '@/services/PlanetaryHoursService';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

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
  
  const handlePress = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      // Haptics not available - fail silently
    }
    
    // Navigate to daily guidance details with data
    if (guidance) {
      router.push({
        pathname: '/(tabs)/daily-guidance-details',
        params: {
          timingQuality: guidance.timingQuality,
          dayElement: guidance.dayElement,
          userElement: guidance.userElement || '',
          relationship: guidance.relationship,
          messageKey: guidance.messageKey,
          messageParams: JSON.stringify(guidance.messageParams || {}),
          bestForKeys: JSON.stringify(guidance.bestForKeys || []),
          avoidKeys: JSON.stringify(guidance.avoidKeys || []),
          peakHoursKey: guidance.peakHoursKey || '',
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
        return t('home.cards.dailyGuidance.window.favorable');
      case 'transformative':
        return t('home.cards.dailyGuidance.window.transformative');
      case 'delicate':
        return t('home.cards.dailyGuidance.window.delicate');
      default:
        return t('home.cards.dailyGuidance.window.neutral');
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
  
  if (loading || !guidance) {
    return (
      <Pressable
        style={styles.container}
        onPress={handlePress}
        android_ripple={{ color: 'rgba(255, 255, 255, 0.1)' }}
      >
        <LinearGradient
          colors={['rgba(139, 115, 85, 0.15)', 'rgba(139, 115, 85, 0.05)']}
          style={styles.gradient}
        >
          <Text style={styles.loadingText}>Loading guidance...</Text>
        </LinearGradient>
      </Pressable>
    );
  }
  
  const statusColor = getStatusColor(guidance.timingQuality);
  const statusLabel = getStatusLabel(guidance.timingQuality);
  
  // Get first bestFor item if available
  const firstBestForKey = guidance.bestForKeys && guidance.bestForKeys.length > 0 ? guidance.bestForKeys[0] : null;
  const bestForText = firstBestForKey ? t(firstBestForKey) : '';
  const hasBestFor = firstBestForKey !== null;
  
  // Get day ruler
  const now = new Date();
  const dayRuler = getDayRuler(now);
  const dayRulerInfo = getPlanetInfo(dayRuler);
  
  // Calculate elemental harmony if user element exists
  const harmonyData = guidance.userElement 
    ? calculateElementalHarmony(guidance.userElement, guidance.dayElement)
    : null;
  
  return (
    <Pressable
      style={styles.container}
      onPress={handlePress}
      android_ripple={{ color: 'rgba(255, 255, 255, 0.1)' }}
    >
      <LinearGradient
        colors={[`${statusColor}15`, `${statusColor}05`]}
        style={compact ? styles.gradientCompact : styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Ionicons name="compass-outline" size={compact ? 22 : 28} color={statusColor} />
            <View style={styles.titleContainer}>
              {showDayLabel && dayLabel && (
                <Text style={[styles.dayBadge, compact && styles.dayBadgeCompact]}>{dayLabel}</Text>
              )}
              <Text style={[styles.title, compact && styles.titleCompact]} numberOfLines={1} ellipsizeMode="tail">{t('home.cards.dailyGuidance.title')}</Text>
              <Text style={[styles.subtitle, { color: statusColor }, compact && styles.subtitleCompact]} numberOfLines={1} ellipsizeMode="tail">
                {statusLabel}
              </Text>
            </View>
          </View>
        </View>
        
        {/* Day Ruler Row */}
        <View style={styles.rulerRow}>
          <Text style={styles.rulerIcon}>{dayRulerInfo.symbol}</Text>
          <Text style={styles.rulerLabel}>{t('home.cards.dailyGuidance.dayRuler')}</Text>
          <Text style={styles.rulerText}>{t(`planets.${dayRuler.toLowerCase()}`)}</Text>
          <Text style={styles.rulerArabic}>({dayRulerInfo.arabicName})</Text>
        </View>
        
        {/* Elements Display */}
        <View style={styles.elementsContainer}>
          <View style={[styles.elementsRow, compact && styles.elementsRowCompact]}>
            <View style={[styles.elementBadge, compact && styles.elementBadgeCompact]}>
              <Text style={styles.elementIcon}>{getElementIcon(guidance.dayElement)}</Text>
              <Text style={[styles.elementLabel, compact && styles.elementLabelCompact]}>
                {getElementLabel(guidance.dayElement)} {t('home.cards.dailyGuidance.energyToday')}
              </Text>
            </View>
            
            {guidance.userElement && (
              <View style={[styles.elementBadge, styles.userElementBadge, compact && styles.elementBadgeCompact]}>
                <Text style={styles.elementIcon}>{getElementIcon(guidance.userElement)}</Text>
                <Text style={[styles.elementLabel, compact && styles.elementLabelCompact]}>
                  {t('home.cards.dailyGuidance.yourElement', { element: getElementLabel(guidance.userElement) })}
                </Text>
              </View>
            )}
          </View>
          
          {/* Elemental Harmony Caption */}
          {harmonyData && (
            <View style={styles.harmonyCaption}>
              <Text style={styles.harmonyCaptionText}>
                <Text style={styles.harmonyCaptionIcon}>◐</Text> {t('home.cards.dailyGuidance.supportiveBalance')}
              </Text>
            </View>
          )}
        </View>
        
        {/* Best For / Avoid */}
        {hasBestFor && (
          <View style={[styles.activityRow, compact && styles.activityRowCompact]}>
            <View style={styles.activitySection}>
              <Text style={[styles.activityLabel, compact && styles.activityLabelCompact]}>{t('home.cards.dailyGuidance.bestFor')}</Text>
              <Text style={[styles.activityText, compact && styles.activityTextCompact]} numberOfLines={1}>
                {bestForText}
              </Text>
            </View>
          </View>
        )}
        
        {showDetailsHint && (
          <View style={styles.detailsRow}>
            <Ionicons name="arrow-forward" size={12} color={DarkTheme.textTertiary} />
            <Text style={styles.detailsText} numberOfLines={1} ellipsizeMode="tail">{t('home.cards.dailyGuidance.tapForDetails')}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={[styles.footer, compact && styles.footerCompact]}>
          <Ionicons name="information-circle-outline" size={12} color={DarkTheme.textTertiary} />
          <Text style={compact ? styles.footerTextCompact : styles.footerText} numberOfLines={2} ellipsizeMode="tail">
            {t('home.cards.dailyGuidance.disclaimer')}
          </Text>
        </View>
      </LinearGradient>
    </Pressable>
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
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  gradient: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl,
    gap: Spacing.md,
  },
  gradientCompact: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    gap: Spacing.sm,
  },
  
  // Header
  header: {
    marginBottom: Spacing.sm,
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
    fontSize: 10,
    fontWeight: '600',
    color: DarkTheme.textTertiary,
    opacity: 0.6,
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
    fontSize: 18,
    fontWeight: '700',
    color: DarkTheme.textPrimary,
  },
  titleCompact: {
    fontSize: Typography.h3,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  subtitleCompact: {
    fontSize: Typography.label,
    marginTop: 1,
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
  elementsContainer: {
    gap: Spacing.xs,
  },
  
  // Harmony Caption (under pills)
  harmonyCaption: {
    paddingLeft: 2,
  },
  harmonyCaptionText: {
    fontSize: 11,
    color: DarkTheme.textTertiary,
    fontWeight: '500',
    opacity: 0.8,
  },
  harmonyCaptionIcon: {
    fontSize: 10,
    opacity: 0.6,
  },
  
  // Elements
  elementsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  },
  elementsRowCompact: {
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
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
  userElementBadge: {
    backgroundColor: 'rgba(139, 115, 85, 0.2)',
    borderColor: 'rgba(139, 115, 85, 0.3)',
  },
  elementIcon: {
    fontSize: 14,
  },
  elementLabel: {
    fontSize: 11,
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
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  activityRowCompact: {
    gap: Spacing.xs,
  },
  activitySection: {
    gap: Spacing.xs,
  },
  activityLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: DarkTheme.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  activityLabelCompact: {
    fontSize: Typography.caption,
  },
  activityText: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
  },
  activityTextCompact: {
    fontSize: Typography.caption,
    color: DarkTheme.textTertiary,
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
    marginTop: 4,
  },
  footerCompact: {
    marginTop: Spacing.xs,
  },
  footerText: {
    fontSize: 10,
    color: DarkTheme.textTertiary,
    flex: 1,
    minWidth: 0,
    lineHeight: 14,
  },
  footerTextCompact: {
    fontSize: 9,
    color: DarkTheme.textTertiary,
    opacity: 0.8,
    flex: 1,
    minWidth: 0,
    lineHeight: 13,
  },
  
  // Loading
  loadingText: {
    fontSize: 14,
    color: DarkTheme.textSecondary,
    textAlign: 'center',
    paddingVertical: 20,
  },
});
