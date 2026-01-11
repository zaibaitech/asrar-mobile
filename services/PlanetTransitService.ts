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

export type AspectType = 'conjunction' | 'sextile' | 'square' | 'trine' | 'opposition';

export type MotionType = 'direct' | 'retrograde';

export type StationType = 'stationingRx' | 'stationingDirect' | null;

export interface PlanetAspect {
  other: string; // planet ID
  type: AspectType;
  orbDeg: number;
  applying?: boolean; // true if getting closer, false if separating
}

export interface PlanetTransitSnapshot {
  planetId: string;
  timestampISO: string;
  
  // Position
  signKey: ZodiacSign;
  degree?: number;        // 0-29
  minute?: number;        // 0-59
  
  // Motion
  motion: MotionType;
  station?: StationType;
  speedDegPerDay?: number;
  
  // Timeline
  nextIngress?: {
    signKey: ZodiacSign;
    atISO: string;
    daysUntil?: number;
  };
  nextStation?: {
    type: StationType;
    atISO: string;
    daysUntil?: number;
  };
  
  // Aspects
  aspects?: PlanetAspect[];
}

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
  if (!planet || !PLANET_RULERSHIPS[planet]) {
    console.warn(`[PlanetTransitService] Invalid planet: ${planet}, defaulting to Leo`);
    return 'leo'; // Default fallback
  }
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
    
    if (!planetaryData || !planetaryData.currentHour) {
      console.warn('[PlanetTransitService] No planetary data available');
      return null;
    }
    
    const { currentHour, nextHour, countdownSeconds } = planetaryData;
    const { planet, planetInfo, hourNumber, isDaytime } = currentHour;
    
    if (!planet || !planetInfo) {
      console.warn('[PlanetTransitService] Invalid currentHour data');
      return null;
    }
    
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

// ========================================
// FULL TRANSIT SNAPSHOT (Phase/Motion/Aspects)
// ========================================

/**
 * Get comprehensive planet transit snapshot with motion, station, and timeline
 * 
 * TODO: This is currently a MOCK implementation that returns realistic placeholder data.
 * Replace with real astronomical calculations or API calls when available.
 * 
 * For now, it generates:
 * - Motion based on planet type (Mercury/Venus occasionally retrograde, outer planets less often)
 * - Degrees advancing slowly
 * - Next ingress in realistic timeframes
 * - Sample aspects
 */
export async function getPlanetTransitSnapshot(
  planetId: string,
  now: Date = new Date()
): Promise<PlanetTransitSnapshot | null> {
  try {
    const normalizedPlanetId = planetId.toLowerCase();
    
    // Mock data generator based on planet characteristics
    const mockData = generateMockTransitData(normalizedPlanetId, now);
    
    return {
      planetId: normalizedPlanetId,
      timestampISO: now.toISOString(),
      signKey: mockData.signKey,
      degree: mockData.degree,
      minute: mockData.minute,
      motion: mockData.motion,
      station: mockData.station,
      speedDegPerDay: mockData.speedDegPerDay,
      nextIngress: mockData.nextIngress,
      nextStation: mockData.nextStation,
      aspects: mockData.aspects,
    };
  } catch (error) {
    console.error('[PlanetTransitService] Error getting transit snapshot:', error);
    return null;
  }
}

/**
 * Generate mock transit data for a planet
 * This should be replaced with real astronomical calculations
 */
