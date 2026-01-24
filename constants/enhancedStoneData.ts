/**
 * Enhanced Zodiac Stones Data
 * Rich information for each stone including properties, benefits, usage guides, etc.
 */

export interface EnhancedStoneData {
  id: string;
  name: string;
  nameAr: string;
  nameFr: string;
  
  // Visual representation (emoji placeholder until real images)
  emoji: string;
  color: string; // Main color for gradients
  
  // Rating for different zodiacs (1-5 stars)
  zodiacRating: Record<string, number>;
  
  // Descriptions
  description: {
    en: string;
    ar: string;
    fr: string;
  };
  
  // Key properties (3-4 words)
  properties: {
    en: string[];
    ar: string[];
    fr: string[];
  };
  
  // Benefits specific to zodiac signs
  benefitsFor: Record<string, {
    en: string;
    ar: string;
    fr: string;
  }>;
  
  // Islamic spiritual use cases
  islamicUse: {
    en: string[];
    ar: string[];
    fr: string[];
  };
  
  // Meditation guide
  meditation: {
    duration: string;
    guide: {
      en: string;
      ar: string;
      fr: string;
    };
  };
  
  // Shopping information
  shopping: {
    priceRange: {
      small: string;
      medium: string;
      large: string;
    };
    onlineStores: Array<{
      name: string;
      url: string;
      verified: boolean;
    }>;
  };
  
  // Care instructions
  care: {
    en: string[];
    ar: string[];
    fr: string[];
  };
  
  // Authenticity tips
  authenticity: {
    en: string[];
    ar: string[];
    fr: string[];
  };
  
  // Related stones (IDs)
  relatedStones: string[];
}

