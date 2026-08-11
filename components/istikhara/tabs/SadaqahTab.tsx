import { getZodiacSadaqah, type ZodiacSadaqahListItem } from '../../../data/zodiacSadaqahData';
import * as Haptics from 'expo-haptics';
import * as Linking from 'expo-linking';
import {
  ChevronDown,
  ChevronUp,
  Clock,
  Coins,
  ExternalLink,
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

  // DOB (birthdate) calculations use zodiac-based sadaqah guidance instead of
  // the name-based buruj sadaqah data. Name-based results are unaffected.
  const dobEntry = data.calculationMethod === 'birthdate'
    ? getZodiacSadaqah(data.birthProfile?.sunSign?.burjEn)
    : null;

  // Helper to get text in current language (ar/fr supported, falls back to en)
  const getText = (text: { en: string; fr: string; ar?: string }) => {
    if (language === 'ar' && text.ar) return text.ar;
    if (language === 'fr' && text.fr) return text.fr;
    return text.en;
  };

  // Helper to get array in current language
  const getArray = (arr: { en: string[]; fr: string[]; ar?: string[] }) => {
    if (language === 'ar' && arr.ar) return arr.ar;
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

  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['monthly', 'general', 'specific']));

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

  const renderZodiacItem = (item: ZodiacSadaqahListItem, idx: number) => (
    <View style={styles.subsection} key={idx}>
      <Text style={[styles.contentText, styles.zodiacItemTitle]}>
        {idx + 1}. {getText(item.title)}
      </Text>
      <Text style={styles.contentText}>{getText(item.lead)}</Text>
      {item.bullets && getArray(item.bullets).length > 0 && (
        <View style={styles.listContainer}>
          {getArray(item.bullets).map((bullet, bulletIdx) => (
            <View key={bulletIdx} style={styles.listItem}>
              <View style={[styles.listBullet, { backgroundColor: accentColor }]} />
              <Text style={styles.listText}>{bullet}</Text>
            </View>
          ))}
        </View>
      )}
      {item.after && <Text style={styles.contentText}>{getText(item.after)}</Text>}
    </View>
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

      {dobEntry ? (
        <>
          {/* Sign Header */}
          <PatternCard style={[styles.card, cardSurface]}>
            <View style={styles.cardHeader}>
              <Sparkles size={20} color={accentColor} />
              <Text style={styles.cardTitle}>
                {dobEntry.transliteration} — {language === 'ar' ? dobEntry.signArabic : language === 'fr' ? dobEntry.signFr : dobEntry.signEn} ({dobEntry.signArabic})
              </Text>
            </View>
            {dobEntry.rulingPlanet && (
              <View style={[styles.infoBox, { backgroundColor: withAlpha(accentColor, 0.08), borderColor: withAlpha(accentColor, 0.14), borderWidth: 1 }]}>
                <Info size={16} color={accentColor} />
                <Text style={styles.infoText}>
                  {(language === 'ar' ? 'الكوكب الحاكم: ' : language === 'fr' ? 'Planète régente : ' : 'Ruling Planet: ') + getText(dobEntry.rulingPlanet)}
                </Text>
              </View>
            )}
            {dobEntry.intro && (
              <Text style={[styles.contentText, { marginTop: Spacing.sm }]}>{getText(dobEntry.intro)}</Text>
            )}
          </PatternCard>

          {/* General Forms of Sadaqah (only present for some signs) */}
          {dobEntry.generalForms && dobEntry.generalForms.length > 0 && (
            <TouchableOpacity activeOpacity={0.9} onPress={() => toggleSection('general')}>
              <PatternCard style={[styles.card, raisedSurface]}>
                <View style={styles.collapsibleHeader}>
                  <View style={styles.cardHeader}>
                    <Gift size={20} color={accentColor} />
                    <Text style={styles.cardTitle}>
                      {language === 'ar' ? 'أشكال الصدقة العامة' : language === 'fr' ? 'Formes Générales de Sadaqah' : 'General Forms of Sadaqah'}
                    </Text>
                  </View>
                  {expandedSections.has('general') ? (
                    <ChevronUp size={20} color={accentColor} />
                  ) : (
                    <ChevronDown size={20} color={accentColor} />
                  )}
                </View>
                {expandedSections.has('general') && (
                  <View style={styles.sectionContent}>
                    {dobEntry.generalForms.map((item, idx) => renderZodiacItem(item, idx))}
                  </View>
                )}
              </PatternCard>
            </TouchableOpacity>
          )}

          {/* Specific Sadaqah for this sign */}
          <TouchableOpacity activeOpacity={0.9} onPress={() => toggleSection('specific')}>
            <PatternCard style={[styles.card, cardSurface, { borderLeftWidth: Borders.accent, borderLeftColor: accentColor }]}>
              <View style={styles.collapsibleHeader}>
                <View style={styles.cardHeader}>
                  <Heart size={20} color={accentColor} />
                  <Text style={styles.cardTitle}>
                    {language === 'ar'
                      ? `الصدقة الخاصة بـ ${dobEntry.signArabic}`
                      : language === 'fr'
                        ? `Sadaqah Spécifique pour ${dobEntry.signFr}`
                        : `Specific Sadaqah for ${dobEntry.signEn}`}
                  </Text>
                </View>
                {expandedSections.has('specific') ? (
                  <ChevronUp size={20} color={accentColor} />
                ) : (
                  <ChevronDown size={20} color={accentColor} />
                )}
              </View>
              {expandedSections.has('specific') && (
                <View style={styles.sectionContent}>
                  {dobEntry.specific.map((item, idx) => renderZodiacItem(item, idx))}
                </View>
              )}
            </PatternCard>
          </TouchableOpacity>

          {/* Timing, Secret Sadaqah & Summary */}
          {(dobEntry.timing || dobEntry.secret || (dobEntry.summary && dobEntry.summary.en.length > 0) || dobEntry.closingNote) && (
            <TouchableOpacity activeOpacity={0.9} onPress={() => toggleSection('guidance')}>
              <PatternCard style={[styles.card, raisedSurface]}>
                <View style={styles.collapsibleHeader}>
                  <View style={styles.cardHeader}>
                    <Clock size={20} color={accentColor} />
                    <Text style={styles.cardTitle}>
                      {language === 'ar' ? 'التوقيت والإرشادات' : language === 'fr' ? 'Timing et Conseils' : 'Timing & Guidance'}
                    </Text>
                  </View>
                  {expandedSections.has('guidance') ? (
                    <ChevronUp size={20} color={accentColor} />
                  ) : (
                    <ChevronDown size={20} color={accentColor} />
                  )}
                </View>

                {expandedSections.has('guidance') && (
                  <View style={styles.sectionContent}>
                    {dobEntry.timing && (
                      <View style={styles.subsection}>
                        <View style={styles.subsectionHeader}>
                          <Clock size={16} color={accentColor} />
                          <Text style={styles.subsectionTitle}>{getText(dobEntry.timing.title)}</Text>
                        </View>
                        <View style={styles.listContainer}>
                          {getArray(dobEntry.timing.lines).map((line, i) => (
                            <View key={i} style={styles.listItem}>
                              <View style={[styles.listBullet, { backgroundColor: accentColor }]} />
                              <Text style={styles.listText}>{line}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}

                    {dobEntry.secret && (
                      <View style={[styles.highlightBox, { backgroundColor: withAlpha(accentColor, 0.10), borderColor: withAlpha(accentColor, 0.18), borderWidth: 1 }]}>
                        <View style={styles.subsectionHeader}>
                          <Sparkles size={16} color={accentColor} />
                          <Text style={styles.subsectionTitle}>{getText(dobEntry.secret.title)}</Text>
                        </View>
                        {dobEntry.secret.intro && (
                          <Text style={styles.contentText}>{getText(dobEntry.secret.intro)}</Text>
                        )}
                        {dobEntry.secret.bullets && getArray(dobEntry.secret.bullets).length > 0 && (
                          <View style={styles.listContainer}>
                            {getArray(dobEntry.secret.bullets).map((b, i) => (
                              <View key={i} style={styles.listItem}>
                                <View style={[styles.listBullet, { backgroundColor: accentColor }]} />
                                <Text style={styles.listText}>{b}</Text>
                              </View>
                            ))}
                          </View>
                        )}
                        {dobEntry.secret.note && (
                          <Text style={styles.contentText}>{getText(dobEntry.secret.note)}</Text>
                        )}
                      </View>
                    )}

                    {dobEntry.summary && getArray(dobEntry.summary).length > 0 && (
                      <View style={styles.subsection}>
                        <View style={styles.subsectionHeader}>
                          <TrendingUp size={16} color={accentColor} />
                          <Text style={styles.subsectionTitle}>
                            {language === 'ar' ? 'الملخص' : language === 'fr' ? 'Résumé' : 'Summary'}
                          </Text>
                        </View>
                        <View style={styles.listContainer}>
                          {getArray(dobEntry.summary).map((s, i) => (
                            <View key={i} style={styles.listItem}>
                              <View style={[styles.listBullet, { backgroundColor: accentColor }]} />
                              <Text style={styles.listText}>{s}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}

                    {dobEntry.closingNote && (
                      <View style={[styles.infoBox, { backgroundColor: withAlpha(accentColor, 0.08), borderColor: withAlpha(accentColor, 0.14), borderWidth: 1 }]}>
                        <Info size={16} color={accentColor} />
                        <Text style={styles.infoText}>{getText(dobEntry.closingNote)}</Text>
                      </View>
                    )}
                  </View>
                )}
              </PatternCard>
            </TouchableOpacity>
          )}

          {/* Attribution footer */}
          <View style={styles.attributionFooter}>
            <Text style={styles.attributionText}>
              {(language === 'ar' ? 'بإذن من: ' : language === 'fr' ? 'Autorisé par : ' : 'Authorized by: ') + dobEntry.authorizedBy}
            </Text>
            {dobEntry.videoUrl && (
              <TouchableOpacity
                onPress={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  Linking.openURL(dobEntry.videoUrl!);
                }}
                style={styles.attributionLink}
              >
                <ExternalLink size={14} color={accentColor} />
                <Text style={[styles.attributionLinkText, { color: accentColor }]}>
                  {language === 'ar' ? 'شاهد باللغة الولوفية' : language === 'fr' ? 'Regarder en Wolof' : 'Watch in Wolof language'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </>
      ) : (
        <>
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
        </>
      )}
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
  zodiacItemTitle: {
    fontWeight: Typography.weightBold,
    color: DarkTheme.textPrimary,
  },
  attributionFooter: {
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
  },
  attributionText: {
    fontSize: Typography.caption,
    color: DarkTheme.textTertiary,
    fontStyle: 'italic',
  },
  attributionLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  attributionLinkText: {
    fontSize: Typography.caption,
    fontWeight: Typography.weightSemibold,
  },
});
