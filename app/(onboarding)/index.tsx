/**
 * Onboarding Screen - Premium Edition v3.0
 * =========================================
 * FIXED: Final slide layout - clean, scrollable, properly spaced
 */

import appLogo from '@/assets/images/logo_1024_transparent.png';
import { DarkTheme, Spacing } from '@/constants/DarkTheme';
import { useLanguage } from '@/contexts/LanguageContext';
import { setOnboardingCompleted } from '@/services/OnboardingService';
import { setGuestMode } from '@/services/SessionModeService';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Easing,
    FlatList,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewToken,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const IS_SMALL_DEVICE = SCREEN_HEIGHT < 700;

// Types
type IconType = 'sparkle' | 'moon' | 'scroll' | 'hands' | 'lock' | 'compass' | 'calculator';

interface OnboardingSlide {
  id: string;
  icon: IconType;
  titleKey: string;
  bodyKey: string;
  bulletsKey: [string, string, string];
  gradient: [string, string];
}

// Icon config
const ICON_MAP: Record<IconType, { name: keyof typeof Ionicons.glyphMap; size: number }> = {
  sparkle: { name: 'sunny', size: IS_SMALL_DEVICE ? 44 : 52 },
  calculator: { name: 'grid', size: IS_SMALL_DEVICE ? 44 : 52 },
  moon: { name: 'moon', size: IS_SMALL_DEVICE ? 44 : 52 },
  hands: { name: 'heart', size: IS_SMALL_DEVICE ? 44 : 52 },
  compass: { name: 'navigate-circle', size: IS_SMALL_DEVICE ? 44 : 52 },
  scroll: { name: 'document-text', size: IS_SMALL_DEVICE ? 44 : 52 },
  lock: { name: 'lock-closed', size: IS_SMALL_DEVICE ? 44 : 52 },
};

// Slides config
const SLIDES: OnboardingSlide[] = [
  { id: '1', icon: 'sparkle', titleKey: 'onboarding.s1.title', bodyKey: 'onboarding.s1.body', bulletsKey: ['onboarding.s1.b1', 'onboarding.s1.b2', 'onboarding.s1.b3'], gradient: ['#8B5CF6', '#6D28D9'] },
  { id: '2', icon: 'calculator', titleKey: 'onboarding.s2.title', bodyKey: 'onboarding.s2.body', bulletsKey: ['onboarding.s2.b1', 'onboarding.s2.b2', 'onboarding.s2.b3'], gradient: ['#8B5CF6', '#7C3AED'] },
  { id: '3', icon: 'moon', titleKey: 'onboarding.s3.title', bodyKey: 'onboarding.s3.body', bulletsKey: ['onboarding.s3.b1', 'onboarding.s3.b2', 'onboarding.s3.b3'], gradient: ['#6366F1', '#4F46E5'] },
  { id: '4', icon: 'hands', titleKey: 'onboarding.s4.title', bodyKey: 'onboarding.s4.body', bulletsKey: ['onboarding.s4.b1', 'onboarding.s4.b2', 'onboarding.s4.b3'], gradient: ['#A855F7', '#9333EA'] },
  { id: '5', icon: 'compass', titleKey: 'onboarding.s5.title', bodyKey: 'onboarding.s5.body', bulletsKey: ['onboarding.s5.b1', 'onboarding.s5.b2', 'onboarding.s5.b3'], gradient: ['#7C3AED', '#6D28D9'] },
];

// Animated Logo Icon
const AnimatedLogoIcon = ({ isActive }: { isActive: boolean }) => {
  const spinAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isActive) {
      Animated.loop(Animated.timing(spinAnim, { toValue: 1, duration: 20000, easing: Easing.linear, useNativeDriver: true })).start();
      Animated.loop(Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])).start();
    }
  }, [isActive]);

  return (
    <Animated.View style={[styles.logoIconContainer, { transform: [{ scale: pulseAnim }] }]}>
      <View style={styles.logoGlow} />
      <LinearGradient colors={['#8B5CF620', '#A855F710']} style={styles.logoBackground}>
        <Animated.View style={{ transform: [{ rotate: spinAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }] }}>
          <Image source={appLogo} style={{ width: IS_SMALL_DEVICE ? 52 : 64, height: IS_SMALL_DEVICE ? 52 : 64 }} resizeMode="contain" />
        </Animated.View>
      </LinearGradient>
    </Animated.View>
  );
};

