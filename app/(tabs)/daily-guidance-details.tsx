/**
 * Daily Guidance Details Screen
 * ===============================
 * Detailed view of today's spiritual timing guidance
 * Shows day ruler, elemental harmony, best activities, and explanations
 */

import { DarkTheme, Spacing, Typography } from '@/constants/DarkTheme';
import { useLanguage } from '@/contexts/LanguageContext';
import { calculateElementalHarmony } from '@/services/ElementalHarmonyService';
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
  const params = useLocalSearchParams();
  
  const [bestForExpanded, setBestForExpanded] = useState(true);
  const [whyThisExpanded, setWhyThisExpanded] = useState(false);
  
  // Parse params
  const timingQuality = (params.timingQuality as TimingQuality) || 'neutral';
  const dayElement = (params.dayElement as Element) || 'earth';
  const userElement = (params.userElement as Element) || undefined;
  const relationship = (params.relationship as string) || 'neutral';
  const message = (params.message as string) || '';
  const bestFor = params.bestFor ? JSON.parse(params.bestFor as string) : [];
  const avoid = params.avoid ? JSON.parse(params.avoid as string) : [];
  const peakHours = (params.peakHours as string) || '';
  
  const now = new Date();
  const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });
  const date = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  
  // Get day ruler
  const dayRuler = getDayRuler(now);
  const dayRulerInfo = getPlanetInfo(dayRuler);
  
  // Calculate harmony
  const harmony = userElement ? calculateElementalHarmony(userElement, dayElement) : null;
  
  const getStatusColor = () => {
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
  };
  
  const getStatusLabel = () => {
    switch (timingQuality) {
      case 'favorable':
        return 'Favorable Window';
      case 'transformative':
        return 'Transformative Window';
      case 'delicate':
        return 'Delicate Window';
      default:
        return 'Neutral Window';
    }
  };
  
  const getElementIcon = (element: Element) => {
    const icons = {
      fire: '🔥',
      water: '💧',
      air: '🌬️',
      earth: '🌱',
    };
    return icons[element];
  };
  
  const getElementLabel = (element: Element) => {
    return element.charAt(0).toUpperCase() + element.slice(1);
  };
  
  const statusColor = getStatusColor();
  
  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={DarkTheme.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Daily Guidance</Text>
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
            <Text style={styles.sectionTitle}>Day Ruler</Text>
            <View style={styles.planetCard}>
              <Text style={styles.planetSymbol}>{dayRulerInfo.symbol}</Text>
              <View style={styles.planetInfo}>
                <Text style={styles.planetName}>{dayRuler}</Text>
                <Text style={styles.planetArabic}>{dayRulerInfo.arabicName}</Text>
                <Text style={styles.planetElement}>
                  {getElementIcon(dayRulerInfo.element)} {getElementLabel(dayRulerInfo.element)} Element
                </Text>
              </View>
            </View>
            <Text style={styles.explainerText}>
              Today is ruled by {dayRuler}, bringing {getElementLabel(dayRulerInfo.element).toLowerCase()} energy to all activities and intentions.
            </Text>
          </View>
          
          {/* Daily Window Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Daily Window</Text>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="compass-outline" size={24} color={statusColor} />
                <Text style={[styles.cardTitle, { color: statusColor }]}>{getStatusLabel()}</Text>
              </View>
              <Text style={styles.cardText}>
                {timingQuality === 'favorable' && 
                  'Today presents favorable conditions for action and growth. The energies align to support your intentions.'}
                {timingQuality === 'neutral' &&
                  'Today offers balanced energies. A steady day for routine activities and gradual progress.'}
                {timingQuality === 'transformative' &&
                  'Today brings transformative potential through contrast. Opportunities arise from adapting to changing energies.'}
                {timingQuality === 'delicate' &&
                  'Today requires gentle navigation. Practice patience and mindful awareness in your actions.'}
              </Text>
            </View>
          </View>
          
          {/* Elemental Harmony Section */}
          {harmony && userElement && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Elemental Harmony</Text>
              <View style={styles.harmonyCard}>
                <View style={styles.harmonyHeader}>
                  <View style={styles.harmonyElementBox}>
                    <Text style={styles.harmonyElementIcon}>{getElementIcon(userElement)}</Text>
                    <Text style={styles.harmonyElementLabel}>Your {getElementLabel(userElement)}</Text>
                  </View>
                  <Text style={styles.harmonySymbol}>◐</Text>
                  <View style={styles.harmonyElementBox}>
                    <Text style={styles.harmonyElementIcon}>{getElementIcon(dayElement)}</Text>
                    <Text style={styles.harmonyElementLabel}>Day's {getElementLabel(dayElement)}</Text>
                  </View>
                </View>
                <View style={[styles.harmonyBadge, { backgroundColor: getHarmonyColor(harmony.level) + '20' }]}>
                  <Text style={[styles.harmonyLevel, { color: getHarmonyColor(harmony.level) }]}>
                    {harmony.level}
                  </Text>
                </View>
                <Text style={styles.harmonyExplanation}>{harmony.explanation}</Text>
              </View>
            </View>
          )}
          
          {/* Best For Section */}
          {bestFor.length > 0 && (
            <View style={styles.section}>
              <TouchableOpacity 
                style={styles.expandableHeader}
                onPress={() => setBestForExpanded(!bestForExpanded)}
              >
                <Text style={styles.sectionTitle}>✅ Best For</Text>
                <Ionicons 
                  name={bestForExpanded ? 'chevron-up' : 'chevron-down'} 
                  size={20} 
                  color={DarkTheme.textSecondary}
                />
              </TouchableOpacity>
              {bestForExpanded && (
                <View style={styles.listCard}>
                  {bestFor.map((item: string, index: number) => (
                    <View key={index} style={styles.listItem}>
                      <View style={[styles.listDot, { backgroundColor: '#10b981' }]} />
                      <Text style={styles.listText}>{item}</Text>
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
              <Text style={styles.sectionTitle}>💡 Why This?</Text>
              <Ionicons 
                name={whyThisExpanded ? 'chevron-up' : 'chevron-down'} 
                size={20} 
                color={DarkTheme.textSecondary}
              />
            </TouchableOpacity>
            {whyThisExpanded && (
              <View style={styles.card}>
                <Text style={styles.cardText}>
                  • Today's guidance is calculated from {dayName}'s planetary ruler ({dayRuler}){'\n\n'}
                  • The {getElementLabel(dayElement).toLowerCase()} element of {dayRuler} shapes the day's overall energy{'\n\n'}
                  {userElement && `• Your personal ${getElementLabel(userElement).toLowerCase()} element (derived from your name) interacts with the day's energy\n\n`}
                  • This is a reflection tool, not a predictive system — use it to align intentions with natural rhythms
                </Text>
              </View>
            )}
          </View>
          
          {/* Footer Disclaimer */}
          <View style={styles.disclaimer}>
            <Ionicons name="information-circle-outline" size={16} color={DarkTheme.textTertiary} />
            <Text style={styles.disclaimerText}>
              For reflection only • Not a ruling
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
