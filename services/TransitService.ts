/**
 * Transit Service
 * ===============
 * 
 * Provides REAL astronomical planetary transit data (where planets are in zodiac).
 * This is separate from planetary hours (which change every 60-90 minutes).
 * 
 * Data Source: NASA JPL Horizons via EphemerisService
 * Cache Strategy: 6-24 hours depending on planet speed
 * Fallback: Static positions for current date if API unavailable
 */

import { globalRequestManager } from '@/services/cache/RequestManager';
import { PlanetPositions } from '@/types/divine-timing-personal';
import {
    AllPlanetTransits,
    PlanetTransit,
    TRANSIT_REFRESH_INTERVALS,
    ZodiacSign
} from '@/types/planetary-systems';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getPlanetPositions } from './EphemerisService';
import { Element } from './MomentAlignmentService';
import { Planet } from './PlanetaryHoursService';

// ============================================================================
// CONSTANTS
// ============================================================================

const CACHE_KEYS = {
  TRANSITS: '@asrar_planet_transits_cache',
  LAST_UPDATE: '@asrar_transits_last_update',
} as const;

let memoryTransits: AllPlanetTransits | null = null;
let inflightAll: Promise<AllPlanetTransits> | null = null;

export function getTransitsFromMemory(): AllPlanetTransits | null {
  return memoryTransits;
}

/**
 * Mapping from planet names to PlanetId for EphemerisService
 */
const PLANET_TO_EPHEMERIS_ID: Record<Planet, string> = {
  Sun: 'sun',
  Moon: 'moon',
  Mars: 'mars',
  Mercury: 'mercury',
  Jupiter: 'jupiter',
  Venus: 'venus',
  Saturn: 'saturn',
};

/**
 * Zodiac sign names (index 0-11 = Aries-Pisces)
 */
const ZODIAC_SIGNS: ZodiacSign[] = [
  'aries', 'taurus', 'gemini', 'cancer',
  'leo', 'virgo', 'libra', 'scorpio',
  'sagittarius', 'capricorn', 'aquarius', 'pisces',
];

/**
 * Zodiac sign names in Arabic
 */
const ZODIAC_SIGNS_ARABIC: Record<ZodiacSign, string> = {
  aries: 'الحمل',
  taurus: 'الثور',
  gemini: 'الجوزاء',
  cancer: 'السرطان',
  leo: 'الأسد',
  virgo: 'العذراء',
  libra: 'الميزان',
  scorpio: 'العقرب',
  sagittarius: 'القوس',
  capricorn: 'الجدي',
  aquarius: 'الدلو',
  pisces: 'الحوت',
};

/**
 * Zodiac sign elements
 */
const ZODIAC_ELEMENTS: Record<ZodiacSign, Element> = {
  aries: 'fire',
  taurus: 'earth',
  gemini: 'air',
  cancer: 'water',
  leo: 'fire',
  virgo: 'earth',
  libra: 'air',
  scorpio: 'water',
  sagittarius: 'fire',
  capricorn: 'earth',
  aquarius: 'air',
  pisces: 'water',
};

// ============================================================================
// MAIN SERVICE
// ============================================================================

/**
 * Get current transits for all planets
 * Returns cached data if fresh, otherwise fetches new data
 */
export async function getAllTransits(): Promise<AllPlanetTransits> {
  try {
    if (memoryTransits) {
      const lastUpdate = await getLastUpdateTime();
      if (isCacheValid(lastUpdate)) {
        return memoryTransits;
      }
    }

    if (inflightAll) {
      return inflightAll;
    }

    // Check cache first
    const cached = await getCachedTransits();
    const lastUpdate = await getLastUpdateTime();
    
    if (cached && isCacheValid(lastUpdate)) {
      if (__DEV__) {
        console.log('[TransitService] Using cached transits');
      }
      memoryTransits = cached;
      return cached;
    }
    
    // Fetch fresh data
    if (__DEV__) {
      console.log('[TransitService] Fetching fresh transit data...');
    }
    
    inflightAll = globalRequestManager.schedule(
      async () => {
        const fresh = await fetchTransitsFromEphemeris();
        await cacheTransits(fresh);
        memoryTransits = fresh;
        return fresh;
      },
      {
        key: 'transits.fetchAll',
        dedupeInflight: true,
        throttleMs: 5_000,
      }
    );

    return await inflightAll;
    
  } catch (error) {
    if (__DEV__) {
      console.error('[TransitService] Error getting transits:', error);
    }
    
    // Fallback to cached data or static defaults
    const cached = await getCachedTransits();
    if (cached) {
      memoryTransits = cached;
      return cached;
    }
    
    return getFallbackTransits();
  } finally {
    inflightAll = null;
  }
}

/**
 * Get transit for a specific planet
 */
