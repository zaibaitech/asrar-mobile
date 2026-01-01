/**
 * Profile Derivation Service
 * ===========================
 * Derives astrological data from user profile
 * 
 * Features:
 * - Burj (zodiac sign) from DOB
 * - Element (Fire, Earth, Air, Water) from Burj
 * - Planetary ruler from Burj
 * - Manazil baseline from DOB
 * 
 * Uses classical Islamic astronomy framework (Ilm al-Nujum)
 */

import { normalizeMansionIndex } from '@/data/lunarMansions';
import {
    DerivedAstrologicalData,
    UserProfile,
} from '@/types/user-profile';

// ============================================================================
// BURJ (ZODIAC) SYSTEM
// ============================================================================

/**
 * Burj (Zodiac Signs) in Arabic
 * Based on tropical zodiac (Western astrology)
 */
export const BURJ_NAMES_AR = [
  'الحمل',     // Aries (Mar 21 - Apr 19)
  'الثور',     // Taurus (Apr 20 - May 20)
  'الجوزاء',   // Gemini (May 21 - Jun 20)
  'السرطان',   // Cancer (Jun 21 - Jul 22)
  'الأسد',     // Leo (Jul 23 - Aug 22)
  'العذراء',   // Virgo (Aug 23 - Sep 22)
  'الميزان',   // Libra (Sep 23 - Oct 22)
  'العقرب',    // Scorpio (Oct 23 - Nov 21)
  'القوس',     // Sagittarius (Nov 22 - Dec 21)
  'الجدي',     // Capricorn (Dec 22 - Jan 19)
  'الدلو',     // Aquarius (Jan 20 - Feb 18)
  'الحوت',     // Pisces (Feb 19 - Mar 20)
];

export const BURJ_NAMES_EN = [
  'Aries',
  'Taurus',
  'Gemini',
  'Cancer',
  'Leo',
  'Virgo',
  'Libra',
  'Scorpio',
  'Sagittarius',
  'Capricorn',
  'Aquarius',
  'Pisces',
];

/**
 * Burj date ranges (tropical zodiac)
 * Format: [month (1-12), day]
 */
const BURJ_DATE_RANGES = [
  { start: [3, 21], end: [4, 19] },   // Aries
  { start: [4, 20], end: [5, 20] },   // Taurus
  { start: [5, 21], end: [6, 20] },   // Gemini
  { start: [6, 21], end: [7, 22] },   // Cancer
  { start: [7, 23], end: [8, 22] },   // Leo
  { start: [8, 23], end: [9, 22] },   // Virgo
  { start: [9, 23], end: [10, 22] },  // Libra
  { start: [10, 23], end: [11, 21] }, // Scorpio
  { start: [11, 22], end: [12, 21] }, // Sagittarius
  { start: [12, 22], end: [1, 19] },  // Capricorn
  { start: [1, 20], end: [2, 18] },   // Aquarius
  { start: [2, 19], end: [3, 20] },   // Pisces
];

// ============================================================================
// ELEMENT SYSTEM
// ============================================================================

/**
 * Classical elements assigned to each Burj
 */
export type Element = 'fire' | 'earth' | 'air' | 'water';

const BURJ_ELEMENTS: Element[] = [
  'fire',   // Aries
  'earth',  // Taurus
  'air',    // Gemini
  'water',  // Cancer
  'fire',   // Leo
  'earth',  // Virgo
  'air',    // Libra
  'water',  // Scorpio
  'fire',   // Sagittarius
  'earth',  // Capricorn
  'air',    // Aquarius
  'water',  // Pisces
];

// ============================================================================
// PLANETARY RULERS
// ============================================================================

/**
 * Traditional planetary rulers for each Burj
 * Based on classical Islamic astronomy (Ilm al-Nujum)
 */
const BURJ_PLANETARY_RULERS = [
  'mars',      // Aries
  'venus',     // Taurus
  'mercury',   // Gemini
  'moon',      // Cancer
  'sun',       // Leo
  'mercury',   // Virgo
  'venus',     // Libra
  'mars',      // Scorpio
  'jupiter',   // Sagittarius
  'saturn',    // Capricorn
  'saturn',    // Aquarius
  'jupiter',   // Pisces
];

// ============================================================================
// DERIVATION FUNCTIONS
// ============================================================================

/**
 * Derive Burj (zodiac sign) from date of birth
 * Uses tropical zodiac
 */
