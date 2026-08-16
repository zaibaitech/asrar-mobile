/**
 * Simplified Score — Modern Display Layer Over the Whole-Sign Aspect Engine
 * =============================================================================
 * A deterministic DISPLAY TRANSFORM of the existing tier system
 * (services/compatibility/compatibilityTier.ts) — not a new scoring engine.
 * The tier stays ground truth throughout: every number and verdict here is a
 * pure function of an already-computed CompatibilityTier / LayerResult[],
 * never an independent calculation, never touching ephemeris data or async
 * work.
 *
 * Why a display transform and not a real percentage: a single calendar date
 * without an exact birth time/place cannot support percentage-level
 * precision — that's the entire reason this engine outputs a 3-tier result
 * (Saʿīd / Muʿtadil / Maḥdhūr) instead of a score in the first place. Modern
 * compatibility-app UI conventions still expect a headline number, so this
 * module derives one FROM the tier via a fixed score band per tier, with the
 * exact position inside the band set by how strongly the underlying layers
 * agree with that tier — the number can never leave its tier's band, so it
 * can never claim more precision than the tier itself already claims.
 *
 * @module simplifiedScore
 */

import type { LayerResult } from './aspectEngine';
import { aggregateTiers, tierRank, type CompatibilityTier } from './compatibilityTier';
import {
  MARRIAGE_LONG_TERM_WEIGHTS,
  RELATIONSHIP_WEIGHTING_PROFILES,
  type LayerWeights,
  type WeightingProfile,
} from './relationshipWeighting';
import type { RelationshipContext } from './soulConnectionMeanings';

// ============================================================================
// SCORE BANDS
// ============================================================================

export interface ScoreBand {
  min: number;
  max: number;
}

export const TIER_SCORE_BANDS: Record<CompatibilityTier, ScoreBand> = {
  saeed: { min: 70, max: 85 },
  mutadil: { min: 45, max: 69 },
  mahdhur: { min: 20, max: 44 },
};

/** Fixed priority order for picking/ranking layers when more candidates
 *  exist than slots (extractChallenges' cap-at-3) or fewer exist than
 *  required (backfill order). Layer 1 (whole-sign aspect) and Layer 5
 *  (cross-planet) are the most intuitive/legible signals to a lay reader;
 *  Layer 2 (element) and Layer 3 (modality) are the most "textbook" and
 *  least personally distinctive, so they rank last. */
const LAYER_PRIORITY: ReadonlyArray<1 | 2 | 3 | 4 | 5> = [1, 5, 4, 2, 3];

function priorityIndex(layer: 1 | 2 | 3 | 4 | 5): number {
  return LAYER_PRIORITY.indexOf(layer);
}

/** Average tierRank of a set of layers, normalized to 0..1 (0 = all
 *  mahdhur, 1 = all saeed). The single number both computeDisplayScore and
 *  computeVerdict derive from, so the two never disagree with each other. */
function averageRank(layers: LayerResult[]): number {
  if (layers.length === 0) return 0.5; // no data, no claim either way
  const sum = layers.reduce((acc, l) => acc + tierRank(l.tier), 0);
  return sum / (layers.length * 2); // tierRank is 0|1|2, so *2 normalizes to 0..1
}

/**
 * Deterministic 0-100 display score. `overallTier` selects the band —
 * fixed, non-overlapping, so the score can never leave the range its tier
 * already claims — and the layer-agreement mix sets the position inside
 * that band. Same input always produces the same output.
 */
export function computeDisplayScore(overallTier: CompatibilityTier, layers: LayerResult[]): number {
  const band = TIER_SCORE_BANDS[overallTier];
  const width = band.max - band.min;
  const avgRank = averageRank(layers);
  return Math.round(band.min + avgRank * width);
}

// ============================================================================
// VERDICT
// ============================================================================

export type Verdict = 'excellent' | 'good' | 'mixed' | 'challenging';

/** saeed splits into excellent/good at this avgRank threshold (0..1) —
 *  requires at least 4 of 5 layers to be 'saeed' to reach 'excellent'
 *  (4*2 + 1*1 = 9/10 = 0.9 >= 0.85; 3*2 + 2*1 = 8/10 = 0.8 < 0.85). */
const EXCELLENT_THRESHOLD = 0.85;

/**
 * Maps the 3-value tier to one of 4 verdict levels. mahdhur->'challenging'
 * and mutadil->'mixed' are unconditional 1:1 mappings, independent of the
 * layer mix — only 'saeed' splits, using the same avgRank computeDisplayScore
 * uses, so the verdict and the score are always mutually consistent.
 */
export function computeVerdict(overallTier: CompatibilityTier, layers: LayerResult[]): Verdict {
  if (overallTier === 'mahdhur') return 'challenging';
  if (overallTier === 'mutadil') return 'mixed';
  return averageRank(layers) >= EXCELLENT_THRESHOLD ? 'excellent' : 'good';
}

// ============================================================================
// PER-CONTEXT (CATEGORY) SCORING
// ============================================================================

const WEIGHT_KEYS: ReadonlyArray<keyof LayerWeights> = ['layer1', 'layer2', 'layer3', 'layer4', 'layer5'];

