/**
 * AI Settings & Feature Flag Types
 * =================================
 * Phase 6: Optional AI-assisted reflection
 * 
 * CRITICAL: AI is OFF by default and controlled by user settings.
 * AI NEVER computes timing, elements, or makes decisions.
 * AI only polishes wording and expands reflection.
 */

/**
 * Tone preferences for AI rewriting
 */
export type AITone = 'concise' | 'calm' | 'reflective' | 'poetic';

/**
 * AI feature settings (stored in AsyncStorage)
 */
export interface AISettings {
  /** AI reflection feature enabled */
  enabled: boolean;
  
  /** Preferred tone for AI rewrites */
  tone: AITone;
  
  /** User has acknowledged AI disclaimer */
  disclaimerAcknowledged: boolean;
  
  /** Last updated timestamp */
  updatedAt: number;
}

/**
 * Default AI settings (AI OFF by default)
 */
export const DEFAULT_AI_SETTINGS: AISettings = {
  enabled: false,
  tone: 'calm',
  disclaimerAcknowledged: false,
  updatedAt: Date.now(),
};

/**
 * AI rewrite request
 */
export interface AIRewriteRequest {
  /** Original guidance response from Phase 3 */
  originalGuidance: {
    summaryTitle: string;
    timingSignal: string;
    recommendedApproach: string[];
    watchOuts: string[];
    nextStep: string;
    disclaimer: string;
  };
  
  /** Optional Qur'an reflection context */
  quranContext?: {
    verseReference: string;
    translationEn: string;
  };
  
  /** User's selected tone */
  tone: AITone;
  
  /** Language preference */
  language?: 'en' | 'ar' | 'fr';
}

/**
 * AI rewrite response (preserves structure)
 */
export interface AIRewriteResponse {
  /** Rewritten for clarity, same meaning */
  summaryTitle: string;
  
  /** Rewritten for warmth, same timing quality */
  timingSignal: string;
  
  /** Expanded reflection, same count */
  recommendedApproach: string[];
  
  /** Expanded awareness, same count */
  watchOuts: string[];
  
  /** Same action, clearer wording */
  nextStep: string;
  
  /** Optional Qur'an reflection (if provided) */
  reflection?: {
    verseReference?: string;
    reflectionPrompt: string;
  };
  
  /** Disclaimer MUST be included verbatim */
  disclaimer: string;
  
  /** Indicates AI was used */
  aiAssisted: boolean;
}

/**
 * Istikhārah pattern summary AI rewrite request
 */
export interface IstikharaAIRewriteRequest {
  /** Original pattern summary */
  originalSummary: string;
  
  /** Reflection counts for context */
  counts: {
    totalDays: number;
    calmDays: number;
    uneasyDays: number;
    inclinedDays: number;
    resistantDays: number;
    easeDays: number;
    obstacleDays: number;
  };
  
  /** User's selected tone */
  tone: AITone;
}

/**
 * Istikhārah AI rewrite response
 */
export interface IstikharaAIRewriteResponse {
  /** Rewritten observational summary (NO VERDICTS) */
  observationalSummary: string;
  
  /** Indicates AI was used */
  aiAssisted: boolean;
}
/**
 * Name Destiny AI enhancement request
 */
export interface NameDestinyAIRequest {
  /** Result element */
  element: string;
  
  /** Result Burj (zodiac) */
  burj: string;
  
  /** Result planetary ruler */
  planetaryRuler?: string;
  
  /** User's profile element (from DOB) */
  userElement?: 'fire' | 'water' | 'air' | 'earth';
  
  /** User's profile Burj (from DOB) */
  userBurj?: string;
  
  /** User's location city */
  userLocationCity?: string;
  
  /** User's selected tone */
  tone: AITone;
  
  /** Language preference */
  language?: 'en' | 'ar' | 'fr';
}

/**
 * Name Destiny AI enhancement response
 */
export interface NameDestinyAIResponse {
  /** Enhanced element explanation */
  elementExplanation: string;
  
  /** Enhanced burj explanation */
  burjExplanation: string;
  
  /** Personalized insights (if user profile available) */
  personalizedInsight?: string;
  
  /** Indicates AI was used */
  aiAssisted: boolean;
}

/**
 * Compatibility AI enhancement request
 */
export interface CompatibilityAIRequest {
  /** Person 1 name */
  person1Name: string;
  
  /** Person 2 name */
  person2Name: string;
  
  /** Person 1 element */
  person1Element: 'fire' | 'water' | 'air' | 'earth';
  
