/**
 * Asrariya Timing Engine - Types
 * ==============================
 * Core type definitions for the personalized spiritual timing intelligence system
 * 
 * The engine answers: "Is THIS moment favorable for ME to do THIS practice?"
 * 
 * @module AsrariyaTimingEngine/types
 */

import type { ElementType } from '@/contexts/ThemeContext';
import type { LunarMansion } from '@/data/lunarMansions';
import type { Planet } from '@/services/PlanetaryHoursService';

// ============================================================================
// USER PROFILE TYPES
// ============================================================================

export type Element = ElementType;

export type PlanetaryRuler = 'sun' | 'moon' | 'mercury' | 'venus' | 'mars' | 'jupiter' | 'saturn';

export interface UserSpiritalProfile {
  /** User's name (Arabic) */
  name: string;
  
  /** Mother's name (Arabic, optional) */
  motherName?: string;
  
  /** User's zodiac sign (1-12) */
  burjIndex?: number;
  
  /** User's zodiac name */
  burjName?: string;
  
  /** User's dominant element (from name calculation) */
  element: Element;
  
  /** User's zodiac ruling planet */
  rulingPlanet?: PlanetaryRuler;
  
  /** User's personal manazil (from name calculation, 0-27) */
  personalManazil?: number;
  
  /** User's ascendant/rising sign index (0-11) */
  ascendantIndex?: number;
  
  /** User's ascendant element */
  ascendantElement?: Element;
}

// ============================================================================
// CURRENT MOMENT TYPES
// ============================================================================

export interface CurrentMoment {
  /** Current timestamp */
  timestamp: Date;
  
  /** Day of week (0=Sunday, 6=Saturday) */
  dayOfWeek: number;
  
  /** Day ruler planet */
  dayRuler: Planet;
  
  /** Day ruler element */
  dayElement: Element;
  
  /** Current planetary hour planet */
  planetaryHourPlanet: Planet;
  
  /** Current planetary hour element */
  planetaryHourElement: Element;
  
  /** Time remaining in current planetary hour (seconds) */
  planetaryHourRemainingSeconds: number;
  
  /** Current lunar mansion (0-27) */
  currentManazil: number;
  
  /** Current lunar mansion data */
  currentManazilData?: LunarMansion;
  
  /** Moon phase */
  moonPhase?: 'new' | 'waxing-crescent' | 'first-quarter' | 'waxing-gibbous' | 
              'full' | 'waning-gibbous' | 'last-quarter' | 'waning-crescent';
  
  /** Lunar day (1-30) */
  lunarDay?: number;
}

// ============================================================================
// USER INTENT / PRACTICE TYPES
// ============================================================================

export type PracticeCategory = 
  | 'protection'
  | 'healing'
  | 'manifestation'
  | 'guidance'
  | 'gratitude'
  | 'repentance'
  | 'knowledge'
  | 'provision'
  | 'relationship'
  | 'general';

export type PracticeIntensity = 'light' | 'moderate' | 'deep';

export interface UserIntent {
  /** Primary practice category */
  category: PracticeCategory;
  
  /** Specific dhikr or practice name (optional) */
  specificPractice?: string;
  
  /** Divine Name if applicable */
  divineName?: string;
  
  /** Intended duration in minutes */
  durationMinutes?: number;
  
  /** Practice intensity */
  intensity?: PracticeIntensity;
}

// ============================================================================
// ANALYSIS LAYER RESULTS
// ============================================================================

export interface LayerAnalysisResult {
  /** Score for this layer (0-100) */
  score: number;
  
  /** Short reasoning for this layer */
  reasoning: string;
  
  /** Arabic reasoning */
  reasoningAr?: string;
  
  /** French reasoning */
  reasoningFr?: string;
  
  /** Raw factors used in calculation */
  factors?: Record<string, number | string | boolean>;
}

export interface ElementCompatibilityResult extends LayerAnalysisResult {
  /** User's element */
  userElement: Element;
  
  /** Current time element */
  momentElement: Element;
  
  /** Relationship type */
  relationship: 'same' | 'complementary' | 'neutral' | 'tension';
}

export interface PlanetaryResonanceResult extends LayerAnalysisResult {
  /** Day ruler resonance score */
  dayRulerScore: number;
  
  /** Planetary hour resonance score */
  planetaryHourScore: number;
  
  /** User's ruling planet matches day ruler? */
  dayRulerMatch: boolean;
  
  /** User's ruling planet matches planetary hour? */
  planetaryHourMatch: boolean;
}

export interface ManazilAlignmentResult extends LayerAnalysisResult {
  /** User's personal manazil index */
  personalManazil?: number;
  
  /** Current manazil index */
  currentManazil: number;
  
  /** Element match */
  elementMatch: boolean;
  
  /** Theme compatibility with intent */
  themeCompatibility: 'favorable' | 'neutral' | 'cautious';
}

export interface PracticeMappingResult extends LayerAnalysisResult {
  /** Is practice suitable for current timing? */
  suitable: boolean;
  
  /** Suggested adjustments */
  adjustments: string[];
  
  /** Alternative practices if not suitable */
  alternatives?: string[];
}

// ============================================================================
// SYNTHESIS RESULTS
// ============================================================================

