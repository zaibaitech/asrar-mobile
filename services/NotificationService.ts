/**
 * General Notification Service
 * Unified notification management for all app features
 * 
 * Features:
 * - Centralized notification scheduling
 * - Category-based organization
 * - User preference management
 * - Rate limiting
 * - Quiet hours support
 * - Notification history tracking
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Lazy import to avoid Expo Go warning
let Notifications: any;
let SchedulableTriggerInputTypes: any;

const STORAGE_KEY = '@asrar_notification_preferences';
const HISTORY_KEY = '@asrar_notification_history';
const SCHEDULED_KEY = '@asrar_all_scheduled_notifications';

let initialized = false;

/**
 * Notification categories
 */
export enum NotificationCategory {
  PRAYER = 'prayer',           // Adhan notifications (handled by AdhanNotificationService)
  HARMONY_HOUR = 'harmony',    // Favorable timing windows
  DIVINE_TIMING = 'timing',    // Personalized spiritual timing
  DAILY_CHECKIN = 'checkin',   // Daily check-in reminders
  ISTIKHARA = 'istikhara',     // Istikhara follow-ups
  ZIKR_REMINDER = 'zikr',      // Zikr practice reminders
  SADAQAH_REMINDER = 'sadaqah', // Sadaqah tracking
}

/**
 * Notification preferences
 */
export interface NotificationPreferences {
  // Category toggles
  harmony: {
    enabled: boolean;
    notifyFavorable: boolean;
    notifyTransformative: boolean;
    notifyDelicate: boolean;
  };
  timing: {
    enabled: boolean;
    morningBriefing: boolean;
    morningBriefingTime: string; // HH:mm
    elementalAlignment: boolean;
    planetaryHourChanges: boolean;
  };
  checkin: {
    enabled: boolean;
    reminderTime: string; // HH:mm
    daysOfWeek: number[]; // 0-6 (Sunday-Saturday)
  };
  istikhara: {
    enabled: boolean;
    followUpDays: number; // Days after istikhara to remind
  };
  zikr: {
    enabled: boolean;
    reminderTimes: string[]; // Array of HH:mm
  };
  sadaqah: {
    enabled: boolean;
    reminderFrequency: 'daily' | 'weekly' | 'monthly';
  };
  
  // General settings
  general: {
    masterEnabled: boolean;
    quietHoursStart: string; // HH:mm
    quietHoursEnd: string;   // HH:mm
    maxNotificationsPerDay: number;
  };
}

/**
 * Default preferences
 */
const DEFAULT_PREFERENCES: NotificationPreferences = {
  harmony: {
    enabled: false, // Opt-in for new features
    notifyFavorable: true,
    notifyTransformative: true,
    notifyDelicate: false,
  },
  timing: {
    enabled: false,
    morningBriefing: true,
    morningBriefingTime: '07:00',
    elementalAlignment: true,
    planetaryHourChanges: false,
  },
  checkin: {
    enabled: false,
    reminderTime: '20:00',
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6], // All days
  },
  istikhara: {
    enabled: false,
    followUpDays: 3,
  },
  zikr: {
    enabled: false,
    reminderTimes: [],
  },
  sadaqah: {
    enabled: false,
    reminderFrequency: 'weekly',
  },
  general: {
    masterEnabled: true,
    quietHoursStart: '22:00',
    quietHoursEnd: '07:00',
    maxNotificationsPerDay: 12,
  },
};

/**
 * Notification history entry
 */
export interface NotificationHistoryEntry {
  id: string;
  category: NotificationCategory;
  title: string;
  body: string;
  sentAt: number;
  opened: boolean;
  action?: string;
  data?: any;
}

/**
 * Initialize notification system
 */
export async function initializeNotifications(): Promise<void> {
  if (initialized) return;
  
  try {
    // Lazy load expo-notifications
    const notifModule = await import('expo-notifications');
    Notifications = notifModule;
    SchedulableTriggerInputTypes = notifModule.SchedulableTriggerInputTypes;
    
    // Set notification handler
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
    
    // Setup Android channels
    if (Platform.OS === 'android') {
      await setupAndroidChannels();
    }
    
    initialized = true;
  } catch (error) {
    console.warn('Failed to initialize notifications:', error);
  }
}

/**
 * Setup Android notification channels
 */
