/**
 * Elemental Harmony Utilities
 * =============================
 * Calculate harmony between user and day/moment elements
 * Provide explanatory text for the harmony state
 */

import { Element } from './MomentAlignmentService';
import { Planet } from './PlanetaryHoursService';

export type HarmonyLevel = 'Harmonious' | 'Supportive' | 'Neutral' | 'Challenging';
export type MomentState = 'HOLD' | 'FLOW' | 'ACT' | 'REST';

export interface ElementalHarmony {
  level: HarmonyLevel;
  explanation: string;
  explanationKey: string; // i18n key
}

export interface MomentStateResult {
  state: MomentState;
  causeText: string;
  causeTextKey: string; // i18n key
}

/**
 * Calculate elemental harmony between user and day/moment element
 * 
 * Rules:
 * - Same element = Harmonious
 * - Complementary (fire-air, water-earth) = Supportive  
 * - Opposite (fire-water, earth-air) = Challenging
 * - Others = Neutral
 */
export function calculateElementalHarmony(
  userElement: Element,
  contextElement: Element
): ElementalHarmony {
  if (userElement === contextElement) {
    return {
      level: 'Harmonious',
      explanation: `Your ${userElement} nature perfectly aligns with today's ${contextElement} energy — move with confidence and clarity.`,
      explanationKey: 'harmony.harmonious',
    };
  }
  
  // Complementary pairs
  const complementary = 
    (userElement === 'fire' && contextElement === 'air') ||
    (userElement === 'air' && contextElement === 'fire') ||
    (userElement === 'water' && contextElement === 'earth') ||
    (userElement === 'earth' && contextElement === 'water');
  
  if (complementary) {
    return {
      level: 'Supportive',
      explanation: `Your ${userElement} nature is supported by today's ${contextElement} energy — favorable conditions for growth and action.`,
      explanationKey: 'harmony.supportive',
    };
  }
  
  // Opposing pairs
  const opposing =
    (userElement === 'fire' && contextElement === 'water') ||
    (userElement === 'water' && contextElement === 'fire') ||
    (userElement === 'earth' && contextElement === 'air') ||
    (userElement === 'air' && contextElement === 'earth');
  
  if (opposing) {
    return {
      level: 'Challenging',
      explanation: `Your ${userElement} nature contrasts with today's ${contextElement} energy — practice patience and gentle adaptation.`,
      explanationKey: 'harmony.challenging',
    };
  }
  
  return {
    level: 'Neutral',
    explanation: `Your ${userElement} nature and today's ${contextElement} energy flow neutrally — balanced conditions for steady progress.`,
    explanationKey: 'harmony.neutral',
  };
}

/**
 * Calculate moment state based on user element, current element, and planet
 * 
 * Logic:
 * - FLOW: Harmonious or Supportive alignment
 * - ACT: Fire/Air user with active planet (Sun, Mars, Jupiter)
 * - HOLD: Challenging alignment or slow planet (Saturn)
 * - REST: Water/Earth user with reflective planet (Moon, Venus)
 */
export function calculateMomentState(
  userElement: Element,
  nowElement: Element,
  currentPlanet: Planet
): MomentStateResult {
  const harmony = calculateElementalHarmony(userElement, nowElement);
  
  // HOLD: Challenging alignment
  if (harmony.level === 'Challenging') {
    return {
      state: 'HOLD',
      causeText: `${getElementLabel(nowElement)} energy over ${getElementLabel(userElement)} nature — pause before acting`,
      causeTextKey: 'moment.hold.cause',
    };
  }
  
  // Saturn always suggests HOLD
  if (currentPlanet === 'Saturn') {
    return {
      state: 'HOLD',
      causeText: 'Saturn\'s reflective influence — time for review, not rush',
      causeTextKey: 'moment.hold.saturn',
    };
  }
  
  // FLOW: Harmonious/Supportive
  if (harmony.level === 'Harmonious' || harmony.level === 'Supportive') {
    return {
      state: 'FLOW',
      causeText: `${getElementLabel(userElement)} and ${getElementLabel(nowElement)} aligned — momentum favors you`,
      causeTextKey: 'moment.flow.cause',
    };
  }
  
  // ACT: Fire/Air + active planet
  const isActiveElement = userElement === 'fire' || userElement === 'air';
  const isActivePlanet = currentPlanet === 'Sun' || currentPlanet === 'Mars' || currentPlanet === 'Jupiter';
  
  if (isActiveElement && isActivePlanet) {
    return {
      state: 'ACT',
      causeText: `${currentPlanet}'s dynamic hour matches your ${getElementLabel(userElement)} — seize the moment`,
      causeTextKey: 'moment.act.cause',
    };
  }
  
  // REST: Water/Earth + reflective planet
  const isReflectiveElement = userElement === 'water' || userElement === 'earth';
  const isReflectivePlanet = currentPlanet === 'Moon' || currentPlanet === 'Venus';
  
  if (isReflectiveElement && isReflectivePlanet) {
    return {
      state: 'REST',
      causeText: `${currentPlanet}'s gentle hour suits your ${getElementLabel(userElement)} — restore and reflect`,
      causeTextKey: 'moment.rest.cause',
    };
  }
  
  // Default to FLOW for neutral cases
  return {
    state: 'FLOW',
    causeText: 'Balanced energies — steady progress',
    causeTextKey: 'moment.flow.neutral',
  };
}

/**
 * Get element label with capital first letter
 */
function getElementLabel(element: Element): string {
  return element.charAt(0).toUpperCase() + element.slice(1);
}

/**
 * Get suggested micro-actions based on moment state
 */
export function getSuggestedActions(state: MomentState): string[] {
  switch (state) {
    case 'ACT':
      return ['Initiate', 'Decide', 'Execute'];
    case 'FLOW':
      return ['Continue', 'Build', 'Connect'];
    case 'HOLD':
      return ['Wait', 'Observe', 'Prepare'];
    case 'REST':
      return ['Reflect', 'Journal', 'Restore'];
    default:
      return ['Plan', 'Review', 'Organize'];
  }
}
