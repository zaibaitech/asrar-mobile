import * as Haptics from 'expo-haptics';
import { BookOpen, Info, Moon, Plus, RefreshCw, Sparkles, Users } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Borders, DarkTheme, ElementAccents, Shadows, Spacing, Typography } from '../../../constants/DarkTheme';
import { IstikharaData } from '../../../types/istikhara';

interface SpiritualTabProps {
  data: IstikharaData;
  elementColor: string;
}

export default function SpiritualTab({ data, elementColor }: SpiritualTabProps) {
  const { spiritual_practice } = data.burujProfile;
  const { repetitionCount } = data;
  const elementKey = data.burujProfile.element.toLowerCase() as "fire" | "earth" | "air" | "water";
  const accent = ElementAccents[elementKey];
  
  const [currentCount, setCurrentCount] = useState(0);

  const handleIncrement = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentCount((prev) => prev + 1);
  };

  const handleReset = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setCurrentCount(0);
  };

  const progress = Math.min((currentCount / repetitionCount) * 100, 100);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Spiritual Practices</Text>
          <Text style={styles.subtitle}>Sacred practices aligned with your spiritual nature</Text>
        </View>

        {/* Dhikr Counter - Dark with accent progress bar */}
        <View style={[styles.card, { borderColor: accent.primary }]}>
          <View style={styles.cardHeader}>
            <Sparkles size={24} color={accent.primary} />
            <Text style={styles.cardTitle}>Dhikr Counter</Text>
          </View>
          
          <View style={styles.counterContainer}>
            <Text style={styles.targetLabel}>Target: {repetitionCount} repetitions</Text>
            
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBarBackground, { backgroundColor: DarkTheme.cardBackgroundAlt }]}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${progress}%`, backgroundColor: accent.primary },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>{Math.round(progress)}%</Text>
            </View>

            <View style={styles.countDisplay}>
              <Text style={[styles.currentCount, { color: accent.primary }]}>{currentCount}</Text>
              <Text style={styles.countSeparator}>/</Text>
              <Text style={styles.targetCount}>{repetitionCount}</Text>
            </View>

            <View style={styles.counterButtons}>
              <TouchableOpacity
                style={[styles.counterButton, { backgroundColor: accent.primary }]}
                onPress={handleIncrement}
                activeOpacity={0.8}
              >
                <Plus size={20} color={DarkTheme.textPrimary} />
                <Text style={styles.counterButtonText}>Count</Text>
              </TouchableOpacity>

              {currentCount > 0 && (
                <TouchableOpacity
                  style={[styles.resetButton, { 
                    backgroundColor: accent.glow, 
                    borderColor: accent.secondary 
                  }]}
                  onPress={handleReset}
                  activeOpacity={0.8}
                >
                  <RefreshCw size={18} color={accent.secondary} />
                  <Text style={[styles.resetButtonText, { color: accent.secondary }]}>Reset</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* Practice Night - Dark card with white text */}
        {spiritual_practice.practice_night.primary.en && (
          <View style={[styles.card, { borderColor: accent.primary }]}>
            <View style={styles.cardHeader}>
              <Moon size={24} color={accent.primary} />
              <Text style={styles.cardTitle}>Practice Night</Text>
            </View>
            <View style={[styles.highlightBox, { borderLeftColor: accent.primary }]}>
              <Text style={styles.practiceText}>{spiritual_practice.practice_night.primary.en}</Text>
            </View>
          </View>
        )}

        {/* Spiritual Practice Guidance */}
        <View style={[styles.card, { borderColor: accent.primary }]}>
          <View style={styles.cardHeader}>
            <BookOpen size={24} color={accent.primary} />
            <Text style={styles.cardTitle}>Spiritual Practice</Text>
          </View>
          <Text style={styles.practiceText}>{spiritual_practice.en}</Text>
          {spiritual_practice.fr && (
            <Text style={[styles.practiceText, styles.frenchText]}>{spiritual_practice.fr}</Text>
          )}
        </View>

        {/* Divine Names - Dark with white Arabic text */}
        {spiritual_practice.divine_names?.note?.en && (
          <View style={[styles.card, { 
            borderColor: accent.primary, 
            borderLeftWidth: Borders.accent, 
            borderLeftColor: accent.primary 
          }]}>
            <View style={styles.cardHeader}>
              <Sparkles size={24} color={accent.primary} />
              <Text style={styles.cardTitle}>Divine Names to Recite</Text>
            </View>
            
            {/* White Arabic text on dark background */}
            <View style={[styles.arabicContainer, { backgroundColor: DarkTheme.cardBackgroundAlt }]}>
              <Text style={styles.arabicText}>
                {spiritual_practice.divine_names.note.en.match(/[\u0600-\u06FF\s]+/)?.[0] || ''}
              </Text>
            </View>
            
            <Text style={styles.practiceText}>{spiritual_practice.divine_names.note.en}</Text>
          </View>
        )}

        {/* Spiritual Connections - Angel & Jinn */}
        {(spiritual_practice.angel.transliteration || spiritual_practice.jinn.transliteration) && (
          <View style={[styles.card, { borderColor: accent.primary }]}>
            <View style={styles.cardHeader}>
              <Users size={24} color={accent.primary} />
              <Text style={styles.cardTitle}>Spiritual Connections</Text>
            </View>
            
            {spiritual_practice.angel.transliteration && (
              <View style={styles.connectionItem}>
                <Text style={styles.connectionLabel}>Angel</Text>
                <View style={[styles.connectionBox, { borderLeftColor: accent.primary }]}>
                  <Text style={styles.connectionArabic}>{spiritual_practice.angel.arabic}</Text>
                  <Text style={styles.connectionTranslit}>({spiritual_practice.angel.transliteration})</Text>
                </View>
              </View>
            )}
            
            {spiritual_practice.jinn.transliteration && (
              <View style={styles.connectionItem}>
                <Text style={styles.connectionLabel}>Jinn</Text>
                <View style={[styles.connectionBox, { borderLeftColor: accent.primary }]}>
                  <Text style={styles.connectionArabic}>{spiritual_practice.jinn.arabic}</Text>
                  <Text style={styles.connectionTranslit}>({spiritual_practice.jinn.transliteration})</Text>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Dhikr Count Info */}
        <View style={[styles.card, { borderColor: accent.secondary, borderLeftWidth: Borders.accent, borderLeftColor: accent.secondary }]}>
          <View style={styles.cardHeader}>
            <Info size={24} color={accent.secondary} />
            <Text style={styles.cardTitle}>About Your Dhikr Count</Text>
          </View>
          <Text style={styles.infoText}>
            The number {repetitionCount} is calculated from your combined Abjad numerology total. 
            This personalized count is significant for your spiritual practice and should be 
            maintained when reciting the divine names and performing dhikr.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DarkTheme.screenBackground,
  },
  content: {
    padding: Spacing.screenPadding,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.sectionGap,
  },
  title: {
    fontSize: Typography.h1,
    fontWeight: Typography.weightBold,
    color: DarkTheme.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.label,
    color: DarkTheme.textTertiary,
    textAlign: 'center',
    paddingHorizontal: Spacing.lg,
  },
  card: {
    backgroundColor: DarkTheme.cardBackground,
    borderRadius: Borders.radiusLg,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    borderWidth: Borders.standard,
    ...Shadows.card,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  cardTitle: {
    fontSize: Typography.h3,
    fontWeight: Typography.weightBold,
    color: DarkTheme.textPrimary,
  },
  practiceText: {
    fontSize: Typography.body,
    color: DarkTheme.textSecondary,
    lineHeight: Typography.body * Typography.lineHeightRelaxed,
  },
  frenchText: {
    marginTop: Spacing.md,
    fontStyle: 'italic',
    color: DarkTheme.textTertiary,
  },
  highlightBox: {
    backgroundColor: DarkTheme.cardBackgroundAlt,
    borderLeftWidth: 4,
    padding: Spacing.lg,
    borderRadius: Borders.radiusSm,
  },
  arabicContainer: {
    padding: Spacing.xl,
    borderRadius: Borders.radiusMd,
    marginBottom: Spacing.lg,
    alignItems: 'center',
  },
  arabicText: {
    fontSize: 36,
    color: DarkTheme.textPrimary,
    fontWeight: Typography.weightBold,
    textAlign: 'center',
    lineHeight: 56,
  },
  connectionItem: {
    marginBottom: Spacing.lg,
  },
  connectionLabel: {
    fontSize: Typography.label,
    color: DarkTheme.textTertiary,
    marginBottom: Spacing.sm,
    fontWeight: Typography.weightSemibold,
  },
  connectionBox: {
    backgroundColor: DarkTheme.cardBackgroundAlt,
    borderLeftWidth: 4,
    padding: Spacing.lg,
    borderRadius: Borders.radiusSm,
  },
  connectionArabic: {
    fontSize: Typography.h2,
    color: DarkTheme.textPrimary,
    marginBottom: Spacing.xs,
  },
  connectionTranslit: {
    fontSize: Typography.label,
    color: DarkTheme.textSecondary,
  },
  counterContainer: {
    alignItems: 'center',
  },
  targetLabel: {
    fontSize: Typography.label,
    color: DarkTheme.textTertiary,
    marginBottom: Spacing.lg,
  },
  progressBarContainer: {
    width: '100%',
    marginBottom: Spacing.xl,
  },
  progressBarBackground: {
    height: 12,
    borderRadius: Borders.radiusSm,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: Borders.radiusSm,
  },
  progressText: {
    fontSize: Typography.caption,
    color: DarkTheme.textMuted,
    textAlign: 'center',
  },
  countDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: Spacing.xl,
  },
  currentCount: {
    fontSize: 48,
    fontWeight: Typography.weightBold,
  },
  countSeparator: {
    fontSize: 32,
    color: DarkTheme.textMuted,
    marginHorizontal: Spacing.sm,
  },
  targetCount: {
    fontSize: 32,
    color: DarkTheme.textTertiary,
  },
  counterButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  counterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xxxl,
    borderRadius: Borders.radiusMd,
  },
  counterButtonText: {
    color: DarkTheme.textPrimary,
    fontSize: Typography.body,
    fontWeight: Typography.weightBold,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderRadius: Borders.radiusMd,
    borderWidth: 1,
  },
  resetButtonText: {
    fontSize: Typography.body,
    fontWeight: Typography.weightSemibold,
  },
  infoText: {
    fontSize: Typography.body,
    color: DarkTheme.textSecondary,
    lineHeight: Typography.body * Typography.lineHeightRelaxed,
  },
});
