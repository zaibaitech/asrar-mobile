/**
 * Harmony Hour Notification Service
 * Notifies users of favorable timing windows based on planetary hours
 * 
 * Features:
 * - Notify for favorable harmony periods
 * - Notify for transformative windows
 * - Optional delicate period warnings
 * - Respects quiet hours
 * - Personalized based on user element
 */

import { UserProfile } from '@/types/user-profile';
import { formatElementName, formatPlanetName } from './NotificationLocalization';
import NotificationService, { NotificationCategory } from './NotificationService';
import { getStoredLanguage, tStatic, type AppLanguage } from './StaticI18n';
import { getAsrarTimingSnapshot } from './TimingSnapshotService';
import { loadProfile } from './UserProfileStorage';

export interface HarmonyNotificationSettings {
  enabled: boolean;
  notifyFavorable: boolean;
  notifyTransformative: boolean;
  notifyDelicate: boolean;
  quietHoursStart: string; // HH:mm
  quietHoursEnd: string;   // HH:mm
  leadTimeMinutes: number; // How many minutes before hour to notify
}

/**
 * Schedule harmony hour notifications for the next 24 hours
 */
export async function scheduleHarmonyNotifications(
  userProfile?: UserProfile
): Promise<void> {
  const prefs = await NotificationService.getNotificationPreferences();
  
  if (!prefs.harmony.enabled) {
    console.log('Harmony notifications disabled');
    return;
  }
  
  // Get user profile if not provided
  const profile = userProfile || await loadProfile();

  const lang = await getStoredLanguage();
  
  // Cancel existing harmony notifications
  await NotificationService.cancelCategoryNotifications(NotificationCategory.HARMONY_HOUR);
  
  // Get next 24 hours of planetary hours
  const hours = await getNext24HarmonyHours();
  
  let scheduled = 0;
  
  for (const hour of hours) {
    // Compute harmony level
    const harmonyType = getHarmonyType(hour);
    
    // Check if we should notify for this type
    const shouldNotify = shouldNotifyForHarmony(harmonyType, {
      notifyFavorable: prefs.harmony.notifyFavorable,
      notifyTransformative: prefs.harmony.notifyTransformative,
      notifyDelicate: prefs.harmony.notifyDelicate,
    });
    if (!shouldNotify) continue;
    
    // Create notification
    const notificationTime = new Date(hour.startTime);
    notificationTime.setMinutes(notificationTime.getMinutes() - 5); // 5 min lead time
    
    // Don't schedule notifications in the past
    if (notificationTime <= new Date()) continue;
    
    const title = getHarmonyNotificationTitle(lang, harmonyType);
    const body = getHarmonyNotificationBody(lang, harmonyType, hour, profile || undefined);
    
    const id = await NotificationService.scheduleNotification(
      NotificationCategory.HARMONY_HOUR,
      title,
      body,
      notificationTime,
      {
        action: 'momentAlignment',
        harmony: harmonyType,
        planet: hour.planet,
        element: hour.element,
        startTime: hour.startTime.toISOString(),
      }
    );
    
    if (id) {
      scheduled++;
    }
  }
  
  console.log(`Scheduled ${scheduled} harmony hour notifications`);
}

/**
 * Get next 24 hours of planetary hours with harmony data
 */
async function getNext24HarmonyHours(): Promise<HarmonyHour[]> {
  const hours: HarmonyHour[] = [];
  const now = new Date();
  
  // Get current and next 23 hours (24 total)
  for (let i = 0; i < 24; i++) {
    const checkTime = new Date(now.getTime() + i * 60 * 60 * 1000);
    
    try {
      const snapshot = await getAsrarTimingSnapshot(checkTime);
      
      hours.push({
        startTime: checkTime,
        planet: snapshot.planetaryHour.ruler,
        element: snapshot.planetaryHour.element,
        harmony: snapshot.harmony,
        dayElement: snapshot.dayElement,
        hourElement: snapshot.planetaryHour.element,
      });
    } catch (error) {
      console.warn('Failed to get timing for hour:', error);
    }
  }
  
  return hours;
}

/**
 * Determine harmony type from snapshot
 */
