/**
 * Asrariya Timing Engine - Analysis Layers
 * =========================================
 * Individual analysis functions for each layer of timing assessment
 * 
 * Layers:
 * 1. Element Compatibility - User element vs current moment elements
 * 2. Planetary Resonance - User's ruling planet vs day/hour planets
 * 3. Manazil Alignment - Personal manazil vs current lunar mansion
 * 4. Practice Mapping - Practice requirements vs timing signals
 * 
 * @module AsrariyaTimingEngine/layers
 */

import type { Planet } from '@/services/PlanetaryHoursService';
import {
    CurrentMoment,
    Element,
    ElementCompatibilityResult,
    ManazilAlignmentResult,
    PlanetaryResonanceResult,
    PracticeCategory,
    PracticeMappingResult,
    UserIntent,
    UserSpiritalProfile
} from './types';

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Element relationships for compatibility calculation
 */
const ELEMENT_RELATIONSHIPS: Record<Element, Record<Element, { type: 'same' | 'complementary' | 'neutral' | 'tension'; score: number }>> = {
  fire: {
    fire: { type: 'same', score: 100 },
    air: { type: 'complementary', score: 75 },
    earth: { type: 'neutral', score: 50 },
    water: { type: 'tension', score: 30 },
  },
  air: {
    fire: { type: 'complementary', score: 75 },
    air: { type: 'same', score: 100 },
    water: { type: 'neutral', score: 50 },
    earth: { type: 'tension', score: 30 },
  },
  water: {
    water: { type: 'same', score: 100 },
    earth: { type: 'complementary', score: 75 },
    fire: { type: 'tension', score: 30 },
    air: { type: 'neutral', score: 50 },
  },
  earth: {
    water: { type: 'complementary', score: 75 },
    earth: { type: 'same', score: 100 },
    air: { type: 'tension', score: 30 },
    fire: { type: 'neutral', score: 50 },
  },
};

/**
 * Planet to ruling zodiac signs (classical)
 */
const PLANET_ZODIAC_RULERSHIP: Record<Planet, number[]> = {
  Sun: [5],           // Leo
  Moon: [4],          // Cancer
  Mars: [1, 8],       // Aries, Scorpio
  Mercury: [3, 6],    // Gemini, Virgo
  Jupiter: [9, 12],   // Sagittarius, Pisces
  Venus: [2, 7],      // Taurus, Libra
  Saturn: [10, 11],   // Capricorn, Aquarius
};

/**
 * Planetary friendships (classical astrology)
 */
const PLANETARY_FRIENDSHIPS: Record<string, 'friend' | 'neutral' | 'enemy'> = {
  'sun-moon': 'friend',
  'sun-mars': 'friend',
  'sun-jupiter': 'friend',
  'sun-saturn': 'enemy',
  'sun-venus': 'neutral',
  'sun-mercury': 'neutral',
  'moon-sun': 'friend',
  'moon-mercury': 'friend',
  'moon-jupiter': 'friend',
  'moon-mars': 'neutral',
  'moon-venus': 'neutral',
  'moon-saturn': 'neutral',
  'mars-sun': 'friend',
  'mars-moon': 'friend',
  'mars-jupiter': 'friend',
  'mars-venus': 'neutral',
  'mars-saturn': 'neutral',
  'mars-mercury': 'enemy',
  'mercury-sun': 'friend',
  'mercury-venus': 'friend',
  'mercury-jupiter': 'neutral',
  'mercury-saturn': 'neutral',
  'mercury-mars': 'enemy',
  'mercury-moon': 'enemy',
  'jupiter-sun': 'friend',
  'jupiter-moon': 'friend',
  'jupiter-mars': 'friend',
  'jupiter-mercury': 'neutral',
  'jupiter-saturn': 'neutral',
  'jupiter-venus': 'enemy',
  'venus-mercury': 'friend',
  'venus-saturn': 'friend',
  'venus-mars': 'neutral',
  'venus-jupiter': 'enemy',
  'venus-sun': 'enemy',
  'venus-moon': 'neutral',
  'saturn-mercury': 'friend',
  'saturn-venus': 'friend',
  'saturn-jupiter': 'neutral',
  'saturn-mars': 'neutral',
  'saturn-sun': 'enemy',
  'saturn-moon': 'enemy',
};

