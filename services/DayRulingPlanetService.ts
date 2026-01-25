/**
 * Day Ruling Planet Service
 * =========================
 * 
 * Determines which planet rules each day of the week
 * Classical Islamic astrology planetary rulership:
 * - Sunday: Sun (AL-SHAMS)
 * - Monday: Moon (AL-QAMAR)
 * - Tuesday: Mars (AL-MIRRKIKH)
 * - Wednesday: Mercury (AL-UTAARID)
 * - Thursday: Jupiter (AL-MUSHTARI)
 * - Friday: Venus (AL-ZUHRAH)
 * - Saturday: Saturn (AL-ZUHAL)
 * 
 * This is used to weight the daily energy calculation
 */

import type { Planet } from '@/services/PlanetaryHoursService';
import {
    calculateEnhancedPlanetaryPower,
    type EnhancedPlanetaryPower,
} from '@/services/PlanetaryStrengthService';
import type { PlanetTransit, ZodiacSign } from '@/types/planetary-systems';

/**
 * Day of week to ruling planet mapping
 */
const DAY_RULERS: Record<number, Planet> = {
  0: 'Sun',       // Sunday
  1: 'Moon',      // Monday
  2: 'Mars',      // Tuesday
  3: 'Mercury',   // Wednesday
  4: 'Jupiter',   // Thursday
  5: 'Venus',     // Friday
  6: 'Saturn',    // Saturday
};

/**
 * Get the ruling planet for a given date
 * 
 * @param date - The date to check
 * @returns The planet that rules this day
 */
export function getDayRulingPlanet(date: Date): Planet {
  const dayOfWeek = date.getDay();
  return DAY_RULERS[dayOfWeek] || 'Sun';
}

/**
 * Get day name for a planet ruler
 */
export function getDayNameFromRuler(planet: Planet): string {
  const dayNames: Record<Planet, string> = {
    Sun: 'Sunday',
    Moon: 'Monday',
    Mars: 'Tuesday',
    Mercury: 'Wednesday',
    Jupiter: 'Thursday',
    Venus: 'Friday',
    Saturn: 'Saturday',
  };
  return dayNames[planet] || 'Unknown';
}

/**
 * Get day name in a specific language
 */
export function getDayNameTranslated(
  planet: Planet,
  language: 'en' | 'ar' | 'fr' = 'en'
): string {
  const names: Record<Planet, Record<string, string>> = {
    Sun: { en: 'Sunday', ar: 'الأحد', fr: 'Dimanche' },
    Moon: { en: 'Monday', ar: 'الاثنين', fr: 'Lundi' },
    Mars: { en: 'Tuesday', ar: 'الثلاثاء', fr: 'Mardi' },
    Mercury: { en: 'Wednesday', ar: 'الأربعاء', fr: 'Mercredi' },
    Jupiter: { en: 'Thursday', ar: 'الخميس', fr: 'Jeudi' },
    Venus: { en: 'Friday', ar: 'الجمعة', fr: 'Vendredi' },
    Saturn: { en: 'Saturday', ar: 'السبت', fr: 'Samedi' },
  };

  return names[planet]?.[language] || 'Unknown';
}

export interface DayRulerAnalysis {
  /** The planet that rules today */
  planet: Planet;
  
  /** Day name (e.g., "Sunday") */
  dayName: string;
  
  /** Strength of today's ruler (0-100%) */
  strength: number;
  
  /** Quality rating */
  quality: 'Excellent' | 'Good' | 'Moderate' | 'Weak' | 'Very Weak';
  
  /** Full power breakdown */
  powerAnalysis: EnhancedPlanetaryPower;
  
  /** Impact on daily energy */
  dailyImpact: string;
  
  /** Recommendations based on day ruler */
  recommendations: string[];
}

/**
 * Analyze today's ruling planet strength
 * This significantly impacts the daily energy calculation
 */
