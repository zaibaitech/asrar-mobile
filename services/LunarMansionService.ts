/**
 * Lunar Mansion Service (Manazil)
 * ==============================
 *
 * Provides the "moving" / real-time Manazil based on ephemeris (Moon ecliptic longitude).
 * Falls back to a deterministic daily cycle when ephemeris is unavailable.
 */

import {
    getCosmicLunarMansionForDate,
    getLunarMansionByIndex,
    getMansionIndexFromEclipticLongitude,
    type LunarMansion,
} from '@/data/lunarMansions';
import { getMoonEclipticLongitude } from '@/services/EphemerisService';

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
