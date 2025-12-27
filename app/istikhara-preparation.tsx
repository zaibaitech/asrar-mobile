/**
 * Istikhārah Preparation Wizard
 * ==============================
 * Phase 5: Guided preparation flow (5 steps)
 * 
 * CRITICAL: This does NOT replace ṣalāt al-istikhārah.
 * This is preparation and intention-setting only.
 */

import { DivineTimingCard } from '@/components/divine-timing/DivineTimingCard';
import { ManualVerseSelector } from '@/components/divine-timing/ManualVerseSelector';
import Colors from '@/constants/Colors';
import {
    computeDivineTiming,
} from '@/services/DivineTimingService';
import {
    saveIstikharaSession,
} from '@/services/GuidedIstikharaStorage';
import {
    QuranReflection,
    selectReflectionVerse,
} from '@/services/QuranReflectionService';
import {
    DivineTimingResult,
    UserAbjadResult,
} from '@/types/divine-timing';
import {
    GuidedIstikharaSession,
    IstikharaSelfCheck,
} from '@/types/guided-istikhara';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
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

// Placeholder user Abjad
const PLACEHOLDER_USER_ABJAD: UserAbjadResult = {
  kabir: 786,
  saghir: 3,
  hadad: 2,
  dominantElement: 'fire',
};

type WizardStep = 'decision' | 'selfcheck' | 'timing' | 'intention' | 'ready';

const INTENTION_TEMPLATE = `O Allah, if this matter is good for me in my religion, life, and outcome, then decree it for me and make it easy for me. And if it is bad for me, then turn it away from me and turn me away from it, and decree for me what is good wherever it may be.`;

