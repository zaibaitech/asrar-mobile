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
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue
} from 'react-native-reanimated';
import { DarkTheme, Spacing, Typography } from '../../constants/DarkTheme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const DHIKR_STORAGE_KEY = '@asrar_dhikr_count';

export function QuickDhikrWidget() {
  const router = useRouter();
  const [count, setCount] = useState(0);
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(0);

  // Load count from storage on mount
  useEffect(() => {
    loadCount();
  }, []);

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

  const handlePress = () => {
    // Navigate to full dhikr counter screen
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/dhikr-counter');
  };

  const animatedCounterStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedGlowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <Pressable onPress={handlePress} style={styles.container}>
      {/* Glow effect */}
      <Animated.View style={[styles.glow, animatedGlowStyle]} />
      
      {/* Counter display */}
      <View style={styles.counter}>
        <Text style={styles.icon}>📿</Text>
        <Animated.Text style={styles.count}>{count}</Animated.Text>
        <Text style={styles.label}>Dhikr Counter</Text>
        <Text style={styles.hint}>Tap to open</Text>
      </View>
    </Pressable>
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
    marginBottom: Spacing.xs,
  },
  hint: {
    fontSize: 10,
    color: DarkTheme.textMuted,
    fontStyle: 'italic',
  },
});