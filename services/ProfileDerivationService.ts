/**
 * Profile Derivation Service
 * ===========================
 * Derives astrological data from user profile
 * 
 * Features:
 * - Burj (zodiac sign) from DOB
 * - Element (Fire, Earth, Air, Water) from Burj
 * - Planetary ruler from Burj
 * - Manazil baseline from DOB
 * - Personal Manazil from name + mother's name (Abjad)
 * 
 * Uses classical Islamic astronomy framework (Ilm al-Nujum)
 */

import { normalizeMansionIndex } from '@/data/lunarMansions';
import {
    DerivedAstrologicalData,
    UserProfile,
} from '@/types/user-profile';
import { calculateHadadKabir, normalizeArabic } from '@/utils/coreCalculations';
import { calculateAscendantSync } from './NatalChartService';

// ============================================================================
// BURJ (ZODIAC) SYSTEM
// ============================================================================

/**
 * Burj (Zodiac Signs) in Arabic
 * Based on tropical zodiac (Western astrology)
 */
export const BURJ_NAMES_AR = [
  'الحمل',     // Aries (Mar 21 - Apr 19)
  'الثور',     // Taurus (Apr 20 - May 20)
  'الجوزاء',   // Gemini (May 21 - Jun 20)
  'السرطان',   // Cancer (Jun 21 - Jul 22)
  'الأسد',     // Leo (Jul 23 - Aug 22)
  'العذراء',   // Virgo (Aug 23 - Sep 22)
  'الميزان',   // Libra (Sep 23 - Oct 22)
  'العقرب',    // Scorpio (Oct 23 - Nov 21)
  'القوس',     // Sagittarius (Nov 22 - Dec 21)
  'الجدي',     // Capricorn (Dec 22 - Jan 19)
  'الدلو',     // Aquarius (Jan 20 - Feb 18)
  'الحوت',     // Pisces (Feb 19 - Mar 20)
];

export const BURJ_NAMES_EN = [
  'Aries',
  'Taurus',
  'Gemini',
  'Cancer',
  'Leo',
  'Virgo',
  'Libra',
  'Scorpio',
  'Sagittarius',
  'Capricorn',
  'Aquarius',
  'Pisces',
];

/**
 * Burj date ranges (tropical zodiac)
 * Format: [month (1-12), day]
 */
const BURJ_DATE_RANGES = [
  { start: [3, 21], end: [4, 19] },   // Aries
  { start: [4, 20], end: [5, 20] },   // Taurus
  { start: [5, 21], end: [6, 20] },   // Gemini
  { start: [6, 21], end: [7, 22] },   // Cancer
  { start: [7, 23], end: [8, 22] },   // Leo
  { start: [8, 23], end: [9, 22] },   // Virgo
  { start: [9, 23], end: [10, 22] },  // Libra
  { start: [10, 23], end: [11, 21] }, // Scorpio
  { start: [11, 22], end: [12, 21] }, // Sagittarius
  { start: [12, 22], end: [1, 19] },  // Capricorn
  { start: [1, 20], end: [2, 18] },   // Aquarius
  { start: [2, 19], end: [3, 20] },   // Pisces
];

// ============================================================================
// ELEMENT SYSTEM
// ============================================================================

/**
 * Classical elements assigned to each Burj
 */
export type Element = 'fire' | 'earth' | 'air' | 'water';

const BURJ_ELEMENTS: Element[] = [
  'fire',   // Aries
  'earth',  // Taurus
  'air',    // Gemini
  'water',  // Cancer
  'fire',   // Leo
  'earth',  // Virgo
  'air',    // Libra
  'water',  // Scorpio
  'fire',   // Sagittarius
  'earth',  // Capricorn
  'air',    // Aquarius
  'water',  // Pisces
];

// ============================================================================
// PLANETARY RULERS
// ============================================================================

/**
 * Traditional planetary rulers for each Burj
 * Based on classical Islamic astronomy (Ilm al-Nujum)
 */
const BURJ_PLANETARY_RULERS = [
  'mars',      // Aries
  'venus',     // Taurus
  'mercury',   // Gemini
  'moon',      // Cancer
  'sun',       // Leo
  'mercury',   // Virgo
  'venus',     // Libra
  'mars',      // Scorpio
  'jupiter',   // Sagittarius
  'saturn',    // Capricorn
  'saturn',    // Aquarius
  'jupiter',   // Pisces
];

