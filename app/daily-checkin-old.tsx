/**
 * Daily Check-In Screen
 * =====================
 * Phase 4 + Phase 7: Quick daily reflection flow with personalization
 * 
 * Enhanced Features (Phase 7):
 * - Energy level slider (0-100)
 * - Harmony score computation from ephemeris
 * - Save check-in to personalization storage
 * - Support for outcome tracking (added later)
 */

import { DivineTimingCard } from '@/components/divine-timing/DivineTimingCard';
import { QuranReflectionCard } from '@/components/divine-timing/QuranReflectionCard';
import { SimpleSlider } from '@/components/SimpleSlider';
import Colors from '@/constants/Colors';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProfile } from '@/contexts/ProfileContext';
import { AsrarTimingSnapshot, buildAsrarTimingSnapshot } from '@/services/DivineTimingAsrarService';
import {
    computeDivineTiming,
    getIntentionDisplayName,
} from '@/services/DivineTimingService';
import {
    getDailyCheckInSummary,
    saveCheckIn,
} from '@/services/DivineTimingStorage';
import {
    QuranReflection,
    selectReflectionVerse,
} from '@/services/QuranReflectionService';
// Phase 7 imports
import { loadCheckIns, loadUserTimingProfile, saveCheckIn as saveEnhancedCheckIn } from '@/services/CheckInStorage';
import { getPlanetPositions } from '@/services/EphemerisService';
import {
    computeHarmonyScore,
    getTimeSegmentFromDate,
} from '@/services/IlmNujumMapping';
import { getRecentOutcomesForSegment } from '@/services/PeakWindowLearner';
import { DailyCheckInEntry } from '@/types/daily-checkin';
import {
    DivineTimingResult,
    IntentionCategory,
    UserAbjadResult,
} from '@/types/divine-timing';
import { CheckInRecord } from '@/types/divine-timing-personal';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useColorScheme,
} from 'react-native';

// Placeholder user Abjad (will be replaced with real data)
const PLACEHOLDER_USER_ABJAD: UserAbjadResult = {
  kabir: 786,
  saghir: 3,
  hadad: 2,
  dominantElement: 'fire',
};

