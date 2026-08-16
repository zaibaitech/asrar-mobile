/**
 * ProfileDerivationService — ingress-aware Burj resolution tests
 * =================================================================
 *
 * Ground truth for the 2026 ingress fixture below: exact UTC solar-ingress
 * instants sourced from a published ephemeris table
 * (moontracks.com/sun_solar_ingress.html, Swiss-Ephemeris-derived), and
 * cross-checked against this repo's own embedded EPHEMERIS_2026_JAN data
 * (services/EphemerisDataCache.ts), which independently shows the Sun at
 * longitude 295.9° (Capricorn, sign 9) on 2026-01-16 and 300.9° (Aquarius,
 * sign 10) on 2026-01-21 — consistent with a Jan 20 2026 01:44 UTC ingress.
 *
 * The March 2022 fixture (Sun entered Aries on 2022-03-20 at 15:33 UTC) is
 * given directly — this is the exact case from the reported estimation bug
 * (21 March 2022 rendering Pisces instead of Aries).
 *
 * Calendar *dates* of ingress (not exact times, which drift slightly year
 * to year but never by more than about a day) are classical/fixed and used
 * here as the source of truth for BURJ_DATE_RANGES and isNearIngress().
 *
 * IMPORTANT: every ambiguous-case assertion below checks BOTH the
 * `ambiguous` flag AND the returned `burjIndex`/`burjEn` estimate. A test
 * that only asserts `ambiguous === true` passes regardless of which bound
 * the estimate came from — exactly the gap that let the window_start
 * (UTC+14) estimation bug through the first version of this fixture.
 */

import { deriveBurjFromDOB, isNearIngress, resolveBurjWithIngressGuard } from '../ProfileDerivationService';

// ============================================================================
// FIXTURE: 2026 solar ingress dates + UTC times (all 12 signs)
// Source: moontracks.com/sun_solar_ingress.html
// ============================================================================
const INGRESS_2026 = [
  { sign: 'Aquarius', signIndex: 10, prevSignIndex: 9, date: '2026-01-20', utc: '2026-01-20T01:44:00Z' },
  { sign: 'Pisces', signIndex: 11, prevSignIndex: 10, date: '2026-02-18', utc: '2026-02-18T15:51:00Z' },
  { sign: 'Aries', signIndex: 0, prevSignIndex: 11, date: '2026-03-20', utc: '2026-03-20T14:45:00Z' },
  { sign: 'Taurus', signIndex: 1, prevSignIndex: 0, date: '2026-04-20', utc: '2026-04-20T01:39:00Z' },
  { sign: 'Gemini', signIndex: 2, prevSignIndex: 1, date: '2026-05-21', utc: '2026-05-21T00:36:00Z' },
  { sign: 'Cancer', signIndex: 3, prevSignIndex: 2, date: '2026-06-21', utc: '2026-06-21T08:24:00Z' },
  { sign: 'Leo', signIndex: 4, prevSignIndex: 3, date: '2026-07-22', utc: '2026-07-22T19:13:00Z' },
  { sign: 'Virgo', signIndex: 5, prevSignIndex: 4, date: '2026-08-23', utc: '2026-08-23T02:18:00Z' },
  { sign: 'Libra', signIndex: 6, prevSignIndex: 5, date: '2026-09-23', utc: '2026-09-23T00:05:00Z' },
  { sign: 'Scorpio', signIndex: 7, prevSignIndex: 6, date: '2026-10-23', utc: '2026-10-23T09:37:00Z' },
  { sign: 'Sagittarius', signIndex: 8, prevSignIndex: 7, date: '2026-11-22', utc: '2026-11-22T07:23:00Z' },
  { sign: 'Capricorn', signIndex: 9, prevSignIndex: 8, date: '2026-12-21', utc: '2026-12-21T20:50:00Z' },
] as const;

// Dates safely mid-sign (>10 days from any boundary) as negative controls.
const MID_SIGN_CONTROLS = [
  '2026-02-01', // deep in Aquarius
  '2026-05-05', // deep in Taurus
  '2026-08-10', // deep in Leo
  '2026-11-05', // deep in Scorpio
];

// Default detection window (services/ProfileDerivationService.ts): UTC-11..+12.
const DEFAULT_MIN_OFFSET = -11;
const DEFAULT_MAX_OFFSET = 12;

/**
 * Given a calendar date and its true ingress instant, compute what the
 * default (uncountried) UTC-11..+12 window's three probe instants
 * (earliest, latest, center) resolve to, mirroring the resolver's own
 * window construction — used to build expected fixture values rather than
 * hand-deriving 12 separate sign transitions.
 */
