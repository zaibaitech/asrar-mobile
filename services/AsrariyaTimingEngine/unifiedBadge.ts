/**
 * Unified Badge System
 * ====================
 * 
 * Single source of truth for timing status badges.
 * Bridges the AsrariyaTimingEngine score-based system with 
 * the simpler MomentAlignment status system.
 * 
 * This ensures NO contradictions between different parts of the UI.
 * 
 * Badge Hierarchy (matches Daily Energy thresholds):
 * - OPTIMAL (75%+): Excellent time
 * - ACT (60-74%): Good time
 * - MAINTAIN (45-59%): Proceed mindfully
 * - CAREFUL (30-44%): Proceed with caution
 * - HOLD (0-29%): Unfavorable time
 */

import type { RecommendationLevel } from './types';

// ============================================================================
// TYPES
// ============================================================================

export type UnifiedBadge = 'OPTIMAL' | 'ACT' | 'MAINTAIN' | 'CAREFUL' | 'HOLD';

export interface BadgeConfig {
  badge: UnifiedBadge;
  color: string;
  bgColor: string;
  icon: string;
  /** Action guidance for user */
  actionKey: string;
  /** Short label translation key */
  labelKey: string;
  /** Description translation key */
  descriptionKey: string;
}

// ============================================================================
// BADGE CONFIGURATIONS
// ============================================================================

export const BADGE_CONFIG: Record<UnifiedBadge, Omit<BadgeConfig, 'badge'>> = {
  OPTIMAL: {
    color: '#10b981', // Emerald green
    bgColor: '#10b98120',
    icon: '✨',
    actionKey: 'timing.badges.optimal.action',
    labelKey: 'timing.badges.optimal.label',
    descriptionKey: 'timing.badges.optimal.description',
  },
  ACT: {
    color: '#60A5FA', // Blue
    bgColor: '#60A5FA20',
    icon: '🌟',
    actionKey: 'timing.badges.act.action',
    labelKey: 'timing.badges.act.label',
    descriptionKey: 'timing.badges.act.description',
  },
  MAINTAIN: {
    color: '#f59e0b', // Amber
    bgColor: '#f59e0b20',
    icon: '⚖️',
    actionKey: 'timing.badges.maintain.action',
    labelKey: 'timing.badges.maintain.label',
    descriptionKey: 'timing.badges.maintain.description',
  },
  CAREFUL: {
    color: '#f97316', // Orange
    bgColor: '#f9731620',
    icon: '⚠️',
    actionKey: 'timing.badges.careful.action',
    labelKey: 'timing.badges.careful.label',
    descriptionKey: 'timing.badges.careful.description',
  },
  HOLD: {
    color: '#7C3AED', // Purple (neutral, not alarming)
    bgColor: '#7C3AED20',
    icon: '⏸️',
    actionKey: 'timing.badges.hold.action',
    labelKey: 'timing.badges.hold.label',
    descriptionKey: 'timing.badges.hold.description',
  },
};

// ============================================================================
// SCORE THRESHOLDS
// ============================================================================

export const SCORE_THRESHOLDS = {
  OPTIMAL: 75,    // 75-100%
  ACT: 60,        // 60-74%
  MAINTAIN: 45,   // 45-59%
  CAREFUL: 30,    // 30-44%
  HOLD: 0,        // 0-29%
} as const;

// ============================================================================
// CONVERSION FUNCTIONS
// ============================================================================

/**
 * Get unified badge from a numeric score (0-100)
 */
export function getBadgeFromScore(score: number): UnifiedBadge {
  if (score >= SCORE_THRESHOLDS.OPTIMAL) return 'OPTIMAL';
  if (score >= SCORE_THRESHOLDS.ACT) return 'ACT';
  if (score >= SCORE_THRESHOLDS.MAINTAIN) return 'MAINTAIN';
  if (score >= SCORE_THRESHOLDS.CAREFUL) return 'CAREFUL';
  return 'HOLD';
}

/**
 * Get unified badge from RecommendationLevel
 */
export function getBadgeFromLevel(level: RecommendationLevel): UnifiedBadge {
  const mapping: Record<RecommendationLevel, UnifiedBadge> = {
    'highly-favorable': 'OPTIMAL',
    'favorable': 'ACT',
    'moderate': 'MAINTAIN',
    'cautious': 'CAREFUL',
    'challenging': 'HOLD',
  };
  return mapping[level];
}

/**
 * Get RecommendationLevel from unified badge
 */
export function getLevelFromBadge(badge: UnifiedBadge): RecommendationLevel {
  const mapping: Record<UnifiedBadge, RecommendationLevel> = {
    'OPTIMAL': 'highly-favorable',
    'ACT': 'favorable',
    'MAINTAIN': 'moderate',
    'CAREFUL': 'cautious',
    'HOLD': 'challenging',
  };
  return mapping[badge];
}

/**
 * Get full badge configuration from score
 */
export function getBadgeConfigFromScore(score: number): BadgeConfig {
  const badge = getBadgeFromScore(score);
  return {
    badge,
    ...BADGE_CONFIG[badge],
  };
}

/**
 * Get full badge configuration from level
 */
export function getBadgeConfigFromLevel(level: RecommendationLevel): BadgeConfig {
  const badge = getBadgeFromLevel(level);
  return {
    badge,
    ...BADGE_CONFIG[badge],
  };
}

/**
 * Convert old MomentAlignment status to unified badge
 * Used for backward compatibility
 */
export function convertLegacyStatus(status: 'ACT' | 'MAINTAIN' | 'HOLD'): UnifiedBadge {
  // The old system was too simplistic.
  // We map it but the badge system should use scores instead.
  const mapping: Record<'ACT' | 'MAINTAIN' | 'HOLD', UnifiedBadge> = {
    'ACT': 'ACT',         // Same element
    'MAINTAIN': 'MAINTAIN', // Supportive element
    'HOLD': 'CAREFUL',     // NOTE: Old HOLD → CAREFUL, since it wasn't necessarily bad
  };
  return mapping[status];
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get percentage label for display
 */
export function getPercentageLabel(score: number): string {
  return `${Math.round(score)}%`;
}

/**
 * Check if this is a good time to proceed
 */
export function isGoodTime(score: number): boolean {
  return score >= SCORE_THRESHOLDS.MAINTAIN; // 40%+
}

/**
 * Check if this is an excellent time
 */
export function isExcellentTime(score: number): boolean {
  return score >= SCORE_THRESHOLDS.OPTIMAL; // 75%+
}

/**
 * Check if user should wait
 */
export function shouldWait(score: number): boolean {
  return score < SCORE_THRESHOLDS.CAREFUL; // Under 25%
}
