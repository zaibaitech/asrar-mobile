/**
 * Test Script for Asrariya Timing Engine
 * 
 * Notes:
 * - This script is intentionally standalone and uses dynamic imports so we can
 *   set `__DEV__` before loading app modules (some data files reference it).
 *
 * Run with:
 *   npx ts-node -P scripts/tsconfig.json scripts/test-asrariya-timing.ts
 */

import type {
    CurrentMoment,
    PracticeCategory,
    RecommendationLevel,
    UserIntent,
    UserSpiritalProfile,
} from '../services/AsrariyaTimingEngine/index';

// In Node, `__DEV__` is usually undefined. Some RN-oriented modules reference it.
// Define it before importing app code.
if (typeof (globalThis as any).__DEV__ === 'undefined') {
  (globalThis as any).__DEV__ = false;
}

// ============================================
// Test Data
// ============================================

const testProfile: UserSpiritalProfile = {
  name: 'Test User',
  motherName: 'Test Mother',
  burjIndex: 1,
  burjName: 'Aries',
  element: 'fire',
  rulingPlanet: 'mars',
  personalManazil: 0,
};

const testLocation = { latitude: 21.3891, longitude: 39.8579 };

const testIntents: UserIntent[] = [
  { category: 'protection', intensity: 'moderate' },
  { category: 'healing', intensity: 'deep' },
  { category: 'manifestation', intensity: 'moderate' },
  { category: 'guidance', intensity: 'light' },
  { category: 'gratitude', intensity: 'light' },
  { category: 'knowledge', intensity: 'moderate' },
  { category: 'provision', intensity: 'deep' },
  { category: 'general', intensity: 'light' },
];

// ============================================
// Utility Functions
// ============================================

function colorize(text: string, color: string): string {
  const colors: Record<string, string> = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    magenta: '\x1b[35m',
    reset: '\x1b[0m',
    bold: '\x1b[1m',
  };
  return `${colors[color] || ''}${text}${colors.reset}`;
}

function getRecommendationColor(level: RecommendationLevel): string {
  switch (level) {
    case 'highly-favorable':
      return 'green';
    case 'favorable':
      return 'cyan';
    case 'moderate':
      return 'yellow';
    case 'cautious':
      return 'magenta';
    case 'challenging':
      return 'red';
    default:
      return 'reset';
  }
}

function getScoreColor(score: number): string {
  return score >= 70 ? 'green' : score >= 40 ? 'yellow' : 'red';
}

function printHeader(title: string): void {
  console.log('\n' + colorize('═'.repeat(60), 'blue'));
  console.log(colorize(`  ${title}`, 'bold'));
  console.log(colorize('═'.repeat(60), 'blue'));
}

function printSubHeader(title: string): void {
  console.log('\n' + colorize(`── ${title} ──`, 'cyan'));
}

function printScore(label: string, score: number, maxScore: number = 100): void {
  const percentage = Math.round((score / maxScore) * 100);
  const bar = '█'.repeat(Math.floor(percentage / 5)) + '░'.repeat(20 - Math.floor(percentage / 5));
  const color = percentage >= 70 ? 'green' : percentage >= 40 ? 'yellow' : 'red';
  console.log(`  ${label.padEnd(25)} ${colorize(bar, color)} ${percentage}%`);
}

// ============================================
// Test Functions
// ============================================

async function testLayerAnalysis(asrariya: typeof import('../services/AsrariyaTimingEngine/index'), moment: CurrentMoment): Promise<void> {
  printHeader('LAYER ANALYSIS TESTS');

  const baseIntent: UserIntent = { category: 'general', intensity: 'light' };

  // Test Element Compatibility
  printSubHeader('Layer 1: Element Compatibility');
  const elementResult = asrariya.analyzeElementCompatibility(testProfile, moment, baseIntent);
  console.log(`  Profile Element: ${testProfile.element}`);
  console.log(`  Day Element:     ${moment.dayElement}`);
  console.log(`  Hour Element:    ${moment.planetaryHourElement}`);
  if (moment.currentManazilData) {
    console.log(`  Manazil Element: ${moment.currentManazilData.element}`);
  }
  printScore('Compatibility Score', elementResult.score);
  console.log(`  Reasoning: ${elementResult.reasoning}`);

  // Test Planetary Resonance
  printSubHeader('Layer 2: Planetary Resonance');
  const planetaryResult = asrariya.analyzePlanetaryResonance(testProfile, moment, baseIntent);
  console.log(`  Day Ruler:      ${moment.dayRuler}`);
  console.log(`  Hour Planet:    ${moment.planetaryHourPlanet}`);
  console.log(`  Ruling Planet:  ${testProfile.rulingPlanet || '(none)'}`);
  printScore('Resonance Score', planetaryResult.score);
  console.log(`  Reasoning: ${planetaryResult.reasoning}`);

  // Test Manazil Alignment
  printSubHeader('Layer 3: Manazil Alignment');
  const manazilResult = asrariya.analyzeManazilAlignment(testProfile, moment, baseIntent);
  console.log(`  Current Manazil: #${moment.currentManazil}`);
  if (moment.currentManazilData) {
    console.log(`  Mansion: ${moment.currentManazilData.nameEnglish} (${moment.currentManazilData.nameTransliteration})`);
    console.log(`  Element: ${moment.currentManazilData.element}`);
  }
  printScore('Alignment Score', manazilResult.score);
  console.log(`  Reasoning: ${manazilResult.reasoning}`);

  // Test Practice Mapping for different intents
  printSubHeader('Layer 4: Practice Mapping (by category)');
  for (const intent of testIntents) {
    const practiceResult = asrariya.analyzePracticeMapping(testProfile, moment, intent);
    const color = practiceResult.score >= 70 ? 'green' : practiceResult.score >= 40 ? 'yellow' : 'red';
    console.log(`  ${intent.category.padEnd(15)} → ${colorize(practiceResult.score.toString().padStart(3), color)}% | ${practiceResult.reasoning.slice(0, 45)}...`);
  }
}