// ============================================================================
// DERIVATION FUNCTIONS
// ============================================================================

/**
 * Derive Burj (zodiac sign) from date of birth
 * Uses tropical zodiac
 */
export function deriveBurjFromDOB(dobISO: string): {
  burjAr: string;
  burjEn: string;
  burjIndex: number;
} | null {
  try {
    const date = new Date(dobISO);
    
    if (isNaN(date.getTime())) {
      return null;
    }
    
    const month = date.getMonth() + 1; // 1-12
    const day = date.getDate();
    
    // Find matching Burj
    for (let i = 0; i < BURJ_DATE_RANGES.length; i++) {
      const range = BURJ_DATE_RANGES[i];
      const [startMonth, startDay] = range.start;
      const [endMonth, endDay] = range.end;
      
      // Handle year-crossing signs (Capricorn)
      if (startMonth > endMonth) {
        // Dec-Jan range
        if (
          (month === startMonth && day >= startDay) ||
          (month === endMonth && day <= endDay)
        ) {
          return {
            burjAr: BURJ_NAMES_AR[i],
            burjEn: BURJ_NAMES_EN[i],
            burjIndex: i,
          };
        }
      } else {
        // Normal range
        if (
          (month === startMonth && day >= startDay) ||
          (month === endMonth && day <= endDay) ||
          (month > startMonth && month < endMonth)
        ) {
          return {
            burjAr: BURJ_NAMES_AR[i],
            burjEn: BURJ_NAMES_EN[i],
            burjIndex: i,
          };
        }
      }
    }
    
    return null;
    
  } catch (error) {
    if (__DEV__) {
      console.error('[ProfileDerivation] Error deriving Burj:', error);
    }
    return null;
  }
}

// ============================================================================
// INGRESS-AWARE BURJ RESOLUTION
// ============================================================================
//
// deriveBurjFromDOB() above ignores the fact that a birth date's local
// timezone is unknown. A calendar date spans a real-time window that varies
// with the widest plausible timezone spread; near a solar ingress, the Sun's
// sign can genuinely differ depending on where in that window the birth
// actually fell. resolveBurjWithIngressGuard() checks both extremes of that
// window and only claims certainty when they agree.
//
// Detection (is this window straddling an ingress?) and estimation (which
// single sign do we display when it's ambiguous?) are different questions,
// answered from different points: detection uses the full window's two
// extremes; the displayed estimate uses the CENTER of that same window,
// since most real-world timezones cluster near the middle of any offset
// range — the extremes (e.g. UTC+14) are the least likely case, not a
// reasonable default guess.
//
// This does not replace deriveBurjFromDOB — existing callers are unaffected.
// New/migrated callers that render sign-specific content as fact should use
// this instead.

/** A birth date is treated as ingress-adjacent if within this many days of a
 *  known sign-change boundary (the detection window's uncertainty plus a
 *  safety margin for the Sun's ~1°/day motion). */
const INGRESS_PROXIMITY_DAYS = 1;

/** Default detection window when no birth country is known: UTC-11 through
 *  UTC+12. Covers the vast majority of real-world births — the full
 *  UTC-12..+14 extreme range flags roughly 13% of all dates (anyone within
 *  ~2 days of any of the 12 ingresses); narrowing to the range that actually
 *  covers nearly all inhabited timezones cuts unnecessary ambiguity prompts
 *  substantially without meaningfully increasing missed ambiguity, since the
 *  excluded slivers (UTC+12.75..+14, UTC-12) are sparsely populated. */
const DEFAULT_MIN_OFFSET = -11;
const DEFAULT_MAX_OFFSET = 12;

export interface BurjCandidate {
  burjAr: string;
  burjEn: string;
  burjIndex: number;
}

export interface BurjResolution extends BurjCandidate {
  ambiguous: boolean;
  candidateSigns?: [BurjCandidate, BurjCandidate];
  resolvedVia: 'unambiguous-date' | 'birth-time' | 'birth-country' | 'unresolved-ambiguous';
}

