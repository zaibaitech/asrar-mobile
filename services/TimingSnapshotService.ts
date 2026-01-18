/**
 * Timing Snapshot Service
 * Wrapper to provide harmony and timing data for notifications
 * 
 * This service combines planetary hours, elemental harmony, and Islamic calendar
 * to provide a unified snapshot of the current spiritual timing
 */

import { calculateElementalHarmony } from './ElementalHarmonyService';
import type { Element } from './MomentAlignmentService';
import { calculatePlanetaryHours, Planet } from './PlanetaryHoursService';
import { loadProfile } from './UserProfileStorage';
import { getPrayerTimesForDate, type CalculationMethod } from './api/prayerTimes';

export interface AsrarTimingSnapshot {
  /** Harmony score (0-1) representing timing quality */
  harmony: number;
  
  /** Current planetary hour information */
  planetaryHour: {
    ruler: string; // Planet name (lowercase)
    element: string; // Element (lowercase)
    startTime: Date;
    endTime: Date;
  };
  
  /** Day element */
  dayElement: string;
  
  /** Islamic calendar day info */
  islamicDay?: {
    dayName: string;
  };
}

/**
 * Get timing snapshot for a specific moment
 */
export async function getAsrarTimingSnapshot(date: Date = new Date()): Promise<AsrarTimingSnapshot> {
  try {
    // Get user profile for location
    const profile = await loadProfile();
    const location = profile?.location || {
      latitude: 40.7128,
      longitude: -74.0060,
      city: 'New York',
    };
    
    // Get prayer times for sunrise/sunset
    const prayerTimes = await getPrayerTimesForDate(
      date,
      location.latitude,
      location.longitude,
      3 as CalculationMethod // Muslim World League
    );
    
    if (!prayerTimes) {
      throw new Error('Failed to get prayer times');
    }
    
    // Parse times
    const sunrise = new Date(prayerTimes.date.gregorian.date + 'T' + prayerTimes.timings.Sunrise);
    const sunset = new Date(prayerTimes.date.gregorian.date + 'T' + prayerTimes.timings.Maghrib);
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    const nextDayTimes = await getPrayerTimesForDate(
      nextDay,
      location.latitude,
      location.longitude,
      3 as CalculationMethod
    );
    const nextSunrise = nextDayTimes 
      ? new Date(nextDayTimes.date.gregorian.date + 'T' + nextDayTimes.timings.Sunrise)
      : new Date(sunrise.getTime() + 24 * 60 * 60 * 1000);
    
    // Calculate planetary hours
    const planetaryData = calculatePlanetaryHours(sunrise, sunset, nextSunrise, date);
    
    // Get day element from day ruler
    const dayElement = getPlanetElement(planetaryData.dayRulerPlanet);
    const hourElement = getPlanetElement(planetaryData.currentHour.planet);
    
    // Calculate harmony score
    let harmonyScore = 0.5; // Default neutral
    
    if (profile?.derived?.element) {
      // Calculate harmony from user element vs current elements
      const dayHarmony = calculateElementalHarmony(
        profile.derived.element as Element,
        dayElement as Element
      );
      const hourHarmony = calculateElementalHarmony(
        profile.derived.element as Element,
        hourElement as Element
      );
      
      // Combine day and hour harmony (weighted average: 40% day, 60% hour)
      const dayScore = {
        'Harmonious': 0.9,
        'Supportive': 0.7,
        'Neutral': 0.5,
        'Challenging': 0.3,
      }[dayHarmony.level] || 0.5;
      
      const hourScore = {
        'Harmonious': 0.9,
        'Supportive': 0.7,
        'Neutral': 0.5,
        'Challenging': 0.3,
      }[hourHarmony.level] || 0.5;
      
      harmonyScore = dayScore * 0.4 + hourScore * 0.6;
    } else {
      // Calculate basic harmony from elemental alignment
      const dayHarmony = calculateElementalHarmony(
        dayElement as Element,
        hourElement as Element
      );
      
      // Map harmony level to score
      harmonyScore = {
        'Harmonious': 0.8,
        'Supportive': 0.6,
        'Neutral': 0.5,
        'Challenging': 0.3,
      }[dayHarmony.level] || 0.5;
    }
    
    return {
      harmony: harmonyScore,
      planetaryHour: {
        ruler: planetaryData.currentHour.planet.toLowerCase(),
        element: hourElement.toLowerCase(),
        startTime: planetaryData.currentHour.startTime,
        endTime: planetaryData.currentHour.endTime,
      },
      dayElement: dayElement.toLowerCase(),
      islamicDay: {
        dayName: getWeekdayName(date),
      },
    };
  } catch (error) {
    console.error('Error getting timing snapshot:', error);
    
    // Return fallback neutral snapshot
    return {
      harmony: 0.5,
      planetaryHour: {
        ruler: 'sun',
        element: 'fire',
        startTime: new Date(),
        endTime: new Date(Date.now() + 60 * 60 * 1000),
      },
      dayElement: 'fire',
      islamicDay: {
        dayName: getWeekdayName(date),
      },
    };
  }
}

/**
 * Get element for a planet
 */
function getPlanetElement(planet: Planet): string {
  const planetElements: Record<Planet, string> = {
    'Sun': 'fire',
    'Mars': 'fire',
    'Venus': 'earth',
    'Saturn': 'earth',
    'Mercury': 'air',
    'Moon': 'water',
    'Jupiter': 'water',
  };
  return planetElements[planet] || 'fire';
}

/**
 * Get weekday name
 */
function getWeekdayName(date: Date): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
}

export default {
  getAsrarTimingSnapshot,
};
