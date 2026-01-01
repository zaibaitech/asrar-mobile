/**
 * Asrār Everyday - Home Screen
 * 
 * Design Philosophy: Daily Companion
 * - Show less, guide more
 * - Respect the user's time
 * - Focus on daily alignment, not overwhelming features
 * 
 * Structure:
 * 1. Compact Header (minimal padding)
 * 2. Daily Overview Section:
 *    - Daily Guidance (full-width primary)
 *    - Action Pills (inline buttons)
 *    - Next Prayer + Today's Blessing (2-column row)
 * 3. Quick Access: 2×2 grid shortcuts
 * 4. Spiritual Modules: Collapsible
 * 
 * Performance Optimizations:
 * - Memoized components
 * - Reduced vertical spacing
 * - Optimized animations
 */

import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RealTimeDailyGuidance } from '../../components/divine-timing/RealTimeDailyGuidance';
import { ModuleCard } from '../../components/home';
import { MomentAlignmentCard } from '../../components/home/MomentAlignmentCard';
import { ModuleCardProps } from '../../components/home/types';
import { DarkTheme, ElementAccents, Spacing, Typography } from '../../constants/DarkTheme';
import { useLanguage } from '../../contexts/LanguageContext';
import { useProfile } from '../../contexts/ProfileContext';
import { DailyGuidance, getDailyGuidance } from '../../services/DailyGuidanceService';
import { getTodayBlessing, type DayBlessing } from '../../services/DayBlessingService';
import { MomentAlignment, getMomentAlignment } from '../../services/MomentAlignmentService';
import {
    fetchPrayerTimes,
    getNextPrayer,
    getTimeUntilPrayer
} from '../../services/api/prayerTimes';

/**
 * Module configuration for all spiritual features
 * Unified grid combining primary modules and quick access tools
 * Each module has element-based theming and navigation
 */
const MODULES: Omit<ModuleCardProps, 'onPress'>[] = [
  {
    title: 'Calculator',
    titleArabic: 'حاسبة الأبجد',
    description: 'Advanced Abjad numerology calculations and letter analysis',
    icon: '🧮',
    element: 'fire',
    comingSoon: false,
  },
  {
    title: 'Name Destiny',
    titleArabic: 'قدر الأسماء',
    description: 'Discover the spiritual significance and destiny encoded in names',
    icon: '📜',
    element: 'earth',
    comingSoon: false,
  },
  {
    title: 'Istikhara',
    titleArabic: 'الاستخارة',
    description: 'Spiritual consultation combining prayer guidance with numerology',
    icon: '🌙',
    element: 'water',
    comingSoon: false,
  },
  {
    title: 'Guided Istikhārah',
    titleArabic: 'الاستخارة الموجهة',
    description: 'Learn the authentic prayer method and track your spiritual decisions',
    icon: '🕊️',
    element: 'earth',
    comingSoon: false,
  },
  {
    title: 'Compatibility',
    titleArabic: 'التوافق',
    description: 'Analyze relationship harmony through elemental and numerical balance',
    icon: '💞',
    element: 'air',
    comingSoon: false,
  },
  {
    title: 'Divine Timing',
    titleArabic: 'التوقيت الإلهي',
    description: 'Spiritual reflection tool for understanding timing and intention',
    icon: '🕰️',
    element: 'fire',
    comingSoon: false,
  },
  {
    title: 'Prayer Times',
    titleArabic: 'مواقيت الصلاة',
    description: 'Daily prayer times based on your location',
    icon: '🕌',
    element: 'water',
    comingSoon: false,
  },
  {
    title: 'Quran',
    titleArabic: 'القرآن الكريم',
    description: 'Read the complete Quran with translations and bookmarks',
    icon: '📖',
    element: 'water',
    comingSoon: false,
  },
  {
    title: 'Qibla',
    titleArabic: 'القبلة',
    description: 'Find the direction to Kaaba for prayer',
    icon: '🧭',
    element: 'earth',
    comingSoon: false,
  },
  {
    title: 'Dhikr Counter',
    titleArabic: 'عداد الأذكار',
    description: 'Digital tasbih for counting dhikr and remembrance',
    icon: '📿',
    element: 'air',
    comingSoon: false,
  },
];

