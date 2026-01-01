/**
 * Moment Alignment Service (Ẓāhir)
 * ===================================
 * Real-time alignment between user's Ẓāhir element (name only)
 * and current PLANETARY HOUR element.
 * 
 * DISTINCTION FROM DAILY GUIDANCE:
 * - Daily Guidance: Uses Bāṭin element (name + mother) for DAILY FLOW (day-level)
 * - Moment Alignment: Uses Ẓāhir element (name only) for HOURLY alignment (planetary hours)
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
import { UserProfile } from '@/types/user-profile';
import { calculateHadadKabir, calculateTabElement, normalizeArabic } from '@/utils/coreCalculations';
import { getCurrentPlanetaryHour, getPlanetElement, type Planet } from './DayBlessingService';

export type Element = ElementType;
export type AlignmentStatus = 'ACT' | 'MAINTAIN' | 'HOLD';

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
  /** User's Ẓāhir element (name only) */
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
 * Compute Ẓāhir element from user's name ONLY (not including mother's name)
 * Uses the same Abjad calculation and element mapping as the rest of the app.
 * 
 * @param name - User's name (will be normalized automatically)
 * @returns Element derived from name only
 */
export function computeZahirElement(name: string): Element {
  const normalized = normalizeArabic(name);
  const kabir = calculateHadadKabir(normalized);
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
  const planetaryHour = getCurrentPlanetaryHour(now);
  const planetElement = getPlanetElement(planetaryHour.planet);
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
    
    const planetaryHour = getCurrentPlanetaryHour(startTime);
    const planetElement = getPlanetElement(planetaryHour.planet);
    const element = elementTypeToElement(planetElement);
    
    windows.push({
      element,
      startTime,
      endTime,
      status: 'ACT', // Will be calculated based on user element
      planet: planetaryHour.planet,
      planetArabic: planetaryHour.planetArabic,
      hourNumber: i + 1,
      isCurrentHour: i === 0,
    });
  }
  
  return windows;
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
  
  // Compatible pairs
  const compatibilityMap: Record<string, string> = {
    fire: 'air',
    air: 'fire',
    earth: 'water',
    water: 'earth',
  };
  
  if (compatibilityMap[userEl] === timeEl) {
    return 'MAINTAIN';
  }
  
  // Not aligned
  return 'HOLD';
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
  now: Date = new Date()
): Promise<MomentAlignment | null> {
  // Check if user has a name
  const userName = profile?.nameAr || profile?.nameLatin;
  if (!userName || userName.trim().length === 0) {
    return null;
  }
  
  // Compute Ẓāhir element (name only)
  const zahirElement = computeZahirElement(userName);
  
  // Get current time element
  const timeElement = getCurrentTimeElement(now);
  
  // Compute alignment status
  const status = computeAlignmentStatus(zahirElement, timeElement);
  
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
  
  // Get next hour transition (current window end)
  const currentWindowEnd = getNextHourTransition(now);
  
  // Get upcoming optimal planetary hours (next 24 hours)
  const nextWindows = getNextOptimalWindows(zahirElement, now, 24);
  
  return {
    zahirElement,
    timeElement,
    status,
    shortLabelKey: labelKeys[status],
    shortHintKey: hintKeys[status],
    updatedAt: now.toISOString(),
    currentWindowEnd,
    nextWindows,
  };
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
