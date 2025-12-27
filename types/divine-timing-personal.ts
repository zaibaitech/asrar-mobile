/**
 * Divine Timing Personalization Types
 * ====================================
 * Phase 7: Peak Windows, Harmony Scores, and Check-In Analytics
 * 
 * Privacy-first: All data stored locally in AsyncStorage
 * Educational: Uses real ephemeris + reflection patterns (no predictions)
 */

import { DivineTimingResult, IntentionCategory } from './divine-timing';

// ============================================================================
// TIME SEGMENTS
// ============================================================================

/**
 * Daily time segments for peak window tracking
 * Mapped to local time ranges (configurable per user timezone)
 */
export type TimeSegment =
  | 'preDawn'    // ~4:00-6:00  (before sunrise)
  | 'morning'    // ~6:00-10:00 (sunrise to mid-morning)
  | 'midday'     // ~10:00-14:00 (late morning to early afternoon)
  | 'afternoon'  // ~14:00-18:00 (afternoon)
  | 'evening'    // ~18:00-21:00 (sunset to night)
  | 'night';     // ~21:00-4:00  (deep night)

/**
 * Default time ranges for segments (24-hour format)
 * Can be customized per user based on location/sunrise/sunset
 */
export interface SegmentTimeRanges {
  preDawn: { start: string; end: string };
  morning: { start: string; end: string };
  midday: { start: string; end: string };
  afternoon: { start: string; end: string };
  evening: { start: string; end: string };
  night: { start: string; end: string };
}

export const DEFAULT_SEGMENT_RANGES: SegmentTimeRanges = {
  preDawn: { start: '04:00', end: '06:00' },
  morning: { start: '06:00', end: '10:00' },
  midday: { start: '10:00', end: '14:00' },
  afternoon: { start: '14:00', end: '18:00' },
  evening: { start: '18:00', end: '21:00' },
  night: { start: '21:00', end: '04:00' },
};

// ============================================================================
// EPHEMERIS & ASTRONOMICAL DATA
// ============================================================================

/**
 * Planet identifiers for ephemeris queries
 */
export type PlanetId = 'sun' | 'moon' | 'mercury' | 'venus' | 'mars' | 'jupiter' | 'saturn';

/**
 * Planetary position in ecliptic coordinates
 */
export interface PlanetPosition {
  /** Planet identifier */
  planet: PlanetId;
  
  /** Ecliptic longitude in degrees (0-360) */
  longitude: number;
  
  /** Zodiac sign (0=Aries, 1=Taurus, ..., 11=Pisces) */
  sign: number;
  
  /** Degree within sign (0-30) */
  signDegree: number;
}

/**
 * Complete planetary positions for a given datetime
 */
export interface PlanetPositions {
  /** Timestamp of calculation */
  timestamp: number;
  
  /** Date in YYYY-MM-DD format */
  dateISO: string;
  
  /** Positions of all tracked planets */
  planets: Record<PlanetId, PlanetPosition>;
  
  /** Data source: 'ephemeris' (real) or 'approx' (fallback) */
  source: 'ephemeris' | 'approx';
  
  /** Cache expiry timestamp */
  expiresAt: number;
}

/**
 * Moon phase information
 */
export interface MoonPhase {
  /** Phase name */
  phase: 'new' | 'waxing-crescent' | 'first-quarter' | 'waxing-gibbous' | 
         'full' | 'waning-gibbous' | 'last-quarter' | 'waning-crescent';
  
  /** Illumination percentage (0-100) */
  illumination: number;
  
  /** Angular separation from Sun (0-360) */
  elongation: number;
}

// ============================================================================
// USER PROFILE & PEAK WINDOWS
// ============================================================================

/**
 * User's timing profile for personalization
 */
export interface UserTimingProfile {
  /** Profile creation timestamp */
  createdAt: number;
  
  /** Last updated timestamp */
  updatedAt: number;
  
