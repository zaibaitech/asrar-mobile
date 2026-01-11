/**
 * Planet Detail Service - Ilm al-Asrār / Ilm al-Nujūm
 * ====================================================
 * Provides comprehensive ruhani (spiritual) planet profiles
 * Combines traditional timing wisdom with practical spiritual guidance
 * 
 * IMPORTANT: All content is presented as "traditionally practiced" or "for reflection"
 * No claims of certainty or guarantees. Respectful Islamic adab throughout.
 */

import type { Element } from './MomentAlignmentService';
import { calculatePlanetaryHours } from './PlanetaryHoursService';
import {
    getPlanetTransitNow,
    getPlanetTransitSnapshot,
    type PlanetTransitSnapshot,
    type ZodiacSign,
} from './PlanetTransitService';

// ========================================
// TYPE DEFINITIONS
// ========================================

export interface BilingualText {
  en: string;
  fr: string;
  ar?: string;
}

export type TimingWindowKey = 
  | 'afterFajr' 
  | 'sunrise' 
  | 'midday' 
  | 'afterAsr' 
  | 'afterMaghrib' 
  | 'night' 
  | 'lastThirdNight';

export interface RuhaniTiming {
  generalWindow: {
    key: TimingWindowKey;
    labelKey: string;
    fallbackEN: string;
    fallbackFR: string;
  };
  planetaryHour?: {
    planetId: string;
    hourIndex: number;
    startISO?: string;
    endISO?: string;
  };
  dayRuler?: string;
  notes: BilingualText;
}

export interface RuhaniPractice {
  title: BilingualText;
  steps: BilingualText[];
  recommendedCount?: number; // Presented as "traditionally reported", not mandatory
  durationHint?: BilingualText;
  adab: BilingualText[];
  cautions: BilingualText[];
}

export interface DivineName {
  id: string; // e.g., "alWadud"
  ar: string;
  latin: string;
  meaning: BilingualText;
  whyThisMatches: BilingualText;
  countSuggestion: BilingualText; // e.g., "odd counts / 33 / 99"
  timingSuggestion: BilingualText;
}

export interface PremiumRuhaniLayer {
  divineNames: DivineName[];
  incenseByDay?: Array<{
    weekday: number;
    name: BilingualText;
  }>;
  personalization: {
    requiredInputs: Array<'userName' | 'motherName' | 'dob' | 'intention'>;
    whyNeeded: BilingualText;
  };
}

export interface PlanetSnapshot {
  planetId: string;
  planetName: BilingualText;
  symbol: string;
  arabicName: string;
  nowLabel: BilingualText;
  
  // Full transit snapshot (NEW - astronomical data)
  transitSnapshot?: PlanetTransitSnapshot;
  
  // Astrological positioning
  sign?: {
    key: ZodiacSign;
    label: BilingualText;
    arabic?: string;
  };
  element?: {
    key: Element;
    label: BilingualText;
  };
  
  // Rulership context
  dayRuler?: BilingualText;
  hourRuler?: BilingualText;
  timingStatus?: {
    level: 'supportive' | 'neutral' | 'caution';
    label: BilingualText;
  };
  
  // Ruhani guidance (free layer)
  ruhaniFocus: BilingualText[]; // What this planet supports (3-5 bullets)
  cautions: BilingualText[]; // What to avoid (2-4 bullets)
  
  // Timing windows (free basic)
  timing: RuhaniTiming;
  
  // Practice method (free basic)
  practice: RuhaniPractice;
  
  // Personal resonance (basic - always available)
  resonance?: {
    score: number; // 0-100
    label: BilingualText; // "Supportive", "Neutral", "Challenging"
    why: BilingualText;
  };
  
  // Premium spiritual layer
  premium?: PremiumRuhaniLayer;
}

export interface PlanetDetailParams {
  planetId: string;
  mode: 'now' | 'next';
  signKey?: ZodiacSign;
  elementKey?: Element;
  hourIndex?: number;
  timestamp?: number;
  
  // User context for personalization
  userElement?: Element;
  userName?: string;
  motherName?: string;
  userDOB?: string;
  isPremium?: boolean;
}

// ========================================
// RUHANI PLANET PROFILES
// ========================================

interface PlanetRuhaniProfile {
  ruhaniFocus: BilingualText[];
  cautions: BilingualText[];
  timing: {
    generalWindow: TimingWindowKey;
    notes: BilingualText;
  };
  practice: {
    title: BilingualText;
    steps: BilingualText[];
    recommendedCount?: number;
    durationHint?: BilingualText;
    adab: BilingualText[];
  };
  premiumDivineNames: DivineName[];
}

