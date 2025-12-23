/**
 * QuickDhikrWidget Component
 * Tap-to-increment dhikr counter accessible from home screen
 * 
 * Spiritual significance:
 * - Encourages mindful remembrance throughout the day
 * - Provides haptic feedback for tactile engagement
 * - Saves count to persist across app sessions
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { DarkTheme, Spacing, Typography } from '../../constants/DarkTheme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const DHIKR_STORAGE_KEY = '@asrar_quick_dhikr_count';

export function QuickDhikrWidget() {
  const [count, setCount] = useState(0);
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(0);

  // Load count from storage on mount
  useEffect(() => {
    loadCount();
  }, []);

  // Save count whenever it changes
  useEffect(() => {
    if (count > 0) {
      saveCount(count);
    }
  }, [count]);

  const loadCount = async () => {
    try {
      const saved = await AsyncStorage.getItem(DHIKR_STORAGE_KEY);
      if (saved) {
        setCount(parseInt(saved, 10));
      }
    } catch (error) {
      console.error('Failed to load dhikr count:', error);
    }
  };

  const saveCount = async (value: number) => {
    try {
      await AsyncStorage.setItem(DHIKR_STORAGE_KEY, value.toString());
    } catch (error) {
      console.error('Failed to save dhikr count:', error);
    }
  };

  const handleIncrement = () => {
    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Increment count
    setCount(prev => prev + 1);
    
    // Animate
    scale.value = withSequence(
      withSpring(1.1, { damping: 10 }),
      withSpring(1, { damping: 10 })
    );
    
    glowOpacity.value = withSequence(
      withTiming(0.8, { duration: 100 }),
      withTiming(0, { duration: 400 })
    );
  };

  const handleReset = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCount(0);
    AsyncStorage.removeItem(DHIKR_STORAGE_KEY);
  };

  const animatedCounterStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedGlowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <View style={styles.container}>
      {/* Glow effect */}
      <Animated.View style={[styles.glow, animatedGlowStyle]} />
      
      {/* Counter display */}
      <AnimatedPressable
        onPress={handleIncrement}
        style={[styles.counter, animatedCounterStyle]}
      >
        <Text style={styles.icon}>📿</Text>
        <Animated.Text style={styles.count}>{count}</Animated.Text>
        <Text style={styles.label}>Dhikr</Text>
      </AnimatedPressable>
      
      {/* Reset button (only show if count > 0) */}
      {count > 0 && (
        <Pressable onPress={handleReset} style={styles.resetButton}>
          <Text style={styles.resetText}>Reset</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(45, 21, 21, 0.5)',
    borderRadius: 16,
    padding: Spacing.md,
    position: 'relative',
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#a78bfa',
    borderRadius: 16,
  },
  counter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 32,
    marginBottom: Spacing.xs,
  },
  count: {
    fontSize: 28,
    fontWeight: Typography.weightBold,
    color: DarkTheme.textPrimary,
    marginBottom: Spacing.xs,
  },
  label: {
    fontSize: Typography.caption,
    fontWeight: Typography.weightMedium,
    color: DarkTheme.textTertiary,
  },
  resetButton: {
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  resetText: {
    fontSize: Typography.caption,
    color: DarkTheme.textMuted,
    textDecorationLine: 'underline',
  },
});