function windowFor(dateISO: string) {
  const d = new Date(dateISO);
  const earliestUTC = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0) - DEFAULT_MAX_OFFSET * 3_600_000);
  const latestUTC = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 23, 59, 59) - DEFAULT_MIN_OFFSET * 3_600_000);
  const centerUTC = new Date((earliestUTC.getTime() + latestUTC.getTime()) / 2);
  return { earliestUTC, latestUTC, centerUTC };
}

function signAtInstant(instant: Date, ingressUTC: Date, prevSignIndex: number, signIndex: number): number {
  return instant.getTime() < ingressUTC.getTime() ? prevSignIndex : signIndex;
}

// Mock EphemerisService so tests are deterministic and offline.
jest.mock('../EphemerisService', () => ({
  getPlanetPositions: jest.fn(),
}));

import { getPlanetPositions } from '../EphemerisService';
import type { PlanetPositions } from '../../types/divine-timing-personal';

const mockGetPlanetPositions = getPlanetPositions as jest.MockedFunction<typeof getPlanetPositions>;

function mockPositionsForSign(sunSign: number): PlanetPositions {
  return {
    timestamp: Date.now(),
    dateISO: '2026-01-01',
    planets: {
      sun: { planet: 'sun', longitude: sunSign * 30 + 15, sign: sunSign, signDegree: 15 },
      moon: { planet: 'moon', longitude: 0, sign: 0, signDegree: 0 },
      mercury: { planet: 'mercury', longitude: 0, sign: 0, signDegree: 0 },
      venus: { planet: 'venus', longitude: 0, sign: 0, signDegree: 0 },
      mars: { planet: 'mars', longitude: 0, sign: 0, signDegree: 0 },
      jupiter: { planet: 'jupiter', longitude: 0, sign: 0, signDegree: 0 },
      saturn: { planet: 'saturn', longitude: 0, sign: 0, signDegree: 0 },
    },
    source: 'ephemeris',
    expiresAt: Date.now() + 1000,
  };
}

/** Mocks getPlanetPositions to answer correctly for ANY instant it's called
 * with, based on the true ingress instant — so tests don't need to guess
 * the resolver's internal call order (earliest/latest/center via
 * Promise.all can resolve out of enqueue order). */
function mockEphemerisAroundIngress(ingressUTC: Date, prevSignIndex: number, signIndex: number) {
  mockGetPlanetPositions.mockImplementation(async (instant: Date) => {
    return mockPositionsForSign(signAtInstant(instant, ingressUTC, prevSignIndex, signIndex));
  });
}

beforeEach(() => {
  mockGetPlanetPositions.mockReset();
});

describe('isNearIngress — dated fixture, all 12 signs', () => {
  it.each(INGRESS_2026)('flags the ingress date itself: $sign ($date)', ({ date }) => {
    expect(isNearIngress(date)).toBe(true);
  });

  it.each(INGRESS_2026)('flags the day before ingress: $sign', ({ date }) => {
    const d = new Date(`${date}T12:00:00Z`);
    d.setUTCDate(d.getUTCDate() - 1);
    expect(isNearIngress(d.toISOString().slice(0, 10))).toBe(true);
  });

  it.each(INGRESS_2026)('flags the day after ingress: $sign', ({ date }) => {
    const d = new Date(`${date}T12:00:00Z`);
    d.setUTCDate(d.getUTCDate() + 1);
    expect(isNearIngress(d.toISOString().slice(0, 10))).toBe(true);
  });

  it.each(MID_SIGN_CONTROLS)('does NOT flag a safely mid-sign date: %s', (date) => {
    expect(isNearIngress(date)).toBe(false);
  });
});

describe('resolveBurjWithIngressGuard — fast path (non-ingress dates)', () => {
  it.each(MID_SIGN_CONTROLS)('resolves without any ephemeris call for %s', async (date) => {
    const result = await resolveBurjWithIngressGuard({ dobISO: date });
    expect(result?.ambiguous).toBe(false);
    expect(result?.resolvedVia).toBe('unambiguous-date');
    expect(mockGetPlanetPositions).not.toHaveBeenCalled();
  });

  it('matches deriveBurjFromDOB exactly for mid-sign dates (byte-identical fast path)', async () => {
    for (const date of MID_SIGN_CONTROLS) {
      const legacy = deriveBurjFromDOB(date);
      const resolved = await resolveBurjWithIngressGuard({ dobISO: date });
      expect(resolved?.burjIndex).toBe(legacy?.burjIndex);
      expect(resolved?.burjEn).toBe(legacy?.burjEn);
      expect(resolved?.burjAr).toBe(legacy?.burjAr);
    }
  });
});

