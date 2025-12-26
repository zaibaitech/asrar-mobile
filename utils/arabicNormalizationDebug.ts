/**
 * Arabic Normalization Debug Utilities
 * =====================================
 * Tools to diagnose Abjad calculation discrepancies between Web and Mobile
 * 
 * Usage:
 * - Enable DEBUG_MODE to see detailed normalization logs
 * - Use debugNormalization() to analyze specific text
 * - Compare with expected values from web app
 */

import { normalizeArabic } from './arabic-normalization';

/**
 * Debug flag - set to true to enable detailed logging
 */
export let DEBUG_MODE = false;

export function setDebugMode(enabled: boolean): void {
  DEBUG_MODE = enabled;
}

/**
 * Character classification for debugging
 */
interface CharInfo {
  char: string;
  codePoint: string;
  category: string;
  description: string;
}

/**
 * Get detailed info about a character
 */
function getCharInfo(char: string): CharInfo {
  const code = char.charCodeAt(0);
  const codePoint = `U+${code.toString(16).toUpperCase().padStart(4, '0')}`;
  
  let category = 'OTHER';
  let description = char;
  
  // Arabic Letters
  if (code >= 0x0621 && code <= 0x064A) {
    category = 'ARABIC_LETTER';
    description = char;
  }
  // Diacritics
  else if (code >= 0x064B && code <= 0x065F) {
    category = 'DIACRITIC';
    const marks: Record<number, string> = {
      0x064B: 'FATHATAN', 0x064C: 'DAMMATAN', 0x064D: 'KASRATAN',
      0x064E: 'FATHA', 0x064F: 'DAMMA', 0x0650: 'KASRA',
      0x0651: 'SHADDA', 0x0652: 'SUKUN', 0x0653: 'MADDAH',
      0x0654: 'HAMZA_ABOVE', 0x0655: 'HAMZA_BELOW',
      0x0656: 'SUBSCRIPT_ALEF', 0x0657: 'INVERTED_DAMMA',
      0x0658: 'MARK_NOON_GHUNNA', 0x0659: 'ZWARAKAY',
      0x065A: 'VOWEL_SIGN_SMALL_V_ABOVE', 0x065B: 'VOWEL_SIGN_INVERTED_SMALL_V_ABOVE',
      0x065C: 'VOWEL_SIGN_DOT_BELOW', 0x065D: 'REVERSED_DAMMA',
      0x065E: 'FATHA_WITH_TWO_DOTS', 0x065F: 'WAVY_HAMZA_BELOW',
    };
    description = marks[code] || description;
  }
  // Quranic marks
  else if ((code >= 0x06D6 && code <= 0x06ED) || (code >= 0x0615 && code <= 0x061A)) {
    category = 'QURANIC_MARK';
    const marks: Record<number, string> = {
      0x06D6: 'SMALL_HIGH_LIGATURE_SAD_WITH_LAM_WITH_ALEF_MAKSURA',
      0x06D7: 'SMALL_HIGH_LIGATURE_QAF_WITH_LAM_WITH_ALEF_MAKSURA',
      0x06D8: 'SMALL_HIGH_MEEM_INITIAL_FORM',
      0x06D9: 'SMALL_HIGH_LAM_ALEF',
      0x06DA: 'SMALL_HIGH_JEEM',
      0x06DB: 'SMALL_HIGH_THREE_DOTS',
      0x06DC: 'SMALL_HIGH_SEEN',
      0x06DD: 'END_OF_AYAH',
      0x06DE: 'START_OF_RUB_EL_HIZB',
      0x06DF: 'SMALL_HIGH_ROUNDED_ZERO',
      0x06E0: 'SMALL_HIGH_UPRIGHT_RECTANGULAR_ZERO',
      0x06E1: 'SMALL_HIGH_DOTLESS_HEAD_OF_KHAH',
      0x06E2: 'SMALL_HIGH_MEEM_ISOLATED_FORM',
      0x06E3: 'SMALL_LOW_SEEN',
      0x06E4: 'SMALL_HIGH_MADDA',
      0x06E5: 'SMALL_WAW',
      0x06E6: 'SMALL_YEH',
      0x06E7: 'SMALL_HIGH_YEH',
      0x06E8: 'SMALL_HIGH_NOON',
      0x06E9: 'PLACE_OF_SAJDAH',
      0x06EA: 'EMPTY_CENTRE_LOW_STOP',
      0x06EB: 'EMPTY_CENTRE_HIGH_STOP',
      0x06EC: 'ROUNDED_HIGH_STOP_WITH_FILLED_CENTRE',
      0x06ED: 'SMALL_LOW_MEEM',
      0x0615: 'SMALL_HIGH_TAH',
      0x0617: 'SMALL_HIGH_ZAIN',
      0x0618: 'SMALL_FATHA',
      0x0619: 'SMALL_DAMMA',
      0x061A: 'SMALL_KASRA',
    };
    description = marks[code] || description;
  }
  // Tatweel
  else if (code === 0x0640) {
    category = 'TATWEEL';
    description = 'TATWEEL (KASHIDA)';
  }
  // Alif variants
  else if ([0x0623, 0x0625, 0x0622, 0x0671].includes(code)) {
    category = 'ALIF_VARIANT';
    const variants: Record<number, string> = {
      0x0623: 'ALIF_WITH_HAMZA_ABOVE',
      0x0625: 'ALIF_WITH_HAMZA_BELOW',
      0x0622: 'ALIF_WITH_MADDA_ABOVE',
      0x0671: 'ALIF_WASLA',
    };
    description = variants[code] || description;
  }
  // Special characters
  else if (code === 0x0629) {
    category = 'TA_MARBUTA';
    description = 'TA MARBUTA';
  }
  else if (code === 0x0649) {
    category = 'ALIF_MAKSURA';
    description = 'ALIF MAKSURA';
  }
  else if (code === 0x0626) {
    category = 'YEH_WITH_HAMZA';
    description = 'YEH WITH HAMZA ABOVE';
  }
  else if (code === 0x0624) {
    category = 'WAW_WITH_HAMZA';
    description = 'WAW WITH HAMZA ABOVE';
  }
  // Digits
  else if ((code >= 0x0030 && code <= 0x0039) || (code >= 0x0660 && code <= 0x0669)) {
    category = 'DIGIT';
  }
  // Whitespace
  else if (/\s/.test(char)) {
    category = 'WHITESPACE';
  }
  // Punctuation
  else if (/[.,;:!?،؛؟]/.test(char)) {
    category = 'PUNCTUATION';
  }
  
  return { char, codePoint, category, description };
}

