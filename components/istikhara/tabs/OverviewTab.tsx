import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Defs, Path, Pattern, Rect } from 'react-native-svg';
import { PremiumSection } from '../../../components/subscription/PremiumSection';
import { Spacing } from '../../../constants/DarkTheme';
import { ElementColors } from '../../../constants/IstikharaColors';
import { getElementBackgroundColors, getZodiacSign } from '../../../constants/zodiacData';
import { useLanguage } from '../../../contexts/LanguageContext';
import { IstikharaData } from '../../../types/istikhara';
import { IstikharaSummaryCard } from '../IstikharaSummaryCard';

interface OverviewTabProps {
  data: IstikharaData;
  elementColor: string;
}

// Helper function to get French element names
function getElementNameFr(element: string): string {
  const elementMap: Record<string, string> = {
    fire: 'Feu',
    earth: 'Terre',
    air: 'Air',
    water: 'Eau',
  };
  return elementMap[element.toLowerCase()] || element;
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

function PatternCard({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: any;
}) {
  return (
    <View style={[styles.patternCard, style]}>
      <View pointerEvents="none" style={styles.patternLayer}>
        <IslamicPatternOverlay />
      </View>
      {children}
    </View>
  );
}

export default function OverviewTab({ data, elementColor }: OverviewTabProps) {
  const { t, language } = useLanguage();
  const { burujProfile, personTotal, motherTotal, combinedTotal, repetitionCount, burujRemainder } = data;
  const zodiacSign = getZodiacSign(burujRemainder);
  const elementColors = getElementBackgroundColors(burujProfile.element);
  const elementKey = burujProfile.element.toLowerCase() as "fire" | "earth" | "air" | "water";
  const accentColor = elementColor || ElementColors[elementKey]?.primarySolid || '#93c5fd';
  const [showDetails, setShowDetails] = React.useState(false);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Summary Card at Top */}
      <IstikharaSummaryCard result={data} language={language} accentColor={accentColor} />
      
      <View style={styles.content}>
        {/* Core Spiritual Pattern - Matches Overview Style */}
        <PatternCard style={[styles.coreInsightCard, {
          backgroundColor: `${accentColor}15`,
          borderColor: `${accentColor}33`,
          shadowColor: accentColor,
        }]}>
          <View style={styles.coreInsightHeader}>
            <View style={[styles.coreInsightIconContainer, {
              backgroundColor: `${accentColor}26`,
              borderColor: `${accentColor}4D`,
            }]}>
              <Text style={styles.coreInsightIcon}>{zodiacSign?.symbol.split(' ')[0] || '♈️'}</Text>
            </View>
            <View style={styles.coreInsightTitleContainer}>
              <Text style={[styles.coreInsightLabel, { color: accentColor }]}>
                {t('istikhara.overview.spiritualPattern').toUpperCase()}
              </Text>
              <Text style={styles.coreInsightValue}>{zodiacSign?.nameEn || 'Unknown'} · {language === 'fr' ? getElementNameFr(burujProfile.element) : burujProfile.element.charAt(0).toUpperCase() + burujProfile.element.slice(1)}</Text>
            </View>
          </View>
          
          <Text style={styles.coreInsightDescription}>
            {language === 'fr' ? zodiacSign?.spiritualQualityFr : zodiacSign?.spiritualQuality || 'N/A'}
          </Text>
        </PatternCard>

        {/* Core Spiritual Attributes - 3 Compact Cards */}
        <View style={styles.supportingSignsSection}>
          <Text style={styles.supportingSignsTitle}>Core Spiritual Attributes</Text>
          
          <View style={styles.supportingSignsGrid}>
            {/* Element */}
            <PatternCard style={[styles.signCard, {
              backgroundColor: `${accentColor}33`,
              borderColor: `${accentColor}33`,
              shadowColor: accentColor,
            }]}>
              <Text style={styles.signIcon}>{burujProfile.element_emoji}</Text>
              <Text style={[styles.signLabel, { color: accentColor }]}>{t('istikhara.overview.element').toUpperCase()}</Text>
              <Text style={styles.signValue}>
                {language === 'fr' ? getElementNameFr(burujProfile.element) : burujProfile.element.charAt(0).toUpperCase() + burujProfile.element.slice(1)}
              </Text>
            </PatternCard>

            {/* Ruler */}
            <PatternCard style={[styles.signCard, {
              backgroundColor: `${accentColor}33`,
              borderColor: `${accentColor}33`,
              shadowColor: accentColor,
            }]}>
              <Text style={styles.signIcon}>⭐</Text>
              <Text style={[styles.signLabel, { color: accentColor }]}>{t('istikhara.overview.ruler').toUpperCase()}</Text>
              <Text style={styles.signValue}>
                {language === 'fr' ? zodiacSign?.planetaryRuler.fr : zodiacSign?.planetaryRuler.en || 'N/A'}
              </Text>
            </PatternCard>

            {/* Quality */}
            <PatternCard style={[styles.signCard, {
              backgroundColor: `${accentColor}33`,
              borderColor: `${accentColor}33`,
              shadowColor: accentColor,
            }]}>
              <Text style={styles.signIcon}>🌙</Text>
              <Text style={[styles.signLabel, { color: accentColor }]}>{t('istikhara.overview.quality').toUpperCase()}</Text>
              <Text style={styles.signValue}>{language === 'fr' ? zodiacSign?.modalityFr : zodiacSign?.modality || 'N/A'}</Text>
            </PatternCard>
          </View>
        </View>

        {/* Key Insights - Professional Card Style */}
        <View style={styles.keyInsightsSection}>
          <Text style={styles.keyInsightsTitle}>Key Insights</Text>
          
          <PatternCard style={[styles.insightCard, {
            backgroundColor: `${accentColor}33`,
            borderColor: `${accentColor}33`,
            shadowColor: accentColor,
          }]}>
            <View style={[styles.insightIcon, {
              backgroundColor: `${accentColor}26`,
            }]}>
              <Text style={styles.insightIconText}>📿</Text>
            </View>
            <View style={styles.insightContent}>
              <Text style={[styles.insightLabel, { color: accentColor }]}>Practice Focus</Text>
              <Text style={styles.insightText}>
                Recite Divine Names {repetitionCount} times for spiritual alignment
              </Text>
            </View>
          </PatternCard>
          
          <PatternCard style={[styles.insightCard, {
            backgroundColor: `${accentColor}33`,
            borderColor: `${accentColor}33`,
            shadowColor: accentColor,
          }]}>
            <View style={[styles.insightIcon, {
              backgroundColor: `${accentColor}26`,
            }]}>
              <Text style={styles.insightIconText}>{burujProfile.element_emoji}</Text>
            </View>
            <View style={styles.insightContent}>
              <Text style={[styles.insightLabel, { color: accentColor }]}>Elemental Advice</Text>
              <Text style={styles.insightText}>
                Embrace {language === 'fr' ? getElementNameFr(burujProfile.element).toLowerCase() : burujProfile.element.toLowerCase()} qualities through mindful presence
              </Text>
            </View>
          </PatternCard>
          
          <PatternCard style={[styles.insightCard, {
            backgroundColor: `${accentColor}33`,
            borderColor: `${accentColor}33`,
            shadowColor: accentColor,
          }]}>
            <View style={[styles.insightIcon, {
              backgroundColor: `${accentColor}26`,
            }]}>
              <Text style={styles.insightIconText}>🧭</Text>
            </View>
            <View style={styles.insightContent}>
              <Text style={[styles.insightLabel, { color: accentColor }]}>Path Guidance</Text>
              <Text style={styles.insightText}>
                Contemplate {zodiacSign?.nameEn} wisdom in moments of decision
              </Text>
            </View>
          </PatternCard>
        </View>

        {/* Collapsible Spiritual Details - Premium */}
        <PremiumSection
          featureId="spiritualGuidance"
          title={t('premiumSections.spiritualDetails.title')}
          description={t('premiumSections.spiritualDetails.description')}
          icon="📊"
        >
          <TouchableOpacity
            style={[styles.detailsToggle, {
              backgroundColor: `${accentColor}26`,
              borderColor: `${accentColor}33`,
            }]}
            onPress={() => setShowDetails(!showDetails)}
            activeOpacity={0.7}
          >
            <View style={styles.detailsToggleHeader}>
              <Text style={styles.detailsToggleIcon}>📊</Text>
              <Text style={styles.detailsToggleText}>
                {showDetails ? t('istikhara.overview.hideDetails') : t('istikhara.overview.showDetails')}
              </Text>
            </View>
            <Text style={[styles.detailsToggleChevron, { color: accentColor }]}>{showDetails ? '▼' : '▶'}</Text>
          </TouchableOpacity>

        {showDetails && (
          <PatternCard style={[styles.detailsSection, {
            backgroundColor: `${accentColor}33`,
            borderColor: `${accentColor}33`,
          }]}>
            {/* Spiritual Practice */}
            <Text style={[styles.detailSectionTitle, { color: accentColor }]}> 
              {language === 'en' ? 'SPIRITUAL PRACTICE' : 'PRATIQUE SPIRITUELLE'}
            </Text>
            
            {/* Divine Names */}
            {burujProfile.spiritual_practice?.divine_names && 'arabic' in burujProfile.spiritual_practice.divine_names && (
              <View style={styles.practiceCard}>
                <View style={styles.practiceHeader}>
                  <Text style={styles.practiceIcon}>✨</Text>
                  <Text style={[styles.practiceTitle, { color: accentColor }]}>
                    {language === 'en' ? 'Divine Names' : 'Noms Divins'}
                  </Text>
                </View>
                <Text style={styles.practiceArabic}>{burujProfile.spiritual_practice.divine_names.arabic}</Text>
                <Text style={[styles.practiceTransliteration, { color: accentColor }]}>{burujProfile.spiritual_practice.divine_names.transliteration}</Text>
                <Text style={styles.practiceTranslation}>
                  {burujProfile.spiritual_practice.divine_names.translation[language as 'en' | 'fr']}
                </Text>
                <View style={[styles.practiceCount, { backgroundColor: `${accentColor}1A` }]}> 
                  <Text style={styles.practiceCountLabel}>{language === 'en' ? 'Recite' : 'Réciter'}</Text>
                  <Text style={[styles.practiceCountValue, { color: accentColor }]}>{repetitionCount}×</Text>
                </View>
              </View>
            )}

            <View style={[styles.detailDivider, { backgroundColor: `${accentColor}26` }]} />

            {/* Practice Night */}
            {burujProfile.spiritual_practice?.practice_night && (
              <View style={styles.practiceCard}>
                <View style={styles.practiceHeader}>
                  <Text style={styles.practiceIcon}>🌙</Text>
                  <Text style={[styles.practiceTitle, { color: accentColor }]}>
                    {language === 'en' ? 'Practice Night' : 'Nuit de Pratique'}
                  </Text>
                </View>
                <Text style={styles.practiceValue}>
                  {burujProfile.spiritual_practice.practice_night.primary[language as 'en' | 'fr']}
                </Text>
                {burujProfile.spiritual_practice.practice_night.note && (
                  <Text style={styles.practiceNote}>
                    {burujProfile.spiritual_practice.practice_night.note[language as 'en' | 'fr']}
                  </Text>
                )}
              </View>
            )}

            <View style={[styles.detailDivider, { backgroundColor: `${accentColor}26` }]} />

            {/* Spiritual Guardians */}
            <Text style={[styles.detailSectionTitle, { color: accentColor }]}>
              {language === 'en' ? 'SPIRITUAL GUARDIANS' : 'GARDIENS SPIRITUELS'}
            </Text>
            
            <View style={styles.guardiansGrid}>
              {/* Angel */}
              {burujProfile.spiritual_practice?.angel && (
                <PatternCard style={[styles.guardianCard, { borderColor: `${accentColor}26` }]}>
                  <Text style={styles.guardianIcon}>👼</Text>
                  <Text style={[styles.guardianLabel, { color: accentColor }]}>{language === 'en' ? 'Angel' : 'Ange'}</Text>
                  <Text style={styles.guardianArabic}>{burujProfile.spiritual_practice.angel.arabic}</Text>
                  <Text style={[styles.guardianName, { color: accentColor }]}>{burujProfile.spiritual_practice.angel.transliteration}</Text>
                </PatternCard>
              )}

              {/* Jinn */}
              {burujProfile.spiritual_practice?.jinn && (
                <PatternCard style={[styles.guardianCard, { borderColor: `${accentColor}26` }]}>
                  <Text style={styles.guardianIcon}>🔮</Text>
                  <Text style={[styles.guardianLabel, { color: accentColor }]}>{language === 'en' ? 'Jinn King' : 'Roi Jinn'}</Text>
                  <Text style={styles.guardianArabic}>{burujProfile.spiritual_practice.jinn.arabic}</Text>
                  <Text style={[styles.guardianName, { color: accentColor }]}>{burujProfile.spiritual_practice.jinn.transliteration}</Text>
                </PatternCard>
              )}
            </View>

            <View style={[styles.detailDivider, { backgroundColor: `${accentColor}26` }]} />

            {/* Quranic Verse */}
            {burujProfile.spiritual_practice?.quranic_verse && (
              <View style={styles.practiceCard}>
                <View style={styles.practiceHeader}>
                  <Text style={styles.practiceIcon}>📖</Text>
                  <Text style={[styles.practiceTitle, { color: accentColor }]}>
                    {language === 'en' ? 'Quranic Connection' : 'Connexion Coranique'}
                  </Text>
                </View>
                <Text style={[styles.verseReference, { color: accentColor }]}>{burujProfile.spiritual_practice.quranic_verse.reference}</Text>
                <Text style={styles.practiceArabic}>{burujProfile.spiritual_practice.quranic_verse.arabic}</Text>
                <Text style={[styles.practiceTransliteration, { color: accentColor }]}>{burujProfile.spiritual_practice.quranic_verse.transliteration}</Text>
                <Text style={styles.practiceTranslation}>
                  {burujProfile.spiritual_practice.quranic_verse.translation[language as 'en' | 'fr']}
                </Text>
              </View>
            )}
          </PatternCard>
        )}
        </PremiumSection>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1020',
  },
  content: {
    padding: Spacing.lg,
  },
  patternCard: {
    position: 'relative',
    overflow: 'hidden',
  },
  patternLayer: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.55,
  },
  // Core Insight Card - Matches Blue Overview
  coreInsightCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  coreInsightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  coreInsightIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
    borderWidth: 2,
  },
  coreInsightIcon: {
    fontSize: 28,
  },
  coreInsightTitleContainer: {
    flex: 1,
  },
  coreInsightLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 4,
  },
  coreInsightValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  coreInsightDescription: {
    fontSize: 15,
    color: '#cbd5e1',
    lineHeight: 22,
  },
  // Supporting Signs Section - Matches Your Numbers Cards
  supportingSignsSection: {
    marginBottom: Spacing.lg,
  },
  supportingSignsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#94a3b8',
    marginBottom: Spacing.lg,
  },
  supportingSignsGrid: {
    flexDirection: 'row',
    gap: Spacing.cardMargin,
  },
  signCard: {
    flex: 1,
    borderRadius: 12,
    padding: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  signIcon: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  signLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  signValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  // Key Insights Section - Professional Cards
  keyInsightsSection: {
    marginBottom: Spacing.lg,
  },
  keyInsightsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#94a3b8',
    marginBottom: Spacing.lg,
  },
  insightCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  insightIconText: {
    fontSize: 20,
  },
  insightContent: {
    flex: 1,
  },
  insightLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  insightText: {
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 20,
  },
  // Collapsible Details Toggle
  detailsToggle: {
    borderRadius: 12,
    padding: Spacing.lg,
    marginBottom: Spacing.cardMargin,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
  },
  detailsToggleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsToggleIcon: {
    fontSize: 20,
    marginRight: Spacing.sm,
  },
  detailsToggleText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#cbd5e1',
  },
  detailsToggleChevron: {
    fontSize: 14,
  },
  // Details Section (Collapsible)
  detailsSection: {
    borderRadius: 16,
    borderWidth: 1,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
  },
  detailSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: Spacing.lg,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.cardMargin,
  },
  detailRowLabel: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
  },
  detailRowValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  detailDivider: {
    height: 1,
    marginVertical: Spacing.lg,
  },
  colorsList: {
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  colorDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  colorDetailCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: Spacing.md,
    borderWidth: 2,
  },
  colorDetailText: {
    fontSize: 14,
    color: '#cbd5e1',
    fontFamily: 'monospace',
  },
  detailNote: {
    fontSize: 13,
    color: '#64748b',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  // Spiritual Practice Styles
  practiceCard: {
    marginBottom: Spacing.md,
  },
  practiceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  practiceIcon: {
    fontSize: 20,
    marginRight: Spacing.sm,
  },
  practiceTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  practiceArabic: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '600',
    marginBottom: Spacing.sm,
    textAlign: 'right',
    lineHeight: 36,
  },
  practiceTransliteration: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.78)',
    marginBottom: Spacing.sm,
    fontStyle: 'italic',
  },
  practiceTranslation: {
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  practiceCount: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    padding: Spacing.md,
    marginTop: Spacing.sm,
  },
  practiceCountLabel: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '600',
  },
  practiceCountValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  practiceValue: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  practiceNote: {
    fontSize: 13,
    color: '#94a3b8',
    lineHeight: 18,
  },
  verseReference: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  guardiansGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  guardianCard: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: 12,
    padding: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    overflow: 'hidden',
  },
  guardianIcon: {
    fontSize: 28,
    marginBottom: Spacing.sm,
  },
  guardianLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
  },
  guardianArabic: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 4,
  },
  guardianName: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.78)',
    textAlign: 'center',
  },
});