export const ENHANCED_STONES: Record<string, EnhancedStoneData> = {
  amethyst: {
    id: "amethyst",
    name: "Amethyst",
    nameAr: "جمشت",
    nameFr: "Améthyste",
    emoji: "💜",
    color: "#9b59b6",
    
    zodiacRating: {
      aries: 5,
      pisces: 5,
      scorpio: 4,
      aquarius: 4,
      sagittarius: 3,
    },
    
    description: {
      en: "Amethyst is a purple variety of quartz known for its calming properties and spiritual protection. It enhances intuition and promotes emotional balance.",
      ar: "الجمشت هو نوع بنفسجي من الكوارتز معروف بخصائصه المهدئة والحماية الروحية. يعزز الحدس ويعزز التوازن العاطفي.",
      fr: "L'améthyste est une variété violette de quartz connue pour ses propriétés apaisantes et sa protection spirituelle. Elle améliore l'intuition et favorise l'équilibre émotionnel."
    },
    
    properties: {
      en: ["Calming", "Intuition", "Protection", "Spiritual Growth"],
      ar: ["مهدئ", "حدس", "حماية", "نمو روحي"],
      fr: ["Calmant", "Intuition", "Protection", "Croissance spirituelle"]
    },
    
    benefitsFor: {
      aries: {
        en: "Calms Aries' fiery energy and enhances spiritual awareness during meditation and prayer",
        ar: "يهدئ طاقة الحمل النارية ويعزز الوعي الروحي أثناء التأمل والصلاة",
        fr: "Calme l'énergie ardente du Bélier et améliore la conscience spirituelle"
      },
      pisces: {
        en: "Amplifies Pisces' natural intuition and provides grounding during spiritual practices",
        ar: "يضخم حدس الحوت الطبيعي ويوفر التأريض أثناء الممارسات الروحية",
        fr: "Amplifie l'intuition naturelle des Poissons et fournit un ancrage"
      },
      scorpio: {
        en: "Balances Scorpio's intense emotions while enhancing natural psychic abilities",
        ar: "يوازن مشاعر العقرب المكثفة مع تعزيز القدرات النفسية الطبيعية",
        fr: "Équilibre les émotions intenses du Scorpion et améliore les capacités psychiques"
      }
    },
    
    islamicUse: {
      en: [
        "Hold during dhikr recitation for deeper spiritual connection",
        "Place near Quran during reading to enhance concentration",
        "Wear during Friday prayers for spiritual protection",
        "Keep in prayer space to maintain positive energy"
      ],
      ar: [
        "أمسكه أثناء تلاوة الذكر لتعميق الاتصال الروحي",
        "ضعه بالقرب من القرآن أثناء القراءة لتعزيز التركيز",
        "ارتديه أثناء صلاة الجمعة للحماية الروحية",
        "احتفظ به في مكان الصلاة للحفاظ على الطاقة الإيجابية"
      ],
      fr: [
        "Tenez pendant la récitation du dhikr pour une connexion spirituelle plus profonde",
        "Placez près du Coran pendant la lecture pour améliorer la concentration",
        "Portez pendant les prières du vendredi pour la protection spirituelle",
        "Gardez dans l'espace de prière pour maintenir une énergie positive"
      ]
    },
    
    meditation: {
      duration: "5-10 minutes",
      guide: {
        en: "Hold the amethyst in your hand. Close your eyes and take three deep breaths. Feel the stone's calming energy flowing through your body. Visualize a purple light surrounding you, offering protection and peace. Recite your chosen dhikr while focusing on the stone's vibration.",
        ar: "أمسك الجمشت في يدك. أغمض عينيك وخذ ثلاثة أنفاس عميقة. اشعر بطاقة الحجر المهدئة تتدفق عبر جسدك. تخيل ضوءًا بنفسجيًا يحيط بك، يوفر الحماية والسلام. ردد الذكر المختار مع التركيز على اهتزاز الحجر.",
        fr: "Tenez l'améthyste dans votre main. Fermez les yeux et prenez trois respirations profondes. Sentez l'énergie apaisante de la pierre traverser votre corps. Visualisez une lumière violette vous entourant, offrant protection et paix. Récitez votre dhikr choisi en vous concentrant sur la vibration de la pierre."
      }
    },
    
    shopping: {
      priceRange: {
        small: "$10-$20",
        medium: "$20-$40",
        large: "$40-$100"
      },
      onlineStores: [
        {
          name: "Amazon",
          url: "https://www.amazon.com/s?k=amethyst+crystal",
          verified: true
        },
        {
          name: "Etsy - Authentic Crystals",
          url: "https://www.etsy.com/search?q=genuine+amethyst",
          verified: true
        }
      ]
    },
    
    care: {
      en: [
        "Cleanse monthly under moonlight for 3-4 hours",
        "Avoid direct sunlight as it causes fading",
        "Recharge with positive intention and prayer",
        "Store separately from other stones to avoid scratches"
      ],
      ar: [
        "نظف شهريًا تحت ضوء القمر لمدة 3-4 ساعات",
        "تجنب أشعة الشمس المباشرة لأنها تسبب التلاشي",
        "أعد الشحن بنية إيجابية ودعاء",
        "احفظه منفصلاً عن الأحجار الأخرى لتجنب الخدوش"
      ],
      fr: [
        "Nettoyez mensuellement sous la lumière de la lune pendant 3-4 heures",
        "Évitez la lumière directe du soleil car elle provoque la décoloration",
        "Rechargez avec une intention positive et une prière",
        "Conservez séparément des autres pierres pour éviter les rayures"
      ]
    },
    
    authenticity: {
      en: [
        "Real amethyst has natural color variations and zoning",
        "Should feel cool to touch and gradually warm up",
        "May have small inclusions or imperfections (natural)",
        "Beware of perfectly uniform purple color (likely synthetic)"
      ],
      ar: [
        "الجمشت الحقيقي له اختلافات طبيعية في اللون ومناطق",
        "يجب أن يشعر بالبرودة عند اللمس ويسخن تدريجياً",
        "قد يحتوي على شوائب صغيرة أو عيوب (طبيعية)",
        "احذر من اللون البنفسجي الموحد تمامًا (من المحتمل أن يكون صناعيًا)"
      ],
      fr: [
        "L'améthyste véritable présente des variations de couleur naturelles",
        "Doit être frais au toucher et se réchauffer progressivement",
        "Peut avoir de petites inclusions ou imperfections (naturel)",
        "Méfiez-vous de la couleur violette parfaitement uniforme (probablement synthétique)"
      ]
    },
    
    relatedStones: ["rose-quartz", "clear-quartz", "citrine"]
  },
  
  // Add more stones with similar structure...
  "rose-quartz": {
    id: "rose-quartz",
    name: "Rose Quartz",
    nameAr: "كوارتز وردي",
    nameFr: "Quartz rose",
    emoji: "🌸",
    color: "#f8b4d9",
    
    zodiacRating: {
      taurus: 5,
      libra: 5,
      pisces: 4,
      cancer: 4,
    },
    
    description: {
      en: "Rose Quartz is the stone of unconditional love and compassion. It opens the heart chakra and promotes self-love, forgiveness, and emotional healing.",
      ar: "الكوارتز الوردي هو حجر الحب غير المشروط والرحمة. يفتح شاكرا القلب ويعزز حب الذات والمغفرة والشفاء العاطفي.",
      fr: "Le quartz rose est la pierre de l'amour inconditionnel et de la compassion. Il ouvre le chakra du cœur et favorise l'amour de soi, le pardon et la guérison émotionnelle."
    },
    
    properties: {
      en: ["Love", "Compassion", "Emotional Healing", "Peace"],
      ar: ["حب", "رحمة", "شفاء عاطفي", "سلام"],
      fr: ["Amour", "Compassion", "Guérison émotionnelle", "Paix"]
    },
    
    benefitsFor: {
      taurus: {
        en: "Enhances Taurus' natural capacity for love while promoting emotional openness",
        ar: "يعزز قدرة الثور الطبيعية على الحب مع تعزيز الانفتاح العاطفي",
        fr: "Améliore la capacité naturelle du Taureau pour l'amour tout en favorisant l'ouverture émotionnelle"
      },
      libra: {
        en: "Supports Libra's harmonious nature and strengthens relationships",
        ar: "يدعم طبيعة الميزان المتناغمة ويقوي العلاقات",
        fr: "Soutient la nature harmonieuse de la Balance et renforce les relations"
      }
    },
    
    islamicUse: {
      en: [
        "Hold while making dua for loved ones",
        "Keep in family gathering spaces for harmony",
        "Use during family prayer time",
        "Place in bedroom for peaceful sleep"
      ],
      ar: [
        "أمسكه أثناء الدعاء للأحباء",
        "احتفظ به في أماكن التجمع العائلي للتناغم",
        "استخدمه أثناء وقت الصلاة العائلية",
        "ضعه في غرفة النوم للنوم السلمي"
      ],
      fr: [
        "Tenez en faisant des dua pour les proches",
        "Gardez dans les espaces de rassemblement familial pour l'harmonie",
        "Utilisez pendant le temps de prière familiale",
        "Placez dans la chambre pour un sommeil paisible"
      ]
    },
    
    meditation: {
      duration: "5-10 minutes",
      guide: {
        en: "Place rose quartz over your heart. Breathe deeply and feel waves of compassion flowing through you. Visualize pink light healing any emotional wounds. Recite 'Ya Rahman, Ya Rahim' (O Most Merciful) while feeling the stone's loving energy.",
        ar: "ضع الكوارتز الوردي فوق قلبك. تنفس بعمق واشعر بأمواج الرحمة تتدفق من خلالك. تخيل ضوءًا ورديًا يشفي أي جروح عاطفية. ردد 'يا رحمن، يا رحيم' مع الشعور بطاقة الحب من الحجر.",
        fr: "Placez le quartz rose sur votre cœur. Respirez profondément et sentez des vagues de compassion vous traverser. Visualisez une lumière rose guérissant les blessures émotionnelles. Récitez 'Ya Rahman, Ya Rahim' en ressentant l'énergie aimante de la pierre."
      }
    },
    
    shopping: {
      priceRange: {
        small: "$8-$15",
        medium: "$15-$35",
        large: "$35-$80"
      },
      onlineStores: [
        {
          name: "Amazon",
          url: "https://www.amazon.com/s?k=rose+quartz+crystal",
          verified: true
        },
        {
          name: "Etsy",
          url: "https://www.etsy.com/search?q=rose+quartz+stone",
          verified: true
        }
      ]
    },
    
    care: {
      en: [
        "Cleanse under running water weekly",
        "Charge in morning sunlight (brief, 10-15 min)",
        "Moonlight charging enhances loving energy",
        "Can be cleansed with sage or incense smoke"
      ],
      ar: [
        "نظف تحت الماء الجاري أسبوعيًا",
        "اشحن في ضوء الشمس الصباحي (وجيز، 10-15 دقيقة)",
        "الشحن بضوء القمر يعزز طاقة الحب",
        "يمكن تنظيفه بدخان المريمية أو البخور"
      ],
      fr: [
        "Nettoyez sous l'eau courante hebdomadairement",
        "Chargez à la lumière du soleil du matin (bref, 10-15 min)",
        "Le chargement au clair de lune renforce l'énergie aimante",
        "Peut être nettoyé avec de la fumée de sauge ou d'encens"
      ]
    },
    
    authenticity: {
      en: [
        "Real rose quartz has a soft, translucent appearance",
        "Color should be natural pink, not bright artificial pink",
        "May have white streaks or minor cloudiness",
        "Glass imitations feel lighter and warmer to touch"
      ],
      ar: [
        "الكوارتز الوردي الحقيقي له مظهر ناعم وشفاف",
        "يجب أن يكون اللون ورديًا طبيعيًا، وليس ورديًا صناعيًا ساطعًا",
        "قد يحتوي على خطوط بيضاء أو غيوم طفيفة",
        "التقليدات الزجاجية تشعر بأنها أخف وأدفأ عند اللمس"
      ],
      fr: [
        "Le quartz rose véritable a une apparence douce et translucide",
        "La couleur doit être rose naturel, pas rose artificiel vif",
        "Peut avoir des stries blanches ou une légère nébulosité",
        "Les imitations en verre sont plus légères et plus chaudes au toucher"
      ]
    },
    
    relatedStones: ["amethyst", "moonstone", "rhodonite"]
  },
  
  citrine: {
    id: "citrine",
    name: "Citrine",
    nameAr: "سترين",
    nameFr: "Citrine",
    emoji: "🌟",
    color: "#f39c12",
    
    zodiacRating: {
      aries: 4,
      leo: 5,
      gemini: 4,
      sagittarius: 5,
    },
    
    description: {
      en: "Citrine is a golden stone of abundance and manifestation. It attracts prosperity, success, and positive energy while dispelling negativity.",
      ar: "السترين هو حجر ذهبي من الوفرة والتجلي. يجذب الازدهار والنجاح والطاقة الإيجابية بينما يبدد السلبية.",
      fr: "La citrine est une pierre dorée d'abondance et de manifestation. Elle attire la prospérité, le succès et l'énergie positive tout en dissipant la négativité."
    },
    
    properties: {
      en: ["Abundance", "Success", "Manifestation", "Positivity"],
      ar: ["وفرة", "نجاح", "تجلي", "إيجابية"],
      fr: ["Abondance", "Succès", "Manifestation", "Positivité"]
    },
    
    benefitsFor: {
      leo: {
        en: "Amplifies Leo's natural leadership and attracts success in endeavors",
        ar: "يضخم قيادة الأسد الطبيعية ويجذب النجاح في المساعي",
        fr: "Amplifie le leadership naturel du Lion et attire le succès"
      },
      sagittarius: {
        en: "Supports Sagittarius' optimistic nature and manifestation abilities",
        ar: "يدعم طبيعة القوس المتفائلة وقدرات التجلي",
        fr: "Soutient la nature optimiste du Sagittaire et les capacités de manifestation"
      }
    },
    
    islamicUse: {
      en: [
        "Hold while making dua for halal rizq (provision)",
        "Keep in workspace for barakah (blessings)",
        "Use during Fajr prayer for daily abundance",
        "Place in cash box or business space"
      ],
      ar: [
        "أمسكه أثناء الدعاء للرزق الحلال",
        "احتفظ به في مكان العمل للبركة",
        "استخدمه أثناء صلاة الفجر للوفرة اليومية",
        "ضعه في صندوق النقود أو مكان العمل"
      ],
      fr: [
        "Tenez en faisant des dua pour le rizq halal (provision)",
        "Gardez dans l'espace de travail pour la barakah (bénédictions)",
        "Utilisez pendant la prière Fajr pour l'abondance quotidienne",
        "Placez dans la caisse ou l'espace commercial"
      ]
    },
    
    meditation: {
      duration: "5-10 minutes",
      guide: {
        en: "Hold citrine in your right hand. Visualize golden light filling your body. Think of your goals with gratitude as if already achieved. Recite 'Alhamdulillah' (Praise be to Allah) while feeling abundance flowing to you.",
        ar: "أمسك السترين في يدك اليمنى. تخيل ضوءًا ذهبيًا يملأ جسدك. فكر في أهدافك بامتنان كما لو تحققت بالفعل. ردد 'الحمد لله' مع الشعور بالوفرة تتدفق إليك.",
        fr: "Tenez la citrine dans votre main droite. Visualisez une lumière dorée remplissant votre corps. Pensez à vos objectifs avec gratitude comme s'ils étaient déjà réalisés. Récitez 'Alhamdulillah' en ressentant l'abondance affluer vers vous."
      }
    },
    
    shopping: {
      priceRange: {
        small: "$12-$25",
        medium: "$25-$50",
        large: "$50-$120"
      },
      onlineStores: [
        {
          name: "Amazon",
          url: "https://www.amazon.com/s?k=natural+citrine+crystal",
          verified: true
        },
        {
          name: "Etsy",
          url: "https://www.etsy.com/search?q=citrine+stone",
          verified: true
        }
      ]
    },
    
    care: {
      en: [
        "Cleanse with sage smoke monthly",
        "Charge in sunlight for 1-2 hours",
        "Does not fade in sun (unlike amethyst)",
        "Recharge intention during new moon"
      ],
      ar: [
        "نظف بدخان المريمية شهريًا",
        "اشحن في ضوء الشمس لمدة 1-2 ساعة",
        "لا يتلاشى في الشمس (على عكس الجمشت)",
        "أعد شحن النية خلال القمر الجديد"
      ],
      fr: [
        "Nettoyez avec de la fumée de sauge mensuellement",
        "Chargez au soleil pendant 1-2 heures",
        "Ne se décolore pas au soleil (contrairement à l'améthyste)",
        "Rechargez l'intention pendant la nouvelle lune"
      ]
    },
    
    authenticity: {
      en: [
        "Natural citrine is pale yellow to golden brown",
        "Deep orange/burnt amber is usually heat-treated amethyst",
        "Real citrine is somewhat rare and pricier",
        "Should have natural cloudiness or inclusions"
      ],
      ar: [
        "السترين الطبيعي أصفر شاحب إلى بني ذهبي",
        "البرتقالي الداكن / العنبر المحروق عادة جمشت معالج بالحرارة",
        "السترين الحقيقي نادر إلى حد ما وأغلى",
        "يجب أن يكون له غيوم طبيعية أو شوائب"
      ],
      fr: [
        "La citrine naturelle est jaune pâle à brun doré",
        "L'orange foncé/ambre brûlé est généralement de l'améthyste traitée thermiquement",
        "La vraie citrine est assez rare et plus chère",
        "Devrait avoir une nébulosité naturelle ou des inclusions"
      ]
    },
    
    relatedStones: ["amethyst", "tiger-eye", "sunstone"]
  },
  
  // Additional stones abbreviated for brevity
  carnelian: {
    id: "carnelian",
    name: "Carnelian",
    nameAr: "عقيق أحمر",
    nameFr: "Cornaline",
    emoji: "🔥",
    color: "#d35400",
    zodiacRating: { aries: 5, leo: 4, scorpio: 3 },
    description: {
      en: "Carnelian is a vibrant stone of courage, vitality, and motivation. It boosts confidence and creative energy.",
      ar: "العقيق الأحمر حجر نابض بالحياة من الشجاعة والحيوية والتحفيز. يعزز الثقة والطاقة الإبداعية.",
      fr: "La cornaline est une pierre vibrante de courage, vitalité et motivation. Elle stimule la confiance et l'énergie créative."
    },
    properties: {
      en: ["Courage", "Vitality", "Motivation", "Creativity"],
      ar: ["شجاعة", "حيوية", "تحفيز", "إبداع"],
      fr: ["Courage", "Vitalité", "Motivation", "Créativité"]
    },
    benefitsFor: {
      aries: {
        en: "Enhances Aries' natural courage and leadership qualities",
        ar: "يعزز شجاعة الحمل الطبيعية وصفات القيادة",
        fr: "Améliore le courage naturel et les qualités de leadership du Bélier"
      }
    },
    islamicUse: {
      en: ["Wear for confidence in important meetings", "Hold during public speaking", "Keep for motivation in projects"],
      ar: ["ارتدِ للثقة في الاجتماعات المهمة", "أمسك أثناء التحدث أمام الجمهور", "احتفظ به للتحفيز في المشاريع"],
      fr: ["Porter pour la confiance lors de réunions importantes", "Tenir pendant la prise de parole en public"]
    },
    meditation: {
      duration: "5 minutes",
      guide: {
        en: "Hold carnelian at your solar plexus. Feel fiery energy building courage within you.",
        ar: "أمسك العقيق عند الضفيرة الشمسية. اشعر بالطاقة النارية تبني الشجاعة داخلك.",
        fr: "Tenez la cornaline à votre plexus solaire. Sentez l'énergie ardente construire le courage en vous."
      }
    },
    shopping: {
      priceRange: { small: "$8-$15", medium: "$15-$30", large: "$30-$70" },
      onlineStores: [
        { name: "Amazon", url: "https://www.amazon.com/s?k=carnelian+stone", verified: true }
      ]
    },
    care: {
      en: ["Cleanse with water", "Charge in sunlight", "Recharge weekly"],
      ar: ["نظف بالماء", "اشحن في ضوء الشمس", "أعد الشحن أسبوعيًا"],
      fr: ["Nettoyer à l'eau", "Charger au soleil", "Recharger hebdomadairement"]
    },
    authenticity: {
      en: ["Natural orange-red color", "May have bands", "Warm to touch"],
      ar: ["لون برتقالي أحمر طبيعي", "قد يكون به أشرطة", "دافئ عند اللمس"],
      fr: ["Couleur orange-rouge naturelle", "Peut avoir des bandes", "Chaud au toucher"]
    },
    relatedStones: ["red-jasper", "tiger-eye", "garnet"]
  }
};

