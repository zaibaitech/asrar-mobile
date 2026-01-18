import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Borders, DarkTheme, ElementAccents, Typography } from '@/constants/DarkTheme';
import { useProfile } from '@/contexts/ProfileContext';
import { useAllTransits } from '@/hooks/useTransit';
import { Element } from '@/services/MomentAlignmentService';
import { ZODIAC_DATA } from '@/services/PlanetTransitService';
import type { Planet } from '@/services/PlanetaryHoursService';
import { PlanetaryHourData } from '@/services/PlanetaryHoursService';
import { deriveBurjFromDOB } from '@/services/ProfileDerivationService';
import { adaptTransitToLegacyFormat } from '@/utils/transitAdapters';
import { resolveUserZodiacKey } from '@/utils/translationHelpers';

import PlanetTransitWidget from './PlanetTransitWidget';
import { RotatingCardContent } from './RotatingCardContent';

interface NextPrayer {
  name: string;
  nameArabic: string;
  time: string;
}

interface DayBlessing {
  dayName: string;
  dayNameArabic: string;
  planetArabic: string;
  emoji: string;
  element: Element;
}

interface RightStackWidgetsProps {
  nextPrayer?: NextPrayer | null;
  prayerLoading?: boolean;
  prayerCountdown?: string;
  nextDayBlessing?: DayBlessing | null;
  planetaryData?: PlanetaryHourData | null;
  t: (key: string) => string;
}

