/**
 * Adhan Notification Service
 * Handles scheduling and playing adhan (call to prayer) notifications
 * 
 * Features:
 * - Schedules notifications for all 5 daily prayers
 * - Plays adhan audio at prayer times
 * - Different adhan for Fajr vs other prayers
 * - Customizable settings (volume, vibration, sound selection)
 * - Background notification support
 * 
 * Note: Works with local notifications only in Expo Go (SDK 53+)
 * For full remote notification support, use a development build
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { PrayerTimings } from './api/prayerTimes';

// Lazy import to avoid Expo Go warning on initial load
let Notifications: any;
let SchedulableTriggerInputTypes: any;

const initNotifications = async () => {
  if (!Notifications) {
    const notifModule = await import('expo-notifications');
    Notifications = notifModule;
    SchedulableTriggerInputTypes = notifModule.SchedulableTriggerInputTypes;
    
    // Configure notification handler for local notifications
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  }
  return Notifications;
};

const SETTINGS_KEY = '@asrar_adhan_settings';
const SCHEDULED_NOTIFICATIONS_KEY = '@asrar_scheduled_notifications';

export interface AdhanSettings {
  enabled: boolean;
  fajrAdhan: 'default' | 'mishary' | 'mecca' | 'medina';
  otherAdhan: 'default' | 'mishary' | 'mecca' | 'medina';
  playSound: boolean;
  vibrate: boolean;
  volume: number; // 0-1
  notifyFajr: boolean;
  notifyDhuhr: boolean;
  notifyAsr: boolean;
  notifyMaghrib: boolean;
  notifyIsha: boolean;
  reminderMinutes: number; // Minutes before prayer (0 = disabled)
}

export const DEFAULT_ADHAN_SETTINGS: AdhanSettings = {
  enabled: true,
  fajrAdhan: 'default',
  otherAdhan: 'default',
  playSound: true,
  vibrate: true,
  volume: 0.8,
  notifyFajr: true,
  notifyDhuhr: true,
  notifyAsr: true,
  notifyMaghrib: true,
  notifyIsha: true,
  reminderMinutes: 0,
};

/**
 * Request notification permissions
 * Note: In Expo Go SDK 53+, only local notifications are supported
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    await initNotifications();
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Notification permission denied');
      return false;
    }

    return true;
  } catch (error) {
    console.warn('Error requesting notification permissions:', error);
    return false;
  }
}

/**
 * Get adhan settings
 */
export async function getAdhanSettings(): Promise<AdhanSettings> {
  try {
    const saved = await AsyncStorage.getItem(SETTINGS_KEY);
    if (saved) {
      return { ...DEFAULT_ADHAN_SETTINGS, ...JSON.parse(saved) };
    }
    return DEFAULT_ADHAN_SETTINGS;
  } catch (error) {
    console.error('Failed to load adhan settings:', error);
    return DEFAULT_ADHAN_SETTINGS;
  }
}

/**
 * Save adhan settings
 */
export async function saveAdhanSettings(settings: Partial<AdhanSettings>): Promise<void> {
  try {
    const current = await getAdhanSettings();
    const updated = { ...current, ...settings };
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    console.log('Adhan settings saved:', updated);
  } catch (error) {
    console.error('Failed to save adhan settings:', error);
  }
}

/**
 * Schedule prayer notifications for the day
 */