/**
 * Debug normalization result with detailed character analysis
 */
export interface NormalizationDebugResult {
  rawText: string;
  rawLength: number;
  cleanText: string;
  cleanLength: number;
  charactersRemoved: number;
  rawCharacters: CharInfo[];
  cleanCharacters: CharInfo[];
  removedCharacters: CharInfo[];
  categoryCounts: {
    raw: Record<string, number>;
    removed: Record<string, number>;
  };
}

/**
 * Analyze normalization process in detail
 * 
 * @param text - Raw Arabic text to analyze
 * @returns Detailed breakdown of normalization process
 */
export function debugNormalization(text: string): NormalizationDebugResult {
  const rawText = text;
  const cleanText = normalizeArabic(text);
  
  // Analyze characters
  const rawChars = Array.from(rawText).map(getCharInfo);
  const cleanChars = Array.from(cleanText).map(getCharInfo);
  
  // Find removed characters
  const cleanSet = new Set(cleanText);
  const removedChars: CharInfo[] = [];
  const rawCharMap = new Map<string, number>();
  const cleanCharMap = new Map<string, number>();
  
  // Count occurrences in raw
  for (const char of rawText) {
    rawCharMap.set(char, (rawCharMap.get(char) || 0) + 1);
  }
  
  // Count occurrences in clean
  for (const char of cleanText) {
    cleanCharMap.set(char, (cleanCharMap.get(char) || 0) + 1);
  }
  
  // Find removed
  for (const [char, rawCount] of rawCharMap.entries()) {
    const cleanCount = cleanCharMap.get(char) || 0;
    const removedCount = rawCount - cleanCount;
    
    if (removedCount > 0) {
      const info = getCharInfo(char);
      for (let i = 0; i < removedCount; i++) {
        removedChars.push(info);
      }
    }
  }
  
  // Count by category
  const rawCategoryCounts: Record<string, number> = {};
  const removedCategoryCounts: Record<string, number> = {};
  
  for (const info of rawChars) {
    rawCategoryCounts[info.category] = (rawCategoryCounts[info.category] || 0) + 1;
  }
  
  for (const info of removedChars) {
    removedCategoryCounts[info.category] = (removedCategoryCounts[info.category] || 0) + 1;
  }
  
  return {
    rawText,
    rawLength: rawText.length,
    cleanText,
    cleanLength: cleanText.length,
    charactersRemoved: rawText.length - cleanText.length,
    rawCharacters: rawChars,
    cleanCharacters: cleanChars,
    removedCharacters: removedChars,
    categoryCounts: {
      raw: rawCategoryCounts,
      removed: removedCategoryCounts,
    },
  };
}

