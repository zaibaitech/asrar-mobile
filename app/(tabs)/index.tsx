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
import { FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RealTimeDailyGuidance } from '../../components/divine-timing/RealTimeDailyGuidance';
import { ModuleCard } from '../../components/home';
import { MomentAlignmentStrip } from '../../components/home/MomentAlignmentStrip';
import { RightStackWidgets } from '../../components/home/RightStackWidgets';
import { ModuleCardProps } from '../../components/home/types';
import { DarkTheme, ElementAccents, Spacing, Typography } from '../../constants/DarkTheme';
import { useLanguage } from '../../contexts/LanguageContext';
import { useProfile } from '../../contexts/ProfileContext';
import { useNowTicker } from '../../hooks/useNowTicker';
import {
    fetchPrayerTimes,
    getNextPrayer,
    getTimeUntilPrayer
} from '../../services/api/prayerTimes';
import { DailyGuidance, getDailyGuidance } from '../../services/DailyGuidanceService';
import { getTodayBlessing } from '../../services/DayBlessingService';
import { getMomentAlignment, MomentAlignment } from '../../services/MomentAlignmentService';
import { calculatePlanetaryHours, PlanetaryHourData } from '../../services/PlanetaryHoursService';
import { getPlanetTransitNow, PlanetTransitInfo } from '../../services/PlanetTransitService';

/**
 * Module configuration for all spiritual features
 * Unified grid combining primary modules and quick access tools
 * Each module has element-based theming and navigation
 * NOTE: Titles and descriptions are now fetched from translations using t() function
 */