export async function schedulePrayerNotifications(
  timings: PrayerTimings,
  date: Date = new Date()
): Promise<void> {
  try {
    await initNotifications();
    const settings = await getAdhanSettings();

    if (!settings.enabled) {
      console.log('Adhan notifications disabled');
      return;
    }

    // Check permissions
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      console.log('No notification permission, cannot schedule');
      return;
    }

    // Cancel existing notifications
    await cancelAllPrayerNotifications();

    const scheduledIds: string[] = [];

    // Schedule each prayer
    const prayers = [
      { name: 'Fajr', nameArabic: 'الفجر', time: timings.Fajr, enabled: settings.notifyFajr, isFajr: true },
      { name: 'Dhuhr', nameArabic: 'الظهر', time: timings.Dhuhr, enabled: settings.notifyDhuhr, isFajr: false },
      { name: 'Asr', nameArabic: 'العصر', time: timings.Asr, enabled: settings.notifyAsr, isFajr: false },
      { name: 'Maghrib', nameArabic: 'المغرب', time: timings.Maghrib, enabled: settings.notifyMaghrib, isFajr: false },
      { name: 'Isha', nameArabic: 'العشاء', time: timings.Isha, enabled: settings.notifyIsha, isFajr: false },
    ];

    for (const prayer of prayers) {
      if (!prayer.enabled) continue;

      const prayerDate = parsePrayerTime(prayer.time, date);
      const now = new Date();

      // Skip if prayer time has passed today
      if (prayerDate <= now) {
        console.log(`${prayer.name} time has passed, skipping`);
        continue;
      }

      // Schedule main notification
      try {
        const notificationId = await Notifications.scheduleNotificationAsync({
          content: {
            title: `🕌 ${prayer.name} Prayer Time`,
            body: `It's time for ${prayer.name} prayer (${prayer.nameArabic})`,
            sound: settings.playSound ? getAdhanSound(prayer.isFajr, settings) : undefined,
            data: {
              type: 'prayer',
              prayerName: prayer.name,
              isFajr: prayer.isFajr,
            },
          },
          trigger: {
            type: SchedulableTriggerInputTypes.DATE,
            date: prayerDate,
          },
        });

        scheduledIds.push(notificationId);
        console.log(`Scheduled ${prayer.name} at ${prayerDate.toLocaleTimeString()}`);
      } catch (error) {
        console.warn(`Failed to schedule ${prayer.name} notification:`, error);
      }

      // Schedule reminder if enabled
      if (settings.reminderMinutes > 0) {
        const reminderDate = new Date(prayerDate.getTime() - settings.reminderMinutes * 60 * 1000);
        
        if (reminderDate > now) {
          try {
            const reminderId = await Notifications.scheduleNotificationAsync({
              content: {
                title: `⏰ Reminder: ${prayer.name} Prayer`,
                body: `${prayer.name} prayer in ${settings.reminderMinutes} minutes`,
                sound: false,
                data: {
                  type: 'reminder',
                  prayerName: prayer.name,
                },
              },
              trigger: {
                type: SchedulableTriggerInputTypes.DATE,
                date: reminderDate,
              },
            });

            scheduledIds.push(reminderId);
            console.log(`Scheduled ${prayer.name} reminder at ${reminderDate.toLocaleTimeString()}`);
          } catch (error) {
            console.warn(`Failed to schedule ${prayer.name} reminder:`, error);
          }
        }
      }
    }

    // Save scheduled notification IDs
    await AsyncStorage.setItem(SCHEDULED_NOTIFICATIONS_KEY, JSON.stringify(scheduledIds));
    console.log(`Scheduled ${scheduledIds.length} notifications for prayers`);

  } catch (error) {
    console.error('Failed to schedule prayer notifications:', error);
  }
}

/**
 * Cancel all scheduled prayer notifications
 */
export async function cancelAllPrayerNotifications(): Promise<void> {
  try {
    await initNotifications();
    // Get scheduled notification IDs
    const saved = await AsyncStorage.getItem(SCHEDULED_NOTIFICATIONS_KEY);
    
    if (saved) {
      const ids: string[] = JSON.parse(saved);
      for (const id of ids) {
        await Notifications.cancelScheduledNotificationAsync(id);
      }
      console.log(`Cancelled ${ids.length} scheduled notifications`);
    }

    // Clear all as fallback
    await Notifications.cancelAllScheduledNotificationsAsync();
    await AsyncStorage.removeItem(SCHEDULED_NOTIFICATIONS_KEY);
  } catch (error) {
    console.error('Failed to cancel notifications:', error);
  }
}

/**
 * Get scheduled notifications count
 */
export async function getScheduledNotificationsCount(): Promise<number> {
  try {
    const notifications = await Notifications.getAllScheduledNotificationsAsync();
    return notifications.length;
  } catch (error) {
    console.error('Failed to get scheduled notifications:', error);
    return 0;
  }
}

/**
 * Parse prayer time string to Date object
 */
function parsePrayerTime(timeStr: string, baseDate: Date = new Date()): Date {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const date = new Date(baseDate);
  date.setHours(hours, minutes, 0, 0);
  return date;
}

/**
 * Get adhan sound based on settings
 */
function getAdhanSound(isFajr: boolean, settings: AdhanSettings): string | undefined {
  if (!settings.playSound) return undefined;

  const adhanType = isFajr ? settings.fajrAdhan : settings.otherAdhan;

  // Audio files are in assets/sounds/ directory
  switch (adhanType) {
    case 'mishary':
      return 'adhan_mishary.mp3';
    case 'mecca':
      return 'adhan_mecca.mp3';
    case 'medina':
      return 'adhan_medina.mp3';
    case 'default':
    default:
      return isFajr ? 'adhan_fajr.mp3' : 'adhan_default.mp3';
  }
}

/**
 * Test notification (for debugging)
 * Works with local notifications in Expo Go
 */
export async function sendTestNotification(): Promise<void> {
  try {
    await initNotifications();
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🕌 Test Prayer Notification',
        body: 'This is a test adhan notification',
        sound: true,
        data: {
          type: 'test',
        },
      },
      trigger: {
        type: SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 2,
      },
    });
    console.log('Test notification scheduled in 2 seconds');
  } catch (error) {
    console.error('Failed to send test notification:', error);
    throw error;
  }
}
