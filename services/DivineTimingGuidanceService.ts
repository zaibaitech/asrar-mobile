/**
 * Divine Timing Guidance Service
 * ===============================
 * Phase 3: Deterministic guidance generation
 * 
 * IMPORTANT: This is reflection and guidance only.
 * NOT fatwa, NOT tafsir, NOT fortune-telling, NOT certainty.
 */

import { resolveZodiacKey, ZODIAC_IDENTITY_MAP } from '@/constants/identityMaps';
import { ElementalTone, TimingQuality } from '@/types/divine-timing';
import {
    GuidanceCategory,
    GuidanceInput,
    GuidanceResponse,
    TimeHorizon,
    UrgencyLevel,
} from '@/types/divine-timing-guidance';

/**
 * Summary titles by timing quality
 */
const SUMMARY_TITLES: Record<TimingQuality, string> = {
  favorable: 'Supportive Window',
  neutral: 'Steady Progress',
  delicate: 'Pause & Prepare',
};

/**
 * Timing signal templates
 */
const TIMING_SIGNALS: Record<TimingQuality, string[]> = {
  favorable: [
    'The current timing appears supportive for forward movement.',
    'Elemental energies suggest a favorable window for action.',
    'This period may support your intended direction.',
  ],
  neutral: [
    'The timing suggests measured, deliberate progress.',
    'This period calls for balanced and thoughtful action.',
    'Consider steady, incremental steps forward.',
  ],
  delicate: [
    'The current timing suggests caution and preparation.',
    'This period may benefit from patience and careful planning.',
    'Consider strengthening foundations before major moves.',
  ],
};

/**
 * Cycle state modifiers
 */
const CYCLE_MODIFIERS: Record<string, {
  actionWords: string[];
  approach: string;
}> = {
  initiation: {
    actionWords: ['start small', 'prototype', 'first step'],
    approach: 'Begin with minimal viable actions to test waters.',
  },
  expansion: {
    actionWords: ['expand', 'increase consistency', 'build momentum'],
    approach: 'This is a time to grow what you\'ve started.',
  },
  peak: {
    actionWords: ['finalize', 'complete', 'deliver'],
    approach: 'Focus on bringing things to completion.',
  },
  stabilization: {
    actionWords: ['consolidate', 'maintain', 'strengthen'],
    approach: 'Secure your foundations before the next phase.',
  },
  reflection: {
    actionWords: ['review', 'assess', 'refine'],
    approach: 'Take time to evaluate before moving forward.',
  },
  rest: {
    actionWords: ['pause', 'recover', 'recharge'],
    approach: 'Avoid forcing outcomes; allow natural rhythms.',
  },
};

/**
 * Elemental tone guidance
 */
const ELEMENTAL_GUIDANCE: Record<ElementalTone, {
  strength: string;
  caution: string;
}> = {
  fire: {
    strength: 'Leverage momentum and confidence',
    caution: 'Avoid impulsive decisions',
  },
  water: {
    strength: 'Trust emotional clarity and intuition',
    caution: 'Manage overwhelm and maintain boundaries',
  },
  air: {
    strength: 'Focus on communication and learning',
    caution: 'Avoid scattered energy',
  },
  earth: {
    strength: 'Build on structure and practical steps',
    caution: 'Stay flexible; avoid rigidity',
  },
};

/**
 * Category-specific guidance templates
 */
