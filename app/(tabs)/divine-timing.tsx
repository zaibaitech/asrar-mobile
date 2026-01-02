/**
 * Divine Timing Screen
 * ====================
 * Interface for Divine Timing spiritual reflection
 * 
 * Phase 1: Basic interface with intention selection and result display
 * Phase 2: Qur'an Resonance Attachment with auto/manual mode
 * Phase 3: Interactive Question + Guidance Response
 */

import { AdvancedAnalysisCard } from '@/components/divine-timing/AdvancedAnalysisCard';
import { AdvancedDivineTimingGuidanceCard } from '@/components/divine-timing/AdvancedDivineTimingGuidanceCard';
import { DivineTimingCard } from '@/components/divine-timing/DivineTimingCard';
import { DivineTimingGuidanceCard } from '@/components/divine-timing/DivineTimingGuidanceCard';
import { DivineTimingQuestionCard } from '@/components/divine-timing/DivineTimingQuestionCard';
import { ManualVerseSelector } from '@/components/divine-timing/ManualVerseSelector';
import { QuranReflectionCard } from '@/components/divine-timing/QuranReflectionCard';
import Colors from '@/constants/Colors';
import { useProfile } from '@/contexts/ProfileContext';
import {
    getAdvancedDivineTimingAnalysis,
    type IntentionTimingAnalysis,
} from '@/services/AdvancedDivineTimingService';
import { getCurrentPlanetaryHour } from '@/services/DayBlessingService';
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
  
  // Advanced analysis state
  const [advancedAnalysis, setAdvancedAnalysis] = useState<IntentionTimingAnalysis | null>(null);
  const [showAdvancedView, setShowAdvancedView] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Phase 3: Divine Timing Guidance - Interactive Q&A
  const [showGuidanceInput, setShowGuidanceInput] = useState(false);
  const [guidanceResponse, setGuidanceResponse] = useState<GuidanceResponse | null>(null);
  const [advancedGuidanceResponse, setAdvancedGuidanceResponse] = useState<any | null>(null);
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
  
  const handleCalculate = async () => {
    if (!selectedIntention) return;
    
    setLoading(true);
    try {
      // Get current date
      const now = new Date();
      const dayOfWeek = now.getDay();
      const date = now.toISOString().split('T')[0];
      
      // Compute basic Divine Timing
      const timingResult = computeDivineTiming({
        userAbjadResult: PLACEHOLDER_USER_ABJAD,
        currentDate: { dayOfWeek, date },
        userIntentionCategory: selectedIntention,
      });
      
      setResult(timingResult);
      
      // Get advanced analysis integrating all timing components
      const analysis = await getAdvancedDivineTimingAnalysis(
        profile,
        selectedIntention,
        PLACEHOLDER_USER_ABJAD
      );
      
      setAdvancedAnalysis(analysis);
      
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
    } finally {
      setLoading(false);
    }
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
    if (!result || !selectedIntention || !profile.derived) return;
    
    setLoading(true);
    
    try {
      // Generate advanced AI-powered guidance
      const { generateAdvancedDivineTimingGuidance } = await import('@/services/AdvancedDivineTimingGuidanceService');
      const advancedGuidance = await generateAdvancedDivineTimingGuidance({
        questionText: question,
        category,
        timeHorizon,
        urgency,
        divineTimingResult: result,
        userProfile: profile,
        userAbjad: PLACEHOLDER_USER_ABJAD,
        intention: selectedIntention,
        advancedAnalysis: advancedAnalysis || undefined,
      });
      
      setAdvancedGuidanceResponse(advancedGuidance);
      setGuidanceResponse(advancedGuidance); // Also set base response for compatibility
      
      // Save to history
      const historyItem: GuidanceHistoryItem = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        question,
        category,
        response: advancedGuidance,
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
    } catch (error) {
      console.error('Failed to generate advanced guidance:', error);
      // Fallback to basic guidance if advanced fails
      const basicGuidance = generateDivineTimingGuidance({
        questionText: question,
        category,
        timeHorizon,
        urgency,
        divineTimingResult: result,
        reflectionVerse: reflection || undefined,
        userProfile: profile.derived ? {
          nameAr: profile.nameAr,
          element: profile.derived.element,
          burj: profile.derived.burj,
        } : undefined,
      });
      setGuidanceResponse(basicGuidance);
      setShowGuidanceInput(false);
    } finally {
      setLoading(false);
    }
  };
  
  const handleGuidanceReset = () => {
    setGuidanceResponse(null);
    setAdvancedGuidanceResponse(null);
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
    setAdvancedGuidanceResponse(null);
    setShowGuidanceInput(false);
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Introduction */}
        {!result && (
          <View style={[styles.introCard, { backgroundColor: colors.card }]}>
            <View style={styles.introHeader}>
              <Ionicons name="compass" size={32} color={colors.primary} />
              <Text style={[styles.introTitle, { color: colors.text }]}>
                Advanced Timing Analysis
              </Text>
            </View>
            <Text style={[styles.introText, { color: colors.textSecondary }]}>
              Receive comprehensive guidance by integrating all timing systems:
              Moment Alignment, Daily Guidance, and Planetary Hours.
            </Text>
            
            {/* Live Preview Stats */}
            <View style={styles.introStatsContainer}>
              <View style={[styles.introStatCard, { backgroundColor: colors.background }]}>
                <Ionicons name="time" size={16} color={colors.primary} />
                <Text style={[styles.introStatLabel, { color: colors.textSecondary }]}>Current Hour</Text>
                <Text style={[styles.introStatValue, { color: colors.text }]}>
                  {(() => {
                    const ph = getCurrentPlanetaryHour();
                    return ph.planet;
                  })()}
                </Text>
              </View>
              <View style={[styles.introStatCard, { backgroundColor: colors.background }]}>
                <Ionicons name="sunny" size={16} color={colors.primary} />
                <Text style={[styles.introStatLabel, { color: colors.textSecondary }]}>Daily Energy</Text>
                <Text style={[styles.introStatValue, { color: colors.text }]}>
                  {new Date().toLocaleDateString('en-US', { weekday: 'short' })}
                </Text>
              </View>
            </View>

            {/* Feature Highlights */}
            <View style={styles.introFeaturesContainer}>
              <View style={styles.introFeature}>
                <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                <Text style={[styles.introFeatureText, { color: colors.textSecondary }]}>
                  Harmony Score (0-100)
                </Text>
              </View>
              <View style={styles.introFeature}>
                <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                <Text style={[styles.introFeatureText, { color: colors.textSecondary }]}>
                  7-Day Optimal Timeline
                </Text>
              </View>
              <View style={styles.introFeature}>
                <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                <Text style={[styles.introFeatureText, { color: colors.textSecondary }]}>
                  Practical Action Steps
                </Text>
              </View>
            </View>
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
                // Get element color for the intention
                const elementColors: Record<string, string> = {
                  growth: '#4CAF50',      // Earth
                  protection: '#2196F3',  // Water
                  clarity: '#FFC107',     // Air
                  action: '#FF5722',      // Fire
                };
                const elementColor = elementColors[category] || colors.primary;
                
                return (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.intentionCard,
                      {
                        backgroundColor: isSelected ? colors.primary : colors.card,
                        borderColor: isSelected ? colors.primary : elementColor + '33',
                        borderWidth: 2,
                      },
                    ]}
                    onPress={() => setSelectedIntention(category)}
                  >
                    <View style={styles.intentionCardHeader}>
                      <Ionicons
                        name={INTENTION_ICONS[category]}
                        size={32}
                        color={isSelected ? '#fff' : elementColor}
                      />
                      {!isSelected && (
                        <View style={[styles.elementBadge, { backgroundColor: elementColor + '22' }]}>
                          <View style={[styles.elementDot, { backgroundColor: elementColor }]} />
                        </View>
                      )}
                    </View>
                    <Text
                      style={[
                        styles.intentionText,
                        { color: isSelected ? '#fff' : colors.text },
                      ]}
                    >
                      {getIntentionDisplayName(category)}
                    </Text>
                    {isSelected && (
                      <View style={styles.selectedIndicator}>
                        <Ionicons name="checkmark-circle" size={16} color="#fff" />
                      </View>
                    )}
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
              disabled={!selectedIntention || loading}
            >
              {loading ? (
                <>
                  <Ionicons name="hourglass" size={20} color="#fff" />
                  <Text style={styles.calculateButtonText}>
                    Analyzing Timing...
                  </Text>
                </>
              ) : (
                <>
                  <Ionicons name="sparkles" size={20} color="#fff" />
                  <Text style={styles.calculateButtonText}>
                    Get Advanced Analysis
                  </Text>
                </>
              )}
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
            
            {/* Advanced Analysis Card */}
            {advancedAnalysis && (
              <AdvancedAnalysisCard analysis={advancedAnalysis} />
            )}
            
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
                <Ionicons name="bulb" size={24} color="#FFD700" />
                <View style={{ flex: 1 }}>
                  <View style={styles.guidanceTitleRow}>
                    <Text style={[styles.guidanceSectionTitle, { color: colors.text }]}>
                      AI-Powered Spiritual Guidance
                    </Text>
                    <View style={styles.aiBadge}>
                      <Ionicons name="sparkles" size={10} color="#000" />
                      <Text style={styles.aiBadgeText}>AI</Text>
                    </View>
                  </View>
                  <Text style={[styles.guidanceSectionDesc, { color: colors.textSecondary }]}>
                    Get personalized guidance based on your Abjad profile and current timing
                  </Text>
                </View>
              </View>
              
              {!showGuidanceInput && !guidanceResponse && (
                <TouchableOpacity
                  style={[styles.showGuidanceButton, { backgroundColor: colors.primary }]}
                  onPress={() => setShowGuidanceInput(true)}
                >
                  <Ionicons name="chatbubble-ellipses" size={20} color="#fff" />
                  <Text style={styles.showGuidanceButtonText}>
                    Ask AI Guidance
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
            {advancedGuidanceResponse ? (
              <AdvancedDivineTimingGuidanceCard
                response={advancedGuidanceResponse}
                colorScheme={colorScheme}
                onReset={handleGuidanceReset}
              />
            ) : guidanceResponse ? (
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
            ) : null}
            
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
    alignItems: 'flex-start',
    gap: 12,
  },
  guidanceTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  guidanceSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FFD700',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  aiBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#000',
    letterSpacing: 0.5,
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
  
  // Enhanced Premium Styles
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  premiumBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#000',
    letterSpacing: 0.5,
  },
  introHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  introStatsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    marginBottom: 16,
  },
  introStatCard: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    gap: 6,
    alignItems: 'center',
  },
  introStatLabel: {
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  introStatValue: {
    fontSize: 15,
    fontWeight: '700',
  },
  introFeaturesContainer: {
    gap: 8,
    marginTop: 8,
  },
  introFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  introFeatureText: {
    fontSize: 13,
    fontWeight: '500',
  },
  intentionCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
  },
  elementBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  elementDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
});
