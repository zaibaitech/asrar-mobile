/**
 * Soul Connection Archetypes (1-9)
 * Traditional West African/Maghribi Asrār framing
 * Based on (Hadad A + Hadad B + 7) mod 9, where 0 becomes 9
 */

export type SoulArchetype = {
  number: number;
  titleKey: string;
  oneLineKey: string;
  meaningKey: string;
  marriageOutlookKey: string;
  watchOutKey: string;
  keyToSuccessKey: string;
  severity: 'green' | 'amber' | 'red';
  tags: string[]; // translation keys
};

export const SOUL_ARCHETYPES: Record<number, SoulArchetype> = {
  1: {
    number: 1,
    titleKey: 'compatibility.soul.archetypes.1.title',
    oneLineKey: 'compatibility.soul.archetypes.1.oneLine',
    meaningKey: 'compatibility.soul.archetypes.1.meaning',
    marriageOutlookKey: 'compatibility.soul.archetypes.1.marriageOutlook',
    watchOutKey: 'compatibility.soul.archetypes.1.watchOut',
    keyToSuccessKey: 'compatibility.soul.archetypes.1.keyToSuccess',
    severity: 'amber',
    tags: [
      'compatibility.soul.tags.grounded',
      'compatibility.soul.tags.stability',
      'compatibility.soul.tags.renewal',
    ],
  },
  2: {
    number: 2,
    titleKey: 'compatibility.soul.archetypes.2.title',
    oneLineKey: 'compatibility.soul.archetypes.2.oneLine',
    meaningKey: 'compatibility.soul.archetypes.2.meaning',
    marriageOutlookKey: 'compatibility.soul.archetypes.2.marriageOutlook',
    watchOutKey: 'compatibility.soul.archetypes.2.watchOut',
    keyToSuccessKey: 'compatibility.soul.archetypes.2.keyToSuccess',
    severity: 'green',
    tags: [
      'compatibility.soul.tags.harmony',
      'compatibility.soul.tags.cooperation',
      'compatibility.soul.tags.companionship',
    ],
  },
  3: {
    number: 3,
    titleKey: 'compatibility.soul.archetypes.3.title',
    oneLineKey: 'compatibility.soul.archetypes.3.oneLine',
    meaningKey: 'compatibility.soul.archetypes.3.meaning',
    marriageOutlookKey: 'compatibility.soul.archetypes.3.marriageOutlook',
    watchOutKey: 'compatibility.soul.archetypes.3.watchOut',
    keyToSuccessKey: 'compatibility.soul.archetypes.3.keyToSuccess',
    severity: 'red',
    tags: [
      'compatibility.soul.tags.friction',
      'compatibility.soul.tags.patience',
      'compatibility.soul.tags.discipline',
    ],
  },
  4: {
    number: 4,
    titleKey: 'compatibility.soul.archetypes.4.title',
    oneLineKey: 'compatibility.soul.archetypes.4.oneLine',
    meaningKey: 'compatibility.soul.archetypes.4.meaning',
    marriageOutlookKey: 'compatibility.soul.archetypes.4.marriageOutlook',
    watchOutKey: 'compatibility.soul.archetypes.4.watchOut',
    keyToSuccessKey: 'compatibility.soul.archetypes.4.keyToSuccess',
    severity: 'red',
    tags: [
      'compatibility.soul.tags.burden',
      'compatibility.soul.tags.health',
      'compatibility.soul.tags.maturity',
    ],
  },
  5: {
    number: 5,
    titleKey: 'compatibility.soul.archetypes.5.title',
    oneLineKey: 'compatibility.soul.archetypes.5.oneLine',
    meaningKey: 'compatibility.soul.archetypes.5.meaning',
    marriageOutlookKey: 'compatibility.soul.archetypes.5.marriageOutlook',
    watchOutKey: 'compatibility.soul.archetypes.5.watchOut',
    keyToSuccessKey: 'compatibility.soul.archetypes.5.keyToSuccess',
    severity: 'green',
    tags: [
      'compatibility.soul.tags.blessed',
      'compatibility.soul.tags.growth',
      'compatibility.soul.tags.gratitude',
    ],
  },
  6: {
    number: 6,
    titleKey: 'compatibility.soul.archetypes.6.title',
    oneLineKey: 'compatibility.soul.archetypes.6.oneLine',
    meaningKey: 'compatibility.soul.archetypes.6.meaning',
    marriageOutlookKey: 'compatibility.soul.archetypes.6.marriageOutlook',
    watchOutKey: 'compatibility.soul.archetypes.6.watchOut',
    keyToSuccessKey: 'compatibility.soul.archetypes.6.keyToSuccess',
    severity: 'red',
    tags: [
      'compatibility.soul.tags.trial',
      'compatibility.soul.tags.forgiveness',
      'compatibility.soul.tags.selfWork',
    ],
  },
  7: {
    number: 7,
    titleKey: 'compatibility.soul.archetypes.7.title',
    oneLineKey: 'compatibility.soul.archetypes.7.oneLine',
    meaningKey: 'compatibility.soul.archetypes.7.meaning',
    marriageOutlookKey: 'compatibility.soul.archetypes.7.marriageOutlook',
    watchOutKey: 'compatibility.soul.archetypes.7.watchOut',
    keyToSuccessKey: 'compatibility.soul.archetypes.7.keyToSuccess',
    severity: 'green',
    tags: [
      'compatibility.soul.tags.chosen',
      'compatibility.soul.tags.blessed',
      'compatibility.soul.tags.alignment',
    ],
  },
  8: {
    number: 8,
    titleKey: 'compatibility.soul.archetypes.8.title',
    oneLineKey: 'compatibility.soul.archetypes.8.oneLine',
    meaningKey: 'compatibility.soul.archetypes.8.meaning',
    marriageOutlookKey: 'compatibility.soul.archetypes.8.marriageOutlook',
    watchOutKey: 'compatibility.soul.archetypes.8.watchOut',
    keyToSuccessKey: 'compatibility.soul.archetypes.8.keyToSuccess',
    severity: 'green',
    tags: [
      'compatibility.soul.tags.patience',
      'compatibility.soul.tags.longTerm',
      'compatibility.soul.tags.wisdom',
    ],
  },
  9: {
    number: 9,
    titleKey: 'compatibility.soul.archetypes.9.title',
    oneLineKey: 'compatibility.soul.archetypes.9.oneLine',
    meaningKey: 'compatibility.soul.archetypes.9.meaning',
    marriageOutlookKey: 'compatibility.soul.archetypes.9.marriageOutlook',
    watchOutKey: 'compatibility.soul.archetypes.9.watchOut',
    keyToSuccessKey: 'compatibility.soul.archetypes.9.keyToSuccess',
    severity: 'red',
    tags: [
      'compatibility.soul.tags.caution',
      'compatibility.soul.tags.guidance',
      'compatibility.soul.tags.protection',
    ],
  },
};

