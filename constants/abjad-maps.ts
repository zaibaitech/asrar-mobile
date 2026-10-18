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
