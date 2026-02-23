import type { Planet } from '@/services/PlanetaryHoursService';

export type PlanetaryHourPlanetKey =
  | 'sun'
  | 'moon'
  | 'mercury'
  | 'venus'
  | 'mars'
  | 'jupiter'
  | 'saturn';

export function planetToWordingKey(planet: Planet): PlanetaryHourPlanetKey {
  switch (planet) {
    case 'Sun':
      return 'sun';
    case 'Moon':
      return 'moon';
    case 'Mercury':
      return 'mercury';
    case 'Venus':
      return 'venus';
    case 'Mars':
      return 'mars';
    case 'Jupiter':
      return 'jupiter';
    case 'Saturn':
      return 'saturn';
  }
}

const WORDING_COUNTS: Record<PlanetaryHourPlanetKey, { bestFor: number; avoid: number }> = {
  sun: { bestFor: 4, avoid: 3 },
  moon: { bestFor: 3, avoid: 2 },
  mercury: { bestFor: 4, avoid: 3 },
  venus: { bestFor: 4, avoid: 3 },
  mars: { bestFor: 3, avoid: 3 },
  jupiter: { bestFor: 4, avoid: 2 },
  saturn: { bestFor: 4, avoid: 3 },
};

export function getPlanetaryHourWordingKeys(planet: Planet) {
  const key = planetToWordingKey(planet);
  const counts = WORDING_COUNTS[key];
  return {
    planetKey: key,
    statusKey: `planetaryHours.wording.${key}.status`,
    meaningKey: `planetaryHours.wording.${key}.meaning`,
    noteKey: `planetaryHours.wording.${key}.note`,
    bestForKeys: Array.from({ length: counts.bestFor }, (_, i) => `planetaryHours.wording.${key}.bestFor.${i}`),
    avoidKeys: Array.from({ length: counts.avoid }, (_, i) => `planetaryHours.wording.${key}.avoid.${i}`),
  } as const;
}
