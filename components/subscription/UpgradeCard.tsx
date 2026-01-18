/**
 * Upgrade Card Component
 * ======================
 * A card component to show inline upgrade prompts for premium features
 * 
 * Usage:
 * <UpgradeCard
 *   feature="Quran Resonance"
 *   icon="📖"
 *   description="Discover ayat connected to your numbers"
 * />
 */

import { DarkTheme, Spacing } from '@/constants/DarkTheme';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
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

interface UpgradeCardProps {
  /** Feature name to display */
  feature: string;
  /** Emoji icon */
  icon?: string;
  /** Custom description */
  description?: string;
  /** Card style variant */
  variant?: 'default' | 'compact' | 'minimal';
  /** Custom container style */
  style?: ViewStyle;
  /** Whether to show the lock icon */
  showLock?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function UpgradeCard({
  feature,
  icon = '⭐',
  description,
  variant = 'default',
  style,
  showLock = true,
}: UpgradeCardProps) {
  const { t, language } = useLanguage();
  const router = useRouter();
  const { showPaywall } = useSubscription();
  
  const isRTL = language === 'ar';

  const handleUpgrade = () => {
    router.push({
      pathname: '/paywall',
      params: { feature },
    });
  };

  const displayDescription = description ||
    t('upgradeCard.description', { feature }) ||
    `Unlock ${feature} with Premium`;

  // Minimal variant - just a button
  if (variant === 'minimal') {
    return (
      <TouchableOpacity
        style={[styles.minimalButton, style]}
        onPress={handleUpgrade}
        activeOpacity={0.8}
      >
        <Ionicons name="lock-closed" size={14} color="#8B5CF6" />
        <Text style={styles.minimalText}>
          {t('upgradeCard.unlock') || 'Unlock'}
        </Text>
      </TouchableOpacity>
    );
  }

  // Compact variant - smaller inline card
  if (variant === 'compact') {
    return (
      <TouchableOpacity
        style={[styles.compactContainer, style]}
        onPress={handleUpgrade}
        activeOpacity={0.8}
      >
        <View style={[styles.compactContent, isRTL && styles.contentRTL]}>
          {showLock && (
            <View style={styles.compactLockIcon}>
              <Ionicons name="lock-closed" size={16} color="#8B5CF6" />
            </View>
          )}
          <View style={styles.compactTextContainer}>
            <Text style={[styles.compactTitle, isRTL && styles.rtlText]} numberOfLines={1}>
              {feature}
            </Text>
            <Text style={[styles.compactDesc, isRTL && styles.rtlText]} numberOfLines={1}>
              {t('upgradeCard.tapToUnlock') || 'Tap to unlock'}
            </Text>
          </View>
          <Ionicons 
            name={isRTL ? "chevron-back" : "chevron-forward"} 
            size={20} 
            color={DarkTheme.textSecondary} 
          />
        </View>
      </TouchableOpacity>
    );
  }

  // Default variant - full card
  return (
    <View style={[styles.container, style]}>
      <LinearGradient
        colors={['rgba(139,92,246,0.15)', 'rgba(99,102,241,0.1)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBg}
      />
      
      <View style={[styles.content, isRTL && styles.contentRTL]}>
        {/* Icon */}
        <View style={styles.iconContainer}>
          {showLock ? (
            <View style={styles.lockBadge}>
              <Ionicons name="lock-closed" size={12} color="#FFF" />
            </View>
          ) : null}
          <Text style={styles.icon}>{icon}</Text>
        </View>
        
        {/* Text */}
        <View style={styles.textContainer}>
          <Text style={[styles.title, isRTL && styles.rtlText]}>
            {feature}
          </Text>
          <Text style={[styles.description, isRTL && styles.rtlText]}>
            {displayDescription}
          </Text>
        </View>
      </View>
      
      {/* Upgrade Button */}
      <TouchableOpacity
        style={styles.upgradeButton}
        onPress={handleUpgrade}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#8B5CF6', '#6366F1']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.upgradeButtonGradient}
        >
          <Ionicons name="star" size={16} color="#FFF" style={{ marginRight: 6 }} />
          <Text style={styles.upgradeButtonText}>
            {t('upgradeCard.upgrade') || 'Upgrade'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

// ============================================================================
// PREMIUM LOCKED OVERLAY
// ============================================================================

interface PremiumLockedOverlayProps {
  /** Feature name */
  feature: string;
  /** Children to show behind the overlay */
  children: React.ReactNode;
  /** Whether to blur the children */
  blur?: boolean;
  /** Custom style */
  style?: ViewStyle;
}

/**
 * Wrap content that should be locked for free users
 * Shows a semi-transparent overlay with upgrade prompt
 */
export function PremiumLockedOverlay({
  feature,
  children,
  blur = true,
  style,
}: PremiumLockedOverlayProps) {
  const { t, language } = useLanguage();
  const router = useRouter();
  const { isPremium } = useSubscription();
  
  const isRTL = language === 'ar';

  // If premium, show children normally
  if (isPremium) {
    return <>{children}</>;
  }

  const handleUpgrade = () => {
    router.push({
      pathname: '/paywall',
      params: { feature },
    });
  };

  return (
    <View style={[styles.overlayContainer, style]}>
      {/* Blurred/dimmed content */}
      <View style={[styles.overlayContent, blur && styles.blurredContent]}>
        {children}
      </View>
      
      {/* Lock overlay */}
      <View style={styles.lockOverlay}>
        <TouchableOpacity
          style={styles.lockOverlayButton}
          onPress={handleUpgrade}
          activeOpacity={0.9}
        >
          <View style={styles.lockIconCircle}>
            <Ionicons name="lock-closed" size={24} color="#FFF" />
          </View>
          <Text style={[styles.lockOverlayTitle, isRTL && styles.rtlText]}>
            {t('upgradeCard.premiumFeature') || 'Premium Feature'}
          </Text>
          <Text style={[styles.lockOverlayText, isRTL && styles.rtlText]}>
            {t('upgradeCard.tapToUnlock') || 'Tap to unlock'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  // Default variant
  container: {
    backgroundColor: DarkTheme.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.3)',
    overflow: 'hidden',
    padding: Spacing.md,
  },
  gradientBg: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  contentRTL: {
    flexDirection: 'row-reverse',
  },
  iconContainer: {
    position: 'relative',
    marginRight: Spacing.md,
  },
  icon: {
    fontSize: 40,
  },
  lockBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#8B5CF6',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
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
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  upgradeButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
  },
  
  // Compact variant
  compactContainer: {
    backgroundColor: 'rgba(139,92,246,0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.2)',
    padding: Spacing.sm,
  },
  compactContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactLockIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(139,92,246,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  compactTextContainer: {
    flex: 1,
  },
  compactTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: DarkTheme.textPrimary,
  },
  compactDesc: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
  },
  
  // Minimal variant
  minimalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139,92,246,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  minimalText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '600',
    color: '#8B5CF6',
  },
  
  // Locked overlay
  overlayContainer: {
    position: 'relative',
  },
  overlayContent: {
    opacity: 1,
  },
  blurredContent: {
    opacity: 0.3,
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(26,22,37,0.7)',
    borderRadius: 12,
  },
  lockOverlayButton: {
    alignItems: 'center',
    padding: 20,
  },
  lockIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  lockOverlayTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: DarkTheme.textPrimary,
    marginBottom: 4,
  },
  lockOverlayText: {
    fontSize: 13,
    color: DarkTheme.textSecondary,
  },
  
  // RTL
  rtlText: {
    textAlign: 'right',
  },
});

export default UpgradeCard;
