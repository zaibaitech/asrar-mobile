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
