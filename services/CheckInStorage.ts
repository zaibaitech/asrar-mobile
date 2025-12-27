/**
 * Check-In Storage Service
 * =========================
 * Phase 7: Enhanced check-in storage with personalization data
 * 
 * Purpose: Manage user timing profile and check-in records
 * Storage: AsyncStorage (local, privacy-first)
 * Features:
 * - Load/save user timing profile
 * - Store check-in records with outcomes and energy
 * - Update peak window model automatically
 * - Efficient querying and filtering
 */

import {
    CheckInRecord,
    DEFAULT_USER_TIMING_PROFILE,
    OutcomeRating,
    TimeSegment,
    UserTimingProfile,
} from '@/types/divine-timing-personal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updatePeakWindowModel } from './PeakWindowLearner';

// ============================================================================
// STORAGE KEYS
// ============================================================================

const STORAGE_KEYS = {
  PROFILE: 'divineTiming.profile.v2',
  CHECKINS: 'divineTiming.checkins.v2',
} as const;

// ============================================================================
// PROFILE MANAGEMENT
// ============================================================================

/**
 * Load user timing profile
 * Creates default profile if not exists
 */
export async function loadUserTimingProfile(): Promise<UserTimingProfile> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.PROFILE);
    
    if (!stored) {
      // Initialize with default
      const defaultProfile = {
        ...DEFAULT_USER_TIMING_PROFILE,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      
      await saveUserTimingProfile(defaultProfile);
      return defaultProfile;
    }
    
    const profile: UserTimingProfile = JSON.parse(stored);
    return profile;
    
  } catch (error) {
    if (__DEV__) {
      console.error('[CheckInStorage] Error loading profile:', error);
    }
    return DEFAULT_USER_TIMING_PROFILE;
  }
}

/**
 * Save user timing profile
 */
export async function saveUserTimingProfile(
  profile: UserTimingProfile
): Promise<void> {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.PROFILE,
      JSON.stringify(profile)
    );
  } catch (error) {
    if (__DEV__) {
      console.error('[CheckInStorage] Error saving profile:', error);
    }
    throw error;
  }
}

/**
 * Update profile timezone and location
 */
export async function updateUserLocation(
  timezone: string,
  location?: { latitude: number; longitude: number; city?: string }
): Promise<UserTimingProfile> {
  const profile = await loadUserTimingProfile();
  
  const updated: UserTimingProfile = {
    ...profile,
    timezone,
    location,
    updatedAt: Date.now(),
  };
  
  await saveUserTimingProfile(updated);
  return updated;
}

/**
 * Update calculation mode preference
 */
export async function updateCalculationMode(
  mode: 'astronomical' | 'approx'
): Promise<UserTimingProfile> {
  const profile = await loadUserTimingProfile();
  
  const updated: UserTimingProfile = {
    ...profile,
    preferredCalculationMode: mode,
    updatedAt: Date.now(),
  };
  
  await saveUserTimingProfile(updated);
  return updated;
}

// ============================================================================
// CHECK-IN MANAGEMENT
// ============================================================================

/**
 * Load all check-in records
 */
export async function loadCheckIns(): Promise<CheckInRecord[]> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.CHECKINS);
    
    if (!stored) {
      return [];
    }
    
    const checkins: CheckInRecord[] = JSON.parse(stored);
    
    // Sort by creation time (newest first)
    return checkins.sort((a, b) => b.createdAt - a.createdAt);
    
  } catch (error) {
    if (__DEV__) {
      console.error('[CheckInStorage] Error loading check-ins:', error);
    }
    return [];
  }
}

/**
 * Save a new check-in record
 * Automatically updates peak window model
 */
export async function saveCheckIn(
  checkin: CheckInRecord
): Promise<void> {
  try {
    // Load existing check-ins
    const checkins = await loadCheckIns();
    
    // Add new check-in
    checkins.push(checkin);
    
    // Sort by creation time
    checkins.sort((a, b) => b.createdAt - a.createdAt);
    
    // Save updated list
    await AsyncStorage.setItem(
      STORAGE_KEYS.CHECKINS,
      JSON.stringify(checkins)
    );
    
    // Update peak window model
    await updatePeakWindowModelFromCheckIns(checkins);
    
  } catch (error) {
    if (__DEV__) {
      console.error('[CheckInStorage] Error saving check-in:', error);
    }
    throw error;
  }
}

/**
 * Update an existing check-in (e.g., add outcome later)
 */
