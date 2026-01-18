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
import { useLanguage } from '@/contexts/LanguageContext';
import { PremiumFeatureId, usePremiumFeature } from '@/hooks/usePremiumFeature';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
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
  style?: ViewStyle;
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
  const { canAccess, showPaywall } = usePremiumFeature(featureId);
  const { language } = useLanguage();
  
  const isRTL = language === 'ar';
  const copy = PREMIUM_COPY[language] || PREMIUM_COPY.en;

  // If user has access, show the actual content
  if (canAccess) {
    return <>{children}</>;
  }

  // Show locked state with preview and upgrade prompt
  if (compact) {
    return (
      <TouchableOpacity
        style={[styles.compactContainer, style]}
        onPress={showPaywall}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['rgba(139,92,246,0.15)', 'rgba(99,102,241,0.08)']}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={[styles.compactContent, isRTL && styles.contentRTL]}>
          <View style={styles.compactIconContainer}>
            <Text style={styles.compactIcon}>{icon}</Text>
            <View style={styles.lockBadge}>
              <Ionicons name="sparkles" size={10} color="#FFF" />
            </View>
          </View>
          <View style={styles.compactTextContainer}>
            <Text style={[styles.compactTitle, isRTL && styles.rtlText]} numberOfLines={1}>
              {title}
            </Text>
            <Text style={[styles.compactCta, isRTL && styles.rtlText]}>
              {ctaText || copy.ctaCompact} →
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // Full card with preview
  return (
    <View style={[styles.container, style]}>
      <LinearGradient
        colors={['rgba(139,92,246,0.12)', 'rgba(99,102,241,0.06)']}
        style={StyleSheet.absoluteFillObject}
      />
      
      {/* Preview Content (blurred) */}
      {previewContent && (
        <View style={styles.previewContainer}>
          <View style={styles.previewBlur}>
            {previewContent}
          </View>
          <View style={styles.previewOverlay} />
        </View>
      )}
      
      {/* Upgrade Card */}
      <View style={styles.upgradeCard}>
        <View style={[styles.upgradeHeader, isRTL && styles.contentRTL]}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>{icon}</Text>
            <View style={styles.premiumBadge}>
              <Ionicons name="star" size={10} color="#FFF" />
            </View>
          </View>
          <View style={styles.textContainer}>
            <Text style={[styles.title, isRTL && styles.rtlText]}>
              {title}
            </Text>
            <Text style={[styles.description, isRTL && styles.rtlText]}>
              {description || copy.description}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.upgradeButton}
          onPress={showPaywall}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#8B5CF6', '#6366F1']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.upgradeButtonGradient}
          >
            <Ionicons name="sparkles" size={16} color="#FFF" style={{ marginRight: 6 }} />
            <Text style={styles.upgradeButtonText}>
              {ctaText || copy.cta}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ============================================================================
// INLINE UPGRADE BANNER
// ============================================================================

interface InlineUpgradeBannerProps {
  featureId: PremiumFeatureId;
  message: string;
  icon?: string;
  style?: ViewStyle;
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
  const { canAccess, showPaywall } = usePremiumFeature(featureId);
  const { language } = useLanguage();
  
  if (canAccess) return null;
  
  const isRTL = language === 'ar';
  const copy = PREMIUM_COPY[language] || PREMIUM_COPY.en;

  return (
    <TouchableOpacity
      style={[styles.inlineBanner, style]}
      onPress={showPaywall}
      activeOpacity={0.8}
    >
      <View style={[styles.inlineBannerContent, isRTL && styles.contentRTL]}>
        <Text style={styles.inlineBannerIcon}>{icon}</Text>
        <Text style={[styles.inlineBannerText, isRTL && styles.rtlText]}>
          {message}
        </Text>
        <View style={styles.inlineBannerCta}>
          <Text style={styles.inlineBannerCtaText}>{copy.ctaCompact}</Text>
          <Ionicons 
            name={isRTL ? "chevron-back" : "chevron-forward"} 
            size={14} 
            color="#8B5CF6" 
          />
        </View>
      </View>
    </TouchableOpacity>
  );
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
