/**
 * Soul Connection Meanings by Relationship Context
 * Provides context-specific interpretations for Soul Connection numbers 1-9
 * across different relationship types (universal, friendship, family, work)
 * 
 * Marriage context uses existing archetype system (soulArchetypes.ts)
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type RelationshipContext = 'universal' | 'marriage' | 'friendship' | 'family' | 'work';
export type SoulNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type Intensity = 'positive' | 'mixed' | 'challenging';

/**
 * Meaning block for a specific context
 * All fields are translation keys
 */
export interface SoulMeaningBlock {
  /** Short label (4-7 words) - shown under the number */
  shortLabelKey: string;
  /** Core meaning paragraph (2-3 lines) */
  meaningKey: string;
  /** Warning/caution paragraph (2-3 lines) */
  watchOutKey: string;
  /** Advice paragraph (2-3 lines) */
  keyToSuccessKey: string;
  /** Visual indicator for the overall tone */
  intensity: Intensity;
}

/**
 * Entry for a single Soul Number across all contexts
 */
export interface SoulMeaningEntry {
  /** Optional archetype title (e.g., "The Harmonious Bond") */
  archetypeTitleKey?: string;
  /** Meanings organized by relationship context */
  contexts: Partial<Record<RelationshipContext, SoulMeaningBlock>>;
}

// ============================================================================
// SOUL CONNECTION MEANINGS DATA
// ============================================================================

/**
 * Complete meanings for all 9 soul numbers across all contexts
 * 
 * Note: Marriage context uses existing keys from soulArchetypes.ts
 * Other contexts have new translation keys in the pattern:
 * compatibility.soul.meanings.{context}.{number}.{field}
 */
