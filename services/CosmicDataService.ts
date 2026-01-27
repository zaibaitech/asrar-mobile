/**
 * Cosmic Data Service
 * ====================
 * Centralized server-side cached cosmic data (Moon, Manazil, etc.)
 * 
 * Architecture (4 Cache Layers):
 * ==============================
 * 1. In-memory cache (instant, clears on app restart)
 * 2. AsyncStorage cache (5 min TTL - frequent local refresh)
 * 3. HTTP/CDN cache (30 min - Edge Function response header)
 * 4. Postgres database (2 hr TTL - shared by all Edge Function instances)
 * 5. Pre-computed by cron (runs hourly, populates 48 hours ahead)
 * 
 * Result: 
 * - Users ALWAYS get instant responses (< 50ms)
 * - JPL Horizons is only called by background cron job
 * - 1000 users × 10s = 0 Horizons calls during normal operation
 */

import { moonDataCache } from '@/services/cache/CacheManager';
import { globalRequestManager } from '@/services/cache/RequestManager';
import { MoonLongitudeResult } from '@/services/EphemerisService';

// ============================================================================
// CONFIGURATION
// ============================================================================

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const EDGE_FUNCTION_PATH = '/functions/v1/cosmic-data';

/**
 * Local cache TTL (5 minutes)
 * - Short because server cache is the source of truth
 * - Long enough to prevent excessive network calls during transitions
 */
const LOCAL_CACHE_TTL_MS = 5 * 60 * 1000;

/**
 * Stale-while-revalidate window
 * - Return stale data immediately, refresh in background
 */
const STALE_TTL_MS = 30 * 60 * 1000;

const STORAGE_KEYS = {
  MOON_CACHE: 'cosmic.moon.cache.v2',
  MANAZIL_CACHE: 'cosmic.manazil.cache.v2',
} as const;

// ============================================================================
// TYPES
// ============================================================================

interface CosmicDataResponse {
  type: string;
  date: string;
  moonLongitude: number;
  mansionIndex: number;
  source: 'ephemeris' | 'approx' | 'cache';
  cacheKey?: string;
  cachedAt?: string;
}

interface LocalCacheEntry<T> {
  data: T;
  cachedAt: number;
  expiresAt: number;
}

// ============================================================================
// IN-MEMORY CACHE (fastest layer)
// ============================================================================

let memoryCache: {
  moon?: LocalCacheEntry<CosmicDataResponse>;
  manazil?: LocalCacheEntry<CosmicDataResponse>;
} = {};

// ============================================================================
// MAIN SERVICE
// ============================================================================

/**
 * Get Moon longitude from centralized server cache
 * 
 * Cache layers (fastest to slowest):
 * 1. In-memory cache (instant, clears on app restart)
 * 2. AsyncStorage cache (5 min TTL, stale-while-revalidate for 30 min)
 * 3. Edge Function + Postgres (2 hour TTL, shared by all users)
 * 4. Pre-computed by hourly cron (users never wait for Horizons)
 */
