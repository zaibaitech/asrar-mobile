/**
 * Blueprint Generator
 * Generates personalized "What This Means For You" cosmic blueprint
 */

import { BirthInsights } from '@/types/calculator-enhanced';

interface BlueprintData {
  leadership: string;
  emotional: string;
  thinking: string;
  gift: string;
  challenge: string;
  careerPaths: string[];
}

type TFunction = (key: string, fallback?: string) => string;

// Leadership style based on Ascendant sign
const getLeadershipStyle = (
  ascSign: string | undefined,
  t: TFunction,
  language: string
): string => {
  if (!ascSign) return t('cosmicBlueprint.leadership.default', 'unique individual');

  const sign = ascSign.toLowerCase();
  const leadershipMap: Record<string, { en: string; fr: string; ar: string }> = {
    leo: { en: 'natural LEADER', fr: 'LEADER naturel', ar: 'قائد طبيعي' },
    aries: { en: 'bold PIONEER', fr: 'PIONNIER audacieux', ar: 'رائد جريء' },
    capricorn: { en: 'wise AUTHORITY', fr: 'AUTORITÉ sage', ar: 'سلطة حكيمة' },
    sagittarius: { en: 'inspiring VISIONARY', fr: 'VISIONNAIRE inspirant', ar: 'صاحب رؤية ملهم' },
    scorpio: { en: 'powerful TRANSFORMER', fr: 'TRANSFORMATEUR puissant', ar: 'محوّل قوي' },
    taurus: { en: 'steady BUILDER', fr: 'BÂTISSEUR stable', ar: 'بنّاء ثابت' },
    gemini: { en: 'versatile COMMUNICATOR', fr: 'COMMUNICATEUR polyvalent', ar: 'متواصل متعدد المواهب' },
    cancer: { en: 'nurturing PROTECTOR', fr: 'PROTECTEUR bienveillant', ar: 'حامٍ راعٍ' },
    virgo: { en: 'skilled PERFECTIONIST', fr: 'PERFECTIONNISTE habile', ar: 'متقن ماهر' },
    libra: { en: 'diplomatic HARMONIZER', fr: 'HARMONISATEUR diplomatique', ar: 'موازن دبلوماسي' },
    aquarius: { en: 'innovative VISIONARY', fr: 'VISIONNAIRE innovant', ar: 'مبتكر صاحب رؤية' },
    pisces: { en: 'intuitive DREAMER', fr: 'RÊVEUR intuitif', ar: 'حالم بديهي' },
  };

  const style = leadershipMap[sign];
  if (!style) return t('cosmicBlueprint.leadership.default', 'unique soul');

  return language === 'ar' ? style.ar : language === 'fr' ? style.fr : style.en;
};

// Emotional nature based on Moon sign
const getEmotionalNature = (
  moonSign: string | undefined,
  t: TFunction,
  language: string
): string => {
  if (!moonSign) return t('cosmicBlueprint.emotional.default', 'sensitive heart');

  const sign = moonSign.toLowerCase();
  const emotionalMap: Record<string, { en: string; fr: string; ar: string }> = {
    cancer: { en: 'deeply CARING heart', fr: 'cœur profondément ATTENTIONNÉ', ar: 'قلب عطوف عميق' },
    pisces: { en: 'compassionate SOUL', fr: 'ÂME compatissante', ar: 'روح رحيمة' },
    scorpio: { en: 'intense PASSION', fr: 'PASSION intense', ar: 'شغف مكثف' },
    taurus: { en: 'loyal DEVOTION', fr: 'DÉVOUEMENT loyal', ar: 'إخلاص وفي' },
    leo: { en: 'generous WARMTH', fr: 'CHALEUR généreuse', ar: 'دفء كريم' },
    aries: { en: 'fiery SPIRIT', fr: 'ESPRIT fougueux', ar: 'روح نارية' },
    gemini: { en: 'curious MIND', fr: 'ESPRIT curieux', ar: 'عقل فضولي' },
    virgo: { en: 'caring ATTENTION', fr: 'ATTENTION bienveillante', ar: 'اهتمام راعٍ' },
    libra: { en: 'harmonious BALANCE', fr: 'ÉQUILIBRE harmonieux', ar: 'توازن متناغم' },
    sagittarius: { en: 'adventurous SPIRIT', fr: 'ESPRIT aventurier', ar: 'روح مغامرة' },
    capricorn: { en: 'steady RESOLVE', fr: 'DÉTERMINATION stable', ar: 'عزم ثابت' },
    aquarius: { en: 'humanitarian VISION', fr: 'VISION humanitaire', ar: 'رؤية إنسانية' },
  };

  const nature = emotionalMap[sign];
  if (!nature) return t('cosmicBlueprint.emotional.default', 'sensitive nature');

  return language === 'ar' ? nature.ar : language === 'fr' ? nature.fr : nature.en;
};

