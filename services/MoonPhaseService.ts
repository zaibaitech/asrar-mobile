/**
 * Moon Phase Service
 * ==================
 * 
 * Implements complete lunar analysis with 8 phases, lunar days (1-30),
 * waxing/waning determination, power calculation, and guidance generation.
 * 
 * Used as PRIMARY timing layer in Daily Energy system.
 */

import type { Planet } from '@/services/PlanetaryHoursService';
import type { ElementalTone } from '@/types/divine-timing';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type MoonPhaseName =
  | 'new'
  | 'waxing_crescent'
  | 'first_quarter'
  | 'waxing_gibbous'
  | 'full'
  | 'waning_gibbous'
  | 'last_quarter'
  | 'waning_crescent';

export type MoonPhaseEnergy = 'building' | 'peak' | 'releasing' | 'rest';

export type MoonPowerQuality = 'Excellent' | 'Good' | 'Moderate' | 'Weak' | 'Rest';

export interface PrimaryGuidance {
  title: string;
  titleKey: string;
  description: string;
  descriptionKey: string;
}

export interface SuitableActivities {
  category: string;
  categoryKey: string;
  activities: string[];
  activitiesKeys: string[];
  spiritualPractices: string[];
  spiritualPracticesKeys: string[];
}

export interface NotSuitableActivities {
  category: string;
  categoryKey: string;
  activities: string[];
  activitiesKeys: string[];
  reason: string;
  reasonKey: string;
}

export interface MoonPhaseAnalysis {
  // Core Data
  phasePercentage: number; // 0-100% illumination
  phaseName: MoonPhaseName; // One of 8 phases
  phaseNameTranslated: {
    en: string;
    fr: string;
    ar: string;
  };
  lunarDay: number; // 1-30
  isWaxing: boolean;

  // Timing Guidance
  energyType: MoonPhaseEnergy;
  primaryGuidance: PrimaryGuidance;

  // Suitability
  suitable: SuitableActivities;
  notSuitable: NotSuitableActivities;

  // Power Assessment
  moonPower: number; // 0-100%
  powerQuality: MoonPowerQuality;

  // Visual Helpers
  moonEmoji: string;
  color: string;
}

export interface MoonDayHarmony {
  isAligned: boolean;
  harmonyLevel: 'perfect' | 'good' | 'neutral' | 'challenging';
  explanation: string;
  explanationKey: string;
  recommendation: string;
  recommendationKey: string;
}

// ============================================================================
// CORE CALCULATION FUNCTIONS
// ============================================================================

/**
 * Calculate complete Moon phase analysis
 * Primary entry point for Moon phase data
 */
export function analyzeMoonPhase(
  moonIllumination: number,
  sunLongitude: number,
  moonLongitude: number,
  date: Date
): MoonPhaseAnalysis {
  // STEP 1: Determine if waxing or waning
  const isWaxing = isWaxingMoon(sunLongitude, moonLongitude);

  // STEP 2: Determine phase name
  const phaseName = getMoonPhaseName(moonIllumination, isWaxing);

  // STEP 3: Calculate lunar day (1-30)
  const lunarDay = calculateLunarDay(date);

  // STEP 4: Determine energy type
  const energyType = getEnergyType(phaseName);

  // STEP 5: Generate guidance
  const guidance = generatePhaseGuidance(phaseName, isWaxing, lunarDay);

  // STEP 6: Calculate moon power
  const moonPower = calculateMoonPower(moonIllumination, lunarDay, phaseName);

  // STEP 7: Assemble result
  return {
    phasePercentage: Math.round(moonIllumination),
    phaseName,
    phaseNameTranslated: getPhaseNameTranslations(phaseName),
    lunarDay,
    isWaxing,
    energyType,
    primaryGuidance: guidance.primary,
    suitable: guidance.suitable,
    notSuitable: guidance.notSuitable,
    moonPower: Math.round(moonPower),
    powerQuality: getPowerQuality(moonPower),
    moonEmoji: getMoonEmoji(phaseName),
    color: getMoonColor(phaseName, isWaxing),
  };
}

/**
 * Determine if Moon is waxing (growing) or waning (shrinking)
 * Based on angular relationship between Sun and Moon
 */