  /** User's timezone (IANA format, e.g., 'America/New_York') */
  timezone: string;
  
  /** Optional location for sunrise/sunset calculations */
  location?: {
    latitude: number;
    longitude: number;
    city?: string;
  };
  
  /** Calculation mode preference */
  preferredCalculationMode: 'astronomical' | 'approx';
  
  /** Custom segment time ranges (if user adjusted defaults) */
  customSegmentRanges?: SegmentTimeRanges;
  
  /** Learned peak window scores by segment */
  peakWindowModel: {
    /** Score multiplier for each segment (0-1) */
    segmentScores: Record<TimeSegment, number>;
    
    /** Last model update timestamp */
    updatedAt: number;
    
    /** Number of check-ins used in current model */
    sampleSize: number;
  };
  
  /** Check-in history stats */
  historyStats: {
    /** Total number of check-ins */
    totalCheckins: number;
    
    /** Last check-in timestamp */
    lastCheckinAt?: number;
    
    /** First check-in timestamp */
    firstCheckinAt?: number;
  };
}

/**
 * Default user timing profile
 */
export const DEFAULT_USER_TIMING_PROFILE: UserTimingProfile = {
  createdAt: Date.now(),
  updatedAt: Date.now(),
  timezone: 'UTC',
  preferredCalculationMode: 'astronomical',
  peakWindowModel: {
    segmentScores: {
      preDawn: 0.5,
      morning: 0.5,
      midday: 0.5,
      afternoon: 0.5,
      evening: 0.5,
      night: 0.5,
    },
    updatedAt: Date.now(),
    sampleSize: 0,
  },
  historyStats: {
    totalCheckins: 0,
  },
};

// ============================================================================
// CHECK-IN RECORDS
// ============================================================================

/**
 * User outcome rating for a check-in
 */
export type OutcomeRating = 'good' | 'neutral' | 'bad';

/**
 * Enhanced check-in record with outcome tracking
 */
export interface CheckInRecord {
  /** Unique identifier */
  id: string;
  
  /** Creation timestamp */
  createdAt: number;
  
  /** Date in YYYY-MM-DD format (local timezone) */
  localDayKey: string;
  
  /** User's intention category */
  intentionKey: IntentionCategory;
  
  /** Optional user note */
  note?: string;
  
  /** Divine timing snapshot at check-in time */
  timingSnapshot: DivineTimingResult;
  
  /** Time segment when check-in occurred */
  timeSegment: TimeSegment;
  
  /** User's reported energy level (0-100) */
  energy: number;
  
  /** User's outcome rating (added later) */
  outcome?: OutcomeRating;
  
  /** Timestamp when outcome was recorded */
  outcomeRecordedAt?: number;
  
  /** Planetary positions snapshot (if available) */
  planetarySnapshot?: PlanetPositions;
  
  /** Harmony score at time of check-in */
  harmonyScore?: number;
}

// ============================================================================
// HARMONY COMPUTATION
// ============================================================================

/**
 * Inputs for harmony score computation
 */
export interface HarmonyComputationInput {
  /** Current date and time */
  datetime: Date;
  
  /** User's timezone */
  timezone: string;
  
  /** User's Abjad dominant element */
  userElement: 'fire' | 'water' | 'air' | 'earth';
  
  /** User's Burj (zodiac sign) ruler (if available) */
  userBurjRuler?: PlanetId;
  
  /** Current intention category */
  intentionCategory: IntentionCategory;
  
  /** Time segment */
  timeSegment: TimeSegment;
  
  /** Planetary positions (if available) */
  planetPositions?: PlanetPositions;
  
  /** Learned peak window score for this segment (0-1) */
  peakWindowScore: number;
  
  /** Recent outcomes for this segment (last 30 days) */
  recentOutcomes?: OutcomeRating[];
}

/**
 * Harmony score result
 */
export interface HarmonyScoreResult {
  /** Overall harmony score (0-100) */
  score: number;
  
