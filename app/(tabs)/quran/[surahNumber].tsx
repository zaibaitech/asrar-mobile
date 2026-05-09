/**
 * Surah Detail Screen
 * Display full surah with Arabic text, translation, and audio playback
 */

import { AyahAudioButton } from '@/components/quran/AyahAudioButton';
import { ShareAyahModal } from '@/components/quran/ShareAyahModal';
import { DarkTheme, Spacing, Typography } from '@/constants/DarkTheme';
import { DEFAULT_RECITER_ID, QURAN_RECITERS } from '@/constants/quranReciters';
import { useLanguage } from '@/contexts/LanguageContext';
import { QURAN_SURAHS } from '@/data/quran-surahs';
import { useSurahAudio } from '@/hooks/useSurahAudio';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function getShareLocale(language: 'en' | 'fr' | 'ar'): 'en' | 'fr' | 'ar' {
  switch (language) {
    case 'ar':
      return 'ar';
    case 'fr':
      return 'fr';
    default:
      return 'en';
  }
}

function getLocalizedSurahName(
  language: 'en' | 'fr' | 'ar',
  surahMeta: (typeof QURAN_SURAHS)[number] | undefined,
  fallback = ''
): string {
  if (language === 'ar') {
    return surahMeta?.name.arabic || surahMeta?.name.en || fallback;
  }

  if (language === 'fr') {
    return surahMeta?.name.fr || surahMeta?.name.en || fallback;
  }

  return surahMeta?.name.en || fallback;
}

