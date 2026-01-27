/**
 * Planetary Condition Service
 * ============================
 * Evaluates the astronomical and astrological condition of planets
 * using classical dignity, aspects, and motion analysis.
 * 
 * This is a core component of Tier 1: Objective Cosmic Quality
 */

import { getPlanetPositions } from './EphemerisService';
import type { Planet } from './PlanetaryHoursService';

// ============================================================================
// TYPES
// ============================================================================

export type ZodiacSign = 
  | 'Aries' | 'Taurus' | 'Gemini' | 'Cancer' 
  | 'Leo' | 'Virgo' | 'Libra' | 'Scorpio'
  | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';

export type DignityType = 
  | 'domicile'      // Planet in its own sign (strongest)
  | 'exaltation'    // Planet exalted (very strong)
  | 'detriment'     // Planet opposite its domicile (weak)
  | 'fall'          // Planet in fall (very weak)
  | 'peregrine';    // No essential dignity (neutral)

export type AspectType = 
  | 'conjunction'   // 0° - Fusion
  | 'sextile'       // 60° - Opportunity
  | 'square'        // 90° - Tension
  | 'trine'         // 120° - Harmony
  | 'opposition';   // 180° - Polarity

export type PlanetaryQuality = 
  | 'excellent'     // 80-100: Dignified, well-aspected
  | 'strong'        // 60-79: Good condition
  | 'moderate'      // 40-59: Mixed
  | 'weak'          // 20-39: Challenged
  | 'corrupted';    // 0-19: Severely debilitated

export interface ZodiacPosition {
  sign: ZodiacSign;
  degree: number;              // 0-30° within sign
  absoluteDegree: number;      // 0-360° zodiac position
}

export interface Dignity {
  type: DignityType;
  score: number;               // 0-100 based on dignity
  description: string;
  descriptionAr: string;
  descriptionFr: string;
}

export interface PlanetaryMotion {
  retrograde: boolean;
  speed: 'very-fast' | 'fast' | 'average' | 'slow' | 'stationary';
  speedScore: number;          // Relative to average speed
  dailyMotion: number;         // Degrees per day
}

export interface PlanetaryAspect {
  planet: Planet;
  aspect: AspectType;
  orb: number;                 // Distance from exact aspect
  applying: boolean;           // Getting closer (true) or separating (false)
  strength: number;            // 0-100 based on exactness
}

export interface PlanetaryAspects {
  combust: boolean;            // Within 8° of Sun (weakened)
  underBeams: boolean;         // Within 17° of Sun (still weakened)
  cazimi: boolean;             // Within 0.28° of Sun (empowered)
  majorAspects: PlanetaryAspect[];
}

export interface PlanetaryCondition {
  planet: Planet;
  timestamp: Date;
  
  position: ZodiacPosition;
  dignity: Dignity;
  motion: PlanetaryMotion;
  aspects: PlanetaryAspects;
  
  overallQuality: number;      // 0-100 composite score
  ruling: PlanetaryQuality;
  
  summary: {
    en: string;
    ar: string;
    fr: string;
  };
}

// ============================================================================
// CLASSICAL RULERSHIP TABLES
// ============================================================================

/**
 * Essential Dignities by Sign
 * Based on classical Islamic and Hellenistic astrology
 */
const PLANETARY_RULERSHIPS: Record<ZodiacSign, {
  domicile: Planet[];        // Rulers of this sign
  exaltation?: Planet;       // Exalted planet
  detriment: Planet[];       // Planets in detriment
  fall?: Planet;             // Fallen planet
}> = {
  'Aries': {
    domicile: ['Mars'],
    exaltation: 'Sun',
    detriment: ['Venus'],
    fall: 'Saturn',
  },
  'Taurus': {
    domicile: ['Venus'],
    exaltation: 'Moon',
    detriment: ['Mars'],
  },
  'Gemini': {
    domicile: ['Mercury'],
    detriment: ['Jupiter'],
  },
  'Cancer': {
    domicile: ['Moon'],
    exaltation: 'Jupiter',
    detriment: ['Saturn'],
    fall: 'Mars',
  },
  'Leo': {
    domicile: ['Sun'],
    detriment: ['Saturn'],
  },
  'Virgo': {
    domicile: ['Mercury'],
    exaltation: 'Mercury',
    detriment: ['Jupiter'],
    fall: 'Venus',
  },
  'Libra': {
    domicile: ['Venus'],
    exaltation: 'Saturn',
    detriment: ['Mars'],
    fall: 'Sun',
  },
  'Scorpio': {
    domicile: ['Mars'],
    detriment: ['Venus'],
    fall: 'Moon',
  },
  'Sagittarius': {
    domicile: ['Jupiter'],
    detriment: ['Mercury'],
  },
  'Capricorn': {
    domicile: ['Saturn'],
    exaltation: 'Mars',
    detriment: ['Moon'],
    fall: 'Jupiter',
  },
  'Aquarius': {
    domicile: ['Saturn'],
    detriment: ['Sun'],
  },
  'Pisces': {
    domicile: ['Jupiter'],
    exaltation: 'Venus',
    detriment: ['Mercury'],
    fall: 'Mercury',
  },
};

