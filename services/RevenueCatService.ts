/**
 * RevenueCat Service
 * ==================
 * Handles all subscription and in-app purchase operations via RevenueCat.
 * 
 * IMPORTANT: This service uses lazy loading to avoid crashes when RevenueCat
 * is not configured. The SDK is only imported when API keys are present.
 * 
 * Setup Requirements:
 * 1. Create RevenueCat account at https://app.revenuecat.com
 * 2. Create a new project and add iOS/Android apps
 * 3. Configure products in App Store Connect / Google Play Console
 * 4. Add products to RevenueCat entitlements
 * 5. Get API keys and add to .env file
 * 
 * Entitlements:
 * - "premium" - Full access to all premium features
 * 
 * Products (configure in RevenueCat dashboard):
 * - asrariya_premium_monthly ($3.99/month)
 * - asrariya_premium_yearly ($29.99/year)
 * - asrariya_premium_lifetime ($79.99 one-time) [optional]
 */

import { Platform } from 'react-native';

// ============================================================================
// CONFIGURATION
// ============================================================================

const REVENUECAT_API_KEY_IOS = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_IOS || '';
const REVENUECAT_API_KEY_ANDROID = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID || '';

/** The entitlement identifier for premium access */
export const PREMIUM_ENTITLEMENT_ID = 'premium';

/** Product identifiers */
export const PRODUCT_IDS = {
  MONTHLY: 'asrariya_premium_monthly',
  YEARLY: 'asrariya_premium_yearly',
  LIFETIME: 'asrariya_premium_lifetime',
} as const;

// ============================================================================
// TYPES
// ============================================================================

export interface SubscriptionProduct {
  identifier: string;
  title: string;
  description: string;
  priceString: string;
  price: number;
  currencyCode: string;
  /** Package type: MONTHLY, ANNUAL, LIFETIME, etc. */
  packageType: string;
  /** Original RevenueCat package (null in stub mode) */
  rcPackage: any;
}

export interface SubscriptionStatus {
  /** Whether user has active premium entitlement */
  isPremium: boolean;
  /** Active subscription product ID (if any) */
  activeProductId?: string;
  /** Expiration date (if subscription) */
  expirationDate?: Date;
  /** Whether subscription will renew */
  willRenew: boolean;
  /** Management URL for subscription */
  managementUrl?: string;
}

export interface PurchaseResult {
  success: boolean;
  customerInfo?: any;
  error?: string;
  userCancelled?: boolean;
}

// ============================================================================
// SERVICE STATE
// ============================================================================

let isInitialized = false;
let initializationError: string | null = null;
let PurchasesSDK: any = null;

// ============================================================================
// LAZY LOADING
// ============================================================================

/**
 * Lazily load the RevenueCat SDK only when configured
 * This prevents crashes when SDK has dependency issues
 */
