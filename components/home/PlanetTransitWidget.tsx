import { Borders, DarkTheme, ElementAccents, Typography } from "@/constants/DarkTheme";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProfile } from "@/contexts/ProfileContext";
import type { Element } from "@/services/MomentAlignmentService";
import type { ZodiacSign as ZodiacKey } from "@/services/PlanetTransitService";
import { ZODIAC_DATA } from "@/services/PlanetTransitService";
import { deriveBurjFromDOB } from "@/services/ProfileDerivationService";
import type { LegacyPlanetTransitInfo } from "@/utils/transitAdapters";
import { formatZodiacWithArabic, resolveUserZodiacKey } from "@/utils/translationHelpers";
import { LinearGradient } from 'expo-linear-gradient';
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
  transitData: LegacyPlanetTransitInfo | null;
  nextDayBlessing?: DayBlessing | null;
  compact?: boolean;
}

type HarmonyLevel = 'harmonious' | 'supportive' | 'neutral' | 'challenging';

function getHarmonyLevel(userElement: Element, contextElement: Element): HarmonyLevel {
  if (userElement === contextElement) return 'harmonious';
  const complementary =
    (userElement === 'fire' && contextElement === 'air') ||
    (userElement === 'air' && contextElement === 'fire') ||
    (userElement === 'water' && contextElement === 'earth') ||
    (userElement === 'earth' && contextElement === 'water');
  if (complementary) return 'supportive';
  const opposing =
    (userElement === 'fire' && contextElement === 'water') ||
    (userElement === 'water' && contextElement === 'fire') ||
    (userElement === 'earth' && contextElement === 'air') ||
    (userElement === 'air' && contextElement === 'earth');
  if (opposing) return 'challenging';
  return 'neutral';
}

function getHarmonyColors(level: HarmonyLevel | null) {
  switch (level) {
    case 'harmonious':
      return { bg: 'rgba(76, 175, 80, 0.08)', border: 'rgba(76, 175, 80, 0.35)' };
    case 'supportive':
      return { bg: 'rgba(33, 150, 243, 0.08)', border: 'rgba(33, 150, 243, 0.35)' };
    case 'neutral':
      return { bg: 'rgba(158, 158, 158, 0.06)', border: 'rgba(158, 158, 158, 0.25)' };
    case 'challenging':
      return { bg: 'rgba(255, 107, 53, 0.08)', border: 'rgba(255, 107, 53, 0.35)' };
    default:
      return { bg: 'rgba(30, 20, 36, 0.65)', border: 'rgba(255, 255, 255, 0.06)' };
  }
}

function getPlanetGradient(planetKey?: string): [string, string] {
  switch ((planetKey ?? '').toLowerCase()) {
    case 'sun':
      return ['#FDB813', '#F78C00'];
    case 'moon':
      return ['#DDE2E7', '#9BA7B4'];
    case 'mercury':
      return ['#9BE4C2', '#4DB08D'];
    case 'venus':
      return ['#F6C0D4', '#D66BA0'];
    case 'mars':
      return ['#FF8A5B', '#E0523C'];
    case 'jupiter':
      return ['#F2C48D', '#C88A4F'];
    case 'saturn':
      return ['#E2D5B5', '#B9A67C'];
    default:
      return ['#9FA9B3', '#6B7785'];
  }
}

