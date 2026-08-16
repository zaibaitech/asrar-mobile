/**
 * ProfileDerivationService — ingress-aware Burj resolution tests
 * =================================================================
 *
 * Ground truth for the ingress fixture below: exact UTC solar-ingress
 * instants for 2026, sourced from a published ephemeris table
 * (moontracks.com/sun_solar_ingress.html, Swiss-Ephemeris-derived), and
 * cross-checked against this repo's own embedded EPHEMERIS_2026_JAN data
 * (services/EphemerisDataCache.ts), which independently shows the Sun at
 * longitude 295.9° (Capricorn, sign 9) on 2026-01-16 and 300.9° (Aquarius,
 * sign 10) on 2026-01-21 — consistent with a Jan 20 2026 01:44 UTC ingress.
 *
 * Calendar *dates* of ingress (not exact times, which drift slightly year
 * to year but never by more than about a day) are classical/fixed and used
 * here as the source of truth for BURJ_DATE_RANGES and isNearIngress().
 */

import { deriveBurjFromDOB, isNearIngress, resolveBurjWithIngressGuard } from '../ProfileDerivationService';

// ============================================================================
// FIXTURE: 2026 solar ingress dates + UTC times (all 12 signs)
// Source: moontracks.com/sun_solar_ingress.html
// ============================================================================
const INGRESS_2026 = [
  { sign: 'Aquarius', signIndex: 10, date: '2026-01-20', utc: '2026-01-20T01:44:00Z' },
  { sign: 'Pisces', signIndex: 11, date: '2026-02-18', utc: '2026-02-18T15:51:00Z' },
  { sign: 'Aries', signIndex: 0, date: '2026-03-20', utc: '2026-03-20T14:45:00Z' },
  { sign: 'Taurus', signIndex: 1, date: '2026-04-20', utc: '2026-04-20T01:39:00Z' },
  { sign: 'Gemini', signIndex: 2, date: '2026-05-21', utc: '2026-05-21T00:36:00Z' },
  { sign: 'Cancer', signIndex: 3, date: '2026-06-21', utc: '2026-06-21T08:24:00Z' },
  { sign: 'Leo', signIndex: 4, date: '2026-07-22', utc: '2026-07-22T19:13:00Z' },
  { sign: 'Virgo', signIndex: 5, date: '2026-08-23', utc: '2026-08-23T02:18:00Z' },
  { sign: 'Libra', signIndex: 6, date: '2026-09-23', utc: '2026-09-23T00:05:00Z' },
  { sign: 'Scorpio', signIndex: 7, date: '2026-10-23', utc: '2026-10-23T09:37:00Z' },
  { sign: 'Sagittarius', signIndex: 8, date: '2026-11-22', utc: '2026-11-22T07:23:00Z' },
  { sign: 'Capricorn', signIndex: 9, date: '2026-12-21', utc: '2026-12-21T20:50:00Z' },
] as const;

// Dates safely mid-sign (>10 days from any boundary) as negative controls.
const MID_SIGN_CONTROLS = [
  '2026-02-01', // deep in Aquarius
  '2026-05-05', // deep in Taurus
  '2026-08-10', // deep in Leo
  '2026-11-05', // deep in Scorpio
];

// Mock EphemerisService so tests are deterministic and offline — each mocked
// call returns the sign the Sun genuinely occupies just before vs. just after
// the fixture's real ingress instant.
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

