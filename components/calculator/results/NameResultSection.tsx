/**
 * Name Result Section Component
 * Displays name-specific insights
 */

import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NameInsights } from '../../../types/calculator-enhanced';

interface NameResultSectionProps {
  insights: NameInsights;
}

export const NameResultSection: React.FC<NameResultSectionProps> = ({ insights }) => {
  return (
    <View style={styles.container}>
      {/* Archetype Card */}
      <LinearGradient colors={['#6366f1', '#8b5cf6']} style={styles.archetypeCard}>
        <Text style={styles.archetypeTitle}>{insights.archetypeTitle}</Text>
        <Text style={styles.archetypeSubtitle}>Your Spiritual Archetype</Text>
      </LinearGradient>
      
      {/* Spiritual Guidance */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🌟 Spiritual Guidance</Text>
        <Text style={styles.cardText}>{insights.spiritualGuidance}</Text>
      </View>
      
      {/* Divine Name Connections */}
      {insights.divineNameConnection.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🕋 Divine Name Resonance</Text>
          {insights.divineNameConnection.map((name, idx) => (
            <View key={idx} style={styles.divineNameRow}>
              <Text style={styles.divineNameArabic}>{name.arabic}</Text>
              <View style={styles.divineNameInfo}>
                <Text style={styles.divineNameText}>{name.name}</Text>
                <Text style={styles.divineNameMeta}>
                  Value: {name.value} (Distance: {name.distance})
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
      
      {/* Recommended Dhikr Counts */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🤲 Recommended Dhikr Counts</Text>
        <View style={styles.countsRow}>
          {insights.recommendedDhikrCount.map((count, idx) => (
            <View key={idx} style={styles.countChip}>
              <Text style={styles.countText}>{count}×</Text>
            </View>
          ))}
        </View>
      </View>
      
      {/* Timing Recommendations */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>⏰ Best Practice Times</Text>
        <View style={styles.timingRow}>
          <View style={styles.timingItem}>
            <Text style={styles.timingLabel}>Best Time Window</Text>
            <Text style={styles.timingValue}>{insights.bestTimeWindow}</Text>
          </View>
          <View style={styles.timingItem}>
            <Text style={styles.timingLabel}>Power Days</Text>
            <Text style={styles.timingValue}>{insights.powerDay}</Text>
          </View>
        </View>
        <Text style={styles.timingNote}>
          💡 Power Day = Burj planetary ruler. Best Time Window = Elemental resonance peak.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  
  archetypeCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    gap: 4,
  },
  
  archetypeTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
  },
  
  archetypeSubtitle: {
    fontSize: 14,
    color: '#e0e7ff',
    fontWeight: '600',
  },
  
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 12,
  },
  
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f1f5f9',
  },
  
  cardText: {
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 22,
  },
  
  divineNameRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  
  divineNameArabic: {
    fontSize: 24,
    fontWeight: '700',
    color: '#a5b4fc',
  },
  
  divineNameInfo: {
    flex: 1,
    gap: 2,
  },
  
  divineNameText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#f1f5f9',
  },
  
  divineNameMeta: {
    fontSize: 12,
    color: '#94a3b8',
  },
  
  countsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  
  countChip: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  
  countText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
  },
  
  timingRow: {
    gap: 12,
  },
  
  timingItem: {
    gap: 4,
  },
  
  timingLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94a3b8',
  },
  
  timingValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#f1f5f9',
  },
  
  timingNote: {
    fontSize: 12,
    color: '#64748b',
    fontStyle: 'italic',
    marginTop: 4,
  },
});
