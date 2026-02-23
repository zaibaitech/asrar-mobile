export type Planet =
  | 'Sun'
  | 'Moon'
  | 'Mercury'
  | 'Venus'
  | 'Mars'
  | 'Jupiter'
  | 'Saturn';

export type Sign =
  | 'Aries'
  | 'Taurus'
  | 'Gemini'
  | 'Cancer'
  | 'Leo'
  | 'Virgo'
  | 'Libra'
  | 'Scorpio'
  | 'Sagittarius'
  | 'Capricorn'
  | 'Aquarius'
  | 'Pisces';

export type ConditionStatus = 'Favorable' | 'Neutral' | 'Restricted' | 'Avoid';

export type Dignity = 'Exaltation' | 'Domicile' | 'Neutral' | 'Detriment' | 'Fall';

export type PlanetConditionReasonKey =
  | 'DIGNITY_EXALTATION'
  | 'DIGNITY_DOMICILE'
  | 'DIGNITY_FALL'
  | 'DIGNITY_DETRIMENT'
  | 'DIGNITY_NEUTRAL'
  | 'DEGREE_EXALTATION_PEAK_NEAR'
  | 'DEGREE_EXALTATION_NEAR'
  | 'DEGREE_CRITICAL_TRANSITION';

export interface PlanetDignities {
  domicile: Sign[];
  exaltation?: { sign: Sign; degree: number };
  detriment: Sign[];
  fall: Sign[];
}

export const PLANET_DIGNITIES: Record<Planet, PlanetDignities> = {
  Sun: {
    domicile: ['Leo'],
    exaltation: { sign: 'Aries', degree: 19 },
    detriment: ['Aquarius'],
    fall: ['Libra'],
  },
  Moon: {
    domicile: ['Cancer'],
    exaltation: { sign: 'Taurus', degree: 3 },
    detriment: ['Capricorn'],
    fall: ['Scorpio'],
  },
  Mercury: {
    domicile: ['Gemini', 'Virgo'],
    exaltation: { sign: 'Virgo', degree: 15 },
    detriment: ['Sagittarius', 'Pisces'],
    fall: ['Pisces'],
  },
  Venus: {
    domicile: ['Taurus', 'Libra'],
    exaltation: { sign: 'Pisces', degree: 27 },
    detriment: ['Aries', 'Scorpio'],
    fall: ['Virgo'],
  },
  Mars: {
    domicile: ['Aries', 'Scorpio'],
    exaltation: { sign: 'Capricorn', degree: 28 },
    detriment: ['Libra', 'Taurus'],
    fall: ['Cancer'],
  },
  Jupiter: {
    domicile: ['Sagittarius', 'Pisces'],
    exaltation: { sign: 'Cancer', degree: 15 },
    detriment: ['Gemini', 'Virgo'],
    fall: ['Capricorn'],
  },
  Saturn: {
    domicile: ['Capricorn', 'Aquarius'],
    exaltation: { sign: 'Libra', degree: 21 },
    detriment: ['Cancer', 'Leo'],
    fall: ['Aries'],
  },
};

export interface PlanetConditionEvaluation {
  planet: Planet;
  sign: Sign;
  degree: number;
  dignity: Dignity;
  score: number;
  status: ConditionStatus;
  reasons: PlanetConditionReasonKey[];
}

export function getDignityReasonKey(dignity: Dignity): PlanetConditionReasonKey {
  switch (dignity) {
    case 'Exaltation':
      return 'DIGNITY_EXALTATION';
    case 'Domicile':
      return 'DIGNITY_DOMICILE';
    case 'Detriment':
      return 'DIGNITY_DETRIMENT';
    case 'Fall':
      return 'DIGNITY_FALL';
    case 'Neutral':
    default:
      return 'DIGNITY_NEUTRAL';
  }
}

function clampDegreeWithinSign(degree: number): number {
  if (!Number.isFinite(degree)) return 0;
  // Allow callers to pass absolute degrees (0..360+) by taking mod 30.
  const normalized = ((degree % 30) + 30) % 30;
  // Keep as provided precision; engine rules depend on cutoffs at 1 and 29.
  return normalized;
}

function statusFromScore(score: number): ConditionStatus {
  if (score >= 4) return 'Favorable';
  if (score >= 1) return 'Neutral';
  if (score >= -1) return 'Restricted';
  return 'Avoid';
}

function pushUnique<T>(arr: T[], item: T) {
  if (!arr.includes(item)) arr.push(item);
}

/**
 * Evaluate planet's essential condition by sign dignity + exaltation peak degrees + critical degrees.
 */
export function evaluatePlanetCondition(args: {
  planet: Planet;
  sign: Sign;
  degree: number;
}): PlanetConditionEvaluation {
  const { planet, sign } = args;
  const degree = clampDegreeWithinSign(args.degree);

  const dignities = PLANET_DIGNITIES[planet];
  const reasons: PlanetConditionReasonKey[] = [];

  let dignity: Dignity = 'Neutral';
  let score = 0;

  // 1) Determine dignity in specified order
  if (dignities.fall.includes(sign)) {
    dignity = 'Fall';
    score = -4;
  } else if (dignities.detriment.includes(sign)) {
    dignity = 'Detriment';
    score = -3;
  } else if (dignities.exaltation?.sign === sign) {
    dignity = 'Exaltation';
    score = 4;
  } else if (dignities.domicile.includes(sign)) {
    dignity = 'Domicile';
    score = 3;
  }

  pushUnique(reasons, getDignityReasonKey(dignity));

  // 2) Exaltation peak degrees bonus
  if (dignity === 'Exaltation' && dignities.exaltation) {
    const peak = dignities.exaltation.degree;
    const diff = Math.abs(degree - peak);

    if (diff <= 3) {
      score += 2;
      pushUnique(reasons, 'DEGREE_EXALTATION_PEAK_NEAR');
    } else if (diff <= 7) {
      score += 1;
      pushUnique(reasons, 'DEGREE_EXALTATION_NEAR');
    }
  }

  // 3) Universal critical degrees penalty
  // Rule: degree >= 29 OR degree < 1 => -1
  if (degree >= 29 || degree < 1) {
    score -= 1;
    pushUnique(reasons, 'DEGREE_CRITICAL_TRANSITION');
  }

  // 4) Map to status
  const status = statusFromScore(score);

  return {
    planet,
    sign,
    degree,
    dignity,
    score,
    status,
    reasons,
  };
}

/*
Example usage:

import { evaluatePlanetCondition } from '@/src/lib/astro/planetConditionEngine';

const result = evaluatePlanetCondition({
  planet: 'Sun',
  sign: 'Aries',
  degree: 19,
});

// result.status => 'Favorable'
// result.reasons => ['DIGNITY_EXALTATION', 'DEGREE_EXALTATION_PEAK_NEAR']
*/
