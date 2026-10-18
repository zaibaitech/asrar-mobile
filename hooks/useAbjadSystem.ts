/**
 * App-wide Abjad system for React components: re-renders when the user switches.
 */
import { useCallback, useEffect, useSyncExternalStore } from 'react';
import {
  AbjadSystemKey,
  getAbjadMap,
  getActiveAbjadSystem,
  subscribeAbjadSystem,
} from '../constants/abjad-maps';
import { hydrateAbjadSystem, setAbjadSystemPreference } from '../services/AbjadSystemPreference';

export function useAbjadSystem(): {
  system: AbjadSystemKey;
  abjad: Record<string, number>;
  setSystem: (system: AbjadSystemKey) => void;
} {
  const system = useSyncExternalStore(subscribeAbjadSystem, getActiveAbjadSystem, getActiveAbjadSystem);
  useEffect(() => {
    hydrateAbjadSystem();
  }, []);
  const setSystem = useCallback((next: AbjadSystemKey) => {
    void setAbjadSystemPreference(next);
  }, []);
  return { system, abjad: getAbjadMap(system), setSystem };
}
