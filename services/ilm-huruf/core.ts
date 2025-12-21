/**
 * ʿIlm al-Ḥurūf (Science of Letters) - Core Calculations
 * Based on classical Islamic traditions and scholarly teachings
 */

import { digitalRoot, hadathRemainder } from '../../components/hadad-summary/hadad-core';
import { ABJAD_MAGHRIBI, validateAndWarnAboutHamza } from '../../contexts/AbjadContext';
import { computeQuranResonance } from './quranResonance';

// ============================================================================
// CLASSICAL LETTER SCIENCE - Core Methodology
// ============================================================================

/**
 * The Four Natures (Ṭabāʾiʿ) - Fundamental qualities of existence
 */
export type Nature = 'Hot' | 'Cold' | 'Wet' | 'Dry';

/**
 * Letter classification by nature (from Shams al-Maʿārif)
 * CORRECTED: Classical mappings per Islamic tradition
 */
export const LETTER_NATURES: Record<string, Nature[]> = {
  // Fire letters (Hot & Dry)
  'ا': ['Hot', 'Dry'],
  'ه': ['Hot', 'Dry'],
  'ط': ['Hot', 'Dry'],
  'م': ['Hot', 'Dry'],
  'ف': ['Hot', 'Dry'],
  'ص': ['Hot', 'Dry'],
  
  // Water letters (Cold & Wet)
  'ب': ['Cold', 'Wet'],
  'و': ['Cold', 'Wet'],
  'ي': ['Cold', 'Wet'],
  'ن': ['Cold', 'Wet'],
  'ق': ['Cold', 'Wet'],
  
  // Air letters (Hot & Wet)
  'ج': ['Hot', 'Wet'],
  'ز': ['Hot', 'Wet'],
  'ك': ['Hot', 'Wet'],
  'س': ['Hot', 'Wet'],
  'ش': ['Hot', 'Wet'],
  
  // Earth letters (Cold & Dry)
  'د': ['Cold', 'Dry'],
  'ل': ['Cold', 'Dry'],
  'ع': ['Cold', 'Dry'],
  'ر': ['Cold', 'Dry'],
  'ت': ['Cold', 'Dry'],
  'ث': ['Cold', 'Dry'],
  'خ': ['Cold', 'Dry'],
  'ذ': ['Cold', 'Dry'],
  'ض': ['Cold', 'Dry'],
  'ظ': ['Cold', 'Dry'],
  'غ': ['Cold', 'Dry'],
  'ح': ['Cold', 'Dry']  // CORRECTED: ح is Cold & Dry (Earth), not Hot & Wet (Air)
};

/**
 * Planetary rulership of letters (classical tradition)
 */
export type Planet = 'Sun' | 'Moon' | 'Mercury' | 'Venus' | 'Mars' | 'Jupiter' | 'Saturn';

export const LETTER_PLANETS: Record<string, Planet> = {
  // Sun (Leadership, Authority)
  'ا': 'Sun', 'ط': 'Sun', 'ظ': 'Sun', 'غ': 'Sun',
  
  // Moon (Emotion, Intuition)
  'ب': 'Moon', 'ي': 'Moon', 'ر': 'Moon',
  
  // Mercury (Communication, Learning)
  'ج': 'Mercury', 'ك': 'Mercury', 'س': 'Mercury',
  
  // Venus (Beauty, Harmony)
  'د': 'Venus', 'ل': 'Venus', 'ش': 'Venus',
  
  // Mars (Action, Energy)
  'ه': 'Mars', 'م': 'Mars', 'ت': 'Mars',
  
  // Jupiter (Expansion, Wisdom)
  'و': 'Jupiter', 'ن': 'Jupiter', 'ث': 'Jupiter',
  
  // Saturn (Structure, Discipline)
  'ز': 'Saturn', 'ع': 'Saturn', 'ف': 'Saturn', 'ص': 'Saturn', 'ق': 'Saturn', 'ض': 'Saturn', 'خ': 'Saturn', 'ذ': 'Saturn', 'ح': 'Saturn'
};

/**
 * Days of the week ruled by planets
 */
export const PLANET_DAYS: Record<Planet, string[]> = {
  'Sun': ['Sunday', 'الأحد'],
  'Moon': ['Monday', 'الاثنين'],
  'Mars': ['Tuesday', 'الثلاثاء'],
  'Mercury': ['Wednesday', 'الأربعاء'],
  'Jupiter': ['Thursday', 'الخميس'],
  'Venus': ['Friday', 'الجمعة'],
  'Saturn': ['Saturday', 'السبت']
};

/**
 * Planetary hours (each day has 12 daylight and 12 night hours)
 * The first hour of each day is ruled by the day's planet
 */
export const PLANETARY_HOURS_ORDER: Planet[] = [
  'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon'
];

// ============================================================================
// HELPER FUNCTIONS FOR NAME DESTINY MODULE
// ============================================================================

/**
 * modIndex: Maps modulo result where 0 → base (for Ṭabʿ ÷ 4 and Burj ÷ 12)
 * Examples: (8 % 4) = 0 → 4 (Water); (12 % 12) = 0 → 12 (Pisces)
 * MAGHRIBI SYSTEM: 1=Fire, 2=Earth, 3=Air, 4=Water
 */
export function modIndex(n: number, base: 4 | 12): number {
  const remainder = n % base;
  return remainder === 0 ? base : remainder;
}

/**
 * Calculate Abjad value of a text string
 * Used for Istikhara and other calculations requiring simple name totals
 * 
 * @param text - Text to calculate (Arabic or Latin)
 * @param abjad - Abjad system to use (defaults to Maghribi)
 * @returns Total Abjad value
 */
export function calculateAbjadValue(
  text: string,
  abjad: Record<string, number> = ABJAD_MAGHRIBI
): number {
  if (!text || text.trim().length === 0) {
    return 0;
  }
  
  // Remove diacritics and normalize whitespace
  const normalized = text.replace(/[ًٌٍَُِّْ]/g, '').replace(/\s+/g, '');
  const letters = [...normalized];
  
  return letters.reduce((sum, ch) => sum + (abjad[ch] || 0), 0);
}

// ============================================================================
// ELEMENTAL DATA (Ṭabʿ) - MAGHRIBI MAPPING: 1=Fire, 2=Earth, 3=Air, 4=Water
// IMPORTANT: mod 4 → 0 ⇒ 4 (Water) per classical Maghribi tradition
// ============================================================================

export type ElementKey = 1 | 2 | 3 | 4;

export interface ElementData {
  index: ElementKey;
  en: string;
  fr: string;
  ar: string;
  icon: string;
  qualityEn: string;
  qualityFr: string;
}

export const ELEMENTS: Record<ElementKey, ElementData> = {
  1: {
    index: 1,
    en: 'Fire',
    fr: 'Feu',
    ar: 'نار',
    icon: '🔥',
    qualityEn: 'Hot & Dry',
    qualityFr: 'Chaud & sec',
  },
  2: {
    index: 2,
    en: 'Earth',
    fr: 'Terre',
    ar: 'تراب',
    icon: '🌍',
    qualityEn: 'Cold & Dry',
    qualityFr: 'Froid & sec',
  },
  3: {
    index: 3,
    en: 'Air',
    fr: 'Air',
    ar: 'هواء',
    icon: '🌬️',
    qualityEn: 'Hot & Moist',
    qualityFr: 'Chaud & humide',
  },
  4: {
    index: 4,
    en: 'Water',
    fr: 'Eau',
    ar: 'ماء',
    icon: '💧',
    qualityEn: 'Cold & Moist',
    qualityFr: 'Froid & humide',
  },
};

// ============================================================================
// ZODIAC DATA (Burūj al-Falakīya) - 12 Signs
// ============================================================================

export interface BurjData {
  index: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  en: string;
  fr: string;
  ar: string;
  symbol: string;
  planet: Planet;
  dayEn: string;
  dayFr: string;
  dayAr: string;
  qualityEn: string;
  qualityFr: string;
}

export const BURUJ: Record<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12, BurjData> = {
  1: {
    index: 1,
    en: 'Aries',
    fr: 'Bélier',
    ar: 'الحمل',
    symbol: '♈',
    planet: 'Mars',
    dayEn: 'Tuesday',
    dayFr: 'Mardi',
    dayAr: 'الثلاثاء',
    qualityEn: 'Initiative & Courage',
    qualityFr: 'Initiative & courage',
  },
  2: {
    index: 2,
    en: 'Taurus',
    fr: 'Taureau',
    ar: 'الثور',
    symbol: '♉',
    planet: 'Venus',
    dayEn: 'Friday',
    dayFr: 'Vendredi',
    dayAr: 'الجمعة',
    qualityEn: 'Stability & Beauty',
    qualityFr: 'Stabilité & beauté',
  },
  3: {
    index: 3,
    en: 'Gemini',
    fr: 'Gémeaux',
    ar: 'الجوزاء',
    symbol: '♊',
    planet: 'Mercury',
    dayEn: 'Wednesday',
    dayFr: 'Mercredi',
    dayAr: 'الأربعاء',
    qualityEn: 'Communication & Adaptability',
    qualityFr: 'Communication & adaptabilité',
  },
  4: {
    index: 4,
    en: 'Cancer',
    fr: 'Cancer',
    ar: 'السرطان',
    symbol: '♋',
    planet: 'Moon',
    dayEn: 'Monday',
    dayFr: 'Lundi',
    dayAr: 'الاثنين',
    qualityEn: 'Nurturing & Intuition',
    qualityFr: 'Soin & intuition',
  },
  5: {
    index: 5,
    en: 'Leo',
    fr: 'Lion',
    ar: 'الأسد',
    symbol: '♌',
    planet: 'Sun',
    dayEn: 'Sunday',
    dayFr: 'Dimanche',
    dayAr: 'الأحد',
    qualityEn: 'Leadership & Creativity',
    qualityFr: 'Leadership & créativité',
  },
  6: {
    index: 6,
    en: 'Virgo',
    fr: 'Vierge',
    ar: 'العذراء',
    symbol: '♍',
    planet: 'Mercury',
    dayEn: 'Wednesday',
    dayFr: 'Mercredi',
    dayAr: 'الأربعاء',
    qualityEn: 'Service & Precision',
    qualityFr: 'Service & précision',
  },
  7: {
    index: 7,
    en: 'Libra',
    fr: 'Balance',
    ar: 'الميزان',
    symbol: '♎',
    planet: 'Venus',
    dayEn: 'Friday',
    dayFr: 'Vendredi',
    dayAr: 'الجمعة',
    qualityEn: 'Harmony & Justice',
    qualityFr: 'Harmonie & justice',
  },
  8: {
    index: 8,
    en: 'Scorpio',
    fr: 'Scorpion',
    ar: 'العقرب',
    symbol: '♏',
    planet: 'Mars',
    dayEn: 'Tuesday',
    dayFr: 'Mardi',
    dayAr: 'الثلاثاء',
    qualityEn: 'Transformation & Depth',
    qualityFr: 'Transformation & profondeur',
  },
  9: {
    index: 9,
    en: 'Sagittarius',
    fr: 'Sagittaire',
    ar: 'القوس',
    symbol: '♐',
    planet: 'Jupiter',
    dayEn: 'Thursday',
    dayFr: 'Jeudi',
    dayAr: 'الخميس',
    qualityEn: 'Wisdom & Expansion',
    qualityFr: 'Sagesse & expansion',
  },
  10: {
    index: 10,
    en: 'Capricorn',
    fr: 'Capricorne',
    ar: 'الجدي',
    symbol: '♑',
    planet: 'Saturn',
    dayEn: 'Saturday',
    dayFr: 'Samedi',
    dayAr: 'السبت',
    qualityEn: 'Discipline & Achievement',
    qualityFr: 'Discipline & accomplissement',
  },
  11: {
    index: 11,
    en: 'Aquarius',
    fr: 'Verseau',
    ar: 'الدلو',
    symbol: '♒',
    planet: 'Saturn',
    dayEn: 'Saturday',
    dayFr: 'Samedi',
    dayAr: 'السبت',
    qualityEn: 'Innovation & Humanitarianism',
    qualityFr: 'Innovation & humanitarisme',
  },
  12: {
    index: 12,
    en: 'Pisces',
    fr: 'Poissons',
    ar: 'الحوت',
    symbol: '♓',
    planet: 'Jupiter',
    dayEn: 'Thursday',
    dayFr: 'Jeudi',
    dayAr: 'الخميس',
    qualityEn: 'Compassion & Spirituality',
    qualityFr: 'Compassion & spiritualité',
  },
};

/**
 * Planetary Hours - ordered list for finding hour index
 */
export const PLANETARY_HOURS: Planet[] = [
  'Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars'
];

/**
 * Zodiacal classification of letters (12 signs)
 */
export type ZodiacSign = 
  | 'Aries' | 'Taurus' | 'Gemini' | 'Cancer' 
  | 'Leo' | 'Virgo' | 'Libra' | 'Scorpio' 
  | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';

/**
 * The spiritual stations (Maqāmāt) associated with numbers 1-9
 */
export const SPIRITUAL_STATIONS = {
  1: {
    name: 'Tawḥīd',
    arabic: 'التوحيد',
    meaning: 'Divine Unity',
    quality: 'Leadership, Independence, Originality',
    shadow: 'Pride, Isolation, Rigidity',
    practice: 'Meditate on divine oneness. Reflect: "All power belongs to the One."',
    verse: 'Say: He is Allah, the One (112:1)',
    practical: 'Start new projects, take initiative, practice self-reliance. Best for solo work.'
  },
  2: {
    name: 'Muʿāwana',
    arabic: 'المعاونة',
    meaning: 'Divine Assistance',
    quality: 'Cooperation, Balance, Diplomacy',
    shadow: 'Indecision, Dependency, Conflict-avoidance',
    practice: 'Seek harmony in relationships. Reflect: "Two are better than one."',
    verse: 'Help one another in righteousness (5:2)',
    practical: 'Build partnerships, mediate conflicts, create balance. Good for teamwork.'
  },
  3: {
    name: 'Ibdāʿ',
    arabic: 'الإبداع',
    meaning: 'Creative Expression',
    quality: 'Creativity, Communication, Joy',
    shadow: 'Scattered energy, Superficiality, Gossip',
    practice: 'Express divine inspiration. Reflect: "Beauty manifests through me."',
    verse: 'Read in the name of your Lord who created (96:1)',
    practical: 'Create art, write, speak publicly, teach. Channel creative energy.'
  },
  4: {
    name: 'Istiqrār',
    arabic: 'الاستقرار',
    meaning: 'Stability',
    quality: 'Foundation, Order, Discipline',
    shadow: 'Rigidity, Limitation, Stubbornness',
    practice: 'Build strong foundations. Reflect: "Patience is the key to paradise."',
    verse: 'Allah loves those who are firm and steadfast (61:4)',
    practical: 'Organize, plan, build systems, establish routines. Create structure.'
  },
  5: {
    name: 'Taḥawwul',
    arabic: 'التحول',
    meaning: 'Transformation',
    quality: 'Freedom, Adventure, Change',
    shadow: 'Restlessness, Irresponsibility, Addiction',
    practice: 'Embrace sacred change. Reflect: "Everything changes except the Face of God."',
    verse: 'Allah will not change the condition of a people until they change themselves (13:11)',
    practical: 'Travel, learn new skills, adapt to change. Seek variety and experience.'
  },
  6: {
    name: 'Khidma',
    arabic: 'الخدمة',
    meaning: 'Service',
    quality: 'Responsibility, Nurturing, Harmony',
    shadow: 'Martyrdom, Interference, Perfectionism',
    practice: 'Serve with love. Reflect: "The best of people are those who benefit others."',
    verse: 'The best among you are those who feed others (Ahmad)',
    practical: 'Help family, heal others, create beauty. Focus on home and community.'
  },
  7: {
    name: 'Ḥikma',
    arabic: 'الحكمة',
    meaning: 'Divine Wisdom',
    quality: 'Analysis, Introspection, Spirituality',
    shadow: 'Isolation, Cynicism, Overthinking',
    practice: 'Seek inner knowledge. Reflect: "Know thyself to know thy Lord."',
    verse: 'He gives wisdom to whom He wills (2:269)',
    practical: 'Study, research, meditate, retreat. Deepen spiritual practice.'
  },
  8: {
    name: 'Qudra',
    arabic: 'القدرة',
    meaning: 'Divine Power',
    quality: 'Abundance, Authority, Achievement',
    shadow: 'Greed, Domination, Materialism',
    practice: 'Steward divine abundance. Reflect: "I am a channel for divine provision."',
    verse: 'Whatever you spend, He will replace it (34:39)',
    practical: 'Manage resources, lead organizations, create wealth. Build influence.'
  },
  9: {
    name: 'Kamāl',
    arabic: 'الكمال',
    meaning: 'Completion',
    quality: 'Compassion, Wisdom, Universal Love',
    shadow: 'Martyrdom, Emotional manipulation, Escapism',
    practice: 'Serve humanity. Reflect: "I release with love and trust."',
    verse: 'This day I have perfected your religion for you (5:3)',
    practical: 'Complete projects, forgive, let go. Teach and mentor others.'
  }
};