const CATEGORY_TEMPLATES: Record<GuidanceCategory, {
  favorable: string[];
  neutral: string[];
  delicate: string[];
  watchOuts: string[];
  nextSteps: string[];
}> = {
  study_exam: {
    favorable: [
      'This may be a good time to tackle challenging material',
      'Your focus and retention could be strong now',
      'Consider scheduling intensive study sessions',
    ],
    neutral: [
      'Maintain consistent study rhythms',
      'Break material into manageable chunks',
      'Review and consolidate what you already know',
    ],
    delicate: [
      'Focus on review rather than new material',
      'Strengthen weak areas with extra practice',
      'Consider seeking help or study partners',
    ],
    watchOuts: [
      'Don\'t overextend; pace yourself',
      'Avoid cramming if possible',
      'Check for comprehension, not just coverage',
    ],
    nextSteps: [
      'Create a study schedule for the next 48 hours',
      'Review your notes from the last session',
      'Practice one problem set or flashcard deck today',
    ],
  },
  work_career: {
    favorable: [
      'This period may support career initiatives',
      'Consider taking visible action on key projects',
      'Network and communicate your value',
    ],
    neutral: [
      'Focus on solid, reliable work',
      'Build relationships without forcing outcomes',
      'Document your achievements quietly',
    ],
    delicate: [
      'Strengthen your skills and portfolio',
      'Observe workplace dynamics carefully',
      'Delay major asks or transitions if possible',
    ],
    watchOuts: [
      'Avoid office politics or unnecessary conflicts',
      'Don\'t over-promise on deadlines',
    ],
    nextSteps: [
      'Complete one high-impact task today',
      'Reach out to one professional contact',
      'Update your work documentation or resume',
    ],
  },
  money_business: {
    favorable: [
      'Financial decisions may proceed with careful planning',
      'Consider strategic investments or launches',
      'Negotiate from a position of clarity',
    ],
    neutral: [
      'Maintain conservative financial management',
      'Focus on reducing waste and increasing efficiency',
      'Build reserves rather than spending',
    ],
    delicate: [
      'Postpone major financial commitments if possible',
      'Review budgets and reduce unnecessary expenses',
      'Seek expert advice before major moves',
    ],
    watchOuts: [
      'Verify all agreements carefully',
      'Avoid high-risk ventures during uncertainty',
    ],
    nextSteps: [
      'Review your budget or financial plan',
      'Save or set aside a small amount today',
      'Research one financial decision you\'re considering',
    ],
  },
  travel: {
    favorable: [
      'Travel plans may proceed smoothly',
      'This could be a good time for journeys',
      'Prepare thoroughly and remain flexible',
    ],
    neutral: [
      'Travel is possible with careful preparation',
      'Keep contingency plans ready',
      'Focus on practical logistics',
    ],
    delicate: [
      'Consider delaying non-essential travel',
      'If travel is necessary, build in extra time',
      'Double-check all arrangements',
    ],
    watchOuts: [
      'Verify documents and reservations',
      'Stay aware of changing conditions',
    ],
    nextSteps: [
      'Create or review your travel checklist',
      'Confirm one booking or reservation',
      'Research your destination or route',
    ],
  },
  relationships_family: {
    favorable: [
      'This may be a good time for important conversations',
      'Emotional connections could deepen',
      'Consider reaching out or reconciling',
    ],
    neutral: [
      'Maintain steady, consistent communication',
      'Listen more than you speak',
      'Show care through small, practical acts',
    ],
    delicate: [
      'Give space and avoid forcing resolutions',
      'Focus on your own emotional regulation',
      'Delay difficult conversations if possible',
    ],
    watchOuts: [
      'Avoid reactive or defensive communication',
      'Don\'t make assumptions; ask questions',
    ],
    nextSteps: [
      'Send a thoughtful message to someone you care about',
      'Listen to one person without interrupting today',
      'Reflect on what you need from your relationships',
    ],
  },
  health_wellbeing: {
    favorable: [
      'This may be a good time to start healthy habits',
      'Your energy levels could support new routines',
      'Consider preventive care or wellness practices',
    ],
    neutral: [
      'Maintain existing healthy habits',
      'Focus on consistency over intensity',
      'Listen to your body\'s signals',
    ],
    delicate: [
      'Prioritize rest and recovery',
      'Avoid pushing through exhaustion',
      'Seek professional guidance for concerns',
    ],
    watchOuts: [
      'This is NOT medical advice; consult healthcare providers',
      'Don\'t ignore persistent symptoms',
    ],
    nextSteps: [
      'Drink water and get adequate sleep tonight',
      'Take a 10-minute walk or stretch break',
      'Schedule any overdue health checkups',
    ],
  },
  spiritual_practice: {
    favorable: [
      'This period may deepen spiritual connection',
      'Consider increasing devotional practices',
      'Your heart may be especially receptive now',
    ],
    neutral: [
      'Maintain consistent spiritual routines',
      'Focus on quality over quantity',
      'Review and internalize what you\'ve learned',
    ],
    delicate: [
      'Return to foundational practices',
      'Seek knowledge and community support',
      'Be patient with spiritual struggles',
    ],
    watchOuts: [
      'Avoid spiritual bypassing of practical needs',
      'Don\'t compare your journey to others',
    ],
    nextSteps: [
      'Dedicate 10 minutes to prayer or reflection today',
      'Read one page of spiritual text',
      'Perform one act of kindness anonymously',
    ],
  },
  decisions_general: {
    favorable: [
      'This may be a good time for clear decision-making',
      'Trust your preparation and analysis',
      'Move forward with thoughtful confidence',
    ],
    neutral: [
      'Gather more information before deciding',
      'Consult trusted advisors',
      'Sleep on major decisions',
    ],
    delicate: [
      'Delay the decision if possible',
      'Reduce the scope or stakes if you must decide',
      'Create reversible options',
    ],
    watchOuts: [
      'Avoid deciding under pressure or fatigue',
      'Don\'t rush without consulting others',
    ],
    nextSteps: [
      'Write down pros and cons',
      'Talk to one trusted person about your decision',
      'Set a decision deadline (not today)',
    ],
  },
};

