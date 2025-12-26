/**
 * Lineage Result Section Component
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LineageInsights } from '../../../types/calculator-enhanced';

interface LineageResultSectionProps {
  insights: LineageInsights;
}

export const LineageResultSection: React.FC<LineageResultSectionProps> = ({ insights }) => {
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
        <Text style={styles.cardTitle}>📊 Lineage Breakdown</Text>
        <View style={styles.breakdownRow}>
          <View style={styles.breakdownItem}>
            <Text style={styles.breakdownLabel}>Your Name</Text>
            <Text style={styles.breakdownValue}>{insights.yourNameValue}</Text>
          </View>
          <Text style={styles.plusSign}>+</Text>
          <View style={styles.breakdownItem}>
            <Text style={styles.breakdownLabel}>Mother's Name</Text>
            <Text style={styles.breakdownValue}>{insights.motherNameValue}</Text>
          </View>
          <Text style={styles.equalsSign}>=</Text>
          <View style={styles.breakdownItem}>
            <Text style={styles.breakdownLabel}>Combined</Text>
            <Text style={[styles.breakdownValue, styles.combinedValue]}>{insights.combinedTotal}</Text>
          </View>
        </View>
      </View>
      
      {/* Family Pattern */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🌳 Family Pattern</Text>
        <View style={[styles.harmonyBadge, { backgroundColor: getHarmonyColor(insights.familyPattern.harmony) }]}>
          <Text style={styles.harmonyText}>{insights.familyPattern.harmony.toUpperCase()}</Text>
        </View>
        <Text style={styles.cardText}>{insights.familyPattern.elementInteraction}</Text>
      </View>
      
      {/* Key Takeaways */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>💡 Key Takeaways</Text>
        {insights.keyTakeaways.map((takeaway, idx) => (
          <View key={idx} style={styles.takeawayRow}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.takeawayText}>{takeaway}</Text>
          </View>
        ))}
      </View>
      
      {/* Practice Plan */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🎯 Practice Plan</Text>
        
        <View style={styles.practiceSection}>
          <Text style={styles.practiceSubtitle}>✅ Do</Text>
          {insights.practicePlan.doList.map((item, idx) => (
            <Text key={idx} style={styles.practiceItem}>• {item}</Text>
          ))}
        </View>
        
        <View style={styles.practiceSection}>
          <Text style={styles.practiceSubtitle}>❌ Avoid</Text>
          {insights.practicePlan.avoidList.map((item, idx) => (
            <Text key={idx} style={styles.practiceItem}>• {item}</Text>
          ))}
        </View>
        
        <View style={styles.practiceSection}>
          <Text style={styles.practiceSubtitle}>⏰ Best Time</Text>
          <Text style={styles.practiceItem}>{insights.practicePlan.bestTime}</Text>
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
