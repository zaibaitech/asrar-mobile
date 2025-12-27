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
  
  const [step, setStep] = useState<'input' | 'result'>('input');
  const [selectedIntention, setSelectedIntention] = useState<IntentionCategory | null>(null);
  const [note, setNote] = useState('');
  const [energy, setEnergy] = useState(70); // Phase 7: Energy level (0-100)
  const [result, setResult] = useState<DivineTimingResult | null>(null);
  const [reflection, setReflection] = useState<QuranReflection | null>(null);
  const [harmonyScore, setHarmonyScore] = useState<number | null>(null); // Phase 7
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    checkTodayStatus();
  }, []);
  
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
        'Check-In Saved',
        'Your daily reflection has been recorded. Consistency brings clarity.',
        [
          {
            text: 'Done',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save check-in. Please try again.');
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
            📅 Daily Check-In
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            Reflect on today's timing
          </Text>
        </View>
      </View>
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Already checked in notice */}
        {hasCheckedInToday && step === 'input' && (
          <View style={[styles.noticeCard, { backgroundColor: '#fef3c7' }]}>
            <Ionicons name="checkmark-circle" size={20} color="#f59e0b" />
            <Text style={[styles.noticeText, { color: '#92400e' }]}>
              You've already checked in today. You can update your reflection below.
            </Text>
          </View>
        )}
        
        {step === 'input' && (
          <>
            {/* Intention Selection */}
            <View style={[styles.card, { backgroundColor: colors.card }]}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>
                What's your intention today?
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
            
            {/* Optional Note */}
            <View style={[styles.card, { backgroundColor: colors.card }]}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>
                What's on your mind? (Optional)
              </Text>
              
              <TextInput
                style={[
                  styles.noteInput,
                  {
                    backgroundColor: colorScheme === 'dark' ? '#0f1419' : '#fafafa',
                    color: colors.text,
                  },
                ]}
                placeholder="A brief note about your day..."
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
                How's your energy right now?
              </Text>
              
              <View style={styles.energyContainer}>
                <View style={styles.energyLabels}>
                  <Text style={[styles.energyLabel, { color: colors.textSecondary }]}>
                    Low
                  </Text>
                  <Text style={[styles.energyValue, { color: colors.primary }]}>
                    {energy}%
                  </Text>
                  <Text style={[styles.energyLabel, { color: colors.textSecondary }]}>
                    High
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
                  This helps us learn your peak windows over time
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
              <Text style={styles.actionButtonText}>Get Today's Guidance</Text>
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
                {saving ? 'Saving...' : 'Save Check-In'}
              </Text>
            </TouchableOpacity>
            
            {/* Reset Button */}
            <TouchableOpacity
              style={[styles.resetButton, { borderColor: colors.textSecondary }]}
              onPress={handleReset}
            >
              <Ionicons name="refresh" size={18} color={colors.text} />
              <Text style={[styles.resetButtonText, { color: colors.text }]}>
                Change Intention
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
  card: {
    borderRadius: 16,
    padding: 20,
    gap: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
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
