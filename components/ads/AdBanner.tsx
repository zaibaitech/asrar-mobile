/**
 * AdBanner - Adaptive Banner Ad Component
 * =========================================
 * Renders an AdMob adaptive banner at the bottom of result screens.
 * Automatically hides for admin/premium users and when SDK is unavailable.
 *
 * Usage:
 *   import { AdBanner } from '@/components/ads/AdBanner';
 *   // Place at the end of your ScrollView or as a footer
 *   <AdBanner />
 */

import { useAds } from '@/contexts/AdContext';
import { getAdUnitId } from '@/services/AdService';
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

// Lazy-load the banner component
let BannerAd: any = null;
let BannerAdSize: any = null;

try {
  const rnGMA = require('react-native-google-mobile-ads');
  BannerAd = rnGMA.BannerAd;
  BannerAdSize = rnGMA.BannerAdSize;
} catch {
  // SDK not available
}

interface AdBannerProps {
  /** Optional style override for the container */
  style?: object;
}

export function AdBanner({ style }: AdBannerProps) {
  const { adsEnabled, sdkReady } = useAds();

  const unitId = useMemo(() => getAdUnitId('BANNER'), []);

  if (!adsEnabled || !sdkReady || !BannerAd || !BannerAdSize) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <BannerAd
        unitId={unitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdFailedToLoad={(error: any) => {
          if (__DEV__) console.warn('[AdBanner] Failed to load:', error);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
    paddingVertical: 4,
  },
});
