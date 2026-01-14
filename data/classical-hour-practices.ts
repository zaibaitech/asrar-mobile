/**
 * Classical Planetary Hour Practices
 * 
 * Based on West African Maghribi tradition of planetary hour practices.
 * Each day has 12 hours, each ruled by a specific planet with recommended
 * and discouraged works according to classical texts.
 * 
 * Translation keys are stored in constants/translations.ts under:
 * - prayerGuidance.planets.*
 * - prayerGuidance.works.*
 * - prayerGuidance.days.*
 * - prayerGuidance.hours.*
 */

export type DayOfWeek = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
export type Planet = 'Sun' | 'Moon' | 'Mars' | 'Mercury' | 'Jupiter' | 'Venus' | 'Saturn';
export type HourNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

/**
 * Represents a specific work/practice that can be performed during a planetary hour
 */
export interface ClassicalWork {
  /** Unique identifier for translation key lookup */
  id: string;
  /** Translation key for work name */
  nameKey: string;
  /** Translation key for work description */
  descriptionKey?: string;
}

/**
 * Classical hour practice from traditional sources
 */
export interface ClassicalHourPractice {
  /** Day of the week */
  day: DayOfWeek;
  
  /** Hour number (1-12) */
  hourNumber: HourNumber;
  
  /** Ruling planet for this hour */
  planet: Planet;
  
  /** Works recommended during this hour */
  recommendedWorks: ClassicalWork[];
  
  /** Works to avoid during this hour */
  avoidWorks: ClassicalWork[];
  
  /** Original Arabic text from classical source */
  arabicText: string;
  
  /** Source attribution */
  source: {
    /** Title of the source text */
    title: string;
    /** Tradition/school (e.g., "West African Maghribi") */
    tradition: string;
    /** Page reference if available */
    page?: string;
  };
  
  /** Additional notes or context */
  notes?: string;
}

/**
 * Sunday Planetary Hours - Complete 12-hour cycle
 * Based on classical West African Maghribi tradition
 */
