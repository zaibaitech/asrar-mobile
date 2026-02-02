/**
 * useNowTicker Hook
 * ==================
 * Provides a real-time updating `now` timestamp that updates at specified interval
 * Used for countdown timers and live time displays
 * 
 * BATTERY OPTIMIZATION (Feb 2026):
 * - Pauses when app is backgrounded via AppState listener
 * - Resumes with fresh timestamp when app returns to foreground
 */

import { useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

/**
 * Hook that returns the current time and updates it at specified interval
 * Automatically pauses when app is backgrounded to save battery
 * 
 * @param intervalMs - Update interval in milliseconds (default: 1000ms)
 * @returns Current Date object that updates at the specified interval
 */
export function useNowTicker(intervalMs: number = 1000): Date {
  const [now, setNow] = useState(() => new Date());
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  useEffect(() => {
    // Start the interval
    const startInterval = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = setInterval(() => {
        // Only update if app is active
        if (appStateRef.current === 'active') {
          setNow(new Date());
        }
      }, intervalMs);
    };
    
    // Handle app state changes
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      const wasBackground = appStateRef.current !== 'active';
      appStateRef.current = nextAppState;
      
      if (nextAppState === 'active') {
        // App came to foreground - update time immediately and restart interval
        setNow(new Date());
        if (wasBackground) {
          startInterval();
        }
      } else {
        // App went to background - clear interval to save battery
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    };
    
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    // Start interval if app is active
    if (appStateRef.current === 'active') {
      startInterval();
    }
    
    return () => {
      subscription.remove();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [intervalMs]);
  
  return now;
}
