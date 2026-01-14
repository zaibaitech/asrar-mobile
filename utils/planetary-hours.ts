/**
 * Planetary Hours Utility
 * 
 * Calculates current planetary hour based on sunrise/sunset times
 * and the traditional Chaldean order of planetary rulership.
 * 
 * @module planetary-hours
 */

import type { DayOfWeek, HourNumber, Planet } from '@/data/classical-hour-practices';
import { getRulingPlanet } from '@/data/classical-hour-practices';
import type { Element } from '@/data/divine-names-planetary';
import { getPrayerTimesForDate, type CalculationMethod, type PrayerTimings } from '@/services/api/prayerTimes';

// ============================================================================
// TYPES
// ============================================================================

export interface PlanetaryHourContext {
  planet: Planet;
  hourNumber: number;
  dayOfWeek: DayOfWeek;
  element: Element;
  arabicName: string;
  isDaytime: boolean;
  timeRemaining: number; // minutes until next hour
}

// ============================================================================
// PLANETARY HOUR CALCULATION
// ============================================================================

/**
 * Get current planetary hour context
 * 
 * Calculates which planetary hour we're in based on:
 * - Current time
 * - Sunrise/sunset times for the location
 * - Day of the week (determines first hour ruler)
 * 
 * Traditional method: Divide day/night into 12 unequal hours each
 */
export async function getCurrentPlanetaryHour(
  location?: { latitude: number; longitude: number },
  options?: { method?: CalculationMethod; now?: Date }
): Promise<PlanetaryHourContext> {
  const now = options?.now ?? new Date();
  const method = options?.method ?? 3;

  const { sunrise, sunset } = await getSunTimes(now, location, method);

  const isDaytime = now >= sunrise && now < sunset;
  const planetaryDayDate = now < sunrise ? addDays(now, -1) : now;
  const dayOfWeek = getDayOfWeek(planetaryDayDate);

  const hourNumber = calculateHourNumber(now, sunrise, sunset, isDaytime);
  const planetaryHourIndex = isDaytime ? hourNumber : 12 + hourNumber; // 1-24
  const planet = getPlanetForPlanetaryDay(dayOfWeek, planetaryHourIndex);

  const element = getPlanetaryElement(planet);
  const arabicName = getPlanetaryArabicName(planet);

  const timeRemaining = calculateTimeRemaining(now, sunrise, sunset, isDaytime, hourNumber);

  return {
    planet,
    hourNumber,
    dayOfWeek,
    element,
    arabicName,
    isDaytime,
    timeRemaining,
  };
}

/**
 * Calculate which hour number (1-12) we're currently in
 */
function calculateHourNumber(
  now: Date,
  sunrise: Date,
  sunset: Date,
  isDaytime: boolean
): number {
  if (isDaytime) {
    // Daytime hours: sunrise to sunset divided into 12
    const totalDayMinutes = (sunset.getTime() - sunrise.getTime()) / (1000 * 60);
    const minutesElapsed = (now.getTime() - sunrise.getTime()) / (1000 * 60);
    const hourLength = totalDayMinutes / 12;
    
    const hourNumber = Math.floor(minutesElapsed / hourLength) + 1;
    return Math.min(Math.max(hourNumber, 1), 12);
  } else {
    // Nighttime hours: sunset to next sunrise divided into 12
    const nightEnd = getNightEnd(sunrise, sunset);
    const totalNightMinutes = (nightEnd.getTime() - sunset.getTime()) / (1000 * 60);
    const minutesElapsed = (now.getTime() - sunset.getTime()) / (1000 * 60);
    const hourLength = totalNightMinutes / 12;

    const hourNumber = Math.floor(minutesElapsed / hourLength) + 1;
    return Math.min(Math.max(hourNumber, 1), 12);
  }
}

/**
 * Calculate minutes remaining in current planetary hour
 */
