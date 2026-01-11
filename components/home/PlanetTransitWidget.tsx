import { Borders, DarkTheme, ElementAccents, Typography } from "@/constants/DarkTheme";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Element } from "@/services/MomentAlignmentService";
import type { PlanetTransitInfo } from "@/services/PlanetTransitService";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { RotatingCardContent } from "./RotatingCardContent";

interface DayBlessing {
  dayName: string;
  dayNameArabic: string;
  planetArabic: string;
  emoji: string;
  element: Element;
}

interface PlanetTransitWidgetProps {
  transitData: PlanetTransitInfo | null;
  nextDayBlessing?: DayBlessing | null;
  compact?: boolean;
}

export default function PlanetTransitWidget({ transitData, nextDayBlessing, compact = false }: PlanetTransitWidgetProps) {
  const { t, tSafe } = useLanguage();
  const [activeSlide, setActiveSlide] = useState(0);

  // 🔒 Planetary details frozen for launch - redirect to coming soon
  const handlePress = () => {
    router.push("/(tabs)/planetary-coming-soon");
  };

  if (!transitData) return null;

  const { planetName, planetNameAr, planetSymbol, zodiacKey, zodiacSymbol, elementKey } = transitData;
  const elementAccent = ElementAccents[elementKey as Element];

  const slides = [
    // Slide 1: Planet Transit
    <Pressable
      key="transit"
      style={[styles.slideContent, { backgroundColor: `${elementAccent.primary}0d` }]}
      onPress={handlePress}
    >
      {/* Header - NOW badge removed to prevent title truncation */}
      <View style={styles.headerRow}>
        <Text style={styles.slideLabel} numberOfLines={2}>
          {t("home.cards.planetTransit.title")}
        </Text>
      </View>

      {/* Main Content - fills available space */}
      <View style={styles.mainContent}>
        <View style={styles.planetRow}>
          <Text style={styles.planetSymbol}>{planetSymbol}</Text>
          <View style={styles.planetNames}>
            <Text style={styles.planetName} numberOfLines={1}>{planetName}</Text>
            <Text style={styles.planetNameAr} numberOfLines={1}>{planetNameAr}</Text>
          </View>
        </View>

        <View style={styles.rulesRow}>
          <Text style={styles.rulesLabel}>{t("home.cards.planetTransit.rulesLabel")}</Text>
          <View style={[styles.zodiacPill, { backgroundColor: elementAccent.glow }]}>
            <Text style={styles.zodiacSymbol}>{zodiacSymbol}</Text>
            <Text style={[styles.zodiacText, { color: elementAccent.primary }]} numberOfLines={2}>
              {t(`zodiac.${zodiacKey}`)}
            </Text>
          </View>
        </View>
      </View>

      {/* Footer CTA - pinned to bottom */}
      <Text style={styles.footerCTA} numberOfLines={1}>
        {t("home.cards.planetTransit.seeDetails")}
      </Text>
    </Pressable>
  ];

  // Add Next Day Ruler slide if available
  if (nextDayBlessing) {
    // 🔒 Planetary details frozen for launch - redirect to coming soon
    const handleNextDayPress = () => {
      router.push("/(tabs)/planetary-coming-soon");
    };

    slides.push(
      <Pressable
        key="next-day"
        style={[styles.slideContent, { backgroundColor: `${ElementAccents[nextDayBlessing.element].primary}0d` }]}
        onPress={handleNextDayPress}
      >
        {/* Header - NEXT badge removed to prevent title truncation */}
        <View style={styles.headerRow}>
          <Text style={styles.slideLabel} numberOfLines={2}>
            {t("home.cards.nextDayRuler.title")}
          </Text>
        </View>

        <View style={styles.mainContent}>
          <Text style={styles.dayName} numberOfLines={1}>{nextDayBlessing.dayNameArabic}</Text>
          <Text style={[styles.planetInfo, { color: ElementAccents[nextDayBlessing.element].primary }]} numberOfLines={1}>
            {nextDayBlessing.emoji} {nextDayBlessing.planetArabic}
          </Text>
          <View style={[styles.elementChip, { backgroundColor: ElementAccents[nextDayBlessing.element].glow }]}>
            <Text style={[styles.elementChipText, { color: ElementAccents[nextDayBlessing.element].primary }]} numberOfLines={1}>
              {tSafe(`elements.${nextDayBlessing.element}`, nextDayBlessing.element).toUpperCase()}
            </Text>
          </View>
        </View>

        <Text style={styles.footerCTA} numberOfLines={1}>
          {t("home.cards.planetTransit.seeDetails")}
        </Text>
      </Pressable>
    );
  }

  return (
    <View style={styles.container}>
      <RotatingCardContent
        slides={slides}
        intervalMs={8000}
        showDots={true}
        onSlideChange={setActiveSlide}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // SHARED CARD BACKGROUND - matches Prayer widget exactly
  container: {
    flex: 1,
    borderRadius: Borders.radiusLg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    overflow: 'hidden',
    backgroundColor: 'rgba(30, 20, 36, 0.65)', // Same as Prayer widget
    minHeight: 0,
  },

  // Slide content - flex layout to fill height and remove gaps
  slideContent: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    justifyContent: 'space-between', // KEY: distributes header/main/footer evenly
    gap: 6,
  },

  // Header row (label only - badges removed to prevent truncation)
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  slideLabel: {
    fontSize: 10,
    color: DarkTheme.textTertiary,
    fontWeight: Typography.weightMedium,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    flex: 1,
    minWidth: 0,
  },

  // Main content - flexGrow to fill available space
  mainContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },

  // Planet Transit slide elements
  planetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  planetSymbol: {
    fontSize: 28, // Reduced slightly from 32
    flexShrink: 0,
  },
  planetNames: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  planetName: {
    fontSize: 16,
    fontWeight: Typography.weightBold,
    color: DarkTheme.textPrimary,
    textAlign: 'center',
  },
  planetNameAr: {
    fontSize: 11,
    color: DarkTheme.textSecondary,
    fontFamily: 'Amiri',
    textAlign: 'center',
  },
  rulesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
    width: '100%',
  },
  rulesLabel: {
    fontSize: 11,
    color: DarkTheme.textSecondary,
    flexShrink: 0,
    minWidth: 40,
  },
  zodiacPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexGrow: 1,
    flexShrink: 1,
    minWidth: 0,
  },
  zodiacSymbol: {
    fontSize: 14,
    flexShrink: 0,
  },
  zodiacText: {
    fontSize: 11,
    fontWeight: Typography.weightSemibold,
    textAlign: 'center',
    flexShrink: 1,
    minWidth: 0,
  },

  // Next Day Ruler slide elements
  dayName: {
    fontSize: 18,
    fontWeight: Typography.weightBold,
    color: DarkTheme.textPrimary,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  planetInfo: {
    fontSize: 14,
    fontWeight: Typography.weightSemibold,
    textAlign: 'center',
  },
  elementChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Borders.radiusSm,
    marginTop: 2,
  },
  elementChipText: {
    fontSize: 9,
    fontWeight: Typography.weightBold,
    letterSpacing: 0.5,
  },

  // Footer CTA - pinned to bottom
  footerCTA: {
    fontSize: 11,
    color: DarkTheme.textSecondary,
    fontWeight: Typography.weightSemibold,
    textAlign: 'center',
    paddingTop: 4, // ADJUST THIS to fine-tune bottom spacing
  },
});
