/**
 * Zikr Hub Screen
 * ===============
 * Main screen for the Zikr module showing user's challenges,
 * progress tracking, and ability to add new challenges.
 * Based on web app's RamadanHub pattern.
 */

import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import ResponsiveAppHeader from '@/components/AppHeader';
import BottomTabBar from '@/components/BottomTabBar';
import { Borders, DarkTheme, Spacing, Typography } from '@/constants/DarkTheme';
import { useLanguage } from '@/contexts/LanguageContext';

import AddChallengeModal from '../components/AddChallengeModal';
import ChallengeCard from '../components/ChallengeCard';
import { formatNumber } from '../constants';
import { useZikr } from '../contexts/ZikrContext';

// ─── Screen ──────────────────────────────────────────────────────────────────────

export default function ZikrHubScreen() {
  const { language, setLanguage, t } = useLanguage();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const {
    state,
    addChallenge,
    removeChallenge,
    logCount,
    toggleFavorite,
    getTotalTodayProgress,
    getTotalProgress,
    getFavorites,
  } = useZikr();

  // Stats
  const todayTotal = getTotalTodayProgress();
  const totalProgress = getTotalProgress();
  const challengeCount = state.challenges.length;
  const favorites = getFavorites();

  // Handle pull to refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  }, []);

  // Empty state
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyEmoji}>🤲</Text>
      <Text style={styles.emptyTitle}>
        {language === 'fr' ? 'Commencez votre pratique' : 'Start Your Practice'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {language === 'fr'
          ? 'Ajoutez un dhikr pour commencer votre voyage spirituel'
          : 'Add a dhikr to begin your spiritual journey'}
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => setShowAddModal(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.emptyButtonText}>
          {language === 'fr' ? '+ Ajouter un Dhikr' : '+ Add Dhikr'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safeArea}>
        <ResponsiveAppHeader
          currentLanguage={language === 'en' ? 'EN' : 'FR'}
          onLanguageChange={(lang) => setLanguage(lang.toLowerCase() as 'en' | 'fr' | 'ar')}
          onProfilePress={() => router.push('/profile')}
          onMenuPress={() => {}}
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={DarkTheme.textSecondary}
            />
          }
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.headerSection}>
            <View style={styles.titleRow}>
              <Text style={styles.screenTitle}>
                {t('zikr.title') || (language === 'fr' ? 'Dhikr & Wird' : 'Dhikr & Wird')}
              </Text>
              <Text style={styles.screenSubtitle}>
                {t('zikr.subtitle') || (language === 'fr' 
                  ? 'Souvenir d\'Allah pour la paix intérieure' 
                  : 'Remembrance of Allah for inner peace')}
              </Text>
            </View>
          </View>

          {/* Stats Summary */}
          <View style={styles.statsCard}>
            <LinearGradient
              colors={['rgba(212, 175, 55, 0.15)', 'rgba(212, 175, 55, 0.05)']}
              style={styles.statsGradient}
            >
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{formatNumber(todayTotal)}</Text>
                  <Text style={styles.statLabel}>
                    {language === 'fr' ? "Aujourd'hui" : 'Today'}
                  </Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{formatNumber(totalProgress)}</Text>
                  <Text style={styles.statLabel}>
                    {language === 'fr' ? 'Total' : 'All Time'}
                  </Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{challengeCount}</Text>
                  <Text style={styles.statLabel}>
                    {language === 'fr' ? 'Pratiques' : 'Practices'}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Add Challenge Button */}
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowAddModal(true);
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.addButtonIcon}>+</Text>
            <Text style={styles.addButtonText}>
              {language === 'fr' ? 'Ajouter un Dhikr' : 'Add Dhikr'}
            </Text>
          </TouchableOpacity>

          {/* Challenge Cards */}
          {state.isHydrated && state.challenges.length === 0 ? (
            renderEmptyState()
          ) : (
            <View style={styles.challengeList}>
              {/* Favorites Section */}
              {favorites.length > 0 && (
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionIcon}>⭐</Text>
                  <Text style={styles.sectionTitle}>
                    {language === 'fr' ? 'Favoris' : 'Favorites'}
                  </Text>
                </View>
              )}
              {favorites.map((challenge) => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  onLogCount={(amount, session) => logCount(challenge.id, amount, session)}
                  onRemove={() => removeChallenge(challenge.id)}
                  onToggleFavorite={() => toggleFavorite(challenge.id)}
                  defaultExpanded={false}
                />
              ))}

              {/* All Challenges Section */}
              {state.challenges.filter(c => !c.isFavorite).length > 0 && (
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionIcon}>📿</Text>
                  <Text style={styles.sectionTitle}>
                    {language === 'fr' ? 'Mes Pratiques' : 'My Practices'}
                  </Text>
                </View>
              )}
              {state.challenges
                .filter((c) => !c.isFavorite)
                .map((challenge, index) => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    onLogCount={(amount, session) => logCount(challenge.id, amount, session)}
                    onRemove={() => removeChallenge(challenge.id)}
                    onToggleFavorite={() => toggleFavorite(challenge.id)}
                    defaultExpanded={index === 0 && favorites.length === 0}
                  />
                ))}
            </View>
          )}

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacer} />
        </ScrollView>

        <BottomTabBar />

        {/* Add Challenge Modal */}
        <AddChallengeModal
          visible={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdd={(type, config) => addChallenge(type, config)}
        />
      </SafeAreaView>
    </>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: DarkTheme.screenBackground,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.lg,
  },
  
  // Header
  headerSection: {
    marginBottom: Spacing.lg,
  },
  titleRow: {
    marginBottom: Spacing.sm,
  },
  screenTitle: {
    fontSize: Typography.h1,
    fontWeight: Typography.weightBold,
    color: DarkTheme.textPrimary,
    marginBottom: Spacing.xs,
  },
  screenSubtitle: {
    fontSize: Typography.body,
    color: DarkTheme.textTertiary,
  },
  
  // Stats Card
  statsCard: {
    borderRadius: Borders.radiusLg,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
  },
  statsGradient: {
    padding: Spacing.lg,
    borderRadius: Borders.radiusLg,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: Typography.h2,
    fontWeight: Typography.weightBold,
    color: '#D4AF37',
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: Typography.caption,
    color: DarkTheme.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
  },
  
  // Add Button
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    borderRadius: Borders.radiusMd,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    borderStyle: 'dashed',
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  addButtonIcon: {
    fontSize: 24,
    color: '#D4AF37',
    marginRight: Spacing.sm,
    fontWeight: Typography.weightLight,
  },
  addButtonText: {
    fontSize: Typography.body,
    fontWeight: Typography.weightMedium,
    color: '#D4AF37',
  },
  
  // Challenge List
  challengeList: {
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
  sectionIcon: {
    fontSize: 18,
    marginRight: Spacing.sm,
  },
  sectionTitle: {
    fontSize: Typography.label,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxxl,
    paddingHorizontal: Spacing.lg,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    fontSize: Typography.h3,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: Typography.body,
    color: DarkTheme.textTertiary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    maxWidth: 280,
  },
  emptyButton: {
    backgroundColor: '#D4AF37',
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.lg,
    borderRadius: Borders.radiusMd,
  },
  emptyButtonText: {
    fontSize: Typography.body,
    fontWeight: Typography.weightSemibold,
    color: '#1A1625',
  },
  
  // Bottom Spacer
  bottomSpacer: {
    height: 100,
  },
});
