// Example: Unified Cache Management Hook
// File: hooks/useCacheManager.ts

import {
    cleanupExpiredPrayerCache,
    getPrayerTimesForDate,
    prefetchPrayerTimes
} from '@/services/api/prayerTimes';
import {
    cleanupExpiredEphemerisCache,
    prefetchEphemerisData
} from '@/services/EphemerisService';
import {
    cleanupExpiredPlanetaryCache,
    preCalculateDailyPlanetaryHours
} from '@/services/PlanetaryHoursService';
import NetInfo from '@react-native-community/netinfo';
import { useCallback, useEffect } from 'react';

interface CacheManagerOptions {
  location?: {
    latitude: number;
    longitude: number;
    timezone: string;
  };
  prayerMethod?: number;
  autoCleanup?: boolean;
  autoPrefetch?: boolean;
}

export function useCacheManager(options: CacheManagerOptions) {
  const { location, prayerMethod = 3, autoCleanup = true, autoPrefetch = true } = options;

  // Cleanup expired caches
  const cleanup = useCallback(async () => {
    console.log('[CacheManager] Starting cleanup...');
    
    const results = await Promise.all([
      cleanupExpiredPrayerCache(),
      cleanupExpiredEphemerisCache(),
      cleanupExpiredPlanetaryCache(),
    ]);
    
    console.log('[CacheManager] Cleanup complete:', {
      prayer: results[0],
      ephemeris: results[1],
      planetary: results[2],
    });
  }, []);

  // Prefetch all data
  const prefetchAll = useCallback(async () => {
    if (!location) {
      console.log('[CacheManager] No location, skipping prefetch');
      return;
    }

    // Check if on WiFi
    const netInfo = await NetInfo.fetch();
    if (netInfo.type !== 'wifi') {
      console.log('[CacheManager] Not on WiFi, skipping prefetch');
      return;
    }

    console.log('[CacheManager] Starting prefetch...');

    try {
      // 1. Prefetch prayer times (7 days)
      await prefetchPrayerTimes(
        location.latitude,
        location.longitude,
        prayerMethod,
        7
      );

      // 2. Prefetch ephemeris (24 hours)
      await prefetchEphemerisData(location.timezone, 24);

      // 3. Pre-calculate planetary hours for today
      const todayPrayer = await getPrayerTimesForDate(
        new Date(),
        location.latitude,
        location.longitude,
        prayerMethod
      );

      if (todayPrayer) {
        const sunrise = parseTime(todayPrayer.timings.Sunrise);
        const sunset = parseTime(todayPrayer.timings.Sunset);
        const nextSunrise = new Date(sunrise);
        nextSunrise.setDate(nextSunrise.getDate() + 1);

        await preCalculateDailyPlanetaryHours(sunrise, sunset, nextSunrise);
      }

      console.log('[CacheManager] Prefetch complete');
    } catch (error) {
      console.error('[CacheManager] Prefetch error:', error);
    }
  }, [location, prayerMethod]);

  // Initialize on mount
  useEffect(() => {
    const initialize = async () => {
      if (autoCleanup) {
        await cleanup();
      }

      if (autoPrefetch) {
        await prefetchAll();
      }
    };

    initialize();
  }, [location, autoCleanup, autoPrefetch, cleanup, prefetchAll]);

  // Daily cleanup timer
  useEffect(() => {
    if (!autoCleanup) return;

    const timer = setInterval(() => {
      cleanup();
    }, 24 * 60 * 60 * 1000); // Once per day

    return () => clearInterval(timer);
  }, [autoCleanup, cleanup]);

  return {
    cleanup,
    prefetchAll,
  };
}

// Helper: Parse time string to Date
function parseTime(timeString: string): Date {
  const [hours, minutes] = timeString.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

// ============================================================================
// USAGE EXAMPLE 1: App-wide integration
// ============================================================================

// In your root App.tsx or _layout.tsx:
import { useProfile } from '@/contexts/ProfileContext';
import { useCacheManager } from '@/hooks/useCacheManager';

export default function App() {
  const { profile } = useProfile();
  
  const { cleanup, prefetchAll } = useCacheManager({
    location: profile?.location,
    prayerMethod: profile?.prayerCalculationMethod || 3,
    autoCleanup: true,
    autoPrefetch: true,
  });

  // Optional: Manual refresh button
  const handleManualRefresh = async () => {
    await cleanup();
    await prefetchAll();
  };

  return (
    <YourAppLayout>
      {/* Your app content */}
    </YourAppLayout>
  );
}

// ============================================================================
// USAGE EXAMPLE 2: Settings screen with manual controls
// ============================================================================

import { useState } from 'react';
import { Button, Text, View } from 'react-native';

export function SettingsScreen() {
  const { profile } = useProfile();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { cleanup, prefetchAll } = useCacheManager({
    location: profile?.location,
    autoCleanup: false, // Manual control
    autoPrefetch: false, // Manual control
  });

  const handleClearCache = async () => {
    setIsRefreshing(true);
    await cleanup();
    setIsRefreshing(false);
  };

  const handlePrefetch = async () => {
    setIsRefreshing(true);
    await prefetchAll();
    setIsRefreshing(false);
  };

  return (
    <View>
      <Text>Cache Management</Text>
      
      <Button 
        title="Clear All Caches" 
        onPress={handleClearCache}
        disabled={isRefreshing}
      />
      
      <Button 
        title="Prefetch Data (WiFi Only)" 
        onPress={handlePrefetch}
        disabled={isRefreshing}
      />
      
      {isRefreshing && <Text>Processing...</Text>}
    </View>
  );
}

// ============================================================================
// USAGE EXAMPLE 3: Location change handler
// ============================================================================


export function LocationProvider({ children }) {
  const [location, setLocation] = useState(null);
  const { cleanup, prefetchAll } = useCacheManager({
    location,
    autoCleanup: false,
    autoPrefetch: false,
  });

  // When location changes significantly
  useEffect(() => {
    if (location) {
      const refreshForNewLocation = async () => {
        await cleanup(); // Clear old location data
        await prefetchAll(); // Fetch for new location
      };

      refreshForNewLocation();
    }
  }, [location]);

  return (
    <LocationContext.Provider value={{ location, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
}

// ============================================================================
// USAGE EXAMPLE 4: Daily auto-refresh at Fajr
// ============================================================================


export function DailyRefreshService() {
  const { profile } = useProfile();
  const { cleanup, prefetchAll } = useCacheManager({
    location: profile?.location,
    autoCleanup: false,
    autoPrefetch: false,
  });

  useEffect(() => {
    const checkAndRefresh = setInterval(async () => {
      const now = new Date();
      const hour = now.getHours();
      
      // Refresh between 3-6 AM (typical Fajr window)
      if (hour >= 3 && hour < 6) {
        console.log('[DailyRefresh] Starting daily refresh...');
        await cleanup();
        await prefetchAll();
      }
    }, 60 * 60 * 1000); // Check every hour

    return () => clearInterval(checkAndRefresh);
  }, [profile?.location]);

  return null; // Background service
}
