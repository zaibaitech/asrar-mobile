/**
 * Ikhtiyārāt (Best Dates) Storage
 * =================================
 * Disclaimer ack + Simple/Detailed mode preference, ported from
 * asrar.app's src/features/ikhtiyarat/{disclaimerAck.ts,useSimpleMode.ts}
 * with localStorage swapped for AsyncStorage. Cross-device profile sync
 * (the source's readProfileAck/buildProfileAckUpdate) is intentionally
 * NOT ported for v1 — local-only ack, per plan decision — to avoid
 * touching AuthService/profile-update internals as part of this feature.
 *
 * Also includes offline result/scan caching, which has no web equivalent
 * (the web recomputes client-side on every load and has no offline
 * requirement) but is useful on mobile for instant revisit + a
 * "cached — reconnect to refresh" fallback when a fresh computation fails.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { ElectionResult, ElectionType } from '@/services/ikhtiyaratEngine';

/** Same key as the web app (asrar.app) — versioned; bump the .vN suffix if disclaimer copy changes meaningfully. */
export const DISCLAIMER_KEY = 'asrar.ikhtiyarat.disclaimer.v1';

export async function readDisclaimerAck(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(DISCLAIMER_KEY)) === 'true';
  } catch (error) {
    console.error('Error reading Ikhtiyarat disclaimer ack:', error);
    return false;
  }
}

export async function writeDisclaimerAck(): Promise<void> {
  try {
    await AsyncStorage.setItem(DISCLAIMER_KEY, 'true');
  } catch (error) {
    console.error('Error saving Ikhtiyarat disclaimer ack:', error);
  }
}

const SIMPLE_MODE_KEY = 'asrar.ikhtiyarat.simpleMode';

/**
 * Defaults to Simple (true) — most users have no astrology background;
 * the technical/classical terminology (Khāliya al-Sayr, muḥtaraq, orb,
 * SCHOLAR-REVIEW) is opt-in via "Detailed", not the default.
 */
export async function readSimpleMode(): Promise<boolean> {
  try {
    const raw = await AsyncStorage.getItem(SIMPLE_MODE_KEY);
    return raw === null ? true : raw === 'true';
  } catch (error) {
    console.error('Error reading Ikhtiyarat simple-mode preference:', error);
    return true;
  }
}

export async function writeSimpleMode(value: boolean): Promise<void> {
  try {
    await AsyncStorage.setItem(SIMPLE_MODE_KEY, String(value));
  } catch (error) {
    console.error('Error saving Ikhtiyarat simple-mode preference:', error);
  }
}

// ============================================================================
// Offline result/scan caching (mobile-only concept, no web equivalent)
// ============================================================================

const CHECKS_KEY = 'ikhtiyarat_checks_v1';
const MAX_CACHED_CHECKS = 10;

interface CachedCheck {
  key: string; // `${electionType}:${dateISO}:${lat}:${lon}`
  result: ElectionResult;
  cachedAt: number;
}

function checkCacheKey(electionType: ElectionType, dateISO: string, lat: number, lon: number): string {
  return `${electionType}:${dateISO}:${lat.toFixed(2)}:${lon.toFixed(2)}`;
}

/** Revives the Date fields JSON.stringify flattened to strings (ElectionResult.date, bestWindow.time, allWindows[].time). */
function reviveElectionResult(result: ElectionResult): ElectionResult {
  return {
    ...result,
    date: new Date(result.date),
    bestWindow: { ...result.bestWindow, time: new Date(result.bestWindow.time) },
    allWindows: result.allWindows.map((w) => ({ ...w, time: new Date(w.time) })),
  };
}

export async function loadCachedChecks(): Promise<CachedCheck[]> {
  try {
    const data = await AsyncStorage.getItem(CHECKS_KEY);
    if (!data) return [];
    const parsed: CachedCheck[] = JSON.parse(data);
    return parsed.map((c) => ({ ...c, result: reviveElectionResult(c.result) }));
  } catch (error) {
    console.error('Failed to load cached Ikhtiyarat checks:', error);
    return [];
  }
}

export async function saveCheckToCache(
  electionType: ElectionType,
  dateISO: string,
  lat: number,
  lon: number,
  result: ElectionResult
): Promise<void> {
  try {
    const existing = await loadCachedChecks();
    const key = checkCacheKey(electionType, dateISO, lat, lon);
    const deduped = existing.filter((c) => c.key !== key);
    const updated = [{ key, result, cachedAt: Date.now() }, ...deduped].slice(0, MAX_CACHED_CHECKS);
    await AsyncStorage.setItem(CHECKS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save Ikhtiyarat check to cache:', error);
  }
}

export async function findCachedCheck(
  electionType: ElectionType,
  dateISO: string,
  lat: number,
  lon: number
): Promise<ElectionResult | null> {
  const cached = await loadCachedChecks();
  const key = checkCacheKey(electionType, dateISO, lat, lon);
  const match = cached.find((c) => c.key === key);
  return match ? match.result : null;
}
