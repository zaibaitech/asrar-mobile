"use client";

import {
    Award,
    Briefcase,
    Calendar,
    ChevronRight,
    Clock,
    Droplet,
    Flame,
    Heart,
    Info,
    Moon,
    Mountain,
    Sparkles,
    Star,
    Sun,
    Target,
    Wind,
    Zap
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLanguage } from "../../../contexts/LanguageContext";
import type { IstikharaCalculationResult } from "../types";

interface IstikhSummaryCardProps {
  result: IstikharaCalculationResult;
}

/**
 * IstikharaSummaryCard - Premium Enhanced Overview with Complete Data Display
 * 
 * COMPREHENSIVE ENHANCEMENTS:
 * - Multiple radial progress indicators with smooth animations
 * - Sacred geometry background patterns
 * - Live pulsing effects and gradients
 * - Complete spiritual alignment metrics
 * - Element strength with visual bars
 * - Career path preview
 * - Spiritual practice highlights
 * - Interactive hover states
 * - Premium glassmorphism design
 * - Full data integration from calculation result
 * - Responsive premium layout
 * - Accessibility features
 * 
 * Features:
 * - Element-based dynamic theming with gradients
 * - Animated multi-ring progress circles
 * - Icon indicators with glow and pulse effects
 * - Quick action hints and insights
 * - Career category preview
 * - Blessed day timing
 * - Divine names display
 * - Personality traits summary
 */
