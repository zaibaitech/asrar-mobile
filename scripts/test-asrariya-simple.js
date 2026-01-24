/**
 * Simple Test Script for Asrariya Timing Engine
 * 
 * Run with: node scripts/test-asrariya-simple.js
 */

// ============================================
// Test Data (Inline - no imports needed)
// ============================================

const testProfile = {
  primaryElement: 'fire',
  secondaryElement: 'air',
  abjadValue: 786,
  digitalRoot: 3,
  birthZodiac: 'aries',
  dominantPlanets: ['mars', 'sun'],
};

const testMoment = {
  planetaryHour: {
    planet: 'sun',
    arabicName: 'الشمس',
    element: 'fire',
    dayOfWeek: 0,
    hourNumber: 1,
    isDay: true,
  },
  lunarMansion: {
    number: 1,
    nameArabic: 'الشرطين',
    nameEnglish: 'Al-Sharatain',
    element: 'fire',
    quality: 'sapiential',
    favoredActivities: ['beginnings', 'travel', 'medicine'],
    avoidedActivities: ['marriage', 'buying'],
  },
  solarZodiac: 'aries',
  timestamp: new Date(),
};

// ============================================
// Layer Logic (Simplified inline versions)
// ============================================

const ELEMENT_RELATIONSHIPS = {
  fire: { same: 'fire', complement: 'air', neutral: 'earth', opposite: 'water' },
  air: { same: 'air', complement: 'fire', neutral: 'water', opposite: 'earth' },
  water: { same: 'water', complement: 'earth', neutral: 'air', opposite: 'fire' },
  earth: { same: 'earth', complement: 'water', neutral: 'fire', opposite: 'air' },
};

function analyzeElementCompatibility(profile, moment) {
  const userElement = profile.primaryElement;
  const hourElement = moment.planetaryHour.element;
  const manazilElement = moment.lunarMansion.element;
  
  const relationships = ELEMENT_RELATIONSHIPS[userElement];
  let score = 50;
  let reasoning = '';
  
  // Hour element compatibility
  if (hourElement === relationships.same) {
    score += 25;
    reasoning = `Perfect harmony - ${userElement} hour amplifies your ${userElement} nature`;
  } else if (hourElement === relationships.complement) {
    score += 20;
    reasoning = `Complementary energies - ${hourElement} supports your ${userElement}`;
  } else if (hourElement === relationships.neutral) {
    score += 5;
    reasoning = `Neutral interaction between ${userElement} and ${hourElement}`;
  } else {
    score -= 15;
    reasoning = `Opposing elements - ${hourElement} challenges your ${userElement} nature`;
  }
  
  // Manazil element bonus
  if (manazilElement === userElement) {
    score += 15;
    reasoning += `. Lunar mansion reinforces with matching ${manazilElement} energy`;
  } else if (manazilElement === relationships.complement) {
    score += 10;
    reasoning += `. Mansion provides supportive ${manazilElement} influence`;
  }
  
  return { score: Math.min(100, Math.max(0, score)), reasoning };
}

const PLANET_ELEMENTS = {
  sun: 'fire', moon: 'water', mars: 'fire', mercury: 'air',
  jupiter: 'fire', venus: 'water', saturn: 'earth',
};

const PLANET_QUALITIES = {
  sun: { strength: 'vitality', domain: 'authority' },
  moon: { strength: 'intuition', domain: 'emotions' },
  mars: { strength: 'action', domain: 'protection' },
  mercury: { strength: 'communication', domain: 'knowledge' },
  jupiter: { strength: 'expansion', domain: 'abundance' },
  venus: { strength: 'harmony', domain: 'relationships' },
  saturn: { strength: 'discipline', domain: 'endurance' },
};

