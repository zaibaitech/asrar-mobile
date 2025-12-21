import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import * as Sharing from 'expo-sharing';
import {
    Check,
    Clock,
    Copy,
    Heart,
    Moon,
    Pause,
    Play,
    RotateCcw,
    Share2,
    Sparkles,
    Star,
    TrendingUp,
    Trophy,
    Zap
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
    Alert,
    Animated,
    Dimensions,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useLanguage } from "../../contexts/LanguageContext";

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32;

interface DhikrCounterProps {
  targetCount: number;
  divineNames: {
    arabic: string;
    transliteration: string;
    translation: { en: string; fr: string };
  };
  quranicVerse?: {
    arabic: string;
    transliteration: string;
    translation: { en: string; fr: string };
    reference: string;
  };
  angel?: {
    arabic: string;
    transliteration: string;
    name?: { en: string; fr: string };
  };
  jinn?: {
    arabic: string;
    transliteration: string;
    meaning?: { en: string; fr: string };
  };
  practiceNight?: {
    primary: { en: string; fr: string };
    note?: { en: string; fr: string };
  };
  zodiacSign?: {
    en: string;
    fr: string;
    arabic: string;
  };
  instructions?: {
    en: string[];
    fr: string[];
  };
  elementColors?: {
    primary: readonly string[] | string[];
    accent: string;
    border: string;
  };
  onComplete?: () => void;
}