const PLANET_RUHANI_PROFILES: Record<string, PlanetRuhaniProfile> = {
  sun: {
    ruhaniFocus: [
      { 
        en: 'Clarity of purpose and spiritual intention (niyyah)',
        fr: 'Clarté du but et de l\'intention spirituelle (niyyah)',
      },
      {
        en: 'Leadership in spiritual matters and community service',
        fr: 'Leadership dans les questions spirituelles et le service communautaire',
      },
      {
        en: 'Connection with higher guidance and divine light',
        fr: 'Connexion avec la guidance supérieure et la lumière divine',
      },
      {
        en: 'Vitality in worship and spiritual practices',
        fr: 'Vitalité dans le culte et les pratiques spirituelles',
      },
    ],
    cautions: [
      {
        en: 'Avoid spiritual pride (kibr) or self-importance',
        fr: 'Éviter l\'orgueil spirituel (kibr) ou la suffisance',
      },
      {
        en: 'Do not neglect humility before Allah',
        fr: 'Ne pas négliger l\'humilité devant Allah',
      },
      {
        en: 'Balance outward action with inward reflection',
        fr: 'Équilibrer l\'action extérieure avec la réflexion intérieure',
      },
    ],
    timing: {
      generalWindow: 'sunrise',
      notes: {
        en: 'Traditionally practiced after Fajr prayer through sunrise. The Sun\'s hour brings clarity and spiritual vitality.',
        fr: 'Traditionnellement pratiqué après la prière de Fajr jusqu\'au lever du soleil. L\'heure du Soleil apporte clarté et vitalité spirituelle.',
      },
    },
    practice: {
      title: {
        en: 'Solar Practice for Clarity',
        fr: 'Pratique Solaire pour la Clarté',
      },
      steps: [
        {
          en: 'Make intention (niyyah) for spiritual clarity',
          fr: 'Formuler l\'intention (niyyah) pour la clarté spirituelle',
        },
        {
          en: 'Perform fresh wudu facing the rising sun',
          fr: 'Effectuer des ablutions fraîches face au soleil levant',
        },
        {
          en: 'Recite Salawat upon the Prophet ﷺ (3x)',
          fr: 'Réciter Salawat sur le Prophète ﷺ (3x)',
        },
        {
          en: 'Reflect on Surah ash-Shams (91) - The Sun',
          fr: 'Réfléchir sur Sourate ash-Shams (91) - Le Soleil',
        },
        {
          en: 'Make duʿā for clear guidance in your affairs',
          fr: 'Faire duʿā pour une guidance claire dans vos affaires',
        },
      ],
      recommendedCount: 3,
      durationHint: {
        en: '10-15 minutes after Fajr',
        fr: '10-15 minutes après Fajr',
      },
      adab: [
        {
          en: 'Face qibla or the rising sun',
          fr: 'Face à la qibla ou au soleil levant',
        },
        {
          en: 'Begin and end with Salawat',
          fr: 'Commencer et terminer par Salawat',
        },
        {
          en: 'Maintain wudu throughout',
          fr: 'Maintenir wudu tout au long',
        },
      ],
    },
    premiumDivineNames: [
      {
        id: 'anNur',
        ar: 'النور',
        latin: 'An-Nūr',
        meaning: {
          en: 'The Light, The Illuminator',
          fr: 'La Lumière, L\'Illuminateur',
        },
        whyThisMatches: {
          en: 'An-Nūr aligns with the Sun\'s nature of illumination and clarity',
          fr: 'An-Nūr s\'aligne avec la nature d\'illumination et de clarté du Soleil',
        },
        countSuggestion: {
          en: 'Odd counts: 11, 33, or 99 times',
          fr: 'Nombres impairs: 11, 33 ou 99 fois',
        },
        timingSuggestion: {
          en: 'After Fajr during the solar planetary hour',
          fr: 'Après Fajr pendant l\'heure planétaire solaire',
        },
      },
      {
        id: 'alHadi',
        ar: 'الهادي',
        latin: 'Al-Hādī',
        meaning: {
          en: 'The Guide, The One Who Guides',
          fr: 'Le Guide, Celui Qui Guide',
        },
        whyThisMatches: {
          en: 'Al-Hādī complements the Sun\'s role in providing direction',
          fr: 'Al-Hādī complète le rôle du Soleil pour fournir la direction',
        },
        countSuggestion: {
          en: 'Personalized to your name value or 99',
          fr: 'Personnalisé à la valeur de votre nom ou 99',
        },
        timingSuggestion: {
          en: 'Sunrise to mid-morning',
          fr: 'Du lever du soleil au milieu de la matinée',
        },
      },
    ],
  },

  moon: {
    ruhaniFocus: [
      {
        en: 'Emotional healing and inner purification',
        fr: 'Guérison émotionnelle et purification intérieure',
      },
      {
        en: 'Connection with family and spiritual lineage',
        fr: 'Connexion avec la famille et la lignée spirituelle',
      },
      {
        en: 'Intuitive understanding and receptivity to guidance',
        fr: 'Compréhension intuitive et réceptivité à la guidance',
      },
      {
        en: 'Nurturing spiritual practices and patience',
        fr: 'Nourrir les pratiques spirituelles et la patience',
      },
    ],
    cautions: [
      {
        en: 'Avoid excessive emotional reactions',
        fr: 'Éviter les réactions émotionnelles excessives',
      },
      {
        en: 'Do not dwell in spiritual passivity',
        fr: 'Ne pas rester dans la passivité spirituelle',
      },
      {
        en: 'Balance intuition with knowledge',
        fr: 'Équilibrer l\'intuition avec la connaissance',
      },
    ],
    timing: {
      generalWindow: 'night',
      notes: {
        en: 'Traditionally practiced after Isha or during the last third of the night. The Moon\'s hour brings receptivity and emotional depth.',
        fr: 'Traditionnellement pratiqué après Isha ou pendant le dernier tiers de la nuit. L\'heure de la Lune apporte réceptivité et profondeur émotionnelle.',
      },
    },
    practice: {
      title: {
        en: 'Lunar Practice for Inner Peace',
        fr: 'Pratique Lunaire pour la Paix Intérieure',
      },
      steps: [
        {
          en: 'Make intention for emotional healing and clarity',
          fr: 'Formuler l\'intention pour la guérison émotionnelle et la clarté',
        },
        {
          en: 'Perform wudu with mindful presence',
          fr: 'Effectuer wudu avec présence attentive',
        },
        {
          en: 'Pray 2 rakʿat of tahajjud (optional night prayer)',
          fr: 'Prier 2 rakʿat de tahajjud (prière nocturne optionnelle)',
        },
        {
          en: 'Recite Ayat al-Kursi (Quran 2:255) with reflection',
          fr: 'Réciter Ayat al-Kursi (Coran 2:255) avec réflexion',
        },
        {
          en: 'Make duʿā for family and emotional healing',
          fr: 'Faire duʿā pour la famille et la guérison émotionnelle',
        },
      ],
      recommendedCount: 1,
      durationHint: {
        en: '15-20 minutes in stillness',
        fr: '15-20 minutes dans le calme',
      },
      adab: [
        {
          en: 'Practice in a quiet, dimly lit space',
          fr: 'Pratiquer dans un espace calme et faiblement éclairé',
        },
        {
          en: 'Sit with humility and receptivity',
          fr: 'S\'asseoir avec humilité et réceptivité',
        },
        {
          en: 'Lower the gaze and soften the heart',
          fr: 'Baisser le regard et adoucir le cœur',
        },
      ],
    },
    premiumDivineNames: [
      {
        id: 'alWadud',
        ar: 'الودود',
        latin: 'Al-Wadūd',
        meaning: {
          en: 'The Loving, The Most Affectionate',
          fr: 'L\'Aimant, Le Très Affectueux',
        },
        whyThisMatches: {
          en: 'Al-Wadūd aligns with the Moon\'s nurturing and emotional nature',
          fr: 'Al-Wadūd s\'aligne avec la nature nourricière et émotionnelle de la Lune',
        },
        countSuggestion: {
          en: 'Count tied to your lunar mansion or 99',
          fr: 'Nombre lié à votre mansion lunaire ou 99',
        },
        timingSuggestion: {
          en: 'After Isha during the lunar hour',
          fr: 'Après Isha pendant l\'heure lunaire',
        },
      },
      {
        id: 'arRahman',
        ar: 'الرحمن',
        latin: 'Ar-Raḥmān',
        meaning: {
          en: 'The Most Merciful, The Beneficent',
          fr: 'Le Très Miséricordieux, Le Bienfaiteur',
        },
        whyThisMatches: {
          en: 'Ar-Raḥmān complements the Moon\'s receptive and compassionate energy',
          fr: 'Ar-Raḥmān complète l\'énergie réceptive et compassionnelle de la Lune',
        },
        countSuggestion: {
          en: '100 or 1000 for deep transformation',
          fr: '100 ou 1000 pour une transformation profonde',
        },
        timingSuggestion: {
          en: 'Last third of the night',
          fr: 'Dernier tiers de la nuit',
        },
      },
    ],
  },

  // Adding Mars, Mercury, Jupiter, Venus, Saturn below...
  
  mars: {
    ruhaniFocus: [
      {
        en: 'Courage in facing spiritual challenges',
        fr: 'Courage pour affronter les défis spirituels',
      },
      {
        en: 'Discipline in worship and consistent practice',
        fr: 'Discipline dans le culte et la pratique constante',
      },
      {
        en: 'Protection from spiritual harm and negativity',
        fr: 'Protection contre le mal spirituel et la négativité',
      },
      {
        en: 'Overcoming nafs (lower self) and attachments',
        fr: 'Surmonter le nafs (soi inférieur) et les attachements',
      },
    ],
    cautions: [
      {
        en: 'Avoid spiritual aggression or harsh judgment',
        fr: 'Éviter l\'agressivité spirituelle ou le jugement sévère',
      },
      {
        en: 'Do not rush spiritual progress',
        fr: 'Ne pas précipiter le progrès spirituel',
      },
      {
        en: 'Balance action with patience (sabr)',
        fr: 'Équilibrer l\'action avec la patience (sabr)',
      },
    ],
    timing: {
      generalWindow: 'afterFajr',
      notes: {
        en: 'Traditionally practiced early morning after Fajr. Mars hour supports discipline and overcoming obstacles.',
        fr: 'Traditionnellement pratiqué tôt le matin après Fajr. L\'heure de Mars soutient la discipline et surmonter les obstacles.',
      },
    },
    practice: {
      title: {
        en: 'Martial Practice for Discipline',
        fr: 'Pratique Martiale pour la Discipline',
      },
      steps: [
        {
          en: 'Set firm intention to overcome a specific spiritual challenge',
          fr: 'Définir une intention ferme de surmonter un défi spirituel spécifique',
        },
        {
          en: 'Make fresh wudu with focus and determination',
          fr: 'Faire des ablutions fraîches avec concentration et détermination',
        },
        {
          en: 'Recite Ayat al-Kursi for protection',
          fr: 'Réciter Ayat al-Kursi pour la protection',
        },
        {
          en: 'Reflect on Surah al-Falaq (113) and an-Nas (114)',
          fr: 'Réfléchir sur Sourate al-Falaq (113) et an-Nas (114)',
        },
        {
          en: 'Make duʿā for strength and perseverance',
          fr: 'Faire duʿā pour la force et la persévérance',
        },
      ],
      recommendedCount: 7,
      durationHint: {
        en: '10-15 minutes with focus',
        fr: '10-15 minutes avec concentration',
      },
      adab: [
        {
          en: 'Maintain upright posture',
          fr: 'Maintenir une posture droite',
        },
        {
          en: 'Speak firmly but humbly',
          fr: 'Parler fermement mais humblement',
        },
        {
          en: 'Avoid anger or frustration',
          fr: 'Éviter la colère ou la frustration',
        },
      ],
    },
    premiumDivineNames: [
      {
        id: 'alQawi',
        ar: 'القوي',
        latin: 'Al-Qawī',
        meaning: {
          en: 'The Strong, The Most Powerful',
          fr: 'Le Fort, Le Plus Puissant',
        },
        whyThisMatches: {
          en: 'Al-Qawī aligns with Mars\' energy of strength and fortitude',
          fr: 'Al-Qawī s\'aligne avec l\'énergie de force et de courage de Mars',
        },
        countSuggestion: {
          en: 'Multiples of 7 (7, 14, 49)',
          fr: 'Multiples de 7 (7, 14, 49)',
        },
        timingSuggestion: {
          en: 'Tuesday or during Mars hour',
          fr: 'Mardi ou pendant l\'heure de Mars',
        },
      },
    ],
  },

  mercury: {
    ruhaniFocus: [
      {
        en: 'Clarity in spiritual communication and teaching',
        fr: 'Clarté dans la communication spirituelle et l\'enseignement',
      },
      {
        en: 'Learning sacred knowledge with understanding',
        fr: 'Apprendre la connaissance sacrée avec compréhension',
      },
      {
        en: 'Wisdom in speech and spiritual discourse',
        fr: 'Sagesse dans la parole et le discours spirituel',
      },
      {
        en: 'Mental clarity in dhikr and contemplation',
        fr: 'Clarté mentale dans le dhikr et la contemplation',
      },
    ],
    cautions: [
      {
        en: 'Avoid excessive intellectualizing of faith',
        fr: 'Éviter l\'intellectualisation excessive de la foi',
      },
      {
        en: 'Do not prioritize knowledge over practice',
        fr: 'Ne pas prioriser la connaissance sur la pratique',
      },
      {
        en: 'Guard against spiritual gossip or idle talk',
        fr: 'Se protéger contre les ragots spirituels ou les paroles vaines',
      },
    ],
    timing: {
      generalWindow: 'afterAsr',
      notes: {
        en: 'Traditionally practiced afternoon after Asr. Mercury hour supports learning and clear communication.',
        fr: 'Traditionnellement pratiqué l\'après-midi après Asr. L\'heure de Mercure soutient l\'apprentissage et la communication claire.',
      },
    },
    practice: {
      title: {
        en: 'Mercurial Practice for Wisdom',
        fr: 'Pratique Mercurielle pour la Sagesse',
      },
      steps: [
        {
          en: 'Intend to gain beneficial knowledge',
          fr: 'Avoir l\'intention d\'acquérir une connaissance bénéfique',
        },
        {
          en: 'Perform wudu with mindfulness',
          fr: 'Effectuer wudu avec pleine conscience',
        },
        {
          en: 'Recite Bismillah before studying sacred texts',
          fr: 'Réciter Bismillah avant d\'étudier les textes sacrés',
        },
        {
          en: 'Read and contemplate Quranic verses',
          fr: 'Lire et contempler des versets coraniques',
        },
        {
          en: 'Make duʿā for understanding and retention',
          fr: 'Faire duʿā pour la compréhension et la rétention',
        },
      ],
      recommendedCount: 5,
      durationHint: {
        en: '20-30 minutes of study',
        fr: '20-30 minutes d\'étude',
      },
      adab: [
        {
          en: 'Study with a teacher when possible',
          fr: 'Étudier avec un enseignant si possible',
        },
        {
          en: 'Take notes respectfully',
          fr: 'Prendre des notes respectueusement',
        },
        {
          en: 'Apply knowledge in practice',
          fr: 'Appliquer la connaissance dans la pratique',
        },
      ],
    },
    premiumDivineNames: [
      {
        id: 'alAlim',
        ar: 'العليم',
        latin: 'Al-ʿAlīm',
        meaning: {
          en: 'The All-Knowing, The Omniscient',
          fr: 'L\'Omniscient, Celui Qui Sait Tout',
        },
        whyThisMatches: {
          en: 'Al-ʿAlīm aligns with Mercury\'s domain of knowledge and learning',
          fr: 'Al-ʿAlīm s\'aligne avec le domaine de la connaissance et de l\'apprentissage de Mercure',
        },
        countSuggestion: {
          en: '5, 33, or 99 times',
          fr: '5, 33 ou 99 fois',
        },
        timingSuggestion: {
          en: 'Wednesday or during Mercury hour',
          fr: 'Mercredi ou pendant l\'heure de Mercure',
        },
      },
    ],
  },

  jupiter: {
    ruhaniFocus: [
      {
        en: 'Expansion of spiritual understanding and wisdom',
        fr: 'Expansion de la compréhension spirituelle et de la sagesse',
      },
      {
        en: 'Generosity in teaching and sharing knowledge',
        fr: 'Générosité dans l\'enseignement et le partage des connaissances',
      },
      {
        en: 'Long-term spiritual growth and patience',
        fr: 'Croissance spirituelle à long terme et patience',
      },
      {
        en: 'Gratitude (shukr) and trust in divine provision',
        fr: 'Gratitude (shukr) et confiance en la provision divine',
      },
    ],
    cautions: [
      {
        en: 'Avoid spiritual overextension or excess',
        fr: 'Éviter la surextension spirituelle ou l\'excès',
      },
      {
        en: 'Do not neglect practical details',
        fr: 'Ne pas négliger les détails pratiques',
      },
      {
        en: 'Balance optimism with realism',
        fr: 'Équilibrer l\'optimisme avec le réalisme',
      },
    ],
    timing: {
      generalWindow: 'afterMaghrib',
      notes: {
        en: 'Traditionally practiced after Maghrib. Jupiter hour supports spiritual expansion and gratitude.',
        fr: 'Traditionnellement pratiqué après Maghrib. L\'heure de Jupiter soutient l\'expansion spirituelle et la gratitude.',
      },
    },
    practice: {
      title: {
        en: 'Jovian Practice for Expansion',
        fr: 'Pratique Jovienne pour l\'Expansion',
      },
      steps: [
        {
          en: 'Set intention for spiritual growth and gratitude',
          fr: 'Définir l\'intention pour la croissance spirituelle et la gratitude',
        },
        {
          en: 'Perform wudu with thanksgiving',
          fr: 'Effectuer wudu avec action de grâces',
        },
        {
          en: 'Recite Salawat upon the Prophet ﷺ (11x)',
          fr: 'Réciter Salawat sur le Prophète ﷺ (11x)',
        },
        {
          en: 'Reflect on blessings and make shukr',
          fr: 'Réfléchir sur les bénédictions et faire shukr',
        },
        {
          en: 'Make duʿā for expansion in beneficial knowledge',
          fr: 'Faire duʿā pour l\'expansion dans la connaissance bénéfique',
        },
      ],
      recommendedCount: 11,
      durationHint: {
        en: '15-20 minutes with gratitude',
        fr: '15-20 minutes avec gratitude',
      },
      adab: [
        {
          en: 'Practice with expansive heart',
          fr: 'Pratiquer avec un cœur expansif',
        },
        {
          en: 'Share blessings with others',
          fr: 'Partager les bénédictions avec les autres',
        },
        {
          en: 'Maintain humility in abundance',
          fr: 'Maintenir l\'humilité dans l\'abondance',
        },
      ],
    },
    premiumDivineNames: [
      {
        id: 'alWasih',
        ar: 'الواسع',
        latin: 'Al-Wāsiʿ',
        meaning: {
          en: 'The All-Encompassing, The Vast',
          fr: 'L\'Englobant, Le Vaste',
        },
        whyThisMatches: {
          en: 'Al-Wāsiʿ aligns with Jupiter\'s expansive nature',
          fr: 'Al-Wāsiʿ s\'aligne avec la nature expansive de Jupiter',
        },
        countSuggestion: {
          en: '11, 33, or personalized count',
          fr: '11, 33 ou nombre personnalisé',
        },
        timingSuggestion: {
          en: 'Thursday or during Jupiter hour',
          fr: 'Jeudi ou pendant l\'heure de Jupiter',
        },
      },
    ],
  },

  venus: {
    ruhaniFocus: [
      {
        en: 'Harmony in spiritual relationships and community',
        fr: 'Harmonie dans les relations spirituelles et la communauté',
      },
      {
        en: 'Beauty in worship and devotional practice',
        fr: 'Beauté dans le culte et la pratique dévotionnelle',
      },
      {
        en: 'Loving-kindness (rahmah) towards creation',
        fr: 'Bonté-aimante (rahmah) envers la création',
      },
      {
        en: 'Balance and moderation in spiritual life',
        fr: 'Équilibre et modération dans la vie spirituelle',
      },
    ],
    cautions: [
      {
        en: 'Avoid attachment to spiritual comfort',
        fr: 'Éviter l\'attachement au confort spirituel',
      },
      {
        en: 'Do not prioritize aesthetics over sincerity',
        fr: 'Ne pas prioriser l\'esthétique sur la sincérité',
      },
      {
        en: 'Balance love with discipline',
        fr: 'Équilibrer l\'amour avec la discipline',
      },
    ],
    timing: {
      generalWindow: 'afterMaghrib',
      notes: {
        en: 'Traditionally practiced after Maghrib or early evening. Venus hour supports harmony and devotional beauty.',
        fr: 'Traditionnellement pratiqué après Maghrib ou en début de soirée. L\'heure de Vénus soutient l\'harmonie et la beauté dévotionnelle.',
      },
    },
    practice: {
      title: {
        en: 'Venusian Practice for Harmony',
        fr: 'Pratique Vénusienne pour l\'Harmonie',
      },
      steps: [
        {
          en: 'Intend to beautify your spiritual practice',
          fr: 'Avoir l\'intention d\'embellir votre pratique spirituelle',
        },
        {
          en: 'Perform wudu with care and attention',
          fr: 'Effectuer wudu avec soin et attention',
        },
        {
          en: 'Recite beautiful Quranic verses (e.g., Surah ar-Rahman)',
          fr: 'Réciter de beaux versets coraniques (ex: Sourate ar-Rahman)',
        },
        {
          en: 'Practice dhikr with love and presence',
          fr: 'Pratiquer le dhikr avec amour et présence',
        },
        {
          en: 'Make duʿā for harmony in relationships',
          fr: 'Faire duʿā pour l\'harmonie dans les relations',
        },
      ],
      recommendedCount: 6,
      durationHint: {
        en: '15-25 minutes with gentleness',
        fr: '15-25 minutes avec douceur',
      },
      adab: [
        {
          en: 'Practice in a clean, pleasant space',
          fr: 'Pratiquer dans un espace propre et agréable',
        },
        {
          en: 'Use pleasant scents (halal)',
          fr: 'Utiliser des parfums agréables (halal)',
        },
        {
          en: 'Beautify intention and action',
          fr: 'Embellir l\'intention et l\'action',
        },
      ],
    },
    premiumDivineNames: [
      {
        id: 'alJamil',
        ar: 'الجميل',
        latin: 'Al-Jamīl',
        meaning: {
          en: 'The Beautiful, The Most Beautiful',
          fr: 'Le Beau, Le Plus Beau',
        },
        whyThisMatches: {
          en: 'Al-Jamīl aligns with Venus\' nature of beauty and harmony',
          fr: 'Al-Jamīl s\'aligne avec la nature de beauté et d\'harmonie de Vénus',
        },
        countSuggestion: {
          en: '6, 33, or 99 times',
          fr: '6, 33 ou 99 fois',
        },
        timingSuggestion: {
          en: 'Friday or during Venus hour',
          fr: 'Vendredi ou pendant l\'heure de Vénus',
        },
      },
    ],
  },

  saturn: {
    ruhaniFocus: [
      {
        en: 'Spiritual discipline and long-term commitment',
        fr: 'Discipline spirituelle et engagement à long terme',
      },
      {
        en: 'Patience (sabr) in trials and difficulties',
        fr: 'Patience (sabr) dans les épreuves et les difficultés',
      },
      {
        en: 'Building solid foundations in practice',
        fr: 'Construire des fondations solides dans la pratique',
      },
      {
        en: 'Wisdom gained through experience and reflection',
        fr: 'Sagesse acquise par l\'expérience et la réflexion',
      },
    ],
    cautions: [
      {
        en: 'Avoid spiritual rigidity or harshness',
        fr: 'Éviter la rigidité spirituelle ou la dureté',
      },
      {
        en: 'Do not fall into pessimism or despair',
        fr: 'Ne pas tomber dans le pessimisme ou le désespoir',
      },
      {
        en: 'Balance structure with mercy',
        fr: 'Équilibrer la structure avec la miséricorde',
        },
    ],
    timing: {
      generalWindow: 'lastThirdNight',
      notes: {
        en: 'Traditionally practiced in the last third of night or before Fajr. Saturn hour supports deep reflection and commitment.',
        fr: 'Traditionnellement pratiqué dans le dernier tiers de la nuit ou avant Fajr. L\'heure de Saturne soutient la réflexion profonde et l\'engagement.',
      },
    },
    practice: {
      title: {
        en: 'Saturnian Practice for Discipline',
        fr: 'Pratique Saturnienne pour la Discipline',
      },
      steps: [
        {
          en: 'Make intention for spiritual discipline and perseverance',
          fr: 'Formuler l\'intention pour la discipline spirituelle et la persévérance',
        },
        {
          en: 'Wake for tahajjud in the last third of night',
          fr: 'Se réveiller pour tahajjud dans le dernier tiers de la nuit',
        },
        {
          en: 'Perform slow, deliberate wudu',
          fr: 'Effectuer des ablutions lentes et délibérées',
        },
        {
          en: 'Pray 2-4 rakʿat with deep reflection',
          fr: 'Prier 2-4 rakʿat avec réflexion profonde',
        },
        {
          en: 'Make duʿā for patience and steadfastness',
          fr: 'Faire duʿā pour la patience et la constance',
        },
      ],
      recommendedCount: 1,
      durationHint: {
        en: '30-45 minutes in solitude',
        fr: '30-45 minutes en solitude',
      },
      adab: [
        {
          en: 'Practice in complete silence',
          fr: 'Pratiquer dans le silence complet',
        },
        {
          en: 'Maintain consistency over time',
          fr: 'Maintenir la cohérence dans le temps',
        },
        {
          en: 'Honor elders and teachers',
          fr: 'Honorer les aînés et les enseignants',
        },
      ],
    },
    premiumDivineNames: [
      {
        id: 'asSabur',
        ar: 'الصبور',
        latin: 'Aṣ-Ṣabūr',
        meaning: {
          en: 'The Patient, The Most Forbearing',
          fr: 'Le Patient, Le Très Patient',
        },
        whyThisMatches: {
          en: 'Aṣ-Ṣabūr aligns with Saturn\'s nature of patience and endurance',
          fr: 'Aṣ-Ṣabūr s\'aligne avec la nature de patience et d\'endurance de Saturne',
        },
        countSuggestion: {
          en: 'Long counts: 100, 300, or 1000',
          fr: 'Nombres longs: 100, 300 ou 1000',
        },
        timingSuggestion: {
          en: 'Saturday or last third of night',
          fr: 'Samedi ou dernier tiers de la nuit',
        },
      },
    ],
  },
};

