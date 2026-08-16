/**
 * Compatibility Tier — Single Source of Truth
 * =============================================
 * The DOB/whole-sign compatibility engine's 3-tier outcome, mirroring the
 * dignity system's existing badge idiom (services/SimpleAlignmentBadge.ts)
 * and its own transliteration convention (constants/arabicTerms.ts's
 * getResonanceQuality — capital-M "Muʿtadil", not lowercase).
 *
 * Deliberately percentage-free: a single calendar date with unknown time and
 * place cannot support numeric precision, and these three tiers are the same
 * resolution the dignity system already commits to elsewhere in the app.
 *
 * @module compatibilityTier
 */

import { ARABIC_TERMS } from '@/constants/arabicTerms';

// ============================================================================
// TYPES
// ============================================================================

export type CompatibilityTier = 'saeed' | 'mutadil' | 'mahdhur';

export interface CompatibilityTierBadge {
  tier: CompatibilityTier;
  labelAr: string;
  translit: string;
  labelEn: string;
  labelFr: string;
  color: string;
  bgColor: string;
  icon: string;
}

// ============================================================================
// BADGE CONFIG
// ============================================================================

const TIER_CONFIG: Record<CompatibilityTier, CompatibilityTierBadge> = {
  saeed: {
    tier: 'saeed',
    labelAr: ARABIC_TERMS.saeed,
    translit: 'Saʿīd',
    labelEn: 'Saʿīd (favourable)',
    labelFr: 'Saʿīd (favorable)',
    color: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.15)',
    icon: '✓',
  },
  mutadil: {
    tier: 'mutadil',
    labelAr: ARABIC_TERMS.mutadil,
    translit: 'Muʿtadil',
    labelEn: 'Muʿtadil (balanced)',
    labelFr: 'Muʿtadil (équilibré)',
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.15)',
    icon: '≈',
  },
  mahdhur: {
    tier: 'mahdhur',
    labelAr: ARABIC_TERMS.mahdhur,
    translit: 'Maḥdhūr',
    labelEn: 'Maḥdhūr (caution)',
    labelFr: 'Maḥdhūr (prudence)',
    color: '#dc2626',
    bgColor: 'rgba(220, 38, 38, 0.15)',
    icon: '!',
  },
};

export function getCompatibilityTierBadge(tier: CompatibilityTier): CompatibilityTierBadge {
  return TIER_CONFIG[tier];
}

/** Translation key for the tier label (used by the widget's t() function). */
export function getCompatibilityTierLabelKey(tier: CompatibilityTier): string {
  return `compatibility.results.tier.${tier}`;
}

/** Ordinal rank for strict aggregation — mahdhur is always the floor. */
export function tierRank(tier: CompatibilityTier): 0 | 1 | 2 {
  switch (tier) {
    case 'mahdhur': return 0;
    case 'mutadil': return 1;
    case 'saeed': return 2;
  }
}

/**
 * Aggregate a set of tiers to the strict floor — never more favourable than
 * the least-favourable input. Empty input defaults to 'mutadil' (no data,
 * no claim of favourability).
 */
export function aggregateTiers(tiers: CompatibilityTier[]): CompatibilityTier {
  if (tiers.length === 0) return 'mutadil';
  let worst: CompatibilityTier = 'saeed';
  for (const tier of tiers) {
    if (tierRank(tier) < tierRank(worst)) {
      worst = tier;
    }
  }
  return worst;
}
