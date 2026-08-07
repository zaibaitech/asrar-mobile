/**
 * Ported from asrar.app's src/lib/ikhtiyarat/ephemeris.test.ts (Vitest ->
 * Jest; same describe/it/expect globals, no import needed under jest).
 * Runs against the real astronomy-engine computation — no mocking needed
 * here since ephemeris.ts has no RN/AsyncStorage/NetInfo dependency
 * (unlike services/EphemerisService.ts).
 */

import { getPlanetPosition, getMoonElongation, getMoonSunSeparation, getMoonPhaseDirection, angleDiff } from '../ephemeris';
import { getMoonApplyingAspects } from '../aspects';

describe('getPlanetPosition', () => {
  it('places the Moon in Cancer on 2026-07-13 (Edinburgh, BST)', () => {
    const d = new Date('2026-07-13T12:00:00+01:00');
    const moon = getPlanetPosition('Moon', d);
    expect(moon.sign).toBe('cancer');
    expect(moon.degreeInSign).toBeGreaterThan(0);
    expect(moon.degreeInSign).toBeLessThan(15.5);
  });

  it('computes Saturn near 14.6° Aries on 2026-07-13', () => {
    const d = new Date('2026-07-13T12:00:00+01:00');
    const saturn = getPlanetPosition('Saturn', d);
    expect(saturn.sign).toBe('aries');
    expect(saturn.degreeInSign).toBeGreaterThan(14);
    expect(saturn.degreeInSign).toBeLessThan(15);
  });

  it('places the Moon in Libra on 2026-07-20 (via combusta band)', () => {
    const d = new Date('2026-07-20T12:00:00+01:00');
    const moon = getPlanetPosition('Moon', d);
    expect(moon.sign).toBe('libra');
    expect(moon.longitude).toBeGreaterThanOrEqual(195);
    expect(moon.longitude).toBeLessThan(225);
  });

  it('is deterministic for the same input', () => {
    const d = new Date('2026-07-13T12:00:00+01:00');
    const a = getPlanetPosition('Venus', d);
    const b = getPlanetPosition('Venus', d);
    expect(a.longitude).toBe(b.longitude);
    expect(a.isRetrograde).toBe(b.isRetrograde);
  });
});

describe('getMoonElongation / separation / phase direction', () => {
  it('is in the dark-moon band (315-360) all day on 2026-07-13', () => {
    for (const h of [0, 6, 12, 18, 23]) {
      const d = new Date(`2026-07-13T${String(h).padStart(2, '0')}:00:00+01:00`);
      const elong = getMoonElongation(d);
      expect(elong).toBeGreaterThanOrEqual(315);
      expect(elong).toBeLessThanOrEqual(360);
      expect(getMoonPhaseDirection(d)).toBe('waning');
    }
  });

  it('moves from under-the-beams toward combustion through 2026-07-13', () => {
    const morning = getMoonSunSeparation(new Date('2026-07-13T06:00:00+01:00'));
    const night = getMoonSunSeparation(new Date('2026-07-13T23:00:00+01:00'));
    expect(morning).toBeGreaterThan(8.5);
    expect(night).toBeLessThan(8.5);
    expect(night).toBeLessThan(morning);
  });

  it('is waxing with elongation ~78° at midday on 2026-07-20', () => {
    const d = new Date('2026-07-20T12:00:00+01:00');
    const elong = getMoonElongation(d);
    expect(getMoonPhaseDirection(d)).toBe('waxing');
    expect(elong).toBeGreaterThan(70);
    expect(elong).toBeLessThan(90);
  });

  it('clears the beams and waxes favorably by 2026-07-16 to 07-18', () => {
    for (const day of [16, 17, 18]) {
      const d = new Date(`2026-07-${day}T12:00:00+01:00`);
      expect(getMoonPhaseDirection(d)).toBe('waxing');
      const elong = getMoonElongation(d);
      expect(elong).toBeGreaterThan(17); // clear of beams
    }
  });
});

describe('angleDiff', () => {
  it('returns signed shortest angular difference', () => {
    expect(angleDiff(10, 350)).toBeCloseTo(20, 5);
    expect(angleDiff(350, 10)).toBeCloseTo(-20, 5);
    expect(angleDiff(180, 0)).toBeCloseTo(180, 5);
  });
});

// Permanent JPL DE421 regression tests. These figures are external
// verification values checked against this engine's output before being
// hard-coded here. Two different times of day are used because that is
// where each reference figure was found to match: 339.5° elongation
// matches at 00:00 Edinburgh on 13 July (06:00 that day gives 343.08°,
// a different instant), while 120.6° elongation and the 3.3° Jupiter
// trine orb both match almost exactly at 06:00 on 24 July. If this ever
// fails after an unrelated change, re-verify against fresh JPL data
// before assuming the change under test is wrong.
describe('JPL DE421 regression — 13 & 24 July 2026, Edinburgh', () => {
  it('13 July 2026, 00:00 BST: Moon-Sun elongation ~339.5°, Mercury retrograde', () => {
    const d = new Date('2026-07-13T00:00:00+01:00');
    expect(getMoonElongation(d)).toBeCloseTo(339.5, 0);
    expect(getPlanetPosition('Mercury', d).isRetrograde).toBe(true);
  });

  it('24 July 2026, 06:00 BST: Moon-Sun elongation ~120.6°, Mercury direct, Jupiter trine orb ~3.3°', () => {
    const d = new Date('2026-07-24T06:00:00+01:00');
    expect(getMoonElongation(d)).toBeCloseTo(120.6, 0);
    expect(getPlanetPosition('Mercury', d).isRetrograde).toBe(false);

    const aspects = getMoonApplyingAspects(d);
    const jupiterTrine = aspects.find(a => a.planet === 'Jupiter' && a.aspect === 'trine');
    expect(jupiterTrine).toBeDefined();
    expect(jupiterTrine!.orb).toBeCloseTo(3.3, 0);
  });
});
