/**
 * Whole-Sign Aspect Engine — DOB Compatibility, Layers 1-5
 * ============================================================
 * Classical whole-sign (naẓar) comparison between two birth dates' zodiac
 * signs and non-lunar planet positions. Pure functions, no I/O — callers
 * resolve sign data first (via ProfileDerivationService's ingress-aware
 * resolver and services/compatibility/planetaryPositionsForCompatibility.ts)
 * and pass it in here.
 *
 * Deliberately excludes: the Moon (its ~13°/day motion makes a sign placement
 * from a date alone unreliable), the Ascendant, houses, and any Arabic Part —
 * none of these can be derived from a date without a birth time and place.
 *
 * @module aspectEngine
 */

import { ESSENTIAL_DIGNITIES } from '../PlanetaryStrengthService';
import type { Planet } from '../PlanetaryHoursService';
import { analyzePlanetaryResonance } from './engine';
import { aggregateTiers, type CompatibilityTier } from './compatibilityTier';

// ============================================================================
// TYPES
// ============================================================================

export type ZodiacSignName =
  | 'aries' | 'taurus' | 'gemini' | 'cancer' | 'leo' | 'virgo'
  | 'libra' | 'scorpio' | 'sagittarius' | 'capricorn' | 'aquarius' | 'pisces';

export type NazarType = 'conjunction' | 'sextile' | 'square' | 'trine' | 'opposition' | 'aversion';

export type AspectPlanetId = 'venus' | 'mars' | 'mercury' | 'jupiter' | 'saturn';

export interface LayerResult {
  layer: 1 | 2 | 3 | 4 | 5;
  tier: CompatibilityTier;
  detailKey: string;
  metadata?: Record<string, string | number>;
}

export interface PersonPlanetSigns {
  sun: ZodiacSignName;
  venus: ZodiacSignName;
  mars: ZodiacSignName;
  mercury: ZodiacSignName;
  jupiter: ZodiacSignName;
  saturn: ZodiacSignName;
}

// ============================================================================
// SIGN ORDER / STATIC CLASSICAL TABLES
// ============================================================================

const SIGN_ORDER: ZodiacSignName[] = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces',
];

const SIGN_ELEMENT: Record<ZodiacSignName, 'fire' | 'earth' | 'air' | 'water'> = {
  aries: 'fire', leo: 'fire', sagittarius: 'fire',
  taurus: 'earth', virgo: 'earth', capricorn: 'earth',
  gemini: 'air', libra: 'air', aquarius: 'air',
  cancer: 'water', scorpio: 'water', pisces: 'water',
};

const SIGN_MODALITY: Record<ZodiacSignName, 'cardinal' | 'fixed' | 'mutable'> = {
  aries: 'cardinal', cancer: 'cardinal', libra: 'cardinal', capricorn: 'cardinal',
  taurus: 'fixed', leo: 'fixed', scorpio: 'fixed', aquarius: 'fixed',
  gemini: 'mutable', virgo: 'mutable', sagittarius: 'mutable', pisces: 'mutable',
};

/** Sign -> domicile ruler(s), derived from PlanetaryStrengthService's
 *  ESSENTIAL_DIGNITIES (single source of truth for classical rulerships —
 *  not re-declared here). */
const SIGN_TO_RULER: Record<ZodiacSignName, Planet> = (() => {
  const map = {} as Record<ZodiacSignName, Planet>;
  (Object.keys(ESSENTIAL_DIGNITIES) as Planet[]).forEach((planet) => {
    for (const sign of ESSENTIAL_DIGNITIES[planet].own) {
      map[sign as ZodiacSignName] = planet;
    }
  });
  return map;
})();

// ============================================================================
// LAYER 1 — WHOLE-SIGN ASPECT (NAẒAR)
// ============================================================================

/**
 * Inclusive sign-counting distance from sign1 to sign2 (1-12). Distance 1 is
 * "same sign" (both signs are the same); distance 7 is directly opposite.
 */
function signDistance(sign1: ZodiacSignName, sign2: ZodiacSignName): number {
  const i1 = SIGN_ORDER.indexOf(sign1);
  const i2 = SIGN_ORDER.indexOf(sign2);
  const raw = Math.abs(i1 - i2);
  const circular = Math.min(raw, 12 - raw);
  return circular + 1; // 1-7 inclusive counting
}

/**
 * signDistance() already collapses the two counting directions (e.g. 3rd
 * and 11th are both circular distance 3) into a single 1-7 value, so each
 * classical relationship maps to exactly one case here.
 */
function nazarTypeForDistance(distance: number): NazarType {
  switch (distance) {
    case 1: return 'conjunction';       // same sign
    case 3: return 'sextile';           // 3rd/11th
    case 4: return 'square';            // 4th/10th
    case 5: return 'trine';             // 5th/9th
    case 7: return 'opposition';        // 7th
    case 2: case 6: return 'aversion';  // 2nd/12th and 6th/8th — "does not see"
    default: return 'aversion';
  }
}

/** Same-sign (conjunction) is classically ittiṣāl — ambivalent/intensifying,
 *  never the maximum-harmony reading. Aversion (2nd/6th/8th/12th) is "mutual
 *  blindness" — distinct from conflict, not merged into square/opposition. */
function tierForNazar(nazar: NazarType): CompatibilityTier {
  switch (nazar) {
    case 'trine': return 'saeed';
    case 'sextile': return 'saeed';
    case 'conjunction': return 'mutadil'; // ittiṣāl: intensifies both strength and weakness
    case 'square': return 'mahdhur';
    case 'opposition': return 'mutadil'; // polarity — complementary or antagonistic, not purely bad
    case 'aversion': return 'mahdhur'; // signs do not see each other at all
  }
}

