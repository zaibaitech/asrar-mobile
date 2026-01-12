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
import { Platform } from 'react-native';
import { PrayerTimings } from './api/prayerTimes';

// Lazy import to avoid Expo Go warning on initial load
let Notifications: any;
let SchedulableTriggerInputTypes: any;

const ADHAN_CHANNEL_ID = 'adhan-notifications';
let channelsInitialized = false;

// Android channel behavior note:
// - On Android, notification sound is controlled by the *channel*, not per-notification.
// - Channel sound cannot be changed after creation; use versioned IDs to apply updates.
const ANDROID_CHANNEL_VERSION = 'v2';
const ANDROID_CHANNEL_PREFIX = `adhan-${ANDROID_CHANNEL_VERSION}`;

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

    // Setup Android notification channels (required for production builds)
    if (Platform.OS === 'android' && !channelsInitialized) {
      await setupAndroidChannels();
      channelsInitialized = true;
    }
  }
  return Notifications;
};

/**
 * Setup Android notification channels with sound support
 * Required for sound to play in production Android builds
 */
async function setupAndroidChannels() {
  try {
    const common = {
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      enableVibrate: true,
      enableLights: true,
      lightColor: '#64B5F6',
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      bypassDnd: true,
    };

    // Versioned channels so existing installs pick up sound changes.
    const channelDefs: Array<{ id: string; name: string; description: string; sound?: string | null }> = [
      {
        id: `${ANDROID_CHANNEL_PREFIX}-default`,
        name: 'Prayer Call (Adhan) — Default',
        description: 'Prayer notifications with default adhan audio',
        sound: 'adhan_default.mp3',
      },
      {
        id: `${ANDROID_CHANNEL_PREFIX}-mishary`,
        name: 'Prayer Call (Adhan) — Mishary',
        description: 'Prayer notifications with Mishary adhan audio',
        sound: 'adhan_mishary.mp3',
      },
      {
        id: `${ANDROID_CHANNEL_PREFIX}-mecca`,
        name: 'Prayer Call (Adhan) — Mecca',
        description: 'Prayer notifications with Mecca adhan audio',
        sound: 'adhan_mecca.mp3',
      },
      {
        id: `${ANDROID_CHANNEL_PREFIX}-medina`,
        name: 'Prayer Call (Adhan) — Medina',
        description: 'Prayer notifications with Medina adhan audio',
        sound: 'adhan_medina.mp3',
      },
      {
        id: `${ANDROID_CHANNEL_PREFIX}-fajr`,
        name: 'Prayer Call (Adhan) — Fajr',
        description: 'Fajr prayer notifications with Fajr adhan audio',
        sound: 'adhan_fajr.mp3',
      },
      {
        id: `${ANDROID_CHANNEL_PREFIX}-silent`,
        name: 'Prayer Call (Adhan) — Silent',
        description: 'Prayer notifications without sound',
        sound: null,
      },
    ];

    for (const ch of channelDefs) {
      await Notifications.setNotificationChannelAsync(ch.id, {
        name: ch.name,
        description: ch.description,
        sound: ch.sound ?? undefined,
        ...common,
      });
    }

    // Back-compat channel (older builds may still reference this ID).
    await Notifications.setNotificationChannelAsync(ADHAN_CHANNEL_ID, {
      name: 'Prayer Call (Adhan)',
      description: 'Prayer notifications (legacy channel)',
      sound: 'default',
      ...common,
    });
  } catch (error) {
    console.error('Failed to setup Android channels:', error);
  }
}

