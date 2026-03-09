/**
 * Surah Detail Screen
 * Display full surah with Arabic text, translation, and audio
 */

import { AudioPlayer } from '@/components/quran/AudioPlayer';
import { DarkTheme, Spacing, Typography } from '@/constants/DarkTheme';
import { useLanguage } from '@/contexts/LanguageContext';
import { QURAN_SURAHS } from '@/data/quran-surahs';
import {
    addBookmark,
    fetchSurah,
    isBookmarked,
    removeBookmark,
    saveProgress,
} from '@/services/QuranService';
import { QuranAyahWithTranslation, QuranSurah, QuranTranslationEdition } from '@/types/quran';
import { getBasmalahText, shouldDisplayBasmalah, shouldStripBasmalah, startsWithBasmalah, stripLeadingBasmalah } from '@/utils/basmalah';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

export default function SurahDetailScreen() {
  const { surahNumber, scrollToAyah, autoPlay } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t, language } = useLanguage();
  const flatListRef = useRef<FlatList>(null);

  const [surah, setSurah] = useState<QuranSurah | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookmarkedAyahs, setBookmarkedAyahs] = useState<Set<number>>(new Set());
  const [currentlyPlayingAyah, setCurrentlyPlayingAyah] = useState<number | null>(null);
  const [continuousPlayback, setContinuousPlayback] = useState(autoPlay === 'true');

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

  // Auto-start playback if continuous mode is active and surah just loaded
  useEffect(() => {
    if (surah && autoPlay === 'true' && !currentlyPlayingAyah) {
      // Start playing from ayah 1 when navigating to new surah in auto-play mode
      setTimeout(() => {
        setCurrentlyPlayingAyah(1);
      }, 300); // Small delay to ensure UI is ready
    }
  }, [surah]); // Only run when surah loads, not when continuousPlayback changes

  // Auto-scroll to currently playing ayah in continuous mode
  useEffect(() => {
    if (currentlyPlayingAyah && continuousPlayback && surah && flatListRef.current) {
      const ayahIndex = currentlyPlayingAyah - 1;
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: ayahIndex,
          animated: true,
          viewPosition: 0.3, // Show ayah in upper third of screen
        });
      }, 200);
    }
  }, [currentlyPlayingAyah, continuousPlayback, surah]);

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

  /**
   * Handle ayah playback completion
   * If continuous playback is enabled, auto-play the next ayah or move to next surah
   */
  const handleAyahComplete = useCallback((currentAyahNumber: number) => {
    if (continuousPlayback && surah) {
      const nextAyahNumber = currentAyahNumber + 1;
      if (nextAyahNumber <= surah.ayahs.length) {
        // Auto-play next ayah in current surah
        setCurrentlyPlayingAyah(nextAyahNumber);
      } else {
        // End of current surah reached - move to next surah
        const nextSurahNumber = surahNum + 1;
        if (nextSurahNumber <= 114) {
          // Navigate to next surah with autoPlay enabled
          router.push(`/quran/${nextSurahNumber}?autoPlay=true`);
        } else {
          // Completed all 114 surahs
          setCurrentlyPlayingAyah(null);
          setContinuousPlayback(false);
        }
      }
    }
  }, [continuousPlayback, surah, surahNum, router]);

  /**
   * Get clean Arabic text for display (Mushaf-compliant)
   * 
   * BASMALAH STRIPPING RULES:
   * - Surah 9 (At-Tawbah): No Basmalah, display ayah as-is
   * - Surah 27, Ayah 30: Contains Basmalah INSIDE verse, do NOT strip
   * - Other surahs, Ayah 1: Strip Basmalah if present (shown separately as header)
   * - All Ayah 2+: Display as-is
   * 
   * This ensures:
   * - Basmalah appears only once (as header)
   * - Ayah text matches standard Mushaf (e.g., Surah 2:1 = "الم" not "بسم الله الرحمن الرحيم الم")
   */
  const getCleanArabicText = (ayah: QuranAyahWithTranslation): string => {
    const text = ayah.arabic.text;
    
    // Check if we should strip Basmalah from this ayah
    if (shouldStripBasmalah(surahNum, ayah.numberInSurah)) {
      // Verify that text actually starts with Basmalah before stripping
      if (startsWithBasmalah(text)) {
        const stripped = stripLeadingBasmalah(text);
        
        // Debug: Log if stripping seems incomplete
        if (stripped.includes('الرحمن') || stripped.includes('الرحيم')) {
          console.warn(
            `[Qur'an Reader] Potential incomplete Basmalah stripping in Surah ${surahNum}:${ayah.numberInSurah}`,
            { original: text, stripped }
          );
        }
        
        return stripped;
      }
    }
    
    // Return text as-is for all other cases
    return text;
  };

  const renderAyah = useCallback(({ item: ayah }: { item: QuranAyahWithTranslation }) => {
    const isBookmarked = bookmarkedAyahs.has(ayah.numberInSurah);
    const isPlaying = currentlyPlayingAyah === ayah.numberInSurah;
    const cleanArabicText = getCleanArabicText(ayah);

    return (
      <View style={[
        styles.ayahWrapper,
        isPlaying && styles.ayahWrapperPlaying
      ]}>
        {/* Top row: Ayah number and Audio button */}
        <View style={styles.ayahTopRow}>
          <View style={styles.ayahNumberContainer}>
            <Text style={styles.ayahNumber}>﴿{ayah.numberInSurah}﴾</Text>
          </View>
          
          {ayah.audioUrl && (
            <AudioPlayer
              audioUrl={ayah.audioUrl}
              ayahNumber={ayah.numberInSurah}
              autoPlay={isPlaying}
              onPress={() => {
                // Toggle: if this ayah is currently playing, stop it. Otherwise, start it.
                if (currentlyPlayingAyah === ayah.numberInSurah) {
                  setCurrentlyPlayingAyah(null);
                  setContinuousPlayback(false); // Stop continuous mode when user manually stops
                } else {
                  setCurrentlyPlayingAyah(ayah.numberInSurah);
                }
              }}
              onPlaybackStatusUpdate={(playing) => {
                // Update state based on actual playback status
                if (!playing && currentlyPlayingAyah === ayah.numberInSurah) {
                  setCurrentlyPlayingAyah(null);
                }
              }}
              onFinished={() => handleAyahComplete(ayah.numberInSurah)}
            />
          )}
        </View>

        {/* Main content: Arabic and Translation */}
        <TouchableOpacity
          style={styles.ayahContainer}
          onPress={() => handleAyahPress(ayah)}
          onLongPress={() => handleBookmarkToggle(ayah)}
          activeOpacity={0.9}
        >
          {/* Arabic Text - Full width, prominent */}
          <View style={styles.arabicSection}>
            <Text style={styles.arabicText}>
              {cleanArabicText}
            </Text>
          </View>

          {/* Translation - Secondary, clearly separated */}
          <Text style={styles.translationText}>{ayah.translation.text}</Text>

          {/* Bookmark indicator - minimal */}
          {isBookmarked && (
            <View style={styles.bookmarkIndicator}>
              <Ionicons name="bookmark" size={14} color="#3b82f6" />
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  }, [bookmarkedAyahs, currentlyPlayingAyah, handleBookmarkToggle, handleAyahPress, surahNum]);

  const ListHeaderComponent = useMemo(() => (
    <View style={styles.surahHeader}>
      {/* Clean Surah Info Header - Minimal, Informational */}
      <View style={styles.surahInfoContainer}>
        <Text style={styles.surahNameAr}>{surahMeta?.name.arabic}</Text>
        <Text style={styles.surahNameEn}>
          {language === 'fr' && surahMeta?.name.fr ? surahMeta.name.fr : surahMeta?.name.en}
        </Text>
        <Text style={styles.surahMeta}>
          {surahMeta?.revelationType} · {surahMeta?.totalAyahs} {t('quran.ayahs')}
        </Text>
        {surah?.reciter && (
          <Text style={styles.reciter}>
            <Ionicons name="musical-notes" size={12} color="#3b82f6" /> {t('quran.reciter')}
          </Text>
        )}
      </View>

      {/* Bismillah - Centered, Elegant (except for Surah 9 / At-Tawbah) */}
      {shouldDisplayBasmalah(surahNum) && (
        <View style={styles.bismillahContainer}>
          <Text style={styles.bismillah}>{getBasmalahText(true)}</Text>
        </View>
      )}
      
      {/* Visual separator before ayahs */}
      <View style={styles.separator} />
    </View>
  ), [surahMeta, language, t, surahNum, surah]);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: '#0f172a', paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={DarkTheme.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('quran.loading')}</Text>
          <View style={styles.playAllButton} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>{t('quran.loadingSurah')}</Text>
        </View>
      </View>
    );
  }

  if (error || !surah) {
    return (
      <View style={[styles.container, { backgroundColor: '#0f172a', paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={DarkTheme.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('common.error')}</Text>
          <View style={styles.playAllButton} />
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={DarkTheme.textTertiary} />
          <Text style={styles.errorText}>{error || t('quran.errorLoading')}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadSurah}>
            <Text style={styles.retryButtonText}>{t('common.retry')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: '#0f172a', paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={DarkTheme.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {t('quran.surah')} {surahNum}
        </Text>
        <TouchableOpacity 
          onPress={() => {
            if (continuousPlayback) {
              // Stop continuous playback
              setContinuousPlayback(false);
              setCurrentlyPlayingAyah(null);
            } else {
              // Start continuous playback from ayah 1
              setContinuousPlayback(true);
              setCurrentlyPlayingAyah(1);
            }
          }} 
          style={styles.playAllButton}
        >
          <Ionicons 
            name={continuousPlayback ? 'stop-circle' : 'play-circle'} 
            size={28} 
            color="#3b82f6" 
          />
        </TouchableOpacity>
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
    </View>
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
  playAllButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingHorizontal: Spacing.screenPadding,
  },
  
  // Surah Header - Clean & Minimal
  surahHeader: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  surahInfoContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.xs,
  },
  surahNameAr: {
    fontSize: 28,
    fontWeight: Typography.weightBold,
    color: DarkTheme.textPrimary,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  surahNameEn: {
    fontSize: 16,
    fontWeight: Typography.weightSemibold,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  surahMeta: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.4)',
    textAlign: 'center',
    marginTop: Spacing.xs / 2,
  },
  reciter: {
    fontSize: 12,
    color: '#3b82f6',
    textAlign: 'center',
    marginTop: Spacing.xs,
    opacity: 0.8,
  },
  
  // Bismillah - Centered, Elegant
  bismillahContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    marginVertical: Spacing.md,
  },
  bismillah: {
    fontSize: 22,
    fontWeight: Typography.weightBold,
    color: '#3b82f6', // Subtle blue accent
    textAlign: 'center',
    letterSpacing: 1,
  },
  
  // Visual separator
  separator: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  
  // Ayah Wrapper - Contains top row and content
  ayahWrapper: {
    marginBottom: Spacing.xs,
  },

  // Currently playing ayah highlight
  ayahWrapperPlaying: {
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#3b82f6',
  },

  // Ayah Top Row - Number and Audio Player
  ayahTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.xs,
  },

  ayahNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  ayahNumber: {
    fontSize: 18,
    color: '#3b82f6',
    fontWeight: Typography.weightBold,
  },

  // Ayah Container - Clean, Breathable
  ayahContainer: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.03)',
    position: 'relative',
  },
  
  // Arabic Section - Prominent, Full Width
  arabicSection: {
    marginBottom: Spacing.md,
  },
  arabicText: {
    fontSize: 24,
    lineHeight: 48,
    color: DarkTheme.textPrimary,
    textAlign: 'right',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  ayahNumberInline: {
    fontSize: 18,
    color: '#3b82f6',
    fontWeight: Typography.weightBold,
  },
  
  // Translation - Secondary, Clearly Separated
  translationText: {
    fontSize: 15,
    lineHeight: 26,
    color: 'rgba(255, 255, 255, 0.65)',
    textAlign: 'left',
    fontWeight: '400',
    paddingTop: Spacing.sm,
  },
  
  // Bookmark Indicator - Minimal
  bookmarkIndicator: {
    position: 'absolute',
    top: Spacing.md,
    left: 0,
  },
  
  // Loading & Error States
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
    backgroundColor: '#3b82f6',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 15,
    fontWeight: Typography.weightSemibold,
    color: '#fff',
  },
});