async function loadRevenueCatSDK(): Promise<boolean> {
  if (PurchasesSDK) return true;
  
  if (!isRevenueCatConfigured()) {
    if (__DEV__) {
      console.log('[RevenueCat] SDK not loaded - no API key configured');
    }
    return false;
  }
  
  try {
    // Dynamic import to avoid bundler errors when SDK has issues
    const module = await import('react-native-purchases');
    PurchasesSDK = module.default || module;
    return true;
  } catch (error) {
    if (__DEV__) {
      console.warn('[RevenueCat] Failed to load SDK:', error);
    }
    return false;
  }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Check if RevenueCat is configured (API keys present)
 */
export function isRevenueCatConfigured(): boolean {
  const apiKey = Platform.OS === 'ios' ? REVENUECAT_API_KEY_IOS : REVENUECAT_API_KEY_ANDROID;
  return Boolean(apiKey && apiKey.length > 0);
}

/**
 * Initialize RevenueCat SDK
 * Call this once at app startup (in _layout.tsx or App.tsx)
 */
export async function initializeRevenueCat(userId?: string): Promise<boolean> {
  if (isInitialized) {
    if (__DEV__) {
      console.log('[RevenueCat] Already initialized');
    }
    return true;
  }

  // Check if configured
  if (!isRevenueCatConfigured()) {
    initializationError = 'RevenueCat API key not configured';
    if (__DEV__) {
      console.warn('[RevenueCat] ⚠️ API key not found. Set EXPO_PUBLIC_REVENUECAT_API_KEY_IOS or EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID in .env');
      console.log('[RevenueCat] Running in stub mode - subscription features will use admin bypass only');
    }
    return false;
  }

  // Try to load the SDK
  const sdkLoaded = await loadRevenueCatSDK();
  if (!sdkLoaded || !PurchasesSDK) {
    initializationError = 'Failed to load RevenueCat SDK';
    return false;
  }

  const apiKey = Platform.OS === 'ios' ? REVENUECAT_API_KEY_IOS : REVENUECAT_API_KEY_ANDROID;

  try {
    // Set log level for debugging
    if (__DEV__ && PurchasesSDK.LOG_LEVEL) {
      PurchasesSDK.setLogLevel(PurchasesSDK.LOG_LEVEL.DEBUG);
    }

    // Configure with API key
    await PurchasesSDK.configure({
      apiKey,
      appUserID: userId,
    });

    isInitialized = true;
    initializationError = null;

    if (__DEV__) {
      console.log('[RevenueCat] ✅ Initialized successfully');
    }

    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    initializationError = message;
    
    if (__DEV__) {
      console.error('[RevenueCat] ❌ Initialization failed:', message);
    }
    
    return false;
  }
}

/**
 * Get initialization status
 */
export function getInitializationStatus(): { initialized: boolean; error: string | null } {
  return {
    initialized: isInitialized,
    error: initializationError,
  };
}

// ============================================================================
// USER MANAGEMENT
// ============================================================================

/**
 * Log in a user (for cross-platform subscription sync)
 */
export async function loginUser(userId: string): Promise<any | null> {
  if (!isInitialized || !PurchasesSDK) {
    if (__DEV__) console.warn('[RevenueCat] Not initialized');
    return null;
  }

  try {
    const { customerInfo } = await PurchasesSDK.logIn(userId);
    if (__DEV__) {
      console.log('[RevenueCat] User logged in:', userId);
    }
    return customerInfo;
  } catch (error) {
    if (__DEV__) {
      console.error('[RevenueCat] Login failed:', error);
    }
    return null;
  }
}

/**
 * Log out user (reset to anonymous)
 */
export async function logoutUser(): Promise<any | null> {
  if (!isInitialized || !PurchasesSDK) return null;

  try {
    const customerInfo = await PurchasesSDK.logOut();
    if (__DEV__) {
      console.log('[RevenueCat] User logged out');
    }
    return customerInfo;
  } catch (error) {
    if (__DEV__) {
      console.error('[RevenueCat] Logout failed:', error);
    }
    return null;
  }
}

// ============================================================================
// SUBSCRIPTION STATUS
// ============================================================================

/**
 * Get current subscription status
 */
export async function getSubscriptionStatus(): Promise<SubscriptionStatus> {
  const defaultStatus: SubscriptionStatus = {
    isPremium: false,
    willRenew: false,
  };

  if (!isInitialized || !PurchasesSDK) {
    if (__DEV__) console.log('[RevenueCat] Not initialized - returning default status');
    return defaultStatus;
  }

  try {
    const customerInfo = await PurchasesSDK.getCustomerInfo();
    return parseCustomerInfo(customerInfo);
  } catch (error) {
    if (__DEV__) {
      console.error('[RevenueCat] Failed to get subscription status:', error);
    }
    return defaultStatus;
  }
}

/**
 * Parse CustomerInfo into our SubscriptionStatus format
 */
function parseCustomerInfo(customerInfo: any): SubscriptionStatus {
  const premiumEntitlement = customerInfo?.entitlements?.active?.[PREMIUM_ENTITLEMENT_ID];
  
  if (!premiumEntitlement) {
    return {
      isPremium: false,
      willRenew: false,
    };
  }

  return {
    isPremium: true,
    activeProductId: premiumEntitlement.productIdentifier,
    expirationDate: premiumEntitlement.expirationDate 
      ? new Date(premiumEntitlement.expirationDate) 
      : undefined,
    willRenew: premiumEntitlement.willRenew,
    managementUrl: customerInfo.managementURL || undefined,
  };
}

/**
 * Check if user has premium access (quick check)
 */
export async function checkPremiumAccess(): Promise<boolean> {
  if (!isInitialized || !PurchasesSDK) return false;

  try {
    const customerInfo = await PurchasesSDK.getCustomerInfo();
    return PREMIUM_ENTITLEMENT_ID in (customerInfo?.entitlements?.active || {});
  } catch (error) {
    if (__DEV__) {
      console.error('[RevenueCat] Premium check failed:', error);
    }
    return false;
  }
}

// ============================================================================
// PRODUCTS & OFFERINGS
// ============================================================================

/**
 * Get available subscription offerings
 */
export async function getOfferings(): Promise<any | null> {
  if (!isInitialized || !PurchasesSDK) {
    if (__DEV__) console.log('[RevenueCat] Not initialized - no offerings');
    return null;
  }

  try {
    const offerings = await PurchasesSDK.getOfferings();
    
    if (!offerings?.current) {
      if (__DEV__) {
        console.warn('[RevenueCat] No current offering configured');
      }
      return null;
    }

    if (__DEV__) {
      console.log('[RevenueCat] Offerings loaded:', offerings.current.identifier);
    }

    return offerings.current;
  } catch (error) {
    if (__DEV__) {
      console.error('[RevenueCat] Failed to get offerings:', error);
    }
    return null;
  }
}

/**
 * Get subscription products in a simplified format
 * Returns mock products in stub mode for UI testing
 */
export async function getSubscriptionProducts(): Promise<SubscriptionProduct[]> {
  // If not configured, return mock products for UI development
  if (!isInitialized || !PurchasesSDK) {
    if (__DEV__) {
      console.log('[RevenueCat] Returning mock products for development');
    }
    return [
      {
        identifier: PRODUCT_IDS.MONTHLY,
        title: 'Asrar Premium Monthly',
        description: 'Full access to all premium features',
        priceString: '$3.99',
        price: 3.99,
        currencyCode: 'USD',
        packageType: 'MONTHLY',
        rcPackage: null,
      },
      {
        identifier: PRODUCT_IDS.YEARLY,
        title: 'Asrar Premium Yearly',
        description: 'Full access to all premium features - Save 37%!',
        priceString: '$29.99',
        price: 29.99,
        currencyCode: 'USD',
        packageType: 'ANNUAL',
        rcPackage: null,
      },
    ];
  }

  const offering = await getOfferings();
  
  if (!offering) {
    return [];
  }

  return offering.availablePackages.map((pkg: any) => ({
    identifier: pkg.product.identifier,
    title: pkg.product.title,
    description: pkg.product.description,
    priceString: pkg.product.priceString,
    price: pkg.product.price,
    currencyCode: pkg.product.currencyCode,
    packageType: pkg.packageType,
    rcPackage: pkg,
  }));
}

// ============================================================================
// PURCHASES
// ============================================================================

/**
 * Purchase a subscription package
 */
export async function purchasePackage(pkg: any): Promise<PurchaseResult> {
  if (!isInitialized || !PurchasesSDK) {
    return {
      success: false,
      error: 'RevenueCat not initialized. Configure API keys to enable purchases.',
    };
  }

  if (!pkg) {
    return {
      success: false,
      error: 'No package provided',
    };
  }

  try {
    const { customerInfo } = await PurchasesSDK.purchasePackage(pkg);
    
    const isPremium = PREMIUM_ENTITLEMENT_ID in (customerInfo?.entitlements?.active || {});
    
    if (__DEV__) {
      console.log('[RevenueCat] Purchase completed, isPremium:', isPremium);
    }

    return {
      success: isPremium,
      customerInfo,
    };
  } catch (error: any) {
    if (error.userCancelled) {
      if (__DEV__) {
        console.log('[RevenueCat] User cancelled purchase');
      }
      return {
        success: false,
        userCancelled: true,
      };
    }

    const message = error.message || 'Purchase failed';
    if (__DEV__) {
      console.error('[RevenueCat] Purchase failed:', message);
    }

    return {
      success: false,
      error: message,
    };
  }
}

/**
 * Purchase by product identifier (convenience method)
 */
export async function purchaseProduct(productId: string): Promise<PurchaseResult> {
  if (!isInitialized || !PurchasesSDK) {
    return {
      success: false,
      error: 'RevenueCat not initialized',
    };
  }

  const products = await getSubscriptionProducts();
  const product = products.find(p => p.identifier === productId);

  if (!product || !product.rcPackage) {
    return {
      success: false,
      error: `Product not found: ${productId}`,
    };
  }

  return purchasePackage(product.rcPackage);
}

// ============================================================================
// RESTORE PURCHASES
// ============================================================================

/**
 * Restore previous purchases
 */
export async function restorePurchases(): Promise<PurchaseResult> {
  if (!isInitialized || !PurchasesSDK) {
    return {
      success: false,
      error: 'RevenueCat not initialized. Configure API keys to restore purchases.',
    };
  }

  try {
    const customerInfo = await PurchasesSDK.restorePurchases();
    const isPremium = PREMIUM_ENTITLEMENT_ID in (customerInfo?.entitlements?.active || {});

    if (__DEV__) {
      console.log('[RevenueCat] Restore completed, isPremium:', isPremium);
    }

    return {
      success: true,
      customerInfo,
    };
  } catch (error: any) {
    const message = error.message || 'Restore failed';
    if (__DEV__) {
      console.error('[RevenueCat] Restore failed:', message);
    }

    return {
      success: false,
      error: message,
    };
  }
}

// ============================================================================
// SUBSCRIPTION MANAGEMENT
// ============================================================================

/**
 * Open subscription management (App Store / Play Store)
 */
export async function openSubscriptionManagement(): Promise<void> {
  if (!isInitialized || !PurchasesSDK) {
    if (__DEV__) {
      console.warn('[RevenueCat] Not initialized - cannot open management');
    }
    return;
  }

  try {
    const customerInfo = await PurchasesSDK.getCustomerInfo();
    
    if (customerInfo?.managementURL) {
      const { Linking } = require('react-native');
      await Linking.openURL(customerInfo.managementURL);
    } else {
      if (__DEV__) {
        console.warn('[RevenueCat] No management URL available');
      }
    }
  } catch (error) {
    if (__DEV__) {
      console.error('[RevenueCat] Failed to open management:', error);
    }
  }
}

// ============================================================================
// LISTENERS
// ============================================================================

/**
 * Add listener for customer info updates
 * Returns unsubscribe function
 */
export function addCustomerInfoUpdateListener(
  callback: (customerInfo: any) => void
): () => void {
  if (!isInitialized || !PurchasesSDK) {
    return () => {};
  }

  try {
    PurchasesSDK.addCustomerInfoUpdateListener(callback);
  } catch (error) {
    if (__DEV__) {
      console.error('[RevenueCat] Failed to add listener:', error);
    }
  }
  
  return () => {
    // Cleanup handled by SDK lifecycle
  };
}

// ============================================================================
// DEBUG HELPERS
// ============================================================================

/**
 * Get debug info about RevenueCat state
 */
export function getDebugInfo(): {
  configured: boolean;
  initialized: boolean;
  error: string | null;
  platform: string;
  hasApiKey: boolean;
  sdkLoaded: boolean;
} {
  const apiKey = Platform.OS === 'ios' ? REVENUECAT_API_KEY_IOS : REVENUECAT_API_KEY_ANDROID;
  
  return {
    configured: isRevenueCatConfigured(),
    initialized: isInitialized,
    error: initializationError,
    platform: Platform.OS,
    hasApiKey: Boolean(apiKey),
    sdkLoaded: Boolean(PurchasesSDK),
  };
}
