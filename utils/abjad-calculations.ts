/**
 * Server-side Name Destiny Calculation Wrapper
 * Complete calculation library for API routes
 */

import { ABJAD_MAGHRIBI } from '../constants/abjad-maps';
// import {
//   calculateDivineNameResonance,
//   computeQuranResonance,
//   getDivineNameByNumber,
//   getElementQualityByIndex,
//   getSpiritualStationByNumber
// } from './server-data';
// import { transliterateLatinToArabic } from './text-normalize';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface DivineName {
  number: number;
  arabic: string;
  transliteration: string;
  meaningEn: string;
  meaningFr: string;
  meaningAr?: string;
  spiritualInfluence: string;
  spiritualInfluenceFr: string;
  spiritualInfluenceAr?: string;
  reflection: string;
  reflectionFr: string;
  reflectionAr?: string;
}

export interface QuranResonance {
  surahNumber: number;
  surahName: string;
  surahNameArabic: string;
  ayahNumber: number;
  totalAyahsInSurah: number;
  quranLink: string;
}

export interface ElementQuality {
  index: number;
  en: string;
  fr: string;
  ar: string;
  icon: string;
  qualities: {
    en: string[];
    fr: string[];
    ar: string[];
  };
  challenges: {
    en: string[];
    fr: string[];
    ar: string[];
  };
}

