/**
 * Quran Verse Abjad Calculation Tests
 * ====================================
 * Tests to ensure Mobile calculations match Web calculations exactly
 * 
 * Run these tests to verify normalization consistency
 */

import { computeAbjadProfile } from '../abjad-unified-pipeline';
import { normalizeArabic } from '../arabic-normalization';
import { logComparison, logNormalizationDebug } from '../arabicNormalizationDebug';

/**
 * Test case structure
 */
interface QuranTestCase {
  name: string;
  surah: number;
  ayah: number;
  rawTextFromAPI: string;  // What the API might return (with Uthmani marks)
  expectedNormalized: string;  // Expected result after normalization
  expectedKabir: number;  // Expected Kabir (Grand Total) from web
  expectedSaghir: number;  // Expected Saghir (Digital Root) from web
}

/**
 * Test cases with known expected values
 * These values should match the web app calculations
 */
const TEST_CASES: QuranTestCase[] = [
  {
    name: 'Al-Fatiha 1:1 - Bismillah',
    surah: 1,
    ayah: 1,
    // API might return with full Uthmani marks
    rawTextFromAPI: 'بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ',
    expectedNormalized: 'بسماللهالرحمنالرحيم',
    expectedKabir: 786,  // Famous Bismillah value
    expectedSaghir: 3,
  },
  {
    name: 'Al-Fatiha 1:2',
    surah: 1,
    ayah: 2,
    rawTextFromAPI: 'ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ',
    expectedNormalized: 'الحمدللهربالعالمين',
    expectedKabir: 0,  // Replace with actual web value
    expectedSaghir: 0,  // Replace with actual web value
  },
];

/**
 * Run a single test case
 */
function runTestCase(testCase: QuranTestCase, verbose: boolean = false): {
  passed: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`🧪 TEST: ${testCase.name}`);
  console.log(`📖 Surah ${testCase.surah}, Ayah ${testCase.ayah}`);
  console.log(`${'═'.repeat(60)}`);
  
  // Step 1: Test normalization
  const normalized = normalizeArabic(testCase.rawTextFromAPI);
  
  if (verbose) {
    logNormalizationDebug(testCase.rawTextFromAPI);
  }
  
  if (normalized !== testCase.expectedNormalized) {
    errors.push(`Normalization mismatch:\n  Got:      "${normalized}"\n  Expected: "${testCase.expectedNormalized}"`);
    
    if (verbose) {
      logComparison(testCase.rawTextFromAPI, testCase.expectedNormalized);
    }
  } else {
    console.log('✅ Normalization: PASS');
    console.log(`   Result: "${normalized}"`);
  }
  
  // Step 2: Test Abjad calculations (Maghribi system)
  const profile = computeAbjadProfile(testCase.rawTextFromAPI, normalized, 'maghribi', 'quran');
  
  if (testCase.expectedKabir > 0) {
    if (profile.core.kabir !== testCase.expectedKabir) {
      errors.push(`Kabir mismatch: Got ${profile.core.kabir}, Expected ${testCase.expectedKabir}`);
    } else {
      console.log(`✅ Kabir: ${profile.core.kabir} (matches web)`);
    }
  }
  
  if (testCase.expectedSaghir > 0) {
    if (profile.core.saghir !== testCase.expectedSaghir) {
      errors.push(`Saghir mismatch: Got ${profile.core.saghir}, Expected ${testCase.expectedSaghir}`);
    } else {
      console.log(`✅ Saghir: ${profile.core.saghir} (matches web)`);
    }
  }
  
  const passed = errors.length === 0;
  
  if (!passed) {
    console.log('\n❌ TEST FAILED:');
    errors.forEach(err => console.log(`   ${err}`));
  } else {
    console.log('\n✅ TEST PASSED');
  }
  
  return { passed, errors };
}

/**
 * Run all test cases
 */
