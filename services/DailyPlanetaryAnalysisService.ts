/**
 * Daily Planetary Analysis
 * =========================
 * 
 * Integrates enhanced planetary strength calculations with daily timing
 * Shows which planets are strong/weak today and why
 * 
 * This is used to improve the Daily Energy screen accuracy
 */

import { getDayRulingPlanet } from '@/services/DayRulingPlanetService';
import { analyzeMoonDayHarmony, analyzeMoonPhase, type MoonDayHarmony, type MoonPhaseAnalysis } from '@/services/MoonPhaseService';
import type { Planet } from '@/services/PlanetaryHoursService';
import {
    calculateEnhancedPlanetaryPower,
    type EnhancedPlanetaryPower,
} from '@/services/PlanetaryStrengthService';
import type { ElementalTone } from '@/types/divine-timing';
import type { PlanetTransit, ZodiacSign } from '@/types/planetary-systems';

export interface DailyPlanetaryAnalysis {
  /** All planets and their power analysis */
  planets: Record<Planet, EnhancedPlanetaryPower>;
  
  /** Today's ruling planet (based on day of week) */
  dayRulingPlanet: Planet;
  
  /** Today's ruling planet strength */
  dayRulingStrength: number;
  
  /** Best planet for general work */
  bestForGeneralWork: Planet | null;
  
  /** Best planet for spiritual/inner work */
  bestForSpiritualWork: Planet | null;
  
  /** Planets to avoid */
  planetsToAvoid: Planet[];
  
  /** Critical warnings (combustion, fall, etc) */
  criticalWarnings: string[];
  
  /** Recommendations for daily practice */
  practiceRecommendations: string[];
  
  /** Moon phase analysis (Phase 1 integration) */
  moonPhase?: MoonPhaseAnalysis;
  
  /** Moon-Day harmony analysis (Phase 1 integration) */
  moonDayHarmony?: MoonDayHarmony;
  
  /** Today's date */
  date?: Date;
  
  /** Daily element (for theming) */
  dayElement?: ElementalTone;
  
  /** Weighted daily energy score (Phase 1) */
  dailyScore?: number;
  
  /** Score breakdown for UI display (Phase 1) */
  scoreBreakdown?: {
    dayRuler: Planet;
    dayRulerPower: number;
    dayRulerContribution: number;
    moonPower: number;
    moonContribution: number;
    othersPower: number;
    othersContribution: number;
    totalScore: number;
  };
}

/**
 * Analyze all planetary positions for the current moment
 * Returns comprehensive strength analysis including day ruling planet
 */
export function analyzeDailyPlanets(
  planetPositions: Record<Planet, PlanetTransit | null>,
  sunPosition: PlanetTransit | null,
  date: Date = new Date()
): DailyPlanetaryAnalysis {
  if (!sunPosition) {
    throw new Error('Sun position required for planetary analysis');
  }

  const analysis: Record<Planet, EnhancedPlanetaryPower> = {} as any;
  const planetsToAvoid: Planet[] = [];
  const criticalWarnings: string[] = [];
  const recommendedPlanets: (Planet | null)[] = [null, null];
  let bestScore = -1;
  let spiritualScore = -1;

  // Get today's ruling planet
  const dayRulingPlanet = getDayRulingPlanet(date);

  // Analyze each planet
  const planets: Planet[] = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];

  for (const planet of planets) {
    const pos = planetPositions[planet];
    
    if (!pos) continue;

    // Calculate enhanced power
    const planetPower = calculateEnhancedPlanetaryPower(
      planet,
      pos.sign as ZodiacSign,
      pos.signDegree || 0,
      pos.longitude || 0,
      sunPosition.longitude || 0,
      pos.isRetrograde || false
    );

    analysis[planet] = planetPower;

    // Track best planets
    if (planetPower.suitability.outer && planetPower.finalPower > bestScore) {
      bestScore = planetPower.finalPower;
      recommendedPlanets[0] = planet;
    }

    if (planetPower.suitability.inner && planetPower.finalPower > spiritualScore) {
      spiritualScore = planetPower.finalPower;
      recommendedPlanets[1] = planet;
    }

    // Track planets to avoid
    if (planetPower.finalPower < 30) {
      planetsToAvoid.push(planet);
    }

    // Collect critical warnings
    if (planetPower.warnings.length > 0) {
      planetPower.warnings.forEach((warning) => {
        // Only show critical warnings (combustion, fall, early degree)
        if (warning.includes('combust') || warning.includes('fall') || warning.includes('just entered')) {
          criticalWarnings.push(`${planet}: ${warning}`);
        }
      });
    }
  }

  // Get day ruling planet strength
  const dayRulingStrength = analysis[dayRulingPlanet]?.finalPower || 50;

  // Generate practice recommendations
  const practiceRecommendations = generatePracticeRecommendations(
    analysis,
    recommendedPlanets[0],
    recommendedPlanets[1],
    planetsToAvoid,
    dayRulingPlanet,
    dayRulingStrength
  );

  // NEW (Phase 1): Analyze Moon phase
  const moonData = planetPositions['Moon'];
  let moonPhase: MoonPhaseAnalysis | undefined;
  let moonDayHarmony: MoonDayHarmony | undefined;

  if (moonData && sunPosition) {
    try {
      // Calculate moon illumination from lunar day
      // Simple approximation: sin(lunarDay * pi / 29.5)
      const lunarDay = calculateLunarDay(date);
      const moonIllumination = calculateMoonIllumination(lunarDay);
      
      moonPhase = analyzeMoonPhase(
        moonIllumination,
        sunPosition.longitude || 0,
        moonData.longitude || 0,
        date
      );

      // Analyze harmony between moon phase and day ruler
      const dayElement = getDayElement(dayRulingPlanet);
      moonDayHarmony = analyzeMoonDayHarmony(
        moonPhase,
        dayRulingPlanet,
        dayElement
      );
    } catch (err) {
      console.warn('Failed to analyze moon phase:', err);
    }
  }

  return {
    planets: analysis,
    dayRulingPlanet,
    dayRulingStrength,
    bestForGeneralWork: recommendedPlanets[0] || null,
    bestForSpiritualWork: recommendedPlanets[1] || null,
    planetsToAvoid,
    criticalWarnings: criticalWarnings.slice(0, 3), // Limit to 3 critical warnings
    practiceRecommendations,
    moonPhase,
    moonDayHarmony,
  };
}

