/**
 * Enhanced Divine Names with Compatibility Metadata
 * Complete 99 Names (Al-Asmā' al-Ḥusnā) - converted from existing data
 * Based on classical ʿIlm al-Asrār tradition
 * 
 * NOTE: Abjad values are calculated from the NAME ONLY (without Al-/Ar-/As- prefix)
 * e.g., "Al-Laṭīf" → calculate "Laṭīf" (ل ط ي ف) only
 */

import { ABJAD_MAGHRIBI } from '../../constants/abjad-maps';
import { DIVINE_NAMES, DivineName } from '../../data/divine-names';
import { DivineNameMetadata, IntentionCategory } from './types';

// Compatibility metadata mapping for each Divine Name
const COMPATIBILITY_METADATA: Record<number, {
  element: 'fire' | 'water' | 'air' | 'earth';
  planet: string;
  modeOfAction: 'fast' | 'gradual' | 'hidden';
  classicalFunction: IntentionCategory[];
}> = {
  1: { element: 'water', planet: 'Moon', modeOfAction: 'hidden', classicalFunction: ['healing', 'peace', 'forgiveness'] },
  2: { element: 'water', planet: 'Venus', modeOfAction: 'hidden', classicalFunction: ['forgiveness', 'healing', 'peace'] },
  3: { element: 'fire', planet: 'Sun', modeOfAction: 'fast', classicalFunction: ['strength', 'protection', 'guidance'] },
  4: { element: 'air', planet: 'Mercury', modeOfAction: 'fast', classicalFunction: ['clarity', 'guidance', 'knowledge'] },
  5: { element: 'water', planet: 'Venus', modeOfAction: 'hidden', classicalFunction: ['peace', 'healing', 'protection'] },
  6: { element: 'earth', planet: 'Saturn', modeOfAction: 'gradual', classicalFunction: ['protection', 'patience'] },
  7: { element: 'fire', planet: 'Mars', modeOfAction: 'fast', classicalFunction: ['strength', 'protection'] },
  8: { element: 'fire', planet: 'Mars', modeOfAction: 'fast', classicalFunction: ['strength', 'protection', 'provision'] },
  9: { element: 'air', planet: 'Jupiter', modeOfAction: 'fast', classicalFunction: ['knowledge', 'guidance'] },
  10: { element: 'air', planet: 'Jupiter', modeOfAction: 'fast', classicalFunction: ['clarity', 'knowledge', 'guidance'] },
  11: { element: 'fire', planet: 'Sun', modeOfAction: 'fast', classicalFunction: ['strength', 'guidance'] },
  12: { element: 'earth', planet: 'Saturn', modeOfAction: 'gradual', classicalFunction: ['strength', 'patience'] },
  13: { element: 'air', planet: 'Mercury', modeOfAction: 'fast', classicalFunction: ['knowledge', 'clarity'] },
  14: { element: 'water', planet: 'Moon', modeOfAction: 'hidden', classicalFunction: ['forgiveness', 'healing', 'peace'] },
  15: { element: 'fire', planet: 'Mars', modeOfAction: 'fast', classicalFunction: ['strength', 'protection'] },
  16: { element: 'water', planet: 'Venus', modeOfAction: 'hidden', classicalFunction: ['peace', 'patience'] },
  17: { element: 'earth', planet: 'Jupiter', modeOfAction: 'gradual', classicalFunction: ['provision', 'strength'] },
  18: { element: 'air', planet: 'Mercury', modeOfAction: 'fast', classicalFunction: ['clarity', 'provision', 'guidance'] },
  19: { element: 'air', planet: 'Mercury', modeOfAction: 'fast', classicalFunction: ['knowledge', 'clarity'] },
  20: { element: 'earth', planet: 'Saturn', modeOfAction: 'gradual', classicalFunction: ['patience', 'strength'] },
  21: { element: 'air', planet: 'Jupiter', modeOfAction: 'fast', classicalFunction: ['provision', 'peace'] },
  22: { element: 'earth', planet: 'Saturn', modeOfAction: 'gradual', classicalFunction: ['patience', 'protection'] },
  23: { element: 'fire', planet: 'Mars', modeOfAction: 'fast', classicalFunction: ['strength', 'protection'] },
  24: { element: 'water', planet: 'Moon', modeOfAction: 'hidden', classicalFunction: ['healing', 'forgiveness'] },
  25: { element: 'fire', planet: 'Mars', modeOfAction: 'fast', classicalFunction: ['strength', 'protection'] },
  26: { element: 'fire', planet: 'Sun', modeOfAction: 'fast', classicalFunction: ['strength', 'guidance'] },
  27: { element: 'air', planet: 'Mercury', modeOfAction: 'fast', classicalFunction: ['knowledge', 'clarity'] },
  28: { element: 'air', planet: 'Jupiter', modeOfAction: 'fast', classicalFunction: ['knowledge', 'guidance'] },
  29: { element: 'air', planet: 'Mercury', modeOfAction: 'fast', classicalFunction: ['clarity', 'knowledge'] },
  30: { element: 'air', planet: 'Mercury', modeOfAction: 'fast', classicalFunction: ['knowledge', 'clarity'] },
  31: { element: 'water', planet: 'Venus', modeOfAction: 'hidden', classicalFunction: ['healing', 'clarity', 'peace'] },
  32: { element: 'air', planet: 'Mercury', modeOfAction: 'fast', classicalFunction: ['knowledge', 'clarity', 'guidance'] },
  33: { element: 'fire', planet: 'Sun', modeOfAction: 'fast', classicalFunction: ['strength', 'guidance'] },
  34: { element: 'fire', planet: 'Sun', modeOfAction: 'fast', classicalFunction: ['strength', 'guidance'] },
  35: { element: 'water', planet: 'Venus', modeOfAction: 'hidden', classicalFunction: ['forgiveness', 'peace'] },
  36: { element: 'fire', planet: 'Sun', modeOfAction: 'fast', classicalFunction: ['strength', 'guidance'] },
  37: { element: 'water', planet: 'Moon', modeOfAction: 'hidden', classicalFunction: ['patience', 'peace'] },
  38: { element: 'water', planet: 'Venus', modeOfAction: 'hidden', classicalFunction: ['forgiveness', 'peace'] },
  39: { element: 'fire', planet: 'Mars', modeOfAction: 'fast', classicalFunction: ['strength', 'protection'] },
  40: { element: 'air', planet: 'Jupiter', modeOfAction: 'fast', classicalFunction: ['knowledge', 'guidance'] },
  41: { element: 'air', planet: 'Jupiter', modeOfAction: 'fast', classicalFunction: ['knowledge', 'guidance'] },
  42: { element: 'air', planet: 'Jupiter', modeOfAction: 'fast', classicalFunction: ['clarity', 'guidance', 'knowledge'] },
  43: { element: 'air', planet: 'Mercury', modeOfAction: 'fast', classicalFunction: ['knowledge', 'clarity'] },
  44: { element: 'fire', planet: 'Sun', modeOfAction: 'fast', classicalFunction: ['strength', 'guidance'] },
  45: { element: 'water', planet: 'Venus', modeOfAction: 'hidden', classicalFunction: ['peace', 'patience'] },
  46: { element: 'fire', planet: 'Sun', modeOfAction: 'fast', classicalFunction: ['strength', 'guidance'] },
  47: { element: 'water', planet: 'Moon', modeOfAction: 'hidden', classicalFunction: ['peace', 'patience'] },
  48: { element: 'air', planet: 'Jupiter', modeOfAction: 'fast', classicalFunction: ['guidance', 'knowledge'] },
  49: { element: 'air', planet: 'Jupiter', modeOfAction: 'fast', classicalFunction: ['knowledge', 'guidance'] },
  50: { element: 'fire', planet: 'Sun', modeOfAction: 'fast', classicalFunction: ['strength', 'guidance'] },
  51: { element: 'fire', planet: 'Sun', modeOfAction: 'fast', classicalFunction: ['clarity', 'strength', 'guidance'] },
  52: { element: 'earth', planet: 'Saturn', modeOfAction: 'gradual', classicalFunction: ['protection', 'patience', 'peace'] },
  53: { element: 'fire', planet: 'Mars', modeOfAction: 'fast', classicalFunction: ['strength', 'protection'] },
  54: { element: 'fire', planet: 'Sun', modeOfAction: 'fast', classicalFunction: ['strength', 'guidance'] },
  55: { element: 'water', planet: 'Venus', modeOfAction: 'hidden', classicalFunction: ['peace', 'patience'] },
  56: { element: 'air', planet: 'Mercury', modeOfAction: 'fast', classicalFunction: ['knowledge', 'clarity'] },
  57: { element: 'air', planet: 'Mercury', modeOfAction: 'fast', classicalFunction: ['knowledge', 'clarity'] },
  58: { element: 'earth', planet: 'Saturn', modeOfAction: 'gradual', classicalFunction: ['patience', 'peace'] },
  59: { element: 'air', planet: 'Mercury', modeOfAction: 'fast', classicalFunction: ['knowledge', 'clarity'] },
  60: { element: 'earth', planet: 'Saturn', modeOfAction: 'gradual', classicalFunction: ['patience', 'protection'] },
  61: { element: 'fire', planet: 'Mars', modeOfAction: 'fast', classicalFunction: ['strength', 'protection'] },
  62: { element: 'fire', planet: 'Mars', modeOfAction: 'fast', classicalFunction: ['strength', 'guidance'] },
  63: { element: 'earth', planet: 'Saturn', modeOfAction: 'gradual', classicalFunction: ['patience'] },
  64: { element: 'fire', planet: 'Sun', modeOfAction: 'fast', classicalFunction: ['strength', 'guidance'] },
  65: { element: 'fire', planet: 'Sun', modeOfAction: 'fast', classicalFunction: ['strength', 'guidance'] },
  66: { element: 'earth', planet: 'Saturn', modeOfAction: 'gradual', classicalFunction: ['patience', 'strength'] },
  67: { element: 'fire', planet: 'Sun', modeOfAction: 'fast', classicalFunction: ['strength', 'guidance'] },
  68: { element: 'water', planet: 'Venus', modeOfAction: 'hidden', classicalFunction: ['forgiveness', 'peace'] },
  69: { element: 'fire', planet: 'Mars', modeOfAction: 'fast', classicalFunction: ['strength', 'protection'] },
  70: { element: 'air', planet: 'Mercury', modeOfAction: 'fast', classicalFunction: ['knowledge', 'clarity'] },
  71: { element: 'earth', planet: 'Saturn', modeOfAction: 'gradual', classicalFunction: ['patience', 'strength'] },
  72: { element: 'fire', planet: 'Sun', modeOfAction: 'fast', classicalFunction: ['strength', 'guidance'] },
  73: { element: 'fire', planet: 'Sun', modeOfAction: 'fast', classicalFunction: ['guidance', 'clarity'] },
  74: { element: 'earth', planet: 'Saturn', modeOfAction: 'gradual', classicalFunction: ['patience', 'strength'] },
  75: { element: 'earth', planet: 'Saturn', modeOfAction: 'gradual', classicalFunction: ['patience', 'strength'] },
  76: { element: 'earth', planet: 'Saturn', modeOfAction: 'gradual', classicalFunction: ['patience', 'strength'] },
  77: { element: 'fire', planet: 'Sun', modeOfAction: 'fast', classicalFunction: ['strength', 'guidance'] },
  78: { element: 'air', planet: 'Jupiter', modeOfAction: 'fast', classicalFunction: ['provision', 'strength'] },
  79: { element: 'fire', planet: 'Mars', modeOfAction: 'fast', classicalFunction: ['strength', 'protection'] },
  80: { element: 'water', planet: 'Venus', modeOfAction: 'hidden', classicalFunction: ['forgiveness', 'peace'] },
  81: { element: 'fire', planet: 'Mars', modeOfAction: 'fast', classicalFunction: ['strength', 'protection'] },
  82: { element: 'water', planet: 'Venus', modeOfAction: 'hidden', classicalFunction: ['forgiveness', 'peace'] },
  83: { element: 'fire', planet: 'Sun', modeOfAction: 'fast', classicalFunction: ['guidance', 'clarity'] },
  84: { element: 'fire', planet: 'Sun', modeOfAction: 'fast', classicalFunction: ['guidance', 'clarity'] },
  85: { element: 'air', planet: 'Jupiter', modeOfAction: 'fast', classicalFunction: ['provision', 'strength'] },
  86: { element: 'fire', planet: 'Sun', modeOfAction: 'fast', classicalFunction: ['strength', 'guidance'] },
  87: { element: 'fire', planet: 'Sun', modeOfAction: 'fast', classicalFunction: ['strength', 'guidance'] },
  88: { element: 'air', planet: 'Jupiter', modeOfAction: 'fast', classicalFunction: ['provision', 'strength'] },
  89: { element: 'fire', planet: 'Sun', modeOfAction: 'fast', classicalFunction: ['guidance', 'clarity'] },
  90: { element: 'earth', planet: 'Saturn', modeOfAction: 'gradual', classicalFunction: ['strength', 'patience'] },
  91: { element: 'fire', planet: 'Mars', modeOfAction: 'fast', classicalFunction: ['strength', 'protection'] },
  92: { element: 'fire', planet: 'Mars', modeOfAction: 'fast', classicalFunction: ['strength', 'protection'] },
  93: { element: 'fire', planet: 'Sun', modeOfAction: 'fast', classicalFunction: ['guidance', 'clarity'] },
  94: { element: 'fire', planet: 'Sun', modeOfAction: 'fast', classicalFunction: ['guidance', 'clarity'] },
  95: { element: 'fire', planet: 'Sun', modeOfAction: 'fast', classicalFunction: ['guidance', 'clarity'] },
  96: { element: 'earth', planet: 'Saturn', modeOfAction: 'gradual', classicalFunction: ['patience', 'strength'] },
  97: { element: 'fire', planet: 'Sun', modeOfAction: 'fast', classicalFunction: ['strength', 'guidance'] },
  98: { element: 'fire', planet: 'Sun', modeOfAction: 'fast', classicalFunction: ['strength', 'guidance'] },
  99: { element: 'earth', planet: 'Saturn', modeOfAction: 'gradual', classicalFunction: ['patience', 'peace', 'strength'] }
};

