/**
 * Unified Abjad Calculation Pipeline
 * ===================================
 * SINGLE SOURCE OF TRUTH for all Abjad calculations
 * 
 * This module provides one function that computes ALL Abjad values from normalized text.
 * All UI components and result cards MUST derive their values from this profile.
 * 
 * KEY PRINCIPLES:
 * 1. Text normalization happens ONCE (via normalizeArabic or normalizeDhikrName)
 * 2. All calculations use the SAME normalized text
 * 3. System (Maghribi/Mashriqi) is applied consistently
 * 4. Results are deterministic and reproducible
 */

import { ABJAD_MAGHRIBI, ABJAD_MASHRIQI } from '../constants/abjad-maps';
import { calculateBurj } from '../constants/buruj';
import { elementOfLetter, hadathRemainder, hadathToElement, LETTER_ELEMENTS } from './hadad-core';
import { ElementType } from './types';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Input type classification
 */
export type AbjadInputType = 'general' | 'dhikr' | 'quran';

/**
 * Abjad system selection
 */
export type AbjadSystem = 'maghribi' | 'mashriqi';

/**
 * Core numerical results (primary calculations)
 */
export interface AbjadCoreResults {
  /** Kabīr (Grand Total) - sum of all letter values */
  kabir: number;
  
  /** Ṣaghīr (Digital Root) - recursive digit sum until single digit */
  saghir: number;
  
  /** Ḥadad (Element Index) - kabir mod 4 (0-3 or 1-4 depending on system) */
  hadad: number;
  
  /** Element name derived from Ḥadad */
  element: ElementType;
  
  /** Burj Index - kabir mod 12 (1-12) */
  burjIndex: number;
  
  /** Burj Name (zodiac sign) */
  burjName: string;
  
  /** Burj Symbol */
  burjSymbol: string;
}

/**
 * Advanced methods (secondary calculations)
 */
export interface AbjadAdvancedMethods {
  /** Wusṭā (Middle) - (kabir + saghir) / 2 */
  wusta: number;
  
  /** Kamāl (Perfection) - kabir + saghir */
  kamal: number;
  
  /** Basṭ (Expansion) - kabir * saghir */
  bast: number;
  
  /** Sirr (Secret) - kabir - saghir */
  sirr: number;
}

/**
 * Elemental composition (letter-based analysis)
 */
export interface AbjadElementalComposition {
  /** Fire element letters count */
  fire: number;
  
  /** Water element letters count */
  water: number;
  
  /** Air element letters count */
  air: number;
  
  /** Earth element letters count */
  earth: number;
  
  /** Total letters analyzed */
  totalLetters: number;
  
  /** Fire percentage (0-100) */
  firePercent: number;
  
  /** Water percentage (0-100) */
  waterPercent: number;
  
  /** Air percentage (0-100) */
  airPercent: number;
  
  /** Earth percentage (0-100) */
  earthPercent: number;
  
  /** Dominant element */
  dominantElement: ElementType;
  
  /** Weakest element (or null if tied) */
  weakestElement: ElementType | null;
  
  /** Balance score (0-100, where 100 = perfectly balanced) */
  balanceScore: number;
}

/**
 * Letter frequency analysis
 */
export interface LetterFrequencyEntry {
  /** Arabic letter */
  letter: string;
  
  /** Number of occurrences */
  count: number;
  
  /** Abjad value */
  value: number;
  
  /** Element classification */
  element: ElementType;
}

/**
 * Complete Abjad calculation profile
 */
export interface AbjadProfile {
  /** Original input text (before normalization) */
  originalText: string;
  
  /** Normalized text used for calculations */
  normalizedText: string;
  
  /** System used (Maghribi or Mashriqi) */
  system: AbjadSystem;
  
  /** Input type classification */
  inputType: AbjadInputType;
  
  /** Core numerical results */
  core: AbjadCoreResults;
  
  /** Advanced calculation methods */
  advanced: AbjadAdvancedMethods;
  
