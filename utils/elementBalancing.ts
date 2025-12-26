/**
 * Element Balancing Actions Utility
 * Returns actionable tips based on missing/weak elements
 */

import { type ElementType } from './elementTheme';

export interface BalancingActions {
  element: ElementType;
  actions: {
    en: string[];
    fr: string[];
    ar: string[];
  };
}

/**
 * Get balancing actions for missing/weak elements
 */
export function getBalancingActions(
  missingElement: ElementType,
  language: 'en' | 'fr' | 'ar' = 'en'
): string[] {
  const allActions: Record<ElementType, { en: string[]; fr: string[]; ar: string[] }> = {
    Fire: {
      en: [
        'Practice energizing activities like morning sun exposure',
        'Engage in leadership or creative projects',
        'Use warm colors (reds, oranges) in your environment',
      ],
      fr: [
        'Pratiquez des activités énergisantes comme l\'exposition au soleil matinal',
        'Engagez-vous dans des projets de leadership ou créatifs',
        'Utilisez des couleurs chaudes (rouges, oranges) dans votre environnement',
      ],
      ar: [
        'مارس الأنشطة المنشطة مثل التعرض لشمس الصباح',
        'انخرط في مشاريع قيادية أو إبداعية',
        'استخدم الألوان الدافئة (الأحمر والبرتقالي) في بيئتك',
      ],
    },
    Air: {
      en: [
        'Dedicate time to learning and intellectual pursuits',
        'Practice breathwork or meditation',
        'Engage in meaningful conversations and networking',
      ],
      fr: [
        'Consacrez du temps à l\'apprentissage et aux activités intellectuelles',
        'Pratiquez la respiration ou la méditation',
        'Engagez-vous dans des conversations significatives et du réseautage',
      ],
      ar: [
        'خصص وقتًا للتعلم والمساعي الفكرية',
        'مارس تمارين التنفس أو التأمل',
        'انخرط في محادثات هادفة وبناء العلاقات',
      ],
    },
    Water: {
      en: [
        'Honor your emotions through journaling or reflection',
        'Spend time near water bodies when possible',
        'Practice intuitive arts like dhikr or contemplation',
      ],
      fr: [
        'Honorez vos émotions par l\'écriture ou la réflexion',
        'Passez du temps près de plans d\'eau si possible',
        'Pratiquez des arts intuitifs comme le dhikr ou la contemplation',
      ],
      ar: [
        'احترم مشاعرك من خلال الكتابة أو التأمل',
        'اقض وقتًا بالقرب من المسطحات المائية عندما يكون ذلك ممكنًا',
        'مارس الفنون الحدسية مثل الذكر أو التأمل',
      ],
    },
    Earth: {
      en: [
        'Establish daily routines and grounding practices',
        'Connect with nature through walks or gardening',
        'Focus on building tangible, long-term projects',
      ],
      fr: [
        'Établissez des routines quotidiennes et des pratiques d\'ancrage',
        'Connectez-vous avec la nature par des promenades ou du jardinage',
        'Concentrez-vous sur la construction de projets tangibles à long terme',
      ],
      ar: [
        'أنشئ روتينًا يوميًا وممارسات تأريض',
        'تواصل مع الطبيعة من خلال المشي أو البستنة',
        'ركز على بناء مشاريع ملموسة طويلة الأجل',
      ],
    },
  };

  return allActions[missingElement][language];
}

/**
 * Get practical guidance based on dominant element
 */