function isWaxingMoon(sunLongitude: number, moonLongitude: number): boolean {
  // Calculate angular distance from Sun to Moon
  let distance = moonLongitude - sunLongitude;

  // Normalize to 0-360 range
  if (distance < 0) distance += 360;

  // Waxing: Moon is ahead of Sun (0-180°)
  // Waning: Moon is behind Sun (180-360°)
  return distance >= 0 && distance < 180;
}

/**
 * Get Moon phase name from illumination percentage
 * Divides lunar month into 8 distinct phases
 */
function getMoonPhaseName(
  illumination: number,
  isWaxing: boolean
): MoonPhaseName {
  // Illuminate ranges for each phase - VERIFIED boundaries
  // 0-6.25%: New Moon
  // 6.25-43.75%: Crescent (waxing or waning)
  // 43.75-56.25%: Quarter (first or last) ← 44% illumination correct here
  // 56.25-93.75%: Gibbous (waxing or waning)
  // 93.75-100%: Full Moon
  if (illumination < 6.25) {
    return 'new';
  } else if (illumination < 43.75) {
    return isWaxing ? 'waxing_crescent' : 'waning_crescent';
  } else if (illumination < 56.25) {
    // Quarter phase: 44% illumination is correctly placed here (not gibbous)
    return isWaxing ? 'first_quarter' : 'last_quarter';
  } else if (illumination < 93.75) {
    return isWaxing ? 'waxing_gibbous' : 'waning_gibbous';
  } else {
    return 'full';
  }
}

/**
 * Calculate lunar day (1-30) from date
 * Uses synodic month length of 29.53 days
 * Reference: New Moon on Jan 6, 2000 18:14 UTC
 */
function calculateLunarDay(date: Date): number {
  // Reference point: New Moon
  const referenceNewMoon = new Date('2000-01-06T18:14:00Z').getTime();
  const synodicMonth = 29.53058867; // days (Mean Synodic Month)

  const currentTime = date.getTime();
  const daysSinceReference =
    (currentTime - referenceNewMoon) / (1000 * 60 * 60 * 24);

  const lunarDay = (daysSinceReference % synodicMonth) + 1;

  return Math.floor(lunarDay);
}

/**
 * Determine energy type from phase name
 * Classifies phases by their spiritual/energetic quality
 */
function getEnergyType(phaseName: MoonPhaseName): MoonPhaseEnergy {
  const energyMap: Record<MoonPhaseName, MoonPhaseEnergy> = {
    new: 'rest',
    waxing_crescent: 'building',
    first_quarter: 'building',
    waxing_gibbous: 'building',
    full: 'peak',
    waning_gibbous: 'releasing',
    last_quarter: 'releasing',
    waning_crescent: 'rest',
  };

  return energyMap[phaseName];
}

/**
 * Calculate Moon's overall power
 * Combines: illumination + lunar day quality + phase significance
 */
function calculateMoonPower(
  illumination: number,
  lunarDay: number,
  phaseName: MoonPhaseName
): number {
  let power = illumination; // Start with illumination (0-100)

  // Adjust for lunar day significance
  if (lunarDay >= 1 && lunarDay <= 3) {
    // Dark moon period - lowest power
    power *= 0.6;
  } else if (lunarDay >= 13 && lunarDay <= 15) {
    // Full moon period - peak power
    power *= 1.15;
  } else if (lunarDay >= 27 && lunarDay <= 30) {
    // Very dark moon - very low power
    power *= 0.5;
  } else if (lunarDay >= 4 && lunarDay <= 12) {
    // Waxing crescent to first quarter - building
    power *= 1.05;
  } else if (lunarDay >= 16 && lunarDay <= 26) {
    // Waning gibbous to last quarter - releasing (moderate)
    power *= 0.95;
  }

  // Clamp to 0-100
  return Math.max(0, Math.min(100, power));
}

/**
 * Determine power quality label
 */
function getPowerQuality(power: number): MoonPowerQuality {
  if (power >= 85) return 'Excellent';
  if (power >= 65) return 'Good';
  if (power >= 45) return 'Moderate';
  if (power >= 25) return 'Weak';
  return 'Rest';
}

/**
 * Get moon emoji representation for phase
 */
