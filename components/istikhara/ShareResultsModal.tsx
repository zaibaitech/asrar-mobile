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

  // Generate text content based on selection
  const generateTextContent = (mode: ShareMode): string => {
    const { burujProfile, personTotal, motherTotal, combinedTotal, repetitionCount, burujRemainder, birthProfile, calculationMethod } = data;
    const zodiac = getZodiacSign(burujRemainder);
    const isBirthDateMethod = calculationMethod === 'birthdate';

    const lines: string[] = [];

    // Header
    lines.push('✨ Asrariya - Who Am I Results ✨');
    lines.push('═'.repeat(35));
    lines.push('');

    // Basic Info
    if (isBirthDateMethod) {
      lines.push(`📅 ${personName}`);
      if (birthProfile?.dobISO) {
        lines.push(`📆 Birth Date: ${birthProfile.dobISO}`);
      }
      if (birthProfile?.birthTime) {
        lines.push(`🕐 Birth Time: ${birthProfile.birthTime}`);
      }
      if (birthProfile?.birthLocation?.label) {
        lines.push(`📍 Birth Location: ${birthProfile.birthLocation.label}`);
      }
    } else {
      lines.push(`👤 Person: ${personName}`);
      if (motherName) {
        lines.push(`👩 Mother: ${motherName}`);
      }
    }
    lines.push('');

    // Mode-specific content
    if (mode === 'currentTab') {
      lines.push(`📑 Tab: ${currentTab}`);
      lines.push('─'.repeat(25));
      lines.push(generateTabContent(currentTab));
    } else {
      // All results
      lines.push('📊 Overview');
      lines.push('─'.repeat(25));
      lines.push(`🔮 Element: ${ELEMENT_NAMES[burujProfile.element?.toLowerCase()]?.[language] || burujProfile.element}`);
      lines.push(`⭐ Buruj Remainder: #${burujRemainder}`);
      if (zodiac) {
        lines.push(`♈ Zodiac: ${language === 'ar' ? zodiac.nameAr : language === 'fr' ? zodiac.nameFr || zodiac.nameEn : zodiac.nameEn}`);
      }
      lines.push('');

      // Birth Profile (if available)
      if (birthProfile) {
        lines.push('🌟 Birth Profile');
        lines.push('─'.repeat(25));
        lines.push(`☀️ Sun Sign: ${getZodiacByIndex(birthProfile.sunSign.burjIndex, language)}`);
        lines.push('');
      }

      // Abjad Numerology (for name-based)
      if (!isBirthDateMethod && personTotal) {
        lines.push('🔢 Abjad Numerology');
        lines.push('─'.repeat(25));
        lines.push(`Person Total: ${personTotal}`);
        lines.push(`Mother Total: ${motherTotal}`);
        lines.push(`Combined: ${combinedTotal}`);
        lines.push(`Dhikr Count: ${repetitionCount}`);
        lines.push('');
      }

      // Personality
      if (burujProfile.personality?.en) {
        lines.push('🧠 Personality');
        lines.push('─'.repeat(25));
        if (burujProfile.personality.en.temperament) {
          lines.push(`Temperament: ${burujProfile.personality.en.temperament}`);
        }
        if (burujProfile.personality.en.dreams) {
          lines.push(`Dreams: ${burujProfile.personality.en.dreams}`);
        }
        lines.push('');
      }

      // Career
      if (burujProfile.career?.modern_recommended?.en) {
        lines.push('💼 Career Fields');
        lines.push('─'.repeat(25));
        const careers = burujProfile.career.modern_recommended.en.slice(0, 3);
        careers.forEach((cat) => {
          lines.push(`• ${cat.category}: ${cat.items.slice(0, 2).join(', ')}`);
        });
        lines.push('');
      }

      // Blessed Day
      if (burujProfile.blessed_day?.day?.en) {
        lines.push('📅 Blessed Day');
        lines.push('─'.repeat(25));
        lines.push(`Day: ${burujProfile.blessed_day.day.en}`);
        if (burujProfile.blessed_day.best_for?.en) {
          lines.push(`Best for: ${burujProfile.blessed_day.best_for.en.slice(0, 2).join(', ')}`);
        }
        lines.push('');
      }

      // Spiritual Practice
      if (burujProfile.spiritual_practice) {
        lines.push('🕊️ Spiritual Practice');
        lines.push('─'.repeat(25));
        if (burujProfile.spiritual_practice.practice_night?.primary?.en) {
          lines.push(`Practice Night: ${burujProfile.spiritual_practice.practice_night.primary.en}`);
        }
        if (burujProfile.spiritual_practice.divine_names && 'transliteration' in burujProfile.spiritual_practice.divine_names) {
          lines.push(`Divine Name: ${burujProfile.spiritual_practice.divine_names.transliteration}`);
        }
        lines.push('');
      }

      // Health Awareness
      const healthData = ZODIAC_HEALTH_DATA_BY_BURUJ[burujRemainder];
      if (healthData) {
        lines.push('⚕️ Health Awareness');
        lines.push('─'.repeat(25));
        lines.push(`Element: ${healthData.element}`);
        lines.push(`Ruling Planet: ${healthData.planet}`);
        if (healthData.watchOutFor?.en?.length) {
          lines.push('\nWatch Out For:');
          healthData.watchOutFor.en.slice(0, 3).forEach((item: string) => lines.push(`• ${item}`));
        }
        if (healthData.foods?.en?.length) {
          lines.push('\nBeneficial Foods:');
          healthData.foods.en.slice(0, 3).forEach((item: string) => lines.push(`• ${item}`));
        }
        lines.push('');
      }

      // Zodiac Stones
      const zodiacStoneData = ZODIAC_COMPLETE_DATA[burujRemainder === 0 ? 12 : burujRemainder];
      if (zodiacStoneData?.stones?.length) {
        lines.push('💎 Zodiac Stones & Crystals');
        lines.push('─'.repeat(25));
        lines.push(`Sign: ${zodiacStoneData.symbol} ${zodiacStoneData.zodiacSign}`);
        lines.push('\nBeneficial Stones:');
        zodiacStoneData.stones.slice(0, 4).forEach((stone) => {
          lines.push(`• ${stone.name}`);
        });
        lines.push('');
      }
    }

    // Footer
    lines.push('═'.repeat(35));
    lines.push('Generated by Asrariya Everyday');
    lines.push(new Date().toLocaleDateString());

    return lines.join('\n');
  };

  const generateTabContent = (tab: string): string => {
    const { burujProfile, personTotal, motherTotal, combinedTotal, repetitionCount, burujRemainder, birthProfile } = data;
    const zodiac = getZodiacSign(burujRemainder);
    const lines: string[] = [];

    switch (tab.toLowerCase()) {
      case 'overview':
        lines.push(`Element: ${burujProfile.element}`);
        lines.push(`Buruj Remainder: #${burujRemainder}`);
        if (zodiac) {
          lines.push(`Zodiac: ${zodiac.nameEn}`);
        }
        if (personTotal) lines.push(`Person Total: ${personTotal}`);
        if (motherTotal) lines.push(`Mother Total: ${motherTotal}`);
        lines.push(`Dhikr Count: ${repetitionCount}`);
        break;

      case 'birth profile':
      case 'profil':
      case 'الملف الفلكي':
        if (birthProfile) {
          lines.push(`Sun Sign: ${getZodiacByIndex(birthProfile.sunSign.burjIndex, 'en')}`);
          if (birthProfile.birthTime) {
            lines.push(`Birth Time: ${birthProfile.birthTime}`);
          }
          if (birthProfile.birthLocation?.label) {
            lines.push(`Birth Location: ${birthProfile.birthLocation.label}`);
          }
        }
        break;

      case 'personality':
        if (burujProfile.personality?.en) {
          if (burujProfile.personality.en.temperament) {
            lines.push(`Temperament: ${burujProfile.personality.en.temperament}`);
          }
          if (burujProfile.personality.en.dreams) {
            lines.push(`Dreams: ${burujProfile.personality.en.dreams}`);
          }
          if (burujProfile.personality.en.communication) {
            lines.push(`Communication: ${burujProfile.personality.en.communication}`);
          }
        }
        break;

      case 'career guidance':
      case 'career':
        if (burujProfile.career?.modern_recommended?.en) {
          lines.push('Ideal Fields:');
          burujProfile.career.modern_recommended.en.forEach((cat) => {
            lines.push(`• ${cat.category}: ${cat.items.join(', ')}`);
          });
        }
        break;

      case 'blessed day':
        if (burujProfile.blessed_day) {
          lines.push(`Day: ${burujProfile.blessed_day.day.en}`);
          if (burujProfile.blessed_day.best_for?.en) {
            lines.push('\nBest Activities:');
            burujProfile.blessed_day.best_for.en.forEach((act: string) => lines.push(`• ${act}`));
          }
        }
        break;

      case 'spiritual':
      case 'spiritual practice':
        if (burujProfile.spiritual_practice) {
          if (burujProfile.spiritual_practice.practice_night?.primary?.en) {
            lines.push(`Practice Night: ${burujProfile.spiritual_practice.practice_night.primary.en}`);
          }
          if (burujProfile.spiritual_practice.divine_names && 'transliteration' in burujProfile.spiritual_practice.divine_names) {
            lines.push(`Divine Name: ${burujProfile.spiritual_practice.divine_names.transliteration}`);
            if ('translation' in burujProfile.spiritual_practice.divine_names) {
              lines.push(`Meaning: ${burujProfile.spiritual_practice.divine_names.translation.en}`);
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
          lines.push(`Element: ${healthData.element}`);
          lines.push(`Ruling Planet: ${healthData.planet}`);
          if (healthData.watchOutFor?.en?.length) {
            lines.push('\n⚠️ Watch Out For:');
            healthData.watchOutFor.en.forEach((item: string) => lines.push(`• ${item}`));
          }
          if (healthData.avoid?.en?.length) {
            lines.push('\n🚫 Things to Avoid:');
            healthData.avoid.en.forEach((item: string) => lines.push(`• ${item}`));
          }
          if (healthData.foods?.en?.length) {
            lines.push('\n🍎 Beneficial Foods:');
            healthData.foods.en.forEach((item: string) => lines.push(`• ${item}`));
          }
          if (healthData.spiritualProtection?.en?.length) {
            lines.push('\n🛡️ Spiritual Protection:');
            healthData.spiritualProtection.en.forEach((item: string) => lines.push(`• ${item}`));
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
          lines.push(`Element: ${stoneData.element} • Planet: ${stoneData.planet}`);
          lines.push('\n💎 Beneficial Stones:');
          stoneData.stones.forEach((stone) => {
            lines.push(`• ${stone.name} (${stone.nameAr})`);
          });
        }
        break;
      }

      default:
        lines.push(`Content for ${tab} tab`);
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
      <h1>✨ Asrariya - Who Am I Results</h1>
      <div class="info-section">
        ${isBirthDateMethod ? `
          <div class="info-row"><span class="label">📅 Date:</span><span>${personName}</span></div>
          ${birthProfile?.dobISO ? `<div class="info-row"><span class="label">Birth Date:</span><span>${birthProfile.dobISO}</span></div>` : ''}
          ${birthProfile?.birthTime ? `<div class="info-row"><span class="label">Birth Time:</span><span>${birthProfile.birthTime}</span></div>` : ''}
          ${birthProfile?.birthLocation?.label ? `<div class="info-row"><span class="label">Birth Location:</span><span>${birthProfile.birthLocation.label}</span></div>` : ''}
        ` : `
          <div class="info-row"><span class="label">Person:</span><span>${personName}</span></div>
          ${motherName ? `<div class="info-row"><span class="label">Mother:</span><span>${motherName}</span></div>` : ''}
        `}
        <div class="info-row"><span class="label">Generated:</span><span>${new Date().toLocaleDateString()}</span></div>
      </div>
    `);

    if (mode === 'allResults' || currentTab.toLowerCase() === 'overview') {
      // Overview
      sections.push(`
        <h2>📊 Overview</h2>
        <div class="info-section">
          <div class="info-row"><span class="label">Element:</span><span>${burujProfile.element}</span></div>
          <div class="info-row"><span class="label">Buruj Remainder:</span><span>#${burujRemainder}</span></div>
          ${zodiac ? `<div class="info-row"><span class="label">Zodiac Sign:</span><span>${zodiac.nameEn}</span></div>` : ''}
        </div>
      `);
    }

    // Birth Profile
    if (birthProfile && (mode === 'allResults' || currentTab.toLowerCase().includes('birth') || currentTab.toLowerCase().includes('profil'))) {
      sections.push(`
        <h2>🌟 Birth Profile</h2>
        <div class="info-section">
          <div class="info-row"><span class="label">Sun Sign:</span><span>${ZODIAC_SYMBOLS[birthProfile.sunSign.burjIndex]} ${ZODIAC_EN[birthProfile.sunSign.burjIndex]}</span></div>
          ${birthProfile.birthTime ? `<div class="info-row"><span class="label">Birth Time:</span><span>${birthProfile.birthTime}</span></div>` : ''}
          ${birthProfile.birthLocation?.label ? `<div class="info-row"><span class="label">Birth Location:</span><span>${birthProfile.birthLocation.label}</span></div>` : ''}
        </div>
      `);
    }

    // Abjad Numerology (for name-based)
    if (!isBirthDateMethod && personTotal && (mode === 'allResults' || currentTab.toLowerCase() === 'overview')) {
      sections.push(`
        <h2>🔢 Abjad Numerology</h2>
        <div class="info-section">
          <div class="info-row"><span class="label">Person Total:</span><span>${personTotal}</span></div>
          <div class="info-row"><span class="label">Mother Total:</span><span>${motherTotal}</span></div>
          <div class="info-row"><span class="label">Combined Total:</span><span>${combinedTotal}</span></div>
          <div class="info-row"><span class="label">Dhikr Count:</span><span>${repetitionCount}</span></div>
        </div>
      `);
    }

    // Personality
    if (burujProfile.personality?.en && (mode === 'allResults' || currentTab.toLowerCase() === 'personality')) {
      sections.push(`
        <h2>🧠 Personality Profile</h2>
        <div class="info-section">
          ${burujProfile.personality.en.temperament ? `<div class="info-row"><span class="label">Temperament:</span><span>${burujProfile.personality.en.temperament}</span></div>` : ''}
          ${burujProfile.personality.en.dreams ? `<div class="info-row"><span class="label">Dreams:</span><span>${burujProfile.personality.en.dreams}</span></div>` : ''}
          ${burujProfile.personality.en.communication ? `<div class="info-row"><span class="label">Communication:</span><span>${burujProfile.personality.en.communication}</span></div>` : ''}
        </div>
      `);
    }

    // Career
    if (burujProfile.career && (mode === 'allResults' || currentTab.toLowerCase().includes('career'))) {
      const careerCategories = burujProfile.career.modern_recommended?.en || [];
      sections.push(`
        <h2>💼 Career Guidance</h2>
        <div class="info-section">
          ${burujProfile.career.traditional?.en ? `<p><strong>Traditional:</strong> ${burujProfile.career.traditional.en}</p>` : ''}
          ${careerCategories.length > 0 ? `
            <h3>Recommended Fields</h3>
            <ul>${careerCategories.map((cat) => `<li><strong>${cat.category}:</strong> ${cat.items.join(', ')}</li>`).join('')}</ul>
          ` : ''}
        </div>
      `);
    }

    // Blessed Day
    if (burujProfile.blessed_day && (mode === 'allResults' || currentTab.toLowerCase().includes('blessed'))) {
      const activities = burujProfile.blessed_day.best_for?.en || [];
      sections.push(`
        <h2>📅 Blessed Day</h2>
        <div class="info-section">
          <div class="info-row"><span class="label">Day:</span><span>${burujProfile.blessed_day.day.en}</span></div>
          ${activities.length > 0 ? `
            <h3>Best Activities</h3>
            <ul>${activities.map((a: string) => `<li>${a}</li>`).join('')}</ul>
          ` : ''}
        </div>
      `);
    }

    // Spiritual Practice
    if (burujProfile.spiritual_practice && (mode === 'allResults' || currentTab.toLowerCase().includes('spiritual'))) {
      const divineNames = burujProfile.spiritual_practice.divine_names;
      sections.push(`
        <h2>🕊️ Spiritual Practice</h2>
        <div class="info-section">
          ${burujProfile.spiritual_practice.practice_night?.primary?.en ? `
            <div class="info-row"><span class="label">Practice Night:</span><span>${burujProfile.spiritual_practice.practice_night.primary.en}</span></div>
          ` : ''}
          ${divineNames && 'transliteration' in divineNames ? `
            <div class="info-row"><span class="label">Divine Name:</span><span>${divineNames.arabic} (${divineNames.transliteration})</span></div>
            ${'translation' in divineNames ? `<div class="info-row"><span class="label">Meaning:</span><span>${divineNames.translation.en}</span></div>` : ''}
          ` : ''}
        </div>
      `);
    }

    // Health Awareness
    const healthData = ZODIAC_HEALTH_DATA_BY_BURUJ[burujRemainder];
    if (healthData && (mode === 'allResults' || currentTab.toLowerCase().includes('health'))) {
      sections.push(`
        <h2>⚕️ Health Awareness</h2>
        <div class="info-section">
          <div class="info-row"><span class="label">Element:</span><span>${healthData.element}</span></div>
          <div class="info-row"><span class="label">Ruling Planet:</span><span>${healthData.planet}</span></div>
          ${healthData.watchOutFor?.en?.length ? `
            <h3>⚠️ Watch Out For</h3>
            <ul>${healthData.watchOutFor.en.map((item: string) => `<li>${item}</li>`).join('')}</ul>
          ` : ''}
          ${healthData.avoid?.en?.length ? `
            <h3>🚫 Things to Avoid</h3>
            <ul>${healthData.avoid.en.map((item: string) => `<li>${item}</li>`).join('')}</ul>
          ` : ''}
          ${healthData.foods?.en?.length ? `
            <h3>🍎 Beneficial Foods</h3>
            <ul>${healthData.foods.en.map((item: string) => `<li>${item}</li>`).join('')}</ul>
          ` : ''}
          ${healthData.spiritualProtection?.en?.length ? `
            <h3>🛡️ Spiritual Protection</h3>
            <ul>${healthData.spiritualProtection.en.map((item: string) => `<li>${item}</li>`).join('')}</ul>
          ` : ''}
        </div>
        <p style="font-size: 11px; color: #666; margin-top: 10px;">
          💡 This is traditional spiritual guidance, not medical advice.
        </p>
      `);
    }

    // Zodiac Stones & Crystals
    const remainder = burujRemainder === 0 ? 12 : burujRemainder;
    const zodiacStoneData = ZODIAC_COMPLETE_DATA[remainder];
    if (zodiacStoneData?.stones?.length && (mode === 'allResults' || currentTab.toLowerCase().includes('stone') || currentTab.toLowerCase().includes('pierre') || currentTab.toLowerCase().includes('الأحجار'))) {
      sections.push(`
        <h2>💎 Zodiac Stones & Crystals</h2>
        <div class="info-section">
          <div class="info-row"><span class="label">Sign:</span><span>${zodiacStoneData.symbol} ${zodiacStoneData.zodiacSign} (${zodiacStoneData.zodiacSignAr})</span></div>
          <div class="info-row"><span class="label">Element:</span><span>${zodiacStoneData.element}</span></div>
          <div class="info-row"><span class="label">Planet:</span><span>${zodiacStoneData.planet}</span></div>
          <h3>Beneficial Stones</h3>
          <ul>${zodiacStoneData.stones.map((stone) => `<li><strong>${stone.name}</strong> - ${stone.nameAr} (${stone.nameFr})</li>`).join('')}</ul>
        </div>
      `);
    }

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Who Am I Results - Asrariya</title>
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
    <p>Generated by Asrariya Everyday</p>
    <p>${new Date().toLocaleString()}</p>
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
          title: 'Asrariya - Who Am I Results',
        });
      } else {
        // PDF
        const html = generatePDFContent(shareMode);
        const { uri } = await Print.printToFileAsync({ html });

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri, {
            mimeType: 'application/pdf',
            dialogTitle: 'Share Who Am I Results',
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
