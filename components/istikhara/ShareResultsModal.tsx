/**
 * Share Results Modal
 * ===================
 * Provides options to share Who Am I results in text or PDF format.
 * Users can share the current tab or all results.
 */

import * as Haptics from 'expo-haptics';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { FileText, Share2, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { getZodiacSign } from '../../constants/zodiacData';
import { ZODIAC_HEALTH_DATA_BY_BURUJ } from '../../constants/zodiacHealthData';
import { ZODIAC_COMPLETE_DATA } from '../../constants/zodiacStones';
import { useLanguage } from '../../contexts/LanguageContext';
import { IstikharaData } from '../../types/istikhara';

interface BirthProfile {
  dobISO: string;
  birthTime: string | null;
  hasBirthTime: boolean;
  timezone: string;
  birthLocation: {
    latitude: number;
    longitude: number;
    label?: string;
  } | null;
  sunSign: {
    burjAr: string;
    burjEn: string;
    burjIndex: number;
  };
}

interface ExtendedIstikharaData extends IstikharaData {
  birthProfile?: BirthProfile;
  calculationMethod?: 'name' | 'birthdate';
}

interface ShareResultsModalProps {
  visible: boolean;
  onClose: () => void;
  data: ExtendedIstikharaData;
  personName: string;
  motherName: string;
  currentTab?: string;
}

type ShareMode = 'currentTab' | 'allResults';
type ShareFormat = 'text' | 'pdf';

// Zodiac arrays for localization
const ZODIAC_EN = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
const ZODIAC_FR = ['Bélier', 'Taureau', 'Gémeaux', 'Cancer', 'Lion', 'Vierge', 'Balance', 'Scorpion', 'Sagittaire', 'Capricorne', 'Verseau', 'Poissons'];
const ZODIAC_AR = ['الحمل', 'الثور', 'الجوزاء', 'السرطان', 'الأسد', 'العذراء', 'الميزان', 'العقرب', 'القوس', 'الجدي', 'الدلو', 'الحوت'];
const ZODIAC_SYMBOLS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];

const ELEMENT_NAMES: Record<string, Record<string, string>> = {
  fire: { en: 'Fire 🔥', fr: 'Feu 🔥', ar: 'نار 🔥' },
  earth: { en: 'Earth 🌍', fr: 'Terre 🌍', ar: 'تراب 🌍' },
  air: { en: 'Air 💨', fr: 'Air 💨', ar: 'هواء 💨' },
  water: { en: 'Water 💧', fr: 'Eau 💧', ar: 'ماء 💧' },
};

function getZodiacByIndex(index: number, language: string): string {
  const arr = language === 'ar' ? ZODIAC_AR : language === 'fr' ? ZODIAC_FR : ZODIAC_EN;
  return `${ZODIAC_SYMBOLS[index]} ${arr[index]}`;
}

// Share export labels are fully trilingual (en/fr/ar). The underlying deep
// buruj content (personality/career/blessed-day narrative text) only has
// en/fr in the source data, so Arabic falls back to English there — matching
// how that data is handled everywhere else in the app.
type ShareLang = 'en' | 'fr' | 'ar';

