import * as Haptics from 'expo-haptics';
import {
    CheckCircle,
    ChevronDown,
    ChevronUp,
    Heart,
    Info,
    Lightbulb,
    Sparkles,
    Star,
    Sun,
    Target,
    TrendingUp
} from "lucide-react-native";
import React, { useState } from "react";
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Borders, DarkTheme, ElementAccents, Spacing, Typography } from "../../../constants/DarkTheme";
import { useLanguage } from "../../../contexts/LanguageContext";
import type { IstikharaData } from "../../../types/istikhara";

const { width } = Dimensions.get('window');

interface BlessedDayTabProps {
  data: IstikharaData;
  elementColor: string;
}

const DAYS_OF_WEEK = [
  { en: 'Sunday', fr: 'Dimanche', emoji: '☀️' },
  { en: 'Monday', fr: 'Lundi', emoji: '🌙' },
  { en: 'Tuesday', fr: 'Mardi', emoji: '⚔️' },
  { en: 'Wednesday', fr: 'Mercredi', emoji: '📚' },
  { en: 'Thursday', fr: 'Jeudi', emoji: '⚡' },
  { en: 'Friday', fr: 'Vendredi', emoji: '🌟' },
  { en: 'Saturday', fr: 'Samedi', emoji: '🪐' },
];