export interface ResolveBurjParams {
  /** YYYY-MM-DD (or any ISO date string) — same input deriveBurjFromDOB takes. */
  dobISO: string;
  /** Optional "HH:mm", 24h, local to birthTimezone. Never defaulted — an
   *  absent value means "unknown", not noon. Takes priority over
   *  birthCountry when both are given (an exact time fully resolves the
   *  instant; a country only narrows a range). */
  birthTimeLocal?: string;
  /** IANA timezone, required together with birthTimeLocal. */
  birthTimezone?: string;
  /** Optional birth country name (must match a key in
   *  data/countryUtcOffsets.ts). Narrows the detection/estimation window to
   *  that country's UTC offset range — a much smaller ask than birth time,
   *  and often sufficient to resolve ambiguity entirely on its own. */
  birthCountry?: string;
}

/**
 * True if dobISO falls within INGRESS_PROXIMITY_DAYS of any sign-change
 * boundary in BURJ_DATE_RANGES. Pure calendar-date check, no network call.
 * This is a coarse pre-filter deciding whether any ephemeris call is needed
 * at all — the actual ambiguity determination happens in
 * resolveBurjWithIngressGuard() against the real window bounds.
 */
export function isNearIngress(dobISO: string): boolean {
  const date = new Date(dobISO);
  if (isNaN(date.getTime())) return false;

  const month = date.getMonth() + 1;
  const day = date.getDate();

  for (const range of BURJ_DATE_RANGES) {
    for (const [boundaryMonth, boundaryDay] of [range.start, range.end]) {
      if (isWithinDaysOfMonthDay(month, day, boundaryMonth, boundaryDay, INGRESS_PROXIMITY_DAYS)) {
        return true;
      }
    }
  }
  return false;
}

/** Day-of-year distance between (month,day) and (boundaryMonth,boundaryDay),
 *  treating the calendar as circular (Dec 31 -> Jan 1 is distance 1) and
 *  ignoring leap-year length differences (irrelevant at +/-1 day precision). */
function isWithinDaysOfMonthDay(
  month: number, day: number,
  boundaryMonth: number, boundaryDay: number,
  withinDays: number
): boolean {
  const REF_YEAR = 2001; // non-leap, arbitrary common reference
  const toDayOfYear = (m: number, d: number) => {
    const dt = new Date(Date.UTC(REF_YEAR, m - 1, d));
    const start = new Date(Date.UTC(REF_YEAR, 0, 1));
    return Math.round((dt.getTime() - start.getTime()) / 86400000);
  };
  const a = toDayOfYear(month, day);
  const b = toDayOfYear(boundaryMonth, boundaryDay);
  const daysInRefYear = 365;
  const rawDiff = Math.abs(a - b);
  const circularDiff = Math.min(rawDiff, daysInRefYear - rawDiff);
  return circularDiff <= withinDays;
}

interface IngressWindow {
  earliestUTC: Date;
  latestUTC: Date;
  centerUTC: Date;
}

/**
 * Build the detection/estimation window for a calendar date, optionally
 * narrowed to a country's UTC offset range. minOffsetHours/maxOffsetHours
 * default to the DEFAULT_MIN_OFFSET..DEFAULT_MAX_OFFSET range.
 */
function buildIngressWindowBoundsUTC(
  dobISO: string,
  minOffsetHours: number = DEFAULT_MIN_OFFSET,
  maxOffsetHours: number = DEFAULT_MAX_OFFSET
): IngressWindow {
  const date = new Date(dobISO);
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-indexed
  const day = date.getDate();

  const toMs = (offsetHours: number) => offsetHours * 3_600_000;

  // Earliest possible instant this calendar date could have started, at the
  // highest offset in range: local midnight, minus that offset.
  const earliestUTC = new Date(Date.UTC(year, month, day, 0, 0, 0) - toMs(maxOffsetHours));
  // Latest possible instant this calendar date could still be in progress,
  // at the lowest offset in range: local 23:59:59, minus that (negative or
  // smaller) offset.
  const latestUTC = new Date(Date.UTC(year, month, day, 23, 59, 59) - toMs(minOffsetHours));
  // Center of the plausible range — the best single estimate when the
  // window is ambiguous, since most real-world timezones cluster near the
  // middle of any offset range rather than at its extremes.
  const centerUTC = new Date((earliestUTC.getTime() + latestUTC.getTime()) / 2);

  return { earliestUTC, latestUTC, centerUTC };
}

function candidateFromSignIndex(signIndex: number): BurjCandidate {
  return {
    burjAr: BURJ_NAMES_AR[signIndex],
    burjEn: BURJ_NAMES_EN[signIndex],
    burjIndex: signIndex,
  };
}

