/**
 * Divine Timing Screen
 * ====================
 * Interface for Divine Timing spiritual reflection
 * 
 * Phase 1: Basic interface with intention selection and result display
 * Phase 2: Qur'an Resonance Attachment with auto/manual mode
 * Phase 3: Interactive Question + Guidance Response
 */

import { DivineTimingCard } from '@/components/divine-timing/DivineTimingCard';
import { DivineTimingGuidanceCard } from '@/components/divine-timing/DivineTimingGuidanceCard';
import { DivineTimingQuestionCard } from '@/components/divine-timing/DivineTimingQuestionCard';
import { ManualVerseSelector } from '@/components/divine-timing/ManualVerseSelector';
import { QuranReflectionCard } from '@/components/divine-timing/QuranReflectionCard';
import Colors from '@/constants/Colors';
import { useProfile } from '@/contexts/ProfileContext';
import {
    generateDivineTimingGuidance,
} from '@/services/DivineTimingGuidanceService';
import {
    computeDivineTiming,
    getIntentionDisplayName,
} from '@/services/DivineTimingService';
import {
    getManualReflection,
    QuranReflection,
    selectReflectionVerse,
} from '@/services/QuranReflectionService';
import {
    DivineTimingResult,
    IntentionCategory,
    UserAbjadResult,
} from '@/types/divine-timing';
import {
    GuidanceCategory,
    GuidanceHistoryItem,
    GuidancePreferences,
    GuidanceResponse,
    TimeHorizon,
    UrgencyLevel,
} from '@/types/divine-timing-guidance';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';

// Placeholder user Abjad data (will be replaced with actual user data later)
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

// Storage keys
const STORAGE_KEY_VERSE_MODE = 'divine_timing_verse_mode';
const STORAGE_KEY_MANUAL_VERSE = 'divine_timing_manual_verse';
const STORAGE_KEY_GUIDANCE_HISTORY = 'divine_timing_guidance_history';
const STORAGE_KEY_GUIDANCE_PREFS = 'divine_timing_guidance_prefs';
const MAX_HISTORY_ITEMS = 10;

// Intention to Category mapping
const INTENTION_TO_CATEGORY: Record<IntentionCategory, GuidanceCategory> = {
  start: 'decisions_general',
  travel: 'travel',
  communication: 'work_career',
  relationship: 'relationships_family',
  study: 'study_exam',
  rest: 'health_wellbeing',
  custom: 'decisions_general',
};