function getMoonEmoji(phaseName: MoonPhaseName): string {
  const emojiMap: Record<MoonPhaseName, string> = {
    new: '🌑',
    waxing_crescent: '🌒',
    first_quarter: '🌓',
    waxing_gibbous: '🌔',
    full: '🌕',
    waning_gibbous: '🌖',
    last_quarter: '🌗',
    waning_crescent: '🌘',
  };

  return emojiMap[phaseName];
}

/**
 * Get color for UI theming based on phase
 */
function getMoonColor(phaseName: MoonPhaseName, isWaxing: boolean): string {
  // Color scheme reflecting lunar energy
  const colorMap: Record<MoonPhaseName, string> = {
    new: '#1F2937', // Dark gray (rest/darkness)
    waxing_crescent: '#60A5FA', // Light blue (emerging light)
    first_quarter: '#34D399', // Green (growing)
    waxing_gibbous: '#FBBF24', // Amber (building)
    full: '#FCD34D', // Gold (peak light)
    waning_gibbous: '#F97316', // Orange (releasing)
    last_quarter: '#64748B', // Slate (declining)
    waning_crescent: '#4B5563', // Dark slate (resting)
  };

  return colorMap[phaseName];
}

/**
 * Get translated phase names
 */
function getPhaseNameTranslations(
  phaseName: MoonPhaseName
): { en: string; fr: string; ar: string } {
  const translations: Record<MoonPhaseName, Record<string, string>> = {
    new: {
      en: 'New Moon',
      fr: 'Nouvelle Lune',
      ar: 'القمر الجديد',
    },
    waxing_crescent: {
      en: 'Waxing Crescent',
      fr: 'Croissant Ascendant',
      ar: 'الهلال المتزايد',
    },
    first_quarter: {
      en: 'First Quarter',
      fr: 'Premier Quartier',
      ar: 'التربيع الأول',
    },
    waxing_gibbous: {
      en: 'Waxing Gibbous',
      fr: 'Gibbeux Ascendant',
      ar: 'الأحدب المتزايد',
    },
    full: {
      en: 'Full Moon',
      fr: 'Pleine Lune',
      ar: 'البدر',
    },
    waning_gibbous: {
      en: 'Waning Gibbous',
      fr: 'Gibbeux Décroissant',
      ar: 'الأحدب المتناقص',
    },
    last_quarter: {
      en: 'Last Quarter',
      fr: 'Dernier Quartier',
      ar: 'التربيع الأخير',
    },
    waning_crescent: {
      en: 'Waning Crescent',
      fr: 'Croissant Décroissant',
      ar: 'الهلال المتناقص',
    },
  };

  return (translations[phaseName] as { en: string; fr: string; ar: string }) || { en: 'Unknown', fr: 'Inconnu', ar: 'غير معروف' };
}

// ============================================================================
// PHASE GUIDANCE GENERATION
// ============================================================================

/**
 * Generate phase-specific guidance for activities and practices
 */
function generatePhaseGuidance(
  phaseName: MoonPhaseName,
  isWaxing: boolean,
  lunarDay: number
): {
  primary: PrimaryGuidance;
  suitable: SuitableActivities;
  notSuitable: NotSuitableActivities;
} {
  const guidance = PHASE_GUIDANCE[phaseName];

  return {
    primary: guidance.primary,
    suitable: guidance.suitable,
    notSuitable: guidance.notSuitable,
  };
}

/**
 * Complete phase guidance data
 * Defines timing suitability for each of 8 phases
 */
const PHASE_GUIDANCE: Record<
  MoonPhaseName,
  {
    primary: PrimaryGuidance;
    suitable: SuitableActivities;
    notSuitable: NotSuitableActivities;
  }
