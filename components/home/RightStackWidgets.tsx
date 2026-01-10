import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Borders, DarkTheme, ElementAccents, Typography } from '@/constants/DarkTheme';
import { Element } from '@/services/MomentAlignmentService';
import { PlanetaryHourData } from '@/services/PlanetaryHoursService';

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
  todayBlessing?: DayBlessing;
  tomorrowBlessing?: DayBlessing;
  planetaryData?: PlanetaryHourData | null;
  t: (key: string) => string;
}

export function RightStackWidgets({
  nextPrayer,
  prayerLoading,
  prayerCountdown,
  todayBlessing,
  tomorrowBlessing,
  planetaryData,
  t,
}: RightStackWidgetsProps) {
  const router = useRouter();
  const [prayerSlide, setPrayerSlide] = useState(0);
  const [blessingSlide, setBlessingSlide] = useState(0);

  return (
    <View style={styles.container}>
      {/* Next Prayer Widget */}
      <TouchableOpacity
        style={styles.widget}
        onPress={() => {
          if (prayerSlide === 0) {
            router.push('/prayer-times');
          } else {
            router.push('/moment-alignment-details');
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

      {/* Today's Blessing Widget */}
      <TouchableOpacity
        style={styles.widget}
        onPress={() => router.push('/divine-timing')}
        activeOpacity={0.7}
      >
        {todayBlessing && (
          <RotatingCardContent
            slides={[
              // Slide A: Today's Blessing
              <View key="today" style={[
                styles.widgetContent,
                { backgroundColor: `${ElementAccents[todayBlessing.element].primary}15` }
              ]}>
                <Text style={styles.widgetLabel} numberOfLines={1}>{t('home.todayBlessing')}</Text>
                <Text style={styles.widgetPrimary} numberOfLines={1}>{todayBlessing.dayNameArabic}</Text>
                <Text style={[
                  styles.widgetTime,
                  { color: ElementAccents[todayBlessing.element].primary }
                ]} numberOfLines={1}>
                  {todayBlessing.emoji} {todayBlessing.planetArabic}
                </Text>
                <View style={[
                  styles.elementBadge,
                  { backgroundColor: ElementAccents[todayBlessing.element].glow }
                ]}>
                  <Text style={[
                    styles.elementText,
                    { color: ElementAccents[todayBlessing.element].primary }
                  ]} numberOfLines={1}>
                    {t(`elements.${todayBlessing.element}`).toUpperCase()}
                  </Text>
                </View>
              </View>,

              // Slide B: Tomorrow Preview
              tomorrowBlessing ? (
                <View key="tomorrow" style={[
                  styles.widgetContent,
                  { backgroundColor: `${ElementAccents[tomorrowBlessing.element].primary}15` }
                ]}>
                  <Text style={styles.widgetLabel} numberOfLines={1}>{t('home.cards.tomorrow.title')}</Text>
                  <Text style={styles.widgetPrimary} numberOfLines={1}>{tomorrowBlessing.dayNameArabic}</Text>
                  <Text style={[
                    styles.widgetTime,
                    { color: ElementAccents[tomorrowBlessing.element].primary }
                  ]} numberOfLines={1}>
                    {tomorrowBlessing.emoji} {tomorrowBlessing.planetArabic}
                  </Text>
                  <View style={[
                    styles.elementBadge,
                    { backgroundColor: ElementAccents[tomorrowBlessing.element].glow }
                  ]}>
                    <Text style={[
                      styles.elementText,
                      { color: ElementAccents[tomorrowBlessing.element].primary }
                    ]} numberOfLines={1}>
                      {t(`elements.${tomorrowBlessing.element}`).toUpperCase()}
                    </Text>
                  </View>
                </View>
              ) : null
            ]}
            intervalMs={8000}
            showDots={true}
            onSlideChange={setBlessingSlide}
          />
        )}
      </TouchableOpacity>
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
