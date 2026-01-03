/**
 * Moment Alignment Details Screen
 * =================================
 * Live status of hourly planetary alignment with countdown
 * Shows current & next planetary hours, element interactions, suggested actions
 */

import { DarkTheme, ElementAccents, Spacing, Typography } from '@/constants/DarkTheme';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNowTicker } from '@/hooks/useNowTicker';
import { getSuggestedActions } from '@/services/ElementalHarmonyService';
import { Element } from '@/services/MomentAlignmentService';
import { formatCountdown } from '@/services/PlanetaryHoursService';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type MomentState = 'HOLD' | 'FLOW' | 'ACT' | 'REST';

const STATUS_THEME = {
  ACT: {
    color: '#818CF8',
    label: 'ACT',
  },
  FLOW: {
    color: '#38BDF8',
    label: 'FLOW',
  },
  HOLD: {
    color: '#94A3B8',
    label: 'HOLD',
  },
  REST: {
    color: '#8B7355',
    label: 'REST',
  },
};

export default function MomentAlignmentDetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const params = useLocalSearchParams();
  const now = useNowTicker(1000); // Update every second
  
  // Parse params
  const status = (params.status as MomentState) || 'HOLD';
  const zahirElement = (params.zahirElement as Element) || 'earth';
  const timeElement = (params.timeElement as Element) || 'air';
  const causeText = (params.causeText as string) || '';
  const currentPlanet = (params.currentPlanet as string) || '';
  const nextPlanet = (params.nextPlanet as string) || '';
  const countdownSeconds = parseInt(params.countdownSeconds as string) || 0;
  
  const theme = STATUS_THEME[status];
  const suggestedActions = getSuggestedActions(status);
  
  const getElementIcon = (element: Element) => {
    const accent = ElementAccents[element];
    return accent.emoji;
  };
  
  const getElementLabel = (element: Element) => {
    return element.charAt(0).toUpperCase() + element.slice(1);
  };
  
  // Calculate countdown (this would ideally recalculate based on actual planetary hours)
  const remainingSeconds = Math.max(0, countdownSeconds - Math.floor((Date.now() - now.getTime()) / 1000));
  const countdown = formatCountdown(remainingSeconds);
  
  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: false,
        }}
      />
      <View style={styles.container}>
        <LinearGradient
          colors={[`${theme.color}20`, `${theme.color}05`, DarkTheme.screenBackground]}
          style={styles.gradientContainer}
        >
          {/* Header */}
          <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>Moment Alignment</Text>
              <Text style={styles.headerSubtitle}>Live Status</Text>
            </View>
            <View style={{ width: 40 }} />
          </View>
          
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
            showsVerticalScrollIndicator={false}
          >
            {/* Status Badge */}
            <View style={[styles.statusBadge, { backgroundColor: `${theme.color}20`, borderColor: theme.color }]}>
              <View style={[styles.statusDot, { backgroundColor: theme.color }]} />
              <Text style={[styles.statusText, { color: theme.color }]}>{theme.label}</Text>
            </View>
            
            {/* Current Planetary Hour */}
            {currentPlanet && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Current Planetary Hour</Text>
                <View style={styles.planetCard}>
                  <View style={styles.planetHeader}>
                    <Ionicons name="time-outline" size={28} color={theme.color} />
                    <View style={styles.planetInfo}>
                      <Text style={styles.planetName}>{currentPlanet}</Text>
                      <Text style={styles.planetTime}>Active Now</Text>
                    </View>
                  </View>
                  <View style={styles.planetMeta}>
                    <View style={styles.metaBadge}>
                      <Ionicons name="sunny-outline" size={16} color={DarkTheme.textTertiary} />
                      <Text style={styles.metaText}>Daytime Hour</Text>
                    </View>
                  </View>
                </View>
              </View>
            )}
            
            {/* Next Planetary Hour */}
            {nextPlanet && remainingSeconds > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Next Shift</Text>
                <View style={styles.nextCard}>
                  <View style={styles.nextHeader}>
                    <Text style={styles.nextPlanet}>{nextPlanet}</Text>
                    <View style={[styles.countdownBadge, { backgroundColor: `${theme.color}20` }]}>
                      <Ionicons name="timer-outline" size={16} color={theme.color} />
                      <Text style={[styles.countdownText, { color: theme.color }]}>
                        in {countdown}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.nextSubtext}>The energy will shift to {nextPlanet}'s influence</Text>
                </View>
              </View>
            )}
            
            {/* Element Interaction */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Element Interaction</Text>
              <View style={styles.elementCard}>
                <View style={styles.elementRow}>
                  <View style={styles.elementBox}>
                    <Text style={styles.elementIcon}>{getElementIcon(zahirElement)}</Text>
                    <Text style={styles.elementLabel}>You</Text>
                    <Text style={[styles.elementName, { color: ElementAccents[zahirElement].primary }]}>
                      {getElementLabel(zahirElement)}
                    </Text>
                  </View>
                  <Ionicons name="swap-horizontal-outline" size={32} color={DarkTheme.textTertiary} />
                  <View style={styles.elementBox}>
                    <Text style={styles.elementIcon}>{getElementIcon(timeElement)}</Text>
                    <Text style={styles.elementLabel}>Now</Text>
                    <Text style={[styles.elementName, { color: ElementAccents[timeElement].primary }]}>
                      {getElementLabel(timeElement)}
                    </Text>
                  </View>
                </View>
                {causeText && (
                  <View style={styles.causeBox}>
                    <Ionicons name="bulb-outline" size={18} color="#f59e0b" />
                    <Text style={styles.causeText}>{causeText}</Text>
                  </View>
                )}
              </View>
            </View>
            
            {/* Suggested Focus */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Suggested Focus</Text>
              <View style={styles.actionsCard}>
                <Text style={styles.actionsDescription}>
                  Micro-actions aligned with current energy:
                </Text>
                <View style={styles.actionsList}>
                  {suggestedActions.map((action, index) => (
                    <View key={index} style={styles.actionPill}>
                      <Text style={[styles.actionText, { color: theme.color }]}>{action}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
            
            {/* Timeline Strip (Optional) */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Hour Timeline</Text>
              <View style={styles.timelineCard}>
                <View style={styles.timelineItem}>
                  <View style={[styles.timelineDot, { backgroundColor: theme.color }]} />
                  <Text style={[styles.timelineLabel, { color: theme.color }]}>Current</Text>
                  <Text style={styles.timelinePlanet}>{currentPlanet}</Text>
                </View>
                <View style={styles.timelineConnector} />
                <View style={styles.timelineItem}>
                  <View style={[styles.timelineDot, { backgroundColor: DarkTheme.textTertiary, opacity: 0.5 }]} />
                  <Text style={styles.timelineLabel}>Next</Text>
                  <Text style={styles.timelinePlanet}>{nextPlanet}</Text>
                </View>
              </View>
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
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DarkTheme.screenBackground,
  },
  gradientContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Typography.h2,
    fontWeight: Typography.weightBold as any,
    color: DarkTheme.textPrimary,
  },
  headerSubtitle: {
    fontSize: Typography.label,
    color: DarkTheme.textSecondary,
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
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
  planetCard: {
    padding: Spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    gap: Spacing.md,
  },
  planetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  planetInfo: {
    flex: 1,
  },
  planetName: {
    fontSize: Typography.h2,
    fontWeight: Typography.weightBold as any,
    color: DarkTheme.textPrimary,
  },
  planetTime: {
    fontSize: Typography.body,
    color: DarkTheme.textSecondary,
    marginTop: Spacing.xs,
  },
  planetMeta: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: Spacing.md,
  },
  metaText: {
    fontSize: Typography.caption,
    color: DarkTheme.textTertiary,
  },
  nextCard: {
    padding: Spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    gap: Spacing.sm,
  },
  nextHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nextPlanet: {
    fontSize: Typography.h3,
    fontWeight: Typography.weightBold as any,
    color: DarkTheme.textPrimary,
  },
  countdownBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Spacing.md,
  },
  countdownText: {
    fontSize: Typography.label,
    fontWeight: Typography.weightBold as any,
  },
  nextSubtext: {
    fontSize: Typography.body,
    color: DarkTheme.textSecondary,
  },
  elementCard: {
    padding: Spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    gap: Spacing.lg,
  },
  elementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  elementBox: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  elementIcon: {
    fontSize: 40,
  },
  elementLabel: {
    fontSize: Typography.caption,
    color: DarkTheme.textTertiary,
  },
  elementName: {
    fontSize: Typography.h3,
    fontWeight: Typography.weightBold as any,
  },
  causeBox: {
    flexDirection: 'row',
    gap: Spacing.sm,
    padding: Spacing.md,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
  },
  causeText: {
    flex: 1,
    fontSize: Typography.body,
    lineHeight: Typography.body * Typography.lineHeightNormal,
    color: DarkTheme.textSecondary,
  },
  actionsCard: {
    padding: Spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    gap: Spacing.md,
  },
  actionsDescription: {
    fontSize: Typography.body,
    color: DarkTheme.textSecondary,
  },
  actionsList: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  actionPill: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionText: {
    fontSize: Typography.body,
    fontWeight: Typography.weightSemibold as any,
  },
  timelineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  timelineItem: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  timelineLabel: {
    fontSize: Typography.caption,
    fontWeight: Typography.weightMedium as any,
  },
  timelinePlanet: {
    fontSize: Typography.body,
    color: DarkTheme.textPrimary,
    fontWeight: Typography.weightBold as any,
  },
  timelineConnector: {
    width: 60,
    height: 2,
    backgroundColor: DarkTheme.textTertiary,
    opacity: 0.3,
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
