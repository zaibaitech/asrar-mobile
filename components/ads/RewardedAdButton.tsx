/**
 * RewardedAdButton - "Watch ad to unlock" Component
 * ===================================================
 * A button that triggers a rewarded video ad. When the user watches the full ad,
 * the `onRewardEarned` callback fires, unlocking premium content temporarily.
 *
 * Usage:
 *   import { RewardedAdButton } from '@/components/ads/RewardedAdButton';
 *
 *   <RewardedAdButton
 *     label="Watch ad to unlock"
 *     onRewardEarned={() => setUnlocked(true)}
 *   />
 */

import { useAds } from '@/contexts/AdContext';
import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

interface RewardedAdButtonProps {
  /** Button text */
  label?: string;
  /** Called when the user earns the reward */
  onRewardEarned: () => void;
  /** Called when the ad fails or the user closes early */
  onRewardMissed?: () => void;
  /** Optional style override */
  style?: object;
  /** Optional text style override */
  textStyle?: object;
  /** Custom icon (rendered before the label) */
  icon?: React.ReactNode;
}

export function RewardedAdButton({
  label = '▶  Watch ad to unlock',
  onRewardEarned,
  onRewardMissed,
  style,
  textStyle,
  icon,
}: RewardedAdButtonProps) {
  const { adsEnabled, showRewarded } = useAds();
  const [loading, setLoading] = useState(false);

  if (!adsEnabled) {
    // If ads are disabled (admin/premium), don't render the button at all.
    // The parent component should handle granting access directly.
    return null;
  }

  const handlePress = async () => {
    setLoading(true);
    try {
      const earned = await showRewarded();
      if (earned) {
        onRewardEarned();
      } else {
        onRewardMissed?.();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
        style,
      ]}
      onPress={handlePress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <View style={styles.content}>
          {icon}
          <Text style={[styles.label, textStyle]}>{label}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
});
