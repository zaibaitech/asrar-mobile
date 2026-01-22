/**
 * Adhan Settings Screen
 * Configure prayer time notifications and adhan preferences
 */

import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    View,
} from 'react-native';
import { SimpleSlider } from '../components/SimpleSlider';
import { DarkTheme, Spacing, Typography } from '../constants/DarkTheme';
import { useLanguage } from '../contexts/LanguageContext';
import {
    AdhanSettings,
    cancelAllPrayerNotifications,
    getAdhanDiagnostics,
    getAdhanSettings,
    getScheduledNotificationsCount,
    saveAdhanSettings,
    scheduleTestPrayerNotification,
} from '../services/AdhanNotificationService';

export default function AdhanSettingsScreen() {
  const { t } = useLanguage();
  const [settings, setSettings] = useState<AdhanSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [scheduledCount, setScheduledCount] = useState<number>(0);
  const [diagnostics, setDiagnostics] = useState<Record<string, unknown> | null>(null);
  const [diagLoading, setDiagLoading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    if (!loading) {
      void refreshDiagnostics();
    }
  }, [loading]);

  const loadSettings = async () => {
    try {
      const saved = await getAdhanSettings();
      setSettings(saved);
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshDiagnostics = async () => {
    setDiagLoading(true);
    try {
      const [count, diag] = await Promise.all([
        getScheduledNotificationsCount(),
        getAdhanDiagnostics(),
      ]);
      setScheduledCount(count);
      setDiagnostics(diag);
    } finally {
      setDiagLoading(false);
    }
  };

  const updateSetting = async <K extends keyof AdhanSettings>(
    key: K,
    value: AdhanSettings[K]
  ) => {
    if (!settings) return;

    const updated = { ...settings, [key]: value };
    setSettings(updated);
    await saveAdhanSettings({ [key]: value });

    // If disabling notifications, cancel all
    if (key === 'enabled' && !value) {
      await cancelAllPrayerNotifications();
      await refreshDiagnostics();
    }
  };

  if (loading || !settings) {
    return (
      <LinearGradient colors={['#0f172a', '#1e1b4b', '#1A1625']} style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading settings...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#0f172a', '#1e1b4b', '#1A1625']} style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🕌 {t('adhanSettings.title')}</Text>
          <Text style={styles.headerSubtitle}>{t('adhanSettings.subtitle')}</Text>
        </View>

        {/* Master Toggle */}
        <View style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>{t('adhanSettings.enable.title')}</Text>
              <Text style={styles.settingDescription}>
                {t('adhanSettings.enable.desc')}
              </Text>
            </View>
            <Switch
              value={settings.enabled}
              onValueChange={(value) => updateSetting('enabled', value)}
              trackColor={{ false: '#3e3e3e', true: '#64B5F6' }}
              thumbColor={settings.enabled ? '#ffffff' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Prayer Selection */}
        {settings.enabled && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>{t('adhanSettings.prayersToNotify.title')}</Text>
            
            {[
              { key: 'notifyFajr' as const, name: 'Fajr', arabic: 'الفجر', icon: '🌅' },
              { key: 'notifyDhuhr' as const, name: 'Dhuhr', arabic: 'الظهر', icon: '☀️' },
              { key: 'notifyAsr' as const, name: 'Asr', arabic: 'العصر', icon: '🌤️' },
              { key: 'notifyMaghrib' as const, name: 'Maghrib', arabic: 'المغرب', icon: '🌆' },
              { key: 'notifyIsha' as const, name: 'Isha', arabic: 'العشاء', icon: '🌙' },
            ].map((prayer) => (
              <View key={prayer.key} style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={styles.prayerName}>
                    {prayer.icon} {prayer.name} {prayer.arabic}
                  </Text>
                </View>
                <Switch
                  value={settings[prayer.key]}
                  onValueChange={(value) => updateSetting(prayer.key, value)}
                  trackColor={{ false: '#3e3e3e', true: '#64B5F6' }}
                  thumbColor={settings[prayer.key] ? '#ffffff' : '#f4f3f4'}
                />
              </View>
            ))}
          </View>
        )}

        {/* Sound Settings */}
        {settings.enabled && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>{t('adhanSettings.sound.title')}</Text>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>{t('adhanSettings.sound.playSound')}</Text>
                <Text style={styles.settingDescription}>{t('adhanSettings.sound.playSoundDesc')}</Text>
              </View>
              <Switch
                value={settings.playSound}
                onValueChange={(value) => updateSetting('playSound', value)}
                trackColor={{ false: '#3e3e3e', true: '#64B5F6' }}
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>{t('adhanSettings.sound.vibrate')}</Text>
                <Text style={styles.settingDescription}>{t('adhanSettings.sound.vibrateDesc')}</Text>
              </View>
              <Switch
                value={settings.vibrate}
                onValueChange={(value) => updateSetting('vibrate', value)}
                trackColor={{ false: '#3e3e3e', true: '#64B5F6' }}
              />
            </View>

            {settings.playSound && (
              <View style={styles.sliderContainer}>
                <Text style={styles.settingTitle}>
                  {t('adhanSettings.sound.volume', { value: Math.round(settings.volume * 100) })}
                </Text>
                <SimpleSlider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={1}
                  value={settings.volume}
                  onValueChange={(value) => updateSetting('volume', value)}
                  minimumTrackTintColor="#64B5F6"
                  maximumTrackTintColor="#3e3e3e"
                  thumbTintColor="#ffffff"
                />
              </View>
            )}
          </View>
        )}

        {/* Adhan Selection */}
        {settings.enabled && settings.playSound && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>{t('adhanSettings.selection.title')}</Text>

            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>{t('adhanSettings.selection.fajr')}</Text>
              <View style={styles.pickerContainer}>
                {['default', 'mishary', 'mecca', 'medina'].map((option) => (
                  <Pressable
                    key={option}
                    style={[
                      styles.pickerOption,
                      settings.fajrAdhan === option && styles.pickerOptionSelected,
                    ]}
                    onPress={() => updateSetting('fajrAdhan', option as any)}
                  >
                    <Text
                      style={[
                        styles.pickerOptionText,
                        settings.fajrAdhan === option && styles.pickerOptionTextSelected,
                      ]}
                    >
                      {t(`adhanSettings.adhanOption.${option}`)}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={[styles.settingInfo, { marginTop: Spacing.lg }]}>
              <Text style={styles.settingTitle}>{t('adhanSettings.selection.otherPrayers')}</Text>
              <View style={styles.pickerContainer}>
                {['default', 'mishary', 'mecca', 'medina'].map((option) => (
                  <Pressable
                    key={option}
                    style={[
                      styles.pickerOption,
                      settings.otherAdhan === option && styles.pickerOptionSelected,
                    ]}
                    onPress={() => updateSetting('otherAdhan', option as any)}
                  >
                    <Text
                      style={[
                        styles.pickerOptionText,
                        settings.otherAdhan === option && styles.pickerOptionTextSelected,
                      ]}
                    >
                      {t(`adhanSettings.adhanOption.${option}`)}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Reminder */}
        {settings.enabled && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>{t('adhanSettings.reminder.title')}</Text>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>
                {t('adhanSettings.reminder.value', { minutes: settings.reminderMinutes })}
              </Text>
              <Text style={styles.settingDescription}>{t('adhanSettings.reminder.zeroHint')}</Text>
              <SimpleSlider
                style={styles.slider}
                minimumValue={0}
                maximumValue={30}
                value={settings.reminderMinutes}
                onValueChange={(value) => {
                  // Round to nearest 5 minutes
                  const rounded = Math.round(value / 5) * 5;
                  updateSetting('reminderMinutes', rounded);
                }}
                minimumTrackTintColor="#64B5F6"
                maximumTrackTintColor="#3e3e3e"
                thumbTintColor="#ffffff"
              />
            </View>
          </View>
        )}

        {/* Diagnostics */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Diagnostics</Text>
          <Text style={styles.settingDescription}>
            Use this to confirm notifications are scheduled in the installed APK (not Expo Go).
          </Text>

          <View style={{ height: Spacing.md }} />

          <Text style={styles.settingTitle}>Scheduled prayer notifications: {scheduledCount}</Text>
          <Text style={styles.settingDescription}>
            Permission: {String(diagnostics?.permissionStatus ?? 'unknown')}
          </Text>
          {diagnostics?.lastScheduledAt ? (
            <Text style={styles.settingDescription}>
              Last schedule attempt: {String(diagnostics.lastScheduledAt)}
            </Text>
          ) : null}
          {diagnostics?.lastErrorAt ? (
            <Text style={[styles.settingDescription, { color: '#FCA5A5' }]}>
              Last error: {String(diagnostics.lastErrorAt)} — {String(diagnostics.error ?? '')}
            </Text>
          ) : null}

          <View style={{ height: Spacing.md }} />

          <Pressable
            style={[styles.diagButton, diagLoading && { opacity: 0.7 }]}
            disabled={diagLoading}
            onPress={() => refreshDiagnostics()}
          >
            <Text style={styles.diagButtonText}>Refresh</Text>
          </Pressable>

          <Pressable
            style={[styles.diagButton, { backgroundColor: 'rgba(100, 181, 246, 0.25)' }, diagLoading && { opacity: 0.7 }]}
            disabled={diagLoading}
            onPress={async () => {
              await scheduleTestPrayerNotification(10);
              await refreshDiagnostics();
            }}
          >
            <Text style={styles.diagButtonText}>Send test notification (10s)</Text>
          </Pressable>

          <Pressable
            style={[styles.diagButton, { backgroundColor: 'rgba(239, 68, 68, 0.2)' }, diagLoading && { opacity: 0.7 }]}
            disabled={diagLoading}
            onPress={async () => {
              await cancelAllPrayerNotifications();
              await refreshDiagnostics();
            }}
          >
            <Text style={styles.diagButtonText}>Cancel prayer notifications</Text>
          </Pressable>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: DarkTheme.textSecondary,
    fontSize: Typography.body,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.screenPadding,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  headerTitle: {
    fontSize: Typography.h1,
    fontWeight: Typography.weightBold,
    color: DarkTheme.textPrimary,
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    fontSize: Typography.body,
    color: DarkTheme.textSecondary,
  },
  card: {
    backgroundColor: 'rgba(45, 21, 21, 0.5)',
    borderRadius: 16,
    padding: Spacing.cardPadding,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  sectionTitle: {
    fontSize: Typography.h3,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
    marginBottom: Spacing.md,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  settingInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  settingTitle: {
    fontSize: Typography.body,
    fontWeight: Typography.weightMedium,
    color: DarkTheme.textPrimary,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: Typography.caption,
    color: DarkTheme.textTertiary,
  },
  prayerName: {
    fontSize: Typography.body,
    fontWeight: Typography.weightMedium,
    color: DarkTheme.textPrimary,
  },
  sliderContainer: {
    marginTop: Spacing.md,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  pickerOption: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  pickerOptionSelected: {
    backgroundColor: '#64B5F6',
    borderColor: '#64B5F6',
  },
  pickerOptionText: {
    fontSize: Typography.label,
    color: DarkTheme.textSecondary,
    fontWeight: Typography.weightMedium,
  },
  pickerOptionTextSelected: {
    color: '#ffffff',
    fontWeight: Typography.weightBold,
  },

  diagButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    marginTop: Spacing.sm,
  },
  diagButtonText: {
    color: DarkTheme.textPrimary,
    fontSize: Typography.label,
    fontWeight: Typography.weightSemibold,
    textAlign: 'center',
  },
});
