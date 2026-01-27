/**
 * TypeScript types for Ephemeris Edge Function
 */

export interface EphemerisRequest {
  date: string; // ISO 8601 timestamp
  planet: string; // 'sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn'
  timezone?: string; // Default 'UTC'
}

export interface PlanetPosition {
  planet_id: string;
  longitude: number; // Ecliptic longitude (0-360°)
  latitude: number; // Ecliptic latitude (-90 to 90°)
  speed: number; // Degrees per day
  distance: number; // AU (Astronomical Units)
  zodiac_sign: string; // 'aries', 'taurus', etc.
  zodiac_degree: number; // 0-30 within the sign
  is_retrograde: boolean;
  cached_at?: string;
}

export interface EphemerisResponse extends PlanetPosition {
  cache_status: 'HIT' | 'MISS';
  response_time_ms?: number;
}

export interface HorizonsAPIResponse {
  result: string; // Raw text response from NASA
  signature: {
    version: string;
    source: string;
  };
}

export const PLANET_IDS: Record<string, string> = {
  sun: '10',
  moon: '301',
  mercury: '199',
  venus: '299',
  mars: '499',
  jupiter: '599',
  saturn: '699',
  uranus: '799',
  neptune: '899',
  pluto: '999',
};

export const ZODIAC_SIGNS = [
  'aries',
  'taurus',
  'gemini',
  'cancer',
  'leo',
  'virgo',
  'libra',
  'scorpio',
  'sagittarius',
  'capricorn',
  'aquarius',
  'pisces',
] as const;

export type ZodiacSign = (typeof ZODIAC_SIGNS)[number];

export function getZodiacSign(longitude: number): {
  sign: ZodiacSign;
  degree: number;
} {
  const normalizedLong = ((longitude % 360) + 360) % 360;
  const signIndex = Math.floor(normalizedLong / 30);
  const degree = normalizedLong % 30;

  return {
    sign: ZODIAC_SIGNS[signIndex],
    degree,
  };
}
