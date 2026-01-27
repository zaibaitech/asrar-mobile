/**
 * Test script for Tier 1: Cosmic Quality Analysis
 * =================================================
 * Validates that planetary conditions and cosmic quality
 * assessments are working correctly.
 */

import { analyzeCosmicQuality } from '../services/CosmicQualityService';
import { getPlanetaryCondition } from '../services/PlanetaryConditionService';

async function testTier1() {
  console.log('═══════════════════════════════════════════════');
  console.log('  TIER 1: COSMIC QUALITY ANALYSIS - TEST');
  console.log('═══════════════════════════════════════════════\n');

  const testLocation = {
    latitude: 33.5731,   // Casablanca
    longitude: -7.5898,
  };

  const testMoment = new Date(); // Current moment

  console.log(`📅 Test Time: ${testMoment.toLocaleString()}`);
  console.log(`📍 Location: Casablanca (${testLocation.latitude}, ${testLocation.longitude})\n`);

  // ═══════════════════════════════════════════════════════════════
  // TEST 1: Individual Planetary Conditions
  // ═══════════════════════════════════════════════════════════════
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('TEST 1: Planetary Conditions');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const planets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'] as const;

  for (const planet of planets) {
    try {
      console.log(`\n🪐 ${planet}:`);
      const condition = await getPlanetaryCondition(planet, testMoment, testLocation);

      console.log(`   Position: ${condition.position.sign} ${condition.position.degree.toFixed(2)}°`);
      console.log(`   Dignity: ${condition.dignity.type} (${condition.dignity.score}/100)`);
      console.log(`   Motion: ${condition.motion.speed}${condition.motion.retrograde ? ' RETROGRADE' : ''}`);
      console.log(`   Quality: ${condition.ruling.toUpperCase()} (${condition.overallQuality}/100)`);
      
      if (condition.aspects.cazimi) {
        console.log(`   ✨ CAZIMI - In the heart of the Sun!`);
      } else if (condition.aspects.combust) {
        console.log(`   ⚠️  COMBUST - Weakened by Sun`);
      } else if (condition.aspects.underBeams) {
        console.log(`   ⚡ Under Sun's beams`);
      }

      if (condition.aspects.majorAspects.length > 0) {
        console.log(`   Aspects:`);
        condition.aspects.majorAspects.slice(0, 3).forEach(aspect => {
          const symbol = aspect.aspect === 'trine' ? '△' :
                        aspect.aspect === 'square' ? '□' :
                        aspect.aspect === 'opposition' ? '☍' :
                        aspect.aspect === 'sextile' ? '⚹' : '☌';
          console.log(`      ${symbol} ${aspect.aspect} ${aspect.planet} (${aspect.strength.toFixed(0)}% strength)`);
        });
      }

      console.log(`   Summary: ${condition.summary.en}`);
    } catch (error) {
      console.error(`   ❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // TEST 2: Overall Cosmic Quality
  // ═══════════════════════════════════════════════════════════════

  console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('TEST 2: Cosmic Quality Assessment');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  try {
    const cosmic = await analyzeCosmicQuality(testMoment, testLocation);

    console.log('🌌 COSMIC STATE:');
    console.log(`   Ruling: ${cosmic.ruling.toUpperCase()}`);
    console.log(`   Score: ${cosmic.overallCosmicScore}/100`);
    console.log('');

    console.log('⏰ HOUR RULER:');
    console.log(`   Planet: ${cosmic.hourRuler.planet}`);
    console.log(`   Position: ${cosmic.hourRuler.condition.position.sign} ${cosmic.hourRuler.condition.position.degree.toFixed(2)}°`);
    console.log(`   Dignity: ${cosmic.hourRuler.condition.dignity.type}`);
    console.log(`   Quality: ${cosmic.hourRuler.condition.ruling} (${cosmic.hourRuler.qualityScore}/100)`);
    console.log('');

    console.log('🌙 MOON STATE:');
    console.log(`   Phase: ${cosmic.moonState.phase} (${cosmic.moonState.waxing ? 'waxing' : 'waning'})`);
    console.log(`   Lunar Day: ${cosmic.moonState.lunarDay}/30`);
    console.log(`   Illumination: ${cosmic.moonState.illumination}%`);
    console.log(`   Mansion: ${cosmic.moonState.mansion.name} (${cosmic.moonState.mansion.intrinsicQuality})`);
    if (cosmic.moonState.voidOfCourse) {
      console.log(`   ⚠️  VOID OF COURSE`);
    }
    console.log('');

    if (cosmic.prohibitions.length > 0) {
      console.log('⚠️  PROHIBITIONS:');
      cosmic.prohibitions.forEach(p => {
        const severitySymbol = p.severity === 'absolute' ? '🚫' :
                               p.severity === 'strong' ? '⛔' : '⚠️ ';
        console.log(`   ${severitySymbol} ${p.type.toUpperCase()} (${p.severity})`);
        console.log(`      ${p.description.en}`);
      });
      console.log('');
    }

    console.log('📝 REASONING:');
    console.log(`   EN: ${cosmic.reasoning.en}`);
    console.log('');
    console.log(`   AR: ${cosmic.reasoning.ar}`);
    console.log('');
    console.log(`   FR: ${cosmic.reasoning.fr}`);
    console.log('');

    // Visual rating
    console.log('📊 VISUAL ASSESSMENT:');
    const rating = cosmic.ruling === 'baraka' ? '⭐⭐⭐⭐⭐ EXCELLENT' :
                   cosmic.ruling === 'neutral' ? '⭐⭐⭐   NEUTRAL' :
                   cosmic.ruling === 'makruh' ? '⭐     WEAK' : '🚫    FORBIDDEN';
    console.log(`   ${rating}`);
    console.log('');

    // Color-coded score bar
    const barLength = 50;
    const filledLength = Math.round((cosmic.overallCosmicScore / 100) * barLength);
    const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);
    const color = cosmic.overallCosmicScore >= 80 ? '🟢' :
                  cosmic.overallCosmicScore >= 50 ? '🟡' :
                  cosmic.overallCosmicScore >= 25 ? '🟠' : '🔴';
    console.log(`   ${color} [${bar}] ${cosmic.overallCosmicScore}%`);

  } catch (error) {
    console.error(`❌ Cosmic Quality Analysis Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    if (error instanceof Error && error.stack) {
      console.error(error.stack);
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // TEST 3: Multiple Time Points
  // ═══════════════════════════════════════════════════════════════

  console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('TEST 3: Cosmic Quality Over 24 Hours');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log('Sampling every 4 hours for the next 24 hours:\n');

  for (let i = 0; i < 24; i += 4) {
    const futureTime = new Date(testMoment.getTime() + i * 60 * 60 * 1000);
    
    try {
      const cosmic = await analyzeCosmicQuality(futureTime, testLocation);
      
      const timeStr = futureTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const scoreBar = '█'.repeat(Math.round(cosmic.overallCosmicScore / 5));
      const rulingIcon = cosmic.ruling === 'baraka' ? '✨' :
                        cosmic.ruling === 'neutral' ? '⚪' :
                        cosmic.ruling === 'makruh' ? '🟡' : '🔴';
      
      console.log(`${timeStr} ${rulingIcon} ${cosmic.hourRuler.planet.padEnd(7)} │ ${scoreBar} ${cosmic.overallCosmicScore}% ${cosmic.ruling}`);
    } catch (error) {
      console.log(`${futureTime.toLocaleTimeString()} ❌ Error analyzing this time`);
    }
  }

  console.log('\n═══════════════════════════════════════════════');
  console.log('  TEST COMPLETE');
  console.log('═══════════════════════════════════════════════\n');
}

// Run the test
testTier1().catch(console.error);
