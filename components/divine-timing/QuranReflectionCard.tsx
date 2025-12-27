/**
 * Qur'an Reflection Card Component
 * =================================
 * Displays a Qur'an verse for spiritual reflection
 * 
 * IMPORTANT: This is for reflection only, NOT tafsir or interpretation.
 */

import Colors from '@/constants/Colors';
import { QURAN_REFLECTION_DISCLAIMER, QuranReflection } from '@/services/QuranReflectionService';
import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface QuranReflectionCardProps {
  reflection: QuranReflection;
  colorScheme?: 'light' | 'dark';
  showTranslation?: boolean;
  onToggleTranslation?: () => void;
}

export function QuranReflectionCard({
  reflection,
  colorScheme = 'light',
  showTranslation = true,
  onToggleTranslation,
}: QuranReflectionCardProps) {
  const isDark = colorScheme === 'dark';
  const colors = Colors[colorScheme];
  
  const [translationVisible, setTranslationVisible] = useState(showTranslation);
  
  const handleToggleTranslation = () => {
    const newState = !translationVisible;
    setTranslationVisible(newState);
    onToggleTranslation?.();
  };
  
  const handleOpenQuranCom = () => {
    Linking.openURL(reflection.quranComLink);
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="book-outline" size={24} color={colors.primary} />
          <Text style={[styles.title, { color: colors.text }]}>
            Qur'an Reflection
          </Text>
        </View>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          For contemplation only
        </Text>
      </View>
      
      {/* Surah Info */}
      <View style={[styles.surahInfo, { backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5' }]}>
        <View style={styles.surahRow}>
          <Text style={[styles.surahNameAr, { color: colors.text }]}>
            {reflection.verse.surahNameAr}
          </Text>
          <Text style={[styles.surahNameEn, { color: colors.text }]}>
            {reflection.verse.surahNameEn}
          </Text>
        </View>
        <Text style={[styles.ayahNumber, { color: colors.textSecondary }]}>
          Ayah {reflection.verse.ayahNumber}
        </Text>
      </View>
      
      {/* Arabic Verse */}
      <View style={[styles.verseCard, { backgroundColor: isDark ? '#0f1419' : '#fafafa' }]}>
        <Text style={[styles.arabicText, { color: colors.text }]}>
          {reflection.verse.arabicText}
        </Text>
      </View>
      
      {/* Translation Toggle */}
      <TouchableOpacity
        style={styles.translationToggle}
        onPress={handleToggleTranslation}
      >
        <Ionicons
          name={translationVisible ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={colors.primary}
        />
        <Text style={[styles.translationToggleText, { color: colors.primary }]}>
          {translationVisible ? 'Hide' : 'Show'} Translation
        </Text>
      </TouchableOpacity>
      
      {/* Translation */}
      {translationVisible && (
        <View style={[styles.translationCard, { backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5' }]}>
          <Text style={[styles.translationText, { color: colors.text }]}>
            {reflection.verse.translationEn}
          </Text>
        </View>
      )}
      
      {/* Reflection Prompt */}
      <View style={[styles.promptCard, { backgroundColor: isDark ? '#1a2b1a' : '#f0f9f0' }]}>
        <View style={styles.promptHeader}>
          <Ionicons name="leaf-outline" size={18} color="#10b981" />
          <Text style={[styles.promptLabel, { color: '#10b981' }]}>
            Reflection Prompt
          </Text>
        </View>
        <Text style={[styles.promptText, { color: colors.text }]}>
          {reflection.prompt.text}
        </Text>
      </View>
      
      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.primary }]}
          onPress={handleOpenQuranCom}
        >
          <Ionicons name="globe-outline" size={18} color="#fff" />
          <Text style={styles.actionButtonText}>
            Read on Quran.com
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Disclaimer */}
      <View style={styles.disclaimerContainer}>
        <Ionicons name="information-circle-outline" size={16} color={colors.textSecondary} />
        <Text style={[styles.disclaimerText, { color: colors.textSecondary }]}>
          {QURAN_REFLECTION_DISCLAIMER}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  header: {
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  surahInfo: {
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  surahRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  surahNameAr: {
    fontSize: 18,
    fontWeight: '600',
  },
  surahNameEn: {
    fontSize: 16,
    fontWeight: '500',
  },
  ayahNumber: {
    fontSize: 13,
  },
  verseCard: {
    borderRadius: 12,
    padding: 20,
    alignItems: 'flex-end',
  },
  arabicText: {
    fontSize: 24,
    lineHeight: 40,
    textAlign: 'right',
    fontFamily: 'System',
  },
  translationToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  translationToggleText: {
    fontSize: 14,
    fontWeight: '500',
  },
  translationCard: {
    borderRadius: 12,
    padding: 16,
  },
  translationText: {
    fontSize: 15,
    lineHeight: 24,
  },
  promptCard: {
    borderRadius: 12,
    padding: 16,
    gap: 10,
  },
  promptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  promptLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  promptText: {
    fontSize: 15,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  actions: {
    gap: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 12,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  disclaimerContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  disclaimerText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 16,
    fontStyle: 'italic',
  },
});
