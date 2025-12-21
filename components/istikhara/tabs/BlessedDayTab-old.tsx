import * as Haptics from 'expo-haptics';
import {
  Calendar,
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
import { DarkTheme, ElementAccents, Spacing, Borders, Shadows, Typography } from "../../../constants/DarkTheme";
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
        <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
          <Calendar size={32} color={colors.accent} />
        </View>
        <Text style={styles.title}>
          {language === 'en' ? 'Your Blessed Day' : 'Votre Jour Béni'}
        </Text>
        <Text style={styles.subtitle}>
          {language === 'en' 
            ? 'The most auspicious day for important decisions and spiritual practices' 
            : 'Le jour le plus propice pour les décisions importantes et les pratiques spirituelles'}
        </Text>
      </View>

      {/* Main Day Display - Large Card */}
      <LinearGradient
        colors={colors.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.mainDayCard, { borderColor: colors.border }]}
      >
        <View style={styles.mainDayContent}>
          <Text style={styles.dayEmoji}>
            {dayIndex >= 0 ? DAYS_OF_WEEK[dayIndex].emoji : '📅'}
          </Text>
          <Text style={[styles.dayName, { color: colors.accent }]}>
            {blessedDay.day[language as 'en' | 'fr']}
          </Text>
          <Text style={styles.daySubtext}>
            {language === 'en' 
              ? 'Your Power Day of the Week' 
              : 'Votre Jour de Puissance de la Semaine'}
          </Text>
          {blessedDay.day_number !== null && (
            <View style={styles.dayNumberBadge}>
              <Text style={styles.dayNumberText}>
                {language === 'en' ? 'Day' : 'Jour'} #{blessedDay.day_number}
              </Text>
            </View>
          )}
        </View>
      </LinearGradient>

      {/* Weekly Overview */}
      <LinearGradient
        colors={colors.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, { borderColor: colors.border }]}
      >
        <View style={styles.cardHeader}>
          <Sun size={20} color={colors.accent} />
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
                  isBlessed && { 
                    backgroundColor: colors.accent,
                    borderColor: colors.border,
                    borderWidth: 2,
                  },
                ]}
              >
                <Text style={styles.dayPillEmoji}>{day.emoji}</Text>
                <Text
                  style={[
                    styles.dayPillText,
                    isBlessed && styles.dayPillTextActive,
                  ]}
                >
                  {day[language as 'en' | 'fr'].substring(0, 3)}
                </Text>
              </View>
            );
          })}
        </View>
      </LinearGradient>

      {/* Best Activities Section */}
      {blessedDay.best_for[language as 'en' | 'fr'].length > 0 && (
        <LinearGradient
          colors={colors.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.card, { borderColor: colors.border }]}
        >
          <View style={styles.cardHeader}>
            <CheckCircle size={20} color="#4ade80" />
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
                <View style={styles.activityIconContainer}>
                  <CheckCircle size={18} color="#4ade80" />
                </View>
                <Text style={styles.activityText}>{activity}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>
      )}

      {/* Special Notes */}
      {blessedDay.special_notes && blessedDay.special_notes[language as 'en' | 'fr'].length > 0 && (
        <LinearGradient
          colors={['rgba(234, 179, 8, 0.15)', 'rgba(202, 138, 4, 0.1)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.specialCard, { borderColor: '#fbbf24' }]}
        >
          <View style={styles.cardHeader}>
            <Star size={20} color="#fbbf24" />
            <Text style={[styles.cardTitle, { color: '#fbbf24' }]}>
              {language === 'en' ? 'Spiritual Significance' : 'Signification Spirituelle'}
            </Text>
          </View>
          {blessedDay.special_notes[language as 'en' | 'fr'].map((note, index) => (
            <View key={index} style={styles.noteItem}>
              <Star size={14} color="#fbbf24" />
              <Text style={styles.noteText}>{note}</Text>
            </View>
          ))}
        </LinearGradient>
      )}

      {/* Associated Prophet */}
      {blessedDay.associated_prophet && (
        <LinearGradient
          colors={['rgba(139, 92, 246, 0.15)', 'rgba(124, 58, 237, 0.1)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.card, { borderColor: '#a78bfa' }]}
        >
          <View style={styles.cardHeader}>
            <Sparkles size={20} color="#a78bfa" />
            <Text style={[styles.cardTitle, { color: '#a78bfa' }]}>
              {language === 'en' ? 'Associated Prophet' : 'Prophète Associé'}
            </Text>
          </View>
          <View style={styles.prophetContent}>
            <Text style={styles.prophetArabic}>{blessedDay.associated_prophet.arabic}</Text>
            <Text style={styles.prophetName}>
              {blessedDay.associated_prophet[language as 'en' | 'fr']}
            </Text>
          </View>
        </LinearGradient>
      )}

      {/* Practical Tips */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => toggleSection('tips')}
      >
        <LinearGradient
          colors={['rgba(59, 130, 246, 0.15)', 'rgba(37, 99, 235, 0.1)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.card, { borderColor: '#60a5fa' }]}
        >
          <View style={styles.collapsibleHeader}>
            <View style={styles.cardHeader}>
              <Lightbulb size={20} color="#60a5fa" />
              <Text style={[styles.cardTitle, { color: '#60a5fa' }]}>
                {language === 'en' ? 'Practical Tips' : 'Conseils Pratiques'}
              </Text>
            </View>
            {expandedSections.has('tips') ? (
              <ChevronUp size={20} color="#60a5fa" />
            ) : (
              <ChevronDown size={20} color="#60a5fa" />
            )}
          </View>

          {expandedSections.has('tips') && (
            <View style={styles.tipsContent}>
              <View style={styles.tipCard}>
                <View style={styles.tipHeader}>
                  <Target size={16} color="#60a5fa" />
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

              <View style={styles.tipCard}>
                <View style={styles.tipHeader}>
                  <TrendingUp size={16} color="#4ade80" />
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

              <View style={styles.tipCard}>
                <View style={styles.tipHeader}>
                  <Heart size={16} color="#f472b6" />
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
        </LinearGradient>
      </TouchableOpacity>

      {/* Note or Temporary Suggestion */}
      {(blessedDay.note || blessedDay.temporary_suggestion) && (
        <LinearGradient
          colors={['rgba(251, 146, 60, 0.15)', 'rgba(249, 115, 22, 0.1)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.card, { borderColor: '#fb923c' }]}
        >
          <View style={styles.cardHeader}>
            <Info size={20} color="#fb923c" />
            <Text style={[styles.cardTitle, { color: '#fb923c' }]}>
              {language === 'en' ? 'Important Note' : 'Note Importante'}
            </Text>
          </View>
          <Text style={styles.noteInfoText}>
            {(blessedDay.note || blessedDay.temporary_suggestion)?.[language as 'en' | 'fr']}
          </Text>
        </LinearGradient>
      )}

      {/* Bottom Spacing */}
      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1e',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#d1d5db',
    textAlign: 'center',
    paddingHorizontal: 16,
    lineHeight: 20,
  },
  mainDayCard: {
    borderRadius: 20,
    borderWidth: 2,
    marginBottom: 20,
    padding: 32,
    alignItems: 'center',
  },
  mainDayContent: {
    alignItems: 'center',
  },
  dayEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  dayName: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  daySubtext: {
    fontSize: 14,
    color: '#d1d5db',
    textAlign: 'center',
    marginBottom: 12,
  },
  dayNumberBadge: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  dayNumberText: {
    fontSize: 12,
    color: '#FFF',
    fontWeight: '600',
  },
  card: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    marginBottom: 20,
  },
  specialCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#9ca3af',
    marginBottom: 16,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  dayPill: {
    width: (width - 72) / 7,
    aspectRatio: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayPillEmoji: {
    fontSize: 16,
    marginBottom: 2,
  },
  dayPillText: {
    fontSize: 10,
    color: '#9ca3af',
    fontWeight: '600',
  },
  dayPillTextActive: {
    color: '#0f0f1e',
    fontWeight: 'bold',
  },
  activitiesList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  activityIconContainer: {
    marginTop: 2,
  },
  activityText: {
    flex: 1,
    fontSize: 15,
    color: '#FFF',
    lineHeight: 22,
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  noteText: {
    flex: 1,
    fontSize: 14,
    color: '#FFF',
    lineHeight: 20,
  },
  prophetContent: {
    alignItems: 'center',
    gap: 8,
  },
  prophetArabic: {
    fontSize: 28,
    color: '#FFF',
    fontWeight: '600',
  },
  prophetName: {
    fontSize: 16,
    color: '#d1d5db',
  },
  collapsibleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tipsContent: {
    marginTop: 16,
    gap: 12,
  },
  tipCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
  tipText: {
    fontSize: 14,
    color: '#d1d5db',
    lineHeight: 20,
  },
  noteInfoText: {
    fontSize: 14,
    color: '#FFF',
    lineHeight: 22,
  },
  bottomSpacer: {
    height: 20,
  },
});
