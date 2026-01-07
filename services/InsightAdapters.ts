/**
 * Insight Adapters for Calculator
 * Type-specific interpretation engines
 * Phase 2: Enhanced with rich content and datasets
 */

import { findDivineNamesByValue } from '../data/divine-names';
import { generateQuranLink, getSurahByNumber } from '../data/quran-surahs';
import {
    CoreResults,
    DhikrInsights,
    ElementalAnalytics,
    GeneralInsights,
    LineageInsights,
    NameInsights,
    PhraseInsights,
    QuranInsights,
} from '../types/calculator-enhanced';
import { sacredSet, sacredSignificance } from '../utils/hadad-core';
import { ElementType } from '../utils/types';

// ============================================================================
// NAME ADAPTER
// ============================================================================

const NAME_ARCHETYPES: Record<number, string> = {
  1: 'The Pioneer',
  2: 'The Harmonizer',
  3: 'The Creator',
  4: 'The Builder',
  5: 'The Explorer',
  6: 'The Nurturer',
  7: 'The Seeker',
  8: 'The Achiever',
  9: 'The Sage',
};

// Element guidance keys (to be translated via t())
const ELEMENT_GUIDANCE_KEYS: Record<ElementType, string> = {
  fire: 'calculator.results.elementGuidance.fire',
  water: 'calculator.results.elementGuidance.water',
  air: 'calculator.results.elementGuidance.air',
  earth: 'calculator.results.elementGuidance.earth',
};

const ELEMENT_BEST_TIME_KEYS: Record<ElementType, string> = {
  fire: 'calculator.results.lineage.bestTime.fire',
  water: 'calculator.results.lineage.bestTime.water',
  air: 'calculator.results.lineage.bestTime.air',
  earth: 'calculator.results.lineage.bestTime.earth',
};

const ELEMENT_POWER_DAY: Record<ElementType, string> = {
  fire: 'Tuesday (Mars) and Sunday (Sun)',
  water: 'Monday (Moon) and Friday (Venus)',
  air: 'Wednesday (Mercury)',
  earth: 'Thursday (Jupiter) and Saturday (Saturn)',
};

export function computeNameInsights(
  core: CoreResults,
  analytics: ElementalAnalytics
): NameInsights {
  const archetype = NAME_ARCHETYPES[core.saghir] || 'The Traveler';
  
  // Store the translation key instead of translated text
  // Components will translate this using t(spiritualGuidance)
  const guidanceKey = ELEMENT_GUIDANCE_KEYS[core.element];
  
  const bestTime = ELEMENT_BEST_TIME[core.element];
  const powerDay = ELEMENT_POWER_DAY[core.element];
  
  // Enhanced: Find divine names with matching or near values
  const matchingNames = findDivineNamesByValue(core.kabir, 50)
    .slice(0, 3)
    .map(name => ({
      name: name.transliteration,
      arabic: name.arabic,
      value: name.abjadValue,
      distance: Math.abs(name.abjadValue - core.kabir),
    }));
  
  // Generate recommended dhikr counts based on value
  const counts: number[] = [33, 99];
  if (core.saghir <= 100) counts.push(core.saghir);
  if (core.kabir <= 1000 && core.kabir !== core.saghir) counts.push(core.kabir);
  
  return {
    archetypeTitle: archetype,
    spiritualGuidance: guidanceKey, // Now a translation key, not English text
    divineNameConnection: matchingNames,
    recommendedDhikrCount: counts,
    bestTimeWindow: bestTime,
    powerDay: powerDay,
  };
}

// ============================================================================
// LINEAGE ADAPTER
// ============================================================================

