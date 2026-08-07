/**
 * Ikhtiyārāt (Best Dates) Engine
 * ================================
 * Ported from asrar.app's src/lib/ikhtiyarat — real classical electional
 * astrology (marriage/nikāḥ, travel/safar, business, medical, home,
 * education), computed entirely on-device via astronomy-engine (no
 * backend, no API). See ephemeris.ts's header for why this is separate
 * from services/EphemerisService.ts.
 *
 * @module ikhtiyaratEngine
 */

export { evaluateElection, evaluateDateRange, findNearestBetterDates, computeMaxAchievable } from './engine';
export type { NearestBetterDatesResult } from './engine';

export { marriageElectionConfig, marriageElectionConfigStrictHourRuler, ACCEPTABLE_THRESHOLD } from './elections/marriage';
export { travelElectionConfig, travelElectionConfigStrictHourRuler, TRAVEL_ACCEPTABLE_THRESHOLD } from './elections/travel';
export { businessElectionConfig, businessElectionConfigStrictHourRuler, BUSINESS_ACCEPTABLE_THRESHOLD } from './elections/business';
export { medicalElectionConfig, medicalElectionConfigStrictHourRuler, MEDICAL_ACCEPTABLE_THRESHOLD } from './elections/medical';
export { homeElectionConfig, homeElectionConfigStrictHourRuler, HOME_ACCEPTABLE_THRESHOLD } from './elections/home';
export { educationElectionConfig, educationElectionConfigStrictHourRuler, EDUCATION_ACCEPTABLE_THRESHOLD } from './elections/education';

export { gregorianToHijri, getSunnahBadges, HIJRI_MONTH_NAMES } from './hijri';
export type { HijriDate, SunnahBadge } from './hijri';

export { getUrfBadgeForMonth } from './urf';
export type { UrfBadge } from './urf';

export { getTravelBadges } from './travelBadges';
export type { TravelBadge } from './travelBadges';

export { getMedicalBadges } from './medicalBadges';
export type { MedicalBadge } from './medicalBadges';

export { ZODIAC_MAN_BODY_PART } from './zodiacMan';

export { findDayDegradation, getDayDegradationNote } from './degradation';
export type { DegradationNote } from './degradation';

export { getPlanetPosition, getAllPlanetPositions } from './ephemeris';
export type { PlanetPosition, ZodiacSign } from './ephemeris';

export type {
  ElectionType,
  RuleStatus,
  RuleResult,
  Tier,
  TierInfo,
  ElectionInput,
  WindowScore,
  ElectionResult,
  ElectionRulesConfig,
} from './types';
