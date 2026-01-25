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

const PRACTICE_CATEGORY_VALUES: PracticeCategory[] = [
  'protection',
  'healing',
  'manifestation',
  'guidance',
  'gratitude',
  'repentance',
  'knowledge',
  'provision',
  'relationship',
  'general',
];

function normalizePracticeCategory(category: unknown): PracticeCategory {
  if (typeof category !== 'string') {
    return 'general';
  }

  return (PRACTICE_CATEGORY_VALUES as readonly string[]).includes(category)
    ? (category as PracticeCategory)
    : 'general';
}

const ELEMENT_LABELS: Record<Element, { en: string; fr: string; ar: string }> = {
  fire: { en: 'Fire', fr: 'Feu', ar: 'نار' },
  water: { en: 'Water', fr: 'Eau', ar: 'ماء' },
  air: { en: 'Air', fr: 'Air', ar: 'هواء' },
  earth: { en: 'Earth', fr: 'Terre', ar: 'أرض' },
};

const PRACTICE_CATEGORY_LABELS: Record<PracticeCategory, { en: string; fr: string; ar: string }> = {
  protection: { en: 'protection', fr: 'protection', ar: 'الحماية' },
  healing: { en: 'healing', fr: 'guérison', ar: 'الشفاء' },
  manifestation: { en: 'manifestation', fr: 'manifestation', ar: 'التجلّي' },
  guidance: { en: 'guidance', fr: 'guidance', ar: 'الإرشاد' },
  gratitude: { en: 'gratitude', fr: 'gratitude', ar: 'الشكر' },
  repentance: { en: 'repentance', fr: 'repentir', ar: 'التوبة' },
  knowledge: { en: 'knowledge', fr: 'connaissance', ar: 'المعرفة' },
  provision: { en: 'provision', fr: 'subsistance', ar: 'الرزق' },
  relationship: { en: 'relationships', fr: 'relations', ar: 'العلاقات' },
  general: { en: 'general', fr: 'général', ar: 'عام' },
};