/**
 * Life path guidance based on birth date calculation
 */
export function calculateLifePath(birthDate: Date): {
  number: number;
  station: typeof SPIRITUAL_STATIONS[keyof typeof SPIRITUAL_STATIONS];
  interpretation: string;
} {
  const day = birthDate.getDate();
  const month = birthDate.getMonth() + 1;
  const year = birthDate.getFullYear();
  
  const sum = day + month + year;
  let lifePath = digitalRoot(sum);
  
  // Ensure lifePath is between 1-9
  if (lifePath < 1 || lifePath > 9) {
    lifePath = ((lifePath - 1) % 9) + 1;
  }
  
  const station = SPIRITUAL_STATIONS[lifePath as keyof typeof SPIRITUAL_STATIONS];
  
  return {
    number: lifePath,
    station: station,
    interpretation: `Your soul's journey is through the station of ${station?.name || 'Unknown'}`
  };
}

/**
 * Name destiny - What your name reveals about your life purpose
 */
export function analyzeNameDestiny(name: string, abjad: Record<string, number> = ABJAD_MAGHRIBI) {
  // Check for hamza and warn if present
  validateAndWarnAboutHamza(name);
  
  const normalized = name.replace(/[ًٌٍَُِّْ]/g, '').replace(/\s+/g, '');
  const letters = [...normalized];
  
  // Safety check - ensure we have valid input
  if (letters.length === 0) {
    throw new Error('Name cannot be empty');
  }
  
  // Kabīr (sum of all letters)
  const kabir = letters.reduce((sum, ch) => sum + (abjad[ch] || 0), 0);
  
  // Ṣaghīr (digital root)
  const saghir = digitalRoot(kabir);
  
  // Ḥadath (remainder ÷ 12)
  const hadath = hadathRemainder(kabir);
  
  // Soul urge (vowels only)
  const vowels = letters.filter(ch => 'اوي'.includes(ch));
  const soulUrge = digitalRoot(vowels.reduce((sum, ch) => sum + (abjad[ch] || 0), 0));
  
  // Personality (consonants only)
  const consonants = letters.filter(ch => !'اوي'.includes(ch));
  const personality = digitalRoot(consonants.reduce((sum, ch) => sum + (abjad[ch] || 0), 0));
  
  // Ensure values are within valid range (1-9)
  const validSaghir = saghir || 9;
  const validSoulUrge = soulUrge || 9;
  const validPersonality = personality || 9;
  
  // Compute Qur'anic Resonance from Kabīr (Hadad)
  const quranResonance = computeQuranResonance(kabir);
  console.log('✨ analyzeNameDestiny - Kabir:', kabir, 'QuranResonance:', quranResonance);
  
  // Analyze letter geometry
  const geometry = analyzeGeometry(name);
  
  return {
    kabir,
    saghir: validSaghir,
    hadath,
    soulUrgeNumber: validSoulUrge,
    personalityNumber: validPersonality,
    destiny: SPIRITUAL_STATIONS[validSaghir as keyof typeof SPIRITUAL_STATIONS],
    soulUrge: SPIRITUAL_STATIONS[validSoulUrge as keyof typeof SPIRITUAL_STATIONS],
    personality: SPIRITUAL_STATIONS[validPersonality as keyof typeof SPIRITUAL_STATIONS],
    interpretation: generateDestinyInterpretation(validSaghir, validSoulUrge, validPersonality),
    quranResonance,
    geometry
  };
}

function generateDestinyInterpretation(destiny: number, soul: number, personality: number): string {
  const d = SPIRITUAL_STATIONS[destiny as keyof typeof SPIRITUAL_STATIONS];
  const s = SPIRITUAL_STATIONS[soul as keyof typeof SPIRITUAL_STATIONS];
  const p = SPIRITUAL_STATIONS[personality as keyof typeof SPIRITUAL_STATIONS];
  
  return `Your life destiny (${d.name}) calls you to ${d.quality.toLowerCase()}. ` +
    `Your soul deeply yearns for ${s.quality.toLowerCase()}, ` +
    `while outwardly you express ${p.quality.toLowerCase()}. ` +
    `Integration comes when you align all three dimensions.`;
}

// ============================================================================
// MOTHER'S NAME ANALYSIS - Um Ḥadad (Spiritual Origin)
// ============================================================================

/**
 * Mother's Name Analysis Result
 * Reveals the Aṣl al-Rūḥānī (Spiritual Origin) - the inherited elemental foundation
 */
export interface MotherAnalysis {
  name: string;
  element: ElementType;
  elementArabic: string;
  kabir: number;
  saghir: number;
  hadath: number;
}

/**
 * Element compatibility relations for inheritance analysis
 */
type ElementRelation = 'same' | 'compatible' | 'opposing' | 'neutral';

const ELEMENT_RELATIONS: Record<ElementType, Record<ElementType, ElementRelation>> = {
  Fire: {
    Fire: 'same',
    Air: 'compatible',   // Air feeds Fire
    Water: 'opposing',   // Water extinguishes Fire
    Earth: 'neutral'
  },
  Water: {
    Water: 'same',
    Earth: 'compatible', // Water nourishes Earth
    Fire: 'opposing',    // Fire evaporates Water
    Air: 'neutral'
  },
  Air: {
    Air: 'same',
    Fire: 'compatible',  // Air feeds Fire
    Earth: 'opposing',   // Earth grounds Air
    Water: 'neutral'
  },
  Earth: {
    Earth: 'same',
    Water: 'compatible', // Earth contains Water
    Air: 'opposing',     // Air disperses Earth
    Fire: 'neutral'
  }
};

/**
 * Get Arabic name for element
 */
function getElementArabic(element: ElementType): string {
  const arabicNames: Record<ElementType, string> = {
    Fire: 'نار',
    Water: 'ماء',
    Air: 'هواء',
    Earth: 'تراب'
  };
  return arabicNames[element];
}

/**
 * Analyze mother's name to reveal spiritual origin (Um Ḥadad)
 * Uses same Ḥadad calculation as main name analysis
 */
export function analyzeMotherName(arabicName: string, abjad: Record<string, number> = ABJAD_MAGHRIBI): MotherAnalysis {
  const normalized = arabicName.replace(/[ًٌٍَُِّْ]/g, '').replace(/\s+/g, '');
  const letters = [...normalized];
  
  if (letters.length === 0) {
    throw new Error('Mother\'s name cannot be empty');
  }
  
  // Calculate Kabīr (sum of all letters)
  const kabir = letters.reduce((sum, ch) => sum + (abjad[ch] || 0), 0);
  
  // Calculate Ṣaghīr (digital root)
  const saghir = digitalRoot(kabir);
  
  // Calculate Ḥadath (remainder ÷ 12) to determine element
  const hadath = hadathRemainder(kabir);
  
  // Determine element from Ḥadath
  const element = hadathToElement(hadath);
  
  return {
    name: arabicName,
    element,
    elementArabic: getElementArabic(element),
    kabir,
    saghir,
    hadath
  };
}

// ============================================================================
// NAME DESTINY MODULE - Mother's Name Integration + Burj Calculation
// ============================================================================

/**
 * Result interface for buildDestiny function (unified Name Chart calculation)
 */
export interface NameDestinyResult {
  arabicName?: string;    // The Arabic name for element chart calculation
  personKabir: number;    // Person's Ḥadad alone
  motherKabir: number;    // Mother's Ḥadad alone (0 if not provided)
  totalKabir: number;     // Combined total (person + mother)
  saghir: number;         // Digital root (1-9)
  tabhIdx: ElementKey;    // Element index (1-4, where 4=Earth)
  element: ElementData;   // Ṭabʿ (Element from ÷ 4, remainder 0→4)
  burjIdx: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  burj: BurjData;         // Burj (Zodiac from ÷ 12, remainder 0→12)
  hourIndex: number;      // Planetary hour # (1-7)
  expression: ElementData;     // Element from person's name alone
  foundation?: ElementData;    // Element from mother's name (if provided)
  // Higher Resonance Insights
  divineNameResonance?: import('./divineNames').DivineName;
  colorResonance?: import('./colorResonance').ColorResonanceResult;
  elementDistribution?: Record<'fire' | 'air' | 'water' | 'earth', number>;
  // Pattern Recognition
  patternAnalysis?: import('./patternRecognition').PatternAnalysis;
  multiPatternAnalysis?: {
    individual: Record<string, import('./patternRecognition').PatternAnalysis>;
    relationships: string[];
    relationshipsFr: string[];
  };
  // Wafq (Magic Squares)
  wafqAnalysis?: import('./wafqGenerator').WafqAnalysis;
  // Talisman Timing
  talismanTiming?: import('./talismanTiming').TalismanTimingAnalysis;
}

/**
 * Calculate Abjad totals with mother's name
 * Mother's name is ALWAYS included in calculation (even if empty → 0)
 */
function abjadTotalWithMother(
  personName: string,
  motherName: string | undefined,
  abjad: Record<string, number> = ABJAD_MAGHRIBI
): { p: number; m: number; total: number } {
  const normalized = personName.replace(/[ًٌٍَُِّْ]/g, '').replace(/\s+/g, '');
  const letters = [...normalized];
  const p = letters.reduce((sum, ch) => sum + (abjad[ch] || 0), 0);
  
  let m = 0;
  if (motherName && motherName.trim() !== '') {
    const normalizedMother = motherName.replace(/[ًٌٍَُِّْ]/g, '').replace(/\s+/g, '');
    const motherLetters = [...normalizedMother];
    m = motherLetters.reduce((sum, ch) => sum + (abjad[ch] || 0), 0);
  }
  
  return { p, m, total: p + m };
}

/**
 * Build complete Name Chart (unified calculation for Name Destiny)
 * Implements: Ṭabʿ (÷4, 0→4=Earth) + Burj (÷12, 0→12=Pisces) + Planet/Day/Hour
 * 
 * ✅ AUTHENTIC TRADITION: 
 * - Core identity (element, burj, divine name, saghir) uses PERSONAL NAME ONLY
 * - Mother's name shows INHERITED CONDITIONS (expression vs foundation)
 * 
 * Personal Name = WHO you are (internal identity)
 * Mother's Name = WHAT surrounds you (external influences)
 */
export function buildDestiny(
  personName: string,
  motherName?: string,
  abjad: Record<string, number> = ABJAD_MAGHRIBI
): NameDestinyResult {
  // Calculate totals
  const { p: personKabir, m: motherKabir, total: totalKabir } = abjadTotalWithMother(personName, motherName, abjad);
  
  // ✅ CORE IDENTITY - Uses TOTAL (person + mother) for complete reading
  // Digital root (Ṣaghīr) - calculated from total for complete essence
  const saghir = digitalRoot(totalKabir);
  
  // Ṭabʿ (Element) = totalKabir ÷ 4, remainder 0 → 4 (Water)
  const tabhIdx = modIndex(totalKabir, 4) as ElementKey;
  const element = ELEMENTS[tabhIdx];
  
  // Burj (Zodiac) = totalKabir ÷ 12, remainder 0 → 12 (Pisces)
  const burjIdx = modIndex(totalKabir, 12) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  const burj = BURUJ[burjIdx];
  
  // Planetary Hour # (1-7 based on burj's planet)
  const hourIndex = PLANETARY_HOURS.findIndex(p => p === burj.planet) + 1;
  
  // ✅ INHERITED INFLUENCES (when mother's name provided)
  // Expression = person's element (from personal name only)
  const expression = ELEMENTS[modIndex(personKabir, 4) as ElementKey];
  
  // Foundation = mother's element (from mother's name only)
  const foundation = (motherName && motherName.trim() !== '') 
    ? ELEMENTS[modIndex(motherKabir, 4) as ElementKey]
    : undefined;
  
  // Calculate element distribution for color resonance (from person's name letters)
  const elementDistribution = calculateElementDistributionFromName(personName);
  
  // Calculate Divine Name Resonance (uses PERSONAL NAME ONLY - authentic tradition)
  let divineNameResonance;
  try {
    const { calculateDivineNameResonance } = require('./divineNames');
    divineNameResonance = calculateDivineNameResonance(personKabir); // ✅ Changed from totalKabir
  } catch (e) {
    // Divine names module not available yet
    divineNameResonance = undefined;
  }
  
  // Calculate Color Resonance based on element distribution (from person's letters)
  let colorResonance;
  try {
    const { calculateColorResonance } = require('./colorResonance');
    colorResonance = calculateColorResonance(elementDistribution);
  } catch (e) {
    // Color resonance module not available yet
    colorResonance = undefined;
  }
  
  // Calculate Pattern Recognition - analyzes all key numbers for meaningful patterns
  let patternAnalysis;
  let multiPatternAnalysis;
  try {
    const { analyzePatterns, analyzeMultiplePatterns } = require('./patternRecognition');
    
    // Analyze primary value (personKabir) for patterns
    patternAnalysis = analyzePatterns(personKabir);
    
    // Analyze multiple values together for cross-pattern relationships
    const valuesToAnalyze: Record<string, number> = {
      'Kabīr': personKabir,
      'Ṣaghīr': saghir,
    };
    
    if (motherKabir > 0) {
      valuesToAnalyze['Mother Kabīr'] = motherKabir;
      valuesToAnalyze['Total Kabīr'] = totalKabir;
    }
    
    multiPatternAnalysis = analyzeMultiplePatterns(valuesToAnalyze);
  } catch (e) {
    // Pattern recognition module not available yet
    patternAnalysis = undefined;
    multiPatternAnalysis = undefined;
  }
  
  // Generate Wafq (Magic Squares) - personalized sacred geometry
  let wafqAnalysis;
  try {
    const { generateWafqAnalysis } = require('./wafqGenerator');
    wafqAnalysis = generateWafqAnalysis(
      personKabir,
      saghir,
      element.en,
      personName
    );
  } catch (e) {
    // Wafq generator not available yet
    wafqAnalysis = undefined;
  }
  
  // Calculate Talisman Timing - optimal astrological windows
  let talismanTiming;
  try {
    const { calculateOptimalTimingWindows } = require('./talismanTiming');
    talismanTiming = calculateOptimalTimingWindows(
      burj.planet,
      element.en,
      burj.en,
      burj.ar
    );
  } catch (e) {
    // Talisman timing not available yet
    talismanTiming = undefined;
  }
  
  return {
    arabicName: personName, // Add the Arabic name for element chart calculation
    personKabir,
    motherKabir,
    totalKabir,
    saghir,
    tabhIdx,
    element,
    burjIdx,
    burj,
    hourIndex,
    expression,
    foundation,
    // Higher Resonance Insights
    divineNameResonance,
    colorResonance,
    elementDistribution,
    // Pattern Recognition
    patternAnalysis,
    multiPatternAnalysis,
    // Wafq (Magic Squares)
    wafqAnalysis,
    // Talisman Timing
    talismanTiming,
  };
}

