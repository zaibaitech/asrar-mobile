/**
 * Daily Guidance Service
 * =======================
 * Real-time spiritual timing guidance based on current astronomical conditions
 * 
 * Always shows current day's guidance regardless of check-in status
 * Uses user's element + today's planetary energy
 */

import { UserProfile } from '@/types/user-profile';

export interface DailyGuidance {
  /** Today's timing quality */
  timingQuality: 'favorable' | 'neutral' | 'delicate' | 'transformative';
  
  /** Day's elemental tone */
  dayElement: 'fire' | 'water' | 'air' | 'earth';
  
  /** User's element (if available) */
  userElement?: 'fire' | 'water' | 'air' | 'earth';
  
  /** Element relationship */
  relationship: 'harmonious' | 'complementary' | 'neutral' | 'transformative';
  
  /** Translation key for the message */
  messageKey: string;
  
  /** Translation params for the message */
  messageParams?: Record<string, string>;
  
  /** Translation keys for best activities */
  bestForKeys: string[];
  
  /** Translation keys for activities to avoid */
  avoidKeys: string[];
  
  /** Recommended hours (translation key or actual text) */
  peakHoursKey?: string;
  
  /** Cycle state */
  cycleState?: string;
}

/**
 * Get real-time daily guidance for the user
 */
export async function getDailyGuidance(profile?: UserProfile): Promise<DailyGuidance> {
  const now = new Date();
  const dayOfWeek = now.getDay();
  
  // Get day's element from planetary ruler
  // Based on traditional Maghribi planetary associations
  const dayElements: Record<number, 'fire' | 'water' | 'air' | 'earth'> = {
    0: 'fire',   // Sunday - Sun (fire)
    1: 'water',  // Monday - Moon (water)
    2: 'fire',   // Tuesday - Mars (fire)
    3: 'air',    // Wednesday - Mercury (air)
    4: 'air',    // Thursday - Jupiter (air)
    5: 'earth',  // Friday - Venus (earth) - CORRECTED from water
    6: 'earth',  // Saturday - Saturn (earth)
  };
  
  const dayElement = dayElements[dayOfWeek];
  const userElement = profile?.derived?.element;
  
  // Calculate element relationship
  const relationship = calculateElementRelationship(userElement, dayElement);
  
  // Get timing quality based on relationship
  let timingQuality: DailyGuidance['timingQuality'] = 'neutral';
  
  if (!userElement) {
    // No user element - show general guidance
    timingQuality = 'neutral';
  } else if (userElement === dayElement) {
    // Perfect alignment
    timingQuality = 'favorable';
  } else if (relationship === 'complementary') {
    // Supportive elements
    timingQuality = 'favorable';
  } else if (relationship === 'transformative') {
    // Opposing elements
    timingQuality = 'transformative';
  }
  
  // Generate guidance message
  const guidance = generateGuidanceMessage(dayElement, userElement, relationship, timingQuality);
  
  return {
    timingQuality,
    dayElement,
    userElement,
    relationship,
    messageKey: guidance.messageKey,
    messageParams: guidance.messageParams,
    bestForKeys: guidance.bestForKeys,
    avoidKeys: guidance.avoidKeys,
    peakHoursKey: guidance.peakHoursKey,
  };
}

/**
 * Calculate relationship between user element and day element
 */
function calculateElementRelationship(
  userElement?: 'fire' | 'water' | 'air' | 'earth',
  dayElement?: 'fire' | 'water' | 'air' | 'earth'
): 'harmonious' | 'complementary' | 'neutral' | 'transformative' {
  if (!userElement || !dayElement) {
    return 'neutral';
  }
  
  // Same element = harmonious
  if (userElement === dayElement) {
    return 'harmonious';
  }
  
  // Complementary pairs (active/yang or receptive/yin)
  const activeElements = new Set(['fire', 'air']);
  const receptiveElements = new Set(['water', 'earth']);
  
  if (
    (activeElements.has(userElement) && activeElements.has(dayElement)) ||
    (receptiveElements.has(userElement) && receptiveElements.has(dayElement))
  ) {
    return 'complementary';
  }
  
  // Opposing pairs = transformative
  const oppositions: Record<string, string> = {
    fire: 'water',
    water: 'fire',
    air: 'earth',
    earth: 'air',
  };
  
  if (oppositions[userElement] === dayElement) {
    return 'transformative';
  }
  
  return 'neutral';
}

/**
 * Generate contextual guidance message
 */
function generateGuidanceMessage(
  dayElement: 'fire' | 'water' | 'air' | 'earth',
  userElement?: 'fire' | 'water' | 'air' | 'earth',
  relationship?: 'harmonious' | 'complementary' | 'neutral' | 'transformative',
  timingQuality?: 'favorable' | 'neutral' | 'delicate' | 'transformative'
): {
  messageKey: string;
  messageParams?: Record<string, string>;
  bestForKeys: string[];
  avoidKeys: string[];
  peakHoursKey?: string;
} {
  const dayOfWeek = new Date().getDay();
  const dayKeys = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayKey = dayKeys[dayOfWeek];
  
  // No user element - generic guidance
  if (!userElement) {
    return getGenericDayGuidance(dayElement, dayKey);
  }
  
  // Harmonious (same element)
  if (relationship === 'harmonious') {
    return getHarmoniousGuidance(dayElement, dayKey);
  }
  
  // Complementary
  if (relationship === 'complementary') {
    return getComplementaryGuidance(userElement, dayElement, dayKey);
  }
  
  // Transformative (opposing)
  if (relationship === 'transformative') {
    return getTransformativeGuidance(userElement, dayElement, dayKey);
  }
  
  // Neutral
  return getNeutralGuidance(dayElement, dayKey);
}

