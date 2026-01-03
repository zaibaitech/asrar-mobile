import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
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
} from '@/services/MomentAlignmentService';
import { PlanetaryHourData } from '@/services/PlanetaryHoursService';

interface MomentAlignmentCardProps {
  status?: AlignmentStatus;
  statusLabel?: string;
  hintText?: string;
  zahirElement?: Element;
  timeElement?: Element;
  updatedAt?: string;
  loading?: boolean;
  hasProfileName?: boolean;
  t: (key: string) => string;
  planetaryData?: PlanetaryHourData | null;
  causeText?: string; // Cause-based explanation text
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

function getUpdatedLabel(updatedAt: string | undefined, t: (key: string) => string) {
  if (!updatedAt) {
    return '';
  }

  const updatedDate = new Date(updatedAt);
  if (Number.isNaN(updatedDate.getTime())) {
    return '';
  }

  const diffMs = Date.now() - updatedDate.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes <= 0) {
    return t('home.moment.updated.justNow');
  }

  if (diffMinutes === 1) {
    return t('home.moment.updated.minute');
  }

  if (diffMinutes < 60) {
    const template = t('home.moment.updated.minutes');
    return template.replace('{count}', String(diffMinutes));
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours === 1) {
    return t('home.moment.updated.hour');
  }

  const template = t('home.moment.updated.hours');
  return template.replace('{count}', String(diffHours));
}

