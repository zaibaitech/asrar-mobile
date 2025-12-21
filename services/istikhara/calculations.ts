/**
 * Istikhara Calculation Utilities
 * Istikharah al-Asmā' - Personal Spiritual Guidance
 * 
 * Calculates buruj (zodiac) remainder and retrieves spiritual profile
 */

import burujDataJson from '../../data/burujData.json';
import { calculateAbjadValue, modIndex } from '../ilm-huruf/abjad-calculator';
import type { BurujData, BurujProfile, IstikharaCalculationResult } from './types';

// Type assertion for imported JSON (with unknown for safety)
const burujData = burujDataJson as unknown as BurujData;

/**
 * Calculate the buruj remainder from person and mother totals
 * Uses modIndex with base 12 for 1-indexed buruj system
 * 
 * @param personTotal - Abjad total of person's name
 * @param motherTotal - Abjad total of mother's name
 * @returns Buruj remainder (1-12)
 */
export function calculateBurujRemainder(personTotal: number, motherTotal: number): number {
  const combinedTotal = personTotal + motherTotal;
  // Use modIndex to get 1-indexed result (1-12 instead of 0-11)
  return modIndex(combinedTotal, 12);
}

/**
 * Get buruj profile data for a specific remainder
 * 
 * @param remainder - Buruj remainder (1-12)
 * @returns BurujProfile object with all spiritual guidance
 * @throws Error if remainder is invalid or profile not found
 */
export function getBurujData(remainder: number): BurujProfile {
  if (remainder < 1 || remainder > 12) {
    throw new Error(`Invalid buruj remainder: ${remainder}. Must be between 1 and 12.`);
  }

  const profile = burujData.buruj_data[remainder.toString()];
  
  if (!profile) {
    throw new Error(`Buruj profile not found for remainder ${remainder}`);
  }

  return profile;
}

/**
 * Calculate repetition count for Divine Names practice
 * Uses the combined total of person and mother names
 * 
 * @param personTotal - Abjad total of person's name
 * @param motherTotal - Abjad total of mother's name
 * @returns Number of repetitions for spiritual practice
 */
export function calculateRepetitionCount(personTotal: number, motherTotal: number): number {
  const combinedTotal = personTotal + motherTotal;
  return combinedTotal;
}

/**
 * Get day of week name from day number
 * 
 * @param dayNumber - Day number (0=Sunday, 1=Monday, etc.)
 * @returns Object with English and French day names
 */
export function getDayOfWeek(dayNumber: number | null): { en: string; fr: string } | null {
  if (dayNumber === null || dayNumber < 0 || dayNumber > 6) {
    return null;
  }

  const days: { [key: number]: { en: string; fr: string } } = {
    0: { en: 'Sunday', fr: 'Dimanche' },
    1: { en: 'Monday', fr: 'Lundi' },
    2: { en: 'Tuesday', fr: 'Mardi' },
    3: { en: 'Wednesday', fr: 'Mercredi' },
    4: { en: 'Thursday', fr: 'Jeudi' },
    5: { en: 'Friday', fr: 'Vendredi' },
    6: { en: 'Saturday', fr: 'Samedi' }
  };

  return days[dayNumber];
}

/**
 * Complete Istikhara calculation
 * Takes person and mother names, calculates all values and retrieves profile
 * 
 * @param personName - Person's name (Arabic or Latin)
 * @param motherName - Mother's name (Arabic or Latin)
 * @returns Complete calculation result with buruj profile
 */
export function calculateIstikhara(
  personName: string,
  motherName: string
): IstikharaCalculationResult {
  // Validate inputs
  if (!personName || personName.trim().length === 0) {
    throw new Error('Person name is required');
  }
  if (!motherName || motherName.trim().length === 0) {
    throw new Error('Mother name is required');
  }

  // Calculate Abjad totals
  const personTotal = calculateAbjadValue(personName);
  const motherTotal = calculateAbjadValue(motherName);
  const combinedTotal = personTotal + motherTotal;

  // Calculate buruj remainder
  const burujRemainder = calculateBurujRemainder(personTotal, motherTotal);

  // Get buruj profile
  const burujProfile = getBurujData(burujRemainder);

  // Calculate repetition count for spiritual practice
  const repetitionCount = calculateRepetitionCount(personTotal, motherTotal);

  return {
    personName: personName.trim(),
    motherName: motherName.trim(),
    personTotal,
    motherTotal,
    combinedTotal,
    burujRemainder,
    burujProfile,
    repetitionCount
  };
}

/**
 * Get element information from buruj remainder
 * Helper function for quick element lookup
 * 
 * @param remainder - Buruj remainder (1-12)
 * @returns Element type, emoji, and number
 */
export function getElementInfo(remainder: number): {
  element: 'fire' | 'earth' | 'air' | 'water';
  emoji: string;
  number: number;
  colors: [string, string];
} {
  const profile = getBurujData(remainder);
  return {
    element: profile.element,
    emoji: profile.element_emoji,
    number: profile.element_number,
    colors: profile.colors
  };
}

/**
 * Validate name input
 * Checks if name contains valid characters (Arabic, Latin, spaces, hyphens)
 * 
 * @param name - Name to validate
 * @returns true if valid, false otherwise
 */
export function validateName(name: string): boolean {
  if (!name || name.trim().length === 0) {
    return false;
  }

  // Allow Arabic letters, Latin letters, spaces, hyphens, and apostrophes
  const validNamePattern = /^[\u0600-\u06FFa-zA-Z\s\-']+$/;
  return validNamePattern.test(name);
}

/**
 * Get element name in specified language
 * 
 * @param element - Element type
 * @param language - 'en' or 'fr'
 * @returns Element name in specified language
 */
export function getElementName(
  element: 'fire' | 'earth' | 'air' | 'water',
  language: 'en' | 'fr'
): string {
  const elementNames = {
    fire: { en: 'Fire', fr: 'Feu' },
    earth: { en: 'Earth', fr: 'Terre' },
    air: { en: 'Air', fr: 'Air' },
    water: { en: 'Water', fr: 'Eau' }
  };

  return elementNames[element][language];
}
