/**
 * Simple Alignment Badge — Single Source of Truth
 * ================================================
 * Classical ʿIlm al-Nujūm method — planet nature is the status.
 *
 * 4 states (universal, not personalised):
 *   ✨ Excellent / ممتاز   — Sa'd (benefic): Sun, Jupiter, Venus
 *   ⚖️ Neutral  / محايد   — Variable: Moon, Mercury
 *   🌙 Prudence / تَأَنَّ  — Nahs (malefic): Saturn, Mars
 *   ⬇️ Hubūṭ   / هبوط    — Any planet in fall (overrides above)
 *
 * @module SimpleAlignmentBadge
 */

import { getCachedEphemerisData } from './EphemerisDataCache';
import type { Planet } from './PlanetaryHoursService';

// ============================================================================
// TYPES
// ============================================================================

export type AlignmentTier = 'excellent' | 'neutral' | 'prudence' | 'hubut';

export interface AlignmentBadge {
  tier: AlignmentTier;
  score: number;
  label: string;
  labelAr: string;
  color: string;
  bgColor: string;
  icon: string;
}

// ============================================================================
// BADGE CONFIGS
// ============================================================================

const TIER_CONFIG: Record<AlignmentTier, Omit<AlignmentBadge, 'score'>> = {
  excellent: {
    tier: 'excellent',
    label: 'Excellent',
    labelAr: 'ممتاز',
    color: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.15)',
    icon: '✨',
  },
  neutral: {
    tier: 'neutral',
    label: 'Neutral',
    labelAr: 'محايد',
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.15)',
    icon: '⚖️',
  },
  prudence: {
    tier: 'prudence',
    label: 'Prudence',
    labelAr: 'تَأَنَّ',
    color: '#7C3AED',
    bgColor: 'rgba(124, 58, 237, 0.15)',
    icon: '🌙',
  },
  hubut: {
    tier: 'hubut',
    label: 'Hubūṭ',
    labelAr: 'هبوط',
    color: '#dc2626',
    bgColor: 'rgba(220, 38, 38, 0.15)',
    icon: '⬇️',
  },
};

// ============================================================================
// CLASSICAL DATA (ʿIlm al-Nujūm)
// ============================================================================

/**
 * Planet Nature — Universal classification
 *   Sa'd (سعد) = Benefic:  Sun, Jupiter, Venus
 *   Nahs (نحس) = Malefic:  Saturn, Mars
 *   Neutral:               Moon, Mercury
 */
type PlanetNature = 'saad' | 'nahs' | 'neutral';

function getPlanetNature(planet: string): PlanetNature {
  switch (planet.toLowerCase()) {
    case 'sun':
    case 'jupiter':
    case 'venus':
      return 'saad';
    case 'saturn':
    case 'mars':
      return 'nahs';
    default:
      return 'neutral';
  }
}

/**
 * Zodiac sign index to ruling planet
 * Uses 0-indexed to match ProfileDerivationService convention:
 *   0=Aries, 1=Taurus, ..., 7=Scorpio, 11=Pisces
 */
const SIGN_RULERS: Record<number, string> = {
  0: 'mars',     // Aries
  1: 'venus',    // Taurus
  2: 'mercury',  // Gemini
  3: 'moon',     // Cancer
  4: 'sun',      // Leo
  5: 'mercury',  // Virgo
  6: 'venus',    // Libra
  7: 'mars',     // Scorpio
  8: 'jupiter',  // Sagittarius
  9: 'saturn',   // Capricorn
  10: 'saturn',  // Aquarius
  11: 'jupiter', // Pisces
};

export function getRulingPlanetFromBurj(burjIndex: number): string | undefined {
  return SIGN_RULERS[burjIndex];
}

// ============================================================================
// DIGNITY — Hubūṭ (fall) detection from ephemeris cache
// ============================================================================

/**
 * Dorothean triplicity rulers mapped to sign indices (0=Aries … 11=Pisces).
 * Includes all three roles (day/night/participating) without day-chart distinction.
 * Fire (0,4,8): Sun·Jupiter·Saturn  |  Earth (1,5,9): Venus·Moon·Mars
 * Air  (2,6,10): Saturn·Mercury·Jupiter  |  Water (3,7,11): Venus·Mars·Moon
 */
const TRIPLICITY_SIGNS: Record<string, number[]> = {
  sun:     [0, 4, 8],              // Fire
  jupiter: [0, 4, 8, 2, 6, 10],   // Fire (night) + Air (participating)
  saturn:  [0, 4, 8, 2, 6, 10],   // Fire (participating) + Air (day)
  venus:   [1, 5, 9, 3, 7, 11],   // Earth (day) + Water (day)
  moon:    [1, 5, 9, 3, 7, 11],   // Earth (night) + Water (participating)
  mars:    [1, 5, 9, 3, 7, 11],   // Earth (participating) + Water (night)
  mercury: [2, 6, 10],             // Air (night)
};

