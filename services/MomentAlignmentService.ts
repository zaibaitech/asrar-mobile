/**
 * Moment Alignment Service (Ẓāhir)
 * ===================================
 * Real-time alignment between user's element (name + mother's name when available)
 * and current PLANETARY HOUR element.
 * 
 * DISTINCTION FROM DAILY GUIDANCE:
 * - Daily Guidance: Day-level guidance
 * - Moment Alignment: Hour-level alignment (planetary hours)
 * 
 * Uses traditional planetary hour calculations (Sā'āt al-Kawākib) following
 * the Chaldean order: Saturn → Jupiter → Mars → Sun → Venus → Mercury → Moon
 * 
 * Element Mapping (matching app's existing variant):
 * - Remainder 1 => Fire
 * - Remainder 2 => Earth
 * - Remainder 3 => Air
 * - Remainder 0 (4) => Water
 */

import type { ElementType } from '@/contexts/ThemeContext';
import type { CalculationMethod } from '@/services/api/prayerTimes';
import { UserProfile } from '@/types/user-profile';
import { calculateHadadKabir, calculateTabElement, normalizeArabic } from '@/utils/coreCalculations';
import { getCurrentPlanetaryHour as getSimplifiedPlanetaryHour, getPlanetElement as getSimplifiedPlanetElement, type Planet as SimplifiedPlanet } from './DayBlessingService';
import {
    getPlanetaryDayBoundariesForNow,
    preCalculateDailyPlanetaryHours,
    type Planet,
} from './PlanetaryHoursService';
import { analyzeCosmicQuality, type CosmicQuality } from './CosmicQualityService';
import { getPlanetaryCondition, type PlanetaryCondition } from './PlanetaryConditionService';

export type Element = ElementType;
export type AlignmentStatus = 'ACT' | 'MAINTAIN' | 'HOLD';

export function getAlignmentStatusForElements(zahirElement: Element, timeElement: Element): AlignmentStatus {
  return computeAlignmentStatus(zahirElement, timeElement);
}

export interface TimeWindow {
  element: Element;
  startTime: Date;
  endTime: Date;
  status: AlignmentStatus;
  planet: Planet;
  planetArabic: string;
  hourNumber: number;
  isCurrentHour: boolean;
}

export interface MomentAlignment {
  /** User element (name + mother when available; falls back to name only) */
  zahirElement: Element;
  
  /** Current time element */
  timeElement: Element;
  
  /** Alignment status */
  status: AlignmentStatus;
  
  /** i18n key for short status label */
  shortLabelKey: string;
  
  /** i18n key for short hint text */
  shortHintKey: string;
  
  /** Timestamp of calculation */
  updatedAt: string;
  
  /** Current window end time */
  currentWindowEnd?: Date;
  
  /** Next optimal windows (next 24 hours) */
  nextWindows?: TimeWindow[];
  
  /** TIER 1: Objective cosmic quality (universal - same for all users) */
  cosmicQuality?: CosmicQuality;
  
  /** Current hour ruler planetary condition */
  hourRulerCondition?: PlanetaryCondition;
  
  /** Enhanced status reasoning (multi-language) */
  reasoning?: {
    en: string;
    ar: string;
    fr: string;
  };
}

/**
 * Map ElementType to Element (they're the same, just for type compatibility)
 */
function elementTypeToElement(el: ElementType): Element {
  // ElementType is already lowercase
  return el;
}

/**
 * Map element index (1-4) to ElementType
 */
function indexToElement(index: 1 | 2 | 3 | 4): Element {
  const mapping: Record<1 | 2 | 3 | 4, Element> = {
    1: 'fire',
    2: 'earth',
    3: 'air',
    4: 'water',
  };
  return mapping[index];
}

/**
 * Compute user element from name + mother's name (if provided).
 * Uses the same Abjad calculation and element mapping as the rest of the app.
 * 
 * @param name - User's name (will be normalized automatically)
 * @param motherName - Mother's name (optional; will be normalized automatically)
 * @returns Element derived from name only
 */
