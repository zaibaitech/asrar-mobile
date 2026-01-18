/**
 * Context Display Component
 * 
 * Shows spiritual context: user element, planetary hour, alignment
 * Phase 3: Functional UI only
 */

import { DarkTheme, Spacing, Typography } from '@/constants/DarkTheme';
import { useLanguage } from '@/contexts/LanguageContext';
import type { PrayerGuidanceRecommendation } from '@/services/PrayerGuidanceEngine';
import { formatTimeRemaining } from '@/utils/planetary-hours';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ContextDisplayProps {
  context: PrayerGuidanceRecommendation['context'];
  planetaryHour?: {
    timeRemaining: number;
    isDaytime: boolean;
  };
}

export function ContextDisplay({ context, planetaryHour }: ContextDisplayProps) {
  const { t } = useLanguage();
  const alignmentColor = getAlignmentColor(context.alignment);
  const alignmentEmoji = getAlignmentEmoji(context.alignment);
  const celestialIcon = planetaryHour?.isDaytime ? '☀️' : '🌙';
  const timeRemainingLabel = planetaryHour ? formatTimeRemaining(planetaryHour.timeRemaining) : '—';
  const timeRemainingProgress = planetaryHour
    ? Math.min(100, Math.max(0, 100 - (planetaryHour.timeRemaining / 60) * 100))
    : 0;

  const alignmentLabel = t(`prayerGuidance.ui.alignmentLevel.${context.alignment}`);
  const alignmentDescription = t(`prayerGuidance.ui.alignmentDescription.${context.alignment}`, {
    userElement: context.userElement,
    hourElement: context.hourElement,
  });
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('prayerGuidance.ui.spiritualContext')}</Text>
      
      {/* User Element */}
      <View style={styles.row}>
        <Text style={styles.label}>{t('prayerGuidance.ui.yourElement')}:</Text>
        <View style={styles.valueContainer}>
          <Text style={styles.elementIcon}>{getElementIcon(context.userElement)}</Text>
          <View style={styles.valuePill}>
            <Text style={styles.valuePillText}>{context.userElement}</Text>
          </View>
        </View>
      </View>
      
      {/* Celestial Hour Card */}
      <View style={styles.celestialCard}>
        <View style={styles.celestialHeader}>
          <View style={styles.celestialIconWrap}>
            <Text style={styles.celestialIcon}>{celestialIcon}</Text>
          </View>
          <View style={styles.celestialText}>
            <Text style={styles.celestialLabel}>{t('prayerGuidance.ui.currentHourLabel')}</Text>
            <Text style={styles.celestialPlanet}>{context.currentPlanetaryHour.planet}</Text>
            <Text style={styles.celestialArabic}>{context.currentPlanetaryHour.arabicName}</Text>
          </View>
          <View style={styles.celestialMeta}>
            <Text style={styles.celestialMetaText}>
              {t('prayerGuidance.ui.hourNumber')} {context.currentPlanetaryHour.number}/12
            </Text>
            {planetaryHour && (
              <Text style={styles.celestialMetaSubtext}>
                {planetaryHour.isDaytime ? t('prayerGuidance.ui.day') : t('prayerGuidance.ui.night')}
              </Text>
            )}
          </View>
        </View>
        {planetaryHour && (
          <View style={styles.timeRemainingBlock}>
            <View style={styles.timeRemainingRow}>
              <Text style={styles.timeRemainingLabel}>{t('prayerGuidance.ui.timeRemaining')}</Text>
              <Text style={styles.timeRemainingValue}>{timeRemainingLabel}</Text>
            </View>
            <View style={styles.timeRemainingBar}>
              <View style={[styles.timeRemainingProgress, { width: `${timeRemainingProgress}%` }]} />
            </View>
          </View>
        )}
      </View>
      
      {/* Day Ruler */}
      <View style={styles.row}>
        <Text style={styles.label}>{t('prayerGuidance.ui.dayRuler')}:</Text>
        <View style={styles.valuePill}>
          <Text style={styles.valuePillText}>{context.dayRuler}</Text>
        </View>
      </View>
      
      {/* Alignment */}
      <View style={[styles.alignmentCard, { borderColor: alignmentColor }]}>
        <Text style={styles.alignmentEmoji}>{alignmentEmoji}</Text>
        <Text style={[styles.alignmentLevel, { color: alignmentColor }]}>
          {alignmentLabel}
        </Text>
        <Text style={styles.alignmentDescription}>
          {alignmentDescription || context.alignmentDescription}
        </Text>
      </View>
    </View>
  );
}