function calculateTimeRemaining(
  now: Date,
  sunrise: Date,
  sunset: Date,
  isDaytime: boolean,
  hourNumber: number
): number {
  if (isDaytime) {
    const totalDayMinutes = (sunset.getTime() - sunrise.getTime()) / (1000 * 60);
    const hourLength = totalDayMinutes / 12;
    const hourEnd = new Date(sunrise.getTime() + hourNumber * hourLength * 60 * 1000);

    const remainingMs = hourEnd.getTime() - now.getTime();
    return Math.max(0, Math.ceil(remainingMs / (1000 * 60)));
  } else {
    const nightEnd = getNightEnd(sunrise, sunset);
    const totalNightMinutes = (nightEnd.getTime() - sunset.getTime()) / (1000 * 60);
    const hourLength = totalNightMinutes / 12;
    const hourEnd = new Date(sunset.getTime() + hourNumber * hourLength * 60 * 1000);

    const remainingMs = hourEnd.getTime() - now.getTime();
    return Math.max(0, Math.ceil(remainingMs / (1000 * 60)));
  }
}

/**
 * Get sunrise and sunset times
 * 
 * NOTE: This is a simplified version. In production, use a proper
 * astronomical library like suncalc or @observerly/astrometry
 */
async function getSunTimes(
  date: Date,
  location?: { latitude: number; longitude: number },
  method: CalculationMethod = 3
): Promise<{ sunrise: Date; sunset: Date }> {
  if (!location) {
    return getApproxSunTimesWindow(date);
  }

  try {
    const today = startOfLocalDay(date);
    const todayData = await getPrayerTimesForDate(today, location.latitude, location.longitude, method);
    if (!todayData) {
      return getApproxSunTimes(date);
    }

    const todaySunrise = parseTimingToDate(todayData.timings, 'Sunrise', today);
    const todaySunset = parseTimingToDate(todayData.timings, 'Maghrib', today);

    // If we're before today's sunrise, the relevant night started at yesterday's Maghrib.
    if (date < todaySunrise) {
      const yesterday = addDays(today, -1);
      const yesterdayData = await getPrayerTimesForDate(yesterday, location.latitude, location.longitude, method);
      const yesterdaySunset = yesterdayData
        ? parseTimingToDate(yesterdayData.timings, 'Maghrib', yesterday)
        : addDays(todaySunset, -1);

      return { sunrise: todaySunrise, sunset: yesterdaySunset };
    }

    return { sunrise: todaySunrise, sunset: todaySunset };
  } catch {
    return getApproxSunTimes(date);
  }
}

function getApproxSunTimes(date: Date): { sunrise: Date; sunset: Date } {
  const sunrise = new Date(date);
  sunrise.setHours(6, 30, 0, 0);

  const sunset = new Date(date);
  sunset.setHours(18, 30, 0, 0);

  return { sunrise, sunset };
}

function getApproxSunTimesWindow(date: Date): { sunrise: Date; sunset: Date } {
  const { sunrise, sunset } = getApproxSunTimes(date);

  // If before sunrise, night started at yesterday's sunset.
  if (date < sunrise) {
    return { sunrise, sunset: addDays(sunset, -1) };
  }

  return { sunrise, sunset };
}

function getNightEnd(sunrise: Date, sunset: Date): Date {
  // Night end is the first sunrise AFTER the sunset reference.
  // If sunset is yesterday (pre-sunrise window), sunrise is already after it.
  if (sunrise.getTime() > sunset.getTime()) {
    return sunrise;
  }

  return addDays(sunrise, 1);
}

function parseTimingToDate(timings: PrayerTimings, key: keyof PrayerTimings, day: Date): Date {
  const raw = timings[key];
  const match = String(raw).match(/(\d{1,2}):(\d{2})/);
  if (!match) {
    const fallback = new Date(day);
    fallback.setHours(0, 0, 0, 0);
    return fallback;
  }
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  const result = new Date(day);
  result.setHours(hours, minutes, 0, 0);
  return result;
}

function startOfLocalDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function getPlanetForPlanetaryDay(day: DayOfWeek, hourIndex: number): Planet {
  // Traditional Chaldean order
  const chaldeanOrder: Planet[] = ['Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon'];

  const dayRuler = getRulingPlanet(day, 1 as HourNumber);
  const startIndex = chaldeanOrder.indexOf(dayRuler);
  const idx = (startIndex + (hourIndex - 1)) % chaldeanOrder.length;
  return chaldeanOrder[idx];
}

/**
 * Get day of week
 */
