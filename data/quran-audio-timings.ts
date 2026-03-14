/**
 * Quran Audio Timing Data
 * Maps ayah numbers to their start times (in seconds) within full surah audio files
 * 
 * Reciter: Mishary Rashid Alafasy
 * Source: Derived from segmented audio files
 * 
 * Format:
 * {
 *   surahNumber: {
 *     duration: total_surah_duration_seconds,
 *     ayahTimings: { ayahNumber: startTimeInSeconds }
 *   }
 * }
 * 
 * Note: This data can be fetched dynamically from APIs like:
 * - https://api.alquran.cloud/v1/surah/{number}/mishary
 * - Or pre-computed from individual ayah audio files
 */

export interface SurahAudioTiming {
  duration: number; // Total surah duration in seconds
  ayahTimings: { [ayahNumber: number]: number }; // Start time for each ayah
}

export interface QuranAudioTimings {
  [surahNumber: number]: SurahAudioTiming;
}

/**
 * Timing data for popular surahs (will be expanded)
 * These are approximate timings - can be refined with actual analysis
 */
export const QURAN_AUDIO_TIMINGS: Partial<QuranAudioTimings> = {
  // Al-Fatihah (very short, ~30 seconds total)
  1: {
    duration: 32,
    ayahTimings: {
      1: 0,    // Bismillah
      2: 6,    // Alhamdulillahi rabbil 'alamin
      3: 11,   // Ar-Rahman ar-Rahim
      4: 15,   // Maliki yawmid-din
      5: 19,   // Iyyaka na'budu wa iyyaka nasta'in
      6: 23,   // Ihdinas-siratal-mustaqim
      7: 27,   // Siratal-ladhina...
    },
  },
  // Al-Baqarah timing will be fetched dynamically (too long to hardcode)
  // Al-Ikhlas (very short, ~10 seconds)
  112: {
    duration: 12,
    ayahTimings: {
      1: 0,    // Qul huwa Allahu ahad
      2: 3,    // Allahu samad
      3: 6,    // Lam yalid wa lam yulad
      4: 9,    // Wa lam yakun lahu kufuwan ahad
    },
  },
};

/**
 * Get timing data for a surah
 * Returns null if timing data needs to be fetched/computed
 */
export function getSurahAudioTiming(surahNumber: number): SurahAudioTiming | null {
  return QURAN_AUDIO_TIMINGS[surahNumber] || null;
}

/**
 * Calculate approximate ayah duration
 */
export function getAyahDuration(surahNumber: number, ayahNumber: number): number | null {
  const timing = getSurahAudioTiming(surahNumber);
  if (!timing) return null;

  const startTime = timing.ayahTimings[ayahNumber];
  const nextAyahTime = timing.ayahTimings[ayahNumber + 1];

  if (startTime === undefined) return null;
  if (nextAyahTime === undefined) {
    // Last ayah - duration is from start to end of surah
    return timing.duration - startTime;
  }

  return nextAyahTime - startTime;
}

/**
 * Full surah audio URL (Alafasy recitation)
 * Source: Multiple CDNs with fallback
 */
export const FULL_SURAH_AUDIO_SOURCES = [
  'https://server8.mp3quran.net/afs', // Alafasy 128kbps
  'https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee',
];

/**
 * Get full surah audio URL with proper formatting
 */
export function getFullSurahAudioUrl(surahNumber: number, sourceIndex: number = 0): string {
  const baseUrl = FULL_SURAH_AUDIO_SOURCES[sourceIndex];
  const paddedNumber = String(surahNumber).padStart(3, '0');
  return `${baseUrl}/${paddedNumber}.mp3`;
}
