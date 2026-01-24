/**
 * Practice Timing Screen
 * ======================
 * Full-featured screen demonstrating the Asrariya Timing Engine
 * 
 * Features:
 * - Practice category selection
 * - Real-time timing analysis
 * - Enhancement suggestions
 * - Alternative timing finder
 * 
 * @example Usage in navigation:
 * ```tsx
 * <Stack.Screen
 *   name="practice-timing"
 *   component={PracticeTimingScreen}
 *   options={{ title: 'Practice Timing' }}
 * />
 * ```
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { getStoredLanguage, tStatic, type AppLanguage } from '@/services/StaticI18n';
import { useProfile } from '@/contexts/ProfileContext';
import {
  useAsrariyaTiming,
  PracticeTimingCard,
  PracticeCategory,
  UserIntent,
} from '@/services/AsrariyaTimingEngine';

interface PracticeCategoryOption {
  category: PracticeCategory;
  icon: string;
  labelKey: string;
  descKey: string;
}

const PRACTICE_CATEGORIES: PracticeCategoryOption[] = [
  {
    category: 'protection',
    icon: 'shield-outline',
    labelKey: 'asrariya.practices.protection',
    descKey: 'asrariya.practices.protectionDesc',
  },
  {
    category: 'healing',
    icon: 'heart-outline',
    labelKey: 'asrariya.practices.healing',
    descKey: 'asrariya.practices.healingDesc',
  },
  {
    category: 'manifestation',
    icon: 'star-outline',
    labelKey: 'asrariya.practices.manifestation',
    descKey: 'asrariya.practices.manifestationDesc',
  },
  {
    category: 'guidance',
    icon: 'compass-outline',
    labelKey: 'asrariya.practices.guidance',
    descKey: 'asrariya.practices.guidanceDesc',
  },
  {
    category: 'gratitude',
    icon: 'hands-pray',
    labelKey: 'asrariya.practices.gratitude',
    descKey: 'asrariya.practices.gratitudeDesc',
  },
  {
    category: 'knowledge',
    icon: 'book-open-outline',
    labelKey: 'asrariya.practices.knowledge',
    descKey: 'asrariya.practices.knowledgeDesc',
  },
  {
    category: 'provision',
    icon: 'basket-outline',
    labelKey: 'asrariya.practices.provision',
    descKey: 'asrariya.practices.provisionDesc',
  },
  {
    category: 'general',
    icon: 'sparkles',
    labelKey: 'asrariya.practices.general',
    descKey: 'asrariya.practices.generalDesc',
  },
];

// Fallback labels if i18n keys not defined
const FALLBACK_LABELS: Record<PracticeCategory, { label: string; desc: string }> = {
  protection: { label: 'Protection', desc: 'Shield yourself from harm' },
  healing: { label: 'Healing', desc: 'Restore body, mind, and soul' },
  manifestation: { label: 'Manifestation', desc: 'Bring intentions into reality' },
  guidance: { label: 'Guidance', desc: 'Seek direction and clarity' },
  gratitude: { label: 'Gratitude', desc: 'Express thankfulness' },
  repentance: { label: 'Repentance', desc: 'Seek forgiveness' },
  knowledge: { label: 'Knowledge', desc: 'Learn and understand' },
  provision: { label: 'Provision', desc: 'Seek sustenance and abundance' },
  relationship: { label: 'Relationships', desc: 'Strengthen bonds' },
  general: { label: 'General Practice', desc: 'Spiritual growth' },
};

export function PracticeTimingScreen() {
  const { theme, accent } = useTheme();
  const { profile } = useProfile();
  const [lang, setLang] = useState<AppLanguage>('en');
  
  // Get stored language
  useEffect(() => {
    getStoredLanguage().then(l => setLang(l));
  }, []);
  
  // Map theme to colors format for backward compatibility  
  const colors = {
    background: theme.screenBackground,
    cardBackground: theme.cardBackground,
    text: theme.textPrimary,
    textSecondary: theme.textSecondary,
    primary: accent.primary,
    border: theme.borderSubtle,
  };
  
  // Simple translation helper
  const t = (key: string, fallback: string) => fallback;
  
  const [selectedCategory, setSelectedCategory] = useState<PracticeCategory | null>(null);
  const [intent, setIntent] = useState<UserIntent | null>(null);
  
  const { result, isLoading, error, analyze, findOptimal } = useAsrariyaTiming({
    refreshInterval: 60000, // Refresh every minute
    location: profile?.location,
  });
  
  const handleSelectCategory = useCallback(async (category: PracticeCategory) => {
    setSelectedCategory(category);
    const newIntent: UserIntent = { category };
    setIntent(newIntent);
    await analyze(newIntent);
  }, [analyze]);
  
  const handleFindBetterTime = useCallback(async () => {
    if (!intent) return;
    
    const optimal = await findOptimal(intent, 24);
    if (optimal) {
      // Could show a modal or navigate to a scheduling screen
      alert(`Better time found: ${optimal.startTime.toLocaleString()} (Score: ${optimal.expectedScore}%)`);
    } else {
      alert('No significantly better time found in the next 24 hours. Current timing is workable.');
    }
  }, [intent, findOptimal]);
  
  const handleStartPractice = useCallback(() => {
    // Navigate to the practice screen or start the practice flow
    alert('Starting practice... (implement navigation to practice screen)');
  }, []);
  
  if (!profile) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.emptyState}>
          <MaterialCommunityIcons
            name="account-question"
            size={64}
            color={colors.textSecondary}
          />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            Profile Needed
          </Text>
          <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>
            Complete your profile to get personalized timing guidance.
          </Text>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            🤲 Start a Practice
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Find the best time for your spiritual work
          </Text>
        </View>
        
        {/* Practice Category Selection */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            What would you like to do?
          </Text>
          
          <View style={styles.categoryGrid}>
            {PRACTICE_CATEGORIES.map((option) => {
              const fallback = FALLBACK_LABELS[option.category];
              const isSelected = selectedCategory === option.category;
              
              return (
                <TouchableOpacity
                  key={option.category}
                  style={[
                    styles.categoryCard,
                    {
                      backgroundColor: isSelected
                        ? colors.primary + '20'
                        : colors.cardBackground,
                      borderColor: isSelected ? colors.primary : colors.border,
                    },
                  ]}
                  onPress={() => handleSelectCategory(option.category)}
                  activeOpacity={0.7}
                >
                  <MaterialCommunityIcons
                    name={option.icon as any}
                    size={28}
                    color={isSelected ? colors.primary : colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.categoryLabel,
                      {
                        color: isSelected ? colors.primary : colors.text,
                      },
                    ]}
                  >
                    {t(option.labelKey, fallback.label)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        
        {/* Loading State */}
        {isLoading && (
          <View style={styles.loadingSection}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
              Analyzing timing factors...
            </Text>
            <View style={styles.loadingFactors}>
              {['Your zodiac alignment', 'Planetary influences', 'Lunar mansion', 'Practice requirements'].map(
                (factor, i) => (
                  <View key={i} style={styles.loadingFactor}>
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={16}
                      color={colors.primary}
                    />
                    <Text style={[styles.loadingFactorText, { color: colors.textSecondary }]}>
                      {factor}
                    </Text>
                  </View>
                )
              )}
            </View>
          </View>
        )}
        
        {/* Error State */}
        {error && (
          <View style={[styles.errorCard, { backgroundColor: '#FEF2F2' }]}>
            <MaterialCommunityIcons name="alert-circle" size={24} color="#EF4444" />
            <Text style={[styles.errorText, { color: '#991B1B' }]}>
              {error.message}
            </Text>
          </View>
        )}
        
        {/* Result Card */}
        {result && !isLoading && (
          <View style={styles.resultSection}>
            <PracticeTimingCard
              result={result}
              practiceName={selectedCategory ? FALLBACK_LABELS[selectedCategory].label : undefined}
              onStartPractice={handleStartPractice}
              onFindBetterTime={handleFindBetterTime}
              showEnhancements={true}
              showCautions={true}
            />
          </View>
        )}
        
        {/* Placeholder when no selection */}
        {!selectedCategory && !isLoading && (
          <View style={styles.placeholder}>
            <MaterialCommunityIcons
              name="hand-pointing-up"
              size={48}
              color={colors.textSecondary}
            />
            <Text style={[styles.placeholderText, { color: colors.textSecondary }]}>
              Select a practice above to check timing
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: '47%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
  },
  loadingSection: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  loadingFactors: {
    gap: 8,
  },
  loadingFactor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingFactorText: {
    fontSize: 14,
  },
  errorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    marginBottom: 16,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
  },
  resultSection: {
    marginTop: 8,
  },
  placeholder: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  placeholderText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
  },
  emptyDesc: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
});

export default PracticeTimingScreen;