/**
 * Generate actionable recommendations based on planetary analysis
 */
function generatePracticeRecommendations(
  planets: Record<Planet, EnhancedPlanetaryPower>,
  bestGeneral: Planet | null,
  bestSpiritual: Planet | null,
  avoid: Planet[],
  dayRulingPlanet: Planet,
  dayRulingStrength: number
): string[] {
  const recommendations: string[] = [];

  // Recommendation 1: Day ruler status
  if (dayRulingStrength >= 70) {
    recommendations.push(
      `${dayRulingPlanet} (today's ruler) is strong at ${dayRulingStrength}% - excellent day overall`
    );
  } else if (dayRulingStrength >= 50) {
    recommendations.push(
      `${dayRulingPlanet} (today's ruler) at ${dayRulingStrength}% - decent day with good support`
    );
  } else if (dayRulingStrength >= 30) {
    recommendations.push(
      `${dayRulingPlanet} (today's ruler) weak at ${dayRulingStrength}% - proceed with caution`
    );
  } else {
    recommendations.push(
      `${dayRulingPlanet} (today's ruler) very weak at ${dayRulingStrength}% - challenging day, focus on small tasks`
    );
  }

  // Recommendation 2: Best planet for work
  if (bestGeneral) {
    const power = planets[bestGeneral];
    if (power.finalPower >= 60) {
      recommendations.push(
        `Use ${bestGeneral} hours for material work (${power.finalPower}% power)`
      );
    }
  }

  // Recommendation 3: Best planet for reflection
  if (bestSpiritual && bestSpiritual !== bestGeneral) {
    const power = planets[bestSpiritual];
    if (power.finalPower >= 50) {
      recommendations.push(
        `Use ${bestSpiritual} hours for spiritual work (${power.finalPower}% power)`
      );
    }
  }

  // Recommendation 4: Planets to avoid
  if (avoid.length > 0) {
    const avoidList = avoid.slice(0, 2).join(', ');
    recommendations.push(`Avoid ${avoidList} hours - weak planetary positions`);
  }

  // Recommendation 5: Day ruler advantage
  if (bestGeneral === dayRulingPlanet && dayRulingStrength >= 60) {
    recommendations.push('🌟 Today\'s ruler is the strongest planet - use its hours first');
  }

  // Recommendation 6: Time-specific guidance
  if (planets.Mercury && planets.Mercury.finalPower > 70) {
    recommendations.push('Strong Mercury - excellent for communication/study today');
  }

  if (planets.Jupiter && planets.Jupiter.finalPower > 70) {
    recommendations.push('Strong Jupiter - day favors expansion and growth');
  }

  return recommendations;
}

/**
 * Calculate daily planetary score with classical weighting
 * 
 * Weighting system (classical Islamic astrology):
 * - Day Ruling Planet: 50% (primary influence)
 * - Moon: 30% (always important for timing)
 * - Other planets: 20% (supporting context)
 * 
 * This reflects traditional teaching that the day ruler
 * dominates the day's energy, with Moon as secondary timing factor.
 * 
 * @param analysis - Complete planetary analysis
 * @param currentDate - Current date to determine day ruler
 * @returns Weighted planetary score (0-100)
 */
