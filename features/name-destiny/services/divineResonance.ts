/**
 * Divine Name Resonance Service
 * Calculates Divine Name based on Abjad Kabir values
 */

import { ABJAD_MAGHRIBI } from '../constants/abjadMaps';

export interface LetterBreakdown {
  ch: string;
  value: number;
}

export interface DivineName {
  letter: string;
  name: string;
  nameTashkeel: string;
  transliteration: string;
  translation: string;
}

export interface DivineResonanceResult {
  normalized: string;
  breakdown: LetterBreakdown[];
  total: number;
  index: number;
  letter: string;
  divineName: string;
  divineNameTashkeel: string;
  transliteration: string;
  translation: string;
}

/**
 * Divine Names Table (28 entries)
 * Maps resonance index (1-28) to letter, divine name with tashkeel, transliteration, and translation
 */
const DIVINE_NAMES: Record<number, DivineName> = {
  1: { 
    letter: 'ا', 
    name: 'الله', 
    nameTashkeel: 'اللهُ',
    transliteration: 'Allah',
    translation: 'The God, The One True God'
  },
  2: { 
    letter: 'ب', 
    name: 'باقٍ', 
    nameTashkeel: 'بَاقٍ',
    transliteration: 'Al-Bāqī',
    translation: 'The Everlasting, The Eternal'
  },
  3: { 
    letter: 'ج', 
    name: 'جامع', 
    nameTashkeel: 'جَامِعٌ',
    transliteration: 'Al-Jāmiʿ',
    translation: 'The Gatherer, The Uniter'
  },
  4: { 
    letter: 'د', 
    name: 'دائم', 
    nameTashkeel: 'دَائِمٌ',
    transliteration: 'Ad-Dāʾim',
    translation: 'The Eternal, The Everlasting'
  },
  5: { 
    letter: 'ه', 
    name: 'هادي', 
    nameTashkeel: 'هَادِي',
    transliteration: 'Al-Hādī',
    translation: 'The Guide, The One Who Guides'
  },
  6: { 
    letter: 'و', 
    name: 'ودود', 
    nameTashkeel: 'وَدُودٌ',
    transliteration: 'Al-Wadūd',
    translation: 'The Loving, The Most Affectionate'
  },
  7: { 
    letter: 'ز', 
    name: 'زكي', 
    nameTashkeel: 'زَكِيٌّ',
    transliteration: 'Az-Zakī',
    translation: 'The Pure, The Immaculate'
  },
  8: { 
    letter: 'ح', 
    name: 'حكيم', 
    nameTashkeel: 'حَكِيمٌ',
    transliteration: 'Al-Ḥakīm',
    translation: 'The Wise, The All-Wise'
  },
  9: { 
    letter: 'ط', 
    name: 'طاهر', 
    nameTashkeel: 'طَاهِرٌ',
    transliteration: 'Aṭ-Ṭāhir',
    translation: 'The Purifier, The Pure One'
  },
  10: { 
    letter: 'ي', 
    name: 'يقين', 
    nameTashkeel: 'يَقِينٌ',
    transliteration: 'Al-Yaqīn',
    translation: 'The Certain, The Certainty'
  },
  11: { 
    letter: 'ك', 
    name: 'كريم', 
    nameTashkeel: 'كَرِيمٌ',
    transliteration: 'Al-Karīm',
    translation: 'The Generous, The Most Bountiful'
  },
  12: { 
    letter: 'ل', 
    name: 'لطيف', 
    nameTashkeel: 'لَطِيفٌ',
    transliteration: 'Al-Laṭīf',
    translation: 'The Subtle, The Most Kind'
  },
  13: { 
    letter: 'م', 
    name: 'مؤمن', 
    nameTashkeel: 'مُؤْمِنٌ',
    transliteration: 'Al-Muʾmin',
    translation: 'The Believer, The Giver of Faith'
  },
  14: { 
    letter: 'ن', 
    name: 'نور', 
    nameTashkeel: 'نُورٌ',
    transliteration: 'An-Nūr',
    translation: 'The Light, The Illuminator'
  },
  15: { 
    letter: 'س', 
    name: 'سلام', 
    nameTashkeel: 'سَلَامٌ',
    transliteration: 'As-Salām',
    translation: 'The Peace, The Source of Peace'
  },
  16: { 
    letter: 'ع', 
    name: 'عليم', 
    nameTashkeel: 'عَلِيمٌ',
    transliteration: 'Al-ʿAlīm',
    translation: 'The All-Knowing, The Omniscient'
  },
  17: { 
    letter: 'ف', 
    name: 'فرد', 
    nameTashkeel: 'فَرْدٌ',
    transliteration: 'Al-Fard',
    translation: 'The Unique, The One and Only'
  },
  18: { 
    letter: 'ص', 
    name: 'صبور', 
    nameTashkeel: 'صَبُورٌ',
    transliteration: 'Aṣ-Ṣabūr',
    translation: 'The Patient, The Most Forbearing'
  },
  19: { 
    letter: 'ق', 
    name: 'قادر', 
    nameTashkeel: 'قَادِرٌ',
    transliteration: 'Al-Qādir',
    translation: 'The Able, The All-Powerful'
  },
  20: { 
    letter: 'ر', 
    name: 'رحمن', 
    nameTashkeel: 'رَحْمَنٌ',
    transliteration: 'Ar-Raḥmān',
    translation: 'The Most Merciful, The Beneficent'
  },
  21: { 
    letter: 'ش', 
    name: 'شكور', 
    nameTashkeel: 'شَكُورٌ',
    transliteration: 'Ash-Shakūr',
    translation: 'The Grateful, The Appreciative'
  },
  22: { 
    letter: 'ت', 
    name: 'تواب', 
    nameTashkeel: 'تَوَّابٌ',
    transliteration: 'At-Tawwāb',
    translation: 'The Acceptor of Repentance'
  },
  23: { 
    letter: 'ث', 
    name: 'ثابت', 
    nameTashkeel: 'ثَابِتٌ',
    transliteration: 'Ath-Thābit',
    translation: 'The Firm, The Steadfast'
  },
  24: { 
    letter: 'خ', 
    name: 'خبير', 
    nameTashkeel: 'خَبِيرٌ',
    transliteration: 'Al-Khabīr',
    translation: 'The Aware, The All-Informed'
  },
  25: { 
    letter: 'ذ', 
    name: 'ذو الجلال والإكرام', 
    nameTashkeel: 'ذُو الْجَلَالِ وَالْإِكْرَامِ',
    transliteration: 'Dhul-Jalāli wal-Ikrām',
    translation: 'The Lord of Majesty and Bounty'
  },
  26: { 
    letter: 'ض', 
    name: 'ضار', 
    nameTashkeel: 'ضَارٌّ',
    transliteration: 'Aḍ-Ḍārr',
    translation: 'The Distresser, The Corrector'
  },
  27: { 
    letter: 'ظ', 
    name: 'ظاهر', 
    nameTashkeel: 'ظَاهِرٌ',
    transliteration: 'Aẓ-Ẓāhir',
    translation: 'The Manifest, The Evident'
  },
  28: { 
    letter: 'غ', 
    name: 'غني', 
    nameTashkeel: 'غَنِيٌّ',
    transliteration: 'Al-Ghanī',
    translation: 'The Rich, The Self-Sufficient'
  },
};