export interface SpiritualStation {
  number: number;
  en: string;
  fr: string;
  ar: string;
  description: {
    en: string;
    fr: string;
    ar: string;
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Calculate digital root (sum digits until single digit)
 */
function digitalRoot(n: number): number {
  if (n === 0) return 0;
  return n % 9 === 0 ? 9 : n % 9;
}

/**
 * Modular index with 0 mapped to max
 */
function modIndex(n: number, mod: number): number {
  const remainder = n % mod;
  return remainder === 0 ? mod : remainder;
}

/**
 * Calculate Abjad total from Arabic text
 */
export function calculateAbjadTotal(
  text: string,
  abjadMap: Record<string, number> = ABJAD_MAGHRIBI
): number {
  // Normalize: remove diacritics and spaces
  const normalized = text.replace(/[ًٌٍَُِّْ\s]/g, '');
  return [...normalized].reduce((sum, char) => sum + (abjadMap[char] || 0), 0);
}

/**
 * Get element from Abjad total (mod 4)
 */
export function getElement(total: number): {
  index: number;
  en: string;
  fr: string;
  ar: string;
  icon: string;
} {
  const elements = [
    { index: 1, en: 'Fire', fr: 'Feu', ar: 'نار', icon: '🔥' },
    { index: 2, en: 'Air', fr: 'Air', ar: 'هواء', icon: '💨' },
    { index: 3, en: 'Water', fr: 'Eau', ar: 'ماء', icon: '💧' },
    { index: 4, en: 'Earth', fr: 'Terre', ar: 'تراب', icon: '🌍' }
  ];
  
  const idx = modIndex(total, 4);
  return { ...elements[idx - 1], index: idx };
}

/**
 * Get zodiac sign from Abjad total (mod 12)
 */
export function getBurj(total: number): {
  index: number;
  en: string;
  fr: string;
  ar: string;
  symbol: string;
  planet: string;
} {
  const buruj = [
    { index: 1, en: 'Aries', fr: 'Bélier', ar: 'الحمل', symbol: '♈', planet: 'Mars' },
    { index: 2, en: 'Taurus', fr: 'Taureau', ar: 'الثور', symbol: '♉', planet: 'Venus' },
    { index: 3, en: 'Gemini', fr: 'Gémeaux', ar: 'الجوزاء', symbol: '♊', planet: 'Mercury' },
    { index: 4, en: 'Cancer', fr: 'Cancer', ar: 'السرطان', symbol: '♋', planet: 'Moon' },
    { index: 5, en: 'Leo', fr: 'Lion', ar: 'الأسد', symbol: '♌', planet: 'Sun' },
    { index: 6, en: 'Virgo', fr: 'Vierge', ar: 'العذراء', symbol: '♍', planet: 'Mercury' },
    { index: 7, en: 'Libra', fr: 'Balance', ar: 'الميزان', symbol: '♎', planet: 'Venus' },
    { index: 8, en: 'Scorpio', fr: 'Scorpion', ar: 'العقرب', symbol: '♏', planet: 'Mars' },
    { index: 9, en: 'Sagittarius', fr: 'Sagittaire', ar: 'القوس', symbol: '♐', planet: 'Jupiter' },
    { index: 10, en: 'Capricorn', fr: 'Capricorne', ar: 'الجدي', symbol: '♑', planet: 'Saturn' },
    { index: 11, en: 'Aquarius', fr: 'Verseau', ar: 'الدلو', symbol: '♒', planet: 'Saturn' },
    { index: 12, en: 'Pisces', fr: 'Poissons', ar: 'الحوت', symbol: '♓', planet: 'Jupiter' }
  ];
  
  const idx = modIndex(total, 12);
  return { ...buruj[idx - 1], index: idx };
}

/**
 * Simple server-side name destiny calculation
 */
export function calculateSimpleDestiny(
  personName: string,
  motherName?: string,
  abjadMap: Record<string, number> = ABJAD_MAGHRIBI
) {
  // Convert to Arabic if needed (simplified - just use as-is for now)
  const personArabic = personName;
  const motherArabic = motherName || '';
  
  const personTotal = calculateAbjadTotal(personArabic, abjadMap);
  const motherTotal = motherArabic ? calculateAbjadTotal(motherArabic, abjadMap) : 0;
  const combinedTotal = personTotal + motherTotal;
  
  const kabir = combinedTotal;
  const saghir = digitalRoot(combinedTotal);
  const hadath = kabir % 4;
  
  const element = getElement(combinedTotal);
  const burj = getBurj(combinedTotal);
  
  return {
    personKabir: personTotal,
    motherKabir: motherTotal,
    kabir,
    saghir,
    hadath,
    element,
    burj
  };
}

// ============================================================================
// RE-EXPORT DATA FUNCTIONS (Commented out - implement when needed)
// ============================================================================

// export {
//     calculateDivineNameResonance,
//     computeQuranResonance, getDivineNameByNumber, getElementQualityByIndex, getSpiritualStationByNumber
// };

// ============================================================================
// ENHANCED CALCULATION FUNCTIONS (Commented out until server-data is ready)
// ============================================================================

/**
 * Complete name destiny calculation with all spiritual data
 * TODO: Uncomment when server-data.ts is implemented
 */
// export function calculateCompleteDestiny(
//   personName: string,
//   motherName?: string,
//   abjadMap: Record<string, number> = ABJAD_MAGHRIBI
// ) {
//   const basic = calculateSimpleDestiny(personName, motherName, abjadMap);
  
//   // Divine Name resonance (mod 99)
//   const divineNameResonance = calculateDivineNameResonance(basic.kabir);
  
//   // Quran resonance
//   const quranResonance = computeQuranResonance(basic.kabir);
  
//   // Spiritual station (Saghir maps to 1-9)
//   const spiritualStation = getSpiritualStationByNumber(basic.saghir);
  
//   // Enhanced element with qualities
//   const elementQuality = getElementQualityByIndex(basic.element.index);
  
//   return {
//     ...basic,
//     divineNameResonance,
//     quranResonance,
//     spiritualStation,
//     elementQuality
//   };
// }

/**
 * Calculate life path numbers from birth date
 */
export function calculateLifePath(birthDate: string): {
  lifePathNumber: number;
  expression: number;
  soulUrge: number;
} | null {
  try {
    const date = new Date(birthDate);
    if (isNaN(date.getTime())) return null;
    
    // Extract date components
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    
    // Calculate life path number (reduce until single digit 1-9 or master 11, 22, 33)
    const reduceToLifePath = (num: number): number => {
      while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
        num = digitalRoot(num);
      }
      return num;
    };
    
    const dayReduced = digitalRoot(day);
    const monthReduced = digitalRoot(month);
    const yearReduced = digitalRoot(year);
    
    const lifePathNumber = reduceToLifePath(dayReduced + monthReduced + yearReduced);
    
    return {
      lifePathNumber,
      expression: dayReduced,
      soulUrge: monthReduced
    };
  } catch {
    return null;
  }
}

/**
 * Calculate digital root (exported for external use)
 */
export function getDigitalRoot(n: number): number {
  return digitalRoot(n);
}

/**
 * Calculate mod index (exported for external use)
 */
export function getModIndex(n: number, mod: number): number {
  return modIndex(n, mod);
}