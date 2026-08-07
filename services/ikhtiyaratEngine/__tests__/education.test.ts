/**
 * Ported from asrar.app's src/lib/ikhtiyarat/elections/education.test.ts
 * (Vitest -> Jest). Same PlanetaryHoursService mock as engine.test.ts.
 */

jest.mock('@/services/PlanetaryHoursService', () => {
  const DAY_RULERS: Record<number, string> = {
    0: 'Sun', 1: 'Moon', 2: 'Mars', 3: 'Mercury', 4: 'Jupiter', 5: 'Venus', 6: 'Saturn',
  };
  return {
    getDayRuler: (date: Date) => DAY_RULERS[date.getDay()],
  };
});

import { evaluateElection } from '../engine';
import { educationElectionConfig } from '../elections/education';
import { ElectionInput } from '../types';

const EDINBURGH = { lat: 55.95, lon: -3.19, tz: 'Europe/London' };

describe('educationElectionConfig (config-driven-engine proof)', () => {
  it('runs through evaluateElection with no engine.ts changes', () => {
    const result = evaluateElection(
      { datetime: new Date('2026-07-13T12:00:00Z'), lat: EDINBURGH.lat, lon: EDINBURGH.lon, tz: EDINBURGH.tz, electionType: 'education' },
      educationElectionConfig,
    );

    expect(result.electionType).toBe('education');
    expect(result.rules).toHaveLength(10);
    expect(result.rules.map(r => r.id)).toEqual([
      'education-mercury-retrograde',
      'education-moon-void-of-course',
      'education-mercury-combust',
      'education-moon-applying-to-jupiter',
      'education-moon-applying-to-mercury',
      'education-moon-malefic-hard-aspect',
      'education-mercury-dignified',
      'education-jupiter-free-of-affliction',
      'education-planetary-hour',
      'education-day-of-week',
    ]);
    expect(typeof result.score).toBe('number');
    expect(result.tierInfo).toBeDefined();
  });

  it('hard-fails when Mercury is retrograde (13 July 2026)', () => {
    const result = evaluateElection(
      { datetime: new Date('2026-07-13T00:00:00+01:00'), lat: EDINBURGH.lat, lon: EDINBURGH.lon, tz: EDINBURGH.tz, electionType: 'education' },
      educationElectionConfig,
    );
    expect(result.hasHardFail).toBe(true);
    expect(result.tier).toBe('avoid');
    const mercuryRule = result.bestWindow.rules.find(r => r.id === 'education-mercury-retrograde');
    expect(mercuryRule?.status).toBe('hardfail');
  });

  it('does not hard-fail Mercury retrograde when Mercury is direct (24 July 2026)', () => {
    const result = evaluateElection(
      { datetime: new Date('2026-07-24T06:00:00+01:00'), lat: EDINBURGH.lat, lon: EDINBURGH.lon, tz: EDINBURGH.tz, electionType: 'education' },
      educationElectionConfig,
    );
    const mercuryRule = result.bestWindow.rules.find(r => r.id === 'education-mercury-retrograde');
    expect(mercuryRule?.status).toBe('pass');
  });
});

describe('regression — 17 September 2026, 15:00 BST Edinburgh (education)', () => {
  const input: ElectionInput = {
    datetime: new Date('2026-09-17T15:00:00+01:00'),
    lat: EDINBURGH.lat, lon: EDINBURGH.lon, tz: EDINBURGH.tz,
    electionType: 'education',
  };

  it('produces a stable score and tier for this fixed date/time/location', () => {
    const resultA = evaluateElection(input, educationElectionConfig);
    const resultB = evaluateElection(input, educationElectionConfig);
    expect(resultA.score).toBe(resultB.score);
    expect(resultA.tier).toBe(resultB.tier);
    expect(resultA.bestWindow.rules).toEqual(resultB.bestWindow.rules);
  });

  it('normalizes consistently with scoreToTier and a positive maxAchievable', () => {
    const result = evaluateElection(input, educationElectionConfig);
    expect(educationElectionConfig.maxAchievable()).toBeGreaterThan(0);
    expect(result.tier).toBe(educationElectionConfig.scoreToTier(result.score, result.hasHardFail).tier);
  });
});
