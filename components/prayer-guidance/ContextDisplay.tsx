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
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('prayerGuidance.ui.spiritualContext')}</Text>
      
      {/* User Element */}
      <View style={styles.row}>
        <Text style={styles.label}>{t('prayerGuidance.ui.yourElement')}:</Text>
        <View style={styles.valueContainer}>
          <Text style={styles.elementIcon}>{getElementIcon(context.userElement)}</Text>
          <Text style={styles.value}>{context.userElement}</Text>
        </View>
      </View>
      
      {/* Current Planetary Hour */}
      <View style={styles.row}>
        <Text style={styles.label}>{t('prayerGuidance.ui.currentHourLabel')}:</Text>
        <View style={styles.valueContainer}>
          <Text style={styles.value}>{context.currentPlanetaryHour.planet}</Text>
          <Text style={styles.arabicText}>{context.currentPlanetaryHour.arabicName}</Text>
        </View>
      </View>
      
      {/* Hour Number */}
      <View style={styles.row}>
        <Text style={styles.label}>{t('prayerGuidance.ui.hourNumber')}:</Text>
        <Text style={styles.value}>
          {context.currentPlanetaryHour.number} / 12
          {planetaryHour && (
            <Text style={styles.subtext}>
              {' '}({planetaryHour.isDaytime ? t('prayerGuidance.ui.day') : t('prayerGuidance.ui.night')})
            </Text>
          )}
        </Text>
      </View>
      
      {/* Time Remaining */}
      {planetaryHour && (
        <View style={styles.row}>
          <Text style={styles.label}>{t('prayerGuidance.ui.timeRemaining')}:</Text>
          <Text style={styles.value}>
            {formatTimeRemaining(planetaryHour.timeRemaining)}
          </Text>
        </View>
      )}
      
      {/* Day Ruler */}
      <View style={styles.row}>
        <Text style={styles.label}>{t('prayerGuidance.ui.dayRuler')}:</Text>
        <Text style={styles.value}>{context.dayRuler}</Text>
      </View>
      
      {/* Alignment */}
      <View style={[styles.alignmentCard, { borderColor: alignmentColor }]}>
        <Text style={styles.alignmentEmoji}>{alignmentEmoji}</Text>
        <Text style={[styles.alignmentLevel, { color: alignmentColor }]}>
          {context.alignment.toUpperCase()}
        </Text>
        <Text style={styles.alignmentDescription}>
          {context.alignmentDescription}
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
  value: {
    fontSize: 14,
    color: DarkTheme.textPrimary,
    fontWeight: Typography.weightSemibold,
  },
  elementIcon: {
    fontSize: 20
  },
  arabicText: {
    fontSize: 12,
    color: DarkTheme.textMuted,
    fontFamily: 'System'
  },
  subtext: {
    fontSize: 12,
    color: DarkTheme.textMuted,
    fontWeight: '400'
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
  }
});

export default ContextDisplay;
