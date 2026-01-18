import { DarkTheme } from '@/constants/DarkTheme';
import { useLanguage } from '@/contexts/LanguageContext';
import { Ionicons } from '@expo/vector-icons';
import type { Href } from 'expo-router';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function asText(value: unknown): string {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  try {
    return String(value);
  } catch {
    return '';
  }
}

type ActionKey =
  | ''
  | 'prayerTimes'
  | 'prayerGuidance'
  | 'divineTiming'
  | 'dailyCheckIn'
  | 'momentAlignment'
  | 'dailyGuidance';

export default function NotificationDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { tSafe } = useLanguage();

  const title = asText(params.title) || tSafe('notifications.detail.title', 'Notification');
  const body = asText(params.body);

  const category = asText(params.category);
  const type = asText(params.type);
  const action = (asText(params.action) as ActionKey) || '';

  const planet = asText(params.planet);
  const element = asText(params.element);
  const harmony = asText(params.harmony);
  const date = asText(params.date);
  const prayerName = asText(params.prayerName);
  const prayer = asText(params.prayer);
  const minutes = asText(params.minutes);

  // Daily Guidance details params (used by the home widget route)
  const timingQuality = asText(params.timingQuality);
  const dayElement = asText(params.dayElement);
  const userElement = asText(params.userElement);
  const relationship = asText(params.relationship);
  const messageKey = asText(params.messageKey);
  const messageParams = asText(params.messageParams);
  const bestForKeys = asText(params.bestForKeys);
  const avoidKeys = asText(params.avoidKeys);
  const peakHoursKey = asText(params.peakHoursKey);

  const actionConfig = useMemo((): { route: Href; label: string } | null => {
    switch (action) {
      case 'prayerTimes':
        return { route: '/prayer-times', label: tSafe('notifications.detail.openPrayerTimes', 'Open Prayer Times') };
      case 'prayerGuidance':
        return {
          route: prayerName || prayer
            ? ({ pathname: '/prayer-guidance', params: { prayer: prayerName || prayer } } as unknown as Href)
            : '/prayer-guidance',
          label: tSafe('notifications.detail.openPrayerGuidance', 'Open Prayer Guidance'),
        };
      case 'divineTiming':
        return { route: '/divine-timing', label: tSafe('notifications.detail.openDivineTiming', 'Open Divine Timing') };
      case 'dailyCheckIn':
        return { route: '/daily-checkin', label: tSafe('notifications.detail.openDailyCheckIn', 'Open Daily Check-In') };
      case 'momentAlignment':
        return {
          route: '/moment-alignment-details',
          label: tSafe('notifications.detail.openMomentAlignment', 'Open Moment Alignment'),
        };
      case 'dailyGuidance':
        return {
          route: (
            {
              pathname: '/(tabs)/daily-guidance-details',
              params: {
                timingQuality: timingQuality || 'neutral',
                dayElement: dayElement || 'earth',
                userElement: userElement || '',
                relationship: relationship || 'neutral',
                messageKey: messageKey || '',
                messageParams: messageParams || '{}',
                bestForKeys: bestForKeys || '[]',
                avoidKeys: avoidKeys || '[]',
                peakHoursKey: peakHoursKey || '',
              },
            } as unknown as Href
          ),
          label: tSafe('notifications.detail.openDailyGuidance', 'Open Daily Guidance'),
        };
      default:
        return null;
    }
  }, [
    action,
    avoidKeys,
    bestForKeys,
    dayElement,
    messageKey,
    messageParams,
    peakHoursKey,
    prayer,
    prayerName,
    relationship,
    tSafe,
    timingQuality,
    userElement,
  ]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={22} color={DarkTheme.textPrimary} />
          <Text style={styles.backText}>{tSafe('notifications.detail.back', 'Back')}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{tSafe('notifications.detail.title', 'Notification')}</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>{title}</Text>

        <View style={styles.card}>
          <Text style={styles.body}>{body || 'No content provided.'}</Text>
        </View>

        {(category || type || planet || element || harmony || date || prayerName || minutes) ? (
          <View style={styles.metaCard}>
            {!!category && <Text style={styles.metaLine}>Category: {category}</Text>}
            {!!type && <Text style={styles.metaLine}>Type: {type}</Text>}
            {!!planet && <Text style={styles.metaLine}>Planet: {planet}</Text>}
            {!!element && <Text style={styles.metaLine}>Element: {element}</Text>}
            {!!harmony && <Text style={styles.metaLine}>Harmony: {harmony}</Text>}
            {!!date && <Text style={styles.metaLine}>Date: {date}</Text>}
            {!!prayerName && <Text style={styles.metaLine}>Prayer: {prayerName}</Text>}
            {!!minutes && <Text style={styles.metaLine}>Minutes: {minutes}</Text>}
          </View>
        ) : null}

        {actionConfig ? (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push(actionConfig.route)}
            activeOpacity={0.85}
          >
            <Ionicons name="open-outline" size={18} color="#fff" />
            <Text style={styles.actionButtonText}>{actionConfig.label}</Text>
          </TouchableOpacity>
        ) : null}

        <Text style={styles.tip}>
          {tSafe(
            'notifications.detail.tip',
            'Tip: Android may collapse notification bodies in the tray; this screen always shows the full text.'
          )}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0B0A10',
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  backText: {
    color: DarkTheme.textPrimary,
    fontSize: 14,
  },
  headerTitle: {
    color: DarkTheme.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 12,
  },
  title: {
    color: DarkTheme.textPrimary,
    fontSize: 20,
    fontWeight: '700',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: 14,
  },
  body: {
    color: DarkTheme.textPrimary,
    fontSize: 15,
    lineHeight: 22,
  },
  metaCard: {
    backgroundColor: 'rgba(99,102,241,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(99,102,241,0.18)',
    borderRadius: 12,
    padding: 14,
    gap: 6,
  },
  metaLine: {
    color: DarkTheme.textSecondary,
    fontSize: 13,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#4f46e5',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  tip: {
    color: DarkTheme.textSecondary,
    fontSize: 12,
    opacity: 0.8,
  },
});
