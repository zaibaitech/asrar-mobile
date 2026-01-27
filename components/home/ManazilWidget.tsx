/**
 * Manazil (Lunar Mansions) Widget
 * ================================
 * Clean, focused display of today's lunar mansion with personal alignment
 * Matches Daily Energy widget design system exactly
 * 
 * Enhanced with Asrariya Timing Engine for personalized practice timing
 */

import { Borders, DarkTheme, Spacing } from '@/constants/DarkTheme';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProfile } from '@/contexts/ProfileContext';
import { getCosmicLunarMansionForDate, getLunarMansionByIndex, normalizeMansionIndex } from '@/data/lunarMansions';
import { calculateElementalHarmony } from '@/services/ElementalHarmonyService';
import { getCurrentLunarMansion } from '@/services/LunarMansionService';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { PracticeTimingBadge, usePracticeTiming } from './PracticeTimingBadge';

interface ManazilWidgetProps {
  compact?: boolean;
  showDayLabel?: boolean;
  dayLabel?: string;
}

export function ManazilWidget({
  compact = false,
  showDayLabel = false,
  dayLabel = '',
}: ManazilWidgetProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const { profile } = useProfile();

  // Render instantly using deterministic local manzil.
  // Then refresh with server/ephemeris-backed value in the background.
  const [todayIndex, setTodayIndex] = React.useState<number | null>(() => {
    try {
      return getCosmicLunarMansionForDate(new Date()).index;
    } catch {
      return null;
    }
  });
  const [isRealTime, setIsRealTime] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
        const result = await getCurrentLunarMansion(new Date(), timezone);
        if (cancelled) return;
        setTodayIndex(result.index);
        setIsRealTime(result.source === 'ephemeris');
      } catch {
        if (cancelled) return;
        setTodayIndex(null);
        setIsRealTime(false);
      }
    };

    void load();
    const id = setInterval(load, 60 * 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const todayMansion = typeof todayIndex === 'number' ? getLunarMansionByIndex(todayIndex) : null;

  const personalIndex = normalizeMansionIndex(
    profile?.derived?.manazilPersonal ?? profile?.derived?.manazilBaseline
  );
  const personalMansion = typeof personalIndex === 'number' ? getLunarMansionByIndex(personalIndex) : null;

  type ResonanceLevel = 'supportive' | 'harmonious' | 'neutral' | 'challenging' | 'transformative';

  const resonance = React.useMemo((): ResonanceLevel => {
    if (!personalMansion || !todayMansion) return 'neutral';

    if (personalMansion.index === todayMansion.index) return 'supportive';

    const forward = (todayMansion.index - personalMansion.index + 28) % 28;
    const backward = (personalMansion.index - todayMansion.index + 28) % 28;
    const distance = Math.min(forward, backward);

    if (distance === 14) return 'transformative';

    const harmony = calculateElementalHarmony(personalMansion.element, todayMansion.element);
    const elementScore =
      harmony.level === 'Harmonious' ? 0.35 :
      harmony.level === 'Supportive' ? 0.2 :
      harmony.level === 'Challenging' ? -0.2 :
      0;

    const distanceScore =
      distance <= 3 ? 0.2 :
      distance <= 7 ? 0.1 :
      distance <= 10 ? 0 :
      -0.1;

    const total = elementScore + distanceScore;

    if (total >= 0.35) return 'supportive';
    if (total >= 0.15) return 'harmonious';
    if (total > -0.15) return 'neutral';
    if (total > -0.35) return 'challenging';
    return 'transformative';
  }, [personalMansion, todayMansion]);

  const resonanceMeta = React.useMemo(() => {
    const map: Record<ResonanceLevel, { icon: string; color: string }> = {
      supportive: { icon: '✅', color: '#10b981' },
      harmonious: { icon: '🌟', color: '#60A5FA' },
      neutral: { icon: '⚖️', color: '#64B5F6' },
      challenging: { icon: '⚠️', color: '#f59e0b' },
      transformative: { icon: '🔥', color: '#ef4444' },
    };
    return map[resonance];
  }, [resonance]);

  const getElementIcon = (element?: string) => {
    switch (element) {
      case 'fire': return '🔥';
      case 'water': return '💧';
      case 'air': return '🌬️';
      case 'earth': return '🌱';
      default: return '✨';
    }
  };

  const getElementLabel = (element?: string) => {
    if (!element) return '';
    return t(`elements.${element}`);
  };

  const handlePress = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    router.push({
      pathname: '/(tabs)/manazil',
      params: { scrollToTop: String(Date.now()) },
    });
  };

  // If even the deterministic fallback failed, show a non-blocking placeholder (no spinner).
  if (!todayMansion) {
    return (
      <Pressable style={[styles.container, compact && styles.containerCompact]} onPress={handlePress}>
        <View style={[styles.gradient, { backgroundColor: 'rgba(165, 180, 252, 0.08)' }]}>
          <Text style={styles.loadingText}>{t('common.loading')}</Text>
        </View>
      </Pressable>
    );
  }

  const statusTone = personalMansion
    ? (resonance === 'supportive' || resonance === 'harmonious'
        ? 'favorable'
        : resonance === 'neutral'
          ? 'balanced'
          : 'delicate')
    : 'balanced';

  const statusColor =
    statusTone === 'favorable' ? '#10b981' :
    statusTone === 'delicate' ? '#ef4444' :
    '#64B5F6';

  const statusLabel = personalMansion
    ? (statusTone === 'favorable'
        ? t('widgets.manazil.favorable')
        : statusTone === 'balanced'
          ? t('widgets.manazil.balanced')
          : t('widgets.manazil.delicate'))
    : t('widgets.manazil.completeProfile');

  return (
    <Pressable
      style={[styles.container, compact && styles.containerCompact]}
      onPress={handlePress}
      android_ripple={{ color: 'rgba(255, 255, 255, 0.1)' }}
    >
      <View style={[compact ? styles.gradientCompact : styles.gradient, { backgroundColor: `${statusColor}0d` }]}>
        <View style={styles.body}>
          {/* Header - compact like Daily Energy */}
          <View style={styles.header}>
            <View style={styles.headerRow}>
              <View style={styles.headerLeft}>
                {showDayLabel && dayLabel && (
                  <Text style={styles.headerDay} numberOfLines={1}>
                    {dayLabel}
                  </Text>
                )}
                <Ionicons name="moon" size={16} color={DarkTheme.textSecondary} />
                <Text style={styles.headerTitle} numberOfLines={1}>
                  {t('widgets.manazil.title')}
                </Text>
              </View>

              <View
                style={[
                  styles.windowBadge,
                  { backgroundColor: `${statusColor}15`, borderColor: `${statusColor}35` },
                ]}
              >
                <Text style={[styles.windowText, { color: statusColor }]} numberOfLines={1}>
                  {statusLabel}
                </Text>
              </View>
            </View>
          </View>

          {/* Asrariya Practice Timing */}
          <View style={styles.asrariyaRow}>
            <PracticeTimingBadge category="general" compact showScore={false} />
          </View>

          {/* Primary info: label on top, value beneath */}
          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel} numberOfLines={1}>
              {t('widgets.manazil.todaysMansion')}
            </Text>
            <Text style={styles.infoValue} numberOfLines={1} ellipsizeMode="tail">
              {todayMansion.nameTransliteration}
            </Text>
            <Text style={styles.infoSubValue} numberOfLines={1} ellipsizeMode="tail">
              {todayMansion.nameArabic}
            </Text>
          </View>

          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel} numberOfLines={1}>
              {t('widgets.manazil.yourMansion')}
            </Text>
            {personalMansion ? (
              <>
                <Text style={styles.infoValue} numberOfLines={1} ellipsizeMode="tail">
                  {personalMansion.nameTransliteration}
                </Text>
                <Text style={styles.infoSubValue} numberOfLines={1} ellipsizeMode="tail">
                  {personalMansion.nameArabic}
                </Text>
              </>
            ) : (
              <Text style={styles.infoValueMuted} numberOfLines={1} ellipsizeMode="tail">
                {t('widgets.manazil.completeProfile')}
              </Text>
            )}
          </View>

          {/* Elements row: Daily + You */}
          <View style={styles.pillsRow}>
            <View style={styles.pillColumn}>
              <Text style={styles.pillLabel} numberOfLines={1}>
                {t('widgets.manazil.dailyElement')}
              </Text>
              <View
                style={[
                  styles.elementBadgeSmall,
                  {
                    backgroundColor: `${getElementColor(todayMansion.element)}26`,
                    borderColor: `${getElementColor(todayMansion.element)}44`,
                  },
                ]}
              >
                <Text style={styles.elementIconSmall}>{getElementIcon(todayMansion.element)}</Text>
                <Text style={styles.elementLabelSmall} numberOfLines={1} ellipsizeMode="tail">
                  {getElementLabel(todayMansion.element)}
                </Text>
              </View>
            </View>

            <View style={styles.pillColumn}>
              <Text style={styles.pillLabel} numberOfLines={1}>
                {t('widgets.manazil.yourElement')}
              </Text>
              <View
                style={[
                  styles.elementBadgeSmall,
                  {
                    backgroundColor: `${getElementColor(personalMansion?.element)}26`,
                    borderColor: `${getElementColor(personalMansion?.element)}44`,
                    opacity: personalMansion ? 1 : 0.55,
                  },
                ]}
              >
                <Text style={styles.elementIconSmall}>
                  {getElementIcon(personalMansion?.element)}
                </Text>
                <Text style={styles.elementLabelSmall} numberOfLines={1} ellipsizeMode="tail">
                  {personalMansion ? getElementLabel(personalMansion.element) : '—'}
                </Text>
              </View>
            </View>
          </View>

          {/* Resonance / guidance (fixed height, 1–2 lines) */}
          <View style={styles.resonanceBlock}>
            <Text style={styles.resonanceLabel} numberOfLines={1}>
              {t('widgets.manazil.resonanceLabel')}
            </Text>
            <Text style={styles.resonanceText} numberOfLines={2} ellipsizeMode="tail">
              {personalMansion
                ? t(`widgets.manazil.guidanceByResonance.${resonance}`)
                : t('widgets.manazil.personalMissing')}
            </Text>
          </View>

          {/* Asrariya Practice Timing */}
          <ManazilTimingIndicator t={t} />
        </View>

        {/* Footer - EXACT match to Daily Energy */}
        <View style={[styles.footer, compact && styles.footerCompact]}>
          <View style={styles.disclaimerRow}>
            <Ionicons name="information-circle-outline" size={12} color={DarkTheme.textTertiary} />
            <Text style={styles.disclaimerText} numberOfLines={1}>
              {t('widgets.manazil.reflection')}
            </Text>
          </View>
          <Text style={styles.ctaText} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>
            {t('widgets.manazil.understandResonance')} →
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

