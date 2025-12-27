/**
 * Guided Istikhārah Session Types
 * ================================
 * Phase 5: Guided preparation and post-prayer reflection
 * 
 * CRITICAL: This feature supports preparation and reflection ONLY.
 * It does NOT replace ṣalāt al-istikhārah or provide religious rulings.
 */

import { DivineTimingResult } from './divine-timing';

/**
 * Emotional state during reflection
 */
export type EmotionalState = 'calm' | 'neutral' | 'uneasy';

/**
 * Directional feeling about decision
 */
export type DirectionFeeling = 'inclined' | 'unclear' | 'resistant';

/**
 * Level of ease observed
 */
export type EaseLevel = 'ease' | 'mixed' | 'obstacles';

/**
 * Single daily reflection entry after istikhārah
 */
export interface IstikharaReflectionEntry {
  /** Date in YYYY-MM-DD format */
  date: string;
  
  /** Emotional state */
  emotionalState: EmotionalState;
  
  /** Directional feeling */
  directionFeeling: DirectionFeeling;
  
  /** Level of ease observed */
  easeLevel: EaseLevel;
  
  /** Optional note */
  note?: string;
}

/**
 * Complete guided istikhārah session
 */
export interface GuidedIstikharaSession {
  /** Unique identifier */
  id: string;
  
  /** When session was created */
  createdAt: number;
  
  /** The decision being considered */
  decisionText: string;
  
  /** User's intention text */
  intentionText?: string;
  
  /** Divine Timing snapshot at time of preparation */
  timingSnapshot: DivineTimingResult;
  
  /** Optional Qur'anic reflection verse */
  reflectionVerse?: {
    surahNumber: number;
    ayahNumber: number;
    surahNameEn: string;
    surahNameAr: string;
    arabicText: string;
    translationEn: string;
  };
  
  /** Daily reflection entries */
  reflections: IstikharaReflectionEntry[];
  
  /** When session was closed (if closed) */
  closedAt?: number;
}

/**
 * Self-check confirmations (non-authoritative)
 */
export interface IstikharaSelfCheck {
  /** User confirms decision is not clearly haram */
  notClearlyHaram: boolean;
  
  /** User confirms they've taken worldly steps */
  takenWorldlySteps: boolean;
  
  /** User confirms not rushing under pressure */
  notRushing: boolean;
}

/**
 * Pattern summary (observational only)
 */
export interface IstikharaPatternSummary {
  /** Total reflection days */
  totalDays: number;
  
  /** Count of calm days */
  calmDays: number;
  
  /** Count of uneasy days */
  uneasyDays: number;
  
  /** Count of inclined days */
  inclinedDays: number;
  
  /** Count of resistant days */
  resistantDays: number;
  
  /** Count of ease days */
  easeDays: number;
  
  /** Count of obstacle days */
  obstacleDays: number;
  
  /** Most common emotional state */
  dominantEmotionalState: EmotionalState;
  
  /** Most common direction feeling */
  dominantDirectionFeeling: DirectionFeeling;
  
  /** Most common ease level */
  dominantEaseLevel: EaseLevel;
  
  /** Observational summary text (no verdict) */
  observationalSummary: string;
}
