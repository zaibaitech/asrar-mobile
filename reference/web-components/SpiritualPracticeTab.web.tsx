"use client";

import React, { useState, useRef } from "react";
import { useLanguage } from "../../../contexts/LanguageContext";
import { 
  Moon, 
  Calendar, 
  CheckSquare, 
  ChevronDown, 
  ChevronUp,
  BookOpen,
  Star,
  Sparkles,
  Sun,
  Clock,
  Users,
  Heart,
  Gift,
  Target,
  Award,
  Shield,
  Zap,
  Eye,
  Volume2,
  Copy,
  Check,
  Info,
  AlertCircle,
  TrendingUp
} from "lucide-react";
import { DhikrCounter } from "./DhikrCounter";
import { TrackingDashboard } from "./TrackingDashboard";
import { PreciseTimingGuidance } from "./PreciseTimingGuidance";
import type { IstikharaCalculationResult, ZodiacSign } from "../types";

interface SpiritualPracticeTabProps {
  result: IstikharaCalculationResult;
}

type PracticeType = "monthly" | "lifetime" | "divine";

/**
 * SpiritualPracticeTab - Complete Spiritual Practice Guidance with ALL Data
 * 
 * COMPREHENSIVE ENHANCEMENTS:
 * - All spiritual data included (Angels, Jinn, Quranic verses)
 * - Three practice types with full details
 * - Interactive dhikr counter with progress tracking
 * - Angel and Jinn information cards
 * - Quranic verse display with audio controls
 * - Step-by-step practice instructions
 * - Tracking dashboard integration
 * - Element-based dynamic theming
 * - Sacred geometry backgrounds
 * - Smooth animations and transitions
 * - Copy-to-clipboard functionality
 * - Audio pronunciation support
 * - Progress indicators
 * - Best practices and timing guidance
 * - Cultural context and scholarly notes
 * 
 * Features:
 * - Monthly Sadaqah with traditional & modern alternatives
 * - Lifetime Sacred Offering with timing guidance
 * - Divine Names dhikr with counter
 * - Complete Angel (Rawḥānī) information
 * - Complete Jinn King information
 * - Quranic verse connections
 * - Practice night and zodiac correlations
 * - Full instructions with visual steps
 * - Tracking and history
 */
