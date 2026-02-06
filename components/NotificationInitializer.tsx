/**
 * Notification Initialization Component
 * Initializes all notification services on app startup
 * 
 * Triggered when:
 * - App starts
 * - User completes profile setup
 * - User changes notification settings
 */

import { registerAdhanBackgroundTask } from '@/services/AdhanBackgroundTask';
import {
    cancelAllPrayerNotifications,
    getAdhanSettings,
    schedulePrayerNotifications
} from '@/services/AdhanNotificationService';
import { fetchPrayerTimes } from '@/services/api/prayerTimes';
import { scheduleDivineTimingNotifications } from '@/services/DivineTimingNotificationService';
import { scheduleHarmonyNotifications } from '@/services/HarmonyHourNotificationService';
import { getBestLocation } from '@/services/LocationCacheService';
import NotificationService from '@/services/NotificationService';
import { loadProfile } from '@/services/UserProfileStorage';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { useEffect, useRef } from 'react';

export function NotificationInitializer() {
  const isInitialized = useRef(false);

  useEffect(() => {
    // Only initialize once
    if (isInitialized.current) return;
    
    initializeNotifications();
    isInitialized.current = true;
  }, []);

  const initializeNotifications = async () => {
    try {
      // Request permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Notification permissions not granted');
        return;
      }

      console.log('✅ Notification permissions granted');

      // Clear ALL old scheduled notifications to remove stale Expo Go notifications
      // This ensures tapping notifications opens the APK, not Expo Go
      try {
        await Notifications.cancelAllScheduledNotificationsAsync();
        console.log('✅ Cleared all old scheduled notifications');
      } catch (e) {
        console.warn('Failed to clear old notifications:', e);
      }

      // Load user profile
      const profile = await loadProfile();
      
      // Get notification preferences
      const prefs = await NotificationService.getNotificationPreferences();

      // Initialize Adhan notifications (prayer times)
      await initializeAdhanNotifications();

      // Register background task to auto-reschedule notifications daily
      // This ensures notifications work even if user doesn't open app
      try {
        await registerAdhanBackgroundTask();
        console.log('✅ Adhan background task registered');
      } catch (e) {
        console.warn('Failed to register background task:', e);
      }

      // Initialize Harmony Hour notifications if enabled
      if (prefs.harmony.enabled) {
        console.log('Scheduling harmony hour notifications...');
        await scheduleHarmonyNotifications(profile || undefined);
      }

      // Initialize Divine Timing notifications if enabled
      if (prefs.timing.enabled && (prefs.timing.morningBriefing || prefs.timing.elementalAlignment)) {
        console.log('Scheduling divine timing notifications...');
        await scheduleDivineTimingNotifications(profile || undefined);
      }

      console.log('✅ All notification services initialized');
    } catch (error) {
      console.error('Failed to initialize notifications:', error);
    }
  };

  const initializeAdhanNotifications = async () => {
    try {
      // Check if adhan notifications are enabled
      const adhanSettings = await getAdhanSettings();
      if (!adhanSettings.enabled) {
        console.log('Adhan notifications disabled, skipping...');
        return;
      }

      console.log('Scheduling adhan notifications...');

      // Cancel any old notifications (may include stale Expo Go ones)
      await cancelAllPrayerNotifications();

      // Get location for prayer times
      const best = await getBestLocation();
      if (!best) {
        // Try to get fresh location
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('Location permission not granted for adhan');
          return;
        }
        
        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        
        const prayerData = await fetchPrayerTimes(latitude, longitude);
        await schedulePrayerNotifications(prayerData.timings);
      } else {
        const { latitude, longitude } = best;
        const prayerData = await fetchPrayerTimes(latitude, longitude);
        await schedulePrayerNotifications(prayerData.timings);
      }

      console.log('✅ Adhan notifications scheduled');
    } catch (error) {
      console.error('Failed to schedule adhan notifications:', error);
    }
  };

  // This component doesn't render anything
  return null;
}
