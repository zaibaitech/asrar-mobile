/**
 * Cosmic Quality Service
 * =======================
 * TIER 1: Objective Cosmic Quality Assessment
 * 
 * Evaluates the universal quality of a moment independent of any user.
 * This is the foundation of authentic timing - analyzing whether the
 * moment itself carries barakah, is neutral, or is afflicted.
 * 
 * Answers: "Is THIS moment objectively strong or weak?"
 */

import { getCurrentLunarMansion } from './LunarMansionService';
import { getPlanetaryHourDataForNow } from './PlanetaryHoursService';
import { getPlanetaryCondition, type PlanetaryCondition } from './PlanetaryConditionService';
import type { Planet } from './PlanetaryHoursService';

// ============================================================================
// TYPES
// ============================================================================

export type CosmicState = 
  | 'baraka'       // 80-100: Blessed, excellent cosmic conditions
  | 'neutral'      // 50-79: Ordinary, permissible
  | 'makruh'       // 25-49: Disliked, weak
  | 'forbidden';   // 0-24: Prohibited, corrupted

export type ProhibitionType = 
  | 'void-of-course'       // Moon in void-of-course (no new beginnings)
  | 'lunar-eclipse'        // Lunar eclipse (no major work)
  | 'solar-eclipse'        // Solar eclipse (no major work)
  | 'planet-combust'       // Hour ruler combust
  | 'planet-fall'          // Hour ruler in fall
  | 'retrograde-warning'   // Hour ruler retrograde
  | 'dark-moon';           // Last 3 lunar days (caution)

export type ProhibitionSeverity = 
  | 'absolute'    // Must not proceed
  | 'strong'      // Strongly discouraged
  | 'moderate';   // Proceed with caution

export interface Prohibition {
  type: ProhibitionType;
  severity: ProhibitionSeverity;
  affectedPractices: string[];  // Practice types affected
  description: {
    en: string;
    ar: string;
    fr: string;
  };
}

export interface MoonState {
  phase: 'new' | 'waxing-crescent' | 'first-quarter' | 'waxing-gibbous' | 
         'full' | 'waning-gibbous' | 'last-quarter' | 'waning-crescent';
  lunarDay: number;            // 1-30
  waxing: boolean;
  illumination: number;        // 0-100%
  voidOfCourse: boolean;
  mansion: {
    index: number;
    name: string;
    intrinsicQuality: 'blessed' | 'neutral' | 'difficult';
  };
}

export interface CosmicQuality {
  timestamp: Date;
  
  hourRuler: {
    planet: Planet;
    condition: PlanetaryCondition;
    qualityScore: number;      // Hour ruler's overall quality
  };
  
  moonState: MoonState;
  
  prohibitions: Prohibition[];
  
  overallCosmicScore: number;  // 0-100
  ruling: CosmicState;
  
  reasoning: {
    en: string;
    ar: string;
    fr: string;
  };
}

// ============================================================================
// LUNAR MANSION INTRINSIC QUALITIES
// ============================================================================

/**
 * Traditional intrinsic qualities of the 28 lunar mansions
 * Based on classical Islamic astrological texts
 */
const MANSION_INTRINSIC_QUALITIES: Record<number, 'blessed' | 'neutral' | 'difficult'> = {
  0: 'neutral',      // Al-Sharatān - The Two Signs
  1: 'neutral',      // Al-Buṭayn - The Little Belly
  2: 'blessed',      // Al-Thurayyā - The Pleiades (blessed for most work)
  3: 'neutral',      // Al-Dabarān - The Follower
  4: 'neutral',      // Al-Haqʿah - The White Spot
  5: 'blessed',      // Al-Hanʿah - The Brand (good for building)
  6: 'neutral',      // Al-Dhirāʿ - The Arm
  7: 'difficult',    // Al-Nathrah - The Gap (challenging)
  8: 'neutral',      // Al-Ṭarf - The Eye
  9: 'neutral',      // Al-Jabhah - The Forehead
  10: 'blessed',     // Al-Zubrah - The Mane (good for courage)
  11: 'neutral',     // Al-Ṣarfah - The Changer
  12: 'blessed',     // Al-ʿAwwāʾ - The Barker (good for protection)
  13: 'blessed',     // Al-Simāk - The Unarmed (good for provision)
  14: 'neutral',     // Al-Ghafr - The Covering
  15: 'neutral',     // Al-Zubānā - The Claws
  16: 'neutral',     // Al-Iklīl - The Crown
  17: 'blessed',     // Al-Qalb - The Heart (blessed for spiritual work)
  18: 'difficult',   // Al-Shawlah - The Raised Tail (challenging)
  19: 'neutral',     // Al-Naʿāʾim - The Ostriches
  20: 'neutral',     // Al-Baldah - The City
  21: 'blessed',     // Saʿd al-Dhābiḥ - The Lucky One of the Slaughterers
  22: 'blessed',     // Saʿd Bulaʿ - The Lucky One of the Swallower
  23: 'blessed',     // Saʿd al-Suʿūd - The Luck of Lucks (MOST BLESSED)
  24: 'blessed',     // Saʿd al-Akhbiyah - The Lucky One of the Tents
  25: 'neutral',     // Al-Fargh al-Muqaddam - The First Spout
  26: 'neutral',     // Al-Fargh al-Muʾakhkhar - The Second Spout
  27: 'neutral',     // Baṭn al-Ḥūt - The Belly of the Fish
};

