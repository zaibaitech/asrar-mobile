/**
 * AdService - AdMob Integration
 * ==============================
 * Centralized ad management for the Asrariya app.
 *
 * Features:
 * - Banner, Interstitial, and Rewarded ads via Google AdMob
 * - Interstitial throttling (every N-th calculation)
 * - Admin bypass (no ads for admin/premium users)
 * - Test ad unit IDs for development, real IDs for production
 * - iOS ATT (App Tracking Transparency) consent handling
 *
 * Setup:
 * 1. Replace app IDs in app.json with real AdMob app IDs
 * 2. Replace ad unit IDs below with real ones from AdMob console
 * 3. Build with EAS (ads don't work in Expo Go)
 */

import { Platform } from 'react-native';

// ============================================================================
// AD UNIT IDS
// ============================================================================

/**
 * Google's official test ad unit IDs.
 * Replace with real IDs from your AdMob dashboard before publishing.
 *
 * To get real IDs:
 * 1. Create an AdMob account at https://admob.google.com
 * 2. Register your app (iOS + Android separately)
 * 3. Create ad units for Banner, Interstitial, and Rewarded
 * 4. Copy the ad unit IDs below
 */
const TEST_AD_UNITS = {
  BANNER: Platform.select({
    ios: 'ca-app-pub-3940256099942544/2934735716',
    android: 'ca-app-pub-3940256099942544/6300978111',
    default: 'ca-app-pub-3940256099942544/6300978111',
  }),
  INTERSTITIAL: Platform.select({
    ios: 'ca-app-pub-3940256099942544/4411468910',
    android: 'ca-app-pub-3940256099942544/1033173712',
    default: 'ca-app-pub-3940256099942544/1033173712',
  }),
  REWARDED: Platform.select({
    ios: 'ca-app-pub-3940256099942544/1712485313',
    android: 'ca-app-pub-3940256099942544/5224354917',
    default: 'ca-app-pub-3940256099942544/5224354917',
  }),
};

/**
 * Production ad unit IDs — replace these with your real AdMob ad unit IDs.
 * Until replaced, they fall back to test IDs.
 */
const PRODUCTION_AD_UNITS = {
  BANNER: Platform.select({
    ios: process.env.EXPO_PUBLIC_ADMOB_BANNER_IOS || '',
    android: process.env.EXPO_PUBLIC_ADMOB_BANNER_ANDROID || '',
    default: '',
  }),
  INTERSTITIAL: Platform.select({
    ios: process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_IOS || '',
    android: process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_ANDROID || '',
    default: '',
  }),
  REWARDED: Platform.select({
    ios: process.env.EXPO_PUBLIC_ADMOB_REWARDED_IOS || '',
    android: process.env.EXPO_PUBLIC_ADMOB_REWARDED_ANDROID || '',
    default: '',
  }),
};

// ============================================================================
// EXPORTS
// ============================================================================

/**
 * Returns the appropriate ad unit ID (production if set, otherwise test).
 */
export function getAdUnitId(type: 'BANNER' | 'INTERSTITIAL' | 'REWARDED'): string {
  const prodId = PRODUCTION_AD_UNITS[type];
  if (prodId && prodId.startsWith('ca-app-pub-')) {
    return prodId;
  }
  return TEST_AD_UNITS[type];
}

// ============================================================================
// INTERSTITIAL THROTTLE
// ============================================================================

/** Show an interstitial ad every N-th calculation */
const INTERSTITIAL_FREQUENCY = 3;

let _calcCount = 0;

/**
 * Increment the calculation counter and return true if an interstitial should show.
 */
export function shouldShowInterstitial(): boolean {
  _calcCount += 1;
  return _calcCount % INTERSTITIAL_FREQUENCY === 0;
}

/**
 * Reset the calculation counter (e.g. on app restart).
 */
export function resetCalcCounter(): void {
  _calcCount = 0;
}

/**
 * Get the current calculation count (for debugging).
 */
export function getCalcCount(): number {
  return _calcCount;
}

// ============================================================================
// ADMIN CHECK (mirrors SubscriptionContext logic)
// ============================================================================

const ADMIN_EMAILS_RAW = process.env.EXPO_PUBLIC_ADMIN_EMAILS || '';
const ADMIN_EMAILS = ADMIN_EMAILS_RAW
  .split(',')
  .map((email: string) => email.trim().toLowerCase())
  .filter((email: string) => email.length > 0);

/**
 * Check if a user should see ads.
 * Admins and premium subscribers should NOT see ads.
 */
export function shouldShowAds(userEmail?: string | null, isPremium?: boolean): boolean {
  // Premium users never see ads
  if (isPremium) return false;

  // Admin users never see ads
  if (userEmail) {
    const normalizedEmail = userEmail.toLowerCase().trim();
    if (ADMIN_EMAILS.includes(normalizedEmail)) return false;
  }

  return true;
}
