/**
 * TierBadge — ported from asrar.app's TierBadge.tsx.
 * Web: a pill with a solid dot, EN/FR label, small Arabic label, and score,
 * background/border at the tier color's alpha-suffixed hex (bg 0x12 ≈ 7%,
 * border 0x40 = 25% — RN supports 8-digit #RRGGBBAA hex directly, same
 * pattern already used by AsrariyaTimingEngine/unifiedBadge.ts elsewhere
 * in this app).
 *
 * On narrow phones the full pill (tier name + "(Transliteration)" + Arabic
 * + "/100") is wider than the space left beside a date label and overflows
 * its row — worst case is "Acceptable (Maqbūl)" in EN/FR. Below
 * COMPACT_BREAKPOINT we drop the parenthesised transliteration (which is
 * baked into tierInfo.labelAr, e.g. "مقبول (Maqbūl)") and the "/100"
 * suffix, keeping the tier name, plain Arabic word, dot, and bare score.
 */

import React from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { TierInfo } from '@/services/ikhtiyaratEngine';
import { UiLang } from '@/services/ikhtiyaratEngine/copy';

export interface TierBadgeProps {
  tierInfo: TierInfo;
  language: UiLang;
  score: number;
}

const COMPACT_BREAKPOINT = 400;

function stripTransliteration(labelAr: string): string {
  return labelAr.replace(/\s*\([^)]*\)\s*$/, '').trim();
}

export default function TierBadge({ tierInfo, language, score }: Readonly<TierBadgeProps>) {
  const { width } = useWindowDimensions();
  const compact = width < COMPACT_BREAKPOINT;

  const arabicPlain = stripTransliteration(tierInfo.labelAr);
  const arabicSecondary = compact ? arabicPlain : tierInfo.labelAr;

  let label: string;
  if (language === 'fr') {
    label = tierInfo.labelFr;
  } else if (language === 'ar') {
    label = arabicSecondary;
  } else {
    label = tierInfo.labelEn;
  }
  const scoreText = compact ? `${score}` : `${score}/100`;

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: `${tierInfo.color}12`, borderColor: `${tierInfo.color}40` },
      ]}
    >
      <View style={[styles.dot, { backgroundColor: tierInfo.color }]} />
      <Text style={[styles.label, { color: tierInfo.color }]} numberOfLines={1}>
        {label}
      </Text>
      {language !== 'ar' && (
        <Text style={[styles.arabicLabel, { color: tierInfo.color }]} numberOfLines={1}>
          {arabicSecondary}
        </Text>
      )}
      <Text style={[styles.score, { color: tierInfo.color }]}>{scoreText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    flexShrink: 0,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    flexShrink: 1,
  },
  arabicLabel: {
    fontSize: 12,
    opacity: 0.7,
    flexShrink: 1,
  },
  score: {
    fontSize: 12,
    opacity: 0.6,
    flexShrink: 0,
    minWidth: 20,
    textAlign: 'right',
    fontVariant: ['tabular-nums'],
  },
});
