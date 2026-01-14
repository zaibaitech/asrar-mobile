/**
 * Prayer Guidance Screen
 *
 * Personalized prayer guidance based on:
 * - User's abjad profile and element
 * - Current planetary hour
 * - Selected prayer
 */

import {
    AdhkarList,
    ClassicalWisdomCard,
    ContextDisplay,
    DhikrCounter,
    DivineNameCard,
    PrayerSelector,
} from '@/components/prayer-guidance';
import { DarkTheme, Spacing, Typography } from '@/constants/DarkTheme';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProfile } from '@/contexts/ProfileContext';
import type { Planet } from '@/data/classical-hour-practices';
import type { Element, Prayer } from '@/data/divine-names-planetary';
import type { UserProfile as GuidanceUserProfile, PrayerGuidanceRecommendation } from '@/services/PrayerGuidanceEngine';
import { PrayerGuidanceEngine } from '@/services/PrayerGuidanceEngine';
import { getUserAbjadResultFromProfile } from '@/services/UserAbjadService';
import { getCurrentPlanetaryHour } from '@/utils/planetary-hours';
import { getNextPrayerTime } from '@/utils/prayer-times';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function mapToneToElement(tone: 'fire' | 'water' | 'air' | 'earth'): Element {
  switch (tone) {
    case 'fire':
      return 'Fire';
    case 'water':
      return 'Water';
    case 'air':
      return 'Air';
    case 'earth':
      return 'Earth';
  }
}

function mapProfilePlanetaryRulerToPlanet(
  ruler?: 'sun' | 'moon' | 'mercury' | 'venus' | 'mars' | 'jupiter' | 'saturn'
): Planet | undefined {
  switch (ruler) {
    case 'sun':
      return 'Sun';
    case 'moon':
      return 'Moon';
    case 'mercury':
      return 'Mercury';
    case 'venus':
      return 'Venus';
    case 'mars':
      return 'Mars';
    case 'jupiter':
      return 'Jupiter';
    case 'saturn':
      return 'Saturn';
    default:
      return undefined;
  }
}

