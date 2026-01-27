import type { ElementType } from '@/contexts/ThemeContext';
import { getPlanetaryData, type Planet as BlessingPlanet } from '@/services/DayBlessingService';
import { calculateEnhancedPlanetaryPower } from '@/services/PlanetaryStrengthService';

export type Planet = 'Sun' | 'Moon' | 'Mars' | 'Mercury' | 'Jupiter' | 'Venus' | 'Saturn';
export type Element = ElementType;

export type PrimaryLevel = 'Excellent' | 'Good' | 'Moderate' | 'Weak' | 'VeryWeak';
export type FinalLevel = PrimaryLevel;

export type ElementalModifier = {
  adjustment: -1 | 0 | 1;
  noteKey:
    | 'timing.shortDescriptions.perfectAlignment'
    | 'timing.shortDescriptions.supportiveFlow'
    | 'timing.shortDescriptions.neutral'
    | 'timing.shortDescriptions.minorTension';
};

export type PrimaryRating = {
  level: PrimaryLevel;
  descriptionKey:
    | 'timing.shortDescriptions.veryStrong'
    | 'timing.shortDescriptions.strong'
    | 'timing.shortDescriptions.moderate'
    | 'timing.shortDescriptions.weak'
    | 'timing.shortDescriptions.veryWeak';
};

export type AuthenticTimingRating = {
  hourPlanet: Planet;
  hourElement: Element;
  userElement: Element;

  planetStrength: number; // 0-100
  primary: PrimaryRating;
  modifier: ElementalModifier;
  finalLevel: FinalLevel;

  stars: '⭐⭐⭐' | '⭐⭐' | '⭐' | '⚠️' | '🔴';
  labelKey:
    | 'timing.ratings.excellent'
    | 'timing.ratings.good'
    | 'timing.ratings.moderate'
    | 'timing.ratings.weak'
    | 'timing.ratings.unfavorable';
  color: string;
};

export function evaluateHourRulerStrength(planetStrength: number): PrimaryRating {
  if (planetStrength >= 90) return { level: 'Excellent', descriptionKey: 'timing.shortDescriptions.veryStrong' };
  if (planetStrength >= 70) return { level: 'Good', descriptionKey: 'timing.shortDescriptions.strong' };
  if (planetStrength >= 50) return { level: 'Moderate', descriptionKey: 'timing.shortDescriptions.moderate' };
  if (planetStrength >= 30) return { level: 'Weak', descriptionKey: 'timing.shortDescriptions.weak' };
  return { level: 'VeryWeak', descriptionKey: 'timing.shortDescriptions.veryWeak' };
}

export function evaluateElementalRelationship(userElement: Element, hourElement: Element): ElementalModifier {
  if (userElement === hourElement) {
    return { adjustment: 1, noteKey: 'timing.shortDescriptions.perfectAlignment' };
  }

  const oppositions: Record<Element, Element> = {
    fire: 'water',
    water: 'fire',
    air: 'earth',
    earth: 'air',
  };

  if (oppositions[userElement] === hourElement) {
    return { adjustment: -1, noteKey: 'timing.shortDescriptions.minorTension' };
  }

  const supportive: Record<string, true> = {
    'fire-air': true,
    'air-fire': true,
    'water-earth': true,
    'earth-water': true,
  };

  if (supportive[`${userElement}-${hourElement}`]) {
    return { adjustment: 0, noteKey: 'timing.shortDescriptions.supportiveFlow' };
  }

  return { adjustment: 0, noteKey: 'timing.shortDescriptions.neutral' };
}

export function calculateFinalLevel(primary: PrimaryRating, modifier: ElementalModifier): FinalLevel {
  const levels: FinalLevel[] = ['VeryWeak', 'Weak', 'Moderate', 'Good', 'Excellent'];
  const currentIndex = levels.indexOf(primary.level);
  const nextIndex = Math.max(0, Math.min(levels.length - 1, currentIndex + modifier.adjustment));
  return levels[nextIndex];
}

export function getStars(finalLevel: FinalLevel): AuthenticTimingRating['stars'] {
  if (finalLevel === 'Excellent') return '⭐⭐⭐';
  if (finalLevel === 'Good') return '⭐⭐';
  if (finalLevel === 'Moderate') return '⭐';
  if (finalLevel === 'Weak') return '⚠️';
  return '🔴';
}

export function getLabelKey(finalLevel: FinalLevel): AuthenticTimingRating['labelKey'] {
  if (finalLevel === 'Excellent') return 'timing.ratings.excellent';
  if (finalLevel === 'Good') return 'timing.ratings.good';
  if (finalLevel === 'Moderate') return 'timing.ratings.moderate';
  if (finalLevel === 'Weak') return 'timing.ratings.weak';
  return 'timing.ratings.unfavorable';
}

export function getColor(finalLevel: FinalLevel): string {
  if (finalLevel === 'Excellent') return '#4CAF50';
  if (finalLevel === 'Good') return '#8BC34A';
  if (finalLevel === 'Moderate') return '#FFC107';
  if (finalLevel === 'Weak') return '#FF9800';
  return '#F44336';
}

export function buildAuthenticRating(options: {
  hourPlanet: Planet;
  hourElement: Element;
  userElement: Element;
  planetStrength: number;
}): AuthenticTimingRating {
  const primary = evaluateHourRulerStrength(options.planetStrength);
  const modifier = evaluateElementalRelationship(options.userElement, options.hourElement);
  const finalLevel = calculateFinalLevel(primary, modifier);

  return {
    hourPlanet: options.hourPlanet,
    hourElement: options.hourElement,
    userElement: options.userElement,
    planetStrength: options.planetStrength,
    primary,
    modifier,
    finalLevel,
    stars: getStars(finalLevel),
    labelKey: getLabelKey(finalLevel),
    color: getColor(finalLevel),
  };
}

export function computeHourRulerStrengthFromTransits(options: {
  hourPlanet: Planet;
  transits: any;
}): number | null {
  const planet = options.hourPlanet as string;
  const transit: any = options.transits?.[planet] ?? options.transits?.[planet?.toLowerCase?.()] ?? null;
  const sunTransit: any = options.transits?.Sun ?? options.transits?.sun ?? null;
  if (!transit || !sunTransit) return null;

  const analysis = calculateEnhancedPlanetaryPower(
    options.hourPlanet as any,
    transit.sign,
    transit.signDegree ?? 0,
    transit.longitude ?? 0,
    sunTransit.longitude ?? 0,
    transit.isRetrograde ?? false
  );

  return Math.round(analysis.finalPower);
}

export function getPlanetaryRecommendations(planet: Planet): {
  recommended: string[];
  avoid: string[];
  dhikr?: string;
  dhikrArabic?: string;
} {
  const data = getPlanetaryData(planet as unknown as BlessingPlanet);
  return {
    recommended: data.favorableFor,
    avoid: data.avoid,
    dhikr: data.dhikr,
    dhikrArabic: data.dhikrArabic,
  };
}