/**
 * Resolve a birth date's Sun sign, accounting for timezone uncertainty near
 * ingress days. For the large majority of dates safely mid-sign, this
 * returns instantly with zero network calls and is byte-identical to
 * deriveBurjFromDOB. Near an ingress, it checks the Sun's actual ecliptic
 * longitude at both extremes of the detection window (narrowed by
 * birthCountry when given); if they disagree and no birth time was
 * supplied, it returns both candidates plus a best-guess estimate — never
 * presenting the estimate as confident.
 *
 * Detection and estimation are answered from different points in the same
 * window: detection uses both extremes; the displayed estimate uses the
 * window's center, not either extreme (the extremes are the least likely
 * real-world case, not a reasonable default).
 *
 * Never defaults an absent birth time to noon or any other value — absence
 * of a time either resolves unambiguously (the common case) or produces an
 * explicit ambiguous result the caller must handle.
 */
export async function resolveBurjWithIngressGuard(
  params: ResolveBurjParams
): Promise<BurjResolution | null> {
  const { dobISO, birthTimeLocal, birthTimezone, birthCountry } = params;

  const fallback = deriveBurjFromDOB(dobISO);
  if (!fallback) {
    return null;
  }

  if (!isNearIngress(dobISO)) {
    return { ...fallback, ambiguous: false, resolvedVia: 'unambiguous-date' };
  }

  // Lazy import: EphemerisService pulls in AsyncStorage/NetInfo/fetch, which
  // most callers of this file (and most callers of deriveBurjFromDOB) never
  // need. Avoids adding that weight to the majority network-free fast path above.
  const { getPlanetPositions } = await import('./EphemerisService');

  if (birthTimeLocal && birthTimezone) {
    const exactUTC = localTimeToUTC(dobISO, birthTimeLocal, birthTimezone);
    if (exactUTC) {
      const positions = await getPlanetPositions(exactUTC);
      const signIndex = positions?.planets.sun?.sign;
      if (typeof signIndex === 'number') {
        return { ...candidateFromSignIndex(signIndex), ambiguous: false, resolvedVia: 'birth-time' };
      }
    }
    // Ephemeris/timezone conversion failed — fall through to window-bound check.
  }

  // A birth country narrows the offset range but rarely to a single value —
  // still resolve it through the same window-bound-agreement check below
  // rather than assuming a single representative offset, since several
  // countries span multiple zones.
  const { getCountryOffsetRange } = await import('../data/countryUtcOffsets');
  const countryRange = birthCountry ? getCountryOffsetRange(birthCountry) : undefined;

  const { earliestUTC, latestUTC, centerUTC } = countryRange
    ? buildIngressWindowBoundsUTC(dobISO, countryRange.minOffset, countryRange.maxOffset)
    : buildIngressWindowBoundsUTC(dobISO);

  const [atEarliest, atLatest, atCenter] = await Promise.all([
    getPlanetPositions(earliestUTC),
    getPlanetPositions(latestUTC),
    getPlanetPositions(centerUTC),
  ]);

  const signAtEarliest = atEarliest?.planets.sun?.sign;
  const signAtLatest = atLatest?.planets.sun?.sign;
  const signAtCenter = atCenter?.planets.sun?.sign;

  if (typeof signAtEarliest !== 'number' || typeof signAtLatest !== 'number') {
    // Ephemeris unavailable (offline, etc.) — fall back to the calendar
    // table rather than failing the whole resolution.
    return { ...fallback, ambiguous: false, resolvedVia: 'unambiguous-date' };
  }

  if (signAtEarliest === signAtLatest) {
    return {
      ...candidateFromSignIndex(signAtEarliest),
      ambiguous: false,
      resolvedVia: countryRange ? 'birth-country' : 'unambiguous-date',
    };
  }

  const estimatedSign = typeof signAtCenter === 'number' ? signAtCenter : signAtEarliest;

  const candidateA = candidateFromSignIndex(signAtEarliest);
  const candidateB = candidateFromSignIndex(signAtLatest);
  return {
    // Best-guess estimate — the sign at the CENTER of the plausible window,
    // never one of the extremes — so callers that need *a* value don't
    // crash, but `ambiguous: true` means this value must not be presented
    // as confident.
    ...candidateFromSignIndex(estimatedSign),
    ambiguous: true,
    candidateSigns: [candidateA, candidateB],
    resolvedVia: 'unresolved-ambiguous',
  };
}