export function calculateDailyPlanetaryScore(
  analysis: DailyPlanetaryAnalysis,
  currentDate: Date = new Date()
): number {
  // Get day ruler based on day of week (already in analysis)
  const dayRuler = analysis.dayRulingPlanet;
  const dayRulerPower = analysis.planets[dayRuler].finalPower;
  
  // Get Moon power (always important for timing)
  const moonPower = analysis.planets['Moon'].finalPower;
  
  // Calculate average of OTHER planets (excluding day ruler and Moon)
  let otherTotal = 0;
  let otherCount = 0;
  
  for (const planet of Object.keys(analysis.planets) as Planet[]) {
    if (planet === dayRuler || planet === 'Moon') {
      continue; // Skip - already counted separately
    }
    
    const power = analysis.planets[planet].finalPower;
    if (power >= 30) { // Only include non-weak planets
      otherTotal += power;
      otherCount += 1;
    }
  }
  
  const otherAverage = otherCount > 0 ? otherTotal / otherCount : 40;
  
  // Apply classical weights
  const weightedScore = 
    (dayRulerPower * 0.5) +   // Day ruler: 50%
    (moonPower * 0.3) +        // Moon: 30%
    (otherAverage * 0.2);      // Others: 20%
  
  return Math.round(weightedScore);
}

/**
 * Get breakdown of how daily score was calculated
 * Useful for displaying to users
 */
export function getDailyScoreBreakdown(
  analysis: DailyPlanetaryAnalysis,
  currentDate: Date = new Date()
): {
  dayRuler: Planet;
  dayRulerPower: number;
  dayRulerContribution: number;
  moonPower: number;
  moonContribution: number;
  othersPower: number;
  othersContribution: number;
  totalScore: number;
} {
  const dayRuler = analysis.dayRulingPlanet;
  const dayRulerPower = analysis.planets[dayRuler].finalPower;
  const moonPower = analysis.planets['Moon'].finalPower;
  
  let otherTotal = 0;
  let otherCount = 0;
  
  for (const planet of Object.keys(analysis.planets) as Planet[]) {
    if (planet === dayRuler || planet === 'Moon') continue;
    const power = analysis.planets[planet].finalPower;
    if (power >= 30) {
      otherTotal += power;
      otherCount += 1;
    }
  }
  
  const othersPower = otherCount > 0 ? otherTotal / otherCount : 40;
  
  return {
    dayRuler,
    dayRulerPower,
    dayRulerContribution: Math.round(dayRulerPower * 0.5),
    moonPower,
    moonContribution: Math.round(moonPower * 0.3),
    othersPower: Math.round(othersPower),
    othersContribution: Math.round(othersPower * 0.2),
    totalScore: Math.round(
      (dayRulerPower * 0.5) + (moonPower * 0.3) + (othersPower * 0.2)
    ),
  };
}

/**
 * Find the next 5 hours with best planetary combinations
 */
export function findBestHoursToday(
  analysis: DailyPlanetaryAnalysis
): { planet: Planet; quality: 'excellent' | 'good' | 'moderate' }[] {
  // Sort planets by power
  const sorted = (Object.keys(analysis.planets) as Planet[])
    .map((p) => ({ planet: p, power: analysis.planets[p].finalPower }))
    .sort((a, b) => b.power - a.power)
    .slice(0, 5);

  return sorted.map(({ planet, power }) => ({
    planet,
    quality: power >= 70 ? 'excellent' : power >= 50 ? 'good' : 'moderate',
  }));
}

/**
 * Get elemental tone for a day ruling planet
 * Used for moon-day harmony analysis
 */
function getDayElement(dayRuler: Planet): ElementalTone {
  const elementMap: Record<Planet, ElementalTone> = {
    'Sun': 'fire',
    'Moon': 'water',
    'Mercury': 'air',
    'Venus': 'water',
    'Mars': 'fire',
    'Jupiter': 'fire',
    'Saturn': 'earth',
  };
  
  return elementMap[dayRuler] || 'earth';
}

/**
 * Calculate lunar day (1-30) from date
 * Uses synodic month length of 29.53 days
 */
function calculateLunarDay(date: Date): number {
  const referenceNewMoon = new Date('2000-01-06T18:14:00Z').getTime();
  const synodicMonth = 29.53058867;
  
  const currentTime = date.getTime();
  const daysSinceReference = (currentTime - referenceNewMoon) / (1000 * 60 * 60 * 24);
  
  const lunarDay = (daysSinceReference % synodicMonth) + 1;
  
  return Math.floor(lunarDay);
}

/**
 * Calculate moon illumination percentage from lunar day
 * Approximates the illumination using sine wave
 */
function calculateMoonIllumination(lunarDay: number): number {
  // Waxing: Days 1-14.75 go from 0% to 100%
  // Full: Days 14.75-15.25 stay at 100%
  // Waning: Days 15.25-29.53 go from 100% back to 0%
  
  const synodicMonth = 29.53058867;
  const normalizedDay = (lunarDay % synodicMonth);
  
  if (normalizedDay < 14.75) {
    // Waxing: 0% to 100%
    return (normalizedDay / 14.75) * 100;
  } else if (normalizedDay < 15.25) {
    // Full moon
    return 100;
  } else {
    // Waning: 100% back to 0%
    return Math.max(0, ((synodicMonth - normalizedDay) / 14.28) * 100);
  }
}
