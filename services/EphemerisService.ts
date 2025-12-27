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
 * Fallback: Approx mode with planetary day/hour only (no positions)
 * 
 * @see https://ssd-api.jpl.nasa.gov/doc/horizons.html
 */

import {
    MoonPhase,
    PlanetId,
    PlanetPosition,
    PlanetPositions,
} from '@/types/divine-timing-personal';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
 * AsyncStorage keys
 */
const STORAGE_KEYS = {
  CACHE_PREFIX: 'ephemeris.cache.',
  LAST_FETCH: 'ephemeris.lastFetch',
} as const;

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
    
    // Check cache first
    const cacheKey = `${STORAGE_KEYS.CACHE_PREFIX}${hourKey}_${timezone}`;
    const cached = await getCachedPositions(cacheKey);
    if (cached) {
      if (__DEV__) {
        console.log('[EphemerisService] Using cached positions');
      }
      return cached;
    }
    
    // Fetch from JPL Horizons
    if (__DEV__) {
      console.log('[EphemerisService] Fetching from JPL Horizons...');
    }
    
    const positions = await fetchPositionsFromHorizons(hourlyDate);
    
    if (positions) {
      // Cache successful result
      const result: PlanetPositions = {
        timestamp: hourlyDate.getTime(),
        dateISO,
        planets: positions,
        source: 'ephemeris',
        expiresAt: hourlyDate.getTime() + CACHE_TTL_MS,
      };
      
      await cachePositions(cacheKey, result);
      
      if (__DEV__) {
        console.log('[EphemerisService] Successfully fetched and cached positions');
      }
      
      return result;
    }
    
    // Fallback to approx mode
    if (__DEV__) {
      console.warn('[EphemerisService] Falling back to approx mode');
    }
    
    return getApproxPositions(hourlyDate, dateISO);
    
  } catch (error) {
    if (__DEV__) {
      console.error('[EphemerisService] Error fetching positions:', error);
    }
    
    // Return approx positions as fallback
    const dateISO = date.toISOString().split('T')[0];
    return getApproxPositions(date, dateISO);
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
    
    // Format datetime for Horizons (YYYY-MM-DD HH:MM)
    const dateStr = date.toISOString().split('.')[0].replace('T', ' ').slice(0, 16);
    
    // Fetch each planet sequentially (to avoid rate limits)
    for (const [planetId, horizonsCode] of Object.entries(HORIZONS_PLANET_CODES)) {
      const position = await fetchSinglePlanetPosition(
        planetId as PlanetId,
        horizonsCode,
        dateStr
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
  dateStr: string
): Promise<PlanetPosition | null> {
  try {
    // Build Horizons API query
    // Reference: https://ssd-api.jpl.nasa.gov/doc/horizons.html
    const params = new URLSearchParams({
      format: 'text',
      COMMAND: horizonsCode,
      OBJ_DATA: 'NO',
      MAKE_EPHEM: 'YES',
      EPHEM_TYPE: 'OBSERVER',
      CENTER: '500@399', // Geocentric (Earth center)
      START_TIME: dateStr,
      STOP_TIME: dateStr,
      STEP_SIZE: '1h',
      QUANTITIES: '31', // Observer ecliptic lon & lat
    });
    
    const url = `${JPL_HORIZONS_BASE_URL}?${params.toString()}`;
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      if (__DEV__) {
        console.warn(`[EphemerisService] Horizons API error for ${planetId}: ${response.status}`);
      }
      return null;
    }
    
    const data = await response.text();
    
    // Parse ecliptic longitude from response
    const longitude = parseEclipticLongitude(data);
    
    if (longitude === null) {
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
    if (__DEV__) {
      console.error(`[EphemerisService] Error fetching ${planetId}:`, error);
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
      return null;
    }
    
    const dataSection = horizonsOutput.substring(soeIndex, eoeIndex);
    const lines = dataSection.split('\n').filter(line => line.trim().length > 0);
    
    // Find the first data line (after $$SOE)
    const dataLine = lines.find(line => !line.includes('$$SOE'));
    
    if (!dataLine) {
      return null;
    }
    
    // Parse columns (format depends on QUANTITIES parameter)
    // For QUANTITIES=31, columns are: Date, ObsEclLon, ObsEclLat
    const parts = dataLine.trim().split(/\s+/);
    
    // Date is first (YYYY-MMM-DD HH:MM), then longitude
    // Find the first numeric value after the date
    let lonValue: number | null = null;
    
    for (let i = 2; i < parts.length; i++) {
      const val = parseFloat(parts[i]);
      if (!isNaN(val) && val >= 0 && val < 360) {
        lonValue = val;
        break;
      }
    }
    
    return lonValue;
    
  } catch (error) {
    if (__DEV__) {
      console.error('[EphemerisService] Parse error:', error);
    }
    return null;
  }
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
 * Cache planetary positions
 */
async function cachePositions(cacheKey: string, positions: PlanetPositions): Promise<void> {
  try {
    await AsyncStorage.setItem(cacheKey, JSON.stringify(positions));
  } catch (error) {
    if (__DEV__) {
      console.error('[EphemerisService] Cache write error:', error);
    }
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
    const ephemerisKeys = keys.filter(key => key.startsWith(STORAGE_KEYS.CACHE_PREFIX));
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
