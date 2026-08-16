import type { LayerResult } from '../aspectEngine';
import { aggregateTiers, type CompatibilityTier } from '../compatibilityTier';
import { RELATIONSHIP_WEIGHTING_PROFILES } from '../relationshipWeighting';
import type { RelationshipContext } from '../soulConnectionMeanings';
import {
  TIER_SCORE_BANDS,
  computeDisplayScore,
  computeVerdict,
  computeContextScore,
  computeCategoryScore,
  extractStrengths,
  extractChallenges,
  selectAdviceKeys,
  type SimplifiedCategory,
} from '../simplifiedScore';

function layer(n: 1 | 2 | 3 | 4 | 5, tier: CompatibilityTier): LayerResult {
  return { layer: n, tier, detailKey: `k${n}` };
}

const ALL_SAEED: LayerResult[] = [1, 2, 3, 4, 5].map((n) => layer(n as 1, 'saeed'));
const ALL_MUTADIL: LayerResult[] = [1, 2, 3, 4, 5].map((n) => layer(n as 1, 'mutadil'));
const ALL_MAHDHUR: LayerResult[] = [1, 2, 3, 4, 5].map((n) => layer(n as 1, 'mahdhur'));

describe('TIER_SCORE_BANDS', () => {
  it('bands are non-overlapping and ordered mahdhur < mutadil < saeed', () => {
    expect(TIER_SCORE_BANDS.mahdhur.max).toBeLessThan(TIER_SCORE_BANDS.mutadil.min);
    expect(TIER_SCORE_BANDS.mutadil.max).toBeLessThan(TIER_SCORE_BANDS.saeed.min);
  });
});

describe('computeDisplayScore', () => {
  it('is deterministic for the same input', () => {
    const a = computeDisplayScore('saeed', ALL_SAEED);
    const b = computeDisplayScore('saeed', ALL_SAEED);
    expect(a).toBe(b);
  });

  it('all-mahdhur layers score exactly the band floor', () => {
    expect(computeDisplayScore('mahdhur', ALL_MAHDHUR)).toBe(TIER_SCORE_BANDS.mahdhur.min);
  });

  it('all-saeed layers score exactly the band ceiling', () => {
    expect(computeDisplayScore('saeed', ALL_SAEED)).toBe(TIER_SCORE_BANDS.saeed.max);
  });

  it('score always stays within its tier band, across a fixture sweep', () => {
    const fixtures: LayerResult[][] = [
      ALL_SAEED, ALL_MUTADIL, ALL_MAHDHUR,
      [layer(1, 'saeed'), layer(2, 'saeed'), layer(3, 'mutadil'), layer(4, 'mutadil'), layer(5, 'mahdhur')],
      [layer(1, 'mahdhur'), layer(2, 'saeed'), layer(3, 'saeed'), layer(4, 'saeed'), layer(5, 'saeed')],
    ];
    for (const layers of fixtures) {
      for (const tier of ['saeed', 'mutadil', 'mahdhur'] as const) {
        const score = computeDisplayScore(tier, layers);
        expect(score).toBeGreaterThanOrEqual(TIER_SCORE_BANDS[tier].min);
        expect(score).toBeLessThanOrEqual(TIER_SCORE_BANDS[tier].max);
      }
    }
  });
});

describe('computeVerdict', () => {
  it('mahdhur always maps to challenging, regardless of layer mix', () => {
    expect(computeVerdict('mahdhur', ALL_MAHDHUR)).toBe('challenging');
    expect(computeVerdict('mahdhur', ALL_SAEED)).toBe('challenging');
  });

  it('mutadil always maps to mixed, regardless of layer mix', () => {
    expect(computeVerdict('mutadil', ALL_MUTADIL)).toBe('mixed');
    expect(computeVerdict('mutadil', ALL_MAHDHUR)).toBe('mixed');
  });

  it('saeed with 4-of-5 saeed layers (avgRank=0.9) is excellent', () => {
    const layers = [layer(1, 'saeed'), layer(2, 'saeed'), layer(3, 'saeed'), layer(4, 'saeed'), layer(5, 'mutadil')];
    expect(computeVerdict('saeed', layers)).toBe('excellent');
  });

  it('saeed with 3-of-5 saeed layers (avgRank=0.8) is good, not excellent', () => {
    const layers = [layer(1, 'saeed'), layer(2, 'saeed'), layer(3, 'saeed'), layer(4, 'mutadil'), layer(5, 'mutadil')];
    expect(computeVerdict('saeed', layers)).toBe('good');
  });
});

