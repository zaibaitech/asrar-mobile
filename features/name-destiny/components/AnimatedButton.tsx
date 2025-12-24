/**
 * Animated Button Component
 * Mobile Implementation - Expo Go 54
 */

import * as Haptics from 'expo-haptics';
import React, { useRef } from 'react';
import {
    Animated,
    GestureResponderEvent,
    TouchableOpacity,
    ViewStyle
} from 'react-native';

interface AnimatedButtonProps {
  onPress: (event: GestureResponderEvent) => void;
  children: React.ReactNode;
  style?: ViewStyle;
  activeOpacity?: number;
  hapticFeedback?: boolean;
  scaleAmount?: number;
}

export function AnimatedButton({
  onPress,
  children,
  style,
  activeOpacity = 0.8,
  hapticFeedback = true,
  scaleAmount = 0.95,
}: AnimatedButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (hapticFeedback) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    Animated.spring(scaleAnim, {
      toValue: scaleAmount,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      activeOpacity={activeOpacity}
      style={style}
    >
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
        }}
      >
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
}
