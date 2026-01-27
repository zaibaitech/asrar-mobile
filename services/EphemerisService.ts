/**
 * Ephemeris Service
 * =================
 * Phase 7: Real astronomical data from NASA/JPL Horizons API
 * 
 * Purpose: Fetch planetary positions for Divine Timing personalization
 * Source: NASA/JPL Horizons System (authoritative ephemeris)
 * 
 * Privacy: Positions are astronomical facts (not personal data)
 * Caching: 24-hour cache per datetime hour to minimize API calls
 * Fallback: Embedded ephemeris data + synthetic positions (always works)
 * 
 * @see https://ssd-api.jpl.nasa.gov/doc/horizons.html
 */

import { ephemerisCache } from '@/services/cache/CacheManager';
import {
    generateSyntheticPositions,
    getCachedEphemerisData,
} from '@/services/EphemerisDataCache';
import {
    MoonPhase,
    PlanetId,
    PlanetPosition,
    PlanetPositions,
} from '@/types/divine-timing-personal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

const inflightPositions = new Map<string, Promise<PlanetPositions | null>>();
const inflightMoon = new Map<string, Promise<MoonLongitudeResult>>();

// Higher precision (5-minute bucket) positions for UI.
const inflightPrecisePositions = new Map<string, Promise<PlanetPositions | null>>();

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * JPL Horizons API endpoint
 * This is a public API (no key required for basic queries)
 */
const JPL_HORIZONS_BASE_URL = 'https://ssd.jpl.nasa.gov/api/horizons.api';

/**
 * Planet codes for JPL Horizons
 * @see https://ssd.jpl.nasa.gov/horizons/app.html#/
 */
const HORIZONS_PLANET_CODES: Record<PlanetId, string> = {
  sun: '10',       // Sun
  moon: '301',     // Moon (Earth satellite)
  mercury: '199',  // Mercury barycenter
  venus: '299',    // Venus barycenter
  mars: '499',     // Mars barycenter
  jupiter: '599',  // Jupiter barycenter
  saturn: '699',   // Saturn barycenter
};

/**
 * Cache TTL: 24 hours (positions don't change significantly within a day)
 */
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

/**
 * Moon longitude is used for Manazil and changes faster than planetary sign positions,
 * but we still don't want to hit Horizons every hour (especially on flaky networks).
 *
 * Strategy:
 * - Cache in coarse time buckets (default: 6h)
 * - Cache both ephemeris and approx results (approx cache prevents repeated failing fetches)
 */
const MOON_CACHE_BUCKET_HOURS = 6;
const MOON_CACHE_TTL_MS = MOON_CACHE_BUCKET_HOURS * 60 * 60 * 1000;

/**
 * AsyncStorage keys
 */
const STORAGE_KEYS = {
  CACHE_PREFIX: 'ephemeris.cache.',
  PRECISE_CACHE_PREFIX: 'ephemeris.precise.cache.',
  MOON_CACHE_PREFIX: 'ephemeris.moon.cache.',
  LAST_FETCH: 'ephemeris.lastFetch',
} as const;

// Planet transit UI wants degrees that update frequently.
// Bucket requests to avoid hitting Horizons excessively.
const PRECISE_BUCKET_MINUTES = 5;
// Keep this aligned with the transit UI refresh cadence.
// Using a small buffer avoids edge cases around bucket boundaries.
const PRECISE_CACHE_TTL_MS = 6 * 60 * 1000;

export type MoonLongitudeResult = {
  timestamp: number;
  dateISO: string;
  longitude: number;
  source: 'ephemeris' | 'approx';
  expiresAt: number;
};

// ============================================================================
// TYPES
// ============================================================================

/**
 * JPL Horizons API response (simplified)
 */
interface HorizonsResponse {
  result: string; // ASCII table with ephemeris data
}

/**
 * Parsed ephemeris line from Horizons
 */
interface ParsedEphemerisLine {
  datetime: string;
  eclipticLon: number;
  eclipticLat: number;
}

// ============================================================================
// MAIN SERVICE
// ============================================================================

/**
 * Get planetary positions for a specific datetime
 * 
 * PRIORITY ORDER (for real-time accuracy):
 * 1. JPL Horizons API (real astronomical data - primary)
 * 2. Embedded ephemeris cache (verified data for offline)
 * 3. Synthetic mathematical model (fallback)
 * 
 * @param date - Date to calculate positions for
 * @param timezone - IANA timezone (e.g., 'America/New_York')
 * @returns Planetary positions or null on failure
 */