/**
 * Calculate element distribution from Arabic name
 * Returns percentages for each element (fire, air, water, earth)
 */
function calculateElementDistributionFromName(arabicText: string): Record<'fire' | 'air' | 'water' | 'earth', number> {
  // MAGHRIBI SYSTEM - Authentic West/North African tradition (7 letters per element)
  const LETTER_ELEMENTS: Record<string, 'fire' | 'air' | 'water' | 'earth'> = {
    // 🔥 Fire (Nār/نار) - Hot & Dry - 7 letters
    'ا': 'fire', 'ه': 'fire', 'ط': 'fire', 'م': 'fire', 'ف': 'fire', 'ش': 'fire', 'ذ': 'fire',
    // 💨 Air (Hawā'/هواء) - Hot & Moist - 7 letters
    'ب': 'air', 'و': 'air', 'ي': 'air', 'ن': 'air', 'ض': 'air', 'ظ': 'air', 'غ': 'air',
    // 💧 Water (Mā'/ماء) - Cold & Moist - 7 letters
    'ج': 'water', 'ز': 'water', 'ك': 'water', 'س': 'water', 'ق': 'water', 'ث': 'water', 'خ': 'water',
    // 🌍 Earth (Turāb/تراب) - Cold & Dry - 7 letters
    'د': 'earth', 'ح': 'earth', 'ل': 'earth', 'ع': 'earth', 'ر': 'earth', 'ص': 'earth', 'ت': 'earth',
    // Special forms
    'ة': 'earth' // Tā' marbūṭa (feminine ending) = same as ت
  };

  const normalized = arabicText.replace(/[ًٌٍَُِّْ\s]/g, '');
  const letters = [...normalized];
  const total = letters.length;
  
  const counts = { fire: 0, air: 0, water: 0, earth: 0 };
  
  letters.forEach(letter => {
    const element = LETTER_ELEMENTS[letter];
    if (element) {
      counts[element]++;
    }
  });
  
  return {
    fire: total > 0 ? Math.round((counts.fire / total) * 100) : 0,
    air: total > 0 ? Math.round((counts.air / total) * 100) : 0,
    water: total > 0 ? Math.round((counts.water / total) * 100) : 0,
    earth: total > 0 ? Math.round((counts.earth / total) * 100) : 0
  };
}

/**
 * Generate inheritance insight based on user's element and mother's element
 * Explains the relationship between expression (user) and foundation (mother)
 */
export function generateInheritanceInsight(
  userElement: ElementType,
  motherElement: ElementType
): string {
  const relation = ELEMENT_RELATIONS[userElement][motherElement];
  
  if (relation === 'same') {
    return `You express and inherit the same ${userElement} energy. Strong, consistent elemental identity with deep ${motherElement} roots. This creates a pure lineage of ${userElement} qualities - what you express outwardly mirrors your inner foundation.`;
  }
  
  if (relation === 'compatible') {
    // Specific compatible pairs
    if (userElement === 'Fire' && motherElement === 'Air') {
      return `You express with Fire but have Air roots. Your Air foundation feeds your Fire action - like wind fanning flames. This creates natural confidence and momentum. Your mother's airy nature (movement, ideas) supports your fiery expression (passion, action).`;
    }
    if (userElement === 'Air' && motherElement === 'Fire') {
      return `You express with Air but have Fire roots. Your Fire foundation energizes your Air movement - like heat creating wind. This brings dynamic communication and inspired ideas. Your mother's fiery nature (passion, will) fuels your airy expression (thought, connection).`;
    }
    if (userElement === 'Water' && motherElement === 'Earth') {
      return `You express with Water but have Earth roots. Your Earth foundation contains your Water flow - like a riverbed holding water. This brings emotional stability and practical intuition. Your mother's earthy nature (stability, form) grounds your watery expression (emotion, depth).`;
    }
    if (userElement === 'Earth' && motherElement === 'Water') {
      return `You express with Earth but have Water roots. Your Water foundation nourishes your Earth structure - like rain feeding the soil. This brings fertile creativity and adaptable stability. Your mother's watery nature (emotion, flow) enriches your earthy expression (building, manifesting).`;
    }
    
    return `You express with ${userElement} but have ${motherElement} roots. These elements support each other naturally - your foundation enhances your expression. This creates a harmonious flow between inner origin and outer manifestation.`;
  }
  
  if (relation === 'opposing') {
    // Specific opposing pairs
    if (userElement === 'Fire' && motherElement === 'Water') {
      return `You express with Fire but have Water roots. This creates dynamic tension - passion balanced by emotional depth. You may feel pulled between action and reflection, intensity and flow. This explains why you can be both fierce and deeply sensitive. Learn to honor both: your Fire drive and your Water foundation.`;
    }
    if (userElement === 'Water' && motherElement === 'Fire') {
      return `You express with Water but have Fire roots. This creates dynamic tension - emotional depth fueled by inner passion. You may feel pulled between flow and force, receptivity and assertion. This explains why you can be both gentle and intensely willful. Your calm exterior holds powerful depths.`;
    }
    if (userElement === 'Air' && motherElement === 'Earth') {
      return `You express with Air but have Earth roots. This creates dynamic tension - movement balanced by stability. You may feel pulled between freedom and security, ideas and form. This explains why you value both exploration and solid foundations. Your grounded base allows safe flight.`;
    }
    if (userElement === 'Earth' && motherElement === 'Air') {
      return `You express with Earth but have Air roots. This creates dynamic tension - structure built on freedom. You may feel pulled between stability and change, form and flow. This explains why you can be both reliable and surprisingly adaptable. Your stable exterior holds spacious depths.`;
    }
    
    return `You express with ${userElement} but have ${motherElement} roots. This creates dynamic tension - explains why you balance ${userElement === 'Fire' || userElement === 'Air' ? 'passion with depth or movement with stability' : 'depth with action or stability with change'}. This polarity is your gift - you contain both extremes.`;
  }
  
  // Neutral relation
  if (userElement === 'Fire' && motherElement === 'Earth') {
    return `You express with Fire and have Earth foundation. Fire and Earth create different modes - active expression vs. stable foundation. You can be intensely active outwardly while maintaining inner groundedness. Your earthy roots keep your fire from burning out.`;
  }
  if (userElement === 'Earth' && motherElement === 'Fire') {
    return `You express with Earth and have Fire foundation. These create different modes - stable expression powered by passionate foundation. Your outer reliability is fueled by inner drive. Your fiery roots energize your earthy manifestation.`;
  }
  if (userElement === 'Water' && motherElement === 'Air') {
    return `You express with Water and have Air foundation. These create different modes - emotional expression with mental foundation. You feel deeply but process through understanding. Your airy roots give perspective to your watery flow.`;
  }
  if (userElement === 'Air' && motherElement === 'Water') {
    return `You express with Air and have Water foundation. These create different modes - mental expression with emotional foundation. You think and communicate, but it's rooted in deep feeling. Your watery roots give depth to your airy ideas.`;
  }
  
  return `You express with ${userElement} and have ${motherElement} foundation. These create different modes - active expression vs. restful foundation. This gives you versatility and range.`;
}

// ============================================================================
// LETTER GEOMETRY ANALYSIS - Handasa al-Ḥurūf (Letter Shapes)
// ============================================================================

/**
 * Geometry types based on physical letter shapes
 */
export type GeometryType = 'vertical' | 'round' | 'flat' | 'angular';

/**
 * Geometry classification result for a single type
 */
export interface GeometryTypeData {
  count: number;
  letters: string[];
  percentage: number;
}

/**
 * Complete geometry analysis for a name
 */
export interface GeometryAnalysis {
  vertical: GeometryTypeData;
  round: GeometryTypeData;
  flat: GeometryTypeData;
  angular: GeometryTypeData;
  total: number;
  dominant: GeometryType;
  secondary: GeometryType | null;
  profile: string;
}

/**
 * Geometry classification map based on Imam al-Būnī's teachings
 */
const GEOMETRY_MAP: Record<GeometryType, string[]> = {
  vertical: ['ا', 'ل', 'ط', 'ظ', 'ك', 'لا'], // Vertical/Upward forms
  round: ['م', 'و', 'ن', 'ه', 'ة', 'ق', 'ف'], // Round/Circular forms
  flat: ['س', 'ش', 'ص', 'ض', 'ب', 'ت', 'ث'], // Flat/Horizontal forms
  angular: ['ح', 'خ', 'ع', 'غ', 'ج', 'ز', 'ر', 'ذ', 'د'] // Angular/Sharp forms
};

/**
 * Arabic names for geometry types
 */
export const GEOMETRY_NAMES: Record<GeometryType, { en: string; fr: string; ar: string; transliteration: string }> = {
  vertical: { en: 'Vertical', fr: 'Vertical', ar: 'عمودي', transliteration: 'ʿAmūdī' },
  round: { en: 'Round', fr: 'Rond', ar: 'مدور', transliteration: 'Mudawwar' },
  flat: { en: 'Flat', fr: 'Plat', ar: 'مسطح', transliteration: 'Musaṭṭaḥ' },
  angular: { en: 'Angular', fr: 'Angulaire', ar: 'زاوية', transliteration: 'Zāwiya' }
};

/**
 * Keywords for each geometry type
 */
export const GEOMETRY_KEYWORDS: Record<GeometryType, string[]> = {
  vertical: ['Aspiration', 'Spiritual reach', 'Goals', 'Growth'],
  round: ['Compassion', 'Wholeness', 'Cycles', 'Embrace'],
  flat: ['Stability', 'Grounding', 'Foundation', 'Balance'],
  angular: ['Decisiveness', 'Sharpness', 'Clarity', 'Transformation']
};

/**
 * Analyze the geometric composition of a name
 */
export function analyzeGeometry(arabicName: string): GeometryAnalysis {
  const normalized = arabicName.replace(/[ًٌٍَُِّْ]/g, '').replace(/\s+/g, '');
  const letters = [...normalized];
  
  const result: Record<GeometryType, GeometryTypeData> = {
    vertical: { count: 0, letters: [], percentage: 0 },
    round: { count: 0, letters: [], percentage: 0 },
    flat: { count: 0, letters: [], percentage: 0 },
    angular: { count: 0, letters: [], percentage: 0 }
  };
  
  // Count each letter's geometry type
  letters.forEach(letter => {
    (Object.keys(GEOMETRY_MAP) as GeometryType[]).forEach(type => {
      if (GEOMETRY_MAP[type].includes(letter)) {
        result[type].count++;
        if (!result[type].letters.includes(letter)) {
          result[type].letters.push(letter);
        }
      }
    });
  });
  
  // Calculate total and percentages
  const total = letters.length;
  (Object.keys(result) as GeometryType[]).forEach(type => {
    result[type].percentage = total > 0 ? (result[type].count / total) * 100 : 0;
  });
  
  // Find dominant and secondary
  const sorted = (Object.keys(result) as GeometryType[])
    .sort((a, b) => result[b].percentage - result[a].percentage);
  
  const dominant = sorted[0];
  const secondary = result[sorted[1]].percentage > 10 ? sorted[1] : null;
  
  // Generate profile
  const profile = generateGeometricProfile(result, dominant, secondary);
  
  return {
    ...result,
    total,
    dominant,
    secondary,
    profile
  };
}

/**
 * Generate personality profile based on geometric composition
 */
function generateGeometricProfile(
  counts: Record<GeometryType, GeometryTypeData>,
  dominant: GeometryType,
  secondary: GeometryType | null
): string {
  const dominantPct = counts[dominant].percentage;
  
  // Single dominant type (>60%)
  if (dominantPct > 60) {
    const profiles = {
      vertical: "Strong upward-moving energy. You naturally reach for ideals and higher purposes. Spiritual seeker with aspirational drive, always looking to elevate yourself and others.",
      round: "Embracing and nurturing energy. You contain and complete cycles with emotional warmth. Natural capacity for compassion and wholeness, creating safe spaces for growth.",
      flat: "Grounded and stable foundation. You create horizontal expansion with practical stability. Reliable, earth-connected energy that others can depend upon.",
      angular: "Sharp and decisive energy. You cut through complexity with clarity and transformation. Direct, purposeful approach that doesn't waste time or energy."
    };
    return profiles[dominant];
  }
  
  // Combination profiles
  if (secondary) {
    const comboKey = `${dominant}-${secondary}`;
    const combos: Record<string, string> = {
      'vertical-round': "You reach for ideals (vertical) while embracing others (round). Aspirational yet compassionate - you lift others as you climb. Balances spiritual seeking with emotional warmth.",
      'vertical-flat': "You ground your aspirations (vertical + flat). Practical dreamer who builds stable paths to high goals. Your vision is matched by methodical execution.",
      'vertical-angular': "You ascend with sharpness (vertical + angular). Ambitious and decisive, cutting through obstacles to reach heights. Dynamic upward momentum with clear direction.",
      'round-vertical': "You nurture with aspiration (round + vertical). Compassionate idealism - you care deeply while reaching for better. Emotional warmth directed toward growth.",
      'round-flat': "You embrace with stability (round + flat). Grounded compassion - reliable emotional support with practical care. Creating safe, stable containers for others.",
      'round-angular': "You nurture with decisiveness (round + angular). Compassionate yet clear-cutting when needed - protective warmth. You defend what you love with precision.",
      'flat-vertical': "You stabilize with reach (flat + vertical). Building solid foundations while aiming high. Grounded ambition that creates lasting structures.",
      'flat-round': "You ground with embrace (flat + round). Stable compassion - dependable emotional availability. Practical nurturing that provides real support.",
      'flat-angular': "You stabilize with sharp clarity (flat + angular). Grounded decisiveness - you build with precision and purpose. Methodical yet incisive approach.",
      'angular-vertical': "You sharpen while rising (angular + vertical). Decisive aspiration - cutting your path to higher goals. Purposeful ascent with no wasted energy.",
      'angular-round': "You cut with compassion (angular + round). Clear boundaries with emotional awareness. Decisive yet nurturing - you protect through clarity.",
      'angular-flat': "You sharpen with grounding (angular + flat). Decisive stability - precise and dependable. You establish clear, reliable structures."
    };
    
    return combos[comboKey] || `Balanced geometric energy combining ${dominant} with ${secondary}. This creates a versatile expression that draws on multiple energetic patterns.`;
  }
  
  // Balanced (no clear dominant)
  return "Balanced geometric energy across multiple forms. You have versatility in expression, able to be aspirational, nurturing, grounded, or decisive as situations require. Adaptable spiritual presence.";
}

// ============================================================================
// REAL-TIME PLANETARY HOUR & ACT NOW LOGIC
// ============================================================================

/**
 * Alignment quality between user element and current planetary hour
 */