/**
 * Practice categories and their preferred elements
 */
const PRACTICE_ELEMENT_PREFERENCES: Record<PracticeCategory, { preferred: Element[]; neutral: Element[]; avoid: Element[] }> = {
  protection: {
    preferred: ['fire', 'earth'],
    neutral: ['air'],
    avoid: ['water'], // Water is receptive, not protective
  },
  healing: {
    preferred: ['water', 'earth'],
    neutral: ['air'],
    avoid: ['fire'], // Fire can be too intense for healing
  },
  manifestation: {
    preferred: ['fire', 'air'],
    neutral: ['earth'],
    avoid: ['water'], // Water is passive
  },
  guidance: {
    preferred: ['air', 'water'],
    neutral: ['fire', 'earth'],
    avoid: [],
  },
  gratitude: {
    preferred: ['water', 'earth'],
    neutral: ['fire', 'air'],
    avoid: [],
  },
  repentance: {
    preferred: ['water', 'earth'],
    neutral: ['air'],
    avoid: ['fire'], // Humility over pride
  },
  knowledge: {
    preferred: ['air', 'fire'],
    neutral: ['water'],
    avoid: ['earth'], // Earth is slow for learning
  },
  provision: {
    preferred: ['earth', 'water'],
    neutral: ['air'],
    avoid: ['fire'], // Patience needed
  },
  relationship: {
    preferred: ['water', 'air'],
    neutral: ['earth'],
    avoid: ['fire'], // Fire can be too aggressive
  },
  general: {
    preferred: ['air', 'water'],
    neutral: ['fire', 'earth'],
    avoid: [],
  },
};

/**
 * Practice categories and their preferred planets
 */
const PRACTICE_PLANET_PREFERENCES: Record<PracticeCategory, Planet[]> = {
  protection: ['Mars', 'Saturn', 'Sun'],
  healing: ['Moon', 'Venus', 'Jupiter'],
  manifestation: ['Sun', 'Jupiter', 'Mars'],
  guidance: ['Mercury', 'Jupiter', 'Moon'],
  gratitude: ['Jupiter', 'Venus', 'Moon'],
  repentance: ['Saturn', 'Moon', 'Venus'],
  knowledge: ['Mercury', 'Jupiter', 'Sun'],
  provision: ['Jupiter', 'Venus', 'Moon'],
  relationship: ['Venus', 'Moon', 'Jupiter'],
  general: ['Jupiter', 'Moon', 'Sun'],
};

/**
 * Manazil themes and their favorable practices
 */
