/**
 * Ilm al-Nujum Mapping Service
 * =============================
 * Phase 7: Educational celestial mapping for harmony computation
 * 
 * Purpose: Deterministic mapping of planetary day/hour rulers, moon signs,
 * and user elements to harmony scores and guidance.
 * 
 * Principles:
 * - Purely educational (no predictions)
 * - Deterministic (same inputs = same outputs)
 * - Transparent (all factors explained)
 * - Based on classical Ilm al-Nujum frameworks
 * 
 * Note: This is for reflection only, not religious rulings or certainty claims.
 */

import { IntentionCategory } from '@/types/divine-timing';
import {
    HarmonyComputationInput,
    HarmonyScoreResult,
    PlanetId,
    PlanetPositions,
    TimeSegment
} from '@/types/divine-timing-personal';
import { getZodiacSignElement } from './EphemerisService';

// ============================================================================
// PLANETARY RULERSHIPS
// ============================================================================

/**
 * Classical planetary rulers for days of week
 * 0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday
 */
const DAY_RULERS: PlanetId[] = [
  'sun',     // Sunday
  'moon',    // Monday
  'mars',    // Tuesday
  'mercury', // Wednesday
  'jupiter', // Thursday
  'venus',   // Friday
  'saturn',  // Saturday
];

/**
 * Planetary hour sequence (Chaldean order)
 * Starts with day ruler, cycles through in this order
 */
const PLANETARY_HOUR_SEQUENCE: PlanetId[] = [
  'saturn',
  'jupiter',
  'mars',
  'sun',
  'venus',
  'mercury',
  'moon',
];

/**
 * Simplified planetary hour mapping by time segment
 * (Used when sunrise/sunset data unavailable)
 */
const SEGMENT_TO_HOUR_RULER_APPROX: Record<TimeSegment, number[]> = {
  preDawn: [0, 1],     // Saturn, Jupiter
  morning: [3, 4],     // Sun, Venus
  midday: [3, 4],      // Sun, Venus
  afternoon: [5, 6],   // Mercury, Moon
  evening: [1, 2],     // Jupiter, Mars
  night: [0, 6],       // Saturn, Moon
};

/**
 * Planet to element mapping
 */
const PLANET_ELEMENTS: Record<PlanetId, 'fire' | 'earth' | 'air' | 'water'> = {
  sun: 'fire',
  moon: 'water',
  mercury: 'air',
  venus: 'water',
  mars: 'fire',
  jupiter: 'air',
  saturn: 'earth',
};

/**
 * Burj (zodiac) to planetary ruler mapping
 * Classical Hellenistic/Islamic astrology
 */
const BURJ_RULERS: Record<number, PlanetId> = {
  0: 'mars',     // Aries
  1: 'venus',    // Taurus
  2: 'mercury',  // Gemini
  3: 'moon',     // Cancer
  4: 'sun',      // Leo
  5: 'mercury',  // Virgo
  6: 'venus',    // Libra
  7: 'mars',     // Scorpio
  8: 'jupiter',  // Sagittarius
  9: 'saturn',   // Capricorn
  10: 'saturn',  // Aquarius
  11: 'jupiter', // Pisces
};

// ============================================================================
// HARMONY SCORE COMPUTATION
// ============================================================================

/**
 * Compute harmony score and explanation
 * 
 * Base score: 50
 * Bonuses:
 * - +10 if planetary day ruler matches user's burj ruler
 * - +8 if hour ruler matches day ruler
 * - +5 if moon sign element matches user element
 * - +0 to +20 from learned peak window score
 * - -5 if recent bad outcomes in this segment
 * 
 * Final range: 0-100 (clamped)
 */