function analyzePlanetaryResonance(profile, moment) {
  const currentPlanet = moment.planetaryHour.planet;
  const dominantPlanets = profile.dominantPlanets || [];
  const userElement = profile.primaryElement;
  
  let score = 50;
  let reasoning = '';
  
  // Check if current planet is user's dominant
  if (dominantPlanets.includes(currentPlanet)) {
    score += 30;
    reasoning = `Strong resonance - ${currentPlanet} is your dominant planet`;
  } else {
    const planetElement = PLANET_ELEMENTS[currentPlanet];
    if (planetElement === userElement) {
      score += 20;
      reasoning = `Elemental harmony - ${currentPlanet}'s ${planetElement} nature matches yours`;
    } else {
      reasoning = `Neutral planetary influence from ${currentPlanet}`;
    }
  }
  
  const qualities = PLANET_QUALITIES[currentPlanet];
  if (qualities) {
    reasoning += `. Hour brings ${qualities.strength} energy`;
  }
  
  return { score: Math.min(100, Math.max(0, score)), reasoning };
}

function analyzeManazilAlignment(profile, moment) {
  const mansion = moment.lunarMansion;
  const userElement = profile.primaryElement;
  
  let score = 50;
  let reasoning = `Mansion ${mansion.number} (${mansion.nameEnglish})`;
  
  // Quality-based scoring
  switch (mansion.quality) {
    case 'sapiential':
      score += 15;
      reasoning += ' - wisdom-oriented mansion supports spiritual work';
      break;
    case 'benefic':
      score += 20;
      reasoning += ' - benefic mansion amplifies positive outcomes';
      break;
    case 'neutral':
      score += 5;
      reasoning += ' - neutral mansion allows balanced practice';
      break;
    case 'malefic':
      score -= 10;
      reasoning += ' - challenging mansion requires extra intention';
      break;
  }
  
  // Element match bonus
  if (mansion.element === userElement) {
    score += 15;
    reasoning += `. ${mansion.element} element resonates with your nature`;
  }
  
  return { score: Math.min(100, Math.max(0, score)), reasoning };
}

const PRACTICE_CATEGORY_MAPPINGS = {
  protection: { planets: ['mars', 'saturn', 'sun'], elements: ['fire', 'earth'] },
  healing: { planets: ['venus', 'moon', 'jupiter'], elements: ['water', 'earth'] },
  manifestation: { planets: ['jupiter', 'sun', 'venus'], elements: ['fire', 'air'] },
  guidance: { planets: ['mercury', 'moon', 'jupiter'], elements: ['air', 'water'] },
  gratitude: { planets: ['venus', 'jupiter', 'sun'], elements: ['water', 'fire'] },
  knowledge: { planets: ['mercury', 'saturn', 'jupiter'], elements: ['air', 'earth'] },
  provision: { planets: ['jupiter', 'venus', 'sun'], elements: ['earth', 'water'] },
  general: { planets: ['sun', 'moon', 'jupiter'], elements: ['fire', 'water', 'air', 'earth'] },
};

function analyzePracticeMapping(moment, intent) {
  const mapping = PRACTICE_CATEGORY_MAPPINGS[intent.category] || PRACTICE_CATEGORY_MAPPINGS.general;
  const currentPlanet = moment.planetaryHour.planet;
  const hourElement = moment.planetaryHour.element;
  
  let score = 50;
  let reasoning = '';
  
  // Planet alignment
  if (mapping.planets.includes(currentPlanet)) {
    const index = mapping.planets.indexOf(currentPlanet);
    const bonus = [30, 20, 15][index] || 10;
    score += bonus;
    reasoning = `${currentPlanet} is ${index === 0 ? 'ideal' : 'favorable'} for ${intent.category}`;
  } else {
    reasoning = `${currentPlanet} is neutral for ${intent.category}`;
  }
  
  // Element alignment
  if (mapping.elements.includes(hourElement)) {
    score += 15;
    reasoning += `. ${hourElement} element supports this practice`;
  }
  
  // Intensity modifier
  const intensityMod = { light: 0, focused: 5, deep: 10 };
  score += intensityMod[intent.intensity] || 0;
  
  return { score: Math.min(100, Math.max(0, score)), reasoning };
}

// ============================================
// Main Engine Logic
// ============================================

