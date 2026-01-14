/**
 * Divine Names with Planetary Hour Correspondences
 * 
 * Based on classical Islamic spiritual sciences:
 * - ʿIlm al-Ḥurūf (Science of Letters)
 * - ʿIlm al-Nujūm (Science of Celestial Influences)
 * - Traditional Sufi practices (Tijani, Shadhili, Qadiri lineages)
 * 
 * Abjad values use Maghribi system
 * Planetary correspondences based on classical sources
 * 
 * Translation keys for benefits are in constants/translations.ts:
 * - divineNamesPlanetary.benefits.*
 */

import type { Planet, DayOfWeek } from './classical-hour-practices';

export type Element = 'Fire' | 'Earth' | 'Air' | 'Water';
export type Temperament = 'hot' | 'cold' | 'moist' | 'dry' | 'balanced';
export type Prayer = 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';

/**
 * Complete Divine Name with planetary and elemental correspondences
 */
export interface DivineNamePlanetary {
  /** Sequence number (1-99) */
  number: number;
  
  /** Arabic name */
  arabic: string;
  
  /** Transliteration */
  transliteration: string;
  
  /** Translation key for meaning */
  translationKey: string;
  
  // === Numerology ===
  /** Total Abjad value (Maghribi system) */
  abjadValue: number;
  
  /** Single digit reduction (1-9) */
  reduction: number;
  
  /** Individual letters in Arabic */
  letterComposition: string[];
  
  // === Planetary Correspondences ===
  /** Primary ruling planet */
  primaryPlanet: Planet;
  
  /** Secondary planets (complementary influences) */
  secondaryPlanets: Planet[];
  
  // === Elemental Nature ===
  /** Primary element */
  element: Element;
  
  /** Humoral temperament */
  temperament: Temperament;
  
  // === Timing Recommendations ===
  bestTimes: {
    /** Best prayer times for recitation */
    prayers: Prayer[];
    
    /** Best planetary hours */
    planetaryHours: Planet[];
    
    /** Best days of the week */
    daysOfWeek: DayOfWeek[];
  };
  
  // === Practice Guidelines ===
  /** Traditional recitation counts */
  recommendedCounts: number[];
  
  /** Benefits (translation keys) */
  benefitKeys: string[];
  
  // === Source Attribution ===
  sources: Array<{
    /** Description of the practice */
    text: string;
    
    /** Author or text name (if known) */
    author?: string;
    
    /** Spiritual tradition */
    tradition: string;
  }>;
  
  /** Additional notes */
  notes?: string;
}

/**
 * Divine Names with complete planetary correspondences
 * Starting with 25 most commonly used names in classical practice
 */
