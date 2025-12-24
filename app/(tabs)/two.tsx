import { useLanguage } from '@/contexts/LanguageContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ModuleCard } from '../../components/home';
import { ModuleCardProps } from '../../components/home/types';
import { DarkTheme, Spacing, Typography } from '../../constants/DarkTheme';

/**
 * Life Guidance modules - tools for spiritual decision-making
 */
const GUIDANCE_MODULES: ModuleCardProps[] = [
  {
    title: 'Compatibility',
    titleArabic: 'التوافق',
    description: 'Analyze relationship harmony through elemental and numerical balance',
    icon: '💞',
    element: 'air',
    comingSoon: false,
  },
  {
    title: 'Name Destiny',
    titleArabic: 'مصير الاسم',
    description: 'Discover your spiritual path and destiny through your name',
    icon: '📜',
    element: 'water',
    comingSoon: false,
  },
  {
    title: 'Divine Timing',
    titleArabic: 'الوقت المبارك',
    description: 'Find auspicious timing for important decisions and spiritual practices',
    icon: '⏰',
    element: 'fire',
    comingSoon: true,
  },
];

export default function TabTwoScreen() {
  const { t } = useLanguage();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const handleModulePress = useCallback((moduleTitle: string) => {
    switch (moduleTitle) {
      case 'Compatibility':
        router.push('/compatibility');
        break;
      case 'Name Destiny':
        router.push('/name-destiny');
        break;
      case 'Divine Timing':
        console.log('Divine Timing - Coming Soon');
        break;
      default:
        console.log(`${moduleTitle} - Coming Soon`);
    }
  }, [router]);

  const renderModuleCard = useCallback(({ item }: { item: ModuleCardProps }) => (
    <ModuleCard
      {...item}
      onPress={() => handleModulePress(item.title)}
    />
  ), [handleModulePress]);

  const ListHeaderComponent = () => (
    <View style={styles.header}>
      <Text style={styles.welcomeTitle}>
        {t('nav.guidance')}
      </Text>
      <Text style={styles.welcomeSubtitle}>
        Navigate life's important decisions with spiritual wisdom
      </Text>
    </View>
  );

  const ListFooterComponent = () => (
    <View style={{ height: Spacing.xxxl + insets.bottom }} />
  );

  const keyExtractor = useCallback((item: ModuleCardProps) => item.title, []);
  
  return (
    <LinearGradient
      colors={[
        '#0f172a',
        '#1e1b4b',
        '#312e81',
      ]}
      style={styles.gradient}
    >
      <FlatList
        data={GUIDANCE_MODULES}
        renderItem={renderModuleCard}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
        showsVerticalScrollIndicator={false}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  welcomeTitle: {
    fontSize: Typography.h2,
    fontWeight: Typography.weightBold as any,
    color: DarkTheme.textPrimary,
    marginBottom: Spacing.xs,
  },
  welcomeSubtitle: {
    fontSize: Typography.body,
    color: DarkTheme.textTertiary,
    lineHeight: 22,
  },
});