const SHARE_LABELS: Record<string, Record<ShareLang, string>> = {
  headerTitle: { en: '✨ Asrariya - Who Am I Results ✨', fr: '✨ Asrariya - Résultats Qui Suis-Je ✨', ar: '✨ أسرارية - نتائج من أنا ✨' },
  pdfHeaderTitle: { en: '✨ Asrariya - Who Am I Results', fr: '✨ Asrariya - Résultats Qui Suis-Je', ar: '✨ أسرارية - نتائج من أنا' },
  date: { en: 'Date', fr: 'Date', ar: 'التاريخ' },
  birthDate: { en: 'Birth Date', fr: 'Date de naissance', ar: 'تاريخ الميلاد' },
  birthTime: { en: 'Birth Time', fr: 'Heure de naissance', ar: 'وقت الميلاد' },
  birthLocation: { en: 'Birth Location', fr: 'Lieu de naissance', ar: 'مكان الميلاد' },
  person: { en: 'Person', fr: 'Personne', ar: 'الشخص' },
  mother: { en: 'Mother', fr: 'Mère', ar: 'الأم' },
  tab: { en: 'Tab', fr: 'Onglet', ar: 'التبويب' },
  overview: { en: '📊 Overview', fr: '📊 Aperçu', ar: '📊 نظرة عامة' },
  element: { en: 'Element', fr: 'Élément', ar: 'العنصر' },
  burujRemainder: { en: 'Buruj Remainder', fr: 'Reste du Buruj', ar: 'باقي البروج' },
  zodiac: { en: 'Zodiac', fr: 'Signe', ar: 'البرج' },
  zodiacSign: { en: 'Zodiac Sign', fr: 'Signe Zodiacal', ar: 'البرج الفلكي' },
  sign: { en: 'Sign', fr: 'Signe', ar: 'البرج' },
  birthProfile: { en: '🌟 Birth Profile', fr: '🌟 Profil de Naissance', ar: '🌟 الملف الفلكي' },
  sunSign: { en: 'Sun Sign', fr: 'Signe Solaire', ar: 'برج الشمس' },
  numerology: { en: '🔢 Abjad Numerology', fr: '🔢 Numérologie Abjad', ar: '🔢 حساب الجُمَّل' },
  personTotal: { en: 'Person Total', fr: 'Total Personne', ar: 'مجموع الشخص' },
  motherTotal: { en: 'Mother Total', fr: 'Total Mère', ar: 'مجموع الأم' },
  combined: { en: 'Combined', fr: 'Combiné', ar: 'المجموع الكلي' },
  combinedTotal: { en: 'Combined Total', fr: 'Total Combiné', ar: 'المجموع الإجمالي' },
  dhikrCount: { en: 'Dhikr Count', fr: 'Nombre de Dhikr', ar: 'عدد الذكر' },
  personality: { en: '🧠 Personality', fr: '🧠 Personnalité', ar: '🧠 الشخصية' },
  personalityProfile: { en: '🧠 Personality Profile', fr: '🧠 Profil de Personnalité', ar: '🧠 ملف الشخصية' },
  temperament: { en: 'Temperament', fr: 'Tempérament', ar: 'المزاج' },
  dreams: { en: 'Dreams', fr: 'Rêves', ar: 'الأحلام' },
  communication: { en: 'Communication', fr: 'Communication', ar: 'التواصل' },
  careerFields: { en: '💼 Career Fields', fr: '💼 Domaines de Carrière', ar: '💼 مجالات مهنية' },
  careerGuidance: { en: '💼 Career Guidance', fr: '💼 Orientation de Carrière', ar: '💼 التوجيه المهني' },
  traditional: { en: 'Traditional', fr: 'Traditionnel', ar: 'تقليدي' },
  idealFields: { en: 'Ideal Fields', fr: 'Domaines Idéaux', ar: 'المجالات المثالية' },
  recommendedFields: { en: 'Recommended Fields', fr: 'Domaines Recommandés', ar: 'المجالات الموصى بها' },
  blessedDay: { en: '📅 Blessed Day', fr: '📅 Jour Béni', ar: '📅 اليوم المبارك' },
  day: { en: 'Day', fr: 'Jour', ar: 'اليوم' },
  bestFor: { en: 'Best for', fr: 'Idéal pour', ar: 'الأفضل لـ' },
  bestActivities: { en: 'Best Activities', fr: 'Meilleures Activités', ar: 'أفضل الأنشطة' },
  spiritualPractice: { en: '🕊️ Spiritual Practice', fr: '🕊️ Pratique Spirituelle', ar: '🕊️ الممارسة الروحية' },
  practiceNight: { en: 'Practice Night', fr: 'Nuit de Pratique', ar: 'ليلة الممارسة' },
  divineName: { en: 'Divine Name', fr: 'Nom Divin', ar: 'الاسم الإلهي' },
  meaning: { en: 'Meaning', fr: 'Signification', ar: 'المعنى' },
  healthAwareness: { en: '⚕️ Health Awareness', fr: '⚕️ Conscience de Santé', ar: '⚕️ الوعي الصحي' },
  rulingPlanet: { en: 'Ruling Planet', fr: 'Planète Régente', ar: 'الكوكب الحاكم' },
  planet: { en: 'Planet', fr: 'Planète', ar: 'الكوكب' },
  watchOutFor: { en: 'Watch Out For', fr: 'À Surveiller', ar: 'احذر من' },
  watchOutForIcon: { en: '⚠️ Watch Out For', fr: '⚠️ À Surveiller', ar: '⚠️ احذر من' },
  thingsToAvoid: { en: '🚫 Things to Avoid', fr: '🚫 Choses à Éviter', ar: '🚫 أمور يجب تجنبها' },
  beneficialFoods: { en: 'Beneficial Foods', fr: 'Aliments Bénéfiques', ar: 'أطعمة مفيدة' },
  beneficialFoodsIcon: { en: '🍎 Beneficial Foods', fr: '🍎 Aliments Bénéfiques', ar: '🍎 أطعمة مفيدة' },
  spiritualProtection: { en: '🛡️ Spiritual Protection', fr: '🛡️ Protection Spirituelle', ar: '🛡️ الحماية الروحية' },
  zodiacStones: { en: '💎 Zodiac Stones & Crystals', fr: '💎 Pierres et Cristaux du Zodiaque', ar: '💎 أحجار وبلورات البرج' },
  beneficialStones: { en: 'Beneficial Stones', fr: 'Pierres Bénéfiques', ar: 'أحجار مفيدة' },
  generatedBy: { en: 'Generated by Asrariya Everyday', fr: 'Généré par Asrariya Everyday', ar: 'تم الإنشاء بواسطة أسرارية إيفريداي' },
  generated: { en: 'Generated', fr: 'Généré', ar: 'تاريخ الإنشاء' },
  medicalDisclaimer: {
    en: 'This is traditional spiritual guidance, not medical advice.',
    fr: "Ceci est un conseil spirituel traditionnel, et non un avis médical.",
    ar: 'هذا إرشاد روحي تقليدي، وليس نصيحة طبية.',
  },
  resultsTitle: { en: 'Who Am I Results - Asrariya', fr: 'Résultats Qui Suis-Je - Asrariya', ar: 'نتائج من أنا - أسرارية' },
  shareResultsTitle: { en: 'Asrariya - Who Am I Results', fr: 'Asrariya - Résultats Qui Suis-Je', ar: 'أسرارية - نتائج من أنا' },
  shareResultsDialog: { en: 'Share Who Am I Results', fr: 'Partager les Résultats Qui Suis-Je', ar: 'مشاركة نتائج من أنا' },
};

