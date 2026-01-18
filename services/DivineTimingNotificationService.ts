/**
 * Divine Timing Notification Service
 * Provides spiritual briefings and optimal timing alerts
 * 
 * Features:
 * - Morning spiritual briefing with day's element & harmony
 * - Strong element alignment alerts
 * - Planetary hour transition notifications
 * - Integration with Divine Timing AI guidance
 */

import { UserProfile } from '@/types/user-profile';
import { getDailyGuidanceForDate } from './DailyGuidanceService';
import { formatElementName, formatPlanetName } from './NotificationLocalization';
import NotificationService, { NotificationCategory } from './NotificationService';
import { getStoredLanguage, tStatic, type AppLanguage } from './StaticI18n';
import { AsrarTimingSnapshot, getAsrarTimingSnapshot } from './TimingSnapshotService';
import { loadProfile } from './UserProfileStorage';

type ElementKey = 'fire' | 'water' | 'air' | 'earth';

export interface DivineTimingNotificationSettings {
  enabled: boolean;
  morningBriefing: boolean;
  morningBriefingTime: string; // HH:mm (default "06:00")
  elementAlignmentAlerts: boolean;
  planetaryTransitions: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
}

/**
 * Schedule morning spiritual briefing
 */
export async function scheduleMorningBriefing(
  userProfile?: UserProfile
): Promise<void> {
  const prefs = await NotificationService.getNotificationPreferences();
  
  if (!prefs.timing.enabled || !prefs.timing.morningBriefing) {
    console.log('Morning briefing disabled');
    return;
  }
  
  // Cancel existing morning briefings
  await cancelMorningBriefings();
  
  // Get user profile
  const profile = userProfile || await loadProfile();

  const lang = await getStoredLanguage();
  
  // Parse briefing time
  const briefingTime = prefs.timing.morningBriefingTime || '07:00';
  const [hours, minutes] = briefingTime.split(':').map(Number);
  
  // Schedule for tomorrow and next 7 days
  const now = new Date();
  let scheduled = 0;
  
  for (let i = 0; i < 8; i++) {
    const briefingDate = new Date(now);
    briefingDate.setDate(now.getDate() + i);
    briefingDate.setHours(hours, minutes, 0, 0);
    
    // Skip if in the past
    if (briefingDate <= now) continue;
    
    // Get timing snapshot for that morning
    const snapshot = await getAsrarTimingSnapshot(briefingDate);

    // Prepare params for the Daily Guidance details screen (same route as the home widget)
    const guidance = await getDailyGuidanceForDate(profile || undefined, briefingDate);
    
    const title = getMorningBriefingTitle(lang, snapshot);
    const body = getMorningBriefingBody(lang, snapshot, profile || undefined) || tStatic(lang, 'notifications.timing.morningBody', {
      elementName: formatElementName(lang, snapshot.dayElement),
      harmonyText: tStatic(lang, 'notifications.timing.harmonyBalanced'),
      planet: formatPlanetName(lang, snapshot.planetaryHour.ruler),
      personalNote: '',
    });
    
    const id = await NotificationService.scheduleNotification(
      NotificationCategory.DIVINE_TIMING,
      title,
      body,
      briefingDate,
      {
        action: 'dailyGuidance',
        type: 'morning-briefing',
        date: briefingDate.toISOString(),
        dayElement: snapshot.dayElement,
        harmony: snapshot.harmony,

        // Daily Guidance details params
        timingQuality: guidance.timingQuality,
        userElement: guidance.userElement ?? '',
        relationship: guidance.relationship,
        messageKey: guidance.messageKey,
        messageParams: JSON.stringify(guidance.messageParams || {}),
        bestForKeys: JSON.stringify(guidance.bestForKeys || []),
        avoidKeys: JSON.stringify(guidance.avoidKeys || []),
        peakHoursKey: guidance.peakHoursKey || '',
      }
    );
    
    if (id) {
      scheduled++;
    }
  }
  
  console.log(`Scheduled ${scheduled} morning briefings`);
}

/**
 * Cancel morning briefing notifications
 */