type StoneVisual = {
  emoji: string;
  colors: readonly [string, string];
  imageUrl?: string;
};

const DEFAULT_STONE_VISUAL: StoneVisual = {
  emoji: '💎',
  colors: ['#64748b', '#334155']
};

// Phase 1 visuals: emoji + subtle two-color gradients.
// Keys are normalized stone IDs (lowercase, hyphens, no parentheses/apostrophes).
export const STONE_VISUALS: Record<string, StoneVisual> = {
  // Purple / Violet
  amethyst: { emoji: '💜', colors: ['#9b59b6', '#8e44ad'] },
  fluorite: { emoji: '💠', colors: ['#7c3aed', '#06b6d4'] },
  'violet-fluorite': { emoji: '💠', colors: ['#9b59b6', '#7c3aed'] },
  'purple-fluorite': { emoji: '💠', colors: ['#9b59b6', '#7c3aed'] },

  // Red / Orange
  carnelian: { emoji: '🔶', colors: ['#e74c3c', '#c0392b'] },
  garnet: { emoji: '🔴', colors: ['#c0392b', '#8b0000'] },
  ruby: { emoji: '💎', colors: ['#ef4444', '#b91c1c'] },
  'red-jasper': { emoji: '🟥', colors: ['#ef4444', '#b91c1c'] },
  bloodstone: { emoji: '🩸', colors: ['#16a34a', '#7f1d1d'] },

  // Blue / Teal
  aquamarine: { emoji: '💧', colors: ['#3498db', '#2980b9'] },
  sapphire: { emoji: '💠', colors: ['#1d4ed8', '#1e3a8a'] },
  turquoise: { emoji: '🟦', colors: ['#06b6d4', '#0ea5e9'] },
  'lapis-lazuli': { emoji: '🔷', colors: ['#1e3a8a', '#0f172a'] },

  // Green
  jade: { emoji: '💚', colors: ['#22c55e', '#15803d'] },
  malachite: { emoji: '🟩', colors: ['#16a085', '#1abc9c'] },
  aventurine: { emoji: '🍃', colors: ['#22c55e', '#16a34a'] },
  emerald: { emoji: '🟢', colors: ['#10b981', '#047857'] },

  // Pink
  'rose-quartz': { emoji: '💗', colors: ['#f8b4d9', '#e91e63'] },
  kunzite: { emoji: '🌸', colors: ['#f9a8d4', '#a855f7'] },

  // White / Clear
  'clear-quartz': { emoji: '⬜', colors: ['#e5e7eb', '#94a3b8'] },
  'rock-crystal': { emoji: '💎', colors: ['#e5e7eb', '#94a3b8'] },
  'milky-quartz': { emoji: '⬜', colors: ['#f1f5f9', '#cbd5e1'] },
  opal: { emoji: '⚪', colors: ['#e5e7eb', '#a5b4fc'] },
  pearl: { emoji: '🤍', colors: ['#f8fafc', '#cbd5e1'] },
  moonstone: { emoji: '🌙', colors: ['#e2e8f0', '#a5b4fc'] },

  // Yellow / Gold
  citrine: { emoji: '🟡', colors: ['#f59e0b', '#f97316'] },
  amber: { emoji: '🟨', colors: ['#f59e0b', '#d97706'] },
  'tiger-eye': { emoji: '🟨', colors: ['#f59e0b', '#92400e'] },

  // Dark
  obsidian: { emoji: '⚫', colors: ['#0f172a', '#000000'] },
  hematite: { emoji: '⚫', colors: ['#334155', '#0f172a'] },
  'smoky-quartz': { emoji: '🟤', colors: ['#6b7280', '#374151'] },

  // Multi / Misc
  agate: { 
    emoji: '🔮', 
    colors: ['#94a3b8', '#475569'],
    imageUrl: 'https://pngtree.com/freepng/vivid-blue-agate-stone-with-intricate-swirling-patterns-and-layers_19983128.html'
  },
  labradorite: { emoji: '🌈', colors: ['#0ea5e9', '#a855f7'] },
  coral: { emoji: '🪸', colors: ['#fb7185', '#f97316'] }
};