const getModules = (t: any): (Omit<ModuleCardProps, 'onPress'> & { id: string })[] => [
  {
    id: 'calculator',
    title: t('modules.calculator.title'),
    titleArabic: 'حاسبة الأبجد',
    description: t('modules.calculator.description'),
    icon: '🧮',
    element: 'fire',
    comingSoon: false,
  },
  {
    id: 'nameDestiny',
    title: t('modules.nameDestiny.title'),
    titleArabic: 'قدر الأسماء',
    description: t('modules.nameDestiny.description'),
    icon: '📜',
    element: 'earth',
    comingSoon: false,
  },
  {
    id: 'istikhara',
    title: t('modules.istikhara.title'),
    titleArabic: 'الاستخارة',
    description: t('modules.istikhara.description'),
    icon: '🌙',
    element: 'water',
    comingSoon: false,
  },
  {
    id: 'guidedIstikhara',
    title: t('modules.guidedIstikhara.title'),
    titleArabic: 'الاستخارة الموجهة',
    description: t('modules.guidedIstikhara.description'),
    icon: '🕊️',
    element: 'earth',
    comingSoon: false,
  },
  {
    id: 'compatibility',
    title: t('modules.compatibility.title'),
    titleArabic: 'التوافق',
    description: t('modules.compatibility.description'),
    icon: '⚖️',
    element: 'air',
    comingSoon: false,
  },
  {
    id: 'divineTiming',
    title: t('modules.divineTiming.title'),
    titleArabic: 'التوقيت الإلهي',
    description: t('modules.divineTiming.description'),
    icon: '🕰️',
    element: 'fire',
    comingSoon: false,
  },
  {
    id: 'prayerTimes',
    title: t('modules.prayerTimes.title'),
    titleArabic: 'مواقيت الصلاة',
    description: t('modules.prayerTimes.description'),
    icon: '🕌',
    element: 'water',
    comingSoon: false,
  },
  {
    id: 'quran',
    title: t('modules.quran.title'),
    titleArabic: 'القرآن الكريم',
    description: t('modules.quran.description'),
    icon: '📖',
    element: 'water',
    comingSoon: false,
  },
  {
    id: 'qibla',
    title: t('modules.qibla.title'),
    titleArabic: 'القبلة',
    description: t('modules.qibla.description'),
    icon: '🧭',
    element: 'earth',
    comingSoon: false,
  },
  {
    id: 'dhikrCounter',
    title: t('modules.dhikrCounter.title'),
    titleArabic: 'عداد الأذكار',
    description: t('modules.dhikrCounter.description'),
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
  
  // Get modules with translations
  const MODULES = useMemo(() => getModules(t), [t]);
  
  // Real-time ticker for countdown updates
  const now = useNowTicker(1000);
  
  const [dailyGuidance, setDailyGuidance] = useState<DailyGuidance | null>(null);
  const [momentAlignment, setMomentAlignment] = useState<MomentAlignment | null>(null);
  const [modulesExpanded, setModulesExpanded] = useState(false);
  
  // Rotation state for bottom cards
  const [prayerCardSlide, setPrayerCardSlide] = useState(0);
  const [blessingCardSlide, setBlessingCardSlide] = useState(0);
  
  // Prayer times & planetary hours state
  const [nextPrayer, setNextPrayer] = useState<{ name: string; nameArabic: string; time: string } | null>(null);
  const [prayerCountdown, setPrayerCountdown] = useState('');
  const [prayerLoading, setPrayerLoading] = useState(true);
  const [planetaryData, setPlanetaryData] = useState<PlanetaryHourData | null>(null);
  const [prayerTimesData, setPrayerTimesData] = useState<any>(null);
  const [planetTransit, setPlanetTransit] = useState<PlanetTransitInfo | null>(null);
  const [tomorrowBlessing, setTomorrowBlessing] = useState<any>(null);
  
  // Calculate planetary hours when prayer times are available
  useEffect(() => {
    if (!prayerTimesData) return;
    
    try {
      const { timings } = prayerTimesData;
      const parseTime = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(':');
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        return date;
      };
      
      const sunrise = parseTime(timings.Sunrise);
      const sunset = parseTime(timings.Maghrib);
      const nextDay = new Date(sunrise);
      nextDay.setDate(nextDay.getDate() + 1);
      
      const planetary = calculatePlanetaryHours(sunrise, sunset, nextDay, now);
      setPlanetaryData(planetary);
      
      // Calculate planet transit
      const transit = getPlanetTransitNow(sunrise, sunset, nextDay, now);
      setPlanetTransit(transit);
    } catch (error) {
      console.error('Error calculating planetary hours:', error);
    }
  }, [prayerTimesData, now]);
  
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
        setPrayerTimesData(data); // Store full prayer times data for planetary hours
      }
    } catch (error) {
      console.error('Error loading prayer times:', error);
    } finally {
      setPrayerLoading(false);
    }
  }, []);
  
  // Load today's blessing
  useEffect(() => {
    loadDailyGuidance();
    loadMomentAlignment();
    loadPrayerTimes();
    
    // Calculate tomorrow's blessing
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setTomorrowBlessing(getTodayBlessing(tomorrow));
  }, [loadDailyGuidance, loadMomentAlignment, loadPrayerTimes]);
  
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
  
  // Get translated day name
  const getDayName = useCallback(() => {
    const dayIndex = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
    const dayKeys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return t(`days.${dayKeys[dayIndex]}`);
  }, [t]);

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
  const handleModulePress = useCallback((moduleId: string) => {
    switch (moduleId) {
      case 'calculator':
        router.push('/calculator');
        break;
      case 'istikhara':
        router.push('/(tabs)/istikhara');
        break;
      case 'guidedIstikhara':
        router.push('/istikhara-sessions');
        break;
      case 'compatibility':
        router.push('/universal-compatibility');
        break;
      case 'nameDestiny':
        router.push('/(tabs)/name-destiny');
        break;
      case 'divineTiming':
        router.push('/divine-timing');
        break;
      case 'prayerTimes':
        router.push('/prayer-times');
        break;
      case 'quran':
        router.push('/quran');
        break;
      case 'qibla':
        router.push('/(tabs)/qibla');
        break;
      case 'dhikrCounter':
        router.push('/dhikr-counter');
        break;
      default:
        console.log(`${moduleId} - Coming Soon`);
    }
  }, [router]);

  /**
   * Render individual module card
   * Memoized to prevent unnecessary re-renders
   */
  const renderModuleCard = useCallback(({ item }: { item: typeof MODULES[0] }) => (
    <ModuleCard
      {...item}
      onPress={() => handleModulePress(item.id)}
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
              dayLabel={getDayName()}
              showDetailsHint
            />
          </View>
          
          {/* Right Stack: Next Prayer + Planet Transit */}
          <View style={styles.momentAlignmentColumn}>
            <RightStackWidgets
              nextPrayer={nextPrayer}
              prayerLoading={prayerLoading}
              prayerCountdown={prayerCountdown}
              planetTransit={planetTransit}
              nextDayBlessing={tomorrowBlessing}
              planetaryData={planetaryData}
              t={t}
            />
          </View>
        </View>
        
        {/* Full-width Moment Alignment Strip with Element Pills */}
        <MomentAlignmentStrip
          status={momentAlignment?.status}
          statusLabel={momentAlignment ? t(momentAlignment.shortLabelKey) : undefined}
          zahirElement={momentAlignment?.zahirElement}
          timeElement={momentAlignment?.timeElement}
          loading={!momentAlignment && hasProfileName}
          hasProfileName={hasProfileName}
          t={t}
          planetaryData={planetaryData}
        />
        
        {/* 2. Action Pills - Inline Buttons */}
        <View style={styles.actionPills}>
          <TouchableOpacity 
            style={styles.pillButton}
            onPress={() => router.push('/daily-checkin')}
            activeOpacity={0.7}
          >
            <Ionicons name="checkmark-circle-outline" size={16} color="#10b981" />
            <Text style={styles.pillText}>{t('home.actions.checkInNow')}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.pillButton}
            onPress={() => router.push('/divine-timing-insights')}
            activeOpacity={0.7}
          >
            <Ionicons name="trending-up-outline" size={16} color="#6366f1" />
            <Text style={styles.pillText}>{t('home.actions.viewInsights')}</Text>
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
          <Text style={styles.sectionTitle}>{t('home.sections.spiritualModules')}</Text>
          <Ionicons 
            name={modulesExpanded ? 'chevron-up' : 'chevron-down'} 
            size={20} 
            color={DarkTheme.textSecondary} 
          />
        </TouchableOpacity>
        
        {/* Compact Preview: Show first 4 modules when collapsed */}
        {!modulesExpanded && (
          <View style={styles.modulesCompactPreview}>
            {MODULES.slice(0, 4).map((module) => (
              <TouchableOpacity
                key={module.id}
                style={styles.moduleCompactItem}
                onPress={() => handleModulePress(module.id)}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.moduleCompactIcon,
                  { borderColor: module.element === 'fire' ? ElementAccents.fire :
                                 module.element === 'water' ? ElementAccents.water :
                                 module.element === 'earth' ? ElementAccents.earth :
                                 ElementAccents.air }
                ]}>
                  <Text style={styles.moduleCompactEmoji}>{module.icon}</Text>
                </View>
                <Text style={styles.moduleCompactLabel} numberOfLines={1}>
                  {module.title}
                </Text>
              </TouchableOpacity>
            ))}
            {/* "Show All" indicator */}
            <TouchableOpacity
              style={styles.moduleCompactItem}
              onPress={() => setModulesExpanded(true)}
              activeOpacity={0.7}
            >
              <View style={styles.moduleCompactIconShowMore}>
                <Ionicons name="apps" size={24} color={DarkTheme.textSecondary} />
              </View>
              <Text style={styles.moduleCompactLabel} numberOfLines={1}>
                {t('home.showAll') || 'Show All'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        
        {/* Full Grid: Show all modules when expanded */}
        {modulesExpanded && (
          <View style={styles.modulesGrid}>
            {MODULES.map((module) => (
              <TouchableOpacity
                key={module.id}
                style={styles.moduleGridItem}
                onPress={() => handleModulePress(module.id)}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.moduleIcon,
                  { borderColor: module.element === 'fire' ? ElementAccents.fire :
                                 module.element === 'water' ? ElementAccents.water :
                                 module.element === 'earth' ? ElementAccents.earth :
                                 ElementAccents.air }
                ]}>
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
    planetTransit,
    modulesExpanded,
    handleModulePress,
    t,
    getDayName,
    momentAlignment,
    planetaryData,
    hasProfileName,
    prayerCardSlide,
    blessingCardSlide,
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
  
  // Compact Preview (Collapsed State)
  modulesCompactPreview: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
    justifyContent: 'space-between',
  },
  moduleCompactItem: {
    alignItems: 'center',
    flex: 1,
    maxWidth: 70,
  },
  moduleCompactIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  moduleCompactIconShowMore: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  moduleCompactEmoji: {
    fontSize: 22,
  },
  moduleCompactLabel: {
    fontSize: 9,
    fontWeight: Typography.weightMedium,
    color: DarkTheme.textSecondary,
    textAlign: 'center',
  },
  
  // Full Grid (Expanded State)
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