/**
 * Generic day guidance (no user element)
 */
function getGenericDayGuidance(dayElement: string, dayKey: string): {
  messageKey: string;
  messageParams: Record<string, string>;
  bestForKeys: string[];
  avoidKeys: string[];
} {
  return {
    messageKey: `home.dailyGuidanceContent.generic.${dayElement}.message`,
    messageParams: { day: `home.dailyGuidanceDetails.days.${dayKey}` },
    bestForKeys: [0, 1, 2, 3].map(i => `home.dailyGuidanceContent.generic.${dayElement}.bestFor.${i}`),
    avoidKeys: [0, 1, 2].map(i => `home.dailyGuidanceContent.generic.${dayElement}.avoid.${i}`),
  };
}

/**
 * Harmonious guidance (same element)
 */
function getHarmoniousGuidance(element: string, dayKey: string): {
  messageKey: string;
  messageParams: Record<string, string>;
  bestForKeys: string[];
  avoidKeys: string[];
  peakHoursKey: string;
} {
  return {
    messageKey: `home.dailyGuidanceContent.harmonious.${element}.message`,
    messageParams: { day: `home.dailyGuidanceDetails.days.${dayKey}` },
    bestForKeys: [0, 1, 2, 3].map(i => `home.dailyGuidanceContent.harmonious.${element}.bestFor.${i}`),
    avoidKeys: [0, 1, 2].map(i => `home.dailyGuidanceContent.harmonious.${element}.avoid.${i}`),
    peakHoursKey: `home.dailyGuidanceContent.harmonious.${element}.peakHours`,
  };
}

/**
 * Complementary guidance (supportive elements)
 */
function getComplementaryGuidance(userElement: string, dayElement: string, dayKey: string): {
  messageKey: string;
  messageParams: Record<string, string>;
  bestForKeys: string[];
  avoidKeys: string[];
} {
  let typeKey = 'default';
  
  if (userElement === 'fire' && dayElement === 'air') {
    typeKey = 'fireAir';
  } else if (userElement === 'air' && dayElement === 'fire') {
    typeKey = 'airFire';
  } else if (userElement === 'water' && dayElement === 'earth') {
    typeKey = 'waterEarth';
  } else if (userElement === 'earth' && dayElement === 'water') {
    typeKey = 'earthWater';
  }
  
  return {
    messageKey: `home.dailyGuidanceContent.complementary.${typeKey}.message`,
    messageParams: { day: `home.dailyGuidanceDetails.days.${dayKey}` },
    bestForKeys: [0, 1, 2, 3].map(i => `home.dailyGuidanceContent.complementary.${typeKey}.bestFor.${i}`),
    avoidKeys: [0, 1, 2].map(i => `home.dailyGuidanceContent.complementary.${typeKey}.avoid.${i}`),
  };
}

/**
 * Transformative guidance (opposing elements)
 */
function getTransformativeGuidance(userElement: string, dayElement: string, dayKey: string): {
  messageKey: string;
  messageParams: Record<string, string>;
  bestForKeys: string[];
  avoidKeys: string[];
  peakHoursKey: string;
} {
  let typeKey = 'default';
  
  if (userElement === 'fire' && dayElement === 'water') {
    typeKey = 'fireWater';
  } else if (userElement === 'water' && dayElement === 'fire') {
    typeKey = 'waterFire';
  } else if (userElement === 'air' && dayElement === 'earth') {
    typeKey = 'airEarth';
  } else if (userElement === 'earth' && dayElement === 'air') {
    typeKey = 'earthAir';
  }
  
  return {
    messageKey: `home.dailyGuidanceContent.transformative.${typeKey}.message`,
    messageParams: { day: `home.dailyGuidanceDetails.days.${dayKey}` },
    bestForKeys: [0, 1, 2, 3].map(i => `home.dailyGuidanceContent.transformative.${typeKey}.bestFor.${i}`),
    avoidKeys: [0, 1, 2].map(i => `home.dailyGuidanceContent.transformative.${typeKey}.avoid.${i}`),
    peakHoursKey: `home.dailyGuidanceContent.transformative.${typeKey}.peakHours`,
  };
}

/**
 * Neutral guidance
 */
function getNeutralGuidance(dayElement: string, dayKey: string): {
  messageKey: string;
  messageParams: Record<string, string>;
  bestForKeys: string[];
  avoidKeys: string[];
} {
  return {
    messageKey: 'home.dailyGuidanceContent.neutral.message',
    messageParams: { day: `home.dailyGuidanceDetails.days.${dayKey}` },
    bestForKeys: [0, 1, 2, 3].map(i => `home.dailyGuidanceContent.neutral.bestFor.${i}`),
    avoidKeys: [0, 1, 2].map(i => `home.dailyGuidanceContent.neutral.avoid.${i}`),
  };
}
