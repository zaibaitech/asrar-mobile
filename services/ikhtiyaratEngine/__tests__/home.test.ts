/**
 * Ported from asrar.app's src/lib/ikhtiyarat/elections/home.test.ts
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
import { homeElectionConfig } from '../elections/home';
import { ElectionInput } from '../types';

const EDINBURGH = { lat: 55.95, lon: -3.19, tz: 'Europe/London' };

describe('homeElectionConfig (config-driven-engine proof)', () => {
  it('runs through evaluateElection with no engine.ts changes', () => {
    const result = evaluateElection(
      { datetime: new Date('2026-07-13T12:00:00Z'), lat: EDINBURGH.lat, lon: EDINBURGH.lon, tz: EDINBURGH.tz, electionType: 'home' },
      homeElectionConfig,
    );

    expect(result.electionType).toBe('home');
    expect(result.rules).toHaveLength(11);
    expect(result.rules.map(r => r.id)).toEqual([
      'home-moon-void-of-course',
      'home-moon-combust',
      'home-moon-malefic-hard-aspect',
      'home-moon-modality',
      'home-moon-waxing',
      'home-moon-applying-to-benefic',
      'home-saturn-dignified',
      'home-saturn-free-of-affliction',
      'home-saturn-retrograde',
      'home-planetary-hour',
      'home-day-of-week',
    ]);
    expect(typeof result.score).toBe('number');
    expect(result.tierInfo).toBeDefined();
  });

  it('hard-fails when the Moon is void of course, combust, or applying a hard aspect to Mars, and never checks Saturn for that hard aspect (Saturn is this matter\'s own significator)', () => {
    const result = evaluateElection(
      { datetime: new Date('2026-07-13T12:00:00Z'), lat: EDINBURGH.lat, lon: EDINBURGH.lon, tz: EDINBURGH.tz, electionType: 'home' },
      homeElectionConfig,
    );
    const hardFailIds = ['home-moon-void-of-course', 'home-moon-combust', 'home-moon-malefic-hard-aspect'];
    for (const rule of result.bestWindow.rules) {
      if (hardFailIds.includes(rule.id)) {
        expect(['pass', 'hardfail']).toContain(rule.status);
      }
    }
    if (result.hasHardFail) {
      expect(result.tier).toBe('avoid');
    }
    const hardAspectRule = result.bestWindow.rules.find(r => r.id === 'home-moon-malefic-hard-aspect')!;
    expect(hardAspectRule.label_en).not.toContain('Saturn');
    expect(hardAspectRule.detail_en).not.toContain('Saturn');
  });

  it('scores Moon modality: fixed signs bonus (+12), movable signs penalty (-8), mutable neutral', () => {
    const result = evaluateElection(
      { datetime: new Date('2026-07-13T12:00:00Z'), lat: EDINBURGH.lat, lon: EDINBURGH.lon, tz: EDINBURGH.tz, electionType: 'home' },
      homeElectionConfig,
    );
    const modalityRule = result.bestWindow.rules.find(r => r.id === 'home-moon-modality')!;
    expect([12, -8, 0]).toContain(modalityRule.points);
  });
});

describe('regression — 17 September 2026, 15:00 BST Edinburgh (home)', () => {
  const input: ElectionInput = {
    datetime: new Date('2026-09-17T15:00:00+01:00'),
    lat: EDINBURGH.lat, lon: EDINBURGH.lon, tz: EDINBURGH.tz,
    electionType: 'home',
  };

  it('produces a stable score and tier for this fixed date/time/location', () => {
    const resultA = evaluateElection(input, homeElectionConfig);
    const resultB = evaluateElection(input, homeElectionConfig);
    expect(resultA.score).toBe(resultB.score);
    expect(resultA.tier).toBe(resultB.tier);
    expect(resultA.bestWindow.rules).toEqual(resultB.bestWindow.rules);
  });

  it('normalizes consistently with scoreToTier and a positive maxAchievable', () => {
    const result = evaluateElection(input, homeElectionConfig);
    expect(homeElectionConfig.maxAchievable()).toBeGreaterThan(0);
    expect(result.tier).toBe(homeElectionConfig.scoreToTier(result.score, result.hasHardFail).tier);
  });
});
