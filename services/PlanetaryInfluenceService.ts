/**
 * Planetary Influence Service
 * ===========================
 * 
 * Provides personalized planetary transit interpretation based on:
 * - Degree position within sign (Entry/Stabilization/Completion)
 * - Elemental resonance with user's nature
 * - Scope of planetary influence (Universal/Personal/Immediate)
 * 
 * Aligned with classical Ilm al-Nujūm principles:
 * - Educational and reflective, not predictive
 * - Teaches timing, not control
 * - Ethical spiritual guidance only
 */

import type { Element } from './MomentAlignmentService';
import type { Planet } from './PlanetaryHoursService';
import { tStatic, type AppLanguage } from './StaticI18n';

// ============================================================================
// TYPES
// ============================================================================

export type PlanetInfluenceType = 'universal' | 'personal' | 'immediate';

export type DegreeStage = 'entry' | 'stabilization' | 'completion';

export type ElementalResonance = 'harmonious' | 'supportive' | 'neutral' | 'challenging';

export interface DegreeStageInfo {
  stage: DegreeStage;
  degree: number;
  description: string;
  guidance: {
    supported: string[];
    avoid: string[];
    practices: string[];
  };
}

export interface PersonalizedInfluence {
  influenceType: PlanetInfluenceType;
  scope: string;
  degreeStage: DegreeStageInfo;
  elementalResonance: ElementalResonance;
  resonanceExplanation: string;
  collectiveSummary: string; // Always present - cosmic weather
  personalSummary: string;   // Always present - how it relates to user
  personalizedGuidance: {
    bestFor: string[];
    avoid: string[];
    reflectivePractices: string[];
    timing: string;
  };
}

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Planet classification by influence scope
 */
const UNIVERSAL_PLANETS: Planet[] = ['Saturn', 'Jupiter'];
const PERSONAL_PLANETS: Planet[] = ['Mars', 'Venus', 'Mercury'];
const IMMEDIATE_PLANETS: Planet[] = ['Moon', 'Sun'];

/**
 * Elemental resonance matrix
 * Maps user element × transit element → resonance type
 */
const ELEMENTAL_RESONANCE_MATRIX: Record<Element, Record<Element, ElementalResonance>> = {
  fire: {
    fire: 'harmonious',
    air: 'supportive',
    earth: 'challenging',
    water: 'challenging',
  },
  water: {
    water: 'harmonious',
    earth: 'supportive',
    fire: 'challenging',
    air: 'neutral',
  },
  air: {
    air: 'harmonious',
    fire: 'supportive',
    water: 'neutral',
    earth: 'challenging',
  },
  earth: {
    earth: 'harmonious',
    water: 'supportive',
    air: 'challenging',
    fire: 'challenging',
  },
};

// ============================================================================
// PLANET INFLUENCE TYPE
// ============================================================================

/**
 * Get the influence type of a planet
 */
export function getPlanetInfluenceType(planet: Planet): PlanetInfluenceType {
  if (UNIVERSAL_PLANETS.includes(planet)) return 'universal';
  if (PERSONAL_PLANETS.includes(planet)) return 'personal';
  return 'immediate';
}

/**
 * Get scope description for planet influence type
 */
export function getInfluenceScope(influenceType: PlanetInfluenceType, lang: AppLanguage = 'en'): string {
  if (lang === 'fr') {
    switch (influenceType) {
      case 'universal':
        return "Cela façonne l’atmosphère collective et les thèmes de long terme";
      case 'personal':
        return "Cela influence la façon dont vous agissez, ressentez et décidez";
      case 'immediate':
        return "Cela colore le moment présent et les rythmes quotidiens";
    }
  }

  if (lang === 'ar') {
    switch (influenceType) {
      case 'universal':
        return 'يُشكّل هذا الأجواء العامة والمواضيع بعيدة المدى';
      case 'personal':
        return 'يؤثر هذا على طريقة تصرفك وشعورك واتخاذ قراراتك';
      case 'immediate':
        return 'يُلوّن هذا اللحظة الحالية وإيقاع اليوم';
    }
  }

  switch (influenceType) {
    case 'universal':
      return 'This shapes the collective atmosphere and long-term themes';
    case 'personal':
      return 'This influences how you act, feel, and make decisions';
    case 'immediate':
      return 'This colors the current moment and daily rhythms';
  }
}

