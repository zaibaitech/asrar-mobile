/**
 * Paywall Modal
 * =============
 * A modal component for showing paywall inline within screens
 * Use this for soft paywalls where you want to show locked content
 * 
 * Usage:
 * <PaywallModal
 *   visible={!isPremium}
 *   feature="AI Guidance"
 *   onClose={() => {}}
 * />
 */

import { DarkTheme } from '@/constants/DarkTheme';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Dimensions,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ============================================================================
// TYPES
// ============================================================================

interface PaywallModalProps {
  /** Whether the modal is visible */
  visible: boolean;
  /** Feature name to display */
  feature?: string;
  /** Called when user dismisses the modal */
  onClose: () => void;
  /** Custom title override */
  title?: string;
  /** Custom description override */
  description?: string;
  /** Show close button (default: true) */
  showClose?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function PaywallModal({
  visible,
  feature,
  onClose,
  title,
  description,
  showClose = true,
}: PaywallModalProps) {
  const { t, language } = useLanguage();
  const router = useRouter();
  const { showPaywall } = useSubscription();
  
  const isRTL = language === 'ar';

  const handleUpgrade = () => {
    onClose();
    router.push({
      pathname: '/paywall',
      params: feature ? { feature } : undefined,
    });
  };

  const displayTitle = title || 
    (feature 
      ? t('paywallModal.unlockFeature', { feature }) || `Unlock ${feature}`
      : t('paywallModal.title') || 'Premium Feature');
  
  const displayDescription = description ||
    t('paywallModal.description') ||
    'Upgrade to Premium to access this feature and unlock your full spiritual potential.';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Blur background on iOS */}
        {Platform.OS === 'ios' && (
          <BlurView intensity={20} style={StyleSheet.absoluteFill} />
        )}
        
        <View style={styles.modalContainer}>
          {/* Close Button */}
          {showClose && (
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={24} color={DarkTheme.textSecondary} />
            </TouchableOpacity>
          )}
          
          {/* Lock Icon */}
          <View style={styles.iconContainer}>
            <LinearGradient
              colors={['#8B5CF6', '#6366F1']}
              style={styles.iconGradient}
            >
              <Ionicons name="lock-closed" size={32} color="#FFF" />
            </LinearGradient>
          </View>
          
          {/* Content */}
          <Text style={[styles.title, isRTL && styles.rtlText]}>
            {displayTitle}
          </Text>
          
          <Text style={[styles.description, isRTL && styles.rtlText]}>
            {displayDescription}
          </Text>
          
          {/* Benefits Preview */}
          <View style={styles.benefitsList}>
            {[
              { icon: '🌙', text: t('paywallModal.benefit1') || 'AI-powered guidance' },
              { icon: '🔮', text: t('paywallModal.benefit2') || 'Advanced insights' },
              { icon: '🚫', text: t('paywallModal.benefit3') || 'Ad-free experience' },
            ].map((benefit, index) => (
              <View key={index} style={[styles.benefitRow, isRTL && styles.benefitRowRTL]}>
                <Text style={styles.benefitIcon}>{benefit.icon}</Text>
                <Text style={[styles.benefitText, isRTL && styles.rtlText]}>
                  {benefit.text}
                </Text>
              </View>
            ))}
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
              <Ionicons name="star" size={20} color="#FFF" style={{ marginRight: 8 }} />
              <Text style={styles.upgradeButtonText}>
                {t('paywallModal.upgrade') || 'Upgrade to Premium'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          
          {/* Maybe Later */}
          <TouchableOpacity style={styles.laterButton} onPress={onClose}>
            <Text style={styles.laterText}>
              {t('paywallModal.later') || 'Maybe Later'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContainer: {
    width: SCREEN_WIDTH - 48,
    maxWidth: 360,
    backgroundColor: DarkTheme.cardBackground,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 20,
  },
  iconGradient: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: DarkTheme.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: DarkTheme.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  benefitsList: {
    width: '100%',
    marginBottom: 24,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  benefitRowRTL: {
    flexDirection: 'row-reverse',
  },
  benefitIcon: {
    fontSize: 18,
    marginRight: 12,
    width: 24,
    textAlign: 'center',
  },
  benefitText: {
    flex: 1,
    fontSize: 14,
    color: DarkTheme.textPrimary,
  },
  upgradeButton: {
    width: '100%',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 12,
  },
  upgradeButtonGradient: {
    flexDirection: 'row',
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  upgradeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  laterButton: {
    paddingVertical: 8,
  },
  laterText: {
    fontSize: 14,
    color: DarkTheme.textSecondary,
  },
  rtlText: {
    textAlign: 'right',
  },
});

export default PaywallModal;
