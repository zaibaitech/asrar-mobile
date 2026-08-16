/**
 * aspectEngine — whole-sign aspect mapping and strict-floor aggregation
 * ==========================================================================
 * Covers the spec's most safety-critical invariants: the 12 sign-distance
 * relationships (including the previously-unmodeled "aversion" category),
 * same-sign as ittiṣāl (never maximum harmony), and the aggregate-never-
 * more-favourable-than-its-worst-component rule.
 */

// aspectEngine imports engine.ts (for analyzePlanetaryResonance), which
// transitively imports EphemerisService -> @react-native-community/netinfo,
// a native module Jest cannot parse outside a React Native test environment.
// Mock it at the source so none of these pure, network-free tests need it.
jest.mock('../../EphemerisService', () => ({
  getPlanetPositions: jest.fn(),
  getPlanetPositionsPrecise: jest.fn(),
}));

import {
  computeLayer1WholeSignAspect,
  computeLayer2Triplicity,
  computeLayer3Modality,
  computeLayer4DomicileRulers,
  computeLayer5CrossPlanetAspects,
  type ZodiacSignName,
  type PersonPlanetSigns,
} from '../aspectEngine';
import { aggregateTiers, tierRank, type CompatibilityTier } from '../compatibilityTier';

const SIGNS: ZodiacSignName[] = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces',
];

describe('computeLayer1WholeSignAspect — all 12 sign-distance relationships', () => {
  it('same sign (conjunction) is ittiṣāl — mutadil, never saeed (the reported bug)', () => {
    for (const sign of SIGNS) {
      const result = computeLayer1WholeSignAspect(sign, sign);
      expect(result.metadata?.nazar).toBe('conjunction');
      expect(result.tier).toBe('mutadil');
      expect(result.tier).not.toBe('saeed');
    }
  });

  it('3rd/11th sign relationships are sextile', () => {
    // Aries(0) -> Gemini(2): 3rd counting inclusively. Aries(0) -> Aquarius(10):
    // 11th counting inclusively (same circular distance as the 3rd, the other way).
    expect(computeLayer1WholeSignAspect('aries', 'gemini').metadata?.nazar).toBe('sextile');
    expect(computeLayer1WholeSignAspect('aries', 'aquarius').metadata?.nazar).toBe('sextile');
  });

  it('4th/10th sign relationships are square', () => {
    expect(computeLayer1WholeSignAspect('aries', 'cancer').metadata?.nazar).toBe('square');
    expect(computeLayer1WholeSignAspect('aries', 'capricorn').metadata?.nazar).toBe('square');
  });

  it('5th/9th sign relationships are trine', () => {
    expect(computeLayer1WholeSignAspect('aries', 'leo').metadata?.nazar).toBe('trine');
    expect(computeLayer1WholeSignAspect('aries', 'sagittarius').metadata?.nazar).toBe('trine');
  });

  it('7th sign relationship is opposition', () => {
    expect(computeLayer1WholeSignAspect('aries', 'libra').metadata?.nazar).toBe('opposition');
  });

  it('2nd/12th and 6th/8th sign relationships are aversion — distinct from conflict', () => {
    // 2nd (Taurus) / 12th (Pisces, the sign immediately before Aries)
    expect(computeLayer1WholeSignAspect('aries', 'taurus').metadata?.nazar).toBe('aversion');
    expect(computeLayer1WholeSignAspect('aries', 'pisces').metadata?.nazar).toBe('aversion');
    // 6th (Virgo) / 8th (Scorpio)
    expect(computeLayer1WholeSignAspect('aries', 'virgo').metadata?.nazar).toBe('aversion');
    expect(computeLayer1WholeSignAspect('aries', 'scorpio').metadata?.nazar).toBe('aversion');
  });

  it('aversion tier is mahdhur but its detailKey is distinct from square/opposition', () => {
    const aversion = computeLayer1WholeSignAspect('aries', 'taurus');
    const square = computeLayer1WholeSignAspect('aries', 'cancer');
    const opposition = computeLayer1WholeSignAspect('aries', 'libra');
    expect(aversion.detailKey).not.toBe(square.detailKey);
    expect(aversion.detailKey).not.toBe(opposition.detailKey);
    expect(aversion.detailKey).toContain('aversion');
  });

  it('is symmetric: sign1/sign2 order does not change the relationship', () => {
    for (const s1 of SIGNS) {
      for (const s2 of SIGNS) {
        const a = computeLayer1WholeSignAspect(s1, s2);
        const b = computeLayer1WholeSignAspect(s2, s1);
        expect(a.metadata?.nazar).toBe(b.metadata?.nazar);
      }
    }
  });

  it('covers exactly the 12 distance/relationship pairs the spec defines, for every sign pair', () => {
    const seen = new Set<string>();
    for (const s1 of SIGNS) {
      for (const s2 of SIGNS) {
        seen.add(String(computeLayer1WholeSignAspect(s1, s2).metadata?.nazar));
      }
    }
    expect(seen).toEqual(new Set(['conjunction', 'sextile', 'square', 'trine', 'opposition', 'aversion']));
  });
});

