/**
 * Natal Chart Service
 * ===================
 * Provides advanced astrological calculations for natal charts
 * 
 * Features:
 * - Ascendant (Rising Sign) calculation
 * - Moon Sign calculation
 * - Moon Phase at birth
 * - House system (Placidus)
 * - Planetary aspects (conjunction, opposition, trine, square, sextile)
 * 
 * Note: Uses EphemerisService for accurate planetary positions
 */

import { UserLocation } from '@/types/user-profile';
import { getPlanetPositions } from './EphemerisService';

// Zodiac signs (Burj names)
const BURJ_NAMES_AR = [
  'الحمل', 'الثور', 'الجوزاء', 'السرطان', 
  'الأسد', 'العذراء', 'الميزان', 'العقرب',
  'القوس', 'الجدي', 'الدلو', 'الحوت'
];

const BURJ_NAMES_EN = [
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

// Moon phase names
const MOON_PHASES_AR = [
  'محاق', 'هلال متزايد', 'تربيع أول', 'أحدب متزايد',
  'بدر', 'أحدب متناقص', 'تربيع أخير', 'هلال متناقص'
];

const MOON_PHASES_EN = [
  'New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous',
  'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'
];

/**
 * Planet position in a sign
 */
export interface PlanetInSign {
  burjAr: string;
  burjEn: string;
  burjIndex: number;
  degree: number; // Degree within the sign (0-30)
}

/**
 * Planetary aspect
 */
export interface Aspect {
  planet1: string;
  planet2: string;
  type: 'conjunction' | 'opposition' | 'trine' | 'square' | 'sextile';
  typeAr: string;
  orb: number; // Difference from exact aspect in degrees
  interpretation: string;
  interpretationAr: string;
}

/**
 * Complete natal chart
 */
export interface NatalChart {
  sun: PlanetInSign;
  moon: PlanetInSign;
  ascendant: PlanetInSign;
  moonPhase: {
    phaseAr: string;
    phaseEn: string;
    illumination: number;
  };
  houses: number[]; // 12 house cusps in degrees
  planets: {
    mercury: PlanetInSign;
    venus: PlanetInSign;
    mars: PlanetInSign;
    jupiter: PlanetInSign;
    saturn: PlanetInSign;
  };
  aspects: Aspect[];
  calculatedAt: string;
}

/**
 * Calculate Local Sidereal Time (LST)
 * Required for Ascendant and house calculations
 */
function calculateLST(date: Date, longitude: number): number {
  // Get Julian Day Number
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  
  // Julian Day calculation
  let a = Math.floor((14 - month) / 12);
  let y = year + 4800 - a;
  let m = month + 12 * a - 3;
  
  let jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  let jd = jdn + (hours - 12) / 24 + minutes / 1440;
  
  // Days since J2000.0
  let d = jd - 2451545.0;
  
  // Greenwich Mean Sidereal Time at 0h UT
  let gmst = 18.697374558 + 24.06570982441908 * d;
  
  // Normalize to 0-24 hours
  gmst = gmst % 24;
  if (gmst < 0) gmst += 24;
  
  // Convert to degrees
  let gmstDegrees = gmst * 15;
  
  // Add longitude to get Local Sidereal Time
  let lst = gmstDegrees + longitude;
  
  // Normalize to 0-360
  lst = lst % 360;
  if (lst < 0) lst += 360;
  
  return lst;
}

function getTimeZoneOffsetMs(date: Date, timeZone: string): number {
  // Offset = (time in tz interpreted as UTC) - (actual UTC time)
  // This is a common Intl-based technique that handles DST.
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const parts = dtf.formatToParts(date);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);

  const year = get('year');
  const month = get('month');
  const day = get('day');
  const hour = get('hour');
  const minute = get('minute');
  const second = get('second');

  const asUTC = Date.UTC(year, month - 1, day, hour, minute, second);
  return asUTC - date.getTime();
}

function zonedLocalToUtcDate(dobISO: string, birthTime: string, timeZone: string): Date | null {
  const [yRaw, mRaw, dRaw] = dobISO.split('-');
  const [hhRaw, mmRaw] = birthTime.split(':');

  const year = Number(yRaw);
  const month = Number(mRaw);
  const day = Number(dRaw);
  const hours = Number(hhRaw);
  const minutes = Number(mmRaw);

  if (
    !Number.isFinite(year) ||
    !Number.isFinite(month) ||
    !Number.isFinite(day) ||
    !Number.isFinite(hours) ||
    !Number.isFinite(minutes)
  ) {
    return null;
  }

  // First guess: interpret the local wall-clock time as UTC.
  const localAsUTC = Date.UTC(year, month - 1, day, hours, minutes, 0);
  let utc = new Date(localAsUTC);

  // Refine using tz offset at that instant (do twice for DST boundaries).
  for (let i = 0; i < 2; i++) {
    const offset = getTimeZoneOffsetMs(utc, timeZone);
    utc = new Date(localAsUTC - offset);
  }

  return utc;
}

