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

import { NameDestinyResult } from '../ilm-huruf/core';
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
import { calculateSpiritualDestiny } from '../../utils/relationshipCompatibility';
import { getNormalizedAbjadValue } from './divineNamesData';

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
  explanation: { en: string; ar: string };
} {
  
  // Same element = Taqwiyah (Strengthening)
  if (personElement === nameElement) {
    return {
      effect: 'strengthens',
      explanation: {
        en: `Taqwiyah (تقوية) — This Name reinforces your innate ${personElement} temperament, amplifying its natural expression.`,
        ar: `تقوية — هذا الاسم يُعزّز طبيعتك ${getElementArabic(personElement)} الفطرية، مُقوّياً تعبيرها الطبيعي.`
      }
    };
  }
  
  // Supportive pairs = Muʿāwanah (Supportive Carrying)
  if (
    (personElement === 'fire' && nameElement === 'air') ||
    (personElement === 'air' && nameElement === 'fire') ||
    (personElement === 'water' && nameElement === 'earth') ||
    (personElement === 'earth' && nameElement === 'water')
  ) {
    return {
      effect: 'stabilizes',
      explanation: {
        en: `Muʿāwanah (معاونة) — This Name carries and stabilizes your ${personElement} nature, providing harmonious support.`,
        ar: `معاونة — هذا الاسم يحمل ويُثبّت طبيعتك ${getElementArabic(personElement)}، مُقدّماً دعماً متناغماً.`
      }
    };
  }
  
  // Opposing pairs = Tadbīr bi-l-Ḍidd (Governance by Opposition)
  if (
    (personElement === 'fire' && nameElement === 'water') ||
    (personElement === 'water' && nameElement === 'fire') ||
    (personElement === 'air' && nameElement === 'earth') ||
    (personElement === 'earth' && nameElement === 'air')
  ) {
    return {
      effect: 'tempers',
      explanation: {
        en: `Tadbīr bi-l-Ḍidd (تدبير بالضدّ) — This Name governs your ${personElement} nature through opposition, restraining excess and establishing regulation.`,
        ar: `تدبير بالضدّ — هذا الاسم يُدبّر طبيعتك ${getElementArabic(personElement)} بالمعارضة، كابحاً الزيادة ومُقرّراً التنظيم.`
      }
    };
  }
  
  // Transformative pairs = Taṣrīf / Taḥwīl (Transformation & Refinement)
  return {
    effect: 'challenges',
    explanation: {
      en: `Taṣrīf wa-Taḥwīl (تصريف وتحويل) — This Name transforms your ${personElement} disposition, refining it through internal change rather than comfort.`,
      ar: `تصريف وتحويل — هذا الاسم يُحوّل طبيعتك ${getElementArabic(personElement)}، مُنقّياً إياها من خلال التغيير الباطني لا الراحة.`
    }
  };
}

function analyzeManifestationGuidance(
  modeOfAction: 'fast' | 'gradual' | 'hidden',
  personElement: 'fire' | 'water' | 'air' | 'earth',
  nameElement: 'fire' | 'water' | 'air' | 'earth'
): {
  speed: 'fast' | 'delayed' | 'subtle';
  reason: { en: string; ar: string };
} {
  
  // Sarīʿ al-Athar (Apparent Effect)
  if (modeOfAction === 'fast') {
    if (personElement === 'fire' || personElement === 'air') {
      return {
        speed: 'fast',
        reason: {
          en: 'Sarīʿ al-Athar (سريع الأثر) — Your temperament allows quicker reception of this Name\'s apparent effect. Reflection may reveal changes sooner.',
          ar: 'سريع الأثر — طبيعتك تسمح باستقبال أسرع لأثر هذا الاسم الظاهر. قد يكشف التأمل عن تغييرات أسرع.'
        }
      };
    } else {
      return {
        speed: 'delayed',
        reason: {
          en: 'Sarīʿ al-Athar (سريع الأثر) — Your grounded nature receives this Name\'s effect more gradually, stabilizing it deeply over time.',
          ar: 'سريع الأثر — طبيعتك المتجذرة تستقبل أثر هذا الاسم تدريجياً، مُثبّتةً إياه عميقاً مع الوقت.'
        }
      };
    }
  }
  
  // Mutawassiṭ (Gradual Unfolding)
  if (modeOfAction === 'gradual') {
    if (personElement === 'earth') {
      return {
        speed: 'delayed',
        reason: {
          en: 'Mutawassiṭ (متوسط) — Your earthy reception mirrors the Name\'s gradual unfolding, building lasting foundations through patient reception.',
          ar: 'متوسط — استقبالك الترابي يُحاكي تكشّف الاسم التدريجي، بانياً أساسات دائمة بالاستقبال الصابر.'
        }
      };
    } else {
      return {
        speed: 'delayed',
        reason: {
          en: 'Mutawassiṭ (متوسط) — This Name unfolds gradually; your reception deepens through steady spiritual practice over time.',
          ar: 'متوسط — هذا الاسم يتكشّف تدريجياً؛ استقبالك يعمق بالممارسة الروحية الثابتة مع الوقت.'
        }
      };
    }
  }
  
  // Khafī (Inward/Subtle Effect)
  return {
    speed: 'subtle',
    reason: {
      en: 'Khafī (خفيّ) — This Name works inwardly. Its effect is subtle, revealed through inner transformation rather than outward signs.',
      ar: 'خفيّ — هذا الاسم يعمل باطنياً. أثره خفيّ، يُكشف من خلال التحول الداخلي لا بالعلامات الظاهرة.'
    }
  };
}

function getElementArabic(element: 'fire' | 'water' | 'air' | 'earth'): string {
  const map = {
    fire: 'النار',
    water: 'الماء',
    air: 'الهواء',
    earth: 'التراب'
  };
  return map[element];
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
