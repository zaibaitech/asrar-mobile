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
  signDegree?: number;
  signMinute?: number;
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
const PLANET_INFO: Record<Planet, { name: string; arabicName: string; symbol: string }> = {
  Sun: { name: 'Sun', arabicName: 'الشمس', symbol: '☉' },
  Moon: { name: 'Moon', arabicName: 'القمر', symbol: '☽' },
  Mercury: { name: 'Mercury', arabicName: 'عطارد', symbol: '☿' },
  Venus: { name: 'Venus', arabicName: 'الزهرة', symbol: '♀' },
  Mars: { name: 'Mars', arabicName: 'المريخ', symbol: '♂' },
  Jupiter: { name: 'Jupiter', arabicName: 'المشتري', symbol: '♃' },
  Saturn: { name: 'Saturn', arabicName: 'زحل', symbol: '♄' },
};

/**
 * Convert new PlanetTransit to legacy PlanetTransitInfo format
 * Used for backward compatibility with existing widgets
 */
export function adaptTransitToLegacyFormat(
  transit: PlanetTransit
): LegacyPlanetTransitInfo {
  const planetInfo = PLANET_INFO[transit.planet];
  const zodiacInfo = ZODIAC_DATA[transit.sign];
  
  return {
    planetKey: transit.planet.toLowerCase(),
    planetName: planetInfo.name,
    planetNameAr: planetInfo.arabicName,
    planetSymbol: planetInfo.symbol,
    elementKey: transit.element,
    zodiacKey: transit.sign,
    zodiacSymbol: zodiacInfo.symbol,
    signDegree: transit.signDegree,
    signMinute: transit.signMinute,
    transitStartDate: transit.transitStartDate,
    transitEndDate: transit.transitEndDate,
    source: transit.source,
    updatedAt: transit.lastUpdated.toISOString(),
  };
}
