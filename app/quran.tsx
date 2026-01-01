/**
 * Quran Reader - Surah List Screen
 * Browse all 114 surahs with metadata
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DarkTheme, Spacing, Typography } from '../constants/DarkTheme';
import { useLanguage } from '../contexts/LanguageContext';
import { QURAN_SURAHS, Surah } from '../data/quran-surahs';
import { getProgress } from '../services/QuranService';

export default function QuranReaderScreen() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [lastRead, setLastRead] = useState<{ surah: number; ayah: number } | null>(null);

  // Load last reading progress
  React.useEffect(() => {
    getProgress().then(progress => {
      if (progress) {
        setLastRead({ surah: progress.lastSurah, ayah: progress.lastAyah });
      }
    });
  }, []);

  // Filter surahs by search query
  const filteredSurahs = useMemo(() => {
    if (!searchQuery.trim()) {
      return QURAN_SURAHS;
    }

    const query = searchQuery.toLowerCase();
    return QURAN_SURAHS.filter(surah => {
      const nameMatch = surah.name.transliteration.toLowerCase().includes(query) ||
        surah.name.en.toLowerCase().includes(query) ||
        surah.name.arabic.includes(query);
      const numberMatch = surah.number.toString().includes(query);
      return nameMatch || numberMatch;
    });
  }, [searchQuery]);

  const handleSurahPress = useCallback((surah: Surah) => {
    router.push({
      pathname: '/quran/[surahNumber]',
      params: { surahNumber: surah.number.toString() },
    });
  }, [router]);

  const renderSurahCard = useCallback(({ item: surah }: { item: Surah }) => {
    const isLastRead = lastRead?.surah === surah.number;
    const surahName = language === 'fr' && surah.name.fr 
      ? surah.name.fr 
      : surah.name.en;

    return (
      <TouchableOpacity
        style={styles.surahCard}
        onPress={() => handleSurahPress(surah)}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={isLastRead 
            ? ['rgba(16, 185, 129, 0.1)', 'rgba(16, 185, 129, 0.05)']
            : ['rgba(139, 115, 85, 0.1)', 'rgba(139, 115, 85, 0.05)']
          }
          style={styles.surahCardGradient}
        >
          {/* Number Circle */}
          <View style={styles.numberCircle}>
            <Text style={styles.surahNumber}>{surah.number}</Text>
          </View>

          {/* Surah Info */}
          <View style={styles.surahInfo}>
            <View style={styles.surahNameRow}>
              <Text style={styles.surahNameEn}>{surahName}</Text>
              {isLastRead && (
                <View style={styles.lastReadBadge}>
                  <Ionicons name="bookmark" size={12} color="#10b981" />
                  <Text style={styles.lastReadText}>Last Read</Text>
                </View>
              )}
            </View>
            <View style={styles.surahMetaRow}>
              <Text style={styles.surahMeta}>
                {surah.revelationType} · {surah.totalAyahs} {t('quran.ayahs')}
              </Text>
            </View>
          </View>

          {/* Arabic Name */}
          <View style={styles.arabicNameContainer}>
            <Text style={styles.surahNameAr}>{surah.name.arabic}</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }, [handleSurahPress, lastRead, language, t]);

  const ListHeaderComponent = useMemo(() => (
    <View style={styles.header}>
      <View style={styles.titleRow}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{t('quran.title')}</Text>
          <Text style={styles.subtitle}>{t('quran.subtitle')}</Text>
        </View>
        <TouchableOpacity 
          style={styles.bookmarksButton}
          onPress={() => router.push('/quran/bookmarks')}
        >
          <Ionicons name="bookmarks-outline" size={24} color={DarkTheme.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Continue Reading Card */}
      {lastRead && (
        <TouchableOpacity
          style={styles.continueCard}
          onPress={() => router.push({
            pathname: '/quran/[surahNumber]',
            params: { 
              surahNumber: lastRead.surah.toString(),
              scrollToAyah: lastRead.ayah.toString(),
            },
          })}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['rgba(16, 185, 129, 0.2)', 'rgba(16, 185, 129, 0.1)']}
            style={styles.continueCardGradient}
          >
            <View style={styles.continueIconContainer}>
              <Ionicons name="play-circle" size={32} color="#10b981" />
            </View>
            <View style={styles.continueInfo}>
              <Text style={styles.continueTitle}>{t('quran.continueReading')}</Text>
              <Text style={styles.continueText}>
                {QURAN_SURAHS[lastRead.surah - 1]?.name.en} · {t('quran.ayah')} {lastRead.ayah}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={DarkTheme.textSecondary} />
          </LinearGradient>
        </TouchableOpacity>
      )}

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={DarkTheme.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={t('quran.searchPlaceholder')}
          placeholderTextColor={DarkTheme.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={DarkTheme.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.sectionTitle}>
        {searchQuery ? `${filteredSurahs.length} ${t('quran.results')}` : t('quran.allSurahs')}
      </Text>
    </View>
  ), [lastRead, searchQuery, filteredSurahs.length, t, router, language]);

  return (
    <LinearGradient
      colors={['#0f172a', '#1e1b4b', '#1A1625']}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <FlatList
        data={filteredSurahs}
        renderItem={renderSurahCard}
        keyExtractor={(item) => item.number.toString()}
        ListHeaderComponent={ListHeaderComponent}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + Spacing.xl }
        ]}
        showsVerticalScrollIndicator={false}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: Spacing.screenPadding,
  },
  header: {
    paddingTop: Spacing.md,
    gap: Spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: Typography.weightBold,
    color: DarkTheme.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: DarkTheme.textSecondary,
    lineHeight: 20,
  },
  bookmarksButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueCard: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  continueCardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.md,
  },
  continueIconContainer: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 24,
  },
  continueInfo: {
    flex: 1,
  },
  continueTitle: {
    fontSize: 14,
    fontWeight: Typography.weightSemibold,
    color: '#10b981',
    marginBottom: 2,
  },
  continueText: {
    fontSize: 13,
    color: DarkTheme.textSecondary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    height: 48,
    gap: Spacing.sm,
  },
  searchIcon: {
    opacity: 0.6,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: DarkTheme.textPrimary,
    paddingVertical: 0,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
    marginTop: Spacing.sm,
  },
  surahCard: {
    marginBottom: Spacing.sm,
    borderRadius: 12,
    overflow: 'hidden',
  },
  surahCardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.md,
  },
  numberCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(139, 115, 85, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  surahNumber: {
    fontSize: 16,
    fontWeight: Typography.weightBold,
    color: '#8B7355',
  },
  surahInfo: {
    flex: 1,
    gap: 4,
  },
  surahNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  surahNameEn: {
    fontSize: 16,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
  },
  lastReadBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 8,
  },
  lastReadText: {
    fontSize: 10,
    fontWeight: Typography.weightSemibold,
    color: '#10b981',
  },
  surahMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  surahMeta: {
    fontSize: 13,
    color: DarkTheme.textSecondary,
  },
  arabicNameContainer: {
    alignItems: 'flex-end',
  },
  surahNameAr: {
    fontSize: 18,
    fontWeight: Typography.weightBold,
    color: DarkTheme.textPrimary,
    textAlign: 'right',
  },
});
