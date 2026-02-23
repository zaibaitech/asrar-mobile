/**
 * Zikr Module Types
 * =================
 * Based on web app's Ramadan Challenge architecture.
 * Supports challenge creation, progress tracking, and session logging.
 */

// ─── Challenge Types ─────────────────────────────────────────────────────────────

/** Challenge type - what kind of dhikr practice */
export type ChallengeType = 
  | 'ISTIGHFAR'        // Forgiveness dhikr
  | 'SALAWAT'          // Blessings on Prophet ﷺ
  | 'DIVINE_NAME'      // Allah's Beautiful Names
  | 'CUSTOM'           // User-defined wird
  | 'PROPHETIC_NAMES'; // 201 Names of Prophet ﷺ

/** Session tag - prayer time marker for logging */
export type SessionTag =
  | 'Fajr'
  | 'Ḍuḥā / Morning'
  | 'Ẓuhr'
  | 'ʿAṣr'
  | 'Maghrib / Ifṭār'
  | 'ʿIshāʾ / Tarāwīḥ'
  | 'Other';

// ─── Session Log ─────────────────────────────────────────────────────────────────

/** Individual session log entry */
export interface SessionLog {
  /** Date in ISO format "YYYY-MM-DD" */
  date: string;
  /** Prayer time session tag */
  session: SessionTag;
  /** Number of recitations logged */
  count: number;
  /** Full ISO timestamp */
  timestamp: string;
}

// ─── Challenge Model ─────────────────────────────────────────────────────────────

/** Main challenge model - user's dhikr practice */
export interface Challenge {
  /** Unique identifier (UUID) */
  id: string;
  /** Challenge type */
  type: ChallengeType;
  /** Display title */
  title: string;
  /** Primary Arabic text */
  arabicText: string;
  /** Latin transliteration */
  transliteration: string;
  /** English meaning/translation */
  meaning?: string;
  /** French meaning/translation */
  meaningFr?: string;
  /** Per-day goal */
  dailyTarget: number;
  /** Overall goal (30-day/total target) */
  totalTarget: number;
  /** Today's progress (resets at midnight) */
  todayProgress: number;
  /** Cumulative total progress */
  totalProgress: number;
  /** Consecutive days with ≥1 log */
  streakDays: number;
  /** Last logged date (ISO "YYYY-MM-DD") */
  lastLoggedDate: string | null;
  /** Quick-tap amounts */
  quickAddPresets: number[];
  /** Full session history */
  sessionLogs: SessionLog[];
  /** When challenge was created */
  createdAt: string;
  /** Whether user marked as favorite */
  isFavorite: boolean;
}

// ─── Presets ─────────────────────────────────────────────────────────────────────

/** Ṣalawāt preset option */
export interface SalawatPreset {
  id: string;
  title: string;
  titleFr: string;
  tradition: string;
  traditionFr: string;
  arabicText: string;
  transliteration: string;
  meaning: string;
  meaningFr: string;
  quickAddPresets: number[];
  recommendedDaily: number;
  note: string;
  noteFr: string;
}

/** Divine Name option */
export interface DivineNameOption {
  id: string;
  arabicName: string;
  transliteration: string;
  meaning: string;
  meaningFr: string;
  recommendedDaily: number;
}

/** Configuration for creating new challenge */
export interface ChallengeConfig {
  title: string;
  arabicText: string;
  transliteration: string;
  meaning?: string;
  meaningFr?: string;
  dailyTarget: number;
  totalTarget: number;
  quickAddPresets: number[];
}

// ─── Prophetic Names ─────────────────────────────────────────────────────────────

/** Single prophetic name entry */
export interface PropheticName {
  number: number;
  arabic: string;
  transliteration: string;
  meaning: string;
  meaningFr: string;
}

/** 7-day session progress for Prophetic Names */
export interface DaySession {
  day: number;
  completed: boolean;
  completedAt?: string;
}

// ─── State & Actions ─────────────────────────────────────────────────────────────

/** Store state shape */
export interface ZikrState {
  /** User's active challenges */
  challenges: Challenge[];
  /** Current date for day reset detection */
  currentDate: string;
  /** Whether state hydrated from storage */
  isHydrated: boolean;
}

/** Store actions */
export type ZikrAction =
  | { type: 'HYDRATE'; payload: { challenges: Challenge[]; currentDate: string } }
  | { type: 'ADD_CHALLENGE'; payload: Challenge }
  | { type: 'REMOVE_CHALLENGE'; payload: { id: string } }
  | { type: 'LOG_COUNT'; payload: { id: string; amount: number; session: SessionTag } }
  | { type: 'SET_TARGETS'; payload: { id: string; dailyTarget: number; totalTarget: number } }
  | { type: 'TOGGLE_FAVORITE'; payload: { id: string } }
  | { type: 'RESET_TODAY'; payload: { currentDate: string } };

// ─── Category Styles ─────────────────────────────────────────────────────────────

/** Visual styling for challenge type */
export interface ChallengeTypeStyle {
  bg: string;
  text: string;
  accent: string;
  icon: string;
  labelEn: string;
  labelFr: string;
}
