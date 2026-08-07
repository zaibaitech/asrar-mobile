/**
 * Ikhtiyārāt Ephemeris — local, date-arbitrary planetary positions
 * ==================================================================
 * Ported verbatim from asrar.app's src/lib/ikhtiyarat/ephemeris.ts.
 *
 * Unlike services/EphemerisService.ts (which fetches "now" from JPL
 * Horizons / an embedded cache, hourly-bucketed), electional astrology
 * needs to evaluate arbitrary past/future dates across month-long ranges.
 * That's a poor fit for a network-fetched "now" API, so this module
 * computes positions locally via `astronomy-engine`.
 *
 * astronomy-engine accuracy for the Moon is sub-arcsecond and for the
 * major planets is within a few arcseconds of JPL Horizons.
 *
 * IMPORTANT: everything here is time-varying by design (retrograde,
 * phase, applying aspects). Do NOT let this module's positions leak into
 * static domicile/exaltation dignity tables elsewhere in the app that
 * assume a fixed, non-time-varying essential dignity.
 */

import * as Astronomy from 'astronomy-engine';
import { Planet } from '@/services/PlanetaryHoursService';

export type ZodiacSign =
  | 'aries' | 'taurus' | 'gemini' | 'cancer'
  | 'leo' | 'virgo' | 'libra' | 'scorpio'
  | 'sagittarius' | 'capricorn' | 'aquarius' | 'pisces';

export const CLASSICAL_PLANETS: Planet[] = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];

const ZODIAC_ORDER: ZodiacSign[] = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces',
];

/** A planet's real geocentric apparent ecliptic position at an instant. */
export interface PlanetPosition {
  planet: Planet;
  /** Apparent geocentric ecliptic longitude, 0-360, tropical. */
  longitude: number;
  sign: ZodiacSign;
  /** Degree within sign, 0-29.999... */
  degreeInSign: number;
  /** True instantaneous ecliptic longitude speed in deg/day (negative = retrograde). */
  speedDegPerDay: number;
  isRetrograde: boolean;
}

function normalizeDegrees(deg: number): number {
  const d = deg % 360;
  return d < 0 ? d + 360 : d;
}

/** Signed shortest angular difference a-b in range (-180, 180]. */
export function angleDiff(a: number, b: number): number {
  let d = normalizeDegrees(a - b);
  if (d > 180) d -= 360;
  return d;
}

function eclipticLongitudeOf(planet: Planet, date: Date): number {
  if (planet === 'Sun') {
    return normalizeDegrees(Astronomy.SunPosition(date).elon);
  }
  if (planet === 'Moon') {
    return normalizeDegrees(Astronomy.EclipticGeoMoon(date).lon);
  }
  const body = planet as Astronomy.Body;
  const eq = Astronomy.GeoVector(body, date, true);
  return normalizeDegrees(Astronomy.Ecliptic(eq).elon);
}

function signOf(longitude: number): { sign: ZodiacSign; degreeInSign: number } {
  const idx = Math.floor(longitude / 30) % 12;
  return { sign: ZODIAC_ORDER[idx], degreeInSign: longitude - idx * 30 };
}

/**
 * Instantaneous ecliptic longitude speed via central finite difference.
 * A 6-hour half-step is small relative to every classical planet's period
 * (including the Moon's ~13°/day motion) so this is stable and cheap.
 */
function speedDegPerDay(planet: Planet, date: Date): number {
  const halfStepMs = 6 * 60 * 60 * 1000;
  const before = new Date(date.getTime() - halfStepMs);
  const after = new Date(date.getTime() + halfStepMs);
  const lonBefore = eclipticLongitudeOf(planet, before);
  const lonAfter = eclipticLongitudeOf(planet, after);
  const stepDays = (2 * halfStepMs) / (1000 * 60 * 60 * 24);
  return angleDiff(lonAfter, lonBefore) / stepDays;
}

// isMoonVoidOfCourse scans forward in hourly steps across up to 7 planets,
// and getMoonApplyingAspects re-derives each planet's position twice
// (now + a 30-min lookahead) per call — the same (planet, instant) pair is
// requested many times over within a single rule evaluation. Memoizing here
// (keyed by planet + exact millisecond timestamp) collapses that redundancy
// without changing any of the underlying astronomy. Bounded (simple FIFO
// eviction) so a multi-month date-range scan can't grow this unboundedly.
const positionCache = new Map<string, PlanetPosition>();
const POSITION_CACHE_MAX_ENTRIES = 20000;

export function getPlanetPosition(planet: Planet, date: Date): PlanetPosition {
  const key = `${planet}|${date.getTime()}`;
  const cached = positionCache.get(key);
  if (cached) return cached;

  const longitude = eclipticLongitudeOf(planet, date);
  const { sign, degreeInSign } = signOf(longitude);
  const speed = speedDegPerDay(planet, date);
  const position: PlanetPosition = {
    planet,
    longitude,
    sign,
    degreeInSign,
    speedDegPerDay: speed,
    isRetrograde: speed < 0,
  };

  if (positionCache.size >= POSITION_CACHE_MAX_ENTRIES) {
    const oldestKey = positionCache.keys().next().value;
    if (oldestKey !== undefined) positionCache.delete(oldestKey);
  }
  positionCache.set(key, position);
  return position;
}

