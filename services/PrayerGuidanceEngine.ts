/**
 * Prayer Guidance Engine
 * 
 * Intelligent recommendation system that combines:
 * - Classical planetary hour practices (Step 1.1)
 * - Divine Names planetary correspondences (Step 1.2)
 * - Prayer-specific adhkar (Step 1.3)
 * - User's personal abjad/element profile
 * 
 * Generates personalized spiritual guidance for each prayer based on
 * astronomical timing, classical wisdom, and individual compatibility.
 * 
 * @module PrayerGuidanceEngine
 */

import type { DayOfWeek, HourNumber, Planet } from '@/data/classical-hour-practices';
import { getHourPractice, PLANETARY_HOUR_SEQUENCE } from '@/data/classical-hour-practices';
import type { DivineNamePlanetary, Element, Prayer, Temperament } from '@/data/divine-names-planetary';
import { DIVINE_NAMES_PLANETARY, getDivineNamesByPlanet, getDivineNamesForPrayer } from '@/data/divine-names-planetary';
import type { Dhikr } from '@/data/prayer-adhkar';
import { getAdhkarForPrayer, getSunnahAdhkarForPrayer } from '@/data/prayer-adhkar';

// ============================================================================
// TYPES
// ============================================================================

export interface UserProfile {
  userId: string;
  name: string;
  abjadValue: number;
  derived: {
    element: Element;
    temperament: Temperament;
    reduction: number; // 1-9
    planet?: Planet;
  };
}

export interface PlanetaryHourContext {
  planet: Planet;
  hourNumber: number; // 1-12
  dayOfWeek: DayOfWeek;
  element: Element;
  arabicName: string;
}

export interface PrayerGuidanceRecommendation {
  // Prayer context
  prayer: {
    name: Prayer;
    time: Date;
    arabicName: string;
  };
  
  // Spiritual context
  context: {
    userElement: Element;
    currentPlanetaryHour: {
      planet: Planet;
      number: number;
      arabicName: string;
    };
    dayRuler: Planet;
    alignment: 'exceptional' | 'strong' | 'favorable' | 'moderate' | 'balanced' | 'challenging';
    alignmentDescription: string;
  };
  
  // Classical wisdom for this hour
  classicalWisdom: {
    recommendedWorks: string[];
    worksToAvoid: string[];
    originalText: string;
    source: string;
  };
  
  // Recommended divine name
  divineName: {
    arabic: string;
    transliteration: string;
    translationKey: string;
    count: number;
    abjadValue: number;
    reasoning: {
      planetaryAlignment: string;
      elementalResonance: string;
      numerologicalSignificance: string;
      classicalSource: string;
    };
    benefitKeys: string[];
  };
  
  // Standard Sunnah adhkar
  adhkar: Array<{
    arabic: string;
    transliteration: string;
    translation: { en: string; fr: string };
    count: number;
    benefitKey: string;
    source: string;
  }>;
  
  // Additional classical practices (optional)
  classicalPractices?: Array<{
    arabic: string;
    transliteration: string;
    translation: { en: string; fr: string };
    count: number;
    benefitKey: string;
    tradition: string;
    planetaryConnectionKey?: string;
  }>;
}

// ============================================================================
// PRAYER GUIDANCE ENGINE
// ============================================================================

export class PrayerGuidanceEngine {
  