export async function getPlanetPositions(
  date: Date,
  timezone: string = 'UTC'
): Promise<PlanetPositions | null> {
  try {
    // Round to nearest hour for caching
    const hourlyDate = new Date(date);
    hourlyDate.setMinutes(0, 0, 0);
    
    const dateISO = hourlyDate.toISOString().split('T')[0];
    const hourKey = hourlyDate.toISOString().split(':')[0];
    const cacheKey = `${STORAGE_KEYS.CACHE_PREFIX}${hourKey}_${timezone}`;

    // PRIORITY 1: Try JPL Horizons first (real-time data)
    const netInfo = await NetInfo.fetch();
    if (netInfo.isConnected) {
      // Check if we have a non-expired cached result from JPL
      const cached = await getCachedPositions(cacheKey);
      if (cached && cached.source === 'ephemeris' && cached.expiresAt > Date.now()) {
        if (__DEV__) {
          console.log('[EphemerisService] Using fresh cached JPL positions');
        }
        return cached;
      }

      // Inflight dedupe: avoid multiple concurrent Horizons requests for same hour
      const inflight = inflightPositions.get(cacheKey);
      if (inflight) {
        if (__DEV__) {
          console.log('[EphemerisService] Waiting for inflight JPL request');
        }
        return await inflight;
      }
      
      const promise = (async () => {
        if (__DEV__) {
          console.log(`[EphemerisService] Fetching real-time positions from JPL Horizons for ${dateISO}...`);
        }

        const positions = await fetchPositionsFromHorizons(hourlyDate);
        if (positions) {
          const result: PlanetPositions = {
            timestamp: hourlyDate.getTime(),
            dateISO,
            planets: positions,
            source: 'ephemeris',
            expiresAt: hourlyDate.getTime() + CACHE_TTL_MS,
          };
          await cachePositions(cacheKey, result);
          if (__DEV__) {
            console.log('[EphemerisService] ✓ JPL Horizons data cached successfully');
          }
          return result;
        }

        if (__DEV__) {
          console.warn('[EphemerisService] JPL Horizons fetch failed, trying fallbacks');
        }
        return null;
      })();

      inflightPositions.set(cacheKey, promise);
      try {
        const result = await promise;
        if (result) return result;
      } finally {
        inflightPositions.delete(cacheKey);
      }
    }

    // PRIORITY 2: Try embedded ephemeris data (verified for 2026)
    const embeddedData = getCachedEphemerisData(dateISO);
    if (embeddedData) {
      if (__DEV__) {
        console.log(`[EphemerisService] Using embedded ephemeris data for ${dateISO}`);
      }
      const result: PlanetPositions = {
        timestamp: hourlyDate.getTime(),
        dateISO,
        planets: embeddedData,
        source: 'ephemeris',
        expiresAt: hourlyDate.getTime() + CACHE_TTL_MS,
      };
      await cachePositions(cacheKey, result);
      return result;
    }

    // PRIORITY 3: Use synthetic positions as last resort (mathematical model)
    if (__DEV__) {
      console.log('[EphemerisService] Using synthetic positions (mathematical approximation)');
    }
    const syntheticPositions = generateSyntheticPositions(hourlyDate);
    const result: PlanetPositions = {
      timestamp: hourlyDate.getTime(),
      dateISO,
      planets: syntheticPositions,
      source: 'synthetic',
      expiresAt: hourlyDate.getTime() + CACHE_TTL_MS,
    };
    await cachePositions(cacheKey, result);
    return result;
    
  } catch (error) {
    if (__DEV__) {
      console.error('[EphemerisService] Error fetching positions:', error);
    }
    
    // Final fallback: approx positions
    const dateISO = date.toISOString().split('T')[0];
    return getApproxPositions(date, dateISO);
  }
}

type PlanetPositionWithSpeed = PlanetPosition & {
  /** Approx ecliptic longitude speed in degrees/day (signed). */
  speedDegPerDay?: number;
};

/**
 * Get higher-precision planetary positions for real-time transit UI (5-minute buckets).
 *
 * This is the PRIMARY function for live transit display.
 * 
 * PRIORITY ORDER (for real-time accuracy):
 * 1. JPL Horizons API with speed calculation (real astronomical data - FRESH)
 * 2. Hourly-rounded JPL Horizons (still real data, slightly less precise)
 * 3. Return null (do NOT serve synthetic data for real-time transit display)
 * 
 * Unlike `getPlanetPositions`, this does NOT round to the hour.
 * It also attempts to estimate longitude speed for retrograde detection.
 */
