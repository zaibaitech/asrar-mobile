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

import type { Planet, Element } from './PlanetaryHoursService';

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
  t: (key: string) => string
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
  t: (key: string) => string
): string {
  // Same planet
  if (dayRuler === userPlanet) {
    return `${dayRuler} energy resonates perfectly with your ${userPlanet} nature — powerful amplification`;
  }
  
  // Use translation key for specific planet pair
  const key = `planetaryRelations.${dayRuler}-${userPlanet}`;
  const translated = t(key);
  
  // If translation exists and is different from key, use it
  if (translated && translated !== key) {
    return translated;
  }
  
  // Fallback: generic relationship description
  const relationship = getPlanetaryRelationship(dayRuler, userPlanet);
  switch (relationship) {
    case 'friend':
      return `${dayRuler} and ${userPlanet} work together harmoniously`;
    case 'neutral':
      return `${dayRuler} and ${userPlanet} work together neutrally`;
    case 'enemy':
      return `${dayRuler} and ${userPlanet} create creative tension`;
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
 * @param element1 - First element
 * @param element2 - Second element
 * @returns The elemental relationship
 */
export function getElementRelationship(
  element1: Element,
  element2: Element
): ElementRelation {
  // Same element
  if (element1 === element2) {
    return 'same';
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
  t: (key: string) => string
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
 * @returns Localized description
 */
export function getElementalHarmonyDesc(
  dayElement: Element,
  userElement: Element,
  t: (key: string) => string
): string {
  // Use translation key for specific element pair
  const key = `elementalRelations.${userElement}-${dayElement}`;
  const translated = t(key);
  
  // If translation exists and is different from key, use it
  if (translated && translated !== key) {
    return translated;
  }
  
  // Fallback: generic description
  const relation = getElementRelationship(userElement, dayElement);
  const capitalizedUser = userElement.charAt(0).toUpperCase() + userElement.slice(1);
  const capitalizedDay = dayElement.charAt(0).toUpperCase() + dayElement.slice(1);
  
  switch (relation) {
    case 'same':
      return `${capitalizedUser} strengthens ${capitalizedDay} — powerful resonance`;
    case 'supportive':
      return `${capitalizedDay} supports your ${capitalizedUser} nature — harmonious flow`;
    case 'neutral':
      return `${capitalizedDay} and ${capitalizedUser} work together adaptably`;
    case 'tension':
      return `${capitalizedDay} and ${capitalizedUser} create dynamic tension — navigate mindfully`;
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
  t: (key: string) => string
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
  t: (key: string) => string
): string {
  const strengthLabel = getStrengthLabel(strengthScore, t).toLowerCase();
  
  if (strengthScore >= 80) {
    return `${dayRuler} is exceptionally strong today — favorable for ${dayRuler}-related activities`;
  } else if (strengthScore >= 60) {
    return `${dayRuler} has good strength today — supportive energy available`;
  } else if (strengthScore >= 40) {
    return `${dayRuler} has moderate strength — steady but not exceptional`;
  } else if (strengthScore >= 20) {
    return `${dayRuler} is somewhat weak today — gentler approach recommended`;
  } else {
    return `${dayRuler} is very weak today — better to wait for stronger timing`;
  }
}
