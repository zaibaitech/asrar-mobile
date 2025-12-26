/**
 * Text Normalization Utilities
 * 
 * PASTE CONTENT FROM WEB APP (OPTIONAL):
 * File: /src/lib/text-normalize.ts
 * 
 * Should contain:
 * - normalizeArabicText(text) - Clean Arabic text
 * - transliterateLatinToArabic(text) - Convert Latin to Arabic
 * - isArabicText(text) - Detect if text is Arabic
 */

const ARABIC_DIACRITICS_REGEX = /[\u064B-\u065F\u0670\u06D6-\u06ED]/g;
const TATWEEL_REGEX = /\u0640/g;
const ARABIC_DIGITS_REGEX = /[0-9\u0660-\u0669]/g;
const ARABIC_PUNCTUATION_REGEX = /[\s\u200C\u200D\u200E\u200F.,;:!?"'`~@#$%^&*()_+\-=\[\]{}|\\/<>«»،؛؟\-]/g;

const LAM_ALEF_LIGATURE_REGEX = /[\uFEF7\uFEF8\uFEF9\uFEFA\uFEFB\uFEFC]/g;

/**
 * Normalize Arabic text (remove diacritics, extra spaces, etc.)
 */
export function normalizeArabicText(text: string): string {
  if (!text) return '';
  
  return text
    .trim()
    .replace(ARABIC_DIACRITICS_REGEX, '')
    .replace(/\s+/g, ' ');
}

/**
 * Normalize Arabic letters for strict Dhikr calculation
 * Removes vowels, tatweel, punctuation, spaces, and normalizes variants
 */
function normalizeArabicLettersStrict(text: string): string {
  if (!text) return '';

  let normalized = text
    .normalize('NFC')
    .replace(LAM_ALEF_LIGATURE_REGEX, 'لا')
    .replace(ARABIC_DIACRITICS_REGEX, '')
    .replace(TATWEEL_REGEX, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي');

  normalized = normalized
    .replace(ARABIC_DIGITS_REGEX, '')
    .replace(ARABIC_PUNCTUATION_REGEX, '');

  // Remove any remaining non-Arabic letters
  normalized = normalized.replace(/[^\u0621-\u063A\u0641-\u064A]/g, '');

  return normalized;
}

/**
 * DhikrStrict - cleanup pipeline for Divine Name calculations
 */
export function dhikrStrict(text: string): string {
  const normalized = normalizeArabicLettersStrict(text);
  if (!normalized) return '';

  let cleaned = normalized;

  if (cleaned.startsWith('يا')) {
    cleaned = cleaned.slice(2);
  }

  if (cleaned.startsWith('ال') && cleaned.length > 2) {
    cleaned = cleaned.slice(2);
  }

  return cleaned;
}

/**
 * Check if text contains Arabic characters
 */
export function isArabicText(text: string): boolean {
  const arabicPattern = /[\u0600-\u06FF]/;
  return arabicPattern.test(text);
}