export async function getTransit(planet: Planet): Promise<PlanetTransit> {
  const allTransits = await getAllTransits();
  return allTransits[planet];
}

/**
 * Force refresh transits (user action or background update)
 */
export async function refreshTransits(): Promise<AllPlanetTransits> {
  if (__DEV__) {
    console.log('[TransitService] Force refreshing transits...');
  }

  const fresh = await globalRequestManager.schedule(
    async () => {
      const data = await fetchTransitsFromEphemeris();
      await cacheTransits(data);
      memoryTransits = data;
      return data;
    },
    { key: 'transits.forceRefresh', dedupeInflight: true, throttleMs: 5_000 }
  );

  return fresh;
}

// ============================================================================
// DATA FETCHING
// ============================================================================

/**
 * Fetch transits from ephemeris source (NASA JPL Horizons)
 */
async function fetchTransitsFromEphemeris(): Promise<AllPlanetTransits> {
  try {
    const now = new Date();
    
    // Get planetary positions from EphemerisService
    const positions = await getPlanetPositions(now);
    
    if (!positions) {
      if (__DEV__) {
        console.warn('[TransitService] No ephemeris data available, using fallback');
      }
      return getFallbackTransits();
    }
    
    // Convert positions to transits
    const transits = parseEphemerisData(positions, now);
    
    if (__DEV__) {
      console.log('[TransitService] Successfully fetched transits from ephemeris');
    }
    
    return transits;
    
  } catch (error) {
    if (__DEV__) {
      console.error('[TransitService] Ephemeris fetch error:', error);
    }
    
    return getFallbackTransits();
  }
}

/**
 * Parse ephemeris positions into transit data
 */
function parseEphemerisData(
  positions: PlanetPositions,
  timestamp: Date
): AllPlanetTransits {
  const transits: Partial<AllPlanetTransits> = {};
  const now = timestamp;
  
  // Map each planet
  const planets: Planet[] = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
  
  for (const planet of planets) {
    const ephemerisId = PLANET_TO_EPHEMERIS_ID[planet];
    const position = positions.planets[ephemerisId as keyof typeof positions.planets];
    
    if (!position) {
      if (__DEV__) {
        console.warn(`[TransitService] Missing position for ${planet}`);
      }
      continue;
    }
    
    const sign = ZODIAC_SIGNS[position.sign];
    const signDegree = Math.floor(position.signDegree);
    const signMinute = Math.floor((position.signDegree % 1) * 60);
    const signDegreeFloat = signDegree + signMinute / 60;
    const windowEstimate = estimateTransitWindow(planet, now, signDegreeFloat);
    
    transits[planet] = {
      planet,
      sign,
      signArabic: ZODIAC_SIGNS_ARABIC[sign],
      element: ZODIAC_ELEMENTS[sign],
      signDegree,
      signMinute,
      isRetrograde: false, // TODO: Implement retrograde detection
      speedDegPerDay: undefined, // TODO: Calculate from consecutive positions
      transitStartDate: windowEstimate.start,
      transitEndDate: windowEstimate.end,
      lastUpdated: now,
      nextRefreshDue: calculateNextRefresh(planet, now),
      source: positions.source === 'ephemeris' ? 'ephemeris' : 'fallback',
    };
  }
  
  return transits as AllPlanetTransits;
}

// Average days per sign for each planet (rough astronomical averages)
const AVG_DAYS_PER_SIGN: Record<Planet, number> = {
  Moon: 2.5,
  Mercury: 22,
  Venus: 27,
  Mars: 50,
  Sun: 30.4,
  Jupiter: 365,
  Saturn: 900,
};

const DAY_MS = 24 * 60 * 60 * 1000;

function estimateTransitWindow(planet: Planet, now: Date, signDegreeFloat: number) {
  const days = AVG_DAYS_PER_SIGN[planet] ?? 30;
  const fraction = Math.min(1, Math.max(0, signDegreeFloat / 30));
  const start = new Date(now.getTime() - fraction * days * DAY_MS);
  const end = new Date(start.getTime() + days * DAY_MS);
  return { start, end };
}

/**
 * Calculate when next refresh should happen for a planet
 */
function calculateNextRefresh(planet: Planet, now: Date): Date {
  const interval = TRANSIT_REFRESH_INTERVALS[planet] || TRANSIT_REFRESH_INTERVALS.Jupiter;
  return new Date(now.getTime() + interval);
}

// ============================================================================
// CACHING
// ============================================================================

/**
 * Cache transits locally
 */
async function cacheTransits(transits: AllPlanetTransits): Promise<void> {
  try {
    memoryTransits = transits;
    await AsyncStorage.setItem(CACHE_KEYS.TRANSITS, JSON.stringify(transits));
    await AsyncStorage.setItem(CACHE_KEYS.LAST_UPDATE, new Date().toISOString());
    
    if (__DEV__) {
      console.log('[TransitService] Cached transit data');
    }
  } catch (error) {
    if (__DEV__) {
      console.error('[TransitService] Cache write error:', error);
    }
  }
}

