/**
 * Phrase Result Section Component
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PhraseInsights } from '../../../types/calculator-enhanced';

interface PhraseResultSectionProps {
  insights: PhraseInsights;
}

export const PhraseResultSection: React.FC<PhraseResultSectionProps> = ({ insights }) => {
  return (
    <View style={styles.container}>
      {/* Theme Detection */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🎭 Theme Detection</Text>
        <View style={styles.themeRow}>
          <Text style={styles.themeLabel}>Dominant Element:</Text>
          <View style={styles.elementBadge}>
            <Text style={styles.elementText}>{insights.themeDetection.dominantElement}</Text>
          </View>
        </View>
        
        {insights.themeDetection.sacredNumberNear && (
          <View style={styles.themeRow}>
            <Text style={styles.themeLabel}>Near Sacred Number:</Text>
            <Text style={styles.themeValue}>{insights.themeDetection.sacredNumberNear}</Text>
          </View>
        )}
      </View>
      
      {/* Repeated Letters */}
      {insights.themeDetection.repeatedLetters.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🔄 Repeated Letters</Text>
          <View style={styles.lettersGrid}>
            {insights.themeDetection.repeatedLetters.map((letter, idx) => (
              <View key={idx} style={styles.letterChip}>
                <Text style={styles.letterArabic}>{letter.letter}</Text>
                <Text style={styles.letterCount}>{letter.count}×</Text>
              </View>
            ))}
          </View>
        </View>
      )}
      
      {/* Structure Insights */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🏗️ Structure Insights</Text>
        {insights.structureInsights.topRepeatedLetters.length > 0 && (
          <View style={styles.structureSection}>
            <Text style={styles.structureLabel}>Top Repeated:</Text>
            {insights.structureInsights.topRepeatedLetters.map((letter, idx) => (
              <View key={idx} style={styles.structureRow}>
                <Text style={styles.structureArabic}>{letter.letter}</Text>
                <Text style={styles.structureText}>
                  {letter.count}× ({letter.element} element)
                </Text>
              </View>
            ))}
          </View>
        )}
        <Text style={styles.structureNote}>{insights.structureInsights.centerSignificance}</Text>
      </View>
      
      {/* Reflection Prompts */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🤔 Reflection Prompts</Text>
        {insights.reflectionPrompts.map((prompt, idx) => (
          <View key={idx} style={styles.promptRow}>
            <Text style={styles.promptNumber}>{idx + 1}.</Text>
            <Text style={styles.promptText}>{prompt}</Text>
          </View>
        ))}
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
  themeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  themeLabel: { fontSize: 14, color: '#94a3b8', fontWeight: '600' },
  themeValue: { fontSize: 14, color: '#f1f5f9', fontWeight: '700' },
  elementBadge: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  elementText: { fontSize: 13, fontWeight: '700', color: '#fff' },
  lettersGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  letterChip: {
    backgroundColor: '#334155',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
    gap: 2,
  },
  letterArabic: { fontSize: 20, color: '#f1f5f9', fontWeight: '700' },
  letterCount: { fontSize: 11, color: '#94a3b8', fontWeight: '600' },
  structureSection: { gap: 6 },
  structureLabel: { fontSize: 13, fontWeight: '600', color: '#94a3b8' },
  structureRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  structureArabic: { fontSize: 18, color: '#a5b4fc', fontWeight: '700' },
  structureText: { fontSize: 13, color: '#cbd5e1' },
  structureNote: { fontSize: 12, color: '#64748b', fontStyle: 'italic', marginTop: 4 },
  promptRow: { flexDirection: 'row', gap: 8 },
  promptNumber: { fontSize: 15, color: '#6366f1', fontWeight: '700' },
  promptText: { flex: 1, fontSize: 14, color: '#cbd5e1', lineHeight: 22 },
});
