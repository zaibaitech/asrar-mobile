/**
 * Timing Guidance Card
 * ====================
 * Clear, simple display of current planetary hour quality and recommendations
 * Replaces confusing "Think Ahead" / "Good Time" displays with actionable guidance
 * 
 * Shows:
 * - Current planetary hour
 * - Quality (power %)
 * - When it ends
 * - Next best hour if current is weak
 * - Clear suggestion for user action
 */

import { DarkTheme } from '@/constants/DarkTheme';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Planet } from '@/services/PlanetaryHoursService';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface PlanetaryHour {
  planet: Planet;
  power: number;
  endsAt: string;
}

interface NextBestHour {
  planet: Planet;
  power: number;
  startsAt: string;
  hoursUntil: number;
}

interface TimingGuidanceCardProps {
  currentHour?: PlanetaryHour;
  nextBestHour?: NextBestHour;
  windowQuality?: 'favorable' | 'neutral' | 'delicate' | 'transformative';
}

function getPlanetEmoji(planet: Planet): string {
  const emojiMap: Record<Planet, string> = {
    Sun: '☀️',
    Moon: '🌙',
    Mars: '♂️',
    Mercury: '☿️',
    Jupiter: '♃',
    Venus: '♀️',
    Saturn: '♄',
  };
  return emojiMap[planet] || '⭐';
}

function getQualityLevel(power: number, t: (key: string, params?: Record<string, string | number>) => string): {
  label: string;
  color: string;
} {
  if (power >= 80) {
    return {
      label: t('common.quality.excellent'),
      color: '#10B981',
    };
  }
  if (power >= 60) {
    return {
      label: t('common.quality.good'),
      color: '#3B82F6',
    };
  }
  if (power >= 40) {
    return {
      label: t('common.quality.moderate'),
      color: '#F59E0B',
    };
  }
  return {
    label: t('common.quality.weak'),
    color: '#EF4444',
  };
}

function getWindowColor(quality?: string): string {
  switch (quality) {
    case 'favorable':
      return '#10b981';
    case 'transformative':
      return '#f59e0b';
    case 'delicate':
      return '#ef4444';
    default:
      return '#64B5F6';
  }
}

function getWindowLabel(
  quality: string | undefined,
  t: (key: string, params?: Record<string, string | number>) => string
): string {
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
}

function getPlanetLabel(planet: Planet, t: (key: string, params?: Record<string, string | number>) => string): string {
  return t(`planets.${planet.toLowerCase()}`);
}

export default function TimingGuidanceCard({
  currentHour,
  nextBestHour,
  windowQuality,
}: TimingGuidanceCardProps) {
  const { t } = useLanguage();

  if (!currentHour) {
    return null;
  }

  const quality = getQualityLevel(currentHour.power, t);
  const windowLabel = getWindowLabel(windowQuality, t);
  const windowColor = getWindowColor(windowQuality);
  const showNextBestHour = nextBestHour && currentHour.power < 70;
  const currentPlanetLabel = getPlanetLabel(currentHour.planet, t);
  const nextBestPlanetLabel = nextBestHour ? getPlanetLabel(nextBestHour.planet, t) : '';
  const nextBestQuality = nextBestHour ? getQualityLevel(nextBestHour.power, t) : undefined;

  return (
    <View style={styles.card}>
      {/* Section Label */}
      <Text style={styles.sectionLabel}>
        {t('notifications.timing.currentTiming')} ⏰
      </Text>

      <Text style={styles.scopeText}>{t('dailyEnergy.scope.hour')}</Text>

      {!!windowQuality && (
        <View style={[styles.windowBadge, { backgroundColor: `${windowColor}18`, borderColor: `${windowColor}35` }]}>
          <Text style={[styles.windowBadgeText, { color: windowColor }]}>{windowLabel}</Text>
        </View>
      )}

      {/* Current Hour */}
      <View style={styles.currentHourContainer}>
        <View style={styles.currentHourHeader}>
          <Text style={styles.planetEmoji}>{getPlanetEmoji(currentHour.planet)}</Text>
          <Text style={styles.currentHourTitle}>{currentPlanetLabel}</Text>
        </View>

        <View
          style={[
            styles.powerBadge,
            { backgroundColor: quality.color + '20', borderColor: quality.color },
          ]}
        >
          <Text style={[styles.powerText, { color: quality.color }]}>
            {currentHour.power}% • {windowQuality ? windowLabel : quality.label}
          </Text>
        </View>

        <Text style={styles.endsAt}>
          {t('notifications.timing.endsAt')}: {currentHour.endsAt}
        </Text>
      </View>

      {/* Next Best Hour (if current is not great) */}
      {showNextBestHour && (
        <View style={styles.nextBestContainer}>
          <View style={styles.divider} />

          <Text style={styles.nextBestLabel}>
            ⭐ {t('notifications.timing.nextBestHour')}
          </Text>

          <View style={styles.nextBestContent}>
            <Text style={styles.nextBestPlanet}>
              {getPlanetEmoji(nextBestHour.planet)} {nextBestPlanetLabel}
            </Text>
            <Text style={styles.nextBestTime}>
              {nextBestHour.startsAt} ({t('notifications.timing.inHours')} {nextBestHour.hoursUntil}h)
            </Text>
            <Text style={styles.nextBestPower}>
              {t('notifications.timing.expectedQuality')}: {nextBestHour.power}% ({nextBestQuality?.label ?? t('common.quality.excellent')})
            </Text>
          </View>

          <View style={styles.suggestionBox}>
            <Text style={styles.suggestionText}>
              💡{' '}
              {currentHour.power < 40
                ? t('notifications.timing.waitForBetter')
                : t('notifications.timing.proceedNow')}
            </Text>
          </View>
        </View>
      )}

      {/* If current hour is excellent */}
      {currentHour.power >= 70 && (
        <View style={styles.excellentTimingBox}>
          <Text style={styles.excellentTimingText}>
            ✨ {t('notifications.timing.excellentTiming')}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 12,
  },

  sectionLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },

  scopeText: {
    color: 'rgba(255, 255, 255, 0.55)',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 12,
  },

  windowBadge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 16,
  },
  windowBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },

  currentHourContainer: {
    marginBottom: 16,
  },

  currentHourHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },

  planetEmoji: {
    fontSize: 24,
  },

  currentHourTitle: {
    color: DarkTheme.textPrimary,
    fontSize: 18,
    fontWeight: '600',
  },

  powerBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
  },

  powerText: {
    fontSize: 14,
    fontWeight: '600',
  },

  endsAt: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 13,
  },

  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 16,
  },

  nextBestContainer: {
    marginTop: 8,
  },

  nextBestLabel: {
    color: DarkTheme.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },

  nextBestContent: {
    backgroundColor: 'rgba(100, 180, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },

  nextBestPlanet: {
    color: DarkTheme.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },

  nextBestTime: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginBottom: 4,
  },

  nextBestPower: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 13,
  },

  suggestionBox: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderLeftWidth: 3,
    borderLeftColor: '#3B82F6',
    padding: 12,
    borderRadius: 8,
  },

  suggestionText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 13,
    lineHeight: 18,
  },

  excellentTimingBox: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
  },

  excellentTimingText: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