const MANAZIL_PRACTICE_COMPATIBILITY: Record<number, { favorable: PracticeCategory[]; cautious: PracticeCategory[] }> = {
  0: { favorable: ['manifestation', 'guidance'], cautious: ['relationship'] }, // Al-Sharatān
  1: { favorable: ['provision', 'guidance'], cautious: ['manifestation'] },    // Al-Buṭayn
  2: { favorable: ['knowledge', 'manifestation'], cautious: ['healing'] },     // Al-Thurayyā
  3: { favorable: ['healing', 'guidance'], cautious: ['protection'] },          // Al-Dabarān
  4: { favorable: ['protection', 'manifestation'], cautious: ['relationship'] }, // Al-Haqʿah
  5: { favorable: ['provision', 'healing'], cautious: ['manifestation'] },      // Al-Hanʿah
  6: { favorable: ['knowledge', 'guidance'], cautious: ['protection'] },        // Al-Dhirāʿ
  7: { favorable: ['healing', 'repentance'], cautious: ['manifestation'] },     // Al-Nathrah
  8: { favorable: ['protection', 'guidance'], cautious: ['healing'] },          // Al-Ṭarf
  9: { favorable: ['manifestation', 'provision'], cautious: ['repentance'] },   // Al-Jabhah
  10: { favorable: ['protection', 'knowledge'], cautious: ['relationship'] },   // Al-Zubrah
  11: { favorable: ['healing', 'guidance'], cautious: ['manifestation'] },      // Al-Ṣarfah (Changer)
  12: { favorable: ['protection', 'manifestation'], cautious: ['healing'] },    // Al-ʿAwwāʾ
  13: { favorable: ['provision', 'gratitude'], cautious: ['protection'] },      // Al-Simāk
  14: { favorable: ['repentance', 'healing'], cautious: ['manifestation'] },    // Al-Ghafr (Covering)
  15: { favorable: ['protection', 'guidance'], cautious: ['relationship'] },    // Al-Zubānā (Claws)
  16: { favorable: ['manifestation', 'protection'], cautious: ['healing'] },    // Al-Iklīl (Crown)
  17: { favorable: ['healing', 'guidance'], cautious: ['provision'] },          // Al-Qalb (Heart)
  18: { favorable: ['protection', 'manifestation'], cautious: ['relationship'] }, // Al-Shawlah
  19: { favorable: ['provision', 'healing'], cautious: ['protection'] },        // Al-Naʿāʾim
  20: { favorable: ['manifestation', 'knowledge'], cautious: ['healing'] },     // Al-Baldah
  21: { favorable: ['provision', 'gratitude'], cautious: ['manifestation'] },   // Saʿd al-Dhābiḥ
  22: { favorable: ['healing', 'repentance'], cautious: ['manifestation'] },    // Saʿd Bulaʿ
  23: { favorable: ['manifestation', 'provision', 'gratitude'], cautious: [] }, // Saʿd al-Suʿūd (BEST)
  24: { favorable: ['protection', 'provision'], cautious: ['healing'] },        // Saʿd al-Akhbiyah
  25: { favorable: ['provision', 'manifestation'], cautious: ['healing'] },     // Al-Fargh al-Muqaddam
  26: { favorable: ['healing', 'guidance'], cautious: ['protection'] },         // Al-Fargh al-Muʾakhkhar
  27: { favorable: ['repentance', 'healing', 'guidance'], cautious: ['manifestation'] }, // Baṭn al-Ḥūt
};

// ============================================================================
// LAYER 1: ELEMENT COMPATIBILITY
// ============================================================================

/**
 * Analyze element compatibility between user and current moment
 */
export function analyzeElementCompatibility(
  user: UserSpiritalProfile,
  moment: CurrentMoment,
  intent: UserIntent
): ElementCompatibilityResult {
  const userElement = user.element;
  const dayElement = moment.dayElement;
  const hourElement = moment.planetaryHourElement;
  
  // Get base relationship with day element
  const dayRelation = ELEMENT_RELATIONSHIPS[userElement][dayElement];
  
  // Get relationship with planetary hour element
  const hourRelation = ELEMENT_RELATIONSHIPS[userElement][hourElement];
  
  // Weighted combination (hour is more immediate)
  let baseScore = (dayRelation.score * 0.4) + (hourRelation.score * 0.6);
  
  // Modifiers based on zodiac rulership
  let modifierScore = 0;
  let modifierReason = '';
  
  // If user's ruling planet matches day ruler, boost score
  if (user.rulingPlanet && moment.dayRuler.toLowerCase() === user.rulingPlanet) {
    modifierScore += 15;
    modifierReason = 'Your ruling planet aligns with the day ruler. ';
  }
  
  // If user's burj element matches their name element (internal harmony)
  if (user.burjIndex) {
    const burjElement = getBurjElement(user.burjIndex);
    if (burjElement === userElement) {
      modifierScore += 10;
      modifierReason += 'Internal elemental harmony is strong. ';
    }
  }
  
  // Intent-based modifiers
  const practicePrefs = PRACTICE_ELEMENT_PREFERENCES[intent.category];
  if (practicePrefs?.preferred.includes(hourElement)) {
    modifierScore += 10;
    modifierReason += `Current hour element supports ${intent.category} practice. `;
  } else if (practicePrefs?.avoid.includes(hourElement)) {
    modifierScore -= 15;
    modifierReason += `Current hour element is challenging for ${intent.category}. `;
  }
  
  const finalScore = Math.min(100, Math.max(0, baseScore + modifierScore));
  
  // Determine primary relationship (use hour as it's more immediate)
  const primaryRelation = hourRelation.type;
  
  // Generate reasoning
  const reasoning = generateElementReasoning(
    userElement,
    dayElement,
    hourElement,
    primaryRelation,
    modifierReason
  );
  
  return {
    score: finalScore,
    reasoning,
    userElement,
    momentElement: hourElement,
    relationship: primaryRelation,
    factors: {
      dayElementScore: dayRelation.score,
      hourElementScore: hourRelation.score,
      modifierScore,
      userElement,
      dayElement,
      hourElement,
    },
  };
}