async function setupAndroidChannels(): Promise<void> {
  if (!Notifications) return;
  
  const channels = [
    {
      id: 'harmony-alerts',
      name: 'Harmony Hour Alerts',
      description: 'Notifications for favorable timing windows',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      sound: 'default',
    },
    {
      id: 'timing-updates',
      name: 'Divine Timing Updates',
      description: 'Personalized spiritual timing alerts',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
      sound: 'default',
    },
    {
      id: 'daily-briefing',
      name: 'Daily Spiritual Briefing',
      description: 'Morning spiritual guidance',
      importance: Notifications.AndroidImportance.DEFAULT,
      sound: 'default',
    },
    {
      id: 'practice-reminders',
      name: 'Practice Reminders',
      description: 'Zikr and Sadaqah reminders',
      importance: Notifications.AndroidImportance.LOW,
      sound: 'default',
    },
    {
      id: 'istikhara-followup',
      name: 'Istikhara Follow-up',
      description: 'Istikhara tracking reminders',
      importance: Notifications.AndroidImportance.DEFAULT,
      sound: 'default',
    },
  ];
  
  for (const channel of channels) {
    try {
      await Notifications.setNotificationChannelAsync(channel.id, channel);
    } catch (error) {
      console.warn(`Failed to create channel ${channel.id}:`, error);
    }
  }
}

/**
 * Request notification permissions
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  await initializeNotifications();
  
  if (!Notifications) return false;
  
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    return finalStatus === 'granted';
  } catch (error) {
    console.warn('Permission request failed:', error);
    return false;
  }
}

/**
 * Get notification preferences
 */
export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.warn('Failed to load preferences:', error);
  }
  return DEFAULT_PREFERENCES;
}

/**
 * Update notification preferences
 */
export async function updateNotificationPreferences(
  updates: Partial<NotificationPreferences>
): Promise<void> {
  try {
    const current = await getNotificationPreferences();
    const updated = { ...current, ...updates };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.warn('Failed to update preferences:', error);
  }
}

/**
 * Save complete notification preferences (overwrites existing)
 */
export async function saveNotificationPreferences(
  preferences: NotificationPreferences
): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.warn('Failed to save preferences:', error);
  }
}

/**
 * Check if notifications are enabled for a category
 */
export async function isCategoryEnabled(category: NotificationCategory): Promise<boolean> {
  const prefs = await getNotificationPreferences();
  
  // Check master toggle
  if (!prefs.general.masterEnabled) return false;
  
  // Check category-specific toggle
  switch (category) {
    case NotificationCategory.HARMONY_HOUR:
      return prefs.harmony.enabled;
    case NotificationCategory.DIVINE_TIMING:
      return prefs.timing.enabled;
    case NotificationCategory.DAILY_CHECKIN:
      return prefs.checkin.enabled;
    case NotificationCategory.ISTIKHARA:
      return prefs.istikhara.enabled;
    case NotificationCategory.ZIKR_REMINDER:
      return prefs.zikr.enabled;
    case NotificationCategory.SADAQAH_REMINDER:
      return prefs.sadaqah.enabled;
    case NotificationCategory.PRAYER:
      return true; // Prayer notifications have their own settings
    default:
      return true;
  }
}

/**
 * Check if time is within quiet hours
 */
export async function isQuietHour(date: Date = new Date()): Promise<boolean> {
  const prefs = await getNotificationPreferences();
  const { quietHoursStart, quietHoursEnd } = prefs.general;
  
  const hour = date.getHours();
  const minute = date.getMinutes();
  const currentMinutes = hour * 60 + minute;
  
  const [startHour, startMin] = quietHoursStart.split(':').map(Number);
  const startMinutes = startHour * 60 + startMin;
  
  const [endHour, endMin] = quietHoursEnd.split(':').map(Number);
  const endMinutes = endHour * 60 + endMin;
  
  // Handle overnight quiet hours (e.g., 22:00 - 07:00)
  if (startMinutes > endMinutes) {
    return currentMinutes >= startMinutes || currentMinutes <= endMinutes;
  } else {
    return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
  }
}

/**
 * Schedule a notification
 */
export async function scheduleNotification(
  category: NotificationCategory,
  title: string,
  body: string,
  triggerDate: Date,
  data?: any,
  options?: {
    ignoreQuietHours?: boolean;
    ignoreCategoryToggle?: boolean;
  }
): Promise<string | null> {
  await initializeNotifications();
  
  if (!Notifications) {
    console.warn('Notifications not available');
    return null;
  }
  
  // Check if category is enabled
  if (!options?.ignoreCategoryToggle) {
    const enabled = await isCategoryEnabled(category);
    if (!enabled) {
      return null;
    }
  }
  
  // Check quiet hours (except for prayer notifications)
  if (category !== NotificationCategory.PRAYER && !options?.ignoreQuietHours) {
    const isQuiet = await isQuietHour(triggerDate);
    if (isQuiet) {
      console.log(`Skipping notification during quiet hours: ${title}`);
      return null;
    }
  }
  
  // Check rate limit
  const canSchedule = await checkRateLimit(category);
  if (!canSchedule) {
    console.log(`Rate limit exceeded for category: ${category}`);
    return null;
  }
  
  try {
    // Select channel for Android
    const channelId = getChannelId(category);
    
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: { category, ...data },
        sound: 'default',
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: {
        type: SchedulableTriggerInputTypes.DATE,
        date: triggerDate,
        channelId: Platform.OS === 'android' ? channelId : undefined,
      },
    });
    
    // Track scheduled notification
    await trackScheduledNotification(notificationId, category, triggerDate);
    
    return notificationId;
  } catch (error) {
    console.warn('Failed to schedule notification:', error);
    return null;
  }
}

