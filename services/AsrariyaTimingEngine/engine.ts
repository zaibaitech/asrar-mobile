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
  layers: AsrariyaTimingResult['layers'],
  language: 'en' | 'fr' | 'ar' = 'en'
): TimingEnhancement[] {
  const enhancements: TimingEnhancement[] = [];

  const planetLabel = (planet: Planet, lang: 'en' | 'fr' | 'ar') => {
    if (lang === 'fr') {
      const map: Record<Planet, string> = {
        Sun: 'Soleil',
        Moon: 'Lune',
        Mars: 'Mars',
        Mercury: 'Mercure',
        Jupiter: 'Jupiter',
        Venus: 'Vénus',
        Saturn: 'Saturne',
      };
      return map[planet];
    }
    if (lang === 'ar') {
      const map: Record<Planet, string> = {
        Sun: 'الشمس',
        Moon: 'القمر',
        Mars: 'المريخ',
        Mercury: 'عطارد',
        Jupiter: 'المشتري',
        Venus: 'الزهرة',
        Saturn: 'زحل',
      };
      return map[planet];
    }
    return planet;
  };
  
  // Time-based enhancement
  if (moment.planetaryHourRemainingSeconds > 0) {
    const mins = Math.floor(moment.planetaryHourRemainingSeconds / 60);
    if (mins > 10 && layers.planetaryResonance.score >= 60) {
      enhancements.push({
        type: 'timing',
        text: `Current ${moment.planetaryHourPlanet} hour continues for ${mins} minutes`,
        textFr: `L'heure de ${planetLabel(moment.planetaryHourPlanet, 'fr')} continue pendant ${mins} minutes`,
        textAr: `تستمر ساعة ${planetLabel(moment.planetaryHourPlanet, 'ar')} لمدة ${mins} دقيقة`,
        icon: '⏰',
      });
    }
  }
  
  // Direction enhancement based on element
  const directionByElement: Record<Element, { icon: string; en: string; fr: string; ar: string }> = {
    fire: {
      icon: '🌅',
      en: 'Face East for solar/fire energy',
      fr: "Tournez-vous vers l'Est pour l'énergie solaire/feu",
      ar: 'اتجه نحو الشرق لطاقة الشمس/النار',
    },
    air: {
      icon: '🧭',
      en: 'Face North for clarity and wisdom',
      fr: 'Tournez-vous vers le Nord pour la clarté et la sagesse',
      ar: 'اتجه نحو الشمال للوضوح والحكمة',
    },
    water: {
      icon: '🌊',
      en: 'Face West for emotional depth',
      fr: "Tournez-vous vers l'Ouest pour la profondeur émotionnelle",
      ar: 'اتجه نحو الغرب للعمق العاطفي',
    },
    earth: {
      icon: '🏔️',
      en: 'Face South for grounding',
      fr: 'Tournez-vous vers le Sud pour vous ancrer',
      ar: 'اتجه نحو الجنوب للتأريض والثبات',
    },
  };
  
  const preferredElement = intent.category === 'protection' ? 'fire' : 
                          intent.category === 'healing' ? 'water' : user.element;
  
  if (layers.elementCompatibility.score >= 50) {
    const dir = directionByElement[preferredElement];
    enhancements.push({
      type: 'direction',
      text: dir.en,
      textFr: dir.fr,
      textAr: dir.ar,
      icon: dir.icon,
    });
  }
  
  // Dhikr enhancement
  if (intent.category === 'protection') {
    enhancements.push({
      type: 'dhikr',
      text: 'Begin with 3x Ayat al-Kursi for foundation',
      textFr: 'Commencez par 3x Ayat al-Kursi pour établir une base',
      textAr: 'ابدأ بثلاث مرات آية الكرسي',
      icon: '📿',
    });
  } else if (intent.category === 'healing') {
    enhancements.push({
      type: 'dhikr',
      text: 'Include Ya Shafi (The Healer) in your practice',
      textFr: 'Ajoutez Ya Shafi (Le Guérisseur) à votre pratique',
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

  const stoneByElementFr: Record<Element, string> = {
    fire: 'Tenez une cornaline ou un grenat pour amplifier',
    air: 'Le quartz clair renforce la clarté mentale',
    water: 'La pierre de lune approfondit le travail émotionnel',
    earth: 'La tourmaline noire pour l’ancrage et la protection',
  };

  const stoneByElementAr: Record<Element, string> = {
    fire: 'أمسك العقيق الأحمر أو الرمان للتقوية',
    air: 'الكوارتز الشفاف يعزز صفاء الذهن',
    water: 'حجر القمر يعمّق العمل العاطفي',
    earth: 'التورمالين الأسود للتأريض والحماية',
  };
  
  if (layers.elementCompatibility.score >= 60) {
    enhancements.push({
      type: 'stone',
      text: stoneByElement[user.element],
      textFr: stoneByElementFr[user.element],
      textAr: stoneByElementAr[user.element],
      icon: '💎',
    });
  }
  
  // Ayah reference based on manazil
  if (moment.currentManazilData) {
    const manzilName = moment.currentManazilData.nameTransliteration;
    enhancements.push({
      type: 'ayah',
      text: `Reflect on a Surah appropriate to ${manzilName}`,
      textFr: `Réfléchissez à une sourate appropriée à ${manzilName}`,
      textAr: `تأمل في سورة مناسبة لـ ${manzilName}`,
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
  intent: UserIntent,
  language: 'en' | 'fr' | 'ar' = 'en'
): string[] {
  const cautions: string[] = [];
  
  // Element tension caution
  if (layers.elementCompatibility.relationship === 'tension') {
    cautions.push(
      language === 'fr'
        ? 'Tension élémentaire — gardez l’équilibre intérieur et ne forcez pas les résultats.'
        : language === 'ar'
          ? 'هناك توتر عنصري — حافظ على توازنك الداخلي ولا تُجبر النتائج.'
          : 'Elemental tension present — maintain inner balance and don\'t force outcomes.'
    );
  }
  
  // Planetary tension caution
  if (layers.planetaryResonance.score < 40) {
    cautions.push(
      language === 'fr'
        ? 'Les conditions planétaires sont difficiles — privilégiez une pratique plus courte et concentrée.'
        : language === 'ar'
          ? 'الظروف الكوكبية صعبة — يُنصح بممارسة أقصر وأكثر تركيزًا.'
          : 'Planetary conditions are challenging — shorter, focused practice recommended.'
    );
  }
  
  // Manazil caution
  if (layers.manazilAlignment.themeCompatibility === 'cautious') {
    cautions.push(
      language === 'fr'
        ? 'Le manzil actuel suggère une approche plus douce pour cette pratique.'
        : language === 'ar'
          ? 'المنزل القمري الحالي يوصي بنهج ألطف لهذه الممارسة.'
          : 'Current lunar mansion suggests gentler approach to this practice.'
    );
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
  intent: UserIntent,
  language: 'en' | 'fr' | 'ar' = 'en'
): string {
  const parts: string[] = [];
  
  // Lead with overall assessment
  switch (level) {
    case 'highly-favorable':
      parts.push(
        language === 'fr'
          ? 'Excellent timing pour votre pratique !'
          : language === 'ar'
            ? 'توقيت ممتاز لممارستك!'
            : 'Excellent timing for your practice!'
      );
      break;
    case 'favorable':
      parts.push(
        language === 'fr'
          ? 'Bon timing pour votre pratique.'
          : language === 'ar'
            ? 'توقيت جيد لممارستك.'
            : 'Good timing for your practice.'
      );
      break;
    case 'moderate':
      parts.push(
        language === 'fr'
          ? 'Conditions modérées pour la pratique.'
          : language === 'ar'
            ? 'ظروف متوسطة للممارسة.'
            : 'Moderate conditions for practice.'
      );
      break;
    case 'cautious':
      parts.push(
        language === 'fr'
          ? 'Le timing suggère d’avancer avec prudence.'
          : language === 'ar'
            ? 'التوقيت يوصي بالتقدّم بحذر.'
            : 'Timing suggests proceeding with care.'
      );
      break;
    case 'challenging':
      parts.push(
        language === 'fr'
          ? 'Timing difficile — envisagez d’attendre un meilleur alignement.'
          : language === 'ar'
            ? 'توقيت صعب — فكّر في الانتظار حتى يتحسن الانسجام.'
            : 'Challenging timing — consider waiting for better alignment.'
      );
      break;
  }
  
  // Add strongest supporting factor
  const sortedLayers = Object.entries(layers).sort(([, a], [, b]) => b.score - a.score);
  const [strongestKey, strongest] = sortedLayers[0];
  
  if (strongest.score >= 70) {
    const strongestReason =
      language === 'fr'
        ? strongest.reasoningFr || strongest.reasoning
        : language === 'ar'
          ? strongest.reasoningAr || strongest.reasoning
          : strongest.reasoning;
    parts.push(strongestReason);
  }
  
  // Add any notable warnings
  const [, weakest] = sortedLayers[sortedLayers.length - 1];
  if (weakest.score < 40 && weakest.reasoning) {
    // Abbreviate the warning
    const weakestReason =
      language === 'fr'
        ? weakest.reasoningFr || weakest.reasoning
        : language === 'ar'
          ? weakest.reasoningAr || weakest.reasoning
          : weakest.reasoning;

    const notePrefix =
      language === 'fr'
        ? 'Note : '
        : language === 'ar'
          ? 'ملاحظة: '
          : 'Note: ';

    parts.push(notePrefix + weakestReason.split('.')[0] + '.');
  }
  
  return parts.join(' ');
}

/**
 * Generate short summary for UI badges
 */
function generateShortSummary(
  level: RecommendationLevel,
  action: ActionRecommendation,
  language: 'en' | 'fr' | 'ar' = 'en'
): string {
  switch (level) {
    case 'highly-favorable':
      return language === 'fr' ? 'Excellent moment' : language === 'ar' ? 'وقت ممتاز' : 'Excellent Time';
    case 'favorable':
      return language === 'fr' ? 'Bon Moment' : language === 'ar' ? 'وقت جيد' : 'Good Time';
    case 'moderate':
      return language === 'fr' ? 'Avancer avec attention' : language === 'ar' ? 'تابع بوعي' : 'Proceed Mindfully';
    case 'cautious':
      return language === 'fr' ? 'Attendre si possible' : language === 'ar' ? 'انتظر إن أمكن' : 'Wait if Possible';
    case 'challenging':
      return language === 'fr' ? 'Pas Idéal' : language === 'ar' ? 'غير مناسب' : 'Not Ideal';
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
    language?: 'en' | 'fr' | 'ar';
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

  const language = options?.language ?? 'en';
  
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
  const reasoning = synthesizeReasoning(layers, level, user, intent, language);
  const shortSummary = generateShortSummary(level, action, language);
  
  // Generate enhancements and cautions
  const enhancements = generateEnhancements(user, moment, intent, layers, language);
  const cautions = generateCautions(layers, intent, language);
  
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
    reasoningFr: language === 'fr' ? reasoning : undefined,
    reasoningAr: language === 'ar' ? reasoning : undefined,
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
  location?: { latitude: number; longitude: number },
  language: 'en' | 'fr' | 'ar' = 'en'
): Promise<{
  isGoodTime: boolean;
  summary: string;
  score: number;
}> {
  const result = await analyzeTimingForPractice(
    userProfile,
    { category },
    { location, language }
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
    language?: 'en' | 'fr' | 'ar';
  }
): Promise<AlternativeTiming | null> {
  const lookAhead = options?.lookAheadHours || 24;
  const minScore = options?.minimumScore || 70;
  const language = options?.language ?? 'en';
  
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
      language,
    });
    
    if (result.overallScore >= minScore) {
      const endTime = new Date(checkTime);
      endTime.setHours(endTime.getHours() + 1);
      
      return {
        startTime: checkTime,
        endTime,
        expectedScore: result.overallScore,
        description:
          language === 'fr'
            ? `Timing ${result.level} à ${checkTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
            : language === 'ar'
              ? `توقيت ${result.level} عند ${checkTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
              : `${result.level} timing at ${checkTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      };
    }
  }
  
  return null;
}