// Animated Icon
const AnimatedIcon = ({ iconType, gradient, isActive, scale = 1 }: { iconType: IconType; gradient: [string, string]; isActive: boolean; scale?: number }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const iconConfig = ICON_MAP[iconType];

  useEffect(() => {
    if (isActive) {
      Animated.loop(Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.06, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])).start();
      if (iconType === 'sparkle' || iconType === 'compass') {
        Animated.loop(Animated.timing(rotateAnim, { toValue: 1, duration: 10000, easing: Easing.linear, useNativeDriver: true })).start();
      }
    }
  }, [isActive, iconType]);

  const size = (IS_SMALL_DEVICE ? 80 : 100) * scale;

  return (
    <Animated.View style={[styles.iconContainer, { transform: [{ scale: pulseAnim }], width: size, height: size }]}>
      <View style={[styles.iconGlow, { backgroundColor: gradient[0], width: size * 1.2, height: size * 1.2, borderRadius: size * 0.6 }]} />
      <LinearGradient colors={[`${gradient[0]}40`, `${gradient[1]}20`]} style={[styles.iconBackground, { width: size * 0.85, height: size * 0.85, borderRadius: size * 0.425 }]}>
        <Animated.View style={(iconType === 'sparkle' || iconType === 'compass') ? { transform: [{ rotate: rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }] } : undefined}>
          <Ionicons name={iconConfig.name} size={iconConfig.size * scale} color={gradient[0]} />
        </Animated.View>
      </LinearGradient>
    </Animated.View>
  );
};

// Animated Bullet
const AnimatedBulletRow = ({ text, index, isActive }: { text: string; index: number; isActive: boolean }) => {
  const translateX = useRef(new Animated.Value(30)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isActive) {
      const delay = 300 + (index * 120);
      Animated.parallel([
        Animated.timing(translateX, { toValue: 0, duration: 450, delay, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 350, delay, useNativeDriver: true }),
      ]).start();
    } else {
      translateX.setValue(30);
      opacity.setValue(0);
    }
  }, [isActive, index]);

  return (
    <Animated.View style={[styles.bulletRow, { transform: [{ translateX }], opacity }]}>
      <LinearGradient colors={['#8B5CF6', '#A855F7']} style={styles.bulletDot} />
      <Text style={[styles.bulletText, index === 0 && styles.bulletTextBold]}>{text}</Text>
    </Animated.View>
  );
};

// Progress Dot
const AnimatedDot = ({ isActive, onPress }: { isActive: boolean; index: number; onPress: () => void }) => {
  const widthAnim = useRef(new Animated.Value(isActive ? 24 : 8)).current;

  useEffect(() => {
    Animated.spring(widthAnim, { toValue: isActive ? 24 : 8, friction: 8, tension: 100, useNativeDriver: false }).start();
  }, [isActive]);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Animated.View style={[styles.dot, { width: widthAnim, opacity: isActive ? 1 : 0.4 }]}>
        {isActive && <LinearGradient colors={['#8B5CF6', '#A855F7']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />}
      </Animated.View>
    </TouchableOpacity>
  );
};

// Standard Slide Content
const StandardSlideContent = ({ item, isActive, t }: { item: OnboardingSlide; isActive: boolean; t: (k: string) => string }) => (
  <View style={styles.cardContent}>
    <Text style={styles.title}>{t(item.titleKey)}</Text>
    <Text style={styles.body}>{t(item.bodyKey)}</Text>
    <View style={styles.bulletsContainer}>
      {item.bulletsKey.map((key, idx) => <AnimatedBulletRow key={idx} text={t(key)} index={idx} isActive={isActive} />)}
    </View>
  </View>
);

