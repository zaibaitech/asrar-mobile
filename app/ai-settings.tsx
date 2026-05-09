/**
 * AI Settings Screen
 * ==================
 * Phase 6: User controls for optional AI assistance
 * 
 * AI is OFF by default. User must explicitly enable.
 */

import AsrarLogo, { ElementType } from '@/components/AsrarLogo';
import Colors from '@/constants/Colors';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProfile } from '@/contexts/ProfileContext';
import {
    isAIAvailable,
    loadAISettings,
    saveAISettings,
} from '@/services/AIReflectionService';
import { AISettings, AITone } from '@/types/ai-settings';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
    useColorScheme,
} from 'react-native';

const TONE_ICONS: Record<AITone, string> = {
  concise: 'flash',
  calm: 'leaf',
  reflective: 'bulb',
  poetic: 'sparkles',
};
const TONE_VALUES: AITone[] = ['concise', 'calm', 'reflective', 'poetic'];

export default function AISettingsScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { profile } = useProfile();
  const { t } = useLanguage();
  const logoElement = (profile.derived?.element ?? 'aether') as ElementType;
  
  const [settings, setSettings] = useState<AISettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiAvailable, setAiAvailable] = useState(false);
  
  useEffect(() => {
    loadSettings();
    checkAIAvailability();
  }, []);
  
  const checkAIAvailability = async () => {
    const available = await isAIAvailable();
    console.log('[AI Settings] AI Available:', available);
    setAiAvailable(available);
  };
  
  const loadSettings = async () => {
    try {
      const data = await loadAISettings();
      console.log('[AI Settings] Loaded settings:', data);
      setSettings(data);
    } catch (error) {
      console.error('[AI Settings] Error loading settings:', error);
      Alert.alert(t('common.error'), t('aiSettingsScreen.errors.loadFailed'));
    } finally {
      setLoading(false);
    }
  };
  
  const handleToggleAI = async (enabled: boolean) => {
    console.log('[AI Settings] Toggle clicked, enabled:', enabled);
    if (!settings) return;
    
    if (enabled && !settings.disclaimerAcknowledged) {
      console.log('[AI Settings] Showing disclaimer...');
      Alert.alert(
        t('aiSettingsScreen.disclaimer.title'),
        t('aiSettingsScreen.disclaimer.body'),
        [
          { text: t('aiSettingsScreen.disclaimer.cancel'), style: 'cancel' },
          {
            text: t('aiSettingsScreen.disclaimer.enable'),
            onPress: async () => {
              console.log('[AI Settings] User accepted disclaimer');
              const updated: AISettings = {
                ...settings,
                enabled: true,
                disclaimerAcknowledged: true,
              };
              setSettings(updated);
              await saveAISettings(updated);
              console.log('[AI Settings] Settings saved:', updated);
            },
          },
        ]
      );
    } else {
      console.log('[AI Settings] Updating enabled state to:', enabled);
      const updated: AISettings = {
        ...settings,
        enabled,
      };
      setSettings(updated);
      await saveAISettings(updated);
      console.log('[AI Settings] Settings saved:', updated);
    }
  };
  
  const handleSelectTone = async (tone: AITone) => {
    if (!settings) return;
    
    const updated: AISettings = {
      ...settings,
      tone,
    };
    setSettings(updated);
    await saveAISettings(updated);
  };
  
  if (loading || !settings) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            {t('aiSettingsScreen.loadingSettings')}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.logoWrapper}>
          <AsrarLogo
            size={28}
            variant="icon"
            element={logoElement}
            mono={colorScheme === 'dark'}
            monoVariant={colorScheme === 'dark' ? 'dark' : 'light'}
          />
        </View>
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {t('aiSettingsScreen.headerTitle')}
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            {t('aiSettingsScreen.headerSubtitle')}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* AI Availability Notice */}
        {!aiAvailable && (
          <View style={[styles.noticeCard, { backgroundColor: '#fef3c7' }]}>
            <Ionicons name="information-circle" size={20} color="#92400e" />
            <Text style={[styles.noticeText, { color: '#92400e' }]}>
              {t('aiSettingsScreen.unavailableNotice')}
            </Text>
          </View>
        )}

        {/* Main Toggle */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={styles.toggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.toggleTitle, { color: colors.text }]}>
                {t('aiSettingsScreen.toggle.title')}
              </Text>
              <Text style={[styles.toggleDesc, { color: colors.textSecondary }]}>
                {t('aiSettingsScreen.toggle.desc')}
              </Text>
              {!aiAvailable && (
                <Text style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>
                  {t('aiSettingsScreen.aiUnavailable')}
                </Text>
              )}
            </View>
            <Switch
              value={settings.enabled}
              onValueChange={(value) => {
                console.log('[AI Settings] Switch tapped! New value:', value);
                console.log('[AI Settings] AI Available:', aiAvailable);
                console.log('[AI Settings] Current settings:', settings);
                handleToggleAI(value);
              }}
              trackColor={{ false: '#767577', true: '#6366f1' }}
              thumbColor={settings.enabled ? '#fff' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              style={{ transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }] }}
            />
          </View>
        </View>
        
        {/* What AI Does */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            {t('aiSettingsScreen.whatAIDoes.title')}
          </Text>

          <View style={styles.benefitList}>
            {(['item1', 'item2', 'item3', 'item4'] as const).map((item) => (
              <View key={item} style={styles.benefitRow}>
                <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                <Text style={[styles.benefitText, { color: colors.textSecondary }]}>
                  {t(`aiSettingsScreen.whatAIDoes.${item}`)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* What AI Doesn't Do */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            {t('aiSettingsScreen.whatAIDoesNot.title')}
          </Text>

          <View style={styles.limitList}>
            {(['item1', 'item2', 'item3', 'item4'] as const).map((item) => (
              <View key={item} style={styles.limitRow}>
                <Ionicons name="close-circle" size={20} color="#ef4444" />
                <Text style={[styles.limitText, { color: colors.textSecondary }]}>
                  {t(`aiSettingsScreen.whatAIDoesNot.${item}`)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Tone Selection */}
        {settings.enabled && (
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              {t('aiSettingsScreen.tonePreference.title')}
            </Text>

            <View style={styles.toneGrid}>
              {TONE_VALUES.map((tone) => (
                <TouchableOpacity
                  key={tone}
                  style={[
                    styles.toneButton,
                    {
                      backgroundColor:
                        settings.tone === tone
                          ? `${colors.primary}20`
                          : colorScheme === 'dark'
                          ? '#0f1419'
                          : '#fafafa',
                      borderColor:
                        settings.tone === tone
                          ? colors.primary
                          : colors.border,
                    },
                  ]}
                  onPress={() => handleSelectTone(tone)}
                >
                  <Ionicons
                    name={TONE_ICONS[tone] as any}
                    size={24}
                    color={settings.tone === tone ? colors.primary : colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.toneLabel,
                      {
                        color: settings.tone === tone ? colors.text : colors.textSecondary,
                        fontWeight: settings.tone === tone ? '600' : '400',
                      },
                    ]}
                  >
                    {t(`aiSettingsScreen.tonePreference.${tone}`)}
                  </Text>
                  <Text style={[styles.toneDesc, { color: colors.textSecondary }]}>
                    {t(`aiSettingsScreen.tonePreference.${tone}Desc`)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Privacy Notice */}
        <View style={[styles.card, { backgroundColor: '#f0f9ff' }]}>
          <View style={styles.privacyHeader}>
            <Ionicons name="shield-checkmark" size={24} color="#1e40af" />
            <Text style={[styles.privacyTitle, { color: '#1e40af' }]}>
              {t('aiSettingsScreen.privacy.title')}
            </Text>
          </View>

          <Text style={[styles.privacyText, { color: '#1e40af' }]}>
            {t('aiSettingsScreen.privacy.body')}
          </Text>
        </View>

        {/* Reset Button */}
        {settings.enabled && (
          <TouchableOpacity
            style={[styles.resetButton, { borderColor: colors.textSecondary }]}
            onPress={() => {
              Alert.alert(
                t('aiSettingsScreen.reset.title'),
                t('aiSettingsScreen.reset.message'),
                [
                  { text: t('aiSettingsScreen.reset.cancel'), style: 'cancel' },
                  {
                    text: t('aiSettingsScreen.reset.confirm'),
                    style: 'destructive',
                    onPress: async () => {
                      const updated: AISettings = {
                        enabled: false,
                        tone: 'calm',
                        disclaimerAcknowledged: false,
                        updatedAt: Date.now(),
                      };
                      setSettings(updated);
                      await saveAISettings(updated);
                    },
                  },
                ]
              );
            }}
          >
            <Ionicons name="refresh" size={18} color={colors.text} />
            <Text style={[styles.resetButtonText, { color: colors.text }]}>
              {t('aiSettingsScreen.reset.button')}
            </Text>
          </TouchableOpacity>
        )}
        
        {/* Bottom Padding */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 16,
  },
  logoWrapper: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    flex: 1,
    gap: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 16,
  },
  noticeCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 14,
    borderRadius: 12,
  },
  noticeText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '500',
  },
  card: {
    padding: 20,
    borderRadius: 16,
    gap: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  toggleTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  toggleDesc: {
    fontSize: 13,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  benefitList: {
    gap: 12,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  benefitText: {
    flex: 1,
    fontSize: 14,
  },
  limitList: {
    gap: 12,
  },
  limitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  limitText: {
    flex: 1,
    fontSize: 14,
  },
  toneGrid: {
    gap: 12,
  },
  toneButton: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    gap: 6,
    alignItems: 'center',
  },
  toneLabel: {
    fontSize: 14,
  },
  toneDesc: {
    fontSize: 11,
    textAlign: 'center',
  },
  privacyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  privacyTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  privacyText: {
    fontSize: 13,
    lineHeight: 22,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 12,
    borderWidth: 2,
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
