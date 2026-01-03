/**
 * Quran Resonance Service
 * Calculates Qur'anic verse resonance based on numerical value (Kabir)
 * For reflection purposes only - not divination or fortune-telling
 */

import { QURAN_META } from '@/constants/quranMeta';
import { shouldStripBasmalah, startsWithBasmalah, stripLeadingBasmalah } from '@/utils/basmalah';

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
 * 
 * IMPORTANT: This function returns the RAW ayah text from the API.
 * For calculator purposes, Basmalah should be stripped from Ayah 1
 * using the stripLeadingBasmalah() utility when needed.
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
 * Fetch ayah text for calculation purposes
 * Automatically strips Basmalah from Ayah 1 (except for special cases)
 * 
 * STRIPPING RULES:
 * - Surah 9: No Basmalah (return as-is)
 * - Surah 27, Ayah 30: Contains Basmalah inside verse (do NOT strip)
 * - Other surahs, Ayah 1: Strip Basmalah if present
 * - Ayah 2+: Return as-is
 * 
 * Use this for calculator calculations to get ONLY the ayah content.
 * 
 * @param surahNumber - Surah number (1-114)
 * @param ayahNumber - Ayah number
 * @returns Promise<string> - Clean ayah text for calculation
 */
export async function fetchAyahTextForCalculation(
  surahNumber: number, 
  ayahNumber: number
): Promise<string> {
  const rawText = await fetchAyahText(surahNumber, ayahNumber);
  
  // Check if we should strip Basmalah from this ayah
  if (shouldStripBasmalah(surahNumber, ayahNumber)) {
    if (startsWithBasmalah(rawText)) {
      const stripped = stripLeadingBasmalah(rawText);
      
      // Debug: Warn if stripping seems incomplete
      if (stripped.includes('الرحمن') || stripped.includes('الرحيم')) {
        console.warn(
          `[QuranResonance] Potential incomplete Basmalah stripping in ${surahNumber}:${ayahNumber}`,
          { original: rawText.substring(0, 100), stripped: stripped.substring(0, 100) }
        );
      }
      
      return stripped;
    }
  }
  
  return rawText;
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
