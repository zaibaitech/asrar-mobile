import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ASMA_LIST } from '../../utils/hadad-core';

interface DivineNameConnectionProps {
  kabir: number;
}

export const DivineNameConnection: React.FC<DivineNameConnectionProps> = ({ kabir }) => {
  // Find 3 divine names with closest numerical values
  const namesWithDistance = ASMA_LIST.map(name => ({
    ...name,
    distance: Math.abs(name.abjad - kabir),
  }));
  
  // Sort by distance and take top 3
  const closestNames = namesWithDistance
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 3);

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>⭐ Divine Name Connection</Text>
      <Text style={styles.subtitle}>
        Found {closestNames.length} Divine Names (Asmā' al-Ḥusnā) with similar values
      </Text>
      
      {/* Divine Names List */}
      {closestNames.map((name, index) => (
        <View key={index} style={styles.nameCard}>
          <View style={styles.nameHeader}>
            <View style={styles.numberBadge}>
              <Text style={styles.numberText}>#{index + 1}</Text>
            </View>
            <View style={styles.nameInfo}>
              <Text style={styles.nameArabic}>{name.ar}</Text>
              <Text style={styles.nameEnglish}>{name.en}</Text>
            </View>
            <View style={styles.valueBadge}>
              <Text style={styles.valueLabel}>Value</Text>
              <Text style={styles.valueText}>{name.abjad}</Text>
            </View>
          </View>
          
          <View style={styles.nameDetails}>
            <Text style={styles.transliteration}>{name.transliteration}</Text>
            
            {name.distance === 0 ? (
              <View style={styles.exactMatch}>
                <Text style={styles.exactMatchText}>🎯 Exact Match!</Text>
              </View>
            ) : (
              <Text style={styles.distance}>
                Distance: {name.distance} {kabir > name.abjad ? 'above' : 'below'}
              </Text>
            )}
          </View>
        </View>
      ))}
      
      {/* Spiritual Note */}
      <View style={styles.noteCard}>
        <Text style={styles.noteText}>
          💫 These Divine Names share numerical harmony with your calculation. 
          Consider incorporating them in your dhikr practice for spiritual resonance.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 16,
  },
  
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f1f5f9',
  },
  subtitle: {
    fontSize: 13,
    color: '#94a3b8',
    fontStyle: 'italic',
    lineHeight: 18,
    marginTop: -8,
  },
  
  // Name Card
  nameCard: {
    backgroundColor: '#0f172a',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#6366f1',
    gap: 12,
  },
  nameHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  numberBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  nameInfo: {
    flex: 1,
    gap: 4,
  },
  nameArabic: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f1f5f9',
    textAlign: 'right',
  },
  nameEnglish: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94a3b8',
  },
  valueBadge: {
    backgroundColor: '#312e81',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  valueLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#a5b4fc',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  valueText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#c7d2fe',
    marginTop: 2,
  },
  
  // Name Details
  nameDetails: {
    gap: 6,
  },
  transliteration: {
    fontSize: 13,
    color: '#c7d2fe',
    fontStyle: 'italic',
  },
  distance: {
    fontSize: 12,
    color: '#64748b',
  },
  exactMatch: {
    backgroundColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  exactMatchText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  
  // Note Card
  noteCard: {
    backgroundColor: '#312e81',
    padding: 14,
    borderRadius: 10,
  },
  noteText: {
    fontSize: 12,
    color: '#c7d2fe',
    lineHeight: 17,
    fontStyle: 'italic',
  },
});
