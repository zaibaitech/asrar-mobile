/**
 * Birth Profile Service
 * =====================
 * 
 * Computes spiritual birth profile from birth date/time/place using:
 * - Real-time ephemeris data (FMF/NASA JPL)
 * - Traditional planetary dignities
 * - Lunar mansions (Manazil)
 * - Planetary hours
 * - Elemental synthesis
 * 
 * FORMULAS USED:
 * --------------
 * 1. Zodiac Sign: floor(longitude / 30) mod 12
 * 2. Degree in Sign: longitude mod 30
 * 3. Lunar Mansion (Manzil): floor((Moon longitude + 10) / 12.857) + 1
 * 4. Day Ruler: Based on weekday (Chaldean order)
 * 5. Planetary Hour: Based on local sunrise and hour count
 * 6. Ascendant: Requires RAMC (Right Ascension of MC) + obliquity calculation
 * 7. Planet Condition: Essential dignities (domicile, exaltation, detriment, fall)
 * 
 * DATA SOURCES:
 * - Ephemeris: EphemerisService (NASA JPL Horizons)
 * - Prayer times (for sunrise): Prayer Times API
 * - Planetary hours: PlanetaryHoursService
 * 
 * @see /workspaces/asrar-mobile/services/EphemerisService.ts
 */

import { MANAZIL_DATA } from '../constants/ManazilData';
import { BirthInsights } from '../types/calculator-enhanced';
import { ElementType } from '../utils/types';
import { getPlanetPositionsPrecise } from './EphemerisService';
import { calculateAscendantSync } from './NatalChartService';

// ============================================================================
// TYPES
// ============================================================================

interface BirthInput {
  dateOfBirth: Date;
  timeOfBirth?: Date;
  timeKnown: boolean;
  placeOfBirth: {
    city?: string;
    latitude: number;
    longitude: number;
    timezone: string;
  };
  arabicName?: string;
  motherName?: string;
}

interface PlanetPosition {
  longitude: number;
  latitude: number;
  sign: string;
  degree: number;
  element: ElementType;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const ZODIAC_SIGNS = [
  { name: 'Aries', element: 'fire' as ElementType, ruler: 'Mars' },
  { name: 'Taurus', element: 'earth' as ElementType, ruler: 'Venus' },
  { name: 'Gemini', element: 'air' as ElementType, ruler: 'Mercury' },
  { name: 'Cancer', element: 'water' as ElementType, ruler: 'Moon' },
  { name: 'Leo', element: 'fire' as ElementType, ruler: 'Sun' },
  { name: 'Virgo', element: 'earth' as ElementType, ruler: 'Mercury' },
  { name: 'Libra', element: 'air' as ElementType, ruler: 'Venus' },
  { name: 'Scorpio', element: 'water' as ElementType, ruler: 'Mars' },
  { name: 'Sagittarius', element: 'fire' as ElementType, ruler: 'Jupiter' },
  { name: 'Capricorn', element: 'earth' as ElementType, ruler: 'Saturn' },
  { name: 'Aquarius', element: 'air' as ElementType, ruler: 'Saturn' },
  { name: 'Pisces', element: 'water' as ElementType, ruler: 'Jupiter' },
];

const PLANET_DIGNITIES = {
  Sun: { domicile: ['Leo'], exaltation: ['Aries'], detriment: ['Aquarius'], fall: ['Libra'] },
  Moon: { domicile: ['Cancer'], exaltation: ['Taurus'], detriment: ['Capricorn'], fall: ['Scorpio'] },
  Mercury: { domicile: ['Gemini', 'Virgo'], exaltation: ['Virgo'], detriment: ['Sagittarius', 'Pisces'], fall: ['Pisces'] },
  Venus: { domicile: ['Taurus', 'Libra'], exaltation: ['Pisces'], detriment: ['Aries', 'Scorpio'], fall: ['Virgo'] },
  Mars: { domicile: ['Aries', 'Scorpio'], exaltation: ['Capricorn'], detriment: ['Libra', 'Taurus'], fall: ['Cancer'] },
  Jupiter: { domicile: ['Sagittarius', 'Pisces'], exaltation: ['Cancer'], detriment: ['Gemini', 'Virgo'], fall: ['Capricorn'] },
  Saturn: { domicile: ['Capricorn', 'Aquarius'], exaltation: ['Libra'], detriment: ['Cancer', 'Leo'], fall: ['Aries'] },
};

const CHALDEAN_DAYS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];