/**
 * Simple timing level for UI display
 */
export type TimingLevel = 
  | 'optimal'       // 80-100: Excellent time
  | 'favorable'     // 65-79: Good time  
  | 'moderate'      // 45-64: Proceed with awareness
  | 'challenging'   // 25-44: Consider waiting
  | 'avoid';        // 0-24: Best to wait

export type RecommendationLevel = 
  | 'highly-favorable'    // 75-100: Excellent time (OPTIMAL)
  | 'favorable'           // 55-74: Good time (ACT)
  | 'moderate'            // 40-54: Proceed with awareness (MAINTAIN)
  | 'cautious'            // 25-39: Consider waiting (CAREFUL)
  | 'challenging';        // 0-24: Best to wait (HOLD)

export type ActionRecommendation = 
  | 'proceed'             // Green light
  | 'proceed-with-care'   // Yellow - some cautions
  | 'wait'                // Red - not optimal
  | 'modify';             // Adjust the practice

export interface TimingEnhancement {
  /** Enhancement type */
  type: 'direction' | 'dhikr' | 'stone' | 'timing' | 'ayah' | 'preparation';
  
  /** Enhancement text */
  text: string;
  
  /** Arabic text */
  textAr?: string;
  
  /** French text */
  textFr?: string;
  
  /** Optional icon */
  icon?: string;
}

export interface AlternativeTiming {
  /** When this window starts */
  startTime: Date;
  
  /** When this window ends */
  endTime: Date;
  
  /** Expected score for this window */
  expectedScore: number;
  
  /** Brief description */
  description: string;
}

export interface AsrariyaTimingResult {
  /** Overall score (0-100) */
  overallScore: number;
  
  /** Recommendation level */
  level: RecommendationLevel;
  
  /** Action recommendation */
  action: ActionRecommendation;
  
  /** Confidence in the recommendation */
  confidence: 'high' | 'medium' | 'low';
  
  /** Main reasoning text */
  reasoning: string;
  
  /** Arabic reasoning */
  reasoningAr?: string;
  
  /** French reasoning */
  reasoningFr?: string;
  
  /** Short summary (for UI badges) */
  shortSummary: string;
  
  /** Individual layer results */
  layers: {
    elementCompatibility: ElementCompatibilityResult;
    planetaryResonance: PlanetaryResonanceResult;
    manazilAlignment: ManazilAlignmentResult;
    practiceMapping: PracticeMappingResult;
  };
  
  /** Recommended enhancements */
  enhancements: TimingEnhancement[];
  
  /** Cautions to be aware of */
  cautions: string[];
  
  /** Better timing alternatives (if current is suboptimal) */
  alternativeTimings?: AlternativeTiming[];
  
  /** Optimal window end time (if currently in good window) */
  optimalWindowEnd?: Date;
  
  /** Timestamp of analysis */
  analyzedAt: Date;
}

// ============================================================================
// ENGINE CONFIGURATION
// ============================================================================

export interface AsrariyaEngineConfig {
  /** Weight for element compatibility (0-1) */
  elementWeight: number;
  
  /** Weight for planetary resonance (0-1) */
  planetaryWeight: number;
  
  /** Weight for manazil alignment (0-1) */
  manazilWeight: number;
  
  /** Weight for practice mapping (0-1) */
  practiceWeight: number;
  
  /** Minimum score to recommend proceeding */
  minimumProceedScore: number;
  
  /** Include alternative timing suggestions */
  includeAlternatives: boolean;
  
  /** Number of hours to look ahead for alternatives */
  alternativeLookAheadHours: number;
  
  /** Language for generated text */
  language: 'en' | 'ar' | 'fr';
}

/**
 * Default engine configuration
 */
export const DEFAULT_ENGINE_CONFIG: AsrariyaEngineConfig = {
  elementWeight: 0.30,
  planetaryWeight: 0.30,
  manazilWeight: 0.20,
  practiceWeight: 0.20,
  minimumProceedScore: 50,
  includeAlternatives: true,
  alternativeLookAheadHours: 24,
  language: 'en',
};

/**
 * Practice-specific weight configurations
 */
export const PRACTICE_WEIGHT_CONFIGS: Partial<Record<PracticeCategory, Partial<AsrariyaEngineConfig>>> = {
  protection: {
    elementWeight: 0.25,
    planetaryWeight: 0.40, // Mars/Saturn hours more important
    manazilWeight: 0.20,
    practiceWeight: 0.15,
  },
  healing: {
    elementWeight: 0.35, // Water element harmony important
    planetaryWeight: 0.25,
    manazilWeight: 0.25,
    practiceWeight: 0.15,
  },
  manifestation: {
    elementWeight: 0.20,
    planetaryWeight: 0.30,
    manazilWeight: 0.30, // Manazil timing critical
    practiceWeight: 0.20,
  },
  knowledge: {
    elementWeight: 0.25,
    planetaryWeight: 0.35, // Mercury/Jupiter hours important
    manazilWeight: 0.20,
    practiceWeight: 0.20,
  },
  provision: {
    elementWeight: 0.25,
    planetaryWeight: 0.30,
    manazilWeight: 0.30, // Manazil for rizq
    practiceWeight: 0.15,
  },
};
