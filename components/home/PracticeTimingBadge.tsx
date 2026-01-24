/**
 * Practice Timing Badge Component
 * ================================
 * A compact badge that shows personalized timing analysis
 * Integrates the Asrariya Timing Engine into home screen widgets
 */

import { DarkTheme, Spacing, Typography } from '@/constants/DarkTheme';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProfile } from '@/contexts/ProfileContext';
import {
    quickTimingCheck,
    type PracticeCategory,
    type TimingLevel,
} from '@/services/AsrariyaTimingEngine';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface PracticeTimingBadgeProps {
  /** Which practice category to analyze */
  category?: PracticeCategory;
  /** Whether to show the badge in compact mode */
  compact?: boolean;
  /** Custom label to show instead of default */
  customLabel?: string;
  /** Whether to show the score percentage */
  showScore?: boolean;
}

interface TimingResult {
  level: TimingLevel;
  score: number;
  quickTip: string;
}

type TimingResultWithLabel = TimingResult & { label: string };

const TIMING_COLORS: Record<TimingLevel, string> = {
  optimal: '#10b981',    // Green
  favorable: '#60A5FA',  // Blue
  moderate: '#f59e0b',   // Amber
  challenging: '#f97316', // Orange
  avoid: '#ef4444',      // Red
};

const TIMING_LABELS: Record<TimingLevel, string> = {
  optimal: 'Optimal',
  favorable: 'Favorable',
  moderate: 'Moderate',
  challenging: 'Challenging',
  avoid: 'Avoid',
};

const TIMING_ICONS: Record<TimingLevel, string> = {
  optimal: '✨',
  favorable: '🌟',
  moderate: '⚖️',
  challenging: '⚠️',
  avoid: '🚫',
};

export function PracticeTimingBadge({
  category = 'general',
  compact = false,
  customLabel,
  showScore = false,
}: PracticeTimingBadgeProps) {
  const { t } = useLanguage();
  const { profile } = useProfile();
  const [timing, setTiming] = useState<TimingResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getLevelFromScore = (score: number): TimingLevel => {
    if (score >= 80) return 'optimal';
    if (score >= 65) return 'favorable';
    if (score >= 45) return 'moderate';
    if (score >= 25) return 'challenging';
    return 'avoid';
  };

  useEffect(() => {
    let cancelled = false;

    const analyze = async () => {
      try {
        // Only analyze if user has profile data
        if (!profile?.derived?.element) {
          setTiming(null);
          setIsLoading(false);
          return;
        }

        const location =
          typeof profile.location?.latitude === 'number' &&
          typeof profile.location?.longitude === 'number'
            ? { latitude: profile.location.latitude, longitude: profile.location.longitude }
            : undefined;

        const quick = await quickTimingCheck(profile, category, location);
        const level = getLevelFromScore(quick.score);
        const result: TimingResult = {
          level,
          score: quick.score,
          quickTip: quick.summary,
        };
        
        if (!cancelled) {
          setTiming(result);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('PracticeTimingBadge error:', error);
        if (!cancelled) {
          setTiming(null);
          setIsLoading(false);
        }
      }
    };

    analyze();

    // Refresh every 5 minutes
    const interval = setInterval(analyze, 5 * 60 * 1000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [profile, category]);

  // Don't show anything while loading or if no profile
  if (isLoading || !timing) {
    return null;
  }

  const color = TIMING_COLORS[timing.level];
  const label =
    customLabel ||
    t(`asrariya.timing.${timing.level}`) ||
    TIMING_LABELS[timing.level];
  const icon = TIMING_ICONS[timing.level];

  if (compact) {
    return (
      <View style={[styles.compactBadge, { borderColor: color, backgroundColor: `${color}15` }]}>
        <Text style={styles.compactIcon}>{icon}</Text>
        <Text style={[styles.compactLabel, { color }]}>{label}</Text>
        {showScore && (
          <Text style={[styles.compactScore, { color }]}>{timing.score}%</Text>
        )}
      </View>
    );
  }

  return (
    <View style={[styles.badge, { borderColor: color, backgroundColor: `${color}10` }]}>
      <View style={styles.badgeHeader}>
        <Text style={styles.badgeIcon}>{icon}</Text>
        <Text style={[styles.badgeLabel, { color }]}>{label}</Text>
        {showScore && (
          <Text style={[styles.badgeScore, { color }]}>{timing.score}%</Text>
        )}
      </View>
      <Text style={styles.badgeTip} numberOfLines={1}>
        {timing.quickTip}
      </Text>
    </View>
  );
}

/**
 * Hook to get current timing analysis for any category
 */
export function usePracticeTiming(category: PracticeCategory = 'general') {
  const { t } = useLanguage();
  const { profile } = useProfile();
  const [timing, setTiming] = useState<TimingResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getLevelFromScore = (score: number): TimingLevel => {
    if (score >= 80) return 'optimal';
    if (score >= 65) return 'favorable';
    if (score >= 45) return 'moderate';
    if (score >= 25) return 'challenging';
    return 'avoid';
  };

  useEffect(() => {
    let cancelled = false;

    const analyze = async () => {
      try {
        if (!profile?.derived?.element) {
          setTiming(null);
          setIsLoading(false);
          return;
        }

        const location =
          typeof profile.location?.latitude === 'number' &&
          typeof profile.location?.longitude === 'number'
            ? { latitude: profile.location.latitude, longitude: profile.location.longitude }
            : undefined;

        const quick = await quickTimingCheck(profile, category, location);
        const level = getLevelFromScore(quick.score);
        const result: TimingResult = {
          level,
          score: quick.score,
          quickTip: quick.summary,
        };
        
        if (!cancelled) {
          setTiming(result);
          setIsLoading(false);
        }
      } catch (error) {
        if (!cancelled) {
          setTiming(null);
          setIsLoading(false);
        }
      }
    };

    analyze();
    const interval = setInterval(analyze, 5 * 60 * 1000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [profile, category]);

  return {
    timing: (timing
      ? {
          ...timing,
          label: t(`asrariya.timing.${timing.level}`) || TIMING_LABELS[timing.level],
        }
      : null) as TimingResultWithLabel | null,
    isLoading,
  };
}

const styles = StyleSheet.create({
  badge: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  badgeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badgeIcon: {
    fontSize: 12,
  },
  badgeLabel: {
    fontSize: Typography.caption,
    fontWeight: Typography.weightSemibold as any,
  },
  badgeScore: {
    fontSize: Typography.caption,
    fontWeight: Typography.weightMedium as any,
    marginLeft: 4,
  },
  badgeTip: {
    fontSize: 11,
    color: DarkTheme.textTertiary,
    marginTop: 2,
  },
  compactBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 4,
  },
  compactIcon: {
    fontSize: 10,
  },
  compactLabel: {
    fontSize: 11,
    fontWeight: Typography.weightSemibold as any,
  },
  compactScore: {
    fontSize: 10,
    fontWeight: Typography.weightMedium as any,
  },
});