export const sundayHourPractices: ClassicalHourPractice[] = [
  // Hour 1: Sun
  {
    day: 'Sunday',
    hourNumber: 1,
    planet: 'Sun',
    recommendedWorks: [
      {
        id: 'talismans_seals',
        nameKey: 'prayerGuidance.works.talismansSeals.name',
        descriptionKey: 'prayerGuidance.works.talismansSeals.description',
      },
      {
        id: 'reversal_work',
        nameKey: 'prayerGuidance.works.reversalWork.name',
        descriptionKey: 'prayerGuidance.works.reversalWork.description',
      },
      {
        id: 'al_maski',
        nameKey: 'prayerGuidance.works.alMaski.name',
        descriptionKey: 'prayerGuidance.works.alMaski.description',
      },
      {
        id: 'hindu_binding',
        nameKey: 'prayerGuidance.works.hinduBinding.name',
        descriptionKey: 'prayerGuidance.works.hinduBinding.description',
      },
      {
        id: 'burnt_wool_ink',
        nameKey: 'prayerGuidance.works.burntWoolInk.name',
        descriptionKey: 'prayerGuidance.works.burntWoolInk.description',
      },
    ],
    avoidWorks: [],
    arabicText: 'الساعة الاولى منه للشمس وفيها يتم العمل في اعمال السليحة والميجة السالمة والرادين والمسكي والقبض الهندي ومداد الصوف المحروق',
    source: {
      title: 'Classical Planetary Hours Practice',
      tradition: 'West African Maghribi',
    },
  },
  
  // Hour 2: Venus
  {
    day: 'Sunday',
    hourNumber: 2,
    planet: 'Venus',
    recommendedWorks: [
      {
        id: 'correctness_sweetness',
        nameKey: 'prayerGuidance.works.correctnessSweetness.name',
        descriptionKey: 'prayerGuidance.works.correctnessSweetness.description',
      },
      {
        id: 'dominance_rulers',
        nameKey: 'prayerGuidance.works.dominanceRulers.name',
        descriptionKey: 'prayerGuidance.works.dominanceRulers.description',
      },
      {
        id: 'works_judges',
        nameKey: 'prayerGuidance.works.worksJudges.name',
        descriptionKey: 'prayerGuidance.works.worksJudges.description',
      },
    ],
    avoidWorks: [],
    arabicText: 'الساعة الثانية تتبع لكوكب الزهرة وهي تعمل في جلب الحبيب وامور التهييج والمحبة',
    source: {
      title: 'Classical Planetary Hours Practice',
      tradition: 'West African Maghribi',
    },
  },
  
  // Hour 3: Mercury
  {
    day: 'Sunday',
    hourNumber: 3,
    planet: 'Mercury',
    recommendedWorks: [
      {
        id: 'learning_study',
        nameKey: 'prayerGuidance.works.learningStudy.name',
        descriptionKey: 'prayerGuidance.works.learningStudy.description',
      },
      {
        id: 'communication',
        nameKey: 'prayerGuidance.works.communication.name',
        descriptionKey: 'prayerGuidance.works.communication.description',
      },
      {
        id: 'trade_commerce',
        nameKey: 'prayerGuidance.works.tradeCommerce.name',
        descriptionKey: 'prayerGuidance.works.tradeCommerce.description',
      },
    ],
    avoidWorks: [],
    arabicText: 'الساعة الثالثة لكوكب عطارد وفيها اعمال العلم والتعلم والتجارة والحساب',
    source: {
      title: 'Classical Planetary Hours Practice',
      tradition: 'West African Maghribi',
    },
  },
  
  // Hour 4: Moon
  {
    day: 'Sunday',
    hourNumber: 4,
    planet: 'Moon',
    recommendedWorks: [
      {
        id: 'journeys_travel',
        nameKey: 'prayerGuidance.works.journeysTravel.name',
        descriptionKey: 'prayerGuidance.works.journeysTravel.description',
      },
      {
        id: 'water_works',
        nameKey: 'prayerGuidance.works.waterWorks.name',
        descriptionKey: 'prayerGuidance.works.waterWorks.description',
      },
      {
        id: 'emotional_matters',
        nameKey: 'prayerGuidance.works.emotionalMatters.name',
        descriptionKey: 'prayerGuidance.works.emotionalMatters.description',
      },
    ],
    avoidWorks: [],
    arabicText: 'الساعة الرابعة للقمر وفيها اعمال السفر والماء والامور العاطفية',
    source: {
      title: 'Classical Planetary Hours Practice',
      tradition: 'West African Maghribi',
    },
  },
  
  // Hour 5: Saturn
  {
    day: 'Sunday',
    hourNumber: 5,
    planet: 'Saturn',
    recommendedWorks: [
      {
        id: 'binding_restriction',
        nameKey: 'prayerGuidance.works.bindingRestriction.name',
        descriptionKey: 'prayerGuidance.works.bindingRestriction.description',
      },
      {
        id: 'protection_work',
        nameKey: 'prayerGuidance.works.protectionWork.name',
        descriptionKey: 'prayerGuidance.works.protectionWork.description',
      },
    ],
    avoidWorks: [
      {
        id: 'marriage_matters',
        nameKey: 'prayerGuidance.works.marriageMatters.name',
        descriptionKey: 'prayerGuidance.works.marriageMatters.description',
      },
      {
        id: 'joyful_works',
        nameKey: 'prayerGuidance.works.joyfulWorks.name',
        descriptionKey: 'prayerGuidance.works.joyfulWorks.description',
      },
    ],
    arabicText: 'الساعة الخامسة لزحل وفيها اعمال القبض والحبس ولا يعمل فيها امور الزواج والفرح',
    source: {
      title: 'Classical Planetary Hours Practice',
      tradition: 'West African Maghribi',
    },
  },
  
  // Hour 6: Jupiter
  {
    day: 'Sunday',
    hourNumber: 6,
    planet: 'Jupiter',
    recommendedWorks: [
      {
        id: 'seeking_favor',
        nameKey: 'prayerGuidance.works.seekingFavor.name',
        descriptionKey: 'prayerGuidance.works.seekingFavor.description',
      },
      {
        id: 'wealth_expansion',
        nameKey: 'prayerGuidance.works.wealthExpansion.name',
        descriptionKey: 'prayerGuidance.works.wealthExpansion.description',
      },
      {
        id: 'religious_matters',
        nameKey: 'prayerGuidance.works.religiousMatters.name',
        descriptionKey: 'prayerGuidance.works.religiousMatters.description',
      },
    ],
    avoidWorks: [],
    arabicText: 'الساعة السادسة للمشتري وفيها طلب الحوائج والرزق والامور الدينية',
    source: {
      title: 'Classical Planetary Hours Practice',
      tradition: 'West African Maghribi',
    },
  },
  
  // Hour 7: Mars
  {
    day: 'Sunday',
    hourNumber: 7,
    planet: 'Mars',
    recommendedWorks: [
      {
        id: 'courage_strength',
        nameKey: 'prayerGuidance.works.courageStrength.name',
        descriptionKey: 'prayerGuidance.works.courageStrength.description',
      },
      {
        id: 'conflict_resolution',
        nameKey: 'prayerGuidance.works.conflictResolution.name',
        descriptionKey: 'prayerGuidance.works.conflictResolution.description',
      },
    ],
    avoidWorks: [
      {
        id: 'peaceful_negotiations',
        nameKey: 'prayerGuidance.works.peacefulNegotiations.name',
        descriptionKey: 'prayerGuidance.works.peacefulNegotiations.description',
      },
    ],
    arabicText: 'الساعة السابعة للمريخ وفيها اعمال القوة والشجاعة ولا يعمل فيها الصلح',
    source: {
      title: 'Classical Planetary Hours Practice',
      tradition: 'West African Maghribi',
    },
  },
  
  // Hour 8: Sun (returns)
  {
    day: 'Sunday',
    hourNumber: 8,
    planet: 'Sun',
    recommendedWorks: [
      {
        id: 'authority_leadership',
        nameKey: 'prayerGuidance.works.authorityLeadership.name',
        descriptionKey: 'prayerGuidance.works.authorityLeadership.description',
      },
      {
        id: 'honors_recognition',
        nameKey: 'prayerGuidance.works.honorsRecognition.name',
        descriptionKey: 'prayerGuidance.works.honorsRecognition.description',
      },
    ],
    avoidWorks: [],
    arabicText: 'الساعة الثامنة للشمس وفيها اعمال السلطة والشرف والتكريم',
    source: {
      title: 'Classical Planetary Hours Practice',
      tradition: 'West African Maghribi',
    },
  },
  
  // Hour 9: Venus (returns)
  {
    day: 'Sunday',
    hourNumber: 9,
    planet: 'Venus',
    recommendedWorks: [
      {
        id: 'love_attraction',
        nameKey: 'prayerGuidance.works.loveAttraction.name',
        descriptionKey: 'prayerGuidance.works.loveAttraction.description',
      },
      {
        id: 'beauty_arts',
        nameKey: 'prayerGuidance.works.beautyArts.name',
        descriptionKey: 'prayerGuidance.works.beautyArts.description',
      },
      {
        id: 'harmony_peace',
        nameKey: 'prayerGuidance.works.harmonyPeace.name',
        descriptionKey: 'prayerGuidance.works.harmonyPeace.description',
      },
    ],
    avoidWorks: [],
    arabicText: 'الساعة التاسعة للزهرة وفيها اعمال المحبة والجمال والفنون',
    source: {
      title: 'Classical Planetary Hours Practice',
      tradition: 'West African Maghribi',
    },
  },
  
  // Hour 10: Mercury (returns)
  {
    day: 'Sunday',
    hourNumber: 10,
    planet: 'Mercury',
    recommendedWorks: [
      {
        id: 'writing_documentation',
        nameKey: 'prayerGuidance.works.writingDocumentation.name',
        descriptionKey: 'prayerGuidance.works.writingDocumentation.description',
      },
      {
        id: 'contracts_agreements',
        nameKey: 'prayerGuidance.works.contractsAgreements.name',
        descriptionKey: 'prayerGuidance.works.contractsAgreements.description',
      },
      {
        id: 'intellectual_pursuits',
        nameKey: 'prayerGuidance.works.intellectualPursuits.name',
        descriptionKey: 'prayerGuidance.works.intellectualPursuits.description',
      },
    ],
    avoidWorks: [],
    arabicText: 'الساعة العاشرة لعطارد وفيها اعمال الكتابة والعقود والفكر',
    source: {
      title: 'Classical Planetary Hours Practice',
      tradition: 'West African Maghribi',
    },
  },
  
  // Hour 11: Moon (returns)
  {
    day: 'Sunday',
    hourNumber: 11,
    planet: 'Moon',
    recommendedWorks: [
      {
        id: 'dreams_visions',
        nameKey: 'prayerGuidance.works.dreamsVisions.name',
        descriptionKey: 'prayerGuidance.works.dreamsVisions.description',
      },
      {
        id: 'intuition_work',
        nameKey: 'prayerGuidance.works.intuitionWork.name',
        descriptionKey: 'prayerGuidance.works.intuitionWork.description',
      },
      {
        id: 'feminine_matters',
        nameKey: 'prayerGuidance.works.feminineMatters.name',
        descriptionKey: 'prayerGuidance.works.feminineMatters.description',
      },
    ],
    avoidWorks: [],
    arabicText: 'الساعة الحادية عشر للقمر وفيها اعمال الرؤى والحدس والامور النسائية',
    source: {
      title: 'Classical Planetary Hours Practice',
      tradition: 'West African Maghribi',
    },
  },
  
  // Hour 12: Saturn (returns)
  {
    day: 'Sunday',
    hourNumber: 12,
    planet: 'Saturn',
    recommendedWorks: [
      {
        id: 'endings_closures',
        nameKey: 'prayerGuidance.works.endingsClosures.name',
        descriptionKey: 'prayerGuidance.works.endingsClosures.description',
      },
      {
        id: 'deep_meditation',
        nameKey: 'prayerGuidance.works.deepMeditation.name',
        descriptionKey: 'prayerGuidance.works.deepMeditation.description',
      },
      {
        id: 'ancestral_work',
        nameKey: 'prayerGuidance.works.ancestralWork.name',
        descriptionKey: 'prayerGuidance.works.ancestralWork.description',
      },
    ],
    avoidWorks: [
      {
        id: 'new_beginnings',
        nameKey: 'prayerGuidance.works.newBeginnings.name',
        descriptionKey: 'prayerGuidance.works.newBeginnings.description',
      },
    ],
    arabicText: 'الساعة الثانية عشر لزحل وفيها اعمال الختام والتأمل العميق ولا يعمل فيها البدايات',
    source: {
      title: 'Classical Planetary Hours Practice',
      tradition: 'West African Maghribi',
    },
  },
];

