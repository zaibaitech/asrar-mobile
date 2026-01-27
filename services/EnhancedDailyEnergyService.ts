/**
 * Enhanced Daily Energy Service - Phase 1
 * ========================================
 * 
 * UPDATES TO EXISTING CALCULATION:
 * 
 * OLD FORMULA: Simple average of all planets ≥ 30%
 *   dailyEnergy = (Mars + Moon + Mercury + Venus + Jupiter + Saturn) / 6
 * 
 * NEW FORMULA: Weighted with Moon Phase as primary, Day Ruler emphasized
 *   dailyEnergy = (dayRuler × 50%) + (moon × 30%) + (otherPlanets × 20%)
 * 
 * This makes the Daily Energy percentage:
 * 1. Responsive to Moon phase (primary timing layer)
 * 2. Weighted toward day ruling planet (as it should be)
 * 3. Balanced with other planetary energies (supporting factors)
 */

import type { DailyPlanetaryAnalysis } from '@/services/DailyPlanetaryAnalysisService';
import type { MoonPhaseAnalysis } from '@/services/MoonPhaseService';
import type { Planet } from '@/services/PlanetaryHoursService';

// ============================================================================
// WEIGHTED DAILY ENERGY CALCULATION
// ============================================================================

/**
 * Calculate weighted daily energy percentage
 * 
 * FORMULA:
 * --------
 * Daily Energy = (Day Ruler × 0.50)
 *              + (Moon × 0.30)
 *              + (Other Planets Avg × 0.20)
 * 
 * This gives us:
 * - Day ruling planet: 50% weight (it literally "rules" the day!)
 * - Moon: 30% weight (primary timing layer, always important)
 * - Others: 20% weight (supporting context)
 * 
 * EXAMPLE:
 * --------
 * Mars (day ruler): 58% → 58 × 0.5 = 29
 * Moon:             75% → 75 × 0.3 = 22.5
 * Others avg:       49% → 49 × 0.2 = 9.8
 * TOTAL:            29 + 22.5 + 9.8 = 61.3% → 61%
 */
export function calculateWeightedDailyEnergy(
  analysis: DailyPlanetaryAnalysis,
  moonPhase: MoonPhaseAnalysis,
  dayRuler: Planet
): {
  percentage: number;
  dayRulerScore: number;
  moonScore: number;
  othersScore: number;
  breakdown: string;
} {
  // STEP 1: Get day ruling planet strength
  const dayRulerPower = analysis.planets[dayRuler]?.finalPower ?? 40;

  // STEP 2: Get Moon strength (use both planetary analysis AND moon phase)
  const moonPlanetaryPower = analysis.planets['Moon']?.finalPower ?? 50;
  // Blend Moon's planetary strength with its phase power
  const moonBlended = (moonPlanetaryPower * 0.6 + moonPhase.moonPower * 0.4);

  // STEP 3: Calculate average of other planets (exclude Sun, Moon, Day Ruler)
  let otherTotal = 0;
  let otherCount = 0;

  const allPlanets: Planet[] = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
  for (const planet of allPlanets) {
    if (planet !== dayRuler && planet !== 'Moon' && planet !== 'Sun') {
      const power = analysis.planets[planet]?.finalPower ?? 0;
      if (power >= 30) {
        // Only count planets with sufficient strength
        otherTotal += power;
        otherCount += 1;
      }
    }
  }

  const othersAverage = otherCount > 0 ? otherTotal / otherCount : 40;

  // STEP 4: Calculate weighted score
  const dayRulerScore = dayRulerPower * 0.5;
  const moonScore = moonBlended * 0.3;
  const othersScore = othersAverage * 0.2;

  const percentage = dayRulerScore + moonScore + othersScore;
  const roundedPercentage = Math.round(percentage);

  // STEP 5: Generate breakdown text for UI display
  const breakdown = `
${dayRuler} (Day Ruler): ${Math.round(dayRulerPower)}% × 50% = ${Math.round(dayRulerScore)}
Moon (Phase + Planetary): ${Math.round(moonBlended)}% × 30% = ${Math.round(moonScore)}
Others (avg): ${Math.round(othersAverage)}% × 20% = ${Math.round(othersScore)}
─────────────────────────────────────
Total: ${Math.round(dayRulerScore)} + ${Math.round(moonScore)} + ${Math.round(othersScore)} = ${roundedPercentage}%
`;

  return {
    percentage: roundedPercentage,
    dayRulerScore: Math.round(dayRulerScore),
    moonScore: Math.round(moonScore),
    othersScore: Math.round(othersScore),
    breakdown,
  };
}

