/**
 * Transit Service
 * ===============
 * 
 * Provides REAL astronomical planetary transit data (where planets are in zodiac).
 * This is separate from planetary hours (which change every 60-90 minutes).
 * 
 * Data Source: NASA JPL Horizons via EphemerisService
 * Cache Strategy: Production-ready cache manager with automatic cleanup
 * Fallback: Use last-known cached data; do NOT guess positions.
 */

import { transitsCache } from '@/services/cache/CacheManager';
import { globalRequestManager } from '@/services/cache/RequestManager';
import { PlanetPositions } from '@/types/divine-timing-personal';
import {
    AllPlanetTransits,
    PlanetTransit,
    ZodiacSign
} from '@/types/planetary-systems';
import { getPlanetPositionsPrecise } from './EphemerisService';
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

// Planet transit UI: refresh often enough that degrees don't look static.
const UI_REFRESH_MS = 5 * 60 * 1000;

// Users should never see guessed/approximate transit positions.
const ALLOW_APPROX_FALLBACK = false;

// ============================================================================
// MAIN SERVICE
// ============================================================================

/**
 * Get current transits for all planets
 * Returns cached data if fresh, otherwise fetches new data
 */
export async function getAllTransits(): Promise<AllPlanetTransits | null> {
  try {
    if (memoryTransits) {
      const lastUpdate = getLastUpdatedFromTransits(memoryTransits);
      if (isCacheValid(lastUpdate)) {
        if (__DEV__) {
          console.log('[TransitService] ✓ Using memory cache');
        }
        return markAsCached(memoryTransits);
      }
    }

    if (inflightAll) {
      if (__DEV__) {
        console.log('[TransitService] ⏳ Waiting for in-flight request...');
      }
      return inflightAll;
    }

    // Check cache first
    const cached = await getCachedTransits();
    const lastUpdate = getLastUpdatedFromTransits(cached);
    
    if (cached && isCacheValid(lastUpdate)) {
      if (__DEV__) {
        console.log('[TransitService] ✓ Using disk cache');
      }
      const out = markAsCached(cached);
      memoryTransits = out;
      return out;
    }
    
    // Fetch fresh data
    if (__DEV__) {
      const age = lastUpdate ? Date.now() - lastUpdate.getTime() : null;
      console.log('[TransitService] 🔄 Fetching fresh transit data... (cache age: ' + (age ? age + 'ms' : 'none') + ')');
    }
    
    inflightAll = globalRequestManager.schedule(
      async () => {
        const fresh = await fetchTransitsFromEphemeris();
        if (!fresh) return null;
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

    const result = await inflightAll;
    if (result) return result;

    const cachedAfter = await getCachedTransits();
    if (cachedAfter) {
      const out = markAsCached(cachedAfter);
      memoryTransits = out;
      return out;
    }

    return null;
    
  } catch (error) {
    if (__DEV__) {
      console.error('[TransitService] Error getting transits:', error);
    }
    
    // Fallback to cached data (even if stale). Do NOT guess positions.
    const cached = await getCachedTransits();
    if (cached) {
      const out = markAsCached(cached);
      memoryTransits = out;
      return out;
    }

    if (ALLOW_APPROX_FALLBACK) {
      return getFallbackTransits();
    }

    return null;
  } finally {
    inflightAll = null;
  }
}

/**
 * Get transit for a specific planet
 */
export async function getTransit(planet: Planet): Promise<PlanetTransit | null> {
  const allTransits = await getAllTransits();
  return allTransits ? allTransits[planet] : null;
}

/**
 * Force refresh transits (user action or background update)
 */
export async function refreshTransits(): Promise<AllPlanetTransits | null> {
  if (__DEV__) {
    console.log('[TransitService] Force refreshing transits...');
  }

  const fresh = await globalRequestManager.schedule(
    async () => {
      const data = await fetchTransitsFromEphemeris();
      if (!data) return null;
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
async function fetchTransitsFromEphemeris(): Promise<AllPlanetTransits | null> {
  try {
    const now = new Date();
    
    // Get higher-precision planetary positions from EphemerisService
    const positions = await getPlanetPositionsPrecise(now);
    
    if (!positions) {
      if (__DEV__) {
        console.warn('[TransitService] No ephemeris data available');
      }
      return null;
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

    if (ALLOW_APPROX_FALLBACK) {
      return getFallbackTransits();
    }

    return null;
  }
}

function markAsCached(transits: AllPlanetTransits): AllPlanetTransits {
  const out: Partial<AllPlanetTransits> = {};
  for (const [planet, transit] of Object.entries(transits) as Array<[Planet, PlanetTransit]>) {
    out[planet] = {
      ...transit,
      source: 'cached',
    };
  }
  return out as AllPlanetTransits;
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
    
    const longitude = typeof (position as any).longitude === 'number' ? (position as any).longitude : 0;
    const normalized = ((longitude % 360) + 360) % 360;
    const signIndex = Math.floor(normalized / 30);
    const sign = ZODIAC_SIGNS[signIndex];
    const signDegFloat = normalized % 30;
    const signDegree = Math.floor(signDegFloat);
    const signMinute = Math.floor((signDegFloat % 1) * 60);
    const signDegreeFloat = signDegree + signMinute / 60;
    const windowEstimate = estimateTransitWindow(planet, now, signDegreeFloat);

    const speedDegPerDay = typeof (position as any).speedDegPerDay === 'number' ? (position as any).speedDegPerDay : undefined;
    const isRetrograde = typeof speedDegPerDay === 'number' ? speedDegPerDay < 0 : undefined;
    
    transits[planet] = {
      planet,
      sign,
      signArabic: ZODIAC_SIGNS_ARABIC[sign],
      element: ZODIAC_ELEMENTS[sign],
      longitude: normalized,
      signDegree,
      signMinute,
      isRetrograde,
      speedDegPerDay,
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
  return new Date(now.getTime() + UI_REFRESH_MS);
}

// ============================================================================
// CACHING
// ============================================================================

/**
 * Cache transits locally with disk full handling
 */
async function cacheTransits(transits: AllPlanetTransits): Promise<void> {
  try {
    memoryTransits = transits;
    
    // Use production-ready cache manager with automatic cleanup
    const success = await transitsCache.set(
      'current',
      transits,
      5 * 60 * 1000, // 5 minutes TTL (real-time data)
      'critical'
    );

    if (!success) {
      console.warn('[TransitService] Failed to cache transits (storage full)');
    }

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
    // Use production-ready cache manager
    const cached = await transitsCache.get<AllPlanetTransits>('current');
    if (!cached) return null;
    
    // Restore Date objects
    const transits: Partial<AllPlanetTransits> = {};
    for (const [planet, transit] of Object.entries(cached)) {
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
  if (!lastUpdate) {
    if (__DEV__) {
      console.log('[TransitService] Cache invalid: no lastUpdate');
    }
    return false;
  }
  
  const now = new Date();
  const age = now.getTime() - lastUpdate.getTime();
  
  // Real-time UI refresh window.
  const maxAge = UI_REFRESH_MS;
  
  const isValid = age < maxAge;
  if (__DEV__ && !isValid) {
    console.log(`[TransitService] Cache invalid: age ${age}ms > max ${maxAge}ms`);
  }
  
  return isValid;
}

function getLastUpdatedFromTransits(transits: AllPlanetTransits | null): Date | null {
  if (!transits) return null;
  // Any planet's `lastUpdated` is acceptable since all are generated together.
  const candidate =
    transits.Sun ??
    transits.Moon ??
    transits.Mercury ??
    transits.Venus ??
    transits.Mars ??
    transits.Jupiter ??
    transits.Saturn;
  return candidate?.lastUpdated ?? null;
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

  // Very rough mean longitude approximations.
  // These are only used if Horizons is unavailable.
  const daysSinceEpoch = Math.floor(now.getTime() / (1000 * 60 * 60 * 24));
  const meanLon: Record<Planet, number> = {
    Sun: (280.0 + daysSinceEpoch * 0.9856) % 360,
    Moon: (218.0 + daysSinceEpoch * 13.176) % 360,
    Mercury: (252.0 + daysSinceEpoch * 4.092) % 360,
    Venus: (181.0 + daysSinceEpoch * 1.602) % 360,
    Mars: (355.0 + daysSinceEpoch * 0.524) % 360,
    Jupiter: (34.0 + daysSinceEpoch * 0.083) % 360,
    Saturn: (50.0 + daysSinceEpoch * 0.033) % 360,
  };

  return {
    Sun: createFallbackTransitFromLongitude('Sun', meanLon.Sun, now),
    Moon: createFallbackTransitFromLongitude('Moon', meanLon.Moon, now),
    Mercury: createFallbackTransitFromLongitude('Mercury', meanLon.Mercury, now),
    Venus: createFallbackTransitFromLongitude('Venus', meanLon.Venus, now),
    Mars: createFallbackTransitFromLongitude('Mars', meanLon.Mars, now),
    Jupiter: createFallbackTransitFromLongitude('Jupiter', meanLon.Jupiter, now),
    Saturn: createFallbackTransitFromLongitude('Saturn', meanLon.Saturn, now),
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

function createFallbackTransitFromLongitude(
  planet: Planet,
  longitude: number,
  now: Date
): PlanetTransit {
  const normalized = ((longitude % 360) + 360) % 360;
  const signIndex = Math.floor(normalized / 30);
  const sign = ZODIAC_SIGNS[signIndex];
  const signDegFloat = normalized % 30;
  const signDegree = Math.floor(signDegFloat);
  const signMinute = Math.floor((signDegFloat % 1) * 60);
  const windowEstimate = estimateTransitWindow(planet, now, signDegree + signMinute / 60);
  return {
    planet,
    sign,
    signArabic: ZODIAC_SIGNS_ARABIC[sign],
    element: ZODIAC_ELEMENTS[sign],
    longitude: normalized,
    signDegree,
    signMinute,
    transitStartDate: windowEstimate.start,
    transitEndDate: windowEstimate.end,
    lastUpdated: now,
    nextRefreshDue: calculateNextRefresh(planet, now),
    source: 'fallback',
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
    await transitsCache.clear();
    memoryTransits = null;
    
    if (__DEV__) {
      console.log('[TransitService] Cleared transit cache');
    }
  } catch (error) {
    if (__DEV__) {
      console.error('[TransitService] Error clearing cache:', error);
    }
  }
}