/**
 * Hash function for deterministic selection
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

/**
 * Select from array deterministically
 */
function selectDeterministic<T>(arr: T[], seed: string): T {
  const hash = hashString(seed);
  return arr[hash % arr.length];
}

/**
 * Generate Divine Timing guidance
 * 
 * @param input - Guidance input parameters
 * @returns Structured guidance response
 */
export function generateDivineTimingGuidance(
  input: GuidanceInput
): GuidanceResponse {
  const {
    questionText,
    category,
    timeHorizon,
    urgency,
    divineTimingResult,
    reflectionVerse,
    userProfile,
  } = input;

  const { timingQuality, cycleState, elementalTone } = divineTimingResult;
  
  // Generate seed for deterministic selection
  const seed = `${questionText}-${category}-${timingQuality}`;
  
  // Summary title
  const summaryTitle = SUMMARY_TITLES[timingQuality];
  
  // Timing signal - personalize if profile available
  let timingSignal = selectDeterministic(
    TIMING_SIGNALS[timingQuality],
    seed
  );
  
  // Personalize timing signal if user profile available
  if (userProfile?.burj) {
    timingSignal = personalizeTimingSignal(timingSignal, userProfile.burj, userProfile.element);
  }
  
  // Category templates
  const categoryTemplate = CATEGORY_TEMPLATES[category];
  
  // Build recommended approach
  const recommendedApproach: string[] = [];
  
  // Add category-specific guidance
  let categoryGuidance = selectDeterministic(
    categoryTemplate[timingQuality],
    seed
  );
  
  // Personalize category guidance if profile available
  if (userProfile?.element) {
    categoryGuidance = personalizeGuidance(categoryGuidance, userProfile.element, category);
  }
  
  recommendedApproach.push(categoryGuidance);
  
  // Add cycle modifier
  const cycleInfo = CYCLE_MODIFIERS[cycleState] || CYCLE_MODIFIERS.reflection;
  recommendedApproach.push(cycleInfo.approach);
  
  // Add elemental guidance (strength) - use user's element if available
  const userElement = userProfile?.element || elementalTone;
  const elementalInfo = ELEMENTAL_GUIDANCE[userElement];
  let elementalStrength = elementalInfo.strength;
  
  // Add personal touch if element matches user
  if (userProfile?.element === userElement) {
    elementalStrength = `Your ${userElement} nature suggests: ${elementalStrength.toLowerCase()}`;
  }
  
  recommendedApproach.push(elementalStrength);
  
  // Build watch-outs
  const watchOuts: string[] = [];
  
  // Add elemental caution
  watchOuts.push(elementalInfo.caution);
  
  // Add category-specific watch-out
  if (categoryTemplate.watchOuts.length > 0) {
    const watchOut = selectDeterministic(
      categoryTemplate.watchOuts,
      seed + 'watchout'
    );
    watchOuts.push(watchOut);
  }
  
  // Select next step
  let nextStep = selectDeterministic(
    categoryTemplate.nextSteps,
    seed + 'nextstep'
  );
  
  // Modify next step based on time horizon
  if (timeHorizon === 'this_week') {
    nextStep = nextStep.replace('today', 'this week');
    nextStep = nextStep.replace('10 minutes', '30 minutes');
  } else if (timeHorizon === 'this_month') {
    nextStep = nextStep.replace('today', 'this month');
    nextStep = nextStep.replace('10 minutes', '1 hour');
  }
  
  // Modify based on urgency
  if (urgency === 'high' && timingQuality !== 'favorable') {
    // Add risk-minimizing language
    nextStep = `If urgent: ${nextStep.toLowerCase()}. Otherwise, wait.`;
  }
  
  // Build reflection anchor if verse is provided
  let reflection: GuidanceResponse['reflection'] | undefined;
  if (reflectionVerse) {
    reflection = {
      surahNameEn: reflectionVerse.verse.surahNameEn,
      surahNumber: reflectionVerse.verse.surahNumber,
      ayahNumber: reflectionVerse.verse.ayahNumber,
      prompt: reflectionVerse.prompt.text,
    };
  }
  
  return {
    summaryTitle,
    timingSignal,
    recommendedApproach,
    watchOuts,
    nextStep,
    reflection,
  };
}