/**
 * Average daily motion for planets (degrees per day)
 * Used to determine if planet is moving fast or slow
 */
const AVERAGE_DAILY_MOTION: Record<Planet, number> = {
  Sun: 1.0,
  Moon: 13.2,
  Mercury: 1.4,
  Venus: 1.2,
  Mars: 0.5,
  Jupiter: 0.08,
  Saturn: 0.03,
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Convert absolute zodiac degree (0-360) to sign and degree
 */
function getZodiacPosition(absoluteDegree: number): ZodiacPosition {
  const signs: ZodiacSign[] = [
    'Aries', 'Taurus', 'Gemini', 'Cancer',
    'Leo', 'Virgo', 'Libra', 'Scorpio',
    'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];
  
  const normalizedDegree = ((absoluteDegree % 360) + 360) % 360;
  const signIndex = Math.floor(normalizedDegree / 30);
  const degreeInSign = normalizedDegree % 30;
  
  return {
    sign: signs[signIndex],
    degree: degreeInSign,
    absoluteDegree: normalizedDegree,
  };
}

/**
 * Calculate angular distance between two positions
 */
function getAngularDistance(pos1: number, pos2: number): number {
  const diff = Math.abs(pos1 - pos2);
  return Math.min(diff, 360 - diff);
}

/**
 * Determine aspect type from angular distance
 */
function getAspectType(distance: number): AspectType | null {
  const orb = 8; // Maximum orb for major aspects
  
  if (Math.abs(distance - 0) <= orb) return 'conjunction';
  if (Math.abs(distance - 60) <= orb) return 'sextile';
  if (Math.abs(distance - 90) <= orb) return 'square';
  if (Math.abs(distance - 120) <= orb) return 'trine';
  if (Math.abs(distance - 180) <= orb) return 'opposition';
  
  return null;
}

// ============================================================================
// DIGNITY ANALYSIS
// ============================================================================

/**
 * Calculate planetary dignity in current sign
 */
function calculateDignity(planet: Planet, position: ZodiacPosition): Dignity {
  const rulership = PLANETARY_RULERSHIPS[position.sign];
  
  // Check domicile
  if (rulership.domicile.includes(planet)) {
    return {
      type: 'domicile',
      score: 100,
      description: `${planet} in ${position.sign} (domicile) - Maximum strength`,
      descriptionAr: `${planet} في ${position.sign} (بيته) - قوة عظمى`,
      descriptionFr: `${planet} en ${position.sign} (domicile) - Force maximale`,
    };
  }
  
  // Check exaltation
  if (rulership.exaltation === planet) {
    return {
      type: 'exaltation',
      score: 90,
      description: `${planet} in ${position.sign} (exaltation) - Very strong`,
      descriptionAr: `${planet} في ${position.sign} (شرفه) - قوة كبيرة`,
      descriptionFr: `${planet} en ${position.sign} (exaltation) - Très fort`,
    };
  }
  
  // Check detriment
  if (rulership.detriment.includes(planet)) {
    return {
      type: 'detriment',
      score: 25,
      description: `${planet} in ${position.sign} (detriment) - Weakened`,
      descriptionAr: `${planet} في ${position.sign} (وباله) - ضعيف`,
      descriptionFr: `${planet} en ${position.sign} (exil) - Affaibli`,
    };
  }
  
  // Check fall
  if (rulership.fall === planet) {
    return {
      type: 'fall',
      score: 10,
      description: `${planet} in ${position.sign} (fall) - Very weak`,
      descriptionAr: `${planet} في ${position.sign} (هبوطه) - ضعيف جداً`,
      descriptionFr: `${planet} en ${position.sign} (chute) - Très faible`,
    };
  }
  
  // Peregrine (no essential dignity)
  return {
    type: 'peregrine',
    score: 50,
    description: `${planet} in ${position.sign} (peregrine) - Neutral`,
    descriptionAr: `${planet} في ${position.sign} (غريب) - محايد`,
    descriptionFr: `${planet} en ${position.sign} (pèlerin) - Neutre`,
  };
}

// ============================================================================
// MOTION ANALYSIS
// ============================================================================

/**
 * Analyze planetary motion characteristics
 */
function analyzeMotion(
  planet: Planet,
  dailyMotion: number,
  retrograde: boolean
): PlanetaryMotion {
  const avgMotion = AVERAGE_DAILY_MOTION[planet];
  const relativeSpeed = Math.abs(dailyMotion) / avgMotion;
  
  let speed: PlanetaryMotion['speed'];
  let speedScore: number;
  
  if (Math.abs(dailyMotion) < 0.01) {
    speed = 'stationary';
    speedScore = 30; // Stationary is generally weak
  } else if (relativeSpeed > 1.3) {
    speed = 'very-fast';
    speedScore = 90;
  } else if (relativeSpeed > 1.1) {
    speed = 'fast';
    speedScore = 75;
  } else if (relativeSpeed > 0.9) {
    speed = 'average';
    speedScore = 60;
  } else {
    speed = 'slow';
    speedScore = 40;
  }
  
  // Retrograde reduces score
  if (retrograde) {
    speedScore *= 0.5;
  }
  
  return {
    retrograde,
    speed,
    speedScore,
    dailyMotion,
  };
}

// ============================================================================
// ASPECT ANALYSIS
// ============================================================================

/**
 * Calculate aspects with other planets
 */
function calculateAspects(
  planet: Planet,
  position: number,
  allPositions: Record<Planet, number>
): PlanetaryAspects {
  const sunPosition = allPositions.Sun;
  const distanceToSun = getAngularDistance(position, sunPosition);
  
  // Check solar relationships
  const cazimi = distanceToSun <= 0.28;
  const combust = !cazimi && distanceToSun <= 8;
  const underBeams = !combust && distanceToSun <= 17;
  
  // Calculate major aspects with other planets
  const majorAspects: PlanetaryAspect[] = [];
  
  Object.entries(allPositions).forEach(([otherPlanet, otherPosition]) => {
    if (otherPlanet === planet) return;
    
    const distance = getAngularDistance(position, otherPosition);
    const aspectType = getAspectType(distance);
    
    if (aspectType) {
      const exactDistance = [0, 60, 90, 120, 180].find(exact => 
        Math.abs(distance - exact) <= 8
      ) || 0;
      
      const orb = Math.abs(distance - exactDistance);
      const strength = Math.max(0, 100 - (orb * 12.5)); // 8° orb = 0 strength
      
      // Determine if applying or separating (simplified - assumes retrograde info)
      const applying = true; // TODO: Calculate based on relative speeds
      
      majorAspects.push({
        planet: otherPlanet as Planet,
        aspect: aspectType,
        orb,
        applying,
        strength,
      });
    }
  });
  
  return {
    cazimi,
    combust,
    underBeams,
    majorAspects,
  };
}

// ============================================================================
// MAIN CONDITION ANALYSIS
// ============================================================================

/**
 * Analyze complete planetary condition
 */
export async function getPlanetaryCondition(
  planet: Planet,
  moment: Date,
  location: { latitude: number; longitude: number }
): Promise<PlanetaryCondition> {
  try {
    // Get ephemeris data for all planets
    const ephemerisData = await getPlanetPositions(moment);
    
    if (!ephemerisData || !ephemerisData.planets) {
      throw new Error(`No ephemeris data available for ${moment.toISOString()}`);
    }
    
    // Extract position for target planet
    const planetData = ephemerisData.planets[planet.toLowerCase() as keyof typeof ephemerisData.planets];
    if (!planetData || typeof planetData.longitude !== 'number') {
      throw new Error(`No ephemeris data for ${planet}`);
    }
    
    const absoluteDegree = planetData.longitude;
    const position = getZodiacPosition(absoluteDegree);
    
    // Calculate dignity
    const dignity = calculateDignity(planet, position);
    
    // Analyze motion
    // Note: Current ephemeris data doesn't include speed/retrograde info
    // For now, assume direct motion (future enhancement: add speed calculation)
    const dailyMotion = 0; // TODO: Calculate from consecutive positions
    const retrograde = false; // TODO: Detect from ephemeris data
    const motion = analyzeMotion(planet, dailyMotion, retrograde);
    
    // Calculate aspects with other planets
    const allPositions: Record<Planet, number> = {
      Sun: ephemerisData.planets.sun?.longitude || 0,
      Moon: ephemerisData.planets.moon?.longitude || 0,
      Mercury: ephemerisData.planets.mercury?.longitude || 0,
      Venus: ephemerisData.planets.venus?.longitude || 0,
      Mars: ephemerisData.planets.mars?.longitude || 0,
      Jupiter: ephemerisData.planets.jupiter?.longitude || 0,
      Saturn: ephemerisData.planets.saturn?.longitude || 0,
    };
    
    const aspects = calculateAspects(planet, absoluteDegree, allPositions);
    
    // Calculate overall quality score
    let overallQuality = 0;
    
    // Dignity contributes 50%
    overallQuality += dignity.score * 0.5;
    
    // Motion contributes 20%
    overallQuality += motion.speedScore * 0.2;
    
    // Aspects contribute 30%
    let aspectScore = 50; // Base neutral
    
    if (aspects.cazimi) {
      aspectScore += 40; // Cazimi is powerful
    } else if (aspects.combust) {
      aspectScore -= 30; // Combustion weakens
    } else if (aspects.underBeams) {
      aspectScore -= 15; // Under beams still challenged
    }
    
    // Beneficial aspects increase score
    aspects.majorAspects.forEach(aspect => {
      if (aspect.aspect === 'trine' || aspect.aspect === 'sextile') {
        aspectScore += (aspect.strength * 0.2);
      } else if (aspect.aspect === 'square' || aspect.aspect === 'opposition') {
        aspectScore -= (aspect.strength * 0.15);
      }
    });
    
    overallQuality += Math.max(0, Math.min(100, aspectScore)) * 0.3;
    overallQuality = Math.round(overallQuality);
    
    // Determine ruling
    let ruling: PlanetaryQuality;
    if (overallQuality >= 80) ruling = 'excellent';
    else if (overallQuality >= 60) ruling = 'strong';
    else if (overallQuality >= 40) ruling = 'moderate';
    else if (overallQuality >= 20) ruling = 'weak';
    else ruling = 'corrupted';
    
    // Generate summary
    const summary = {
      en: generateSummary(planet, dignity, motion, aspects, ruling, 'en'),
      ar: generateSummary(planet, dignity, motion, aspects, ruling, 'ar'),
      fr: generateSummary(planet, dignity, motion, aspects, ruling, 'fr'),
    };
    
    return {
      planet,
      timestamp: moment,
      position,
      dignity,
      motion,
      aspects,
      overallQuality,
      ruling,
      summary,
    };
  } catch (error) {
    console.error(`Error calculating planetary condition for ${planet}:`, error);
    
    // Return neutral/unknown condition
    return {
      planet,
      timestamp: moment,
      position: { sign: 'Aries', degree: 0, absoluteDegree: 0 },
      dignity: {
        type: 'peregrine',
        score: 50,
        description: `${planet} - condition unknown`,
        descriptionAr: `${planet} - الحالة غير معروفة`,
        descriptionFr: `${planet} - condition inconnue`,
      },
      motion: {
        retrograde: false,
        speed: 'average',
        speedScore: 50,
        dailyMotion: 0,
      },
      aspects: {
        cazimi: false,
        combust: false,
        underBeams: false,
        majorAspects: [],
      },
      overallQuality: 50,
      ruling: 'moderate',
      summary: {
        en: `${planet} condition could not be determined`,
        ar: `لم يمكن تحديد حالة ${planet}`,
        fr: `Impossible de déterminer l'état de ${planet}`,
      },
    };
  }
}

/**
 * Generate human-readable summary
 */
function generateSummary(
  planet: Planet,
  dignity: Dignity,
  motion: PlanetaryMotion,
  aspects: PlanetaryAspects,
  ruling: PlanetaryQuality,
  language: 'en' | 'ar' | 'fr'
): string {
  const parts: string[] = [];
  
  if (language === 'en') {
    parts.push(dignity.description);
    
    if (motion.retrograde) {
      parts.push(`Moving retrograde (internalized energy).`);
    } else if (motion.speed === 'very-fast') {
      parts.push(`Moving very fast (dynamic manifestation).`);
    } else if (motion.speed === 'slow') {
      parts.push(`Moving slowly (delayed results).`);
    }
    
    if (aspects.cazimi) {
      parts.push(`In Cazimi - empowered by Sun's heart.`);
    } else if (aspects.combust) {
      parts.push(`Combust - weakened by Sun's rays.`);
    }
    
    const beneficAspects = aspects.majorAspects.filter(a => 
      a.aspect === 'trine' || a.aspect === 'sextile'
    );
    const challengingAspects = aspects.majorAspects.filter(a => 
      a.aspect === 'square' || a.aspect === 'opposition'
    );
    
    if (beneficAspects.length > 0) {
      parts.push(`Supported by harmonious aspects.`);
    }
    if (challengingAspects.length > 0) {
      parts.push(`Challenged by tense aspects.`);
    }
    
    parts.push(`Overall: ${ruling}.`);
  } else if (language === 'ar') {
    parts.push(dignity.descriptionAr);
    if (motion.retrograde) parts.push(`رجعي (طاقة داخلية).`);
    if (aspects.cazimi) parts.push(`في قلب الشمس - مُمكّن.`);
    else if (aspects.combust) parts.push(`محترق - ضعيف.`);
  } else {
    parts.push(dignity.descriptionFr);
    if (motion.retrograde) parts.push(`Rétrograde (énergie internalisée).`);
    if (aspects.cazimi) parts.push(`En Cazimi - renforcé.`);
    else if (aspects.combust) parts.push(`Combuste - affaibli.`);
  }
  
  return parts.join(' ');
}
