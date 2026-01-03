/**
 * Planetary Hours Service (Sā'āt al-Kawākib)
 * ============================================
 * Calculates traditional planetary hours using the Chaldean order
 * 
 * Theory:
 * - Day is divided into 12 planetary hours (sunrise to sunset)
 * - Night is divided into 12 planetary hours (sunset to next sunrise)
 * - Each hour is ruled by a planet following the Chaldean sequence
 * - The first hour of each day is ruled by that day's planetary ruler
 * 
 * Chaldean Order (slowest to fastest):
 * Saturn → Jupiter → Mars → Sun → Venus → Mercury → Moon (repeat)
 * 
 * Enhanced: Pre-calculation and caching for improved performance
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Element } from './MomentAlignmentService';

// Cache configuration
const CACHE_KEY_PREFIX = '@asrar_planetary_hours_';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export type Planet = 'Sun' | 'Moon' | 'Mars' | 'Mercury' | 'Jupiter' | 'Venus' | 'Saturn';

export interface PlanetInfo {
  planet: Planet;
  symbol: string;
  arabicName: string;
  element: Element;
}

export interface PlanetaryHour {
  planet: Planet;
  planetInfo: PlanetInfo;
  hourNumber: number; // 1-24
  startTime: Date;
  endTime: Date;
  isDaytime: boolean;
}

export interface PlanetaryHourData {
  /** Day ruler planet */
  dayRulerPlanet: Planet;
  dayRulerInfo: PlanetInfo;
  
  /** Current hour */
  currentHour: PlanetaryHour;
  
  /** Next hour */
  nextHour: PlanetaryHour;
  
  /** Hour after next */
  afterNextHour?: PlanetaryHour;
  
  /** Countdown to next hour in seconds */
  countdownSeconds: number;
}

/** Cache structure for full day of planetary hours */
interface DailyPlanetaryHoursCache {
  date: string; // YYYY-MM-DD
  dayRulerPlanet: Planet;
  dayRulerInfo: PlanetInfo;
  hours: PlanetaryHour[]; // All 24 hours
  sunrise: string; // ISO string
  sunset: string; // ISO string
  nextSunrise: string; // ISO string
  cachedAt: number; // timestamp
  expiresAt: number; // timestamp
}

// Chaldean order sequence
const CHALDEAN_ORDER: Planet[] = [
  'Saturn',
  'Jupiter', 
  'Mars',
  'Sun',
  'Venus',
  'Mercury',
  'Moon',
];

// Day rulers (traditional)
const DAY_RULERS: Record<number, Planet> = {
  0: 'Sun',     // Sunday
  1: 'Moon',    // Monday
  2: 'Mars',    // Tuesday
  3: 'Mercury', // Wednesday
  4: 'Jupiter', // Thursday
  5: 'Venus',   // Friday
  6: 'Saturn',  // Saturday
};

// Planet information
const PLANET_INFO: Record<Planet, PlanetInfo> = {
  Sun: {
    planet: 'Sun',
    symbol: '☉',
    arabicName: 'الشمس',
    element: 'fire',
  },
  Moon: {
    planet: 'Moon',
    symbol: '☽',
    arabicName: 'القمر',
    element: 'water',
  },
  Mars: {
    planet: 'Mars',
    symbol: '♂',
    arabicName: 'المريخ',
    element: 'fire',
  },
  Mercury: {
    planet: 'Mercury',
    symbol: '☿',
    arabicName: 'عطارد',
    element: 'air',
  },
  Jupiter: {
    planet: 'Jupiter',
    symbol: '♃',
    arabicName: 'المشتري',
    element: 'air',
  },
  Venus: {
    planet: 'Venus',
    symbol: '♀',
    arabicName: 'الزهرة',
    element: 'earth',
  },
  Saturn: {
    planet: 'Saturn',
    symbol: '♄',
    arabicName: 'زحل',
    element: 'earth',
  },
};

/**
 * Get planet info by planet name
 */
export function getPlanetInfo(planet: Planet): PlanetInfo {
  return PLANET_INFO[planet];
}

/**
 * Get the ruling planet for a given day of week
 */
export function getDayRuler(date: Date): Planet {
  const dayOfWeek = date.getDay();
  return DAY_RULERS[dayOfWeek];
}

/**
 * Get the next planet in the Chaldean sequence
 */
function getNextPlanet(current: Planet): Planet {
  const currentIndex = CHALDEAN_ORDER.indexOf(current);
  const nextIndex = (currentIndex + 1) % CHALDEAN_ORDER.length;
  return CHALDEAN_ORDER[nextIndex];
}

/**
 * Calculate which planet rules a given hour number (0-23)
 * starting from the day ruler at hour 0
 */