export function getPracticalGuidance(
  dominantElement: ElementType,
  language: 'en' | 'fr' | 'ar' = 'en'
) {
  const guidance: Record<
    ElementType,
    {
      do: { en: string[]; fr: string[]; ar: string[] };
      avoid: { en: string[]; fr: string[]; ar: string[] };
      bestTime: { en: string; fr: string; ar: string };
    }
  > = {
    Fire: {
      do: {
        en: [
          'Channel your energy into creative or transformative work',
          'Lead initiatives and inspire others',
          'Practice during daylight, especially noon',
        ],
        fr: [
          'Canalisez votre énergie dans un travail créatif ou transformateur',
          'Dirigez des initiatives et inspirez les autres',
          'Pratiquez pendant la journée, surtout à midi',
        ],
        ar: [
          'وجه طاقتك نحو العمل الإبداعي أو التحويلي',
          'قُد المبادرات وألهم الآخرين',
          'مارس خلال النهار، خاصة عند الظهر',
        ],
      },
      avoid: {
        en: [
          'Excessive impulsiveness or anger',
          'Burning out from overwork',
          'Spiritual practices during extreme heat',
        ],
        fr: [
          'Impulsivité ou colère excessive',
          'Épuisement dû au surmenage',
          'Pratiques spirituelles pendant une chaleur extrême',
        ],
        ar: [
          'الاندفاع المفرط أو الغضب',
          'الإرهاق من العمل الزائد',
          'الممارسات الروحية أثناء الحرارة الشديدة',
        ],
      },
      bestTime: {
        en: 'Sunday at sunrise or noon • Leo season (July-August)',
        fr: 'Dimanche au lever du soleil ou à midi • Saison du Lion (juillet-août)',
        ar: 'الأحد عند الشروق أو الظهر • موسم الأسد (يوليو-أغسطس)',
      },
    },
    Air: {
      do: {
        en: [
          'Seek knowledge and share wisdom',
          'Practice breathwork and mindfulness',
          'Connect with communities and networks',
        ],
        fr: [
          'Cherchez la connaissance et partagez la sagesse',
          'Pratiquez la respiration et la pleine conscience',
          'Connectez-vous avec les communautés et les réseaux',
        ],
        ar: [
          'اسع للمعرفة وشارك الحكمة',
          'مارس تمارين التنفس واليقظة',
          'تواصل مع المجتمعات والشبكات',
        ],
      },
      avoid: {
        en: [
          'Overthinking or mental exhaustion',
          'Scattered focus on too many ideas',
          'Neglecting emotional or physical needs',
        ],
        fr: [
          'Surpensée ou épuisement mental',
          'Concentration dispersée sur trop d\'idées',
          'Négliger les besoins émotionnels ou physiques',
        ],
        ar: [
          'الإفراط في التفكير أو الإرهاق الذهني',
          'التركيز المشتت على أفكار كثيرة جدًا',
          'إهمال الاحتياجات العاطفية أو الجسدية',
        ],
      },
      bestTime: {
        en: 'Wednesday morning • Gemini/Aquarius season (May-June, January-February)',
        fr: 'Mercredi matin • Saison des Gémeaux/Verseau (mai-juin, janvier-février)',
        ar: 'الأربعاء صباحًا • موسم الجوزاء/الدلو (مايو-يونيو، يناير-فبراير)',
      },
    },
    Water: {
      do: {
        en: [
          'Honor intuition and emotional wisdom',
          'Practice near water when possible',
          'Engage in spiritual reflection and dhikr',
        ],
        fr: [
          'Honorez l\'intuition et la sagesse émotionnelle',
          'Pratiquez près de l\'eau si possible',
          'Engagez-vous dans la réflexion spirituelle et le dhikr',
        ],
        ar: [
          'احترم الحدس والحكمة العاطفية',
          'مارس بالقرب من الماء عندما يكون ذلك ممكنًا',
          'انخرط في التأمل الروحي والذكر',
        ],
      },
      avoid: {
        en: [
          'Emotional overwhelm or isolation',
          'Neglecting boundaries',
          'Excessive attachment to outcomes',
        ],
        fr: [
          'Surcharge émotionnelle ou isolement',
          'Négliger les limites',
          'Attachement excessif aux résultats',
        ],
        ar: [
          'الإرهاق العاطفي أو العزلة',
          'إهمال الحدود',
          'التعلق المفرط بالنتائج',
        ],
      },
      bestTime: {
        en: 'Monday evening or night • Cancer/Pisces season (June-July, February-March)',
        fr: 'Lundi soir ou nuit • Saison du Cancer/Poissons (juin-juillet, février-mars)',
        ar: 'الإثنين مساءً أو ليلاً • موسم السرطان/الحوت (يونيو-يوليو، فبراير-مارس)',
      },
    },
    Earth: {
      do: {
        en: [
          'Build sustainable routines and foundations',
          'Connect with nature and ground yourself',
          'Focus on practical, tangible goals',
        ],
        fr: [
          'Construisez des routines et des fondations durables',
          'Connectez-vous avec la nature et ancrez-vous',
          'Concentrez-vous sur des objectifs pratiques et tangibles',
        ],
        ar: [
          'ابن روتينًا وأساسات مستدامة',
          'تواصل مع الطبيعة وثبّت نفسك',
          'ركز على أهداف عملية وملموسة',
        ],
      },
      avoid: {
        en: [
          'Excessive rigidity or stubbornness',
          'Neglecting spiritual or emotional needs',
          'Overemphasis on material concerns',
        ],
        fr: [
          'Rigidité ou obstination excessive',
          'Négliger les besoins spirituels ou émotionnels',
          'Accent excessif sur les préoccupations matérielles',
        ],
        ar: [
          'الصلابة أو العناد المفرط',
          'إهمال الاحتياجات الروحية أو العاطفية',
          'التركيز المفرط على الاهتمامات المادية',
        ],
      },
      bestTime: {
        en: 'Saturday morning • Taurus/Capricorn season (April-May, December-January)',
        fr: 'Samedi matin • Saison du Taureau/Capricorne (avril-mai, décembre-janvier)',
        ar: 'السبت صباحًا • موسم الثور/الجدي (أبريل-مايو، ديسمبر-يناير)',
      },
    },
  };

  const elementGuidance = guidance[dominantElement];
  return {
    doActions: elementGuidance.do[language],
    avoidActions: elementGuidance.avoid[language],
    bestTime: elementGuidance.bestTime[language],
  };
}