export type AlignmentQuality = 'perfect' | 'strong' | 'moderate' | 'weak' | 'opposing';

/**
 * Urgency level for action
 */
export type UrgencyLevel = 'high' | 'medium' | 'low';

/**
 * Action type for buttons
 */
export type ActionType = 'start' | 'schedule' | 'rest' | 'plan' | 'wait';

/**
 * Current planetary hour with real-time data
 */
export interface CurrentPlanetaryHour {
  planet: Planet;
  planetArabic: string;
  element: ElementType;
  startTime: Date;
  endTime: Date;
  isCurrent: boolean;
}

/**
 * Element alignment result
 */
export interface ElementAlignment {
  userElement: ElementType;
  hourElement: ElementType;
  quality: AlignmentQuality;
  qualityArabic: string;
  harmonyScore: number;
}

/**
 * Time window information
 */
export interface TimeWindow {
  closesIn: string;
  closesInMs: number;
  closesInMinutes: number;
  nextWindow: Date | null;
  nextWindowIn: string;
  urgency: UrgencyLevel;
}

/**
 * Action button configuration
 */
export interface ActionButton {
  icon: string;
  label: string;
  action: ActionType;
  priority: 'primary' | 'secondary' | 'tertiary';
}

/**
 * Element-specific guidance
 */
export interface ElementGuidance {
  bestFor: string[];
  avoid: string[];
}

/**
 * Planet to Element mapping
 */
const PLANET_ELEMENT_MAP: Record<Planet, ElementType> = {
  Sun: 'Fire',
  Mars: 'Fire',
  Moon: 'Water',
  Venus: 'Water',
  Mercury: 'Air',
  Jupiter: 'Air',
  Saturn: 'Earth'
};

/**
 * Planet Arabic names
 */
const PLANET_ARABIC: Record<Planet, string> = {
  Sun: 'الشمس',
  Moon: 'القمر',
  Mars: 'المريخ',
  Mercury: 'عطارد',
  Jupiter: 'المشتري',
  Venus: 'الزهرة',
  Saturn: 'زحل'
};

/**
 * Get current planetary hour with element information
 */
export function getCurrentPlanetaryHour(date: Date = new Date()): CurrentPlanetaryHour {
  const planetaryData = calculatePlanetaryHour(date);
  const element = PLANET_ELEMENT_MAP[planetaryData.planet];
  
  // Calculate hour boundaries (simplified - 1 hour blocks)
  const currentHour = date.getHours();
  const startTime = new Date(date);
  startTime.setHours(currentHour, 0, 0, 0);
  
  const endTime = new Date(date);
  endTime.setHours(currentHour + 1, 0, 0, 0);
  
  return {
    planet: planetaryData.planet,
    planetArabic: PLANET_ARABIC[planetaryData.planet],
    element,
    startTime,
    endTime,
    isCurrent: true
  };
}

/**
 * Detect alignment quality between user element and hour element
 */
export function detectAlignment(
  userElement: ElementType,
  hourElement: ElementType
): ElementAlignment {
  // Perfect - Same element
  if (userElement === hourElement) {
    return {
      userElement,
      hourElement,
      quality: 'perfect',
      qualityArabic: 'اتصال تام',
      harmonyScore: 100
    };
  }
  
  // Strong - Compatible elements (from ELEMENT_RELATIONS)
  const compatible: Record<ElementType, ElementType> = {
    Fire: 'Air',
    Air: 'Fire',
    Water: 'Earth',
    Earth: 'Water'
  };
  
  if (compatible[userElement] === hourElement) {
    return {
      userElement,
      hourElement,
      quality: 'strong',
      qualityArabic: 'اتصال قوي',
      harmonyScore: 75
    };
  }
  
  // Opposing - Conflicting elements
  const opposing: Record<ElementType, ElementType> = {
    Fire: 'Water',
    Water: 'Fire',
    Air: 'Earth',
    Earth: 'Air'
  };
  
  if (opposing[userElement] === hourElement) {
    return {
      userElement,
      hourElement,
      quality: 'opposing',
      qualityArabic: 'اتصال ضعيف',
      harmonyScore: 25
    };
  }
  
  // Moderate - Neutral
  return {
    userElement,
    hourElement,
    quality: 'moderate',
    qualityArabic: 'اتصال متوسط',
    harmonyScore: 50
  };
}

/**
 * Calculate time window information
 */
export function calculateTimeWindow(
  currentHour: CurrentPlanetaryHour,
  userElement: ElementType
): TimeWindow {
  const now = new Date();
  const closesInMs = currentHour.endTime.getTime() - now.getTime();
  const closesInMinutes = Math.floor(closesInMs / 60000);
  
  // Format closing time
  let closesIn: string;
  if (closesInMinutes < 1) {
    closesIn = 'less than 1 minute';
  } else if (closesInMinutes === 1) {
    closesIn = '1 minute';
  } else if (closesInMinutes < 60) {
    closesIn = `${closesInMinutes} minutes`;
  } else {
    const hours = Math.floor(closesInMinutes / 60);
    const mins = closesInMinutes % 60;
    closesIn = hours === 1 ? '1 hour' : `${hours} hours`;
    if (mins > 0) closesIn += ` ${mins} min`;
  }
  
  // Find next matching window (simplified - next occurrence of compatible element)
  // In a full implementation, this would scan through all 24 planetary hours
  const hoursUntilNext = findNextCompatibleHour(userElement, now);
  const nextWindow = hoursUntilNext > 0 ? new Date(now.getTime() + hoursUntilNext * 60 * 60 * 1000) : null;
  
  let nextWindowIn = '';
  if (nextWindow) {
    if (hoursUntilNext < 1) {
      nextWindowIn = 'less than 1 hour';
    } else if (hoursUntilNext === 1) {
      nextWindowIn = '1 hour';
    } else if (hoursUntilNext < 24) {
      const hour = nextWindow.getHours();
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      nextWindowIn = `Today at ${displayHour}:00 ${ampm} (${Math.floor(hoursUntilNext)} hrs)`;
    } else {
      nextWindowIn = 'Tomorrow';
    }
  }
  
  // Calculate urgency
  let urgency: UrgencyLevel;
  if (closesInMinutes <= 15) urgency = 'high';
  else if (closesInMinutes <= 45) urgency = 'medium';
  else urgency = 'low';
  
  return {
    closesIn,
    closesInMs,
    closesInMinutes,
    nextWindow,
    nextWindowIn,
    urgency
  };
}

/**
 * Find next compatible hour (simplified estimation)
 */
function findNextCompatibleHour(userElement: ElementType, now: Date): number {
  // Simplified: estimate next compatible hour
  // Fire/Air appear roughly every 3-4 hours, Water/Earth similar
  const currentHour = now.getHours();
  
  // Rough planetary hour sequence (repeats every 7 hours)
  const elementSequence: ElementType[] = ['Fire', 'Water', 'Air', 'Earth', 'Earth', 'Air', 'Water'];
  const currentIndex = currentHour % 7;
  
  for (let i = 1; i <= 24; i++) {
    const checkIndex = (currentIndex + i) % 7;
    const element = elementSequence[checkIndex];
    
    if (element === userElement || isElementCompatible(userElement, element)) {
      return i;
    }
  }
  
  return 4; // Default fallback
}

/**
 * Check if two elements are compatible
 */
function isElementCompatible(element1: ElementType, element2: ElementType): boolean {
  const compatible: Record<ElementType, ElementType> = {
    Fire: 'Air',
    Air: 'Fire',
    Water: 'Earth',
    Earth: 'Water'
  };
  return compatible[element1] === element2;
}

/**
 * Generate action buttons based on alignment
 */
export function generateActionButtons(
  alignment: ElementAlignment,
  timeWindow: TimeWindow,
  t?: any
): ActionButton[] {
  // HIGH ALIGNMENT (Perfect or Strong)
  if (alignment.quality === 'perfect' || alignment.quality === 'strong') {
    return [
      {
        icon: '🚀',
        label: t?.actionButtons?.startImportantTask || 'Start Important Task',
        action: 'start',
        priority: 'primary'
      },
      {
        icon: '📞',
        label: t?.actionButtons?.makeDifficultCall || 'Make Difficult Call',
        action: 'start',
        priority: 'primary'
      },
      {
        icon: '✍️',
        label: t?.actionButtons?.sendCriticalEmail || 'Send Critical Email',
        action: 'start',
        priority: 'secondary'
      },
      {
        icon: '📅',
        label: 'Schedule for Later',
        action: 'schedule',
        priority: 'tertiary'
      }
    ];
  }
  
  // LOW ALIGNMENT (Opposing or Weak)
  if (alignment.quality === 'opposing' || alignment.quality === 'weak') {
    return [
      {
        icon: '⏸️',
        label: 'Rest & Reflect',
        action: 'rest',
        priority: 'primary'
      },
      {
        icon: '📖',
        label: 'Plan & Prepare',
        action: 'plan',
        priority: 'secondary'
      },
      {
        icon: '⏭️',
        label: `Wait for ${alignment.userElement} (${timeWindow.nextWindowIn})`,
        action: 'wait',
        priority: 'secondary'
      }
    ];
  }
  
  // MODERATE ALIGNMENT
  return [
    {
      icon: '📝',
      label: 'Handle Routine Tasks',
      action: 'start',
      priority: 'primary'
    },
    {
      icon: '🔄',
      label: 'Continue Ongoing Work',
      action: 'start',
      priority: 'secondary'
    },
    {
      icon: '⏭️',
      label: 'Wait for Better Timing',
      action: 'wait',
      priority: 'tertiary'
    }
  ];
}

/**
 * Element-specific guidance for optimal actions
 */
export const ELEMENT_GUIDANCE_MAP: Record<ElementType, ElementGuidance> = {
  Fire: {
    bestFor: [
      'Launch new projects',
      'Make important decisions',
      'Have courage-requiring conversations',
      'Take bold action',
      'Lead and inspire others'
    ],
    avoid: [
      'Emotional processing',
      'Detailed planning',
      'Slow, methodical work'
    ]
  },
  
  Air: {
    bestFor: [
      'Communicate and network',
      'Learn new concepts',
      'Brainstorm ideas',
      'Write and articulate',
      'Teach and share knowledge'
    ],
    avoid: [
      'Heavy physical work',
      'Emotional depth work',
      'Long-term commitments'
    ]
  },
  
  Water: {
    bestFor: [
      'Emotional processing',
      'Deep reflection',
      'Healing conversations',
      'Intuitive work',
      'Creative flow'
    ],
    avoid: [
      'Quick decisions',
      'Confrontations',
      'Aggressive action'
    ]
  },
  
  Earth: {
    bestFor: [
      'Build and organize',
      'Make commitments',
      'Complete projects',
      'Financial planning',
      'Physical work'
    ],
    avoid: [
      'Rapid changes',
      'Impulsive decisions',
      'Abstract theorizing'
    ]
  }
};

/**
 * Get element Arabic name
 */
export function getElementArabicName(element: ElementType): string {
  const names: Record<ElementType, string> = {
    Fire: 'نار',
    Water: 'ماء',
    Air: 'هواء',
    Earth: 'تراب'
  };
  return names[element];
}

/**
 * Compatibility analysis between two souls
 */
export function analyzeCompatibility(name1: string, name2: string, abjad: Record<string, number> = ABJAD_MAGHRIBI) {
  const person1 = analyzeNameDestiny(name1, abjad);
  const person2 = analyzeNameDestiny(name2, abjad);
  
  const destinyDiff = Math.abs(person1.saghir - person2.saghir);
  const soulDiff = Math.abs(person1.soulUrgeNumber - person2.soulUrgeNumber);
  
  /**
   * HARMONY SCORE FORMULA (0-100)
   * 
   * This formula is a MODERN INTERPRETATION combining classical Islamic numerology
   * principles with relationship psychology insights. It is NOT a classical Islamic text formula.
   * 
   * Components:
   * 1. Base Score: 100 (assumes neutral compatibility)
   * 2. Destiny Number Compatibility: ±10 to ±20
   *    - Identical destiny (diff = 0): +20 (natural alignment)
   *    - Close destiny (diff ≤ 2): +10 (complementary)
   *    - Opposing destiny (diff ≥ 4): -10 (challenging dynamics)
   * 3. Soul Urge Compatibility: ±5 to ±15
   *    - Identical soul urge (diff = 0): +15 (emotional alignment)
   *    - Close soul urge (diff ≤ 2): +5 (natural understanding)
   * 4. Special Numerological Pairings: +10 to +20
   *    - Specific number combinations recognized in classical tradition
   *    - Examples: 1-2 (Leader/Supporter), 4-8 (Builder/Achiever)
   * 5. Final Range: 0-100 (clamped)
   * 
   * IMPORTANT DISCLAIMER:
   * This score should NOT be used for making life-changing decisions alone.
   * It is meant for self-reflection, entertainment, and gaining perspective.
   * Real relationships depend on commitment, communication, effort, and divine will.
   */
  // Calculate harmony score (0-100)
  let harmonyScore = 100;
  
  // Destiny compatibility
  if (destinyDiff === 0) harmonyScore += 20; // Perfect match
  else if (destinyDiff <= 2) harmonyScore += 10; // Complementary
  else if (destinyDiff >= 4) harmonyScore -= 10; // Challenging
  
  // Soul urge compatibility
  if (soulDiff === 0) harmonyScore += 15;
  else if (soulDiff <= 2) harmonyScore += 5;
  
  // Specific number combinations
  const combo = `${person1.saghir}-${person2.saghir}`;
  const specialPairs: Record<string, { type: string; bonus: number; note: string }> = {
    '1-2': { type: 'Leader & Supporter', bonus: 15, note: 'Natural partnership' },
    '3-5': { type: 'Creative & Adventurous', bonus: 10, note: 'Exciting but unstable' },
    '4-8': { type: 'Builder & Achiever', bonus: 20, note: 'Material success together' },
    '6-9': { type: 'Nurturer & Healer', bonus: 15, note: 'Compassionate union' },
    '7-7': { type: 'Twin Mystics', bonus: 10, note: 'Deep understanding, may isolate' }
  };
  
  const pair = specialPairs[combo] || specialPairs[`${person2.saghir}-${person1.saghir}`];
  if (pair) harmonyScore += pair.bonus;
  
  return {
    person1,
    person2,
    harmonyScore: Math.min(100, Math.max(0, harmonyScore)),
    relationship: pair?.type || 'Unique Dynamic',
    strengths: generateCompatibilityStrengths(person1.saghir, person2.saghir),
    challenges: generateCompatibilityChallenges(person1.saghir, person2.saghir),
    advice: pair?.note || 'Each relationship teaches unique lessons'
  };
}

function generateCompatibilityStrengths(n1: number, n2: number): string[] {
  const strengths: string[] = [];
  
  if (n1 === n2) {
    strengths.push('Deep mutual understanding');
    strengths.push('Shared values and goals');
  }
  
  if (Math.abs(n1 - n2) === 1) {
    strengths.push('Natural progression and growth together');
    strengths.push('Complementary energies');
  }
  
  if ((n1 + n2) === 10) {
    strengths.push('Complete cycle together');
    strengths.push('Wholeness through union');
  }
  
  return strengths.length > 0 ? strengths : ['Opportunity for growth', 'Learning through differences'];
}

function generateCompatibilityChallenges(n1: number, n2: number): string[] {
  const challenges: string[] = [];
  
  if (n1 === n2) {
    challenges.push('May mirror each other\'s shadows');
    challenges.push('Need external perspectives');
  }
  
  if (Math.abs(n1 - n2) >= 5) {
    challenges.push('Very different life approaches');
    challenges.push('Requires conscious effort to harmonize');
  }
  
  return challenges.length > 0 ? challenges : ['Balance individuality with togetherness'];
}

