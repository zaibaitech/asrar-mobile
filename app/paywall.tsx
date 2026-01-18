/**
 * Paywall Screen
 * ==============
 * Premium subscription upgrade screen with beautiful UI
 * 
 * Features:
 * - Showcases premium benefits
 * - Subscription options (monthly/yearly)
 * - Purchase flow with loading states
 * - Restore purchases option
 * - Localized for EN/FR/AR
 */

import { DarkTheme, ElementAccents, Spacing } from '@/constants/DarkTheme';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { SubscriptionProduct } from '@/services/RevenueCatService';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ============================================================================
// PREMIUM FEATURES LIST
// ============================================================================

const PREMIUM_FEATURES = [
  {
    icon: '🌙',
    titleKey: 'paywall.features.aiGuidance.title',
    descKey: 'paywall.features.aiGuidance.desc',
    fallbackTitle: 'AI-Powered Guidance',
    fallbackDesc: 'Personalized spiritual insights powered by advanced AI',
  },
  {
    icon: '🔮',
    titleKey: 'paywall.features.nameDestiny.title',
    descKey: 'paywall.features.nameDestiny.desc',
    fallbackTitle: 'Complete Name Analysis',
    fallbackDesc: 'Full Abjad breakdown with Quran resonance',
  },
  {
    icon: '🕰️',
    titleKey: 'paywall.features.divineTiming.title',
    descKey: 'paywall.features.divineTiming.desc',
    fallbackTitle: 'Divine Timing Optimizer',
    fallbackDesc: 'Personalized planetary hour recommendations',
  },
  {
    icon: '💑',
    titleKey: 'paywall.features.compatibility.title',
    descKey: 'paywall.features.compatibility.desc',
    fallbackTitle: 'Advanced Compatibility',
    fallbackDesc: 'Deep lineage insights and detailed analysis',
  },
  {
    icon: '📖',
    titleKey: 'paywall.features.quranResonance.title',
    descKey: 'paywall.features.quranResonance.desc',
    fallbackTitle: 'Quran Resonance',
    fallbackDesc: 'Discover ayat connected to your spiritual numbers',
  },
  {
    icon: '🚫',
    titleKey: 'paywall.features.adFree.title',
    descKey: 'paywall.features.adFree.desc',
    fallbackTitle: 'Ad-Free Experience',
    fallbackDesc: 'Uninterrupted spiritual journey',
  },
];

// ============================================================================
// COMPONENT
// ============================================================================