export function computeHarmonyScore(
  input: HarmonyComputationInput
): HarmonyScoreResult {
  // Base score
  let score = 50;
  const components = {
    baseScore: 50,
    planetaryDayBonus: 0,
    planetaryHourBonus: 0,
    moonSignBonus: 0,
    peakWindowBonus: 0,
    outcomePenalty: 0,
  };
  const explanationBullets: string[] = [];
  
  // Get planetary day ruler
  const dayOfWeek = input.datetime.getDay();
  const dayRuler = DAY_RULERS[dayOfWeek];
  
  // Check if user has burj ruler
  if (input.userBurjRuler) {
    if (dayRuler === input.userBurjRuler) {
      components.planetaryDayBonus = 10;
      score += 10;
      explanationBullets.push(`Today's ruler (${dayRuler}) aligns with your burj`);
    }
  }
  
  // Get planetary hour ruler (simplified by segment)
  const hourRuler = getPlanetaryHourRulerBySegment(
    input.timeSegment,
    dayRuler,
    input.planetPositions
  );
  
  // Check if hour matches day
  if (hourRuler === dayRuler) {
    components.planetaryHourBonus = 8;
    score += 8;
    explanationBullets.push(`This hour's ruler matches the day (${hourRuler})`);
  }
  
  // Check moon sign element if positions available
  if (input.planetPositions && input.planetPositions.source === 'ephemeris') {
    const moonSign = input.planetPositions.planets.moon.sign;
    const moonElement = getZodiacSignElement(moonSign);
    
    if (moonElement === input.userElement) {
      components.moonSignBonus = 5;
      score += 5;
      explanationBullets.push(`Moon's element (${moonElement}) matches yours`);
    }
  }
  
  // Add peak window bonus (0-20 from learned patterns)
  const peakBonus = Math.round(input.peakWindowScore * 20);
  components.peakWindowBonus = peakBonus;
  score += peakBonus;
  
  if (peakBonus > 10) {
    explanationBullets.push(`Your pattern shows strength in this window (+${peakBonus})`);
  }
  
  // Check recent outcomes
  if (input.recentOutcomes && input.recentOutcomes.length > 0) {
    const badCount = input.recentOutcomes.filter(o => o === 'bad').length;
    const totalCount = input.recentOutcomes.length;
    
    if (badCount / totalCount > 0.5) {
      components.outcomePenalty = -5;
      score -= 5;
      explanationBullets.push(`Recent outcomes suggest caution in this window`);
    }
  }
  
  // Clamp to 0-100
  score = Math.max(0, Math.min(100, score));
  
  // If no specific bonuses, add generic guidance
  if (explanationBullets.length === 0) {
    explanationBullets.push(`Baseline harmony for ${input.timeSegment} period`);
  }
  
  // Add intention-specific guidance
  const intentionGuidance = getIntentionGuidance(input.intentionCategory, hourRuler);
  if (intentionGuidance) {
    explanationBullets.push(intentionGuidance);
  }
  
  // Determine data quality
  let dataQuality: 'full' | 'partial' | 'minimal' = 'minimal';
  if (input.planetPositions?.source === 'ephemeris') {
    dataQuality = 'full';
  } else if (input.planetPositions?.source === 'approx') {
    dataQuality = 'partial';
  }
  
  return {
    score,
    components,
    explanationBullets,
    dataQuality,
  };
}

/**
 * Get planetary hour ruler by time segment
 * 
 * Simplified approach:
 * - If sunrise/sunset available, use classical planetary hours
 * - Otherwise, use segment-based approximation
 */
function getPlanetaryHourRulerBySegment(
  segment: TimeSegment,
  dayRuler: PlanetId,
  positions?: PlanetPositions
): PlanetId {
  // For now, use simplified segment mapping
  // In future version, calculate actual planetary hours from sunrise
  
  const dayRulerIndex = PLANETARY_HOUR_SEQUENCE.indexOf(dayRuler);
  const segmentIndices = SEGMENT_TO_HOUR_RULER_APPROX[segment];
  
  // Pick the first index in the segment range
  const hourIndex = (dayRulerIndex + segmentIndices[0]) % 7;
  
  return PLANETARY_HOUR_SEQUENCE[hourIndex];
}

/**
 * Get intention-specific guidance based on planetary hour
 */
