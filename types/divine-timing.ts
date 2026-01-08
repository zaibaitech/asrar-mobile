/**
 * Divine Timing Type Definitions
 * ===============================
 * Types for the Divine Timing spiritual reflection system
 * 
 * IMPORTANT: Divine Timing provides reflective guidance only.
 * It does NOT predict outcomes or replace religious practices.
 */

// ============================================================================
// INPUT TYPES
// ============================================================================

/**
 * User intention categories for Divine Timing reflection
 */
export type IntentionCategory =
  | 'start'         // Beginning new ventures
  | 'travel'        // Journey or movement
  | 'communication' // Dialogue, writing, speaking
  | 'relationship'  // Connection, partnership
  | 'study'         // Learning, contemplation
  | 'rest'          // Pause, recovery
  | 'custom';       // General reflection

/**
 * User's Abjad calculation results
 */
export interface UserAbjadResult {
  /** Grand total */
  kabir: number;
  
  /** Digital root (1-9) */
  saghir: number;
  
  /** Hadad value (0-3, from kabir % 4) */
  hadad: number;
  
  /** Dominant element from Abjad analysis */
  dominantElement: 'fire' | 'water' | 'air' | 'earth';
}

/**
 * Current date context for timing calculation
 */
export interface DateContext {
  /** Day of week (0=Sunday, 6=Saturday) */
  dayOfWeek: number;
  
  /** Date in YYYY-MM-DD format */
  date: string;
}

/**
 * Complete input for Divine Timing calculation
 */
export interface DivineTimingInput {
  /** User's Abjad results */
  userAbjadResult: UserAbjadResult;
  
  /** Current date context */
  currentDate: DateContext;
  
  /** User's stated intention category */
  userIntentionCategory: IntentionCategory;
}

// ============================================================================
// OUTPUT TYPES
// ============================================================================

/**
 * Overall timing quality assessment
 */
export type TimingQuality = 
  | 'favorable'  // Conditions align well
  | 'neutral'    // Mixed or balanced conditions
  | 'delicate';  // Proceed with caution

/**
 * Cycle state based on Hadad (mod 4)
 */
export type CycleState =
  | 'completion / closure'  // Hadad 0: Endings, reflection
  | 'initiation'            // Hadad 1: Beginnings, fire energy
  | 'growth / expansion'    // Hadad 2: Building, development
  | 'review / restraint';   // Hadad 3: Assessment, patience

/**
 * Elemental tone for the day
 */
export type ElementalTone = 'fire' | 'water' | 'air' | 'earth';

/**
 * Guidance level for action
 */
export type GuidanceLevel =
  | 'act'      // Energy supports action
  | 'slow'     // Proceed with deliberation
  | 'observe'; // Favor reflection over action

/**
 * Divine Timing calculation result
 */
export interface DivineTimingResult {
  /** Overall timing quality */
  timingQuality: TimingQuality;
  
  /** Current cycle state */
  cycleState: CycleState;
  
  /** Elemental tone for reflection */
  elementalTone: ElementalTone;
  
  /** Suggested guidance level */
  guidanceLevel: GuidanceLevel;
  
  /** Short reflective message (neutral, non-authoritative) */
  shortMessage: string;
  
  /** Translation keys for localized messages */
  messageKeys?: {
    /** Base quality message key (e.g., "supportive_reflection") */
    qualityKey: string;
    /** Cycle addition key (e.g., "ongoing_efforts") */
    cycleKey: string;
  };
  
  /** Input context (for debugging/display) */
  context?: {
    hadad: number;
    dominantElement: ElementalTone;
    dayElement: ElementalTone;
    intentionCategory: IntentionCategory;
  };
}

// ============================================================================
// DISPLAY TYPES
// ============================================================================

/**
 * UI presentation data for Divine Timing
 */
export interface DivineTimingDisplayData {
  /** Main timing quality with icon */
  timingQuality: {
    value: TimingQuality;
    icon: string;
    color: string;
  };
  
  /** Cycle state description */
  cycleState: {
    value: CycleState;
    description: string;
  };
  
  /** Elemental tone visualization */
  elementalTone: {
    element: ElementalTone;
    icon: string;
    color: string;
  };
  
  /** Guidance message */
  guidance: {
    level: GuidanceLevel;
    message: string;
  };
  
  /** Disclaimer text */
  disclaimer: string;
}
