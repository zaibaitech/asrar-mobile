import { RELATIONSHIP_WEIGHTING_PROFILES, selectEmphasizedFindings } from '../relationshipWeighting';
import type { RelationshipContext } from '../soulConnectionMeanings';
import type { LayerResult, Layer5PairResult } from '../aspectEngine';

const ALL_CONTEXTS: RelationshipContext[] = ['universal', 'marriage', 'friendship', 'family', 'work', 'business'];

describe('relationshipWeighting — completeness', () => {
  it('every RelationshipContext value has a weighting profile entry', () => {
    for (const context of ALL_CONTEXTS) {
      expect(RELATIONSHIP_WEIGHTING_PROFILES[context]).toBeDefined();
    }
  });

  it('business and work produce different emphasis (materially different readings)', () => {
    const business = RELATIONSHIP_WEIGHTING_PROFILES.business;
    const work = RELATIONSHIP_WEIGHTING_PROFILES.work;
    expect(business.layer5Emphasis.emphasizedPairs).not.toEqual(work.layer5Emphasis.emphasizedPairs);
  });

  it('marriage emphasizes Venus-Mars; business does not', () => {
    const marriageHasVenusMars = RELATIONSHIP_WEIGHTING_PROFILES.marriage.layer5Emphasis.emphasizedPairs.some(
      (p) => (p.planet1 === 'venus' && p.planet2 === 'mars') || (p.planet1 === 'mars' && p.planet2 === 'venus')
    );
    const businessHasVenusMars = RELATIONSHIP_WEIGHTING_PROFILES.business.layer5Emphasis.emphasizedPairs.some(
      (p) => (p.planet1 === 'venus' && p.planet2 === 'mars') || (p.planet1 === 'mars' && p.planet2 === 'venus')
    );
    expect(marriageHasVenusMars).toBe(true);
    expect(businessHasVenusMars).toBe(false);
  });
});

describe('selectEmphasizedFindings — never invents a false favourable result', () => {
  const layers: LayerResult[] = [1, 2, 3, 4, 5].map((n) => ({
    layer: n as 1 | 2 | 3 | 4 | 5,
    tier: 'mahdhur',
    detailKey: `layer${n}`,
  }));
  const layer5Pairs: Layer5PairResult[] = [
    { planet1: 'venus', planet2: 'mars', result: { layer: 5, tier: 'mahdhur', detailKey: 'l5' } },
  ];

  it('only ever surfaces findings drawn from the actual computed layers', () => {
    const emphasized = selectEmphasizedFindings(layers, layer5Pairs, 'marriage');
    for (const finding of emphasized) {
      expect(['mahdhur']).toContain(finding.tier);
    }
  });
});
