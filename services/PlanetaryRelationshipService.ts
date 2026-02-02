/**
 * Planetary Relationship Service
 * ================================
 * Analyzes friendship/enmity between planets based on traditional
 * Jyotish (Vedic astrology) and Islamic astrological principles
 * 
 * Theory:
 * - Each planet has natural friends, neutrals, and enemies
 * - These relationships affect how planetary energies interact
 * - Used for daily guidance synthesis and moment alignment
 * 
 * Sources:
 * - Classical Jyotish planetary friendship tables
 * - Traditional Islamic astrological texts
 * - Ilm al-Nujum (Islamic astronomy/astrology)
 */

import type { Element, Planet } from './PlanetaryHoursService';

function isProbablyEnglishFallbackText(
  text: string,
  t: (key: string, params?: Record<string, string | number>) => string
): boolean {
  const trimmed = String(text || '').trim();
  if (!trimmed) return false;

  const planetPairs: Array<[string, string]> = [
    ['Sun', t('planets.sun')],
    ['Moon', t('planets.moon')],
    ['Mars', t('planets.mars')],
    ['Mercury', t('planets.mercury')],
    ['Jupiter', t('planets.jupiter')],
    ['Venus', t('planets.venus')],
    ['Saturn', t('planets.saturn')],
  ];

  for (const [enName, localized] of planetPairs) {
    if (localized && localized !== enName && trimmed.includes(enName)) {
      return true;
    }
  }

  const elementPairs: Array<[string, string]> = [
    ['Fire', t('elements.fire')],
    ['Water', t('elements.water')],
    ['Air', t('elements.air')],
    ['Earth', t('elements.earth')],
  ];

  for (const [enName, localized] of elementPairs) {
    if (localized && localized !== enName && trimmed.includes(enName)) {
      return true;
    }
  }

  return false;
}

export type PlanetaryRelationship = 'friend' | 'neutral' | 'enemy';

/**
 * Classical planetary friendships matrix
 * Based on traditional Jyotish principles
 * 
 * Format: "Planet1-Planet2"
 * Each relationship is directional (though often symmetrical)
 */
const PLANETARY_FRIENDSHIPS: Record<string, PlanetaryRelationship> = {
  // Sun relationships
  'Sun-Moon': 'friend',
  'Sun-Mars': 'friend',
  'Sun-Jupiter': 'friend',
  'Sun-Mercury': 'neutral',
  'Sun-Venus': 'enemy',
  'Sun-Saturn': 'enemy',
  
  // Moon relationships
  'Moon-Sun': 'friend',
  'Moon-Mercury': 'friend',
  'Moon-Mars': 'neutral',
  'Moon-Jupiter': 'neutral',
  'Moon-Venus': 'neutral',
  'Moon-Saturn': 'enemy',
  
  // Mars relationships
  'Mars-Sun': 'friend',
  'Mars-Moon': 'friend',
  'Mars-Jupiter': 'friend',
  'Mars-Mercury': 'neutral',
  'Mars-Venus': 'enemy',
  'Mars-Saturn': 'neutral',
  
  // Mercury relationships
  'Mercury-Sun': 'friend',
  'Mercury-Venus': 'friend',
  'Mercury-Moon': 'neutral',
  'Mercury-Mars': 'enemy',
  'Mercury-Jupiter': 'neutral',
  'Mercury-Saturn': 'neutral',
  
  // Jupiter relationships
  'Jupiter-Sun': 'friend',
  'Jupiter-Moon': 'friend',
  'Jupiter-Mars': 'friend',
  'Jupiter-Mercury': 'neutral',
  'Jupiter-Venus': 'enemy',
  'Jupiter-Saturn': 'neutral',
  
  // Venus relationships
  'Venus-Mercury': 'friend',
  'Venus-Saturn': 'friend',
  'Venus-Mars': 'enemy',
  'Venus-Jupiter': 'enemy',
  'Venus-Sun': 'neutral',
  'Venus-Moon': 'neutral',
  
  // Saturn relationships
  'Saturn-Mercury': 'friend',
  'Saturn-Venus': 'friend',
  'Saturn-Jupiter': 'neutral',
  'Saturn-Mars': 'neutral',
  'Saturn-Sun': 'enemy',
  'Saturn-Moon': 'enemy',
};

/**
 * Get the relationship between two planets
 * 
 * @param planet1 - First planet (typically day ruler)
 * @param planet2 - Second planet (typically user's planet)
 * @returns The relationship type (friend, neutral, or enemy)
 */
export function getPlanetaryRelationship(
  planet1: Planet,
  planet2: Planet
): PlanetaryRelationship {
  // Same planet is always friendly
  if (planet1 === planet2) {
    return 'friend';
  }
  
  const key = `${planet1}-${planet2}`;
  return PLANETARY_FRIENDSHIPS[key] || 'neutral';
}