/**
 * Calculate Ascendant (Rising Sign)
 * Based on LST and geographic latitude
 */
export async function calculateAscendant(
  dobISO: string,
  birthTime: string,
  location: UserLocation,
  timeZone: string = 'UTC'
): Promise<PlanetInSign | null> {
  try {
    const date = zonedLocalToUtcDate(dobISO, birthTime, timeZone);
    if (!date) {
      return null;
    }
    
    // Calculate LST
    const lst = calculateLST(date, location.longitude);
    const latitude = location.latitude;
    
    // Calculate Ascendant using simplified formula
    // For precise calculation, use full obliquity of ecliptic
    const obliquity = 23.4397; // Mean obliquity of ecliptic
    
    // RAMC (Right Ascension of Midheaven)
    const ramc = lst;
    
    // Ascendant calculation (simplified Placidus)
    // tan(Asc) = -cos(RAMC) / (sin(RAMC) * cos(obliquity) + tan(lat) * sin(obliquity))
    const ramcRad = (ramc * Math.PI) / 180;
    const latRad = (latitude * Math.PI) / 180;
    const obliquityRad = (obliquity * Math.PI) / 180;
    
    const numerator = -Math.cos(ramcRad);
    const denominator = Math.sin(ramcRad) * Math.cos(obliquityRad) + Math.tan(latRad) * Math.sin(obliquityRad);
    
    let ascendant = Math.atan2(numerator, denominator) * (180 / Math.PI);
    
    // Normalize to 0-360
    if (ascendant < 0) ascendant += 360;
    
    // Convert to sign and degree
    const burjIndex = Math.floor(ascendant / 30);
    const degree = ascendant % 30;
    
    return {
      burjAr: BURJ_NAMES_AR[burjIndex],
      burjEn: BURJ_NAMES_EN[burjIndex],
      burjIndex,
      degree
    };
  } catch (error) {
    if (__DEV__) {
      console.error('[NatalChartService] Error calculating ascendant:', error);
    }
    return null;
  }
}

/**
 * Synchronous ascendant calculation for use in profile derivation.
 */
export function calculateAscendantSync(
  dobISO: string,
  birthTime: string,
  timeZone: string,
  location: UserLocation
): PlanetInSign | null {
  try {
    const date = zonedLocalToUtcDate(dobISO, birthTime, timeZone);
    if (!date) {
      return null;
    }

    const lst = calculateLST(date, location.longitude);
    const latitude = location.latitude;

    const obliquity = 23.4397;
    const ramc = lst;

    const ramcRad = (ramc * Math.PI) / 180;
    const latRad = (latitude * Math.PI) / 180;
    const obliquityRad = (obliquity * Math.PI) / 180;

    const numerator = -Math.cos(ramcRad);
    const denominator =
      Math.sin(ramcRad) * Math.cos(obliquityRad) + Math.tan(latRad) * Math.sin(obliquityRad);

    let ascendant = Math.atan2(numerator, denominator) * (180 / Math.PI);

    if (ascendant < 0) ascendant += 360;

    const burjIndex = Math.floor(ascendant / 30);
    const degree = ascendant % 30;

    return {
      burjAr: BURJ_NAMES_AR[burjIndex],
      burjEn: BURJ_NAMES_EN[burjIndex],
      burjIndex,
      degree,
    };
  } catch (error) {
    if (__DEV__) {
      console.error('[NatalChartService] Error calculating ascendant (sync):', error);
    }
    return null;
  }
}

/**
 * Calculate Moon Sign from ephemeris data
 */
export async function calculateMoonSign(
  dobISO: string,
  birthTime: string
): Promise<PlanetInSign | null> {
  try {
    const date = new Date(`${dobISO}T${birthTime}:00`);
    
    // Get Moon position from ephemeris
    const positions = await getPlanetPositions(date);
    
    if (!positions || !positions.planets.moon) {
      return null;
    }
    
    const moonDegree = positions.planets.moon.longitude;
    const burjIndex = Math.floor(moonDegree / 30);
    const degreeInBurj = moonDegree % 30;
    
    return {
      burjAr: BURJ_NAMES_AR[burjIndex],
      burjEn: BURJ_NAMES_EN[burjIndex],
      burjIndex,
      degree: degreeInBurj
    };
  } catch (error) {
    console.error('Error calculating moon sign:', error);
    return null;
  }
}

/**
 * Calculate Moon Phase at birth
 */