// ========================================
// PLANET DATA MAPPINGS
// ========================================

const PLANET_NAMES: Record<string, BilingualText> = {
  sun: { en: 'Sun', fr: 'Soleil', ar: 'الشمس' },
  moon: { en: 'Moon', fr: 'Lune', ar: 'القمر' },
  mars: { en: 'Mars', fr: 'Mars', ar: 'المريخ' },
  mercury: { en: 'Mercury', fr: 'Mercure', ar: 'عطارد' },
  jupiter: { en: 'Jupiter', fr: 'Jupiter', ar: 'المشتري' },
  venus: { en: 'Venus', fr: 'Vénus', ar: 'الزهرة' },
  saturn: { en: 'Saturn', fr: 'Saturne', ar: 'زحل' },
};

const PLANET_SYMBOLS: Record<string, string> = {
  sun: '☉',
  moon: '☽',
  mars: '♂',
  mercury: '☿',
  jupiter: '♃',
  venus: '♀',
  saturn: '♄',
};

const ZODIAC_LABELS: Record<ZodiacSign, BilingualText> = {
  aries: { en: 'Aries', fr: 'Bélier', ar: 'الحمل' },
  taurus: { en: 'Taurus', fr: 'Taureau', ar: 'الثور' },
  gemini: { en: 'Gemini', fr: 'Gémeaux', ar: 'الجوزاء' },
  cancer: { en: 'Cancer', fr: 'Cancer', ar: 'السرطان' },
  leo: { en: 'Leo', fr: 'Lion', ar: 'الأسد' },
  virgo: { en: 'Virgo', fr: 'Vierge', ar: 'العذراء' },
  libra: { en: 'Libra', fr: 'Balance', ar: 'الميزان' },
  scorpio: { en: 'Scorpio', fr: 'Scorpion', ar: 'العقرب' },
  sagittarius: { en: 'Sagittarius', fr: 'Sagittaire', ar: 'القوس' },
  capricorn: { en: 'Capricorn', fr: 'Capricorne', ar: 'الجدي' },
  aquarius: { en: 'Aquarius', fr: 'Verseau', ar: 'الدلو' },
  pisces: { en: 'Pisces', fr: 'Poissons', ar: 'الحوت' },
};

