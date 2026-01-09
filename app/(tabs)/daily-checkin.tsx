/**
 * Daily Check-In Screen — V2 Ritual Flow
 * ========================================
 * Redesigned as a calm 60-second daily spiritual ritual
 * 
 * Structure:
 * 1. Daily Alignment (collapsible, read-only, inspirational)
 * 2. Inner State (energy + mood chips + optional note)
 * 3. Intention Setting (focused and minimal)
 * 4. Complete Ritual (clean button with animation)
 * 
 * Philosophy:
 * - Progressive flow, not stacked cards
 * - Calm and clear, not dense
 * - Guided micro-copy
 * - Spiritually meaningful
 * - Quick to complete
 */

import { SimpleSlider } from '@/components/SimpleSlider';
import { DarkTheme, Spacing, Typography } from '@/constants/DarkTheme';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProfile } from '@/contexts/ProfileContext';
import { loadUserTimingProfile, saveCheckIn as saveEnhancedCheckIn } from '@/services/CheckInStorage';
import { DailyGuidance, getDailyGuidance } from '@/services/DailyGuidanceService';
import { AsrarTimingSnapshot, buildAsrarTimingSnapshot } from '@/services/DivineTimingAsrarService';
import { getIntentionDisplayName } from '@/services/DivineTimingService';
import { getPlanetPositions } from '@/services/EphemerisService';
import { getTimeSegmentFromDate } from '@/services/IlmNujumMapping';
import { IntentionCategory, UserAbjadResult } from '@/types/divine-timing';
import { CheckInRecord } from '@/types/divine-timing-personal';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Animated,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

// Gold accent color for spiritual moments
const GOLD_ACCENT = '#D4AF37';

// Placeholder user Abjad (will be replaced with real profile data)
const PLACEHOLDER_USER_ABJAD: UserAbjadResult = {
  kabir: 786,
  saghir: 3,
  hadad: 2,
  dominantElement: 'fire',
};

// Mood/State chips
type MoodState = 'calm' | 'heavy' | 'motivated' | 'scattered' | 'grateful' | 'anxious' | 'centered' | 'tired';

const MOOD_OPTIONS: { key: MoodState; icon: string; label: string }[] = [
  { key: 'calm', icon: '🕊️', label: 'Calm' },
  { key: 'motivated', icon: '⚡', label: 'Motivated' },
  { key: 'grateful', icon: '🤲', label: 'Grateful' },
  { key: 'centered', icon: '🧘', label: 'Centered' },
  { key: 'scattered', icon: '🌀', label: 'Scattered' },
  { key: 'heavy', icon: '🌧️', label: 'Heavy' },
  { key: 'anxious', icon: '😰', label: 'Anxious' },
  { key: 'tired', icon: '😴', label: 'Tired' },
];

// Intention categories (focused)
const INTENTION_CATEGORIES: IntentionCategory[] = [
  'start',
  'communication',
  'relationship',
  'study',
];

const INTENTION_ICONS: Record<IntentionCategory, keyof typeof Ionicons.glyphMap> = {
  start: 'play-circle-outline',
  travel: 'airplane-outline',
  communication: 'chatbubble-outline',
  relationship: 'people-outline',
  study: 'book-outline',
  rest: 'moon-outline',
  custom: 'ellipsis-horizontal-circle-outline',
};

// Helper to get element emoji
function getElementEmoji(element?: string): string {
  const map: Record<string, string> = {
    fire: '🔥',
    water: '💧',
    air: '🌬️',
    earth: '🌱',
  };
  return element ? (map[element] || '✨') : '✨';
}

