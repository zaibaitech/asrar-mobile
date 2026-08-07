/**
 * Ikhtiyārāt scoring engine — pure, framework-free.
 * Ported verbatim (algorithm, thresholds) from asrar.app's
 * src/lib/ikhtiyarat/engine.ts, adapted to mobile's SunCalc/planetary-hour
 * primitives (see planetaryHourOfDay.ts).
 *
 * Election-type-agnostic: given a rules config (e.g. elections/marriage.ts)
 * and an ElectionInput, computes a RuleContext (shared ephemeris/aspect data)
 * once, runs every rule against it, and aggregates to a score/tier.
 *
 * Sub-daily resolution: evaluates every 3 hours across the calendar day
 * (in the given lat/lon's local time, derived from tz) and reports the
 * best-scoring window, since the Moon can move enough in a day to flip a
 * verdict (e.g. clearing combustion by evening).
 */

import SunCalc from 'suncalc';
import { Planet } from '@/services/PlanetaryHoursService';
import { getAllPlanetPositions, getMoonElongation, getMoonPhaseDirection, getMoonSunSeparation, getNearestEclipse } from './ephemeris';
import { getMoonApplyingAspects } from './aspects';
import { getPlanetaryHourRulerAt } from './planetaryHourOfDay';
import { ElectionInput, ElectionResult, ElectionRulesConfig, Rule, RuleContext, RuleResult, Tier, WindowScore } from './types';

/**
 * Sums each rule's declared `maxPoints`, taking only the highest value once
 * per `exclusiveGroup` (rules sharing a group can never all fire at once —
 * e.g. mutually exclusive Moon-sign dignity tiers) and summing every
 * ungrouped rule independently. Exported so each elections/*.ts config can
 * implement `maxAchievable()` as `computeMaxAchievable(rules)` without
 * duplicating the grouping logic.
 */
export function computeMaxAchievable(rules: Rule[]): number {
  let total = 0;
  const groupMax = new Map<string, number>();

  for (const r of rules) {
    if (!r.maxPoints) continue;
    if (r.exclusiveGroup) {
      const current = groupMax.get(r.exclusiveGroup) ?? 0;
      groupMax.set(r.exclusiveGroup, Math.max(current, r.maxPoints));
    } else {
      total += r.maxPoints;
    }
  }

  for (const max of groupMax.values()) total += max;
  return total;
}

const STEP_HOURS = 3;
const DEFAULT_CIVIL_HOURS = { startHour: 8, endHour: 22 };

function buildRuleContext(datetime: Date, lat: number, lon: number, localHour: number): RuleContext {
  const positions = getAllPlanetPositions(datetime);
  const moonElongation = getMoonElongation(datetime);
  const moonSunSeparation = getMoonSunSeparation(datetime);
  const moonPhaseDirection = getMoonPhaseDirection(datetime);
  const dayOfWeek = datetime.getDay();
  const nearestEclipse = getNearestEclipse(datetime);
  const applyingAspects = getMoonApplyingAspects(datetime);

  let planetaryHourPlanet: Planet | null = null;
  let isDaytime = false;
  try {
    const sunTimes = SunCalc.getTimes(datetime, lat, lon);
    if (sunTimes.sunrise && sunTimes.sunset) {
      isDaytime = datetime >= sunTimes.sunrise && datetime < sunTimes.sunset;
      const nextDay = new Date(datetime.getTime() + 24 * 60 * 60 * 1000);
      const nextSunTimes = SunCalc.getTimes(nextDay, lat, lon);
      const nextSunrise = nextSunTimes.sunrise ?? new Date(sunTimes.sunrise.getTime() + 24 * 60 * 60 * 1000);
      planetaryHourPlanet = getPlanetaryHourRulerAt(sunTimes.sunrise, sunTimes.sunset, nextSunrise, datetime);
    }
  } catch {
    planetaryHourPlanet = null;
  }

  return {
    datetime,
    lat,
    lon,
    positions,
    moonElongation,
    moonSunSeparation,
    moonPhaseDirection,
    dayOfWeek,
    planetaryHourPlanet,
    nearestEclipseHours: nearestEclipse ? nearestEclipse.hoursToNearestEclipse : Infinity,
    applyingAspects,
    isDaytime,
    localHour,
  };
}

