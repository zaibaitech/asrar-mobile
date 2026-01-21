/**
 * Lunar Mansion Service (Manazil)
 * ==============================
 *
 * Provides the "moving" / real-time Manazil based on ephemeris (Moon ecliptic longitude).
 * Falls back to a deterministic daily cycle when ephemeris is unavailable.
 * 
 * OPTIMIZATION (Jan 2026):
 * -----------------------
 * Now uses CosmicDataService which fetches from a Supabase Edge Function.
 * This means ALL users share ONE server-side cache instead of each user
 * hitting JPL Horizons independently.
 * 
 * Result: 1000 users × 10s = 100 req/s → Now just 1 req/hour to Horizons
 */

import {
    getCosmicLunarMansionForDate,
    getLunarMansionByIndex,
    getMansionIndexFromEclipticLongitude,
    type LunarMansion,
} from '@/data/lunarMansions';
import { getMoonLongitudeFromServer } from '@/services/CosmicDataService';
import { getMoonEclipticLongitude } from '@/services/EphemerisService';

// Feature flag: Use server-side caching (recommended for production)
const USE_SERVER_CACHE = true;

export type LunarMansionResult = {
  index: number;
  mansion: LunarMansion;
  moonLongitudeDeg?: number;
  source: 'ephemeris' | 'fallback';
};

export async function getCurrentLunarMansion(
  date: Date = new Date(),
  timezone: string = 'UTC'
): Promise<LunarMansionResult> {
  // Use server-side cache for better scalability
  if (USE_SERVER_CACHE) {
    try {
      const moon = await getMoonLongitudeFromServer(date);
      
      if (typeof moon.longitude === 'number') {
        const index = getMansionIndexFromEclipticLongitude(moon.longitude);
        const mansion = getLunarMansionByIndex(index);

        if (mansion) {
          return {
            index,
            mansion,
            moonLongitudeDeg: moon.longitude,
            source: moon.source === 'ephemeris' ? 'ephemeris' : 'fallback',
          };
        }
      }
    } catch (e) {
      if (__DEV__) {
        console.warn('[LunarMansionService] Server cache failed, using local fallback');
      }
      // Fall through to local calculation
    }
  }

  // Original local implementation (fallback)
  const moon = await getMoonEclipticLongitude(date, timezone);

  if (moon.source === 'ephemeris' && typeof moon.longitude === 'number') {
    const index = getMansionIndexFromEclipticLongitude(moon.longitude);
    const mansion = getLunarMansionByIndex(index);

    if (mansion) {
      return {
        index,
        mansion,
        moonLongitudeDeg: moon.longitude,
        source: 'ephemeris',
      };
    }

    // Extremely defensive fallback (should never happen).
    const fallback = getCosmicLunarMansionForDate(date);
    return {
      index: fallback.index,
      mansion: fallback,
      moonLongitudeDeg: moon.longitude,
      source: 'fallback',
    };
  }

  const fallback = getCosmicLunarMansionForDate(date);
  return {
    index: fallback.index,
    mansion: fallback,
    source: 'fallback',
  };
}
