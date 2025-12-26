/**
 * Quran Resonance Service
 * Calculates Qur'anic verse resonance based on numerical value (Kabir)
 * For reflection purposes only - not divination or fortune-telling
 */

import { QURAN_META } from '@/constants/quranMeta';

export type QuranResonance = {
  surahNumber: number;
  surahNameEn: string;
  surahNameAr: string;
  surahNameFr: string;
  ayahNumber: number;
  surahAyahCount: number;
  ayahTextAr: string;
  quranComUrl: string;
};

/**
 * Compute Qur'anic Resonance from Kabir value
 * 
 * Algorithm (matches web implementation):
 * 1. Surah number = kabir % 114 (with 0 mapped to 114)
 * 2. Ayah number = kabir % totalAyahsInSurah (with 0 mapped to last ayah)
 * 
 * @param kabir - The Kabir (grand total) from name calculation
 * @param language - Language for surah name (en/ar/fr)
 * @returns Promise<QuranResonance> with verse details
 */
export async function getQuranResonance(
  kabir: number,
  language: 'en' | 'ar' | 'fr' = 'en'
): Promise<QuranResonance> {
  if (kabir <= 0) {
    throw new Error('Invalid Kabir value - must be positive');
  }

  // Step 1: Calculate Surah number (1-114)
  let surahNumber = kabir % 114;
  if (surahNumber === 0) {
    surahNumber = 114; // An-Nas (last surah)
  }

  // Step 2: Get Surah metadata
  const surahData = QURAN_META[surahNumber];
  if (!surahData) {
    throw new Error(`Surah ${surahNumber} not found in metadata`);
  }

  const totalAyahs = surahData.totalAyahs;

  // Step 3: Calculate Ayah number (1 to totalAyahs)
  let ayahNumber = kabir % totalAyahs;
  if (ayahNumber === 0) {
    ayahNumber = totalAyahs; // Last ayah of the surah
  }

  // Step 4: Fetch Arabic text from Al-Quran Cloud API
  const ayahTextAr = await fetchAyahText(surahNumber, ayahNumber);

  // Step 5: Generate Quran.com link
  const quranComUrl = `https://quran.com/${surahNumber}/${ayahNumber}`;

  // Get French surah name (transliteration for now, can be enhanced)
  const surahNameFr = surahData.name; // Using English transliteration for French

  return {
    surahNumber,
    surahNameEn: surahData.name,
    surahNameAr: surahData.nameAr,
    surahNameFr,
    ayahNumber,
    surahAyahCount: totalAyahs,
    ayahTextAr,
    quranComUrl,
  };
}

/**
 * Fetch Arabic text for a specific ayah from Al-Quran Cloud API
 * Falls back to placeholder if API fails
 */
export async function fetchAyahText(surahNumber: number, ayahNumber: number): Promise<string> {
  try {
    const response = await fetch(
      `https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumber}/ar.asad`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    
    if (data.code === 200 && data.data && data.data.text) {
      return data.data.text;
    }

    throw new Error('Invalid API response format');
  } catch (error) {
    console.warn('[QuranResonance] API fetch failed, using placeholder:', error);
    
    // Fallback: return a respectful placeholder
    return `الآية ${ayahNumber} من سورة ${QURAN_META[surahNumber].nameAr}`;
  }
}

/**
 * Helper function to validate verse reference
 */
export function validateVerseReference(surahNumber: number, ayahNumber: number): boolean {
  if (surahNumber < 1 || surahNumber > 114) return false;
  
  const surahData = QURAN_META[surahNumber];
  if (!surahData) return false;
  
  return ayahNumber >= 1 && ayahNumber <= surahData.totalAyahs;
}