async function cancelMorningBriefings(): Promise<void> {
  const history = await NotificationService.getNotificationHistory();
  const briefingIds = history
    .filter(n => n.category === NotificationCategory.DIVINE_TIMING && n.data?.type === 'morning-briefing')
    .map(n => n.id);
  
  for (const id of briefingIds) {
    await NotificationService.cancelNotification(id);
  }
}

/**
 * Get morning briefing title
 */
function getMorningBriefingTitle(lang: AppLanguage, snapshot: AsrarTimingSnapshot): string {
  const dayName = snapshot.islamicDay?.dayName || '';
  const elementEmoji = getElementEmoji(snapshot.dayElement);

  return tStatic(lang, 'notifications.timing.morningTitle', {
    emoji: elementEmoji,
    dayName,
  });
}

/**
 * Get morning briefing body with spiritual guidance
 */
function getMorningBriefingBody(
  lang: AppLanguage,
  snapshot: AsrarTimingSnapshot,
  profile?: UserProfile
): string {
  const element = snapshot.dayElement;
  const elementName = formatElementName(lang, element);
  const harmony = snapshot.harmony;
  const planet = formatPlanetName(lang, snapshot.planetaryHour.ruler);
  
  // Harmony assessment
  let harmonyText = '';
  if (harmony >= 0.7) {
    harmonyText = tStatic(lang, 'notifications.timing.harmonyHigh');
  } else if (harmony >= 0.4) {
    harmonyText = tStatic(lang, 'notifications.timing.harmonyBalanced');
  } else {
    harmonyText = tStatic(lang, 'notifications.timing.harmonyReflective');
  }
  
  // Personalization
  let personalNote = '';
  const userElement = profile?.derived?.element as ElementKey | undefined;
  if (userElement) {
    const sameElementNote = userElement === (element as ElementKey)
      ? tStatic(lang, 'notifications.timing.personalNoteSameElement', {
          element: formatElementName(lang, userElement),
        })
      : '';
    const recommendation = getProfileRecommendationForDay(lang, userElement, element as ElementKey);
    personalNote = [sameElementNote, recommendation].filter(Boolean).join(' ');
  }

  const personalNoteSuffix = personalNote ? ` ${personalNote}` : '';

  return tStatic(lang, 'notifications.timing.morningBody', {
    elementName,
    harmonyText,
    planet,
    personalNote: personalNoteSuffix,
  });
}

function getProfileRecommendationForDay(
  lang: AppLanguage,
  userElement: ElementKey,
  dayElement: ElementKey
): string {
  if (userElement === dayElement) {
    return lang === 'fr'
      ? "C’est une journée d’élan pour vous : avancez sur l’essentiel."
      : 'This is a momentum day for you—move forward on what matters.';
  }

  const active = new Set<ElementKey>(['fire', 'air']);
  const receptive = new Set<ElementKey>(['water', 'earth']);
  const isComplementary =
    (active.has(userElement) && active.has(dayElement)) ||
    (receptive.has(userElement) && receptive.has(dayElement));
  if (isComplementary) {
    return lang === 'fr'
      ? "Énergie soutenante : construisez, planifiez et progressez avec constance."
      : 'Supportive energy—build, plan, and progress steadily.';
  }

  const oppositions: Record<ElementKey, ElementKey> = {
    fire: 'water',
    water: 'fire',
    air: 'earth',
    earth: 'air',
  };
  if (oppositions[userElement] === dayElement) {
    return lang === 'fr'
      ? "Énergie de tension : allez doucement, révisez et évitez de forcer."
      : 'Tension energy—go slower, review, and avoid forcing outcomes.';
  }

  return lang === 'fr'
    ? "Énergie équilibrée : restez régulier et attentif."
    : 'Balanced energy—stay steady and mindful.';
}

/**
 * Schedule element alignment notifications
 * Notifies when user's element is strongly aligned
 */