export async function getPlanetPositionsPrecise(
  date: Date,
  timezone: string = 'UTC'
): Promise<PlanetPositions | null> {
  try {
    const bucketedDate = bucketDateMinutes(date, PRECISE_BUCKET_MINUTES);

    const dateISO = bucketedDate.toISOString().split('T')[0];
    const minuteKey = bucketedDate.toISOString().slice(0, 16); // YYYY-MM-DDTHH:MM
    const cacheKey = `${STORAGE_KEYS.PRECISE_CACHE_PREFIX}${minuteKey}_${timezone}`;

    // Check for fresh cached JPL data (only use if not expired)
    const cached = await getCachedPositions(cacheKey);
    if (cached && cached.source === 'ephemeris' && cached.expiresAt > Date.now()) {
      if (__DEV__) {
        console.log('[EphemerisService] Using fresh cached JPL precise positions');
      }
      return cached;
    }

    // Dedupe: avoid multiple concurrent requests
    const inflight = inflightPrecisePositions.get(cacheKey);
    if (inflight) {
      if (__DEV__) {
        console.log('[EphemerisService] Waiting for inflight precise positions...');
      }
      return await inflight;
    }

    const promise = (async () => {
      // Try to get network connectivity
      const netInfo = await NetInfo.fetch();
      if (!netInfo.isConnected) {
        if (__DEV__) {
          console.warn('[EphemerisService] No network - cannot fetch real-time transit data');
        }
        return null;
      }

      if (__DEV__) {
        console.log('[EphemerisService] Fetching REAL-TIME precise positions from JPL Horizons...');
      }

      const positions = await fetchPositionsFromHorizonsWithSpeed(bucketedDate);

      if (positions) {
        const result: PlanetPositions = {
          timestamp: bucketedDate.getTime(),
          dateISO,
          planets: positions as any,
          source: 'ephemeris',
          expiresAt: bucketedDate.getTime() + PRECISE_CACHE_TTL_MS,
        };
        await cachePositions(cacheKey, result);
        if (__DEV__) {
          console.log('[EphemerisService] ✓ Real-time JPL data cached for transit display');
        }
        return result;
      }

      // Fallback to regular hourly-precision JPL (still real data)
      if (__DEV__) {
        console.warn('[EphemerisService] High-precision failed; falling back to hourly Horizons');
      }

      const hourlyResult = await getPlanetPositions(bucketedDate, timezone);
      if (hourlyResult && hourlyResult.source === 'ephemeris') {
        // Cache this as our "precise" result
        await cachePositions(cacheKey, hourlyResult);
        if (__DEV__) {
          console.log('[EphemerisService] Using hourly JPL data for transit display');
        }
        return hourlyResult;
      }

      // DO NOT serve synthetic data for real-time transit display
      if (__DEV__) {
        console.error('[EphemerisService] Could not fetch real ephemeris data for real-time display');
      }
      return null;
    })();

    inflightPrecisePositions.set(cacheKey, promise);
    try {
      return await promise;
    } finally {
      inflightPrecisePositions.delete(cacheKey);
    }
  } catch (error) {
    if (__DEV__) {
      console.error('[EphemerisService] Error fetching precise positions:', error);
    }
    return null;
  }
}

/**
 * Get Moon ecliptic longitude only.
 *
 * This is used by Manazil and should not depend on every planet succeeding.
 */
export async function getMoonEclipticLongitude(
  date: Date,
  timezone: string = 'UTC'
): Promise<MoonLongitudeResult> {
  try {
    // Bucket time to avoid generating a new cache key every hour.
    const bucketedDate = new Date(date);
    bucketedDate.setMinutes(0, 0, 0);
    const bucketHour = Math.floor(bucketedDate.getHours() / MOON_CACHE_BUCKET_HOURS) * MOON_CACHE_BUCKET_HOURS;
    bucketedDate.setHours(bucketHour);

    const dateISO = bucketedDate.toISOString().split('T')[0];
    const hourKey = bucketedDate.toISOString().split(':')[0];
    const cacheKey = `${STORAGE_KEYS.MOON_CACHE_PREFIX}${hourKey}_${timezone}`;

    const cached = await getCachedMoonLongitude(cacheKey);
    if (cached) {
      if (__DEV__) {
        console.log('[EphemerisService] Using cached Moon longitude');
      }
      return cached;
    }

    // Try embedded ephemeris data first
    const embeddedData = getCachedEphemerisData(dateISO);
    if (embeddedData?.moon) {
      const result: MoonLongitudeResult = {
        timestamp: bucketedDate.getTime(),
        dateISO,
        longitude: embeddedData.moon.longitude,
        source: 'ephemeris',
        expiresAt: bucketedDate.getTime() + MOON_CACHE_TTL_MS,
      };
      await cacheMoonLongitude(cacheKey, result);
      if (__DEV__) {
        console.log('[EphemerisService] Using embedded Moon data');
      }
      return result;
    }

    const inflight = inflightMoon.get(cacheKey);
    if (inflight) {
      return await inflight;
    }

    const promise = (async () => {
      // Try network fetch first
      const netInfo = await NetInfo.fetch();
      if (netInfo.isConnected) {
        if (__DEV__) {
          console.log('[EphemerisService] Fetching Moon longitude from JPL Horizons...');
        }

        // Reuse the same Horizons query logic, but only for the Moon.
        const year = bucketedDate.getUTCFullYear();
        const month = String(bucketedDate.getUTCMonth() + 1).padStart(2, '0');
        const day = String(bucketedDate.getUTCDate()).padStart(2, '0');
        const hour = String(bucketedDate.getUTCHours()).padStart(2, '0');
        const minute = String(bucketedDate.getUTCMinutes()).padStart(2, '0');
        const dateStr = `'${year}-${month}-${day} ${hour}:${minute}'`;
        const stopDate = new Date(bucketedDate.getTime() + 1 * 60 * 60 * 1000);
        const stopHour = String(stopDate.getUTCHours()).padStart(2, '0');
        const stopMinute = String(stopDate.getUTCMinutes()).padStart(2, '0');
        const stopStr = `'${year}-${month}-${day} ${stopHour}:${stopMinute}'`;
        const position = await fetchSinglePlanetPosition('moon', HORIZONS_PLANET_CODES.moon, dateStr, stopStr);

        if (position && typeof position.longitude === 'number') {
          const result: MoonLongitudeResult = {
            timestamp: bucketedDate.getTime(),
            dateISO,
            longitude: position.longitude,
            source: 'ephemeris',
            expiresAt: bucketedDate.getTime() + MOON_CACHE_TTL_MS,
          };
          await cacheMoonLongitude(cacheKey, result);
          return result;
        }
      }

      // Use synthetic position (always works)
      if (__DEV__) {
        console.log('[EphemerisService] Using synthetic Moon position');
      }
      const syntheticPositions = generateSyntheticPositions(bucketedDate);
      const synthetic: MoonLongitudeResult = {
        timestamp: bucketedDate.getTime(),
        dateISO,
        longitude: syntheticPositions.moon.longitude,
        source: 'synthetic',
        expiresAt: bucketedDate.getTime() + MOON_CACHE_TTL_MS,
      };
      await cacheMoonLongitude(cacheKey, synthetic);
      return synthetic;
    })();

    inflightMoon.set(cacheKey, promise);
    try {
      return await promise;
    } finally {
      inflightMoon.delete(cacheKey);
    }
  } catch (error) {
    if (__DEV__) {
      console.error('[EphemerisService] Moon longitude error:', error);
    }
    // Final fallback — still cache approx (best effort) using the current bucket.
    const fallbackBucket = new Date(date);
    fallbackBucket.setMinutes(0, 0, 0);
    const bucketHour = Math.floor(fallbackBucket.getHours() / MOON_CACHE_BUCKET_HOURS) * MOON_CACHE_BUCKET_HOURS;
    fallbackBucket.setHours(bucketHour);

    const dateISO = fallbackBucket.toISOString().split('T')[0];
    const hourKey = fallbackBucket.toISOString().split(':')[0];
    const cacheKey = `${STORAGE_KEYS.MOON_CACHE_PREFIX}${hourKey}_${timezone}`;

    const approx: MoonLongitudeResult = {
      timestamp: fallbackBucket.getTime(),
      dateISO,
      longitude: getApproxPositions(fallbackBucket, dateISO).planets.moon.longitude,
      source: 'approx',
      expiresAt: fallbackBucket.getTime() + MOON_CACHE_TTL_MS,
    };
    await cacheMoonLongitude(cacheKey, approx);
    return approx;
  }
}