function generateMockTransitData(planetId: string, now: Date) {
  // Use current date to generate semi-stable mock data
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  
  // Planet-specific mock parameters
  const planetParams: Record<string, {
    signIndex: number;
    degreeOffset: number;
    speed: number;
    retrogradeChance: number;
    daysInSign: number;
  }> = {
    sun: { signIndex: Math.floor(dayOfYear / 30) % 12, degreeOffset: dayOfYear % 30, speed: 0.98, retrogradeChance: 0, daysInSign: 30 },
    moon: { signIndex: Math.floor(dayOfYear / 2.5) % 12, degreeOffset: (dayOfYear * 12) % 30, speed: 13.2, retrogradeChance: 0, daysInSign: 2.5 },
    mercury: { signIndex: Math.floor(dayOfYear / 25) % 12, degreeOffset: (dayOfYear * 1.2) % 30, speed: 1.4, retrogradeChance: 0.2, daysInSign: 25 },
    venus: { signIndex: Math.floor(dayOfYear / 28) % 12, degreeOffset: (dayOfYear * 1.1) % 30, speed: 1.2, retrogradeChance: 0.15, daysInSign: 28 },
    mars: { signIndex: Math.floor(dayOfYear / 45) % 12, degreeOffset: (dayOfYear * 0.7) % 30, speed: 0.65, retrogradeChance: 0.18, daysInSign: 45 },
    jupiter: { signIndex: Math.floor(dayOfYear / 365) % 12, degreeOffset: (dayOfYear * 0.08) % 30, speed: 0.08, retrogradeChance: 0.3, daysInSign: 365 },
    saturn: { signIndex: Math.floor(dayOfYear / 900) % 12, degreeOffset: (dayOfYear * 0.03) % 30, speed: 0.03, retrogradeChance: 0.35, daysInSign: 900 },
  };
  
  const params = planetParams[planetId] || planetParams.sun;
  const signs: ZodiacSign[] = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
  const signKey = signs[params.signIndex];
  
  // Determine motion
  const isRetrograde = Math.random() < params.retrogradeChance;
  const motion: MotionType = isRetrograde ? 'retrograde' : 'direct';
  
  // Station detection (planet about to change direction or very slow)
  const station: StationType = null; // Simplified for now
  
  // Speed
  const speedDegPerDay = isRetrograde ? -params.speed * 0.7 : params.speed;
  
  // Degree/minute
  const degree = Math.floor(params.degreeOffset);
  const minute = Math.floor((params.degreeOffset % 1) * 60);
  
  // Next ingress
  const daysUntilIngress = Math.max(1, Math.floor(params.daysInSign - (dayOfYear % params.daysInSign)));
  const nextSignIndex = (params.signIndex + 1) % 12;
  const nextIngressDate = new Date(now);
  nextIngressDate.setDate(nextIngressDate.getDate() + daysUntilIngress);
  
  const nextIngress = {
    signKey: signs[nextSignIndex],
    atISO: nextIngressDate.toISOString(),
    daysUntil: daysUntilIngress,
  };
  
  // Mock aspects (2-3 random aspects)
  const otherPlanets = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn'].filter(p => p !== planetId);
  const aspects: PlanetAspect[] = [];
  
  if (otherPlanets.length > 0 && Math.random() > 0.3) {
    const aspectTypes: AspectType[] = ['conjunction', 'sextile', 'square', 'trine', 'opposition'];
    const numAspects = Math.min(3, Math.floor(Math.random() * 3) + 1);
    
    for (let i = 0; i < numAspects; i++) {
      if (otherPlanets[i]) {
        aspects.push({
          other: otherPlanets[i],
          type: aspectTypes[Math.floor(Math.random() * aspectTypes.length)],
          orbDeg: Math.random() * 8,
          applying: Math.random() > 0.5,
        });
      }
    }
  }
  
  return {
    signKey,
    degree,
    minute,
    motion,
    station,
    speedDegPerDay,
    nextIngress,
    nextStation: undefined, // No station data in simplified mock
    aspects,
  };
}

/**
 * Format transit snapshot for display
 */
export function formatMotion(motion: MotionType, lang: 'en' | 'fr' | 'ar'): string {
  if (lang === 'fr') {
    return motion === 'direct' ? 'Direct' : 'Rétrograde';
  }
  if (lang === 'ar') {
    return motion === 'direct' ? 'مباشر' : 'تراجعي';
  }
  return motion === 'direct' ? 'Direct' : 'Retrograde';
}

export function formatStation(station: StationType, lang: 'en' | 'fr' | 'ar'): string | null {
  if (!station) return null;
  
  if (lang === 'fr') {
    return station === 'stationingRx' ? 'Stationnement Rétro' : 'Stationnement Direct';
  }
  if (lang === 'ar') {
    return station === 'stationingRx' ? 'توقف تراجعي' : 'توقف مباشر';
  }
  return station === 'stationingRx' ? 'Stationing Retrograde' : 'Stationing Direct';
}

export function formatAspect(aspect: AspectType, lang: 'en' | 'fr' | 'ar'): string {
  const translations: Record<AspectType, { en: string; fr: string; ar: string }> = {
    conjunction: { en: 'Conjunction', fr: 'Conjonction', ar: 'اقتران' },
    sextile: { en: 'Sextile', fr: 'Sextile', ar: 'سداسي' },
    square: { en: 'Square', fr: 'Carré', ar: 'تربيع' },
    trine: { en: 'Trine', fr: 'Trigone', ar: 'تثليث' },
    opposition: { en: 'Opposition', fr: 'Opposition', ar: 'مقابلة' },
  };
  
  return translations[aspect][lang] || translations[aspect].en;
}
