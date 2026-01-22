/**
 * Prayer Times Cache Manager
 * 
 * Utility functions for managing prayer times cache lifecycle:
 * - Initialize cache on app launch
 * - Periodic cleanup of expired caches
 * - Cache status monitoring
 * - Background prefetching
 * 
 * @module prayerCacheManager
 */

import {
    cleanupExpiredCaches,
    getCacheStatus,
    getMonthlyPrayerTimes,
    initializeCommonLocationCaches,
    shouldRefreshCache,
    type CalculationMethod,
} from '@/services/PrayerTimesCacheService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const INIT_FLAG_KEY = '@asrar_prayer_cache_initialized';
const LAST_CLEANUP_KEY = '@asrar_prayer_cache_last_cleanup';
const CLEANUP_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// ─────────────────────────────────────────────────────────────────────────────
// Initialization
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Initialize prayer times cache system
 * Call this once on app launch (e.g., in App.tsx or _layout.tsx)
 * 
 * @param userLocation - User's current location (if available)
 * @param method - Calculation method to use
 */
export async function initializePrayerCache(
  userLocation?: { latitude: number; longitude: number },
  method: CalculationMethod = 3
): Promise<void> {
  try {
    console.log('🕌 Initializing prayer times cache...');
    
    // Check if we've already initialized
    const initialized = await AsyncStorage.getItem(INIT_FLAG_KEY);
    const isFirstLaunch = !initialized;
    
    // 1. Cleanup expired caches if needed
    await cleanupIfNeeded();
    
    // 2. Cache user's location first (if provided)
    if (userLocation) {
      console.log('📍 Caching prayer times for user location...');
      await getMonthlyPrayerTimes(
        userLocation.latitude,
        userLocation.longitude,
        method
      ).catch(err => console.warn('Failed to cache user location:', err));
    }
    
    // 3. Pre-cache common locations (only on first launch + WiFi)
    if (isFirstLaunch) {
      const netInfo = await NetInfo.fetch();
      if (netInfo.type === 'wifi') {
        console.log('🌍 First launch: Pre-caching common locations...');
        await initializeCommonLocationCaches(method);
      } else {
        console.log('📶 Skipping common locations (not on WiFi)');
      }
      
      // Mark as initialized
      await AsyncStorage.setItem(INIT_FLAG_KEY, new Date().toISOString());
    }
    
    console.log('✅ Prayer times cache initialized');
    
  } catch (error) {
    console.error('Failed to initialize prayer cache:', error);
    // Don't throw - initialization failures shouldn't crash the app
  }
}

/**
 * Check if cache needs refresh and update if necessary
 * Call this when:
 * - App comes to foreground
 * - User's location changes
 * - User navigates to prayer times screen
 */
