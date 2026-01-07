/**
 * Enhanced Calculator Type Definitions
 * Complete type system for ʿIlm al-Asrār Calculator
 */

import { ElementType } from '../utils/types';

// ============================================================================
// CALCULATION TYPES
// ============================================================================

export type CalculationType = 
  | 'name'           // Single name
  | 'lineage'        // Name + Mother (+ Father)
  | 'phrase'         // Sentence/phrase
  | 'quran'          // Qur'an ayah
  | 'dhikr'          // Divine Name or dhikr
  | 'general';       // Raw letters

export type UnifiedInputType = 'name' | 'phrase' | 'quran' | 'custom';

// ============================================================================
// INPUT METADATA
// ============================================================================

export interface InputMetadata {
  raw: string;
  normalized: string;
  languageDetected: 'arabic' | 'latin' | 'mixed';
  inputType: UnifiedInputType;
  calculatedFrom?: string;
  calculationNote?: string;
  warning?: string;
  
  // Type-specific metadata
  sourceMeta?: {
    // For lineage
    yourName?: string;
    motherName?: string;
    fatherName?: string;
    
    // For Qur'an
    surahNumber?: number;
    ayahNumber?: number;
    surahName?: string;
    ayahText?: string;
    
    // For Dhikr
    divineName?: string;
    divineNameArabic?: string;
  };
}

// ============================================================================
// CORE RESULTS (shared by all types)
// ============================================================================

export interface CoreResults {
  kabir: number;           // Abjad total
  saghir: number;          // Digital root
  hadadMod4: number;       // Ḥadath remainder (0-3)
  burj: string;            // Zodiac sign
  element: ElementType;    // Primary element
  sirr: number;            // Kabīr - Ṣaghīr
  wusta: number;           // (Kabīr + Ṣaghīr) / 2
  kamal: number;           // Kabīr + Ṣaghīr
  bast: number;            // Kabīr × Ṣaghīr
}

// ============================================================================
// ANALYTICS (shared)
// ============================================================================

export interface LetterFrequency {
  letter: string;
  count: number;
  value: number;
  element: ElementType;
}

export interface ElementalAnalytics {
  letterFreq: LetterFrequency[];
  elementPercents: {
    fire: number;
    water: number;
    air: number;
    earth: number;
  };
  dominantElement: ElementType;
  weakElement: ElementType | null;
  balanceScore: number; // 0-100
}

// ============================================================================
// TYPE-SPECIFIC OUTPUTS
// ============================================================================

export interface NameInsights {
  archetypeTitle: string;
  spiritualGuidance: string;
  divineNameConnection: {
    name: string;
    arabic: string;
    value: number;
    distance: number;
  }[];
  recommendedDhikrCount: number[];
  bestTimeWindow: string;
  powerDay: string;
}

export interface LineageInsights {
  yourNameValue: number;
  motherNameValue: number;
  fatherNameValue?: number;
  combinedTotal: number;
  familyPattern: {
    harmony: 'support' | 'neutral' | 'tension';
    elementInteractionKey: string; // Translation key instead of English text
  };
  keyTakeawaysKeys: string[]; // Translation keys instead of English texts
  practicePlan: {
    doList: string[]; // Translation keys instead of English texts
    avoidList: string[]; // Translation keys instead of English texts
    bestTimeKey: string; // Translation key instead of English text
  };
  // Store element and saghir for variable interpolation
  combinedElement: ElementType;
  combinedSaghir: number;
}

export interface PhraseInsights {
  themeDetection: {
    dominantElement: ElementType;
    repeatedLetters: { letter: string; count: number }[];
    sacredNumberNear: number | null;
  };
  structureInsights: {
    topRepeatedLetters: { letter: string; count: number; element: ElementType }[];
    centerLetter: string;
    centerSignificanceKey: string; // Translation key instead of English text
  };
  reflectionPromptsKeys: string[]; // Translation keys instead of English texts
}

export interface QuranInsights {
  surahName?: string;
  ayahNumber?: number;
  arabicText?: string;
  translationSnippet?: string;
  resonanceLink: {
    dominantElement: ElementType;
    sacredNumber: number;
    meaningKey: string;      // Translation key for sacred meaning
    descriptionKey: string;  // Translation key for description template
    /** Flag indicating this is calculated from Kabīr, not suggested */
    isCalculated?: boolean;
    /** The actual Kabīr value of the verse */
    kabir?: number;
    /** Distance from nearest sacred number */
    distance?: number;
  };
  reflectionBlock: {
    promptKey: string;  // Translation key for reflection prompt
    userNotes?: string; // Store locally
  };
  quranComLink?: string;
}

export interface DhikrInsights {
  selectedDivineName?: {
    arabic: string;
    transliteration: string;
    abjadValue: number;
    matchStrength: 'exact' | 'near' | 'distant';
  };
  suggestedCounts: {
    valueBased: number | null;
    traditional: number[]; // 33, 99, 100
  };
  timing: {
    planetDay?: string;
    afterSalah: string[];
  };
  practiceGuidance: {
    preparation: string[];
    adab: string[];
  };
}

export interface GeneralInsights {
  letterFrequencyChart: LetterFrequency[];
  elementalBalance: {
    composition: { [key in ElementType]: number };
    advice: string;
  };
  sacredResonance: {
    nearest: number;
    meaning: string;
    distance: number;
  };
  advancedMethods: {
    wusta: { value: number; element: ElementType };
    kamal: { value: number; element: ElementType };
    bast: { value: number; element: ElementType };
  };
}

// ============================================================================
// UNIFIED CALCULATION REQUEST
// ============================================================================

export interface CalculationRequest {
  type: CalculationType;
  
  // Input options
  arabicInput?: string;
  latinInput?: string;
  
  // Type-specific inputs
  yourName?: string;
  motherName?: string;
  fatherName?: string;
  
  surahNumber?: number;
  ayahNumber?: number;
  pastedAyahText?: string;
  
  divineNameId?: string;
  dhikrText?: string;
  
  // Processing options
  removeVowels?: boolean;
  ignorePunctuation?: boolean;
  ignoreSpaces?: boolean;
  system: 'maghribi' | 'mashriqi';
}

// ============================================================================
// UNIFIED CALCULATION RESULT
// ============================================================================

export interface EnhancedCalculationResult {
  id: string;
  timestamp: number;
  type: CalculationType;
  
  input: InputMetadata;
  core: CoreResults;
  analytics: ElementalAnalytics;
  
  // Type-specific sections (only one will be populated)
  nameInsights?: NameInsights;
  lineageInsights?: LineageInsights;
  phraseInsights?: PhraseInsights;
  quranInsights?: QuranInsights;
  dhikrInsights?: DhikrInsights;
  generalInsights?: GeneralInsights;
  
  // Legacy compatibility
  system: 'maghribi' | 'mashriqi';
}

// ============================================================================
// CALCULATION OPTIONS
// ============================================================================

export interface CalculationOptions {
  removeVowels: boolean;
  ignorePunctuation: boolean;
  ignoreSpaces: boolean;
}