export function analyzeDayRulingPlanet(
  date: Date,
  planetPositions: Record<string, PlanetTransit | null>,
  sunPosition: PlanetTransit | null
): DayRulerAnalysis {
  if (!sunPosition) {
    throw new Error('Sun position required for day ruler analysis');
  }

  const planet = getDayRulingPlanet(date);
  const position = planetPositions[planet];

  if (!position) {
    throw new Error(`Position data for ${planet} not found`);
  }

  // Calculate the day ruler's current strength
  const powerAnalysis = calculateEnhancedPlanetaryPower(
    planet,
    position.sign as ZodiacSign,
    position.signDegree || 0,
    position.longitude || 0,
    sunPosition.longitude || 0,
    position.isRetrograde || false
  );

  const strength = powerAnalysis.finalPower;

  // Determine quality
  let quality: 'Excellent' | 'Good' | 'Moderate' | 'Weak' | 'Very Weak';
  if (strength >= 80) quality = 'Excellent';
  else if (strength >= 60) quality = 'Good';
  else if (strength >= 40) quality = 'Moderate';
  else if (strength >= 20) quality = 'Weak';
  else quality = 'Very Weak';

  // Generate daily impact message
  const dailyImpact = generateDailyImpact(planet, strength, quality);

  // Generate recommendations
  const recommendations = generateRulerRecommendations(
    planet,
    strength,
    powerAnalysis
  );

  return {
    planet,
    dayName: getDayNameFromRuler(planet),
    strength,
    quality,
    powerAnalysis,
    dailyImpact,
    recommendations,
  };
}

/**
 * Generate a description of how the day ruler affects today
 */
function generateDailyImpact(
  planet: Planet,
  strength: number,
  quality: string
): string {
  const planetImpact: Record<Planet, Record<string, string>> = {
    Sun: {
      Excellent: 'Powerful day for leadership, authority, and visibility. Excellent for starting new projects.',
      Good: 'Good day for action and achievement. Solar energy supports your goals.',
      Moderate: 'Adequate solar energy. Can accomplish tasks but not optimal for major projects.',
      Weak: 'Weak solar energy. Focus on maintenance and preparation rather than initiation.',
      'Very Weak': 'Challenging day. Best for rest and reflection, not major undertakings.',
    },
    Moon: {
      Excellent: 'Excellent day for intuition, emotions, and family. Great for emotional healing and reflection.',
      Good: 'Good day for nurturing work. Emotions and intuition flow well.',
      Moderate: 'Moderate lunar support. Balance action with rest.',
      Weak: 'Weak emotional support. Be mindful of mood fluctuations.',
      'Very Weak': 'Difficult day emotionally. Practice self-care and patience.',
    },
    Mercury: {
      Excellent: 'Excellent day for communication, learning, and travel. Ideal for writing, teaching, negotiations.',
      Good: 'Good day for mental work and communication. Clarity is high.',
      Moderate: 'Moderate Mercurial energy. Clear thinking but may have minor distractions.',
      Weak: 'Weak communication support. Be extra clear and careful with details.',
      'Very Weak': 'Challenging for communication. Misunderstandings likely. Listen carefully.',
    },
    Venus: {
      Excellent: 'Excellent day for relationships, beauty, creativity, and harmony. Perfect for partnerships.',
      Good: 'Good day for artistic work and relationships. Love and beauty flow well.',
      Moderate: 'Moderate Venusian energy. Some creative support, but not peak.',
      Weak: 'Weak Venusian support. Relationships need extra care and effort.',
      'Very Weak': 'Challenging for relationships and creativity. Practice patience and gentleness.',
    },
    Mars: {
      Excellent: 'Excellent day for action, courage, and competitive ventures. Great for overcoming obstacles.',
      Good: 'Good day for assertive action and courage. Energy levels high.',
      Moderate: 'Moderate martial energy. Can take action but be mindful of aggression.',
      Weak: 'Weak action support. Motivation may be low. Focus on smaller tasks.',
      'Very Weak': 'Very challenging. Energy is depleted. Rest is more important than action.',
    },
    Jupiter: {
      Excellent: 'Excellent day for expansion, luck, and growth. Ideal for new ventures and opportunities.',
      Good: 'Good day for abundance and opportunities. Blessings flow easily.',
      Moderate: 'Moderate Jupiterian support. Some luck but not peak manifestation.',
      Weak: 'Weak abundance support. Still possible but requires more effort.',
      'Very Weak': 'Challenging for growth. Focus on planting seeds rather than harvesting.',
    },
    Saturn: {
      Excellent: 'Excellent day for discipline, structure, and long-term planning. Perfect for serious work.',
      Good: 'Good day for focus and responsibility. Structure supports your goals.',
      Moderate: 'Moderate Saturnian energy. Some challenges, but manageable with focus.',
      Weak: 'Weak structure support. May feel heavy or restrictive. Persevere.',
      'Very Weak': 'Very challenging day. Maximum patience required. Focus on essential tasks only.',
    },
  };

  return (
    planetImpact[planet]?.[quality] ||
    `${planet}'s energy today is ${quality.toLowerCase()}, affecting overall daily dynamics.`
  );
}

