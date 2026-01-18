import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

function coerceString(value: unknown): string {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  try {
    return String(value);
  } catch {
    return '';
  }
}

function coerceJsonString(value: unknown, fallback: string): string {
  if (value == null) return fallback;
  if (typeof value === 'string') return value;
  try {
    return JSON.stringify(value);
  } catch {
    return fallback;
  }
}

export function NotificationTapHandler() {
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const handleResponse = (response: Notifications.NotificationResponse) => {
      if (!isMounted) return;

      const notification = response.notification;
      const content = notification.request.content;
      const data = (content.data || {}) as Record<string, unknown>;

      const title = coerceString(content.title);
      const body = coerceString(content.body);
      const category = coerceString(data.category);
      const type = coerceString(data.type);
      const prayer = coerceString(data.prayer);

      const explicitAction = coerceString(data.action);

      const action = (() => {
        if (explicitAction) return explicitAction;

        switch (category) {
          case 'prayer':
            // Prayer notifications should land on Prayer Guidance (same module) when available.
            return 'prayerGuidance';
          case 'timing':
            if (type === 'morning-briefing') return 'dailyGuidance';
            if (type === 'element-alignment') return 'momentAlignment';
            return 'divineTiming';
          case 'harmony':
            return 'momentAlignment';
          default:
            return '';
        }
      })();

      // Always show a details screen so users can read the full content.
      router.push({
        pathname: '/(screens)/notification-detail',
        params: {
          title,
          body,
          category,
          type,
          action,
          // useful extras
          planet: coerceString(data.planet),
          element: coerceString(data.element),
          harmony: coerceString(data.harmony),
          date: coerceString(data.date),
          prayerName: coerceString(data.prayerName),
          prayer,
          minutes: coerceString(data.minutes),

          // Daily Guidance details params (for morning briefings)
          timingQuality: coerceString(data.timingQuality),
          dayElement: coerceString(data.dayElement),
          userElement: coerceString(data.userElement),
          relationship: coerceString(data.relationship),
          messageKey: coerceString(data.messageKey),
          messageParams: coerceJsonString(data.messageParams, '{}'),
          bestForKeys: coerceJsonString(data.bestForKeys, '[]'),
          avoidKeys: coerceJsonString(data.avoidKeys, '[]'),
          peakHoursKey: coerceString(data.peakHoursKey),
        },
      });
    };

    // Handle cold-start tap
    Notifications.getLastNotificationResponseAsync()
      .then((last) => {
        if (last) {
          handleResponse(last);
        }
      })
      .catch(() => {
        // ignore
      });

    // Handle background/foreground taps
    const subscription = Notifications.addNotificationResponseReceivedListener(handleResponse);

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, [router]);

  return null;
}
