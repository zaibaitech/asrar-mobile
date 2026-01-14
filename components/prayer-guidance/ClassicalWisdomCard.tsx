/**
 * Classical Wisdom Card Component
 * 
 * Displays classical hour practices from manuscript sources
 * Phase 3: Functional UI only
 */

import { DarkTheme, Spacing, Typography } from '@/constants/DarkTheme';
import { useLanguage } from '@/contexts/LanguageContext';
import type { PrayerGuidanceRecommendation } from '@/services/PrayerGuidanceEngine';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ClassicalWisdomCardProps {
  wisdom: PrayerGuidanceRecommendation['classicalWisdom'];
}

function fallbackFromKey(key: string): string {
  const lastSegment = key.split('.').pop() || key;
  return lastSegment
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

export function ClassicalWisdomCard({ wisdom }: ClassicalWisdomCardProps) {
  const [showArabic, setShowArabic] = useState(false);
  const { t, tSafe } = useLanguage();

  const getWorkName = (workKey: string) => {
    const direct = tSafe(workKey, '');
    if (direct) return direct;
    return tSafe(`${workKey}.name`, fallbackFromKey(workKey));
  };

  const getWorkDescription = (workKey: string) => {
    return tSafe(`${workKey}.description`, '');
  };
  
  const hasRecommended = wisdom.recommendedWorks.length > 0;
  const hasAvoid = wisdom.worksToAvoid.length > 0;
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📜 {t('prayerGuidance.ui.classicalWisdom')}</Text>
        <TouchableOpacity 
          style={styles.toggleButton}
          onPress={() => setShowArabic(!showArabic)}
        >
          <Text style={styles.toggleText}>
            {showArabic ? 'EN' : 'ع'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.source}>{wisdom.source}</Text>
      
      {/* Original Arabic Text */}
      {showArabic && wisdom.originalText && (
        <View style={styles.arabicContainer}>
          <Text style={styles.arabicText}>{wisdom.originalText}</Text>
        </View>
      )}
      
      {/* Recommended Works */}
      {hasRecommended && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✅ {t('prayerGuidance.hours.recommendedWorks')}</Text>
          {wisdom.recommendedWorks.map((work, index) => (
            <View key={index} style={styles.workItem}>
              <Text style={styles.bullet}>•</Text>
              <View style={styles.workTextContainer}>
                <Text style={styles.workText}>{getWorkName(work)}</Text>
                {!!getWorkDescription(work) && (
                  <Text style={styles.workDescription}>{getWorkDescription(work)}</Text>
                )}
              </View>
            </View>
          ))}
        </View>
      )}
      
      {/* Works to Avoid */}
      {hasAvoid && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, styles.avoidTitle]}>
            ⚠️ {t('prayerGuidance.hours.avoidWorks')}
          </Text>
          {wisdom.worksToAvoid.map((work, index) => (
            <View key={index} style={styles.workItem}>
              <Text style={styles.bullet}>•</Text>
              <View style={styles.workTextContainer}>
                <Text style={styles.workText}>{getWorkName(work)}</Text>
                {!!getWorkDescription(work) && (
                  <Text style={styles.workDescription}>{getWorkDescription(work)}</Text>
                )}
              </View>
            </View>
          ))}
        </View>
      )}
      
      {!hasRecommended && !hasAvoid && (
        <Text style={styles.emptyText}>
          {t('prayerGuidance.ui.noClassicalGuidance')}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    backgroundColor: DarkTheme.cardBackground,
    borderRadius: 16,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: DarkTheme.borderSubtle,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: Typography.h3,
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
    fontSize: 14,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textTertiary,
  },
  source: {
    fontSize: 12,
    color: DarkTheme.textMuted,
    fontStyle: 'italic',
    marginBottom: Spacing.md,
  },
  arabicContainer: {
    backgroundColor: DarkTheme.cardBackgroundAlt,
    padding: Spacing.md,
    borderRadius: 12,
    marginBottom: Spacing.md,
    borderRightWidth: 3,
    borderRightColor: DarkTheme.textMuted,
  },
  arabicText: {
    fontSize: 16,
    color: DarkTheme.textPrimary,
    textAlign: 'right',
    lineHeight: 24,
    fontFamily: 'System'
  },
  section: {
    marginTop: Spacing.md,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: Typography.weightSemibold,
    color: '#34C759',
    marginBottom: Spacing.sm,
  },
  avoidTitle: {
    color: '#FF3B30'
  },
  workItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
    paddingLeft: 8
  },
  bullet: {
    fontSize: 14,
    color: DarkTheme.textTertiary,
    marginRight: 8,
    marginTop: 2
  },
  workText: {
    fontSize: 14,
    color: DarkTheme.textSecondary,
    lineHeight: 20
  },
  workTextContainer: {
    flex: 1,
  },
  workDescription: {
    marginTop: 2,
    fontSize: 12,
    color: DarkTheme.textMuted,
    lineHeight: 16,
  },
  emptyText: {
    fontSize: 14,
    color: DarkTheme.textMuted,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 12
  }
});

export default ClassicalWisdomCard;
