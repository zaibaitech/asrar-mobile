/**
 * Prayer Times Cache Service
 * 
 * Implements monthly caching strategy for prayer times:
 * - Caches entire month of prayer times (not just single days)
 * - Prayer times change only 1-2 minutes per day - very predictable
 * - Reduces API calls by ~99%
 * - Provides excellent offline experience
 * - Optional Supabase sync for cross-device support
 * 
 * @module PrayerTimesCacheService
 */

// @ts-ignore - __DEV__ is defined by React Native
declare const __DEV__: boolean;

import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import type { CalculationMethod, PrayerTimeResponse, PrayerTimings } from './api/prayerTimes';

// Supabase is optional - gracefully handle if not configured
let supabase: any = null;
try {
  // Try to import supabase client if available
  const supabaseModule = require('./supabase');
  supabase = supabaseModule.supabase;
} catch {
  // Supabase not configured - will use local cache only
  if (__DEV__) {
    console.log('Supabase not configured - using local cache only');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const ALADHAN_API_BASE = 'https://api.aladhan.com/v1';
const CACHE_KEY_PREFIX = '@asrar_prayer_month_';
const CACHE_DURATION_DAYS = 30;
const CACHE_DURATION_MS = CACHE_DURATION_DAYS * 24 * 60 * 60 * 1000;
const LOCATION_CHANGE_THRESHOLD_KM = 5; // Refresh if location changes > 5km

// In-memory cache + in-flight dedupe.
// This prevents expensive repeated AsyncStorage/NetInfo work when many callers
// ask for the same month in quick succession (e.g., notification scheduling).
const memoryMonthlyCache = new Map<string, MonthlyPrayerData>();
const inflightMonthlyRequests = new Map<string, Promise<MonthlyPrayerData | null>>();
const loggedLocalCacheHits = new Set<string>();
const loggedSupabaseCacheHits = new Set<string>();

// Common locations to pre-cache (holy sites + major cities)
export const COMMON_LOCATIONS = [
  { name: 'Makkah', latitude: 21.4225, longitude: 39.8262 },
  { name: 'Madinah', latitude: 24.5247, longitude: 39.5692 },
  { name: 'Dakar', latitude: 14.6937, longitude: -17.4441 },
  { name: 'Banjul', latitude: 13.4549, longitude: -16.5790 },
  { name: 'Cairo', latitude: 30.0444, longitude: 31.2357 },
  { name: 'Istanbul', latitude: 41.0082, longitude: 28.9784 },
  { name: 'Dubai', latitude: 25.2048, longitude: 55.2708 },
  { name: 'Kuala Lumpur', latitude: 3.1390, longitude: 101.6869 },
  { name: 'Jakarta', latitude: -6.2088, longitude: 106.8456 },
  { name: 'London', latitude: 51.5074, longitude: -0.1278 },
  { name: 'Paris', latitude: 48.8566, longitude: 2.3522 },
  { name: 'New York', latitude: 40.7128, longitude: -74.0060 },
  { name: 'Toronto', latitude: 43.6532, longitude: -79.3832 },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface MonthlyPrayerData {
  /** Array of 28-31 days of prayer times */
  days: PrayerTimeResponse[];
  /** ISO date of when cache was created */
  cachedAt: string;
  /** Timestamp for quick expiry checks */
  cachedAtMs: number;
  /** Year of the cached data */
  year: number;
  /** Month of the cached data (0-11) */
  month: number;
  /** Location coordinates */
  latitude: number;
  longitude: number;
  /** Calculation method used */
  method: CalculationMethod;
}

export interface CacheStatus {
  isCached: boolean;
  isExpired: boolean;
  cachedAt: Date | null;
  expiresAt: Date | null;
  daysRemaining: number;
  source: 'local' | 'supabase' | 'api' | 'none';
}

interface LastKnownLocation {
  latitude: number;
  longitude: number;
  timestamp: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Core Functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get prayer times for today, using monthly cache
 * This is the main entry point for most use cases
 */
export async function getTodayPrayerTimes(
  latitude: number,
  longitude: number,
  method: CalculationMethod = 3
): Promise<PrayerTimeResponse | null> {
  const today = new Date();
  return getPrayerTimesForDate(today, latitude, longitude, method);
}

/**
 * Get prayer times for a specific date
 * Uses monthly cache - fetches entire month if not cached
 */
export async function getPrayerTimesForDate(
  date: Date,
  latitude: number,
  longitude: number,
  method: CalculationMethod = 3
): Promise<PrayerTimeResponse | null> {
  try {
    const monthData = await getMonthlyPrayerTimes(latitude, longitude, method, date);
    
    if (!monthData || !monthData.days) {
      console.warn('No monthly data available');
      return null;
    }
    
    const dayOfMonth = date.getDate(); // 1-31
    const dayData = monthData.days[dayOfMonth - 1]; // Array is 0-indexed
    
    if (!dayData) {
      console.warn(`No data for day ${dayOfMonth} in month cache`);
      return null;
    }
    
    return dayData;
  } catch (error) {
    console.error('Failed to get prayer times for date:', error);
    return null;
  }
}

/**
 * Get entire month of prayer times (main caching function)
 */
export async function getMonthlyPrayerTimes(
  latitude: number,
  longitude: number,
  method: CalculationMethod = 3,
  targetDate: Date = new Date()
): Promise<MonthlyPrayerData | null> {
  const year = targetDate.getFullYear();
  const month = targetDate.getMonth();
  const cacheKey = buildCacheKey(latitude, longitude, year, month);

  // Fast-path: memory cache
  const memoryCache = memoryMonthlyCache.get(cacheKey);
  if (memoryCache && !isCacheExpired(memoryCache)) {
    return memoryCache;
  }

  // De-dupe concurrent requests for the same month.
  const existing = inflightMonthlyRequests.get(cacheKey);
  if (existing) {
    return existing;
  }

  const requestPromise = (async (): Promise<MonthlyPrayerData | null> => {
    try {
      // 1. Check local cache first (fastest)
      const localCache = await getLocalCache(cacheKey, latitude, longitude);
      if (localCache && !isCacheExpired(localCache)) {
        memoryMonthlyCache.set(cacheKey, localCache);
        if (__DEV__ && !loggedLocalCacheHits.has(cacheKey)) {
          console.log('✅ Using locally cached prayer times');
          loggedLocalCacheHits.add(cacheKey);
        }
        return localCache;
      }

      // 2. Check Supabase cache (for cross-device sync)
      const supabaseCache = await getSupabaseCache(latitude, longitude, year, month);
      if (supabaseCache && !isCacheExpired(supabaseCache)) {
        memoryMonthlyCache.set(cacheKey, supabaseCache);
        if (__DEV__ && !loggedSupabaseCacheHits.has(cacheKey)) {
          console.log('✅ Using Supabase cached prayer times');
          loggedSupabaseCacheHits.add(cacheKey);
        }
        // Store locally for faster future access
        await setLocalCache(cacheKey, supabaseCache);
        return supabaseCache;
      }

      // 3. Check network connectivity
      const netInfo = await NetInfo.fetch();
      if (!netInfo.isConnected) {
        // Return stale cache if available
        if (localCache) {
          console.warn('⚠️ Offline: Using stale local cache');
          memoryMonthlyCache.set(cacheKey, localCache);
          return localCache;
        }
        if (supabaseCache) {
          console.warn('⚠️ Offline: Using stale Supabase cache');
          memoryMonthlyCache.set(cacheKey, supabaseCache);
          return supabaseCache;
        }
        console.error('❌ Offline and no cache available');
        return null;
      }

      // 4. Fetch fresh data from API
      console.log('🌐 Fetching fresh monthly prayer times...');
      const freshData = await fetchMonthlyPrayerTimes(latitude, longitude, year, month, method);

      if (!freshData) {
        // Fall back to stale cache
        const fallback = localCache || supabaseCache || null;
        if (fallback) memoryMonthlyCache.set(cacheKey, fallback);
        return fallback;
      }

      // 5. Store in both caches
      await setLocalCache(cacheKey, freshData);
      await setSupabaseCache(freshData);
      memoryMonthlyCache.set(cacheKey, freshData);

      // 6. Update last known location
      await saveLastKnownLocation(latitude, longitude);

      // 7. Prefetch next month if we're in the last week
      const dayOfMonth = targetDate.getDate();
      const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
      if (dayOfMonth >= lastDayOfMonth - 7) {
        void prefetchNextMonth(latitude, longitude, method, targetDate);
      }

      return freshData;
    } catch (error) {
      console.error('Failed to get monthly prayer times:', error);

      // Last resort: try any cached data
      const fallback = await getLocalCache(cacheKey, latitude, longitude);
      if (fallback) {
        console.warn('Using fallback stale cache after error');
        memoryMonthlyCache.set(cacheKey, fallback);
        return fallback;
      }

      return null;
    }
  })();

  inflightMonthlyRequests.set(cacheKey, requestPromise);
  try {
    return await requestPromise;
  } finally {
    inflightMonthlyRequests.delete(cacheKey);
  }
}

/**
 * Fetch entire month from Aladhan Calendar API
 */
async function fetchMonthlyPrayerTimes(
  latitude: number,
  longitude: number,
  year: number,
  month: number, // 0-11
  method: CalculationMethod
): Promise<MonthlyPrayerData | null> {
  try {
    // Aladhan uses 1-12 for months
    const apiMonth = month + 1;
    const url = `${ALADHAN_API_BASE}/calendar/${year}/${apiMonth}?latitude=${latitude}&longitude=${longitude}&method=${method}`;
    
    if (__DEV__) {
      console.log('Fetching monthly prayer times:', url);
    }
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    
    try {
      const response = await fetch(url, { signal: controller.signal });
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      
      const json = await response.json();
      
      if (json.code !== 200 || !json.data || !Array.isArray(json.data)) {
        throw new Error('Invalid API response structure');
      }
      
      const now = new Date();
      const monthlyData: MonthlyPrayerData = {
        days: json.data,
        cachedAt: now.toISOString(),
        cachedAtMs: now.getTime(),
        year,
        month,
        latitude,
        longitude,
        method,
      };
      
      console.log(`✅ Fetched ${json.data.length} days of prayer times for ${year}/${apiMonth}`);
      return monthlyData;
      
    } finally {
      clearTimeout(timeout);
    }
    
  } catch (error) {
    console.error('Failed to fetch monthly prayer times:', error);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Local Cache (AsyncStorage)
// ─────────────────────────────────────────────────────────────────────────────

function buildCacheKey(latitude: number, longitude: number, year: number, month: number): string {
  // Round coordinates to 2 decimal places (~1km precision)
  const lat = latitude.toFixed(2);
  const lon = longitude.toFixed(2);
  return `${CACHE_KEY_PREFIX}${lat}_${lon}_${year}_${month}`;
}

async function getLocalCache(
  cacheKey: string,
  latitude: number,
  longitude: number
): Promise<MonthlyPrayerData | null> {
  try {
    const cached = await AsyncStorage.getItem(cacheKey);
    if (!cached) return null;
    
    const data: MonthlyPrayerData = JSON.parse(cached);
    
    // Verify location hasn't changed significantly
    const distance = calculateDistance(
      { latitude: data.latitude, longitude: data.longitude },
      { latitude, longitude }
    );
    
    if (distance > LOCATION_CHANGE_THRESHOLD_KM) {
      if (__DEV__) console.log(`Location changed by ${distance.toFixed(1)}km, invalidating cache`);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to read local cache:', error);
    return null;
  }
}

async function setLocalCache(cacheKey: string, data: MonthlyPrayerData): Promise<void> {
  try {
    await AsyncStorage.setItem(cacheKey, JSON.stringify(data));
    if (__DEV__) console.log('Monthly prayer times cached locally');
  } catch (error) {
    const errorMsg = (error as any)?.message || '';
    if (errorMsg.includes('SQLITE_FULL') || errorMsg.includes('disk is full')) {
      if (__DEV__) console.warn('Failed to cache: disk full, continuing without persistence');
      // Continue without cache - app still works
    } else {
      console.error('Failed to set local cache:', error);
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Supabase Cache (Cross-Device Sync)
// ─────────────────────────────────────────────────────────────────────────────

async function getSupabaseCache(
  latitude: number,
  longitude: number,
  year: number,
  month: number
): Promise<MonthlyPrayerData | null> {
  // Skip if Supabase not configured
  if (!supabase) {
    return null;
  }
  
  try {
    // Round to 2 decimal places for consistent key
    const locationKey = `${latitude.toFixed(2)}_${longitude.toFixed(2)}`;
    
    const { data, error } = await supabase
      .from('prayer_times_cache')
      .select('*')
      .eq('location_key', locationKey)
      .eq('year', year)
      .eq('month', month)
      .single();
    
    if (error || !data) {
      // Table might not exist or no data
      return null;
    }
    
    // Convert Supabase row to MonthlyPrayerData
    return {
      days: data.data,
      cachedAt: data.updated_at,
      cachedAtMs: new Date(data.updated_at).getTime(),
      year: data.year,
      month: data.month,
      latitude: data.latitude,
      longitude: data.longitude,
      method: data.method || 3,
    };
    
  } catch (error) {
    // Silently fail - Supabase cache is optional
    return null;
  }
}

async function setSupabaseCache(data: MonthlyPrayerData): Promise<void> {
  // Skip if Supabase not configured
  if (!supabase) {
    return;
  }
  
  try {
    const locationKey = `${data.latitude.toFixed(2)}_${data.longitude.toFixed(2)}`;
    
    const { error } = await supabase
      .from('prayer_times_cache')
      .upsert({
        location_key: locationKey,
        latitude: data.latitude,
        longitude: data.longitude,
        year: data.year,
        month: data.month,
        method: data.method,
        data: data.days,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'location_key,year,month',
      });
    
    if (!error && __DEV__) {
      console.log('Monthly prayer times synced to Supabase');
    }
    
  } catch (error) {
    // Silently fail - Supabase cache is optional
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Cache Management
// ─────────────────────────────────────────────────────────────────────────────

function isCacheExpired(data: MonthlyPrayerData): boolean {
  const now = Date.now();
  const cacheAge = now - data.cachedAtMs;
  return cacheAge > CACHE_DURATION_MS;
}

/**
 * Check if we should refresh the cache
 */
export async function shouldRefreshCache(
  latitude: number,
  longitude: number
): Promise<{ shouldRefresh: boolean; reason: string }> {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const day = now.getDate();
  
  // 1. First day of new month - definitely refresh
  if (day === 1) {
    return { shouldRefresh: true, reason: 'First day of new month' };
  }
  
  // 2. Check if location changed significantly
  const lastLocation = await getLastKnownLocation();
  if (lastLocation) {
    const distance = calculateDistance(lastLocation, { latitude, longitude });
    if (distance > LOCATION_CHANGE_THRESHOLD_KM) {
      return { shouldRefresh: true, reason: `Location changed by ${distance.toFixed(1)}km` };
    }
  }
  
  // 3. Check if cache exists and is valid
  const cacheKey = buildCacheKey(latitude, longitude, year, month);
  const cached = await getLocalCache(cacheKey, latitude, longitude);
  
  if (!cached) {
    return { shouldRefresh: true, reason: 'No cache exists' };
  }
  
  if (isCacheExpired(cached)) {
    return { shouldRefresh: true, reason: 'Cache expired' };
  }
  
  return { shouldRefresh: false, reason: 'Cache valid' };
}

/**
 * Get cache status for debugging/UI
 */
export async function getCacheStatus(
  latitude: number,
  longitude: number
): Promise<CacheStatus> {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const cacheKey = buildCacheKey(latitude, longitude, year, month);
  
  const cached = await getLocalCache(cacheKey, latitude, longitude);
  
  if (!cached) {
    return {
      isCached: false,
      isExpired: true,
      cachedAt: null,
      expiresAt: null,
      daysRemaining: 0,
      source: 'none',
    };
  }
  
  const cachedAtDate = new Date(cached.cachedAt);
  const expiresAt = new Date(cached.cachedAtMs + CACHE_DURATION_MS);
  const daysRemaining = Math.max(0, Math.ceil((expiresAt.getTime() - Date.now()) / (24 * 60 * 60 * 1000)));
  
  return {
    isCached: true,
    isExpired: isCacheExpired(cached),
    cachedAt: cachedAtDate,
    expiresAt,
    daysRemaining,
    source: 'local',
  };
}

/**
 * Clear all prayer times caches
 */
export async function clearAllPrayerCaches(): Promise<void> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter(key => key.startsWith(CACHE_KEY_PREFIX));
    
    if (cacheKeys.length > 0) {
      await AsyncStorage.multiRemove(cacheKeys);
      console.log(`Cleared ${cacheKeys.length} prayer time caches`);
    }
  } catch (error) {
    console.error('Failed to clear prayer caches:', error);
  }
}

/**
 * Cleanup expired caches to save storage space
 */
export async function cleanupExpiredCaches(): Promise<number> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter(key => key.startsWith(CACHE_KEY_PREFIX));
    const toRemove: string[] = [];
    
    for (const key of cacheKeys) {
      const cached = await AsyncStorage.getItem(key);
      if (cached) {
        try {
          const data: MonthlyPrayerData = JSON.parse(cached);
          if (isCacheExpired(data)) {
            toRemove.push(key);
          }
        } catch {
          // Invalid cache entry, remove it
          toRemove.push(key);
        }
      }
    }
    
    if (toRemove.length > 0) {
      await AsyncStorage.multiRemove(toRemove);
      console.log(`Cleaned up ${toRemove.length} expired caches`);
    }
    
    return toRemove.length;
  } catch (error) {
    console.error('Failed to cleanup expired caches:', error);
    return 0;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Prefetching
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Prefetch next month's prayer times (background task)
 */
async function prefetchNextMonth(
  latitude: number,
  longitude: number,
  method: CalculationMethod,
  currentDate: Date
): Promise<void> {
  try {
    const netInfo = await NetInfo.fetch();
    
    // Only prefetch on WiFi
    if (netInfo.type !== 'wifi') {
      return;
    }
    
    const nextMonth = new Date(currentDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    
    console.log('📅 Prefetching next month prayer times...');
    await getMonthlyPrayerTimes(latitude, longitude, method, nextMonth);
    
  } catch (error) {
    // Silently fail - prefetch is optional optimization
    if (__DEV__) console.log('Prefetch failed:', error);
  }
}

/**
 * Pre-cache common locations (call on first app launch)
 * Only runs on WiFi to conserve data
 */
export async function initializeCommonLocationCaches(
  method: CalculationMethod = 3
): Promise<void> {
  try {
    const netInfo = await NetInfo.fetch();
    
    if (netInfo.type !== 'wifi') {
      console.log('Skipping common location cache: Not on WiFi');
      return;
    }
    
    console.log('📍 Pre-caching prayer times for common locations...');
    
    // Process in batches to avoid overwhelming the API
    const batchSize = 3;
    for (let i = 0; i < COMMON_LOCATIONS.length; i += batchSize) {
      const batch = COMMON_LOCATIONS.slice(i, i + batchSize);
      
      await Promise.all(
        batch.map(location =>
          getMonthlyPrayerTimes(location.latitude, location.longitude, method)
            .catch(err => console.warn(`Failed to cache ${location.name}:`, err))
        )
      );
      
      // Small delay between batches to be nice to the API
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log('✅ Common locations cached');
    
  } catch (error) {
    console.error('Failed to initialize common location caches:', error);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Location Tracking (for cache invalidation)
// ─────────────────────────────────────────────────────────────────────────────

const LAST_LOCATION_KEY = '@asrar_last_prayer_location';

async function getLastKnownLocation(): Promise<LastKnownLocation | null> {
  try {
    const stored = await AsyncStorage.getItem(LAST_LOCATION_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

async function saveLastKnownLocation(latitude: number, longitude: number): Promise<void> {
  try {
    const location: LastKnownLocation = {
      latitude,
      longitude,
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem(LAST_LOCATION_KEY, JSON.stringify(location));
  } catch (error) {
    console.error('Failed to save last location:', error);
  }
}

/**
 * Calculate distance between two coordinates in kilometers (Haversine formula)
 */
function calculateDistance(
  loc1: { latitude: number; longitude: number },
  loc2: { latitude: number; longitude: number }
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRadians(loc2.latitude - loc1.latitude);
  const dLon = toRadians(loc2.longitude - loc1.longitude);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(loc1.latitude)) *
    Math.cos(toRadians(loc2.latitude)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// ─────────────────────────────────────────────────────────────────────────────
// Exports for backwards compatibility
// ─────────────────────────────────────────────────────────────────────────────

export {
    type CalculationMethod, type PrayerTimeResponse, type PrayerTimings
};

