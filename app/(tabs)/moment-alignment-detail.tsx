/**
 * Moment Alignment Detail Screen
 * ================================
 * Expanded explanation of current moment alignment status.
 * Shows why the alignment status was chosen and provides non-prescriptive guidance.
 * 
 * FREE: User element, Moment element, Alignment state, Short neutral explanation
 * PREMIUM: What actions are favored now, What to avoid, Suggested dhikr, Deeper guidance
 */

import { AdBanner } from '@/components/ads';
import CollapsibleSection from '@/components/common/CollapsibleSection';
import { MomentAnalysisCard } from '@/components/momentAlignment/MomentAnalysisCard';
import { MomentGuidanceCard } from '@/components/momentAlignment/MomentGuidanceCard';
import { StatusOverviewCard } from '@/components/momentAlignment/StatusOverviewCard';
import { TimingAnalysisSection } from '@/components/timing';
import { getPlanetArabicName } from '@/constants/arabicTerms';
import { DarkTheme, Spacing } from '@/constants/DarkTheme';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProfile } from '@/contexts/ProfileContext';
import { fetchPrayerTimes } from '@/services/api/prayerTimes';
import {
    BADGE_CONFIG,
    getBadgeFromScore,
    type AsrariyaTimingResult,
    type UnifiedBadge,
} from '@/services/AsrariyaTimingEngine';
import { getClassicalJudgment } from '@/services/ClassicalJudgmentService';
import { getBestLocation } from '@/services/LocationCacheService';
import { getMomentAlignment, MomentAlignment } from '@/services/MomentAlignmentService';
import { calculateAspects, calculateHouses } from '@/services/NatalChartService';
import { getPlanetaryCondition, type PlanetaryCondition } from '@/services/PlanetaryConditionService';
import { calculatePlanetaryHours, getPlanetaryDayBoundariesForNow, PlanetaryHourData, type Planet, type PlanetaryDayBoundaries } from '@/services/PlanetaryHoursService';
import { calculateEnhancedPlanetaryPower } from '@/services/PlanetaryStrengthService';
import { deriveBurjFromDOB, deriveElementFromBurj, derivePlanetaryRulerFromBurj } from '@/services/ProfileDerivationService';
import { getAlignmentBadge, getAlignmentLabelKey, getRulingPlanetFromBurj } from '@/services/SimpleAlignmentBadge';
import { getAllTransits } from '@/services/TransitService';
import { getPlanetaryHourWordingKeys } from '@/utils/planetaryHourWording';
import { adaptTransitToLegacyFormat } from '@/utils/transitAdapters';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    ActivityIndicator,
    AppState,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MomentAlignmentDetailScreen() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { profile } = useProfile();

  // Moment Alignment: use DOB zodiac-derived rulership for "Your Planet" when available.
  // This avoids any accidental coupling with name+mother derived signals.
  const dobZodiacDerived = useMemo(() => {
    if (!profile?.dobISO) return null;
    const burj = deriveBurjFromDOB(profile.dobISO);
    if (!burj) return null;
    return {
      burjIndex: burj.burjIndex,
      element: deriveElementFromBurj(burj.burjIndex),
      planetaryRulerKey: derivePlanetaryRulerFromBurj(burj.burjIndex) as any,
    };
  }, [profile?.dobISO]);

  const userPlanetKey = (dobZodiacDerived?.planetaryRulerKey ?? profile?.derived?.planetaryRuler) as
    | string
    | undefined; // e.g. 'sun'

  const userZodiacElement = useMemo(() => {
    if (dobZodiacDerived?.element) return dobZodiacDerived.element;
    if (typeof profile?.derived?.burjIndex === 'number') return deriveElementFromBurj(profile.derived.burjIndex);
    return profile?.derived?.element;
  }, [dobZodiacDerived?.element, profile?.derived?.burjIndex, profile?.derived?.element]);

  const userPlanetSourceLabel = useMemo(() => {
    // Prefer DOB zodiac source when DOB is present (even if derivation fails) to match user expectation.
    if (profile?.dobISO) return t('momentDetail.cards.source.birthChart');
    return t('momentDetail.cards.source.nameMotherPersonal') || t('momentDetail.zahirOutward');
  }, [profile?.dobISO, t]);

  const planetGlyphByKey: Record<string, string> = {
    sun: '☉',
    moon: '☽',
    mercury: '☿',
    venus: '♀',
    mars: '♂',
    jupiter: '♃',
    saturn: '♄',
  };

  const [alignment, setAlignment] = useState<MomentAlignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [planetaryData, setPlanetaryData] = useState<PlanetaryHourData | null>(null);
  const [allTransits, setAllTransits] = useState<any>(null);
  const [prayerTimesData, setPrayerTimesData] = useState<any>(null);
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [planetaryBoundaries, setPlanetaryBoundaries] = useState<PlanetaryDayBoundaries | null>(null);
  const [hourPlanetCondition, setHourPlanetCondition] = useState<PlanetaryCondition | null>(null);
  const [now, setNow] = useState(new Date());
  const [minuteNow, setMinuteNow] = useState(new Date());
  const alignmentInFlightRef = useRef(false);
  const alignmentRef = useRef<MomentAlignment | null>(null);

  type OverallTransitLink = {
    planet: Planet;
    planetKey: string;
    qualityLabel: string;
    finalPower: number;
    payload: string;
  };

  const [userTransitLink, setUserTransitLink] = useState<OverallTransitLink | null>(null);
  const [currentHourTransitData, setCurrentHourTransitData] = useState<OverallTransitLink | null>(null);

  // Unified timing state - used for deep analysis breakdown sections
  const [timingResult, setTimingResult] = useState<AsrariyaTimingResult | null>(null);

  // ── Header badge: SimpleAlignmentBadge (single source of truth, matches widget) ──
  const simpleBadge = useMemo(() => {
    const planet = planetaryData?.currentHour?.planet;
    if (!planet) return null;
    const burjIndex = dobZodiacDerived?.burjIndex ?? profile?.derived?.burjIndex;
    const userRuler = typeof burjIndex === 'number' ? getRulingPlanetFromBurj(burjIndex) : undefined;
    return getAlignmentBadge(planet, userRuler);
  }, [planetaryData?.currentHour?.planet, dobZodiacDerived?.burjIndex, profile?.derived?.burjIndex]);

  // Keep legacy badge derivation for deep analysis sections that still reference it
  const unifiedBadge: UnifiedBadge = timingResult
    ? getBadgeFromScore(timingResult.overallScore)
    : 'MAINTAIN';
  const badgeConfig = BADGE_CONFIG[unifiedBadge];

  useEffect(() => {
    alignmentRef.current = alignment;
  }, [alignment]);

  useEffect(() => {
    let cancelled = false;

    const planetFromKey = (planetKey: string | null | undefined): Planet | null => {
      const key = (planetKey ?? '').toLowerCase();
      if (key === 'sun') return 'Sun';
      if (key === 'moon') return 'Moon';
      if (key === 'mercury') return 'Mercury';
      if (key === 'venus') return 'Venus';
      if (key === 'mars') return 'Mars';
      if (key === 'jupiter') return 'Jupiter';
      if (key === 'saturn') return 'Saturn';
      return null;
    };

    const getQualityKey = (strength: number): 'excellent' | 'good' | 'moderate' => {
      if (strength >= 90) return 'excellent';
      if (strength >= 70) return 'good';
      return 'moderate';
    };

    const computeTransitData = async (planet: Planet, planetKey: string, allTransits: any): Promise<OverallTransitLink | null> => {
      const planetTransit = allTransits[planet];
      const sunTransit = allTransits.Sun;
      if (!planetTransit) return null;

      const legacy = adaptTransitToLegacyFormat(planetTransit);
      const payload = JSON.stringify(legacy);

      const longitude = planetTransit.longitude;
      const sunLongitude = sunTransit?.longitude;
      const degree =
        typeof planetTransit.signDegree === 'number'
          ? planetTransit.signDegree + (planetTransit.signMinute ?? 0) / 60
          : typeof longitude === 'number'
            ? ((longitude % 30) + 30) % 30
            : null;

      if (typeof longitude !== 'number' || typeof sunLongitude !== 'number' || typeof degree !== 'number') {
        return { planet, planetKey, qualityLabel: '', finalPower: 0, payload };
      }

      const enhanced = calculateEnhancedPlanetaryPower(
        planet,
        planetTransit.sign,
        degree,
        longitude,
        sunLongitude,
        !!planetTransit.isRetrograde
      );
      const qualityKey = getQualityKey(enhanced.finalPower);
      const qualityLabel = t(`dailyEnergy.planetaryStrength.qualities.${qualityKey}`);

      return { planet, planetKey, qualityLabel, finalPower: enhanced.finalPower, payload };
    };

    const run = async () => {
      try {
        const transits = await getAllTransits();
        if (!transits) {
          if (!cancelled) {
            setAllTransits(null);
            setUserTransitLink(null);
            setCurrentHourTransitData(null);
          }
          return;
        }
        if (!cancelled) setAllTransits(transits);

        // Fetch user planet transit
        const userPlanet = planetFromKey(userPlanetKey);
        if (userPlanet && userPlanetKey) {
          const userData = await computeTransitData(userPlanet, userPlanetKey, transits);
          if (!cancelled) setUserTransitLink(userData);
        } else {
          if (!cancelled) setUserTransitLink(null);
        }

        // Fetch current hour planet transit
        const currentHourPlanet = planetaryData?.currentHour?.planet;
        if (currentHourPlanet) {
          const hourPlanet = planetFromKey(currentHourPlanet.toLowerCase());
          if (hourPlanet) {
            const hourData = await computeTransitData(hourPlanet, currentHourPlanet.toLowerCase(), transits);
            if (!cancelled) setCurrentHourTransitData(hourData);
          } else {
            if (!cancelled) setCurrentHourTransitData(null);
          }
        } else {
          if (!cancelled) setCurrentHourTransitData(null);
        }
      } catch {
        if (!cancelled) {
          setAllTransits(null);
          setUserTransitLink(null);
          setCurrentHourTransitData(null);
        }
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [t, userPlanetKey, planetaryData?.currentHour?.planet]);

  // Track whether we've loaded alignment with location data
  const hasLoadedWithLocationRef = useRef(false);

  const loadAlignment = useCallback(async (options?: { silent?: boolean; overrideCoords?: { latitude: number; longitude: number } }) => {
    const effectiveCoords = options?.overrideCoords ?? coords;
    const hasLocation = !!effectiveCoords;
    
    // If already loaded with location and no location now, skip (avoid downgrade)
    // If location available now, always reload to get proper hourRulerCondition
    if (alignmentInFlightRef.current) {
      // Allow calls with location to proceed even if in-flight (they're higher priority)
      if (!hasLocation) return;
    }
    
    alignmentInFlightRef.current = true;
    const shouldShowLoading = !options?.silent && !alignmentRef.current;
    if (shouldShowLoading) {
      setLoading(true);
    }
    try {
      const result = await getMomentAlignment(
        profile,
        new Date(),
        effectiveCoords ? { location: effectiveCoords } : undefined
      );
      setAlignment(result);
      if (hasLocation) {
        hasLoadedWithLocationRef.current = true;
      }
    } finally {
      alignmentInFlightRef.current = false;
      if (shouldShowLoading) {
        setLoading(false);
      }
    }
  }, [profile, coords]);

  const loadPrayerTimes = useCallback(async () => {
    try {
      const best = await getBestLocation({ allowPrompt: true });
      if (!best) return;
      const { latitude, longitude } = best;
      setCoords({ latitude, longitude });
      const data = await fetchPrayerTimes(latitude, longitude);
      setPrayerTimesData(data);
    } catch (error) {
      console.error('Error loading prayer times:', error);
    }
  }, []);

  // On mount: load lightweight alignment immediately (no location), then upgrade
  useEffect(() => {
    // 1. Load alignment immediately without location (fast — no cosmic quality call)
    (async () => {
      alignmentInFlightRef.current = true;
      setLoading(true);
      try {
        const result = await getMomentAlignment(profile, new Date(), { lightweight: true });
        setAlignment(result);
      } finally {
        alignmentInFlightRef.current = false;
        setLoading(false);
      }
    })();
    // 2. In parallel, start loading location + prayer times
    void loadPrayerTimes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When coords arrive, reload with full analysis (silent — content already on screen)
  useEffect(() => {
    if (coords && !hasLoadedWithLocationRef.current) {
      void loadAlignment({ silent: true, overrideCoords: coords });
    }
  }, [coords, loadAlignment]);

  useEffect(() => {
    void loadAlignment({ silent: true });
  }, [minuteNow, loadAlignment]);

  // Refresh alignment immediately when planetary hour changes
  // This ensures hourRulerCondition always matches the displayed current hour planet
  const currentHourPlanetForRefresh = planetaryData?.currentHour?.planet;
  const prevHourPlanetRef = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (!currentHourPlanetForRefresh) return;
    // Only trigger refresh when planet actually changes, not on initial load
    if (prevHourPlanetRef.current && prevHourPlanetRef.current !== currentHourPlanetForRefresh) {
      void loadAlignment({ silent: true });
    }
    prevHourPlanetRef.current = currentHourPlanetForRefresh;
  }, [currentHourPlanetForRefresh, loadAlignment]);

  // Secondary safeguard: if transitModel detected stale data, force reload (max 1 retry)
  const conditionPlanet = alignment?.hourRulerCondition?.planet;
  const staleRetryRef = useRef<string | null>(null);
  useEffect(() => {
    if (!currentHourPlanetForRefresh || !conditionPlanet) return;
    if (currentHourPlanetForRefresh.toLowerCase() !== conditionPlanet.toLowerCase()) {
      // Prevent infinite retry - only retry once per hour change
      const retryKey = `${conditionPlanet}->${currentHourPlanetForRefresh}`;
      if (staleRetryRef.current !== retryKey) {
        staleRetryRef.current = retryKey;
        void loadAlignment({ silent: true });
      }
    } else {
      // Data is fresh, reset retry tracker
      staleRetryRef.current = null;
    }
  }, [currentHourPlanetForRefresh, conditionPlanet, loadAlignment]);

  useEffect(() => {
    if (!coords) return;
    let cancelled = false;
    (async () => {
      const boundaries = await getPlanetaryDayBoundariesForNow(coords, { now: minuteNow });
      if (!cancelled) setPlanetaryBoundaries(boundaries);
    })();
    return () => {
      cancelled = true;
    };
  }, [coords, minuteNow]);

  useEffect(() => {
    if (!planetaryBoundaries) return;
    try {
      const planetary = calculatePlanetaryHours(
        planetaryBoundaries.sunrise,
        planetaryBoundaries.sunset,
        planetaryBoundaries.nextSunrise,
        now
      );
      setPlanetaryData(planetary);
    } catch (error) {
      console.error('Error calculating planetary hours:', error);
    }
  }, [planetaryBoundaries, now]);

  // Always compute the *current hour planet's* condition directly.
  // This is a factual transit property (e.g., dignity in sign like wabal/detriment),
  // and should not be dependent on broader alignment refresh timing.
  useEffect(() => {
    if (!coords) return;
    const planet = planetaryData?.currentHour?.planet;
    if (!planet) return;

    let cancelled = false;
    (async () => {
      try {
        const condition = await getPlanetaryCondition(planet, minuteNow, coords);
        if (!cancelled) setHourPlanetCondition(condition);
      } catch (error) {
        console.warn('[MomentAlignmentDetail] Failed to get hour planet condition:', error);
        if (!cancelled) setHourPlanetCondition(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [coords, planetaryData?.currentHour?.planet, minuteNow]);

  // BATTERY OPTIMIZATION: Pause all intervals when app is backgrounded
  const appStateRef = useRef(AppState.currentState);
  useEffect(() => {
    let secondInterval: ReturnType<typeof setInterval> | null = null;
    let minuteInterval: ReturnType<typeof setInterval> | null = null;
    
    const startIntervals = () => {
      if (secondInterval) clearInterval(secondInterval);
      if (minuteInterval) clearInterval(minuteInterval);
      
      secondInterval = setInterval(() => {
        if (appStateRef.current === 'active') {
          setNow(new Date());
        }
      }, 1000);
      
      minuteInterval = setInterval(() => {
        if (appStateRef.current === 'active') {
          setMinuteNow(new Date());
        }
      }, 60_000);
    };
    
    const subscription = AppState.addEventListener('change', (nextState) => {
      const wasBackground = appStateRef.current !== 'active';
      appStateRef.current = nextState;
      if (nextState === 'active' && wasBackground) {
        setNow(new Date());
        setMinuteNow(new Date());
        startIntervals();
      } else if (nextState !== 'active') {
        if (secondInterval) { clearInterval(secondInterval); secondInterval = null; }
        if (minuteInterval) { clearInterval(minuteInterval); minuteInterval = null; }
      }
    });
    
    if (appStateRef.current === 'active') {
      startIntervals();
    }
    
    return () => {
      subscription.remove();
      if (secondInterval) clearInterval(secondInterval);
      if (minuteInterval) clearInterval(minuteInterval);
    };
  }, []);

  // Use unified badge color when timing result available, otherwise fallback to old logic
  const getStatusColor = (status?: string) => {
    // Prefer unified badge color from timing analysis
    if (timingResult) {
      return badgeConfig.color;
    }
    // Fallback for old system (only used before timing loads)
    switch (status) {
      case 'ACT':
        return '#10b981';
      case 'MAINTAIN':
        return '#f59e0b'; // Changed from brown to amber
      case 'HOLD':
        return '#7C3AED'; // Changed from gray to purple
      default:
        return '#64B5F6';
    }
  };

  const getElementIcon = (element?: string) => {
    switch (element) {
      case 'fire':
        return '🔥';
      case 'water':
        return '💧';
      case 'air':
        return '🌬️';
      case 'earth':
        return '🌱';
      default:
        return '✨';
    }
  };

  const getElementLabel = (element?: string) => {
    if (!element) return '';
    // Translate element using i18n
    const elementKey = element.toLowerCase();
    return t(`elements.${elementKey}` as any) || element.charAt(0).toUpperCase() + element.slice(1);
  };

  const formatTime = () => {
    const current = new Date();
    const hours = current.getHours().toString().padStart(2, '0');
    const minutes = current.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const formatTimeUntil = (targetDate: Date) => {
    const diffMs = targetDate.getTime() - new Date().getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours > 0) {
      return t('momentDetail.timeline.hours', { count: diffHours });
    }
    return t('momentDetail.timeline.minutes', { count: diffMinutes });
  };

  const formatWindowDay = (window: any) => {
    const windowDate = new Date(window.startTime);
    const hoursAway = Math.floor((windowDate.getTime() - new Date().getTime()) / (1000 * 60 * 60));

    if (hoursAway === 0) return t('momentDetail.timeline.today');
    if (hoursAway === 1) return `${t('momentDetail.timeline.in')} 1h`;
    if (hoursAway < 24) return `${t('momentDetail.timeline.in')} ${hoursAway}h`;

    const daysAway = Math.floor(hoursAway / 24);
    return t('momentDetail.timeline.daysAway', { count: daysAway });
  };

  const currentHourRemainingLabel = useMemo(() => {
    if (!planetaryData) return null;
    return formatTimeUntil(planetaryData.currentHour.endTime);
  }, [planetaryData]);

  const getLocalizedLayerReasoning = useCallback((layer: { reasoning: string; reasoningAr?: string; reasoningFr?: string }) => {
    if (language === 'ar' && layer.reasoningAr) return layer.reasoningAr;
    if (language === 'fr' && layer.reasoningFr) return layer.reasoningFr;
    return layer.reasoning;
  }, [language]);

  const getLocalizedEnhancementText = useCallback((enh: { text: string; textAr?: string; textFr?: string }) => {
    if (language === 'ar' && enh.textAr) return enh.textAr;
    if (language === 'fr' && enh.textFr) return enh.textFr;
    return enh.text;
  }, [language]);

  const getDignityLabel = useCallback((dignityType?: string) => {
    switch (dignityType) {
      case 'domicile':
        return t('dignityDomicile');
      case 'exaltation':
        return t('dignityExalted');
      case 'detriment':
        return t('dignityDetriment');
      case 'fall':
        return t('dignityFall');
      case 'peregrine':
      default:
        return t('dignityNeutral');
    }
  }, [t]);

  const transitHouse = useMemo(() => {
    if (!coords) return null;
    const abs = hourPlanetCondition?.position?.absoluteDegree ?? alignment?.hourRulerCondition?.position?.absoluteDegree;
    if (!abs) return null;

    const planetDegree = abs;
    const houses = calculateHouses(new Date(), coords);
    if (!Array.isArray(houses) || houses.length < 12) return null;

    const isBetween = (deg: number, start: number, end: number) => {
      const d = ((deg % 360) + 360) % 360;
      const s = ((start % 360) + 360) % 360;
      const e = ((end % 360) + 360) % 360;
      if (s <= e) return d >= s && d < e;
      return d >= s || d < e;
    };

    let houseIndex = 0;
    for (let i = 0; i < 12; i++) {
      const start = houses[i];
      const end = houses[(i + 1) % 12];
      if (typeof start !== 'number' || typeof end !== 'number') continue;
      if (isBetween(planetDegree, start, end)) {
        houseIndex = i;
        break;
      }
    }

    const houseNumber = houseIndex + 1;
    const angular = houseNumber === 1 || houseNumber === 4 || houseNumber === 7 || houseNumber === 10;
    const succedent = houseNumber === 2 || houseNumber === 5 || houseNumber === 8 || houseNumber === 11;
    const cadent = !angular && !succedent;

    const sectorKey = angular ? 'angular' : succedent ? 'succedent' : 'cadent';
    return { houseNumber, sectorKey } as const;
  }, [coords, hourPlanetCondition?.position?.absoluteDegree, alignment?.hourRulerCondition?.position?.absoluteDegree]);

  const classicalJudgment = useMemo(() => {
    const rulerPlanet = planetaryData?.currentHour?.planet;
    if (!rulerPlanet) return undefined;

    const dignityType = hourPlanetCondition?.dignity?.type ?? alignment?.hourRulerCondition?.dignity?.type;
    const houseType = transitHouse?.sectorKey;

    const isDignified = dignityType === 'domicile' || dignityType === 'exaltation';

    // Compute benefic/malefic connections from real transit longitudes.
    // This keeps the shared judgment deterministic while grounding it in actual sky geometry.
    let aspectsToBenefics = 0;
    let aspectsToMalefics = 0;

    const degrees: Record<string, number> = {};
    const planets: Planet[] = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
    planets.forEach((p) => {
      const lon = allTransits?.[p]?.longitude;
      if (typeof lon === 'number') {
        degrees[p] = ((lon % 360) + 360) % 360;
      }
    });

    if (degrees[rulerPlanet] !== undefined) {
      const aspects = calculateAspects(degrees);
      aspects.forEach((a) => {
        const involves = a.planet1 === rulerPlanet || a.planet2 === rulerPlanet;
        if (!involves) return;

        const other = a.planet1 === rulerPlanet ? a.planet2 : a.planet1;
        if (other === 'Jupiter' || other === 'Venus') aspectsToBenefics += 1;
        if (other === 'Mars' || other === 'Saturn') aspectsToMalefics += 1;
      });
    }

    // Get user's ruling planet for same-planet rule check
    // userPlanetKey is lowercase (e.g., 'mars'), need to convert to Planet type
    const userRulingPlanet = userPlanetKey 
      ? (userPlanetKey.charAt(0).toUpperCase() + userPlanetKey.slice(1)) as Planet
      : undefined;

    const baseJudgment = getClassicalJudgment({
      rulerPlanet,
      userRulingPlanet,
      dignityType,
      houseType,
      aspectsToBenefics,
      aspectsToMalefics,
    });

    // Unison rule: if the transit condition is very strong, the classical label cannot remain "Neutral".
    // Only upgrade when the planet is allowed to be Nashr.
    // Same-planet affects intensity, not automatic permission.
    const transitPower = currentHourTransitData?.finalPower;
    const isExceptionalStrength = typeof transitPower === 'number' && transitPower >= 90;
    const isStrongStrength = typeof transitPower === 'number' && transitPower >= 70;
    
    // Only some planets qualify for an "upgrade" to Nashr under exceptional strength.
    const canUpgradeToNashr = (
      rulerPlanet !== 'Saturn' &&
      rulerPlanet !== 'Mars' &&
      rulerPlanet !== 'Mercury' &&
      (rulerPlanet !== 'Moon' || isDignified)
    );

    if (canUpgradeToNashr && baseJudgment.restrictionLevel === 1 && (isExceptionalStrength || isStrongStrength)) {
      return {
        ...baseJudgment,
        classicalLabel: 'Nashr',
        restrictionLevel: 0,
        practiceIntensity: 'high',
      };
    }

    return baseJudgment;
  }, [hourPlanetCondition?.dignity?.type, alignment?.hourRulerCondition?.dignity?.type, allTransits, currentHourTransitData?.finalPower, planetaryData?.currentHour?.planet, transitHouse?.sectorKey, userPlanetKey]);

  const hourWording = useMemo(() => {
    const planet = planetaryData?.currentHour?.planet;
    if (!planet) return null;
    return getPlanetaryHourWordingKeys(planet);
  }, [planetaryData?.currentHour?.planet]);

  // UNIFIED: Use SimpleAlignmentBadge for consistent badge display with widget
  const statusColor = useMemo(() => {
    // Primary: Simple alignment badge (matches widget)
    if (simpleBadge) return simpleBadge.color;
    // Fallback to classical judgment if planetary data not loaded yet
    if (classicalJudgment) {
      switch (classicalJudgment.restrictionLevel) {
        case 0:
          return '#10b981';
        case 1:
          return '#f59e0b';
        case 2:
          return '#f97316';
        case 3:
        default:
          return '#ef4444';
      }
    }
    return getStatusColor(alignment?.status);
  }, [alignment?.status, classicalJudgment, simpleBadge]);

  const statusSubtitle = (() => {
    // Primary: Simple alignment badge description
    if (simpleBadge) {
      const descKeyMap: Record<string, string> = {
        aligned: 'momentDetail.cards.status.act_desc',
        steady: 'momentDetail.cards.status.maintain_desc',
        mindful: 'momentDetail.cards.status.hold_desc',
      };
      return t(descKeyMap[simpleBadge.tier]) || '';
    }
    // Fallback to classical judgment
    if (classicalJudgment) {
      const keyByLevel: Record<0 | 1 | 2 | 3, string> = {
        0: 'momentDetail.cards.status.act_desc',
        1: 'momentDetail.cards.status.maintain_desc',
        2: 'momentDetail.cards.status.maintain_desc',
        3: 'momentDetail.cards.status.hold_desc',
      };
      const level = classicalJudgment.restrictionLevel as 0 | 1 | 2 | 3;
      const key = keyByLevel[level];
      const translated = t(key);
      return translated || '';
    }
    return alignment ? t(alignment.shortHintKey) : '';
  })();

  const statusBadgeText = (() => {
    // Primary: Simple alignment badge (matches widget)
    if (simpleBadge) {
      const labelKey = getAlignmentLabelKey(simpleBadge.tier);
      return `${simpleBadge.icon} ${t(labelKey) || simpleBadge.label}`;
    }
    // Fallback to classical judgment
    if (classicalJudgment) {
      const emoji =
        classicalJudgment.restrictionLevel === 0
          ? '🟢'
          : classicalJudgment.restrictionLevel === 1
            ? '🟡'
            : classicalJudgment.restrictionLevel === 2
              ? '🟠'
              : '⛔';
      const labelKey = `dailyEnergy.classicalJudgment.labels.${classicalJudgment.classicalLabel.toLowerCase()}`;
      return `${emoji} ${t(labelKey) || classicalJudgment.classicalLabel}`;
    }
    return alignment ? t(alignment.shortLabelKey) : '';
  })();

  const hourEndsInLabel = useMemo(() => {
    // Always use planetaryData.currentHour.endTime for "hour ends in" label
    // This ensures consistency with the "next hour in X" timing note
    if (planetaryData?.currentHour?.endTime) {
      return `${t('momentDetail.cards.hourEndsIn')} ${formatTimeUntil(planetaryData.currentHour.endTime)}`;
    }
    return undefined;
  }, [planetaryData?.currentHour?.endTime, t]);

  const currentHourModel = useMemo(() => {
    if (!planetaryData) {
      return {
        symbol: '✦',
        name: t('common.unknown'),
      };
    }

    const planetKey = planetaryData.currentHour.planet.toLowerCase();
    return {
      symbol: planetaryData.currentHour.planetInfo.symbol,
      name: t(`planets.${planetKey}`) || planetaryData.currentHour.planet,
      arabicName: planetaryData.currentHour.planetInfo.arabicName,
      elementLabel: getElementLabel(planetaryData.currentHour.planetInfo.element),
      elementIcon: getElementIcon(planetaryData.currentHour.planetInfo.element),
    };
  }, [planetaryData, t]);

  const userPlanetModel = useMemo(() => {
    const planetName = userPlanetKey ? (t(`planets.${userPlanetKey}`) || userPlanetKey) : t('common.unknown');
    return {
      symbol: userPlanetKey ? (planetGlyphByKey[userPlanetKey] ?? '✦') : '✦',
      name: planetName,
      arabicName: userPlanetKey ? getPlanetArabicName(userPlanetKey) : undefined,
      elementLabel: getElementLabel(userZodiacElement),
      elementIcon: getElementIcon(userZodiacElement),
      sourceLabel: userPlanetSourceLabel,
    };
  }, [userPlanetKey, t, userZodiacElement, userPlanetSourceLabel]);

  const transitModel = useMemo(() => {
    const condition = hourPlanetCondition ?? alignment?.hourRulerCondition;
    if (!condition) return undefined;

    // If we're falling back to alignment-provided condition, ensure it matches the displayed hour.
    // (Directly computed `hourPlanetCondition` is already hour-planet accurate.)
    const currentHourPlanet = planetaryData?.currentHour?.planet;
    const alignmentPlanet = alignment?.hourRulerCondition?.planet;
    if (!hourPlanetCondition && currentHourPlanet && alignmentPlanet &&
        currentHourPlanet.toLowerCase() !== alignmentPlanet.toLowerCase()) {
      return undefined;
    }
    const dignityText = getDignityLabel(condition.dignity.type);
    const dignityDetail = `${dignityText} · ${condition.position.sign} ${Math.round(condition.position.degree)}°`;
    const dignityDesc = language === 'ar'
      ? condition.dignity.descriptionAr
      : language === 'fr'
        ? condition.dignity.descriptionFr
        : condition.dignity.description;

    const engine = condition.conditionEngine;
    const engineStatusLabel = engine ? (t(`planetCondition.status.${engine.status}`) || engine.status) : undefined;
    const scoreLabel = t('planetCondition.scoreLabel') || 'Score';
    const engineDetail = engine ? `${scoreLabel}: ${engine.score >= 0 ? '+' : ''}${engine.score}` : undefined;
    const engineReasons = engine
      ? engine.reasons
          .map((k) => t(`planetCondition.reasons.${k}`) || k)
          .filter(Boolean)
      : [];
    const engineDescription = engineReasons.length ? engineReasons.map((r) => `• ${r}`).join('\n') : undefined;

    const houseBadge = transitHouse
      ? transitHouse.houseNumber === 10
        ? t('momentDetail.cards.transit.house_10_angular')
        : `${t('momentDetail.cards.transit.house')} ${transitHouse.houseNumber}${transitHouse.sectorKey === 'angular' ? ` · ${t('momentDetail.cards.transit.angular')}` : transitHouse.sectorKey === 'succedent' ? ` · ${t('momentDetail.cards.transit.succedent')}` : ` · ${t('momentDetail.cards.transit.cadent')}`}`
      : undefined;
    const houseDesc = transitHouse
      ? transitHouse.houseNumber === 10
        ? t('momentDetail.cards.transit.house_10_angular')
        : transitHouse.sectorKey === 'angular'
          ? t('momentDetail.cards.transit.angular')
          : transitHouse.sectorKey === 'succedent'
            ? t('momentDetail.cards.transit.succedent')
            : t('momentDetail.cards.transit.cadent')
      : undefined;

    // Positional power (house + dignity)
    const positionalPct = Math.max(0, Math.min(100, Math.round(condition.overallQuality)));
    const positionalTone: 'good' | 'neutral' | 'warn' =
      condition.ruling === 'excellent' || condition.ruling === 'strong'
        ? 'good'
        : condition.ruling === 'moderate'
          ? 'neutral'
          : 'warn';
    const positionalLabel = condition.ruling === 'excellent'
      ? t('momentDetail.cards.transit.exceptional')
      : condition.ruling === 'strong'
        ? t('momentDetail.cards.transit.strong')
        : condition.ruling === 'moderate'
          ? t('momentDetail.cards.transit.moderate')
          : t('momentDetail.cards.transit.weak');

    // Transit quality (overall planetary strength)
    const transitPct = currentHourTransitData?.finalPower ?? 0;
    const transitQualityTone: 'good' | 'neutral' | 'warn' =
      transitPct >= 80 ? 'good' : transitPct >= 50 ? 'neutral' : 'warn';
    const transitQualityLabel = transitPct >= 90
      ? t('momentDetail.cards.transit.exceptional')
      : transitPct >= 70
        ? t('momentDetail.cards.transit.strong')
        : transitPct >= 50
          ? t('momentDetail.cards.transit.moderate')
          : t('momentDetail.cards.transit.weak');

    return {
      dignityLabel: t('momentDetail.cards.transit.dignity'),
      dignityBadge: dignityText,
      dignityDetail,
      dignityDescription: dignityDesc,
      conditionLabel: t('planetCondition.label'),
      conditionBadge: engineStatusLabel,
      conditionDetail: engineDetail,
      conditionDescription: engineDescription,
      houseLabel: t('momentDetail.cards.transit.house'),
      houseBadge,
      houseDescription: houseDesc,
      positionalLabel: t('momentDetail.cards.transit.positionalPower'),
      positionalDetail: positionalLabel,
      positionalPercent: positionalPct,
      positionalTone,
      positionalSubtext: t('momentDetail.cards.transit.positionalSubtext'),
      transitQualityLabel: t('momentDetail.cards.transit.transitQuality'),
      transitQualityDetail: transitQualityLabel,
      transitQualityPercent: transitPct,
      transitQualityTone,
      transitQualitySubtext: t('momentDetail.cards.transit.transitQualitySubtext'),
    };
  }, [hourPlanetCondition, alignment?.hourRulerCondition, getDignityLabel, language, t, transitHouse, currentHourTransitData, planetaryData?.currentHour?.planet]);

  const factorRows = useMemo(() => {
    if (!timingResult) return undefined;

    const scoreLabel = (score: number) => {
      if (score >= 75) return { text: `${t('momentDetail.cards.analysis.exceptional')} ✓`, color: '#34D399' };
      if (score >= 55) return { text: `${t('momentDetail.cards.analysis.strong')} ✓`, color: '#34D399' };
      if (score >= 40) return { text: t('momentDetail.cards.status.maintain'), color: '#F59E0B' };
      return { text: t('momentDetail.cards.status.hold'), color: '#A78BFA' };
    };

    const elem = scoreLabel(timingResult.layers.elementCompatibility.score);
    
    // Check if same planet (user's ruling planet === current hour planet)
    const currentHourPlanet = planetaryData?.currentHour?.planet?.toLowerCase();
    const isSamePlanet = userPlanetKey && currentHourPlanet && 
      userPlanetKey.toLowerCase() === currentHourPlanet;
    
    // Same-planet hours: higher intensity, not automatic positivity
    const planetLabel = isSamePlanet
      ? { text: t('momentDetail.cards.analysis.highIntensity') || 'High intensity', color: '#F59E0B' }
      : scoreLabel(timingResult.layers.planetaryResonance.score);
    
    const condition = hourPlanetCondition ?? alignment?.hourRulerCondition;
    const transit = condition
      ? condition.ruling === 'excellent'
        ? { text: `${t('momentDetail.cards.analysis.exceptional')} ✓`, color: '#34D399' }
        : condition.ruling === 'strong'
          ? { text: `${t('momentDetail.cards.analysis.strong')} ✓`, color: '#34D399' }
          : condition.ruling === 'moderate'
            ? { text: t('momentDetail.cards.analysis.moderate') || t('momentDetail.cards.status.maintain'), color: '#F59E0B' }
            : { text: t('momentDetail.cards.analysis.weak') || t('momentDetail.cards.status.hold'), color: '#A78BFA' }
      : { text: t('momentDetail.cards.analysis.moderate') || t('momentDetail.cards.status.maintain'), color: '#94A3B8' };

    return [
      {
        icon: '🔥',
        text: t('momentDetail.cards.analysis.elementalHarmony'),
        scoreText: elem.text,
        scoreColor: elem.color,
      },
      {
        // Use "Planetary Resonance" label for same planet (more accurate than "Friendship")
        icon: isSamePlanet ? '⚡' : '🤝',
        text: isSamePlanet 
          ? (t('momentDetail.cards.analysis.planetaryResonance') || t('momentDetail.cards.analysis.planetaryFriendship'))
          : t('momentDetail.cards.analysis.planetaryFriendship'),
        scoreText: planetLabel.text,
        scoreColor: planetLabel.color,
      },
      {
        icon: '⭐',
        text: t('momentDetail.cards.analysis.transitStrength'),
        scoreText: transit.text,
        scoreColor: transit.color,
      },
    ];
  }, [timingResult, t, alignment, hourPlanetCondition, userPlanetKey, planetaryData?.currentHour?.planet]);

  // IMPORTANT: only return early AFTER all hooks above have run.
  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}
        >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B7355" />
          <Text style={styles.loadingText}>{t('common.loading')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!alignment) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}
        >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={DarkTheme.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('momentDetail.title')}</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>✨</Text>
          <Text style={styles.emptyTitle}>{t('momentDetail.noName')}</Text>
          <Text style={styles.emptyMessage}>{t('momentDetail.addNameMessage')}</Text>
          <TouchableOpacity
            style={styles.addNameButton}
            onPress={() => router.push('/(tabs)/name-destiny')}
            activeOpacity={0.7}
          >
            <Text style={styles.addNameButtonText}>{t('momentDetail.goToNameDestiny')}</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}
      >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={DarkTheme.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('momentDetail.title')}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Keep timing engine running to power status + analysis cards */}
        <View style={styles.hiddenAnalysis}>
          <TimingAnalysisSection
            context="moment"
            location={coords ?? undefined}
            compact
            onAnalysisComplete={setTimingResult}
          />
        </View>

        <StatusOverviewCard
          title={t('momentDetail.title')}
          subtitle={statusSubtitle}
          badgeText={statusBadgeText}
          badgeColor={statusColor}
          timeRemainingLabel={hourEndsInLabel}
        />

        <MomentAnalysisCard
          currentHour={currentHourModel}
          userPlanet={userPlanetModel}
          transit={transitModel}
          transitFooter={
            currentHourTransitData?.payload ? (
              <View style={styles.transitFooterContainer}>
                {currentHourTransitData.finalPower > 0 && transitModel && (
                  <Text style={styles.transitExplanation}>
                    {t('momentDetail.cards.transit.explanation', {
                      positional: transitModel.positionalDetail,
                      quality: currentHourTransitData.qualityLabel,
                    })}
                  </Text>
                )}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    router.push({
                      pathname: '/(tabs)/planet-transit-details',
                      params: {
                        type: 'transit',
                        payload: currentHourTransitData.payload,
                        isPersonal: 'false',
                      },
                    });
                  }}
                  style={styles.transitLink}
                >
                  <Text style={styles.transitLinkText}>
                    {t('momentDetail.cards.transit.viewFullAnalysis', {
                      planet: planetaryData?.currentHour?.planet || 'planet',
                    })}
                  </Text>
                  <Text style={styles.transitLinkArrow}>→</Text>
                </TouchableOpacity>
              </View>
            ) : undefined
          }
          factors={factorRows}
          sectionLabels={{
            currentHour: t('momentDetail.cards.currentHour'),
            userPlanet: t('momentDetail.cards.yourPlanet'),
            transitConditions: t('momentDetail.cards.transitConditions'),
            alignmentAnalysis: t('momentDetail.cards.alignmentAnalysis'),
          }}
        />

        <MomentGuidanceCard
          title={`✨ ${t('momentDetail.cards.whatThisMeans')}`}
          summary={(() => {
            if (hourWording) {
              const parts: string[] = [];
              const status = t(hourWording.statusKey);
              const meaning = t(hourWording.meaningKey);
              const note = t(hourWording.noteKey);
              const powerVsPermission = t('planetaryHours.wording.shared.powerVsPermission');
              const isSamePlanet = !!userPlanetKey && userPlanetKey === hourWording.planetKey;
              const samePlanet = isSamePlanet ? t('planetaryHours.wording.shared.samePlanetIntensity') : '';

              if (status && meaning) parts.push(`${status} — ${meaning}`);
              else if (meaning) parts.push(meaning);
              if (note) parts.push(note);
              if (powerVsPermission) parts.push(powerVsPermission);
              if (samePlanet) parts.push(samePlanet);

              return parts.filter(Boolean).join('\n');
            }
            return timingResult
              ? getLocalizedLayerReasoning(timingResult)
              : (alignment.reasoning
                  ? (language === 'ar' ? alignment.reasoning.ar : language === 'fr' ? alignment.reasoning.fr : alignment.reasoning.en)
                  : t(alignment.shortHintKey));
          })()}
          excellentForTitle={hourWording
            ? `🟢 ${t('dailyEnergy.planetaryJudgment.bestForLabel')}`
            : (classicalJudgment
                ? `🟢 ${t('dailyEnergy.planetaryJudgment.bestForLabel')}`
                : `🟢 ${t('momentDetail.cards.excellentFor')}`)}
          excellentForItems={hourWording
            ? hourWording.bestForKeys.map((k) => t(k)).filter(Boolean)
            : (classicalJudgment
                ? classicalJudgment.allowedDomains.map((k) => t(k)).filter(Boolean)
                : (timingResult?.enhancements ?? []).slice(0, 4).map(getLocalizedEnhancementText))}
          avoidTitle={hourWording
            ? `⚠️ ${t('dailyEnergy.planetaryJudgment.avoidLabel')}`
            : (classicalJudgment
                ? `⚠️ ${t('dailyEnergy.planetaryJudgment.avoidLabel')}`
                : (timingResult?.cautions?.length ? `⚠️ ${t('momentDetail.cards.avoidNow')}` : undefined))}
          avoidItems={hourWording
            ? hourWording.avoidKeys.map((k) => t(k)).filter(Boolean)
            : (classicalJudgment
                ? classicalJudgment.avoidDomains.map((k) => t(k)).filter(Boolean)
                : (timingResult?.cautions ?? []).slice(0, 3))}
          timingNote={planetaryData
            ? `${t('momentDetail.cards.nextHour')}: ${t(`planets.${planetaryData.nextHour.planet.toLowerCase()}`)} (${getElementLabel(planetaryData.nextHour.planetInfo.element)}) ${t('momentDetail.timeline.in')} ${formatTimeUntil(planetaryData.currentHour.endTime)}`
            : undefined}
        />

        <CollapsibleSection
          title={`📅 ${t('momentDetail.cards.showTimeline')}`}
          subtitle={t('momentDetail.timeline.nextOptimal')}
          hideHint
        >
          <View style={styles.timeline}>
            {alignment.nextWindows && alignment.nextWindows.length > 0 ? (
              alignment.nextWindows
                .slice(0, 12)
                .map((window, idx) => {
                  // Use SimpleAlignmentBadge for each timeline window (consistent with header)
                  const burjIdx = dobZodiacDerived?.burjIndex ?? profile?.derived?.burjIndex;
                  const windowUserRuler = typeof burjIdx === 'number' ? getRulingPlanetFromBurj(burjIdx) : undefined;
                  const windowBadge = getAlignmentBadge(window.planet, windowUserRuler);
                  const windowLabelKey = getAlignmentLabelKey(windowBadge.tier);
                  return (
                  <View key={idx} style={styles.timelineItem}>
                    <View
                      style={[
                        styles.timelineStatus,
                        { backgroundColor: windowBadge.color },
                      ]}
                    >
                      <Text style={styles.timelineStatusText}>
                        {t(windowLabelKey) || windowBadge.label}
                      </Text>
                    </View>
                    <View style={styles.timelineContent}>
                      <View style={styles.timelineHeader}>
                        <Text style={styles.timelineDay}>{formatWindowDay(window)}</Text>
                        <Text style={styles.timelineDayName}>{window.planet}</Text>
                      </View>
                      <View style={styles.timelineElement}>
                        <Text style={styles.timelineElementIcon}>{getElementIcon(window.element)}</Text>
                        <Text style={styles.timelineElementText}>{getElementLabel(window.element)}</Text>
                      </View>
                      <Text style={styles.timelineTime}>
                        {new Date(window.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    </View>
                  </View>
                  );
                })
            ) : (
              <Text style={styles.noWindows}>{t('momentDetail.timeline.noOptimalWindows')}</Text>
            )}
          </View>
        </CollapsibleSection>


        <View style={styles.disclaimer}>
          <Ionicons name="shield-checkmark-outline" size={16} color={DarkTheme.textTertiary} />
          <Text style={styles.disclaimerText}>{t('momentDetail.disclaimer')}</Text>
        </View>

        <AdBanner />
        <View style={{ height: 16 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DarkTheme.screenBackground,
  },
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: DarkTheme.textPrimary,
  },
  placeholder: {
    width: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
  },
  loadingText: {
    fontSize: 14,
    color: DarkTheme.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: DarkTheme.textPrimary,
    marginBottom: Spacing.sm,
  },
  emptyMessage: {
    fontSize: 14,
    color: DarkTheme.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  addNameButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: '#8B7355',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: 12,
  },
  addNameButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  summaryCard: {
    padding: Spacing.lg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.10)',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    gap: Spacing.md,
    overflow: 'hidden',
  },
  summaryAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  summaryIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryPlanetGlyph: {
    fontSize: 18,
    fontWeight: '800',
  },
  summaryHeaderText: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: DarkTheme.textPrimary,
  },
  summarySubtitle: {
    fontSize: 14,
    color: DarkTheme.textSecondary,
    marginTop: 2,
  },
  summaryChipsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  summaryChip: {
    flex: 1,
    padding: Spacing.sm,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.10)',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    gap: 4,
  },
  summaryChipWide: {
    padding: Spacing.sm,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.10)',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    gap: 4,
  },
  summaryChipLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: DarkTheme.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  summaryChipValue: {
    fontSize: 14,
    fontWeight: '800',
    color: DarkTheme.textPrimary,
  },
  summaryChipSubValue: {
    fontSize: 12,
    fontWeight: '600',
    color: DarkTheme.textSecondary,
  },
  scoreDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: Spacing.sm,
    marginTop: Spacing.xs,
  },
  scoreText: {
    fontSize: 32,
    fontWeight: '700',
  },
  scoreLabel: {
    fontSize: 14,
    color: DarkTheme.textSecondary,
    fontWeight: '500',
  },
  summaryMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  statusPillText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  timestampLabel: {
    fontSize: 12,
    color: DarkTheme.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  timestampValue: {
    fontSize: 14,
    fontWeight: '600',
    color: DarkTheme.textSecondary,
  },
  equationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
    paddingVertical: Spacing.sm,
  },
  equationChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  equationChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: DarkTheme.textSecondary,
  },
  equationOperator: {
    fontSize: 16,
    fontWeight: '700',
    color: DarkTheme.textTertiary,
  },
  windowInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: 'rgba(139, 115, 85, 0.1)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
    marginBottom: Spacing.sm,
  },
  windowInfoText: {
    fontSize: 13,
    color: DarkTheme.textSecondary,
    fontWeight: '500',
  },
  timelineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: Spacing.sm,
    borderRadius: 8,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  timelineButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: DarkTheme.textSecondary,
  },
  timeline: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    padding: Spacing.md,
    borderRadius: 12,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: DarkTheme.textPrimary,
    marginBottom: Spacing.xs,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: Spacing.sm,
    padding: Spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  timelineStatus: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  timelineStatusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  timelineContent: {
    flex: 1,
    gap: Spacing.xs,
  },
  timelineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timelineDay: {
    fontSize: 14,
    fontWeight: '600',
    color: DarkTheme.textPrimary,
  },
  timelineDayName: {
    fontSize: 12,
    color: DarkTheme.textTertiary,
  },
  timelineElement: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  timelineElementIcon: {
    fontSize: 16,
  },
  timelineElementText: {
    fontSize: 13,
    color: DarkTheme.textSecondary,
  },
  timelineTime: {
    fontSize: 12,
    color: DarkTheme.textTertiary,
    fontWeight: '500',
  },
  noWindows: {
    fontSize: 13,
    color: DarkTheme.textTertiary,
    textAlign: 'center',
    paddingVertical: Spacing.md,
    fontStyle: 'italic',
  },
  elementsGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  elementCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    padding: Spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.10)',
    gap: Spacing.sm,
  },

  advancedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  advancedHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    flex: 1,
  },
  advancedHeaderAction: {
    fontSize: 13,
    fontWeight: '700',
    color: '#8B7355',
  },
  hiddenAnalysis: {
    height: 0,
    opacity: 0,
    overflow: 'hidden',
  },
  elementCardLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: DarkTheme.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  elementDisplay: {
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
  },
  elementIcon: {
    fontSize: 32,
  },
  elementName: {
    fontSize: 16,
    fontWeight: '700',
    color: DarkTheme.textPrimary,
  },
  elementDescription: {
    fontSize: 13,
    lineHeight: 18,
    color: DarkTheme.textSecondary,
    textAlign: 'center',
  },
  section: {
    gap: Spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: DarkTheme.textPrimary,
  },
  sectionCard: {
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  bulletRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingLeft: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  bulletDot: {
    fontSize: 16,
    fontWeight: '700',
    color: '#8B7355',
    lineHeight: 20,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    color: DarkTheme.textSecondary,
    lineHeight: 20,
  },
  guidanceBlock: {
    gap: Spacing.xs,
    marginTop: Spacing.xs,
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  guidanceBest: {
    borderColor: 'rgba(16, 185, 129, 0.35)',
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
  },
  guidanceAvoid: {
    borderColor: 'rgba(148, 163, 184, 0.3)',
    backgroundColor: 'rgba(148, 163, 184, 0.08)',
  },
  guidanceListTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: DarkTheme.textPrimary,
    marginBottom: 4,
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    padding: Spacing.md,
    borderRadius: 12,
    marginTop: Spacing.md,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 12,
    color: DarkTheme.textTertiary,
    lineHeight: 18,
  },
  transitFooterContainer: {
    gap: 8,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  transitExplanation: {
    fontSize: 11,
    color: DarkTheme.textTertiary,
    lineHeight: 15,
    fontStyle: 'italic',
  },
  transitLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  transitLinkText: {
    fontSize: 12,
    color: '#8B7355',
    fontWeight: '600',
  },
  transitLinkArrow: {
    fontSize: 12,
    color: '#8B7355',
  },
  planetaryHourCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  planetaryHourHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planetaryHourLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: DarkTheme.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  hourBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  hourBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  planetaryHourContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  planetSymbol: {
    fontSize: 48,
  },
  planetInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  planetName: {
    fontSize: 20,
    fontWeight: '700',
    color: DarkTheme.textPrimary,
  },
  planetArabic: {
    fontSize: 14,
    color: DarkTheme.textSecondary,
  },
  elementBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  elementBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  timeRange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    flexWrap: 'wrap',
  },
  timeRangeText: {
    fontSize: 13,
    color: DarkTheme.textSecondary,
    fontWeight: '500',
  },
  progressBlock: {
    marginTop: Spacing.sm,
    gap: 6,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 12,
    color: DarkTheme.textTertiary,
    fontWeight: '600',
  },
  progressValue: {
    fontSize: 13,
    color: DarkTheme.textSecondary,
    fontWeight: '600',
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#8B7355',
  },

  // --------------------------------------------------------------------------
  // Authentic (non-percentage) UI
  // --------------------------------------------------------------------------
  glassCard: {
    padding: Spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.10)',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    gap: Spacing.sm,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  cardTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: DarkTheme.textPrimary,
  },
  cardBodyText: {
    fontSize: 14,
    color: DarkTheme.textSecondary,
    lineHeight: 20,
  },
  sectionSubHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: '700',
    color: DarkTheme.textPrimary,
  },
  authenticMetaRow: {
    gap: 6,
    marginTop: 2,
  },
  authenticMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authenticMetaLabel: {
    fontSize: 13,
    color: DarkTheme.textTertiary,
    fontWeight: '600',
  },
  planetSymbolLarge: {
    fontSize: 44,
  },
  conditionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  conditionHeaderText: {
    flex: 1,
    gap: 2,
  },
  conditionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  conditionItem: {
    flexGrow: 1,
    minWidth: 120,
    padding: Spacing.sm,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    gap: 4,
  },
  conditionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: DarkTheme.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  conditionValue: {
    fontSize: 14,
    fontWeight: '700',
    color: DarkTheme.textPrimary,
  },
  conditionInterpretationLabel: {
    marginTop: Spacing.xs,
    fontSize: 12,
    fontWeight: '700',
    color: DarkTheme.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  conditionInterpretation: {
    fontSize: 14,
    color: DarkTheme.textSecondary,
    lineHeight: 20,
  },
  collapsibleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  collapsibleTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: DarkTheme.textPrimary,
  },
  collapsibleAction: {
    fontSize: 13,
    fontWeight: '700',
    color: '#8B7355',
  },
  factorRow: {
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
    gap: 6,
  },
  factorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  factorTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
    color: DarkTheme.textPrimary,
  },
  factorPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
  },
  factorPillText: {
    fontSize: 12,
    fontWeight: '800',
  },
  factorDescription: {
    fontSize: 13,
    color: DarkTheme.textSecondary,
    lineHeight: 18,
  },
  guidanceDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginVertical: Spacing.sm,
  },
  mutedText: {
    fontSize: 13,
    color: DarkTheme.textTertiary,
    fontStyle: 'italic',
    lineHeight: 18,
  },

  countdown: {
    fontSize: 12,
    color: DarkTheme.textTertiary,
    fontStyle: 'italic',
  },
});
