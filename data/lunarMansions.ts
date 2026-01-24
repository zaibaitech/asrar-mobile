/**
 * Manazil al-Qamar (Lunar Mansions)
 * ==================================
 * The 28 lunar mansions used in Islamic astronomy and spiritual timing
 */

export interface LunarMansion {
  index: number; // 0-27
  nameArabic: string;
  nameTransliteration: string;
  nameEnglish: string;
  nameFrench: string;
  element: 'fire' | 'water' | 'air' | 'earth';
}

/**
 * Convert a Moon ecliptic longitude (degrees 0-360) to a Manazil index (0-27).
 *
 * Each mansion spans 360/28 degrees.
 */
export function getMansionIndexFromEclipticLongitude(longitudeDeg: number): number {
  const lon = ((longitudeDeg % 360) + 360) % 360;
  const mansionSize = 360 / 28;
  const rawIndex = Math.floor(lon / mansionSize);
  return ((rawIndex % 28) + 28) % 28;
}

/**
 * Normalize any raw lunar mansion index to 0-27 range
 */
export function normalizeMansionIndex(raw?: number | null): number | null {
  if (raw === undefined || raw === null || Number.isNaN(raw)) {
    return null;
  }

  // Ensure integer index before normalization
  const intIndex = Math.floor(raw);
  const normalized = ((intIndex % 28) + 28) % 28;
  return normalized;
}

/**
 * The 28 Manazil al-Qamar (Lunar Mansions)
 * Based on classical Islamic astronomy
 */
export const LUNAR_MANSIONS: LunarMansion[] = [
  // Fire Mansions (0-6)
  { index: 0, nameArabic: 'الشرطان', nameTransliteration: 'Al-Sharatān', nameEnglish: 'The Two Signs', nameFrench: 'Les Deux Signes', element: 'fire' },
  { index: 1, nameArabic: 'البطين', nameTransliteration: 'Al-Buṭayn', nameEnglish: 'The Little Belly', nameFrench: 'Le Petit Ventre', element: 'earth' },
  { index: 2, nameArabic: 'الثريا', nameTransliteration: 'Al-Thurayyā', nameEnglish: 'The Pleiades', nameFrench: 'Les Pléiades', element: 'air' },
  { index: 3, nameArabic: 'الدبران', nameTransliteration: 'Al-Dabarān', nameEnglish: 'The Follower', nameFrench: 'Le Suiveur', element: 'water' },
  { index: 4, nameArabic: 'الهقعة', nameTransliteration: 'Al-Haqʿah', nameEnglish: 'The White Spot', nameFrench: 'La Tache Blanche', element: 'fire' },
  { index: 5, nameArabic: 'الهنعة', nameTransliteration: 'Al-Hanʿah', nameEnglish: 'The Brand', nameFrench: 'La Marque', element: 'earth' },
  { index: 6, nameArabic: 'الذراع', nameTransliteration: 'Al-Dhirāʿ', nameEnglish: 'The Arm', nameFrench: 'Le Bras', element: 'air' },
  
  // Earth Mansions (7-13)
  { index: 7, nameArabic: 'النثرة', nameTransliteration: 'Al-Nathrah', nameEnglish: 'The Tip of the Nose', nameFrench: 'Le Bout du Nez', element: 'water' },
  { index: 8, nameArabic: 'الطرف', nameTransliteration: 'Al-Ṭarf', nameEnglish: 'The Glance', nameFrench: 'Le Regard', element: 'fire' },
  { index: 9, nameArabic: 'الجبهة', nameTransliteration: 'Al-Jabhah', nameEnglish: 'The Forehead', nameFrench: 'Le Front', element: 'earth' },
  { index: 10, nameArabic: 'الزبرة', nameTransliteration: 'Al-Zubrah', nameEnglish: 'The Mane', nameFrench: 'La Crinière', element: 'air' },
  { index: 11, nameArabic: 'الصرفة', nameTransliteration: 'Al-Ṣarfah', nameEnglish: 'The Changer', nameFrench: 'Le Changeur', element: 'fire' },
  { index: 12, nameArabic: 'العواء', nameTransliteration: 'Al-ʿAwwāʾ', nameEnglish: 'The Barker', nameFrench: 'L\'Aboyeur', element: 'fire' },
  { index: 13, nameArabic: 'السماك', nameTransliteration: 'Al-Simāk', nameEnglish: 'The Unarmed', nameFrench: 'Le Désarmé', element: 'earth' },
  
  // Air Mansions (14-20)
  { index: 14, nameArabic: 'الغفر', nameTransliteration: 'Al-Ghafr', nameEnglish: 'The Covering', nameFrench: 'Le Voile', element: 'air' },
  { index: 15, nameArabic: 'الزبانى', nameTransliteration: 'Al-Zubānā', nameEnglish: 'The Claws', nameFrench: 'Les Pinces', element: 'water' },
  { index: 16, nameArabic: 'الإكليل', nameTransliteration: 'Al-Iklīl', nameEnglish: 'The Crown', nameFrench: 'La Couronne', element: 'fire' },
  { index: 17, nameArabic: 'القلب', nameTransliteration: 'Al-Qalb', nameEnglish: 'The Heart', nameFrench: 'Le Cœur', element: 'earth' },
  { index: 18, nameArabic: 'الشولة', nameTransliteration: 'Al-Shawlah', nameEnglish: 'The Stinger', nameFrench: 'L\'Aiguillon', element: 'air' },
  { index: 19, nameArabic: 'النعائم', nameTransliteration: 'Al-Naʿāʾim', nameEnglish: 'The Ostriches', nameFrench: 'Les Autruches', element: 'water' },
  { index: 20, nameArabic: 'البلدة', nameTransliteration: 'Al-Baldah', nameEnglish: 'The City', nameFrench: 'La Cité', element: 'fire' },
  
  // Water Mansions (21-27)
  { index: 21, nameArabic: 'سعد الذابح', nameTransliteration: 'Saʿd al-Dhābiḥ', nameEnglish: 'The Luck of the Slaughterer', nameFrench: 'La Fortune du Sacrificateur', element: 'earth' },
  { index: 22, nameArabic: 'سعد بلع', nameTransliteration: 'Saʿd Bulaʿ', nameEnglish: 'The Luck of the Swallower', nameFrench: 'La Fortune de l\'Avaleur', element: 'air' },
  { index: 23, nameArabic: 'سعد السعود', nameTransliteration: 'Saʿd al-Suʿūd', nameEnglish: 'The Luck of Lucks', nameFrench: 'La Fortune des Fortunes', element: 'water' },
  { index: 24, nameArabic: 'سعد الأخبية', nameTransliteration: 'Saʿd al-Akhbiyah', nameEnglish: 'The Luck of the Tents', nameFrench: 'La Fortune des Tentes', element: 'fire' },
  { index: 25, nameArabic: 'الفرغ المقدم', nameTransliteration: 'Al-Fargh al-Muqaddam', nameEnglish: 'The First Pourer', nameFrench: 'Le Premier Verseur', element: 'earth' },
  { index: 26, nameArabic: 'الفرغ المؤخر', nameTransliteration: 'Al-Fargh al-Muʾakhkhar', nameEnglish: 'The Second Pourer', nameFrench: 'Le Second Verseur', element: 'air' },
  { index: 27, nameArabic: 'بطن الحوت', nameTransliteration: 'Baṭn al-Ḥūt', nameEnglish: 'The Belly of the Fish', nameFrench: 'Le Ventre du Poisson', element: 'water' },
];

