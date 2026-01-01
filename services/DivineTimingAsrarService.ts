/**
 * Divine Timing Asrār Service
 * ============================
 * Consolidated helper for the refreshed Daily Check-In and Insights flows.
 *
 * Responsibilities:
 * - Planetary day/hour snapshot (Ẓāhir + Bāṭin context)
 * - Element harmony scoring
 * - Intention compatibility tags
 *
 * Design principles:
 * - Deterministic, no randomness
 * - Reflection-focused (never prescriptive)
 * - Translation friendly (returns i18n keys instead of raw prose when possible)
 */

import { computeDivineTiming } from '@/services/DivineTimingService';
import { computeZahirElement } from '@/services/MomentAlignmentService';
import {
    AlignmentQuality,
    calculateTimeWindow,
    CurrentPlanetaryHour,
    detectAlignment,
    ElementAlignment,
    ElementType,
    getCurrentPlanetaryHour,
    TimeWindow,
} from '@/services/ilm-huruf/core';
import {
    DivineTimingResult,
    IntentionCategory,
    UserAbjadResult,
} from '@/types/divine-timing';
import { UserProfile } from '@/types/user-profile';

// ---------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------

export type AsrarElement = 'fire' | 'water' | 'air' | 'earth';
export type PlanetName = 'Sun' | 'Moon' | 'Mars' | 'Mercury' | 'Jupiter' | 'Venus' | 'Saturn';
export type IntentionReadiness = 'aligned' | 'steady' | 'reflect';

type AlignmentElementSource = 'batin' | 'zahir' | 'fallback';

export interface AsrarTimingOptions {
  now?: Date;
  userProfile?: UserProfile | null;
  userAbjad?: UserAbjadResult | null;
  intention?: IntentionCategory | null;
}

export interface AsrarDaySnapshot {
  key: 'sun' | 'moon' | 'mars' | 'mercury' | 'jupiter' | 'venus' | 'saturn';
  englishName: string;
  arabicName: string;
  planet: PlanetName;
  planetArabic: string;
  element: AsrarElement;
  translationKey: string;
}

export interface AsrarAlignmentSnapshot {
  elementUsed: AlignmentElementSource;
  element: AsrarElement;
  alignment: ElementAlignment;
  qualityKey: string;
  descriptionKey: string;
}

export interface AsrarIntentionTag {
  id: string;
  tone: 'support' | 'neutral' | 'caution';
  icon: string;
  labelKey: string;
  descriptionKey: string;
}

export interface AsrarIntentionInsight {
  category: IntentionCategory;
  readiness: IntentionReadiness;
  readinessKey: string;
  icon: string;
  score: number;
  tags: AsrarIntentionTag[];
}

export interface AsrarTimingSnapshot {
  generatedAt: string;
  day: AsrarDaySnapshot;
  cycle: {
    state: DivineTimingResult['cycleState'];
    stateKey: string;
    timingQuality: DivineTimingResult['timingQuality'];
    timingKey: string;
  };
  elements: {
    zahir?: {
      element: AsrarElement;
      translationKey: string;
    };
    batin?: {
      element: AsrarElement;
      translationKey: string;
    };
    alignment: AsrarAlignmentSnapshot;
  };
  hour: {
    raw: CurrentPlanetaryHour;
    element: AsrarElement;
    closesIn: TimeWindow['closesIn'];
    closesInMinutes: TimeWindow['closesInMinutes'];
    nextWindowIn: TimeWindow['nextWindowIn'];
    urgency: TimeWindow['urgency'];
    nextWindow: TimeWindow['nextWindow'];
    translationKey: string;
  };
  intention?: AsrarIntentionInsight;
}

// ---------------------------------------------------------------------------
// CONSTANTS & HELPERS
// ---------------------------------------------------------------------------

const FALLBACK_ABJAD: UserAbjadResult = {
  kabir: 786,
  saghir: 3,
  hadad: 2,
  dominantElement: 'fire',
};

type DayMetadataKey = AsrarDaySnapshot['key'];

interface DayMetadata extends Omit<AsrarDaySnapshot, 'translationKey'> {
  translationKey: string;
}