const INTENTION_CATEGORIES: IntentionCategory[] = [
  'start',
  'travel',
  'communication',
  'relationship',
  'study',
  'rest',
  'custom',
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

export default function DailyCheckInScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { t } = useLanguage();
  const { profile } = useProfile();
  
  const [step, setStep] = useState<'input' | 'result'>('input');
  const [selectedIntention, setSelectedIntention] = useState<IntentionCategory | null>(null);
  const [note, setNote] = useState('');
  const [energy, setEnergy] = useState(70); // Phase 7: Energy level (0-100)
  const [result, setResult] = useState<DivineTimingResult | null>(null);
  const [reflection, setReflection] = useState<QuranReflection | null>(null);
  const [harmonyScore, setHarmonyScore] = useState<number | null>(null); // Phase 7
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const [saving, setSaving] = useState(false);
  const [timingSnapshot, setTimingSnapshot] = useState<AsrarTimingSnapshot>(() =>
    buildAsrarTimingSnapshot({
      userProfile: profile,
      userAbjad: PLACEHOLDER_USER_ABJAD,
      intention: null,
    })
  );
  
  useEffect(() => {
    checkTodayStatus();
  }, []);

  useEffect(() => {
    const snapshot = buildAsrarTimingSnapshot({
      userProfile: profile,
      userAbjad: PLACEHOLDER_USER_ABJAD,
      intention: selectedIntention,
    });
    setTimingSnapshot(snapshot);
  }, [profile, selectedIntention]);
  
  const checkTodayStatus = async () => {
    const summary = await getDailyCheckInSummary();
    setHasCheckedInToday(summary.hasCheckedInToday);
  };
  
  const handleGetGuidance = async () => {
    if (!selectedIntention) return;
    
    const now = new Date();
    const dayOfWeek = now.getDay();
    const date = now.toISOString().split('T')[0];
    
    // Compute Divine Timing
    const timingResult = computeDivineTiming({
      userAbjadResult: PLACEHOLDER_USER_ABJAD,
      currentDate: { dayOfWeek, date },
      userIntentionCategory: selectedIntention,
    });
    
    setResult(timingResult);
    
    // Select Qur'an reflection
    const verseReflection = selectReflectionVerse({
      timingQuality: timingResult.timingQuality,
      cycleState: timingResult.cycleState,
      elementalTone: timingResult.elementalTone,
      intentionCategory: selectedIntention,
      seedKey: date,
    });
    
    setReflection(verseReflection);
    
    // Phase 7: Compute harmony score
    try {
      const profile = await loadUserTimingProfile();
      const checkins = await loadCheckIns();
      const segment = getTimeSegmentFromDate(now);
      const positions = await getPlanetPositions(now, profile.timezone);
      const recentOutcomes = getRecentOutcomesForSegment(checkins, segment, 30);
      
      const harmonyResult = computeHarmonyScore({
        datetime: now,
        timezone: profile.timezone,
        userElement: PLACEHOLDER_USER_ABJAD.dominantElement,
        userBurjRuler: undefined,
        intentionCategory: selectedIntention,
        timeSegment: segment,
        planetPositions: positions || undefined,
        peakWindowScore: profile.peakWindowModel.segmentScores[segment],
        recentOutcomes,
      });
      
      setHarmonyScore(harmonyResult.score);
    } catch (error) {
      if (__DEV__) {
        console.error('[CheckIn] Error computing harmony:', error);
      }
      setHarmonyScore(50); // Fallback
    }
    
    setStep('result');
  };
  
  const handleSaveCheckIn = async () => {
    if (!result || !selectedIntention) return;
    
    setSaving(true);
    
    try {
      const now = new Date();
      const dateISO = now.toISOString().split('T')[0];
      
      // Save to original storage (Phase 4)
      const entry: DailyCheckInEntry = {
        id: `${dateISO}-${now.getTime()}`,
        dateISO,
        createdAt: now.getTime(),
        intentionCategory: selectedIntention,
        note: note.trim() || undefined,
        timing: result,
        verse: reflection ? {
          surahNumber: reflection.verse.surahNumber,
          ayahNumber: reflection.verse.ayahNumber,
          surahNameEn: reflection.verse.surahNameEn,
          arabicText: reflection.verse.arabicText,
          translationEn: reflection.verse.translationEn,
        } : undefined,
      };
      
      await saveCheckIn(entry);
      
      // Phase 7: Save enhanced check-in for personalization
      const profile = await loadUserTimingProfile();
      const segment = getTimeSegmentFromDate(now);
      const positions = await getPlanetPositions(now, profile.timezone);
      
      const enhancedEntry: CheckInRecord = {
        id: entry.id,
        createdAt: now.getTime(),
        localDayKey: dateISO,
        intentionKey: selectedIntention,
        note: note.trim() || undefined,
        timingSnapshot: result,
        timeSegment: segment,
        energy,
        harmonyScore: harmonyScore || undefined,
        planetarySnapshot: positions || undefined,
      };
      
      await saveEnhancedCheckIn(enhancedEntry);
      
      Alert.alert(
        t('dailyCheckIn.alerts.savedTitle'),
        t('dailyCheckIn.alerts.savedMessage'),
        [
          {
            text: t('dailyCheckIn.alerts.done'),
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        t('dailyCheckIn.alerts.errorTitle'),
        t('dailyCheckIn.alerts.errorMessage')
      );
    } finally {
      setSaving(false);
    }
  };
  
  const handleReset = () => {
    setStep('input');
    setSelectedIntention(null);
    setNote('');
    setResult(null);
    setReflection(null);
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {t('dailyCheckIn.header.title')}
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            {t('dailyCheckIn.header.subtitle')}
          </Text>
        </View>
      </View>
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.disclaimerPill, { borderColor: colors.textSecondary }]}> 
          <Text style={[styles.disclaimerText, { color: colors.textSecondary }]}>
            {t('dailyCheckIn.disclaimer')}
          </Text>
        </View>

        {/* Already checked in notice */}
        {hasCheckedInToday && step === 'input' && (
          <View style={[styles.noticeCard, { backgroundColor: '#fef3c7' }]}>
            <Ionicons name="checkmark-circle" size={20} color="#f59e0b" />
            <Text style={[styles.noticeText, { color: '#92400e' }]}>
              {t('dailyCheckIn.notice.alreadyCheckedIn')}
            </Text>
          </View>
        )}
        
        {/* Configuration Snapshot */}
        <View style={[styles.card, { backgroundColor: colors.card }]}> 
          <Text style={[styles.cardTitle, { color: colors.text }]}> 
            {t('dailyCheckIn.sections.configuration.title')}
          </Text>
          <View style={styles.sectionBlock}>
            <View style={styles.configLabelColumn}>
              <Text style={[styles.labelHeading, { color: colors.textSecondary }]}>
                {t('dailyCheckIn.labels.planetaryDay')}
              </Text>
              <Text style={[styles.configPrimaryText, { color: colors.text }]}> 
                {t(timingSnapshot.day.translationKey)}
              </Text>
              <Text style={[styles.configSecondaryText, { color: colors.textSecondary }]}> 
                {`${timingSnapshot.day.planetArabic} • ${timingSnapshot.day.planet}`}
              </Text>
            </View>
            <View style={styles.configLabelColumn}>
              <Text style={[styles.labelHeading, { color: colors.textSecondary }]}>
                {t('dailyCheckIn.labels.cycleTone')}
              </Text>
              <Text style={[styles.configPrimaryText, { color: colors.text }]}>
                {t(timingSnapshot.cycle.stateKey)}
              </Text>
              <Text style={[styles.configSecondaryText, { color: colors.textSecondary }]}> 
                {t(timingSnapshot.cycle.timingKey)}
              </Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.sectionBlock}>
            <View style={styles.configLabelColumn}>
              <Text style={[styles.labelHeading, { color: colors.textSecondary }]}>
                {t('dailyCheckIn.labels.zahir')}
              </Text>
              {timingSnapshot.elements.zahir ? (
                <Text style={[styles.configPrimaryText, { color: colors.text }]}>
                  {t(timingSnapshot.elements.zahir.translationKey)}
                </Text>
              ) : (
                <Text style={[styles.configSecondaryText, { color: colors.textSecondary }]}> 
                  {t('dailyCheckIn.elements.zahirMissing')}
                </Text>
              )}
            </View>
            <View style={styles.configLabelColumn}>
              <Text style={[styles.labelHeading, { color: colors.textSecondary }]}>
                {t('dailyCheckIn.labels.batin')}
              </Text>
              {timingSnapshot.elements.batin ? (
                <Text style={[styles.configPrimaryText, { color: colors.text }]}>
                  {t(timingSnapshot.elements.batin.translationKey)}
                </Text>
              ) : (
                <Text style={[styles.configSecondaryText, { color: colors.textSecondary }]}> 
                  {t('dailyCheckIn.elements.batinMissing')}
                </Text>
              )}
            </View>
          </View>
          <View style={styles.divider} />
          <View style={[styles.sectionBlock, styles.alignmentRow]}>
            <View style={styles.alignmentColumn}>
              <Text style={[styles.labelHeading, { color: colors.textSecondary }]}>
                {t('dailyCheckIn.labels.harmony')}
              </Text>
              <Text style={[styles.harmonyValue, { color: colors.primary }]}> 
                {Math.round(timingSnapshot.elements.alignment.alignment.harmonyScore)}
              </Text>
              <Text style={[styles.configSecondaryText, { color: colors.textSecondary }]}> 
                {t(timingSnapshot.elements.alignment.qualityKey)}
              </Text>
            </View>
            <View style={styles.alignmentDescription}>
              <Text style={[styles.alignmentHint, { color: colors.textSecondary }]}> 
                {t(timingSnapshot.elements.alignment.descriptionKey)}
              </Text>
            </View>
          </View>
        </View>

        {/* Action Window */}
        <View style={[styles.card, { backgroundColor: colors.card }]}> 
          <Text style={[styles.cardTitle, { color: colors.text }]}> 
            {t('dailyCheckIn.sections.actionWindow.title')}
          </Text>
          <View style={styles.sectionBlock}>
            <View style={styles.configLabelColumn}>
              <Text style={[styles.labelHeading, { color: colors.textSecondary }]}>
                {t('dailyCheckIn.labels.hourElement')}
              </Text>
              <Text style={[styles.configPrimaryText, { color: colors.text }]}>
                {`${timingSnapshot.hour.raw.planetArabic} • ${timingSnapshot.hour.raw.planet}`}
              </Text>
              <Text style={[styles.configSecondaryText, { color: colors.textSecondary }]}> 
                {t(`dailyCheckIn.elements.hour.${timingSnapshot.hour.element}`)}
              </Text>
            </View>
            <View style={styles.configLabelColumn}>
              <Text style={[styles.labelHeading, { color: colors.textSecondary }]}>
                {t('dailyCheckIn.labels.closesIn')}
              </Text>
              <Text style={[styles.configPrimaryText, { color: colors.text }]}>
                {timingSnapshot.hour.closesIn}
              </Text>
              <Text style={[styles.configSecondaryText, { color: colors.textSecondary }]}> 
                {t(timingSnapshot.hour.translationKey)}
              </Text>
            </View>
          </View>
          {timingSnapshot.hour.nextWindowIn ? (
            <View style={styles.sectionBlock}>
              <View style={styles.configLabelColumn}>
                <Text style={[styles.labelHeading, { color: colors.textSecondary }]}>
                  {t('dailyCheckIn.labels.nextWindow')}
                </Text>
                <Text style={[styles.configPrimaryText, { color: colors.text }]}>
                  {timingSnapshot.hour.nextWindowIn}
                </Text>
              </View>
            </View>
          ) : null}
        </View>

        {step === 'input' && (
          <>
            {/* Intention Selection */}
            <View style={[styles.card, { backgroundColor: colors.card }]}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>
                {t('dailyCheckIn.sections.intention.title')}
              </Text>
              
              <View style={styles.intentionGrid}>
                {INTENTION_CATEGORIES.map((category) => {
                  const isSelected = selectedIntention === category;
                  return (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.intentionChip,
                        {
                          backgroundColor: isSelected ? colors.primary : (colorScheme === 'dark' ? '#1a1a1a' : '#f5f5f5'),
                          borderColor: isSelected ? colors.primary : 'transparent',
                        },
                      ]}
                      onPress={() => setSelectedIntention(category)}
                    >
                      <Ionicons
                        name={INTENTION_ICONS[category]}
                        size={20}
                        color={isSelected ? '#fff' : colors.text}
                      />
                      <Text
                        style={[
                          styles.intentionText,
                          { color: isSelected ? '#fff' : colors.text },
                        ]}
                      >
                        {getIntentionDisplayName(category)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Intention Compatibility */}
            <View style={[styles.card, { backgroundColor: colors.card }]}> 
              <Text style={[styles.cardTitle, { color: colors.text }]}> 
                {t('dailyCheckIn.sections.intention.compatibilityTitle')}
              </Text>
              {selectedIntention && timingSnapshot.intention ? (
                <View style={styles.intentionInsight}>
                  <View style={styles.intentionInsightHeader}>
                    <Text style={[styles.intentionInsightIcon, { color: colors.primary }]}> 
                      {timingSnapshot.intention.icon}
                    </Text>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.intentionInsightTitle, { color: colors.text }]}> 
                        {t(timingSnapshot.intention.readinessKey)}
                      </Text>
                      <Text style={[styles.intentionInsightScore, { color: colors.textSecondary }]}> 
                        {Math.round(timingSnapshot.intention.score)} / 100
                      </Text>
                    </View>
                  </View>
                  <View style={styles.tagRow}>
                    {timingSnapshot.intention.tags.map(tag => (
                      <View
                        key={tag.id}
                        style={[styles.tagChip, { backgroundColor: colorScheme === 'dark' ? '#121212' : '#f5f5f5', borderColor: colors.primary }]}
                      >
                        <Text style={[styles.tagIcon, { color: colors.primary }]}>{tag.icon}</Text>
                        <Text style={[styles.tagLabel, { color: colors.text }]}>
                          {t(tag.labelKey)}
                        </Text>
                      </View>
                    ))}
                  </View>
                  <View style={styles.tagDescriptions}>
                    {timingSnapshot.intention.tags.map(tag => (
                      <Text key={`${tag.id}-desc`} style={[styles.tagDescriptionText, { color: colors.textSecondary }]}> 
                        {t(tag.descriptionKey)}
                      </Text>
                    ))}
                  </View>
                </View>
              ) : (
                <Text style={[styles.configSecondaryText, { color: colors.textSecondary }]}> 
                  {t('dailyCheckIn.sections.intention.empty')}
                </Text>
              )}
            </View>
            
            {/* Optional Note */}
            <View style={[styles.card, { backgroundColor: colors.card }]}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>
                {t('dailyCheckIn.sections.note.title')}
              </Text>
              
              <TextInput
                style={[
                  styles.noteInput,
                  {
                    backgroundColor: colorScheme === 'dark' ? '#0f1419' : '#fafafa',
                    color: colors.text,
                  },
                ]}
                placeholder={t('dailyCheckIn.sections.note.placeholder')}
                placeholderTextColor={colors.textSecondary}
                value={note}
                onChangeText={setNote}
                multiline
                maxLength={120}
                numberOfLines={3}
              />
              
              <Text style={[styles.charCount, { color: colors.textSecondary }]}>
                {note.length}/120
              </Text>
            </View>
            
            {/* Phase 7: Energy Level */}
            <View style={[styles.card, { backgroundColor: colors.card }]}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>
                {t('dailyCheckIn.sections.energy.title')}
              </Text>
              
              <View style={styles.energyContainer}>
                <View style={styles.energyLabels}>
                  <Text style={[styles.energyLabel, { color: colors.textSecondary }]}>
                    {t('dailyCheckIn.sections.energy.low')}
                  </Text>
                  <Text style={[styles.energyValue, { color: colors.primary }]}>
                    {energy}%
                  </Text>
                  <Text style={[styles.energyLabel, { color: colors.textSecondary }]}>
                    {t('dailyCheckIn.sections.energy.high')}
                  </Text>
                </View>
                
                <SimpleSlider
                  value={energy}
                  onValueChange={setEnergy}
                  minimumValue={0}
                  maximumValue={100}
                  minimumTrackTintColor={colors.primary}
                  maximumTrackTintColor={colorScheme === 'dark' ? '#333' : '#ddd'}
                  thumbTintColor={colors.primary}
                />
                
                <Text style={[styles.energyHint, { color: colors.textSecondary }]}>
                  {t('dailyCheckIn.sections.energy.helper')}
                </Text>
              </View>
            </View>
            
            {/* Get Guidance Button */}
            <TouchableOpacity
              style={[
                styles.actionButton,
                {
                  backgroundColor: selectedIntention ? colors.primary : colors.textSecondary,
                  opacity: selectedIntention ? 1 : 0.5,
                },
              ]}
              onPress={handleGetGuidance}
              disabled={!selectedIntention}
            >
              <Ionicons name="sparkles" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>{t('dailyCheckIn.actions.requestReflection')}</Text>
            </TouchableOpacity>
          </>
        )}
        
        {step === 'result' && result && (
          <>
            {/* Divine Timing Result */}
            <DivineTimingCard result={result} colorScheme={colorScheme} />
            
            {/* Qur'an Reflection */}
            {reflection && (
              <QuranReflectionCard
                reflection={reflection}
                colorScheme={colorScheme}
              />
            )}
            
            {/* Save Button */}
            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: '#10b981' }]}
              onPress={handleSaveCheckIn}
              disabled={saving}
            >
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
              <Text style={styles.saveButtonText}>
                {saving ? t('dailyCheckIn.actions.saving') : t('dailyCheckIn.actions.saveCheckIn')}
              </Text>
            </TouchableOpacity>
            
            {/* Reset Button */}
            <TouchableOpacity
              style={[styles.resetButton, { borderColor: colors.textSecondary }]}
              onPress={handleReset}
            >
              <Ionicons name="refresh" size={18} color={colors.text} />
              <Text style={[styles.resetButtonText, { color: colors.text }]}>
                {t('dailyCheckIn.actions.changeIntention')}
              </Text>
            </TouchableOpacity>
          </>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 16,
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
    fontSize: 24,
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
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 12,
  },
  noticeText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  disclaimerPill: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  disclaimerText: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    fontWeight: '600',
  },
  card: {
    borderRadius: 16,
    padding: 20,
    gap: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  sectionBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  configLabelColumn: {
    flex: 1,
    gap: 4,
  },
  labelHeading: {
    fontSize: 12,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  configPrimaryText: {
    fontSize: 15,
    fontWeight: '600',
  },
  configSecondaryText: {
    fontSize: 12,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(120,120,120,0.18)',
    marginVertical: 4,
    borderRadius: 999,
  },
  alignmentRow: {
    alignItems: 'flex-start',
  },
  alignmentColumn: {
    width: 120,
    gap: 6,
  },
  harmonyValue: {
    fontSize: 28,
    fontWeight: '700',
  },
  alignmentDescription: {
    flex: 1,
  },
  alignmentHint: {
    fontSize: 13,
    lineHeight: 20,
  },
  intentionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  intentionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 2,
    minWidth: '30%',
  },
  intentionText: {
    fontSize: 13,
    fontWeight: '500',
  },
  intentionInsight: {
    gap: 12,
  },
  intentionInsightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  intentionInsightIcon: {
    fontSize: 28,
  },
  intentionInsightTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  intentionInsightScore: {
    fontSize: 12,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  tagIcon: {
    fontSize: 14,
  },
  tagLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  tagDescriptions: {
    gap: 6,
  },
  tagDescriptionText: {
    fontSize: 12,
    lineHeight: 18,
  },
  noteInput: {
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 11,
    textAlign: 'right',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
  // Phase 7: Energy section styles
  energyContainer: {
    gap: 12,
  },
  energyLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  energyLabel: {
    fontSize: 12,
  },
  energyValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  energyHint: {
    fontSize: 11,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