export default function HomeScreen() {
  const { t } = useLanguage();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { profile, completionStatus } = useProfile();
  const hasProfileName = Boolean(profile?.nameAr || profile?.nameLatin);
  
  const [dailyGuidance, setDailyGuidance] = useState<DailyGuidance | null>(null);
  const [momentAlignment, setMomentAlignment] = useState<MomentAlignment | null>(null);
  const [modulesExpanded, setModulesExpanded] = useState(false);
  
  // Prayer times state
  const [nextPrayer, setNextPrayer] = useState<{ name: string; nameArabic: string; time: string } | null>(null);
  const [prayerCountdown, setPrayerCountdown] = useState('');
  const [prayerLoading, setPrayerLoading] = useState(true);
  
  // Today's blessing state
  const [todayBlessing, setTodayBlessing] = useState<DayBlessing | null>(null);
  
  // Load real-time daily guidance
  const loadDailyGuidance = useCallback(async () => {
    const guidance = await getDailyGuidance(profile);
    setDailyGuidance(guidance);
  }, [profile]);
  
  // Load moment alignment
  const loadMomentAlignment = useCallback(async () => {
    const alignment = await getMomentAlignment(profile);
    setMomentAlignment(alignment);
  }, [profile]);
  
  // Load prayer times
  const loadPrayerTimes = useCallback(async () => {
    try {
      setPrayerLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        
        const { latitude, longitude } = location.coords;
        const data = await fetchPrayerTimes(latitude, longitude);
        const next = getNextPrayer(data.timings);
        setNextPrayer(next);
      }
    } catch (error) {
      console.error('Error loading prayer times:', error);
    } finally {
      setPrayerLoading(false);
    }
  }, []);
  
  // Load today's blessing
  const loadTodayBlessing = useCallback(() => {
    const blessing = getTodayBlessing();
    setTodayBlessing(blessing);
  }, []);
  
  useEffect(() => {
    loadDailyGuidance();
    loadMomentAlignment();
    loadPrayerTimes();
    loadTodayBlessing();
  }, [loadDailyGuidance, loadMomentAlignment, loadPrayerTimes, loadTodayBlessing]);
  
  // Update countdown every minute
  useEffect(() => {
    if (!nextPrayer?.time) return;

    const updateCountdown = () => {
      const { hours, minutes } = getTimeUntilPrayer(nextPrayer.time);
      if (hours > 0) {
        setPrayerCountdown(`${hours}h ${minutes}m`);
      } else {
        setPrayerCountdown(`${minutes}m`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, [nextPrayer]);
  
  useFocusEffect(
    useCallback(() => {
      loadDailyGuidance();
      loadMomentAlignment();
      loadPrayerTimes();
    }, [loadDailyGuidance, loadMomentAlignment, loadPrayerTimes])
  );

  /**
   * Handle module card press - navigate to appropriate screen
   */
  const handleModulePress = useCallback((moduleTitle: string) => {
    switch (moduleTitle) {
      case 'Calculator':
        router.push('/calculator');
        break;
      case 'Istikhara':
        router.push('/(tabs)/istikhara');
        break;
      case 'Guided Istikhārah':
        router.push('/istikhara-sessions');
        break;
      case 'Compatibility':
        router.push('/universal-compatibility');
        break;
      case 'Name Destiny':
        router.push('/(tabs)/name-destiny');
        break;
      case 'Divine Timing':
        router.push('/divine-timing');
        break;
      case 'Prayer Times':
        router.push('/prayer-times');
        break;
      case 'Quran':
        router.push('/quran');
        break;
      case 'Qibla':
        router.push('/(tabs)/qibla');
        break;
      case 'Dhikr Counter':
        router.push('/dhikr-counter');
        break;
      default:
        console.log(`${moduleTitle} - Coming Soon`);
    }
  }, [router]);

  /**
   * Render individual module card
   * Memoized to prevent unnecessary re-renders
   */
  const renderModuleCard = useCallback(({ item }: { item: typeof MODULES[0] }) => (
    <ModuleCard
      {...item}
      onPress={() => handleModulePress(item.title)}
    />
  ), [handleModulePress]);

  /**
   * List header with welcome message and widget bar
   */
  const ListHeaderComponent = useMemo(() => (
    <View style={styles.header}>
      {/* Profile Completion Banner */}
      {!completionStatus.hasDOB && (
        <TouchableOpacity 
          style={styles.profileBanner}
          onPress={() => router.push('/profile')}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['rgba(139, 115, 85, 0.2)', 'rgba(139, 115, 85, 0.1)']}
            style={styles.profileBannerGradient}
          >
            <Ionicons name="calendar" size={20} color={DarkTheme.accent} />
            <View style={styles.profileBannerText}>
              <Text style={styles.profileBannerTitle}>Complete Your Profile</Text>
              <Text style={styles.profileBannerSubtitle}>
                Add your DOB to unlock Divine Timing personalization
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={DarkTheme.textSecondary} />
          </LinearGradient>
        </TouchableOpacity>
      )}

      {/* Daily Overview Section - Moved Up */}
      <View style={styles.dailyOverview}>
        {/* Hero Row: Daily Guidance (60%) + Moment Alignment (40%) */}
        <View style={styles.heroRow}>
          {/* Daily Guidance - Left Side (Slightly Tightened) */}
          <View style={styles.dailyGuidanceColumn}>
            <RealTimeDailyGuidance 
              guidance={dailyGuidance} 
              loading={!dailyGuidance} 
              compact 
              showDayLabel
              dayLabel={new Date().toLocaleDateString('en-US', { weekday: 'long' })}
              showDetailsHint
            />
          </View>
          
          {/* Moment Alignment - Right Side (Micro Card) */}
          <View style={styles.momentAlignmentColumn}>
            <MomentAlignmentCard
              status={momentAlignment?.status}
              statusLabel={momentAlignment ? t(momentAlignment.shortLabelKey) : undefined}
              hintText={momentAlignment ? t(momentAlignment.shortHintKey) : undefined}
              zahirElement={momentAlignment?.zahirElement}
              timeElement={momentAlignment?.timeElement}
              updatedAt={momentAlignment?.updatedAt}
              loading={!momentAlignment && hasProfileName}
              hasProfileName={hasProfileName}
              t={t}
            />
          </View>
        </View>
        
        {/* 2. Action Pills - Inline Buttons */}
        <View style={styles.actionPills}>
          <TouchableOpacity 
            style={styles.pillButton}
            onPress={() => router.push('/daily-checkin')}
            activeOpacity={0.7}
          >
            <Ionicons name="checkmark-circle-outline" size={16} color="#10b981" />
            <Text style={styles.pillText}>Check In Now</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.pillButton}
            onPress={() => router.push('/divine-timing-insights')}
            activeOpacity={0.7}
          >
            <Ionicons name="trending-up-outline" size={16} color="#6366f1" />
            <Text style={styles.pillText}>View Insights</Text>
          </TouchableOpacity>
        </View>
        
        {/* 3. Next Prayer + Today's Blessing - Two Column Row */}
        <View style={styles.twoColumnRow}>
          {/* Next Prayer Card */}
          <TouchableOpacity 
            style={styles.compactCard}
            onPress={() => router.push('/prayer-times')}
            activeOpacity={0.7}
          >
            <View style={[styles.cardGradient, { backgroundColor: 'rgba(16, 185, 129, 0.08)' }]}>
              <Text style={styles.compactLabel}>Next Prayer</Text>
              {prayerLoading ? (
                <ActivityIndicator size="small" color="#10b981" />
              ) : nextPrayer ? (
                <>
                  <Text style={styles.compactPrimary}>{nextPrayer.nameArabic}</Text>
                  <Text style={[styles.compactSecondary, { color: '#10b981' }]}>
                    {nextPrayer.time}
                  </Text>
                  {prayerCountdown && (
                    <Text style={styles.compactTertiary}>in {prayerCountdown}</Text>
                  )}
                </>
              ) : (
                <Text style={styles.compactTertiary}>Tap to set location</Text>
              )}
            </View>
          </TouchableOpacity>
          
          {/* Today's Blessing Card */}
          <TouchableOpacity 
            style={styles.compactCard}
            onPress={() => router.push('/divine-timing')}
            activeOpacity={0.7}
          >
            {todayBlessing && (
              <View style={[
                styles.cardGradient,
                { backgroundColor: `${ElementAccents[todayBlessing.element].primary}15` }
              ]}>
                <Text style={styles.compactLabel}>Today's Blessing</Text>
                <Text style={styles.compactPrimary}>{todayBlessing.dayNameArabic}</Text>
                <Text style={[
                  styles.compactSecondary,
                  { color: ElementAccents[todayBlessing.element].primary }
                ]}>
                  {todayBlessing.emoji} {todayBlessing.planetArabic}
                </Text>
                <View style={[
                  styles.miniElementBadge,
                  { backgroundColor: ElementAccents[todayBlessing.element].glow }
                ]}>
                  <Text style={[
                    styles.miniElementText,
                    { color: ElementAccents[todayBlessing.element].primary }
                  ]}>
                    {todayBlessing.element.toUpperCase()}
                  </Text>
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Spiritual Modules: Unified Grid */}
      <View style={styles.modulesSection}>
        <TouchableOpacity 
          style={styles.modulesSectionHeader}
          onPress={() => setModulesExpanded(!modulesExpanded)}
          activeOpacity={0.7}
        >
          <Text style={styles.sectionTitle}>Spiritual Modules</Text>
          <Ionicons 
            name={modulesExpanded ? 'chevron-up' : 'chevron-down'} 
            size={20} 
            color={DarkTheme.textSecondary} 
          />
        </TouchableOpacity>
        
        {!modulesExpanded && (
          <View style={styles.modulesGrid}>
            {MODULES.map((module) => (
              <TouchableOpacity
                key={module.title}
                style={styles.moduleGridItem}
                onPress={() => handleModulePress(module.title)}
                activeOpacity={0.7}
              >
                <View style={styles.moduleIcon}>
                  <Text style={styles.moduleIconEmoji}>{module.icon}</Text>
                </View>
                <Text style={styles.moduleIconLabel} numberOfLines={1}>
                  {module.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
  ), [
    router,
    profile,
    completionStatus.hasDOB,
    dailyGuidance,
    nextPrayer,
    prayerLoading,
    prayerCountdown,
    todayBlessing,
    modulesExpanded,
    handleModulePress,
  ]);

  /**
   * Conditionally render modules based on expansion state
   */
  const data = modulesExpanded ? MODULES : [];

  /**
   * List footer with spacing for safe area
   */
  const ListFooterComponent = useMemo(() => (
    <View style={{ height: Spacing.xxxl + insets.bottom }} />
  ), [insets.bottom]);

  /**
   * Key extractor for FlatList optimization
   */
  const keyExtractor = useCallback((item: typeof MODULES[0]) => item.title, []);

  return (
    <LinearGradient
      colors={[
        '#0f172a', // Deep navy blue
        '#1e1b4b', // Deep purple
        '#1A1625', // Theme background color
      ]}
      style={styles.container}
    >
      <FlatList
        data={data}
        renderItem={renderModuleCard}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        // Performance optimizations
        removeClippedSubviews={Platform.OS === 'android'}
        maxToRenderPerBatch={3}
        updateCellsBatchingPeriod={50}
        windowSize={5}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingTop: 0, // No padding - content starts immediately
  },
  
  // Profile Banner
  profileBanner: {
    marginHorizontal: Spacing.screenPadding,
    marginBottom: Spacing.sm,
    borderRadius: 12,
    overflow: 'hidden',
  },
  profileBannerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  profileBannerText: {
    flex: 1,
  },
  profileBannerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: DarkTheme.textPrimary,
    marginBottom: 2,
  },
  profileBannerSubtitle: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
  },
  
  // Daily Overview Section - Moved Up
  dailyOverview: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.xs, // Minimal top padding
    gap: Spacing.sm,
  },
  
  // Hero Row: Daily Guidance + Moment Alignment
  heroRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  dailyGuidanceColumn: {
    flex: 6, // 60% width
  },
  momentAlignmentColumn: {
    flex: 4, // 40% width
  },
  
  // Action Pills
  actionPills: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  pillButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
    color: DarkTheme.textPrimary,
  },
  
  // Two Column Row (Prayer + Blessing)
  twoColumnRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  compactCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    overflow: 'hidden',
  },
  cardGradient: {
    padding: 12, // Reduced internal padding
    alignItems: 'center',
    minHeight: 120, // Equal height for both cards
    justifyContent: 'center',
  },
  compactLabel: {
    fontSize: 11,
    fontWeight: Typography.weightMedium,
    color: DarkTheme.textTertiary,
    marginBottom: 6,
  },
  compactPrimary: {
    fontSize: 16,
    fontWeight: Typography.weightBold,
    color: DarkTheme.textPrimary,
    marginBottom: 4,
  },
  compactSecondary: {
    fontSize: 14,
    fontWeight: Typography.weightSemibold,
    marginBottom: 4,
  },
  compactTertiary: {
    fontSize: 11,
    color: DarkTheme.textTertiary,
  },
  miniElementBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 4,
  },
  miniElementText: {
    fontSize: 9,
    fontWeight: Typography.weightBold,
    letterSpacing: 0.5,
  },
  
  // Modules Section
  modulesSection: {
    marginTop: Spacing.md,
  },
  modulesSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.xs,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
  },
  modulesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
    justifyContent: 'flex-start',
  },
  moduleGridItem: {
    alignItems: 'center',
    width: '31%', // 3-column grid with gap
    minWidth: 90,
  },
  moduleIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  moduleIconEmoji: {
    fontSize: 28,
  },
  moduleIconLabel: {
    fontSize: 10,
    fontWeight: Typography.weightMedium,
    color: DarkTheme.textSecondary,
    textAlign: 'center',
  },
});
