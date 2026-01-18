/**
 * Prayer Times API Service
 * Integrates with Aladhan API (https://aladhan.com/prayer-times-api)
 * 
 * Features:
 * - Fetches daily prayer times by coordinates
 * - Supports multiple calculation methods
 * - No API key required (free service)
 * - Caches results for 24 hours
 * - Enhanced: Weekly prefetch for offline capability
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

const ALADHAN_API_BASE = 'https://api.aladhan.com/v1';
const CACHE_KEY = '@asrar_prayer_times_cache';
const CACHE_KEY_PREFIX = '@asrar_prayer_times_day_';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const PREFETCH_DAYS = 7; // Prefetch 1 week of prayer times

export interface PrayerTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

export interface PrayerTimeResponse {
  timings: PrayerTimings;
  date: {
    readable: string;
    timestamp: string;
    gregorian: {
      date: string;
      day: string;
      month: {
        number: number;
        en: string;
      };
      year: string;
    };
    hijri: {
      date: string;
      day: string;
      month: {
        number: number;
        en: string;
        ar: string;
      };
      year: string;
    };
  };
}

export interface CachedPrayerData {
  data: PrayerTimeResponse;
  timestamp: number;
  latitude: number;
  longitude: number;
}

export type CalculationMethod = 
  | 0  // Shia Ithna-Ashari
  | 1  // University of Islamic Sciences, Karachi
  | 2  // Islamic Society of North America
  | 3  // Muslim World League
  | 4  // Umm Al-Qura University, Makkah
  | 5  // Egyptian General Authority of Survey
  | 7  // Institute of Geophysics, University of Tehran
  | 8  // Gulf Region
  | 9  // Kuwait
  | 10 // Qatar
  | 11 // Majlis Ugama Islam Singapura, Singapore
  | 12 // Union Organization islamic de France
  | 13 // Diyanet İşleri Başkanlığı, Turkey
  | 14; // Spiritual Administration of Muslims of Russia

/**
 * Fetch prayer times from Aladhan API
 */
export async function fetchPrayerTimes(
  latitude: number,
  longitude: number,
  method: CalculationMethod = 3 // Default: Muslim World League
): Promise<PrayerTimeResponse> {
  try {
    // If we're offline, prefer cache (even if stale) over hard failure.
    const netInfo = await NetInfo.fetch();

    // Check cache first
    const cached = await getCachedPrayerTimes(latitude, longitude, {
      allowExpired: !netInfo.isConnected,
    });
    if (cached) {
      return cached.data;
    }

    // Build API URL
    const timestamp = Math.floor(Date.now() / 1000);
    const url = `${ALADHAN_API_BASE}/timings/${timestamp}?latitude=${latitude}&longitude=${longitude}&method=${method}`;

    if (__DEV__) {
      console.log('Fetching prayer times from Aladhan API:', url);
    }

    const response = await fetchWithTimeout(url, 12000);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const json = await response.json();
    
    if (json.code !== 200 || !json.data) {
      throw new Error('Invalid API response');
    }

    const prayerData: PrayerTimeResponse = json.data;

    // Cache the results
    await cachePrayerTimes(prayerData, latitude, longitude);

    // Warm daily caches opportunistically (WiFi only) for better offline support.
    // Fire-and-forget: any errors are logged inside prefetchPrayerTimes.
    void prefetchPrayerTimes(latitude, longitude, method);

    return prayerData;
  } catch (error) {
    // Retry once on transient network failure, then fall back to stale cache if available.
    try {
      const timestamp = Math.floor(Date.now() / 1000);
      const url = `${ALADHAN_API_BASE}/timings/${timestamp}?latitude=${latitude}&longitude=${longitude}&method=${method}`;
      const response = await fetchWithTimeout(url, 12000);
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      const json = await response.json();
      if (json.code !== 200 || !json.data) {
        throw new Error('Invalid API response');
      }
      const prayerData: PrayerTimeResponse = json.data;
      await cachePrayerTimes(prayerData, latitude, longitude);
      void prefetchPrayerTimes(latitude, longitude, method);
      return prayerData;
    } catch (retryError) {
      const fallback = await getCachedPrayerTimes(latitude, longitude, { allowExpired: true });
      if (fallback) {
        console.warn('Using stale cached prayer times due to network failure:', retryError);
        return fallback.data;
      }

      console.error('Failed to fetch prayer times:', retryError);
      throw retryError;
    }
  }
}

/**
 * Get cached prayer times if valid
 */