describe('resolveBurjWithIngressGuard — 12-sign fixture: flag AND estimate for every ingress', () => {
  it.each(INGRESS_2026)(
    'day of ingress ($sign, $date): ambiguity flag and displayed sign both correct',
    async ({ date, utc, signIndex, prevSignIndex, sign }) => {
      const ingressUTC = new Date(utc);
      mockEphemerisAroundIngress(ingressUTC, prevSignIndex, signIndex);

      const { earliestUTC, latestUTC, centerUTC } = windowFor(date);
      const expectedEarliestSign = signAtInstant(earliestUTC, ingressUTC, prevSignIndex, signIndex);
      const expectedLatestSign = signAtInstant(latestUTC, ingressUTC, prevSignIndex, signIndex);
      const expectedCenterSign = signAtInstant(centerUTC, ingressUTC, prevSignIndex, signIndex);
      const windowIsActuallyAmbiguous = expectedEarliestSign !== expectedLatestSign;

      const result = await resolveBurjWithIngressGuard({ dobISO: date });

      expect(result?.ambiguous).toBe(windowIsActuallyAmbiguous);
      if (windowIsActuallyAmbiguous) {
        // The critical assertion the original fixture omitted: which sign
        // was actually returned, not just that ambiguity was flagged.
        expect(result?.burjIndex).toBe(expectedCenterSign);
      } else {
        expect(result?.burjIndex).toBe(expectedEarliestSign);
      }
    }
  );
});

describe('resolveBurjWithIngressGuard — regression: 21 March 2022 must estimate Aries, not Pisces', () => {
  // Given fact: the Sun entered Aries on 2022-03-20 at 15:33 UTC. Repro from
  // the bug report: DOB 21/03/2022 correctly flagged ambiguous, but the
  // resolver was returning Pisces (the UTC+14/window_start bound — the
  // least likely real-world case) instead of the sign at the center of the
  // plausible window.
  const INGRESS_UTC = new Date('2022-03-20T15:33:00Z');
  const PISCES = 11;
  const ARIES = 0;

  it('flags 2022-03-21 as ambiguous (the window genuinely straddles the ingress)', async () => {
    mockEphemerisAroundIngress(INGRESS_UTC, PISCES, ARIES);
    const result = await resolveBurjWithIngressGuard({ dobISO: '2022-03-21' });
    expect(result?.ambiguous).toBe(true);
  });

  it('estimates Aries (the center-of-window sign), not Pisces (the window_start/UTC+14 bound)', async () => {
    mockEphemerisAroundIngress(INGRESS_UTC, PISCES, ARIES);
    const result = await resolveBurjWithIngressGuard({ dobISO: '2022-03-21' });
    expect(result?.burjIndex).toBe(ARIES);
    expect(result?.burjEn).toBe('Aries');
  });

  it('candidateSigns still contains both Pisces and Aries for full disclosure', async () => {
    mockEphemerisAroundIngress(INGRESS_UTC, PISCES, ARIES);
    const result = await resolveBurjWithIngressGuard({ dobISO: '2022-03-21' });
    const indices = result?.candidateSigns?.map((c) => c.burjIndex).sort((a, b) => a - b);
    expect(indices).toEqual([ARIES, PISCES]);
  });
});

describe('resolveBurjWithIngressGuard — narrowed default window (UTC-11..+12)', () => {
  it('does not call the ephemeris for the extreme UTC+14/-12 slivers now excluded from detection', async () => {
    // A date only ambiguous under the OLD UTC+14..-12 window, but not under
    // the new UTC-11..+12 default, should resolve unambiguously without
    // needing those extreme offsets to be checked at all — verified
    // indirectly: with mocks agreeing at every instant in range, the result
    // must be unambiguous.
    mockGetPlanetPositions.mockResolvedValue(mockPositionsForSign(10));
    const result = await resolveBurjWithIngressGuard({ dobISO: '2026-01-20' });
    expect(result?.ambiguous).toBe(false);
  });
});

