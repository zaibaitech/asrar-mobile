/**
 * Planetary Strength Calculation Service
 * ======================================
 * 
 * Implements classical Islamic astrology factors for accurate timing analysis:
 * - Degree-based strength (Quwwat al-Darajāt)
 * - Essential dignities (Al-Karāmāt al-Dhātīyah)
 * - Combustion rules (Al-Iḥtirāq)
 * - Retrograde status (Al-Rujūʿ)
 * 
 * References:
 * - Al-Qabīsī (10th century)
 * - Ibn ʿArabī's astrological teachings
 * - Medieval Islamic astronomical tradition
 */

import type { Planet } from '@/services/PlanetaryHoursService';
import type { ZodiacSign } from '@/types/planetary-systems';

// ============================================================================
// ESSENTIAL DIGNITIES (Classical Rulerships)
// ============================================================================

export interface Dignities {
  own: ZodiacSign[];      // Domicile (البيت) - Planet's home sign(s)
  exaltation: ZodiacSign; // Exaltation (الشرف) - Planet's highest power
  detriment: ZodiacSign[]; // Detriment (الوبال) - Opposite of home
  fall: ZodiacSign;       // Fall (الهبوط) - Opposite of exaltation
}

export const ESSENTIAL_DIGNITIES: Record<Planet, Dignities> = {
  Sun: {
    own: ['leo'],
    exaltation: 'aries',
    detriment: ['aquarius'],
    fall: 'libra',
  },
  Moon: {
    own: ['cancer'],
    exaltation: 'taurus',
    detriment: ['capricorn'],
    fall: 'scorpio',
  },
  Mercury: {
    own: ['gemini', 'virgo'],
    exaltation: 'virgo',
    detriment: ['sagittarius', 'pisces'],
    fall: 'pisces',
  },
  Venus: {
    own: ['taurus', 'libra'],
    exaltation: 'pisces',
    detriment: ['aries', 'scorpio'],
    fall: 'virgo',
  },
  Mars: {
    own: ['aries', 'scorpio'],
    exaltation: 'capricorn',
    detriment: ['libra', 'taurus'],
    fall: 'cancer',
  },
  Jupiter: {
    own: ['sagittarius', 'pisces'],
    exaltation: 'cancer',
    detriment: ['gemini', 'virgo'],
    fall: 'capricorn',
  },
  Saturn: {
    own: ['capricorn', 'aquarius'],
    exaltation: 'libra',
    detriment: ['cancer', 'leo'],
    fall: 'aries',
  },
};

// ============================================================================
// DEGREE STRENGTH (Quwwat al-Darajāt)
// ============================================================================

export interface DegreeStrengthInfo {
  strength: number; // 0.0 to 1.0
  quality: 'Weak' | 'Moderate' | 'Strong' | 'Weakening';
  arabicTerm: string;
  description: string;
}

/**
 * Calculate planetary strength based on degree position within a sign
 * Based on classical Islamic astrology teaching
 */
export function getDegreeStrength(degree: number): DegreeStrengthInfo {
  // Normalize degree to 0-30 range
  const normalizedDegree = degree % 30;

  // 0-6°: Weak (just entered sign, not settled)
  if (normalizedDegree >= 0 && normalizedDegree < 6) {
    return {
      strength: 0.4,
      quality: 'Weak',
      arabicTerm: 'ضعيف (Ḍaʿīf)',
      description: `Planet just entered sign (${normalizedDegree.toFixed(1)}°) - not yet settled. Wait for better timing.`,
    };
  }

  // 6-15°: Moderate (gaining strength)
  if (normalizedDegree >= 6 && normalizedDegree < 15) {
    return {
      strength: 0.7,
      quality: 'Moderate',
      arabicTerm: 'متوسط (Mutawassiṭ)',
      description: `Planet gaining strength (${normalizedDegree.toFixed(1)}°) - good for general work.`,
    };
  }

  // 15-26°: Strong (peak power)
  if (normalizedDegree >= 15 && normalizedDegree < 26) {
    return {
      strength: 1.0,
      quality: 'Strong',
      arabicTerm: 'قوي (Qawī)',
      description: `Planet at peak power (${normalizedDegree.toFixed(1)}°) - excellent for major work.`,
    };
  }

  // 26-30°: Weakening (preparing to leave)
  if (normalizedDegree >= 26 && normalizedDegree <= 30) {
    return {
      strength: 0.6,
      quality: 'Weakening',
      arabicTerm: 'منحط (Munḥaṭiṭ)',
      description: `Planet preparing to leave sign (${normalizedDegree.toFixed(1)}°) - good for finishing, not starting.`,
    };
  }

  return {
    strength: 0.5,
    quality: 'Moderate',
    arabicTerm: 'غير مؤكد',
    description: 'Degree position unclear',
  };
}

