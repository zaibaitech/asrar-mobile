/**
 * Animated Splash Screen Component
 * Mobile Implementation - Expo Go 54
 * Enhanced Welcome Screen with Get Started
 */

import { useLanguage } from '@/contexts/LanguageContext';
import { LinearGradient } from 'expo-linear-gradient';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const appLogo = require('../assets/images/logo_1024_transparent.png');

const { width, height } = Dimensions.get('window');

interface AnimatedSplashProps {
  onFinish: () => void;
}

export function AnimatedSplash({ onFinish }: AnimatedSplashProps) {
  const { t } = useLanguage();
  const [showWelcome, setShowWelcome] = useState(false);
  
  // Phase 1: Logo animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1.5)).current;
  const logoRotateAnim = useRef(new Animated.Value(0)).current;
  
  // Phase 2: Welcome screen
  const welcomeFadeAnim = useRef(new Animated.Value(0)).current;
  const buttonSlideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    SplashScreen.preventAutoHideAsync();

    // Phase 1: Logo zoom out animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(logoRotateAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]).start();

    // Transition to welcome screen after 1.5s
    const timer = setTimeout(async () => {
      await SplashScreen.hideAsync();
      setShowWelcome(true);
      
      // Fade in welcome content
      Animated.parallel([
        Animated.timing(welcomeFadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(buttonSlideAnim, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const logoRotate = logoRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={styles.container}>
      <LinearGradient
        colors={['#0f172a', '#1e1b4b', '#1a1625']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {!showWelcome ? (
          // Phase 1: Animated Logo
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [
                { scale: scaleAnim },
                { rotate: logoRotate },
              ],
            }}
          >
            <Image source={appLogo} style={styles.logo} resizeMode="contain" />
            <Animated.Text
              style={[
                styles.appName,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              <Text style={styles.welcomeTitle}>{t('onboarding.splash.appName')}</Text>
            </Animated.Text>
          </Animated.View>
        ) : (
          // Phase 2: Welcome Screen
          <Animated.View style={[styles.welcomeContainer, { opacity: welcomeFadeAnim }]}>
            <Image source={appLogo} style={styles.welcomeLogo} resizeMode="contain" />
            
            <Text style={styles.welcomeTitle}>{t('onboarding.splash.appName')}</Text>
            <Text style={styles.welcomeSubtitle}>{t('onboarding.splash.subtitle')}</Text>
            
            <View style={styles.descriptionContainer}>
              <Text style={styles.welcomeDescription}>
                {t('onboarding.splash.description')}
              </Text>
              
              <View style={styles.featuresContainer}>
                <FeatureItem icon="✨" text={t('onboarding.splash.features.calculator')} />
                <FeatureItem icon="🌙" text={t('onboarding.splash.features.timing')} />
                <FeatureItem icon="🔮" text={t('onboarding.splash.features.insights')} />
              </View>
            </View>

            <Animated.View
              style={{
                transform: [{ translateY: buttonSlideAnim }],
                opacity: welcomeFadeAnim,
              }}
            >
              <TouchableOpacity
                style={styles.getStartedButton}
                onPress={onFinish}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#8B5CF6', '#7C3AED']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.buttonText}>{t('onboarding.splash.getStarted')}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        )}
      </LinearGradient>
    </Animated.View>
  );
}

const FeatureItem = ({ icon, text }: { icon: string; text: string }) => (
  <View style={styles.featureItem}>
    <Text style={styles.featureIcon}>{icon}</Text>
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

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
    padding: 20,
  },
  // Phase 1: Logo Animation
  logo: {
    width: 140,
    height: 140,
    alignSelf: 'center',
    marginBottom: 20,
  },
  appName: {
    fontSize: 48,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 2,
    textAlign: 'center',
    textShadowColor: 'rgba(139, 92, 246, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  // Phase 2: Welcome Screen
  welcomeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 24,
  },
  welcomeLogo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 42,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 1.5,
    marginBottom: 8,
    textShadowColor: 'rgba(139, 92, 246, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#c4b5fd',
    letterSpacing: 1.2,
    marginBottom: 40,
    fontWeight: '500',
  },
  descriptionContainer: {
    width: '100%',
    marginBottom: 40,
  },
  welcomeDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  featuresContainer: {
    width: '100%',
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  featureText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
    flex: 1,
  },
  getStartedButton: {
    width: width - 48,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
});