function analyzeElementInteraction(
  element1: ElementType,
  element2: ElementType
): { harmony: 'support' | 'neutral' | 'tension'; descriptionKey: string } {
  const INTERACTION_KEYS: Record<string, { harmony: 'support' | 'neutral' | 'tension'; descriptionKey: string }> = {
    'fire-fire': { harmony: 'support', descriptionKey: 'calculator.results.lineage.interactions.firefire' },
    'fire-air': { harmony: 'support', descriptionKey: 'calculator.results.lineage.interactions.fireair' },
    'fire-water': { harmony: 'tension', descriptionKey: 'calculator.results.lineage.interactions.firewater' },
    'fire-earth': { harmony: 'neutral', descriptionKey: 'calculator.results.lineage.interactions.fireearth' },
    'water-water': { harmony: 'support', descriptionKey: 'calculator.results.lineage.interactions.waterwater' },
    'water-air': { harmony: 'neutral', descriptionKey: 'calculator.results.lineage.interactions.waterair' },
    'water-earth': { harmony: 'support', descriptionKey: 'calculator.results.lineage.interactions.waterearth' },
    'air-air': { harmony: 'support', descriptionKey: 'calculator.results.lineage.interactions.airair' },
    'air-earth': { harmony: 'neutral', descriptionKey: 'calculator.results.lineage.interactions.airearth' },
    'earth-earth': { harmony: 'support', descriptionKey: 'calculator.results.lineage.interactions.earthearth' },
  };
  
  const key1 = `${element1}-${element2}`;
  const key2 = `${element2}-${element1}`;
  
  return INTERACTION_KEYS[key1] || INTERACTION_KEYS[key2] || {
    harmony: 'neutral',
    descriptionKey: 'calculator.results.lineage.interactions.balanced',
  };
}

export function computeLineageInsights(
  yourNameValue: number,
  motherNameValue: number,
  yourElement: ElementType,
  motherElement: ElementType,
  combinedCore: CoreResults
): LineageInsights {
  const interaction = analyzeElementInteraction(yourElement, motherElement);
  
  // Return translation keys instead of English strings
  // Components will use t(key, {variables}) to translate with variable interpolation
  const keyTakeawaysKeys = [
    'calculator.results.lineage.takeaways.lineageNumber', // Variables: {{kabir}}, {{element}}
    'calculator.results.lineage.takeaways.elementalRelationship', // Variable: {{interaction}}
    'calculator.results.lineage.takeaways.spiritualRoot', // Variable: {{saghir}}
  ];
  
  const practicePlan = {
    doList: [
      'calculator.results.lineage.practice.do.dhikr', // Variable: {{saghir}}
      'calculator.results.lineage.practice.do.reflection', // Variable: {{bestTime}}
      'calculator.results.lineage.practice.do.gratitude',
    ],
    avoidList: [
      'calculator.results.lineage.practice.avoid.neglect',
      'calculator.results.lineage.practice.avoid.ignoreWisdom',
    ],
    bestTimeKey: ELEMENT_BEST_TIME_KEYS[combinedCore.element],
  };
  
  return {
    yourNameValue,
    motherNameValue,
    combinedTotal: combinedCore.kabir,
    familyPattern: {
      harmony: interaction.harmony,
      elementInteractionKey: interaction.descriptionKey,
    },
    keyTakeawaysKeys,
    practicePlan,
    // Store element and saghir for variable interpolation in component
    combinedElement: combinedCore.element,
    combinedSaghir: combinedCore.saghir,
  };
}

// ============================================================================
// PHRASE ADAPTER
// ============================================================================

export function computePhraseInsights(
  core: CoreResults,
  analytics: ElementalAnalytics
): PhraseInsights {
  // Find repeated letters
  const topRepeated = analytics.letterFreq
    .filter(lf => lf.count > 1)
    .slice(0, 3);
  
  // Find nearest sacred number
  const nearest = sacredSet.reduce((best, x) => 
    Math.abs(x - core.kabir) < Math.abs(best - core.kabir) ? x : best, 
    sacredSet[0]
  );
  
  const sacredNumberNear = Math.abs(nearest - core.kabir) <= 10 ? nearest : null;
  
  return {
    themeDetection: {
      dominantElement: analytics.dominantElement,
      repeatedLetters: topRepeated.map(lf => ({ letter: lf.letter, count: lf.count })),
      sacredNumberNear,
    },
    structureInsights: {
      topRepeatedLetters: topRepeated,
      centerLetter: '', // Calculate from normalized text
      centerSignificance: 'The center represents the heart of the message',
    },
    reflectionPrompts: [
      'What feeling does this phrase evoke in your heart?',
      'How does this phrase connect to your current spiritual journey?',
      'What action or change does this phrase inspire in you?',
    ],
  };
}

// ============================================================================
// QURAN ADAPTER
// ============================================================================

