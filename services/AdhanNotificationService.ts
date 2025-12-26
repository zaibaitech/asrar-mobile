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
    // Main adhan channel with high importance for sound
    await Notifications.setNotificationChannelAsync(ADHAN_CHANNEL_ID, {
      name: 'Prayer Call (Adhan)',
      description: 'Notifications for prayer times with adhan audio',
      importance: Notifications.AndroidImportance.MAX,
      sound: 'default', // Will be overridden per notification
      vibrationPattern: [0, 250, 250, 250],
      enableVibrate: true,
      enableLights: true,
      lightColor: '#64B5F6',
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      bypassDnd: true, // Allow sound even in Do Not Disturb mode
    });

    console.log('Android notification channels configured');
  } catch (error) {
    console.error('Failed to setup Android channels:', error);
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
        const soundFile = getAdhanSound(prayer.isFajr, settings);
        
        const notificationContent: any = {
          title: `🕌 ${prayer.name} Prayer Time`,
          body: `It's time for ${prayer.name} prayer (${prayer.nameArabic})`,
          sound: soundFile,
          data: {
            type: 'prayer',
            prayerName: prayer.name,
            isFajr: prayer.isFajr,
          },
        };

        // Android-specific configuration
        if (Platform.OS === 'android') {
          notificationContent.channelId = ADHAN_CHANNEL_ID;
          notificationContent.priority = 'max';
          notificationContent.vibrate = settings.vibrate ? [0, 250, 250, 250] : undefined;
        }

        const notificationId = await Notifications.scheduleNotificationAsync({
          content: notificationContent,
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
 * Returns proper format for both Android and iOS
 * 
 * IMPORTANT: Custom notification sounds only work in:
 * - EAS Development builds
 * - EAS Production builds  
 * - NOT in Expo Go (will use default system sound)
 */
function getAdhanSound(isFajr: boolean, settings: AdhanSettings): string | null {
  if (!settings.playSound) {
    console.log('[AdhanSound] Sound disabled in settings');
    return null;
  }

  const adhanType = isFajr ? settings.fajrAdhan : settings.otherAdhan;

  // Sound file paths:
  // - Android EAS builds: no extension (e.g., 'adhan_default')
  // - iOS EAS builds: with extension (e.g., 'adhan_default.mp3')
  // - Expo Go: will use system default sound regardless
  const sounds = {
    mishary: Platform.OS === 'android' ? 'adhan_mishary' : 'adhan_mishary.mp3',
    mecca: Platform.OS === 'android' ? 'adhan_mecca' : 'adhan_mecca.mp3',
    medina: Platform.OS === 'android' ? 'adhan_medina' : 'adhan_medina.mp3',
    default: isFajr 
      ? (Platform.OS === 'android' ? 'adhan_fajr' : 'adhan_fajr.mp3')
      : (Platform.OS === 'android' ? 'adhan_default' : 'adhan_default.mp3'),
  };

  const soundFile = sounds[adhanType] || sounds.default;
  console.log(`[AdhanSound] Selected sound: ${soundFile} (prayer: ${isFajr ? 'Fajr' : 'Other'}, type: ${adhanType})`);
  
  return soundFile;
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
    const soundFile = getAdhanSound(false, settings); // Use default adhan sound
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔔 SENDING TEST NOTIFICATION');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Platform:', Platform.OS);
    console.log('Sound file:', soundFile);
    console.log('Play sound:', settings.playSound);
    console.log('Vibrate:', settings.vibrate);
    console.log('Channel ID:', ADHAN_CHANNEL_ID);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const notificationContent: any = {
      title: '🕌 Test Prayer Notification',
      body: soundFile 
        ? 'Testing adhan sound (EAS build required for custom sound)'
        : 'Testing notification (sound disabled in settings)',
      sound: soundFile || 'default',
      data: {
        type: 'test',
        soundFile: soundFile || 'none',
      },
    };

    // Android-specific configuration
    if (Platform.OS === 'android') {
      notificationContent.channelId = ADHAN_CHANNEL_ID;
      notificationContent.priority = 'max';
      notificationContent.vibrate = settings.vibrate ? [0, 250, 250, 250] : undefined;
      console.log('Android config: channelId =', ADHAN_CHANNEL_ID);
    }

    await Notifications.scheduleNotificationAsync({
      content: notificationContent,
      trigger: {
        type: SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 2,
      },
    });
    
    console.log('✅ Test notification scheduled for 2 seconds from now');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  } catch (error) {
    console.error('❌ Failed to send test notification:', error);
    throw error;
  }
}
