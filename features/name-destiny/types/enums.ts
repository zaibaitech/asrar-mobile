/**
 * Shared Enums for Name Destiny Feature
 * Input types and understanding levels
 */

/**
 * Input Type - Determines interpretation context and guidance tone
 */
export enum InputType {
  NAME_PERSON = 'name_person',           // Individual name
  NAME_MOTHER_PAIR = 'name_mother_pair', // Name + Mother lineage
  DIVINE_NAME = 'divine_name',           // Asmā' al-Ḥusnā
  QURAN_VERSE = 'quran_verse',           // Quranic āyah
  SENTENCE = 'sentence',                 // General phrase
  FREE_TEXT = 'free_text',               // Any Arabic text
}

/**
 * Understanding Level - Controls terminology density and section visibility
 */
export enum UnderstandingLevel {
  BEGINNER = 'beginner',         // Minimal jargon, plain language, key sections only
  INTERMEDIATE = 'intermediate', // Balanced Arabic terms with explanations
  CLASSICAL = 'classical',       // Full classical terminology and all sections
}

/**
 * Get display labels for input types
 */
export function getInputTypeLabel(
  type: InputType,
  language: 'en' | 'fr' | 'ar'
): string {
  const labels: Record<InputType, { en: string; fr: string; ar: string }> = {
    [InputType.NAME_PERSON]: {
      en: 'Name (Person)',
      fr: 'Nom (Personne)',
      ar: 'اسم (شخص)',
    },
    [InputType.NAME_MOTHER_PAIR]: {
      en: 'Name + Mother',
      fr: 'Nom + Mère',
      ar: 'اسم + الأم',
    },
    [InputType.DIVINE_NAME]: {
      en: 'Divine Name',
      fr: 'Nom Divin',
      ar: 'اسم إلهي',
    },
    [InputType.QURAN_VERSE]: {
      en: 'Quranic Verse',
      fr: 'Verset Coranique',
      ar: 'آية قرآنية',
    },
    [InputType.SENTENCE]: {
      en: 'Sentence/Phrase',
      fr: 'Phrase',
      ar: 'جملة',
    },
    [InputType.FREE_TEXT]: {
      en: 'Free Text',
      fr: 'Texte Libre',
      ar: 'نص حر',
    },
  };

  return labels[type][language];
}

/**
 * Get display labels for understanding levels
 */
export function getUnderstandingLevelLabel(
  level: UnderstandingLevel,
  language: 'en' | 'fr' | 'ar'
): string {
  const labels: Record<UnderstandingLevel, { en: string; fr: string; ar: string }> = {
    [UnderstandingLevel.BEGINNER]: {
      en: 'Beginner',
      fr: 'Débutant',
      ar: 'مبتدئ',
    },
    [UnderstandingLevel.INTERMEDIATE]: {
      en: 'Intermediate',
      fr: 'Intermédiaire',
      ar: 'متوسط',
    },
    [UnderstandingLevel.CLASSICAL]: {
      en: 'Classical',
      fr: 'Classique',
      ar: 'كلاسيكي',
    },
  };

  return labels[level][language];
}

/**
 * Get helper text for input type
 */
export function getInputTypeHelper(
  type: InputType,
  language: 'en' | 'fr' | 'ar'
): string {
  const helpers: Record<InputType, { en: string; fr: string; ar: string }> = {
    [InputType.NAME_PERSON]: {
      en: 'Single name analysis',
      fr: 'Analyse d\'un seul nom',
      ar: 'تحليل اسم واحد',
    },
    [InputType.NAME_MOTHER_PAIR]: {
      en: 'Full lineage destiny',
      fr: 'Destin complet de lignée',
      ar: 'قدر النسب الكامل',
    },
    [InputType.DIVINE_NAME]: {
      en: 'Sacred name reflection',
      fr: 'Réflexion sur le nom sacré',
      ar: 'تأمل الاسم المقدس',
    },
    [InputType.QURAN_VERSE]: {
      en: 'Verse resonance',
      fr: 'Résonance du verset',
      ar: 'رنين الآية',
    },
    [InputType.SENTENCE]: {
      en: 'Phrase numerology',
      fr: 'Numérologie de phrase',
      ar: 'علم أعداد الجملة',
    },
    [InputType.FREE_TEXT]: {
      en: 'General text analysis',
      fr: 'Analyse de texte général',
      ar: 'تحليل نص عام',
    },
  };

  return helpers[type][language];
}
