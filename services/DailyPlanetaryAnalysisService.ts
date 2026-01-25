/**
 * Daily Planetary Analysis
 * =========================
 * 
 * Integrates enhanced planetary strength calculations with daily timing
 * Shows which planets are strong/weak today and why
 * 
 * This is used to improve the Daily Energy screen accuracy
 */

import type { Planet } from '@/services/PlanetaryHoursService';
import {
    calculateEnhancedPlanetaryPower,
    type EnhancedPlanetaryPower,
} from '@/services/PlanetaryStrengthService';
import { getDayRulingPlanet } from '@/services/DayRulingPlanetService';
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

  return {
    planets: analysis,
    dayRulingPlanet,
    dayRulingStrength,
    bestForGeneralWork: recommendedPlanets[0] || null,
    bestForSpiritualWork: recommendedPlanets[1] || null,
    planetsToAvoid,
    criticalWarnings: criticalWarnings.slice(0, 3), // Limit to 3 critical warnings
    practiceRecommendations,
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
 * Calculate daily planetary score for overall energy
 * Used to improve the "Daily Energy" percentage
 */
export function calculateDailyPlanetaryScore(
  analysis: DailyPlanetaryAnalysis
): number {
  // Average of all non-weak planets
  let total = 0;
  let count = 0;

  for (const planet of Object.keys(analysis.planets) as Planet[]) {
    const power = analysis.planets[planet].finalPower;
    if (power >= 30) {
      total += power;
      count += 1;
    }
  }

  return count > 0 ? Math.round(total / count) : 40;
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