/**
 * Print formatted debug output to console
 */
export function logNormalizationDebug(text: string): void {
  const debug = debugNormalization(text);
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 ARABIC NORMALIZATION DEBUG');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  console.log('📝 RAW TEXT:');
  console.log(`   "${debug.rawText}"`);
  console.log(`   Length: ${debug.rawLength} characters\n`);
  
  console.log('✨ CLEAN TEXT:');
  console.log(`   "${debug.cleanText}"`);
  console.log(`   Length: ${debug.cleanLength} characters\n`);
  
  console.log(`🗑️  REMOVED: ${debug.charactersRemoved} characters\n`);
  
  if (debug.removedCharacters.length > 0) {
    console.log('❌ REMOVED CHARACTERS:');
    const grouped = new Map<string, CharInfo[]>();
    for (const info of debug.removedCharacters) {
      const key = info.category;
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key)!.push(info);
    }
    
    for (const [category, chars] of grouped.entries()) {
      console.log(`\n   ${category} (${chars.length}):`);
      const unique = Array.from(new Set(chars.map(c => c.codePoint)));
      for (const cp of unique) {
        const char = chars.find(c => c.codePoint === cp)!;
        const count = chars.filter(c => c.codePoint === cp).length;
        console.log(`   - ${char.codePoint} "${char.char}" ${char.description} (×${count})`);
      }
    }
  }
  
  console.log('\n\n📊 CHARACTER CATEGORIES:');
  console.log('\n   RAW TEXT:');
  for (const [cat, count] of Object.entries(debug.categoryCounts.raw)) {
    console.log(`   - ${cat}: ${count}`);
  }
  
  if (Object.keys(debug.categoryCounts.removed).length > 0) {
    console.log('\n   REMOVED:');
    for (const [cat, count] of Object.entries(debug.categoryCounts.removed)) {
      console.log(`   - ${cat}: ${count}`);
    }
  }
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

/**
 * Compare mobile normalization with expected web result
 */
export interface ComparisonResult {
  match: boolean;
  mobileNormalized: string;
  expectedNormalized: string;
  difference: string;
  mobileLength: number;
  expectedLength: number;
  lengthDifference: number;
}

/**
 * Compare normalization result with expected value from web app
 */
export function compareWithExpected(
  rawText: string,
  expectedNormalized: string
): ComparisonResult {
  const mobileNormalized = normalizeArabic(rawText);
  const match = mobileNormalized === expectedNormalized;
  
  let difference = '';
  if (!match) {
    // Find differences character by character
    const maxLen = Math.max(mobileNormalized.length, expectedNormalized.length);
    const diffs: string[] = [];
    
    for (let i = 0; i < maxLen; i++) {
      const mobileChar = mobileNormalized[i] || '∅';
      const expectedChar = expectedNormalized[i] || '∅';
      
      if (mobileChar !== expectedChar) {
        const mobileInfo = mobileChar !== '∅' ? getCharInfo(mobileChar) : null;
        const expectedInfo = expectedChar !== '∅' ? getCharInfo(expectedChar) : null;
        
        diffs.push(
          `[${i}] Mobile: ${mobileChar} ${mobileInfo?.codePoint || ''} vs Expected: ${expectedChar} ${expectedInfo?.codePoint || ''}`
        );
      }
    }
    
    difference = diffs.join('\n');
  }
  
  return {
    match,
    mobileNormalized,
    expectedNormalized,
    difference,
    mobileLength: mobileNormalized.length,
    expectedLength: expectedNormalized.length,
    lengthDifference: mobileNormalized.length - expectedNormalized.length,
  };
}

/**
 * Log comparison with expected result
 */
export function logComparison(rawText: string, expectedNormalized: string): void {
  const result = compareWithExpected(rawText, expectedNormalized);
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔬 MOBILE vs WEB COMPARISON');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  console.log(`Result: ${result.match ? '✅ MATCH' : '❌ MISMATCH'}\n`);
  
  console.log('📱 MOBILE:');
  console.log(`   "${result.mobileNormalized}"`);
  console.log(`   Length: ${result.mobileLength}\n`);
  
  console.log('🌐 WEB (Expected):');
  console.log(`   "${result.expectedNormalized}"`);
  console.log(`   Length: ${result.expectedLength}\n`);
  
  if (!result.match) {
    console.log(`⚠️  Length Difference: ${result.lengthDifference > 0 ? '+' : ''}${result.lengthDifference}\n`);
    console.log('🔍 DIFFERENCES:');
    console.log(result.difference);
  }
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}
