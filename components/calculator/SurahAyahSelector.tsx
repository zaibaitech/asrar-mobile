/**
 * Surah and Ayah Selector Component
 * Two-step picker for Qur'an verses
 */

import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getAllSurahs, getSurahByNumber, Surah } from '../../data/quran-surahs';

interface SurahAyahSelectorProps {
  onSelect: (surahNumber: number, ayahNumber: number) => void;
  selectedSurah?: number | null;
  selectedAyah?: number | null;
}

export const SurahAyahSelector: React.FC<SurahAyahSelectorProps> = ({
  onSelect,
  selectedSurah,
  selectedAyah,
}) => {
  const [step, setStep] = useState<'surah' | 'ayah'>('surah');
  const [chosenSurah, setChosenSurah] = useState<number | undefined>(
    selectedSurah ?? undefined
  );
  
  const allSurahs = getAllSurahs();
  
  const handleSurahSelect = (surahNumber: number) => {
    setChosenSurah(surahNumber);
    setStep('ayah');
  };
  
  const handleAyahSelect = (ayahNumber: number) => {
    if (!chosenSurah) {
      return;
    }

    if (typeof onSelect !== 'function') {
      console.warn('[SurahAyahSelector] onSelect handler missing');
      return;
    }

    onSelect(chosenSurah, ayahNumber);
  };
  
  const handleBack = () => {
    setStep('surah');
  };
  
  const renderSurahCard = (item: Surah) => {
    const isSelected = selectedSurah === item.number;
    
    return (
      <TouchableOpacity
        key={item.number}
        style={[styles.surahCard, isSelected && styles.surahCardSelected]}
        onPress={() => handleSurahSelect(item.number)}
        activeOpacity={0.7}
      >
        <View style={styles.surahHeader}>
          <View style={styles.surahNumberBadge}>
            <Text style={styles.surahNumber}>{item.number}</Text>
          </View>
          
          <View style={styles.surahInfo}>
            <Text style={styles.surahArabic}>{item.name.arabic}</Text>
            <Text style={styles.surahTranslit}>{item.name.transliteration}</Text>
            <Text style={styles.surahEnglish}>{item.name.en}</Text>
          </View>
        </View>
        
        <View style={styles.surahMeta}>
          <View style={styles.metaChip}>
            <Text style={styles.metaText}>{item.totalAyahs} ayahs</Text>
          </View>
          <View style={styles.metaChip}>
            <Text style={styles.metaText}>{item.revelationType}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  
  const renderAyahSelector = () => {
    const surah = chosenSurah ? getSurahByNumber(chosenSurah) : null;
    if (!surah) return null;
    
    const ayahs = Array.from({ length: surah.totalAyahs }, (_, i) => i + 1);
    
    return (
      <View style={styles.ayahContainer}>
        <View style={styles.ayahHeader}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.ayahTitle}>
            {surah.name.transliteration} ({surah.totalAyahs} ayahs)
          </Text>
        </View>
        
        <View style={styles.ayahGrid}>
          {ayahs.map(ayahNum => (
            <TouchableOpacity
              key={ayahNum}
              style={[
                styles.ayahButton,
                selectedAyah === ayahNum && styles.ayahButtonSelected,
              ]}
              onPress={() => handleAyahSelect(ayahNum)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.ayahButtonText,
                  selectedAyah === ayahNum && styles.ayahButtonTextSelected,
                ]}
              >
                {ayahNum}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };
  
  if (step === 'ayah') {
    return renderAyahSelector();
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📖 Select Surah</Text>
      
      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {allSurahs.map(renderSurahCard)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#f1f5f9',
    padding: 20,
    paddingBottom: 12,
  },
  
  listContent: {
    padding: 20,
    gap: 12,
  },
  
  surahCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#334155',
  },
  
  surahCardSelected: {
    borderColor: '#10b981',
    backgroundColor: '#064e3b',
  },
  
  surahHeader: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  
  surahNumberBadge: {
    backgroundColor: '#10b981',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  surahNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
  },
  
  surahInfo: {
    flex: 1,
    gap: 2,
  },
  
  surahArabic: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f1f5f9',
    textAlign: 'right',
  },
  
  surahTranslit: {
    fontSize: 14,
    fontWeight: '600',
    color: '#cbd5e1',
  },
  
  surahEnglish: {
    fontSize: 12,
    color: '#94a3b8',
  },
  
  surahMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  
  metaChip: {
    backgroundColor: '#334155',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  
  metaText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94a3b8',
  },
  
  // Ayah selector styles
  ayahContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 20,
  },
  
  ayahHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  
  backButton: {
    padding: 8,
  },
  
  backText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10b981',
  },
  
  ayahTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f1f5f9',
    flex: 1,
  },
  
  ayahGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  
  ayahButton: {
    width: 60,
    height: 60,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#334155',
  },
  
  ayahButtonSelected: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  
  ayahButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#cbd5e1',
  },
  
  ayahButtonTextSelected: {
    color: '#fff',
  },
});
