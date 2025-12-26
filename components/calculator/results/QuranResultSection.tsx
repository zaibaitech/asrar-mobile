/**
 * Qur'an Result Section Component
 */

import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Linking, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { QuranInsights } from '../../../types/calculator-enhanced';

interface QuranResultSectionProps {
  insights: QuranInsights;
}

export const QuranResultSection: React.FC<QuranResultSectionProps> = ({ insights }) => {
  const [reflectionNotes, setReflectionNotes] = useState('');
  
  const handleOpenQuranCom = () => {
    if (insights.quranComLink) {
      Linking.openURL(insights.quranComLink);
    }
  };
  
  return (
    <View style={styles.container}>
      {/* Surah Info */}
      {insights.surahName && (
        <LinearGradient colors={['#10b981', '#059669']} style={styles.surahCard}>
          <Text style={styles.surahName}>{insights.surahName}</Text>
          {insights.ayahNumber && (
            <Text style={styles.ayahNumber}>Ayah {insights.ayahNumber}</Text>
          )}
        </LinearGradient>
      )}
      
      {/* Arabic Text */}
      {insights.arabicText && (
        <View style={styles.card}>
          <Text style={styles.arabicText}>{insights.arabicText}</Text>
        </View>
      )}
      
      {/* Resonance Link */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🌟 Resonance Link</Text>
        <Text style={styles.resonanceSubtitle}>
          {insights.resonanceLink.isCalculated 
            ? '📊 Calculated from verse Abjad value' 
            : '💭 Suggested association'}
        </Text>
        <View style={styles.resonanceRow}>
          <View style={styles.resonanceItem}>
            <Text style={styles.resonanceLabel}>Element</Text>
            <Text style={styles.resonanceValue}>{insights.resonanceLink.dominantElement}</Text>
          </View>
          <View style={styles.resonanceItem}>
            <Text style={styles.resonanceLabel}>Sacred Number</Text>
            <Text style={styles.resonanceValue}>{insights.resonanceLink.sacredNumber}</Text>
          </View>
          {insights.resonanceLink.kabir && (
            <View style={styles.resonanceItem}>
              <Text style={styles.resonanceLabel}>Verse Kabīr</Text>
              <Text style={styles.resonanceValue}>{insights.resonanceLink.kabir}</Text>
            </View>
          )}
        </View>
        <Text style={styles.resonanceMeaning}>{insights.resonanceLink.meaning}</Text>
      </View>
      
      {/* Reflection Block */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🤲 Reflection</Text>
        <Text style={styles.reflectionPrompt}>{insights.reflectionBlock.prompt}</Text>
        <TextInput
          style={styles.notesInput}
          value={reflectionNotes}
          onChangeText={setReflectionNotes}
          placeholder="Write your reflections here (saved locally)..."
          placeholderTextColor="#64748b"
          multiline
          numberOfLines={4}
        />
      </View>
      
      {/* Quran.com Link */}
      {insights.quranComLink && (
        <TouchableOpacity onPress={handleOpenQuranCom} activeOpacity={0.8}>
          <LinearGradient colors={['#6366f1', '#8b5cf6']} style={styles.linkButton}>
            <Text style={styles.linkText}>📖 Read on Quran.com</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
      
      {/* Disclaimer */}
      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>
          ⚠️ This is numerical analysis only. For tafsīr and religious rulings, consult qualified scholars.
        </Text>
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
  resonanceSubtitle: { fontSize: 12, color: '#94a3b8', fontStyle: 'italic', marginTop: -4 },
  surahCard: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    gap: 4,
  },
  surahName: { fontSize: 24, fontWeight: '900', color: '#fff' },
  ayahNumber: { fontSize: 14, color: '#d1fae5', fontWeight: '600' },
  arabicText: {
    fontSize: 22,
    color: '#f1f5f9',
    textAlign: 'right',
    lineHeight: 38,
    fontWeight: '600',
  },
  resonanceRow: { flexDirection: 'row', gap: 12 },
  resonanceItem: { flex: 1, gap: 4 },
  resonanceLabel: { fontSize: 12, color: '#94a3b8', fontWeight: '600' },
  resonanceValue: { fontSize: 16, color: '#f1f5f9', fontWeight: '700' },
  resonanceMeaning: { fontSize: 13, color: '#cbd5e1', fontStyle: 'italic' },
  reflectionPrompt: { fontSize: 14, color: '#cbd5e1', lineHeight: 22 },
  notesInput: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#334155',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  linkButton: {
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  linkText: { fontSize: 16, fontWeight: '800', color: '#fff' },
  disclaimer: {
    backgroundColor: '#431407',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ea580c',
  },
  disclaimerText: { fontSize: 12, color: '#fdba74', textAlign: 'center', lineHeight: 18 },
});
