/**
 * Asrariya Timing Engine - Core Engine
 * =====================================
 * Main synthesis algorithm that combines all analysis layers
 * 
 * The engine answers: "Is THIS moment favorable for ME to do THIS practice?"
 * 
 * Key features:
 * - Weighted multi-layer analysis
 * - Practice-specific weight adjustments
 * - Contextual recommendation generation
 * - Alternative timing suggestions
 * 
 * @module AsrariyaTimingEngine/engine
 */

import { getCurrentLunarMansion } from '@/services/LunarMansionService';
import type { Planet } from '@/services/PlanetaryHoursService';
import { getPlanetaryHourDataForNow } from '@/services/PlanetaryHoursService';
import type { UserProfile } from '@/types/user-profile';

import {
    ActionRecommendation,
    AlternativeTiming,
    AsrariyaEngineConfig,
    AsrariyaTimingResult,
    CurrentMoment,
    DEFAULT_ENGINE_CONFIG,
    Element,
    PRACTICE_WEIGHT_CONFIGS,
    PracticeCategory,
    RecommendationLevel,
    TimingEnhancement,
    UserIntent,
    UserSpiritalProfile,
} from './types';

import {
    analyzeElementCompatibility,
    analyzeManazilAlignment,
    analyzePlanetaryResonance,
    analyzePracticeMapping,
} from './layers';

// ============================================================================
// CONSTANTS
// ============================================================================

const DAY_RULERS: Record<number, Planet> = {
  0: 'Sun',     // Sunday
  1: 'Moon',    // Monday
  2: 'Mars',    // Tuesday
  3: 'Mercury', // Wednesday
  4: 'Jupiter', // Thursday
  5: 'Venus',   // Friday
  6: 'Saturn',  // Saturday
};

const DAY_ELEMENTS: Record<number, Element> = {
  0: 'fire',   // Sunday - Sun
  1: 'water',  // Monday - Moon
  2: 'fire',   // Tuesday - Mars
  3: 'air',    // Wednesday - Mercury
  4: 'air',    // Thursday - Jupiter (some say fire, but air is wisdom)
  5: 'water',  // Friday - Venus
  6: 'earth',  // Saturday - Saturn
};