export default function SurahDetailScreen() {
  const { surahNumber, scrollToAyah, autoPlay } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t, tSafe, language } = useLanguage();
  const flatListRef = useRef<FlatList>(null);

  const [surah, setSurah] = useState<QuranSurah | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookmarkedAyahs, setBookmarkedAyahs] = useState<Set<number>>(new Set());
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);
  const [selectedAyahForShare, setSelectedAyahForShare] = useState<{
    ayahNumber: number;
    arabicText: string;
    translation: string;
  } | null>(null);

  // Reader preferences
  const FONT_SIZES = [20, 24, 28, 32] as const;
  const [fontSizeIndex, setFontSizeIndex] = useState(1); // default 24
  const arabicFontSize = FONT_SIZES[fontSizeIndex];
  const [selectedReciterId, setSelectedReciterId] = useState(DEFAULT_RECITER_ID);
  const [isReciterPickerVisible, setIsReciterPickerVisible] = useState(false);

  const surahNum = Number.parseInt(surahNumber as string, 10);
  const surahMeta = QURAN_SURAHS[surahNum - 1];
  const translationEdition: QuranTranslationEdition = language === 'fr' ? 'fr.hamidullah' : 'en.sahih';
  const shareLocale = getShareLocale(language);
  const localizedSurahName = useMemo(
    () => getLocalizedSurahName(language, surahMeta, surah?.englishName || ''),
    [language, surahMeta, surah?.englishName]
  );

  // Audio controller hook - loads full surah audio once
  const { state: audioState, controls: audioControls } = useSurahAudio(
    surahNum,
    surahMeta?.totalAyahs || 0,
    selectedReciterId
  );

  // Load surah data
  useEffect(() => {
    loadSurah();
    loadBookmarks();
  }, [surahNum, translationEdition]);

  // Load persisted reciter preference
  useEffect(() => {
    AsyncStorage.getItem('quran_reciter_id').then(id => {
      if (id) setSelectedReciterId(id);
    }).catch(() => {});
  }, []);

  // Scroll to specific ayah if provided
  useEffect(() => {
    if (surah && scrollToAyah && flatListRef.current) {
      const ayahIndex = Number.parseInt(scrollToAyah as string, 10) - 1;
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: ayahIndex,
          animated: true,
          viewPosition: 0.2,
        });
      }, 500);
    }
  }, [surah, scrollToAyah]);

  // Auto-start playback if autoPlay param is set
  useEffect(() => {
    if (surah && autoPlay === 'true') {
      setTimeout(() => {
        audioControls.playAyah(1);
      }, 300);
    }
  }, [surah]);

  // Auto-scroll to the currently playing ayah
  useEffect(() => {
    if (audioState.currentAyah && flatListRef.current && surah) {
      const index = audioState.currentAyah - 1;
      if (index >= 0 && index < surah.ayahs.length) {
        flatListRef.current.scrollToIndex({ index, animated: true, viewPosition: 0.3 });
      }
    }
  }, [audioState.currentAyah, surah]);

  const selectReciter = async (id: string) => {
    setSelectedReciterId(id);
    setIsReciterPickerVisible(false);
    try { await AsyncStorage.setItem('quran_reciter_id', id); } catch { /* non-critical */ }
  };

  const goToPrevSurah = () => {
    if (surahNum > 1) {
      audioControls.stop();
      router.replace({ pathname: '/(tabs)/quran/[surahNumber]', params: { surahNumber: String(surahNum - 1) } });
    }
  };

  const goToNextSurah = () => {
    if (surahNum < 114) {
      audioControls.stop();
      router.replace({ pathname: '/(tabs)/quran/[surahNumber]', params: { surahNumber: String(surahNum + 1) } });
    }
  };


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
      console.error('Error toggling bookmark:', err);
      Alert.alert(t('common.error'), t('quran.bookmarkError'));
    }
  };

  const handleAyahPress = (ayah: QuranAyahWithTranslation) => {
    saveProgress(surahNum, ayah.numberInSurah);
  };

  const handleShareAyah = (ayah: QuranAyahWithTranslation) => {
    setSelectedAyahForShare({
      ayahNumber: ayah.numberInSurah,
      arabicText: getCleanArabicText(ayah),
      translation: ayah.translation.text,
    });
    setIsShareModalVisible(true);
  };

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

  const renderAyah = useCallback((ayahEntry: any) => {
    const ayah = ayahEntry.item as QuranAyahWithTranslation;
    const isBookmarked = bookmarkedAyahs.has(ayah.numberInSurah);
    const isCurrentAyah = audioState.currentAyah === ayah.numberInSurah;
    const cleanArabicText = getCleanArabicText(ayah);

    return (
      <TouchableOpacity
        style={styles.ayahContainer}
        onPress={() => handleAyahPress(ayah)}
        onLongPress={() => handleBookmarkToggle(ayah)}
        activeOpacity={0.9}
      >
        {/* Arabic Text - Full width, prominent */}
        <View style={styles.arabicSection}>
          <Text style={[styles.arabicText, { fontSize: arabicFontSize, lineHeight: arabicFontSize * 2 }]}>
            {cleanArabicText}
            {' '}
            <Text style={[styles.ayahNumberInline, { fontSize: arabicFontSize - 6 }]}>﴿{ayah.numberInSurah}﴾</Text>
          </Text>
        </View>

        {/* Translation - Secondary, clearly separated */}
        <Text style={[styles.translationText, { fontSize: Math.max(13, arabicFontSize - 9) }]}>{ayah.translation.text}</Text>

        {/* Sajda indicator */}
        {ayah.arabic.sajda !== false && (
          <View style={styles.sajdaIndicator}>
            <Ionicons name="chevron-down-circle-outline" size={12} color="#f59e0b" />
            <Text style={styles.sajdaText}>{tSafe('quran.sajda', 'Sajda')}</Text>
          </View>
        )}

        {/* Audio Button and Bookmark Row */}
        <View style={styles.ayahActionsRow}>
          <View style={styles.primaryAyahActions}>
            <AyahAudioButton
              ayahNumber={ayah.numberInSurah}
              isPlaying={audioState.isPlaying}
              isCurrentAyah={isCurrentAyah}
              onPlay={() => audioControls.playAyah(ayah.numberInSurah)}
              onPause={audioControls.pause}
            />

            <TouchableOpacity
              style={styles.shareButton}
              activeOpacity={0.7}
              onPress={() => handleShareAyah(ayah)}
              accessibilityRole="button"
              accessibilityLabel={t('quran.shareAyah')}
            >
              <Ionicons name="share-social-outline" size={18} color={DarkTheme.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Bookmark indicator */}
          {isBookmarked && (
            <View style={styles.bookmarkIndicator}>
              <Ionicons name="bookmark" size={14} color="#3b82f6" />
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }, [bookmarkedAyahs, audioState.currentAyah, audioState.isPlaying, audioControls, handleBookmarkToggle, handleAyahPress, t]);

  const ListHeaderComponent = useMemo(() => (
    <View style={styles.surahHeader}>
      {/* Clean Surah Info Header - Minimal, Informational */}
      <View style={styles.surahInfoContainer}>
        <Text style={styles.surahNameAr}>{surahMeta?.name.arabic}</Text>
        <Text style={styles.surahNameEn}>
          {localizedSurahName}
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

      {/* Continuous Playback Toggle */}
      <TouchableOpacity
        style={styles.continuousPlaybackToggle}
        onPress={audioControls.toggleContinuous}
      >
        <Ionicons
          name={audioControls.isContinuous ? 'repeat' : 'repeat-outline'}
          size={20}
          color={audioControls.isContinuous ? '#3b82f6' : DarkTheme.textTertiary}
        />
        <Text style={[
          styles.continuousPlaybackText,
          audioControls.isContinuous && styles.continuousPlaybackTextActive
        ]}>
          {t('quran.continuousPlayback')}
        </Text>
      </TouchableOpacity>

      {/* Audio Loading Indicator */}
      {audioState.isLoading && (
        <View style={styles.audioLoadingContainer}>
          <ActivityIndicator size="small" color="#3b82f6" />
          <Text style={styles.audioLoadingText}>{tSafe('quran.loadingSurahAudio', 'Loading surah audio...')}</Text>
        </View>
      )}

      {/* Audio Error */}
      {audioState.error && (
        <View style={styles.audioErrorContainer}>
          <Text style={styles.audioErrorText}>{audioState.error}</Text>
        </View>
      )}

      {/* Bismillah - Centered, Elegant (except for Surah 9 / At-Tawbah) */}
      {shouldDisplayBasmalah(surahNum) && (
        <View style={styles.bismillahContainer}>
          <Text style={styles.bismillah}>{getBasmalahText(true)}</Text>
        </View>
      )}
      
      {/* Visual separator before ayahs */}
      <View style={styles.separator} />
    </View>
  ), [localizedSurahName, surahMeta, t, surahNum, audioControls, audioState.isLoading, audioState.error]);

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
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerIconButton}
            onPress={() => setFontSizeIndex(prev => (prev + 1) % FONT_SIZES.length)}
            accessibilityLabel={tSafe('quran.changeFontSize', 'Change font size')}
          >
            <Text style={styles.headerIconText}>Aa</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerIconButton}
            onPress={() => setIsReciterPickerVisible(true)}
            accessibilityLabel={tSafe('quran.chooseReciter', 'Choose reciter')}
          >
            <Ionicons name="musical-notes-outline" size={20} color={DarkTheme.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (audioState.isPlaying) {
                audioControls.pause();
              } else {
                audioControls.playAyah(audioState.currentAyah || 1);
              }
            }}
            style={styles.headerIconButton}
          >
            <Ionicons
              name={audioState.isPlaying ? 'stop-circle' : 'play-circle'}
              size={24}
              color="#3b82f6"
            />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={surah.ayahs}
        renderItem={renderAyah}
        keyExtractor={(item) => item.numberInSurah.toString()}
        ListHeaderComponent={ListHeaderComponent}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + Spacing.xl + (audioState.isPlaying || audioState.isLoading ? 80 : 0) }
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

      {/* Mini Audio Player - Floats at bottom when audio is active */}
      {(audioState.isPlaying || audioState.isLoading || audioState.currentAyah) && (
        <View style={[styles.miniPlayer, { bottom: insets.bottom }]}>
          <View style={styles.miniPlayerContent}>
            {/* Current Ayah Info */}
            <View style={styles.miniPlayerInfo}>
              <Text style={styles.miniPlayerTitle}>
                {t('quran.surah')} {surahNum} · {t('quran.ayah')} {audioState.currentAyah || 1}
              </Text>
              <Text style={styles.miniPlayerSubtitle}>
                {audioState.isLoading ? tSafe('quran.loading', 'Loading...') : localizedSurahName}
              </Text>
            </View>

            {/* Playback Controls */}
            <View style={styles.miniPlayerControls}>
              {audioState.isLoading ? (
                <ActivityIndicator size="small" color="#3b82f6" />
              ) : (
                <>
                  <TouchableOpacity onPress={goToPrevSurah} disabled={surahNum <= 1} style={styles.miniPlayerButton}>
                    <Ionicons name="play-skip-back" size={18} color={surahNum <= 1 ? DarkTheme.textTertiary : DarkTheme.textPrimary} />
                  </TouchableOpacity>
                  {audioState.isPlaying ? (
                    <TouchableOpacity onPress={audioControls.pause} style={styles.miniPlayerButton}>
                      <Ionicons name="pause" size={24} color={DarkTheme.textPrimary} />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity onPress={audioControls.resume} style={styles.miniPlayerButton}>
                      <Ionicons name="play" size={24} color={DarkTheme.textPrimary} />
                    </TouchableOpacity>
                  )}
                  
                  <TouchableOpacity onPress={audioControls.stop} style={styles.miniPlayerButton}>
                    <Ionicons name="stop" size={24} color={DarkTheme.textPrimary} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={goToNextSurah} disabled={surahNum >= 114} style={styles.miniPlayerButton}>
                    <Ionicons name="play-skip-forward" size={18} color={surahNum >= 114 ? DarkTheme.textTertiary : DarkTheme.textPrimary} />
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </View>
      )}

      {/* Reciter Picker Modal */}
      <Modal
        visible={isReciterPickerVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsReciterPickerVisible(false)}
      >
        <View style={styles.reciterOverlay}>
          <Pressable style={styles.reciterBackdrop} onPress={() => setIsReciterPickerVisible(false)} />
          <View style={[styles.reciterSheet, { paddingBottom: insets.bottom + Spacing.md }]}>
            <Text style={styles.reciterSheetTitle}>{tSafe('quran.chooseReciter', 'Choose Reciter')}</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {QURAN_RECITERS.map(reciter => (
                <TouchableOpacity
                  key={reciter.id}
                  style={[styles.reciterOption, selectedReciterId === reciter.id && styles.reciterOptionSelected]}
                  onPress={() => selectReciter(reciter.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.reciterOptionInfo}>
                    <Text style={styles.reciterOptionArabic}>{reciter.arabicName}</Text>
                    <Text style={styles.reciterOptionName}>{reciter.name}</Text>
                  </View>
                  {selectedReciterId === reciter.id && (
                    <Ionicons name="checkmark-circle" size={22} color="#3b82f6" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <ShareAyahModal
        visible={isShareModalVisible && !!selectedAyahForShare}
        onClose={() => setIsShareModalVisible(false)}
        surahNumber={surahNum}
        surahName={localizedSurahName}
        ayahNumber={selectedAyahForShare?.ayahNumber || 1}
        arabicText={selectedAyahForShare?.arabicText || ''}
        translation={selectedAyahForShare?.translation || ''}
        locale={shareLocale}
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  headerIconButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  headerIconText: {
    fontSize: 13,
    fontWeight: Typography.weightSemibold,
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
  
  // Continuous Playback Toggle
  continuousPlaybackToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
    marginVertical: Spacing.sm,
  },
  continuousPlaybackText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  continuousPlaybackTextActive: {
    color: '#3b82f6',
    fontWeight: Typography.weightSemibold,
  },
  
  // Audio Loading
  audioLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 8,
    marginVertical: Spacing.sm,
  },
  audioLoadingText: {
    fontSize: 13,
    color: '#3b82f6',
  },
  
  // Audio Error
  audioErrorContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 8,
    marginVertical: Spacing.sm,
  },
  audioErrorText: {
    fontSize: 12,
    color: '#ef4444',
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
  
  // Ayah Actions Row (Audio + Bookmark)
  ayahActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
  },
  primaryAyahActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  shareButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: DarkTheme.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: DarkTheme.borderSubtle,
  },
  
  // Bookmark Indicator - Minimal
  bookmarkIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
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
  
  // Mini Audio Player - Floating at Bottom
  miniPlayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.98)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(59, 130, 246, 0.3)',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.screenPadding,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  miniPlayerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  miniPlayerInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  miniPlayerTitle: {
    fontSize: 14,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
    marginBottom: 2,
  },
  miniPlayerSubtitle: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
  },
  miniPlayerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  miniPlayerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Sajda indicator
  sajdaIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing.xs,
    marginBottom: 2,
  },
  sajdaText: {
    fontSize: 11,
    color: '#f59e0b',
    fontWeight: Typography.weightSemibold,
    letterSpacing: 0.5,
  },

  // Reciter Picker Modal
  reciterOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  reciterBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  reciterSheet: {
    backgroundColor: '#1e293b',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: Spacing.lg,
    paddingHorizontal: Spacing.screenPadding,
    maxHeight: '60%',
  },
  reciterSheetTitle: {
    fontSize: 16,
    fontWeight: Typography.weightBold,
    color: DarkTheme.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  reciterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  reciterOptionSelected: {
    backgroundColor: 'rgba(59,130,246,0.08)',
    borderRadius: 10,
    paddingHorizontal: Spacing.sm,
    marginHorizontal: -Spacing.sm,
  },
  reciterOptionInfo: {
    gap: 2,
  },
  reciterOptionArabic: {
    fontSize: 16,
    color: DarkTheme.textPrimary,
    fontWeight: Typography.weightSemibold,
    textAlign: 'right',
  },
  reciterOptionName: {
    fontSize: 13,
    color: DarkTheme.textSecondary,
  },
});
