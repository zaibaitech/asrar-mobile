"use client";

import { BookOpen, HelpCircle, Info, Sparkles, X } from "lucide-react";
import React, { useState } from "react";
import { useLanguage } from "../../../contexts/LanguageContext";

interface IstikharaEducationProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * IstikharaEducation - Interactive educational modal
 * 
 * Comprehensive learning center covering:
 * - History and significance of Istikhara
 * - Understanding the Buruj system
 * - Element correspondences
 * - How to interpret results
 * - Practical applications
 * 
 * Features:
 * - Tabbed content organization
 * - Visual diagrams
 * - Glossary of terms
 * - Bilingual support
 */
export function IstikharaEducation({ isOpen, onClose }: IstikharaEducationProps) {
  const { language } = useLanguage();
  const [activeSection, setActiveSection] = useState<'history' | 'buruj' | 'elements' | 'interpretation' | 'glossary'>('history');

  if (!isOpen) return null;

  const sections = [
    { key: 'history' as const, label: language === 'en' ? 'History & Significance' : 'Histoire & Signification', icon: BookOpen },
    { key: 'buruj' as const, label: language === 'en' ? 'The Buruj System' : 'Le Système Buruj', icon: Sparkles },
    { key: 'elements' as const, label: language === 'en' ? 'Four Elements' : 'Quatre Éléments', icon: Info },
    { key: 'interpretation' as const, label: language === 'en' ? 'Reading Results' : 'Lire les Résultats', icon: HelpCircle },
    { key: 'glossary' as const, label: language === 'en' ? 'Glossary' : 'Glossaire', icon: BookOpen },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {language === 'en' ? 'Learning Center' : 'Centre d\'Apprentissage'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Navigation */}
          <div className="w-64 border-r border-gray-200 dark:border-gray-700 p-4 space-y-2 overflow-y-auto">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.key}
                  onClick={() => setActiveSection(section.key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                    activeSection === section.key
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100 font-semibold'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm">{section.label}</span>
                </button>
              );
            })}
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeSection === 'history' && <HistoryContent language={language} />}
            {activeSection === 'buruj' && <BurujContent language={language} />}
            {activeSection === 'elements' && <ElementsContent language={language} />}
            {activeSection === 'interpretation' && <InterpretationContent language={language} />}
            {activeSection === 'glossary' && <GlossaryContent language={language} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function HistoryContent({ language }: { language: string }) {
  return (
    <div className="space-y-6 prose dark:prose-invert max-w-none">
      <h3 className="text-xl font-bold">
        {language === 'en' ? 'The Ancient Practice of Istikharah al-Asmā\'' : 'La Pratique Ancienne d\'Istikharah al-Asmā\''}
      </h3>
      
      <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
        <p className="text-sm leading-relaxed">
          {language === 'en' 
            ? 'Istikharah al-Asmā\' (Spiritual Guidance Through Names) is a classical Islamic tradition rooted in the science of Ilm al-Huruf (Science of Letters) and ancient astrological wisdom. This practice combines the numerical values of names with the Buruj (zodiacal mansions) to provide spiritual insight and guidance.'
            : 'Istikharah al-Asmā\' (Guidance Spirituelle par les Noms) est une tradition islamique classique enracinée dans la science de Ilm al-Huruf (Science des Lettres) et la sagesse astrologique ancienne. Cette pratique combine les valeurs numériques des noms avec le Buruj (maisons zodiacales) pour fournir une perspicacité et des conseils spirituels.'}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-lg mb-2">
            {language === 'en' ? 'Historical Context' : 'Contexte Historique'}
          </h4>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>
              {language === 'en'
                ? 'Traced back to classical Islamic scholars and practitioners of Ilm al-Huruf'
                : 'Remonte aux savants islamiques classiques et praticiens de Ilm al-Huruf'}
            </li>
            <li>
              {language === 'en'
                ? 'Integrates Arabic letter numerology (Abjad) with celestial correspondences'
                : 'Intègre la numérologie des lettres arabes (Abjad) avec les correspondances célestes'}
            </li>
            <li>
              {language === 'en'
                ? 'Used for personal guidance, name selection, and spiritual counseling'
                : 'Utilisé pour les conseils personnels, la sélection de noms et le conseil spirituel'}
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-lg mb-2">
            {language === 'en' ? 'Purpose & Applications' : 'But & Applications'}
          </h4>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>{language === 'en' ? 'Understanding personality traits and temperament' : 'Comprendre les traits de personnalité et le tempérament'}</li>
            <li>{language === 'en' ? 'Career and life path guidance' : 'Orientation professionnelle et parcours de vie'}</li>
            <li>{language === 'en' ? 'Optimal timing for important decisions' : 'Timing optimal pour les décisions importantes'}</li>
            <li>{language === 'en' ? 'Spiritual practices aligned with personal nature' : 'Pratiques spirituelles alignées avec la nature personnelle'}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function BurujContent({ language }: { language: string }) {
  const burujData = [
    { num: 1, element: '🔥', name: 'Aries/Hamal', ar: 'الحمل' },
    { num: 2, element: '🌍', name: 'Taurus/Thawr', ar: 'الثور' },
    { num: 3, element: '💨', name: 'Gemini/Jawzā', ar: 'الجوزاء' },
    { num: 4, element: '💧', name: 'Cancer/Saraṭān', ar: 'السرطان' },
    { num: 5, element: '🔥', name: 'Leo/Asad', ar: 'الأسد' },
    { num: 6, element: '🌍', name: 'Virgo/Sunbulah', ar: 'السنبلة' },
    { num: 7, element: '💨', name: 'Libra/Mīzān', ar: 'الميزان' },
    { num: 8, element: '💧', name: 'Scorpio/ʿAqrab', ar: 'العقرب' },
    { num: 9, element: '🔥', name: 'Sagittarius/Qaws', ar: 'القوس' },
    { num: 10, element: '🌍', name: 'Capricorn/Jady', ar: 'الجدي' },
    { num: 11, element: '💨', name: 'Aquarius/Dalw', ar: 'الدلو' },
    { num: 12, element: '💧', name: 'Pisces/Ḥūt', ar: 'الحوت' },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">
        {language === 'en' ? 'The Twelve Buruj (Zodiacal Mansions)' : 'Les Douze Buruj (Maisons Zodiacales)'}
      </h3>

      <p className="text-gray-700 dark:text-gray-300">
        {language === 'en'
          ? 'The Buruj system divides the celestial sphere into 12 sections, each associated with specific elements and qualities. Your personal Buruj is determined by the remainder when dividing the sum of names by 12.'
          : 'Le système Buruj divise la sphère céleste en 12 sections, chacune associée à des éléments et des qualités spécifiques. Votre Buruj personnel est déterminé par le reste lors de la division de la somme des noms par 12.'}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {burujData.map((buruj) => (
          <div key={buruj.num} className="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 w-8">
                {buruj.num}
              </div>
              <div className="text-3xl">{buruj.element}</div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900 dark:text-gray-100">{buruj.name}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-arabic" dir="rtl">{buruj.ar}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ElementsContent({ language }: { language: string }) {
  const elements = [
    {
      name: language === 'en' ? 'Fire' : 'Feu',
      emoji: '🔥',
      color: 'red',
      traits: language === 'en' 
        ? ['Passionate', 'Bold', 'Creative', 'Energetic']
        : ['Passionné', 'Audacieux', 'Créatif', 'Énergique'],
      careers: language === 'en'
        ? ['Leadership', 'Arts', 'Entrepreneurship']
        : ['Leadership', 'Arts', 'Entrepreneuriat'],
    },
    {
      name: language === 'en' ? 'Earth' : 'Terre',
      emoji: '🌍',
      color: 'amber',
      traits: language === 'en'
        ? ['Practical', 'Reliable', 'Patient', 'Grounded']
        : ['Pratique', 'Fiable', 'Patient', 'Ancré'],
      careers: language === 'en'
        ? ['Finance', 'Agriculture', 'Engineering']
        : ['Finance', 'Agriculture', 'Ingénierie'],
    },
    {
      name: language === 'en' ? 'Air' : 'Air',
      emoji: '💨',
      color: 'cyan',
      traits: language === 'en'
        ? ['Intellectual', 'Communicative', 'Adaptable', 'Social']
        : ['Intellectuel', 'Communicatif', 'Adaptable', 'Social'],
      careers: language === 'en'
        ? ['Education', 'Communication', 'Technology']
        : ['Éducation', 'Communication', 'Technologie'],
    },
    {
      name: language === 'en' ? 'Water' : 'Eau',
      emoji: '💧',
      color: 'blue',
      traits: language === 'en'
        ? ['Emotional', 'Intuitive', 'Empathetic', 'Healing']
        : ['Émotionnel', 'Intuitif', 'Empathique', 'Guérisseur'],
      careers: language === 'en'
        ? ['Healthcare', 'Counseling', 'Arts']
        : ['Santé', 'Conseil', 'Arts'],
    },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">
        {language === 'en' ? 'The Four Classical Elements' : 'Les Quatre Éléments Classiques'}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {elements.map((element) => (
          <div
            key={element.name}
            className={`p-6 rounded-xl border-2 border-${element.color}-300 dark:border-${element.color}-700 bg-${element.color}-50 dark:bg-${element.color}-950/20`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="text-4xl">{element.emoji}</div>
              <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100">{element.name}</h4>
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  {language === 'en' ? 'Key Traits' : 'Traits Clés'}
                </div>
                <div className="flex flex-wrap gap-1">
                  {element.traits.map((trait) => (
                    <span
                      key={trait}
                      className={`px-2 py-1 text-xs rounded bg-${element.color}-100 dark:bg-${element.color}-900/30 text-${element.color}-700 dark:text-${element.color}-300`}
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  {language === 'en' ? 'Career Paths' : 'Carrières'}
                </div>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  {element.careers.map((career) => (
                    <li key={career}>• {career}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function InterpretationContent({ language }: { language: string }) {
  return (
    <div className="space-y-6 prose dark:prose-invert max-w-none">
      <h3 className="text-xl font-bold">
        {language === 'en' ? 'How to Read Your Results' : 'Comment Lire Vos Résultats'}
      </h3>

      <div className="space-y-4">
        <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            {language === 'en' ? '1. Overview Tab' : '1. Onglet Vue d\'ensemble'}
          </h4>
          <p className="text-sm text-blue-800 dark:text-blue-200">
            {language === 'en'
              ? 'Start here for quick, actionable guidance. This tab highlights the most important insights for immediate application.'
              : 'Commencez ici pour des conseils rapides et exploitables. Cet onglet met en évidence les informations les plus importantes pour une application immédiate.'}
          </p>
        </div>

        <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
          <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
            {language === 'en' ? '2. Personality Tab' : '2. Onglet Personnalité'}
          </h4>
          <p className="text-sm text-purple-800 dark:text-purple-200">
            {language === 'en'
              ? 'Understand your natural temperament, communication style, and social patterns. Use this for self-awareness and personal growth.'
              : 'Comprenez votre tempérament naturel, votre style de communication et vos modèles sociaux. Utilisez ceci pour la conscience de soi et la croissance personnelle.'}
          </p>
        </div>

        <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
          <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
            {language === 'en' ? '3. Career Tab' : '3. Onglet Carrière'}
          </h4>
          <p className="text-sm text-green-800 dark:text-green-200">
            {language === 'en'
              ? 'Discover career paths that align with your elemental nature. Note both traditional and modern recommendations.'
              : 'Découvrez des parcours professionnels qui s\'alignent avec votre nature élémentaire. Notez les recommandations traditionnelles et modernes.'}
          </p>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
          <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
            {language === 'en' ? '4. Blessed Day Tab' : '4. Onglet Jour Béni'}
          </h4>
          <p className="text-sm text-amber-800 dark:text-amber-200">
            {language === 'en'
              ? 'Schedule important decisions, meetings, and new ventures on your blessed day for optimal spiritual alignment.'
              : 'Planifiez les décisions importantes, les réunions et les nouvelles entreprises le jour béni pour un alignement spirituel optimal.'}
          </p>
        </div>

        <div className="bg-pink-50 dark:bg-pink-950/20 p-4 rounded-lg border border-pink-200 dark:border-pink-800">
          <h4 className="font-semibold text-pink-900 dark:text-pink-100 mb-2">
            {language === 'en' ? '5. Spiritual Tab' : '5. Onglet Spirituel'}
          </h4>
          <p className="text-sm text-pink-800 dark:text-pink-200">
            {language === 'en'
              ? 'Follow the recommended spiritual practices, Divine Names, and Quranic verses for protection and balance.'
              : 'Suivez les pratiques spirituelles recommandées, les Noms Divins et les versets coraniques pour la protection et l\'équilibre.'}
          </p>
        </div>
      </div>
    </div>
  );
}

function GlossaryContent({ language }: { language: string }) {
  const terms = [
    {
      term: 'Istikharah',
      definition: language === 'en'
        ? 'Seeking guidance or consultation, traditionally through prayer'
        : 'Recherche de guidance ou de consultation, traditionnellement par la prière',
    },
    {
      term: 'Buruj',
      definition: language === 'en'
        ? 'The twelve zodiacal mansions or constellations'
        : 'Les douze maisons zodiacales ou constellations',
    },
    {
      term: 'Ilm al-Huruf',
      definition: language === 'en'
        ? 'The Science of Letters - study of Arabic letters and their mystical meanings'
        : 'La Science des Lettres - étude des lettres arabes et de leurs significations mystiques',
    },
    {
      term: 'Hadad',
      definition: language === 'en'
        ? 'Numerical value derived from Arabic letters (Abjad numerology)'
        : 'Valeur numérique dérivée des lettres arabes (numérologie Abjad)',
    },
    {
      term: 'Element',
      definition: language === 'en'
        ? 'One of the four classical elements: Fire, Earth, Air, Water'
        : 'L\'un des quatre éléments classiques: Feu, Terre, Air, Eau',
    },
    {
      term: 'Sadaqah',
      definition: language === 'en'
        ? 'Voluntary charity given as an act of worship'
        : 'Charité volontaire donnée comme acte d\'adoration',
    },
    {
      term: 'Divine Names',
      definition: language === 'en'
        ? 'The 99 Names of Allah, each with specific spiritual qualities'
        : 'Les 99 Noms d\'Allah, chacun avec des qualités spirituelles spécifiques',
    },
    {
      term: 'Dhikr',
      definition: language === 'en'
        ? 'Remembrance of Allah through repetition of sacred phrases'
        : 'Rappel d\'Allah par la répétition de phrases sacrées',
    },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">
        {language === 'en' ? 'Glossary of Terms' : 'Glossaire des Termes'}
      </h3>

      <div className="space-y-3">
        {terms.map((item) => (
          <div
            key={item.term}
            className="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="font-semibold text-purple-600 dark:text-purple-400 mb-1">
              {item.term}
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-300">
              {item.definition}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
