/**
 * Runtime Abjad Debug Tools
 * =========================
 * Tools that can be called from the calculator or console for live debugging
 * 
 * Usage in calculator:
 * import { debugCurrentCalculation } from '@/utils/abjadDebugTools';
 * debugCurrentCalculation(rawText, expectedKabir, expectedSaghir);
 */

import { computeAbjadProfile } from './abjad-unified-pipeline';
import { normalizeArabic } from './arabic-normalization';
import { logComparison, logNormalizationDebug } from './arabicNormalizationDebug';

/**
 * Debug the current calculation with full details
 * Call this from calculator when results don't match expectations
 */
export function debugCurrentCalculation(
  rawText: string,
  expectedKabir?: number,
  expectedSaghir?: number,
  system: 'maghribi' | 'mashriqi' = 'maghribi'
): void {
  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log('║          ABJAD CALCULATION DEBUG SESSION                     ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');
  
  console.log(`System: ${system.toUpperCase()}\n`);
  
  // Step 1: Show normalization details
  console.log('STEP 1: NORMALIZATION\n');
  logNormalizationDebug(rawText);
  
  // Step 2: Calculate
  const normalized = normalizeArabic(rawText);
  const profile = computeAbjadProfile(rawText, normalized, system, 'quran');
  
  console.log('\nSTEP 2: ABJAD CALCULATION\n');
  console.log('Core Results:');
  console.log(`  Kabir (Grand Total):    ${profile.core.kabir}`);
  console.log(`  Saghir (Digital Root):  ${profile.core.saghir}`);
  console.log(`  Hadad (Element Index):  ${profile.core.hadad}`);
  console.log(`  Element:                ${profile.core.element}`);
  console.log(`  Burj:                   ${profile.core.burjName} (${profile.core.burjSymbol})`);
  
  // Step 3: Compare with expected
  if (expectedKabir !== undefined || expectedSaghir !== undefined) {
    console.log('\nSTEP 3: COMPARISON WITH EXPECTED VALUES\n');
    
    if (expectedKabir !== undefined) {
      const kabirMatch = profile.core.kabir === expectedKabir;
      const diff = profile.core.kabir - expectedKabir;
      console.log(`Kabir:`);
      console.log(`  Mobile:   ${profile.core.kabir}`);
      console.log(`  Expected: ${expectedKabir}`);
      console.log(`  ${kabirMatch ? '✅ MATCH' : `❌ MISMATCH (difference: ${diff > 0 ? '+' : ''}${diff})`}`);
    }
    
    if (expectedSaghir !== undefined) {
      const saghirMatch = profile.core.saghir === expectedSaghir;
      console.log(`\nSaghir:`);
      console.log(`  Mobile:   ${profile.core.saghir}`);
      console.log(`  Expected: ${expectedSaghir}`);
      console.log(`  ${saghirMatch ? '✅ MATCH' : '❌ MISMATCH'}`);
    }
  }
  
  // Step 4: Letter breakdown
  console.log('\nSTEP 4: LETTER-BY-LETTER BREAKDOWN\n');
  console.log('Normalized text character analysis:');
  const chars = Array.from(normalized);
  const map = system === 'maghribi' ? require('../constants/abjad-maps').ABJAD_MAGHRIBI : require('../constants/abjad-maps').ABJAD_MASHRIQI;
  const letterValues: Array<{ letter: string; value: number; codePoint: string }> = [];
  
  for (const char of chars) {
    const value = map[char] || 0;
    const codePoint = `U+${char.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')}`;
    letterValues.push({ letter: char, value, codePoint });
    console.log(`  ${char} (${codePoint}) = ${value}`);
  }
  
  const calculatedTotal = letterValues.reduce((sum, lv) => sum + lv.value, 0);
  console.log(`\nSum: ${calculatedTotal}`);
  
  if (calculatedTotal !== profile.core.kabir) {
    console.log(`⚠️  WARNING: Manual sum (${calculatedTotal}) doesn't match profile Kabir (${profile.core.kabir})`);
  }
  
  console.log('\n╚══════════════════════════════════════════════════════════════╝\n');
}

/**
 * Compare two texts side by side
 * Useful for comparing API response vs cleaned text
 */
