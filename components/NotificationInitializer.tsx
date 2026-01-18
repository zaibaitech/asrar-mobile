/**
 * Notification Initialization Component
 * Initializes all notification services on app startup
 * 
 * Triggered when:
 * - App starts
 * - User completes profile setup
 * - User changes notification settings
 */

import { scheduleDivineTimingNotifications } from '@/services/DivineTimingNotificationService';
import { scheduleHarmonyNotifications } from '@/services/HarmonyHourNotificationService';
import NotificationService from '@/services/NotificationService';
import { loadProfile } from '@/services/UserProfileStorage';
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

      // Load user profile
      const profile = await loadProfile();
      
      // Get notification preferences
      const prefs = await NotificationService.getNotificationPreferences();

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

  // This component doesn't render anything
  return null;
}