export default function DailyCheckInV2Screen() {
  const { t } = useLanguage();
  const { profile } = useProfile();
  
  // State
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const [selectedMood, setSelectedMood] = useState<MoodState | null>(null);
  const [energy, setEnergy] = useState(70);
  const [selectedIntention, setSelectedIntention] = useState<IntentionCategory | null>(null);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [completed, setCompleted] = useState(false);
  
  // Data
  const [timingSnapshot, setTimingSnapshot] = useState<AsrarTimingSnapshot | null>(null);
  const [dailyGuidance, setDailyGuidance] = useState<DailyGuidance | null>(null);
  
  // Animations
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.95));
  
  useEffect(() => {
    loadData();
    animateIn();
  }, []);
  
  useEffect(() => {
    if (!profile) return;
    
    const snapshot = buildAsrarTimingSnapshot({
      userProfile: profile,
      userAbjad: PLACEHOLDER_USER_ABJAD,
      intention: selectedIntention,
    });
    setTimingSnapshot(snapshot);
  }, [profile, selectedIntention]);
  
  const loadData = async () => {
    // Load daily guidance
    const guidance = await getDailyGuidance(profile || undefined);
    setDailyGuidance(guidance);
  };
  
  const animateIn = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  };
  
  const handleMoodSelect = async (mood: MoodState) => {
    setSelectedMood(mood);
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
  };
  
  const handleIntentionSelect = async (intention: IntentionCategory) => {
    setSelectedIntention(intention);
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
  };
  
  const handleComplete = async () => {
    if (!selectedIntention || !selectedMood) return;
    
    setSaving(true);
    
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}
    
    try {
      const now = new Date();
      const dateISO = now.toISOString().split('T')[0];
      const profile = await loadUserTimingProfile();
      const segment = getTimeSegmentFromDate(now);
      const positions = await getPlanetPositions(now, profile.timezone);
      
      const checkInEntry: CheckInRecord = {
        id: `${dateISO}-${now.getTime()}`,
        createdAt: now.getTime(),
        localDayKey: dateISO,
        intentionKey: selectedIntention,
        note: note.trim() || undefined,
        timeSegment: segment,
        energy,
        planetarySnapshot: positions || undefined,
        timingSnapshot: {
          timingQuality: (dailyGuidance?.timingQuality === 'transformative' ? 'delicate' : dailyGuidance?.timingQuality) || 'neutral',
          cycleState: 'initiation',
          elementalTone: dailyGuidance?.dayElement || 'earth',
          guidanceLevel: 'act',
          shortMessage: '',
        },
        // Store mood in note if needed
      };
      
      await saveEnhancedCheckIn(checkInEntry);
      
      setCompleted(true);
      
      // Auto-close after success
      setTimeout(() => {
        router.back();
      }, 2000);
    } catch (error) {
      if (__DEV__) {
        console.error('[CheckIn] Save error:', error);
      }
    } finally {
      setSaving(false);
    }
  };
  
  const canComplete = selectedIntention && selectedMood && !saving && !completed;
  
  return (
    <View style={styles.container}>
      <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Step 1: Daily Alignment (collapsible) */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => setDetailsExpanded(!detailsExpanded)}
              activeOpacity={0.7}
            >
              <View style={styles.stepBadge}>
                <Text style={styles.stepNumber}>1</Text>
              </View>
              <View style={styles.sectionTitleContainer}>
                <Text style={styles.sectionTitle}>{t('dailyCheckIn.ritual.step1.title')}</Text>
                <Text style={styles.sectionSubtitle}>{t('dailyCheckIn.ritual.step1.subtitle')}</Text>
              </View>
              <Ionicons
                name={detailsExpanded ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={DarkTheme.textSecondary}
              />
            </TouchableOpacity>
            
            {/* Quick summary (always visible) */}
            {timingSnapshot && (
              <LinearGradient
                colors={['rgba(139, 115, 85, 0.15)', 'rgba(139, 115, 85, 0.05)']}
                style={styles.alignmentCard}
              >
                <View style={styles.alignmentRow}>
                  <View style={styles.alignmentItem}>
                    <Text style={styles.alignmentIcon}>☀️</Text>
                    <Text style={styles.alignmentLabel}>{t(timingSnapshot.day.translationKey)}</Text>
                  </View>
                  <View style={styles.alignmentDivider} />
                  <View style={styles.alignmentItem}>
                    <Text style={styles.alignmentIcon}>
                      {timingSnapshot.elements.zahir?.element ? getElementEmoji(timingSnapshot.elements.zahir.element) : '✨'}
                    </Text>
                    <Text style={styles.alignmentLabel}>
                      {timingSnapshot.elements.zahir
                        ? t(timingSnapshot.elements.zahir.translationKey)
                        : t('dailyCheckIn.elements.zahirMissing')}
                    </Text>
                  </View>
                </View>
                
                {/* Harmony score */}
                <View style={styles.harmonyRow}>
                  <Text style={styles.harmonyLabel}>{t('dailyCheckIn.labels.harmony')}</Text>
                  <View style={styles.harmonyScoreContainer}>
                    <View style={styles.harmonyRing}>
                      <Text style={styles.harmonyScore}>
                        {Math.round(timingSnapshot.elements.alignment.alignment.harmonyScore)}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.harmonyQuality}>
                    {t(timingSnapshot.elements.alignment.qualityKey)}
                  </Text>
                </View>
                
                {/* One-line guidance */}
                {dailyGuidance && (
                  <Text style={styles.guidanceLine}>
                    {t(dailyGuidance.messageKey, dailyGuidance.messageParams)}
                  </Text>
                )}
              </LinearGradient>
            )}
            
            {/* Expanded details */}
            {detailsExpanded && timingSnapshot && (
              <View style={styles.expandedDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>{t('dailyCheckIn.labels.cycleTone')}</Text>
                  <Text style={styles.detailValue}>{t(timingSnapshot.cycle.stateKey)}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>{t('dailyCheckIn.labels.batin')}</Text>
                  <Text style={styles.detailValue}>
                    {timingSnapshot.elements.batin
                      ? t(timingSnapshot.elements.batin.translationKey)
                      : t('dailyCheckIn.elements.batinMissing')}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>{t('dailyCheckIn.labels.hourElement')}</Text>
                  <Text style={styles.detailValue}>
                    {timingSnapshot.hour.raw.planetArabic} • {timingSnapshot.hour.raw.planet}
                  </Text>
                </View>
              </View>
            )}
          </View>
          
          {/* Step 2: Inner State */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepNumber}>2</Text>
              </View>
              <View style={styles.sectionTitleContainer}>
                <Text style={styles.sectionTitle}>{t('dailyCheckIn.ritual.step2.title')}</Text>
                <Text style={styles.sectionSubtitle}>{t('dailyCheckIn.ritual.step2.subtitle')}</Text>
              </View>
            </View>
            
            <View style={styles.card}>
              {/* Mood chips */}
              <Text style={styles.fieldLabel}>{t('dailyCheckIn.ritual.mood.label')}</Text>
              <Text style={styles.fieldHint}>{t('dailyCheckIn.ritual.mood.hint')}</Text>
              <View style={styles.moodGrid}>
                {MOOD_OPTIONS.map((mood) => {
                  const isSelected = selectedMood === mood.key;
                  return (
                    <TouchableOpacity
                      key={mood.key}
                      style={[
                        styles.moodChip,
                        isSelected && styles.moodChipSelected,
                      ]}
                      onPress={() => handleMoodSelect(mood.key)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.moodIcon}>{mood.icon}</Text>
                      <Text style={[styles.moodLabel, isSelected && styles.moodLabelSelected]}>
                        {mood.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              
              {/* Energy slider */}
              <View style={styles.energySection}>
                <View style={styles.energyDisplay}>
                  <Text style={styles.energyValue}>{Math.round(energy)}%</Text>
                  <Text style={styles.energyLabel}>{t('dailyCheckIn.ritual.energy.label')}</Text>
                </View>
                <SimpleSlider
                  value={energy}
                  onValueChange={setEnergy}
                  minimumValue={0}
                  maximumValue={100}
                  minimumTrackTintColor={GOLD_ACCENT}
                  maximumTrackTintColor="rgba(255, 255, 255, 0.1)"
                  thumbTintColor={GOLD_ACCENT}
                  style={styles.slider}
                />
              </View>
              
              {/* Optional note */}
              <View style={styles.noteSection}>
                <Text style={styles.fieldLabel}>{t('dailyCheckIn.ritual.note.label')}</Text>
                <TextInput
                  style={styles.noteInput}
                  placeholder={t('dailyCheckIn.ritual.note.placeholder')}
                  placeholderTextColor={DarkTheme.textTertiary}
                  value={note}
                  onChangeText={setNote}
                  multiline
                  maxLength={120}
                />
                <Text style={styles.charCount}>{note.length}/120</Text>
              </View>
            </View>
          </View>
          
          {/* Step 3: Intention Setting */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepNumber}>3</Text>
              </View>
              <View style={styles.sectionTitleContainer}>
                <Text style={styles.sectionTitle}>{t('dailyCheckIn.ritual.step3.title')}</Text>
                <Text style={styles.sectionSubtitle}>{t('dailyCheckIn.ritual.step3.subtitle')}</Text>
              </View>
            </View>
            
            <View style={styles.card}>
              <View style={styles.intentionGrid}>
                {INTENTION_CATEGORIES.map((category) => {
                  const isSelected = selectedIntention === category;
                  return (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.intentionChip,
                        isSelected && styles.intentionChipSelected,
                      ]}
                      onPress={() => handleIntentionSelect(category)}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name={INTENTION_ICONS[category]}
                        size={24}
                        color={isSelected ? GOLD_ACCENT : DarkTheme.textSecondary}
                      />
                      <Text style={[styles.intentionLabel, isSelected && styles.intentionLabelSelected]}>
                        {getIntentionDisplayName(category)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              
              {/* Show selected intention */}
              {selectedIntention && (
                <View style={styles.selectedIntention}>
                  <Text style={styles.selectedIntentionLabel}>
                    {t('dailyCheckIn.ritual.intention.selected')}
                  </Text>
                  <Text style={styles.selectedIntentionValue}>
                    {getIntentionDisplayName(selectedIntention)}
                  </Text>
                </View>
              )}
            </View>
          </View>
          
          {/* Step 4: Complete Ritual */}
          <View style={styles.section}>
            <TouchableOpacity
              style={[
                styles.completeButton,
                !canComplete && styles.completeButtonDisabled,
                completed && styles.completeButtonSuccess,
              ]}
              onPress={handleComplete}
              disabled={!canComplete}
              activeOpacity={0.8}
            >
              {completed ? (
                <>
                  <Ionicons name="checkmark-circle" size={24} color="#fff" />
                  <Text style={styles.completeButtonText}>
                    {t('dailyCheckIn.ritual.complete.success')}
                  </Text>
                </>
              ) : saving ? (
                <>
                  <Ionicons name="hourglass-outline" size={24} color="#fff" />
                  <Text style={styles.completeButtonText}>
                    {t('dailyCheckIn.ritual.complete.saving')}
                  </Text>
                </>
              ) : (
                <>
                  <Ionicons name="checkmark-circle-outline" size={24} color="#fff" />
                  <Text style={styles.completeButtonText}>
                    {t('dailyCheckIn.ritual.complete.buttonAction')}
                  </Text>
                </>
              )}
            </TouchableOpacity>
            
            <Text style={styles.ritualFooter}>
              {t('dailyCheckIn.ritual.complete.footer')}
            </Text>
          </View>
          
          {/* Bottom padding */}
          <View style={{ height: 40 }} />
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DarkTheme.screenBackground,
  },
  
  // Scroll
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.xl,
    gap: Spacing.xl * 1.5,
  },
  
  // Section
  section: {
    gap: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  stepBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: GOLD_ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumber: {
    fontSize: Typography.h3,
    fontWeight: Typography.weightBold as any,
    color: DarkTheme.screenBackground,
  },
  sectionTitleContainer: {
    flex: 1,
    gap: Spacing.xs,
  },
  sectionTitle: {
    fontSize: Typography.h3,
    fontWeight: Typography.weightSemiBold as any,
    color: DarkTheme.textPrimary,
    letterSpacing: 0.3,
  },
  sectionSubtitle: {
    fontSize: Typography.caption,
    color: DarkTheme.textTertiary,
    lineHeight: Typography.caption * 1.4,
  },
  
  // Alignment card
  alignmentCard: {
    borderRadius: Spacing.lg,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  alignmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  alignmentItem: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  alignmentIcon: {
    fontSize: 32,
  },
  alignmentLabel: {
    fontSize: Typography.caption,
    color: DarkTheme.textTertiary,
    textAlign: 'center',
  },
  alignmentDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  harmonyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  harmonyLabel: {
    fontSize: Typography.label,
    color: DarkTheme.textSecondary,
    flex: 1,
  },
  harmonyScoreContainer: {
    alignItems: 'center',
  },
  harmonyRing: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(139, 115, 85, 0.2)',
    borderWidth: 2,
    borderColor: GOLD_ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  harmonyScore: {
    fontSize: Typography.h2,
    fontWeight: Typography.weightBold as any,
    color: GOLD_ACCENT,
  },
  harmonyQuality: {
    fontSize: Typography.label,
    color: DarkTheme.textSecondary,
    flex: 1,
    textAlign: 'right',
  },
  guidanceLine: {
    fontSize: Typography.label,
    color: DarkTheme.textTertiary,
    lineHeight: Typography.label * 1.6,
    fontStyle: 'italic',
    opacity: 0.8,
  },
  
  // Expanded details
  expandedDetails: {
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: Typography.label,
    color: DarkTheme.textTertiary,
  },
  detailValue: {
    fontSize: Typography.body,
    color: DarkTheme.textSecondary,
    fontWeight: Typography.weightMedium as any,
  },
  
  // Card
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: Spacing.lg,
    padding: Spacing.lg,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  
  // Mood
  fieldLabel: {
    fontSize: Typography.body,
    color: DarkTheme.textPrimary,
    fontWeight: Typography.weightMedium as any,
  },
  fieldHint: {
    fontSize: Typography.caption,
    color: DarkTheme.textTertiary,
    fontStyle: 'italic',
    marginTop: -Spacing.xs,
    marginBottom: Spacing.xs,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  moodChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  moodChipSelected: {
    backgroundColor: 'rgba(139, 115, 85, 0.2)',
    borderColor: GOLD_ACCENT,
  },
  moodIcon: {
    fontSize: 16,
  },
  moodLabel: {
    fontSize: Typography.caption,
    color: DarkTheme.textSecondary,
  },
  moodLabelSelected: {
    color: DarkTheme.textPrimary,
    fontWeight: Typography.weightMedium as any,
  },
  
  // Energy
  energySection: {
    gap: Spacing.md,
  },
  energyDisplay: {
    alignSelf: 'center',
  },
  energyValue: {
    fontSize: 48,
    fontWeight: Typography.weightBold as any,
    color: GOLD_ACCENT,
    lineHeight: 48,
  },
  energyLabel: {
    fontSize: Typography.caption,
    color: DarkTheme.textTertiary,
    marginTop: Spacing.xs,
  },
  slider: {
    height: 40,
  },
  
  // Note
  noteSection: {
    gap: Spacing.sm,
  },
  noteInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: Spacing.md,
    padding: Spacing.lg,
    fontSize: Typography.body,
    color: DarkTheme.textPrimary,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: Typography.caption,
    color: DarkTheme.textTertiary,
    textAlign: 'right',
  },
  
  // Intention
  intentionGrid: {
    gap: Spacing.md,
  },
  intentionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderRadius: Spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  intentionChipSelected: {
    backgroundColor: 'rgba(139, 115, 85, 0.15)',
    borderColor: GOLD_ACCENT,
  },
  intentionLabel: {
    fontSize: Typography.body,
    color: DarkTheme.textSecondary,
  },
  intentionLabelSelected: {
    color: DarkTheme.textPrimary,
    fontWeight: Typography.weightMedium as any,
  },
  selectedIntention: {
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    gap: Spacing.xs,
  },
  selectedIntentionLabel: {
    fontSize: Typography.caption,
    color: DarkTheme.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  selectedIntentionValue: {
    fontSize: Typography.h3,
    color: GOLD_ACCENT,
    fontWeight: Typography.weightBold as any,
  },
  
  // Complete button
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.xl * 1.2,
    borderRadius: Spacing.lg,
    backgroundColor: GOLD_ACCENT,
    shadowColor: GOLD_ACCENT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  completeButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    opacity: 0.5,
  },
  completeButtonSuccess: {
    backgroundColor: '#10b981',
  },
  completeButtonText: {
    fontSize: Typography.h2,
    fontWeight: Typography.weightBold as any,
    color: '#fff',
    letterSpacing: 0.5,
  },
  ritualFooter: {
    fontSize: Typography.caption,
    color: DarkTheme.textTertiary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
