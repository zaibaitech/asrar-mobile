/**
 * Moon Transit Advice Utility
 * 
 * Provides personalized guidance for Moon transits based on user's Sun/Ascendant sign.
 * Special handling for Scorpio Moon - Mars-ruled "boiling water" that complements fire signs.
 */

export type MoonTransitAdvice = {
  rating: string;
  description: string;
  bestFor: string;
  avoid: string;
  insight?: string;
};

/**
 * Get personalized Moon transit advice based on the current Moon sign and user's sign
 * 
 * @param moonSign - The current Moon's zodiac sign
 * @param userSunOrAscendant - The user's Sun or Ascendant sign
 * @param t - Translation function
 * @returns MoonTransitAdvice object with translated content
 */
export const getMoonTransitAdvice = (
  moonSign: string,
  userSunOrAscendant: string,
  t: (key: string) => any
): MoonTransitAdvice => {
  const moon = moonSign.toLowerCase();
  const user = userSunOrAscendant.toLowerCase();

  // Special case: Scorpio moon with fire signs
  // Scorpio is Mars-ruled water - "boiling water" that complements fire's intensity
  if (moon === 'scorpio') {
    if (user === 'leo') {
      return t('moonTransits.scorpioForLeo');
    }
    if (user === 'aries') {
      return t('moonTransits.scorpioForAries');
    }
    if (user === 'sagittarius') {
      return t('moonTransits.scorpioForSagittarius');
    }
    // Default for other signs with Scorpio moon
    return t('moonTransits.scorpioDefault');
  }

  // REVERSE CASE: Fire moon with Scorpio user
  // Scorpio users benefit from fire moon transits due to their Mars-ruled nature
  if (user === 'scorpio') {
    if (moon === 'leo') {
      return t('moonTransits.leoForScorpio');
    }
    if (moon === 'aries') {
      return t('moonTransits.ariesForScorpio');
    }
    if (moon === 'sagittarius') {
      return t('moonTransits.sagittariusForScorpio');
    }
  }

  // Your existing transit logic for other moons can be added here
  return getDefaultTransitAdvice(moon, user, t);
};

/**
 * Get default transit advice for non-Scorpio moon transits
 * This can be expanded with more sign-specific advice
 */
const getDefaultTransitAdvice = (
  moonSign: string,
  userSign: string,
  t: (key: string) => any
): MoonTransitAdvice => {
  const moonElement = getElementFromSign(moonSign);
  const userElement = getElementFromSign(userSign);
  
  // Determine harmony level
  const harmony = getElementHarmony(moonElement, userElement);
  
  // Return generic advice based on harmony
  // This can be expanded with specific translation keys
  return {
    rating: harmony === 'harmonious' ? 'Harmonious' : 
            harmony === 'complementary' ? 'Supportive' :
            harmony === 'challenging' ? 'Challenging' : 'Neutral',
    description: `Moon in ${capitalize(moonSign)} - ${moonElement} energy influences ${userElement} nature.`,
    bestFor: getGenericBestFor(moonSign),
    avoid: getGenericAvoid(moonSign),
  };
};

/**
 * Get element from zodiac sign
 */
const getElementFromSign = (sign: string): string => {
  const fireSign = ['aries', 'leo', 'sagittarius'];
  const earthSigns = ['taurus', 'virgo', 'capricorn'];
  const airSigns = ['gemini', 'libra', 'aquarius'];
  const waterSigns = ['cancer', 'scorpio', 'pisces'];
  
  if (fireSign.includes(sign)) return 'fire';
  if (earthSigns.includes(sign)) return 'earth';
  if (airSigns.includes(sign)) return 'air';
  if (waterSigns.includes(sign)) return 'water';
  return 'unknown';
};

/**
 * Determine element harmony
 */
const getElementHarmony = (moonElement: string, userElement: string): string => {
  // Same element = harmonious
  if (moonElement === userElement) return 'harmonious';
  
  // Fire + Air = complementary (both active)
  // Earth + Water = complementary (both receptive)
  const activeElements = ['fire', 'air'];
  const receptiveElements = ['earth', 'water'];
  
  if (activeElements.includes(moonElement) && activeElements.includes(userElement)) {
    return 'complementary';
  }
  if (receptiveElements.includes(moonElement) && receptiveElements.includes(userElement)) {
    return 'complementary';
  }
  
  // Fire + Water or Earth + Air = challenging (opposite nature)
  // BUT: Scorpio water is special - Mars-ruled, so complementary with fire
  // This special case is handled in getMoonTransitAdvice before this function is called
  
  return 'challenging';
};

/**
 * Get generic "best for" activities based on moon sign
 */
const getGenericBestFor = (moonSign: string): string => {
  const signActivities: Record<string, string> = {
    aries: 'Starting new projects, physical activity, bold decisions',
    taurus: 'Financial matters, self-care, building stability',
    gemini: 'Communication, learning, networking',
    cancer: 'Family time, home projects, emotional healing',
    leo: 'Creative expression, leadership, celebration',
    virgo: 'Organization, health routines, detailed work',
    libra: 'Relationships, diplomacy, aesthetic pursuits',
    scorpio: 'Research, healing, spiritual practices, deep conversations',
    sagittarius: 'Travel, philosophy, higher learning',
    capricorn: 'Career moves, long-term planning, discipline',
    aquarius: 'Innovation, community work, humanitarian efforts',
    pisces: 'Meditation, creative arts, spiritual practices',
  };
  
  return signActivities[moonSign] || 'Reflection and general activities';
};

/**
 * Get generic "avoid" activities based on moon sign
 */
const getGenericAvoid = (moonSign: string): string => {
  const signAvoid: Record<string, string> = {
    aries: 'Impulsiveness, conflicts, rushing important decisions',
    taurus: 'Overindulgence, stubbornness, resistance to change',
    gemini: 'Scattered energy, gossip, superficial commitments',
    cancer: 'Over-sensitivity, clinging to the past, emotional eating',
    leo: 'Ego battles, drama, attention-seeking',
    virgo: 'Excessive criticism, perfectionism, overworking',
    libra: 'Indecision, people-pleasing, avoiding conflict',
    scorpio: 'Superficiality, manipulation, control battles',
    sagittarius: 'Overcommitting, tactlessness, ignoring details',
    capricorn: 'Rigidity, workaholism, pessimism',
    aquarius: 'Detachment, rebellion without cause, stubbornness',
    pisces: 'Escapism, confusion, boundary issues',
  };
  
  return signAvoid[moonSign] || 'Hasty decisions and unnecessary conflicts';
};

/**
 * Capitalize first letter
 */
const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Check if a chart has Scorpio placements
 * Used to show the special Scorpio water nuance box
 */
export const hasScorpioPlacement = (chartData: {
  sunSign?: string;
  moonSign?: string;
  ascendant?: string;
  planets?: Array<{ sign?: string }>;
}): boolean => {
  const signs = [
    chartData.sunSign,
    chartData.moonSign,
    chartData.ascendant,
    ...(chartData.planets?.map(p => p.sign) || []),
  ].filter(Boolean).map(s => s?.toLowerCase());
  
  return signs.includes('scorpio');
};

/**
 * Get the appropriate element nuance key for water signs
 */
export const getWaterSignNuanceKey = (sign: string): string | null => {
  const normalizedSign = sign.toLowerCase();
  
  switch (normalizedSign) {
    case 'scorpio':
      return 'elementNuances.scorpioWater';
    case 'cancer':
      return 'elementNuances.cancerWater';
    case 'pisces':
      return 'elementNuances.piscesWater';
    default:
      return null;
  }
};