// ============================================================================
// MOON PHASE CALCULATION
// ============================================================================

/**
 * Calculate moon phase from lunar day
 */
function getMoonPhaseFromLunarDay(lunarDay: number): MoonState['phase'] {
  if (lunarDay <= 1) return 'new';
  if (lunarDay <= 7) return 'waxing-crescent';
  if (lunarDay <= 10) return 'first-quarter';
  if (lunarDay <= 14) return 'waxing-gibbous';
  if (lunarDay <= 16) return 'full';
  if (lunarDay <= 21) return 'waning-gibbous';
  if (lunarDay <= 24) return 'last-quarter';
  return 'waning-crescent';
}

/**
 * Calculate moon illumination percentage from lunar day
 */
function getMoonIllumination(lunarDay: number): number {
  // Simplified: max at day 14-15, min at day 1 and 28-30
  const normalized = lunarDay / 30;
  return Math.round(Math.abs(Math.sin(normalized * Math.PI)) * 100);
}

// ============================================================================
// PROHIBITION DETECTION
// ============================================================================

/**
 * Detect traditional astrological prohibitions
 */
function detectProhibitions(
  hourRulerCondition: PlanetaryCondition,
  moonState: MoonState
): Prohibition[] {
  const prohibitions: Prohibition[] = [];
  
  // Void-of-course Moon (simplified check - would need aspect calculation)
  if (moonState.voidOfCourse) {
    prohibitions.push({
      type: 'void-of-course',
      severity: 'absolute',
      affectedPractices: ['manifestation', 'new-beginnings', 'contracts', 'major-decisions'],
      description: {
        en: 'Moon is void-of-course. Avoid starting new projects or making major decisions.',
        ar: 'القمر فارغ السير. تجنب بدء مشاريع جديدة أو اتخاذ قرارات كبيرة.',
        fr: 'Lune en cours vide. Évitez de commencer de nouveaux projets ou de prendre des décisions majeures.',
      },
    });
  }
  
  // Dark Moon (last 3 days - caution for most work)
  if (moonState.lunarDay >= 27) {
    prohibitions.push({
      type: 'dark-moon',
      severity: 'moderate',
      affectedPractices: ['public-work', 'manifestation', 'social-activities'],
      description: {
        en: 'Dark moon phase. Time for rest, reflection, and inner work. Avoid major external activities.',
        ar: 'القمر المظلم. وقت للراحة والتأمل والعمل الداخلي. تجنب الأنشطة الخارجية الكبيرة.',
        fr: 'Phase de lune noire. Temps de repos, réflexion et travail intérieur. Évitez les grandes activités externes.',
      },
    });
  }
  
  // Hour ruler combust
  if (hourRulerCondition.aspects.combust) {
    prohibitions.push({
      type: 'planet-combust',
      severity: 'strong',
      affectedPractices: [`${hourRulerCondition.planet.toLowerCase()}-practices`],
      description: {
        en: `${hourRulerCondition.planet} is combust (too close to Sun). Its energy is weakened.`,
        ar: `${hourRulerCondition.planet} محترق (قريب جداً من الشمس). طاقته ضعيفة.`,
        fr: `${hourRulerCondition.planet} est combuste (trop proche du Soleil). Son énergie est affaiblie.`,
      },
    });
  }
  
  // Hour ruler in fall
  if (hourRulerCondition.dignity.type === 'fall') {
    prohibitions.push({
      type: 'planet-fall',
      severity: 'strong',
      affectedPractices: [`${hourRulerCondition.planet.toLowerCase()}-practices`],
      description: {
        en: `${hourRulerCondition.planet} is in fall (${hourRulerCondition.position.sign}). Its natural expression is severely compromised.`,
        ar: `${hourRulerCondition.planet} في هبوطه (${hourRulerCondition.position.sign}). تعبيره الطبيعي ضعيف جداً.`,
        fr: `${hourRulerCondition.planet} est en chute (${hourRulerCondition.position.sign}). Son expression naturelle est gravement compromise.`,
      },
    });
  }
  
  // Hour ruler retrograde
  if (hourRulerCondition.motion.retrograde) {
    prohibitions.push({
      type: 'retrograde-warning',
      severity: 'moderate',
      affectedPractices: ['new-beginnings', 'forward-movement'],
      description: {
        en: `${hourRulerCondition.planet} is retrograde. Energy is internalized. Better for review, revision, and inner work than new external initiatives.`,
        ar: `${hourRulerCondition.planet} رجعي. الطاقة داخلية. أفضل للمراجعة والتنقيح والعمل الداخلي من المبادرات الخارجية الجديدة.`,
        fr: `${hourRulerCondition.planet} est rétrograde. L'énergie est internalisée. Mieux pour la révision et le travail intérieur que pour de nouvelles initiatives externes.`,
      },
    });
  }
  
  return prohibitions;
}