function evaluateWindow(datetime: Date, lat: number, lon: number, localHour: number, config: ElectionRulesConfig): WindowScore {
  const ctx = buildRuleContext(datetime, lat, lon, localHour);
  const rules: RuleResult[] = [];
  let score = 0;
  let hasHardFail = false;

  for (const rule of config.rules) {
    const result = rule.evaluate(ctx);
    if (!result) continue;
    rules.push(result);
    score += result.points;
    if (result.status === 'hardfail') hasHardFail = true;
  }

  return { time: datetime, score, rules, hasHardFail };
}

/** Start-of-day in the given IANA timezone, expressed as the actual UTC instant of local midnight. */
function startOfLocalDay(datetime: Date, tz: string): Date {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(datetime);
  const get = (type: string) => Number(parts.find(p => p.type === type)!.value);

  // `datetime` reinterpreted as if its tz wall-clock components were UTC —
  // the delta between this and `datetime` itself is exactly tz's offset
  // (including DST) at this instant.
  const asIfUTC = new Date(Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second')));
  const offsetMs = asIfUTC.getTime() - datetime.getTime();

  // Local midnight expressed as UTC calendar components, then shifted by
  // that offset to land on the real UTC instant of local midnight.
  const localMidnightAsUTCComponents = new Date(Date.UTC(get('year'), get('month') - 1, get('day'), 0, 0, 0));
  return new Date(localMidnightAsUTCComponents.getTime() - offsetMs);
}

export function evaluateElection(input: ElectionInput, config: ElectionRulesConfig): ElectionResult {
  const dayStart = startOfLocalDay(input.datetime, input.tz);
  const windows: WindowScore[] = [];

  // h (the loop offset) equals local hour-of-day by construction, since
  // dayStart is local midnight — used below to filter to civil hours
  // without any further timezone math.
  for (let h = 0; h < 24; h += STEP_HOURS) {
    const t = new Date(dayStart.getTime() + h * 60 * 60 * 1000);
    windows.push(evaluateWindow(t, input.lat, input.lon, h, config));
  }

  windows.sort((a, b) => a.time.getTime() - b.time.getTime());

  const { startHour, endHour } = config.civilHoursRange ?? DEFAULT_CIVIL_HOURS;
  const inCivilHours = (w: WindowScore) => {
    const h = Math.round((w.time.getTime() - dayStart.getTime()) / (60 * 60 * 1000));
    return h >= startHour && h < endHour;
  };

  // Prefer windows within civil hours; fall back to the full day only if
  // none fall in that range (shouldn't happen with the default 8-22 range
  // and a 3-hour step, but kept defensive for narrower future configs).
  const civilWindows = windows.filter(inCivilHours);
  const candidateWindows = civilWindows.length > 0 ? civilWindows : windows;

  // Within the candidate set, prefer the best-scoring window that has no
  // hard fail — a date is only truly "Avoid" if every candidate window
  // hard-fails. This is what lets a date be "good in the morning, bad by
  // evening" (or vice versa) resolve to its best window rather than being
  // dragged down by its worst one. Ties go to the earlier window.
  const pickBest = (list: WindowScore[]) =>
    list.reduce((best, w) => {
      if (w.score > best.score) return w;
      if (w.score === best.score && w.time.getTime() < best.time.getTime()) return w;
      return best;
    });
  const cleanWindows = candidateWindows.filter(w => !w.hasHardFail);
  const bestWindow = cleanWindows.length > 0 ? pickBest(cleanWindows) : pickBest(candidateWindows);

  const maxAchievable = config.maxAchievable();
  const normalizedScore = maxAchievable > 0
    ? Math.max(0, Math.min(100, Math.round((bestWindow.score / maxAchievable) * 100)))
    : 0;

  const tierInfo = config.scoreToTier(normalizedScore, bestWindow.hasHardFail);

  return {
    electionType: config.electionType,
    date: dayStart,
    score: normalizedScore,
    tier: tierInfo.tier,
    tierInfo,
    hasHardFail: bestWindow.hasHardFail,
    rules: bestWindow.rules,
    bestWindow,
    allWindows: windows,
    isLeastAfflicted: bestWindow.hasHardFail,
  };
}

/**
 * Below this range length, a scan finding zero hard-fail-free acceptable-or-better
 * days isn't necessarily a calibration problem — short windows can
 * legitimately be unlucky. 90 days is long enough that "nothing acceptable
 * anywhere" is a real signal, not noise.
 */
const SCAN_SANITY_MIN_DAYS = 90;

/** Scan a date range (inclusive) and evaluate each day — used by the "Find Best Dates" scanner. */
export function evaluateDateRange(
  startDate: Date,
  endDate: Date,
  lat: number,
  lon: number,
  tz: string,
  electionType: ElectionInput['electionType'],
  config: ElectionRulesConfig,
): ElectionResult[] {
  const results: ElectionResult[] = [];
  let t = new Date(startDate);

  while (t.getTime() <= endDate.getTime()) {
    results.push(evaluateElection({ datetime: t, lat, lon, tz, electionType }, config));
    t = new Date(t.getTime() + 24 * 60 * 60 * 1000);
  }

  // Self-detecting scoring-calibration check — dev-only diagnostic, never
  // throws or blocks the scan.
  if (__DEV__ && results.length >= SCAN_SANITY_MIN_DAYS) {
    const anyAcceptableOrBetter = results.some(r => !r.hasHardFail && ACCEPTABLE_OR_BETTER.has(r.tier));
    if (!anyAcceptableOrBetter) {
      console.warn(
        `[ikhtiyarat] evaluateDateRange (${config.electionType}): no day in a ${results.length}-day scan reached acceptable or better. ` +
        `This usually means the election config's maxAchievable() (${config.maxAchievable()}) is miscalibrated against its tier bands — ` +
        `verify raw bonus totals can realistically clear the acceptable threshold.`,
      );
    }
  }

  return results;
}

/** Tiers considered "genuinely better" — acceptable or above. Election-agnostic: any tier other than weak/avoid. */
const ACCEPTABLE_OR_BETTER: ReadonlySet<Tier> = new Set(['excellent', 'good', 'acceptable']);

const TIER_RANK: Record<Tier, number> = { excellent: 4, good: 3, acceptable: 2, weak: 1, avoid: 0 };

export interface NearestBetterDatesResult {
  /** Up to `count` dates reaching acceptable-or-better, sorted by date distance (ties broken by tier then score). */
  dates: ElectionResult[];
  /** True if the search radius was fully searched without finding `count` qualifying dates (dates[] may be shorter than requested, or empty). */
  radiusExhausted: boolean;
  /**
   * The single best-scoring candidate seen during the scan, even if it
   * didn't reach 'acceptable' — populated only when `dates` is empty, so
   * the caller can offer "no acceptable dates found, here's the closest
   * we found" without re-scanning. Null if the radius produced no
   * candidates at all (shouldn't happen in practice with a 45-day scan).
   */
  bestAvailable: ElectionResult | null;
}

/**
 * Find the nearest dates (searching both forward and backward from the
 * given date, up to searchRadiusDays each direction) that reach at least
 * the 'acceptable' tier — not just "higher score than today," since today
 * could itself be Weak and a marginally-higher-scoring nearby date would
 * still not be a genuinely good recommendation.
 */
export function findNearestBetterDates(
  input: ElectionInput,
  config: ElectionRulesConfig,
  count: number,
  searchRadiusDays = 45,
): NearestBetterDatesResult {
  const found: ElectionResult[] = [];
  let bestAvailable: ElectionResult | null = null;

  for (let offset = 1; offset <= searchRadiusDays; offset++) {
    for (const sign of [1, -1] as const) {
      const candidateDate = new Date(input.datetime.getTime() + sign * offset * 24 * 60 * 60 * 1000);
      const result = evaluateElection({ ...input, datetime: candidateDate }, config);
      if (!result.hasHardFail && ACCEPTABLE_OR_BETTER.has(result.tier)) {
        found.push(result);
      }
      if (!bestAvailable || result.score > bestAvailable.score) {
        bestAvailable = result;
      }
    }
  }

  const sorted = found.sort((a, b) => {
    const distanceA = Math.abs(a.date.getTime() - input.datetime.getTime());
    const distanceB = Math.abs(b.date.getTime() - input.datetime.getTime());
    if (distanceA !== distanceB) return distanceA - distanceB;
    // Equidistant: prefer the higher tier, then the higher score.
    if (TIER_RANK[b.tier] !== TIER_RANK[a.tier]) return TIER_RANK[b.tier] - TIER_RANK[a.tier];
    return b.score - a.score;
  });

  const dates = sorted.slice(0, count);
  return {
    dates,
    radiusExhausted: dates.length < count,
    bestAvailable: dates.length === 0 ? bestAvailable : null,
  };
}