  /**
   * Main function: Generate complete guidance for a prayer
   * 
   * Combines all data sources to create personalized recommendations:
   * 1. Classical hour practices based on planetary timing
   * 2. Optimal Divine Name selection based on multiple factors
   * 3. Standard Sunnah adhkar for the prayer
   * 4. Elemental alignment calculations
   * 
   * @param prayer - The prayer name (Fajr, Dhuhr, Asr, Maghrib, Isha)
   * @param prayerTime - The time of the prayer
   * @param userProfile - User's abjad profile with derived element/temperament
   * @param planetaryHour - Current planetary hour context
   * @returns Complete guidance recommendation
   */
  static generateGuidance(
    prayer: Prayer,
    prayerTime: Date,
    userProfile: UserProfile,
    planetaryHour: PlanetaryHourContext
  ): PrayerGuidanceRecommendation {
    
    // 1. Get classical hour practice from traditional sources
    const classicalPractice = this.getClassicalHourPractice(
      planetaryHour.planet,
      planetaryHour.dayOfWeek,
      planetaryHour.hourNumber
    );
    
    // 2. Calculate elemental alignment between user and current hour
    const alignment = this.calculateAlignment(
      userProfile.derived.element,
      planetaryHour.element
    );
    
    const alignmentDescription = this.getAlignmentDescription(
      alignment,
      userProfile.derived.element,
      planetaryHour.element
    );
    
    // 3. Select optimal Divine Name based on all factors
    const divineName = this.selectDivineName(
      prayer,
      userProfile.derived.element,
      planetaryHour.planet,
      planetaryHour.element,
      alignment,
      userProfile.derived.reduction
    );
    
    // 4. Get standard Sunnah adhkar for this prayer
    const adhkar = this.getAdhkar(prayer);
    
    // 5. Get optional classical practices for this prayer
    const classicalPractices = this.getClassicalPractices(prayer);
    
    // 6. Compile complete recommendation
    return {
      prayer: {
        name: prayer,
        time: prayerTime,
        arabicName: this.getArabicPrayerName(prayer)
      },
      context: {
        userElement: userProfile.derived.element,
        currentPlanetaryHour: {
          planet: planetaryHour.planet,
          number: planetaryHour.hourNumber,
          arabicName: planetaryHour.arabicName
        },
        dayRuler: this.getDayRuler(prayerTime),
        alignment,
        alignmentDescription
      },
      classicalWisdom: classicalPractice,
      divineName,
      adhkar,
      classicalPractices
    };
  }
  
  // ==========================================================================
  // CLASSICAL HOUR PRACTICES
  // ==========================================================================
  
  /**
   * Get classical hour practice from database
   * 
   * Retrieves traditional practices for the specific planetary hour
   * from West African Maghribi manuscript sources.
   */
  private static getClassicalHourPractice(
    planet: Planet,
    day: DayOfWeek,
    hourNumber: number
  ) {
    const practice = getHourPractice(day, hourNumber as HourNumber);
    
    if (!practice) {
      return this.getDefaultPractice(planet);
    }
    
    return {
      recommendedWorks: practice.recommendedWorks.map(w => w.nameKey),
      worksToAvoid: practice.avoidWorks?.map(w => w.nameKey) || [],
      originalText: practice.arabicText || '',
      source: practice.source.title
    };
  }
  
  /**
   * Fallback practice when specific hour data unavailable
   */
  private static getDefaultPractice(planet: Planet) {
    const planetaryDefaults: Record<Planet, { recommended: string[], avoid: string[] }> = {
      Sun: {
        recommended: ['prayerGuidance.works.talismansSeals', 'prayerGuidance.works.reversalWork'],
        avoid: ['prayerGuidance.works.nightWorks']
      },
      Moon: {
        recommended: ['prayerGuidance.works.waterRelated', 'prayerGuidance.works.travelMovement'],
        avoid: ['prayerGuidance.works.ironMetalwork']
      },
      Mars: {
        recommended: ['prayerGuidance.works.combatDefense', 'prayerGuidance.works.ironMetalwork'],
        avoid: ['prayerGuidance.works.marriageFamily']
      },
      Mercury: {
        recommended: ['prayerGuidance.works.studyKnowledge', 'prayerGuidance.works.herbMedicine'],
        avoid: ['prayerGuidance.works.combatDefense']
      },
      Jupiter: {
        recommended: ['prayerGuidance.works.seekingKingsNobles', 'prayerGuidance.works.landProperty'],
        avoid: ['prayerGuidance.works.magicalWorkings']
      },
      Venus: {
        recommended: ['prayerGuidance.works.correctnessSweetness', 'prayerGuidance.works.loveAttraction'],
        avoid: ['prayerGuidance.works.combatDefense']
      },
      Saturn: {
        recommended: ['prayerGuidance.works.imprisonmentBondage', 'prayerGuidance.works.saturnWorks'],
        avoid: ['prayerGuidance.works.loveAttraction', 'prayerGuidance.works.marriageFamily']
      }
    };
    
    const defaults = planetaryDefaults[planet];
    
    return {
      recommendedWorks: defaults.recommended,
      worksToAvoid: defaults.avoid,
      originalText: '',
      source: 'Classical planetary correspondences'
    };
  }
  
