/**
 * Divine Name Compatibility Module
 * Person ↔ Divine Name and Divine Name ↔ Intention calculations
 * 
 * SPIRITUAL FRAMEWORK (ʿIlm al-Asrār):
 * - All calculations are for spiritual reflection (Taʾammul) and guidance (Irshād) only
 * - No predictions, guarantees, or claims of Divine obligation are implied
 * - Terminology derived from classical Maghribi/Sunni ʿIlm al-Ḥurūf tradition
 * - Maintains proper adab (أدب) toward the Divine Names
 * - Describes human reception and spiritual resonance, not Divine action constraints
 */

import { calculateSpiritualDestiny } from '../../utils/relationshipCompatibility';
import { NameDestinyResult } from '../ilm-huruf/core';
import { getNormalizedAbjadValue } from './divineNamesData';
import {
    buildCompatibilityEvaluation,
    extractSpiritualDestiny
} from './engine';
import {
    DivineNameIntentionCompatibility,
    DivineNameMetadata,
    IntentionCategory,
    PersonDivineNameCompatibility
} from './types';

// ============================================================================
// PERSON ↔ DIVINE NAME COMPATIBILITY
// ============================================================================

export function calculatePersonDivineNameCompatibility(
  personName: string,
  personArabicName: string,
  personDestiny: NameDestinyResult,
  divineName: DivineNameMetadata
): PersonDivineNameCompatibility {
  
  const destiny = extractSpiritualDestiny(personDestiny, personName);
  
  // Get normalized abjad value for Divine Name (without Al- prefix)
  const divineNameAbjadValue = getNormalizedAbjadValue(divineName.arabic);
  
  // Calculate Spiritual Destiny (mod-9) - most important compatibility metric
  const spiritualDestiny = calculateSpiritualDestiny(
    destiny.kabir, // Person's total abjad
    divineNameAbjadValue // Divine Name normalized abjad
  );
  
  // Treat Divine Name as second entity for compatibility evaluation
  const divineZahirBatin = determineDivineNameOrientation(divineName.element);
  
  const evaluation = buildCompatibilityEvaluation(
    destiny.element,
    divineName.element,
    destiny.planet,
    divineName.planet,
    destiny.zahirBatin,
    divineZahirBatin
  );
  
  // Analyze how the Divine Name acts upon the person
  const nameAction = analyzeNameAction(
    destiny.element,
    divineName.element,
    divineName.modeOfAction
  );
  
  // Manifestation guidance
  const manifestationGuidance = analyzeManifestationGuidance(
    divineName.modeOfAction,
    destiny.element,
    divineName.element
  );
  
  return {
    type: 'person-divine-name',
    person: {
      name: personName,
      arabicName: personArabicName,
      destiny
    },
    divineName,
    evaluation,
    spiritualDestiny, // Spiritual Destiny (mod-9) - primary compatibility metric
    nameAction,
    manifestationGuidance
  };
}

function determineDivineNameOrientation(element: 'fire' | 'water' | 'air' | 'earth'): 'zahir' | 'batin' | 'balanced' {
  if (element === 'fire' || element === 'air') return 'zahir';
  if (element === 'water' || element === 'earth') return 'batin';
  return 'balanced';
}

function analyzeNameAction(
  personElement: 'fire' | 'water' | 'air' | 'earth',
  nameElement: 'fire' | 'water' | 'air' | 'earth',
  modeOfAction: 'fast' | 'gradual' | 'hidden'
): {
  effect: 'strengthens' | 'stabilizes' | 'tempers' | 'challenges';
  personElement: 'fire' | 'water' | 'air' | 'earth';
  nameElement: 'fire' | 'water' | 'air' | 'earth';
} {
  
  let effect: 'strengthens' | 'stabilizes' | 'tempers' | 'challenges';
  
  // Same element = Taqwiyah (Strengthening)
  if (personElement === nameElement) {
    effect = 'strengthens';
  }
  // Supportive pairs = Muʿāwanah (Supportive Carrying)
  else if (
    (personElement === 'fire' && nameElement === 'air') ||
    (personElement === 'air' && nameElement === 'fire') ||
    (personElement === 'water' && nameElement === 'earth') ||
    (personElement === 'earth' && nameElement === 'water')
  ) {
    effect = 'stabilizes';
  }
  // Opposing pairs = Tadbīr bi-l-Ḍidd (Governance by Opposition)
  else if (
    (personElement === 'fire' && nameElement === 'water') ||
    (personElement === 'water' && nameElement === 'fire') ||
    (personElement === 'air' && nameElement === 'earth') ||
    (personElement === 'earth' && nameElement === 'air')
  ) {
    effect = 'tempers';
  }
  // Transformative pairs = Taṣrīf / Taḥwīl (Transformation & Refinement)
  else {
    effect = 'challenges';
  }
  
  return {
    effect,
    personElement,
    nameElement
  };
}