/**
 * Classical essential dignities:
 * domicile, exaltation, detriment, fall (hubūṭ)
 * Sign indices: 0=Aries .. 11=Pisces
 */
const PLANET_DIGNITY: Record<string, { domicile: number[]; exaltation: number; detriment: number[]; fall: number }> = {
  sun:     { domicile: [4],      exaltation: 0,  detriment: [10],    fall: 6 },
  moon:    { domicile: [3],      exaltation: 1,  detriment: [9],     fall: 7 },
  mercury: { domicile: [2, 5],   exaltation: 5,  detriment: [8, 11], fall: 11 },
  venus:   { domicile: [1, 6],   exaltation: 11, detriment: [0, 7],  fall: 5 },
  mars:    { domicile: [0, 7],   exaltation: 9,  detriment: [1, 6],  fall: 3 },
  jupiter: { domicile: [8, 11],  exaltation: 3,  detriment: [2, 5],  fall: 9 },
  saturn:  { domicile: [9, 10],  exaltation: 6,  detriment: [3, 4],  fall: 0 },
};

/**
 * Auto-compute a 0–100 dignity score for a planet from the embedded ephemeris cache.
 * Returns undefined if no cache data is available for today.
 */
function getQuickDignityScore(planet: string): number | undefined {
  const today = new Date().toISOString().slice(0, 10);
  const cached = getCachedEphemerisData(today);
  if (!cached) return undefined;

  const key = planet.toLowerCase() as keyof typeof cached;
  const pos = cached[key];
  if (!pos || typeof pos.sign !== 'number') return undefined;

  const dignity = PLANET_DIGNITY[key];
  if (!dignity) return 50;

  const sign = pos.sign;
  if (sign === dignity.exaltation) return 90;
  if (dignity.domicile.includes(sign)) return 80;
  if (sign === dignity.fall) return 10;                         // Hubūṭ — checked before detriment
  if (dignity.detriment.includes(sign)) return 20;
  if (TRIPLICITY_SIGNS[key]?.includes(sign)) return 70;        // Triplicity
  return 50; // Peregrine
}


// ============================================================================
// CORE FUNCTION
// ============================================================================

/**
 * Get the alignment badge for the current planetary hour.
 *
 * Essential dignity (from JPL Horizons via PlanetaryConditionService) is the
 * primary signal. For peregrine planets the sign ruler's nature breaks the tie,
 * matching the web app's classical method:
 *   • Moon (neutral) in Pisces (Jupiter = Sa'd) → Excellent
 *   • Moon (neutral) in Aries  (Mars   = Nahs)  → Prudence
 *
 * Dignity → tier:
 *   Fall      (≤ 15) → Hubūṭ
 *   Detriment (≤ 35) → Prudence
 *   Peregrine (≤ 65) → sign ruler: Sa'd=Excellent · Nahs=Prudence · neutral→planet nature
 *   Domicile / Exaltation (> 65) → Excellent
 *
 * @param hourPlanet   - Planet ruling the current planetary hour
 * @param _userRuler   - Unused (kept for API compatibility)
 * @param dignityScore - Planet's dignity score 0–100 from PlanetaryConditionService or ephemeris
 */
/** Peregrine planets have no essential dignity — they map to Neutral (gharīb). */
function resolvePeregrine(_planet: string, score: number): AlignmentBadge {
  return { ...TIER_CONFIG.neutral, score };
}

export function getAlignmentBadge(
  hourPlanet: Planet,
  _userRuler?: string,
  dignityScore?: number,
): AlignmentBadge {
  const effectiveDignity = dignityScore ?? getQuickDignityScore(hourPlanet);

  if (effectiveDignity !== undefined) {
    if (effectiveDignity <= 15) return { ...TIER_CONFIG.hubut,    score: effectiveDignity };
    if (effectiveDignity <= 35) return { ...TIER_CONFIG.prudence, score: effectiveDignity };
    if (effectiveDignity  > 65) return { ...TIER_CONFIG.excellent, score: effectiveDignity };
    return resolvePeregrine(hourPlanet, effectiveDignity);
  }

  // No ephemeris data at all → planet nature only
  const nature = getPlanetNature(hourPlanet);
  if (nature === 'saad') return { ...TIER_CONFIG.excellent, score: 80 };
  if (nature === 'nahs') return { ...TIER_CONFIG.prudence,  score: 25 };
  return { ...TIER_CONFIG.neutral, score: 50 };
}

/**
 * Translation key for the badge label (used by the widget's t() function)
 */
export function getAlignmentLabelKey(tier: AlignmentTier): string {
  switch (tier) {
    case 'excellent': return 'home.moment.status.excellent';
    case 'neutral':   return 'home.moment.status.neutral';
    case 'prudence':  return 'home.moment.status.prudence';
    case 'hubut':     return 'home.moment.status.hubut';
  }
}
