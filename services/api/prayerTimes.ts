/**
 * Prayer Times API Service
 * Integrates with Aladhan API (https://aladhan.com/prayer-times-api)
 * 
 * Features:
 * - Fetches daily prayer times by coordinates
 * - Supports multiple calculation methods
 * - No API key required (free service)
 * - Caches results for 24 hours
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const ALADHAN_API_BASE = 'https://api.aladhan.com/v1';
const CACHE_KEY = '@asrar_prayer_times_cache';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

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
    // Check cache first
    const cached = await getCachedPrayerTimes(latitude, longitude);
    if (cached) {
      return cached.data;
    }

    // Build API URL
    const timestamp = Math.floor(Date.now() / 1000);
    const url = `${ALADHAN_API_BASE}/timings/${timestamp}?latitude=${latitude}&longitude=${longitude}&method=${method}`;

    console.log('Fetching prayer times from Aladhan API:', url);

    const response = await fetch(url);
    
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

    return prayerData;
  } catch (error) {
    console.error('Failed to fetch prayer times:', error);
    throw error;
  }
}

/**
 * Get cached prayer times if valid
 */
async function getCachedPrayerTimes(
  latitude: number,
  longitude: number
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

    if (isExpired || locationChanged) {
      console.log('Cache expired or location changed, will fetch fresh data');
      return null;
    }

    console.log('Using cached prayer times');
    return data;
  } catch (error) {
    console.error('Failed to read prayer times cache:', error);
    return null;
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
    console.log('Prayer times cached successfully');
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
    console.log('Prayer times cache cleared');
  } catch (error) {
    console.error('Failed to clear prayer times cache:', error);
  }
}
