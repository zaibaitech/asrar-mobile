/**
 * Ported from asrar.app's src/lib/ikhtiyarat/engine.test.ts (Vitest -> Jest).
 * `vi.spyOn` -> `jest.spyOn`. The source gates its dev-only sanity warning
 * on `process.env.NODE_ENV !== 'production'`; this port's engine.ts gates
 * on React Native's `__DEV__` global instead (see engine.ts's
 * evaluateDateRange) — jest.setup.js sets `global.__DEV__ = false`, so the
 * scan-sanity-warning tests below are adapted to temporarily flip that
 * global rather than NODE_ENV.
 *
 * services/PlanetaryHoursService.ts (imported transitively via
 * planetaryHourOfDay.ts) pulls in NetInfo/AsyncStorage through
 * PrayerTimesCacheService — mocked at the module boundary here with a
 * faithful reimplementation of the one function this engine actually
 * uses (getDayRuler, verified against the same Chaldean day-ruler table
 * in PlanetaryHoursService.ts).
 */

jest.mock('@/services/PlanetaryHoursService', () => {
  const DAY_RULERS: Record<number, string> = {
    0: 'Sun', 1: 'Moon', 2: 'Mars', 3: 'Mercury', 4: 'Jupiter', 5: 'Venus', 6: 'Saturn',
  };
  return {
    getDayRuler: (date: Date) => DAY_RULERS[date.getDay()],
  };
});

import { evaluateElection, evaluateDateRange, findNearestBetterDates, computeMaxAchievable } from '../engine';
import { marriageElectionConfig } from '../elections/marriage';
import { ElectionInput, ElectionRulesConfig } from '../types';

const EDINBURGH = { lat: 55.95, lon: -3.19, tz: 'Europe/London' };

function inputFor(dateStr: string): ElectionInput {
  return { datetime: new Date(dateStr), lat: EDINBURGH.lat, lon: EDINBURGH.lon, tz: EDINBURGH.tz, electionType: 'marriage' };
}

describe('marriage election — 2026-07-13 Edinburgh (dark moon + combustion + Saturn square)', () => {
  const result = evaluateElection(inputFor('2026-07-13T12:00:00+01:00'), marriageElectionConfig);

  it('is a hard fail with tier Avoid', () => {
    expect(result.hasHardFail).toBe(true);
    expect(result.tier).toBe('avoid');
  });

  it('flags dark-moon and combustion hard fails across the day', () => {
    const allRuleIds = result.allWindows.flatMap(w => w.rules.filter(r => r.status === 'hardfail').map(r => r.id));
    expect(allRuleIds).toContain('dark-moon');
    expect(allRuleIds).toContain('moon-combust');
  });

  it('flags the applying Saturn square hard fail late in the day', () => {
    const lateWindow = result.allWindows.find(w =>
      w.rules.some(r => r.id === 'moon-malefic-hard-aspect' && r.status === 'hardfail'),
    );
    expect(lateWindow).toBeDefined();
  });
});

describe('marriage election — 2026-07-20 Edinburgh (via combusta + Saturn opposition)', () => {
  const result = evaluateElection(inputFor('2026-07-20T12:00:00+01:00'), marriageElectionConfig);

  it('is tier Avoid (score below 20, even on its cleanest window)', () => {
    expect(result.tier).toBe('avoid');
  });

  it('flags via combusta as a penalty and Saturn opposition as a hard fail somewhere in the day', () => {
    const viaCombustaWindow = result.allWindows.find(w => w.rules.some(r => r.id === 'via-combusta' && r.status === 'penalty'));
    expect(viaCombustaWindow).toBeDefined();
    const oppositionWindow = result.allWindows.find(w => w.rules.some(r => r.id === 'moon-malefic-hard-aspect' && r.status === 'hardfail'));
    expect(oppositionWindow).toBeDefined();
  });
});

