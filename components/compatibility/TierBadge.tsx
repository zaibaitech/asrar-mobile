/**
 * Tier Badge — Saʿīd / Muʿtadil / Maḥdhūr
 * ==========================================
 * Small presentational chip for the DOB compatibility engine's 3-tier
 * outcome. Mirrors the visual idiom of the home Moment Alignment badge
 * (components/home/MomentAlignmentStrip.tsx's statusChip) so the two tier
 * systems read as siblings, without sharing code (they are deliberately
 * separate types — CompatibilityTier vs. AlignmentTier).
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { getCompatibilityTierBadge, type CompatibilityTier } from '../../services/compatibility/compatibilityTier';

interface TierBadgeProps {
  tier: CompatibilityTier;
  /** Localized one-line explanation shown below the label, if any. */
  detailText?: string;
  /** Larger variant for the single "Overall" badge. */
  large?: boolean;
  isRTL?: boolean;
}

export function TierBadge({ tier, detailText, large, isRTL }: TierBadgeProps) {
  const badge = getCompatibilityTierBadge(tier);

  return (
    <View style={[styles.container, large && styles.containerLarge]}>
      <View
        style={[
          styles.chip,
          large && styles.chipLarge,
          { borderColor: badge.color, backgroundColor: badge.bgColor },
        ]}
      >
        <Text style={[styles.icon, large && styles.iconLarge, { color: badge.color }]}>{badge.icon}</Text>
        <View style={styles.labelColumn}>
          <Text style={[styles.labelAr, large && styles.labelArLarge, { color: badge.color }, isRTL && styles.textRTL]}>
            {badge.labelAr}
          </Text>
          <Text style={[styles.translit, isRTL && styles.textRTL]}>{badge.translit}</Text>
        </View>
      </View>
      {!!detailText && (
        <Text style={[styles.detailText, isRTL && styles.textRTL]}>{detailText}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
  containerLarge: {
    alignItems: 'center',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  chipLarge: {
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 14,
  },
  icon: {
    fontSize: 16,
    fontWeight: '700',
  },
  iconLarge: {
    fontSize: 24,
  },
  labelColumn: {
    flexDirection: 'column',
  },
  labelAr: {
    fontSize: 15,
    fontWeight: '700',
  },
  labelArLarge: {
    fontSize: 20,
  },
  translit: {
    fontSize: 11,
    color: '#94a3b8',
  },
  detailText: {
    fontSize: 12,
    color: '#cbd5e1',
    lineHeight: 17,
  },
  textRTL: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