export const SOUL_CONNECTION_MEANINGS: Record<SoulNumber, SoulMeaningEntry> = {
  1: {
    archetypeTitleKey: 'compatibility.soul.archetypes.1.title',
    contexts: {
      marriage: {
        shortLabelKey: 'compatibility.soul.archetypes.1.oneLine',
        meaningKey: 'compatibility.soul.archetypes.1.meaning',
        watchOutKey: 'compatibility.soul.archetypes.1.watchOut',
        keyToSuccessKey: 'compatibility.soul.archetypes.1.keyToSuccess',
        intensity: 'mixed',
      },
      universal: {
        shortLabelKey: 'compatibility.soul.meanings.universal.1.short',
        meaningKey: 'compatibility.soul.meanings.universal.1.meaning',
        watchOutKey: 'compatibility.soul.meanings.universal.1.watchOut',
        keyToSuccessKey: 'compatibility.soul.meanings.universal.1.keyToSuccess',
        intensity: 'mixed',
      },
      friendship: {
        shortLabelKey: 'compatibility.soul.meanings.friendship.1.short',
        meaningKey: 'compatibility.soul.meanings.friendship.1.meaning',
        watchOutKey: 'compatibility.soul.meanings.friendship.1.watchOut',
        keyToSuccessKey: 'compatibility.soul.meanings.friendship.1.keyToSuccess',
        intensity: 'mixed',
      },
      family: {
        shortLabelKey: 'compatibility.soul.meanings.family.1.short',
        meaningKey: 'compatibility.soul.meanings.family.1.meaning',
        watchOutKey: 'compatibility.soul.meanings.family.1.watchOut',
        keyToSuccessKey: 'compatibility.soul.meanings.family.1.keyToSuccess',
        intensity: 'mixed',
      },
      work: {
        shortLabelKey: 'compatibility.soul.meanings.work.1.short',
        meaningKey: 'compatibility.soul.meanings.work.1.meaning',
        watchOutKey: 'compatibility.soul.meanings.work.1.watchOut',
        keyToSuccessKey: 'compatibility.soul.meanings.work.1.keyToSuccess',
        intensity: 'mixed',
      },
    },
  },
  2: {
    archetypeTitleKey: 'compatibility.soul.archetypes.2.title',
    contexts: {
      marriage: {
        shortLabelKey: 'compatibility.soul.archetypes.2.oneLine',
        meaningKey: 'compatibility.soul.archetypes.2.meaning',
        watchOutKey: 'compatibility.soul.archetypes.2.watchOut',
        keyToSuccessKey: 'compatibility.soul.archetypes.2.keyToSuccess',
        intensity: 'positive',
      },
      universal: {
        shortLabelKey: 'compatibility.soul.meanings.universal.2.short',
        meaningKey: 'compatibility.soul.meanings.universal.2.meaning',
        watchOutKey: 'compatibility.soul.meanings.universal.2.watchOut',
        keyToSuccessKey: 'compatibility.soul.meanings.universal.2.keyToSuccess',
        intensity: 'positive',
      },
      friendship: {
        shortLabelKey: 'compatibility.soul.meanings.friendship.2.short',
        meaningKey: 'compatibility.soul.meanings.friendship.2.meaning',
        watchOutKey: 'compatibility.soul.meanings.friendship.2.watchOut',
        keyToSuccessKey: 'compatibility.soul.meanings.friendship.2.keyToSuccess',
        intensity: 'positive',
      },
      family: {
        shortLabelKey: 'compatibility.soul.meanings.family.2.short',
        meaningKey: 'compatibility.soul.meanings.family.2.meaning',
        watchOutKey: 'compatibility.soul.meanings.family.2.watchOut',
        keyToSuccessKey: 'compatibility.soul.meanings.family.2.keyToSuccess',
        intensity: 'positive',
      },
      work: {
        shortLabelKey: 'compatibility.soul.meanings.work.2.short',
        meaningKey: 'compatibility.soul.meanings.work.2.meaning',
        watchOutKey: 'compatibility.soul.meanings.work.2.watchOut',
        keyToSuccessKey: 'compatibility.soul.meanings.work.2.keyToSuccess',
        intensity: 'positive',
      },
    },
  },
  3: {
    archetypeTitleKey: 'compatibility.soul.archetypes.3.title',
    contexts: {
      marriage: {
        shortLabelKey: 'compatibility.soul.archetypes.3.oneLine',
        meaningKey: 'compatibility.soul.archetypes.3.meaning',
        watchOutKey: 'compatibility.soul.archetypes.3.watchOut',
        keyToSuccessKey: 'compatibility.soul.archetypes.3.keyToSuccess',
        intensity: 'challenging',
      },
      universal: {
        shortLabelKey: 'compatibility.soul.meanings.universal.3.short',
        meaningKey: 'compatibility.soul.meanings.universal.3.meaning',
        watchOutKey: 'compatibility.soul.meanings.universal.3.watchOut',
        keyToSuccessKey: 'compatibility.soul.meanings.universal.3.keyToSuccess',
        intensity: 'challenging',
      },
      friendship: {
        shortLabelKey: 'compatibility.soul.meanings.friendship.3.short',
        meaningKey: 'compatibility.soul.meanings.friendship.3.meaning',
        watchOutKey: 'compatibility.soul.meanings.friendship.3.watchOut',
        keyToSuccessKey: 'compatibility.soul.meanings.friendship.3.keyToSuccess',
        intensity: 'challenging',
      },
      family: {
        shortLabelKey: 'compatibility.soul.meanings.family.3.short',
        meaningKey: 'compatibility.soul.meanings.family.3.meaning',
        watchOutKey: 'compatibility.soul.meanings.family.3.watchOut',
        keyToSuccessKey: 'compatibility.soul.meanings.family.3.keyToSuccess',
        intensity: 'challenging',
      },
      work: {
        shortLabelKey: 'compatibility.soul.meanings.work.3.short',
        meaningKey: 'compatibility.soul.meanings.work.3.meaning',
        watchOutKey: 'compatibility.soul.meanings.work.3.watchOut',
        keyToSuccessKey: 'compatibility.soul.meanings.work.3.keyToSuccess',
        intensity: 'challenging',
      },
    },
  },
  4: {
    archetypeTitleKey: 'compatibility.soul.archetypes.4.title',
    contexts: {
      marriage: {
        shortLabelKey: 'compatibility.soul.archetypes.4.oneLine',
        meaningKey: 'compatibility.soul.archetypes.4.meaning',
        watchOutKey: 'compatibility.soul.archetypes.4.watchOut',
        keyToSuccessKey: 'compatibility.soul.archetypes.4.keyToSuccess',
        intensity: 'challenging',
      },
      universal: {
        shortLabelKey: 'compatibility.soul.meanings.universal.4.short',
        meaningKey: 'compatibility.soul.meanings.universal.4.meaning',
        watchOutKey: 'compatibility.soul.meanings.universal.4.watchOut',
        keyToSuccessKey: 'compatibility.soul.meanings.universal.4.keyToSuccess',
        intensity: 'challenging',
      },
      friendship: {
        shortLabelKey: 'compatibility.soul.meanings.friendship.4.short',
        meaningKey: 'compatibility.soul.meanings.friendship.4.meaning',
        watchOutKey: 'compatibility.soul.meanings.friendship.4.watchOut',
        keyToSuccessKey: 'compatibility.soul.meanings.friendship.4.keyToSuccess',
        intensity: 'challenging',
      },
      family: {
        shortLabelKey: 'compatibility.soul.meanings.family.4.short',
        meaningKey: 'compatibility.soul.meanings.family.4.meaning',
        watchOutKey: 'compatibility.soul.meanings.family.4.watchOut',
        keyToSuccessKey: 'compatibility.soul.meanings.family.4.keyToSuccess',
        intensity: 'challenging',
      },
      work: {
        shortLabelKey: 'compatibility.soul.meanings.work.4.short',
        meaningKey: 'compatibility.soul.meanings.work.4.meaning',
        watchOutKey: 'compatibility.soul.meanings.work.4.watchOut',
        keyToSuccessKey: 'compatibility.soul.meanings.work.4.keyToSuccess',
        intensity: 'challenging',
      },
    },
  },
  5: {
    archetypeTitleKey: 'compatibility.soul.archetypes.5.title',
    contexts: {
      marriage: {
        shortLabelKey: 'compatibility.soul.archetypes.5.oneLine',
        meaningKey: 'compatibility.soul.archetypes.5.meaning',
        watchOutKey: 'compatibility.soul.archetypes.5.watchOut',
        keyToSuccessKey: 'compatibility.soul.archetypes.5.keyToSuccess',
        intensity: 'positive',
      },
      universal: {
        shortLabelKey: 'compatibility.soul.meanings.universal.5.short',
        meaningKey: 'compatibility.soul.meanings.universal.5.meaning',
        watchOutKey: 'compatibility.soul.meanings.universal.5.watchOut',
        keyToSuccessKey: 'compatibility.soul.meanings.universal.5.keyToSuccess',
        intensity: 'positive',
      },
      friendship: {
        shortLabelKey: 'compatibility.soul.meanings.friendship.5.short',
        meaningKey: 'compatibility.soul.meanings.friendship.5.meaning',
        watchOutKey: 'compatibility.soul.meanings.friendship.5.watchOut',
        keyToSuccessKey: 'compatibility.soul.meanings.friendship.5.keyToSuccess',
        intensity: 'positive',
      },
      family: {
        shortLabelKey: 'compatibility.soul.meanings.family.5.short',
        meaningKey: 'compatibility.soul.meanings.family.5.meaning',
        watchOutKey: 'compatibility.soul.meanings.family.5.watchOut',
        keyToSuccessKey: 'compatibility.soul.meanings.family.5.keyToSuccess',
        intensity: 'positive',
      },
      work: {
        shortLabelKey: 'compatibility.soul.meanings.work.5.short',
        meaningKey: 'compatibility.soul.meanings.work.5.meaning',
        watchOutKey: 'compatibility.soul.meanings.work.5.watchOut',
        keyToSuccessKey: 'compatibility.soul.meanings.work.5.keyToSuccess',
        intensity: 'positive',
      },
    },
  },
  6: {
    archetypeTitleKey: 'compatibility.soul.archetypes.6.title',
    contexts: {
      marriage: {
        shortLabelKey: 'compatibility.soul.archetypes.6.oneLine',
        meaningKey: 'compatibility.soul.archetypes.6.meaning',
        watchOutKey: 'compatibility.soul.archetypes.6.watchOut',
        keyToSuccessKey: 'compatibility.soul.archetypes.6.keyToSuccess',
        intensity: 'challenging',
      },
      universal: {
        shortLabelKey: 'compatibility.soul.meanings.universal.6.short',
        meaningKey: 'compatibility.soul.meanings.universal.6.meaning',
        watchOutKey: 'compatibility.soul.meanings.universal.6.watchOut',
        keyToSuccessKey: 'compatibility.soul.meanings.universal.6.keyToSuccess',
        intensity: 'challenging',
      },
      friendship: {
        shortLabelKey: 'compatibility.soul.meanings.friendship.6.short',
        meaningKey: 'compatibility.soul.meanings.friendship.6.meaning',
        watchOutKey: 'compatibility.soul.meanings.friendship.6.watchOut',
        keyToSuccessKey: 'compatibility.soul.meanings.friendship.6.keyToSuccess',
        intensity: 'challenging',
      },
      family: {
        shortLabelKey: 'compatibility.soul.meanings.family.6.short',
        meaningKey: 'compatibility.soul.meanings.family.6.meaning',
        watchOutKey: 'compatibility.soul.meanings.family.6.watchOut',
        keyToSuccessKey: 'compatibility.soul.meanings.family.6.keyToSuccess',
        intensity: 'challenging',
      },
      work: {
        shortLabelKey: 'compatibility.soul.meanings.work.6.short',
        meaningKey: 'compatibility.soul.meanings.work.6.meaning',
        watchOutKey: 'compatibility.soul.meanings.work.6.watchOut',
        keyToSuccessKey: 'compatibility.soul.meanings.work.6.keyToSuccess',
        intensity: 'challenging',
      },
    },
  },
  7: {
    archetypeTitleKey: 'compatibility.soul.archetypes.7.title',
    contexts: {
      marriage: {
        shortLabelKey: 'compatibility.soul.archetypes.7.oneLine',
        meaningKey: 'compatibility.soul.archetypes.7.meaning',
        watchOutKey: 'compatibility.soul.archetypes.7.watchOut',
        keyToSuccessKey: 'compatibility.soul.archetypes.7.keyToSuccess',
        intensity: 'positive',
      },
      universal: {
        shortLabelKey: 'compatibility.soul.meanings.universal.7.short',
        meaningKey: 'compatibility.soul.meanings.universal.7.meaning',
        watchOutKey: 'compatibility.soul.meanings.universal.7.watchOut',
        keyToSuccessKey: 'compatibility.soul.meanings.universal.7.keyToSuccess',
        intensity: 'positive',
      },
      friendship: {
        shortLabelKey: 'compatibility.soul.meanings.friendship.7.short',
        meaningKey: 'compatibility.soul.meanings.friendship.7.meaning',
        watchOutKey: 'compatibility.soul.meanings.friendship.7.watchOut',
        keyToSuccessKey: 'compatibility.soul.meanings.friendship.7.keyToSuccess',
        intensity: 'positive',
      },
      family: {
        shortLabelKey: 'compatibility.soul.meanings.family.7.short',
        meaningKey: 'compatibility.soul.meanings.family.7.meaning',
        watchOutKey: 'compatibility.soul.meanings.family.7.watchOut',
        keyToSuccessKey: 'compatibility.soul.meanings.family.7.keyToSuccess',
        intensity: 'positive',
      },
      work: {
        shortLabelKey: 'compatibility.soul.meanings.work.7.short',
        meaningKey: 'compatibility.soul.meanings.work.7.meaning',
        watchOutKey: 'compatibility.soul.meanings.work.7.watchOut',
        keyToSuccessKey: 'compatibility.soul.meanings.work.7.keyToSuccess',
        intensity: 'positive',
      },
    },
  },
  8: {
    archetypeTitleKey: 'compatibility.soul.archetypes.8.title',
    contexts: {
      marriage: {
        shortLabelKey: 'compatibility.soul.archetypes.8.oneLine',
        meaningKey: 'compatibility.soul.archetypes.8.meaning',
        watchOutKey: 'compatibility.soul.archetypes.8.watchOut',
        keyToSuccessKey: 'compatibility.soul.archetypes.8.keyToSuccess',
        intensity: 'positive',
      },
      universal: {
        shortLabelKey: 'compatibility.soul.meanings.universal.8.short',
        meaningKey: 'compatibility.soul.meanings.universal.8.meaning',
        watchOutKey: 'compatibility.soul.meanings.universal.8.watchOut',
        keyToSuccessKey: 'compatibility.soul.meanings.universal.8.keyToSuccess',
        intensity: 'positive',
      },
      friendship: {
        shortLabelKey: 'compatibility.soul.meanings.friendship.8.short',
        meaningKey: 'compatibility.soul.meanings.friendship.8.meaning',
        watchOutKey: 'compatibility.soul.meanings.friendship.8.watchOut',
        keyToSuccessKey: 'compatibility.soul.meanings.friendship.8.keyToSuccess',
        intensity: 'positive',
      },
      family: {
        shortLabelKey: 'compatibility.soul.meanings.family.8.short',
        meaningKey: 'compatibility.soul.meanings.family.8.meaning',
        watchOutKey: 'compatibility.soul.meanings.family.8.watchOut',
        keyToSuccessKey: 'compatibility.soul.meanings.family.8.keyToSuccess',
        intensity: 'positive',
      },
      work: {
        shortLabelKey: 'compatibility.soul.meanings.work.8.short',
        meaningKey: 'compatibility.soul.meanings.work.8.meaning',
        watchOutKey: 'compatibility.soul.meanings.work.8.watchOut',
        keyToSuccessKey: 'compatibility.soul.meanings.work.8.keyToSuccess',
        intensity: 'positive',
      },
    },
  },
  9: {
    archetypeTitleKey: 'compatibility.soul.archetypes.9.title',
    contexts: {
      marriage: {
        shortLabelKey: 'compatibility.soul.archetypes.9.oneLine',
        meaningKey: 'compatibility.soul.archetypes.9.meaning',
        watchOutKey: 'compatibility.soul.archetypes.9.watchOut',
        keyToSuccessKey: 'compatibility.soul.archetypes.9.keyToSuccess',
        intensity: 'challenging',
      },
      universal: {
        shortLabelKey: 'compatibility.soul.meanings.universal.9.short',
        meaningKey: 'compatibility.soul.meanings.universal.9.meaning',
        watchOutKey: 'compatibility.soul.meanings.universal.9.watchOut',
        keyToSuccessKey: 'compatibility.soul.meanings.universal.9.keyToSuccess',
        intensity: 'challenging',
      },
      friendship: {
        shortLabelKey: 'compatibility.soul.meanings.friendship.9.short',
        meaningKey: 'compatibility.soul.meanings.friendship.9.meaning',
        watchOutKey: 'compatibility.soul.meanings.friendship.9.watchOut',
        keyToSuccessKey: 'compatibility.soul.meanings.friendship.9.keyToSuccess',
        intensity: 'challenging',
      },
      family: {
        shortLabelKey: 'compatibility.soul.meanings.family.9.short',
        meaningKey: 'compatibility.soul.meanings.family.9.meaning',
        watchOutKey: 'compatibility.soul.meanings.family.9.watchOut',
        keyToSuccessKey: 'compatibility.soul.meanings.family.9.keyToSuccess',
        intensity: 'challenging',
      },
      work: {
        shortLabelKey: 'compatibility.soul.meanings.work.9.short',
        meaningKey: 'compatibility.soul.meanings.work.9.meaning',
        watchOutKey: 'compatibility.soul.meanings.work.9.watchOut',
        keyToSuccessKey: 'compatibility.soul.meanings.work.9.keyToSuccess',
        intensity: 'challenging',
      },
    },
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get intensity color for visual display
 */
export function getIntensityColor(intensity: Intensity): string {
  switch (intensity) {
    case 'positive':
      return '#22c55e'; // green
    case 'mixed':
      return '#f59e0b'; // amber
    case 'challenging':
      return '#ef4444'; // red
    default:
      return '#94a3b8'; // gray
  }
}

/**
 * Get meaning block for a specific soul number and context
 * Returns undefined if context not available for that number
 */
export function getSoulMeaning(
  soulNumber: SoulNumber,
  context: RelationshipContext
): SoulMeaningBlock | undefined {
  const entry = SOUL_CONNECTION_MEANINGS[soulNumber];
  return entry?.contexts[context];
}

/**
 * Get archetype title (if available)
 */
export function getArchetypeTitle(soulNumber: SoulNumber): string | undefined {
  return SOUL_CONNECTION_MEANINGS[soulNumber]?.archetypeTitleKey;
}

/**
 * Check if a context has meanings defined for a soul number
 */
export function hasContextMeaning(
  soulNumber: SoulNumber,
  context: RelationshipContext
): boolean {
  return !!getSoulMeaning(soulNumber, context);
}
