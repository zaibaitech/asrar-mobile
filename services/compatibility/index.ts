/**
 * Compatibility Services - Index
 * Export all compatibility calculation functions
 */

// Core types
export * from './types';

// Core engine
export {
    analyzeElementalRelationship, analyzePlanetaryResonance, analyzeZahirBatinInteraction, buildCompatibilityEvaluation,
    calculatePersonPersonCompatibility, calculateResonanceScore, determineModeOfAction, extractSpiritualDestiny, generateGuidanceSummary
} from './engine';

// Divine Name compatibility
export {
    calculateDivineNameIntentionCompatibility, calculatePersonDivineNameCompatibility
} from './divineNameCompatibility';

// Divine Names data
export {
    DIVINE_NAMES_COMPATIBILITY, getAllCompatibilityDivineNames, getDivineNameByNumber,
    getDivineNamesByIntention
} from './divineNamesData';