  // ==========================================================================
  // ELEMENTAL ALIGNMENT
  // ==========================================================================
  
  /**
   * Calculate elemental alignment strength
   * 
   * Determines how well user's element harmonizes with current hour's element.
   * Based on classical elemental theory:
   * - Same element = exceptional alignment
   * - Compatible (Fire-Air, Water-Earth) = strong
   * - Neutral = favorable/moderate
   * - Opposite (Fire-Water, Air-Earth) = challenging (requires extra care)
   */
  private static calculateAlignment(
    userElement: Element,
    hourElement: Element
  ): 'exceptional' | 'strong' | 'favorable' | 'moderate' | 'balanced' | 'challenging' {
    
    // Same element = exceptional resonance
    if (userElement === hourElement) {
      return 'exceptional';
    }
    
    // Compatible elements = strong harmony
    const compatible: Record<Element, Element[]> = {
      Fire: ['Air'],
      Air: ['Fire'],
      Water: ['Earth'],
      Earth: ['Water']
    };
    
    if (compatible[userElement]?.includes(hourElement)) {
      return 'strong';
    }
    
    // Opposite elements = challenging (not "bad", but frictional)
    const opposites: Record<Element, Element> = {
      Fire: 'Water',
      Water: 'Fire',
      Air: 'Earth',
      Earth: 'Air'
    };
    
    if (opposites[userElement] === hourElement) {
      return 'challenging';
    }
    
    // Default = favorable
    return 'favorable';
  }
  
  /**
   * Get human-readable alignment description
   */
  private static getAlignmentDescription(
    alignment: string,
    userElement: Element,
    hourElement: Element
  ): string {
    const descriptions: Record<string, string> = {
      exceptional: `Your ${userElement} nature perfectly aligns with this ${hourElement} hour. Optimal time for spiritual work.`,
      strong: `Your ${userElement} nature harmonizes strongly with this ${hourElement} hour. Excellent conditions for practice.`,
      favorable: `Your ${userElement} nature works well with this ${hourElement} hour. Good time for spiritual activities.`,
      moderate: `Your ${userElement} nature has moderate compatibility with this ${hourElement} hour. Steady practice recommended.`,
      balanced: `Your ${userElement} nature seeks balance with this ${hourElement} hour. Focus on equilibrium in practice.`,
      challenging: `Your ${userElement} nature meets its opposite in this ${hourElement} hour. Keep practices gentle, grounded, and consistent.`
    };
    
    return descriptions[alignment] || descriptions.favorable;
  }
  
  // ==========================================================================
  // DIVINE NAME SELECTION
  // ==========================================================================
  
