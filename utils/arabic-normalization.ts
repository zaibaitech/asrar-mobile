/**
 * Arabic Text Normalization Utilities
 * ====================================
 * CRITICAL module for ensuring consistent Abjad calculations across all sources
 * 
 * DESIGN DECISIONS:
 * - Remove ALL diacritics (tashkīl) and Qur'anic marks
 * - Normalize letter variants to standard forms
 * - ة (tā' marbūṭa) → ه (hā') for consistency
 * - أ إ آ → ا (normalize alif variants)
 * - ى (alif maqṣūra) → ي (yā')
 * - Remove tatweel (ـ), punctuation, whitespace, digits, Latin chars
 * 
 * This ensures the same verse from different Qur'an sources produces identical results
 */

// ============================================================================
// UNICODE RANGES & PATTERNS
// ============================================================================

/**
 * Comprehensive Arabic diacritic/tashkīl removal
 * Covers: fatḥa, kasra, ḍamma, tanwīn, sukūn, shadda, maddah, hamza marks, superscript alef, etc.
 * Range U+064B-U+065F: All standard Arabic diacritics
 * U+0670: ARABIC LETTER SUPERSCRIPT ALEF (dagger alif)
 */
const ARABIC_DIACRITICS = /[\u064B-\u065F\u0670]/g;

/**
 * Qur'anic annotation marks (stop signs, pause marks, Uthmani-specific symbols)
 * U+0610-U+061A: Arabic marks above and below
 * U+06D6-U+06ED: Quranic annotation marks (small high letters, sajdah mark, rub el hizb, etc.)
 * U+06EE-U+06EF: Additional Quranic marks
 * U+06F0-U+06FF: Extended Arabic-Indic digits and marks
 */
const QURANIC_MARKS = /[\u0610-\u061A\u06D6-\u06EF]/g;

/**
 * Additional Uthmani script symbols often found in Quran APIs
 * Small high letters, pause marks, sajdah indicators, etc.
 */
const UTHMANI_SYMBOLS = /[\u0600-\u0603\u0606-\u060F\u06DD-\u06DE]/g;

/**
 * Tatweel (kashida/elongation character): ـ
 */
const TATWEEL = /\u0640/g;

/**
 * Arabic and English digits (0-9 and ٠-٩)
 */
const DIGITS = /[0-9\u0660-\u0669]/g;

/**
 * Punctuation and whitespace (Arabic and English)
 */