export default function PlanetTransitWidget({ transitData, nextDayBlessing, compact = false }: PlanetTransitWidgetProps) {
  const { t, tSafe, language } = useLanguage();
  const { profile } = useProfile();
  const [activeSlide, setActiveSlide] = useState(0);

  const myZodiacKey: ZodiacKey | null = (() => {
    const fromDerived = resolveUserZodiacKey({
      burjIndex: profile?.derived?.burjIndex,
      burj: profile?.derived?.burj,
    });
    if (fromDerived) return fromDerived;
    if (profile?.dobISO) {
      const burjData = deriveBurjFromDOB(profile.dobISO);
      return resolveUserZodiacKey({ burjIndex: burjData?.burjIndex, burj: burjData?.burjEn });
    }
    return null;
  })();

  const handlePress = () => {
    router.push({
      pathname: '/(tabs)/planet-transit-details',
      params: {
        type: 'transit',
        payload: JSON.stringify(transitData),
      },
    });
  };

  const hasTransit = Boolean(transitData);
  const fallbackMessage = !myZodiacKey
    ? 'Set your zodiac sign to personalize.'
    : 'No current transit for your sign';

  const subtitleText = hasTransit ? t('widgets.planetTransit.subtitle') : fallbackMessage;

  const planetName = transitData?.planetName ?? fallbackMessage;
  const planetNameAr = transitData?.planetNameAr ?? '';
  const planetSymbol = transitData?.planetSymbol ?? '✦';
  const zodiacKey: ZodiacKey = (transitData?.zodiacKey as ZodiacKey) ?? myZodiacKey ?? 'aries';
  const zodiacSymbol = transitData?.zodiacSymbol ?? (myZodiacKey ? ZODIAC_DATA[myZodiacKey].symbol : '✦');
  const elementKey = (transitData?.elementKey ?? (myZodiacKey ? ZODIAC_DATA[myZodiacKey].element : 'earth')) as Element;

  const elementKeySafe = (elementKey as Element) ?? 'earth';
  const elementAccent = ElementAccents[elementKeySafe];
  const planetGradient = getPlanetGradient(transitData?.planetKey);
  const userElement = (profile.derived?.element as Element | undefined) ?? null;
  const harmony = userElement ? getHarmonyLevel(userElement, elementKeySafe) : null;
  const harmonyColors = getHarmonyColors(harmony);

  const slides = [
    // Slide 1: Planet Transit
    <Pressable
      key="transit"
      style={[styles.slideContent, { backgroundColor: `${elementAccent.primary}0d` }]}
      onPress={hasTransit ? handlePress : undefined}
    >
      {/* Header - NOW badge removed to prevent title truncation */}
      <View style={styles.headerRow}>
        <View style={styles.headerTextBlock}>
          <Text style={styles.slideLabel} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>
            {t('widgets.planetTransit.title')}
          </Text>
          <Text style={styles.slideSubtitle} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>
            {subtitleText}
          </Text>
        </View>
      </View>

      {/* Main Content - fills available space */}
      <View style={styles.mainContent}>
        <View style={styles.planetRow}>
          <View style={[styles.planetOrb, { borderColor: `${elementAccent.primary}55` }]}> 
            <LinearGradient
              colors={planetGradient}
              style={styles.planetOrbGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.planetSymbol}>{planetSymbol}</Text>
            </LinearGradient>
          </View>
          <View style={styles.planetNames}>
            <Text style={styles.planetName} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>{planetName}</Text>
            <Text style={styles.planetNameAr} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>{planetNameAr}</Text>
          </View>
        </View>

        <View style={styles.inRow}>
          <Text style={styles.inArrow}>⟵</Text>
          <Text style={styles.inLabel}>{t('screens.planetTransit.in')}</Text>
          <Text style={styles.inArrow}>⟶</Text>
        </View>

        <View style={styles.rulesBlock}>
          <View style={[styles.zodiacPill, { backgroundColor: elementAccent.glow }]}>
            <Text style={styles.zodiacSymbol}>{zodiacSymbol}</Text>
            <Text
              style={[styles.zodiacText, { color: elementAccent.primary }]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.85}
              ellipsizeMode="tail"
            >
              {!hasTransit && !myZodiacKey
                ? fallbackMessage
                : formatZodiacWithArabic(zodiacKey, language as any)}
            </Text>
          </View>
        </View>
      </View>

      {/* Footer CTA - pinned to bottom */}
      <Text style={styles.footerCTA} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>
        {t("widgets.planetTransit.cta")}
      </Text>
    </Pressable>
  ];

  // Add Next Day Ruler slide if available
  if (nextDayBlessing) {
    const handleNextDayPress = () => {
      router.push({
        pathname: '/(tabs)/planet-transit-details',
        params: {
          type: 'nextDay',
          payload: JSON.stringify(nextDayBlessing),
        },
      });
    };

    slides.push(
      <Pressable
        key="next-day"
        style={[styles.slideContent, { backgroundColor: `${ElementAccents[nextDayBlessing.element].primary}0d` }]}
        onPress={handleNextDayPress}
      >
        {/* Header - NEXT badge removed to prevent title truncation */}
        <View style={styles.headerRow}>
          <Text style={styles.slideLabel} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>
            {t("home.cards.nextDayRuler.title")}
          </Text>
        </View>

        <View style={styles.mainContent}>
          <Text style={styles.dayName} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>{nextDayBlessing.dayName}</Text>
          <Text style={styles.dayNameArabic} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>{nextDayBlessing.dayNameArabic}</Text>

          <View style={styles.nextDayRulerRow}>
            <Text style={styles.nextDayRulerLabel} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>
              {t('home.planetTransitDetails.pills.dayRuler')}
            </Text>
            <Text style={[styles.planetInfo, { color: ElementAccents[nextDayBlessing.element].primary }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>
              {nextDayBlessing.emoji} {nextDayBlessing.planetArabic}
            </Text>
          </View>
          <View style={[styles.elementChip, { backgroundColor: ElementAccents[nextDayBlessing.element].glow }]}>
            <Text style={[styles.elementChipText, { color: ElementAccents[nextDayBlessing.element].primary }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>
              {tSafe(`elements.${nextDayBlessing.element}`, nextDayBlessing.element).toUpperCase()}
            </Text>
          </View>
        </View>

        <Text style={styles.footerCTA} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>
          {t("widgets.planetTransit.cta")}
        </Text>
      </Pressable>
    );
  }

  return (
    <View style={[styles.container, { borderColor: harmonyColors.border, backgroundColor: harmonyColors.bg }]}>
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
  headerTextBlock: {
    flex: 1,
    minWidth: 0,
    gap: 2,
    alignItems: 'center',
  },
  slideLabel: {
    fontSize: 10,
    color: DarkTheme.textTertiary,
    fontWeight: Typography.weightMedium,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  slideSubtitle: {
    fontSize: 11,
    color: DarkTheme.textSecondary,
    fontWeight: Typography.weightSemibold,
    textAlign: 'center',
  },

  // Main content - flexGrow to fill available space
  mainContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    gap: 6,
  },

  // Planet Transit slide elements
  planetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  planetOrb: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    overflow: 'hidden',
  },
  planetOrbGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  planetSymbol: {
    fontSize: 24,
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
  rulesBlock: {
    marginTop: 4,
    width: '100%',
    gap: 6,
  },
  inRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  inLabel: {
    fontSize: 11,
    color: DarkTheme.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  inArrow: {
    fontSize: 12,
    color: DarkTheme.textTertiary,
  },
  zodiacPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
    width: '100%',
  },
  zodiacSymbol: {
    fontSize: 18,
    flexShrink: 0,
  },
  zodiacText: {
    fontSize: 14,
    fontWeight: Typography.weightSemibold,
    textAlign: 'center',
    flex: 1,
    lineHeight: 16,
  },

  // Next Day Ruler slide elements
  dayName: {
    fontSize: 18,
    fontWeight: Typography.weightBold,
    color: DarkTheme.textPrimary,
    flexWrap: 'wrap',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  dayNameArabic: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
    fontFamily: 'Amiri',
    flexWrap: 'wrap',
    textAlign: 'center',
    marginTop: -4,
  },
  planetInfo: {
    fontSize: 14,
    flexWrap: 'wrap',
    fontWeight: Typography.weightSemibold,
  },
  nextDayRulerRow: {
    alignItems: 'center',
    gap: 2,
    flexWrap: 'wrap',
  },
  nextDayRulerLabel: {
    color: DarkTheme.textTertiary,
    textTransform: 'uppercase',
    flexWrap: 'wrap',
    letterSpacing: 0.5,
  },
  elementChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Borders.radiusSm,
    marginTop: 2,
  },
  elementChipText: {
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
