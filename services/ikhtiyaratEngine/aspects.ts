/**
 * Ptolemaic aspects, applying/separating detection, and Moon void-of-course.
 * Ported verbatim from asrar.app's src/lib/ikhtiyarat/aspects.ts.
 *
 * "Applying" means the aspect angle is shrinking toward exactness as time
 * moves forward — determined by comparing the faster-moving body's relative
 * motion, i.e. checking whether the orb narrows a short time later.
 */

import { Planet } from '@/services/PlanetaryHoursService';
import { angleDiff, CLASSICAL_PLANETS, getPlanetPosition, PlanetPosition } from './ephemeris';

export type AspectType = 'conjunction' | 'sextile' | 'square' | 'trine' | 'opposition';

export const ASPECT_ANGLES: Record<AspectType, number> = {
  conjunction: 0,
  sextile: 60,
  square: 90,
  trine: 120,
  opposition: 180,
};

/** Classical applying orbs (degrees) used by the marriage rule set. */
export const APPLYING_ORBS: Record<AspectType, number> = {
  conjunction: 8,
  sextile: 5,
  square: 8,
  trine: 7,
  opposition: 8,
};

export interface ApplyingAspect {
  planet: Planet;
  aspect: AspectType;
  /** Current orb (degrees from exact), always >= 0. */
  orb: number;
  applying: boolean;
}

/** Smallest angular distance to the nearest exact aspect angle, and which aspect it is. */
function nearestAspect(separation: number): { aspect: AspectType; orb: number } {
  let best: { aspect: AspectType; orb: number } | null = null;
  for (const aspect of Object.keys(ASPECT_ANGLES) as AspectType[]) {
    const orb = Math.abs(separation - ASPECT_ANGLES[aspect]);
    if (!best || orb < best.orb) best = { aspect, orb };
  }
  return best!;
}

/**
 * Is the Moon (or any planet) applying to a Ptolemaic aspect with `other`?
 * Applying = the orb to the nearest classical aspect angle is smaller a short
 * time later than now (i.e. the two bodies are closing in on exactness).
 */
export function getApplyingAspect(
  moving: Planet,
  other: Planet,
  date: Date,
  lookaheadHours = 0.5,
): ApplyingAspect | null {
  const p1 = getPlanetPosition(moving, date);
  const p2 = getPlanetPosition(other, date);
  const sep = Math.abs(angleDiff(p1.longitude, p2.longitude));
  const { aspect, orb } = nearestAspect(sep);

  // Use a short lookahead (default 30 min) so we detect the instantaneous
  // direction of the orb, not whether the aspect perfects and separates
  // again within the window — the latter would wrongly read as "separating"
  // for an aspect that is, right now, still closing in.
  const future = new Date(date.getTime() + lookaheadHours * 60 * 60 * 1000);
  const fp1 = getPlanetPosition(moving, future);
  const fp2 = getPlanetPosition(other, future);
  const futureSep = Math.abs(angleDiff(fp1.longitude, fp2.longitude));
  const futureOrb = Math.abs(futureSep - ASPECT_ANGLES[aspect]);

  return { planet: other, aspect, orb, applying: futureOrb < orb };
}

/**
 * All aspects the Moon is currently applying to (within the given orb table),
 * against every other classical planet.
 */
export function getMoonApplyingAspects(date: Date): ApplyingAspect[] {
  const results: ApplyingAspect[] = [];
  for (const planet of CLASSICAL_PLANETS) {
    if (planet === 'Moon') continue;
    const a = getApplyingAspect('Moon', planet, date);
    if (a && a.applying && a.orb <= APPLYING_ORBS[a.aspect]) {
      results.push(a);
    }
  }
  return results;
}

/**
 * Moon void of course: no applying Ptolemaic aspect (conjunction, sextile,
 * square, trine, opposition, within the applying-orb table) to any classical
 * planet before the Moon leaves its current sign.
 *
 * We check this by scanning forward in small steps until the Moon changes
 * sign, and testing at each step whether an aspect is applying and within orb.
 * If none is found before the sign change, the Moon is void of course now.
 */
export function isMoonVoidOfCourse(date: Date): boolean {
  const startSign = getPlanetPosition('Moon', date).sign;
  const stepHours = 1;
  const maxHours = 60; // Moon changes sign roughly every ~2.2 days; 60h covers the remainder of a sign safely
  let t = date;

  for (let h = 0; h <= maxHours; h += stepHours) {
    const moon = getPlanetPosition('Moon', t);
    if (moon.sign !== startSign) break;

    const aspects = getMoonApplyingAspects(t);
    if (aspects.length > 0) return false;

    t = new Date(t.getTime() + stepHours * 60 * 60 * 1000);
  }

  return true;
}

/** Convenience: unsigned separation between two planets right now. */
export function getSeparation(a: PlanetPosition, b: PlanetPosition): number {
  return Math.abs(angleDiff(a.longitude, b.longitude));
}
