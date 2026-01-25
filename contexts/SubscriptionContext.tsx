/**
 * Subscription Context
 * ====================
 * Manages subscription state and premium access across the app.
 * 
 * Features:
 * - RevenueCat integration for subscriptions
 * - Admin/Developer bypass for testing (email whitelist)
 * - Premium status tracking
 * - Product offerings and purchase flow
 * 
 * Admin Bypass (Standard Developer Practice):
 * - Set EXPO_PUBLIC_ADMIN_EMAILS in .env (comma-separated)
 * - Admin accounts get full premium access without payment
 * - Useful for testing, QA, and development
 */

import { useProfile } from '@/contexts/ProfileContext';
import {
    addCustomerInfoUpdateListener,
    getSubscriptionProducts,
    getSubscriptionStatus,
    initializeRevenueCat,
    isRevenueCatConfigured,
    loginUser,
    logoutUser,
    purchasePackage,
    restorePurchases as rcRestorePurchases,
    SubscriptionProduct,
} from '@/services/RevenueCatService';
import { useRouter } from 'expo-router';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * Admin emails that bypass subscription (comma-separated in .env)
 * Example: EXPO_PUBLIC_ADMIN_EMAILS=dev@example.com,admin@example.com
 */
const ADMIN_EMAILS_RAW = process.env.EXPO_PUBLIC_ADMIN_EMAILS || '';
const ADMIN_EMAILS = ADMIN_EMAILS_RAW
  .split(',')
  .map((email: string) => email.trim().toLowerCase())
  .filter((email: string) => email.length > 0);

// ============================================================================
// TYPES
// ============================================================================

export type SubscriptionTier = 'free' | 'premium' | 'admin';

export interface SubscriptionState {
  /** Whether user has premium access (paid or admin) */
  isPremium: boolean;
  
  /** Current subscription tier */
  tier: SubscriptionTier;
  
  /** Whether this is an admin/developer account */
  isAdmin: boolean;
  
  /** Loading state for subscription checks */
  isLoading: boolean;
  
  /** Processing a purchase */
  isProcessing: boolean;
  
  /** Error message if subscription check failed */
  error: string | null;
  
  /** Subscription expiry date (if applicable) */
  expiresAt?: Date;
  
  /** Available products for purchase */
  products: SubscriptionProduct[];
  
  /** Whether RevenueCat is configured */
  isConfigured: boolean;
}

export interface SubscriptionContextType extends SubscriptionState {
  /** Check/refresh subscription status */
  checkSubscription: () => Promise<void>;
  
  /** Navigate to paywall screen */
  showPaywall: (feature?: string) => void;
  
  /** Purchase a subscription product */
  purchase: (product: SubscriptionProduct) => Promise<boolean>;
  
  /** Restore previous purchases */
  restorePurchases: () => Promise<boolean>;
  
  /** Load available products */
  loadProducts: () => Promise<void>;
  
  /** Debug: Force premium status (dev only) */
  __debugSetPremium?: (premium: boolean) => void;
}

// ============================================================================
// CONTEXT
// ============================================================================

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