function getIntentionGuidance(
  intention: IntentionCategory,
  hourRuler: PlanetId
): string | null {
  const planetElement = PLANET_ELEMENTS[hourRuler];
  
  switch (intention) {
    case 'start':
      if (planetElement === 'fire') {
        return 'Fire energy supports new beginnings';
      }
      break;
    
    case 'communication':
      if (hourRuler === 'mercury') {
        return 'Mercury favors communication and writing';
      }
      break;
    
    case 'study':
      if (planetElement === 'air' || hourRuler === 'mercury') {
        return 'Air energy supports learning and contemplation';
      }
      break;
    
    case 'relationship':
      if (hourRuler === 'venus' || hourRuler === 'moon') {
        return 'Gentle energy favors connection';
      }
      break;
    
    case 'travel':
      if (hourRuler === 'jupiter' || hourRuler === 'mercury') {
        return 'Expansive energy supports movement';
      }
      break;
    
    case 'rest':
      if (planetElement === 'water' || hourRuler === 'moon') {
        return 'Water energy supports rest and reflection';
      }
      break;
  }
  
  return null;
}

// ============================================================================
// DAY & HOUR UTILITIES
// ============================================================================

/**
 * Get planetary day ruler for a date
 */
export function getPlanetaryDayRuler(date: Date): PlanetId {
  const dayOfWeek = date.getDay();
  return DAY_RULERS[dayOfWeek];
}

/**
 * Get planetary hour ruler (simplified by time)
 * 
 * @param date - Current datetime
 * @param segment - Time segment (if known)
 * @returns Planetary hour ruler
 */
export function getPlanetaryHourRuler(
  date: Date,
  segment?: TimeSegment
): PlanetId {
  const dayRuler = getPlanetaryDayRuler(date);
  
  if (!segment) {
    // Derive segment from time
    segment = getTimeSegmentFromDate(date);
  }
  
  return getPlanetaryHourRulerBySegment(segment, dayRuler);
}

/**
 * Derive time segment from date/time
 */
export function getTimeSegmentFromDate(date: Date): TimeSegment {
  const hours = date.getHours();
  
  if (hours >= 4 && hours < 6) return 'preDawn';
  if (hours >= 6 && hours < 10) return 'morning';
  if (hours >= 10 && hours < 14) return 'midday';
  if (hours >= 14 && hours < 18) return 'afternoon';
  if (hours >= 18 && hours < 21) return 'evening';
  return 'night';
}

/**
 * Get time range for a segment
 */
export function getSegmentTimeRange(segment: TimeSegment): { start: string; end: string } {
  const ranges = {
    preDawn: { start: '04:00', end: '06:00' },
    morning: { start: '06:00', end: '10:00' },
    midday: { start: '10:00', end: '14:00' },
    afternoon: { start: '14:00', end: '18:00' },
    evening: { start: '18:00', end: '21:00' },
    night: { start: '21:00', end: '04:00' },
  };
  
  return ranges[segment];
}

/**
 * Get user's burj ruler from their sign index
 * (Used if we have user's birth chart data)
 */
export function getBurjRuler(signIndex: number): PlanetId {
  return BURJ_RULERS[signIndex % 12];
}

/**
 * Format harmony score for display
 */
export function formatHarmonyScore(score: number): string {
  if (score >= 75) return '🌟 Excellent';
  if (score >= 60) return '✨ Good';
  if (score >= 45) return '⚖️ Balanced';
  if (score >= 30) return '🌙 Gentle';
  return '🕊️ Reflective';
}

/**
 * Get short guidance text based on score
 */
export function getQuickGuidance(score: number): string {
  if (score >= 75) {
    return 'Energy strongly supports your intention';
  } else if (score >= 60) {
    return 'Conditions favor mindful action';
  } else if (score >= 45) {
    return 'Proceed with awareness and presence';
  } else if (score >= 30) {
    return 'Consider gentle, deliberate steps';
  } else {
    return 'Best time for reflection and planning';
  }
}