/**
 * Favorable timing based on planetary hours
 */
export function calculatePlanetaryHour(date: Date): {
  planet: Planet;
  quality: string;
  favorable: string[];
  avoid: string[];
} {
  const dayOfWeek = date.getDay(); // 0 = Sunday
  const planetOrder: Planet[] = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
  const dayPlanet = planetOrder[dayOfWeek];
  
  const hour = date.getHours();
  const isDaytime = hour >= 6 && hour < 18;
  
  // Calculate planetary hour (simplified)
  const hoursSinceDawn = isDaytime ? hour - 6 : hour + 6;
  const planetIndex = (planetOrder.indexOf(dayPlanet) + hoursSinceDawn) % 7;
  const currentPlanet = PLANETARY_HOURS_ORDER[planetIndex];
  
  const qualities: Record<Planet, { quality: string; favorable: string[]; avoid: string[] }> = {
    'Sun': {
      quality: 'Leadership, Authority, Success',
      favorable: ['Start new ventures', 'Seek promotions', 'Public speaking', 'Creative projects'],
      avoid: ['Ego-driven decisions', 'Confrontations with authority']
    },
    'Moon': {
      quality: 'Emotion, Intuition, Home',
      favorable: ['Family matters', 'Emotional healing', 'Dream work', 'Nurturing activities'],
      avoid: ['Important decisions (emotions may cloud judgment)', 'Legal matters']
    },
    'Mercury': {
      quality: 'Communication, Learning, Commerce',
      favorable: ['Study', 'Writing', 'Business deals', 'Social networking', 'Short travel'],
      avoid: ['Signing contracts if Mercury retrograde', 'Gossip']
    },
    'Venus': {
      quality: 'Love, Beauty, Harmony',
      favorable: ['Romance', 'Art', 'Socializing', 'Beautification', 'Peace-making'],
      avoid: ['Harsh criticism', 'Conflict']
    },
    'Mars': {
      quality: 'Action, Courage, Competition',
      favorable: ['Physical exercise', 'Assertive action', 'Courage needed', 'Surgery'],
      avoid: ['Anger', 'Rash decisions', 'Starting fights']
    },
    'Jupiter': {
      quality: 'Expansion, Wisdom, Abundance',
      favorable: ['Legal matters', 'Education', 'Spiritual practice', 'Long-term planning', 'Generosity'],
      avoid: ['Excess', 'Overconfidence']
    },
    'Saturn': {
      quality: 'Structure, Discipline, Karma',
      favorable: ['Hard work', 'Long-term commitments', 'Dealing with authorities', 'Property matters'],
      avoid: ['Fun activities', 'Quick results expectations']
    }
  };
  
  return {
    planet: currentPlanet,
    ...qualities[currentPlanet]
  };
}

/**
 * Personal year cycle (1-9 repeating)
 */
export function calculatePersonalYear(birthDate: Date, currentYear: number) {
  const month = birthDate.getMonth() + 1;
  const day = birthDate.getDate();
  
  const sum = day + month + currentYear;
  const personalYear = digitalRoot(sum);
  
  return {
    year: personalYear,
    station: SPIRITUAL_STATIONS[personalYear as keyof typeof SPIRITUAL_STATIONS],
    theme: getYearTheme(personalYear)
  };
}

function getYearTheme(year: number): string {
  const themes: Record<number, string> = {
    1: 'New beginnings, planting seeds, independence',
    2: 'Partnerships, patience, cooperation',
    3: 'Creative expression, joy, social expansion',
    4: 'Building foundations, hard work, stability',
    5: 'Change, freedom, adventure, unexpected events',
    6: 'Responsibility, service, family matters, love',
    7: 'Spiritual growth, introspection, study, rest',
    8: 'Achievement, power, financial matters, recognition',
    9: 'Completion, release, humanitarianism, endings leading to new beginnings'
  };
  
  return themes[year] || 'Transition';
}

/**
 * Daily dhikr recommendation based on hadath element
 */
export function getDailyDhikr(hadath: number): {
  dhikr: string;
  arabic: string;
  count: number;
  time: string;
  benefit: string;
} {
  const element = hadathToElement((hadath % 4) as 0 | 1 | 2 | 3);
  
  const recommendations = {
    Fire: {
      dhikr: 'Yā Qawiyy (O Mighty One)',
      arabic: 'يَا قَوِيّ',
      count: 116,
      time: 'After Fajr',
      benefit: 'Strengthens willpower and courage'
    },
    Water: {
      dhikr: 'Yā Laṭīf (O Subtle One)',
      arabic: 'يَا لَطِيف',
      count: 129,
      time: 'After Maghrib',
      benefit: 'Brings ease in difficulties, softens hearts'
    },
    Air: {
      dhikr: 'Yā ʿAlīm (O All-Knowing)',
      arabic: 'يَا عَلِيم',
      count: 150,
      time: 'After ʿIshā',
      benefit: 'Increases knowledge and clarity'
    },
    Earth: {
      dhikr: 'Yā Ṣabūr (O Patient One)',
      arabic: 'يَا صَبُور',
      count: 298,
      time: 'Before sleep',
      benefit: 'Grants patience and steadfastness'
    }
  };
  
  return recommendations[element] || recommendations.Earth;
}

function hadathToElement(hadath: 0 | 1 | 2 | 3): 'Fire' | 'Water' | 'Air' | 'Earth' {
  // MAGHRIBI SYSTEM: 1=Fire, 2=Earth, 3=Air, 4(0)=Water
  const map = { 0: 'Water', 1: 'Fire', 2: 'Earth', 3: 'Air' } as const;
  return map[hadath];
}

// ============================================================================
// WEEKLY CALENDAR & DAILY GUIDANCE - Practical Life Timing
// ============================================================================

export type ElementType = 'Fire' | 'Water' | 'Air' | 'Earth';
export type HarmonyType = 'Complete' | 'Partial' | 'Conflict';
export type DominantForce = 'Rūḥ' | 'Element' | 'Kawkab';
export type RuhPhaseGroup = 'Begin' | 'Build' | 'Complete';

/**
 * User Profile from name and birth date
 */
export interface UserProfile {
  name_ar: string;
  kabir: number;
  saghir: number; // Rūḥ number (1-9)
  ruh: number;
  element: ElementType;
  kawkab: Planet;
  letter_geometry: string[];
  anchor: string; // ISO date string
}

/**
 * Daily reading with practical tips
 */
export interface DailyReading {
  date: string; // ISO date
  weekday: string;
  day_planet: Planet;
  ruh_phase: number; // 1-9
  ruh_phase_group: RuhPhaseGroup;
  element_phase: ElementType;
  harmony_score: number; // 0-10
  band: 'High' | 'Moderate' | 'Low';
  tips: string[];
  // Rest Signal (Infisāl) fields
  isRestDay?: boolean; // True if harmony ≤ 4
  restLevel?: 'gentle' | 'deep'; // Deep if ≤ 1, gentle if 2-4
  restPractices?: string[]; // Specific rest practices
  betterDays?: string[]; // Suggest better days for rescheduling
  // Energy Return (Irtiṭāb) - Lesson 25
  energyReturn: {
    speed: 'instant' | 'quick' | 'gradual' | 'delayed';
    timeframe: string; // "same day", "few hours", "2-3 days", "1-2 weeks"
    description: string; // User-friendly explanation
    practice: string; // Actionable suggestion
  };
  // Task Sequencer (Niẓām) - Lesson 28
  taskSequence?: TaskSequence;
}

/**
 * Task Sequencer interfaces for optimal timing throughout the day
 */
export interface TaskSequence {
  morning: TaskWindow;
  midday: TaskWindow;
  afternoon: TaskWindow;
  evening: TaskWindow;
}

export interface TaskWindow {
  timeRange: string;        // "7-9 AM"
  energyType: string;        // "Peak clarity", "Social energy", etc.
  bestFor: string[];         // ["Important decisions", "Creative work"]
  avoid: string[];           // ["Routine tasks", "Interruptions"]
  planetalPhase?: string;    // "Jupiter hour begins"
}

/**
 * Weekly summary with badges
 */
export interface WeeklySummary {
  days: DailyReading[];
  best_day: string; // Date of highest score
  gentle_day: string; // Date of lowest score
  focus_day: string; // Good for concentration (Saturn/Mercury)
}

/**
 * Planet support/opposition for elements
 */
const PLANET_ELEMENT_SUPPORT: Record<ElementType, { supportive: Planet[]; opposing: Planet[] }> = {
  Fire: { 
    supportive: ['Sun', 'Mars', 'Jupiter'], 
    opposing: ['Moon'] 
  },
  Water: { 
    supportive: ['Moon', 'Venus'], 
    opposing: ['Sun', 'Mars'] 
  },
  Air: { 
    supportive: ['Mercury', 'Venus'], 
    opposing: ['Saturn'] 
  },
  Earth: { 
    supportive: ['Saturn', 'Venus'], 
    opposing: ['Sun', 'Mercury'] 
  }
};

/**
 * Friendly planet pairs
 */
const PLANET_FRIENDSHIPS: Record<Planet, Planet[]> = {
  Sun: ['Jupiter', 'Mars'],
  Moon: ['Venus', 'Mercury'],
  Mars: ['Sun', 'Jupiter'],
  Mercury: ['Venus', 'Moon'],
  Jupiter: ['Sun', 'Mars'],
  Venus: ['Moon', 'Mercury', 'Saturn'],
  Saturn: ['Venus', 'Mercury']
};

/**
 * Get rest practices based on rest level and planetary influence
 * Classical wisdom: Al-sukūn qabl al-ḥaraka (Stillness before motion)
 */
function getRestPractices(level: 'gentle' | 'deep', planet: Planet): string[] {
  if (level === 'deep') {
    return [
      'Physical rest - sleep, lie down, minimal movement',
      'Cancel all non-essential meetings/tasks',
      'Light prayer or dhikr only (no intensive practice)',
      'No decision-making today - defer to better days',
      'Hydrate, nourish, be gentle with yourself'
    ];
  }
  
  // Gentle rest - planet-specific suggestions
  const gentlePractices: Record<Planet, string[]> = {
    Sun: [
      '20min silence or meditation away from bright light',
      'Gentle walk in shade (no goals, just presence)',
      'Journal thoughts without forcing solutions',
      'Postpone leadership decisions until tomorrow',
      'Early bedtime for solar repair (before 10pm)'
    ],
    Moon: [
      '20min by water (real or visualized)',
      'Gentle emotional release - cry, write, express',
      'Nourish with warm, comforting food',
      'Postpone emotional conversations',
      'Extra sleep - honor your lunar rhythm'
    ],
    Mars: [
      'Very gentle movement only (stretching, slow walk)',
      'Channel anger into gentle journaling, not action',
      'No conflicts or confrontations today',
      'Postpone physical challenges',
      'Cool down with breathing exercises'
    ],
    Mercury: [
      'Information fast - limit reading/messages',
      'Speak less, listen to silence',
      'Postpone important communications',
      'Simple, single-focus tasks only',
      'Mental rest - no problem-solving'
    ],
    Jupiter: [
      'Scale back ambitious plans',
      'Small, contained activities only',
      'Postpone teaching or sharing wisdom',
      'Gratitude practice for what is',
      'Rest in contentment, not expansion'
    ],
    Venus: [
      'Gentle self-care (bath, soft music, beauty)',
      'No relationship decisions today',
      'Postpone social gatherings',
      'Solo time in pleasant surroundings',
      'Appreciate without acquiring'
    ],
    Saturn: [
      'Release rigidity - no forcing structure',
      'Postpone long-term planning',
      'Let go of "should" thoughts',
      'Gentle flexibility exercises',
      'Trust the pause before discipline returns'
    ]
  };
  
  return gentlePractices[planet];
}

/**
 * Find better days in the week for rescheduling
 */
function findBetterDays(allDays: DailyReading[], currentScore: number): string[] {
  return allDays
    .filter(day => day.harmony_score >= 7) // Only high-harmony days
    .map(day => `${day.weekday} (${day.day_planet}, ${day.harmony_score}/10)`)
    .slice(0, 2); // Max 2 suggestions
}

// ============================================================================
// ENERGY RETURN (IRTIṬĀB) - LESSON 25
// Classical teaching: Different elements return energy at different speeds
// ============================================================================

export type EnergyReturnSpeed = 'instant' | 'quick' | 'gradual' | 'delayed';

export interface EnergyReturnInfo {
  speed: EnergyReturnSpeed;
  timeframe: string;
  description: string;
  practice: string;
}

/**
 * Get planet's natural energy return speed
 * Based on classical elemental timing
 */
function getPlanetReturnSpeed(planet: Planet): EnergyReturnSpeed {
  const speedMap: Record<Planet, EnergyReturnSpeed> = {
    'Sun': 'instant',      // Fire - immediate results
    'Mars': 'instant',     // Fire - fast action/reaction
    'Mercury': 'quick',    // Air - rapid communication
    'Jupiter': 'quick',    // Air/Fire - expansion happens steadily but noticeably
    'Moon': 'gradual',     // Water - emotional cycles
    'Venus': 'gradual',    // Water - relationships take time
    'Saturn': 'delayed'    // Earth - structure takes time to build
  };
  
  return speedMap[planet];
}

/**
 * Get detailed energy return information
 * Customized by planet and speed
 */
function getEnergyReturnDetails(
  speed: EnergyReturnSpeed,
  planet: Planet,
  t?: any
): EnergyReturnInfo {
  
  const baseDetails: Record<EnergyReturnSpeed, { timeframe: string; description: string }> = {
    'instant': {
      timeframe: 'same day',
      description: 'Actions create immediate consequences'
    },
    'quick': {
      timeframe: 'few hours',
      description: t?.energyReturn?.fast || 'What you give flows back quickly'
    },
    'gradual': {
      timeframe: '2-3 days',
      description: t?.energyReturn?.slow || 'What you give today takes time to return'
    },
    'delayed': {
      timeframe: '1-2 weeks',
      description: 'Building foundations×results come later'
    }
  };
  
  // Planet-specific practices for each speed
  const planetPractices: Record<Planet, Record<EnergyReturnSpeed, string>> = {
    'Sun': {
      instant: 'Lead with generosity×authority returns respect today',
      quick: 'Lead with generosity×results come quickly',
      gradual: 'Lead with patience×influence grows steadily',
      delayed: 'Lead with consistency×reputation builds over time'
    },
    'Mars': {
      instant: 'Act with courage×strength returns strength immediately',
      quick: 'Act boldly×momentum builds fast',
      gradual: 'Push forward×progress shows in days',
      delayed: 'Train consistently×power builds gradually'
    },
    'Mercury': {
      instant: 'Speak clearly×understanding comes back instantly',
      quick: 'Communicate well×replies come swiftly',
      gradual: 'Share knowledge×learning compounds over days',
      delayed: 'Write persistently×wisdom accumulates slowly'
    },
    'Moon': {
      instant: 'Give care×comfort returns quickly today',
      quick: 'Give care×warmth returns in hours',
      gradual: 'Nurture bonds×emotional depth grows over days',
      delayed: 'Tend relationships×trust builds with time'
    },
    'Venus': {
      instant: 'Show love×beauty reflects back today',
      quick: 'Show love×joy returns soon',
      gradual: 'Create beauty×appreciation deepens over days',
      delayed: 'Invest in art×value increases with time'
    },
    'Jupiter': {
      instant: 'Think big×opportunities appear today',
      quick: 'Expand horizons×doors open quickly',
      gradual: 'Study deeply×wisdom unfolds over days',
      delayed: 'Build legacy×growth compounds over time'
    },
    'Saturn': {
      instant: 'Structure well×stability shows today',
      quick: 'Organize now×order appears soon',
      gradual: 'Plan carefully×results manifest in days',
      delayed: 'Build foundations×lasting results take weeks'
    }
  };
  
  const practice = planetPractices[planet]?.[speed] || baseDetails[speed].description;
  
  return {
    speed,
    timeframe: baseDetails[speed].timeframe,
    description: baseDetails[speed].description,
    practice
  };
}

