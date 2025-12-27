/**
 * Divine Timing Storage Service
 * ==============================
 * Phase 4: Local storage for daily check-ins, streaks, and reminders
 */

import {
    DailyCheckInEntry,
    DailyCheckInSummary,
    ReminderSettings,
    StreakData,
} from '@/types/daily-checkin';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const STORAGE_KEY_CHECKINS = 'dt_checkins_v1';
const STORAGE_KEY_STREAK = 'dt_streak_v1';
const STORAGE_KEY_REMINDERS = 'dt_reminder_settings_v1';

// Configuration
const MAX_CHECKINS_DAYS = 90;

/**
 * Load all check-ins from storage
 */
export async function loadCheckIns(): Promise<DailyCheckInEntry[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY_CHECKINS);
    if (!data) return [];
    
    const checkIns: DailyCheckInEntry[] = JSON.parse(data);
    
    // Prune old entries (keep only last 90 days)
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - MAX_CHECKINS_DAYS);
    const cutoffISO = cutoffDate.toISOString().split('T')[0];
    
    const filteredCheckIns = checkIns.filter(
      (entry) => entry.dateISO >= cutoffISO
    );
    
    // Save pruned list if we removed any
    if (filteredCheckIns.length !== checkIns.length) {
      await AsyncStorage.setItem(
        STORAGE_KEY_CHECKINS,
        JSON.stringify(filteredCheckIns)
      );
    }
    
    return filteredCheckIns;
  } catch (error) {
    console.error('Failed to load check-ins:', error);
    return [];
  }
}

/**
 * Save a new check-in entry
 */
export async function saveCheckIn(entry: DailyCheckInEntry): Promise<void> {
  try {
    const existingCheckIns = await loadCheckIns();
    
    // Check if there's already a check-in for this date
    const existingIndex = existingCheckIns.findIndex(
      (e) => e.dateISO === entry.dateISO
    );
    
    let updatedCheckIns: DailyCheckInEntry[];
    
    if (existingIndex >= 0) {
      // Replace existing check-in for today
      updatedCheckIns = [...existingCheckIns];
      updatedCheckIns[existingIndex] = entry;
    } else {
      // Add new check-in
      updatedCheckIns = [entry, ...existingCheckIns];
    }
    
    await AsyncStorage.setItem(
      STORAGE_KEY_CHECKINS,
      JSON.stringify(updatedCheckIns)
    );
    
    // Update streak
    await computeAndUpdateStreak(entry.dateISO);
  } catch (error) {
    console.error('Failed to save check-in:', error);
    throw error;
  }
}

/**
 * Get check-in for a specific date
 */
export async function getCheckInForDate(
  dateISO: string
): Promise<DailyCheckInEntry | null> {
  try {
    const checkIns = await loadCheckIns();
    return checkIns.find((e) => e.dateISO === dateISO) || null;
  } catch (error) {
    console.error('Failed to get check-in for date:', error);
    return null;
  }
}

/**
 * Load streak data
 */
export async function loadStreak(): Promise<StreakData> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY_STREAK);
    if (!data) {
      return {
        currentStreak: 0,
        lastCheckInDateISO: '',
        bestStreak: 0,
      };
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to load streak:', error);
    return {
      currentStreak: 0,
      lastCheckInDateISO: '',
      bestStreak: 0,
    };
  }
}

/**
 * Compute and update streak based on new check-in date
 */
export async function computeAndUpdateStreak(dateISO: string): Promise<StreakData> {
  try {
    const streak = await loadStreak();
    
    // If same date, don't change streak
    if (streak.lastCheckInDateISO === dateISO) {
      return streak;
    }
    
    // Calculate date difference
    const lastDate = streak.lastCheckInDateISO
      ? new Date(streak.lastCheckInDateISO)
      : null;
    const currentDate = new Date(dateISO);
    
    let newStreak = 1;
    
    if (lastDate) {
      const diffTime = currentDate.getTime() - lastDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        // Consecutive day
        newStreak = streak.currentStreak + 1;
      } else if (diffDays === 0) {
        // Same day (shouldn't happen due to check above, but just in case)
        newStreak = streak.currentStreak;
      } else {
        // Streak broken
        newStreak = 1;
      }
    }
    
    const newBestStreak = Math.max(streak.bestStreak, newStreak);
    
    const updatedStreak: StreakData = {
      currentStreak: newStreak,
      lastCheckInDateISO: dateISO,
      bestStreak: newBestStreak,
    };
    
    await AsyncStorage.setItem(
      STORAGE_KEY_STREAK,
      JSON.stringify(updatedStreak)
    );
    
    return updatedStreak;
  } catch (error) {
    console.error('Failed to update streak:', error);
    throw error;
  }
}

/**
 * Reset streak (optional user action)
 */
export async function resetStreak(): Promise<void> {
  try {
    const streak: StreakData = {
      currentStreak: 0,
      lastCheckInDateISO: '',
      bestStreak: 0,
    };
    await AsyncStorage.setItem(STORAGE_KEY_STREAK, JSON.stringify(streak));
  } catch (error) {
    console.error('Failed to reset streak:', error);
    throw error;
  }
}

/**
 * Load reminder settings
 */
export async function loadReminderSettings(): Promise<ReminderSettings> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY_REMINDERS);
    if (!data) {
      return {
        enabled: false,
        timeHHMM: '20:00',
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6], // All days
      };
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to load reminder settings:', error);
    return {
      enabled: false,
      timeHHMM: '20:00',
      daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    };
  }
}

/**
 * Save reminder settings
 */
export async function saveReminderSettings(
  settings: ReminderSettings
): Promise<void> {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEY_REMINDERS,
      JSON.stringify(settings)
    );
  } catch (error) {
    console.error('Failed to save reminder settings:', error);
    throw error;
  }
}

/**
 * Get daily check-in summary for home card
 */
export async function getDailyCheckInSummary(): Promise<DailyCheckInSummary> {
  try {
    const todayISO = new Date().toISOString().split('T')[0];
    const todayCheckIn = await getCheckInForDate(todayISO);
    const streak = await loadStreak();
    
    if (todayCheckIn) {
      return {
        hasCheckedInToday: true,
        timingQuality: todayCheckIn.timing.timingQuality,
        elementalTone: todayCheckIn.timing.elementalTone,
        summary: todayCheckIn.timing.shortMessage,
        streak: streak.currentStreak,
        lastCheckInDate: todayISO,
      };
    }
    
    return {
      hasCheckedInToday: false,
      streak: streak.currentStreak,
      lastCheckInDate: streak.lastCheckInDateISO || undefined,
    };
  } catch (error) {
    console.error('Failed to get daily check-in summary:', error);
    return {
      hasCheckedInToday: false,
      streak: 0,
    };
  }
}

/**
 * Clear all check-ins (for testing or user request)
 */
export async function clearAllCheckIns(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY_CHECKINS);
    await AsyncStorage.removeItem(STORAGE_KEY_STREAK);
  } catch (error) {
    console.error('Failed to clear check-ins:', error);
    throw error;
  }
}