const DAY_METADATA: Record<number, DayMetadata> = {
  0: {
    key: 'sun',
    englishName: 'Sunday',
    arabicName: 'الأحد',
    planet: 'Sun',
    planetArabic: 'الشمس',
    element: 'fire',
    translationKey: 'dailyCheckIn.days.sun.title',
  },
  1: {
    key: 'moon',
    englishName: 'Monday',
    arabicName: 'الإثنين',
    planet: 'Moon',
    planetArabic: 'القمر',
    element: 'water',
    translationKey: 'dailyCheckIn.days.moon.title',
  },
  2: {
    key: 'mars',
    englishName: 'Tuesday',
    arabicName: 'الثلاثاء',
    planet: 'Mars',
    planetArabic: 'المريخ',
    element: 'fire',
    translationKey: 'dailyCheckIn.days.mars.title',
  },
  3: {
    key: 'mercury',
    englishName: 'Wednesday',
    arabicName: 'الأربعاء',
    planet: 'Mercury',
    planetArabic: 'عطارد',
    element: 'air',
    translationKey: 'dailyCheckIn.days.mercury.title',
  },
  4: {
    key: 'jupiter',
    englishName: 'Thursday',
    arabicName: 'الخميس',
    planet: 'Jupiter',
    planetArabic: 'المشتري',
    element: 'air',
    translationKey: 'dailyCheckIn.days.jupiter.title',
  },
  5: {
    key: 'venus',
    englishName: 'Friday',
    arabicName: 'الجمعة',
    planet: 'Venus',
    planetArabic: 'الزهرة',
    element: 'water',
    translationKey: 'dailyCheckIn.days.venus.title',
  },
  6: {
    key: 'saturn',
    englishName: 'Saturday',
    arabicName: 'السبت',
    planet: 'Saturn',
    planetArabic: 'زحل',
    element: 'earth',
    translationKey: 'dailyCheckIn.days.saturn.title',
  },
};

const ALIGNMENT_LABEL_KEYS: Record<AlignmentQuality, string> = {
  perfect: 'dailyCheckIn.alignment.labels.perfect',
  strong: 'dailyCheckIn.alignment.labels.strong',
  moderate: 'dailyCheckIn.alignment.labels.moderate',
  weak: 'dailyCheckIn.alignment.labels.moderate',
  opposing: 'dailyCheckIn.alignment.labels.opposing',
};

const ALIGNMENT_DESCRIPTION_KEYS: Record<AlignmentQuality, string> = {
  perfect: 'dailyCheckIn.alignment.descriptions.perfect',
  strong: 'dailyCheckIn.alignment.descriptions.strong',
  moderate: 'dailyCheckIn.alignment.descriptions.moderate',
  weak: 'dailyCheckIn.alignment.descriptions.moderate',
  opposing: 'dailyCheckIn.alignment.descriptions.opposing',
};

const CYCLE_STATE_KEYS: Record<DivineTimingResult['cycleState'], string> = {
  'initiation': 'dailyCheckIn.cycle.initiation',
  'growth / expansion': 'dailyCheckIn.cycle.growth',
  'review / restraint': 'dailyCheckIn.cycle.review',
  'completion / closure': 'dailyCheckIn.cycle.completion',
};

const TIMING_QUALITY_KEYS: Record<DivineTimingResult['timingQuality'], string> = {
  favorable: 'dailyCheckIn.timing.favorable',
  neutral: 'dailyCheckIn.timing.neutral',
  delicate: 'dailyCheckIn.timing.delicate',
};

const URGENCY_KEYS: Record<TimeWindow['urgency'], string> = {
  high: 'dailyCheckIn.actionWindow.urgency.high',
  medium: 'dailyCheckIn.actionWindow.urgency.medium',
  low: 'dailyCheckIn.actionWindow.urgency.low',
};

const INTENTION_AFFINITY: Record<IntentionCategory, AsrarElement[]> = {
  start: ['fire', 'air'],
  travel: ['air', 'fire'],
  communication: ['air', 'fire'],
  relationship: ['water', 'earth'],
  study: ['air', 'earth'],
  rest: ['water', 'earth'],
  custom: ['fire', 'water', 'air', 'earth'],
};

const INTENTION_READINESS_KEYS: Record<IntentionReadiness, { label: string; icon: string }> = {
  aligned: {
    label: 'dailyCheckIn.intention.readiness.aligned',
    icon: '✨',
  },
  steady: {
    label: 'dailyCheckIn.intention.readiness.steady',
    icon: '🌗',
  },
  reflect: {
    label: 'dailyCheckIn.intention.readiness.reflect',
    icon: '🌙',
  },
};