/**
 * Calculate energy return speed for a given day
 * Based on Lesson 25: Irtiṭāb (Energy Return) concept
 * 
 * Fire: Instant (same day)
 * Air: Quick (few hours)
 * Water: Gradual (2-3 days)
 * Earth: Delayed (1-2 weeks)
 */
function calculateEnergyReturn(planet: Planet): EnergyReturnInfo {
  const speed = getPlanetReturnSpeed(planet);
  return getEnergyReturnDetails(speed, planet);
}

/**
 * Generate Task Sequence for high-harmony days (Niẓām - Lesson 28)
 * Returns optimal timing for different activities throughout the day
 * Only for harmony >= 7
 */
function generateTaskSequence(
  planet: Planet,
  element: ElementType,
  harmonyScore: number
): TaskSequence | undefined {
  
  // Only generate for high-harmony days (7-10)
  if (harmonyScore < 7) {
    return undefined;
  }
  
  // Planet-specific sequences
  const sequences: Record<Planet, TaskSequence> = {
    'Sun': {
      morning: {
        timeRange: '7-9 AM',
        energyType: 'Peak leadership energy',
        bestFor: [
          'Important decisions',
          'Set daily direction',
          'Lead team meetings',
          'Strategic planning'
        ],
        avoid: ['Routine tasks', 'Following others'],
        planetalPhase: 'Sun rises - authority peaks'
      },
      midday: {
        timeRange: '11 AM-1 PM',
        energyType: 'High visibility',
        bestFor: [
          'Public presentations',
          'Client meetings',
          'Performance reviews',
          'Launch initiatives'
        ],
        avoid: ['Background work', 'Hiding mistakes'],
        planetalPhase: 'Solar noon - maximum presence'
      },
      afternoon: {
        timeRange: '3-5 PM',
        energyType: 'Delegation phase',
        bestFor: [
          'Delegate tasks',
          'Teach and mentor',
          'Review team work',
          'Empower others'
        ],
        avoid: ['Micromanaging', 'Solo work']
      },
      evening: {
        timeRange: '6-8 PM',
        energyType: 'Reflection time',
        bestFor: [
          'Reflect on achievements',
          'Plan tomorrow',
          'Celebrate wins',
          'Rest with dignity'
        ],
        avoid: ['New starts', 'Criticism']
      }
    },
    
    'Moon': {
      morning: {
        timeRange: '6-8 AM',
        energyType: 'Emotional clarity',
        bestFor: [
          'Check in with feelings',
          'Nurturing activities',
          'Self-care routines',
          'Gentle exercise'
        ],
        avoid: ['Harsh decisions', 'Confrontation']
      },
      midday: {
        timeRange: '11 AM-1 PM',
        energyType: 'Empathy peak',
        bestFor: [
          'One-on-one conversations',
          'Emotional support',
          'Counseling sessions',
          'Family matters'
        ],
        avoid: ['Cold logic', 'Aggressive negotiations']
      },
      afternoon: {
        timeRange: '3-5 PM',
        energyType: 'Creative flow',
        bestFor: [
          'Creative writing',
          'Art and music',
          'Intuitive work',
          'Dream interpretation'
        ],
        avoid: ['Analytical tasks', 'Number crunching']
      },
      evening: {
        timeRange: '7-9 PM',
        energyType: 'Deep rest begins',
        bestFor: [
          'Wind down gently',
          'Light reading',
          'Meditation',
          'Early sleep preparation'
        ],
        avoid: ['Stimulation', 'Heavy meals', 'Screens']
      }
    },
    
    'Mars': {
      morning: {
        timeRange: '6-8 AM',
        energyType: 'Peak physical energy',
        bestFor: [
          'Vigorous exercise',
          'Tackle hardest task first',
          'Difficult conversations',
          'Physical challenges'
        ],
        avoid: ['Procrastination', 'Hesitation']
      },
      midday: {
        timeRange: '11 AM-1 PM',
        energyType: 'Combat mode',
        bestFor: [
          'Competitive situations',
          'Negotiations',
          'Push through obstacles',
          'Defend positions'
        ],
        avoid: ['Passive waiting', 'People-pleasing']
      },
      afternoon: {
        timeRange: '2-4 PM',
        energyType: 'Sustained push',
        bestFor: [
          'Complete unfinished tasks',
          'Power through resistance',
          'Athletic training',
          'Assert boundaries'
        ],
        avoid: ['Giving up', 'Overthinking']
      },
      evening: {
        timeRange: '6-8 PM',
        energyType: 'Cool down needed',
        bestFor: [
          'Gentle stretching',
          'Process day\'s battles',
          'Release tension',
          'Forgive conflicts'
        ],
        avoid: ['New fights', 'Revenge planning', 'Alcohol']
      }
    },
    
    'Mercury': {
      morning: {
        timeRange: '7-9 AM',
        energyType: 'Mental sharpness',
        bestFor: [
          'Writing tasks',
          'Study complex topics',
          'Plan communications',
          'Learn new skills'
        ],
        avoid: ['Mindless work', 'Physical-only tasks']
      },
      midday: {
        timeRange: '11 AM-1 PM',
        energyType: 'Communication peak',
        bestFor: [
          'Important calls',
          'Presentations',
          'Teach or explain',
          'Networking'
        ],
        avoid: ['Solo work', 'Silence']
      },
      afternoon: {
        timeRange: '3-5 PM',
        energyType: 'Quick connections',
        bestFor: [
          'Short trips/errands',
          'Email responses',
          'Quick meetings',
          'Social media'
        ],
        avoid: ['Deep focus', 'Long commitments']
      },
      evening: {
        timeRange: '6-8 PM',
        energyType: 'Integration time',
        bestFor: [
          'Review what you learned',
          'Journal insights',
          'Organize notes',
          'Light reading'
        ],
        avoid: ['New information', 'Complex learning']
      }
    },
    
    'Jupiter': {
      morning: {
        timeRange: '8-10 AM',
        energyType: 'Expansion begins',
        bestFor: [
          'Think big picture',
          'Strategic planning',
          'Study philosophy',
          'Set ambitious goals'
        ],
        avoid: ['Small thinking', 'Petty details']
      },
      midday: {
        timeRange: '11 AM-1 PM',
        energyType: 'Opportunity window',
        bestFor: [
          'Seek opportunities',
          'Make connections',
          'Generous acts',
          'Teaching'
        ],
        avoid: ['Stinginess', 'Narrowness']
      },
      afternoon: {
        timeRange: '2-4 PM',
        energyType: 'Growth momentum',
        bestFor: [
          'Expand projects',
          'Take calculated risks',
          'Travel planning',
          'Cultural exploration'
        ],
        avoid: ['Contraction', 'Fear-based decisions']
      },
      evening: {
        timeRange: '6-8 PM',
        energyType: 'Wisdom integration',
        bestFor: [
          'Philosophical reflection',
          'Gratitude practice',
          'Mentor someone',
          'Spiritual study'
        ],
        avoid: ['Materialism', 'Pessimism']
      }
    },
    
    'Venus': {
      morning: {
        timeRange: '7-9 AM',
        energyType: 'Beauty appreciation',
        bestFor: [
          'Self-care rituals',
          'Beautify environment',
          'Artistic creation',
          'Gentle movement'
        ],
        avoid: ['Harsh criticism', 'Ugliness']
      },
      midday: {
        timeRange: '11 AM-1 PM',
        energyType: 'Relationship harmony',
        bestFor: [
          'Romantic gestures',
          'Diplomatic meetings',
          'Collaborative work',
          'Peacemaking'
        ],
        avoid: ['Conflict', 'Criticism', 'Confrontation']
      },
      afternoon: {
        timeRange: '3-5 PM',
        energyType: 'Creative flow',
        bestFor: [
          'Art and music',
          'Design work',
          'Cooking',
          'Fashion/style choices'
        ],
        avoid: ['Analytical work', 'Criticism']
      },
      evening: {
        timeRange: '6-8 PM',
        energyType: 'Pleasure time',
        bestFor: [
          'Enjoy good food',
          'Time with loved ones',
          'Entertainment',
          'Sensory pleasures'
        ],
        avoid: ['Work', 'Stress', 'Discipline']
      }
    },
    
    'Saturn': {
      morning: {
        timeRange: '6-8 AM',
        energyType: 'Discipline peak',
        bestFor: [
          'Difficult tasks first',
          'Build structures',
          'Set boundaries',
          'Focus on responsibilities'
        ],
        avoid: ['Procrastination', 'Play']
      },
      midday: {
        timeRange: '11 AM-1 PM',
        energyType: 'Serious work mode',
        bestFor: [
          'Complex problem-solving',
          'Long-term planning',
          'Quality control',
          'Professional duties'
        ],
        avoid: ['Shortcuts', 'Quick fixes']
      },
      afternoon: {
        timeRange: '2-4 PM',
        energyType: 'Endurance phase',
        bestFor: [
          'Persist through challenges',
          'Detail-oriented work',
          'Administrative tasks',
          'Build foundations'
        ],
        avoid: ['Giving up', 'Seeking easy path']
      },
      evening: {
        timeRange: '6-8 PM',
        energyType: 'Review time',
        bestFor: [
          'Assess progress',
          'Plan improvements',
          'Organize for tomorrow',
          'Solo reflection'
        ],
        avoid: ['Socializing', 'Indulgence']
      }
    }
  };
  
  return sequences[planet];
}

/**
 * Determine Rūḥ phase group (Begin/Build/Complete)
 */
function getRuhPhaseGroup(phase: number): RuhPhaseGroup {
  if (phase >= 1 && phase <= 3) return 'Begin';
  if (phase >= 4 && phase <= 6) return 'Build';
  return 'Complete';
}

/**
 * Calculate harmony type between user and current influences
 */
export function calculateHarmonyType(
  userElement: ElementType,
  userKawkab: Planet,
  userRuh: number,
  dayPlanet: Planet,
  ruhPhase: number
): HarmonyType {
  const elementSupport = PLANET_ELEMENT_SUPPORT[userElement];
  const planetSupportsElement = elementSupport.supportive.includes(dayPlanet);
  const planetOpposesElement = elementSupport.opposing.includes(dayPlanet);
  
  const planetMatch = userKawkab === dayPlanet;
  const planetFriendly = PLANET_FRIENDSHIPS[userKawkab]?.includes(dayPlanet);
  
  const ruhGroup = getRuhPhaseGroup(userRuh);
  const phaseGroup = getRuhPhaseGroup(ruhPhase);
  const ruhAligned = ruhGroup === phaseGroup;
  
  // Complete harmony: planet supports element AND planets align AND ruh aligned
  if (planetSupportsElement && (planetMatch || planetFriendly) && ruhAligned) {
    return 'Complete';
  }
  
  // Conflict: planet opposes element AND no planet harmony AND ruh not aligned
  if (planetOpposesElement && !planetMatch && !planetFriendly && !ruhAligned) {
    return 'Conflict';
  }
  
  // Everything else is Partial
  return 'Partial';
}

/**
 * Determine dominant force in user's profile
 */
export function calculateDominantForce(
  saghir: number,
  element: ElementType,
  kawkab: Planet,
  letterGeometry: string[]
): DominantForce {
  // Heuristic scoring
  let ruhScore = 0;
  let elementScore = 0;
  let kawkabScore = 0;
  
  // Strong Rūḥ: numbers 4, 7, 8 suggest discipline/structure/introspection
  if ([4, 7, 8].includes(saghir)) ruhScore += 2;
  
  // Element score: if geometry is very pronounced
  const geometryCount = letterGeometry.length;
  if (geometryCount >= 3) elementScore += 2;
  
  // Kawkab score: outer planets (Jupiter, Saturn) suggest external timing sensitivity
  if (['Jupiter', 'Saturn'].includes(kawkab)) kawkabScore += 2;
  
  // Personal numbers (1, 5, 9) suggest soul-driven
  if ([1, 5, 9].includes(saghir)) ruhScore += 1;
  
  // Emotional elements (Water) and passionate (Fire) suggest element dominance
  if (['Water', 'Fire'].includes(element)) elementScore += 1;
  
  // Fast planets (Mercury, Moon) suggest timing sensitivity
  if (['Mercury', 'Moon'].includes(kawkab)) kawkabScore += 1;
  
  // Return dominant
  const max = Math.max(ruhScore, elementScore, kawkabScore);
  if (ruhScore === max) return 'Rūḥ';
  if (elementScore === max) return 'Element';
  return 'Kawkab';
}

/**
 * Generate balance tip based on dominant force
 */
export function getBalanceTip(dominant: DominantForce): string {
  const tips = {
    Rūḥ: 'Your inner compass guides you×balance introspection with outer engagement.',
    Element: 'Your temperament leads×balance feelings with mindful structure.',
    Kawkab: 'External timing shapes you×balance receptivity with inner purpose.'
  };
  return tips[dominant];
}

/**
 * Calculate daily harmony score (0-10)
 */
function calculateDailyScore(
  dayPlanet: Planet,
  userElement: ElementType,
  userKawkab: Planet,
  ruhPhase: number,
  userRuh: number
): number {
  let score = 0;
  
  // A) Day planet vs user element (0-3)
  const elementSupport = PLANET_ELEMENT_SUPPORT[userElement];
  if (elementSupport.supportive.includes(dayPlanet)) score += 3;
  else if (elementSupport.opposing.includes(dayPlanet)) score += 0;
  else score += 1;
  
  // B) Day planet vs user Kawkab (0-3)
  if (dayPlanet === userKawkab) score += 3;
  else if (PLANET_FRIENDSHIPS[userKawkab]?.includes(dayPlanet)) score += 2;
  else score += 1;
  
  // C) Rūḥ phase synergy (0-4)
  const phaseGroup = getRuhPhaseGroup(ruhPhase);
  const ruhGroup = getRuhPhaseGroup(userRuh);
  
  if (phaseGroup === 'Begin' && ['Sun', 'Mars', 'Mercury'].includes(dayPlanet)) score += 4;
  else if (phaseGroup === 'Build' && ['Saturn', 'Jupiter', 'Mercury'].includes(dayPlanet)) score += 3;
  else if (phaseGroup === 'Complete' && ['Moon', 'Venus', 'Saturn'].includes(dayPlanet)) score += 3;
  else score += 1;
  
  // Bonus for alignment
  if (phaseGroup === ruhGroup) score += 1;
  
  return Math.min(10, score);
}

/**
 * Get band from score
 */
function getScoreBand(score: number): 'High' | 'Moderate' | 'Low' {
  if (score >= 8) return 'High';
  if (score >= 5) return 'Moderate';
  return 'Low';
}

/**
 * Calculate harmony breakdown for educational tooltips (Lesson 29)
 * Returns detailed breakdown of why harmony is high/low
 */