describe('computeContextScore', () => {
  const ALL_CONTEXTS: RelationshipContext[] = ['universal', 'marriage', 'friendship', 'family', 'work', 'business'];

  it('never reports a tier more favourable than the unweighted strict floor, for every context', () => {
    const fixtures: LayerResult[][] = [
      [layer(1, 'saeed'), layer(2, 'saeed'), layer(3, 'saeed'), layer(4, 'saeed'), layer(5, 'mahdhur')],
      [layer(1, 'mahdhur'), layer(2, 'mutadil'), layer(3, 'mutadil'), layer(4, 'saeed'), layer(5, 'saeed')],
      ALL_SAEED, ALL_MUTADIL, ALL_MAHDHUR,
    ];
    for (const layers of fixtures) {
      const overallTier = aggregateTiers(layers.map((l) => l.tier));
      for (const context of ALL_CONTEXTS) {
        const result = computeContextScore(layers, context);
        const overallRank = { mahdhur: 0, mutadil: 1, saeed: 2 }[overallTier];
        const resultRank = { mahdhur: 0, mutadil: 1, saeed: 2 }[result.tier];
        expect(resultRank).toBeLessThanOrEqual(overallRank);
      }
    }
  });

  it('the clamp actually fires: an up-weighted-strong but one-layer-mahdhur fixture never yields saeed', () => {
    // marriage profile up-weights layer5 (1.4) and layer1 (1.0); layer4 is mahdhur.
    const layers = [layer(1, 'saeed'), layer(2, 'saeed'), layer(3, 'saeed'), layer(4, 'mahdhur'), layer(5, 'saeed')];
    const overallTier = aggregateTiers(layers.map((l) => l.tier)); // mahdhur (strict floor)
    expect(overallTier).toBe('mahdhur');
    const result = computeContextScore(layers, 'marriage');
    expect(result.tier).toBe('mahdhur');
  });

  it('score always stays within its own returned tier\'s band, for every context', () => {
    const layers = [layer(1, 'saeed'), layer(2, 'mutadil'), layer(3, 'saeed'), layer(4, 'mutadil'), layer(5, 'saeed')];
    for (const context of ALL_CONTEXTS) {
      const result = computeContextScore(layers, context);
      expect(result.score).toBeGreaterThanOrEqual(TIER_SCORE_BANDS[result.tier].min);
      expect(result.score).toBeLessThanOrEqual(TIER_SCORE_BANDS[result.tier].max);
    }
  });
});

describe('computeCategoryScore', () => {
  const ALL_CATEGORIES: SimplifiedCategory[] = ['love', 'marriage', 'friendship', 'business'];

  it('never reports more favourable than the unweighted strict floor, for every category', () => {
    const layers = [layer(1, 'saeed'), layer(2, 'saeed'), layer(3, 'saeed'), layer(4, 'mahdhur'), layer(5, 'saeed')];
    const overallTier = aggregateTiers(layers.map((l) => l.tier));
    for (const category of ALL_CATEGORIES) {
      const result = computeCategoryScore(layers, category);
      const overallRank = { mahdhur: 0, mutadil: 1, saeed: 2 }[overallTier];
      const resultRank = { mahdhur: 0, mutadil: 1, saeed: 2 }[result.tier];
      expect(resultRank).toBeLessThanOrEqual(overallRank);
    }
  });

  it('love and marriage report different scores for a fixture where layer4 differs from layer5', () => {
    // marriage/love base weights layer5 heavily; the new marriage variant
    // additionally weights layer4 heavily and layer3 less — a fixture where
    // layer4 is weak and layer5 is strong should pull the two apart.
    const layers = [layer(1, 'saeed'), layer(2, 'mutadil'), layer(3, 'saeed'), layer(4, 'mahdhur'), layer(5, 'saeed')];
    const love = computeCategoryScore(layers, 'love');
    const marriage = computeCategoryScore(layers, 'marriage');
    expect(love.score).not.toBe(marriage.score);
  });
});

describe('extractStrengths', () => {
  it('always returns exactly 3 items, across all-saeed/mutadil/mahdhur and mixed fixtures', () => {
    const fixtures = [
      ALL_SAEED, ALL_MUTADIL, ALL_MAHDHUR,
      [layer(1, 'saeed'), layer(2, 'mahdhur'), layer(3, 'mutadil'), layer(4, 'saeed'), layer(5, 'mahdhur')],
    ];
    for (const layers of fixtures) {
      expect(extractStrengths(layers)).toHaveLength(3);
    }
  });

  it('is deterministic across repeated calls', () => {
    const layers = [layer(1, 'saeed'), layer(2, 'mahdhur'), layer(3, 'mutadil'), layer(4, 'saeed'), layer(5, 'mahdhur')];
    expect(extractStrengths(layers)).toEqual(extractStrengths(layers));
  });

  it('prefers saeed layers in LAYER_PRIORITY order [1,5,4,2,3]', () => {
    // layers 1, 2, and 4 are all saeed; priority order picks 1 then 4 then... 2 last (2 comes after 4 in [1,5,4,2,3])
    const layers = [layer(1, 'saeed'), layer(2, 'saeed'), layer(3, 'mutadil'), layer(4, 'saeed'), layer(5, 'mutadil')];
    const strengths = extractStrengths(layers);
    const saeedPicks = strengths.filter((s) => s.tier === 'saeed').map((s) => s.layer);
    expect(saeedPicks).toEqual([1, 4, 2]);
  });

  it('never claims a mahdhur layer as a plain strength — uses the distinct growth-area copy key', () => {
    const strengths = extractStrengths(ALL_MAHDHUR);
    for (const s of strengths) {
      expect(s.copyKey).toContain('mahdhurGrowth');
    }
  });
});

