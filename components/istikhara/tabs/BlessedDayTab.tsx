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
import Svg, { Circle, Defs, Path, Pattern, Rect } from 'react-native-svg';
import { Borders, DarkTheme, Spacing, Typography } from "../../../constants/DarkTheme";
import { getElementColors } from '../../../constants/ElementColors';
import { useLanguage } from "../../../contexts/LanguageContext";
import type { IstikharaData } from "../../../types/istikhara";

const { width } = Dimensions.get('window');

interface BlessedDayTabProps {
  data: IstikharaData;
  elementColor: string;
}

function withAlpha(color: string, alpha01: number): string {
  const alpha = Math.max(0, Math.min(1, alpha01));
  if (typeof color !== 'string' || !color.startsWith('#')) return color;

  const hex = color.slice(1);
  const normalized = hex.length === 3
    ? hex.split('').map(c => c + c).join('')
    : hex.length === 6
      ? hex
      : null;
  if (!normalized) return color;

  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function IslamicPatternOverlay({ opacity = 0.06 }: { opacity?: number }) {
  return (
    <Svg pointerEvents="none" width="100%" height="100%" style={StyleSheet.absoluteFill}>
      <Defs>
        <Pattern id="geom" patternUnits="userSpaceOnUse" width="48" height="48">
          <Path
            d="M24 6 L28 20 L42 24 L28 28 L24 42 L20 28 L6 24 L20 20 Z"
            fill={`rgba(255, 255, 255, ${opacity})`}
          />
          <Circle cx="24" cy="24" r="2.2" fill={`rgba(255, 255, 255, ${opacity + 0.01})`} />
        </Pattern>
      </Defs>
      <Rect x="0" y="0" width="100%" height="100%" fill="url(#geom)" />
    </Svg>
  );
}

function PatternCard({ children, style }: { children: React.ReactNode; style?: any }) {
  return (
    <View style={[styles.patternCard, style]}>
      <View pointerEvents="none" style={styles.patternLayer}>
        <IslamicPatternOverlay />
      </View>
      {children}
    </View>
  );
}

const DAYS_OF_WEEK = [
  { en: 'Sunday', fr: 'Dimanche', ar: 'الأحد', emoji: '☀️' },
  { en: 'Monday', fr: 'Lundi', ar: 'الاثنين', emoji: '🌙' },
  { en: 'Tuesday', fr: 'Mardi', ar: 'الثلاثاء', emoji: '⚔️' },
  { en: 'Wednesday', fr: 'Mercredi', ar: 'الأربعاء', emoji: '📚' },
  { en: 'Thursday', fr: 'Jeudi', ar: 'الخميس', emoji: '⚡' },
  { en: 'Friday', fr: 'Vendredi', ar: 'الجمعة', emoji: '🌟' },
  { en: 'Saturday', fr: 'Samedi', ar: 'السبت', emoji: '🪐' },
];

export default function BlessedDayTab({ data, elementColor }: BlessedDayTabProps) {
  const { language } = useLanguage();
  const profile = data.burujProfile;
  const elementKey = profile.element.toLowerCase() as "fire" | "earth" | "air" | "water";
  const colors = getElementColors(elementKey);
  const accentColor = elementColor || colors.accent;
  const blessedDay = profile.blessed_day;

  const cardSurface = {
    backgroundColor: withAlpha(accentColor, 0.14),
    borderColor: withAlpha(accentColor, 0.20),
    shadowColor: accentColor,
  };
  const raisedSurface = {
    backgroundColor: withAlpha(accentColor, 0.16),
    borderColor: withAlpha(accentColor, 0.22),
    shadowColor: accentColor,
  };

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
          {language === 'ar' ? 'يومك المبارك' : language === 'fr' ? 'Votre Jour Béni' : 'Your Blessed Day'}
        </Text>
        <Text style={styles.subtitle}>
          {language === 'ar' 
            ? 'اليوم الأكثر بركة للقرارات المهمة والممارسات الروحية'
            : language === 'fr'
            ? 'Le jour le plus propice pour les décisions importantes et les pratiques spirituelles' 
            : 'The most auspicious day for important decisions and spiritual practices'}
        </Text>
      </View>

      {/* Main Day Display - Dark Card with Accent Highlights */}
      <PatternCard style={[styles.mainDayCard, raisedSurface]}>
        <View style={[styles.iconCircle, { backgroundColor: withAlpha(accentColor, 0.15), borderColor: withAlpha(accentColor, 0.65) }]}>
          <Text style={styles.dayEmoji}>
            {dayIndex >= 0 ? DAYS_OF_WEEK[dayIndex].emoji : '📅'}
          </Text>
        </View>
        
        <Text style={[styles.dayName, { color: accentColor }]}>
          {blessedDay.day[language as 'en' | 'fr' | 'ar'] || blessedDay.day.en}
        </Text>
        
        <Text style={styles.daySubtext}>
          {language === 'ar' 
            ? 'يوم قوتك في الأسبوع'
            : language === 'fr'
            ? 'Votre Jour de Puissance de la Semaine' 
            : 'Your Power Day of the Week'}
        </Text>
        
        {blessedDay.day_number !== null && (
          <View style={[styles.dayNumberBadge, { backgroundColor: withAlpha(accentColor, 0.12), borderColor: withAlpha(accentColor, 0.55) }]}>
            <Text style={[styles.dayNumberText, { color: accentColor }]}>
              {language === 'ar' ? 'اليوم' : language === 'fr' ? 'Jour' : 'Day'} #{blessedDay.day_number}
            </Text>
          </View>
        )}
      </PatternCard>

      {/* Weekly Overview - Dark Card with Colored Day Icons */}
      <PatternCard style={[styles.card, cardSurface]}>
        <View style={styles.cardHeader}>
          <Sun size={20} color={accentColor} />
          <Text style={styles.cardTitle}>
            {language === 'ar' ? 'نظرة عامة أسبوعية' : language === 'fr' ? 'Aperçu Hebdomadaire' : 'Weekly Overview'}
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
                  { backgroundColor: withAlpha(accentColor, 0.08), borderColor: withAlpha(accentColor, 0.12), borderWidth: 1 },
                  isBlessed && { 
                    backgroundColor: withAlpha(accentColor, 0.16),
                    borderColor: withAlpha(accentColor, 0.55),
                    borderWidth: 2,
                  },
                ]}
              >
                <Text style={styles.dayPillEmoji}>{day.emoji}</Text>
                <Text
                  style={[
                    styles.dayPillText,
                    isBlessed && { color: accentColor, fontWeight: '700' },
                  ]}
                >
                  {day[language as 'en' | 'fr' | 'ar'].substring(0, 3)}
                </Text>
              </View>
            );
          })}
        </View>
      </PatternCard>

      {/* Best Activities Section */}
      {blessedDay.best_for[language as 'en' | 'fr' | 'ar']?.length > 0 && (
        <PatternCard style={[styles.card, cardSurface, { borderLeftWidth: Borders.accent, borderLeftColor: accentColor }]}>
          <View style={styles.cardHeader}>
            <CheckCircle size={20} color={accentColor} />
            <Text style={styles.cardTitle}>
              {language === 'ar' ? 'أفضل الأنشطة' : language === 'fr' ? 'Meilleures Activités' : 'Best Activities'}
            </Text>
          </View>
          <Text style={styles.cardSubtitle}>
            {language === 'ar'
              ? 'الأنشطة الموصى بها ليومك المبارك'
              : language === 'fr'
              ? 'Activités recommandées pour votre jour béni'
              : 'Recommended activities for your blessed day'}
          </Text>
          <View style={styles.activitiesList}>
            {blessedDay.best_for[language as 'en' | 'fr' | 'ar']?.map((activity, index) => (
              <View key={index} style={styles.activityItem}>
                <View style={[styles.activityBullet, { backgroundColor: accentColor }]} />
                <Text style={styles.activityText}>{activity}</Text>
              </View>
            ))}
          </View>
        </PatternCard>
      )}

      {/* Special Notes */}
      {blessedDay.special_notes && blessedDay.special_notes[language as 'en' | 'fr' | 'ar']?.length > 0 && (
        <PatternCard style={[styles.card, cardSurface]}>
          <View style={styles.cardHeader}>
            <Star size={20} color={accentColor} />
            <Text style={styles.cardTitle}>
              {language === 'ar' ? 'الأهمية الروحية' : language === 'fr' ? 'Signification Spirituelle' : 'Spiritual Significance'}
            </Text>
          </View>
          {blessedDay.special_notes[language as 'en' | 'fr' | 'ar']?.map((note, index) => (
            <View key={index} style={styles.noteItem}>
              <Star size={14} color={accentColor} />
              <Text style={styles.noteText}>{note}</Text>
            </View>
          ))}
        </PatternCard>
      )}

      {/* Associated Prophet */}
      {blessedDay.associated_prophet && (
        <PatternCard style={[styles.card, cardSurface]}>
          <View style={styles.cardHeader}>
            <Sparkles size={20} color={accentColor} />
            <Text style={styles.cardTitle}>
              {language === 'ar' ? 'النبي المرتبط' : language === 'fr' ? 'Prophète Associé' : 'Associated Prophet'}
            </Text>
          </View>
          <View style={styles.prophetContent}>
            <Text style={styles.prophetArabic}>{blessedDay.associated_prophet.arabic}</Text>
            <Text style={styles.prophetName}>
              {blessedDay.associated_prophet[language as 'en' | 'fr' | 'ar'] || blessedDay.associated_prophet.en}
            </Text>
          </View>
        </PatternCard>
      )}

      {/* Practical Tips */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => toggleSection('tips')}
      >
        <PatternCard style={[styles.card, cardSurface]}>
          <View style={styles.collapsibleHeader}>
            <View style={styles.cardHeader}>
              <Lightbulb size={20} color={accentColor} />
              <Text style={styles.cardTitle}>
                {language === 'ar' ? 'نصائح عملية' : language === 'fr' ? 'Conseils Pratiques' : 'Practical Tips'}
              </Text>
            </View>
            {expandedSections.has('tips') ? (
              <ChevronUp size={20} color={accentColor} />
            ) : (
              <ChevronDown size={20} color={accentColor} />
            )}
          </View>

          {expandedSections.has('tips') && (
            <View style={styles.tipsContent}>
              <View style={[styles.tipCard, { backgroundColor: withAlpha(accentColor, 0.08), borderColor: withAlpha(accentColor, 0.14), borderWidth: 1 }]}>
                <View style={styles.tipHeader}>
                  <Target size={16} color={accentColor} />
                  <Text style={styles.tipTitle}>
                    {language === 'ar' ? 'نصيحة مهمة' : language === 'fr' ? 'Conseil Pro' : 'Pro Tip'}
                  </Text>
                </View>
                <Text style={styles.tipText}>
                  {language === 'ar'
                    ? `حدد موعد أهم قراراتك وممارساتك الروحية يوم ${blessedDay.day.ar || blessedDay.day.en}. هذا اليوم يحمل طاقة خاصة متوافقة مع طبيعتك العنصرية.`
                    : language === 'fr'
                    ? `Planifiez vos décisions les plus importantes et vos pratiques spirituelles le ${blessedDay.day.fr}. Ce jour porte une énergie spéciale alignée avec votre nature élémentaire.`
                    : `Schedule your most important decisions and spiritual practices on ${blessedDay.day.en}. This day carries special energy aligned with your elemental nature.`}
                </Text>
              </View>

              <View style={[styles.tipCard, { backgroundColor: withAlpha(accentColor, 0.08), borderColor: withAlpha(accentColor, 0.14), borderWidth: 1 }]}>
                <View style={styles.tipHeader}>
                  <TrendingUp size={16} color={accentColor} />
                  <Text style={styles.tipTitle}>
                    {language === 'ar' ? 'التخطيط الأسبوعي' : language === 'fr' ? 'Planification Hebdomadaire' : 'Weekly Planning'}
                  </Text>
                </View>
                <Text style={styles.tipText}>
                  {language === 'ar'
                    ? 'ابدأ تخطيط أسبوعك مع وضع هذا اليوم في الاعتبار. احتفظ به للأنشطة ذات الأولوية العالية وتجنب جدولة المهام الروتينية.'
                    : language === 'fr'
                    ? 'Commencez à planifier votre semaine en gardant ce jour à l\'esprit. Réservez-le pour des activités hautement prioritaires et évitez de planifier des tâches routinières.'
                    : 'Start planning your week with this day in mind. Reserve it for high-priority activities and avoid scheduling routine tasks.'}
                </Text>
              </View>

              <View style={[styles.tipCard, { backgroundColor: withAlpha(accentColor, 0.08), borderColor: withAlpha(accentColor, 0.14), borderWidth: 1 }]}>
                <View style={styles.tipHeader}>
                  <Heart size={16} color={accentColor} />
                  <Text style={styles.tipTitle}>
                    {language === 'ar' ? 'توافق العناصر' : language === 'fr' ? 'Alignement Élémentaire' : 'Element Alignment'}
                  </Text>
                </View>
                <Text style={styles.tipText}>
                  {language === 'ar'
                    ? `باعتبارك شخصًا من عنصر ${profile.element}، هذا اليوم يتردد مع طاقتك الأساسية. استخدمه للتجدد والتوافق مع طبيعتك الحقيقية.`
                    : language === 'fr'
                    ? `En tant que personne de l'élément ${profile.element}, ce jour résonne avec votre énergie centrale. Utilisez-le pour vous ressourcer et vous aligner avec votre vraie nature.`
                    : `As a ${profile.element} element person, this day resonates with your core energy. Use it to recharge and align with your true nature.`}
                </Text>
              </View>
            </View>
          )}
        </PatternCard>
      </TouchableOpacity>

      {/* Note or Temporary Suggestion */}
      {(blessedDay.note || blessedDay.temporary_suggestion) && (
        <PatternCard style={[styles.card, { ...cardSurface, borderLeftWidth: Borders.accent, borderLeftColor: accentColor }]}>
          <View style={styles.cardHeader}>
            <Info size={20} color={accentColor} />
            <Text style={[styles.cardTitle, { color: DarkTheme.textPrimary }]}>
              {language === 'ar' ? 'ملاحظة مهمة' : language === 'fr' ? 'Note Importante' : 'Important Note'}
            </Text>
          </View>
          <Text style={styles.noteInfoText}>
            {(blessedDay.note || blessedDay.temporary_suggestion)?.[language as 'en' | 'fr' | 'ar'] || 
             (blessedDay.note || blessedDay.temporary_suggestion)?.en}
          </Text>
        </PatternCard>
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
  patternCard: {
    position: 'relative',
    overflow: 'hidden',
  },
  patternLayer: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.55,
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
    overflow: 'hidden',
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
    overflow: 'hidden',
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