export function computeZahirElement(name: string, motherName: string = ''): Element {
  const normalizedName = normalizeArabic(name);
  const normalizedMother = normalizeArabic(motherName);
  const kabir =
    calculateHadadKabir(normalizedName) +
    (normalizedMother ? calculateHadadKabir(normalizedMother) : 0);
  const elementIndex = calculateTabElement(kabir);
  return indexToElement(elementIndex);
}

/**
 * Get current time element based on PLANETARY HOUR
 * Uses traditional Chaldean order planetary hour calculations
 * 
 * @param now - Current date/time (optional, defaults to now)
 * @returns Current planetary hour element
 */
export function getCurrentTimeElement(now: Date = new Date()): Element {
  // Backwards-compatible fallback when no location context is available.
  const planetaryHour = getSimplifiedPlanetaryHour(now);
  const planetElement = getSimplifiedPlanetElement(planetaryHour.planet as unknown as SimplifiedPlanet);
  return elementTypeToElement(planetElement);
}

/**
 * Calculate when current planetary hour ends
 * Simplified: each hour runs for 1 clock hour
 */
function getNextHourTransition(now: Date): Date {
  const nextHour = new Date(now);
  nextHour.setHours(nextHour.getHours() + 1);
  nextHour.setMinutes(0, 0, 0);
  return nextHour;
}

/**
 * Get the next N planetary hours and their elements
 * @param now - Current time
 * @param hours - Number of hours to look ahead (default 24)
 */
function getUpcomingPlanetaryHours(now: Date, hours: number = 24): TimeWindow[] {
  const windows: TimeWindow[] = [];
  
  for (let i = 0; i < hours; i++) {
    const startTime = new Date(now);
    startTime.setHours(startTime.getHours() + i);
    startTime.setMinutes(0, 0, 0);
    
    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + 1);
    
    const planetaryHour = getSimplifiedPlanetaryHour(startTime);
    const planetElement = getSimplifiedPlanetElement(planetaryHour.planet as unknown as SimplifiedPlanet);
    const element = elementTypeToElement(planetElement);
    
    windows.push({
      element,
      startTime,
      endTime,
      status: 'ACT', // Will be calculated based on user element
      planet: planetaryHour.planet as unknown as Planet,
      planetArabic: planetaryHour.planetArabic,
      hourNumber: i + 1,
      isCurrentHour: i === 0,
    });
  }
  
  return windows;
}

async function getUpcomingPlanetaryHourWindowsAccurate(
  now: Date,
  location: { latitude: number; longitude: number },
  method: CalculationMethod = 3,
  lookAheadHours: number = 24
): Promise<{ currentWindowEnd?: Date; timeElement?: Element; windows: TimeWindow[] }> {
  const boundaries = await getPlanetaryDayBoundariesForNow(location, { now, method });
  if (!boundaries) {
    return { currentWindowEnd: undefined, timeElement: undefined, windows: [] };
  }

  const cacheToday = await preCalculateDailyPlanetaryHours(boundaries.sunrise, boundaries.sunset, boundaries.nextSunrise);
  if (!cacheToday) {
    return { currentWindowEnd: undefined, timeElement: undefined, windows: [] };
  }

  // Determine current hour index from cached hours.
  let currentIndex = 0;
  for (let i = 0; i < cacheToday.hours.length; i++) {
    const hour = cacheToday.hours[i];
    const start = new Date(hour.startTime);
    const end = new Date(hour.endTime);
    if (now >= start && now < end) {
      currentIndex = i;
      break;
    }
  }

  const currentHour = cacheToday.hours[currentIndex];
  const currentWindowEnd = new Date(currentHour.endTime);
  const timeElement = currentHour.planetInfo.element;

  // Pre-calc next planetary day so we can return a true 24h look-ahead.
  const nextDayNow = new Date(boundaries.nextSunrise.getTime() + 60_000);
  const nextBoundaries = await getPlanetaryDayBoundariesForNow(location, { now: nextDayNow, method });
  const cacheNext = nextBoundaries
    ? await preCalculateDailyPlanetaryHours(nextBoundaries.sunrise, nextBoundaries.sunset, nextBoundaries.nextSunrise)
    : null;

  const combinedHours = cacheNext ? [...cacheToday.hours, ...cacheNext.hours] : [...cacheToday.hours];
  const slice = combinedHours.slice(currentIndex, currentIndex + Math.max(1, lookAheadHours));

  const windows: TimeWindow[] = slice.map((h, idx) => ({
    element: h.planetInfo.element,
    startTime: new Date(h.startTime),
    endTime: new Date(h.endTime),
    status: 'ACT',
    planet: h.planet,
    planetArabic: h.planetInfo.arabicName,
    hourNumber: idx + 1,
    isCurrentHour: idx === 0,
  }));

  return { currentWindowEnd, timeElement, windows };
}