async function testFullEngineAnalysis(asrariya: typeof import('../services/AsrariyaTimingEngine/index'), moment: CurrentMoment): Promise<void> {
  printHeader('FULL ENGINE ANALYSIS');

  for (const intent of testIntents.slice(0, 4)) {
    printSubHeader(`Practice: ${intent.category.toUpperCase()}`);
    
    const result = await asrariya.analyzeTimingForPractice(testProfile, intent, {
      location: testLocation,
      moment,
    });
    
    console.log(`\n  ${colorize('Overall Result:', 'bold')}`);
    console.log(`  Level:  ${colorize(result.level.toUpperCase(), getRecommendationColor(result.level))}`);
    console.log(`  Action: ${result.action}`);
    printScore('Overall Score', result.overallScore);
    console.log(`  Summary: ${result.shortSummary}`);
    
    console.log(`\n  ${colorize('Layer Breakdown:', 'bold')}`);
    printScore('Element', result.layers.elementCompatibility.score);
    printScore('Planetary', result.layers.planetaryResonance.score);
    printScore('Manazil', result.layers.manazilAlignment.score);
    printScore('Practice', result.layers.practiceMapping.score);
    
    console.log(`\n  ${colorize('Recommendation:', 'bold')}`);
    console.log(`  ${result.reasoning}`);
    
    if (result.enhancements.length > 0) {
      console.log(`\n  ${colorize('Enhancements:', 'bold')}`);
      result.enhancements.slice(0, 3).forEach(e => console.log(`  • ${e.text}`));
    }
    if (result.cautions.length > 0) {
      console.log(`\n  ${colorize('Cautions:', 'bold')}`);
      result.cautions.slice(0, 3).forEach(c => console.log(`  • ${c}`));
    }
  }
}

async function testQuickCheck(asrariya: typeof import('../services/AsrariyaTimingEngine/index')): Promise<void> {
  printHeader('QUICK TIMING CHECK');

  const categories: PracticeCategory[] = ['protection', 'healing', 'manifestation', 'guidance', 'gratitude', 'knowledge', 'provision', 'general'];
  
  console.log('\n  Checking all practice categories at current moment:\n');
  
  for (const category of categories) {
    const quick = await asrariya.quickTimingCheck(testProfile, category, testLocation);
    const isGood = quick.isGoodTime ? colorize('YES', 'green') : colorize('NO', 'red');
    const scoreColor = getScoreColor(quick.score);
    console.log(
      `  ${category.padEnd(15)} │ ` +
      `${isGood.padEnd(12)} │ ` +
      `Score: ${colorize(quick.score.toString().padStart(3), scoreColor)}% │ ` +
      `${quick.summary}`
    );
  }
}

async function testNextOptimalWindow(asrariya: typeof import('../services/AsrariyaTimingEngine/index')): Promise<void> {
  printHeader('NEXT OPTIMAL WINDOW FINDER');

  const intent: UserIntent = { category: 'protection', intensity: 'moderate' };
  
  console.log(`\n  Finding next optimal window for: ${intent.category}`);
  console.log(`  Current time: ${new Date().toLocaleString()}`);
  
  const nextWindow = await asrariya.findNextOptimalWindow(testProfile, intent, {
    location: testLocation,
    lookAheadHours: 12,
    minimumScore: 70,
  });
  
  if (nextWindow) {
    console.log(`\n  ${colorize('✓ Optimal window found!', 'green')}`);
    console.log(`  Window: ${nextWindow.startTime.toLocaleString()} → ${nextWindow.endTime.toLocaleString()}`);
    console.log(`  Expected score: ${nextWindow.expectedScore}%`);
    console.log(`  Description: ${nextWindow.description}`);
  } else {
    console.log(`\n  ${colorize('✗ No optimal window found in next 12 hours', 'yellow')}`);
  }
}