export function calculateMoonPhaseAtBirth(
  sunDegree: number,
  moonDegree: number
): { phaseAr: string; phaseEn: string; illumination: number } {
  // Calculate angular separation
  let elongation = moonDegree - sunDegree;
  if (elongation < 0) elongation += 360;
  
  // Calculate illumination percentage
  const illumination = (1 - Math.cos((elongation * Math.PI) / 180)) / 2 * 100;
  
  // Determine phase
  let phaseIndex: number;
  if (elongation < 22.5 || elongation >= 337.5) phaseIndex = 0; // New Moon
  else if (elongation < 67.5) phaseIndex = 1; // Waxing Crescent
  else if (elongation < 112.5) phaseIndex = 2; // First Quarter
  else if (elongation < 157.5) phaseIndex = 3; // Waxing Gibbous
  else if (elongation < 202.5) phaseIndex = 4; // Full Moon
  else if (elongation < 247.5) phaseIndex = 5; // Waning Gibbous
  else if (elongation < 292.5) phaseIndex = 6; // Last Quarter
  else phaseIndex = 7; // Waning Crescent
  
  return {
    phaseAr: MOON_PHASES_AR[phaseIndex],
    phaseEn: MOON_PHASES_EN[phaseIndex],
    illumination: Math.round(illumination)
  };
}

/**
 * Calculate house cusps using Placidus system
 */
export function calculateHouses(
  date: Date,
  location: UserLocation
): number[] {
  const lst = calculateLST(date, location.longitude);
  const latitude = location.latitude;
  const obliquity = 23.4397;
  
  const houses: number[] = [];
  
  // House 1 is the Ascendant (calculated separately)
  // House 10 is the MC (Midheaven) = LST
  const mc = lst;
  houses[9] = mc; // 10th house
  
  // Houses 11, 12, 2, 3 using Placidus formula
  // Simplified calculation
  for (let i = 0; i < 12; i++) {
    if (i === 9) continue; // Already calculated MC
    
    // Simplified: divide the quadrants
    const quadrant = Math.floor(i / 3);
    const offset = (i % 3) * 30;
    houses[i] = (mc + quadrant * 90 + offset) % 360;
  }
  
  return houses;
}

/**
 * Calculate aspects between planets
 */
export function calculateAspects(
  planetDegrees: Record<string, number>
): Aspect[] {
  const aspects: Aspect[] = [];
  const planets = Object.keys(planetDegrees);
  
  // Aspect definitions with orbs
  const aspectDefs = [
    { type: 'conjunction' as const, angle: 0, orb: 8, typeAr: 'مقارنة' },
    { type: 'opposition' as const, angle: 180, orb: 8, typeAr: 'مقابلة' },
    { type: 'trine' as const, angle: 120, orb: 8, typeAr: 'تثليث' },
    { type: 'square' as const, angle: 90, orb: 7, typeAr: 'تربيع' },
    { type: 'sextile' as const, angle: 60, orb: 6, typeAr: 'تسديس' }
  ];
  
  // Check all planet pairs
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const planet1 = planets[i];
      const planet2 = planets[j];
      const deg1 = planetDegrees[planet1];
      const deg2 = planetDegrees[planet2];
      
      // Calculate angular separation
      let separation = Math.abs(deg2 - deg1);
      if (separation > 180) separation = 360 - separation;
      
      // Check for aspects
      for (const aspectDef of aspectDefs) {
        const diff = Math.abs(separation - aspectDef.angle);
        if (diff <= aspectDef.orb) {
          aspects.push({
            planet1,
            planet2,
            type: aspectDef.type,
            typeAr: aspectDef.typeAr,
            orb: diff,
            interpretation: interpretAspect(planet1, planet2, aspectDef.type),
            interpretationAr: interpretAspect(planet1, planet2, aspectDef.type, true)
          });
        }
      }
    }
  }
  
  return aspects;
}

/**
 * Interpret an aspect
 */
function interpretAspect(
  planet1: string,
  planet2: string,
  type: string,
  arabic: boolean = false
): string {
  const interpretations: Record<string, Record<string, string>> = {
    conjunction: {
      en: `${planet1} and ${planet2} merge energies, amplifying their combined influence`,
      ar: `${planet1} و ${planet2} يدمجان الطاقات، مما يضخم تأثيرهما المشترك`
    },
    opposition: {
      en: `${planet1} and ${planet2} are in tension, requiring balance`,
      ar: `${planet1} و ${planet2} في توتر، يتطلبان التوازن`
    },
    trine: {
      en: `${planet1} and ${planet2} flow harmoniously, bringing ease and talent`,
      ar: `${planet1} و ${planet2} يتدفقان بانسجام، مما يجلب السهولة والموهبة`
    },
    square: {
      en: `${planet1} and ${planet2} create friction, driving growth through challenge`,
      ar: `${planet1} و ${planet2} يخلقان احتكاكاً، مما يدفع النمو من خلال التحدي`
    },
    sextile: {
      en: `${planet1} and ${planet2} support each other, offering opportunities`,
      ar: `${planet1} و ${planet2} يدعمان بعضهما، مما يوفر الفرص`
    }
  };
  
  const lang = arabic ? 'ar' : 'en';
  return interpretations[type]?.[lang] || '';
}

