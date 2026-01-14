/**
 * Prayer Practice Storage Service
 * 
 * Manages persistence and retrieval of user's prayer practice records.
 * Tracks:
 * - Divine Name recitations
 * - Adhkar completion
 * - Practice duration and quality
 * - Streaks and statistics
 * 
 * Uses AsyncStorage for offline-first persistence with optional
 * cloud sync capability.
 * 
 * @module PrayerPracticeStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================================================
// TYPES
// ============================================================================

export type Prayer = 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';
export type Planet = 'Sun' | 'Moon' | 'Mars' | 'Mercury' | 'Jupiter' | 'Venus' | 'Saturn';
export type Element = 'Fire' | 'Water' | 'Air' | 'Earth';

export interface PrayerPracticeRecord {
  id: string;
  userId: string;
  
  // Prayer info
  prayer: Prayer;
  prayerTime: Date;
  
  // Practice info
  divineName: string; // Arabic name
  divineNameTransliteration: string;
  targetCount: number;
  actualCount: number;
  completed: boolean;
  
  // Timing
  startedAt: Date;
  completedAt?: Date;
  duration?: number; // seconds
  
  // Context
  planetaryHour: Planet;
  hourNumber: number; // 1-12
  userElement: Element;
  alignment: string; // 'exceptional' | 'strong' | 'favorable' | 'moderate' | 'balanced'
  
  // Tracking
  quality?: 1 | 2 | 3 | 4 | 5; // User rating of practice session
  notes?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

export interface PracticeStreak {
  prayer: Prayer;
  currentStreak: number; // consecutive days
  longestStreak: number;
  lastPracticeDate: Date;
}

export interface PracticeStats {
  totalPractices: number;
  completedPractices: number;
  totalDuration: number; // seconds
  averageDuration: number; // seconds
  completionRate: number; // percentage
  favoriteNames: Array<{
    name: string;
    count: number;
  }>;
  averageQuality?: number;
}

// ============================================================================
// STORAGE KEYS
// ============================================================================

const STORAGE_KEYS = {
  PRACTICES: (userId: string) => `@prayer_practices_${userId}`,
  STREAKS: (userId: string) => `@prayer_streaks_${userId}`,
  STATS: (userId: string) => `@prayer_stats_${userId}`,
  INDEX: (userId: string) => `@prayer_index_${userId}`, // For quick lookups
} as const;

// ============================================================================
// PRAYER PRACTICE STORAGE SERVICE
// ============================================================================

export class PrayerPracticeStorage {
  
  // ==========================================================================
  // SAVE & UPDATE
  // ==========================================================================
  
  /**
   * Save a new practice record
   * 
   * Stores the practice record and updates related indices and statistics.
   * Automatically calculates duration if not provided.
   */
  static async savePractice(record: PrayerPracticeRecord): Promise<void> {
    try {
      // Ensure timestamps are Date objects
      const now = new Date();
      const normalizedRecord: PrayerPracticeRecord = {
        ...record,
        prayerTime: new Date(record.prayerTime),
        startedAt: new Date(record.startedAt),
        completedAt: record.completedAt ? new Date(record.completedAt) : undefined,
        createdAt: record.createdAt ? new Date(record.createdAt) : now,
        updatedAt: now,
        
        // Auto-calculate duration if completed but no duration set
        duration: record.duration || (
          record.completed && record.completedAt
            ? Math.floor((new Date(record.completedAt).getTime() - new Date(record.startedAt).getTime()) / 1000)
            : undefined
        )
      };
      
      // Get existing practices
      const practices = await this.getAllPractices(record.userId);
      
      // Check if practice already exists (update) or new (append)
      const existingIndex = practices.findIndex(p => p.id === record.id);
      
      if (existingIndex >= 0) {
        practices[existingIndex] = normalizedRecord;
      } else {
        practices.push(normalizedRecord);
      }
      
      // Sort by prayer time (most recent first)
      practices.sort((a, b) => new Date(b.prayerTime).getTime() - new Date(a.prayerTime).getTime());
      
      // Save updated practices
      await AsyncStorage.setItem(
        STORAGE_KEYS.PRACTICES(record.userId),
        JSON.stringify(practices)
      );
      
      // Update streak if practice was completed
      if (normalizedRecord.completed) {
        await this.updateStreak(record.userId, record.prayer, new Date(record.prayerTime));
      }
      
      // Update statistics
      await this.updateStats(record.userId);
      
    } catch (error) {
      console.error('[PrayerPracticeStorage] Error saving practice:', error);
      throw new Error('Failed to save prayer practice record');
    }
  }
  
  /**
   * Update an existing practice record
   */
  static async updatePractice(
    userId: string,
    practiceId: string,
    updates: Partial<PrayerPracticeRecord>
  ): Promise<void> {
    try {
      const practices = await this.getAllPractices(userId);
      const index = practices.findIndex(p => p.id === practiceId);
      
      if (index === -1) {
        throw new Error(`Practice record ${practiceId} not found`);
      }
      
      const updatedRecord: PrayerPracticeRecord = {
        ...practices[index],
        ...updates,
        updatedAt: new Date()
      };
      
      practices[index] = updatedRecord;
      
      await AsyncStorage.setItem(
        STORAGE_KEYS.PRACTICES(userId),
        JSON.stringify(practices)
      );
      
      // Update streak if completion status changed
      if (updates.completed !== undefined) {
        await this.updateStreak(userId, updatedRecord.prayer, new Date(updatedRecord.prayerTime));
      }
      
      // Refresh statistics
      await this.updateStats(userId);
      
    } catch (error) {
      console.error('[PrayerPracticeStorage] Error updating practice:', error);
      throw error;
    }
  }
  
  /**
   * Mark a practice as completed
   */
  static async completePractice(
    userId: string,
    practiceId: string,
    actualCount: number,
    quality?: 1 | 2 | 3 | 4 | 5
  ): Promise<void> {
    await this.updatePractice(userId, practiceId, {
      completed: true,
      actualCount,
      completedAt: new Date(),
      quality
    });
  }
  
  // ==========================================================================
  // RETRIEVAL
  // ==========================================================================
  
  /**
   * Get all practices for a user (internal use)
   */
  private static async getAllPractices(userId: string): Promise<PrayerPracticeRecord[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.PRACTICES(userId));
      
      if (!data) {
        return [];
      }
      
      const practices: PrayerPracticeRecord[] = JSON.parse(data);
      
      // Convert date strings back to Date objects
      return practices.map(p => ({
        ...p,
        prayerTime: new Date(p.prayerTime),
        startedAt: new Date(p.startedAt),
        completedAt: p.completedAt ? new Date(p.completedAt) : undefined,
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt)
      }));
      
    } catch (error) {
      console.error('[PrayerPracticeStorage] Error getting all practices:', error);
      return [];
    }
  }
  
  /**
   * Get practice history with limit
   */
  static async getPracticeHistory(
    userId: string,
    limit: number = 30
  ): Promise<PrayerPracticeRecord[]> {
    try {
      const practices = await this.getAllPractices(userId);
      return practices.slice(0, limit);
    } catch (error) {
      console.error('[PrayerPracticeStorage] Error getting practice history:', error);
      return [];
    }
  }
  
  /**
   * Get today's practices
   */
  static async getTodaysPractices(userId: string): Promise<PrayerPracticeRecord[]> {
    try {
      const practices = await this.getAllPractices(userId);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      return practices.filter(p => {
        const practiceDate = new Date(p.prayerTime);
        practiceDate.setHours(0, 0, 0, 0);
        return practiceDate.getTime() === today.getTime();
      });
    } catch (error) {
      console.error('[PrayerPracticeStorage] Error getting today\'s practices:', error);
      return [];
    }
  }
  
  /**
   * Get practices for a specific prayer
   */
  static async getPracticesByPrayer(
    userId: string,
    prayer: Prayer,
    limit?: number
  ): Promise<PrayerPracticeRecord[]> {
    try {
      const practices = await this.getAllPractices(userId);
      const filtered = practices.filter(p => p.prayer === prayer);
      return limit ? filtered.slice(0, limit) : filtered;
    } catch (error) {
      console.error('[PrayerPracticeStorage] Error getting practices by prayer:', error);
      return [];
    }
  }
  
  /**
   * Get practices within a date range
   */
  static async getPracticesByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<PrayerPracticeRecord[]> {
    try {
      const practices = await this.getAllPractices(userId);
      return practices.filter(p => {
        const prayerTime = new Date(p.prayerTime);
        return prayerTime >= startDate && prayerTime <= endDate;
      });
    } catch (error) {
      console.error('[PrayerPracticeStorage] Error getting practices by date range:', error);
      return [];
    }
  }
  
  // ==========================================================================
  // STREAKS
  // ==========================================================================
  
  /**
   * Update streak for a prayer
   */
  private static async updateStreak(
    userId: string,
    prayer: Prayer,
    practiceDate: Date
  ): Promise<void> {
    try {
      const streaks = await this.getAllStreaks(userId);
      const existingStreak = streaks.find(s => s.prayer === prayer);
      
      const normalizedDate = new Date(practiceDate);
      normalizedDate.setHours(0, 0, 0, 0);
      
      if (!existingStreak) {
        // First practice for this prayer
        streaks.push({
          prayer,
          currentStreak: 1,
          longestStreak: 1,
          lastPracticeDate: normalizedDate
        });
      } else {
        const lastDate = new Date(existingStreak.lastPracticeDate);
        lastDate.setHours(0, 0, 0, 0);
        
        const daysDiff = Math.floor((normalizedDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === 0) {
          // Same day, no change
          return;
        } else if (daysDiff === 1) {
          // Consecutive day, increment streak
          existingStreak.currentStreak += 1;
          existingStreak.longestStreak = Math.max(existingStreak.longestStreak, existingStreak.currentStreak);
          existingStreak.lastPracticeDate = normalizedDate;
        } else {
          // Streak broken, start new
          existingStreak.currentStreak = 1;
          existingStreak.lastPracticeDate = normalizedDate;
        }
      }
      
      await AsyncStorage.setItem(
        STORAGE_KEYS.STREAKS(userId),
        JSON.stringify(streaks)
      );
      
    } catch (error) {
      console.error('[PrayerPracticeStorage] Error updating streak:', error);
    }
  }
  
  /**
   * Get all streaks
   */
  private static async getAllStreaks(userId: string): Promise<PracticeStreak[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.STREAKS(userId));
      
      if (!data) {
        return [];
      }
      
      const streaks: PracticeStreak[] = JSON.parse(data);
      return streaks.map(s => ({
        ...s,
        lastPracticeDate: new Date(s.lastPracticeDate)
      }));
      
    } catch (error) {
      console.error('[PrayerPracticeStorage] Error getting streaks:', error);
      return [];
    }
  }
  
  /**
   * Get prayer streak (consecutive days)
   */
  static async getPrayerStreak(
    userId: string,
    prayer: Prayer
  ): Promise<number> {
    try {
      const streaks = await this.getAllStreaks(userId);
      const streak = streaks.find(s => s.prayer === prayer);
      
      if (!streak) {
        return 0;
      }
      
      // Check if streak is still valid (practiced within last day)
      const lastDate = new Date(streak.lastPracticeDate);
      lastDate.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff > 1) {
        // Streak broken
        return 0;
      }
      
      return streak.currentStreak;
      
    } catch (error) {
      console.error('[PrayerPracticeStorage] Error getting prayer streak:', error);
      return 0;
    }
  }
  
  /**
   * Get all current streaks
   */
  static async getAllCurrentStreaks(userId: string): Promise<Record<Prayer, number>> {
    const prayers: Prayer[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    const streaks: Record<Prayer, number> = {} as Record<Prayer, number>;
    
    for (const prayer of prayers) {
      streaks[prayer] = await this.getPrayerStreak(userId, prayer);
    }
    
    return streaks;
  }
  
  // ==========================================================================
  // STATISTICS
  // ==========================================================================
  
  /**
   * Update cached statistics
   */
  private static async updateStats(userId: string): Promise<void> {
    try {
      const stats = await this.calculateStats(userId, 30);
      
      await AsyncStorage.setItem(
        STORAGE_KEYS.STATS(userId),
        JSON.stringify(stats)
      );
    } catch (error) {
      console.error('[PrayerPracticeStorage] Error updating stats:', error);
    }
  }
  
  /**
   * Calculate statistics from practices
   */
  private static async calculateStats(
    userId: string,
    days: number = 30
  ): Promise<PracticeStats> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      
      const practices = await this.getAllPractices(userId);
      const recentPractices = practices.filter(p => new Date(p.prayerTime) >= cutoffDate);
      
      const totalPractices = recentPractices.length;
      const completedPractices = recentPractices.filter(p => p.completed).length;
      
      const totalDuration = recentPractices.reduce((sum, p) => sum + (p.duration || 0), 0);
      const averageDuration = completedPractices > 0 ? totalDuration / completedPractices : 0;
      
      const completionRate = totalPractices > 0 ? (completedPractices / totalPractices) * 100 : 0;
      
      // Calculate favorite Divine Names
      const nameCounts: Record<string, number> = {};
      recentPractices.forEach(p => {
        if (p.completed && p.divineName) {
          nameCounts[p.divineName] = (nameCounts[p.divineName] || 0) + 1;
        }
      });
      
      const favoriteNames = Object.entries(nameCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
      
      // Calculate average quality
      const qualityRatings = recentPractices
        .filter(p => p.quality !== undefined)
        .map(p => p.quality!);
      
      const averageQuality = qualityRatings.length > 0
        ? qualityRatings.reduce((sum, q) => sum + q, 0) / qualityRatings.length
        : undefined;
      
      return {
        totalPractices,
        completedPractices,
        totalDuration,
        averageDuration,
        completionRate,
        favoriteNames,
        averageQuality
      };
      
    } catch (error) {
      console.error('[PrayerPracticeStorage] Error calculating stats:', error);
      return {
        totalPractices: 0,
        completedPractices: 0,
        totalDuration: 0,
        averageDuration: 0,
        completionRate: 0,
        favoriteNames: []
      };
    }
  }
  
  /**
   * Get completion rate
   */
  static async getCompletionRate(
    userId: string,
    days: number = 30
  ): Promise<number> {
    try {
      const stats = await this.calculateStats(userId, days);
      return stats.completionRate;
    } catch (error) {
      console.error('[PrayerPracticeStorage] Error getting completion rate:', error);
      return 0;
    }
  }
  
  /**
   * Get comprehensive statistics
   */
  static async getStatistics(
    userId: string,
    days: number = 30
  ): Promise<PracticeStats> {
    try {
      // Try to get cached stats first
      const cachedData = await AsyncStorage.getItem(STORAGE_KEYS.STATS(userId));
      
      if (cachedData) {
        return JSON.parse(cachedData);
      }
      
      // Calculate if no cache
      return await this.calculateStats(userId, days);
    } catch (error) {
      console.error('[PrayerPracticeStorage] Error getting statistics:', error);
      return {
        totalPractices: 0,
        completedPractices: 0,
        totalDuration: 0,
        averageDuration: 0,
        completionRate: 0,
        favoriteNames: []
      };
    }
  }
  
  // ==========================================================================
  // DELETE & CLEAR
  // ==========================================================================
  
  /**
   * Delete a specific practice record
   */
  static async deletePractice(userId: string, practiceId: string): Promise<void> {
    try {
      const practices = await this.getAllPractices(userId);
      const filtered = practices.filter(p => p.id !== practiceId);
      
      await AsyncStorage.setItem(
        STORAGE_KEYS.PRACTICES(userId),
        JSON.stringify(filtered)
      );
      
      // Refresh statistics
      await this.updateStats(userId);
      
    } catch (error) {
      console.error('[PrayerPracticeStorage] Error deleting practice:', error);
      throw error;
    }
  }
  
  /**
   * Clear all practices for a user
   */
  static async clearAllPractices(userId: string): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.PRACTICES(userId),
        STORAGE_KEYS.STREAKS(userId),
        STORAGE_KEYS.STATS(userId),
        STORAGE_KEYS.INDEX(userId)
      ]);
    } catch (error) {
      console.error('[PrayerPracticeStorage] Error clearing practices:', error);
      throw error;
    }
  }
  
  // ==========================================================================
  // UTILITY
  // ==========================================================================
  
  /**
   * Generate unique ID for practice record
   */
  static generatePracticeId(userId: string, prayer: Prayer, prayerTime: Date): string {
    const timestamp = prayerTime.getTime();
    const random = Math.random().toString(36).substring(2, 9);
    return `${userId}_${prayer}_${timestamp}_${random}`;
  }
  
  /**
   * Export all data for backup
   */
  static async exportData(userId: string): Promise<string> {
    try {
      const practices = await this.getAllPractices(userId);
      const streaks = await this.getAllStreaks(userId);
      const stats = await this.getStatistics(userId);
      
      const exportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        userId,
        practices,
        streaks,
        stats
      };
      
      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('[PrayerPracticeStorage] Error exporting data:', error);
      throw error;
    }
  }
  
  /**
   * Import data from backup
   */
  static async importData(userId: string, jsonData: string): Promise<void> {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.userId !== userId) {
        throw new Error('User ID mismatch in import data');
      }
      
      // Clear existing data
      await this.clearAllPractices(userId);
      
      // Import practices
      if (data.practices && Array.isArray(data.practices)) {
        await AsyncStorage.setItem(
          STORAGE_KEYS.PRACTICES(userId),
          JSON.stringify(data.practices)
        );
      }
      
      // Import streaks
      if (data.streaks && Array.isArray(data.streaks)) {
        await AsyncStorage.setItem(
          STORAGE_KEYS.STREAKS(userId),
          JSON.stringify(data.streaks)
        );
      }
      
      // Recalculate stats
      await this.updateStats(userId);
      
    } catch (error) {
      console.error('[PrayerPracticeStorage] Error importing data:', error);
      throw error;
    }
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default PrayerPracticeStorage;
