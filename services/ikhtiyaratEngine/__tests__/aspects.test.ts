/** Ported from asrar.app's src/lib/ikhtiyarat/aspects.test.ts (Vitest -> Jest). */

import { getApplyingAspect, isMoonVoidOfCourse } from '../aspects';

describe('getApplyingAspect', () => {
  it('detects Moon applying to a square with Saturn late on 2026-07-13', () => {
    const d = new Date('2026-07-13T22:00:00+01:00');
    const a = getApplyingAspect('Moon', 'Saturn', d);
    expect(a).not.toBeNull();
    expect(a!.aspect).toBe('square');
    expect(a!.applying).toBe(true);
  });

  it('detects Moon applying to an opposition with Saturn on 2026-07-20', () => {
    const d = new Date('2026-07-20T12:00:00+01:00');
    const a = getApplyingAspect('Moon', 'Saturn', d);
    expect(a).not.toBeNull();
    expect(a!.aspect).toBe('opposition');
  });
});

describe('isMoonVoidOfCourse', () => {
  it('is deterministic for the same input', () => {
    const d = new Date('2026-07-15T12:00:00+01:00');
    expect(isMoonVoidOfCourse(d)).toBe(isMoonVoidOfCourse(d));
  });
});