const INTENTION_TAGS: Record<string, AsrarIntentionTag> = {
  flowing: {
    id: 'flowing',
    tone: 'support',
    icon: '🌊',
    labelKey: 'dailyCheckIn.intention.tags.flowing',
    descriptionKey: 'dailyCheckIn.intention.descriptions.flowing',
  },
  steady: {
    id: 'steady',
    tone: 'neutral',
    icon: '⚖️',
    labelKey: 'dailyCheckIn.intention.tags.steady',
    descriptionKey: 'dailyCheckIn.intention.descriptions.steady',
  },
  reflect: {
    id: 'reflect',
    tone: 'caution',
    icon: '🌓',
    labelKey: 'dailyCheckIn.intention.tags.reflect',
    descriptionKey: 'dailyCheckIn.intention.descriptions.reflect',
  },
  hourOpen: {
    id: 'hourOpen',
    tone: 'support',
    icon: '🕰️',
    labelKey: 'dailyCheckIn.intention.tags.hourOpen',
    descriptionKey: 'dailyCheckIn.intention.descriptions.hourOpen',
  },
  hourNext: {
    id: 'hourNext',
    tone: 'neutral',
    icon: '🪐',
    labelKey: 'dailyCheckIn.intention.tags.hourNext',
    descriptionKey: 'dailyCheckIn.intention.descriptions.hourNext',
  },
};

function toElementType(element: AsrarElement | null | undefined): ElementType {
  const map: Record<AsrarElement, ElementType> = {
    fire: 'Fire',
    water: 'Water',
    air: 'Air',
    earth: 'Earth',
  };
  if (!element) return 'Fire';
  return map[element];
}

function toAsrarElement(element: ElementType | AsrarElement | null | undefined): AsrarElement | null {
  if (!element) return null;
  const lower = element.toString().toLowerCase();
  if (lower === 'fire' || lower === 'water' || lower === 'air' || lower === 'earth') {
    return lower;
  }
  return null;
}

function resolveZahirElement(profile?: UserProfile | null): AsrarElement | null {
  if (!profile) return null;
  const name = profile.nameAr || profile.nameLatin;
  if (!name || name.trim().length === 0) return null;
  try {
    return computeZahirElement(name.trim());
  } catch (error) {
    if (__DEV__) {
      console.warn('[DivineTimingAsrar] Failed to compute Ẓāhir element:', error);
    }
    return null;
  }
}

function resolveBatinElement(
  profile?: UserProfile | null,
  userAbjad?: UserAbjadResult | null
): AsrarElement | null {
  if (profile?.derived?.element) {
    return profile.derived.element;
  }
  if (userAbjad?.dominantElement) {
    return userAbjad.dominantElement;
  }
  return null;
}

function resolveAlignmentElement(
  batin: AsrarElement | null,
  zahir: AsrarElement | null
): { element: AsrarElement; source: AlignmentElementSource } {
  if (batin) {
    return { element: batin, source: 'batin' };
  }
  if (zahir) {
    return { element: zahir, source: 'zahir' };
  }
  return { element: FALLBACK_ABJAD.dominantElement, source: 'fallback' };
}

function buildAlignmentSnapshot(
  selectedElement: AsrarElement,
  source: AlignmentElementSource,
  hour: CurrentPlanetaryHour
): AsrarAlignmentSnapshot {
  const alignment = detectAlignment(toElementType(selectedElement), hour.element);
  return {
    elementUsed: source,
    element: selectedElement,
    alignment,
    qualityKey: ALIGNMENT_LABEL_KEYS[alignment.quality],
    descriptionKey: ALIGNMENT_DESCRIPTION_KEYS[alignment.quality],
  };
}

function clampScore(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  return Math.max(min, Math.min(max, value));
}