describe('extractChallenges', () => {
  it('always returns 2 or 3 items, across all-saeed/mutadil/mahdhur and mixed fixtures', () => {
    const fixtures = [
      ALL_SAEED, ALL_MUTADIL, ALL_MAHDHUR,
      [layer(1, 'saeed'), layer(2, 'mahdhur'), layer(3, 'mutadil'), layer(4, 'saeed'), layer(5, 'mutadil')],
    ];
    for (const layers of fixtures) {
      const challenges = extractChallenges(layers);
      expect(challenges.length).toBeGreaterThanOrEqual(2);
      expect(challenges.length).toBeLessThanOrEqual(3);
    }
  });

  it('caps at 3 when 4+ layers are mahdhur, picking by LAYER_PRIORITY order [1,5,4,2,3]', () => {
    const layers = [layer(1, 'mahdhur'), layer(2, 'mahdhur'), layer(3, 'saeed'), layer(4, 'mahdhur'), layer(5, 'mahdhur')];
    const challenges = extractChallenges(layers);
    expect(challenges).toHaveLength(3);
    expect(challenges.map((c) => c.layer)).toEqual([1, 5, 4]);
  });

  it('relaxes to mutadil layers when fewer than 2 mahdhur layers exist', () => {
    const layers = [layer(1, 'mahdhur'), layer(2, 'saeed'), layer(3, 'mutadil'), layer(4, 'saeed'), layer(5, 'mutadil')];
    const challenges = extractChallenges(layers);
    expect(challenges.length).toBeGreaterThanOrEqual(2);
    expect(challenges.some((c) => c.tier === 'mahdhur')).toBe(true);
    expect(challenges.some((c) => c.tier === 'mutadil')).toBe(true);
  });

  it('is deterministic across repeated calls', () => {
    const layers = [layer(1, 'mahdhur'), layer(2, 'mahdhur'), layer(3, 'saeed'), layer(4, 'mahdhur'), layer(5, 'mahdhur')];
    expect(extractChallenges(layers)).toEqual(extractChallenges(layers));
  });
});

describe('selectAdviceKeys', () => {
  it('returns exactly 1 key when the weakest layer is saeed (all-saeed fixture)', () => {
    const keys = selectAdviceKeys('saeed', ALL_SAEED);
    expect(keys).toHaveLength(1);
  });

  it('returns exactly 2 keys when a weaker layer exists, second key names that layer', () => {
    const layers = [layer(1, 'saeed'), layer(2, 'saeed'), layer(3, 'saeed'), layer(4, 'saeed'), layer(5, 'mahdhur')];
    const keys = selectAdviceKeys('saeed', layers);
    expect(keys).toHaveLength(2);
    expect(keys[1]).toContain('layer5');
  });

  it('never returns 0 or 3+ keys, across a fixture sweep', () => {
    const fixtures = [ALL_SAEED, ALL_MUTADIL, ALL_MAHDHUR];
    for (const layers of fixtures) {
      const overallTier = aggregateTiers(layers.map((l) => l.tier));
      const keys = selectAdviceKeys(overallTier, layers);
      expect(keys.length).toBeGreaterThanOrEqual(1);
      expect(keys.length).toBeLessThanOrEqual(2);
    }
  });
});

describe('regression — new score/verdict never contradicts overallTier', () => {
  it('verdict is "excellent" only when overallTier is saeed', () => {
    const fixtures: Array<[CompatibilityTier, LayerResult[]]> = [
      ['saeed', ALL_SAEED],
      ['mutadil', ALL_MUTADIL],
      ['mahdhur', ALL_MAHDHUR],
    ];
    for (const [tier, layers] of fixtures) {
      const verdict = computeVerdict(tier, layers);
      if (verdict === 'excellent') {
        expect(tier).toBe('saeed');
      }
    }
  });

  it('verdict is "challenging" if and only if overallTier is mahdhur', () => {
    expect(computeVerdict('mahdhur', ALL_SAEED)).toBe('challenging');
    expect(computeVerdict('mutadil', ALL_MAHDHUR)).not.toBe('challenging');
    expect(computeVerdict('saeed', ALL_MAHDHUR)).not.toBe('challenging');
  });

  it('no RelationshipContext ever reports more favourable than the fixture overallTier', () => {
    const layers = [layer(1, 'mahdhur'), layer(2, 'saeed'), layer(3, 'saeed'), layer(4, 'saeed'), layer(5, 'saeed')];
    const overallTier = aggregateTiers(layers.map((l) => l.tier));
    const overallRank = { mahdhur: 0, mutadil: 1, saeed: 2 }[overallTier];
    for (const context of Object.keys(RELATIONSHIP_WEIGHTING_PROFILES) as RelationshipContext[]) {
      const result = computeContextScore(layers, context);
      const resultRank = { mahdhur: 0, mutadil: 1, saeed: 2 }[result.tier];
      expect(resultRank).toBeLessThanOrEqual(overallRank);
    }
  });
});
