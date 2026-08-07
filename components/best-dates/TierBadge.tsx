/**
 * TierBadge — ported from asrar.app's TierBadge.tsx.
 * Web: a pill with a solid dot, EN/FR label, small Arabic label, and score,
 * background/border at the tier color's alpha-suffixed hex (bg 0x12 ≈ 7%,
 * border 0x40 = 25% — RN supports 8-digit #RRGGBBAA hex directly, same
 * pattern already used by AsrariyaTimingEngine/unifiedBadge.ts elsewhere
 * in this app).
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TierInfo } from '@/services/ikhtiyaratEngine';
import { UiLang } from '@/services/ikhtiyaratEngine/copy';

export interface TierBadgeProps {
  tierInfo: TierInfo;
  language: UiLang;
  score: number;
}

export default function TierBadge({ tierInfo, language, score }: TierBadgeProps) {
  const label = language === 'fr' ? tierInfo.labelFr : language === 'ar' ? tierInfo.labelAr : tierInfo.labelEn;

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: `${tierInfo.color}12`, borderColor: `${tierInfo.color}40` },
      ]}
    >
      <View style={[styles.dot, { backgroundColor: tierInfo.color }]} />
      <Text style={[styles.label, { color: tierInfo.color }]}>{label}</Text>
      {language !== 'ar' && (
        <Text style={[styles.arabicLabel, { color: tierInfo.color }]}>{tierInfo.labelAr}</Text>
      )}
      <Text style={[styles.score, { color: tierInfo.color }]}>{score}/100</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  arabicLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  score: {
    fontSize: 12,
    opacity: 0.6,
  },
});
