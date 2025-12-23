import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    Easing,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useLanguage } from '../../contexts/LanguageContext';
import { AsrarLogo } from '../AsrarLogo';

interface LoadingOverlayProps {
  visible: boolean;
  onComplete: () => void;
}

export default function LoadingOverlay({ visible, onComplete }: LoadingOverlayProps) {
  const { t, language } = useLanguage();
  const spinValue = useRef(new Animated.Value(0)).current;
  const pulseValue = useRef(new Animated.Value(1)).current;
  const fadeValue = useRef(new Animated.Value(0)).current;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (visible) {
      // Fade in overlay
      Animated.timing(fadeValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Start spinning animation
      const spinAnimation = Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 3000, // 3 seconds per rotation (slow spin)
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      spinAnimation.start();

      // Start pulsing animation (breathing effect)
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseValue, {
            toValue: 1.15,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseValue, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();

      // Animate progress from 0 to 100% over 5 seconds
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 2; // Increment by 2% every 100ms
        });
      }, 100);

      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        // Fade out before completing
        Animated.timing(fadeValue, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          onComplete();
          // Reset animations
          spinValue.setValue(0);
          pulseValue.setValue(1);
          setProgress(0);
        });
      }, 5000);

      return () => {
        clearTimeout(timer);
        clearInterval(progressInterval);
        spinAnimation.stop();
        pulseAnimation.stop();
      };
    } else {
      // Reset when not visible
      fadeValue.setValue(0);
      spinValue.setValue(0);
      pulseValue.setValue(1);
      setProgress(0);
    }
  }, [visible]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (!visible) return null;

  const loadingText = language === 'fr' 
    ? 'Calcul en cours...' 
    : 'Calculating...';

  const preparingText = language === 'fr'
    ? 'Préparation de votre profil spirituel'
    : 'Preparing your spiritual profile';

  return (
    <View 
      style={styles.overlay}
      pointerEvents="auto"
    >
      <View style={styles.content}>
        {/* BRIGHT VISIBLE INDICATOR */}
        <View style={styles.simpleIndicator}>
          <Text style={styles.testText}>⏳ LOADING ⏳</Text>
          <Text style={styles.testSubtext}>Loading animation active</Text>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>

        {/* Logo with spinning and pulsing animation */}
        <View style={styles.logoContainer}>
          <Animated.View
            style={{
              transform: [
                { rotate: spin },
                { scale: pulseValue },
              ],
            }}
          >
            <View style={styles.logoWrapper}>
              <AsrarLogo 
                size={120} 
                element="aether" 
                variant="icon"
              />
            </View>
          </Animated.View>

          {/* Glow effect */}
          <View style={styles.glowEffect} />
        </View>

        {/* Loading text */}
        <Text style={styles.loadingText}>{loadingText}</Text>
        <Text style={styles.subText}>{preparingText}</Text>

        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <View 
            style={[
              styles.progressBar, 
              { width: `${progress}%` }
            ]} 
          />
        </View>

        {/* Progress percentage */}
        <Text style={styles.progressText}>{Math.round(progress)}%</Text>

        {/* Mystical dots indicator */}
        <View style={styles.dotsContainer}>
          <View style={[styles.dot, progress > 33 && styles.dotActive]} />
          <View style={[styles.dot, progress > 66 && styles.dotActive]} />
          <View style={[styles.dot, progress > 99 && styles.dotActive]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject, // Ensure it covers everything
    backgroundColor: '#DC2626', // BRIGHT RED for maximum visibility
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999999,
    elevation: 999,
  },

  content: {
    alignItems: 'center',
    paddingHorizontal: 20,
    width: '100%',
  },

  simpleIndicator: {
    alignItems: 'center',
    marginBottom: 40,
    padding: 30,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '90%',
    borderWidth: 5,
    borderColor: '#000000',
  },

  testText: {
    fontSize: 40,
    fontWeight: '900',
    color: '#000000',
    marginBottom: 10,
    letterSpacing: 2,
    textAlign: 'center',
  },

  testSubtext: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 20,
    textAlign: 'center',
  },

  logoContainer: {
    position: 'relative',
    marginBottom: 40,
  },

  logoWrapper: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },

  glowEffect: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 180,
    height: 180,
    marginLeft: -90,
    marginTop: -90,
    borderRadius: 90,
    backgroundColor: '#7C3AED',
    opacity: 0.2,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 40,
    elevation: 20,
  },

  loadingText: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 0.5,
  },

  subText: {
    fontSize: 15,
    color: '#9CA3AF',
    fontWeight: '400',
    marginBottom: 32,
    textAlign: 'center',
  },

  progressContainer: {
    width: 240,
    height: 4,
    backgroundColor: '#374151',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 12,
  },

  progressBar: {
    height: '100%',
    backgroundColor: '#7C3AED',
    borderRadius: 2,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },

  progressText: {
    fontSize: 14,
    color: '#7C3AED',
    fontWeight: '600',
    marginBottom: 24,
  },

  dotsContainer: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#374151',
  },

  dotActive: {
    backgroundColor: '#7C3AED',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    transform: [{ scale: 1.3 }],
  },
});
