/**
 * AdContext - React Context for Ad State Management
 * ==================================================
 * Provides ad-related state and controls throughout the app.
 * Wraps AdMob SDK initialization, consent, and ad visibility logic.
 *
 * Usage:
 *   <AdProvider>
 *     <App />
 *   </AdProvider>
 *
 *   const { adsEnabled, showInterstitialIfReady } = useAds();
 */

import { useProfile } from '@/contexts/ProfileContext';
import { getAdUnitId, shouldShowAds, shouldShowInterstitial } from '@/services/AdService';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

// Lazy-load the AdMob SDK to avoid crashes when not configured / in Expo Go
let mobileAds: any = null;
let InterstitialAd: any = null;
let RewardedAd: any = null;
let AdEventType: any = null;
let RewardedAdEventType: any = null;
let TestIds: any = null;

try {
  const rnGMA = require('react-native-google-mobile-ads');
  mobileAds = rnGMA.default;
  InterstitialAd = rnGMA.InterstitialAd;
  RewardedAd = rnGMA.RewardedAd;
  AdEventType = rnGMA.AdEventType;
  RewardedAdEventType = rnGMA.RewardedAdEventType;
  TestIds = rnGMA.TestIds;
} catch {
  // SDK not available (e.g. Expo Go, web) — ads will be disabled
  if (__DEV__) {
    console.log('[AdContext] react-native-google-mobile-ads not available — ads disabled');
  }
}

// ============================================================================
// TYPES
// ============================================================================

export interface AdContextType {
  /** Whether ads should be shown (false for admin/premium/SDK unavailable) */
  adsEnabled: boolean;

  /** Whether the SDK has been initialized */
  sdkReady: boolean;

  /** Show an interstitial ad (throttled: every 3rd calculation) */
  showInterstitialIfReady: () => void;

  /** Show a rewarded ad. Resolves true if the user earned the reward. */
  showRewarded: () => Promise<boolean>;

  /** Manually record a calculation (for interstitial throttle) */
  recordCalculation: () => boolean;
}

// ============================================================================
// CONTEXT
// ============================================================================

const AdContext = createContext<AdContextType>({
  adsEnabled: false,
  sdkReady: false,
  showInterstitialIfReady: () => {},
  showRewarded: async () => false,
  recordCalculation: () => false,
});

// ============================================================================
// PROVIDER
// ============================================================================

