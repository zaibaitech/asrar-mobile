/**
 * General Result Section Component
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GeneralInsights } from '../../../types/calculator-enhanced';

interface GeneralResultSectionProps {
  insights: GeneralInsights;
}

export const GeneralResultSection: React.FC<GeneralResultSectionProps> = ({ insights }) => {
  return (
    <View style={styles.container}>
      {/* Letter Frequency Chart */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📊 Letter Frequency</Text>
        <View style={styles.frequencyList}>
          {insights.letterFrequencyChart.slice(0, 10).map((letter, idx) => (
            <View key={idx} style={styles.frequencyRow}>
              <Text style={styles.frequencyRank}>{idx + 1}</Text>
              <Text style={styles.frequencyLetter}>{letter.letter}</Text>
              <View style={styles.frequencyBar}>
                <View 
                  style={[
                    styles.frequencyBarFill, 
                    { width: `${(letter.count / insights.letterFrequencyChart[0].count) * 100}%` }
                  ]} 
                />
                <Text style={styles.frequencyCount}>{letter.count}× (value: {letter.value})</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
      
      {/* Elemental Balance */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🔮 Elemental Balance</Text>
        <View style={styles.compositionGrid}>
          {Object.entries(insights.elementalBalance.composition).map(([element, percent]) => (
            <View key={element} style={styles.elementCard}>
              <Text style={styles.elementName}>{element}</Text>
              <Text style={styles.elementPercent}>{percent}%</Text>
            </View>
          ))}
        </View>
        <Text style={styles.adviceText}>{insights.elementalBalance.advice}</Text>
      </View>
      
      {/* Sacred Resonance */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>✨ Sacred Resonance</Text>
        <View style={styles.resonanceRow}>
          <View style={styles.resonanceItem}>
            <Text style={styles.resonanceLabel}>Nearest Sacred</Text>
            <Text style={styles.resonanceValue}>{insights.sacredResonance.nearest}</Text>
          </View>
          <View style={styles.resonanceItem}>
            <Text style={styles.resonanceLabel}>Distance</Text>
            <Text style={styles.resonanceValue}>{insights.sacredResonance.distance}</Text>
          </View>
        </View>
        <Text style={styles.resonanceMeaning}>{insights.sacredResonance.meaning}</Text>
      </View>
      
      {/* Advanced Methods */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🔬 Advanced Methods</Text>
        
        <View style={styles.methodRow}>
          <Text style={styles.methodName}>Wusṭā (Middle):</Text>
          <Text style={styles.methodValue}>
            {insights.advancedMethods.wusta.value} ({insights.advancedMethods.wusta.element})
          </Text>
        </View>
        
        <View style={styles.methodRow}>
          <Text style={styles.methodName}>Kamāl (Perfection):</Text>
          <Text style={styles.methodValue}>
            {insights.advancedMethods.kamal.value} ({insights.advancedMethods.kamal.element})
          </Text>
        </View>
        
        <View style={styles.methodRow}>
          <Text style={styles.methodName}>Basṭ (Expansion):</Text>
          <Text style={styles.methodValue}>
            {insights.advancedMethods.bast.value} ({insights.advancedMethods.bast.element})
          </Text>
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
  frequencyList: { gap: 8 },
  frequencyRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  frequencyRank: { fontSize: 12, fontWeight: '700', color: '#6366f1', width: 20 },
  frequencyLetter: { fontSize: 18, fontWeight: '700', color: '#f1f5f9', width: 30 },
  frequencyBar: { flex: 1, position: 'relative', height: 28, backgroundColor: '#334155', borderRadius: 6, justifyContent: 'center' },
  frequencyBarFill: { position: 'absolute', height: '100%', backgroundColor: '#6366f1', borderRadius: 6 },
  frequencyCount: { fontSize: 11, fontWeight: '600', color: '#e0e7ff', marginLeft: 8, zIndex: 1 },
  compositionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  elementCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#334155',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    gap: 4,
  },
  elementName: { fontSize: 13, fontWeight: '600', color: '#94a3b8', textTransform: 'capitalize' },
  elementPercent: { fontSize: 20, fontWeight: '800', color: '#f1f5f9' },
  adviceText: { fontSize: 13, color: '#cbd5e1', lineHeight: 20, marginTop: 4 },
  resonanceRow: { flexDirection: 'row', gap: 12 },
  resonanceItem: { flex: 1, gap: 4 },
  resonanceLabel: { fontSize: 12, color: '#94a3b8', fontWeight: '600' },
  resonanceValue: { fontSize: 18, color: '#f1f5f9', fontWeight: '700' },
  resonanceMeaning: { fontSize: 13, color: '#cbd5e1', fontStyle: 'italic' },
  methodRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  methodName: { fontSize: 14, color: '#94a3b8', fontWeight: '600' },
  methodValue: { fontSize: 14, color: '#f1f5f9', fontWeight: '700' },
});
