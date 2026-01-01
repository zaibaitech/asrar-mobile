/**
 * Quran Types and Interfaces
 * Complete type definitions for Quran data from Alquran Cloud API
 */

export interface QuranAyah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean | {
    id: number;
    recommended: boolean;
    obligatory: boolean;
  };
}

export interface QuranAyahWithTranslation {
  arabic: QuranAyah;
  translation: QuranAyah;
  numberInSurah: number;
}

export interface QuranSurah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: 'Meccan' | 'Medinan';
  numberOfAyahs: number;
  ayahs: QuranAyahWithTranslation[];
}

export interface QuranEdition {
  identifier: string;
  language: string;
  name: string;
  englishName: string;
  format: string;
  type: string;
  direction: 'rtl' | 'ltr';
}

export interface QuranAPIResponse {
  code: number;
  status: string;
  data: {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    revelationType: 'Meccan' | 'Medinan';
    numberOfAyahs: number;
    ayahs: QuranAyah[];
    edition: QuranEdition;
  }[];
}

export interface CachedSurah {
  surah: QuranSurah;
  timestamp: number;
  edition: string;
}

export interface QuranBookmark {
  id: string;
  surahNumber: number;
  ayahNumber: number;
  surahName: string;
  ayahText: string;
  translation: string;
  createdAt: number;
  note?: string;
}

export interface QuranReadingProgress {
  lastSurah: number;
  lastAyah: number;
  timestamp: number;
}

export type QuranTranslationEdition = 'en.sahih' | 'fr.hamidullah';

export const QURAN_EDITIONS: Record<QuranTranslationEdition, QuranEdition> = {
  'en.sahih': {
    identifier: 'en.sahih',
    language: 'en',
    name: 'Saheeh International',
    englishName: 'Saheeh International',
    format: 'text',
    type: 'translation',
    direction: 'ltr',
  },
  'fr.hamidullah': {
    identifier: 'fr.hamidullah',
    language: 'fr',
    name: 'Muhammad Hamidullah',
    englishName: 'Muhammad Hamidullah',
    format: 'text',
    type: 'translation',
    direction: 'ltr',
  },
};
