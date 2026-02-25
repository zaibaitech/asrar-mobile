/**
 * Premium Section Component
 * =========================
 * A component for soft-locking premium content within screens.
 * Shows a preview with blur and an upgrade prompt overlay.
 * 
 * Philosophy: "Cosmic data is free. Personal meaning is premium."
 * 
 * Usage:
 * <PremiumSection
 *   featureId="personalGuidance"
 *   title="Personal Impact"
 *   description="Discover how this affects you personally"
 *   previewContent={<BlurredPreview />}
 * >
 *   <ActualPremiumContent />
 * </PremiumSection>
 */

import { DarkTheme, Spacing } from '@/constants/DarkTheme';
import { PremiumFeatureId } from '@/hooks/usePremiumFeature';
import React from 'react';
import {
    StyleProp,
    StyleSheet,
    ViewStyle
} from 'react-native';

// ============================================================================
// TYPES
// ============================================================================

interface PremiumSectionProps {
  /** The premium feature this section represents */
  featureId: PremiumFeatureId;
  /** Section title (shown in upgrade card) */
  title: string;
  /** Description of what user will unlock */
  description?: string;
  /** Icon emoji */
  icon?: string;
  /** Children to show when premium */
  children: React.ReactNode;
  /** Optional preview content to show blurred */
  previewContent?: React.ReactNode;
  /** Custom container style */
  style?: StyleProp<ViewStyle>;
  /** Whether to show a compact version */
  compact?: boolean;
  /** Custom CTA text */
  ctaText?: string;
}

// ============================================================================
// PREMIUM COPY GUIDELINES
// ============================================================================

/**
 * Copy that respects user and emphasizes depth, not restriction
 * ✅ "Unlock deeper insight"
 * ✅ "Discover how this applies to you"
 * ❌ Never "This feature is locked"
 */
const PREMIUM_COPY = {
  en: {
    cta: 'Unlock deeper insight',
    ctaCompact: 'See more',
    badge: 'Premium',
    description: 'Personalized guidance based on your spiritual profile',
  },
  fr: {
    cta: 'Découvrir plus en profondeur',
    ctaCompact: 'Voir plus',
    badge: 'Premium',
    description: 'Conseils personnalisés basés sur votre profil spirituel',
  },
  ar: {
    cta: 'اكتشف رؤية أعمق',
    ctaCompact: 'عرض المزيد',
    badge: 'مميز',
    description: 'إرشادات مخصصة بناءً على ملفك الروحي',
  },
};

// ============================================================================
// COMPONENT
// ============================================================================

export function PremiumSection({
  featureId,
  title,
  description,
  icon = '✨',
  children,
  previewContent,
  style,
  compact = false,
  ctaText,
}: PremiumSectionProps) {
  // V1: All content is free (ad-supported). Premium gates disabled.
  // To re-enable for V2, remove this early return and uncomment the
  // canAccess/showPaywall logic that was here previously.
  return <>{children}</>;
}


// ============================================================================
// INLINE UPGRADE BANNER
// ============================================================================

interface InlineUpgradeBannerProps {
  featureId: PremiumFeatureId;
  message: string;
  icon?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * A minimal inline banner for premium features
 * Use within existing cards/sections
 */
export function InlineUpgradeBanner({
  featureId,
  message,
  icon = '✨',
  style,
}: InlineUpgradeBannerProps) {
  // V1: All content is free (ad-supported). Premium gates disabled.
  // To re-enable for V2, restore the canAccess/showPaywall logic.
  return null;
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  // Full card styles
  container: {
    backgroundColor: DarkTheme.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.25)',
    overflow: 'hidden',
  },
  previewContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  previewBlur: {
    opacity: 0.25,
    transform: [{ scale: 1.02 }],
  },
  previewOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(26,22,37,0.7)',
  },
  upgradeCard: {
    padding: Spacing.md,
  },
  upgradeHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  iconContainer: {
    position: 'relative',
    marginRight: Spacing.md,
  },
  icon: {
    fontSize: 36,
  },
  premiumBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#8B5CF6',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#8B5CF6',
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: DarkTheme.textPrimary,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: DarkTheme.textSecondary,
    lineHeight: 20,
  },
  upgradeButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  upgradeButtonGradient: {
    flexDirection: 'row',
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  upgradeButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFF',
  },
  
  // Compact styles
  compactContainer: {
    backgroundColor: DarkTheme.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.2)',
    overflow: 'hidden',
    padding: Spacing.sm,
  },
  compactContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactIconContainer: {
    position: 'relative',
    marginRight: Spacing.sm,
  },
  compactIcon: {
    fontSize: 28,
  },
  compactTextContainer: {
    flex: 1,
  },
  compactTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: DarkTheme.textPrimary,
    marginBottom: 2,
  },
  compactCta: {
    fontSize: 12,
    color: '#8B5CF6',
    fontWeight: '500',
  },
  
  // Inline banner styles
  inlineBanner: {
    backgroundColor: 'rgba(139,92,246,0.1)',
    borderRadius: 10,
    padding: Spacing.sm,
    marginTop: Spacing.sm,
  },
  inlineBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inlineBannerIcon: {
    fontSize: 16,
    marginRight: Spacing.xs,
  },
  inlineBannerText: {
    flex: 1,
    fontSize: 13,
    color: DarkTheme.textSecondary,
  },
  inlineBannerCta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inlineBannerCtaText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8B5CF6',
    marginRight: 2,
  },
  
  // RTL
  contentRTL: {
    flexDirection: 'row-reverse',
  },
  rtlText: {
    textAlign: 'right',
  },
});

export default PremiumSection;
