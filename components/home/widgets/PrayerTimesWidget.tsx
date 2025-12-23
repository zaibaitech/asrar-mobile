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
        console.log('Location permission denied');
        setState('permission-denied');
        return;
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = location.coords;
      console.log('Location:', latitude, longitude);

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
      onPress={handleRetry}
      onLongPress={() => router.push('/adhan-settings')}
    >
      <Text style={styles.icon}>🕌</Text>
      <Text style={styles.label}>Next Prayer</Text>
      <Text style={styles.prayerName}>{nextPrayer.nameArabic}</Text>
      <Text style={styles.time}>{nextPrayer.time}</Text>
      {countdown && (
        <Text style={styles.countdown}>in {countdown}</Text>
      )}
      <Text style={styles.hintText}>Hold to configure</Text>
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
