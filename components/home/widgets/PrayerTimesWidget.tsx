/**
 * PrayerTimesWidget Component
 * Shows next prayer time with countdown
 * 
 * Features:
 * - Real prayer times from Aladhan API
 * - Location-based calculation
 * - Countdown timer to next prayer
 * - Auto-refresh every minute
 * - Offline fallback
 */

import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { DarkTheme, Spacing, Typography } from '../../../constants/DarkTheme';
import { schedulePrayerNotifications } from '../../../services/AdhanNotificationService';
import {
    fetchPrayerTimes,
    getNextPrayer,
    getTimeUntilPrayer,
    PrayerTimings,
} from '../../../services/api/prayerTimes';

type ObligatoryPrayerName = 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';

interface PrayerTime {
  name: string;
  nameArabic: string;
  time: string;
}

type WidgetState = 'loading' | 'loaded' | 'error' | 'permission-denied';

export function PrayerTimesWidget() {
  const router = useRouter();
  const [state, setState] = useState<WidgetState>('loading');
  const [nextPrayer, setNextPrayer] = useState<PrayerTime>({
    name: 'Maghrib',
    nameArabic: 'المغرب',
    time: '17:45',
  });
  const [countdown, setCountdown] = useState('');
  const [timings, setTimings] = useState<PrayerTimings | null>(null);

  const getNextObligatoryPrayerName = (t: PrayerTimings | null): ObligatoryPrayerName | null => {
    if (!t) return null;
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const prayers: Array<{ name: ObligatoryPrayerName; time: string }> = [
      { name: 'Fajr', time: t.Fajr },
      { name: 'Dhuhr', time: t.Dhuhr },
      { name: 'Asr', time: t.Asr },
      { name: 'Maghrib', time: t.Maghrib },
      { name: 'Isha', time: t.Isha },
    ];

    for (const prayer of prayers) {
      const [hours, minutes] = prayer.time.split(':').map(Number);
      const total = hours * 60 + minutes;
      if (total > currentMinutes) return prayer.name;
    }

    return 'Fajr';
  };

  const handleOpenGuidance = () => {
    const prayer = getNextObligatoryPrayerName(timings);
    router.push({
      pathname: '/prayer-guidance',
      params: prayer ? { prayer } : undefined,
    });
  };

  // Fetch prayer times on mount
  useEffect(() => {
    loadPrayerTimes();
  }, []);

  // Update countdown every minute
  useEffect(() => {
    if (state !== 'loaded' || !nextPrayer.time) return;

    const updateCountdown = () => {
      const { hours, minutes } = getTimeUntilPrayer(nextPrayer.time);
      if (hours > 0) {
        setCountdown(`${hours}h ${minutes}m`);
      } else {
        setCountdown(`${minutes}m`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [state, nextPrayer.time]);

  const loadPrayerTimes = async () => {
    try {
      setState('loading');

      // Request location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        if (__DEV__) {
          console.log('Location permission denied');
        }
        setState('permission-denied');
        return;
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = location.coords;
      if (__DEV__) {
        console.log('Location:', latitude, longitude);
      }

      // Fetch prayer times
      const data = await fetchPrayerTimes(latitude, longitude);
      setTimings(data.timings);

      // Get next prayer
      const next = getNextPrayer(data.timings);
      setNextPrayer(next);

      // Schedule adhan notifications for all prayers
      await schedulePrayerNotifications(data.timings);

      setState('loaded');
    } catch (error) {
      console.error('Failed to load prayer times:', error);
      setState('error');
    }
  };

  const handleRetry = () => {
    loadPrayerTimes();
  };

  // Loading state
  if (state === 'loading') {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color="#64B5F6" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Permission denied state
  if (state === 'permission-denied') {
    return (
      <Pressable style={styles.container} onPress={handleRetry}>
        <Text style={styles.icon}>📍</Text>
        <Text style={styles.errorText}>Location needed</Text>
        <Text style={styles.retryText}>Tap to retry</Text>
      </Pressable>
    );
  }

  // Error state
  if (state === 'error') {
    return (
      <Pressable style={styles.container} onPress={handleRetry}>
        <Text style={styles.icon}>🕌</Text>
        <Text style={styles.errorText}>Failed to load</Text>
        <Text style={styles.retryText}>Tap to retry</Text>
      </Pressable>
    );
  }

  // Success state
  return (
    <Pressable 
      style={styles.container} 
      onPress={() => router.push('/prayer-times')}
      onLongPress={() => router.push('/adhan-settings')}
    >
      <Pressable
        style={styles.guidanceChip}
        onPress={(e) => {
          // Prevent parent Pressable from also firing
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (e as any)?.stopPropagation?.();
          handleOpenGuidance();
        }}
        hitSlop={8}
      >
        <Text style={styles.guidanceChipText}>Guidance</Text>
      </Pressable>
      <Text style={styles.icon}>🕌</Text>
      <Text style={styles.label}>Next Prayer</Text>
      <Text style={styles.prayerName}>{nextPrayer.nameArabic}</Text>
      <Text style={styles.time}>{nextPrayer.time}</Text>
      {countdown && (
        <Text style={styles.countdown}>in {countdown}</Text>
      )}
      <Text style={styles.hintText}>Tap for details</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(45, 21, 21, 0.5)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: Spacing.md,
  },
  guidanceChip: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(100, 181, 246, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(100, 181, 246, 0.35)',
  },
  guidanceChipText: {
    fontSize: 10,
    fontWeight: Typography.weightSemibold,
    color: '#64B5F6',
    letterSpacing: 0.2,
  },
  icon: {
    fontSize: 28,
    marginBottom: Spacing.xs,
  },
  label: {
    fontSize: Typography.caption,
    fontWeight: Typography.weightMedium,
    color: DarkTheme.textTertiary,
    marginBottom: Spacing.xs,
  },
  prayerName: {
    fontSize: Typography.body,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
    marginBottom: 2,
  },
  time: {
    fontSize: Typography.h3,
    fontWeight: Typography.weightBold,
    color: '#64B5F6',
  },
  countdown: {
    fontSize: Typography.caption,
    color: DarkTheme.textMuted,
    marginTop: 2,
  },
  loadingText: {
    fontSize: Typography.caption,
    color: DarkTheme.textTertiary,
    marginTop: Spacing.xs,
  },
  errorText: {
    fontSize: Typography.caption,
    color: DarkTheme.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  retryText: {
    fontSize: 10,
    color: DarkTheme.textMuted,
    marginTop: 4,
    fontStyle: 'italic',
  },
  hintText: {
    fontSize: 9,
    color: DarkTheme.textMuted,
    marginTop: 4,
    fontStyle: 'italic',
    opacity: 0.6,
  },
});