/**
 * Get cached transits
 */
async function getCachedTransits(): Promise<AllPlanetTransits | null> {
  try {
    const cached = await AsyncStorage.getItem(CACHE_KEYS.TRANSITS);
    if (!cached) return null;
    
    const parsed = JSON.parse(cached);
    
    // Restore Date objects
    const transits: Partial<AllPlanetTransits> = {};
    for (const [planet, transit] of Object.entries(parsed)) {
      transits[planet as Planet] = {
        ...(transit as any),
        lastUpdated: new Date((transit as any).lastUpdated),
        nextRefreshDue: new Date((transit as any).nextRefreshDue),
        transitStartDate: (transit as any).transitStartDate 
          ? new Date((transit as any).transitStartDate) 
          : undefined,
        transitEndDate: (transit as any).transitEndDate 
          ? new Date((transit as any).transitEndDate) 
          : undefined,
      };
    }
    
    return transits as AllPlanetTransits;
    
  } catch (error) {
    if (__DEV__) {
      console.error('[TransitService] Cache read error:', error);
    }
    return null;
  }
}

/**
 * Check if cache is still valid
 */
function isCacheValid(lastUpdate: Date | null): boolean {
  if (!lastUpdate) return false;
  
  const now = new Date();
  const age = now.getTime() - lastUpdate.getTime();
  
  // Use most aggressive refresh interval (Moon: 6 hours)
  const maxAge = TRANSIT_REFRESH_INTERVALS.Moon;
  
  return age < maxAge;
}

/**
 * Get last update time from cache
 */
async function getLastUpdateTime(): Promise<Date | null> {
  try {
    const timestamp = await AsyncStorage.getItem(CACHE_KEYS.LAST_UPDATE);
    return timestamp ? new Date(timestamp) : null;
  } catch {
    return null;
  }
}

// ============================================================================
// FALLBACK DATA
// ============================================================================

/**
 * Fallback transits if ephemeris is unavailable
 * Based on approximate positions for January 2026
 */
function getFallbackTransits(): AllPlanetTransits {
  const now = new Date();
  
  return {
    Sun: createFallbackTransit('Sun', 'capricorn', now), // Jan 2026
    Moon: createFallbackTransit('Moon', 'cancer', now),  // Approximate
    Mercury: createFallbackTransit('Mercury', 'capricorn', now),
    Venus: createFallbackTransit('Venus', 'pisces', now),
    Mars: createFallbackTransit('Mars', 'cancer', now),
    Jupiter: createFallbackTransit('Jupiter', 'gemini', now, {
      transitStartDate: new Date('2024-05-25'),
      transitEndDate: new Date('2025-06-09'),
    }),
    Saturn: createFallbackTransit('Saturn', 'pisces', now, {
      transitStartDate: new Date('2023-03-07'),
      transitEndDate: new Date('2025-05-24'),
    }),
  };
}

/**
 * Create a fallback transit entry
 */
function createFallbackTransit(
  planet: Planet,
  sign: ZodiacSign,
  now: Date,
  timeline?: {
    transitStartDate?: Date;
    transitEndDate?: Date;
  }
): PlanetTransit {
  return {
    planet,
    sign,
    signArabic: ZODIAC_SIGNS_ARABIC[sign],
    element: ZODIAC_ELEMENTS[sign],
    lastUpdated: now,
    nextRefreshDue: calculateNextRefresh(planet, now),
    source: 'fallback',
    ...timeline,
  };
}

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Detect invalid transit changes (sanity check)
 * Jupiter/Saturn should not change signs in < 24 hours
 */
export function detectInvalidTransitChange(
  oldTransit: PlanetTransit,
  newTransit: PlanetTransit
): boolean {
  if (['Jupiter', 'Saturn'].includes(newTransit.planet)) {
    const timeSinceUpdate = newTransit.lastUpdated.getTime() - oldTransit.lastUpdated.getTime();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    
    if (timeSinceUpdate < twentyFourHours && oldTransit.sign !== newTransit.sign) {
      if (__DEV__) {
        console.warn(`🚨 Invalid ${newTransit.planet} sign change detected!`, {
          old: oldTransit.sign,
          new: newTransit.sign,
          timeSince: timeSinceUpdate,
        });
      }
      return true;
    }
  }
  
  return false;
}

/**
 * Clear transit cache (for testing/debugging)
 */
export async function clearTransitCache(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([CACHE_KEYS.TRANSITS, CACHE_KEYS.LAST_UPDATE]);
    
    if (__DEV__) {
      console.log('[TransitService] Cleared transit cache');
    }
  } catch (error) {
    if (__DEV__) {
      console.error('[TransitService] Error clearing cache:', error);
    }
  }
}