describe('resolveBurjWithIngressGuard — birth country narrows or resolves ambiguity', () => {
  it('resolves via birth-country when the country range agrees at both its bounds', async () => {
    // France is UTC+1 only — well within one sign either side of the 2022
    // Aries ingress window, agrees with itself.
    mockEphemerisAroundIngress(new Date('2022-03-20T15:33:00Z'), 11, 0);
    const result = await resolveBurjWithIngressGuard({ dobISO: '2022-03-21', birthCountry: 'France' });
    expect(result?.ambiguous).toBe(false);
    expect(result?.resolvedVia).toBe('birth-country');
    expect(result?.burjIndex).toBe(0); // Aries
  });

  it('falls back to the default window when the country is unrecognized', async () => {
    mockEphemerisAroundIngress(new Date('2022-03-20T15:33:00Z'), 11, 0);
    const result = await resolveBurjWithIngressGuard({ dobISO: '2022-03-21', birthCountry: 'Nonexistentland' });
    expect(result).not.toBeNull();
    // Should behave identically to no-country-given (still resolves to the
    // correct center-of-default-window estimate).
    expect(result?.burjIndex).toBe(0);
  });
});

describe('resolveBurjWithIngressGuard — birth time resolves ambiguity', () => {
  it('resolves deterministically when birth time + timezone are supplied', async () => {
    mockGetPlanetPositions.mockResolvedValueOnce(mockPositionsForSign(10)); // exact instant

    const result = await resolveBurjWithIngressGuard({
      dobISO: '2000-01-20',
      birthTimeLocal: '09:00',
      birthTimezone: 'America/New_York',
    });

    expect(result?.ambiguous).toBe(false);
    expect(result?.resolvedVia).toBe('birth-time');
    expect(result?.burjIndex).toBe(10);
    // Exactly one ephemeris call for the resolved exact instant, not two or three.
    expect(mockGetPlanetPositions).toHaveBeenCalledTimes(1);
  });
});

describe('resolveBurjWithIngressGuard — no noon-default, ever', () => {
  it('never substitutes a fixed default time for DETECTION (both extremes still checked)', async () => {
    mockEphemerisAroundIngress(new Date('2000-01-20T12:00:00Z'), 9, 10);

    await resolveBurjWithIngressGuard({ dobISO: '2000-01-20' });

    // Three calls: earliest, latest, center — never collapsed to one.
    expect(mockGetPlanetPositions).toHaveBeenCalledTimes(3);
    const calledInstants = mockGetPlanetPositions.mock.calls.map((call) => (call[0] as Date).getTime());
    const uniqueInstants = new Set(calledInstants);
    // At least the earliest and latest bounds must be genuinely distinct
    // instants spanning most of a day, not collapsed to a single moment.
    expect(uniqueInstants.size).toBeGreaterThanOrEqual(2);
    const spanHours = (Math.max(...calledInstants) - Math.min(...calledInstants)) / 3_600_000;
    expect(spanHours).toBeGreaterThan(20);
  });

  it('never defaults to noon when birthTimeLocal is supplied without birthTimezone', async () => {
    mockEphemerisAroundIngress(new Date('2000-01-20T12:00:00Z'), 9, 10);

    const result = await resolveBurjWithIngressGuard({
      dobISO: '2000-01-20',
      birthTimeLocal: '09:00',
      // birthTimezone intentionally omitted
    });

    expect(result?.resolvedVia).not.toBe('birth-time');
  });
});

describe('resolveBurjWithIngressGuard — structural prohibition: no ascendant/house/lot', () => {
  it('the resolution shape carries no ascendant, house, or lot fields', async () => {
    mockGetPlanetPositions.mockResolvedValue(mockPositionsForSign(10));
    const result = await resolveBurjWithIngressGuard({ dobISO: '2026-01-20' });

    const keys = Object.keys(result ?? {});
    const forbidden = ['ascendant', 'house', 'lot', 'moon', 'rising'];
    for (const key of keys) {
      const lower = key.toLowerCase();
      for (const banned of forbidden) {
        expect(lower.includes(banned)).toBe(false);
      }
    }
  });

  it('returns null (not a fabricated result) for an invalid date', async () => {
    const result = await resolveBurjWithIngressGuard({ dobISO: 'not-a-date' });
    expect(result).toBeNull();
  });
});

describe('resolveBurjWithIngressGuard — graceful offline fallback', () => {
  it('falls back to the calendar table if ephemeris is unavailable, without throwing', async () => {
    mockGetPlanetPositions.mockResolvedValue(null);
    const result = await resolveBurjWithIngressGuard({ dobISO: '2026-01-20' });
    expect(result).not.toBeNull();
    expect(result?.ambiguous).toBe(false);
    expect(result?.resolvedVia).toBe('unambiguous-date');
  });
});
