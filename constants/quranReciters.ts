/**
 * Quran Reciters
 * Industry-standard reciter list matching top apps (Quran.com, Muslim Pro, etc.)
 *
 * fullSurahBaseUrls — CDN roots for complete surah MP3 files (NNN.mp3 format)
 * everyayahSlug     — Folder slug on everyayah.com for per-ayah fallback
 */

export interface QuranReciter {
  id: string;
  name: string;
  arabicName: string;
  fullSurahBaseUrls: string[];
  everyayahSlug: string; // used as: https://everyayah.com/data/{slug}/SSSAAA.mp3
}

export const QURAN_RECITERS: QuranReciter[] = [
  {
    id: 'alafasy',
    name: 'Mishary Alafasy',
    arabicName: 'مشاري راشد العفاسي',
    fullSurahBaseUrls: [
      'https://server8.mp3quran.net/afs',
      'https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee',
    ],
    everyayahSlug: 'Alafasy_128kbps',
  },
  {
    id: 'husary',
    name: 'Mahmoud Al-Husary',
    arabicName: 'محمود خليل الحصري',
    fullSurahBaseUrls: [
      'https://server13.mp3quran.net/husr',
      'https://download.quranicaudio.com/quran/mahmood_khaleel_al-husaree',
    ],
    everyayahSlug: 'Husary_128kbps',
  },
  {
    id: 'abdulbasit',
    name: 'Abdul Basit Abd us-Samad',
    arabicName: 'عبد الباسط عبد الصمد',
    fullSurahBaseUrls: [
      'https://server7.mp3quran.net/basit',
      'https://download.quranicaudio.com/quran/abdulbaset_abdulsamad_mujawwad',
    ],
    everyayahSlug: 'Abdul_Basit_Murattal_192kbps',
  },
  {
    id: 'sudais',
    name: 'Abdul Rahman Al-Sudais',
    arabicName: 'عبدالرحمن السديس',
    fullSurahBaseUrls: [
      'https://server11.mp3quran.net/sds',
      'https://download.quranicaudio.com/quran/abdurrahmaan_as-sudais',
    ],
    everyayahSlug: 'Abdurrahmaan_As-Sudais_192kbps',
  },
  {
    id: 'minshawi',
    name: 'Mohamed Al-Minshawi',
    arabicName: 'محمد صديق المنشاوي',
    fullSurahBaseUrls: [
      'https://server10.mp3quran.net/minsh',
      'https://download.quranicaudio.com/quran/muhammad_siddeeq_al-minshaawee',
    ],
    everyayahSlug: 'Minshawi_Murattal_128kbps',
  },
];

export const DEFAULT_RECITER_ID = 'alafasy';

export function getReciterById(id: string): QuranReciter {
  return QURAN_RECITERS.find(r => r.id === id) ?? QURAN_RECITERS[0];
}
