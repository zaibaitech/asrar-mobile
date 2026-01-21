import { PremiumSection } from '@/components/subscription/PremiumSection';
import { DarkTheme, ElementAccents, Spacing, Typography } from '@/constants/DarkTheme';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProfile } from '@/contexts/ProfileContext';
import type { Element } from '@/services/MomentAlignmentService';
import type { Planet } from '@/services/PlanetaryHoursService';
import {
    getDegreeStageColor,
    getDegreeStageIcon,
    getInfluenceTypeColor,
    getPersonalizedInfluence,
    type PersonalizedInfluence
} from '@/services/PlanetaryInfluenceService';
import { ZODIAC_DATA, type PlanetTransitInfo, type ZodiacSign as ZodiacKey } from '@/services/PlanetTransitService';
import { getAllTransits, getTransit } from '@/services/TransitService';
import type { AllPlanetTransits, PlanetTransit } from '@/types/planetary-systems';
import { adaptTransitToLegacyFormat, type LegacyPlanetTransitInfo } from '@/utils/transitAdapters';
import { formatZodiacWithArabic, resolveUserZodiacKey } from '@/utils/translationHelpers';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    Animated,
    LayoutAnimation,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleProp,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';

type DetailsType = 'transit' | 'nextDay';

type ExpandableSection = 'duration' | 'personalized' | 'guidance';

type NextDayPayload = {
  dayName: string;
  dayNameArabic: string;
  planetArabic: string;
  emoji: string;
  element: Element;
};

type HarmonyLevel = 'harmonious' | 'supportive' | 'neutral' | 'challenging';

type BalancingMethodType = 'divine_name' | 'dhikr' | 'prayer' | 'letter_sequence' | 'timing';

type BalancingMethod = {
  type: BalancingMethodType;
  title: string;
  titleArabic: string;
  instruction: string;
  count?: number;
  numerology?: string;
  bestTime?: string;
  source?: string;
};

