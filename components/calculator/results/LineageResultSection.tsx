/**
 * Lineage Result Section Component
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LineageInsights } from '../../../types/calculator-enhanced';
import { useLanguage } from '../../../contexts/LanguageContext';

interface LineageResultSectionProps {
  insights: LineageInsights;
}

export const LineageResultSection: React.FC<LineageResultSectionProps> = ({ insights }) => {
  const { t } = useLanguage();
  
  const getHarmonyColor = (harmony: string) => {
    switch (harmony) {
      case 'support': return '#10b981';
      case 'tension': return '#ef4444';
      default: return '#6366f1';
    }
  };
  
  return (
    <View style={styles.container}>
      {/* Lineage Breakdown */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📊 {t('calculator.results.lineage.lineageBreakdown')}</Text>
        <View style={styles.breakdownRow}>
          <View style={styles.breakdownItem}>
            <Text style={styles.breakdownLabel}>{t('calculator.results.lineage.labels.yourName')}</Text>
            <Text style={styles.breakdownValue}>{insights.yourNameValue}</Text>
          </View>
          <Text style={styles.plusSign}>{t('calculator.results.lineage.labels.plusSign')}</Text>
          <View style={styles.breakdownItem}>
            <Text style={styles.breakdownLabel}>{t('calculator.results.lineage.labels.motherName')}</Text>
            <Text style={styles.breakdownValue}>{insights.motherNameValue}</Text>
          </View>
          <Text style={styles.equalsSign}>{t('calculator.results.lineage.labels.equalsSign')}</Text>
          <View style={styles.breakdownItem}>
            <Text style={styles.breakdownLabel}>{t('calculator.results.lineage.labels.combined')}</Text>
            <Text style={[styles.breakdownValue, styles.combinedValue]}>{insights.combinedTotal}</Text>
          </View>
        </View>
      </View>
      
      {/* Family Pattern */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🌳 {t('calculator.results.lineage.familyPattern')}</Text>
        <View style={[styles.harmonyBadge, { backgroundColor: getHarmonyColor(insights.familyPattern.harmony) }]}>
          <Text style={styles.harmonyText}>
            {t(`calculator.results.lineage.pattern.${insights.familyPattern.harmony}.badge`)}
          </Text>
        </View>
        <Text style={styles.cardText}>{t(insights.familyPattern.elementInteractionKey)}</Text>
      </View>
      
      {/* Key Takeaways */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>💡 {t('calculator.results.lineage.keyTakeaways')}</Text>
        {insights.keyTakeawaysKeys.map((takeawayKey, idx) => {
          // Prepare variables for interpolation
          let variables = {};
          if (takeawayKey.includes('lineageNumber')) {
            variables = { 
              kabir: insights.combinedTotal.toString(), 
              element: t(`calculator.results.elements.${insights.combinedElement}`) 
            };
          } else if (takeawayKey.includes('elementalRelationship')) {
            variables = { 
              interaction: t(insights.familyPattern.elementInteractionKey) 
            };
          } else if (takeawayKey.includes('spiritualRoot')) {
            variables = { 
              saghir: insights.combinedSaghir.toString() 
            };
          }
          
          return (
            <View key={idx} style={styles.takeawayRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.takeawayText}>{t(takeawayKey, variables)}</Text>
            </View>
          );
        })}
      </View>
      
      {/* Practice Plan */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🎯 {t('calculator.results.lineage.practicePlan')}</Text>
        
        <View style={styles.practiceSection}>
          <Text style={styles.practiceSubtitle}>✅ {t('calculator.results.lineage.practice.doTitle')}</Text>
          {insights.practicePlan.doList.map((itemKey, idx) => {
            // Prepare variables for interpolation
            let variables = {};
            if (itemKey.includes('dhikr')) {
              variables = { saghir: insights.combinedSaghir.toString() };
            } else if (itemKey.includes('reflection')) {
              variables = { bestTime: t(insights.practicePlan.bestTimeKey) };
            }
            
            return (
              <Text key={idx} style={styles.practiceItem}>• {t(itemKey, variables)}</Text>
            );
          })}
        </View>
        
        <View style={styles.practiceSection}>
          <Text style={styles.practiceSubtitle}>❌ {t('calculator.results.lineage.practice.avoidTitle')}</Text>
          {insights.practicePlan.avoidList.map((itemKey, idx) => (
            <Text key={idx} style={styles.practiceItem}>• {t(itemKey)}</Text>
          ))}
        </View>
        
        <View style={styles.practiceSection}>
          <Text style={styles.practiceSubtitle}>⏰ {t('calculator.results.lineage.practice.bestTimeTitle')}</Text>
          <Text style={styles.practiceItem}>{t(insights.practicePlan.bestTimeKey)}</Text>
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
  cardText: { fontSize: 14, color: '#cbd5e1', lineHeight: 22 },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  breakdownItem: { alignItems: 'center', gap: 4 },
  breakdownLabel: { fontSize: 12, color: '#94a3b8', fontWeight: '600' },
  breakdownValue: { fontSize: 24, fontWeight: '800', color: '#f1f5f9' },
  combinedValue: { color: '#6366f1' },
  plusSign: { fontSize: 20, color: '#64748b', fontWeight: '700' },
  equalsSign: { fontSize: 20, color: '#64748b', fontWeight: '700' },
  harmonyBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  harmonyText: { fontSize: 13, fontWeight: '800', color: '#fff' },
  takeawayRow: { flexDirection: 'row', gap: 8 },
  bullet: { fontSize: 16, color: '#6366f1', fontWeight: '700' },
  takeawayText: { flex: 1, fontSize: 14, color: '#cbd5e1', lineHeight: 22 },
  practiceSection: { gap: 6 },
  practiceSubtitle: { fontSize: 14, fontWeight: '700', color: '#f1f5f9' },
  practiceItem: { fontSize: 13, color: '#cbd5e1', lineHeight: 20, marginLeft: 8 },
});
