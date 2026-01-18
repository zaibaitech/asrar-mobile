import type { Planet } from '@/data/classical-hour-practices';

export interface ClassicalWisdomGuidance {
  spiritualGuidance: {
    title: string;
    icon: string;
    forEveryone: {
      dhikrRecommendations: Array<{
        arabicText: string;
        transliteration: string;
        translation: string;
        count: number;
        timing: string;
        benefits: string;
      }>;
      quranGuidance: Array<{
        surahName: string;
        ayatReference: string;
        repetitions: number;
        purpose: string;
        timing: string;
      }>;
      duaRecommendations: Array<{
        duaText: string;
        transliteration: string;
        translation: string;
        source: string;
        context: string;
      }>;
      spiritualIntentions: string[];
      sunnahPractices: string[];
      adab: string[];
    };
    forPractitioners: {
      requiresTraining: boolean;
      advancedApplications: string[];
      classicalReferences: string[];
      warningNote: string;
    };
  };
  naturalAlignment: {
    description: string;
    note: string;
  };
  traditionalContext: {
    historicalBackground: string;
    geographicalOrigin: string;
    purposeExplanation: string;
  };
}

type SupportedLanguage = 'en' | 'fr' | 'ar';

type GuidanceMap = Record<Planet, ClassicalWisdomGuidance>;

type LocalizedGuidance = Record<'en' | 'fr', GuidanceMap>;

const commonDhikr = {
  arRahman: {
    arabicText: 'يَا رَحْمَٰن',
    transliteration: 'Yā Raḥmān',
    translation: 'O Most Merciful',
    count: 298,
    timing: 'After Maghrib or in the last third of the night',
    benefits: 'For attracting divine mercy and compassion',
  },
  alWadud: {
    arabicText: 'يَا وَدُود',
    transliteration: 'Yā Wadūd',
    translation: 'O Most Loving',
    count: 20,
    timing: 'After prayer with a soft heart',
    benefits: 'For cultivating love and harmony in relationships',
  },
};

const commonQuran = {
  ayatAlKursi: {
    surahName: 'Ayat al-Kursi',
    ayatReference: 'Al-Baqarah 2:255',
    repetitions: 7,
    purpose: 'For comprehensive protection from all harm',
    timing: 'After each prayer, especially Maghrib and before sleep',
  },
  alFalaq: {
    surahName: 'Surat al-Falaq',
    ayatReference: '113:1-5',
    repetitions: 3,
    purpose: 'Protection from external harm and evil',
    timing: 'Morning and evening',
  },
  anNas: {
    surahName: 'Surat an-Nas',
    ayatReference: '114:1-6',
    repetitions: 3,
    purpose: 'Protection from internal whispers and spiritual harm',
    timing: 'Morning and evening',
  },
  alIkhlas: {
    surahName: 'Surat al-Ikhlas',
    ayatReference: '112:1-4',
    repetitions: 3,
    purpose: 'Affirming divine unity and seeking blessings',
    timing: 'After each prayer',
  },
};

const duaProtectionMorning = {
  duaText: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
  transliteration: "A'ūdhu bi-kalimātillāhi-t-tāmmāti min sharri mā khalaq",
  translation: 'I seek refuge in the perfect words of Allah from the evil of what He has created',
  source: 'Muslim 2708',
  context: 'Morning and evening, 3 times',
};

const duaProtectionEnemies = {
  duaText: 'اللَّهُمَّ إِنَّا نَجْعَلُكَ فِي نُحُورِهِمْ وَنَعُوذُ بِكَ مِنْ شُرُورِهِمْ',
  transliteration: "Allāhumma innā naj'aluka fī nuḥūrihim wa na'ūdhu bika min shurūrihim",
  translation: 'O Allah, we place You before them and we seek refuge in You from their evil',
  source: 'Abu Dawud 1537',
  context: 'When facing opposition or adversaries',
};

