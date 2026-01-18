/**
 * Transit Service Test & Validation
 * =================================
 * 
 * Run this to verify the planet transit fix is working correctly
 */

import { calculatePlanetaryHours, Planet } from '@/services/PlanetaryHoursService';
import { getAllTransits, getTransit } from '@/services/TransitService';

/**
 * Test 1: Verify transit stability
 * Jupiter should stay in same sign across multiple checks
 */
export async function testTransitStability() {
  console.log('\n🧪 Test 1: Transit Stability');
  console.log('=====================================');
  
  const checks = [];
  
  // Check Jupiter position 5 times with 1-second delay
  for (let i = 0; i < 5; i++) {
    const transit = await getTransit('Jupiter');
    checks.push({
      time: new Date().toISOString(),
      sign: transit.sign,
      degree: transit.signDegree,
    });
    
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // All checks should have same sign
  const uniqueSigns = new Set(checks.map(c => c.sign));
  
  if (uniqueSigns.size === 1) {
    console.log('✅ PASS: Jupiter stayed in', checks[0].sign);
    console.log('   Checked 5 times over 5 seconds - sign stable');
  } else {
    console.error('❌ FAIL: Jupiter changed signs!', checks);
  }
  
  return uniqueSigns.size === 1;
}

/**
 * Test 2: Verify all planets have valid transits
 */
export async function testAllPlanetsHaveTransits() {
  console.log('\n🧪 Test 2: All Planets Have Transits');
  console.log('=====================================');
  
  const allTransits = await getAllTransits();
  const planets: Planet[] = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
  
  let allValid = true;
  
  for (const planet of planets) {
    const transit = allTransits[planet];
    
    if (!transit) {
      console.error(`❌ Missing transit for ${planet}`);
      allValid = false;
      continue;
    }
    
    if (!transit.sign || !transit.element) {
      console.error(`❌ Invalid transit data for ${planet}`, transit);
      allValid = false;
      continue;
    }
    
    console.log(`✅ ${planet.padEnd(8)} → ${transit.sign.padEnd(12)} (${transit.element})`);
  }
  
  return allValid;
}

/**
 * Test 3: Verify planetary hour integration
 * Current hour planet should have a valid transit
 */
export async function testPlanetaryHourIntegration(
  sunrise: Date,
  sunset: Date,
  nextSunrise: Date
) {
  console.log('\n🧪 Test 3: Planetary Hour Integration');
  console.log('=====================================');
  
  const now = new Date();
  const planetaryData = calculatePlanetaryHours(sunrise, sunset, nextSunrise, now);
  
  if (!planetaryData?.currentHour) {
    console.error('❌ No planetary hour data');
    return false;
  }
  
  const currentPlanet = planetaryData.currentHour.planet;
  console.log(`Current Hour Ruler: ${currentPlanet}`);
  
  const transit = await getTransit(currentPlanet);
  
  if (!transit) {
    console.error(`❌ No transit for current hour planet: ${currentPlanet}`);
    return false;
  }
  
  console.log(`✅ ${currentPlanet} is in ${transit.sign} (${transit.element})`);
  console.log(`   Degree: ${transit.signDegree}°`);
  console.log(`   Source: ${transit.source}`);
  
  return true;
}

/**
 * Test 4: Verify slow planet stability
 * Jupiter and Saturn should not change signs in 24 hours
 */
export async function testSlowPlanetStability() {
  console.log('\n🧪 Test 4: Slow Planet Stability');
  console.log('=====================================');
  
  const jupiter = await getTransit('Jupiter');
  const saturn = await getTransit('Saturn');
  
  console.log(`Jupiter: ${jupiter.sign} (updated: ${jupiter.lastUpdated.toLocaleString()})`);
  console.log(`Saturn: ${saturn.sign} (updated: ${saturn.lastUpdated.toLocaleString()})`);
  
  const now = new Date();
  const jupiterAge = now.getTime() - jupiter.lastUpdated.getTime();
  const saturnAge = now.getTime() - saturn.lastUpdated.getTime();
  
  console.log(`Jupiter data age: ${Math.floor(jupiterAge / 1000 / 60)} minutes`);
  console.log(`Saturn data age: ${Math.floor(saturnAge / 1000 / 60)} minutes`);
  
  // Next refresh should be at least 6 hours away for slow planets
  const jupiterRefreshIn = jupiter.nextRefreshDue.getTime() - now.getTime();
  const saturnRefreshIn = saturn.nextRefreshDue.getTime() - now.getTime();
  
  console.log(`Jupiter next refresh: ${Math.floor(jupiterRefreshIn / 1000 / 60 / 60)} hours`);
  console.log(`Saturn next refresh: ${Math.floor(saturnRefreshIn / 1000 / 60 / 60)} hours`);
  
  const isValid = jupiterRefreshIn > 6 * 60 * 60 * 1000; // At least 6 hours
  
  if (isValid) {
    console.log('✅ PASS: Slow planets have appropriate refresh intervals');
  } else {
    console.error('❌ FAIL: Refresh interval too short for slow planets');
  }
  
  return isValid;
}

/**
 * Test 5: Verify cache is working
 */
export async function testCaching() {
  console.log('\n🧪 Test 5: Cache Performance');
  console.log('=====================================');
  
  // First call (should fetch)
  const start1 = Date.now();
  await getAllTransits();
  const duration1 = Date.now() - start1;
  
  // Second call (should use cache)
  const start2 = Date.now();
  await getAllTransits();
  const duration2 = Date.now() - start2;
  
  console.log(`First call: ${duration1}ms (fetch)`);
  console.log(`Second call: ${duration2}ms (cached)`);
  
  // Cache should be significantly faster
  const isCached = duration2 < duration1 * 0.5; // At least 50% faster
  
  if (isCached) {
    console.log('✅ PASS: Caching is working efficiently');
  } else {
    console.warn('⚠️  WARNING: Cache may not be working optimally');
  }
  
  return isCached;
}

/**
 * Run all tests
 */
export async function runAllTransitTests(
  sunrise: Date,
  sunset: Date,
  nextSunrise: Date
) {
  console.log('\n🚀 PLANET TRANSIT SERVICE - VALIDATION SUITE');
  console.log('=============================================\n');
  
  const results = {
    stability: await testTransitStability(),
    allPlanets: await testAllPlanetsHaveTransits(),
    integration: await testPlanetaryHourIntegration(sunrise, sunset, nextSunrise),
    slowPlanets: await testSlowPlanetStability(),
    caching: await testCaching(),
  };
  
  console.log('\n📊 RESULTS SUMMARY');
  console.log('=====================================');
  console.log(`Transit Stability:        ${results.stability ? '✅' : '❌'}`);
  console.log(`All Planets Present:      ${results.allPlanets ? '✅' : '❌'}`);
  console.log(`Planetary Hour Integration: ${results.integration ? '✅' : '❌'}`);
  console.log(`Slow Planet Stability:    ${results.slowPlanets ? '✅' : '❌'}`);
  console.log(`Cache Performance:        ${results.caching ? '✅' : '❌'}`);
  
  const allPassed = Object.values(results).every(r => r);
  
  if (allPassed) {
    console.log('\n🎉 ALL TESTS PASSED! Transit service is working correctly.');
  } else {
    console.error('\n⚠️  SOME TESTS FAILED. Please review the issues above.');
  }
  
  return allPassed;
}

/**
 * Usage in app:
 * 
 * import { runAllTransitTests } from '@/utils/transitServiceTest';
 * 
 * // In a debug screen or on app start (dev mode only)
 * if (__DEV__) {
 *   runAllTransitTests(sunrise, sunset, nextSunrise);
 * }
 */
