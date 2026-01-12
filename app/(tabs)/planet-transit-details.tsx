import { DarkTheme, ElementAccents, Spacing, Typography } from '@/constants/DarkTheme';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProfile } from '@/contexts/ProfileContext';
import type { Element } from '@/services/MomentAlignmentService';
import type { PlanetTransitInfo } from '@/services/PlanetTransitService';
import { formatZodiacWithArabic, resolveUserZodiacKey } from '@/utils/translationHelpers';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type DetailsType = 'transit' | 'nextDay';

type NextDayPayload = {
  dayName: string;
  dayNameArabic: string;
  planetArabic: string;
  emoji: string;
  element: Element;
};

type HarmonyLevel = 'harmonious' | 'supportive' | 'neutral' | 'challenging';

function safeJsonParse<T>(value: unknown): T | null {
  if (!value || typeof value !== 'string') return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function toTitleCase(value: string) {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function getHarmonyLevel(userElement: Element, contextElement: Element): HarmonyLevel {
  if (userElement === contextElement) return 'harmonious';

  const complementary =
    (userElement === 'fire' && contextElement === 'air') ||
    (userElement === 'air' && contextElement === 'fire') ||
    (userElement === 'water' && contextElement === 'earth') ||
    (userElement === 'earth' && contextElement === 'water');
  if (complementary) return 'supportive';

  const opposing =
    (userElement === 'fire' && contextElement === 'water') ||
    (userElement === 'water' && contextElement === 'fire') ||
    (userElement === 'earth' && contextElement === 'air') ||
    (userElement === 'air' && contextElement === 'earth');
  if (opposing) return 'challenging';

  return 'neutral';
}

function formatCountdown(totalSeconds: number) {
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(clamped / 60);
  const seconds = clamped % 60;
  return `${minutes}m ${seconds.toString().padStart(2, '0')}s`;
}

export default function PlanetTransitDetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t, tSafe, language } = useLanguage();
  const { profile } = useProfile();
  const params = useLocalSearchParams();

  const detailsType = (params.type as DetailsType) || 'transit';
  const payload = params.payload;

  const transitPayload = useMemo(() => safeJsonParse<PlanetTransitInfo>(payload), [payload]);
  const nextDayPayload = useMemo(() => safeJsonParse<NextDayPayload>(payload), [payload]);

  const contextElement: Element | null =
    detailsType === 'transit'
      ? (transitPayload?.elementKey as Element | undefined) ?? null
      : (nextDayPayload?.element as Element | undefined) ?? null;

  const userElement = (profile.derived?.element as Element | undefined) ?? null;
  const userZodiacKey = useMemo(
    () =>
      resolveUserZodiacKey({
        burjIndex: profile.derived?.burjIndex,
        burj: profile.derived?.burj,
      }),
    [profile.derived?.burjIndex, profile.derived?.burj]
  );

  const harmony: HarmonyLevel | null =
    contextElement && userElement ? getHarmonyLevel(userElement, contextElement) : null;

  const accent = contextElement ? ElementAccents[contextElement] : ElementAccents.earth;

  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const countdownText = useMemo(() => {
    if (detailsType !== 'transit' || !transitPayload?.nextHourStartTime) return null;
    const next = new Date(transitPayload.nextHourStartTime as any);
    const diffSeconds = Math.floor((next.getTime() - now.getTime()) / 1000);
    return formatCountdown(diffSeconds);
  }, [detailsType, transitPayload?.nextHourStartTime, now]);

  const title = t('home.planetTransitDetails.title');
  const explainer =
    detailsType === 'transit'
      ? t('home.planetTransitDetails.explainers.currentHour')
      : t('home.planetTransitDetails.explainers.tomorrowRuler');
  const personalizationLine =
    detailsType === 'transit'
      ? t('home.planetTransitDetails.subtitleNow')
      : t('home.planetTransitDetails.subtitleNextDay');

  const primaryCardTitle =
    detailsType === 'transit'
      ? t('home.planetTransitDetails.sections.currentHour')
      : t('home.planetTransitDetails.sections.tomorrowRuler');
  const primaryCardHint =
    detailsType === 'transit'
      ? t('home.planetTransitDetails.hints.currentHour')
      : t('home.planetTransitDetails.hints.tomorrowRuler');

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={DarkTheme.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.headerSubtitle} numberOfLines={2}>
            {primaryCardTitle}
          </Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <LinearGradient
        colors={[`${accent.primary}22`, `${accent.primary}08`, DarkTheme.screenBackground]}
        style={styles.gradientContainer}
      >
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Explainer */}
          <Text style={styles.explainerText}>{explainer}</Text>
          <Text style={styles.explainerMeta}>{personalizationLine}</Text>
          {/* Primary Context */}
          <View style={[styles.card, { borderColor: `${accent.primary}40` }]}>
            <Text style={styles.sectionTitleInCard}>{primaryCardTitle}</Text>
            <Text style={styles.cardHint}>{primaryCardHint}</Text>
            {detailsType === 'transit' && transitPayload ? (
              <>
                <View style={styles.rowCenter}>
                  <Text style={styles.bigSymbol}>{transitPayload.planetSymbol}</Text>
                  <View style={styles.namesCol}>
                    <Text style={styles.primaryName} numberOfLines={1}>
                      {transitPayload.planetName}
                    </Text>
                    <Text style={styles.secondaryName} numberOfLines={1}>
                      {transitPayload.planetNameAr}
                    </Text>
                  </View>
                </View>

                <View style={styles.pillsRow}>
                  <View style={[styles.pill, { backgroundColor: accent.glow }]}>
                    <Text style={styles.pillLabel}>{t('home.planetTransitDetails.pills.element')}</Text>
                    <Text style={[styles.pillValue, { color: accent.primary }]}>
                      {tSafe(`common.elements.${transitPayload.elementKey}`, toTitleCase(transitPayload.elementKey))}
                    </Text>
                  </View>

                  <View style={[styles.pill, { backgroundColor: accent.glow }]}>
                    <Text style={styles.pillLabel}>{t('home.planetTransitDetails.pills.sign')}</Text>
                    <Text style={[styles.pillValue, { color: accent.primary }]} numberOfLines={1}>
                      {transitPayload.zodiacSymbol} {formatZodiacWithArabic(transitPayload.zodiacKey, language as any)}
                    </Text>
                  </View>
                </View>

                {countdownText && (
                  <Text style={styles.metaText}>
                    {t('home.planetTransitDetails.nextChange', { countdown: countdownText })}
                  </Text>
                )}
              </>
            ) : detailsType === 'nextDay' && nextDayPayload ? (
              <>
                <View style={styles.rowCenter}>
                  <Text style={styles.bigSymbol}>{nextDayPayload.emoji}</Text>
                  <View style={styles.namesCol}>
                    <Text style={styles.primaryName} numberOfLines={1}>
                      {nextDayPayload.dayName}
                    </Text>
                    <Text style={styles.secondaryName} numberOfLines={1}>
                      {nextDayPayload.dayNameArabic}
                    </Text>
                  </View>
                </View>

                <View style={styles.pillsRow}>
                  <View style={[styles.pill, { backgroundColor: accent.glow }]}>
                    <Text style={styles.pillLabel}>{t('home.planetTransitDetails.pills.dayRuler')}</Text>
                    <Text style={[styles.pillValue, { color: accent.primary }]} numberOfLines={1}>
                      {nextDayPayload.planetArabic}
                    </Text>
                  </View>
                  <View style={[styles.pill, { backgroundColor: accent.glow }]}>
                    <Text style={styles.pillLabel}>{t('home.planetTransitDetails.pills.element')}</Text>
                    <Text style={[styles.pillValue, { color: accent.primary }]}>
                      {tSafe(`common.elements.${nextDayPayload.element}`, toTitleCase(nextDayPayload.element))}
                    </Text>
                  </View>
                </View>
              </>
            ) : (
              <Text style={styles.bodyText}>{t('home.planetTransitDetails.error')}</Text>
            )}
          </View>

          {/* Your Nature */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('home.planetTransitDetails.sections.yourNature')}</Text>
            {userElement ? (
              <View style={styles.card}>
                <Text style={styles.bodyText}>
                  {t('home.planetTransitDetails.yourElement', {
                    element: tSafe(`common.elements.${userElement}`, toTitleCase(userElement)),
                  })}
                </Text>
                {userZodiacKey ? (
                  <Text style={styles.bodyText}>
                    {t('home.planetTransitDetails.yourZodiac', {
                      zodiac: formatZodiacWithArabic(userZodiacKey, language as any, {
                        // EN/FR must never show Arabic-only
                        forceBilingual: language !== 'ar',
                        // AR future: العربية (Latin)
                        arabicFirst: true,
                        includeGlyph: true,
                      }),
                    })}
                  </Text>
                ) : null}
              </View>
            ) : (
              <View style={styles.card}>
                <Text style={styles.bodyText}>{t('home.planetTransitDetails.missingProfile')}</Text>
                <TouchableOpacity
                  style={[styles.profileButton, { backgroundColor: accent.primary }]}
                  onPress={() => router.push('/profile')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.profileButtonText}>{t('home.planetTransitDetails.completeProfile')}</Text>
                  <Ionicons name="arrow-forward" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Resonance */}
          {contextElement ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('home.planetTransitDetails.sections.resonance')}</Text>
              <Text style={styles.contextLine}>{t('home.planetTransitDetails.sections.context')}</Text>
              <View style={styles.card}>
                {harmony ? (
                  <>
                    <View style={[styles.badge, { backgroundColor: `${accent.primary}22`, borderColor: `${accent.primary}55` }]}>
                      <Text style={[styles.badgeText, { color: accent.primary }]}>
                        {t(`home.planetTransitDetails.harmony.${harmony}.label`)}
                      </Text>
                    </View>
                    <Text style={styles.bodyText}>
                      {t(`home.planetTransitDetails.harmony.${harmony}.description`, {
                        userElement: tSafe(`common.elements.${userElement}`, toTitleCase(userElement as string)).toLowerCase(),
                        contextElement: tSafe(`common.elements.${contextElement}`, toTitleCase(contextElement)).toLowerCase(),
                      })}
                    </Text>
                    
                    {/* Reflection Guidance Block */}
                    <View style={styles.reflectionBlock}>
                      <View style={styles.reflectionRow}>
                        <Ionicons name="checkmark-circle" size={16} color={accent.primary} />
                        <Text style={[styles.reflectionText, { color: accent.primary }]}>
                          {t(`home.planetTransitDetails.harmony.${harmony}.bestFor`)}
                        </Text>
                      </View>
                      <View style={styles.reflectionRow}>
                        <Ionicons name="remove-circle-outline" size={16} color={DarkTheme.textTertiary} />
                        <Text style={[styles.reflectionText, { color: DarkTheme.textTertiary }]}>
                          {t(`home.planetTransitDetails.harmony.${harmony}.avoid`)}
                        </Text>
                      </View>
                    </View>
                  </>
                ) : (
                  <Text style={styles.bodyText}>{t('home.planetTransitDetails.resonanceNoProfile')}</Text>
                )}
              </View>
            </View>
          ) : null}

          {/* Disclaimer */}
          <Text style={styles.disclaimer}>{t('home.planetTransitDetails.disclaimer')}</Text>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DarkTheme.screenBackground,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: DarkTheme.borderSubtle,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTextContainer: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: Typography.weightBold,
    color: DarkTheme.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: DarkTheme.textTertiary,
  },
  placeholder: {
    width: 44,
    height: 44,
  },
  gradientContainer: {
    flex: 1,
  },
  content: {
    padding: Spacing.screenPadding,
    gap: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  explainerText: {
    fontSize: 13,
    color: DarkTheme.textSecondary,
    lineHeight: 19,
    fontStyle: 'italic',
    paddingHorizontal: Spacing.xs,
  },
  explainerMeta: {
    fontSize: 11,
    color: DarkTheme.textTertiary,
    paddingHorizontal: Spacing.xs,
    marginTop: -8,
  },
  cardHint: {
    fontSize: 11,
    color: DarkTheme.textTertiary,
    marginTop: -6,
  },
  section: {
    gap: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textSecondary,
  },
  sectionTitleInCard: {
    fontSize: 14,
    fontWeight: Typography.weightBold,
    color: DarkTheme.textPrimary,
    marginBottom: Spacing.xs,
  },
  contextLine: {
    fontSize: 11,
    color: DarkTheme.textTertiary,
    fontStyle: 'italic',
    marginBottom: Spacing.xs,
  },
  card: {
    backgroundColor: 'rgba(30, 20, 36, 0.65)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  bigSymbol: {
    fontSize: 34,
  },
  namesCol: {
    flex: 1,
    minWidth: 0,
  },
  primaryName: {
    fontSize: 18,
    fontWeight: Typography.weightBold,
    color: DarkTheme.textPrimary,
  },
  secondaryName: {
    fontSize: 12,
    color: DarkTheme.textTertiary,
    fontFamily: 'Amiri',
  },
  pillsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  pill: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 4,
    minWidth: 0,
  },
  pillLabel: {
    fontSize: 10,
    color: DarkTheme.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pillValue: {
    fontSize: 13,
    fontWeight: Typography.weightSemibold,
  },
  metaText: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: Typography.weightSemibold,
  },
  bodyText: {
    fontSize: 13,
    color: DarkTheme.textSecondary,
    lineHeight: 18,
  },
  reflectionBlock: {
    marginTop: Spacing.sm,
    gap: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  reflectionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.xs,
  },
  reflectionText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
  },
  profileButton: {
    marginTop: Spacing.xs,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  profileButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: Typography.weightSemibold,
  },
  disclaimer: {
    fontSize: 11,
    color: DarkTheme.textMuted,
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: Spacing.sm,
  },
});
