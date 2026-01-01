/**
 * Daily Guidance Detail Screen
 * ==============================
 * Comprehensive daily spiritual timing guidance
 * 
 * Features:
 * - Real-time day element + user element harmony
 * - Timing quality explanation
 * - Activity recommendations (best for / avoid)
 * - Peak hours visualization
 * - Cycle state information
 * - User's Manazil (lunar mansion) baseline
 * - Quranic verse reflection
 * - Classical wisdom
 */

import { DarkTheme, Spacing } from '@/constants/DarkTheme';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProfile } from '@/contexts/ProfileContext';
import { getLunarMansionByIndex, normalizeMansionIndex } from '@/data/lunarMansions';
import { DailyGuidance, getDailyGuidance } from '@/services/DailyGuidanceService';
import { QuranReflection, selectReflectionVerse } from '@/services/QuranReflectionService';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function DailyGuidanceScreen() {
  const { t } = useLanguage();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { profile } = useProfile();
  
  const [guidance, setGuidance] = useState<DailyGuidance | null>(null);
  const [reflection, setReflection] = useState<QuranReflection | null>(null);
  const [loading, setLoading] = useState(true);
  const normalizedMansionIndex = normalizeMansionIndex(profile?.derived?.manazilBaseline);

  const mapTimingQualityToReflection = (
    quality: DailyGuidance['timingQuality']
  ): 'favorable' | 'neutral' | 'delicate' => {
    switch (quality) {
      case 'favorable':
        return 'favorable';
      case 'delicate':
        return 'delicate';
      case 'transformative':
        return 'delicate';
      default:
        return 'neutral';
    }
  };

  const mapRelationshipToCycleState = (
    relationship: DailyGuidance['relationship']
  ): 'completion / closure' | 'initiation' | 'growth / expansion' | 'review / restraint' => {
    switch (relationship) {
      case 'harmonious':
        return 'growth / expansion';
      case 'complementary':
        return 'initiation';
      case 'transformative':
        return 'review / restraint';
      default:
        return 'completion / closure';
    }
  };
  
  const loadGuidance = useCallback(async () => {
    setLoading(true);
    try {
      const dailyGuidance = await getDailyGuidance(profile);
      
      // Normalize guidance data with safe defaults
      const normalizedGuidance: DailyGuidance = {
        timingQuality: dailyGuidance?.timingQuality || 'neutral',
        dayElement: dailyGuidance?.dayElement || 'fire',
        userElement: dailyGuidance?.userElement,
        relationship: dailyGuidance?.relationship || 'neutral',
        message: dailyGuidance?.message || 'Balanced energies today',
        bestFor: Array.isArray(dailyGuidance?.bestFor) ? dailyGuidance.bestFor : [],
        avoid: Array.isArray(dailyGuidance?.avoid) ? dailyGuidance.avoid : [],
        peakHours: dailyGuidance?.peakHours,
      };
      
      setGuidance(normalizedGuidance);
      
      // Load Quranic reflection based on normalized guidance
      const seedDate = new Date().toISOString().split('T')[0];
      const seedKey = `${seedDate}-${normalizedGuidance.dayElement}-${normalizedMansionIndex ?? 'mansion'}-${profile?.dobISO ?? 'dob'}`;
      const verse = selectReflectionVerse({
        timingQuality: mapTimingQualityToReflection(normalizedGuidance.timingQuality),
        cycleState: mapRelationshipToCycleState(normalizedGuidance.relationship),
        elementalTone: normalizedGuidance.dayElement,
        intentionCategory: 'custom',
        seedKey,
      });
      setReflection(verse);
    } catch (error) {
      console.error('[DailyGuidance] Error loading guidance:', error);
    } finally {
      setLoading(false);
    }
  }, [profile]);
  
  useEffect(() => {
    loadGuidance();
  }, [loadGuidance]);
  
  const getStatusColor = (quality?: string) => {
    switch (quality) {
      case 'favorable':
        return '#10b981';
      case 'transformative':
        return '#8B7355';
      case 'delicate':
        return '#64748b';
      default:
        return '#64B5F6';
    }
  };
  
  const getElementIcon = (element?: string) => {
    switch (element) {
      case 'fire':
        return '🔥';
      case 'water':
        return '💧';
      case 'air':
        return '🌬️';
      case 'earth':
        return '🌱';
      default:
        return '✨';
    }
  };
  
  const getElementLabel = (element?: string) => {
    if (!element) return '';
    return element.charAt(0).toUpperCase() + element.slice(1);
  };
  
  const getRelationshipDescription = (relationship?: string) => {
    switch (relationship) {
      case 'harmonious':
        return t('dailyGuidance.relationship.harmonious');
      case 'complementary':
        return t('dailyGuidance.relationship.complementary');
      case 'transformative':
        return t('dailyGuidance.relationship.transformative');
      default:
        return t('dailyGuidance.relationship.neutral');
    }
  };
  
  const getTimingQualityLabel = (quality?: string) => {
    switch (quality) {
      case 'favorable':
        return t('dailyGuidance.timing.favorable');
      case 'transformative':
        return t('dailyGuidance.timing.transformative');
      case 'delicate':
        return t('dailyGuidance.timing.delicate');
      default:
        return t('dailyGuidance.timing.neutral');
    }
  };
  
  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B7355" />
          <Text style={styles.loadingText}>{t('common.loading')}</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  if (!guidance) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={DarkTheme.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('dailyGuidance.title')}</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🌙</Text>
          <Text style={styles.emptyTitle}>{t('dailyGuidance.empty.title')}</Text>
          <Text style={styles.emptyMessage}>{t('dailyGuidance.empty.message')}</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  const statusColor = getStatusColor(guidance.timingQuality);
  const dayOfWeek = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  
  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={DarkTheme.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{t('dailyGuidance.title')}</Text>
          <Text style={styles.headerSubtitle}>{dayOfWeek}</Text>
        </View>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section - Timing Quality */}
        <LinearGradient
          colors={[`${statusColor}20`, `${statusColor}08`]}
          style={styles.heroCard}
        >
          <View style={styles.heroHeader}>
            <Ionicons name="compass-outline" size={32} color={statusColor} />
            <View style={styles.heroTextContainer}>
              <Text style={styles.heroLabel}>{t('dailyGuidance.todaysFlow')}</Text>
              <Text style={[styles.heroTitle, { color: statusColor }]}>
                {getTimingQualityLabel(guidance.timingQuality)}
              </Text>
            </View>
          </View>
          <Text style={styles.heroMessage}>{guidance.message}</Text>
        </LinearGradient>
        
        {/* Element Harmony Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="git-compare-outline" size={20} color="#8B7355" />
            <Text style={styles.cardTitle}>{t('dailyGuidance.elementHarmony')}</Text>
          </View>
          
          <View style={styles.elementsComparison}>
            {/* Day Element */}
            <View style={styles.elementColumn}>
              <Text style={styles.elementLabel}>{t('dailyGuidance.dayElement')}</Text>
              <View style={styles.elementBadge}>
                <Text style={styles.elementIcon}>{getElementIcon(guidance.dayElement)}</Text>
                <Text style={styles.elementName}>{getElementLabel(guidance.dayElement)}</Text>
              </View>
              <Text style={styles.elementDescription}>
                {t(`dailyGuidance.elements.${guidance.dayElement}.description`)}
              </Text>
            </View>
            
            <View style={styles.elementDivider}>
              <Ionicons name="swap-horizontal" size={24} color={DarkTheme.textTertiary} />
            </View>
            
            {/* User Element */}
            <View style={styles.elementColumn}>
              <Text style={styles.elementLabel}>
                {guidance.userElement ? t('dailyGuidance.yourElement') : t('dailyGuidance.noElement')}
              </Text>
              {guidance.userElement ? (
                <>
                  <View style={[styles.elementBadge, styles.userElementBadge]}>
                    <Text style={styles.elementIcon}>{getElementIcon(guidance.userElement)}</Text>
                    <Text style={styles.elementName}>{getElementLabel(guidance.userElement)}</Text>
                  </View>
                  <Text style={styles.elementDescription}>
                    {t(`dailyGuidance.elements.${guidance.userElement}.description`)}
                  </Text>
                </>
              ) : (
                <Text style={styles.addElementHint}>{t('dailyGuidance.addProfileHint')}</Text>
              )}
            </View>
          </View>
          
          {/* Relationship */}
          <View style={[styles.relationshipBadge, { backgroundColor: `${statusColor}15`, borderColor: statusColor }]}>
            <Text style={[styles.relationshipText, { color: statusColor }]}>
              {getRelationshipDescription(guidance.relationship)}
            </Text>
          </View>
        </View>
        
        {/* User's Manazil Information */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="moon-outline" size={20} color="#8B7355" />
            <Text style={styles.cardTitle}>{t('dailyGuidance.lunarMansion')}</Text>
          </View>
          
          {normalizedMansionIndex !== null ? (
            <View style={styles.manazilInfo}>
              <Text style={styles.manazilLabel}>{t('dailyGuidance.yourMansion')}</Text>
              <Text style={styles.manazilValue}>{normalizedMansionIndex + 1} / 28</Text>
              {(() => {
                const mansion = getLunarMansionByIndex(normalizedMansionIndex);
                if (mansion) {
                  return (
                    <>
                      <Text style={styles.manazilName}>{mansion.nameTransliteration}</Text>
                      <Text style={styles.manazilArabic}>{mansion.nameArabic}</Text>
                      <Text style={styles.manazilEnglish}>{mansion.nameEnglish}</Text>
                    </>
                  );
                }
                return null;
              })()}
              <Text style={styles.manazilHint}>{t('dailyGuidance.mansionHint')}</Text>
            </View>
          ) : (
            <View style={styles.mansionMissing}>
              <Text style={styles.mansionMissingText}>
                {t('dailyGuidance.missingDobCta')}
              </Text>
              <TouchableOpacity
                style={styles.mansionCtaButton}
                onPress={() => router.push('/name-destiny')}
              >
                <Text style={styles.mansionCtaButtonText}>
                  {t('dailyGuidance.addBirthDate')}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        {/* Recommendations */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="bulb-outline" size={20} color="#10b981" />
            <Text style={styles.cardTitle}>{t('dailyGuidance.recommendations')}</Text>
          </View>
          
          {/* Best For */}
          {Array.isArray(guidance?.bestFor) && guidance.bestFor.length > 0 && (
            <View style={styles.recommendationSection}>
              <Text style={styles.recommendationSectionTitle}>
                {t('dailyGuidance.bestFor')}
              </Text>
              {guidance.bestFor.map((item, index) => (
                <View key={index} style={styles.recommendationRow}>
                  <Text style={[styles.bulletIcon, { color: '#10b981' }]}>✓</Text>
                  <Text style={styles.recommendationText}>{item}</Text>
                </View>
              ))}
            </View>
          )}
          
          {/* Avoid */}
          {Array.isArray(guidance?.avoid) && guidance.avoid.length > 0 && (
            <View style={styles.recommendationSection}>
              <Text style={styles.recommendationSectionTitle}>
                {t('dailyGuidance.avoid')}
              </Text>
              {guidance.avoid.map((item, index) => (
                <View key={index} style={styles.recommendationRow}>
                  <Text style={[styles.bulletIcon, { color: '#94a3b8' }]}>○</Text>
                  <Text style={styles.recommendationText}>{item}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
        
        {/* Peak Hours */}
        {guidance.peakHours && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="time-outline" size={20} color={statusColor} />
              <Text style={styles.cardTitle}>{t('dailyGuidance.peakHours')}</Text>
            </View>
            <View style={[styles.peakHoursContent, { backgroundColor: `${statusColor}10` }]}>
              <Text style={[styles.peakHoursText, { color: statusColor }]}>
                {guidance.peakHours}
              </Text>
            </View>
          </View>
        )}
        
        {/* Quranic Reflection */}
        {reflection && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="book-outline" size={20} color="#8B7355" />
              <Text style={styles.cardTitle}>{t('dailyGuidance.reflection')}</Text>
            </View>
            <View style={styles.reflectionContent}>
              <Text style={styles.arabicVerse}>{reflection.verse.arabicText}</Text>
              <Text style={styles.verseTranslation}>{reflection.verse.translationEn}</Text>
              <Text style={styles.verseReference}>
                {reflection.verse.surahNameEn} {reflection.verse.surahNumber}:{reflection.verse.ayahNumber}
              </Text>
            </View>
          </View>
        )}
        
        {/* Classical Wisdom */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="book-outline" size={20} color="#8B7355" />
            <Text style={styles.cardTitle}>{t('dailyGuidance.wisdom')}</Text>
          </View>
          <Text style={styles.wisdomQuote}>
            {t('dailyGuidance.wisdomQuote')}
          </Text>
          <Text style={styles.wisdomSource}>
            {t('dailyGuidance.wisdomSource')}
          </Text>
        </View>
        
        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Ionicons name="shield-checkmark-outline" size={16} color={DarkTheme.textTertiary} />
          <Text style={styles.disclaimerText}>{t('momentDetail.disclaimer')}</Text>
        </View>
        
        {/* Bottom Padding */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DarkTheme.screenBackground,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  backButton: {
    padding: Spacing.xs,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: DarkTheme.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
    marginTop: 2,
  },
  placeholder: {
    width: 40,
  },
  
  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
  },
  loadingText: {
    fontSize: 14,
    color: DarkTheme.textSecondary,
  },
  
  // Empty
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: DarkTheme.textPrimary,
    marginBottom: Spacing.sm,
  },
  emptyMessage: {
    fontSize: 14,
    color: DarkTheme.textSecondary,
    textAlign: 'center',
  },
  
  // ScrollView
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  
  // Hero Card
  heroCard: {
    padding: Spacing.xl,
    borderRadius: 20,
    gap: Spacing.md,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  heroTextContainer: {
    flex: 1,
  },
  heroLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: DarkTheme.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 4,
  },
  heroMessage: {
    fontSize: 14,
    lineHeight: 22,
    color: DarkTheme.textPrimary,
  },
  
  // Card
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    gap: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: DarkTheme.textPrimary,
  },
  
  // Elements Comparison
  elementsComparison: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  elementColumn: {
    flex: 1,
    gap: Spacing.sm,
  },
  elementLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: DarkTheme.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  elementBadge: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    gap: Spacing.xs,
  },
  userElementBadge: {
    backgroundColor: 'rgba(139, 115, 85, 0.2)',
    borderColor: 'rgba(139, 115, 85, 0.3)',
  },
  elementIcon: {
    fontSize: 32,
  },
  elementName: {
    fontSize: 14,
    fontWeight: '700',
    color: DarkTheme.textPrimary,
  },
  elementDescription: {
    fontSize: 11,
    lineHeight: 16,
    color: DarkTheme.textSecondary,
    textAlign: 'center',
  },
  elementDivider: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  addElementHint: {
    fontSize: 11,
    color: DarkTheme.textTertiary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  
  // Relationship
  relationshipBadge: {
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  relationshipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  
  // Manazil
  manazilInfo: {
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
  },
  manazilLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: DarkTheme.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  manazilValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#8B7355',
  },
  manazilName: {
    fontSize: 16,
    fontWeight: '600',
    color: DarkTheme.textPrimary,
    marginTop: Spacing.xs,
  },
  manazilArabic: {
    fontSize: 20,
    fontWeight: '600',
    color: '#8B7355',
    fontFamily: 'System',
    marginTop: 4,
  },
  manazilEnglish: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
    fontStyle: 'italic',
    marginTop: 2,
  },
  manazilHint: {
    fontSize: 11,
    color: DarkTheme.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  mansionMissing: {
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.lg,
  },
  mansionMissingText: {
    fontSize: 13,
    color: DarkTheme.textSecondary,
    textAlign: 'center',
  },
  mansionCtaButton: {
    backgroundColor: '#8B7355',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: 8,
  },
  mansionCtaButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: DarkTheme.textPrimary,
  },
  
  // Recommendations
  recommendationSection: {
    gap: Spacing.sm,
  },
  recommendationSectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: DarkTheme.textPrimary,
    marginBottom: Spacing.xs,
  },
  recommendationRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'flex-start',
  },
  bulletIcon: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20,
  },
  recommendationText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    color: DarkTheme.textSecondary,
  },
  
  // Peak Hours
  peakHoursContent: {
    padding: Spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  peakHoursText: {
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Reflection
  reflectionContent: {
    gap: Spacing.md,
  },
  arabicVerse: {
    fontSize: 18,
    lineHeight: 32,
    color: DarkTheme.textPrimary,
    textAlign: 'right',
    fontFamily: 'System',
  },
  verseTranslation: {
    fontSize: 13,
    lineHeight: 22,
    color: DarkTheme.textSecondary,
    fontStyle: 'italic',
  },
  verseReference: {
    fontSize: 11,
    fontWeight: '600',
    color: DarkTheme.textTertiary,
  },
  
  // Wisdom
  wisdomQuote: {
    fontSize: 14,
    lineHeight: 24,
    color: DarkTheme.textPrimary,
    fontStyle: 'italic',
  },
  wisdomSource: {
    fontSize: 11,
    fontWeight: '600',
    color: DarkTheme.textTertiary,
    marginTop: Spacing.xs,
  },
  
  // Disclaimer
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    padding: Spacing.md,
    borderRadius: 12,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 11,
    color: DarkTheme.textTertiary,
    lineHeight: 16,
  },
});