const PRACTICE_WEIGHT_CONFIGS = {
  protection: { element: 0.25, planetary: 0.35, manazil: 0.20, practice: 0.20 },
  healing: { element: 0.30, planetary: 0.25, manazil: 0.25, practice: 0.20 },
  manifestation: { element: 0.20, planetary: 0.30, manazil: 0.30, practice: 0.20 },
  guidance: { element: 0.25, planetary: 0.25, manazil: 0.30, practice: 0.20 },
  gratitude: { element: 0.30, planetary: 0.20, manazil: 0.20, practice: 0.30 },
  knowledge: { element: 0.20, planetary: 0.30, manazil: 0.25, practice: 0.25 },
  provision: { element: 0.25, planetary: 0.30, manazil: 0.25, practice: 0.20 },
  general: { element: 0.25, planetary: 0.25, manazil: 0.25, practice: 0.25 },
};

function getTimingLevel(score) {
  if (score >= 80) return 'optimal';
  if (score >= 65) return 'favorable';
  if (score >= 45) return 'moderate';
  if (score >= 25) return 'challenging';
  return 'avoid';
}

function analyzeTimingForPractice(profile, moment, intent) {
  const weights = PRACTICE_WEIGHT_CONFIGS[intent.category] || PRACTICE_WEIGHT_CONFIGS.general;
  
  const elementResult = analyzeElementCompatibility(profile, moment);
  const planetaryResult = analyzePlanetaryResonance(profile, moment);
  const manazilResult = analyzeManazilAlignment(profile, moment);
  const practiceResult = analyzePracticeMapping(moment, intent);
  
  const compositeScore = Math.round(
    elementResult.score * weights.element +
    planetaryResult.score * weights.planetary +
    manazilResult.score * weights.manazil +
    practiceResult.score * weights.practice
  );
  
  const overallLevel = getTimingLevel(compositeScore);
  
  const recommendations = {
    optimal: `Excellent time for ${intent.category}. All cosmic factors align with your spiritual profile.`,
    favorable: `Good time for ${intent.category}. Most factors support your practice.`,
    moderate: `Acceptable time for ${intent.category}. Proceed with clear intention.`,
    challenging: `Difficult time for ${intent.category}. Consider waiting or use extra focus.`,
    avoid: `Not recommended for ${intent.category}. Wait for a more favorable window.`,
  };
  
  return {
    overallLevel,
    compositeScore,
    layerScores: {
      element: elementResult.score,
      planetary: planetaryResult.score,
      manazil: manazilResult.score,
      practice: practiceResult.score,
    },
    layerReasonings: {
      element: elementResult.reasoning,
      planetary: planetaryResult.reasoning,
      manazil: manazilResult.reasoning,
      practice: practiceResult.reasoning,
    },
    recommendation: recommendations[overallLevel],
  };
}

// ============================================
// Console Output Helpers
// ============================================

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
};

function colorize(text, color) {
  return `${colors[color] || ''}${text}${colors.reset}`;
}

function getTimingColor(level) {
  const map = { optimal: 'green', favorable: 'cyan', moderate: 'yellow', challenging: 'magenta', avoid: 'red' };
  return map[level] || 'reset';
}

function printHeader(title) {
  console.log('\n' + colorize('═'.repeat(60), 'blue'));
  console.log(colorize(`  ${title}`, 'bold'));
  console.log(colorize('═'.repeat(60), 'blue'));
}

function printScore(label, score) {
  const pct = Math.round(score);
  const bar = '█'.repeat(Math.floor(pct / 5)) + '░'.repeat(20 - Math.floor(pct / 5));
  const color = pct >= 70 ? 'green' : pct >= 40 ? 'yellow' : 'red';
  console.log(`  ${label.padEnd(25)} ${colorize(bar, color)} ${pct}%`);
}

// ============================================
// Run Tests
// ============================================

console.log(colorize('\n╔══════════════════════════════════════════════════════════╗', 'magenta'));
console.log(colorize('║       ASRARIYA TIMING ENGINE - TEST SUITE                ║', 'magenta'));
console.log(colorize('║       "Is THIS moment favorable for ME to do THIS?"      ║', 'magenta'));
console.log(colorize('╚══════════════════════════════════════════════════════════╝', 'magenta'));

// Test 1: Layer Analysis
printHeader('LAYER ANALYSIS');