/**
 * Get archetype for a Soul Connection number
 * @param number - Soul Connection number (1-9)
 * @returns SoulArchetype object or fallback
 */
export function getSoulArchetype(number: number): SoulArchetype {
  const archetype = SOUL_ARCHETYPES[number];
  
  if (!archetype) {
    console.warn(`Soul Connection number ${number} is out of range (1-9). Using fallback.`);
    // Fallback archetype
    return {
      number,
      titleKey: 'compatibility.soul.archetypes.fallback.title',
      oneLineKey: 'compatibility.soul.archetypes.fallback.oneLine',
      meaningKey: 'compatibility.soul.archetypes.fallback.meaning',
      marriageOutlookKey: 'compatibility.soul.archetypes.fallback.marriageOutlook',
      watchOutKey: 'compatibility.soul.archetypes.fallback.watchOut',
      keyToSuccessKey: 'compatibility.soul.archetypes.fallback.keyToSuccess',
      severity: 'amber',
      tags: ['compatibility.soul.tags.reflection'],
    };
  }
  
  return archetype;
}

/**
 * Get severity color
 */
export function getSeverityColor(severity: 'green' | 'amber' | 'red'): string {
  switch (severity) {
    case 'green':
      return '#22c55e';
    case 'amber':
      return '#f59e0b';
    case 'red':
      return '#ef4444';
    default:
      return '#94a3b8';
  }
}
