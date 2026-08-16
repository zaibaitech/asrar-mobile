/**
 * Planet positions for the DOB compatibility aspect engine
 * ============================================================
 * Fetches the 5 non-lunar planets Layer 5 needs (Venus, Mars, Mercury,
 * Jupiter, Saturn) for a resolved birth instant. One EphemerisService call
 * per person — it already returns all 7 tracked planets in a single
 * response, so this never calls it once per planet.
 *
 * @module planetaryPositionsForCompatibility
 */

import { getPlanetPositions } from '../EphemerisService';
import type { AspectPlanetId, PersonPlanetSigns, ZodiacSignName } from './aspectEngine';

const SIGN_NAMES: ZodiacSignName[] = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces',
];

function signIndexToName(index: number): ZodiacSignName {
  return SIGN_NAMES[((index % 12) + 12) % 12];
}

/**
 * Resolve Venus/Mars/Mercury/Jupiter/Saturn signs for the same instant a
 * person's Sun sign was resolved at (sunSignName, resolvedUTCInstant), via
 * a single EphemerisService.getPlanetPositions() call.
 *
 * Returns null if ephemeris data is unavailable for this instant — callers
 * should treat this as "Layer 5 unavailable", not fabricate positions.
 */
export async function resolvePersonPlanetSigns(
  sunSignName: ZodiacSignName,
  resolvedUTCInstant: Date
): Promise<PersonPlanetSigns | null> {
  const positions = await getPlanetPositions(resolvedUTCInstant);
  if (!positions) return null;

  const planetIds: AspectPlanetId[] = ['venus', 'mars', 'mercury', 'jupiter', 'saturn'];
  const resolved: Partial<Record<AspectPlanetId, ZodiacSignName>> = {};

  for (const id of planetIds) {
    const sign = positions.planets[id]?.sign;
    if (typeof sign !== 'number') return null;
    resolved[id] = signIndexToName(sign);
  }

  return {
    sun: sunSignName,
    venus: resolved.venus!,
    mars: resolved.mars!,
    mercury: resolved.mercury!,
    jupiter: resolved.jupiter!,
    saturn: resolved.saturn!,
  };
}