function scoreIntentionCompatibility(
  category: IntentionCategory,
  alignment: ElementAlignment,
  dayElement: AsrarElement,
  hourElement: AsrarElement,
  alignmentSource: AlignmentElementSource,
  timeWindow: TimeWindow
): AsrarIntentionInsight {
  const baseScore = alignment.harmonyScore; // 25 - 100
  const preferences = INTENTION_AFFINITY[category] ?? INTENTION_AFFINITY.custom;
  let score = baseScore;

  if (preferences.includes(dayElement)) {
    score += 6;
  }
  if (preferences.includes(hourElement)) {
    score += 4;
  }
  if (alignmentSource === 'zahir') {
    score -= 4; // slight reduction when relying on fallback element
  }

  score = clampScore(score, 20, 100);

  let readiness: IntentionReadiness;
  if (score >= 80) {
    readiness = 'aligned';
  } else if (score >= 55) {
    readiness = 'steady';
  } else {
    readiness = 'reflect';
  }

  const tags: AsrarIntentionTag[] = [];

  if (readiness === 'aligned') {
    tags.push(INTENTION_TAGS.flowing);
    const hourTag = timeWindow.urgency === 'high' ? INTENTION_TAGS.hourOpen : INTENTION_TAGS.hourNext;
    tags.push(hourTag);
  } else if (readiness === 'steady') {
    tags.push(INTENTION_TAGS.steady);
    tags.push(INTENTION_TAGS.hourNext);
  } else {
    tags.push(INTENTION_TAGS.reflect);
    if (timeWindow.urgency === 'high') {
      tags.push(INTENTION_TAGS.hourNext);
    } else {
      tags.push(INTENTION_TAGS.hourOpen);
    }
  }

  const readinessMeta = INTENTION_READINESS_KEYS[readiness];

  return {
    category,
    readiness,
    readinessKey: readinessMeta.label,
    icon: readinessMeta.icon,
    score,
    tags,
  };
}

// ---------------------------------------------------------------------------
// PUBLIC API
// ---------------------------------------------------------------------------

export function buildAsrarTimingSnapshot(options: AsrarTimingOptions = {}): AsrarTimingSnapshot {
  const now = options.now ? new Date(options.now) : new Date();
  const dayOfWeek = now.getDay();
  const dayMetadata = DAY_METADATA[dayOfWeek];
  const userAbjad = options.userAbjad ?? FALLBACK_ABJAD;
  const profile = options.userProfile;

  const zahirElement = resolveZahirElement(profile);
  const batinElement = resolveBatinElement(profile, userAbjad);
  const { element: alignmentElement, source: alignmentSource } = resolveAlignmentElement(
    batinElement,
    zahirElement
  );

  const hour = getCurrentPlanetaryHour(now);
  const hourElement = toAsrarElement(hour.element) ?? dayMetadata.element;
  const alignmentSnapshot = buildAlignmentSnapshot(alignmentElement, alignmentSource, hour);

  const timeWindow = calculateTimeWindow(hour, toElementType(alignmentElement));

  const cycleResult = computeDivineTiming({
    userAbjadResult: userAbjad,
    currentDate: {
      dayOfWeek,
      date: now.toISOString().split('T')[0],
    },
    userIntentionCategory: options.intention ?? 'custom',
  });

  const snapshot: AsrarTimingSnapshot = {
    generatedAt: now.toISOString(),
    day: dayMetadata,
    cycle: {
      state: cycleResult.cycleState,
      stateKey: CYCLE_STATE_KEYS[cycleResult.cycleState],
      timingQuality: cycleResult.timingQuality,
      timingKey: TIMING_QUALITY_KEYS[cycleResult.timingQuality],
    },
    elements: {
      zahir: zahirElement
        ? {
            element: zahirElement,
            translationKey: `dailyCheckIn.elements.zahir.${zahirElement}`,
          }
        : undefined,
      batin: batinElement
        ? {
            element: batinElement,
            translationKey: `dailyCheckIn.elements.batin.${batinElement}`,
          }
        : undefined,
      alignment: alignmentSnapshot,
    },
    hour: {
      raw: hour,
      element: hourElement,
      closesIn: timeWindow.closesIn,
      closesInMinutes: timeWindow.closesInMinutes,
      nextWindowIn: timeWindow.nextWindowIn,
      urgency: timeWindow.urgency,
      nextWindow: timeWindow.nextWindow,
      translationKey: URGENCY_KEYS[timeWindow.urgency],
    },
  };

  if (options.intention) {
    snapshot.intention = scoreIntentionCompatibility(
      options.intention,
      alignmentSnapshot.alignment,
      dayMetadata.element,
      hourElement,
      alignmentSnapshot.elementUsed,
      timeWindow
    );
  }

  return snapshot;
}
