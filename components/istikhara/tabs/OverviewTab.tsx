import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Borders, DarkTheme, ElementAccents, Shadows, Spacing, Typography } from '../../../constants/DarkTheme';
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

export default function OverviewTab({ data, elementColor }: OverviewTabProps) {
  const { t, language } = useLanguage();
  const { burujProfile, personTotal, motherTotal, combinedTotal, repetitionCount, burujRemainder } = data;
  const zodiacSign = getZodiacSign(burujRemainder);
  const elementColors = getElementBackgroundColors(burujProfile.element);
  const elementKey = burujProfile.element.toLowerCase() as "fire" | "earth" | "air" | "water";
  const accent = ElementAccents[elementKey];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Summary Card at Top */}
      <IstikharaSummaryCard result={data} language={language} />
      
      <View style={styles.content}>
        {/* Enhanced Buruj Sign Card */}
        <View style={[styles.zodiacCard, { borderColor: accent.primary }]}>
          {/* Header Section */}
          <View style={styles.zodiacHeader}>
            <View style={styles.badgeContainer}>
              <View style={[styles.badge, { backgroundColor: accent.glow, borderColor: accent.primary }]}>
                <Text style={[styles.badgeText, { color: accent.primary }]}>{t('istikhara.overview.intermediate')}</Text>
              </View>
            </View>
            <Text style={styles.zodiacIcon}>{zodiacSign?.symbol.split(' ')[0] || '♈️'}</Text>
            <Text style={styles.zodiacNameEn}>{zodiacSign?.nameEn || 'Unknown'}</Text>
            <Text style={styles.zodiacNameAr}>{zodiacSign?.nameAr || ''}</Text>
            <Text style={styles.zodiacTranslit}>{zodiacSign?.transliteration || ''}</Text>
          </View>

          {/* Calculation Formula */}
          <View style={[styles.calculationBox, { backgroundColor: DarkTheme.cardBackgroundAlt, borderColor: accent.primary }]}>
            <Text style={[styles.calculationText, { color: accent.primary }]}>
              {t('istikhara.overview.calculation')}: {combinedTotal} ÷ 12 = {burujRemainder}
            </Text>
          </View>

          {/* Information Grid */}
          <View style={styles.infoGrid}>
            {/* Element */}
            <View style={[styles.infoCard, { backgroundColor: DarkTheme.cardBackgroundAlt, borderColor: accent.primary }]}>
              <Text style={[styles.infoLabel, { color: accent.primary }]}>{t('istikhara.overview.element')}</Text>
              <Text style={styles.infoValue}>
                {burujProfile.element_emoji} {language === 'fr' ? getElementNameFr(burujProfile.element) : burujProfile.element.charAt(0).toUpperCase() + burujProfile.element.slice(1)}
              </Text>
            </View>

            {/* Modality */}
            <View style={[styles.infoCard, { backgroundColor: DarkTheme.cardBackgroundAlt, borderColor: accent.primary }]}>
              <Text style={[styles.infoLabel, { color: accent.primary }]}>{t('istikhara.overview.modality')}</Text>
              <Text style={styles.infoValue}>{language === 'fr' ? zodiacSign?.modalityFr : zodiacSign?.modality || 'N/A'}</Text>
            </View>

            {/* Planetary Ruler */}
            <View style={[styles.infoCard, styles.infoCardFull, { backgroundColor: DarkTheme.cardBackgroundAlt, borderColor: accent.primary }]}>
              <Text style={[styles.infoLabel, { color: accent.primary }]}>{t('istikhara.overview.planetaryRuler')}</Text>
              <Text style={styles.infoValue}>
                {language === 'fr' ? zodiacSign?.planetaryRuler.fr : zodiacSign?.planetaryRuler.en || 'N/A'}{' '}
                <Text style={styles.arabicSmall}>({zodiacSign?.planetaryRuler.transliteration || ''})</Text>
              </Text>
            </View>

            {/* Temperament */}
            <View style={[styles.infoCard, styles.infoCardFull, { backgroundColor: DarkTheme.cardBackgroundAlt, borderColor: accent.primary }]}>
              <Text style={[styles.infoLabel, { color: accent.primary }]}>{t('istikhara.overview.temperament')}</Text>
              <Text style={styles.infoValue}>{language === 'fr' ? zodiacSign?.temperamentFr : zodiacSign?.temperament || 'N/A'}</Text>
            </View>

            {/* Symbolism */}
            <View style={[styles.infoCard, styles.infoCardFull, { backgroundColor: DarkTheme.cardBackgroundAlt, borderColor: accent.primary }]}>
              <Text style={[styles.infoLabel, { color: accent.primary }]}>{t('istikhara.overview.symbolism')}</Text>
              <Text style={styles.infoValue}>{zodiacSign?.symbol || 'N/A'}</Text>
            </View>

            {/* Spiritual Quality */}
            <View style={[styles.infoCard, styles.infoCardFull, { backgroundColor: DarkTheme.cardBackgroundAlt, borderColor: accent.primary }]}>
              <Text style={[styles.infoLabel, { color: accent.primary }]}>{t('istikhara.overview.spiritualQuality')}</Text>
              <Text style={styles.infoValue}>{language === 'fr' ? zodiacSign?.spiritualQualityFr : zodiacSign?.spiritualQuality || 'N/A'}</Text>
            </View>
          </View>

          {/* Classical Reference */}
          <View style={[styles.referenceCard, { backgroundColor: DarkTheme.cardBackgroundAlt, borderLeftColor: accent.primary, borderLeftWidth: Borders.accent }]}>
            <View style={styles.referenceHeader}>
              <Text style={styles.referenceIcon}>📚</Text>
              <Text style={[styles.referenceTitle, { color: accent.primary }]}>
                {t('istikhara.overview.classicalReference')}
              </Text>
            </View>
            <Text style={styles.referenceText}>
              <Text style={[styles.referenceBold, { color: accent.secondary }]}>{t('istikhara.overview.classicalReferenceSource')}: </Text>
              {(language === 'fr' ? zodiacSign?.classicalReferenceFr : zodiacSign?.classicalReference)?.split(': ')[1] || 'Classical wisdom'}
            </Text>
          </View>
        </View>

        {/* Enhanced Element & Colors Card */}
        <View style={[styles.enhancedCard, { borderColor: accent.primary }]}>
          <View style={styles.enhancedCardHeader}>
            <Text style={styles.enhancedCardIcon}>🌟</Text>
            <Text style={[styles.enhancedCardTitle, { color: accent.primary }]}>
              {t('istikhara.overview.elementColors')}
            </Text>
          </View>
          
          <View style={styles.elementColorGrid}>
            {/* Element Section */}
            <View style={styles.elementSection}>
              <Text style={[styles.sectionLabel, { color: accent.primary }]}>{t('istikhara.overview.yourElement')}</Text>
              <View style={[styles.elementDisplay, { backgroundColor: DarkTheme.cardBackgroundAlt, borderColor: accent.primary }]}>
                <Text style={styles.elementEmoji}>{burujProfile.element_emoji}</Text>
                <View style={styles.elementTextContainer}>
                  <Text style={[styles.elementName, { color: DarkTheme.textPrimary }]}>
                    {language === 'fr' ? getElementNameFr(burujProfile.element) : burujProfile.element.charAt(0).toUpperCase() + burujProfile.element.slice(1)}
                  </Text>
                  <Text style={[styles.elementSubtext, { color: DarkTheme.textSecondary }]}>
                    {t('istikhara.overview.elementOf').replace('{number}', burujProfile.element_number.toString())}
                  </Text>
                </View>
              </View>
            </View>

            {/* Colors Section */}
            <View style={styles.colorsSection}>
              <Text style={[styles.sectionLabel, { color: accent.primary }]}>{t('istikhara.overview.associatedColors')}</Text>
              <View style={styles.colorsDisplay}>
                {burujProfile.colors.map((color, idx) => (
                  <View key={idx} style={[styles.colorItem, { backgroundColor: DarkTheme.cardBackgroundAlt, borderColor: accent.primary }]}>
                    <View style={[styles.colorCircle, { backgroundColor: color, borderColor: accent.primary }]} />
                    <Text style={[styles.colorHex, { color: DarkTheme.textPrimary }]}>{color}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Element Description */}
          <View style={[styles.elementDescriptionCard, { backgroundColor: DarkTheme.cardBackgroundAlt, borderLeftColor: accent.primary, borderLeftWidth: Borders.accent }]}>
            <Text style={[styles.elementDescriptionText, { color: DarkTheme.textSecondary }]}>
              {burujProfile.element === 'fire' && t('istikhara.overview.fireDesc')}
              {burujProfile.element === 'earth' && t('istikhara.overview.earthDesc')}
              {burujProfile.element === 'air' && t('istikhara.overview.airDesc')}
              {burujProfile.element === 'water' && t('istikhara.overview.waterDesc')}
            </Text>
          </View>
        </View>

        {/* Enhanced Abjad Numerology Card */}
        <View style={[styles.enhancedCard, { borderColor: accent.primary }]}>
          <View style={styles.enhancedCardHeader}>
            <Text style={styles.enhancedCardIcon}>🔢</Text>
            <Text style={[styles.enhancedCardTitle, { color: accent.primary }]}>
              {t('istikhara.overview.abjadNumerology')}
            </Text>
          </View>

          <View style={[styles.abjadDescription, { backgroundColor: DarkTheme.cardBackgroundAlt, borderLeftColor: accent.primary, borderLeftWidth: Borders.accent }]}>
            <Text style={[styles.abjadDescriptionText, { color: DarkTheme.textSecondary }]}>
              {t('istikhara.overview.abjadDesc')}
            </Text>
          </View>

          {/* Person's Name */}
          <View style={styles.abjadRow}>
            <View style={styles.abjadLabelContainer}>
              <Text style={styles.abjadIcon}>👤</Text>
              <Text style={[styles.abjadLabel, { color: DarkTheme.textPrimary }]}>{t('istikhara.overview.personNameTotal')}</Text>
            </View>
            <View style={[styles.abjadValueBox, { backgroundColor: DarkTheme.cardBackgroundAlt, borderColor: accent.primary }]}>
              <Text style={[styles.abjadValue, { color: accent.primary }]}>{personTotal}</Text>
            </View>
          </View>

          {/* Mother's Name */}
          <View style={styles.abjadRow}>
            <View style={styles.abjadLabelContainer}>
              <Text style={styles.abjadIcon}>👩</Text>
              <Text style={[styles.abjadLabel, { color: DarkTheme.textPrimary }]}>{t('istikhara.overview.motherNameTotal')}</Text>
            </View>
            <View style={[styles.abjadValueBox, { backgroundColor: DarkTheme.cardBackgroundAlt, borderColor: accent.primary }]}>
              <Text style={[styles.abjadValue, { color: accent.primary }]}>{motherTotal}</Text>
            </View>
          </View>

          {/* Combined Total - Highlighted */}
          <View style={[styles.abjadCombinedCard, { backgroundColor: DarkTheme.cardBackgroundAlt, borderColor: accent.primary }]}>
            <View style={styles.abjadCombinedHeader}>
              <Text style={styles.abjadCombinedIcon}>✨</Text>
              <Text style={[styles.abjadCombinedLabel, { color: accent.primary }]}>
                {t('istikhara.overview.combinedTotal')}
              </Text>
            </View>
            <Text style={[styles.abjadCombinedValue, { color: accent.primary }]}>
              {combinedTotal}
            </Text>
            <Text style={[styles.abjadFormula, { color: DarkTheme.textSecondary }]}>
              {personTotal} + {motherTotal} = {combinedTotal}
            </Text>
          </View>

          {/* Buruj Calculation */}
          <View style={[styles.burujCalculationCard, { backgroundColor: DarkTheme.cardBackgroundAlt, borderLeftColor: accent.primary, borderLeftWidth: Borders.accent }]}>
            <Text style={[styles.burujCalculationLabel, { color: DarkTheme.textPrimary }]}>{t('istikhara.overview.burujCalculation')}:</Text>
            <Text style={[styles.burujCalculationFormula, { color: accent.primary }]}>
              {combinedTotal} mod 12 = {burujRemainder}
            </Text>
          </View>
        </View>

        {/* Enhanced Dhikr Repetitions Card */}
        <View style={[styles.enhancedCard, { borderColor: accent.primary }]}>
          <View style={styles.enhancedCardHeader}>
            <Text style={styles.enhancedCardIcon}>📿</Text>
            <Text style={[styles.enhancedCardTitle, { color: accent.primary }]}>
              {t('istikhara.overview.divineNamesDhikr')}
            </Text>
          </View>

          <View style={[styles.dhikrDescription, { backgroundColor: DarkTheme.cardBackgroundAlt, borderLeftColor: accent.primary, borderLeftWidth: Borders.accent }]}>
            <Text style={[styles.dhikrDescriptionText, { color: DarkTheme.textSecondary }]}>
              {t('istikhara.overview.dhikrDesc')}
            </Text>
          </View>

          {/* Repetition Display */}
          <View style={[styles.dhikrCountCard, { backgroundColor: DarkTheme.cardBackgroundAlt, borderColor: accent.primary }]}>
            <View style={styles.dhikrCountHeader}>
              <Text style={[styles.dhikrCountLabel, { color: DarkTheme.textPrimary }]}>{t('istikhara.overview.recitationCount')}</Text>
              <View style={[styles.dhikrBadge, { backgroundColor: accent.glow, borderColor: accent.primary }]}>
                <Text style={[styles.dhikrBadgeText, { color: accent.primary }]}>{t('istikhara.overview.personalized')}</Text>
              </View>
            </View>
            <View style={styles.dhikrCountDisplay}>
              <Text style={[styles.dhikrCountNumber, { color: accent.primary }]}>
                {repetitionCount}
              </Text>
              <Text style={[styles.dhikrCountUnit, { color: DarkTheme.textSecondary }]}>{t('istikhara.overview.repetitions')}</Text>
            </View>
          </View>

          {/* Practice Tips */}
          <View style={[styles.dhikrTipsCard, { backgroundColor: DarkTheme.cardBackgroundAlt }]}>
            <View style={styles.dhikrTipRow}>
              <Text style={styles.dhikrTipIcon}>🕌</Text>
              <Text style={[styles.dhikrTipText, { color: DarkTheme.textSecondary }]}>{t('istikhara.overview.tip1')}</Text>
            </View>
            <View style={styles.dhikrTipRow}>
              <Text style={styles.dhikrTipIcon}>🧘</Text>
              <Text style={[styles.dhikrTipText, { color: DarkTheme.textSecondary }]}>{t('istikhara.overview.tip2')}</Text>
            </View>
            <View style={styles.dhikrTipRow}>
              <Text style={styles.dhikrTipIcon}>💫</Text>
              <Text style={[styles.dhikrTipText, { color: DarkTheme.textSecondary }]}>{t('istikhara.overview.tip3')}</Text>
            </View>
          </View>

          {/* Spiritual Note */}
          <View style={[styles.spiritualNoteCard, { backgroundColor: DarkTheme.cardBackgroundAlt, borderLeftColor: accent.primary, borderLeftWidth: Borders.accent }]}>
            <Text style={styles.spiritualNoteIcon}>🌙</Text>
            <Text style={[styles.spiritualNoteText, { color: DarkTheme.textSecondary }]}>
              {t('istikhara.overview.spiritualNote')}
            </Text>
          </View>
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
    padding: Spacing.lg,
  },
  // Enhanced Card Base Styles
  enhancedCard: {
    backgroundColor: DarkTheme.cardBackground,
    borderRadius: Borders.radiusLg,
    borderWidth: Borders.width,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    ...Shadows.medium,
  },
  enhancedCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  enhancedCardIcon: {
    fontSize: Typography.iconLg,
    marginRight: Spacing.sm,
  },
  enhancedCardTitle: {
    fontSize: Typography.h2,
    fontWeight: Typography.weightBold,
  },
  // Zodiac Card Styles
  zodiacCard: {
    backgroundColor: DarkTheme.cardBackground,
    borderRadius: Borders.radiusLg,
    borderWidth: Borders.width,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    ...Shadows.medium,
  },
  zodiacHeader: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  badgeContainer: {
    position: 'absolute',
    top: -8,
    right: 0,
  },
  badge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Borders.radiusMd,
    borderWidth: Borders.width,
  },
  badgeText: {
    fontSize: Typography.caption,
    fontWeight: Typography.weightSemibold,
  },
  zodiacIcon: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  zodiacNameEn: {
    fontSize: 36,
    fontWeight: Typography.weightBold,
    color: DarkTheme.textPrimary,
    marginBottom: Spacing.sm,
  },
  zodiacNameAr: {
    fontSize: 28,
    color: DarkTheme.textPrimary,
    marginBottom: Spacing.xs,
  },
  zodiacTranslit: {
    fontSize: 20,
    color: DarkTheme.textSecondary,
    fontStyle: 'italic',
  },
  calculationBox: {
    backgroundColor: DarkTheme.cardBackgroundAlt,
    borderRadius: Borders.radiusMd,
    borderWidth: Borders.width,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    alignItems: 'center',
    ...Shadows.small,
  },
  calculationText: {
    fontSize: Typography.body,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
  },
  infoGrid: {
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  infoCard: {
    backgroundColor: DarkTheme.cardBackgroundAlt,
    borderRadius: Borders.radiusMd,
    borderWidth: Borders.width,
    padding: Spacing.lg,
    ...Shadows.small,
  },
  infoCardFull: {
    width: '100%',
  },
  infoLabel: {
    fontSize: Typography.caption,
    fontWeight: Typography.weightSemibold,
    marginBottom: Spacing.sm,
  },
  infoValue: {
    fontSize: Typography.body,
    color: DarkTheme.textPrimary,
    lineHeight: 24,
  },
  arabicSmall: {
    fontSize: Typography.body,
    color: DarkTheme.textSecondary,
  },
  referenceCard: {
    backgroundColor: DarkTheme.cardBackgroundAlt,
    borderRadius: Borders.radiusMd,
    borderLeftWidth: Borders.accent,
    padding: Spacing.lg,
    ...Shadows.small,
  },
  referenceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  referenceIcon: {
    fontSize: Typography.iconMd,
    marginRight: Spacing.sm,
  },
  referenceTitle: {
    fontSize: Typography.body,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
  },
  referenceText: {
    fontSize: Typography.caption,
    color: DarkTheme.textSecondary,
    lineHeight: 20,
  },
  referenceBold: {
    fontWeight: Typography.weightSemibold,
  },
  // Element & Colors Card Styles
  elementColorGrid: {
    gap: Spacing.lg,
  },
  sectionLabel: {
    fontSize: Typography.caption,
    fontWeight: Typography.weightSemibold,
    marginBottom: Spacing.md,
  },
  elementSection: {
    marginBottom: Spacing.lg,
  },
  elementDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Borders.radiusMd,
    borderWidth: Borders.width,
    padding: Spacing.lg,
    ...Shadows.small,
  },
  elementEmoji: {
    fontSize: 48,
    marginRight: Spacing.lg,
  },
  elementTextContainer: {
    flex: 1,
  },
  elementName: {
    fontSize: Typography.h2,
    fontWeight: Typography.weightBold,
    marginBottom: Spacing.xs,
  },
  elementSubtext: {
    fontSize: Typography.caption,
  },
  colorsSection: {
    marginBottom: Spacing.lg,
  },
  colorsDisplay: {
    gap: Spacing.sm,
  },
  colorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Borders.radiusMd,
    borderWidth: Borders.width,
    padding: Spacing.md,
    ...Shadows.small,
  },
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: Spacing.md,
    borderWidth: Borders.width,
  },
  colorHex: {
    fontSize: Typography.body,
    fontWeight: Typography.weightSemibold,
  },
  elementDescriptionCard: {
    borderRadius: Borders.radiusMd,
    borderLeftWidth: Borders.accent,
    padding: Spacing.lg,
    ...Shadows.small,
  },
  elementDescriptionText: {
    fontSize: Typography.caption,
    lineHeight: 20,
    textAlign: 'center',
  },
  // Abjad Numerology Card Styles
  abjadDescription: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  abjadDescriptionText: {
    fontSize: 13,
    color: '#2C3E50',
    lineHeight: 18,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  abjadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  abjadLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  abjadIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  abjadLabel: {
    fontSize: Typography.body,
    fontWeight: Typography.weightMedium,
  },
  abjadValueBox: {
    borderRadius: Borders.radiusSm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    minWidth: 70,
    alignItems: 'center',
    borderWidth: Borders.width,
    ...Shadows.small,
  },
  abjadValue: {
    fontSize: Typography.h3,
    fontWeight: Typography.weightBold,
  },
  abjadCombinedCard: {
    borderRadius: Borders.radiusMd,
    borderWidth: Borders.width,
    padding: Spacing.lg,
    marginTop: Spacing.lg,
    marginBottom: Spacing.lg,
    alignItems: 'center',
    ...Shadows.medium,
  },
  abjadCombinedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  abjadCombinedIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  abjadCombinedLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  abjadCombinedValue: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  abjadFormula: {
    fontSize: Typography.caption,
  },
  burujCalculationCard: {
    borderRadius: Borders.radiusMd,
    borderLeftWidth: Borders.accent,
    padding: Spacing.md,
    alignItems: 'center',
    ...Shadows.small,
  },
  burujCalculationLabel: {
    fontSize: Typography.caption,
    marginBottom: Spacing.xs,
  },
  burujCalculationFormula: {
    fontSize: 16,
    fontWeight: '600',
  },
  // Dhikr Card Styles
  dhikrDescription: {
    borderRadius: Borders.radiusMd,
    borderLeftWidth: Borders.accent,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.small,
  },
  dhikrDescriptionText: {
    fontSize: Typography.caption,
    lineHeight: 20,
    textAlign: 'center',
  },
  dhikrCountCard: {
    borderRadius: Borders.radiusMd,
    borderWidth: Borders.width,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.medium,
  },
  dhikrCountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dhikrCountLabel: {
    fontSize: Typography.body,
    fontWeight: Typography.weightMedium,
  },
  dhikrBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Borders.radiusMd,
    borderWidth: Borders.width,
  },
  dhikrBadgeText: {
    fontSize: Typography.caption,
    fontWeight: Typography.weightSemibold,
  },
  dhikrCountDisplay: {
    alignItems: 'center',
  },
  dhikrCountNumber: {
    fontSize: 56,
    fontWeight: Typography.weightBold,
    marginBottom: Spacing.xs,
  },
  dhikrCountUnit: {
    fontSize: Typography.body,
  },
  dhikrTipsCard: {
    borderRadius: Borders.radiusMd,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    gap: Spacing.md,
    ...Shadows.small,
  },
  dhikrTipRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dhikrTipIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  dhikrTipText: {
    fontSize: Typography.caption,
    flex: 1,
    lineHeight: 20,
  },
  spiritualNoteCard: {
    borderRadius: Borders.radiusMd,
    borderLeftWidth: Borders.accent,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    ...Shadows.small,
  },
  spiritualNoteIcon: {
    fontSize: Typography.iconMd,
    marginRight: Spacing.md,
  },
  spiritualNoteText: {
    fontSize: Typography.caption,
    flex: 1,
    lineHeight: 18,
    fontStyle: 'italic',
  },
});