export default function DivineTimingScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { profile } = useProfile();
  
  // Phase 1 & 2 state
  const [selectedIntention, setSelectedIntention] = useState<IntentionCategory | null>(null);
  const [result, setResult] = useState<DivineTimingResult | null>(null);
  const [reflection, setReflection] = useState<QuranReflection | null>(null);
  const [verseMode, setVerseMode] = useState<'auto' | 'manual'>('auto');
  const [manualVerse, setManualVerse] = useState<{ surah: number; ayah: number } | null>(null);
  const [showManualSelector, setShowManualSelector] = useState(false);
  
  // Phase 3 state
  const [showGuidanceInput, setShowGuidanceInput] = useState(false);
  const [guidanceResponse, setGuidanceResponse] = useState<GuidanceResponse | null>(null);
  const [guidanceHistory, setGuidanceHistory] = useState<GuidanceHistoryItem[]>([]);
  const [guidancePrefs, setGuidancePrefs] = useState<GuidancePreferences>({});
  
  // Load saved settings on mount
  useEffect(() => {
    loadSettings();
  }, []);
  
  const loadSettings = async () => {
    try {
      const [savedMode, savedVerse, savedHistory, savedPrefs] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY_VERSE_MODE),
        AsyncStorage.getItem(STORAGE_KEY_MANUAL_VERSE),
        AsyncStorage.getItem(STORAGE_KEY_GUIDANCE_HISTORY),
        AsyncStorage.getItem(STORAGE_KEY_GUIDANCE_PREFS),
      ]);
      
      if (savedMode === 'manual') {
        setVerseMode('manual');
      }
      
      if (savedVerse) {
        setManualVerse(JSON.parse(savedVerse));
      }
      
      if (savedHistory) {
        setGuidanceHistory(JSON.parse(savedHistory));
      }
      
      if (savedPrefs) {
        setGuidancePrefs(JSON.parse(savedPrefs));
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };
  
  const saveVerseMode = async (mode: 'auto' | 'manual') => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_VERSE_MODE, mode);
    } catch (error) {
      console.error('Failed to save verse mode:', error);
    }
  };
  
  const saveManualVerse = async (surah: number, ayah: number) => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY_MANUAL_VERSE,
        JSON.stringify({ surah, ayah })
      );
    } catch (error) {
      console.error('Failed to save manual verse:', error);
    }
  };
  
  const handleCalculate = () => {
    if (!selectedIntention) return;
    
    // Get current date
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
    
    // Select Qur'an reflection verse
    let verseReflection: QuranReflection | null;
    
    if (verseMode === 'manual' && manualVerse) {
      // Manual mode: use manually selected verse
      verseReflection = getManualReflection(
        manualVerse.surah,
        manualVerse.ayah,
        timingResult.timingQuality,
        date
      );
    } else {
      // Auto mode: select verse based on Divine Timing result
      verseReflection = selectReflectionVerse({
        timingQuality: timingResult.timingQuality,
        cycleState: timingResult.cycleState,
        elementalTone: timingResult.elementalTone,
        intentionCategory: selectedIntention,
        seedKey: date,
      });
    }
    
    setReflection(verseReflection);
  };
  
  const handleToggleVerseMode = () => {
    const newMode = verseMode === 'auto' ? 'manual' : 'auto';
    setVerseMode(newMode);
    saveVerseMode(newMode);
    
    // If switching to manual mode, open selector
    if (newMode === 'manual') {
      setShowManualSelector(true);
    } else if (result && selectedIntention) {
      // If switching to auto mode and we have a result, regenerate reflection
      const now = new Date();
      const date = now.toISOString().split('T')[0];
      
      const verseReflection = selectReflectionVerse({
        timingQuality: result.timingQuality,
        cycleState: result.cycleState,
        elementalTone: result.elementalTone,
        intentionCategory: selectedIntention,
        seedKey: date,
      });
      setReflection(verseReflection);
    }
  };
  
  const handleManualVerseSelect = (surah: number, ayah: number) => {
    setManualVerse({ surah, ayah });
    saveManualVerse(surah, ayah);
    
    // If we have a result, regenerate reflection with new manual verse
    if (result) {
      const now = new Date();
      const date = now.toISOString().split('T')[0];
      
      const verseReflection = getManualReflection(
        surah,
        ayah,
        result.timingQuality,
        date
      );
      setReflection(verseReflection);
    }
  };
  
  // Phase 3: Guidance handlers
  const handleGuidanceSubmit = async (
    question: string,
    category: GuidanceCategory,
    timeHorizon: TimeHorizon,
    urgency: UrgencyLevel
  ) => {
    if (!result || !selectedIntention) return;
    
    // Prepare user profile data for personalization
    const userProfileData = profile.derived ? {
      nameAr: profile.nameAr,
      element: profile.derived.element,
      burj: profile.derived.burj,
    } : undefined;
    
    // Generate guidance with profile personalization
    const guidance = generateDivineTimingGuidance({
      questionText: question,
      category,
      timeHorizon,
      urgency,
      divineTimingResult: result,
      reflectionVerse: reflection || undefined,
      userProfile: userProfileData,
    });
    
    setGuidanceResponse(guidance);
    
    // Save to history
    const historyItem: GuidanceHistoryItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      question,
      category,
      response: guidance,
    };
    
    const updatedHistory = [historyItem, ...guidanceHistory].slice(0, MAX_HISTORY_ITEMS);
    setGuidanceHistory(updatedHistory);
    
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY_GUIDANCE_HISTORY,
        JSON.stringify(updatedHistory)
      );
    } catch (error) {
      console.error('Failed to save guidance history:', error);
    }
    
    // Save preferences
    const updatedPrefs: GuidancePreferences = {
      lastCategory: category,
      lastTimeHorizon: timeHorizon,
      lastUrgency: urgency,
    };
    setGuidancePrefs(updatedPrefs);
    
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY_GUIDANCE_PREFS,
        JSON.stringify(updatedPrefs)
      );
    } catch (error) {
      console.error('Failed to save guidance preferences:', error);
    }
    
    // Hide input, show response
    setShowGuidanceInput(false);
  };
  
  const handleGuidanceReset = () => {
    setGuidanceResponse(null);
    setShowGuidanceInput(true);
  };
  
  const handleClearHistory = async () => {
    setGuidanceHistory([]);
    try {
      await AsyncStorage.removeItem(STORAGE_KEY_GUIDANCE_HISTORY);
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  };
  
  const handleReset = () => {
    setSelectedIntention(null);
    setResult(null);
    setReflection(null);
    setGuidanceResponse(null);
    setShowGuidanceInput(false);
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Compact Header - Orientation & Context */}
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <View style={styles.headerLeft}>
          <Ionicons name="moon-outline" size={24} color={colors.primary} />
          <View>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              Divine Timing
            </Text>
            <View style={styles.headerSubtitleRow}>
              <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
                {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
              </Text>
              {result && (
                <>
                  <Text style={[styles.headerDot, { color: colors.textSecondary }]}>•</Text>
                  <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
                    {result.elementalTone.charAt(0).toUpperCase() + result.elementalTone.slice(1)} Energy
                  </Text>
                </>
              )}
            </View>
          </View>
        </View>
        <View style={styles.headerRight}>
          {result && (
            <TouchableOpacity
              onPress={handleReset}
              style={styles.headerAction}
            >
              <Ionicons name="refresh" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Introduction */}
        {!result && (
          <View style={[styles.introCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.introTitle, { color: colors.text }]}>
              Reflect on Your Intention
            </Text>
            <Text style={[styles.introText, { color: colors.textSecondary }]}>
              Divine Timing provides reflective guidance based on elemental cycles and your personal Abjad signature.
              Select your intention below to receive spiritual insight for today.
            </Text>
          </View>
        )}
        
        {/* Intention Selection */}
        {!result && (
          <View style={styles.intentionSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              What is your intention today?
            </Text>
            
            <View style={styles.intentionGrid}>
              {INTENTION_CATEGORIES.map((category) => {
                const isSelected = selectedIntention === category;
                return (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.intentionCard,
                      {
                        backgroundColor: isSelected ? colors.primary : colors.card,
                        borderColor: isSelected ? colors.primary : 'transparent',
                      },
                    ]}
                    onPress={() => setSelectedIntention(category)}
                  >
                    <Ionicons
                      name={INTENTION_ICONS[category]}
                      size={28}
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
            
            {/* Calculate Button */}
            <TouchableOpacity
              style={[
                styles.calculateButton,
                {
                  backgroundColor: selectedIntention ? colors.primary : colors.textSecondary,
                  opacity: selectedIntention ? 1 : 0.5,
                },
              ]}
              onPress={handleCalculate}
              disabled={!selectedIntention}
            >
              <Ionicons name="sparkles" size={20} color="#fff" />
              <Text style={styles.calculateButtonText}>
                Reflect on Divine Timing
              </Text>
            </TouchableOpacity>
          </View>
        )}
        
        {/* Result Display */}
        {result && (
          <>
            {/* Selected Intention Display */}
            <View style={[styles.selectedIntentionCard, { backgroundColor: colors.card }]}>
              <Text style={[styles.selectedLabel, { color: colors.textSecondary }]}>
                Your intention today:
              </Text>
              <View style={styles.selectedIntentionRow}>
                <Ionicons
                  name={INTENTION_ICONS[selectedIntention!]}
                  size={24}
                  color={colors.primary}
                />
                <Text style={[styles.selectedIntentionText, { color: colors.text }]}>
                  {getIntentionDisplayName(selectedIntention!)}
                </Text>
              </View>
            </View>
            
            {/* Divine Timing Result */}
            <DivineTimingCard result={result} colorScheme={colorScheme} />
            
            {/* Qur'an Reflection Controls */}
            <View style={[styles.reflectionControls, { backgroundColor: colors.card }]}>
              <View style={styles.reflectionHeader}>
                <Text style={[styles.reflectionTitle, { color: colors.text }]}>
                  Qur'an Reflection
                </Text>
                <View style={styles.modeToggle}>
                  <TouchableOpacity
                    style={[
                      styles.modeButton,
                      verseMode === 'auto' && styles.modeButtonActive,
                      verseMode === 'auto' && { backgroundColor: colors.primary },
                    ]}
                    onPress={() => verseMode !== 'auto' && handleToggleVerseMode()}
                  >
                    <Text
                      style={[
                        styles.modeButtonText,
                        { color: verseMode === 'auto' ? '#fff' : colors.textSecondary },
                      ]}
                    >
                      Auto
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.modeButton,
                      verseMode === 'manual' && styles.modeButtonActive,
                      verseMode === 'manual' && { backgroundColor: colors.primary },
                    ]}
                    onPress={() => verseMode !== 'manual' && handleToggleVerseMode()}
                  >
                    <Text
                      style={[
                        styles.modeButtonText,
                        { color: verseMode === 'manual' ? '#fff' : colors.textSecondary },
                      ]}
                    >
                      Manual
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              {verseMode === 'manual' && (
                <TouchableOpacity
                  style={[styles.selectVerseButton, { borderColor: colors.primary }]}
                  onPress={() => setShowManualSelector(true)}
                >
                  <Ionicons name="book-outline" size={18} color={colors.primary} />
                  <Text style={[styles.selectVerseText, { color: colors.primary }]}>
                    {manualVerse
                      ? `Change Verse (Current: ${manualVerse.surah}:${manualVerse.ayah})`
                      : 'Select a Verse'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            
            {/* Qur'an Reflection Card */}
            {reflection && (
              <QuranReflectionCard
                reflection={reflection}
                colorScheme={colorScheme}
              />
            )}
            
            {/* Phase 3: Interactive Guidance Section */}
            <View style={[styles.guidanceSection, { backgroundColor: colors.card }]}>
              <View style={styles.guidanceSectionHeader}>
                <Ionicons name="chatbubble-ellipses-outline" size={20} color={colors.primary} />
                <Text style={[styles.guidanceSectionTitle, { color: colors.text }]}>
                  Ask a Question
                </Text>
              </View>
              <Text style={[styles.guidanceSectionDesc, { color: colors.textSecondary }]}>
                Get personalized guidance for specific decisions or actions
              </Text>
              
              {!showGuidanceInput && !guidanceResponse && (
                <TouchableOpacity
                  style={[styles.showGuidanceButton, { backgroundColor: colors.primary }]}
                  onPress={() => setShowGuidanceInput(true)}
                >
                  <Ionicons name="add-circle-outline" size={20} color="#fff" />
                  <Text style={styles.showGuidanceButtonText}>
                    Ask Divine Timing
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            
            {/* Guidance Input Card */}
            {showGuidanceInput && !guidanceResponse && (
              <DivineTimingQuestionCard
                onSubmit={handleGuidanceSubmit}
                colorScheme={colorScheme}
                initialCategory={guidancePrefs.lastCategory}
                initialTimeHorizon={guidancePrefs.lastTimeHorizon}
                initialUrgency={guidancePrefs.lastUrgency}
              />
            )}
            
            {/* Guidance Response Card */}
            {guidanceResponse && (
              <DivineTimingGuidanceCard
                response={guidanceResponse}
                colorScheme={colorScheme}
                onReset={handleGuidanceReset}
                quranContext={
                  reflection
                    ? {
                        verseReference: `${reflection.verse.surahNameEn} ${reflection.verse.surahNumber}:${reflection.verse.ayahNumber}`,
                        translationEn: reflection.verse.translationEn,
                      }
                    : undefined
                }
              />
            )}
            
            {/* Reset Button */}
            <TouchableOpacity
              style={[styles.resetButton, { borderColor: colors.textSecondary }]}
              onPress={handleReset}
            >
              <Ionicons name="refresh" size={20} color={colors.text} />
              <Text style={[styles.resetButtonText, { color: colors.text }]}>
                Reflect on Different Intention
              </Text>
            </TouchableOpacity>
          </>
        )}
        
        {/* Bottom Padding */}
        <View style={{ height: 40 }} />
      </ScrollView>
      
      {/* Manual Verse Selector Modal */}
      <ManualVerseSelector
        visible={showManualSelector}
        onClose={() => setShowManualSelector(false)}
        onSelect={handleManualVerseSelect}
        colorScheme={colorScheme}
      />
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
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  headerSubtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  headerSubtitle: {
    fontSize: 13,
    fontWeight: '500',
  },
  headerDot: {
    fontSize: 13,
    opacity: 0.5,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  headerAction: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 20,
  },
  introCard: {
    borderRadius: 16,
    padding: 20,
    gap: 12,
  },
  introTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  introText: {
    fontSize: 14,
    lineHeight: 20,
  },
  intentionSection: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  intentionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  intentionCard: {
    width: '47%',
    aspectRatio: 1.5,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 2,
  },
  intentionText: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  calculateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  calculateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  selectedIntentionCard: {
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  selectedLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  selectedIntentionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  selectedIntentionText: {
    fontSize: 18,
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
  reflectionControls: {
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  reflectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reflectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    padding: 2,
  },
  modeButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
  },
  modeButtonActive: {
    // Background color set dynamically
  },
  modeButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  selectVerseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1.5,
  },
  selectVerseText: {
    fontSize: 13,
    fontWeight: '500',
  },
  guidanceSection: {
    borderRadius: 12,
    padding: 16,
    gap: 10,
  },
  guidanceSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  guidanceSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  guidanceSectionDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
  showGuidanceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 10,
    marginTop: 6,
  },
  showGuidanceButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