export function deriveBurjFromDOB(dobISO: string): {
  burjAr: string;
  burjEn: string;
  burjIndex: number;
} | null {
  try {
    const date = new Date(dobISO);
    
    if (isNaN(date.getTime())) {
      return null;
    }
    
    const month = date.getMonth() + 1; // 1-12
    const day = date.getDate();
    
    // Find matching Burj
    for (let i = 0; i < BURJ_DATE_RANGES.length; i++) {
      const range = BURJ_DATE_RANGES[i];
      const [startMonth, startDay] = range.start;
      const [endMonth, endDay] = range.end;
      
      // Handle year-crossing signs (Capricorn)
      if (startMonth > endMonth) {
        // Dec-Jan range
        if (
          (month === startMonth && day >= startDay) ||
          (month === endMonth && day <= endDay)
        ) {
          return {
            burjAr: BURJ_NAMES_AR[i],
            burjEn: BURJ_NAMES_EN[i],
            burjIndex: i,
          };
        }
      } else {
        // Normal range
        if (
          (month === startMonth && day >= startDay) ||
          (month === endMonth && day <= endDay) ||
          (month > startMonth && month < endMonth)
        ) {
          return {
            burjAr: BURJ_NAMES_AR[i],
            burjEn: BURJ_NAMES_EN[i],
            burjIndex: i,
          };
        }
      }
    }
    
    return null;
    
  } catch (error) {
    if (__DEV__) {
      console.error('[ProfileDerivation] Error deriving Burj:', error);
    }
    return null;
  }
}

/**
 * Derive element from Burj index
 */
export function deriveElementFromBurj(burjIndex: number): Element {
  if (burjIndex < 0 || burjIndex >= BURJ_ELEMENTS.length) {
    return 'fire'; // Default fallback
  }
  
  return BURJ_ELEMENTS[burjIndex];
}

/**
 * Derive planetary ruler from Burj index
 */
export function derivePlanetaryRulerFromBurj(burjIndex: number): string {
  if (burjIndex < 0 || burjIndex >= BURJ_PLANETARY_RULERS.length) {
    return 'sun'; // Default fallback
  }
  
  return BURJ_PLANETARY_RULERS[burjIndex];
}

/**
 * Calculate Manazil baseline from DOB
 * Manazil = 28 lunar mansions
 * Baseline helps align Divine Timing calculations
 */
export function calculateManazilBaseline(dobISO: string): number {
  try {
    const date = new Date(dobISO);
    
    if (isNaN(date.getTime())) {
      return 0;
    }
    
    // Calculate days since epoch
    const epochStart = new Date('2000-01-01').getTime();
    const dobTime = date.getTime();
    const daysSinceEpoch = Math.floor((dobTime - epochStart) / (24 * 60 * 60 * 1000));
    
    // Map to Manazil (28 lunar mansions)
    // Full cycle = ~27.321661 days (sidereal month)
    const siderealMonthDays = 27.321661;
    const cyclePosition = ((daysSinceEpoch % siderealMonthDays) + siderealMonthDays) % siderealMonthDays;
    const rawIndex = Math.floor((cyclePosition / siderealMonthDays) * 28);
    const normalizedIndex = normalizeMansionIndex(rawIndex);
    
    return normalizedIndex ?? 0;
    
  } catch (error) {
    if (__DEV__) {
      console.error('[ProfileDerivation] Error calculating Manazil:', error);
    }
    return 0;
  }
}

/**
 * Derive all astrological data from user profile
 * Main function used by ProfileContext
 */
export function deriveAstrologicalData(
  profile: UserProfile
): DerivedAstrologicalData | null {
  // Requires DOB
  if (!profile.dobISO) {
    return null;
  }
  
  try {
    // Derive Burj
    const burjData = deriveBurjFromDOB(profile.dobISO);
    
    if (!burjData) {
      return null;
    }
    
    // Derive element
    const element = deriveElementFromBurj(burjData.burjIndex);
    
    // Derive planetary ruler
    const planetaryRuler = derivePlanetaryRulerFromBurj(burjData.burjIndex);
    
    // Calculate Manazil baseline
    const manazilBaseline = calculateManazilBaseline(profile.dobISO);
    
    return {
      burj: burjData.burjAr,
      burjIndex: burjData.burjIndex,
      element,
      planetaryRuler: planetaryRuler as any, // Type assertion for lowercase planetary names
      manazilBaseline,
    };
    
  } catch (error) {
    if (__DEV__) {
      console.error('[ProfileDerivation] Error deriving astrological data:', error);
    }
    return null;
  }
}

/**
 * Update user profile with derived data
 * Call this after DOB changes
 */
