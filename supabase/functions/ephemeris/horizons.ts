// @ts-nocheck
/**
 * NASA JPL Horizons API Client
 * Documentation: https://ssd-api.jpl.nasa.gov/doc/horizons.html
 */

import type { PlanetPosition } from './types.ts';
import { PLANET_IDS, getZodiacSign } from './types.ts';

const HORIZONS_BASE_URL = 'https://ssd.jpl.nasa.gov/api/horizons.api';
const REQUEST_TIMEOUT_MS = 30000;
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY_MS = 1000;

/**
 * Fetch planetary position from NASA JPL Horizons API
 */
export async function fetchFromHorizons(
  planet: string,
  date: Date
): Promise<PlanetPosition | null> {
  const planetId = PLANET_IDS[planet.toLowerCase()];
  if (!planetId) {
    throw new Error(`Unknown planet: ${planet}`);
  }

  // Format dates for Horizons API
  const startTime = formatHorizonsDate(date);
  const stopTime = formatHorizonsDate(new Date(date.getTime() + 3600000)); // +1 hour

  const params = new URLSearchParams({
    format: 'text',
    COMMAND: planetId,
    EPHEM_TYPE: 'OBSERVER',
    CENTER: '500@399', // Geocentric (Earth center)
    START_TIME: startTime,
    STOP_TIME: stopTime,
    STEP_SIZE: '1h',
    // Horizons API is picky about values containing spaces/commas.
    // - START_TIME/STOP_TIME must be quoted when they contain a space
    // - QUANTITIES must be quoted when specifying a comma-separated list
    // We request:
    // - 31: observer ecliptic lon/lat (ObsEcLon, ObsEcLat)
    // - 20: observer range (delta) + range rate (deldot)
    QUANTITIES: "'31,20'",
    CSV_FORMAT: 'YES',
    OBJ_DATA: 'NO',
  });

  const url = `${HORIZONS_BASE_URL}?${params}`;

  // Retry logic with exponential backoff
  let lastError: Error | null = null;
  let retryDelay = INITIAL_RETRY_DELAY_MS;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`[Horizons] Fetching ${planet} (attempt ${attempt}/${MAX_RETRIES})`);

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          Accept: 'text/plain',
        },
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const rawText = await response.text();

      // The Horizons API sometimes returns JSON containing a `result` field.
      // It can also return plain text for certain errors.
      let resultText = rawText;
      const trimmed = rawText.trim();
      if (trimmed.startsWith('{') && trimmed.includes('"result"')) {
        try {
          const parsed = JSON.parse(trimmed);
          if (parsed && typeof parsed.result === 'string') {
            resultText = parsed.result;
          }
        } catch {
          // Fall through and try parsing as plain text.
        }
      }

      // Parse the response
      const position = parseHorizonsResponse(resultText, planet);

      if (!position) {
        throw new Error('Failed to parse Horizons response');
      }

      console.log(`[Horizons] Successfully fetched ${planet}`);
      return position;
    } catch (error) {
      lastError = error as Error;
      console.warn(
        `[Horizons] Attempt ${attempt} failed for ${planet}:`,
        error.message
      );

      if (attempt < MAX_RETRIES) {
        console.log(`[Horizons] Retrying in ${retryDelay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        retryDelay *= 2; // Exponential backoff
      }
    }
  }

  console.error(`[Horizons] All retries exhausted for ${planet}:`, lastError);
  throw lastError || new Error('Failed to fetch from Horizons');
}

/**
 * Parse NASA Horizons text response
 */
function parseHorizonsResponse(
  text: string,
  planet: string
): PlanetPosition | null {
  try {
    // Find the data section (between $$SOE and $$EOE markers)
    const soeIndex = text.indexOf('$$SOE');
    const eoeIndex = text.indexOf('$$EOE');

    if (soeIndex === -1 || eoeIndex === -1) {
      console.error('[Horizons] Missing $$SOE or $$EOE markers');
      return null;
    }

    const dataSection = text.substring(soeIndex + 5, eoeIndex).trim();
    const lines = dataSection.split('\n').filter((line) => line.trim());

    if (lines.length === 0) {
      console.error('[Horizons] No data lines found');
      return null;
    }

    // Parse CSV data lines.
    // With QUANTITIES='31,20' + CSV_FORMAT=YES the data rows look like:
    //   2026-Jan-27 20:00, , , 307.8938620,  0.0001820,  0.98477684311114,  0.1951613,
    // Columns (0-based):
    // 0: Date (e.g., 2026-Jan-27 20:00)
    // 1: (blank)
    // 2: (blank)
    // 3: ObsEcLon (deg)
    // 4: ObsEcLat (deg)
    // 5: delta (AU)
    // 6: deldot (AU/day)
    const line0 = lines[0].trim();
    const parts0 = line0.split(',').map((p) => p.trim());

    console.log(`[Horizons] Parsing ${planet}: ${parts0.length} columns`);

    const longitude0 = parts0[3] ? parseFloat(parts0[3]) : NaN;
    const latitude0 = parts0[4] ? parseFloat(parts0[4]) : NaN;
    const distance = parts0[5] ? parseFloat(parts0[5]) : 1.0;

    if (Number.isNaN(longitude0) || Number.isNaN(latitude0)) {
      console.error('[Horizons] Failed to parse coordinates:', { parts0, line0 });
      return null;
    }

    // Compute approximate angular speed (deg/day) from the next hourly row when available.
    let speed = 0;
    if (lines.length > 1) {
      const line1 = lines[1].trim();
      const parts1 = line1.split(',').map((p) => p.trim());
      const longitude1 = parts1[3] ? parseFloat(parts1[3]) : NaN;
      if (!Number.isNaN(longitude1)) {
        const delta = ((longitude1 - longitude0 + 540) % 360) - 180; // shortest path
        speed = delta * 24; // 1 hour step -> deg/day
      }
    }

    const longitude = longitude0;
    const latitude = latitude0;

    console.log(`[Horizons] ${planet}: lon=${longitude}, lat=${latitude}, dist=${distance}, speed=${speed}`);

    // Calculate zodiac sign and degree
    const { sign, degree } = getZodiacSign(longitude);

    // Determine retrograde status (negative speed)
    const isRetrograde = speed < -0.01;

    return {
      planet_id: planet.toLowerCase(),
      longitude,
      latitude,
      speed,
      distance,
      zodiac_sign: sign,
      zodiac_degree: degree,
      is_retrograde: isRetrograde,
    };
  } catch (error) {
    console.error('[Horizons] Parse error:', error);
    return null;
  }
}

/**
 * Format date for Horizons API
 * Format: 'YYYY-MM-DD HH:MM'
 */
function formatHorizonsDate(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hour = String(date.getUTCHours()).padStart(2, '0');
  const minute = String(date.getUTCMinutes()).padStart(2, '0');

  // Horizons requires quoting when the date contains a space.
  return `'${year}-${month}-${day} ${hour}:${minute}'`;
}

/**
 * Batch fetch multiple planets in parallel
 */
export async function fetchMultiplePlanets(
  planets: string[],
  date: Date
): Promise<Record<string, PlanetPosition>> {
  const results = await Promise.allSettled(
    planets.map(async (planet) => {
      const position = await fetchFromHorizons(planet, date);
      return { planet, position };
    })
  );

  const positions: Record<string, PlanetPosition> = {};

  for (const result of results) {
    if (result.status === 'fulfilled' && result.value.position) {
      positions[result.value.planet] = result.value.position;
    } else if (result.status === 'rejected') {
      console.error(
        `[Horizons] Failed to fetch planet:`,
        result.reason
      );
    }
  }

  return positions;
}