describe('marriage election — 2026-07-16 to 07-18 Edinburgh (waxing, clearing the beams)', () => {
  it('is not a hard fail, unlike 2026-07-13 which is dark-moon all day', () => {
    const badDate = evaluateElection(inputFor('2026-07-13T12:00:00+01:00'), marriageElectionConfig);
    expect(badDate.hasHardFail).toBe(true);
    expect(badDate.tier).toBe('avoid');

    for (const dateStr of ['2026-07-17T09:00:00+01:00', '2026-07-18T09:00:00+01:00']) {
      const result = evaluateElection(inputFor(dateStr), marriageElectionConfig);
      expect(result.hasHardFail).toBe(false);
    }
  });

  it('scores higher than 2026-07-13’s worst (post-combustion) window', () => {
    const badDate = evaluateElection(inputFor('2026-07-13T21:00:00+01:00'), marriageElectionConfig);
    const worstWindowOn13th = badDate.allWindows[badDate.allWindows.length - 1];
    const goodDate = evaluateElection(inputFor('2026-07-17T09:00:00+01:00'), marriageElectionConfig);
    expect(goodDate.score).toBeGreaterThan(worstWindowOn13th.score);
  });
});

describe('property tests', () => {
  it('is deterministic for the same input', () => {
    const a = evaluateElection(inputFor('2026-07-17T12:00:00+01:00'), marriageElectionConfig);
    const b = evaluateElection(inputFor('2026-07-17T12:00:00+01:00'), marriageElectionConfig);
    expect(a.score).toBe(b.score);
    expect(a.tier).toBe(b.tier);
    expect(a.rules).toEqual(b.rules);
  });

  it('forces tier Avoid whenever any hard fail is present', () => {
    for (const dateStr of ['2026-07-13T12:00:00+01:00', '2026-07-20T12:00:00+01:00']) {
      const result = evaluateElection(inputFor(dateStr), marriageElectionConfig);
      if (result.hasHardFail) {
        expect(result.tier).toBe('avoid');
      }
    }
  });

  it('maps tier boundaries correctly at 20/40/60/80 with no hard fail', () => {
    expect(marriageElectionConfig.scoreToTier(19, false).tier).toBe('avoid');
    expect(marriageElectionConfig.scoreToTier(20, false).tier).toBe('weak');
    expect(marriageElectionConfig.scoreToTier(39, false).tier).toBe('weak');
    expect(marriageElectionConfig.scoreToTier(40, false).tier).toBe('acceptable');
    expect(marriageElectionConfig.scoreToTier(59, false).tier).toBe('acceptable');
    expect(marriageElectionConfig.scoreToTier(60, false).tier).toBe('good');
    expect(marriageElectionConfig.scoreToTier(79, false).tier).toBe('good');
    expect(marriageElectionConfig.scoreToTier(80, false).tier).toBe('excellent');
    expect(marriageElectionConfig.scoreToTier(100, true).tier).toBe('avoid');
  });
});

describe('day-boundary correctness across timezones', () => {
  it('reports a date and windows that fall on the requested local calendar day (Los Angeles, UTC-7)', () => {
    const input: ElectionInput = {
      datetime: new Date('2026-07-13T14:00:00-07:00'),
      lat: 34.05, lon: -118.24, tz: 'America/Los_Angeles',
      electionType: 'marriage',
    };
    const result = evaluateElection(input, marriageElectionConfig);

    const dateLocalDay = result.date.toLocaleDateString('en-US', { timeZone: 'America/Los_Angeles' });
    expect(dateLocalDay).toBe('7/13/2026');

    for (const window of result.allWindows) {
      const windowLocalDay = window.time.toLocaleDateString('en-US', { timeZone: 'America/Los_Angeles' });
      expect(windowLocalDay).toBe('7/13/2026');
    }
  });

  it('reports a date and windows that fall on the requested local calendar day (Sydney, UTC+10)', () => {
    const input: ElectionInput = {
      datetime: new Date('2026-07-13T14:00:00+10:00'),
      lat: -33.87, lon: 151.21, tz: 'Australia/Sydney',
      electionType: 'marriage',
    };
    const result = evaluateElection(input, marriageElectionConfig);

    const dateLocalDay = result.date.toLocaleDateString('en-US', { timeZone: 'Australia/Sydney' });
    expect(dateLocalDay).toBe('7/13/2026');

    for (const window of result.allWindows) {
      const windowLocalDay = window.time.toLocaleDateString('en-US', { timeZone: 'Australia/Sydney' });
      expect(windowLocalDay).toBe('7/13/2026');
    }
  });

  it('reports a date that falls on the requested local calendar day for a half-hour offset (India, UTC+5:30)', () => {
    const input: ElectionInput = {
      datetime: new Date('2026-03-01T10:00:00+05:30'),
      lat: 28.61, lon: 77.21, tz: 'Asia/Kolkata',
      electionType: 'marriage',
    };
    const result = evaluateElection(input, marriageElectionConfig);
    const dateLocalDay = result.date.toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata' });
    expect(dateLocalDay).toBe('3/1/2026');
  });
});

