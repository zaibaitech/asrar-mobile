/**
 * Quran Bookmarks Screen
 * Display all saved bookmarks
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
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
import { getBookmarks, removeBookmark } from '../../services/QuranService';
import { QuranBookmark } from '../../types/quran';

export default function QuranBookmarksScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const [bookmarks, setBookmarks] = useState<QuranBookmark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    try {
      const data = await getBookmarks();
      setBookmarks(data.sort((a, b) => b.createdAt - a.createdAt));
    } catch (err) {
      console.error('Error loading bookmarks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookmark: QuranBookmark) => {
    Alert.alert(
      t('quran.removeBookmark'),
      t('quran.removeBookmarkConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.remove'),
          style: 'destructive',
          onPress: async () => {
            try {
              await removeBookmark(bookmark.id);
              setBookmarks(prev => prev.filter(b => b.id !== bookmark.id));
            } catch (err) {
              Alert.alert(t('common.error'), t('quran.bookmarkError'));
            }
          },
        },
      ]
    );
  };

  const handleBookmarkPress = (bookmark: QuranBookmark) => {
    router.push({
      pathname: '/quran/[surahNumber]',
      params: {
        surahNumber: bookmark.surahNumber.toString(),
        scrollToAyah: bookmark.ayahNumber.toString(),
      },
    });
  };

  const renderBookmark = useCallback(({ item }: { item: QuranBookmark }) => (
    <TouchableOpacity
      style={styles.bookmarkCard}
      onPress={() => handleBookmarkPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.bookmarkContent}>
        <View style={styles.bookmarkHeader}>
          <Text style={styles.bookmarkLocation}>
            {item.surahName} · {t('quran.ayah')} {item.ayahNumber}
          </Text>
          <TouchableOpacity
            onPress={() => handleDelete(item)}
            style={styles.deleteButton}
          >
            <Ionicons name="trash-outline" size={18} color="#ef4444" />
          </TouchableOpacity>
        </View>

        <Text style={styles.arabicText} numberOfLines={2}>
          {item.ayahText}
        </Text>

        <Text style={styles.translationText} numberOfLines={2}>
          {item.translation}
        </Text>

        {item.note && (
          <Text style={styles.noteText} numberOfLines={1}>
            📝 {item.note}
          </Text>
        )}

        <Text style={styles.dateText}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  ), [handleBookmarkPress, handleDelete, t]);

  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="bookmarks-outline" size={64} color={DarkTheme.textTertiary} />
      <Text style={styles.emptyTitle}>{t('quran.noBookmarks')}</Text>
      <Text style={styles.emptyText}>{t('quran.noBookmarksDesc')}</Text>
    </View>
  );

  return (
    <LinearGradient
      colors={['#0f172a', '#1e1b4b', '#1A1625']}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={DarkTheme.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('quran.bookmarks')}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <FlatList
        data={bookmarks}
        renderItem={renderBookmark}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={ListEmptyComponent}
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
    paddingTop: Spacing.md,
  },
  bookmarkCard: {
    marginBottom: Spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  bookmarkContent: {
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  bookmarkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookmarkLocation: {
    fontSize: 14,
    fontWeight: Typography.weightSemibold,
    color: '#10b981',
  },
  deleteButton: {
    padding: Spacing.xs,
  },
  arabicText: {
    fontSize: 18,
    lineHeight: 32,
    color: DarkTheme.textPrimary,
    textAlign: 'right',
  },
  translationText: {
    fontSize: 14,
    lineHeight: 22,
    color: DarkTheme.textSecondary,
  },
  noteText: {
    fontSize: 13,
    color: DarkTheme.textTertiary,
    fontStyle: 'italic',
  },
  dateText: {
    fontSize: 12,
    color: DarkTheme.textTertiary,
    marginTop: Spacing.xs,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.screenPadding * 2,
    paddingTop: 100,
    gap: Spacing.md,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: Typography.weightBold,
    color: DarkTheme.textPrimary,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: DarkTheme.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
