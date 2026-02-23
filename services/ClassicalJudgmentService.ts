import type { Planet } from '@/services/PlanetaryHoursService';

export type ClassicalLabel = 'Nashr' | 'Neutral' | 'Nahs' | 'Restricted';
export type RestrictionLevel = 0 | 1 | 2 | 3;
export type PracticeIntensity = 'light' | 'moderate' | 'high';

export type DignityType =
  | 'domicile'
  | 'exaltation'
  | 'detriment'
  | 'fall'
  | 'peregrine'
  | 'unknown'
  | string;

export type HouseType = 'angular' | 'succedent' | 'cadent' | undefined;

export interface ClassicalJudgmentInput {
  rulerPlanet: Planet;
  /** User's personal ruling planet (from birth chart/zodiac sign) */
  userRulingPlanet?: Planet;
  dignityType?: DignityType;
  houseType?: HouseType;
  aspectsToBenefics?: number;
  aspectsToMalefics?: number;
}

export interface ClassicalJudgment {
  classicalLabel: ClassicalLabel;
  restrictionLevel: RestrictionLevel;
  allowedDomains: string[];
  avoidDomains: string[];
  practiceIntensity: PracticeIntensity;
}

function baseRestrictionLevelForPlanet(planet: Planet): RestrictionLevel {
  // Classical Planetary Ruling (ʿIlm al-Nujūm)
  // ==========================================
  // Traditional categorization of planetary hours based on inherent nature.
  // 
  // 0 = FAVORABLE (Nashr/Benefic): Sun ☀️, Jupiter ♃, Venus ♀
  //     Leadership, authority, success, growth, expansion, harmony
  // 
  // 1 = NEUTRAL (Variable): Moon ☽, Mercury ☿
  //     Fluctuating energy, communication, adaptability
  // 
  // 2 = CAUTIOUS (Nahs/Malefic): Saturn ♄, Mars ♂
  //     Restriction, delays, patience needed, conflict potential
  // 
  // 3 = AVOID (Restricted): Reserved for exceptional circumstances
  switch (planet) {
    case 'Sun':
    case 'Jupiter':
    case 'Venus':
      return 0;
    case 'Moon':
    case 'Mercury':
      return 1;
    case 'Mars':
    case 'Saturn':
      return 2;
    default:
      return 1;
  }
}

function clampRestrictionLevel(level: number): RestrictionLevel {
  if (level <= 0) return 0;
  if (level === 1) return 1;
  if (level === 2) return 2;
  return 3;
}

function labelFromRestrictionLevel(level: RestrictionLevel): ClassicalLabel {
  switch (level) {
    case 0:
      return 'Nashr';
    case 1:
      return 'Neutral';
    case 2:
      return 'Nahs';
    case 3:
    default:
      return 'Restricted';
  }
}

function practiceIntensityFromLevel(level: RestrictionLevel): PracticeIntensity {
  // Keep simple for now (no wording polish): supportive -> stronger practice;
  // restrictive -> lighter, more contained practice.
  if (level === 0) return 'high';
  if (level === 1) return 'moderate';
  if (level === 2) return 'moderate';
  return 'light';
}

function planetKey(planet: Planet): string {
  return planet.toLowerCase();
}

function domainsForPlanet(planet: Planet): { allowed: string[]; avoid: string[] } {
  // Reuse existing Planetary Judgment domain lists as the classic-style domain baseline.
  // These are translation keys; UI should render them with `t(key)`.
  const key = planetKey(planet);
  const allowed = [0, 1, 2].map((i) => `dailyEnergy.planetaryJudgment.bestFor.${key}.${i}`);
  const avoid = [0, 1, 2].map((i) => `dailyEnergy.planetaryJudgment.avoid.${key}.${i}`);
  return { allowed, avoid };
}

export function getClassicalJudgment(input: ClassicalJudgmentInput): ClassicalJudgment {
  // Use simple classical baseline - avoid complex modifiers that cause inconsistency
  const base = baseRestrictionLevelForPlanet(input.rulerPlanet);

  // SIMPLIFIED: Start with classical baseline
  // Only apply minimal modifiers to avoid conflicting status badges
  let computed = base;

  // A) Dignity modifier - only upgrade, never downgrade benefics
  const dignity = (input.dignityType ?? 'unknown').toString().toLowerCase();
  const isDignified = dignity === 'domicile' || dignity === 'exaltation';
  
  // Dignified planets can improve their status
  if (isDignified && computed > 0) {
    computed = clampRestrictionLevel(computed - 1);
  }

  // B) "Forbidden" override stays in place via MomentAlignmentService
  // No additional modifiers here to keep status consistent

  // Moon upgrade rule: if Moon is essentially dignified, upgrade to Nashr
  if (input.rulerPlanet === 'Moon' && isDignified && computed === 1) {
    computed = 0;
  }

  // Classical malefics can never show as FAVORABLE (Nashr)
  const isMalefic = input.rulerPlanet === 'Saturn' || input.rulerPlanet === 'Mars';
  if (isMalefic && computed === 0) {
    computed = 1; // At best Neutral
  }

  const { allowed, avoid } = domainsForPlanet(input.rulerPlanet);
  const isSamePlanet = !!input.userRulingPlanet && input.rulerPlanet === input.userRulingPlanet;

  return {
    classicalLabel: labelFromRestrictionLevel(computed),
    restrictionLevel: computed,
    allowedDomains: allowed,
    avoidDomains: avoid,
    // Same-planet hour: higher intensity (not automatic permission).
    practiceIntensity: isSamePlanet ? 'high' : practiceIntensityFromLevel(computed),
  };
}