/**
 * Find next optimal planetary hours for user's element
 * @param userElement - User's Ẓāhir element
 * @param now - Current time
 * @param lookAheadHours - How many hours to look ahead (default 24)
 */
export function getNextOptimalWindows(
  userElement: Element,
  now: Date = new Date(),
  lookAheadHours: number = 24
): TimeWindow[] {
  const allWindows = getUpcomingPlanetaryHours(now, lookAheadHours);
  
  // Calculate status for each window based on user element
  return allWindows.map(window => ({
    ...window,
    status: computeAlignmentStatus(userElement, window.element),
  })).filter((window, index) => {
    // Skip current hour if we're past the start
    if (index === 0 && window.startTime < now) {
      return window.endTime > now; // Only include if still in current hour
    }
    return true;
  });
}

/**
 * Determine alignment status based on element compatibility
 * 
 * Rules:
 * - Same element => ACT (perfect alignment)
 * - Compatible pair => MAINTAIN (supportive flow)
 * - All others => HOLD (not aligned)
 * 
 * Compatibility Matrix:
 * - Fire ↔ Air (active/yang pair)
 * - Earth ↔ Water (receptive/yin pair)
 */
function computeAlignmentStatus(zahirElement: Element, timeElement: Element): AlignmentStatus {
  // Normalize for case-insensitive comparison
  const userEl = zahirElement.toLowerCase();
  const timeEl = timeElement.toLowerCase();
  
  // Perfect alignment
  if (userEl === timeEl) {
    return 'ACT';
  }
  
  // Supportive pairs
  const supportiveMap: Record<string, string> = {
    fire: 'air',
    air: 'fire',
    earth: 'water',
    water: 'earth',
  };

  if (supportiveMap[userEl] === timeEl) {
    return 'MAINTAIN';
  }

  // Challenging (oppositions)
  const challenging =
    (userEl === 'fire' && timeEl === 'water') ||
    (userEl === 'water' && timeEl === 'fire') ||
    (userEl === 'earth' && timeEl === 'air') ||
    (userEl === 'air' && timeEl === 'earth');

  if (challenging) {
    return 'HOLD';
  }

  // Neutral defaults to MAINTAIN (steady/neutral window)
  return 'MAINTAIN';
}

/**
 * Compute complete moment alignment for the user
 * 
 * @param profile - User profile (optional, for getting stored name)
 * @param now - Current time (optional, for testing)
 * @returns MomentAlignment or null if user has no name
 */