export async function checkAndRefreshCache(
  latitude: number,
  longitude: number,
  method: CalculationMethod = 3
): Promise<{
  refreshed: boolean;
  reason: string;
  cacheStatus: Awaited<ReturnType<typeof getCacheStatus>>;
}> {
  try {
    const shouldRefresh = await shouldRefreshCache(latitude, longitude);
    const cacheStatus = await getCacheStatus(latitude, longitude);
    
    if (shouldRefresh.shouldRefresh) {
      console.log(`🔄 Refreshing cache: ${shouldRefresh.reason}`);
      
      // Refresh in background (don't block UI)
      getMonthlyPrayerTimes(latitude, longitude, method)
        .catch(err => console.warn('Background refresh failed:', err));
      
      return {
        refreshed: true,
        reason: shouldRefresh.reason,
        cacheStatus,
      };
    }
    
    return {
      refreshed: false,
      reason: shouldRefresh.reason,
      cacheStatus,
    };
    
  } catch (error) {
    console.error('Failed to check cache:', error);
    return {
      refreshed: false,
      reason: 'Error checking cache',
      cacheStatus: {
        isCached: false,
        isExpired: true,
        cachedAt: null,
        expiresAt: null,
        daysRemaining: 0,
        source: 'none',
      },
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Cleanup
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Cleanup expired caches if needed (based on interval)
 * Runs automatically during initialization
 */
async function cleanupIfNeeded(): Promise<void> {
  try {
    const lastCleanup = await AsyncStorage.getItem(LAST_CLEANUP_KEY);
    const now = Date.now();
    
    if (!lastCleanup) {
      // First time, just run cleanup
      const removed = await cleanupExpiredCaches();
      await AsyncStorage.setItem(LAST_CLEANUP_KEY, now.toString());
      console.log(`🧹 Initial cleanup: Removed ${removed} expired caches`);
      return;
    }
    
    const lastCleanupTime = parseInt(lastCleanup, 10);
    const timeSinceLastCleanup = now - lastCleanupTime;
    
    if (timeSinceLastCleanup >= CLEANUP_INTERVAL_MS) {
      const removed = await cleanupExpiredCaches();
      await AsyncStorage.setItem(LAST_CLEANUP_KEY, now.toString());
      console.log(`🧹 Scheduled cleanup: Removed ${removed} expired caches`);
    }
    
  } catch (error) {
    console.error('Cleanup failed:', error);
  }
}

/**
 * Force cleanup of all expired caches
 * Can be called manually from settings or debug menu
 */
export async function forceCleanupExpiredCaches(): Promise<number> {
  try {
    const removed = await cleanupExpiredCaches();
    await AsyncStorage.setItem(LAST_CLEANUP_KEY, Date.now().toString());
    console.log(`🧹 Manual cleanup: Removed ${removed} expired caches`);
    return removed;
  } catch (error) {
    console.error('Force cleanup failed:', error);
    return 0;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Monitoring & Debugging
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get comprehensive cache statistics
 * Useful for debugging or showing in settings
 */
export async function getCacheStatistics(): Promise<{
  totalCaches: number;
  totalSizeKB: number;
  oldestCache: Date | null;
  newestCache: Date | null;
  cachesByMonth: Record<string, number>;
}> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const prayerCacheKeys = keys.filter(key => key.startsWith('@asrar_prayer_month_'));
    
    if (prayerCacheKeys.length === 0) {
      return {
        totalCaches: 0,
        totalSizeKB: 0,
        oldestCache: null,
        newestCache: null,
        cachesByMonth: {},
      };
    }
    
    const caches = await AsyncStorage.multiGet(prayerCacheKeys);
    
    let totalSize = 0;
    let oldestDate: Date | null = null;
    let newestDate: Date | null = null;
    const cachesByMonth: Record<string, number> = {};
    
    for (const [key, value] of caches) {
      if (!value) continue;
      
      try {
        // Calculate size
        totalSize += new Blob([value]).size;
        
        const data = JSON.parse(value);
        const cachedAt = new Date(data.cachedAt);
        
        // Track oldest/newest
        if (!oldestDate || cachedAt < oldestDate) {
          oldestDate = cachedAt;
        }
        if (!newestDate || cachedAt > newestDate) {
          newestDate = cachedAt;
        }
        
        // Count by month
        const monthKey = `${data.year}-${String(data.month + 1).padStart(2, '0')}`;
        cachesByMonth[monthKey] = (cachesByMonth[monthKey] || 0) + 1;
        
      } catch (parseError) {
        // Invalid cache entry, skip it
        console.warn('Invalid cache entry:', key);
      }
    }
    
    return {
      totalCaches: prayerCacheKeys.length,
      totalSizeKB: Math.round(totalSize / 1024),
      oldestCache: oldestDate,
      newestCache: newestDate,
      cachesByMonth,
    };
    
  } catch (error) {
    console.error('Failed to get cache statistics:', error);
    return {
      totalCaches: 0,
      totalSizeKB: 0,
      oldestCache: null,
      newestCache: null,
      cachesByMonth: {},
    };
  }
}

/**
 * Get cache hit rate (for performance monitoring)
 * This is a simplified version - in production you'd track actual hits/misses
 */
export async function getCacheHitRate(): Promise<{
  hitRate: number;
  description: string;
}> {
  const stats = await getCacheStatistics();
  
  if (stats.totalCaches === 0) {
    return {
      hitRate: 0,
      description: 'No caches available',
    };
  }
  
  // If we have recent caches, assume high hit rate
  if (stats.newestCache && Date.now() - stats.newestCache.getTime() < 7 * 24 * 60 * 60 * 1000) {
    return {
      hitRate: 0.95, // 95% hit rate assumption
      description: 'Excellent (recent caches available)',
    };
  }
  
  if (stats.newestCache && Date.now() - stats.newestCache.getTime() < 30 * 24 * 60 * 60 * 1000) {
    return {
      hitRate: 0.70, // 70% hit rate assumption
      description: 'Good (caches mostly valid)',
    };
  }
  
  return {
    hitRate: 0.30, // 30% hit rate assumption
    description: 'Poor (caches outdated)',
  };
}

/**
 * Log cache status to console (for debugging)
 */
export async function logCacheStatus(
  latitude?: number,
  longitude?: number
): Promise<void> {
  const stats = await getCacheStatistics();
  const hitRate = await getCacheHitRate();
  
  console.log('═══════════════════════════════════════════════════');
  console.log('🕌 PRAYER TIMES CACHE STATUS');
  console.log('═══════════════════════════════════════════════════');
  console.log(`Total Caches: ${stats.totalCaches}`);
  console.log(`Total Size: ${stats.totalSizeKB} KB`);
  console.log(`Oldest Cache: ${stats.oldestCache?.toLocaleDateString() || 'N/A'}`);
  console.log(`Newest Cache: ${stats.newestCache?.toLocaleDateString() || 'N/A'}`);
  console.log(`Hit Rate: ${(hitRate.hitRate * 100).toFixed(1)}% (${hitRate.description})`);
  console.log('─────────────────────────────────────────────────');
  console.log('Caches by Month:');
  Object.entries(stats.cachesByMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([month, count]) => {
      console.log(`  ${month}: ${count} location(s)`);
    });
  
  if (latitude && longitude) {
    console.log('─────────────────────────────────────────────────');
    const status = await getCacheStatus(latitude, longitude);
    console.log('Current Location Cache:');
    console.log(`  Cached: ${status.isCached ? 'Yes' : 'No'}`);
    console.log(`  Expired: ${status.isExpired ? 'Yes' : 'No'}`);
    console.log(`  Days Remaining: ${status.daysRemaining}`);
    console.log(`  Source: ${status.source}`);
  }
  
  console.log('═══════════════════════════════════════════════════');
}

// ─────────────────────────────────────────────────────────────────────────────
// Export utilities
// ─────────────────────────────────────────────────────────────────────────────

export {
    getCacheStatus,
    shouldRefreshCache
} from '@/services/PrayerTimesCacheService';

