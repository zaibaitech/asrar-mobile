/**
 * Adhkar List Component
 * 
 * Displays list of Sunnah adhkar with checkboxes
 * Phase 3: Functional UI only
 */

import { DarkTheme, Spacing, Typography } from '@/constants/DarkTheme';
import { useLanguage } from '@/contexts/LanguageContext';
import type { PrayerGuidanceRecommendation } from '@/services/PrayerGuidanceEngine';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface AdhkarListProps {
  adhkar: PrayerGuidanceRecommendation['adhkar'];
}

export function AdhkarList({ adhkar }: AdhkarListProps) {
  const [completedAdhkar, setCompletedAdhkar] = useState<Set<number>>(new Set());
  const [showTranslations, setShowTranslations] = useState(true);
  const { language, t } = useLanguage();
  
  const toggleAdhkar = (index: number) => {
    const newCompleted = new Set(completedAdhkar);
    if (newCompleted.has(index)) {
      newCompleted.delete(index);
    } else {
      newCompleted.add(index);
    }
    setCompletedAdhkar(newCompleted);
  };
  
  const completionPercentage = adhkar.length > 0
    ? (completedAdhkar.size / adhkar.length) * 100
    : 0;
  
  if (!adhkar || adhkar.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>📿 {t('prayerGuidance.ui.sunnahAdhkar')}</Text>
        <Text style={styles.emptyText}>{t('prayerGuidance.ui.noAdhkarAvailable')}</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📿 {t('prayerGuidance.ui.sunnahAdhkar')}</Text>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setShowTranslations(!showTranslations)}
        >
          <Text style={styles.toggleText}>
            {showTranslations ? t('prayerGuidance.ui.hideTranslation') : t('prayerGuidance.ui.showTranslation')}
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Progress */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[styles.progressFill, { width: `${completionPercentage}%` }]} 
          />
        </View>
        <Text style={styles.progressText}>
          {t('prayerGuidance.ui.progressCompleted', {
            completed: completedAdhkar.size,
            total: adhkar.length,
          })}
        </Text>
      </View>
      
      {/* Adhkar List */}
      <View style={styles.list}>
        {adhkar.map((dhikr, index) => {
          const isCompleted = completedAdhkar.has(index);
          
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.adhkarItem,
                isCompleted && styles.adhkarItemCompleted
              ]}
              onPress={() => toggleAdhkar(index)}
              activeOpacity={0.7}
            >
              {/* Checkbox */}
              <View style={styles.checkbox}>
                {isCompleted && <Text style={styles.checkmark}>✓</Text>}
              </View>
              
              <View style={styles.adhkarContent}>
                {/* Arabic Text */}
                <Text style={[
                  styles.arabicText,
                  isCompleted && styles.completedText
                ]}>
                  {dhikr.arabic}
                </Text>
                
                {/* Transliteration */}
                <Text style={[
                  styles.transliteration,
                  isCompleted && styles.completedText
                ]}>
                  {dhikr.transliteration}
                </Text>
                
                {/* Translation */}
                {showTranslations && (
                  <Text style={[
                    styles.translation,
                    isCompleted && styles.completedText
                  ]}>
                    {language === 'fr' ? dhikr.translation.fr : dhikr.translation.en}
                  </Text>
                )}
                
                {/* Count and Source */}
                <View style={styles.metadata}>
                  <View style={styles.countBadge}>
                    <Text style={styles.countBadgeText}>{dhikr.count}×</Text>
                  </View>
                  <Text style={styles.source}>{dhikr.source}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
      
      {/* Reset Button */}
      {completedAdhkar.size > 0 && (
        <TouchableOpacity
          style={styles.resetButton}
          onPress={() => setCompletedAdhkar(new Set())}
        >
          <Text style={styles.resetButtonText}>{t('prayerGuidance.ui.resetAll')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: DarkTheme.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: DarkTheme.borderSubtle,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  title: {
    fontSize: 18,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
  },
  toggleButton: {
    backgroundColor: DarkTheme.cardBackgroundAlt,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: DarkTheme.borderSubtle,
  },
  toggleText: {
    fontSize: 12,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textTertiary,
  },
  progressContainer: {
    marginBottom: 16
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: DarkTheme.cardBackgroundAlt,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#34C759',
    borderRadius: 3
  },
  progressText: {
    fontSize: 12,
    color: DarkTheme.textTertiary,
    textAlign: 'right'
  },
  list: {
    // No maxHeight - let parent ScrollView handle scrolling
  },
  adhkarItem: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: DarkTheme.cardBackgroundAlt,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent'
  },
  adhkarItemCompleted: {
    backgroundColor: DarkTheme.cardBackgroundLight,
    borderColor: '#34C759',
    opacity: 0.7
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: DarkTheme.borderSubtle,
    marginRight: 12,
    marginTop: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DarkTheme.cardBackground,
  },
  checkmark: {
    fontSize: 16,
    color: '#34C759',
    fontWeight: '700'
  },
  adhkarContent: {
    flex: 1
  },
  arabicText: {
    fontSize: 18,
    color: DarkTheme.textPrimary,
    textAlign: 'right',
    marginBottom: 6,
    fontFamily: 'System',
    lineHeight: 28
  },
  transliteration: {
    fontSize: 14,
    color: DarkTheme.textSecondary,
    marginBottom: 4,
    fontStyle: 'italic'
  },
  translation: {
    fontSize: 13,
    color: DarkTheme.textTertiary,
    marginBottom: 8,
    lineHeight: 18
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  countBadge: {
    backgroundColor: 'rgba(100, 181, 246, 0.18)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(100, 181, 246, 0.35)',
  },
  countBadgeText: {
    color: '#64B5F6',
    fontSize: 11,
    fontWeight: Typography.weightSemibold,
  },
  source: {
    fontSize: 11,
    color: DarkTheme.textMuted,
    fontStyle: 'italic'
  },
  emptyText: {
    fontSize: 14,
    color: DarkTheme.textMuted,
    textAlign: 'center',
    paddingVertical: 20,
    fontStyle: 'italic'
  },
  resetButton: {
    marginTop: 12,
    paddingVertical: 10,
    alignItems: 'center'
  },
  resetButtonText: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: Typography.weightSemibold,
  }
});

export default AdhkarList;
