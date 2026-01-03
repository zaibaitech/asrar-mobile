/**
 * Surah and Ayah Selector Component
 * Two-step picker for Qur'an verses
 */

import React, { useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getAllSurahs, getSurahByNumber, Surah } from '../../data/quran-surahs';
import { shouldDisplayBasmalah } from '../../utils/basmalah';

interface SurahAyahSelectorProps {
  /**
   * Callback when surah and ayah are selected
   * REQUIRED: Parent component must provide this handler
   */
  onSelect: (surahNumber: number, ayahNumber: number | 'basmalah') => void;
  selectedSurah?: number | null;
  selectedAyah?: number | 'basmalah' | null;
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
  
  const handleAyahSelect = (ayahNumber: number | 'basmalah') => {
    if (!chosenSurah) {
      console.warn('[SurahAyahSelector] No surah selected');
      return;
    }

    // Safety check: ensure onSelect is provided
    if (!onSelect || typeof onSelect !== 'function') {
      console.error('[SurahAyahSelector] CRITICAL: onSelect handler is missing or invalid');
      return;
    }

    // Safe to call now
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
    
    // Add Basmalah as option for surahs that have it (all except Surah 9)
    const hasBasmalah = shouldDisplayBasmalah(surah.number);
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
        
        {/* Basmalah option (if applicable) */}
        {hasBasmalah && (
          <View style={styles.basmalahSection}>
            <TouchableOpacity
              style={styles.basmalahButton}
              onPress={() => handleAyahSelect('basmalah')}
              activeOpacity={0.7}
            >
              <Text style={styles.basmalahIcon}>📿</Text>
              <View style={styles.basmalahTextContainer}>
                <Text style={styles.basmalahArabic}>بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</Text>
                <Text style={styles.basmalahLabel}>Basmalah</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
        
        {/* Ayah numbers grid */}
        <Text style={styles.ayahsLabel}>Ayahs</Text>
        <FlatList
          data={ayahs}
          numColumns={5}
          keyExtractor={(item) => String(item)}
          renderItem={({ item: ayahNum }) => (
            <TouchableOpacity
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
          )}
          contentContainerStyle={styles.ayahGridContent}
          columnWrapperStyle={styles.ayahGridRow}
          showsVerticalScrollIndicator={true}
          style={styles.ayahGrid}
        />
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
  
  // Basmalah special button
  basmalahSection: {
    marginBottom: 20,
  },
  
  basmalahButton: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 2,
    borderColor: '#6366f1',
  },
  
  basmalahIcon: {
    fontSize: 32,
  },
  
  basmalahTextContainer: {
    flex: 1,
  },
  
  basmalahArabic: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f1f5f9',
    textAlign: 'right',
    marginBottom: 4,
  },
  
  basmalahLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8',
  },
  
  ayahsLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#94a3b8',
    marginBottom: 12,
  },
  
  ayahGrid: {
    flex: 1,
  },
  
  ayahGridContent: {
    paddingBottom: 24,
  },
  
  ayahGridRow: {
    gap: 8,
    marginBottom: 8,
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