export interface ContextScoreResult {
  tier: CompatibilityTier;
  score: number;
  verdict: Verdict;
}

function weightedAverageRank(layers: LayerResult[], profile: WeightingProfile): number {
  const weightedSum = layers.reduce((sum, l, idx) => {
    const weight = profile.layerWeights[WEIGHT_KEYS[idx]] ?? 1;
    return sum + tierRank(l.tier) * weight;
  }, 0);
  const totalWeight = WEIGHT_KEYS.reduce((sum, key) => sum + (profile.layerWeights[key] ?? 1), 0);
  return totalWeight > 0 ? weightedSum / (totalWeight * 2) : averageRank(layers);
}

/**
 * Weighted per-context tier/score/verdict, from the SAME already-computed
 * layers used for the unweighted overallTier — no re-derivation of sign or
 * planet data. Weighting can shift a layer's influence on the internal
 * average, but a 'mahdhur' layer still pulls the weighted average down
 * (weight multiplies its contribution, never excludes it). The result is
 * additionally clamped to never report more favourable than the strict-floor
 * overallTier, carrying that same "aggregate never exceeds its worst
 * component" guarantee into every per-context view.
 *
 * The score is positioned within its (possibly clamped) tier's band using
 * the WEIGHTED rank, not the plain unweighted one — otherwise two contexts
 * that both clamp down to the same floor tier (a common case whenever one
 * layer is genuinely weak) would always report byte-identical scores,
 * silently defeating the point of having separate categories. The weighted
 * rank is itself clamped into the tier's own 0..1 sub-range first, so the
 * score can still never leave the tier's fixed band.
 */
export function computeWeightedContextScore(
  layers: LayerResult[],
  profile: WeightingProfile
): ContextScoreResult {
  const overallTier = aggregateTiers(layers.map((l) => l.tier));
  const weightedAvgRank = weightedAverageRank(layers, profile);

  const rawTier: CompatibilityTier =
    weightedAvgRank >= 0.75 ? 'saeed' : weightedAvgRank >= 0.375 ? 'mutadil' : 'mahdhur';

  // Clamp: never more favourable than the unweighted strict floor.
  const tier: CompatibilityTier = tierRank(rawTier) > tierRank(overallTier) ? overallTier : rawTier;

  // Position the score within the clamped tier's band. When the clamp
  // didn't change anything (rawTier === tier), weightedAvgRank already sits
  // inside that tier's own 0..1 sub-range, so a plain rescale positions it
  // correctly. When the clamp DID fire (a context's up-weighting pushed it
  // into a more favourable tier than the strict floor allows), rescaling
  // against the ORIGINAL tier's range that weightedAvgRank actually landed
  // in — not the clamped-down tier's range — preserves how far above the
  // floor the weighting pushed it, positioning nearer the top of the lower
  // band for a stronger weighted showing and nearer the bottom for a
  // weaker one. This is what keeps two contexts that both clamp to the same
  // floor tier from becoming byte-identical.
  const TIER_RANK_RANGES: Record<CompatibilityTier, [number, number]> = {
    mahdhur: [0, 0.375],
    mutadil: [0.375, 0.75],
    saeed: [0.75, 1],
  };
  const sourceRange = TIER_RANK_RANGES[rawTier];
  const clampedRank = Math.min(sourceRange[1], Math.max(sourceRange[0], weightedAvgRank));
  const positionInTier = sourceRange[1] > sourceRange[0]
    ? (clampedRank - sourceRange[0]) / (sourceRange[1] - sourceRange[0])
    : 0.5;

  const band = TIER_SCORE_BANDS[tier];
  const score = Math.round(band.min + positionInTier * (band.max - band.min));

  return {
    tier,
    score,
    verdict: computeVerdict(tier, layers),
  };
}

/**
 * Convenience wrapper for the 6 existing RelationshipContext values,
 * reusing RELATIONSHIP_WEIGHTING_PROFILES directly.
 */
export function computeContextScore(
  layers: LayerResult[],
  context: RelationshipContext
): ContextScoreResult {
  return computeWeightedContextScore(layers, RELATIONSHIP_WEIGHTING_PROFILES[context]);
}

/** The 4 categories shown on the simplified result screen. 'love' and
 *  'marriage' both derive from marriage-flavored weighting (Venus-Mars is
 *  the classical romantic-attraction signal) but through genuinely
 *  different profiles — see MARRIAGE_LONG_TERM_WEIGHTS' doc comment in
 *  relationshipWeighting.ts for the rationale — so the two rows report
 *  different numbers rather than always matching. */
export type SimplifiedCategory = 'love' | 'marriage' | 'friendship' | 'business';

const CATEGORY_PROFILES: Record<SimplifiedCategory, WeightingProfile> = {
  love: RELATIONSHIP_WEIGHTING_PROFILES.marriage,
  marriage: MARRIAGE_LONG_TERM_WEIGHTS,
  friendship: RELATIONSHIP_WEIGHTING_PROFILES.friendship,
  business: RELATIONSHIP_WEIGHTING_PROFILES.business,
};

