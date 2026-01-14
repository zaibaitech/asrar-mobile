/**
 * Prayer Times Utility
 * 
 * Integrates with existing Aladhan API service for accurate prayer times.
 * Provides helper functions for prayer time management.
 * 
 * @module prayer-times
 */

import type { Prayer } from '@/data/divine-names-planetary';
import { fetchPrayerTimes, type PrayerTimings } from '@/services/api/prayerTimes';

// ============================================================================
// TYPES
// ============================================================================

export interface PrayerTimes {
  Fajr: Date;
  Dhuhr: Date;
  Asr: Date;
  Maghrib: Date;
  Isha: Date;
}

export interface PrayerTimeContext {
  prayer: Prayer;
  time: Date;
  isCurrentPrayer: boolean;
  isNextPrayer: boolean;
  timeUntilPrayer: number; // minutes
}

// Cache for prayer times
let cachedPrayerTimes: PrayerTimes | null = null;
let cacheDate: string | null = null;

// ============================================================================
// PRAYER TIME CALCULATION
// ============================================================================

/**
 * Convert time string (HH:MM) to Date object
 */
function parseTimeString(timeStr: string, date: Date = new Date()): Date {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const result = new Date(date);
  result.setHours(hours, minutes, 0, 0);
  return result;
}

/**
 * Get prayer times for a specific date using Aladhan API
 */
export async function getPrayerTimes(
  date: Date,
  location?: { latitude: number; longitude: number }
): Promise<PrayerTimes> {
  const dateStr = date.toISOString().split('T')[0];
  
  // Return cached times if same date
  if (cachedPrayerTimes && cacheDate === dateStr) {
    return cachedPrayerTimes;
  }
  
  try {
    const lat = location?.latitude ?? 33.5731; // Default: Casablanca
    const lon = location?.longitude ?? -7.5898;
    
    const data = await fetchPrayerTimes(lat, lon);
    const timings = data.timings;
    
    const prayerTimes: PrayerTimes = {
      Fajr: parseTimeString(timings.Fajr, date),
      Dhuhr: parseTimeString(timings.Dhuhr, date),
      Asr: parseTimeString(timings.Asr, date),
      Maghrib: parseTimeString(timings.Maghrib, date),
      Isha: parseTimeString(timings.Isha, date)
    };
    
    // Cache the results
    cachedPrayerTimes = prayerTimes;
    cacheDate = dateStr;
    
    return prayerTimes;
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    // Fallback to approximate times if API fails
    return getFallbackPrayerTimes(date);
  }
}

/**
 * Fallback prayer times (approximate) if API fails
 */
function getFallbackPrayerTimes(date: Date): PrayerTimes {
  const fajr = new Date(date);
  fajr.setHours(6, 0, 0, 0);
  
  const dhuhr = new Date(date);
  dhuhr.setHours(13, 30, 0, 0);
  
  const asr = new Date(date);
  asr.setHours(16, 30, 0, 0);
  
  const maghrib = new Date(date);
  maghrib.setHours(19, 0, 0, 0);
  
  const isha = new Date(date);
  isha.setHours(20, 30, 0, 0);
  
  return { Fajr: fajr, Dhuhr: dhuhr, Asr: asr, Maghrib: maghrib, Isha: isha };
}

/**
 * Get today's prayer times
 */
export async function getTodayPrayerTimes(
  location?: { latitude: number; longitude: number }
): Promise<PrayerTimes> {
  return getPrayerTimes(new Date(), location);
}

/**
 * Get current prayer (the one most recently passed)
 */
export async function getCurrentPrayer(
  location?: { latitude: number; longitude: number }
): Promise<Prayer | null> {
  const now = new Date();
  const times = await getPrayerTimes(now, location);
  
  // Check in reverse order (Isha -> Fajr)
  const prayers: Prayer[] = ['Isha', 'Maghrib', 'Asr', 'Dhuhr', 'Fajr'];
  
  for (const prayer of prayers) {
    if (now >= times[prayer]) {
      return prayer;
    }
  }
  
  // If before Fajr, current prayer is yesterday's Isha
  return 'Isha';
}

/**
 * Get next prayer time
 */
