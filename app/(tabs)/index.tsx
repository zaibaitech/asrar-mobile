/**
 * Asrār Everyday - Home Screen
 * 
 * Two-tier layout:
 * 1. Primary Modules: Large glassmorphic cards for main features
 * 2. Widget Bar: Compact horizontal scroll for quick access features
 * 
 * Design Philosophy:
 * - Islamic aesthetic principles (symmetry, layered depth, calligraphy)
 * - Element-based theming (Fire/Earth/Air/Water color associations)
 * - Glassmorphism effects matching web app (asrar.app)
 * - Culturally authentic with modern UX patterns
 * 
 * Performance Optimizations:
 * - FlatList for module cards (virtualization ready for expansion)
 * - Memoized components to prevent unnecessary re-renders
 * - Optimized animations using react-native-reanimated
 */

import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import { FlatList, Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ModuleCard, WidgetBar } from '../../components/home';
import { ModuleCardProps } from '../../components/home/types';
import { DarkTheme, Spacing, Typography } from '../../constants/DarkTheme';
import { useLanguage } from '../../contexts/LanguageContext';

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
    comingSoon: true,
  },
  {
    title: 'Name Destiny',
    titleArabic: 'قدر الأسماء',
    description: 'Discover the spiritual significance and destiny encoded in names',
    icon: '📜',
    element: 'earth',
    comingSoon: true,
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
    comingSoon: true,
  },
  {
    title: 'Divine Time',
    titleArabic: 'الوقت المبارك',
    description: 'Find auspicious timing for important decisions and spiritual practices',
    icon: '⏰',
    element: 'fire',
    comingSoon: true,
  },
];

export default function HomeScreen() {
  const { t } = useLanguage();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  /**
   * Handle module card press - navigate to appropriate screen
   */
  const handleModulePress = useCallback((moduleTitle: string) => {
    switch (moduleTitle) {
      case 'Istikhara':
        router.push('/istikhara');
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
      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeTitle}>
          {t('welcome.title') || 'Welcome to Asrār Everyday'}
        </Text>
        <Text style={styles.welcomeSubtitle}>
          Explore the ancient science of ʿIlm al-Ḥurūf through modern spiritual guidance
        </Text>
      </View>

      {/* Widget Bar - Secondary Features */}
      <WidgetBar />

      {/* Section Divider */}
      <Text style={styles.sectionTitle}>Spiritual Modules</Text>
    </View>
  ), [t]);

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
        data={MODULES}
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
    paddingTop: Spacing.xl,
  },
  welcomeSection: {
    paddingHorizontal: Spacing.screenPadding,
    marginBottom: Spacing.xl,
  },
  welcomeTitle: {
    fontSize: Typography.h1,
    fontWeight: Typography.weightBold,
    color: DarkTheme.textPrimary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: Typography.body,
    fontWeight: Typography.weightRegular,
    color: DarkTheme.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.body * Typography.lineHeightNormal,
    opacity: 0.9,
  },
  sectionTitle: {
    fontSize: Typography.h2,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
    marginHorizontal: Spacing.screenPadding,
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },
});