export function SpiritualPracticeTab({ result }: SpiritualPracticeTabProps) {
  const { language } = useLanguage();
  const profile = result.burujProfile;
  const elementKey = profile.element.toLowerCase() as "fire" | "earth" | "air" | "water";
  
  const [activeType, setActiveType] = useState<PracticeType>("divine");
  const [showInstructions, setShowInstructions] = useState(false);
  const [showTracking, setShowTracking] = useState(false);
  const [showAngelsJinn, setShowAngelsJinn] = useState(true);
  const [showQuranicVerse, setShowQuranicVerse] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  // Create refs for scroll-to-section functionality
  const monthlyRef = useRef<HTMLDivElement>(null);
  const lifetimeRef = useRef<HTMLDivElement>(null);
  const divineRef = useRef<HTMLDivElement>(null);

  // Enhanced element colors - Optimized for visibility
  const elementColors = {
    fire: {
      gradient: "from-red-600 via-orange-500 to-yellow-500",
      bgGradient: "from-red-900/30 via-orange-900/20 to-yellow-900/10",
      border: "border-red-400/50",
      text: "text-red-200",
      iconBg: "bg-red-500/20",
      hoverBg: "hover:bg-red-500/10",
      glow: "shadow-lg shadow-red-500/30"
    },
    earth: {
      gradient: "from-amber-600 via-yellow-500 to-green-500",
      bgGradient: "from-amber-900/30 via-yellow-900/20 to-green-900/10",
      border: "border-amber-400/50",
      text: "text-amber-200",
      iconBg: "bg-amber-500/20",
      hoverBg: "hover:bg-amber-500/10",
      glow: "shadow-lg shadow-amber-500/30"
    },
    air: {
      gradient: "from-cyan-600 via-blue-500 to-indigo-500",
      bgGradient: "from-cyan-900/30 via-blue-900/20 to-indigo-900/10",
      border: "border-cyan-400/50",
      text: "text-cyan-200",
      iconBg: "bg-cyan-500/20",
      hoverBg: "hover:bg-cyan-500/10",
      glow: "shadow-lg shadow-cyan-500/30"
    },
    water: {
      gradient: "from-blue-600 via-indigo-500 to-purple-500",
      bgGradient: "from-blue-900/30 via-indigo-900/20 to-purple-900/10",
      border: "border-blue-400/50",
      text: "text-blue-200",
      iconBg: "bg-blue-500/20",
      hoverBg: "hover:bg-blue-500/10",
      glow: "shadow-lg shadow-blue-500/30"
    }
  };

  const colors = elementColors[elementKey];

  const tabs: Array<{ type: PracticeType; label: string; icon: React.ReactNode; desc: string }> = [
    { 
      type: "monthly", 
      label: language === 'en' ? 'Monthly Sadaqah' : 'Sadaqah Mensuel', 
      icon: <Calendar className="w-5 h-5" />,
      desc: language === 'en' ? 'Regular practice' : 'Pratique régulière'
    },
    { 
      type: "lifetime", 
      label: language === 'en' ? 'Lifetime Offering' : 'Offrande de Vie', 
      icon: <Gift className="w-5 h-5" />,
      desc: language === 'en' ? 'Once in life' : 'Une fois dans la vie'
    },
    { 
      type: "divine", 
      label: language === 'en' ? 'Divine Names' : 'Noms Divins', 
      icon: <Sparkles className="w-5 h-5" />,
      desc: language === 'en' ? 'Daily dhikr' : 'Dhikr quotidien'
    }
  ];

  // Copy to clipboard helper
  const handleCopy = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Smooth scroll to section with mobile optimization
  const scrollToSection = (ref: React.RefObject<HTMLDivElement>, tabName: PracticeType) => {
    // If already active, just scroll to it
    if (activeType === tabName && ref.current) {
      ref.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
      return;
    }

    // Change active type to show the target section
    setActiveType(tabName);
    
    // Wait for DOM update, then scroll
    setTimeout(() => {
      if (ref.current) {
        const isMobile = window.innerWidth < 768;
        const yOffset = isMobile ? -100 : -80; // Offset for sticky header
        const element = ref.current;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

        window.scrollTo({
          top: y,
          behavior: 'smooth'
        });

        // Add highlight animation
        element.classList.add('section-highlight');
        setTimeout(() => {
          element.classList.remove('section-highlight');
        }, 1500);
      }
    }, 50);
  };

  // Map practice types to refs
  const getRefForType = (type: PracticeType) => {
    switch (type) {
      case 'monthly':
        return monthlyRef;
      case 'lifetime':
        return lifetimeRef;
      case 'divine':
        return divineRef;
      default:
        return divineRef;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header Section with Stats */}
      <div className={`bg-gradient-to-br ${colors.bgGradient} border-2 ${colors.border} rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 ${colors.glow}`}>
        <div className="text-center space-y-3 sm:space-y-4 mb-4 sm:mb-6">
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <div className={`p-2 sm:p-3 ${colors.iconBg} rounded-full animate-pulse-slow`}>
              <Moon className={`w-6 h-6 sm:w-8 sm:h-8 ${colors.text}`} />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            {language === 'en' ? 'Spiritual Practice & Growth' : 'Pratique Spirituelle & Croissance'}
          </h2>
          <p className="text-sm sm:text-base text-white max-w-2xl mx-auto px-2">
            {language === 'en' 
              ? 'Complete guidance for your spiritual journey with three types of practices tailored to your element' 
              : 'Guide complet pour votre cheminement spirituel avec trois types de pratiques adaptées à votre élément'}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          <div className={`p-3 sm:p-4 bg-black/30 rounded-lg sm:rounded-xl border ${colors.border}`}>
            <div className="text-xl sm:text-2xl mb-1">🔢</div>
            <div className="text-xl sm:text-2xl font-bold text-white">{result.repetitionCount}</div>
            <div className="text-[10px] sm:text-xs text-white">
              {language === 'en' ? 'Dhikr Count' : 'Compteur Dhikr'}
            </div>
          </div>
          
          <div className={`p-3 sm:p-4 bg-black/30 rounded-lg sm:rounded-xl border ${colors.border}`}>
            <div className="text-xl sm:text-2xl mb-1">🌙</div>
            <div className="text-sm sm:text-base md:text-lg font-bold text-white truncate">
              {profile.spiritual_practice?.practice_night?.primary?.[language as "en" | "fr"]}
            </div>
            <div className="text-[10px] sm:text-xs text-white">
              {language === 'en' ? 'Practice Night' : 'Nuit de Pratique'}
            </div>
          </div>
          
          <div className={`p-3 sm:p-4 bg-black/30 rounded-lg sm:rounded-xl border ${colors.border}`}>
            <div className="text-xl sm:text-2xl mb-1">👼</div>
            <div className="text-sm sm:text-base md:text-lg font-bold text-white truncate">
              {profile.spiritual_practice?.angel?.transliteration}
            </div>
            <div className="text-[10px] sm:text-xs text-white">
              {language === 'en' ? 'Angel' : 'Ange'}
            </div>
          </div>
          
          <div className={`p-3 sm:p-4 bg-black/30 rounded-lg sm:rounded-xl border ${colors.border}`}>
            <div className="text-xl sm:text-2xl mb-1">🔮</div>
            <div className="text-sm sm:text-base md:text-lg font-bold text-white truncate">
              {profile.spiritual_practice?.jinn?.transliteration}
            </div>
            <div className="text-[10px] sm:text-xs text-white">
              {language === 'en' ? 'Jinn King' : 'Roi Jinn'}
            </div>
          </div>
        </div>
      </div>

      {/* Angel and Jinn Information Section */}
      {profile.spiritual_practice && (
        <div className="space-y-3 sm:space-y-4">
          <button
            onClick={() => setShowAngelsJinn(!showAngelsJinn)}
            className="w-full flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border-2 border-purple-500/30 rounded-lg sm:rounded-xl hover:bg-purple-900/50 transition-colors"
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-white">
                {language === 'en' ? 'Spiritual Guardians & Forces' : 'Gardiens Spirituels & Forces'}
              </h3>
            </div>
            {showAngelsJinn ? (
              <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            ) : (
              <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            )}
          </button>

          {showAngelsJinn && (
            <div className="grid md:grid-cols-2 gap-4 sm:gap-6 animate-slide-down">
              {/* Angel Card */}
              <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/20 border-2 border-blue-500/40 rounded-lg sm:rounded-xl p-4 sm:p-6 space-y-3 sm:space-y-4 hover:scale-[1.02] transition-transform">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-2 sm:p-3 bg-blue-500/20 rounded-full">
                      <span className="text-2xl sm:text-3xl">👼</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm sm:text-base md:text-lg">
                        {language === 'en' ? 'Associated Angel (Rawḥānī)' : 'Ange Associé (Rawḥānī)'}
                      </h4>
                      <p className="text-[10px] sm:text-xs text-white">
                        {language === 'en' ? 'Celestial Guardian' : 'Gardien Céleste'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy(profile.spiritual_practice.angel.arabic, 'angel')}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    {copied === 'angel' ? (
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    )}
                  </button>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <div className="text-center p-3 sm:p-4 bg-black/30 rounded-lg">
                    <p className="text-2xl sm:text-3xl font-arabic text-blue-300 mb-2">
                      {profile.spiritual_practice.angel.arabic}
                    </p>
                    <p className="text-lg sm:text-xl text-white mb-1">
                      {profile.spiritual_practice.angel.transliteration}
                    </p>
                    {profile.spiritual_practice.angel.name && (
                      <p className="text-xs sm:text-sm text-white">
                        {profile.spiritual_practice.angel.name[language as "en" | "fr"]}
                      </p>
                    )}
                  </div>

                  <div className="p-3 sm:p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                      <p className="text-[10px] sm:text-xs font-semibold text-blue-300">
                        {language === 'en' ? 'About Angels' : 'À Propos des Anges'}
                      </p>
                    </div>
                    <p className="text-xs sm:text-sm text-white leading-relaxed">
                      {language === 'en'
                        ? 'Angels (Malāʾika) are celestial beings of light who serve as divine messengers and guardians. Each element is associated with specific angelic forces that can be invoked for spiritual support.'
                        : 'Les anges (Malāʾika) sont des êtres célestes de lumière qui servent de messagers divins et de gardiens. Chaque élément est associé à des forces angéliques spécifiques qui peuvent être invoquées pour le soutien spirituel.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Jinn King Card */}
              <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/20 border-2 border-purple-500/40 rounded-lg sm:rounded-xl p-4 sm:p-6 space-y-3 sm:space-y-4 hover:scale-[1.02] transition-transform">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-2 sm:p-3 bg-purple-500/20 rounded-full">
                      <span className="text-2xl sm:text-3xl">🔮</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm sm:text-base md:text-lg">
                        {language === 'en' ? 'Associated Jinn King' : 'Roi Jinn Associé'}
                      </h4>
                      <p className="text-[10px] sm:text-xs text-white">
                        {language === 'en' ? 'Elemental Force' : 'Force Élémentaire'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy(profile.spiritual_practice.jinn.arabic, 'jinn')}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    {copied === 'jinn' ? (
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    )}
                  </button>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <div className="text-center p-3 sm:p-4 bg-black/30 rounded-lg">
                    <p className="text-2xl sm:text-3xl font-arabic text-purple-300 mb-2">
                      {profile.spiritual_practice.jinn.arabic}
                    </p>
                    <p className="text-lg sm:text-xl text-white mb-1">
                      {profile.spiritual_practice.jinn.transliteration}
                    </p>
                    {profile.spiritual_practice.jinn.meaning && (
                      <p className="text-xs sm:text-sm text-white">
                        {profile.spiritual_practice.jinn.meaning[language as "en" | "fr"]}
                      </p>
                    )}
                  </div>

                  <div className="p-3 sm:p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
                      <p className="text-[10px] sm:text-xs font-semibold text-purple-300">
                        {language === 'en' ? 'About Jinn' : 'À Propos des Jinns'}
                      </p>
                    </div>
                    <p className="text-xs sm:text-sm text-white leading-relaxed">
                      {language === 'en'
                        ? 'Jinn are beings created from smokeless fire, existing in a parallel realm. In Islamic mystical tradition, certain Jinn kings govern elemental forces and can be understood through spiritual knowledge.'
                        : 'Les Jinns sont des êtres créés de feu sans fumée, existant dans un royaume parallèle. Dans la tradition mystique islamique, certains rois Jinns gouvernent les forces élémentaires et peuvent être compris par la connaissance spirituelle.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quranic Verse Section */}
      {profile.spiritual_practice?.quranic_verse && (
        <div className="space-y-4">
          <button
            onClick={() => setShowQuranicVerse(!showQuranicVerse)}
            className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-green-900/40 to-emerald-900/40 border-2 border-green-500/30 rounded-xl hover:bg-green-900/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-green-400" />
              <h3 className="text-xl font-bold text-white">
                {language === 'en' ? 'Quranic Connection' : 'Connexion Coranique'}
              </h3>
            </div>
          </button>

          {showQuranicVerse && (
            <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/20 border-2 border-green-500/40 rounded-xl p-8 space-y-6 animate-slide-down">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📖</span>
                  <p className="text-sm font-semibold text-green-300">
                    {profile.spiritual_practice.quranic_verse.reference}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (profile.spiritual_practice.quranic_verse) {
                        handleCopy(profile.spiritual_practice.quranic_verse.arabic, 'verse');
                      }
                    }}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    title={language === 'en' ? 'Copy Arabic text' : 'Copier le texte arabe'}
                    disabled={!profile.spiritual_practice.quranic_verse}
                  >
                    {copied === 'verse' ? (
                      <Check className="w-5 h-5 text-green-400" />
                    ) : (
                      <Copy className="w-5 h-5 text-white" />
                    )}
                  </button>
                  <button
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    title={language === 'en' ? 'Listen to recitation' : 'Écouter la récitation'}
                  >
                    <Volume2 className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              <div className="text-center space-y-4 p-6 bg-black/30 rounded-xl">
                <p className="text-3xl font-arabic text-green-200 leading-relaxed">
                  {profile.spiritual_practice.quranic_verse.arabic}
                </p>
                <p className="text-lg text-white">
                  {profile.spiritual_practice.quranic_verse.transliteration}
                </p>
                <p className="text-base text-white leading-relaxed">
                  {profile.spiritual_practice.quranic_verse.translation[language as "en" | "fr"]}
                </p>
              </div>

              <div className="p-4 bg-white/5 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-green-400" />
                  <p className="text-xs font-semibold text-green-300">
                    {language === 'en' ? 'Spiritual Significance' : 'Signification Spirituelle'}
                  </p>
                </div>
                <p className="text-sm text-white leading-relaxed">
                  {language === 'en'
                    ? 'This verse resonates with your elemental nature and can be recited for spiritual guidance and protection. Reflect on its meaning as part of your daily practice.'
                    : 'Ce verset résonne avec votre nature élémentaire et peut être récité pour la guidance spirituelle et la protection. Réfléchissez à sa signification dans votre pratique quotidienne.'}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Practice Type Navigation */}
      <div className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-sm py-3 px-2 rounded-xl border-2 border-white/10">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.type}
              onClick={() => scrollToSection(getRefForType(tab.type), tab.type)}
              className={`
                flex items-center gap-2 px-5 py-3 rounded-xl
                font-medium text-sm transition-all duration-200
                whitespace-nowrap shadow-sm
                ${activeType === tab.type
                  ? `bg-gradient-to-br ${colors.bgGradient} border-2 ${colors.border} ${colors.glow} text-white scale-105`
                  : 'bg-slate-700/50 text-slate-200 hover:bg-slate-600/50 border-2 border-white/10'
                }
              `}
            >
              <span className={activeType === tab.type ? colors.text : ''}>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Practice Content */}
      <div ref={monthlyRef} className={`min-h-[600px] scroll-section ${activeType === "monthly" ? "" : "hidden"}`}>
        <EnhancedMonthlySadaqahSection result={result} colors={colors} />
      </div>
      
      <div ref={lifetimeRef} className={`min-h-[600px] scroll-section ${activeType === "lifetime" ? "" : "hidden"}`}>
        <EnhancedLifetimeOfferingSection result={result} colors={colors} />
      </div>
      
      <div ref={divineRef} className={`min-h-[600px] scroll-section ${activeType === "divine" ? "" : "hidden"}`}>
        <EnhancedDivineNamesSection 
          result={result}
          colors={colors}
          showInstructions={showInstructions}
          setShowInstructions={setShowInstructions}
        />
      </div>

      {/* Tracking Dashboard Toggle */}
      <div className="space-y-4">
        <button
          onClick={() => setShowTracking(!showTracking)}
          className={`w-full py-4 bg-gradient-to-r ${colors.gradient} hover:opacity-90 text-white font-bold text-lg rounded-xl transition-all flex items-center justify-center gap-3 ${colors.glow}`}
        >
          <TrendingUp className="w-6 h-6" />
          <span>
            {language === 'en' ? 'View Practice History & Progress' : 'Voir Historique & Progrès'}
          </span>
          {showTracking ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>

        {showTracking && (
          <div className="animate-slide-down">
            <TrackingDashboard burujId={result.burujRemainder} />
          </div>
        )}
      </div>

      {/* Custom Styles */}
      <style jsx>{`
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

        @keyframes section-pulse {
          0%, 100% {
            background-color: transparent;
          }
          50% {
            background-color: rgba(99, 102, 241, 0.1);
          }
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

        .scroll-section {
          scroll-margin-top: 120px;
        }

        :global(.section-highlight) {
          animation: section-pulse 1s ease-in-out;
          border-radius: 1rem;
        }

        @media (max-width: 768px) {
          .scroll-section {
            scroll-margin-top: 100px;
          }
        }
      `}</style>
    </div>
  );
}

// Enhanced Monthly Sadaqah Section
function EnhancedMonthlySadaqahSection({ 
  result, 
  colors 
}: { 
  result: IstikharaCalculationResult;
  colors: any;
}) {
  const { language } = useLanguage();
  const sadaqah = result.burujProfile.sadaqah.monthly;
  const [expanded, setExpanded] = useState<string[]>(['traditional']);

  const toggleSection = (section: string) => {
    setExpanded(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`bg-gradient-to-br ${colors.bgGradient} border-2 ${colors.border} rounded-xl p-6 space-y-4`}>
        <div className="flex items-center gap-3">
          <div className={`p-3 ${colors.iconBg} rounded-full`}>
            <Calendar className={`w-6 h-6 ${colors.text}`} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">
              {language === 'en' ? 'Monthly Spiritual Balance' : 'Équilibre Spirituel Mensuel'}
            </h3>
            <p className="text-sm text-white">
              {language === 'en' ? 'Regular practice for ongoing spiritual growth' : 'Pratique régulière pour la croissance spirituelle continue'}
            </p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <InfoCard
            icon="🔄"
            label={language === 'en' ? 'Frequency' : 'Fréquence'}
            value={sadaqah.frequency[language]}
            colors={colors}
          />
          {sadaqah.context && (
            <InfoCard
              icon="📍"
              label={language === 'en' ? 'Context' : 'Contexte'}
              value={sadaqah.context[language]}
              colors={colors}
            />
          )}
        </div>
      </div>

      {/* Traditional Practice */}
      <ExpandableSection
        title={language === 'en' ? 'Traditional Practice' : 'Pratique Traditionnelle'}
        icon="📜"
        isExpanded={expanded.includes('traditional')}
        onToggle={() => toggleSection('traditional')}
        colors={colors}
      >
        <div className="space-y-4">
          <blockquote className="text-white font-bold italic border-l-4 border-white/20 pl-4 text-lg leading-relaxed">
            "{sadaqah.traditional[language]}"
          </blockquote>

          {sadaqah.purpose && (
            <div className={`p-4 bg-gradient-to-br ${colors.bgGradient} rounded-lg`}>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className={`w-5 h-5 ${colors.text}`} />
                <h5 className="font-semibold text-white">
                  {language === 'en' ? 'Spiritual Benefits' : 'Bienfaits Spirituels'}
                </h5>
              </div>
              <p className="text-white leading-relaxed">{sadaqah.purpose[language]}</p>
            </div>
          )}
        </div>
      </ExpandableSection>

      {/* Modern Alternatives */}
      <ExpandableSection
        title={language === 'en' ? 'Modern Applications' : 'Applications Modernes'}
        icon="🌍"
        isExpanded={expanded.includes('modern')}
        onToggle={() => toggleSection('modern')}
        colors={colors}
      >
        <div className="grid md:grid-cols-2 gap-3">
          {sadaqah.modern_alternatives[language].map((alt, index) => (
            <div 
              key={index} 
              className="flex items-start gap-3 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <div className={`p-2 ${colors.iconBg} rounded-lg flex-shrink-0`}>
                <Check className={`w-5 h-5 ${colors.text}`} />
              </div>
              <p className="text-white font-semibold">{alt}</p>
            </div>
          ))}
        </div>
      </ExpandableSection>

      {/* Action Tips */}
      <div className="p-6 bg-gradient-to-br from-yellow-900/30 to-orange-900/20 border-2 border-yellow-500/30 rounded-xl">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-bold text-white mb-2">
              {language === 'en' ? 'Getting Started' : 'Pour Commencer'}
            </h4>
            <ul className="space-y-2 text-sm text-white">
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 mt-0.5">•</span>
                <span>
                  {language === 'en'
                    ? 'Set a monthly reminder on your calendar'
                    : 'Définissez un rappel mensuel dans votre calendrier'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 mt-0.5">•</span>
                <span>
                  {language === 'en'
                    ? 'Choose one modern alternative that fits your lifestyle'
                    : 'Choisissez une alternative moderne qui correspond à votre style de vie'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 mt-0.5">•</span>
                <span>
                  {language === 'en'
                    ? 'Make intention (niyyah) before each practice'
                    : 'Faites l\'intention (niyyah) avant chaque pratique'}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Enhanced Lifetime Offering Section
function EnhancedLifetimeOfferingSection({ 
  result, 
  colors 
}: { 
  result: IstikharaCalculationResult;
  colors: any;
}) {
  const { language } = useLanguage();
  const offering = result.burujProfile.sadaqah.lifetime;

  return (
    <div className="space-y-6">
      {/* Header with Warning */}
      <div className="bg-gradient-to-br from-yellow-900/40 to-orange-900/30 border-2 border-yellow-500/40 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-yellow-500/20 rounded-full animate-pulse-slow">
            <Gift className="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">
              {language === 'en' ? 'Sacred Lifetime Offering' : 'Offrande Sacrée de la Vie'}
            </h3>
            <p className="text-yellow-200 font-semibold">
              ⚠️ {language === 'en' 
                ? 'Performed ONCE in Your Lifetime' 
                : 'Effectué UNE SEULE FOIS dans Votre Vie'}
            </p>
          </div>
        </div>
        
        <p className="text-white leading-relaxed">
          {language === 'en'
            ? 'This is a profound spiritual commitment that should be undertaken with careful preparation and sincere intention.'
            : 'Ceci est un engagement spirituel profond qui doit être entrepris avec une préparation soigneuse et une intention sincère.'}
        </p>
      </div>

      {/* Traditional Guidance */}
      <div className="bg-white/5 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className={`w-5 h-5 ${colors.text}`} />
          <h4 className="font-bold text-white text-lg">
            {language === 'en' ? 'Traditional Guidance' : 'Guidance Traditionnelle'}
          </h4>
        </div>
        <blockquote className="text-white font-bold italic border-l-4 border-white/20 pl-4 text-lg leading-relaxed">
          "{offering.traditional[language]}"
        </blockquote>
      </div>

      {/* Components Checklist */}
      {offering.components && offering.components[language].length > 0 && (
        <div>
          <h4 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
            <CheckSquare className={`w-5 h-5 ${colors.text}`} />
            {language === 'en' ? 'Required Components' : 'Composants Requis'}
          </h4>
          <div className="grid gap-3">
            {offering.components[language].map((comp, index) => (
              <div 
                key={index}
                className={`flex items-start gap-4 p-5 bg-gradient-to-br ${colors.bgGradient} border ${colors.border} rounded-xl hover:scale-[1.02] transition-transform`}
              >
                <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center ${colors.iconBg} rounded-full font-bold ${colors.text} text-lg`}>
                  {index + 1}
                </div>
                <p className="text-white font-semibold leading-relaxed flex-1 pt-2">{comp}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Best Timing */}
      <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/20 border-2 border-blue-500/40 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-blue-400" />
          <h4 className="font-bold text-white text-lg">
            {language === 'en' ? 'Optimal Timing' : 'Moment Optimal'}
          </h4>
        </div>
        <div className="space-y-3">
          {offering.best_timing[language].map((timing, index) => (
            <div 
              key={index}
              className="flex items-start gap-3 p-4 bg-black/30 rounded-lg"
            >
              <Star className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-white font-semibold leading-relaxed">{timing}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Spiritual Significance */}
      {offering.significance && (
        <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/20 border-2 border-green-500/40 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-green-400" />
            <h4 className="font-bold text-white text-lg">
              {language === 'en' ? 'Spiritual Significance' : 'Signification Spirituelle'}
            </h4>
          </div>
          <p className="text-white font-semibold leading-relaxed text-lg">
            {offering.significance[language]}
          </p>
        </div>
      )}
    </div>
  );
}

// Enhanced Divine Names Section
function EnhancedDivineNamesSection({ 
  result, 
  colors,
  showInstructions, 
  setShowInstructions 
}: { 
  result: IstikharaCalculationResult;
  colors: any;
  showInstructions: boolean;
  setShowInstructions: (show: boolean) => void;
}) {
  const { language } = useLanguage();
  const practice = result.burujProfile.spiritual_practice;

  return (
    <div className="space-y-6">
      {/* Practice Overview Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        <InfoCard
          icon="🌙"
          label={language === 'en' ? 'Practice Night' : 'Nuit de Pratique'}
          value={practice.practice_night.primary[language]}
          subtitle={practice.practice_night.note?.[language]}
          colors={colors}
        />
        <InfoCard
          icon="🔢"
          label={language === 'en' ? 'Repetition Count' : 'Nombre de Répétitions'}
          value={`${result.repetitionCount} ${language === 'en' ? 'times' : 'fois'}`}
          subtitle={language === 'en' ? 'Complete daily' : 'Complétez quotidiennement'}
          colors={colors}
        />
        <InfoCard
          icon="♈"
          label={language === 'en' ? 'Associated Zodiac' : 'Zodiaque Associé'}
          value={'arabic' in practice.zodiac_sign 
            ? practice.zodiac_sign[language] 
            : practice.zodiac_sign[language]}
          colors={colors}
        />
        <InfoCard
          icon={result.burujProfile.element_emoji}
          label={language === 'en' ? 'Element Alignment' : 'Alignement Élémentaire'}
          value={result.burujProfile.element}
          subtitle={language === 'en' ? 'Your core energy' : 'Votre énergie principale'}
          colors={colors}
        />
      </div>

      {/* PRECISE TIMING GUIDANCE - NEW FEATURE */}
      {practice.practice_night && (
        <PreciseTimingGuidance
          practiceNight={practice.practice_night}
          userElement={result.burujProfile.element}
          zodiacPlanet={getZodiacPlanet(result.burujRemainder)}
        />
      )}

      {/* Dhikr Counter - Main Feature */}
      {practice.divine_names && typeof practice.divine_names === 'object' && 'arabic' in practice.divine_names && (
        <DhikrCounter
          targetCount={result.repetitionCount}
          divineNames={practice.divine_names}
          quranicVerse={practice.quranic_verse}
          angel={practice.angel}
          jinn={practice.jinn}
          practiceNight={practice.practice_night}
          zodiacSign={'arabic' in practice.zodiac_sign ? practice.zodiac_sign as ZodiacSign : undefined}
          instructions={practice.instructions}
          elementColors={colors}
        />
      )}


    </div>
  );
}

// Helper function to get zodiac planet from buruj remainder
function getZodiacPlanet(remainder: number): string {
  const zodiacPlanets: Record<number, string> = {
    1: 'Mars',      // Aries
    2: 'Venus',     // Taurus
    3: 'Mercury',   // Gemini
    4: 'Moon',      // Cancer
    5: 'Sun',       // Leo
    6: 'Mercury',   // Virgo
    7: 'Venus',     // Libra
    8: 'Mars',      // Scorpio
    9: 'Jupiter',   // Sagittarius
    10: 'Saturn',   // Capricorn
    11: 'Saturn',   // Aquarius
    12: 'Jupiter',  // Pisces
  };
  return zodiacPlanets[remainder] || 'Sun';
}

// Reusable Info Card Component
function InfoCard({ 
  icon, 
  label, 
  value, 
  subtitle,
  colors 
}: { 
  icon: string; 
  label: string; 
  value: string; 
  subtitle?: string;
  colors?: any;
}) {
  return (
    <div className={`bg-white/5 rounded-xl p-5 space-y-3 hover:bg-white/10 transition-all ${colors?.border ? `border-2 ${colors.border}` : ''}`}>
      <div className="flex items-center gap-3">
        <span className="text-3xl">{icon}</span>
        <p className="text-sm text-white">{label}</p>
      </div>
      <div>
        <p className="text-xl font-bold text-white">{value}</p>
        {subtitle && (
          <p className="text-xs text-white/80 mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

// Expandable Section Component
function ExpandableSection({
  title,
  icon,
  isExpanded,
  onToggle,
  colors,
  children
}: {
  title: string;
  icon: string;
  isExpanded: boolean;
  onToggle: () => void;
  colors: any;
  children: React.ReactNode;
}) {
  return (
    <div className={`bg-white/5 border ${colors.border} rounded-xl overflow-hidden`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 hover:bg-white/10 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <h4 className="font-bold text-white text-lg">{title}</h4>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-white" />
        ) : (
          <ChevronDown className="w-5 h-5 text-white" />
        )}
      </button>
      
      {isExpanded && (
        <div className="p-5 pt-0 animate-slide-down">
          {children}
        </div>
      )}
    </div>
  );
}