/**
 * Divine Name Card Component
 * 
 * Displays recommended Divine Name with reasoning
 * Phase 3: Functional UI only
 */

import { DarkTheme, Spacing, Typography } from '@/constants/DarkTheme';
import { useLanguage } from '@/contexts/LanguageContext';
import type { PrayerGuidanceRecommendation } from '@/services/PrayerGuidanceEngine';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface DivineNameCardProps {
  divineName: PrayerGuidanceRecommendation['divineName'];
}

export function DivineNameCard({ divineName }: DivineNameCardProps) {
  const [showReasoning, setShowReasoning] = useState(false);
  const { t, tSafe } = useLanguage();
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌟 {t('prayerGuidance.ui.recommendedDivineName')}</Text>
      
      {/* Arabic Name - Large Display */}
      <View style={styles.nameContainer}>
        <Text style={styles.arabicName}>{divineName.arabic}</Text>
      </View>
      
      {/* Transliteration */}
      <Text style={styles.transliteration}>{divineName.transliteration}</Text>

      {!!divineName.translationKey && (
        <Text style={styles.translation}>
          {tSafe(divineName.translationKey, divineName.transliteration)}
        </Text>
      )}
      
      {/* Count */}
      <View style={styles.countBadge}>
        <Text style={styles.countText}>
          {t('prayerGuidance.ui.reciteCount', { count: divineName.count })}
        </Text>
      </View>
      
      {/* Abjad Value */}
      <Text style={styles.abjadValue}>
        {t('prayerGuidance.ui.abjadValueLabel', { value: divineName.abjadValue })}
      </Text>
      
      {/* Reasoning Toggle */}
      <TouchableOpacity
        style={styles.reasoningButton}
        onPress={() => setShowReasoning(!showReasoning)}
      >
        <Text style={styles.reasoningButtonText}>
          {showReasoning ? t('prayerGuidance.ui.hideReasoning') : t('prayerGuidance.ui.showReasoning')}
        </Text>
      </TouchableOpacity>
      
      {/* Reasoning Details */}
      {showReasoning && (
        <View style={styles.reasoningContainer}>
          <View style={styles.reasoningItem}>
            <Text style={styles.reasoningLabel}>{t('prayerGuidance.ui.planetaryAlignment')}</Text>
            <Text style={styles.reasoningText}>
              {divineName.reasoning.planetaryAlignment}
            </Text>
          </View>
          
          <View style={styles.reasoningItem}>
            <Text style={styles.reasoningLabel}>{t('prayerGuidance.ui.elementalResonance')}</Text>
            <Text style={styles.reasoningText}>
              {divineName.reasoning.elementalResonance}
            </Text>
          </View>
          
          <View style={styles.reasoningItem}>
            <Text style={styles.reasoningLabel}>{t('prayerGuidance.ui.numerologicalSignificance')}</Text>
            <Text style={styles.reasoningText}>
              {divineName.reasoning.numerologicalSignificance}
            </Text>
          </View>
          
          <View style={styles.reasoningItem}>
            <Text style={styles.reasoningLabel}>{t('prayerGuidance.ui.classicalSource')}</Text>
            <Text style={styles.reasoningText}>
              {divineName.reasoning.classicalSource}
            </Text>
          </View>
        </View>
      )}
      
      {/* Benefits */}
      {divineName.benefitKeys && divineName.benefitKeys.length > 0 && (
        <View style={styles.benefitsSection}>
          <Text style={styles.benefitsTitle}>{t('prayerGuidance.ui.spiritualBenefits')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.benefitsList}>
              {divineName.benefitKeys.map((key, index) => (
                <View key={index} style={styles.benefitBadge}>
                  <Text style={styles.benefitText}>
                    {tSafe(key, formatBenefitKey(key))}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
}

function formatBenefitKey(key: string): string {
  // Extract last part of translation key (e.g., "divineNamesPlanetary.benefits.enlightenment" -> "Enlightenment")
  const parts = key.split('.');
  const lastPart = parts[parts.length - 1];
  return lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.xl,
    backgroundColor: DarkTheme.cardBackground,
    borderRadius: 12,
    marginBottom: Spacing.lg,
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.55)',
  },
  title: {
    fontSize: 16,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
    marginBottom: Spacing.lg,
    textAlign: 'center'
  },
  nameContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: DarkTheme.cardBackgroundAlt,
    borderRadius: 8,
    marginBottom: Spacing.md,
    alignItems: 'center'
  },
  arabicName: {
    fontSize: 48,
    fontWeight: '700',
    color: DarkTheme.textPrimary,
    textAlign: 'center',
    fontFamily: 'System'
  },
  transliteration: {
    fontSize: 20,
    fontWeight: '600',
    color: DarkTheme.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  translation: {
    fontSize: 14,
    color: DarkTheme.textTertiary,
    textAlign: 'center',
    marginBottom: Spacing.md,
    lineHeight: 18,
  },
  countBadge: {
    backgroundColor: 'rgba(100, 181, 246, 0.18)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    alignSelf: 'center',
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(100, 181, 246, 0.35)',
  },
  countText: {
    color: '#64B5F6',
    fontSize: 18,
    fontWeight: '700'
  },
  abjadValue: {
    fontSize: 14,
    color: DarkTheme.textMuted,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  reasoningButton: {
    backgroundColor: DarkTheme.cardBackgroundAlt,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: DarkTheme.borderSubtle,
  },
  reasoningButtonText: {
    fontSize: 14,
    fontWeight: Typography.weightSemibold,
    color: '#64B5F6',
    textAlign: 'center'
  },
  reasoningContainer: {
    backgroundColor: DarkTheme.cardBackgroundAlt,
    padding: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.md,
  },
  reasoningItem: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: DarkTheme.borderSubtle,
  },
  reasoningLabel: {
    fontSize: 13,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textTertiary,
    marginBottom: 4
  },
  reasoningText: {
    fontSize: 13,
    color: DarkTheme.textSecondary,
    lineHeight: 18
  },
  benefitsSection: {
    marginTop: 8
  },
  benefitsTitle: {
    fontSize: 14,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textTertiary,
    marginBottom: 8
  },
  benefitsList: {
    flexDirection: 'row',
    gap: 8
  },
  benefitBadge: {
    backgroundColor: 'rgba(100, 181, 246, 0.12)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(100, 181, 246, 0.35)',
  },
  benefitText: {
    fontSize: 12,
    color: '#64B5F6',
    fontWeight: Typography.weightMedium,
  }
});

export default DivineNameCard;