/**
 * Convert a local wall-clock time in an IANA timezone to a UTC Date, correct
 * for the specific historical date (handles DST). Returns null on failure —
 * callers must not substitute a default.
 */
function localTimeToUTC(dobISO: string, timeLocal: string, timezone: string): Date | null {
  try {
    const dateOnly = new Date(dobISO);
    const [hours, minutes] = timeLocal.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) return null;

    // Find the UTC instant whose wall-clock representation in `timezone`
    // matches the requested local date+time, via iterative correction
    // against Intl's timezone-aware formatting (handles DST correctly).
    const naiveUTC = Date.UTC(
      dateOnly.getFullYear(), dateOnly.getMonth(), dateOnly.getDate(), hours, minutes, 0
    );
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hourCycle: 'h23',
    });

    let guess = naiveUTC;
    for (let i = 0; i < 2; i++) {
      const parts = formatter.formatToParts(new Date(guess));
      const get = (type: string) => Number(parts.find(p => p.type === type)?.value);
      const asUTC = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second'));
      const offset = asUTC - guess;
      guess = naiveUTC - offset;
    }
    return new Date(guess);
  } catch {
    return null;
  }
}

/**
 * Derive element from Burj index
 */
export function deriveElementFromBurj(burjIndex: number): Element {
  if (burjIndex < 0 || burjIndex >= BURJ_ELEMENTS.length) {
    return 'fire'; // Default fallback
  }
  
  return BURJ_ELEMENTS[burjIndex];
}

/**
 * Derive planetary ruler from Burj index
 */
export function derivePlanetaryRulerFromBurj(burjIndex: number): string {
  if (burjIndex < 0 || burjIndex >= BURJ_PLANETARY_RULERS.length) {
    return 'sun'; // Default fallback
  }
  
  return BURJ_PLANETARY_RULERS[burjIndex];
}

/**
 * Calculate Manazil baseline from DOB
 * Manazil = 28 lunar mansions
 * Baseline helps align Divine Timing calculations
 */
export function calculateManazilBaseline(dobISO: string): number {
  try {
    const date = new Date(dobISO);
    
    if (isNaN(date.getTime())) {
      return 0;
    }
    
    // Calculate days since epoch
    const epochStart = new Date('2000-01-01').getTime();
    const dobTime = date.getTime();
    const daysSinceEpoch = Math.floor((dobTime - epochStart) / (24 * 60 * 60 * 1000));
    
    // Map to Manazil (28 lunar mansions)
    // Full cycle = ~27.321661 days (sidereal month)
    const siderealMonthDays = 27.321661;
    const cyclePosition = ((daysSinceEpoch % siderealMonthDays) + siderealMonthDays) % siderealMonthDays;
    const rawIndex = Math.floor((cyclePosition / siderealMonthDays) * 28);
    const normalizedIndex = normalizeMansionIndex(rawIndex);
    
    return normalizedIndex ?? 0;
    
  } catch (error) {
    if (__DEV__) {
      console.error('[ProfileDerivation] Error calculating Manazil:', error);
    }
    return 0;
  }
}

/**
 * Calculate personal Manazil index from Arabic name + optional mother's name.
 *
 * Mapping:
 * - Compute Kabir total for (name + mother)
 * - Map into 1..28 via (kabir % 28, with 0 -> 28)
 * - Convert to 0..27 index used by `data/lunarMansions`
 */
export function calculateManazilPersonalFromNames(nameAr: string, motherName?: string): number | null {
  const normalizedName = normalizeArabic(nameAr);
  if (!normalizedName) return null;

  const normalizedMother = normalizeArabic(motherName ?? '');
  const kabir =
    calculateHadadKabir(normalizedName) + (normalizedMother ? calculateHadadKabir(normalizedMother) : 0);

  // Convert 1..28 mapping to 0..27 index.
  return normalizeMansionIndex(kabir - 1);
}

/**
 * Derive all astrological data from user profile
 * Main function used by ProfileContext
 */
