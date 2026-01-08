/**
 * Divine Timing Service
 * =====================
 * Provides spiritual timing reflection based on Maghribī ʿIlm al-Ḥurūf system
 * 
 * IMPORTANT PRINCIPLES:
 * - Purely deterministic calculations (no randomness)
 * - Reflective guidance only (NOT predictive)
 * - Does NOT replace prayer, istikhārah, or religious advice
 * - Never provides yes/no answers
 * - Never predicts outcomes
 * 
 * @module DivineTimingService
 */

import {
    CycleState,
    DivineTimingInput,
    DivineTimingResult,
    ElementalTone,
    GuidanceLevel,
    IntentionCategory,
    TimingQuality
} from '@/types/divine-timing';

// ============================================================================
// CONSTANTS & MAPPINGS
// ============================================================================

/**
 * Map Hadad value (0-3) to Cycle State
 */
const HADAD_TO_CYCLE_STATE: Record<number, CycleState> = {
  0: 'completion / closure',
  1: 'initiation',
  2: 'growth / expansion',
  3: 'review / restraint',
};

/**
 * Map day of week to elemental tone
 * Based on traditional Maghribi planetary-element associations
 * 
 * 0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday
 */
const DAY_TO_ELEMENT: Record<number, ElementalTone> = {
  0: 'fire',   // Sunday - Sun (fire)
  1: 'water',  // Monday - Moon (water)
  2: 'fire',   // Tuesday - Mars (fire)
  3: 'air',    // Wednesday - Mercury (air)
  4: 'air',    // Thursday - Jupiter (air)
  5: 'earth',  // Friday - Venus (earth) - CORRECTED from water
  6: 'earth',  // Saturday - Saturn (earth)
};

/**
 * Intention categories that favor action
 */
const ACTION_INTENTIONS: IntentionCategory[] = [
  'start',
  'communication',
  'study',
];

/**
 * Intention categories that favor caution
 */
const DELICATE_INTENTIONS: IntentionCategory[] = [
  'travel',
  'relationship',
];

/**
 * Cycle states that favor action
 */
const ACTION_CYCLES: CycleState[] = [
  'initiation',
  'growth / expansion',
];

/**
 * Cycle states that favor reflection
 */
const REFLECTION_CYCLES: CycleState[] = [
  'completion / closure',
  'review / restraint',
];

// ============================================================================
// CORE CALCULATION FUNCTIONS
// ============================================================================

/**
 * Determine cycle state from Hadad value
 * 
 * @param hadad - Hadad value (0-3, from kabir % 4)
 * @returns Cycle state description
 */
function getCycleState(hadad: number): CycleState {
  const normalizedHadad = hadad % 4;
  return HADAD_TO_CYCLE_STATE[normalizedHadad];
}

/**
 * Get elemental tone for the day
 * 
 * @param dayOfWeek - Day of week (0-6)
 * @returns Element for the day
 */
function getDayElement(dayOfWeek: number): ElementalTone {
  return DAY_TO_ELEMENT[dayOfWeek % 7];
}

/**
 * Check if two elements are complementary
 * Fire ↔ Air are active/yang
 * Water ↔ Earth are receptive/yin
 */
function areElementsComplementary(
  element1: ElementalTone,
  element2: ElementalTone
): boolean {
  const activeElements = new Set<ElementalTone>(['fire', 'air']);
  const receptiveElements = new Set<ElementalTone>(['water', 'earth']);
  
  return (
    (activeElements.has(element1) && activeElements.has(element2)) ||
    (receptiveElements.has(element1) && receptiveElements.has(element2))
  );
}

/**
 * Check if elements are in tension
 * Fire ↔ Water oppose
 * Air ↔ Earth oppose
 */
function areElementsInTension(
  element1: ElementalTone,
  element2: ElementalTone
): boolean {
  const oppositions: Record<ElementalTone, ElementalTone> = {
    fire: 'water',
    water: 'fire',
    air: 'earth',
    earth: 'air',
  };
  
  return oppositions[element1] === element2;
}

/**
 * Calculate timing quality based on all factors
 * 
 * Uses deterministic rules to assess whether conditions are:
 * - favorable: Elements align, cycle supports intention
 * - neutral: Mixed signals or balanced conditions
 * - delicate: Tensions present, proceed with care
 */