// ============================================================================
// MAIN COSMIC QUALITY ANALYSIS
// ============================================================================

/**
 * Analyze the objective cosmic quality of a moment
 * This is universal - same for all users
 */
export async function analyzeCosmicQuality(
  moment: Date,
  location: { latitude: number; longitude: number }
): Promise<CosmicQuality> {
  try {
    // Get planetary hour data
    const hourData = await getPlanetaryHourDataForNow(location, { now: moment });
    if (!hourData) {
      throw new Error('Could not determine planetary hour');
    }
    
    const hourRuler = hourData.currentHour.planet;
    
    // Get hour ruler's planetary condition
    const hourRulerCondition = await getPlanetaryCondition(hourRuler, moment, location);
    
    // Get lunar mansion
    const mansion = await getCurrentLunarMansion(moment);
    
    // Simplified moon state (would be enhanced with actual ephemeris)
    const lunarDay = Math.floor(((moment.getTime() / (1000 * 60 * 60 * 24)) % 29.53) + 1);
    const moonPhase = getMoonPhaseFromLunarDay(lunarDay);
    const illumination = getMoonIllumination(lunarDay);
    const waxing = lunarDay < 15;
    
    // TODO: Implement actual void-of-course detection (requires aspect calculation)
    const voidOfCourse = false;
    
    const moonState: MoonState = {
      phase: moonPhase,
      lunarDay,
      waxing,
      illumination,
      voidOfCourse,
      mansion: {
        index: mansion.index,
        name: mansion.mansion.nameTransliteration,
        intrinsicQuality: MANSION_INTRINSIC_QUALITIES[mansion.index] || 'neutral',
      },
    };
    
    // Detect prohibitions
    const prohibitions = detectProhibitions(hourRulerCondition, moonState);
    
    // Calculate overall cosmic score
    let overallCosmicScore = 0;
    
    // Hour ruler condition contributes 60%
    overallCosmicScore += hourRulerCondition.overallQuality * 0.6;
    
    // Moon state contributes 25%
    let moonScore = 50; // Base neutral
    
    if (moonState.mansion.intrinsicQuality === 'blessed') moonScore += 30;
    else if (moonState.mansion.intrinsicQuality === 'difficult') moonScore -= 20;
    
    if (moonState.waxing) moonScore += 10; // Waxing is generally favorable
    if (moonState.lunarDay >= 27) moonScore -= 20; // Dark moon penalty
    if (moonState.voidOfCourse) moonScore -= 40; // Severe penalty
    
    moonScore = Math.max(0, Math.min(100, moonScore));
    overallCosmicScore += moonScore * 0.25;
    
    // Prohibition severity contributes -15%
    let prohibitionPenalty = 0;
    prohibitions.forEach(p => {
      if (p.severity === 'absolute') prohibitionPenalty += 50;
      else if (p.severity === 'strong') prohibitionPenalty += 30;
      else if (p.severity === 'moderate') prohibitionPenalty += 15;
    });
    overallCosmicScore -= Math.min(prohibitionPenalty, 40); // Cap at -40
    
    overallCosmicScore = Math.round(Math.max(0, Math.min(100, overallCosmicScore)));
    
    // Determine cosmic state
    let ruling: CosmicState;
    const hasAbsoluteProhibition = prohibitions.some(p => p.severity === 'absolute');
    
    if (hasAbsoluteProhibition || overallCosmicScore < 25) {
      ruling = 'forbidden';
    } else if (overallCosmicScore >= 80) {
      ruling = 'baraka';
    } else if (overallCosmicScore >= 50) {
      ruling = 'neutral';
    } else {
      ruling = 'makruh';
    }
    
    // Generate reasoning
    const reasoning = {
      en: generateReasoning(hourRulerCondition, moonState, ruling, prohibitions, 'en'),
      ar: generateReasoning(hourRulerCondition, moonState, ruling, prohibitions, 'ar'),
      fr: generateReasoning(hourRulerCondition, moonState, ruling, prohibitions, 'fr'),
    };
    
    return {
      timestamp: moment,
      hourRuler: {
        planet: hourRuler,
        condition: hourRulerCondition,
        qualityScore: hourRulerCondition.overallQuality,
      },
      moonState,
      prohibitions,
      overallCosmicScore,
      ruling,
      reasoning,
    };
  } catch (error) {
    console.error('Error analyzing cosmic quality:', error);
    throw error;
  }
}