export async function getMomentAlignment(
  profile?: UserProfile,
  now: Date = new Date(),
  options?: { location?: { latitude: number; longitude: number }; method?: CalculationMethod }
): Promise<MomentAlignment | null> {
  // Check if user has a name
  const userName = profile?.nameAr || profile?.nameLatin;
  if (!userName || userName.trim().length === 0) {
    return null;
  }

  const motherName = profile?.motherName || '';
  
  // Compute user element (name + mother when available; falls back to name only)
  const zahirElement = computeZahirElement(userName, motherName);

  // Prefer accurate planetary-hour element when we have a location.
  const location = options?.location ?? profile?.location;
  const method = options?.method ?? 3;

  let timeElement: Element = getCurrentTimeElement(now);
  let currentWindowEnd: Date | undefined = getNextHourTransition(now);
  let nextWindows: TimeWindow[] | undefined = getNextOptimalWindows(zahirElement, now, 24);

  if (location?.latitude != null && location?.longitude != null) {
    const resolved = await getUpcomingPlanetaryHourWindowsAccurate(
      now,
      { latitude: location.latitude, longitude: location.longitude },
      method,
      24
    );
    if (resolved.timeElement) {
      timeElement = resolved.timeElement;
      currentWindowEnd = resolved.currentWindowEnd;
      nextWindows = resolved.windows
        .map(w => ({ ...w, status: computeAlignmentStatus(zahirElement, w.element) }))
        .filter(w => w.endTime > now);
    }
  }
  
  // ========================================
  // TIER 1: OBJECTIVE COSMIC QUALITY
  // ========================================
  // Analyze cosmic conditions independent of user
  let cosmicQuality: CosmicQuality | undefined;
  let hourRulerCondition: PlanetaryCondition | undefined;
  
  if (location?.latitude != null && location?.longitude != null) {
    try {
      cosmicQuality = await analyzeCosmicQuality(now, {
        latitude: location.latitude,
        longitude: location.longitude,
      });
      
      // Get detailed hour ruler condition
      if (cosmicQuality?.hourRuler?.planet) {
        hourRulerCondition = cosmicQuality.hourRuler.condition;
      }
    } catch (error) {
      console.warn('[MomentAlignment] Failed to analyze cosmic quality:', error);
      // Continue without cosmic quality data (graceful degradation)
    }
  }
  
  // Compute alignment status (basic elemental matching)
  const status = computeAlignmentStatus(zahirElement, timeElement);
  
  // ========================================
  // ENHANCED STATUS OVERRIDE LOGIC
  // ========================================
  // If cosmic quality indicates forbidden moment, override status to HOLD
  let finalStatus = status;
  if (cosmicQuality?.ruling === 'forbidden') {
    finalStatus = 'HOLD';
  }
  
  // Map status to i18n keys
  const labelKeys: Record<AlignmentStatus, string> = {
    ACT: 'home.moment.status.act',
    MAINTAIN: 'home.moment.status.maintain',
    HOLD: 'home.moment.status.hold',
  };
  
  const hintKeys: Record<AlignmentStatus, string> = {
    ACT: 'home.moment.hint.act',
    MAINTAIN: 'home.moment.hint.maintain',
    HOLD: 'home.moment.hint.hold',
  };
  
  // ========================================
  // GENERATE ENHANCED REASONING
  // ========================================
  const reasoning = generateEnhancedReasoning(
    zahirElement,
    timeElement,
    finalStatus,
    cosmicQuality,
    hourRulerCondition
  );
  
  return {
    zahirElement,
    timeElement,
    status: finalStatus,
    shortLabelKey: labelKeys[finalStatus],
    shortHintKey: hintKeys[finalStatus],
    updatedAt: now.toISOString(),
    currentWindowEnd,
    nextWindows,
    cosmicQuality,
    hourRulerCondition,
    reasoning,
  };
}

/**
 * Generate enhanced multi-language reasoning combining elemental + cosmic analysis
 */
