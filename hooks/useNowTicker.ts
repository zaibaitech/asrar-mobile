/**
 * useNowTicker Hook
 * ==================
 * Provides a real-time updating `now` timestamp that updates every second
 * Used for countdown timers and live time displays
 */

import { useEffect, useState } from 'react';

/**
 * Hook that returns the current time and updates it every second
 * @param intervalMs - Update interval in milliseconds (default: 1000ms)
 * @returns Current Date object that updates at the specified interval
 */
export function useNowTicker(intervalMs: number = 1000): Date {
  const [now, setNow] = useState(() => new Date());
  
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, intervalMs);
    
    return () => clearInterval(interval);
  }, [intervalMs]);
  
  return now;
}