const PLANET_ELEMENTS: Record<Planet, Element> = {
  Sun: 'fire',
  Moon: 'water',
  Mars: 'fire',
  Mercury: 'air',
  Jupiter: 'air',
  Venus: 'water',
  Saturn: 'earth',
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Convert UserProfile to UserSpiritalProfile format
 */
export function profileToSpiritualProfile(profile: UserProfile): UserSpiritalProfile {
  return {
    name: profile.nameAr || '',
    motherName: profile.motherName,
    burjIndex: profile.derived?.burjIndex,
    burjName: profile.derived?.burj,
    element: (profile.derived?.element || 'fire') as Element,
    rulingPlanet: profile.derived?.planetaryRuler,
    personalManazil: profile.derived?.manazilPersonal,
    ascendantIndex: profile.derived?.ascendantBurjIndex,
    ascendantElement: profile.derived?.ascendantElement as Element | undefined,
  };
}

/**
 * Build current moment from real-time data
 */
export async function buildCurrentMoment(
  location?: { latitude: number; longitude: number },
  now: Date = new Date()
): Promise<CurrentMoment> {
  const dayOfWeek = now.getDay();
  const dayRuler = DAY_RULERS[dayOfWeek];
  const dayElement = DAY_ELEMENTS[dayOfWeek];
  
  // Get planetary hour data
  let planetaryHourPlanet: Planet = dayRuler;
  let planetaryHourElement: Element = dayElement;
  let planetaryHourRemainingSeconds = 3600; // Default 1 hour
  
  try {
    // Try to get accurate planetary hour data
    if (location) {
      const hourData = await getPlanetaryHourDataForNow(location, { now });
      if (hourData) {
        planetaryHourPlanet = hourData.currentHour.planet;
        planetaryHourElement = PLANET_ELEMENTS[planetaryHourPlanet];
        planetaryHourRemainingSeconds = hourData.countdownSeconds;
      }
    }
  } catch {
    // Use simplified fallback
    const hour = now.getHours();
    // Simplified hour calculation (not astronomically accurate)
    const chaldeanOrder: Planet[] = ['Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon'];
    const dayRulerIndex = chaldeanOrder.indexOf(dayRuler);
    const hourIndex = (dayRulerIndex + hour) % 7;
    planetaryHourPlanet = chaldeanOrder[hourIndex];
    planetaryHourElement = PLANET_ELEMENTS[planetaryHourPlanet];
  }
  
  // Get lunar mansion data
  let currentManazil = 0;
  let currentManazilData = undefined;
  
  try {
    const mansionResult = await getCurrentLunarMansion(now);
    currentManazil = mansionResult.index;
    currentManazilData = mansionResult.mansion;
  } catch {
    // Fallback to simple calculation based on day of year
    const startOfYear = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - startOfYear.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    // Moon cycle is ~29.5 days, 28 mansions
    currentManazil = Math.floor((dayOfYear * 28) / 365) % 28;
  }
  
  return {
    timestamp: now,
    dayOfWeek,
    dayRuler,
    dayElement,
    planetaryHourPlanet,
    planetaryHourElement,
    planetaryHourRemainingSeconds,
    currentManazil,
    currentManazilData,
  };
}

/**
 * Get configuration with practice-specific weights
 */
function getConfigForPractice(
  baseConfig: AsrariyaEngineConfig,
  category: PracticeCategory
): AsrariyaEngineConfig {
  const practiceOverride = PRACTICE_WEIGHT_CONFIGS[category];
  if (!practiceOverride) {
    return baseConfig;
  }
  return { ...baseConfig, ...practiceOverride };
}

/**
 * Calculate recommendation level from score
 * 
 * Thresholds aligned with MomentAlignment badge system:
 * - 75%+: highly-favorable (OPTIMAL badge)
 * - 55-74%: favorable (ACT badge) 
 * - 40-54%: moderate (MAINTAIN badge)
 * - 25-39%: cautious (CAREFUL badge)
 * - 0-24%: challenging (HOLD badge)
 */
function getRecommendationLevel(score: number): RecommendationLevel {
  if (score >= 75) return 'highly-favorable';
  if (score >= 55) return 'favorable';
  if (score >= 40) return 'moderate';
  if (score >= 25) return 'cautious';
  return 'challenging';
}

/**
 * Determine action recommendation from score and layers
 */
function getActionRecommendation(
  score: number,
  layers: AsrariyaTimingResult['layers']
): ActionRecommendation {
  if (score >= 70) return 'proceed';
  if (score >= 50) {
    // Check if any layer has severe issues
    const hasWarning = Object.values(layers).some(l => l.score < 30);
    return hasWarning ? 'proceed-with-care' : 'proceed';
  }
  if (score >= 35) {
    // Check if practice can be modified
    if (layers.practiceMapping.adjustments.length > 0) {
      return 'modify';
    }
    return 'proceed-with-care';
  }
  return 'wait';
}

/**
 * Calculate confidence based on layer agreement
 */
function calculateConfidence(
  layers: AsrariyaTimingResult['layers']
): 'high' | 'medium' | 'low' {
  const scores = Object.values(layers).map(l => l.score);
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  const variance = scores.reduce((sum, s) => sum + Math.pow(s - avg, 2), 0) / scores.length;
  const stdDev = Math.sqrt(variance);
  
  // Low variance = high agreement = high confidence
  if (stdDev < 15) return 'high';
  if (stdDev < 25) return 'medium';
  return 'low';
}

/**
 * Generate enhancements based on analysis
 */
function generateEnhancements(
  user: UserSpiritalProfile,
  moment: CurrentMoment,
  intent: UserIntent,
  layers: AsrariyaTimingResult['layers']
): TimingEnhancement[] {
  const enhancements: TimingEnhancement[] = [];
  
  // Time-based enhancement
  if (moment.planetaryHourRemainingSeconds > 0) {
    const mins = Math.floor(moment.planetaryHourRemainingSeconds / 60);
    if (mins > 10 && layers.planetaryResonance.score >= 60) {
      enhancements.push({
        type: 'timing',
        text: `Current ${moment.planetaryHourPlanet} hour continues for ${mins} minutes`,
        icon: '⏰',
      });
    }
  }
  
  // Direction enhancement based on element
  const directionByElement: Record<Element, { direction: string; icon: string }> = {
    fire: { direction: 'Face East for solar/fire energy', icon: '🌅' },
    air: { direction: 'Face North for clarity and wisdom', icon: '🧭' },
    water: { direction: 'Face West for emotional depth', icon: '🌊' },
    earth: { direction: 'Face South for grounding', icon: '🏔️' },
  };
  
  const preferredElement = intent.category === 'protection' ? 'fire' : 
                          intent.category === 'healing' ? 'water' : user.element;
  
  if (layers.elementCompatibility.score >= 50) {
    const dir = directionByElement[preferredElement];
    enhancements.push({
      type: 'direction',
      text: dir.direction,
      icon: dir.icon,
    });
  }
  
  // Dhikr enhancement
  if (intent.category === 'protection') {
    enhancements.push({
      type: 'dhikr',
      text: 'Begin with 3x Ayat al-Kursi for foundation',
      textAr: 'ابدأ بثلاث مرات آية الكرسي',
      icon: '📿',
    });
  } else if (intent.category === 'healing') {
    enhancements.push({
      type: 'dhikr',
      text: 'Include Ya Shafi (The Healer) in your practice',
      textAr: 'أضف يا شافي إلى ذكرك',
      icon: '💚',
    });
  }
  
  // Stone enhancement based on element (if available)
  const stoneByElement: Record<Element, string> = {
    fire: 'Hold carnelian or garnet for amplification',
    air: 'Clear quartz enhances mental clarity',
    water: 'Moonstone deepens emotional work',
    earth: 'Black tourmaline for grounding and protection',
  };
  
  if (layers.elementCompatibility.score >= 60) {
    enhancements.push({
      type: 'stone',
      text: stoneByElement[user.element],
      icon: '💎',
    });
  }
  
  // Ayah reference based on manazil
  if (moment.currentManazilData) {
    enhancements.push({
      type: 'ayah',
      text: `Reflect on Surah appropriate to ${moment.currentManazilData.nameTransliteration}`,
      icon: '📖',
    });
  }
  
  return enhancements.slice(0, 5); // Max 5 enhancements
}

/**
 * Generate cautions based on analysis
 */
function generateCautions(
  layers: AsrariyaTimingResult['layers'],
  intent: UserIntent
): string[] {
  const cautions: string[] = [];
  
  // Element tension caution
  if (layers.elementCompatibility.relationship === 'tension') {
    cautions.push('Elemental tension present — maintain inner balance and don\'t force outcomes.');
  }
  
  // Planetary tension caution
  if (layers.planetaryResonance.score < 40) {
    cautions.push('Planetary conditions are challenging — shorter, focused practice recommended.');
  }
  
  // Manazil caution
  if (layers.manazilAlignment.themeCompatibility === 'cautious') {
    cautions.push('Current lunar mansion suggests gentler approach to this practice.');
  }
  
  // Practice-specific cautions
  if (!layers.practiceMapping.suitable) {
    cautions.push(...layers.practiceMapping.adjustments);
  }
  
  return cautions.slice(0, 3); // Max 3 cautions
}

/**
 * Generate synthesized reasoning text
 */
function synthesizeReasoning(
  layers: AsrariyaTimingResult['layers'],
  level: RecommendationLevel,
  user: UserSpiritalProfile,
  intent: UserIntent
): string {
  const parts: string[] = [];
  
  // Lead with overall assessment
  switch (level) {
    case 'highly-favorable':
      parts.push('Excellent timing for your practice!');
      break;
    case 'favorable':
      parts.push('Good timing for your practice.');
      break;
    case 'moderate':
      parts.push('Moderate conditions for practice.');
      break;
    case 'cautious':
      parts.push('Timing suggests proceeding with care.');
      break;
    case 'challenging':
      parts.push('Challenging timing — consider waiting for better alignment.');
      break;
  }
  
  // Add strongest supporting factor
  const sortedLayers = Object.entries(layers).sort(([, a], [, b]) => b.score - a.score);
  const [strongestKey, strongest] = sortedLayers[0];
  
  if (strongest.score >= 70) {
    parts.push(strongest.reasoning);
  }
  
  // Add any notable warnings
  const [, weakest] = sortedLayers[sortedLayers.length - 1];
  if (weakest.score < 40 && weakest.reasoning) {
    // Abbreviate the warning
    parts.push('Note: ' + weakest.reasoning.split('.')[0] + '.');
  }
  
  return parts.join(' ');
}

/**
 * Generate short summary for UI badges
 */
function generateShortSummary(
  level: RecommendationLevel,
  action: ActionRecommendation
): string {
  switch (level) {
    case 'highly-favorable':
      return 'Excellent Time';
    case 'favorable':
      return 'Good Time';
    case 'moderate':
      return 'Proceed Mindfully';
    case 'cautious':
      return 'Wait if Possible';
    case 'challenging':
      return 'Not Ideal';
  }
}

// ============================================================================
// MAIN ENGINE
// ============================================================================

/**
 * Main Asrariya Timing Engine
 * 
 * Analyzes whether the current moment is favorable for a specific practice
 * based on the user's spiritual profile.
 */
export async function analyzeTimingForPractice(
  userProfile: UserProfile | UserSpiritalProfile,
  intent: UserIntent,
  options?: {
    location?: { latitude: number; longitude: number };
    config?: Partial<AsrariyaEngineConfig>;
    moment?: CurrentMoment; // Allow passing pre-built moment for testing
  }
): Promise<AsrariyaTimingResult> {
  // Convert profile if needed
  const user: UserSpiritalProfile = 'mode' in userProfile
    ? profileToSpiritualProfile(userProfile)
    : userProfile;
  
  // Build or use provided moment
  const moment = options?.moment || await buildCurrentMoment(
    options?.location,
    new Date()
  );
  
  // Get configuration with practice-specific weights
  const baseConfig = { ...DEFAULT_ENGINE_CONFIG, ...(options?.config || {}) };
  const config = getConfigForPractice(baseConfig, intent.category);
  
  // Run all analysis layers
  const elementCompatibility = analyzeElementCompatibility(user, moment, intent);
  const planetaryResonance = analyzePlanetaryResonance(user, moment, intent);
  const manazilAlignment = analyzeManazilAlignment(user, moment, intent);
  const practiceMapping = analyzePracticeMapping(user, moment, intent);
  
  const layers = {
    elementCompatibility,
    planetaryResonance,
    manazilAlignment,
    practiceMapping,
  };
  
  // Calculate weighted overall score
  const overallScore = Math.round(
    elementCompatibility.score * config.elementWeight +
    planetaryResonance.score * config.planetaryWeight +
    manazilAlignment.score * config.manazilWeight +
    practiceMapping.score * config.practiceWeight
  );
  
  // Determine recommendation level and action
  const level = getRecommendationLevel(overallScore);
  const action = getActionRecommendation(overallScore, layers);
  const confidence = calculateConfidence(layers);
  
  // Generate synthesized reasoning
  const reasoning = synthesizeReasoning(layers, level, user, intent);
  const shortSummary = generateShortSummary(level, action);
  
  // Generate enhancements and cautions
  const enhancements = generateEnhancements(user, moment, intent, layers);
  const cautions = generateCautions(layers, intent);
  
  // Calculate optimal window end (if in favorable window)
  let optimalWindowEnd: Date | undefined;
  if (overallScore >= 60 && moment.planetaryHourRemainingSeconds > 0) {
    optimalWindowEnd = new Date(
      moment.timestamp.getTime() + moment.planetaryHourRemainingSeconds * 1000
    );
  }
  
  return {
    overallScore,
    level,
    action,
    confidence,
    reasoning,
    shortSummary,
    layers,
    enhancements,
    cautions,
    optimalWindowEnd,
    analyzedAt: new Date(),
  };
}

/**
 * Quick check: Is now a good time for this practice?
 * Returns a simple yes/no/maybe with brief reason
 */
export async function quickTimingCheck(
  userProfile: UserProfile | UserSpiritalProfile,
  category: PracticeCategory,
  location?: { latitude: number; longitude: number }
): Promise<{
  isGoodTime: boolean;
  summary: string;
  score: number;
}> {
  const result = await analyzeTimingForPractice(
    userProfile,
    { category },
    { location }
  );
  
  return {
    isGoodTime: result.overallScore >= 50,
    summary: result.shortSummary,
    score: result.overallScore,
  };
}

/**
 * Find the next optimal window for a practice
 */
export async function findNextOptimalWindow(
  userProfile: UserProfile | UserSpiritalProfile,
  intent: UserIntent,
  options?: {
    location?: { latitude: number; longitude: number };
    lookAheadHours?: number;
    minimumScore?: number;
  }
): Promise<AlternativeTiming | null> {
  const lookAhead = options?.lookAheadHours || 24;
  const minScore = options?.minimumScore || 70;
  
  const user: UserSpiritalProfile = 'mode' in userProfile
    ? profileToSpiritualProfile(userProfile)
    : userProfile;
  
  // Check each hour for the next 24 hours
  for (let i = 1; i <= lookAhead; i++) {
    const checkTime = new Date();
    checkTime.setHours(checkTime.getHours() + i);
    checkTime.setMinutes(0, 0, 0);
    
    const moment = await buildCurrentMoment(options?.location, checkTime);
    
    const result = await analyzeTimingForPractice(user, intent, {
      location: options?.location,
      moment,
    });
    
    if (result.overallScore >= minScore) {
      const endTime = new Date(checkTime);
      endTime.setHours(endTime.getHours() + 1);
      
      return {
        startTime: checkTime,
        endTime,
        expectedScore: result.overallScore,
        description: `${result.level} timing at ${checkTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      };
    }
  }
  
  return null;
}
