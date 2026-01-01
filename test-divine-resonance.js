/**
 * Manual Test Script for Divine Resonance
 * Run this in the app to test the implementation
 */

import { ABJAD_MAGHRIBI } from './features/name-destiny/constants/abjadMaps';
import { computeDivineResonance } from './features/name-destiny/services/divineResonance';

console.log('=== Divine Resonance Tests ===\n');

// Test 1: محمد (total 92, index 8 → حكيم)
try {
  const test1 = computeDivineResonance('محمد', ABJAD_MAGHRIBI);
  console.log('Test 1: محمد');
  console.log('Total:', test1.total, '(expected: 92)');
  console.log('Index:', test1.index, '(expected: 8)');
  console.log('Divine Name:', test1.divineName, '(expected: حكيم)');
  console.log('Letter:', test1.letter, '(expected: ح)');
  console.log('✅ Test 1 passed!\n');
} catch (error) {
  console.error('❌ Test 1 failed:', error);
}

// Test 2: Total < 28 (ك = 20 → رحمن)
try {
  const test2 = computeDivineResonance('ك', ABJAD_MAGHRIBI);
  console.log('Test 2: ك (total < 28)');
  console.log('Total:', test2.total, '(expected: 20)');
  console.log('Index:', test2.index, '(expected: 20)');
  console.log('Divine Name:', test2.divineName, '(expected: رحمن)');
  console.log('✅ Test 2 passed!\n');
} catch (error) {
  console.error('❌ Test 2 failed:', error);
}

// Test 3: Total = 28 (اكز = 28 → غني)
try {
  const test3 = computeDivineResonance('اكز', ABJAD_MAGHRIBI);
  console.log('Test 3: اكز (total = 28)');
  console.log('Total:', test3.total, '(expected: 28)');
  console.log('Index:', test3.index, '(expected: 28)');
  console.log('Divine Name:', test3.divineName, '(expected: غني)');
  console.log('✅ Test 3 passed!\n');
} catch (error) {
  console.error('❌ Test 3 failed:', error);
}

// Test 4: Index 11 (دز = 11 → كريم)
try {
  const test4 = computeDivineResonance('دز', ABJAD_MAGHRIBI);
  console.log('Test 4: دز (index 11)');
  console.log('Total:', test4.total, '(expected: 11)');
  console.log('Index:', test4.index, '(expected: 11)');
  console.log('Divine Name:', test4.divineName, '(expected: كريم)');
  console.log('✅ Test 4 passed!\n');
} catch (error) {
  console.error('❌ Test 4 failed:', error);
}

// Test 5: Normalization (مُحَمَّد with tashkeel)
try {
  const test5 = computeDivineResonance('مُحَمَّد', ABJAD_MAGHRIBI);
  console.log('Test 5: مُحَمَّد (with tashkeel)');
  console.log('Normalized:', test5.normalized, '(expected: محمد)');
  console.log('Total:', test5.total, '(expected: 92)');
  console.log('Divine Name:', test5.divineName, '(expected: حكيم)');
  console.log('✅ Test 5 passed!\n');
} catch (error) {
  console.error('❌ Test 5 failed:', error);
}

console.log('=== All tests completed ===');