/**
 * Fetch positions from JPL Horizons API
 * 
 * Note: This is a simplified implementation. In production, you might want
 * to batch requests or use a more sophisticated parser.
 */
async function fetchPositionsFromHorizons(
  date: Date
): Promise<Record<PlanetId, PlanetPosition> | null> {
  try {
    const positions: Partial<Record<PlanetId, PlanetPosition>> = {};
    
    // Format datetime for Horizons API (with quotes, START < STOP)
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hour = String(date.getUTCHours()).padStart(2, '0');
    const minute = String(date.getUTCMinutes()).padStart(2, '0');
    const dateStr = `'${year}-${month}-${day} ${hour}:${minute}'`;
    const stopDate = new Date(date.getTime() + 1 * 60 * 60 * 1000);
    const stopHour = String(stopDate.getUTCHours()).padStart(2, '0');
    const stopMinute = String(stopDate.getUTCMinutes()).padStart(2, '0');
    const stopStr = `'${year}-${month}-${day} ${stopHour}:${stopMinute}'`;
    
    // Fetch each planet sequentially (to avoid rate limits)
    for (const [planetId, horizonsCode] of Object.entries(HORIZONS_PLANET_CODES)) {
      const position = await fetchSinglePlanetPosition(
        planetId as PlanetId,
        horizonsCode,
        dateStr,
        stopStr
      );
      
      if (position) {
        positions[planetId as PlanetId] = position;
      } else {
        // If any planet fails, return null (use approx mode)
        return null;
      }
    }
    
    return positions as Record<PlanetId, PlanetPosition>;
    
  } catch (error) {
    if (__DEV__) {
      console.error('[EphemerisService] Horizons fetch error:', error);
    }
    return null;
  }
}

/**
 * Fetch a single planet's position from Horizons
 */
