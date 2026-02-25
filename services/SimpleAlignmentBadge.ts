/**
 * Simple Alignment Badge — Single Source of Truth
 * ================================================
 * Replaces the 3 competing badge systems with ONE authentic system
 * grounded in classical ʿIlm al-Nujūm.
 *
 * 3 factors (all traditional):
 *   1. Planet Nature  — Sa'd (benefic) vs Nahs (malefic) vs Neutral
 *   2. Personal Ruler — Does this planet resonate with YOUR ruling planet?
 *   3. Dignity        — Is the planet strong or weak in its current position?
 *
 * 3 tiers (clear, no contradictions):
 *   ✨ مُوَافِق  Muwāfiq  — Aligned     (70+)
 *   ⚖️ مُعْتَدِل Muʿtadil — Steady      (45–69)
 *   🌙 تَأَنَّ    Ta'anna  — Mindful     (<45)
 *
 * @module SimpleAlignmentBadge
 */

import type { Planet } from './PlanetaryHoursService';
import { getCachedEphemerisData } from './EphemerisDataCache';

// ============================================================================
// TYPES
// ============================================================================

export type AlignmentTier = 'aligned' | 'steady' | 'mindful';

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
  aligned: {
    tier: 'aligned',
    label: 'Aligned',
    labelAr: 'مُوَافِق',
    color: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.15)',
    icon: '✨',
  },
  steady: {
    tier: 'steady',
    label: 'Steady',
    labelAr: 'مُعْتَدِل',
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.15)',
    icon: '⚖️',
  },
  mindful: {
    tier: 'mindful',
    label: 'Mindful',
    labelAr: 'تَأَنَّ',
    color: '#7C3AED',
    bgColor: 'rgba(124, 58, 237, 0.15)',
    icon: '🌙',
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
 * Planetary Friendships — Classical Islamic Astrology
 * Determines how the user's ruling planet relates to the hour planet.
 */
type Friendship = 'same' | 'friend' | 'neutral' | 'enemy';

const FRIENDSHIPS: Record<string, 'friend' | 'enemy'> = {
  // Sun
  'sun-moon': 'friend',
  'sun-mars': 'friend',
  'sun-jupiter': 'friend',
  'sun-venus': 'enemy',
  'sun-saturn': 'enemy',
  // Moon
  'moon-sun': 'friend',
  'moon-mercury': 'friend',
  // Mars
  'mars-sun': 'friend',
  'mars-moon': 'friend',
  'mars-jupiter': 'friend',
  'mars-mercury': 'enemy',
  // Mercury
  'mercury-sun': 'friend',
  'mercury-venus': 'friend',
  'mercury-moon': 'enemy',
  // Jupiter
  'jupiter-sun': 'friend',
  'jupiter-moon': 'friend',
  'jupiter-mars': 'friend',
  'jupiter-mercury': 'enemy',
  'jupiter-venus': 'enemy',
  // Venus
  'venus-mercury': 'friend',
  'venus-saturn': 'friend',
  'venus-sun': 'enemy',
  'venus-moon': 'enemy',
  // Saturn
  'saturn-mercury': 'friend',
  'saturn-venus': 'friend',
  'saturn-sun': 'enemy',
  'saturn-moon': 'enemy',
  'saturn-mars': 'enemy',
};

function getFriendship(userRuler: string, hourPlanet: string): Friendship {
  const a = userRuler.toLowerCase();
  const b = hourPlanet.toLowerCase();
  if (a === b) return 'same';
  return FRIENDSHIPS[`${a}-${b}`] ?? 'neutral';
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
// DIGNITY — Classical Planet Dignities (auto-computed from ephemeris cache)
// ============================================================================

/**
 * Classical dignities: domicile (+3), exaltation (+4), detriment (-3), fall (-4)
 * Maps planet → { domicile: sign[], exaltation: sign, detriment: sign[], fall: sign }
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
  if (!dignity) return 50; // Unknown planet → peregrine

  const sign = pos.sign;
  if (sign === dignity.exaltation) return 90;  // Exalted
  if (dignity.domicile.includes(sign)) return 80; // Domicile
  if (sign === dignity.fall) return 10;          // Fall
  if (dignity.detriment.includes(sign)) return 20; // Detriment
  return 50; // Peregrine
}

// ============================================================================
// CORE FUNCTION
// ============================================================================

/**
 * Get the alignment badge for the current moment.
 *
 * @param hourPlanet   - Planet ruling the current planetary hour (e.g. 'Mars')
 * @param userRuler    - User's ruling planet from their zodiac sign (optional)
 * @param dignityScore - Planet's dignity score 0–100 from ephemeris (optional)
 * @returns AlignmentBadge with tier, score, labels, and colors
 *
 * @example
 * // Scorpio user (burjIndex 7) during Mars hour
 * getAlignmentBadge('Mars', 'mars')
 * // → { tier: 'aligned', score: 75, label: 'Aligned', ... }
 *
 * // No profile (anonymous user)
 * getAlignmentBadge('Jupiter')
 * // → { tier: 'aligned', score: 65, label: 'Aligned', ... }
 */
export function getAlignmentBadge(
  hourPlanet: Planet | string,
  userRuler?: string,
  dignityScore?: number,
): AlignmentBadge {
  let score = 50; // Baseline: neutral

  // ── Factor 1: Planet Nature (universal) ──
  const nature = getPlanetNature(hourPlanet);
  if (nature === 'saad') score += 15;       // Benefic boost
  else if (nature === 'nahs') score -= 10;  // Malefic caution

  // ── Factor 2: Personal Ruler Alignment ──
  if (userRuler) {
    const friendship = getFriendship(userRuler, hourPlanet as string);
    switch (friendship) {
      case 'same':   score += 35; break;  // Your own planet's hour
      case 'friend': score += 15; break;  // Friendly planet
      case 'enemy':  score -= 10; break;  // Opposing planet
      // 'neutral': no change
    }
  }

  // ── Factor 3: Dignity (auto-computed from ephemeris if not provided) ──
  const effectiveDignity = dignityScore ?? getQuickDignityScore(hourPlanet as string);
  if (effectiveDignity != null) {
    // Map 0-100 dignity to a -10 to +10 modifier
    // 50 = peregrine (no modifier), 100 = exalted (+10), 0 = fall (-10)
    const dignityModifier = Math.round(((effectiveDignity - 50) / 50) * 10);
    score += dignityModifier;
  }

  // Clamp
  score = Math.max(0, Math.min(100, score));

  // ── Determine tier ──
  let tier: AlignmentTier;
  if (score >= 70) tier = 'aligned';
  else if (score >= 45) tier = 'steady';
  else tier = 'mindful';

  return { ...TIER_CONFIG[tier], score };
}

/**
 * Translation key for the badge label (used by the widget's t() function)
 */
export function getAlignmentLabelKey(tier: AlignmentTier): string {
  switch (tier) {
    case 'aligned': return 'home.moment.status.aligned';
    case 'steady':  return 'home.moment.status.steady';
    case 'mindful': return 'home.moment.status.mindful';
  }
}
