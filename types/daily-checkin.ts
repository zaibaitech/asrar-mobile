/**
 * Daily Check-In Types
 * ====================
 * Phase 4: Daily retention loop with streaks and reminders
 */

import { DivineTimingResult, IntentionCategory } from './divine-timing';
import { GuidanceResponse } from './divine-timing-guidance';

/**
 * Single daily check-in entry
 */
export interface DailyCheckInEntry {
  /** Unique identifier */
  id: string;
  
  /** Date in YYYY-MM-DD format */
  dateISO: string;
  
  /** Timestamp when created */
  createdAt: number;
  
  /** User's intention for the day */
  intentionCategory: IntentionCategory;
  
  /** Optional user note */
  note?: string;
  
  /** Divine Timing result */
  timing: DivineTimingResult;
  
  /** Optional Qur'an reflection verse */
  verse?: {
    surahNumber: number;
    ayahNumber: number;
    surahNameEn: string;
    arabicText: string;
    translationEn: string;
  };
  
  /** Guidance response (if user asked a question) */
  guidance?: GuidanceResponse;
}

/**
 * Streak tracking data
 */
export interface StreakData {
  /** Current consecutive days */
  currentStreak: number;
  
  /** Last check-in date (YYYY-MM-DD) */
  lastCheckInDateISO: string;
  
  /** Best streak ever achieved */
  bestStreak: number;
}

/**
 * Reminder settings
 */
export interface ReminderSettings {
  /** Whether reminders are enabled */
  enabled: boolean;
  
  /** Time in HH:mm format (24-hour) */
  timeHHMM: string;
  
  /** Days of week (0 = Sunday, 6 = Saturday) */
  daysOfWeek: number[];
}

/**
 * Daily check-in summary for home card
 */
export interface DailyCheckInSummary {
  /** Whether user has checked in today */
  hasCheckedInToday: boolean;
  
  /** Today's timing quality if checked in */
  timingQuality?: string;
  
  /** Today's elemental tone if checked in */
  elementalTone?: string;
  
  /** One-line summary */
  summary?: string;
  
  /** Current streak */
  streak: number;
  
  /** Last check-in date for display */
  lastCheckInDate?: string;
}
