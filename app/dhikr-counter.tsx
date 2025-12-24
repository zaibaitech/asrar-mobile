/**
 * Full Dhikr Counter Screen
 * Advanced counter with progress tracking, milestones, and session history
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Modal,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import ResponsiveAppHeader from '../components/AppHeader';
import BottomTabBar from '../components/BottomTabBar';
import { DarkTheme, Spacing, Typography } from '../constants/DarkTheme';
import { useLanguage } from '../contexts/LanguageContext';

const DHIKR_STORAGE_KEY = '@asrar_dhikr_count';
const DHIKR_TARGET_KEY = '@asrar_dhikr_target';
const DHIKR_HISTORY_KEY = '@asrar_dhikr_history';

interface SessionHistory {
  date: string;
  count: number;
  duration: number;
  completed: boolean;
}

export default function DhikrCounterScreen() {
  const { language, setLanguage } = useLanguage();
  const router = useRouter();
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [history, setHistory] = useState<SessionHistory[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customAmount, setCustomAmount] = useState('');

  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(0);
  const progress = useSharedValue(0);

  // Load saved data
  useEffect(() => {
    loadData();
  }, []);

  // Save count whenever it changes
  useEffect(() => {
    if (count >= 0) {
      AsyncStorage.setItem(DHIKR_STORAGE_KEY, count.toString());
    }
  }, [count]);

  // Update progress animation
  useEffect(() => {
    const progressPercent = Math.min((count / target) * 100, 100);
    progress.value = withSpring(progressPercent);
    
    // Check for completion
    if (count >= target && count > 0 && !showCelebration) {
      handleCompletion();
    }
  }, [count, target]);

  const loadData = async () => {
    try {
      const [savedCount, savedTarget, savedHistory] = await Promise.all([
        AsyncStorage.getItem(DHIKR_STORAGE_KEY),
        AsyncStorage.getItem(DHIKR_TARGET_KEY),
        AsyncStorage.getItem(DHIKR_HISTORY_KEY),
      ]);

      if (savedCount) setCount(parseInt(savedCount, 10));
      if (savedTarget) setTarget(parseInt(savedTarget, 10));
      if (savedHistory) setHistory(JSON.parse(savedHistory));
    } catch (error) {
      console.error('Failed to load dhikr data:', error);
    }
  };

  const handleIncrement = () => {
    if (count === 0) {
      setSessionStartTime(new Date());
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCount(prev => prev + 1);

    // Animate
    scale.value = withSequence(
      withSpring(1.15, { damping: 8 }),
      withSpring(1, { damping: 8 })
    );

    glowOpacity.value = withSequence(
      withTiming(1, { duration: 100 }),
      withTiming(0, { duration: 600 })
    );
  };

  const handleCompletion = () => {
    setShowCelebration(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Save to history
    const session: SessionHistory = {
      date: new Date().toISOString(),
      count: target,
      duration: elapsedTime,
      completed: true,
    };

    const newHistory = [session, ...history].slice(0, 10);
    setHistory(newHistory);
    AsyncStorage.setItem(DHIKR_HISTORY_KEY, JSON.stringify(newHistory));

    setTimeout(() => setShowCelebration(false), 3000);
  };

  const handleReset = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setCount(0);
    setSessionStartTime(null);
    setElapsedTime(0);
    setShowCelebration(false);
    progress.value = 0;
  };

  const handleTargetChange = (newTarget: number) => {
    setTarget(newTarget);
    AsyncStorage.setItem(DHIKR_TARGET_KEY, newTarget.toString());
  };

  const handleCustomAmountSubmit = () => {
    const amount = parseInt(customAmount, 10);
    if (!isNaN(amount) && amount > 0) {
      handleTargetChange(amount);
      setShowCustomModal(false);
      setCustomAmount('');
    }
  };

  const animatedCountStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedGlowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  // SVG Circle calculations
  const size = 280;
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressPercent = Math.min((count / target) * 100, 100);
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  const targetOptions = [11, 33, 99, 100, 313, 1000];

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.outerContainer}>
        <ResponsiveAppHeader
          currentLanguage={language === 'en' ? 'EN' : 'FR'}
          onLanguageChange={(lang) => setLanguage(lang.toLowerCase() as 'en' | 'fr')}
          onProfilePress={() => router.push('/modal')}
          onMenuPress={() => console.log('Menu pressed')}
        />

        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
          {/* Main Counter Display */}
          <View style={styles.counterSection}>
            {/* Glow effect */}
            <Animated.View style={[styles.glow, animatedGlowStyle]} />

            {/* SVG Progress Circle */}
            <View style={styles.circleContainer}>
              <Svg width={size} height={size}>
                {/* Background circle */}
                <Circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth={strokeWidth}
                  fill="none"
                />
                {/* Progress circle */}
                <Circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke="#a78bfa"
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  rotation="-90"
                  origin={`${size / 2}, ${size / 2}`}
                />
              </Svg>

              {/* Counter in center */}
              <Animated.View style={[styles.counterCenter, animatedCountStyle]}>
                <Text style={styles.icon}>📿</Text>
                <Text style={styles.count}>{count}</Text>
                <Text style={styles.target}>of {target}</Text>
                <Text style={styles.dhikrLabel}>
                  {language === 'en' ? 'Dhikr Count' : 'Compte Dhikr'}
                </Text>
              </Animated.View>
            </View>

            {/* Tap to Count Button */}
            <Pressable style={styles.tapButton} onPress={handleIncrement}>
              <Text style={styles.tapButtonText}>
                {language === 'en' ? '👆 Tap to Count' : '👆 Touchez pour compter'}
              </Text>
            </Pressable>
          </View>

          {/* Target Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {language === 'en' ? 'Target Count' : 'Objectif'}
            </Text>
            <View style={styles.targetGrid}>
              {targetOptions.map((option) => (
                <Pressable
                  key={option}
                  style={[styles.targetButton, target === option && styles.targetButtonActive]}
                  onPress={() => handleTargetChange(option)}
                >
                  <Text
                    style={[
                      styles.targetButtonText,
                      target === option && styles.targetButtonTextActive,
                    ]}
                  >
                    {option}
                  </Text>
                </Pressable>
              ))}
              {/* Custom Amount Button */}
              <Pressable
                style={[
                  styles.targetButton,
                  !targetOptions.includes(target) && styles.targetButtonActive,
                  styles.customButton,
                ]}
                onPress={() => setShowCustomModal(true)}
              >
                <Text
                  style={[
                    styles.targetButtonText,
                    !targetOptions.includes(target) && styles.targetButtonTextActive,
                  ]}
                >
                  {!targetOptions.includes(target) ? target : (language === 'en' ? 'Custom' : 'Personnalisé')}
                </Text>
                <Text style={styles.customButtonIcon}>✏️</Text>
              </Pressable>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actionsRow}>
            <Pressable style={styles.resetButton} onPress={handleReset}>
              <Text style={styles.resetButtonText}>
                🔄 {language === 'en' ? 'Reset' : 'Réinitialiser'}
              </Text>
            </Pressable>
          </View>

          {/* Celebration Message */}
          {showCelebration && (
            <View style={styles.celebration}>
              <Text style={styles.celebrationText}>
                🎉 {language === 'en' ? 'Alhamdulillah! Completed!' : 'Alhamdulillah! Terminé!'}
              </Text>
            </View>
          )}

          {/* Custom Amount Modal */}
          <Modal
            visible={showCustomModal}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowCustomModal(false)}
          >
            <Pressable 
              style={styles.modalOverlay}
              onPress={() => setShowCustomModal(false)}
            >
              <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
                <Text style={styles.modalTitle}>
                  {language === 'en' ? 'Enter Custom Amount' : 'Entrez un montant personnalisé'}
                </Text>
                <TextInput
                  style={styles.modalInput}
                  value={customAmount}
                  onChangeText={setCustomAmount}
                  keyboardType="number-pad"
                  placeholder={language === 'en' ? 'Enter number...' : 'Entrez un nombre...'}
                  placeholderTextColor={DarkTheme.textMuted}
                  autoFocus
                />
                <View style={styles.modalButtons}>
                  <Pressable
                    style={styles.modalButtonCancel}
                    onPress={() => {
                      setShowCustomModal(false);
                      setCustomAmount('');
                    }}
                  >
                    <Text style={styles.modalButtonTextCancel}>
                      {language === 'en' ? 'Cancel' : 'Annuler'}
                    </Text>
                  </Pressable>
                  <Pressable
                    style={styles.modalButtonSubmit}
                    onPress={handleCustomAmountSubmit}
                  >
                    <Text style={styles.modalButtonTextSubmit}>
                      {language === 'en' ? 'Set' : 'Définir'}
                    </Text>
                  </Pressable>
                </View>
              </View>
            </Pressable>
          </Modal>

          {/* Recent Sessions */}
          {history.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {language === 'en' ? 'Recent Sessions' : 'Sessions récentes'}
              </Text>
              {history.slice(0, 5).map((session, index) => (
                <View key={index} style={styles.historyItem}>
                  <Text style={styles.historyDate}>
                    {new Date(session.date).toLocaleDateString()}
                  </Text>
                  <Text style={styles.historyCount}>
                    {session.count} {session.completed && '✓'}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        <BottomTabBar />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: DarkTheme.screenBackground,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  counterSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    position: 'relative',
  },
  glow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 300,
    height: 300,
    marginLeft: -150,
    marginTop: -150,
    backgroundColor: '#a78bfa',
    borderRadius: 150,
    opacity: 0,
  },
  circleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Spacing.xl,
  },
  counterCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 48,
    marginBottom: Spacing.sm,
  },
  count: {
    fontSize: 64,
    fontWeight: Typography.weightBold,
    color: DarkTheme.textPrimary,
  },
  target: {
    fontSize: Typography.h3,
    color: DarkTheme.textTertiary,
    marginTop: Spacing.xs,
  },
  dhikrLabel: {
    fontSize: Typography.label,
    color: DarkTheme.textMuted,
    marginTop: Spacing.xs,
  },
  tapButton: {
    backgroundColor: '#a78bfa',
    paddingHorizontal: Spacing.xxxl,
    paddingVertical: Spacing.lg,
    borderRadius: 30,
    marginTop: Spacing.lg,
  },
  tapButtonText: {
    fontSize: Typography.h3,
    fontWeight: Typography.weightSemibold,
    color: '#fff',
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.h3,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
    marginBottom: Spacing.md,
  },
  targetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  targetButton: {
    backgroundColor: DarkTheme.cardBackground,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 80,
    alignItems: 'center',
  },
  targetButtonActive: {
    borderColor: '#a78bfa',
    backgroundColor: 'rgba(167, 139, 250, 0.2)',
  },
  targetButtonText: {
    fontSize: Typography.body,
    fontWeight: Typography.weightMedium,
    color: DarkTheme.textSecondary,
  },
  targetButtonTextActive: {
    color: '#a78bfa',
    fontWeight: Typography.weightBold,
  },
  customButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  customButtonIcon: {
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: DarkTheme.cardBackground,
    borderRadius: 20,
    padding: Spacing.xl,
    width: '80%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: DarkTheme.borderSubtle,
  },
  modalTitle: {
    fontSize: Typography.h2,
    fontWeight: Typography.weightBold,
    color: DarkTheme.textPrimary,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  modalInput: {
    backgroundColor: DarkTheme.screenBackground,
    borderWidth: 2,
    borderColor: '#a78bfa',
    borderRadius: 12,
    padding: Spacing.lg,
    fontSize: Typography.h3,
    color: DarkTheme.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  modalButtonCancel: {
    flex: 1,
    backgroundColor: DarkTheme.screenBackground,
    paddingVertical: Spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: DarkTheme.borderSubtle,
  },
  modalButtonTextCancel: {
    fontSize: Typography.body,
    fontWeight: Typography.weightMedium,
    color: DarkTheme.textSecondary,
  },
  modalButtonSubmit: {
    flex: 1,
    backgroundColor: '#a78bfa',
    paddingVertical: Spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonTextSubmit: {
    fontSize: Typography.body,
    fontWeight: Typography.weightBold,
    color: '#fff',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  resetButton: {
    flex: 1,
    backgroundColor: DarkTheme.cardBackground,
    paddingVertical: Spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: DarkTheme.borderSubtle,
  },
  resetButtonText: {
    fontSize: Typography.body,
    fontWeight: Typography.weightMedium,
    color: DarkTheme.textSecondary,
  },
  celebration: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    padding: Spacing.lg,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#22c55e',
    marginBottom: Spacing.xl,
  },
  celebrationText: {
    fontSize: Typography.h3,
    fontWeight: Typography.weightBold,
    color: '#22c55e',
    textAlign: 'center',
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: DarkTheme.cardBackground,
    padding: Spacing.md,
    borderRadius: 12,
    marginBottom: Spacing.sm,
  },
  historyDate: {
    fontSize: Typography.label,
    color: DarkTheme.textTertiary,
  },
  historyCount: {
    fontSize: Typography.label,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
  },
});