  /** Component scores for transparency */
  components: {
    baseScore: number;           // Starting point (50)
    planetaryDayBonus: number;   // Planetary day alignment
    planetaryHourBonus: number;  // Planetary hour alignment
    moonSignBonus: number;       // Moon sign element match
    peakWindowBonus: number;     // Learned pattern (0-20)
    outcomePenalty: number;      // Recent bad outcomes (-5)
  };
  
  /** Explanation bullets (2-4 points) */
  explanationBullets: string[];
  
  /** Data quality indicator */
  dataQuality: 'full' | 'partial' | 'minimal';
}

// ============================================================================
// PEAK WINDOWS
// ============================================================================

/**
 * A recommended time window for user activity
 */
export interface PeakWindow {
  /** Time segment */
  segment: TimeSegment;
  
  /** Start time (HH:mm) */
  startTime: string;
  
  /** End time (HH:mm) */
  endTime: string;
  
  /** Harmony score for this window */
  harmonyScore: number;
  
  /** Short guidance (1 line) */
  guidance: string;
  
  /** Ranking among today's windows (1 = best) */
  rank: number;
}

/**
 * Today's peak windows recommendation
 */
export interface TodaysPeakWindows {
  /** Date in YYYY-MM-DD format */
  dateISO: string;
  
  /** Recommended windows (top 3) */
  windows: PeakWindow[];
  
  /** Overall day harmony trend */
  dayHarmonyTrend: 'ascending' | 'stable' | 'descending';
  
  /** Data quality */
  dataQuality: 'full' | 'partial' | 'minimal';
}

// ============================================================================
// ANALYTICS & INSIGHTS
// ============================================================================

/**
 * Aggregate stats for a time segment
 */
export interface SegmentAnalytics {
  /** Time segment */
  segment: TimeSegment;
  
  /** Number of check-ins */
  checkinCount: number;
  
  /** Average energy level */
  avgEnergy: number;
  
  /** Average harmony score */
  avgHarmony: number;
  
  /** Outcome distribution */
  outcomes: {
    good: number;
    neutral: number;
    bad: number;
  };
  
  /** Success rate (good / total outcomes) */
  successRate: number;
}

/**
 * Weekly heatmap data
 */
export interface WeeklyHeatmapData {
  /** Week start date (YYYY-MM-DD) */
  weekStartISO: string;
  
  /** Analytics by day and segment */
  grid: {
    dayOfWeek: number; // 0=Sunday
    segment: TimeSegment;
    analytics: SegmentAnalytics | null; // null if no data
  }[];
  
  /** Overall week stats */
  weekStats: {
    totalCheckins: number;
    avgHarmony: number;
    successRate: number;
    mostProductiveSegment: TimeSegment;
    mostProductiveIntention: IntentionCategory;
  };
}

/**
 * Intention-specific insights
 */
export interface IntentionInsights {
  /** Intention category */
  intention: IntentionCategory;
  
  /** Number of check-ins with this intention */
  count: number;
  
  /** Best time segments for this intention */
  bestSegments: TimeSegment[];
  
  /** Success rate */
  successRate: number;
  
  /** Average harmony score */
  avgHarmony: number;
}

/**
 * Complete user insights summary
 */
export interface UserInsightsSummary {
  /** Analysis period start */
  periodStartISO: string;
  
  /** Analysis period end */
  periodEndISO: string;
  
  /** Number of days analyzed */
  daysAnalyzed: number;
  
  /** Segment analytics */
  segmentAnalytics: SegmentAnalytics[];
  
  /** Intention insights */
  intentionInsights: IntentionInsights[];
  
  /** Harmony trend over time */
  harmonyTrend: {
    direction: 'improving' | 'stable' | 'declining';
    changePercent: number;
  };
  
  /** Most consistent segment (best success rate) */
  mostConsistentSegment: TimeSegment;
  
  /** Recommended focus areas */
  recommendations: string[];
}