export async function scheduleElementAlignmentAlerts(
  userProfile?: UserProfile
): Promise<void> {
  const prefs = await NotificationService.getNotificationPreferences();
  
  if (!prefs.timing.enabled || !prefs.timing.elementalAlignment) {
    return;
  }
  
  const profile = userProfile || await loadProfile();

  const lang = await getStoredLanguage();
  
  if (!profile?.derived?.element) {
    console.log('User element not set, cannot schedule alignment alerts');
    return;
  }
  
  // Cancel existing alignment alerts
  await cancelElementAlignmentAlerts();
  
  // Check next 24 hours for strong alignment
  const now = new Date();
  let scheduled = 0;
  
  for (let i = 0; i < 24; i++) {
    const checkTime = new Date(now.getTime() + i * 60 * 60 * 1000);
    
    try {
      const snapshot = await getAsrarTimingSnapshot(checkTime);
      
      // Check if day element matches user element
      const isDayAligned = snapshot.dayElement === profile.derived!.element;
      // Check if hour element matches user element
      const isHourAligned = snapshot.planetaryHour.element === profile.derived!.element;
      
      // Strong alignment = both day and hour match
      if (isDayAligned && isHourAligned && snapshot.harmony >= 0.5) {
        const title = tStatic(lang, 'notifications.timing.alignmentTitle', {
          elementUpper: profile.derived!.element.toUpperCase(),
        });
        const body = tStatic(lang, 'notifications.timing.alignmentBody', {
          element: formatElementName(lang, profile.derived!.element),
          activity: getElementActivity(profile.derived!.element, lang),
        });
        
        const id = await NotificationService.scheduleNotification(
          NotificationCategory.DIVINE_TIMING,
          title,
          body,
          checkTime,
          {
            action: 'momentAlignment',
            type: 'element-alignment',
            element: profile.derived!.element,
            harmony: snapshot.harmony,
          }
        );
        
        if (id) {
          scheduled++;
        }
      }
    } catch (error) {
      console.warn('Failed to check alignment for hour:', error);
    }
  }
  
  console.log(`Scheduled ${scheduled} element alignment alerts`);
}

/**
 * Cancel element alignment notifications
 */
async function cancelElementAlignmentAlerts(): Promise<void> {
  const history = await NotificationService.getNotificationHistory();
  const alignmentIds = history
    .filter(n => n.category === NotificationCategory.DIVINE_TIMING && n.data?.type === 'element-alignment')
    .map(n => n.id);
  
  for (const id of alignmentIds) {
    await NotificationService.cancelNotification(id);
  }
}

/**
 * Get element emoji
 */
function getElementEmoji(element: string): string {
  const emojis: Record<string, string> = {
    fire: '🔥',
    earth: '🌍',
    air: '🌬️',
    water: '💧',
  };
  return emojis[element.toLowerCase()] || '✨';
}

/**
 * Get element-specific activities (localized)
 */
function getElementActivity(element: string, lang: AppLanguage): string {
  const activities: Record<string, { en: string; fr: string }> = {
    fire: { en: 'action and leadership', fr: 'l’action et le leadership' },
    earth: { en: 'building and planning', fr: 'la construction et la planification' },
    air: { en: 'communication and learning', fr: 'la communication et l’apprentissage' },
    water: { en: 'intuition and spiritual connection', fr: 'l’intuition et la connexion spirituelle' },
  };

  const item = activities[element.toLowerCase()];
  if (!item) return lang === 'fr' ? 'la pratique spirituelle' : 'spiritual practice';
  return lang === 'fr' ? item.fr : item.en;
}

/**
 * Schedule all divine timing notifications
 * Call this on app startup or when user updates their profile
 */
export async function scheduleDivineTimingNotifications(
  userProfile?: UserProfile
): Promise<void> {
  const prefs = await NotificationService.getNotificationPreferences();
  
  // Schedule morning briefings if enabled
  if (prefs.timing.enabled && prefs.timing.morningBriefing) {
    await scheduleMorningBriefing(userProfile);
  }
  
  // Schedule element alignment alerts if enabled
  if (prefs.timing.enabled && prefs.timing.elementalAlignment) {
    await scheduleElementAlignmentAlerts(userProfile);
  }
  
  console.log('Divine timing notifications scheduled');
}

export default {
  scheduleDivineTimingNotifications,
  scheduleMorningBriefing,
  scheduleElementAlignmentAlerts,
};