// ============================================================================
// ESSENTIAL DIGNITY MODIFIERS
// ============================================================================

export interface DignityInfo {
  modifier: number; // Multiplier (0.5 to 1.4)
  status: 'Domicile' | 'Exalted' | 'Detriment' | 'Fall' | 'Neutral';
  arabicTerm: string;
  description: string;
}

/**
 * Calculate dignity modifier for a planet in a given sign
 */
export function getEssentialDignityModifier(
  planet: Planet,
  sign: ZodiacSign
): DignityInfo {
  const dignities = ESSENTIAL_DIGNITIES[planet];

  // Check if in own sign (Domicile)
  if (dignities.own.includes(sign)) {
    return {
      modifier: 1.3,
      status: 'Domicile',
      arabicTerm: 'في بيته (Fī Baytihi)',
      description: `${planet} in its own sign - very strong and comfortable.`,
    };
  }

  // Check if in exaltation
  if (dignities.exaltation === sign) {
    return {
      modifier: 1.4,
      status: 'Exalted',
      arabicTerm: 'في شرفه (Fī Sharafihi)',
      description: `${planet} exalted - at peak power and honor.`,
    };
  }

  // Check if in detriment
  if (dignities.detriment.includes(sign)) {
    return {
      modifier: 0.7,
      status: 'Detriment',
      arabicTerm: 'في وباله (Fī Wabālihi)',
      description: `${planet} in opposing sign - weakened and uncomfortable.`,
    };
  }

  // Check if in fall
  if (dignities.fall === sign) {
    return {
      modifier: 0.5,
      status: 'Fall',
      arabicTerm: 'في هبوطه (Fī Hubūṭihi)',
      description: `${planet} in fall - very weak, struggles to express.`,
    };
  }

  // Neutral (peregrine)
  return {
    modifier: 1.0,
    status: 'Neutral',
    arabicTerm: 'محايد (Muḥāyid)',
    description: `${planet} in neutral territory - average strength.`,
  };
}

// ============================================================================
// COMBUSTION CHECK (Al-Iḥtirāq)
// ============================================================================

export interface CombustionInfo {
  isCombust: boolean;
  modifier: number;
  distanceFromSun: number;
  status: 'clear' | 'beams' | 'combust';
  description: string;
}

/**
 * Check if planet is combust or under Sun's beams
 * Classical rule: Within 8° of Sun = combust (severely weakened)
 * Within 15° = under beams (moderately weakened)
 * Exception: Moon and Sun don't get combust
 */
export function isCombust(
  planetLongitude: number,
  sunLongitude: number,
  planet: Planet
): CombustionInfo {
  // Sun and Moon not subject to combustion
  if (planet === 'Sun' || planet === 'Moon') {
    return {
      isCombust: false,
      modifier: 1.0,
      distanceFromSun: 0,
      status: 'clear',
      description: `${planet} not subject to combustion rules.`,
    };
  }

  // Calculate angular distance
  let distance = Math.abs(planetLongitude - sunLongitude);

  // Normalize to 0-180 range (shortest arc)
  if (distance > 180) {
    distance = 360 - distance;
  }

  // Within 8° = combustion (severe weakness)
  if (distance < 8) {
    return {
      isCombust: true,
      modifier: 0.5,
      distanceFromSun: distance,
      status: 'combust',
      description: `${planet} too close to Sun (${distance.toFixed(1)}°) - power severely weakened. Avoid this hour.`,
    };
  }

  // Within 15° = under the beams (moderate weakness)
  if (distance < 15) {
    return {
      isCombust: false,
      modifier: 0.75,
      distanceFromSun: distance,
      status: 'beams',
      description: `${planet} under Sun's beams (${distance.toFixed(1)}°) - moderately weakened.`,
    };
  }

  return {
    isCombust: false,
    modifier: 1.0,
    distanceFromSun: distance,
    status: 'clear',
    description: `${planet} clear of Sun (${distance.toFixed(1)}°) - no combustion.`,
  };
}

// ============================================================================
// RETROGRADE MODIFIER
// ============================================================================

export interface RetrogradeInfo {
  modifier: number;
  description: string;
  suitable: {
    outer: boolean;
    inner: boolean;
  };
}

/**
 * Get retrograde modifier based on work type
 */
export function getRetrogradeModifier(
  isRetrograde: boolean
): RetrogradeInfo {
  if (!isRetrograde) {
    return {
      modifier: 1.0,
      description: 'Direct motion - normal flow.',
      suitable: {
        outer: true,
        inner: true,
      },
    };
  }

  return {
    modifier: 1.0, // Same power, but different application
    description: 'Retrograde motion - excellent for inner/reflective work, but delays in outer affairs.',
    suitable: {
      outer: false, // Avoid for material/external work
      inner: true, // Excellent for spiritual/internal work
    },
  };
}