export function IstikharaSummaryCard({ result }: IstikhSummaryCardProps) {
  const { language } = useLanguage();
  const profile = result.burujProfile;
  const elementKey = profile.element.toLowerCase() as "fire" | "earth" | "air" | "water";
  
  // Animation states
  const [mainProgress, setMainProgress] = useState(0);
  const [secondaryProgress, setSecondaryProgress] = useState(0);
  const [tertiaryProgress, setTertiaryProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Animated progress on mount
  useEffect(() => {
    setIsVisible(true);
    const timer1 = setTimeout(() => setMainProgress(100), 200);
    const timer2 = setTimeout(() => setSecondaryProgress(100), 400);
    const timer3 = setTimeout(() => setTertiaryProgress(100), 600);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  // Calculate multiple spiritual alignment scores
  const calculateAlignmentScores = () => {
    const elementScores = { 
      fire: { main: 95, career: 92, spiritual: 88 }, 
      earth: { main: 88, career: 95, spiritual: 90 }, 
      air: { main: 92, career: 88, spiritual: 94 }, 
      water: { main: 90, career: 90, spiritual: 96 }
    };
    return elementScores[elementKey] || { main: 85, career: 85, spiritual: 85 };
  };

  const scores = calculateAlignmentScores();
  
  // SVG circle calculations
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const mainStrokeDashoffset = circumference - (scores.main / 100) * circumference;
  const careerStrokeDashoffset = circumference - (scores.career / 100) * circumference;
  const spiritualStrokeDashoffset = circumference - (scores.spiritual / 100) * circumference;

  // Get element icon
  const getElementIcon = () => {
    const icons = {
      fire: <Flame className="w-8 h-8" />,
      earth: <Mountain className="w-8 h-8" />,
      air: <Wind className="w-8 h-8" />,
      water: <Droplet className="w-8 h-8" />
    };
    return icons[elementKey];
  };

  // Enhanced element configuration - Optimized for visibility
  const elementConfig = {
    fire: {
      emoji: "🔥",
      gradient: "from-red-600 via-orange-500 to-yellow-500",
      bgGradient: "from-red-900/20 via-orange-900/15 to-yellow-900/10",
      bgPattern: "from-red-500/5 via-orange-500/5 to-yellow-500/5",
      border: "border-red-400/50",
      text: "text-red-200",
      textBright: "text-red-100",
      progressColor: "#ef4444",
      progressGlow: "shadow-red-500/50",
      cardGlow: "shadow-xl shadow-red-500/20",
      glowRing: "ring-red-500/30",
      accentBg: "bg-red-500/20",
      hoverScale: "hover:shadow-2xl hover:shadow-red-500/30",
      pulseColor: "bg-red-500"
    },
    earth: {
      emoji: "🌍",
      gradient: "from-amber-600 via-yellow-500 to-green-500",
      bgGradient: "from-amber-900/20 via-yellow-900/15 to-green-900/10",
      bgPattern: "from-amber-500/5 via-yellow-500/5 to-green-500/5",
      border: "border-amber-400/50",
      text: "text-amber-200",
      textBright: "text-amber-100",
      progressColor: "#f59e0b",
      progressGlow: "shadow-amber-500/50",
      cardGlow: "shadow-xl shadow-amber-500/20",
      glowRing: "ring-amber-500/30",
      accentBg: "bg-amber-500/20",
      hoverScale: "hover:shadow-2xl hover:shadow-amber-500/30",
      pulseColor: "bg-amber-500"
    },
    air: {
      emoji: "💨",
      gradient: "from-cyan-600 via-blue-500 to-indigo-500",
      bgGradient: "from-cyan-900/20 via-blue-900/15 to-indigo-900/10",
      bgPattern: "from-cyan-500/5 via-blue-500/5 to-indigo-500/5",
      border: "border-cyan-400/50",
      text: "text-cyan-200",
      textBright: "text-cyan-100",
      progressColor: "#06b6d4",
      progressGlow: "shadow-cyan-500/50",
      cardGlow: "shadow-xl shadow-cyan-500/20",
      glowRing: "ring-cyan-500/30",
      accentBg: "bg-cyan-500/20",
      hoverScale: "hover:shadow-2xl hover:shadow-cyan-500/30",
      pulseColor: "bg-cyan-500"
    },
    water: {
      emoji: "💧",
      gradient: "from-blue-600 via-indigo-500 to-purple-500",
      bgGradient: "from-blue-900/20 via-indigo-900/15 to-purple-900/10",
      bgPattern: "from-blue-500/5 via-indigo-500/5 to-purple-500/5",
      border: "border-blue-400/50",
      text: "text-blue-200",
      textBright: "text-blue-100",
      progressColor: "#3b82f6",
      progressGlow: "shadow-blue-500/50",
      cardGlow: "shadow-xl shadow-blue-500/20",
      glowRing: "ring-blue-500/30",
      accentBg: "bg-blue-500/20",
      hoverScale: "hover:shadow-2xl hover:shadow-blue-500/30",
      pulseColor: "bg-blue-500"
    }
  };

  const config = elementConfig[elementKey];

  // Extract key data
  const personality = profile.personality?.[language as "en" | "fr"];
  const career = profile.career;
  const spiritual = profile.spiritual_practice;
  const blessedDay = profile.blessed_day;
  const modernCareers = career?.modern_recommended?.[language as "en" | "fr"] || [];

  return (
    <div 
      className={`relative p-4 sm:p-6 md:p-8 lg:p-10 bg-gradient-to-br ${config.bgGradient} backdrop-blur-xl rounded-2xl sm:rounded-3xl ${config.cardGlow} border-2 ${config.border} overflow-hidden transition-all duration-700 ${config.hoverScale} ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {/* Animated Sacred Geometry Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.bgPattern} opacity-40`}>
        <svg className="w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id={`sacred-${elementKey}`} x="0" y="0" width="25" height="25" patternUnits="userSpaceOnUse">
              {/* Sacred geometry: Flower of Life inspired */}
              <circle cx="12.5" cy="12.5" r="8" fill="none" stroke="currentColor" strokeWidth="0.3" opacity="0.6" />
              <circle cx="12.5" cy="12.5" r="4" fill="none" stroke="currentColor" strokeWidth="0.2" opacity="0.8" />
              <circle cx="12.5" cy="0" r="4" fill="none" stroke="currentColor" strokeWidth="0.2" opacity="0.4" />
              <circle cx="12.5" cy="25" r="4" fill="none" stroke="currentColor" strokeWidth="0.2" opacity="0.4" />
              <circle cx="0" cy="12.5" r="4" fill="none" stroke="currentColor" strokeWidth="0.2" opacity="0.4" />
              <circle cx="25" cy="12.5" r="4" fill="none" stroke="currentColor" strokeWidth="0.2" opacity="0.4" />
              {/* Star patterns */}
              <path d="M 12.5 8 L 13.5 11 L 16.5 11 L 14 13 L 15 16 L 12.5 14 L 10 16 L 11 13 L 8.5 11 L 11.5 11 Z" 
                    fill="currentColor" opacity="0.15" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill={`url(#sacred-${elementKey})`} className={config.text} />
        </svg>
      </div>

      {/* Floating Sparkle Effects */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 animate-pulse">
        <Sparkles className={`w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 ${config.text} ${config.progressGlow}`} />
      </div>
      <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 animate-pulse delay-300">
        <Star className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${config.text} opacity-60`} />
      </div>

      {/* Main Content Grid */}
      <div className="relative z-10 grid lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        
        {/* LEFT COLUMN: Names, Element, and Main Score */}
        <div className="lg:col-span-1 space-y-4 sm:space-y-6">
          {/* Names Header */}
          <div className="space-y-2 sm:space-y-3">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 flex items-center gap-2 sm:gap-3">
              <div className={`p-1.5 sm:p-2 ${config.accentBg} rounded-lg ${config.glowRing} ring-2`}>
                {getElementIcon()}
              </div>
              {language === "en" ? "Your Profile" : "Votre Profil"}
            </h3>
            
            {/* Names Display */}
            <div className="p-3 sm:p-4 bg-black/20 backdrop-blur-sm rounded-lg sm:rounded-xl border border-white/10">
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-white mb-1">
                    {language === "en" ? "Your Name" : "Votre Nom"}
                  </p>
                  <p className="text-lg sm:text-xl font-arabic text-white" dir="rtl">
                    {result.personName}
                  </p>
                </div>
                <div className="border-t border-white/10 pt-2">
                  <p className="text-xs text-white mb-1">
                    {language === "en" ? "Mother's Name" : "Nom de la Mère"}
                  </p>
                  <p className="text-lg sm:text-xl font-arabic text-white" dir="rtl">
                    {result.motherName}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Multi-Ring Radial Progress */}
          <div className="flex items-center justify-center">
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48">
              <svg className="w-full h-full transform -rotate-90">
                {/* Outer ring - Main Score */}
                <circle
                  cx="50%"
                  cy="50%"
                  r={radius + 20}
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="6"
                  fill="none"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r={radius + 20}
                  stroke={config.progressColor}
                  strokeWidth="6"
                  fill="none"
                  strokeDasharray={2 * Math.PI * (radius + 20)}
                  strokeDashoffset={mainProgress ? 2 * Math.PI * (radius + 20) - (scores.main / 100) * 2 * Math.PI * (radius + 20) : 2 * Math.PI * (radius + 20)}
                  className={`transition-all duration-1500 ease-out ${config.progressGlow}`}
                  strokeLinecap="round"
                />

                {/* Middle ring - Career Score */}
                <circle
                  cx="50%"
                  cy="50%"
                  r={radius + 8}
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="5"
                  fill="none"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r={radius + 8}
                  stroke={config.progressColor}
                  strokeWidth="5"
                  fill="none"
                  strokeDasharray={2 * Math.PI * (radius + 8)}
                  strokeDashoffset={secondaryProgress ? 2 * Math.PI * (radius + 8) - (scores.career / 100) * 2 * Math.PI * (radius + 8) : 2 * Math.PI * (radius + 8)}
                  className="transition-all duration-1500 ease-out delay-200"
                  strokeLinecap="round"
                  opacity="0.7"
                />

                {/* Inner ring - Spiritual Score */}
                <circle
                  cx="50%"
                  cy="50%"
                  r={radius - 4}
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="4"
                  fill="none"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r={radius - 4}
                  stroke={config.progressColor}
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={2 * Math.PI * (radius - 4)}
                  strokeDashoffset={tertiaryProgress ? 2 * Math.PI * (radius - 4) - (scores.spiritual / 100) * 2 * Math.PI * (radius - 4) : 2 * Math.PI * (radius - 4)}
                  className="transition-all duration-1500 ease-out delay-400"
                  strokeLinecap="round"
                  opacity="0.5"
                />
              </svg>
              
              {/* Center Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-4xl sm:text-5xl md:text-6xl mb-1 sm:mb-2 animate-bounce-slow">{config.emoji}</div>
                <div className={`text-2xl sm:text-3xl font-bold ${config.textBright} mb-1`}>
                  {scores.main}%
                </div>
                <div className="text-xs sm:text-sm text-white capitalize">
                  {profile.element}
                </div>
                <div className="text-[10px] sm:text-xs text-white mt-1">
                  {language === "en" ? "Element" : "Élément"}
                </div>
              </div>
            </div>
          </div>

          {/* Score Legend */}
          <div className="space-y-2 p-3 sm:p-4 bg-black/20 backdrop-blur-sm rounded-lg sm:rounded-xl border border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${config.pulseColor} animate-pulse`}></div>
                <span className="text-[10px] sm:text-xs text-white">
                  {language === "en" ? "Overall Alignment" : "Alignement Global"}
                </span>
              </div>
              <span className={`text-xs sm:text-sm font-bold ${config.text}`}>{scores.main}%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${config.pulseColor} opacity-70`}></div>
                <span className="text-[10px] sm:text-xs text-white">
                  {language === "en" ? "Career Match" : "Correspondance Carrière"}
                </span>
              </div>
              <span className={`text-xs sm:text-sm font-bold ${config.text}`}>{scores.career}%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${config.pulseColor} opacity-50`}></div>
                <span className="text-[10px] sm:text-xs text-white">
                  {language === "en" ? "Spiritual Practice" : "Pratique Spirituelle"}
                </span>
              </div>
              <span className={`text-xs sm:text-sm font-bold ${config.text}`}>{scores.spiritual}%</span>
            </div>
          </div>
        </div>

        {/* MIDDLE COLUMN: Statistics Grid */}
        <div className="lg:col-span-1 space-y-4">
          <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Award className={`w-5 h-5 ${config.text}`} />
            {language === "en" ? "Your Numbers" : "Vos Numéros"}
          </h4>

          <div className="grid grid-cols-2 gap-3">
            {/* Buruj Number */}
            <div className={`group relative p-4 rounded-xl border-2 ${config.border} bg-black/30 backdrop-blur-sm hover:bg-black/40 transition-all duration-300 hover:scale-105 ${config.progressGlow}`}>
              <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${config.pulseColor} animate-ping`}></div>
              <div className="text-2xl mb-1">🌙</div>
              <div className={`text-3xl font-bold ${config.textBright} mb-1 group-hover:scale-110 transition-transform`}>
                {result.burujRemainder}
              </div>
              <div className="text-xs font-semibold text-white">
                {language === "en" ? "Burūj" : "Burūj"}
              </div>
              <div className="text-xs text-white/80">
                {language === "en" ? "Mansion" : "Maison"}
              </div>
            </div>

            {/* Element Number */}
            <div className={`group relative p-4 rounded-xl border-2 ${config.border} bg-black/30 backdrop-blur-sm hover:bg-black/40 transition-all duration-300 hover:scale-105`}>
              <div className="text-2xl mb-1">{profile.element_emoji}</div>
              <div className={`text-3xl font-bold ${config.textBright} mb-1 group-hover:scale-110 transition-transform`}>
                {profile.element_number}
              </div>
              <div className="text-xs font-semibold text-white">
                {language === "en" ? "Element" : "Élément"}
              </div>
              <div className="text-xs text-white/80">
                {language === "en" ? "ID Number" : "Numéro ID"}
              </div>
            </div>

            {/* Total Hadad */}
            <div className={`group relative p-4 rounded-xl border-2 ${config.border} bg-black/30 backdrop-blur-sm hover:bg-black/40 transition-all duration-300 hover:scale-105`}>
              <div className="text-2xl mb-1">📊</div>
              <div className={`text-3xl font-bold ${config.textBright} mb-1 group-hover:scale-110 transition-transform`}>
                {result.combinedTotal}
              </div>
              <div className="text-xs font-semibold text-white">
                {language === "en" ? "Total" : "Total"}
              </div>
              <div className="text-xs text-white/80">
                {language === "en" ? "Ḥadad Value" : "Valeur Ḥadad"}
              </div>
            </div>

            {/* Repetition Count */}
            <div className={`group relative p-4 rounded-xl border-2 ${config.border} bg-black/30 backdrop-blur-sm hover:bg-black/40 transition-all duration-300 hover:scale-105`}>
              <div className="text-2xl mb-1">🔢</div>
              <div className={`text-3xl font-bold ${config.textBright} mb-1 group-hover:scale-110 transition-transform`}>
                {result.repetitionCount}
              </div>
              <div className="text-xs font-semibold text-white">
                {language === "en" ? "Count" : "Compteur"}
              </div>
              <div className="text-xs text-white/80">
                {language === "en" ? "Repetitions" : "Répétitions"}
              </div>
            </div>
          </div>

          {/* Blessed Day Card */}
          <div className={`p-5 rounded-xl border-2 ${config.border} bg-gradient-to-br ${config.bgGradient} backdrop-blur-sm`}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 ${config.accentBg} rounded-lg`}>
                <Calendar className={`w-5 h-5 ${config.text}`} />
              </div>
              <h5 className="font-bold text-white">
                {language === "en" ? "Your Power Day" : "Votre Jour de Puissance"}
              </h5>
            </div>
            <div className="text-center p-4 bg-black/30 rounded-lg">
              <div className="text-3xl font-bold text-white mb-1">
                {blessedDay.day?.[language as "en" | "fr"]}
              </div>
              <div className="text-sm text-white">
                {language === "en" ? "Most auspicious for important decisions" : "Le plus propice pour les décisions importantes"}
              </div>
            </div>
          </div>

          {/* Quick Element Traits */}
          {personality && (
            <div className={`p-4 rounded-xl border ${config.border} bg-black/20 backdrop-blur-sm`}>
              <div className="flex items-center gap-2 mb-3">
                <Zap className={`w-4 h-4 ${config.text}`} />
                <h5 className="text-sm font-bold text-white">
                  {language === "en" ? "Core Trait" : "Trait Principal"}
                </h5>
              </div>
              <p className="text-sm text-white leading-relaxed line-clamp-3">
                {personality.temperament}
              </p>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Career and Spiritual Highlights */}
        <div className="lg:col-span-1 space-y-4">
          <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Target className={`w-5 h-5 ${config.text}`} />
            {language === "en" ? "Key Insights" : "Perspectives Clés"}
          </h4>

          {/* Career Preview */}
          {modernCareers.length > 0 && (
            <div className={`p-5 rounded-xl border-2 ${config.border} bg-gradient-to-br ${config.bgGradient} backdrop-blur-sm hover:scale-[1.02] transition-transform`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 ${config.accentBg} rounded-lg`}>
                  <Briefcase className={`w-5 h-5 ${config.text}`} />
                </div>
                <div>
                  <h5 className="font-bold text-white">
                    {language === "en" ? "Career Paths" : "Parcours Professionnels"}
                  </h5>
                  <p className="text-xs text-white/80">
                    {modernCareers.length} {language === "en" ? "categories" : "catégories"}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                {modernCareers.slice(0, 3).map((cat: any, idx: number) => (
                  <div 
                    key={idx}
                    className="flex items-center gap-2 p-3 bg-black/30 rounded-lg hover:bg-black/40 transition-colors"
                  >
                    <span className="text-xl">{cat.icon}</span>
                    <span className="text-sm text-white font-medium flex-1">
                      {cat.category}
                    </span>
                    <ChevronRight className="w-4 h-4 text-white/60" />
                  </div>
                ))}
              </div>
              
              {modernCareers.length > 3 && (
                <div className="mt-3 text-center">
                  <span className={`text-xs ${config.text} font-semibold`}>
                    +{modernCareers.length - 3} {language === "en" ? "more" : "de plus"}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Spiritual Practice Highlight */}
          {spiritual?.divine_names && (
            <div className={`p-5 rounded-xl border-2 ${config.border} bg-gradient-to-br ${config.bgGradient} backdrop-blur-sm`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 ${config.accentBg} rounded-lg`}>
                  <Moon className={`w-5 h-5 ${config.text}`} />
                </div>
                <h5 className="font-bold text-white">
                  {language === "en" ? "Your Divine Name" : "Votre Nom Divin"}
                </h5>
              </div>
              
              <div className="text-center space-y-3 p-4 bg-black/30 rounded-lg">
                {'arabic' in spiritual.divine_names && (
                  <>
                    <p className={`text-3xl font-arabic ${config.textBright}`}>
                      {spiritual.divine_names.arabic}
                    </p>
                    <p className="text-lg text-white">
                      {spiritual.divine_names.transliteration}
                    </p>
                    <p className="text-sm text-white">
                      {spiritual.divine_names.translation?.[language as "en" | "fr"]}
                    </p>
                  </>
                )}
              </div>

              {spiritual.practice_night && (
                <div className="mt-3 p-3 bg-black/20 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-white">
                    <Clock className="w-4 h-4" />
                    <span>
                      {language === "en" ? "Best practiced on" : "Meilleure pratique le"}{" "}
                      <span className={`font-semibold ${config.text}`}>
                        {spiritual.practice_night.primary?.[language as "en" | "fr"]}
                      </span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Personality Snapshot */}
          {personality && (
            <div className={`p-5 rounded-xl border ${config.border} bg-black/20 backdrop-blur-sm`}>
              <div className="flex items-center gap-2 mb-4">
                <Heart className={`w-5 h-5 ${config.text}`} />
                <h5 className="font-bold text-white text-sm">
                  {language === "en" ? "Social Strengths" : "Forces Sociales"}
                </h5>
              </div>
              <p className="text-sm text-white leading-relaxed line-clamp-4">
                {personality.social_loved || personality.communication}
              </p>
            </div>
          )}

          {/* Element Colors Preview */}
          {profile.colors && profile.colors.length > 0 && (
            <div className={`p-4 rounded-xl border ${config.border} bg-black/20 backdrop-blur-sm`}>
              <div className="flex items-center gap-2 mb-3">
                <Sun className={`w-4 h-4 ${config.text}`} />
                <h5 className="text-sm font-bold text-white">
                  {language === "en" ? "Your Colors" : "Vos Couleurs"}
                </h5>
              </div>
              <div className="flex gap-2">
                {profile.colors.slice(0, 4).map((color: string, idx: number) => (
                  <div
                    key={idx}
                    className="flex-1 h-12 rounded-lg border-2 border-white/20 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Insight Bar */}
      <div className="relative z-10 mt-8 pt-6 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className={`p-3 ${config.accentBg} rounded-xl ${config.glowRing} ring-2 animate-pulse-slow`}>
            <Info className={`w-6 h-6 ${config.text}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h5 className="font-bold text-white">
                {language === "en" ? "Key Recommendation" : "Recommandation Clé"}
              </h5>
              <span className={`px-2 py-0.5 rounded-full text-xs ${config.accentBg} ${config.text} border ${config.border}`}>
                {language === "en" ? "Priority" : "Priorité"}
              </span>
            </div>
            <p className="text-sm text-white leading-relaxed">
              {language === "en"
                ? `Focus your energy on ${blessedDay.day?.en}. This is your most spiritually aligned day for important decisions and new beginnings.`
                : `Concentrez votre énergie sur ${blessedDay.day?.fr}. C'est votre jour le plus aligné spirituellement pour les décisions importantes et les nouveaux départs.`}
            </p>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        .delay-200 {
          animation-delay: 200ms;
        }

        .delay-300 {
          animation-delay: 300ms;
        }

        .delay-400 {
          animation-delay: 400ms;
        }

        .font-arabic {
          font-family: 'Amiri', 'Traditional Arabic', serif;
        }
      `}</style>
    </div>
  );
}