const duaProvision = {
  duaText: 'اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ',
  transliteration: "Allāhumma-kfinī bi-ḥalālika 'an ḥarāmik, wa aghninī bi-faḍlika 'amman siwāk",
  translation: 'O Allah, suffice me with what You have made lawful instead of what You have made unlawful, and make me independent by Your bounty of all others',
  source: 'Tirmidhi 3563',
  context: 'Daily, especially during times of financial difficulty',
};

const duaKnowledge = {
  duaText: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا طَيِّبًا وَعَمَلًا مُتَقَبَّلًا',
  transliteration: "Allāhumma innī as'aluka 'ilman nāfi'an wa rizqan ṭayyiban wa 'amalan mutaqabbalan",
  translation: 'O Allah, I ask You for beneficial knowledge, good provision, and accepted deeds',
  source: 'Ibn Majah 925',
  context: 'After Fajr prayer',
};

const baseAdab = [
  'Perform with wudu (ritual purification)',
  'Face the Qibla when possible',
  'In a quiet, clean space',
  'With full presence of heart (ḥuḍūr al-qalb)',
  'With humility and neediness before Allah',
  'Maintain consistency in practice',
  'Ensure sincerity (ikhlāṣ) in intention',
];

const baseSunnah = [
  'Voluntary fasting (Mondays and Thursdays if possible)',
  'Sadaqah with sincere intention',
  'Qiyam al-Layl in the last third of the night',
];

const baseIntentions = [
  "I intend to seek Allah's protection from all harm, visible and invisible",
  'I intend to purify my heart and strengthen my connection to Allah',
  'I intend to seek beneficial knowledge that draws me closer to Allah',
];

const basePractitioner = {
  requiresTraining: true,
  advancedApplications: [
    'Protective talismans (ḥijāb), ruqyah, defensive wafq',
    'Classical invocations aligned with planetary hour discipline',
  ],
  classicalReferences: ['Shams al-Ma’ārif', 'West African Maghribi manuscripts'],
  warningNote: 'Advanced spiritual work requires proper training, ijāzah, and knowledge of shariah boundaries.',
};

const baseTraditionalContext = {
  historicalBackground: 'These practices arise from classical Islamic spiritual sciences transmitted through scholarly lineages.',
  geographicalOrigin: 'West African Maghribi tradition',
  purposeExplanation: 'To align prayer, remembrance, and discipline with sacred timing while prioritizing spiritual growth.',
};