// ============================================================================
// DEGREE STAGE ANALYSIS
// ============================================================================

/**
 * Determine degree stage from planet's position in sign
 */
export function getDegreeStage(degree: number): DegreeStage {
  if (degree >= 0 && degree < 10) return 'entry';
  if (degree >= 10 && degree < 20) return 'stabilization';
  return 'completion';
}

/**
 * Get detailed degree stage information with guidance
 */
export function getDegreeStageInfo(
  planet: Planet,
  degree: number,
  influenceType: PlanetInfluenceType,
  lang: AppLanguage = 'en'
): DegreeStageInfo {
  const stage = getDegreeStage(degree);
  
  // Base guidance templates by stage
  const stageGuidance = getStageGuidance(stage, influenceType, lang);
  
  // Planet-specific modifiers
  const planetGuidance = getPlanetSpecificGuidance(planet, stage, lang);
  
  return {
    stage,
    degree,
    description: stageGuidance.description,
    guidance: {
      supported: [...stageGuidance.supported, ...planetGuidance.supported],
      avoid: [...stageGuidance.avoid, ...planetGuidance.avoid],
      practices: [...stageGuidance.practices, ...planetGuidance.practices],
    },
  };
}

function getStageGuidance(stage: DegreeStage, influenceType: PlanetInfluenceType, lang: AppLanguage) {
  const isUniversal = influenceType === 'universal';
  
  switch (stage) {
    case 'entry':
      return {
        description:
          lang === 'fr'
            ? 'Phase initiale — les énergies sont instables et se forment'
            : lang === 'ar'
              ? 'مرحلة مبكرة — الطاقات غير مستقرة وتتكوّن'
              : 'Early phase - energies are unstable and forming',
        supported: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.observationAndPatience'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.planningWithoutRushing'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.seekingClarityBeforeActing'),
        ],
        avoid: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.forcingDecisions'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.majorCommitments'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.hastyActions'),
        ],
        practices: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.istighfarSeekingForgiveness'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.duaForGuidance'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.contemplationAndSilence'),
        ],
      };
      
    case 'stabilization':
      return {
        description:
          lang === 'fr'
            ? 'Phase de pointe — les énergies sont stables et optimales'
            : lang === 'ar'
              ? 'مرحلة الذروة — الطاقات مستقرة ومثالية'
              : 'Peak phase - energies are stable and optimal',
        supported: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.takingAlignedAction'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.makingImportantDecisions'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.beginningNewInitiatives'),
        ],
        avoid: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.procrastination'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.ignoringOpportunities'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.excessiveHesitation'),
        ],
        practices: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.shukrGratitude'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.salawatUponTheProphet'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.purposefulActionWithIntention'),
        ],
      };
      
    case 'completion':
      return {
        description:
          lang === 'fr'
            ? 'Phase finale — les énergies s’estompent ou deviennent plus lourdes'
            : lang === 'ar'
              ? 'مرحلة ختامية — الطاقات تخفت أو تصبح ثقيلة'
              : 'Closing phase - energies are fading or heavy',
        supported: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.completingExistingWork'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.reflectionAndReview'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.releasingWhatNoLongerServes'),
        ],
        avoid: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.startingNewProjects'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.majorDecisions'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.pushingAgainstResistance'),
        ],
        practices: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.tasbihGlorification'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.closingPrayersAndGratitude'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.restAndRestoration'),
        ],
      };
  }
}