export function calculateHarmonyBreakdown(
  dayPlanet: Planet,
  userElement: ElementType,
  userKawkab: Planet,
  ruhPhase: number,
  userRuh: number,
  contextLabel: string
): {
  score: number;
  userElement: ElementType;
  contextElement: ElementType;
  contextLabel: string;
  ruhPhase: number;
  connectionType: 'perfect' | 'strong' | 'moderate' | 'weak';
  elementMatch: number;
  planetMatch: number;
  ruhImpact: number;
} {
  // Get planet's element
  const dayElement = getPlanetElement(dayPlanet);
  
  // Element match calculation (40% weight)
  let elementMatchScore = 0;
  if (userElement === dayElement) {
    elementMatchScore = 100; // Perfect - Same element
  } else if (
    (userElement === 'Fire' && dayElement === 'Air') ||
    (userElement === 'Air' && dayElement === 'Fire') ||
    (userElement === 'Water' && dayElement === 'Earth') ||
    (userElement === 'Earth' && dayElement === 'Water')
  ) {
    elementMatchScore = 75; // Strong - Compatible
  } else if (
    (userElement === 'Fire' && dayElement === 'Water') ||
    (userElement === 'Water' && dayElement === 'Fire') ||
    (userElement === 'Air' && dayElement === 'Earth') ||
    (userElement === 'Earth' && dayElement === 'Air')
  ) {
    elementMatchScore = 25; // Weak - Opposing
  } else {
    elementMatchScore = 50; // Moderate - Neutral
  }
  
  // Planet match calculation (35% weight)
  let planetMatchScore = 0;
  if (dayPlanet === userKawkab) {
    planetMatchScore = 100; // Same planet
  } else if (PLANET_FRIENDSHIPS[userKawkab]?.includes(dayPlanet)) {
    planetMatchScore = 75; // Friendly planet
  } else {
    planetMatchScore = 50; // Neutral
  }
  
  // Rūḥ phase impact (25% weight)
  const phaseGroup = getRuhPhaseGroup(ruhPhase);
  const ruhGroup = getRuhPhaseGroup(userRuh);
  let ruhImpactScore = 0;
  
  // Yang phases (1, 3, 5, 7) stronger
  const isYangPhase = [1, 3, 5, 7].includes(ruhPhase);
  
  if (phaseGroup === ruhGroup) {
    ruhImpactScore = isYangPhase ? 100 : 85;
  } else if (phaseGroup === 'Begin' && ['Sun', 'Mars', 'Mercury'].includes(dayPlanet)) {
    ruhImpactScore = 80;
  } else if (phaseGroup === 'Build' && ['Saturn', 'Jupiter', 'Mercury'].includes(dayPlanet)) {
    ruhImpactScore = 75;
  } else if (phaseGroup === 'Complete' && ['Moon', 'Venus', 'Saturn'].includes(dayPlanet)) {
    ruhImpactScore = 75;
  } else {
    ruhImpactScore = 50;
  }
  
  // Overall harmony score (weighted average)
  const overallScore = Math.round(
    (elementMatchScore * 0.4) + (planetMatchScore * 0.35) + (ruhImpactScore * 0.25)
  );
  
  // Determine connection type
  let connectionType: 'perfect' | 'strong' | 'moderate' | 'weak';
  if (overallScore >= 90) connectionType = 'perfect';
  else if (overallScore >= 70) connectionType = 'strong';
  else if (overallScore >= 50) connectionType = 'moderate';
  else connectionType = 'weak';
  
  return {
    score: overallScore,
    userElement,
    contextElement: dayElement,
    contextLabel,
    ruhPhase,
    connectionType,
    elementMatch: elementMatchScore,
    planetMatch: planetMatchScore,
    ruhImpact: ruhImpactScore
  };
}

/**
 * Helper function to get element for a planet
 */
function getPlanetElement(planet: Planet): ElementType {
  const planetElements: Record<Planet, ElementType> = {
    'Sun': 'Fire',
    'Moon': 'Water',
    'Mars': 'Fire',
    'Mercury': 'Air',
    'Jupiter': 'Air',
    'Venus': 'Water',
    'Saturn': 'Earth'
  };
  return planetElements[planet];
}

/**
 * Generate daily tips based on planet-specific energies
 * Each planet gets unique, actionable guidance for daily planning
 */
function generateDailyTips(
  band: 'High' | 'Moderate' | 'Low',
  element: ElementType,
  planet: Planet
): string[] {
  const tips: string[] = [];
  
  // Planet-specific primary guidance (unique for each planet)
  const planetGuidance: Record<Planet, { high: string; moderate: string; low: string }> = {
    Sun: {
      high: 'Excellent for leadership×schedule important meetings and presentations',
      moderate: 'Lead projects and take initiative×high energy for achievements',
      low: 'Challenging for visibility×lead quietly, support others today'
    },
    Moon: {
      high: 'Perfect for reflection×trust your intuition and emotional wisdom',
      moderate: 'Gentle day×plan, review, nurture relationships, avoid overload',
      low: 'Rest needed×minimize commitments, process emotions, be kind to yourself'
    },
    Mars: {
      high: 'Fierce energy×tackle tough challenges and push through obstacles boldly',
      moderate: 'Take action on difficult tasks×courage and determination favored',
      low: 'Channel carefully×physical activity helps, avoid conflicts and rushing'
    },
    Mercury: {
      high: 'Sharp mind×perfect for writing, calls, learning, and travel plans',
      moderate: 'Communicate clearly×good for emails, meetings, and study sessions',
      low: 'Mental fog possible×double-check messages, postpone major decisions'
    },
    Jupiter: {
      high: 'Timing is perfect×make big decisions, start new ventures, expand horizons',
      moderate: 'Growth day×great for planning expansion and seeking opportunities',
      low: 'Temper optimism×research thoroughly before committing to anything big'
    },
    Venus: {
      high: 'Excellent for connection×ideal for relationships, creativity, and beauty',
      moderate: 'Harmonious day×connect with others, enjoy art, balance work-pleasure',
      low: 'Social challenges×focus on self-care, solo creative work, gentle interactions'
    },
    Saturn: {
      high: 'Build strong foundations×organize, plan long-term, establish structures',
      moderate: 'Structure your week×discipline and planning bring good results',
      low: 'Heavy responsibilities×break tasks into small steps, be patient with delays'
    }
  };
  
  // Add primary planet-specific guidance based on harmony score
  tips.push(planetGuidance[planet][band.toLowerCase() as 'high' | 'moderate' | 'low']);
  
  // Element balance tip (shorter, supportive advice)
  const elementTips: Record<ElementType, string> = {
    Fire: 'Balance heat×practice calm speech, charity, time near water',
    Water: 'Activate energy×light exercise, sunlight, decisive action',
    Air: 'Ground yourself×stick to routine, nature walk, one task at a time',
    Earth: 'Add lightness×try creativity, flexibility, or a short change of scenery'
  };
  tips.push(elementTips[element]);
  
  // Planet secondary tip (alternative actionable advice)
  const planetSecondaryTips: Record<Planet, string> = {
    Sun: 'Shine your light×but stay humble and generous with recognition',
    Moon: 'Honor your feelings×they guide you to what truly matters',
    Mars: 'Channel warrior energy×protect boundaries, pursue goals with courage',
    Mercury: 'Mental agility peaks×network, negotiate, adapt quickly',
    Jupiter: 'Seek wisdom and growth×mentor others or learn from teachers',
    Venus: 'Appreciate beauty×create harmony in your environment and relationships',
    Saturn: 'Master discipline×small consistent efforts build lasting success'
  };
  tips.push(planetSecondaryTips[planet]);
  
  return tips;
}

/**
 * Get planet for a given day of week
 */
function getPlanetForDay(date: Date): Planet {
  const dayOfWeek = date.getDay(); // 0 = Sunday
  const planets: Planet[] = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
  return planets[dayOfWeek];
}

/**
 * Get weekday name
 */
function getWeekdayName(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}

/**
 * Get element phase for a day (1-4 cycle)
 */
function getElementPhase(daysSinceAnchor: number): ElementType {
  const phases: ElementType[] = ['Fire', 'Water', 'Air', 'Earth'];
  return phases[daysSinceAnchor % 4];
}

/**
 * Calculate user profile from name and optional birth date
 */
export function calculateUserProfile(
  nameArabic: string,
  birthDate?: Date,
  motherName?: string,
  abjad: Record<string, number> = ABJAD_MAGHRIBI
): UserProfile {
  const destiny = analyzeNameDestiny(nameArabic, abjad);
  
  // Determine element from letters
  const letters = [...nameArabic.replace(/[ًٌٍَُِّْ\s]/g, '')];
  const firstLetter = letters[0];
  const userPlanet = LETTER_PLANETS[firstLetter] || 'Sun';
  
  // Determine element from hadath
  const userElement = hadathToElement(destiny.hadath);
  
  // Letter geometry
  const geometry: string[] = [];
  const verticalLetters = 'الكلىهطظ';
  const roundLetters = 'وقفعصض';
  if (letters.some(l => verticalLetters.includes(l))) geometry.push('vertical');
  if (letters.some(l => roundLetters.includes(l))) geometry.push('round');
  
  const anchor = birthDate ? birthDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
  
  return {
    name_ar: nameArabic,
    kabir: destiny.kabir,
    saghir: destiny.saghir,
    ruh: destiny.saghir,
    element: userElement,
    kawkab: userPlanet,
    letter_geometry: geometry,
    anchor
  };
}

/**
 * Generate daily reading for a specific date
 */
export function generateDailyReading(
  profile: UserProfile,
  date: Date,
  allWeekDays?: DailyReading[] // Optional: for betterDays calculation
): DailyReading {
  const anchorDate = new Date(profile.anchor);
  const daysSinceAnchor = Math.floor((date.getTime() - anchorDate.getTime()) / (1000 * 60 * 60 * 24));
  
  const ruhPhase = (daysSinceAnchor % 9) + 1;
  const elementPhase = getElementPhase(daysSinceAnchor);
  const dayPlanet = getPlanetForDay(date);
  const weekday = getWeekdayName(date);
  
  const score = calculateDailyScore(dayPlanet, profile.element, profile.kawkab, ruhPhase, profile.ruh);
  const band = getScoreBand(score);
  const tips = generateDailyTips(band, profile.element, dayPlanet);
  
  // Rest Signal Detection (Infisāl)
  const isRestDay = score <= 4;
  const restLevel = score <= 1 ? 'deep' : 'gentle';
  const restPractices = isRestDay ? getRestPractices(restLevel, dayPlanet) : undefined;
  const betterDays = (isRestDay && allWeekDays) ? findBetterDays(allWeekDays, score) : undefined;
  
  // Energy Return (Irtiṭāb) - Lesson 25
  const energyReturn = calculateEnergyReturn(dayPlanet);
  
  // Task Sequencer (Niẓām) - Lesson 28 (only for high-harmony days)
  const taskSequence = generateTaskSequence(dayPlanet, elementPhase, score);
  
  return {
    date: date.toISOString().split('T')[0],
    weekday,
    day_planet: dayPlanet,
    ruh_phase: ruhPhase,
    ruh_phase_group: getRuhPhaseGroup(ruhPhase),
    element_phase: elementPhase,
    harmony_score: score,
    band,
    tips,
    isRestDay,
    restLevel: isRestDay ? restLevel : undefined,
    restPractices,
    betterDays,
    energyReturn,
    taskSequence
  };
}

/**
 * Generate weekly summary
 */
export function generateWeeklySummary(
  profile: UserProfile,
  startDate: Date = new Date()
): WeeklySummary {
  const days: DailyReading[] = [];
  
  // First pass: generate all days without betterDays
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    days.push(generateDailyReading(profile, date));
  }
  
  // Second pass: add betterDays for rest days
  for (let i = 0; i < days.length; i++) {
    if (days[i].isRestDay) {
      days[i].betterDays = findBetterDays(days, days[i].harmony_score);
    }
  }
  
  // Find best and gentle days
  let bestDay = days[0];
  let gentleDay = days[0];
  let focusDay = days[0];
  
  days.forEach(day => {
    if (day.harmony_score > bestDay.harmony_score) bestDay = day;
    if (day.harmony_score < gentleDay.harmony_score) gentleDay = day;
    if (['Saturn', 'Mercury'].includes(day.day_planet) && 
        day.harmony_score >= focusDay.harmony_score) {
      focusDay = day;
    }
  });
  
  return {
    days,
    best_day: bestDay.date,
    gentle_day: gentleDay.date,
    focus_day: focusDay.date
  };
}

// ============================================================================
// DAILY COLOR GUIDANCE
// ============================================================================

export type ElementType2 = 'Fire' | 'Water' | 'Air' | 'Earth';

export interface ElementColorMapping {
  primary: string;
  accent: string;
  avoid: string;
}

export const ELEMENT_COLORS: Record<ElementType2, { colors: string[]; hex: string[] }> = {
  Fire: { 
    colors: ['Red', 'Orange', 'Gold'], 
    hex: ['#dc2626', '#f97316', '#fbbf24'] 
  },
  Water: { 
    colors: ['Blue', 'Turquoise', 'Silver'], 
    hex: ['#2563eb', '#14b8a6', '#d1d5db'] 
  },
  Air: { 
    colors: ['Yellow', 'White', 'Light Blue'], 
    hex: ['#fbbf24', '#ffffff', '#93c5fd'] 
  },
  Earth: { 
    colors: ['Green', 'Brown', 'Beige'], 
    hex: ['#22c55e', '#92400e', '#d2b48c'] 
  }
};

/**
 * Determines harmony between two elements
 * Fire harmonizes with Air
 * Water harmonizes with Earth
 * Fire opposes Water
 * Air opposes Earth
 */
function getElementHarmony(userElement: ElementType2, dayElement: ElementType2): 'harmonious' | 'opposing' | 'neutral' {
  if (userElement === dayElement) return 'harmonious';
  
  const harmonies = {
    Fire: { harmonious: ['Air', 'Fire'], opposing: ['Water'] },
    Water: { harmonious: ['Earth', 'Water'], opposing: ['Fire'] },
    Air: { harmonious: ['Fire', 'Air'], opposing: ['Earth'] },
    Earth: { harmonious: ['Water', 'Earth'], opposing: ['Air'] }
  };
  
  const { harmonious, opposing } = harmonies[userElement];
  if (harmonious.includes(dayElement)) return 'harmonious';
  if (opposing.includes(dayElement)) return 'opposing';
  return 'neutral';
}

/**
 * Get complementary element (for accent colors when not harmonious)
 */
function getComplementaryElement(element: ElementType2): ElementType2 {
  const complements: Record<ElementType2, ElementType2> = {
    Fire: 'Air',
    Air: 'Fire',
    Water: 'Earth',
    Earth: 'Water'
  };
  return complements[element];
}

export interface ColorGuidance {
  userElement: ElementType2;
  dayElement: ElementType2;
  harmony: 'harmonious' | 'opposing' | 'neutral';
  primaryColors: { name: string; hex: string }[];
  accentColors: { name: string; hex: string }[];
  avoidColors: { name: string; hex: string }[];
  explanation: string;
  tip: string;
}

/**
 * Calculate daily color guidance based on user element and current day
 */