export function RightStackWidgets({
  nextPrayer,
  prayerLoading,
  prayerCountdown,
  nextDayBlessing,
  planetaryData,
  t,
}: RightStackWidgetsProps) {
  const router = useRouter();
  const [prayerSlide, setPrayerSlide] = useState(0);

  const { profile } = useProfile();
  const { transits } = useAllTransits();

  const myZodiacKey = useMemo(() => {
    // Prefer derived profile value if present
    const fromDerived = resolveUserZodiacKey({
      burjIndex: profile?.derived?.burjIndex,
      burj: profile?.derived?.burj,
    });
    if (fromDerived) return fromDerived;

    // Fallback: derive from DOB if available
    if (profile?.dobISO) {
      const burjData = deriveBurjFromDOB(profile.dobISO);
      return resolveUserZodiacKey({
        burjIndex: burjData?.burjIndex,
        burj: burjData?.burjEn,
      });
    }

    return null;
  }, [profile?.derived?.burjIndex, profile?.derived?.burj, profile?.dobISO]);

const selectedTransit = useMemo(() => {
    if (!transits) return null;
    const all = Object.values(transits).filter(Boolean);
    if (all.length === 0) return null;

    const now = new Date();
    const isActive = (t: (typeof all)[number]) => {
      const start = t.transitStartDate ? new Date(t.transitStartDate) : null;
      const end = t.transitEndDate ? new Date(t.transitEndDate) : null;
      if (start && end) return now >= start && now <= end;
      return true;
    };

    const priority: Planet[] = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
    const planetRank = (p: Planet) => {
      const idx = priority.indexOf(p);
      return idx === -1 ? 999 : idx;
    };

    // First: try to find a transit in the user's sign
    if (myZodiacKey) {
      const inMySign = all.filter((t) => t?.sign === myZodiacKey);
      if (inMySign.length > 0) {
        const active = inMySign.filter(isActive);
        const candidates = (active.length ? active : inMySign).slice();
        candidates.sort((a, b) => {
          const byPlanet = planetRank(a.planet) - planetRank(b.planet);
          if (byPlanet !== 0) return byPlanet;
          const aEnd = a.transitEndDate ? new Date(a.transitEndDate).getTime() : Number.POSITIVE_INFINITY;
          const bEnd = b.transitEndDate ? new Date(b.transitEndDate).getTime() : Number.POSITIVE_INFINITY;
          return aEnd - bEnd;
        });
        // Return with personal flag
        return { transit: candidates[0] ?? null, isPersonal: true };
      }
    }

    // Fallback: show the most relevant transit (Sun first) for all users
    const active = all.filter(isActive);
    const candidates = (active.length ? active : all).slice();
    candidates.sort((a, b) => {
      const byPlanet = planetRank(a.planet) - planetRank(b.planet);
      if (byPlanet !== 0) return byPlanet;
      const aEnd = a.transitEndDate ? new Date(a.transitEndDate).getTime() : Number.POSITIVE_INFINITY;
      const bEnd = b.transitEndDate ? new Date(b.transitEndDate).getTime() : Number.POSITIVE_INFINITY;
      return aEnd - bEnd;
    });
    // Return with fallback flag
    return { transit: candidates[0] ?? null, isPersonal: false };
  }, [transits, myZodiacKey]);

  // Convert new transit format to legacy format for widget
  const legacyTransit = selectedTransit?.transit ? adaptTransitToLegacyFormat(selectedTransit.transit) : null;
  const isPersonalTransit = selectedTransit?.isPersonal ?? false;
  const nextDayBlessingWithElement = nextDayBlessing
    ? {
        ...nextDayBlessing,
        element: nextDayBlessing.element ?? (myZodiacKey ? ZODIAC_DATA[myZodiacKey].element : 'earth'),
      }
    : null;

  return (
    <View style={styles.container}>
      {/* Next Prayer Widget */}
      <TouchableOpacity
        style={styles.widget}
        onPress={() => {
          if (prayerSlide === 0) {
            router.push('/prayer-times');
          } else {
            router.push('/(tabs)/moment-alignment-detail');
          }
        }}
        activeOpacity={0.7}
      >
        <RotatingCardContent
          slides={[
            // Slide A: Next Prayer
            <View key="prayer" style={[styles.widgetContent, { backgroundColor: 'rgba(16, 185, 129, 0.08)' }]}>
              <Text style={styles.widgetLabel} numberOfLines={1}>{t('home.nextPrayer')}</Text>
              {prayerLoading ? (
                <ActivityIndicator size="small" color="#10b981" />
              ) : nextPrayer ? (
                <>
                  <Text style={styles.widgetPrimary} numberOfLines={1}>{nextPrayer.nameArabic}</Text>
                  <Text style={[styles.widgetTime, { color: '#10b981' }]} numberOfLines={1}>
                    {nextPrayer.time}
                  </Text>
                  {prayerCountdown && (
                    <Text style={styles.widgetTertiary} numberOfLines={1}>in {prayerCountdown}</Text>
                  )}
                </>
              ) : (
                <Text style={styles.widgetTertiary} numberOfLines={2}>{t('home.tapToSetLocation')}</Text>
              )}
            </View>,

            // Slide B: Next Planetary Hour
            <View key="planet-hour" style={[styles.widgetContent, { backgroundColor: 'rgba(139, 92, 246, 0.08)' }]}>
              <Text style={styles.widgetLabel} numberOfLines={1}>{t('home.cards.nextPlanetaryHour.title')}</Text>
              {planetaryData ? (
                <>
                  <Text style={styles.widgetPrimary} numberOfLines={1}>
                    {planetaryData.nextHour.planetInfo.symbol} {t(`planets.${planetaryData.nextHour.planet.toLowerCase()}`)}
                  </Text>
                  <Text style={[styles.widgetTime, { color: '#8b5cf6' }]} numberOfLines={1}>
                    {t('home.startsAt')} {(() => {
                      const hours = planetaryData.nextHour.startTime.getHours().toString().padStart(2, '0');
                      const minutes = planetaryData.nextHour.startTime.getMinutes().toString().padStart(2, '0');
                      return `${hours}:${minutes}`;
                    })()}
                  </Text>
                  {planetaryData.countdownSeconds > 0 && (
                    <Text style={styles.widgetTertiary} numberOfLines={1}>
                      {(() => {
                        const seconds = planetaryData.countdownSeconds;
                        const hours = Math.floor(seconds / 3600);
                        const minutes = Math.floor((seconds % 3600) / 60);
                        let duration = '';
                        if (hours > 0) duration = `${hours}h ${minutes}m`;
                        else if (minutes > 0) duration = `${minutes}m`;
                        const template = t('home.cards.nextPlanetaryHour.inTime');
                        return template.replace('{duration}', duration);
                      })()}
                    </Text>
                  )}
                  <View style={[
                    styles.elementBadge,
                    { backgroundColor: ElementAccents[planetaryData.nextHour.planetInfo.element].glow }
                  ]}>
                    <Text style={[
                      styles.elementText,
                      { color: ElementAccents[planetaryData.nextHour.planetInfo.element].primary }
                    ]} numberOfLines={1}>
                      {t(`elements.${planetaryData.nextHour.planetInfo.element}`).toUpperCase()}
                    </Text>
                  </View>
                </>
              ) : (
                <Text style={styles.widgetTertiary}>{t('common.loading')}</Text>
              )}
            </View>
          ]}
          intervalMs={8000}
          showDots={true}
          onSlideChange={setPrayerSlide}
        />
      </TouchableOpacity>

      {/* Planet Transit Widget */}
      <View style={styles.widget}>
        <PlanetTransitWidget 
          transitData={legacyTransit} 
          nextDayBlessing={nextDayBlessingWithElement}
          compact
          isPersonal={isPersonalTransit}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 10,
    minWidth: 0,
  },
  widget: {
    flex: 1,
    borderRadius: Borders.radiusLg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    overflow: 'hidden',
    backgroundColor: 'rgba(30, 20, 36, 0.65)',
    minHeight: 0,
  },
  widgetContent: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  widgetLabel: {
    fontSize: 10,
    color: DarkTheme.textTertiary,
    fontWeight: Typography.weightMedium,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  widgetPrimary: {
    fontSize: 18,
    fontWeight: Typography.weightBold,
    color: DarkTheme.textPrimary,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  widgetTime: {
    fontSize: 14,
    fontWeight: Typography.weightSemibold,
    textAlign: 'center',
  },
  widgetTertiary: {
    fontSize: 11,
    color: DarkTheme.textSecondary,
    textAlign: 'center',
  },
  elementBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Borders.radiusSm,
    marginTop: 2,
  },
  elementText: {
    fontSize: 9,
    fontWeight: Typography.weightBold,
    letterSpacing: 0.5,
  },
});
