/**
 * Divine Timing Guidance Types
 * =============================
 * Phase 3: Interactive Question + Guidance Response
 */

import { QuranReflection } from '@/services/QuranReflectionService';
import { DivineTimingResult, IntentionCategory } from './divine-timing';

/**
 * Guidance question categories
 */
export type GuidanceCategory =
  | 'study_exam'
  | 'work_career'
  | 'money_business'
  | 'travel'
  | 'relationships_family'
  | 'health_wellbeing'
  | 'spiritual_practice'
  | 'decisions_general';

/**
 * Time horizon for guidance
 */
export type TimeHorizon = 'today' | 'this_week' | 'this_month';

/**
 * Urgency level
 */
export type UrgencyLevel = 'low' | 'medium' | 'high';

/**
 * Input for guidance generation
 */
export interface GuidanceInput {
  /** User's question */
  questionText: string;
  
  /** Question category */
  category: GuidanceCategory;
  
  /** Time horizon */
  timeHorizon: TimeHorizon;
  
  /** Urgency level */
  urgency: UrgencyLevel;
  
  /** Divine Timing result from Phase 1 */
  divineTimingResult: DivineTimingResult;
  
  /** Optional Qur'an reflection from Phase 2 */
  reflectionVerse?: QuranReflection;
}

/**
 * Guidance response structure
 */
export interface GuidanceResponse {
  /** Summary title (e.g., "Supportive Window") */
  summaryTitle: string;
  
  /** Brief timing signal (1-2 lines) */
  timingSignal: string;
  
  /** Recommended approach (1-3 bullets) */
  recommendedApproach: string[];
  
  /** Watch-outs (0-2 bullets) */
  watchOuts: string[];
  
  /** Single best next step */
  nextStep: string;
  
  /** Optional reflection anchor */
  reflection?: {
    surahNameEn: string;
    surahNumber: number;
    ayahNumber: number;
    prompt: string;
  };
}

/**
 * Guidance history item
 */
export interface GuidanceHistoryItem {
  /** Unique ID */
  id: string;
  
  /** Timestamp */
  timestamp: number;
  
  /** Question asked */
  question: string;
  
  /** Category */
  category: GuidanceCategory;
  
  /** Response received */
  response: GuidanceResponse;
}

/**
 * Stored preferences
 */
export interface GuidancePreferences {
  lastCategory?: GuidanceCategory;
  lastTimeHorizon?: TimeHorizon;
  lastUrgency?: UrgencyLevel;
}

/**
 * Category display info
 */
export interface GuidanceCategoryInfo {
  key: GuidanceCategory;
  label: string;
  labelAr: string;
  icon: string;
  intentionMapping: IntentionCategory;
}