function calculateTimingQuality(
  cycleState: CycleState,
  dominantElement: ElementalTone,
  dayElement: ElementalTone,
  intentionCategory: IntentionCategory
): TimingQuality {
  let favorablePoints = 0;
  let delicatePoints = 0;
  
  // Factor 1: Elemental harmony
  if (dominantElement === dayElement) {
    favorablePoints += 2; // Perfect alignment
  } else if (areElementsComplementary(dominantElement, dayElement)) {
    favorablePoints += 1; // Supportive
  } else if (areElementsInTension(dominantElement, dayElement)) {
    delicatePoints += 2; // Tension
  }
  
  // Factor 2: Cycle-Intention alignment
  if (ACTION_INTENTIONS.includes(intentionCategory)) {
    if (ACTION_CYCLES.includes(cycleState)) {
      favorablePoints += 1;
    } else if (REFLECTION_CYCLES.includes(cycleState)) {
      delicatePoints += 1;
    }
  } else if (DELICATE_INTENTIONS.includes(intentionCategory)) {
    // Travel and relationships benefit from stable cycles
    if (cycleState === 'growth / expansion') {
      favorablePoints += 1;
    } else if (cycleState === 'initiation') {
      delicatePoints += 1; // Too early
    }
  }
  
  // Factor 3: Rest intention always neutral to favorable
  if (intentionCategory === 'rest') {
    if (REFLECTION_CYCLES.includes(cycleState)) {
      favorablePoints += 1;
    }
  }
  
  // Determine overall quality
  if (favorablePoints >= 2 && delicatePoints === 0) {
    return 'favorable';
  } else if (delicatePoints >= 2) {
    return 'delicate';
  } else {
    return 'neutral';
  }
}

/**
 * Determine guidance level based on timing quality and cycle
 */
function getGuidanceLevel(
  timingQuality: TimingQuality,
  cycleState: CycleState
): GuidanceLevel {
  // Favorable timing
  if (timingQuality === 'favorable') {
    if (ACTION_CYCLES.includes(cycleState)) {
      return 'act';
    } else {
      return 'slow';
    }
  }
  
  // Delicate timing
  if (timingQuality === 'delicate') {
    return 'observe';
  }
  
  // Neutral timing
  if (ACTION_CYCLES.includes(cycleState)) {
    return 'slow';
  } else {
    return 'observe';
  }
}

/**
 * Generate reflective message based on all factors
 * 
 * RULES:
 * - Never say "yes" or "no"
 * - Never predict outcomes
 * - Never use certainty language about the future
 * - Keep language reflective and optional
 * 
 * Returns both the English message (for backwards compatibility) and translation keys
 */
function generateMessage(
  timingQuality: TimingQuality,
  cycleState: CycleState,
  guidanceLevel: GuidanceLevel,
  intentionCategory: IntentionCategory,
  dominantElement: ElementalTone,
  dayElement: ElementalTone
): { message: string; qualityKey: string; cycleKey: string } {
  // Base messages by timing quality
  const qualityMessages: Record<TimingQuality, string[]> = {
    favorable: [
      'Conditions appear supportive for reflection and considered action.',
      'Energy flows align with thoughtful engagement today.',
      'The day invites mindful participation in your intentions.',
    ],
    neutral: [
      'A balanced day for measured steps and observation.',
      'Energy suggests proceeding with awareness and flexibility.',
      'Conditions favor deliberate thought over hasty action.',
    ],
    delicate: [
      'Energy favors reflection over decisive action today.',
      'Consider observing patterns before committing to major steps.',
      'The day calls for patience and contemplative awareness.',
    ],
  };
  
  // Translation keys for quality messages
  const qualityKeys: Record<TimingQuality, string[]> = {
    favorable: [
      'supportive_reflection',
      'energy_flows_align',
      'mindful_participation',
    ],
    neutral: [
      'balanced_measured',
      'awareness_flexibility',
      'deliberate_thought',
    ],
    delicate: [
      'favor_reflection',
      'observe_patterns',
      'patience_awareness',
    ],
  };
  
  // Cycle-specific additions
  const cycleAdditions: Record<CycleState, string> = {
    'initiation': 'New beginnings may be contemplated.',
    'growth / expansion': 'Ongoing efforts may be nurtured.',
    'review / restraint': 'Reflection and assessment are highlighted.',
    'completion / closure': 'Endings and transitions invite attention.',
  };
  
  // Cycle translation keys
  const cycleKeys: Record<CycleState, string> = {
    'initiation': 'new_beginnings',
    'growth / expansion': 'ongoing_efforts',
    'review / restraint': 'reflection_assessment',
    'completion / closure': 'endings_transitions',
  };
  
  // Select base message (deterministic based on intention)
  const baseOptions = qualityMessages[timingQuality];
  const baseIndex = intentionCategory.length % baseOptions.length;
  const baseMessage = baseOptions[baseIndex];
  
  // Select translation key
  const keyOptions = qualityKeys[timingQuality];
  const qualityKey = keyOptions[baseIndex];
  
  // Add cycle context
  const cycleNote = cycleAdditions[cycleState];
  const cycleKey = cycleKeys[cycleState];
  
  // Combine
  return {
    message: `${baseMessage} ${cycleNote}`,
    qualityKey,
    cycleKey,
  };
}