/**
 * Generate human-readable reasoning
 */
function generateReasoning(
  hourRuler: PlanetaryCondition,
  moonState: MoonState,
  ruling: CosmicState,
  prohibitions: Prohibition[],
  language: 'en' | 'ar' | 'fr'
): string {
  const parts: string[] = [];
  
  if (language === 'en') {
    // Opening assessment
    if (ruling === 'baraka') {
      parts.push('This moment carries genuine barakah (blessing).');
    } else if (ruling === 'neutral') {
      parts.push('This is an ordinary, permissible moment.');
    } else if (ruling === 'makruh') {
      parts.push('This moment is weak and disliked for important work.');
    } else {
      parts.push('⚠️ This moment has prohibitions - avoid major spiritual work.');
    }
    
    // Hour ruler details
    parts.push(hourRuler.summary.en);
    
    // Moon state
    const moonQuality = moonState.mansion.intrinsicQuality;
    const mansionDesc = moonQuality === 'blessed' ? 'auspicious' : 
                        moonQuality === 'difficult' ? 'challenging' : 'neutral';
    
    parts.push(`Moon is ${moonState.waxing ? 'waxing' : 'waning'} (day ${moonState.lunarDay}) in ${moonState.mansion.name}, a ${mansionDesc} mansion.`);
    
    // Prohibitions
    if (prohibitions.length > 0) {
      parts.push('⚠️ Prohibitions: ' + prohibitions.map(p => p.description.en).join(' '));
    }
  } else if (language === 'ar') {
    if (ruling === 'baraka') parts.push('هذا الوقت مبارك.');
    else if (ruling === 'neutral') parts.push('هذا وقت عادي ومباح.');
    else if (ruling === 'makruh') parts.push('هذا وقت ضعيف ومكروه للأعمال المهمة.');
    else parts.push('⚠️ هذا الوقت محظور - تجنب الأعمال الروحية الكبيرة.');
    
    parts.push(hourRuler.summary.ar);
    parts.push(`القمر ${moonState.waxing ? 'متزايد' : 'متناقص'} (يوم ${moonState.lunarDay}) في ${moonState.mansion.name}.`);
    
    if (prohibitions.length > 0) {
      parts.push('⚠️ محظورات: ' + prohibitions.map(p => p.description.ar).join(' '));
    }
  } else {
    if (ruling === 'baraka') parts.push('Ce moment porte une véritable baraka (bénédiction).');
    else if (ruling === 'neutral') parts.push('C\'est un moment ordinaire et permis.');
    else if (ruling === 'makruh') parts.push('Ce moment est faible et déconseillé pour un travail important.');
    else parts.push('⚠️ Ce moment a des interdictions - évitez le travail spirituel majeur.');
    
    parts.push(hourRuler.summary.fr);
    parts.push(`La Lune est ${moonState.waxing ? 'croissante' : 'décroissante'} (jour ${moonState.lunarDay}) dans ${moonState.mansion.name}.`);
    
    if (prohibitions.length > 0) {
      parts.push('⚠️ Interdictions: ' + prohibitions.map(p => p.description.fr).join(' '));
    }
  }
  
  return parts.join(' ');
}

/**
 * Quick check: Is the current moment cosmically favorable?
 */
export async function isCosmicMomentFavorable(
  moment: Date,
  location: { latitude: number; longitude: number }
): Promise<{ favorable: boolean; score: number; ruling: CosmicState }> {
  const cosmic = await analyzeCosmicQuality(moment, location);
  
  return {
    favorable: cosmic.ruling === 'baraka' || cosmic.ruling === 'neutral',
    score: cosmic.overallCosmicScore,
    ruling: cosmic.ruling,
  };
}
