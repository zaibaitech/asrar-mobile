/**
 * Transit Adapters
 * ================
 * 
 * Adapters to convert between transit data formats for backward compatibility
 */

import { Element } from '@/services/MomentAlignmentService';
import { Planet } from '@/services/PlanetaryHoursService';
import { ZODIAC_DATA } from '@/services/PlanetTransitService';
import { PlanetTransit, ZodiacSign } from '@/types/planetary-systems';

/**
 * Legacy PlanetTransitInfo interface (for backward compatibility with widgets)
 */
export interface LegacyPlanetTransitInfo {
  planetKey: string;
  planetName: string;
  planetNameAr: string;
  planetSymbol: string;
  elementKey: Element;
  zodiacKey: ZodiacSign;
  zodiacSymbol: string;
  longitude?: number;
  signDegree?: number;
  signMinute?: number;
  isRetrograde?: boolean;
  speedDegPerDay?: number;
  transitStartDate?: Date;
  transitEndDate?: Date;
  source?: 'ephemeris' | 'cached' | 'fallback';
  hourNumber?: number;
  isDaytime?: boolean;
  updatedAt: string;
  nextHourStartTime?: Date;
  countdownSeconds?: number;
}

/**
 * Planet info for display
 */
const PLANET_INFO_EN: Record<Planet, { name: string; arabicName: string; symbol: string }> = {
  Sun: { name: 'Sun', arabicName: 'الشمس', symbol: '☉' },
  Moon: { name: 'Moon', arabicName: 'القمر', symbol: '☽' },
  Mercury: { name: 'Mercury', arabicName: 'عطارد', symbol: '☿' },
  Venus: { name: 'Venus', arabicName: 'الزهرة', symbol: '♀' },
  Mars: { name: 'Mars', arabicName: 'المريخ', symbol: '♂' },
  Jupiter: { name: 'Jupiter', arabicName: 'المشتري', symbol: '♃' },
  Saturn: { name: 'Saturn', arabicName: 'زحل', symbol: '♄' },
};

const PLANET_INFO_FR: Record<Planet, { name: string; arabicName: string; symbol: string }> = {
  Sun: { name: 'Soleil', arabicName: 'الشمس', symbol: '☉' },
  Moon: { name: 'Lune', arabicName: 'القمر', symbol: '☽' },
  Mercury: { name: 'Mercure', arabicName: 'عطارد', symbol: '☿' },
  Venus: { name: 'Vénus', arabicName: 'الزهرة', symbol: '♀' },
  Mars: { name: 'Mars', arabicName: 'المريخ', symbol: '♂' },
  Jupiter: { name: 'Jupiter', arabicName: 'المشتري', symbol: '♃' },
  Saturn: { name: 'Saturne', arabicName: 'زحل', symbol: '♄' },
};

const PLANET_INFO_AR: Record<Planet, { name: string; arabicName: string; symbol: string }> = {
  Sun: { name: 'الشمس', arabicName: 'الشمس', symbol: '☉' },
  Moon: { name: 'القمر', arabicName: 'القمر', symbol: '☽' },
  Mercury: { name: 'عطارد', arabicName: 'عطارد', symbol: '☿' },
  Venus: { name: 'الزهرة', arabicName: 'الزهرة', symbol: '♀' },
  Mars: { name: 'المريخ', arabicName: 'المريخ', symbol: '♂' },
  Jupiter: { name: 'المشتري', arabicName: 'المشتري', symbol: '♃' },
  Saturn: { name: 'زحل', arabicName: 'زحل', symbol: '♄' },
};

/**
 * Get planet info based on language
 */
function getPlanetInfo(planet: Planet, language: 'en' | 'ar' | 'fr' = 'en'): { name: string; arabicName: string; symbol: string } {
  if (language === 'ar') {
    return PLANET_INFO_AR[planet];
  } else if (language === 'fr') {
    return PLANET_INFO_FR[planet];
  }
  return PLANET_INFO_EN[planet];
}

/**
 * Convert new PlanetTransit to legacy PlanetTransitInfo format
 * Used for backward compatibility with existing widgets
 */
export function adaptTransitToLegacyFormat(
  transit: PlanetTransit,
  language: 'en' | 'ar' | 'fr' = 'en'
): LegacyPlanetTransitInfo {
  const planetInfo = getPlanetInfo(transit.planet, language);
  const zodiacInfo = ZODIAC_DATA[transit.sign];
  
  return {
    planetKey: transit.planet.toLowerCase(),
    planetName: planetInfo.name,
    planetNameAr: planetInfo.arabicName,
    planetSymbol: planetInfo.symbol,
    elementKey: transit.element,
    zodiacKey: transit.sign,
    zodiacSymbol: zodiacInfo.symbol,
    longitude: transit.longitude,
    signDegree: transit.signDegree,
    signMinute: transit.signMinute,
    isRetrograde: transit.isRetrograde,
    speedDegPerDay: transit.speedDegPerDay,
    transitStartDate: transit.transitStartDate,
    transitEndDate: transit.transitEndDate,
    source: transit.source,
    updatedAt: transit.lastUpdated.toISOString(),
  };
}