/**
 * Normalize Arabic text for Abjad calculation
 * Removes tashkeel, spaces, punctuation, and tatweel
 * Normalizes variants to their base forms
 */
export function normalizeArabicForResonance(text: string): string {
  let normalized = text;

  // Remove tashkeel (diacritical marks)
  normalized = normalized.replace(/[\u064B-\u065F\u0670]/g, '');

  // Remove spaces and tatweel
  normalized = normalized.replace(/[\s ـ]/g, '');
  
  // Remove punctuation
  normalized = normalized.replace(/[.,;!?،؛]/g, '');

  // Normalize variants
  normalized = normalized.replace(/[آأإٱ]/g, 'ا'); // Alif variants → Alif
  normalized = normalized.replace(/ة/g, 'ه');      // Ta Marbuta → Ha
  normalized = normalized.replace(/ى/g, 'ي');      // Alif Maksura → Ya
  normalized = normalized.replace(/ؤ/g, 'و');      // Waw with Hamza → Waw
  normalized = normalized.replace(/ئ/g, 'ي');      // Ya with Hamza → Ya

  return normalized;
}

/**
 * Calculate Divine Name Resonance for a given name
 * 
 * @param name - The Arabic name (or Arabic-converted name)
 * @param abjadMap - Optional custom Abjad map (defaults to Maghribi)
 * @returns DivineResonanceResult with breakdown and divine name
 * @throws Error if no valid Arabic letters found after normalization
 */
