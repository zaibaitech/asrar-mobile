import * as Haptics from 'expo-haptics';
import {
  ChevronDown,
  ChevronUp,
  Clock,
  Coins,
  Gift,
  Heart,
  Info,
  Lightbulb,
  Sparkles,
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

interface SadaqahTabProps {
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

export default function SadaqahTab({ data, elementColor }: SadaqahTabProps) {
  const { language } = useLanguage();
  const profile = data.burujProfile;
  const elementKey = profile.element.toLowerCase() as "fire" | "earth" | "air" | "water";
  const colors = getElementColors(elementKey);
  const accentColor = elementColor || colors.accent;
  const sadaqah = profile.sadaqah;

  // Helper to get text in current language from BilingualText (only en/fr supported)
  const getText = (text: { en: string; fr: string }) => {
    if (language === 'fr' && text.fr) return text.fr;
    return text.en;
  };

  // Helper to get array in current language
  const getArray = (arr: { en: string[]; fr: string[] }) => {
    if (language === 'fr' && arr.fr) return arr.fr;
    return arr.en;
  };

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

  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['monthly']));

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

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>
          {language === 'ar' ? 'الصدقة الموصى بها' : language === 'fr' ? 'Sadaqah Recommandé' : 'Recommended Sadaqah'}
        </Text>
        <Text style={styles.subtitle}>
          {language === 'ar' 
            ? 'ممارسات الصدقة الشخصية للبركة والحماية الروحية'
            : language === 'fr'
            ? 'Pratiques de charité personnalisées pour la bénédiction et la protection spirituelle' 
            : 'Personalized charity practices for blessing and spiritual protection'}
        </Text>
      </View>

      {/* Monthly Sadaqah Section */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => toggleSection('monthly')}
      >
        <PatternCard style={[styles.card, raisedSurface]}>
          <View style={styles.collapsibleHeader}>
            <View style={styles.cardHeader}>
              <Coins size={20} color={accentColor} />
              <Text style={styles.cardTitle}>
                {language === 'ar' ? 'الصدقة الشهرية' : language === 'fr' ? 'Sadaqah Mensuel' : 'Monthly Sadaqah'}
              </Text>
            </View>
            {expandedSections.has('monthly') ? (
              <ChevronUp size={20} color={accentColor} />
            ) : (
              <ChevronDown size={20} color={accentColor} />
            )}
          </View>

          {expandedSections.has('monthly') && (
            <View style={styles.sectionContent}>
              {/* Traditional Practice */}
              <View style={styles.subsection}>
                <View style={styles.subsectionHeader}>
                  <Sparkles size={16} color={accentColor} />
                  <Text style={styles.subsectionTitle}>
                    {language === 'ar' ? 'الممارسة التقليدية' : language === 'fr' ? 'Pratique Traditionnelle' : 'Traditional Practice'}
                  </Text>
                </View>
                <Text style={styles.contentText}>
                  {getText(sadaqah.monthly.traditional)}
                </Text>
              </View>

              {/* Frequency */}
              {sadaqah.monthly.frequency && (
                <View style={styles.subsection}>
                  <View style={styles.subsectionHeader}>
                    <Clock size={16} color={accentColor} />
                    <Text style={styles.subsectionTitle}>
                      {language === 'ar' ? 'التكرار' : language === 'fr' ? 'Fréquence' : 'Frequency'}
                    </Text>
                  </View>
                  <Text style={styles.contentText}>
                    {getText(sadaqah.monthly.frequency)}
                  </Text>
                </View>
              )}

              {/* Context */}
              {sadaqah.monthly.context && (
                <View style={[styles.infoBox, { backgroundColor: withAlpha(accentColor, 0.08), borderColor: withAlpha(accentColor, 0.14), borderWidth: 1 }]}>
                  <Info size={16} color={accentColor} />
                  <Text style={styles.infoText}>
                    {getText(sadaqah.monthly.context)}
                  </Text>
                </View>
              )}

              {/* Purpose */}
              {sadaqah.monthly.purpose && (
                <View style={styles.subsection}>
                  <View style={styles.subsectionHeader}>
                    <Heart size={16} color={accentColor} />
                    <Text style={styles.subsectionTitle}>
                      {language === 'ar' ? 'الغرض' : language === 'fr' ? 'Objectif' : 'Purpose'}
                    </Text>
                  </View>
                  <Text style={styles.contentText}>
                    {getText(sadaqah.monthly.purpose)}
                  </Text>
                </View>
              )}

              {/* Avoid Note */}
              {sadaqah.monthly.avoid_note && (
                <View style={[styles.warningBox, { backgroundColor: withAlpha('#FF6B6B', 0.08), borderColor: withAlpha('#FF6B6B', 0.20), borderWidth: 1 }]}>
                  <Info size={16} color="#FF6B6B" />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.warningTitle, { color: '#FF6B6B' }]}>
                      {language === 'ar' ? 'ملاحظة مهمة' : language === 'fr' ? 'Note Importante' : 'Important Note'}
                    </Text>
                    <Text style={styles.warningText}>
                      {getText(sadaqah.monthly.avoid_note)}
                    </Text>
                  </View>
                </View>
              )}

              {/* Modern Alternatives */}
              {sadaqah.monthly.modern_alternatives && getArray(sadaqah.monthly.modern_alternatives).length > 0 && (
                <View style={styles.subsection}>
                  <View style={styles.subsectionHeader}>
                    <Lightbulb size={16} color={accentColor} />
                    <Text style={styles.subsectionTitle}>
                      {language === 'ar' ? 'البدائل الحديثة' : language === 'fr' ? 'Alternatives Modernes' : 'Modern Alternatives'}
                    </Text>
                  </View>
                  <View style={styles.listContainer}>
                    {getArray(sadaqah.monthly.modern_alternatives).map((alternative: string, index: number) => (
                      <View key={index} style={styles.listItem}>
                        <View style={[styles.listBullet, { backgroundColor: accentColor }]} />
                        <Text style={styles.listText}>{alternative}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          )}
        </PatternCard>
      </TouchableOpacity>

      {/* Lifetime Sadaqah Section */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => toggleSection('lifetime')}
      >
        <PatternCard style={[styles.card, cardSurface, { borderLeftWidth: Borders.accent, borderLeftColor: accentColor }]}>
          <View style={styles.collapsibleHeader}>
            <View style={styles.cardHeader}>
              <Gift size={20} color={accentColor} />
              <Text style={styles.cardTitle}>
                {language === 'ar' ? 'صدقة العمر' : language === 'fr' ? 'Sadaqah à Vie' : 'Lifetime Sadaqah'}
              </Text>
            </View>
            {expandedSections.has('lifetime') ? (
              <ChevronUp size={20} color={accentColor} />
            ) : (
              <ChevronDown size={20} color={accentColor} />
            )}
          </View>

          {expandedSections.has('lifetime') && (
            <View style={styles.sectionContent}>
              {/* Traditional Practice */}
              <View style={styles.subsection}>
                <View style={styles.subsectionHeader}>
                  <Sparkles size={16} color={accentColor} />
                  <Text style={styles.subsectionTitle}>
                    {language === 'ar' ? 'الممارسة التقليدية' : language === 'fr' ? 'Pratique Traditionnelle' : 'Traditional Practice'}
                  </Text>
                </View>
                <Text style={styles.contentText}>
                  {getText(sadaqah.lifetime.traditional)}
                </Text>
              </View>

              {/* Components */}
              {sadaqah.lifetime.components && getArray(sadaqah.lifetime.components).length > 0 && (
                <View style={styles.subsection}>
                  <View style={styles.subsectionHeader}>
                    <TrendingUp size={16} color={accentColor} />
                    <Text style={styles.subsectionTitle}>
                      {language === 'ar' ? 'المكونات' : language === 'fr' ? 'Composants' : 'Components'}
                    </Text>
                  </View>
                  <View style={styles.listContainer}>
                    {getArray(sadaqah.lifetime.components).map((component: string, index: number) => (
                      <View key={index} style={styles.listItem}>
                        <View style={[styles.listBullet, { backgroundColor: accentColor }]} />
                        <Text style={styles.listText}>{component}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Best Timing */}
              {sadaqah.lifetime.best_timing && getArray(sadaqah.lifetime.best_timing).length > 0 && (
                <View style={styles.subsection}>
                  <View style={styles.subsectionHeader}>
                    <Clock size={16} color={accentColor} />
                    <Text style={styles.subsectionTitle}>
                      {language === 'ar' ? 'أفضل توقيت' : language === 'fr' ? 'Meilleur Moment' : 'Best Timing'}
                    </Text>
                  </View>
                  <View style={styles.listContainer}>
                    {getArray(sadaqah.lifetime.best_timing).map((timing: string, index: number) => (
                      <View key={index} style={styles.listItem}>
                        <View style={[styles.listBullet, { backgroundColor: accentColor }]} />
                        <Text style={styles.listText}>{timing}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Significance */}
              {sadaqah.lifetime.significance && (
                <View style={[styles.highlightBox, { backgroundColor: withAlpha(accentColor, 0.10), borderColor: withAlpha(accentColor, 0.18), borderWidth: 1 }]}>
                  <View style={styles.subsectionHeader}>
                    <Heart size={16} color={accentColor} />
                    <Text style={styles.subsectionTitle}>
                      {language === 'ar' ? 'الأهمية' : language === 'fr' ? 'Signification' : 'Significance'}
                    </Text>
                  </View>
                  <Text style={styles.contentText}>
                    {getText(sadaqah.lifetime.significance)}
                  </Text>
                </View>
              )}

              {/* Cultural Note */}
              {sadaqah.lifetime.cultural_note && (
                <View style={[styles.infoBox, { backgroundColor: withAlpha(accentColor, 0.08), borderColor: withAlpha(accentColor, 0.14), borderWidth: 1 }]}>
                  <Info size={16} color={accentColor} />
                  <Text style={styles.infoText}>
                    {getText(sadaqah.lifetime.cultural_note)}
                  </Text>
                </View>
              )}

              {/* Technical Note */}
              {sadaqah.lifetime.technical_note && (
                <View style={[styles.infoBox, { backgroundColor: withAlpha(accentColor, 0.08), borderColor: withAlpha(accentColor, 0.14), borderWidth: 1 }]}>
                  <Info size={16} color={accentColor} />
                  <Text style={styles.infoText}>
                    {getText(sadaqah.lifetime.technical_note)}
                  </Text>
                </View>
              )}

              {/* General Note */}
              {sadaqah.lifetime.note && (
                <View style={[styles.infoBox, { backgroundColor: withAlpha(accentColor, 0.08), borderColor: withAlpha(accentColor, 0.14), borderWidth: 1 }]}>
                  <Info size={16} color={accentColor} />
                  <Text style={styles.infoText}>
                    {getText(sadaqah.lifetime.note)}
                  </Text>
                </View>
              )}
            </View>
          )}
        </PatternCard>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DarkTheme.screenBackground,
  },
  scrollContent: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    gap: Spacing.md,
  },
  header: {
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: Typography.h2,
    fontWeight: Typography.weightBold,
    color: DarkTheme.textPrimary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.body,
    color: DarkTheme.textSecondary,
    opacity: 0.7,
  },
  patternCard: {
    borderRadius: Borders.radiusLg,
    padding: Spacing.lg,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: Borders.standard,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  patternLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  card: {
    marginBottom: Spacing.md,
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
    color: DarkTheme.textPrimary,
  },
  collapsibleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionContent: {
    marginTop: Spacing.md,
    gap: Spacing.md,
  },
  subsection: {
    gap: Spacing.sm,
  },
  subsectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  subsectionTitle: {
    fontSize: Typography.caption,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  contentText: {
    fontSize: Typography.body,
    color: DarkTheme.textSecondary,
    lineHeight: Typography.body * Typography.lineHeightNormal,
  },
  listContainer: {
    gap: Spacing.sm,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  listBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
  },
  listText: {
    fontSize: Typography.body,
    color: DarkTheme.textSecondary,
    flex: 1,
    lineHeight: Typography.body * Typography.lineHeightNormal,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: Borders.radiusMd,
  },
  infoText: {
    fontSize: Typography.caption,
    color: DarkTheme.textTertiary,
    flex: 1,
    lineHeight: Typography.caption * Typography.lineHeightNormal,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: Borders.radiusMd,
  },
  warningTitle: {
    fontSize: Typography.caption,
    fontWeight: Typography.weightBold,
    marginBottom: Spacing.xs,
  },
  warningText: {
    fontSize: Typography.caption,
    color: DarkTheme.textTertiary,
    lineHeight: Typography.caption * Typography.lineHeightNormal,
  },
  highlightBox: {
    padding: Spacing.md,
    borderRadius: Borders.radiusMd,
    gap: Spacing.sm,
  },
});