export default function IstikharaPreparationScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  const [step, setStep] = useState<WizardStep>('decision');
  const [decisionText, setDecisionText] = useState('');
  const [selfCheck, setSelfCheck] = useState<IstikharaSelfCheck>({
    notClearlyHaram: false,
    takenWorldlySteps: false,
    notRushing: false,
  });
  const [timingResult, setTimingResult] = useState<DivineTimingResult | null>(null);
  const [intentionText, setIntentionText] = useState('');
  const [useTemplate, setUseTemplate] = useState(true);
  const [reflection, setReflection] = useState<QuranReflection | null>(null);
  const [showVerseSelector, setShowVerseSelector] = useState(false);
  
  const handleNextFromDecision = () => {
    if (!decisionText.trim()) {
      Alert.alert('Required', 'Please describe your decision.');
      return;
    }
    setStep('selfcheck');
  };
  
  const handleNextFromSelfCheck = () => {
    // No validation - these are self-reflections only
    
    // Compute Divine Timing
    const now = new Date();
    const dayOfWeek = now.getDay();
    const date = now.toISOString().split('T')[0];
    
    const timing = computeDivineTiming({
      userAbjadResult: PLACEHOLDER_USER_ABJAD,
      currentDate: { dayOfWeek, date },
      userIntentionCategory: 'custom',
    });
    
    setTimingResult(timing);
    
    // Select Qur'an reflection
    const verse = selectReflectionVerse({
      timingQuality: timing.timingQuality,
      cycleState: timing.cycleState,
      elementalTone: timing.elementalTone,
      intentionCategory: 'custom',
      seedKey: date,
    });
    
    setReflection(verse);
    setStep('timing');
  };
  
  const handleNextFromTiming = () => {
    setStep('intention');
  };
  
  const handleNextFromIntention = () => {
    setStep('ready');
  };
  
  const handlePerformed = async () => {
    if (!timingResult) return;
    
    try {
      const session: GuidedIstikharaSession = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: Date.now(),
        decisionText,
        intentionText: useTemplate ? undefined : intentionText,
        timingSnapshot: timingResult,
        reflectionVerse: reflection ? {
          surahNumber: reflection.verse.surahNumber,
          ayahNumber: reflection.verse.ayahNumber,
          surahNameEn: reflection.verse.surahNameEn,
          surahNameAr: reflection.verse.surahNameAr,
          arabicText: reflection.verse.arabicText,
          translationEn: reflection.verse.translationEn,
        } : undefined,
        reflections: [],
      };
      
      await saveIstikharaSession(session);
      
      Alert.alert(
        'Session Started',
        'Your istikhārah reflection period has begun. May Allah guide you to what is best.',
        [
          {
            text: 'Begin Reflections',
            onPress: () => router.push(`/istikhara-reflection/${session.id}`),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to start session. Please try again.');
    }
  };
  
  const handleBack = () => {
    if (step === 'decision') {
      router.back();
    } else if (step === 'selfcheck') {
      setStep('decision');
    } else if (step === 'timing') {
      setStep('selfcheck');
    } else if (step === 'intention') {
      setStep('timing');
    } else if (step === 'ready') {
      setStep('intention');
    }
  };
  
  const renderProgressBar = () => {
    const steps: WizardStep[] = ['decision', 'selfcheck', 'timing', 'intention', 'ready'];
    const currentIndex = steps.indexOf(step);
    const progress = ((currentIndex + 1) / steps.length) * 100;
    
    return (
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
          <View
            style={[
              styles.progressFill,
              { width: `${progress}%`, backgroundColor: colors.primary },
            ]}
          />
        </View>
        <Text style={[styles.progressText, { color: colors.textSecondary }]}>
          Step {currentIndex + 1} of {steps.length}
        </Text>
      </View>
    );
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            🕊️ Prepare for Istikhārah
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            Guided preparation flow
          </Text>
        </View>
      </View>
      
      {renderProgressBar()}
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* STEP 1: Decision Clarification */}
        {step === 'decision' && (
          <View style={[styles.stepCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.stepTitle, { color: colors.text }]}>
              What decision are you seeking clarity about?
            </Text>
            
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: colorScheme === 'dark' ? '#0f1419' : '#fafafa',
                  color: colors.text,
                },
              ]}
              placeholder="e.g., Accepting a new job opportunity"
              placeholderTextColor={colors.textSecondary}
              value={decisionText}
              onChangeText={setDecisionText}
              multiline
              maxLength={200}
              numberOfLines={4}
            />
            
            <Text style={[styles.charCount, { color: colors.textSecondary }]}>
              {decisionText.length}/200
            </Text>
            
            <View style={[styles.helperCard, { backgroundColor: '#fef3c7' }]}>
              <Ionicons name="information-circle" size={18} color="#f59e0b" />
              <Text style={[styles.helperText, { color: '#92400e' }]}>
                Istikhārah is for permissible decisions, not obligations or prohibitions.
              </Text>
            </View>
            
            <TouchableOpacity
              style={[
                styles.nextButton,
                {
                  backgroundColor: decisionText.trim() ? colors.primary : colors.textSecondary,
                  opacity: decisionText.trim() ? 1 : 0.5,
                },
              ]}
              onPress={handleNextFromDecision}
              disabled={!decisionText.trim()}
            >
              <Text style={styles.nextButtonText}>Next</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
        
        {/* STEP 2: Self-Check */}
        {step === 'selfcheck' && (
          <View style={[styles.stepCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.stepTitle, { color: colors.text }]}>
              Self-Reflection (Non-authoritative)
            </Text>
            
            <Text style={[styles.stepDesc, { color: colors.textSecondary }]}>
              Reflect honestly on these points. These are for your awareness only.
            </Text>
            
            <View style={styles.checkboxList}>
              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() =>
                  setSelfCheck((prev) => ({
                    ...prev,
                    notClearlyHaram: !prev.notClearlyHaram,
                  }))
                }
              >
                <Ionicons
                  name={selfCheck.notClearlyHaram ? 'checkbox' : 'square-outline'}
                  size={24}
                  color={colors.primary}
                />
                <Text style={[styles.checkboxText, { color: colors.text }]}>
                  This decision is not clearly ḥarām.
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() =>
                  setSelfCheck((prev) => ({
                    ...prev,
                    takenWorldlySteps: !prev.takenWorldlySteps,
                  }))
                }
              >
                <Ionicons
                  name={selfCheck.takenWorldlySteps ? 'checkbox' : 'square-outline'}
                  size={24}
                  color={colors.primary}
                />
                <Text style={[styles.checkboxText, { color: colors.text }]}>
                  I have taken reasonable worldly steps.
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() =>
                  setSelfCheck((prev) => ({
                    ...prev,
                    notRushing: !prev.notRushing,
                  }))
                }
              >
                <Ionicons
                  name={selfCheck.notRushing ? 'checkbox' : 'square-outline'}
                  size={24}
                  color={colors.primary}
                />
                <Text style={[styles.checkboxText, { color: colors.text }]}>
                  I am not rushing under pressure.
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={[styles.helperCard, { backgroundColor: '#dbeafe' }]}>
              <Ionicons name="heart-outline" size={18} color="#2563eb" />
              <Text style={[styles.helperText, { color: '#1e40af' }]}>
                These are self-reflections only, not religious requirements.
              </Text>
            </View>
            
            <TouchableOpacity
              style={[styles.nextButton, { backgroundColor: colors.primary }]}
              onPress={handleNextFromSelfCheck}
            >
              <Text style={styles.nextButtonText}>Continue</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
        
        {/* STEP 3: Timing Awareness */}
        {step === 'timing' && timingResult && (
          <>
            <View style={[styles.stepCard, { backgroundColor: colors.card }]}>
              <Text style={[styles.stepTitle, { color: colors.text }]}>
                Timing Awareness (Context Only)
              </Text>
              
              <Text style={[styles.stepDesc, { color: colors.textSecondary }]}>
                This timing insight is provided for awareness, not as a ruling.
              </Text>
            </View>
            
            <DivineTimingCard result={timingResult} colorScheme={colorScheme} />
            
            <View style={[styles.disclaimerCard, { backgroundColor: '#fee2e2' }]}>
              <Ionicons name="alert-circle" size={18} color="#dc2626" />
              <Text style={[styles.disclaimerText, { color: '#7f1d1d' }]}>
                This is observational context only. It does not dictate when you should or should not perform istikhārah.
              </Text>
            </View>
            
            <TouchableOpacity
              style={[styles.nextButton, { backgroundColor: colors.primary }]}
              onPress={handleNextFromTiming}
            >
              <Text style={styles.nextButtonText}>Continue</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </TouchableOpacity>
          </>
        )}
        
        {/* STEP 4: Intention Framing */}
        {step === 'intention' && (
          <View style={[styles.stepCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.stepTitle, { color: colors.text }]}>
              Frame Your Intention (Niyyah)
            </Text>
            
            <Text style={[styles.stepDesc, { color: colors.textSecondary }]}>
              This is NOT the duʿāʾ itself — only your intention framing.
            </Text>
            
            <TouchableOpacity
              style={styles.templateToggle}
              onPress={() => setUseTemplate(!useTemplate)}
            >
              <Ionicons
                name={useTemplate ? 'checkbox' : 'square-outline'}
                size={22}
                color={colors.primary}
              />
              <Text style={[styles.templateText, { color: colors.text }]}>
                Use guided template
              </Text>
            </TouchableOpacity>
            
            {useTemplate ? (
              <View style={[styles.templateCard, { backgroundColor: colorScheme === 'dark' ? '#0f1419' : '#fafafa' }]}>
                <Text style={[styles.templateContent, { color: colors.text }]}>
                  {INTENTION_TEMPLATE}
                </Text>
              </View>
            ) : (
              <>
                <TextInput
                  style={[
                    styles.textInput,
                    {
                      backgroundColor: colorScheme === 'dark' ? '#0f1419' : '#fafafa',
                      color: colors.text,
                    },
                  ]}
                  placeholder="Write your own intention..."
                  placeholderTextColor={colors.textSecondary}
                  value={intentionText}
                  onChangeText={setIntentionText}
                  multiline
                  numberOfLines={6}
                />
              </>
            )}
            
            <TouchableOpacity
              style={[styles.nextButton, { backgroundColor: colors.primary }]}
              onPress={handleNextFromIntention}
            >
              <Text style={styles.nextButtonText}>Continue</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
        
        {/* STEP 5: Ready */}
        {step === 'ready' && (
          <View style={[styles.stepCard, { backgroundColor: colors.card }]}>
            <View style={styles.readyIcon}>
              <Ionicons name="checkmark-circle" size={64} color="#10b981" />
            </View>
            
            <Text style={[styles.readyTitle, { color: colors.text }]}>
              You Are Prepared
            </Text>
            
            <Text style={[styles.readyText, { color: colors.textSecondary }]}>
              When ready, perform ṣalāt al-istikhārah as taught by the Prophet ﷺ.
            </Text>
            
            <View style={[styles.reminderCard, { backgroundColor: '#f0f9ff' }]}>
              <Text style={[styles.reminderText, { color: '#1e40af' }]}>
                Remember: Istikhārah is a prayer seeking Allah's guidance. This app supports your preparation and reflection, but does not replace the prayer itself.
              </Text>
            </View>
            
            <TouchableOpacity
              style={[styles.performedButton, { backgroundColor: '#10b981' }]}
              onPress={handlePerformed}
            >
              <Ionicons name="checkmark-done" size={20} color="#fff" />
              <Text style={styles.performedButtonText}>
                I have performed Istikhārah
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.laterButton, { borderColor: colors.textSecondary }]}
              onPress={() => router.back()}
            >
              <Text style={[styles.laterButtonText, { color: colors.text }]}>
                I'll do this later
              </Text>
            </TouchableOpacity>
          </View>
        )}
        
        {/* Bottom Padding */}
        <View style={{ height: 40 }} />
      </ScrollView>
      
      {/* Manual Verse Selector Modal */}
      <ManualVerseSelector
        visible={showVerseSelector}
        onClose={() => setShowVerseSelector(false)}
        onSelect={(surah, ayah) => {
          // Handle manual verse selection if needed
          setShowVerseSelector(false);
        }}
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
    fontSize: 22,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 14,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  progressText: {
    fontSize: 12,
    marginTop: 6,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 16,
  },
  stepCard: {
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 26,
  },
  stepDesc: {
    fontSize: 14,
    lineHeight: 20,
  },
  textInput: {
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 11,
    textAlign: 'right',
  },
  helperCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 12,
    borderRadius: 10,
  },
  helperText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  checkboxList: {
    gap: 16,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkboxText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  disclaimerCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 14,
    borderRadius: 12,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '500',
  },
  templateToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  templateText: {
    fontSize: 15,
    fontWeight: '500',
  },
  templateCard: {
    padding: 16,
    borderRadius: 12,
  },
  templateContent: {
    fontSize: 14,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  readyIcon: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  readyTitle: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  readyText: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  reminderCard: {
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  reminderText: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  performedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  performedButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  laterButton: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    marginTop: 8,
  },
  laterButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