const ELEMENT_LABELS: Record<Element, BilingualText> = {
  fire: { en: 'Fire', fr: 'Feu' },
  water: { en: 'Water', fr: 'Eau' },
  air: { en: 'Air', fr: 'Air' },
  earth: { en: 'Earth', fr: 'Terre' },
};

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Calculate resonance between user element and planet element
 */
function calculateResonance(userElement?: Element, planetElement?: Element): {
  score: number;
  label: BilingualText;
  why: BilingualText;
} {
  if (!userElement || !planetElement) {
    return {
      score: 50,
      label: { en: 'Neutral', fr: 'Neutre' },
      why: {
        en: 'Add your name to enable personalized resonance',
        fr: 'Ajoutez votre nom pour activer la résonance personnalisée',
      },
    };
  }

  const compatibility: Record<Element, { strong: Element[]; weak: Element[] }> = {
    fire: { strong: ['air', 'fire'], weak: ['water', 'earth'] },
    water: { strong: ['earth', 'water'], weak: ['fire', 'air'] },
    air: { strong: ['fire', 'air'], weak: ['earth', 'water'] },
    earth: { strong: ['water', 'earth'], weak: ['fire', 'air'] },
  };

  const userCompat = compatibility[userElement];
  if (userCompat.strong.includes(planetElement)) {
    return {
      score: 85,
      label: { en: 'Strong', fr: 'Fort' },
      why: {
        en: `Your ${userElement} element resonates strongly with ${planetElement}`,
        fr: `Votre élément ${userElement} résonne fortement avec ${planetElement}`,
      },
    };
  } else if (userCompat.weak.includes(planetElement)) {
    return {
      score: 35,
      label: { en: 'Weak', fr: 'Faible' },
      why: {
        en: `Your ${userElement} element is challenged by ${planetElement}`,
        fr: `Votre élément ${userElement} est défié par ${planetElement}`,
      },
    };
  } else {
    return {
      score: 60,
      label: { en: 'Moderate', fr: 'Modéré' },
      why: {
        en: `Your ${userElement} element has a moderate connection with ${planetElement}`,
        fr: `Votre élément ${userElement} a une connexion modérée avec ${planetElement}`,
      },
    };
  }
}

