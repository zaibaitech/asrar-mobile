/**
 * Daily Energy Details Screen
 * ===============================
 * Detailed view of today's spiritual timing guidance
 * Shows day ruler, elemental harmony, best activities, and explanations
 * 
 * FREE: Day ruler, Element, General theme, Generic "Best for" categories
 * PREMIUM: Personal impact on user, Elemental harmony guidance, Personalized spiritual advice
 * 
 * REDESIGN: Narrative-driven synthesis system showing how TODAY'S energy
 * interacts with USER'S personal nature
 */

import CollapsibleSection from '@/components/common/CollapsibleSection';
import CollapsibleEducationalSection from '@/components/timing/CollapsibleEducationalSection';
import { DailyPlanetaryAnalysisDisplay } from '@/components/timing/DailyPlanetaryAnalysisDisplay';
import MoonPhaseHeaderCard from '@/components/timing/MoonPhaseHeaderCard';
import PlanetaryJudgmentCard from '@/components/timing/PlanetaryJudgmentCard';
import TimingGuidanceCard from '@/components/timing/TimingGuidanceCard';
import TodayDetailsCard from '@/components/timing/TodayDetailsCard';
// New Daily Energy Redesign Components
import TodaysAlignmentSection from '@/components/timing/TodaysAlignmentSection';
import TodaysRulerSection from '@/components/timing/TodaysRulerSection';
import UserPlanetSection from '@/components/timing/UserPlanetSection';
import WhatThisMeansCard from '@/components/timing/WhatThisMeansCard';
import { DarkTheme, Spacing, Typography } from '@/constants/DarkTheme';
import { ZODIAC_SIGNS } from '@/constants/zodiacData';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProfile } from '@/contexts/ProfileContext';
import { useDailyPlanetaryAnalysis } from '@/hooks/useDailyPlanetaryAnalysis';
import { useNowTicker } from '@/hooks/useNowTicker';
import {
    calculatePlanetaryHours,
    formatTime,
    getDayRuler,
    getPlanetaryDayBoundariesForNow,
    getPlanetInfo,
    preCalculateDailyPlanetaryHours,
    type Planet,
    type PlanetaryDayBoundaries,
    type PlanetaryHour,
    type PlanetaryHourData,
    type Element as PlanetElement,
} from '@/services/PlanetaryHoursService';
// New Daily Energy Services
import { buildDestiny } from '@/features/name-destiny/services/nameDestinyCalculator';
import { getDailyGuidance, type DailyGuidance } from '@/services/DailyGuidanceService';
import { generateDailySynthesis, getUserPlanet, type DailySynthesis } from '@/services/DailySynthesisService';
import { getElementRelationship as getClassicalElementRelationship, getPlanetaryRelationship } from '@/services/PlanetaryRelationshipService';
import { BURJ_NAMES_EN } from '@/services/ProfileDerivationService';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type TimingQuality = 'favorable' | 'neutral' | 'delicate' | 'transformative';

type Element = 'fire' | 'water' | 'air' | 'earth';

// ========================================
// ZODIAC RULING PLANET MAPPING
// ========================================

/**
 * Get zodiac ruling planet from burj index (0-11)
 * Based on classical Islamic astronomy
 * Burj index: 0=Aries, 1=Taurus, ... 11=Pisces
 */
function getZodiacRulingPlanet(burjIndex: number | undefined): Planet | undefined {
  if (burjIndex === undefined) return undefined;
  
  const burjRulers: Planet[] = [
    'Mars',      // 0: Aries
    'Venus',     // 1: Taurus
    'Mercury',   // 2: Gemini
    'Moon',      // 3: Cancer
    'Sun',       // 4: Leo
    'Mercury',   // 5: Virgo
    'Venus',     // 6: Libra
    'Mars',      // 7: Scorpio
    'Jupiter',   // 8: Sagittarius
    'Saturn',    // 9: Capricorn
    'Saturn',    // 10: Aquarius
    'Jupiter',   // 11: Pisces
  ];
  
  return burjRulers[burjIndex];
}

// ========================================

// ========================================
// MAIN SCREEN COMPONENT
// ========================================

