/**
 * Qur'anic Resonance - Connecting Hadad (name value) to Qur'anic structure
 * Based on numerical harmony between a person's name and the Qur'an
 */

export type QuranResonance = {
  surahNumber: number;
  surahName: string;
  surahNameArabic: string;
  ayahNumber: number;
  totalAyahsInSurah: number;
  quranLink: string;
};

export const QURAN_META: {
  [key: number]: { name: string; nameAr: string; totalAyahs: number };
} = {
  1: { name: "Al-Fatihah", nameAr: "الفاتحة", totalAyahs: 7 },
  2: { name: "Al-Baqarah", nameAr: "البقرة", totalAyahs: 286 },
  3: { name: "Aal-Imran", nameAr: "آل عمران", totalAyahs: 200 },
  4: { name: "An-Nisa", nameAr: "النساء", totalAyahs: 176 },
  5: { name: "Al-Ma'idah", nameAr: "المائدة", totalAyahs: 120 },
  6: { name: "Al-An'am", nameAr: "الأنعام", totalAyahs: 165 },
  7: { name: "Al-A'raf", nameAr: "الأعراف", totalAyahs: 206 },
  8: { name: "Al-Anfal", nameAr: "الأنفال", totalAyahs: 75 },
  9: { name: "At-Tawbah", nameAr: "التوبة", totalAyahs: 129 },
  10: { name: "Yunus", nameAr: "يونس", totalAyahs: 109 },
  11: { name: "Hud", nameAr: "هود", totalAyahs: 123 },
  12: { name: "Yusuf", nameAr: "يوسف", totalAyahs: 111 },
  13: { name: "Ar-Ra'd", nameAr: "الرعد", totalAyahs: 43 },
  14: { name: "Ibrahim", nameAr: "إبراهيم", totalAyahs: 52 },
  15: { name: "Al-Hijr", nameAr: "الحجر", totalAyahs: 99 },
  16: { name: "An-Nahl", nameAr: "النحل", totalAyahs: 128 },
  17: { name: "Al-Isra", nameAr: "الإسراء", totalAyahs: 111 },
  18: { name: "Al-Kahf", nameAr: "الكهف", totalAyahs: 110 },
  19: { name: "Maryam", nameAr: "مريم", totalAyahs: 98 },
  20: { name: "Taha", nameAr: "طه", totalAyahs: 135 },
  21: { name: "Al-Anbiya", nameAr: "الأنبياء", totalAyahs: 112 },
  22: { name: "Al-Hajj", nameAr: "الحج", totalAyahs: 78 },
  23: { name: "Al-Mu'minun", nameAr: "المؤمنون", totalAyahs: 118 },
  24: { name: "An-Nur", nameAr: "النور", totalAyahs: 64 },
  25: { name: "Al-Furqan", nameAr: "الفرقان", totalAyahs: 77 },
  26: { name: "Ash-Shu'ara", nameAr: "الشعراء", totalAyahs: 227 },
  27: { name: "An-Naml", nameAr: "النمل", totalAyahs: 93 },
  28: { name: "Al-Qasas", nameAr: "القصص", totalAyahs: 88 },
  29: { name: "Al-Ankabut", nameAr: "العنكبوت", totalAyahs: 69 },
  30: { name: "Ar-Rum", nameAr: "الروم", totalAyahs: 60 },
  31: { name: "Luqman", nameAr: "لقمان", totalAyahs: 34 },
  32: { name: "As-Sajdah", nameAr: "السجدة", totalAyahs: 30 },
  33: { name: "Al-Ahzab", nameAr: "الأحزاب", totalAyahs: 73 },
  34: { name: "Saba", nameAr: "سبأ", totalAyahs: 54 },
  35: { name: "Fatir", nameAr: "فاطر", totalAyahs: 45 },
  36: { name: "Ya-Sin", nameAr: "يس", totalAyahs: 83 },
  37: { name: "As-Saffat", nameAr: "الصافات", totalAyahs: 182 },
  38: { name: "Sad", nameAr: "ص", totalAyahs: 88 },
  39: { name: "Az-Zumar", nameAr: "الزمر", totalAyahs: 75 },
  40: { name: "Ghafir", nameAr: "غافر", totalAyahs: 85 },
  41: { name: "Fussilat", nameAr: "فصلت", totalAyahs: 54 },
  42: { name: "Ash-Shura", nameAr: "الشورى", totalAyahs: 53 },
  43: { name: "Az-Zukhruf", nameAr: "الزخرف", totalAyahs: 89 },
  44: { name: "Ad-Dukhan", nameAr: "الدخان", totalAyahs: 59 },
  45: { name: "Al-Jathiyah", nameAr: "الجاثية", totalAyahs: 37 },
  46: { name: "Al-Ahqaf", nameAr: "الأحقاف", totalAyahs: 35 },
  47: { name: "Muhammad", nameAr: "محمد", totalAyahs: 38 },
  48: { name: "Al-Fath", nameAr: "الفتح", totalAyahs: 29 },
  49: { name: "Al-Hujurat", nameAr: "الحجرات", totalAyahs: 18 },
  50: { name: "Qaf", nameAr: "ق", totalAyahs: 45 },
  51: { name: "Adh-Dhariyat", nameAr: "الذاريات", totalAyahs: 60 },
  52: { name: "At-Tur", nameAr: "الطور", totalAyahs: 49 },
  53: { name: "An-Najm", nameAr: "النجم", totalAyahs: 62 },
  54: { name: "Al-Qamar", nameAr: "القمر", totalAyahs: 55 },
  55: { name: "Ar-Rahman", nameAr: "الرحمن", totalAyahs: 78 },
  56: { name: "Al-Waqiah", nameAr: "الواقعة", totalAyahs: 96 },
  57: { name: "Al-Hadid", nameAr: "الحديد", totalAyahs: 29 },
  58: { name: "Al-Mujadila", nameAr: "المجادلة", totalAyahs: 22 },
  59: { name: "Al-Hashr", nameAr: "الحشر", totalAyahs: 24 },
  60: { name: "Al-Mumtahanah", nameAr: "الممتحنة", totalAyahs: 13 },
  61: { name: "As-Saff", nameAr: "الصف", totalAyahs: 14 },
  62: { name: "Al-Jumu'ah", nameAr: "الجمعة", totalAyahs: 11 },
  63: { name: "Al-Munafiqun", nameAr: "المنافقون", totalAyahs: 11 },
  64: { name: "At-Taghabun", nameAr: "التغابن", totalAyahs: 18 },
  65: { name: "At-Talaq", nameAr: "الطلاق", totalAyahs: 12 },
  66: { name: "At-Tahrim", nameAr: "التحريم", totalAyahs: 12 },
  67: { name: "Al-Mulk", nameAr: "الملك", totalAyahs: 30 },
  68: { name: "Al-Qalam", nameAr: "القلم", totalAyahs: 52 },
  69: { name: "Al-Haqqah", nameAr: "الحاقة", totalAyahs: 52 },
  70: { name: "Al-Ma'arij", nameAr: "المعارج", totalAyahs: 44 },
  71: { name: "Nuh", nameAr: "نوح", totalAyahs: 28 },
  72: { name: "Al-Jinn", nameAr: "الجن", totalAyahs: 28 },
  73: { name: "Al-Muzzammil", nameAr: "المزمل", totalAyahs: 20 },
  74: { name: "Al-Muddaththir", nameAr: "المدثر", totalAyahs: 56 },
  75: { name: "Al-Qiyamah", nameAr: "القيامة", totalAyahs: 40 },
  76: { name: "Al-Insan", nameAr: "الإنسان", totalAyahs: 31 },
  77: { name: "Al-Mursalat", nameAr: "المرسلات", totalAyahs: 50 },
  78: { name: "An-Naba", nameAr: "النبأ", totalAyahs: 40 },
  79: { name: "An-Nazi'at", nameAr: "النازعات", totalAyahs: 46 },
  80: { name: "Abasa", nameAr: "عبس", totalAyahs: 42 },
  81: { name: "At-Takwir", nameAr: "التكوير", totalAyahs: 29 },
  82: { name: "Al-Infitar", nameAr: "الإنفطار", totalAyahs: 19 },
  83: { name: "Al-Mutaffifin", nameAr: "المطففين", totalAyahs: 36 },
  84: { name: "Al-Inshiqaq", nameAr: "الإنشقاق", totalAyahs: 25 },
  85: { name: "Al-Buruj", nameAr: "البروج", totalAyahs: 22 },
  86: { name: "At-Tariq", nameAr: "الطارق", totalAyahs: 17 },
  87: { name: "Al-A'la", nameAr: "الأعلى", totalAyahs: 19 },
  88: { name: "Al-Ghashiyah", nameAr: "الغاشية", totalAyahs: 26 },
  89: { name: "Al-Fajr", nameAr: "الفجر", totalAyahs: 30 },
  90: { name: "Al-Balad", nameAr: "البلد", totalAyahs: 20 },
  91: { name: "Ash-Shams", nameAr: "الشمس", totalAyahs: 15 },
  92: { name: "Al-Lail", nameAr: "الليل", totalAyahs: 21 },
  93: { name: "Ad-Duhaa", nameAr: "الضحى", totalAyahs: 11 },
  94: { name: "Ash-Sharh", nameAr: "الشرح", totalAyahs: 8 },
  95: { name: "At-Tin", nameAr: "التين", totalAyahs: 8 },
  96: { name: "Al-Alaq", nameAr: "العلق", totalAyahs: 19 },
  97: { name: "Al-Qadr", nameAr: "القدر", totalAyahs: 5 },
  98: { name: "Al-Bayyinah", nameAr: "البينة", totalAyahs: 8 },
  99: { name: "Az-Zalzalah", nameAr: "الزلزلة", totalAyahs: 8 },
  100: { name: "Al-Adiyat", nameAr: "العاديات", totalAyahs: 11 },
  101: { name: "Al-Qari'ah", nameAr: "القارعة", totalAyahs: 11 },
  102: { name: "At-Takathur", nameAr: "التكاثر", totalAyahs: 8 },
  103: { name: "Al-Asr", nameAr: "العصر", totalAyahs: 3 },
  104: { name: "Al-Humazah", nameAr: "الهمزة", totalAyahs: 9 },
  105: { name: "Al-Fil", nameAr: "الفيل", totalAyahs: 5 },
  106: { name: "Quraish", nameAr: "قريش", totalAyahs: 4 },
  107: { name: "Al-Ma'un", nameAr: "الماعون", totalAyahs: 7 },
  108: { name: "Al-Kawthar", nameAr: "الكوثر", totalAyahs: 3 },
  109: { name: "Al-Kafirun", nameAr: "الكافرون", totalAyahs: 6 },
  110: { name: "An-Nasr", nameAr: "النصر", totalAyahs: 3 },
  111: { name: "Al-Masad", nameAr: "المسد", totalAyahs: 5 },
  112: { name: "Al-Ikhlas", nameAr: "الإخلاص", totalAyahs: 4 },
  113: { name: "Al-Falaq", nameAr: "الفلق", totalAyahs: 5 },
  114: { name: "An-Nas", nameAr: "الناس", totalAyahs: 6 }
};