> = {
  new: {
    primary: {
      title: 'Rest & Reflection',
      titleKey: 'moon.new.title',
      description:
        'The dark Moon is a time of rest, completion, and spiritual preparation. Perfect for contemplation and inner work before new beginnings.',
      descriptionKey: 'moon.new.description',
    },
    suitable: {
      category: 'Spiritual Practice',
      categoryKey: 'moon.new.suitable.category',
      activities: ['Rest and restoration', 'Deep contemplation', 'Shadow work'],
      activitiesKeys: ['moon.new.suitable.activity1', 'moon.new.suitable.activity2', 'moon.new.suitable.activity3'],
      spiritualPractices: ['Night prayers (Tahajjud)', 'Tawbah (repentance)', 'Fasting'],
      spiritualPracticesKeys: ['moon.new.suitable.spiritual1', 'moon.new.suitable.spiritual2', 'moon.new.suitable.spiritual3'],
    },
    notSuitable: {
      category: 'External Action',
      categoryKey: 'moon.new.notSuitable.category',
      activities: ['Starting new projects', 'Major launches', 'Business agreements'],
      activitiesKeys: ['moon.new.notSuitable.activity1', 'moon.new.notSuitable.activity2', 'moon.new.notSuitable.activity3'],
      reason: 'The dark Moon lacks the light and momentum for new external endeavors. Wait for the light to return.',
      reasonKey: 'moon.new.notSuitable.reason',
    },
  },

  waxing_crescent: {
    primary: {
      title: 'Time for New Beginnings',
      titleKey: 'moon.waxing_crescent.title',
      description:
        "The Moon's growing light supports starting projects and building momentum toward your goals. Plant seeds of intention.",
      descriptionKey: 'moon.waxing_crescent.description',
    },
    suitable: {
      category: 'Growth & New Projects',
      categoryKey: 'moon.waxing_crescent.suitable.category',
      activities: ['Starting businesses', 'New relationships', 'Learning new skills', 'Creative projects'],
      activitiesKeys: [
        'moon.waxing_crescent.suitable.activity1',
        'moon.waxing_crescent.suitable.activity2',
        'moon.waxing_crescent.suitable.activity3',
        'moon.waxing_crescent.suitable.activity4',
      ],
      spiritualPractices: ['Du\'a for increase', 'Invocation practices', 'Goal-setting rituals'],
      spiritualPracticesKeys: [
        'moon.waxing_crescent.suitable.spiritual1',
        'moon.waxing_crescent.suitable.spiritual2',
        'moon.waxing_crescent.suitable.spiritual3',
      ],
    },
    notSuitable: {
      category: 'Endings & Release',
      categoryKey: 'moon.waxing_crescent.notSuitable.category',
      activities: ['Major endings', 'Banishing', 'Cutting ties'],
      activitiesKeys: [
        'moon.waxing_crescent.notSuitable.activity1',
        'moon.waxing_crescent.notSuitable.activity2',
        'moon.waxing_crescent.notSuitable.activity3',
      ],
      reason: 'Growing light opposes release and completion. The Moon wants to build, not diminish.',
      reasonKey: 'moon.waxing_crescent.notSuitable.reason',
    },
  },

  first_quarter: {
    primary: {
      title: 'Action & Decision',
      titleKey: 'moon.first_quarter.title',
      description:
        'The Moon is half-lit, a time of decision and action. Move forward on plans you\'ve begun, overcome obstacles.',
      descriptionKey: 'moon.first_quarter.description',
    },
    suitable: {
      category: 'Challenge & Growth',
      categoryKey: 'moon.first_quarter.suitable.category',
      activities: ['Taking action on plans', 'Overcoming obstacles', 'Major decisions', 'Physical activities'],
      activitiesKeys: [
        'moon.first_quarter.suitable.activity1',
        'moon.first_quarter.suitable.activity2',
        'moon.first_quarter.suitable.activity3',
        'moon.first_quarter.suitable.activity4',
      ],
      spiritualPractices: ['Protective practices', 'Strength-building dhikr', 'Will-power work'],
      spiritualPracticesKeys: [
        'moon.first_quarter.suitable.spiritual1',
        'moon.first_quarter.suitable.spiritual2',
        'moon.first_quarter.suitable.spiritual3',
      ],
    },
    notSuitable: {
      category: 'Delicate Matters',
      categoryKey: 'moon.first_quarter.notSuitable.category',
      activities: ['Peace negotiations', 'Gentle healing', 'Receptive work'],
      activitiesKeys: [
        'moon.first_quarter.notSuitable.activity1',
        'moon.first_quarter.notSuitable.activity2',
        'moon.first_quarter.notSuitable.activity3',
      ],
      reason: 'The Moon\'s growing light creates tension and challenge. Better for gentle work during waning.',
      reasonKey: 'moon.first_quarter.notSuitable.reason',
    },
  },

  waxing_gibbous: {
    primary: {
      title: 'Near Full Moon Power',
      titleKey: 'moon.waxing_gibbous.title',
      description:
        'Almost full and nearly at peak power. This is powerful timing for manifesting desires, completing projects, and major work.',
      descriptionKey: 'moon.waxing_gibbous.description',
    },
    suitable: {
      category: 'Manifestation & Completion',
      categoryKey: 'moon.waxing_gibbous.suitable.category',
      activities: ['Completing projects', 'Final push for goals', 'Manifestation work', 'Important events'],
      activitiesKeys: [
        'moon.waxing_gibbous.suitable.activity1',
        'moon.waxing_gibbous.suitable.activity2',
        'moon.waxing_gibbous.suitable.activity3',
        'moon.waxing_gibbous.suitable.activity4',
      ],
      spiritualPractices: ['Full Moon practices', 'Intention manifestation', 'Peak energy rituals'],
      spiritualPracticesKeys: [
        'moon.waxing_gibbous.suitable.spiritual1',
        'moon.waxing_gibbous.suitable.spiritual2',
        'moon.waxing_gibbous.suitable.spiritual3',
      ],
    },
    notSuitable: {
      category: 'Subtle/Hidden Work',
      categoryKey: 'moon.waxing_gibbous.notSuitable.category',
      activities: ['Secret work', 'Quiet reflection', 'Hidden practices'],
      activitiesKeys: [
        'moon.waxing_gibbous.notSuitable.activity1',
        'moon.waxing_gibbous.notSuitable.activity2',
        'moon.waxing_gibbous.notSuitable.activity3',
      ],
      reason: 'Near-full Moon is brilliant and public. If discretion is needed, choose a darker phase.',
      reasonKey: 'moon.waxing_gibbous.notSuitable.reason',
    },
  },

  full: {
    primary: {
      title: 'Peak Moon Power',
      titleKey: 'moon.full.title',
      description:
        'The Full Moon illuminates everything and brings matters to culmination. Powerful for healing, revelation, and completion.',
      descriptionKey: 'moon.full.description',
    },
    suitable: {
      category: 'Culmination & Healing',
      categoryKey: 'moon.full.suitable.category',
      activities: [
        'Healing work',
        'Revelations and clarity',
        'Completion ceremonies',
        'Group gatherings',
        'Full Moon rituals',
      ],
      activitiesKeys: [
        'moon.full.suitable.activity1',
        'moon.full.suitable.activity2',
        'moon.full.suitable.activity3',
        'moon.full.suitable.activity4',
        'moon.full.suitable.activity5',
      ],
      spiritualPractices: ['Full Moon prayers', 'Healing rituals', 'Community practices', 'Vision clarity'],
      spiritualPracticesKeys: [
        'moon.full.suitable.spiritual1',
        'moon.full.suitable.spiritual2',
        'moon.full.suitable.spiritual3',
        'moon.full.suitable.spiritual4',
      ],
    },
    notSuitable: {
      category: 'New Beginnings',
      categoryKey: 'moon.full.notSuitable.category',
      activities: ['Starting new projects', 'Quiet introspection', 'Secret work'],
      activitiesKeys: ['moon.full.notSuitable.activity1', 'moon.full.notSuitable.activity2', 'moon.full.notSuitable.activity3'],
      reason: 'Full Moon energy is external and illuminating. For new starts, wait for the waxing crescent.',
      reasonKey: 'moon.full.notSuitable.reason',
    },
  },

  waning_gibbous: {
    primary: {
      title: 'Gratitude & Sharing',
      titleKey: 'moon.waning_gibbous.title',
      description:
        'The Moon begins to fade. Express gratitude for blessings, share knowledge, and complete what remains before the new phase.',
      descriptionKey: 'moon.waning_gibbous.description',
    },
    suitable: {
      category: 'Completion & Gratitude',
      categoryKey: 'moon.waning_gibbous.suitable.category',
      activities: ['Finishing projects', 'Expressing gratitude', 'Teaching/sharing', 'Organizing'],
      activitiesKeys: [
        'moon.waning_gibbous.suitable.activity1',
        'moon.waning_gibbous.suitable.activity2',
        'moon.waning_gibbous.suitable.activity3',
        'moon.waning_gibbous.suitable.activity4',
      ],
      spiritualPractices: ['Gratitude practices', 'Shukr rituals', 'Blessing work', 'Teaching practices'],
      spiritualPracticesKeys: [
        'moon.waning_gibbous.suitable.spiritual1',
        'moon.waning_gibbous.suitable.spiritual2',
        'moon.waning_gibbous.suitable.spiritual3',
        'moon.waning_gibbous.suitable.spiritual4',
      ],
    },
    notSuitable: {
      category: 'Major New Ventures',
      categoryKey: 'moon.waning_gibbous.notSuitable.category',
      activities: ['Starting big projects', 'Initiating relationships', 'New commitments'],
      activitiesKeys: [
        'moon.waning_gibbous.notSuitable.activity1',
        'moon.waning_gibbous.notSuitable.activity2',
        'moon.waning_gibbous.notSuitable.activity3',
      ],
      reason: 'Waning Moon moves toward completion. New ventures belong in the waxing phase.',
      reasonKey: 'moon.waning_gibbous.notSuitable.reason',
    },
  },

  last_quarter: {
    primary: {
      title: 'Letting Go & Release',
      titleKey: 'moon.last_quarter.title',
      description:
        'Half Moon but now declining. Release what no longer serves, forgive, and prepare for closure.',
      descriptionKey: 'moon.last_quarter.description',
    },
    suitable: {
      category: 'Release & Cleansing',
      categoryKey: 'moon.last_quarter.suitable.category',
      activities: ['Banishing negative patterns', 'Cleansing', 'Forgiveness', 'Ending relationships respectfully'],
      activitiesKeys: [
        'moon.last_quarter.suitable.activity1',
        'moon.last_quarter.suitable.activity2',
        'moon.last_quarter.suitable.activity3',
        'moon.last_quarter.suitable.activity4',
      ],
      spiritualPractices: ['Cleansing rituals', 'Forgiveness practices', 'Release ceremonies', 'Tawbah work'],
      spiritualPracticesKeys: [
        'moon.last_quarter.suitable.spiritual1',
        'moon.last_quarter.suitable.spiritual2',
        'moon.last_quarter.suitable.spiritual3',
        'moon.last_quarter.suitable.spiritual4',
      ],
    },
    notSuitable: {
      category: 'New Growth',
      categoryKey: 'moon.last_quarter.notSuitable.category',
      activities: ['Starting new projects', 'Expansion', 'New commitments'],
      activitiesKeys: [
        'moon.last_quarter.notSuitable.activity1',
        'moon.last_quarter.notSuitable.activity2',
        'moon.last_quarter.notSuitable.activity3',
      ],
      reason: 'Waning Moon energy supports release, not growth. New ventures thrive during the waxing phase.',
      reasonKey: 'moon.last_quarter.notSuitable.reason',
    },
  },

  waning_crescent: {
    primary: {
      title: 'Rest Before Renewal',
      titleKey: 'moon.waning_crescent.title',
      description:
        'The Moon nearly dark, the final rest before renewal. Slow down, reflect deeply, and complete final endings.',
      descriptionKey: 'moon.waning_crescent.description',
    },
    suitable: {
      category: 'Deep Reflection',
      categoryKey: 'moon.waning_crescent.suitable.category',
      activities: ['Meditation', 'Introspection', 'Final closures', 'Spiritual retreat'],
      activitiesKeys: [
        'moon.waning_crescent.suitable.activity1',
        'moon.waning_crescent.suitable.activity2',
        'moon.waning_crescent.suitable.activity3',
        'moon.waning_crescent.suitable.activity4',
      ],
      spiritualPractices: ['Night prayers', 'Deep dhikr', 'Iʿtikāf (retreat)', 'Fasting'],
      spiritualPracticesKeys: [
        'moon.waning_crescent.suitable.spiritual1',
        'moon.waning_crescent.suitable.spiritual2',
        'moon.waning_crescent.suitable.spiritual3',
        'moon.waning_crescent.suitable.spiritual4',
      ],
    },
    notSuitable: {
      category: 'Active Undertakings',
      categoryKey: 'moon.waning_crescent.notSuitable.category',
      activities: ['Starting projects', 'Major activities', 'Public work'],
      activitiesKeys: [
        'moon.waning_crescent.notSuitable.activity1',
        'moon.waning_crescent.notSuitable.activity2',
        'moon.waning_crescent.notSuitable.activity3',
      ],
      reason: 'Nearly dark Moon calls for rest. Wait for new light to begin new endeavors.',
      reasonKey: 'moon.waning_crescent.notSuitable.reason',
    },
  },
};

