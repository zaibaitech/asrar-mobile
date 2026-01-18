/**
 * Unified Notification Settings Screen
 * Centralizes all notification preferences across all categories
 */

import DivineTimingNotificationService from '@/services/DivineTimingNotificationService';
import HarmonyHourNotificationService from '@/services/HarmonyHourNotificationService';
import NotificationService from '@/services/NotificationService';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function NotificationSettingsScreen() {
  const [preferences, setPreferences] = useState<any>(null);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPreferences();
    checkPermissions();
  }, []);

  async function loadPreferences() {
    try {
      const prefs = await NotificationService.getNotificationPreferences();
      setPreferences(prefs);
    } catch (error) {
      console.error('Failed to load preferences:', error);
    } finally {
      setLoading(false);
    }
  }

  async function checkPermissions() {
    const { status } = await Notifications.getPermissionsAsync();
    setPermissionsGranted(status === 'granted');
  }

  async function requestPermissions() {
    const { status } = await Notifications.requestPermissionsAsync();
    setPermissionsGranted(status === 'granted');
    
    if (status !== 'granted') {
      Alert.alert(
        'Permissions Required',
        'Please enable notifications in your device settings to receive spiritual guidance and prayer reminders.',
        [{ text: 'OK' }]
      );
    }
  }

  async function updatePreference(category: string, key: string, value: any) {
    if (!preferences) return;

    const updated = {
      ...preferences,
      [category]: {
        ...preferences[category],
        [key]: value,
      },
    };

    setPreferences(updated);
    await NotificationService.saveNotificationPreferences(updated);

    // Reschedule notifications if enabled state changed
    if (key === 'enabled') {
      if (category === 'harmony' && value) {
        await HarmonyHourNotificationService.scheduleHarmonyNotifications();
      } else if (category === 'divineTiming' && value) {
        await DivineTimingNotificationService.scheduleMorningBriefing();
        await DivineTimingNotificationService.scheduleElementAlignmentAlerts();
      }
    }
  }

  if (loading || !preferences) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading preferences...</Text>
      </View>
    );
  }

  if (!permissionsGranted) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionCard}>
          <Ionicons name="notifications-off-outline" size={64} color="#999" />
          <Text style={styles.permissionTitle}>Notifications Disabled</Text>
          <Text style={styles.permissionText}>
            Enable notifications to receive prayer reminders, harmony hour alerts, and spiritual guidance
          </Text>
          <TouchableOpacity style={styles.enableButton} onPress={requestPermissions}>
            <Text style={styles.enableButtonText}>Enable Notifications</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Prayer Notifications */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="moon-outline" size={24} color="#64B5F6" />
          <Text style={styles.sectionTitle}>Prayer Notifications</Text>
        </View>
        
        <Text style={styles.infoText}>
          Prayer notifications are managed in Adhan Settings
        </Text>
            
      </View>

      {/* Harmony Hours */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="star-outline" size={24} color="#FFB74D" />
          <Text style={styles.sectionTitle}>Harmony Hours</Text>
        </View>
        
        <SettingRow
          label="Enable Harmony Notifications"
          value={preferences.harmony.enabled}
          onValueChange={(val) => updatePreference('harmony', 'enabled', val)}
        />
        
        {preferences.harmony.enabled && (
          <>
            <SettingRow
              label="Favorable Hours"
              value={preferences.harmony.notifyFavorable}
              onValueChange={(val) => updatePreference('harmony', 'notifyFavorable', val)}
              subtitle="Notify when highly favorable timing begins"
            />
            <SettingRow
              label="Transformative Hours"
              value={preferences.harmony.notifyTransformative}
              onValueChange={(val) => updatePreference('harmony', 'notifyTransformative', val)}
              subtitle="Notify for growth opportunities"
            />
            <SettingRow
              label="Delicate Periods"
              value={preferences.harmony.notifyDelicate}
              onValueChange={(val) => updatePreference('harmony', 'notifyDelicate', val)}
              subtitle="Warn about challenging periods"
            />
            
          </>
        )}
      </View>

      {/* Divine Timing */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="sunny-outline" size={24} color="#FFA726" />
          <Text style={styles.sectionTitle}>Divine Timing</Text>
        </View>
        
        <SettingRow
          label="Enable Divine Timing"
          value={preferences.timing.enabled}
          onValueChange={(val) => updatePreference('timing', 'enabled', val)}
        />
        
        {preferences.timing.enabled && (
          <>
            <SettingRow
              label="Morning Spiritual Briefing"
              value={preferences.timing.morningBriefing}
              onValueChange={(val) => updatePreference('timing', 'morningBriefing', val)}
              subtitle={`Daily energy at ${preferences.timing.morningBriefingTime}`}
            />
            <SettingRow
              label="Element Alignment Alerts"
              value={preferences.timing.elementalAlignment}
              onValueChange={(val) => updatePreference('timing', 'elementalAlignment', val)}
              subtitle="When your element is powerfully activated"
            />
            
          </>
        )}
      </View>

      {/* Quiet Hours */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="moon" size={24} color="#9575CD" />
          <Text style={styles.sectionTitle}>Quiet Hours</Text>
        </View>
        
        <Text style={styles.infoText}>
          No notifications (except prayers) between {preferences.general.quietHoursStart} - {preferences.general.quietHoursEnd}
        </Text>
      </View>

      {/* Daily Limit */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="timer-outline" size={24} color="#4DB6AC" />
          <Text style={styles.sectionTitle}>Rate Limiting</Text>
        </View>
        
        <Text style={styles.infoText}>
          Maximum {preferences.general.maxNotificationsPerDay} notifications per day to avoid overwhelm
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Notifications use your device's Do Not Disturb settings
        </Text>
      </View>
    </ScrollView>
  );
}

interface SettingRowProps {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  subtitle?: string;
}

function SettingRow({ label, value, onValueChange, subtitle }: SettingRowProps) {
  return (
    <View style={styles.settingRow}>
      <View style={styles.settingText}>
        <Text style={styles.settingLabel}>{label}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#767577', true: '#64B5F6' }}
        thumbColor={value ? '#fff' : '#f4f3f4'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 100,
    fontSize: 16,
    color: '#666',
  },
  permissionCard: {
    margin: 20,
    padding: 30,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  permissionText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  enableButton: {
    backgroundColor: '#64B5F6',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  enableButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingText: {
    flex: 1,
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  footer: {
    marginTop: 20,
    marginBottom: 40,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});
