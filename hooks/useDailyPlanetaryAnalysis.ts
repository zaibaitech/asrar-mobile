/**
 * Hook: Use Daily Planetary Analysis
 * ===================================
 * 
 * Fetches real-time planetary data and calculates enhanced strength analysis
 * NOTE: This hook is shared across multiple screens and manages in-flight requests
 * to avoid duplicate API calls when multiple components mount simultaneously
 */

import {
    analyzeDailyPlanets,
    calculateDailyPlanetaryScore,
    findBestHoursToday,
    getDailyScoreBreakdown,
    type DailyPlanetaryAnalysis,
} from '@/services/DailyPlanetaryAnalysisService';
import { getAllTransits } from '@/services/TransitService';
import { useCallback, useEffect, useRef, useState } from 'react';

// Global cache for analysis results across all hook instances
let globalAnalysisCache: DailyPlanetaryAnalysis | null = null;
let globalAnalysisCacheTime = 0;
let globalInflightPromise: Promise<DailyPlanetaryAnalysis | null> | null = null;

// Cache TTL: 30 seconds (shorter than full 5-minute transit cache, but still reduces duplicate work)
const ANALYSIS_CACHE_TTL_MS = 30 * 1000;

export interface UseDailyAnalysisResult {
  analysis: DailyPlanetaryAnalysis | null;
  dailyScore: number | null;
  bestHours: ReturnType<typeof findBestHoursToday> | null;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

/**
 * Fetch and analyze today's planetary positions
 * Automatically refreshes every 5 minutes
 * Dedupes concurrent requests across multiple component instances
 */
export function useDailyPlanetaryAnalysis(): UseDailyAnalysisResult {
  const [analysis, setAnalysis] = useState<DailyPlanetaryAnalysis | null>(null);
  const [dailyScore, setDailyScore] = useState<number | null>(null);
  const [bestHours, setBestHours] = useState<ReturnType<typeof findBestHoursToday> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Track if component is mounted to avoid memory leaks
  const isMountedRef = useRef(true);

  const refresh = useCallback(async () => {
    try {
      // Check if we have a fresh analysis in global cache
      const now = Date.now();
      if (globalAnalysisCache && (now - globalAnalysisCacheTime) < ANALYSIS_CACHE_TTL_MS) {
        if (process.env.NODE_ENV === 'development') {
          console.log('[useDailyPlanetaryAnalysis] Using global cache (age: ' + (now - globalAnalysisCacheTime) + 'ms)');
        }
        if (isMountedRef.current) {
          setAnalysis(globalAnalysisCache);
          setDailyScore(globalAnalysisCache.dailyScore ?? null);
          setBestHours(findBestHoursToday(globalAnalysisCache));
          setLoading(false);
        }
        return;
      }

      // If another instance is already fetching, wait for it
      if (globalInflightPromise) {
        if (process.env.NODE_ENV === 'development') {
          console.log('[useDailyPlanetaryAnalysis] Waiting for in-flight request...');
        }
        const result = await globalInflightPromise;
        if (isMountedRef.current && result) {
          setAnalysis(result);
          setDailyScore(result.dailyScore ?? null);
          setBestHours(findBestHoursToday(result));
          setLoading(false);
        }
        return;
      }

      // Kick off fresh fetch
      if (isMountedRef.current) {
        setLoading(true);
        setError(null);
      }

      globalInflightPromise = (async () => {
        try {
          // Fetch current planetary positions
          const transits = await getAllTransits();

          if (!transits) {
            throw new Error('No planetary data available');
          }

          // Create position map for analysis
          const planetPositions = {
            Sun: transits.Sun,
            Moon: transits.Moon,
            Mercury: transits.Mercury,
            Venus: transits.Venus,
            Mars: transits.Mars,
            Jupiter: transits.Jupiter,
            Saturn: transits.Saturn,
          };

          // Analyze planetary positions (includes day ruling planet)
          const analysisResult = analyzeDailyPlanets(
            planetPositions,
            transits.Sun,
            new Date() // Pass current date for day ruler calculation
          );

          // Calculate weighted daily score and breakdown
          // CRITICAL: Uses 50% day ruler + 30% moon + 20% others formula
          const currentDate = new Date();
          const dailyScoreValue = calculateDailyPlanetaryScore(analysisResult, currentDate);
          const breakdown = getDailyScoreBreakdown(analysisResult, currentDate);
          
          // IMPORTANT: Attach score to analysis object for frontend consumption
          // Frontend: getDailyEnergyScore() returns this weighted value (56% not 51%)
          analysisResult.dailyScore = dailyScoreValue;
          analysisResult.scoreBreakdown = breakdown;
          
          // Debug logging to verify weighted calculation is applied correctly
          if (process.env.NODE_ENV === 'development') {
            console.log('[Daily Planetary Analysis] Weighted score:', dailyScoreValue, '% (50% day ruler + 30% moon + 20% others)');
            console.log('[Daily Planetary Analysis] Breakdown:', breakdown);
          }

          // Update global cache
          globalAnalysisCache = analysisResult;
          globalAnalysisCacheTime = Date.now();

          // Update all mounted instances
          if (isMountedRef.current) {
            setAnalysis(analysisResult);
            setDailyScore(dailyScoreValue);
            setBestHours(findBestHoursToday(analysisResult));
          }

          return analysisResult;
        } catch (err) {
          const error = err instanceof Error ? err : new Error('Unknown error');
          if (isMountedRef.current) {
            setError(error);
            setAnalysis(null);
            setDailyScore(null);
            setBestHours(null);
          }
          throw error;
        } finally {
          globalInflightPromise = null;
          if (isMountedRef.current) {
            setLoading(false);
          }
        }
      })();

      await globalInflightPromise;
    } catch (err) {
      // Already handled in the promise
    }
  }, []);

  // Initial fetch and setup refresh interval
  useEffect(() => {
    refresh();

    // Refresh every 5 minutes
    const interval = setInterval(refresh, 5 * 60 * 1000);

    return () => {
      clearInterval(interval);
      isMountedRef.current = false;
    };
  }, [refresh]);

  return {
    analysis,
    dailyScore,
    bestHours,
    loading,
    error,
    refresh,
  };
}

/**
 * Lightweight version for quick checks
 */
export function useDailyScoreOnly() {
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const transits = await getAllTransits();
        if (!transits) return;

        const analysis = analyzeDailyPlanets(
          {
            Sun: transits.Sun,
            Moon: transits.Moon,
            Mercury: transits.Mercury,
            Venus: transits.Venus,
            Mars: transits.Mars,
            Jupiter: transits.Jupiter,
            Saturn: transits.Saturn,
          },
          transits.Sun,
          new Date()
        );

        if (isMounted) {
          setScore(calculateDailyPlanetaryScore(analysis, new Date()));
          setLoading(false);
        }
      } catch {
        if (isMounted) {
          setScore(null);
          setLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  return { score, loading };
}
