import { DarkTheme, Spacing, Typography } from '@/constants/DarkTheme';
import type { ManazilLanguage, ManzilPracticePack } from '@/data/manazilPractices';
import { useNowTicker } from '@/hooks/useNowTicker';
import {
    calculatePlanetaryHours,
    getPlanetaryDayBoundariesForNow,
    preCalculateDailyPlanetaryHours,
    type PlanetaryDayBoundaries,
    type PlanetaryHour,
    type PlanetaryHourData,
} from '@/services/PlanetaryHoursService';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ExpandableCard } from './ExpandableCard';

function formatCountdown(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const mm = Math.floor(s / 60);
  const ss = s % 60;
  return `${mm}:${String(ss).padStart(2, '0')}`;
}

export function PlanetaryHoursCard(props: {
  accent: string;
  pack: ManzilPracticePack;
  location?: { latitude: number; longitude: number };
  language?: ManazilLanguage;
}) {
  const { accent, pack, location } = props;
  const language: ManazilLanguage = props.language ?? 'en';
  const now = useNowTicker(1000);
  const minuteNow = useNowTicker(60_000);

  const [boundaries, setBoundaries] = React.useState<PlanetaryDayBoundaries | null>(null);
  const [data, setData] = React.useState<PlanetaryHourData | null>(null);
  const [dayHours, setDayHours] = React.useState<PlanetaryHour[] | null>(null);
  const [selectedHour, setSelectedHour] = React.useState<PlanetaryHour | null>(null);

  React.useEffect(() => {
    if (!location) return;
    let cancelled = false;
    (async () => {
      const b = await getPlanetaryDayBoundariesForNow(location, { now: minuteNow });
      if (!cancelled) setBoundaries(b);
    })();
    return () => {
      cancelled = true;
    };
  }, [location?.latitude, location?.longitude, minuteNow]);

  React.useEffect(() => {
    if (!boundaries) return;
    const planetary = calculatePlanetaryHours(boundaries.sunrise, boundaries.sunset, boundaries.nextSunrise, now);
    setData(planetary);
  }, [boundaries, now]);

  React.useEffect(() => {
    if (!boundaries) return;
    let cancelled = false;
    (async () => {
      const cache = await preCalculateDailyPlanetaryHours(boundaries.sunrise, boundaries.sunset, boundaries.nextSunrise);
      if (cancelled) return;

      if (!cache?.hours?.length) {
        setDayHours(null);
        return;
      }

      // preCalculateDailyPlanetaryHours may return cached JSON (string dates).
      const normalized = cache.hours.map((h) => ({
        ...h,
        startTime: new Date(h.startTime),
        endTime: new Date(h.endTime),
      }));
      setDayHours(normalized);
    })();
    return () => {
      cancelled = true;
    };
  }, [boundaries]);

  const favorable = pack.correspondences?.planetary?.favorableHours ?? [];
  const avoid = pack.correspondences?.planetary?.avoidHours ?? [];
  const hourGuidance = pack.correspondences?.planetary?.hourGuidance;

  return (
    <ExpandableCard title="Planetary Hours" icon="time-outline" accentColor={accent}>
      {!location ? (
        <Text style={styles.note}>Enable location in your profile to compute planetary hours.</Text>
      ) : !data ? (
        <Text style={styles.note}>Loading planetary hour…</Text>
      ) : (
        <>
          <View style={styles.row}>
            <View style={styles.pill}>
              <Ionicons name="planet-outline" size={16} color={accent} />
              <Text style={styles.pillText}>Now: {data.currentHour.planet}</Text>
            </View>
            <Text style={styles.countdown}>Next in {formatCountdown(data.countdownSeconds)}</Text>
          </View>

          <View style={styles.timeline}>
            {(dayHours ?? []).map((h) => {
              const isFav = favorable.includes(h.planet);
              const isAvoid = avoid.includes(h.planet);
              const isNow = data.currentHour.hourNumber === h.hourNumber;
              const isSelected = selectedHour?.hourNumber === h.hourNumber;

              return (
                <Pressable
                  key={h.hourNumber}
                  onPress={() => setSelectedHour(h)}
                  style={[
                    styles.segment,
                    isNow && { backgroundColor: `${accent}55`, borderColor: `${accent}88` },
                    isSelected && { borderColor: `${accent}CC`, borderWidth: 2 },
                    isFav && { backgroundColor: 'rgba(16,185,129,0.25)', borderColor: 'rgba(16,185,129,0.5)' },
                    isAvoid && { backgroundColor: 'rgba(245,158,11,0.18)', borderColor: 'rgba(245,158,11,0.4)' },
                  ]}
                />
              );
            })}
          </View>

          {selectedHour ? (
            <View style={styles.detailCard}>
              <Text style={styles.detailTitle}>Hour {selectedHour.hourNumber}: {selectedHour.planet}</Text>
              <Text style={styles.detailText}>
                {selectedHour.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} — {selectedHour.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
              {hourGuidance?.[selectedHour.planet] ? (
                <Text style={styles.detailText}>
                  {hourGuidance[selectedHour.planet]?.[language] ?? hourGuidance[selectedHour.planet]?.en}
                </Text>
              ) : null}
            </View>
          ) : null}

          {(favorable.length > 0 || avoid.length > 0) ? (
            <View style={styles.legend}>
              {favorable.length > 0 ? <Text style={styles.legendText}>Favorable: {favorable.join(', ')}</Text> : null}
              {avoid.length > 0 ? <Text style={styles.legendText}>Avoid: {avoid.join(', ')}</Text> : null}
            </View>
          ) : null}
        </>
      )}
    </ExpandableCard>
  );
}

const styles = StyleSheet.create({
  note: {
    fontSize: Typography.label,
    color: DarkTheme.textTertiary,
    lineHeight: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
  },
  pillText: {
    fontSize: Typography.label,
    color: DarkTheme.textPrimary,
    fontWeight: Typography.weightSemibold,
  },
  countdown: {
    fontSize: Typography.caption,
    color: DarkTheme.textSecondary,
  },
  timeline: {
    flexDirection: 'row',
    gap: 4,
    flexWrap: 'wrap',
  },
  segment: {
    width: 12,
    height: 10,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  detailCard: {
    marginTop: Spacing.md,
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  detailTitle: {
    fontSize: Typography.label,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
    marginBottom: 4,
  },
  detailText: {
    fontSize: Typography.caption,
    color: DarkTheme.textSecondary,
    lineHeight: 18,
  },
  legend: {
    marginTop: Spacing.md,
    gap: 4,
  },
  legendText: {
    fontSize: Typography.caption,
    color: DarkTheme.textTertiary,
  },
});