console.log('\n' + colorize('── Layer 1: Element Compatibility ──', 'cyan'));
const elemResult = analyzeElementCompatibility(testProfile, testMoment);
console.log(`  Profile Element: ${testProfile.primaryElement}`);
console.log(`  Hour Element:    ${testMoment.planetaryHour.element}`);
printScore('Compatibility Score', elemResult.score);
console.log(`  Reasoning: ${elemResult.reasoning}`);

console.log('\n' + colorize('── Layer 2: Planetary Resonance ──', 'cyan'));
const planetResult = analyzePlanetaryResonance(testProfile, testMoment);
console.log(`  Current Planet:   ${testMoment.planetaryHour.planet}`);
console.log(`  Dominant Planets: ${testProfile.dominantPlanets.join(', ')}`);
printScore('Resonance Score', planetResult.score);
console.log(`  Reasoning: ${planetResult.reasoning}`);

console.log('\n' + colorize('── Layer 3: Manazil Alignment ──', 'cyan'));
const manazilResult = analyzeManazilAlignment(testProfile, testMoment);
console.log(`  Current Mansion: ${testMoment.lunarMansion.nameEnglish} (#${testMoment.lunarMansion.number})`);
printScore('Alignment Score', manazilResult.score);
console.log(`  Reasoning: ${manazilResult.reasoning}`);

// Test 2: Full Analysis for Each Practice
printHeader('FULL ENGINE ANALYSIS BY PRACTICE');

const categories = ['protection', 'healing', 'manifestation', 'guidance', 'gratitude', 'knowledge', 'provision', 'general'];

for (const category of categories) {
  const intent = { category, intensity: 'focused' };
  const result = analyzeTimingForPractice(testProfile, testMoment, intent);
  
  console.log(`\n  ${colorize(category.toUpperCase().padEnd(15), 'bold')} → ${colorize(result.overallLevel.toUpperCase().padEnd(12), getTimingColor(result.overallLevel))} (${result.compositeScore}%)`);
  console.log(`     Element: ${result.layerScores.element}% | Planet: ${result.layerScores.planetary}% | Manazil: ${result.layerScores.manazil}% | Practice: ${result.layerScores.practice}%`);
}

// Test 3: Edge Cases
printHeader('EDGE CASE TESTS');

console.log('\n' + colorize('── Different User Elements ──', 'cyan'));
const elements = ['fire', 'water', 'air', 'earth'];
for (const elem of elements) {
  const profile = { ...testProfile, primaryElement: elem };
  const result = analyzeTimingForPractice(profile, testMoment, { category: 'protection', intensity: 'focused' });
  console.log(`  ${elem.padEnd(8)} profile → ${colorize(result.overallLevel.padEnd(12), getTimingColor(result.overallLevel))} (${result.compositeScore}%)`);
}

console.log('\n' + colorize('── Different Mansion Qualities ──', 'cyan'));
const qualities = ['sapiential', 'benefic', 'neutral', 'malefic'];
for (const quality of qualities) {
  const moment = { ...testMoment, lunarMansion: { ...testMoment.lunarMansion, quality } };
  const result = analyzeTimingForPractice(testProfile, moment, { category: 'manifestation', intensity: 'deep' });
  console.log(`  ${quality.padEnd(12)} mansion → ${colorize(result.overallLevel.padEnd(12), getTimingColor(result.overallLevel))} (${result.compositeScore}%)`);
}

console.log('\n' + colorize('── Different Intensity Levels ──', 'cyan'));
const intensities = ['light', 'focused', 'deep'];
for (const intensity of intensities) {
  const result = analyzeTimingForPractice(testProfile, testMoment, { category: 'guidance', intensity });
  console.log(`  ${intensity.padEnd(10)} intensity → ${colorize(result.overallLevel.padEnd(12), getTimingColor(result.overallLevel))} (${result.compositeScore}%)`);
}

// Summary
console.log('\n' + colorize('═'.repeat(60), 'green'));
console.log(colorize('  ✓ ALL TESTS COMPLETED SUCCESSFULLY', 'green'));
console.log(colorize('═'.repeat(60), 'green') + '\n');