const PLANET_LABELS: Record<Planet, { en: string; fr: string; ar: string }> = {
  Sun: { en: 'Sun', fr: 'Soleil', ar: 'الشمس' },
  Moon: { en: 'Moon', fr: 'Lune', ar: 'القمر' },
  Mars: { en: 'Mars', fr: 'Mars', ar: 'المريخ' },
  Mercury: { en: 'Mercury', fr: 'Mercure', ar: 'عطارد' },
  Jupiter: { en: 'Jupiter', fr: 'Jupiter', ar: 'المشتري' },
  Venus: { en: 'Venus', fr: 'Vénus', ar: 'الزهرة' },
  Saturn: { en: 'Saturn', fr: 'Saturne', ar: 'زحل' },
};

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
  const category = normalizePracticeCategory(intent?.category);
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
  let modifierReasonFr = '';
  let modifierReasonAr = '';
  
  // If user's ruling planet matches day ruler, boost score
  if (user.rulingPlanet && moment.dayRuler.toLowerCase() === user.rulingPlanet) {
    modifierScore += 15;
    modifierReason = 'Your ruling planet aligns with the day ruler. ';
    modifierReasonFr = 'Votre planète dominante est alignée avec le maître du jour. ';
    modifierReasonAr = 'كوكبك الحاكم متوافق مع حاكم اليوم. ';
  }
  
  // If user's burj element matches their name element (internal harmony)
  if (user.burjIndex) {
    const burjElement = getBurjElement(user.burjIndex);
    if (burjElement === userElement) {
      modifierScore += 10;
      modifierReason += 'Internal elemental harmony is strong. ';
      modifierReasonFr += 'L’harmonie élémentaire intérieure est forte. ';
      modifierReasonAr += 'الانسجام العنصري الداخلي قوي. ';
    }
  }
  
  // Intent-based modifiers
  const practicePrefs = PRACTICE_ELEMENT_PREFERENCES[category];
  if (practicePrefs?.preferred.includes(hourElement)) {
    modifierScore += 10;
    modifierReason += `Current hour element supports ${category} practice. `;
    modifierReasonFr += `L’élément de l’heure actuelle soutient la pratique de ${PRACTICE_CATEGORY_LABELS[category].fr}. `;
    modifierReasonAr += `عنصر الساعة الحالية يدعم ممارسة ${PRACTICE_CATEGORY_LABELS[category].ar}. `;
  } else if (practicePrefs?.avoid.includes(hourElement)) {
    modifierScore -= 15;
    modifierReason += `Current hour element is challenging for ${category}. `;
    modifierReasonFr += `L’élément de l’heure actuelle est difficile pour ${PRACTICE_CATEGORY_LABELS[category].fr}. `;
    modifierReasonAr += `عنصر الساعة الحالية مُتعب/صعب لممارسة ${PRACTICE_CATEGORY_LABELS[category].ar}. `;
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

  const reasoningFr = generateElementReasoningFr(
    userElement,
    dayElement,
    hourElement,
    primaryRelation,
    modifierReasonFr
  );

  const reasoningAr = generateElementReasoningAr(
    userElement,
    dayElement,
    hourElement,
    primaryRelation,
    modifierReasonAr
  );
  
  return {
    score: finalScore,
    reasoning,
    reasoningFr,
    reasoningAr,
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

function generateElementReasoningFr(
  userEl: Element,
  dayEl: Element,
  hourEl: Element,
  relationship: string,
  modifiers: string
): string {
  const user = ELEMENT_LABELS[userEl].fr;
  const hour = ELEMENT_LABELS[hourEl].fr;

  let base = '';
  switch (relationship) {
    case 'same':
      base = `Alignement élémentaire parfait ! Votre nature ${user} s’harmonise avec l’énergie ${hour} actuelle.`;
      break;
    case 'complementary':
      base = `Flux élémentaire favorable. Votre élément ${user} complète l’énergie ${hour} actuelle.`;
      break;
    case 'neutral':
      base = `Conditions élémentaires neutres. Votre nature ${user} peut travailler avec l’énergie ${hour} actuelle avec conscience.`;
      break;
    case 'tension':
      base = `Tension élémentaire présente. Votre nature ${user} rencontre l’énergie ${hour} — avancez avec équilibre.`;
      break;
  }

  return modifiers ? `${base} ${modifiers}` : base;
}

function generateElementReasoningAr(
  userEl: Element,
  dayEl: Element,
  hourEl: Element,
  relationship: string,
  modifiers: string
): string {
  const user = ELEMENT_LABELS[userEl].ar;
  const hour = ELEMENT_LABELS[hourEl].ar;

  let base = '';
  switch (relationship) {
    case 'same':
      base = `تناغم عنصري كامل! طبيعتك (${user}) منسجمة مع طاقة (${hour}) الحالية.`;
      break;
    case 'complementary':
      base = `تدفق عنصري داعم. عنصر (${user}) يُكمل طاقة (${hour}) الحالية.`;
      break;
    case 'neutral':
      base = `ظروف عنصرية محايدة. يمكن لطبيعتك (${user}) أن تعمل مع طاقة (${hour}) الحالية مع الوعي.`;
      break;
    case 'tension':
      base = `هناك توتر عنصري. طبيعتك (${user}) تواجه طاقة (${hour}) — تابع بتوازن.`;
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
  const category = normalizePracticeCategory(intent?.category);
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
  const preferredPlanets = PRACTICE_PLANET_PREFERENCES[category] ?? PRACTICE_PLANET_PREFERENCES.general;
  const practiceAligned = preferredPlanets.includes(hourPlanet);

  if (practiceAligned) {
    practiceModifier = 15;
  }
  if (preferredPlanets.includes(dayRuler)) {
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
    practiceAligned
  );

  const reasoningFr = generatePlanetaryReasoningFr(
    userPlanet,
    dayRuler,
    hourPlanet,
    dayRulerMatch,
    planetaryHourMatch,
    practiceAligned
  );

  const reasoningAr = generatePlanetaryReasoningAr(
    userPlanet,
    dayRuler,
    hourPlanet,
    dayRulerMatch,
    planetaryHourMatch,
    practiceAligned
  );
  
  return {
    score: finalScore,
    reasoning,
    reasoningFr,
    reasoningAr,
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

function generatePlanetaryReasoningFr(
  userPlanet: string,
  dayRuler: Planet,
  hourPlanet: Planet,
  dayMatch: boolean,
  hourMatch: boolean,
  practiceAligned: boolean
): string {
  const parts: string[] = [];
  const userP = userPlanet.toLowerCase();

  if (hourMatch) {
    parts.push(`L’heure planétaire actuelle (${PLANET_LABELS[hourPlanet].fr}) correspond à votre planète dominante — cela amplifie votre force spirituelle.`);
  } else if (dayMatch) {
    parts.push(`Le maître du jour (${PLANET_LABELS[dayRuler].fr}) résonne avec votre nature planétaire.`);
  } else {
    const friendship = getPlanetaryFriendship(userP, hourPlanet.toLowerCase());
    if (friendship === 'friend') {
      parts.push(`L’heure de ${PLANET_LABELS[hourPlanet].fr} est favorable à votre nature ${userP}.`);
    } else if (friendship === 'enemy') {
      parts.push(`L’heure de ${PLANET_LABELS[hourPlanet].fr} crée une tension avec votre nature ${userP} — avancez avec conscience.`);
    } else {
      parts.push(`L’heure de ${PLANET_LABELS[hourPlanet].fr} a une relation neutre avec votre nature ${userP}.`);
    }
  }

  if (practiceAligned) {
    parts.push('L’heure planétaire actuelle est idéale pour votre pratique.');
  }

  return parts.join(' ');
}

function generatePlanetaryReasoningAr(
  userPlanet: string,
  dayRuler: Planet,
  hourPlanet: Planet,
  dayMatch: boolean,
  hourMatch: boolean,
  practiceAligned: boolean
): string {
  const parts: string[] = [];
  const userP = userPlanet.toLowerCase();

  if (hourMatch) {
    parts.push(`الساعة الكوكبية الحالية (${PLANET_LABELS[hourPlanet].ar}) تطابق كوكبك الحاكم — ما يعزز قوتك الروحية.`);
  } else if (dayMatch) {
    parts.push(`حاكم اليوم (${PLANET_LABELS[dayRuler].ar}) ينسجم مع طبيعتك الكوكبية.`);
  } else {
    const friendship = getPlanetaryFriendship(userP, hourPlanet.toLowerCase());
    if (friendship === 'friend') {
      parts.push(`ساعة ${PLANET_LABELS[hourPlanet].ar} داعمة لطبيعتك (${userP}).`);
    } else if (friendship === 'enemy') {
      parts.push(`ساعة ${PLANET_LABELS[hourPlanet].ar} تُحدث توترًا مع طبيعتك (${userP}) — تابع بوعي.`);
    } else {
      parts.push(`ساعة ${PLANET_LABELS[hourPlanet].ar} علاقتها محايدة مع طبيعتك (${userP}).`);
    }
  }

  if (practiceAligned) {
    parts.push('الساعة الكوكبية الحالية مناسبة لممارستك.');
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
  const category = normalizePracticeCategory(intent?.category);
  const personalManazil = user.personalManazil;
  const currentManazil = moment.currentManazil;
  const currentMansionData = moment.currentManazilData;
  
  let score = 50; // Base neutral
  let elementMatch = false;
  let themeCompatibility: 'favorable' | 'neutral' | 'cautious' = 'neutral';
  const reasons: string[] = [];
  const reasonsFr: string[] = [];
  const reasonsAr: string[] = [];
  
  // If we have the mansion data, check element match
  if (currentMansionData) {
    const userElement = user.element;
    const mansionElement = currentMansionData.element;
    
    elementMatch = userElement === mansionElement;
    
    if (elementMatch) {
      score += 20;
      reasons.push(`Current lunar mansion (${currentMansionData.nameTransliteration}) shares your ${userElement} element.`);
      reasonsFr.push(`Le manzil actuel (${currentMansionData.nameTransliteration}) partage votre élément ${ELEMENT_LABELS[userElement].fr}.`);
      reasonsAr.push(`المنزل القمري الحالي (${currentMansionData.nameTransliteration}) يشاركك عنصر ${ELEMENT_LABELS[userElement].ar}.`);
    } else {
      const relation = ELEMENT_RELATIONSHIPS[userElement][mansionElement];
      if (relation.type === 'complementary') {
        score += 10;
        reasons.push(`${currentMansionData.nameTransliteration} (${mansionElement}) complements your ${userElement} nature.`);
        reasonsFr.push(`${currentMansionData.nameTransliteration} (${ELEMENT_LABELS[mansionElement].fr}) complète votre nature ${ELEMENT_LABELS[userElement].fr}.`);
        reasonsAr.push(`${currentMansionData.nameTransliteration} (${ELEMENT_LABELS[mansionElement].ar}) يُكمل طبيعتك (${ELEMENT_LABELS[userElement].ar}).`);
      } else if (relation.type === 'tension') {
        score -= 10;
        reasons.push(`${currentMansionData.nameTransliteration} (${mansionElement}) creates tension with your ${userElement} nature.`);
        reasonsFr.push(`${currentMansionData.nameTransliteration} (${ELEMENT_LABELS[mansionElement].fr}) crée une tension avec votre nature ${ELEMENT_LABELS[userElement].fr}.`);
        reasonsAr.push(`${currentMansionData.nameTransliteration} (${ELEMENT_LABELS[mansionElement].ar}) يسبب توترًا مع طبيعتك (${ELEMENT_LABELS[userElement].ar}).`);
      }
    }
  }
  
  // Check practice compatibility with current manazil
  const manazilCompat = MANAZIL_PRACTICE_COMPATIBILITY[currentManazil];
  if (manazilCompat) {
    if (manazilCompat.favorable.includes(category)) {
      themeCompatibility = 'favorable';
      score += 20;
      reasons.push(`This lunar mansion favors ${category} practices.`);
      reasonsFr.push(`Ce manzil favorise les pratiques de ${PRACTICE_CATEGORY_LABELS[category].fr}.`);
      reasonsAr.push(`هذا المنزل القمري يُفضّل ممارسات ${PRACTICE_CATEGORY_LABELS[category].ar}.`);
    } else if (manazilCompat.cautious.includes(category)) {
      themeCompatibility = 'cautious';
      score -= 15;
      reasons.push(`This lunar mansion suggests caution for ${category} practices.`);
      reasonsFr.push(`Ce manzil suggère la prudence pour les pratiques de ${PRACTICE_CATEGORY_LABELS[category].fr}.`);
      reasonsAr.push(`هذا المنزل القمري يدعو للحذر في ممارسات ${PRACTICE_CATEGORY_LABELS[category].ar}.`);
    }
  }
  
  // Special mansions check
  if (currentManazil === 23) { // Saʿd al-Suʿūd - The Luck of Lucks
    score += 15;
    reasons.push('Currently in Saʿd al-Suʿūd — the most auspicious lunar mansion for all spiritual work!');
    reasonsFr.push('Vous êtes dans Saʿd al-Suʿūd — le manzil le plus auspice pour tout travail spirituel !');
    reasonsAr.push('أنت الآن في سعد السعود — أكثر المنازل القمرية بركةً لكل عمل روحي!');
  }
  
  // Personal mansion resonance (if available)
  if (personalManazil !== undefined) {
    if (personalManazil === currentManazil) {
      score += 25;
      reasons.push('The Moon is in YOUR personal lunar mansion — a powerful time for personal practice.');
      reasonsFr.push('La Lune est dans VOTRE manzil personnel — un moment puissant pour votre pratique.');
      reasonsAr.push('القمر في منزلك الشخصي — وقت قوي لممارسة شخصية.');
    } else {
      // Check element match between personal and current manazil
      const personalMansionElement = getManazilElement(personalManazil);
      const currentMansionElement = getManazilElement(currentManazil);
      if (personalMansionElement === currentMansionElement) {
        score += 10;
        reasons.push('Personal and current lunar mansions share the same element.');
        reasonsFr.push('Le manzil personnel et le manzil actuel partagent le même élément.');
        reasonsAr.push('منزلك الشخصي والمنزل الحالي يشتركان في نفس العنصر.');
      }
    }
  }
  
  const finalScore = Math.min(100, Math.max(0, score));

  const fallbackEn = 'Lunar mansion conditions are neutral for your practice.';
  const fallbackFr = 'Les conditions du manzil sont neutres pour votre pratique.';
  const fallbackAr = 'ظروف المنزل القمري محايدة لممارستك.';
  
  return {
    score: finalScore,
    reasoning: reasons.join(' ') || fallbackEn,
    reasoningFr: reasonsFr.join(' ') || fallbackFr,
    reasoningAr: reasonsAr.join(' ') || fallbackAr,
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
  const category = normalizePracticeCategory(intent?.category);
  let score = 60; // Base for general practices
  const adjustments: string[] = [];
  const alternatives: string[] = [];
  const reasons: string[] = [];
  const reasonsFr: string[] = [];
  const reasonsAr: string[] = [];
  
  // Check element preferences for practice
  const elementPrefs = PRACTICE_ELEMENT_PREFERENCES[category] ?? PRACTICE_ELEMENT_PREFERENCES.general;
  const hourElement = moment.planetaryHourElement;
  
  if (elementPrefs.preferred.includes(hourElement)) {
    score += 20;
    reasons.push(`${hourElement.charAt(0).toUpperCase() + hourElement.slice(1)} hour element ideal for ${category}.`);
    reasonsFr.push(`L’élément de l’heure (${ELEMENT_LABELS[hourElement].fr}) est idéal pour ${PRACTICE_CATEGORY_LABELS[category].fr}.`);
    reasonsAr.push(`عنصر الساعة (${ELEMENT_LABELS[hourElement].ar}) مثالي لممارسة ${PRACTICE_CATEGORY_LABELS[category].ar}.`);
  } else if (elementPrefs.avoid.includes(hourElement)) {
    score -= 20;
    reasons.push(`${hourElement.charAt(0).toUpperCase() + hourElement.slice(1)} hour element is challenging for ${category}.`);
    reasonsFr.push(`L’élément de l’heure (${ELEMENT_LABELS[hourElement].fr}) est difficile pour ${PRACTICE_CATEGORY_LABELS[category].fr}.`);
    reasonsAr.push(`عنصر الساعة (${ELEMENT_LABELS[hourElement].ar}) صعب لممارسة ${PRACTICE_CATEGORY_LABELS[category].ar}.`);
    
    // Suggest adjustment
    if (category === 'protection' && hourElement === 'water') {
      adjustments.push('Add grounding practices (Ayat al-Kursi) to strengthen protection.');
    } else if (category === 'healing' && hourElement === 'fire') {
      adjustments.push('Include cooling dhikr (Ya Latif, Ya Salam) to balance intensity.');
    }
  }
  
  // Check planetary hour preferences for practice
  const planetPrefs = PRACTICE_PLANET_PREFERENCES[category] ?? PRACTICE_PLANET_PREFERENCES.general;
  if (planetPrefs.includes(moment.planetaryHourPlanet)) {
    score += 15;
    reasons.push(`${moment.planetaryHourPlanet} hour supports ${category} work.`);
    reasonsFr.push(`L’heure de ${PLANET_LABELS[moment.planetaryHourPlanet].fr} soutient la pratique de ${PRACTICE_CATEGORY_LABELS[category].fr}.`);
    reasonsAr.push(`ساعة ${PLANET_LABELS[moment.planetaryHourPlanet].ar} تدعم ممارسة ${PRACTICE_CATEGORY_LABELS[category].ar}.`);
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
      if (nameAdjustment.reasonFr) reasonsFr.push(nameAdjustment.reasonFr);
      if (nameAdjustment.reasonAr) reasonsAr.push(nameAdjustment.reasonAr);
    } else if (nameAdjustment.penalty) {
      score -= nameAdjustment.penalty;
      adjustments.push(nameAdjustment.reason);
    }
  }
  
  // Moon phase considerations for certain practices
  if (moment.moonPhase) {
    if (category === 'manifestation' && moment.moonPhase.includes('waning')) {
      score -= 10;
      adjustments.push('Waning moon — focus on release rather than manifestation.');
    } else if (category === 'repentance' && moment.moonPhase.includes('waning')) {
      score += 10;
      reasons.push('Waning moon supports letting go and purification.');
      reasonsFr.push('La lune décroissante soutient le lâcher-prise et la purification.');
      reasonsAr.push('القمر المتناقص يدعم التخلّص والتنقية.');
    }
  }
  
  const finalScore = Math.min(100, Math.max(0, score));
  const suitable = finalScore >= 50;

  const fallbackEn = 'Standard timing for this practice.';
  const fallbackFr = 'Timing standard pour cette pratique.';
  const fallbackAr = 'توقيت اعتيادي لهذه الممارسة.';
  
  return {
    score: finalScore,
    reasoning: reasons.join(' ') || fallbackEn,
    reasoningFr: reasonsFr.join(' ') || fallbackFr,
    reasoningAr: reasonsAr.join(' ') || fallbackAr,
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
): { bonus?: number; penalty?: number; reason: string; reasonFr?: string; reasonAr?: string } {
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
      reasonFr: `${divineName} résonne parfaitement avec l’heure de ${PLANET_LABELS[moment.planetaryHourPlanet].fr}.`,
      reasonAr: `${divineName} ينسجم تمامًا مع ساعة ${PLANET_LABELS[moment.planetaryHourPlanet].ar} الحالية.`,
    };
  }
  
  if (nameInfo.element && nameInfo.element === moment.planetaryHourElement) {
    return {
      bonus: 10,
      reason: `${divineName}'s elemental quality aligns with current timing.`,
      reasonFr: `La qualité élémentaire de ${divineName} s’aligne avec le timing actuel.`,
      reasonAr: `الصفة العنصرية لـ ${divineName} متوافقة مع التوقيت الحالي.`,
    };
  }
  
  return { reason: '' };
}