function generateEnhancedReasoning(
  zahirElement: Element,
  timeElement: Element,
  status: AlignmentStatus,
  cosmicQuality?: CosmicQuality,
  hourRulerCondition?: PlanetaryCondition
): { en: string; ar: string; fr: string } {
  // Base reasoning from elemental matching
  const elementalMatch = zahirElement === timeElement ? 'perfect' : 
    (status === 'MAINTAIN' ? 'supportive' : 'challenging');
  
  const baseEn = `Your ${zahirElement} nature with ${timeElement} hour: ${elementalMatch} alignment.`;
  const baseAr = `طبيعتك (${getElementArabic(zahirElement)}) مع ساعة (${getElementArabic(timeElement)}): توافق ${getAlignmentArabic(elementalMatch)}.`;
  const baseFr = `Votre nature ${getElementFrench(zahirElement)} avec heure ${getElementFrench(timeElement)}: alignement ${getAlignmentFrench(elementalMatch)}.`;
  
  // If no cosmic data, return base reasoning
  if (!cosmicQuality) {
    return { en: baseEn, ar: baseAr, fr: baseFr };
  }
  
  // Enhanced reasoning with cosmic quality
  const cosmicEn = ` Cosmic quality: ${cosmicQuality.ruling}${hourRulerCondition ? ` (${hourRulerCondition.ruling})` : ''}.`;
  const cosmicAr = ` الجودة الكونية: ${getCosmicRulingArabic(cosmicQuality.ruling)}${hourRulerCondition ? ` (${hourRulerCondition.summary.ar.split('.')[0]})` : ''}.`;
  const cosmicFr = ` Qualité cosmique: ${getCosmicRulingFrench(cosmicQuality.ruling)}${hourRulerCondition ? ` (${hourRulerCondition.ruling})` : ''}.`;
  
  return {
    en: baseEn + cosmicEn,
    ar: baseAr + cosmicAr,
    fr: baseFr + cosmicFr,
  };
}

// Helper functions for translations
function getElementArabic(element: Element): string {
  const map: Record<Element, string> = {
    fire: 'نار',
    earth: 'تراب',
    air: 'هواء',
    water: 'ماء',
  };
  return map[element] || element;
}

function getElementFrench(element: Element): string {
  const map: Record<Element, string> = {
    fire: 'Feu',
    earth: 'Terre',
    air: 'Air',
    water: 'Eau',
  };
  return map[element] || element;
}

function getAlignmentArabic(alignment: string): string {
  const map: Record<string, string> = {
    perfect: 'مثالي',
    supportive: 'داعم',
    challenging: 'صعب',
  };
  return map[alignment] || alignment;
}

function getAlignmentFrench(alignment: string): string {
  const map: Record<string, string> = {
    perfect: 'parfait',
    supportive: 'favorable',
    challenging: 'difficile',
  };
  return map[alignment] || alignment;
}

function getCosmicRulingArabic(ruling: string): string {
  const map: Record<string, string> = {
    baraka: 'مبارك',
    neutral: 'عادي',
    makruh: 'مكروه',
    forbidden: 'محظور',
  };
  return map[ruling] || ruling;
}

function getCosmicRulingFrench(ruling: string): string {
  const map: Record<string, string> = {
    baraka: 'béni',
    neutral: 'neutre',
    makruh: 'déconseillé',
    forbidden: 'interdit',
  };
  return map[ruling] || ruling;
}

/**
 * Dev/Test helper: Validate element mapping with known values
 * This can be called in development to verify the mapping matches expectations
 */
export function testElementMapping(): void {
  if (!__DEV__) return;
  
  // Test known values
  const testCases = [
    { input: 'محمد', expectedElement: 'water' as Element }, // Adjust based on actual calculation
    // Add more test cases as needed
  ];
  
  console.log('[MomentAlignment] Element Mapping Tests:');
  testCases.forEach(({ input, expectedElement }) => {
    const result = computeZahirElement(input);
    const match = result === expectedElement ? '✅' : '❌';
    console.log(`  ${match} "${input}" => ${result} (expected: ${expectedElement})`);
  });
  
  // Test alignment statuses
  console.log('\n[MomentAlignment] Alignment Status Tests:');
  console.log('  Fire + Fire => ACT:', computeAlignmentStatus('fire', 'fire'));
  console.log('  Fire + Air => MAINTAIN:', computeAlignmentStatus('fire', 'air'));
  console.log('  Fire + Water => HOLD:', computeAlignmentStatus('fire', 'water'));
  console.log('  Earth + Water => MAINTAIN:', computeAlignmentStatus('earth', 'water'));
  console.log('  Air + Earth => HOLD:', computeAlignmentStatus('air', 'earth'));
}
