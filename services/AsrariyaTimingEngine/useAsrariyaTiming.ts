/**
 * Asrariya Timing Engine - React Hook
 * ====================================
 * Easy-to-use hook for integrating timing analysis into components
 * 
 * @module AsrariyaTimingEngine/useAsrariyaTiming
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import {
  analyzeTimingForPractice,
  quickTimingCheck,
  findNextOptimalWindow,
  type AsrariyaTimingResult,
  type PracticeCategory,
  type UserIntent,
  type AlternativeTiming,
} from './index';

export interface UseAsrariyaTimingOptions {
  /** Auto-refresh interval in milliseconds (0 to disable) */
  refreshInterval?: number;
  
  /** User's location for accurate planetary hours */
  location?: { latitude: number; longitude: number };
  
  /** Whether to auto-start analysis */
  autoAnalyze?: boolean;
}

export interface UseAsrariyaTimingReturn {
  /** Full timing analysis result */
  result: AsrariyaTimingResult | null;
  
  /** Is analysis in progress? */
  isLoading: boolean;
  
  /** Any error that occurred */
  error: Error | null;
  
  /** Trigger new analysis */
  analyze: (intent: UserIntent) => Promise<void>;
  
  /** Quick check for a practice category */
  quickCheck: (category: PracticeCategory) => Promise<{
    isGoodTime: boolean;
    summary: string;
    score: number;
  }>;
  
  /** Find next optimal window */
  findOptimal: (intent: UserIntent, lookAheadHours?: number) => Promise<AlternativeTiming | null>;
  
  /** Clear current result */
  clear: () => void;
  
  /** Last updated timestamp */
  lastUpdated: Date | null;
}

/**
 * React hook for Asrariya Timing Engine
 * 
 * @example
 * ```tsx
 * function PracticeTimingScreen() {
 *   const { result, isLoading, analyze, quickCheck } = useAsrariyaTiming({
 *     location: userLocation,
 *     refreshInterval: 60000, // Refresh every minute
 *   });
 *   
 *   useEffect(() => {
 *     analyze({ category: 'protection', divineName: 'Ya Qawiyy' });
 *   }, []);
 *   
 *   if (isLoading) return <LoadingSpinner />;
 *   
 *   return (
 *     <View>
 *       <Text>Score: {result?.overallScore}</Text>
 *       <Text>Recommendation: {result?.shortSummary}</Text>
 *     </View>
 *   );
 * }
 * ```
 */
export function useAsrariyaTiming(
  options: UseAsrariyaTimingOptions = {}
): UseAsrariyaTimingReturn {
  const { refreshInterval = 0, location, autoAnalyze = false } = options;
  
  const { profile } = useProfile();
  const [result, setResult] = useState<AsrariyaTimingResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  const lastIntentRef = useRef<UserIntent | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  const analyze = useCallback(async (intent: UserIntent) => {
    if (!profile) {
      setError(new Error('User profile not available'));
      return;
    }
    
    setIsLoading(true);
    setError(null);
    lastIntentRef.current = intent;
    
    try {
      const analysisResult = await analyzeTimingForPractice(
        profile,
        intent,
        { location }
      );
      
      setResult(analysisResult);
      setLastUpdated(new Date());
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Analysis failed'));
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  }, [profile, location]);
  
  const quickCheck = useCallback(async (category: PracticeCategory) => {
    if (!profile) {
      return { isGoodTime: false, summary: 'Profile not available', score: 0 };
    }
    
    try {
      return await quickTimingCheck(profile, category, location);
    } catch {
      return { isGoodTime: false, summary: 'Check failed', score: 0 };
    }
  }, [profile, location]);
  
  const findOptimal = useCallback(async (
    intent: UserIntent,
    lookAheadHours = 24
  ): Promise<AlternativeTiming | null> => {
    if (!profile) return null;
    
    try {
      return await findNextOptimalWindow(profile, intent, {
        location,
        lookAheadHours,
      });
    } catch {
      return null;
    }
  }, [profile, location]);
  
  const clear = useCallback(() => {
    setResult(null);
    setError(null);
    lastIntentRef.current = null;
  }, []);
  
  // Auto-refresh if interval is set and we have a previous intent
  useEffect(() => {
    if (refreshInterval > 0 && lastIntentRef.current) {
      intervalRef.current = setInterval(() => {
        if (lastIntentRef.current) {
          analyze(lastIntentRef.current);
        }
      }, refreshInterval);
      
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [refreshInterval, analyze]);
  
  // Auto-analyze with general category if enabled
  useEffect(() => {
    if (autoAnalyze && profile && !result) {
      analyze({ category: 'general' });
    }
  }, [autoAnalyze, profile, result, analyze]);
  
  return {
    result,
    isLoading,
    error,
    analyze,
    quickCheck,
    findOptimal,
    clear,
    lastUpdated,
  };
}

/**
 * Hook for simple timing badges (e.g., on home screen)
 */
export function useTimingBadge(category: PracticeCategory = 'general') {
  const { profile } = useProfile();
  const [badge, setBadge] = useState<{
    isGoodTime: boolean;
    summary: string;
    score: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    let mounted = true;
    
    const check = async () => {
      if (!profile) {
        setBadge(null);
        setIsLoading(false);
        return;
      }
      
      try {
        const result = await quickTimingCheck(profile, category);
        if (mounted) {
          setBadge(result);
        }
      } catch {
        if (mounted) {
          setBadge(null);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };
    
    check();
    
    // Refresh every 5 minutes
    const interval = setInterval(check, 5 * 60 * 1000);
    
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [profile, category]);
  
  return { badge, isLoading };
}