export async function getMoonLongitudeFromServer(
  date: Date = new Date()
): Promise<MoonLongitudeResult> {
  const cacheKey = getCacheKey('moon', date);
  
  // Layer 1: Memory cache (instant)
  if (memoryCache.moon && Date.now() < memoryCache.moon.expiresAt) {
    if (__DEV__) {
      console.log('[CosmicDataService] Memory cache hit');
    }
    return formatResult(memoryCache.moon.data, date);
  }

  // Layer 2: AsyncStorage cache with stale-while-revalidate
  let staleData: LocalCacheEntry<CosmicDataResponse> | null = null;
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.MOON_CACHE);
    if (stored) {
      const cached: LocalCacheEntry<CosmicDataResponse> = JSON.parse(stored);
      
      // Fresh cache - use immediately
      if (Date.now() < cached.expiresAt) {
        memoryCache.moon = cached;
        if (__DEV__) {
          console.log('[CosmicDataService] AsyncStorage cache hit (fresh)');
        }
        return formatResult(cached.data, date);
      }
      
      // Stale but usable - save for fallback, continue to refresh
      if (Date.now() < cached.cachedAt + STALE_TTL_MS) {
        staleData = cached;
        if (__DEV__) {
          console.log('[CosmicDataService] Using stale cache while revalidating');
        }
      }
    }
  } catch (e) {
    // Cache read failed, continue to fetch
  }

  // Layer 3: Edge Function (database-backed, shared cache)
  let data: CosmicDataResponse | null = null;
  try {
    data = await globalRequestManager.schedule(
      async () => {
        const url = `${SUPABASE_URL}${EDGE_FUNCTION_PATH}?type=moon&date=${date.toISOString()}`;
        
        if (__DEV__) {
          console.log('[CosmicDataService] Fetching from Edge Function...');
        }

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorText = await response.text().catch(() => 'Unknown error');
          console.warn(`[CosmicDataService] Edge Function returned ${response.status}: ${errorText}`);
          // Return null instead of throwing to prevent uncaught promise errors
          return null;
        }

        return (await response.json()) as CosmicDataResponse;
      },
      {
        key: `cosmic.moon.${cacheKey}`,
        dedupeInflight: true,
        // Avoid bursts when multiple widgets mount together.
        throttleMs: 2_000,
      }
    );

    // If fetch failed, data will be null
    if (!data) {
      throw new Error('Edge Function returned null');
    }

    // Cache locally using production cache manager
    const cacheEntry: LocalCacheEntry<CosmicDataResponse> = {
      data,
      cachedAt: Date.now(),
      expiresAt: Date.now() + LOCAL_CACHE_TTL_MS,
    };

    memoryCache.moon = cacheEntry;
    
    // Try to persist, but continue if storage is full
    const success = await moonDataCache.set(
      `moon_${date.toISOString()}`,
      cacheEntry,
      LOCAL_CACHE_TTL_MS,
      'high'
    );
    
    if (!success && __DEV__) {
      console.warn('[CosmicDataService] Moon cache write failed (storage may be full), using memory only');
    }

    if (__DEV__) {
      console.log('[CosmicDataService] Edge Function response:', data.source);
    }

    return formatResult(data, date);

  } catch (error) {
    console.warn('[CosmicDataService] Edge Function failed, using fallback:', error instanceof Error ? error.message : String(error));
    
    // Fallback 1: Use stale cache if available (better than nothing)
    if (staleData) {
      console.log('[CosmicDataService] Falling back to stale cache');
      memoryCache.moon = staleData;
      return formatResult(staleData.data, date);
    }
    
    // Fallback 2: Local approximation (last resort)
    console.log('[CosmicDataService] Using local approximation');
    return getApproxMoonLongitude(date);
  }
}

/**
 * Get current Manazil (lunar mansion) index from server
 */
export async function getManazilIndexFromServer(
  date: Date = new Date()
): Promise<{ index: number; source: string }> {
  const result = await getMoonLongitudeFromServer(date);
  const index = getMansionIndexFromLongitude(result.longitude);
  
  return {
    index,
    source: result.source,
  };
}

/**
 * Clear all cosmic data caches
 */
export async function clearCosmicDataCache(): Promise<void> {
  memoryCache = {};
  await AsyncStorage.multiRemove([
    STORAGE_KEYS.MOON_CACHE,
    STORAGE_KEYS.MANAZIL_CACHE,
  ]);
  
  if (__DEV__) {
    console.log('[CosmicDataService] Cache cleared');
  }
}

// ============================================================================
// HELPERS
// ============================================================================

function getCacheKey(type: string, date: Date): string {
  // Round to hour for consistent keys
  const hourDate = new Date(date);
  hourDate.setMinutes(0, 0, 0);
  return `${type}:${hourDate.toISOString().slice(0, 13)}`;
}

function formatResult(data: CosmicDataResponse, date: Date): MoonLongitudeResult {
  return {
    timestamp: date.getTime(),
    dateISO: date.toISOString().split('T')[0],
    longitude: data.moonLongitude,
    source: data.source === 'cache' ? 'ephemeris' : data.source as 'ephemeris' | 'approx',
    expiresAt: Date.now() + LOCAL_CACHE_TTL_MS,
  };
}

function getMansionIndexFromLongitude(longitude: number): number {
  const MANSION_SPAN = 360 / 28;
  return Math.floor(longitude / MANSION_SPAN) % 28;
}

function getApproxMoonLongitude(date: Date): MoonLongitudeResult {
  // Approximate lunar position using synodic month
  const J2000 = new Date('2000-01-01T12:00:00Z').getTime();
  const daysSinceJ2000 = (date.getTime() - J2000) / (24 * 60 * 60 * 1000);
  
  // Moon's mean longitude at J2000: ~218.32°
  // Mean daily motion: ~13.176358°
  let meanLongitude = (218.32 + 13.176358 * daysSinceJ2000) % 360;
  if (meanLongitude < 0) meanLongitude += 360;

  return {
    timestamp: date.getTime(),
    dateISO: date.toISOString().split('T')[0],
    longitude: meanLongitude,
    source: 'approx',
    expiresAt: Date.now() + LOCAL_CACHE_TTL_MS,
  };
}