function getPlanetSpecificGuidance(planet: Planet, stage: DegreeStage, lang: AppLanguage) {
  // Planet-specific wisdom based on classical tradition
  const planetGuidance: Record<Planet, Record<DegreeStage, { supported: string[]; avoid: string[]; practices: string[] }>> = {
    Saturn: {
      entry: {
        supported: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.acceptLimitations'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.buildFoundationsSlowly'),
        ],
        avoid: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.rebellionAgainstStructure'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.shortcuts'),
        ],
        practices: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.patienceSabr'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.trustInDivineTimingTawakkul'),
        ],
      },
      stabilization: {
        supported: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.disciplineAndCommitment'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.longTermPlanning'),
        ],
        avoid: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.laziness'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.avoidingResponsibility'),
        ],
        practices: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.consistentWorship'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.fulfillingObligations'),
        ],
      },
      completion: {
        supported: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.harvestLessonsLearned'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.honorCommitmentsMade'),
        ],
        avoid: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.bitterness'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.regretWithoutAction'),
        ],
        practices: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.gratitudeForTrials'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.duaForRelief'),
        ],
      },
    },
    Jupiter: {
      entry: {
        supported: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.opennessToExpansion'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.learningAndTeaching'),
        ],
        avoid: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.overconfidence'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.excess'),
        ],
        practices: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.seekingKnowledge'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.generosityInMeasure'),
        ],
      },
      stabilization: {
        supported: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.growthOpportunities'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.sharingWisdom'),
        ],
        avoid: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.greed'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.takingMoreThanNeeded'),
        ],
        practices: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.sadaqahCharity'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.teachingOthers'),
        ],
      },
      completion: {
        supported: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.integrateWhatWasGained'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.shareBlessings'),
        ],
        avoid: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.hoarding'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.prideInAchievements'),
        ],
        practices: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.humility'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.passingKnowledgeForward'),
        ],
      },
    },
    Mars: {
      entry: {
        supported: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.assessChallengesCarefully'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.buildCourage'),
        ],
        avoid: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.impulsiveAnger'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.rushingIntoConflict'),
        ],
        practices: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.controllingAngerGhayz'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.seekingCalm'),
        ],
      },
      stabilization: {
        supported: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.courageousAction'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.defendingTruth'),
        ],
        avoid: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.aggression'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.harmingOthers'),
        ],
        practices: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.jihadAlNafsInnerStruggle'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.righteousEffort'),
        ],
      },
      completion: {
        supported: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.completeBattlesWisely'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.forgiveWhenAble'),
        ],
        avoid: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.prolongingConflict'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.holdingGrudges'),
        ],
        practices: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.forgivenessAfw'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.peaceMaking'),
        ],
      },
    },
    Venus: {
      entry: {
        supported: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.exploreValuesAndDesires'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.appreciateBeauty'),
        ],
        avoid: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.attachmentToFleetingPleasures'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.vanity'),
        ],
        practices: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.gratitudeForBlessings'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.moderation'),
        ],
      },
      stabilization: {
        supported: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.buildMeaningfulConnections'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.createBeauty'),
        ],
        avoid: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.superficiality'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.excessIndulgence'),
        ],
        practices: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.actsOfKindness'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.artisticExpression'),
        ],
      },
      completion: {
        supported: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.releaseAttachments'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.appreciateWhatRemains'),
        ],
        avoid: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.clingingToWhatsEnding'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.jealousy'),
        ],
        practices: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.contentmentQanah'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.trustInProvision'),
        ],
      },
    },
    Mercury: {
      entry: {
        supported: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.listenMoreThanSpeak'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.gatherInformation'),
        ],
        avoid: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.gossip'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.hastyConclusions'),
        ],
        practices: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.mindfulSpeech'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.activeListening'),
        ],
      },
      stabilization: {
        supported: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.clearCommunication'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.learningAndTeaching'),
        ],
        avoid: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.deception'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.withholdingTruth'),
        ],
        practices: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.speakingTruthWithWisdom'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.sharingKnowledge'),
        ],
      },
      completion: {
        supported: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.concludeConversations'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.summarizeLearnings'),
        ],
        avoid: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.overExplaining'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.endlessDebate'),
        ],
        practices: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.silenceWhenNeeded'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.reflectionOnWords'),
        ],
      },
    },
    Sun: {
      entry: {
        supported: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.clarifyIntentions'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.identifyPurpose'),
        ],
        avoid: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.egoDrivenAction'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.seekingValidation'),
        ],
        practices: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.ikhlasSincerity'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.purifyingIntention'),
        ],
      },
      stabilization: {
        supported: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.leadWithIntegrity'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.shineYourGifts'),
        ],
        avoid: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.arrogance'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.overshadowingOthers'),
        ],
        practices: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.humilityInService'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.authenticExpression'),
        ],
      },
      completion: {
        supported: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.acknowledgeAchievementsHumbly'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.rest'),
        ],
        avoid: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.burnout'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.pride'),
        ],
        practices: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.gratitudeToAllah'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.renewal'),
        ],
      },
    },
    Moon: {
      entry: {
        supported: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.honorEmotions'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.nurtureYourself'),
        ],
        avoid: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.emotionalReactivity'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.ignoringFeelings'),
        ],
        practices: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.dhikrForPeace'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.selfCompassion'),
        ],
      },
      stabilization: {
        supported: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.trustIntuition'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.careForOthers'),
        ],
        avoid: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.emotionalManipulation'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.codependency'),
        ],
        practices: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.prayerForEmotionalHealing'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.actsOfNurturing'),
        ],
      },
      completion: {
        supported: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.releaseEmotionalBaggage'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.forgive'),
        ],
        avoid: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.holdingOntoPain'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.bitterness'),
        ],
        practices: [
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.emotionalCleansingDua'),
          tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.lettingGo'),
        ],
      },
    },
  };
  
  return planetGuidance[planet][stage];
}

