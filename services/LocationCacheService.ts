import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

const STORAGE_KEY = 'location.lastKnown.v1';

export type CachedLocation = {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: number;
};

const DEFAULT_MAX_AGE_MS = 6 * 60 * 60 * 1000; // 6 hours

let memory: CachedLocation | null = null;
let inflight: Promise<CachedLocation | null> | null = null;

export async function getLastKnownLocation(): Promise<CachedLocation | null> {
  if (memory) return memory;
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedLocation;
    if (typeof parsed?.latitude !== 'number' || typeof parsed?.longitude !== 'number') return null;
    memory = parsed;
    return parsed;
  } catch {
    return null;
  }
}

export async function setLastKnownLocation(loc: CachedLocation): Promise<void> {
  memory = loc;
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(loc));
  } catch {
    // ignore
  }
}

/**
 * Best-effort: returns cached location immediately if available.
 * If cache is missing/stale and permissions allow, refreshes from GPS.
 */
export async function getBestLocation(options?: {
  maxAgeMs?: number;
  /** Avoid triggering permission prompt. */
  allowPrompt?: boolean;
}): Promise<CachedLocation | null> {
  const maxAgeMs = options?.maxAgeMs ?? DEFAULT_MAX_AGE_MS;
  const cached = await getLastKnownLocation();
  const isFresh = cached ? Date.now() - cached.timestamp < maxAgeMs : false;
  if (isFresh) return cached;

  if (inflight) return inflight;

  inflight = (async () => {
    try {
      const perm = await Location.getForegroundPermissionsAsync();
      if (perm.status !== 'granted') {
        if (options?.allowPrompt) {
          const req = await Location.requestForegroundPermissionsAsync();
          if (req.status !== 'granted') return cached ?? null;
        } else {
          return cached ?? null;
        }
      }

      // If the OS has a recent fix, prefer that over forcing a new GPS read.
      // This avoids intermittent failures when GPS is slow/unavailable (indoors, cold start, etc.).
      try {
        const lastKnown = await Location.getLastKnownPositionAsync();
        if (lastKnown?.coords) {
          const ts = typeof lastKnown.timestamp === 'number' ? lastKnown.timestamp : Date.now();
          const fromOs: CachedLocation = {
            latitude: lastKnown.coords.latitude,
            longitude: lastKnown.coords.longitude,
            accuracy: lastKnown.coords.accuracy ?? undefined,
            timestamp: ts,
          };

          // If it's within the requested max age, accept immediately.
          if (Date.now() - fromOs.timestamp < maxAgeMs) {
            await setLastKnownLocation(fromOs);
            return fromOs;
          }
        }
      } catch {
        // ignore and fall through to fresh position
      }

      const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const fresh: CachedLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy ?? undefined,
        timestamp: Date.now(),
      };
      await setLastKnownLocation(fresh);
      return fresh;
    } catch {
      return cached ?? null;
    } finally {
      inflight = null;
    }
  })();

  return inflight;
}
