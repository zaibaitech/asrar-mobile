/**
 * Daily Synthesis Service
 * ========================
 * Generates holistic guidance combining:
 * 1. Day ruler (planetary influence)
 * 2. User's personal planet
 * 3. Lunar phase
 * 4. Elemental harmony
 * 
 * This creates a narrative-driven spiritual guidance system
 * that shows how TODAY'S energy interacts with the USER'S nature
 */

import type { MoonPhaseName } from './MoonPhaseService';
import type { Element, Planet } from './PlanetaryHoursService';
import {
    getDailyStrengthDesc,
    getElementRelationLabel,
    getElementRelationship,
    getElementScore,
    getElementalHarmonyDesc,
    getPlanetaryFriendshipDesc,
    getPlanetaryRelationship,
    getRelationshipLabel,
    getRelationshipScore,
    getStrengthLabel,
} from './PlanetaryRelationshipService';

/**
 * Overall quality assessment for the day
 */
export type DailyQuality = 'excellent' | 'good' | 'moderate' | 'challenging';

/**
 * Complete daily synthesis combining all factors
 */
export interface DailySynthesis {
  /** Overall quality rating */
  overallQuality: DailyQuality;
  
  /** Narrative summary text */
  summaryText: string;
  
  /** Activities that are excellent for today */
  excellentFor: string[];
  
  /** Activities that are less favorable */
  lessFavorable: string[];
  
  /** Peak hours note (which planet hours are best) */
  peakHours: string;
  
  /** Breakdown of contributing factors */
  factors: {
    planetaryFriendship: {
      score: number;
      label: string;
      description: string;
    };
    elementalHarmony: {
      score: number;
      label: string;
      description: string;
    };
    dailyStrength: {
      score: number;
      label: string;
      description: string;
    };
  };
}

/**
 * Generate complete daily synthesis
 * 
 * @param dayRuler - The ruling planet for today
 * @param userPlanet - User's personal planet (from name or birth chart)
 * @param userElement - User's personal element
 * @param dayElement - Element of the day ruler
 * @param moonPhase - Current moon phase
 * @param dayRulerTransitPower - Current strength of day ruler (0-100)
 * @param t - Translation function
 * @param userSignKey - Optional user's zodiac sign for special harmony rules
 * @returns Complete synthesis object
 */
export function generateDailySynthesis(
  dayRuler: Planet,
  userPlanet: Planet,
  userElement: Element,
  dayElement: Element,
  moonPhase: MoonPhaseName,
  dayRulerTransitPower: number,
  t: (key: string, params?: Record<string, string | number>) => string,
  userSignKey?: string
): DailySynthesis {
  // 1. Calculate planetary friendship
  const relationship = getPlanetaryRelationship(dayRuler, userPlanet);
  const friendshipScore = getRelationshipScore(relationship);
  
  // 2. Calculate elemental harmony (with sign-based nuances)
  const elementRelation = getElementRelationship(userElement, dayElement, userSignKey);
  const harmonyScore = getElementScore(elementRelation);
  
  // 3. Day ruler strength
  const strengthScore = dayRulerTransitPower;
  
  // 4. Calculate overall quality
  const averageScore = (friendshipScore + harmonyScore + strengthScore) / 3;
  let overallQuality: DailyQuality;
  if (averageScore >= 85) overallQuality = 'excellent';
  else if (averageScore >= 70) overallQuality = 'good';
  else if (averageScore >= 50) overallQuality = 'moderate';
  else overallQuality = 'challenging';
  
  // 5. Generate synthesis text
  const summaryText = generateSummaryText(
    dayRuler,
    userPlanet,
    userElement,
    moonPhase,
    overallQuality,
    t
  );
  
  // 6. Generate activity lists based on day ruler + quality
  const { excellentFor, lessFavorable } = generateActivityLists(
    dayRuler,
    overallQuality,
    t
  );
  
  // 7. Determine peak hours
  const peakHours = t('widgets.dailyEnergy.peakHours', { planet: formatPlanetLabel(dayRuler, t) });
  
  return {
    overallQuality,
    summaryText,
    excellentFor,
    lessFavorable,
    peakHours,
    factors: {
      planetaryFriendship: {
        score: friendshipScore,
        label: getRelationshipLabel(relationship, t),
        description: getPlanetaryFriendshipDesc(dayRuler, userPlanet, t),
      },
      elementalHarmony: {
        score: harmonyScore,
        label: getElementRelationLabel(elementRelation, t),
        description: getElementalHarmonyDesc(dayElement, userElement, t, userSignKey),
      },
      dailyStrength: {
        score: strengthScore,
        label: getStrengthLabel(strengthScore, t),
        description: getDailyStrengthDesc(dayRuler, strengthScore, t),
      },
    },
  };
}

/**
 * Generate narrative summary text
 * Combines day ruler, user planet, element, lunar phase, and quality
 * 
 * @param dayRuler - The ruling planet
 * @param userPlanet - User's planet
 * @param userElement - User's element
 * @param moonPhase - Current moon phase
 * @param quality - Overall quality rating
 * @param t - Translation function
 * @returns Narrative text
 */
