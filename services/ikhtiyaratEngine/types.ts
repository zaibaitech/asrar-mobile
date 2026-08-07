/**
 * Ikhtiyārāt (Electional Astrology) — shared engine types.
 * Ported from asrar.app's src/lib/ikhtiyarat/types.ts. `detail_ar` is a
 * new field — the source only has detail_en/detail_fr; mobile needs full
 * AR content for the rule breakdown, sourced as draft translations
 * pending native/scholarly review (see each elections/*.ts file for the
 * per-rule text).
 *
 * The engine (engine.ts) is framework-free and election-agnostic; each
 * election type supplies only a rules config implementing
 * ElectionRulesConfig — never a fork of the engine itself.
 */

import { Planet } from '@/services/PlanetaryHoursService';
import { PlanetPosition } from './ephemeris';
import { ApplyingAspect } from './aspects';

export type ElectionType = 'marriage' | 'travel' | 'business' | 'medical' | 'home' | 'education';

export type RuleStatus = 'pass' | 'fail' | 'bonus' | 'penalty' | 'hardfail';

export interface LocalizedText {
  en: string;
  fr: string;
  ar: string;
}

export interface RuleResult {
  id: string;
  label_en: string;
  label_fr: string;
  label_ar: string;
  status: RuleStatus;
  points: number;
  detail_en: string;
  detail_fr: string;
  /** DRAFT — new field vs. the source app, needs native/scholarly review. */
  detail_ar: string;
}

export type Tier = 'excellent' | 'good' | 'acceptable' | 'weak' | 'avoid';

export interface TierInfo {
  tier: Tier;
  labelEn: string;
  labelFr: string;
  labelAr: string;
  color: string;
}

/** Input describing when/where an election is being evaluated. */
export interface ElectionInput {
  datetime: Date;
  lat: number;
  lon: number;
  /** IANA timezone, e.g. "Europe/London". Used for day-boundary/Hijri display only — all math is done on the absolute Date. */
  tz: string;
  electionType: ElectionType;
}

/** A scored moment within a day (one of the sub-daily evaluation steps). */
export interface WindowScore {
  time: Date;
  score: number;
  rules: RuleResult[];
  hasHardFail: boolean;
}

export interface ElectionResult {
  electionType: ElectionType;
  date: Date;
  score: number;
  tier: Tier;
  tierInfo: TierInfo;
  hasHardFail: boolean;
  rules: RuleResult[];
  /** The best 3-hour-step window within the day, and its own score/rules. */
  bestWindow: WindowScore;
  /** All evaluated sub-daily windows, sorted by time. */
  allWindows: WindowScore[];
  /**
   * True when every window within civilHoursRange hard-failed and the
   * engine fell back to the least-bad window outside that range (or, if
   * civilHoursRange is unset, when every window in the day hard-failed).
   * UI should label the window "Least-afflicted time" instead of
   * "Best time window" when this is true.
   */
  isLeastAfflicted: boolean;
}

/** One evaluation context handed to every rule — precomputed shared data so rules don't recompute ephemeris. */
export interface RuleContext {
  datetime: Date;
  lat: number;
  lon: number;
  positions: Record<Planet, PlanetPosition>;
  moonElongation: number;
  moonSunSeparation: number;
  moonPhaseDirection: 'waxing' | 'waning';
  dayOfWeek: number; // 0=Sunday .. 6=Saturday
  planetaryHourPlanet: Planet | null;
  nearestEclipseHours: number;
  applyingAspects: ApplyingAspect[];
  /** True when datetime falls between that day's sunrise and sunset — needed for day/night essential-dignity checks. */
  isDaytime: boolean;
  /** Local hour-of-day (0-23) of this window, per the input's tz — equal to evaluateElection's loop offset `h` by construction (dayStart is local midnight). Lets rules key off time-of-day (e.g. the travel election's early-departure/bukūr bonus) without re-deriving timezone math themselves. */
  localHour: number;
}

export interface Rule {
  id: string;
  label: LocalizedText;
  /** Evaluate this rule against a context. Return null if the rule does not apply at all (rare — most rules always apply and report pass/fail). */
  evaluate(ctx: RuleContext): RuleResult | null;
  /**
   * The most positive `points` this rule can ever return, used by
   * ElectionRulesConfig.maxAchievable() to normalize scores across election
   * types with different-sized bonus pools. Omit for rules that never award
   * a bonus (hard-fail-only or penalty-only rules contribute 0).
   */
  maxPoints?: number;
  /**
   * Rules tagged with the same exclusiveGroup can never both fire at their
   * max in the same window (e.g. "Moon in Cancer" and "Moon in Taurus" —
   * the Moon is in exactly one sign). maxAchievable() takes the highest
   * maxPoints within a group once, instead of summing every rule in it.
   * Rules without a group are assumed independent and always summed.
   */
  exclusiveGroup?: string;
}

export interface ElectionRulesConfig {
  electionType: ElectionType;
  rules: Rule[];
  tiers: TierInfo[];
  scoreToTier(score: number, hasHardFail: boolean): TierInfo;
  /** Local civil-hours range to prefer for the "best window" search, e.g. {startHour:8, endHour:22}. Defaults to 8-22 if omitted. */
  civilHoursRange?: { startHour: number; endHour: number };
  /**
   * SCHOLAR-REVIEW: when true, bonus rules that key off the ruling
   * planetary hour (e.g. planetaryHourBonus) additionally require that
   * hour's ruling planet not be combust, retrograde, or in fall/detriment
   * at that time. Defaults to false, preserving existing scoring exactly.
   */
  strictHourRuler?: boolean;
  /**
   * The maximum raw point total a single window could ever achieve under
   * this config's rules — the denominator for normalizing final scores to
   * a shared 0-100 scale across election types with different-sized bonus
   * pools. Each election config supplies this directly (summing its own
   * rules' declared maxPoints, deduplicated by exclusiveGroup) rather than
   * the engine trying to infer it, since rule logic can't be introspected
   * generically.
   */
  maxAchievable(): number;
}