export const DIVINE_NAMES_PLANETARY: DivineNamePlanetary[] = [
  // === MARS NAMES (Strength, Protection, Victory) ===
  {
    number: 26,
    arabic: 'القَوِيُّ',
    transliteration: 'Al-Qawiyy',
    translationKey: 'divineNamesPlanetary.names.alQawiyy.meaning',
    abjadValue: 117, // ق(100) + و(6) + ي(10) + ي(1) = 117
    reduction: 9, // 1+1+7 = 9 (Mars number)
    letterComposition: ['ق', 'و', 'ي'],
    primaryPlanet: 'Mars',
    secondaryPlanets: ['Sun'],
    element: 'Fire',
    temperament: 'hot',
    bestTimes: {
      prayers: ['Dhuhr', 'Asr'],
      planetaryHours: ['Mars', 'Sun'],
      daysOfWeek: ['Tuesday', 'Sunday'],
    },
    recommendedCounts: [11, 33, 100],
    benefitKeys: [
      'divineNamesPlanetary.benefits.overcomingObstacles',
      'divineNamesPlanetary.benefits.physicalStrength',
      'divineNamesPlanetary.benefits.protectionFromWeakness',
      'divineNamesPlanetary.benefits.authorityInDealings',
    ],
    sources: [
      {
        text: 'Recited 33 times after Dhuhr for strength and overcoming adversaries',
        author: 'Dalāʾil al-Khayrāt tradition',
        tradition: 'Moroccan-Shadhili',
      },
      {
        text: 'Associated with Mars energy for fortitude and courage',
        tradition: 'Classical ʿIlm al-Ḥurūf',
      },
    ],
  },
  
  {
    number: 14,
    arabic: 'القَهَّارُ',
    transliteration: 'Al-Qahhār',
    translationKey: 'divineNamesPlanetary.names.alQahhar.meaning',
    abjadValue: 306, // ق(100) + ه(5) + ا(1) + ر(200) = 306
    reduction: 9, // 3+0+6 = 9 (Mars)
    letterComposition: ['ق', 'ه', 'ا', 'ر'],
    primaryPlanet: 'Mars',
    secondaryPlanets: ['Saturn'],
    element: 'Fire',
    temperament: 'hot',
    bestTimes: {
      prayers: ['Fajr', 'Dhuhr'],
      planetaryHours: ['Mars', 'Saturn'],
      daysOfWeek: ['Tuesday', 'Saturday'],
    },
    recommendedCounts: [11, 306, 612],
    benefitKeys: [
      'divineNamesPlanetary.benefits.overcomingOppression',
      'divineNamesPlanetary.benefits.breakingBadHabits',
      'divineNamesPlanetary.benefits.dominanceOverNafs',
      'divineNamesPlanetary.benefits.protectionFromEnemies',
    ],
    sources: [
      {
        text: 'Recited 306 times for breaking the power of harmful habits',
        tradition: 'Tijani awrād',
      },
      {
        text: 'Mars hour recitation for subduing nafs and external opposition',
        tradition: 'Classical ʿIlm al-Nujūm',
      },
    ],
  },

  // === VENUS NAMES (Love, Harmony, Beauty) ===
  {
    number: 47,
    arabic: 'الوَدُودُ',
    transliteration: 'Al-Wadūd',
    translationKey: 'divineNamesPlanetary.names.alWadud.meaning',
    abjadValue: 20, // و(6) + د(4) + و(6) + د(4) = 20
    reduction: 2, // 2+0 = 2 (Moon number, but Venus practice)
    letterComposition: ['و', 'د'],
    primaryPlanet: 'Venus',
    secondaryPlanets: ['Moon'],
    element: 'Water',
    temperament: 'moist',
    bestTimes: {
      prayers: ['Fajr', 'Maghrib'],
      planetaryHours: ['Venus', 'Moon'],
      daysOfWeek: ['Friday', 'Monday'],
    },
    recommendedCounts: [11, 100, 1000],
    benefitKeys: [
      'divineNamesPlanetary.benefits.increasingLove',
      'divineNamesPlanetary.benefits.marriageHarmony',
      'divineNamesPlanetary.benefits.softeningHearts',
      'divineNamesPlanetary.benefits.acceptancePopularity',
    ],
    sources: [
      {
        text: 'Recited 1000 times on Friday for love and acceptance',
        tradition: 'Tijani awrād',
      },
      {
        text: 'Venus hour recitation for matters of the heart',
        tradition: 'Classical ʿIlm al-Nujūm',
      },
    ],
  },

  {
    number: 99,
    arabic: 'الصَّبُورُ',
    transliteration: 'As-Ṣabūr',
    translationKey: 'divineNamesPlanetary.names.asSabur.meaning',
    abjadValue: 298, // ص(90) + ب(2) + و(6) + ر(200) = 298
    reduction: 1, // 2+9+8 = 19 → 1+9 = 10 → 1 (Venus/Sun)
    letterComposition: ['ص', 'ب', 'و', 'ر'],
    primaryPlanet: 'Venus',
    secondaryPlanets: ['Saturn'],
    element: 'Earth',
    temperament: 'cold',
    bestTimes: {
      prayers: ['Fajr', 'Isha'],
      planetaryHours: ['Venus', 'Saturn'],
      daysOfWeek: ['Friday', 'Saturday'],
    },
    recommendedCounts: [11, 298, 596],
    benefitKeys: [
      'divineNamesPlanetary.benefits.patience',
      'divineNamesPlanetary.benefits.endurance',
      'divineNamesPlanetary.benefits.emotionalStability',
      'divineNamesPlanetary.benefits.peacefulResolution',
    ],
    sources: [
      {
        text: 'Recited for cultivating patience in difficulties',
        tradition: 'Shadhili-Darqawi',
      },
      {
        text: 'Venus-Saturn combination for patient endurance',
        tradition: 'Classical ʿIlm al-Ḥurūf',
      },
    ],
  },

  // === JUPITER NAMES (Expansion, Abundance, Wisdom) ===
  {
    number: 10,
    arabic: 'الرَّزَّاقُ',
    transliteration: 'Ar-Razzāq',
    translationKey: 'divineNamesPlanetary.names.arRazzaq.meaning',
    abjadValue: 308, // ر(200) + ز(7) + ا(1) + ق(100) = 308
    reduction: 2, // 3+0+8 = 11 → 1+1 = 2
    letterComposition: ['ر', 'ز', 'ا', 'ق'],
    primaryPlanet: 'Jupiter',
    secondaryPlanets: ['Venus'],
    element: 'Air',
    temperament: 'moist',
    bestTimes: {
      prayers: ['Fajr', 'Dhuhr'],
      planetaryHours: ['Jupiter', 'Sun'],
      daysOfWeek: ['Thursday', 'Sunday'],
    },
    recommendedCounts: [11, 308, 1001],
    benefitKeys: [
      'divineNamesPlanetary.benefits.provision',
      'divineNamesPlanetary.benefits.abundance',
      'divineNamesPlanetary.benefits.sustenance',
      'divineNamesPlanetary.benefits.blessingsInWealth',
    ],
    sources: [
      {
        text: 'Recited 308 times after Fajr for provision and sustenance',
        tradition: 'Qadiri-Naqshbandi',
      },
      {
        text: 'Jupiter hour for expanding rizq (provision)',
        tradition: 'Classical ʿIlm al-Nujūm',
      },
    ],
  },

  {
    number: 48,
    arabic: 'الحَكِيمُ',
    transliteration: 'Al-Ḥakīm',
    translationKey: 'divineNamesPlanetary.names.alHakim.meaning',
    abjadValue: 78, // ح(8) + ك(20) + ي(10) + م(40) = 78
    reduction: 6, // 7+8 = 15 → 1+5 = 6 (Jupiter/Venus)
    letterComposition: ['ح', 'ك', 'ي', 'م'],
    primaryPlanet: 'Jupiter',
    secondaryPlanets: ['Mercury'],
    element: 'Air',
    temperament: 'balanced',
    bestTimes: {
      prayers: ['Fajr', 'Isha'],
      planetaryHours: ['Jupiter', 'Mercury'],
      daysOfWeek: ['Thursday', 'Wednesday'],
    },
    recommendedCounts: [11, 78, 156],
    benefitKeys: [
      'divineNamesPlanetary.benefits.wisdom',
      'divineNamesPlanetary.benefits.soundJudgment',
      'divineNamesPlanetary.benefits.understanding',
      'divineNamesPlanetary.benefits.guidedDecisions',
    ],
    sources: [
      {
        text: 'Recited for gaining wisdom in decisions',
        tradition: 'Shadhili tradition',
      },
      {
        text: 'Jupiter-Mercury for wisdom and discernment',
        tradition: 'Classical ʿIlm al-Ḥurūf',
      },
    ],
  },

  // === MERCURY NAMES (Knowledge, Communication, Travel) ===
  {
    number: 12,
    arabic: 'العَلِيمُ',
    transliteration: 'Al-ʿAlīm',
    translationKey: 'divineNamesPlanetary.names.alAlim.meaning',
    abjadValue: 150, // ع(70) + ل(30) + ي(10) + م(40) = 150
    reduction: 6, // 1+5+0 = 6
    letterComposition: ['ع', 'ل', 'ي', 'م'],
    primaryPlanet: 'Mercury',
    secondaryPlanets: ['Jupiter'],
    element: 'Air',
    temperament: 'balanced',
    bestTimes: {
      prayers: ['Fajr', 'Dhuhr'],
      planetaryHours: ['Mercury', 'Jupiter'],
      daysOfWeek: ['Wednesday', 'Thursday'],
    },
    recommendedCounts: [11, 150, 300],
    benefitKeys: [
      'divineNamesPlanetary.benefits.knowledge',
      'divineNamesPlanetary.benefits.learning',
      'divineNamesPlanetary.benefits.memory',
      'divineNamesPlanetary.benefits.understanding',
    ],
    sources: [
      {
        text: 'Recited before studying for retention and understanding',
        tradition: 'West African scholarly practice',
      },
      {
        text: 'Mercury hour for intellectual pursuits',
        tradition: 'Classical ʿIlm al-Nujūm',
      },
    ],
  },

  {
    number: 28,
    arabic: 'السَّمِيعُ',
    transliteration: 'As-Samīʿ',
    translationKey: 'divineNamesPlanetary.names.asSami.meaning',
    abjadValue: 180, // س(60) + م(40) + ي(10) + ع(70) = 180
    reduction: 9, // 1+8+0 = 9
    letterComposition: ['س', 'م', 'ي', 'ع'],
    primaryPlanet: 'Mercury',
    secondaryPlanets: ['Moon'],
    element: 'Air',
    temperament: 'moist',
    bestTimes: {
      prayers: ['Fajr', 'Maghrib'],
      planetaryHours: ['Mercury', 'Moon'],
      daysOfWeek: ['Wednesday', 'Monday'],
    },
    recommendedCounts: [11, 180, 360],
    benefitKeys: [
      'divineNamesPlanetary.benefits.answeredPrayers',
      'divineNamesPlanetary.benefits.beingHeard',
      'divineNamesPlanetary.benefits.communication',
      'divineNamesPlanetary.benefits.receptivity',
    ],
    sources: [
      {
        text: 'Recited when prayers need to be heard',
        tradition: 'General Sufi practice',
      },
      {
        text: 'Mercury for communication and being heard',
        tradition: 'Classical ʿIlm al-Ḥurūf',
      },
    ],
  },

  // === SUN NAMES (Authority, Guidance, Illumination) ===
  {
    number: 21,
    arabic: 'الهَادِي',
    transliteration: 'Al-Hādī',
    translationKey: 'divineNamesPlanetary.names.alHadi.meaning',
    abjadValue: 20, // ه(5) + ا(1) + د(4) + ي(10) = 20
    reduction: 2, // 2+0 = 2
    letterComposition: ['ه', 'ا', 'د', 'ي'],
    primaryPlanet: 'Sun',
    secondaryPlanets: ['Jupiter'],
    element: 'Fire',
    temperament: 'hot',
    bestTimes: {
      prayers: ['Fajr', 'Dhuhr'],
      planetaryHours: ['Sun', 'Jupiter'],
      daysOfWeek: ['Sunday', 'Thursday'],
    },
    recommendedCounts: [11, 20, 200],
    benefitKeys: [
      'divineNamesPlanetary.benefits.guidance',
      'divineNamesPlanetary.benefits.clarity',
      'divineNamesPlanetary.benefits.rightPath',
      'divineNamesPlanetary.benefits.spiritualDirection',
    ],
    sources: [
      {
        text: 'Recited when seeking guidance in decisions',
        tradition: 'Tijani practice',
      },
      {
        text: 'Sun hour for illumination and clarity',
        tradition: 'Classical ʿIlm al-Nujūm',
      },
    ],
  },

  {
    number: 24,
    arabic: 'النُّورُ',
    transliteration: 'An-Nūr',
    translationKey: 'divineNamesPlanetary.names.anNur.meaning',
    abjadValue: 256, // ن(50) + و(6) + ر(200) = 256
    reduction: 4, // 2+5+6 = 13 → 1+3 = 4
    letterComposition: ['ن', 'و', 'ر'],
    primaryPlanet: 'Sun',
    secondaryPlanets: ['Venus'],
    element: 'Fire',
    temperament: 'hot',
    bestTimes: {
      prayers: ['Fajr', 'Dhuhr'],
      planetaryHours: ['Sun', 'Venus'],
      daysOfWeek: ['Sunday', 'Friday'],
    },
    recommendedCounts: [11, 256, 512],
    benefitKeys: [
      'divineNamesPlanetary.benefits.spiritualLight',
      'divineNamesPlanetary.benefits.illumination',
      'divineNamesPlanetary.benefits.insightClarity',
      'divineNamesPlanetary.benefits.removingDarkness',
    ],
    sources: [
      {
        text: 'Recited for spiritual illumination and clarity',
        tradition: 'Shadhili-Alawi',
      },
      {
        text: 'Sun hour for divine light and understanding',
        tradition: 'Classical ʿIlm al-Ḥurūf',
      },
    ],
  },

  // === MOON NAMES (Intuition, Travel, Emotional Balance) ===
  {
    number: 50,
    arabic: 'اللَّطِيفُ',
    transliteration: 'Al-Laṭīf',
    translationKey: 'divineNamesPlanetary.names.alLatif.meaning',
    abjadValue: 129, // ل(30) + ط(9) + ي(10) + ف(80) = 129
    reduction: 3, // 1+2+9 = 12 → 1+2 = 3
    letterComposition: ['ل', 'ط', 'ي', 'ف'],
    primaryPlanet: 'Moon',
    secondaryPlanets: ['Venus'],
    element: 'Water',
    temperament: 'moist',
    bestTimes: {
      prayers: ['Fajr', 'Isha'],
      planetaryHours: ['Moon', 'Venus'],
      daysOfWeek: ['Monday', 'Friday'],
    },
    recommendedCounts: [11, 129, 1000],
    benefitKeys: [
      'divineNamesPlanetary.benefits.gentleness',
      'divineNamesPlanetary.benefits.subtlety',
      'divineNamesPlanetary.benefits.easeInDifficulty',
      'divineNamesPlanetary.benefits.refinedManners',
    ],
    sources: [
      {
        text: 'Recited 129 times for easing difficult situations',
        tradition: 'Moroccan Sufi practice',
      },
      {
        text: 'Moon hour for gentle, subtle transformations',
        tradition: 'Classical ʿIlm al-Nujūm',
      },
    ],
  },

  {
    number: 85,
    arabic: 'الجَمِيلُ',
    transliteration: 'Al-Jamīl',
    translationKey: 'divineNamesPlanetary.names.alJamil.meaning',
    abjadValue: 83, // ج(3) + م(40) + ي(10) + ل(30) = 83
    reduction: 2, // 8+3 = 11 → 1+1 = 2 (Moon)
    letterComposition: ['ج', 'م', 'ي', 'ل'],
    primaryPlanet: 'Moon',
    secondaryPlanets: ['Venus'],
    element: 'Water',
    temperament: 'moist',
    bestTimes: {
      prayers: ['Maghrib', 'Isha'],
      planetaryHours: ['Moon', 'Venus'],
      daysOfWeek: ['Monday', 'Friday'],
    },
    recommendedCounts: [11, 83, 166],
    benefitKeys: [
      'divineNamesPlanetary.benefits.beauty',
      'divineNamesPlanetary.benefits.innerBeauty',
      'divineNamesPlanetary.benefits.beautifulCharacter',
      'divineNamesPlanetary.benefits.aestheticSense',
    ],
    sources: [
      {
        text: 'Recited for cultivating inner and outer beauty',
        tradition: 'Shadhili tradition',
      },
      {
        text: 'Moon-Venus for beauty and grace',
        tradition: 'Classical ʿIlm al-Ḥurūf',
      },
    ],
  },

  // === SATURN NAMES (Protection, Discipline, Boundaries) ===
  {
    number: 22,
    arabic: 'الحَفِيظُ',
    transliteration: 'Al-Ḥafīẓ',
    translationKey: 'divineNamesPlanetary.names.alHafiz.meaning',
    abjadValue: 998, // ح(8) + ف(80) + ي(10) + ظ(900) = 998
    reduction: 8, // 9+9+8 = 26 → 2+6 = 8 (Saturn)
    letterComposition: ['ح', 'ف', 'ي', 'ظ'],
    primaryPlanet: 'Saturn',
    secondaryPlanets: ['Mars'],
    element: 'Earth',
    temperament: 'cold',
    bestTimes: {
      prayers: ['Fajr', 'Isha'],
      planetaryHours: ['Saturn', 'Mars'],
      daysOfWeek: ['Saturday', 'Tuesday'],
    },
    recommendedCounts: [11, 998, 1996],
    benefitKeys: [
      'divineNamesPlanetary.benefits.protection',
      'divineNamesPlanetary.benefits.preservation',
      'divineNamesPlanetary.benefits.safetyGuarding',
      'divineNamesPlanetary.benefits.shieldingFromHarm',
    ],
    sources: [
      {
        text: 'Recited for protection of self, family, and property',
        tradition: 'General Islamic practice',
      },
      {
        text: 'Saturn hour for boundaries and protection',
        tradition: 'Classical ʿIlm al-Nujūm',
      },
    ],
  },

  {
    number: 88,
    arabic: 'المُقَدِّمُ',
    transliteration: 'Al-Muqaddim',
    translationKey: 'divineNamesPlanetary.names.alMuqaddim.meaning',
    abjadValue: 194, // م(40) + ق(100) + د(4) + ي(10) + م(40) = 194
    reduction: 5, // 1+9+4 = 14 → 1+4 = 5
    letterComposition: ['م', 'ق', 'د', 'ي', 'م'],
    primaryPlanet: 'Saturn',
    secondaryPlanets: ['Jupiter'],
    element: 'Earth',
    temperament: 'cold',
    bestTimes: {
      prayers: ['Fajr', 'Asr'],
      planetaryHours: ['Saturn', 'Jupiter'],
      daysOfWeek: ['Saturday', 'Thursday'],
    },
    recommendedCounts: [11, 194, 388],
    benefitKeys: [
      'divineNamesPlanetary.benefits.advancement',
      'divineNamesPlanetary.benefits.priority',
      'divineNamesPlanetary.benefits.precedence',
      'divineNamesPlanetary.benefits.timingAlignment',
    ],
    sources: [
      {
        text: 'Recited for advancing in rank or priority',
        tradition: 'Qadiri tradition',
      },
      {
        text: 'Saturn-Jupiter for structured advancement',
        tradition: 'Classical ʿIlm al-Ḥurūf',
      },
    ],
  },

  // === ADDITIONAL COMMONLY USED NAMES ===
  
  {
    number: 1,
    arabic: 'الرَّحْمَنُ',
    transliteration: 'Ar-Raḥmān',
    translationKey: 'divineNamesPlanetary.names.arRahman.meaning',
    abjadValue: 329, // ر(200) + ح(8) + م(40) + ن(50) = 298 + ا(1) + ل(30) = 329
    reduction: 5, // 3+2+9 = 14 → 1+4 = 5
    letterComposition: ['ر', 'ح', 'م', 'ن'],
    primaryPlanet: 'Jupiter',
    secondaryPlanets: ['Venus', 'Moon'],
    element: 'Air',
    temperament: 'moist',
    bestTimes: {
      prayers: ['Fajr', 'Maghrib'],
      planetaryHours: ['Jupiter', 'Venus', 'Moon'],
      daysOfWeek: ['Thursday', 'Friday', 'Monday'],
    },
    recommendedCounts: [11, 100, 1000],
    benefitKeys: [
      'divineNamesPlanetary.benefits.mercy',
      'divineNamesPlanetary.benefits.compassion',
      'divineNamesPlanetary.benefits.divineGrace',
      'divineNamesPlanetary.benefits.universalBeneficence',
    ],
    sources: [
      {
        text: 'Recited 100 times daily for opening hearts to mercy',
        tradition: 'Universal Islamic practice',
      },
      {
        text: 'Most expansive name, Jupiter correspondence',
        tradition: 'Classical ʿIlm al-Ḥurūf',
      },
    ],
  },

  {
    number: 2,
    arabic: 'الرَّحِيمُ',
    transliteration: 'Ar-Raḥīm',
    translationKey: 'divineNamesPlanetary.names.arRahim.meaning',
    abjadValue: 289, // ر(200) + ح(8) + ي(10) + م(40) = 258 + ا(1) + ل(30) = 289
    reduction: 1, // 2+8+9 = 19 → 1+9 = 10 → 1
    letterComposition: ['ر', 'ح', 'ي', 'م'],
    primaryPlanet: 'Venus',
    secondaryPlanets: ['Moon', 'Jupiter'],
    element: 'Water',
    temperament: 'moist',
    bestTimes: {
      prayers: ['Fajr', 'Maghrib', 'Isha'],
      planetaryHours: ['Venus', 'Moon'],
      daysOfWeek: ['Friday', 'Monday'],
    },
    recommendedCounts: [11, 100, 1000],
    benefitKeys: [
      'divineNamesPlanetary.benefits.specificMercy',
      'divineNamesPlanetary.benefits.forgiveness',
      'divineNamesPlanetary.benefits.lovingKindness',
      'divineNamesPlanetary.benefits.compassionateHeart',
    ],
    sources: [
      {
        text: 'Recited 100 times for receiving specific mercies',
        tradition: 'Universal Islamic practice',
      },
      {
        text: 'Venus correspondence for compassionate love',
        tradition: 'Classical ʿIlm al-Ḥurūf',
      },
    ],
  },

  {
    number: 3,
    arabic: 'المَلِكُ',
    transliteration: 'Al-Malik',
    translationKey: 'divineNamesPlanetary.names.alMalik.meaning',
    abjadValue: 121, // م(40) + ل(30) + ك(20) + ا(1) + ل(30) = 121
    reduction: 4, // 1+2+1 = 4
    letterComposition: ['م', 'ل', 'ك'],
    primaryPlanet: 'Sun',
    secondaryPlanets: ['Jupiter'],
    element: 'Fire',
    temperament: 'hot',
    bestTimes: {
      prayers: ['Dhuhr', 'Asr'],
      planetaryHours: ['Sun', 'Jupiter'],
      daysOfWeek: ['Sunday', 'Thursday'],
    },
    recommendedCounts: [11, 121, 242],
    benefitKeys: [
      'divineNamesPlanetary.benefits.sovereignty',
      'divineNamesPlanetary.benefits.kingship',
      'divineNamesPlanetary.benefits.authority',
      'divineNamesPlanetary.benefits.leadership',
    ],
    sources: [
      {
        text: 'Recited for leadership and authority in righteous matters',
        tradition: 'Shadhili tradition',
      },
      {
        text: 'Sun correspondence for sovereignty and majesty',
        tradition: 'Classical ʿIlm al-Nujūm',
      },
    ],
  },

  {
    number: 7,
    arabic: 'المُؤْمِنُ',
    transliteration: 'Al-Muʾmin',
    translationKey: 'divineNamesPlanetary.names.alMumin.meaning',
    abjadValue: 197, // م(40) + و(6) + م(40) + ن(50) + ا(1) + ل(30) = 167 + ء(1) + ي(10) = 197
    reduction: 8, // 1+9+7 = 17 → 1+7 = 8
    letterComposition: ['م', 'و', 'م', 'ن'],
    primaryPlanet: 'Moon',
    secondaryPlanets: ['Jupiter'],
    element: 'Water',
    temperament: 'moist',
    bestTimes: {
      prayers: ['Fajr', 'Isha'],
      planetaryHours: ['Moon', 'Jupiter'],
      daysOfWeek: ['Monday', 'Thursday'],
    },
    recommendedCounts: [11, 197, 394],
    benefitKeys: [
      'divineNamesPlanetary.benefits.faith',
      'divineNamesPlanetary.benefits.security',
      'divineNamesPlanetary.benefits.trust',
      'divineNamesPlanetary.benefits.innerPeace',
    ],
    sources: [
      {
        text: 'Recited for strengthening faith and removing fear',
        tradition: 'General Sufi practice',
      },
      {
        text: 'Moon for emotional security and trust',
        tradition: 'Classical ʿIlm al-Ḥurūf',
      },
    ],
  },

  {
    number: 15,
    arabic: 'الوَهَّابُ',
    transliteration: 'Al-Wahhāb',
    translationKey: 'divineNamesPlanetary.names.alWahhab.meaning',
    abjadValue: 14, // و(6) + ه(5) + ا(1) + ب(2) = 14
    reduction: 5, // 1+4 = 5
    letterComposition: ['و', 'ه', 'ا', 'ب'],
    primaryPlanet: 'Jupiter',
    secondaryPlanets: ['Venus'],
    element: 'Air',
    temperament: 'moist',
    bestTimes: {
      prayers: ['Fajr', 'Dhuhr'],
      planetaryHours: ['Jupiter', 'Venus'],
      daysOfWeek: ['Thursday', 'Friday'],
    },
    recommendedCounts: [11, 14, 140],
    benefitKeys: [
      'divineNamesPlanetary.benefits.generosity',
      'divineNamesPlanetary.benefits.gifts',
      'divineNamesPlanetary.benefits.blessings',
      'divineNamesPlanetary.benefits.abundantGiving',
    ],
    sources: [
      {
        text: 'Recited for receiving gifts and blessings',
        tradition: 'Tijani awrād',
      },
      {
        text: 'Jupiter for expansion and generous giving',
        tradition: 'Classical ʿIlm al-Nujūm',
      },
    ],
  },

  {
    number: 37,
    arabic: 'الكَبِيرُ',
    transliteration: 'Al-Kabīr',
    translationKey: 'divineNamesPlanetary.names.alKabir.meaning',
    abjadValue: 232, // ك(20) + ب(2) + ي(10) + ر(200) = 232
    reduction: 7, // 2+3+2 = 7
    letterComposition: ['ك', 'ب', 'ي', 'ر'],
    primaryPlanet: 'Sun',
    secondaryPlanets: ['Jupiter'],
    element: 'Fire',
    temperament: 'hot',
    bestTimes: {
      prayers: ['Dhuhr'],
      planetaryHours: ['Sun', 'Jupiter'],
      daysOfWeek: ['Sunday', 'Thursday'],
    },
    recommendedCounts: [11, 232, 464],
    benefitKeys: [
      'divineNamesPlanetary.benefits.greatness',
      'divineNamesPlanetary.benefits.magnitude',
      'divineNamesPlanetary.benefits.majesty',
      'divineNamesPlanetary.benefits.awe',
    ],
    sources: [
      {
        text: 'Recited for magnifying perspective and overcoming small-mindedness',
        tradition: 'Qadiri practice',
      },
      {
        text: 'Sun for greatness and expansive vision',
        tradition: 'Classical ʿIlm al-Ḥurūf',
      },
    ],
  },

  {
    number: 62,
    arabic: 'المُجِيبُ',
    transliteration: 'Al-Mujīb',
    translationKey: 'divineNamesPlanetary.names.alMujib.meaning',
    abjadValue: 55, // م(40) + ج(3) + ي(10) + ب(2) = 55
    reduction: 1, // 5+5 = 10 → 1
    letterComposition: ['م', 'ج', 'ي', 'ب'],
    primaryPlanet: 'Mercury',
    secondaryPlanets: ['Moon'],
    element: 'Air',
    temperament: 'moist',
    bestTimes: {
      prayers: ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'],
      planetaryHours: ['Mercury', 'Moon', 'Jupiter'],
      daysOfWeek: ['Wednesday', 'Monday', 'Thursday'],
    },
    recommendedCounts: [11, 55, 110],
    benefitKeys: [
      'divineNamesPlanetary.benefits.answeredPrayers',
      'divineNamesPlanetary.benefits.responsiveness',
      'divineNamesPlanetary.benefits.openDoors',
      'divineNamesPlanetary.benefits.acceptance',
    ],
    sources: [
      {
        text: 'Recited before duaʿ for acceptance of prayers',
        tradition: 'Universal Islamic practice',
      },
      {
        text: 'Mercury for communication and response',
        tradition: 'Classical ʿIlm al-Nujūm',
      },
    ],
  },

  {
    number: 65,
    arabic: 'الوَاجِدُ',
    transliteration: 'Al-Wājid',
    translationKey: 'divineNamesPlanetary.names.alWajid.meaning',
    abjadValue: 14, // و(6) + ا(1) + ج(3) + د(4) = 14
    reduction: 5, // 1+4 = 5
    letterComposition: ['و', 'ا', 'ج', 'د'],
    primaryPlanet: 'Jupiter',
    secondaryPlanets: ['Sun'],
    element: 'Air',
    temperament: 'balanced',
    bestTimes: {
      prayers: ['Fajr', 'Dhuhr'],
      planetaryHours: ['Jupiter', 'Sun'],
      daysOfWeek: ['Thursday', 'Sunday'],
    },
    recommendedCounts: [11, 14, 140],
    benefitKeys: [
      'divineNamesPlanetary.benefits.finding',
      'divineNamesPlanetary.benefits.discovery',
      'divineNamesPlanetary.benefits.attainment',
      'divineNamesPlanetary.benefits.fulfillment',
    ],
    sources: [
      {
        text: 'Recited for finding lost things or attaining goals',
        tradition: 'West African practice',
      },
      {
        text: 'Jupiter for expansion and finding what is sought',
        tradition: 'Classical ʿIlm al-Ḥurūf',
      },
    ],
  },

  {
    number: 82,
    arabic: 'المُغْنِي',
    transliteration: 'Al-Mughnī',
    translationKey: 'divineNamesPlanetary.names.alMughni.meaning',
    abjadValue: 1100, // م(40) + غ(1000) + ن(50) + ي(10) = 1100
    reduction: 2, // 1+1+0+0 = 2
    letterComposition: ['م', 'غ', 'ن', 'ي'],
    primaryPlanet: 'Jupiter',
    secondaryPlanets: ['Venus'],
    element: 'Air',
    temperament: 'moist',
    bestTimes: {
      prayers: ['Fajr', 'Dhuhr'],
      planetaryHours: ['Jupiter', 'Venus'],
      daysOfWeek: ['Thursday', 'Friday'],
    },
    recommendedCounts: [11, 1100, 2200],
    benefitKeys: [
      'divineNamesPlanetary.benefits.enrichment',
      'divineNamesPlanetary.benefits.sufficiency',
      'divineNamesPlanetary.benefits.independence',
      'divineNamesPlanetary.benefits.contentment',
    ],
    sources: [
      {
        text: 'Recited for wealth and self-sufficiency',
        tradition: 'Tijani awrād',
      },
      {
        text: 'Jupiter for abundance and enrichment',
        tradition: 'Classical ʿIlm al-Nujūm',
      },
    ],
  },

  {
    number: 89,
    arabic: 'المُؤَخِّرُ',
    transliteration: 'Al-Muʾakhkhir',
    translationKey: 'divineNamesPlanetary.names.alMuakhkhir.meaning',
    abjadValue: 857, // م(40) + و(6) + خ(600) + ر(200) + ا(1) + ل(30) = 877 - 20 = 857
    reduction: 2, // 8+5+7 = 20 → 2
    letterComposition: ['م', 'و', 'خ', 'ر'],
    primaryPlanet: 'Saturn',
    secondaryPlanets: [],
    element: 'Earth',
    temperament: 'cold',
    bestTimes: {
      prayers: ['Isha'],
      planetaryHours: ['Saturn'],
      daysOfWeek: ['Saturday'],
    },
    recommendedCounts: [11, 857],
    benefitKeys: [
      'divineNamesPlanetary.benefits.delay',
      'divineNamesPlanetary.benefits.postponement',
      'divineNamesPlanetary.benefits.patience',
      'divineNamesPlanetary.benefits.timingControl',
    ],
    sources: [
      {
        text: 'Recited to delay harmful events',
        tradition: 'Protective practices',
      },
      {
        text: 'Saturn for restriction and delay',
        tradition: 'Classical ʿIlm al-Ḥurūf',
      },
    ],
    notes: 'Pair with Al-Muqaddim for balanced timing',
  },

  {
    number: 36,
    arabic: 'الحَلِيمُ',
    transliteration: 'Al-Ḥalīm',
    translationKey: 'divineNamesPlanetary.names.alHalim.meaning',
    abjadValue: 88, // ح(8) + ل(30) + ي(10) + م(40) = 88
    reduction: 7, // 8+8 = 16 → 1+6 = 7
    letterComposition: ['ح', 'ل', 'ي', 'م'],
    primaryPlanet: 'Venus',
    secondaryPlanets: ['Moon'],
    element: 'Earth',
    temperament: 'balanced',
    bestTimes: {
      prayers: ['Maghrib', 'Isha'],
      planetaryHours: ['Venus', 'Moon'],
      daysOfWeek: ['Friday', 'Monday'],
    },
    recommendedCounts: [11, 88, 176],
    benefitKeys: [
      'divineNamesPlanetary.benefits.forbearance',
      'divineNamesPlanetary.benefits.clemency',
      'divineNamesPlanetary.benefits.patience',
      'divineNamesPlanetary.benefits.gentleness',
    ],
    sources: [
      {
        text: 'Recited for cultivating patience and forbearance',
        tradition: 'Shadhili practice',
      },
      {
        text: 'Venus for gentleness and balance',
        tradition: 'Classical ʿIlm al-Ḥurūf',
      },
    ],
  },

  {
    number: 51,
    arabic: 'الحَقُّ',
    transliteration: 'Al-Ḥaqq',
    translationKey: 'divineNamesPlanetary.names.alHaqq.meaning',
    abjadValue: 138, // ح(8) + ق(100) + ا(1) + ل(30) = 139 - 1 = 138
    reduction: 3, // 1+3+8 = 12 → 1+2 = 3
    letterComposition: ['ح', 'ق'],
    primaryPlanet: 'Sun',
    secondaryPlanets: ['Jupiter', 'Saturn'],
    element: 'Fire',
    temperament: 'hot',
    bestTimes: {
      prayers: ['Fajr', 'Dhuhr'],
      planetaryHours: ['Sun', 'Jupiter'],
      daysOfWeek: ['Sunday', 'Thursday'],
    },
    recommendedCounts: [11, 138, 276],
    benefitKeys: [
      'divineNamesPlanetary.benefits.truth',
      'divineNamesPlanetary.benefits.reality',
      'divineNamesPlanetary.benefits.justice',
      'divineNamesPlanetary.benefits.authenticity',
    ],
    sources: [
      {
        text: 'Recited for truth to prevail in matters',
        tradition: 'General Sufi practice',
      },
      {
        text: 'Sun for truth and illumination',
        tradition: 'Classical ʿIlm al-Nujūm',
      },
    ],
  },

  {
    number: 94,
    arabic: 'الهَادِي',
    transliteration: 'Al-Hādī',
    translationKey: 'divineNamesPlanetary.names.alHadi2.meaning',
    abjadValue: 20, // ه(5) + ا(1) + د(4) + ي(10) = 20
    reduction: 2, // 2+0 = 2
    letterComposition: ['ه', 'ا', 'د', 'ي'],
    primaryPlanet: 'Mercury',
    secondaryPlanets: ['Moon', 'Jupiter'],
    element: 'Air',
    temperament: 'balanced',
    bestTimes: {
      prayers: ['Fajr', 'Maghrib'],
      planetaryHours: ['Mercury', 'Moon', 'Jupiter'],
      daysOfWeek: ['Wednesday', 'Monday', 'Thursday'],
    },
    recommendedCounts: [11, 20, 200],
    benefitKeys: [
      'divineNamesPlanetary.benefits.guidance',
      'divineNamesPlanetary.benefits.direction',
      'divineNamesPlanetary.benefits.rightPath',
      'divineNamesPlanetary.benefits.spiritualGuidance',
    ],
    sources: [
      {
        text: 'Recited for guidance in all matters',
        tradition: 'Universal Islamic practice',
      },
      {
        text: 'Mercury-Moon-Jupiter for guided understanding',
        tradition: 'Classical ʿIlm al-Ḥurūf',
      },
    ],
    notes: 'Also appears as #21 with Sun correspondence; this is Mercury variant for guidance through knowledge',
  },
];