// Helper function for element colors
function getElementColor(element?: string): string {
  switch (element) {
    case 'fire': return '#fb7185';
    case 'water': return '#60a5fa';
    case 'air': return '#a78bfa';
    case 'earth': return '#4ade80';
    default: return '#64B5F6';
  }
}

/**
 * Manazil Timing Indicator
 * Shows personalized guidance timing based on current lunar mansion
 */
const TIMING_META: Record<string, { icon: string; color: string }> = {
  optimal: { icon: '✨', color: '#10b981' },
  favorable: { icon: '🌟', color: '#60A5FA' },
  moderate: { icon: '⚖️', color: '#f59e0b' },
  challenging: { icon: '⚠️', color: '#f97316' },
  avoid: { icon: '🚫', color: '#ef4444' },
};

function ManazilTimingIndicator({ t }: { t: (key: string) => string }) {
  const { timing, isLoading } = usePracticeTiming('guidance'); // Manazil is about guidance
  
  if (isLoading || !timing) {
    return null;
  }
  
  const meta = TIMING_META[timing.level] || TIMING_META.moderate;
  
  return (
    <View style={[timingStyles.container, { borderColor: `${meta.color}30`, backgroundColor: `${meta.color}08` }]}>
      <View style={timingStyles.row}>
        <Text style={timingStyles.icon}>{meta.icon}</Text>
        <Text style={timingStyles.label}>{t('asrariya.practices.guidance') || 'Guidance'}</Text>
        <View style={[timingStyles.badge, { backgroundColor: `${meta.color}20`, borderColor: `${meta.color}40` }]}>
          <Text style={[timingStyles.badgeText, { color: meta.color }]}>
            {t(`asrariya.timing.${timing.level}`) || timing.level}
          </Text>
        </View>
      </View>
    </View>
  );
}

