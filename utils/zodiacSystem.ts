import type { Element } from '@/services/MomentAlignmentService';
import type { PlanetTransit, ZodiacSign } from '@/types/planetary-systems';

export type ZodiacSystem = 'tropical' | 'sidereal_lahiri';

const ZODIAC_SIGNS: ZodiacSign[] = [
  'aries', 'taurus', 'gemini', 'cancer',
  'leo', 'virgo', 'libra', 'scorpio',
  'sagittarius', 'capricorn', 'aquarius', 'pisces',
];

const ZODIAC_SIGNS_ARABIC: Record<ZodiacSign, string> = {
  aries: 'الحمل',
  taurus: 'الثور',
  gemini: 'الجوزاء',
  cancer: 'السرطان',
  leo: 'الأسد',
  virgo: 'العذراء',
  libra: 'الميزان',
  scorpio: 'العقرب',
  sagittarius: 'القوس',
  capricorn: 'الجدي',
  aquarius: 'الدلو',
  pisces: 'الحوت',
};

const ZODIAC_ELEMENTS: Record<ZodiacSign, Element> = {
  aries: 'fire',
  taurus: 'earth',
  gemini: 'air',
  cancer: 'water',
  leo: 'fire',
  virgo: 'earth',
  libra: 'air',
  scorpio: 'water',
  sagittarius: 'fire',
  capricorn: 'earth',
  aquarius: 'air',
  pisces: 'water',
};

function normalizeDegrees(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

/**
 * Approx Lahiri ayanamsa in degrees.
 *
 * This is a pragmatic, UI-focused implementation intended to be within a small
 * fraction of a degree for modern dates.
 */
export function getLahiriAyanamsaDegrees(date: Date): number {
  // Julian Day (UTC)
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const hour = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;

  // Meeus-style JD
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  const JD = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + B - 1524.5 + hour / 24;

  // Years since J2000.0
  const daysSinceJ2000 = JD - 2451545.0;
  const years = daysSinceJ2000 / 365.2425;

  // Lahiri at J2000 is ~23.85675°, rate ~50.29 arcsec/year.
  const baseDeg = 23.85675;
  const rateDegPerYear = 50.290966 / 3600;
  return baseDeg + rateDegPerYear * years;
}

export function mapLongitudeToZodiac(
  tropicalLongitude: number,
  date: Date,
  zodiacSystem: ZodiacSystem
): {
  longitude: number;
  sign: ZodiacSign;
  signArabic: string;
  element: Element;
  signDegree: number;
  signMinute: number;
} {
  const trop = normalizeDegrees(tropicalLongitude);
  const ayan = zodiacSystem === 'sidereal_lahiri' ? getLahiriAyanamsaDegrees(date) : 0;
  const lon = normalizeDegrees(trop - ayan);

  const signIndex = Math.min(11, Math.floor(lon / 30));
  const sign = ZODIAC_SIGNS[signIndex];
  const signDegFloat = lon % 30;
  const signDegree = Math.floor(signDegFloat);
  const signMinute = Math.floor((signDegFloat % 1) * 60);

  return {
    longitude: lon,
    sign,
    signArabic: ZODIAC_SIGNS_ARABIC[sign],
    element: ZODIAC_ELEMENTS[sign],
    signDegree,
    signMinute,
  };
}

export function applyZodiacSystemToTransit(
  transit: PlanetTransit,
  date: Date,
  zodiacSystem: ZodiacSystem
): PlanetTransit {
  if (zodiacSystem === 'tropical') return transit;
  if (typeof transit.longitude !== 'number') return transit;

  const mapped = mapLongitudeToZodiac(transit.longitude, date, zodiacSystem);
  return {
    ...transit,
    sign: mapped.sign,
    signArabic: mapped.signArabic,
    element: mapped.element,
    signDegree: mapped.signDegree,
    signMinute: mapped.signMinute,
    // Keep `longitude` as the *system-adjusted* longitude for display.
    longitude: mapped.longitude,
  };
}