async function fetchSinglePlanetPosition(
  planetId: PlanetId,
  horizonsCode: string,
  startTimeStr: string,
  stopTimeStr: string
): Promise<PlanetPosition | null> {
  try {
    // Build Horizons API query
    // Reference: https://ssd-api.jpl.nasa.gov/doc/horizons.html
    const params = new URLSearchParams();
    params.append('format', 'text');
    params.append('COMMAND', horizonsCode);
    params.append('OBJ_DATA', 'NO');
    params.append('MAKE_EPHEM', 'YES');
    params.append('EPHEM_TYPE', 'OBSERVER');
    params.append('CENTER', '500@399'); // Geocentric (Earth center)
    params.append('START_TIME', startTimeStr);
    params.append('STOP_TIME', stopTimeStr);
    params.append('STEP_SIZE', '1h');
    params.append('QUANTITIES', '31'); // Observer ecliptic lon & lat
    
    const url = `${JPL_HORIZONS_BASE_URL}?${params.toString()}`;
    
    if (__DEV__) {
      console.log(`[EphemerisService] Fetching ${planetId} from: ${JPL_HORIZONS_BASE_URL}`);
    }

    // Create a timeout promise (30 seconds)
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Horizons API timeout (30s)')), 30000)
    );

    const fetchPromise = fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
      timeout: 30000,
    });

    const response = await Promise.race([fetchPromise, timeoutPromise]) as Response;
    
    if (!response.ok) {
      if (__DEV__) {
        console.warn(`[EphemerisService] Horizons API error for ${planetId}: HTTP ${response.status}`);
      }
      return null;
    }
    
    const data = await response.text();
    
    if (__DEV__ && !data) {
      console.warn(`[EphemerisService] Empty response from Horizons for ${planetId}`);
      return null;
    }

    if (__DEV__) {
      console.log(`[EphemerisService] Received ${data.length} bytes from Horizons for ${planetId}`);
    }
    
    // Parse ecliptic longitude from response
    const longitude = parseEclipticLongitude(data);
    
    if (longitude === null) {
      if (__DEV__) {
        console.warn(`[EphemerisService] Failed to parse longitude from response for ${planetId}`);
        console.warn(`[EphemerisService] Response preview: ${data.substring(0, 200)}`);
      }
      return null;
    }
    
    // Convert to sign and degree
    const sign = Math.floor(longitude / 30);
    const signDegree = longitude % 30;
    
    return {
      planet: planetId,
      longitude,
      sign,
      signDegree,
    };
    
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    if (__DEV__) {
      console.error(`[EphemerisService] Error fetching ${planetId}: ${errorMsg}`, error);
    }
    return null;
  }
}

async function fetchPositionsFromHorizonsWithSpeed(
  date: Date
): Promise<Record<PlanetId, PlanetPositionWithSpeed> | null> {
  try {
    const positions: Partial<Record<PlanetId, PlanetPositionWithSpeed>> = {};

    // Fetch each planet sequentially (to avoid rate limits)
    for (const [planetId, horizonsCode] of Object.entries(HORIZONS_PLANET_CODES)) {
      const stepHours = planetId === 'moon' ? 6 : 24;
      const position = await fetchSinglePlanetPositionWithSpeed(
        planetId as PlanetId,
        horizonsCode,
        date,
        stepHours
      );

      if (position) {
        positions[planetId as PlanetId] = position;
      } else {
        return null;
      }
    }

    return positions as Record<PlanetId, PlanetPositionWithSpeed>;
  } catch (error) {
    if (__DEV__) {
      console.error('[EphemerisService] Horizons speed fetch error:', error);
    }
    return null;
  }
}

async function fetchSinglePlanetPositionWithSpeed(
  planetId: PlanetId,
  horizonsCode: string,
  startDate: Date,
  stepHours: number
): Promise<PlanetPositionWithSpeed | null> {
  try {
    const year = startDate.getUTCFullYear();
    const month = String(startDate.getUTCMonth() + 1).padStart(2, '0');
    const day = String(startDate.getUTCDate()).padStart(2, '0');
    const hour = String(startDate.getUTCHours()).padStart(2, '0');
    const minute = String(startDate.getUTCMinutes()).padStart(2, '0');
    const startStr = `'${year}-${month}-${day} ${hour}:${minute}'`;
    
    const stopDate = new Date(startDate);
    stopDate.setHours(stopDate.getHours() + stepHours);
    const stopHour = String(stopDate.getUTCHours()).padStart(2, '0');
    const stopMinute = String(stopDate.getUTCMinutes()).padStart(2, '0');
    const stopStr = `'${year}-${month}-${day} ${stopHour}:${stopMinute}'`;

    const params = new URLSearchParams();
    params.append('format', 'text');
    params.append('COMMAND', horizonsCode);
    params.append('OBJ_DATA', 'NO');
    params.append('MAKE_EPHEM', 'YES');
    params.append('EPHEM_TYPE', 'OBSERVER');
    params.append('CENTER', '500@399');
    params.append('START_TIME', startStr);
    params.append('STOP_TIME', stopStr);
    params.append('STEP_SIZE', `${stepHours}h`);
    params.append('QUANTITIES', '31');

    const url = `${JPL_HORIZONS_BASE_URL}?${params.toString()}`;
    const response = await fetch(url, { headers: { Accept: 'application/json' } });

    if (!response.ok) {
      if (__DEV__) {
        console.warn(`[EphemerisService] Horizons API error for ${planetId}: ${response.status}`);
      }
      return null;
    }

    const data = await response.text();
    const longitudes = parseEclipticLongitudes(data, 2);
    if (longitudes.length < 1) return null;

    const longitude = longitudes[0];
    const sign = Math.floor(longitude / 30);
    const signDegree = longitude % 30;

    let speedDegPerDay: number | undefined;
    if (longitudes.length >= 2) {
      const delta = normalizeSignedDeltaDeg(longitudes[1] - longitudes[0]);
      const days = stepHours / 24;
      speedDegPerDay = delta / days;
    }

    return {
      planet: planetId,
      longitude,
      sign,
      signDegree,
      speedDegPerDay,
    };
  } catch (error) {
    if (__DEV__) {
      console.error(`[EphemerisService] Error fetching ${planetId} with speed:`, error);
    }
    return null;
  }
}