function getDayOfWeek(date: Date): DayOfWeek {
  const days: DayOfWeek[] = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];
  
  return days[date.getDay()];
}

/**
 * Get element for a planet
 */
function getPlanetaryElement(planet: Planet): Element {
  const elementMap: Record<Planet, Element> = {
    Sun: 'Fire',
    Moon: 'Water',
    Mars: 'Fire',
    Mercury: 'Air',
    Jupiter: 'Air',
    Venus: 'Water',
    Saturn: 'Earth'
  };
  
  return elementMap[planet];
}

/**
 * Get Arabic name for a planet
 */
function getPlanetaryArabicName(planet: Planet): string {
  const arabicNames: Record<Planet, string> = {
    Sun: 'ساعة الشمس',
    Moon: 'ساعة القمر',
    Mars: 'ساعة المريخ',
    Mercury: 'ساعة عطارد',
    Jupiter: 'ساعة المشتري',
    Venus: 'ساعة الزهرة',
    Saturn: 'ساعة زحل'
  };
  
  return arabicNames[planet];
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get all 12 planetary hours for a given day
 */
export function getDayPlanetaryHours(
  date: Date,
  location?: { latitude: number; longitude: number }
): Array<{
  hourNumber: number;
  planet: Planet;
  element: Element;
  arabicName: string;
  startTime: Date;
  endTime: Date;
}> {
  const { sunrise, sunset } = getApproxSunTimes(date);
  const dayOfWeek = getDayOfWeek(date);
  
  const totalDayMinutes = (sunset.getTime() - sunrise.getTime()) / (1000 * 60);
  const hourLength = totalDayMinutes / 12;
  
  const hours = [];
  
  for (let i = 1; i <= 12; i++) {
    const planet = getRulingPlanet(dayOfWeek, i as HourNumber);
    const element = getPlanetaryElement(planet);
    const arabicName = getPlanetaryArabicName(planet);
    
    const startTime = new Date(sunrise.getTime() + (i - 1) * hourLength * 60 * 1000);
    const endTime = new Date(sunrise.getTime() + i * hourLength * 60 * 1000);
    
    hours.push({
      hourNumber: i,
      planet,
      element,
      arabicName,
      startTime,
      endTime
    });
  }
  
  return hours;
}

/**
 * Get night planetary hours
 */
export function getNightPlanetaryHours(
  date: Date,
  location?: { latitude: number; longitude: number }
): Array<{
  hourNumber: number;
  planet: Planet;
  element: Element;
  arabicName: string;
  startTime: Date;
  endTime: Date;
}> {
  const { sunrise, sunset } = getApproxSunTimes(date);
  const nextSunrise = new Date(sunrise);
  nextSunrise.setDate(nextSunrise.getDate() + 1);
  
  const dayOfWeek = getDayOfWeek(date);
  
  const totalNightMinutes = (nextSunrise.getTime() - sunset.getTime()) / (1000 * 60);
  const hourLength = totalNightMinutes / 12;
  
  const hours = [];
  
  for (let i = 1; i <= 12; i++) {
    const planet = getRulingPlanet(dayOfWeek, i as HourNumber);
    const element = getPlanetaryElement(planet);
    const arabicName = getPlanetaryArabicName(planet);
    
    const startTime = new Date(sunset.getTime() + (i - 1) * hourLength * 60 * 1000);
    const endTime = new Date(sunset.getTime() + i * hourLength * 60 * 1000);
    
    hours.push({
      hourNumber: i,
      planet,
      element,
      arabicName,
      startTime,
      endTime
    });
  }
  
  return hours;
}

/**
 * Format time remaining as human-readable string
 */
export function formatTimeRemaining(minutes: number): string {
  if (minutes < 1) {
    return 'Less than 1 minute';
  } else if (minutes === 1) {
    return '1 minute';
  } else if (minutes < 60) {
    return `${Math.floor(minutes)} minutes`;
  } else {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    return hours === 1
      ? `${hours} hour ${mins} minutes`
      : `${hours} hours ${mins} minutes`;
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  getCurrentPlanetaryHour,
  getDayPlanetaryHours,
  getNightPlanetaryHours,
  formatTimeRemaining
};
