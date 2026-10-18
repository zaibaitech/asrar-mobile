/**
 * Server-side Abjad Maps
 * Extracted from client contexts for use in API routes
 *
 * ABJAD_MAGHRIBI uses the true Maghribi (Western / North-African) values,
 * which differ from the Mashriqi (Eastern) table in six letters only:
 *
 *   letter   Maghribi   Mashriqi
 *   ص          60          90
 *   ض          90         800
 *   س         300          60
 *   ظ         800         900
 *   غ         900        1000
 *   ش        1000         300
 *
 * Sources: Wikipedia "Abjad numerals" (Maghrebi order, citing Macdonald 1986),
 * German Wikipedia "Abdschad", Encyclopaedia Iranica "Abjad" (Krotkoff).
 * Cross-check: the Basmala totals 786 (Mashriqi) and 1026 (Maghribi).
 *
 * Letter forms (same rule in both tables, identical to the asrar.app web
 * table in src/lib/abjad-maps.ts):
 *   أ إ آ = 1 (alif), ؤ = 6 (wāw), ئ and ى = 10 (yāʾ), ة = 5 (hāʾ);
 *   a bare hamza ء is not counted (0).
 */

export const ABJAD_MAGHRIBI: Record<string, number> = {
  'ا': 1, 'أ': 1, 'إ': 1, 'آ': 1,
  'ب': 2,
  'ج': 3,
  'د': 4,
  'ه': 5, 'ة': 5,
  'و': 6, 'ؤ': 6,
  'ز': 7,
  'ح': 8,
  'ط': 9,
  'ي': 10, 'ى': 10, 'ئ': 10,
  'ك': 20,
  'ل': 30,
  'م': 40,
  'ن': 50,
  'ص': 60,
  'ع': 70,
  'ف': 80,
  'ض': 90,
  'ق': 100,
  'ر': 200,
  'س': 300,
  'ت': 400,
  'ث': 500,
  'خ': 600,
  'ذ': 700,
  'ظ': 800,
  'غ': 900,
  'ش': 1000
};

export const ABJAD_MASHRIQI: Record<string, number> = {
  'ا': 1, 'أ': 1, 'إ': 1, 'آ': 1,
  'ب': 2,
  'ج': 3,
  'د': 4,
  'ه': 5, 'ة': 5,
  'و': 6, 'ؤ': 6,
  'ز': 7,
  'ح': 8,
  'ط': 9,
  'ي': 10, 'ى': 10, 'ئ': 10,
  'ك': 20,
  'ل': 30,
  'م': 40,
  'ن': 50,
  'س': 60,
  'ع': 70,
  'ف': 80,
  'ص': 90,
  'ق': 100,
  'ر': 200,
  'ش': 300,
  'ت': 400,
  'ث': 500,
  'خ': 600,
  'ذ': 700,
  'ض': 800,
  'ظ': 900,
  'غ': 1000
};

// ============================================================================
// APP-WIDE ABJAD SYSTEM
// ============================================================================
//
// One choice for the whole app: Maghribi by default, Mashriqi when the user
// switches. Every calculation reads its table from here (getActiveAbjadMap),
// so all tools switch together. The choice is persisted by
// services/AbjadSystemPreference.ts (AsyncStorage) and read in React through
// hooks/useAbjadSystem.ts. This module stays free of React and storage so the
// pure calculation code can import it.

export type AbjadSystemKey = 'maghribi' | 'mashriqi';

export const DEFAULT_ABJAD_SYSTEM: AbjadSystemKey = 'maghribi';

/** Accepts 'maghribi' | 'mashriqi' in any case; anything else is the default (Maghribi). */
export function resolveAbjadSystem(value?: unknown): AbjadSystemKey {
  return typeof value === 'string' && value.toLowerCase() === 'mashriqi' ? 'mashriqi' : DEFAULT_ABJAD_SYSTEM;
}

/** The shared table for a system (default: Maghribi). */
export function getAbjadMap(system?: unknown): Record<string, number> {
  return resolveAbjadSystem(system) === 'mashriqi' ? ABJAD_MASHRIQI : ABJAD_MAGHRIBI;
}

/** Which system a table is (anything that is not the shared Mashriqi table counts as Maghribi). */
export function abjadSystemOfMap(map?: Record<string, number> | null): AbjadSystemKey {
  return map === ABJAD_MASHRIQI || (!!map && map['غ'] === 1000 && map['ش'] === 300) ? 'mashriqi' : 'maghribi';
}

let activeAbjadSystem: AbjadSystemKey = DEFAULT_ABJAD_SYSTEM;
const abjadSystemListeners = new Set<() => void>();

/** The system the user chose (Maghribi until they switch). */
export function getActiveAbjadSystem(): AbjadSystemKey {
  return activeAbjadSystem;
}

/** The table for the system the user chose. Use this as the default table in calculations. */
export function getActiveAbjadMap(): Record<string, number> {
  return getAbjadMap(activeAbjadSystem);
}

/** Switch the whole app (in memory). Persist with setAbjadSystemPreference. */
export function setActiveAbjadSystem(system: unknown): void {
  const next = resolveAbjadSystem(system);
  if (next === activeAbjadSystem) return;
  activeAbjadSystem = next;
  abjadSystemListeners.forEach((listener) => listener());
}

export function subscribeAbjadSystem(listener: () => void): () => void {
  abjadSystemListeners.add(listener);
  return () => {
    abjadSystemListeners.delete(listener);
  };
}

const ARABIC_MARKS = /[\u064B-\u065F\u0670\u0640\u06D6-\u06ED]/g;

/** Sum of the letter values of an Arabic text (harakat and tatweel ignored). */
export function sumAbjad(text: string, abjad: Record<string, number> = getActiveAbjadMap()): number {
  let total = 0;
  for (const ch of (text || '').replace(ARABIC_MARKS, '')) total += abjad[ch] || 0;
  return total;
}

/**
 * The stored values in the static data files (99 Names, planetary Names, dhikr
 * list) were computed with the Mashriqi table. This re-expresses a stored value
 * in another system without touching anything else: only the six letters whose
 * value differs between the two tables change the total. In Mashriqi it returns
 * the stored value unchanged.
 */
export function storedMashriqiValueForSystem(
  storedValue: number,
  arabic: string,
  abjad: Record<string, number> = getActiveAbjadMap()
): number {
  if (abjad === ABJAD_MASHRIQI) return storedValue;
  let delta = 0;
  for (const ch of (arabic || '').replace(ARABIC_MARKS, '')) {
    const target = abjad[ch];
    const source = ABJAD_MASHRIQI[ch];
    if (target !== undefined && source !== undefined) delta += target - source;
  }
  return storedValue + delta;
}