/**
 * Parse ecliptic longitude from Horizons ASCII output
 * 
 * The Horizons API returns ASCII tables. We need to extract the
 * ecliptic longitude value from the data section.
 * 
 * Example output line:
 * 2024-12-27 12:00   123.456  -2.345  ...
 */
function parseEclipticLongitude(horizonsOutput: string): number | null {
  try {
    // Look for the data section (between $$SOE and $$EOE markers)
    const soeIndex = horizonsOutput.indexOf('$$SOE');
    const eoeIndex = horizonsOutput.indexOf('$$EOE');
    
    if (soeIndex === -1 || eoeIndex === -1) {
      if (__DEV__) {
        console.warn('[EphemerisService] Missing $$SOE or $$EOE markers in Horizons response');
      }
      return null;
    }
    
    const dataSection = horizonsOutput.substring(soeIndex, eoeIndex);
    const lines = dataSection.split('\n').filter(line => line.trim().length > 0);
    
    // Find the first data line (after $$SOE)
    const dataLine = lines.find(line => !line.includes('$$SOE'));
    
    if (!dataLine) {
      if (__DEV__) {
        console.warn('[EphemerisService] No data lines found between $$SOE and $$EOE');
      }
      return null;
    }

    if (__DEV__) {
      console.log(`[EphemerisService] Parsing line: ${dataLine.substring(0, 100)}`);
    }
    
    // Parse columns (format depends on QUANTITIES parameter)
    // For QUANTITIES=31, columns are: Date, ObsEclLon, ObsEclLat
    const parts = dataLine.trim().split(/\s+/);

    if (__DEV__) {
      console.log(`[EphemerisService] Found ${parts.length} parts: ${parts.slice(0, 5).join(', ')}`);
    }
    
    // Date is first (YYYY-MMM-DD HH:MM), then longitude
    // Find the first numeric value after the date
    let lonValue: number | null = null;
    
    for (let i = 2; i < parts.length; i++) {
      const val = parseFloat(parts[i]);
      if (!isNaN(val) && val >= 0 && val < 360) {
        lonValue = val;
        if (__DEV__) {
          console.log(`[EphemerisService] Parsed longitude: ${lonValue} at index ${i}`);
        }
        break;
      }
    }
    
    return lonValue;
    
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    if (__DEV__) {
      console.error('[EphemerisService] Parse error:', errorMsg);
    }
    return null;
  }
}

function parseEclipticLongitudes(horizonsOutput: string, maxCount: number = 2): number[] {
  try {
    const soeIndex = horizonsOutput.indexOf('$$SOE');
    const eoeIndex = horizonsOutput.indexOf('$$EOE');

    if (soeIndex === -1 || eoeIndex === -1) {
      return [];
    }

    const dataSection = horizonsOutput.substring(soeIndex, eoeIndex);
    const lines = dataSection
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .filter((line) => !line.includes('$$SOE'));

    const out: number[] = [];
    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      let lonValue: number | null = null;
      for (let i = 2; i < parts.length; i++) {
        const val = parseFloat(parts[i]);
        if (!isNaN(val) && val >= 0 && val < 360) {
          lonValue = val;
          break;
        }
      }
      if (lonValue === null) continue;
      out.push(lonValue);
      if (out.length >= maxCount) break;
    }

    return out;
  } catch {
    return [];
  }
}

function bucketDateMinutes(date: Date, bucketMinutes: number): Date {
  const out = new Date(date);
  out.setSeconds(0, 0);
  const mins = out.getMinutes();
  const bucketed = Math.floor(mins / bucketMinutes) * bucketMinutes;
  out.setMinutes(bucketed);
  return out;
}

function normalizeSignedDeltaDeg(delta: number): number {
  // Normalize to [-180, +180)
  return ((delta + 540) % 360) - 180;
}

/**
 * Get cached positions if available and not expired
 */
async function getCachedPositions(cacheKey: string): Promise<PlanetPositions | null> {
  try {
    const cached = await AsyncStorage.getItem(cacheKey);
    
    if (!cached) {
      return null;
    }
    
    const positions: PlanetPositions = JSON.parse(cached);
    
    // Check expiry
    if (Date.now() > positions.expiresAt) {
      // Expired, remove from cache
      await AsyncStorage.removeItem(cacheKey);
      return null;
    }
    
    return positions;
    
  } catch (error) {
    if (__DEV__) {
      console.error('[EphemerisService] Cache read error:', error);
    }
    return null;
  }
}

/**
 * Cache planetary positions with graceful fallback
 */
