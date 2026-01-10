/**
 * Mīzān al-Ḥurūf (Letter Balance) Service
 * Analyzes the elemental temperament of Arabic names
 */

import { normalizeArabic } from '../../../utils/arabic-normalization';
import { ELEMENT_SUPPORT_MATRIX, MIZAN_MAGHRIBI_TABAI3, type MizanElement } from '../../constants/mizanMaghribi';

export interface MizanProfile {
  name: string;
  normalizedName: string;
  elementCounts: Record<MizanElement, number>;
  elementPercentages: Record<MizanElement, number>;
  dominantElement: MizanElement;
  secondaryElement: MizanElement | null;
  balanceScore: number; // 0-100, higher = more balanced distribution
  polarityScore: number; // 0-100, higher = more active (fire+air), lower = more calm (water+earth)
  unknownLetters: string[];
  totalLetters: number;
}

export interface MizanCompatibility {
  person1Profile: MizanProfile;
  person2Profile: MizanProfile;
  relationshipLabel: 'supportive' | 'opposing' | 'complementary' | 'mixed';
  mizanScore: number; // 0-100
  shortMeaning: string;
  watchOut: string;
  advice: string;
  similarityScore: number; // 0-100
  supportScore: number; // 0-100
}

/**
 * Build Mīzān profile for an Arabic name
 */
export function buildMizanProfile(arabicName: string): MizanProfile {
  // Normalize the name (remove tashkeel, spaces, tatweel)
  const normalized = normalizeArabic(arabicName);
  
  // Initialize element counts
  const elementCounts: Record<MizanElement, number> = {
    fire: 0,
    air: 0,
    water: 0,
    earth: 0,
  };
  
  const unknownLetters: string[] = [];
  let totalLetters = 0;
  
  // Count elements for each letter
  for (const letter of normalized) {
    const element = MIZAN_MAGHRIBI_TABAI3[letter];
    if (element) {
      elementCounts[element]++;
      totalLetters++;
    } else {
      if (!unknownLetters.includes(letter)) {
        unknownLetters.push(letter);
      }
    }
  }
  
  // If no valid letters found, return default profile
  if (totalLetters === 0) {
    return {
      name: arabicName,
      normalizedName: normalized,
      elementCounts,
      elementPercentages: { fire: 25, air: 25, water: 25, earth: 25 },
      dominantElement: 'air',
      secondaryElement: null,
      balanceScore: 100,
      polarityScore: 50,
      unknownLetters,
      totalLetters: 0,
    };
  }
  
  // Calculate percentages
  const elementPercentages: Record<MizanElement, number> = {
    fire: Math.round((elementCounts.fire / totalLetters) * 100),
    air: Math.round((elementCounts.air / totalLetters) * 100),
    water: Math.round((elementCounts.water / totalLetters) * 100),
    earth: Math.round((elementCounts.earth / totalLetters) * 100),
  };
  
  // Find dominant and secondary elements
  const sortedElements = (['fire', 'air', 'water', 'earth'] as MizanElement[])
    .sort((a, b) => elementCounts[b] - elementCounts[a]);
  
  const dominantElement = sortedElements[0];
  const secondaryElement = elementCounts[sortedElements[1]] > 0 ? sortedElements[1] : null;
  
  // Calculate balance score (higher = more balanced)
  // Perfect balance would be 25% each, so we measure deviation from that
  const deviations = Object.values(elementPercentages).map(p => Math.abs(p - 25));
  const avgDeviation = deviations.reduce((sum, d) => sum + d, 0) / 4;
  const balanceScore = Math.max(0, Math.round(100 - (avgDeviation * 2)));
  
  // Calculate polarity score (active vs calm)
  // Fire + Air = active/fast (higher score)
  // Water + Earth = calm/slow (lower score)
  const activePercent = elementPercentages.fire + elementPercentages.air;
  const polarityScore = Math.round(activePercent);
  
  return {
    name: arabicName,
    normalizedName: normalized,
    elementCounts,
    elementPercentages,
    dominantElement,
    secondaryElement,
    balanceScore,
    polarityScore,
    unknownLetters,
    totalLetters,
  };
}

/**
 * Compare two Mīzān profiles for compatibility
 */