/**
 * Convert relationship to numerical score (0-100)
 * Used for calculating overall quality of the day
 * 
 * @param relationship - The planetary relationship
 * @returns Score from 0-100
 */
export function getRelationshipScore(
  relationship: PlanetaryRelationship
): number {
  switch (relationship) {
    case 'friend': return 90;
    case 'neutral': return 60;
    case 'enemy': return 30;
  }
}

/**
 * Get human-readable label for a relationship
 * 
 * @param relationship - The planetary relationship
 * @param t - Translation function
 * @returns Localized label
 */
export function getRelationshipLabel(
  relationship: PlanetaryRelationship,
  t: (key: string, params?: Record<string, string | number>) => string
): string {
  switch (relationship) {
    case 'friend': return t('dailyEnergy.friendship.strongFriends');
    case 'neutral': return t('dailyEnergy.friendship.neutral');
    case 'enemy': return t('dailyEnergy.friendship.tension');
  }
}

/**
 * Get descriptive text for planetary friendship
 * Uses translation keys with planet-specific descriptions
 * 
 * @param dayRuler - The day's ruling planet
 * @param userPlanet - The user's personal planet
 * @param t - Translation function
 * @returns Localized description of how the planets interact
 */
export function getPlanetaryFriendshipDesc(
  dayRuler: Planet,
  userPlanet: Planet,
  t: (key: string, params?: Record<string, string | number>) => string
): string {
  const dayPlanetLabel = t(`planets.${dayRuler.toLowerCase()}`);
  const userPlanetLabel = t(`planets.${userPlanet.toLowerCase()}`);

  // Same planet
  if (dayRuler === userPlanet) {
    return t('dailyEnergy.descriptions.planetaryFriendship.samePlanet', {
      dayPlanet: dayPlanetLabel,
      userPlanet: userPlanetLabel,
    });
  }
  
  // Use translation key for specific planet pair
  const key = `planetaryRelations.${dayRuler}-${userPlanet}`;
  const translated = t(key);
  
  // If translation exists and is different from key, use it
  if (translated && translated !== key && !isProbablyEnglishFallbackText(translated, t)) {
    return translated;
  }
  
  // Fallback: generic relationship description
  const relationship = getPlanetaryRelationship(dayRuler, userPlanet);
  switch (relationship) {
    case 'friend':
      return t('dailyEnergy.descriptions.planetaryFriendship.friend', {
        dayPlanet: dayPlanetLabel,
        userPlanet: userPlanetLabel,
      });
    case 'neutral':
      return t('dailyEnergy.descriptions.planetaryFriendship.neutral', {
        dayPlanet: dayPlanetLabel,
        userPlanet: userPlanetLabel,
      });
    case 'enemy':
      return t('dailyEnergy.descriptions.planetaryFriendship.enemy', {
        dayPlanet: dayPlanetLabel,
        userPlanet: userPlanetLabel,
      });
  }
}

/**
 * Elemental relationship types
 * Based on classical elemental theory
 */
export type ElementRelation = 'same' | 'supportive' | 'neutral' | 'tension';

/**
 * Get relationship between two elements
 * 
 * Classical elemental relationships:
 * - Same: Amplification
 * - Fire + Air: Supportive (air fans fire)
 * - Water + Earth: Supportive (water nourishes earth)
 * - Fire + Water: Tension (opposing forces)
 * - Air + Earth: Neutral
 * 
 * SPECIAL CASES (based on planetary ruler nuances):
 * - Scorpio (Mars-ruled water) + Fire: Supportive (shares fire's intensity)
 * - Aquarius (Saturn-ruled cold air) + Water: Neutral (shares water's coldness)
 * 
 * @param element1 - First element (typically user's element)
 * @param element2 - Second element (typically time/transit element)
 * @param userSignKey - Optional user's zodiac sign key (for special harmony rules)
 * @returns The elemental relationship
 */
export function getElementRelationship(
  element1: Element,
  element2: Element,
  userSignKey?: string
): ElementRelation {
  // Same element
  if (element1 === element2) {
    return 'same';
  }
  
  // SPECIAL CASE: Scorpio (Mars-ruled water) shares fire's intensity
  // When user is Scorpio, treat fire as supportive (not tension)
  // This applies regardless of the user's calculated Abjad element
  if (userSignKey === 'scorpio' && element2 === 'fire') {
    return 'supportive';
  }
  
  // SPECIAL CASE: Aquarius (Saturn-ruled cold air) shares water's coldness  
  // When user is Aquarius, treat water as neutral (not tension)
  // This applies regardless of the user's calculated Abjad element
  if (userSignKey === 'aquarius' && element2 === 'water') {
    return 'neutral';
  }
  
  // Supportive pairs
  if (
    (element1 === 'fire' && element2 === 'air') ||
    (element1 === 'air' && element2 === 'fire') ||
    (element1 === 'water' && element2 === 'earth') ||
    (element1 === 'earth' && element2 === 'water')
  ) {
    return 'supportive';
  }
  
  // Tension pairs (opposites)
  if (
    (element1 === 'fire' && element2 === 'water') ||
    (element1 === 'water' && element2 === 'fire') ||
    (element1 === 'air' && element2 === 'earth') ||
    (element1 === 'earth' && element2 === 'air')
  ) {
    return 'tension';
  }
  
  // Everything else is neutral
  return 'neutral';
}