export async function updateCheckIn(
  checkinId: string,
  updates: Partial<CheckInRecord>
): Promise<void> {
  try {
    const checkins = await loadCheckIns();
    
    const index = checkins.findIndex(c => c.id === checkinId);
    if (index === -1) {
      throw new Error(`Check-in ${checkinId} not found`);
    }
    
    // Update check-in
    checkins[index] = {
      ...checkins[index],
      ...updates,
    };
    
    // Save updated list
    await AsyncStorage.setItem(
      STORAGE_KEYS.CHECKINS,
      JSON.stringify(checkins)
    );
    
    // Re-learn peak windows if outcome was added
    if (updates.outcome) {
      await updatePeakWindowModelFromCheckIns(checkins);
    }
    
  } catch (error) {
    if (__DEV__) {
      console.error('[CheckInStorage] Error updating check-in:', error);
    }
    throw error;
  }
}

/**
 * Add outcome to a check-in
 */
export async function addOutcomeToCheckIn(
  checkinId: string,
  outcome: OutcomeRating
): Promise<void> {
  await updateCheckIn(checkinId, {
    outcome,
    outcomeRecordedAt: Date.now(),
  });
}

/**
 * Get check-in by ID
 */
export async function getCheckInById(
  checkinId: string
): Promise<CheckInRecord | null> {
  const checkins = await loadCheckIns();
  return checkins.find(c => c.id === checkinId) || null;
}

/**
 * Get check-ins for a specific date
 */
export async function getCheckInsForDate(
  dateISO: string
): Promise<CheckInRecord[]> {
  const checkins = await loadCheckIns();
  return checkins.filter(c => c.localDayKey === dateISO);
}

/**
 * Get check-ins for a date range
 */
export async function getCheckInsInRange(
  startDateISO: string,
  endDateISO: string
): Promise<CheckInRecord[]> {
  const checkins = await loadCheckIns();
  return checkins.filter(c => 
    c.localDayKey >= startDateISO && 
    c.localDayKey <= endDateISO
  );
}

/**
 * Get recent check-ins (last N days)
 */
export async function getRecentCheckIns(
  days: number = 30
): Promise<CheckInRecord[]> {
  const checkins = await loadCheckIns();
  const cutoffTime = Date.now() - days * 24 * 60 * 60 * 1000;
  
  return checkins.filter(c => c.createdAt >= cutoffTime);
}

/**
 * Get check-ins for a specific segment
 */
export async function getCheckInsForSegment(
  segment: TimeSegment
): Promise<CheckInRecord[]> {
  const checkins = await loadCheckIns();
  return checkins.filter(c => c.timeSegment === segment);
}

// ============================================================================
// PEAK WINDOW MODEL UPDATE
// ============================================================================

/**
 * Update peak window model from check-in history
 * Called automatically when check-ins are saved/updated
 */
async function updatePeakWindowModelFromCheckIns(
  checkins: CheckInRecord[]
): Promise<void> {
  try {
    const profile = await loadUserTimingProfile();
    
    // Run learning algorithm
    const updatedProfile = updatePeakWindowModel(profile, checkins);
    
    // Save updated profile
    await saveUserTimingProfile(updatedProfile);
    
    if (__DEV__) {
      console.log('[CheckInStorage] Peak window model updated');
    }
    
  } catch (error) {
    if (__DEV__) {
      console.error('[CheckInStorage] Error updating peak window model:', error);
    }
  }
}

/**
 * Manually trigger peak window model update
 * Useful if you want to force re-learning
 */
export async function recomputePeakWindowModel(): Promise<void> {
  const checkins = await loadCheckIns();
  await updatePeakWindowModelFromCheckIns(checkins);
}

// ============================================================================
// STATISTICS & ANALYTICS
// ============================================================================

/**
 * Get summary statistics
 */
