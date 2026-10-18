/**
 * Abjad Context - Mobile Simplified Version
 * Exports Abjad mappings and validation functions (no React Context needed)
 */

// Re-export from constants (already exists)
import { ABJAD_MAGHRIBI } from '../constants/abjad-maps';

export { ABJAD_MAGHRIBI };

export type AbjadSystem = 'Maghribi' | 'Mashriqi';

// Mashriqi (Eastern) table: the one shared table in constants/abjad-maps.ts
// (same letter forms as Maghribi: أإآ=1, ؤ=6, ئى=10, ة=5).
export { ABJAD_MASHRIQI, getAbjadMap, getActiveAbjadMap } from '../constants/abjad-maps';

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
