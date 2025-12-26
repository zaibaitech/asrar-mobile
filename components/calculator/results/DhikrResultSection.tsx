/**
 * Dhikr Result Section Component
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DhikrInsights } from '../../../types/calculator-enhanced';

interface DhikrResultSectionProps {
  insights: DhikrInsights;
}

export const DhikrResultSection: React.FC<DhikrResultSectionProps> = ({ insights }) => {
  return (
    <View style={styles.container}>
      {/* Selected Divine Name */}
      {insights.selectedDivineName && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🕋 Divine Name</Text>
          <Text style={styles.divineNameArabic}>{insights.selectedDivineName.arabic}</Text>
          <Text style={styles.divineNameTranslit}>{insights.selectedDivineName.transliteration}</Text>
          <View style={styles.matchBadge}>
            <Text style={styles.matchText}>
              Match: {insights.selectedDivineName.matchStrength} (Value: {insights.selectedDivineName.abjadValue})
            </Text>
          </View>
        </View>
      )}
      
      {/* Suggested Counts */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🔢 Suggested Dhikr Counts</Text>
        
        {insights.suggestedCounts.valueBased && (
          <View style={styles.countSection}>
            <Text style={styles.countLabel}>Value-Based:</Text>
            <View style={styles.countChip}>
              <Text style={styles.countText}>{insights.suggestedCounts.valueBased}×</Text>
            </View>
          </View>
        )}
        
        <View style={styles.countSection}>
          <Text style={styles.countLabel}>Traditional Counts:</Text>
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
          <Text style={styles.cardTitle}>⏰ Best Times to Practice</Text>
          
          {insights.timing.planetDay && (
            <View style={styles.timingSection}>
              <Text style={styles.timingLabel}>🪐 Planetary Day:</Text>
              <Text style={styles.timingValue}>{insights.timing.planetDay}</Text>
            </View>
          )}
          
          {insights.timing.afterSalah && insights.timing.afterSalah.length > 0 && (
            <View style={styles.timingSection}>
              <Text style={styles.timingLabel}>🕌 After Salah:</Text>
              {insights.timing.afterSalah.map((time, idx) => (
                <Text key={idx} style={styles.timingItem}>• {time}</Text>
              ))}
            </View>
          )}
        </View>
      )}
      
      {/* Practice Guidance */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📿 Practice Guidance</Text>
        
        <View style={styles.guidanceSection}>
          <Text style={styles.guidanceSubtitle}>Preparation:</Text>
          {insights.practiceGuidance.preparation.map((step, idx) => (
            <Text key={idx} style={styles.guidanceItem}>✓ {step}</Text>
          ))}
        </View>
        
        <View style={styles.guidanceSection}>
          <Text style={styles.guidanceSubtitle}>Adab (Etiquette):</Text>
          {insights.practiceGuidance.adab.map((rule, idx) => (
            <Text key={idx} style={styles.guidanceItem}>• {rule}</Text>
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
