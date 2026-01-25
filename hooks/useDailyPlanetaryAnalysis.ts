/**
 * Hook: Use Daily Planetary Analysis
 * ===================================
 * 
 * Fetches real-time planetary data and calculates enhanced strength analysis
 */

import {
    analyzeDailyPlanets,
    calculateDailyPlanetaryScore,
    findBestHoursToday,
    type DailyPlanetaryAnalysis,
} from '@/services/DailyPlanetaryAnalysisService';
import { getAllTransits } from '@/services/TransitService';
import { useEffect, useState } from 'react';

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
 * Automatically refeshes every 5 minutes
 */
export function useDailyPlanetaryAnalysis(): UseDailyAnalysisResult {
  const [analysis, setAnalysis] = useState<DailyPlanetaryAnalysis | null>(null);
  const [dailyScore, setDailyScore] = useState<number | null>(null);
  const [bestHours, setBestHours] = useState<ReturnType<typeof findBestHoursToday> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = async () => {
    try {
      setLoading(true);
      setError(null);

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

      setAnalysis(analysisResult);
      setDailyScore(calculateDailyPlanetaryScore(analysisResult));
      setBestHours(findBestHoursToday(analysisResult));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setAnalysis(null);
      setDailyScore(null);
      setBestHours(null);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and setup refresh interval
  useEffect(() => {
    refresh();

    // Refresh every 5 minutes
    const interval = setInterval(refresh, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

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
          transits.Sun
        );

        if (isMounted) {
          setScore(calculateDailyPlanetaryScore(analysis));
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