export async function deriveAstrologicalData(
  profile: UserProfile
): Promise<DerivedAstrologicalData | null> {
  try {
    const derived: DerivedAstrologicalData = {};

    // DOB-derived fields
    if (profile.dobISO) {
      const burjData = await resolveBurjWithIngressGuard({
        dobISO: profile.dobISO,
        birthTimeLocal: profile.birthTime,
        birthTimezone: profile.timezone,
      });
      if (burjData) {
        derived.burj = burjData.burjAr;
        derived.burjIndex = burjData.burjIndex;
        derived.element = deriveElementFromBurj(burjData.burjIndex);
        const planetaryRuler = derivePlanetaryRulerFromBurj(burjData.burjIndex);
        derived.planetaryRuler = planetaryRuler as any;
        derived.manazilBaseline = calculateManazilBaseline(profile.dobISO);
        derived.burjAmbiguous = burjData.ambiguous;
        derived.burjCandidates = burjData.candidateSigns;
      }
    }

    // Name-derived personal Manazil
    if (profile.nameAr) {
      const personal = calculateManazilPersonalFromNames(profile.nameAr, profile.motherName);
      if (typeof personal === 'number') {
        derived.manazilPersonal = personal;
      }
    }

    // Ascendant (requires DOB + time + location + timezone)
    // Prefer birthLocation if provided; fall back to current location for backward compatibility.
    const ascendantLocation = profile.birthLocation ?? profile.location;
    if (profile.dobISO && profile.birthTime && ascendantLocation && profile.timezone) {
      const asc = calculateAscendantSync(profile.dobISO, profile.birthTime, profile.timezone, ascendantLocation);
      if (asc) {
        derived.ascendantBurj = asc.burjAr;
        derived.ascendantBurjEn = asc.burjEn;
        derived.ascendantBurjIndex = asc.burjIndex;
        derived.ascendantDegree = asc.degree;
        derived.ascendantElement = deriveElementFromBurj(asc.burjIndex);
      }
    }

    return Object.keys(derived).length > 0 ? derived : null;
  } catch (error) {
    if (__DEV__) {
      console.error('[ProfileDerivation] Error deriving astrological data:', error);
    }
    return null;
  }
}

/**
 * Update user profile with derived data
 * Call this after DOB changes
 */