export default function DailyGuidanceDetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t, language } = useLanguage();
  const { profile } = useProfile();
  const params = useLocalSearchParams();
  
  // Get daily planetary analysis with moon phase data
  const { analysis: dailyAnalysis, loading: analysisLoading } = useDailyPlanetaryAnalysis();
  
  const [bestForExpanded, setBestForExpanded] = useState(true);
  
  // Parse params
  const timingQuality = (params.timingQuality as TimingQuality) || 'neutral';
  const dayElement = (params.dayElement as Element) || 'earth';
  const messageKey = (params.messageKey as string) || '';
  const messageParams = params.messageParams ? JSON.parse(params.messageParams as string) : {};
  const bestForKeys = params.bestForKeys ? JSON.parse(params.bestForKeys as string) : [];
  const avoidKeys = params.avoidKeys ? JSON.parse(params.avoidKeys as string) : [];
  const peakHoursKey = (params.peakHoursKey as string) || '';
  
  const now = useNowTicker(1000);
  const minuteNow = useNowTicker(60_000);
  const dayOfWeek = now.getDay();
  const dayKeys = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayKey = dayKeys[dayOfWeek];
  const dayName = t(`home.dailyGuidanceDetails.days.${dayKey}`);
  const date = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  // Ensure interpolated params contain human-readable values.
  // (The guidance service may provide a translation key for "day" since it doesn't have access to `t`.)
  const resolvedMessageParams = React.useMemo(() => {
    if (!messageParams || typeof messageParams !== 'object') return {};
    return {
      ...messageParams,
      day: dayName,
    };
  }, [messageParams, dayName]);
  
  // Get day ruler
  const dayRuler = getDayRuler(now);
  const dayRulerInfo = getPlanetInfo(dayRuler);

  const ascendantBurjIndex = profile?.derived?.ascendantBurjIndex;
  const zodiacSign = useMemo(() => {
    if (typeof ascendantBurjIndex !== 'number') return undefined;
    return ZODIAC_SIGNS[ascendantBurjIndex + 1];
  }, [ascendantBurjIndex]);

  const userZodiacRuler = useMemo(() => {
    if (typeof ascendantBurjIndex !== 'number') return undefined;
    return getZodiacRulingPlanet(ascendantBurjIndex);
  }, [ascendantBurjIndex]);
  
  // NEW: Daily Synthesis State
  const [dailySynthesis, setDailySynthesis] = useState<DailySynthesis | null>(null);
  const [synthesisLoading, setSynthesisLoading] = useState(false);
  const [synthesisError, setSynthesisError] = useState<string | null>(null);

  // Keep the same day-level window status as the Home "Daily Energy" widget
  const [dailyGuidance, setDailyGuidance] = useState<DailyGuidance | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const g = await getDailyGuidance(profile);
        if (!cancelled) {
          setDailyGuidance(g);
        }
      } catch {
        if (!cancelled) {
          setDailyGuidance(null);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [profile]);
  
  // NEW: Generate daily synthesis when data is available
  useEffect(() => {
    if (profile && dailyAnalysis && dailyAnalysis.moonPhase) {
      // Start loading
      setSynthesisLoading(true);
      setSynthesisError(null);
      
      // Use setTimeout to simulate async and allow UI to show loading state
      const timer = setTimeout(() => {
        try {
          // Get user's planet (for alignment): prefer Name + Mother's Name derived planet
          let nameMotherPlanet: Planet | undefined;
          try {
            if (profile.nameAr) {
              const destiny = buildDestiny(profile.nameAr, profile.motherName);
              const p = destiny?.burj?.planet;
              const ok = p === 'Sun' || p === 'Moon' || p === 'Mercury' || p === 'Venus' || p === 'Mars' || p === 'Jupiter' || p === 'Saturn';
              if (ok) nameMotherPlanet = p;
            }
          } catch {
            nameMotherPlanet = undefined;
          }
          const fallback = getUserPlanet(undefined, nameMotherPlanet);
          const userPlanet = fallback.planet;
          
          // Get user's element
          const userElement = ((profile as any).zahirElement || (profile.derived as any)?.element || 'fire') as PlanetElement;
          
          // Get day element from day ruler
          const dayElement = dayRulerInfo.element as PlanetElement;
          
          // Get moon phase
          const moonPhase = dailyAnalysis.moonPhase?.phaseName || 'waxing_crescent';
          
          // Get day ruler transit power
          const transitPower = 50;
          
          // Get user's zodiac sign for special harmony rules (Scorpio+Fire, Aquarius+Water)
          // Use burjIndex to get English name since derived.burj is in Arabic
          const burjIndex = profile?.derived?.burjIndex;
          const synthesisUserSignKey = burjIndex !== undefined ? BURJ_NAMES_EN[burjIndex]?.toLowerCase() : undefined;
          
          // Generate synthesis
          const synthesis = generateDailySynthesis(
            dayRuler,
            userPlanet,
            userElement,
            dayElement,
            moonPhase,
            transitPower,
            t
          );
          
          setDailySynthesis(synthesis);
          setSynthesisLoading(false);
        } catch (error) {
          console.error('Failed to generate daily synthesis:', error);
          setSynthesisError(t('errors.synthesisGenerationFailed') || 'Unable to generate synthesis');
          setSynthesisLoading(false);
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [profile, dailyAnalysis, dayRuler, dayRulerInfo, t, userZodiacRuler]);
  
  // Get user planet info for display
  const userPlanetInfo = useMemo(() => {
    if (!profile) return null;
    let nameMotherPlanet: Planet | undefined;
    try {
      if (profile.nameAr) {
        const destiny = buildDestiny(profile.nameAr, profile.motherName);
        const p = destiny?.burj?.planet;
        const ok = p === 'Sun' || p === 'Moon' || p === 'Mercury' || p === 'Venus' || p === 'Mars' || p === 'Jupiter' || p === 'Saturn';
        if (ok) nameMotherPlanet = p;
      }
    } catch {
      nameMotherPlanet = undefined;
    }

    const { planet, source } = getUserPlanet(undefined, nameMotherPlanet);
    const element = ((profile as any).zahirElement || (profile.derived as any)?.element || 'fire') as PlanetElement;
    return { planet, element, source };
  }, [profile]);

  const [planetaryBoundaries, setPlanetaryBoundaries] = useState<PlanetaryDayBoundaries | null>(null);
  const [planetaryData, setPlanetaryData] = useState<PlanetaryHourData | null>(null);
  const [planetaryHours, setPlanetaryHours] = useState<PlanetaryHour[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const location = profile?.location;

      // If no location, fall back to approximate boundaries.
      if (!location || typeof location.latitude !== 'number' || typeof location.longitude !== 'number') {
        const approxSunrise = new Date(minuteNow);
        approxSunrise.setHours(6, 30, 0, 0);
        const approxSunset = new Date(minuteNow);
        approxSunset.setHours(18, 30, 0, 0);
        const approxNextSunrise = new Date(approxSunrise);
        approxNextSunrise.setDate(approxNextSunrise.getDate() + 1);

        if (!cancelled) {
          setPlanetaryBoundaries({ sunrise: approxSunrise, sunset: approxSunset, nextSunrise: approxNextSunrise });
        }
        return;
      }

      const boundaries = await getPlanetaryDayBoundariesForNow(
        { latitude: location.latitude, longitude: location.longitude },
        { now: minuteNow }
      );

      if (!cancelled) setPlanetaryBoundaries(boundaries);
    })();

    return () => {
      cancelled = true;
    };
  }, [profile?.location?.latitude, profile?.location?.longitude, minuteNow]);

  useEffect(() => {
    if (!planetaryBoundaries) return;
    setPlanetaryData(
      calculatePlanetaryHours(
        planetaryBoundaries.sunrise,
        planetaryBoundaries.sunset,
        planetaryBoundaries.nextSunrise,
        now
      )
    );
  }, [planetaryBoundaries, now]);

  useEffect(() => {
    if (!planetaryBoundaries) return;
    let cancelled = false;
    (async () => {
      const cache = await preCalculateDailyPlanetaryHours(
        planetaryBoundaries.sunrise,
        planetaryBoundaries.sunset,
        planetaryBoundaries.nextSunrise
      );

      if (cancelled) return;
      const normalized = (cache?.hours || []).map((h) => ({
        ...h,
        startTime: new Date(h.startTime),
        endTime: new Date(h.endTime),
      }));
      setPlanetaryHours(normalized);
    })();

    return () => {
      cancelled = true;
    };
  }, [planetaryBoundaries]);

  const alignmentScore = useMemo(() => {
    if (!dailySynthesis) return undefined;
    const a = dailySynthesis.factors.planetaryFriendship.score;
    const b = dailySynthesis.factors.elementalHarmony.score;
    const c = dailySynthesis.factors.dailyStrength.score;
    return Math.round((a + b + c) / 3);
  }, [dailySynthesis]);

  type AuthorityLevel = 'avoid' | 'conditional' | 'supported';
  type DisplayQuality = 'excellent' | 'good' | 'moderate' | 'challenging';

  const authority = useMemo(() => {
    const moonPhaseName = dailyAnalysis?.moonPhase?.phaseName;
    const isFullMoon = moonPhaseName === 'full';
    const isSaturnDay = dayRuler === 'Saturn';
    const isMarsDay = dayRuler === 'Mars';
    const hardRestriction = isSaturnDay || isMarsDay;

    // Language mapping follows the requested alignment-score thresholds.
    // If alignment score is missing, fall back to dailyScore.
    const score =
      typeof alignmentScore === 'number'
        ? alignmentScore
        : typeof dailyAnalysis?.dailyScore === 'number'
          ? dailyAnalysis.dailyScore
          : 0;

    let base: AuthorityLevel = 'conditional';
    if (score < 40) base = 'avoid';
    else if (score < 70) base = 'conditional';
    else base = 'supported';

    // Hard day-ruler restrictions can never be overridden by lower layers.
    const level: AuthorityLevel = hardRestriction && base === 'supported' ? 'conditional' : base;

    // Convert authority into the quality tokens used by existing UI.
    // Never allow "excellent" language below 70% or under hard restriction.
    let displayQuality: DisplayQuality;
    if (level === 'avoid') displayQuality = 'challenging';
    else if (level === 'conditional') displayQuality = 'moderate';
    else displayQuality = score >= 85 && !hardRestriction ? 'excellent' : 'good';

    return {
      level,
      displayQuality,
      score,
      hardRestriction,
      isFullMoon,
      moonPhaseName,
    };
  }, [alignmentScore, dailyAnalysis?.dailyScore, dailyAnalysis?.moonPhase?.phaseName, dayRuler]);
  
  function getStatusLabel() {
    // Keep the existing emoji style, but never contradict the authority.
    // NOTE: hardRestriction implies "conditional" even if score is high.
    switch (authority.displayQuality) {
      case 'excellent':
        return `✨ ${t('dailyEnergy.authorityBadge.excellent')}`;
      case 'good':
        return `🌟 ${t('dailyEnergy.authorityBadge.supported')}`;
      case 'moderate':
        return authority.hardRestriction
          ? `🛡️ ${t('dailyEnergy.authorityBadge.restricted')}`
          : `⚠️ ${t('dailyEnergy.authorityBadge.conditional')}`;
      case 'challenging':
      default:
        return `⛔ ${t('dailyEnergy.authorityBadge.notAdvised')}`;
    }
  }
  
  function getElementIcon(element: Element) {
    const icons = {
      fire: '🔥',
      water: '💧',
      air: '🌬️',
      earth: '🌱',
    };
    return icons[element];
  }
  
  function getElementLabel(element: Element) {
    return t(`home.dailyGuidanceDetails.elements.${element}`);
  }
  
  // Get color based on synthesis quality
  function getQualityColor(quality: 'excellent' | 'good' | 'moderate' | 'challenging') {
    switch (quality) {
      case 'excellent': return '#10b981'; // Green
      case 'good': return '#3B82F6';      // Blue
      case 'moderate': return '#F59E0B';  // Amber
      case 'challenging': return '#EF4444'; // Red
    }
  }
  
  // Get label based on synthesis quality
  function getQualityLabel(quality: 'excellent' | 'good' | 'moderate' | 'challenging') {
    switch (quality) {
      case 'excellent':
        return `✨ ${t('dailyEnergy.authorityBadge.excellent')}`;
      case 'good':
        return `🌟 ${t('dailyEnergy.authorityBadge.supported')}`;
      case 'moderate':
        return authority.hardRestriction
          ? `🛡️ ${t('dailyEnergy.authorityBadge.restricted')}`
          : `⚠️ ${t('dailyEnergy.authorityBadge.conditional')}`;
      case 'challenging':
        return `⛔ ${t('dailyEnergy.authorityBadge.notAdvised')}`;
    }
  }
  
  const windowQuality: TimingQuality = (dailyGuidance?.timingQuality as TimingQuality) || timingQuality;

  const getWindowColor = (quality: TimingQuality) => {
    switch (quality) {
      case 'favorable':
        return '#10b981';
      case 'transformative':
        return '#f59e0b';
      case 'delicate':
        return '#ef4444';
      case 'neutral':
      default:
        return '#64B5F6';
    }
  };

  const masterToneColor = getWindowColor(windowQuality);

  const masterCapQuality: 'excellent' | 'good' | 'moderate' | 'challenging' =
    windowQuality === 'favorable'
      ? 'good'
      : windowQuality === 'neutral' || windowQuality === 'transformative'
        ? 'moderate'
        : 'challenging';

  const verdictQuality = (() => {
    const rank: Record<'excellent' | 'good' | 'moderate' | 'challenging', number> = {
      excellent: 0,
      good: 1,
      moderate: 2,
      challenging: 3,
    };
    return rank[authority.displayQuality] >= rank[masterCapQuality]
      ? authority.displayQuality
      : masterCapQuality;
  })();
  const getWindowLabel = (quality: TimingQuality) => {
    return t(`widgets.dailyEnergy.windows.${quality}`);
  };

  const ascendantBurj = profile?.derived?.ascendantBurj;
  const ascendantElement = profile?.derived?.ascendantElement as Element | undefined;

  function formatHourRange(start: Date, end: Date): string {
    return `${formatTime(start)}-${formatTime(end)}`;
  }

  const userBestHours = useMemo(() => {
    if (!userZodiacRuler || !planetaryHours?.length) return [];
    return planetaryHours
      .filter((h) => h.planet === userZodiacRuler && h.endTime.getTime() > now.getTime())
      .slice(0, 3);
  }, [planetaryHours, userZodiacRuler, now]);

  const dayBestHours = useMemo(() => {
    if (!planetaryHours?.length) return [];
    return planetaryHours
      .filter((h) => h.planet === dayRuler && h.endTime.getTime() > now.getTime())
      .slice(0, 3);
  }, [planetaryHours, dayRuler, now]);

  const challengingHours = useMemo(() => {
    if (!userZodiacRuler || !planetaryHours?.length) return [];
    return planetaryHours
      .filter((h) => h.endTime.getTime() > now.getTime())
      .filter((h) => getPlanetaryRelationship(userZodiacRuler, h.planet) === 'enemy')
      .slice(0, 3);
  }, [planetaryHours, userZodiacRuler, now]);

  // Get user's zodiac sign for special case handling (Scorpio+Fire, Aquarius+Water)
  // Use burjIndex to get English name since derived.burj is in Arabic
  const localBurjIndex = profile?.derived?.burjIndex;
  const userSignKey = localBurjIndex !== undefined ? BURJ_NAMES_EN[localBurjIndex]?.toLowerCase() : undefined;

  function getHourPowerForUser(hourPlanet: Planet): number {
    const userElement = ascendantElement ?? ((profile as any)?.zahirElement as Element | undefined) ?? ((profile?.derived as any)?.element as Element | undefined);
    if (!userElement) return 55;
    const relation = getPlanetaryRelationship(userZodiacRuler ?? hourPlanet, hourPlanet);
    const planetScore = relation === 'friend' ? 90 : relation === 'neutral' ? 60 : 30;
    const elementRelation = getClassicalElementRelationship(userElement, getPlanetInfo(hourPlanet).element);
    const elementScore =
      elementRelation === 'same' ? 90 : elementRelation === 'supportive' ? 75 : elementRelation === 'neutral' ? 50 : 25;
    return Math.round((planetScore + elementScore) / 2);
  }

  const timingGuidanceProps = useMemo(() => {
    if (!planetaryData) return null;
    const current = planetaryData.currentHour;
    const currentPower = getHourPowerForUser(current.planet);

    const candidates: PlanetaryHour[] = planetaryHours?.length
      ? planetaryHours.filter((h) => h.startTime.getTime() >= now.getTime()).slice(0, 6)
      : ([planetaryData.nextHour, planetaryData.afterNextHour].filter(Boolean) as PlanetaryHour[]);

    let best: { hour: PlanetaryHour; power: number } | null = null;
    for (const h of candidates) {
      const power = getHourPowerForUser(h.planet);
      if (!best || power > best.power) best = { hour: h, power };
    }

    return {
      currentHour: {
        planet: current.planet,
        power: currentPower,
        endsAt: formatTime(current.endTime),
      },
      nextBestHour: best
        ? {
            planet: best.hour.planet,
            power: best.power,
            startsAt: formatTime(best.hour.startTime),
            hoursUntil: Math.max(0, Math.round((best.hour.startTime.getTime() - now.getTime()) / (1000 * 60 * 60))),
          }
        : undefined,
    };
  }, [planetaryData, planetaryHours, now]);
  
  function getElementRelationship(a?: Element, b?: Element): 'harmonious' | 'complementary' | 'transformative' | 'neutral' {
    if (!a || !b) return 'neutral';
    if (a === b) return 'harmonious';
    
    // SCORPIO SPECIAL CASE: Mars-ruled water shares fire's intensity
    if (userSignKey === 'scorpio' && b === 'fire') {
      return 'complementary';
    }
    
    // AQUARIUS SPECIAL CASE: Saturn-ruled cold air is less challenging with water
    if (userSignKey === 'aquarius' && b === 'water') {
      return 'neutral';
    }
    
    const active = new Set<Element>(['fire', 'air']);
    const receptive = new Set<Element>(['water', 'earth']);
    if ((active.has(a) && active.has(b)) || (receptive.has(a) && receptive.has(b))) {
      return 'complementary';
    }
    const oppositions: Record<Element, Element> = {
      fire: 'water',
      water: 'fire',
      air: 'earth',
      earth: 'air',
    };
    return oppositions[a] === b ? 'transformative' : 'neutral';
  }
  
  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={DarkTheme.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>{t('home.dailyGuidanceDetails.title')}</Text>
          <Text style={styles.headerSubtitle}>{dayName}, {date}</Text>
        </View>
        <View style={styles.placeholder} />
      </View>
      
      <LinearGradient
        colors={[`${masterToneColor}15`, `${masterToneColor}05`, DarkTheme.screenBackground]}
        style={styles.gradientContainer}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Status Badge - Shows synthesis quality (no percentage) */}
          {dailySynthesis && (
            <View style={[styles.statusBadge, { backgroundColor: `${getWindowColor(windowQuality)}20`, borderColor: getWindowColor(windowQuality) }]}> 
              <View style={[styles.statusDot, { backgroundColor: getWindowColor(windowQuality) }]} />
              <Text style={[styles.statusText, { color: getWindowColor(windowQuality) }]}>
                {getWindowLabel(windowQuality)}
              </Text>
            </View>
          )}

          {/* SECTION 1: ALIGNMENT OVERVIEW (Most Important) */}
          <TodayDetailsCard
            dayRuler={dayRuler}
            userRuler={userZodiacRuler}
            dayElement={dayRulerInfo.element as PlanetElement}
            userElement={ascendantElement}
            alignmentScore={alignmentScore}
            elementalHarmonyScore={dailySynthesis?.factors.elementalHarmony.score}
            planetaryHarmonyScore={dailySynthesis?.factors.planetaryFriendship.score}
            verdict={
              dailySynthesis
                ? t(`dailyEnergy.alignmentOverview.verdict.${verdictQuality}`)
                : undefined
            }
          />

          {/* SECTION 1: PLANETARY JUDGMENT (Global layer, non-personal) */}
          <PlanetaryJudgmentCard
            dayRuler={dayRuler}
            moonPhaseName={dailyAnalysis?.moonPhase?.phaseName}
          />

          {/* SECTION 1: MOON PHASE (Primary Layer) */}
          {dailyAnalysis?.moonPhase && (
            <MoonPhaseHeaderCard
              moonPhase={dailyAnalysis.moonPhase}
              isExpanded={true}
              dayRulerPlanet={dayRuler}
              authorityLevel={authority.level}
            />
          )}
          
          {/* NEW: Daily Synthesis Section with Error Boundary */}
          {synthesisLoading ? (
            // Loading State
            <View style={styles.loadingCard}>
              <Text style={styles.loadingText}>{t('dailyEnergy.loading.generatingGuidance')}</Text>
            </View>
          ) : synthesisError ? (
            // Error State
            <View style={styles.errorCard}>
              <Text style={styles.errorIcon}>⚠️</Text>
              <Text style={styles.errorTitle}>{t('dailyEnergy.errors.unableToGenerateTitle')}</Text>
              <Text style={styles.errorMessage}>
                {t('dailyEnergy.errors.unableToGenerateBody')}
              </Text>
              <TouchableOpacity 
                style={styles.refreshButton}
                onPress={() => {
                  setSynthesisError(null);
                  setSynthesisLoading(true);
                }}
              >
                <Text style={styles.refreshButtonText}>{t('dailyEnergy.actions.refresh')}</Text>
              </TouchableOpacity>
            </View>
          ) : dailySynthesis && (userPlanetInfo || userZodiacRuler) ? (
            // Success State - Show Full Synthesis
            <>
              {/* Main Analysis Card - Today's Ruler + Your Planet + Alignment */}
              <View style={styles.analysisCard}>
                {/* YOUR COSMIC PROFILE */}
                {userPlanetInfo ? (
                  <UserPlanetSection
                    userPlanet={userPlanetInfo.planet}
                    userElement={(ascendantElement ?? userPlanetInfo.element) as PlanetElement}
                    source={userPlanetInfo.source}
                  />
                ) : userZodiacRuler && ascendantElement ? (
                  <UserPlanetSection
                    userPlanet={userZodiacRuler}
                    userElement={ascendantElement as PlanetElement}
                    source={'default'}
                  />
                ) : null}
                
                {/* Divider */}
                <View style={styles.divider} />

                {/* TODAY'S COSMIC PROFILE */}
                <TodaysRulerSection
                  dayRuler={dayRuler}
                  dayElement={dayRulerInfo.element as PlanetElement}
                  dayDescription={t(`dayRulers.${dayKey.toLowerCase()}.desc`)}
                  transitPower={dailyAnalysis?.dayRulingStrength || 50}
                  transitSign={undefined}
                  transitDignity={undefined}
                />
                
                {/* Divider */}
                <View style={styles.divider} />

                {/* ALIGNMENT ANALYSIS */}
                <TodaysAlignmentSection synthesis={dailySynthesis} />
              </View>
              
              {/* What This Means For You Card */}
              <WhatThisMeansCard synthesis={dailySynthesis} />
            </>
          ) : dailySynthesis ? (
            // Fallback - No user profile, show generic guidance
            <View style={styles.genericCard}>
              <Text style={styles.genericTitle}>{t('dailyEnergy.generic.title')}</Text>
              <Text style={styles.genericText}>{dailySynthesis.summaryText}</Text>
              <Text style={styles.genericNote}>
                {t('dailyEnergy.generic.completeProfileNote')}
              </Text>
            </View>
          ) : null}
          
          {/* SECTION 9: PRACTICAL GUIDANCE (Planetary hour quality) */}
          <TimingGuidanceCard
            currentHour={timingGuidanceProps?.currentHour}
            nextBestHour={timingGuidanceProps?.nextBestHour}
            windowQuality={dailyGuidance?.timingQuality}
          />

          {/* ================================================ */}
          {/* COLLAPSIBLE SECTIONS - Details on Demand         */}
          {/* ================================================ */}

          {/* COLLAPSIBLE: Detailed Planetary Analysis */}
          <CollapsibleSection
            title={t('dailyEnergy.planetaryStrength.title') || 'Planetary Strength'}
            icon="🌍"
            defaultExpanded={false}
            subtitle={t('home.dailyGuidanceDetails.collapsible.planetaryDetails') || 'Detailed breakdown'}
          >
            <DailyPlanetaryAnalysisDisplay expanded={true} />
          </CollapsibleSection>

          {/* COLLAPSIBLE: Ascendant Lens (Educational) */}
          {ascendantBurj && ascendantElement && (
            <CollapsibleSection
              title={t('home.dailyGuidanceDetails.sections.ascendantLens') || 'Ascendant Lens'}
              icon="✨"
              defaultExpanded={false}
              subtitle={t('home.dailyGuidanceDetails.collapsible.yourPersonalFilter') || 'Your personal filter'}
            >
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Ionicons name="sparkles-outline" size={24} color="#a78bfa" />
                  <Text style={[styles.cardTitle, { color: '#a78bfa' }]}>
                    {t('home.dailyGuidanceDetails.ascendant.title')}
                  </Text>
                </View>
                <Text style={styles.cardText}>
                  {t('home.dailyGuidanceDetails.ascendant.summary', {
                    sign: ascendantBurj,
                    element: getElementLabel(ascendantElement).toLowerCase(),
                  })}
                </Text>
                <Text style={styles.cardText}>
                  {t(`home.dailyGuidanceDetails.ascendant.elementHints.${ascendantElement}`)}
                </Text>
                <Text style={styles.cardText}>
                  {t(`home.dailyGuidanceDetails.ascendant.blend.${getElementRelationship(ascendantElement, dayElement)}`)}
                </Text>
              </View>
            </CollapsibleSection>
          )}
          
          {/* Why This? Section - FREE (Educational) */}
          {/* Why This Timing? - Collapsible Educational Section */}
          <CollapsibleEducationalSection
            whyThisTiming={{
              elementHarmony: t('home.dailyGuidanceDetails.whyThisContent.line1', { day: dayName, planet: dayRuler }),
              momentAlignment: t('home.dailyGuidanceDetails.whyThisContent.line2', { element: getElementLabel(dayElement).toLowerCase(), planet: dayRuler }),
              planetaryResonance: '',
              guidance: t('home.dailyGuidanceDetails.whyThisContent.line4'),
            }}
          />
          
          {/* Footer Disclaimer */}
          <View style={styles.disclaimer}>
            <Ionicons name="information-circle-outline" size={16} color={DarkTheme.textTertiary} />
            <Text style={styles.disclaimerText}>
              {t('home.dailyGuidanceDetails.disclaimer')}
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

function getHarmonyColor(level: string): string {
  switch (level) {
    case 'Harmonious':
      return '#10b981';
    case 'Supportive':
      return '#059669';
    case 'Challenging':
      return '#ef4444';
    default:
      return '#64748b';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DarkTheme.screenBackground,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  backButton: {
    padding: Spacing.xs,
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: DarkTheme.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
    marginTop: 2,
  },
  placeholder: {
    width: 40,
  },
  
  gradientContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    gap: Spacing.xl,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: Spacing.lg,
    borderWidth: 2,
    alignSelf: 'flex-start',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusText: {
    fontSize: Typography.h3,
    fontWeight: Typography.weightBold as any,
  },
  statusScore: {
    fontSize: Typography.h2,
    fontWeight: Typography.weightBold as any,
    marginLeft: 'auto',
  },
  section: {
    gap: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.h3,
    fontWeight: Typography.weightBold as any,
    color: DarkTheme.textPrimary,
  },
  expandableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  planetCard: {
    flexDirection: 'row',
    gap: Spacing.lg,
    padding: Spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  planetSymbol: {
    fontSize: 48,
  },
  planetInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  planetName: {
    fontSize: Typography.h2,
    fontWeight: Typography.weightBold as any,
    color: DarkTheme.textPrimary,
  },
  planetArabic: {
    fontSize: Typography.body,
    color: DarkTheme.textSecondary,
  },
  planetElement: {
    fontSize: Typography.label,
    color: DarkTheme.textTertiary,
  },
  card: {
    padding: Spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    gap: Spacing.md,
  },
  
  // NEW: Analysis Card for Daily Energy Redesign
  analysisCard: {
    backgroundColor: 'rgba(30, 20, 60, 0.6)',
    borderWidth: 2,
    borderColor: 'rgba(180, 170, 255, 0.3)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  cardTitle: {
    fontSize: Typography.h3,
    fontWeight: Typography.weightBold as any,
  },
  cardText: {
    fontSize: Typography.body,
    lineHeight: Typography.body * Typography.lineHeightNormal,
    color: DarkTheme.textSecondary,
  },
  explainerText: {
    fontSize: Typography.body,
    lineHeight: Typography.body * Typography.lineHeightNormal,
    color: DarkTheme.textSecondary,
  },
  harmonyCard: {
    padding: Spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    gap: Spacing.md,
  },
  harmonyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  harmonyElementBox: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  harmonyElementIcon: {
    fontSize: 32,
  },
  harmonyElementLabel: {
    fontSize: Typography.label,
    color: DarkTheme.textSecondary,
  },
  harmonySymbol: {
    fontSize: 24,
    color: DarkTheme.textTertiary,
  },
  harmonyBadge: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: Spacing.md,
    alignSelf: 'center',
  },
  harmonyLevel: {
    fontSize: Typography.h3,
    fontWeight: Typography.weightBold as any,
    textAlign: 'center',
  },
  harmonyExplanation: {
    fontSize: Typography.body,
    lineHeight: Typography.body * Typography.lineHeightNormal,
    color: DarkTheme.textSecondary,
    textAlign: 'center',
  },
  listCard: {
    padding: Spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    gap: Spacing.md,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  listDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
  },
  listText: {
    flex: 1,
    fontSize: Typography.body,
    lineHeight: Typography.body * Typography.lineHeightNormal,
    color: DarkTheme.textSecondary,
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    justifyContent: 'center',
    paddingVertical: Spacing.md,
  },
  disclaimerText: {
    fontSize: Typography.caption,
    color: DarkTheme.textTertiary,
  },

  // Loading State
  loadingCard: {
    padding: Spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: Typography.body,
    color: DarkTheme.textTertiary,
    fontStyle: 'italic',
  },

  // Error State
  errorCard: {
    padding: Spacing.lg,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    gap: Spacing.md,
    alignItems: 'center',
  },
  errorIcon: {
    fontSize: 32,
  },
  errorTitle: {
    fontSize: Typography.h3,
    fontWeight: Typography.weightBold as any,
    color: '#ef4444',
  },
  errorMessage: {
    fontSize: Typography.body,
    color: DarkTheme.textSecondary,
    lineHeight: Typography.body * Typography.lineHeightNormal,
    textAlign: 'center',
  },
  refreshButton: {
    marginTop: Spacing.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderRadius: Spacing.md,
  },
  refreshButtonText: {
    fontSize: Typography.body,
    fontWeight: Typography.weightMedium as any,
    color: '#a78bfa',
  },

  // Generic Fallback State
  genericCard: {
    padding: Spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    gap: Spacing.md,
  },
  genericTitle: {
    fontSize: Typography.h3,
    fontWeight: Typography.weightBold as any,
    color: DarkTheme.textPrimary,
  },
  genericText: {
    fontSize: Typography.body,
    color: DarkTheme.textSecondary,
    lineHeight: Typography.body * Typography.lineHeightNormal,
  },
  genericNote: {
    fontSize: Typography.caption,
    color: '#a78bfa',
    fontStyle: 'italic',
    marginTop: Spacing.sm,
  },

  // 
});
