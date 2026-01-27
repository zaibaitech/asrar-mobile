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
    QUANTITIES: '1,31', // Astrometric RA/DEC, ecliptic lon/lat, distance
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

      const text = await response.text();

      // Parse the response
      const position = parseHorizonsResponse(text, planet);

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

    // Parse CSV data line (format: Date, RA, DEC, etc.)
    const dataLine = lines[0].trim();
    const parts = dataLine.split(',').map((p) => p.trim());

    // Extract ecliptic coordinates
    // The exact column indices depend on QUANTITIES parameter
    // For QUANTITIES='1,31', we get:
    // Date, RA, DEC, Azimuth, Elevation, ..., ObsEcLon, ObsEcLat, ...

    // Parse ecliptic longitude and latitude
    let longitude = 0;
    let latitude = 0;
    let distance = 0;
    let speed = 0;

    // Extract from the response text (format varies, need to parse carefully)
    // For now, use regex to extract key values
    const lonMatch = text.match(/ObsEcLon[^\d]+([\d.]+)/);
    const latMatch = text.match(/ObsEcLat[^\d]+([\d.]+)/);
    const distMatch = text.match(/delta[^\d]+([\d.]+)/i);

    if (lonMatch) longitude = parseFloat(lonMatch[1]);
    if (latMatch) latitude = parseFloat(latMatch[1]);
    if (distMatch) distance = parseFloat(distMatch[1]);

    // Alternative: Parse from CSV if available
    if (parts.length >= 8) {
      // Typical format: Date, RA, DEC, ..., EcLon(6), EcLat(7), Dist(8)
      if (!lonMatch && parts[6]) longitude = parseFloat(parts[6]);
      if (!latMatch && parts[7]) latitude = parseFloat(parts[7]);
      if (!distMatch && parts[8]) distance = parseFloat(parts[8]);
    }

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

  return `${year}-${month}-${day} ${hour}:${minute}`;
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