// ============================================================================
// ELEMENTAL RESONANCE
// ============================================================================

/**
 * Calculate elemental resonance between user and transit
 */
export function getElementalResonance(
  userElement: Element,
  transitElement: Element
): ElementalResonance {
  return ELEMENTAL_RESONANCE_MATRIX[userElement][transitElement];
}

/**
 * Get explanation of elemental resonance
 */
export function getResonanceExplanation(
  resonance: ElementalResonance,
  userElement: Element,
  transitElement: Element,
  planet: Planet,
  lang: AppLanguage = 'en'
): string {
  const elementNames: Record<AppLanguage, Record<Element, string>> = {
    en: {
      fire: 'Fire',
      water: 'Water',
      air: 'Air',
      earth: 'Earth',
    },
    fr: {
      fire: 'Feu',
      water: 'Eau',
      air: 'Air',
      earth: 'Terre',
    },
    ar: {
      fire: 'نار',
      water: 'ماء',
      air: 'هواء',
      earth: 'أرض',
    },
  };
  
  const user = elementNames[lang]?.[userElement] ?? elementNames.en[userElement];
  const transit = elementNames[lang]?.[transitElement] ?? elementNames.en[transitElement];

  if (lang === 'fr') {
    switch (resonance) {
      case 'harmonious':
        return `${planet} en ${transit} correspond parfaitement à votre nature ${user}. Ce transit parle votre langage — laissez-le circuler naturellement.`;
      case 'supportive':
        return `${planet} en ${transit} soutient votre nature ${user}. Comme des compagnons sur un chemin, vous vous renforcez mutuellement.`;
      case 'neutral':
        return `${planet} en ${transit} a une relation mitigée avec votre nature ${user}. Observez sans forcer l’alignement.`;
      case 'challenging':
        return `${planet} en ${transit} crée une tension avec votre nature ${user}. C’est là que la croissance se produit — non pas le confort, mais la transformation.`;
    }
  }

  if (lang === 'ar') {
    switch (resonance) {
      case 'harmonious':
        return `${planet} في ${transit} ينسجم تمامًا مع طبيعتك ${user}. هذا العبور يتحدث لغتك — سر معه بسلاسة.`;
      case 'supportive':
        return `${planet} في ${transit} يدعم طبيعتك ${user}. كما الرفقاء على طريق واحد، يقوّي بعضكما بعضًا.`;
      case 'neutral':
        return `${planet} في ${transit} له علاقة مختلطة مع طبيعتك ${user}. راقب دون أن تفرض الانسجام.`;
      case 'challenging':
        return `${planet} في ${transit} يخلق توترًا مع طبيعتك ${user}. هنا يحدث النمو — ليس راحة، بل تحول.`;
    }
  }
  
  switch (resonance) {
    case 'harmonious':
      return `${planet} in ${transit} matches your ${user} nature perfectly. This transit speaks your language — flow with it naturally.`;
      
    case 'supportive':
      return `${planet} in ${transit} supports your ${user} nature. Like companions on a path, you strengthen each other.`;
      
    case 'neutral':
      return `${planet} in ${transit} has a mixed relationship with your ${user} nature. Observe without forcing alignment.`;
      
    case 'challenging':
      return `${planet} in ${transit} creates tension with your ${user} nature. This is where growth happens — not comfort, but transformation.`;
  }
}