const PUNCTUATION_WHITESPACE = /[\s\u200C\u200D\u200E\u200F.,;:!?"'`~@#$%^&*()_+\-=\[\]{}|\\/<>«»،؛؟]/g;

/**
 * Lam-Alif ligatures (ﻻ ﻼ etc.) - decompose to لا
 */
const LAM_ALEF_LIGATURES = /[\uFEF5-\uFEFC]/g;

/**
 * Latin alphabet (A-Z, a-z)
 */
const LATIN_CHARS = /[A-Za-z]/g;

/**
 * Core Arabic letter range (after normalization)
 * ء-ي (hamza through yā')
 */
const ARABIC_LETTERS_ONLY = /[^\u0621-\u063A\u0641-\u064A]/g;

// ============================================================================
// PRIMARY NORMALIZATION FUNCTION
// ============================================================================

/**
 * Normalize Arabic text for Abjad calculations (SINGLE SOURCE OF TRUTH)
 * 
 * This function MUST be used before ALL calculations to ensure consistency.
 * 
 * Process:
 * 1. Trim whitespace
 * 2. Unicode NFC normalization
 * 3. Decompose ligatures (لا)
 * 4. Remove diacritics & Qur'anic marks
 * 5. Remove tatweel
 * 6. Normalize letter variants:
 *    - أ إ آ ٱ → ا
 *    - ؤ → و
 *    - ئ → ي
 *    - ة → ه (IMPORTANT: tā' marbūṭa treated as hā')
 *    - ى → ي (alif maqṣūra treated as yā')
 * 7. Remove digits, punctuation, whitespace, Latin chars
 * 8. Strip any remaining non-Arabic letters
 * 
 * @param text - Raw Arabic input (may include diacritics, marks, etc.)
 * @returns Clean Arabic letters only, ready for Abjad calculation
 * 
 * @example
 * normalizeArabic("بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ")
 * // Returns: "بسماللهالرحمنالرحيم"
 * 
 * @example
 * normalizeArabic("ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ")
 * // Returns: "الحمدللهربالعالمين"
 */
export function normalizeArabic(text: string): string {
  if (!text) return '';
  
  // Step 1: Unicode normalization to NFC (canonical composition)
  // This ensures consistent representation of combined characters
  let normalized = text.trim().normalize('NFC');
  
  // Step 2: Remove all Quranic and Uthmani-specific marks FIRST
  // These can interfere with further processing if not removed early
  normalized = normalized
    .replace(UTHMANI_SYMBOLS, '')       // Uthmani script symbols
    .replace(QURANIC_MARKS, '')         // Qur'anic annotation marks
    .replace(ARABIC_DIACRITICS, '')     // All tashkīl/harakat
    .replace(TATWEEL, '');              // Tatweel (elongation)
  
  // Step 3: Decompose ligatures
  // لا ligatures must be decomposed to individual letters
  normalized = normalized.replace(LAM_ALEF_LIGATURES, 'لا');
  
  // Step 4: Normalize letter variants to canonical forms
  // This is CRITICAL for consistent Abjad calculations
  normalized = normalized
    .replace(/[أإآٱ]/g, 'ا')  // All alif variants → plain alif
    .replace(/[ؤئء]/g, '')    // Remove hamza characters completely (matches web app)
    .replace(/ة/g, 'ه')       // Tā' marbūṭa → hā' (CRITICAL for consistency)
    .replace(/ى/g, 'ي');      // Alif maqṣūra → yā'
  
  // Step 5: Remove all non-letter content
  // Keep ONLY the 28 Arabic letters (ء through ي)
  normalized = normalized
    .replace(DIGITS, '')                      // Remove Arabic & Latin digits
    .replace(PUNCTUATION_WHITESPACE, '')      // Remove all punctuation & spaces
    .replace(LATIN_CHARS, '')                 // Remove Latin alphabet
    .replace(ARABIC_LETTERS_ONLY, '');        // Final cleanup: remove anything not in base Arabic letter range
  
  return normalized;
}

// ============================================================================
// DHIKR-SPECIFIC NORMALIZATION
// ============================================================================

/**
 * Normalize Divine Name for Dhikr calculations
 * 
 * Process:
 * 1. Apply standard Arabic normalization
 * 2. Strip "يا" (yā) prefix if present
 * 3. Strip "ال" (al-) definite article if present
 * 4. Calculate ONLY the core Divine Name
 * 
 * @param text - Divine Name input (e.g., "اللَّطِيف" or "يا الرحمن")
 * @returns Core name only (e.g., "لطيف" or "رحمن")
 * 
 * @example
 * normalizeDhikrName("اللَّطِيف")
 * // Returns: "لطيف"
 * 
 * @example
 * normalizeDhikrName("يا الرحمن")
 * // Returns: "رحمن"
 * 
 * @example
 * normalizeDhikrName("الله")
 * // Returns: "له" (strips ال but this is the actual name, so handle carefully)
 */
export function normalizeDhikrName(text: string): string {
  // First apply standard normalization
  let cleaned = normalizeArabic(text);
  
  if (!cleaned) return '';
  
  // Remove "يا" vocative prefix
  if (cleaned.startsWith('يا')) {
    cleaned = cleaned.slice(2);
  }
  
  // Remove "ال" definite article (but only if something remains after)
  // Special case: "الله" should NOT become "له" - keep the full name
  if (cleaned.startsWith('ال') && cleaned.length > 2) {
    // Exception: preserve "الله" as-is (it's not "al-lah" in the grammatical sense)
    if (cleaned !== 'الله') {
      cleaned = cleaned.slice(2);
    }
  }
  
  return cleaned;
}

// ============================================================================
// VALIDATION & DETECTION
// ============================================================================

/**
 * Check if text contains Arabic characters
 * @param text - Input text
 * @returns true if text contains any Arabic letters
 */
export function isArabicText(text: string): boolean {
  return /[\u0600-\u06FF]/.test(text);
}

/**
 * Count Arabic letters in normalized text
 * @param text - Normalized Arabic text
 * @returns Number of Arabic letters
 */
export function countArabicLetters(text: string): number {
  return Array.from(text).filter(char => /[\u0621-\u063A\u0641-\u064A]/.test(char)).length;
}

/**
 * Validate that text contains only normalized Arabic letters
 * @param text - Text to validate
 * @returns true if text contains only Arabic letters (no diacritics, marks, etc.)
 */
export function isNormalizedArabic(text: string): boolean {
  if (!text) return false;
  return /^[\u0621-\u063A\u0641-\u064A]+$/.test(text);
}

// ============================================================================
// EXPORT TEST CASES (for unit testing)
// ============================================================================

/**
 * Test cases for normalization validation
 * Each test case includes:
 * - input: raw text with diacritics/marks
 * - expected: normalized output
 * - description: what this tests
 */
export const NORMALIZATION_TEST_CASES = [
  {
    input: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
    expected: 'بسماللهالرحمنالرحيم',
    description: 'Bismillah with full tashkīl',
  },
  {
    input: 'ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ',
    expected: 'الحمدللهربالعالمين',
    description: 'Al-Fātiḥa verse 2 with diacritics',
  },
  {
    input: 'قُلْ هُوَ ٱللَّهُ أَحَدٌ',
    expected: 'قلهواللهاحد',
    description: 'Al-Ikhlāṣ verse 1',
  },
  {
    input: 'رَبَّنَآ ءَاتِنَا فِى ٱلدُّنْيَا حَسَنَةً',
    expected: 'ربناءاتنافيالدنياحسنه',
    description: 'Verse with آ and ة',
  },
  {
    input: 'وَمَآ أَرْسَلْنَـٰكَ إِلَّا رَحْمَةً لِّلْعَـٰلَمِينَ',
    expected: 'وماارسلناكالارحمهللعالمين',
    description: 'Verse with tatweel and various marks',
  },
  {
    input: 'إِنَّآ أَعْطَيْنَـٰكَ ٱلْكَوْثَرَ',
    expected: 'انااعطيناكالكوثر',
    description: 'Al-Kawthar with hamza variants',
  },
  {
    input: 'سُبْحَانَ رَبِّيَ الْأَعْلَىٰ',
    expected: 'سبحانربيالاعلي',
    description: 'Phrase with alif maqṣūra',
  },
  {
    input: 'مُحَمَّدٌ رَسُولُ ٱللَّهِ',
    expected: 'محمدرسولالله',
    description: 'Name with shadda',
  },
  {
    input: 'وَقُل رَّبِّ زِدۡنِی عِلۡمࣰا',
    expected: 'وقلربزدنيعلما',
    description: 'Verse with various Qur\'anic marks',
  },
  {
    input: 'الرَّحْمَـٰنِ الرَّحِيمِ ١',
    expected: 'الرحمنالرحيم',
    description: 'Text with Arabic numerals',
  },
];

/**
 * Test cases for Dhikr name normalization
 */
export const DHIKR_TEST_CASES = [
  {
    input: 'اللَّطِيف',
    expected: 'لطيف',
    description: 'Al-Laṭīf (strip ال)',
  },
  {
    input: 'الرَّحْمَن',
    expected: 'رحمن',
    description: 'Ar-Raḥmān (strip ال)',
  },
  {
    input: 'يا الرَّحِيم',
    expected: 'رحيم',
    description: 'With yā prefix',
  },
  {
    input: 'اللَّه',
    expected: 'الله',
    description: 'Allah (preserve as special case)',
  },
  {
    input: 'القَدُّوس',
    expected: 'قدوس',
    description: 'Al-Quddūs with shadda',
  },
];
