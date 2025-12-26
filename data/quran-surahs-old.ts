/**
 * Qur'an Dataset
 * 114 Surahs with metadata
 */

export interface Surah {
  number: number;
  nameArabic: string;
  nameTransliteration: string;
  nameEnglish: string;
  nameFrench: string;
  totalAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
  rukus?: number; // Number of rukus (sections)
}

export const QURAN_SURAHS: Surah[] = [
  {
    number: 1,
    nameArabic: 'الفاتحة',
    nameTransliteration: 'Al-Fātiḥah',
    nameEnglish: 'The Opening',
    nameFrench: 'L\'Ouverture',
    totalAyahs: 7,
    revelationType: 'Meccan',
    rukus: 1,
  },
  {
    number: 2,
    nameArabic: 'البقرة',
    nameTransliteration: 'Al-Baqarah',
    nameEnglish: 'The Cow',
    nameFrench: 'La Vache',
    totalAyahs: 286,
    revelationType: 'Medinan',
    rukus: 40,
  },
  {
    number: 3,
    nameArabic: 'آل عمران',
    nameTransliteration: 'Āl ʿImrān',
    nameEnglish: 'The Family of Imran',
    nameFrench: 'La Famille d\'Imran',
    totalAyahs: 200,
    revelationType: 'Medinan',
    rukus: 20,
  },
  {
    number: 4,
    nameArabic: 'النساء',
    nameTransliteration: 'An-Nisā\'',
    nameEnglish: 'The Women',
    nameFrench: 'Les Femmes',
    totalAyahs: 176,
    revelationType: 'Medinan',
    rukus: 24,
  },
  {
    number: 5,
    nameArabic: 'المائدة',
    nameTransliteration: 'Al-Mā\'idah',
    nameEnglish: 'The Table Spread',
    nameFrench: 'La Table Servie',
    totalAyahs: 120,
    revelationType: 'Medinan',
    rukus: 16,
  },
  {
    number: 18,
    nameArabic: 'الكهف',
    nameTransliteration: 'Al-Kahf',
    nameEnglish: 'The Cave',
    nameFrench: 'La Caverne',
    totalAyahs: 110,
    revelationType: 'Meccan',
    rukus: 12,
  },
  {
    number: 36,
    nameArabic: 'يس',
    nameTransliteration: 'Yā-Sīn',
    nameEnglish: 'Ya-Seen',
    nameFrench: 'Ya-Sin',
    totalAyahs: 83,
    revelationType: 'Meccan',
    rukus: 5,
  },
  {
    number: 55,
    nameArabic: 'الرحمن',
    nameTransliteration: 'Ar-Raḥmān',
    nameEnglish: 'The Most Merciful',
    nameFrench: 'Le Tout Miséricordieux',
    totalAyahs: 78,
    revelationType: 'Medinan',
    rukus: 3,
  },
  {
    number: 67,
    nameArabic: 'الملك',
    nameTransliteration: 'Al-Mulk',
    nameEnglish: 'The Sovereignty',
    nameFrench: 'La Royauté',
    totalAyahs: 30,
    revelationType: 'Meccan',
    rukus: 2,
  },
  {
    number: 112,
    nameArabic: 'الإخلاص',
    nameTransliteration: 'Al-Ikhlāṣ',
    nameEnglish: 'The Sincerity',
    nameFrench: 'Le Monothéisme Pur',
    totalAyahs: 4,
    revelationType: 'Meccan',
    rukus: 1,
  },
  {
    number: 113,
    nameArabic: 'الفلق',
    nameTransliteration: 'Al-Falaq',
    nameEnglish: 'The Daybreak',
    nameFrench: 'L\'Aube Naissante',
    totalAyahs: 5,
    revelationType: 'Meccan',
    rukus: 1,
  },
  {
    number: 114,
    nameArabic: 'الناس',
    nameTransliteration: 'An-Nās',
    nameEnglish: 'Mankind',
    nameFrench: 'Les Hommes',
    totalAyahs: 6,
    revelationType: 'Meccan',
    rukus: 1,
  },
];

// Helper functions
export function getSurahByNumber(num: number): Surah | undefined {
  return QURAN_SURAHS.find(surah => surah.number === num);
}

export function getAllSurahs(): Surah[] {
  return QURAN_SURAHS;
}

export function validateAyah(surahNumber: number, ayahNumber: number): boolean {
  const surah = getSurahByNumber(surahNumber);
  if (!surah) return false;
  return ayahNumber >= 1 && ayahNumber <= surah.totalAyahs;
}

export function generateQuranLink(surahNumber: number, ayahNumber: number): string {
  return `https://quran.com/${surahNumber}/${ayahNumber}`;
}

// Note: This is a subset for Phase 2. Full dataset should include all 114 surahs.
// For production, consider using a more complete Qur'an API or dataset.