/**
 * Convert elemental relationship to score
 * 
 * @param relation - The elemental relationship
 * @returns Score from 0-100
 */
export function getElementScore(relation: ElementRelation): number {
  switch (relation) {
    case 'same': return 90;
    case 'supportive': return 75;
    case 'neutral': return 50;
    case 'tension': return 25;
  }
}

/**
 * Get label for elemental relationship
 * 
 * @param relation - The elemental relationship
 * @param t - Translation function
 * @returns Localized label
 */
export function getElementRelationLabel(
  relation: ElementRelation,
  t: (key: string, params?: Record<string, string | number>) => string
): string {
  switch (relation) {
    case 'same': return t('dailyEnergy.friendship.strongFriends');
    case 'supportive': return t('dailyEnergy.friendship.friends');
    case 'neutral': return t('dailyEnergy.friendship.neutral');
    case 'tension': return t('dailyEnergy.friendship.tension');
  }
}

/**
 * Get descriptive text for elemental harmony
 * 
 * @param dayElement - The day's element
 * @param userElement - The user's element
 * @param t - Translation function
 * @param userSignKey - Optional user's zodiac sign for special harmony rules
 * @returns Localized description
 */
export function getElementalHarmonyDesc(
  dayElement: Element,
  userElement: Element,
  t: (key: string, params?: Record<string, string | number>) => string,
  userSignKey?: string
): string {
  // Use translation key for specific element pair
  const key = `elementalRelations.${userElement}-${dayElement}`;
  const translated = t(key);
  
  // If translation exists and is different from key, use it
  if (translated && translated !== key && !isProbablyEnglishFallbackText(translated, t)) {
    return translated;
  }
  
  // Fallback: generic description (with sign-based nuances)
  const relation = getElementRelationship(userElement, dayElement, userSignKey);
  const userElementLabel = t(`elements.${userElement}`);
  const dayElementLabel = t(`elements.${dayElement}`);
  
  switch (relation) {
    case 'same':
      return t('dailyEnergy.descriptions.elementalHarmony.same', {
        userElement: userElementLabel,
        dayElement: dayElementLabel,
      });
    case 'supportive':
      return t('dailyEnergy.descriptions.elementalHarmony.supportive', {
        userElement: userElementLabel,
        dayElement: dayElementLabel,
      });
    case 'neutral':
      return t('dailyEnergy.descriptions.elementalHarmony.neutral', {
        userElement: userElementLabel,
        dayElement: dayElementLabel,
      });
    case 'tension':
      return t('dailyEnergy.descriptions.elementalHarmony.tension', {
        userElement: userElementLabel,
        dayElement: dayElementLabel,
      });
  }
}

/**
 * Get strength label based on score
 * 
 * @param score - Numerical score (0-100)
 * @param t - Translation function
 * @returns Localized strength label
 */
export function getStrengthLabel(
  score: number,
  t: (key: string, params?: Record<string, string | number>) => string
): string {
  if (score >= 80) return t('dailyEnergy.strengthLabels.veryStrong');
  if (score >= 60) return t('dailyEnergy.strengthLabels.strong');
  if (score >= 40) return t('dailyEnergy.strengthLabels.moderate');
  if (score >= 20) return t('dailyEnergy.strengthLabels.weak');
  return t('dailyEnergy.strengthLabels.veryWeak');
}

/**
 * Get description of daily strength
 * Based on the day ruler's current transit power
 * 
 * @param dayRuler - The day's ruling planet
 * @param strengthScore - The transit power score (0-100)
 * @param t - Translation function
 * @returns Localized description
 */
export function getDailyStrengthDesc(
  dayRuler: Planet,
  strengthScore: number,
  t: (key: string, params?: Record<string, string | number>) => string
): string {
  const planetLabel = t(`planets.${dayRuler.toLowerCase()}`);

  if (strengthScore >= 80) {
    return t('dailyEnergy.descriptions.dailyStrength.veryStrong', { planet: planetLabel });
  }
  if (strengthScore >= 60) {
    return t('dailyEnergy.descriptions.dailyStrength.strong', { planet: planetLabel });
  }
  if (strengthScore >= 40) {
    return t('dailyEnergy.descriptions.dailyStrength.moderate', { planet: planetLabel });
  }
  if (strengthScore >= 20) {
    return t('dailyEnergy.descriptions.dailyStrength.weak', { planet: planetLabel });
  }
  return t('dailyEnergy.descriptions.dailyStrength.veryWeak', { planet: planetLabel });
}
