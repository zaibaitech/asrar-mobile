/**
 * Zodiac Sign Metadata
 * Maps Buruj numbers (1-12) to classical Islamic zodiac information
 */

export interface ZodiacSign {
  buruj: number;
  nameEn: string;
  nameFr: string;
  nameAr: string;
  transliteration: string;
  symbol: string;
  modality: 'Cardinal' | 'Fixed' | 'Mutable';
  modalityFr: 'Cardinal' | 'Fixe' | 'Mutable';
  planetaryRuler: {
    en: string;
    fr: string;
    ar: string;
    transliteration: string;
  };
  temperament: string;
  temperamentFr: string;
  spiritualQuality: string;
  spiritualQualityFr: string;
  classicalReference: string;
  classicalReferenceFr: string;
}

export const ZODIAC_SIGNS: Record<number, ZodiacSign> = {
  1: {
    buruj: 1,
    nameEn: 'Aries',
    nameFr: 'Bélier',
    nameAr: 'الحَمَل',
    transliteration: 'Al-Ḥamal',
    symbol: '♈️ The Ram',
    modality: 'Cardinal',
    modalityFr: 'Cardinal',
    planetaryRuler: {
      en: 'Mars',
      fr: 'Mars',
      ar: 'المِرِّيخ',
      transliteration: 'Al-Mirrīkh',
    },
    temperament: 'Hot & Dry (Choleric)',
    temperamentFr: 'Chaud & Sec (Colérique)',
    spiritualQuality: 'Initiative, courage, pioneering spirit',
    spiritualQualityFr: 'Initiative, courage, esprit pionnier',
    classicalReference: 'Al-Bīrūnī - Al-Qānūn al-Masʿūdī: Cardinal fire, initiating action and leadership',
    classicalReferenceFr: 'Al-Bīrūnī - Al-Qānūn al-Masʿūdī: Feu cardinal, initiation de l\'action et du leadership',
  },
  2: {
    buruj: 2,
    nameEn: 'Taurus',
    nameFr: 'Taureau',
    nameAr: 'الثَّوْر',
    transliteration: 'Al-Thawr',
    symbol: '♉️ The Bull',
    modality: 'Fixed',
    modalityFr: 'Fixe',
    planetaryRuler: {
      en: 'Venus',
      fr: 'Vénus',
      ar: 'الزُّهْرَة',
      transliteration: 'Al-Zuhrah',
    },
    temperament: 'Cold & Dry (Melancholic)',
    temperamentFr: 'Froid & Sec (Mélancolique)',
    spiritualQuality: 'Stability, patience, material manifestation',
    spiritualQualityFr: 'Stabilité, patience, manifestation matérielle',
    classicalReference: 'Al-Bīrūnī - Al-Qānūn al-Masʿūdī: Fixed earth, grounding spiritual energy into material form',
    classicalReferenceFr: 'Al-Bīrūnī - Al-Qānūn al-Masʿūdī: Terre fixe, ancrage de l\'énergie spirituelle dans la forme matérielle',
  },
  3: {
    buruj: 3,
    nameEn: 'Gemini',
    nameFr: 'Gémeaux',
    nameAr: 'الجَوْزَاء',
    transliteration: 'Al-Jawzāʾ',
    symbol: '♊️ The Twins',
    modality: 'Mutable',
    modalityFr: 'Mutable',
    planetaryRuler: {
      en: 'Mercury',
      fr: 'Mercure',
      ar: 'عُطَارِد',
      transliteration: 'ʿUṭārid',
    },
    temperament: 'Hot & Wet (Sanguine)',
    temperamentFr: 'Chaud & Humide (Sanguin)',
    spiritualQuality: 'Communication, adaptability, intellectual exploration',
    spiritualQualityFr: 'Communication, adaptabilité, exploration intellectuelle',
    classicalReference: 'Al-Bīrūnī - Al-Qānūn al-Masʿūdī: Mutable air, facilitating exchange of knowledge and ideas',
    classicalReferenceFr: 'Al-Bīrūnī - Al-Qānūn al-Masʿūdī: Air mutable, facilitant l\'échange de connaissances et d\'idées',
  },
  4: {
    buruj: 4,
    nameEn: 'Cancer',
    nameFr: 'Cancer',
    nameAr: 'السَّرَطَان',
    transliteration: 'Al-Saraṭān',
    symbol: '♋️ The Crab',
    modality: 'Cardinal',
    modalityFr: 'Cardinal',
    planetaryRuler: {
      en: 'Moon',
      fr: 'Lune',
      ar: 'القَمَر',
      transliteration: 'Al-Qamar',
    },
    temperament: 'Cold & Wet (Phlegmatic)',
    temperamentFr: 'Froid & Humide (Flegmatique)',
    spiritualQuality: 'Nurturing, emotional depth, spiritual protection',
    spiritualQualityFr: 'Nourrissant, profondeur émotionnelle, protection spirituelle',
    classicalReference: 'Al-Bīrūnī - Al-Qānūn al-Masʿūdī: Cardinal water, initiating emotional and spiritual nourishment',
    classicalReferenceFr: 'Al-Bīrūnī - Al-Qānūn al-Masʿūdī: Eau cardinale, initiation du nourrissement émotionnel et spirituel',
  },
  5: {
    buruj: 5,
    nameEn: 'Leo',
    nameFr: 'Lion',
    nameAr: 'الأَسَد',
    transliteration: 'Al-Asad',
    symbol: '♌️ The Lion',
    modality: 'Fixed',
    modalityFr: 'Fixe',
    planetaryRuler: {
      en: 'Sun',
      fr: 'Soleil',
      ar: 'الشَّمْس',
      transliteration: 'Al-Shams',
    },
    temperament: 'Hot & Dry (Choleric)',
    temperamentFr: 'Chaud & Sec (Colérique)',
    spiritualQuality: 'Nobility, generosity, divine radiance',
    spiritualQualityFr: 'Noblesse, générosité, rayonnement divin',
    classicalReference: 'Al-Bīrūnī - Al-Qānūn al-Masʿūdī: Fixed fire, maintaining the light of divine consciousness',
    classicalReferenceFr: 'Al-Bīrūnī - Al-Qānūn al-Masʿūdī: Feu fixe, maintien de la lumière de la conscience divine',
  },
  6: {
    buruj: 6,
    nameEn: 'Virgo',
    nameFr: 'Vierge',
    nameAr: 'السُّنْبُلَة',
    transliteration: 'Al-Sunbulah',
    symbol: '♍️ The Maiden',
    modality: 'Mutable',
    modalityFr: 'Mutable',
    planetaryRuler: {
      en: 'Mercury',
      fr: 'Mercure',
      ar: 'عُطَارِد',
      transliteration: 'ʿUṭārid',
    },
    temperament: 'Cold & Dry (Melancholic)',
    temperamentFr: 'Froid & Sec (Mélancolique)',
    spiritualQuality: 'Purity, service, refinement of character',
    spiritualQualityFr: 'Pureté, service, raffinement du caractère',
    classicalReference: 'Al-Bīrūnī - Al-Qānūn al-Masʿūdī: Mutable earth, transforming devotion into practical service',
    classicalReferenceFr: 'Al-Bīrūnī - Al-Qānūn al-Masʿūdī: Terre mutable, transformation de la dévotion en service pratique',
  },
  7: {
    buruj: 7,
    nameEn: 'Libra',
    nameFr: 'Balance',
    nameAr: 'المِيزَان',
    transliteration: 'Al-Mīzān',
    symbol: '♎️ The Scales',
    modality: 'Cardinal',
    modalityFr: 'Cardinal',
    planetaryRuler: {
      en: 'Venus',
      fr: 'Vénus',
      ar: 'الزُّهْرَة',
      transliteration: 'Al-Zuhrah',
    },
    temperament: 'Hot & Wet (Sanguine)',
    temperamentFr: 'Chaud & Humide (Sanguin)',
    spiritualQuality: 'Balance, justice, harmonious relationships',
    spiritualQualityFr: 'Équilibre, justice, relations harmonieuses',
    classicalReference: 'Al-Bīrūnī - Al-Qānūn al-Masʿūdī: Cardinal air, initiating balance and divine justice',
    classicalReferenceFr: 'Al-Bīrūnī - Al-Qānūn al-Masʿūdī: Air cardinal, initiation de l\'équilibre et de la justice divine',
  },
  8: {
    buruj: 8,
    nameEn: 'Scorpio',
    nameFr: 'Scorpion',
    nameAr: 'العَقْرَب',
    transliteration: 'Al-ʿAqrab',
    symbol: '♏️ The Scorpion',
    modality: 'Fixed',
    modalityFr: 'Fixe',
    planetaryRuler: {
      en: 'Mars',
      fr: 'Mars',
      ar: 'المِرِّيخ',
      transliteration: 'Al-Mirrīkh',
    },
    temperament: 'Cold & Wet (Phlegmatic)',
    temperamentFr: 'Froid & Humide (Flegmatique)',
    spiritualQuality: 'Transformation, depth, spiritual regeneration',
    spiritualQualityFr: 'Transformation, profondeur, régénération spirituelle',
    classicalReference: 'Al-Bīrūnī - Al-Qānūn al-Masʿūdī: Fixed water, maintaining transformative spiritual power',
    classicalReferenceFr: 'Al-Bīrūnī - Al-Qānūn al-Masʿūdī: Eau fixe, maintien du pouvoir spirituel transformateur',
  },
  9: {
    buruj: 9,
    nameEn: 'Sagittarius',
    nameFr: 'Sagittaire',
    nameAr: 'القَوْس',
    transliteration: 'Al-Qaws',
    symbol: '♐️ The Archer',
    modality: 'Mutable',
    modalityFr: 'Mutable',
    planetaryRuler: {
      en: 'Jupiter',
      fr: 'Jupiter',
      ar: 'المُشْتَرِي',
      transliteration: 'Al-Mushtarī',
    },
    temperament: 'Hot & Dry (Choleric)',
    temperamentFr: 'Chaud & Sec (Colérique)',
    spiritualQuality: 'Wisdom, expansion, higher knowledge',
    spiritualQualityFr: 'Sagesse, expansion, connaissance supérieure',
    classicalReference: 'Al-Bīrūnī - Al-Qānūn al-Masʿūdī: Mutable fire, adapting divine wisdom to changing circumstances',
    classicalReferenceFr: 'Al-Bīrūnī - Al-Qānūn al-Masʿūdī: Feu mutable, adaptation de la sagesse divine aux circonstances changeantes',
  },
  10: {
    buruj: 10,
    nameEn: 'Capricorn',
    nameFr: 'Capricorne',
    nameAr: 'الجَدْي',
    transliteration: 'Al-Jadī',
    symbol: '♑️ The Goat',
    modality: 'Cardinal',
    modalityFr: 'Cardinal',
    planetaryRuler: {
      en: 'Saturn',
      fr: 'Saturne',
      ar: 'زُحَل',
      transliteration: 'Zuḥal',
    },
    temperament: 'Cold & Dry (Melancholic)',
    temperamentFr: 'Froid & Sec (Mélancolique)',
    spiritualQuality: 'Mastery, responsibility, endurance',
    spiritualQualityFr: 'Maîtrise, responsabilité, endurance',
    classicalReference: 'Al-Bīrūnī - Al-Qānūn al-Masʿūdī: Cardinal earth, initiating structured manifestation',
    classicalReferenceFr: 'Al-Bīrūnī - Al-Qānūn al-Masʿūdī: Terre cardinale, initiation de la manifestation structurée',
  },
  11: {
    buruj: 11,
    nameEn: 'Aquarius',
    nameFr: 'Verseau',
    nameAr: 'الدَّلْو',
    transliteration: 'Al-Dalw',
    symbol: '♒️ The Water Bearer',
    modality: 'Fixed',
    modalityFr: 'Fixe',
    planetaryRuler: {
      en: 'Saturn',
      fr: 'Saturne',
      ar: 'زُحَل',
      transliteration: 'Zuḥal',
    },
    temperament: 'Hot & Wet (Sanguine)',
    temperamentFr: 'Chaud & Humide (Sanguin)',
    spiritualQuality: 'Innovation, humanitarianism, spiritual awakening',
    spiritualQualityFr: 'Innovation, humanitarisme, éveil spirituel',
    classicalReference: 'Al-Bīrūnī - Al-Qānūn al-Masʿūdī: Fixed air, maintaining revolutionary spiritual consciousness',
    classicalReferenceFr: 'Al-Bīrūnī - Al-Qānūn al-Masʿūdī: Air fixe, maintien de la conscience spirituelle révolutionnaire',
  },
  12: {
    buruj: 12,
    nameEn: 'Pisces',
    nameFr: 'Poissons',
    nameAr: 'الحُوت',
    transliteration: 'Al-Ḥūt',
    symbol: '♓️ The Fish',
    modality: 'Mutable',
    modalityFr: 'Mutable',
    planetaryRuler: {
      en: 'Jupiter',
      fr: 'Jupiter',
      ar: 'المُشْتَرِي',
      transliteration: 'Al-Mushtarī',
    },
    temperament: 'Cold & Wet (Phlegmatic)',
    temperamentFr: 'Froid & Humide (Flegmatique)',
    spiritualQuality: 'Compassion, mysticism, universal love',
    spiritualQualityFr: 'Compassion, mysticisme, amour universel',
    classicalReference: 'Al-Bīrūnī - Al-Qānūn al-Masʿūdī: Mutable water, dissolving ego into divine unity',
    classicalReferenceFr: 'Al-Bīrūnī - Al-Qānūn al-Masʿūdī: Eau mutable, dissolution de l\'ego dans l\'unité divine',
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