async function testEdgeCases(
  asrariya: typeof import('../services/AsrariyaTimingEngine/index'),
  moment: CurrentMoment
): Promise<void> {
  printHeader('EDGE CASE TESTS');

  // Test with minimal profile
  printSubHeader('Minimal Profile (only element)');
  const minimalProfile: UserSpiritalProfile = { name: 'Minimal', element: 'water' };
  const result1 = await asrariya.quickTimingCheck(minimalProfile, 'healing', testLocation);
  console.log(`  Water profile → ${colorize(result1.score.toString(), getScoreColor(result1.score))}% (${result1.summary})`);

  // Test with different manazil indices
  printSubHeader('Different Manazil Indices');
  const { getLunarMansionByIndex } = await import('../data/lunarMansions');
  const manazilIndices = [0, 7, 14, 23, 27];
  for (const idx of manazilIndices) {
    const momentWithManazil: CurrentMoment = {
      ...moment,
      currentManazil: idx,
      currentManazilData: getLunarMansionByIndex(idx) || undefined,
    };
    const res = await asrariya.analyzeTimingForPractice(testProfile, { category: 'manifestation' }, { moment: momentWithManazil, location: testLocation });
    const mansionName = momentWithManazil.currentManazilData?.nameEnglish || 'Unknown';
    console.log(
      `  #${idx.toString().padStart(2)} ${mansionName.padEnd(24)} → ` +
      `${colorize(res.overallScore.toString().padStart(3), getScoreColor(res.overallScore))}% ` +
      `(${colorize(res.level, getRecommendationColor(res.level))})`
    );
  }

  // Test intensity variations
  printSubHeader('Intent Intensity Variations');
  const intensities = ['light', 'moderate', 'deep'] as const;
  
  for (const intensity of intensities) {
    const intent: UserIntent = { category: 'guidance', intensity };
    const result = await asrariya.analyzeTimingForPractice(testProfile, intent, { moment, location: testLocation });
    console.log(
      `  ${intensity.padEnd(10)} intensity → ` +
      `${colorize(result.level.padEnd(18), getRecommendationColor(result.level))} ` +
      `(${colorize(result.overallScore.toString().padStart(3), getScoreColor(result.overallScore))}%)`
    );
  }
}

async function testWeightConfigurations(asrariya: typeof import('../services/AsrariyaTimingEngine/index')): Promise<void> {
  printHeader('WEIGHT CONFIGURATION ANALYSIS');

  console.log('\n  Practice-specific weight distributions:\n');
  console.log('  Category'.padEnd(18) + 'Element  Planet   Manazil  Practice');
  console.log('  ' + '─'.repeat(55));
  
  for (const [category, weights] of Object.entries(asrariya.PRACTICE_WEIGHT_CONFIGS)) {
    const merged = { ...asrariya.DEFAULT_ENGINE_CONFIG, ...(weights || {}) };
    console.log(
      `  ${category.padEnd(16)} ` +
      `${(merged.elementWeight * 100).toFixed(0).padStart(5)}%   ` +
      `${(merged.planetaryWeight * 100).toFixed(0).padStart(5)}%   ` +
      `${(merged.manazilWeight * 100).toFixed(0).padStart(5)}%   ` +
      `${(merged.practiceWeight * 100).toFixed(0).padStart(5)}%`
    );
  }
}

// ============================================
// Run All Tests
// ============================================

async function runAllTests(): Promise<void> {
  console.log(colorize('\n╔══════════════════════════════════════════════════════════╗', 'magenta'));
  console.log(colorize('║       ASRARIYA TIMING ENGINE - TEST SUITE                ║', 'magenta'));
  console.log(colorize('║       "Is THIS moment favorable for ME to do THIS?"      ║', 'magenta'));
  console.log(colorize('╚══════════════════════════════════════════════════════════╝', 'magenta'));

  const asrariya = await import('../services/AsrariyaTimingEngine/index.ts');
  const testMoment = await asrariya.buildCurrentMoment(testLocation, new Date());

  try {
    await testWeightConfigurations(asrariya);
    await testLayerAnalysis(asrariya, testMoment);
    await testFullEngineAnalysis(asrariya, testMoment);
    await testQuickCheck(asrariya);
    await testNextOptimalWindow(asrariya);
    await testEdgeCases(asrariya, testMoment);

    console.log('\n' + colorize('═'.repeat(60), 'green'));
    console.log(colorize('  ✓ ALL TESTS COMPLETED SUCCESSFULLY', 'green'));
    console.log(colorize('═'.repeat(60), 'green') + '\n');
  } catch (error) {
    console.error('\n' + colorize('═'.repeat(60), 'red'));
    console.error(colorize('  ✗ TEST FAILED', 'red'));
    console.error(colorize('═'.repeat(60), 'red'));
    console.error(error);
    process.exit(1);
  }
}

// Run tests
runAllTests().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
});