function getHarmonyType(hour: HarmonyHour): HarmonyType {
  const harmony = hour.harmony;
  
  if (harmony >= 0.7) {
    return 'favorable';
  } else if (harmony >= 0.4 && harmony < 0.7) {
    return 'transformative';
  } else if (harmony < 0.4) {
    return 'delicate';
  } else {
    return 'neutral';
  }
}

/**
 * Check if we should notify for this harmony type
 */
function shouldNotifyForHarmony(
  harmonyType: HarmonyType,
  settings: { notifyFavorable: boolean; notifyTransformative: boolean; notifyDelicate: boolean }
): boolean {
  switch (harmonyType) {
    case 'favorable':
      return settings.notifyFavorable;
    case 'transformative':
      return settings.notifyTransformative;
    case 'delicate':
      return settings.notifyDelicate;
    default:
      return false;
  }
}

/**
 * Get notification title based on harmony type
 */
function getHarmonyNotificationTitle(lang: AppLanguage, harmonyType: HarmonyType): string {
  switch (harmonyType) {
    case 'favorable':
      return tStatic(lang, 'notifications.harmony.favorableTitle');
    case 'transformative':
      return tStatic(lang, 'notifications.harmony.transformativeTitle');
    case 'delicate':
      return tStatic(lang, 'notifications.harmony.delicateTitle');
    default:
      return tStatic(lang, 'notifications.harmony.updateTitle');
  }
}

/**
 * Get notification body with personalized message
 */
function getHarmonyNotificationBody(
  lang: AppLanguage,
  harmonyType: HarmonyType,
  hour: HarmonyHour,
  profile?: UserProfile
): string {
  const planetName = formatPlanetName(lang, hour.planet);
  const elementName = formatElementName(lang, hour.element);
  
  // Personalization based on user element
  let personalNote = '';
  if (profile?.derived?.element) {
    const userElement = profile.derived.element;
    if (hour.element === userElement) {
      personalNote = tStatic(lang, 'notifications.harmony.personalNoteAligned', {
        element: formatElementName(lang, userElement),
      });
    }
  }
  const personalNoteSuffix = personalNote ? ` ${personalNote}` : '';
  
  switch (harmonyType) {
    case 'favorable':
      return tStatic(lang, 'notifications.harmony.favorableBody', {
        activity: getPlanetActivity(hour.planet, lang),
        planet: planetName,
        element: elementName,
        personalNote: personalNoteSuffix,
      });
    
    case 'transformative':
      return tStatic(lang, 'notifications.harmony.transformativeBody', {
        activity: getPlanetActivity(hour.planet, lang),
        planet: planetName,
        element: elementName,
        personalNote: personalNoteSuffix,
      });
    
    case 'delicate':
      return tStatic(lang, 'notifications.harmony.delicateBody', {
        activity: getPlanetActivity(hour.planet, lang),
        planet: planetName,
        element: elementName,
        personalNote: personalNoteSuffix,
      });
    
    default:
      return `${planetName} hour begins (${elementName}).${personalNoteSuffix}`;
  }
}

/**
 * Get suggested activities for planet
 */
function getPlanetActivity(planet: string, lang: AppLanguage): string {
  const activities: Record<string, { en: string; fr: string }> = {
    sun: { en: 'leadership and important decisions', fr: 'le leadership et les décisions importantes' },
    moon: { en: 'intuition and emotional matters', fr: 'l’intuition et l’émotionnel' },
    mercury: { en: 'study, communication, and learning', fr: 'l’étude, la communication et l’apprentissage' },
    venus: { en: 'relationships and creative work', fr: 'les relations et la créativité' },
    mars: { en: 'action, exercise, and courage', fr: 'l’action et le courage' },
    jupiter: { en: 'expansion, growth, and generosity', fr: 'l’expansion, la croissance et la générosité' },
    saturn: { en: 'discipline, structure, and long-term planning', fr: 'la discipline, la structure et le long terme' },
  };

  const item = activities[planet.toLowerCase()];
  if (!item) return lang === 'fr' ? 'la pratique spirituelle' : 'spiritual practice';
  return lang === 'fr' ? item.fr : item.en;
}

// Type definitions
type HarmonyType = 'favorable' | 'transformative' | 'delicate' | 'neutral';

interface HarmonyHour {
  startTime: Date;
  planet: string;
  element: string;
  harmony: number;
  dayElement: string;
  hourElement: string;
}

export default {
  scheduleHarmonyNotifications,
};