const englishGuidance: GuidanceMap = {
  Mars: {
    spiritualGuidance: {
      title: 'Protective Spiritual Work',
      icon: '🛡️',
      forEveryone: {
        dhikrRecommendations: [
          {
            arabicText: 'يَا قَهَّار',
            transliteration: 'Yā Qahhār',
            translation: 'O Subduer, O Dominant One',
            count: 100,
            timing: 'After Maghrib or before sleep',
            benefits: 'For spiritual protection and strength against adversaries',
          },
          {
            arabicText: 'يَا قَوِيّ',
            transliteration: 'Yā Qawī',
            translation: 'O Most Strong',
            count: 41,
            timing: 'After prayer with steady breathing',
            benefits: 'For inner strength and resilience',
          },
          {
            arabicText: 'يَا عَزِيز',
            transliteration: 'Yā ‘Azīz',
            translation: 'O Mighty, O Invincible',
            count: 94,
            timing: 'After prayer with focused intention',
            benefits: 'For honor, dignity, and protection from humiliation',
          },
        ],
        quranGuidance: [commonQuran.ayatAlKursi, commonQuran.alFalaq, commonQuran.anNas],
        duaRecommendations: [duaProtectionMorning, duaProtectionEnemies],
        spiritualIntentions: [
          'Seek protection from harm, envy, and oppression',
          'Ask for firmness of heart and courage in trials',
        ],
        sunnahPractices: [
          ...baseSunnah,
          'Fast on this day if possible for spiritual fortification',
        ],
        adab: baseAdab,
      },
      forPractitioners: {
        ...basePractitioner,
        advancedApplications: [
          'Protective talismans (ḥijāb), ruqyah, defensive wafq',
          'Strengthening retreats with supervised spiritual discipline',
        ],
      },
    },
    naturalAlignment: {
      description:
        'When spiritual energy supports protection and strength, it may naturally aid situations requiring courage and firmness in daily life.',
      note: 'Remember: spiritual practice is primary; worldly alignment is secondary.',
    },
    traditionalContext: baseTraditionalContext,
  },
  Venus: {
    spiritualGuidance: {
      title: 'Harmony and Relationships',
      icon: '💗',
      forEveryone: {
        dhikrRecommendations: [commonDhikr.alWadud, commonDhikr.arRahman],
        quranGuidance: [commonQuran.alIkhlas, commonQuran.ayatAlKursi],
        duaRecommendations: [duaProtectionMorning],
        spiritualIntentions: [
          'Seek mercy, gentleness, and harmony in family life',
          'Ask Allah to soften hearts and increase affection',
        ],
        sunnahPractices: baseSunnah,
        adab: baseAdab,
      },
      forPractitioners: {
        ...basePractitioner,
        advancedApplications: [
          'Reconciliation invocations under supervision',
          'Traditional harmony practices aligned with adab',
        ],
      },
    },
    naturalAlignment: {
      description:
        'Gentle spiritual timing can support compassion and reconciliation in daily relationships.',
      note: 'Spiritual practice is primary; worldly alignment is secondary.',
    },
    traditionalContext: baseTraditionalContext,
  },
  Mercury: {
    spiritualGuidance: {
      title: 'Study and Wisdom',
      icon: '📚',
      forEveryone: {
        dhikrRecommendations: [
          {
            arabicText: 'يَا عَلِيم',
            transliteration: 'Yā ‘Alīm',
            translation: 'O All-Knowing',
            count: 150,
            timing: 'After Fajr or before study',
            benefits: 'For clarity, retention, and beneficial knowledge',
          },
        ],
        quranGuidance: [commonQuran.alIkhlas],
        duaRecommendations: [duaKnowledge],
        spiritualIntentions: [
          'Seek beneficial knowledge that draws closer to Allah',
          'Ask for clarity and protection from confusion',
        ],
        sunnahPractices: baseSunnah,
        adab: baseAdab,
      },
      forPractitioners: basePractitioner,
    },
    naturalAlignment: {
      description: 'Clarity in spiritual focus can support study and communication in daily life.',
      note: 'Spiritual practice is primary; worldly alignment is secondary.',
    },
    traditionalContext: baseTraditionalContext,
  },
  Jupiter: {
    spiritualGuidance: {
      title: 'Provision and Prosperity',
      icon: '🌾',
      forEveryone: {
        dhikrRecommendations: [
          {
            arabicText: 'يَا رَزَّاق',
            transliteration: 'Yā Razzāq',
            translation: 'O Provider',
            count: 308,
            timing: 'After Dhuhr or during morning sustenance',
            benefits: 'For seeking halal provision and barakah',
          },
        ],
        quranGuidance: [commonQuran.ayatAlKursi],
        duaRecommendations: [duaProvision],
        spiritualIntentions: [
          'Seek halal provision and gratitude in sustenance',
          'Ask for barakah in work and charity',
        ],
        sunnahPractices: baseSunnah,
        adab: baseAdab,
      },
      forPractitioners: basePractitioner,
    },
    naturalAlignment: {
      description: 'Spiritual generosity can naturally support responsible planning and provision.',
      note: 'Spiritual practice is primary; worldly alignment is secondary.',
    },
    traditionalContext: baseTraditionalContext,
  },
  Moon: {
    spiritualGuidance: {
      title: 'Journey and Change',
      icon: '🧭',
      forEveryone: {
        dhikrRecommendations: [commonDhikr.arRahman],
        quranGuidance: [commonQuran.alFalaq, commonQuran.anNas],
        duaRecommendations: [duaProtectionMorning],
        spiritualIntentions: [
          'Seek protection and ease during movement and transitions',
          'Ask for serenity of heart and good outcomes',
        ],
        sunnahPractices: baseSunnah,
        adab: baseAdab,
      },
      forPractitioners: basePractitioner,
    },
    naturalAlignment: {
      description: 'Spiritual calm can support steady transitions and emotional balance.',
      note: 'Spiritual practice is primary; worldly alignment is secondary.',
    },
    traditionalContext: baseTraditionalContext,
  },
  Sun: {
    spiritualGuidance: {
      title: 'Strength and Illumination',
      icon: '☀️',
      forEveryone: {
        dhikrRecommendations: [
          {
            arabicText: 'يَا نُور',
            transliteration: 'Yā Nūr',
            translation: 'O Light',
            count: 256,
            timing: 'After Fajr or sunrise',
            benefits: 'For clarity, guidance, and spiritual illumination',
          },
        ],
        quranGuidance: [commonQuran.alIkhlas],
        duaRecommendations: [duaKnowledge],
        spiritualIntentions: [
          'Seek guidance and clarity in leadership of the self',
          'Ask Allah to illuminate the heart',
        ],
        sunnahPractices: baseSunnah,
        adab: baseAdab,
      },
      forPractitioners: basePractitioner,
    },
    naturalAlignment: {
      description: 'Inner illumination can support responsible leadership and purpose.',
      note: 'Spiritual practice is primary; worldly alignment is secondary.',
    },
    traditionalContext: baseTraditionalContext,
  },
  Saturn: {
    spiritualGuidance: {
      title: 'Patience and Endurance',
      icon: '🪨',
      forEveryone: {
        dhikrRecommendations: [
          {
            arabicText: 'يَا صَبُور',
            transliteration: 'Yā Ṣabūr',
            translation: 'O Most Patient',
            count: 298,
            timing: 'Before sleep or during trials',
            benefits: 'For patience, steadfastness, and inner stability',
          },
        ],
        quranGuidance: [commonQuran.ayatAlKursi],
        duaRecommendations: [duaProtectionMorning],
        spiritualIntentions: [
          'Seek patience, endurance, and spiritual steadiness',
          'Ask for relief from hardship and worry',
        ],
        sunnahPractices: baseSunnah,
        adab: baseAdab,
      },
      forPractitioners: basePractitioner,
    },
    naturalAlignment: {
      description: 'Steady spiritual practice can support resilience in daily challenges.',
      note: 'Spiritual practice is primary; worldly alignment is secondary.',
    },
    traditionalContext: baseTraditionalContext,
  },
};