// ============================================================================
// PERSONALIZED GUIDANCE
// ============================================================================

/**
 * Generate complete personalized influence analysis
 */
export function getPersonalizedInfluence(
  planet: Planet,
  signDegree: number,
  transitElement: Element,
  userElement: Element,
  isInUserSign: boolean,
  lang: AppLanguage = 'en'
): PersonalizedInfluence {
  const influenceType = getPlanetInfluenceType(planet);
  const scope = getInfluenceScope(influenceType, lang);
  const degreeStage = getDegreeStageInfo(planet, signDegree, influenceType, lang);
  const elementalResonance = getElementalResonance(userElement, transitElement);
  const resonanceExplanation = getResonanceExplanation(
    elementalResonance,
    userElement,
    transitElement,
    planet,
    lang
  );
  
  // Build personalized guidance
  const guidance = buildPersonalizedGuidance(
    planet,
    degreeStage,
    elementalResonance,
    isInUserSign,
    lang
  );
  
  // Generate collective and personal summaries
  const collectiveSummary = getCollectiveSummary(planet, degreeStage.stage, lang);
  const personalSummary = getPersonalSummary(planet, isInUserSign, elementalResonance, lang);
  
  return {
    influenceType,
    scope,
    degreeStage,
    elementalResonance,
    resonanceExplanation,
    collectiveSummary,
    personalSummary,
    personalizedGuidance: guidance,
  };
}

function buildPersonalizedGuidance(
  planet: Planet,
  degreeStage: DegreeStageInfo,
  resonance: ElementalResonance,
  isInUserSign: boolean,
  lang: AppLanguage
) {
  const base = degreeStage.guidance;
  
  // Modify based on resonance
  const resonanceModifier = getResonanceModifier(resonance, lang);
  
  // Modify based on whether in user's sign
  const personalModifier = isInUserSign
    ? {
        prefix: lang === 'fr' ? 'Dans votre signe :' : lang === 'ar' ? 'في برجك:' : 'In your sign:',
        intensity:
          lang === 'fr'
            ? 'Cela vous affecte directement et personnellement.'
            : lang === 'ar'
              ? 'يؤثر هذا عليك بشكل مباشر وشخصي.'
              : 'This affects you directly and personally.',
      }
    : {
        prefix: lang === 'fr' ? 'Influence générale :' : lang === 'ar' ? 'تأثير عام:' : 'General influence:',
        intensity:
          lang === 'fr'
            ? 'Vous le ressentez comme une ambiance de fond.'
            : lang === 'ar'
              ? 'تشعر بهذا كأجواء في الخلفية.'
              : 'You feel this as background atmosphere.',
      };
  
  return {
    bestFor: [
      ...base.supported,
      ...resonanceModifier.bestFor,
    ],
    avoid: [
      ...base.avoid,
      ...resonanceModifier.avoid,
    ],
    reflectivePractices: base.practices,
    timing: `${personalModifier.prefix} ${personalModifier.intensity}`,
  };
}