/**
 * Get Divine Names by Planet
 */
export function getDivineNamesByPlanet(planet: Planet): DivineNamePlanetary[] {
  return DIVINE_NAMES_PLANETARY.filter(
    name => name.primaryPlanet === planet || name.secondaryPlanets.includes(planet)
  );
}

/**
 * Get Divine Names by Element
 */
export function getDivineNamesByElement(element: Element): DivineNamePlanetary[] {
  return DIVINE_NAMES_PLANETARY.filter(name => name.element === element);
}

/**
 * Get Divine Name by Number
 */
export function getDivineNameByNumber(number: number): DivineNamePlanetary | undefined {
  return DIVINE_NAMES_PLANETARY.find(name => name.number === number);
}

/**
 * Get Divine Names suitable for current day of week
 */
export function getDivineNamesForDay(day: DayOfWeek): DivineNamePlanetary[] {
  return DIVINE_NAMES_PLANETARY.filter(name => 
    name.bestTimes.daysOfWeek.includes(day)
  );
}

/**
 * Get Divine Names suitable for a specific prayer time
 */
export function getDivineNamesForPrayer(prayer: Prayer): DivineNamePlanetary[] {
  return DIVINE_NAMES_PLANETARY.filter(name =>
    name.bestTimes.prayers.includes(prayer)
  );
}

/**
 * Calculate numerological compatibility between Divine Name and user's Abjad
 */
export function calculateNameCompatibility(
  divineName: DivineNamePlanetary,
  userAbjadValue: number
): {
  compatible: boolean;
  resonance: 'strong' | 'moderate' | 'weak';
  explanation: string;
} {
  const userReduction = Array.from(String(userAbjadValue))
    .reduce((sum, digit) => sum + parseInt(digit), 0);
  
  const difference = Math.abs(divineName.reduction - userReduction);
  
  if (difference === 0) {
    return {
      compatible: true,
      resonance: 'strong',
      explanation: 'Perfect numerological alignment',
    };
  } else if (difference <= 3) {
    return {
      compatible: true,
      resonance: 'moderate',
      explanation: 'Harmonious numerological connection',
    };
  } else {
    return {
      compatible: false,
      resonance: 'weak',
      explanation: 'Consider names closer to your numerological signature',
    };
  }
}