function getBurjElement(burjIndex: number): Element {
  // Burj index 1-12 mapped to elements
  const elementMap: Record<number, Element> = {
    1: 'fire',   // Aries
    2: 'earth',  // Taurus
    3: 'air',    // Gemini
    4: 'water',  // Cancer
    5: 'fire',   // Leo
    6: 'earth',  // Virgo
    7: 'air',    // Libra
    8: 'water',  // Scorpio
    9: 'fire',   // Sagittarius
    10: 'earth', // Capricorn
    11: 'air',   // Aquarius
    12: 'water', // Pisces
  };
  return elementMap[burjIndex] || 'fire';
}

function generateElementReasoning(
  userEl: Element,
  dayEl: Element,
  hourEl: Element,
  relationship: string,
  modifiers: string
): string {
  const capitalizedUser = userEl.charAt(0).toUpperCase() + userEl.slice(1);
  const capitalizedHour = hourEl.charAt(0).toUpperCase() + hourEl.slice(1);
  
  let base = '';
  switch (relationship) {
    case 'same':
      base = `Perfect elemental alignment! Your ${capitalizedUser} nature harmonizes beautifully with the current ${capitalizedHour} energy.`;
      break;
    case 'complementary':
      base = `Supportive elemental flow. Your ${capitalizedUser} element complements the current ${capitalizedHour} energy.`;
      break;
    case 'neutral':
      base = `Neutral elemental conditions. Your ${capitalizedUser} nature can work with the current ${capitalizedHour} energy with awareness.`;
      break;
    case 'tension':
      base = `Elemental tension present. Your ${capitalizedUser} nature meets opposing ${capitalizedHour} energy — proceed with balance.`;
      break;
  }
  
  return modifiers ? `${base} ${modifiers}` : base;
}

// ============================================================================
// LAYER 2: PLANETARY RESONANCE
// ============================================================================

/**
 * Analyze planetary resonance between user's chart and current timing
 */
