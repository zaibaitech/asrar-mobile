/**
 * Animation Utilities for Name Destiny Feature
 * Mobile Implementation - Expo Go 54
 */

import { Animated, Easing } from 'react-native';

/**
 * Fade in animation
 */
export function createFadeInAnimation(
  animatedValue: Animated.Value,
  duration: number = 300
): Animated.CompositeAnimation {
  return Animated.timing(animatedValue, {
    toValue: 1,
    duration,
    easing: Easing.out(Easing.ease),
    useNativeDriver: true,
  });
}

/**
 * Fade out animation
 */
export function createFadeOutAnimation(
  animatedValue: Animated.Value,
  duration: number = 200
): Animated.CompositeAnimation {
  return Animated.timing(animatedValue, {
    toValue: 0,
    duration,
    easing: Easing.in(Easing.ease),
    useNativeDriver: true,
  });
}

/**
 * Scale animation for button press
 */
export function createScaleAnimation(
  animatedValue: Animated.Value,
  toValue: number,
  duration: number = 100
): Animated.CompositeAnimation {
  return Animated.spring(animatedValue, {
    toValue,
    friction: 3,
    tension: 40,
    useNativeDriver: true,
  });
}

/**
 * Slide in from bottom animation
 */
export function createSlideUpAnimation(
  animatedValue: Animated.Value,
  duration: number = 400
): Animated.CompositeAnimation {
  return Animated.timing(animatedValue, {
    toValue: 0,
    duration,
    easing: Easing.out(Easing.back(1.1)),
    useNativeDriver: true,
  });
}

/**
 * Slide in from right animation
 */
export function createSlideInAnimation(
  animatedValue: Animated.Value,
  duration: number = 350
): Animated.CompositeAnimation {
  return Animated.timing(animatedValue, {
    toValue: 0,
    duration,
    easing: Easing.out(Easing.cubic),
    useNativeDriver: true,
  });
}

/**
 * Pulse animation for loading states
 */
export function createPulseAnimation(
  animatedValue: Animated.Value
): Animated.CompositeAnimation {
  return Animated.loop(
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1.05,
        duration: 800,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 800,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ])
  );
}

/**
 * Stagger animation for list items
 */
export function createStaggerAnimation(
  animations: Animated.CompositeAnimation[],
  staggerDelay: number = 50
): Animated.CompositeAnimation {
  return Animated.stagger(staggerDelay, animations);
}

/**
 * Spring bounce animation
 */
export function createBounceAnimation(
  animatedValue: Animated.Value,
  toValue: number = 1
): Animated.CompositeAnimation {
  return Animated.spring(animatedValue, {
    toValue,
    friction: 4,
    tension: 50,
    useNativeDriver: true,
  });
}

/**
 * Rotate animation (for loading spinner)
 */
export function createRotateAnimation(
  animatedValue: Animated.Value
): Animated.CompositeAnimation {
  return Animated.loop(
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: true,
    })
  );
}