// Function to normalize Divine Name for Abjad calculation (remove prefix)
function normalizeName(arabic: string): string {
  return arabic
    .replace(/^الـ/, '')  // Remove الـ
    .replace(/^ال/, '')   // Remove ال  
    .replace(/^اﻟ/, '')   // Remove اﻟ
    .trim();
}

// Function to calculate Abjad total from Arabic text
function calculateAbjadTotal(text: string): number {
  // Normalize: remove diacritics and spaces
  const normalized = text.replace(/[ًٌٍَُِّْ\s]/g, '');
  return [...normalized].reduce((sum, char) => sum + (ABJAD_MAGHRIBI[char] || 0), 0);
}

// Function to get normalized abjad value for Divine Name
export function getNormalizedAbjadValue(arabic: string): number {
  const normalizedName = normalizeName(arabic);
  return calculateAbjadTotal(normalizedName);
}

// Convert existing Divine Names to compatibility format
export const DIVINE_NAMES_COMPATIBILITY: DivineNameMetadata[] = DIVINE_NAMES.map((name: DivineName): DivineNameMetadata => {
  const metadata = COMPATIBILITY_METADATA[name.number];
  
  if (!metadata) {
    throw new Error(`Missing compatibility metadata for Divine Name ${name.number}: ${name.arabic}`);
  }
  
  return {
    number: name.number,
    arabic: name.arabic,
    transliteration: name.transliteration,
    abjadValue: getNormalizedAbjadValue(name.arabic), // Recalculated without Al- prefix
    element: metadata.element,
    planet: metadata.planet,
    modeOfAction: metadata.modeOfAction,
    classicalFunction: metadata.classicalFunction,
    meaning: {
      en: name.meaning.en,
      ar: name.meaning.en // Using English for Arabic field for now
    },
    spiritualInfluence: {
      en: name.spiritualInfluence.en,
      ar: name.spiritualInfluence.en // Using English for Arabic field for now
    }
  };
});

// Helper functions
export function getDivineNameByNumber(number: number): DivineNameMetadata | undefined {
  return DIVINE_NAMES_COMPATIBILITY.find(n => n.number === number);
}

export function getDivineNamesByIntention(intention: IntentionCategory): DivineNameMetadata[] {
  return DIVINE_NAMES_COMPATIBILITY.filter(n => 
    n.classicalFunction.includes(intention)
  );
}

export function getAllCompatibilityDivineNames(): DivineNameMetadata[] {
  return DIVINE_NAMES_COMPATIBILITY;
}

// Function to get normalized name for calculation
export function getNormalizedNameForCalculation(arabic: string): string {
  return normalizeName(arabic);
}