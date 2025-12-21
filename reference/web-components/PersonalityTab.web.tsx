"use client";

import React, { useState, useRef } from "react";
import { useLanguage } from "../../../contexts/LanguageContext";
import { translations } from "../../../lib/translations";
import { IstikharaSummaryCard } from "./IstikharaSummaryCard";
import { CareerTabAdvanced } from "./CareerTabAdvanced";
import { SpiritualPracticeTab } from "./SpiritualPracticeTab";
import type { IstikharaCalculationResult } from "../types";
import {
  User,
  Briefcase,
  Calendar,
  Sparkles,
  Download,
  Share2,
  Printer,
  ChevronDown,
  ChevronUp,
  Eye,
  Moon,
  Star,
  Heart,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Info,
  Palette,
  CloudDrizzle,
  Sunrise,
  Users,
  MessageCircle,
  Brain,
  Shield,
  Lightbulb,
  Trophy,
  Target,
  BookOpen
} from "lucide-react";

interface IstikharaResultsProps {
  result: IstikharaCalculationResult;
  onReset: () => void;
}

type TabKey = "overview" | "personality" | "career" | "blessedDay" | "spiritual";

/**
 * IstikharaResults - Enhanced Results Display with Comprehensive Data
 * 
 * Features:
 * - Complete data display for all personality traits, career paths, spiritual practices
 * - Advanced tabbed navigation with smooth transitions
 * - Element-specific theming throughout
 * - Export to PDF/JSON functionality
 * - Share via native share API
 * - Print-friendly layout
 * - Statistics and insights
 * - Progress indicators
 * - Expandable sections for detailed information
 * - Mobile-optimized responsive design
 * - Full accessibility support
 * - Cultural context and scholarly notes
 */