function generateSummaryText(
  dayRuler: Planet,
  userPlanet: Planet,
  userElement: Element,
  moonPhase: MoonPhaseName,
  quality: DailyQuality,
  t: (key: string, params?: Record<string, string | number>) => string
): string {
  const dayKey = getDayName(dayRuler);
  const dayQuality = getDayQuality(dayRuler, t);
  const lunarAddition = getLunarPhaseText(moonPhase, t);
  const activities = getMainActivities(dayRuler, t);
  const userPlanetLabel = formatPlanetLabel(userPlanet, t);
  const userElementLabel = formatElementLabel(userElement, t);
  
  // Use translation template
  const template = t(`dailyEnergy.synthesis.${quality}`);
  
  return template
    .replace('{day}', t(`days.${dayKey}`))
    .replace('{quality}', dayQuality)
    .replace('{user}', userPlanetLabel)
    .replace('{element}', userElementLabel)
    .replace('{lunar}', lunarAddition)
    .replace('{activities}', activities);
}

/**
 * Get day name from planet
 */
function getDayName(planet: Planet): string {
  const days: Record<Planet, string> = {
    Sun: 'sunday',
    Moon: 'monday',
    Mars: 'tuesday',
    Mercury: 'wednesday',
    Jupiter: 'thursday',
    Venus: 'friday',
    Saturn: 'saturday',
  };
  return days[planet];
}

/**
 * Get quality description for day ruler
 */
function getDayQuality(planet: Planet, t: (key: string) => string): string {
  const key = `dailyEnergy.dayEnergy.${getDayQualityKey(planet)}`;
  return t(key);
}

/**
 * Get day quality key for translation
 */
function getDayQualityKey(planet: Planet): string {
  const qualities: Record<Planet, string> = {
    Jupiter: 'expansion',
    Mars: 'action',
    Mercury: 'communication',
    Venus: 'love',
    Saturn: 'discipline',
    Sun: 'vitality',
    Moon: 'intuition',
  };
  return qualities[planet];
}

/**
 * Get lunar phase text addition
 */
function getLunarPhaseText(phase: MoonPhaseName, t: (key: string, params?: Record<string, string | number>) => string): string {
  if (phase === 'new' || phase === 'waxing_crescent') {
    return t('dailyEnergy.lunarPhase.new');
  } else if (phase === 'waxing_gibbous' || phase === 'first_quarter') {
    return t('dailyEnergy.lunarPhase.waxing');
  } else if (phase === 'full') {
    return t('dailyEnergy.lunarPhase.full');
  } else {
    return t('dailyEnergy.lunarPhase.waning');
  }
}

/**
 * Get main activities for day ruler
 */
function getMainActivities(planet: Planet, t: (key: string, params?: Record<string, string | number>) => string): string {
  const planetKey = planet.toLowerCase();
  // Reuse widget copy so it stays localized across EN/FR/AR.
  return t(`widgets.dailyEnergy.planetaryFocus.${planetKey}`);
}

/**
 * Generate activity lists based on day ruler and quality
 */
function generateActivityLists(
  dayRuler: Planet,
  quality: DailyQuality,
  t: (key: string, params?: Record<string, string | number>) => string
): { excellentFor: string[]; lessFavorable: string[] } {
  const planetKey = dayRuler.toLowerCase();

  const excellent = resolveIndexedList(t, `widgets.dailyEnergy.activities.${planetKey}.excellent`, 8);
  const less = resolveIndexedList(t, `widgets.dailyEnergy.activities.${planetKey}.lessFavorable`, 6);
  
  // Adjust based on quality
  if (quality === 'challenging') {
    // In challenging times, reduce list and add caution
    return {
      excellentFor: excellent.slice(0, 3),
      lessFavorable: [
        ...less,
        t('widgets.dailyEnergy.activities.common.waitForBetterTiming'),
      ],
    };
  }
  
  return {
    excellentFor: excellent,
    lessFavorable: less,
  };
}

function formatPlanetLabel(
  planet: Planet,
  t: (key: string, params?: Record<string, string | number>) => string
): string {
  return t(`planets.${planet.toLowerCase()}`);
}

function formatElementLabel(
  element: Element,
  t: (key: string, params?: Record<string, string | number>) => string
): string {
  return t(`elements.${String(element).toLowerCase()}`);
}

function resolveIndexedList(
  t: (key: string, params?: Record<string, string | number>) => string,
  baseKey: string,
  max: number
): string[] {
  const out: string[] = [];

  for (let i = 0; i < max; i++) {
    const key = `${baseKey}.${i}`;
    const value = String(t(key)).trim();

    // Missing numeric index keys fall back to the humanized last segment ("0", "1", ...)
    if (!value || value === String(i) || /^\d+$/.test(value)) {
      break;
    }

    out.push(value);
  }

  return out;
}

/**
 * Get user's planet with fallback logic
 * Priority: Birth chart > Name calculation > Default (Sun)
 * 
 * @param birthPlanet - Planet from birth chart (if available)
 * @param namePlanet - Planet from name calculation (if available)
 * @returns The user's planet and source
 */
export function getUserPlanet(
  birthPlanet?: Planet,
  namePlanet?: Planet
): { planet: Planet; source: 'birth' | 'name' | 'default' } {
  if (birthPlanet) {
    return { planet: birthPlanet, source: 'birth' };
  }
  if (namePlanet) {
    return { planet: namePlanet, source: 'name' };
  }
  // Default to Sun (represents self/vitality)
  return { planet: 'Sun', source: 'default' };
}

/**
 * Get color for status based on score
 * 
 * @param score - Numerical score (0-100)
 * @returns Color string (hex or named)
 */
export function getStatusColor(score: number): string {
  if (score >= 80) return '#10b981'; // green
  if (score >= 60) return '#3b82f6'; // blue
  if (score >= 40) return '#f59e0b'; // amber
  if (score >= 20) return '#ef4444'; // red
  return '#991b1b'; // dark red
}
