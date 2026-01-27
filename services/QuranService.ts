/**
 * Quran Service
 * Fetch and cache complete Quran text with translations from Alquran Cloud API
 * 
 * API Documentation: https://alquran.cloud/api
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    CachedSurah,
    QuranAPIResponse,
    QuranAyahWithTranslation,
    QuranBookmark,
    QuranReadingProgress,
    QuranSurah,
    QuranTranslationEdition
} from '../types/quran';

const API_BASE_URL = 'https://api.alquran.cloud/v1';
const CACHE_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days
const STORAGE_KEY_PREFIX = 'quran_surah_';
const STORAGE_KEY_BOOKMARKS = 'quran_bookmarks';
const STORAGE_KEY_PROGRESS = 'quran_progress';

/**
 * Fetch a surah with Arabic text and translation
 */
export async function fetchSurah(
  surahNumber: number,
  translationEdition: QuranTranslationEdition = 'en.sahih'
): Promise<QuranSurah> {
  // Check cache first
  const cached = await getCachedSurah(surahNumber, translationEdition);
  if (cached) {
    return cached;
  }

  try {
    // Fetch both Arabic and translation in one request
    const url = `${API_BASE_URL}/surah/${surahNumber}/editions/quran-uthmani,${translationEdition}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch surah ${surahNumber}: ${response.statusText}`);
    }

    const data: QuranAPIResponse = await response.json();

    if (data.code !== 200 || !data.data || data.data.length !== 2) {
      throw new Error('Invalid API response');
    }

    const [arabicData, translationData] = data.data;

    // Combine Arabic and translation
    const ayahs: QuranAyahWithTranslation[] = arabicData.ayahs.map((arabicAyah, index) => ({
      arabic: arabicAyah,
      translation: translationData.ayahs[index],
      numberInSurah: arabicAyah.numberInSurah,
    }));

    const surah: QuranSurah = {
      number: arabicData.number,
      name: arabicData.name,
      englishName: arabicData.englishName,
      englishNameTranslation: arabicData.englishNameTranslation,
      revelationType: arabicData.revelationType,
      numberOfAyahs: arabicData.numberOfAyahs,
      ayahs,
    };

    // Cache the result
    await cacheSurah(surah, translationEdition);

    return surah;
  } catch (error) {
    console.error('Error fetching surah:', error);
    throw error;
  }
}

/**
 * Get cached surah if available and not expired
 */
async function getCachedSurah(
  surahNumber: number,
  edition: QuranTranslationEdition
): Promise<QuranSurah | null> {
  try {
    const key = `${STORAGE_KEY_PREFIX}${surahNumber}_${edition}`;
    const cached = await AsyncStorage.getItem(key);
    
    if (!cached) {
      return null;
    }

    const cachedData: CachedSurah = JSON.parse(cached);
    const now = Date.now();

    // Check if cache is expired
    if (now - cachedData.timestamp > CACHE_DURATION) {
      await AsyncStorage.removeItem(key);
      return null;
    }

    return cachedData.surah;
  } catch (error) {
    console.error('Error reading cache:', error);
    return null;
  }
}

/**
 * Cache a surah
 */
async function cacheSurah(
  surah: QuranSurah,
  edition: QuranTranslationEdition
): Promise<void> {
  try {
    const key = `${STORAGE_KEY_PREFIX}${surah.number}_${edition}`;
    const cacheData: CachedSurah = {
      surah,
      timestamp: Date.now(),
      edition,
    };
    await AsyncStorage.setItem(key, JSON.stringify(cacheData));
  } catch (error) {
    const errorMsg = (error as any)?.message || '';
    if (errorMsg.includes('SQLITE_FULL') || errorMsg.includes('disk is full')) {
      console.warn('Surah cache failed: disk full, continuing without caching');
      // Continue without caching
    } else {
      console.error('Error caching surah:', error);
    }
  }
}

/**
 * Clear all cached surahs
 */
export async function clearQuranCache(): Promise<void> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const quranKeys = keys.filter(key => key.startsWith(STORAGE_KEY_PREFIX));
    await AsyncStorage.multiRemove(quranKeys);
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
}

/**
 * Get all bookmarks
 */
export async function getBookmarks(): Promise<QuranBookmark[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY_BOOKMARKS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading bookmarks:', error);
    return [];
  }
}

/**
 * Add a bookmark
 */
export async function addBookmark(bookmark: Omit<QuranBookmark, 'id' | 'createdAt'>): Promise<void> {
  try {
    const bookmarks = await getBookmarks();
    
    // Check if already bookmarked
    const exists = bookmarks.some(
      b => b.surahNumber === bookmark.surahNumber && b.ayahNumber === bookmark.ayahNumber
    );
    
    if (exists) {
      return;
    }

    const newBookmark: QuranBookmark = {
      ...bookmark,
      id: `${bookmark.surahNumber}-${bookmark.ayahNumber}-${Date.now()}`,
      createdAt: Date.now(),
    };

    bookmarks.push(newBookmark);
    await AsyncStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(bookmarks));
  } catch (error) {
    console.error('Error adding bookmark:', error);
    throw error;
  }
}

/**
 * Remove a bookmark
 */
export async function removeBookmark(id: string): Promise<void> {
  try {
    const bookmarks = await getBookmarks();
    const filtered = bookmarks.filter(b => b.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error removing bookmark:', error);
    throw error;
  }
}

/**
 * Check if an ayah is bookmarked
 */
export async function isBookmarked(surahNumber: number, ayahNumber: number): Promise<boolean> {
  try {
    const bookmarks = await getBookmarks();
    return bookmarks.some(
      b => b.surahNumber === surahNumber && b.ayahNumber === ayahNumber
    );
  } catch (error) {
    console.error('Error checking bookmark:', error);
    return false;
  }
}

/**
 * Save reading progress
 */
export async function saveProgress(surahNumber: number, ayahNumber: number): Promise<void> {
  try {
    const progress: QuranReadingProgress = {
      lastSurah: surahNumber,
      lastAyah: ayahNumber,
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving progress:', error);
  }
}

/**
 * Get reading progress
 */
export async function getProgress(): Promise<QuranReadingProgress | null> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY_PROGRESS);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading progress:', error);
    return null;
  }
}

/**
 * Search for ayahs containing a keyword (requires fetching all surahs)
 * This is a basic implementation - for production, use API search endpoint
 */
export async function searchQuran(
  keyword: string,
  translationEdition: QuranTranslationEdition = 'en.sahih'
): Promise<{ surahNumber: number; ayahNumber: number; text: string; translation: string }[]> {
  // For now, return empty - this would require fetching all surahs
  // or using a dedicated search API endpoint
  console.warn('Search not yet implemented - requires full Quran download or API search');
  return [];
}