// ============================================================================
// MAIN SERVICE FUNCTION
// ============================================================================

/**
 * Compute Divine Timing reflection for the given inputs
 * 
 * This is a pure, deterministic function. Same inputs always produce same outputs.
 * 
 * @param input - User Abjad results, date, and intention
 * @returns Divine Timing reflection result
 * 
 * @example
 * const result = computeDivineTiming({
 *   userAbjadResult: { kabir: 786, saghir: 3, hadad: 2, dominantElement: 'fire' },
 *   currentDate: { dayOfWeek: 1, date: '2025-12-26' },
 *   userIntentionCategory: 'start'
 * });
 */
export function computeDivineTiming(input: DivineTimingInput): DivineTimingResult {
  const { userAbjadResult, currentDate, userIntentionCategory } = input;
  
  // Step 1: Determine cycle state from Hadad
  const cycleState = getCycleState(userAbjadResult.hadad);
  
  // Step 2: Get day element
  const dayElement = getDayElement(currentDate.dayOfWeek);
  
  // Step 3: Determine elemental tone (use day element as primary tone)
  const elementalTone = dayElement;
  
  // Step 4: Calculate timing quality
  const timingQuality = calculateTimingQuality(
    cycleState,
    userAbjadResult.dominantElement,
    dayElement,
    userIntentionCategory
  );
  
  // Step 5: Determine guidance level
  const guidanceLevel = getGuidanceLevel(timingQuality, cycleState);
  
  // Step 6: Generate reflective message
  const messageData = generateMessage(
    timingQuality,
    cycleState,
    guidanceLevel,
    userIntentionCategory,
    userAbjadResult.dominantElement,
    dayElement
  );
  
  // Return complete result
  return {
    timingQuality,
    cycleState,
    elementalTone,
    guidanceLevel,
    shortMessage: messageData.message,
    messageKeys: {
      qualityKey: messageData.qualityKey,
      cycleKey: messageData.cycleKey,
    },
    context: {
      hadad: userAbjadResult.hadad,
      dominantElement: userAbjadResult.dominantElement,
      dayElement,
      intentionCategory: userIntentionCategory,
    },
  };
}

// ============================================================================
// HELPER FUNCTIONS FOR UI
// ============================================================================

/**
 * Get display icon for timing quality
 */
export function getTimingQualityIcon(quality: TimingQuality): string {
  const icons: Record<TimingQuality, string> = {
    favorable: '✨',
    neutral: '⚖️',
    delicate: '🌙',
  };
  return icons[quality];
}

/**
 * Get display color for timing quality
 */
export function getTimingQualityColor(quality: TimingQuality): string {
  const colors: Record<TimingQuality, string> = {
    favorable: '#4CAF50', // Green
    neutral: '#64B5F6',   // Blue
    delicate: '#FFB74D',  // Amber
  };
  return colors[quality];
}

/**
 * Get display icon for element
 */
export function getElementIcon(element: ElementalTone): string {
  const icons: Record<ElementalTone, string> = {
    fire: '🔥',
    water: '💧',
    air: '🌬️',
    earth: '🌱',
  };
  return icons[element];
}

/**
 * Get display color for element
 */
export function getElementColor(element: ElementalTone): string {
  const colors: Record<ElementalTone, string> = {
    fire: '#FF5722',   // Red-Orange
    water: '#2196F3',  // Blue
    air: '#FFC107',    // Yellow
    earth: '#795548',  // Brown
  };
  return colors[element];
}

/**
 * Get intention category display name
 */
export function getIntentionDisplayName(category: IntentionCategory): string {
  const names: Record<IntentionCategory, string> = {
    start: 'New Beginning',
    travel: 'Journey',
    communication: 'Communication',
    relationship: 'Connection',
    study: 'Learning',
    rest: 'Rest & Recovery',
    custom: 'General Reflection',
  };
  return names[category];
}

/**
 * Standard disclaimer text
 */
export const DIVINE_TIMING_DISCLAIMER = 
  'This guidance is for spiritual reflection only and does not replace prayer, istikhārah, or qualified religious advice.';
