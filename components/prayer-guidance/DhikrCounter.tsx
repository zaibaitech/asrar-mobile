/**
 * Dhikr Counter Component
 * 
 * Interactive counter for tracking Divine Name recitations
 * Phase 3: Functional UI only
 */

import { DarkTheme, Spacing, Typography } from '@/constants/DarkTheme';
import { useLanguage } from '@/contexts/LanguageContext';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

interface DhikrCounterProps {
  targetCount: number;
  onComplete?: () => void;
  onCountChange?: (count: number) => void;
}

export function DhikrCounter({ targetCount, onComplete, onCountChange }: DhikrCounterProps) {
  const { t, tSafe } = useLanguage();
  const [count, setCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  
  const progress = (count / targetCount) * 100;
  
  useEffect(() => {
    if (count === targetCount && !isCompleted) {
      setIsCompleted(true);
      if (hapticsEnabled) {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      onComplete?.();
    }
  }, [count, targetCount, isCompleted, onComplete, hapticsEnabled]);
  
  useEffect(() => {
    onCountChange?.(count);
  }, [count, onCountChange]);
  
  const handleIncrement = () => {
    if (count < targetCount) {
      setCount((prev) => prev + 1);
      if (hapticsEnabled) {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  };
  
  const handleReset = () => {
    setCount(0);
    setIsCompleted(false);
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{t('prayerGuidance.ui.dhikrCounter')}</Text>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>{tSafe('prayerGuidance.ui.startTracking', 'Start Tracking')}</Text>
        </View>
      </View>
      <Text style={styles.subtitle}>{t('prayerGuidance.ui.dhikrHelper')}</Text>
      
      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View 
          style={[
            styles.progressBar, 
            { width: `${progress}%` },
            isCompleted && styles.progressBarCompleted
          ]} 
        />
      </View>
      
      {/* Count Display */}
      <View style={styles.countCard}>
        <View style={styles.countContainer}>
          <Text style={styles.count}>{count}</Text>
          <Text style={styles.separator}>/</Text>
          <Text style={styles.target}>{targetCount}</Text>
        </View>
        <Text style={styles.percentage}>
          {t('prayerGuidance.ui.percentComplete', { percent: Math.round(progress) })}
        </Text>
      </View>
      
      {/* Completion Message */}
      {isCompleted && (
        <View style={styles.completionBanner}>
          <Text style={styles.completionText}>{t('prayerGuidance.ui.completedAlhamdulillah')}</Text>
        </View>
      )}
      
      {/* Counter Button */}
      <TouchableOpacity
        style={[
          styles.counterButton,
          isCompleted && styles.counterButtonCompleted
        ]}
        onPress={handleIncrement}
        disabled={isCompleted}
        activeOpacity={0.7}
      >
        <Text style={styles.counterButtonText}>
          {isCompleted ? t('prayerGuidance.ui.complete') : t('prayerGuidance.ui.tapToCount')}
        </Text>
        {!isCompleted && count === 0 && (
          <Text style={styles.counterButtonSubtext}>{tSafe('prayerGuidance.ui.startTracking', 'Start Tracking')}</Text>
        )}
      </TouchableOpacity>
      
      {/* Reset Button */}
      {count > 0 && (
        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleReset}
        >
          <Text style={styles.resetButtonText}>{t('prayerGuidance.ui.reset')}</Text>
        </TouchableOpacity>
      )}
      
      {/* Options */}
      <View style={styles.optionsRow}>
        <View style={styles.optionItem}>
          <Text style={styles.optionLabel}>{tSafe('prayerGuidance.ui.haptics', 'Haptics')}</Text>
          <Switch
            value={hapticsEnabled}
            onValueChange={setHapticsEnabled}
            thumbColor={hapticsEnabled ? '#64B5F6' : DarkTheme.textMuted}
            trackColor={{ false: DarkTheme.borderSubtle, true: 'rgba(100, 181, 246, 0.35)' }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.xl,
    backgroundColor: DarkTheme.cardBackground,
    borderRadius: 16,
    marginBottom: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: DarkTheme.borderSubtle,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
  },
  headerBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(100, 181, 246, 0.35)',
    backgroundColor: 'rgba(100, 181, 246, 0.12)',
  },
  headerBadgeText: {
    fontSize: 11,
    color: '#64B5F6',
    fontWeight: Typography.weightSemibold,
  },
  subtitle: {
    fontSize: 12,
    color: DarkTheme.textMuted,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: DarkTheme.cardBackgroundAlt,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 20
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#64B5F6',
    borderRadius: 4
  },
  progressBarCompleted: {
    backgroundColor: '#34C759'
  },
  countCard: {
    width: '100%',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    borderRadius: 16,
    backgroundColor: DarkTheme.cardBackgroundAlt,
    borderWidth: 1,
    borderColor: DarkTheme.borderSubtle,
    alignItems: 'center',
    marginBottom: 16,
  },
  countContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 6
  },
  count: {
    fontSize: 72,
    fontWeight: '800',
    color: '#64B5F6',
  },
  separator: {
    fontSize: 48,
    fontWeight: '300',
    color: DarkTheme.textMuted,
    marginHorizontal: 8
  },
  target: {
    fontSize: 48,
    fontWeight: '300',
    color: DarkTheme.textMuted,
  },
  percentage: {
    fontSize: 14,
    color: DarkTheme.textTertiary,
  },
  completionBanner: {
    backgroundColor: '#34C759',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    marginBottom: 16
  },
  completionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  counterButton: {
    width: '100%',
    backgroundColor: '#64B5F6',
    paddingVertical: 18,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(100, 181, 246, 0.35)',
  },
  counterButtonCompleted: {
    backgroundColor: '#34C759'
  },
  counterButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center'
  },
  counterButtonSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  resetButton: {
    paddingVertical: 10,
    paddingHorizontal: 20
  },
  resetButtonText: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: '600'
  },
  optionsRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
    gap: Spacing.md,
  },
  optionItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: DarkTheme.cardBackgroundAlt,
    borderWidth: 1,
    borderColor: DarkTheme.borderSubtle,
  },
  optionLabel: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
    fontWeight: Typography.weightMedium,
  }
});

export default DhikrCounter;
