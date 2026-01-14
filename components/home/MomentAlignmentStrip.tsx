import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
    Borders,
    DarkTheme,
    ElementAccents,
    Spacing,
    Typography,
} from '@/constants/DarkTheme';
import {
    AlignmentStatus,
    Element,
    getAlignmentStatusForElements,
} from '@/services/MomentAlignmentService';
import { PlanetaryHourData } from '@/services/PlanetaryHoursService';

interface MomentAlignmentStripProps {
  status?: AlignmentStatus;
  statusLabel?: string;
  zahirElement?: Element;
  timeElement?: Element;
  loading?: boolean;
  hasProfileName?: boolean;
  t: (key: string) => string;
  planetaryData?: PlanetaryHourData | null;
}

type StatusVisual = {
  accent: string;
  glow: string;
  pillBackground: string;
};

const STATUS_THEME: Record<AlignmentStatus, StatusVisual> = {
  ACT: {
    accent: '#818CF8',
    glow: 'rgba(129, 140, 248, 0.16)',
    pillBackground: 'rgba(129, 140, 248, 0.25)',
  },
  MAINTAIN: {
    accent: '#38BDF8',
    glow: 'rgba(56, 189, 248, 0.16)',
    pillBackground: 'rgba(56, 189, 248, 0.22)',
  },
  HOLD: {
    accent: '#94A3B8',
    glow: 'rgba(148, 163, 184, 0.14)',
    pillBackground: 'rgba(148, 163, 184, 0.18)',
  },
};

const DEFAULT_THEME: StatusVisual = {
  accent: '#8B7355',
  glow: 'rgba(139, 115, 85, 0.14)',
  pillBackground: 'rgba(139, 115, 85, 0.18)',
};

function getElementLabel(element: Element | undefined, t: (key: string) => string) {
  if (!element) {
    return '';
  }
  return t(`elements.${element}`);
}