export default function ShareResultsModal({
  visible,
  onClose,
  data,
  personName,
  motherName,
  currentTab = 'Overview',
}: ShareResultsModalProps) {
  const { t, language } = useLanguage();
  const [shareMode, setShareMode] = useState<ShareMode>('allResults');
  const [shareFormat, setShareFormat] = useState<ShareFormat>('text');
  const [loading, setLoading] = useState(false);

  const getLocalizedString = (key: string, fallback: string) => {
    return t(key) || fallback;
  };

  // Labels are fully trilingual. The underlying deep buruj content only has
  // en/fr, so bi()/biArr() fall back to English for Arabic — matching how
  // that data is handled everywhere else in the app.
  const LANG: ShareLang = language === 'ar' ? 'ar' : language === 'fr' ? 'fr' : 'en';
  const L = (key: keyof typeof SHARE_LABELS): string => SHARE_LABELS[key][LANG];
  const bi = (field: { en: string; fr: string }): string => (LANG === 'fr' ? field.fr : field.en);
  const biArr = (field: { en: string[]; fr: string[] }): string[] => (LANG === 'fr' ? field.fr : field.en);
  const dateLocale = LANG === 'ar' ? 'ar' : LANG === 'fr' ? 'fr-FR' : 'en-US';
  const zodiacName = (z: { nameEn: string; nameFr?: string; nameAr?: string }): string =>
    LANG === 'ar' ? (z.nameAr || z.nameEn) : LANG === 'fr' ? (z.nameFr || z.nameEn) : z.nameEn;
  const stoneName = (s: { name: string; nameFr?: string; nameAr?: string }): string =>
    LANG === 'ar' ? (s.nameAr || s.name) : LANG === 'fr' ? (s.nameFr || s.name) : s.name;

  // Generate text content based on selection
  const generateTextContent = (mode: ShareMode): string => {
    const { burujProfile, personTotal, motherTotal, combinedTotal, repetitionCount, burujRemainder, birthProfile, calculationMethod } = data;
    const zodiac = getZodiacSign(burujRemainder);
    const isBirthDateMethod = calculationMethod === 'birthdate';

    const lines: string[] = [];

    // Header
    lines.push(L('headerTitle'));
    lines.push('═'.repeat(35));
    lines.push('');

    // Basic Info
    if (isBirthDateMethod) {
      lines.push(`📅 ${personName}`);
      if (birthProfile?.dobISO) {
        lines.push(`📆 ${L('birthDate')}: ${birthProfile.dobISO}`);
      }
      if (birthProfile?.birthTime) {
        lines.push(`🕐 ${L('birthTime')}: ${birthProfile.birthTime}`);
      }
      if (birthProfile?.birthLocation?.label) {
        lines.push(`📍 ${L('birthLocation')}: ${birthProfile.birthLocation.label}`);
      }
    } else {
      lines.push(`👤 ${L('person')}: ${personName}`);
      if (motherName) {
        lines.push(`👩 ${L('mother')}: ${motherName}`);
      }
    }
    lines.push('');

    // Mode-specific content
    if (mode === 'currentTab') {
      lines.push(`📑 ${L('tab')}: ${currentTab}`);
      lines.push('─'.repeat(25));
      lines.push(generateTabContent(currentTab));
    } else {
      // All results
      lines.push(L('overview'));
      lines.push('─'.repeat(25));
      lines.push(`🔮 ${L('element')}: ${ELEMENT_NAMES[burujProfile.element?.toLowerCase()]?.[language] || burujProfile.element}`);
      lines.push(`⭐ ${L('burujRemainder')}: #${burujRemainder}`);
      if (zodiac) {
        lines.push(`♈ ${L('zodiac')}: ${language === 'ar' ? zodiac.nameAr : language === 'fr' ? zodiac.nameFr || zodiac.nameEn : zodiac.nameEn}`);
      }
      lines.push('');

      // Birth Profile (if available)
      if (birthProfile) {
        lines.push(L('birthProfile'));
        lines.push('─'.repeat(25));
        lines.push(`☀️ ${L('sunSign')}: ${getZodiacByIndex(birthProfile.sunSign.burjIndex, language)}`);
        lines.push('');
      }

      // Abjad Numerology (for name-based)
      if (!isBirthDateMethod && personTotal) {
        lines.push(L('numerology'));
        lines.push('─'.repeat(25));
        lines.push(`${L('personTotal')}: ${personTotal}`);
        lines.push(`${L('motherTotal')}: ${motherTotal}`);
        lines.push(`${L('combined')}: ${combinedTotal}`);
        lines.push(`${L('dhikrCount')}: ${repetitionCount}`);
        lines.push('');
      }

      // Personality
      if (burujProfile.personality?.en) {
        lines.push(L('personality'));
        lines.push('─'.repeat(25));
        const personality = LANG === 'fr' && burujProfile.personality.fr ? burujProfile.personality.fr : burujProfile.personality.en;
        if (personality.temperament) {
          lines.push(`${L('temperament')}: ${personality.temperament}`);
        }
        if (personality.dreams) {
          lines.push(`${L('dreams')}: ${personality.dreams}`);
        }
        lines.push('');
      }

      // Career
      if (burujProfile.career?.modern_recommended?.en) {
        lines.push(L('careerFields'));
        lines.push('─'.repeat(25));
        const careerList = LANG === 'fr' && burujProfile.career.modern_recommended.fr
          ? burujProfile.career.modern_recommended.fr
          : burujProfile.career.modern_recommended.en;
        careerList.slice(0, 3).forEach((cat) => {
          lines.push(`• ${cat.category}: ${cat.items.slice(0, 2).join(', ')}`);
        });
        lines.push('');
      }

      // Blessed Day
      if (burujProfile.blessed_day?.day?.en) {
        lines.push(L('blessedDay'));
        lines.push('─'.repeat(25));
        lines.push(`${L('day')}: ${bi(burujProfile.blessed_day.day)}`);
        if (burujProfile.blessed_day.best_for?.en) {
          lines.push(`${L('bestFor')}: ${biArr(burujProfile.blessed_day.best_for).slice(0, 2).join(', ')}`);
        }
        lines.push('');
      }

      // Spiritual Practice
      if (burujProfile.spiritual_practice) {
        lines.push(L('spiritualPractice'));
        lines.push('─'.repeat(25));
        if (burujProfile.spiritual_practice.practice_night?.primary?.en) {
          lines.push(`${L('practiceNight')}: ${bi(burujProfile.spiritual_practice.practice_night.primary)}`);
        }
        if (burujProfile.spiritual_practice.divine_names && 'transliteration' in burujProfile.spiritual_practice.divine_names) {
          lines.push(`${L('divineName')}: ${burujProfile.spiritual_practice.divine_names.transliteration}`);
        }
        lines.push('');
      }

      // Health Awareness
      const healthData = ZODIAC_HEALTH_DATA_BY_BURUJ[burujRemainder];
      if (healthData) {
        lines.push(L('healthAwareness'));
        lines.push('─'.repeat(25));
        lines.push(`${L('element')}: ${healthData.element}`);
        lines.push(`${L('rulingPlanet')}: ${healthData.planet}`);
        if (healthData.watchOutFor?.en?.length) {
          lines.push(`\n${L('watchOutFor')}:`);
          biArr(healthData.watchOutFor).slice(0, 3).forEach((item: string) => lines.push(`• ${item}`));
        }
        if (healthData.foods?.en?.length) {
          lines.push(`\n${L('beneficialFoods')}:`);
          biArr(healthData.foods).slice(0, 3).forEach((item: string) => lines.push(`• ${item}`));
        }
        lines.push('');
      }

      // Zodiac Stones
      const zodiacStoneData = ZODIAC_COMPLETE_DATA[burujRemainder === 0 ? 12 : burujRemainder];
      if (zodiacStoneData?.stones?.length) {
        lines.push(L('zodiacStones'));
        lines.push('─'.repeat(25));
        lines.push(`${L('sign')}: ${zodiacStoneData.symbol} ${zodiacStoneData.zodiacSign}`);
        lines.push(`\n${L('beneficialStones')}:`);
        zodiacStoneData.stones.slice(0, 4).forEach((stone) => {
          lines.push(`• ${stoneName(stone)}`);
        });
        lines.push('');
      }
    }

    // Footer
    lines.push('═'.repeat(35));
    lines.push(L('generatedBy'));
    lines.push(new Date().toLocaleDateString(dateLocale));

    return lines.join('\n');
  };

  const generateTabContent = (tab: string): string => {
    const { burujProfile, personTotal, motherTotal, combinedTotal, repetitionCount, burujRemainder, birthProfile } = data;
    const zodiac = getZodiacSign(burujRemainder);
    const lines: string[] = [];

    switch (tab.toLowerCase()) {
      case 'overview':
        lines.push(`${L('element')}: ${burujProfile.element}`);
        lines.push(`${L('burujRemainder')}: #${burujRemainder}`);
        if (zodiac) {
          lines.push(`${L('zodiac')}: ${zodiacName(zodiac)}`);
        }
        if (personTotal) lines.push(`${L('personTotal')}: ${personTotal}`);
        if (motherTotal) lines.push(`${L('motherTotal')}: ${motherTotal}`);
        lines.push(`${L('dhikrCount')}: ${repetitionCount}`);
        break;

      case 'birth profile':
      case 'profil':
      case 'الملف الفلكي':
        if (birthProfile) {
          lines.push(`${L('sunSign')}: ${getZodiacByIndex(birthProfile.sunSign.burjIndex, language)}`);
          if (birthProfile.birthTime) {
            lines.push(`${L('birthTime')}: ${birthProfile.birthTime}`);
          }
          if (birthProfile.birthLocation?.label) {
            lines.push(`${L('birthLocation')}: ${birthProfile.birthLocation.label}`);
          }
        }
        break;

      case 'personality':
        if (burujProfile.personality?.en) {
          const personality = LANG === 'fr' && burujProfile.personality.fr ? burujProfile.personality.fr : burujProfile.personality.en;
          if (personality.temperament) {
            lines.push(`${L('temperament')}: ${personality.temperament}`);
          }
          if (personality.dreams) {
            lines.push(`${L('dreams')}: ${personality.dreams}`);
          }
          if (personality.communication) {
            lines.push(`${L('communication')}: ${personality.communication}`);
          }
        }
        break;

      case 'career guidance':
      case 'career':
        if (burujProfile.career?.modern_recommended?.en) {
          lines.push(`${L('idealFields')}:`);
          const careerList = LANG === 'fr' && burujProfile.career.modern_recommended.fr
            ? burujProfile.career.modern_recommended.fr
            : burujProfile.career.modern_recommended.en;
          careerList.forEach((cat) => {
            lines.push(`• ${cat.category}: ${cat.items.join(', ')}`);
          });
        }
        break;

      case 'blessed day':
        if (burujProfile.blessed_day) {
          lines.push(`${L('day')}: ${bi(burujProfile.blessed_day.day)}`);
          if (burujProfile.blessed_day.best_for?.en) {
            lines.push(`\n${L('bestActivities')}:`);
            biArr(burujProfile.blessed_day.best_for).forEach((act: string) => lines.push(`• ${act}`));
          }
        }
        break;

      case 'spiritual':
      case 'spiritual practice':
        if (burujProfile.spiritual_practice) {
          if (burujProfile.spiritual_practice.practice_night?.primary?.en) {
            lines.push(`${L('practiceNight')}: ${bi(burujProfile.spiritual_practice.practice_night.primary)}`);
          }
          if (burujProfile.spiritual_practice.divine_names && 'transliteration' in burujProfile.spiritual_practice.divine_names) {
            lines.push(`${L('divineName')}: ${burujProfile.spiritual_practice.divine_names.transliteration}`);
            if ('translation' in burujProfile.spiritual_practice.divine_names) {
              lines.push(`${L('meaning')}: ${bi(burujProfile.spiritual_practice.divine_names.translation)}`);
            }
          }
        }
        break;

      case 'health':
      case 'health awareness':
      case 'santé':
      case 'الصحة': {
        const healthData = ZODIAC_HEALTH_DATA_BY_BURUJ[burujRemainder];
        if (healthData) {
          lines.push(`${L('element')}: ${healthData.element}`);
          lines.push(`${L('rulingPlanet')}: ${healthData.planet}`);
          if (healthData.watchOutFor?.en?.length) {
            lines.push(`\n${L('watchOutForIcon')}:`);
            biArr(healthData.watchOutFor).forEach((item: string) => lines.push(`• ${item}`));
          }
          if (healthData.avoid?.en?.length) {
            lines.push(`\n${L('thingsToAvoid')}:`);
            biArr(healthData.avoid).forEach((item: string) => lines.push(`• ${item}`));
          }
          if (healthData.foods?.en?.length) {
            lines.push(`\n${L('beneficialFoodsIcon')}:`);
            biArr(healthData.foods).forEach((item: string) => lines.push(`• ${item}`));
          }
          if (healthData.spiritualProtection?.en?.length) {
            lines.push(`\n${L('spiritualProtection')}:`);
            biArr(healthData.spiritualProtection).forEach((item: string) => lines.push(`• ${item}`));
          }
        }
        break;
      }

      case 'zodiac stones':
      case 'stones':
      case 'pierres':
      case 'الأحجار': {
        const remainder = burujRemainder === 0 ? 12 : burujRemainder;
        const stoneData = ZODIAC_COMPLETE_DATA[remainder];
        if (stoneData) {
          lines.push(`${stoneData.symbol} ${stoneData.zodiacSign} (${stoneData.zodiacSignAr})`);
          lines.push(`${L('element')}: ${stoneData.element} • ${L('planet')}: ${stoneData.planet}`);
          lines.push(`\n💎 ${L('beneficialStones')}:`);
          stoneData.stones.forEach((stone) => {
            lines.push(`• ${stoneName(stone)} (${stone.nameAr})`);
          });
        }
        break;
      }

      default:
        lines.push(LANG === 'ar' ? `محتوى تبويب ${tab}` : LANG === 'fr' ? `Contenu de l'onglet ${tab}` : `Content for ${tab} tab`);
    }

    return lines.join('\n');
  };

  // Generate PDF content
  const generatePDFContent = (mode: ShareMode): string => {
    const { burujProfile, personTotal, motherTotal, combinedTotal, repetitionCount, burujRemainder, birthProfile, calculationMethod } = data;
    const zodiac = getZodiacSign(burujRemainder);
    const isBirthDateMethod = calculationMethod === 'birthdate';

    const sections: string[] = [];

    // Header
    sections.push(`
      <h1>${L('pdfHeaderTitle')}</h1>
      <div class="info-section">
        ${isBirthDateMethod ? `
          <div class="info-row"><span class="label">📅 ${L('date')}:</span><span>${personName}</span></div>
          ${birthProfile?.dobISO ? `<div class="info-row"><span class="label">${L('birthDate')}:</span><span>${birthProfile.dobISO}</span></div>` : ''}
          ${birthProfile?.birthTime ? `<div class="info-row"><span class="label">${L('birthTime')}:</span><span>${birthProfile.birthTime}</span></div>` : ''}
          ${birthProfile?.birthLocation?.label ? `<div class="info-row"><span class="label">${L('birthLocation')}:</span><span>${birthProfile.birthLocation.label}</span></div>` : ''}
        ` : `
          <div class="info-row"><span class="label">${L('person')}:</span><span>${personName}</span></div>
          ${motherName ? `<div class="info-row"><span class="label">${L('mother')}:</span><span>${motherName}</span></div>` : ''}
        `}
        <div class="info-row"><span class="label">${L('generated')}:</span><span>${new Date().toLocaleDateString(dateLocale)}</span></div>
      </div>
    `);

    if (mode === 'allResults' || currentTab.toLowerCase() === 'overview') {
      // Overview
      sections.push(`
        <h2>${L('overview')}</h2>
        <div class="info-section">
          <div class="info-row"><span class="label">${L('element')}:</span><span>${burujProfile.element}</span></div>
          <div class="info-row"><span class="label">${L('burujRemainder')}:</span><span>#${burujRemainder}</span></div>
          ${zodiac ? `<div class="info-row"><span class="label">${L('zodiacSign')}:</span><span>${zodiacName(zodiac)}</span></div>` : ''}
        </div>
      `);
    }

    // Birth Profile
    if (birthProfile && (mode === 'allResults' || currentTab.toLowerCase().includes('birth') || currentTab.toLowerCase().includes('profil'))) {
      const sunSignArr = LANG === 'ar' ? ZODIAC_AR : LANG === 'fr' ? ZODIAC_FR : ZODIAC_EN;
      sections.push(`
        <h2>${L('birthProfile')}</h2>
        <div class="info-section">
          <div class="info-row"><span class="label">${L('sunSign')}:</span><span>${ZODIAC_SYMBOLS[birthProfile.sunSign.burjIndex]} ${sunSignArr[birthProfile.sunSign.burjIndex]}</span></div>
          ${birthProfile.birthTime ? `<div class="info-row"><span class="label">${L('birthTime')}:</span><span>${birthProfile.birthTime}</span></div>` : ''}
          ${birthProfile.birthLocation?.label ? `<div class="info-row"><span class="label">${L('birthLocation')}:</span><span>${birthProfile.birthLocation.label}</span></div>` : ''}
        </div>
      `);
    }

    // Abjad Numerology (for name-based)
    if (!isBirthDateMethod && personTotal && (mode === 'allResults' || currentTab.toLowerCase() === 'overview')) {
      sections.push(`
        <h2>${L('numerology')}</h2>
        <div class="info-section">
          <div class="info-row"><span class="label">${L('personTotal')}:</span><span>${personTotal}</span></div>
          <div class="info-row"><span class="label">${L('motherTotal')}:</span><span>${motherTotal}</span></div>
          <div class="info-row"><span class="label">${L('combinedTotal')}:</span><span>${combinedTotal}</span></div>
          <div class="info-row"><span class="label">${L('dhikrCount')}:</span><span>${repetitionCount}</span></div>
        </div>
      `);
    }

    // Personality
    if (burujProfile.personality?.en && (mode === 'allResults' || currentTab.toLowerCase() === 'personality')) {
      const personality = LANG === 'fr' && burujProfile.personality.fr ? burujProfile.personality.fr : burujProfile.personality.en;
      sections.push(`
        <h2>${L('personalityProfile')}</h2>
        <div class="info-section">
          ${personality.temperament ? `<div class="info-row"><span class="label">${L('temperament')}:</span><span>${personality.temperament}</span></div>` : ''}
          ${personality.dreams ? `<div class="info-row"><span class="label">${L('dreams')}:</span><span>${personality.dreams}</span></div>` : ''}
          ${personality.communication ? `<div class="info-row"><span class="label">${L('communication')}:</span><span>${personality.communication}</span></div>` : ''}
        </div>
      `);
    }

    // Career
    if (burujProfile.career && (mode === 'allResults' || currentTab.toLowerCase().includes('career'))) {
      const careerCategories = (LANG === 'fr' && burujProfile.career.modern_recommended?.fr
        ? burujProfile.career.modern_recommended.fr
        : burujProfile.career.modern_recommended?.en) || [];
      const traditional = burujProfile.career.traditional ? bi(burujProfile.career.traditional) : '';
      sections.push(`
        <h2>${L('careerGuidance')}</h2>
        <div class="info-section">
          ${traditional ? `<p><strong>${L('traditional')}:</strong> ${traditional}</p>` : ''}
          ${careerCategories.length > 0 ? `
            <h3>${L('recommendedFields')}</h3>
            <ul>${careerCategories.map((cat) => `<li><strong>${cat.category}:</strong> ${cat.items.join(', ')}</li>`).join('')}</ul>
          ` : ''}
        </div>
      `);
    }

    // Blessed Day
    if (burujProfile.blessed_day && (mode === 'allResults' || currentTab.toLowerCase().includes('blessed'))) {
      const activities = burujProfile.blessed_day.best_for ? biArr(burujProfile.blessed_day.best_for) : [];
      sections.push(`
        <h2>${L('blessedDay')}</h2>
        <div class="info-section">
          <div class="info-row"><span class="label">${L('day')}:</span><span>${bi(burujProfile.blessed_day.day)}</span></div>
          ${activities.length > 0 ? `
            <h3>${L('bestActivities')}</h3>
            <ul>${activities.map((a: string) => `<li>${a}</li>`).join('')}</ul>
          ` : ''}
        </div>
      `);
    }

    // Spiritual Practice
    if (burujProfile.spiritual_practice && (mode === 'allResults' || currentTab.toLowerCase().includes('spiritual'))) {
      const divineNames = burujProfile.spiritual_practice.divine_names;
      sections.push(`
        <h2>${L('spiritualPractice')}</h2>
        <div class="info-section">
          ${burujProfile.spiritual_practice.practice_night?.primary?.en ? `
            <div class="info-row"><span class="label">${L('practiceNight')}:</span><span>${bi(burujProfile.spiritual_practice.practice_night.primary)}</span></div>
          ` : ''}
          ${divineNames && 'transliteration' in divineNames ? `
            <div class="info-row"><span class="label">${L('divineName')}:</span><span>${divineNames.arabic} (${divineNames.transliteration})</span></div>
            ${'translation' in divineNames ? `<div class="info-row"><span class="label">${L('meaning')}:</span><span>${bi(divineNames.translation)}</span></div>` : ''}
          ` : ''}
        </div>
      `);
    }

    // Health Awareness
    const healthData = ZODIAC_HEALTH_DATA_BY_BURUJ[burujRemainder];
    if (healthData && (mode === 'allResults' || currentTab.toLowerCase().includes('health'))) {
      sections.push(`
        <h2>${L('healthAwareness')}</h2>
        <div class="info-section">
          <div class="info-row"><span class="label">${L('element')}:</span><span>${healthData.element}</span></div>
          <div class="info-row"><span class="label">${L('rulingPlanet')}:</span><span>${healthData.planet}</span></div>
          ${healthData.watchOutFor?.en?.length ? `
            <h3>${L('watchOutForIcon')}</h3>
            <ul>${biArr(healthData.watchOutFor).map((item: string) => `<li>${item}</li>`).join('')}</ul>
          ` : ''}
          ${healthData.avoid?.en?.length ? `
            <h3>${L('thingsToAvoid')}</h3>
            <ul>${biArr(healthData.avoid).map((item: string) => `<li>${item}</li>`).join('')}</ul>
          ` : ''}
          ${healthData.foods?.en?.length ? `
            <h3>${L('beneficialFoodsIcon')}</h3>
            <ul>${biArr(healthData.foods).map((item: string) => `<li>${item}</li>`).join('')}</ul>
          ` : ''}
          ${healthData.spiritualProtection?.en?.length ? `
            <h3>${L('spiritualProtection')}</h3>
            <ul>${biArr(healthData.spiritualProtection).map((item: string) => `<li>${item}</li>`).join('')}</ul>
          ` : ''}
        </div>
        <p style="font-size: 11px; color: #666; margin-top: 10px;">
          💡 ${L('medicalDisclaimer')}
        </p>
      `);
    }

    // Zodiac Stones & Crystals
    const remainder = burujRemainder === 0 ? 12 : burujRemainder;
    const zodiacStoneData = ZODIAC_COMPLETE_DATA[remainder];
    if (zodiacStoneData?.stones?.length && (mode === 'allResults' || currentTab.toLowerCase().includes('stone') || currentTab.toLowerCase().includes('pierre') || currentTab.toLowerCase().includes('الأحجار'))) {
      sections.push(`
        <h2>${L('zodiacStones')}</h2>
        <div class="info-section">
          <div class="info-row"><span class="label">${L('sign')}:</span><span>${zodiacStoneData.symbol} ${zodiacStoneData.zodiacSign} (${zodiacStoneData.zodiacSignAr})</span></div>
          <div class="info-row"><span class="label">${L('element')}:</span><span>${zodiacStoneData.element}</span></div>
          <div class="info-row"><span class="label">${L('planet')}:</span><span>${zodiacStoneData.planet}</span></div>
          <h3>${L('beneficialStones')}</h3>
          <ul>${zodiacStoneData.stones.map((stone) => `<li><strong>${stoneName(stone)}</strong> - ${stone.nameAr} (${stone.nameFr})</li>`).join('')}</ul>
        </div>
      `);
    }

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${L('resultsTitle')}</title>
  <style>
    body {
      font-family: 'Helvetica Neue', 'Arial', sans-serif;
      padding: 40px;
      color: #333;
      line-height: 1.6;
    }
    h1 {
      color: #1e1b4b;
      border-bottom: 3px solid #8b5cf6;
      padding-bottom: 15px;
      font-size: 28px;
    }
    h2 {
      color: #7c3aed;
      margin-top: 30px;
      font-size: 20px;
      border-left: 4px solid #8b5cf6;
      padding-left: 12px;
    }
    h3 {
      color: #6d28d9;
      font-size: 16px;
      margin-top: 15px;
    }
    .info-section {
      margin: 15px 0;
      padding: 20px;
      background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
      border-radius: 12px;
      border: 1px solid #e9d5ff;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      margin: 10px 0;
      padding: 8px 0;
      border-bottom: 1px solid rgba(139, 92, 246, 0.1);
    }
    .info-row:last-child {
      border-bottom: none;
    }
    .label {
      font-weight: 600;
      color: #5b21b6;
    }
    ul {
      margin: 10px 0;
      padding-left: 20px;
    }
    li {
      margin: 8px 0;
      color: #4c1d95;
    }
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 2px solid #e9d5ff;
      text-align: center;
      color: #8b5cf6;
      font-size: 12px;
    }
  </style>
</head>
<body>
  ${sections.join('')}
  <div class="footer">
    <p>${L('generatedBy')}</p>
    <p>${new Date().toLocaleString(dateLocale)}</p>
  </div>
</body>
</html>
    `.trim();
  };

  const handleShare = async () => {
    setLoading(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      if (shareFormat === 'text') {
        const message = generateTextContent(shareMode);
        await Share.share({
          message,
          title: L('shareResultsTitle'),
        });
      } else {
        // PDF
        const html = generatePDFContent(shareMode);
        const { uri } = await Print.printToFileAsync({ html });

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri, {
            mimeType: 'application/pdf',
            dialogTitle: L('shareResultsDialog'),
          });
        } else {
          Alert.alert(
            getLocalizedString('common.success', 'Success'),
            getLocalizedString('share.pdfSaved', 'PDF saved successfully!')
          );
        }
      }

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onClose();
    } catch (error) {
      console.error('Share error:', error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        getLocalizedString('common.error', 'Error'),
        getLocalizedString('share.failed', 'Failed to share. Please try again.')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Share2 size={24} color="#a78bfa" />
            <Text style={styles.title}>
              {language === 'ar' ? 'مشاركة النتائج' : language === 'fr' ? 'Partager les Résultats' : 'Share Results'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          {/* Content Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              {language === 'ar' ? 'ما تريد مشاركته' : language === 'fr' ? 'Que partager' : 'What to share'}
            </Text>
            <View style={styles.optionRow}>
              <TouchableOpacity
                style={[styles.optionButton, shareMode === 'currentTab' && styles.optionButtonSelected]}
                onPress={() => setShareMode('currentTab')}
              >
                <Text style={[styles.optionText, shareMode === 'currentTab' && styles.optionTextSelected]}>
                  {language === 'ar' ? `التبويب الحالي (${currentTab})` : language === 'fr' ? `Onglet actuel (${currentTab})` : `Current Tab (${currentTab})`}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.optionButton, shareMode === 'allResults' && styles.optionButtonSelected]}
                onPress={() => setShareMode('allResults')}
              >
                <Text style={[styles.optionText, shareMode === 'allResults' && styles.optionTextSelected]}>
                  {language === 'ar' ? 'جميع النتائج' : language === 'fr' ? 'Tous les résultats' : 'All Results'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Format Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              {language === 'ar' ? 'التنسيق' : language === 'fr' ? 'Format' : 'Format'}
            </Text>
            <View style={styles.optionRow}>
              <TouchableOpacity
                style={[styles.formatButton, shareFormat === 'text' && styles.formatButtonSelected]}
                onPress={() => setShareFormat('text')}
              >
                <Text style={styles.formatIcon}>📝</Text>
                <Text style={[styles.formatText, shareFormat === 'text' && styles.formatTextSelected]}>
                  {language === 'ar' ? 'نص' : language === 'fr' ? 'Texte' : 'Text'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.formatButton, shareFormat === 'pdf' && styles.formatButtonSelected]}
                onPress={() => setShareFormat('pdf')}
              >
                <FileText size={20} color={shareFormat === 'pdf' ? '#8b5cf6' : '#64748b'} />
                <Text style={[styles.formatText, shareFormat === 'pdf' && styles.formatTextSelected]}>
                  PDF
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Share Button */}
          <TouchableOpacity
            style={[styles.shareButton, loading && styles.shareButtonDisabled]}
            onPress={handleShare}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <>
                <Share2 size={20} color="#ffffff" />
                <Text style={styles.shareButtonText}>
                  {language === 'ar' ? 'مشاركة' : language === 'fr' ? 'Partager' : 'Share'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#1e1b4b',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginLeft: 12,
  },
  closeButton: {
    padding: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94a3b8',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  optionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  optionButtonSelected: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderColor: '#8b5cf6',
  },
  optionText: {
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
  },
  optionTextSelected: {
    color: '#a78bfa',
    fontWeight: '600',
  },
  formatButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  formatButtonSelected: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderColor: '#8b5cf6',
  },
  formatIcon: {
    fontSize: 20,
  },
  formatText: {
    fontSize: 16,
    color: '#94a3b8',
    fontWeight: '500',
  },
  formatTextSelected: {
    color: '#a78bfa',
    fontWeight: '600',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#8b5cf6',
    marginTop: 8,
  },
  shareButtonDisabled: {
    opacity: 0.6,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
});
