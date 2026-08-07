/**
 * Minimal planetary-hour-of-day helper for the Ikhtiyārāt engine.
 *
 * asrar.app's engine.ts calls its own src/lib/planetary/planetaryHours.ts's
 * getAllPlanetaryHoursForDay(sunrise, sunset, nextSunrise, now). Mobile's
 * services/PlanetaryHoursService.ts has the identical Chaldean-order
 * algorithm and already exports getDayRuler() — reused directly below —
 * but does not export an equivalent "which planet rules this exact
 * instant" function in this shape, so that small piece is ported here
 * rather than risking a subtly different result from adapting a
 * differently-shaped existing function.
 */

import { getDayRuler, Planet } from '@/services/PlanetaryHoursService';

const CHALDEAN_ORDER: Planet[] = ['Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon'];

function getPlanetForHour(dayRuler: Planet, hourNumber: number): Planet {
  const dayRulerIndex = CHALDEAN_ORDER.indexOf(dayRuler);
  const planetIndex = (dayRulerIndex + hourNumber) % CHALDEAN_ORDER.length;
  return CHALDEAN_ORDER[planetIndex];
}

/** Which classical planet rules `now`, given the day's sunrise/sunset/next-sunrise. Null if now falls outside [sunrise, nextSunrise). */
export function getPlanetaryHourRulerAt(
  sunrise: Date,
  sunset: Date,
  nextSunrise: Date,
  now: Date
): Planet | null {
  const dayRuler = getDayRuler(sunrise);
  const dayDuration = sunset.getTime() - sunrise.getTime();
  const nightDuration = nextSunrise.getTime() - sunset.getTime();
  const dayHourDuration = dayDuration / 12;
  const nightHourDuration = nightDuration / 12;

  for (let i = 0; i < 24; i++) {
    const isDaytime = i < 12;
    let startTime: Date;
    let endTime: Date;

    if (isDaytime) {
      startTime = new Date(sunrise.getTime() + i * dayHourDuration);
      endTime = new Date(sunrise.getTime() + (i + 1) * dayHourDuration);
    } else {
      const nightIndex = i - 12;
      startTime = new Date(sunset.getTime() + nightIndex * nightHourDuration);
      endTime = new Date(sunset.getTime() + (nightIndex + 1) * nightHourDuration);
    }

    if (now >= startTime && now < endTime) {
      return getPlanetForHour(dayRuler, i);
    }
  }

  return null;
}
