/**
 * Notification Received Handler
 * Handles incoming notifications to trigger actions like playing Adhan audio
 * 
 * This component listens for notifications being received (not tapped)
 * and performs appropriate actions based on the notification category.
 */

import { playAdhanAudio } from '@/services/AdhanAudioService';
import { getAdhanSettings } from '@/services/AdhanNotificationService';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';

export function NotificationReceivedHandler() {
  useEffect(() => {
    let isMounted = true;

    const handleNotificationReceived = async (notification: Notifications.Notification) => {
      if (!isMounted) return;

      const content = notification.request.content;
      const data = (content.data || {}) as Record<string, unknown>;

      const category = String(data.category || '');
      const type = String(data.type || '');
      const prayerName = String(data.prayerName || '');
      const prayerArabic = String(data.prayerArabic || '');
      const isFajr = Boolean(data.isFajr);

      // Handle prayer notifications (Adhan)
      if (category === 'prayer' && type === 'prayer') {
        console.log(`[NotificationReceived] Prayer notification received: ${prayerName}`);
        
        try {
          // Get current adhan settings
          const settings = await getAdhanSettings();
          
          // Play adhan audio in background using Track Player
          await playAdhanAudio(prayerName, prayerArabic, isFajr, settings);
        } catch (error) {
          console.error('[NotificationReceived] Failed to play adhan:', error);
        }
      }

      // You can add more notification handlers here for other categories
      // For example: harmony hour chimes, daily check-in sounds, etc.
    };

    // Subscribe to notification received events
    const subscription = Notifications.addNotificationReceivedListener(handleNotificationReceived);

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, []);

  return null;
}