async function cachePositions(cacheKey: string, positions: PlanetPositions): Promise<void> {
  try {
    const success = await ephemerisCache.set(
      cacheKey,
      positions,
      30 * 60 * 1000, // 30 min TTL
      'high'
    );
    
    if (!success && __DEV__) {
      console.warn('[EphemerisService] Ephemeris cache write failed, using memory only');
    }
  } catch (error) {
    if (__DEV__) {
      console.error('[EphemerisService] Cache error:', error);
    }
    // Continue without caching - data is still usable
  }
}

/**
 * Get approximate positions as fallback
 * 
 * This uses simplified calculations for planetary positions.
 * Not astronomically accurate, but sufficient for rough guidance.
 */
function getApproxPositions(date: Date, dateISO: string): PlanetPositions {
  // Use simple approximations based on orbital periods
  // This is a very rough estimate and should only be used as fallback
  
  const daysSinceEpoch = Math.floor(date.getTime() / (1000 * 60 * 60 * 24));
  
  // Approximate mean longitudes (very simplified)
  const sunLon = (280.0 + daysSinceEpoch * 0.9856) % 360;
  const moonLon = (218.0 + daysSinceEpoch * 13.176) % 360;
  const mercuryLon = (252.0 + daysSinceEpoch * 4.092) % 360;
  const venusLon = (181.0 + daysSinceEpoch * 1.602) % 360;
  const marsLon = (355.0 + daysSinceEpoch * 0.524) % 360;
  const jupiterLon = (34.0 + daysSinceEpoch * 0.083) % 360;
  const saturnLon = (50.0 + daysSinceEpoch * 0.033) % 360;
  
  const createPosition = (planet: PlanetId, lon: number): PlanetPosition => ({
    planet,
    longitude: lon,
    sign: Math.floor(lon / 30),
    signDegree: lon % 30,
  });
  
  return {
    timestamp: date.getTime(),
    dateISO,
    planets: {
      sun: createPosition('sun', sunLon),
      moon: createPosition('moon', moonLon),
      mercury: createPosition('mercury', mercuryLon),
      venus: createPosition('venus', venusLon),
      mars: createPosition('mars', marsLon),
      jupiter: createPosition('jupiter', jupiterLon),
      saturn: createPosition('saturn', saturnLon),
    },
    source: 'approx',
    expiresAt: date.getTime() + CACHE_TTL_MS,
  };
}

/**
 * Calculate moon phase from Sun and Moon positions
 */
export function calculateMoonPhase(
  positions: PlanetPositions
): MoonPhase {
  const sunLon = positions.planets.sun.longitude;
  const moonLon = positions.planets.moon.longitude;
  
  // Calculate elongation (angular separation)
  let elongation = moonLon - sunLon;
  if (elongation < 0) elongation += 360;
  
  // Determine phase based on elongation
  let phase: MoonPhase['phase'];
  
  if (elongation < 45) {
    phase = 'new';
  } else if (elongation < 90) {
    phase = 'waxing-crescent';
  } else if (elongation < 135) {
    phase = 'first-quarter';
  } else if (elongation < 180) {
    phase = 'waxing-gibbous';
  } else if (elongation < 225) {
    phase = 'full';
  } else if (elongation < 270) {
    phase = 'waning-gibbous';
  } else if (elongation < 315) {
    phase = 'last-quarter';
  } else {
    phase = 'waning-crescent';
  }
  
  // Approximate illumination (simplified formula)
  const illumination = 50 * (1 - Math.cos((elongation * Math.PI) / 180));
  
  return {
    phase,
    illumination: Math.round(illumination),
    elongation,
  };
}

/**
 * Get zodiac sign name from index
 */
export function getZodiacSignName(signIndex: number): string {
  const signs = [
    'Aries', 'Taurus', 'Gemini', 'Cancer',
    'Leo', 'Virgo', 'Libra', 'Scorpio',
    'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];
  return signs[signIndex % 12];
}

/**
 * Get zodiac sign element
 */
export function getZodiacSignElement(signIndex: number): 'fire' | 'earth' | 'air' | 'water' {
  const elements: ('fire' | 'earth' | 'air' | 'water')[] = [
    'fire', 'earth', 'air', 'water', // Aries, Taurus, Gemini, Cancer
    'fire', 'earth', 'air', 'water', // Leo, Virgo, Libra, Scorpio
    'fire', 'earth', 'air', 'water', // Sagittarius, Capricorn, Aquarius, Pisces
  ];
  return elements[signIndex % 12];
}

/**
 * Clear all ephemeris cache (useful for testing or troubleshooting)
 */
export async function clearEphemerisCache(): Promise<void> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const ephemerisKeys = keys.filter(
      key => key.startsWith(STORAGE_KEYS.CACHE_PREFIX) || key.startsWith(STORAGE_KEYS.MOON_CACHE_PREFIX)
    );
    await AsyncStorage.multiRemove(ephemerisKeys);
    
    if (__DEV__) {
      console.log(`[EphemerisService] Cleared ${ephemerisKeys.length} cache entries`);
    }
  } catch (error) {
    if (__DEV__) {
      console.error('[EphemerisService] Error clearing cache:', error);
    }
  }
}

