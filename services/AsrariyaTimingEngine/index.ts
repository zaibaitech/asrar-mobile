/**
 * Asrariya Timing Engine
 * =======================
 * 
 * Personalized Spiritual Timing Intelligence System
 * 
 * The engine answers the fundamental question:
 * "Is THIS moment favorable for ME to do THIS practice?"
 * 
 * Architecture:
 * - types.ts: Type definitions and configurations
 * - layers.ts: Individual analysis layers (element, planetary, manazil, practice)
 * - engine.ts: Core synthesis algorithm
 * 
 * @module AsrariyaTimingEngine
 * 
 * @example
 * ```typescript
 * import { analyzeTimingForPractice, quickTimingCheck } from '@/services/AsrariyaTimingEngine';
 * 
 * // Full analysis
 * const result = await analyzeTimingForPractice(
 *   userProfile,
 *   { category: 'protection', divineName: 'Ya Qawiyy' },
 *   { location: { latitude: 33.5, longitude: -7.6 } }
 * );
 * 
 * console.log(result.overallScore);      // 85
 * console.log(result.level);             // 'highly-favorable'
 * console.log(result.reasoning);         // "Excellent timing for your practice! Mars day aligns..."
 * console.log(result.enhancements);      // [{type: 'timing', text: 'Mars hour continues...'}]
 * 
 * // Quick check
 * const quick = await quickTimingCheck(userProfile, 'healing');
 * console.log(quick.isGoodTime);  // true
 * console.log(quick.summary);     // 'Good Time'
 * ```
 */

// Types
export type {
    ActionRecommendation, AlternativeTiming,

    // Configuration
    AsrariyaEngineConfig,
    // Synthesis Results
    AsrariyaTimingResult,
    // Current Moment
    CurrentMoment, Element, ElementCompatibilityResult,
    // Analysis Results
    LayerAnalysisResult, ManazilAlignmentResult, PlanetaryResonanceResult, PlanetaryRuler, PracticeCategory,
    PracticeIntensity, PracticeMappingResult, RecommendationLevel, TimingEnhancement, TimingLevel,
    // User Intent
    UserIntent,
    // User Profile
    UserSpiritalProfile
} from './types';

// Constants
export {
    DEFAULT_ENGINE_CONFIG,
    PRACTICE_WEIGHT_CONFIGS
} from './types';

// Analysis Layers (for advanced usage)
export {
    analyzeElementCompatibility, analyzeManazilAlignment, analyzePlanetaryResonance, analyzePracticeMapping
} from './layers';

// Main Engine Functions
export {
    // Core analysis
    analyzeTimingForPractice, buildCurrentMoment, findNextOptimalWindow,

    // Helpers
    profileToSpiritualProfile,
    // Quick utilities
    quickTimingCheck
} from './engine';

// React Hooks
export {
    useAsrariyaTiming,
    useTimingBadge,
    type UseAsrariyaTimingOptions,
    type UseAsrariyaTimingReturn
} from './useAsrariyaTiming';

// Unified Badge System
export {
    BADGE_CONFIG,
    convertLegacyStatus,
    getBadgeConfigFromLevel,
    getBadgeConfigFromScore,
    getBadgeFromLevel,
    getBadgeFromScore,
    getLevelFromBadge,
    getPercentageLabel,
    isExcellentTime,
    isGoodTime,
    SCORE_THRESHOLDS,
    shouldWait,
    type BadgeConfig,
    type UnifiedBadge
} from './unifiedBadge';

// UI Components
export {
    PracticeTimingCard,
    TimingBadge
} from './PracticeTimingCard';
