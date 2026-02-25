/**
 * Animated Splash Screen
 * ======================
 * Clean, spiritual auto-dismissing splash.
 * Gentle fade-in of logo + app name + Bismillah, then auto-fade-out.
 * No interaction needed — transitions seamlessly into the app.
 */

import { LinearGradient } from 'expo-linear-gradient';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text } from 'react-native';

const appLogo = require('../assets/images/logo_1024_transparent.png');

interface AnimatedSplashProps {
  onFinish: () => void;
}

export function AnimatedSplash({ onFinish }: AnimatedSplashProps) {
  const logoFade = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.85)).current;
  const textFade = useRef(new Animated.Value(0)).current;
  const bismillahFade = useRef(new Animated.Value(0)).current;
  const containerFade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    SplashScreen.preventAutoHideAsync();

    // Stage 1: Logo gently fades in and scales up (0–800ms)
    Animated.parallel([
      Animated.timing(logoFade, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
    ]).start();

    // Stage 2: Bismillah appears (400ms delay)
    const bismillahTimer = setTimeout(() => {
      Animated.timing(bismillahFade, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }, 400);

    // Stage 3: App name appears (700ms delay)
    const textTimer = setTimeout(() => {
      Animated.timing(textFade, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }, 700);

    // Stage 4: Hide native splash, then auto-dismiss after 2.2s total
    const dismissTimer = setTimeout(async () => {
      await SplashScreen.hideAsync();

      // Fade out the entire splash
      Animated.timing(containerFade, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        onFinish();
      });
    }, 2200);

    return () => {
      clearTimeout(bismillahTimer);
      clearTimeout(textTimer);
      clearTimeout(dismissTimer);
    };
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: containerFade }]}>
      <LinearGradient
        colors={['#0f172a', '#1a1040', '#1a1625']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.gradient}
      >
        {/* Bismillah — subtle, above the logo */}
        <Animated.Text style={[styles.bismillah, { opacity: bismillahFade }]}>
          بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
        </Animated.Text>

        {/* Logo — gentle fade + scale */}
        <Animated.View
          style={{
            opacity: logoFade,
            transform: [{ scale: logoScale }],
          }}
        >
          <Image source={appLogo} style={styles.logo} resizeMode="contain" />
        </Animated.View>

        {/* App name + tagline */}
        <Animated.View style={[styles.textContainer, { opacity: textFade }]}>
          <Text style={styles.appName}>Asrariya</Text>
          <Text style={styles.tagline}>أسراريّة</Text>
        </Animated.View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  bismillah: {
    fontSize: 18,
    color: 'rgba(196, 181, 253, 0.7)',
    fontWeight: '400',
    letterSpacing: 0.5,
    marginBottom: 32,
    textAlign: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  textContainer: {
    alignItems: 'center',
  },
  appName: {
    fontSize: 38,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 6,
  },
  tagline: {
    fontSize: 22,
    color: 'rgba(196, 181, 253, 0.8)',
    fontWeight: '500',
    letterSpacing: 1,
    textAlign: 'center',
  },
});