export function IstikharaResults({ result, onReset }: IstikharaResultsProps) {
  const { language } = useLanguage();
  const t = translations[language].istikhara;
  
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [isExporting, setIsExporting] = useState(false);
  const [showAllDetails, setShowAllDetails] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const tabContentRef = useRef<HTMLDivElement>(null);

  // Get element info for theming
  const elementKey = result.burujProfile.element.toLowerCase() as "fire" | "earth" | "air" | "water";
  const elementInfo = t.elements[elementKey];

  // Enhanced element color schemes - Optimized for visibility
  const elementColors = {
    fire: {
      gradient: "from-red-900/40 via-orange-900/30 to-red-900/20",
      border: "border-red-400/50",
      text: "text-red-200",
      accent: "text-orange-300",
      iconBg: "bg-red-500/20",
      hoverBg: "hover:bg-red-500/10",
      glow: "shadow-lg shadow-red-500/30",
      bgDark: "bg-red-950/40"
    },
    earth: {
      gradient: "from-amber-900/40 via-yellow-900/30 to-amber-900/20",
      border: "border-amber-400/50",
      text: "text-amber-200",
      accent: "text-yellow-300",
      iconBg: "bg-amber-500/20",
      hoverBg: "hover:bg-amber-500/10",
      glow: "shadow-lg shadow-amber-500/30",
      bgDark: "bg-amber-950/40"
    },
    air: {
      gradient: "from-cyan-900/40 via-blue-900/30 to-cyan-900/20",
      border: "border-cyan-400/50",
      text: "text-cyan-200",
      accent: "text-blue-300",
      iconBg: "bg-cyan-500/20",
      hoverBg: "hover:bg-cyan-500/10",
      glow: "shadow-lg shadow-cyan-500/30",
      bgDark: "bg-cyan-950/40"
    },
    water: {
      gradient: "from-blue-900/40 via-indigo-900/30 to-blue-900/20",
      border: "border-blue-400/50",
      text: "text-blue-200",
      accent: "text-indigo-300",
      iconBg: "bg-blue-500/20",
      hoverBg: "hover:bg-blue-500/10",
      glow: "shadow-lg shadow-blue-500/30",
      bgDark: "bg-blue-950/40"
    }
  };

  const colors = elementColors[elementKey];

  // Tab configuration with icons
  const tabs: Array<{ key: TabKey; label: string; icon: React.ReactNode; description: string }> = [
    { 
      key: "overview", 
      label: language === "en" ? "Overview" : "Vue d'ensemble", 
      icon: <Sparkles className="w-5 h-5" />,
      description: language === "en" ? "Quick summary" : "Résumé rapide"
    },
    { 
      key: "personality", 
      label: t.results.tabs.personality, 
      icon: <User className="w-5 h-5" />,
      description: language === "en" ? "Your nature" : "Votre nature"
    },
    { 
      key: "career", 
      label: t.results.tabs.career, 
      icon: <Briefcase className="w-5 h-5" />,
      description: language === "en" ? "Career paths" : "Parcours professionnel"
    },
    { 
      key: "blessedDay", 
      label: t.results.tabs.blessedDay, 
      icon: <Calendar className="w-5 h-5" />,
      description: language === "en" ? "Power day" : "Jour de puissance"
    },
    { 
      key: "spiritual", 
      label: t.results.tabs.spiritual, 
      icon: <Moon className="w-5 h-5" />,
      description: language === "en" ? "Practices" : "Pratiques"
    }
  ];

  /**
   * Export to JSON
   */
  const handleExportJSON = () => {
    const data = {
      personName: result.personName,
      motherName: result.motherName,
      element: result.burujProfile.element,
      elementEmoji: result.burujProfile.element_emoji,
      personality: result.burujProfile.personality,
      career: result.burujProfile.career,
      blessedDay: result.burujProfile.blessed_day,
      sadaqah: result.burujProfile.sadaqah,
      spiritualPractice: result.burujProfile.spiritual_practice,
      calculations: {
        totalValue: result.combinedTotal,
        personTotal: result.personTotal,
        motherTotal: result.motherTotal,
        burujRemainder: result.burujRemainder
      },
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `istikhara-${result.personName}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  /**
   * Export to PDF (simplified version)
   */
  const handleExportPDF = async () => {
    setIsExporting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In production, use a library like jsPDF or html2pdf
    window.print();
    
    setIsExporting(false);
  };

  /**
   * Share results
   */
  const handleShare = async () => {
    const shareText = language === 'en'
      ? `I discovered my spiritual profile through Istikhara al-Asmāʾ!\n\n${result.burujProfile.element_emoji} Element: ${result.burujProfile.element}\n📅 Blessed Day: ${result.burujProfile.blessed_day.day[language]}\n\n✨🌙`
      : `J'ai découvert mon profil spirituel avec Istikhara al-Asmāʾ!\n\n${result.burujProfile.element_emoji} Élément: ${result.burujProfile.element}\n📅 Jour Béni: ${result.burujProfile.blessed_day.day[language]}\n\n✨🌙`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Istikhara Profile',
          text: shareText,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      alert(language === 'en' ? 'Copied to clipboard!' : 'Copié!');
    }
  };

  /**
   * Handle tab change and scroll to content
   */
  const handleTabChange = (tabKey: TabKey) => {
    setActiveTab(tabKey);
    // Scroll to tab content after a small delay to ensure content is rendered
    setTimeout(() => {
      tabContentRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }, 100);
  };

  /**
   * Print results
   */
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 pb-12" ref={resultsRef}>
      {/* Tab Navigation - Enhanced */}
      <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-sm border-2 border-white/10 rounded-xl sm:rounded-2xl p-1 sm:p-2">
        <div className="grid grid-cols-5 gap-1 sm:gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`flex flex-col items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-4 rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm transition-all min-w-[60px] sm:min-w-0 ${
                activeTab === tab.key
                  ? `bg-gradient-to-br ${colors.gradient} border-2 ${colors.border} ${colors.glow} text-white scale-105`
                  : "text-white hover:text-white hover:bg-white/5"
              }`}
            >
              <div className={activeTab === tab.key ? colors.accent : 'text-white'}>
                {tab.icon}
              </div>
              <div className="text-center">
                <div className="font-semibold text-white">{tab.label}</div>
                <div className="text-[10px] sm:text-xs opacity-70 hidden md:block text-white">{tab.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons Bar */}
      <div className="flex justify-center">
        <button
          onClick={handleShare}
          className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r ${colors.gradient} border ${colors.border} ${colors.hoverBg} text-white font-semibold rounded-lg sm:rounded-xl transition-all hover:scale-105 text-sm sm:text-base shadow-lg`}
        >
          <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>{language === 'en' ? 'Share' : 'Partager'}</span>
        </button>
      </div>

      {/* Summary Card */}
      <IstikharaSummaryCard result={result} />

      {/* Tab Content */}
      <div ref={tabContentRef} className={`bg-gradient-to-br ${colors.gradient} border-2 ${colors.border} rounded-2xl p-8 ${colors.glow} min-h-[400px] animate-fade-in`}>
        {activeTab === "overview" && (
          <EnhancedOverviewSection result={result} colors={colors} />
        )}
        {activeTab === "personality" && (
          <EnhancedPersonalitySection result={result} colors={colors} showAll={showAllDetails} />
        )}
        {activeTab === "career" && (
          <CareerTabAdvanced result={result} />
        )}
        {activeTab === "blessedDay" && (
          <EnhancedBlessedDaySection result={result} colors={colors} showAll={showAllDetails} />
        )}
        {activeTab === "spiritual" && (
          <SpiritualPracticeTab result={result} />
        )}
      </div>

      {/* Bottom Actions */}
      <div className="flex gap-3 pt-6">
        <button
          onClick={onReset}
          className="flex-1 px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-2xl transition-all hover:scale-105 flex items-center justify-center gap-2"
        >
          <span>←</span>
          <span>{t.ui.backToForm}</span>
        </button>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          .no-print {
            display: none !important;
          }
          
          @page {
            margin: 1cm;
          }
          
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        .font-arabic {
          font-family: 'Amiri', 'Traditional Arabic', serif;
        }
      `}</style>
    </div>
  );
}

/**
 * Enhanced Overview Section - Clean summary without Quick Action Guide
 */
function EnhancedOverviewSection({ 
  result, 
  colors 
}: { 
  result: IstikharaCalculationResult; 
  colors: any;
}) {
  const { language } = useLanguage();
  const profile = result.burujProfile;
  const lang = language as "en" | "fr";

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">
          {language === 'en' ? 'Quick Summary' : 'Résumé Rapide'}
        </h2>
        <p className="text-white/70">
          {language === 'en' 
            ? 'Your spiritual profile at a glance' 
            : 'Votre profil spirituel en un coup d\'œil'}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Element Overview */}
        <div className="p-6 bg-white/5 rounded-xl border border-white/20">
          <div className="flex items-start gap-3">
            <span className="text-4xl">{profile.element_emoji}</span>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">
                {profile.element} {language === 'en' ? 'Element' : 'Élément'}
              </h3>
              <p className="text-sm text-gray-100 leading-relaxed">
                {profile.personality?.[lang]?.temperament || profile.element}
              </p>
            </div>
          </div>
        </div>

        {/* Blessed Day */}
        <div className="p-6 bg-white/5 rounded-xl border border-white/20">
          <div className="flex items-start gap-3">
            <Calendar className="w-10 h-10 text-gray-100" />
            <div>
              <h3 className="text-lg font-bold text-white mb-2">
                {language === 'en' ? 'Your Power Day' : 'Votre Jour de Puissance'}
              </h3>
              <p className="text-2xl font-bold text-white mb-1">
                {profile.blessed_day?.day?.[language] || ''}
              </p>
              {profile.blessed_day?.best_for?.[language]?.[0] && (
                <p className="text-sm text-gray-100">
                  {profile.blessed_day.best_for[language][0]}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Career Direction */}
        <div className="p-6 bg-white/5 rounded-xl border border-white/20">
          <div className="flex items-start gap-3">
            <Briefcase className="w-10 h-10 text-gray-100" />
            <div>
              <h3 className="text-lg font-bold text-white mb-2">
                {language === 'en' ? 'Career Direction' : 'Direction Professionnelle'}
              </h3>
              <p className="text-sm text-gray-100 leading-relaxed">
                {profile.personality?.[lang]?.communication || 
                 profile.career?.principle?.[lang] || 
                 (language === 'en' ? 'Explore career guidance in the Career tab' : 'Explorez l\'orientation professionnelle dans l\'onglet Carrière')}
              </p>
            </div>
          </div>
        </div>

        {/* Spiritual Practice */}
        <div className="p-6 bg-white/5 rounded-xl border border-white/20">
          <div className="flex items-start gap-3">
            <Moon className="w-10 h-10 text-gray-100" />
            <div>
              <h3 className="text-lg font-bold text-white mb-2">
                {language === 'en' ? 'Daily Practice' : 'Pratique Quotidienne'}
              </h3>
              <p className="text-sm text-gray-100 mb-2">
                {profile.spiritual_practice?.divine_names && typeof profile.spiritual_practice.divine_names === 'object' && 'note' in profile.spiritual_practice.divine_names
                  ? profile.spiritual_practice.divine_names.note?.[language]
                  : (language === 'en' ? 'Explore spiritual practices in the Spiritual tab' : 'Explorez les pratiques spirituelles dans l\'onglet Spirituel')}
              </p>
              <p className="text-xs text-white">
                {language === 'en' ? 'Recite daily for spiritual balance' : 'Récitez quotidiennement pour l\'équilibre spirituel'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-400/40 rounded-xl">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-6 h-6 text-blue-300 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-bold text-white mb-2">
              {language === 'en' ? 'Next Steps' : 'Prochaines Étapes'}
            </h3>
            <p className="text-sm text-gray-100 leading-relaxed">
              {language === 'en' 
                ? 'Explore the tabs above to dive deeper into your personality traits, career guidance, blessed day details, and spiritual practices. Each section provides comprehensive insights tailored to your spiritual profile.'
                : 'Explorez les onglets ci-dessus pour approfondir vos traits de personnalité, votre orientation professionnelle, les détails de votre jour béni et vos pratiques spirituelles. Chaque section fournit des informations complètes adaptées à votre profil spirituel.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Enhanced Personality Section with ALL Data
 */
function EnhancedPersonalitySection({ 
  result, 
  colors, 
  showAll 
}: { 
  result: IstikharaCalculationResult; 
  colors: any; 
  showAll: boolean;
}) {
  const { language } = useLanguage();
  const profile = result.burujProfile;
  const personality = profile.personality[language as "en" | "fr"];

  const personalityFields = [
    { 
      key: 'temperament', 
      icon: <Brain className="w-5 h-5" />, 
      title: language === 'en' ? 'Temperament' : 'Tempérament',
      color: 'from-purple-900/30 to-pink-900/20 border-purple-500/30'
    },
    { 
      key: 'communication', 
      icon: <MessageCircle className="w-5 h-5" />, 
      title: language === 'en' ? 'Communication Style' : 'Style de Communication',
      color: 'from-blue-900/30 to-cyan-900/20 border-blue-500/30'
    },
    { 
      key: 'anger', 
      icon: <AlertCircle className="w-5 h-5" />, 
      title: language === 'en' ? 'Anger Pattern' : 'Pattern de Colère',
      color: 'from-red-900/30 to-orange-900/20 border-red-500/30'
    },
    { 
      key: 'social_loved', 
      icon: <Heart className="w-5 h-5" />, 
      title: language === 'en' ? 'Social Strengths' : 'Forces Sociales',
      color: 'from-green-900/30 to-emerald-900/20 border-green-500/30'
    },
    { 
      key: 'social_challenge', 
      icon: <Target className="w-5 h-5" />, 
      title: language === 'en' ? 'Growth Areas' : 'Zones de Croissance',
      color: 'from-yellow-900/30 to-amber-900/20 border-yellow-500/30'
    },
    { 
      key: 'social_attraction', 
      icon: <Users className="w-5 h-5" />, 
      title: language === 'en' ? 'Social Dynamics' : 'Dynamiques Sociales',
      color: 'from-indigo-900/30 to-purple-900/20 border-indigo-500/30'
    },
    { 
      key: 'social_unpopular', 
      icon: <Users className="w-5 h-5" />, 
      title: language === 'en' ? 'Social Challenges' : 'Défis Sociaux',
      color: 'from-gray-900/30 to-slate-900/20 border-gray-500/30'
    },
    { 
      key: 'dreams', 
      icon: <Moon className="w-5 h-5" />, 
      title: language === 'en' ? 'Dream Symbolism' : 'Symbolisme des Rêves',
      color: 'from-violet-900/30 to-purple-900/20 border-violet-500/30'
    },
    { 
      key: 'life_blessing', 
      icon: <Star className="w-5 h-5" />, 
      title: language === 'en' ? 'Life Blessings' : 'Bénédictions de Vie',
      color: 'from-yellow-900/30 to-orange-900/20 border-yellow-500/30'
    },
    { 
      key: 'divine_support', 
      icon: <Sparkles className="w-5 h-5" />, 
      title: language === 'en' ? 'Divine Support' : 'Soutien Divin',
      color: 'from-pink-900/30 to-rose-900/20 border-pink-500/30'
    },
    { 
      key: 'challenge', 
      icon: <Trophy className="w-5 h-5" />, 
      title: language === 'en' ? 'Life Challenges' : 'Défis de Vie',
      color: 'from-orange-900/30 to-red-900/20 border-orange-500/30'
    }
  ];

  const displayFields = showAll 
    ? personalityFields 
    : personalityFields.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center justify-center gap-2 sm:gap-3">
          <User className={`w-6 h-6 sm:w-8 sm:h-8 ${colors.accent}`} />
          {language === 'en' ? 'Your Personality Profile' : 'Votre Profil de Personnalité'}
        </h2>
        <p className="text-sm sm:text-base text-white">
          {language === 'en' 
            ? 'Deep insights into your temperament and character traits'
            : 'Perspectives profondes sur votre tempérament et traits de caractère'}
        </p>
      </div>

      {/* Personality Traits Grid */}
      <div className="grid gap-3 sm:gap-4">
        {displayFields.map((field) => {
          const value = personality[field.key as keyof typeof personality];
          if (!value) return null;

          return (
            <div
              key={field.key}
              className={`p-4 sm:p-5 bg-gradient-to-br ${field.color} border-2 rounded-lg sm:rounded-xl hover:scale-[1.02] transition-transform`}
            >
              <div className="flex items-start gap-2 sm:gap-3">
                <div className={`p-2 ${colors.iconBg} rounded-lg flex-shrink-0`}>
                  {field.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white text-base sm:text-lg mb-2">
                    {field.title}
                  </h3>
                  <p className="text-sm sm:text-base text-white leading-relaxed">
                    {value}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Show More/Less Button */}
      {!showAll && personalityFields.length > 5 && (
        <button
          onClick={() => {}}
          className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <ChevronDown className="w-5 h-5" />
          <span>
            {language === 'en' 
              ? `Show ${personalityFields.length - 5} more traits` 
              : `Afficher ${personalityFields.length - 5} traits de plus`}
          </span>
        </button>
      )}

      {/* Harmonious Colors */}
      {profile.colors && Array.isArray(profile.colors) && profile.colors.length > 0 && (
        <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
          <div className="flex items-center gap-3 mb-4">
            <Palette className={`w-6 h-6 ${colors.accent}`} />
            <h3 className="font-bold text-white text-lg">
              {language === 'en' ? 'Harmonious Colors' : 'Couleurs Harmonieuses'}
            </h3>
          </div>
          <p className="text-sm text-white mb-4">
            {language === 'en'
              ? 'These colors resonate with your elemental energy. Use them in your environment for spiritual balance.'
              : 'Ces couleurs résonnent avec votre énergie élémentaire. Utilisez-les dans votre environnement pour l\'équilibre spirituel.'}
          </p>
          <div className="flex gap-4 flex-wrap">
            {profile.colors.map((colorCode: string, index: number) => (
              <div
                key={index}
                className="flex-1 min-w-[120px]"
              >
                <div 
                  className="w-full h-20 rounded-lg border-2 border-white/20 mb-2 hover:scale-105 transition-transform" 
                  style={{ backgroundColor: colorCode }}
                />
                <p className="text-center text-xs text-white/80 font-mono">{colorCode}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Enhanced Blessed Day Section with ALL Data
 */
function EnhancedBlessedDaySection({ 
  result, 
  colors,
  showAll
}: { 
  result: IstikharaCalculationResult; 
  colors: any;
  showAll: boolean;
}) {
  const { language } = useLanguage();
  const profile = result.burujProfile;
  const blessedDay = profile.blessed_day;
  const bestFor = blessedDay.best_for?.[language as "en" | "fr"] || [];
  const specialNotes = blessedDay.special_notes?.[language as "en" | "fr"] || [];

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center space-y-3 sm:space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center justify-center gap-2 sm:gap-3">
          <Calendar className={`w-6 h-6 sm:w-8 sm:h-8 ${colors.accent}`} />
          {language === 'en' ? 'Your Power Day' : 'Votre Jour de Puissance'}
        </h2>
        <p className="text-sm sm:text-base text-white max-w-2xl mx-auto px-4">
          {language === 'en'
            ? 'This is your most spiritually auspicious day of the week. Your energy peaks and divine support is strongest on this day.'
            : 'C\'est votre jour le plus spirituellement propice de la semaine. Votre énergie culmine et le soutien divin est le plus fort ce jour.'}
        </p>
      </div>

      {/* Main Day Display */}
      <div className="text-center">
        <div className={`inline-block p-6 sm:p-8 bg-gradient-to-br ${colors.gradient} border-2 ${colors.border} rounded-xl sm:rounded-2xl ${colors.glow}`}>
          <Sunrise className={`w-12 h-12 sm:w-16 sm:h-16 ${colors.accent} mx-auto mb-3 sm:mb-4`} />
          <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
            {blessedDay.day?.[language as "en" | "fr"]}
          </div>
          <p className="text-white text-xs sm:text-sm">
            {language === 'en' ? 'Your Blessed Day' : 'Votre Jour Béni'}
          </p>
        </div>
      </div>

      {/* Best Activities */}
      {Array.isArray(bestFor) && bestFor.length > 0 && (
        <div>
          <h3 className="font-bold text-white text-lg sm:text-xl mb-3 sm:mb-4 flex items-center gap-2">
            <CheckCircle className={`w-5 h-5 sm:w-6 sm:h-6 ${colors.accent}`} />
            {language === 'en' ? 'Best Activities for This Day' : 'Meilleures Activités pour Ce Jour'}
          </h3>
          <div className="grid sm:grid-cols-2 gap-2 sm:gap-3">
            {bestFor.map((activity: string, index: number) => (
              <div
                key={index}
                className={`p-3 sm:p-4 bg-gradient-to-br ${colors.gradient} border ${colors.border} rounded-lg sm:rounded-xl flex items-start gap-2 sm:gap-3 hover:scale-105 transition-transform`}
              >
                <CheckCircle className={`w-4 h-4 sm:w-5 sm:h-5 ${colors.accent} flex-shrink-0 mt-0.5`} />
                <span className="text-sm sm:text-base text-white leading-relaxed">{activity}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Special Notes */}
      {Array.isArray(specialNotes) && specialNotes.length > 0 && (
        <div className="p-6 bg-gradient-to-br from-yellow-900/30 to-orange-900/20 border-2 border-yellow-500/30 rounded-xl">
          <div className="flex items-start gap-3">
            <Star className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-white text-lg mb-3">
                {language === 'en' ? 'Special Significance' : 'Signification Spéciale'}
              </h3>
              <ul className="space-y-2">
                {specialNotes.map((note: string, idx: number) => (
                  <li key={idx} className="text-gray-200 flex items-start gap-2">
                    <span className="text-yellow-400 mt-1">✦</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Practical Tips */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className={`p-5 bg-gradient-to-br ${colors.gradient} border ${colors.border} rounded-xl`}>
          <Lightbulb className={`w-6 h-6 ${colors.accent} mb-3`} />
          <h4 className="font-semibold text-white mb-2">
            {language === 'en' ? 'Pro Tip' : 'Conseil Pro'}
          </h4>
          <p className="text-sm text-gray-200">
            {language === 'en'
              ? 'Schedule your most important meetings, critical decisions, and new ventures on this day when possible. Your spiritual energy and divine support are at their peak.'
              : 'Planifiez vos réunions les plus importantes, décisions critiques et nouvelles entreprises ce jour si possible. Votre énergie spirituelle et soutien divin sont à leur apogée.'}
          </p>
        </div>

        <div className={`p-5 bg-gradient-to-br ${colors.gradient} border ${colors.border} rounded-xl`}>
          <Calendar className={`w-6 h-6 ${colors.accent} mb-3`} />
          <h4 className="font-semibold text-white mb-2">
            {language === 'en' ? 'Weekly Planning' : 'Planification Hebdomadaire'}
          </h4>
          <p className="text-sm text-gray-200">
            {language === 'en'
              ? 'Mark this day in your calendar every week. Consider setting a recurring reminder to help you align important activities with your power day.'
              : 'Marquez ce jour dans votre calendrier chaque semaine. Envisagez de définir un rappel récurrent pour vous aider à aligner les activités importantes avec votre jour de puissance.'}
          </p>
        </div>
      </div>
    </div>
  );
}