/**
 * Planetary hour sequence for each day of the week
 * The first hour of each day is ruled by the day's planet,
 * then follows the Chaldean order: Saturn → Jupiter → Mars → Sun → Venus → Mercury → Moon
 */
export const PLANETARY_HOUR_SEQUENCE: Record<DayOfWeek, Planet[]> = {
  Sunday: ['Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon', 'Saturn'],
  Monday: ['Moon', 'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars', 'Sun'],
  Tuesday: ['Mars', 'Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon'],
  Wednesday: ['Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars'],
  Thursday: ['Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury'],
  Friday: ['Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter'],
  Saturday: ['Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus'],
};

/**
 * Get the ruling planet for a specific day and hour
 */
export function getRulingPlanet(day: DayOfWeek, hourNumber: HourNumber): Planet {
  const sequence = PLANETARY_HOUR_SEQUENCE[day];
  return sequence[hourNumber - 1];
}

/**
 * Get all hour practices for a specific day
 */
export function getHourPracticesForDay(day: DayOfWeek): ClassicalHourPractice[] {
  // For now, we only have Sunday implemented
  // TODO: Implement Monday through Saturday
  if (day === 'Sunday') {
    return sundayHourPractices;
  }
  
  return [];
}

/**
 * Get practice for a specific hour on a specific day
 */
export function getHourPractice(day: DayOfWeek, hourNumber: HourNumber): ClassicalHourPractice | null {
  const dayPractices = getHourPracticesForDay(day);
  return dayPractices.find(p => p.hourNumber === hourNumber) || null;
}

/**
 * Helper to get current planetary hour (requires astronomical calculation)
 * This is a placeholder - actual implementation would need sunrise/sunset times
 */
export function getCurrentPlanetaryHour(date: Date = new Date()): { day: DayOfWeek; hour: HourNumber; planet: Planet } | null {
  // TODO: Implement with actual astronomical calculations
  // For now, return null - to be implemented in Phase 2
  return null;
}