/**
 * Generate specific recommendations based on day ruler
 */
function generateRulerRecommendations(
  planet: Planet,
  strength: number,
  analysis: EnhancedPlanetaryPower
): string[] {
  const recommendations: string[] = [];

  // Always include strength status
  if (strength >= 80) {
    recommendations.push(`${planet}'s energy is at peak power - excellent time for ${planet}'s activities`);
  } else if (strength >= 60) {
    recommendations.push(`${planet}'s energy is strong - good time to work with ${planet}'s themes`);
  } else if (strength >= 40) {
    recommendations.push(`${planet}'s energy is moderate - feasible but not optimal for major ${planet} work`);
  } else if (strength >= 20) {
    recommendations.push(`${planet}'s energy is weak - better to focus on other planets' strengths`);
  } else {
    recommendations.push(`${planet}'s energy is very weak - avoid major ${planet}-related decisions if possible`);
  }

  // Add warnings if applicable
  if (analysis.warnings.length > 0) {
    analysis.warnings.forEach((warning) => {
      if (warning.includes('combust')) {
        recommendations.push('⚠️ Day ruler is combust - extra caution advised');
      } else if (warning.includes('fall')) {
        recommendations.push('⚠️ Day ruler in fall - look to other planets for support');
      } else if (warning.includes('retrograde')) {
        recommendations.push('⚠️ Day ruler retrograde - review and reflect rather than initiate');
      }
    });
  }

  // Planet-specific recommendations
  const specificRecs: Record<Planet, string[]> = {
    Sun: [
      'Focus on leadership and visibility roles',
      'Good time for self-care and vitality work',
      'Avoid hiding or playing small',
    ],
    Moon: [
      'Nurture emotional connections and family',
      'Ideal for introspection and journaling',
      'Support your intuition',
    ],
    Mercury: [
      'Prioritize communication and learning',
      'Excellent for important conversations',
      'Ideal for writing and planning',
    ],
    Venus: [
      'Invest in relationships and beauty',
      'Perfect for creative projects',
      'Seek harmony and cooperation',
    ],
    Mars: [
      'Channel energy into passionate projects',
      'Good for physical activity and exercise',
      'Assert yourself boldly',
    ],
    Jupiter: [
      'Look for opportunities and expansion',
      'Good day for new ventures',
      'Practice generosity and gratitude',
    ],
    Saturn: [
      'Focus on discipline and structure',
      'Excellent for long-term planning',
      'Build strong foundations',
    ],
  };

  // Add planet-specific recommendations if strength is adequate
  if (strength >= 40) {
    const recs = specificRecs[planet];
    if (recs && recs.length > 0) {
      recommendations.push(`✨ Today's opportunity: ${recs[Math.floor(Math.random() * recs.length)]}`);
    }
  }

  return recommendations;
}

/**
 * Calculate daily energy impact from day ruler
 * This is the weighting used in daily energy calculations
 * 
 * Day ruler strength directly impacts overall daily score:
 * - 80%+ strength: +15 points to daily score
 * - 60-79% strength: +10 points to daily score
 * - 40-59% strength: +5 points to daily score
 * - 20-39% strength: -5 points to daily score
 * - <20% strength: -15 points to daily score
 */
export function getDayRulerImpactOnDailyScore(rulerStrength: number): number {
  if (rulerStrength >= 80) return 15;
  if (rulerStrength >= 60) return 10;
  if (rulerStrength >= 40) return 5;
  if (rulerStrength >= 20) return -5;
  return -15;
}