/**
 * Get day ruler based on weekday (0=Sunday, 1=Monday, etc.)
 */
function getDayRuler(weekday: number): { planet: string; ar: string; en: string; fr: string } {
  const dayRulers: Record<number, { planet: string; ar: string; en: string; fr: string }> = {
    0: { planet: 'sun', ar: 'الشمس', en: 'Sun', fr: 'Soleil' },
    1: { planet: 'moon', ar: 'القمر', en: 'Moon', fr: 'Lune' },
    2: { planet: 'mars', ar: 'المريخ', en: 'Mars', fr: 'Mars' },
    3: { planet: 'mercury', ar: 'عطارد', en: 'Mercury', fr: 'Mercure' },
    4: { planet: 'jupiter', ar: 'المشتري', en: 'Jupiter', fr: 'Jupiter' },
    5: { planet: 'venus', ar: 'الزهرة', en: 'Venus', fr: 'Vénus' },
    6: { planet: 'saturn', ar: 'زحل', en: 'Saturn', fr: 'Saturne' },
  };
  return dayRulers[weekday] || dayRulers[0];
}

/**
 * Get current planetary hour ruler
 */
function getCurrentHourRuler(
  sunrise: Date,
  sunset: Date,
  nextSunrise: Date,
  now: Date
): { planet: string; ar: string; en: string; fr: string } | null {
  try {
    const planetaryData = calculatePlanetaryHours(sunrise, sunset, nextSunrise, now);
    if (planetaryData && planetaryData.currentHour) {
      const { planet } = planetaryData.currentHour;
      const hourPlanet = planet.toLowerCase();

      // Find matching planet in dayRulers
      for (let i = 0; i < 7; i++) {
        const ruler = getDayRuler(i);
        if (ruler.planet === hourPlanet) {
          return ruler;
        }
      }

      // Fallback
      return { planet: hourPlanet, ar: '', en: planet, fr: planet };
    }
  } catch (error) {
    console.warn('Could not calculate planetary hour:', error);
  }
  return null;
}

