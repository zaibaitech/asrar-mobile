/**
 * Persists the app-wide Abjad system (Maghribi default / Mashriqi) in AsyncStorage.
 * The in-memory value lives in constants/abjad-maps.ts so calculation code can read it
 * without React; this file only loads and saves it.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AbjadSystemKey,
  DEFAULT_ABJAD_SYSTEM,
  getActiveAbjadSystem,
  resolveAbjadSystem,
  setActiveAbjadSystem,
} from '../constants/abjad-maps';

export const ABJAD_SYSTEM_STORAGE_KEY = '@asrar/abjad_system';

type KeyValueStorage = {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
};

let hydration: Promise<AbjadSystemKey> | null = null;

/** Load the saved choice once (Maghribi when nothing is saved or storage fails). */
export function hydrateAbjadSystem(storage: KeyValueStorage = AsyncStorage, force = false): Promise<AbjadSystemKey> {
  if (!hydration || force) {
    hydration = storage
      .getItem(ABJAD_SYSTEM_STORAGE_KEY)
      .then((saved) => {
        const system = saved ? resolveAbjadSystem(saved) : DEFAULT_ABJAD_SYSTEM;
        setActiveAbjadSystem(system);
        return system;
      })
      .catch(() => getActiveAbjadSystem());
  }
  return hydration;
}

/** Switch every calculation in the app and remember the choice. */
export async function setAbjadSystemPreference(system: unknown, storage: KeyValueStorage = AsyncStorage): Promise<void> {
  const next = resolveAbjadSystem(system);
  setActiveAbjadSystem(next);
  try {
    await storage.setItem(ABJAD_SYSTEM_STORAGE_KEY, next);
  } catch {
    // The in-memory choice still applies for this session.
  }
}