export function analyzePlanetaryResonance(
  user: UserSpiritalProfile,
  moment: CurrentMoment,
  intent: UserIntent
): PlanetaryResonanceResult {
  const userPlanet = user.rulingPlanet || 'sun';
  const dayRuler = moment.dayRuler;
  const hourPlanet = moment.planetaryHourPlanet;
  
  // Check if user's ruling planet matches day ruler
  const dayRulerMatch = dayRuler.toLowerCase() === userPlanet;
  
  // Check if user's ruling planet matches planetary hour
  const planetaryHourMatch = hourPlanet.toLowerCase() === userPlanet;
  
  // Calculate day ruler score
  let dayRulerScore = 50; // Base neutral
  if (dayRulerMatch) {
    dayRulerScore = 100;
  } else {
    // Check friendship relationship
    const friendship = getPlanetaryFriendship(userPlanet, dayRuler.toLowerCase());
    switch (friendship) {
      case 'friend': dayRulerScore = 75; break;
      case 'neutral': dayRulerScore = 50; break;
      case 'enemy': dayRulerScore = 30; break;
    }
  }
  
  // Calculate planetary hour score (more important)
  let planetaryHourScore = 50;
  if (planetaryHourMatch) {
    planetaryHourScore = 100;
  } else {
    const friendship = getPlanetaryFriendship(userPlanet, hourPlanet.toLowerCase());
    switch (friendship) {
      case 'friend': planetaryHourScore = 75; break;
      case 'neutral': planetaryHourScore = 50; break;
      case 'enemy': planetaryHourScore = 25; break;
    }
  }
  
  // Practice-based modifiers
  let practiceModifier = 0;
  const preferredPlanets = PRACTICE_PLANET_PREFERENCES[intent.category];
  if (preferredPlanets && preferredPlanets.includes(hourPlanet)) {
    practiceModifier = 15;
  }
  if (preferredPlanets && preferredPlanets.includes(dayRuler)) {
    practiceModifier += 5;
  }
  
  // Weighted combination
  const baseScore = (dayRulerScore * 0.3) + (planetaryHourScore * 0.5) + practiceModifier;
  const finalScore = Math.min(100, Math.max(0, baseScore));
  
  // Generate reasoning
  const reasoning = generatePlanetaryReasoning(
    userPlanet,
    dayRuler,
    hourPlanet,
    dayRulerMatch,
    planetaryHourMatch,
    preferredPlanets.includes(hourPlanet)
  );
  
  return {
    score: finalScore,
    reasoning,
    dayRulerScore,
    planetaryHourScore,
    dayRulerMatch,
    planetaryHourMatch,
    factors: {
      userPlanet,
      dayRuler: dayRuler.toString(),
      hourPlanet: hourPlanet.toString(),
      practiceModifier,
    },
  };
}

function getPlanetaryFriendship(planet1: string, planet2: string): 'friend' | 'neutral' | 'enemy' {
  const key = `${planet1}-${planet2}`;
  return PLANETARY_FRIENDSHIPS[key] || 'neutral';
}

function generatePlanetaryReasoning(
  userPlanet: string,
  dayRuler: Planet,
  hourPlanet: Planet,
  dayMatch: boolean,
  hourMatch: boolean,
  practiceAligned: boolean
): string {
  const parts: string[] = [];
  
  if (hourMatch) {
    parts.push(`The current planetary hour (${hourPlanet}) perfectly matches your ruling planet — amplifying your spiritual strength.`);
  } else if (dayMatch) {
    parts.push(`Today's ruler (${dayRuler}) resonates with your planetary nature.`);
  } else {
    const friendship = getPlanetaryFriendship(userPlanet, hourPlanet.toLowerCase());
    if (friendship === 'friend') {
      parts.push(`${hourPlanet} hour is friendly to your ${userPlanet} nature.`);
    } else if (friendship === 'enemy') {
      parts.push(`${hourPlanet} hour creates tension with your ${userPlanet} nature — proceed with awareness.`);
    } else {
      parts.push(`${hourPlanet} hour has neutral relationship with your ${userPlanet} nature.`);
    }
  }
  
  if (practiceAligned) {
    parts.push('Current planetary hour is ideal for your chosen practice.');
  }
  
  return parts.join(' ');
}

// ============================================================================
// LAYER 3: MANAZIL ALIGNMENT
// ============================================================================

/**
 * Analyze alignment between personal manazil and current lunar mansion
 */
