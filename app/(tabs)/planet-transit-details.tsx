import { PremiumSection } from '@/components/subscription/PremiumSection';
import { DarkTheme, ElementAccents, Spacing, Typography } from '@/constants/DarkTheme';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProfile } from '@/contexts/ProfileContext';
import type { Element } from '@/services/MomentAlignmentService';
import {
  calculatePlanetaryHours,
  getPlanetaryDayBoundariesForNow,
  type Planet,
  type PlanetaryHourData
} from '@/services/PlanetaryHoursService';
import {
  getDegreeStageColor,
  getDegreeStageIcon,
  getInfluenceTypeColor,
  getPersonalizedInfluence,
  type PersonalizedInfluence
} from '@/services/PlanetaryInfluenceService';
import { calculateEnhancedPlanetaryPower } from '@/services/PlanetaryStrengthService';
import { ZODIAC_DATA, type PlanetTransitInfo, type ZodiacSign as ZodiacKey } from '@/services/PlanetTransitService';
import { getAllTransits, getTransit } from '@/services/TransitService';
import type { AllPlanetTransits, PlanetTransit } from '@/types/planetary-systems';
import { adaptTransitToLegacyFormat, type LegacyPlanetTransitInfo } from '@/utils/transitAdapters';
import { formatZodiacWithArabic, resolveUserZodiacKey } from '@/utils/translationHelpers';
import { mapLongitudeToZodiac, type ZodiacSystem } from '@/utils/zodiacSystem';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  AppState,
  LayoutAnimation,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';

type DetailsType = 'transit' | 'nextDay';

type ExpandableSection = 'duration' | 'personalized' | 'guidance' | 'dignity';

type NextDayPayload = {
  dayName: string;
  dayNameArabic: string;
  planetArabic: string;
  emoji: string;
  element: Element;
};

type HarmonyLevel = 'harmonious' | 'supportive' | 'neutral' | 'challenging';

type BalancingMethodType = 'divine_name' | 'dhikr' | 'prayer' | 'letter_sequence' | 'timing';

