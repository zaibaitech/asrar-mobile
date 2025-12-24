/**
 * Core Abjad Calculations - Shared Utilities
 * Used across Name Destiny, Istikhara, and other modules
 * 
 * IMPORTANT: This is the SINGLE SOURCE OF TRUTH for calculations
 * DO NOT duplicate this logic elsewhere
 */

import { ABJAD_MAGHRIBI } from '../constants/abjad-maps';

/**
 * Normalize Arabic text (remove diacritics and extra spaces)
 */
export function normalizeArabic(text: string): string {
  if (!text) return '';
  
  // Remove diacritics (tashkeel)
  const normalized = text.replace(/[ًٌٍَُِّْـ]/g, '');
  
  // Remove extra spaces
  return normalized.replace(/\s+/g, ' ').trim();
}

/**
 * Calculate Abjad/Hadad total (Kabir) of Arabic text
 * 
 * @param text - Arabic text to calculate
 * @param abjad - Abjad mapping (defaults to ABJAD_MAGHRIBI)
 * @returns Total Abjad value (Hadad Kabir)
 */
export function calculateHadadKabir(
  text: string,
  abjad: Record<string, number> = ABJAD_MAGHRIBI
): number {
  if (!text) return 0;
  
  const normalized = normalizeArabic(text);
  let total = 0;
  
  for (const char of normalized) {
    const value = abjad[char];
    if (value) {
      total += value;
    }
  }
  
  return total;
}

/**
 * Calculate digital root (Saghir) - reduce to single digit 1-9
 * 
 * @param total - Number to reduce
 * @returns Digital root (1-9)
 */
export function calculateSaghir(total: number): number {
  if (total === 0) return 0;
  return 1 + ((total - 1) % 9);
}

/**
 * Calculate Tab (Element) from total using mod 4
 * MAGHRIBI MAPPING: 1=Fire, 2=Earth, 3=Air, 4=Water
 * 
 * @param total - Hadad total
 * @returns Element index (1-4)
 */
export function calculateTabElement(total: number): 1 | 2 | 3 | 4 {
  const remainder = total % 4;
  return (remainder === 0 ? 4 : remainder) as 1 | 2 | 3 | 4;
}

/**
 * Calculate Burj (Zodiac) from total using mod 12
 * 
 * @param total - Hadad total
 * @returns Burj index (1-12)
 */
export function calculateBurj(total: number): number {
  const remainder = total % 12;
  return remainder === 0 ? 12 : remainder;
}

/**
 * Modulo with 1-based indexing (returns 1-base instead of 0-base)
 * Example: modIndex(13, 12) returns 1 (not 0)
 * 
 * @param value - Value to mod
 * @param base - Base to mod by
 * @returns 1-indexed result
 */
export function modIndex(value: number, base: number): number {
  const remainder = value % base;
  return remainder === 0 ? base : remainder;
}

/**
 * Calculate complete destiny from person and mother names
 * Returns all key values for display
 * 
 * @param personName - Person's name (Arabic)
 * @param motherName - Mother's name (Arabic, optional)
 * @param abjad - Abjad mapping
 * @returns Object with all calculated values
 */
export function calculateDestiny(
  personName: string,
  motherName: string = '',
  abjad: Record<string, number> = ABJAD_MAGHRIBI
) {
  // Calculate individual totals
  const personKabir = calculateHadadKabir(personName, abjad);
  const motherKabir = calculateHadadKabir(motherName, abjad);
  const combinedKabir = personKabir + motherKabir;
  
  // Calculate derived values
  const saghir = calculateSaghir(combinedKabir);
  const tabElement = calculateTabElement(combinedKabir);
  const burjIndex = calculateBurj(combinedKabir);
  
  // Calculate individual elements (for expression/foundation)
  const personElement = calculateTabElement(personKabir);
  const motherElement = motherKabir > 0 ? calculateTabElement(motherKabir) : null;
  
  return {
    personName: normalizeArabic(personName),
    motherName: normalizeArabic(motherName),
    personKabir,
    motherKabir,
    combinedKabir,
    saghir,
    tabElement,        // Main element (from combined total)
    personElement,     // Expression element (from person only)
    motherElement,     // Foundation element (from mother only)
    burjIndex,
  };
}

/**
 * Debug helper - log calculation details
 * Only runs in development mode
 */
export function debugCalculation(
  personName: string,
  motherName: string = '',
  abjad: Record<string, number> = ABJAD_MAGHRIBI
): void {
  if (!__DEV__) return;
  
  const result = calculateDestiny(personName, motherName, abjad);
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔢 ABJAD CALCULATION DEBUG');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📝 Input:');
  console.log(`   Person: "${personName}" → "${result.personName}"`);
  console.log(`   Mother: "${motherName}" → "${result.motherName}"`);
  console.log('');
  console.log('📊 Totals (Hadad Kabir):');
  console.log(`   Person: ${result.personKabir}`);
  console.log(`   Mother: ${result.motherKabir}`);
  console.log(`   Combined: ${result.combinedKabir}`);
  console.log('');
  console.log('🎯 Derived Values:');
  console.log(`   Saghir (Digital Root): ${result.saghir}`);
  console.log(`   Tab Element: ${result.tabElement} (1=Fire, 2=Earth, 3=Air, 4=Water)`);
  console.log(`   Person Element: ${result.personElement}`);
  console.log(`   Mother Element: ${result.motherElement || 'N/A'}`);
  console.log(`   Burj Index: ${result.burjIndex}/12`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}