// ============================================================================
// PROVIDER
// ============================================================================

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { profile } = useProfile();
  const router = useRouter();
  
  const [state, setState] = useState<SubscriptionState>({
    isPremium: false,
    tier: 'free',
    isAdmin: false,
    isLoading: true,
    isProcessing: false,
    error: null,
    products: [],
    isConfigured: isRevenueCatConfigured(),
  });
  
  // Debug override for development (only in __DEV__ mode)
  const [debugPremiumOverride, setDebugPremiumOverride] = useState<boolean | null>(null);
  
  // Track if RevenueCat has been initialized
  const [rcInitialized, setRcInitialized] = useState(false);

  // ============================================================================
  // ADMIN CHECK
  // ============================================================================
  
  /**
   * Check if current user is an admin (email whitelist)
   */
  const isAdminUser = useMemo(() => {
    const userEmail = profile?.account?.email?.toLowerCase().trim();
    
    if (__DEV__) {
      console.log('[SubscriptionContext] Checking admin status:');
      console.log('  - User email:', userEmail || '(not set)');
      console.log('  - Admin emails:', ADMIN_EMAILS);
      console.log('  - Profile mode:', profile?.mode);
    }
    
    if (!userEmail) return false;
    
    const isAdmin = ADMIN_EMAILS.includes(userEmail);
    
    if (__DEV__) {
      console.log('  - Is admin:', isAdmin ? '✅ YES' : '❌ NO');
    }
    
    return isAdmin;
  }, [profile?.account?.email, profile?.mode]);

  // ============================================================================
  // SUBSCRIPTION CHECK
  // ============================================================================
  
  const checkSubscription = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Priority 1: Admin bypass
      if (isAdminUser) {
        setState(prev => ({
          ...prev,
          isPremium: true,
          tier: 'admin',
          isAdmin: true,
          isLoading: false,
          error: null,
        }));
        
        if (__DEV__) {
          console.log('[SubscriptionContext] ✅ Admin mode - full premium access');
        }
        return;
      }
      
      // Priority 2: Debug override (dev mode only)
      if (__DEV__ && debugPremiumOverride !== null) {
        setState(prev => ({
          ...prev,
          isPremium: debugPremiumOverride,
          tier: debugPremiumOverride ? 'premium' : 'free',
          isAdmin: false,
          isLoading: false,
          error: null,
        }));
        
        console.log('[SubscriptionContext] 🔧 Debug override:', debugPremiumOverride ? 'premium' : 'free');
        return;
      }
      
      // Priority 3: RevenueCat subscription check
      if (rcInitialized) {
        const status = await getSubscriptionStatus();
        
        setState(prev => ({
          ...prev,
          isPremium: status.isPremium,
          tier: status.isPremium ? 'premium' : 'free',
          isAdmin: false,
          isLoading: false,
          error: null,
          expiresAt: status.expirationDate,
        }));
        
        if (__DEV__) {
          console.log('[SubscriptionContext] RevenueCat status:', status.isPremium ? 'premium' : 'free');
        }
        return;
      }
      
      // Default: free tier (RevenueCat not configured/initialized)
      setState(prev => ({
        ...prev,
        isPremium: false,
        tier: 'free',
        isAdmin: false,
        isLoading: false,
        error: null,
      }));
      
      if (__DEV__) {
        console.log('[SubscriptionContext] User on free tier (RevenueCat not initialized)');
      }
      
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Subscription check failed';
      
      if (__DEV__) {
        console.error('[SubscriptionContext] Error:', message);
      }
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: message,
      }));
    }
  }, [isAdminUser, debugPremiumOverride, rcInitialized]);

  // ============================================================================
  // INITIALIZE REVENUECAT
  // ============================================================================
  
  useEffect(() => {
    if (!isRevenueCatConfigured()) {
      if (__DEV__) {
        console.log('[SubscriptionContext] RevenueCat not configured - checking admin status only');
      }
      // Even without RevenueCat, we should check admin status
      checkSubscription();
      return;
    }
    
    const init = async () => {
      const userId = profile?.account?.userId;
      const success = await initializeRevenueCat(userId);
      setRcInitialized(success);
      
      if (success) {
        // Set up listener for subscription changes
        const unsubscribe = addCustomerInfoUpdateListener(() => {
          checkSubscription();
        });
        
        return unsubscribe;
      }
    };
    
    init();
  }, [profile?.account?.userId, isAdminUser]);
  
  // Re-check subscription when admin status changes
  useEffect(() => {
    if (__DEV__) {
      console.log('[SubscriptionContext] Admin status changed, isAdmin:', isAdminUser);
    }
    checkSubscription();
  }, [isAdminUser]);
  
  // Sync RevenueCat user when profile changes
  useEffect(() => {
    if (!rcInitialized) return;
    
    const syncUser = async () => {
      const userId = profile?.account?.userId;
      
      if (userId && profile?.mode === 'account') {
        await loginUser(userId);
      } else if (profile?.mode === 'guest') {
        await logoutUser();
      }
      
      await checkSubscription();
    };
    
    syncUser();
  }, [profile?.account?.userId, profile?.mode, rcInitialized]);

  // ============================================================================
  // ACTIONS
  // ============================================================================
  
  const showPaywall = useCallback((feature?: string) => {
    if (__DEV__) {
      console.log('[SubscriptionContext] Navigating to paywall for feature:', feature || 'general');
    }
    
    router.push({
      pathname: '/paywall',
      params: feature ? { feature } : undefined,
    });
  }, [router]);
  
  const loadProducts = useCallback(async () => {
    if (!rcInitialized) {
      if (__DEV__) {
        console.log('[SubscriptionContext] Cannot load products - RevenueCat not initialized');
      }
      return;
    }
    
    try {
      const products = await getSubscriptionProducts();
      setState(prev => ({ ...prev, products }));
      
      if (__DEV__) {
        console.log('[SubscriptionContext] Loaded products:', products.length);
      }
    } catch (error) {
      if (__DEV__) {
        console.error('[SubscriptionContext] Failed to load products:', error);
      }
    }
  }, [rcInitialized]);
  
  const purchase = useCallback(async (product: SubscriptionProduct): Promise<boolean> => {
    if (!rcInitialized) {
      if (__DEV__) {
        console.warn('[SubscriptionContext] Cannot purchase - RevenueCat not initialized');
      }
      return false;
    }
    
    setState(prev => ({ ...prev, isProcessing: true, error: null }));
    
    try {
      const result = await purchasePackage(product.rcPackage);
      
      if (result.success) {
        await checkSubscription();
        setState(prev => ({ ...prev, isProcessing: false }));
        return true;
      }
      
      if (result.userCancelled) {
        setState(prev => ({ ...prev, isProcessing: false }));
        return false;
      }
      
      setState(prev => ({
        ...prev,
        isProcessing: false,
        error: result.error || 'Purchase failed',
      }));
      return false;
      
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Purchase failed';
      setState(prev => ({
        ...prev,
        isProcessing: false,
        error: message,
      }));
      return false;
    }
  }, [rcInitialized, checkSubscription]);
  
  const restorePurchases = useCallback(async (): Promise<boolean> => {
    if (!rcInitialized) {
      if (__DEV__) {
        console.warn('[SubscriptionContext] Cannot restore - RevenueCat not initialized');
      }
      // For admin users, just return true
      if (isAdminUser) return true;
      return false;
    }
    
    setState(prev => ({ ...prev, isProcessing: true, error: null }));
    
    try {
      const result = await rcRestorePurchases();
      
      await checkSubscription();
      setState(prev => ({ ...prev, isProcessing: false }));
      
      return state.isPremium;
      
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Restore failed';
      setState(prev => ({
        ...prev,
        isProcessing: false,
        error: message,
      }));
      return false;
    }
  }, [rcInitialized, checkSubscription, state.isPremium, isAdminUser]);

  // ============================================================================
  // DEBUG (Dev only)
  // ============================================================================
  
  const __debugSetPremium = __DEV__
    ? (premium: boolean) => {
        console.log('[SubscriptionContext] 🔧 Debug: Setting premium to', premium);
        setDebugPremiumOverride(premium);
      }
    : undefined;

  // ============================================================================
  // CONTEXT VALUE
  // ============================================================================
  
  const contextValue = useMemo<SubscriptionContextType>(() => ({
    ...state,
    checkSubscription,
    showPaywall,
    purchase,
    restorePurchases,
    loadProducts,
    __debugSetPremium,
  }), [state, checkSubscription, showPaywall, purchase, restorePurchases, loadProducts]);

  return (
    <SubscriptionContext.Provider value={contextValue}>
      {children}
    </SubscriptionContext.Provider>
  );
}

// ============================================================================
// HOOK
// ============================================================================

/**
 * Use subscription context
 * @throws Error if used outside SubscriptionProvider
 */
export function useSubscription(): SubscriptionContextType {
  const context = useContext(SubscriptionContext);
  
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  
  return context;
}

// ============================================================================
// UTILITY EXPORTS
// ============================================================================

/**
 * Check if admin emails are configured
 */
export const hasAdminEmailsConfigured = ADMIN_EMAILS.length > 0;

/**
 * Get list of admin emails (for debugging only)
 */
export const getAdminEmails = (): string[] => {
  if (__DEV__) {
    return [...ADMIN_EMAILS];
  }
  return [];
};