async function getCachedPrayerTimes(
  latitude: number,
  longitude: number
  ,
  options?: {
    allowExpired?: boolean;
  }
): Promise<CachedPrayerData | null> {
  try {
    const cached = await AsyncStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const data: CachedPrayerData = JSON.parse(cached);

    // Check if cache is still valid
    const now = Date.now();
    const isExpired = now - data.timestamp > CACHE_DURATION;
    
    // Check if location has changed significantly (more than ~1km)
    const latDiff = Math.abs(data.latitude - latitude);
    const lonDiff = Math.abs(data.longitude - longitude);
    const locationChanged = latDiff > 0.01 || lonDiff > 0.01;

    if (locationChanged) {
      return null;
    }

    if (isExpired && !options?.allowExpired) {
      return null;
    }

    // Cache hit: intentionally silent to avoid log spam during UI tickers.
    return data;
  } catch (error) {
    console.error('Failed to read prayer times cache:', error);
    return null;
  }
}

async function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Cache prayer times
 */
async function cachePrayerTimes(
  data: PrayerTimeResponse,
  latitude: number,
  longitude: number
): Promise<void> {
  try {
    const cacheData: CachedPrayerData = {
      data,
      timestamp: Date.now(),
      latitude,
      longitude,
    };
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    if (__DEV__) {
      console.log('Prayer times cached successfully');
    }
  } catch (error) {
    console.error('Failed to cache prayer times:', error);
  }
}

/**
 * Get the next prayer time and name
 */
export function getNextPrayer(timings: PrayerTimings): {
  name: string;
  nameArabic: string;
  time: string;
} {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const prayers = [
    { name: 'Fajr', nameArabic: 'الفجر', time: timings.Fajr },
    { name: 'Sunrise', nameArabic: 'الشروق', time: timings.Sunrise },
    { name: 'Dhuhr', nameArabic: 'الظهر', time: timings.Dhuhr },
    { name: 'Asr', nameArabic: 'العصر', time: timings.Asr },
    { name: 'Maghrib', nameArabic: 'المغرب', time: timings.Maghrib },
    { name: 'Isha', nameArabic: 'العشاء', time: timings.Isha },
  ];

  // Convert prayer times to minutes
  const prayerMinutes = prayers.map(prayer => {
    const [hours, minutes] = prayer.time.split(':').map(Number);
    return {
      ...prayer,
      minutes: hours * 60 + minutes,
    };
  });

  // Find next prayer
  for (const prayer of prayerMinutes) {
    if (prayer.minutes > currentMinutes) {
      return {
        name: prayer.name,
        nameArabic: prayer.nameArabic,
        time: prayer.time,
      };
    }
  }

  // If no prayer found today, return Fajr (tomorrow)
  return prayers[0];
}

/**
 * Calculate time remaining until prayer
 */
export function getTimeUntilPrayer(prayerTime: string): {
  hours: number;
  minutes: number;
  totalMinutes: number;
} {
  const now = new Date();
  const [prayerHours, prayerMinutes] = prayerTime.split(':').map(Number);
  
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const prayerTotalMinutes = prayerHours * 60 + prayerMinutes;
  
  let diff = prayerTotalMinutes - currentMinutes;
  
  // If negative, prayer is tomorrow
  if (diff < 0) {
    diff += 24 * 60; // Add 24 hours
  }
  
  return {
    hours: Math.floor(diff / 60),
    minutes: diff % 60,
    totalMinutes: diff,
  };
}

/**
 * Clear prayer times cache (useful for testing or user-triggered refresh)
 */
export async function clearPrayerTimesCache(): Promise<void> {
  try {
    await AsyncStorage.removeItem(CACHE_KEY);
    
    // Also clear all daily caches
    const keys = await AsyncStorage.getAllKeys();
    const dailyCacheKeys = keys.filter(key => key.startsWith(CACHE_KEY_PREFIX));
    await AsyncStorage.multiRemove(dailyCacheKeys);
    
    console.log('Prayer times cache cleared');
  } catch (error) {
    console.error('Failed to clear prayer times cache:', error);
  }
}

/**
 * Prefetch prayer times for multiple days (WiFi only for bandwidth conservation)
 * Call this on app launch or when location changes
 * 
 * @param latitude - Latitude
 * @param longitude - Longitude
 * @param method - Calculation method
 * @param days - Number of days to prefetch (default 7)
 */
