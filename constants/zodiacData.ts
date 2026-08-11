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
  modalityAr: string;
  planetaryRuler: {
    en: string;
    fr: string;
    ar: string;
    transliteration: string;
  };
  temperament: string;
  temperamentFr: string;
  temperamentAr: string;
  spiritualQuality: string;
  spiritualQualityFr: string;
  spiritualQualityAr: string;
  classicalReference: string;
  classicalReferenceFr: string;
  classicalReferenceAr: string;
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
    modalityAr: 'أساسي',
    planetaryRuler: {
      en: 'Mars',
      fr: 'Mars',
      ar: 'المِرِّيخ',
      transliteration: 'Al-Mirrīkh',
    },
    temperament: 'Hot & Dry (Choleric)',
    temperamentFr: 'Chaud & Sec (Colérique)',
    temperamentAr: 'حار وجاف (صفراوي)',
    spiritualQuality: 'Initiative, courage, pioneering spirit',
    spiritualQualityFr: 'Initiative, courage, esprit pionnier',
    spiritualQualityAr: 'المبادرة، الشجاعة، روح الريادة',
    classicalReference: 'Al-Bīrūnī - Al-Qānūn al-Masʿūdī: Cardinal fire, initiating action and leadership',
    classicalReferenceFr: 'Al-Bīrūnī - Al-Qānūn al-Masʿūdī: Feu cardinal, initiation de l\'action et du leadership',
    classicalReferenceAr: 'البيروني - القانون المسعودي: نار أساسية، تبدأ الفعل والقيادة',
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
    modalityAr: 'ثابت',
    planetaryRuler: {
      en: 'Venus',
      fr: 'Vénus',
      ar: 'الزُّهْرَة',
      transliteration: 'Al-Zuhrah',
    },
    temperament: 'Cold & Dry (Melancholic)',
    temperamentFr: 'Froid & Sec (Mélancolique)',
    temperamentAr: 'بارد وجاف (سوداوي)',
    spiritualQuality: 'Stability, patience, material manifestation',
    spiritualQualityFr: 'Stabilité, patience, manifestation matérielle',
    spiritualQualityAr: 'الثبات، الصبر، التجلي المادي',
    classicalReference: 'Al-Bīrūnī - Al-Qānūn al-Masʿūdī: Fixed earth, grounding spiritual energy into material form',
    classicalReferenceFr: 'Al-Bīrūnī - Al-Qānūn al-Masʿūdī: Terre fixe, ancrage de l\'énergie spirituelle dans la forme matérielle',
    classicalReferenceAr: 'البيروني - القانون المسعودي: أرض ثابتة، ترسّخ الطاقة الروحية في صورة مادية',
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
    modalityAr: 'متحول',
    planetaryRuler: {
      en: 'Mercury',
      fr: 'Mercure',
      ar: 'عُطَارِد',
      transliteration: 'ʿUṭārid',
    },
    temperament: 'Hot & Wet (Sanguine)',
    temperamentFr: 'Chaud & Humide (Sanguin)',
    temperamentAr: 'حار ورطب (دموي)',
    spiritualQuality: 'Communication, adaptability, intellectual exploration',
    spiritualQualityFr: 'Communication, adaptabilité, exploration intellectuelle',
    spiritualQualityAr: 'التواصل، التكيّف، الاستكشاف الفكري',
    classicalReference: 'Al-Bīrūnī - Al-Qānūn al-Masʿūdī: Mutable air, facilitating exchange of knowledge and ideas',
    classicalReferenceFr: 'Al-Bīrūnī - Al-Qānūn al-Masʿūdī: Air mutable, facilitant l\'échange de connaissances et d\'idées',
    classicalReferenceAr: 'البيروني - القانون المسعودي: هواء متحول، ييسّر تبادل المعرفة والأفكار',
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
    modalityAr: 'أساسي',
    planetaryRuler: {
      en: 'Moon',
      fr: 'Lune',
      ar: 'القَمَر',
      transliteration: 'Al-Qamar',
    },
    temperament: 'Cold & Wet (Phlegmatic)',
    temperamentFr: 'Froid & Humide (Flegmatique)',
    temperamentAr: 'بارد ورطب (بلغمي)',
    spiritualQuality: 'Nurturing, emotional depth, spiritual protection',
    spiritualQualityFr: 'Nourrissant, profondeur émotionnelle, protection spirituelle',
    spiritualQualityAr: 'الرعاية، العمق العاطفي، الحماية الروحية',
    classicalReference: 'Al-Bīrūnī - Al-Qānūn al-Masʿūdī: Cardinal water, initiating emotional and spiritual nourishment',
    classicalReferenceFr: 'Al-Bīrūnī - Al-Qānūn al-Masʿūdī: Eau cardinale, initiation du nourrissement émotionnel et spirituel',
    classicalReferenceAr: 'البيروني - القانون المسعودي: ماء أساسي، يبدأ التغذية العاطفية والروحية',
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
    modalityAr: 'ثابت',
    planetaryRuler: {
      en: 'Sun',
      fr: 'Soleil',
      ar: 'الشَّمْس',
      transliteration: 'Al-Shams',
    },
    temperament: 'Hot & Dry (Choleric)',
    temperamentFr: 'Chaud & Sec (Colérique)',
    temperamentAr: 'حار وجاف (صفراوي)',
    spiritualQuality: 'Nobility, generosity, divine radiance',
    spiritualQualityFr: 'Noblesse, générosité, rayonnement divin',
    spiritualQualityAr: 'النبل، الكرم، الإشراق الإلهي',
    classicalReference: 'Al-Bīrūnī - Al-Qānūn al-Masʿūdī: Fixed fire, maintaining the light of divine consciousness',
    classicalReferenceFr: 'Al-Bīrūnī - Al-Qānūn al-Masʿūdī: Feu fixe, maintien de la lumière de la conscience divine',
    classicalReferenceAr: 'البيروني - القانون المسعودي: نار ثابتة، تحافظ على نور الوعي الإلهي',
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
    modalityAr: 'متحول',
    planetaryRuler: {
      en: 'Mercury',
      fr: 'Mercure',
      ar: 'عُطَارِد',
      transliteration: 'ʿUṭārid',
    },
    temperament: 'Cold & Dry (Melancholic)',
    temperamentFr: 'Froid & Sec (Mélancolique)',
    temperamentAr: 'بارد وجاف (سوداوي)',
    spiritualQuality: 'Purity, service, refinement of character',
    spiritualQualityFr: 'Pureté, service, raffinement du caractère',
    spiritualQualityAr: 'الطهارة، الخدمة، صقل الطباع',
    classicalReference: 'Al-Bīrūnī - Al-Qānūn al-Masʿūdī: Mutable earth, transforming devotion into practical service',
    classicalReferenceFr: 'Al-Bīrūnī - Al-Qānūn al-Masʿūdī: Terre mutable, transformation de la dévotion en service pratique',
    classicalReferenceAr: 'البيروني - القانون المسعودي: أرض متحولة، تحوّل التعبد إلى خدمة عملية',
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
    modalityAr: 'أساسي',
    planetaryRuler: {
      en: 'Venus',
      fr: 'Vénus',
      ar: 'الزُّهْرَة',
      transliteration: 'Al-Zuhrah',
    },
    temperament: 'Hot & Wet (Sanguine)',
    temperamentFr: 'Chaud & Humide (Sanguin)',
    temperamentAr: 'حار ورطب (دموي)',
    spiritualQuality: 'Balance, justice, harmonious relationships',
    spiritualQualityFr: 'Équilibre, justice, relations harmonieuses',
    spiritualQualityAr: 'التوازن، العدل، العلاقات المنسجمة',
    classicalReference: 'Al-Bīrūnī - Al-Qānūn al-Masʿūdī: Cardinal air, initiating balance and divine justice',
    classicalReferenceFr: 'Al-Bīrūnī - Al-Qānūn al-Masʿūdī: Air cardinal, initiation de l\'équilibre et de la justice divine',
    classicalReferenceAr: 'البيروني - القانون المسعودي: هواء أساسي، يبدأ التوازن والعدل الإلهي',
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
    modalityAr: 'ثابت',
    planetaryRuler: {
      en: 'Mars',
      fr: 'Mars',
      ar: 'المِرِّيخ',
      transliteration: 'Al-Mirrīkh',
    },
    temperament: 'Cold & Wet (Phlegmatic)',
    temperamentFr: 'Froid & Humide (Flegmatique)',
    temperamentAr: 'بارد ورطب (بلغمي)',
    spiritualQuality: 'Transformation, depth, spiritual regeneration',
    spiritualQualityFr: 'Transformation, profondeur, régénération spirituelle',
    spiritualQualityAr: 'التحول، العمق، التجدد الروحي',
    classicalReference: 'Al-Bīrūnī - Al-Qānūn al-Masʿūdī: Fixed water, maintaining transformative spiritual power',
    classicalReferenceFr: 'Al-Bīrūnī - Al-Qānūn al-Masʿūdī: Eau fixe, maintien du pouvoir spirituel transformateur',
    classicalReferenceAr: 'البيروني - القانون المسعودي: ماء ثابت، يحافظ على القوة الروحية التحويلية',
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
    modalityAr: 'متحول',
    planetaryRuler: {
      en: 'Jupiter',
      fr: 'Jupiter',
      ar: 'المُشْتَرِي',
      transliteration: 'Al-Mushtarī',
    },
    temperament: 'Hot & Dry (Choleric)',
    temperamentFr: 'Chaud & Sec (Colérique)',
    temperamentAr: 'حار وجاف (صفراوي)',
    spiritualQuality: 'Wisdom, expansion, higher knowledge',
    spiritualQualityFr: 'Sagesse, expansion, connaissance supérieure',
    spiritualQualityAr: 'الحكمة، التوسع، المعرفة العليا',
    classicalReference: 'Al-Bīrūnī - Al-Qānūn al-Masʿūdī: Mutable fire, adapting divine wisdom to changing circumstances',
    classicalReferenceFr: 'Al-Bīrūnī - Al-Qānūn al-Masʿūdī: Feu mutable, adaptation de la sagesse divine aux circonstances changeantes',
    classicalReferenceAr: 'البيروني - القانون المسعودي: نار متحولة، تكيّف الحكمة الإلهية مع الظروف المتغيرة',
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
    modalityAr: 'أساسي',
    planetaryRuler: {
      en: 'Saturn',
      fr: 'Saturne',
      ar: 'زُحَل',
      transliteration: 'Zuḥal',
    },
    temperament: 'Cold & Dry (Melancholic)',
    temperamentFr: 'Froid & Sec (Mélancolique)',
    temperamentAr: 'بارد وجاف (سوداوي)',
    spiritualQuality: 'Mastery, responsibility, endurance',
    spiritualQualityFr: 'Maîtrise, responsabilité, endurance',
    spiritualQualityAr: 'الإتقان، المسؤولية، التحمل',
    classicalReference: 'Al-Bīrūnī - Al-Qānūn al-Masʿūdī: Cardinal earth, initiating structured manifestation',
    classicalReferenceFr: 'Al-Bīrūnī - Al-Qānūn al-Masʿūdī: Terre cardinale, initiation de la manifestation structurée',
    classicalReferenceAr: 'البيروني - القانون المسعودي: أرض أساسية، تبدأ التجلي المنظم',
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
    modalityAr: 'ثابت',
    planetaryRuler: {
      en: 'Saturn',
      fr: 'Saturne',
      ar: 'زُحَل',
      transliteration: 'Zuḥal',
    },
    temperament: 'Hot & Wet (Sanguine)',
    temperamentFr: 'Chaud & Humide (Sanguin)',
    temperamentAr: 'حار ورطب (دموي)',
    spiritualQuality: 'Innovation, humanitarianism, spiritual awakening',
    spiritualQualityFr: 'Innovation, humanitarisme, éveil spirituel',
    spiritualQualityAr: 'الابتكار، الإنسانية، الصحوة الروحية',
    classicalReference: 'Al-Bīrūnī - Al-Qānūn al-Masʿūdī: Fixed air, maintaining revolutionary spiritual consciousness',
    classicalReferenceFr: 'Al-Bīrūnī - Al-Qānūn al-Masʿūdī: Air fixe, maintien de la conscience spirituelle révolutionnaire',
    classicalReferenceAr: 'البيروني - القانون المسعودي: هواء ثابت، يحافظ على الوعي الروحي الثوري',
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
    modalityAr: 'متحول',
    planetaryRuler: {
      en: 'Jupiter',
      fr: 'Jupiter',
      ar: 'المُشْتَرِي',
      transliteration: 'Al-Mushtarī',
    },
    temperament: 'Cold & Wet (Phlegmatic)',
    temperamentFr: 'Froid & Humide (Flegmatique)',
    temperamentAr: 'بارد ورطب (بلغمي)',
    spiritualQuality: 'Compassion, mysticism, universal love',
    spiritualQualityFr: 'Compassion, mysticisme, amour universel',
    spiritualQualityAr: 'الرحمة، التصوف، الحب الشامل',
    classicalReference: 'Al-Bīrūnī - Al-Qānūn al-Masʿūdī: Mutable water, dissolving ego into divine unity',
    classicalReferenceFr: 'Al-Bīrūnī - Al-Qānūn al-Masʿūdī: Eau mutable, dissolution de l\'ego dans l\'unité divine',
    classicalReferenceAr: 'البيروني - القانون المسعودي: ماء متحول، يذيب الأنا في الوحدة الإلهية',
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