describe('computeLayer2Triplicity — element agreement', () => {
  it('same element agrees (saeed)', () => {
    expect(computeLayer2Triplicity('aries', 'leo').tier).toBe('saeed');
  });
  it('fire/air and earth/water agree (saeed)', () => {
    expect(computeLayer2Triplicity('aries', 'gemini').tier).toBe('saeed'); // fire/air
    expect(computeLayer2Triplicity('taurus', 'cancer').tier).toBe('saeed'); // earth/water
  });
  it('fire/water and air/earth are contrary (mahdhur)', () => {
    expect(computeLayer2Triplicity('aries', 'cancer').tier).toBe('mahdhur'); // fire/water
    expect(computeLayer2Triplicity('gemini', 'taurus').tier).toBe('mahdhur'); // air/earth
  });
});

describe('computeLayer3Modality', () => {
  it('same modality is mixed (mutadil), not automatically favourable', () => {
    expect(computeLayer3Modality('aries', 'cancer').tier).toBe('mutadil'); // both cardinal
  });
  it('different modality is complementary (saeed)', () => {
    expect(computeLayer3Modality('aries', 'taurus').tier).toBe('saeed'); // cardinal/fixed
  });
});

describe('computeLayer4DomicileRulers', () => {
  it('same ruler is mutadil (shared strength AND weakness), not purely harmonious', () => {
    // Aries and Scorpio are both Mars-ruled.
    const result = computeLayer4DomicileRulers('aries', 'scorpio');
    expect(result.metadata?.ruler1).toBe(result.metadata?.ruler2);
    expect(result.tier).toBe('mutadil');
  });
});

describe('computeLayer5CrossPlanetAspects', () => {
  const person1: PersonPlanetSigns = {
    sun: 'aries', venus: 'taurus', mars: 'aries', mercury: 'pisces', jupiter: 'leo', saturn: 'capricorn',
  };
  const person2: PersonPlanetSigns = {
    sun: 'libra', venus: 'libra', mars: 'cancer', mercury: 'aries', jupiter: 'sagittarius', saturn: 'aquarius',
  };

  it('computes all 25 planet-pair combinations (5x5)', () => {
    const { pairResults } = computeLayer5CrossPlanetAspects(person1, person2);
    expect(pairResults).toHaveLength(25);
  });

  it('aggregates to the strict floor across all 25 pairs', () => {
    const { pairResults, layer } = computeLayer5CrossPlanetAspects(person1, person2);
    const expectedFloor = aggregateTiers(pairResults.map((p) => p.result.tier));
    expect(layer.tier).toBe(expectedFloor);
  });
});

describe('aggregateTiers — the strict floor invariant', () => {
  const allTiers: CompatibilityTier[] = ['saeed', 'mutadil', 'mahdhur'];

  it('never returns a tier more favourable than the worst input, across all combinations', () => {
    for (const a of allTiers) {
      for (const b of allTiers) {
        for (const c of allTiers) {
          const result = aggregateTiers([a, b, c]);
          const worstRank = Math.min(tierRank(a), tierRank(b), tierRank(c));
          expect(tierRank(result)).toBe(worstRank);
        }
      }
    }
  });

  it('all-saeed aggregates to saeed', () => {
    expect(aggregateTiers(['saeed', 'saeed', 'saeed'])).toBe('saeed');
  });

  it('a single mahdhur drags the whole aggregate down to mahdhur', () => {
    expect(aggregateTiers(['saeed', 'saeed', 'mahdhur'])).toBe('mahdhur');
  });

  it('empty input does not claim favourability', () => {
    expect(aggregateTiers([])).not.toBe('saeed');
  });
});