/**
 * Get display name for guidance category
 */
export function getGuidanceCategoryName(category: GuidanceCategory): string {
  const names: Record<GuidanceCategory, string> = {
    study_exam: 'Study / Exam',
    work_career: 'Work / Career',
    money_business: 'Money / Business',
    travel: 'Travel',
    relationships_family: 'Relationships / Family',
    health_wellbeing: 'Health / Wellbeing',
    spiritual_practice: 'Spiritual Practice',
    decisions_general: 'Decisions / General',
  };
  return names[category];
}

/**
 * Get display name for time horizon
 */
export function getTimeHorizonName(horizon: TimeHorizon): string {
  const names: Record<TimeHorizon, string> = {
    today: 'Today',
    this_week: 'This Week',
    this_month: 'This Month',
  };
  return names[horizon];
}

/**
 * Get display name for urgency level
 */
export function getUrgencyName(urgency: UrgencyLevel): string {
  const names: Record<UrgencyLevel, string> = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
  };
  return names[urgency];
}

/**
 * Standard disclaimer for guidance
 */
export const GUIDANCE_DISCLAIMER =
  'This is spiritual reflection, not religious rulings or certainty about outcomes. For fatwa or istikhārah, consult qualified scholars. This is not professional advice.';

// ============================================================================
// PERSONALIZATION HELPERS
// ============================================================================

/**
 * Personalize timing signal with user's Burj information
 */
function personalizeTimingSignal(
  signal: string,
  burj: string,
  element?: 'fire' | 'water' | 'air' | 'earth'
): string {
  const resolvedKey = resolveZodiacKey(burj);
  const renderedBurj = resolvedKey
    ? (() => {
        const zodiac = ZODIAC_IDENTITY_MAP[resolvedKey];
        const base = `${zodiac.en} (${zodiac.ar})`;
        return zodiac.symbol ? `${zodiac.symbol} ${base}` : base;
      })()
    : burj;

  // Add element-based personalization
  if (element) {
    const elementPhrases: Record<string, string> = {
      fire: 'aligned with your natural initiative',
      water: 'resonating with your intuitive nature',
      air: 'supporting your intellectual approach',
      earth: 'grounding your practical steps',
    };
    
    return `${signal} As a ${renderedBurj}, this period may be ${elementPhrases[element]}.`;
  }
  
  return `${signal} (${renderedBurj} influence noted).`;
}

/**
 * Personalize guidance based on user's element and category
 */
function personalizeGuidance(
  guidance: string,
  element: 'fire' | 'water' | 'air' | 'earth',
  category: GuidanceCategory
): string {
  // Element-specific modifiers for different categories
  const elementModifiers: Record<string, Record<GuidanceCategory, string>> = {
    fire: {
      study_exam: 'your energetic focus',
      work_career: 'your leadership qualities',
      money_business: 'your entrepreneurial spirit',
      travel: 'your adventurous nature',
      relationships_family: 'your passionate commitment',
      health_wellbeing: 'your active approach',
      spiritual_practice: 'your devoted intensity',
      decisions_general: 'your decisive nature',
    },
    water: {
      study_exam: 'your deep understanding',
      work_career: 'your collaborative strengths',
      money_business: 'your intuitive insights',
      travel: 'your adaptable nature',
      relationships_family: 'your emotional depth',
      health_wellbeing: 'your holistic awareness',
      spiritual_practice: 'your heartfelt devotion',
      decisions_general: 'your intuitive wisdom',
    },
    air: {
      study_exam: 'your analytical mind',
      work_career: 'your communication skills',
      money_business: 'your strategic thinking',
      travel: 'your curiosity and openness',
      relationships_family: 'your intellectual connection',
      health_wellbeing: 'your mindful approach',
      spiritual_practice: 'your contemplative nature',
      decisions_general: 'your rational analysis',
    },
    earth: {
      study_exam: 'your methodical approach',
      work_career: 'your reliable consistency',
      money_business: 'your practical wisdom',
      travel: 'your careful planning',
      relationships_family: 'your steady loyalty',
      health_wellbeing: 'your grounded discipline',
      spiritual_practice: 'your sustained commitment',
      decisions_general: 'your practical discernment',
    },
  };
  
  const modifier = elementModifiers[element]?.[category];
  if (modifier) {
    return `${guidance} Drawing on ${modifier} will serve you well.`;
  }
  
  return guidance;
}
