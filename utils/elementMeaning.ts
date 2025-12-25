/**
 * Element Meaning & Expression Utility
 * Provides explanations for letter-based element dominance
 */

export type ElementType = 'fire' | 'air' | 'water' | 'earth';

export interface ElementExpression {
  element: ElementType;
  dominantMeaning: {
    en: string;
    ar: string;
    fr: string;
  };
  expressionKeywords: {
    en: string[];
    ar: string[];
    fr: string[];
  };
  balanceAdvice: {
    en: string;
    ar: string;
    fr: string;
  };
  recommendedDhikr: {
    arabic: string;
    transliteration: string;
    meaning: string;
    reason: {
      en: string;
      ar: string;
      fr: string;
    };
  };
}

const ELEMENT_EXPRESSIONS: Record<ElementType, ElementExpression> = {
  fire: {
    element: 'fire',
    dominantMeaning: {
      en: "Your name is dominated by Fire letters. This influences how you ACT, LEAD, and EXPRESS passion in daily life. You are naturally drawn to action, courage, transformation, and initiative. Your expression is energetic and assertive rather than passive or reflective.",
      ar: "اسمك يهيمن عليه عنصر النار. هذا يؤثر على كيفية تصرفك وقيادتك وتعبيرك عن الشغف في الحياة اليومية. أنت منجذب بطبيعتك إلى العمل والشجاعة والتحول والمبادرة. تعبيرك نشيط وحازم بدلاً من أن يكون سلبياً أو تأملياً.",
      fr: "Votre nom est dominé par les lettres du Feu. Cela influence la façon dont vous AGISSEZ, DIRIGEZ et EXPRIMEZ la passion au quotidien. Vous êtes naturellement attiré par l'action, le courage, la transformation et l'initiative. Votre expression est énergique et assertive plutôt que passive ou réflexive."
    },
    expressionKeywords: {
      en: ['Action', 'Courage', 'Passion', 'Leadership', 'Energy', 'Initiative'],
      ar: ['العمل', 'الشجاعة', 'الشغف', 'القيادة', 'الطاقة', 'المبادرة'],
      fr: ['Action', 'Courage', 'Passion', 'Leadership', 'Énergie', 'Initiative']
    },
    balanceAdvice: {
      en: "Because Fire is dominant, cooling and grounding practices help maintain balance. Focus on patience, reflection, and calm intention.",
      ar: "نظرًا لأن النار مهيمنة، فإن ممارسات التبريد والتأريض تساعد في الحفاظ على التوازن. ركز على الصبر والتأمل والنية الهادئة.",
      fr: "Comme le Feu est dominant, les pratiques de refroidissement et d'ancrage aident à maintenir l'équilibre. Concentrez-vous sur la patience, la réflexion et l'intention calme."
    },
    recommendedDhikr: {
      arabic: 'يا لطيف',
      transliteration: 'Yā Laṭīf',
      meaning: 'O Most Gentle',
      reason: {
        en: 'Softens fiery intensity and brings gentleness',
        ar: 'يخفف من كثافة النار ويجلب اللطف',
        fr: 'Adoucit l\'intensité ardente et apporte la douceur'
      }
    }
  },
  air: {
    element: 'air',
    dominantMeaning: {
      en: "Your name is dominated by Air letters. This influences how you THINK, COMMUNICATE, and ADAPT in daily life. You are naturally drawn to ideas, learning, conversation, and mental flexibility. Your expression is intellectual and communicative rather than emotional or physical.",
      ar: "اسمك يهيمن عليه عنصر الهواء. هذا يؤثر على كيفية تفكيرك وتواصلك وتكيفك في الحياة اليومية. أنت منجذب بطبيعتك إلى الأفكار والتعلم والمحادثة والمرونة العقلية. تعبيرك فكري وتواصلي بدلاً من أن يكون عاطفياً أو جسدياً.",
      fr: "Votre nom est dominé par les lettres de l'Air. Cela influence la façon dont vous PENSEZ, COMMUNIQUEZ et vous ADAPTEZ au quotidien. Vous êtes naturellement attiré par les idées, l'apprentissage, la conversation et la flexibilité mentale. Votre expression est intellectuelle et communicative plutôt qu'émotionnelle ou physique."
    },
    expressionKeywords: {
      en: ['Thought', 'Communication', 'Ideas', 'Learning', 'Flexibility', 'Conversation'],
      ar: ['الفكر', 'التواصل', 'الأفكار', 'التعلم', 'المرونة', 'المحادثة'],
      fr: ['Pensée', 'Communication', 'Idées', 'Apprentissage', 'Flexibilité', 'Conversation']
    },
    balanceAdvice: {
      en: "Because Air is dominant, grounding practices help maintain balance. Focus on stillness, clarity, and intention.",
      ar: "نظرًا لأن الهواء مهيمن، فإن ممارسات التأريض تساعد في الحفاظ على التوازن. ركز على السكون والوضوح والنية.",
      fr: "Comme l'Air est dominant, les pratiques d'ancrage aident à maintenir l'équilibre. Concentrez-vous sur la tranquillité, la clarté et l'intention."
    },
    recommendedDhikr: {
      arabic: 'يا حكيم',
      transliteration: 'Yā Ḥakīm',
      meaning: 'O Most Wise',
      reason: {
        en: 'Grounds scattered thoughts and brings wisdom',
        ar: 'يؤرّض الأفكار المتناثرة ويجلب الحكمة',
        fr: 'Ancre les pensées dispersées et apporte la sagesse'
      }
    }
  },
  water: {
    element: 'water',
    dominantMeaning: {
      en: "Your name is dominated by Water letters. This influences how you FEEL, CONNECT, and FLOW in daily life. You are naturally drawn to emotions, intuition, healing, and deep connections. Your expression is empathetic and fluid rather than rigid or analytical.",
      ar: "اسمك يهيمن عليه عنصر الماء. هذا يؤثر على كيفية شعورك واتصالك وتدفقك في الحياة اليومية. أنت منجذب بطبيعتك إلى العواطف والحدس والشفاء والاتصالات العميقة. تعبيرك متعاطف ومتدفق بدلاً من أن يكون جامداً أو تحليلياً.",
      fr: "Votre nom est dominé par les lettres de l'Eau. Cela influence la façon dont vous RESSENTEZ, vous CONNECTEZ et COULEZ au quotidien. Vous êtes naturellement attiré par les émotions, l'intuition, la guérison et les connexions profondes. Votre expression est empathique et fluide plutôt que rigide ou analytique."
    },
    expressionKeywords: {
      en: ['Emotion', 'Intuition', 'Healing', 'Flow', 'Empathy', 'Connection'],
      ar: ['العاطفة', 'الحدس', 'الشفاء', 'التدفق', 'التعاطف', 'الاتصال'],
      fr: ['Émotion', 'Intuition', 'Guérison', 'Flux', 'Empathie', 'Connexion']
    },
    balanceAdvice: {
      en: "Because Water is dominant, boundaries and structure help maintain balance. Focus on clarity, discernment, and emotional boundaries.",
      ar: "نظرًا لأن الماء مهيمن، فإن الحدود والبنية تساعد في الحفاظ على التوازن. ركز على الوضوح والتمييز والحدود العاطفية.",
      fr: "Comme l'Eau est dominante, les limites et la structure aident à maintenir l'équilibre. Concentrez-vous sur la clarté, le discernement et les limites émotionnelles."
    },
    recommendedDhikr: {
      arabic: 'يا قوي',
      transliteration: 'Yā Qawī',
      meaning: 'O Most Strong',
      reason: {
        en: 'Provides strength and emotional resilience',
        ar: 'يوفر القوة والمرونة العاطفية',
        fr: 'Apporte force et résilience émotionnelle'
      }
    }
  },
  earth: {
    element: 'earth',
    dominantMeaning: {
      en: "Your name is dominated by Earth letters. This influences how you BUILD, STABILIZE, and GROUND in daily life. You are naturally drawn to practicality, security, consistency, and tangible results. Your expression is stable and methodical rather than spontaneous or abstract.",
      ar: "اسمك يهيمن عليه عنصر الأرض. هذا يؤثر على كيفية بنائك واستقرارك وتأريضك في الحياة اليومية. أنت منجذب بطبيعتك إلى العملية والأمان والاتساق والنتائج الملموسة. تعبيرك مستقر ومنهجي بدلاً من أن يكون عفوياً أو مجرداً.",
      fr: "Votre nom est dominé par les lettres de la Terre. Cela influence la façon dont vous CONSTRUISEZ, STABILISEZ et vous ANCREZ au quotidien. Vous êtes naturellement attiré par la praticité, la sécurité, la cohérence et les résultats tangibles. Votre expression est stable et méthodique plutôt que spontanée ou abstraite."
    },
    expressionKeywords: {
      en: ['Stability', 'Practicality', 'Security', 'Consistency', 'Building', 'Grounding'],
      ar: ['الاستقرار', 'العملية', 'الأمان', 'الاتساق', 'البناء', 'التأريض'],
      fr: ['Stabilité', 'Praticité', 'Sécurité', 'Cohérence', 'Construction', 'Ancrage']
    },
    balanceAdvice: {
      en: "Because Earth is dominant, flexibility and openness help maintain balance. Focus on adaptability, spontaneity, and creative flow.",
      ar: "نظرًا لأن الأرض مهيمنة، فإن المرونة والانفتاح يساعدان في الحفاظ على التوازن. ركز على القدرة على التكيف والعفوية والتدفق الإبداعي.",
      fr: "Comme la Terre est dominante, la flexibilité et l'ouverture aident à maintenir l'équilibre. Concentrez-vous sur l'adaptabilité, la spontanéité et le flux créatif."
    },
    recommendedDhikr: {
      arabic: 'يا متعال',
      transliteration: 'Yā Mutaʿāl',
      meaning: 'O Most Exalted',
      reason: {
        en: 'Elevates perspective beyond material focus',
        ar: 'يرفع المنظور فوق التركيز المادي',
        fr: 'Élève la perspective au-delà du focus matériel'
      }
    }
  }
};

/**
 * Get expression details for a dominant element
 */
export function getElementExpression(element: ElementType): ElementExpression {
  return ELEMENT_EXPRESSIONS[element];
}

/**
 * Get element label in multiple languages
 */
export function getElementLabel(element: ElementType): { en: string; ar: string; fr: string } {
  const labels = {
    fire: { en: 'Fire', ar: 'نار', fr: 'Feu' },
    air: { en: 'Air', ar: 'هواء', fr: 'Air' },
    water: { en: 'Water', ar: 'ماء', fr: 'Eau' },
    earth: { en: 'Earth', ar: 'أرض', fr: 'Terre' }
  };
  return labels[element];
}

/**
 * Get element color for visualization
 */
export function getElementColor(element: ElementType): string {
  const colors = {
    fire: '#FF5A5F',
    air: '#4CC9F0',
    water: '#3B82F6',
    earth: '#22C55E'
  };
  return colors[element];
}