/**
 * Get timing status based on resonance score
 */
function getTimingStatus(resonanceScore: number): {
  level: 'supportive' | 'neutral' | 'caution';
  label: BilingualText;
} {
  if (resonanceScore >= 70) {
    return {
      level: 'supportive',
      label: { en: 'Supportive', fr: 'Favorable' },
    };
  } else if (resonanceScore >= 50) {
    return {
      level: 'neutral',
      label: { en: 'Neutral', fr: 'Neutre' },
    };
  } else {
    return {
      level: 'caution',
      label: { en: 'Transformative', fr: 'Transformatif' },
    };
  }
}

// ========================================
// MAIN SERVICE FUNCTION
// ========================================

export async function getPlanetSnapshot(
  params: PlanetDetailParams,
  sunrise: Date,
  sunset: Date,
  nextSunrise: Date,
  now: Date = new Date()
): Promise<PlanetSnapshot | null> {
  try {
    const {
      planetId,
      mode,
      signKey,
      elementKey,
      userElement,
      userName,
      motherName,
      userDOB,
      isPremium = false,
    } = params;

    // Validate planetId
    if (!planetId || typeof planetId !== 'string') {
      console.error('[PlanetDetailService] Invalid planetId:', planetId);
      return null;
    }

    const normalizedPlanetId = planetId.toLowerCase();

    // Get ruhani profile for this planet
    const profile = PLANET_RUHANI_PROFILES[normalizedPlanetId];
    if (!profile) {
      console.warn('[PlanetDetailService] No profile found for:', normalizedPlanetId);
      return null;
    }

    // Get full transit snapshot (NEW - includes motion, aspects, timeline)
    const transitSnapshot = await getPlanetTransitSnapshot(normalizedPlanetId, now);

    // Get current transit data if not provided
    let transitElement = elementKey;
    let transitSign = signKey;

    if (mode === 'now') {
      const transitData = getPlanetTransitNow(sunrise, sunset, nextSunrise, now);
      if (transitData) {
        transitElement = transitData.elementKey;
        transitSign = transitData.zodiacKey;
      }
    }

    // Get planet static data
    const planetName = PLANET_NAMES[normalizedPlanetId] || {
      en: planetId,
      fr: planetId,
      ar: planetId,
    };
    const symbol = PLANET_SYMBOLS[normalizedPlanetId] || '⭐';
    const arabicName = planetName.ar || planetName.en;

    // Build sign and element info
    const sign = transitSign
      ? {
          key: transitSign,
          label: ZODIAC_LABELS[transitSign],
          arabic: ZODIAC_LABELS[transitSign].ar,
        }
      : undefined;

    const element = transitElement
      ? {
          key: transitElement,
          label: ELEMENT_LABELS[transitElement],
        }
      : undefined;

    // Get day and hour rulers
    const weekday = now.getDay();
    const dayRulerData = getDayRuler(weekday);
    const hourRulerData = getCurrentHourRuler(sunrise, sunset, nextSunrise, now);

    // Calculate resonance
    const resonance = calculateResonance(userElement, transitElement);
    
    // Get timing status
    const timingStatus = getTimingStatus(resonance.score);

    // Build timing data
    const timing: RuhaniTiming = {
      generalWindow: {
        key: profile.timing.generalWindow,
        labelKey: `planetDetail.timing.windows.${profile.timing.generalWindow}`,
        fallbackEN: profile.timing.generalWindow.replace(/([A-Z])/g, ' $1').trim(),
        fallbackFR: profile.timing.generalWindow.replace(/([A-Z])/g, ' $1').trim(),
      },
      dayRuler: dayRulerData.planet,
      notes: profile.timing.notes,
    };

    // Build practice data
    const practice: RuhaniPractice = {
      title: profile.practice.title,
      steps: profile.practice.steps,
      recommendedCount: profile.practice.recommendedCount,
      durationHint: profile.practice.durationHint,
      adab: profile.practice.adab,
      cautions: profile.cautions,
    };

    // Build base snapshot
    const snapshot: PlanetSnapshot = {
      planetId: normalizedPlanetId,
      planetName,
      symbol,
      arabicName,
      nowLabel: mode === 'now' ? { en: 'Now', fr: 'Maintenant' } : { en: 'Next', fr: 'Suivant' },
      transitSnapshot: transitSnapshot || undefined, // Add full transit data
      sign,
      element,
      dayRuler: { en: dayRulerData.en, fr: dayRulerData.fr, ar: dayRulerData.ar },
      hourRuler: hourRulerData || undefined,
      timingStatus,
      ruhaniFocus: profile.ruhaniFocus,
      cautions: profile.cautions,
      timing,
      practice,
      resonance,
    };

    // Add premium layer if applicable
    if (isPremium) {
      const hasUserData = Boolean(userName || userDOB);
      
      snapshot.premium = {
        divineNames: profile.premiumDivineNames,
        personalization: {
          requiredInputs: ['userName', 'dob', 'intention'],
          whyNeeded: {
            en: hasUserData
              ? 'Your profile enables personalized Divine Name resonances based on your spiritual makeup.'
              : 'Add your name and details to unlock personalized Divine Name recommendations aligned with your unique spiritual frequency.',
            fr: hasUserData
              ? 'Votre profil permet des résonances personnalisées des Noms Divins basées sur votre constitution spirituelle.'
              : 'Ajoutez votre nom et vos détails pour débloquer des recommandations personnalisées de Noms Divins alignés avec votre fréquence spirituelle unique.',
          },
        },
      };
    }

    return snapshot;
  } catch (error) {
    console.error('[PlanetDetailService] Error creating snapshot:', error);
    return null;
  }
}