function getPlanetForHour(dayRuler: Planet, hourNumber: number): Planet {
  const dayRulerIndex = CHALDEAN_ORDER.indexOf(dayRuler);
  const planetIndex = (dayRulerIndex + hourNumber) % CHALDEAN_ORDER.length;
  return CHALDEAN_ORDER[planetIndex];
}

/**
 * Calculate planetary hours for a given day
 * 
 * @param sunrise - Sunrise time
 * @param sunset - Sunset time  
 * @param nextSunrise - Next day's sunrise time
 * @param now - Current time
 * @returns Planetary hour data
 */
export function calculatePlanetaryHours(
  sunrise: Date,
  sunset: Date,
  nextSunrise: Date,
  now: Date = new Date()
): PlanetaryHourData {
  const dayRuler = getDayRuler(sunrise);
  
  // Calculate hour durations
  const dayDuration = sunset.getTime() - sunrise.getTime();
  const nightDuration = nextSunrise.getTime() - sunset.getTime();
  const dayHourDuration = dayDuration / 12;
  const nightHourDuration = nightDuration / 12;
  
  // Determine if current time is during day or night
  const isDaytime = now >= sunrise && now < sunset;
  
  // Find current hour
  let currentHourNumber: number;
  let currentStartTime: Date;
  let currentEndTime: Date;
  let currentHourDuration: number;
  
  if (isDaytime) {
    // Daytime hours (0-11)
    const timeSinceSunrise = now.getTime() - sunrise.getTime();
    currentHourNumber = Math.floor(timeSinceSunrise / dayHourDuration);
    currentHourNumber = Math.min(currentHourNumber, 11); // Cap at hour 11
    
    currentStartTime = new Date(sunrise.getTime() + (currentHourNumber * dayHourDuration));
    currentEndTime = new Date(sunrise.getTime() + ((currentHourNumber + 1) * dayHourDuration));
    currentHourDuration = dayHourDuration;
  } else {
    // Nighttime hours (12-23)
    const timeSinceSunset = now.getTime() - sunset.getTime();
    const nightHourIndex = Math.floor(timeSinceSunset / nightHourDuration);
    currentHourNumber = 12 + Math.min(nightHourIndex, 11); // Hours 12-23
    
    const nightHourOffset = currentHourNumber - 12;
    currentStartTime = new Date(sunset.getTime() + (nightHourOffset * nightHourDuration));
    currentEndTime = new Date(sunset.getTime() + ((nightHourOffset + 1) * nightHourDuration));
    currentHourDuration = nightHourDuration;
  }
  
  // Get planet for current hour
  const currentPlanet = getPlanetForHour(dayRuler, currentHourNumber);
  
  // Build current hour object
  const currentHour: PlanetaryHour = {
    planet: currentPlanet,
    planetInfo: getPlanetInfo(currentPlanet),
    hourNumber: currentHourNumber + 1, // 1-24 for display
    startTime: currentStartTime,
    endTime: currentEndTime,
    isDaytime,
  };
  
  // Calculate next hour
  const nextHourNumber = (currentHourNumber + 1) % 24;
  const nextPlanet = getPlanetForHour(dayRuler, nextHourNumber);
  const nextIsDaytime = nextHourNumber < 12;
  
  let nextStartTime: Date;
  let nextEndTime: Date;
  
  if (nextIsDaytime) {
    const hourOffset = nextHourNumber;
    nextStartTime = new Date(sunrise.getTime() + (hourOffset * dayHourDuration));
    nextEndTime = new Date(sunrise.getTime() + ((hourOffset + 1) * dayHourDuration));
  } else {
    const nightHourOffset = nextHourNumber - 12;
    nextStartTime = new Date(sunset.getTime() + (nightHourOffset * nightHourDuration));
    nextEndTime = new Date(sunset.getTime() + ((nightHourOffset + 1) * nightHourDuration));
  }
  
  const nextHour: PlanetaryHour = {
    planet: nextPlanet,
    planetInfo: getPlanetInfo(nextPlanet),
    hourNumber: nextHourNumber + 1,
    startTime: nextStartTime,
    endTime: nextEndTime,
    isDaytime: nextIsDaytime,
  };
  
  // Calculate after next hour (optional)
  const afterNextHourNumber = (nextHourNumber + 1) % 24;
  const afterNextPlanet = getPlanetForHour(dayRuler, afterNextHourNumber);
  const afterNextIsDaytime = afterNextHourNumber < 12;
  
  let afterNextStartTime: Date;
  let afterNextEndTime: Date;
  
  if (afterNextIsDaytime) {
    const hourOffset = afterNextHourNumber;
    afterNextStartTime = new Date(sunrise.getTime() + (hourOffset * dayHourDuration));
    afterNextEndTime = new Date(sunrise.getTime() + ((hourOffset + 1) * dayHourDuration));
  } else {
    const nightHourOffset = afterNextHourNumber - 12;
    afterNextStartTime = new Date(sunset.getTime() + (nightHourOffset * nightHourDuration));
    afterNextEndTime = new Date(sunset.getTime() + ((nightHourOffset + 1) * nightHourDuration));
  }
  
  const afterNextHour: PlanetaryHour = {
    planet: afterNextPlanet,
    planetInfo: getPlanetInfo(afterNextPlanet),
    hourNumber: afterNextHourNumber + 1,
    startTime: afterNextStartTime,
    endTime: afterNextEndTime,
    isDaytime: afterNextIsDaytime,
  };
  
  // Calculate countdown to next hour
  const countdownMs = currentEndTime.getTime() - now.getTime();
  const countdownSeconds = Math.max(0, Math.floor(countdownMs / 1000));
  
  return {
    dayRulerPlanet: dayRuler,
    dayRulerInfo: getPlanetInfo(dayRuler),
    currentHour,
    nextHour,
    afterNextHour,
    countdownSeconds,
  };
}

