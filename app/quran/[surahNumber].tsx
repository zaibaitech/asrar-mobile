/**
 * Surah Detail Screen
 * Display full surah with Arabic text and translation
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DarkTheme, Spacing, Typography } from '../../constants/DarkTheme';
import { useLanguage } from '../../contexts/LanguageContext';
import { QURAN_SURAHS } from '../../data/quran-surahs';
import {
    addBookmark,
    fetchSurah,
    isBookmarked,
    removeBookmark,
    saveProgress,
} from '../../services/QuranService';
import { QuranAyahWithTranslation, QuranSurah, QuranTranslationEdition } from '../../types/quran';

export default function SurahDetailScreen() {
  const { surahNumber, scrollToAyah } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t, language } = useLanguage();
  const flatListRef = useRef<FlatList>(null);

  const [surah, setSurah] = useState<QuranSurah | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookmarkedAyahs, setBookmarkedAyahs] = useState<Set<number>>(new Set());

  const surahNum = parseInt(surahNumber as string, 10);
  const surahMeta = QURAN_SURAHS[surahNum - 1];
  const translationEdition: QuranTranslationEdition = language === 'fr' ? 'fr.hamidullah' : 'en.sahih';

  // Load surah data
  useEffect(() => {
    loadSurah();
    loadBookmarks();
  }, [surahNum, translationEdition]);

  // Scroll to specific ayah if provided
  useEffect(() => {
    if (surah && scrollToAyah && flatListRef.current) {
      const ayahIndex = parseInt(scrollToAyah as string, 10) - 1;
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: ayahIndex,
          animated: true,
          viewPosition: 0.2,
        });
      }, 500);
    }
  }, [surah, scrollToAyah]);

  const loadSurah = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchSurah(surahNum, translationEdition);
      setSurah(data);
    } catch (err) {
      console.error('Error loading surah:', err);
      setError(t('quran.errorLoading'));
    } finally {
      setLoading(false);
    }
  };

  const loadBookmarks = async () => {
    const bookmarked = new Set<number>();
    if (surahMeta) {
      for (let i = 1; i <= surahMeta.totalAyahs; i++) {
        const isMarked = await isBookmarked(surahNum, i);
        if (isMarked) {
          bookmarked.add(i);
        }
      }
    }
    setBookmarkedAyahs(bookmarked);
  };

  const handleBookmarkToggle = async (ayah: QuranAyahWithTranslation) => {
    try {
      const ayahNum = ayah.numberInSurah;
      const isCurrentlyBookmarked = bookmarkedAyahs.has(ayahNum);

      if (isCurrentlyBookmarked) {
        const bookmarkId = `${surahNum}-${ayahNum}`;
        await removeBookmark(bookmarkId);
        setBookmarkedAyahs(prev => {
          const next = new Set(prev);
          next.delete(ayahNum);
          return next;
        });
      } else {
        await addBookmark({
          surahNumber: surahNum,
          ayahNumber: ayahNum,
          surahName: surah?.englishName || '',
          ayahText: ayah.arabic.text,
          translation: ayah.translation.text,
        });
        setBookmarkedAyahs(prev => new Set(prev).add(ayahNum));
      }
    } catch (err) {
      Alert.alert(t('common.error'), t('quran.bookmarkError'));
    }
  };

  const handleAyahPress = (ayah: QuranAyahWithTranslation) => {
    saveProgress(surahNum, ayah.numberInSurah);
  };

  const renderAyah = useCallback(({ item: ayah }: { item: QuranAyahWithTranslation }) => {
    const isBookmarked = bookmarkedAyahs.has(ayah.numberInSurah);

    return (
      <TouchableOpacity
        style={styles.ayahCard}
        onPress={() => handleAyahPress(ayah)}
        onLongPress={() => handleBookmarkToggle(ayah)}
        activeOpacity={0.7}
      >
        <View style={styles.ayahNumber}>
          <Text style={styles.ayahNumberText}>{ayah.numberInSurah}</Text>
        </View>

        <View style={styles.ayahContent}>
          {/* Arabic Text */}
          <Text style={styles.arabicText}>{ayah.arabic.text}</Text>

          {/* Translation */}
          <Text style={styles.translationText}>{ayah.translation.text}</Text>

          {/* Actions */}
          <View style={styles.ayahActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleBookmarkToggle(ayah)}
            >
              <Ionicons
                name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                size={18}
                color={isBookmarked ? '#10b981' : DarkTheme.textSecondary}
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  }, [bookmarkedAyahs, handleBookmarkToggle, handleAyahPress]);

  const ListHeaderComponent = useMemo(() => (
    <View style={styles.surahHeader}>
      <LinearGradient
        colors={['rgba(139, 115, 85, 0.2)', 'rgba(139, 115, 85, 0.1)']}
        style={styles.surahHeaderGradient}
      >
        <Text style={styles.surahNameAr}>{surahMeta?.name.arabic}</Text>
        <Text style={styles.surahNameEn}>
          {language === 'fr' && surahMeta?.name.fr ? surahMeta.name.fr : surahMeta?.name.en}
        </Text>
        <View style={styles.surahMeta}>
          <Text style={styles.surahMetaText}>
            {surahMeta?.revelationType} · {surahMeta?.totalAyahs} {t('quran.ayahs')}
          </Text>
        </View>
      </LinearGradient>

      {/* Bismillah (except for Surah 1 and 9) */}
      {surahNum !== 1 && surahNum !== 9 && (
        <View style={styles.bismillahContainer}>
          <Text style={styles.bismillah}>بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</Text>
        </View>
      )}
    </View>
  ), [surahMeta, language, t, surahNum]);

  if (loading) {
    return (
      <LinearGradient
        colors={['#0f172a', '#1e1b4b', '#1A1625']}
        style={[styles.container, { paddingTop: insets.top }]}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={DarkTheme.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('quran.loading')}</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B7355" />
          <Text style={styles.loadingText}>{t('quran.loadingSurah')}</Text>
        </View>
      </LinearGradient>
    );
  }

  if (error || !surah) {
    return (
      <LinearGradient
        colors={['#0f172a', '#1e1b4b', '#1A1625']}
        style={[styles.container, { paddingTop: insets.top }]}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={DarkTheme.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('common.error')}</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={DarkTheme.textTertiary} />
          <Text style={styles.errorText}>{error || t('quran.errorLoading')}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadSurah}>
            <Text style={styles.retryButtonText}>{t('common.retry')}</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#0f172a', '#1e1b4b', '#1A1625']}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={DarkTheme.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {t('quran.surah')} {surahNum}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <FlatList
        ref={flatListRef}
        data={surah.ayahs}
        renderItem={renderAyah}
        keyExtractor={(item) => item.numberInSurah.toString()}
        ListHeaderComponent={ListHeaderComponent}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + Spacing.xl }
        ]}
        showsVerticalScrollIndicator={false}
        onScrollToIndexFailed={(info) => {
          setTimeout(() => {
            flatListRef.current?.scrollToIndex({
              index: info.index,
              animated: true,
            });
          }, 100);
        }}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: Typography.weightBold,
    color: DarkTheme.textPrimary,
  },
  headerSpacer: {
    width: 40,
  },
  listContent: {
    paddingHorizontal: Spacing.screenPadding,
  },
  surahHeader: {
    marginVertical: Spacing.lg,
  },
  surahHeaderGradient: {
    padding: Spacing.lg,
    borderRadius: 16,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  surahNameAr: {
    fontSize: 32,
    fontWeight: Typography.weightBold,
    color: DarkTheme.textPrimary,
    textAlign: 'center',
  },
  surahNameEn: {
    fontSize: 20,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textSecondary,
    textAlign: 'center',
  },
  surahMeta: {
    marginTop: Spacing.xs,
  },
  surahMetaText: {
    fontSize: 14,
    color: DarkTheme.textTertiary,
    textAlign: 'center',
  },
  bismillahContainer: {
    alignItems: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  bismillah: {
    fontSize: 24,
    fontWeight: Typography.weightBold,
    color: '#8B7355',
    textAlign: 'center',
  },
  ayahCard: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
    padding: Spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    gap: Spacing.md,
  },
  ayahNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(139, 115, 85, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ayahNumberText: {
    fontSize: 14,
    fontWeight: Typography.weightBold,
    color: '#8B7355',
  },
  ayahContent: {
    flex: 1,
    gap: Spacing.sm,
  },
  arabicText: {
    fontSize: 22,
    lineHeight: 40,
    color: DarkTheme.textPrimary,
    textAlign: 'right',
    fontWeight: Typography.weightSemibold,
  },
  translationText: {
    fontSize: 15,
    lineHeight: 24,
    color: DarkTheme.textSecondary,
  },
  ayahActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  actionButton: {
    padding: Spacing.xs,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  loadingText: {
    fontSize: 16,
    color: DarkTheme.textSecondary,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.screenPadding * 2,
    gap: Spacing.md,
  },
  errorText: {
    fontSize: 16,
    color: DarkTheme.textSecondary,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: Spacing.md,
    backgroundColor: '#8B7355',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 15,
    fontWeight: Typography.weightSemibold,
    color: '#000',
  },
});