export function computeDivineResonance(
  name: string,
  abjadMap: Record<string, number> = ABJAD_MAGHRIBI
): DivineResonanceResult {
  // Normalize the input
  const normalized = normalizeArabicForResonance(name);

  // Validate: must have at least one valid Arabic letter
  if (!normalized || normalized.length === 0) {
    throw new Error('No valid Arabic letters found in the name');
  }

  // Calculate breakdown and total
  const breakdown: LetterBreakdown[] = [];
  let total = 0;

  for (const ch of normalized) {
    const value = abjadMap[ch];
    if (value !== undefined) {
      breakdown.push({ ch, value });
      total += value;
    }
  }

  // Validate: must have at least one letter with a valid Abjad value
  if (breakdown.length === 0) {
    throw new Error('No valid Arabic letters found in the name');
  }

  // Calculate resonance index
  let index: number;
  if (total < 28) {
    index = total; // Do NOT divide if less than 28
  } else {
    index = total % 28;
    if (index === 0) {
      index = 28; // Remainder 0 maps to 28
    }
  }

  // Look up divine name
  const divineEntry = DIVINE_NAMES[index];
  if (!divineEntry) {
    throw new Error(`Invalid resonance index: ${index}`);
  }

  return {
    normalized,
    breakdown,
    total,
    index,
    letter: divineEntry.letter,
    divineName: divineEntry.name,
    divineNameTashkeel: divineEntry.nameTashkeel,
    transliteration: divineEntry.transliteration,
    translation: divineEntry.translation,
  };
}

/**
 * Get explanation text for the resonance calculation
 * e.g., "92 ÷ 28 remainder 8 → حكيم"
 */
export function getResonanceExplanation(total: number, index: number): string {
  if (total < 28) {
    return `${total} < 28 → Index ${index}`;
  }
  const quotient = Math.floor(total / 28);
  const remainder = total % 28;
  return `${total} ÷ 28 = ${quotient} remainder ${remainder === 0 ? 28 : remainder} → Index ${index}`;
}

/**
 * Compute Abjad Kabir value for a Divine Name (or any Arabic text)
 * Normalizes the text (removes tashkeel, tatweel, spaces, punctuation) and sums letter values
 */
export function computeDivineNameAbjad(
  arabicText: string,
  abjadMap: Record<string, number> = ABJAD_MAGHRIBI
): { total: number; letters: LetterBreakdown[] } {
  // Normalize: remove tashkeel (diacritics), tatweel, spaces, punctuation
  const normalized = arabicText
    .replace(/[\u064B-\u065F\u0670]/g, '') // Remove tashkeel
    .replace(/ـ/g, '') // Remove tatweel
    .replace(/[\s ]/g, '') // Remove spaces
    .replace(/[.,;!?،؛]/g, '') // Remove punctuation
    // Normalize variants
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي');

  const letters: LetterBreakdown[] = [];
  let total = 0;

  for (const ch of normalized) {
    const value = abjadMap[ch];
    if (value !== undefined) {
      letters.push({ ch, value });
      total += value;
    }
  }

  return { total, letters };
}