const ELEMENT_TO_TEMPERAMENT = {
  fire: 'hot-dry',
  air: 'hot-moist',
  water: 'cold-moist',
  earth: 'cold-dry',
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Convert ecliptic longitude to zodiac sign and degree
 */
function longitudeToSign(longitude: number): { sign: string; degree: number; element: ElementType } {
  const normalizedLon = ((longitude % 360) + 360) % 360;
  const signIndex = Math.floor(normalizedLon / 30);
  const degree = normalizedLon % 30;
  const zodiacSign = ZODIAC_SIGNS[signIndex];
  
  return {
    sign: zodiacSign.name,
    degree: Math.floor(degree * 100) / 100, // 2 decimal places
    element: zodiacSign.element,
  };
}

/**
 * Calculate lunar mansion (Manzil) from Moon longitude
 */
function getLunarMansion(moonLongitude: number): { index: number; arabicName: string; meaningKey: string } {
  const normalizedLon = ((moonLongitude % 360) + 360) % 360;
  // Each manzil is ~12.857 degrees (360 / 28)
  const manzilIndex = Math.floor(normalizedLon / 12.857);
  const index = (manzilIndex % 28) + 1;
  
  const manzilData = MANAZIL_DATA[index - 1];
  
  return {
    index,
    arabicName: manzilData?.name || `Manzil ${index}`,
    meaningKey: `manazil.${index}.meaning`,
  };
}

/**
 * Get day ruler based on weekday
 */
function getDayRuler(date: Date): { planet: string; element: ElementType } {
  const dayOfWeek = date.getDay(); // 0 = Sunday
  const planet = CHALDEAN_DAYS[dayOfWeek];
  const sign = ZODIAC_SIGNS.find(z => z.ruler === planet);
  
  return {
    planet,
    element: sign?.element || 'fire',
  };
}

/**
 * Calculate planet condition (dignity-based)
 */
function getPlanetCondition(planet: string, sign: string): {
  label: 'strong' | 'neutral' | 'weak';
  score: number;
  reasonKey: string;
} {
  const dignities = PLANET_DIGNITIES[planet as keyof typeof PLANET_DIGNITIES];
  if (!dignities) {
    return { label: 'neutral', score: 50, reasonKey: 'calculator.birth.conditionNeutral' };
  }

  if (dignities.domicile.includes(sign)) {
    return { label: 'strong', score: 90, reasonKey: 'calculator.birth.conditionDomicile' };
  }
  
  if (dignities.exaltation.includes(sign)) {
    return { label: 'strong', score: 85, reasonKey: 'calculator.birth.conditionExaltation' };
  }
  
  if (dignities.detriment.includes(sign)) {
    return { label: 'weak', score: 30, reasonKey: 'calculator.birth.conditionDetriment' };
  }
  
  if (dignities.fall.includes(sign)) {
    return { label: 'weak', score: 20, reasonKey: 'calculator.birth.conditionFall' };
  }

  return { label: 'neutral', score: 50, reasonKey: 'calculator.birth.conditionPeregrine' };
}

/**
 * Calculate Moon phase from Sun-Moon elongation
 */
function getMoonPhase(sunLon: number, moonLon: number): {
  phase: string;
  lunarDay: number;
  illumination: number;
  isWaxing: boolean;
} {
  let elongation = moonLon - sunLon;
  if (elongation < 0) elongation += 360;
  
  const lunarDay = Math.floor(elongation / 12) + 1;
  const illumination = Math.round((1 - Math.cos((elongation * Math.PI) / 180)) * 50);
  const isWaxing = elongation < 180;

  let phase = 'new';
  if (elongation < 45) phase = 'new';
  else if (elongation < 90) phase = 'waxing_crescent';
  else if (elongation < 135) phase = 'first_quarter';
  else if (elongation < 180) phase = 'waxing_gibbous';
  else if (elongation < 225) phase = 'full';
  else if (elongation < 270) phase = 'waning_gibbous';
  else if (elongation < 315) phase = 'last_quarter';
  else phase = 'waning_crescent';

  return { phase, lunarDay, illumination, isWaxing };
}

/**
 * Calculate Ascendant (simplified - uses approximate formula)
 * Requires: Local Sidereal Time (LST) and latitude
 * 
 * NOTE: This is a simplified calculation. For precise Ascendant,
 * we'd need the exact RAMC and use house system formulas.
 */
/**
 * Convert local time to UTC using IANA timezone
 * Uses the Intl API to get offset for the specific date (handles DST)
 */
function convertLocalToUTC(localDateTime: Date, timezoneId: string): Date {
  try {
    if (__DEV__) {
      console.log(`\n[convertLocalToUTC] Converting local time to UTC`);
      console.log(`  Input local time: ${localDateTime.toISOString()}`);
      console.log(`  Timezone ID: ${timezoneId}`);
    }
    
    // Format: localDateTime in local time, timezoneId in IANA format (e.g., 'Africa/Banjul')
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezoneId,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    
    // Get parts in the target timezone
    const parts = formatter.formatToParts(localDateTime);
    const partsMap: Record<string, string> = {};
    parts.forEach(part => {
      partsMap[part.type] = part.value;
    });
    
    // Create a UTC date from the parts
    const utcYear = parseInt(partsMap.year);
    const utcMonth = parseInt(partsMap.month) - 1;
    const utcDay = parseInt(partsMap.day);
    const utcHours = parseInt(partsMap.hour);
    const utcMinutes = parseInt(partsMap.minute);
    const utcSeconds = parseInt(partsMap.second);
    
    // Calculate offset by comparing UTC with formatted local time
    const checkDate = new Date(Date.UTC(utcYear, utcMonth, utcDay, utcHours, utcMinutes, utcSeconds));
    const offset = checkDate.getTime() - localDateTime.getTime();
    const offsetHours = offset / (1000 * 60 * 60);
    
    if (__DEV__) {
      console.log(`  Timezone parts: ${utcYear}-${String(utcMonth+1).padStart(2,'0')}-${String(utcDay).padStart(2,'0')} ${String(utcHours).padStart(2,'0')}:${String(utcMinutes).padStart(2,'0')}:${String(utcSeconds).padStart(2,'0')}`);
      console.log(`  Calculated offset: ${offsetHours.toFixed(1)} hours (${offset}ms)`);
    }
    
    // Return UTC time
    const result = new Date(localDateTime.getTime() + offset);
    
    if (__DEV__) {
      console.log(`  Result UTC: ${result.toISOString()}`);
    }
    
    return result;
  } catch (error) {
    console.error(`[BirthProfileService] Error converting timezone ${timezoneId}:`, error);
    // Fallback: assume UTC if timezone conversion fails
    return new Date(localDateTime);
  }
}

function calculateAscendant(
  birthDateTime: Date,
  latitude: number,
  longitude: number
): { sign: string; degree: number; element: ElementType } | null {
  try {
    if (__DEV__) {
      console.log('\n=== ASCENDANT CALCULATION DEBUG ===');
      console.log(`Input: UTC DateTime: ${birthDateTime.toISOString()}`);
      console.log(`Input: Latitude: ${latitude.toFixed(4)}°`);
      console.log(`Input: Longitude: ${longitude.toFixed(4)}°`);
    }

    // Step 1: Calculate Julian Day Number
    const jd = dateToJulianDay(birthDateTime);
    if (__DEV__) {
      console.log(`\nStep 1 - Julian Day:`);
      console.log(`  JD = ${jd.toFixed(6)}`);
    }

    // Step 2: Calculate T (Julian centuries from J2000.0)
    const T = (jd - 2451545.0) / 36525;
    if (__DEV__) {
      console.log(`\nStep 2 - Time T (Julian centuries):`);
      console.log(`  T = ${T.toFixed(8)}`);
    }

    // Step 3: Calculate GMST (Greenwich Mean Sidereal Time) at 0h UT
    // Using USNO formula: UT1 = (JD - 2451545.0) * 86400 seconds
    const UT1_seconds = (jd - Math.floor(jd)) * 86400; // Seconds since 0h UT
    const GMST0h = 67310.54841 + 
                   (876600.0 * 3600 + 8640184.812866) * T + 
                   0.093104 * T * T - 
                   6.2e-6 * T * T * T;
    
    const GMST = (GMST0h + UT1_seconds * 1.00273790935) % 86400;
    const GMST_hours = GMST / 3600;
    const GMST_degrees = (GMST_hours / 24) * 360;
    
    if (__DEV__) {
      console.log(`\nStep 3 - GMST (Greenwich Mean Sidereal Time):`);
      console.log(`  GMST (seconds) = ${GMST.toFixed(2)}`);
      console.log(`  GMST (hours) = ${GMST_hours.toFixed(6)}`);
      console.log(`  GMST (degrees) = ${GMST_degrees.toFixed(4)}°`);
    }

    // Step 4: Calculate LST (Local Sidereal Time)
    // LST = GMST + (observer longitude in hours)
    // Note: West longitude is NEGATIVE
    const longitude_hours = longitude / 15; // Convert degrees to hours (360°/24h = 15°/h)
    const LST_degrees = (GMST_degrees + longitude_hours * 15 + 360) % 360;
    
    if (__DEV__) {
      console.log(`\nStep 4 - Local Sidereal Time (LST):`);
      console.log(`  Longitude in hours = ${longitude_hours.toFixed(4)}h`);
      console.log(`  LST (degrees) = ${LST_degrees.toFixed(4)}°`);
    }

    // Step 5: Calculate Obliquity of Ecliptic
    const obliquity = 23.4392911 - 0.0130042 * T - 0.00000164 * T * T + 0.000000504 * T * T * T;
    if (__DEV__) {
      console.log(`\nStep 5 - Obliquity of Ecliptic:`);
      console.log(`  ε = ${obliquity.toFixed(6)}°`);
    }

    // Step 6: Calculate Ascendant using spherical trigonometry
    // The Ascendant is the point on the ecliptic that's rising at the horizon
    // Formula: tan(ASC ecliptic lon) = -cos(LST) / (sin(ε) * tan(φ) + cos(ε) * sin(LST))
    const LST_rad = LST_degrees * Math.PI / 180;
    const obliquity_rad = obliquity * Math.PI / 180;
    const latitude_rad = latitude * Math.PI / 180;
    
    const numerator = -Math.cos(LST_rad);
    const denominator = Math.sin(obliquity_rad) * Math.tan(latitude_rad) + 
                        Math.cos(obliquity_rad) * Math.sin(LST_rad);
    
    let ascLon = Math.atan2(numerator, denominator) * 180 / Math.PI;
    if (ascLon < 0) ascLon += 360;
    
    if (__DEV__) {
      console.log(`\nStep 6 - Ascendant Calculation:`);
      console.log(`  Numerator = ${numerator.toFixed(6)}`);
      console.log(`  Denominator = ${denominator.toFixed(6)}`);
      console.log(`  Ascendant (ecliptic longitude) = ${ascLon.toFixed(4)}°`);
    }

    // Step 7: Convert longitude to sign and degree
    const result = longitudeToSign(ascLon);
    
    if (__DEV__) {
      console.log(`\nStep 7 - Ascendant Sign and Degree:`);
      console.log(`  Ascendant = ${result.sign} ${result.degree}°`);
      console.log(`=== END ASCENDANT DEBUG ===\n`);
    }
    
    return result;
  } catch (error) {
    console.error('[BirthProfileService] Error calculating Ascendant:', error);
    return null;
  }
}

/**
 * Convert Date to Julian Day (Meeus Algorithm)
 * The Meeus formula gives the day number at noon UTC.
 * To get JD for arbitrary time, subtract 0.5 then add time fraction.
 */
function dateToJulianDay(date: Date): number {
  const a = Math.floor((14 - (date.getUTCMonth() + 1)) / 12);
  const y = date.getUTCFullYear() + 4800 - a;
  const m = (date.getUTCMonth() + 1) + 12 * a - 3;
  
  // Meeus formula: gives day number at noon UTC
  let jd = date.getUTCDate() + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  
  // Adjust for time: Meeus result is at 12h, we need to offset by (hours/24 - 0.5)
  // This shifts from noon-based to midnight-based time fractions
  const timeFraction = (date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600) / 24 - 0.5;
  jd += timeFraction;
  
  if (__DEV__) {
    console.log(`[dateToJulianDay] UTC: ${date.toISOString()}`);
    console.log(`  Day fraction (UT): ${(timeFraction + 0.5).toFixed(6)}`);
    console.log(`  Calculated JD: ${jd.toFixed(6)}`);
  }
  
  return jd;
}

/**
 * Determine dominant element from planet distribution
 */
function getDominantElement(planets: { element: ElementType }[]): ElementType {
  const counts = { fire: 0, water: 0, air: 0, earth: 0 };
  planets.forEach(p => counts[p.element]++);
  
  const maxCount = Math.max(...Object.values(counts));
  const dominant = Object.entries(counts).find(([_, count]) => count === maxCount);
  
  return (dominant?.[0] as ElementType) || 'fire';
}

/**
 * Determine dominant planet (most dignified + Sun/Moon/Asc rulers)
 */
function getDominantPlanet(
  planets: { planet: string; condition: { score: number } }[],
  sunSign: string,
  moonSign: string,
  ascSign?: string
): string {
  // Weight rulers higher
  const sunRuler = ZODIAC_SIGNS.find(z => z.name === sunSign)?.ruler;
  const moonRuler = ZODIAC_SIGNS.find(z => z.name === moonSign)?.ruler;
  const ascRuler = ascSign ? ZODIAC_SIGNS.find(z => z.name === ascSign)?.ruler : null;

  const scores = planets.map(p => {
    let score = p.condition.score;
    if (p.planet === sunRuler) score += 20;
    if (p.planet === moonRuler) score += 15;
    if (p.planet === ascRuler) score += 10;
    return { planet: p.planet, score };
  });

  scores.sort((a, b) => b.score - a.score);
  return scores[0]?.planet || 'Sun';
}

// ============================================================================
// MAIN SERVICE FUNCTION
// ============================================================================

/**
 * Calculate Birth Profile
 * 
 * @param input - Birth data (date, time, place, optional name)
 * @returns BirthInsights object
 */
export async function calculateBirthProfile(input: BirthInput): Promise<BirthInsights> {
  const { dateOfBirth, timeOfBirth, timeKnown, placeOfBirth, arabicName, motherName } = input;
  
  // Step 1: Create local birth datetime
  const localBirthDateTime = timeKnown && timeOfBirth 
    ? new Date(
        dateOfBirth.getFullYear(),
        dateOfBirth.getMonth(),
        dateOfBirth.getDate(),
        timeOfBirth.getHours(),
        timeOfBirth.getMinutes(),
        timeOfBirth.getSeconds()
      )
    : dateOfBirth;

  // Step 2: Convert local time to UTC using timezone
  const utcBirthDateTime = convertLocalToUTC(localBirthDateTime, placeOfBirth.timezone);
  
  // Step 3: Debug logging
  if (__DEV__) {
    console.log('[BirthProfileService] Time Pipeline Debug:');
    console.log(`  Local DateTime: ${localBirthDateTime.toISOString()}`);
    console.log(`  Timezone: ${placeOfBirth.timezone}`);
    console.log(`  UTC DateTime: ${utcBirthDateTime.toISOString()}`);
    console.log(`  Location: ${placeOfBirth.city || `${placeOfBirth.latitude}, ${placeOfBirth.longitude}`}`);
  }

  // Step 4: Fetch planetary positions from ephemeris using UTC datetime
  const positions = await getPlanetPositionsPrecise(utcBirthDateTime, placeOfBirth.timezone);
  
  if (!positions) {
    throw new Error('Unable to fetch ephemeris data for birth date');
  }

  // Parse planet positions
  const sunPos = longitudeToSign(positions.planets.sun.longitude);
  const moonPos = longitudeToSign(positions.planets.moon.longitude);
  
  const planets = [
    { planet: 'Sun', ...sunPos, longitude: positions.planets.sun.longitude, retrograde: false },
    { planet: 'Moon', ...moonPos, longitude: positions.planets.moon.longitude, retrograde: false },
    { planet: 'Mercury', ...longitudeToSign(positions.planets.mercury.longitude), longitude: positions.planets.mercury.longitude, retrograde: false },
    { planet: 'Venus', ...longitudeToSign(positions.planets.venus.longitude), longitude: positions.planets.venus.longitude, retrograde: false },
    { planet: 'Mars', ...longitudeToSign(positions.planets.mars.longitude), longitude: positions.planets.mars.longitude, retrograde: false },
    { planet: 'Jupiter', ...longitudeToSign(positions.planets.jupiter.longitude), longitude: positions.planets.jupiter.longitude, retrograde: false },
    { planet: 'Saturn', ...longitudeToSign(positions.planets.saturn.longitude), longitude: positions.planets.saturn.longitude, retrograde: false },
  ];

  // Calculate Ascendant/Descendant (only if time known)
  let ascendant: { sign: string; degree: number; element: ElementType } | undefined;
  let descendant: { sign: string; degree: number; element: ElementType } | undefined;
  
  if (timeKnown && timeOfBirth) {
    // Use NatalChartService's calculateAscendantSync for accurate Ascendant calculation
    // Format inputs for NatalChartService: dobISO (YYYY-MM-DD), birthTime (HH:mm), timezone, location
    const dobISO = dateOfBirth.toISOString().split('T')[0];
    const birthTimeStr = `${String(timeOfBirth.getHours()).padStart(2, '0')}:${String(timeOfBirth.getMinutes()).padStart(2, '0')}`;
    const ascResult = calculateAscendantSync(
      dobISO,
      birthTimeStr,
      placeOfBirth.timezone,
      { latitude: placeOfBirth.latitude, longitude: placeOfBirth.longitude }
    );
    if (ascResult) {
      // Convert NatalChartService result to our format
      const ascSign = ZODIAC_SIGNS[ascResult.burjIndex];
      ascendant = {
        sign: ascResult.burjEn,
        degree: ascResult.degree,
        element: ascSign?.element || 'fire'
      };
      // Descendant is opposite (180 degrees)
      const descLon = (ascResult.degree + ascResult.burjIndex * 30 + 180) % 360;
      descendant = longitudeToSign(descLon);
    }
  }

  // Lunar mansion
  const lunarMansion = getLunarMansion(positions.planets.moon.longitude);

  // Day ruler (based on UTC day for consistency)
  const dayRuler = getDayRuler(utcBirthDateTime);

  // Moon phase
  const moonTiming = getMoonPhase(positions.planets.sun.longitude, positions.planets.moon.longitude);

  // Planet conditions
  const planetsWithConditions = planets.map(p => ({
    planet: p.planet,
    sign: p.sign,
    degree: p.degree,
    retrograde: p.retrograde,
    condition: getPlanetCondition(p.planet, p.sign),
  }));

  // Spiritual synthesis
  const dominantElement = getDominantElement([sunPos, moonPos, ...(ascendant ? [ascendant] : [])]);
  const dominantPlanet = getDominantPlanet(planetsWithConditions, sunPos.sign, moonPos.sign, ascendant?.sign);
  const temperament = ELEMENT_TO_TEMPERAMENT[dominantElement];

  const guidanceBulletsKeys = [
    // Element guidance (multiple bullets)
    `calculator.birth.guidance.${dominantElement}.1`,
    `calculator.birth.guidance.${dominantElement}.2`,
    `calculator.birth.guidance.${dominantElement}.3`,
    // Planet guidance (multiple bullets)
    `calculator.birth.guidance.${dominantPlanet.toLowerCase()}.1`,
    `calculator.birth.guidance.${dominantPlanet.toLowerCase()}.2`,
    // Temperament balancing tip
    `calculator.birth.guidance.temperament.${temperament}`,
  ];

  // Name resonance (if provided)
  let nameResonance: BirthInsights['nameResonance'];
  if (arabicName || motherName) {
    // TODO: Calculate name Abjad element and compare
    nameResonance = {
      birthElement: dominantElement,
      birthRuler: dominantPlanet,
      alignment: 'aligned', // Placeholder
      explanationKey: 'calculator.birth.nameResonanceAligned',
    };
  }

  // Build result
  const result: BirthInsights = {
    birthData: {
      dateOfBirth: dateOfBirth.toISOString(),
      timeOfBirth: timeOfBirth?.toTimeString().slice(0, 5),
      timeKnown,
      placeOfBirth,
    },
    chartBasics: {
      sunSign: sunPos,
      moonSign: moonPos,
      ascendant,
      descendant,
      lunarMansion,
      dayRuler,
      planetaryHourRuler: undefined, // TODO: Calculate planetary hour
    },
    planets: planetsWithConditions,
    moonTiming,
    spiritualImprint: {
      dominantElement,
      dominantPlanet,
      temperament,
      guidanceBulletsKeys,
    },
    nameResonance,
  };

  return result;
}

/**
 * Validate birth input data
 */
export function validateBirthInput(data: Partial<BirthInput>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.dateOfBirth) {
    errors.push('Date of birth is required');
  }

  if (!data.placeOfBirth?.latitude || !data.placeOfBirth?.longitude) {
    errors.push('Place of birth coordinates are required');
  }

  if (!data.placeOfBirth?.timezone) {
    errors.push('Timezone is required');
  }

  if (data.timeKnown && !data.timeOfBirth) {
    errors.push('Time of birth is required when time is marked as known');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Example output for testing
 */
export const EXAMPLE_BIRTH_OUTPUT = {
  birthData: {
    dateOfBirth: '1990-03-21T00:00:00.000Z',
    timeOfBirth: '14:30',
    timeKnown: true,
    placeOfBirth: {
      city: 'Casablanca',
      latitude: 33.5731,
      longitude: -7.5898,
      timezone: 'Africa/Casablanca',
    },
  },
  chartBasics: {
    sunSign: { sign: 'Aries', degree: 0.5, element: 'fire' as ElementType },
    moonSign: { sign: 'Cancer', degree: 15.3, element: 'water' as ElementType },
    ascendant: { sign: 'Leo', degree: 22.1, element: 'fire' as ElementType },
    descendant: { sign: 'Aquarius', degree: 22.1, element: 'air' as ElementType },
    lunarMansion: { index: 8, arabicName: 'An-Nathra', meaningKey: 'manazil.8.meaning' },
    dayRuler: { planet: 'Mars', element: 'fire' as ElementType },
  },
  planets: [
    { planet: 'Sun', sign: 'Aries', degree: 0.5, retrograde: false, condition: { label: 'strong' as const, score: 85, reasonKey: 'calculator.birth.conditionExaltation' } },
    { planet: 'Moon', sign: 'Cancer', degree: 15.3, retrograde: false, condition: { label: 'strong' as const, score: 90, reasonKey: 'calculator.birth.conditionDomicile' } },
  ],
  moonTiming: {
    phase: 'waxing_crescent',
    lunarDay: 5,
    illumination: 25,
    isWaxing: true,
  },
  spiritualImprint: {
    dominantElement: 'fire' as ElementType,
    dominantPlanet: 'Sun',
    temperament: 'hot-dry',
    guidanceBulletsKeys: [
      'calculator.birth.guidance.fire.1',
      'calculator.birth.guidance.sun.1',
      'calculator.birth.guidance.temperament.hot-dry',
    ],
  },
};

/**
 * DEBUG: Test Gambia case for ascendant calculation verification
 * This is a manual testing function to verify the entire time pipeline
 */
export function debugGambiaTestCase(): void {
  if (!__DEV__) return;
  
  console.log('\n\n========== GAMBIA TEST CASE DEBUG ==========');
  console.log('Test: Serrekunda, The Gambia');
  console.log('Date: 2026-01-30, Time: 20:00 (Africa/Banjul UTC+0)');
  console.log('Location: 13.43°N, -16.68°W');
  console.log('Expected: Leo Ascendant ~24° (ecliptic longitude ~144°)');
  console.log('=========================================\n');
  
  // Test using NatalChartService's calculateAscendantSync
  const dobISO = '2026-01-30';
  const birthTime = '20:00';
  const timezone = 'Africa/Banjul';
  const latitude = 13.4370;
  const longitude = -16.6812;
  
  console.log('--- Using NatalChartService.calculateAscendantSync ---');
  const result = calculateAscendantSync(
    dobISO,
    birthTime,
    timezone,
    { latitude, longitude }
  );
  
  if (result) {
    const eclipticLon = result.degree + result.burjIndex * 30;
    console.log(`Final Result: ${result.burjEn} ${result.degree.toFixed(2)}°`);
    console.log(`Ecliptic Longitude: ${eclipticLon.toFixed(2)}°`);
  } else {
    console.log('Result: null (calculation failed)');
  }
  
  console.log('\n========== END TEST ==========\n');
}