export function computeLayer1WholeSignAspect(sign1: ZodiacSignName, sign2: ZodiacSignName): LayerResult {
  const distance = signDistance(sign1, sign2);
  const nazar = nazarTypeForDistance(distance);
  return {
    layer: 1,
    tier: tierForNazar(nazar),
    detailKey: `compatibility.results.zodiac.aspectEngine.layer1.${nazar}`,
    metadata: { sign1, sign2, distance, nazar },
  };
}

// ============================================================================
// LAYER 2 — TRIPLICITY / ELEMENT
// ============================================================================

const ELEMENT_AGREEMENT: Record<string, 'agree' | 'contrary' | 'neutral'> = {
  'fire-air': 'agree', 'air-fire': 'agree',
  'earth-water': 'agree', 'water-earth': 'agree',
  'fire-water': 'contrary', 'water-fire': 'contrary',
  'air-earth': 'contrary', 'earth-air': 'contrary',
};

export function computeLayer2Triplicity(sign1: ZodiacSignName, sign2: ZodiacSignName): LayerResult {
  const el1 = SIGN_ELEMENT[sign1];
  const el2 = SIGN_ELEMENT[sign2];

  let relation: 'agree' | 'contrary' | 'neutral';
  let tier: CompatibilityTier;
  if (el1 === el2) {
    relation = 'agree';
    tier = 'saeed';
  } else {
    relation = ELEMENT_AGREEMENT[`${el1}-${el2}`] ?? 'neutral';
    tier = relation === 'agree' ? 'saeed' : relation === 'contrary' ? 'mahdhur' : 'mutadil';
  }

  return {
    layer: 2,
    tier,
    detailKey: `compatibility.results.zodiac.aspectEngine.layer2.${relation}`,
    metadata: { element1: el1, element2: el2 },
  };
}

// ============================================================================
// LAYER 3 — MODALITY
// ============================================================================

export function computeLayer3Modality(sign1: ZodiacSignName, sign2: ZodiacSignName): LayerResult {
  const mod1 = SIGN_MODALITY[sign1];
  const mod2 = SIGN_MODALITY[sign2];
  const same = mod1 === mod2;

  // Two cardinals contend for lead, two fixed entrench, two mutable lack
  // anchor — same modality is mixed, not automatically favourable. Different
  // modality (one initiates, one sustains, etc.) reads as complementary.
  const tier: CompatibilityTier = same ? 'mutadil' : 'saeed';

  return {
    layer: 3,
    tier,
    detailKey: `compatibility.results.zodiac.aspectEngine.layer3.${same ? 'sameModality' : 'different'}`,
    metadata: { modality1: mod1, modality2: mod2 },
  };
}

// ============================================================================
// LAYER 4 — DOMICILE RULERS
// ============================================================================

export function computeLayer4DomicileRulers(sign1: ZodiacSignName, sign2: ZodiacSignName): LayerResult {
  const ruler1 = SIGN_TO_RULER[sign1];
  const ruler2 = SIGN_TO_RULER[sign2];

  if (ruler1 === ruler2) {
    // Same ruler = unified rhythm AND shared weakness — deliberately not
    // upgraded to the same purely-positive "harmonious" framing
    // analyzePlanetaryResonance() gives same-planet pairs elsewhere in this
    // file (that copy is fine for the abjad path; the whole-sign engine
    // states the double-edge explicitly instead, matching the same-sign
    // ittiṣāl treatment in Layer 1).
    return {
      layer: 4,
      tier: 'mutadil',
      detailKey: 'compatibility.results.zodiac.aspectEngine.layer4.same',
      metadata: { ruler1, ruler2 },
    };
  }

  const resonance = analyzePlanetaryResonance(ruler1, ruler2);
  const tier: CompatibilityTier =
    resonance.type === 'harmonious' ? 'saeed' :
    resonance.type === 'tense' ? 'mahdhur' :
    'mutadil'; // developmental

  return {
    layer: 4,
    tier,
    detailKey: `compatibility.results.zodiac.aspectEngine.layer4.${resonance.type}`,
    metadata: { ruler1, ruler2 },
  };
}

// ============================================================================
// LAYER 5 — CROSS-PLANET WHOLE-SIGN ASPECTS
// ============================================================================

const ASPECT_PLANETS: AspectPlanetId[] = ['venus', 'mars', 'mercury', 'jupiter', 'saturn'];

export interface Layer5PairResult {
  planet1: AspectPlanetId;
  planet2: AspectPlanetId;
  result: LayerResult;
}

export function computeLayer5CrossPlanetAspects(
  person1Planets: PersonPlanetSigns,
  person2Planets: PersonPlanetSigns
): { pairResults: Layer5PairResult[]; layer: LayerResult } {
  const pairResults: Layer5PairResult[] = [];

  for (const p1 of ASPECT_PLANETS) {
    for (const p2 of ASPECT_PLANETS) {
      const sign1 = person1Planets[p1];
      const sign2 = person2Planets[p2];
      const aspect = computeLayer1WholeSignAspect(sign1, sign2);
      pairResults.push({
        planet1: p1,
        planet2: p2,
        result: { ...aspect, layer: 5, detailKey: aspect.detailKey.replace('layer1', 'layer5') },
      });
    }
  }

  const aggregate = aggregateTiers(pairResults.map((p) => p.result.tier));

  return {
    pairResults,
    layer: {
      layer: 5,
      tier: aggregate,
      detailKey: 'compatibility.results.zodiac.aspectEngine.layer5.title',
    },
  };
}

export { aggregateTiers };
