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
  
  /** Short guidance message */
  message: string;
  
  /** Best activities for today */
  bestFor: string[];
  
  /** Activities to avoid */
  avoid: string[];
  
  /** Recommended hours */
  peakHours?: string;
  
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
  const dayElements: Record<number, 'fire' | 'water' | 'air' | 'earth'> = {
    0: 'fire',   // Sunday - Sun
    1: 'water',  // Monday - Moon
    2: 'fire',   // Tuesday - Mars
    3: 'air',    // Wednesday - Mercury
    4: 'air',    // Thursday - Jupiter
    5: 'water',  // Friday - Venus
    6: 'earth',  // Saturday - Saturn
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
    message: guidance.message,
    bestFor: guidance.bestFor,
    avoid: guidance.avoid,
    peakHours: guidance.peakHours,
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
  message: string;
  bestFor: string[];
  avoid: string[];
  peakHours?: string;
} {
  const dayNames: Record<number, string> = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
  };
  
  const dayOfWeek = new Date().getDay();
  const dayName = dayNames[dayOfWeek];
  
  // No user element - generic guidance
  if (!userElement) {
    return getGenericDayGuidance(dayElement, dayName);
  }
  
  // Harmonious (same element)
  if (relationship === 'harmonious') {
    return getHarmoniousGuidance(dayElement, dayName);
  }
  
  // Complementary
  if (relationship === 'complementary') {
    return getComplementaryGuidance(userElement, dayElement, dayName);
  }
  
  // Transformative (opposing)
  if (relationship === 'transformative') {
    return getTransformativeGuidance(userElement, dayElement, dayName);
  }
  
  // Neutral
  return getNeutralGuidance(dayElement, dayName);
}

/**
 * Generic day guidance (no user element)
 */
function getGenericDayGuidance(dayElement: string, dayName: string): {
  message: string;
  bestFor: string[];
  avoid: string[];
} {
  const elementGuidance: Record<string, any> = {
    fire: {
      message: `${dayName}'s Fire energy brings vitality and action. A day for initiative and creative expression.`,
      bestFor: ['New beginnings', 'Creative projects', 'Leadership', 'Physical activity'],
      avoid: ['Impulsive decisions', 'Conflict', 'Overexertion'],
    },
    water: {
      message: `${dayName}'s Water energy brings flow and intuition. A day for emotional connection and reflection.`,
      bestFor: ['Emotional healing', 'Intuitive work', 'Relationships', 'Spiritual practices'],
      avoid: ['Major decisions', 'Rigid planning', 'Overanalysis'],
    },
    air: {
      message: `${dayName}'s Air energy brings clarity and communication. A day for learning and intellectual pursuits.`,
      bestFor: ['Study', 'Communication', 'Planning', 'Social connection'],
      avoid: ['Heavy emotions', 'Isolation', 'Rushed decisions'],
    },
    earth: {
      message: `${dayName}'s Earth energy brings grounding and stability. A day for practical work and building foundations.`,
      bestFor: ['Practical tasks', 'Financial planning', 'Health routines', 'Building'],
      avoid: ['Major changes', 'Risk-taking', 'Neglecting basics'],
    },
  };
  
  return elementGuidance[dayElement];
}

/**
 * Harmonious guidance (same element)
 */
function getHarmoniousGuidance(element: string, dayName: string): {
  message: string;
  bestFor: string[];
  avoid: string[];
  peakHours?: string;
} {
  const harmonious: Record<string, any> = {
    fire: {
      message: `Powerful alignment! Your Fire nature resonates perfectly with ${dayName}'s solar energy. Channel this intensity with clear intention.`,
      bestFor: ['Bold action', 'Leadership', 'Breakthrough', 'Transformation'],
      avoid: ['Burnout', 'Aggression', 'Impatience'],
      peakHours: 'Morning to Midday',
    },
    water: {
      message: `Deep harmony! Your Water element flows with ${dayName}'s lunar energy. Trust your intuition and emotional wisdom.`,
      bestFor: ['Healing', 'Intuitive work', 'Deep connection', 'Spiritual reflection'],
      avoid: ['Overthinking', 'Isolation', 'Emotional overwhelm'],
      peakHours: 'Evening to Night',
    },
    air: {
      message: `Clear alignment! Your Air nature dances with ${dayName}'s mercurial energy. Perfect for mental clarity and communication.`,
      bestFor: ['Learning', 'Teaching', 'Writing', 'Strategy'],
      avoid: ['Scattered focus', 'Overcommitment', 'Superficiality'],
      peakHours: 'Morning to Afternoon',
    },
    earth: {
      message: `Solid foundation! Your Earth element grounds ${dayName}'s stable energy. Build with patience and practical wisdom.`,
      bestFor: ['Building', 'Health routines', 'Financial planning', 'Consistency'],
      avoid: ['Stubbornness', 'Resistance to change', 'Overwork'],
      peakHours: 'Afternoon to Evening',
    },
  };
  
  return harmonious[element];
}

