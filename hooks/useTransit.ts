/**
 * Transit Hooks
 * =============
 * 
 * React hooks for accessing real planetary transit data
 */

import { Planet } from '@/services/PlanetaryHoursService';
import {
    getAllTransits,
    getTransit,
    refreshTransits,
} from '@/services/TransitService';
import {
    AllPlanetTransits,
    PlanetTransit
} from '@/types/planetary-systems';
import { useCallback, useEffect, useState } from 'react';

// ============================================================================
// SINGLE PLANET TRANSIT HOOK
// ============================================================================

export interface UsePlanetTransitResult {
  /** Transit data for the planet */
  transit: PlanetTransit | null;
  
  /** Loading state */
  loading: boolean;
  
  /** Error state */
  error: string | null;
  
  /** Refreshing state (user-triggered refresh) */
  refreshing: boolean;
  
  /** Manually refresh transit data */
  refresh: () => Promise<void>;
}

/**
 * Hook to get transit data for a specific planet
 */
export function usePlanetTransit(planet: Planet): UsePlanetTransitResult {
  const [transit, setTransit] = useState<PlanetTransit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  const loadTransit = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getTransit(planet);
      setTransit(data);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load transit');
      if (__DEV__) {
        console.error('[usePlanetTransit] Load error:', err);
      }
    } finally {
      setLoading(false);
    }
  }, [planet]);
  
  const refresh = useCallback(async () => {
    try {
      setRefreshing(true);
      setError(null);
      
      const fresh = await refreshTransits();
      setTransit(fresh[planet]);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh transit');
      if (__DEV__) {
        console.error('[usePlanetTransit] Refresh error:', err);
      }
    } finally {
      setRefreshing(false);
    }
  }, [planet]);
  
  useEffect(() => {
    loadTransit();
  }, [loadTransit]);
  
  return {
    transit,
    loading,
    error,
    refreshing,
    refresh,
  };
}

// ============================================================================
// ALL TRANSITS HOOK
// ============================================================================

export interface UseAllTransitsResult {
  /** All planet transits */
  transits: AllPlanetTransits | null;
  
  /** Loading state */
  loading: boolean;
  
  /** Error state */
  error: string | null;
  
  /** Refreshing state */
  refreshing: boolean;
  
  /** Manually refresh all transits */
  refresh: () => Promise<void>;
  
  /** Get transit for a specific planet */
  getTransitFor: (planet: Planet) => PlanetTransit | null;
}

/**
 * Hook to get transits for all planets
 */
export function useAllTransits(): UseAllTransitsResult {
  const [transits, setTransits] = useState<AllPlanetTransits | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  const loadTransits = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getAllTransits();
      setTransits(data);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load transits');
      if (__DEV__) {
        console.error('[useAllTransits] Load error:', err);
      }
    } finally {
      setLoading(false);
    }
  }, []);
  
  const refresh = useCallback(async () => {
    try {
      setRefreshing(true);
      setError(null);
      
      const fresh = await refreshTransits();
      setTransits(fresh);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh transits');
      if (__DEV__) {
        console.error('[useAllTransits] Refresh error:', err);
      }
    } finally {
      setRefreshing(false);
    }
  }, []);
  
  const getTransitFor = useCallback(
    (planet: Planet): PlanetTransit | null => {
      return transits ? transits[planet] : null;
    },
    [transits]
  );
  
  useEffect(() => {
    loadTransits();
  }, [loadTransits]);
  
  return {
    transits,
    loading,
    error,
    refreshing,
    refresh,
    getTransitFor,
  };
}

// ============================================================================
// CURRENT HOUR PLANET TRANSIT HOOK
// ============================================================================

export interface UseCurrentHourTransitResult {
  /** Transit of the planet ruling the current planetary hour */
  transit: PlanetTransit | null;
  
  /** The planet ruling the current hour */
  currentPlanet: Planet | null;
  
  /** Loading state */
  loading: boolean;
  
  /** Error state */
  error: string | null;
}

/**
 * Hook to get the transit of the planet ruling the current planetary hour
 * This combines the hourly planetary hours with their long-term transits
 * 
 * @param currentHourPlanet - The planet ruling the current hour
 */
export function useCurrentHourTransit(
  currentHourPlanet: Planet | null
): UseCurrentHourTransitResult {
  const [transit, setTransit] = useState<PlanetTransit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!currentHourPlanet) {
      setTransit(null);
      setLoading(false);
      return;
    }
    
    const loadTransit = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await getTransit(currentHourPlanet);
        setTransit(data);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load transit');
        if (__DEV__) {
          console.error('[useCurrentHourTransit] Load error:', err);
        }
      } finally {
        setLoading(false);
      }
    };
    
    loadTransit();
  }, [currentHourPlanet]);
  
  return {
    transit,
    currentPlanet: currentHourPlanet,
    loading,
    error,
  };
}
