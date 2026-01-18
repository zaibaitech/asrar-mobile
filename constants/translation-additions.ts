/**
 * PLANET TRANSIT & MOMENT ALIGNMENT TRANSLATIONS
 * ==============================================
 * 
 * Add these translation keys to constants/translations.ts
 * 
 * Instructions:
 * 1. Merge `planetTransitNew` into existing `home` object
 * 2. Add `screens.planetTransit` and `screens.momentAlignment`
 * 3. Add new `widgets` section if it doesn't exist
 */

export const newTranslationKeys: Record<string, any> = {
  en: {
    // ========================================
    // WIDGETS (Home Screen Cards)
    // ========================================
    widgets: {
      planetTransit: {
        title: 'Planetary Climate',
        subtitle: 'Long-term position',
      },
    },
    
    // ========================================
    // SCREENS
    // ========================================
    screens: {
      // Planet Transit Screen (System 1 - Long-term)
      planetTransit: {
        title: 'Planet Transit',
        headerSubtitle: 'Long-term',
        explanation: 'Shows where a planet is in the zodiac — its long-term position that changes over weeks, months, or years.',
        personalizedNote: 'Personalized to your elemental nature',
        
        currentTransit: 'Current Transit',
        timeScale: 'Long-term (weeks/months)',
        in: 'in',
        
        retrograde: 'Retrograde',
        retrogradeArabic: 'راجع',
        
        duration: {
          title: 'Transit Duration',
          enteredSign: 'Entered sign',
          leavesSign: 'Leaves sign',
          total: 'Duration',
        },
        
        dataSource: {
          ephemeris: 'Ephemeris data',
          cached: 'Cached data',
          fallback: 'Fallback data',
        },
        
        spiritualQuality: {
          title: 'Spiritual Quality',
          saad: 'سَعْد',
          saadTranslation: 'Auspicious',
          nahs: 'نَحْس',
          nahsTranslation: 'Challenging',
          auspiciousDesc: 'This transit carries supportive energy for your elemental nature',
          challengingDesc: 'This transit presents challenges to navigate with your elemental nature',
        },
        
        theme: {
          title: 'Theme & Meaning',
          bestFor: 'Best for',
          betterToAvoid: 'Better to avoid',
        },
        
        resonance: {
          title: 'How it interacts with your nature',
          transitLabel: 'Transit',
          practicalAdvice: 'Practical Advice',
          levels: {
            supportive: 'Supportive',
            neutral: 'Neutral',
            challenging: 'Challenging',
            excellent: 'Excellent',
          },
          arabicTerms: {
            supportive: 'مُؤَيِّد',
            neutral: 'مُعْتَدِل',
            challenging: 'صَعْب',
            excellent: 'مُمْتَاز',
          },
        },
        
        classical: {
          title: 'Classical Wisdom',
          source: '— Traditional astrological texts',
        },
      },
      
      // Moment Alignment Screen (System 3 - Hourly)
      momentAlignment: {
        title: 'Moment Alignment',
        subtitle: 'Current planetary hour',
        explanation: 'Shows the active planetary hour (changes through the day) and how it interacts with your spiritual nature.',
        
        currentHour: 'Current Hour',
        hourNumber: 'Hour {{current}} of {{total}}',
        nextChange: 'Next change',
        
        transitContext: {
          title: 'Transit Context (Long-term)',
          description: 'Beyond the hourly energy, here is where this planet is in the zodiac long-term:',
          planetIn: '{{planet}} is in {{sign}} ({{signArabic}})',
          viewDetails: 'View full transit details',
        },
      },
    },
    
    // ========================================
    // COMMON TERMS (Additions)
    // ========================================
    common: {
      you: 'You',
      element: 'Element',
      
      timeScale: {
        longTerm: 'Long-term',
        shortTerm: 'Short-term',
      },
      
      day: 'Day',
      night: 'Night',
      
      updated: 'Updated',
      lastUpdated: 'Last updated',
      
      actions: {
        seeDetails: 'See details',
        viewMore: 'View more',
        refresh: 'Refresh',
        back: 'Back',
      },
      
      disclaimer: {
        forReflection: 'For reflection only • Not a ruling',
      },
    },
    
    // ========================================
    // PLANETS (if not already present)
    // ========================================
    planets: {
      sun: 'Sun',
      moon: 'Moon',
      mercury: 'Mercury',
      venus: 'Venus',
      mars: 'Mars',
      jupiter: 'Jupiter',
      saturn: 'Saturn',
    },
    
    // ========================================
    // ZODIAC SIGNS (if not already present)
    // ========================================
    zodiac: {
      aries: 'Aries',
      taurus: 'Taurus',
      gemini: 'Gemini',
      cancer: 'Cancer',
      leo: 'Leo',
      virgo: 'Virgo',
      libra: 'Libra',
      scorpio: 'Scorpio',
      sagittarius: 'Sagittarius',
      capricorn: 'Capricorn',
      aquarius: 'Aquarius',
      pisces: 'Pisces',
    },
    
    // ========================================
    // ELEMENTS (if not already present)
    // ========================================
    elements: {
      fire: 'Fire',
      water: 'Water',
      air: 'Air',
      earth: 'Earth',
    },
  },
  
  // ========================================
  // FRENCH TRANSLATIONS
  // ========================================
  fr: {
    widgets: {
      planetTransit: {
        title: 'Climat Planétaire',
        subtitle: 'Position long terme',
      },
    },
    
    screens: {
      planetTransit: {
        title: 'Transit Planétaire',
        headerSubtitle: 'Long terme',
        explanation: 'Montre où se trouve une planète dans le zodiaque — sa position à long terme qui change sur des semaines, mois ou années.',
        personalizedNote: 'Personnalisé selon votre nature élémentaire',
        
        currentTransit: 'Transit Actuel',
        timeScale: 'Long terme (semaines/mois)',
        in: 'dans',
        
        retrograde: 'Rétrograde',
        retrogradeArabic: 'راجع',
        
        duration: {
          title: 'Durée du Transit',
          enteredSign: 'Entrée dans le signe',
          leavesSign: 'Quitte le signe',
          total: 'Durée',
        },
        
        dataSource: {
          ephemeris: 'Données éphémérides',
          cached: 'Données en cache',
          fallback: 'Données de secours',
        },
        
        spiritualQuality: {
          title: 'Qualité Spirituelle',
          saad: 'سَعْد',
          saadTranslation: 'Favorable',
          nahs: 'نَحْس',
          nahsTranslation: 'Difficile',
          auspiciousDesc: 'Ce transit porte une énergie de soutien pour votre nature élémentaire',
          challengingDesc: 'Ce transit présente des défis à naviguer avec votre nature élémentaire',
        },
        
        theme: {
          title: 'Thème et Signification',
          bestFor: 'Favorable pour',
          betterToAvoid: 'Mieux éviter',
        },
        
        resonance: {
          title: 'Comment il interagit avec votre nature',
          transitLabel: 'Transit',
          practicalAdvice: 'Conseils Pratiques',
          levels: {
            supportive: 'Soutien',
            neutral: 'Neutre',
            challenging: 'Difficile',
            excellent: 'Excellent',
          },
          arabicTerms: {
            supportive: 'مُؤَيِّد',
            neutral: 'مُعْتَدِل',
            challenging: 'صَعْب',
            excellent: 'مُمْتَاز',
          },
        },
        
        classical: {
          title: 'Sagesse Classique',
          source: '— Textes astrologiques traditionnels',
        },
      },
      
      momentAlignment: {
        title: 'Alignement du Moment',
        subtitle: 'Heure planétaire actuelle',
        explanation: 'Montre l\'heure planétaire active (change au cours de la journée) et comment elle interagit avec votre nature spirituelle.',
        
        currentHour: 'Heure Actuelle',
        hourNumber: 'Heure {{current}} sur {{total}}',
        nextChange: 'Prochain changement',
        
        transitContext: {
          title: 'Contexte de Transit (Long terme)',
          description: 'Au-delà de l\'énergie horaire, voici où se trouve cette planète dans le zodiaque à long terme :',
          planetIn: '{{planet}} est dans {{sign}} ({{signArabic}})',
          viewDetails: 'Voir les détails complets du transit',
        },
      },
    },
    
    common: {
      you: 'Vous',
      element: 'Élément',
      
      timeScale: {
        longTerm: 'Long terme',
        shortTerm: 'Court terme',
      },
      
      day: 'Jour',
      night: 'Nuit',
      
      updated: 'Mis à jour',
      lastUpdated: 'Dernière mise à jour',
      
      actions: {
        seeDetails: 'Voir détails',
        viewMore: 'Voir plus',
        refresh: 'Actualiser',
        back: 'Retour',
      },
      
      disclaimer: {
        forReflection: 'Pour réflexion seulement • Pas une règle',
      },
    },
    
    planets: {
      sun: 'Soleil',
      moon: 'Lune',
      mercury: 'Mercure',
      venus: 'Vénus',
      mars: 'Mars',
      jupiter: 'Jupiter',
      saturn: 'Saturne',
    },
    
    zodiac: {
      aries: 'Bélier',
      taurus: 'Taureau',
      gemini: 'Gémeaux',
      cancer: 'Cancer',
      leo: 'Lion',
      virgo: 'Vierge',
      libra: 'Balance',
      scorpio: 'Scorpion',
      sagittarius: 'Sagittaire',
      capricorn: 'Capricorne',
      aquarius: 'Verseau',
      pisces: 'Poissons',
    },
    
    elements: {
      fire: 'Feu',
      water: 'Eau',
      air: 'Air',
      earth: 'Terre',
    },
  },
};

// ========================================
// MERGE INSTRUCTIONS
// ========================================
/**
 * To add these translations to your existing translations.ts file:
 * 
 * 1. Find the `en` object in translations.ts
 * 2. Add `widgets` section if it doesn't exist
 * 3. Add `screens` section if it doesn't exist, or merge into existing one
 * 4. Merge `common`, `planets`, `zodiac`, `elements` into existing sections
 * 5. Repeat for `fr` object
 * 
 * OR import and deep merge:
 * 
 * import { newTranslationKeys } from './translation-additions';
 * import { merge } from 'lodash'; // or similar deep merge utility
 * 
 * export const translations = {
 *   en: merge({}, existingEnTranslations, newTranslationKeys.en),
 *   fr: merge({}, existingFrTranslations, newTranslationKeys.fr),
 * };
 */
