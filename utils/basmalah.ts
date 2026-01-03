/**
 * Basmalah Utilities
 * ==================
 * Handles detection and stripping of Basmalah (بسم الله الرحمن الرحيم)
 * from Qur'anic text for Mushaf-compliant display and calculation.
 * 
 * MUSHAF BEHAVIOR:
 * - Basmalah appears as separate opening line (header)
 * - Ayah 1 text does NOT include Basmalah (except special cases)
 * - Surah 9 (At-Tawbah): NO Basmalah
 * - Surah 27:30: Contains basmalah INSIDE verse (do not strip)
 * 
 * USAGE:
 * - Qur'an Reader: Show Basmalah header once, strip from Ayah 1 display
 * - Calculator: Exclude Basmalah from Ayah 1 calculations unless explicitly requested
 */

import { normalizeArabic } from './arabic-normalization';

/**
 * Canonical Basmalah text (without diacritics)
 * Used as reference for normalization and comparison
 */
const BASMALAH_CANONICAL = 'بسم الله الرحمن الرحيم';

/**
 * Normalized Basmalah (after applying Arabic normalization)
 * All Basmalah variations should normalize to this form
 */
const BASMALAH_NORMALIZED = 'بسماللهالرحمنالرحيم';

/**
 * Comprehensive regex pattern to match Basmalah with all variations
 * Handles: diacritics, wasla, different alif forms, spacing variations
 * 
 * Pattern breakdown:
 * - ب[\u064B-\u065F]*س[\u064B-\u065F]*م[\u064B-\u065F]* : "بسم" with any diacritics (U+064B to U+065F)
 * - \s* : Optional whitespace
 * - ٱ?ل[\u064B-\u065F]*ل[\u064B-\u065F\u0651]*[\u064B-\u065F]*ه[\u064B-\u065F]* : "الله" with optional alif wasla, any diacritics including shadda
 * - \s* : Optional whitespace  
 * - ٱ?ل[\u064B-\u065F]*ر[\u064B-\u065F\u0651]*[\u064B-\u065F\u0640]*ح[\u064B-\u065F\u0640]*م[\u064B-\u065F\u0640\u0670]*ن[\u064B-\u065F]* : "الرحمٰن" with diacritics, tatweel, superscript alif
 * - \s* : Optional whitespace
 * - ٱ?ل[\u064B-\u065F]*ر[\u064B-\u065F\u0651]*[\u064B-\u065F]*ح[\u064B-\u065F]*ي[\u064B-\u065F]*م[\u064B-\u065F]* : "الرحيم" with any diacritics
 * 
 * CRITICAL FIX: Uses flexible diacritic ranges to match ALL variations and ensure COMPLETE removal
 */
const BASMALAH_REGEX = /^[\u200F\uFEFF]*ب[\u064B-\u065F]*س[\u064B-\u065F]*م[\u064B-\u065F]*\s*ٱ?ل[\u064B-\u065F]*ل[\u064B-\u065F\u0651]*[\u064B-\u065F]*ه[\u064B-\u065F]*\s*ٱ?ل[\u064B-\u065F]*ر[\u064B-\u065F\u0651]*[\u064B-\u065F\u0640]*ح[\u064B-\u065F\u0640]*م[\u064B-\u065F\u0640\u0670]*ن[\u064B-\u065F]*\s*ٱ?ل[\u064B-\u065F]*ر[\u064B-\u065F\u0651]*[\u064B-\u065F]*ح[\u064B-\u065F]*ي[\u064B-\u065F]*م[\u064B-\u065F]*\s*/;

/**
 * Check if Arabic text starts with Basmalah
 * 
 * Uses two-stage approach:
 * 1. Regex pattern matching (fast, handles most cases)
 * 2. Normalized comparison (fallback for edge cases)
 * 
 * @param arabicText - Raw Arabic text (may include diacritics, marks, etc.)
 * @returns true if text begins with Basmalah, false otherwise
 */
