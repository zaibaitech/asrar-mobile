/**
 * Day Blessing Service - Authentic Maghribi Ilm al-Nujum System
 * 
 * Based on traditional Islamic planetary hour calculations (Sā'āt al-Kawākib)
 * following the Maghribi methodology used in classical texts.
 * 
 * SOURCES:
 * - Shams al-Ma'ārif by al-Būnī (classical Maghribi tradition)
 * - Picatrix (Ghāyat al-Ḥakīm) - Andalusian-Maghribi text
 * - Traditional Maghribi astrological calculations
 * 
 * SYSTEM: Maghribi (Western Islamic tradition)
 * Each day is ruled by a classical planet following Chaldean order
 */

import { ElementType } from '../contexts/ThemeContext';

export type Planet = 'Sun' | 'Moon' | 'Mars' | 'Mercury' | 'Jupiter' | 'Venus' | 'Saturn';

/**
 * Planetary rulers of weekdays (Chaldean order)
 * This is the authentic traditional system used in Islamic manuscripts
 */
const WEEKDAY_PLANETS: Planet[] = [
  'Sun',      // Sunday (Yawm al-Aḥad) - الأحد
  'Moon',     // Monday (Yawm al-Ithnayn) - الإثنين
  'Mars',     // Tuesday (Yawm al-Thulāthā') - الثلاثاء
  'Mercury',  // Wednesday (Yawm al-Arbiʿā') - الأربعاء
  'Jupiter',  // Thursday (Yawm al-Khamīs) - الخميس
  'Venus',    // Friday (Yawm al-Jumuʿa) - الجمعة
  'Saturn'    // Saturday (Yawm al-Sabt) - السبت
];

/**
 * Planetary data according to Maghribi tradition
 */
interface PlanetaryData {
  planet: Planet;
  arabic: string;
  arabicDay: string;
  element: ElementType;
  nature: string;        // Hot/Cold, Dry/Moist
  quality: string;       // Spiritual quality
  spiritualPower: string;
  favorableFor: string[];
  avoid: string[];
  metal: string;
  gem: string;
  color: string;
  angel: string;         // Traditional angel associated with the planet
  dhikr: string;         // Recommended dhikr
  dhikrArabic: string;
}

/**
 * Complete planetary data based on authentic Maghribi sources
 */