/**
 * Get Android channel ID for category
 */
function getChannelId(category: NotificationCategory): string {
  switch (category) {
    case NotificationCategory.HARMONY_HOUR:
      return 'harmony-alerts';
    case NotificationCategory.DIVINE_TIMING:
      return 'timing-updates';
    case NotificationCategory.DAILY_CHECKIN:
      return 'daily-briefing';
    case NotificationCategory.ZIKR_REMINDER:
    case NotificationCategory.SADAQAH_REMINDER:
      return 'practice-reminders';
    case NotificationCategory.ISTIKHARA:
      return 'istikhara-followup';
    default:
      return 'timing-updates';
  }
}

/**
 * Check rate limit for category
 */
async function checkRateLimit(category: NotificationCategory): Promise<boolean> {
  const prefs = await getNotificationPreferences();
  const maxPerDay = prefs.general.maxNotificationsPerDay;
  
  // Get today's scheduled notifications
  const history = await getNotificationHistory();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayCount = history.filter(entry => {
    const entryDate = new Date(entry.sentAt);
    entryDate.setHours(0, 0, 0, 0);
    return entryDate.getTime() === today.getTime();
  }).length;
  
  return todayCount < maxPerDay;
}

/**
 * Track scheduled notification
 */
async function trackScheduledNotification(
  id: string,
  category: NotificationCategory,
  triggerDate: Date
): Promise<void> {
  try {
    const stored = await AsyncStorage.getItem(SCHEDULED_KEY);
    const scheduled = stored ? JSON.parse(stored) : {};
    
    if (!scheduled[category]) {
      scheduled[category] = [];
    }
    
    scheduled[category].push({
      id,
      triggerDate: triggerDate.toISOString(),
    });
    
    await AsyncStorage.setItem(SCHEDULED_KEY, JSON.stringify(scheduled));
  } catch (error) {
    console.warn('Failed to track notification:', error);
  }
}

/**
 * Cancel notification
 */
export async function cancelNotification(id: string): Promise<void> {
  await initializeNotifications();
  
  if (!Notifications) return;
  
  try {
    await Notifications.cancelScheduledNotificationAsync(id);
  } catch (error) {
    console.warn('Failed to cancel notification:', error);
  }
}

/**
 * Cancel all notifications for a category
 */
export async function cancelCategoryNotifications(
  category: NotificationCategory
): Promise<void> {
  try {
    const stored = await AsyncStorage.getItem(SCHEDULED_KEY);
    if (!stored) return;
    
    const scheduled = JSON.parse(stored);
    const categoryIds = scheduled[category] || [];
    
    for (const entry of categoryIds) {
      await cancelNotification(entry.id);
    }
    
    // Clear from storage
    delete scheduled[category];
    await AsyncStorage.setItem(SCHEDULED_KEY, JSON.stringify(scheduled));
  } catch (error) {
    console.warn('Failed to cancel category notifications:', error);
  }
}

/**
 * Get notification history
 */
export async function getNotificationHistory(): Promise<NotificationHistoryEntry[]> {
  try {
    const stored = await AsyncStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.warn('Failed to load notification history:', error);
    return [];
  }
}

/**
 * Add entry to notification history
 */
export async function addToHistory(entry: NotificationHistoryEntry): Promise<void> {
  try {
    const history = await getNotificationHistory();
    history.unshift(entry);
    
    // Keep last 100 entries
    const trimmed = history.slice(0, 100);
    
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
  } catch (error) {
    console.warn('Failed to add to history:', error);
  }
}

/**
 * Clear notification history
 */
export async function clearHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.warn('Failed to clear history:', error);
  }
}

export default {
  initializeNotifications,
  requestNotificationPermissions,
  getNotificationPreferences,
  updateNotificationPreferences,
  saveNotificationPreferences,
  isCategoryEnabled,
  isQuietHour,
  scheduleNotification,
  cancelNotification,
  cancelCategoryNotifications,
  getNotificationHistory,
  addToHistory,
  clearHistory,
};
