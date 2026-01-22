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
import { formatElementName, formatPlanetName } from './NotificationLocalization';
import { getStoredLanguage, tStatic } from './StaticI18n';
import { getAsrarTimingSnapshot } from './TimingSnapshotService';
import { loadProfile } from './UserProfileStorage';

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

type ElementKey = 'fire' | 'water' | 'air' | 'earth';

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

async function buildPrayerGuidanceGlimpse(triggerDate: Date): Promise<string> {
  try {
    const lang = await getStoredLanguage();
    const profile = await loadProfile();
    const userElement = (profile?.derived?.element as ElementKey | undefined) ?? undefined;

    const snapshot = await getAsrarTimingSnapshot(triggerDate);
    const hourPlanet = formatPlanetName(lang, snapshot.planetaryHour.ruler);
    const hourElement = formatElementName(lang, snapshot.planetaryHour.element);

    let noteKey: string = 'notifications.prayer.guidanceNoteNeutral';
    if (userElement) {
      const relationship = calculateElementRelationship(userElement, snapshot.planetaryHour.element as ElementKey);
      if (relationship === 'harmonious') noteKey = 'notifications.prayer.guidanceNoteAligned';
      else if (relationship === 'complementary') noteKey = 'notifications.prayer.guidanceNoteSupportive';
      else if (relationship === 'transformative') noteKey = 'notifications.prayer.guidanceNoteChallenging';
      else noteKey = 'notifications.prayer.guidanceNoteNeutral';
    }

    return tStatic(lang, 'notifications.prayer.guidanceGlimpse', {
      planet: hourPlanet,
      element: hourElement,
      note: tStatic(lang, noteKey),
    });
  } catch {
    return '';
  }
}

function calculateElementRelationship(
  userElement: ElementKey,
  hourElement: ElementKey
): 'harmonious' | 'complementary' | 'neutral' | 'transformative' {
  if (userElement === hourElement) return 'harmonious';

  const activeElements = new Set<ElementKey>(['fire', 'air']);
  const receptiveElements = new Set<ElementKey>(['water', 'earth']);
  if (
    (activeElements.has(userElement) && activeElements.has(hourElement)) ||
    (receptiveElements.has(userElement) && receptiveElements.has(hourElement))
  ) {
    return 'complementary';
  }

  const oppositions: Record<ElementKey, ElementKey> = {
    fire: 'water',
    water: 'fire',
    air: 'earth',
    earth: 'air',
  };
  if (oppositions[userElement] === hourElement) return 'transformative';
  return 'neutral';
}

