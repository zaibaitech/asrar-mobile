/**
 * Quick test function to verify Quran normalization
 * Can be called from calculator component or debug console
 */

import { computeAbjadProfile } from './abjad-unified-pipeline';
import { normalizeArabic } from './arabic-normalization';

/**
 * Test the reported issue: Mobile returning Kabir 7738 instead of 7728
 * 
 * Usage:
 * import { testQuranNormalization } from '@/utils/testQuranNormalization';
 * testQuranNormalization(verseText);
 */
export function testQuranNormalization(
  rawVerseText: string,
  expectedKabir?: number,
  expectedSaghir?: number
): {
  success: boolean;
  normalized: string;
  kabir: number;
  saghir: number;
  matches: boolean;
  message: string;
} {
  // Normalize the text
  const normalized = normalizeArabic(rawVerseText);
  
  // Calculate Abjad values (Maghribi system)
  const profile = computeAbjadProfile(rawVerseText, normalized, 'maghribi', 'quran');
  
  const kabir = profile.core.kabir;
  const saghir = profile.core.saghir;
  
  // Check if it matches expected values
  let matches = true;
  let message = '';
  
  if (expectedKabir !== undefined && kabir !== expectedKabir) {
    matches = false;
    const diff = kabir - expectedKabir;
    message = `Kabir mismatch: Got ${kabir}, Expected ${expectedKabir} (diff: ${diff > 0 ? '+' : ''}${diff})`;
  } else if (expectedSaghir !== undefined && saghir !== expectedSaghir) {
    matches = false;
    message = `Saghir mismatch: Got ${saghir}, Expected ${expectedSaghir}`;
  } else if (expectedKabir !== undefined && expectedSaghir !== undefined) {
    message = `✅ Perfect match! Kabir: ${kabir}, Saghir: ${saghir}`;
  } else {
    message = `Kabir: ${kabir}, Saghir: ${saghir}`;
  }
  
  return {
    success: matches,
    normalized,
    kabir,
    saghir,
    matches,
    message,
  };
}

/**
 * Test Bismillah (should always return 786 / 3)
 */
export function testBismillah(): void {
  console.log('\n━━━ BISMILLAH TEST ━━━');
  
  const bismillahTests = [
    'بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ',  // With Uthmani marks
    'بسم الله الرحمن الرحيم',              // Clean
    'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', // With standard diacritics
  ];
  
  for (const text of bismillahTests) {
    const result = testQuranNormalization(text, 786, 3);
    console.log(`Input: "${text}"`);
    console.log(`Clean: "${result.normalized}"`);
    console.log(result.message);
    console.log('');
  }
}

/**
 * Simple inline test that can be called from any component
 */
export function quickTest(text: string): string {
  const result = testQuranNormalization(text);
  return `Normalized: "${result.normalized}" | Kabir: ${result.kabir} | Saghir: ${result.saghir}`;
}