const PLANETARY_DATA: Record<Planet, PlanetaryData> = {
  Sun: {
    planet: 'Sun',
    arabic: 'الشمس',
    arabicDay: 'الأحد',
    element: 'fire',
    nature: 'Hot & Dry',
    quality: 'Divine Light',
    spiritualPower: 'Leadership, authority, spiritual illumination, success',
    favorableFor: [
      'Seeking authority',
      'Starting important ventures',
      'Public speaking',
      'Spiritual advancement',
      'Gaining favor from leaders'
    ],
    avoid: ['Arrogance', 'Confrontations with authority'],
    metal: 'Gold',
    gem: 'Ruby',
    color: 'Golden Yellow',
    angel: 'Mikhā\'īl (Michael)',
    dhikr: 'Allāhu Nūr (Allah is Light)',
    dhikrArabic: 'اللَّهُ نُور'
  },
  Moon: {
    planet: 'Moon',
    arabic: 'القمر',
    arabicDay: 'الإثنين',
    element: 'water',
    nature: 'Cold & Moist',
    quality: 'Intuition & Receptivity',
    spiritualPower: 'Emotional depth, intuition, spiritual receptivity, dreams',
    favorableFor: [
      'Family matters',
      'Emotional healing',
      'Dream interpretation',
      'Connecting with the feminine',
      'Water-related activities'
    ],
    avoid: ['Major decisions (emotions cloud judgment)', 'Legal contracts'],
    metal: 'Silver',
    gem: 'Pearl',
    color: 'Silver White',
    angel: 'Jibrā\'īl (Gabriel)',
    dhikr: 'Yā Laṭīf (O Subtle One)',
    dhikrArabic: 'يَا لَطِيف'
  },
  Mars: {
    planet: 'Mars',
    arabic: 'المِرِّيخ',
    arabicDay: 'الثلاثاء',
    element: 'fire',
    nature: 'Hot & Dry',
    quality: 'Courage & Action',
    spiritualPower: 'Courage, determination, spiritual warfare against nafs',
    favorableFor: [
      'Physical training',
      'Overcoming obstacles',
      'Spiritual struggle (jihad an-nafs)',
      'Surgery or medical procedures',
      'Competition'
    ],
    avoid: ['Anger', 'Rash decisions', 'Starting conflicts'],
    metal: 'Iron',
    gem: 'Bloodstone',
    color: 'Red',
    angel: 'Samā\'īl',
    dhikr: 'Yā Qawiyy (O Most Strong)',
    dhikrArabic: 'يَا قَوِيّ'
  },
  Mercury: {
    planet: 'Mercury',
    arabic: 'عُطَارِد',
    arabicDay: 'الأربعاء',
    element: 'air',
    nature: 'Cold & Dry',
    quality: 'Knowledge & Communication',
    spiritualPower: 'Intellectual clarity, communication, seeking knowledge',
    favorableFor: [
      'Study and learning',
      'Writing and teaching',
      'Business negotiations',
      'Travel for knowledge',
      'Scientific pursuits'
    ],
    avoid: ['Gossip', 'Deception', 'Shallow communication'],
    metal: 'Quicksilver (Mercury)',
    gem: 'Agate',
    color: 'Mixed/Multicolored',
    angel: 'Rapha\'īl',
    dhikr: 'Yā ʿAlīm (O All-Knowing)',
    dhikrArabic: 'يَا عَلِيم'
  },
  Jupiter: {
    planet: 'Jupiter',
    arabic: 'المُشْتَرِي',
    arabicDay: 'الخميس',
    element: 'air',
    nature: 'Hot & Moist',
    quality: 'Expansion & Wisdom',
    spiritualPower: 'Spiritual growth, abundance, wisdom, generosity',
    favorableFor: [
      'Religious ceremonies',
      'Seeking blessings',
      'Legal matters',
      'Long-term planning',
      'Charity and generosity'
    ],
    avoid: ['Excess', 'Overconfidence', 'Wastefulness'],
    metal: 'Tin',
    gem: 'Sapphire',
    color: 'Blue',
    angel: 'Ṣadqā\'īl',
    dhikr: 'Yā Karīm (O Most Generous)',
    dhikrArabic: 'يَا كَرِيم'
  },
  Venus: {
    planet: 'Venus',
    arabic: 'الزُّهَرَة',
    arabicDay: 'الجمعة',
    element: 'earth',
    nature: 'Cold & Moist',
    quality: 'Beauty & Harmony',
    spiritualPower: 'Love, harmony, beauty, peace-making, relationships',
    favorableFor: [
      'Marriage and relationships',
      'Social gatherings',
      'Artistic pursuits',
      'Beautification',
      'Reconciliation'
    ],
    avoid: ['Lust', 'Vanity', 'Superficiality'],
    metal: 'Copper',
    gem: 'Emerald',
    color: 'Green',
    angel: 'Anā\'īl (Haniel)',
    dhikr: 'Yā Jamīl (O Beautiful One)',
    dhikrArabic: 'يَا جَمِيل'
  },
  Saturn: {
    planet: 'Saturn',
    arabic: 'زُحَل',
    arabicDay: 'السبت',
    element: 'earth',
    nature: 'Cold & Dry',
    quality: 'Structure & Discipline',
    spiritualPower: 'Patience, discipline, endurance, karmic lessons',
    favorableFor: [
      'Long-term commitments',
      'Building foundations',
      'Discipline and structure',
      'Dealing with elders',
      'Property matters'
    ],
    avoid: ['Impatience', 'Seeking quick results', 'Frivolous activities'],
    metal: 'Lead',
    gem: 'Onyx',
    color: 'Black/Dark Blue',
    angel: 'Kasyā\'īl (Cassiel)',
    dhikr: 'Yā Ṣabūr (O Most Patient)',
    dhikrArabic: 'يَا صَبُور'
  }
};