function normalizePrayerTimeToHHMM(timeString: string): string {
  if (!timeString) return '';
  // Aladhan can return formats like:
  // - "05:10"
  // - "05:10:00"
  // - "05:10 (EET)"
  // - "05:10:00 (+03)"
  const cleaned = String(timeString).replace(/\s*\([^)]*\)\s*/g, '').trim();
  const parts = cleaned.split(':');
  if (parts.length < 2) return '';
  const hh = parts[0].padStart(2, '0');
  const mm = parts[1].padStart(2, '0');
  return `${hh}:${mm}`;
}

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
const ADHAN_DIAGNOSTICS_KEY = '@asrar_adhan_diagnostics';

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
    const lang = await getStoredLanguage();

    if (!settings.enabled) {
      return;
    }

    // Check permissions
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      return;
    }

    // Cancel existing prayer notifications
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

      if (Number.isNaN(prayerDate.getTime())) {
        if (__DEV__) {
          console.warn('[AdhanNotificationService] Invalid prayer time:', { prayer: prayer.name, time: prayer.time });
        }
        continue;
      }

      // Skip if prayer time has passed today
      if (prayerDate <= now) {
        continue;
      }

      // Schedule main notification
      try {
        const androidChannelId = Platform.OS === 'android'
          ? androidChannelIdFromSettings(prayer.isFajr, settings)
          : undefined;

        const title = tStatic(lang, 'notifications.prayer.prayerTitle', {
          prayerName: prayer.name,
        });
        const glimpse = await buildPrayerGuidanceGlimpse(prayerDate);
        const body = tStatic(lang, 'notifications.prayer.prayerBody', {
          prayerName: prayer.name,
          arabic: prayer.nameArabic,
          glimpse,
        });
        
        const notificationContent: any = {
          title,
          body,
          // iOS plays sound per-notification. Note: iOS custom notification sounds must be .caf/.wav/.aiff.
          // Our bundled adhan assets are .mp3, so we fall back to the default iOS notification sound.
          sound: Platform.OS === 'ios' ? (settings.playSound ? 'default' : null) : undefined,
          data: {
            category: 'prayer',
            type: 'prayer',
            action: 'prayerGuidance',
            prayer: prayer.name,
            prayerName: prayer.name,
            prayerArabic: prayer.nameArabic,
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

            const reminderTitle = tStatic(lang, 'notifications.prayer.reminderTitle', {
              prayerName: prayer.name,
              minutes: settings.reminderMinutes,
            });
            const reminderGlimpse = await buildPrayerGuidanceGlimpse(reminderDate);
            const reminderBody = tStatic(lang, 'notifications.prayer.reminderBody', {
              prayerName: prayer.name,
              minutes: settings.reminderMinutes,
              glimpse: reminderGlimpse,
            });

            const reminderId = await Notifications.scheduleNotificationAsync({
              content: {
                title: reminderTitle,
                body: reminderBody,
                // Explicitly disable sound for reminders
                sound: null,
                data: {
                  category: 'prayer',
                  type: 'reminder',
                  action: 'prayerGuidance',
                  prayer: prayer.name,
                  prayerName: prayer.name,
                  prayerArabic: prayer.nameArabic,
                  minutes: settings.reminderMinutes,
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

    // Store lightweight diagnostics for device verification.
    await AsyncStorage.setItem(
      ADHAN_DIAGNOSTICS_KEY,
      JSON.stringify({
        lastScheduledAt: new Date().toISOString(),
        scheduledCount: scheduledIds.length,
        timings: {
          Fajr: timings.Fajr,
          Dhuhr: timings.Dhuhr,
          Asr: timings.Asr,
          Maghrib: timings.Maghrib,
          Isha: timings.Isha,
        },
      })
    );

  } catch (error) {
    console.error('Failed to schedule prayer notifications:', error);
    try {
      await AsyncStorage.setItem(
        ADHAN_DIAGNOSTICS_KEY,
        JSON.stringify({
          lastErrorAt: new Date().toISOString(),
          error: error instanceof Error ? error.message : String(error),
        })
      );
    } catch {
      // ignore
    }
  }
}

/**
 * Cancel all scheduled prayer notifications
 */
export async function cancelAllPrayerNotifications(): Promise<void> {
  try {
    await initNotifications();
    // Prefer canceling only the notifications we created.
    const saved = await AsyncStorage.getItem(SCHEDULED_NOTIFICATIONS_KEY);

    if (saved) {
      const ids: string[] = JSON.parse(saved);
      for (const id of ids) {
        await Notifications.cancelScheduledNotificationAsync(id);
      }
    }

    // Safety net: also cancel any scheduled notifications tagged as prayer.
    try {
      const all = await Notifications.getAllScheduledNotificationsAsync();
      for (const n of all) {
        const data = (n?.content?.data || {}) as Record<string, unknown>;
        if (data.category === 'prayer') {
          await Notifications.cancelScheduledNotificationAsync(n.identifier);
        }
      }
    } catch {
      // ignore
    }

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
    await initNotifications();
    const notifications = await Notifications.getAllScheduledNotificationsAsync();
    return notifications.filter((n: any) => (n?.content?.data as any)?.category === 'prayer').length;
  } catch (error) {
    console.error('Failed to get scheduled notifications:', error);
    return 0;
  }
}

export async function getAdhanDiagnostics(): Promise<Record<string, unknown>> {
  try {
    await initNotifications();
    const saved = await AsyncStorage.getItem(ADHAN_DIAGNOSTICS_KEY);
    const permissions = await Notifications.getPermissionsAsync();
    const prayerCount = await getScheduledNotificationsCount();
    return {
      ...(saved ? JSON.parse(saved) : {}),
      permissionStatus: permissions.status,
      scheduledPrayerNotifications: prayerCount,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function scheduleTestPrayerNotification(delaySeconds: number = 10): Promise<string | null> {
  try {
    await initNotifications();
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) return null;

    const settings = await getAdhanSettings();
    const androidChannelId = Platform.OS === 'android'
      ? androidChannelIdFromSettings(false, settings)
      : undefined;

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Test Prayer Notification',
        body: 'If you see this, scheduling works in this APK.',
        sound: Platform.OS === 'ios' ? 'default' : undefined,
        data: {
          category: 'prayer',
          type: 'test',
          action: 'prayerGuidance',
          prayer: 'Test',
          prayerName: 'Test',
        },
      },
      trigger: {
        type: SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: Math.max(1, Math.floor(delaySeconds)),
        repeats: false,
        channelId: androidChannelId,
      },
    });

    return id;
  } catch (error) {
    console.warn('Failed to schedule test prayer notification:', error);
    return null;
  }
}

/**
 * Parse prayer time string to Date object
 */
function parsePrayerTime(timeStr: string, baseDate: Date = new Date()): Date {
  const hhmm = normalizePrayerTimeToHHMM(timeStr);
  if (!hhmm) return new Date(NaN);
  const [hours, minutes] = hhmm.split(':').map(Number);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return new Date(NaN);
  const date = new Date(baseDate);
  date.setHours(hours, minutes, 0, 0);
  return date;
}