export function compareTexts(
  text1: string,
  text2: string,
  label1: string = 'Text 1',
  label2: string = 'Text 2'
): void {
  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log('║          TEXT COMPARISON                                      ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');
  
  const norm1 = normalizeArabic(text1);
  const norm2 = normalizeArabic(text2);
  
  console.log(`${label1}:`);
  console.log(`  Raw:        "${text1}"`);
  console.log(`  Normalized: "${norm1}"`);
  console.log(`  Length:     ${norm1.length}\n`);
  
  console.log(`${label2}:`);
  console.log(`  Raw:        "${text2}"`);
  console.log(`  Normalized: "${norm2}"`);
  console.log(`  Length:     ${norm2.length}\n`);
  
  if (norm1 === norm2) {
    console.log('✅ Normalized forms are IDENTICAL\n');
  } else {
    console.log('❌ Normalized forms DIFFER\n');
    console.log(`Length difference: ${norm1.length - norm2.length}\n`);
    
    // Character-by-character comparison
    const maxLen = Math.max(norm1.length, norm2.length);
    const differences: number[] = [];
    
    for (let i = 0; i < maxLen; i++) {
      if (norm1[i] !== norm2[i]) {
        differences.push(i);
      }
    }
    
    if (differences.length > 0) {
      console.log(`Differences at positions: ${differences.join(', ')}\n`);
      console.log('Character-by-character:');
      differences.slice(0, 10).forEach(pos => {
        const c1 = norm1[pos] || '∅';
        const c2 = norm2[pos] || '∅';
        const cp1 = c1 !== '∅' ? `U+${c1.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')}` : 'missing';
        const cp2 = c2 !== '∅' ? `U+${c2.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')}` : 'missing';
        console.log(`  [${pos}] ${label1}: ${c1} (${cp1}) vs ${label2}: ${c2} (${cp2})`);
      });
      
      if (differences.length > 10) {
        console.log(`  ... and ${differences.length - 10} more differences`);
      }
    }
  }
  
  console.log('\n╚══════════════════════════════════════════════════════════════╝\n');
}

/**
 * Test normalization with a known-good reference
 * Use this to verify that mobile normalization matches web normalization
 */
export function verifyNormalization(
  rawText: string,
  expectedNormalized: string
): boolean {
  const mobileNormalized = normalizeArabic(rawText);
  const match = mobileNormalized === expectedNormalized;
  
  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log('║          NORMALIZATION VERIFICATION                           ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');
  
  console.log('Raw Input:');
  console.log(`  "${rawText}"\n`);
  
  console.log('Mobile Normalized:');
  console.log(`  "${mobileNormalized}"`);
  console.log(`  Length: ${mobileNormalized.length}\n`);
  
  console.log('Expected (Web):');
  console.log(`  "${expectedNormalized}"`);
  console.log(`  Length: ${expectedNormalized.length}\n`);
  
  if (match) {
    console.log('✅ ✅ ✅  NORMALIZATION MATCHES! ✅ ✅ ✅\n');
  } else {
    console.log('❌ NORMALIZATION MISMATCH\n');
    
    logComparison(rawText, expectedNormalized);
  }
  
  console.log('\n╚══════════════════════════════════════════════════════════════╝\n');
  
  return match;
}

/**
 * Quick helper: Log just the basics for a quick check
 */
export function quickCheck(text: string, system: 'maghribi' | 'mashriqi' = 'maghribi'): void {
  const normalized = normalizeArabic(text);
  const profile = computeAbjadProfile(text, normalized, system, 'general');
  
  console.log('\n━━━ QUICK CHECK ━━━');
  console.log(`Raw:    "${text}"`);
  console.log(`Clean:  "${normalized}"`);
  console.log(`Kabir:  ${profile.core.kabir}`);
  console.log(`Saghir: ${profile.core.saghir}`);
  console.log('━━━━━━━━━━━━━━━━━━\n');
}

/**
 * Export all debug functions as a single object for console access
 */
export const AbjadDebug = {
  debug: debugCurrentCalculation,
  compare: compareTexts,
  verify: verifyNormalization,
  quick: quickCheck,
  showNormalization: logNormalizationDebug,
};

// Make it available globally in development
if (process.env.NODE_ENV !== 'production' && typeof global !== 'undefined') {
  (global as any).AbjadDebug = AbjadDebug;
}
