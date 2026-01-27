/**
 * Prayer Times Screen
 * Full daily prayer timetable with countdowns and details
 * 
 * Performance optimizations:
 * - Caches location and prayer times data
 * - Uses stale-while-revalidate pattern
 * - Minimal initial load time
 */

import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';
import {
    fetchPrayerTimes,
    getTimeUntilPrayer,
    PrayerTimings,
} from '../services/api/prayerTimes';

type LoadingState = 'idle' | 'loading' | 'loaded' | 'error' | 'permission-denied';

const CACHE_KEYS = {
  PRAYER_TIMES: 'prayer_times_cache',
  LOCATION: 'prayer_location_cache',
  LAST_FETCH: 'prayer_last_fetch',
};

const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours

interface PrayerInfo {
  name: string;
  nameArabic: string;
  time: string;
  icon: string;
  isNext: boolean;
}

type ObligatoryPrayerName = 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';

function isObligatoryPrayerName(name: string): name is ObligatoryPrayerName {
  return name === 'Fajr' || name === 'Dhuhr' || name === 'Asr' || name === 'Maghrib' || name === 'Isha';
}

export default function PrayerTimesScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const [state, setState] = useState<LoadingState>('idle');
  const [timings, setTimings] = useState<PrayerTimings | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [hijriDate, setHijriDate] = useState<string>('');
  const [gregorianDate, setGregorianDate] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);
  const [nextPrayerIndex, setNextPrayerIndex] = useState<number>(0);
  const inFlightRef = useRef(false);

  useEffect(() => {
    loadCachedDataThenFresh();
  }, []);

  const loadCachedDataThenFresh = async () => {
    // Load cached data first for instant display
    const cached = await loadFromCache();
    
    if (cached) {
      // Show cached data immediately
      setTimings(cached.timings);
      setLocation(cached.location);
      setHijriDate(cached.hijriDate);
      setGregorianDate(cached.gregorianDate);
      setState('loaded');
    }
    
    // Only refresh if cache is missing or stale
    if (!cached || cached.isStale) {
      await loadPrayerTimes(!!cached);
    }
  };

  const loadFromCache = async () => {
    try {
      const [cachedTimings, cachedLocation, lastFetch] = await Promise.all([
        AsyncStorage.getItem(CACHE_KEYS.PRAYER_TIMES),
        AsyncStorage.getItem(CACHE_KEYS.LOCATION),
        AsyncStorage.getItem(CACHE_KEYS.LAST_FETCH),
      ]);

      if (!cachedTimings || !cachedLocation || !lastFetch) {
        return null;
      }

      const lastFetchMs = Number(lastFetch);
      const cacheAge = Date.now() - lastFetchMs;
      const isStale = Number.isNaN(lastFetchMs) ? true : cacheAge > CACHE_DURATION;

      const data = JSON.parse(cachedTimings);
      return {
        timings: data.timings,
        location: JSON.parse(cachedLocation),
        hijriDate: data.hijriDate,
        gregorianDate: data.gregorianDate,
        lastFetch: lastFetchMs,
        isStale,
      };
    } catch (error) {
      console.error('Failed to load cached data:', error);
      return null;
    }
  };

  const saveToCache = async (data: any, loc: { latitude: number; longitude: number }) => {
    try {
      await Promise.all([
        AsyncStorage.setItem(CACHE_KEYS.PRAYER_TIMES, JSON.stringify(data)),
        AsyncStorage.setItem(CACHE_KEYS.LOCATION, JSON.stringify(loc)),
        AsyncStorage.setItem(CACHE_KEYS.LAST_FETCH, Date.now().toString()),
      ]);
    } catch (error) {
      const errorMsg = (error as any)?.message || '';
      if (errorMsg.includes('SQLITE_FULL') || errorMsg.includes('disk is full')) {
        console.warn('Failed to save cache: disk full, continuing with memory only');
        // Continue without persisting - app still works
      } else {
        console.error('Failed to save cache:', error);
      }
    }
  };

  // Update next prayer every minute
  useEffect(() => {
    if (!timings) return;
    
    updateNextPrayer();
    const interval = setInterval(updateNextPrayer, 60000);
    return () => clearInterval(interval);
  }, [timings]);

  const updateNextPrayer = () => {
    if (!timings) return;

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // Helper to parse time and remove timezone suffixes
    const parseTime = (timeString: string): number => {
      // Remove timezone info in parentheses (e.g., "20:15 (EST)" -> "20:15")
      const cleaned = timeString.replace(/\s*\([^)]*\)\s*/, '').trim();
      const [hours, minutes] = cleaned.split(':').map(Number);
      
      // Validate parsed values
      if (isNaN(hours) || isNaN(minutes)) {
        console.warn('Failed to parse prayer time:', timeString);
        return -1; // Return invalid value
      }
      
      return hours * 60 + minutes;
    };

    const prayers = [
      { time: timings.Fajr },
      { time: timings.Dhuhr },
      { time: timings.Asr },
      { time: timings.Maghrib },
      { time: timings.Isha },
    ];

    const nextIndex = prayers.findIndex(prayer => {
      const prayerMinutes = parseTime(prayer.time);
      return prayerMinutes > currentMinutes;
    });

    setNextPrayerIndex(nextIndex >= 0 ? nextIndex : 0);
  };

  const loadPrayerTimes = async (isBackgroundRefresh = false) => {
    try {
      if (inFlightRef.current) return;
      inFlightRef.current = true;
      if (!isBackgroundRefresh) {
        setState('loading');
      }

      // Request location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        if (!isBackgroundRefresh) {
          setState('permission-denied');
        }
        return;
      }

      // Get current location
      const locationResult = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = locationResult.coords;
      const newLocation = { latitude, longitude };
      setLocation(newLocation);

      // Fetch prayer times
      const data = await fetchPrayerTimes(latitude, longitude);
      const newHijriDate = `${data.date.hijri.day} ${data.date.hijri.month.ar} ${data.date.hijri.year}`;
      const newGregorianDate = data.date.readable;
      
      setTimings(data.timings);
      setHijriDate(newHijriDate);
      setGregorianDate(newGregorianDate);

      // Cache the data
      await saveToCache({
        timings: data.timings,
        hijriDate: newHijriDate,
        gregorianDate: newGregorianDate,
      }, newLocation);

      setState('loaded');
    } catch (error) {
      console.error('Failed to load prayer times:', error);
      if (!isBackgroundRefresh) {
        setState('error');
      }
    } finally {
      inFlightRef.current = false;
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPrayerTimes();
    setRefreshing(false);
  };

  const getPrayersList = (): PrayerInfo[] => {
    if (!timings) return [];

    return [
      { name: 'Fajr', nameArabic: 'الفجر', time: timings.Fajr, icon: '🌅', isNext: nextPrayerIndex === 0 },
      { name: 'Sunrise', nameArabic: 'الشروق', time: timings.Sunrise, icon: '☀️', isNext: false },
      { name: 'Dhuhr', nameArabic: 'الظهر', time: timings.Dhuhr, icon: '🌞', isNext: nextPrayerIndex === 1 },
      { name: 'Asr', nameArabic: 'العصر', time: timings.Asr, icon: '🌤️', isNext: nextPrayerIndex === 2 },
      { name: 'Maghrib', nameArabic: 'المغرب', time: timings.Maghrib, icon: '🌆', isNext: nextPrayerIndex === 3 },
      { name: 'Isha', nameArabic: 'العشاء', time: timings.Isha, icon: '🌙', isNext: nextPrayerIndex === 4 },
    ];
  };

  if (state === 'loading') {
    return (
      <>
        <Stack.Screen options={{ title: t('prayerTimes.title') }} />
        <View style={styles.container}>
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color="#64B5F6" />
            <Text style={styles.loadingText}>Loading prayer times...</Text>
          </View>
        </View>
      </>
    );
  }

  if (state === 'permission-denied') {
    return (
      <>
        <Stack.Screen options={{ title: t('prayerTimes.title') }} />
        <View style={styles.container}>
          <View style={styles.centerContent}>
            <Text style={styles.errorIcon}>📍</Text>
            <Text style={styles.errorTitle}>Location Permission Required</Text>
            <Text style={styles.errorText}>
              We need your location to calculate accurate prayer times for your area.
            </Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => loadPrayerTimes()}>
              <Text style={styles.retryButtonText}>Grant Permission</Text>
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  }

  if (state === 'error') {
    return (
      <>
        <Stack.Screen options={{ title: t('prayerTimes.title') }} />
        <View style={styles.container}>
          <View style={styles.centerContent}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorTitle}>Failed to Load</Text>
            <Text style={styles.errorText}>
              Unable to fetch prayer times. Please check your internet connection.
            </Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => loadPrayerTimes()}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  }

  const prayers = getPrayersList();
  const nextObligatoryPrayer = prayers.find((p) => p.isNext && isObligatoryPrayerName(p.name));

  return (
    <>
      <Stack.Screen 
        options={{
          title: t('prayerTimes.title'),
          headerRight: () => (
            <TouchableOpacity 
              onPress={() => router.push('/adhan-settings')} 
              style={{ marginRight: 8 }}
            >
              <Ionicons name="settings-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          ),
        }} 
      />
      <View style={styles.container}>
        <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#64B5F6"
            colors={['#64B5F6']}
          />
        }
      >
        {/* Date Card */}
        <View style={styles.dateCard}>
          <View style={styles.dateRow}>
            <Ionicons name="calendar-outline" size={20} color="#64B5F6" />
            <Text style={styles.gregorianDate}>{gregorianDate}</Text>
          </View>
          <Text style={styles.hijriDate}>{hijriDate}</Text>
          {location && (
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={16} color="#9CA3AF" />
              <Text style={styles.locationText}>
                {location.latitude.toFixed(4)}°, {location.longitude.toFixed(4)}°
              </Text>
            </View>
          )}
        </View>

        {/* Prayer Guidance Link */}
        <TouchableOpacity
          style={styles.guidanceCard}
          onPress={() =>
            router.push({
              pathname: '/prayer-guidance',
              params: nextObligatoryPrayer ? { prayer: nextObligatoryPrayer.name } : undefined,
            })
          }
        >
          <View style={styles.guidanceLeft}
          >
            <Ionicons name="sparkles-outline" size={22} color="#64B5F6" />
            <View style={styles.guidanceTextBlock}>
              <Text style={styles.guidanceTitle}>{t('prayerTimes.getGuidance')}</Text>
              <Text style={styles.guidanceSubtitle}>
                {nextObligatoryPrayer ? `${nextObligatoryPrayer.name} • ${nextObligatoryPrayer.time}` : t('prayerTimes.title')}
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
        </TouchableOpacity>

        {/* Prayer Times List */}
        <View style={styles.prayersList}>
          {prayers.map((prayer, index) => {
            const timeUntil = prayer.isNext ? getTimeUntilPrayer(prayer.time) : null;
            const isSunrise = prayer.name === 'Sunrise';
            const isGuidanceSupported = isObligatoryPrayerName(prayer.name);

            return (
              <TouchableOpacity
                key={prayer.name}
                style={[
                  styles.prayerCard,
                  prayer.isNext && styles.prayerCardNext,
                  isSunrise && styles.prayerCardDisabled,
                ]}
                activeOpacity={0.85}
                disabled={!isGuidanceSupported}
                onPress={() => {
                  if (!isGuidanceSupported) return;
                  router.push({
                    pathname: '/prayer-guidance',
                    params: { prayer: prayer.name },
                  });
                }}
              >
                <View style={styles.prayerLeft}>
                  <Text style={styles.prayerIcon}>{prayer.icon}</Text>
                  <View style={styles.prayerNames}>
                    <Text style={[styles.prayerName, prayer.isNext && styles.prayerNameNext]}>
                      {prayer.name}
                    </Text>
                    <Text style={[styles.prayerNameArabic, prayer.isNext && styles.prayerNameArabicNext]}>
                      {prayer.nameArabic}
                    </Text>
                    {isGuidanceSupported && (
                      <Text style={styles.guidanceHint}>
                        {t('prayerTimes.tapForGuidance')}
                      </Text>
                    )}
                  </View>
                </View>

                <View style={styles.prayerRight}>
                  <Text style={[styles.prayerTime, prayer.isNext && styles.prayerTimeNext]}>
                    {prayer.time}
                  </Text>
                  {prayer.isNext && timeUntil && (
                    <Text style={styles.countdown}>
                      {t('prayerTimes.inTime', { time: `${timeUntil.hours}h ${timeUntil.minutes}m` })}
                    </Text>
                  )}
                  {prayer.isNext && (
                    <View style={styles.nextBadge}>
                      <Text style={styles.nextBadgeText}>{t('prayerTimes.next')}</Text>
                    </View>
                  )}
                  {isSunrise && (
                    <Text style={styles.sunriseNote}>{t('prayerTimes.noPrayer')}</Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="information-circle-outline" size={20} color="#64B5F6" />
            <Text style={styles.infoTitle}>{t('prayerTimes.calculationMethod')}</Text>
          </View>
          <Text style={styles.infoText}>{t('prayerTimes.method.mwl')}</Text>
          <Text style={styles.infoSubtext}>
            {t('prayerTimes.timesBasedOnLocation')}
          </Text>
        </View>

        {/* Settings Link */}
        <TouchableOpacity
          style={styles.settingsCard}
          onPress={() => router.push('/adhan-settings')}
        >
          <View style={styles.settingsLeft}>
            <Ionicons name="notifications-outline" size={24} color="#64B5F6" />
            <Text style={styles.settingsText}>{t('prayerTimes.configureAdhan')}</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },

  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },

  loadingText: {
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 16,
  },

  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },

  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },

  errorText: {
    fontSize: 15,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },

  retryButton: {
    backgroundColor: '#64B5F6',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
  },

  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  scrollView: {
    flex: 1,
  },

  dateCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    margin: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },

  guidanceCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  guidanceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },

  guidanceTextBlock: {
    flex: 1,
  },

  guidanceTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  guidanceSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },

  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },

  gregorianDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  hijriDate: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64B5F6',
    textAlign: 'right',
    marginBottom: 12,
    fontFamily: 'System',
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },

  locationText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: 'monospace',
  },

  prayersList: {
    paddingHorizontal: 16,
    gap: 12,
  },

  prayerCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },

  prayerCardNext: {
    backgroundColor: '#1e3a5f',
    borderColor: '#64B5F6',
    borderWidth: 2,
  },

  prayerCardDisabled: {
    opacity: 0.6,
  },

  prayerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },

  prayerIcon: {
    fontSize: 32,
  },

  prayerNames: {
    gap: 4,
  },

  prayerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E5E7EB',
  },

  prayerNameNext: {
    color: '#FFFFFF',
  },

  prayerNameArabic: {
    fontSize: 14,
    color: '#9CA3AF',
    fontFamily: 'System',
  },

  prayerNameArabicNext: {
    color: '#64B5F6',
  },

  guidanceHint: {
    fontSize: 11,
    color: '#64B5F6',
    opacity: 0.7,
    fontStyle: 'italic',
    marginTop: 2,
  },

  prayerRight: {
    alignItems: 'flex-end',
    gap: 4,
  },

  prayerTime: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'monospace',
  },

  prayerTimeNext: {
    color: '#64B5F6',
  },

  countdown: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: 'monospace',
  },

  nextBadge: {
    backgroundColor: '#64B5F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
  },

  nextBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },

  sunriseNote: {
    fontSize: 11,
    color: '#6B7280',
    fontStyle: 'italic',
  },

  infoCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    margin: 16,
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#334155',
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },

  infoTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  infoText: {
    fontSize: 16,
    color: '#64B5F6',
    marginBottom: 8,
  },

  infoSubtext: {
    fontSize: 13,
    color: '#9CA3AF',
    lineHeight: 20,
  },

  settingsCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#334155',
  },

  settingsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },

  settingsText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#E5E7EB',
  },
});