export function analyzeManazilAlignment(
  user: UserSpiritalProfile,
  moment: CurrentMoment,
  intent: UserIntent
): ManazilAlignmentResult {
  const personalManazil = user.personalManazil;
  const currentManazil = moment.currentManazil;
  const currentMansionData = moment.currentManazilData;
  
  let score = 50; // Base neutral
  let elementMatch = false;
  let themeCompatibility: 'favorable' | 'neutral' | 'cautious' = 'neutral';
  const reasons: string[] = [];
  
  // If we have the mansion data, check element match
  if (currentMansionData) {
    const userElement = user.element;
    const mansionElement = currentMansionData.element;
    
    elementMatch = userElement === mansionElement;
    
    if (elementMatch) {
      score += 20;
      reasons.push(`Current lunar mansion (${currentMansionData.nameTransliteration}) shares your ${userElement} element.`);
    } else {
      const relation = ELEMENT_RELATIONSHIPS[userElement][mansionElement];
      if (relation.type === 'complementary') {
        score += 10;
        reasons.push(`${currentMansionData.nameTransliteration} (${mansionElement}) complements your ${userElement} nature.`);
      } else if (relation.type === 'tension') {
        score -= 10;
        reasons.push(`${currentMansionData.nameTransliteration} (${mansionElement}) creates tension with your ${userElement} nature.`);
      }
    }
  }
  
  // Check practice compatibility with current manazil
  const manazilCompat = MANAZIL_PRACTICE_COMPATIBILITY[currentManazil];
  if (manazilCompat) {
    if (manazilCompat.favorable.includes(intent.category)) {
      themeCompatibility = 'favorable';
      score += 20;
      reasons.push(`This lunar mansion favors ${intent.category} practices.`);
    } else if (manazilCompat.cautious.includes(intent.category)) {
      themeCompatibility = 'cautious';
      score -= 15;
      reasons.push(`This lunar mansion suggests caution for ${intent.category} practices.`);
    }
  }
  
  // Special mansions check
  if (currentManazil === 23) { // Saʿd al-Suʿūd - The Luck of Lucks
    score += 15;
    reasons.push('Currently in Saʿd al-Suʿūd — the most auspicious lunar mansion for all spiritual work!');
  }
  
  // Personal mansion resonance (if available)
  if (personalManazil !== undefined) {
    if (personalManazil === currentManazil) {
      score += 25;
      reasons.push('The Moon is in YOUR personal lunar mansion — a powerful time for personal practice.');
    } else {
      // Check element match between personal and current manazil
      const personalMansionElement = getManazilElement(personalManazil);
      const currentMansionElement = getManazilElement(currentManazil);
      if (personalMansionElement === currentMansionElement) {
        score += 10;
        reasons.push('Personal and current lunar mansions share the same element.');
      }
    }
  }
  
  const finalScore = Math.min(100, Math.max(0, score));
  
  return {
    score: finalScore,
    reasoning: reasons.join(' ') || 'Lunar mansion conditions are neutral for your practice.',
    personalManazil,
    currentManazil,
    elementMatch,
    themeCompatibility,
    factors: {
      personalManazil: personalManazil ?? 'unknown',
      currentManazil,
      elementMatch,
      themeCompatibility,
    },
  };
}

function getManazilElement(manazilIndex: number): Element {
  // Element assignments for the 28 manazil (matching lunarMansions.ts)
  const elements: Element[] = [
    'fire', 'earth', 'air', 'water', 'fire', 'earth', 'air',  // 0-6
    'water', 'fire', 'earth', 'air', 'fire', 'fire', 'earth',  // 7-13
    'air', 'water', 'fire', 'earth', 'air', 'water', 'fire',   // 14-20
    'earth', 'air', 'water', 'fire', 'earth', 'air', 'water',  // 21-27
  ];
  return elements[manazilIndex % 28];
}

// ============================================================================
// LAYER 4: PRACTICE MAPPING
// ============================================================================

/**
 * Analyze practice-specific timing requirements
 */
