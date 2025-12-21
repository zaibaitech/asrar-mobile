/**
 * Abjad Context - Mobile Simplified Version
 * Exports Abjad mappings and validation functions (no React Context needed)
 */

// Re-export from constants (already exists)
import { ABJAD_MAGHRIBI } from '../constants/abjad-maps';

export { ABJAD_MAGHRIBI };

export type AbjadSystem = 'Maghribi' | 'Mashriqi';

/**
 * Mashriqi (Eastern) Abjad - Traditional Middle Eastern system
 * Standard Abjad Hawwaz order (most common)
 */
export const ABJAD_MASHRIQI: Record<string, number> = {
  'ا': 1, 'ب': 2, 'ج': 3, 'د': 4, 'ه': 5, 'و': 6, 'ز': 7, 'ح': 8, 'ط': 9,
  'ي': 10, 'ك': 20, 'ل': 30, 'م': 40, 'ن': 50, 'س': 60, 'ع': 70, 'ف': 80, 'ص': 90,
  'ق': 100, 'ر': 200, 'ش': 300, 'ت': 400, 'ث': 500, 'خ': 600, 'ذ': 700, 'ض': 800, 'ظ': 900, 'غ': 1000,
  'ة': 5  // Tā' marbūṭa (feminine ending) = same as ه (5), not ت (400)
};

// ============================================================================
// HAMZA HANDLING
// ============================================================================

/**
 * IMPORTANT NOTE ABOUT HAMZA (ء):
 * 
 * Hamza (ء) is intentionally NOT included in Abjad calculations.
 * 
 * Classical tradition varies on hamza treatment:
 * - Some classical scholars count it as 1
 * - Others ignore it completely
 * - Some treat it as a diacritic, not a letter
 * 
 * Current Implementation: IGNORES hamza (not counted in totals)
 * Rationale: Aligns with most modern Maghribi applications and contemporary
 * Islamic numerology practice. Hamza is treated as an orthographic marker
 * rather than a counted letter.
 * 
 * If a name contains hamza:
 * - The letter is recognized but not added to the numerical total
 * - A console warning is logged to inform users
 * - The calculation proceeds normally with other letters
 * 
 * Example: محمد (Muhammad) vs محّمد (with hamza) = same numerical value
 */

export function validateAndWarnAboutHamza(arabicText: string): void {
  if (arabicText.includes('ء')) {
    console.warn(
      `⚠️ Input contains hamza (ء) which is not counted in Abjad calculations. ` +
      `This is by design - hamza is treated as an orthographic marker, not a letter value. ` +
      `The calculation will proceed with other letters normally.`
    );
  }
}