export async function prefetchPrayerTimes(
  latitude: number,
  longitude: number,
  method: CalculationMethod = 3,
  days: number = PREFETCH_DAYS
): Promise<void> {
  try {
    // Check network connection
    const netInfo = await NetInfo.fetch();
    
    // Only prefetch on WiFi to save mobile data
    if (netInfo.type !== 'wifi') {
      console.log('Skipping prefetch: Not on WiFi');
      return;
    }
    
    console.log(`Prefetching prayer times for ${days} days...`);
    
    const promises: Promise<void>[] = [];
    
    for (let i = 0; i < days; i++) {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + i);
      targetDate.setHours(12, 0, 0, 0); // Noon to ensure correct day
      
      const dateKey = targetDate.toISOString().split('T')[0]; // YYYY-MM-DD
      const cacheKey = `${CACHE_KEY_PREFIX}${dateKey}_${latitude.toFixed(2)}_${longitude.toFixed(2)}`;
      
      // Check if already cached
      const cached = await AsyncStorage.getItem(cacheKey);
      if (cached) {
        const cacheData: CachedPrayerData = JSON.parse(cached);
        // Check if still valid
        if (Date.now() - cacheData.timestamp < CACHE_DURATION) {
          continue; // Skip if already cached and valid
        }
      }
      
      // Fetch and cache this day
      promises.push(
        fetchAndCacheSingleDay(targetDate, latitude, longitude, method, cacheKey)
      );
    }
    
    await Promise.all(promises);
    console.log(`Successfully prefetched ${promises.length} days of prayer times`);
    
  } catch (error) {
    console.error('Failed to prefetch prayer times:', error);
  }
}

/**
 * Fetch and cache prayer times for a single day
 */
async function fetchAndCacheSingleDay(
  date: Date,
  latitude: number,
  longitude: number,
  method: CalculationMethod,
  cacheKey: string
): Promise<void> {
  try {
    const timestamp = Math.floor(date.getTime() / 1000);
    const url = `${ALADHAN_API_BASE}/timings/${timestamp}?latitude=${latitude}&longitude=${longitude}&method=${method}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    const json = await response.json();
    
    if (json.code !== 200 || !json.data) {
      throw new Error('Invalid API response');
    }
    
    const prayerData: PrayerTimeResponse = json.data;
    
    // Cache this day
    const cacheData: CachedPrayerData = {
      data: prayerData,
      timestamp: Date.now(),
      latitude,
      longitude,
    };
    
    await AsyncStorage.setItem(cacheKey, JSON.stringify(cacheData));
    
  } catch (error) {
    console.error(`Failed to fetch prayer times for ${date.toISOString()}:`, error);
    throw error;
  }
}

/**
 * Get prayer times for a specific date (uses daily cache)
 * 
 * @param date - Target date
 * @param latitude - Latitude
 * @param longitude - Longitude
 * @param method - Calculation method
 * @returns Prayer times for the specified date
 */
export async function getPrayerTimesForDate(
  date: Date,
  latitude: number,
  longitude: number,
  method: CalculationMethod = 3
): Promise<PrayerTimeResponse | null> {
  try {
    const dateKey = date.toISOString().split('T')[0];
    const cacheKey = `${CACHE_KEY_PREFIX}${dateKey}_${latitude.toFixed(2)}_${longitude.toFixed(2)}`;
    
    // Check daily cache first
    const cached = await AsyncStorage.getItem(cacheKey);
    if (cached) {
      const cacheData: CachedPrayerData = JSON.parse(cached);
      
      // Check if still valid
      if (Date.now() - cacheData.timestamp < CACHE_DURATION) {
        return cacheData.data;
      }
    }
    
    // Fetch if not cached
    console.log(`Fetching prayer times for ${dateKey}...`);
    await fetchAndCacheSingleDay(date, latitude, longitude, method, cacheKey);
    
    // Read from cache
    const newCached = await AsyncStorage.getItem(cacheKey);
    if (newCached) {
      const cacheData: CachedPrayerData = JSON.parse(newCached);
      return cacheData.data;
    }
    
    return null;
    
  } catch (error) {
    console.error('Failed to get prayer times for date:', error);
    return null;
  }
}

/**
 * Cleanup expired cache entries (call periodically)
 */
export async function cleanupExpiredPrayerCache(): Promise<void> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const dailyCacheKeys = keys.filter(key => key.startsWith(CACHE_KEY_PREFIX));
    
    const toRemove: string[] = [];
    
    for (const key of dailyCacheKeys) {
      const cached = await AsyncStorage.getItem(key);
      if (cached) {
        const cacheData: CachedPrayerData = JSON.parse(cached);
        
        // Remove if expired
        if (Date.now() - cacheData.timestamp > CACHE_DURATION) {
          toRemove.push(key);
        }
      }
    }
    
    if (toRemove.length > 0) {
      await AsyncStorage.multiRemove(toRemove);
      console.log(`Cleaned up ${toRemove.length} expired prayer time caches`);
    }
    
  } catch (error) {
    console.error('Failed to cleanup expired cache:', error);
  }
}
