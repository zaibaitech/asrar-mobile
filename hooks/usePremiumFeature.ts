/**
 * Premium Feature Hook
 * ====================
 * Centralized hook for checking premium feature access and showing appropriate UI.
 * 
 * Usage:
 * const { canAccess, showUpgradePrompt } = usePremiumFeature('quranResonance');
 */

import { useSubscription } from '@/contexts/SubscriptionContext';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';

// ============================================================================
// PREMIUM FEATURE DEFINITIONS
// ============================================================================

/**
 * Premium features categorized by value tier
 * Following monetization rules: We monetize interpretation, not access
 */
export const PREMIUM_FEATURES = {
  // Tier 1: AI-Powered (High Value)
  aiGuidance: {
    id: 'aiGuidance',
    nameKey: 'premium.features.aiGuidance',
    descriptionKey: 'premium.features.aiGuidance.description',
    icon: '✨',
    tier: 'high',
  },
  aiInterpretation: {
    id: 'aiInterpretation',
    nameKey: 'premium.features.aiInterpretation',
    descriptionKey: 'premium.features.aiInterpretation.description',
    icon: '🧠',
    tier: 'high',
  },
  
  // Tier 2: Personal Interpretation (Medium Value)
  personalGuidance: {
    id: 'personalGuidance',
    nameKey: 'premium.features.personalGuidance',
    descriptionKey: 'premium.features.personalGuidance.description',
    icon: '🎯',
    tier: 'medium',
  },
  quranResonance: {
    id: 'quranResonance',
    nameKey: 'premium.features.quranResonance',
    descriptionKey: 'premium.features.quranResonance.description',
    icon: '📖',
    tier: 'medium',
  },
  divineNameResonance: {
    id: 'divineNameResonance',
    nameKey: 'premium.features.divineNameResonance',
    descriptionKey: 'premium.features.divineNameResonance.description',
    icon: '🌟',
    tier: 'medium',
  },
  lineageInsights: {
    id: 'lineageInsights',
    nameKey: 'premium.features.lineageInsights',
    descriptionKey: 'premium.features.lineageInsights.description',
    icon: '👪',
    tier: 'medium',
  },
  elementalHarmony: {
    id: 'elementalHarmony',
    nameKey: 'premium.features.elementalHarmony',
    descriptionKey: 'premium.features.elementalHarmony.description',
    icon: '⚖️',
    tier: 'medium',
  },
  spiritualGuidance: {
    id: 'spiritualGuidance',
    nameKey: 'premium.features.spiritualGuidance',
    descriptionKey: 'premium.features.spiritualGuidance.description',
    icon: '🕊️',
    tier: 'medium',
  },
  timingAdvice: {
    id: 'timingAdvice',
    nameKey: 'premium.features.timingAdvice',
    descriptionKey: 'premium.features.timingAdvice.description',
    icon: '⏰',
    tier: 'medium',
  },
  compatibilityDeep: {
    id: 'compatibilityDeep',
    nameKey: 'premium.features.compatibilityDeep',
    descriptionKey: 'premium.features.compatibilityDeep.description',
    icon: '💞',
    tier: 'medium',
  },
  manazilPractices: {
    id: 'manazilPractices',
    nameKey: 'premium.features.manazilPractices',
    descriptionKey: 'premium.features.manazilPractices.description',
    icon: '🌙',
    tier: 'medium',
  },
  
  // Tier 3: Extras (Nice to Have)
  pdfExport: {
    id: 'pdfExport',
    nameKey: 'premium.features.pdfExport',
    descriptionKey: 'premium.features.pdfExport.description',
    icon: '📄',
    tier: 'low',
  },
  cloudSync: {
    id: 'cloudSync',
    nameKey: 'premium.features.cloudSync',
    descriptionKey: 'premium.features.cloudSync.description',
    icon: '☁️',
    tier: 'low',
  },
  advancedCalculator: {
    id: 'advancedCalculator',
    nameKey: 'premium.features.advancedCalculator',
    descriptionKey: 'premium.features.advancedCalculator.description',
    icon: '🧮',
    tier: 'low',
  },
} as const;

export type PremiumFeatureId = keyof typeof PREMIUM_FEATURES;

// ============================================================================
// HOOK
// ============================================================================

export interface UsePremiumFeatureReturn {
  /** Whether the user can access this feature */
  canAccess: boolean;
  /** Whether the user is premium */
  isPremium: boolean;
  /** Whether the user is an admin */
  isAdmin: boolean;
  /** Show the paywall for this feature */
  showPaywall: () => void;
  /** Feature configuration */
  feature: typeof PREMIUM_FEATURES[PremiumFeatureId];
}

/**
 * Hook for checking and gating premium features
 * 
 * @param featureId - The feature to check access for
 * @returns Object with access status and paywall trigger
 */
export function usePremiumFeature(featureId: PremiumFeatureId): UsePremiumFeatureReturn {
  const { isPremium, isAdmin, showPaywall: contextShowPaywall } = useSubscription();
  const router = useRouter();
  
  const feature = PREMIUM_FEATURES[featureId];
  const canAccess = isPremium || isAdmin;
  
  const showPaywall = useCallback(() => {
    router.push({
      pathname: '/paywall',
      params: { 
        feature: feature.nameKey,
        featureId: featureId,
      },
    });
  }, [router, feature.nameKey, featureId]);
  
  return {
    canAccess,
    isPremium,
    isAdmin,
    showPaywall,
    feature,
  };
}

/**
 * Simple hook that just returns premium status
 * Use this when you don't need the full feature configuration
 */
export function useIsPremium(): boolean {
  const { isPremium, isAdmin } = useSubscription();
  return isPremium || isAdmin;
}

export default usePremiumFeature;