/**
 * Compute Qur'an-specific insights
 * 
 * IMPORTANT: "Resonance Link" is derived from the calculated Kabīr value
 * It shows:
 * - The dominant element (from Ḥadad calculation)
 * - The nearest sacred number to the verse's Kabīr
 * - The spiritual significance of that sacred number
 * 
 * This is a CALCULATED association, not a suggestion.
 */
export function computeQuranInsights(
  core: CoreResults,
  arabicText?: string,
  surahNumber?: number,
  ayahNumber?: number
): QuranInsights {
  // Find nearest sacred number based on the verse's Kabīr value
  const nearest = sacredSet.reduce((best, x) => 
    Math.abs(x - core.kabir) < Math.abs(best - core.kabir) ? x : best, 
    sacredSet[0]
  );
  
  const distance = Math.abs(nearest - core.kabir);
  const meaning = sacredSignificance[nearest] || 'Resonates with divine pattern';
  
  // Enhanced: Get surah metadata if provided
  const surah = surahNumber ? getSurahByNumber(surahNumber) : undefined;
  const quranLink = surahNumber && ayahNumber 
    ? generateQuranLink(surahNumber, ayahNumber)
    : undefined;
  
  // Build resonance description with transparency
  let resonanceDescription = meaning;
  if (distance > 0) {
    resonanceDescription = `${meaning}\n\n📊 Calculated: Verse Kabīr is ${core.kabir}, nearest sacred number is ${nearest} (distance: ${distance})`;
  } else {
    resonanceDescription = `${meaning}\n\n✨ Perfect match: This verse's Kabīr (${core.kabir}) is a sacred number!`;
  }
  
  return {
    surahName: surah?.name.transliteration,
    ayahNumber,
    arabicText,
    resonanceLink: {
      dominantElement: core.element,
      sacredNumber: nearest,
      meaning: resonanceDescription,
      isCalculated: true, // Flag to indicate this is derived from Kabīr, not suggested
      kabir: core.kabir,  // Include the actual Kabīr value for transparency
      distance,           // Distance from nearest sacred number
    },
    reflectionBlock: {
      prompt: 'Read this ayah slowly, with presence. What word or phrase stands out to you? Write 1-2 words that resonate.',
    },
    quranComLink: quranLink,
  };
}

// ============================================================================
// DHIKR ADAPTER
// ============================================================================

export function computeDhikrInsights(
  core: CoreResults,
  divineNameArabic?: string
): DhikrInsights {
  const suggestedCounts = {
    valueBased: core.saghir <= 313 ? core.saghir : null,
    traditional: [33, 99, 100],
  };
  
  return {
    selectedDivineName: divineNameArabic ? {
      arabic: divineNameArabic,
      transliteration: '', // Phase 2: lookup from database
      abjadValue: core.kabir,
      matchStrength: 'near',
    } : undefined,
    suggestedCounts,
    timing: {
      afterSalah: ['After Fajr', 'After Maghrib', 'Before sleep'],
    },
    practiceGuidance: {
      preparation: ['Make wuḍū', 'Face qibla', 'Begin with ṣalawāt on the Prophet ﷺ'],
      adab: ['With presence and humility', 'Count on fingers or tasbīḥ', 'End with duʿā'],
    },
  };
}

// ============================================================================
// GENERAL ADAPTER
// ============================================================================

export function computeGeneralInsights(
  core: CoreResults,
  analytics: ElementalAnalytics
): GeneralInsights {
  const nearest = sacredSet.reduce((best, x) => 
    Math.abs(x - core.kabir) < Math.abs(best - core.kabir) ? x : best, 
    sacredSet[0]
  );
  
  const meaning = sacredSignificance[nearest] || 'Unique numeric signature';
  
  return {
    letterFrequencyChart: analytics.letterFreq,
    elementalBalance: {
      composition: analytics.elementPercents,
      advice: `Your dominant element is ${analytics.dominantElement}. ${ELEMENT_GUIDANCE[analytics.dominantElement]}`,
    },
    sacredResonance: {
      nearest,
      meaning,
      distance: Math.abs(nearest - core.kabir),
    },
    advancedMethods: {
      wusta: { 
        value: core.wusta, 
        element: core.element, // Simplified; could recalculate
      },
      kamal: { 
        value: core.kamal, 
        element: core.element,
      },
      bast: { 
        value: core.bast, 
        element: core.element,
      },
    },
  };
}
