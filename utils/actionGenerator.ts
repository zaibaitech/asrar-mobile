/**
 * Action Generator
 * Generates personalized dhikr recommendation based on birth chart
 */

import { BirthInsights } from '@/types/calculator-enhanced';

export interface DhikrRecommendation {
  name: string;
  arabic: string;
  meaning: string;
  benefit: string;
  count: number;
  timing: string;
}

export interface ActionItem {
  planet: string;
  dhikrKey: string;
  dhikr: DhikrRecommendation;
  bestDays: string[];
}

type Language = 'en' | 'fr' | 'ar';

// Dhikr data for each planet
const DHIKR_DATA: Record<string, Record<Language, DhikrRecommendation>> = {
  moon: {
    en: {
      name: 'Ya Latif',
      arabic: 'يا لطيف',
      meaning: 'The Gentle One',
      benefit: 'emotional balance',
      count: 129,
      timing: 'Maghrib',
    },
    fr: {
      name: 'Ya Latif',
      arabic: 'يا لطيف',
      meaning: 'Le Doux',
      benefit: 'équilibre émotionnel',
      count: 129,
      timing: 'Maghrib',
    },
    ar: {
      name: 'يا لطيف',
      arabic: 'يا لطيف',
      meaning: 'اللطيف',
      benefit: 'التوازن العاطفي',
      count: 129,
      timing: 'المغرب',
    },
  },
  sun: {
    en: {
      name: 'Ya Nur',
      arabic: 'يا نور',
      meaning: 'The Light',
      benefit: 'vitality and clarity',
      count: 66,
      timing: 'Fajr',
    },
    fr: {
      name: 'Ya Nur',
      arabic: 'يا نور',
      meaning: 'La Lumière',
      benefit: 'vitalité et clarté',
      count: 66,
      timing: 'Fajr',
    },
    ar: {
      name: 'يا نور',
      arabic: 'يا نور',
      meaning: 'النور',
      benefit: 'الحيوية والوضوح',
      count: 66,
      timing: 'الفجر',
    },
  },
  mercury: {
    en: {
      name: 'Ya Hakim',
      arabic: 'يا حكيم',
      meaning: 'The Wise',
      benefit: 'clear communication',
      count: 78,
      timing: 'Dhuhr',
    },
    fr: {
      name: 'Ya Hakim',
      arabic: 'يا حكيم',
      meaning: 'Le Sage',
      benefit: 'communication claire',
      count: 78,
      timing: 'Dhuhr',
    },
    ar: {
      name: 'يا حكيم',
      arabic: 'يا حكيم',
      meaning: 'الحكيم',
      benefit: 'التواصل الواضح',
      count: 78,
      timing: 'الظهر',
    },
  },
  venus: {
    en: {
      name: 'Ya Jamil',
      arabic: 'يا جميل',
      meaning: 'The Beautiful',
      benefit: 'harmony in relationships',
      count: 83,
      timing: 'Asr',
    },
    fr: {
      name: 'Ya Jamil',
      arabic: 'يا جميل',
      meaning: 'Le Beau',
      benefit: 'harmonie dans les relations',
      count: 83,
      timing: 'Asr',
    },
    ar: {
      name: 'يا جميل',
      arabic: 'يا جميل',
      meaning: 'الجميل',
      benefit: 'الانسجام في العلاقات',
      count: 83,
      timing: 'العصر',
    },
  },
  mars: {
    en: {
      name: 'Ya Qawi',
      arabic: 'يا قوي',
      meaning: 'The Strong',
      benefit: 'courage and strength',
      count: 116,
      timing: 'Isha',
    },
    fr: {
      name: 'Ya Qawi',
      arabic: 'يا قوي',
      meaning: 'Le Fort',
      benefit: 'courage et force',
      count: 116,
      timing: 'Isha',
    },
    ar: {
      name: 'يا قوي',
      arabic: 'يا قوي',
      meaning: 'القوي',
      benefit: 'الشجاعة والقوة',
      count: 116,
      timing: 'العشاء',
    },
  },
  jupiter: {
    en: {
      name: 'Ya Wahhab',
      arabic: 'يا وهاب',
      meaning: 'The Bestower',
      benefit: 'abundance and blessings',
      count: 14,
      timing: 'after any prayer',
    },
    fr: {
      name: 'Ya Wahhab',
      arabic: 'يا وهاب',
      meaning: 'Le Donateur',
      benefit: 'abondance et bénédictions',
      count: 14,
      timing: 'après n\'importe quelle prière',
    },
    ar: {
      name: 'يا وهاب',
      arabic: 'يا وهاب',
      meaning: 'الوهاب',
      benefit: 'الوفرة والبركات',
      count: 14,
      timing: 'بعد أي صلاة',
    },
  },
  saturn: {
    en: {
      name: 'Ya Sabur',
      arabic: 'يا صبور',
      meaning: 'The Patient',
      benefit: 'discipline and patience',
      count: 298,
      timing: 'before sleep',
    },
    fr: {
      name: 'Ya Sabur',
      arabic: 'يا صبور',
      meaning: 'Le Patient',
      benefit: 'discipline et patience',
      count: 298,
      timing: 'avant de dormir',
    },
    ar: {
      name: 'يا صبور',
      arabic: 'يا صبور',
      meaning: 'الصبور',
      benefit: 'الانضباط والصبر',
      count: 298,
      timing: 'قبل النوم',
    },
  },
};