  /** Elemental composition analysis */
  elemental: AbjadElementalComposition;
  
  /** Letter frequency breakdown */
  letterFrequency: LetterFrequencyEntry[];
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Calculate digital root (sum digits recursively until single digit)
 * @param n - Input number
 * @returns Digital root (1-9, or 0 for input 0)
 */
function digitalRoot(n: number): number {
  if (n === 0) return 0;
  return n % 9 === 0 ? 9 : n % 9;
}

/**
 * Get Abjad map based on system
 * @param system - 'maghribi' or 'mashriqi'
 * @returns Letter-to-number mapping
 */
function getAbjadMap(system: AbjadSystem): Record<string, number> {
  return system === 'maghribi' ? ABJAD_MAGHRIBI : ABJAD_MASHRIQI;
}

/**
 * Calculate Kabīr (grand total) from normalized Arabic text
 * @param text - Normalized Arabic text (no diacritics)
 * @param system - Abjad system
 * @returns Sum of all letter values
 */
function calculateKabir(text: string, system: AbjadSystem): number {
  const map = getAbjadMap(system);
  let total = 0;
  
  for (const char of text) {
    const value = map[char];
    if (typeof value === 'number') {
      total += value;
    }
  }
  
  return total;
}

/**
 * Analyze elemental composition from normalized text
 * @param text - Normalized Arabic text
 * @param system - Abjad system (for letter values)
 * @returns Elemental composition with percentages and analysis
 */
function analyzeElementalComposition(
  text: string,
  system: AbjadSystem
): { composition: AbjadElementalComposition; frequencies: LetterFrequencyEntry[] } {
  const map = getAbjadMap(system);
  const letterMap = new Map<string, { count: number; value: number; element: ElementType }>();
  
  // Count letter frequencies
  for (const char of text) {
    if (LETTER_ELEMENTS[char]) {
      const element = elementOfLetter(char);
      const value = map[char] || 0;
      const existing = letterMap.get(char);
      
      if (existing) {
        letterMap.set(char, { ...existing, count: existing.count + 1 });
      } else {
        letterMap.set(char, { count: 1, value, element });
      }
    }
  }
  
  // Build frequency list
  const frequencies: LetterFrequencyEntry[] = Array.from(letterMap.entries())
    .map(([letter, data]) => ({
      letter,
      count: data.count,
      value: data.value,
      element: data.element,
    }))
    .sort((a, b) => b.count - a.count);
  
  // Calculate element counts
  const elementCounts = { fire: 0, water: 0, air: 0, earth: 0 };
  let totalLetters = 0;
  
  for (const freq of frequencies) {
    elementCounts[freq.element] += freq.count;
    totalLetters += freq.count;
  }
  
  // Calculate percentages
  const firePercent = totalLetters > 0 ? Math.round((elementCounts.fire / totalLetters) * 100) : 0;
  const waterPercent = totalLetters > 0 ? Math.round((elementCounts.water / totalLetters) * 100) : 0;
  const airPercent = totalLetters > 0 ? Math.round((elementCounts.air / totalLetters) * 100) : 0;
  const earthPercent = totalLetters > 0 ? Math.round((elementCounts.earth / totalLetters) * 100) : 0;
  
  // Find dominant and weakest
  const percentMap: [ElementType, number][] = [
    ['fire', firePercent],
    ['water', waterPercent],
    ['air', airPercent],
    ['earth', earthPercent],
  ];
  
  percentMap.sort((a, b) => b[1] - a[1]);
  const dominantElement = percentMap[0][0];
  const weakestElement = percentMap.find(([_, pct]) => pct === 0)?.[0] || null;
  
  // Calculate balance score
  // Perfect balance = 25% each element
  // Use standard deviation from ideal (25%)
  const ideal = 25;
  const percents = [firePercent, waterPercent, airPercent, earthPercent];
  const variance = percents.reduce((sum, p) => sum + Math.pow(p - ideal, 2), 0) / 4;
  const stdDev = Math.sqrt(variance);
  
  // Max std dev when one element is 100% and others 0% ≈ 43.3
  // Scale to 0-100 where 0 stdDev = 100 score
  const balanceScore = Math.max(0, Math.min(100, Math.round(100 - (stdDev * 2.3))));
  
  const composition: AbjadElementalComposition = {
    fire: elementCounts.fire,
    water: elementCounts.water,
    air: elementCounts.air,
    earth: elementCounts.earth,
    totalLetters,
    firePercent,
    waterPercent,
    airPercent,
    earthPercent,
    dominantElement,
    weakestElement,
    balanceScore,
  };
  
  return { composition, frequencies };
}

// ============================================================================
// MAIN CALCULATION FUNCTION (SINGLE SOURCE OF TRUTH)
// ============================================================================

/**
 * Compute complete Abjad profile from normalized text
 * 
 * This is the SINGLE SOURCE OF TRUTH for all calculations.
 * All UI components must derive their values from this profile.
 * 
 * @param originalText - Original input (before normalization)
 * @param normalizedText - Normalized Arabic text (via normalizeArabic)
 * @param system - 'maghribi' or 'mashriqi'
 * @param inputType - 'general' | 'dhikr' | 'quran'
 * @returns Complete calculation profile with all derived values
 * 
 * @example
 * const text = "بِسْمِ اللَّهِ";
 * const normalized = normalizeArabic(text);
 * const profile = computeAbjadProfile(text, normalized, 'maghribi', 'quran');
 * console.log(profile.core.kabir);  // 102
 * console.log(profile.core.saghir); // 3
 */
export function computeAbjadProfile(
  originalText: string,
  normalizedText: string,
  system: AbjadSystem,
  inputType: AbjadInputType
): AbjadProfile {
  // Calculate Kabīr
  const kabir = calculateKabir(normalizedText, system);
  
  // Calculate Ṣaghīr (digital root)
  const saghir = digitalRoot(kabir);
  
  // Calculate Ḥadad and Element
  const hadad = hadathRemainder(kabir); // Returns 0-3
  const element = hadathToElement(hadad);
  
  // Calculate Burj
  const burjCalc = calculateBurj(kabir);
  const burjIndex = (kabir % 12) || 12; // 1-12
  const burjName = burjCalc.name;
  
  // Burj symbols (zodiac symbols)
  const burjSymbols = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
  const burjSymbol = burjSymbols[burjIndex - 1];
  
  // Core results
  const core: AbjadCoreResults = {
    kabir,
    saghir,
    hadad,
    element,
    burjIndex,
    burjName,
    burjSymbol,
  };
  
  // Advanced methods
  const advanced: AbjadAdvancedMethods = {
    wusta: Math.floor((kabir + saghir) / 2),
    kamal: kabir + saghir,
    bast: kabir * saghir,
    sirr: kabir - saghir,
  };
  
  // Elemental composition
  const { composition, frequencies } = analyzeElementalComposition(normalizedText, system);
  
  // Return complete profile
  return {
    originalText,
    normalizedText,
    system,
    inputType,
    core,
    advanced,
    elemental: composition,
    letterFrequency: frequencies,
  };
}

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Quick Kabīr calculation (for simple use cases)
 * @param normalizedText - Normalized Arabic text
 * @param system - Abjad system
 * @returns Kabīr value
 */
export function quickKabir(normalizedText: string, system: AbjadSystem = 'maghribi'): number {
  return calculateKabir(normalizedText, system);
}

/**
 * Quick Ṣaghīr calculation (for simple use cases)
 * @param kabir - Kabīr value
 * @returns Ṣaghīr (digital root)
 */
export function quickSaghir(kabir: number): number {
  return digitalRoot(kabir);
}

/**
 * Get digital root (exported for external use)
 * @param n - Input number
 * @returns Digital root
 */
export { digitalRoot as getDigitalRoot };