function formatCountdownShort(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m`;
  return `${secs}s`;
}

export function MomentAlignmentStrip({
  status,
  statusLabel,
  zahirElement,
  timeElement,
  loading,
  hasProfileName,
  t,
  planetaryData,
}: MomentAlignmentStripProps) {
  const router = useRouter();
  const theme = status ? STATUS_THEME[status] : DEFAULT_THEME;

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Navigate to moment alignment details with data
    router.push({
      pathname: '/(tabs)/moment-alignment-detail',
      params: {
        status: status || '',
        zahirElement: zahirElement || '',
        timeElement: timeElement || '',
        causeText: '',
        // Pass planetary data if available
        currentPlanet: planetaryData?.currentHour.planet || '',
        nextPlanet: planetaryData?.nextHour.planet || '',
        countdownSeconds: planetaryData?.countdownSeconds || 0,
      },
    });
  };

  const goToProfileName = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/name-destiny');
  };

  if (!hasProfileName && !loading) {
    return null; // Don't show strip if no profile name
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>{t('common.loading')}</Text>
      </View>
    );
  }

  const renderElementPill = (labelKey: string, element?: Element) => {
    if (!element) {
      return null;
    }

    const accent = ElementAccents[element];

    return (
      <View style={styles.elementPill}>
        <View style={[styles.elementPillIcon, { backgroundColor: accent.glow }]}>
          <Text style={styles.elementPillEmoji}>{accent.emoji}</Text>
        </View>
        <View style={styles.elementPillContent}>
          <Text style={styles.elementPillLabel} numberOfLines={1} ellipsizeMode="tail">
            {t(labelKey)}
          </Text>
          <Text style={[styles.elementPillValue, { color: accent.primary }]} numberOfLines={1} ellipsizeMode="tail">
            {getElementLabel(element, t)}
          </Text>
        </View>
      </View>
    );
  };

  const nextHourPreview = (() => {
    if (!planetaryData) return null;
    if (!zahirElement) return null;
    const seconds = planetaryData.countdownSeconds;
    if (!(seconds > 0 && seconds <= 10 * 60)) return null;

    const nextElement = planetaryData.nextHour.planetInfo.element;
    const nextStatus = getAlignmentStatusForElements(zahirElement, nextElement);

    const statusKey: Record<AlignmentStatus, string> = {
      ACT: 'home.moment.status.act',
      MAINTAIN: 'home.moment.status.maintain',
      HOLD: 'home.moment.status.hold',
    };

    return {
      seconds,
      nextElement,
      nextStatus,
      nextStatusLabel: t(statusKey[nextStatus]),
      nextPlanetLabel: t(`planets.${planetaryData.nextHour.planet.toLowerCase()}`),
      nextPlanetArabic: planetaryData.nextHour.planetInfo.arabicName,
    };
  })();

  return (
    <View style={styles.container}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={styles.headerIcon}>
            <Ionicons name="sparkles-outline" size={18} color="#8B7355" />
          </View>
          <Text style={styles.headerTitle} numberOfLines={2}>
            {t('home.cards.momentAlignment.title')}
          </Text>
        </View>
        {statusLabel && (
          <View style={[styles.statusChip, { borderColor: theme.accent, backgroundColor: theme.pillBackground }]}>
            <View style={[styles.statusDot, { backgroundColor: theme.accent }]} />
            <Text style={[styles.statusLabel, { color: theme.accent }]} numberOfLines={1}>
              {statusLabel}
            </Text>
          </View>
        )}
      </View>

      {/* Planetary Hour Info */}
      {planetaryData && (
        <View style={styles.planetaryRow}>
          <Text style={styles.planetaryIcon}>{planetaryData.currentHour.planetInfo.symbol}</Text>
          <View style={styles.planetaryTextContainer}>
            <Text style={styles.planetaryLabel}>{t('home.cards.momentAlignment.nowLabel')}: </Text>
            <Text style={styles.planetaryText} numberOfLines={1} ellipsizeMode="tail">
              {t(`planets.${planetaryData.currentHour.planet.toLowerCase()}`)}
            </Text>
            <Text style={styles.planetaryArabic} numberOfLines={1} ellipsizeMode="tail">
              {' '}({planetaryData.currentHour.planetInfo.arabicName})
            </Text>
          </View>
        </View>
      )}

      {/* Element Pills - Responsive Layout */}
      {(zahirElement || timeElement) && (
        <View style={styles.elementRow}>
          {renderElementPill('home.cards.momentAlignment.youLabel', zahirElement)}
          {renderElementPill('home.cards.momentAlignment.momentLabel', timeElement)}
        </View>
      )}

      {/* Next hour preview (avoid confusing current vs upcoming) */}
      {nextHourPreview && (
        <View style={styles.previewRow}>
          <Text style={styles.previewLabel} numberOfLines={1} ellipsizeMode="tail">
            {t('home.nextPlanetHour')}
          </Text>
          <Text style={styles.previewValue} numberOfLines={1} ellipsizeMode="tail">
            {nextHourPreview.nextPlanetLabel} ({nextHourPreview.nextPlanetArabic}) • {getElementLabel(nextHourPreview.nextElement, t)} • {formatCountdownShort(nextHourPreview.seconds)}
          </Text>
          <View style={[styles.previewStatus, { borderColor: STATUS_THEME[nextHourPreview.nextStatus].accent, backgroundColor: STATUS_THEME[nextHourPreview.nextStatus].pillBackground }]}
          >
            <Text style={[styles.previewStatusText, { color: STATUS_THEME[nextHourPreview.nextStatus].accent }]} numberOfLines={1}>
              {nextHourPreview.nextStatusLabel}
            </Text>
          </View>
        </View>
      )}

      {/* CTA Button */}
      <Pressable 
        style={styles.ctaButton}
        onPress={handlePress}
        android_ripple={{ color: 'rgba(139, 115, 85, 0.2)', borderless: false }}
      >
        <Text style={styles.ctaText} numberOfLines={1}>
          {t('home.cards.momentAlignment.cta')}
        </Text>
        <Ionicons name="arrow-forward" size={16} color="#8B7355" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'rgba(30, 20, 36, 0.65)',
    borderRadius: Borders.radiusLg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    gap: Spacing.md,
  },
  loadingText: {
    fontSize: Typography.caption,
    color: DarkTheme.textSecondary,
    textAlign: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    minWidth: 0,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
    minWidth: 0,
  },
  headerIcon: {
    width: 26,
    height: 26,
    borderRadius: Borders.radiusCircle,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(139, 115, 85, 0.2)',
    flexShrink: 0,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
    letterSpacing: 0.3,
    flex: 1,
    minWidth: 0,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Borders.radiusSm,
    borderWidth: 1,
    flexShrink: 0,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusLabel: {
    fontSize: 10,
    fontWeight: Typography.weightBold,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  planetaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: Borders.radiusSm,
  },
  planetaryIcon: {
    fontSize: 16,
    flexShrink: 0,
  },
  planetaryTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    flex: 1,
    minWidth: 0,
  },
  planetaryLabel: {
    fontSize: 12,
    color: DarkTheme.textTertiary,
    fontWeight: Typography.weightSemibold,
  },
  planetaryText: {
    fontSize: 12,
    color: DarkTheme.textPrimary,
    fontWeight: Typography.weightSemibold,
    flexShrink: 1,
  },
  planetaryArabic: {
    fontSize: 11,
    color: DarkTheme.textSecondary,
    fontWeight: Typography.weightMedium,
    flexShrink: 1,
  },
  elementRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    minWidth: 0,
  },
  elementPill: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  elementPillIcon: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    borderRadius: 16,
  },
  elementPillEmoji: {
    fontSize: 18,
  },
  elementPillContent: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  elementPillLabel: {
    fontSize: 10,
    color: DarkTheme.textTertiary,
    fontWeight: Typography.weightMedium,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
    opacity: 0.75,
    marginBottom: 2,
  },
  elementPillValue: {
    fontSize: 14,
    fontWeight: Typography.weightBold,
    letterSpacing: 0.15,
    lineHeight: 18,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: Spacing.lg,
    backgroundColor: 'rgba(139, 115, 85, 0.15)',
    borderRadius: Borders.radiusMd,
    borderWidth: 1,
    borderColor: 'rgba(139, 115, 85, 0.25)',
    width: '100%',
  },
  ctaText: {
    fontSize: 14,
    fontWeight: Typography.weightSemibold,
    letterSpacing: 0.3,
    color: '#8B7355',
  },
  previewRow: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: Borders.radiusMd,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    gap: 6,
  },
  previewLabel: {
    fontSize: 11,
    color: DarkTheme.textTertiary,
    fontWeight: Typography.weightMedium,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  previewValue: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
    fontWeight: Typography.weightMedium,
  },
  previewStatus: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: Borders.radiusSm,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  previewStatusText: {
    fontSize: 10,
    fontWeight: Typography.weightBold,
    letterSpacing: 0.3,
  },
});