// Day names by language
const DAY_NAMES: Record<string, Record<Language, string>> = {
  sunday: { en: 'Sunday', fr: 'Dimanche', ar: 'الأحد' },
  monday: { en: 'Monday', fr: 'Lundi', ar: 'الاثنين' },
  tuesday: { en: 'Tuesday', fr: 'Mardi', ar: 'الثلاثاء' },
  wednesday: { en: 'Wednesday', fr: 'Mercredi', ar: 'الأربعاء' },
  thursday: { en: 'Thursday', fr: 'Jeudi', ar: 'الخميس' },
  friday: { en: 'Friday', fr: 'Vendredi', ar: 'الجمعة' },
  saturday: { en: 'Saturday', fr: 'Samedi', ar: 'السبت' },
};

// Planet to day mapping
const PLANET_DAY_MAP: Record<string, string> = {
  sun: 'sunday',
  moon: 'monday',
  mars: 'tuesday',
  mercury: 'wednesday',
  jupiter: 'thursday',
  venus: 'friday',
  saturn: 'saturday',
};

const getBestDays = (insights: BirthInsights, language: Language): string[] => {
  const days: string[] = [];
  const dominantPlanet = insights.spiritualImprint.dominantPlanet.toLowerCase();

  // Add day based on dominant planet
  const dominantDay = PLANET_DAY_MAP[dominantPlanet];
  if (dominantDay) {
    days.push(DAY_NAMES[dominantDay][language]);
  }

  // Always add Friday (blessed day in Islam)
  const fridayName = DAY_NAMES.friday[language];
  if (!days.includes(fridayName)) {
    days.push(fridayName);
  }

  // Add Monday if Moon is strong (also blessed in Islam)
  const moonPlanet = insights.planets.find((p) => p.planet.toLowerCase() === 'moon');
  if (moonPlanet && moonPlanet.condition.label === 'strong') {
    const mondayName = DAY_NAMES.monday[language];
    if (!days.includes(mondayName)) {
      days.push(mondayName);
    }
  }

  return days.slice(0, 2); // Max 2 days
};

export const generateActionItem = (
  insights: BirthInsights,
  language: Language = 'en'
): ActionItem => {
  // Determine dominant planet
  const dominantPlanet = insights.spiritualImprint.dominantPlanet.toLowerCase();

  // Get dhikr key (default to moon if not found)
  const dhikrKey = DHIKR_DATA[dominantPlanet] ? dominantPlanet : 'moon';

  // Get dhikr data for the language
  const dhikr = DHIKR_DATA[dhikrKey][language];

  // Determine best days based on chart
  const bestDays = getBestDays(insights, language);

  return {
    planet: insights.spiritualImprint.dominantPlanet,
    dhikrKey,
    dhikr,
    bestDays,
  };
};

export default generateActionItem;