export function analyzePracticeMapping(
  user: UserSpiritalProfile,
  moment: CurrentMoment,
  intent: UserIntent
): PracticeMappingResult {
  let score = 60; // Base for general practices
  const adjustments: string[] = [];
  const alternatives: string[] = [];
  const reasons: string[] = [];
  
  // Check element preferences for practice
  const elementPrefs = PRACTICE_ELEMENT_PREFERENCES[intent.category];
  const hourElement = moment.planetaryHourElement;
  
  if (elementPrefs.preferred.includes(hourElement)) {
    score += 20;
    reasons.push(`${hourElement.charAt(0).toUpperCase() + hourElement.slice(1)} hour element ideal for ${intent.category}.`);
  } else if (elementPrefs.avoid.includes(hourElement)) {
    score -= 20;
    reasons.push(`${hourElement.charAt(0).toUpperCase() + hourElement.slice(1)} hour element is challenging for ${intent.category}.`);
    
    // Suggest adjustment
    if (intent.category === 'protection' && hourElement === 'water') {
      adjustments.push('Add grounding practices (Ayat al-Kursi) to strengthen protection.');
    } else if (intent.category === 'healing' && hourElement === 'fire') {
      adjustments.push('Include cooling dhikr (Ya Latif, Ya Salam) to balance intensity.');
    }
  }
  
  // Check planetary hour preferences for practice
  const planetPrefs = PRACTICE_PLANET_PREFERENCES[intent.category];
  if (planetPrefs && planetPrefs.includes(moment.planetaryHourPlanet)) {
    score += 15;
    reasons.push(`${moment.planetaryHourPlanet} hour supports ${intent.category} work.`);
  }
  
  // Intensity adjustments
  if (intent.intensity === 'deep') {
    // Deep practice needs more favorable conditions
    if (score < 60) {
      adjustments.push('Consider lighter practice until more favorable timing.');
      alternatives.push('Istighfar', 'Short dhikr session');
    }
  }
  
  // Divine Name specific checks
  if (intent.divineName) {
    const nameAdjustment = checkDivineNameTiming(intent.divineName, moment);
    if (nameAdjustment.bonus) {
      score += nameAdjustment.bonus;
      reasons.push(nameAdjustment.reason);
    } else if (nameAdjustment.penalty) {
      score -= nameAdjustment.penalty;
      adjustments.push(nameAdjustment.reason);
    }
  }
  
  // Moon phase considerations for certain practices
  if (moment.moonPhase) {
    if (intent.category === 'manifestation' && moment.moonPhase.includes('waning')) {
      score -= 10;
      adjustments.push('Waning moon — focus on release rather than manifestation.');
    } else if (intent.category === 'repentance' && moment.moonPhase.includes('waning')) {
      score += 10;
      reasons.push('Waning moon supports letting go and purification.');
    }
  }
  
  const finalScore = Math.min(100, Math.max(0, score));
  const suitable = finalScore >= 50;
  
  return {
    score: finalScore,
    reasoning: reasons.join(' ') || 'Standard timing for this practice.',
    suitable,
    adjustments,
    alternatives: alternatives.length > 0 ? alternatives : undefined,
    factors: {
      baseScore: 60,
      elementAdjustment: elementPrefs.preferred.includes(hourElement) ? 20 : 
                         elementPrefs.avoid.includes(hourElement) ? -20 : 0,
      planetAdjustment: planetPrefs.includes(moment.planetaryHourPlanet) ? 15 : 0,
    },
  };
}

function checkDivineNameTiming(
  divineName: string,
  moment: CurrentMoment
): { bonus?: number; penalty?: number; reason: string } {
  // Map Divine Names to favorable planetary hours
  const nameHourMap: Record<string, { planets: Planet[]; element?: Element }> = {
    'Ya Qawiyy': { planets: ['Mars', 'Sun'], element: 'fire' },
    'Ya Latif': { planets: ['Venus', 'Moon'], element: 'water' },
    'Ya Razzaq': { planets: ['Jupiter', 'Venus'], element: 'earth' },
    'Ya Rahman': { planets: ['Jupiter', 'Moon'], element: 'water' },
    'Ya Hakim': { planets: ['Mercury', 'Jupiter'], element: 'air' },
    'Ya Salam': { planets: ['Moon', 'Venus'], element: 'water' },
    'Ya Hafiz': { planets: ['Saturn', 'Mars'], element: 'earth' },
    'Ya Nur': { planets: ['Sun', 'Jupiter'], element: 'fire' },
  };
  
  const nameInfo = nameHourMap[divineName];
  if (!nameInfo) {
    return { reason: '' };
  }
  
  if (nameInfo.planets.includes(moment.planetaryHourPlanet)) {
    return {
      bonus: 15,
      reason: `${divineName} resonates perfectly with current ${moment.planetaryHourPlanet} hour.`,
    };
  }
  
  if (nameInfo.element && nameInfo.element === moment.planetaryHourElement) {
    return {
      bonus: 10,
      reason: `${divineName}'s elemental quality aligns with current timing.`,
    };
  }
  
  return { reason: '' };
}