/**
 * Calculate daily energy quality label based on percentage
 */
export function getDailyEnergyQuality(
  percentage: number
): 'Excellent' | 'Good' | 'Moderate' | 'Proceed Mindfully' | 'Rest Day' {
  if (percentage >= 80) return 'Excellent';
  if (percentage >= 65) return 'Good';
  if (percentage >= 50) return 'Moderate';
  if (percentage >= 35) return 'Proceed Mindfully';
  return 'Rest Day';
}

/**
 * Get daily energy color for UI
 */
export function getDailyEnergyColor(percentage: number): string {
  if (percentage >= 80) return '#10b981'; // Green (Excellent)
  if (percentage >= 65) return '#3b82f6'; // Blue (Good)
  if (percentage >= 50) return '#f59e0b'; // Amber (Moderate)
  if (percentage >= 35) return '#ef4444'; // Red (Proceed Mindfully)
  return '#6b7280'; // Gray (Rest Day)
}

/**
 * Get daily energy emoji for UI
 */
export function getDailyEnergyEmoji(
  percentage: number
): string {
  if (percentage >= 80) return '⚡';
  if (percentage >= 65) return '✨';
  if (percentage >= 50) return '⚖️';
  if (percentage >= 35) return '⚠️';
  return '😴';
}

/**
 * Generate daily energy guidance based on score
 */
export function generateDailyEnergyGuidance(
  percentage: number,
  dayRuler: Planet,
  moonPhase: MoonPhaseAnalysis
): string {
  if (percentage >= 80) {
    return `${dayRuler} is strong today, and the ${moonPhase.phaseNameTranslated.en} supports your momentum. Excellent time for major undertakings!`;
  }

  if (percentage >= 65) {
    return `${dayRuler}'s good energy combined with ${moonPhase.energyType} phase makes today favorable. Proceed with projects confidently.`;
  }

  if (percentage >= 50) {
    return `Moderate energy today. Use the day for steady progress, but avoid major initiatives if possible.`;
  }

  if (percentage >= 35) {
    return `Energy is low. The ${moonPhase.phaseNameTranslated.en} and ${dayRuler}'s positioning suggest a more cautious approach.`;
  }

  return `Today calls for rest and preparation. Let your energy build for tomorrow.`;
}

// ============================================================================
// COMPARISON: OLD VS NEW CALCULATION
// ============================================================================

/**
 * For reference: Calculate daily energy the OLD way (simple average)
 * This is kept for comparison/migration purposes only
 */
export function calculateDailyPlanetaryScoreLegacy(
  analysis: DailyPlanetaryAnalysis
): number {
  // Average of all non-weak planets
  let total = 0;
  let count = 0;

  const allPlanets: Planet[] = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
  for (const planet of allPlanets) {
    const power = analysis.planets[planet]?.finalPower ?? 0;
    if (power >= 30) {
      total += power;
      count += 1;
    }
  }

  return count > 0 ? Math.round(total / count) : 40;
}

/**
 * Compare old vs new calculation for testing/migration
 */
export function compareEnergyCalculations(
  analysis: DailyPlanetaryAnalysis,
  moonPhase: MoonPhaseAnalysis,
  dayRuler: Planet
): {
  legacy: number;
  weighted: number;
  difference: number;
} {
  const legacy = calculateDailyPlanetaryScoreLegacy(analysis);
  const weighted = calculateWeightedDailyEnergy(analysis, moonPhase, dayRuler).percentage;
  const difference = weighted - legacy;

  return {
    legacy,
    weighted,
    difference,
  };
}