function normalizeStoneId(stoneId: string): string {
  return stoneId
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[()]/g, '')
    .replace(/'/g, '');
}

export function getStoneVisual(stoneIdOrName: string): StoneVisual {
  const normalizedId = normalizeStoneId(stoneIdOrName);
  return STONE_VISUALS[normalizedId] || DEFAULT_STONE_VISUAL;
}

export function createPlaceholderStoneData(input: {
  name: string;
  nameAr?: string;
  nameFr?: string;
}): EnhancedStoneData {
  const id = normalizeStoneId(input.name);
  const visual = getStoneVisual(id);
  const displayNameFr = input.nameFr ?? input.name;
  const displayNameAr = input.nameAr ?? input.name;

  return {
    id,
    name: input.name,
    nameAr: displayNameAr,
    nameFr: displayNameFr,
    emoji: visual.emoji,
    color: visual.colors[0],
    zodiacRating: {},
    description: {
      en: `${input.name} is traditionally used for reflection, balance, and intention-setting. Explore its properties and try it with mindful practice.`,
      fr: `${input.name} est traditionnellement utilisé pour la réflexion, l'équilibre et la définition d'intentions. Découvrez ses propriétés et essayez-le avec une pratique consciente.`,
      ar: `${input.name} يُستخدم تقليديًا للتأمل والتوازن وتحديد النوايا. اكتشف خصائصه وجربه مع ممارسة واعية.`
    },
    properties: {
      en: ['Balance', 'Clarity', 'Protection'],
      fr: ['Équilibre', 'Clarté', 'Protection'],
      ar: ['توازن', 'وضوح', 'حماية']
    },
    benefitsFor: {},
    islamicUse: {
      en: [
        'Keep it in your prayer space as a reminder of intention (niyyah)',
        'Hold it briefly during quiet dhikr to focus attention',
        'Pair with dua for ease, guidance, and serenity'
      ],
      fr: [
        'Gardez-le dans votre espace de prière comme rappel d’intention (niyyah)',
        'Tenez-le brièvement pendant un dhikr calme pour vous concentrer',
        'Associez-le à une invocation (duʿā) pour l’aisance, la guidance et la sérénité'
      ],
      ar: [
        'احتفظ به في مكان الصلاة كتذكير بالنية',
        'أمسكه قليلًا أثناء ذكر هادئ للمساعدة على التركيز',
        'اربطه بالدعاء لليسر والهداية والسكينة'
      ]
    },
    meditation: {
      duration: '5 minutes',
      guide: {
        en: 'Hold the stone, breathe slowly, and set a clear intention. Notice your thoughts without judgment.',
        fr: 'Tenez la pierre, respirez lentement et fixez une intention claire. Observez vos pensées sans jugement.',
        ar: 'أمسك الحجر، تنفس ببطء، وحدد نية واضحة. راقب أفكارك دون حكم.'
      }
    },
    shopping: {
      priceRange: { small: '$8-$15', medium: '$15-$35', large: '$35-$90' },
      onlineStores: [
        { name: 'Amazon', url: `https://www.amazon.com/s?k=${encodeURIComponent(input.name)}+stone`, verified: false },
        { name: 'Etsy', url: `https://www.etsy.com/search?q=${encodeURIComponent(input.name)}+genuine`, verified: false }
      ]
    },
    care: {
      en: ['Wipe gently with a soft cloth', 'Store separately to avoid scratches', 'Cleanse periodically with intention'],
      fr: ['Essuyez doucement avec un chiffon doux', 'Rangez séparément pour éviter les rayures', 'Purifiez périodiquement avec intention'],
      ar: ['امسحه بلطف بقطعة قماش ناعمة', 'احفظه منفصلًا لتجنب الخدوش', 'نظّفه/طهّره دوريًا مع نية طيبة']
    },
    authenticity: {
      en: ['Natural stones often have small variations', 'Too-perfect uniform color can indicate synthetic material', 'Buy from reputable sellers when possible'],
      fr: ['Les pierres naturelles ont souvent de petites variations', 'Une couleur trop uniforme peut indiquer du synthétique', 'Achetez chez des vendeurs fiables si possible'],
      ar: ['الأحجار الطبيعية غالبًا بها اختلافات بسيطة', 'اللون المتطابق جدًا قد يشير لمنتج صناعي', 'اشترِ من بائع موثوق إن أمكن']
    },
    relatedStones: []
  };
}

