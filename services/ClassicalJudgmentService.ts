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
  // Baseline mapping (master rule layer)
  // 0 = open (Nashr)
  // 1 = caution (Neutral)
  // 2 = restricted (Nahs)
  // 3 = avoid (Restricted)
  switch (planet) {
    case 'Jupiter':
    case 'Venus':
      return 0;
    case 'Sun':
      return 1;
    case 'Moon':
    case 'Mercury':
      return 1;
    case 'Mars':
      return 2;
    case 'Saturn':
      // Saturn is heavy by nature; keep as restricted-but-usable baseline.
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
  // ─────────────────────────────────────────────────────────────────────────────
  // PRIMARY RULE (HIGHEST PRIORITY): Same Planet Rule
  // ─────────────────────────────────────────────────────────────────────────────
  // In traditional ʿIlm al-Nujum (Islamic astrology), when the hour ruler is
  // the SAME as the user's personal ruling planet, this is ALWAYS favorable.
  // Secondary factors (dignity, house, aspects) can only ENHANCE this, never diminish it.
  // 
  // Example: Scorpio person (Mars-ruled) during Mars hour = ALWAYS Sa'd/Nashr
  // ─────────────────────────────────────────────────────────────────────────────
  if (input.userRulingPlanet && input.rulerPlanet === input.userRulingPlanet) {
    // Same planet = automatic favorable alignment
    // Dignity and house can upgrade it further, but can never downgrade below Nashr
    const { allowed, avoid } = domainsForPlanet(input.rulerPlanet);
    
    const dignity = (input.dignityType ?? 'unknown').toString().toLowerCase();
    const isDignified = dignity === 'domicile' || dignity === 'exaltation';
    const isAngular = input.houseType === 'angular';
    
    // Same planet is minimum Nashr (favorable), can be enhanced but never diminished
    return {
      classicalLabel: 'Nashr',
      restrictionLevel: 0, // Always open/favorable for same planet
      allowedDomains: allowed,
      avoidDomains: isDignified && isAngular ? [] : avoid, // If dignified+angular, even "avoid" domains become accessible
      practiceIntensity: isDignified || isAngular ? 'high' : 'moderate',
    };
  }

  const base = baseRestrictionLevelForPlanet(input.rulerPlanet);

  // Modifiers (simple version): negative improves, positive worsens
  let delta = 0;

  // A) Dignity / sign condition modifier
  const dignity = (input.dignityType ?? 'unknown').toString().toLowerCase();
  const isDignified = dignity === 'domicile' || dignity === 'exaltation';
  if (dignity === 'domicile' || dignity === 'exaltation') delta -= 1;
  else if (dignity === 'detriment' || dignity === 'fall') delta += 1;

  // B) House power modifier
  if (input.houseType === 'angular') delta -= 1;
  else if (input.houseType === 'cadent') delta += 1;

  // C) Malefic/benefic contamination
  if ((input.aspectsToBenefics ?? 0) > 0) delta -= 1;
  if ((input.aspectsToMalefics ?? 0) > 0) delta += 1;

  let computed = clampRestrictionLevel(base + delta);

  // Moon upgrade rule: if Moon is essentially dignified, it cannot remain merely Neutral.
  // This upgrades the baseline (Neutral) -> Nashr, without overriding genuine restrictions.
  if (input.rulerPlanet === 'Moon' && isDignified && computed === 1) computed = 0;

  // D) Clamp rule (never exceed certain best-case labels)
  // "Max label = Neutral" means: never allow level 0 on these rulers.
  const cannotBeNashr =
    input.rulerPlanet === 'Saturn' ||
    input.rulerPlanet === 'Mars' ||
    input.rulerPlanet === 'Mercury' ||
    (input.rulerPlanet === 'Moon' && !isDignified);
  if (cannotBeNashr && computed === 0) computed = 1;

  const { allowed, avoid } = domainsForPlanet(input.rulerPlanet);

  return {
    classicalLabel: labelFromRestrictionLevel(computed),
    restrictionLevel: computed,
    allowedDomains: allowed,
    avoidDomains: avoid,
    practiceIntensity: practiceIntensityFromLevel(computed),
  };
}
