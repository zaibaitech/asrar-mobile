/**
 * Daily Energy Details Screen
 * ===============================
 * Detailed view of today's spiritual timing guidance
 * Shows day ruler, elemental harmony, best activities, and explanations
 */

import { DarkTheme, Spacing, Typography } from '@/constants/DarkTheme';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProfile } from '@/contexts/ProfileContext';
import { getLunarMansionByIndex, normalizeMansionIndex } from '@/data/lunarMansions';
import { getDayRuler, getPlanetInfo } from '@/services/PlanetaryHoursService';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type TimingQuality = 'favorable' | 'neutral' | 'delicate' | 'transformative';
type Element = 'fire' | 'water' | 'air' | 'earth';

export default function DailyGuidanceDetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const { profile } = useProfile();
  const params = useLocalSearchParams();
  
  const [bestForExpanded, setBestForExpanded] = useState(true);
  const [whyThisExpanded, setWhyThisExpanded] = useState(false);
  
  // Parse params
  const timingQuality = (params.timingQuality as TimingQuality) || 'neutral';
  const dayElement = (params.dayElement as Element) || 'earth';
  const messageKey = (params.messageKey as string) || '';
  const messageParams = params.messageParams ? JSON.parse(params.messageParams as string) : {};
  const bestForKeys = params.bestForKeys ? JSON.parse(params.bestForKeys as string) : [];
  const avoidKeys = params.avoidKeys ? JSON.parse(params.avoidKeys as string) : [];
  const peakHoursKey = (params.peakHoursKey as string) || '';
  
  const now = new Date();
  const dayOfWeek = now.getDay();
  const dayKeys = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayKey = dayKeys[dayOfWeek];
  const dayName = t(`home.dailyGuidanceDetails.days.${dayKey}`);
  const date = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  
  // Get day ruler
  const dayRuler = getDayRuler(now);
  const dayRulerInfo = getPlanetInfo(dayRuler);
  
  function getStatusColor() {
    switch (timingQuality) {
      case 'favorable':
        return '#10b981';
      case 'transformative':
        return '#f59e0b';
      case 'delicate':
        return '#ef4444';
      default:
        return '#64B5F6';
    }
  }
  
  function getStatusLabel() {
    return t(`home.dailyGuidanceDetails.window.${timingQuality}`);
  }
  
  function getElementIcon(element: Element) {
    const icons = {
      fire: '🔥',
      water: '💧',
      air: '🌬️',
      earth: '🌱',
    };
    return icons[element];
  }
  
  function getElementLabel(element: Element) {
    return t(`home.dailyGuidanceDetails.elements.${element}`);
  }
  
  const statusColor = getStatusColor();

  const manazilBaselineIndex = normalizeMansionIndex(profile?.derived?.manazilBaseline);
  const manazilBaseline = manazilBaselineIndex !== null
    ? getLunarMansionByIndex(manazilBaselineIndex)
    : null;
  
  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={DarkTheme.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>{t('home.dailyGuidanceDetails.title')}</Text>
          <Text style={styles.headerSubtitle}>{dayName}, {date}</Text>
        </View>
        <View style={styles.placeholder} />
      </View>
      
      <LinearGradient
        colors={[`${statusColor}15`, `${statusColor}05`, DarkTheme.screenBackground]}
        style={styles.gradientContainer}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Status Badge */}
          <View style={[styles.statusBadge, { backgroundColor: `${statusColor}20`, borderColor: statusColor }]}>
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            <Text style={[styles.statusText, { color: statusColor }]}>{getStatusLabel()}</Text>
          </View>
          
          {/* Day Ruler Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('home.dailyGuidanceDetails.sections.dayRuler')}</Text>
            <View style={styles.planetCard}>
              <Text style={styles.planetSymbol}>{dayRulerInfo.symbol}</Text>
              <View style={styles.planetInfo}>
                <Text style={styles.planetName}>{dayRuler}</Text>
                <Text style={styles.planetArabic}>{dayRulerInfo.arabicName}</Text>
                <Text style={styles.planetElement}>
                  {getElementIcon(dayRulerInfo.element)} {t('home.dailyGuidanceDetails.elementText', { element: getElementLabel(dayRulerInfo.element) })}
                </Text>
              </View>
            </View>
            <Text style={styles.explainerText}>
              {t('home.dailyGuidanceDetails.dayRulerText', { 
                planet: dayRuler, 
                element: getElementLabel(dayRulerInfo.element).toLowerCase() 
              })}
            </Text>
          </View>
          
          {/* Daily Window Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('home.dailyGuidanceDetails.sections.dailyWindow')}</Text>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="compass-outline" size={24} color={statusColor} />
                <Text style={[styles.cardTitle, { color: statusColor }]}>{getStatusLabel()}</Text>
              </View>
              <Text style={styles.cardText}>
                {t(`home.dailyGuidanceDetails.windowDescription.${timingQuality}`)}
              </Text>
              {messageKey && (
                <Text style={styles.cardText}>
                  {t(messageKey, messageParams)}
                </Text>
              )}
            </View>
          </View>

          {/* Manazil (Lunar Mansion) Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('home.dailyGuidanceDetails.sections.manazil')}</Text>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="moon-outline" size={24} color={DarkTheme.accent} />
                <Text style={[styles.cardTitle, { color: DarkTheme.accent }]}>
                  {t('home.dailyGuidanceDetails.manazil.title')}
                </Text>
              </View>

              {manazilBaseline ? (
                <>
                  <Text style={styles.cardText}>
                    {t('home.dailyGuidanceDetails.manazil.baseline', {
                      index: String(manazilBaseline.index + 1),
                      name: `${manazilBaseline.nameTransliteration} (${manazilBaseline.nameArabic})`,
                    })}
                  </Text>
                  <Text style={styles.planetElement}>
                    {getElementIcon(manazilBaseline.element)}{' '}
                    {t('home.dailyGuidanceDetails.elementText', { element: getElementLabel(manazilBaseline.element) })}
                  </Text>
                  <Text style={styles.cardText}>
                    {t('home.dailyGuidanceDetails.manazil.hint')}
                  </Text>
                </>
              ) : (
                <Text style={styles.cardText}>{t('home.dailyGuidanceDetails.manazil.missing')}</Text>
              )}
            </View>
          </View>
          
          {/* Best For Section */}
          {bestForKeys.length > 0 && (
            <View style={styles.section}>
              <TouchableOpacity 
                style={styles.expandableHeader}
                onPress={() => setBestForExpanded(!bestForExpanded)}
              >
                <Text style={styles.sectionTitle}>✅ {t('home.dailyGuidanceDetails.sections.bestFor')}</Text>
                <Ionicons 
                  name={bestForExpanded ? 'chevron-up' : 'chevron-down'} 
                  size={20} 
                  color={DarkTheme.textSecondary}
                />
              </TouchableOpacity>
              {bestForExpanded && (
                <View style={styles.listCard}>
                  {bestForKeys.map((key: string, index: number) => (
                    <View key={index} style={styles.listItem}>
                      <View style={[styles.listDot, { backgroundColor: '#10b981' }]} />
                      <Text style={styles.listText}>{t(key)}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}
          
          {/* Why This? Section */}
          <View style={styles.section}>
            <TouchableOpacity 
              style={styles.expandableHeader}
              onPress={() => setWhyThisExpanded(!whyThisExpanded)}
            >
              <Text style={styles.sectionTitle}>💡 {t('home.dailyGuidanceDetails.sections.whyThis')}</Text>
              <Ionicons 
                name={whyThisExpanded ? 'chevron-up' : 'chevron-down'} 
                size={20} 
                color={DarkTheme.textSecondary}
              />
            </TouchableOpacity>
            {whyThisExpanded && (
              <View style={styles.card}>
                <Text style={styles.cardText}>
                  • {t('home.dailyGuidanceDetails.whyThisContent.line1', { day: dayName, planet: dayRuler })}{'\n\n'}
                  • {t('home.dailyGuidanceDetails.whyThisContent.line2', { element: getElementLabel(dayElement).toLowerCase(), planet: dayRuler })}{'\n\n'}
                  • {t('home.dailyGuidanceDetails.whyThisContent.line4')}
                </Text>
              </View>
            )}
          </View>
          
          {/* Footer Disclaimer */}
          <View style={styles.disclaimer}>
            <Ionicons name="information-circle-outline" size={16} color={DarkTheme.textTertiary} />
            <Text style={styles.disclaimerText}>
              {t('home.dailyGuidanceDetails.disclaimer')}
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

function getHarmonyColor(level: string): string {
  switch (level) {
    case 'Harmonious':
      return '#10b981';
    case 'Supportive':
      return '#059669';
    case 'Challenging':
      return '#ef4444';
    default:
      return '#64748b';
  }
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
  headerTextContainer: {
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
  
  gradientContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    gap: Spacing.xl,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: Spacing.lg,
    borderWidth: 2,
    alignSelf: 'flex-start',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusText: {
    fontSize: Typography.h3,
    fontWeight: Typography.weightBold as any,
  },
  section: {
    gap: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.h3,
    fontWeight: Typography.weightBold as any,
    color: DarkTheme.textPrimary,
  },
  expandableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  planetCard: {
    flexDirection: 'row',
    gap: Spacing.lg,
    padding: Spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  planetSymbol: {
    fontSize: 48,
  },
  planetInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  planetName: {
    fontSize: Typography.h2,
    fontWeight: Typography.weightBold as any,
    color: DarkTheme.textPrimary,
  },
  planetArabic: {
    fontSize: Typography.body,
    color: DarkTheme.textSecondary,
  },
  planetElement: {
    fontSize: Typography.label,
    color: DarkTheme.textTertiary,
  },
  card: {
    padding: Spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    gap: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  cardTitle: {
    fontSize: Typography.h3,
    fontWeight: Typography.weightBold as any,
  },
  cardText: {
    fontSize: Typography.body,
    lineHeight: Typography.body * Typography.lineHeightNormal,
    color: DarkTheme.textSecondary,
  },
  explainerText: {
    fontSize: Typography.body,
    lineHeight: Typography.body * Typography.lineHeightNormal,
    color: DarkTheme.textSecondary,
  },
  harmonyCard: {
    padding: Spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    gap: Spacing.md,
  },
  harmonyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  harmonyElementBox: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  harmonyElementIcon: {
    fontSize: 32,
  },
  harmonyElementLabel: {
    fontSize: Typography.label,
    color: DarkTheme.textSecondary,
  },
  harmonySymbol: {
    fontSize: 24,
    color: DarkTheme.textTertiary,
  },
  harmonyBadge: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: Spacing.md,
    alignSelf: 'center',
  },
  harmonyLevel: {
    fontSize: Typography.h3,
    fontWeight: Typography.weightBold as any,
    textAlign: 'center',
  },
  harmonyExplanation: {
    fontSize: Typography.body,
    lineHeight: Typography.body * Typography.lineHeightNormal,
    color: DarkTheme.textSecondary,
    textAlign: 'center',
  },
  listCard: {
    padding: Spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    gap: Spacing.md,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  listDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
  },
  listText: {
    flex: 1,
    fontSize: Typography.body,
    lineHeight: Typography.body * Typography.lineHeightNormal,
    color: DarkTheme.textSecondary,
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    justifyContent: 'center',
    paddingVertical: Spacing.md,
  },
  disclaimerText: {
    fontSize: Typography.caption,
    color: DarkTheme.textTertiary,
  },
});