export function startsWithBasmalah(arabicText: string): boolean {
  if (!arabicText || typeof arabicText !== 'string') {
    return false;
  }
  
  const trimmed = arabicText.trim();
  if (!trimmed) {
    return false;
  }
  
  // Strategy 1: Regex pattern matching (handles all diacritic variations)
  if (BASMALAH_REGEX.test(trimmed)) {
    return true;
  }
  
  // Strategy 2: Normalized comparison (fallback for edge cases)
  const normalized = normalizeArabic(trimmed);
  if (normalized.startsWith(BASMALAH_NORMALIZED)) {
    return true;
  }
  
  return false;
}

/**
 * Strip Basmalah from the beginning of Arabic text
 * 
 * CRITICAL FIX: Ensures ENTIRE Basmalah phrase is removed, not partial.
 * Uses regex matching to find exact boundaries.
 * 
 * @param arabicText - Raw Arabic text that may start with Basmalah
 * @returns Text with Basmalah removed (if present), original text otherwise
 */
export function stripLeadingBasmalah(arabicText: string): string {
  if (!arabicText || typeof arabicText !== 'string') {
    return '';
  }
  
  const trimmed = arabicText.trim();
  if (!trimmed) {
    return '';
  }
  
  // Use regex to remove the ENTIRE Basmalah phrase
  // This ensures we don't leave partial text like "الرحمن الرحيم"
  const result = trimmed.replace(BASMALAH_REGEX, '').trim();
  
  // Verify we actually removed something (i.e., Basmalah was present)
  if (result.length < trimmed.length) {
    // Successfully stripped Basmalah
    return result;
  }
  
  // Fallback: If regex didn't match, try normalized approach
  const normalized = normalizeArabic(trimmed);
  if (normalized.startsWith(BASMALAH_NORMALIZED)) {
    // Find where Basmalah ends by comparing normalized versions
    const basmalahNormLength = BASMALAH_NORMALIZED.length;
    
    // Find the position in original text that corresponds to end of normalized Basmalah
    let charCount = 0;
    let originalPos = 0;
    
    // Walk through original text, counting normalized characters
    for (let i = 0; i < trimmed.length && charCount < basmalahNormLength; i++) {
      const char = trimmed[i];
      const normChar = normalizeArabic(char);
      
      if (normChar.length > 0) {
        charCount += normChar.length;
      }
      originalPos = i + 1;
    }
    
    // Return text after the Basmalah
    const remaining = trimmed.slice(originalPos).trim();
    return remaining;
  }
  
  // No Basmalah found, return original text
  return trimmed;
}

/**
 * Get Basmalah text for display
 * 
 * @param vocalized - Whether to return fully vocalized version (default: true)
 * @returns Basmalah text string
 */
export function getBasmalahText(vocalized: boolean = true): string {
  if (vocalized) {
    return 'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ';
  }
  return 'بسم الله الرحمن الرحيم';
}

/**
 * Check if a surah should display Basmalah header
 * 
 * Rules:
 * - Surah 9 (At-Tawbah): NO Basmalah
 * - All other surahs: YES Basmalah
 * 
 * @param surahNumber - Surah number (1-114)
 * @returns true if Basmalah header should be displayed, false otherwise
 */
export function shouldDisplayBasmalah(surahNumber: number): boolean {
  // At-Tawbah (Surah 9) has no Basmalah
  return surahNumber !== 9;
}

/**
 * Check if Basmalah should be stripped from an ayah
 * 
 * Special cases:
 * - Surah 27, Ayah 30: Contains Basmalah INSIDE the verse (do NOT strip)
 * - Surah 9: Never has Basmalah (do NOT strip)
 * - Other surahs, Ayah 1: Strip if present
 * 
 * @param surahNumber - Surah number (1-114)
 * @param ayahNumber - Ayah number
 * @returns true if Basmalah should be stripped, false otherwise
 */
export function shouldStripBasmalah(surahNumber: number, ayahNumber: number): boolean {
  // Special case: Surah 27, Ayah 30 contains Basmalah inside the verse
  // "It is from Solomon, and it is 'In the name of Allah, the Most Gracious, the Most Merciful'"
  if (surahNumber === 27 && ayahNumber === 30) {
    return false;
  }
  
  // Only strip from Ayah 1 of surahs that have Basmalah
  if (ayahNumber === 1 && shouldDisplayBasmalah(surahNumber)) {
    return true;
  }
  
  return false;
}

/**
 * Re-export normalizeArabic for convenience
 */
export { normalizeArabic } from './arabic-normalization';
