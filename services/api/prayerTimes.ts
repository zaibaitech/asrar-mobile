/**
 * Prayer Times API Service
 * Integrates with Aladhan API (https://aladhan.com/prayer-times-api)
 * 
 * Features:
 * - Fetches daily prayer times by coordinates
 * - Supports multiple calculation methods
 * - No API key required (free service)
 * - Monthly caching (prayer times change only 1-2 min/day)
 * - Excellent offline support
 * - Cross-device sync via Supabase
 * 
 * NOTE: This file now delegates to PrayerTimesCacheService for better
 * performance. The old weekly prefetch logic is replaced with monthly caching.
 */

import {
    getPrayerTimesForDate as getMonthlyPrayerTimesForDate,
    getTodayPrayerTimes,
} from '@/services/PrayerTimesCacheService';
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
 * 
 * Now delegates to PrayerTimesCacheService which implements monthly caching
 * This provides ~99% reduction in API calls and excellent offline support
 */
export async function fetchPrayerTimes(
  latitude: number,
  longitude: number,
  method: CalculationMethod = 3 // Default: Muslim World League
): Promise<PrayerTimeResponse> {
  try {
    // Use new monthly cache service
    const todayData = await getTodayPrayerTimes(latitude, longitude, method);
    
    if (!todayData) {
      throw new Error('No prayer times available');
    }
    
    return todayData;
    
  } catch (error) {
    // Fallback to legacy cache if new system fails
    console.warn('Monthly cache failed, trying legacy cache:', error);
    
    const netInfo = await NetInfo.fetch();
    const cached = await getCachedPrayerTimes(latitude, longitude, {
      allowExpired: !netInfo.isConnected,
    });
    
    if (cached) {
      console.log('Using legacy cache as fallback');
      return cached.data;
    }
    
    // Last resort: direct API call
    console.warn('Both caches failed, making direct API call');
    return await fetchDirectFromAPI(latitude, longitude, method);
  }
}

/**
 * Direct API call (fallback only)
 */
async function fetchDirectFromAPI(
  latitude: number,
  longitude: number,
  method: CalculationMethod
): Promise<PrayerTimeResponse> {
  const timestamp = Math.floor(Date.now() / 1000);
  const url = `${ALADHAN_API_BASE}/timings/${timestamp}?latitude=${latitude}&longitude=${longitude}&method=${method}`;
  
  if (__DEV__) {
    console.log('Direct API call:', url);
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
  
  // Cache for legacy system
  await cachePrayerTimes(prayerData, latitude, longitude);
  
  return prayerData;
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
    const errorMsg = (error as any)?.message || '';
    if (errorMsg.includes('SQLITE_FULL') || errorMsg.includes('disk is full')) {
      if (__DEV__) console.warn('Cache failed: disk full, continuing without caching');
      // Continue without caching
    } else {
      console.error('Failed to cache prayer times:', error);
    }
  }
}

/**
 * Get the next prayer time and name
 */
/**
 * Parse prayer time string to HH:MM format
 * Handles formats like: "05:30", "05:30:45", "05:30 (EEST)"
 */
function parseTimeTo24Hour(timeString: string): string {
  if (!timeString) return '00:00';
  
  // Remove timezone info in parentheses
  const cleaned = timeString.replace(/\s*\([^)]*\)\s*/, '').trim();
  
  // Split by colon and take first two parts (HH:MM)
  const parts = cleaned.split(':');
  if (parts.length >= 2) {
    const hours = parts[0].padStart(2, '0');
    const minutes = parts[1].padStart(2, '0');
    return `${hours}:${minutes}`;
  }
  
  return '00:00';
}

export function getNextPrayer(timings: PrayerTimings): {
  name: string;
  nameArabic: string;
  time: string;
} {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const prayers = [
    { name: 'Fajr', nameArabic: 'الفجر', time: parseTimeTo24Hour(timings.Fajr) },
    { name: 'Sunrise', nameArabic: 'الشروق', time: parseTimeTo24Hour(timings.Sunrise) },
    { name: 'Dhuhr', nameArabic: 'الظهر', time: parseTimeTo24Hour(timings.Dhuhr) },
    { name: 'Asr', nameArabic: 'العصر', time: parseTimeTo24Hour(timings.Asr) },
    { name: 'Maghrib', nameArabic: 'المغرب', time: parseTimeTo24Hour(timings.Maghrib) },
    { name: 'Isha', nameArabic: 'العشاء', time: parseTimeTo24Hour(timings.Isha) },
  ];

  // Convert prayer times to minutes
  const prayerMinutes = prayers.map(prayer => {
    const [hours, minutes] = prayer.time.split(':').map(Number);
    return {
      ...prayer,
      minutes: hours * 60 + minutes,
    };
  });

  // Find next prayer that hasn't occurred yet today
  for (const prayer of prayerMinutes) {
    if (prayer.minutes > currentMinutes) {
      return {
        name: prayer.name,
        nameArabic: prayer.nameArabic,
        time: prayer.time,
      };
    }
  }

  // All prayers have passed for today, return tomorrow's Fajr
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
  // Validate prayer time format
  if (!prayerTime || typeof prayerTime !== 'string' || !prayerTime.includes(':')) {
    console.warn('Invalid prayer time format:', prayerTime);
    return { hours: 0, minutes: 0, totalMinutes: 0 };
  }

  // Parse the time to ensure HH:MM format
  const cleanTime = parseTimeTo24Hour(prayerTime);
  const now = new Date();
  const [prayerHours, prayerMinutes] = cleanTime.split(':').map(Number);
  
  // Validate parsed values
  if (isNaN(prayerHours) || isNaN(prayerMinutes)) {
    console.warn('Failed to parse prayer time:', prayerTime);
    return { hours: 0, minutes: 0, totalMinutes: 0 };
  }
  
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
    
    try {
      await AsyncStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (cacheError) {
      const errorMsg = (cacheError as any)?.message || '';
      if (errorMsg.includes('SQLITE_FULL') || errorMsg.includes('disk is full')) {
        console.warn('Cache write failed: disk full, continuing without caching');
        // Continue without caching - app still works
      } else {
        console.error('Failed to cache prayer times:', cacheError);
      }
    }
    
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
 * 
 * Now uses monthly caching for better performance
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
    // Use new monthly cache service
    const dateData = await getMonthlyPrayerTimesForDate(date, latitude, longitude, method);
    
    if (dateData) {
      return dateData;
    }
    
    // Fallback to legacy daily cache
    const dateKey = date.toISOString().split('T')[0];
    const cacheKey = `${CACHE_KEY_PREFIX}${dateKey}_${latitude.toFixed(2)}_${longitude.toFixed(2)}`;
    
    const cached = await AsyncStorage.getItem(cacheKey);
    if (cached) {
      const cacheData: CachedPrayerData = JSON.parse(cached);
      if (Date.now() - cacheData.timestamp < CACHE_DURATION) {
        return cacheData.data;
      }
    }
    
    // Last resort: fetch single day
    console.log(`Fetching single day as fallback...`);
    await fetchAndCacheSingleDay(date, latitude, longitude, method, cacheKey);
    
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