export function getAllPlanetPositions(date: Date): Record<Planet, PlanetPosition> {
  const result = {} as Record<Planet, PlanetPosition>;
  for (const planet of CLASSICAL_PLANETS) {
    result[planet] = getPlanetPosition(planet, date);
  }
  return result;
}

/** Moon's elongation from the Sun, 0-360, measured eastward (0 = new moon, 180 = full moon). */
export function getMoonElongation(date: Date): number {
  const sun = eclipticLongitudeOf('Sun', date);
  const moon = eclipticLongitudeOf('Moon', date);
  return normalizeDegrees(moon - sun);
}

export type MoonPhaseDirection = 'waxing' | 'waning';

/** Elongation 0-180 = waxing (moving away from conjunction toward full); 180-360 = waning. */
export function getMoonPhaseDirection(date: Date): MoonPhaseDirection {
  return getMoonElongation(date) < 180 ? 'waxing' : 'waning';
}

/** Unsigned angular separation between Moon and Sun (0-180), for combustion/beams checks. */
export function getMoonSunSeparation(date: Date): number {
  const elong = getMoonElongation(date);
  return elong <= 180 ? elong : 360 - elong;
}

/** Unsigned angular separation between any planet and the Sun (0-180), for combustion checks beyond the Moon (e.g. a planetary-hour ruler). */
export function getPlanetSunSeparation(planet: Planet, date: Date): number {
  const sun = eclipticLongitudeOf('Sun', date);
  const p = eclipticLongitudeOf(planet, date);
  return Math.abs(angleDiff(p, sun));
}

export interface EclipseProximity {
  /** Hours to the nearest lunar or solar eclipse peak (signed: negative = in the past). */
  hoursToNearestEclipse: number;
  kind: 'lunar' | 'solar';
  peakDate: Date;
}

interface EclipsePeak {
  kind: 'lunar' | 'solar';
  peakDate: Date;
}

/**
 * Cache of eclipse peak dates found by a single search anchored at
 * anchorTime (= queryDate - 200 days at the time of the search). Eclipses
 * are ~months apart, so this list is valid for any query date that falls
 * safely inside [anchorTime, anchorTime + ~2 anchor windows] — far more
 * than one call's worth of range-scan dates share a cached list, which is
 * what makes this worth caching at all (SearchLunarEclipse/
 * SearchGlobalSolarEclipse are each independently expensive iterative
 * searches).
 */
let eclipseCache: { anchorTime: number; peaks: EclipsePeak[] } | null = null;

const LOOKBACK_MS = 200 * 24 * 60 * 60 * 1000;
// Re-search once the query date is this close to either edge of what the
// cached list actually covers, so we never silently miss a nearer eclipse
// that would have been found by re-anchoring the search.
const REFRESH_MARGIN_MS = 30 * 24 * 60 * 60 * 1000;

function searchEclipsePeaks(anchorTime: Date): EclipsePeak[] {
  const peaks: EclipsePeak[] = [];
  const horizon = anchorTime.getTime() + 2 * LOOKBACK_MS;

  let lunar = Astronomy.SearchLunarEclipse(anchorTime);
  for (let i = 0; i < 6 && lunar; i++) {
    peaks.push({ kind: 'lunar', peakDate: lunar.peak.date });
    if (lunar.peak.date.getTime() > horizon) break;
    lunar = Astronomy.NextLunarEclipse(lunar.peak);
  }

  let solar = Astronomy.SearchGlobalSolarEclipse(anchorTime);
  for (let i = 0; i < 6 && solar; i++) {
    peaks.push({ kind: 'solar', peakDate: solar.peak.date });
    if (solar.peak.date.getTime() > horizon) break;
    solar = Astronomy.NextGlobalSolarEclipse(solar.peak);
  }

  return peaks;
}

/**
 * Finds the nearest lunar/solar eclipse to `date` by searching both
 * forward and (via a lookback window) backward, returning whichever is closer.
 */
export function getNearestEclipse(date: Date): EclipseProximity {
  const t = date.getTime();
  const cacheCoversDate =
    eclipseCache &&
    t >= eclipseCache.anchorTime + REFRESH_MARGIN_MS &&
    t <= eclipseCache.anchorTime + 2 * LOOKBACK_MS - REFRESH_MARGIN_MS;

  if (!cacheCoversDate) {
    const anchorTime = new Date(t - LOOKBACK_MS);
    eclipseCache = { anchorTime: anchorTime.getTime(), peaks: searchEclipsePeaks(anchorTime) };
  }

  const candidates: EclipseProximity[] = eclipseCache!.peaks.map(p => ({
    kind: p.kind,
    peakDate: p.peakDate,
    hoursToNearestEclipse: (p.peakDate.getTime() - t) / (1000 * 60 * 60),
  }));

  candidates.sort((a, b) => Math.abs(a.hoursToNearestEclipse) - Math.abs(b.hoursToNearestEclipse));
  return candidates[0];
}