export function runQuranAbjadTests(verbose: boolean = false): {
  totalTests: number;
  passed: number;
  failed: number;
  failures: Array<{ testName: string; errors: string[] }>;
} {
  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║     QURAN ABJAD CALCULATION TEST SUITE                   ║');
  console.log('║     Mobile vs Web Consistency Verification                ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
  
  const failures: Array<{ testName: string; errors: string[] }> = [];
  let passed = 0;
  
  for (const testCase of TEST_CASES) {
    const result = runTestCase(testCase, verbose);
    
    if (result.passed) {
      passed++;
    } else {
      failures.push({
        testName: testCase.name,
        errors: result.errors,
      });
    }
  }
  
  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║     TEST SUMMARY                                          ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
  console.log(`\nTotal Tests: ${TEST_CASES.length}`);
  console.log(`Passed: ${passed} ✅`);
  console.log(`Failed: ${failures.length} ❌`);
  
  if (failures.length > 0) {
    console.log('\n❌ FAILED TESTS:');
    failures.forEach(f => {
      console.log(`\n  ${f.testName}:`);
      f.errors.forEach(err => console.log(`    - ${err}`));
    });
  }
  
  return {
    totalTests: TEST_CASES.length,
    passed,
    failed: failures.length,
    failures,
  };
}

/**
 * Test a specific verse with detailed debug output
 */
export function testSpecificVerse(
  rawText: string,
  expectedKabir?: number,
  expectedSaghir?: number,
  expectedNormalized?: string
): void {
  console.log('\n╔═══════════════════════════════════════════════════════════╗');
  console.log('║     SPECIFIC VERSE DEBUG TEST                             ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');
  
  // Show detailed normalization debug
  logNormalizationDebug(rawText);
  
  // Normalize
  const normalized = normalizeArabic(rawText);
  
  // Compare with expected if provided
  if (expectedNormalized) {
    logComparison(rawText, expectedNormalized);
  }
  
  // Calculate Abjad
  const profile = computeAbjadProfile(rawText, normalized, 'maghribi', 'quran');
  
  console.log('\n📊 ABJAD CALCULATION RESULTS (Maghribi):');
  console.log(`   Kabir (Grand Total):  ${profile.core.kabir}`);
  console.log(`   Saghir (Digital Root): ${profile.core.saghir}`);
  console.log(`   Hadad (Element Index): ${profile.core.hadad}`);
  console.log(`   Element: ${profile.core.element}`);
  console.log(`   Burj: ${profile.core.burjName} (${profile.core.burjSymbol})`);
  
  if (expectedKabir !== undefined) {
    const kabirMatch = profile.core.kabir === expectedKabir;
    console.log(`\n   Expected Kabir: ${expectedKabir}`);
    console.log(`   ${kabirMatch ? '✅' : '❌'} Kabir ${kabirMatch ? 'MATCHES' : 'MISMATCH'}`);
    if (!kabirMatch) {
      console.log(`   Difference: ${profile.core.kabir - expectedKabir} (${profile.core.kabir > expectedKabir ? '+' : ''}${profile.core.kabir - expectedKabir})`);
    }
  }
  
  if (expectedSaghir !== undefined) {
    const saghirMatch = profile.core.saghir === expectedSaghir;
    console.log(`\n   Expected Saghir: ${expectedSaghir}`);
    console.log(`   ${saghirMatch ? '✅' : '❌'} Saghir ${saghirMatch ? 'MATCHES' : 'MISMATCH'}`);
  }
  
  console.log('\n' + '═'.repeat(60) + '\n');
}

/**
 * Quick test: Verify that the reported issue is fixed
 * Mobile was returning Kabir 7738, Web returns 7728 (difference of 10)
 */
export function testReportedIssue(verseText: string): void {
  const WEB_KABIR = 7728;
  const WEB_SAGHIR = 6;
  const OLD_MOBILE_KABIR = 7738;  // What mobile was incorrectly returning
  
  console.log('\n╔═══════════════════════════════════════════════════════════╗');
  console.log('║     REPORTED ISSUE FIX VERIFICATION                       ║');
  console.log('║     Expected: Kabir 7728, Saghir 6 (like Web)             ║');
  console.log('║     Old Mobile: Kabir 7738 (10 extra)                     ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');
  
  const normalized = normalizeArabic(verseText);
  const profile = computeAbjadProfile(verseText, normalized, 'maghribi', 'quran');
  
  console.log('📊 RESULTS:');
  console.log(`   Normalized: "${normalized}"`);
  console.log(`   Length: ${normalized.length} characters`);
  console.log(`   Kabir: ${profile.core.kabir}`);
  console.log(`   Saghir: ${profile.core.saghir}`);
  
  const kabirFixed = profile.core.kabir === WEB_KABIR;
  const saghirFixed = profile.core.saghir === WEB_SAGHIR;
  const stillBroken = profile.core.kabir === OLD_MOBILE_KABIR;
  
  console.log('\n🔍 VERIFICATION:');
  console.log(`   ${kabirFixed ? '✅' : '❌'} Kabir matches Web (${WEB_KABIR}): ${kabirFixed ? 'YES' : 'NO'}`);
  console.log(`   ${saghirFixed ? '✅' : '❌'} Saghir matches Web (${WEB_SAGHIR}): ${saghirFixed ? 'YES' : 'NO'}`);
  
  if (stillBroken) {
    console.log(`   ⚠️  WARNING: Still returning old incorrect value (${OLD_MOBILE_KABIR})`);
  }
  
  if (kabirFixed && saghirFixed) {
    console.log('\n✅ ✅ ✅  ISSUE FIXED! Mobile now matches Web! ✅ ✅ ✅');
  } else {
    console.log('\n❌ Issue NOT fully resolved. Check normalization.');
    console.log(`   Difference in Kabir: ${profile.core.kabir - WEB_KABIR}`);
    
    // Show debug info
    logNormalizationDebug(verseText);
  }
  
  console.log('\n' + '═'.repeat(60) + '\n');
}
