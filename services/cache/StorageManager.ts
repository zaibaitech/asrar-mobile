/**
 * Storage Manager
 * ===============
 * Emergency storage management for when device storage is critically low
 * Handles disk full situations gracefully
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const __DEV__ = process.env.NODE_ENV === 'development';

// ============================================================================
// STORAGE EMERGENCY HANDLER
// ============================================================================

export class StorageManager {
  /**
   * Clear ALL non-critical cache to free up space
   * This is an emergency operation called when disk is full
   */
  static async emergencyClearCache(): Promise<void> {
    try {
      console.warn('[StorageManager] EMERGENCY: Clearing all cache to free up space');
      
      const allKeys = await AsyncStorage.getAllKeys();
      const cacheKeys = allKeys.filter(key => 
        key.startsWith('@cache_') ||
        key.includes('cache') ||
        key.includes('CACHE')
      );

      if (cacheKeys.length > 0) {
        await AsyncStorage.multiRemove(cacheKeys);
        console.log(`[StorageManager] Emergency cleared ${cacheKeys.length} cache entries`);
      }
    } catch (error) {
      console.error('[StorageManager] Emergency clear failed:', error);
    }
  }

  /**
   * Clear specific cache category
   */
  static async clearCacheCategory(prefix: string): Promise<void> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const keys = allKeys.filter(key => key.includes(prefix));
      
      if (keys.length > 0) {
        await AsyncStorage.multiRemove(keys);
        console.log(`[StorageManager] Cleared ${keys.length} entries for ${prefix}`);
      }
    } catch (error) {
      console.error(`[StorageManager] Clear ${prefix} failed:`, error);
    }
  }

  /**
   * Get current storage usage estimate
   */
  static async getStorageUsage(): Promise<{
    used: number;
    estimate: string;
  }> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      let totalSize = 0;

      for (const key of allKeys) {
        try {
          const value = await AsyncStorage.getItem(key);
          if (value) {
            totalSize += value.length;
          }
        } catch {
          // Skip
        }
      }

      return {
        used: totalSize,
        estimate: `${(totalSize / 1024 / 1024).toFixed(2)}MB`,
      };
    } catch (error) {
      console.error('[StorageManager] Failed to calculate storage usage:', error);
      return { used: 0, estimate: 'unknown' };
    }
  }

  /**
   * Aggressive cleanup: Remove all but most essential data
   */
  static async aggressiveCleanup(): Promise<void> {
    try {
      console.warn('[StorageManager] Aggressive cleanup starting...');
      
      // Priority order for deletion
      const clearOrder = [
        'quran',           // Quran cache (can be redownloaded)
        'ephemeris',       // Ephemeris cache (can be recalculated)
        'prayer-times',    // Prayer times (can be refetched)
        'cache_general',   // General cache
        'cache_moon',      // Moon data
      ];

      for (const prefix of clearOrder) {
        await this.clearCacheCategory(prefix);
        const usage = await this.getStorageUsage();
        console.log(`[StorageManager] After clearing ${prefix}: ${usage.estimate}`);

        // Stop if we freed enough space
        if (usage.used < 2 * 1024 * 1024) { // 2MB threshold
          console.log('[StorageManager] Freed enough space, stopping cleanup');
          break;
        }
      }
    } catch (error) {
      console.error('[StorageManager] Aggressive cleanup failed:', error);
    }
  }

  /**
   * Safe write with automatic cleanup on disk full
   */
  static async safeWrite(
    key: string,
    value: string,
    maxRetries: number = 3
  ): Promise<boolean> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await AsyncStorage.setItem(key, value);
        return true;
      } catch (error) {
        const errorMsg = (error as any)?.message || '';
        const isDiskFull = 
          errorMsg.includes('SQLITE_FULL') || 
          errorMsg.includes('disk is full');

        if (!isDiskFull) {
          throw error; // Not a disk issue, fail immediately
        }

        if (attempt < maxRetries) {
          console.warn(
            `[StorageManager] Disk full on attempt ${attempt}, ` +
            `clearing cache and retrying...`
          );
          
          if (attempt === 1) {
            await this.emergencyClearCache();
          } else if (attempt === 2) {
            await this.aggressiveCleanup();
          }
        } else {
          console.error(
            '[StorageManager] Disk full after all retries, ' +
            'switching to memory-only mode'
          );
          return false;
        }
      }
    }
    return false;
  }
}

// ============================================================================
// GLOBAL MEMORY-ONLY FALLBACK
// ============================================================================

interface MemoryCache {
  [key: string]: {
    value: any;
    expiresAt: number;
  };
}

class MemoryOnlyStorage {
  private cache: MemoryCache = {};
  private isActive = false;

  activate() {
    console.warn('[MemoryOnlyStorage] Activating memory-only mode (disk full)');
    this.isActive = true;
  }

  isEnabled(): boolean {
    return this.isActive;
  }

  set(key: string, value: any, ttlMs: number = 24 * 60 * 60 * 1000): void {
    this.cache[key] = {
      value,
      expiresAt: Date.now() + ttlMs,
    };
  }

  get(key: string): any {
    const entry = this.cache[key];
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      delete this.cache[key];
      return null;
    }

    return entry.value;
  }

  remove(key: string): void {
    delete this.cache[key];
  }

  clear(): void {
    this.cache = {};
  }

  getMetrics() {
    return {
      entries: Object.keys(this.cache).length,
      active: this.isActive,
    };
  }
}

export const memoryOnlyStorage = new MemoryOnlyStorage();