// Helper function to get stone data by ID
export function getEnhancedStoneData(stoneId: string): EnhancedStoneData | undefined {
  // Normalize stone name to ID (lowercase, hyphens, remove special chars)
  const normalizedId = normalizeStoneId(stoneId);
  
  return ENHANCED_STONES[normalizedId];
}

// Get stones matching zodiac with ratings
export function getStonesForZodiac(zodiacSign: string): Array<{stone: EnhancedStoneData; rating: number}> {
  const normalizedZodiac = zodiacSign.toLowerCase();
  const results: Array<{stone: EnhancedStoneData; rating: number}> = [];
  
  Object.values(ENHANCED_STONES).forEach(stone => {
    const rating = stone.zodiacRating[normalizedZodiac];
    if (rating) {
      results.push({ stone, rating });
    }
  });
  
  // Sort by rating (highest first)
  return results.sort((a, b) => b.rating - a.rating);
}

// Personality traits for zodiac signs
export const ZODIAC_PERSONALITIES: Record<string, {
  keyTraits: { en: string; ar: string; fr: string };
  strengths: { en: string; ar: string; fr: string };
  watchFor: { en: string; ar: string; fr: string };
}> = {
  aries: {
    keyTraits: {
      en: "Courageous, passionate, confident, enthusiastic",
      ar: "شجاع، متحمس، واثق، حماسي",
      fr: "Courageux, passionné, confiant, enthousiaste"
    },
    strengths: {
      en: "Natural leadership, determination, optimism",
      ar: "قيادة طبيعية، تصميم، تفاؤل",
      fr: "Leadership naturel, détermination, optimisme"
    },
    watchFor: {
      en: "Impatience, impulsiveness, quick temper",
      ar: "نفاد الصبر، الاندفاع، الغضب السريع",
      fr: "Impatience, impulsivité, tempérament vif"
    }
  },
  taurus: {
    keyTraits: {
      en: "Patient, reliable, devoted, responsible",
      ar: "صبور، موثوق، مخلص، مسؤول",
      fr: "Patient, fiable, dévoué, responsable"
    },
    strengths: {
      en: "Stability, loyalty, practicality, perseverance",
      ar: "استقرار، ولاء، عملية، مثابرة",
      fr: "Stabilité, loyauté, praticité, persévérance"
    },
    watchFor: {
      en: "Stubbornness, possessiveness, materialism",
      ar: "عناد، تملك، مادية",
      fr: "Entêtement, possessivité, matérialisme"
    }
  },
  scorpio: {
    keyTraits: {
      en: "Passionate, determined, resourceful, intuitive",
      ar: "متحمس، حازم، بارع، حدسي",
      fr: "Passionné, déterminé, ingénieux, intuitif"
    },
    strengths: {
      en: "Deep intuition, resilience, loyalty, transformative power",
      ar: "حدس عميق، مرونة، ولاء، قوة تحويلية",
      fr: "Intuition profonde, résilience, loyauté, pouvoir transformateur"
    },
    watchFor: {
      en: "Intensity in emotions, jealousy, secretiveness",
      ar: "كثافة في المشاعر، غيرة، كتمان",
      fr: "Intensité émotionnelle, jalousie, secret"
    }
  },
  // Add more zodiac personalities as needed
};