export default function PaywallScreen() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ feature?: string }>();
  
  const {
    products,
    loadProducts,
    purchase,
    restorePurchases,
    isPremium,
    isProcessing,
    isLoading,
    error,
    isConfigured,
  } = useSubscription();
  
  const [selectedProduct, setSelectedProduct] = useState<SubscriptionProduct | null>(null);
  const [restoring, setRestoring] = useState(false);
  
  const isRTL = language === 'ar';

  // Load products on mount
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Auto-select yearly (best value) when products load
  useEffect(() => {
    if (products.length > 0 && !selectedProduct) {
      const yearly = products.find(p => p.packageType === 'ANNUAL');
      const monthly = products.find(p => p.packageType === 'MONTHLY');
      setSelectedProduct(yearly || monthly || products[0]);
    }
  }, [products, selectedProduct]);

  // If already premium, show success and go back
  useEffect(() => {
    if (isPremium && !isLoading) {
      // Small delay to show success state
      const timer = setTimeout(() => {
        router.back();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isPremium, isLoading, router]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handlePurchase = async () => {
    if (!selectedProduct) {
      Alert.alert(
        t('paywall.error.title') || 'Error',
        t('paywall.error.selectPlan') || 'Please select a subscription plan'
      );
      return;
    }

    const success = await purchase(selectedProduct);
    
    if (success) {
      Alert.alert(
        t('paywall.success.title') || '🎉 Welcome to Premium!',
        t('paywall.success.message') || 'You now have access to all premium features.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    }
  };

  const handleRestore = async () => {
    setRestoring(true);
    const success = await restorePurchases();
    setRestoring(false);

    if (success) {
      Alert.alert(
        t('paywall.restore.success.title') || 'Restored!',
        t('paywall.restore.success.message') || 'Your subscription has been restored.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } else {
      Alert.alert(
        t('paywall.restore.fail.title') || 'No Subscription Found',
        t('paywall.restore.fail.message') || 'We couldn\'t find an active subscription to restore.'
      );
    }
  };

  const handleClose = () => {
    router.back();
  };

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  const getPackageLabel = (pkg: SubscriptionProduct): string => {
    switch (pkg.packageType) {
      case 'MONTHLY':
        return t('paywall.plans.monthly') || 'Monthly';
      case 'ANNUAL':
        return t('paywall.plans.yearly') || 'Yearly';
      case 'LIFETIME':
        return t('paywall.plans.lifetime') || 'Lifetime';
      default:
        return pkg.title;
    }
  };

  const getSavingsText = (pkg: SubscriptionProduct): string | null => {
    if (pkg.packageType === 'ANNUAL') {
      return t('paywall.savings') || 'Save 37%';
    }
    if (pkg.packageType === 'LIFETIME') {
      return t('paywall.bestValue') || 'Best Value';
    }
    return null;
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  // Already premium - show success
  if (isPremium) {
    return (
      <View style={[styles.container, styles.centeredContainer]}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.successContainer}>
          <Text style={styles.successEmoji}>✨</Text>
          <Text style={styles.successTitle}>
            {t('paywall.alreadyPremium.title') || 'You\'re Premium!'}
          </Text>
          <Text style={styles.successSubtitle}>
            {t('paywall.alreadyPremium.subtitle') || 'Enjoy all premium features'}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={['#1A1625', '#2D1F47', '#1A1625']}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Close Button */}
      <TouchableOpacity
        style={[styles.closeButton, { top: insets.top + 10 }]}
        onPress={handleClose}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="close" size={28} color={DarkTheme.textSecondary} />
      </TouchableOpacity>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 60, paddingBottom: insets.bottom + 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerEmoji}>⭐</Text>
          <Text style={[styles.headerTitle, isRTL && styles.rtlText]}>
            {t('paywall.title') || 'Unlock Premium'}
          </Text>
          <Text style={[styles.headerSubtitle, isRTL && styles.rtlText]}>
            {params.feature
              ? t('paywall.unlockFeature', { feature: params.feature }) ||
                `Unlock ${params.feature} and more`
              : t('paywall.subtitle') || 'Elevate your spiritual journey'}
          </Text>
        </View>

        {/* Features List */}
        <View style={styles.featuresContainer}>
          {PREMIUM_FEATURES.map((feature, index) => (
            <View key={index} style={[styles.featureRow, isRTL && styles.featureRowRTL]}>
              <Text style={styles.featureIcon}>{feature.icon}</Text>
              <View style={styles.featureTextContainer}>
                <Text style={[styles.featureTitle, isRTL && styles.rtlText]}>
                  {t(feature.titleKey) || feature.fallbackTitle}
                </Text>
                <Text style={[styles.featureDesc, isRTL && styles.rtlText]}>
                  {t(feature.descKey) || feature.fallbackDesc}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Subscription Options */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={ElementAccents.water.primary} />
            <Text style={styles.loadingText}>
              {t('paywall.loading') || 'Loading plans...'}
            </Text>
          </View>
        ) : !isConfigured ? (
          <View style={styles.notConfiguredContainer}>
            <Ionicons name="alert-circle-outline" size={48} color={DarkTheme.textSecondary} />
            <Text style={styles.notConfiguredText}>
              {t('paywall.notConfigured') || 'Subscriptions coming soon'}
            </Text>
            <Text style={styles.notConfiguredSubtext}>
              {t('paywall.notConfiguredDesc') || 'Premium features will be available shortly'}
            </Text>
          </View>
        ) : products.length === 0 ? (
          <View style={styles.notConfiguredContainer}>
            <Ionicons name="cart-outline" size={48} color={DarkTheme.textSecondary} />
            <Text style={styles.notConfiguredText}>
              {t('paywall.noProducts') || 'No plans available'}
            </Text>
          </View>
        ) : (
          <View style={styles.plansContainer}>
            {products.map((product) => {
              const isSelected = selectedProduct?.identifier === product.identifier;
              const savings = getSavingsText(product);
              
              return (
                <TouchableOpacity
                  key={product.identifier}
                  style={[
                    styles.planCard,
                    isSelected && styles.planCardSelected,
                  ]}
                  onPress={() => setSelectedProduct(product)}
                  activeOpacity={0.8}
                >
                  {savings && (
                    <View style={styles.savingsBadge}>
                      <Text style={styles.savingsText}>{savings}</Text>
                    </View>
                  )}
                  
                  <View style={[styles.planContent, isRTL && styles.planContentRTL]}>
                    <View style={styles.planRadio}>
                      <View style={[
                        styles.radioOuter,
                        isSelected && styles.radioOuterSelected,
                      ]}>
                        {isSelected && <View style={styles.radioInner} />}
                      </View>
                    </View>
                    
                    <View style={styles.planInfo}>
                      <Text style={[styles.planName, isRTL && styles.rtlText]}>
                        {getPackageLabel(product)}
                      </Text>
                      <Text style={styles.planPrice}>
                        {product.priceString}
                        {product.packageType !== 'LIFETIME' && (
                          <Text style={styles.planPeriod}>
                            /{product.packageType === 'ANNUAL' 
                              ? (t('paywall.year') || 'year')
                              : (t('paywall.month') || 'month')}
                          </Text>
                        )}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Error Message */}
        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="warning" size={20} color="#EF4444" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Purchase Button */}
        {isConfigured && products.length > 0 && (
          <TouchableOpacity
            style={[
              styles.purchaseButton,
              (isProcessing || !selectedProduct) && styles.purchaseButtonDisabled,
            ]}
            onPress={handlePurchase}
            disabled={isProcessing || !selectedProduct}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#8B5CF6', '#6366F1']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.purchaseButtonGradient}
            >
              {isProcessing ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text style={styles.purchaseButtonText}>
                  {t('paywall.subscribe') || 'Subscribe Now'}
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* Restore Purchases */}
        <TouchableOpacity
          style={styles.restoreButton}
          onPress={handleRestore}
          disabled={restoring}
        >
          {restoring ? (
            <ActivityIndicator size="small" color={DarkTheme.textSecondary} />
          ) : (
            <Text style={styles.restoreText}>
              {t('paywall.restore') || 'Restore Purchases'}
            </Text>
          )}
        </TouchableOpacity>

        {/* Terms & Privacy */}
        <View style={styles.legalContainer}>
          <Text style={[styles.legalText, isRTL && styles.rtlText]}>
            {t('paywall.terms') || 
              'By subscribing, you agree to our Terms of Service and Privacy Policy. Subscription automatically renews unless auto-renew is turned off at least 24 hours before the end of the current period.'}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DarkTheme.screenBackground,
  },
  centeredContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
  },
  
  // Close Button
  closeButton: {
    position: 'absolute',
    right: 16,
    zIndex: 100,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Header
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  headerEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: DarkTheme.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: DarkTheme.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  
  // Features
  featuresContainer: {
    marginBottom: 32,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  featureRowRTL: {
    flexDirection: 'row-reverse',
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 12,
    width: 32,
    textAlign: 'center',
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: DarkTheme.textPrimary,
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: 14,
    color: DarkTheme.textSecondary,
    lineHeight: 20,
  },
  
  // Loading
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: DarkTheme.textSecondary,
  },
  
  // Not Configured
  notConfiguredContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  notConfiguredText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: DarkTheme.textPrimary,
    textAlign: 'center',
  },
  notConfiguredSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: DarkTheme.textSecondary,
    textAlign: 'center',
  },
  
  // Plans
  plansContainer: {
    marginBottom: 24,
  },
  planCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    marginBottom: 12,
    overflow: 'hidden',
  },
  planCardSelected: {
    borderColor: '#8B5CF6',
    backgroundColor: 'rgba(139,92,246,0.1)',
  },
  savingsBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderBottomLeftRadius: 12,
  },
  savingsText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFF',
  },
  planContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  planContentRTL: {
    flexDirection: 'row-reverse',
  },
  planRadio: {
    marginRight: 16,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: DarkTheme.textSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: '#8B5CF6',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#8B5CF6',
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 18,
    fontWeight: '600',
    color: DarkTheme.textPrimary,
    marginBottom: 4,
  },
  planPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: '#8B5CF6',
  },
  planPeriod: {
    fontSize: 14,
    fontWeight: '400',
    color: DarkTheme.textSecondary,
  },
  
  // Error
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239,68,68,0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#EF4444',
  },
  
  // Purchase Button
  purchaseButton: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  purchaseButtonDisabled: {
    opacity: 0.6,
  },
  purchaseButtonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  purchaseButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
  },
  
  // Restore
  restoreButton: {
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 24,
  },
  restoreText: {
    fontSize: 14,
    color: DarkTheme.textSecondary,
    textDecorationLine: 'underline',
  },
  
  // Legal
  legalContainer: {
    paddingHorizontal: 8,
    marginBottom: 20,
  },
  legalText: {
    fontSize: 11,
    color: DarkTheme.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
    opacity: 0.7,
  },
  
  // Success
  successContainer: {
    alignItems: 'center',
    padding: 40,
  },
  successEmoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: DarkTheme.textPrimary,
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 16,
    color: DarkTheme.textSecondary,
  },
  
  // RTL
  rtlText: {
    textAlign: 'right',
  },
});