const frenchGuidance: GuidanceMap = {
  Mars: {
    spiritualGuidance: {
      title: 'Travail Spirituel Protecteur',
      icon: '🛡️',
      forEveryone: {
        dhikrRecommendations: [
          {
            arabicText: 'يَا قَهَّار',
            transliteration: 'Yā Qahhār',
            translation: 'Ô Dominateur, Ô Celui qui subjugue',
            count: 100,
            timing: 'Après Maghrib ou avant le sommeil',
            benefits: 'Pour la protection spirituelle et la force face aux adversaires',
          },
          {
            arabicText: 'يَا قَوِيّ',
            transliteration: 'Yā Qawī',
            translation: 'Ô Le Plus Fort',
            count: 41,
            timing: 'Après la prière avec respiration posée',
            benefits: 'Pour la force intérieure et la résilience',
          },
          {
            arabicText: 'يَا عَزِيز',
            transliteration: 'Yā ‘Azīz',
            translation: 'Ô Puissant, Ô Invincible',
            count: 94,
            timing: 'Après la prière avec intention concentrée',
            benefits: 'Pour l’honneur, la dignité et la protection contre l’humiliation',
          },
        ],
        quranGuidance: [commonQuran.ayatAlKursi, commonQuran.alFalaq, commonQuran.anNas],
        duaRecommendations: [duaProtectionMorning, duaProtectionEnemies],
        spiritualIntentions: [
          'Chercher la protection contre le mal, l’envie et l’oppression',
          'Demander la fermeté du cœur et le courage dans l’épreuve',
        ],
        sunnahPractices: [
          ...baseSunnah,
          'Jeûner ce jour si possible pour la fortification spirituelle',
        ],
        adab: baseAdab,
      },
      forPractitioners: {
        ...basePractitioner,
        advancedApplications: [
          'Talismans protecteurs (ḥijāb), ruqyah, wafq défensif',
          'Retraites de renforcement avec discipline supervisée',
        ],
      },
    },
    naturalAlignment: {
      description:
        'Quand l’énergie spirituelle soutient la protection et la force, elle peut aider naturellement les situations demandant courage et fermeté.',
      note: 'Rappel : la pratique spirituelle est prioritaire ; l’alignement mondain est secondaire.',
    },
    traditionalContext: baseTraditionalContext,
  },
  Venus: {
    spiritualGuidance: {
      title: 'Harmonie et Relations',
      icon: '💗',
      forEveryone: {
        dhikrRecommendations: [commonDhikr.alWadud, commonDhikr.arRahman],
        quranGuidance: [commonQuran.alIkhlas, commonQuran.ayatAlKursi],
        duaRecommendations: [duaProtectionMorning],
        spiritualIntentions: [
          'Chercher la miséricorde, la douceur et l’harmonie familiale',
          'Demander à Allah d’adoucir les cœurs et d’accroître l’affection',
        ],
        sunnahPractices: baseSunnah,
        adab: baseAdab,
      },
      forPractitioners: {
        ...basePractitioner,
        advancedApplications: [
          'Invocations de réconciliation sous supervision',
          'Pratiques traditionnelles d’harmonie avec adab',
        ],
      },
    },
    naturalAlignment: {
      description:
        'Le timing doux peut soutenir la compassion et la réconciliation dans la vie quotidienne.',
      note: 'La pratique spirituelle est prioritaire ; l’alignement mondain est secondaire.',
    },
    traditionalContext: baseTraditionalContext,
  },
  Mercury: {
    spiritualGuidance: {
      title: 'Étude et Sagesse',
      icon: '📚',
      forEveryone: {
        dhikrRecommendations: [
          {
            arabicText: 'يَا عَلِيم',
            transliteration: 'Yā ‘Alīm',
            translation: 'Ô Omniscient',
            count: 150,
            timing: 'Après Fajr ou avant l’étude',
            benefits: 'Pour la clarté, la mémoire et la connaissance bénéfique',
          },
        ],
        quranGuidance: [commonQuran.alIkhlas],
        duaRecommendations: [duaKnowledge],
        spiritualIntentions: [
          'Chercher une connaissance bénéfique qui rapproche d’Allah',
          'Demander la clarté et la protection contre la confusion',
        ],
        sunnahPractices: baseSunnah,
        adab: baseAdab,
      },
      forPractitioners: basePractitioner,
    },
    naturalAlignment: {
      description: 'La clarté spirituelle peut soutenir l’étude et la communication au quotidien.',
      note: 'La pratique spirituelle est prioritaire ; l’alignement mondain est secondaire.',
    },
    traditionalContext: baseTraditionalContext,
  },
  Jupiter: {
    spiritualGuidance: {
      title: 'Provision et Prospérité',
      icon: '🌾',
      forEveryone: {
        dhikrRecommendations: [
          {
            arabicText: 'يَا رَزَّاق',
            transliteration: 'Yā Razzāq',
            translation: 'Ô Pourvoyeur',
            count: 308,
            timing: 'Après Dhuhr ou le matin',
            benefits: 'Pour chercher une provision halal et la barakah',
          },
        ],
        quranGuidance: [commonQuran.ayatAlKursi],
        duaRecommendations: [duaProvision],
        spiritualIntentions: [
          'Chercher une provision halal et la gratitude dans le gagne-pain',
          'Demander la barakah dans le travail et la charité',
        ],
        sunnahPractices: baseSunnah,
        adab: baseAdab,
      },
      forPractitioners: basePractitioner,
    },
    naturalAlignment: {
      description: 'La générosité spirituelle peut soutenir une planification responsable et la provision.',
      note: 'La pratique spirituelle est prioritaire ; l’alignement mondain est secondaire.',
    },
    traditionalContext: baseTraditionalContext,
  },
  Moon: {
    spiritualGuidance: {
      title: 'Voyage et Changement',
      icon: '🧭',
      forEveryone: {
        dhikrRecommendations: [commonDhikr.arRahman],
        quranGuidance: [commonQuran.alFalaq, commonQuran.anNas],
        duaRecommendations: [duaProtectionMorning],
        spiritualIntentions: [
          'Chercher protection et aisance lors des déplacements et transitions',
          'Demander la sérénité du cœur et de bons résultats',
        ],
        sunnahPractices: baseSunnah,
        adab: baseAdab,
      },
      forPractitioners: basePractitioner,
    },
    naturalAlignment: {
      description: 'Le calme spirituel peut soutenir les transitions et l’équilibre émotionnel.',
      note: 'La pratique spirituelle est prioritaire ; l’alignement mondain est secondaire.',
    },
    traditionalContext: baseTraditionalContext,
  },
  Sun: {
    spiritualGuidance: {
      title: 'Force et Illumination',
      icon: '☀️',
      forEveryone: {
        dhikrRecommendations: [
          {
            arabicText: 'يَا نُور',
            transliteration: 'Yā Nūr',
            translation: 'Ô Lumière',
            count: 256,
            timing: 'Après Fajr ou au lever du soleil',
            benefits: 'Pour la clarté, la guidance et l’illumination spirituelle',
          },
        ],
        quranGuidance: [commonQuran.alIkhlas],
        duaRecommendations: [duaKnowledge],
        spiritualIntentions: [
          'Chercher la guidance et la clarté intérieure',
          'Demander à Allah d’illuminer le cœur',
        ],
        sunnahPractices: baseSunnah,
        adab: baseAdab,
      },
      forPractitioners: basePractitioner,
    },
    naturalAlignment: {
      description: 'L’illumination intérieure peut soutenir un leadership responsable et le sens du but.',
      note: 'La pratique spirituelle est prioritaire ; l’alignement mondain est secondaire.',
    },
    traditionalContext: baseTraditionalContext,
  },
  Saturn: {
    spiritualGuidance: {
      title: 'Patience et Endurance',
      icon: '🪨',
      forEveryone: {
        dhikrRecommendations: [
          {
            arabicText: 'يَا صَبُور',
            transliteration: 'Yā Ṣabūr',
            translation: 'Ô Le Très Patient',
            count: 298,
            timing: 'Avant le sommeil ou dans l’épreuve',
            benefits: 'Pour la patience, la constance et la stabilité intérieure',
          },
        ],
        quranGuidance: [commonQuran.ayatAlKursi],
        duaRecommendations: [duaProtectionMorning],
        spiritualIntentions: [
          'Chercher la patience et la stabilité spirituelle',
          'Demander le soulagement des difficultés',
        ],
        sunnahPractices: baseSunnah,
        adab: baseAdab,
      },
      forPractitioners: basePractitioner,
    },
    naturalAlignment: {
      description: 'La constance spirituelle peut soutenir la résilience dans les épreuves.',
      note: 'La pratique spirituelle est prioritaire ; l’alignement mondain est secondaire.',
    },
    traditionalContext: baseTraditionalContext,
  },
};

const guidanceByLanguage: LocalizedGuidance = {
  en: englishGuidance,
  fr: frenchGuidance,
};

export function getClassicalWisdomGuidance(planet: Planet | null, language: SupportedLanguage): ClassicalWisdomGuidance {
  const langKey = language === 'fr' ? 'fr' : 'en';
  const selectedPlanet = planet ?? 'Sun';
  return guidanceByLanguage[langKey][selectedPlanet];
}