const timingStyles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  icon: {
    fontSize: 11,
  },
  label: {
    fontSize: 10,
    color: DarkTheme.textSecondary,
    fontWeight: '500' as any,
  },
  badge: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 'auto',
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '600' as any,
  },
});

const styles = StyleSheet.create({
  // Container - EXACT match
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

  // Header (compact)
  header: {
    gap: 6,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    minWidth: 0,
  },
  headerDay: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.6)',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    flexShrink: 0,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: DarkTheme.textPrimary,
    flexShrink: 1,
    minWidth: 0,
  },

  asrariyaRow: {
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  windowBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    maxWidth: '55%',
  },
  windowText: {
    fontSize: 13,
    fontWeight: '600',
    flexShrink: 1,
  },

  // Info blocks
  infoBlock: {
    gap: 2,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.7)',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '700',
    color: DarkTheme.textPrimary,
  },
  infoSubValue: {
    fontSize: 13,
    fontWeight: '500',
    color: DarkTheme.textSecondary,
  },
  infoValueMuted: {
    fontSize: 14,
    fontWeight: '600',
    color: DarkTheme.textTertiary,
  },

  // Element pills row
  pillsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  pillColumn: {
    flex: 1,
    minWidth: 0,
    gap: 6,
  },
  pillLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.7)',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  elementBadgeSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    maxWidth: '100%',
  },
  elementIconSmall: {
    fontSize: 14,
  },
  elementLabelSmall: {
    fontSize: 13,
    fontWeight: '700',
    color: DarkTheme.textSecondary,
    flexShrink: 1,
    minWidth: 0,
  },

  // Resonance block
  resonanceBlock: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 10,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: 6,
    minHeight: 62,
  },
  resonanceLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.7)',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  resonanceText: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
    lineHeight: 16,
  },

  // Best For Card - EXACT match to Daily Energy
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
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bestForText: {
    fontSize: 11,
    color: DarkTheme.textSecondary,
    lineHeight: 16,
  },

  // Footer - EXACT match to Daily Energy
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
    fontSize: 14,
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