describe('civil-hours constraint on best-window selection', () => {
  const midnightPreferringTier = { tier: 'excellent' as const, labelEn: 'Excellent', labelFr: 'Excellent', labelAr: 'ممتاز', color: '#000' };
  function makeMidnightPreferringConfig(civilHoursRange?: { startHour: number; endHour: number }): ElectionRulesConfig {
    return {
      electionType: 'marriage',
      rules: [
        {
          id: 'closeness-to-midnight',
          label: { en: '', fr: '', ar: '' },
          evaluate(ctx) {
            const localHour = ctx.datetime.getUTCHours();
            const distanceFromMidnight = Math.min(localHour, 24 - localHour);
            return {
              id: 'closeness-to-midnight', label_en: '', label_fr: '', label_ar: '',
              status: 'bonus', points: 24 - distanceFromMidnight,
              detail_en: '', detail_fr: '', detail_ar: '',
            };
          },
        },
      ],
      tiers: [midnightPreferringTier],
      scoreToTier: () => midnightPreferringTier,
      civilHoursRange,
      maxAchievable: () => 24,
    };
  }

  const utcInput: ElectionInput = {
    datetime: new Date('2026-07-13T12:00:00Z'),
    lat: 51.5, lon: 0, tz: 'UTC',
    electionType: 'marriage',
  };

  it('with a full-day (0-24) civil-hours range, the best window is midnight (00:00) for this synthetic config', () => {
    const result = evaluateElection(utcInput, makeMidnightPreferringConfig({ startHour: 0, endHour: 24 }));
    expect(result.bestWindow.time.getUTCHours()).toBe(0);
  });

  it('a config with no civilHoursRange falls back to the engine default (8-22), excluding midnight', () => {
    const result = evaluateElection(utcInput, makeMidnightPreferringConfig(undefined));
    const hour = result.bestWindow.time.getUTCHours();
    expect(hour).toBeGreaterThanOrEqual(8);
    expect(hour).toBeLessThan(22);
  });

  it('with an explicit civil-hours range of 8-22, the best window is constrained to that range', () => {
    const result = evaluateElection(utcInput, makeMidnightPreferringConfig({ startHour: 8, endHour: 22 }));
    const hour = result.bestWindow.time.getUTCHours();
    expect(hour).toBeGreaterThanOrEqual(8);
    expect(hour).toBeLessThan(22);
    expect(hour).toBe(21);
  });

  it('marriageElectionConfig defaults to the 8-22 civil-hours range', () => {
    expect(marriageElectionConfig.civilHoursRange).toEqual({ startHour: 8, endHour: 22 });
  });

  it('isLeastAfflicted is true only when the chosen window still hard-fails', () => {
    const clean = evaluateElection(inputFor('2026-07-17T09:00:00+01:00'), marriageElectionConfig);
    expect(clean.isLeastAfflicted).toBe(clean.hasHardFail);

    const badDate = evaluateElection(inputFor('2026-07-13T12:00:00+01:00'), marriageElectionConfig);
    expect(badDate.hasHardFail).toBe(true);
    expect(badDate.isLeastAfflicted).toBe(true);
  });
});