export async function updateProfileWithDerivedData(
  profile: UserProfile
): Promise<UserProfile> {
  const derived = await deriveAstrologicalData(profile);

  return {
    ...profile,
    derived: derived || undefined,
    updatedAt: Date.now(),
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get element description in Arabic
 */
export function getElementNameAr(element: Element): string {
  const elementNames: Record<Element, string> = {
    fire: 'النار',
    earth: 'التراب',
    air: 'الهواء',
    water: 'الماء',
  };
  
  return elementNames[element];
}

/**
 * Get element characteristics
 */
export function getElementCharacteristics(element: Element): {
  quality: string;
  temperament: string;
  energy: string;
} {
  const characteristics: Record<Element, {
    quality: string;
    temperament: string;
    energy: string;
  }> = {
    fire: {
      quality: 'Active, Dynamic',
      temperament: 'Hot & Dry',
      energy: 'Yang (Masculine)',
    },
    earth: {
      quality: 'Stable, Grounded',
      temperament: 'Cold & Dry',
      energy: 'Yin (Feminine)',
    },
    air: {
      quality: 'Mental, Social',
      temperament: 'Hot & Moist',
      energy: 'Yang (Masculine)',
    },
    water: {
      quality: 'Emotional, Intuitive',
      temperament: 'Cold & Moist',
      energy: 'Yin (Feminine)',
    },
  };
  
  return characteristics[element];
}

/**
 * Get planetary attributes
 */
export function getPlanetaryAttributes(planet: string): {
  arabicName: string;
  influence: string;
  quality: string;
} {
  const attributes: Record<string, {
    arabicName: string;
    influence: string;
    quality: string;
  }> = {
    Sun: {
      arabicName: 'الشمس',
      influence: 'Vitality, Leadership',
      quality: 'Hot & Dry',
    },
    Moon: {
      arabicName: 'القمر',
      influence: 'Emotions, Intuition',
      quality: 'Cold & Moist',
    },
    Mercury: {
      arabicName: 'عطارد',
      influence: 'Communication, Mind',
      quality: 'Variable',
    },
    Venus: {
      arabicName: 'الزهرة',
      influence: 'Love, Beauty',
      quality: 'Cold & Moist',
    },
    Mars: {
      arabicName: 'المريخ',
      influence: 'Action, Courage',
      quality: 'Hot & Dry',
    },
    Jupiter: {
      arabicName: 'المشتري',
      influence: 'Growth, Wisdom',
      quality: 'Hot & Moist',
    },
    Saturn: {
      arabicName: 'زحل',
      influence: 'Structure, Discipline',
      quality: 'Cold & Dry',
    },
  };
  
  return attributes[planet] || {
    arabicName: planet,
    influence: 'Unknown',
    quality: 'Unknown',
  };
}

/**
 * Check if two Burjs are compatible
 * Based on element harmony
 * 
 * SPECIAL CASES:
 * - Scorpio (index 7) is Mars-ruled water, compatible with fire signs
 * - Aquarius (index 10) is Saturn-ruled cold air, less challenging with water
 */
export function checkBurjCompatibility(
  burjIndex1: number,
  burjIndex2: number
): {
  compatible: boolean;
  reason: string;
  reasonKey: 'scorpioFire' | 'aquariusWater' | 'sameElement' | 'fireAir' | 'earthWater' | 'fireWater' | 'earthAir' | 'neutral';
  harmonyScore: number;
} {
  const element1 = deriveElementFromBurj(burjIndex1);
  const element2 = deriveElementFromBurj(burjIndex2);
  
  // Sign indices for special cases
  const SCORPIO_INDEX = 7;
  const AQUARIUS_INDEX = 10;
  const FIRE_INDICES = [0, 4, 8]; // Aries, Leo, Sagittarius
  const WATER_INDICES = [3, 7, 11]; // Cancer, Scorpio, Pisces
  
  // SCORPIO SPECIAL CASE: Mars-ruled water shares fire's intensity
  const isScorpioWithFire = 
    (burjIndex1 === SCORPIO_INDEX && FIRE_INDICES.includes(burjIndex2)) ||
    (burjIndex2 === SCORPIO_INDEX && FIRE_INDICES.includes(burjIndex1));
  
  if (isScorpioWithFire) {
    return {
      compatible: true,
      reason: 'Scorpio & Fire - Mars-fueled passion',
      reasonKey: 'scorpioFire',
      harmonyScore: 75,
    };
  }
  
  // AQUARIUS SPECIAL CASE: Saturn-ruled cold air is less challenging with water
  const isAquariusWithWater = 
    (burjIndex1 === AQUARIUS_INDEX && WATER_INDICES.includes(burjIndex2)) ||
    (burjIndex2 === AQUARIUS_INDEX && WATER_INDICES.includes(burjIndex1));
  
  if (isAquariusWithWater) {
    return {
      compatible: true,
      reason: 'Aquarius & Water - shared coolness',
      reasonKey: 'aquariusWater',
      harmonyScore: 60,
    };
  }

  // Same element = high compatibility
  if (element1 === element2) {
    return {
      compatible: true,
      reason: 'Same element - natural understanding',
      reasonKey: 'sameElement',
      harmonyScore: 85,
    };
  }

  // Fire + Air = compatible
  if ((element1 === 'fire' && element2 === 'air') ||
      (element1 === 'air' && element2 === 'fire')) {
    return {
      compatible: true,
      reason: 'Fire & Air - mutual support',
      reasonKey: 'fireAir',
      harmonyScore: 75,
    };
  }

  // Earth + Water = compatible
  if ((element1 === 'earth' && element2 === 'water') ||
      (element1 === 'water' && element2 === 'earth')) {
    return {
      compatible: true,
      reason: 'Earth & Water - mutual growth',
      reasonKey: 'earthWater',
      harmonyScore: 75,
    };
  }

  // Fire + Water = challenging
  if ((element1 === 'fire' && element2 === 'water') ||
      (element1 === 'water' && element2 === 'fire')) {
    return {
      compatible: false,
      reason: 'Fire & Water - requires balance',
      reasonKey: 'fireWater',
      harmonyScore: 40,
    };
  }

  // Earth + Air = challenging
  if ((element1 === 'earth' && element2 === 'air') ||
      (element1 === 'air' && element2 === 'earth')) {
    return {
      compatible: false,
      reason: 'Earth & Air - different perspectives',
      reasonKey: 'earthAir',
      harmonyScore: 45,
    };
  }

  // Default = neutral
  return {
    compatible: true,
    reason: 'Neutral elements',
    reasonKey: 'neutral',
    harmonyScore: 60,
  };
}
