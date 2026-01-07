/**
 * Qur'an Result Section Component
 */

import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Linking, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useLanguage } from '../../../contexts/LanguageContext';
import { QuranInsights } from '../../../types/calculator-enhanced';

interface QuranResultSectionProps {
  insights: QuranInsights;
}

export const QuranResultSection: React.FC<QuranResultSectionProps> = ({ insights }) => {
  const { t } = useLanguage();
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
            <Text style={styles.ayahNumber}>
              {t('calculator.results.quran.ayah')} {insights.ayahNumber}
            </Text>
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
        <Text style={styles.cardTitle}>🌟 {t('calculator.results.quran.resonanceLink')}</Text>
        <Text style={styles.resonanceSubtitle}>
          {insights.resonanceLink.isCalculated 
            ? `📊 ${t('calculator.results.quran.calculatedFrom')}` 
            : `💭 ${t('calculator.results.quran.suggestedAssociation')}`}
        </Text>
        <View style={styles.resonanceRow}>
          <View style={styles.resonanceItem}>
            <Text style={styles.resonanceLabel}>{t('calculator.results.quran.element')}</Text>
            <Text style={styles.resonanceValue}>
              {t(`calculator.results.elements.${insights.resonanceLink.dominantElement}`)}
            </Text>
          </View>
          <View style={styles.resonanceItem}>
            <Text style={styles.resonanceLabel}>{t('calculator.results.quran.sacredNumber')}</Text>
            <Text style={styles.resonanceValue}>{insights.resonanceLink.sacredNumber}</Text>
          </View>
          {insights.resonanceLink.kabir && (
            <View style={styles.resonanceItem}>
              <Text style={styles.resonanceLabel}>{t('calculator.results.quran.verseKabir')}</Text>
              <Text style={styles.resonanceValue}>{insights.resonanceLink.kabir}</Text>
            </View>
          )}
        </View>
        <Text style={styles.resonanceMeaning}>
          {t(insights.resonanceLink.meaningKey)}
          {'\n\n'}
          {insights.resonanceLink.distance !== undefined && (
            <>
              {insights.resonanceLink.distance > 0 ? '📊 ' : '✨ '}
              {t(insights.resonanceLink.descriptionKey, {
                kabir: insights.resonanceLink.kabir?.toString() || '',
                nearest: insights.resonanceLink.sacredNumber.toString(),
                distance: insights.resonanceLink.distance.toString(),
              })}
            </>
          )}
        </Text>
      </View>
      
      {/* Reflection Block */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🤲 {t('calculator.results.quran.reflection')}</Text>
        <Text style={styles.reflectionPrompt}>{t(insights.reflectionBlock.promptKey)}</Text>
        <TextInput
          style={styles.notesInput}
          value={reflectionNotes}
          onChangeText={setReflectionNotes}
          placeholder={t('calculator.results.quran.reflectionPlaceholder')}
          placeholderTextColor="#64748b"
          multiline
          numberOfLines={4}
        />
      </View>
      
      {/* Quran.com Link */}
      {insights.quranComLink && (
        <TouchableOpacity onPress={handleOpenQuranCom} activeOpacity={0.8}>
          <LinearGradient colors={['#6366f1', '#8b5cf6']} style={styles.linkButton}>
            <Text style={styles.linkText}>📖 {t('calculator.results.quran.readOnQuranCom')}</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
      
      {/* Disclaimer */}
      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>
          ⚠️ {t('calculator.results.quran.disclaimer')}
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