async function getCachedMoonLongitude(cacheKey: string): Promise<MoonLongitudeResult | null> {
  try {
    const cached = await AsyncStorage.getItem(cacheKey);
    if (!cached) return null;

    const result: MoonLongitudeResult = JSON.parse(cached);
    if (Date.now() > result.expiresAt) {
      await AsyncStorage.removeItem(cacheKey);
      return null;
    }
    return result;
  } catch (error) {
    if (__DEV__) {
      console.error('[EphemerisService] Moon cache read error:', error);
    }
    return null;
  }
}

async function cacheMoonLongitude(cacheKey: string, result: MoonLongitudeResult): Promise<void> {
  try {
    await AsyncStorage.setItem(cacheKey, JSON.stringify(result));
  } catch (error) {
    // Handle disk full error by clearing old cache and retrying
    const errorMsg = (error as any)?.message || '';
    if (errorMsg.includes('SQLITE_FULL') || errorMsg.includes('disk is full')) {
      try {
        if (__DEV__) {
          console.warn('[EphemerisService] Disk full, clearing moon cache and retrying...');
        }
        // Clear this moon cache key and retry
        await AsyncStorage.removeItem(cacheKey);
        // Retry write with cleared space
        await AsyncStorage.setItem(cacheKey, JSON.stringify(result));
        if (__DEV__) {
          console.log('[EphemerisService] Moon cache retry successful after clearing');
        }
      } catch (retryError) {
        if (__DEV__) {
          console.error('[EphemerisService] Moon cache retry failed, will recalculate:', retryError);
        }
        // If cache fails, moon longitude is recalculated on next request - still functional
      }
    } else {
      if (__DEV__) {
        console.error('[EphemerisService] Moon cache write error:', error);
      }
    }
  }
}

/**
 * Prefetch ephemeris data for the next 24 hours (WiFi only)
 * Significantly reduces API calls and improves offline capability
 * 
 * @param timezone - IANA timezone for calculations
 * @param hours - Number of hours to prefetch (default 24)
 * @returns Number of hours successfully cached
 */
export async function prefetchEphemerisData(
  timezone: string = 'UTC',
  hours: number = 24
): Promise<number> {
  try {
    // Check network connection
    const netInfo = await NetInfo.fetch();
    
    // Only prefetch on WiFi to save mobile data
    if (netInfo.type !== 'wifi') {
      if (__DEV__) {
        console.log('[EphemerisService] Skipping prefetch: Not on WiFi');
      }
      return 0;
    }
    
    if (__DEV__) {
      console.log(`[EphemerisService] Prefetching ${hours} hours of ephemeris data...`);
    }
    
    let cachedCount = 0;
    const startDate = new Date();
    
    for (let i = 0; i < hours; i++) {
      const targetDate = new Date(startDate);
      targetDate.setHours(startDate.getHours() + i, 0, 0, 0);
      
      const hourKey = targetDate.toISOString().split(':')[0];
      const cacheKey = `${STORAGE_KEYS.CACHE_PREFIX}${hourKey}_${timezone}`;
      
      // Check if already cached and valid
      const cached = await getCachedPositions(cacheKey);
      if (cached) {
        cachedCount++;
        continue;
      }
      
      // Fetch and cache
      const positions = await getPlanetPositions(targetDate, timezone);
      if (positions) {
        cachedCount++;
      }
      
      // Small delay to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    if (__DEV__) {
      console.log(`[EphemerisService] Successfully prefetched ${cachedCount}/${hours} hours`);
    }
    
    return cachedCount;
    
  } catch (error) {
    if (__DEV__) {
      console.error('[EphemerisService] Prefetch error:', error);
    }
    return 0;
  }
}

/**
 * Cleanup expired ephemeris cache entries
 * Call this periodically (e.g., daily) to free up storage
 */
export async function cleanupExpiredEphemerisCache(): Promise<number> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const ephemerisKeys = keys.filter(
      key => key.startsWith(STORAGE_KEYS.CACHE_PREFIX) || key.startsWith(STORAGE_KEYS.MOON_CACHE_PREFIX)
    );
    
    const toRemove: string[] = [];
    const now = Date.now();
    
    for (const key of ephemerisKeys) {
      const cached = await AsyncStorage.getItem(key);
      if (cached) {
        try {
          const parsed = JSON.parse(cached) as { expiresAt?: number };
          if (typeof parsed.expiresAt !== 'number' || now > parsed.expiresAt) {
            toRemove.push(key);
          }
        } catch {
          // Invalid cache entry, remove it
          toRemove.push(key);
        }
      }
    }
    
    if (toRemove.length > 0) {
      await AsyncStorage.multiRemove(toRemove);
      
      if (__DEV__) {
        console.log(`[EphemerisService] Cleaned up ${toRemove.length} expired entries`);
      }
    }
    
    return toRemove.length;
    
  } catch (error) {
    if (__DEV__) {
      console.error('[EphemerisService] Cleanup error:', error);
    }
    return 0;
  }
}