export default function PrayerGuidanceScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ prayer?: string }>();
  const { profile, completionStatus, isLoading: isProfileLoading } = useProfile();
  const { t } = useLanguage();

  const location = useMemo(() => {
    if (!profile.location) return undefined;
    return { latitude: profile.location.latitude, longitude: profile.location.longitude };
  }, [profile.location?.latitude, profile.location?.longitude]);

  const [selectedPrayer, setSelectedPrayer] = useState<Prayer | null>(null);
  const [guidance, setGuidance] = useState<PrayerGuidanceRecommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [planetaryHour, setPlanetaryHour] = useState<Awaited<ReturnType<typeof getCurrentPlanetaryHour>> | null>(null);

  const abjad = useMemo(() => {
    return getUserAbjadResultFromProfile(profile);
  }, [profile.nameAr, profile.motherName]);

  const guidanceUserProfile: GuidanceUserProfile | null = useMemo(() => {
    if (!abjad) return null;
    return {
      userId: profile.account?.userId ?? 'local-user',
      name: profile.nameLatin ?? profile.nameAr ?? 'User',
      abjadValue: abjad.kabir,
      derived: {
        element: mapToneToElement(abjad.dominantElement),
        temperament: 'balanced',
        reduction: abjad.saghir,
        planet: mapProfilePlanetaryRulerToPlanet(profile.derived?.planetaryRuler),
      },
    };
  }, [
    abjad?.kabir,
    abjad?.saghir,
    abjad?.dominantElement,
    profile.account?.userId,
    profile.nameLatin,
    profile.nameAr,
    profile.derived?.planetaryRuler,
  ]);

  useEffect(() => {
    const p = params.prayer;
    if (typeof p !== 'string') return;
    if (p === 'Fajr' || p === 'Dhuhr' || p === 'Asr' || p === 'Maghrib' || p === 'Isha') {
      setSelectedPrayer(p);
    }
  }, [params.prayer]);

  useEffect(() => {
    let cancelled = false;

    const update = async () => {
      try {
        const next = await getCurrentPlanetaryHour(location);
        if (!cancelled) setPlanetaryHour(next);
      } catch (error) {
        console.error('Failed to compute planetary hour:', error);
      }
    };

    void update();

    const interval = setInterval(() => {
      void update();
    }, 60_000);
    return () => clearInterval(interval);
  }, [location]);

  useEffect(() => {
    if (!selectedPrayer) return;
    if (!guidanceUserProfile) {
      setGuidance(null);
      return;
    }
    if (!planetaryHour) return;

    setLoading(true);
    const generateGuidance = async () => {
      try {
        const prayerTime = await getNextPrayerTime(selectedPrayer, location);
        const recommendation = PrayerGuidanceEngine.generateGuidance(
          selectedPrayer,
          prayerTime,
          guidanceUserProfile,
          planetaryHour
        );
        setGuidance(recommendation);
      } catch (error) {
        console.error('Error generating guidance:', error);
        setGuidance(null);
      } finally {
        setLoading(false);
      }
    };

    generateGuidance();
  }, [selectedPrayer, planetaryHour, guidanceUserProfile, location]);

  const handleDhikrComplete = () => {
    console.log('Dhikr completed! Alhamdulillah');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🌙 {t('prayerGuidance.title')}</Text>
          <Text style={styles.headerSubtitle}>
            {t('prayerGuidance.ui.headerSubtitle')}
          </Text>
        </View>

        <View style={styles.currentHourBanner}>
          <Text style={styles.currentHourText}>
            {planetaryHour
              ? t('prayerGuidance.ui.currentHour', {
                  planet: planetaryHour.planet,
                  arabicName: planetaryHour.arabicName,
                })
              : t('prayerGuidance.ui.generating')}
          </Text>
          <Text style={styles.currentHourSubtext}>
            {planetaryHour
              ? (
                  <>
                    {t('prayerGuidance.ui.hourOfTwelve', { number: planetaryHour.hourNumber })} •{' '}
                    {planetaryHour.isDaytime ? t('prayerGuidance.ui.day') : t('prayerGuidance.ui.night')}
                  </>
                )
              : '—'}
          </Text>
        </View>

        <PrayerSelector onSelect={setSelectedPrayer} selectedPrayer={selectedPrayer} />

        {!isProfileLoading && !guidanceUserProfile && (
          <View style={styles.profileHint}>
            <Text style={styles.profileHintTitle}>{t('prayerGuidance.ui.profileHintTitle')}</Text>
            <Text style={styles.profileHintText}>
              {t('prayerGuidance.ui.profileHintBody')}
            </Text>
            <Pressable
              style={styles.profileHintButton}
              onPress={() => router.push('/profile')}
            >
              <Text style={styles.profileHintButtonText}>{t('prayerGuidance.ui.goToProfile')}</Text>
            </Pressable>
            {!completionStatus.hasName && (
              <Text style={styles.profileHintSubtext}>{t('prayerGuidance.ui.missingArabicName')}</Text>
            )}
          </View>
        )}

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#64B5F6" />
            <Text style={styles.loadingText}>{t('prayerGuidance.ui.generating')}</Text>
          </View>
        )}

        {!loading && guidance && (
          <>
            <ContextDisplay
              context={guidance.context}
              planetaryHour={
                planetaryHour
                  ? {
                      timeRemaining: planetaryHour.timeRemaining,
                      isDaytime: planetaryHour.isDaytime,
                    }
                  : undefined
              }
            />

            <ClassicalWisdomCard wisdom={guidance.classicalWisdom} />

            <DivineNameCard divineName={guidance.divineName} />

            <DhikrCounter dhikr={guidance.dhikr} onComplete={handleDhikrComplete} />

            <AdhkarList adhkar={guidance.adhkar} />

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                {t('prayerGuidance.ui.footerBasedOn', {
                  abjad: guidanceUserProfile?.abjadValue ?? '—',
                  element: guidanceUserProfile?.derived.element ?? '—',
                })}
              </Text>
              <Text style={styles.footerSubtext}>
                {t('prayerGuidance.ui.sources', { source: guidance.classicalWisdom.source })}
              </Text>
            </View>
          </>
        )}

        {!loading && !guidance && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>🌟</Text>
            <Text style={styles.emptyStateTitle}>{t('prayerGuidance.ui.emptyTitle')}</Text>
            <Text style={styles.emptyStateText}>
              {t('prayerGuidance.ui.emptyBody')}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DarkTheme.screenBackground,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.screenPadding,
    paddingBottom: Spacing.xxxl,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  headerTitle: {
    fontSize: Typography.h2,
    fontWeight: Typography.weightBold,
    color: DarkTheme.textPrimary,
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    fontSize: Typography.label,
    color: DarkTheme.textTertiary,
    lineHeight: 20,
  },
  currentHourBanner: {
    backgroundColor: DarkTheme.cardBackgroundAlt,
    padding: Spacing.lg,
    borderRadius: 16,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: DarkTheme.borderSubtle,
  },
  currentHourText: {
    color: DarkTheme.textPrimary,
    fontSize: Typography.body,
    fontWeight: Typography.weightSemibold,
    marginBottom: 4,
  },
  currentHourSubtext: {
    color: DarkTheme.textTertiary,
    fontSize: Typography.caption,
  },
  profileHint: {
    marginTop: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: 16,
    backgroundColor: DarkTheme.cardBackgroundAlt,
    borderWidth: 1,
    borderColor: DarkTheme.borderSubtle,
  },
  profileHintTitle: {
    fontSize: Typography.h3,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
    marginBottom: Spacing.sm,
  },
  profileHintText: {
    fontSize: Typography.label,
    color: DarkTheme.textTertiary,
    lineHeight: 20,
  },
  profileHintSubtext: {
    marginTop: Spacing.sm,
    fontSize: Typography.caption,
    color: DarkTheme.textMuted,
  },
  profileHintButton: {
    marginTop: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: 12,
    backgroundColor: DarkTheme.primary,
    alignItems: 'center',
  },
  profileHintButtonText: {
    fontSize: Typography.label,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.background,
  },
  loadingContainer: {
    padding: Spacing.xxxl,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: Spacing.md,
    color: DarkTheme.textTertiary,
  },
  footer: {
    marginTop: Spacing.lg,
    padding: Spacing.lg,
    backgroundColor: DarkTheme.cardBackgroundAlt,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: DarkTheme.borderSubtle,
  },
  footerText: {
    fontSize: Typography.caption,
    color: DarkTheme.textTertiary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: Spacing.sm,
  },
  footerSubtext: {
    fontSize: 10,
    color: DarkTheme.textMuted,
    textAlign: 'center',
    lineHeight: 14,
  },
  emptyState: {
    padding: Spacing.xxxl,
    alignItems: 'center',
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: Spacing.lg,
  },
  emptyStateTitle: {
    fontSize: Typography.h3,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
    marginBottom: Spacing.sm,
  },
  emptyStateText: {
    fontSize: Typography.label,
    color: DarkTheme.textTertiary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