export interface DayBlessing {
  planet: Planet;
  planetArabic: string;
  dayName: string;
  dayNameArabic: string;
  element: ElementType;
  nature: string;
  quality: string;
  spiritualPower: string;
  favorableActivities: string[];
  avoid: string[];
  metal: string;
  gem: string;
  color: string;
  angel: string;
  recommendedDhikr: string;
  dhikrArabic: string;
  emoji: string;
}

/**
 * Planet emojis for visual representation
 */
const PLANET_EMOJIS: Record<Planet, string> = {
  Sun: '☀️',
  Moon: '🌙',
  Mars: '♂️',
  Mercury: '☿️',
  Jupiter: '♃',
  Venus: '♀️',
  Saturn: '♄'
};

/**
 * Get today's blessing based on current weekday
 * Uses authentic Maghribi planetary ruler system
 */
export function getTodayBlessing(date: Date = new Date()): DayBlessing {
  // Get day of week (0 = Sunday, 6 = Saturday)
  const dayOfWeek = date.getDay();
  
  // Get ruling planet for this day
  const planet = WEEKDAY_PLANETS[dayOfWeek];
  const planetData = PLANETARY_DATA[planet];
  
  // Get weekday name
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayName = dayNames[dayOfWeek];
  
  return {
    planet: planetData.planet,
    planetArabic: planetData.arabic,
    dayName,
    dayNameArabic: planetData.arabicDay,
    element: planetData.element,
    nature: planetData.nature,
    quality: planetData.quality,
    spiritualPower: planetData.spiritualPower,
    favorableActivities: planetData.favorableFor,
    avoid: planetData.avoid,
    metal: planetData.metal,
    gem: planetData.gem,
    color: planetData.color,
    angel: planetData.angel,
    recommendedDhikr: planetData.dhikr,
    dhikrArabic: planetData.dhikrArabic,
    emoji: PLANET_EMOJIS[planet]
  };
}

/**
 * Get planetary hour for current time
 * This is a simplified implementation - full implementation would require
 * sunrise/sunset times for accurate planetary hour calculations
 * 
 * Traditional Method:
 * - Divide daylight into 12 equal hours
 * - Divide night into 12 equal hours
 * - First hour of day ruled by day's planet
 * - Hours follow Chaldean order: Saturn, Jupiter, Mars, Sun, Venus, Mercury, Moon
 */
export function getCurrentPlanetaryHour(date: Date = new Date()): {
  planet: Planet;
  planetArabic: string;
  hourOfDay: number;
  isDayHour: boolean;
} {
  const hour = date.getHours();
  const isDayHour = hour >= 6 && hour < 18; // Simplified: day from 6 AM to 6 PM
  
  // Get day's ruling planet
  const dayOfWeek = date.getDay();
  const dayPlanet = WEEKDAY_PLANETS[dayOfWeek];
  
  // Chaldean order for hours
  const chaldeanOrder: Planet[] = ['Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon'];
  
  // Find starting index
  const startIndex = chaldeanOrder.indexOf(dayPlanet);
  
  // Calculate hours since start of day/night
  const hoursSinceStart = isDayHour ? hour - 6 : hour + 6;
  
  // Get current planetary hour (simplified)
  const planetIndex = (startIndex + hoursSinceStart) % 7;
  const currentPlanet = chaldeanOrder[planetIndex];
  
  return {
    planet: currentPlanet,
    planetArabic: PLANETARY_DATA[currentPlanet].arabic,
    hourOfDay: hour,
    isDayHour
  };
}

/**
 * Get element for a specific planet
 */
export function getPlanetElement(planet: Planet): ElementType {
  return PLANETARY_DATA[planet].element;
}

/**
 * Get full planetary data for any planet
 */
export function getPlanetaryData(planet: Planet): PlanetaryData {
  return PLANETARY_DATA[planet];
}