// ============================================================================
// COMPLETE ENHANCED CALCULATION
// ============================================================================

export interface EnhancedPlanetaryPower {
  planet: Planet;
  sign: ZodiacSign;
  degree: number;

  // Component scores
  degreeStrength: number;
  dignityModifier: number;
  combustionModifier: number;
  retrogradeModifier: number;

  // Final calculation
  finalPower: number; // 0-100%

  // Detailed info
  degreeInfo: DegreeStrengthInfo;
  dignityInfo: DignityInfo;
  combustionInfo: CombustionInfo;
  retrogradeInfo: RetrogradeInfo;

  // Guidance
  recommendations: string[];
  warnings: string[];
  suitability: {
    outer: boolean;
    inner: boolean;
  };
}

/**
 * Calculate complete planetary power with all traditional factors
 */
export function calculateEnhancedPlanetaryPower(
  planet: Planet,
  sign: ZodiacSign,
  degree: number,
  longitude: number,
  sunLongitude: number,
  isRetrograde: boolean
): EnhancedPlanetaryPower {
  // Get all component strengths
  const degreeInfo = getDegreeStrength(degree);
  const dignityInfo = getEssentialDignityModifier(planet, sign);
  const combustionInfo = isCombust(longitude, sunLongitude, planet);
  const retrogradeInfo = getRetrogradeModifier(isRetrograde);

  // Calculate final power as multiplicative factor
  let finalPower =
    degreeInfo.strength *
    dignityInfo.modifier *
    combustionInfo.modifier *
    retrogradeInfo.modifier;

  // Clamp to 0-1 range and convert to percentage
  finalPower = Math.max(0, Math.min(1, finalPower)) * 100;

  // Generate recommendations and warnings
  const recommendations: string[] = [];
  const warnings: string[] = [];
  let outer = true;
  let inner = true;

  // Degree-based guidance
  if (degreeInfo.strength < 0.6) {
    warnings.push(degreeInfo.description);
    if (degreeInfo.quality === 'Weak') {
      recommendations.push(
        `Wait ${Math.ceil((6 - degree) * 2)} hours for planet to settle past 6°`
      );
    }
  } else if (degreeInfo.quality === 'Strong') {
    recommendations.push('Excellent degree - planet at peak power');
  }

  // Dignity-based guidance
  if (dignityInfo.status === 'Fall') {
    warnings.push(dignityInfo.description);
    recommendations.push('Avoid this planet - choose different hour or day');
    outer = false;
  } else if (dignityInfo.status === 'Detriment') {
    warnings.push(dignityInfo.description);
    recommendations.push('Not ideal - better alternatives available');
    outer = false;
  } else if (dignityInfo.status === 'Exalted') {
    recommendations.push(`${planet} exalted in ${sign} - highly recommended`);
  } else if (dignityInfo.status === 'Domicile') {
    recommendations.push(`${planet} in own sign - very favorable`);
  }

  // Combustion warnings
  if (combustionInfo.isCombust) {
    warnings.push(combustionInfo.description);
    outer = false;
  } else if (combustionInfo.status === 'beams') {
    warnings.push(combustionInfo.description);
  }

  // Retrograde guidance
  if (isRetrograde) {
    warnings.push('Planet retrograde');
    outer = false;
    if (!recommendations.includes('Good for inner/reflective work')) {
      recommendations.push(
        'Better for inner work, reflection, revision - avoid new material projects'
      );
    }
  }

  return {
    planet,
    sign,
    degree,
    degreeStrength: degreeInfo.strength,
    dignityModifier: dignityInfo.modifier,
    combustionModifier: combustionInfo.modifier,
    retrogradeModifier: retrogradeInfo.modifier,
    finalPower: Math.round(finalPower),
    degreeInfo,
    dignityInfo,
    combustionInfo,
    retrogradeInfo,
    recommendations,
    warnings,
    suitability: {
      outer,
      inner: true,
    },
  };
}

// ============================================================================
// UTILITY: Compare planets for best timing
// ============================================================================

export function selectBestPlanetForWork(
  planets: EnhancedPlanetaryPower[],
  workType: 'outer' | 'inner' = 'outer'
): EnhancedPlanetaryPower | null {
  if (planets.length === 0) return null;

  // Filter for suitability
  const suitable = planets.filter((p) =>
    workType === 'outer' ? p.suitability.outer : true
  );

  if (suitable.length === 0) return null;

  // Sort by final power descending
  suitable.sort((a, b) => b.finalPower - a.finalPower);
  return suitable[0];
}