export async function getNextPrayer(
  location?: { latitude: number; longitude: number }
): Promise<{ prayer: Prayer; time: Date }> {
  const now = new Date();
  const times = await getPrayerTimes(now, location);
  
  // Check in order (Fajr -> Isha)
  const prayers: Prayer[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  
  for (const prayer of prayers) {
    if (now < times[prayer]) {
      return { prayer, time: times[prayer] };
    }
  }
  
  // If after Isha, next prayer is tomorrow's Fajr
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowTimes = await getPrayerTimes(tomorrow, location);
  
  return { prayer: 'Fajr', time: tomorrowTimes.Fajr };
}

/**
 * Get time for a specific prayer
 */
export async function getNextPrayerTime(
  prayer: Prayer,
  location?: { latitude: number; longitude: number }
): Promise<Date> {
  const now = new Date();
  const times = await getPrayerTimes(now, location);
  
  // If prayer time has passed today, get tomorrow's time
  if (now >= times[prayer]) {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowTimes = await getPrayerTimes(tomorrow, location);
    return tomorrowTimes[prayer];
  }
  
  return times[prayer];
}

/**
 * Get all prayer contexts for today
 */
export async function getAllPrayerContexts(
  location?: { latitude: number; longitude: number }
): Promise<PrayerTimeContext[]> {
  const now = new Date();
  const times = await getPrayerTimes(now, location);
  const currentPrayer = await getCurrentPrayer(location);
  const nextPrayerInfo = await getNextPrayer(location);
  
  const prayers: Prayer[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  
  return prayers.map(prayer => {
    const time = times[prayer];
    const timeUntilPrayer = (time.getTime() - now.getTime()) / (1000 * 60);
    
    return {
      prayer,
      time,
      isCurrentPrayer: prayer === currentPrayer,
      isNextPrayer: prayer === nextPrayerInfo.prayer,
      timeUntilPrayer: Math.max(0, Math.floor(timeUntilPrayer))
    };
  });
}

/**
 * Calculate minutes until a specific prayer
 */
export async function getMinutesUntilPrayer(
  prayer: Prayer,
  location?: { latitude: number; longitude: number }
): Promise<number> {
  const now = new Date();
  const prayerTime = await getNextPrayerTime(prayer, location);
  const minutes = (prayerTime.getTime() - now.getTime()) / (1000 * 60);
  
  return Math.max(0, Math.floor(minutes));
}

/**
 * Check if we're within a prayer window (recommended time for dhikr)
 */
export function isWithinPrayerWindow(
  prayer: Prayer,
  windowMinutes: number = 30,
  location?: { latitude: number; longitude: number }
): boolean {
  const now = new Date();
  const times = getPrayerTimes(now, location);
  const prayerTime = times[prayer];
  
  const minutesSince = (now.getTime() - prayerTime.getTime()) / (1000 * 60);
  
  return minutesSince >= 0 && minutesSince <= windowMinutes;
}

/**
 * Format prayer time as human-readable string
 */
export function formatPrayerTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

/**
 * Format minutes until prayer
 */
export function formatTimeUntil(minutes: number): string {
  if (minutes < 1) {
    return 'Now';
  } else if (minutes < 60) {
    return `${minutes}m`;
  } else {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }
}

/**
 * Get Arabic prayer name
 */
export function getArabicPrayerName(prayer: Prayer): string {
  const arabicNames: Record<Prayer, string> = {
    Fajr: 'الفجر',
    Dhuhr: 'الظهر',
    Asr: 'العصر',
    Maghrib: 'المغرب',
    Isha: 'العشاء'
  };
  
  return arabicNames[prayer];
}

/**
 * Get prayer icon (for UI)
 */
export function getPrayerIcon(prayer: Prayer): string {
  const icons: Record<Prayer, string> = {
    Fajr: '🌅', // Dawn
    Dhuhr: '☀️', // Noon sun
    Asr: '🌤️', // Afternoon
    Maghrib: '🌇', // Sunset
    Isha: '🌙' // Night
  };
  
  return icons[prayer];
}

// ============================================================================
// NOTIFICATION HELPERS
// ============================================================================

/**
 * Get notification times for a prayer
 * (e.g., 15 minutes before, at prayer time)
 */
export function getPrayerNotificationTimes(
  prayer: Prayer,
  minutesBefore: number = 15,
  location?: { latitude: number; longitude: number }
): { beforePrayer: Date; atPrayer: Date } {
  const prayerTime = getNextPrayerTime(prayer, location);
  
  const beforePrayer = new Date(prayerTime);
  beforePrayer.setMinutes(beforePrayer.getMinutes() - minutesBefore);
  
  return {
    beforePrayer,
    atPrayer: prayerTime
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  getPrayerTimes,
  getTodayPrayerTimes,
  getCurrentPrayer,
  getNextPrayer,
  getNextPrayerTime,
  getAllPrayerContexts,
  getMinutesUntilPrayer,
  isWithinPrayerWindow,
  formatPrayerTime,
  formatTimeUntil,
  getArabicPrayerName,
  getPrayerIcon,
  getPrayerNotificationTimes
};