function androidChannelIdFromSettings(isFajr: boolean, settings: AdhanSettings): string {
  if (!settings.playSound) {
    return `${ANDROID_CHANNEL_PREFIX}-silent`;
  }

  const adhanType = isFajr ? settings.fajrAdhan : settings.otherAdhan;

  // For Android 8+, sound behavior is defined by the channel.
  // We map adhan selection to a dedicated versioned channel.
  if (isFajr && adhanType === 'default') {
    return `${ANDROID_CHANNEL_PREFIX}-fajr`;
  }

  switch (adhanType) {
    case 'mishary':
      return `${ANDROID_CHANNEL_PREFIX}-mishary`;
    case 'mecca':
      return `${ANDROID_CHANNEL_PREFIX}-mecca`;
    case 'medina':
      return `${ANDROID_CHANNEL_PREFIX}-medina`;
    case 'default':
    default:
      return `${ANDROID_CHANNEL_PREFIX}-default`;
  }
}

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
      const { status } = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: false,
          allowSound: true,
        },
      });
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
      return;
    }

    // Check permissions
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
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
        continue;
      }

      // Schedule main notification
      try {
        const androidChannelId = Platform.OS === 'android'
          ? androidChannelIdFromSettings(prayer.isFajr, settings)
          : undefined;
        
        const notificationContent: any = {
          title: `🕌 ${prayer.name} Prayer Time`,
          body: `It's time for ${prayer.name} prayer (${prayer.nameArabic})`,
          // iOS plays sound per-notification. Note: iOS custom notification sounds must be .caf/.wav/.aiff.
          // Our bundled adhan assets are .mp3, so we fall back to the default iOS notification sound.
          sound: Platform.OS === 'ios' ? (settings.playSound ? 'default' : null) : undefined,
          data: {
            type: 'prayer',
            prayerName: prayer.name,
            isFajr: prayer.isFajr,
          },
        };

        // Android-specific configuration
        if (Platform.OS === 'android') {
          // On Android 8.0+, channelId must be attached to the trigger.
          notificationContent.priority = 'max';
          notificationContent.vibrate = settings.vibrate ? [0, 250, 250, 250] : undefined;
        }

        const notificationId = await Notifications.scheduleNotificationAsync({
          content: notificationContent,
          trigger: {
            type: SchedulableTriggerInputTypes.DATE,
            date: prayerDate,
            channelId: androidChannelId,
          },
        });

        scheduledIds.push(notificationId);
      } catch (error) {
        console.warn(`Failed to schedule ${prayer.name} notification:`, error);
      }

      // Schedule reminder if enabled
      if (settings.reminderMinutes > 0) {
        const reminderDate = new Date(prayerDate.getTime() - settings.reminderMinutes * 60 * 1000);
        
        if (reminderDate > now) {
          try {
            const reminderChannelId = Platform.OS === 'android'
              ? `${ANDROID_CHANNEL_PREFIX}-silent`
              : undefined;

            const reminderId = await Notifications.scheduleNotificationAsync({
              content: {
                title: `⏰ Reminder: ${prayer.name} Prayer`,
                body: `${prayer.name} prayer in ${settings.reminderMinutes} minutes`,
                // Explicitly disable sound for reminders
                sound: null,
                data: {
                  type: 'reminder',
                  prayerName: prayer.name,
                },
              },
              trigger: {
                type: SchedulableTriggerInputTypes.DATE,
                date: reminderDate,
                channelId: reminderChannelId,
              },
            });

            scheduledIds.push(reminderId);
          } catch (error) {
            console.warn(`Failed to schedule ${prayer.name} reminder:`, error);
          }
        }
      }
    }

    // Save scheduled notification IDs
    await AsyncStorage.setItem(SCHEDULED_NOTIFICATIONS_KEY, JSON.stringify(scheduledIds));

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
 * Test notification (for debugging)
 * 
 * IMPORTANT LIMITATION:
 * - In Expo Go: Only default system notification sound will play
 * - In EAS Build: Custom adhan audio will play correctly
 * 
 * This is an Expo Go limitation, not a bug in our code.
 */
export async function sendTestNotification(): Promise<void> {
  try {
    await initNotifications();
    const settings = await getAdhanSettings();
    const androidChannelId = Platform.OS === 'android'
      ? androidChannelIdFromSettings(false, settings)
      : undefined;
    
    const notificationContent: any = {
      title: '🕌 Test Prayer Notification',
      body: settings.playSound
        ? 'Testing adhan sound'
        : 'Testing notification (sound disabled in settings)',
      // iOS custom sounds must be .caf/.wav/.aiff; use default iOS sound until we ship an iOS-compatible asset.
      sound: Platform.OS === 'ios' ? (settings.playSound ? 'default' : null) : undefined,
      data: {
        type: 'test',
      },
    };

    // Android-specific configuration
    if (Platform.OS === 'android') {
      notificationContent.priority = 'max';
      notificationContent.vibrate = settings.vibrate ? [0, 250, 250, 250] : undefined;
    }

    await Notifications.scheduleNotificationAsync({
      content: notificationContent,
      trigger: {
        type: SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 2,
        channelId: androidChannelId,
      },
    });
  } catch (error) {
    console.error('Failed to send test notification:', error);
    throw error;
  }
}