describe('findNearestBetterDates', () => {
  const TEST_RADIUS_DAYS = 8;
  const SCAN_TEST_TIMEOUT = 20000;

  it('only returns dates reaching at least the acceptable tier, never merely "higher score than baseline"', () => {
    const input = inputFor('2026-07-13T12:00:00+01:00');
    const { dates } = findNearestBetterDates(input, marriageElectionConfig, 3, TEST_RADIUS_DAYS);
    for (const d of dates) {
      expect(d.hasHardFail).toBe(false);
      expect(['excellent', 'good', 'acceptable']).toContain(d.tier);
    }
  }, SCAN_TEST_TIMEOUT);

  it('sorts results by date-distance from the input date', () => {
    const input = inputFor('2026-07-13T12:00:00+01:00');
    const { dates } = findNearestBetterDates(input, marriageElectionConfig, 3, TEST_RADIUS_DAYS);
    for (let i = 1; i < dates.length; i++) {
      const prevDistance = Math.abs(dates[i - 1].date.getTime() - input.datetime.getTime());
      const currDistance = Math.abs(dates[i].date.getTime() - input.datetime.getTime());
      expect(currDistance).toBeGreaterThanOrEqual(prevDistance);
    }
  }, SCAN_TEST_TIMEOUT);

  it('reports radiusExhausted and provides bestAvailable when no acceptable date exists within a tiny radius', () => {
    const input = inputFor('2026-07-13T12:00:00+01:00');
    const { dates, radiusExhausted, bestAvailable } = findNearestBetterDates(input, marriageElectionConfig, 3, 0);
    expect(dates).toHaveLength(0);
    expect(radiusExhausted).toBe(true);
    expect(bestAvailable).toBeNull();
  });

  it('bestAvailable is populated (not null) when the scan runs but nothing reaches acceptable', () => {
    const input = inputFor('2026-07-13T12:00:00+01:00');
    const { dates, bestAvailable } = findNearestBetterDates(input, marriageElectionConfig, 3, 1);
    if (dates.length === 0) {
      expect(bestAvailable).not.toBeNull();
    }
  });

  it('is deterministic for the same input', () => {
    const input = inputFor('2026-07-13T12:00:00+01:00');
    const a = findNearestBetterDates(input, marriageElectionConfig, 3, TEST_RADIUS_DAYS);
    const b = findNearestBetterDates(input, marriageElectionConfig, 3, TEST_RADIUS_DAYS);
    expect(a.dates.map(d => d.date.toISOString())).toEqual(b.dates.map(d => d.date.toISOString()));
    expect(a.radiusExhausted).toBe(b.radiusExhausted);
  }, SCAN_TEST_TIMEOUT);
});

describe('scan-sanity self-detecting calibration warning', () => {
  const uncappableTier = { tier: 'weak' as const, labelEn: 'Weak', labelFr: 'Faible', labelAr: 'ضعيف', color: '#000' };
  const alwaysBonusRule = {
    id: 'always-bonus',
    label: { en: '', fr: '', ar: '' },
    maxPoints: 10,
    evaluate: () => ({ id: 'always-bonus', label_en: '', label_fr: '', label_ar: '', status: 'bonus' as const, points: 10, detail_en: '', detail_fr: '', detail_ar: '' }),
  };
  const uncappableConfig: ElectionRulesConfig = {
    electionType: 'travel',
    rules: [alwaysBonusRule],
    tiers: [uncappableTier],
    scoreToTier: () => uncappableTier,
    maxAchievable: () => computeMaxAchievable([alwaysBonusRule]),
  };

  const originalDev = (global as any).__DEV__;
  beforeEach(() => {
    (global as any).__DEV__ = true;
  });
  afterEach(() => {
    (global as any).__DEV__ = originalDev;
  });

  it('warns in dev when a 90+ day scan finds no day reaching acceptable or better', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const start = new Date('2026-01-01T12:00:00Z');
    const end = new Date('2026-04-15T12:00:00Z');
    evaluateDateRange(start, end, EDINBURGH.lat, EDINBURGH.lon, EDINBURGH.tz, 'travel', uncappableConfig);
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0]).toContain('no day in a');
    warnSpy.mockRestore();
  });

  it('does not warn for a well-calibrated config (marriage) over the same range', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const start = new Date('2026-01-01T12:00:00Z');
    const end = new Date('2026-04-15T12:00:00Z');
    evaluateDateRange(start, end, EDINBURGH.lat, EDINBURGH.lon, EDINBURGH.tz, 'marriage', marriageElectionConfig);
    expect(warnSpy).not.toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it('does not warn for scans shorter than the 90-day sanity threshold, even if uncalibrated', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const start = new Date('2026-01-01T12:00:00Z');
    const end = new Date('2026-01-10T12:00:00Z');
    evaluateDateRange(start, end, EDINBURGH.lat, EDINBURGH.lon, EDINBURGH.tz, 'travel', uncappableConfig);
    expect(warnSpy).not.toHaveBeenCalled();
    warnSpy.mockRestore();
  });
});
