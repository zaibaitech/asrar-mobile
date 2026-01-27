/**
 * Production-Ready Cache Manager
 * ==============================
 * Handles device storage with automatic cleanup, expiration, and size limits
 * Prevents "disk full" errors through intelligent cache management
 * 
 * Each user's device has ~10-20MB available. This manager ensures we stay well under the limit.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================================================
// TYPES
// ============================================================================

export interface CacheEntry<T> {
  data: T;
  createdAt: number;
  expiresAt: number;
  size: number; // bytes
  priority: 'critical' | 'high' | 'normal' | 'low';
}

export interface CacheConfig {
  maxSizeBytes?: number; // Default: 5MB
  maxEntries?: number;   // Default: 100
  defaultTTL?: number;   // Default: 24 hours (ms)
}

// ============================================================================
// CONSTANTS
// ============================================================================

const DEFAULT_CONFIG: CacheConfig = {
  maxSizeBytes: 5 * 1024 * 1024, // 5MB per category
  maxEntries: 100,
  defaultTTL: 24 * 60 * 60 * 1000, // 24 hours
};

// ============================================================================
// CACHE MANAGER CLASS
// ============================================================================

export class CacheManager {
  private prefix: string;
  private config: Required<CacheConfig>;
  private metrics = {
    hits: 0,
    misses: 0,
    cleanups: 0,
  };

  constructor(prefix: string, config?: CacheConfig) {
    this.prefix = `@cache_${prefix}_`;
    this.config = {
      maxSizeBytes: config?.maxSizeBytes ?? DEFAULT_CONFIG.maxSizeBytes!,
      maxEntries: config?.maxEntries ?? DEFAULT_CONFIG.maxEntries!,
      defaultTTL: config?.defaultTTL ?? DEFAULT_CONFIG.defaultTTL!,
    };
  }

  /**
   * Get cached value if it exists and hasn't expired
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const stored = await AsyncStorage.getItem(this.prefix + key);
      if (!stored) {
        this.metrics.misses++;
        return null;
      }

      const entry: CacheEntry<T> = JSON.parse(stored);

      // Check expiration
      if (Date.now() > entry.expiresAt) {
        await AsyncStorage.removeItem(this.prefix + key);
        this.metrics.misses++;
        return null;
      }

      this.metrics.hits++;
      return entry.data;
    } catch (error) {
      console.error(`[CacheManager] Get error for ${key}:`, error);
      this.metrics.misses++;
      return null;
    }
  }

  /**
   * Set cached value with automatic expiration
   */
  async set<T>(
    key: string,
    data: T,
    ttlMs?: number,
    priority: 'critical' | 'high' | 'normal' | 'low' = 'normal'
  ): Promise<boolean> {
    try {
      const entryStr = JSON.stringify(data);
      const entry: CacheEntry<T> = {
        data,
        createdAt: Date.now(),
        expiresAt: Date.now() + (ttlMs || this.config.defaultTTL),
        size: entryStr.length,
        priority,
      };

      // Check if adding this would exceed size limit
      const totalSize = await this.getTotalSize();
      if (totalSize + entry.size > this.config.maxSizeBytes) {
        // Try to make space by removing low-priority expired entries
        await this.cleanup(true);

        const newSize = await this.getTotalSize();
        if (newSize + entry.size > this.config.maxSizeBytes) {
          console.warn(
            `[CacheManager] Cache full (${newSize}/${this.config.maxSizeBytes}), ` +
            `cannot add ${key} (${entry.size} bytes)`
          );
          return false;
        }
      }

      await AsyncStorage.setItem(this.prefix + key, JSON.stringify(entry));
      return true;
    } catch (error) {
      const errorMsg = (error as any)?.message || '';
      if (errorMsg.includes('SQLITE_FULL') || errorMsg.includes('disk is full')) {
        console.warn(`[CacheManager] Disk full on set(${key}), cleaning up...`);
        // Clear low-priority items aggressively
        await this.cleanup(true, 'low');
        return false;
      }
      console.error(`[CacheManager] Set error for ${key}:`, error);
      return false;
    }
  }

  /**
   * Remove a specific cache entry
   */
  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.prefix + key);
    } catch (error) {
      console.error(`[CacheManager] Remove error for ${key}:`, error);
    }
  }

  /**
   * Clear all cache entries for this manager
   */
  async clear(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const prefixedKeys = keys.filter(k => k.startsWith(this.prefix));
      if (prefixedKeys.length > 0) {
        await AsyncStorage.multiRemove(prefixedKeys);
        console.log(`[CacheManager] Cleared ${prefixedKeys.length} entries`);
      }
    } catch (error) {
      console.error('[CacheManager] Clear error:', error);
    }
  }

  /**
   * Cleanup expired entries and enforce size limits
   */
  async cleanup(aggressive = false, targetPriority?: string): Promise<void> {
    try {
      const now = Date.now();
      const keys = await AsyncStorage.getAllKeys();
      const prefixedKeys = keys.filter(k => k.startsWith(this.prefix));

      const entries: Array<{
        key: string;
        entry: CacheEntry<any>;
      }> = [];

      // Load all entries
      for (const key of prefixedKeys) {
        try {
          const stored = await AsyncStorage.getItem(key);
          if (stored) {
            entries.push({
              key,
              entry: JSON.parse(stored),
            });
          }
        } catch {
          // Skip malformed entries
        }
      }

      // Sort by: priority (critical last), then expiration time
      entries.sort((a, b) => {
        const priorityOrder = { critical: 3, high: 2, normal: 1, low: 0 };
        const priorityDiff =
          priorityOrder[a.entry.priority] - priorityOrder[b.entry.priority];
        if (priorityDiff !== 0) return priorityDiff;
        return a.entry.expiresAt - b.entry.expiresAt;
      });

      let removed = 0;

      // Phase 1: Remove expired entries
      for (const { key, entry } of entries) {
        if (now > entry.expiresAt) {
          await AsyncStorage.removeItem(key);
          removed++;
        }
      }

      // Phase 2: If aggressive or still over limit, remove low-priority entries
      if (aggressive || (await this.getTotalSize()) > this.config.maxSizeBytes) {
        for (const { key, entry } of entries) {
          if (
            targetPriority ?
              entry.priority === targetPriority :
              entry.priority === 'low' || entry.priority === 'normal'
          ) {
            await AsyncStorage.removeItem(key);
            removed++;

            // Check if we're under limit now
            if ((await this.getTotalSize()) < this.config.maxSizeBytes * 0.8) {
              break;
            }
          }
        }
      }

      if (removed > 0) {
        this.metrics.cleanups++;
        console.log(
          `[CacheManager] Cleanup removed ${removed} entries ` +
          `(size: ${await this.getTotalSize()} bytes)`
        );
      }
    } catch (error) {
      console.error('[CacheManager] Cleanup error:', error);
    }
  }

  /**
   * Get total size of all cached entries
   */
  private async getTotalSize(): Promise<number> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const prefixedKeys = keys.filter(k => k.startsWith(this.prefix));

      let total = 0;
      for (const key of prefixedKeys) {
        const stored = await AsyncStorage.getItem(key);
        if (stored) {
          try {
            const entry: CacheEntry<any> = JSON.parse(stored);
            total += entry.size;
          } catch {
            total += (stored?.length || 0);
          }
        }
      }
      return total;
    } catch {
      return 0;
    }
  }

  /**
   * Get cache statistics
   */
  getMetrics() {
    const total = this.metrics.hits + this.metrics.misses;
    return {
      hits: this.metrics.hits,
      misses: this.metrics.misses,
      hitRate: total > 0 ? (this.metrics.hits / total * 100).toFixed(1) + '%' : 'N/A',
      cleanups: this.metrics.cleanups,
    };
  }

  /**
   * Reset metrics
   */
  resetMetrics() {
    this.metrics = { hits: 0, misses: 0, cleanups: 0 };
  }
}

// ============================================================================
// SINGLETON INSTANCES FOR DIFFERENT DATA TYPES
// ============================================================================

export const transitsCache = new CacheManager('transits', {
  maxSizeBytes: 2 * 1024 * 1024, // 2MB
  defaultTTL: 5 * 60 * 1000, // 5 minutes (real-time data)
});

export const prayerTimesCache = new CacheManager('prayer-times', {
  maxSizeBytes: 1 * 1024 * 1024, // 1MB
  defaultTTL: 24 * 60 * 60 * 1000, // 24 hours
});

export const ephemerisCache = new CacheManager('ephemeris', {
  maxSizeBytes: 2 * 1024 * 1024, // 2MB
  defaultTTL: 30 * 60 * 1000, // 30 minutes
});

export const moonDataCache = new CacheManager('moon-data', {
  maxSizeBytes: 512 * 1024, // 512KB
  defaultTTL: 24 * 60 * 60 * 1000, // 24 hours
});

export const generalCache = new CacheManager('general', {
  maxSizeBytes: 2 * 1024 * 1024, // 2MB
  defaultTTL: 60 * 60 * 1000, // 1 hour
});