export function MomentAlignmentCard({
  status,
  statusLabel,
  hintText,
  zahirElement,
  timeElement,
  updatedAt,
  loading,
  hasProfileName,
  t,
  planetaryData,
  causeText,
}: MomentAlignmentCardProps) {
  const router = useRouter();

  const handlePress = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      // Haptics not available - fail silently
    }
    
    // Navigate to moment alignment details with data
    router.push({
      pathname: '/(tabs)/moment-alignment-detail',
      params: {
        status: status || '',
        zahirElement: zahirElement || '',
        timeElement: timeElement || '',
        causeText: causeText || hintText || '',
        // Pass planetary data if available
        currentPlanet: planetaryData?.currentHour.planet || '',
        nextPlanet: planetaryData?.nextHour.planet || '',
        countdownSeconds: planetaryData?.countdownSeconds || 0,
      },
    });
  };

  const goToProfileName = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {}
    router.push('/(tabs)/name-destiny');
  };

  const theme = status ? STATUS_THEME[status] : DEFAULT_THEME;
  const updatedLabel = useMemo(() => getUpdatedLabel(updatedAt, t), [updatedAt, t]);

  const renderElementChip = (labelKey: string, element?: Element) => {
    if (!element) {
      return null;
    }

    const accent = ElementAccents[element];

    return (
      <View style={styles.elementChip}>
        <View style={[styles.elementIconBadge, { backgroundColor: accent.glow }]}> 
          <Text style={styles.elementIcon}>{accent.emoji}</Text>
        </View>
        <View style={styles.elementTextColumn}>
          <Text style={styles.elementChipLabel}>{t(labelKey)}</Text>
          <Text style={[styles.elementChipValue, { color: accent.primary }]}>
            {getElementLabel(element, t)}
          </Text>
        </View>
      </View>
    );
  };

  // Empty state when user has no name configured
  if (!hasProfileName && !loading) {
    return (
      <Pressable
        style={styles.container}
        onPress={goToProfileName}
        android_ripple={{ color: 'rgba(139, 115, 85, 0.2)', borderless: false }}
      >
        <LinearGradient
          colors={[`${DEFAULT_THEME.glow}`, 'rgba(45, 21, 21, 0.45)']}
          style={styles.gradient}
        >
          <View style={styles.emptyState}>
            <View style={[styles.headerLeft, styles.emptyHeader]}> 
              <View style={[styles.headerIcon, { backgroundColor: DEFAULT_THEME.glow }]}> 
                <Ionicons name="sparkles-outline" size={16} color={DEFAULT_THEME.accent} />
              </View>
              <Text style={styles.headerTitle}>{t('home.moment.title')}</Text>
            </View>
            <Text style={styles.emptyHint}>{t('home.moment.addNamePrompt')}</Text>
            <View style={styles.footerRow}>
              <Ionicons name="arrow-forward" size={12} color={DarkTheme.textTertiary} />
              <Text style={styles.footerText}>{t('common.tapForDetails')}</Text>
            </View>
          </View>
        </LinearGradient>
      </Pressable>
    );
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>{t('common.loading')}</Text>
      </View>
    );
  }

  return (
    <Pressable
      style={styles.container}
      onPress={handlePress}
      android_ripple={{ color: `${theme.accent}22`, borderless: false }}
    >
      <LinearGradient
        colors={[`${theme.glow}`, 'rgba(35, 25, 45, 0.85)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.cardContent}>
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <View style={[styles.headerIcon, { backgroundColor: theme.pillBackground }]}> 
                <Ionicons name="sparkles-outline" size={18} color={theme.accent} />
              </View>
              <Text style={styles.headerTitle} numberOfLines={1}>
                {t('home.moment.title')}
              </Text>
            </View>
            <View style={styles.headerAction}>
              <Text style={styles.headerActionText}>{t('home.moment.details')}</Text>
              <Ionicons name="chevron-forward" size={14} color={DarkTheme.textTertiary} />
            </View>
          </View>

          {statusLabel && (
            <View style={[styles.statusPill, { borderColor: theme.accent, backgroundColor: theme.pillBackground }]}> 
              <View style={[styles.statusDot, { backgroundColor: theme.accent }]} />
              <Text style={[styles.statusLabel, { color: theme.accent }]}>{statusLabel}</Text>
            </View>
          )}

          {/* Current Planetary Hour */}
          {planetaryData && (
            <View style={styles.planetaryRow}>
              <Text style={styles.planetaryIcon}>{planetaryData.currentHour.planetInfo.symbol}</Text>
              <View style={styles.planetaryTextContainer}>
                <Text style={styles.planetaryLabel}>Current Hour: </Text>
                <Text style={styles.planetaryText}>{planetaryData.currentHour.planet}</Text>
                <Text style={styles.planetaryArabic}> ({planetaryData.currentHour.planetInfo.arabicName})</Text>
              </View>
            </View>
          )}

          {/* Cause-based hint text */}
          {causeText && (
            <Text style={styles.signalText} numberOfLines={2}>
              {causeText}
            </Text>
          )}

          <View style={styles.elementColumn}>
            {renderElementChip('home.moment.you', zahirElement)}
            {renderElementChip('home.moment.now', timeElement)}
          </View>
        </View>

        <View style={styles.footerRow}>
          <Ionicons name="arrow-forward" size={12} color={DarkTheme.textTertiary} />
          <Text style={styles.footerText}>{t('common.tapForDetails')}</Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: Borders.radiusLg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    overflow: 'hidden',
    backgroundColor: 'rgba(30, 20, 36, 0.65)',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  loadingText: {
    fontSize: Typography.caption,
    color: DarkTheme.textSecondary,
  },
  gradient: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    gap: Spacing.md,
    flex: 1,
    justifyContent: 'space-between',
  },
  cardContent: {
    gap: Spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flexShrink: 1,
  },
  headerIcon: {
    width: 26,
    height: 26,
    borderRadius: Borders.radiusCircle,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(139, 115, 85, 0.2)',
  },
  headerTitle: {
    fontSize: Typography.caption + 1,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
    letterSpacing: 0.4,
    flexShrink: 1,
  },
  headerAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  headerActionText: {
    fontSize: Typography.caption,
    color: DarkTheme.textTertiary,
    fontWeight: Typography.weightMedium,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Borders.radiusMd,
    borderWidth: 1,
    marginTop: Spacing.sm,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusLabel: {
    fontSize: Typography.caption,
    fontWeight: Typography.weightBold,
    letterSpacing: 0.8,
  },
  planetaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: Spacing.xs,
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
  },
  planetaryLabel: {
    fontSize: 11,
    color: DarkTheme.textTertiary,
    fontWeight: '600',
  },
  planetaryText: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
    fontWeight: '700',
  },
  planetaryArabic: {
    fontSize: 10,
    color: DarkTheme.textTertiary,
  },
  signalText: {
    fontSize: Typography.label,
    lineHeight: Typography.label * Typography.lineHeightNormal,
    color: DarkTheme.textSecondary,
    marginTop: Spacing.xs,
  },
  elementColumn: {
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  elementChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: Borders.radiusMd,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  elementIconBadge: {
    width: 26,
    height: 26,
    borderRadius: Borders.radiusCircle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  elementIcon: {
    fontSize: 16,
  },
  elementTextColumn: {
    flex: 1,
  },
  elementChipLabel: {
    fontSize: Typography.caption,
    color: DarkTheme.textTertiary,
    fontWeight: Typography.weightMedium,
    letterSpacing: 0.3,
  },
  elementChipValue: {
    fontSize: Typography.label,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textSecondary,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing.sm,
  },
  footerText: {
    fontSize: Typography.caption,
    color: DarkTheme.textTertiary,
    fontWeight: Typography.weightMedium,
  },
  footerSeparator: {
    fontSize: Typography.caption,
    color: DarkTheme.textTertiary,
    opacity: 0.7,
  },
  updatedText: {
    fontSize: Typography.caption,
    color: DarkTheme.textMuted,
  },
  emptyState: {
    gap: Spacing.md,
  },
  emptyHeader: {
    justifyContent: 'flex-start',
  },
  emptyHint: {
    fontSize: Typography.label,
    color: DarkTheme.textSecondary,
    lineHeight: Typography.label * Typography.lineHeightNormal,
  },
});