// Thinking style based on Sun sign
const getThinkingStyle = (
  sunSign: string | undefined,
  t: TFunction,
  language: string
): string => {
  if (!sunSign) return t('cosmicBlueprint.thinking.default', 'seeks truth');

  const sign = sunSign.toLowerCase();
  const thinkingMap: Record<string, { en: string; fr: string; ar: string }> = {
    aquarius: { en: 'thinks DIFFERENTLY', fr: 'pense DIFFÉREMMENT', ar: 'يفكر بشكل مختلف' },
    gemini: { en: 'explores ENDLESSLY', fr: 'explore SANS FIN', ar: 'يستكشف باستمرار' },
    libra: { en: 'seeks HARMONY', fr: 'cherche l\'HARMONIE', ar: 'يسعى للتناغم' },
    virgo: { en: 'analyzes DEEPLY', fr: 'analyse PROFONDÉMENT', ar: 'يحلل بعمق' },
    leo: { en: 'shines BOLDLY', fr: 'brille AUDACIEUSEMENT', ar: 'يتألق بجرأة' },
    aries: { en: 'acts DECISIVELY', fr: 'agit DÉCISIVEMENT', ar: 'يتصرف بحسم' },
    taurus: { en: 'builds PATIENTLY', fr: 'construit PATIEMMENT', ar: 'يبني بصبر' },
    cancer: { en: 'feels DEEPLY', fr: 'ressent PROFONDÉMENT', ar: 'يشعر بعمق' },
    scorpio: { en: 'transforms POWERFULLY', fr: 'transforme PUISSAMMENT', ar: 'يتحول بقوة' },
    sagittarius: { en: 'seeks WISDOM', fr: 'cherche la SAGESSE', ar: 'يسعى للحكمة' },
    capricorn: { en: 'achieves STEADILY', fr: 'accomplit RÉGULIÈREMENT', ar: 'ينجز بثبات' },
    pisces: { en: 'dreams BEAUTIFULLY', fr: 'rêve MAGNIFIQUEMENT', ar: 'يحلم بجمال' },
  };

  const style = thinkingMap[sign];
  if (!style) return t('cosmicBlueprint.thinking.default', 'seeks meaning');

  return language === 'ar' ? style.ar : language === 'fr' ? style.fr : style.en;
};

// Generate gift based on strongest placements
const generateGift = (insights: BirthInsights, language: string): string => {
  const ascSign = insights.chartBasics.ascendant?.sign?.toLowerCase();
  const moonSign = insights.chartBasics.moonSign?.sign?.toLowerCase();
  const sunSign = insights.chartBasics.sunSign?.sign?.toLowerCase();
  const element = insights.spiritualImprint.dominantElement;

  // Specific combinations
  if (ascSign === 'leo' && moonSign === 'cancer') {
    return language === 'ar'
      ? 'القيادة بالرحمة والرعاية'
      : language === 'fr'
        ? 'Diriger avec compassion et soin'
        : 'Leading with compassion and care';
  }

  if (ascSign === 'leo' && sunSign === 'aquarius') {
    return language === 'ar'
      ? 'القيادة بالابتكار والرؤية'
      : language === 'fr'
        ? 'Diriger avec innovation et vision'
        : 'Leading with innovation and vision';
  }

  // Element-based gifts
  const elementGifts: Record<string, { en: string; fr: string; ar: string }> = {
    fire: {
      en: 'Inspiring others through action and courage',
      fr: 'Inspirer les autres par l\'action et le courage',
      ar: 'إلهام الآخرين بالفعل والشجاعة',
    },
    water: {
      en: 'Healing others through empathy and intuition',
      fr: 'Guérir les autres par l\'empathie et l\'intuition',
      ar: 'شفاء الآخرين بالتعاطف والحدس',
    },
    air: {
      en: 'Connecting others through ideas and communication',
      fr: 'Connecter les autres par les idées et la communication',
      ar: 'ربط الآخرين بالأفكار والتواصل',
    },
    earth: {
      en: 'Supporting others through stability and patience',
      fr: 'Soutenir les autres par la stabilité et la patience',
      ar: 'دعم الآخرين بالثبات والصبر',
    },
  };

  const gift = elementGifts[element];
  return gift
    ? language === 'ar'
      ? gift.ar
      : language === 'fr'
        ? gift.fr
        : gift.en
    : language === 'ar'
      ? 'جلب موهبتك الفريدة لخدمة الآخرين'
      : language === 'fr'
        ? 'Apporter vos dons uniques pour servir les autres'
        : 'Bringing your unique gifts to serve others';
};