function analyzeManifestationGuidance(
  modeOfAction: 'fast' | 'gradual' | 'hidden',
  personElement: 'fire' | 'water' | 'air' | 'earth',
  nameElement: 'fire' | 'water' | 'air' | 'earth'
): {
  speed: 'fast' | 'delayed' | 'subtle';
  personElement: 'fire' | 'water' | 'air' | 'earth';
  modeOfAction: 'fast' | 'gradual' | 'hidden';
} {
  
  let speed: 'fast' | 'delayed' | 'subtle';
  
  // Sarīʿ al-Athar (Apparent Effect)
  if (modeOfAction === 'fast') {
    if (personElement === 'fire' || personElement === 'air') {
      speed = 'fast';
    } else {
      speed = 'delayed';
    }
  }
  // Mutawassiṭ (Gradual Unfolding)
  else if (modeOfAction === 'gradual') {
    speed = 'delayed';
  }
  // Khafī (Inward/Subtle Effect)
  else {
    speed = 'subtle';
  }
  
  return {
    speed,
    personElement,
    modeOfAction
  };
}

// ============================================================================
// DIVINE NAME ↔ INTENTION COMPATIBILITY
// ============================================================================

export function calculateDivineNameIntentionCompatibility(
  divineName: DivineNameMetadata,
  intention: IntentionCategory,
  allDivineNames: DivineNameMetadata[]
): DivineNameIntentionCompatibility {
  
  // Check if this Divine Name is traditionally used for this intention
  const isOptimal = divineName.classicalFunction.includes(intention);
  const isSuitable = hasRelatedFunction(divineName.classicalFunction, intention);
  
  let alignment: 'optimal' | 'suitable' | 'neutral' | 'not-recommended';
  let guidance = { en: '', ar: '' };
  let alternativeSuggestions: DivineNameMetadata[] | undefined;
  
  if (isOptimal) {
    alignment = 'optimal';
    guidance = {
      en: `${divineName.transliteration} is traditionally more aligned for ${intention} according to classical teachings. This Name resonates well with your intention.`,
      ar: `${divineName.arabic} تقليدياً أكثر توافقاً لـ ${getIntentionArabic(intention)} وفق التعاليم الكلاسيكية. هذا الاسم يتناغم مع نيتك.`
    };
  } else if (isSuitable) {
    alignment = 'suitable';
    guidance = {
      en: `${divineName.transliteration} opens adjacent spiritual doors related to ${intention}. This is a suitable choice for reflection.`,
      ar: `${divineName.arabic} يفتح أبواباً روحية مجاورة لـ ${getIntentionArabic(intention)}. هذا خيار مناسب للتأمل.`
    };
  } else {
    // Find traditionally more aligned alternatives
    alternativeSuggestions = allDivineNames
      .filter(dn => dn.classicalFunction.includes(intention))
      .slice(0, 3);
    
    if (alternativeSuggestions.length > 0) {
      alignment = 'not-recommended';
      guidance = {
        en: `According to classical attributions, ${divineName.transliteration} is not traditionally associated with ${intention}. Consider the suggested Names, which are classically more aligned for this intention.`,
        ar: `وفقاً للإسناد الكلاسيكية، ${divineName.arabic} ليس مرتبطاً تقليدياً بـ ${getIntentionArabic(intention)}. فكر في الأسماء المقترحة، والتي تتوافق كلاسيكياً أكثر لهذه النية.`
      };
    } else {
      alignment = 'neutral';
      guidance = {
        en: `${divineName.transliteration} has neutral alignment with ${intention} in classical sources. All Divine Names may be invoked with sincere intention and proper adab.`,
        ar: `${divineName.arabic} له توافق محايد مع ${getIntentionArabic(intention)} في المصادر الكلاسيكية. جميع الأسماء الإلهية يمكن الدعاء بها بنية صادقة وأدب صحيح.`
      };
    }
  }
  
  return {
    type: 'divine-intention',
    divineName,
    intention,
    alignment,
    guidance,
    alternativeSuggestions
  };
}

function hasRelatedFunction(
  nameFunctions: IntentionCategory[],
  targetIntention: IntentionCategory
): boolean {
  
  // Define related intention groups
  const relatedGroups: Record<IntentionCategory, IntentionCategory[]> = {
    clarity: ['knowledge', 'guidance'],
    patience: ['peace', 'healing'],
    provision: ['strength'],
    healing: ['peace', 'patience'],
    protection: ['strength', 'peace'],
    guidance: ['clarity', 'knowledge'],
    strength: ['protection', 'provision'],
    peace: ['healing', 'patience'],
    knowledge: ['clarity', 'guidance'],
    forgiveness: ['healing', 'peace']
  };
  
  const related = relatedGroups[targetIntention] || [];
  return nameFunctions.some(fn => related.includes(fn));
}

function getIntentionArabic(intention: IntentionCategory): string {
  const map: Record<IntentionCategory, string> = {
    clarity: 'الوضوح',
    patience: 'الصبر',
    provision: 'الرزق',
    healing: 'الشفاء',
    protection: 'الحماية',
    guidance: 'الهداية',
    strength: 'القوة',
    peace: 'السلام',
    knowledge: 'المعرفة',
    forgiveness: 'المغفرة'
  };
  return map[intention];
}