function getResonanceModifier(resonance: ElementalResonance, lang: AppLanguage) {
  switch (resonance) {
    case 'harmonious':
      return {
        bestFor: [tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.trustYourNaturalInstincts')],
        avoid: [tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.doubtingYourselfUnnecessarily')],
      };
    case 'supportive':
      return {
        bestFor: [tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.collaborateWithTheEnergy')],
        avoid: [tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.forcingYourWayAlone')],
      };
    case 'neutral':
      return {
        bestFor: [tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.stayFlexibleAndObservant')],
        avoid: [tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.strongCommitmentsEitherWay')],
      };
    case 'challenging':
      return {
        bestFor: [tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.patienceAndLearningFromFriction')],
        avoid: [tStatic(lang, 'home.planetTransitDetails.influenceEngine.items.fightingAgainstTheCurrent')],
      };
  }
}

/**
 * Get collective impact summary (cosmic weather) for a planet
 */
function getCollectiveSummary(planet: Planet, stage: DegreeStage, lang: AppLanguage): string {
  const stagePrefix =
    lang === 'fr'
      ? stage === 'entry'
        ? 'Commence à se construire'
        : stage === 'stabilization'
          ? 'À son apogée'
          : 'S’apaise'
      : lang === 'ar'
        ? stage === 'entry'
          ? 'يبدأ بالتكوّن'
          : stage === 'stabilization'
            ? 'في ذروته'
            : 'يتراجع تدريجيًا'
        : stage === 'entry'
          ? 'Beginning to build'
          : stage === 'stabilization'
            ? 'At peak strength'
            : 'Winding down';

  if (lang === 'fr') {
    switch (planet) {
      case 'Saturn':
        return `${stagePrefix} : Accent collectif sur la responsabilité, la structure et les fondations durables. Temps de discipline et d’endurance.`;
      case 'Jupiter':
        return `${stagePrefix} : Expansion collective, optimisme et opportunités d’apprentissage. Des thèmes de croissance et d’abondance émergent.`;
      case 'Mars':
        return `${stagePrefix} : Élan collectif, urgence et énergie orientée vers l’action. Tension ou passion dans l’air.`;
      case 'Venus':
        return `${stagePrefix} : Accent collectif sur l’harmonie, les relations, la beauté et le confort. Courants sociaux plus doux.`;
      case 'Mercury':
        return `${stagePrefix} : Accent collectif sur la communication, les accords et l’activité mentale. Les informations circulent rapidement.`;
      case 'Sun':
        return `${stagePrefix} : Identité collective, leadership et visibilité. L’ambiance se centre sur le but et l’expression de soi.`;
      case 'Moon':
        return `${stagePrefix} : Marées émotionnelles collectives, sentiment public et soin du foyer/corps. La sensibilité s’intensifie.`;
    }
  }

  if (lang === 'ar') {
    switch (planet) {
      case 'Saturn':
        return `${stagePrefix}: تركيز جماعي على المسؤولية والبنية والأسس بعيدة المدى. وقت للانضباط والثبات.`;
      case 'Jupiter':
        return `${stagePrefix}: توسّع جماعي وتفاؤل وفرص للتعلّم. تبرز موضوعات النمو والوفرة.`;
      case 'Mars':
        return `${stagePrefix}: دافع جماعي وإلحاح وطاقة موجهة للفعل. توتر أو شغف في الأجواء.`;
      case 'Venus':
        return `${stagePrefix}: تركيز جماعي على الانسجام والعلاقات والجمال والراحة. تيارات اجتماعية ألطف.`;
      case 'Mercury':
        return `${stagePrefix}: تركيز جماعي على التواصل والعقود والنشاط الذهني. تتدفق المعلومات بسرعة.`;
      case 'Sun':
        return `${stagePrefix}: موضوعات الهوية والقيادة والظهور. المزاج يتمحور حول الهدف والتعبير عن الذات.`;
      case 'Moon':
        return `${stagePrefix}: مدّ عاطفي جماعي وشعور عام واهتمام بالبيت/الجسد. تزداد الحساسية.`;
    }
  }

  switch (planet) {
    case 'Saturn':
      return `${stagePrefix}: Collective focus on responsibility, structure, and long-term foundations. Time for discipline and endurance.`;
    case 'Jupiter':
      return `${stagePrefix}: Collective expansion, optimism, and learning opportunities. Growth and abundance themes emerge.`;
    case 'Mars':
      return `${stagePrefix}: Collective drive, urgency, and action-oriented energy. Tension or passion in the air.`;
    case 'Venus':
      return `${stagePrefix}: Collective focus on harmony, relationships, beauty, and comfort. Softer social currents.`;
    case 'Mercury':
      return `${stagePrefix}: Collective emphasis on communication, contracts, and mental activity. Information flows rapidly.`;
    case 'Sun':
      return `${stagePrefix}: Collective identity, leadership, and visibility themes. The mood centers on purpose and self-expression.`;
    case 'Moon':
      return `${stagePrefix}: Collective emotional tides, public feeling, and care for home/body. Sensitivity heightens.`;
  }
}

/**
 * Get personal relevance summary based on resonance and whether in user's sign
 */
function getPersonalSummary(
  planet: Planet,
  isInUserSign: boolean,
  resonance: ElementalResonance,
  lang: AppLanguage
): string {
  if (isInUserSign) {
    if (lang === 'fr') {
      return "Ce transit est directement dans votre signe — vous êtes au centre. L’énergie façonne votre trajectoire, votre identité et votre environnement immédiat.";
    }
    if (lang === 'ar') {
      return 'هذا العبور يقع مباشرة في برجك — أنت في مركز التأثير. الطاقة تشكّل مسارك وهويتك وبيئتك القريبة.';
    }
    return `This transit is directly in your sign - you are the focal point. The energy shapes your path, identity, and immediate environment.`;
  }
  
  const resonanceNote =
    lang === 'fr'
      ? resonance === 'harmonious'
        ? "s’accorde naturellement avec votre nature élémentaire"
        : resonance === 'supportive'
          ? "soutient votre nature élémentaire"
          : resonance === 'challenging'
            ? "crée une friction avec votre nature élémentaire"
            : "a une relation neutre avec votre nature élémentaire"
      : lang === 'ar'
        ? resonance === 'harmonious'
          ? 'ينسجم طبيعيًا مع طبيعتك العنصرية'
          : resonance === 'supportive'
            ? 'يدعم طبيعتك العنصرية'
            : resonance === 'challenging'
              ? 'يُحدث احتكاكًا مع طبيعتك العنصرية'
              : 'له علاقة محايدة مع طبيعتك العنصرية'
        : resonance === 'harmonious'
          ? 'flows naturally with your elemental nature'
          : resonance === 'supportive'
            ? 'complements your elemental nature'
            : resonance === 'challenging'
              ? 'creates friction with your elemental nature'
              : 'has a neutral relationship with your elemental nature';

  if (lang === 'fr') {
    return `Ce transit ne vise pas directement votre signe, mais ${resonanceNote}. Vous le ressentez à travers l’environnement, les responsabilités et l’humeur collective.`;
  }
  if (lang === 'ar') {
    return `هذا العبور لا يستهدف برجك مباشرة، لكنه ${resonanceNote}. تشعر به عبر البيئة والمسؤوليات والمزاج العام.`;
  }
  return `This transit doesn't target your sign directly, but ${resonanceNote}. You feel it through environment, responsibilities, and collective mood.`;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get degree stage badge color
 */
export function getDegreeStageColor(stage: DegreeStage): string {
  switch (stage) {
    case 'entry':
      return '#9E9E9E'; // Gray
    case 'stabilization':
      return '#4CAF50'; // Green
    case 'completion':
      return '#FF6B35'; // Orange
  }
}

/**
 * Get degree stage icon
 */
export function getDegreeStageIcon(stage: DegreeStage): string {
  switch (stage) {
    case 'entry':
      return 'arrow-forward-circle';
    case 'stabilization':
      return 'checkmark-circle';
    case 'completion':
      return 'arrow-back-circle';
  }
}

/**
 * Get influence type badge color
 */
export function getInfluenceTypeColor(type: PlanetInfluenceType): string {
  switch (type) {
    case 'universal':
      return '#6495ED'; // Cornflower blue
    case 'personal':
      return '#9C27B0'; // Purple
    case 'immediate':
      return '#FF9800'; // Orange
  }
}