// FINAL SLIDE - Simplified & Clean
const FinalSlide = ({ t, isActive, fadeAnim, slideAnim, onSignUp, onSignIn, onContinueAsGuest }: {
  t: (k: string) => string; isActive: boolean; fadeAnim: Animated.Value; slideAnim: Animated.Value;
  onSignUp: () => void; onSignIn: () => void; onContinueAsGuest: () => void;
}) => (
  <View style={styles.slide}>
    <ScrollView style={styles.finalScroll} contentContainerStyle={styles.finalScrollContent} showsVerticalScrollIndicator={false} bounces={false}>
      <Animated.View style={[styles.finalContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <AnimatedIcon iconType="compass" gradient={['#8B5CF6', '#7C3AED']} isActive={isActive} scale={0.9} />
        
        <View style={styles.finalCardWrapper}>
          {Platform.OS === 'ios' ? (
            <BlurView intensity={25} tint="dark" style={styles.finalCard}>
              <FinalCardContent t={t} onSignUp={onSignUp} onSignIn={onSignIn} onContinueAsGuest={onContinueAsGuest} />
            </BlurView>
          ) : (
            <View style={[styles.finalCard, styles.finalCardAndroid]}>
              <FinalCardContent t={t} onSignUp={onSignUp} onSignIn={onSignIn} onContinueAsGuest={onContinueAsGuest} />
            </View>
          )}
        </View>
        
        <Text style={styles.finalDisclaimer}>{t('onboarding.final.disclaimer')}</Text>
      </Animated.View>
    </ScrollView>
  </View>
);

// Final Card Content
const FinalCardContent = ({ t, onSignUp, onSignIn, onContinueAsGuest }: { t: (k: string) => string; onSignUp: () => void; onSignIn: () => void; onContinueAsGuest: () => void }) => (
  <View style={styles.finalCardContent}>
    <Text style={styles.finalTitle}>{t('onboarding.final.title')}</Text>
    <Text style={styles.finalDescription}>{t('onboarding.final.description')}</Text>
    
    <View style={styles.finalActions}>
      <TouchableOpacity style={styles.primaryBtn} onPress={onSignUp} activeOpacity={0.85}>
        <LinearGradient colors={['#8B5CF6', '#7C3AED']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.primaryGradient}>
          <Ionicons name="person-add" size={20} color="#FFFFFF" />
          <Text style={styles.primaryText}>{t('onboarding.final.createAccount')}</Text>
        </LinearGradient>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.secondaryBtn} onPress={onSignIn} activeOpacity={0.8}>
        <Ionicons name="log-in" size={18} color="#8B5CF6" />
        <Text style={styles.secondaryText}>{t('onboarding.final.signIn')}</Text>
      </TouchableOpacity>
      
      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>{t('onboarding.final.or')}</Text>
        <View style={styles.dividerLine} />
      </View>
      
      <TouchableOpacity style={styles.guestBtn} onPress={onContinueAsGuest} activeOpacity={0.7}>
        <Text style={styles.guestText}>{t('onboarding.final.continueGuest')}</Text>
        <Ionicons name="arrow-forward" size={16} color="rgba(255,255,255,0.6)" />
      </TouchableOpacity>
      
      <Text style={styles.guestNote}>{t('onboarding.final.guestNote')}</Text>
    </View>
  </View>
);

// Main Component
export default function OnboardingScreen() {
  const { t } = useLanguage();
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const isLastSlide = currentIndex === SLIDES.length - 1;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 8, tension: 40, useNativeDriver: true }),
    ]).start();
  }, []);

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) setCurrentIndex(viewableItems[0].index);
  }).current;

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;
  const triggerHaptic = useCallback(() => { if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }, []);

  const handleNext = useCallback(() => { triggerHaptic(); if (currentIndex < SLIDES.length - 1) flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true }); }, [currentIndex, triggerHaptic]);
  const handleBack = useCallback(() => { triggerHaptic(); if (currentIndex > 0) flatListRef.current?.scrollToIndex({ index: currentIndex - 1, animated: true }); }, [currentIndex, triggerHaptic]);
  const handleSkip = useCallback(() => { triggerHaptic(); flatListRef.current?.scrollToIndex({ index: SLIDES.length - 1, animated: true }); }, [triggerHaptic]);
  const handleDotPress = useCallback((index: number) => { triggerHaptic(); flatListRef.current?.scrollToIndex({ index, animated: true }); }, [triggerHaptic]);

  const handleSignIn = useCallback(async () => { triggerHaptic(); await setOnboardingCompleted(true); router.replace('/auth'); }, [router, triggerHaptic]);
  const handleSignUp = useCallback(async () => { if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); await setOnboardingCompleted(true); router.replace('/auth'); }, [router]);
  const handleContinueAsGuest = useCallback(async () => { triggerHaptic(); await setOnboardingCompleted(true); await setGuestMode(true); router.replace('/(tabs)'); }, [router, triggerHaptic]);

  const renderSlide = useCallback(({ item, index }: { item: OnboardingSlide; index: number }) => {
    const isActive = index === currentIndex;
    if (item.id === '5') return <FinalSlide t={t} isActive={isActive} fadeAnim={fadeAnim} slideAnim={slideAnim} onSignUp={handleSignUp} onSignIn={handleSignIn} onContinueAsGuest={handleContinueAsGuest} />;
    
    return (
      <View style={styles.slide}>
        <Animated.View style={[styles.slideContent, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          {item.id === '1' ? <AnimatedLogoIcon isActive={isActive} /> : <AnimatedIcon iconType={item.icon} gradient={item.gradient} isActive={isActive} />}
          <View style={styles.cardWrapper}>
            {Platform.OS === 'ios' ? (
              <BlurView intensity={20} tint="dark" style={styles.glassCard}>
                <StandardSlideContent item={item} isActive={isActive} t={t} />
              </BlurView>
            ) : (
              <View style={[styles.glassCard, styles.glassCardAndroid]}>
                <StandardSlideContent item={item} isActive={isActive} t={t} />
              </View>
            )}
          </View>
        </Animated.View>
      </View>
    );
  }, [currentIndex, fadeAnim, slideAnim, t, handleSignUp, handleSignIn, handleContinueAsGuest]);

  const stepText = t('onboarding.stepOf', {
    current: currentIndex + 1,
    total: SLIDES.length,
  });

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1A1625', '#0D0A1A', '#1A1625']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
      <View style={styles.bgDecor}><View style={styles.orb1} /><View style={styles.orb2} /></View>

      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <View style={styles.headerLeft}>
            <Image source={appLogo} style={{ width: IS_SMALL_DEVICE ? 32 : 40, height: IS_SMALL_DEVICE ? 32 : 40 }} resizeMode="contain" />
            <View><Text style={styles.logoText}>Asrariya</Text><Text style={styles.logoSub}>✦ ʿIlm al-Ḥurūf</Text></View>
          </View>
          {!isLastSlide && <TouchableOpacity onPress={handleSkip} style={styles.skipBtn}><Text style={styles.skipText}>{t('onboarding.skip')}</Text></TouchableOpacity>}
        </Animated.View>

        <FlatList ref={flatListRef} data={SLIDES} renderItem={renderSlide} keyExtractor={i => i.id} horizontal pagingEnabled showsHorizontalScrollIndicator={false} onViewableItemsChanged={onViewableItemsChanged} viewabilityConfig={viewabilityConfig} bounces={false} decelerationRate="fast" snapToInterval={SCREEN_WIDTH} getItemLayout={(_, index) => ({ length: SCREEN_WIDTH, offset: SCREEN_WIDTH * index, index })} />

        <View style={styles.progressWrap}>
          <Text style={styles.stepText}>{stepText}</Text>
          <View style={styles.dotsRow}>{SLIDES.map((_, i) => <AnimatedDot key={i} isActive={i === currentIndex} index={i} onPress={() => handleDotPress(i)} />)}</View>
        </View>

        {!isLastSlide && (
          <SafeAreaView edges={['bottom']} style={styles.navSafe}>
            <Animated.View style={[styles.navRow, { opacity: fadeAnim }]}>
              {currentIndex > 0 ? (
                <TouchableOpacity style={styles.backBtn} onPress={handleBack}><Ionicons name="arrow-back" size={18} color={DarkTheme.textSecondary} /><Text style={styles.backText}>{t('onboarding.back')}</Text></TouchableOpacity>
              ) : <View style={styles.placeholder} />}
              <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
                <LinearGradient colors={['#8B5CF6', '#7C3AED']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.nextGradient}>
                  <Text style={styles.nextText}>{t('onboarding.next')}</Text><Ionicons name="arrow-forward" size={18} color="#FFF" />
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </SafeAreaView>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0A1A' },
  bgDecor: { ...StyleSheet.absoluteFillObject, overflow: 'hidden' },
  orb1: { position: 'absolute', top: -80, right: -80, width: 180, height: 180, borderRadius: 90, backgroundColor: '#8B5CF6', opacity: 0.04 },
  orb2: { position: 'absolute', bottom: -40, left: -80, width: 140, height: 140, borderRadius: 70, backgroundColor: '#6366F1', opacity: 0.03 },
  safeArea: { flex: 1 },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.screenPadding, paddingVertical: IS_SMALL_DEVICE ? 8 : 12 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoText: { fontSize: IS_SMALL_DEVICE ? 18 : 20, fontWeight: '700', color: DarkTheme.textPrimary },
  logoSub: { fontSize: IS_SMALL_DEVICE ? 9 : 10, color: '#8B5CF6', marginTop: -2 },
  skipBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.05)' },
  skipText: { fontSize: 14, color: DarkTheme.textTertiary, fontWeight: '500' },

  slide: { width: SCREEN_WIDTH, flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: Spacing.screenPadding },
  slideContent: { alignItems: 'center', width: '100%', maxWidth: 400 },

  logoIconContainer: { marginBottom: IS_SMALL_DEVICE ? 16 : 24, alignItems: 'center', justifyContent: 'center', width: IS_SMALL_DEVICE ? 100 : 120, height: IS_SMALL_DEVICE ? 100 : 120 },
  logoGlow: { position: 'absolute', width: IS_SMALL_DEVICE ? 110 : 130, height: IS_SMALL_DEVICE ? 110 : 130, borderRadius: IS_SMALL_DEVICE ? 55 : 65, backgroundColor: '#8B5CF6', opacity: 0.15 },
  logoBackground: { width: IS_SMALL_DEVICE ? 88 : 108, height: IS_SMALL_DEVICE ? 88 : 108, borderRadius: IS_SMALL_DEVICE ? 44 : 54, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(139,92,246,0.3)' },

  iconContainer: { marginBottom: IS_SMALL_DEVICE ? 16 : 24, alignItems: 'center', justifyContent: 'center' },
  iconGlow: { position: 'absolute', opacity: 0.15 },
  iconBackground: { alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(139,92,246,0.3)' },

  cardWrapper: { width: '100%', borderRadius: 20, overflow: 'hidden' },
  glassCard: { borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', overflow: 'hidden' },
  glassCardAndroid: { backgroundColor: 'rgba(255,255,255,0.08)' },
  cardContent: { padding: IS_SMALL_DEVICE ? 16 : 20 },

  tagline: { fontSize: IS_SMALL_DEVICE ? 12 : 14, fontWeight: '600', color: '#A855F7', textAlign: 'center', marginBottom: 4 },
  title: { fontSize: IS_SMALL_DEVICE ? 24 : 28, fontWeight: '700', color: DarkTheme.textPrimary, textAlign: 'center', marginBottom: 8, lineHeight: IS_SMALL_DEVICE ? 30 : 36 },
  body: { fontSize: IS_SMALL_DEVICE ? 14 : 15, color: DarkTheme.textSecondary, textAlign: 'center', lineHeight: IS_SMALL_DEVICE ? 20 : 22, marginBottom: 16 },
  bulletsContainer: { gap: IS_SMALL_DEVICE ? 8 : 10 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  bulletDot: { width: 5, height: 5, borderRadius: 2.5, marginTop: IS_SMALL_DEVICE ? 6 : 7 },
  bulletText: { fontSize: IS_SMALL_DEVICE ? 13 : 14, color: DarkTheme.textTertiary, lineHeight: IS_SMALL_DEVICE ? 18 : 20, flex: 1 },
  bulletTextBold: { fontWeight: '600', color: DarkTheme.textSecondary },

  progressWrap: { alignItems: 'center', paddingVertical: IS_SMALL_DEVICE ? 8 : 12, gap: 6 },
  stepText: { fontSize: 11, color: DarkTheme.textTertiary, fontWeight: '500' },
  dotsRow: { flexDirection: 'row', gap: 6 },
  dot: { height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.2)', overflow: 'hidden' },

  navSafe: { backgroundColor: 'transparent' },
  navRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.screenPadding, paddingTop: 8, paddingBottom: IS_SMALL_DEVICE ? 8 : 12 },
  placeholder: { width: 90 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.05)' },
  backText: { fontSize: 14, color: DarkTheme.textSecondary, fontWeight: '500' },
  nextBtn: { borderRadius: 12, overflow: 'hidden', shadowColor: '#8B5CF6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
  nextGradient: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: IS_SMALL_DEVICE ? 10 : 12, paddingHorizontal: 20 },
  nextText: { fontSize: 14, color: '#FFF', fontWeight: '600' },

  // Final Slide
  finalScroll: { flex: 1, width: '100%' },
  finalScrollContent: { flexGrow: 1, justifyContent: 'center', paddingVertical: 16 },
  finalContainer: { alignItems: 'center', paddingHorizontal: 8 },
  finalCardWrapper: { width: '100%', maxWidth: 380, borderRadius: 24, overflow: 'hidden', marginTop: 12 },
  finalCard: { borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', overflow: 'hidden' },
  finalCardAndroid: { backgroundColor: 'rgba(255,255,255,0.10)' },
  finalCardContent: { padding: IS_SMALL_DEVICE ? 20 : 24 },
  finalTagline: { fontSize: IS_SMALL_DEVICE ? 12 : 13, fontWeight: '500', color: 'rgba(168,85,247,0.9)', textAlign: 'center', marginBottom: 4 },
  finalTitle: { fontSize: IS_SMALL_DEVICE ? 26 : 30, fontWeight: '700', color: DarkTheme.textPrimary, textAlign: 'center', marginBottom: 8, lineHeight: IS_SMALL_DEVICE ? 32 : 38 },
  finalDescription: { fontSize: IS_SMALL_DEVICE ? 14 : 15, color: DarkTheme.textSecondary, textAlign: 'center', lineHeight: IS_SMALL_DEVICE ? 20 : 22, marginBottom: 20 },
  finalActions: { gap: IS_SMALL_DEVICE ? 12 : 14 },
  primaryBtn: { borderRadius: 14, overflow: 'hidden', shadowColor: '#8B5CF6', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 10, elevation: 8 },
  primaryGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: IS_SMALL_DEVICE ? 14 : 16 },
  primaryText: { fontSize: IS_SMALL_DEVICE ? 16 : 17, fontWeight: '700', color: '#FFF' },
  secondaryBtn: { flexDirection: 'row', borderWidth: 1.5, borderColor: 'rgba(139,92,246,0.5)', borderRadius: 14, paddingVertical: IS_SMALL_DEVICE ? 12 : 14, alignItems: 'center', justifyContent: 'center', gap: 8 },
  secondaryText: { fontSize: IS_SMALL_DEVICE ? 15 : 16, fontWeight: '600', color: '#8B5CF6' },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 4 },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.1)' },
  dividerText: { fontSize: 12, color: 'rgba(255,255,255,0.4)', paddingHorizontal: 12 },
  guestBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10 },
  guestText: { fontSize: IS_SMALL_DEVICE ? 14 : 15, fontWeight: '500', color: 'rgba(255,255,255,0.6)' },
  guestNote: { fontSize: IS_SMALL_DEVICE ? 11 : 12, color: 'rgba(255,255,255,0.4)', textAlign: 'center' },
  finalDisclaimer: { fontSize: IS_SMALL_DEVICE ? 10 : 11, color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginTop: 16, paddingHorizontal: 20, lineHeight: 16, fontStyle: 'italic' },
});