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

/**
 * Normalize Arabic text (remove diacritics, extra spaces, etc.)
 */
export function normalizeArabicText(text: string): string {
  if (!text) return '';
  
  return text
    .trim()
    .replace(/[\u064B-\u065F]/g, '') // Remove diacritics
    .replace(/\s+/g, ' '); // Normalize whitespace
}

/**
 * Check if text contains Arabic characters
 */
export function isArabicText(text: string): boolean {
  const arabicPattern = /[\u0600-\u06FF]/;
  return arabicPattern.test(text);
}