/**
 * Complementary guidance (supportive elements)
 */
function getComplementaryGuidance(userElement: string, dayElement: string, dayName: string): {
  message: string;
  bestFor: string[];
  avoid: string[];
} {
  if (userElement === 'fire' && dayElement === 'air') {
    return {
      message: `Air fans your Fire! ${dayName}'s energy amplifies your natural vitality. Channel this synergy wisely.`,
      bestFor: ['Creative expression', 'Communication', 'Innovation', 'Social leadership'],
      avoid: ['Scattered energy', 'Overcommitment', 'Impulsiveness'],
    };
  }
  
  if (userElement === 'air' && dayElement === 'fire') {
    return {
      message: `Fire energizes your Air! ${dayName} brings passion to your ideas. Clarity meets action.`,
      bestFor: ['Strategic action', 'Public speaking', 'Problem-solving', 'Teaching'],
      avoid: ['Analysis paralysis', 'Overexcitement', 'Hasty decisions'],
    };
  }
  
  if (userElement === 'water' && dayElement === 'earth') {
    return {
      message: `Earth contains your Water! ${dayName} provides structure for your flow. Intuition meets form.`,
      bestFor: ['Grounded healing', 'Practical spirituality', 'Building routines', 'Nurturing'],
      avoid: ['Stagnation', 'Over-caution', 'Suppressing emotions'],
    };
  }
  
  if (userElement === 'earth' && dayElement === 'water') {
    return {
      message: `Water nourishes your Earth! ${dayName}'s emotional energy softens your grounding. Stability meets flow.`,
      bestFor: ['Gentle progress', 'Emotional work', 'Creativity', 'Compassion'],
      avoid: ['Rigidity', 'Over-planning', 'Neglecting intuition'],
    };
  }
  
  return {
    message: `Supportive energies today. ${dayName} complements your natural element.`,
    bestFor: ['Balanced action', 'Integration', 'Steady progress'],
    avoid: ['Extremes', 'Forcing outcomes'],
  };
}

/**
 * Transformative guidance (opposing elements)
 */
function getTransformativeGuidance(userElement: string, dayElement: string, dayName: string): {
  message: string;
  bestFor: string[];
  avoid: string[];
  peakHours?: string;
} {
  if (userElement === 'fire' && dayElement === 'water') {
    return {
      message: `Transformative tension. Your Fire meets ${dayName}'s Water energy. This opposition creates steam - powerful transformation potential.`,
      bestFor: ['Breakthrough', 'Letting go', 'Spiritual cleansing', 'Deep healing'],
      avoid: ['Impulsive reactions', 'Emotional decisions', 'Forcing outcomes'],
      peakHours: 'Evening (21:00-04:00)',
    };
  }
  
  if (userElement === 'water' && dayElement === 'fire') {
    return {
      message: `Dynamic opposition. Your Water meets ${dayName}'s Fire energy. Navigate with awareness - transformation awaits.`,
      bestFor: ['Emotional alchemy', 'Creative breakthrough', 'Shadow work', 'Purification'],
      avoid: ['Reactivity', 'Overwhelm', 'Hasty action'],
      peakHours: 'Pre-Dawn (04:00-06:00) & Night (21:00-04:00)',
    };
  }
  
  if (userElement === 'air' && dayElement === 'earth') {
    return {
      message: `Grounding challenge. Your Air meets ${dayName}'s Earth energy. Slow down and anchor your insights.`,
      bestFor: ['Bringing ideas to form', 'Practical application', 'Discipline', 'Patience'],
      avoid: ['Mental resistance', 'Rushing', 'Avoiding embodiment'],
      peakHours: 'Afternoon (14:00-18:00)',
    };
  }
  
  if (userElement === 'earth' && dayElement === 'air') {
    return {
      message: `Elevating tension. Your Earth meets ${dayName}'s Air energy. Let yourself be lifted into new perspectives.`,
      bestFor: ['New viewpoints', 'Learning', 'Flexibility', 'Mental expansion'],
      avoid: ['Stubbornness', 'Over-attachment', 'Resistance to change'],
      peakHours: 'Morning (06:00-10:00)',
    };
  }
  
  return {
    message: `Transformative day. Navigate opposing energies with awareness and intention.`,
    bestFor: ['Transformation', 'Growth', 'Breakthrough'],
    avoid: ['Reactivity', 'Resistance', 'Forcing'],
  };
}

/**
 * Neutral guidance
 */
function getNeutralGuidance(dayElement: string, dayName: string): {
  message: string;
  bestFor: string[];
  avoid: string[];
} {
  return {
    message: `Balanced energies today. ${dayName} offers steady ground for mindful action.`,
    bestFor: ['Routine tasks', 'Consistent effort', 'Observation', 'Balance'],
    avoid: ['Extremes', 'Major changes', 'Overexertion'],
  };
}
