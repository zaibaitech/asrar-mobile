/**
 * calculatePersonPersonCompatibilityMixed — integration tests
 * ================================================================
 * Covers: zero regression for the untouched both-name (abjad) path now
 * that the function is async; the both-DOB path routes through the new
 * whole-sign aspect engine instead of the old percentage-based
 * burjCompatibility; and the structural prohibitions (no ascendant/house/
 * lot/Moon/percentage anywhere in DOB-mode output).
 */

// ProfileDerivationService (and its own dependency chain, e.g.
// NatalChartService -> EphemerisService -> @react-native-community/netinfo)
// pulls in a native module Jest can't parse outside a React Native test
// environment. Mock EphemerisService first so requireActual below can load
// ProfileDerivationService without hitting that import.
jest.mock('../../EphemerisService', () => ({
  getPlanetPositions: jest.fn(),
  getPlanetPositionsPrecise: jest.fn(),
}));

jest.mock('../../ProfileDerivationService', () => {
  const actual = jest.requireActual('../../ProfileDerivationService');
  return {
    ...actual,
    resolveBurjWithIngressGuard: jest.fn(),
  };
});

import { calculatePersonPersonCompatibilityMixed, type PersonPersonParticipantInput } from '../engine';
import { resolveBurjWithIngressGuard } from '../../ProfileDerivationService';

const mockResolve = resolveBurjWithIngressGuard as jest.MockedFunction<typeof resolveBurjWithIngressGuard>;

beforeEach(() => {
  mockResolve.mockReset();
});

describe('calculatePersonPersonCompatibilityMixed — both-name path (zero regression)', () => {
  it('still returns a person-person result with relationshipCompatibility populated', async () => {
    const person1: PersonPersonParticipantInput = { inputMethod: 'name', name: 'Ahmad', arabicName: 'أحمد' };
    const person2: PersonPersonParticipantInput = { inputMethod: 'name', name: 'Fatima', arabicName: 'فاطمة' };

    const result = await calculatePersonPersonCompatibilityMixed(person1, person2, 'marriage');

    expect(result.type).toBe('person-person');
    expect(result.person1.inputMethod).toBe('name');
    expect(result.person2.inputMethod).toBe('name');
    expect(result.relationshipCompatibility).toBeDefined();
    expect(result.zodiacAspectResult).toBeUndefined();
    // Never touches the ephemeris resolver for a both-name pairing.
    expect(mockResolve).not.toHaveBeenCalled();
  });
});

describe('calculatePersonPersonCompatibilityMixed — both-DOB path', () => {
  const mockResolution = (burjIndex: number, ambiguous = false) => ({
    burjAr: 'برج',
    burjEn: 'Sign',
    burjIndex,
    ambiguous,
    candidateSigns: ambiguous
      ? [{ burjAr: 'أ', burjEn: 'A', burjIndex }, { burjAr: 'ب', burjEn: 'B', burjIndex: (burjIndex + 1) % 12 }] as [any, any]
      : undefined,
    resolvedVia: 'unambiguous-date' as const,
  });

  it('returns zodiacAspectResult, not the old percentage-based burjCompatibility', async () => {
    mockResolve.mockResolvedValueOnce(mockResolution(0)).mockResolvedValueOnce(mockResolution(6)); // Aries / Libra

    const person1: PersonPersonParticipantInput = { inputMethod: 'dob', dobISO: '1990-03-25', dobLabel: 'March 25, 1990' };
    const person2: PersonPersonParticipantInput = { inputMethod: 'dob', dobISO: '1992-10-10', dobLabel: 'October 10, 1992' };

    const result = await calculatePersonPersonCompatibilityMixed(person1, person2, 'universal');

    expect(result.zodiacAspectResult).toBeDefined();
    expect(result.zodiacAspectResult!.layers).toHaveLength(5);
    expect(result.zodiacAspectResult!.overallTier).toBeDefined();
    // The old field must not exist on the type at all (compile-time enforced
    // by types.ts no longer declaring it); runtime check that nothing
    // populates a same-named field by accident.
    expect((result as any).burjCompatibility).toBeUndefined();
  });

  it('same-sign pairing (identical dates) never returns an overall saeed from Layer 1 alone', async () => {
    mockResolve.mockResolvedValueOnce(mockResolution(4)).mockResolvedValueOnce(mockResolution(4)); // both Leo

    const person1: PersonPersonParticipantInput = { inputMethod: 'dob', dobISO: '1990-08-05', dobLabel: 'Aug 5, 1990' };
    const person2: PersonPersonParticipantInput = { inputMethod: 'dob', dobISO: '1990-08-05', dobLabel: 'Aug 5, 1990' };

    const result = await calculatePersonPersonCompatibilityMixed(person1, person2, 'universal');

    expect(result.zodiacAspectResult!.sameSignConjunction).toBe(true);
    expect(result.zodiacAspectResult!.layers[0].tier).toBe('mutadil');
  });

  it('propagates ambiguity into the result when a resolver call is ambiguous', async () => {
    mockResolve.mockResolvedValueOnce(mockResolution(9, true)).mockResolvedValueOnce(mockResolution(6));

    const person1: PersonPersonParticipantInput = { inputMethod: 'dob', dobISO: '2000-01-20', dobLabel: 'Jan 20, 2000' };
    const person2: PersonPersonParticipantInput = { inputMethod: 'dob', dobISO: '1992-10-10', dobLabel: 'Oct 10, 1992' };

    const result = await calculatePersonPersonCompatibilityMixed(person1, person2, 'universal');

    expect(result.zodiacAspectResult!.ambiguityNote).toBeDefined();
    expect(result.zodiacAspectResult!.ambiguityNote!.person).toBe(1);
  });
});

describe('calculatePersonPersonCompatibilityMixed — structural prohibitions', () => {
  it('the zodiacAspectResult type has no ascendant/house/lot/moon fields anywhere', async () => {
    mockResolve
      .mockResolvedValueOnce({ burjAr: 'أ', burjEn: 'Aries', burjIndex: 0, ambiguous: false, candidateSigns: undefined, resolvedVia: 'unambiguous-date' })
      .mockResolvedValueOnce({ burjAr: 'ب', burjEn: 'Libra', burjIndex: 6, ambiguous: false, candidateSigns: undefined, resolvedVia: 'unambiguous-date' });

    const person1: PersonPersonParticipantInput = { inputMethod: 'dob', dobISO: '1990-03-25', dobLabel: 'x' };
    const person2: PersonPersonParticipantInput = { inputMethod: 'dob', dobISO: '1992-10-10', dobLabel: 'y' };

    const result = await calculatePersonPersonCompatibilityMixed(person1, person2, 'universal');
    const serialized = JSON.stringify(result).toLowerCase();

    for (const banned of ['ascendant', 'house', '"lot"', 'moon']) {
      expect(serialized.includes(banned)).toBe(false);
    }
  });
});
