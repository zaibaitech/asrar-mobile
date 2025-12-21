/**
 * Zodiac Sign Metadata
 * Maps Buruj numbers (1-12) to classical Islamic zodiac information
 */

export interface ZodiacSign {
  buruj: number;
  nameEn: string;
  nameAr: string;
  transliteration: string;
  symbol: string;
  modality: 'Cardinal' | 'Fixed' | 'Mutable';
  planetaryRuler: {
    en: string;
    ar: string;
    transliteration: string;
  };
  temperament: string;
  spiritualQuality: string;
  classicalReference: string;
}

export const ZODIAC_SIGNS: Record<number, ZodiacSign> = {
  1: {
    buruj: 1,
    nameEn: 'Aries',
    nameAr: 'الحَمَل',
    transliteration: 'Al-Ḥamal',
    symbol: '♈️ The Ram',
    modality: 'Cardinal',
    planetaryRuler: {
      en: 'Mars',
      ar: 'المِرِّيخ',
      transliteration: 'Al-Mirrīkh',
    },
    temperament: 'Hot & Dry (Choleric)',
    spiritualQuality: 'Initiative, courage, pioneering spirit',
    classicalReference: 'Al-Bīrūnī - Al-Qānūn al-Masʿūdī: Cardinal fire, initiating action and leadership',
  },
  2: {
    buruj: 2,
    nameEn: 'Taurus',
    nameAr: 'الثَّوْر',
    transliteration: 'Al-Thawr',
    symbol: '♉️ The Bull',
    modality: 'Fixed',
    planetaryRuler: {
      en: 'Venus',
      ar: 'الزُّهْرَة',
      transliteration: 'Al-Zuhrah',
    },
    temperament: 'Cold & Dry (Melancholic)',
    spiritualQuality: 'Stability, patience, material manifestation',
    classicalReference: 'Al-Bīrūnī - Al-Qānūn al-Masʿūdī: Fixed earth, grounding spiritual energy into material form',
  },
  3: {
    buruj: 3,
    nameEn: 'Gemini',
    nameAr: 'الجَوْزَاء',
    transliteration: 'Al-Jawzāʾ',
    symbol: '♊️ The Twins',
    modality: 'Mutable',
    planetaryRuler: {
      en: 'Mercury',
      ar: 'عُطَارِد',
      transliteration: 'ʿUṭārid',
    },
    temperament: 'Hot & Wet (Sanguine)',
    spiritualQuality: 'Communication, adaptability, intellectual exploration',
    classicalReference: 'Al-Bīrūnī - Al-Qānūn al-Masʿūdī: Mutable air, facilitating exchange of knowledge and ideas',
  },
  4: {
    buruj: 4,
    nameEn: 'Cancer',
    nameAr: 'السَّرَطَان',
    transliteration: 'Al-Saraṭān',
    symbol: '♋️ The Crab',
    modality: 'Cardinal',
    planetaryRuler: {
      en: 'Moon',
      ar: 'القَمَر',
      transliteration: 'Al-Qamar',
    },
    temperament: 'Cold & Wet (Phlegmatic)',
    spiritualQuality: 'Nurturing, emotional depth, spiritual protection',
    classicalReference: 'Al-Bīrūnī - Al-Qānūn al-Masʿūdī: Cardinal water, initiating emotional and spiritual nourishment',
  },
  5: {
    buruj: 5,
    nameEn: 'Leo',
    nameAr: 'الأَسَد',
    transliteration: 'Al-Asad',
    symbol: '♌️ The Lion',
    modality: 'Fixed',
    planetaryRuler: {
      en: 'Sun',
      ar: 'الشَّمْس',
      transliteration: 'Al-Shams',
    },
    temperament: 'Hot & Dry (Choleric)',
    spiritualQuality: 'Nobility, generosity, divine radiance',
    classicalReference: 'Al-Bīrūnī - Al-Qānūn al-Masʿūdī: Fixed fire, maintaining the light of divine consciousness',
  },
  6: {
    buruj: 6,
    nameEn: 'Virgo',
    nameAr: 'السُّنْبُلَة',
    transliteration: 'Al-Sunbulah',
    symbol: '♍️ The Maiden',
    modality: 'Mutable',
    planetaryRuler: {
      en: 'Mercury',
      ar: 'عُطَارِد',
      transliteration: 'ʿUṭārid',
    },
    temperament: 'Cold & Dry (Melancholic)',
    spiritualQuality: 'Purity, service, refinement of character',
    classicalReference: 'Al-Bīrūnī - Al-Qānūn al-Masʿūdī: Mutable earth, transforming devotion into practical service',
  },
  7: {
    buruj: 7,
    nameEn: 'Libra',
    nameAr: 'المِيزَان',
    transliteration: 'Al-Mīzān',
    symbol: '♎️ The Scales',
    modality: 'Cardinal',
    planetaryRuler: {
      en: 'Venus',
      ar: 'الزُّهْرَة',
      transliteration: 'Al-Zuhrah',
    },
    temperament: 'Hot & Wet (Sanguine)',
    spiritualQuality: 'Balance, justice, harmonious relationships',
    classicalReference: 'Al-Bīrūnī - Al-Qānūn al-Masʿūdī: Cardinal air, initiating balance and divine justice',
  },
  8: {
    buruj: 8,
    nameEn: 'Scorpio',
    nameAr: 'العَقْرَب',
    transliteration: 'Al-ʿAqrab',
    symbol: '♏️ The Scorpion',
    modality: 'Fixed',
    planetaryRuler: {
      en: 'Mars',
      ar: 'المِرِّيخ',
      transliteration: 'Al-Mirrīkh',
    },
    temperament: 'Cold & Wet (Phlegmatic)',
    spiritualQuality: 'Transformation, depth, spiritual regeneration',
    classicalReference: 'Al-Bīrūnī - Al-Qānūn al-Masʿūdī: Fixed water, maintaining transformative spiritual power',
  },
  9: {
    buruj: 9,
    nameEn: 'Sagittarius',
    nameAr: 'القَوْس',
    transliteration: 'Al-Qaws',
    symbol: '♐️ The Archer',
    modality: 'Mutable',
    planetaryRuler: {
      en: 'Jupiter',
      ar: 'المُشْتَرِي',
      transliteration: 'Al-Mushtarī',
    },
    temperament: 'Hot & Dry (Choleric)',
    spiritualQuality: 'Wisdom, expansion, higher knowledge',
    classicalReference: 'Al-Bīrūnī - Al-Qānūn al-Masʿūdī: Mutable fire, adapting divine wisdom to changing circumstances',
  },
  10: {
    buruj: 10,
    nameEn: 'Capricorn',
    nameAr: 'الجَدْي',
    transliteration: 'Al-Jadī',
    symbol: '♑️ The Goat',
    modality: 'Cardinal',
    planetaryRuler: {
      en: 'Saturn',
      ar: 'زُحَل',
      transliteration: 'Zuḥal',
    },
    temperament: 'Cold & Dry (Melancholic)',
    spiritualQuality: 'Mastery, responsibility, endurance',
    classicalReference: 'Al-Bīrūnī - Al-Qānūn al-Masʿūdī: Cardinal earth, initiating structured manifestation',
  },
  11: {
    buruj: 11,
    nameEn: 'Aquarius',
    nameAr: 'الدَّلْو',
    transliteration: 'Al-Dalw',
    symbol: '♒️ The Water Bearer',
    modality: 'Fixed',
    planetaryRuler: {
      en: 'Saturn',
      ar: 'زُحَل',
      transliteration: 'Zuḥal',
    },
    temperament: 'Hot & Wet (Sanguine)',
    spiritualQuality: 'Innovation, humanitarianism, spiritual awakening',
    classicalReference: 'Al-Bīrūnī - Al-Qānūn al-Masʿūdī: Fixed air, maintaining revolutionary spiritual consciousness',
  },
  12: {
    buruj: 12,
    nameEn: 'Pisces',
    nameAr: 'الحُوت',
    transliteration: 'Al-Ḥūt',
    symbol: '♓️ The Fish',
    modality: 'Mutable',
    planetaryRuler: {
      en: 'Jupiter',
      ar: 'المُشْتَرِي',
      transliteration: 'Al-Mushtarī',
    },
    temperament: 'Cold & Wet (Phlegmatic)',
    spiritualQuality: 'Compassion, mysticism, universal love',
    classicalReference: 'Al-Bīrūnī - Al-Qānūn al-Masʿūdī: Mutable water, dissolving ego into divine unity',
  },
} as const;

/**
 * Get zodiac sign data by Buruj number
 */
export function getZodiacSign(burujNumber: number): ZodiacSign | null {
  return ZODIAC_SIGNS[burujNumber] || null;
}

/**
 * Get element background colors for themed cards
 * Returns subtle background colors suitable for cream/beige card backgrounds
 */
export function getElementBackgroundColors(element: string): {
  cardBg: string;
  accentColor: string;
  headerColor: string;
} {
  const elementLower = element.toLowerCase();
  
  switch (elementLower) {
    case 'fire':
      return {
        cardBg: '#FFF5E5',
        accentColor: '#FF6B35',
        headerColor: '#C17817',
      };
    case 'earth':
      return {
        cardBg: '#FFF9E5',
        accentColor: '#8B4513',
        headerColor: '#C17817',
      };
    case 'air':
      return {
        cardBg: '#F0F8FF',
        accentColor: '#4682B4',
        headerColor: '#1E5A8E',
      };
    case 'water':
      return {
        cardBg: '#F0FBFF',
        accentColor: '#1E90FF',
        headerColor: '#0B5A9E',
      };
    default:
      return {
        cardBg: '#FFFBF0',
        accentColor: '#C17817',
        headerColor: '#C17817',
      };
  }
}
