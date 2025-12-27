/**
 * Asrār Everyday - Home Screen
 * 
 * Design Philosophy: Daily Companion
 * - Show less, guide more
 * - Respect the user's time
 * - Focus on daily alignment, not overwhelming features
 * 
 * Structure:
 * 1. Compact Header (40% reduced)
 * 2. Hero: Daily Check-In Card
 * 3. Quick Access: 2×2 grid (always visible)
 * 4. Spiritual Modules: Collapsible (reduced scroll)
 * 
 * Performance Optimizations:
 * - Memoized components
 * - Collapsible modules reduce initial render
 * - Optimized animations
 */

import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DailyCheckInCard } from '../../components/divine-timing/DailyCheckInCard';
import { PeakWindowsCard } from '../../components/divine-timing/PeakWindowsCard';
import { ModuleCard, WidgetBar } from '../../components/home';
import { ModuleCardProps } from '../../components/home/types';
import { DarkTheme, Spacing, Typography } from '../../constants/DarkTheme';
import { useLanguage } from '../../contexts/LanguageContext';
import { useProfile } from '../../contexts/ProfileContext';
import { getDailyCheckInSummary } from '../../services/DivineTimingStorage';
import { DailyCheckInSummary } from '../../types/daily-checkin';

/**
 * Module configuration for primary features
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
];

export default function HomeScreen() {
  const { t } = useLanguage();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { profile, completionStatus } = useProfile();
  
  const [dailySummary, setDailySummary] = useState<DailyCheckInSummary>({
    hasCheckedInToday: false,
    streak: 0,
  });
  
  const [modulesExpanded, setModulesExpanded] = useState(false);

  // Load daily check-in summary on mount and when screen focuses
  const loadDailySummary = useCallback(async () => {
    const summary = await getDailyCheckInSummary();
    setDailySummary(summary);
  }, []);
  
  useEffect(() => {
    loadDailySummary();
  }, [loadDailySummary]);
  
  useFocusEffect(
    useCallback(() => {
      loadDailySummary();
    }, [loadDailySummary])
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
        router.push('/istikhara');
        break;
      case 'Compatibility':
        router.push('/compatibility');
        break;
      case 'Name Destiny':
        router.push('/(tabs)/name-destiny');
        break;
      case 'Divine Timing':
        router.push('/divine-timing');
        break;
      // Add other module navigations as they're implemented
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
      {/* Compact Header */}
      <View style={styles.compactHeader}>
        <Text style={styles.brandName}>Asrār ✦</Text>
        <TouchableOpacity onPress={() => router.push('/profile')}>
          <Ionicons name="person-circle" size={28} color={DarkTheme.accent} />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.dateLabel}>
        {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
      </Text>
      
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

      {/* Hero: Daily Check-In Card */}
      <View style={styles.heroSection}>
        <DailyCheckInCard summary={dailySummary} colorScheme="dark" />
      </View>

      {/* Phase 7: Peak Windows Card */}
      <PeakWindowsCard userElement={profile.derived?.element || 'fire'} />

      {/* Quick Access: 2×2 Grid */}
      <WidgetBar />

      {/* Spiritual Modules: Collapsible */}
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
          <View style={styles.modulesCollapsed}>
            {MODULES.map((module) => (
              <TouchableOpacity
                key={module.title}
                style={styles.moduleIcon}
                onPress={() => handleModulePress(module.title)}
                activeOpacity={0.7}
              >
                <Text style={styles.moduleIconEmoji}>{module.icon}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
  ), [t, dailySummary, modulesExpanded, completionStatus.hasDOB, profile.derived?.element, router]);

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
    paddingTop: Spacing.sm,
  },
  
  // Compact Header (40% reduced)
  compactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.screenPadding,
    paddingBottom: Spacing.xs,
  },
  brandName: {
    fontSize: 20,
    fontWeight: Typography.weightBold,
    color: DarkTheme.textPrimary,
    letterSpacing: 0.5,
  },
  dateLabel: {
    fontSize: 13,
    fontWeight: Typography.weightRegular,
    color: DarkTheme.textSecondary,
    opacity: 0.7,
    paddingHorizontal: Spacing.screenPadding,
    marginBottom: Spacing.sm,
  },
  
  // Profile Banner
  profileBanner: {
    marginHorizontal: Spacing.screenPadding,
    marginBottom: Spacing.md,
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
  
  // Hero Section
  heroSection: {
    paddingHorizontal: Spacing.screenPadding,
    marginBottom: Spacing.md,
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
    fontSize: Typography.h2,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
  },
  modulesCollapsed: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
    flexWrap: 'wrap',
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
  },
  moduleIconEmoji: {
    fontSize: 28,
  },
});