export async function getCheckInSummary(): Promise<{
  totalCheckins: number;
  checkinsLast7Days: number;
  checkinsLast30Days: number;
  currentStreak: number;
  bestSegment: TimeSegment | null;
  avgHarmonyScore: number;
}> {
  const checkins = await loadCheckIns();
  const profile = await loadUserTimingProfile();
  
  const now = Date.now();
  const last7Days = checkins.filter(c => c.createdAt >= now - 7 * 24 * 60 * 60 * 1000);
  const last30Days = checkins.filter(c => c.createdAt >= now - 30 * 24 * 60 * 60 * 1000);
  
  // Calculate current streak
  const currentStreak = calculateCurrentStreak(checkins);
  
  // Find best segment
  const bestSegment = getBestSegment(profile);
  
  // Calculate average harmony score
  const harmonyScores = checkins
    .filter(c => c.harmonyScore !== undefined)
    .map(c => c.harmonyScore!);
  
  const avgHarmonyScore = harmonyScores.length > 0 ?
    harmonyScores.reduce((sum, score) => sum + score, 0) / harmonyScores.length :
    50;
  
  return {
    totalCheckins: checkins.length,
    checkinsLast7Days: last7Days.length,
    checkinsLast30Days: last30Days.length,
    currentStreak,
    bestSegment,
    avgHarmonyScore: Math.round(avgHarmonyScore),
  };
}

/**
 * Calculate current streak (consecutive days with check-ins)
 */
function calculateCurrentStreak(checkins: CheckInRecord[]): number {
  if (checkins.length === 0) return 0;
  
  // Sort by date (newest first)
  const sortedCheckins = [...checkins].sort((a, b) => b.createdAt - a.createdAt);
  
  // Get unique dates
  const uniqueDates = new Set(sortedCheckins.map(c => c.localDayKey));
  const sortedDates = Array.from(uniqueDates).sort().reverse();
  
  // Check if today is included
  const today = new Date().toISOString().split('T')[0];
  if (!sortedDates.includes(today)) {
    return 0;
  }
  
  // Count consecutive days
  let streak = 1;
  let currentDate = new Date(today);
  
  for (let i = 1; i < sortedDates.length; i++) {
    currentDate.setDate(currentDate.getDate() - 1);
    const expectedDate = currentDate.toISOString().split('T')[0];
    
    if (sortedDates[i] === expectedDate) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

/**
 * Get best segment from profile
 */
function getBestSegment(profile: UserTimingProfile): TimeSegment | null {
  const segments = Object.entries(profile.peakWindowModel.segmentScores) as [TimeSegment, number][];
  
  if (segments.length === 0) return null;
  
  const best = segments.reduce((max, current) => 
    current[1] > max[1] ? current : max
  );
  
  return best[0];
}

// ============================================================================
// DATA MANAGEMENT
// ============================================================================

/**
 * Delete a check-in
 */
export async function deleteCheckIn(checkinId: string): Promise<void> {
  try {
    const checkins = await loadCheckIns();
    const filtered = checkins.filter(c => c.id !== checkinId);
    
    await AsyncStorage.setItem(
      STORAGE_KEYS.CHECKINS,
      JSON.stringify(filtered)
    );
    
    // Re-learn peak windows
    await updatePeakWindowModelFromCheckIns(filtered);
    
  } catch (error) {
    if (__DEV__) {
      console.error('[CheckInStorage] Error deleting check-in:', error);
    }
    throw error;
  }
}

/**
 * Clear all check-ins (for testing or reset)
 */
export async function clearAllCheckIns(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.CHECKINS);
    
    // Reset peak window model
    const profile = await loadUserTimingProfile();
    const resetProfile: UserTimingProfile = {
      ...profile,
      peakWindowModel: DEFAULT_USER_TIMING_PROFILE.peakWindowModel,
      historyStats: {
        totalCheckins: 0,
      },
      updatedAt: Date.now(),
    };
    
    await saveUserTimingProfile(resetProfile);
    
  } catch (error) {
    if (__DEV__) {
      console.error('[CheckInStorage] Error clearing check-ins:', error);
    }
    throw error;
  }
}

/**
 * Reset user profile (for testing)
 */
export async function resetUserProfile(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.PROFILE);
  } catch (error) {
    if (__DEV__) {
      console.error('[CheckInStorage] Error resetting profile:', error);
    }
    throw error;
  }
}

/**
 * Export data (for backup or portability)
 */
export async function exportData(): Promise<{
  profile: UserTimingProfile;
  checkins: CheckInRecord[];
}> {
  const profile = await loadUserTimingProfile();
  const checkins = await loadCheckIns();
  
  return { profile, checkins };
}

/**
 * Import data (restore from backup)
 */
export async function importData(data: {
  profile: UserTimingProfile;
  checkins: CheckInRecord[];
}): Promise<void> {
  await saveUserTimingProfile(data.profile);
  await AsyncStorage.setItem(
    STORAGE_KEYS.CHECKINS,
    JSON.stringify(data.checkins)
  );
}
