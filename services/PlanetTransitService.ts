/**
 * Planet Transit Service
 * ======================
 * Provides current planetary hour transit information for UI display
 * 
 * Uses existing PlanetaryHoursService data combined with zodiac mapping
 */

import { Element } from './MomentAlignmentService';
import { calculatePlanetaryHours, Planet } from './PlanetaryHoursService';

export type ZodiacSign = 
  | 'aries' | 'taurus' | 'gemini' | 'cancer' 
  | 'leo' | 'virgo' | 'libra' | 'scorpio' 
  | 'sagittarius' | 'capricorn' | 'aquarius' | 'pisces';

export interface PlanetTransitInfo {
  // Current planetary hour planet
  planetKey: string;
  planetName: string;
  planetNameAr: string;
  planetSymbol: string;
  
  // Element of the planet
  elementKey: Element;
  
  // Zodiac info (rulership-based mapping)
  zodiacKey: ZodiacSign;
  zodiacSymbol: string;
  
  // Timing
  hourNumber: number;
  isDaytime: boolean;
  updatedAt: string;
  
  // Next transition
  nextHourStartTime: Date;
  countdownSeconds: number;
}

/**
 * Traditional planetary rulerships over zodiac signs
 * Each planet rules one or two signs (classical rulerships)
 */
const PLANET_RULERSHIPS: Record<Planet, ZodiacSign[]> = {
  Sun: ['leo'],
  Moon: ['cancer'],
  Mars: ['aries', 'scorpio'],
  Mercury: ['gemini', 'virgo'],
  Jupiter: ['sagittarius', 'pisces'],
  Venus: ['taurus', 'libra'],
  Saturn: ['capricorn', 'aquarius'],
};

/**
 * Get primary zodiac sign ruled by a planet
 */
function getPrimaryZodiacForPlanet(planet: Planet): ZodiacSign {
  const rulerships = PLANET_RULERSHIPS[planet];
  return rulerships[0]; // Return primary rulership
}

/**
 * Get current planet transit information
 * Based on the current planetary hour
 * 
 * @param sunrise - Sunrise time for the day
 * @param sunset - Sunset time for the day
 * @param nextSunrise - Next day's sunrise
 * @param now - Current time
 * @returns Current transit data or null if calculation fails
 */
export function getPlanetTransitNow(
  sunrise: Date,
  sunset: Date,
  nextSunrise: Date,
  now: Date = new Date()
): PlanetTransitInfo | null {
  try {
    // Get current planetary hour data
    const planetaryData = calculatePlanetaryHours(sunrise, sunset, nextSunrise, now);
    
    if (!planetaryData) {
      return null;
    }
    
    const { currentHour, nextHour, countdownSeconds } = planetaryData;
    const { planet, planetInfo, hourNumber, isDaytime } = currentHour;
    
    // Get zodiac sign for this planet (primary rulership)
    const zodiacKey = getPrimaryZodiacForPlanet(planet);
    const zodiacInfo = getZodiacInfo(zodiacKey);
    
    return {
      planetKey: planet.toLowerCase(),
      planetName: planet,
      planetNameAr: planetInfo.arabicName,
      planetSymbol: planetInfo.symbol,
      elementKey: planetInfo.element,
      zodiacKey,
      zodiacSymbol: zodiacInfo.symbol,
      hourNumber,
      isDaytime,
      updatedAt: now.toISOString(),
      nextHourStartTime: nextHour.startTime,
      countdownSeconds,
    };
  } catch (error) {
    console.error('[PlanetTransitService] Error getting transit data:', error);
    return null;
  }
}

/**
 * Get zodiac sign information for display
 */
export interface ZodiacInfo {
  key: ZodiacSign;
  element: Element;
  symbol: string;
}

/**
 * Zodiac sign data with elements and symbols
 */
export const ZODIAC_DATA: Record<ZodiacSign, ZodiacInfo> = {
  aries: { key: 'aries', element: 'fire', symbol: '♈' },
  taurus: { key: 'taurus', element: 'earth', symbol: '♉' },
  gemini: { key: 'gemini', element: 'air', symbol: '♊' },
  cancer: { key: 'cancer', element: 'water', symbol: '♋' },
  leo: { key: 'leo', element: 'fire', symbol: '♌' },
  virgo: { key: 'virgo', element: 'earth', symbol: '♍' },
  libra: { key: 'libra', element: 'air', symbol: '♎' },
  scorpio: { key: 'scorpio', element: 'water', symbol: '♏' },
  sagittarius: { key: 'sagittarius', element: 'fire', symbol: '♐' },
  capricorn: { key: 'capricorn', element: 'earth', symbol: '♑' },
  aquarius: { key: 'aquarius', element: 'air', symbol: '♒' },
  pisces: { key: 'pisces', element: 'water', symbol: '♓' },
};

/**
 * Get zodiac info by key
 */
export function getZodiacInfo(zodiacKey: ZodiacSign): ZodiacInfo {
  return ZODIAC_DATA[zodiacKey];
}