// ============================================================================
// MOON-DAY HARMONY ANALYSIS
// ============================================================================

/**
 * Analyze harmony between Moon phase and Day ruling planet
 * 
 * Classical principle:
 * - Waxing Moon + Active planet (Sun/Mars/Jupiter) = Perfect for starting
 * - Waning Moon + Reflective planet (Moon/Venus/Saturn) = Perfect for completing
 * - Mismatches = Mixed timing
 */
export function analyzeMoonDayHarmony(
  moonPhase: MoonPhaseAnalysis,
  dayRuler: Planet,
  dayElement: ElementalTone
): MoonDayHarmony {
  const isWaxing = moonPhase.isWaxing;

  // Active planets: Sun, Mars, Jupiter (Fire/initiative/action)
  // Reflective planets: Moon, Venus, Saturn (Water/Earth/completion/emotion)
  const activePlanets: Planet[] = ['Sun', 'Mars', 'Jupiter'];
  const reflectivePlanets: Planet[] = ['Moon', 'Venus', 'Saturn'];

  const isDayActive = activePlanets.includes(dayRuler);
  const isDayReflective = reflectivePlanets.includes(dayRuler);

  // Determine harmony using classical timing principles
  if (isWaxing && isDayActive) {
    return {
      isAligned: true,
      harmonyLevel: 'perfect',
      explanation: `Waxing Moon + ${dayRuler} (active planet) = Ideal for launching projects and building momentum.`,
      explanationKey: 'moon.harmony.waxing_active.explanation',
      recommendation: 'This is excellent timing for starting new ventures and taking action.',
      recommendationKey: 'moon.harmony.waxing_active.recommendation',
    };
  } else if (!isWaxing && isDayReflective) {
    return {
      isAligned: true,
      harmonyLevel: 'perfect',
      explanation: `Waning Moon + ${dayRuler} (reflective planet) = Ideal for completing, releasing, and internal work.`,
      explanationKey: 'moon.harmony.waning_reflective.explanation',
      recommendation: 'Perfect for finishing projects, healing, and deep spiritual work.',
      recommendationKey: 'moon.harmony.waning_reflective.recommendation',
    };
  } else if (isWaxing && isDayReflective) {
    return {
      isAligned: false,
      harmonyLevel: 'challenging',
      explanation: `Waxing Moon wants to build, but ${dayRuler} supports reflection and release. Mixed signals.`,
      explanationKey: 'moon.harmony.waxing_reflective.explanation',
      recommendation: 'You can still act, but be prepared for some inner resistance or need for reflection.',
      recommendationKey: 'moon.harmony.waxing_reflective.recommendation',
    };
  } else if (!isWaxing && isDayActive) {
    return {
      isAligned: false,
      harmonyLevel: 'challenging',
      explanation: `Waning Moon supports release, but ${dayRuler} pushes for action. Misaligned energies.`,
      explanationKey: 'moon.harmony.waning_active.explanation',
      recommendation: 'Push forward if you must, but the day supports completion more than initiation.',
      recommendationKey: 'moon.harmony.waning_active.recommendation',
    };
  } else {
    // Neutral planets (Mercury, neutral relationships)
    return {
      isAligned: true,
      harmonyLevel: 'neutral',
      explanation: `${dayRuler} is neither strongly active nor reflective. The day remains flexible.`,
      explanationKey: 'moon.harmony.neutral.explanation',
      recommendation: 'Both action and reflection are possible. Follow the Moon\'s phase as your guide.',
      recommendationKey: 'moon.harmony.neutral.recommendation',
    };
  }
}

// ============================================================================
// UTILITY EXPORTS
// ============================================================================

/**
 * Get all 8 Moon phases for UI display
 */
export const MOON_PHASES: MoonPhaseName[] = [
  'new',
  'waxing_crescent',
  'first_quarter',
  'waxing_gibbous',
  'full',
  'waning_gibbous',
  'last_quarter',
  'waning_crescent',
];

/**
 * Energy type mapping for filtering
 */
export const MOON_ENERGY_CATEGORIES = {
  building: ['waxing_crescent', 'first_quarter', 'waxing_gibbous'],
  peak: ['full'],
  releasing: ['waning_gibbous', 'last_quarter'],
  rest: ['new', 'waning_crescent'],
};
