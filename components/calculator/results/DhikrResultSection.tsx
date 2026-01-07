/**
 * Dhikr Result Section Component
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLanguage } from '../../../contexts/LanguageContext';
import { DhikrInsights } from '../../../types/calculator-enhanced';

interface DhikrResultSectionProps {
  insights: DhikrInsights;
}

export const DhikrResultSection: React.FC<DhikrResultSectionProps> = ({ insights }) => {
  const { t } = useLanguage();
  
  return (
    <View style={styles.container}>
      {/* Selected Divine Name */}
      {insights.selectedDivineName && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🕋 {t('calculator.results.dhikr.divineName')}</Text>
          <Text style={styles.divineNameArabic}>{insights.selectedDivineName.arabic}</Text>
          <Text style={styles.divineNameTranslit}>{insights.selectedDivineName.transliteration}</Text>
          <View style={styles.matchBadge}>
            <Text style={styles.matchText}>
              {t(`calculator.results.dhikr.match.${insights.selectedDivineName.matchStrength}`, {
                value: insights.selectedDivineName.abjadValue.toString()
              })}
            </Text>
          </View>
        </View>
      )}
      
      {/* Suggested Counts */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🔢 {t('calculator.results.dhikr.suggestedCounts')}</Text>
        
        {insights.suggestedCounts.valueBased && (
          <View style={styles.countSection}>
            <Text style={styles.countLabel}>{t('calculator.results.dhikr.counts.valueBased')}</Text>
            <View style={styles.countChip}>
              <Text style={styles.countText}>{insights.suggestedCounts.valueBased}×</Text>
            </View>
          </View>
        )}
        
        <View style={styles.countSection}>
          <Text style={styles.countLabel}>{t('calculator.results.dhikr.counts.traditionalCounts')}</Text>
          <View style={styles.countsRow}>
            {insights.suggestedCounts.traditional.map((count, idx) => (
              <View key={idx} style={styles.countChip}>
                <Text style={styles.countText}>{count}×</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
      
      {/* Timing */}
      {insights.timing && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>⏰ {t('calculator.results.dhikr.bestTimes')}</Text>
          
          {insights.timing.planetDay && (
            <View style={styles.timingSection}>
              <Text style={styles.timingLabel}>🪐 {t('calculator.results.dhikr.timing.planetaryDay')}</Text>
              <Text style={styles.timingValue}>{insights.timing.planetDay}</Text>
            </View>
          )}
          
          {insights.timing.afterSalahKeys && insights.timing.afterSalahKeys.length > 0 && (
            <View style={styles.timingSection}>
              <Text style={styles.timingLabel}>🕌 {t('calculator.results.dhikr.timing.afterSalah')}</Text>
              {insights.timing.afterSalahKeys.map((timeKey, idx) => (
                <Text key={idx} style={styles.timingItem}>• {t(timeKey)}</Text>
              ))}
            </View>
          )}
        </View>
      )}
      
      {/* Practice Guidance */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📿 {t('calculator.results.dhikr.practiceGuidance')}</Text>
        
        <View style={styles.guidanceSection}>
          <Text style={styles.guidanceSubtitle}>{t('calculator.results.dhikr.guidance.preparation')}</Text>
          {insights.practiceGuidance.preparationKeys.map((stepKey, idx) => (
            <Text key={idx} style={styles.guidanceItem}>✓ {t(stepKey)}</Text>
          ))}
        </View>
        
        <View style={styles.guidanceSection}>
          <Text style={styles.guidanceSubtitle}>{t('calculator.results.dhikr.guidance.adab')}</Text>
          {insights.practiceGuidance.adabKeys.map((ruleKey, idx) => (
            <Text key={idx} style={styles.guidanceItem}>• {t(ruleKey)}</Text>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { gap: 16 },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 12,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#f1f5f9' },
  divineNameArabic: {
    fontSize: 32,
    fontWeight: '700',
    color: '#f59e0b',
    textAlign: 'center',
  },
  divineNameTranslit: {
    fontSize: 18,
    fontWeight: '600',
    color: '#cbd5e1',
    textAlign: 'center',
  },
  matchBadge: {
    alignSelf: 'center',
    backgroundColor: '#334155',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  matchText: { fontSize: 12, fontWeight: '600', color: '#94a3b8' },
  countSection: { gap: 8 },
  countLabel: { fontSize: 14, fontWeight: '600', color: '#94a3b8' },
  countsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  countChip: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  countText: { fontSize: 16, fontWeight: '800', color: '#fff' },
  timingSection: { gap: 6 },
  timingLabel: { fontSize: 14, fontWeight: '600', color: '#f1f5f9' },
  timingValue: { fontSize: 14, color: '#cbd5e1', marginLeft: 8 },
  timingItem: { fontSize: 13, color: '#cbd5e1', marginLeft: 8 },
  guidanceSection: { gap: 6 },
  guidanceSubtitle: { fontSize: 14, fontWeight: '700', color: '#f1f5f9' },
  guidanceItem: { fontSize: 13, color: '#cbd5e1', marginLeft: 8, lineHeight: 20 },
});