type BalancingMethod = {
  type: BalancingMethodType;
  title: string;
  titleArabic: string;
  instruction: string;
  count?: number;
  numerology?: string;
  bestTime?: string;
  source?: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// DEGREE-BASED SPIRITUAL GUIDANCE (Classical Islamic Esoteric Framework)
// Masters divide each sign (30°) into three spiritual phases:
//   Entry (0°–10°):   Influence forming — focus on purification
//   Strength (10°–20°): Fully active — best for spiritual work  
//   Exit (20°–30°):   Fading — seal and protect, do not initiate
// ─────────────────────────────────────────────────────────────────────────────

type SpiritualPhase = 'entry' | 'strength' | 'exit';

// Dhikr count tier system (classical ʿAdad)
type DhikrTier = 'quick' | 'standard' | 'deep';

type DhikrTierConfig = {
  tier: DhikrTier;
  counts: number[];   // e.g., [33, 66, 99]
  defaultCount: number;
  estimatedMinutes: number; // based on ~2 sec per dhikr
};

const DHIKR_TIERS: Record<DhikrTier, Omit<DhikrTierConfig, 'tier'>> = {
  quick: { counts: [33, 66, 99], defaultCount: 99, estimatedMinutes: 3 },
  standard: { counts: [101, 111, 313], defaultCount: 313, estimatedMinutes: 10 },
  deep: { counts: [1000, 3000, 7000], defaultCount: 1000, estimatedMinutes: 33 },
};

// Timing strength system
type TimingStrength = 'peak' | 'strong' | 'supportive' | 'gentle';

type PlanetaryHourWindow = {
  planet: Planet;
  startTime: Date;
  endTime: Date;
  isToday: boolean;
  minutesUntil: number;
};

type SpiritualGuidance = {
  phase: SpiritualPhase;
  phaseLabel: string;
  phaseArabic: string;
  statusText: string;
  guidanceText: string;
  dhikrName: string;
  dhikrArabic: string;
  // New tier-based count system
  dhikrTiers: {
    quick: DhikrTierConfig;
    standard: DhikrTierConfig;
    deep: DhikrTierConfig;
  };
  recommendedTier: DhikrTier;
  avoidText: string;
  // Timing support
  nextPlanetHour: PlanetaryHourWindow | null;
  timingStrength: TimingStrength;
  isInMatchingHour: boolean;
  // Transit strength info (based on dignity, not just phase)
  transitStrengthPercent: number;
  transitStrengthLabel: 'strong' | 'moderate' | 'weak';
};

/**
 * Determine spiritual phase from degree (classical 0-10 / 10-20 / 20-30 system)
 */
function getSpiritualPhase(degree: number): SpiritualPhase {
  const normalizedDegree = Math.max(0, Math.min(30, degree));
  if (normalizedDegree < 10) return 'entry';
  if (normalizedDegree < 20) return 'strength';
  return 'exit';
}

/**
 * Select recommended dhikr tier based on transit phase
 */
function getRecommendedTier(phase: SpiritualPhase): DhikrTier {
  switch (phase) {
    case 'strength': return 'standard';
    case 'entry':
    case 'exit':
    default: return 'quick';
  }
}

/**
 * Build dhikr tier configurations
 */
function buildDhikrTiers(): SpiritualGuidance['dhikrTiers'] {
  return {
    quick: { tier: 'quick', ...DHIKR_TIERS.quick },
    standard: { tier: 'standard', ...DHIKR_TIERS.standard },
    deep: { tier: 'deep', ...DHIKR_TIERS.deep },
  };
}

/**
 * Calculate timing strength based on phase and planetary hour match
 */
function getTimingStrength(phase: SpiritualPhase, isInMatchingHour: boolean): TimingStrength {
  if (phase === 'strength' && isInMatchingHour) return 'peak';
  if (phase === 'strength') return 'strong';
  if (isInMatchingHour) return 'supportive';
  return 'gentle';
}

/**
 * Find the next planetary hour matching the given planet
 */
function findNextPlanetHour(
  targetPlanet: string,
  planetaryData: PlanetaryHourData | null,
  sunrise: Date,
  sunset: Date,
  nextSunrise: Date,
  now: Date
): PlanetaryHourWindow | null {
  if (!planetaryData) return null;
  
  const targetPlanetKey = targetPlanet.charAt(0).toUpperCase() + targetPlanet.slice(1).toLowerCase() as Planet;
  
  // Check if we're currently in the matching hour
  if (planetaryData.currentHour.planet === targetPlanetKey) {
    return {
      planet: targetPlanetKey,
      startTime: new Date(planetaryData.currentHour.startTime),
      endTime: new Date(planetaryData.currentHour.endTime),
      isToday: true,
      minutesUntil: 0,
    };
  }
  
  // Calculate all 24 hours and find next matching
  const dayRuler = planetaryData.dayRulerPlanet;
  const dayDuration = sunset.getTime() - sunrise.getTime();
  const nightDuration = nextSunrise.getTime() - sunset.getTime();
  const dayHourDuration = dayDuration / 12;
  const nightHourDuration = nightDuration / 12;
  
  const CHALDEAN_ORDER: Planet[] = ['Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon'];
  const dayRulerIndex = CHALDEAN_ORDER.indexOf(dayRuler);
  
  // Generate all 24 hours
  for (let h = 0; h < 24; h++) {
    const planet = CHALDEAN_ORDER[(dayRulerIndex + h) % 7];
    
    let startTime: Date;
    let endTime: Date;
    
    if (h < 12) {
      // Day hours
      startTime = new Date(sunrise.getTime() + h * dayHourDuration);
      endTime = new Date(sunrise.getTime() + (h + 1) * dayHourDuration);
    } else {
      // Night hours
      const nightHourIndex = h - 12;
      startTime = new Date(sunset.getTime() + nightHourIndex * nightHourDuration);
      endTime = new Date(sunset.getTime() + (nightHourIndex + 1) * nightHourDuration);
    }
    
    // Skip hours that have already passed
    if (endTime <= now) continue;
    
    if (planet === targetPlanetKey) {
      const minutesUntil = Math.max(0, Math.floor((startTime.getTime() - now.getTime()) / (1000 * 60)));
      return {
        planet: targetPlanetKey,
        startTime,
        endTime,
        isToday: true,
        minutesUntil,
      };
    }
  }
  
  // No match today, return first occurrence tomorrow (simplified)
  return {
    planet: targetPlanetKey,
    startTime: new Date(nextSunrise.getTime() + dayHourDuration), // approximation
    endTime: new Date(nextSunrise.getTime() + 2 * dayHourDuration),
    isToday: false,
    minutesUntil: Math.floor((nextSunrise.getTime() - now.getTime()) / (1000 * 60)),
  };
}

/**
 * Determine transit strength label from percentage
 */
function getTransitStrengthLabel(percent: number): 'strong' | 'moderate' | 'weak' {
  if (percent >= 65) return 'strong';
  if (percent >= 45) return 'moderate';
  return 'weak';
}

/**
 * Planet-specific spiritual guidance based on classical Islamic sources
 * Each planet has: spiritual focus, recommended dhikr, and what to avoid
 * Now also considers actual transit strength (dignity) not just degree phase
 */
function getPlanetSpiritualData(
  planetKey: string | undefined,
  phase: SpiritualPhase,
  t: TTranslate,
  tSafe: TSafety,
  planetaryData: PlanetaryHourData | null,
  sunrise: Date | null,
  sunset: Date | null,
  nextSunrise: Date | null,
  now: Date,
  transitStrengthPercent: number = 50 // Default to neutral if not provided
): Omit<SpiritualGuidance, 'phase'> {
  const key = (planetKey ?? 'saturn').toLowerCase();
  
  // Phase labels (universal)
  const phaseLabels: Record<SpiritualPhase, { en: string; ar: string }> = {
    entry: { en: 'Entering', ar: 'دخول' },
    strength: { en: 'Active', ar: 'فعّال' },
    exit: { en: 'Exiting', ar: 'خروج' },
  };
  
  // Determine actual transit strength label
  const transitStrengthLabel = getTransitStrengthLabel(transitStrengthPercent);
  
  // Phase status text - now considers BOTH phase AND actual transit strength
  // A planet in the "strength" phase (10-20°) but in detriment should NOT say "full strength"
  const getStatusText = (): string => {
    if (phase === 'entry') {
      return tSafe('screens.planetTransit.spiritual.status.entry', 'The influence is forming. Focus on purification, not action.');
    }
    if (phase === 'exit') {
      return tSafe('screens.planetTransit.spiritual.status.exit', 'The influence is fading. Seal and protect, do not initiate.');
    }
    // Phase is 'strength' - check actual transit strength
    if (transitStrengthLabel === 'weak') {
      return tSafe('screens.planetTransit.spiritual.status.strengthWeak', 'This transit is weak. Spiritual work requires extra patience and discipline.');
    }
    if (transitStrengthLabel === 'moderate') {
      return tSafe('screens.planetTransit.spiritual.status.strengthModerate', 'This transit has moderate strength. Spiritual work is supported with steady effort.');
    }
    return tSafe('screens.planetTransit.spiritual.status.strength', 'This transit is at full strength. Spiritual work is strongly supported.');
  };

  // Planet-specific dhikr and guidance
  const planetData: Record<string, {
    focus: { en: string; ar: string };
    dhikr: { name: string; arabic: string };
    avoid: { en: string; ar: string };
  }> = {
    sun: {
      focus: { en: 'Tawḥīd, purpose, and clarity of intention', ar: 'التوحيد والغاية ووضوح النية' },
      dhikr: { name: 'Yā Nūr / Yā Ḥayy', arabic: 'يا نُور / يا حَيّ' },
      avoid: { en: 'Ego inflation, arrogance', ar: 'تضخم الأنا والغرور' },
    },
    moon: {
      focus: { en: 'Emotional balance and intuition', ar: 'التوازن العاطفي والحدس' },
      dhikr: { name: 'Yā Laṭīf', arabic: 'يا لَطِيف' },
      avoid: { en: 'Decisions driven by mood', ar: 'القرارات المبنية على المزاج' },
    },
    mercury: {
      focus: { en: 'Knowledge, speech, and learning', ar: 'العلم والكلام والتعلّم' },
      dhikr: { name: 'Yā ʿAlīm', arabic: 'يا عَلِيم' },
      avoid: { en: 'Gossip, overthinking', ar: 'النميمة وكثرة التفكير' },
    },
    venus: {
      focus: { en: 'Harmony, love, and beauty', ar: 'الانسجام والمحبة والجمال' },
      dhikr: { name: 'Yā Wadūd', arabic: 'يا وَدُود' },
      avoid: { en: 'Excess pleasure, attachment', ar: 'الإفراط في الملذات والتعلق' },
    },
    mars: {
      focus: { en: 'Courage, discipline, cutting obstacles', ar: 'الشجاعة والانضباط وإزالة العوائق' },
      dhikr: { name: 'Yā Qawiyy', arabic: 'يا قَوِيّ' },
      avoid: { en: 'Anger, impulsiveness', ar: 'الغضب والتهور' },
    },
    jupiter: {
      focus: { en: 'Expansion, rizq, and wisdom', ar: 'التوسع والرزق والحكمة' },
      dhikr: { name: 'Yā Razzāq', arabic: 'يا رَزَّاق' },
      avoid: { en: 'Arrogance, excess', ar: 'الكبر والإسراف' },
    },
    saturn: {
      focus: { en: 'Patience, endurance, karmic repair', ar: 'الصبر والتحمل وإصلاح الأثر' },
      dhikr: { name: 'Yā Ṣabūr', arabic: 'يا صَبُور' },
      avoid: { en: 'Heavy works unless guided, despair', ar: 'الأعمال الثقيلة دون إرشاد واليأس' },
    },
  };

  const data = planetData[key] ?? planetData.saturn;
  
  // Build guidance text based on phase
  let guidanceText: string;
  if (phase === 'entry') {
    guidanceText = tSafe(
      'screens.planetTransit.spiritual.guidance.entry',
      'Focus on istighfār and general dhikr (lā ilāha illa Llāh). Avoid binding intentions or starting major spiritual works.'
    );
  } else if (phase === 'strength') {
    const focusText = tSafe(`screens.planetTransit.spiritual.focus.${key}`, data.focus.en);
    guidanceText = tSafe(
      'screens.planetTransit.spiritual.guidance.strength',
      `Best time for focused dhikr and duʿāʾ. Spiritual focus: ${focusText}`
    ).replace('${focusText}', focusText);
  } else {
    guidanceText = tSafe(
      'screens.planetTransit.spiritual.guidance.exit',
      'Seal what was started. Focus on protective dhikr, ṣalawāt, and gratitude. Avoid new spiritual initiatives.'
    );
  }

  // Build dhikr tiers
  const dhikrTiers = buildDhikrTiers();
  const recommendedTier = getRecommendedTier(phase);
  
  // Calculate planetary hour timing
  const nextPlanetHour = sunrise && sunset && nextSunrise 
    ? findNextPlanetHour(key, planetaryData, sunrise, sunset, nextSunrise, now)
    : null;
  
  const isInMatchingHour = nextPlanetHour?.minutesUntil === 0;
  const timingStrength = getTimingStrength(phase, isInMatchingHour);

  return {
    phaseLabel: tSafe(`screens.planetTransit.spiritual.phaseLabel.${phase}`, phaseLabels[phase].en),
    phaseArabic: phaseLabels[phase].ar,
    statusText: getStatusText(),
    guidanceText,
    dhikrName: data.dhikr.name,
    dhikrArabic: data.dhikr.arabic,
    dhikrTiers,
    recommendedTier,
    avoidText: phase === 'strength' 
      ? tSafe(`screens.planetTransit.spiritual.avoid.${key}`, data.avoid.en)
      : '',
    nextPlanetHour,
    timingStrength,
    isInMatchingHour,
    transitStrengthPercent,
    transitStrengthLabel,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPREHENSIVE PLANET-SPECIFIC PRACTICES
// Divine names, essences, talismans, angels, timing, and preparation
// ─────────────────────────────────────────────────────────────────────────────

type DivineName = {
  id: string;
  name: string;
  nameAr: string;
  transliteration: string;
  count: number;
  purpose: string;
  purposeAr: string;
  category: string;
  icon: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
};

type Essence = {
  name: string;
  nameAr: string;
  transliteration: string;
  purpose: string;
  icon: string;
};

type Talisman = {
  format: string;
  formatAr: string;
  description: string;
  descriptionAr: string;
  bestDay: string;
  bestDayAr: string;
  bestHour: string;
  bestHourAr: string;
};

type Angel = {
  name: string;
  nameAr: string;
  role: string;
  roleAr: string;
  advanced: boolean;
};

type PlanetPractices = {
  planet: string;
  planetAr: string;
  element: Element;
  divineNames: DivineName[];
  essences: Essence[];
  talisman: Talisman;
  angels: Angel[];
  timing: {
    best: string[];
    bestAr: string[];
  };
  preparation: {
    steps: string[];
    stepsAr: string[];
  };
};

const PLANET_PRACTICES: Record<string, PlanetPractices> = {
  jupiter: {
    planet: 'Jupiter',
    planetAr: 'المشتري',
    element: 'water',
    divineNames: [
      {
        id: 'protection',
        name: 'Yā Muhayminu',
        nameAr: 'يَا مُهَيْمِنُ',
        transliteration: 'Yā Muhayminu',
        count: 135,
        purpose: 'Divine protection and guardianship',
        purposeAr: 'الحماية والوصاية الإلهية',
        category: 'Protection',
        icon: '🛡️',
        difficulty: 'beginner'
      },
      {
        id: 'taskheer',
        name: 'Yā Ḥalīmu',
        nameAr: 'يَا حَلِيمُ',
        transliteration: 'Yā Ḥalīmu',
        count: 150,
        purpose: 'Attracting favor, softening hearts (Taskhīr)',
        purposeAr: 'جذب المحبة، تليين القلوب (تسخير)',
        category: 'Influence',
        icon: '🤝',
        difficulty: 'intermediate'
      },
      {
        id: 'accounting',
        name: 'Yā Muḥṣī',
        nameAr: 'يَا مُحْصِي',
        transliteration: 'Yā Muḥṣī',
        count: 117,
        purpose: 'Divine accounting, keeping track',
        purposeAr: 'الإحصاء الإلهي',
        category: 'Clarity',
        icon: '💰',
        difficulty: 'beginner'
      },
      {
        id: 'ijaba',
        name: 'Yā Samīʿu',
        nameAr: 'يَا سَمِيعُ',
        transliteration: 'Yā Samīʿu',
        count: 180,
        purpose: 'Having prayers answered (Ijābah)',
        purposeAr: 'إجابة الدعاء',
        category: 'Prayer',
        icon: '🙏',
        difficulty: 'beginner'
      },
      {
        id: 'haiba',
        name: 'Yā Mutakabbiru',
        nameAr: 'يَا مُتَكَبِّرُ',
        transliteration: 'Yā Mutakabbiru',
        count: 662,
        purpose: 'Commanding respect, dignified presence (Haybah)',
        purposeAr: 'الهيبة والوقار',
        category: 'Dignity',
        icon: '👑',
        difficulty: 'advanced'
      },
      {
        id: 'leadership',
        name: 'Yā ʿAzīzu',
        nameAr: 'يَا عَزِيزُ',
        transliteration: 'Yā ʿAzīzu',
        count: 93,
        purpose: 'Strength in leadership, personal growth',
        purposeAr: 'القيادة والنمو الشخصي',
        category: 'Leadership',
        icon: '📈',
        difficulty: 'beginner'
      },
      {
        id: 'rights',
        name: 'Yā Muhayminu',
        nameAr: 'يَا مُهَيْمِنُ',
        transliteration: 'Yā Muhayminu',
        count: 108,
        purpose: 'Restoring respect, reclaiming rights',
        purposeAr: 'استرجاع الحقوق والاحترام',
        category: 'Justice',
        icon: '⚖️',
        difficulty: 'intermediate'
      },
      {
        id: 'career',
        name: 'Yā Bāqī',
        nameAr: 'يَا بَاقِي',
        transliteration: 'Yā Bāqī',
        count: 113,
        purpose: 'Strengthening job role, establishing firm position',
        purposeAr: 'تثبيت الوظيفة والمنصب',
        category: 'Career',
        icon: '💼',
        difficulty: 'intermediate'
      }
    ],
    essences: [
      {
        name: 'Camphor',
        nameAr: 'كافور',
        transliteration: 'Kāfūr',
        purpose: 'Cooling, purifying',
        icon: '🌿'
      },
      {
        name: 'Oud/Agarwood',
        nameAr: 'عود',
        transliteration: 'ʿŪd',
        purpose: 'Grounding, sacred',
        icon: '🪵'
      },
      {
        name: 'Jawiya',
        nameAr: 'جاوية',
        transliteration: 'Jāwiya',
        purpose: 'Spiritual elevation',
        icon: '🌸'
      },
      {
        name: 'Mastic',
        nameAr: 'مستكى',
        transliteration: 'Mastakā',
        purpose: 'Clarity, focus',
        icon: '💎'
      }
    ],
    talisman: {
      format: 'Murabbaʿa',
      formatAr: 'المربعة',
      description: '4×4 square talisman',
      descriptionAr: 'تعويذة مربعة ٤×٤',
      bestDay: 'Thursday',
      bestDayAr: 'الخميس',
      bestHour: 'Jupiter hour',
      bestHourAr: 'ساعة المشتري'
    },
    angels: [
      {
        name: 'Israfil',
        nameAr: 'إسرافيل',
        role: 'Angel of the trumpet',
        roleAr: 'ملاك الصور',
        advanced: true
      },
      {
        name: 'Samharusi',
        nameAr: 'سمهروسي',
        role: 'Spiritual entity of Jupiter',
        roleAr: 'الكيان الروحاني للمشتري',
        advanced: true
      }
    ],
    timing: {
      best: [
        'Jupiter hour (check Planetary Hours section)',
        'Thursday (Jupiter\'s day)',
        'During waxing moon',
        'When Jupiter is well-placed in your chart'
      ],
      bestAr: [
        'ساعة المشتري (راجع قسم الساعات الكوكبية)',
        'يوم الخميس (يوم المشتري)',
        'أثناء القمر المتزايد',
        'عندما يكون المشتري في وضع جيد في برجك'
      ]
    },
    preparation: {
      steps: [
        'Perform wuḍūʾ (ritual ablution)',
        'Face Qiblah if possible',
        'Light recommended incense',
        'Sit in quiet, clean space',
        'Set clear intention (niyyah)'
      ],
      stepsAr: [
        'توضأ (الوضوء الشرعي)',
        'واجه القبلة إن أمكن',
        'أشعل البخور الموصى به',
        'اجلس في مكان هادئ ونظيف',
        'اضبط نيتك بوضوح'
      ]
    }
  },
  sun: {
    planet: 'Sun',
    planetAr: 'الشمس',
    element: 'fire',
    divineNames: [
      {
        id: 'clarity',
        name: 'Yā Nūr',
        nameAr: 'يَا نُور',
        transliteration: 'Yā Nūr',
        count: 256,
        purpose: 'Divine light, clarity of vision and purpose',
        purposeAr: 'النور الإلهي، وضوح الرؤية والهدف',
        category: 'Clarity',
        icon: '☀️',
        difficulty: 'beginner'
      },
      {
        id: 'vitality',
        name: 'Yā Ḥayy',
        nameAr: 'يَا حَيّ',
        transliteration: 'Yā Ḥayy',
        count: 18,
        purpose: 'Life force, vitality, and energy',
        purposeAr: 'قوة الحياة، الحيوية والطاقة',
        category: 'Vitality',
        icon: '⚡',
        difficulty: 'beginner'
      },
      {
        id: 'leadership',
        name: 'Yā Malik',
        nameAr: 'يَا مَلِك',
        transliteration: 'Yā Malik',
        count: 90,
        purpose: 'Divine sovereignty, leadership authority',
        purposeAr: 'السيادة الإلهية، سلطة القيادة',
        category: 'Leadership',
        icon: '👑',
        difficulty: 'intermediate'
      }
    ],
    essences: [
      {
        name: 'Frankincense',
        nameAr: 'لبان',
        transliteration: 'Lubān',
        purpose: 'Elevating, purifying',
        icon: '🕯️'
      },
      {
        name: 'Saffron',
        nameAr: 'زعفران',
        transliteration: 'Zaʿfarān',
        purpose: 'Solar warmth, joy',
        icon: '🌻'
      }
    ],
    talisman: {
      format: 'Khātam Sulaymān',
      formatAr: 'خاتم سليمان',
      description: 'Seal of Solomon, 6-pointed star',
      descriptionAr: 'خاتم سليمان، نجمة سداسية',
      bestDay: 'Sunday',
      bestDayAr: 'الأحد',
      bestHour: 'Sun hour',
      bestHourAr: 'ساعة الشمس'
    },
    angels: [
      {
        name: 'Mikā\'īl',
        nameAr: 'ميكائيل',
        role: 'Angel of sustenance',
        roleAr: 'ملاك الرزق',
        advanced: false
      }
    ],
    timing: {
      best: [
        'Sunday (Sun\'s day)',
        'Sun hour (sunrise + solar hours)',
        'During solar noon',
        'At dawn for new beginnings'
      ],
      bestAr: [
        'يوم الأحد (يوم الشمس)',
        'ساعة الشمس (شروق الشمس + الساعات الشمسية)',
        'أثناء الظهيرة الشمسية',
        'عند الفجر للبدايات الجديدة'
      ]
    },
    preparation: {
      steps: [
        'Perform wuḍūʾ (ritual ablution)',
        'Face east (direction of sunrise)',
        'Light solar incense (frankincense)',
        'Wear clean, light-colored clothing',
        'Set intention for clarity and purpose'
      ],
      stepsAr: [
        'توضأ (الوضوء الشرعي)',
        'واجه الشرق (اتجاه شروق الشمس)',
        'أشعل البخور الشمسي (لبان)',
        'ارتدِ ملابس نظيفة فاتحة اللون',
        'اضبط نيتك للوضوح والهدف'
      ]
    }
  },
  moon: {
    planet: 'Moon',
    planetAr: 'القمر',
    element: 'water',
    divineNames: [
      {
        id: 'gentleness',
        name: 'Yā Laṭīf',
        nameAr: 'يَا لَطِيف',
        transliteration: 'Yā Laṭīf',
        count: 129,
        purpose: 'Divine gentleness, emotional healing',
        purposeAr: 'اللطف الإلهي، الشفاء العاطفي',
        category: 'Healing',
        icon: '🌙',
        difficulty: 'beginner'
      },
      {
        id: 'affection',
        name: 'Yā Wadūd',
        nameAr: 'يَا وَدُود',
        transliteration: 'Yā Wadūd',
        count: 20,
        purpose: 'Divine love and affection',
        purposeAr: 'المحبة والمودة الإلهية',
        category: 'Love',
        icon: '💚',
        difficulty: 'beginner'
      },
      {
        id: 'intuition',
        name: 'Yā ʿAlīm',
        nameAr: 'يَا عَلِيم',
        transliteration: 'Yā ʿAlīm',
        count: 150,
        purpose: 'Inner knowing, intuitive wisdom',
        purposeAr: 'المعرفة الداخلية، الحكمة الحدسية',
        category: 'Wisdom',
        icon: '🔮',
        difficulty: 'intermediate'
      }
    ],
    essences: [
      {
        name: 'Sandalwood',
        nameAr: 'صندل',
        transliteration: 'Ṣandal',
        purpose: 'Calming, peaceful',
        icon: '🌾'
      },
      {
        name: 'Jasmine',
        nameAr: 'ياسمين',
        transliteration: 'Yāsamīn',
        purpose: 'Lunar receptivity',
        icon: '🌼'
      }
    ],
    talisman: {
      format: 'Hilāl',
      formatAr: 'الهلال',
      description: 'Crescent moon talisman',
      descriptionAr: 'تعويذة الهلال',
      bestDay: 'Monday',
      bestDayAr: 'الاثنين',
      bestHour: 'Moon hour',
      bestHourAr: 'ساعة القمر'
    },
    angels: [
      {
        name: 'Jibrīl',
        nameAr: 'جبريل',
        role: 'Angel of revelation',
        roleAr: 'ملاك الوحي',
        advanced: false
      }
    ],
    timing: {
      best: [
        'Monday (Moon\'s day)',
        'During full moon for completion',
        'During new moon for new beginnings',
        'Moon hour (night hours preferred)'
      ],
      bestAr: [
        'يوم الاثنين (يوم القمر)',
        'أثناء البدر للإكمال',
        'أثناء المحاق للبدايات الجديدة',
        'ساعة القمر (الساعات الليلية مفضلة)'
      ]
    },
    preparation: {
      steps: [
        'Perform wuḍūʾ (ritual ablution)',
        'Create peaceful, dimly lit space',
        'Light lunar incense (sandalwood)',
        'Sit near water if possible',
        'Set intention for emotional clarity'
      ],
      stepsAr: [
        'توضأ (الوضوء الشرعي)',
        'أنشئ مساحة هادئة خافتة الإضاءة',
        'أشعل البخور القمري (صندل)',
        'اجلس بالقرب من الماء إن أمكن',
        'اضبط نيتك للوضوح العاطفي'
      ]
    }
  },
  mars: {
    planet: 'Mars',
    planetAr: 'المريخ',
    element: 'fire',
    divineNames: [
      {
        id: 'strength',
        name: 'Yā Qawiyy',
        nameAr: 'يَا قَوِيّ',
        transliteration: 'Yā Qawiyy',
        count: 116,
        purpose: 'Divine strength, courage in action',
        purposeAr: 'القوة الإلهية، الشجاعة في العمل',
        category: 'Strength',
        icon: '💪',
        difficulty: 'beginner'
      },
      {
        id: 'protection',
        name: 'Yā Ḥāfiẓ',
        nameAr: 'يَا حَافِظ',
        transliteration: 'Yā Ḥāfiẓ',
        count: 998,
        purpose: 'Divine protection, guardian force',
        purposeAr: 'الحماية الإلهية، القوة الحارسة',
        category: 'Protection',
        icon: '🛡️',
        difficulty: 'intermediate'
      }
    ],
    essences: [
      {
        name: 'Dragon\'s Blood',
        nameAr: 'دم الأخوين',
        transliteration: 'Dam al-Akhawayn',
        purpose: 'Protective, energizing',
        icon: '🔴'
      },
      {
        name: 'Pepper',
        nameAr: 'فلفل',
        transliteration: 'Fulful',
        purpose: 'Activation, courage',
        icon: '🌶️'
      }
    ],
    talisman: {
      format: 'Ṭilsam Marbūʿ',
      formatAr: 'طلسم مربوع',
      description: 'Square Mars talisman',
      descriptionAr: 'طلسم المريخ المربع',
      bestDay: 'Tuesday',
      bestDayAr: 'الثلاثاء',
      bestHour: 'Mars hour',
      bestHourAr: 'ساعة المريخ'
    },
    angels: [
      {
        name: 'ʿAzrāʾīl',
        nameAr: 'عزرائيل',
        role: 'Angel of transformation',
        roleAr: 'ملاك التحول',
        advanced: true
      }
    ],
    timing: {
      best: [
        'Tuesday (Mars\' day)',
        'Mars hour (dawn or dusk)',
        'Waxing moon for growth',
        'When facing challenges requiring courage'
      ],
      bestAr: [
        'يوم الثلاثاء (يوم المريخ)',
        'ساعة المريخ (الفجر أو الغسق)',
        'القمر المتزايد للنمو',
        'عند مواجهة تحديات تتطلب الشجاعة'
      ]
    },
    preparation: {
      steps: [
        'Perform wuḍūʾ (ritual ablution)',
        'Energize body with movement',
        'Light protective incense',
        'Set clear, decisive intention',
        'Maintain upright, confident posture'
      ],
      stepsAr: [
        'توضأ (الوضوء الشرعي)',
        'نشّط جسمك بالحركة',
        'أشعل البخور الحامي',
        'اضبط نيتك بوضوح وحسم',
        'حافظ على وضعية مستقيمة وواثقة'
      ]
    }
  },
  mercury: {
    planet: 'Mercury',
    planetAr: 'عطارد',
    element: 'air',
    divineNames: [
      {
        id: 'knowledge',
        name: 'Yā ʿAlīm',
        nameAr: 'يَا عَلِيم',
        transliteration: 'Yā ʿAlīm',
        count: 150,
        purpose: 'Divine knowledge, learning and wisdom',
        purposeAr: 'العلم الإلهي، التعلم والحكمة',
        category: 'Knowledge',
        icon: '📚',
        difficulty: 'beginner'
      },
      {
        id: 'wisdom',
        name: 'Yā Ḥakīm',
        nameAr: 'يَا حَكِيم',
        transliteration: 'Yā Ḥakīm',
        count: 78,
        purpose: 'Divine wisdom, clear communication',
        purposeAr: 'الحكمة الإلهية، التواصل الواضح',
        category: 'Wisdom',
        icon: '🧠',
        difficulty: 'beginner'
      }
    ],
    essences: [
      {
        name: 'Lavender',
        nameAr: 'خزامى',
        transliteration: 'Khuzāmā',
        purpose: 'Mental clarity',
        icon: '💜'
      },
      {
        name: 'Mint',
        nameAr: 'نعناع',
        transliteration: 'Naʿnāʿ',
        purpose: 'Quick thinking',
        icon: '🌿'
      }
    ],
    talisman: {
      format: 'Jadwal',
      formatAr: 'جدول',
      description: 'Table/grid talisman',
      descriptionAr: 'طلسم الجدول',
      bestDay: 'Wednesday',
      bestDayAr: 'الأربعاء',
      bestHour: 'Mercury hour',
      bestHourAr: 'ساعة عطارد'
    },
    angels: [
      {
        name: 'Rūḥāniyya ʿUṭārid',
        nameAr: 'روحانية عطارد',
        role: 'Mercury\'s spiritual entity',
        roleAr: 'الكيان الروحاني لعطارد',
        advanced: true
      }
    ],
    timing: {
      best: [
        'Wednesday (Mercury\'s day)',
        'Mercury hour (morning preferred)',
        'Before important communications',
        'When studying or learning'
      ],
      bestAr: [
        'يوم الأربعاء (يوم عطارد)',
        'ساعة عطارد (الصباح مفضل)',
        'قبل التواصلات المهمة',
        'عند الدراسة أو التعلم'
      ]
    },
    preparation: {
      steps: [
        'Perform wuḍūʾ (ritual ablution)',
        'Clear mental space through breath',
        'Light clarifying incense',
        'Have writing materials ready',
        'Set intention for clear understanding'
      ],
      stepsAr: [
        'توضأ (الوضوء الشرعي)',
        'اصفِ ذهنك من خلال التنفس',
        'أشعل البخور المنقي',
        'جهّز مواد الكتابة',
        'اضبط نيتك للفهم الواضح'
      ]
    }
  },
  venus: {
    planet: 'Venus',
    planetAr: 'الزهرة',
    element: 'water',
    divineNames: [
      {
        id: 'beauty',
        name: 'Yā Jamīl',
        nameAr: 'يَا جَمِيل',
        transliteration: 'Yā Jamīl',
        count: 83,
        purpose: 'Divine beauty, harmony in relationships',
        purposeAr: 'الجمال الإلهي، الانسجام في العلاقات',
        category: 'Beauty',
        icon: '🌹',
        difficulty: 'beginner'
      },
      {
        id: 'love',
        name: 'Yā Wadūd',
        nameAr: 'يَا وَدُود',
        transliteration: 'Yā Wadūd',
        count: 20,
        purpose: 'Divine love and affection',
        purposeAr: 'المحبة والمودة الإلهية',
        category: 'Love',
        icon: '💕',
        difficulty: 'beginner'
      }
    ],
    essences: [
      {
        name: 'Rose',
        nameAr: 'ورد',
        transliteration: 'Ward',
        purpose: 'Love, beauty',
        icon: '🌹'
      },
      {
        name: 'Amber',
        nameAr: 'عنبر',
        transliteration: 'ʿAnbar',
        purpose: 'Attraction, warmth',
        icon: '🟡'
      }
    ],
    talisman: {
      format: 'Khātam Maḥabba',
      formatAr: 'خاتم المحبة',
      description: 'Love and harmony seal',
      descriptionAr: 'خاتم المحبة والوئام',
      bestDay: 'Friday',
      bestDayAr: 'الجمعة',
      bestHour: 'Venus hour',
      bestHourAr: 'ساعة الزهرة'
    },
    angels: [
      {
        name: 'Rūḥāniyya Zuhara',
        nameAr: 'روحانية الزهرة',
        role: 'Venus\'s spiritual entity',
        roleAr: 'الكيان الروحاني للزهرة',
        advanced: true
      }
    ],
    timing: {
      best: [
        'Friday (Venus\' day)',
        'Venus hour (evening preferred)',
        'During waxing moon',
        'When seeking harmony in relationships'
      ],
      bestAr: [
        'يوم الجمعة (يوم الزهرة)',
        'ساعة الزهرة (المساء مفضل)',
        'أثناء القمر المتزايد',
        'عند السعي للانسجام في العلاقات'
      ]
    },
    preparation: {
      steps: [
        'Perform wuḍūʾ (ritual ablution)',
        'Create beautiful, harmonious space',
        'Light sweet-scented incense (rose)',
        'Wear pleasant fragrances',
        'Set intention for love and harmony'
      ],
      stepsAr: [
        'توضأ (الوضوء الشرعي)',
        'أنشئ مساحة جميلة ومتناغمة',
        'أشعل البخور العطر (ورد)',
        'ارتدِ روائح لطيفة',
        'اضبط نيتك للمحبة والانسجام'
      ]
    }
  },
  saturn: {
    planet: 'Saturn',
    planetAr: 'زحل',
    element: 'earth',
    divineNames: [
      {
        id: 'patience',
        name: 'Yā Ṣabūr',
        nameAr: 'يَا صَبُور',
        transliteration: 'Yā Ṣabūr',
        count: 298,
        purpose: 'Divine patience, endurance through trials',
        purposeAr: 'الصبر الإلهي، التحمل خلال المحن',
        category: 'Patience',
        icon: '⏳',
        difficulty: 'beginner'
      },
      {
        id: 'wisdom',
        name: 'Yā Ḥakīm',
        nameAr: 'يَا حَكِيم',
        transliteration: 'Yā Ḥakīm',
        count: 78,
        purpose: 'Divine wisdom through experience',
        purposeAr: 'الحكمة الإلهية من خلال التجربة',
        category: 'Wisdom',
        icon: '🦉',
        difficulty: 'intermediate'
      },
      {
        id: 'discipline',
        name: 'Yā Qawiyy',
        nameAr: 'يَا قَوِيّ',
        transliteration: 'Yā Qawiyy',
        count: 116,
        purpose: 'Inner strength, discipline',
        purposeAr: 'القوة الداخلية، الانضباط',
        category: 'Discipline',
        icon: '🏔️',
        difficulty: 'intermediate'
      }
    ],
    essences: [
      {
        name: 'Myrrh',
        nameAr: 'مر',
        transliteration: 'Murr',
        purpose: 'Protection, grounding',
        icon: '🟤'
      },
      {
        name: 'Cypress',
        nameAr: 'سرو',
        transliteration: 'Sarw',
        purpose: 'Endurance, stability',
        icon: '🌲'
      }
    ],
    talisman: {
      format: 'Khātam Ḥifẓ',
      formatAr: 'خاتم الحفظ',
      description: 'Protection and preservation seal',
      descriptionAr: 'خاتم الحماية والحفظ',
      bestDay: 'Saturday',
      bestDayAr: 'السبت',
      bestHour: 'Saturn hour',
      bestHourAr: 'ساعة زحل'
    },
    angels: [
      {
        name: 'ʿAzrāʾīl',
        nameAr: 'عزرائيل',
        role: 'Angel of endings and transformation',
        roleAr: 'ملاك النهايات والتحول',
        advanced: true
      }
    ],
    timing: {
      best: [
        'Saturday (Saturn\'s day)',
        'Saturn hour (early morning or late night)',
        'Waning moon for release',
        'When establishing boundaries or structures'
      ],
      bestAr: [
        'يوم السبت (يوم زحل)',
        'ساعة زحل (الصباح الباكر أو الليل المتأخر)',
        'القمر المتناقص للتحرر',
        'عند وضع الحدود أو الهياكل'
      ]
    },
    preparation: {
      steps: [
        'Perform wuḍūʾ (ritual ablution)',
        'Create simple, austere space',
        'Light grounding incense (myrrh)',
        'Maintain disciplined posture',
        'Set intention for patience and wisdom'
      ],
      stepsAr: [
        'توضأ (الوضوء الشرعي)',
        'أنشئ مساحة بسيطة ومتقشفة',
        'أشعل البخور المثبت (مر)',
        'حافظ على وضعية منضبطة',
        'اضبط نيتك للصبر والحكمة'
      ]
    }
  }
};

function getPlanetPractices(planetKey: string | undefined): PlanetPractices | null {
  if (!planetKey) return null;
  const key = planetKey.toLowerCase();
  return PLANET_PRACTICES[key] || null;
}

function safeJsonParse<T>(value: unknown): T | null {
  if (!value || typeof value !== 'string') return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function toTitleCase(value: string) {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function getHarmonyLevel(
  userElement: Element,
  contextElement: Element,
  userSign?: string,
  transitSign?: string
): HarmonyLevel {
  if (userElement === contextElement) return 'harmonious';

  const normalizedUserSign = userSign?.toLowerCase();
  const normalizedTransitSign = transitSign?.toLowerCase();

  // Scorpio Special Case:
  // Scorpio is Mars-ruled "boiling water" - shares fire's intensity
  // Scorpio user + Fire transit = supportive (not challenging)
  // Fire user + Scorpio transit = supportive (not challenging)
  const isScorpioUserWithFire = 
    normalizedUserSign === 'scorpio' && contextElement === 'fire';
  const isFireUserWithScorpio = 
    userElement === 'fire' && normalizedTransitSign === 'scorpio';
  
  if (isScorpioUserWithFire || isFireUserWithScorpio) {
    return 'supportive';
  }

  // Aquarius Special Case:
  // Aquarius is Saturn-ruled "cold air" - less challenging with water
  // Aquarius user + Water transit = neutral (not challenging)
  // Water user + Aquarius transit = neutral (not challenging)
  const isAquariusUserWithWater = 
    normalizedUserSign === 'aquarius' && contextElement === 'water';
  const isWaterUserWithAquarius = 
    userElement === 'water' && normalizedTransitSign === 'aquarius';
  
  if (isAquariusUserWithWater || isWaterUserWithAquarius) {
    return 'neutral';
  }

  const complementary =
    (userElement === 'fire' && contextElement === 'air') ||
    (userElement === 'air' && contextElement === 'fire') ||
    (userElement === 'water' && contextElement === 'earth') ||
    (userElement === 'earth' && contextElement === 'water');
  if (complementary) return 'supportive';

  const opposing =
    (userElement === 'fire' && contextElement === 'water') ||
    (userElement === 'water' && contextElement === 'fire') ||
    (userElement === 'earth' && contextElement === 'air') ||
    (userElement === 'air' && contextElement === 'earth');
  if (opposing) return 'challenging';

  return 'neutral';
}


function getResonancePalette(level: HarmonyLevel | null, accent: (typeof ElementAccents)[Element]) {
  switch (level) {
    case 'harmonious':
      return { primary: '#4CAF50', light: 'rgba(76, 175, 80, 0.28)', dark: 'rgba(76, 175, 80, 0.75)' };
    case 'supportive':
      return { primary: '#2196F3', light: 'rgba(33, 150, 243, 0.28)', dark: 'rgba(33, 150, 243, 0.75)' };
    case 'neutral':
      return { primary: '#9E9E9E', light: 'rgba(158, 158, 158, 0.24)', dark: 'rgba(158, 158, 158, 0.7)' };
    case 'challenging':
      return { primary: '#FF6B35', light: 'rgba(255, 107, 53, 0.24)', dark: 'rgba(255, 107, 53, 0.75)' };
    default:
      return { primary: accent.primary, light: accent.glow, dark: accent.secondary };
  }
}

type GradientTuple = readonly [string, string, ...string[]];

function ensureGradientTuple(colors: string[]): GradientTuple {
  if (colors.length >= 2) return colors as unknown as GradientTuple;
  return ['#9FA9B3', '#6B7785'];
}

function getElementGradient(element?: Element): GradientTuple {
  if (!element) return ['#6B7785', '#4C5561'];
  return ensureGradientTuple([...ElementAccents[element].gradient]);
}

function splitLabeledText(text: string) {
  const parts = text.split(':');
  if (parts.length < 2) return { label: '', body: text };
  return { label: parts[0].trim(), body: parts.slice(1).join(':').trim() };
}

function getElementIconName(element: Element): keyof typeof Ionicons.glyphMap {
  if (element === 'water') return 'water';
  if (element === 'fire') return 'flame';
  if (element === 'air') return 'cloud';
  return 'leaf';
}

function getElementIcon(element: Element): string {
  const icons = {
    fire: '🔥',
    water: '💧',
    air: '🌬️',
    earth: '🌱',
  };
  return icons[element];
}

function getElementDescription(element: Element, language: string): string {
  const descriptions = {
    fire: {
      en: 'Fire energy brings action, courage, and transformation. It\'s a time for bold moves and clearing obstacles.',
      fr: 'L\'énergie du feu apporte l\'action, le courage et la transformation. C\'est le moment de faire des mouvements audacieux et d\'éliminer les obstacles.',
      ar: 'طاقة النار تجلب العمل والشجاعة والتحول. إنه وقت للحركات الجريئة وإزالة العقبات.',
    },
    water: {
      en: 'Water energy emphasizes emotions, intuition, and healing. A favorable day for inner work and spiritual connection.',
      fr: 'L\'énergie de l\'eau met l\'accent sur les émotions, l\'intuition et la guérison. Un jour favorable pour le travail intérieur et la connexion spirituelle.',
      ar: 'طاقة الماء تركز على العواطف والحدس والشفاء. يوم مناسب للعمل الداخلي والاتصال الروحي.',
    },
    air: {
      en: 'Air energy supports communication, learning, and mental clarity. Great for planning, studying, and meaningful conversations.',
      fr: 'L\'énergie de l\'air soutient la communication, l\'apprentissage et la clarté mentale. Idéal pour planifier, étudier et avoir des conversations significatives.',
      ar: 'طاقة الهواء تدعم التواصل والتعلم والوضوح الذهني. رائع للتخطيط والدراسة والمحادثات الهادفة.',
    },
    earth: {
      en: 'Earth energy grounds us in practicality, stability, and tangible results. Perfect for building, organizing, and material matters.',
      fr: 'L\'énergie de la terre nous ancre dans la praticité, la stabilité et les résultats tangibles. Parfait pour construire, organiser et les questions matérielles.',
      ar: 'طاقة الأرض تثبتنا في العملية والاستقرار والنتائج الملموسة. مثالي للبناء والتنظيم والأمور المادية.',
    },
  };
  
  return descriptions[element][language as 'en' | 'fr' | 'ar'] || descriptions[element].en;
}

function getSpiritualFocus(element: Element, language: string): string {
  const focus = {
    fire: {
      en: 'Focus on courage (yā Qawiyy), purification through action, and cutting through stagnation. Recommended dhikr: Yā Qawiyy, Yā Nūr.',
      fr: 'Concentrez-vous sur le courage (yā Qawiyy), la purification par l\'action et le dépassement de la stagnation. Dhikr recommandé: Yā Qawiyy, Yā Nūr.',
      ar: 'ركز على الشجاعة (يا قَوِيّ)، التطهير من خلال العمل، وقطع الركود. الذكر الموصى به: يا قَوِيّ، يا نُور.',
    },
    water: {
      en: 'Focus on divine gentleness (yā Laṭīf), emotional healing, and intuitive connection. Recommended dhikr: Yā Laṭīf, Yā Wadūd.',
      fr: 'Concentrez-vous sur la douceur divine (yā Laṭīf), la guérison émotionnelle et la connexion intuitive. Dhikr recommandé: Yā Laṭīf, Yā Wadūd.',
      ar: 'ركز على اللطف الإلهي (يا لَطِيف)، الشفاء العاطفي، والاتصال الحدسي. الذكر الموصى به: يا لَطِيف، يا وَدُود.',
    },
    air: {
      en: 'Focus on divine knowledge (yā ʿAlīm), clear communication, and learning. Recommended dhikr: Yā ʿAlīm, Yā Ḥakīm.',
      fr: 'Concentrez-vous sur la connaissance divine (yā ʿAlīm), la communication claire et l\'apprentissage. Dhikr recommandé: Yā ʿAlīm, Yā Ḥakīm.',
      ar: 'ركز على العلم الإلهي (يا عَلِيم)، التواصل الواضح، والتعلم. الذكر الموصى به: يا عَلِيم، يا حَكِيم.',
    },
    earth: {
      en: 'Focus on divine provision (yā Razzāq), patience, and building stable foundations. Recommended dhikr: Yā Razzāq, Yā Ṣabūr.',
      fr: 'Concentrez-vous sur la provision divine (yā Razzāq), la patience et la construction de fondations stables. Dhikr recommandé: Yā Razzāq, Yā Ṣabūr.',
      ar: 'ركز على الرزق الإلهي (يا رَزَّاق)، الصبر، وبناء أسس مستقرة. الذكر الموصى به: يا رَزَّاق، يا صَبُور.',
    },
  };
  
  return focus[element][language as 'en' | 'fr' | 'ar'] || focus[element].en;
}

function getBestActivities(element: Element, language: string): string[] {
  const activities = {
    fire: {
      en: [
        'Starting new projects or ventures',
        'Physical exercise and movement',
        'Clearing clutter and obstacles',
        'Making bold decisions',
        'Leadership and taking initiative',
      ],
      fr: [
        'Commencer de nouveaux projets ou entreprises',
        'Exercice physique et mouvement',
        'Éliminer l\'encombrement et les obstacles',
        'Prendre des décisions audacieuses',
        'Leadership et prise d\'initiative',
      ],
      ar: [
        'بدء مشاريع أو مبادرات جديدة',
        'التمارين البدنية والحركة',
        'تنظيف الفوضى والعوائق',
        'اتخاذ قرارات جريئة',
        'القيادة وأخذ المبادرة',
      ],
    },
    water: {
      en: [
        'Meditation and contemplation',
        'Emotional healing work',
        'Creative and artistic pursuits',
        'Connecting with loved ones',
        'Prayer and spiritual practices',
      ],
      fr: [
        'Méditation et contemplation',
        'Travail de guérison émotionnelle',
        'Activités créatives et artistiques',
        'Se connecter avec ses proches',
        'Prière et pratiques spirituelles',
      ],
      ar: [
        'التأمل والتفكر',
        'العمل على الشفاء العاطفي',
        'المساعي الإبداعية والفنية',
        'التواصل مع الأحباء',
        'الصلاة والممارسات الروحية',
      ],
    },
    air: {
      en: [
        'Learning and studying',
        'Writing and communication',
        'Planning and strategizing',
        'Networking and socializing',
        'Teaching and sharing knowledge',
      ],
      fr: [
        'Apprentissage et étude',
        'Écriture et communication',
        'Planification et stratégie',
        'Réseautage et socialisation',
        'Enseignement et partage de connaissances',
      ],
      ar: [
        'التعلم والدراسة',
        'الكتابة والتواصل',
        'التخطيط والاستراتيجية',
        'التواصل الاجتماعي',
        'التعليم ومشاركة المعرفة',
      ],
    },
    earth: {
      en: [
        'Financial planning and budgeting',
        'Home organization and repairs',
        'Building routines and habits',
        'Physical health care',
        'Practical problem-solving',
      ],
      fr: [
        'Planification financière et budgétisation',
        'Organisation et réparations domestiques',
        'Construire des routines et des habitudes',
        'Soins de santé physique',
        'Résolution pratique de problèmes',
      ],
      ar: [
        'التخطيط المالي والميزانية',
        'تنظيم المنزل والإصلاحات',
        'بناء الروتين والعادات',
        'العناية بالصحة البدنية',
        'حل المشكلات العملية',
      ],
    },
  };
  
  return activities[element][language as 'en' | 'fr' | 'ar'] || activities[element].en;
}

function getMethodIcon(type: BalancingMethodType): keyof typeof Ionicons.glyphMap {
  switch (type) {
    case 'divine_name':
      return 'sparkles';
    case 'dhikr':
      return 'repeat';
    case 'prayer':
      return 'moon';
    case 'letter_sequence':
      return 'leaf';
    case 'timing':
      return 'time';
    default:
      return 'information-circle';
  }
}

const ZODIAC_ORDER = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'] as const;

const PLANET_SYMBOLS: Record<string, string> = {
  sun: '☉',
  moon: '☽',
  mercury: '☿',
  venus: '♀',
  mars: '♂',
  jupiter: '♃',
  saturn: '♄',
};

const AVG_DAYS_PER_SIGN: Record<Planet, number> = {
  Moon: 2.5,
  Mercury: 22,
  Venus: 27,
  Mars: 50,
  Sun: 30.4,
  Jupiter: 365,
  Saturn: 900,
};

const DAY_MS = 24 * 60 * 60 * 1000;

function getAdjacentSigns(signKey?: string) {
  if (!signKey) return null;
  const index = ZODIAC_ORDER.indexOf(signKey as any);
  if (index === -1) return null;
  const prev = ZODIAC_ORDER[(index + ZODIAC_ORDER.length - 1) % ZODIAC_ORDER.length];
  const next = ZODIAC_ORDER[(index + 1) % ZODIAC_ORDER.length];
  return { prev, next };
}

function formatMonthYear(value: Date | null, locale: string) {
  if (!value || Number.isNaN(value.getTime())) return '—';
  return value.toLocaleDateString(locale, { month: 'short', year: 'numeric' });
}

function formatDateTime(value: Date | null, locale: string) {
  if (!value || Number.isNaN(value.getTime())) return '—';
  return value.toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function estimateTransitDates(
  planet: Planet,
  now: Date,
  percentThroughSign: number
): { start: Date; end: Date } {
  const totalDays = AVG_DAYS_PER_SIGN[planet] ?? 30;
  const start = new Date(now.getTime() - (percentThroughSign / 100) * totalDays * DAY_MS);
  const end = new Date(start.getTime() + totalDays * DAY_MS);
  return { start, end };
}

function formatDayCount(value: number) {
  const days = Math.max(0, Math.round(value));
  if (days < 30) return `${days}d`;
  const months = Math.round(days / 30);
  return `~${months}mo`;
}

function getPlanetGradient(planetKey?: string): GradientTuple {
  switch ((planetKey ?? '').toLowerCase()) {
    case 'sun':
      return ['#FDB813', '#F78C00'];
    case 'moon':
      return ['#DDE2E7', '#9BA7B4'];
    case 'mercury':
      return ['#9BE4C2', '#4DB08D'];
    case 'venus':
      return ['#F6C0D4', '#D66BA0'];
    case 'mars':
      return ['#FF8A5B', '#E0523C'];
    case 'jupiter':
      return ['#F2C48D', '#C88A4F'];
    case 'saturn':
      return ['#E2D5B5', '#B9A67C'];
    default:
      return ['#9FA9B3', '#6B7785'];
  }
}

function formatCountdown(totalSeconds: number) {
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(clamped / 60);
  const seconds = clamped % 60;
  return `${minutes}m ${seconds.toString().padStart(2, '0')}s`;
}

function mapPlanetKeyToPlanet(planetKey: string | undefined): Planet | null {
  if (!planetKey) return null;
  const normalized = planetKey.toLowerCase();
  if (normalized === 'sun') return 'Sun';
  if (normalized === 'moon') return 'Moon';
  if (normalized === 'mars') return 'Mars';
  if (normalized === 'mercury') return 'Mercury';
  if (normalized === 'jupiter') return 'Jupiter';
  if (normalized === 'venus') return 'Venus';
  if (normalized === 'saturn') return 'Saturn';
  return null;
}

/**
 * Derive element from zodiac key when elementKey is not in transit data
 */
function getElementFromZodiacKey(zodiacKey: string | undefined): Element | null {
  if (!zodiacKey) return null;
  const normalized = zodiacKey.toLowerCase();
  
  // Fire signs
  if (['aries', 'leo', 'sagittarius'].includes(normalized)) return 'fire';
  // Earth signs
  if (['taurus', 'virgo', 'capricorn'].includes(normalized)) return 'earth';
  // Air signs
  if (['gemini', 'libra', 'aquarius'].includes(normalized)) return 'air';
  // Water signs
  if (['cancer', 'scorpio', 'pisces'].includes(normalized)) return 'water';
  
  return null;
}

type TransitLensCopy = {
  aboutTitle: string;
  aboutBody: string;
  collectiveTitle: string;
  collectiveBody: string;
  resonanceTitle: string;
  resonanceBody: string;
  degreeBody?: string;
};

type TSafety = (key: string, fallback: string, vars?: Record<string, any>) => string;
type TTranslate = (key: string, vars?: Record<string, any>) => string;

function getPlanetFunctionText(planetKey: string | undefined, tSafe: TSafety): string {
  const key = (planetKey ?? '').toLowerCase();
  const en: Record<string, string> = {
    sun: 'The Sun governs authority, vitality, clarity, and purpose.',
    moon: 'The Moon governs moods, memory, nourishment, and the rhythms of daily life.',
    mercury: 'Mercury governs speech, trade, learning, and the movement of information.',
    venus: 'Venus governs harmony, affection, beauty, and the ease of relationships.',
    mars: 'Mars governs drive, conflict, courage, and decisive action.',
    jupiter: 'Jupiter governs growth, wisdom, generosity, and meaningful expansion.',
    saturn: 'Saturn governs structure, limits, responsibility, time, and endurance.',
  };

  const resolved = en[key] ? key : 'saturn';
  return tSafe(`screens.planetTransit.lens.planetFunction.${resolved}`, en[resolved]);
}

function getSignThemeText(zodiacKey: string | undefined, tSafe: TSafety): string {
  const key = (zodiacKey ?? '').toLowerCase();
  const en: Record<string, string> = {
    aries: 'initiative, leadership, and courageous beginnings',
    taurus: 'stability, resources, and steady building',
    gemini: 'communication, learning, and quick exchange',
    cancer: 'home, protection, and emotional security',
    leo: 'visibility, authority, and creative confidence',
    virgo: 'details, health, and practical refinement',
    libra: 'balance, agreements, and relationship dynamics',
    scorpio: 'depth, boundaries, and transformative pressure',
    sagittarius: 'belief, exploration, and broader meaning',
    capricorn: 'duty, institutions, and long-term structure',
    aquarius: 'community, innovation, and collective systems',
    pisces: 'compassion, sensitivity, and dissolving old forms',
  };

  const resolved = en[key] ? key : 'aries';
  return tSafe(`screens.planetTransit.lens.signThemes.${resolved}`, en[resolved]);
}

function getElementResonanceTail(
  userElement: Element | null, 
  tSafe: TSafety,
  userSign?: string,
  transitElement?: Element
): string {
  if (!userElement) return '';
  
  // Scorpio Special Case: Mars-ruled water that shares fire's intensity
  const normalizedUserSign = userSign?.toLowerCase();
  if (normalizedUserSign === 'scorpio' && transitElement === 'fire') {
    return tSafe(
      'screens.planetTransit.lens.elementTails.scorpioWithFire',
      "Scorpio's Mars-ruled water shares fire's intensity—use this powerful synergy for deep transformation."
    );
  }
  
  const en: Record<Element, string> = {
    water: 'Water nature often absorbs this quietly rather than confrontationally.',
    fire: 'Fire nature tends to feel it as urgency—channel it into clean action.',
    earth: 'Earth nature tends to seek structure—steady routines help.',
    air: 'Air nature often feels it mentally—name priorities to reduce scatter.',
  };

  return tSafe(`screens.planetTransit.lens.elementTails.${userElement}`, en[userElement]);
}

function buildTransitLensCopy(args: {
  planetKey: string | undefined;
  planetName: string;
  zodiacKey: string | undefined;
  signName: string;
  userElement: Element | null;
  userSign?: string;
  transitElement?: Element;
  isPersonalTransit: boolean;
  t: TTranslate;
  tSafe: TSafety;
  degreePhase: { phase: 'early' | 'middle' | 'late'; percent: number } | null;
}): TransitLensCopy {
  const { planetKey, planetName, zodiacKey, signName, userElement, userSign, transitElement, isPersonalTransit, t, tSafe, degreePhase } = args;

  const labels = {
    about: t('screens.planetTransit.lens.sections.about'),
    collective: t('screens.planetTransit.lens.sections.collective'),
    resonance: t('screens.planetTransit.lens.sections.resonance'),
    degree: t('screens.planetTransit.lens.sections.degree'),
  };

  const aboutBody = getPlanetFunctionText(planetKey, tSafe);

  const signTheme = getSignThemeText(zodiacKey, tSafe);
  const collectiveBody = t('screens.planetTransit.lens.collectiveTemplate', {
    planet: planetName,
    sign: signName,
    theme: signTheme,
  });

  const resonanceBodyBase = t(
    isPersonalTransit
      ? 'screens.planetTransit.lens.resonanceBase.personal'
      : 'screens.planetTransit.lens.resonanceBase.collective'
  );
  const resonanceTail = getElementResonanceTail(userElement, tSafe, userSign, transitElement);
  const resonanceBody = resonanceTail ? `${resonanceBodyBase} ${resonanceTail}` : resonanceBodyBase;

  let degreeBody: string | undefined;
  if (degreePhase) {
    const stage = degreePhase.phase;
    degreeBody = t(`screens.planetTransit.lens.degreePhases.${stage}`);
  }

  return {
    aboutTitle: labels.about,
    aboutBody,
    collectiveTitle: labels.collective,
    collectiveBody,
    resonanceTitle: labels.resonance,
    resonanceBody,
    degreeBody: degreeBody ? `${labels.degree}: ${degreeBody}` : undefined,
  };
}

export default function PlanetTransitDetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t, tSafe, language } = useLanguage();
  const { profile } = useProfile();
  const params = useLocalSearchParams();

  const detailsType = (params.type as DetailsType) || 'transit';
  const payload = params.payload;
  const isPersonalTransit = params.isPersonal === 'true';

  const transitPayload = useMemo(
    () => safeJsonParse<PlanetTransitInfo | LegacyPlanetTransitInfo>(payload),
    [payload]
  );
  const nextDayPayload = useMemo(() => safeJsonParse<NextDayPayload>(payload), [payload]);
  const [transitState, setTransitState] = useState<PlanetTransitInfo | LegacyPlanetTransitInfo | null>(
    transitPayload
  );
  const [refreshing, setRefreshing] = useState(false);

  const ZODIAC_SYSTEM_KEY = '@asrar_zodiac_system';
  const [zodiacSystem, setZodiacSystem] = useState<ZodiacSystem>('tropical');

  useEffect(() => {
    const loadPreference = async () => {
      try {
        const stored = await AsyncStorage.getItem(ZODIAC_SYSTEM_KEY);
        if (stored === 'sidereal_lahiri' || stored === 'tropical') {
          setZodiacSystem(stored);
        }
      } catch {
        // ignore
      }
    };
    void loadPreference();
  }, []);

  const persistZodiacSystem = useCallback(async (value: ZodiacSystem) => {
    try {
      await AsyncStorage.setItem(ZODIAC_SYSTEM_KEY, value);
    } catch {
      // ignore
    }
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────
  // BUG FIX: Sync transitState when route params change (clicking different planet)
  // useState only uses initial value; we must explicitly update when payload changes
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (transitPayload) {
      setTransitState(transitPayload);
    }
  }, [transitPayload]);
  const orbScale = useRef(new Animated.Value(0.92)).current;
  const [showWhy, setShowWhy] = useState(false);
  const [expandedMethod, setExpandedMethod] = useState<number | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<ExpandableSection, boolean>>({
    duration: true,
    personalized: true,
    guidance: false,
    dignity: false,
  });
  
  // Fetch all planet transits for the comprehensive view
  const [allTransits, setAllTransits] = useState<AllPlanetTransits | null>(null);
  const [loadingAllTransits, setLoadingAllTransits] = useState(true);
  
  // Planetary hours state for spiritual practice timing
  const [planetaryHourData, setPlanetaryHourData] = useState<PlanetaryHourData | null>(null);
  const [planetaryBoundaries, setPlanetaryBoundaries] = useState<{
    sunrise: Date;
    sunset: Date;
    nextSunrise: Date;
  } | null>(null);
  
  // Selected dhikr tier for user choice
  const [selectedTier, setSelectedTier] = useState<DhikrTier>('standard');
  
  // ScrollView ref for scroll-to-top when tapping transits
  const scrollViewRef = useRef<ScrollView>(null);

  // Fetch planetary hours based on user location
  useEffect(() => {
    const fetchPlanetaryHours = async () => {
      const location = profile.location;
      if (!location?.latitude || !location?.longitude) {
        // Use approximate times if no location
        const approxSunrise = new Date();
        approxSunrise.setHours(6, 30, 0, 0);
        const approxSunset = new Date();
        approxSunset.setHours(18, 30, 0, 0);
        const approxNextSunrise = new Date(approxSunrise);
        approxNextSunrise.setDate(approxNextSunrise.getDate() + 1);
        
        const data = calculatePlanetaryHours(approxSunrise, approxSunset, approxNextSunrise, new Date());
        setPlanetaryHourData(data);
        setPlanetaryBoundaries({
          sunrise: approxSunrise,
          sunset: approxSunset,
          nextSunrise: approxNextSunrise,
        });
        return;
      }
      
      try {
        const boundaries = await getPlanetaryDayBoundariesForNow(
          { latitude: location.latitude, longitude: location.longitude }
        );
        if (boundaries) {
          const data = calculatePlanetaryHours(
            boundaries.sunrise,
            boundaries.sunset,
            boundaries.nextSunrise,
            new Date()
          );
          setPlanetaryHourData(data);
          setPlanetaryBoundaries(boundaries);
        }
      } catch (error) {
        console.warn('[PlanetTransit] Failed to fetch planetary hours:', error);
      }
    };
    
    fetchPlanetaryHours();
    // Refresh every minute for accurate timing
    const interval = setInterval(fetchPlanetaryHours, 60000);
    return () => clearInterval(interval);
  }, [profile.location?.latitude, profile.location?.longitude]);

  const toggleSection = (section: ExpandableSection) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  type DignityStateCode = 'sharaf' | 'bayt' | 'qubul' | 'wabal' | 'hubut';
  const DIGNITY_AR_SHORT: Record<DignityStateCode, string> = {
    sharaf: 'شرف',
    bayt: 'بيت',
    qubul: 'قبول',
    wabal: 'وبال',
    hubut: 'هبوط',
  };

  const getDignityStateFromStatus = (
    status: 'Domicile' | 'Exalted' | 'Detriment' | 'Fall' | 'Neutral'
  ): DignityStateCode => {
    if (status === 'Exalted') return 'sharaf';
    if (status === 'Domicile') return 'bayt';
    if (status === 'Detriment') return 'wabal';
    if (status === 'Fall') return 'hubut';
    return 'qubul';
  };

  const getStrengthColor = (strength: number): string => {
    if (strength >= 90) return '#4CAF50';
    if (strength >= 70) return '#8BC34A';
    if (strength >= 50) return '#FFC107';
    if (strength >= 30) return '#FF9800';
    return '#F44336';
  };

  const getStrengthQualityKey = (strength: number): 'excellent' | 'good' | 'moderate' | 'weak' | 'veryWeak' => {
    if (strength >= 90) return 'excellent';
    if (strength >= 70) return 'good';
    if (strength >= 50) return 'moderate';
    if (strength >= 30) return 'weak';
    return 'veryWeak';
  };

  const collectNumberedList = (baseKey: string, max = 10): string[] => {
    const items: string[] = [];
    for (let i = 1; i <= max; i++) {
      const item = tSafe(`${baseKey}.${i}`, '');
      if (!item) break;
      items.push(item);
    }
    return items;
  };

  const transitDataRaw = (transitState ?? transitPayload) as LegacyPlanetTransitInfo | PlanetTransitInfo | null;
  const isLegacyTransit = (data: LegacyPlanetTransitInfo | PlanetTransitInfo | null): data is LegacyPlanetTransitInfo =>
    !!data && 'signDegree' in data;

  const transitData = useMemo(() => {
    if (detailsType !== 'transit') return transitDataRaw;
    if (!transitDataRaw) return transitDataRaw;
    if (zodiacSystem === 'tropical') return transitDataRaw;
    if (!isLegacyTransit(transitDataRaw)) return transitDataRaw;

    const longitude = (transitDataRaw as LegacyPlanetTransitInfo).longitude;
    if (typeof longitude !== 'number') return transitDataRaw;
    const dateForMapping = transitDataRaw.updatedAt ? new Date(transitDataRaw.updatedAt as any) : new Date();
    const mapped = mapLongitudeToZodiac(longitude, dateForMapping, zodiacSystem);

    return {
      ...transitDataRaw,
      zodiacKey: mapped.sign,
      zodiacSymbol: ZODIAC_DATA[mapped.sign as ZodiacKey]?.symbol ?? transitDataRaw.zodiacSymbol,
      elementKey: mapped.element,
      signDegree: mapped.signDegree,
      signMinute: mapped.signMinute,
      // Keep longitude as system-adjusted longitude
      longitude: mapped.longitude,
    };
  }, [detailsType, transitDataRaw, zodiacSystem]);

  const contextElement: Element | null = useMemo(() => {
    if (detailsType === 'transit') {
      const transit = transitData as any;
      return (transit?.elementKey as Element | undefined) ?? getElementFromZodiacKey(transit?.zodiacKey) ?? null;
    }
    return (nextDayPayload?.element as Element | undefined) ?? null;
  }, [detailsType, transitData, nextDayPayload]);

  const userElement = (profile.derived?.element as Element | undefined) ?? null;
  const safeUserElement = userElement ?? 'earth';
  const safeContextElement = contextElement ?? 'earth';
  const userZodiacKey = useMemo(
    () =>
      resolveUserZodiacKey({
        burjIndex: profile.derived?.burjIndex,
        burj: profile.derived?.burj,
      }),
    [profile.derived?.burjIndex, profile.derived?.burj]
  );

  // Get transit sign for Scorpio special case handling
  const transitZodiacKey = useMemo(() => {
    if (detailsType === 'transit') {
      const transit = transitData as any;
      return transit?.zodiacKey?.toLowerCase() ?? undefined;
    }
    return undefined;
  }, [detailsType, transitData]);

  const harmony: HarmonyLevel | null = useMemo(() => {
    if (!contextElement || !userElement) return null;
    return getHarmonyLevel(
      userElement,
      contextElement,
      userZodiacKey?.toLowerCase(),
      transitZodiacKey
    );
  }, [userElement, contextElement, userZodiacKey, transitZodiacKey]);

  const accent = contextElement ? ElementAccents[contextElement] : ElementAccents.earth;
  const resonancePalette = useMemo(() => getResonancePalette(harmony, accent), [harmony, accent]);

  // BATTERY OPTIMIZATION: Pause countdown timer when app is backgrounded
  const [now, setNow] = useState(new Date());
  const appStateRef = useRef(AppState.currentState);
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    
    const startInterval = () => {
      if (interval) clearInterval(interval);
      interval = setInterval(() => {
        if (appStateRef.current === 'active') {
          setNow(new Date());
        }
      }, 1000);
    };
    
    const subscription = AppState.addEventListener('change', (nextState) => {
      const wasBackground = appStateRef.current !== 'active';
      appStateRef.current = nextState;
      if (nextState === 'active' && wasBackground) {
        setNow(new Date());
        startInterval();
      } else if (nextState !== 'active' && interval) {
        clearInterval(interval);
        interval = null;
      }
    });
    
    if (appStateRef.current === 'active') {
      startInterval();
    }
    
    return () => {
      subscription.remove();
      if (interval) clearInterval(interval);
    };
  }, []);

  const countdownText = useMemo(() => {
    if (detailsType !== 'transit' || !(transitDataRaw as any)?.nextHourStartTime) return null;
    const next = new Date((transitDataRaw as any)?.nextHourStartTime as any);
    const diffSeconds = Math.floor((next.getTime() - now.getTime()) / 1000);
    return formatCountdown(diffSeconds);
  }, [detailsType, transitDataRaw, now]);

  const signProgress = useMemo(() => {
    const data = transitData as LegacyPlanetTransitInfo | PlanetTransitInfo | null;
    if (!isLegacyTransit(data) || typeof data.signDegree !== 'number') return null;
    const degree = data.signDegree + (data.signMinute ?? 0) / 60;
    const percent = Math.min(100, Math.max(0, (degree / 30) * 100));
    const degreeLabel = `${Math.floor(degree)}° ${String(data.signMinute ?? 0).padStart(2, '0')}′`;
    return { percent, degreeLabel };
  }, [transitData]);

  const enhancedPower = useMemo(() => {
    if (detailsType !== 'transit') return null;
    const data = transitData as LegacyPlanetTransitInfo | PlanetTransitInfo | null;
    const planet = mapPlanetKeyToPlanet((data as any)?.planetKey);
    const sign = (data as any)?.zodiacKey as any;
    if (!planet || !sign) return null;

    const degree =
      typeof (data as any)?.signDegree === 'number'
        ? (data as any).signDegree + ((data as any).signMinute ?? 0) / 60
        : 0;

    const longitude = typeof (data as any)?.longitude === 'number' ? (data as any).longitude : 0;
    const sunLongitudeCandidate = typeof allTransits?.Sun?.longitude === 'number' ? allTransits.Sun.longitude : undefined;
    const sunLongitude = typeof sunLongitudeCandidate === 'number' ? sunLongitudeCandidate : planet === 'Sun' ? longitude : 0;
    const isRetrograde = !!(data as any)?.isRetrograde;

    return calculateEnhancedPlanetaryPower(planet, sign, degree, longitude, sunLongitude, isRetrograde);
  }, [detailsType, transitData, allTransits]);


  const updatedAtLabel = useMemo(() => {
    const data = transitData as LegacyPlanetTransitInfo | PlanetTransitInfo | null;
    if (!data?.updatedAt) return '—';
    const updatedAt = new Date(data.updatedAt as any);
    return formatDateTime(updatedAt, language);
  }, [transitData, language]);

  const sourceLabel = useMemo(() => {
    const data = transitData as LegacyPlanetTransitInfo | PlanetTransitInfo | null;
    const source = (data as any)?.source as LegacyPlanetTransitInfo['source'] | undefined;
    if (source === 'ephemeris') return t('screens.planetTransit.dataSource.api');
    if (source === 'cached') return t('screens.planetTransit.dataSource.cached');
    if (source === 'fallback') {
      return language === 'ar'
        ? 'تقريب (غير موثوق)'
        : language === 'fr'
          ? 'Approximation (non fiable)'
          : 'Approximation (unreliable)';
    }
    return t('common.unknown');
  }, [transitData, t, language]);

  const handleRefresh = useCallback(async () => {
    if (detailsType !== 'transit' || refreshing) return;
    const planetKey = (transitData as any)?.planetKey;
    const planet = mapPlanetKeyToPlanet(planetKey);
    if (!planet) return;

    try {
      setRefreshing(true);
      const [fresh, transits] = await Promise.all([getTransit(planet), getAllTransits()]);
      if (transits) {
        setAllTransits(transits);
      }

      if (fresh) {
        const legacy = adaptTransitToLegacyFormat(fresh);
        setTransitState(legacy);
      }
    } catch (error) {
      if (__DEV__) {
        console.error('[PlanetTransitDetails] Refresh failed:', error);
      }
    } finally {
      setRefreshing(false);
    }
  }, [detailsType, refreshing, transitData]);

  // Auto-refresh to match TransitService UI freshness (5 minutes)
  useEffect(() => {
    if (detailsType !== 'transit') return;
    const interval = setInterval(() => {
      void handleRefresh();
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [detailsType, handleRefresh]);

  const title = detailsType === 'transit' ? t('screens.planetTransit.title') : t('home.planetTransitDetails.title');
  
  // Transit type labels for personal vs cosmic weather
  const transitTypeLabel = useMemo(() => {
    if (detailsType !== 'transit') return null;
    if (isPersonalTransit) {
      return language === 'ar' ? 'في برجك' : language === 'fr' ? 'Dans ton signe' : 'In Your Sign';
    } else {
      return language === 'ar' ? 'الطقس الكوني' : language === 'fr' ? 'Météo cosmique' : 'Cosmic Weather';
    }
  }, [detailsType, isPersonalTransit, language]);
  
  const explainer =
    detailsType === 'transit'
      ? t('screens.planetTransit.explanation')
      : t('home.planetTransitDetails.explainers.tomorrowRuler');
  const personalizationLine =
    detailsType === 'transit'
      ? t('screens.planetTransit.personalizedNote')
      : t('home.planetTransitDetails.subtitleNextDay');

  const primaryCardTitle =
    detailsType === 'transit'
      ? t('screens.planetTransit.currentTransit')
      : t('home.planetTransitDetails.sections.tomorrowRuler');

  const transitDates = useMemo(() => {
    const data = transitData as LegacyPlanetTransitInfo | PlanetTransitInfo | null;
    if (!data) return { start: null, end: null, estimated: true };
    const start = isLegacyTransit(data) && data.transitStartDate ? new Date(data.transitStartDate as any) : null;
    const end = isLegacyTransit(data) && data.transitEndDate ? new Date(data.transitEndDate as any) : null;
    if (start && end) return { start, end, estimated: false };

    const planet = mapPlanetKeyToPlanet(data.planetKey) ?? 'Sun';
    const percent = signProgress?.percent ?? 0;
    const fallback = estimateTransitDates(planet, now, percent);
    return { start: fallback.start, end: fallback.end, estimated: true };
  }, [transitData, signProgress, now]);

  const durationStats = useMemo(() => {
    if (!transitDates.start || !transitDates.end) return null;
    const totalDays = (transitDates.end.getTime() - transitDates.start.getTime()) / DAY_MS;
    const elapsedDays = (now.getTime() - transitDates.start.getTime()) / DAY_MS;
    const remainingDays = (transitDates.end.getTime() - now.getTime()) / DAY_MS;
    return {
      total: formatDayCount(totalDays),
      elapsed: formatDayCount(elapsedDays),
      remaining: formatDayCount(remainingDays),
    };
  }, [transitDates, now]);

  const degreePhase = useMemo(() => {
    if (!signProgress) return null;
    const percent = signProgress.percent;
    const phase: 'early' | 'middle' | 'late' = percent < 33.4 ? 'early' : percent < 66.7 ? 'middle' : 'late';
    return { percent: Math.round(percent), phase };
  }, [signProgress]);

  // ─────────────────────────────────────────────────────────────────────────────
  // SPIRITUAL GUIDANCE based on classical degree system (0-10 / 10-20 / 20-30)
  // Enhanced with planetary hour timing, dhikr tiers, AND actual transit strength
  // ─────────────────────────────────────────────────────────────────────────────
  const spiritualGuidance = useMemo<SpiritualGuidance | null>(() => {
    if (detailsType !== 'transit') return null;
    const data = transitData as LegacyPlanetTransitInfo | PlanetTransitInfo | null;
    if (!data || !isLegacyTransit(data)) return null;
    
    const degree = data.signDegree ?? 0;
    const phase = getSpiritualPhase(degree);
    
    // Pass the actual transit strength (from dignity calculation) to get accurate status
    const transitStrength = enhancedPower?.finalPower ?? 50;
    
    const planetData = getPlanetSpiritualData(
      data.planetKey,
      phase,
      t,
      tSafe,
      planetaryHourData,
      planetaryBoundaries?.sunrise ?? null,
      planetaryBoundaries?.sunset ?? null,
      planetaryBoundaries?.nextSunrise ?? null,
      now,
      transitStrength
    );
    
    return {
      phase,
      ...planetData,
    };
  }, [detailsType, transitData, enhancedPower, t, tSafe, planetaryHourData, planetaryBoundaries, now]);
  
  // Update selected tier when recommended tier changes
  useEffect(() => {
    if (spiritualGuidance?.recommendedTier) {
      setSelectedTier(spiritualGuidance.recommendedTier);
    }
  }, [spiritualGuidance?.recommendedTier]);

  const focusPills = useMemo(
    () => [
      t('screens.planetTransit.focus.communication'),
      t('screens.planetTransit.focus.patience'),
      t('screens.planetTransit.focus.reflection'),
    ],
    [t]
  );

  const balancingMethods = useMemo<BalancingMethod[]>(() => {
    if (!userElement || !contextElement) return [];
    const methods: BalancingMethod[] = [];

    if (harmony === 'challenging') {
      methods.push({
        type: 'divine_name',
        title: t('screens.planetTransit.balancing.methods.latif.title'),
        titleArabic: t('screens.planetTransit.balancing.methods.latif.titleArabic'),
        instruction: t('screens.planetTransit.balancing.methods.latif.instruction'),
        count: 129,
        numerology: t('screens.planetTransit.balancing.methods.latif.numerology'),
        bestTime: t('screens.planetTransit.balancing.methods.latif.bestTime'),
        source: t('screens.planetTransit.balancing.methods.latif.source'),
      });
      methods.push({
        type: 'divine_name',
        title: t('screens.planetTransit.balancing.methods.halim.title'),
        titleArabic: t('screens.planetTransit.balancing.methods.halim.titleArabic'),
        instruction: t('screens.planetTransit.balancing.methods.halim.instruction'),
        count: 88,
        numerology: t('screens.planetTransit.balancing.methods.halim.numerology'),
        bestTime: t('screens.planetTransit.balancing.methods.halim.bestTime'),
        source: t('screens.planetTransit.balancing.methods.halim.source'),
      });
      methods.push({
        type: 'prayer',
        title: t('screens.planetTransit.balancing.methods.hajah.title'),
        titleArabic: t('screens.planetTransit.balancing.methods.hajah.titleArabic'),
        instruction: t('screens.planetTransit.balancing.methods.hajah.instruction'),
        bestTime: t('screens.planetTransit.balancing.methods.hajah.bestTime'),
        source: t('screens.planetTransit.balancing.methods.hajah.source'),
      });
      methods.push({
        type: 'letter_sequence',
        title: t('screens.planetTransit.balancing.methods.letters.title'),
        titleArabic: t('screens.planetTransit.balancing.methods.letters.titleArabic'),
        instruction: t('screens.planetTransit.balancing.methods.letters.instruction'),
        bestTime: t('screens.planetTransit.balancing.methods.letters.bestTime'),
        source: t('screens.planetTransit.balancing.methods.letters.source'),
      });
    }

    if (harmony === 'supportive' || harmony === 'harmonious') {
      methods.push({
        type: 'divine_name',
        title: t('screens.planetTransit.balancing.methods.mubin.title'),
        titleArabic: t('screens.planetTransit.balancing.methods.mubin.titleArabic'),
        instruction: t('screens.planetTransit.balancing.methods.mubin.instruction'),
        count: 102,
        numerology: t('screens.planetTransit.balancing.methods.mubin.numerology'),
        bestTime: t('screens.planetTransit.balancing.methods.mubin.bestTime'),
        source: t('screens.planetTransit.balancing.methods.mubin.source'),
      });
      methods.push({
        type: 'dhikr',
        title: t('screens.planetTransit.balancing.methods.shukr.title'),
        titleArabic: t('screens.planetTransit.balancing.methods.shukr.titleArabic'),
        instruction: t('screens.planetTransit.balancing.methods.shukr.instruction'),
        count: 100,
        bestTime: t('screens.planetTransit.balancing.methods.shukr.bestTime'),
        source: t('screens.planetTransit.balancing.methods.shukr.source'),
      });
    }

    if (harmony === 'neutral') {
      methods.push({
        type: 'divine_name',
        title: t('screens.planetTransit.balancing.methods.hakim.title'),
        titleArabic: t('screens.planetTransit.balancing.methods.hakim.titleArabic'),
        instruction: t('screens.planetTransit.balancing.methods.hakim.instruction'),
        count: 78,
        numerology: t('screens.planetTransit.balancing.methods.hakim.numerology'),
        bestTime: t('screens.planetTransit.balancing.methods.hakim.bestTime'),
        source: t('screens.planetTransit.balancing.methods.hakim.source'),
      });
    }

    methods.push({
      type: 'dhikr',
      title: t('screens.planetTransit.balancing.methods.istighfar.title'),
      titleArabic: t('screens.planetTransit.balancing.methods.istighfar.titleArabic'),
      instruction: t('screens.planetTransit.balancing.methods.istighfar.instruction'),
      count: 70,
      bestTime: t('screens.planetTransit.balancing.methods.istighfar.bestTime'),
      source: t('screens.planetTransit.balancing.methods.istighfar.source'),
    });
    methods.push({
      type: 'dhikr',
      title: t('screens.planetTransit.balancing.methods.salawat.title'),
      titleArabic: t('screens.planetTransit.balancing.methods.salawat.titleArabic'),
      instruction: t('screens.planetTransit.balancing.methods.salawat.instruction'),
      count: 100,
      bestTime: t('screens.planetTransit.balancing.methods.salawat.bestTime'),
      source: t('screens.planetTransit.balancing.methods.salawat.source'),
    });

    return methods;
  }, [t, harmony, userElement, contextElement]);

  const bestForText = harmony ? t(`home.planetTransitDetails.harmony.${harmony}.bestFor`) : '';
  const avoidText = harmony ? t(`home.planetTransitDetails.harmony.${harmony}.avoid`) : '';
  const { label: bestForLabel, body: bestForBody } = useMemo(() => splitLabeledText(bestForText), [bestForText]);
  const { label: avoidLabel, body: avoidBody } = useMemo(() => splitLabeledText(avoidText), [avoidText]);

  const historyDates = useMemo(() => {
    const data = transitData as LegacyPlanetTransitInfo | PlanetTransitInfo | null;
    const planet = mapPlanetKeyToPlanet(data?.planetKey) ?? 'Sun';
    const avgDays = AVG_DAYS_PER_SIGN[planet] ?? 30;
    if (!transitDates.start || !transitDates.end) return null;
    const prevStart = new Date(transitDates.start.getTime() - avgDays * DAY_MS);
    const prevEnd = new Date(transitDates.start.getTime());
    const nextStart = new Date(transitDates.end.getTime());
    const nextEnd = new Date(transitDates.end.getTime() + avgDays * DAY_MS);
    return { prevStart, prevEnd, nextStart, nextEnd };
  }, [transitDates, transitData]);
  const adjacent = getAdjacentSigns((transitData as any)?.zodiacKey as any);

  const allTransitsDisplay = useMemo<AllPlanetTransits | null>(() => {
    if (!allTransits) return null;
    if (zodiacSystem === 'tropical') return allTransits;

    const mapped: Partial<AllPlanetTransits> = {};
    for (const [planetKey, transitInfo] of Object.entries(allTransits) as Array<[string, PlanetTransit]>) {
      const longitude = transitInfo.longitude;
      if (typeof longitude !== 'number') {
        (mapped as any)[planetKey] = transitInfo;
        continue;
      }
      const dateForMapping = transitInfo.lastUpdated ? new Date(transitInfo.lastUpdated as any) : new Date();
      const m = mapLongitudeToZodiac(longitude, dateForMapping, zodiacSystem);
      (mapped as any)[planetKey] = {
        ...transitInfo,
        // Keep original tropical longitude so we can remap again safely.
        longitude: transitInfo.longitude,
        sign: m.sign,
        signArabic: m.signArabic,
        element: m.element,
        signDegree: m.signDegree,
        signMinute: m.signMinute,
      } satisfies PlanetTransit;
    }
    return mapped as AllPlanetTransits;
  }, [allTransits, zodiacSystem]);

  const allTransitsStrengthSummary = useMemo(() => {
    if (detailsType !== 'transit' || !allTransitsDisplay) return null;

    const sunLongitudeCandidate =
      typeof (allTransitsDisplay as any)?.Sun?.longitude === 'number'
        ? (allTransitsDisplay as any).Sun.longitude
        : typeof (allTransitsDisplay as any)?.sun?.longitude === 'number'
          ? (allTransitsDisplay as any).sun.longitude
          : undefined;
    const fallbackSunLongitude = typeof sunLongitudeCandidate === 'number' ? sunLongitudeCandidate : 0;

    const items = (Object.entries(allTransitsDisplay) as Array<[string, PlanetTransit]> )
      .map(([planetKey, transitInfo]) => {
        const planet = mapPlanetKeyToPlanet(planetKey);
        const sign = (transitInfo as any)?.sign as any;
        const longitude = (transitInfo as any)?.longitude;
        if (!planet || !sign || typeof longitude !== 'number') return null;

        const degree =
          typeof (transitInfo as any)?.signDegree === 'number'
            ? (transitInfo as any).signDegree + ((transitInfo as any).signMinute ?? 0) / 60
            : ((longitude % 30) + 30) % 30;

        const isRetrograde = !!(transitInfo as any)?.isRetrograde;
        const sunLongitude = planet === 'Sun' ? longitude : fallbackSunLongitude;

        const enhanced = calculateEnhancedPlanetaryPower(planet, sign, degree, longitude, sunLongitude, isRetrograde);
        return {
          planetKey,
          planet,
          finalPower: enhanced.finalPower,
        };
      })
      .filter((item): item is NonNullable<typeof item> => !!item)
      .sort((a, b) => b.finalPower - a.finalPower);

    if (!items.length) return null;

    const best = items.slice(0, 3);
    const weak = items.slice(-3).reverse();
    return { best, weak };
  }, [detailsType, allTransitsDisplay]);

  const influenceTypeLabel = useMemo(() => {
    const labels = {
      en: { universal: 'Universal', personal: 'Personal', immediate: 'Immediate' },
      fr: { universal: 'Universel', personal: 'Personnel', immediate: 'Immédiat' },
      ar: { universal: 'عام', personal: 'شخصي', immediate: 'فوري' },
    } as const;
    return labels[language as 'en' | 'fr' | 'ar'];
  }, [language]);

  const getDegreePhaseLabel = useCallback(
    (stage: 'entry' | 'stabilization' | 'completion') => {
      if (language === 'fr') {
        return stage === 'entry'
          ? '🔵 Phase d’entrée'
          : stage === 'stabilization'
            ? '🟢 Phase de pointe'
            : '🟠 Phase de clôture';
      }
      if (language === 'ar') {
        return stage === 'entry'
          ? '🔵 مرحلة الدخول'
          : stage === 'stabilization'
            ? '🟢 مرحلة الذروة'
            : '🟠 مرحلة الإغلاق';
      }
      return stage === 'entry' ? '🔵 Entry Phase' : stage === 'stabilization' ? '🟢 Peak Phase' : '🟠 Closing Phase';
    },
    [language]
  );

  const getDegreeStageBadgeLabel = useCallback(
    (stage: 'entry' | 'stabilization' | 'completion') => {
      if (language === 'fr') {
        return stage === 'entry' ? 'Entrée' : stage === 'stabilization' ? 'Pic' : 'Clôture';
      }
      if (language === 'ar') {
        return stage === 'entry' ? 'دخول' : stage === 'stabilization' ? 'ذروة' : 'إغلاق';
      }
      return stage === 'entry' ? 'Entry' : stage === 'stabilization' ? 'Peak' : 'Closing';
    },
    [language]
  );

  const getElementalResonanceLabel = useCallback(
    (resonance: 'harmonious' | 'supportive' | 'neutral' | 'challenging') => {
      if (language === 'fr') {
        return resonance === 'harmonious'
          ? 'Harmonieux'
          : resonance === 'supportive'
            ? 'Supportif'
            : resonance === 'neutral'
              ? 'Neutre'
              : 'Transformateur';
      }
      if (language === 'ar') {
        return resonance === 'harmonious'
          ? 'منسجم'
          : resonance === 'supportive'
            ? 'داعمة'
            : resonance === 'neutral'
              ? 'متوازن'
              : 'تحويلي';
      }
      return resonance === 'harmonious'
        ? 'Harmonious'
        : resonance === 'supportive'
          ? 'Supportive'
          : resonance === 'neutral'
            ? 'Neutral'
            : 'Challenging';
    },
    [language]
  );
  
  // Calculate personalized planetary influence
  const personalizedInfluence: PersonalizedInfluence | null = useMemo(() => {
    if (detailsType !== 'transit') return null;
    const data = transitData as LegacyPlanetTransitInfo | PlanetTransitInfo | null;
    if (!data) return null;
    
    const planet = mapPlanetKeyToPlanet(data.planetKey);
    if (!planet) return null; // Can't calculate without valid planet
    
    // Use safe defaults when user data is missing
    const transitElement = contextElement ?? 'earth';
    const userElem = userElement ?? 'earth';
    const degree = isLegacyTransit(data) ? (data.signDegree ?? 0) : 0;
    
    // Get sign keys for Scorpio special case handling
    const transitSignKey = (data as any)?.zodiacKey?.toLowerCase() ?? undefined;
    const userSignKey = userZodiacKey?.toLowerCase() ?? undefined;
    
    // ALWAYS return influence - service handles all cases including non-personal transits
    return getPersonalizedInfluence(
      planet,
      degree,
      transitElement,
      userElem,
      isPersonalTransit,
      language as any,
      userSignKey,
      transitSignKey
    );
  }, [detailsType, transitData, contextElement, userElement, isPersonalTransit, language, userZodiacKey]);

  useEffect(() => {
    Animated.timing(orbScale, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [orbScale]);
  
  // Load all transits on mount
  useEffect(() => {
    const loadAllTransits = async () => {
      try {
        setLoadingAllTransits(true);
        const transits = await getAllTransits();
        setAllTransits(transits);
      } catch (error) {
        if (__DEV__) {
          console.error('[PlanetTransitDetails] Error loading all transits:', error);
        }
      } finally {
        setLoadingAllTransits(false);
      }
    };
    
    loadAllTransits();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['rgba(30, 20, 40, 1)', 'rgba(20, 20, 40, 0.98)', 'rgba(15, 15, 35, 0.95)']}
        style={[styles.headerGradient, { paddingTop: insets.top }]}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
            <BlurView intensity={24} tint="dark" style={styles.buttonBlur}>
              <Ionicons name="chevron-back" size={22} color="#fff" />
            </BlurView>
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>{title}</Text>
            <View style={styles.headerSubtitleRow}>
              <Text style={styles.headerSubtitle}>
                {detailsType === 'transit' ? t('screens.planetTransit.headerSubtitle') : primaryCardTitle}
              </Text>
              {transitTypeLabel && (
                <View style={[styles.transitTypeBadge, { backgroundColor: isPersonalTransit ? 'rgba(76, 175, 80, 0.2)' : 'rgba(100, 149, 237, 0.2)' }]}>
                  <Text style={[styles.transitTypeBadgeText, { color: isPersonalTransit ? '#4CAF50' : '#6495ED' }]}>
                    {transitTypeLabel}
                  </Text>
                </View>
              )}
            </View>
          </View>
          {detailsType === 'transit' ? (
            <TouchableOpacity
              onPress={handleRefresh}
              style={[styles.headerButton, refreshing && styles.refreshButtonDisabled]}
              disabled={refreshing}
            >
              <BlurView intensity={24} tint="dark" style={styles.buttonBlur}>
                <Ionicons name="refresh" size={18} color="#fff" />
              </BlurView>
            </TouchableOpacity>
          ) : (
            <View style={styles.headerButtonPlaceholder} />
          )}
        </View>
      </LinearGradient>

      <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          detailsType === 'transit' ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#FFFFFF"
              colors={[accent.primary]}
              progressBackgroundColor="rgba(20, 20, 35, 1)"
            />
          ) : undefined
        }
      >
        {detailsType === 'transit' && transitData ? (
          <>
            <View style={styles.heroContainer}>
              <GlassCard style={styles.planetCard}>
                <View style={styles.planetOrbContainer}>
                  <View style={[styles.planetGlow, { backgroundColor: accent.primary }]} />
                  <LinearGradient
                    colors={getPlanetGradient(transitData.planetKey)}
                    style={styles.planetOrbLarge}
                  >
                    <Animated.View style={{ transform: [{ scale: orbScale }] }}>
                      <Text style={styles.planetSymbolLarge}>{transitData.planetSymbol}</Text>
                    </Animated.View>
                  </LinearGradient>
                </View>
                <Text style={styles.planetNameHero}>{transitData.planetName}</Text>
                <Text style={styles.planetArabicHero}>{transitData.planetNameAr}</Text>

                {enhancedPower ? (
                  <View style={styles.powerStrip}>
                    <View style={styles.powerTrack}>
                      <View
                        style={[
                          styles.powerFill,
                          {
                            width: `${Math.min(100, Math.max(0, enhancedPower.finalPower))}%`,
                            backgroundColor: getStrengthColor(enhancedPower.finalPower),
                          },
                        ]}
                      />
                    </View>
                    <View style={styles.powerMetaRow}>
                      <Text style={styles.powerMetaLabel}>{t('screens.planetTransit.dignity.finalStrength')}:</Text>
                      <Text style={[styles.powerMetaValue, { color: getStrengthColor(enhancedPower.finalPower) }]}>
                        {enhancedPower.finalPower}%
                      </Text>
                      <View style={[styles.powerQualityPill, { borderColor: `${getStrengthColor(enhancedPower.finalPower)}55` }]}
                      >
                        <Text style={[styles.powerQualityText, { color: getStrengthColor(enhancedPower.finalPower) }]}>
                          {t(`dailyEnergy.planetaryStrength.qualities.${getStrengthQualityKey(enhancedPower.finalPower)}`)}
                        </Text>
                      </View>
                    </View>
                  </View>
                ) : null}

                {(transitData as any)?.isRetrograde ? (
                  <View style={styles.retrogradePill}>
                    <Text style={styles.retrogradePillText}>℞</Text>
                    <Text style={styles.retrogradePillText}>
                      {language === 'ar' ? 'تراجع' : language === 'fr' ? 'Rétrograde' : 'Retrograde'}
                    </Text>
                  </View>
                ) : null}
              </GlassCard>

              <View style={styles.connectorContainer}>
                <View style={styles.connectorLine} />
                <Text style={styles.connectorText}>{t('screens.planetTransit.in').toUpperCase()}</Text>
                <View style={styles.connectorLine} />
              </View>

              <GlassCard style={styles.signCard}>
                <View style={styles.signBadge}>
                  <View style={[styles.signIconContainer, { backgroundColor: `${accent.primary}20` }]}> 
                    <Text style={styles.zodiacSymbolLarge}>{transitData.zodiacSymbol}</Text>
                  </View>
                  <View style={styles.signTextContainer}>
                    <Text style={styles.signNameHero} numberOfLines={1}>
                      {transitData.zodiacKey ? t(`zodiac.${transitData.zodiacKey}`) : t('common.unknown')}
                    </Text>
                    <Text style={styles.signArabicHero} numberOfLines={1}>
                      {transitData.zodiacKey ? t(`zodiac.${transitData.zodiacKey}Arabic`) : ''}
                    </Text>
                  </View>
                </View>
                <View style={[styles.elementTag, { borderColor: `${accent.primary}30`, backgroundColor: `${accent.primary}15` }]}> 
                  <Ionicons name={getElementIconName(contextElement ?? 'earth')} size={12} color={accent.primary} />
                  <Text style={[styles.elementText, { color: accent.primary }]}> 
                    {tSafe(`common.elements.${contextElement}`, toTitleCase(contextElement ?? 'earth')).toUpperCase()} SIGN
                  </Text>
                </View>

                <View style={styles.zodiacSystemRow}>
                  <Text style={styles.zodiacSystemLabel}>
                    {language === 'ar' ? 'نظام البروج' : language === 'fr' ? 'Zodiaque' : 'Zodiac'}
                  </Text>
                  <View style={styles.zodiacSystemToggle}>
                    <TouchableOpacity
                      style={[styles.zodiacSystemOption, zodiacSystem === 'tropical' && styles.zodiacSystemOptionActive]}
                      onPress={() => {
                        setZodiacSystem('tropical');
                        void persistZodiacSystem('tropical');
                      }}
                      accessibilityRole="button"
                    >
                      <Text
                        style={[styles.zodiacSystemOptionText, zodiacSystem === 'tropical' && styles.zodiacSystemOptionTextActive]}
                      >
                        {language === 'fr' ? 'Tropical' : language === 'ar' ? 'استوائي' : 'Tropical'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.zodiacSystemOption,
                        zodiacSystem === 'sidereal_lahiri' && styles.zodiacSystemOptionActive,
                      ]}
                      onPress={() => {
                        setZodiacSystem('sidereal_lahiri');
                        void persistZodiacSystem('sidereal_lahiri');
                      }}
                      accessibilityRole="button"
                    >
                      <Text
                        style={[
                          styles.zodiacSystemOptionText,
                          zodiacSystem === 'sidereal_lahiri' && styles.zodiacSystemOptionTextActive,
                        ]}
                      >
                        {language === 'fr' ? 'Sidéreal (Lahiri)' : language === 'ar' ? 'نجمي (لاهيري)' : 'Sidereal (Lahiri)'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </GlassCard>
            </View>

            <GlassCard style={styles.infoStrip}>
              <Text style={styles.explainerText}>{explainer}</Text>
              <Text style={styles.explainerMeta}>{personalizationLine}</Text>
            </GlassCard>

            {/* Collective Influence - interpretation (Premium) */}
            {personalizedInfluence && !isPersonalTransit && (
              <PremiumSection
                featureId="personalGuidance"
                title={t('premiumSections.transitGuidance.title')}
                description={t('premiumSections.transitGuidance.description')}
                icon="🧭"
              >
                <GlassCard style={styles.influenceCard}>
                  <View style={styles.cardHeader}>
                    <Ionicons name="globe-outline" size={20} color="#6495ED" />
                    <Text style={styles.cardTitle}>
                      {t('home.planetTransitDetails.influenceEngine.collectiveInfluence')}
                    </Text>
                  </View>

                  {/* Influence Type Badge */}
                  <View
                    style={[
                      styles.influenceTypeBadge,
                      {
                        backgroundColor: getInfluenceTypeColor(personalizedInfluence.influenceType) + '20',
                        borderColor: getInfluenceTypeColor(personalizedInfluence.influenceType) + '50',
                        alignSelf: 'flex-start',
                      },
                    ]}
                  >
                    <Text style={[styles.influenceTypeText, { color: getInfluenceTypeColor(personalizedInfluence.influenceType) }]}>
                      {(influenceTypeLabel?.[personalizedInfluence.influenceType] ?? personalizedInfluence.influenceType).toUpperCase()}{' '}
                      {language === 'ar' ? 'عبور' : 'TRANSIT'}
                    </Text>
                  </View>

                  {/* Collective Impact (Cosmic Weather) */}
                  <View style={[styles.summaryCard, { borderColor: '#6495ED30' }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                      <Ionicons name="cloudy-night-outline" size={16} color="#6495ED" />
                      <Text style={[styles.summaryTitle, { color: '#6495ED' }]}>
                        {t('home.planetTransitDetails.influenceEngine.cosmicWeather')}
                      </Text>
                    </View>
                    <Text style={styles.summaryText}>{personalizedInfluence.collectiveSummary}</Text>
                  </View>

                  {/* Personal Relevance (Brief) */}
                  <View style={[styles.summaryCard, { borderColor: '#9C27B030' }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                      <Ionicons name="person-outline" size={16} color="#9C27B0" />
                      <Text style={[styles.summaryTitle, { color: '#9C27B0' }]}>
                        {t('home.planetTransitDetails.influenceEngine.forYou')}
                      </Text>
                    </View>
                    <Text style={styles.summaryText}>{personalizedInfluence.personalSummary}</Text>
                  </View>

                  {/* Simple disclaimer */}
                  <View style={[styles.disclaimerBox, { marginTop: 0 }]}>
                    <Ionicons name="information-circle-outline" size={14} color={DarkTheme.textMuted} />
                    <Text style={styles.disclaimerBoxText}>{t('home.planetTransitDetails.disclaimer')}</Text>
                  </View>
                </GlassCard>
              </PremiumSection>
            )}

            {detailsType === 'transit' && harmony ? (
              <PremiumSection
                featureId="elementalHarmony"
                compact
                title={t('premiumSections.personalizedImpact.title')}
                description={t('premiumSections.personalizedImpact.description')}
                icon="💫"
              >
                <View style={[styles.impactBanner, { borderColor: `${resonancePalette.primary}40` }]}>
                  <BlurView intensity={24} tint="dark" style={styles.impactBlur}>
                    <View style={styles.impactRow}>
                      <View style={[styles.impactIcon, { backgroundColor: `${resonancePalette.primary}20` }]}>
                        <Ionicons name="sparkles" size={20} color={resonancePalette.primary} />
                      </View>
                      <View style={styles.impactText}>
                        <Text style={styles.impactLabel}>{t('screens.planetTransit.quickImpact.title')}</Text>
                        <Text style={[styles.impactValue, { color: resonancePalette.primary }]}>
                          {t(`home.planetTransitDetails.harmony.${harmony}.label`)}
                        </Text>
                        <Text style={styles.impactArabic}>{t(`screens.planetTransit.resonance.arabicTerms.${harmony}`)}</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={18} color={DarkTheme.textTertiary} />
                    </View>
                  </BlurView>
                  <Text style={styles.bodyText}>
                    {t(`home.planetTransitDetails.harmony.${harmony}.description`, {
                      userElement: tSafe(`common.elements.${userElement}`, toTitleCase(safeUserElement)).toLowerCase(),
                      contextElement: tSafe(`common.elements.${contextElement}`, toTitleCase(safeContextElement)).toLowerCase(),
                    })}
                  </Text>
                  <TouchableOpacity
                    style={styles.whyToggle}
                    onPress={() => {
                      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                      setShowWhy((prev) => !prev);
                    }}
                    activeOpacity={0.7}
                  >
                    <Ionicons name={showWhy ? 'chevron-up' : 'chevron-down'} size={16} color={DarkTheme.textSecondary} />
                    <Text style={styles.whyToggleText}>
                      {showWhy ? t('screens.planetTransit.why.hide') : t('screens.planetTransit.why.show')}
                    </Text>
                  </TouchableOpacity>
                  {showWhy ? (
                    <View style={styles.whyPanel}>
                      <Text style={styles.whyTitle}>{t('screens.planetTransit.why.title')}</Text>
                      <Text style={styles.bodyText}>{t('screens.planetTransit.why.body')}</Text>
                    </View>
                  ) : null}
                  <View style={styles.focusRow}>
                    <Text style={styles.focusTitle}>{t('screens.planetTransit.focus.title')}</Text>
                    <View style={styles.focusPills}>
                      {focusPills.map((pill) => (
                        <View key={pill} style={styles.focusPill}>
                          <Text style={styles.focusPillText}>{pill}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              </PremiumSection>
            ) : null}

            <GlassCard style={styles.durationCard}>
              <TouchableOpacity style={styles.expandableHeader} onPress={() => toggleSection('duration')}>
                <View style={styles.cardHeader}>
                  <Ionicons name="calendar" size={18} color={accent.primary} />
                  <Text style={styles.cardTitle}>{t('screens.planetTransit.duration.title')}</Text>
                </View>
                <Ionicons name={expandedSections.duration ? 'chevron-up' : 'chevron-down'} size={18} color={DarkTheme.textSecondary} />
              </TouchableOpacity>

              {expandedSections.duration && (
                <View style={styles.timelineContent}>
                  <View style={styles.timelineRowWide}>
                    <View style={styles.milestone}>
                      <View style={styles.milestoneMarker}>
                        <Ionicons name="arrow-forward-circle" size={18} color={accent.primary} />
                      </View>
                      <Text style={styles.milestoneDate}>{formatMonthYear(transitDates.start, language)}</Text>
                      <Text style={styles.milestoneLabel}>{t('screens.planetTransit.duration.enteredSign')}</Text>
                    </View>
                    <View style={styles.progressContainer}>
                      <View style={styles.progressTrack}>
                        <LinearGradient
                          colors={[accent.primary, resonancePalette.light]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={[styles.progressFillWide, { width: `${signProgress?.percent ?? 0}%` }]}
                        />
                        <View style={[styles.nowMarker, { left: `${signProgress?.percent ?? 0}%` }]}>
                          <View style={styles.nowMarkerDot} />
                          <Text style={styles.nowLabel}>{t('screens.planetTransit.timeline.now')}</Text>
                          <Text style={styles.nowDate}>{formatMonthYear(new Date(), language)}</Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.milestone}>
                      <View style={styles.milestoneMarker}>
                        <Ionicons name="arrow-back-circle" size={18} color="#FF6B35" />
                      </View>
                      <Text style={styles.milestoneDate}>{formatMonthYear(transitDates.end, language)}</Text>
                      <Text style={styles.milestoneLabel}>{t('screens.planetTransit.duration.leavesSign')}</Text>
                    </View>
                  </View>

                  {durationStats ? (
                    <View style={styles.statsGrid}>
                      <View style={styles.statCard}>
                        <Text style={styles.statValue}>{durationStats.elapsed}</Text>
                        <Text style={styles.statLabel}>{t('screens.planetTransit.durationStats.elapsed')}</Text>
                      </View>
                      <View style={styles.statCard}>
                        <Text style={styles.statValue}>{durationStats.remaining}</Text>
                        <Text style={styles.statLabel}>{t('screens.planetTransit.durationStats.remaining')}</Text>
                      </View>
                      <View style={styles.statCard}>
                        <Text style={styles.statValue}>{durationStats.total}</Text>
                        <Text style={styles.statLabel}>{t('screens.planetTransit.durationStats.total')}</Text>
                      </View>
                    </View>
                  ) : null}
                  {transitDates.estimated ? (
                    <Text style={styles.infoHint}>{t('screens.planetTransit.history.estimated')}</Text>
                  ) : null}
                </View>
              )}
            </GlassCard>

            {signProgress && degreePhase ? (
              <GlassCard style={styles.degreeCard}>
                <View style={styles.cardHeader}>
                  <Ionicons name="navigate" size={18} color={accent.primary} />
                  <Text style={styles.cardTitle}>{t('screens.planetTransit.degree.title')}</Text>
                </View>
                <View style={styles.degreeContent}>
                  <View style={styles.circularProgress}>
                    <Svg width={140} height={140}>
                      <Circle cx={70} cy={70} r={56} stroke="rgba(255, 255, 255, 0.1)" strokeWidth={12} fill="none" />
                      <Circle
                        cx={70}
                        cy={70}
                        r={56}
                        stroke={accent.primary}
                        strokeWidth={12}
                        fill="none"
                        strokeDasharray={`${(signProgress.percent / 100) * 351.86} 351.86`}
                        strokeLinecap="round"
                        transform="rotate(-90 70 70)"
                      />
                    </Svg>
                    <View style={styles.circularCenter}>
                      <Text style={styles.degreeValue}>{signProgress.degreeLabel}</Text>
                      <Text style={styles.degreeTotal}>30°</Text>
                      <Text style={styles.degreePercent}>{degreePhase.percent}%</Text>
                    </View>
                  </View>
                  <Text style={styles.bodyText}>
                    {t('screens.planetTransit.degree.explanation', {
                      degree: signProgress.degreeLabel,
                      percent: degreePhase.percent,
                    })}
                  </Text>
                  <View style={styles.phaseRow}>
                    <View style={[styles.phaseBadge, degreePhase.phase === 'early' ? styles.phaseActive : styles.phaseInactive]}>
                      <Text style={styles.phaseText}>{t('screens.planetTransit.degree.phases.early')}</Text>
                    </View>
                    <View style={[styles.phaseBadge, degreePhase.phase === 'middle' ? styles.phaseActive : styles.phaseInactive]}>
                      <Text style={styles.phaseText}>{t('screens.planetTransit.degree.phases.middle')}</Text>
                    </View>
                    <View style={[styles.phaseBadge, degreePhase.phase === 'late' ? styles.phaseActive : styles.phaseInactive]}>
                      <Text style={styles.phaseText}>{t('screens.planetTransit.degree.phases.late')}</Text>
                    </View>
                  </View>
                </View>
              </GlassCard>
            ) : null}

            {enhancedPower ? (
              <GlassCard style={styles.dignityCard}>
                <TouchableOpacity style={styles.expandableHeader} onPress={() => toggleSection('dignity')}>
                  <View style={styles.cardHeader}>
                    <Ionicons name="analytics" size={18} color={accent.primary} />
                    <Text style={styles.cardTitle}>{t('screens.planetTransit.dignity.title')}</Text>
                  </View>
                  <Ionicons
                    name={expandedSections.dignity ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color={DarkTheme.textSecondary}
                  />
                </TouchableOpacity>

                {expandedSections.dignity ? (
                  <View style={styles.dignityContent}>
                    {(() => {
                      const state = getDignityStateFromStatus(enhancedPower.dignityInfo.status);
                      const planetKey = enhancedPower.planet.toLowerCase();
                      const dignityLabel = t(`screens.planetTransit.dignity.states.${state}`);
                      const guidanceBase = `screens.planetTransit.dignityGuidance.${planetKey}.${state}`;
                      const fallbackBase = `screens.planetTransit.dignityGuidance.generic.${state}`;

                      const whatThisMeans =
                        tSafe(`${guidanceBase}.whatThisMeans`, '') ||
                        tSafe(`${fallbackBase}.whatThisMeans`, '', {
                          planet: (transitData as any)?.planetName ?? enhancedPower.planet,
                          sign: (transitData as any)?.zodiacKey ? t(`zodiac.${(transitData as any)?.zodiacKey}`) : String(enhancedPower.sign),
                        });

                      const suitableForPrimary = collectNumberedList(`${guidanceBase}.suitableFor`);
                      const suitableFor = suitableForPrimary.length
                        ? suitableForPrimary
                        : collectNumberedList(`${fallbackBase}.suitableFor`);

                      const avoidPrimary = collectNumberedList(`${guidanceBase}.avoid`);
                      const avoid = avoidPrimary.length
                        ? avoidPrimary
                        : collectNumberedList(`${fallbackBase}.avoid`);

                      const betterTimingPrimary = collectNumberedList(`${guidanceBase}.betterTiming`);
                      const betterTiming = betterTimingPrimary.length
                        ? betterTimingPrimary
                        : collectNumberedList(`${fallbackBase}.betterTiming`);

                      return (
                        <>
                          <View style={styles.dignityRow}>
                            <Text style={styles.dignityLabel}>{t('screens.planetTransit.dignity.state')}:</Text>
                            <View style={[styles.dignityBadge, { borderColor: `${accent.primary}40` }]}
                            >
                              <Text style={[styles.dignityBadgeText, { color: accent.primary }]}
                              >
                                {dignityLabel} ({DIGNITY_AR_SHORT[state]})
                              </Text>
                            </View>
                          </View>

                          <Text style={styles.dignityExplanation}>
                            {tSafe(
                              `screens.planetTransit.dignity.explanations.${state}`,
                              enhancedPower.dignityInfo.description,
                              {
                                planet: (transitData as any)?.planetName ?? enhancedPower.planet,
                                sign: (transitData as any)?.zodiacKey
                                  ? t(`zodiac.${(transitData as any)?.zodiacKey}`)
                                  : String(enhancedPower.sign),
                              }
                            )}
                          </Text>

                          <View style={styles.dignityStatsGrid}>
                            <View style={styles.dignityStat}>
                              <Text style={styles.dignityStatLabel}>{t('screens.planetTransit.dignity.baseModifier')}</Text>
                              <Text style={styles.dignityStatValue}>×{enhancedPower.dignityInfo.modifier.toFixed(1)}</Text>
                            </View>
                            <View style={styles.dignityStat}>
                              <Text style={styles.dignityStatLabel}>{t('screens.planetTransit.dignity.degreeModifier')}</Text>
                              <Text style={styles.dignityStatValue}>×{enhancedPower.degreeInfo.strength.toFixed(1)}</Text>
                            </View>
                            <View style={styles.dignityStat}>
                              <Text style={styles.dignityStatLabel}>{t('screens.planetTransit.dignity.finalStrength')}</Text>
                              <Text style={[styles.dignityStatValue, { color: getStrengthColor(enhancedPower.finalPower) }]}>
                                {enhancedPower.finalPower}%
                              </Text>
                            </View>
                          </View>

                          {whatThisMeans ? (
                            <View style={styles.dignitySection}>
                              <Text style={styles.dignitySectionTitle}>⚠️ {t('screens.planetTransit.dignity.whatThisMeans')}</Text>
                              <Text style={styles.dignityBodyText}>{whatThisMeans}</Text>
                            </View>
                          ) : null}

                          {suitableFor.length > 0 ? (
                            <View style={styles.dignitySection}>
                              <Text style={styles.dignitySectionTitle}>✅ {t('screens.planetTransit.dignity.suitableFor')}</Text>
                              {suitableFor.map((item, idx) => (
                                <View key={idx} style={styles.dignityBulletRow}>
                                  <Text style={styles.dignityBullet}>•</Text>
                                  <Text style={styles.dignityBulletText}>{item}</Text>
                                </View>
                              ))}
                            </View>
                          ) : null}

                          {avoid.length > 0 ? (
                            <View style={styles.dignitySection}>
                              <Text style={styles.dignitySectionTitle}>❌ {t('screens.planetTransit.dignity.avoid')}</Text>
                              {avoid.map((item, idx) => (
                                <View key={idx} style={styles.dignityBulletRow}>
                                  <Text style={styles.dignityBullet}>•</Text>
                                  <Text style={styles.dignityBulletText}>{item}</Text>
                                </View>
                              ))}
                            </View>
                          ) : null}

                          {betterTiming.length > 0 ? (
                            <View style={styles.dignitySection}>
                              <Text style={styles.dignitySectionTitle}>💡 {t('screens.planetTransit.dignity.betterTiming')}</Text>
                              {betterTiming.map((item, idx) => (
                                <View key={idx} style={styles.dignityBulletRow}>
                                  <Text style={styles.dignityBullet}>•</Text>
                                  <Text style={styles.dignityBulletText}>{item}</Text>
                                </View>
                              ))}
                            </View>
                          ) : null}
                        </>
                      );
                    })()}
                  </View>
                ) : null}
              </GlassCard>
            ) : null}

            <GlassCard style={styles.personalizedCard}>
              <TouchableOpacity style={styles.expandableHeader} onPress={() => toggleSection('personalized')}>
                <View style={styles.cardHeader}>
                  <Ionicons name="person" size={18} color={accent.primary} />
                  <Text style={styles.cardTitle}>{t('screens.planetTransit.personalized.title')}</Text>
                </View>
                <Ionicons name={expandedSections.personalized ? 'chevron-up' : 'chevron-down'} size={18} color={DarkTheme.textSecondary} />
              </TouchableOpacity>

              {expandedSections.personalized ? (
                <PremiumSection
                  featureId="personalGuidance"
                  title={t('premiumSections.personalizedImpact.title')}
                  description={t('premiumSections.personalizedImpact.description')}
                  icon="🎯"
                >
                  {/* Transit Type Context Banner */}
                  <View style={[styles.transitContextBanner, { 
                    backgroundColor: isPersonalTransit ? 'rgba(76, 175, 80, 0.1)' : 'rgba(100, 149, 237, 0.1)',
                    borderColor: isPersonalTransit ? 'rgba(76, 175, 80, 0.3)' : 'rgba(100, 149, 237, 0.3)',
                  }]}>
                    <Ionicons 
                      name={isPersonalTransit ? 'star' : 'globe-outline'} 
                      size={18} 
                      color={isPersonalTransit ? '#4CAF50' : '#6495ED'} 
                    />
                    <View style={styles.transitContextTextContainer}>
                      <Text style={[styles.transitContextTitle, { color: isPersonalTransit ? '#4CAF50' : '#6495ED' }]}>
                          {isPersonalTransit
                            ? t('screens.planetTransit.context.title.personal')
                            : t('screens.planetTransit.context.title.collective')}
                      </Text>
                      <Text style={styles.transitContextDesc}>
                          {isPersonalTransit
                            ? t('screens.planetTransit.context.desc.personal')
                            : t('screens.planetTransit.context.desc.collective')}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.elementComparison}>
                    <View style={styles.elementCircle}>
                      <LinearGradient
                        colors={getElementGradient(userElement ?? 'earth')}
                        style={styles.elementGradientCircle}
                      >
                        <Ionicons name={getElementIconName(userElement ?? 'earth')} size={32} color="#fff" />
                      </LinearGradient>
                      <Text style={styles.elementCircleLabel}>{t('common.you').toUpperCase()}</Text>
                      <Text style={styles.elementCircleValue}>
                        {userElement ? tSafe(`common.elements.${userElement}`, toTitleCase(userElement)) : t('common.unknown')}
                      </Text>
                      <Text style={styles.elementCircleArabic}>{tSafe(`elements.${userElement}Arabic`, '')}</Text>
                    </View>
                    <View style={styles.vsContainer}>
                      <Ionicons name="sparkles" size={28} color={resonancePalette.primary} />
                      <Text style={[styles.vsText, { color: resonancePalette.primary }]}>vs</Text>
                    </View>
                    <View style={styles.elementCircle}>
                      <LinearGradient
                        colors={getElementGradient(contextElement ?? 'earth')}
                        style={styles.elementGradientCircle}
                      >
                        <Ionicons name={getElementIconName(contextElement ?? 'earth')} size={32} color="#fff" />
                      </LinearGradient>
                      <Text style={styles.elementCircleLabel}>{t('screens.planetTransit.currentTransit').toUpperCase()}</Text>
                      <Text style={styles.elementCircleValue}>
                        {contextElement ? tSafe(`common.elements.${contextElement}`, toTitleCase(contextElement)) : t('common.unknown')}
                      </Text>
                      <Text style={styles.elementCircleArabic}>{tSafe(`elements.${contextElement}Arabic`, '')}</Text>
                    </View>
                  </View>

                  {harmony ? (
                    <View style={[styles.resonanceCard, { borderColor: resonancePalette.primary }]}> 
                      <Text style={[styles.resonanceLabel, { color: resonancePalette.primary }]}>
                        {t(`home.planetTransitDetails.harmony.${harmony}.label`).toUpperCase()}
                      </Text>
                      <Text style={styles.resonanceDescription}>
                        {t(`home.planetTransitDetails.harmony.${harmony}.description`, {
                          userElement: tSafe(`common.elements.${userElement}`, toTitleCase(safeUserElement)).toLowerCase(),
                          contextElement: tSafe(`common.elements.${contextElement}`, toTitleCase(safeContextElement)).toLowerCase(),
                        })}
                      </Text>
                    </View>
                  ) : (
                    <Text style={styles.bodyText}>{t('home.planetTransitDetails.resonanceNoProfile')}</Text>
                  )}

                  {detailsType === 'transit' && userElement && userZodiacKey ? (
                    <View style={styles.impactPoints}>
                      <View style={styles.impactPoint}>
                        <Ionicons name="water" size={16} color={ElementAccents[userElement].primary} />
                        <Text style={styles.impactPointText}>{t('screens.planetTransit.personalized.point1')}</Text>
                      </View>
                      <View style={styles.impactPoint}>
                        <Ionicons name="flash" size={16} color={accent.primary} />
                        <Text style={styles.impactPointText}>{t('screens.planetTransit.personalized.point2')}</Text>
                      </View>
                      <View style={styles.impactPoint}>
                        <Ionicons name="shield" size={16} color={DarkTheme.textSecondary} />
                        <Text style={styles.impactPointText}>{t('screens.planetTransit.personalized.point3')}</Text>
                      </View>
                    </View>
                  ) : null}
                </PremiumSection>
              ) : null}
            </GlassCard>

            {/* Personalized Planetary Influence Engine - Show at TOP only if personal transit */}
            {personalizedInfluence && isPersonalTransit && (
              <GlassCard style={styles.influenceCard}>
                <View style={styles.cardHeader}>
                  <Ionicons name="planet" size={20} color={getInfluenceTypeColor(personalizedInfluence.influenceType)} />
                  <Text style={styles.cardTitle}>
                    {t('home.planetTransitDetails.influenceEngine.personalInfluence')}
                  </Text>
                </View>

                {/* Influence Type & Scope */}
                <View style={styles.influenceBadges}>
                  <View style={[styles.influenceTypeBadge, { backgroundColor: getInfluenceTypeColor(personalizedInfluence.influenceType) + '20', borderColor: getInfluenceTypeColor(personalizedInfluence.influenceType) + '50' }]}>
                    <Text style={[styles.influenceTypeText, { color: getInfluenceTypeColor(personalizedInfluence.influenceType) }]}>
                      {(influenceTypeLabel?.[personalizedInfluence.influenceType] ?? personalizedInfluence.influenceType).toUpperCase()}
                    </Text>
                  </View>
                  <View style={[styles.degreeStageBadge, { backgroundColor: getDegreeStageColor(personalizedInfluence.degreeStage.stage) + '20', borderColor: getDegreeStageColor(personalizedInfluence.degreeStage.stage) + '50' }]}>
                    <Ionicons name={getDegreeStageIcon(personalizedInfluence.degreeStage.stage) as any} size={14} color={getDegreeStageColor(personalizedInfluence.degreeStage.stage)} />
                    <Text style={[styles.degreeStageText, { color: getDegreeStageColor(personalizedInfluence.degreeStage.stage) }]}>
                      {(language === 'ar'
                        ? getDegreeStageBadgeLabel(personalizedInfluence.degreeStage.stage)
                        : getDegreeStageBadgeLabel(personalizedInfluence.degreeStage.stage).toUpperCase())}
                    </Text>
                  </View>
                </View>

                <Text style={styles.influenceScopeText}>{personalizedInfluence.scope}</Text>

                {/* Collective Impact (Cosmic Weather) - Always visible */}
                <View style={[styles.summaryCard, { borderColor: '#6495ED30' }]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                    <Ionicons name="globe-outline" size={16} color="#6495ED" />
                    <Text style={[styles.summaryTitle, { color: '#6495ED' }]}>
                      {t('home.planetTransitDetails.influenceEngine.collectiveImpact')}
                    </Text>
                  </View>
                  <Text style={styles.summaryText}>{personalizedInfluence.collectiveSummary}</Text>
                </View>

                {/* Personal Relevance - Always visible */}
                <View style={[styles.summaryCard, { borderColor: '#9C27B030' }]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                    <Ionicons name="person-outline" size={16} color="#9C27B0" />
                    <Text style={[styles.summaryTitle, { color: '#9C27B0' }]}>
                      {t('home.planetTransitDetails.influenceEngine.howRelates')}
                    </Text>
                  </View>
                  <Text style={styles.summaryText}>{personalizedInfluence.personalSummary}</Text>
                </View>

                {/* Degree Stage Explanation */}
                <View style={[styles.degreeExplanationCard, { borderColor: getDegreeStageColor(personalizedInfluence.degreeStage.stage) + '30' }]}>
                  <Text style={styles.degreeStageDescription}>
                    <Text style={{ fontWeight: '700' }}>
                      {getDegreePhaseLabel(personalizedInfluence.degreeStage.stage)}:
                    </Text>
                    {' '}{personalizedInfluence.degreeStage.description}
                  </Text>
                  <Text style={styles.degreeValue}>
                    {Math.floor(personalizedInfluence.degreeStage.degree)}° / 30°
                  </Text>
                </View>

                {/* Elemental Resonance */}
                <View style={[styles.resonanceCard, { borderColor: resonancePalette.primary }]}>
                  <Text style={[styles.resonanceLabel, { color: resonancePalette.primary }]}>
                    {(language === 'ar'
                      ? getElementalResonanceLabel(personalizedInfluence.elementalResonance)
                      : getElementalResonanceLabel(personalizedInfluence.elementalResonance).toUpperCase())}{' '}
                    {(language === 'fr' ? 'RÉSONANCE' : language === 'ar' ? 'رنين' : 'RESONANCE')}
                  </Text>
                  <Text style={styles.resonanceDescription}>
                    {personalizedInfluence.resonanceExplanation}
                  </Text>
                </View>

                {/* Timing Guidance */}
                <Text style={[styles.influenceTimingText, { fontStyle: 'italic' }]}>
                  {personalizedInfluence.personalizedGuidance.timing}
                </Text>

                {/* Premium: Detailed Guidance */}
                <PremiumSection
                  featureId="personalGuidance"
                  title={t('home.planetTransitDetails.influenceEngine.detailedGuidance')}
                  description={t('home.planetTransitDetails.influenceEngine.guidanceDescription')}
                  icon="🧭"
                >
                  {/* Best For */}
                  <View style={styles.guidanceSection}>
                    <View style={styles.guidanceSectionHeader}>
                      <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                      <Text style={styles.guidanceSectionTitle}>
                        {t('home.planetTransitDetails.influenceEngine.bestForNow')}
                      </Text>
                    </View>
                    {personalizedInfluence.personalizedGuidance.bestFor.map((item, idx) => (
                      <View key={idx} style={styles.guidanceListItem}>
                        <Text style={styles.guidanceBullet}>•</Text>
                        <Text style={styles.guidanceItemText}>{item}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Better to Avoid */}
                  <View style={styles.guidanceSection}>
                    <View style={styles.guidanceSectionHeader}>
                      <Ionicons name="close-circle" size={16} color="#FF6B35" />
                      <Text style={styles.guidanceSectionTitle}>
                        {t('home.planetTransitDetails.influenceEngine.betterToAvoid')}
                      </Text>
                    </View>
                    {personalizedInfluence.personalizedGuidance.avoid.map((item, idx) => (
                      <View key={idx} style={styles.guidanceListItem}>
                        <Text style={styles.guidanceBullet}>•</Text>
                        <Text style={styles.guidanceItemText}>{item}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Reflective Practices */}
                  <View style={styles.guidanceSection}>
                    <View style={styles.guidanceSectionHeader}>
                      <Ionicons name="moon" size={16} color="#9C27B0" />
                      <Text style={styles.guidanceSectionTitle}>
                        {t('home.planetTransitDetails.influenceEngine.reflectivePractices')}
                      </Text>
                    </View>
                    {personalizedInfluence.personalizedGuidance.reflectivePractices.map((item, idx) => (
                      <View key={idx} style={styles.guidanceListItem}>
                        <Text style={styles.guidanceBullet}>•</Text>
                        <Text style={styles.guidanceItemText}>{item}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Disclaimer */}
                  <View style={styles.disclaimerBox}>
                    <Ionicons name="information-circle-outline" size={14} color={DarkTheme.textMuted} />
                    <Text style={styles.disclaimerBoxText}>
                      {t('home.planetTransitDetails.disclaimer')}
                    </Text>
                  </View>
                </PremiumSection>
              </GlassCard>
            )}

            {/* All sections below are Premium - wrapped in PremiumSection */}
            <PremiumSection
              featureId="personalGuidance"
              title={t('premiumSections.personalizedInsights.title')}
              description={t('premiumSections.personalizedInsights.description')}
              icon="🎯"
            >
              <GlassCard style={styles.yourNatureCard}>
                <View style={styles.cardHeader}>
                  <Ionicons name="leaf" size={18} color={accent.primary} />
                  <Text style={styles.cardTitle}>{t('home.planetTransitDetails.sections.yourNature')}</Text>
                </View>
                {userElement ? (
                  <>
                  <Text style={styles.bodyText}>
                    {t('home.planetTransitDetails.yourElement', {
                      element: tSafe(`common.elements.${userElement}`, toTitleCase(userElement)),
                    })}
                  </Text>
                  {userZodiacKey ? (
                    <Text style={styles.bodyText}>
                      {t('home.planetTransitDetails.yourZodiac', {
                        zodiac: formatZodiacWithArabic(userZodiacKey, language as any, {
                          forceBilingual: language !== 'ar',
                          arabicFirst: true,
                          includeGlyph: true,
                        }),
                      })}
                    </Text>
                  ) : null}
                </>
              ) : (
                <>
                  <Text style={styles.bodyText}>{t('home.planetTransitDetails.missingProfile')}</Text>
                  <TouchableOpacity
                    style={[styles.profileButton, { backgroundColor: accent.primary }]}
                    onPress={() => router.push('/profile')}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.profileButtonText}>{t('home.planetTransitDetails.completeProfile')}</Text>
                    <Ionicons name="arrow-forward" size={18} color="#fff" />
                  </TouchableOpacity>
                </>
              )}
            </GlassCard>

            {detailsType === 'transit' ? (
              <GlassCard style={styles.guidanceCard}>
                <TouchableOpacity style={styles.expandableHeader} onPress={() => toggleSection('guidance')}>
                  <View style={styles.cardHeader}>
                    <Ionicons name="compass" size={18} color="#FFD700" />
                    <Text style={styles.cardTitle}>{t('screens.planetTransit.daily.title')}</Text>
                  </View>
                  <Ionicons name={expandedSections.guidance ? 'chevron-up' : 'chevron-down'} size={18} color={DarkTheme.textSecondary} />
                </TouchableOpacity>

                {expandedSections.guidance ? (
                  harmony ? (
                    <View>
                      <View style={styles.guidanceGrid}>
                        <View style={[styles.guidanceBox, styles.bestForBox]}>
                        <View style={styles.guidanceBoxHeader}>
                          <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                          <Text style={styles.guidanceBoxTitle}>
                            {bestForLabel || t('screens.planetTransit.daily.title')}
                          </Text>
                        </View>
                        <Text style={styles.guidanceItem} numberOfLines={6}>{bestForBody || bestForText}</Text>
                        </View>
                        <View style={[styles.guidanceBox, styles.avoidBox]}>
                        <View style={styles.guidanceBoxHeader}>
                          <Ionicons name="alert-circle" size={16} color="#FF9800" />
                          <Text style={styles.guidanceBoxTitle}>
                            {avoidLabel || t('screens.planetTransit.daily.title')}
                          </Text>
                        </View>
                        <Text style={styles.guidanceItem} numberOfLines={6}>{avoidBody || avoidText}</Text>
                        </View>
                      </View>

                      {/* 3-layer explanation (classical + non-fatalistic) */}
                      {(() => {
                        const planetName = transitData.planetName || toTitleCase(String(transitData.planetKey ?? ''));
                        const signName = transitData.zodiacKey
                          ? formatZodiacWithArabic(transitData.zodiacKey as any, language as any, { forceBilingual: language !== 'ar' })
                          : t('common.unknown');

                        const lens = buildTransitLensCopy({
                          planetKey: transitData.planetKey,
                          planetName,
                          zodiacKey: transitData.zodiacKey,
                          signName,
                          userElement: userElement ?? null,
                          userSign: userZodiacKey ?? undefined,
                          transitElement: contextElement ?? undefined,
                          isPersonalTransit,
                          t,
                          tSafe,
                          degreePhase,
                        });

                        const toneBg = isPersonalTransit ? 'rgba(76, 175, 80, 0.08)' : 'rgba(100, 149, 237, 0.08)';
                        const toneBorder = isPersonalTransit ? 'rgba(76, 175, 80, 0.2)' : 'rgba(100, 149, 237, 0.2)';

                        return (
                          <View style={[styles.transitLensCard, { backgroundColor: toneBg, borderColor: toneBorder }]}>
                            <View style={styles.transitLensRow}>
                              <Ionicons
                                name={isPersonalTransit ? 'flash' : 'earth'}
                                size={16}
                                color={isPersonalTransit ? '#4CAF50' : '#6495ED'}
                              />
                              <Text style={styles.transitLensTitle} numberOfLines={1}>
                                {isPersonalTransit
                                  ? t('screens.planetTransit.lens.badge.personal')
                                  : t('screens.planetTransit.lens.badge.collective')}
                              </Text>
                            </View>

                            <View style={styles.transitLensSection}>
                              <Text style={styles.transitLensLabel}>{lens.aboutTitle}</Text>
                              <Text style={styles.transitLensText}>{lens.aboutBody}</Text>
                            </View>

                            <View style={styles.transitLensSection}>
                              <Text style={styles.transitLensLabel}>{lens.collectiveTitle}</Text>
                              <Text style={styles.transitLensText}>{lens.collectiveBody}</Text>
                            </View>

                            <View style={styles.transitLensSection}>
                              <Text style={styles.transitLensLabel}>{lens.resonanceTitle}</Text>
                              <Text style={styles.transitLensText}>{lens.resonanceBody}</Text>
                            </View>

                            {lens.degreeBody ? (
                              <View style={styles.transitLensSection}>
                                <Text style={styles.transitLensText}>{lens.degreeBody}</Text>
                              </View>
                            ) : null}
                          </View>
                        );
                      })()}
                    </View>
                  ) : (
                    <View style={styles.dailyStack}>
                      <View style={styles.dailyItem}>
                        <Text style={styles.dailyLabel}>{t('screens.planetTransit.daily.morning')}</Text>
                        <Text style={styles.bodyText}>{t('screens.planetTransit.daily.morningText')}</Text>
                      </View>
                      <View style={styles.dailyItem}>
                        <Text style={styles.dailyLabel}>{t('screens.planetTransit.daily.afternoon')}</Text>
                        <Text style={styles.bodyText}>{t('screens.planetTransit.daily.afternoonText')}</Text>
                      </View>
                      <View style={styles.dailyItem}>
                        <Text style={styles.dailyLabel}>{t('screens.planetTransit.daily.evening')}</Text>
                        <Text style={styles.bodyText}>{t('screens.planetTransit.daily.eveningText')}</Text>
                      </View>
                    </View>
                  )
                ) : null}
              </GlassCard>
            ) : null}

            {detailsType === 'transit' && userZodiacKey ? (
              <GlassCard style={styles.balancingCard}>
                <View style={styles.cardHeader}>
                  <Ionicons name="shield" size={18} color={accent.primary} />
                  <Text style={styles.cardTitle}>{t('screens.planetTransit.balancing.title')}</Text>
                </View>
                <Text style={styles.cardSubtitle}>{t('screens.planetTransit.balancing.subtitle')}</Text>

                <View style={styles.signComparisonRow}>
                  <View style={styles.signItem}>
                    <Text style={styles.signLabel}>{t('screens.planetTransit.signComparison.yourSign')}</Text>
                    <Text style={styles.signName}>{formatZodiacWithArabic(userZodiacKey, language as any)}</Text>
                  </View>
                  <Ionicons name="swap-horizontal" size={22} color={DarkTheme.textTertiary} />
                  <View style={styles.signItem}>
                    <Text style={styles.signLabel}>{t('screens.planetTransit.signComparison.transitSign')}</Text>
                    <Text style={styles.signName}>
                      {transitData.zodiacKey
                        ? formatZodiacWithArabic(transitData.zodiacKey as any, language as any)
                        : t('common.unknown')}
                    </Text>
                  </View>
                </View>

                <View style={styles.challengeBox}>
                  <Text style={styles.challengeText}>
                    {t('screens.planetTransit.balancing.challenge', {
                      userElement: tSafe(`common.elements.${userElement}`, toTitleCase(safeUserElement)).toLowerCase(),
                      transitElement: tSafe(`common.elements.${contextElement}`, toTitleCase(safeContextElement)).toLowerCase(),
                    })}
                  </Text>
                </View>

                <View style={styles.divider}>
                  <Text style={styles.dividerText}>{t('screens.planetTransit.balancing.methodsLabel')}</Text>
                </View>

                {balancingMethods.map((method, index) => (
                  <TouchableOpacity
                    key={`${method.type}-${method.title}-${index}`}
                    style={styles.methodCard}
                    onPress={() => {
                      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                      setExpandedMethod(expandedMethod === index ? null : index);
                    }}
                    activeOpacity={0.8}
                  >
                    <View style={styles.methodHeader}>
                      <View style={styles.methodIconContainer}>
                        <Ionicons name={getMethodIcon(method.type)} size={16} color={accent.primary} />
                      </View>
                      <View style={styles.methodTitleContainer}>
                        <Text style={styles.methodTitle}>{method.title}</Text>
                        <Text style={styles.methodTitleArabic}>{method.titleArabic}</Text>
                      </View>
                      <Ionicons
                        name={expandedMethod === index ? 'chevron-up' : 'chevron-down'}
                        size={18}
                        color={DarkTheme.textTertiary}
                      />
                    </View>

                    {expandedMethod === index ? (
                      <View style={styles.methodContent}>
                        <Text style={styles.instruction}>{method.instruction}</Text>
                        {method.count ? (
                          <View style={styles.countSection}>
                            <View style={styles.countBadge}>
                              <Text style={styles.countNumber}>{method.count}×</Text>
                              <Text style={styles.countLabel}>{t('screens.planetTransit.balancing.repetitions')}</Text>
                            </View>
                            {method.numerology ? (
                              <View style={styles.numerologyNote}>
                                <Ionicons name="information-circle" size={12} color={accent.primary} />
                                <Text style={styles.numerologyText}>{method.numerology}</Text>
                              </View>
                            ) : null}
                          </View>
                        ) : null}
                        {method.bestTime ? (
                          <View style={styles.timingSection}>
                            <Ionicons name="time" size={12} color="#FFD700" />
                            <Text style={styles.timingText}>
                              {t('screens.planetTransit.balancing.bestTime')}: {method.bestTime}
                            </Text>
                          </View>
                        ) : null}
                        {method.count ? (
                          <TouchableOpacity
                            style={[styles.counterButton, { backgroundColor: accent.primary }]}
                            onPress={() => router.push('/dhikr-counter')}
                            activeOpacity={0.8}
                          >
                            <Ionicons name="repeat" size={14} color="#fff" />
                            <Text style={styles.counterButtonText}>
                              {t('screens.planetTransit.balancing.startCounter')}
                            </Text>
                          </TouchableOpacity>
                        ) : null}
                        {method.source ? (
                          <View style={styles.sourceNote}>
                            <Ionicons name="book" size={11} color={DarkTheme.textTertiary} />
                            <Text style={styles.sourceText}>
                              {t('screens.planetTransit.balancing.source')}: {method.source}
                            </Text>
                          </View>
                        ) : null}
                      </View>
                    ) : null}
                  </TouchableOpacity>
                ))}

                <View style={styles.balancingDisclaimer}>
                  <Ionicons name="information-circle-outline" size={12} color={DarkTheme.textTertiary} />
                  <Text style={styles.balancingDisclaimerText}>{t('screens.planetTransit.balancing.disclaimer')}</Text>
                </View>

                {/* ─────────────────────────────────────────────────────────────────
                    COMPREHENSIVE PLANET-SPECIFIC PRACTICES
                    Divine Names, Essences, Talismans, Angels, Timing, Preparation
                ───────────────────────────────────────────────────────────────── */}
                {(() => {
                  const planetPractices = getPlanetPractices(transitData.planetKey);
                  if (!planetPractices) return null;

                  const practicesPlanetKey = (transitData.planetKey ?? '').toLowerCase();

                  const [expandedPractice, setExpandedPractice] = React.useState<string | null>(null);
                  const [expandedEssences, setExpandedEssences] = React.useState(false);
                  const [expandedTalisman, setExpandedTalisman] = React.useState(false);
                  const [expandedAngels, setExpandedAngels] = React.useState(false);
                  const [expandedTiming, setExpandedTiming] = React.useState(false);
                  const [expandedPreparation, setExpandedPreparation] = React.useState(false);

                  return (
                    <>
                      <View style={styles.divider}>
                        <Text style={styles.dividerText}>
                          {t('screens.planetTransit.practices.title')}
                        </Text>
                      </View>

                      {/* Divine Names Section */}
                      <View style={styles.practicesSection}>
                        <View style={styles.practicesSectionHeader}>
                          <Ionicons name="star" size={16} color="#FFD700" />
                          <Text style={styles.practicesSectionTitle}>
                            {t('screens.planetTransit.practices.divineNames.title')}
                          </Text>
                        </View>
                        <Text style={styles.practicesSectionDesc}>
                          {t('screens.planetTransit.practices.divineNames.description', {
                            planet: language === 'ar' ? planetPractices.planetAr : planetPractices.planet,
                          })}
                        </Text>

                        {planetPractices.divineNames.map((divineName) => (
                          <TouchableOpacity
                            key={divineName.id}
                            style={styles.practiceCard}
                            onPress={() => {
                              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                              setExpandedPractice(expandedPractice === divineName.id ? null : divineName.id);
                            }}
                            activeOpacity={0.8}
                          >
                            <View style={styles.practiceCardHeader}>
                              <Text style={styles.practiceIcon}>{divineName.icon}</Text>
                              <View style={styles.practiceCardTitles}>
                                {(() => {
                                  const localizedCategory = tSafe(
                                    `screens.planetTransit.practices.divineNames.categories.${divineName.category.toLowerCase()}`,
                                    divineName.category
                                  );
                                  return (
                                    <Text style={styles.practiceCardCategory}>
                                      {t('screens.planetTransit.practices.divineNames.forCategory', { category: localizedCategory })}
                                    </Text>
                                  );
                                })()}
                                <Text style={styles.practiceCardNameAr}>{divineName.nameAr}</Text>
                                <Text style={styles.practiceCardName}>{divineName.transliteration}</Text>
                              </View>
                              <View style={[
                                styles.practiceDifficultyBadge,
                                divineName.difficulty === 'beginner' && { backgroundColor: 'rgba(76, 175, 80, 0.2)' },
                                divineName.difficulty === 'intermediate' && { backgroundColor: 'rgba(255, 193, 7, 0.2)' },
                                divineName.difficulty === 'advanced' && { backgroundColor: 'rgba(156, 39, 176, 0.2)' },
                              ]}>
                                <Text style={[
                                  styles.practiceDifficultyText,
                                  divineName.difficulty === 'beginner' && { color: '#4CAF50' },
                                  divineName.difficulty === 'intermediate' && { color: '#FFC107' },
                                  divineName.difficulty === 'advanced' && { color: '#9C27B0' },
                                ]}>
                                  ⭐{divineName.difficulty === 'beginner' ? '' : divineName.difficulty === 'intermediate' ? '⭐' : '⭐⭐'}
                                </Text>
                              </View>
                            </View>

                            {expandedPractice === divineName.id && (
                              <View style={styles.practiceCardContent}>
                                <View style={styles.practiceCountRow}>
                                  <Ionicons name="repeat" size={16} color={accent.primary} />
                                  <Text style={styles.practiceCountLabel}>
                                    {t('screens.planetTransit.practices.divineNames.repetitionsLabel')}
                                  </Text>
                                  <Text style={styles.practiceCountValue}>{divineName.count}×</Text>
                                </View>

                                <View style={styles.practicePurposeBox}>
                                  <Text style={styles.practicePurposeLabel}>
                                    {t('screens.planetTransit.practices.divineNames.purposeLabel')}
                                  </Text>
                                  <Text style={styles.practicePurposeText}>
                                    {language === 'ar'
                                      ? divineName.purposeAr
                                      : tSafe(
                                          `screens.planetTransit.practices.divineNames.purposes.${practicesPlanetKey}.${divineName.id}`,
                                          divineName.purpose
                                        )}
                                  </Text>
                                </View>

                                {/* Duration Estimate */}
                                <View style={styles.practiceDurationRow}>
                                  <Ionicons name="time-outline" size={14} color={DarkTheme.textTertiary} />
                                  <Text style={styles.practiceDurationText}>
                                    {t('screens.planetTransit.practices.divineNames.durationLabel')} ~{Math.ceil(divineName.count / 30)} {t('screens.planetTransit.practices.minutesShort')}
                                  </Text>
                                </View>

                                {/* How to Practice */}
                                <View style={styles.practiceHowToBox}>
                                  <Text style={styles.practiceHowToLabel}>
                                    {t('screens.planetTransit.practices.divineNames.howTo.label')}
                                  </Text>
                                  <View style={styles.practiceHowToStep}>
                                    <Text style={styles.practiceHowToBullet}>1.</Text>
                                    <Text style={styles.practiceHowToText}>
                                      {t('screens.planetTransit.practices.divineNames.howTo.step1')}
                                    </Text>
                                  </View>
                                  <View style={styles.practiceHowToStep}>
                                    <Text style={styles.practiceHowToBullet}>2.</Text>
                                    <Text style={styles.practiceHowToText}>
                                      {t('screens.planetTransit.practices.divineNames.howTo.step2')}
                                    </Text>
                                  </View>
                                  <View style={styles.practiceHowToStep}>
                                    <Text style={styles.practiceHowToBullet}>3.</Text>
                                    <Text style={styles.practiceHowToText}>
                                      {t('screens.planetTransit.practices.divineNames.howTo.step3', { category: divineName.category })}
                                    </Text>
                                  </View>
                                  <View style={styles.practiceHowToStep}>
                                    <Text style={styles.practiceHowToBullet}>4.</Text>
                                    <Text style={styles.practiceHowToText}>
                                      {t('screens.planetTransit.practices.divineNames.howTo.step4')}
                                    </Text>
                                  </View>
                                  <View style={styles.practiceHowToStep}>
                                    <Text style={styles.practiceHowToBullet}>5.</Text>
                                    <Text style={styles.practiceHowToText}>
                                      {t('screens.planetTransit.practices.divineNames.howTo.step5')}
                                    </Text>
                                  </View>
                                </View>

                                {/* Action Buttons */}
                                <View style={styles.practiceActionsRow}>
                                  <TouchableOpacity
                                    style={[styles.practiceActionButton, styles.practiceActionButtonPrimary, { backgroundColor: accent.primary }]}
                                    onPress={() => router.push('/dhikr-counter')}
                                    activeOpacity={0.8}
                                  >
                                    <Ionicons name="play-circle" size={16} color="#fff" />
                                    <Text style={styles.practiceActionButtonText}>
                                      {t('screens.planetTransit.practices.divineNames.actions.startPractice')}
                                    </Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    style={[styles.practiceActionButton, styles.practiceActionButtonSecondary]}
                                    activeOpacity={0.8}
                                  >
                                    <Ionicons name="notifications-outline" size={16} color={accent.primary} />
                                    <Text style={[styles.practiceActionButtonTextSecondary, { color: accent.primary }]}>
                                      {t('screens.planetTransit.practices.divineNames.actions.setReminder')}
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              </View>
                            )}
                          </TouchableOpacity>
                        ))}
                      </View>

                      {/* Essences Section */}
                      <View style={styles.practicesSection}>
                        <TouchableOpacity
                          style={styles.practicesSectionHeaderExpandable}
                          onPress={() => {
                            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                            setExpandedEssences(!expandedEssences);
                          }}
                          activeOpacity={0.7}
                        >
                          <View style={styles.practicesSectionHeaderLeft}>
                            <Ionicons name="rose" size={16} color="#F48FB1" />
                            <Text style={styles.practicesSectionTitle}>
                              {language === 'ar' ? 'العطور الموصى بها' : language === 'fr' ? 'Essences Recommandées' : 'Recommended Essences'}
                            </Text>
                          </View>
                          <Ionicons 
                            name={expandedEssences ? 'chevron-up' : 'chevron-down'} 
                            size={18} 
                            color={DarkTheme.textTertiary} 
                          />
                        </TouchableOpacity>

                        {expandedEssences && (
                          <>
                            <Text style={styles.practicesSectionDesc}>
                              {language === 'ar' 
                                ? `استخدم هذه العطور لتعزيز ممارساتك مع ${planetPractices.planetAr}`
                                : language === 'fr'
                                ? `Utiliser ces parfums pour améliorer vos pratiques ${planetPractices.planet}`
                                : `Use these fragrances to enhance your ${planetPractices.planet} practices`}
                            </Text>

                            <View style={styles.essencesGrid}>
                              {planetPractices.essences.map((essence, index) => (
                                <View key={index} style={styles.essenceCard}>
                                  <Text style={styles.essenceIcon}>{essence.icon}</Text>
                                  <Text style={styles.essenceName}>{essence.name}</Text>
                                  <Text style={styles.essenceNameAr}>{essence.nameAr}</Text>
                                  <Text style={styles.essencePurpose}>{essence.purpose}</Text>
                                </View>
                              ))}
                            </View>

                            <View style={styles.essenceHowToBox}>
                              <Text style={styles.essenceHowToLabel}>
                                {language === 'ar' ? '💡 كيفية الاستخدام:' : language === 'fr' ? '💡 Comment Utiliser:' : '💡 How to Use:'}
                              </Text>
                              <View style={styles.essenceHowToItem}>
                                <Text style={styles.essenceHowToBullet}>•</Text>
                                <Text style={styles.essenceHowToText}>
                                  {language === 'ar' ? 'احرقها كبخور قبل الممارسة' : language === 'fr' ? 'Brûler comme encens avant la pratique' : 'Burn as incense before practice'}
                                </Text>
                              </View>
                              <View style={styles.essenceHowToItem}>
                                <Text style={styles.essenceHowToBullet}>•</Text>
                                <Text style={styles.essenceHowToText}>
                                  {language === 'ar' ? 'ضعها كعطر طبيعي' : language === 'fr' ? 'Appliquer comme parfum naturel' : 'Apply as natural perfume'}
                                </Text>
                              </View>
                              <View style={styles.essenceHowToItem}>
                                <Text style={styles.essenceHowToBullet}>•</Text>
                                <Text style={styles.essenceHowToText}>
                                  {language === 'ar' ? 'احتفظ بها في مكان الممارسة' : language === 'fr' ? 'Garder dans l\'espace de pratique' : 'Keep in practice space'}
                                </Text>
                              </View>
                            </View>
                          </>
                        )}
                      </View>

                      {/* Talisman Section */}
                      <View style={styles.practicesSection}>
                        <TouchableOpacity
                          style={styles.practicesSectionHeaderExpandable}
                          onPress={() => {
                            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                            setExpandedTalisman(!expandedTalisman);
                          }}
                          activeOpacity={0.7}
                        >
                          <View style={styles.practicesSectionHeaderLeft}>
                            <Ionicons name="shield-checkmark" size={16} color="#9C27B0" />
                            <Text style={styles.practicesSectionTitle}>
                              {language === 'ar' ? 'إرشادات التعويذة (اختياري)' : language === 'fr' ? 'Orientation Talisman (Optionnel)' : 'Talisman Guidance (Optional)'}
                            </Text>
                          </View>
                          <Ionicons 
                            name={expandedTalisman ? 'chevron-up' : 'chevron-down'} 
                            size={18} 
                            color={DarkTheme.textTertiary} 
                          />
                        </TouchableOpacity>

                        {expandedTalisman && (
                          <>
                            <Text style={styles.practicesSectionDesc}>
                              {language === 'ar' 
                                ? 'للممارسين المتقدمين الذين يعملون مع الأدوات الروحية المكتوبة:'
                                : language === 'fr'
                                ? 'Pour les praticiens avancés travaillant avec des outils spirituels écrits:'
                                : 'For advanced practitioners working with written spiritual tools:'}
                            </Text>

                            <View style={styles.talismanInfoBox}>
                              <View style={styles.talismanInfoRow}>
                                <Text style={styles.talismanInfoLabel}>
                                  {language === 'ar' ? 'التنسيق:' : language === 'fr' ? 'Format:' : 'Format:'}
                                </Text>
                                <Text style={styles.talismanInfoValue}>
                                  {language === 'ar' ? planetPractices.talisman.formatAr : planetPractices.talisman.format}
                                </Text>
                              </View>
                              <Text style={styles.talismanInfoDesc}>
                                {language === 'ar' ? planetPractices.talisman.descriptionAr : planetPractices.talisman.description}
                              </Text>

                              <View style={styles.talismanTimingBox}>
                                <Text style={styles.talismanTimingLabel}>
                                  {language === 'ar' ? '🗓️ أفضل يوم:' : language === 'fr' ? '🗓️ Meilleur Jour:' : '🗓️ Best Day:'}
                                </Text>
                                <Text style={styles.talismanTimingValue}>
                                  {language === 'ar' ? planetPractices.talisman.bestDayAr : planetPractices.talisman.bestDay}
                                </Text>
                              </View>

                              <View style={styles.talismanTimingBox}>
                                <Text style={styles.talismanTimingLabel}>
                                  {language === 'ar' ? '⏰ أفضل ساعة:' : language === 'fr' ? '⏰ Meilleure Heure:' : '⏰ Best Hour:'}
                                </Text>
                                <Text style={styles.talismanTimingValue}>
                                  {language === 'ar' ? planetPractices.talisman.bestHourAr : planetPractices.talisman.bestHour}
                                </Text>
                              </View>
                            </View>

                            <View style={styles.talismanWarningBox}>
                              <Ionicons name="warning" size={16} color="#FF9800" />
                              <Text style={styles.talismanWarningText}>
                                {language === 'ar' 
                                  ? 'تتطلب صناعة التعويذات المعرفة الصحيحة والإذن. استشر معلمًا مؤهلاً (شيخ) قبل المحاولة.'
                                  : language === 'fr'
                                  ? 'La création de talismans nécessite des connaissances et une autorisation appropriées. Consultez un enseignant qualifié avant de tenter.'
                                  : 'Talisman creation requires proper knowledge and authorization. Consult a qualified teacher (shaykh) before attempting.'}
                              </Text>
                            </View>
                          </>
                        )}
                      </View>

                      {/* Timing Section */}
                      <View style={styles.practicesSection}>
                        <TouchableOpacity
                          style={styles.practicesSectionHeaderExpandable}
                          onPress={() => {
                            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                            setExpandedTiming(!expandedTiming);
                          }}
                          activeOpacity={0.7}
                        >
                          <View style={styles.practicesSectionHeaderLeft}>
                            <Ionicons name="time" size={16} color="#FFD700" />
                            <Text style={styles.practicesSectionTitle}>
                              {language === 'ar' ? 'الوقت الأمثل' : language === 'fr' ? 'Timing Optimal' : 'Optimal Timing'}
                            </Text>
                          </View>
                          <Ionicons 
                            name={expandedTiming ? 'chevron-up' : 'chevron-down'} 
                            size={18} 
                            color={DarkTheme.textTertiary} 
                          />
                        </TouchableOpacity>

                        {expandedTiming && (
                          <>
                            <Text style={styles.practicesSectionDesc}>
                              {language === 'ar' 
                                ? `أفضل الأوقات لممارسات ${planetPractices.planetAr}:`
                                : language === 'fr'
                                ? `Meilleurs moments pour les pratiques ${planetPractices.planet}:`
                                : `Best times for ${planetPractices.planet} practices:`}
                            </Text>

                            <View style={styles.timingList}>
                              {(language === 'ar' ? planetPractices.timing.bestAr : planetPractices.timing.best).map((timing, index) => (
                                <View key={index} style={styles.timingItem}>
                                  <View style={styles.timingBullet}>
                                    <Ionicons name="time-outline" size={14} color={accent.primary} />
                                  </View>
                                  <Text style={styles.practiceTimingText}>{timing}</Text>
                                </View>
                              ))}
                            </View>
                          </>
                        )}
                      </View>

                      {/* Preparation Section */}
                      <View style={styles.practicesSection}>
                        <TouchableOpacity
                          style={styles.practicesSectionHeaderExpandable}
                          onPress={() => {
                            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                            setExpandedPreparation(!expandedPreparation);
                          }}
                          activeOpacity={0.7}
                        >
                          <View style={styles.practicesSectionHeaderLeft}>
                            <Ionicons name="list" size={16} color="#2196F3" />
                            <Text style={styles.practicesSectionTitle}>
                              {language === 'ar' ? 'خطوات التحضير' : language === 'fr' ? 'Étapes de Préparation' : 'Preparation Steps'}
                            </Text>
                          </View>
                          <Ionicons 
                            name={expandedPreparation ? 'chevron-up' : 'chevron-down'} 
                            size={18} 
                            color={DarkTheme.textTertiary} 
                          />
                        </TouchableOpacity>

                        {expandedPreparation && (
                          <>
                            <Text style={styles.practicesSectionDesc}>
                              {language === 'ar' 
                                ? 'اتبع هذه الخطوات للتحضير لممارستك:'
                                : language === 'fr'
                                ? 'Suivez ces étapes pour préparer votre pratique:'
                                : 'Follow these steps to prepare for your practice:'}
                            </Text>

                            <View style={styles.preparationList}>
                              {(language === 'ar' ? planetPractices.preparation.stepsAr : planetPractices.preparation.steps).map((step, index) => (
                                <View key={index} style={styles.preparationItem}>
                                  <View style={styles.preparationNumber}>
                                    <Text style={styles.preparationNumberText}>{index + 1}</Text>
                                  </View>
                                  <Text style={styles.preparationText}>{step}</Text>
                                </View>
                              ))}
                            </View>
                          </>
                        )}
                      </View>

                      {/* Advanced: Angels Section */}
                      {planetPractices.angels.length > 0 && (
                        <View style={styles.practicesSection}>
                          <TouchableOpacity
                            style={styles.practicesSectionHeaderExpandable}
                            onPress={() => {
                              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                              setExpandedAngels(!expandedAngels);
                            }}
                            activeOpacity={0.7}
                          >
                            <View style={styles.practicesSectionHeaderLeft}>
                              <Ionicons name="planet" size={16} color="#9C27B0" />
                              <Text style={styles.practicesSectionTitle}>
                                {language === 'ar' ? '👼 متقدم: الاتصال الروحاني' : language === 'fr' ? '👼 Avancé: Connexion Angélique' : '👼 Advanced: Angelic Connection'}
                              </Text>
                            </View>
                            <Ionicons 
                              name={expandedAngels ? 'chevron-up' : 'chevron-down'} 
                              size={18} 
                              color={DarkTheme.textTertiary} 
                            />
                          </TouchableOpacity>

                          {expandedAngels && (
                            <>
                              <View style={styles.advancedWarningBox}>
                                <Ionicons name="alert-circle" size={16} color="#FF6B35" />
                                <Text style={styles.advancedWarningText}>
                                  {language === 'ar' 
                                    ? 'للممارسين ذوي الخبرة فقط'
                                    : language === 'fr'
                                    ? 'Pour praticiens expérimentés uniquement'
                                    : 'For experienced practitioners only'}
                                </Text>
                              </View>

                              <Text style={styles.practicesSectionDesc}>
                                {language === 'ar' 
                                  ? 'العمل مع الوسطاء الروحانيين:'
                                  : language === 'fr'
                                  ? 'Travailler avec des intermédiaires spirituels:'
                                  : 'Working with spiritual intermediaries:'}
                              </Text>

                              {planetPractices.angels.map((angel, index) => (
                                <View key={index} style={styles.angelCard}>
                                  <Text style={styles.angelName}>{angel.name}</Text>
                                  <Text style={styles.angelNameAr}>{angel.nameAr}</Text>
                                  <Text style={styles.angelRole}>
                                    {language === 'ar' ? angel.roleAr : angel.role}
                                  </Text>
                                </View>
                              ))}

                              <View style={styles.angelPrerequisitesBox}>
                                <Text style={styles.angelPrerequisitesLabel}>
                                  {language === 'ar' ? '📚 المتطلبات الأساسية:' : language === 'fr' ? '📚 Prérequis:' : '📚 Prerequisites:'}
                                </Text>
                                <View style={styles.angelPrerequisiteItem}>
                                  <Text style={styles.angelPrerequisiteBullet}>•</Text>
                                  <Text style={styles.angelPrerequisiteText}>
                                    {language === 'ar' ? 'الدراسة تحت معلم مؤهل' : language === 'fr' ? 'Étude sous un enseignant qualifié' : 'Study under qualified teacher'}
                                  </Text>
                                </View>
                                <View style={styles.angelPrerequisiteItem}>
                                  <Text style={styles.angelPrerequisiteBullet}>•</Text>
                                  <Text style={styles.angelPrerequisiteText}>
                                    {language === 'ar' ? 'إتقان الممارسات الأساسية' : language === 'fr' ? 'Maîtrise des pratiques de base' : 'Mastery of basic practices'}
                                  </Text>
                                </View>
                                <View style={styles.angelPrerequisiteItem}>
                                  <Text style={styles.angelPrerequisiteBullet}>•</Text>
                                  <Text style={styles.angelPrerequisiteText}>
                                    {language === 'ar' ? 'فهم الحماية الروحية' : language === 'fr' ? 'Compréhension de la protection spirituelle' : 'Understanding of spiritual protection'}
                                  </Text>
                                </View>
                                <View style={styles.angelPrerequisiteItem}>
                                  <Text style={styles.angelPrerequisiteBullet}>•</Text>
                                  <Text style={styles.angelPrerequisiteText}>
                                    {language === 'ar' ? 'إذن من الشيخ' : language === 'fr' ? 'Permission du shaykh' : 'Permission from shaykh'}
                                  </Text>
                                </View>
                              </View>
                            </>
                          )}
                        </View>
                      )}
                    </>
                  );
                })()}
              </GlassCard>
            ) : null}

            {/* ─────────────────────────────────────────────────────────────────
                SPIRITUAL PRACTICE CARD (Enhanced with Dhikr Tiers + Planetary Hour Timing)
                Based on ʿIlm al-Asrār: Entry (0-10°), Strength (10-20°), Exit (20-30°)
            ───────────────────────────────────────────────────────────────── */}
            {detailsType === 'transit' && spiritualGuidance && transitData ? (
              <GlassCard style={styles.spiritualCard}>
                <View style={styles.cardHeader}>
                  <Ionicons name="sparkles" size={18} color="#FFD700" />
                  <Text style={styles.cardTitle}>
                    {tSafe('screens.planetTransit.practice.title', 'Spiritual Practice')}
                  </Text>
                </View>
                
                {/* Phase Badge with Strength Indicator */}
                <View style={[
                  styles.spiritualPhaseBadge,
                  spiritualGuidance.phase === 'entry' && { backgroundColor: 'rgba(255, 193, 7, 0.15)', borderColor: 'rgba(255, 193, 7, 0.4)' },
                  spiritualGuidance.phase === 'strength' && { backgroundColor: 'rgba(76, 175, 80, 0.15)', borderColor: 'rgba(76, 175, 80, 0.4)' },
                  spiritualGuidance.phase === 'exit' && { backgroundColor: 'rgba(156, 39, 176, 0.15)', borderColor: 'rgba(156, 39, 176, 0.4)' },
                ]}>
                  <View style={styles.spiritualPhaseRow}>
                    <Ionicons 
                      name={spiritualGuidance.phase === 'entry' ? 'enter-outline' : spiritualGuidance.phase === 'strength' ? 'flash' : 'exit-outline'} 
                      size={16} 
                      color={spiritualGuidance.phase === 'entry' ? '#FFC107' : spiritualGuidance.phase === 'strength' ? '#4CAF50' : '#9C27B0'} 
                    />
                    <Text style={[
                      styles.spiritualPhaseLabel,
                      spiritualGuidance.phase === 'entry' && { color: '#FFC107' },
                      spiritualGuidance.phase === 'strength' && { color: '#4CAF50' },
                      spiritualGuidance.phase === 'exit' && { color: '#9C27B0' },
                    ]}>
                      {tSafe(`screens.planetTransit.practice.phase.${spiritualGuidance.phase}`, spiritualGuidance.phaseLabel)}
                    </Text>
                    <Text style={styles.spiritualPhaseArabic}>{spiritualGuidance.phaseArabic}</Text>
                    <Text style={styles.spiritualDegreeBadge}>
                      {transitData && isLegacyTransit(transitData) ? `${Math.floor(transitData.signDegree ?? 0)}°` : '—'}
                    </Text>
                  </View>
                </View>

                {/* Status Text */}
                <Text style={styles.spiritualStatusText}>{spiritualGuidance.statusText}</Text>
                
                {/* Transit Strength Indicator - Shows actual dignity-based strength */}
                <View style={styles.transitStrengthRow}>
                  <Text style={styles.transitStrengthLabel}>
                    {tSafe('screens.planetTransit.practice.transitStrength', 'Transit Strength')}:
                  </Text>
                  <Text style={[
                    styles.transitStrengthValue,
                    spiritualGuidance.transitStrengthLabel === 'strong' && { color: '#4CAF50' },
                    spiritualGuidance.transitStrengthLabel === 'moderate' && { color: '#FFC107' },
                    spiritualGuidance.transitStrengthLabel === 'weak' && { color: '#F87171' },
                  ]}>
                    {spiritualGuidance.transitStrengthPercent}%
                  </Text>
                  <View style={[
                    styles.transitStrengthPill,
                    spiritualGuidance.transitStrengthLabel === 'strong' && { borderColor: '#4CAF50', backgroundColor: 'rgba(76, 175, 80, 0.15)' },
                    spiritualGuidance.transitStrengthLabel === 'moderate' && { borderColor: '#FFC107', backgroundColor: 'rgba(255, 193, 7, 0.15)' },
                    spiritualGuidance.transitStrengthLabel === 'weak' && { borderColor: '#F87171', backgroundColor: 'rgba(248, 113, 113, 0.15)' },
                  ]}>
                    <Text style={[
                      styles.transitStrengthPillText,
                      spiritualGuidance.transitStrengthLabel === 'strong' && { color: '#4CAF50' },
                      spiritualGuidance.transitStrengthLabel === 'moderate' && { color: '#FFC107' },
                      spiritualGuidance.transitStrengthLabel === 'weak' && { color: '#F87171' },
                    ]}>
                      {tSafe(`screens.planetTransit.practice.strength.${spiritualGuidance.transitStrengthLabel}`, 
                        spiritualGuidance.transitStrengthLabel.charAt(0).toUpperCase() + spiritualGuidance.transitStrengthLabel.slice(1)
                      )}
                    </Text>
                  </View>
                </View>
                
                {/* Guidance Text */}
                <View style={styles.spiritualGuidanceBox}>
                  <Text style={styles.spiritualGuidanceText}>{spiritualGuidance.guidanceText}</Text>
                </View>
                
                {/* ─────── RECOMMENDED COUNT (Tier Selector) ─────── */}
                <View style={styles.practiceSection}>
                  <View style={styles.practiceSectionHeader}>
                    <Ionicons name="options" size={14} color="#FFD700" />
                    <Text style={styles.practiceSectionTitle}>
                      {tSafe('screens.planetTransit.practice.counts.title', 'Recommended Count')}
                    </Text>
                  </View>
                  
                  {/* Tier Selector Pills */}
                  <View style={styles.tierSelector}>
                    {(['quick', 'standard', 'deep'] as DhikrTier[]).map((tier) => {
                      const tierConfig = spiritualGuidance.dhikrTiers[tier];
                      const isSelected = selectedTier === tier;
                      const isRecommended = spiritualGuidance.recommendedTier === tier;
                      return (
                        <TouchableOpacity
                          key={tier}
                          style={[
                            styles.tierPill,
                            isSelected && styles.tierPillSelected,
                            isRecommended && !isSelected && styles.tierPillRecommended,
                          ]}
                          onPress={() => setSelectedTier(tier)}
                          activeOpacity={0.7}
                        >
                          <Text style={[
                            styles.tierPillLabel,
                            isSelected && styles.tierPillLabelSelected,
                          ]}>
                            {tSafe(`screens.planetTransit.practice.counts.tier.${tier}`, tier.charAt(0).toUpperCase() + tier.slice(1))}
                          </Text>
                          {isRecommended && (
                            <View style={styles.tierRecommendedDot} />
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                  
                  {/* Selected Tier Details */}
                  <View style={styles.tierDetails}>
                    <View style={styles.tierCountRow}>
                      <Text style={styles.tierCountLabel}>{spiritualGuidance.dhikrName}</Text>
                      <Text style={styles.tierCountArabic}>{spiritualGuidance.dhikrArabic}</Text>
                    </View>
                    <View style={styles.tierCountBadges}>
                      {spiritualGuidance.dhikrTiers[selectedTier].counts.map((count, idx) => (
                        <View 
                          key={count} 
                          style={[
                            styles.tierCountBadge,
                            count === spiritualGuidance.dhikrTiers[selectedTier].defaultCount && styles.tierCountBadgeDefault,
                          ]}
                        >
                          <Text style={[
                            styles.tierCountValue,
                            count === spiritualGuidance.dhikrTiers[selectedTier].defaultCount && styles.tierCountValueDefault,
                          ]}>
                            {count}×
                          </Text>
                        </View>
                      ))}
                    </View>
                    <Text style={styles.tierEstimate}>
                      {tSafe('screens.planetTransit.practice.counts.estimate', '~{minutes} min').replace('{minutes}', String(spiritualGuidance.dhikrTiers[selectedTier].estimatedMinutes))}
                    </Text>
                  </View>
                </View>
                
                {/* ─────── BEST TIME (Planetary Hour Window) ─────── */}
                <View style={styles.practiceSection}>
                  <View style={styles.practiceSectionHeader}>
                    <Ionicons name="time" size={14} color="#FFD700" />
                    <Text style={styles.practiceSectionTitle}>
                      {tSafe('screens.planetTransit.practice.timing.title', 'Best Time')}
                    </Text>
                    {/* Strength Badge */}
                    <View style={[
                      styles.strengthBadge,
                      spiritualGuidance.timingStrength === 'peak' && styles.strengthBadgePeak,
                      spiritualGuidance.timingStrength === 'strong' && styles.strengthBadgeStrong,
                      spiritualGuidance.timingStrength === 'supportive' && styles.strengthBadgeSupportive,
                      spiritualGuidance.timingStrength === 'gentle' && styles.strengthBadgeGentle,
                    ]}>
                      <Text style={[
                        styles.strengthBadgeText,
                        spiritualGuidance.timingStrength === 'peak' && styles.strengthBadgeTextPeak,
                        spiritualGuidance.timingStrength === 'strong' && styles.strengthBadgeTextStrong,
                        spiritualGuidance.timingStrength === 'supportive' && styles.strengthBadgeTextSupportive,
                        spiritualGuidance.timingStrength === 'gentle' && styles.strengthBadgeTextGentle,
                      ]}>
                        {tSafe(`screens.planetTransit.practice.strength.${spiritualGuidance.timingStrength}`, spiritualGuidance.timingStrength)}
                      </Text>
                    </View>
                  </View>
                  
                  {spiritualGuidance.nextPlanetHour ? (
                    <View style={styles.planetHourWindow}>
                      {spiritualGuidance.isInMatchingHour ? (
                        <View style={styles.planetHourActive}>
                          <Ionicons name="radio-button-on" size={16} color="#4CAF50" />
                          <Text style={styles.planetHourActiveText}>
                            {tSafe('screens.planetTransit.practice.timing.activeNow', 'Active now until {end}')
                              .replace('{end}', spiritualGuidance.nextPlanetHour.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))}
                          </Text>
                        </View>
                      ) : (
                        <View style={styles.planetHourNext}>
                          <Text style={styles.planetHourNextLabel}>
                            {tSafe('screens.planetTransit.practice.timing.nextPlanetHour', 'Next {planet} hour: {start}–{end}')
                              .replace('{planet}', transitData?.planetKey ?? 'Planet')
                              .replace('{start}', spiritualGuidance.nextPlanetHour.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
                              .replace('{end}', spiritualGuidance.nextPlanetHour.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))}
                          </Text>
                          <Text style={styles.planetHourCountdown}>
                            {spiritualGuidance.nextPlanetHour.isToday 
                              ? tSafe('screens.planetTransit.practice.timing.in', 'in {time}')
                                  .replace('{time}', spiritualGuidance.nextPlanetHour.minutesUntil < 60 
                                    ? `${spiritualGuidance.nextPlanetHour.minutesUntil} min`
                                    : `${Math.floor(spiritualGuidance.nextPlanetHour.minutesUntil / 60)}h ${spiritualGuidance.nextPlanetHour.minutesUntil % 60}m`)
                              : tSafe('screens.planetTransit.practice.timing.tomorrow', 'Tomorrow')}
                          </Text>
                        </View>
                      )}
                    </View>
                  ) : (
                    <Text style={styles.planetHourUnavailable}>
                      {tSafe('screens.planetTransit.practice.timing.unavailable', 'Planetary hour data unavailable')}
                    </Text>
                  )}
                  
                  {/* Fallback Guidance */}
                  <View style={styles.fallbackGuidance}>
                    <Text style={styles.fallbackTitle}>
                      {tSafe('screens.planetTransit.practice.fallback.title', "If you can't wait")}
                    </Text>
                    <Text style={styles.fallbackText}>
                      {tSafe('screens.planetTransit.practice.fallback.afterPrayer', 'Do the Quick tier after the next prayer.')}
                    </Text>
                  </View>
                </View>
                
                {/* Avoid Warning (only shown during Strength phase) */}
                {spiritualGuidance.avoidText && spiritualGuidance.phase === 'strength' && (
                  <View style={styles.spiritualAvoidBox}>
                    <View style={styles.spiritualAvoidHeader}>
                      <Ionicons name="warning" size={14} color="#FF6B35" />
                      <Text style={styles.spiritualAvoidLabel}>
                        {tSafe('screens.planetTransit.spiritual.avoid', 'Avoid')}
                      </Text>
                    </View>
                    <Text style={styles.spiritualAvoidText}>{spiritualGuidance.avoidText}</Text>
                  </View>
                )}
                
                {/* Disclaimer */}
                <View style={styles.spiritualDisclaimer}>
                  <Ionicons name="information-circle-outline" size={12} color={DarkTheme.textTertiary} />
                  <Text style={styles.spiritualDisclaimerText}>
                    {tSafe('screens.planetTransit.practice.disclaimer', 'For reflection, not ruling. Based on classical Islamic esoteric tradition.')}
                  </Text>
                </View>
              </GlassCard>
            ) : null}

            {detailsType === 'transit' && adjacent && historyDates ? (
              <GlassCard style={styles.historyCard}>
                <View style={styles.cardHeader}>
                  <Ionicons name="time" size={18} color={accent.primary} />
                  <Text style={styles.cardTitle}>{t('screens.planetTransit.history.title')}</Text>
                </View>
                <View style={styles.historyTimeline}>
                  <View style={styles.historyItem}>
                    <View style={[styles.historyDot, styles.historyDotPast]} />
                    <View style={styles.historyLine} />
                    <View style={styles.historyContent}>
                      <Text style={styles.historySign}>
                        {adjacent.prev ? formatZodiacWithArabic(adjacent.prev as any, language as any) : t('common.unknown')}
                      </Text>
                      <Text style={styles.historyDates}>
                        {formatMonthYear(historyDates.prevStart, language)} - {formatMonthYear(historyDates.prevEnd, language)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.historyItemCurrent}>
                    <View style={[styles.historyDot, styles.historyDotCurrent]} />
                    <View style={styles.historyLine} />
                    <View style={styles.historyContent}>
                      <Text style={styles.historySignCurrent}>
                        {transitData.zodiacKey
                          ? formatZodiacWithArabic(transitData.zodiacKey as any, language as any)
                          : t('common.unknown')}
                      </Text>
                      <Text style={styles.historyDatesCurrent}>
                        {formatMonthYear(transitDates.start, language)} - {formatMonthYear(transitDates.end, language)}
                      </Text>
                      <Text style={styles.historyBadge}>{t('screens.planetTransit.history.current')}</Text>
                    </View>
                  </View>
                  <View style={styles.historyItem}>
                    <View style={[styles.historyDot, styles.historyDotFuture]} />
                    <View style={styles.historyContent}>
                      <Text style={styles.historySign}>
                        {adjacent.next ? formatZodiacWithArabic(adjacent.next as any, language as any) : t('common.unknown')}
                      </Text>
                      <Text style={styles.historyDates}>
                        {formatMonthYear(historyDates.nextStart, language)} - {formatMonthYear(historyDates.nextEnd, language)}
                      </Text>
                    </View>
                  </View>
                </View>
                {transitDates.estimated ? (
                  <Text style={styles.historyHint}>{t('screens.planetTransit.history.estimated')}</Text>
                ) : null}
              </GlassCard>
            ) : null}
            </PremiumSection>

            <GlassCard style={styles.dataSourceCard}>
              <View style={styles.cardHeader}>
                <Ionicons name="server" size={18} color={accent.primary} />
                <Text style={styles.cardTitle}>{t('screens.planetTransit.dataSource.title')}</Text>
              </View>
              <Text style={styles.infoValue}>{sourceLabel}</Text>
              <Text style={styles.infoSub}>{t('screens.planetTransit.dataSource.lastUpdated')}</Text>
              <Text style={styles.infoValue}>{updatedAtLabel}</Text>
              {countdownText && (
                <Text style={styles.metaText}>{t('home.planetTransitDetails.nextChange', { countdown: countdownText })}</Text>
              )}
            </GlassCard>
          </>
        ) : detailsType === 'nextDay' && nextDayPayload ? (
          <>
            {/* Next Day Header Card */}
            <GlassCard style={styles.nextDayCard}>
              <View style={styles.cardHeader}>
                <Ionicons name="calendar" size={18} color={accent.primary} />
                <Text style={styles.cardTitle}>{primaryCardTitle}</Text>
              </View>
              <View style={styles.rowCenter}>
                <View style={styles.nextDayOrb}>
                  <Text style={styles.nextDayEmoji}>{nextDayPayload.emoji}</Text>
                </View>
                <View style={styles.namesCol}>
                  <Text style={styles.primaryName}>{nextDayPayload.dayName}</Text>
                  <Text style={styles.secondaryName}>{nextDayPayload.dayNameArabic}</Text>
                </View>
              </View>
              <View style={styles.pillsRow}>
                <View style={[styles.pill, { backgroundColor: accent.glow }]}>
                  <Text style={styles.pillLabel}>{t('home.planetTransitDetails.pills.dayRuler')}</Text>
                  <Text style={[styles.pillValue, { color: accent.primary }]}>{nextDayPayload.planetArabic}</Text>
                </View>
                <View style={[styles.pill, { backgroundColor: accent.glow }]}>
                  <Text style={styles.pillLabel}>{t('home.planetTransitDetails.pills.element')}</Text>
                  <Text style={[styles.pillValue, { color: accent.primary }]}>
                    {tSafe(`common.elements.${nextDayPayload.element}`, toTitleCase(nextDayPayload.element))}
                  </Text>
                </View>
              </View>
            </GlassCard>

            {/* Planet Information Card */}
            <GlassCard style={styles.infoCard}>
              <View style={styles.cardHeader}>
                <Ionicons name="information-circle" size={18} color={accent.primary} />
                <Text style={styles.cardTitle}>
                  {language === 'ar' ? 'عن حاكم اليوم' : language === 'fr' ? 'À Propos du Dirigeant' : 'About the Day Ruler'}
                </Text>
              </View>
              <Text style={styles.bodyText}>
                {language === 'ar' 
                  ? `${nextDayPayload.planetArabic} يحكم ${nextDayPayload.dayNameArabic} ويحمل طاقة عنصر ${tSafe(`common.elements.${nextDayPayload.element}`, toTitleCase(nextDayPayload.element))}.`
                  : language === 'fr'
                  ? `${nextDayPayload.planetArabic} gouverne ${nextDayPayload.dayName} et porte l'énergie de l'élément ${tSafe(`common.elements.${nextDayPayload.element}`, toTitleCase(nextDayPayload.element)).toLowerCase()}.`
                  : `The ${nextDayPayload.dayName} will be ruled by ${nextDayPayload.planetArabic}, carrying the energy of the ${nextDayPayload.element} element.`}
              </Text>
            </GlassCard>

            {/* Element Energy Card */}
            <GlassCard style={styles.infoCard}>
              <View style={styles.cardHeader}>
                <Ionicons name={getElementIconName(nextDayPayload.element)} size={18} color={accent.primary} />
                <Text style={styles.cardTitle}>
                  {language === 'ar' ? 'طاقة العنصر' : language === 'fr' ? 'Énergie Élémentaire' : 'Elemental Energy'}
                </Text>
              </View>
              <View style={styles.elementSection}>
                <View style={[styles.elementBadge, { backgroundColor: accent.glow }]}>
                  <Text style={styles.elementIcon}>{getElementIcon(nextDayPayload.element)}</Text>
                  <Text style={[styles.elementName, { color: accent.primary }]}>
                    {tSafe(`common.elements.${nextDayPayload.element}`, toTitleCase(nextDayPayload.element))}
                  </Text>
                </View>
                <Text style={styles.bodyText}>
                  {getElementDescription(nextDayPayload.element, language)}
                </Text>
              </View>
            </GlassCard>

            {/* Spiritual Focus Card */}
            <GlassCard style={styles.infoCard}>
              <View style={styles.cardHeader}>
                <Ionicons name="sparkles" size={18} color={accent.primary} />
                <Text style={styles.cardTitle}>
                  {language === 'ar' ? 'التركيز الروحي' : language === 'fr' ? 'Focus Spirituel' : 'Spiritual Focus'}
                </Text>
              </View>
              <Text style={styles.bodyText}>
                {getSpiritualFocus(nextDayPayload.element, language)}
              </Text>
            </GlassCard>

            {/* Best Activities Card */}
            <GlassCard style={styles.infoCard}>
              <View style={styles.cardHeader}>
                <Ionicons name="checkmark-circle" size={18} color="#10b981" />
                <Text style={styles.cardTitle}>
                  {language === 'ar' ? 'أفضل الأنشطة' : language === 'fr' ? 'Meilleures Activités' : 'Best Activities'}
                </Text>
              </View>
              <View style={styles.activityList}>
                {getBestActivities(nextDayPayload.element, language).map((activity, index) => (
                  <View key={index} style={styles.activityItem}>
                    <View style={[styles.activityDot, { backgroundColor: '#10b981' }]} />
                    <Text style={styles.activityText}>{activity}</Text>
                  </View>
                ))}
              </View>
            </GlassCard>

            {/* Preparation Card */}
            <GlassCard style={styles.infoCard}>
              <View style={styles.cardHeader}>
                <Ionicons name="bulb" size={18} color={accent.primary} />
                <Text style={styles.cardTitle}>
                  {language === 'ar' ? 'كيف تستعد' : language === 'fr' ? 'Comment se Préparer' : 'How to Prepare'}
                </Text>
              </View>
              <Text style={styles.bodyText}>
                {language === 'ar'
                  ? 'خطط ليومك غداً مع وضع هذه الطاقات في الاعتبار. ضع نواياك في الليلة السابقة وتأمل في كيفية مواءمة أفعالك مع حاكم اليوم.'
                  : language === 'fr'
                  ? 'Planifiez votre journée de demain en tenant compte de ces énergies. Fixez vos intentions la veille au soir et réfléchissez à la façon d\'aligner vos actions avec le dirigeant du jour.'
                  : 'Plan your day tomorrow with these energies in mind. Set your intentions the night before and reflect on how to align your actions with the day ruler.'}
              </Text>
            </GlassCard>
          </>
        ) : (
          <GlassCard style={styles.nextDayCard}>
            <Text style={styles.bodyText}>{t('home.planetTransitDetails.error')}</Text>
          </GlassCard>
        )}

        {/* All Planet Transits Section */}
        {detailsType === 'transit' && allTransitsDisplay && (
          <GlassCard style={styles.allTransitsCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="planet" size={20} color="#9FA9B3" />
              <Text style={styles.cardTitle}>
                {language === 'ar' ? 'جميع عبور الكواكب' : language === 'fr' ? 'Tous les Transits' : 'All Planet Transits'}
              </Text>
            </View>
            <Text style={[styles.bodyText, { marginBottom: Spacing.md }]}>
              {language === 'ar' 
                ? 'موقع جميع الكواكب في البروج حالياً'
                : language === 'fr' 
                ? 'Position actuelle de toutes les planètes dans les signes'
                : 'Current position of all planets in the zodiac signs'}
            </Text>

            {allTransitsStrengthSummary ? (
              <View style={styles.allTransitsSummary}>
                <View style={styles.allTransitsSummaryCol}>
                  <Text style={styles.allTransitsSummaryTitle}>{t('screens.planetTransit.summary.bestNow')}</Text>
                  {allTransitsStrengthSummary.best.map((item) => {
                    const planetName = item.planetKey.charAt(0).toUpperCase() + item.planetKey.slice(1);
                    const color = getStrengthColor(item.finalPower);
                    return (
                      <View key={item.planetKey} style={styles.allTransitsSummaryItem}>
                        <Text style={styles.allTransitsSummaryPlanet} numberOfLines={1}>
                          {language === 'ar' ? tSafe(`planets.${item.planetKey}Arabic`, planetName) : planetName}
                        </Text>
                        <View style={[styles.allTransitsSummaryBadge, { borderColor: `${color}40` }]}>
                          <Text style={[styles.allTransitsSummaryBadgeText, { color }]}>
                            {item.finalPower}%
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
                <View style={styles.allTransitsSummaryCol}>
                  <Text style={styles.allTransitsSummaryTitle}>{t('screens.planetTransit.summary.weakNow')}</Text>
                  {allTransitsStrengthSummary.weak.map((item) => {
                    const planetName = item.planetKey.charAt(0).toUpperCase() + item.planetKey.slice(1);
                    const color = getStrengthColor(item.finalPower);
                    return (
                      <View key={item.planetKey} style={styles.allTransitsSummaryItem}>
                        <Text style={styles.allTransitsSummaryPlanet} numberOfLines={1}>
                          {language === 'ar' ? tSafe(`planets.${item.planetKey}Arabic`, planetName) : planetName}
                        </Text>
                        <View style={[styles.allTransitsSummaryBadge, { borderColor: `${color}40` }]}>
                          <Text style={[styles.allTransitsSummaryBadgeText, { color }]}>
                            {item.finalPower}%
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            ) : null}
            
            <View style={styles.allTransitsGrid}>
              {Object.entries(allTransitsDisplay).map(([planetKey, transitInfo]: [string, PlanetTransit]) => {
                const planetName = planetKey.charAt(0).toUpperCase() + planetKey.slice(1);
                const zodiacData = ZODIAC_DATA[transitInfo.sign as ZodiacKey];
                const planetGrad = getPlanetGradient(planetKey);
                const elementKey = zodiacData?.element || 'earth';
                const elementAcc = ElementAccents[elementKey as Element];
                const isUserSign = transitInfo.sign === userZodiacKey;
                const planetSymbol = PLANET_SYMBOLS[planetKey.toLowerCase()] || '✦';
                
                return (
                  <TouchableOpacity
                    key={planetKey}
                    style={[
                      styles.transitMiniCard,
                      isUserSign && styles.transitMiniCardHighlight,
                      { borderColor: isUserSign ? elementAcc.primary + '50' : 'rgba(255,255,255,0.08)' }
                    ]}
                    onPress={() => {
                      // Scroll to top for better UX when viewing new transit
                      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
                      
                      const legacyFormat = adaptTransitToLegacyFormat(transitInfo);
                      router.push({
                        pathname: '/(tabs)/planet-transit-details',
                        params: {
                          type: 'transit',
                          payload: JSON.stringify(legacyFormat),
                          isPersonal: isUserSign ? 'true' : 'false',
                        },
                      });
                    }}
                  >
                    {isUserSign && (
                      <View style={[styles.yourSignBadge, { backgroundColor: elementAcc.primary + '30' }]}>
                        <Ionicons name="star" size={10} color={elementAcc.primary} />
                        <Text style={[styles.yourSignText, { color: elementAcc.primary }]}>
                          {language === 'ar' ? 'برجك' : language === 'fr' ? 'Ton signe' : 'Your sign'}
                        </Text>
                      </View>
                    )}
                    
                    <LinearGradient
                      colors={planetGrad}
                      style={styles.miniPlanetOrb}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Text style={styles.miniPlanetSymbol}>{planetSymbol}</Text>
                    </LinearGradient>
                    
                    <Text style={styles.miniPlanetName} numberOfLines={1}>
                      {language === 'ar' 
                        ? (tSafe(`planets.${planetKey}Arabic`, planetName))
                        : planetName}
                    </Text>

                    {transitInfo.isRetrograde ? (
                      <Text style={styles.miniRetrograde}>
                        ℞ {language === 'fr' ? 'Rétrograde' : language === 'ar' ? 'تراجع' : 'Retrograde'}
                      </Text>
                    ) : null}
                    
                    <View style={[styles.miniZodiacBadge, { backgroundColor: elementAcc.glow }]}>
                      <Text style={styles.miniZodiacSymbol}>{zodiacData?.symbol || '✦'}</Text>
                      <Text style={[styles.miniZodiacName, { color: elementAcc.primary }]} numberOfLines={1}>
                        {formatZodiacWithArabic(transitInfo.sign as any, language as any)}
                      </Text>
                    </View>
                    
                    {transitInfo.signDegree !== undefined && (
                      <Text style={styles.miniDegree}>
                        {Math.floor(transitInfo.signDegree)}°
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
            
            {loadingAllTransits && (
              <View style={styles.loadingContainer}>
                <Text style={styles.bodyText}>{t('common.loading')}</Text>
              </View>
            )}
          </GlassCard>
        )}

        <View style={styles.disclaimerFooter}>
          <Ionicons name="information-circle" size={14} color={DarkTheme.textMuted} />
          <Text style={styles.disclaimerText}>{t('home.planetTransitDetails.disclaimer')}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DarkTheme.screenBackground,
  },
  headerGradient: {
    paddingBottom: Spacing.md,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screenPadding,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
  },
  buttonBlur: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.18)',
  },
  headerButtonPlaceholder: {
    width: 44,
    height: 44,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: Typography.weightBold,
    color: DarkTheme.textPrimary,
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  headerSubtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  transitTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  transitTypeBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  transitContextBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  transitContextTextContainer: {
    flex: 1,
    gap: 4,
  },
  transitContextTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  transitContextDesc: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
    lineHeight: 18,
  },
  refreshButtonDisabled: {
    opacity: 0.6,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.screenPadding,
    paddingBottom: Spacing.xxxl,
    gap: Spacing.lg,
  },
  glassCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    overflow: 'hidden',
    backgroundColor: Platform.OS === 'android' ? 'rgba(255,255,255,0.08)' : 'transparent',
  },
  glassBlur: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  heroContainer: {
    paddingHorizontal: Spacing.sm,
    paddingTop: Spacing.lg,
  },
  planetCard: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  planetOrbContainer: {
    position: 'relative',
    marginBottom: Spacing.md,
  },
  planetOrbLarge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  planetGlow: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    top: -7,
    left: -7,
    opacity: 0.2,
  },
  planetSymbolLarge: {
    fontSize: 54,
    color: '#fff',
  },
  planetNameHero: {
    fontSize: 30,
    fontWeight: Typography.weightBold,
    color: DarkTheme.textPrimary,
  },
  planetArabicHero: {
    fontSize: 17,
    color: 'rgba(255,255,255,0.7)',
  },

  // Planetary strength strip (percent + quality)
  powerStrip: {
    width: '100%',
    marginTop: Spacing.md,
    gap: 8,
  },
  powerTrack: {
    height: 10,
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 999,
    overflow: 'hidden',
  },
  powerFill: {
    height: '100%',
    borderRadius: 999,
  },
  powerMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  powerMetaLabel: {
    fontSize: 12,
    color: DarkTheme.textTertiary,
    fontWeight: Typography.weightMedium,
  },
  powerMetaValue: {
    fontSize: 13,
    fontWeight: Typography.weightBold,
  },
  powerQualityPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  powerQualityText: {
    fontSize: 11,
    fontWeight: Typography.weightSemibold,
  },
  retrogradePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 107, 53, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 53, 0.25)',
  },
  retrogradePillText: {
    fontSize: 12,
    color: '#FFD1C2',
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  connectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.lg,
    width: '100%',
    paddingHorizontal: Spacing.lg,
  },
  connectorLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  connectorText: {
    fontSize: 13,
    letterSpacing: 2,
    color: 'rgba(255,255,255,0.5)',
    paddingHorizontal: Spacing.md,
    fontWeight: Typography.weightSemibold,
  },
  signCard: {
    width: '100%',
    gap: Spacing.sm,
  },
  zodiacSymbolLarge: {
    fontSize: 28,
    color: DarkTheme.textPrimary,
  },
  signBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  signIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  signTextContainer: {
    flex: 1,
    minWidth: 0,
  },
  signNameHero: {
    fontSize: 24,
    fontWeight: Typography.weightBold,
    color: DarkTheme.textPrimary,
  },
  signArabicHero: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.6)',
  },
  elementTag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    gap: 6,
  },
  elementText: {
    fontSize: 11,
    fontWeight: Typography.weightBold,
    letterSpacing: 1,
  },
  zodiacSystemRow: {
    marginTop: 12,
    width: '100%',
  },
  zodiacSystemLabel: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
    marginBottom: 8,
  },
  zodiacSystemToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },
  zodiacSystemOption: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zodiacSystemOptionActive: {
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  zodiacSystemOptionText: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
    fontWeight: '700',
  },
  zodiacSystemOptionTextActive: {
    color: '#FFFFFF',
  },
  infoStrip: {
    gap: Spacing.xs,
  },
  explainerText: {
    fontSize: 14,
    color: DarkTheme.textSecondary,
    lineHeight: 19,
    fontStyle: 'italic',
  },
  explainerMeta: {
    fontSize: 12,
    color: DarkTheme.textTertiary,
  },
  impactBanner: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    padding: Spacing.sm,
    gap: Spacing.sm,
  },
  impactBlur: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  impactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.md,
  },
  impactIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  impactText: {
    flex: 1,
    gap: 2,
  },
  impactLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    letterSpacing: 1,
  },
  impactValue: {
    fontSize: 18,
    fontWeight: Typography.weightBold,
  },
  impactArabic: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.65)',
  },
  whyToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  whyToggleText: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
  },
  whyPanel: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 10,
    padding: Spacing.sm,
    gap: 4,
  },
  whyTitle: {
    fontSize: 12,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
  },
  focusRow: {
    gap: 6,
  },
  focusTitle: {
    fontSize: 11,
    color: DarkTheme.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  focusPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  focusPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  focusPillText: {
    fontSize: 11,
    color: DarkTheme.textSecondary,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
  },
  expandableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  durationCard: {
    gap: Spacing.md,
  },
  timelineContent: {
    gap: Spacing.md,
  },
  timelineRowWide: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  milestone: {
    width: 90,
    alignItems: 'center',
    gap: 4,
  },
  milestoneMarker: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  milestoneDate: {
    fontSize: 11,
    color: DarkTheme.textSecondary,
    textAlign: 'center',
  },
  milestoneLabel: {
    fontSize: 11,
    color: DarkTheme.textTertiary,
    textAlign: 'center',
  },
  progressContainer: {
    flex: 1,
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
    position: 'relative',
  },
  progressFillWide: {
    height: '100%',
  },
  nowMarker: {
    position: 'absolute',
    top: -22,
    alignItems: 'center',
    gap: 2,
    transform: [{ translateX: -8 }],
  },
  nowMarkerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  nowLabel: {
    fontSize: 10,
    color: DarkTheme.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  nowDate: {
    fontSize: 10,
    color: DarkTheme.textTertiary,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 17,
    fontWeight: Typography.weightBold,
    color: DarkTheme.textPrimary,
  },
  statLabel: {
    fontSize: 11,
    color: DarkTheme.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  infoHint: {
    fontSize: 11,
    color: DarkTheme.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  degreeCard: {
    gap: Spacing.md,
  },
  dignityCard: {
    gap: Spacing.md,
  },
  dignityContent: {
    gap: Spacing.md,
  },
  dignityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  dignityLabel: {
    fontSize: 13,
    color: DarkTheme.textSecondary,
    fontWeight: Typography.weightMedium,
  },
  dignityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  dignityBadgeText: {
    fontSize: 12,
    fontWeight: Typography.weightBold,
  },
  dignityExplanation: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
    lineHeight: 18,
  },
  dignityStatsGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  dignityStat: {
    flex: 1,
    padding: Spacing.sm,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    gap: 4,
  },
  dignityStatLabel: {
    fontSize: 10,
    color: DarkTheme.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    fontWeight: Typography.weightMedium,
  },
  dignityStatValue: {
    fontSize: 14,
    color: DarkTheme.textPrimary,
    fontWeight: Typography.weightBold,
  },
  dignitySection: {
    gap: 8,
  },
  dignitySectionTitle: {
    fontSize: 13,
    color: DarkTheme.textPrimary,
    fontWeight: Typography.weightSemibold,
  },
  dignityBodyText: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
    lineHeight: 18,
  },
  dignityBulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  dignityBullet: {
    marginTop: 2,
    fontSize: 14,
    color: DarkTheme.textTertiary,
  },
  dignityBulletText: {
    flex: 1,
    fontSize: 12,
    color: DarkTheme.textSecondary,
    lineHeight: 18,
  },
  degreeContent: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  circularProgress: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circularCenter: {
    position: 'absolute',
    alignItems: 'center',
  },
  degreeValue: {
    fontSize: 26,
    fontWeight: Typography.weightBold,
    color: DarkTheme.textPrimary,
  },
  degreeTotal: {
    fontSize: 13,
    color: DarkTheme.textTertiary,
  },
  degreePercent: {
    fontSize: 13,
    color: DarkTheme.textSecondary,
  },
  phaseRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    flexWrap: 'wrap',
  },
  phaseBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  phaseActive: {
    borderColor: DarkTheme.textPrimary,
  },
  phaseInactive: {
    borderColor: 'rgba(255,255,255,0.12)',
  },
  phaseText: {
    fontSize: 11,
    color: DarkTheme.textSecondary,
  },
  personalizedCard: {
    gap: Spacing.md,
  },
  elementComparison: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  elementCircle: {
    alignItems: 'center',
    gap: 4,
  },
  elementGradientCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  elementCircleLabel: {
    fontSize: 11,
    color: DarkTheme.textTertiary,
    letterSpacing: 0.5,
  },
  elementCircleValue: {
    fontSize: 15,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
  },
  elementCircleArabic: {
    fontSize: 13,
    color: DarkTheme.textSecondary,
  },
  vsContainer: {
    alignItems: 'center',
    gap: 4,
  },
  vsText: {
    fontSize: 12,
    fontWeight: Typography.weightSemibold,
  },
  resonanceCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: Spacing.md,
    backgroundColor: 'rgba(255,255,255,0.04)',
    gap: 4,
  },
  resonanceLabel: {
    fontSize: 11,
    letterSpacing: 1,
  },
  resonanceArabicLarge: {
    fontSize: 17,
    color: DarkTheme.textPrimary,
  },
  resonanceDescription: {
    fontSize: 13,
    color: DarkTheme.textSecondary,
    lineHeight: 18,
  },
  impactPoints: {
    gap: Spacing.sm,
  },
  impactPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.xs,
  },
  impactPointText: {
    flex: 1,
    fontSize: 13,
    color: DarkTheme.textSecondary,
    lineHeight: 18,
  },
  yourNatureCard: {
    gap: Spacing.sm,
  },
  profileButton: {
    marginTop: Spacing.xs,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  profileButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: Typography.weightSemibold,
  },
  guidanceCard: {
    gap: Spacing.md,
  },
  guidanceGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  guidanceBox: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    minHeight: 100,
  },
  bestForBox: {
    borderColor: 'rgba(76, 175, 80, 0.35)',
    borderWidth: 1,
  },
  avoidBox: {
    borderColor: 'rgba(255, 152, 0, 0.35)',
    borderWidth: 1,
  },
  guidanceBoxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  guidanceBoxTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: DarkTheme.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  guidanceItem: {
    fontSize: 13,
    color: DarkTheme.textSecondary,
    lineHeight: 19,
    flexShrink: 1,
  },
  transitLensCard: {
    marginTop: 10,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    gap: 10,
  },
  transitLensRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  transitLensTitle: {
    flex: 1,
    fontSize: 12,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
  },
  transitLensSection: {
    gap: 4,
  },
  transitLensLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: DarkTheme.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  transitLensText: {
    fontSize: 13,
    color: DarkTheme.textSecondary,
    lineHeight: 19,
  },
  dailyStack: {
    gap: Spacing.md,
  },
  dailyItem: {
    gap: 4,
  },
  dailyLabel: {
    fontSize: 11,
    color: DarkTheme.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  signComparisonCard: {
    gap: Spacing.md,
  },
  balancingCard: {
    gap: Spacing.md,
  },
  cardSubtitle: {
    fontSize: 12,
    color: DarkTheme.textTertiary,
  },
  signComparisonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  signItem: {
    flex: 1,
    gap: 4,
  },
  signLabel: {
    fontSize: 11,
    color: DarkTheme.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  signName: {
    fontSize: 14,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
  },
  challengeBox: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 12,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  challengeText: {
    fontSize: 13,
    color: DarkTheme.textSecondary,
    lineHeight: 18,
  },
  divider: {
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    paddingTop: Spacing.sm,
  },
  dividerText: {
    fontSize: 10,
    color: DarkTheme.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  methodCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  methodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  methodIconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodTitleContainer: {
    flex: 1,
    gap: 2,
  },
  methodTitle: {
    fontSize: 13,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
  },
  methodTitleArabic: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
    fontFamily: 'Amiri',
  },
  methodContent: {
    gap: Spacing.sm,
  },
  instruction: {
    fontSize: 13,
    color: DarkTheme.textSecondary,
    lineHeight: 18,
  },
  countSection: {
    gap: Spacing.xs,
  },
  countBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  countNumber: {
    fontSize: 13,
    fontWeight: Typography.weightBold,
    color: DarkTheme.textPrimary,
  },
  countLabel: {
    fontSize: 10,
    color: DarkTheme.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  numerologyNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  numerologyText: {
    fontSize: 11,
    color: DarkTheme.textTertiary,
    flex: 1,
  },
  timingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timingText: {
    fontSize: 11,
    color: DarkTheme.textSecondary,
  },
  counterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  counterButtonText: {
    fontSize: 12,
    fontWeight: Typography.weightSemibold,
    color: '#fff',
  },
  sourceNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sourceText: {
    fontSize: 10,
    color: DarkTheme.textTertiary,
    flex: 1,
  },
  balancingDisclaimer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: Spacing.xs,
  },
  balancingDisclaimerText: {
    fontSize: 10,
    color: DarkTheme.textTertiary,
    flex: 1,
  },
  // ─────────────────────────────────────────────────────────────────
  // COMPREHENSIVE PLANET PRACTICES STYLES
  // ─────────────────────────────────────────────────────────────────
  practicesSection: {
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  practicesSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: Spacing.xs,
  },
  practicesSectionHeaderExpandable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
  },
  practicesSectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  practicesSectionTitle: {
    fontSize: 14,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
  },
  practicesSectionDesc: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
    lineHeight: 18,
    marginBottom: Spacing.sm,
  },
  // Practice Cards
  practiceCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: Spacing.xs,
    overflow: 'hidden',
  },
  practiceCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
  },
  practiceIcon: {
    fontSize: 28,
  },
  practiceCardTitles: {
    flex: 1,
    gap: 2,
  },
  practiceCardCategory: {
    fontSize: 10,
    color: DarkTheme.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  practiceCardNameAr: {
    fontSize: 18,
    fontWeight: Typography.weightBold,
    color: DarkTheme.textPrimary,
    fontFamily: Platform.OS === 'ios' ? 'Geeza Pro' : undefined,
  },
  practiceCardName: {
    fontSize: 13,
    color: DarkTheme.textSecondary,
  },
  practiceDifficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  practiceDifficultyText: {
    fontSize: 10,
    fontWeight: Typography.weightSemibold,
  },
  practiceCardContent: {
    padding: Spacing.md,
    paddingTop: 0,
    gap: Spacing.sm,
  },
  practiceCountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 8,
  },
  practiceCountLabel: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
    flex: 1,
  },
  practiceCountValue: {
    fontSize: 16,
    fontWeight: Typography.weightBold,
    color: DarkTheme.textPrimary,
  },
  practicePurposeBox: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 8,
    padding: Spacing.sm,
    gap: 4,
  },
  practicePurposeLabel: {
    fontSize: 12,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
  },
  practicePurposeText: {
    fontSize: 13,
    color: DarkTheme.textSecondary,
    lineHeight: 20,
  },
  practiceDurationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  practiceDurationText: {
    fontSize: 11,
    color: DarkTheme.textTertiary,
  },
  practiceHowToBox: {
    gap: 6,
    marginTop: Spacing.xs,
  },
  practiceHowToLabel: {
    fontSize: 12,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
    marginBottom: 2,
  },
  practiceHowToStep: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  practiceHowToBullet: {
    fontSize: 12,
    color: DarkTheme.textTertiary,
    fontWeight: Typography.weightBold,
  },
  practiceHowToText: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
  practiceActionsRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  practiceActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 10,
  },
  practiceActionButtonPrimary: {
    // backgroundColor set dynamically
  },
  practiceActionButtonSecondary: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  practiceActionButtonText: {
    fontSize: 13,
    fontWeight: Typography.weightSemibold,
    color: '#fff',
  },
  practiceActionButtonTextSecondary: {
    fontSize: 13,
    fontWeight: Typography.weightSemibold,
  },
  // Essences
  essencesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  essenceCard: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 12,
    padding: Spacing.sm,
    alignItems: 'center',
    gap: 4,
  },
  essenceIcon: {
    fontSize: 32,
  },
  essenceName: {
    fontSize: 13,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
    textAlign: 'center',
  },
  essenceNameAr: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
    fontFamily: Platform.OS === 'ios' ? 'Geeza Pro' : undefined,
  },
  essencePurpose: {
    fontSize: 11,
    color: DarkTheme.textTertiary,
    textAlign: 'center',
  },
  essenceHowToBox: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 8,
    padding: Spacing.sm,
    gap: 6,
    marginTop: Spacing.xs,
  },
  essenceHowToLabel: {
    fontSize: 12,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
  },
  essenceHowToItem: {
    flexDirection: 'row',
    gap: 8,
  },
  essenceHowToBullet: {
    fontSize: 12,
    color: DarkTheme.textTertiary,
  },
  essenceHowToText: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
  // Talisman
  talismanInfoBox: {
    backgroundColor: 'rgba(156, 39, 176, 0.08)',
    borderRadius: 12,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  talismanInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  talismanInfoLabel: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
  },
  talismanInfoValue: {
    fontSize: 14,
    fontWeight: Typography.weightBold,
    color: DarkTheme.textPrimary,
  },
  talismanInfoDesc: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
    lineHeight: 18,
  },
  talismanTimingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: Spacing.xs,
  },
  talismanTimingLabel: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
  },
  talismanTimingValue: {
    fontSize: 13,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
  },
  talismanWarningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    borderRadius: 8,
    padding: Spacing.sm,
    marginTop: Spacing.xs,
  },
  talismanWarningText: {
    fontSize: 11,
    color: '#FF9800',
    flex: 1,
    lineHeight: 16,
  },
  // Timing
  timingList: {
    gap: Spacing.xs,
  },
  timingItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingVertical: Spacing.xs,
  },
  timingBullet: {
    marginTop: 2,
  },
  practiceTimingText: {
    fontSize: 13,
    color: DarkTheme.textSecondary,
    flex: 1,
    lineHeight: 20,
  },
  // Preparation
  preparationList: {
    gap: Spacing.sm,
  },
  preparationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  preparationNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(33, 150, 243, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  preparationNumberText: {
    fontSize: 12,
    fontWeight: Typography.weightBold,
    color: '#2196F3',
  },
  preparationText: {
    fontSize: 13,
    color: DarkTheme.textSecondary,
    flex: 1,
    lineHeight: 20,
    paddingTop: 2,
  },
  // Advanced Angels
  advancedWarningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    borderRadius: 8,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  advancedWarningText: {
    fontSize: 11,
    color: '#FF6B35',
    fontWeight: Typography.weightSemibold,
  },
  angelCard: {
    backgroundColor: 'rgba(156, 39, 176, 0.08)',
    borderRadius: 10,
    padding: Spacing.sm,
    marginBottom: Spacing.xs,
    gap: 4,
    alignItems: 'center',
  },
  angelName: {
    fontSize: 15,
    fontWeight: Typography.weightBold,
    color: DarkTheme.textPrimary,
  },
  angelNameAr: {
    fontSize: 14,
    color: DarkTheme.textSecondary,
    fontFamily: Platform.OS === 'ios' ? 'Geeza Pro' : undefined,
  },
  angelRole: {
    fontSize: 12,
    color: DarkTheme.textTertiary,
    textAlign: 'center',
  },
  angelPrerequisitesBox: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 8,
    padding: Spacing.sm,
    gap: 6,
    marginTop: Spacing.xs,
  },
  angelPrerequisitesLabel: {
    fontSize: 12,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
    marginBottom: 2,
  },
  angelPrerequisiteItem: {
    flexDirection: 'row',
    gap: 8,
  },
  angelPrerequisiteBullet: {
    fontSize: 12,
    color: DarkTheme.textTertiary,
  },
  angelPrerequisiteText: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
  signGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  signColumn: {
    flex: 1,
    gap: 4,
  },
  signHeader: {
    fontSize: 11,
    color: DarkTheme.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  signValue: {
    fontSize: 14,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
  },
  historyCard: {
    gap: Spacing.md,
  },
  historyTimeline: {
    gap: Spacing.sm,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  historyItemCurrent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  historyDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  historyDotPast: {
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  historyDotCurrent: {
    backgroundColor: DarkTheme.textPrimary,
  },
  historyDotFuture: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  historyLine: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  historyContent: {
    flex: 1,
    gap: 2,
  },
  historySign: {
    fontSize: 14,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
  },
  historySignCurrent: {
    fontSize: 15,
    fontWeight: Typography.weightBold,
    color: DarkTheme.textPrimary,
  },
  historyDates: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
  },
  historyDatesCurrent: {
    fontSize: 13,
    color: DarkTheme.textSecondary,
  },
  historyBadge: {
    fontSize: 11,
    color: DarkTheme.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  historyHint: {
    fontSize: 11,
    color: DarkTheme.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  dataSourceCard: {
    gap: Spacing.sm,
  },
  infoValue: {
    fontSize: 14,
    color: DarkTheme.textPrimary,
    fontWeight: Typography.weightSemibold,
  },
  infoSub: {
    fontSize: 11,
    color: DarkTheme.textTertiary,
  },
  metaText: {
    fontSize: 13,
    color: DarkTheme.textSecondary,
  },
  nextDayCard: {
    gap: Spacing.md,
  },
  nextDayOrb: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  nextDayEmoji: {
    fontSize: 26,
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  namesCol: {
    flex: 1,
    minWidth: 0,
  },
  primaryName: {
    fontSize: 19,
    fontWeight: Typography.weightBold,
    color: DarkTheme.textPrimary,
  },
  secondaryName: {
    fontSize: 13,
    color: DarkTheme.textTertiary,
    fontFamily: 'Amiri',
  },
  pillsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  pill: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 4,
    minWidth: 0,
  },
  pillLabel: {
    fontSize: 11,
    color: DarkTheme.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pillValue: {
    fontSize: 14,
    fontWeight: Typography.weightSemibold,
  },
  // Element section styling
  elementSection: {
    gap: Spacing.md,
  },
  elementBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: Spacing.md,
    alignSelf: 'flex-start',
  },
  elementIcon: {
    fontSize: 24,
  },
  elementName: {
    fontSize: Typography.h3,
    fontWeight: Typography.weightBold,
  },
  // Activity list styling
  activityList: {
    gap: Spacing.sm,
  },
  activityItem: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'flex-start',
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
  },
  activityText: {
    flex: 1,
    fontSize: Typography.body,
    lineHeight: Typography.body * Typography.lineHeightNormal,
    color: DarkTheme.textSecondary,
  },
  // Info card styling
  infoCard: {
    gap: Spacing.md,
  },
  bodyText: {
    fontSize: 14,
    color: DarkTheme.textSecondary,
    lineHeight: 18,
  },
  disclaimerFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: Spacing.sm,
  },
  disclaimerText: {
    fontSize: 12,
    color: DarkTheme.textMuted,
    textAlign: 'center',
    lineHeight: 16,
  },
  allTransitsCard: {
    gap: Spacing.md,
  },
  allTransitsSummary: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  allTransitsSummaryCol: {
    flex: 1,
    gap: 8,
    padding: Spacing.sm,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  allTransitsSummaryTitle: {
    fontSize: 12,
    color: DarkTheme.textTertiary,
    fontWeight: Typography.weightSemibold,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  allTransitsSummaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  allTransitsSummaryPlanet: {
    flex: 1,
    fontSize: 12,
    color: DarkTheme.textSecondary,
    fontWeight: Typography.weightMedium,
  },
  allTransitsSummaryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  allTransitsSummaryBadgeText: {
    fontSize: 12,
    fontWeight: Typography.weightBold,
  },
  allTransitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  transitMiniCard: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    borderWidth: 1.5,
    padding: Spacing.md,
    gap: Spacing.xs,
    alignItems: 'center',
    position: 'relative',
  },
  transitMiniCardHighlight: {
    backgroundColor: 'rgba(76, 175, 80, 0.05)',
  },
  yourSignBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  yourSignText: {
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  miniPlanetOrb: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  miniPlanetSymbol: {
    fontSize: 24,
    color: '#fff',
  },
  miniPlanetName: {
    fontSize: 13,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
    textAlign: 'center',
  },
  miniRetrograde: {
    fontSize: 10,
    color: 'rgba(255, 209, 194, 0.92)',
    fontWeight: '700',
    marginTop: 4,
    marginBottom: 6,
    textAlign: 'center',
  },
  miniZodiacBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    width: '100%',
    justifyContent: 'center',
  },
  miniZodiacSymbol: {
    fontSize: 14,
  },
  miniZodiacName: {
    fontSize: 11,
    fontWeight: '600',
  },
  miniDegree: {
    fontSize: 10,
    color: DarkTheme.textTertiary,
  },
  loadingContainer: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  influenceCard: {
    gap: Spacing.md,
  },
  influenceBadges: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  influenceTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  influenceTypeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  degreeStageBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  degreeStageText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  influenceScopeText: {
    fontSize: 14,
    color: DarkTheme.textSecondary,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  summaryCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    borderWidth: 1.5,
    padding: Spacing.md,
  },
  summaryTitle: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  summaryText: {
    fontSize: 14,
    color: DarkTheme.textSecondary,
    lineHeight: 20,
  },
  degreeExplanationCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 14,
    borderWidth: 1.5,
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  degreeStageDescription: {
    fontSize: 14,
    color: DarkTheme.textSecondary,
    lineHeight: 20,
  },
  influenceTimingText: {
    fontSize: 13,
    color: DarkTheme.textTertiary,
    lineHeight: 18,
  },
  guidanceSection: {
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  guidanceSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  guidanceSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: DarkTheme.textPrimary,
  },
  guidanceListItem: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  guidanceBullet: {
    fontSize: 16,
    color: DarkTheme.textTertiary,
    lineHeight: 20,
  },
  guidanceItemText: {
    flex: 1,
    fontSize: 13,
    color: DarkTheme.textSecondary,
    lineHeight: 20,
  },
  disclaimerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 10,
    padding: Spacing.sm,
    marginTop: Spacing.sm,
  },
  disclaimerBoxText: {
    flex: 1,
    fontSize: 11,
    color: DarkTheme.textMuted,
    lineHeight: 16,
  },
  // ─────────────────────────────────────────────────────────────────────────────
  // SPIRITUAL PRACTICE CARD STYLES (Classical Degree-Based Guidance)
  // ─────────────────────────────────────────────────────────────────────────────
  spiritualCard: {
    gap: Spacing.md,
  },
  spiritualPhaseBadge: {
    alignSelf: 'flex-start',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  spiritualPhaseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  spiritualPhaseLabel: {
    fontSize: 13,
    fontWeight: Typography.weightSemibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  spiritualPhaseArabic: {
    fontSize: 13,
    color: DarkTheme.textSecondary,
    fontFamily: Platform.OS === 'ios' ? 'Geeza Pro' : undefined,
  },
  spiritualDegreeBadge: {
    fontSize: 12,
    color: DarkTheme.textTertiary,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 4,
  },
  spiritualStatusText: {
    fontSize: 14,
    color: DarkTheme.textPrimary,
    fontWeight: Typography.weightMedium,
    lineHeight: 20,
  },
  transitStrengthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
  },
  transitStrengthLabel: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
  },
  transitStrengthValue: {
    fontSize: 14,
    fontWeight: Typography.weightSemibold,
    fontVariant: ['tabular-nums'],
  },
  transitStrengthPill: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  transitStrengthPillText: {
    fontSize: 10,
    fontWeight: Typography.weightSemibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  spiritualGuidanceBox: {
    backgroundColor: 'rgba(255, 215, 0, 0.08)',
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#FFD700',
    padding: Spacing.md,
  },
  spiritualGuidanceText: {
    fontSize: 13,
    color: DarkTheme.textSecondary,
    lineHeight: 20,
  },
  spiritualDhikrCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 12,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  spiritualDhikrHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  spiritualDhikrLabel: {
    fontSize: 11,
    color: '#FFD700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: Typography.weightSemibold,
  },
  spiritualDhikrContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  spiritualDhikrName: {
    fontSize: 15,
    color: DarkTheme.textPrimary,
    fontWeight: Typography.weightMedium,
  },
  spiritualDhikrArabic: {
    fontSize: 18,
    color: DarkTheme.textPrimary,
    fontFamily: Platform.OS === 'ios' ? 'Geeza Pro' : undefined,
  },
  spiritualDhikrCountBadge: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  spiritualDhikrCount: {
    fontSize: 13,
    color: '#4CAF50',
    fontWeight: Typography.weightBold,
  },
  spiritualDhikrNote: {
    fontSize: 12,
    color: DarkTheme.textTertiary,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  spiritualAvoidBox: {
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    borderRadius: 10,
    padding: Spacing.sm,
    gap: 6,
  },
  spiritualAvoidHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  spiritualAvoidLabel: {
    fontSize: 11,
    color: '#FF6B35',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: Typography.weightSemibold,
  },
  spiritualAvoidText: {
    fontSize: 13,
    color: DarkTheme.textSecondary,
    lineHeight: 18,
  },
  spiritualDisclaimer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: Spacing.xs,
  },
  spiritualDisclaimerText: {
    fontSize: 10,
    color: DarkTheme.textTertiary,
    flex: 1,
  },
  // ─────────────────────────────────────────────────────────────────────────────
  // NEW: Practice Section Styles (Tier Selector + Timing Window)
  // ─────────────────────────────────────────────────────────────────────────────
  practiceSection: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 12,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  practiceSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  practiceSectionTitle: {
    fontSize: 11,
    color: '#FFD700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: Typography.weightSemibold,
    flex: 1,
  },
  // Tier Selector
  tierSelector: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  tierPill: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tierPillSelected: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderColor: '#4CAF50',
  },
  tierPillRecommended: {
    borderColor: 'rgba(255, 215, 0, 0.4)',
  },
  tierPillLabel: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
    fontWeight: Typography.weightMedium,
    textTransform: 'capitalize',
  },
  tierPillLabelSelected: {
    color: '#4CAF50',
    fontWeight: Typography.weightSemibold,
  },
  tierRecommendedDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFD700',
  },
  tierDetails: {
    marginTop: 8,
    gap: 8,
  },
  tierCountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tierCountLabel: {
    fontSize: 14,
    color: DarkTheme.textPrimary,
    fontWeight: Typography.weightMedium,
  },
  tierCountArabic: {
    fontSize: 16,
    color: DarkTheme.textPrimary,
    fontFamily: Platform.OS === 'ios' ? 'Geeza Pro' : undefined,
  },
  tierCountBadges: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  tierCountBadge: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tierCountBadgeDefault: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.4)',
  },
  tierCountValue: {
    fontSize: 14,
    color: DarkTheme.textSecondary,
    fontWeight: Typography.weightMedium,
  },
  tierCountValueDefault: {
    color: '#4CAF50',
    fontWeight: Typography.weightBold,
  },
  tierEstimate: {
    fontSize: 12,
    color: DarkTheme.textTertiary,
  },
  // Strength Badge
  strengthBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(158, 158, 158, 0.2)',
  },
  strengthBadgePeak: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
  },
  strengthBadgeStrong: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
  },
  strengthBadgeSupportive: {
    backgroundColor: 'rgba(33, 150, 243, 0.2)',
  },
  strengthBadgeGentle: {
    backgroundColor: 'rgba(158, 158, 158, 0.2)',
  },
  strengthBadgeText: {
    fontSize: 10,
    fontWeight: Typography.weightBold,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    color: '#9E9E9E',
  },
  strengthBadgeTextPeak: {
    color: '#FFD700',
  },
  strengthBadgeTextStrong: {
    color: '#4CAF50',
  },
  strengthBadgeTextSupportive: {
    color: '#2196F3',
  },
  strengthBadgeTextGentle: {
    color: '#9E9E9E',
  },
  // Planet Hour Window
  planetHourWindow: {
    marginTop: 4,
  },
  planetHourActive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 8,
    padding: Spacing.sm,
  },
  planetHourActiveText: {
    fontSize: 13,
    color: '#4CAF50',
    fontWeight: Typography.weightMedium,
    flex: 1,
  },
  planetHourNext: {
    gap: 4,
  },
  planetHourNextLabel: {
    fontSize: 14,
    color: DarkTheme.textPrimary,
    fontWeight: Typography.weightMedium,
  },
  planetHourCountdown: {
    fontSize: 12,
    color: DarkTheme.textTertiary,
  },
  planetHourUnavailable: {
    fontSize: 12,
    color: DarkTheme.textTertiary,
    fontStyle: 'italic',
  },
  // Fallback Guidance
  fallbackGuidance: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  fallbackTitle: {
    fontSize: 11,
    color: DarkTheme.textTertiary,
    fontWeight: Typography.weightMedium,
    marginBottom: 2,
  },
  fallbackText: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
    lineHeight: 18,
  },
});

function GlassCard({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  if (Platform.OS === 'android') {
    return (
      <View style={styles.glassCard}>
        <View style={[styles.glassBlur, style]}>{children}</View>
      </View>
    );
  }

  return (
    <View style={styles.glassCard}>
      <BlurView intensity={24} tint="dark" style={[styles.glassBlur, style]}>
        {children}
      </BlurView>
    </View>
  );
}