// Generate challenge based on tensions
const generateChallenge = (insights: BirthInsights, language: string): string => {
  const ascSign = insights.chartBasics.ascendant?.sign?.toLowerCase();
  const sunSign = insights.chartBasics.sunSign?.sign?.toLowerCase();
  const temperament = insights.spiritualImprint.temperament;

  // Leo Ascendant vs Aquarius Sun = ego vs equality tension
  if (ascSign === 'leo' && sunSign === 'aquarius') {
    return language === 'ar'
      ? 'الموازنة بين الذات والمساواة'
      : language === 'fr'
        ? 'Équilibrer l\'ego avec l\'égalité'
        : 'Balancing ego with equality';
  }

  // Temperament-based challenges
  const tempChallenges: Record<string, { en: string; fr: string; ar: string }> = {
    'hot-dry': {
      en: 'Managing intensity without burnout',
      fr: 'Gérer l\'intensité sans épuisement',
      ar: 'إدارة الشدة دون الإرهاق',
    },
    'hot-moist': {
      en: 'Focusing energy without scattering',
      fr: 'Concentrer l\'énergie sans dispersion',
      ar: 'تركيز الطاقة دون التشتت',
    },
    'cold-moist': {
      en: 'Taking action despite hesitation',
      fr: 'Agir malgré l\'hésitation',
      ar: 'اتخاذ إجراء رغم التردد',
    },
    'cold-dry': {
      en: 'Opening the heart while maintaining wisdom',
      fr: 'Ouvrir le cœur tout en maintenant la sagesse',
      ar: 'فتح القلب مع الحفاظ على الحكمة',
    },
  };

  const challenge = tempChallenges[temperament];
  return challenge
    ? language === 'ar'
      ? challenge.ar
      : language === 'fr'
        ? challenge.fr
        : challenge.en
    : language === 'ar'
      ? 'إيجاد التوازن بين أجزاء مختلفة من نفسك'
      : language === 'fr'
        ? 'Trouver l\'équilibre entre différentes parties de vous-même'
        : 'Finding balance between different parts of yourself';
};

// Generate career paths
const generateCareerPaths = (insights: BirthInsights, language: string): string[] => {
  const moonSign = insights.chartBasics.moonSign?.sign?.toLowerCase();
  const ascSign = insights.chartBasics.ascendant?.sign?.toLowerCase();
  const sunSign = insights.chartBasics.sunSign?.sign?.toLowerCase();
  const paths: string[] = [];

  const careerLabels = {
    healthcare: { en: 'Healthcare', fr: 'Soins de santé', ar: 'الرعاية الصحية' },
    counseling: { en: 'Counseling', fr: 'Conseil', ar: 'الإرشاد' },
    teaching: { en: 'Teaching', fr: 'Enseignement', ar: 'التعليم' },
    leadership: { en: 'Creative leadership', fr: 'Leadership créatif', ar: 'القيادة الإبداعية' },
    speaking: { en: 'Public speaking', fr: 'Prise de parole publique', ar: 'الخطابة' },
    innovation: { en: 'Social innovation', fr: 'Innovation sociale', ar: 'الابتكار الاجتماعي' },
    technology: { en: 'Technology', fr: 'Technologie', ar: 'التكنولوجيا' },
    arts: { en: 'Arts & creativity', fr: 'Arts et créativité', ar: 'الفنون والإبداع' },
    business: { en: 'Business', fr: 'Affaires', ar: 'الأعمال' },
    research: { en: 'Research', fr: 'Recherche', ar: 'البحث' },
    healing: { en: 'Healing arts', fr: 'Arts de guérison', ar: 'فنون الشفاء' },
    writing: { en: 'Writing', fr: 'Écriture', ar: 'الكتابة' },
  };

  const getLabel = (key: keyof typeof careerLabels) => {
    const label = careerLabels[key];
    return language === 'ar' ? label.ar : language === 'fr' ? label.fr : label.en;
  };

  // Cancer Moon = caring professions
  if (moonSign === 'cancer' || moonSign === 'pisces') {
    paths.push(getLabel('healthcare'), getLabel('counseling'), getLabel('teaching'));
  }

  // Leo/Aries Ascendant = leadership roles
  if (ascSign === 'leo' || ascSign === 'aries') {
    paths.push(getLabel('leadership'), getLabel('speaking'));
  }

  // Aquarius/Gemini Sun = innovation
  if (sunSign === 'aquarius' || sunSign === 'gemini') {
    paths.push(getLabel('innovation'), getLabel('technology'));
  }

  // Virgo = research/analysis
  if (sunSign === 'virgo' || moonSign === 'virgo') {
    paths.push(getLabel('research'));
  }

  // Pisces/Libra = arts
  if (sunSign === 'pisces' || sunSign === 'libra' || ascSign === 'libra') {
    paths.push(getLabel('arts'));
  }

  // Remove duplicates and limit to 3
  return [...new Set(paths)].slice(0, 3);
};

export const generateBlueprint = (
  insights: BirthInsights,
  t: TFunction,
  language: string
): BlueprintData => {
  const ascSign = insights.chartBasics.ascendant?.sign;
  const moonSign = insights.chartBasics.moonSign?.sign;
  const sunSign = insights.chartBasics.sunSign?.sign;

  return {
    leadership: getLeadershipStyle(ascSign, t, language),
    emotional: getEmotionalNature(moonSign, t, language),
    thinking: getThinkingStyle(sunSign, t, language),
    gift: generateGift(insights, language),
    challenge: generateChallenge(insights, language),
    careerPaths: generateCareerPaths(insights, language),
  };
};

export default generateBlueprint;