export function compareMizanProfiles(
  profile1: MizanProfile,
  profile2: MizanProfile
): MizanCompatibility {
  // Calculate similarity score (how similar are their distributions?)
  const similarityScore = calculateSimilarityScore(profile1, profile2);
  
  // Calculate support score (do their elements support each other?)
  const supportScore = calculateSupportScore(profile1, profile2);
  
  // Overall Mīzān score (weighted average)
  const mizanScore = Math.round((similarityScore * 0.4) + (supportScore * 0.6));
  
  // Determine relationship label
  const relationshipLabel = determineRelationshipLabel(profile1, profile2, supportScore);
  
  // Generate meanings
  const { shortMeaning, watchOut, advice } = generateMeanings(
    relationshipLabel,
    profile1,
    profile2,
    mizanScore
  );
  
  return {
    person1Profile: profile1,
    person2Profile: profile2,
    relationshipLabel,
    mizanScore,
    shortMeaning,
    watchOut,
    advice,
    similarityScore,
    supportScore,
  };
}

/**
 * Calculate similarity between two profiles
 */
function calculateSimilarityScore(profile1: MizanProfile, profile2: MizanProfile): number {
  let totalDifference = 0;
  
  for (const element of ['fire', 'air', 'water', 'earth'] as MizanElement[]) {
    const diff = Math.abs(profile1.elementPercentages[element] - profile2.elementPercentages[element]);
    totalDifference += diff;
  }
  
  // Lower difference = higher similarity
  // Max difference would be 200 (if one has 100% of one element and other has 100% of different element)
  const similarity = Math.max(0, 100 - (totalDifference / 2));
  return Math.round(similarity);
}

/**
 * Calculate support score based on element interaction matrix
 */
function calculateSupportScore(profile1: MizanProfile, profile2: MizanProfile): number {
  let supportiveWeight = 0;
  let opposingWeight = 0;
  let neutralWeight = 0;
  
  // Check interaction between all element pairs
  for (const elem1 of ['fire', 'air', 'water', 'earth'] as MizanElement[]) {
    for (const elem2 of ['fire', 'air', 'water', 'earth'] as MizanElement[]) {
      const weight1 = profile1.elementPercentages[elem1];
      const weight2 = profile2.elementPercentages[elem2];
      const interaction = ELEMENT_SUPPORT_MATRIX[elem1][elem2];
      
      const combinedWeight = (weight1 * weight2) / 100;
      
      if (interaction === 'supportive') {
        supportiveWeight += combinedWeight;
      } else if (interaction === 'opposing') {
        opposingWeight += combinedWeight;
      } else {
        neutralWeight += combinedWeight;
      }
    }
  }
  
  // Calculate support score
  // High supportive weight = high score
  // High opposing weight = low score
  const totalWeight = supportiveWeight + opposingWeight + neutralWeight;
  if (totalWeight === 0) return 50;
  
  const supportRatio = supportiveWeight / totalWeight;
  const opposingRatio = opposingWeight / totalWeight;
  
  const score = (supportRatio * 100) - (opposingRatio * 30);
  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Determine relationship label based on element interactions
 */
function determineRelationshipLabel(
  profile1: MizanProfile,
  profile2: MizanProfile,
  supportScore: number
): 'supportive' | 'opposing' | 'complementary' | 'mixed' {
  const dom1 = profile1.dominantElement;
  const dom2 = profile2.dominantElement;
  
  const interaction = ELEMENT_SUPPORT_MATRIX[dom1][dom2];
  
  if (supportScore >= 70) {
    return 'supportive';
  } else if (supportScore <= 40) {
    return 'opposing';
  } else if (interaction === 'supportive' || (dom1 !== dom2 && supportScore >= 55)) {
    return 'complementary';
  } else {
    return 'mixed';
  }
}

/**
 * Generate simple meanings based on compatibility results
 */
function generateMeanings(
  relationshipLabel: string,
  profile1: MizanProfile,
  profile2: MizanProfile,
  score: number
): { shortMeaning: string; watchOut: string; advice: string } {
  // These are template strings - actual text should come from translations
  // Using keys that will be translated
  return {
    shortMeaning: `compatibility.mizan.meaning.${relationshipLabel}`,
    watchOut: `compatibility.mizan.watchOut.${relationshipLabel}`,
    advice: `compatibility.mizan.advice.${relationshipLabel}`,
  };
}
