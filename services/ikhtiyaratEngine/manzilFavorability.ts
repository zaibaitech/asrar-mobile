/**
 * Lunar mansion (manzil) favorability for Marriage (Nikāḥ).
 * Ported verbatim from asrar.app's src/lib/ikhtiyarat/manzil-favorability.ts.
 *
 * SCHOLAR-REVIEW: the favorable/unfavorable lists below are a first-pass
 * placement based on commonly cited Maghribi/West African ikhtiyārāt
 * sources and should be checked against primary sources before launch.
 * Mansions not listed in either array are treated as neutral (no bonus/penalty).
 */

// SCHOLAR-REVIEW: verify against primary sources before launch.
export const FAVORABLE_MANSIONS_FOR_MARRIAGE: number[] = [1, 3, 7, 10, 13, 19, 23, 26];

// SCHOLAR-REVIEW: verify against primary sources before launch.
export const UNFAVORABLE_MANSIONS_FOR_MARRIAGE: number[] = [6, 9, 15, 18, 21, 28];

export function getMansionMarriageFavorability(mansionNumber: number): 'favorable' | 'unfavorable' | 'neutral' {
  if (FAVORABLE_MANSIONS_FOR_MARRIAGE.includes(mansionNumber)) return 'favorable';
  if (UNFAVORABLE_MANSIONS_FOR_MARRIAGE.includes(mansionNumber)) return 'unfavorable';
  return 'neutral';
}

/** Mansion index (1-28) from ecliptic longitude, 12.857...°-per-mansion convention. */
export function getMansionNumberFromLongitude(longitude: number): number {
  const segment = 360 / 28;
  return (Math.floor(longitude / segment) % 28) + 1;
}