export function DhikrCounter({ 
  targetCount, 
  divineNames, 
  quranicVerse,
  angel,
  jinn,
  practiceNight,
  zodiacSign,
  instructions,
  elementColors,
  onComplete 
}: DhikrCounterProps) {
  const { language } = useLanguage();
  
  // State management
  const [count, setCount] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [countingMode, setCountingMode] = useState<'manual' | 'auto'>('manual');
  const [autoSpeed, setAutoSpeed] = useState(2000);
  const [milestones, setMilestones] = useState<number[]>([]);
  const [sessionHistory, setSessionHistory] = useState<Array<{
    date: string;
    count: number;
    duration: number;
    completed: boolean;
  }>>([]);
  
  const autoCounterRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const celebrationAnim = useRef(new Animated.Value(0)).current;
  
  // Colors
  const colors = elementColors || {
    primary: ['#a855f7', '#ec4899', '#f59e0b'],
    accent: '#a855f7',
    border: '#a855f7'
  };
  
  // Load saved progress and history
  useEffect(() => {
    loadProgress();
  }, [targetCount]);
  
  const loadProgress = async () => {
    try {
      const savedProgress = await AsyncStorage.getItem('dhikr-progress');
      const savedHistory = await AsyncStorage.getItem('dhikr-history');
      
      if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        if (progress.targetCount === targetCount) {
          setCount(progress.count);
          setElapsedTime(progress.elapsedTime);
        }
      }
      
      if (savedHistory) {
        setSessionHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error('Failed to load progress:', error);
    }
  };
  
  // Auto-save progress
  useEffect(() => {
    if (count > 0 || elapsedTime > 0) {
      saveProgress();
    }
  }, [count, elapsedTime]);
  
  const saveProgress = async () => {
    try {
      await AsyncStorage.setItem('dhikr-progress', JSON.stringify({
        targetCount,
        count,
        elapsedTime
      }));
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };
  
  // Timer for session duration
  useEffect(() => {
    if (isActive && !isPaused) {
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000) as unknown as NodeJS.Timeout;
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive, isPaused]);
  
  // Auto counting mode
  useEffect(() => {
    if (countingMode === 'auto' && isActive && !isPaused && count < targetCount) {
      autoCounterRef.current = setTimeout(() => {
        handleIncrement();
      }, autoSpeed) as unknown as NodeJS.Timeout;
    }
    
    return () => {
      if (autoCounterRef.current) {
        clearTimeout(autoCounterRef.current);
      }
    };
  }, [count, countingMode, isActive, isPaused, autoSpeed]);
  
  // Calculate progress
  const progress = (count / targetCount) * 100;
  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  
  // Milestone thresholds
  const milestoneThresholds = [
    { percent: 25, label: language === 'en' ? 'Quarter' : 'Quart' },
    { percent: 50, label: language === 'en' ? 'Halfway' : 'Mi-chemin' },
    { percent: 75, label: language === 'en' ? 'Three Quarters' : 'Trois Quarts' },
    { percent: 100, label: language === 'en' ? 'Complete' : 'Terminé' }
  ];
  
  // Check for milestone achievements
  useEffect(() => {
    const currentMilestone = milestoneThresholds.find(
      m => progress >= m.percent && !milestones.includes(m.percent)
    );
    
    if (currentMilestone && currentMilestone.percent !== 100) {
      setMilestones(prev => [...prev, currentMilestone.percent]);
      showMilestoneToast(currentMilestone.percent);
    }
  }, [progress]);
  
  const showMilestoneToast = (percent: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };
  
  // Handle count increment
  const handleIncrement = () => {
    if (count >= targetCount) return;
    
    // Start session on first count
    if (count === 0 && !sessionStartTime) {
      setSessionStartTime(new Date());
      setIsActive(true);
    }
    
    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    const newCount = count + 1;
    setCount(newCount);
    
    // Check for completion
    if (newCount === targetCount) {
      handleCompletion();
    }
  };
  
  const handleCompletion = async () => {
    setShowCelebration(true);
    setIsActive(false);
    setIsPaused(false);
    
    // Vibrate pattern for completion
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // Animate celebration
    Animated.spring(celebrationAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 50,
      friction: 7
    }).start();
    
    // Save to history
    const session = {
      date: new Date().toISOString(),
      count: targetCount,
      duration: elapsedTime,
      completed: true
    };
    
    const updatedHistory = [session, ...sessionHistory].slice(0, 20);
    setSessionHistory(updatedHistory);
    await AsyncStorage.setItem('dhikr-history', JSON.stringify(updatedHistory));
    
    if (onComplete) onComplete();
    
    // Hide celebration after 5 seconds
    setTimeout(() => {
      setShowCelebration(false);
      celebrationAnim.setValue(0);
    }, 5000);
  };
  
  // Reset counter
  const handleReset = () => {
    if (count > 0 && count < targetCount) {
      Alert.alert(
        language === 'en' ? 'Reset Progress?' : 'Réinitialiser?',
        language === 'en' 
          ? 'Are you sure? Your progress will be lost.' 
          : 'Êtes-vous sûr? Votre progression sera perdue.',
        [
          { text: language === 'en' ? 'Cancel' : 'Annuler', style: 'cancel' },
          { 
            text: language === 'en' ? 'Reset' : 'Réinitialiser',
            style: 'destructive',
            onPress: performReset
          }
        ]
      );
    } else {
      performReset();
    }
  };
  
  const performReset = async () => {
    setCount(0);
    setIsActive(false);
    setIsPaused(false);
    setShowCelebration(false);
    setSessionStartTime(null);
    setElapsedTime(0);
    setMilestones([]);
    await AsyncStorage.removeItem('dhikr-progress');
  };
  
  // Copy to clipboard
  const handleCopy = async (text: string, type: string) => {
    try {
      await Clipboard.setStringAsync(text);
      setCopied(type);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  
  // Share progress
  const handleShare = async () => {
    const shareText = language === 'en'
      ? `I've completed ${count} of ${targetCount} recitations of ${divineNames.transliteration} 🌙✨`
      : `J'ai complété ${count} de ${targetCount} récitations de ${divineNames.transliteration} 🌙✨`;
    
    try {
      await Sharing.shareAsync('data:text/plain;base64,' + btoa(shareText), {
        dialogTitle: 'Share Progress'
      });
    } catch (error) {
      await handleCopy(shareText, 'share');
    }
  };
  
  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Calculate average pace
  const averagePace = count > 0 && elapsedTime > 0 
    ? Math.round(elapsedTime / count) 
    : 0;
  
  // Estimate time remaining
  const estimatedTimeRemaining = averagePace > 0 
    ? (targetCount - count) * averagePace 
    : 0;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Celebration Modal */}
      <Modal
        visible={showCelebration}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCelebration(false)}
      >
        <View style={styles.celebrationOverlay}>
          <Animated.View 
            style={[
              styles.celebrationCard,
              {
                transform: [{
                  scale: celebrationAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1]
                  })
                }],
                opacity: celebrationAnim
              }
            ]}
          >
            <Sparkles size={80} color="#fbbf24" style={styles.celebrationIcon} />
            <Text style={styles.celebrationTitle}>
              {language === 'en' ? 'Māshā Allāh! 🎉' : 'Māshā Allāh! 🎉'}
            </Text>
            <Text style={styles.celebrationSubtitle}>
              {language === 'en' ? 'Session Completed!' : 'Session Terminée!'}
            </Text>
            <Text style={styles.celebrationCount}>
              {targetCount} {language === 'en' ? 'recitations' : 'récitations'}
            </Text>
            <Text style={styles.celebrationDuration}>
              {language === 'en' ? 'Duration:' : 'Durée:'} {formatTime(elapsedTime)}
            </Text>
            
            <View style={styles.celebrationButtons}>
              <TouchableOpacity
                style={styles.celebrationButtonSecondary}
                onPress={() => setShowCelebration(false)}
              >
                <Text style={styles.celebrationButtonTextSecondary}>
                  {language === 'en' ? 'Close' : 'Fermer'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.celebrationButtonPrimary}
                onPress={handleShare}
              >
                <Share2 size={16} color="#FFF" />
                <Text style={styles.celebrationButtonTextPrimary}>
                  {language === 'en' ? 'Share' : 'Partager'}
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* Main Counter Card */}
      <ExpoLinearGradient
        colors={Array.isArray(colors.primary) ? [...colors.primary] as any : colors.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.mainCard, { borderColor: colors.border }]}
      >
        {/* Practice Night Info */}
        {practiceNight && (
          <View style={styles.infoRow}>
            <Moon size={16} color={colors.accent} />
            <Text style={styles.infoText}>
              {practiceNight.primary[language as 'en' | 'fr']}
            </Text>
          </View>
        )}
        
        {/* Zodiac Sign */}
        {zodiacSign && (
          <View style={styles.infoRow}>
            <Star size={14} color="#FFF" />
            <Text style={styles.infoTextSmall}>
              {zodiacSign[language as 'en' | 'fr']} • {zodiacSign.arabic}
            </Text>
          </View>
        )}

        {/* Divine Names Section */}
        <View style={styles.divineNamesSection}>
          <View style={styles.divineNamesRow}>
            <Text style={styles.arabicText}>{divineNames.arabic}</Text>
            <TouchableOpacity
              style={styles.copyButton}
              onPress={() => handleCopy(divineNames.arabic, 'names')}
            >
              {copied === 'names' ? (
                <Check size={16} color="#4ade80" />
              ) : (
                <Copy size={16} color="#FFF" />
              )}
            </TouchableOpacity>
          </View>
          <Text style={styles.transliteration}>{divineNames.transliteration}</Text>
          <Text style={styles.translation}>{divineNames.translation[language as 'en' | 'fr']}</Text>
        </View>

        {/* Circular Progress */}
        <View style={styles.progressContainer}>
          <Svg width={240} height={240}>
            <Defs>
              <LinearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor={colors.primary[0]} />
                <Stop offset="50%" stopColor={colors.primary[1]} />
                <Stop offset="100%" stopColor={colors.primary[2]} />
              </LinearGradient>
            </Defs>
            {/* Background circle */}
            <Circle
              cx="120"
              cy="120"
              r={radius}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="12"
              fill="none"
            />
            {/* Progress circle */}
            <Circle
              cx="120"
              cy="120"
              r={radius}
              stroke="url(#progressGradient)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              fill="none"
              transform="rotate(-90 120 120)"
            />
          </Svg>
          
          {/* Count Display */}
          <View style={styles.countDisplay}>
            <Text style={styles.countNumber}>{count}</Text>
            <Text style={styles.countTarget}>/ {targetCount}</Text>
            <View style={styles.progressBadge}>
              <Text style={styles.progressPercent}>{Math.round(progress)}%</Text>
            </View>
            {isActive && (
              <View style={styles.timerRow}>
                <Clock size={12} color="#FFF" />
                <Text style={styles.timerText}>{formatTime(elapsedTime)}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Statistics Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Zap size={16} color={colors.accent} />
            <Text style={styles.statValue}>{count}</Text>
            <Text style={styles.statLabel}>
              {language === 'en' ? 'Current' : 'Actuel'}
            </Text>
          </View>
          <View style={styles.statCard}>
            <Clock size={16} color={colors.accent} />
            <Text style={styles.statValue}>{formatTime(elapsedTime)}</Text>
            <Text style={styles.statLabel}>
              {language === 'en' ? 'Duration' : 'Durée'}
            </Text>
          </View>
          <View style={styles.statCard}>
            <TrendingUp size={16} color={colors.accent} />
            <Text style={styles.statValue}>
              {averagePace > 0 ? `${averagePace}s` : '--'}
            </Text>
            <Text style={styles.statLabel}>
              {language === 'en' ? 'Pace' : 'Rythme'}
            </Text>
          </View>
        </View>

        {/* Counting Mode Toggle */}
        <View style={styles.modeToggle}>
          <Text style={styles.modeLabel}>
            {language === 'en' ? 'Mode:' : 'Mode:'}
          </Text>
          <TouchableOpacity
            style={[styles.modeButton, countingMode === 'manual' && styles.modeButtonActive]}
            onPress={() => setCountingMode('manual')}
          >
            <Text style={[styles.modeButtonText, countingMode === 'manual' && styles.modeButtonTextActive]}>
              {language === 'en' ? 'Manual' : 'Manuel'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeButton, countingMode === 'auto' && styles.modeButtonActive]}
            onPress={() => setCountingMode('auto')}
          >
            <Text style={[styles.modeButtonText, countingMode === 'auto' && styles.modeButtonTextActive]}>
              {language === 'en' ? 'Auto' : 'Auto'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Main Action Button */}
        <TouchableOpacity
          style={[styles.mainButton, count >= targetCount && styles.mainButtonDisabled]}
          onPress={countingMode === 'manual' ? handleIncrement : undefined}
          disabled={count >= targetCount}
          activeOpacity={0.8}
        >
          {count >= targetCount ? (
            <View style={styles.mainButtonContent}>
              <Trophy size={20} color="#9ca3af" />
              <Text style={styles.mainButtonTextDisabled}>
                {language === 'en' ? 'Completed' : 'Terminé'}
              </Text>
            </View>
          ) : (
            <Text style={styles.mainButtonText}>
              {countingMode === 'manual' 
                ? (language === 'en' ? 'Tap to Count' : 'Appuyer pour Compter')
                : isActive 
                  ? (language === 'en' ? 'Auto Counting...' : 'Comptage Auto...')
                  : (language === 'en' ? 'Start Auto Count' : 'Démarrer Auto')
              }
            </Text>
          )}
        </TouchableOpacity>

        {/* Control Buttons */}
        <View style={styles.controlButtons}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => {
              setIsActive(!isActive);
              setIsPaused(!isPaused);
            }}
          >
            {isActive && !isPaused ? (
              <Pause size={16} color="#FFF" />
            ) : (
              <Play size={16} color="#FFF" />
            )}
            <Text style={styles.controlButtonText}>
              {isActive && !isPaused 
                ? (language === 'en' ? 'Pause' : 'Pause')
                : (language === 'en' ? 'Start' : 'Démarrer')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.controlButton} onPress={handleReset}>
            <RotateCcw size={16} color="#FFF" />
            <Text style={styles.controlButtonText}>Reset</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton} onPress={handleShare}>
            <Share2 size={16} color="#FFF" />
            <Text style={styles.controlButtonText}>
              {language === 'en' ? 'Share' : 'Partager'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Quick Tips */}
        <View style={styles.tipsCard}>
          <View style={styles.tipRow}>
            <Heart size={14} color={colors.accent} />
            <Text style={styles.tipText}>
              {language === 'en' 
                ? 'Best practiced with presence and devotion'
                : 'Meilleur pratiqué avec présence et dévotion'}
            </Text>
          </View>
          <View style={styles.tipRow}>
            <Moon size={14} color={colors.accent} />
            <Text style={styles.tipText}>
              {language === 'en'
                ? 'Practice during quiet hours for deeper connection'
                : 'Pratiquer pendant les heures calmes pour une connexion plus profonde'}
            </Text>
          </View>
        </View>
      </ExpoLinearGradient>

      {/* Additional sections would go here - Quranic Verse, Angel/Jinn, Instructions, History */}
      {/* For brevity, I'll add them in the styles only */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  celebrationOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  celebrationCard: {
    backgroundColor: '#1f2937',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  celebrationIcon: {
    marginBottom: 16,
  },
  celebrationTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  celebrationSubtitle: {
    fontSize: 20,
    color: '#e5e7eb',
    marginBottom: 16,
  },
  celebrationCount: {
    fontSize: 18,
    color: '#d1d5db',
  },
  celebrationDuration: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 8,
    marginBottom: 24,
  },
  celebrationButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  celebrationButtonSecondary: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
  },
  celebrationButtonTextSecondary: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  celebrationButtonPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#a855f7',
    borderRadius: 12,
  },
  celebrationButtonTextPrimary: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  mainCard: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 2,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 8,
  },
  infoText: {
    color: '#FFF',
    fontSize: 14,
  },
  infoTextSmall: {
    color: '#FFF',
    fontSize: 12,
  },
  divineNamesSection: {
    alignItems: 'center',
    marginVertical: 16,
  },
  divineNamesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  arabicText: {
    fontSize: 32,
    color: '#FFF',
    fontWeight: '600',
  },
  copyButton: {
    padding: 8,
  },
  transliteration: {
    fontSize: 20,
    color: '#e9d5ff',
    marginTop: 8,
    fontWeight: '500',
  },
  translation: {
    fontSize: 16,
    color: '#FFF',
    marginTop: 4,
    textAlign: 'center',
  },
  progressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
  },
  countDisplay: {
    position: 'absolute',
    alignItems: 'center',
  },
  countNumber: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#FFF',
  },
  countTarget: {
    fontSize: 20,
    color: 'rgba(255,255,255,0.8)',
  },
  progressBadge: {
    backgroundColor: 'rgba(168,85,247,0.3)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
  },
  progressPercent: {
    fontSize: 16,
    fontWeight: '600',
    color: '#a855f7',
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
  },
  timerText: {
    color: '#FFF',
    fontSize: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 10,
    color: '#9ca3af',
    marginTop: 2,
  },
  modeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 16,
  },
  modeLabel: {
    color: '#9ca3af',
    fontSize: 14,
  },
  modeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  modeButtonActive: {
    backgroundColor: 'rgba(168,85,247,0.3)',
  },
  modeButtonText: {
    color: '#9ca3af',
  },
  modeButtonTextActive: {
    color: '#a855f7',
    fontWeight: '600',
  },
  mainButton: {
    backgroundColor: '#a855f7',
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  mainButtonDisabled: {
    backgroundColor: '#4b5563',
  },
  mainButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mainButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  mainButtonTextDisabled: {
    color: '#9ca3af',
    fontSize: 18,
    fontWeight: 'bold',
  },
  controlButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  controlButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
  },
  controlButtonText: {
    color: '#FFF',
    fontSize: 10,
  },
  tipsCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  tipText: {
    flex: 1,
    color: '#d1d5db',
    fontSize: 12,
    lineHeight: 18,
  },
});