function getAlignmentColor(alignment: string): string {
  const colors: Record<string, string> = {
    exceptional: '#34C759',
    strong: '#5AC8FA',
    favorable: '#007AFF',
    moderate: '#FF9500',
    balanced: '#AF52DE',
    challenging: '#FF3B30'
  };
  return colors[alignment] || '#999';
}

function getAlignmentEmoji(alignment: string): string {
  const emojis: Record<string, string> = {
    exceptional: '✨',
    strong: '⭐',
    favorable: '🌟',
    moderate: '💫',
    balanced: '🔮',
    challenging: '⚠️'
  };
  return emojis[alignment] || '•';
}

function getElementIcon(element: string): string {
  const icons: Record<string, string> = {
    Fire: '🔥',
    Water: '💧',
    Air: '💨',
    Earth: '🌍'
  };
  return icons[element] || '•';
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    backgroundColor: DarkTheme.cardBackground,
    borderRadius: 16,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: DarkTheme.borderSubtle,
  },
  title: {
    fontSize: Typography.h3,
    fontWeight: Typography.weightSemibold,
    marginBottom: Spacing.lg,
    color: DarkTheme.textPrimary,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: DarkTheme.borderSubtle,
  },
  label: {
    fontSize: 14,
    color: DarkTheme.textTertiary,
    fontWeight: Typography.weightMedium,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  valuePill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: DarkTheme.cardBackgroundAlt,
    borderWidth: 1,
    borderColor: DarkTheme.borderSubtle,
  },
  valuePillText: {
    fontSize: 13,
    color: DarkTheme.textPrimary,
    fontWeight: Typography.weightSemibold,
  },
  elementIcon: {
    fontSize: 20
  },
  alignmentCard: {
    marginTop: Spacing.lg,
    padding: Spacing.lg,
    backgroundColor: DarkTheme.cardBackgroundAlt,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center'
  },
  alignmentEmoji: {
    fontSize: 40,
    marginBottom: 8
  },
  alignmentLevel: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: 1
  },
  alignmentDescription: {
    fontSize: 14,
    color: DarkTheme.textTertiary,
    textAlign: 'center',
    lineHeight: 20
  },
  celestialCard: {
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
    padding: Spacing.lg,
    backgroundColor: DarkTheme.cardBackgroundAlt,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: DarkTheme.borderSubtle,
  },
  celestialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  celestialIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(100, 181, 246, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(100, 181, 246, 0.2)',
  },
  celestialIcon: {
    fontSize: 22,
  },
  celestialText: {
    flex: 1,
  },
  celestialLabel: {
    fontSize: 12,
    color: DarkTheme.textMuted,
    marginBottom: 2,
  },
  celestialPlanet: {
    fontSize: 16,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
  },
  celestialArabic: {
    fontSize: 12,
    color: DarkTheme.textTertiary,
  },
  celestialMeta: {
    alignItems: 'flex-end',
  },
  celestialMetaText: {
    fontSize: 12,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textSecondary,
  },
  celestialMetaSubtext: {
    fontSize: 11,
    color: DarkTheme.textMuted,
    marginTop: 2,
  },
  timeRemainingBlock: {
    marginTop: Spacing.md,
  },
  timeRemainingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  timeRemainingLabel: {
    fontSize: 12,
    color: DarkTheme.textMuted,
  },
  timeRemainingValue: {
    fontSize: 13,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
  },
  timeRemainingBar: {
    height: 6,
    borderRadius: 999,
    backgroundColor: DarkTheme.cardBackground,
    overflow: 'hidden',
  },
  timeRemainingProgress: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#64B5F6',
  },
});

export default ContextDisplay;
