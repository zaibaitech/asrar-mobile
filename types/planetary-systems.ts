/**
 * Planetary Systems Type Definitions
 * ===================================
 * 
 * Separates two distinct astronomical systems:
 * 
 * System 1 (WHERE): Long-term planetary transits through zodiac signs
 * - Changes: Weeks/Months/Years
 * - Source: Ephemeris (NASA JPL Horizons)
 * - Example: Jupiter in Gemini (May 2024 - June 2025)
 * 
 * System 3 (WHEN): Hourly planetary hour rulers
 * - Changes: Every 60-90 minutes
 * - Source: Local calculation (Chaldean order)
 * - Example: Mars hour at 3:00 PM
 */

import { Element } from '@/services/MomentAlignmentService';
import { Planet } from '@/services/PlanetaryHoursService';

// ============================================================================
// SYSTEM 1: LONG-TERM PLANETARY TRANSITS (WHERE)
// ============================================================================

/**
 * Zodiac sign keys (lowercase for i18n compatibility)
 */
export type ZodiacSign = 
  | 'aries' | 'taurus' | 'gemini' | 'cancer' 
  | 'leo' | 'virgo' | 'libra' | 'scorpio' 
  | 'sagittarius' | 'capricorn' | 'aquarius' | 'pisces';

/**
 * Long-term astronomical transit of a planet through a zodiac sign
 * This is REAL astronomical position data, not hourly planetary hours
 */
export interface PlanetTransit {
  /** Planet identifier */
  planet: Planet;
  
  /** Current zodiac sign the planet is transiting through */
  sign: ZodiacSign;
  
  /** Sign name in Arabic */
  signArabic: string;
  
  /** Element of the zodiac sign (fire/earth/air/water) */
  element: Element;

  /** Ecliptic longitude in degrees (0-360). Useful for re-mapping to different zodiacs. */
  longitude?: number;
  
  // ---- Ephemeris Data (optional) ----
  
  /** Degree within the sign (0-30) */
  signDegree?: number;
  
  /** Degree within sign, fractional part as minutes (0-59) */
  signMinute?: number;
  
  /** Whether the planet is in retrograde motion */
  isRetrograde?: boolean;
  
  /** Speed in degrees per day (negative if retrograde) */
  speedDegPerDay?: number;
  
  // ---- Timeline ----
  
  /** When the planet entered this sign */
  transitStartDate?: Date;
  
  /** When the planet will leave this sign (estimated) */
  transitEndDate?: Date;
  
  /** Last time this data was updated */
  lastUpdated: Date;
  
  /** When this data should be refreshed */
  nextRefreshDue: Date;
  
  // ---- Source ----
  
  /** Data source */
  source: 'ephemeris' | 'cached' | 'fallback';
}

/**
 * Collection of all planet transits
 */
export type AllPlanetTransits = Record<Planet, PlanetTransit>;

// ============================================================================
// SYSTEM 3: HOURLY PLANETARY HOURS (WHEN)
// ============================================================================

/**
 * Hourly planetary ruler (changes every 60-90 minutes)
 * This is the traditional planetary hours system
 */
export interface PlanetaryHour {
  /** Ruling planet for this hour */
  planet: Planet;
  
  /** Hour number (1-12 for day, 1-12 for night) */
  hourNumber: number;
  
  /** Whether this is a daytime hour */
  isDay: boolean;
  
  /** When this hour starts */
  startTime: Date;
  
  /** When this hour ends */
  endTime: Date;
  
  /** Element of the ruling planet */
  element: Element;
  
  /** Planet info for display */
  planetInfo: {
    name: string;
    arabicName: string;
    symbol: string;
  };
}

// ============================================================================
// COMBINED VIEW (for widgets that show both systems)
// ============================================================================

/**
 * Combined planetary information showing both systems
 */
export interface PlanetarySnapshot {
  /** Current planetary hour (WHEN system) */
  currentHour: PlanetaryHour;
  
  /** Long-term transit of the current hour's planet (WHERE system) */
  planetTransit: PlanetTransit;
  
  /** Timestamp of this snapshot */
  timestamp: Date;
}

// ============================================================================
// REFRESH INTERVALS
// ============================================================================

/**
 * How often to refresh transit data for each planet
 */
export const TRANSIT_REFRESH_INTERVALS: Record<Planet, number> = {
  // Fast-moving planets (refresh more frequently)
  Moon: 6 * 60 * 60 * 1000,      // 6 hours (changes sign every ~2.5 days)
  Mercury: 24 * 60 * 60 * 1000,  // 24 hours
  Venus: 24 * 60 * 60 * 1000,    // 24 hours
  Mars: 24 * 60 * 60 * 1000,     // 24 hours
  Sun: 24 * 60 * 60 * 1000,      // 24 hours (changes sign monthly)
  
  // Slow-moving planets (refresh less frequently)
  Jupiter: 7 * 24 * 60 * 60 * 1000,  // 7 days (stays ~1 year per sign)
  Saturn: 7 * 24 * 60 * 60 * 1000,   // 7 days (stays ~2.5 years per sign)
};
