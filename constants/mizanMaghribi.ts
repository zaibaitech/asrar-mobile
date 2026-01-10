/**
 * Mīzān al-Ḥurūf (Letter Balance) - Maghribī System
 * Maps Arabic letters to their elemental temperament (Ṭabāʾiʿ)
 */

export type MizanElement = 'fire' | 'air' | 'water' | 'earth';

/**
 * Letter-to-Element mapping based on Maghribī tradition
 * TODO: Complete this mapping with authentic sources
 * 
 * Temperament meanings:
 * - Fire: Active, warm, transformative
 * - Air: Mobile, light, communicative
 * - Water: Fluid, cool, adaptive
 * - Earth: Stable, solid, grounding
 */
export const MIZAN_MAGHRIBI_TABAI3: Record<string, MizanElement> = {
  // Placeholder mapping - to be completed with authentic sources
  'ا': 'air',    // Alif
  'ب': 'water',  // Ba
  'ت': 'air',    // Ta
  'ث': 'air',    // Tha
  'ج': 'fire',   // Jeem
  'ح': 'earth',  // Ha
  'خ': 'fire',   // Kha
  'د': 'earth',  // Dal
  'ذ': 'fire',   // Dhal
  'ر': 'air',    // Ra
  'ز': 'fire',   // Zay
  'س': 'air',    // Seen
  'ش': 'fire',   // Sheen
  'ص': 'earth',  // Sad
  'ض': 'earth',  // Dad
  'ط': 'earth',  // Ta
  'ظ': 'fire',   // Dha
  'ع': 'earth',  // Ain
  'غ': 'fire',   // Ghain
  'ف': 'air',    // Fa
  'ق': 'fire',   // Qaf
  'ك': 'air',    // Kaf
  'ل': 'water',  // Lam
  'م': 'water',  // Meem
  'ن': 'water',  // Noon
  'ه': 'air',    // Ha
  'و': 'air',    // Waw
  'ي': 'water',  // Ya
  // Hamza variations
  'أ': 'air',
  'إ': 'air',
  'آ': 'air',
  'ؤ': 'air',
  'ئ': 'water',
  'ة': 'air',    // Ta marbuta
};

/**
 * Element support matrix
 * Determines how elements interact with each other
 */
export const ELEMENT_SUPPORT_MATRIX: Record<MizanElement, Record<MizanElement, 'supportive' | 'opposing' | 'neutral'>> = {
  fire: {
    fire: 'neutral',
    air: 'supportive',
    water: 'opposing',
    earth: 'opposing',
  },
  air: {
    fire: 'supportive',
    air: 'neutral',
    water: 'neutral',
    earth: 'opposing',
  },
  water: {
    fire: 'opposing',
    air: 'neutral',
    water: 'neutral',
    earth: 'supportive',
  },
  earth: {
    fire: 'opposing',
    air: 'opposing',
    water: 'supportive',
    earth: 'neutral',
  },
};
