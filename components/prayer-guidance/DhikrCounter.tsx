/**
 * Dhikr Counter Component
 * 
 * Interactive counter for tracking Divine Name recitations
 * Phase 3: Functional UI only
 */

import { DarkTheme, Spacing, Typography } from '@/constants/DarkTheme';
import { useLanguage } from '@/contexts/LanguageContext';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, Vibration, View } from 'react-native';

interface DhikrCounterProps {
  targetCount: number;
  onComplete?: () => void;
  onCountChange?: (count: number) => void;
}

export function DhikrCounter({ targetCount, onComplete, onCountChange }: DhikrCounterProps) {
  const { t } = useLanguage();
  const [count, setCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const progress = (count / targetCount) * 100;
  
  useEffect(() => {
    if (count === targetCount && !isCompleted) {
      setIsCompleted(true);
      Vibration.vibrate([0, 100, 50, 100]); // Completion vibration pattern
      onComplete?.();
    }
  }, [count, targetCount, isCompleted, onComplete]);
  
  useEffect(() => {
    onCountChange?.(count);
  }, [count, onCountChange]);
  
  const handleIncrement = () => {
    if (count < targetCount) {
      setCount(prev => prev + 1);
      Vibration.vibrate(10); // Light haptic feedback
    }
  };
  
  const handleReset = () => {
    setCount(0);
    setIsCompleted(false);
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('prayerGuidance.ui.dhikrCounter')}</Text>
      
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
      <View style={styles.countContainer}>
        <Text style={styles.count}>{count}</Text>
        <Text style={styles.separator}>/</Text>
        <Text style={styles.target}>{targetCount}</Text>
      </View>
      
      {/* Progress Percentage */}
      <Text style={styles.percentage}>
        {t('prayerGuidance.ui.percentComplete', { percent: Math.round(progress) })}
      </Text>
      
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
      
      {/* Helper Text */}
      <Text style={styles.helperText}>
        {t('prayerGuidance.ui.dhikrHelper')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.xl,
    backgroundColor: DarkTheme.cardBackground,
    borderRadius: 12,
    marginBottom: Spacing.lg,
    alignItems: 'center'
  },
  title: {
    fontSize: 18,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
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
  countContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8
  },
  count: {
    fontSize: 64,
    fontWeight: '700',
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
    fontSize: 16,
    color: DarkTheme.textTertiary,
    marginBottom: 20
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
    paddingVertical: 20,
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
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center'
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
  helperText: {
    fontSize: 12,
    color: DarkTheme.textMuted,
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic'
  }
});

export default DhikrCounter;
