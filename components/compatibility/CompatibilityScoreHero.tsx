/**
 * Compatibility Score Hero
 * ===========================
 * The headline number/verdict for the simplified DOB compatibility result
 * screen. Visually distinct from TierBadge (large number + bar vs. small
 * chip) — a separate component rather than a `large` TierBadge variant,
 * since the score itself is a DISPLAY-ONLY derivation of the tier system
 * (services/compatibility/simplifiedScore.ts), not the tier badge itself.
 *
 * @module CompatibilityScoreHero
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLanguage } from '../../contexts/LanguageContext';
import type { Verdict } from '../../services/compatibility/simplifiedScore';

const VERDICT_COLORS: Record<Verdict, string> = {
  excellent: '#10b981', // same green as saeed
  good: '#34d399',      // lighter green, visually distinct from excellent
  mixed: '#f59e0b',     // same amber as mutadil
  challenging: '#dc2626', // same red as mahdhur
};

interface CompatibilityScoreHeroProps {
  score: number;
  verdict: Verdict;
  isRTL?: boolean;
}

export function CompatibilityScoreHero({ score, verdict, isRTL }: CompatibilityScoreHeroProps) {
  const { t } = useLanguage();
  const color = VERDICT_COLORS[verdict];

  return (
    <View style={styles.container}>
      <Text style={[styles.score, { color }]}>{score}%</Text>
      <Text style={[styles.verdict, { color }, isRTL && styles.textRTL]}>
        {t(`compatibility.results.zodiac.simplified.verdict.${verdict}`)}
      </Text>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${score}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

interface CategoryScoreCardProps {
  emoji: string;
  label: string;
  score: number;
  verdict: Verdict;
  isRTL?: boolean;
}

export function CategoryScoreCard({ emoji, label, score, verdict, isRTL }: CategoryScoreCardProps) {
  const { t } = useLanguage();
  const color = VERDICT_COLORS[verdict];

  return (
    <View style={styles.categoryCard}>
      <Text style={styles.categoryEmoji}>{emoji}</Text>
      <Text style={[styles.categoryLabel, isRTL && styles.textRTL]} numberOfLines={1}>
        {label}
      </Text>
      <Text style={[styles.categoryScore, { color }]}>{score}%</Text>
      <Text style={[styles.categoryVerdict, { color }, isRTL && styles.textRTL]} numberOfLines={1}>
        {t(`compatibility.results.zodiac.simplified.verdict.${verdict}`)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  score: {
    fontSize: 52,
    fontWeight: '800',
  },
  verdict: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 4,
    marginBottom: 14,
  },
  barTrack: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  textRTL: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  categoryCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 12,
    alignItems: 'center',
  },
  categoryEmoji: {
    fontSize: 22,
    marginBottom: 4,
  },
  categoryLabel: {
    fontSize: 12,
    color: '#B0B0B0',
    fontWeight: '600',
    marginBottom: 4,
  },
  categoryScore: {
    fontSize: 20,
    fontWeight: '800',
  },
  categoryVerdict: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
});