export function AdProvider({ children }: { children: React.ReactNode }) {
  const { profile } = useProfile();
  const [sdkReady, setSdkReady] = useState(false);

  // Interstitial ad instance
  const interstitialRef = useRef<any>(null);
  const [interstitialLoaded, setInterstitialLoaded] = useState(false);

  // Rewarded ad
  const rewardedRef = useRef<any>(null);
  const [rewardedLoaded, setRewardedLoaded] = useState(false);
  const rewardedResolveRef = useRef<((earned: boolean) => void) | null>(null);

  // ============================================================================
  // ADMIN / PREMIUM CHECK
  // ============================================================================

  const userEmail = profile?.account?.email || null;
  // We'll consider premium status from SubscriptionContext separately.
  // For now, admins always skip ads. Premium check happens in useAds() consumers.
  const adsEnabled = useMemo(() => {
    if (!mobileAds) return false; // SDK not available
    return shouldShowAds(userEmail, false); // premium check is done at component level too
  }, [userEmail]);

  // ============================================================================
  // SDK INITIALIZATION
  // ============================================================================

  useEffect(() => {
    if (!mobileAds || !adsEnabled) return;

    const init = async () => {
      try {
        await mobileAds().initialize();
        setSdkReady(true);
        if (__DEV__) console.log('[AdContext] AdMob SDK initialized ✅');
      } catch (err) {
        if (__DEV__) console.warn('[AdContext] AdMob init failed:', err);
      }
    };

    init();
  }, [adsEnabled]);

  // ============================================================================
  // INTERSTITIAL AD
  // ============================================================================

  const loadInterstitial = useCallback(() => {
    if (!InterstitialAd || !sdkReady || !adsEnabled) return;

    try {
      const unitId = getAdUnitId('INTERSTITIAL');
      const interstitial = InterstitialAd.createForAdRequest(unitId, {
        requestNonPersonalizedAdsOnly: true,
      });

      const unsubLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => {
        setInterstitialLoaded(true);
      });

      const unsubClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
        setInterstitialLoaded(false);
        // Pre-load next interstitial
        loadInterstitial();
      });

      const unsubError = interstitial.addAdEventListener(AdEventType.ERROR, (error: any) => {
        if (__DEV__) console.warn('[AdContext] Interstitial error:', error);
        setInterstitialLoaded(false);
      });

      interstitialRef.current = interstitial;
      interstitial.load();

      return () => {
        unsubLoaded();
        unsubClosed();
        unsubError();
      };
    } catch (err) {
      if (__DEV__) console.warn('[AdContext] Failed to create interstitial:', err);
    }
  }, [sdkReady, adsEnabled]);

  useEffect(() => {
    if (sdkReady && adsEnabled) {
      loadInterstitial();
    }
  }, [sdkReady, adsEnabled, loadInterstitial]);

  // ============================================================================
  // REWARDED AD
  // ============================================================================

  const loadRewarded = useCallback(() => {
    if (!RewardedAd || !sdkReady || !adsEnabled) return;

    try {
      const unitId = getAdUnitId('REWARDED');
      const rewarded = RewardedAd.createForAdRequest(unitId, {
        requestNonPersonalizedAdsOnly: true,
      });

      const unsubLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
        setRewardedLoaded(true);
      });

      const unsubEarned = rewarded.addAdEventListener(
        RewardedAdEventType.EARNED_REWARD,
        () => {
          if (rewardedResolveRef.current) {
            rewardedResolveRef.current(true);
            rewardedResolveRef.current = null;
          }
        }
      );

      const unsubClosed = rewarded.addAdEventListener(AdEventType.CLOSED, () => {
        // If the user closed without earning, resolve false
        if (rewardedResolveRef.current) {
          rewardedResolveRef.current(false);
          rewardedResolveRef.current = null;
        }
        setRewardedLoaded(false);
        loadRewarded(); // Pre-load next
      });

      const unsubError = rewarded.addAdEventListener(AdEventType.ERROR, (error: any) => {
        if (__DEV__) console.warn('[AdContext] Rewarded error:', error);
        if (rewardedResolveRef.current) {
          rewardedResolveRef.current(false);
          rewardedResolveRef.current = null;
        }
        setRewardedLoaded(false);
      });

      rewardedRef.current = rewarded;
      rewarded.load();

      return () => {
        unsubLoaded();
        unsubEarned();
        unsubClosed();
        unsubError();
      };
    } catch (err) {
      if (__DEV__) console.warn('[AdContext] Failed to create rewarded:', err);
    }
  }, [sdkReady, adsEnabled]);

  useEffect(() => {
    if (sdkReady && adsEnabled) {
      loadRewarded();
    }
  }, [sdkReady, adsEnabled, loadRewarded]);

  // ============================================================================
  // PUBLIC METHODS
  // ============================================================================

  /**
   * Record a calculation and return whether to show an interstitial.
   */
  const recordCalculation = useCallback((): boolean => {
    if (!adsEnabled) return false;
    return shouldShowInterstitial();
  }, [adsEnabled]);

  /**
   * Show an interstitial if one is loaded and throttle allows it.
   * Called automatically after recordCalculation() returns true.
   */
  const showInterstitialIfReady = useCallback(() => {
    if (!adsEnabled || !interstitialLoaded || !interstitialRef.current) return;
    try {
      interstitialRef.current.show();
    } catch (err) {
      if (__DEV__) console.warn('[AdContext] Interstitial show failed:', err);
    }
  }, [adsEnabled, interstitialLoaded]);

  /**
   * Show a rewarded ad. Returns a Promise that resolves to true if
   * the user watched the full ad and earned the reward.
   */
  const showRewarded = useCallback((): Promise<boolean> => {
    if (!adsEnabled || !rewardedLoaded || !rewardedRef.current) {
      return Promise.resolve(false);
    }

    return new Promise<boolean>((resolve) => {
      rewardedResolveRef.current = resolve;
      try {
        rewardedRef.current.show();
      } catch (err) {
        if (__DEV__) console.warn('[AdContext] Rewarded show failed:', err);
        resolve(false);
        rewardedResolveRef.current = null;
      }
    });
  }, [adsEnabled, rewardedLoaded]);

  // ============================================================================
  // CONTEXT VALUE
  // ============================================================================

  const value = useMemo<AdContextType>(
    () => ({
      adsEnabled,
      sdkReady,
      showInterstitialIfReady,
      showRewarded,
      recordCalculation,
    }),
    [adsEnabled, sdkReady, showInterstitialIfReady, showRewarded, recordCalculation]
  );

  return <AdContext.Provider value={value}>{children}</AdContext.Provider>;
}

// ============================================================================
// HOOK
// ============================================================================

export function useAds(): AdContextType {
  return useContext(AdContext);
}
