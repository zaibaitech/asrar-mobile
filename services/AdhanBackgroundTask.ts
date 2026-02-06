/**
 * Adhan Background Task
 * Automatically reschedules prayer notifications daily
 * 
 * This ensures notifications work even if the user doesn't open the app.
 */

import * as BackgroundFetch from 'expo-background-fetch';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { getAdhanSettings, schedulePrayerNotifications } from './AdhanNotificationService';
import { fetchPrayerTimes } from './api/prayerTimes';
import { getBestLocation, setLastKnownLocation } from './LocationCacheService';

const ADHAN_BACKGROUND_TASK = 'ADHAN_BACKGROUND_FETCH';

/**
 * Define the background task
 * This runs even when the app is closed
 */
TaskManager.defineTask(ADHAN_BACKGROUND_TASK, async () => {
  try {
    console.log('[AdhanBackgroundTask] Running background fetch...');

    // Check if adhan notifications are enabled
    const settings = await getAdhanSettings();
    if (!settings.enabled) {
      console.log('[AdhanBackgroundTask] Adhan disabled, skipping');
      return BackgroundFetch.BackgroundFetchResult.NoData;
    }

    // Get location
    let latitude: number | undefined;
    let longitude: number | undefined;

    const cached = await getBestLocation();
    if (cached) {
      latitude = cached.latitude;
      longitude = cached.longitude;
    } else {
      // Try to get location (may fail in background on some devices)
      try {
        const { status } = await Location.getForegroundPermissionsAsync();
        if (status === 'granted') {
          const location = await Location.getLastKnownPositionAsync();
          if (location) {
            latitude = location.coords.latitude;
            longitude = location.coords.longitude;
            await setLastKnownLocation({
              latitude,
              longitude,
              accuracy: location.coords.accuracy || undefined,
              timestamp: Date.now(),
            });
          }
        }
      } catch (e) {
        console.warn('[AdhanBackgroundTask] Could not get location:', e);
      }
    }

    if (!latitude || !longitude) {
      console.warn('[AdhanBackgroundTask] No location available');
      return BackgroundFetch.BackgroundFetchResult.Failed;
    }

    // Fetch prayer times and schedule notifications
    const prayerData = await fetchPrayerTimes(latitude, longitude);
    await schedulePrayerNotifications(prayerData.timings);

    console.log('[AdhanBackgroundTask] ✅ Notifications rescheduled');
    return BackgroundFetch.BackgroundFetchResult.NewData;

  } catch (error) {
    console.error('[AdhanBackgroundTask] Error:', error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

/**
 * Register the background task
 * Should be called once at app startup
 */
export async function registerAdhanBackgroundTask(): Promise<boolean> {
  try {
    // Check if already registered
    const isRegistered = await TaskManager.isTaskRegisteredAsync(ADHAN_BACKGROUND_TASK);
    
    if (isRegistered) {
      console.log('[AdhanBackgroundTask] Already registered');
      return true;
    }

    // Register for background fetch
    await BackgroundFetch.registerTaskAsync(ADHAN_BACKGROUND_TASK, {
      minimumInterval: 60 * 60 * 6, // Run at least every 6 hours
      stopOnTerminate: false, // Continue after app is killed
      startOnBoot: true, // Start after device reboot
    });

    console.log('[AdhanBackgroundTask] ✅ Registered successfully');
    return true;
  } catch (error) {
    console.error('[AdhanBackgroundTask] Failed to register:', error);
    return false;
  }
}

/**
 * Unregister the background task
 */
export async function unregisterAdhanBackgroundTask(): Promise<void> {
  try {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(ADHAN_BACKGROUND_TASK);
    if (isRegistered) {
      await BackgroundFetch.unregisterTaskAsync(ADHAN_BACKGROUND_TASK);
      console.log('[AdhanBackgroundTask] Unregistered');
    }
  } catch (error) {
    console.warn('[AdhanBackgroundTask] Failed to unregister:', error);
  }
}

/**
 * Check if background task is registered
 */
export async function isAdhanBackgroundTaskRegistered(): Promise<boolean> {
  try {
    return await TaskManager.isTaskRegisteredAsync(ADHAN_BACKGROUND_TASK);
  } catch {
    return false;
  }
}

/**
 * Get background fetch status
 */
export async function getAdhanBackgroundStatus(): Promise<BackgroundFetch.BackgroundFetchStatus | null> {
  return await BackgroundFetch.getStatusAsync();
}