/**
 * Format countdown seconds to human readable string
 * @param seconds - Total seconds
 * @returns Formatted string like "14m 22s" or "1h 5m"
 */
export function formatCountdown(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
}

/**
 * Format time to HH:MM
 */
export function formatTime(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Pre-calculate and cache all 24 planetary hours for a day
 * This significantly improves performance when browsing timelines
 * 
 * @param sunrise - Sunrise time
 * @param sunset - Sunset time
 * @param nextSunrise - Next day's sunrise time
 * @returns Cached data structure
 */
export async function preCalculateDailyPlanetaryHours(
  sunrise: Date,
  sunset: Date,
  nextSunrise: Date
): Promise<DailyPlanetaryHoursCache | null> {
  try {
    const dateKey = sunrise.toISOString().split('T')[0];
    const cacheKey = `${CACHE_KEY_PREFIX}${dateKey}`;
    
    // Check if already cached
    const cached = await AsyncStorage.getItem(cacheKey);
    if (cached) {
      const cacheData: DailyPlanetaryHoursCache = JSON.parse(cached);
      
      // Check if still valid
      if (Date.now() < cacheData.expiresAt) {
        return cacheData;
      }
    }
    
    // Calculate all 24 hours
    const dayRuler = getDayRuler(sunrise);
    const dayDuration = sunset.getTime() - sunrise.getTime();
    const nightDuration = nextSunrise.getTime() - sunset.getTime();
    const dayHourDuration = dayDuration / 12;
    const nightHourDuration = nightDuration / 12;
    
    const allHours: PlanetaryHour[] = [];
    
    // Calculate day hours (0-11)
    for (let h = 0; h < 12; h++) {
      const planet = getPlanetForHour(dayRuler, h);
      const startTime = new Date(sunrise.getTime() + (h * dayHourDuration));
      const endTime = new Date(sunrise.getTime() + ((h + 1) * dayHourDuration));
      
      allHours.push({
        planet,
        planetInfo: getPlanetInfo(planet),
        hourNumber: h + 1,
        startTime,
        endTime,
        isDaytime: true,
      });
    }
    
    // Calculate night hours (12-23)
    for (let h = 0; h < 12; h++) {
      const planet = getPlanetForHour(dayRuler, h + 12);
      const startTime = new Date(sunset.getTime() + (h * nightHourDuration));
      const endTime = new Date(sunset.getTime() + ((h + 1) * nightHourDuration));
      
      allHours.push({
        planet,
        planetInfo: getPlanetInfo(planet),
        hourNumber: h + 13, // 13-24
        startTime,
        endTime,
        isDaytime: false,
      });
    }
    
    // Create cache structure
    const cacheData: DailyPlanetaryHoursCache = {
      date: dateKey,
      dayRulerPlanet: dayRuler,
      dayRulerInfo: getPlanetInfo(dayRuler),
      hours: allHours,
      sunrise: sunrise.toISOString(),
      sunset: sunset.toISOString(),
      nextSunrise: nextSunrise.toISOString(),
      cachedAt: Date.now(),
      expiresAt: nextSunrise.getTime(),
    };
    
    // Cache it
    await AsyncStorage.setItem(cacheKey, JSON.stringify(cacheData));
    
    return cacheData;
    
  } catch (error) {
    console.error('[PlanetaryHoursService] Pre-calculation error:', error);
    return null;
  }
}

/**
 * Get planetary hour data from pre-calculated cache
 * Falls back to real-time calculation if cache not available
 * 
 * @param now - Current time
 * @param sunrise - Sunrise time
 * @param sunset - Sunset time
 * @param nextSunrise - Next day's sunrise time
 * @returns Planetary hour data
 */
export async function getPlanetaryHoursFromCache(
  now: Date,
  sunrise: Date,
  sunset: Date,
  nextSunrise: Date
): Promise<PlanetaryHourData> {
  try {
    const dateKey = sunrise.toISOString().split('T')[0];
    const cacheKey = `${CACHE_KEY_PREFIX}${dateKey}`;
    
    // Try to get from cache
    const cached = await AsyncStorage.getItem(cacheKey);
    if (cached) {
      const cacheData: DailyPlanetaryHoursCache = JSON.parse(cached);
      
      // Check if still valid
      if (Date.now() < cacheData.expiresAt) {
        // Find current hour from cached data
        let currentHourIndex = 0;
        for (let i = 0; i < cacheData.hours.length; i++) {
          const hour = cacheData.hours[i];
          const start = new Date(hour.startTime);
          const end = new Date(hour.endTime);
          
          if (now >= start && now < end) {
            currentHourIndex = i;
            break;
          }
        }
        
        const currentHour = cacheData.hours[currentHourIndex];
        const nextHour = cacheData.hours[(currentHourIndex + 1) % 24];
        const afterNextHour = cacheData.hours[(currentHourIndex + 2) % 24];
        
        const currentEnd = new Date(currentHour.endTime);
        const countdownMs = currentEnd.getTime() - now.getTime();
        const countdownSeconds = Math.max(0, Math.floor(countdownMs / 1000));
        
        return {
          dayRulerPlanet: cacheData.dayRulerPlanet,
          dayRulerInfo: cacheData.dayRulerInfo,
          currentHour,
          nextHour,
          afterNextHour,
          countdownSeconds,
        };
      }
    }
    
    // Fallback to real-time calculation
    return calculatePlanetaryHours(sunrise, sunset, nextSunrise, now);
    
  } catch (error) {
    console.error('[PlanetaryHoursService] Cache read error:', error);
    // Fallback to real-time calculation
    return calculatePlanetaryHours(sunrise, sunset, nextSunrise, now);
  }
}

/**
 * Get specific hour from cache by hour number (1-24)
 * Useful for timeline displays
 * 
 * @param hourNumber - Hour number (1-24)
 * @param sunrise - Sunrise time
 * @returns Planetary hour or null if not found
 */
export async function getHourByNumber(
  hourNumber: number,
  sunrise: Date
): Promise<PlanetaryHour | null> {
  try {
    const dateKey = sunrise.toISOString().split('T')[0];
    const cacheKey = `${CACHE_KEY_PREFIX}${dateKey}`;
    
    const cached = await AsyncStorage.getItem(cacheKey);
    if (!cached) return null;
    
    const cacheData: DailyPlanetaryHoursCache = JSON.parse(cached);
    
    // Check validity
    if (Date.now() > cacheData.expiresAt) return null;
    
    // Find hour by number
    return cacheData.hours.find(h => h.hourNumber === hourNumber) || null;
    
  } catch (error) {
    console.error('[PlanetaryHoursService] Get hour by number error:', error);
    return null;
  }
}

/**
 * Cleanup expired planetary hours cache
 */
export async function cleanupExpiredPlanetaryCache(): Promise<number> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const planetaryKeys = keys.filter(key => key.startsWith(CACHE_KEY_PREFIX));
    
    const toRemove: string[] = [];
    const now = Date.now();
    
    for (const key of planetaryKeys) {
      const cached = await AsyncStorage.getItem(key);
      if (cached) {
        try {
          const cacheData: DailyPlanetaryHoursCache = JSON.parse(cached);
          if (now > cacheData.expiresAt) {
            toRemove.push(key);
          }
        } catch {
          toRemove.push(key);
        }
      }
    }
    
    if (toRemove.length > 0) {
      await AsyncStorage.multiRemove(toRemove);
      console.log(`[PlanetaryHoursService] Cleaned up ${toRemove.length} expired entries`);
    }
    
    return toRemove.length;
    
  } catch (error) {
    console.error('[PlanetaryHoursService] Cleanup error:', error);
    return 0;
  }
}

/**
 * Clear all planetary hours cache
 */
export async function clearPlanetaryHoursCache(): Promise<void> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const planetaryKeys = keys.filter(key => key.startsWith(CACHE_KEY_PREFIX));
    await AsyncStorage.multiRemove(planetaryKeys);
    console.log(`[PlanetaryHoursService] Cleared ${planetaryKeys.length} cache entries`);
  } catch (error) {
    console.error('[PlanetaryHoursService] Clear cache error:', error);
  }
}
