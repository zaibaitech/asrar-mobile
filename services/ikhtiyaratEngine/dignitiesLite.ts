/**
 * Minimal static fall/detriment lookup, used only by the strictHourRuler
 * variant of the election configs (off by default, not exposed in the UI —
 * see elections/marriage.ts's makePlanetaryHourBonus).
 *
 * Ported from the FALLS/DETRIMENTS tables in asrar.app's
 * src/lib/planetary/dignities.ts, rather than importing that module's much
 * larger dignity-scoring system wholesale for two lookups this engine
 * actually uses. Static/time-invariant — kept intentionally separate from
 * the ported ephemeris.ts's time-varying PlanetPosition.sign, per the same
 * "never conflate a time-varying condition with a static essential-dignity
 * label" principle documented in ephemeris.ts's header.
 */

import { Planet } from '@/services/PlanetaryHoursService';
import { ZodiacSign } from './ephemeris';

const FALLS: Record<Planet, ZodiacSign> = {
  Sun: 'libra',
  Moon: 'scorpio',
  Mercury: 'pisces',
  Venus: 'virgo',
  Mars: 'cancer',
  Jupiter: 'capricorn',
  Saturn: 'aries',
};

const DETRIMENTS: Record<Planet, ZodiacSign[]> = {
  Sun: ['aquarius'],
  Moon: ['capricorn'],
  Mars: ['libra', 'taurus'],
  Mercury: ['sagittarius', 'pisces'],
  Jupiter: ['gemini', 'virgo'],
  Venus: ['aries', 'scorpio'],
  Saturn: ['cancer', 'leo'],
};

export function isInFall(planet: Planet, sign: ZodiacSign): boolean {
  return FALLS[planet] === sign;
}

export function isInDetriment(planet: Planet, sign: ZodiacSign): boolean {
  return DETRIMENTS[planet]?.includes(sign) ?? false;
}