if (__DEV__) {
  // Lightweight integrity checks to prevent silent data regressions.
  if (LUNAR_MANSIONS.length !== 28) {
    // eslint-disable-next-line no-console
    console.warn(`[lunarMansions] Expected 28 mansions, got ${LUNAR_MANSIONS.length}`);
  }

  for (let i = 0; i < LUNAR_MANSIONS.length; i++) {
    if (LUNAR_MANSIONS[i].index !== i) {
      // eslint-disable-next-line no-console
      console.warn(`[lunarMansions] Mansion at position ${i} has index ${LUNAR_MANSIONS[i].index}`);
    }
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { validateManazilElements } = require('./manazilElementReference') as typeof import('./manazilElementReference');
    const res = validateManazilElements(LUNAR_MANSIONS);
    if (!res.ok) {
      // eslint-disable-next-line no-console
      console.warn('[lunarMansions] Element reference mismatches:', res.problems);
    }
  } catch {
    // ignore (dev-only validation)
  }
}

/**
 * Get lunar mansion by index (0-27)
 */
export function getLunarMansionByIndex(index: number): LunarMansion | null {
  const normalizedIndex = normalizeMansionIndex(index);
  if (normalizedIndex === null) {
    return null;
  }
  return LUNAR_MANSIONS[normalizedIndex];
}

/**
 * Get lunar mansion name in preferred language
 */
export function getLunarMansionName(
  index: number,
  language: 'en' | 'fr' | 'ar' = 'en',
  format: 'full' | 'transliteration' | 'arabic' | 'meaning' = 'full'
): string {
  const mansion = getLunarMansionByIndex(index);
  if (!mansion) return '';
  
  if (format === 'arabic') {
    return mansion.nameArabic;
  }
  
  if (format === 'transliteration') {
    return mansion.nameTransliteration;
  }
  
  if (format === 'meaning') {
    // Return the translated meaning
    if (language === 'fr') {
      return mansion.nameFrench;
    }
    return mansion.nameEnglish;
  }
  
  // Full format
  if (language === 'ar') {
    return mansion.nameArabic;
  }
  
  if (language === 'fr') {
    return `${mansion.nameTransliteration} (${mansion.nameFrench})`;
  }
  
  return `${mansion.nameTransliteration} (${mansion.nameEnglish})`;
}

/**
 * Get a daily/cosmic lunar mansion index for a given date.
 *
 * Notes:
 * - This is a deterministic daily cycle (1 mansion per day) suitable for UI.
 * - It is not an astronomical ephemeris calculation.
 */
export function getCosmicLunarMansionIndexForDate(date: Date = new Date()): number {
  // Use local midday to avoid DST edge cases around midnight.
  const localNoon = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0, 0);

  // Fixed epoch (local noon Jan 1, 2000) to keep the cycle stable.
  const epochLocalNoon = new Date(2000, 0, 1, 12, 0, 0, 0);
  const dayMs = 24 * 60 * 60 * 1000;
  const daysSinceEpoch = Math.floor((localNoon.getTime() - epochLocalNoon.getTime()) / dayMs);

  return ((daysSinceEpoch % 28) + 28) % 28;
}

/**
 * Get the daily/cosmic lunar mansion for a given date.
 */
export function getCosmicLunarMansionForDate(date: Date = new Date()): LunarMansion {
  const index = getCosmicLunarMansionIndexForDate(date);
  return LUNAR_MANSIONS[index];
}