export function computeCategoryScore(
  layers: LayerResult[],
  category: SimplifiedCategory
): ContextScoreResult {
  return computeWeightedContextScore(layers, CATEGORY_PROFILES[category]);
}

// ============================================================================
// STRENGTHS / CHALLENGES EXTRACTION
// ============================================================================

export interface FindingCard {
  layer: 1 | 2 | 3 | 4 | 5;
  tier: CompatibilityTier;
  /** Translation key for a short plain-language sentence — distinct from
   *  LayerResult.detailKey, which points at the jargon-heavy Advanced
   *  Analysis copy. */
  copyKey: string;
}

function sortedByPriority(layers: LayerResult[]): LayerResult[] {
  return [...layers].sort((a, b) => priorityIndex(a.layer) - priorityIndex(b.layer));
}

/**
 * Always returns exactly 3 strengths. Primary source: 'saeed' layers, in
 * LAYER_PRIORITY order. Backfilled with 'mutadil' layers, then (only in the
 * extreme all-mahdhur case) 'mahdhur' layers under a distinct "growth area"
 * copy variant — so the UI invariant of exactly 3 cards holds even in the
 * worst-case input, without ever claiming a mahdhur layer is a strength
 * outright.
 */
export function extractStrengths(layers: LayerResult[]): FindingCard[] {
  const ordered = sortedByPriority(layers);
  const cards: FindingCard[] = [];

  for (const tier of ['saeed', 'mutadil'] as const) {
    for (const l of ordered) {
      if (cards.length >= 3) break;
      if (l.tier === tier) {
        cards.push({ layer: l.layer, tier: l.tier, copyKey: `compatibility.results.zodiac.simplified.strengths.layer${l.layer}.${tier}` });
      }
    }
  }

  if (cards.length < 3) {
    for (const l of ordered) {
      if (cards.length >= 3) break;
      if (l.tier === 'mahdhur') {
        cards.push({ layer: l.layer, tier: l.tier, copyKey: `compatibility.results.zodiac.simplified.strengths.layer${l.layer}.mahdhurGrowth` });
      }
    }
  }

  return cards;
}

/**
 * Always returns 2 or 3 challenges. Primary source: 'mahdhur' layers, in
 * LAYER_PRIORITY order (capped at 3 if more exist). If fewer than 2
 * 'mahdhur' layers exist, relaxes to the weakest 'mutadil' layers (same
 * priority order) until 2 is reached. In the extreme all-saeed case (no
 * mahdhur or mutadil layers at all), backfills with the lowest-priority
 * 'saeed' layers under a distinct "keep nurturing" copy variant — never
 * framed as a real weakness, but the UI invariant of at least 2 challenge
 * cards holds even for a pairing with no weak layers at all.
 */
export function extractChallenges(layers: LayerResult[]): FindingCard[] {
  const ordered = sortedByPriority(layers);
  const cards: FindingCard[] = [];

  for (const l of ordered) {
    if (cards.length >= 3) break;
    if (l.tier === 'mahdhur') {
      cards.push({ layer: l.layer, tier: l.tier, copyKey: `compatibility.results.zodiac.simplified.challenges.layer${l.layer}.mahdhur` });
    }
  }

  if (cards.length < 2) {
    for (const l of ordered) {
      if (cards.length >= 2) break;
      if (l.tier === 'mutadil') {
        cards.push({ layer: l.layer, tier: l.tier, copyKey: `compatibility.results.zodiac.simplified.challenges.layer${l.layer}.mutadil` });
      }
    }
  }

  if (cards.length < 2) {
    // Reverse priority order — pick from the LEAST-prioritized saeed layers
    // first (layer 3 and 2 modality/element, the least personally
    // distinctive), reserving layer 1/5/4 for genuine weak-layer cases.
    for (const l of [...ordered].reverse()) {
      if (cards.length >= 2) break;
      if (l.tier === 'saeed') {
        cards.push({ layer: l.layer, tier: l.tier, copyKey: `compatibility.results.zodiac.simplified.challenges.layer${l.layer}.saeedNurture` });
      }
    }
  }

  return cards;
}

// ============================================================================
// ADVICE
// ============================================================================

/**
 * 1 or 2 translation keys, never fewer or more. The base sentence (1 key) is
 * always present, chosen by verdict. If the weakest layer (by
 * LAYER_PRIORITY order among ties) is not already 'saeed', a second,
 * layer-specific tip key is appended.
 */
export function selectAdviceKeys(overallTier: CompatibilityTier, layers: LayerResult[]): string[] {
  const verdict = computeVerdict(overallTier, layers);
  const keys = [`compatibility.results.zodiac.simplified.advice.${verdict}`];

  const ordered = sortedByPriority(layers);
  let weakest: LayerResult | undefined;
  for (const l of ordered) {
    if (!weakest || tierRank(l.tier) < tierRank(weakest.tier)) {
      weakest = l;
    }
  }

  if (weakest && weakest.tier !== 'saeed') {
    keys.push(`compatibility.results.zodiac.simplified.advice.layerTip.layer${weakest.layer}`);
  }

  return keys;
}