export default function BlessedDayTab({ data, elementColor }: BlessedDayTabProps) {
  const { language } = useLanguage();
  const profile = data.burujProfile;
  const elementKey = profile.element.toLowerCase() as "fire" | "earth" | "air" | "water";
  const accent = ElementAccents[elementKey];
  const blessedDay = profile.blessed_day;

  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['tips']));

  const toggleSection = async (section: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const dayIndex = DAYS_OF_WEEK.findIndex(
    d => d.en === blessedDay.day.en || d.fr === blessedDay.day.fr
  );

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>
          {language === 'en' ? 'Your Blessed Day' : 'Votre Jour Béni'}
        </Text>
        <Text style={styles.subtitle}>
          {language === 'en' 
            ? 'The most auspicious day for important decisions and spiritual practices' 
            : 'Le jour le plus propice pour les décisions importantes et les pratiques spirituelles'}
        </Text>
      </View>

      {/* Main Day Display - Dark Card with Accent Highlights */}
      <View style={[styles.mainDayCard, { 
        borderColor: `${accent.primary}33`, 
        backgroundColor: `${accent.primary}33`,
        shadowColor: accent.primary 
      }]}>
        <View style={[styles.iconCircle, { backgroundColor: `${accent.primary}26`, borderColor: accent.primary }]}>
          <Text style={styles.dayEmoji}>
            {dayIndex >= 0 ? DAYS_OF_WEEK[dayIndex].emoji : '📅'}
          </Text>
        </View>
        
        <Text style={[styles.dayName, { color: accent.primary }]}>
          {blessedDay.day[language as 'en' | 'fr']}
        </Text>
        
        <Text style={styles.daySubtext}>
          {language === 'en' 
            ? 'Your Power Day of the Week' 
            : 'Votre Jour de Puissance de la Semaine'}
        </Text>
        
        {blessedDay.day_number !== null && (
          <View style={[styles.dayNumberBadge, { backgroundColor: `${accent.primary}26`, borderColor: accent.primary }]}>
            <Text style={[styles.dayNumberText, { color: accent.primary }]}>
              {language === 'en' ? 'Day' : 'Jour'} #{blessedDay.day_number}
            </Text>
          </View>
        )}
      </View>

      {/* Weekly Overview - Dark Card with Colored Day Icons */}
      <View style={[styles.card, { 
        borderColor: `${accent.primary}33`, 
        backgroundColor: `${accent.primary}33`,
        shadowColor: accent.primary 
      }]}>
        <View style={styles.cardHeader}>
          <Sun size={20} color={accent.primary} />
          <Text style={styles.cardTitle}>
            {language === 'en' ? 'Weekly Overview' : 'Aperçu Hebdomadaire'}
          </Text>
        </View>
        <View style={styles.daysGrid}>
          {DAYS_OF_WEEK.map((day, idx) => {
            const isBlessed = day.en === blessedDay.day.en;
            return (
              <View
                key={idx}
                style={[
                  styles.dayPill,
                  { backgroundColor: DarkTheme.cardBackgroundAlt },
                  isBlessed && { 
                    backgroundColor: accent.glow,
                    borderColor: accent.primary,
                    borderWidth: 2,
                  },
                ]}
              >
                <Text style={styles.dayPillEmoji}>{day.emoji}</Text>
                <Text
                  style={[
                    styles.dayPillText,
                    isBlessed && { color: accent.primary, fontWeight: '700' },
                  ]}
                >
                  {day[language as 'en' | 'fr'].substring(0, 3)}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Best Activities Section */}
      {blessedDay.best_for[language as 'en' | 'fr'].length > 0 && (
        <View style={[styles.card, { borderColor: accent.primary, borderLeftWidth: Borders.accent, borderLeftColor: accent.primary }]}>
          <View style={styles.cardHeader}>
            <CheckCircle size={20} color={accent.primary} />
            <Text style={styles.cardTitle}>
              {language === 'en' ? 'Best Activities' : 'Meilleures Activités'}
            </Text>
          </View>
          <Text style={styles.cardSubtitle}>
            {language === 'en'
              ? 'Recommended activities for your blessed day'
              : 'Activités recommandées pour votre jour béni'}
          </Text>
          <View style={styles.activitiesList}>
            {blessedDay.best_for[language as 'en' | 'fr'].map((activity, index) => (
              <View key={index} style={styles.activityItem}>
                <View style={[styles.activityBullet, { backgroundColor: accent.primary }]} />
                <Text style={styles.activityText}>{activity}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Special Notes */}
      {blessedDay.special_notes && blessedDay.special_notes[language as 'en' | 'fr'].length > 0 && (
        <View style={[styles.card, { 
          borderColor: `${accent.primary}33`, 
          backgroundColor: `${accent.primary}33`,
          shadowColor: accent.primary 
        }]}>
          <View style={styles.cardHeader}>
            <Star size={20} color={accent.primary} />
            <Text style={styles.cardTitle}>
              {language === 'en' ? 'Spiritual Significance' : 'Signification Spirituelle'}
            </Text>
          </View>
          {blessedDay.special_notes[language as 'en' | 'fr'].map((note, index) => (
            <View key={index} style={styles.noteItem}>
              <Star size={14} color={accent.primary} />
              <Text style={styles.noteText}>{note}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Associated Prophet */}
      {blessedDay.associated_prophet && (
        <View style={[styles.card, { 
          borderColor: `${accent.primary}33`, 
          backgroundColor: `${accent.primary}33`,
          shadowColor: accent.primary 
        }]}>
          <View style={styles.cardHeader}>
            <Sparkles size={20} color={accent.primary} />
            <Text style={styles.cardTitle}>
              {language === 'en' ? 'Associated Prophet' : 'Prophète Associé'}
            </Text>
          </View>
          <View style={styles.prophetContent}>
            <Text style={styles.prophetArabic}>{blessedDay.associated_prophet.arabic}</Text>
            <Text style={styles.prophetName}>
              {blessedDay.associated_prophet[language as 'en' | 'fr']}
            </Text>
          </View>
        </View>
      )}

      {/* Practical Tips */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => toggleSection('tips')}
      >
        <View style={[styles.card, { borderColor: accent.primary }]}>
          <View style={styles.collapsibleHeader}>
            <View style={styles.cardHeader}>
              <Lightbulb size={20} color={accent.primary} />
              <Text style={styles.cardTitle}>
                {language === 'en' ? 'Practical Tips' : 'Conseils Pratiques'}
              </Text>
            </View>
            {expandedSections.has('tips') ? (
              <ChevronUp size={20} color={accent.primary} />
            ) : (
              <ChevronDown size={20} color={accent.primary} />
            )}
          </View>

          {expandedSections.has('tips') && (
            <View style={styles.tipsContent}>
              <View style={[styles.tipCard, { backgroundColor: DarkTheme.cardBackgroundAlt }]}>
                <View style={styles.tipHeader}>
                  <Target size={16} color={accent.primary} />
                  <Text style={styles.tipTitle}>
                    {language === 'en' ? 'Pro Tip' : 'Conseil Pro'}
                  </Text>
                </View>
                <Text style={styles.tipText}>
                  {language === 'en'
                    ? `Schedule your most important decisions and spiritual practices on ${blessedDay.day.en}. This day carries special energy aligned with your elemental nature.`
                    : `Planifiez vos décisions les plus importantes et vos pratiques spirituelles le ${blessedDay.day.fr}. Ce jour porte une énergie spéciale alignée avec votre nature élémentaire.`}
                </Text>
              </View>

              <View style={[styles.tipCard, { backgroundColor: DarkTheme.cardBackgroundAlt }]}>
                <View style={styles.tipHeader}>
                  <TrendingUp size={16} color={accent.primary} />
                  <Text style={styles.tipTitle}>
                    {language === 'en' ? 'Weekly Planning' : 'Planification Hebdomadaire'}
                  </Text>
                </View>
                <Text style={styles.tipText}>
                  {language === 'en'
                    ? 'Start planning your week with this day in mind. Reserve it for high-priority activities and avoid scheduling routine tasks.'
                    : 'Commencez à planifier votre semaine en gardant ce jour à l\'esprit. Réservez-le pour des activités hautement prioritaires et évitez de planifier des tâches routinières.'}
                </Text>
              </View>

              <View style={[styles.tipCard, { backgroundColor: DarkTheme.cardBackgroundAlt }]}>
                <View style={styles.tipHeader}>
                  <Heart size={16} color={accent.primary} />
                  <Text style={styles.tipTitle}>
                    {language === 'en' ? 'Element Alignment' : 'Alignement Élémentaire'}
                  </Text>
                </View>
                <Text style={styles.tipText}>
                  {language === 'en'
                    ? `As a ${profile.element} element person, this day resonates with your core energy. Use it to recharge and align with your true nature.`
                    : `En tant que personne de l'élément ${profile.element}, ce jour résonne avec votre énergie centrale. Utilisez-le pour vous ressourcer et vous aligner avec votre vraie nature.`}
                </Text>
              </View>
            </View>
          )}
        </View>
      </TouchableOpacity>

      {/* Note or Temporary Suggestion */}
      {(blessedDay.note || blessedDay.temporary_suggestion) && (
        <View style={[styles.card, { borderColor: accent.secondary, borderLeftWidth: Borders.accent, borderLeftColor: accent.secondary }]}>
          <View style={styles.cardHeader}>
            <Info size={20} color={accent.secondary} />
            <Text style={[styles.cardTitle, { color: DarkTheme.textPrimary }]}>
              {language === 'en' ? 'Important Note' : 'Note Importante'}
            </Text>
          </View>
          <Text style={styles.noteInfoText}>
            {(blessedDay.note || blessedDay.temporary_suggestion)?.[language as 'en' | 'fr']}
          </Text>
        </View>
      )}

      {/* Bottom Spacing */}
      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1020',
  },
  scrollContent: {
    padding: Spacing.screenPadding,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.sectionGap,
  },
  title: {
    fontSize: Typography.h1,
    fontWeight: Typography.weightBold,
    color: '#fff',
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.label,
    color: '#94a3b8',
    textAlign: 'center',
    paddingHorizontal: Spacing.lg,
    lineHeight: Typography.label * Typography.lineHeightNormal,
  },
  mainDayCard: {
    borderRadius: Borders.radiusXl,
    borderWidth: Borders.emphasized,
    marginBottom: Spacing.xl,
    padding: Spacing.xxxl,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: Borders.radiusCircle,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  dayEmoji: {
    fontSize: 48,
  },
  dayName: {
    fontSize: 48,
    fontWeight: Typography.weightBold,
    marginBottom: Spacing.sm,
  },
  daySubtext: {
    fontSize: Typography.label,
    color: '#cbd5e1',
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  dayNumberBadge: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Borders.radiusLg,
    borderWidth: 1,
  },
  dayNumberText: {
    fontSize: Typography.label,
    fontWeight: Typography.weightSemibold,
  },
  card: {
    borderRadius: Borders.radiusLg,
    padding: Spacing.xl,
    borderWidth: Borders.standard,
    marginBottom: Spacing.xl,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  cardTitle: {
    fontSize: Typography.h3,
    fontWeight: Typography.weightBold,
    color: '#fff',
  },
  cardSubtitle: {
    fontSize: Typography.caption,
    color: '#64748b',
    marginBottom: Spacing.lg,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  dayPill: {
    width: (width - 72) / 7,
    aspectRatio: 1,
    borderRadius: Borders.radiusMd,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayPillEmoji: {
    fontSize: 16,
    marginBottom: 2,
  },
  dayPillText: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: Typography.weightSemibold,
  },
  activitiesList: {
    gap: Spacing.md,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  activityBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
  },
  activityText: {
    flex: 1,
    fontSize: Typography.body,
    color: '#cbd5e1',
    lineHeight: Typography.body * Typography.lineHeightNormal,
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  noteText: {
    flex: 1,
    fontSize: Typography.label,
    color: '#cbd5e1',
    lineHeight: Typography.label * Typography.lineHeightNormal,
  },
  prophetContent: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  prophetArabic: {
    fontSize: Typography.h1,
    color: '#fff',
    fontWeight: Typography.weightBold,
  },
  prophetName: {
    fontSize: Typography.body,
    color: '#cbd5e1',
  },
  collapsibleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tipsContent: {
    marginTop: Spacing.lg,
    gap: Spacing.md,
  },
  tipCard: {
    borderRadius: Borders.radiusMd,
    padding: Spacing.lg,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  tipTitle: {
    fontSize: Typography.label,
    fontWeight: Typography.weightSemibold,
    color: '#fff',
  },
  tipText: {
    fontSize: Typography.label,
    color: '#cbd5e1',
    lineHeight: Typography.label * Typography.lineHeightNormal,
  },
  noteInfoText: {
    fontSize: Typography.body,
    color: '#cbd5e1',
    lineHeight: Typography.body * Typography.lineHeightRelaxed,
  },
  bottomSpacer: {
    height: 20,
  },
});
