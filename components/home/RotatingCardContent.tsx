/**
 * Rotating Card Content Component
 * =================================
 * Crossfades between two slides with configurable interval
 * Shows dots indicator and handles tap interactions
 * 
 * BATTERY OPTIMIZATION (Feb 2026):
 * - Pauses rotation when app is in background via AppState
 * - Uses longer default interval (12s instead of 8s)
 */

import React, { useEffect, useRef, useState } from 'react';
import { Animated, AppState, AppStateStatus, StyleSheet, View } from 'react-native';

interface RotatingCardContentProps {
  /** Array of exactly 2 slides to rotate between */
  slides: React.ReactNode[];
  /** Rotation interval in milliseconds (default 12000ms - battery optimized) */
  intervalMs?: number;
  /** Whether to show slide dots indicator */
  showDots?: boolean;
  /** Callback when slide changes */
  onSlideChange?: (slideIndex: number) => void;
  /** Pause rotation (e.g., during user interaction) */
  paused?: boolean;
}

export function RotatingCardContent({
  slides,
  intervalMs = 12000, // BATTERY OPTIMIZATION: Increased from 8000 to 12000
  showDots = true,
  onSlideChange,
  paused = false,
}: RotatingCardContentProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  // BATTERY OPTIMIZATION: Track app state to pause when backgrounded
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const [isAppActive, setIsAppActive] = useState(true);
  
  // BATTERY OPTIMIZATION: Listen to app state changes
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      appStateRef.current = nextAppState;
      setIsAppActive(nextAppState === 'active');
    });
    
    return () => subscription.remove();
  }, []);
  
  useEffect(() => {
    if (slides.length !== 2) {
      console.warn('RotatingCardContent expects exactly 2 slides');
      return;
    }
    
    // BATTERY OPTIMIZATION: Don't run interval when paused or app is backgrounded
    if (paused || !isAppActive) return;
    
    const interval = setInterval(() => {
      // Double-check app is still active before animating
      if (appStateRef.current !== 'active') return;
      
      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        // Switch slide
        const next = activeIndexRef.current === 0 ? 1 : 0;
        activeIndexRef.current = next;
        setActiveIndex(next);
        onSlideChange?.(next);
        
        // Fade in
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }, intervalMs);
    
    return () => clearInterval(interval);
  }, [slides.length, intervalMs, paused, isAppActive, fadeAnim, onSlideChange]);
  
  return (
    <View style={styles.container}>
      <Animated.View style={[styles.slideContainer, { opacity: fadeAnim }]}>
        {slides[activeIndex]}
      </Animated.View>
      
      {showDots && (
        <View style={styles.dotsContainer}>
          <View style={[styles.dot, activeIndex === 0 && styles.dotActive]} />
          <View style={[styles.dot, activeIndex === 1 && styles.dotActive]} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  slideContainer: {
    flex: 1,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dotActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