  /**
   * Select optimal Divine Name based on multiple factors
   * 
   * Selection algorithm considers:
   * 1. Planetary hour compatibility (primary and secondary planets)
   * 2. Elemental resonance with user's nature
   * 3. Prayer appropriateness (best times)
   * 4. Numerological alignment (abjad values)
   * 
   * Returns highest-scoring name with reasoning and recommended count.
   */
  private static selectDivineName(
    prayer: Prayer,
    userElement: Element,
    planetaryHour: Planet,
    hourElement: Element,
    alignment: string,
    userReduction: number
  ) {
    // Get candidates that match planetary hour
    const hourCandidates = getDivineNamesByPlanet(planetaryHour);
    
    // Also get prayer-appropriate names
    const prayerCandidates = getDivineNamesForPrayer(prayer);
    
    // Combine and deduplicate
    const allCandidates = [...new Map(
      [...hourCandidates, ...prayerCandidates].map(n => [n.number, n])
    ).values()];
    
    if (allCandidates.length === 0) {
      // Fallback to first available name
      return this.getDefaultDivineName(prayer, userElement);
    }
    
    // Score each candidate
    const scored = allCandidates.map(name => ({
      name,
      score: this.calculateNameScore(name, userElement, planetaryHour, prayer, userReduction)
    }));
    
    // Sort by score (highest first)
    scored.sort((a, b) => b.score - a.score);
    
    const selected = scored[0].name;
    
    // Determine recitation count based on alignment
    const count = this.determineCount(alignment, selected.recommendedCounts);

    const planetMatch =
      selected.primaryPlanet === planetaryHour
        ? 'primary'
        : selected.secondaryPlanets?.includes(planetaryHour)
          ? 'secondary'
          : 'none';

    const reductionNote =
      selected.reduction === userReduction
        ? `This matches your personal reduction (${userReduction}).`
        : `Your personal reduction is ${userReduction}.`;

    const alignmentNote =
      alignment === 'challenging'
        ? `Your ${userElement} nature is opposite the hour's ${hourElement} influence, so this recommendation emphasizes clarity and steadiness.`
        : alignment === 'balanced'
          ? `This is a balancing hour between your ${userElement} nature and the hour's ${hourElement} influence.`
          : `This hour supports your ${userElement} nature.`;

    const planetaryNote =
      planetMatch === 'primary'
        ? `Primary planetary correspondence: ${planetaryHour}.`
        : planetMatch === 'secondary'
          ? `Secondary planetary correspondence: ${planetaryHour}.`
          : `Chosen primarily for prayer suitability and overall harmony during the ${planetaryHour} hour.`;
    
    return {
      arabic: selected.arabic,
      transliteration: selected.transliteration,
      translationKey: selected.translationKey,
      count,
      abjadValue: selected.abjadValue,
      reasoning: {
        planetaryAlignment: planetaryNote,
        elementalResonance: `${alignmentNote} ${selected.element === userElement ? `It also matches your element (${userElement}).` : `It carries a ${selected.element} tone, which can help modulate the moment.`}`,
        numerologicalSignificance: `Abjad value ${selected.abjadValue} reduces to ${selected.reduction}. ${reductionNote}`,
        classicalSource: selected.sources[0]?.text || 'Classical Islamic tradition'
      },
      benefitKeys: selected.benefitKeys
    };
  }
  
  /**
   * Calculate compatibility score for a Divine Name
   * 
   * Scoring system:
   * - Primary planet match: 5 points
   * - Secondary planet match: 3 points
   * - Element match: 4 points
   * - Prayer time match: 2 points
   * - Numerological resonance: 1-3 points
   */
  private static calculateNameScore(
    name: DivineNamePlanetary,
    userElement: Element,
    planet: Planet,
    prayer: Prayer,
    userReduction: number
  ): number {
    let score = 0;
    
    // Planetary alignment (most important)
    if (name.primaryPlanet === planet) {
      score += 5;
    }
    if (name.secondaryPlanets?.includes(planet)) {
      score += 3;
    }
    
    // Elemental resonance
    if (name.element === userElement) {
      score += 4;
    }
    
    // Prayer appropriateness
    if (name.bestTimes.prayers.includes(prayer)) {
      score += 2;
    }
    
    // Numerological harmony (1-9 reduction match)
    if (name.reduction === userReduction) {
      score += 3;
    } else if (Math.abs(name.reduction - userReduction) <= 2) {
      score += 1;
    }
    
    return score;
  }
  