  /** Person 2 element */
  person2Element: 'fire' | 'water' | 'air' | 'earth';
  
  /** Overall score (0-100) */
  overallScore: number;
  
  /** Overall quality */
  overallQuality: string;
  
  /** Spiritual destiny score */
  spiritualScore: number;
  
  /** Elemental temperament score */
  elementalScore: number;
  
  /** Planetary cosmic score */
  planetaryScore: number;
  
  /** User's profile element (if available) */
  userElement?: 'fire' | 'water' | 'air' | 'earth';
  
  /** User's profile Burj (if available) */
  userBurj?: string;
  
  /** Relationship context (optional) */
  relationshipType?: 'romantic' | 'friendship' | 'family' | 'business';
  
  /** User's selected tone */
  tone: AITone;
  
  /** Language preference */
  language?: 'en' | 'ar' | 'fr';
}

/**
 * Compatibility AI enhancement response
 */
export interface CompatibilityAIResponse {
  /** Enhanced overall summary */
  enhancedSummary: string;
  
  /** Enhanced spiritual destiny explanation */
  enhancedSpiritualExplanation: string;
  
  /** Enhanced elemental temperament explanation */
  enhancedElementalExplanation: string;
  
  /** Enhanced planetary cosmic explanation */
  enhancedPlanetaryExplanation: string;
  
  /** Personalized relationship insights (if user profile available) */
  personalizedInsight?: string;
  
  /** Indicates AI was used */
  aiAssisted: boolean;
}

/**
 * Calculator AI enhancement request
 */
export interface CalculatorAIRequest {
  /** Calculation type */
  calculationType: 'name' | 'lineage' | 'phrase' | 'quran' | 'dhikr' | 'general';
  
  /** Input text */
  inputText: string;
  
  /** Kabir (grand total) */
  kabir: number;
  
  /** Saghir (digital root) */
  saghir: number;
  
  /** Element */
  element: 'fire' | 'water' | 'air' | 'earth';
  
  /** Burj (zodiac) */
  burj: string;
  
  /** User's profile element (if available) */
  userElement?: 'fire' | 'water' | 'air' | 'earth';
  
  /** User's profile Burj (if available) */
  userBurj?: string;
  
  /** Additional context for specific calculation types */
  context?: {
    // For lineage
    yourName?: string;
    motherName?: string;
    
    // For Quran
    surahName?: string;
    ayahNumber?: number;
    
    // For Dhikr
    divineName?: string;
  };
  
  /** User's selected tone */
  tone: AITone;
  
  /** Language preference */
  language?: 'en' | 'ar' | 'fr';
}

/**
 * Calculator AI enhancement response
 */
export interface CalculatorAIResponse {
  /** Enhanced numerical essence explanation */
  enhancedNumericalExplanation: string;
  
  /** Enhanced element explanation */
  enhancedElementExplanation: string;
  
  /** Enhanced burj explanation */
  enhancedBurjExplanation: string;
  
  /** Type-specific enhanced insight */
  enhancedTypeInsight?: string;
  
  /** Personalized insights (if user profile available) */
  personalizedInsight?: string;
  
  /** Indicates AI was used */
  aiAssisted: boolean;
}

/**
 * Peak Windows AI enhancement request
 */
export interface PeakWindowsAIRequest {
  /** Time segment (preDawn, morning, etc.) */
  segment: 'preDawn' | 'morning' | 'midday' | 'afternoon' | 'evening' | 'night';
  
  /** Harmony score (0-100) */
  harmonyScore: number;
  
  /** Quick guidance text */
  guidance: string;
  
  /** Time range */
  timeRange: {
    start: string;
    end: string;
  };
  
  /** User's profile element (if available) */
  userElement?: 'fire' | 'water' | 'air' | 'earth';
  
  /** User's profile Burj (if available) */
  userBurj?: string;
  
  /** User's location city (if available) */
  userLocationCity?: string;
  
  /** User's selected tone */
  tone: AITone;
  
  /** Language preference */
  language?: 'en' | 'ar' | 'fr';
}

/**
 * Peak Windows AI enhancement response
 */
export interface PeakWindowsAIResponse {
  /** Enhanced time segment explanation */
  enhancedSegmentExplanation: string;
  
  /** Enhanced activity recommendations */
  enhancedActivityRecommendations: string;
  
  /** Enhanced timing wisdom */
  enhancedTimingWisdom: string;
  
  /** Personalized insights (if user profile available) */
  personalizedInsight?: string;
  
  /** Indicates AI was used */
  aiAssisted: boolean;
}