/**
 * Generate complete natal chart
 */
export async function generateNatalChart(
  dobISO: string,
  birthTime: string,
  location: UserLocation,
  timeZone: string = 'UTC'
): Promise<NatalChart | null> {
  try {
    const date = zonedLocalToUtcDate(dobISO, birthTime, timeZone);
    if (!date) {
      return null;
    }
    
    // Get planetary positions from ephemeris
    const positions = await getPlanetPositions(date);
    
    if (!positions) {
      return null;
    }
    
    // Calculate Ascendant
    const ascendant = await calculateAscendant(dobISO, birthTime, location, timeZone);
    if (!ascendant) {
      return null;
    }
    
    // Extract planet positions
    const sunDegree = positions.planets.sun?.longitude || 0;
    const moonSign = await calculateMoonSign(dobISO, birthTime);
    
    if (!moonSign) {
      return null;
    }
    
    // Calculate moon phase
    const moonPhase = calculateMoonPhaseAtBirth(sunDegree, positions.planets.moon?.longitude || 0);
    
    // Build planets object
    const planets = {
      mercury: {
        burjIndex: Math.floor((positions.planets.mercury?.longitude || 0) / 30),
        degree: (positions.planets.mercury?.longitude || 0) % 30,
        burjAr: BURJ_NAMES_AR[Math.floor((positions.planets.mercury?.longitude || 0) / 30)],
        burjEn: BURJ_NAMES_EN[Math.floor((positions.planets.mercury?.longitude || 0) / 30)]
      },
      venus: {
        burjIndex: Math.floor((positions.planets.venus?.longitude || 0) / 30),
        degree: (positions.planets.venus?.longitude || 0) % 30,
        burjAr: BURJ_NAMES_AR[Math.floor((positions.planets.venus?.longitude || 0) / 30)],
        burjEn: BURJ_NAMES_EN[Math.floor((positions.planets.venus?.longitude || 0) / 30)]
      },
      mars: {
        burjIndex: Math.floor((positions.planets.mars?.longitude || 0) / 30),
        degree: (positions.planets.mars?.longitude || 0) % 30,
        burjAr: BURJ_NAMES_AR[Math.floor((positions.planets.mars?.longitude || 0) / 30)],
        burjEn: BURJ_NAMES_EN[Math.floor((positions.planets.mars?.longitude || 0) / 30)]
      },
      jupiter: {
        burjIndex: Math.floor((positions.planets.jupiter?.longitude || 0) / 30),
        degree: (positions.planets.jupiter?.longitude || 0) % 30,
        burjAr: BURJ_NAMES_AR[Math.floor((positions.planets.jupiter?.longitude || 0) / 30)],
        burjEn: BURJ_NAMES_EN[Math.floor((positions.planets.jupiter?.longitude || 0) / 30)]
      },
      saturn: {
        burjIndex: Math.floor((positions.planets.saturn?.longitude || 0) / 30),
        degree: (positions.planets.saturn?.longitude || 0) % 30,
        burjAr: BURJ_NAMES_AR[Math.floor((positions.planets.saturn?.longitude || 0) / 30)],
        burjEn: BURJ_NAMES_EN[Math.floor((positions.planets.saturn?.longitude || 0) / 30)]
      }
    };
    
    // Calculate houses
    const houses = calculateHouses(date, location);
    
    // Calculate aspects
    const planetDegrees: Record<string, number> = {
      sun: sunDegree,
      moon: positions.planets.moon?.longitude || 0,
      mercury: positions.planets.mercury?.longitude || 0,
      venus: positions.planets.venus?.longitude || 0,
      mars: positions.planets.mars?.longitude || 0,
      jupiter: positions.planets.jupiter?.longitude || 0,
      saturn: positions.planets.saturn?.longitude || 0,
    };
    const aspects = calculateAspects(planetDegrees);
    
    return {
      sun: {
        burjIndex: Math.floor(sunDegree / 30),
        degree: sunDegree % 30,
        burjAr: BURJ_NAMES_AR[Math.floor(sunDegree / 30)],
        burjEn: BURJ_NAMES_EN[Math.floor(sunDegree / 30)]
      },
      moon: moonSign,
      ascendant,
      moonPhase,
      houses,
      planets,
      aspects,
      calculatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error generating natal chart:', error);
    return null;
  }
}