/**
 * Compute Qur'anic Resonance from Hadad (Kabīr) value
 * 
 * This connects a person's name value to the structure of the Qur'an,
 * revealing a verse that may hold spiritual significance for reflection.
 * 
 * @param hadad - The Kabīr (grand total) from name calculation
 * @returns QuranResonance object with surah and ayah details
 */
export function computeQuranResonance(hadad: number): QuranResonance {
  if (hadad <= 0) {
    throw new Error("Invalid Hadad value - must be positive");
  }

  // Step 1: Calculate Surah number (1-114)
  let surahNum = hadad % 114;
  if (surahNum === 0) {
    surahNum = 114; // An-Nas (last surah)
  }

  // Step 2: Get Surah metadata
  const surahData = QURAN_META[surahNum];
  if (!surahData) {
    throw new Error(`Surah ${surahNum} not found in metadata`);
  }

  const totalAyahs = surahData.totalAyahs;

  // Step 3: Calculate Ayah number (1 to totalAyahs)
  let ayahNum = hadad % totalAyahs;
  if (ayahNum === 0) {
    ayahNum = totalAyahs; // Last ayah of the surah
  }

  // Step 4: Generate Quran.com link
  const quranLink = `https://quran.com/${surahNum}/${ayahNum}`;

  return {
    surahNumber: surahNum,
    surahName: surahData.name,
    surahNameArabic: surahData.nameAr,
    ayahNumber: ayahNum,
    totalAyahsInSurah: totalAyahs,
    quranLink
  };
}

/**
 * Get a reflective message about Qur'anic resonance
 */
export function getQuranResonanceMessage(): string {
  return "This verse emerged through numerical resonance between your name and the Qur'anic structure. " +
    "Reflect upon it as a potential sign or reminder in your spiritual journey. " +
    "Remember: this is for contemplation, not divination.";
}