export function updateProfileWithDerivedData(
  profile: UserProfile
): UserProfile {
  const derived = deriveAstrologicalData(profile);
  
  return {
    ...profile,
    derived: derived || undefined,
    updatedAt: Date.now(),
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get element description in Arabic
 */
export function getElementNameAr(element: Element): string {
  const elementNames: Record<Element, string> = {
    fire: 'النار',
    earth: 'التراب',
    air: 'الهواء',
    water: 'الماء',
  };
  
  return elementNames[element];
}

/**
 * Get element characteristics
 */
export function getElementCharacteristics(element: Element): {
  quality: string;
  temperament: string;
  energy: string;
} {
  const characteristics: Record<Element, {
    quality: string;
    temperament: string;
    energy: string;
  }> = {
    fire: {
      quality: 'Active, Dynamic',
      temperament: 'Hot & Dry',
      energy: 'Yang (Masculine)',
    },
    earth: {
      quality: 'Stable, Grounded',
      temperament: 'Cold & Dry',
      energy: 'Yin (Feminine)',
    },
    air: {
      quality: 'Mental, Social',
      temperament: 'Hot & Moist',
      energy: 'Yang (Masculine)',
    },
    water: {
      quality: 'Emotional, Intuitive',
      temperament: 'Cold & Moist',
      energy: 'Yin (Feminine)',
    },
  };
  
  return characteristics[element];
}

/**
 * Get planetary attributes
 */
export function getPlanetaryAttributes(planet: string): {
  arabicName: string;
  influence: string;
  quality: string;
} {
  const attributes: Record<string, {
    arabicName: string;
    influence: string;
    quality: string;
  }> = {
    Sun: {
      arabicName: 'الشمس',
      influence: 'Vitality, Leadership',
      quality: 'Hot & Dry',
    },
    Moon: {
      arabicName: 'القمر',
      influence: 'Emotions, Intuition',
      quality: 'Cold & Moist',
    },
    Mercury: {
      arabicName: 'عطارد',
      influence: 'Communication, Mind',
      quality: 'Variable',
    },
    Venus: {
      arabicName: 'الزهرة',
      influence: 'Love, Beauty',
      quality: 'Cold & Moist',
    },
    Mars: {
      arabicName: 'المريخ',
      influence: 'Action, Courage',
      quality: 'Hot & Dry',
    },
    Jupiter: {
      arabicName: 'المشتري',
      influence: 'Growth, Wisdom',
      quality: 'Hot & Moist',
    },
    Saturn: {
      arabicName: 'زحل',
      influence: 'Structure, Discipline',
      quality: 'Cold & Dry',
    },
  };
  
  return attributes[planet] || {
    arabicName: planet,
    influence: 'Unknown',
    quality: 'Unknown',
  };
}

/**
 * Check if two Burjs are compatible
 * Based on element harmony
 */
export function checkBurjCompatibility(
  burjIndex1: number,
  burjIndex2: number
): {
  compatible: boolean;
  reason: string;
  harmonyScore: number;
} {
  const element1 = deriveElementFromBurj(burjIndex1);
  const element2 = deriveElementFromBurj(burjIndex2);
  
  // Same element = high compatibility
  if (element1 === element2) {
    return {
      compatible: true,
      reason: 'Same element - natural understanding',
      harmonyScore: 85,
    };
  }
  
  // Fire + Air = compatible
  if ((element1 === 'fire' && element2 === 'air') ||
      (element1 === 'air' && element2 === 'fire')) {
    return {
      compatible: true,
      reason: 'Fire & Air - mutual support',
      harmonyScore: 75,
    };
  }
  
  // Earth + Water = compatible
  if ((element1 === 'earth' && element2 === 'water') ||
      (element1 === 'water' && element2 === 'earth')) {
    return {
      compatible: true,
      reason: 'Earth & Water - mutual growth',
      harmonyScore: 75,
    };
  }
  
  // Fire + Water = challenging
  if ((element1 === 'fire' && element2 === 'water') ||
      (element1 === 'water' && element2 === 'fire')) {
    return {
      compatible: false,
      reason: 'Fire & Water - requires balance',
      harmonyScore: 40,
    };
  }
  
  // Earth + Air = challenging
  if ((element1 === 'earth' && element2 === 'air') ||
      (element1 === 'air' && element2 === 'earth')) {
    return {
      compatible: false,
      reason: 'Earth & Air - different perspectives',
      harmonyScore: 45,
    };
  }
  
  // Default = neutral
  return {
    compatible: true,
    reason: 'Neutral elements',
    harmonyScore: 60,
  };
}