export function calculateColorGuidance(userElement: ElementType2): ColorGuidance {
  // Get current day's element
  const today = new Date();
  const dayOfWeek = today.getDay();
  const dayElements: ElementType2[] = ['Fire', 'Water', 'Fire', 'Air', 'Water', 'Air', 'Earth'];
  const dayElement = dayElements[dayOfWeek];
  
  const harmony = getElementHarmony(userElement, dayElement);
  
  // Primary colors are always from user's element
  const primaryColorsData = ELEMENT_COLORS[userElement];
  const primaryColors = primaryColorsData.colors.map((name, idx) => ({
    name,
    hex: primaryColorsData.hex[idx]
  }));
  
  // Accent colors depend on harmony
  let accentColors: { name: string; hex: string }[] = [];
  let avoidColors: { name: string; hex: string }[] = [];
  let explanation = '';
  let tip = '';
  
  if (harmony === 'harmonious') {
    // Use day's element for accent
    const dayColorsData = ELEMENT_COLORS[dayElement];
    accentColors = dayColorsData.colors.map((name, idx) => ({
      name,
      hex: dayColorsData.hex[idx]
    }));
    
    const dayNames = { Fire: 'Fire', Water: 'Water', Air: 'Air', Earth: 'Earth' };
    explanation = `Your ${userElement} element harmonizes beautifully with today\'s ${dayElement} energy.`;
    
    const tips: Record<ElementType2, Record<ElementType2, string>> = {
      Fire: {
        Fire: 'Wear red, orange, or gold to amplify today\'s fiery energy.',
        Air: 'Combine red and yellow - a red shirt with golden accessories works great.',
        Water: '',
        Earth: ''
      },
      Water: {
        Water: 'Wear blue, turquoise, or silver to deepen today\'s flow.',
        Earth: 'Pair blue with green or brown - turquoise accents on earth tones.',
        Fire: '',
        Air: ''
      },
      Air: {
        Air: 'Wear yellow, white, or light blue for clarity and lightness.',
        Fire: 'Combine yellow with red - light colors with warm touches.',
        Water: '',
        Earth: ''
      },
      Earth: {
        Earth: 'Wear green, brown, or beige to ground today\'s energy.',
        Water: 'Pair green with blue - earthy tones with water accents.',
        Fire: '',
        Air: ''
      }
    };
    
    tip = tips[userElement][dayElement] || 'Blend your colors with today\'s element for enhanced harmony.';
  } else if (harmony === 'opposing') {
    // Avoid day's element, suggest complementary instead
    const dayColorsData = ELEMENT_COLORS[dayElement];
    avoidColors = dayColorsData.colors.map((name, idx) => ({
      name,
      hex: dayColorsData.hex[idx]
    }));
    
    const complementary = getComplementaryElement(userElement);
    const complimentaryColorsData = ELEMENT_COLORS[complementary];
    accentColors = complimentaryColorsData.colors.map((name, idx) => ({
      name,
      hex: complimentaryColorsData.hex[idx]
    }));
    
    explanation = `Today's ${dayElement} energy may challenge your ${userElement} nature. Wear your element colors for balance.`;
    tip = `Stick with your ${userElement} tones. If you need variety, add ${complementary.toLowerCase()} accents to stay grounded.`;
  } else {
    // Neutral - just stick with user's element
    explanation = `Today's ${dayElement} energy is neutral to your ${userElement} nature. Your element colors remain your best choice.`;
    tip = `Wear your favorite ${userElement.toLowerCase()} colors today – they'll serve you well.`;
  }
  
  return {
    userElement,
    dayElement,
    harmony,
    primaryColors,
    accentColors,
    avoidColors,
    explanation,
    tip
  };
}

// ============================================================================
// DAILY COLOR GUIDANCE (FULL DAY DOMINANT ELEMENT)
// ============================================================================

export type HarmonyLevel = 'excellent' | 'good' | 'neutral' | 'challenging';

export interface DailyColorGuidance {
  date: string;
  userElement: ElementType2;
  dayRulerElement: ElementType2;
  mostActiveElement: ElementType2;
  dailyDominantElement: ElementType2;
  harmonyScore: number;
  harmonyLevel: HarmonyLevel;
  primaryColor: { name: string; hex: string };
  secondaryColor: { name: string; hex: string };
  accentColor: { name: string; hex: string };
  avoidColors: { name: string; hex: string }[];
  energyMessage: string;
  practicalTips: string[];
  bestEnergyTimes: string[];
  harmonyBreakdown: string;
}

const DAILY_PLANET_RULERS: Record<number, { planet: string; element: ElementType2 }> = {
  0: { planet: 'Sun', element: 'Fire' },      // Sunday
  1: { planet: 'Moon', element: 'Water' },    // Monday
  2: { planet: 'Mars', element: 'Fire' },     // Tuesday
  3: { planet: 'Mercury', element: 'Air' },   // Wednesday
  4: { planet: 'Jupiter', element: 'Water' }, // Thursday
  5: { planet: 'Venus', element: 'Earth' },   // Friday
  6: { planet: 'Saturn', element: 'Earth' }   // Saturday
};

const PLANET_TO_ELEMENT: Record<string, ElementType2> = {
  'Sun': 'Fire',
  'Moon': 'Water',
  'Mars': 'Fire',
  'Mercury': 'Air',
  'Jupiter': 'Water',
  'Venus': 'Earth',
  'Saturn': 'Earth'
};

/**
 * Count planetary hours by element for a given day
 * Each day has 12 daylight and 12 night hours = 24 total
 */
function countElementHours(dayOfWeek: number): Record<ElementType2, number> {
  const counts: Record<ElementType2, number> = { Fire: 0, Water: 0, Air: 0, Earth: 0 };
  
  // Planetary hours sequence: Sun, Venus, Mercury, Moon, Saturn, Jupiter, Mars (repeats)
  const sequence: ElementType2[] = ['Fire', 'Earth', 'Air', 'Water', 'Earth', 'Water', 'Fire'];
  
  // Count 24 hours (12 day + 12 night, same sequence)
  for (let i = 0; i < 24; i++) {
    const planetIndex = i % 7;
    const element = sequence[planetIndex];
    counts[element]++;
  }
  
  return counts;
}

/**
 * Get the most active element for the day
 */
function getMostActiveElement(dayOfWeek: number): ElementType2 {
  const counts = countElementHours(dayOfWeek);
  let maxCount = 0;
  let mostActive: ElementType2 = 'Earth';
  
  for (const [element, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxCount = count;
      mostActive = element as ElementType2;
    }
  }
  
  return mostActive;
}

/**
 * Calculate daily dominant element: combination of day ruler + most active
 */
function calculateDailyDominantElement(dayOfWeek: number): {
  ruler: ElementType2;
  mostActive: ElementType2;
  dominant: ElementType2;
} {
  const ruler = DAILY_PLANET_RULERS[dayOfWeek].element;
  const mostActive = getMostActiveElement(dayOfWeek);
  
  // Dominant = ruler (primary influence)
  // Most active acts as secondary support
  const dominant = ruler;
  
  return { ruler, mostActive, dominant };
}

/**
 * Calculate harmony score between user and daily dominant elements
 */
function calculateHarmonyScore(userElement: ElementType2, dailyElement: ElementType2): { score: number; level: HarmonyLevel } {
  if (userElement === dailyElement) {
    return { score: 90, level: 'good' };
  }
  
  // Harmonious pairs: Fire+Air, Water+Earth
  const harmonious = [
    ['Fire', 'Air'],
    ['Air', 'Fire'],
    ['Water', 'Earth'],
    ['Earth', 'Water']
  ];
  
  if (harmonious.some(pair => pair[0] === userElement && pair[1] === dailyElement)) {
    return { score: 100, level: 'excellent' };
  }
  
  // Neutral pairs: Fire+Earth, Water+Air
  const neutral = [
    ['Fire', 'Earth'],
    ['Earth', 'Fire'],
    ['Water', 'Air'],
    ['Air', 'Water']
  ];
  
  if (neutral.some(pair => pair[0] === userElement && pair[1] === dailyElement)) {
    return { score: 70, level: 'neutral' };
  }
  
  // Opposing: Fire+Water, Air+Earth
  return { score: 40, level: 'challenging' };
}

const COLOR_PALETTES: Record<ElementType2, { primary: { name: string; hex: string }; secondary: { name: string; hex: string }; accent: { name: string; hex: string } }> = {
  Fire: {
    primary: { name: 'Crimson Red', hex: '#DC143C' },
    secondary: { name: 'Orange', hex: '#FF4500' },
    accent: { name: 'Gold', hex: '#FFD700' }
  },
  Water: {
    primary: { name: 'Dodger Blue', hex: '#1E90FF' },
    secondary: { name: 'Royal Blue', hex: '#4169E1' },
    accent: { name: 'Turquoise', hex: '#40E0D0' }
  },
  Air: {
    primary: { name: 'Gold Yellow', hex: '#FFD700' },
    secondary: { name: 'Khaki', hex: '#F0E68C' },
    accent: { name: 'Lemon', hex: '#FFFACD' }
  },
  Earth: {
    primary: { name: 'Forest Green', hex: '#228B22' },
    secondary: { name: 'Saddle Brown', hex: '#8B4513' },
    accent: { name: 'Tan', hex: '#D2B48C' }
  }
};

const NEUTRAL_PALETTE = {
  primary: { name: 'Burlywood', hex: '#8B7355' },
  secondary: { name: 'Light Grey', hex: '#D3D3D3' },
  accent: { name: 'Beige', hex: '#F5F5DC' }
};

/**
 * Generate color recommendations based on harmony score
 */
function generateColorRecommendations(
  userElement: ElementType2,
  dailyElement: ElementType2,
  score: number
): { primary: { name: string; hex: string }; secondary: { name: string; hex: string }; accent: { name: string; hex: string }; avoid: { name: string; hex: string }[] } {
  
  if (score >= 80) {
    // Good day: user colors + daily accent
    return {
      primary: COLOR_PALETTES[userElement].primary,
      secondary: COLOR_PALETTES[userElement].secondary,
      accent: COLOR_PALETTES[dailyElement].accent,
      avoid: []
    };
  } else if (score >= 60) {
    // Neutral day: user colors + neutral accents
    return {
      primary: COLOR_PALETTES[userElement].primary,
      secondary: NEUTRAL_PALETTE.secondary,
      accent: NEUTRAL_PALETTE.accent,
      avoid: []
    };
  } else {
    // Challenging day: ground with earth tones + touch of user
    const opposingElement = userElement === 'Fire' ? 'Water' :
                           userElement === 'Water' ? 'Fire' :
                           userElement === 'Air' ? 'Earth' : 'Air';
    
    return {
      primary: NEUTRAL_PALETTE.primary,
      secondary: COLOR_PALETTES['Earth'].secondary,
      accent: COLOR_PALETTES[userElement].accent,
      avoid: [COLOR_PALETTES[opposingElement].primary]
    };
  }
}

/**
 * Generate energy message based on score
 */
function generateEnergyMessage(score: number, userElement: ElementType2, dailyElement: ElementType2): string {
  if (score >= 80) {
    return `Your ${userElement} nature and today's ${dailyElement} energy understand each other well. It's a good day for you.`;
  } else if (score >= 60) {
    return `Your ${userElement} nature is getting along with today's ${dailyElement} energy. Keep yourself balanced and calm.`;
  } else {
    return `Today's ${dailyElement} energy is different from your ${userElement} nature. Stay grounded and centered.`;
  }
}

/**
 * Generate practical tips based on colors and harmony level
 */
function generatePracticalTips(userElement: ElementType2, dailyElement: ElementType2, score: number): string[] {
  if (score >= 80) {
    const tips: Record<ElementType2, Record<ElementType2, string[]>> = {
      Fire: {
        Fire: ['Wear reds and oranges - bright and bold', 'Add gold jewelry or accessories', 'You\'ll feel extra energized today'],
        Air: ['Red or orange shirt, gold accents', 'Mix warm and light colors together', 'Great day for meetings and new things'],
        Water: [],
        Earth: []
      },
      Water: {
        Fire: [],
        Air: [],
        Water: ['Wear blues or turquoise today', 'Silver jewelry would be nice', 'Calming colors for a smooth day'],
        Earth: ['Blue top with green or brown bottom', 'Mix blue with earth colors', 'Peaceful and grounded feeling']
      },
      Air: {
        Fire: ['Yellow or orange combinations', 'Wear gold or warm colors', 'Energetic and clear-headed day'],
        Air: ['Bright yellows and golds work well', 'Light and airy colors', 'Perfect for thinking and talking'],
        Water: [],
        Earth: []
      },
      Earth: {
        Fire: [],
        Air: [],
        Water: ['Green with some blue touches', 'Brown and turquoise together', 'Calm and flowing energy'],
        Earth: ['Greens and browns are your friends', 'Add some tan or beige', 'Strong, grounded, natural']
      }
    };
    
    return tips[userElement]?.[dailyElement] || ['Wear colors that make you happy', 'You\'ll feel good today'];
  } else if (score >= 60) {
    return [
      'Stick with your favorite colors - your natural choice',
      'Add grey or beige if you need to feel more calm',
      'Simple, neutral colors work best',
      'Don\'t wear too much bright color today'
    ];
  } else {
    return [
      'Wear earth colors - brown, green, or beige',
      'Add just a touch of your favorite color for strength',
      'Keep colors simple and natural today',
      'Wear natural fabrics like cotton if you can',
      'The color of the earth will help steady you'
    ];
  }
}

/**
 * Generate best energy times for the day
 */
function generateBestEnergyTimes(dayOfWeek: number): string[] {
  const ruler = DAILY_PLANET_RULERS[dayOfWeek];
  
  const times: Record<string, string[]> = {
    'Sun': ['Morning (5-7 AM): Best time', 'Around noon: Strong', 'Evening: Getting weaker'],
    'Moon': ['Evening (6-9 PM): Best time', 'Late night: Strong', 'Morning: Weaker'],
    'Mars': ['Morning (5-7 AM): Best time', 'Afternoon (2-4 PM): Good', 'Evening: Okay'],
    'Mercury': ['Early morning (4-6 AM): Best', 'Mid-morning (10 AM): Good', 'Afternoon: Okay'],
    'Jupiter': ['Morning (5-7 AM): Best', 'Around noon: Strong', 'Evening (6-8 PM): Good'],
    'Venus': ['Early morning: Okay', 'Afternoon (3-5 PM): Best', 'Evening: Strong'],
    'Saturn': ['Before sunrise (3-5 AM): Best', 'Evening (5-7 PM): Good', 'Night: Okay']
  };
  
  return times[ruler.planet] || ['Morning: Good', 'Afternoon: Strong', 'Evening: Moderate'];
}

/**
 * Calculate daily color guidance for the entire day
 */
export function calculateDailyColorGuidance(userElement: ElementType2): DailyColorGuidance {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const dateStr = now.toISOString().split('T')[0];
  
  // Step 1-3: Get daily dominant element
  const { ruler, mostActive, dominant } = calculateDailyDominantElement(dayOfWeek);
  
  // Step 4: Calculate harmony
  const { score, level } = calculateHarmonyScore(userElement, dominant);
  
  // Generate colors
  const colors = generateColorRecommendations(userElement, dominant, score);
  
  // Generate messages and tips
  const energyMessage = generateEnergyMessage(score, userElement, dominant);
  const practicalTips = generatePracticalTips(userElement, dominant, score);
  const bestEnergyTimes = generateBestEnergyTimes(dayOfWeek);
  
  // Breakdown explanation
  const harmonyBreakdown = `Day Ruler: ${ruler} | Most Active: ${mostActive} | Dominant: ${dominant} | Harmony: ${score}%`;
  
  return {
    date: dateStr,
    userElement,
    dayRulerElement: ruler,
    mostActiveElement: mostActive,
    dailyDominantElement: dominant,
    harmonyScore: score,
    harmonyLevel: level,
    primaryColor: colors.primary,
    secondaryColor: colors.secondary,
    accentColor: colors.accent,
    avoidColors: colors.avoid,
    energyMessage,
    practicalTips,
    bestEnergyTimes,
    harmonyBreakdown
  };
}