  /**
   * Determine recitation count based on alignment strength
   * 
   * - Exceptional alignment: Highest count (maximum spiritual benefit)
   * - Strong: High count
   * - Favorable: Medium count
   * - Moderate/Balanced: Lower count (still beneficial)
   */
  private static determineCount(
    alignment: string,
    recommendedCounts: number[]
  ): number {
    if (!recommendedCounts || recommendedCounts.length === 0) {
      return 33; // Default Islamic count
    }
    
    switch (alignment) {
      case 'exceptional':
        // Highest count for optimal alignment
        return recommendedCounts[recommendedCounts.length - 1];
      case 'strong':
        // High count
        return recommendedCounts[Math.max(0, recommendedCounts.length - 2)] || recommendedCounts[recommendedCounts.length - 1];
      case 'favorable':
        // Medium count
        return recommendedCounts[Math.floor(recommendedCounts.length / 2)] || 33;
      default:
        // Lower count for balanced/moderate
        return recommendedCounts[0] || 11;
    }
  }
  
  /**
   * Fallback Divine Name when no suitable candidates found
   */
  private static getDefaultDivineName(prayer: Prayer, userElement: Element) {
    // Default to Al-Rahman (The Most Merciful) - universal and always appropriate
    const defaultName = DIVINE_NAMES_PLANETARY.find(n => n.number === 1);
    
    if (!defaultName) {
      throw new Error('Divine Names database not loaded');
    }
    
    return {
      arabic: defaultName.arabic,
      transliteration: defaultName.transliteration,
      translationKey: defaultName.translationKey,
      count: 33,
      abjadValue: defaultName.abjadValue,
      reasoning: {
        planetaryAlignment: 'Universal Divine Name appropriate for all times',
        elementalResonance: `Compatible with your ${userElement} nature`,
        numerologicalSignificance: `Abjad value ${defaultName.abjadValue}`,
        classicalSource: 'Universally accepted across all Islamic traditions'
      },
      benefitKeys: defaultName.benefitKeys
    };
  }
  
  // ==========================================================================
  // ADHKAR RETRIEVAL
  // ==========================================================================
  
  /**
   * Get standard Sunnah adhkar for the prayer
   */
  private static getAdhkar(prayer: Prayer): Dhikr[] {
    const adhkar = getSunnahAdhkarForPrayer(prayer);
    return adhkar || [];
  }
  
  /**
   * Get optional classical practices for the prayer
   */
  private static getClassicalPractices(prayer: Prayer) {
    const prayerAdhkar = getAdhkarForPrayer(prayer);
    return prayerAdhkar?.classicalPractices || [];
  }
  
  // ==========================================================================
  // UTILITY METHODS
  // ==========================================================================
  
  /**
   * Get Arabic name for prayer
   */
  private static getArabicPrayerName(prayer: Prayer): string {
    const arabicNames: Record<Prayer, string> = {
      Fajr: 'الفجر',
      Dhuhr: 'الظهر',
      Asr: 'العصر',
      Maghrib: 'المغرب',
      Isha: 'العشاء'
    };
    
    return arabicNames[prayer];
  }
  
  /**
   * Get ruling planet for the day
   */
  private static getDayRuler(date: Date): Planet {
    const dayNames: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayIndex = date.getDay(); // 0 = Sunday
    const dayName = dayNames[dayIndex];
    
    // First hour of the day determines the day's ruler (Chaldean order)
    const sequence = PLANETARY_HOUR_SEQUENCE[dayName];
    return sequence[0];
  }
  
  /**
   * Get day name from date
   */
  private static getDayName(date: Date): DayOfWeek {
    const dayNames: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return dayNames[date.getDay()];
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default PrayerGuidanceEngine;
