/**
 * Asrār Compatibility Engine - Type Definitions
 * Universal resonance comparison system based on ʿIlm al-Asrār
 */

import { RelationshipCompatibility, SpiritualDestinyResult } from '../../types/compatibility';

// ============================================================================
// COMPATIBILITY TYPES
// ============================================================================

export type CompatibilityType = 
  | 'person-person'      // Universal (marriage, friendship, family, work)
  | 'person-divine-name' // Core feature - person's resonance with Divine Name
  | 'divine-intention';  // Guidance only - matching Name to intention

// ============================================================================
// RESONANCE COMPARISON LAYERS
// ============================================================================

export type ElementalRelationship = 
  | 'supportive'    // Elements enhance each other
  | 'neutral'       // Elements coexist peacefully
  | 'opposing'      // Elements create tension
  | 'transformative'; // Elements challenge for growth

export type ZahirBatinInteraction =
  | 'dominance'   // One orientation dominates
  | 'balance'     // Equal expression
  | 'reflection'; // Mirror dynamics

export type PlanetaryResonance =
  | 'harmonious'     // Planets work together
  | 'tense'          // Planets create friction
  | 'developmental'; // Planets push growth

export type ModeOfAction =
  | 'fast'      // Fire/Air - quick manifestation
  | 'gradual'   // Earth - steady building
  | 'hidden';   // Water - inward/subtle

// ============================================================================
// SPIRITUAL DESTINY OUTPUT (FROM EXISTING SYSTEM)
// ============================================================================

export interface SpiritualDestinyData {
  element: 'fire' | 'water' | 'air' | 'earth';
  planet: string;
  zahirBatin: 'zahir' | 'batin' | 'balanced';
  saghir: number; // Digital root (1-9)
  kabir: number;  // Total Abjad value
  burj: {
    en: string;
    ar: string;
  };
}

// ============================================================================
// DIVINE NAME METADATA (ENHANCED)
// ============================================================================

export interface DivineNameMetadata {
  number: number;
  arabic: string;
  transliteration: string;
  abjadValue: number;
  element: 'fire' | 'water' | 'air' | 'earth';
  planet: string;
  modeOfAction: ModeOfAction;
  classicalFunction: IntentionCategory[]; // What this Name is traditionally used for
  meaning: {
    en: string;
    ar: string;
  };
  spiritualInfluence: {
    en: string;
    ar: string;
  };
}

// ============================================================================
// INTENTION CATEGORIES
// ============================================================================

export type IntentionCategory =
  | 'clarity'      // Al-Mubīn, Al-Ḥakīm
  | 'patience'     // Aṣ-Ṣabūr, Al-Ḥalīm
  | 'provision'    // Ar-Razzāq, Al-Fattāḥ
  | 'healing'      // Ash-Shāfī, Al-Mu'āfī
  | 'protection'   // Al-Ḥafīẓ, Al-Wakīl
  | 'guidance'     // Al-Hādī, Ar-Rashīd
  | 'strength'     // Al-Qawī, Al-'Azīz
  | 'peace'        // As-Salām, Al-Mu'min
  | 'knowledge'    // Al-'Alīm, Al-Khabīr
  | 'forgiveness'; // Al-Ghafūr, At-Tawwāb

// ============================================================================
// COMPATIBILITY EVALUATION RESULT
// ============================================================================

export interface CompatibilityEvaluation {
  // Elemental Relationship
  elementalRelationship: {
    type: ElementalRelationship;
    explanation: {
      en: string;
      ar: string;
    };
  };

  // Zāhir-Bāṭin Interaction
  zahirBatinInteraction: {
    type: ZahirBatinInteraction;
    explanation: {
      en: string;
      ar: string;
    };
  };

  // Planetary Resonance
  planetaryResonance: {
    type: PlanetaryResonance;
    explanation: {
      en: string;
      ar: string;
    };
  };

  // Mode of Action (how this resonance manifests)
  modeOfAction: {
    type: ModeOfAction;
    explanation: {
      en: string;
      ar: string;
    };
  };

  // Guidance Summary
  guidance: {
    whatFlowsEasily: { en: string; ar: string };
    whatRequiresPatience: { en: string; ar: string };
    whatToAvoidForcing: { en: string; ar: string };
  };

  // Overall resonance score (reflection only, not predictive)
  resonanceScore: number; // 0-100 (for visualization, not fortune-telling)
  
  // Disclaimer
  disclaimer: {
    en: string;
    ar: string;
  };
}

// ============================================================================
// PERSON ↔ PERSON COMPATIBILITY
// ============================================================================

export interface PersonPersonCompatibility {
  type: 'person-person';
  relationshipContext: 'marriage' | 'friendship' | 'family' | 'work' | 'universal';
  
  person1: {
    name: string;
    arabicName: string;
    destiny: SpiritualDestinyData;
  };
  
  person2: {
    name: string;
    arabicName: string;
    destiny: SpiritualDestinyData;
  };
  
  evaluation: CompatibilityEvaluation;
  
  // AUTHENTIC 4-METHOD COMPATIBILITY ANALYSIS
  relationshipCompatibility: RelationshipCompatibility;
}

// ============================================================================
// PERSON ↔ DIVINE NAME COMPATIBILITY
// ============================================================================

export interface PersonDivineNameCompatibility {
  type: 'person-divine-name';
  
  person: {
    name: string;
    arabicName: string;
    destiny: SpiritualDestinyData;
  };
  
  divineName: DivineNameMetadata;
  
  evaluation: CompatibilityEvaluation;
  
  // Spiritual Destiny (mod-9) - PRIMARY compatibility metric
  spiritualDestiny: SpiritualDestinyResult;
  
  // How the Name acts upon the person
  nameAction: {
    effect: 'strengthens' | 'stabilizes' | 'tempers' | 'challenges';
    personElement: 'fire' | 'water' | 'air' | 'earth';
    nameElement: 'fire' | 'water' | 'air' | 'earth';
  };
  
  // Why results may vary
  manifestationGuidance: {
    speed: 'fast' | 'delayed' | 'subtle';
    personElement: 'fire' | 'water' | 'air' | 'earth';
    modeOfAction: 'fast' | 'gradual' | 'hidden';
  };
}

// ============================================================================
// DIVINE NAME ↔ INTENTION COMPATIBILITY
// ============================================================================

export interface DivineNameIntentionCompatibility {
  type: 'divine-intention';
  
  divineName: DivineNameMetadata;
  intention: IntentionCategory;
  
  alignment: 'optimal' | 'suitable' | 'neutral' | 'not-recommended';
  
  guidance: {
    en: string;
    ar: string;
  };
  
  alternativeSuggestions?: DivineNameMetadata[]; // If not optimal
}

// ============================================================================
// UNIVERSAL COMPATIBILITY RESULT (UNION TYPE)
// ============================================================================

export type UniversalCompatibilityResult =
  | PersonPersonCompatibility
  | PersonDivineNameCompatibility
  | DivineNameIntentionCompatibility;
