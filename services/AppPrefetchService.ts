import { getMoonLongitudeFromServer } from '@/services/CosmicDataService';
import { getMonthlyPrayerTimes } from '@/services/PrayerTimesCacheService';
import { getAllTransits } from '@/services/TransitService';

/**
 * Prefetch core semi-static resources.
 * Runs best-effort; failures are swallowed.
 */
export async function prefetchCoreCaches(options?: {
  latitude?: number;
  longitude?: number;
  prayerMethod?: 0 | 1 | 2 | 3 | 4 | 5 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14;
}) {
  // Fire-and-forget prefetches.
  void safe(async () => {
    await getAllTransits();
  });

  void safe(async () => {
    await getMoonLongitudeFromServer(new Date());
  });

  const lat = options?.latitude;
  const lon = options?.longitude;
  if (typeof lat === 'number' && typeof lon === 'number') {
    void safe(async () => {
      await getMonthlyPrayerTimes(lat, lon, options?.prayerMethod ?? 3, new Date());
    });
  }
}

async function safe(fn: () => Promise<void>) {
  try {
    await fn();
  } catch {
    // ignore
  }
}