function safeJsonParse<T>(value: unknown): T | null {
  if (!value || typeof value !== 'string') return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function toTitleCase(value: string) {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

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


function getResonancePalette(level: HarmonyLevel | null, accent: (typeof ElementAccents)[Element]) {
  switch (level) {
    case 'harmonious':
      return { primary: '#4CAF50', light: 'rgba(76, 175, 80, 0.28)', dark: 'rgba(76, 175, 80, 0.75)' };
    case 'supportive':
      return { primary: '#2196F3', light: 'rgba(33, 150, 243, 0.28)', dark: 'rgba(33, 150, 243, 0.75)' };
    case 'neutral':
      return { primary: '#9E9E9E', light: 'rgba(158, 158, 158, 0.24)', dark: 'rgba(158, 158, 158, 0.7)' };
    case 'challenging':
      return { primary: '#FF6B35', light: 'rgba(255, 107, 53, 0.24)', dark: 'rgba(255, 107, 53, 0.75)' };
    default:
      return { primary: accent.primary, light: accent.glow, dark: accent.secondary };
  }
}

type GradientTuple = readonly [string, string, ...string[]];

function ensureGradientTuple(colors: string[]): GradientTuple {
  if (colors.length >= 2) return colors as unknown as GradientTuple;
  return ['#9FA9B3', '#6B7785'];
}

function getElementGradient(element?: Element): GradientTuple {
  if (!element) return ['#6B7785', '#4C5561'];
  return ensureGradientTuple([...ElementAccents[element].gradient]);
}

function splitLabeledText(text: string) {
  const parts = text.split(':');
  if (parts.length < 2) return { label: '', body: text };
  return { label: parts[0].trim(), body: parts.slice(1).join(':').trim() };
}

function getElementIconName(element: Element): keyof typeof Ionicons.glyphMap {
  if (element === 'water') return 'water';
  if (element === 'fire') return 'flame';
  if (element === 'air') return 'cloud';
  return 'leaf';
}

function getMethodIcon(type: BalancingMethodType): keyof typeof Ionicons.glyphMap {
  switch (type) {
    case 'divine_name':
      return 'sparkles';
    case 'dhikr':
      return 'repeat';
    case 'prayer':
      return 'moon';
    case 'letter_sequence':
      return 'leaf';
    case 'timing':
      return 'time';
    default:
      return 'information-circle';
  }
}

const ZODIAC_ORDER = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'] as const;

const PLANET_SYMBOLS: Record<string, string> = {
  sun: '☉',
  moon: '☽',
  mercury: '☿',
  venus: '♀',
  mars: '♂',
  jupiter: '♃',
  saturn: '♄',
};

const AVG_DAYS_PER_SIGN: Record<Planet, number> = {
  Moon: 2.5,
  Mercury: 22,
  Venus: 27,
  Mars: 50,
  Sun: 30.4,
  Jupiter: 365,
  Saturn: 900,
};

const DAY_MS = 24 * 60 * 60 * 1000;

function getAdjacentSigns(signKey?: string) {
  if (!signKey) return null;
  const index = ZODIAC_ORDER.indexOf(signKey as any);
  if (index === -1) return null;
  const prev = ZODIAC_ORDER[(index + ZODIAC_ORDER.length - 1) % ZODIAC_ORDER.length];
  const next = ZODIAC_ORDER[(index + 1) % ZODIAC_ORDER.length];
  return { prev, next };
}

function formatMonthYear(value: Date | null, locale: string) {
  if (!value || Number.isNaN(value.getTime())) return '—';
  return value.toLocaleDateString(locale, { month: 'short', year: 'numeric' });
}

function formatDateTime(value: Date | null, locale: string) {
  if (!value || Number.isNaN(value.getTime())) return '—';
  return value.toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function estimateTransitDates(
  planet: Planet,
  now: Date,
  percentThroughSign: number
): { start: Date; end: Date } {
  const totalDays = AVG_DAYS_PER_SIGN[planet] ?? 30;
  const start = new Date(now.getTime() - (percentThroughSign / 100) * totalDays * DAY_MS);
  const end = new Date(start.getTime() + totalDays * DAY_MS);
  return { start, end };
}

function formatDayCount(value: number) {
  const days = Math.max(0, Math.round(value));
  if (days < 30) return `${days}d`;
  const months = Math.round(days / 30);
  return `~${months}mo`;
}

function getPlanetGradient(planetKey?: string): GradientTuple {
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

function formatCountdown(totalSeconds: number) {
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(clamped / 60);
  const seconds = clamped % 60;
  return `${minutes}m ${seconds.toString().padStart(2, '0')}s`;
}

function mapPlanetKeyToPlanet(planetKey: string | undefined): Planet | null {
  if (!planetKey) return null;
  const normalized = planetKey.toLowerCase();
  if (normalized === 'sun') return 'Sun';
  if (normalized === 'moon') return 'Moon';
  if (normalized === 'mars') return 'Mars';
  if (normalized === 'mercury') return 'Mercury';
  if (normalized === 'jupiter') return 'Jupiter';
  if (normalized === 'venus') return 'Venus';
  if (normalized === 'saturn') return 'Saturn';
  return null;
}

/**
 * Derive element from zodiac key when elementKey is not in transit data
 */
function getElementFromZodiacKey(zodiacKey: string | undefined): Element | null {
  if (!zodiacKey) return null;
  const normalized = zodiacKey.toLowerCase();
  
  // Fire signs
  if (['aries', 'leo', 'sagittarius'].includes(normalized)) return 'fire';
  // Earth signs
  if (['taurus', 'virgo', 'capricorn'].includes(normalized)) return 'earth';
  // Air signs
  if (['gemini', 'libra', 'aquarius'].includes(normalized)) return 'air';
  // Water signs
  if (['cancer', 'scorpio', 'pisces'].includes(normalized)) return 'water';
  
  return null;
}

export default function PlanetTransitDetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t, tSafe, language } = useLanguage();
  const { profile } = useProfile();
  const params = useLocalSearchParams();

  const detailsType = (params.type as DetailsType) || 'transit';
  const payload = params.payload;
  const isPersonalTransit = params.isPersonal === 'true';

  const transitPayload = useMemo(
    () => safeJsonParse<PlanetTransitInfo | LegacyPlanetTransitInfo>(payload),
    [payload]
  );
  const nextDayPayload = useMemo(() => safeJsonParse<NextDayPayload>(payload), [payload]);
  const [transitState, setTransitState] = useState<PlanetTransitInfo | LegacyPlanetTransitInfo | null>(
    transitPayload
  );
  const [refreshing, setRefreshing] = useState(false);
  const orbScale = useRef(new Animated.Value(0.92)).current;
  const [showWhy, setShowWhy] = useState(false);
  const [expandedMethod, setExpandedMethod] = useState<number | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<ExpandableSection, boolean>>({
    duration: true,
    personalized: true,
    guidance: false,
  });
  
  // Fetch all planet transits for the comprehensive view
  const [allTransits, setAllTransits] = useState<AllPlanetTransits | null>(null);
  const [loadingAllTransits, setLoadingAllTransits] = useState(true);

  const toggleSection = (section: ExpandableSection) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const transitData = (transitState ?? transitPayload) as LegacyPlanetTransitInfo | PlanetTransitInfo | null;
  const isLegacyTransit = (data: LegacyPlanetTransitInfo | PlanetTransitInfo | null): data is LegacyPlanetTransitInfo =>
    !!data && 'signDegree' in data;

  const contextElement: Element | null = useMemo(() => {
    if (detailsType === 'transit') {
      const transit = transitState ?? transitPayload;
      // Try elementKey first, fallback to deriving from zodiacKey
      return (transit?.elementKey as Element | undefined) ?? 
             getElementFromZodiacKey(transit?.zodiacKey) ?? 
             null;
    }
    return (nextDayPayload?.element as Element | undefined) ?? null;
  }, [detailsType, transitState, transitPayload, nextDayPayload]);

  const userElement = (profile.derived?.element as Element | undefined) ?? null;
  const safeUserElement = userElement ?? 'earth';
  const safeContextElement = contextElement ?? 'earth';
  const userZodiacKey = useMemo(
    () =>
      resolveUserZodiacKey({
        burjIndex: profile.derived?.burjIndex,
        burj: profile.derived?.burj,
      }),
    [profile.derived?.burjIndex, profile.derived?.burj]
  );

  const harmony: HarmonyLevel | null =
    contextElement && userElement ? getHarmonyLevel(userElement, contextElement) : null;

  const accent = contextElement ? ElementAccents[contextElement] : ElementAccents.earth;
  const resonancePalette = useMemo(() => getResonancePalette(harmony, accent), [harmony, accent]);

  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const countdownText = useMemo(() => {
    if (detailsType !== 'transit' || !(transitState ?? transitPayload)?.nextHourStartTime) return null;
    const next = new Date((transitState ?? transitPayload)?.nextHourStartTime as any);
    const diffSeconds = Math.floor((next.getTime() - now.getTime()) / 1000);
    return formatCountdown(diffSeconds);
  }, [detailsType, transitState, transitPayload, now]);

  const signProgress = useMemo(() => {
    const data = (transitState ?? transitPayload) as LegacyPlanetTransitInfo | PlanetTransitInfo | null;
    if (!isLegacyTransit(data) || typeof data.signDegree !== 'number') return null;
    const degree = data.signDegree + (data.signMinute ?? 0) / 60;
    const percent = Math.min(100, Math.max(0, (degree / 30) * 100));
    const degreeLabel = `${Math.floor(degree)}° ${String(data.signMinute ?? 0).padStart(2, '0')}′`;
    return { percent, degreeLabel };
  }, [transitState, transitPayload]);


  const updatedAtLabel = useMemo(() => {
    const data = (transitState ?? transitPayload) as LegacyPlanetTransitInfo | PlanetTransitInfo | null;
    if (!data?.updatedAt) return '—';
    const updatedAt = new Date(data.updatedAt as any);
    return formatDateTime(updatedAt, language);
  }, [transitState, transitPayload, language]);

  const sourceLabel = useMemo(() => {
    const data = (transitState ?? transitPayload) as LegacyPlanetTransitInfo | PlanetTransitInfo | null;
    const source = (data as any)?.source as LegacyPlanetTransitInfo['source'] | undefined;
    if (source === 'ephemeris') return t('screens.planetTransit.dataSource.api');
    if (source === 'cached') return t('screens.planetTransit.dataSource.cached');
    if (source === 'fallback') return t('screens.planetTransit.dataSource.cached');
    return t('common.unknown');
  }, [transitState, transitPayload, t]);

  const handleRefresh = async () => {
    if (detailsType !== 'transit') return;
    const planetKey = (transitState ?? transitPayload)?.planetKey;
    const planet = mapPlanetKeyToPlanet(planetKey);
    if (!planet) return;
    try {
      setRefreshing(true);
      const fresh = await getTransit(planet);
      setTransitState(adaptTransitToLegacyFormat(fresh));
    } finally {
      setRefreshing(false);
    }
  };

  const title = detailsType === 'transit' ? t('screens.planetTransit.title') : t('home.planetTransitDetails.title');
  
  // Transit type labels for personal vs cosmic weather
  const transitTypeLabel = useMemo(() => {
    if (detailsType !== 'transit') return null;
    if (isPersonalTransit) {
      return language === 'ar' ? 'في برجك' : language === 'fr' ? 'Dans ton signe' : 'In Your Sign';
    } else {
      return language === 'ar' ? 'الطقس الكوني' : language === 'fr' ? 'Météo cosmique' : 'Cosmic Weather';
    }
  }, [detailsType, isPersonalTransit, language]);
  
  const explainer =
    detailsType === 'transit'
      ? t('screens.planetTransit.explanation')
      : t('home.planetTransitDetails.explainers.tomorrowRuler');
  const personalizationLine =
    detailsType === 'transit'
      ? t('screens.planetTransit.personalizedNote')
      : t('home.planetTransitDetails.subtitleNextDay');

  const primaryCardTitle =
    detailsType === 'transit'
      ? t('screens.planetTransit.currentTransit')
      : t('home.planetTransitDetails.sections.tomorrowRuler');

  const transitDates = useMemo(() => {
    const data = (transitState ?? transitPayload) as LegacyPlanetTransitInfo | PlanetTransitInfo | null;
    if (!data) return { start: null, end: null, estimated: true };
    const start = isLegacyTransit(data) && data.transitStartDate ? new Date(data.transitStartDate as any) : null;
    const end = isLegacyTransit(data) && data.transitEndDate ? new Date(data.transitEndDate as any) : null;
    if (start && end) return { start, end, estimated: false };

    const planet = mapPlanetKeyToPlanet(data.planetKey) ?? 'Sun';
    const percent = signProgress?.percent ?? 0;
    const fallback = estimateTransitDates(planet, now, percent);
    return { start: fallback.start, end: fallback.end, estimated: true };
  }, [transitState, transitPayload, signProgress, now]);

  const durationStats = useMemo(() => {
    if (!transitDates.start || !transitDates.end) return null;
    const totalDays = (transitDates.end.getTime() - transitDates.start.getTime()) / DAY_MS;
    const elapsedDays = (now.getTime() - transitDates.start.getTime()) / DAY_MS;
    const remainingDays = (transitDates.end.getTime() - now.getTime()) / DAY_MS;
    return {
      total: formatDayCount(totalDays),
      elapsed: formatDayCount(elapsedDays),
      remaining: formatDayCount(remainingDays),
    };
  }, [transitDates, now]);

  const degreePhase = useMemo(() => {
    if (!signProgress) return null;
    const percent = signProgress.percent;
    const phase = percent < 33.4 ? 'early' : percent < 66.7 ? 'middle' : 'late';
    return { percent: Math.round(percent), phase };
  }, [signProgress]);

  const focusPills = useMemo(
    () => [
      t('screens.planetTransit.focus.communication'),
      t('screens.planetTransit.focus.patience'),
      t('screens.planetTransit.focus.reflection'),
    ],
    [t]
  );

  const balancingMethods = useMemo<BalancingMethod[]>(() => {
    if (!userElement || !contextElement) return [];
    const methods: BalancingMethod[] = [];

    if (harmony === 'challenging') {
      methods.push({
        type: 'divine_name',
        title: t('screens.planetTransit.balancing.methods.latif.title'),
        titleArabic: t('screens.planetTransit.balancing.methods.latif.titleArabic'),
        instruction: t('screens.planetTransit.balancing.methods.latif.instruction'),
        count: 129,
        numerology: t('screens.planetTransit.balancing.methods.latif.numerology'),
        bestTime: t('screens.planetTransit.balancing.methods.latif.bestTime'),
        source: t('screens.planetTransit.balancing.methods.latif.source'),
      });
      methods.push({
        type: 'divine_name',
        title: t('screens.planetTransit.balancing.methods.halim.title'),
        titleArabic: t('screens.planetTransit.balancing.methods.halim.titleArabic'),
        instruction: t('screens.planetTransit.balancing.methods.halim.instruction'),
        count: 88,
        numerology: t('screens.planetTransit.balancing.methods.halim.numerology'),
        bestTime: t('screens.planetTransit.balancing.methods.halim.bestTime'),
        source: t('screens.planetTransit.balancing.methods.halim.source'),
      });
      methods.push({
        type: 'prayer',
        title: t('screens.planetTransit.balancing.methods.hajah.title'),
        titleArabic: t('screens.planetTransit.balancing.methods.hajah.titleArabic'),
        instruction: t('screens.planetTransit.balancing.methods.hajah.instruction'),
        bestTime: t('screens.planetTransit.balancing.methods.hajah.bestTime'),
        source: t('screens.planetTransit.balancing.methods.hajah.source'),
      });
      methods.push({
        type: 'letter_sequence',
        title: t('screens.planetTransit.balancing.methods.letters.title'),
        titleArabic: t('screens.planetTransit.balancing.methods.letters.titleArabic'),
        instruction: t('screens.planetTransit.balancing.methods.letters.instruction'),
        bestTime: t('screens.planetTransit.balancing.methods.letters.bestTime'),
        source: t('screens.planetTransit.balancing.methods.letters.source'),
      });
    }

    if (harmony === 'supportive' || harmony === 'harmonious') {
      methods.push({
        type: 'divine_name',
        title: t('screens.planetTransit.balancing.methods.mubin.title'),
        titleArabic: t('screens.planetTransit.balancing.methods.mubin.titleArabic'),
        instruction: t('screens.planetTransit.balancing.methods.mubin.instruction'),
        count: 102,
        numerology: t('screens.planetTransit.balancing.methods.mubin.numerology'),
        bestTime: t('screens.planetTransit.balancing.methods.mubin.bestTime'),
        source: t('screens.planetTransit.balancing.methods.mubin.source'),
      });
      methods.push({
        type: 'dhikr',
        title: t('screens.planetTransit.balancing.methods.shukr.title'),
        titleArabic: t('screens.planetTransit.balancing.methods.shukr.titleArabic'),
        instruction: t('screens.planetTransit.balancing.methods.shukr.instruction'),
        count: 100,
        bestTime: t('screens.planetTransit.balancing.methods.shukr.bestTime'),
        source: t('screens.planetTransit.balancing.methods.shukr.source'),
      });
    }

    if (harmony === 'neutral') {
      methods.push({
        type: 'divine_name',
        title: t('screens.planetTransit.balancing.methods.hakim.title'),
        titleArabic: t('screens.planetTransit.balancing.methods.hakim.titleArabic'),
        instruction: t('screens.planetTransit.balancing.methods.hakim.instruction'),
        count: 78,
        numerology: t('screens.planetTransit.balancing.methods.hakim.numerology'),
        bestTime: t('screens.planetTransit.balancing.methods.hakim.bestTime'),
        source: t('screens.planetTransit.balancing.methods.hakim.source'),
      });
    }

    methods.push({
      type: 'dhikr',
      title: t('screens.planetTransit.balancing.methods.istighfar.title'),
      titleArabic: t('screens.planetTransit.balancing.methods.istighfar.titleArabic'),
      instruction: t('screens.planetTransit.balancing.methods.istighfar.instruction'),
      count: 70,
      bestTime: t('screens.planetTransit.balancing.methods.istighfar.bestTime'),
      source: t('screens.planetTransit.balancing.methods.istighfar.source'),
    });
    methods.push({
      type: 'dhikr',
      title: t('screens.planetTransit.balancing.methods.salawat.title'),
      titleArabic: t('screens.planetTransit.balancing.methods.salawat.titleArabic'),
      instruction: t('screens.planetTransit.balancing.methods.salawat.instruction'),
      count: 100,
      bestTime: t('screens.planetTransit.balancing.methods.salawat.bestTime'),
      source: t('screens.planetTransit.balancing.methods.salawat.source'),
    });

    return methods;
  }, [t, harmony, userElement, contextElement]);

  const bestForText = harmony ? t(`home.planetTransitDetails.harmony.${harmony}.bestFor`) : '';
  const avoidText = harmony ? t(`home.planetTransitDetails.harmony.${harmony}.avoid`) : '';
  const { label: bestForLabel, body: bestForBody } = useMemo(() => splitLabeledText(bestForText), [bestForText]);
  const { label: avoidLabel, body: avoidBody } = useMemo(() => splitLabeledText(avoidText), [avoidText]);

  const historyDates = useMemo(() => {
    const data = (transitState ?? transitPayload) as LegacyPlanetTransitInfo | PlanetTransitInfo | null;
    const planet = mapPlanetKeyToPlanet(data?.planetKey) ?? 'Sun';
    const avgDays = AVG_DAYS_PER_SIGN[planet] ?? 30;
    if (!transitDates.start || !transitDates.end) return null;
    const prevStart = new Date(transitDates.start.getTime() - avgDays * DAY_MS);
    const prevEnd = new Date(transitDates.start.getTime());
    const nextStart = new Date(transitDates.end.getTime());
    const nextEnd = new Date(transitDates.end.getTime() + avgDays * DAY_MS);
    return { prevStart, prevEnd, nextStart, nextEnd };
  }, [transitDates, transitState, transitPayload]);
  const adjacent = getAdjacentSigns((transitState ?? transitPayload)?.zodiacKey as any);

  const influenceTypeLabel = useMemo(() => {
    const labels = {
      en: { universal: 'Universal', personal: 'Personal', immediate: 'Immediate' },
      fr: { universal: 'Universel', personal: 'Personnel', immediate: 'Immédiat' },
      ar: { universal: 'عام', personal: 'شخصي', immediate: 'فوري' },
    } as const;
    return labels[language as 'en' | 'fr' | 'ar'];
  }, [language]);

  const getDegreePhaseLabel = useCallback(
    (stage: 'entry' | 'stabilization' | 'completion') => {
      if (language === 'fr') {
        return stage === 'entry'
          ? '🔵 Phase d’entrée'
          : stage === 'stabilization'
            ? '🟢 Phase de pointe'
            : '🟠 Phase de clôture';
      }
      if (language === 'ar') {
        return stage === 'entry'
          ? '🔵 مرحلة الدخول'
          : stage === 'stabilization'
            ? '🟢 مرحلة الذروة'
            : '🟠 مرحلة الإغلاق';
      }
      return stage === 'entry' ? '🔵 Entry Phase' : stage === 'stabilization' ? '🟢 Peak Phase' : '🟠 Closing Phase';
    },
    [language]
  );

  const getDegreeStageBadgeLabel = useCallback(
    (stage: 'entry' | 'stabilization' | 'completion') => {
      if (language === 'fr') {
        return stage === 'entry' ? 'Entrée' : stage === 'stabilization' ? 'Pic' : 'Clôture';
      }
      if (language === 'ar') {
        return stage === 'entry' ? 'دخول' : stage === 'stabilization' ? 'ذروة' : 'إغلاق';
      }
      return stage === 'entry' ? 'Entry' : stage === 'stabilization' ? 'Peak' : 'Closing';
    },
    [language]
  );

  const getElementalResonanceLabel = useCallback(
    (resonance: 'harmonious' | 'supportive' | 'neutral' | 'challenging') => {
      if (language === 'fr') {
        return resonance === 'harmonious'
          ? 'Harmonieux'
          : resonance === 'supportive'
            ? 'Supportif'
            : resonance === 'neutral'
              ? 'Neutre'
              : 'Transformateur';
      }
      if (language === 'ar') {
        return resonance === 'harmonious'
          ? 'منسجم'
          : resonance === 'supportive'
            ? 'داعمة'
            : resonance === 'neutral'
              ? 'متوازن'
              : 'تحويلي';
      }
      return resonance === 'harmonious'
        ? 'Harmonious'
        : resonance === 'supportive'
          ? 'Supportive'
          : resonance === 'neutral'
            ? 'Neutral'
            : 'Challenging';
    },
    [language]
  );
  
  // Calculate personalized planetary influence
  const personalizedInfluence: PersonalizedInfluence | null = useMemo(() => {
    if (detailsType !== 'transit') return null;
    const data = (transitState ?? transitPayload) as LegacyPlanetTransitInfo | PlanetTransitInfo | null;
    if (!data) return null;
    
    const planet = mapPlanetKeyToPlanet(data.planetKey);
    if (!planet) return null; // Can't calculate without valid planet
    
    // Use safe defaults when user data is missing
    const transitElement = contextElement ?? 'earth';
    const userElem = userElement ?? 'earth';
    const degree = isLegacyTransit(data) ? (data.signDegree ?? 0) : 0;
    
    // ALWAYS return influence - service handles all cases including non-personal transits
    return getPersonalizedInfluence(
      planet,
      degree,
      transitElement,
      userElem,
      isPersonalTransit,
      language as any
    );
  }, [detailsType, transitState, transitPayload, contextElement, userElement, isPersonalTransit, language]);

  useEffect(() => {
    Animated.timing(orbScale, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [orbScale]);
  
  // Load all transits on mount
  useEffect(() => {
    const loadAllTransits = async () => {
      try {
        setLoadingAllTransits(true);
        const transits = await getAllTransits();
        setAllTransits(transits);
      } catch (error) {
        if (__DEV__) {
          console.error('[PlanetTransitDetails] Error loading all transits:', error);
        }
      } finally {
        setLoadingAllTransits(false);
      }
    };
    
    loadAllTransits();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['rgba(30, 20, 40, 1)', 'rgba(20, 20, 40, 0.98)', 'rgba(15, 15, 35, 0.95)']}
        style={[styles.headerGradient, { paddingTop: insets.top }]}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
            <BlurView intensity={24} tint="dark" style={styles.buttonBlur}>
              <Ionicons name="chevron-back" size={22} color="#fff" />
            </BlurView>
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>{title}</Text>
            <View style={styles.headerSubtitleRow}>
              <Text style={styles.headerSubtitle}>
                {detailsType === 'transit' ? t('screens.planetTransit.headerSubtitle') : primaryCardTitle}
              </Text>
              {transitTypeLabel && (
                <View style={[styles.transitTypeBadge, { backgroundColor: isPersonalTransit ? 'rgba(76, 175, 80, 0.2)' : 'rgba(100, 149, 237, 0.2)' }]}>
                  <Text style={[styles.transitTypeBadgeText, { color: isPersonalTransit ? '#4CAF50' : '#6495ED' }]}>
                    {transitTypeLabel}
                  </Text>
                </View>
              )}
            </View>
          </View>
          {detailsType === 'transit' ? (
            <TouchableOpacity
              onPress={handleRefresh}
              style={[styles.headerButton, refreshing && styles.refreshButtonDisabled]}
              disabled={refreshing}
            >
              <BlurView intensity={24} tint="dark" style={styles.buttonBlur}>
                <Ionicons name="refresh" size={18} color="#fff" />
              </BlurView>
            </TouchableOpacity>
          ) : (
            <View style={styles.headerButtonPlaceholder} />
          )}
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {detailsType === 'transit' && transitData ? (
          <>
            <View style={styles.heroContainer}>
              <GlassCard style={styles.planetCard}>
                <View style={styles.planetOrbContainer}>
                  <View style={[styles.planetGlow, { backgroundColor: accent.primary }]} />
                  <LinearGradient
                    colors={getPlanetGradient(transitData.planetKey)}
                    style={styles.planetOrbLarge}
                  >
                    <Animated.View style={{ transform: [{ scale: orbScale }] }}>
                      <Text style={styles.planetSymbolLarge}>{transitData.planetSymbol}</Text>
                    </Animated.View>
                  </LinearGradient>
                </View>
                <Text style={styles.planetNameHero}>{transitData.planetName}</Text>
                <Text style={styles.planetArabicHero}>{transitData.planetNameAr}</Text>
              </GlassCard>

              <View style={styles.connectorContainer}>
                <View style={styles.connectorLine} />
                <Text style={styles.connectorText}>{t('screens.planetTransit.in').toUpperCase()}</Text>
                <View style={styles.connectorLine} />
              </View>

              <GlassCard style={styles.signCard}>
                <View style={styles.signBadge}>
                  <View style={[styles.signIconContainer, { backgroundColor: `${accent.primary}20` }]}> 
                    <Text style={styles.zodiacSymbolLarge}>{transitData.zodiacSymbol}</Text>
                  </View>
                  <View style={styles.signTextContainer}>
                    <Text style={styles.signNameHero} numberOfLines={1}>
                      {transitData.zodiacKey ? t(`zodiac.${transitData.zodiacKey}`) : t('common.unknown')}
                    </Text>
                    <Text style={styles.signArabicHero} numberOfLines={1}>
                      {transitData.zodiacKey ? t(`zodiac.${transitData.zodiacKey}Arabic`) : ''}
                    </Text>
                  </View>
                </View>
                <View style={[styles.elementTag, { borderColor: `${accent.primary}30`, backgroundColor: `${accent.primary}15` }]}> 
                  <Ionicons name={getElementIconName(contextElement ?? 'earth')} size={12} color={accent.primary} />
                  <Text style={[styles.elementText, { color: accent.primary }]}> 
                    {tSafe(`common.elements.${contextElement}`, toTitleCase(contextElement ?? 'earth')).toUpperCase()} SIGN
                  </Text>
                </View>
              </GlassCard>
            </View>

            <GlassCard style={styles.infoStrip}>
              <Text style={styles.explainerText}>{explainer}</Text>
              <Text style={styles.explainerMeta}>{personalizationLine}</Text>
            </GlassCard>

            {detailsType === 'transit' && harmony ? (
              <View style={[styles.impactBanner, { borderColor: `${resonancePalette.primary}40` }]}> 
                <BlurView intensity={24} tint="dark" style={styles.impactBlur}>
                  <View style={styles.impactRow}>
                    <View style={[styles.impactIcon, { backgroundColor: `${resonancePalette.primary}20` }]}> 
                      <Ionicons name="sparkles" size={20} color={resonancePalette.primary} />
                    </View>
                    <View style={styles.impactText}>
                      <Text style={styles.impactLabel}>{t('screens.planetTransit.quickImpact.title')}</Text>
                      <Text style={[styles.impactValue, { color: resonancePalette.primary }]}> 
                        {t(`home.planetTransitDetails.harmony.${harmony}.label`)}
                      </Text>
                      <Text style={styles.impactArabic}>
                        {t(`screens.planetTransit.resonance.arabicTerms.${harmony}`)}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={DarkTheme.textTertiary} />
                  </View>
                </BlurView>
                <Text style={styles.bodyText}>
                  {t(`home.planetTransitDetails.harmony.${harmony}.description`, {
                    userElement: tSafe(`common.elements.${userElement}`, toTitleCase(safeUserElement)).toLowerCase(),
                    contextElement: tSafe(`common.elements.${contextElement}`, toTitleCase(safeContextElement)).toLowerCase(),
                  })}
                </Text>
                <TouchableOpacity
                  style={styles.whyToggle}
                  onPress={() => {
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                    setShowWhy((prev) => !prev);
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons name={showWhy ? 'chevron-up' : 'chevron-down'} size={16} color={DarkTheme.textSecondary} />
                  <Text style={styles.whyToggleText}>
                    {showWhy ? t('screens.planetTransit.why.hide') : t('screens.planetTransit.why.show')}
                  </Text>
                </TouchableOpacity>
                {showWhy ? (
                  <View style={styles.whyPanel}>
                    <Text style={styles.whyTitle}>{t('screens.planetTransit.why.title')}</Text>
                    <Text style={styles.bodyText}>{t('screens.planetTransit.why.body')}</Text>
                  </View>
                ) : null}
                <View style={styles.focusRow}>
                  <Text style={styles.focusTitle}>{t('screens.planetTransit.focus.title')}</Text>
                  <View style={styles.focusPills}>
                    {focusPills.map((pill) => (
                      <View key={pill} style={styles.focusPill}>
                        <Text style={styles.focusPillText}>{pill}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            ) : null}

            <GlassCard style={styles.durationCard}>
              <TouchableOpacity style={styles.expandableHeader} onPress={() => toggleSection('duration')}>
                <View style={styles.cardHeader}>
                  <Ionicons name="calendar" size={18} color={accent.primary} />
                  <Text style={styles.cardTitle}>{t('screens.planetTransit.duration.title')}</Text>
                </View>
                <Ionicons name={expandedSections.duration ? 'chevron-up' : 'chevron-down'} size={18} color={DarkTheme.textSecondary} />
              </TouchableOpacity>

              {expandedSections.duration && (
                <View style={styles.timelineContent}>
                  <View style={styles.timelineRowWide}>
                    <View style={styles.milestone}>
                      <View style={styles.milestoneMarker}>
                        <Ionicons name="arrow-forward-circle" size={18} color={accent.primary} />
                      </View>
                      <Text style={styles.milestoneDate}>{formatMonthYear(transitDates.start, language)}</Text>
                      <Text style={styles.milestoneLabel}>{t('screens.planetTransit.duration.enteredSign')}</Text>
                    </View>
                    <View style={styles.progressContainer}>
                      <View style={styles.progressTrack}>
                        <LinearGradient
                          colors={[accent.primary, resonancePalette.light]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={[styles.progressFillWide, { width: `${signProgress?.percent ?? 0}%` }]}
                        />
                        <View style={[styles.nowMarker, { left: `${signProgress?.percent ?? 0}%` }]}>
                          <View style={styles.nowMarkerDot} />
                          <Text style={styles.nowLabel}>{t('screens.planetTransit.timeline.now')}</Text>
                          <Text style={styles.nowDate}>{formatMonthYear(new Date(), language)}</Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.milestone}>
                      <View style={styles.milestoneMarker}>
                        <Ionicons name="arrow-back-circle" size={18} color="#FF6B35" />
                      </View>
                      <Text style={styles.milestoneDate}>{formatMonthYear(transitDates.end, language)}</Text>
                      <Text style={styles.milestoneLabel}>{t('screens.planetTransit.duration.leavesSign')}</Text>
                    </View>
                  </View>

                  {durationStats ? (
                    <View style={styles.statsGrid}>
                      <View style={styles.statCard}>
                        <Text style={styles.statValue}>{durationStats.elapsed}</Text>
                        <Text style={styles.statLabel}>{t('screens.planetTransit.durationStats.elapsed')}</Text>
                      </View>
                      <View style={styles.statCard}>
                        <Text style={styles.statValue}>{durationStats.remaining}</Text>
                        <Text style={styles.statLabel}>{t('screens.planetTransit.durationStats.remaining')}</Text>
                      </View>
                      <View style={styles.statCard}>
                        <Text style={styles.statValue}>{durationStats.total}</Text>
                        <Text style={styles.statLabel}>{t('screens.planetTransit.durationStats.total')}</Text>
                      </View>
                    </View>
                  ) : null}
                  {transitDates.estimated ? (
                    <Text style={styles.infoHint}>{t('screens.planetTransit.history.estimated')}</Text>
                  ) : null}
                </View>
              )}
            </GlassCard>

            {signProgress && degreePhase ? (
              <GlassCard style={styles.degreeCard}>
                <View style={styles.cardHeader}>
                  <Ionicons name="navigate" size={18} color={accent.primary} />
                  <Text style={styles.cardTitle}>{t('screens.planetTransit.degree.title')}</Text>
                </View>
                <View style={styles.degreeContent}>
                  <View style={styles.circularProgress}>
                    <Svg width={140} height={140}>
                      <Circle cx={70} cy={70} r={56} stroke="rgba(255, 255, 255, 0.1)" strokeWidth={12} fill="none" />
                      <Circle
                        cx={70}
                        cy={70}
                        r={56}
                        stroke={accent.primary}
                        strokeWidth={12}
                        fill="none"
                        strokeDasharray={`${(signProgress.percent / 100) * 351.86} 351.86`}
                        strokeLinecap="round"
                        transform="rotate(-90 70 70)"
                      />
                    </Svg>
                    <View style={styles.circularCenter}>
                      <Text style={styles.degreeValue}>{signProgress.degreeLabel}</Text>
                      <Text style={styles.degreeTotal}>30°</Text>
                      <Text style={styles.degreePercent}>{degreePhase.percent}%</Text>
                    </View>
                  </View>
                  <Text style={styles.bodyText}>
                    {t('screens.planetTransit.degree.explanation', {
                      degree: signProgress.degreeLabel,
                      percent: degreePhase.percent,
                    })}
                  </Text>
                  <View style={styles.phaseRow}>
                    <View style={[styles.phaseBadge, degreePhase.phase === 'early' ? styles.phaseActive : styles.phaseInactive]}>
                      <Text style={styles.phaseText}>{t('screens.planetTransit.degree.phases.early')}</Text>
                    </View>
                    <View style={[styles.phaseBadge, degreePhase.phase === 'middle' ? styles.phaseActive : styles.phaseInactive]}>
                      <Text style={styles.phaseText}>{t('screens.planetTransit.degree.phases.middle')}</Text>
                    </View>
                    <View style={[styles.phaseBadge, degreePhase.phase === 'late' ? styles.phaseActive : styles.phaseInactive]}>
                      <Text style={styles.phaseText}>{t('screens.planetTransit.degree.phases.late')}</Text>
                    </View>
                  </View>
                </View>
              </GlassCard>
            ) : null}

            <GlassCard style={styles.personalizedCard}>
              <TouchableOpacity style={styles.expandableHeader} onPress={() => toggleSection('personalized')}>
                <View style={styles.cardHeader}>
                  <Ionicons name="person" size={18} color={accent.primary} />
                  <Text style={styles.cardTitle}>{t('screens.planetTransit.personalized.title')}</Text>
                </View>
                <Ionicons name={expandedSections.personalized ? 'chevron-up' : 'chevron-down'} size={18} color={DarkTheme.textSecondary} />
              </TouchableOpacity>

              {expandedSections.personalized ? (
                <PremiumSection
                  featureId="personalGuidance"
                  title={t('premiumSections.personalizedImpact.title')}
                  description={t('premiumSections.personalizedImpact.description')}
                  icon="🎯"
                >
                  {/* Transit Type Context Banner */}
                  <View style={[styles.transitContextBanner, { 
                    backgroundColor: isPersonalTransit ? 'rgba(76, 175, 80, 0.1)' : 'rgba(100, 149, 237, 0.1)',
                    borderColor: isPersonalTransit ? 'rgba(76, 175, 80, 0.3)' : 'rgba(100, 149, 237, 0.3)',
                  }]}>
                    <Ionicons 
                      name={isPersonalTransit ? 'star' : 'globe-outline'} 
                      size={18} 
                      color={isPersonalTransit ? '#4CAF50' : '#6495ED'} 
                    />
                    <View style={styles.transitContextTextContainer}>
                      <Text style={[styles.transitContextTitle, { color: isPersonalTransit ? '#4CAF50' : '#6495ED' }]}>
                        {isPersonalTransit 
                          ? (language === 'ar' ? 'عبور شخصي' : language === 'fr' ? 'Transit Personnel' : 'Personal Transit')
                          : (language === 'ar' ? 'طقس كوني عام' : language === 'fr' ? 'Météo Cosmique' : 'Cosmic Weather')}
                      </Text>
                      <Text style={styles.transitContextDesc}>
                        {isPersonalTransit 
                          ? (language === 'ar' 
                              ? 'هذا الكوكب يعبر برجك مباشرة - تأثيره عليك أقوى وأكثر شخصية.'
                              : language === 'fr' 
                              ? 'Cette planète traverse votre signe - son influence sur vous est plus forte et personnelle.'
                              : 'This planet is transiting your sign directly - its influence on you is stronger and more personal.')
                          : (language === 'ar' 
                              ? 'لا يوجد كوكب في برجك حالياً. هذا العبور يؤثر على الجميع بشكل عام.'
                              : language === 'fr' 
                              ? 'Aucune planète dans votre signe actuellement. Ce transit affecte tout le monde de manière générale.'
                              : 'No planet in your sign currently. This transit affects everyone generally.')}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.elementComparison}>
                    <View style={styles.elementCircle}>
                      <LinearGradient
                        colors={getElementGradient(userElement ?? 'earth')}
                        style={styles.elementGradientCircle}
                      >
                        <Ionicons name={getElementIconName(userElement ?? 'earth')} size={32} color="#fff" />
                      </LinearGradient>
                      <Text style={styles.elementCircleLabel}>{t('common.you').toUpperCase()}</Text>
                      <Text style={styles.elementCircleValue}>
                        {userElement ? tSafe(`common.elements.${userElement}`, toTitleCase(userElement)) : t('common.unknown')}
                      </Text>
                      <Text style={styles.elementCircleArabic}>{tSafe(`elements.${userElement}Arabic`, '')}</Text>
                    </View>
                    <View style={styles.vsContainer}>
                      <Ionicons name="sparkles" size={28} color={resonancePalette.primary} />
                      <Text style={[styles.vsText, { color: resonancePalette.primary }]}>vs</Text>
                    </View>
                    <View style={styles.elementCircle}>
                      <LinearGradient
                        colors={getElementGradient(contextElement ?? 'earth')}
                        style={styles.elementGradientCircle}
                      >
                        <Ionicons name={getElementIconName(contextElement ?? 'earth')} size={32} color="#fff" />
                      </LinearGradient>
                      <Text style={styles.elementCircleLabel}>{t('screens.planetTransit.currentTransit').toUpperCase()}</Text>
                      <Text style={styles.elementCircleValue}>
                        {contextElement ? tSafe(`common.elements.${contextElement}`, toTitleCase(contextElement)) : t('common.unknown')}
                      </Text>
                      <Text style={styles.elementCircleArabic}>{tSafe(`elements.${contextElement}Arabic`, '')}</Text>
                    </View>
                  </View>

                  {harmony ? (
                    <View style={[styles.resonanceCard, { borderColor: resonancePalette.primary }]}> 
                      <Text style={[styles.resonanceLabel, { color: resonancePalette.primary }]}>
                        {t(`home.planetTransitDetails.harmony.${harmony}.label`).toUpperCase()}
                      </Text>
                      <Text style={styles.resonanceDescription}>
                        {t(`home.planetTransitDetails.harmony.${harmony}.description`, {
                          userElement: tSafe(`common.elements.${userElement}`, toTitleCase(safeUserElement)).toLowerCase(),
                          contextElement: tSafe(`common.elements.${contextElement}`, toTitleCase(safeContextElement)).toLowerCase(),
                        })}
                      </Text>
                    </View>
                  ) : (
                    <Text style={styles.bodyText}>{t('home.planetTransitDetails.resonanceNoProfile')}</Text>
                  )}

                  {detailsType === 'transit' && userElement && userZodiacKey ? (
                    <View style={styles.impactPoints}>
                      <View style={styles.impactPoint}>
                        <Ionicons name="water" size={16} color={ElementAccents[userElement].primary} />
                        <Text style={styles.impactPointText}>{t('screens.planetTransit.personalized.point1')}</Text>
                      </View>
                      <View style={styles.impactPoint}>
                        <Ionicons name="flash" size={16} color={accent.primary} />
                        <Text style={styles.impactPointText}>{t('screens.planetTransit.personalized.point2')}</Text>
                      </View>
                      <View style={styles.impactPoint}>
                        <Ionicons name="shield" size={16} color={DarkTheme.textSecondary} />
                        <Text style={styles.impactPointText}>{t('screens.planetTransit.personalized.point3')}</Text>
                      </View>
                    </View>
                  ) : null}
                </PremiumSection>
              ) : null}
            </GlassCard>

            {/* Personalized Planetary Influence Engine - Show at TOP only if personal transit */}
            {personalizedInfluence && isPersonalTransit && (
              <GlassCard style={styles.influenceCard}>
                <View style={styles.cardHeader}>
                  <Ionicons name="planet" size={20} color={getInfluenceTypeColor(personalizedInfluence.influenceType)} />
                  <Text style={styles.cardTitle}>
                    {t('home.planetTransitDetails.influenceEngine.personalInfluence')}
                  </Text>
                </View>

                {/* Influence Type & Scope */}
                <View style={styles.influenceBadges}>
                  <View style={[styles.influenceTypeBadge, { backgroundColor: getInfluenceTypeColor(personalizedInfluence.influenceType) + '20', borderColor: getInfluenceTypeColor(personalizedInfluence.influenceType) + '50' }]}>
                    <Text style={[styles.influenceTypeText, { color: getInfluenceTypeColor(personalizedInfluence.influenceType) }]}>
                      {(influenceTypeLabel?.[personalizedInfluence.influenceType] ?? personalizedInfluence.influenceType).toUpperCase()}
                    </Text>
                  </View>
                  <View style={[styles.degreeStageBadge, { backgroundColor: getDegreeStageColor(personalizedInfluence.degreeStage.stage) + '20', borderColor: getDegreeStageColor(personalizedInfluence.degreeStage.stage) + '50' }]}>
                    <Ionicons name={getDegreeStageIcon(personalizedInfluence.degreeStage.stage) as any} size={14} color={getDegreeStageColor(personalizedInfluence.degreeStage.stage)} />
                    <Text style={[styles.degreeStageText, { color: getDegreeStageColor(personalizedInfluence.degreeStage.stage) }]}>
                      {(language === 'ar'
                        ? getDegreeStageBadgeLabel(personalizedInfluence.degreeStage.stage)
                        : getDegreeStageBadgeLabel(personalizedInfluence.degreeStage.stage).toUpperCase())}
                    </Text>
                  </View>
                </View>

                <Text style={styles.influenceScopeText}>{personalizedInfluence.scope}</Text>

                {/* Collective Impact (Cosmic Weather) - Always visible */}
                <View style={[styles.summaryCard, { borderColor: '#6495ED30' }]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                    <Ionicons name="globe-outline" size={16} color="#6495ED" />
                    <Text style={[styles.summaryTitle, { color: '#6495ED' }]}>
                      {t('home.planetTransitDetails.influenceEngine.collectiveImpact')}
                    </Text>
                  </View>
                  <Text style={styles.summaryText}>{personalizedInfluence.collectiveSummary}</Text>
                </View>

                {/* Personal Relevance - Always visible */}
                <View style={[styles.summaryCard, { borderColor: '#9C27B030' }]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                    <Ionicons name="person-outline" size={16} color="#9C27B0" />
                    <Text style={[styles.summaryTitle, { color: '#9C27B0' }]}>
                      {t('home.planetTransitDetails.influenceEngine.howRelates')}
                    </Text>
                  </View>
                  <Text style={styles.summaryText}>{personalizedInfluence.personalSummary}</Text>
                </View>

                {/* Degree Stage Explanation */}
                <View style={[styles.degreeExplanationCard, { borderColor: getDegreeStageColor(personalizedInfluence.degreeStage.stage) + '30' }]}>
                  <Text style={styles.degreeStageDescription}>
                    <Text style={{ fontWeight: '700' }}>
                      {getDegreePhaseLabel(personalizedInfluence.degreeStage.stage)}:
                    </Text>
                    {' '}{personalizedInfluence.degreeStage.description}
                  </Text>
                  <Text style={styles.degreeValue}>
                    {Math.floor(personalizedInfluence.degreeStage.degree)}° / 30°
                  </Text>
                </View>

                {/* Elemental Resonance */}
                <View style={[styles.resonanceCard, { borderColor: resonancePalette.primary }]}>
                  <Text style={[styles.resonanceLabel, { color: resonancePalette.primary }]}>
                    {(language === 'ar'
                      ? getElementalResonanceLabel(personalizedInfluence.elementalResonance)
                      : getElementalResonanceLabel(personalizedInfluence.elementalResonance).toUpperCase())}{' '}
                    {(language === 'fr' ? 'RÉSONANCE' : language === 'ar' ? 'رنين' : 'RESONANCE')}
                  </Text>
                  <Text style={styles.resonanceDescription}>
                    {personalizedInfluence.resonanceExplanation}
                  </Text>
                </View>

                {/* Timing Guidance */}
                <Text style={[styles.influenceTimingText, { fontStyle: 'italic' }]}>
                  {personalizedInfluence.personalizedGuidance.timing}
                </Text>

                {/* Premium: Detailed Guidance */}
                <PremiumSection
                  featureId="personalGuidance"
                  title={t('home.planetTransitDetails.influenceEngine.detailedGuidance')}
                  description={t('home.planetTransitDetails.influenceEngine.guidanceDescription')}
                  icon="🧭"
                >
                  {/* Best For */}
                  <View style={styles.guidanceSection}>
                    <View style={styles.guidanceSectionHeader}>
                      <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                      <Text style={styles.guidanceSectionTitle}>
                        {t('home.planetTransitDetails.influenceEngine.bestForNow')}
                      </Text>
                    </View>
                    {personalizedInfluence.personalizedGuidance.bestFor.map((item, idx) => (
                      <View key={idx} style={styles.guidanceListItem}>
                        <Text style={styles.guidanceBullet}>•</Text>
                        <Text style={styles.guidanceItemText}>{item}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Better to Avoid */}
                  <View style={styles.guidanceSection}>
                    <View style={styles.guidanceSectionHeader}>
                      <Ionicons name="close-circle" size={16} color="#FF6B35" />
                      <Text style={styles.guidanceSectionTitle}>
                        {t('home.planetTransitDetails.influenceEngine.betterToAvoid')}
                      </Text>
                    </View>
                    {personalizedInfluence.personalizedGuidance.avoid.map((item, idx) => (
                      <View key={idx} style={styles.guidanceListItem}>
                        <Text style={styles.guidanceBullet}>•</Text>
                        <Text style={styles.guidanceItemText}>{item}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Reflective Practices */}
                  <View style={styles.guidanceSection}>
                    <View style={styles.guidanceSectionHeader}>
                      <Ionicons name="moon" size={16} color="#9C27B0" />
                      <Text style={styles.guidanceSectionTitle}>
                        {t('home.planetTransitDetails.influenceEngine.reflectivePractices')}
                      </Text>
                    </View>
                    {personalizedInfluence.personalizedGuidance.reflectivePractices.map((item, idx) => (
                      <View key={idx} style={styles.guidanceListItem}>
                        <Text style={styles.guidanceBullet}>•</Text>
                        <Text style={styles.guidanceItemText}>{item}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Disclaimer */}
                  <View style={styles.disclaimerBox}>
                    <Ionicons name="information-circle-outline" size={14} color={DarkTheme.textMuted} />
                    <Text style={styles.disclaimerBoxText}>
                      {t('home.planetTransitDetails.disclaimer')}
                    </Text>
                  </View>
                </PremiumSection>
              </GlassCard>
            )}

            {/* All sections below are Premium - wrapped in PremiumSection */}
            <PremiumSection
              featureId="personalGuidance"
              title={t('premiumSections.personalizedInsights.title')}
              description={t('premiumSections.personalizedInsights.description')}
              icon="🎯"
            >
              <GlassCard style={styles.yourNatureCard}>
                <View style={styles.cardHeader}>
                  <Ionicons name="leaf" size={18} color={accent.primary} />
                  <Text style={styles.cardTitle}>{t('home.planetTransitDetails.sections.yourNature')}</Text>
                </View>
                {userElement ? (
                  <>
                  <Text style={styles.bodyText}>
                    {t('home.planetTransitDetails.yourElement', {
                      element: tSafe(`common.elements.${userElement}`, toTitleCase(userElement)),
                    })}
                  </Text>
                  {userZodiacKey ? (
                    <Text style={styles.bodyText}>
                      {t('home.planetTransitDetails.yourZodiac', {
                        zodiac: formatZodiacWithArabic(userZodiacKey, language as any, {
                          forceBilingual: language !== 'ar',
                          arabicFirst: true,
                          includeGlyph: true,
                        }),
                      })}
                    </Text>
                  ) : null}
                </>
              ) : (
                <>
                  <Text style={styles.bodyText}>{t('home.planetTransitDetails.missingProfile')}</Text>
                  <TouchableOpacity
                    style={[styles.profileButton, { backgroundColor: accent.primary }]}
                    onPress={() => router.push('/profile')}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.profileButtonText}>{t('home.planetTransitDetails.completeProfile')}</Text>
                    <Ionicons name="arrow-forward" size={18} color="#fff" />
                  </TouchableOpacity>
                </>
              )}
            </GlassCard>

            {detailsType === 'transit' ? (
              <GlassCard style={styles.guidanceCard}>
                <TouchableOpacity style={styles.expandableHeader} onPress={() => toggleSection('guidance')}>
                  <View style={styles.cardHeader}>
                    <Ionicons name="compass" size={18} color="#FFD700" />
                    <Text style={styles.cardTitle}>{t('screens.planetTransit.daily.title')}</Text>
                  </View>
                  <Ionicons name={expandedSections.guidance ? 'chevron-up' : 'chevron-down'} size={18} color={DarkTheme.textSecondary} />
                </TouchableOpacity>

                {expandedSections.guidance ? (
                  harmony ? (
                    <View style={styles.guidanceGrid}>
                      <View style={[styles.guidanceBox, styles.bestForBox]}>
                        <View style={styles.guidanceBoxHeader}>
                          <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
                          <Text style={styles.guidanceBoxTitle}>
                            {bestForLabel || t('screens.planetTransit.daily.title')}
                          </Text>
                        </View>
                        <Text style={styles.guidanceItem}>{bestForBody || bestForText}</Text>
                      </View>
                      <View style={[styles.guidanceBox, styles.avoidBox]}>
                        <View style={styles.guidanceBoxHeader}>
                          <Ionicons name="alert-circle" size={18} color="#FF9800" />
                          <Text style={styles.guidanceBoxTitle}>
                            {avoidLabel || t('screens.planetTransit.daily.title')}
                          </Text>
                        </View>
                        <Text style={styles.guidanceItem}>{avoidBody || avoidText}</Text>
                      </View>
                      {/* Personal/Cosmic Impact Note */}
                      <View style={[styles.impactNoteContainer, {
                        backgroundColor: isPersonalTransit ? 'rgba(76, 175, 80, 0.08)' : 'rgba(100, 149, 237, 0.08)',
                        borderColor: isPersonalTransit ? 'rgba(76, 175, 80, 0.2)' : 'rgba(100, 149, 237, 0.2)',
                      }]}>
                        <Ionicons 
                          name={isPersonalTransit ? 'flash' : 'earth'} 
                          size={16} 
                          color={isPersonalTransit ? '#4CAF50' : '#6495ED'} 
                        />
                        <Text style={styles.impactNoteText}>
                          {isPersonalTransit 
                            ? (language === 'ar' 
                                ? 'لأنه عبور شخصي، ستشعر بهذه الطاقات بشكل أقوى. ركز على النمو الشخصي في هذه الفترة.'
                                : language === 'fr' 
                                ? 'Étant un transit personnel, vous ressentirez ces énergies plus intensément. Concentrez-vous sur la croissance personnelle.'
                                : 'Being a personal transit, you\'ll feel these energies more intensely. Focus on personal growth during this period.')
                            : (language === 'ar' 
                                ? 'هذا عبور عام يؤثر على الجميع. ستشعر به بشكل طفيف ولكنه يخلق أجواء عامة مفيدة.'
                                : language === 'fr' 
                                ? 'C\'est un transit général affectant tout le monde. Vous le sentirez légèrement mais il crée une ambiance favorable.'
                                : 'This is a general transit affecting everyone. You\'ll feel it subtly but it creates a helpful collective atmosphere.')}
                        </Text>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.dailyStack}>
                      <View style={styles.dailyItem}>
                        <Text style={styles.dailyLabel}>{t('screens.planetTransit.daily.morning')}</Text>
                        <Text style={styles.bodyText}>{t('screens.planetTransit.daily.morningText')}</Text>
                      </View>
                      <View style={styles.dailyItem}>
                        <Text style={styles.dailyLabel}>{t('screens.planetTransit.daily.afternoon')}</Text>
                        <Text style={styles.bodyText}>{t('screens.planetTransit.daily.afternoonText')}</Text>
                      </View>
                      <View style={styles.dailyItem}>
                        <Text style={styles.dailyLabel}>{t('screens.planetTransit.daily.evening')}</Text>
                        <Text style={styles.bodyText}>{t('screens.planetTransit.daily.eveningText')}</Text>
                      </View>
                    </View>
                  )
                ) : null}
              </GlassCard>
            ) : null}

            {detailsType === 'transit' && userZodiacKey ? (
              <GlassCard style={styles.balancingCard}>
                <View style={styles.cardHeader}>
                  <Ionicons name="shield" size={18} color={accent.primary} />
                  <Text style={styles.cardTitle}>{t('screens.planetTransit.balancing.title')}</Text>
                </View>
                <Text style={styles.cardSubtitle}>{t('screens.planetTransit.balancing.subtitle')}</Text>

                <View style={styles.signComparisonRow}>
                  <View style={styles.signItem}>
                    <Text style={styles.signLabel}>{t('screens.planetTransit.signComparison.yourSign')}</Text>
                    <Text style={styles.signName}>{formatZodiacWithArabic(userZodiacKey, language as any)}</Text>
                  </View>
                  <Ionicons name="swap-horizontal" size={22} color={DarkTheme.textTertiary} />
                  <View style={styles.signItem}>
                    <Text style={styles.signLabel}>{t('screens.planetTransit.signComparison.transitSign')}</Text>
                    <Text style={styles.signName}>
                      {transitData.zodiacKey
                        ? formatZodiacWithArabic(transitData.zodiacKey as any, language as any)
                        : t('common.unknown')}
                    </Text>
                  </View>
                </View>

                <View style={styles.challengeBox}>
                  <Text style={styles.challengeText}>
                    {t('screens.planetTransit.balancing.challenge', {
                      userElement: tSafe(`common.elements.${userElement}`, toTitleCase(safeUserElement)).toLowerCase(),
                      transitElement: tSafe(`common.elements.${contextElement}`, toTitleCase(safeContextElement)).toLowerCase(),
                    })}
                  </Text>
                </View>

                <View style={styles.divider}>
                  <Text style={styles.dividerText}>{t('screens.planetTransit.balancing.methodsLabel')}</Text>
                </View>

                {balancingMethods.map((method, index) => (
                  <TouchableOpacity
                    key={`${method.type}-${method.title}-${index}`}
                    style={styles.methodCard}
                    onPress={() => {
                      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                      setExpandedMethod(expandedMethod === index ? null : index);
                    }}
                    activeOpacity={0.8}
                  >
                    <View style={styles.methodHeader}>
                      <View style={styles.methodIconContainer}>
                        <Ionicons name={getMethodIcon(method.type)} size={16} color={accent.primary} />
                      </View>
                      <View style={styles.methodTitleContainer}>
                        <Text style={styles.methodTitle}>{method.title}</Text>
                        <Text style={styles.methodTitleArabic}>{method.titleArabic}</Text>
                      </View>
                      <Ionicons
                        name={expandedMethod === index ? 'chevron-up' : 'chevron-down'}
                        size={18}
                        color={DarkTheme.textTertiary}
                      />
                    </View>

                    {expandedMethod === index ? (
                      <View style={styles.methodContent}>
                        <Text style={styles.instruction}>{method.instruction}</Text>
                        {method.count ? (
                          <View style={styles.countSection}>
                            <View style={styles.countBadge}>
                              <Text style={styles.countNumber}>{method.count}×</Text>
                              <Text style={styles.countLabel}>{t('screens.planetTransit.balancing.repetitions')}</Text>
                            </View>
                            {method.numerology ? (
                              <View style={styles.numerologyNote}>
                                <Ionicons name="information-circle" size={12} color={accent.primary} />
                                <Text style={styles.numerologyText}>{method.numerology}</Text>
                              </View>
                            ) : null}
                          </View>
                        ) : null}
                        {method.bestTime ? (
                          <View style={styles.timingSection}>
                            <Ionicons name="time" size={12} color="#FFD700" />
                            <Text style={styles.timingText}>
                              {t('screens.planetTransit.balancing.bestTime')}: {method.bestTime}
                            </Text>
                          </View>
                        ) : null}
                        {method.count ? (
                          <TouchableOpacity
                            style={[styles.counterButton, { backgroundColor: accent.primary }]}
                            onPress={() => router.push('/dhikr-counter')}
                            activeOpacity={0.8}
                          >
                            <Ionicons name="repeat" size={14} color="#fff" />
                            <Text style={styles.counterButtonText}>
                              {t('screens.planetTransit.balancing.startCounter')}
                            </Text>
                          </TouchableOpacity>
                        ) : null}
                        {method.source ? (
                          <View style={styles.sourceNote}>
                            <Ionicons name="book" size={11} color={DarkTheme.textTertiary} />
                            <Text style={styles.sourceText}>
                              {t('screens.planetTransit.balancing.source')}: {method.source}
                            </Text>
                          </View>
                        ) : null}
                      </View>
                    ) : null}
                  </TouchableOpacity>
                ))}

                <View style={styles.balancingDisclaimer}>
                  <Ionicons name="information-circle-outline" size={12} color={DarkTheme.textTertiary} />
                  <Text style={styles.balancingDisclaimerText}>{t('screens.planetTransit.balancing.disclaimer')}</Text>
                </View>
              </GlassCard>
            ) : null}

            {detailsType === 'transit' && adjacent && historyDates ? (
              <GlassCard style={styles.historyCard}>
                <View style={styles.cardHeader}>
                  <Ionicons name="time" size={18} color={accent.primary} />
                  <Text style={styles.cardTitle}>{t('screens.planetTransit.history.title')}</Text>
                </View>
                <View style={styles.historyTimeline}>
                  <View style={styles.historyItem}>
                    <View style={[styles.historyDot, styles.historyDotPast]} />
                    <View style={styles.historyLine} />
                    <View style={styles.historyContent}>
                      <Text style={styles.historySign}>
                        {adjacent.prev ? formatZodiacWithArabic(adjacent.prev as any, language as any) : t('common.unknown')}
                      </Text>
                      <Text style={styles.historyDates}>
                        {formatMonthYear(historyDates.prevStart, language)} - {formatMonthYear(historyDates.prevEnd, language)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.historyItemCurrent}>
                    <View style={[styles.historyDot, styles.historyDotCurrent]} />
                    <View style={styles.historyLine} />
                    <View style={styles.historyContent}>
                      <Text style={styles.historySignCurrent}>
                        {transitData.zodiacKey
                          ? formatZodiacWithArabic(transitData.zodiacKey as any, language as any)
                          : t('common.unknown')}
                      </Text>
                      <Text style={styles.historyDatesCurrent}>
                        {formatMonthYear(transitDates.start, language)} - {formatMonthYear(transitDates.end, language)}
                      </Text>
                      <Text style={styles.historyBadge}>{t('screens.planetTransit.history.current')}</Text>
                    </View>
                  </View>
                  <View style={styles.historyItem}>
                    <View style={[styles.historyDot, styles.historyDotFuture]} />
                    <View style={styles.historyContent}>
                      <Text style={styles.historySign}>
                        {adjacent.next ? formatZodiacWithArabic(adjacent.next as any, language as any) : t('common.unknown')}
                      </Text>
                      <Text style={styles.historyDates}>
                        {formatMonthYear(historyDates.nextStart, language)} - {formatMonthYear(historyDates.nextEnd, language)}
                      </Text>
                    </View>
                  </View>
                </View>
                {transitDates.estimated ? (
                  <Text style={styles.historyHint}>{t('screens.planetTransit.history.estimated')}</Text>
                ) : null}
              </GlassCard>
            ) : null}
            </PremiumSection>

            <GlassCard style={styles.dataSourceCard}>
              <View style={styles.cardHeader}>
                <Ionicons name="server" size={18} color={accent.primary} />
                <Text style={styles.cardTitle}>{t('screens.planetTransit.dataSource.title')}</Text>
              </View>
              <Text style={styles.infoValue}>{sourceLabel}</Text>
              <Text style={styles.infoSub}>{t('screens.planetTransit.dataSource.lastUpdated')}</Text>
              <Text style={styles.infoValue}>{updatedAtLabel}</Text>
              {countdownText && (
                <Text style={styles.metaText}>{t('home.planetTransitDetails.nextChange', { countdown: countdownText })}</Text>
              )}
            </GlassCard>
          </>
        ) : detailsType === 'nextDay' && nextDayPayload ? (
          <GlassCard style={styles.nextDayCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="calendar" size={18} color={accent.primary} />
              <Text style={styles.cardTitle}>{primaryCardTitle}</Text>
            </View>
            <View style={styles.rowCenter}>
              <View style={styles.nextDayOrb}>
                <Text style={styles.nextDayEmoji}>{nextDayPayload.emoji}</Text>
              </View>
              <View style={styles.namesCol}>
                <Text style={styles.primaryName}>{nextDayPayload.dayName}</Text>
                <Text style={styles.secondaryName}>{nextDayPayload.dayNameArabic}</Text>
              </View>
            </View>
            <View style={styles.pillsRow}>
              <View style={[styles.pill, { backgroundColor: accent.glow }]}>
                <Text style={styles.pillLabel}>{t('home.planetTransitDetails.pills.dayRuler')}</Text>
                <Text style={[styles.pillValue, { color: accent.primary }]}>{nextDayPayload.planetArabic}</Text>
              </View>
              <View style={[styles.pill, { backgroundColor: accent.glow }]}>
                <Text style={styles.pillLabel}>{t('home.planetTransitDetails.pills.element')}</Text>
                <Text style={[styles.pillValue, { color: accent.primary }]}>
                  {tSafe(`common.elements.${nextDayPayload.element}`, toTitleCase(nextDayPayload.element))}
                </Text>
              </View>
            </View>
          </GlassCard>
        ) : (
          <GlassCard style={styles.nextDayCard}>
            <Text style={styles.bodyText}>{t('home.planetTransitDetails.error')}</Text>
          </GlassCard>
        )}

        {/* All Planet Transits Section */}
        {detailsType === 'transit' && allTransits && (
          <GlassCard style={styles.allTransitsCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="planet" size={20} color="#9FA9B3" />
              <Text style={styles.cardTitle}>
                {language === 'ar' ? 'جميع عبور الكواكب' : language === 'fr' ? 'Tous les Transits' : 'All Planet Transits'}
              </Text>
            </View>
            <Text style={[styles.bodyText, { marginBottom: Spacing.md }]}>
              {language === 'ar' 
                ? 'موقع جميع الكواكب في البروج حالياً'
                : language === 'fr' 
                ? 'Position actuelle de toutes les planètes dans les signes'
                : 'Current position of all planets in the zodiac signs'}
            </Text>
            
            <View style={styles.allTransitsGrid}>
              {Object.entries(allTransits).map(([planetKey, transitInfo]: [string, PlanetTransit]) => {
                const planetName = planetKey.charAt(0).toUpperCase() + planetKey.slice(1);
                const zodiacData = ZODIAC_DATA[transitInfo.sign as ZodiacKey];
                const planetGrad = getPlanetGradient(planetKey);
                const elementKey = zodiacData?.element || 'earth';
                const elementAcc = ElementAccents[elementKey as Element];
                const isUserSign = transitInfo.sign === userZodiacKey;
                const planetSymbol = PLANET_SYMBOLS[planetKey.toLowerCase()] || '✦';
                
                return (
                  <TouchableOpacity
                    key={planetKey}
                    style={[
                      styles.transitMiniCard,
                      isUserSign && styles.transitMiniCardHighlight,
                      { borderColor: isUserSign ? elementAcc.primary + '50' : 'rgba(255,255,255,0.08)' }
                    ]}
                    onPress={() => {
                      const legacyFormat = adaptTransitToLegacyFormat(transitInfo);
                      router.push({
                        pathname: '/(tabs)/planet-transit-details',
                        params: {
                          type: 'transit',
                          payload: JSON.stringify(legacyFormat),
                          isPersonal: isUserSign ? 'true' : 'false',
                        },
                      });
                    }}
                  >
                    {isUserSign && (
                      <View style={[styles.yourSignBadge, { backgroundColor: elementAcc.primary + '30' }]}>
                        <Ionicons name="star" size={10} color={elementAcc.primary} />
                        <Text style={[styles.yourSignText, { color: elementAcc.primary }]}>
                          {language === 'ar' ? 'برجك' : language === 'fr' ? 'Ton signe' : 'Your sign'}
                        </Text>
                      </View>
                    )}
                    
                    <LinearGradient
                      colors={planetGrad}
                      style={styles.miniPlanetOrb}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Text style={styles.miniPlanetSymbol}>{planetSymbol}</Text>
                    </LinearGradient>
                    
                    <Text style={styles.miniPlanetName} numberOfLines={1}>
                      {language === 'ar' 
                        ? (tSafe(`planets.${planetKey}Arabic`, planetName))
                        : planetName}
                    </Text>
                    
                    <View style={[styles.miniZodiacBadge, { backgroundColor: elementAcc.glow }]}>
                      <Text style={styles.miniZodiacSymbol}>{zodiacData?.symbol || '✦'}</Text>
                      <Text style={[styles.miniZodiacName, { color: elementAcc.primary }]} numberOfLines={1}>
                        {formatZodiacWithArabic(transitInfo.sign as any, language as any)}
                      </Text>
                    </View>
                    
                    {transitInfo.signDegree !== undefined && (
                      <Text style={styles.miniDegree}>
                        {Math.floor(transitInfo.signDegree)}°
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
            
            {loadingAllTransits && (
              <View style={styles.loadingContainer}>
                <Text style={styles.bodyText}>{t('common.loading')}</Text>
              </View>
            )}
          </GlassCard>
        )}

        {/* Collective Transit Explanation - Simplified for non-personal transits */}
        {personalizedInfluence && !isPersonalTransit && (
          <GlassCard style={styles.influenceCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="globe-outline" size={20} color="#6495ED" />
              <Text style={styles.cardTitle}>
                {t('home.planetTransitDetails.influenceEngine.collectiveInfluence')}
              </Text>
            </View>

            {/* Influence Type Badge (smaller) */}
            <View style={[styles.influenceTypeBadge, { backgroundColor: getInfluenceTypeColor(personalizedInfluence.influenceType) + '20', borderColor: getInfluenceTypeColor(personalizedInfluence.influenceType) + '50', alignSelf: 'flex-start' }]}>
              <Text style={[styles.influenceTypeText, { color: getInfluenceTypeColor(personalizedInfluence.influenceType) }]}>
                {(influenceTypeLabel?.[personalizedInfluence.influenceType] ?? personalizedInfluence.influenceType).toUpperCase()}{' '}
                {(language === 'ar' ? 'عبور' : 'TRANSIT')}
              </Text>
            </View>

            {/* Collective Impact (Cosmic Weather) */}
            <View style={[styles.summaryCard, { borderColor: '#6495ED30' }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <Ionicons name="cloudy-night-outline" size={16} color="#6495ED" />
                <Text style={[styles.summaryTitle, { color: '#6495ED' }]}>
                  {t('home.planetTransitDetails.influenceEngine.cosmicWeather')}
                </Text>
              </View>
              <Text style={styles.summaryText}>{personalizedInfluence.collectiveSummary}</Text>
            </View>

            {/* Personal Relevance (Brief) */}
            <View style={[styles.summaryCard, { borderColor: '#9C27B030' }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <Ionicons name="person-outline" size={16} color="#9C27B0" />
                <Text style={[styles.summaryTitle, { color: '#9C27B0' }]}>
                  {t('home.planetTransitDetails.influenceEngine.forYou')}
                </Text>
              </View>
              <Text style={styles.summaryText}>{personalizedInfluence.personalSummary}</Text>
            </View>

            {/* Simple disclaimer */}
            <View style={[styles.disclaimerBox, { marginTop: 0 }]}>
              <Ionicons name="information-circle-outline" size={14} color={DarkTheme.textMuted} />
              <Text style={styles.disclaimerBoxText}>
                {t('home.planetTransitDetails.disclaimer')}
              </Text>
            </View>
          </GlassCard>
        )}

        <View style={styles.disclaimerFooter}>
          <Ionicons name="information-circle" size={14} color={DarkTheme.textMuted} />
          <Text style={styles.disclaimerText}>{t('home.planetTransitDetails.disclaimer')}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DarkTheme.screenBackground,
  },
  headerGradient: {
    paddingBottom: Spacing.md,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screenPadding,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
  },
  buttonBlur: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.18)',
  },
  headerButtonPlaceholder: {
    width: 44,
    height: 44,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: Typography.weightBold,
    color: DarkTheme.textPrimary,
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  headerSubtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  transitTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  transitTypeBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  transitContextBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  transitContextTextContainer: {
    flex: 1,
    gap: 4,
  },
  transitContextTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  transitContextDesc: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
    lineHeight: 18,
  },
  refreshButtonDisabled: {
    opacity: 0.6,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.screenPadding,
    paddingBottom: Spacing.xxxl,
    gap: Spacing.lg,
  },
  glassCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    overflow: 'hidden',
    backgroundColor: Platform.OS === 'android' ? 'rgba(255,255,255,0.08)' : 'transparent',
  },
  glassBlur: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  heroContainer: {
    paddingHorizontal: Spacing.sm,
    paddingTop: Spacing.lg,
  },
  planetCard: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  planetOrbContainer: {
    position: 'relative',
    marginBottom: Spacing.md,
  },
  planetOrbLarge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  planetGlow: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    top: -7,
    left: -7,
    opacity: 0.2,
  },
  planetSymbolLarge: {
    fontSize: 54,
    color: '#fff',
  },
  planetNameHero: {
    fontSize: 30,
    fontWeight: Typography.weightBold,
    color: DarkTheme.textPrimary,
  },
  planetArabicHero: {
    fontSize: 17,
    color: 'rgba(255,255,255,0.7)',
  },
  connectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.lg,
    width: '100%',
    paddingHorizontal: Spacing.lg,
  },
  connectorLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  connectorText: {
    fontSize: 13,
    letterSpacing: 2,
    color: 'rgba(255,255,255,0.5)',
    paddingHorizontal: Spacing.md,
    fontWeight: Typography.weightSemibold,
  },
  signCard: {
    width: '100%',
    gap: Spacing.sm,
  },
  zodiacSymbolLarge: {
    fontSize: 28,
    color: DarkTheme.textPrimary,
  },
  signBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  signIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  signTextContainer: {
    flex: 1,
    minWidth: 0,
  },
  signNameHero: {
    fontSize: 24,
    fontWeight: Typography.weightBold,
    color: DarkTheme.textPrimary,
  },
  signArabicHero: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.6)',
  },
  elementTag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    gap: 6,
  },
  elementText: {
    fontSize: 11,
    fontWeight: Typography.weightBold,
    letterSpacing: 1,
  },
  infoStrip: {
    gap: Spacing.xs,
  },
  explainerText: {
    fontSize: 14,
    color: DarkTheme.textSecondary,
    lineHeight: 19,
    fontStyle: 'italic',
  },
  explainerMeta: {
    fontSize: 12,
    color: DarkTheme.textTertiary,
  },
  impactBanner: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    padding: Spacing.sm,
    gap: Spacing.sm,
  },
  impactBlur: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  impactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.md,
  },
  impactIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  impactText: {
    flex: 1,
    gap: 2,
  },
  impactLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    letterSpacing: 1,
  },
  impactValue: {
    fontSize: 18,
    fontWeight: Typography.weightBold,
  },
  impactArabic: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.65)',
  },
  whyToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  whyToggleText: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
  },
  whyPanel: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 10,
    padding: Spacing.sm,
    gap: 4,
  },
  whyTitle: {
    fontSize: 12,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
  },
  focusRow: {
    gap: 6,
  },
  focusTitle: {
    fontSize: 11,
    color: DarkTheme.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  focusPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  focusPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  focusPillText: {
    fontSize: 11,
    color: DarkTheme.textSecondary,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
  },
  expandableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  durationCard: {
    gap: Spacing.md,
  },
  timelineContent: {
    gap: Spacing.md,
  },
  timelineRowWide: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  milestone: {
    width: 90,
    alignItems: 'center',
    gap: 4,
  },
  milestoneMarker: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  milestoneDate: {
    fontSize: 11,
    color: DarkTheme.textSecondary,
    textAlign: 'center',
  },
  milestoneLabel: {
    fontSize: 11,
    color: DarkTheme.textTertiary,
    textAlign: 'center',
  },
  progressContainer: {
    flex: 1,
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
    position: 'relative',
  },
  progressFillWide: {
    height: '100%',
  },
  nowMarker: {
    position: 'absolute',
    top: -22,
    alignItems: 'center',
    gap: 2,
    transform: [{ translateX: -8 }],
  },
  nowMarkerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  nowLabel: {
    fontSize: 10,
    color: DarkTheme.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  nowDate: {
    fontSize: 10,
    color: DarkTheme.textTertiary,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 17,
    fontWeight: Typography.weightBold,
    color: DarkTheme.textPrimary,
  },
  statLabel: {
    fontSize: 11,
    color: DarkTheme.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  infoHint: {
    fontSize: 11,
    color: DarkTheme.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  degreeCard: {
    gap: Spacing.md,
  },
  degreeContent: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  circularProgress: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circularCenter: {
    position: 'absolute',
    alignItems: 'center',
  },
  degreeValue: {
    fontSize: 26,
    fontWeight: Typography.weightBold,
    color: DarkTheme.textPrimary,
  },
  degreeTotal: {
    fontSize: 13,
    color: DarkTheme.textTertiary,
  },
  degreePercent: {
    fontSize: 13,
    color: DarkTheme.textSecondary,
  },
  phaseRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    flexWrap: 'wrap',
  },
  phaseBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  phaseActive: {
    borderColor: DarkTheme.textPrimary,
  },
  phaseInactive: {
    borderColor: 'rgba(255,255,255,0.12)',
  },
  phaseText: {
    fontSize: 11,
    color: DarkTheme.textSecondary,
  },
  personalizedCard: {
    gap: Spacing.md,
  },
  elementComparison: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  elementCircle: {
    alignItems: 'center',
    gap: 4,
  },
  elementGradientCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  elementCircleLabel: {
    fontSize: 11,
    color: DarkTheme.textTertiary,
    letterSpacing: 0.5,
  },
  elementCircleValue: {
    fontSize: 15,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
  },
  elementCircleArabic: {
    fontSize: 13,
    color: DarkTheme.textSecondary,
  },
  vsContainer: {
    alignItems: 'center',
    gap: 4,
  },
  vsText: {
    fontSize: 12,
    fontWeight: Typography.weightSemibold,
  },
  resonanceCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: Spacing.md,
    backgroundColor: 'rgba(255,255,255,0.04)',
    gap: 4,
  },
  resonanceLabel: {
    fontSize: 11,
    letterSpacing: 1,
  },
  resonanceArabicLarge: {
    fontSize: 17,
    color: DarkTheme.textPrimary,
  },
  resonanceDescription: {
    fontSize: 13,
    color: DarkTheme.textSecondary,
    lineHeight: 18,
  },
  impactPoints: {
    gap: Spacing.sm,
  },
  impactPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.xs,
  },
  impactPointText: {
    flex: 1,
    fontSize: 13,
    color: DarkTheme.textSecondary,
    lineHeight: 18,
  },
  yourNatureCard: {
    gap: Spacing.sm,
  },
  profileButton: {
    marginTop: Spacing.xs,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  profileButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: Typography.weightSemibold,
  },
  guidanceCard: {
    gap: Spacing.md,
  },
  guidanceGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  guidanceBox: {
    flex: 1,
    borderRadius: 14,
    padding: Spacing.md,
    gap: Spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  bestForBox: {
    borderColor: 'rgba(76, 175, 80, 0.35)',
    borderWidth: 1,
  },
  avoidBox: {
    borderColor: 'rgba(255, 152, 0, 0.35)',
    borderWidth: 1,
  },
  guidanceBoxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  guidanceBoxTitle: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  guidanceItem: {
    fontSize: 13,
    color: DarkTheme.textSecondary,
    lineHeight: 18,
  },
  impactNoteContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  impactNoteText: {
    flex: 1,
    fontSize: 12,
    color: DarkTheme.textSecondary,
    lineHeight: 17,
  },
  dailyStack: {
    gap: Spacing.md,
  },
  dailyItem: {
    gap: 4,
  },
  dailyLabel: {
    fontSize: 11,
    color: DarkTheme.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  signComparisonCard: {
    gap: Spacing.md,
  },
  balancingCard: {
    gap: Spacing.md,
  },
  cardSubtitle: {
    fontSize: 12,
    color: DarkTheme.textTertiary,
  },
  signComparisonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  signItem: {
    flex: 1,
    gap: 4,
  },
  signLabel: {
    fontSize: 11,
    color: DarkTheme.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  signName: {
    fontSize: 14,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
  },
  challengeBox: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 12,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  challengeText: {
    fontSize: 13,
    color: DarkTheme.textSecondary,
    lineHeight: 18,
  },
  divider: {
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    paddingTop: Spacing.sm,
  },
  dividerText: {
    fontSize: 10,
    color: DarkTheme.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  methodCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  methodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  methodIconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodTitleContainer: {
    flex: 1,
    gap: 2,
  },
  methodTitle: {
    fontSize: 13,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
  },
  methodTitleArabic: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
    fontFamily: 'Amiri',
  },
  methodContent: {
    gap: Spacing.sm,
  },
  instruction: {
    fontSize: 13,
    color: DarkTheme.textSecondary,
    lineHeight: 18,
  },
  countSection: {
    gap: Spacing.xs,
  },
  countBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  countNumber: {
    fontSize: 13,
    fontWeight: Typography.weightBold,
    color: DarkTheme.textPrimary,
  },
  countLabel: {
    fontSize: 10,
    color: DarkTheme.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  numerologyNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  numerologyText: {
    fontSize: 11,
    color: DarkTheme.textTertiary,
    flex: 1,
  },
  timingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timingText: {
    fontSize: 11,
    color: DarkTheme.textSecondary,
  },
  counterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  counterButtonText: {
    fontSize: 12,
    fontWeight: Typography.weightSemibold,
    color: '#fff',
  },
  sourceNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sourceText: {
    fontSize: 10,
    color: DarkTheme.textTertiary,
    flex: 1,
  },
  balancingDisclaimer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: Spacing.xs,
  },
  balancingDisclaimerText: {
    fontSize: 10,
    color: DarkTheme.textTertiary,
    flex: 1,
  },
  signGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  signColumn: {
    flex: 1,
    gap: 4,
  },
  signHeader: {
    fontSize: 11,
    color: DarkTheme.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  signValue: {
    fontSize: 14,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
  },
  historyCard: {
    gap: Spacing.md,
  },
  historyTimeline: {
    gap: Spacing.sm,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  historyItemCurrent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  historyDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  historyDotPast: {
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  historyDotCurrent: {
    backgroundColor: DarkTheme.textPrimary,
  },
  historyDotFuture: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  historyLine: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  historyContent: {
    flex: 1,
    gap: 2,
  },
  historySign: {
    fontSize: 14,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
  },
  historySignCurrent: {
    fontSize: 15,
    fontWeight: Typography.weightBold,
    color: DarkTheme.textPrimary,
  },
  historyDates: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
  },
  historyDatesCurrent: {
    fontSize: 13,
    color: DarkTheme.textSecondary,
  },
  historyBadge: {
    fontSize: 11,
    color: DarkTheme.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  historyHint: {
    fontSize: 11,
    color: DarkTheme.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  dataSourceCard: {
    gap: Spacing.sm,
  },
  infoValue: {
    fontSize: 14,
    color: DarkTheme.textPrimary,
    fontWeight: Typography.weightSemibold,
  },
  infoSub: {
    fontSize: 11,
    color: DarkTheme.textTertiary,
  },
  metaText: {
    fontSize: 13,
    color: DarkTheme.textSecondary,
  },
  nextDayCard: {
    gap: Spacing.md,
  },
  nextDayOrb: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  nextDayEmoji: {
    fontSize: 26,
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  namesCol: {
    flex: 1,
    minWidth: 0,
  },
  primaryName: {
    fontSize: 19,
    fontWeight: Typography.weightBold,
    color: DarkTheme.textPrimary,
  },
  secondaryName: {
    fontSize: 13,
    color: DarkTheme.textTertiary,
    fontFamily: 'Amiri',
  },
  pillsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  pill: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 4,
    minWidth: 0,
  },
  pillLabel: {
    fontSize: 11,
    color: DarkTheme.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pillValue: {
    fontSize: 14,
    fontWeight: Typography.weightSemibold,
  },
  bodyText: {
    fontSize: 14,
    color: DarkTheme.textSecondary,
    lineHeight: 18,
  },
  disclaimerFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: Spacing.sm,
  },
  disclaimerText: {
    fontSize: 12,
    color: DarkTheme.textMuted,
    textAlign: 'center',
    lineHeight: 16,
  },
  allTransitsCard: {
    gap: Spacing.md,
  },
  allTransitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  transitMiniCard: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    borderWidth: 1.5,
    padding: Spacing.md,
    gap: Spacing.xs,
    alignItems: 'center',
    position: 'relative',
  },
  transitMiniCardHighlight: {
    backgroundColor: 'rgba(76, 175, 80, 0.05)',
  },
  yourSignBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  yourSignText: {
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  miniPlanetOrb: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  miniPlanetSymbol: {
    fontSize: 24,
    color: '#fff',
  },
  miniPlanetName: {
    fontSize: 13,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
    textAlign: 'center',
  },
  miniZodiacBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    width: '100%',
    justifyContent: 'center',
  },
  miniZodiacSymbol: {
    fontSize: 14,
  },
  miniZodiacName: {
    fontSize: 11,
    fontWeight: '600',
  },
  miniDegree: {
    fontSize: 10,
    color: DarkTheme.textTertiary,
  },
  loadingContainer: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  influenceCard: {
    gap: Spacing.md,
  },
  influenceBadges: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  influenceTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  influenceTypeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  degreeStageBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  degreeStageText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  influenceScopeText: {
    fontSize: 14,
    color: DarkTheme.textSecondary,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  summaryCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    borderWidth: 1.5,
    padding: Spacing.md,
  },
  summaryTitle: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  summaryText: {
    fontSize: 14,
    color: DarkTheme.textSecondary,
    lineHeight: 20,
  },
  degreeExplanationCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 14,
    borderWidth: 1.5,
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  degreeStageDescription: {
    fontSize: 14,
    color: DarkTheme.textSecondary,
    lineHeight: 20,
  },
  influenceTimingText: {
    fontSize: 13,
    color: DarkTheme.textTertiary,
    lineHeight: 18,
  },
  guidanceSection: {
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  guidanceSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  guidanceSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: DarkTheme.textPrimary,
  },
  guidanceListItem: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  guidanceBullet: {
    fontSize: 16,
    color: DarkTheme.textTertiary,
    lineHeight: 20,
  },
  guidanceItemText: {
    flex: 1,
    fontSize: 13,
    color: DarkTheme.textSecondary,
    lineHeight: 20,
  },
  disclaimerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 10,
    padding: Spacing.sm,
    marginTop: Spacing.sm,
  },
  disclaimerBoxText: {
    flex: 1,
    fontSize: 11,
    color: DarkTheme.textMuted,
    lineHeight: 16,
  },
});

function GlassCard({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  if (Platform.OS === 'android') {
    return (
      <View style={styles.glassCard}>
        <View style={[styles.glassBlur, style]}>{children}</View>
      </View>
    );
  }

  return (
    <View style={styles.glassCard}>
      <BlurView intensity={24} tint="dark" style={[styles.glassBlur, style]}>
        {children}
      </BlurView>
    </View>
  );
}