describe('resolveBurjWithIngressGuard — the reported bug: Jan 20 2000', () => {
  it('returns ambiguous (Capricorn/Aquarius), not confident Aquarius', async () => {
    // Window bounds straddle the real-world Jan 2000 ingress: the UTC+14
    // bound falls before it (still Capricorn), the UTC-12 bound falls after
    // it (already Aquarius) — this is the exact scenario from the bug report.
    mockGetPlanetPositions
      .mockResolvedValueOnce(mockPositionsForSign(9))  // earliest bound: Capricorn
      .mockResolvedValueOnce(mockPositionsForSign(10)); // latest bound: Aquarius

    const result = await resolveBurjWithIngressGuard({ dobISO: '2000-01-20' });

    expect(result?.ambiguous).toBe(true);
    expect(result?.resolvedVia).toBe('unresolved-ambiguous');
    expect(result?.candidateSigns).toHaveLength(2);
    const candidateIndices = result?.candidateSigns?.map(c => c.burjIndex).sort((a, b) => a - b);
    expect(candidateIndices).toEqual([9, 10]); // Capricorn, Aquarius
  });

  it('does NOT return a confident single Aquarius result for this date', async () => {
    mockGetPlanetPositions
      .mockResolvedValueOnce(mockPositionsForSign(9))
      .mockResolvedValueOnce(mockPositionsForSign(10));

    const result = await resolveBurjWithIngressGuard({ dobISO: '2000-01-20' });
    // The old, buggy deriveBurjFromDOB always returns Aquarius (index 10)
    // for this date with false confidence — the new resolver must not do
    // the same without flagging ambiguity.
    const legacy = deriveBurjFromDOB('2000-01-20');
    expect(legacy?.burjIndex).toBe(10); // confirms the bug exists in the old function
    expect(result?.ambiguous).toBe(true); // confirms the new resolver catches it
  });
});

describe('resolveBurjWithIngressGuard — agreement at both window bounds resolves unambiguously', () => {
  it('is not ambiguous when both window-bound instants agree', async () => {
    mockGetPlanetPositions
      .mockResolvedValueOnce(mockPositionsForSign(10))
      .mockResolvedValueOnce(mockPositionsForSign(10));

    const result = await resolveBurjWithIngressGuard({ dobISO: '2026-01-20' });
    expect(result?.ambiguous).toBe(false);
    expect(result?.burjIndex).toBe(10);
    expect(result?.resolvedVia).toBe('unambiguous-date');
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
    // Exactly one ephemeris call for the resolved exact instant, not two.
    expect(mockGetPlanetPositions).toHaveBeenCalledTimes(1);
  });
});

describe('resolveBurjWithIngressGuard — no noon-default, ever', () => {
  it('never substitutes a fixed default time when birth time is absent', async () => {
    mockGetPlanetPositions
      .mockResolvedValueOnce(mockPositionsForSign(9))
      .mockResolvedValueOnce(mockPositionsForSign(10));

    await resolveBurjWithIngressGuard({ dobISO: '2000-01-20' });

    // Both calls must be at the true UTC+14/UTC-12 extremes of the calendar
    // date, never at a single midpoint/noon instant.
    expect(mockGetPlanetPositions).toHaveBeenCalledTimes(2);
    const [firstCallDate] = mockGetPlanetPositions.mock.calls[0];
    const [secondCallDate] = mockGetPlanetPositions.mock.calls[1];

    const earliest = new Date(Date.UTC(2000, 0, 20, 0, 0, 0) - 14 * 3600_000);
    const latest = new Date(Date.UTC(2000, 0, 20, 23, 59, 59) + 12 * 3600_000);

    expect((firstCallDate as Date).getTime()).toBe(earliest.getTime());
    expect((secondCallDate as Date).getTime()).toBe(latest.getTime());

    // The gap between the two instants must be the full ~50h uncertainty
    // window, not collapsed to zero (which would indicate a single
    // noon-default instant was used for both).
    const gapHours = ((secondCallDate as Date).getTime() - (firstCallDate as Date).getTime()) / 3600_000;
    expect(gapHours).toBeGreaterThan(48);
  });

  it('never defaults to noon when birthTimeLocal is supplied without birthTimezone', async () => {
    // Only one of the pair is present — must NOT silently proceed with an
    // assumed timezone; falls through to the window-bound ambiguity check.
    mockGetPlanetPositions
      .mockResolvedValueOnce(mockPositionsForSign(9))
      .mockResolvedValueOnce(mockPositionsForSign(10));

    const result = await resolveBurjWithIngressGuard({
      dobISO: '2000-01-20',
      birthTimeLocal: '09:00',
      // birthTimezone intentionally omitted
    });

    expect(result?.resolvedVia).not.toBe('birth-time');
    expect(result?.ambiguous).toBe(true);
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
