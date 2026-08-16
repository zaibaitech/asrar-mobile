/**
 * Relationship-type weighting profiles for the whole-sign aspect engine
 * =========================================================================
 * Reuses the RelationshipContext already threaded through the compatibility
 * pipeline (services/compatibility/soulConnectionMeanings.ts) rather than
 * introducing new UI. Weighting only changes which findings are highlighted
 * in copy — it never changes an individual layer's computed tier, and the
 * rendered overall badge always uses aspectEngine's aggregateTiers() strict
 * floor, never a weighted score. This keeps every relationship context
 * subject to the same "aggregate never more favourable than its
 * least-favourable component" guarantee.
 *
 * @module relationshipWeighting
 */

import type { RelationshipContext } from './soulConnectionMeanings';
import type { AspectPlanetId, LayerResult, Layer5PairResult } from './aspectEngine';

export interface LayerWeights {
  layer1: number;
  layer2: number;
  layer3: number;
  layer4: number;
  layer5: number;
}

export interface Layer5PairEmphasis {
  emphasizedPairs: Array<{ planet1: AspectPlanetId; planet2: AspectPlanetId }>;
}

export interface WeightingProfile {
  layerWeights: LayerWeights;
  layer5Emphasis: Layer5PairEmphasis;
}

export const RELATIONSHIP_WEIGHTING_PROFILES: Record<RelationshipContext, WeightingProfile> = {
  marriage: {
    layerWeights: { layer1: 1.0, layer2: 1.0, layer3: 0.8, layer4: 1.0, layer5: 1.4 },
    layer5Emphasis: {
      emphasizedPairs: [
        { planet1: 'venus', planet2: 'mars' },
        { planet1: 'venus', planet2: 'venus' },
        { planet1: 'mars', planet2: 'mars' },
      ],
    },
  },
  business: {
    layerWeights: { layer1: 1.0, layer2: 0.9, layer3: 1.1, layer4: 1.2, layer5: 1.2 },
    layer5Emphasis: {
      emphasizedPairs: [
        { planet1: 'mercury', planet2: 'mercury' },
        { planet1: 'saturn', planet2: 'saturn' },
        { planet1: 'jupiter', planet2: 'saturn' },
      ],
    },
  },
  family: {
    layerWeights: { layer1: 1.1, layer2: 1.0, layer3: 0.9, layer4: 1.0, layer5: 1.0 },
    layer5Emphasis: {
      emphasizedPairs: [
        { planet1: 'jupiter', planet2: 'jupiter' },
        { planet1: 'saturn', planet2: 'jupiter' },
      ],
    },
  },
  work: {
    layerWeights: { layer1: 0.9, layer2: 0.8, layer3: 1.2, layer4: 1.1, layer5: 1.0 },
    layer5Emphasis: {
      emphasizedPairs: [
        { planet1: 'mercury', planet2: 'mercury' },
        { planet1: 'mercury', planet2: 'saturn' },
      ],
    },
  },
  friendship: {
    layerWeights: { layer1: 1.0, layer2: 1.1, layer3: 1.0, layer4: 0.9, layer5: 1.0 },
    layer5Emphasis: {
      emphasizedPairs: [
        { planet1: 'mercury', planet2: 'venus' },
        { planet1: 'jupiter', planet2: 'venus' },
      ],
    },
  },
  universal: {
    layerWeights: { layer1: 1.0, layer2: 1.0, layer3: 1.0, layer4: 1.0, layer5: 1.0 },
    layer5Emphasis: { emphasizedPairs: [] },
  },
};

/**
 * "Marriage" as a distinct lens from "Love"/RelationshipContext's `marriage`
 * profile — not a RelationshipContext member (that type is also used by the
 * up-front form picker and stays at its current 6 values). Same Venus-Mars
 * attraction base as `marriage`, but weighted further toward Layer 4
 * (domicile rulers) — the ruler relationship is the classical marker of
 * whose rhythm a shared household orbits around, extending
 * computeLayer4DomicileRulers' own "unified rhythm" framing from a single
 * pairing into a longer-term-stability signal — and slightly down-weights
 * Layer 3 (modality), which speaks more to day-to-day initiating/adapting
 * style than to long-term commitment. Used only by the simplified result
 * screen's category grid (services/compatibility/simplifiedScore.ts) to
 * give "Love" and "Marriage" genuinely different numbers rather than always
 * matching the marriage RelationshipContext profile identically.
 */
export const MARRIAGE_LONG_TERM_WEIGHTS: WeightingProfile = {
  layerWeights: { layer1: 1.0, layer2: 1.0, layer3: 0.7, layer4: 1.3, layer5: 1.4 },
  layer5Emphasis: RELATIONSHIP_WEIGHTING_PROFILES.marriage.layer5Emphasis,
};

/**
 * Select which findings to highlight in copy for a given relationship
 * context. Does not compute or return an aggregate tier — callers must use
 * aspectEngine's aggregateTiers() for that, so weighting can never soften
 * the strict floor guarantee.
 */
export function selectEmphasizedFindings(
  layers: LayerResult[],
  layer5Pairs: Layer5PairResult[],
  context: RelationshipContext
): LayerResult[] {
  const profile = RELATIONSHIP_WEIGHTING_PROFILES[context];
  const emphasizedLayer5 = layer5Pairs
    .filter((pair) =>
      profile.layer5Emphasis.emphasizedPairs.some(
        (e) =>
          (e.planet1 === pair.planet1 && e.planet2 === pair.planet2) ||
          (e.planet1 === pair.planet2 && e.planet2 === pair.planet1)
      )
    )
    .map((pair) => pair.result);

  // Layers weighted above 1.0 for this context are surfaced first.
  const weightOrder: Array<keyof LayerWeights> = ['layer1', 'layer2', 'layer3', 'layer4', 'layer5'];
  const weightedLayers = weightOrder
    .map((key, idx) => ({ layer: layers[idx], weight: profile.layerWeights[key] }))
    .filter((entry) => entry.weight > 1.0)
    .sort((a, b) => b.weight - a.weight)
    .map((entry) => entry.layer);

  return [...weightedLayers, ...emphasizedLayer5];
}
