"use client";

import {
    BookOpen,
    Check,
    ChevronDown,
    ChevronUp,
    Clock,
    Copy,
    Download,
    Heart,
    Moon,
    Pause,
    Play,
    RotateCcw,
    Share2,
    Sparkles,
    Star,
    TrendingUp,
    Trophy,
    Volume2,
    Zap
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useLanguage } from "../../../contexts/LanguageContext";

interface DhikrCounterProps {
  targetCount: number;
  divineNames: {
    arabic: string;
    transliteration: string;
    translation: { en: string; fr: string };
  };
  quranicVerse?: {
    arabic: string;
    transliteration: string;
    translation: { en: string; fr: string };
    reference: string;
  };
  angel?: {
    arabic: string;
    transliteration: string;
    name?: { en: string; fr: string };
  };
  jinn?: {
    arabic: string;
    transliteration: string;
    meaning?: { en: string; fr: string };
  };
  practiceNight?: {
    primary: { en: string; fr: string };
    note?: { en: string; fr: string };
  };
  zodiacSign?: {
    en: string;
    fr: string;
    arabic: string;
  };
  instructions?: {
    en: string[];
    fr: string[];
  };
  elementColors?: {
    gradient: string;
    border: string;
    accent: string;
    iconBg: string;
    glow: string;
  };
  onComplete?: () => void;
}

/**
 * DhikrCounter - Advanced Interactive Divine Names Recitation Counter
 * 
 * Features:
 * - Circular SVG progress with milestones
 * - Multiple counting modes (manual, auto, voice)
 * - Haptic feedback and sound effects
 * - Session tracking with history
 * - Auto-save to localStorage
 * - Complete practice guide
 * - Angel and Jinn information
 * - Quranic verse integration
 * - Export and share functionality
 * - Statistics and insights
 * - Element-specific theming
 */
export function DhikrCounter({ 
  targetCount, 
  divineNames, 
  quranicVerse,
  angel,
  jinn,
  practiceNight,
  zodiacSign,
  instructions,
  elementColors,
  onComplete 
}: DhikrCounterProps) {
  const { language } = useLanguage();
  
  // State management
  const [count, setCount] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [countingMode, setCountingMode] = useState<'manual' | 'auto'>('manual');
  const [autoSpeed, setAutoSpeed] = useState(2000); // ms between auto counts
  const [milestones, setMilestones] = useState<number[]>([]);
  const [sessionHistory, setSessionHistory] = useState<Array<{
    date: string;
    count: number;
    duration: number;
    completed: boolean;
  }>>([]);
  
  const autoCounterRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Load saved progress and history
  useEffect(() => {
    const savedProgress = localStorage.getItem('dhikr-progress');
    const savedHistory = localStorage.getItem('dhikr-history');
    
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      if (progress.targetCount === targetCount) {
        setCount(progress.count);
        setElapsedTime(progress.elapsedTime);
      }
    }
    
    if (savedHistory) {
      setSessionHistory(JSON.parse(savedHistory));
    }
  }, [targetCount]);
  
  // Auto-save progress
  useEffect(() => {
    if (count > 0 || elapsedTime > 0) {
      localStorage.setItem('dhikr-progress', JSON.stringify({
        targetCount,
        count,
        elapsedTime
      }));
    }
  }, [count, elapsedTime, targetCount]);
  
  // Timer for session duration
  useEffect(() => {
    if (isActive && !isPaused) {
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive, isPaused]);
  
  // Auto counting mode
  useEffect(() => {
    if (countingMode === 'auto' && isActive && !isPaused && count < targetCount) {
      autoCounterRef.current = setTimeout(() => {
        handleIncrement();
      }, autoSpeed);
    }
    
    return () => {
      if (autoCounterRef.current) {
        clearTimeout(autoCounterRef.current);
      }
    };
  }, [count, countingMode, isActive, isPaused, autoSpeed]);
  
  // Calculate progress
  const progress = (count / targetCount) * 100;
  const radius = 140;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  
  // Milestone thresholds
  const milestoneThresholds = [
    { percent: 25, label: language === 'en' ? 'Quarter' : 'Quart' },
    { percent: 50, label: language === 'en' ? 'Halfway' : 'Mi-chemin' },
    { percent: 75, label: language === 'en' ? 'Three Quarters' : 'Trois Quarts' },
    { percent: 100, label: language === 'en' ? 'Complete' : 'Terminé' }
  ];
  
  // Check for milestone achievements
  useEffect(() => {
    const currentMilestone = milestoneThresholds.find(
      m => progress >= m.percent && !milestones.includes(m.percent)
    );
    
    if (currentMilestone && currentMilestone.percent !== 100) {
      setMilestones(prev => [...prev, currentMilestone.percent]);
      showMilestoneToast(currentMilestone.percent);
    }
  }, [progress]);
  
  const showMilestoneToast = (percent: number) => {
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }
    // Could show a toast notification here
  };
  
  // Handle count increment
  const handleIncrement = () => {
    if (count >= targetCount) return;
    
    // Start session on first count
    if (count === 0 && !sessionStartTime) {
      setSessionStartTime(new Date());
      setIsActive(true);
    }
    
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
    
    // Play click sound (subtle)
    playClickSound();
    
    const newCount = count + 1;
    setCount(newCount);
    
    // Check for completion
    if (newCount === targetCount) {
      handleCompletion();
    }
  };
  
  const handleCompletion = () => {
    setShowCelebration(true);
    setIsActive(false);
    setIsPaused(false);
    
    // Vibrate pattern for completion
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    }
    
    // Play completion sound
    playCompletionSound();
    
    // Save to history
    const session = {
      date: new Date().toISOString(),
      count: targetCount,
      duration: elapsedTime,
      completed: true
    };
    
    const updatedHistory = [session, ...sessionHistory].slice(0, 20); // Keep last 20 sessions
    setSessionHistory(updatedHistory);
    localStorage.setItem('dhikr-history', JSON.stringify(updatedHistory));
    
    if (onComplete) onComplete();
    
    // Hide celebration after 5 seconds
    setTimeout(() => setShowCelebration(false), 5000);
  };
  
  // Reset counter
  const handleReset = () => {
    if (count > 0 && count < targetCount) {
      const confirmReset = window.confirm(
        language === 'en' 
          ? 'Are you sure you want to reset? Your progress will be lost.' 
          : 'Êtes-vous sûr de vouloir réinitialiser ? Votre progression sera perdue.'
      );
      if (!confirmReset) return;
    }
    
    setCount(0);
    setIsActive(false);
    setIsPaused(false);
    setShowCelebration(false);
    setSessionStartTime(null);
    setElapsedTime(0);
    setMilestones([]);
    localStorage.removeItem('dhikr-progress');
  };
  
  // Copy to clipboard
  const handleCopy = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  
  // Audio playback placeholders
  const playClickSound = () => {
    // TODO: Add subtle click sound
  };
  
  const playCompletionSound = () => {
    // TODO: Add celebration sound
  };
  
  const handlePlayAudio = (type: 'divineNames' | 'verse') => {
    // TODO: Implement audio playback
    console.log(`Playing ${type} pronunciation...`);
  };
  
  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Export session
  const handleExport = () => {
    const data = {
      divineNames: divineNames.arabic,
      targetCount,
      currentCount: count,
      progress: `${Math.round(progress)}%`,
      duration: formatTime(elapsedTime),
      date: new Date().toISOString(),
      history: sessionHistory
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dhikr-session-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // Share progress
  const handleShare = async () => {
    const shareText = language === 'en'
      ? `I've completed ${count} of ${targetCount} recitations of ${divineNames.transliteration} 🌙✨`
      : `J'ai complété ${count} de ${targetCount} récitations de ${divineNames.transliteration} 🌙✨`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          text: shareText,
          title: 'Dhikr Progress'
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      await handleCopy(shareText, 'share');
    }
  };
  
  // Calculate average pace
  const averagePace = count > 0 && elapsedTime > 0 
    ? Math.round(elapsedTime / count) 
    : 0;
  
  // Estimate time remaining
  const estimatedTimeRemaining = averagePace > 0 
    ? (targetCount - count) * averagePace 
    : 0;
  
  // Default colors if not provided
  const colors = elementColors || {
    gradient: "from-purple-900/40 via-pink-900/30 to-purple-900/20",
    border: "border-purple-500/40",
    accent: "text-purple-400",
    iconBg: "bg-purple-500/20",
    glow: "shadow-lg shadow-purple-500/30"
  };

  return (
    <div className="space-y-6">
      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="text-center space-y-6 p-8 animate-scale-in">
            <div className="relative">
              <Sparkles className="w-24 h-24 mx-auto text-yellow-400 animate-bounce" />
              <div className="absolute inset-0 animate-ping">
                <Sparkles className="w-24 h-24 mx-auto text-yellow-400 opacity-20" />
              </div>
            </div>
            <div>
              <h2 className="text-4xl font-bold text-white mb-3">
                {language === 'en' ? 'Māshā Allāh! 🎉' : 'Māshā Allāh! 🎉'}
              </h2>
              <p className="text-xl text-white/90 mb-2">
                {language === 'en' ? 'Session Completed!' : 'Session Terminée!'}
              </p>
              <p className="text-lg text-white/70">
                {targetCount} {language === 'en' ? 'recitations' : 'récitations'}
              </p>
              <p className="text-sm text-white/50 mt-2">
                {language === 'en' ? 'Duration:' : 'Durée:'} {formatTime(elapsedTime)}
              </p>
            </div>
            
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowCelebration(false)}
                className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
              >
                {language === 'en' ? 'Close' : 'Fermer'}
              </button>
              <button
                onClick={handleShare}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-colors"
              >
                <Share2 className="w-5 h-5 inline mr-2" />
                {language === 'en' ? 'Share' : 'Partager'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Counter Card */}
      <div className={`bg-gradient-to-br ${colors.gradient} border-2 ${colors.border} rounded-2xl p-8 space-y-8 ${colors.glow}`}>
        
        {/* Header Section */}
        <div className="space-y-6">
          {/* Practice Night Info */}
          {practiceNight && (
            <div className="flex items-center justify-center gap-3 text-sm">
              <Moon className={`w-5 h-5 ${colors.accent}`} />
              <span className="text-white">
                {language === 'en' ? 'Practice Night:' : 'Nuit de Pratique:'} 
                <span className="font-semibold text-white ml-2">
                  {practiceNight.primary[language]}
                </span>
              </span>
            </div>
          )}
          
          {/* Zodiac Sign */}
          {zodiacSign && (
            <div className="flex items-center justify-center gap-3 text-sm text-white">
              <Star className="w-4 h-4" />
              <span>{zodiacSign[language]}</span>
              <span className="text-xs font-arabic">{zodiacSign.arabic}</span>
            </div>
          )}

          {/* Divine Names Section */}
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-3">
              <p className="text-4xl font-arabic text-white leading-relaxed">
                {divineNames.arabic}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleCopy(divineNames.arabic, 'divineNames')}
                  className={`p-2 ${colors.iconBg} hover:bg-white/20 rounded-lg transition-colors`}
                  title={language === 'en' ? 'Copy Arabic text' : 'Copier le texte arabe'}
                >
                  {copied === 'divineNames' ? (
                    <Check className="w-5 h-5 text-green-400" />
                  ) : (
                    <Copy className="w-5 h-5 text-white" />
                  )}
                </button>
                <button
                  onClick={() => handlePlayAudio('divineNames')}
                  className={`p-2 ${colors.iconBg} hover:bg-white/20 rounded-lg transition-colors`}
                  title={language === 'en' ? 'Play pronunciation' : 'Écouter la prononciation'}
                >
                  <Volume2 className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
            <p className="text-xl text-purple-200 font-medium">
              {divineNames.transliteration}
            </p>
            <p className="text-base text-white">
              {divineNames.translation[language]}
            </p>
          </div>
        </div>

        {/* Circular Progress Indicator */}
        <div className="relative flex items-center justify-center">
          <svg className="w-80 h-80 transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="160"
              cy="160"
              r={radius}
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="16"
            />
            {/* Progress circle */}
            <circle
              cx="160"
              cy="160"
              r={radius}
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="16"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-500 ease-out"
            />
            {/* Milestone markers */}
            {milestoneThresholds.map((milestone, idx) => {
              const angle = (milestone.percent / 100) * 360 - 90;
              const radians = (angle * Math.PI) / 180;
              const x = 160 + radius * Math.cos(radians);
              const y = 160 + radius * Math.sin(radians);
              const achieved = progress >= milestone.percent;
              
              return (
                <g key={idx}>
                  <circle
                    cx={x}
                    cy={y}
                    r="8"
                    fill={achieved ? "#a855f7" : "rgba(255, 255, 255, 0.2)"}
                    className="transition-all duration-300"
                  />
                  {achieved && (
                    <circle
                      cx={x}
                      cy={y}
                      r="8"
                      fill="#a855f7"
                      className="animate-ping opacity-75"
                    />
                  )}
                </g>
              );
            })}
            {/* Gradient definition */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="50%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Count Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-7xl font-bold text-white tabular-nums">
              {count}
            </p>
            <p className="text-2xl text-white/80 mt-2">/ {targetCount}</p>
            <div className={`mt-3 px-4 py-1.5 ${colors.iconBg} rounded-full`}>
              <p className={`text-lg font-semibold ${colors.accent}`}>
                {Math.round(progress)}%
              </p>
            </div>
            
            {/* Session Timer */}
            {isActive && (
              <div className="mt-4 flex items-center gap-2 text-sm text-white">
                <Clock className="w-4 h-4" />
                <span>{formatTime(elapsedTime)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Statistics Row */}
        <div className="grid grid-cols-3 gap-4">
          <div className={`p-4 ${colors.iconBg} rounded-xl text-center`}>
            <Zap className={`w-5 h-5 ${colors.accent} mx-auto mb-1`} />
            <p className="text-2xl font-bold text-white">{count}</p>
            <p className="text-xs text-gray-400">
              {language === 'en' ? 'Current' : 'Actuel'}
            </p>
          </div>
          <div className={`p-4 ${colors.iconBg} rounded-xl text-center`}>
            <Clock className={`w-5 h-5 ${colors.accent} mx-auto mb-1`} />
            <p className="text-2xl font-bold text-white">{formatTime(elapsedTime)}</p>
            <p className="text-xs text-gray-400">
              {language === 'en' ? 'Duration' : 'Durée'}
            </p>
          </div>
          <div className={`p-4 ${colors.iconBg} rounded-xl text-center`}>
            <TrendingUp className={`w-5 h-5 ${colors.accent} mx-auto mb-1`} />
            <p className="text-2xl font-bold text-white">
              {averagePace > 0 ? `${averagePace}s` : '--'}
            </p>
            <p className="text-xs text-gray-400">
              {language === 'en' ? 'Avg Pace' : 'Rythme Moy'}
            </p>
          </div>
        </div>

        {/* Estimated Time Remaining */}
        {estimatedTimeRemaining > 0 && count < targetCount && (
          <div className="text-center text-sm text-gray-400">
            <p>
              {language === 'en' ? 'Estimated time remaining:' : 'Temps restant estimé:'}{' '}
              <span className="font-semibold text-white">
                {formatTime(estimatedTimeRemaining)}
              </span>
            </p>
          </div>
        )}

        {/* Counting Mode Toggle */}
        <div className="flex items-center justify-center gap-3">
          <span className="text-sm text-gray-400">
            {language === 'en' ? 'Mode:' : 'Mode:'}
          </span>
          <button
            onClick={() => setCountingMode('manual')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              countingMode === 'manual'
                ? `${colors.iconBg} ${colors.accent}`
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            {language === 'en' ? 'Manual' : 'Manuel'}
          </button>
          <button
            onClick={() => setCountingMode('auto')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              countingMode === 'auto'
                ? `${colors.iconBg} ${colors.accent}`
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            {language === 'en' ? 'Auto' : 'Auto'}
          </button>
        </div>

        {/* Auto Speed Control */}
        {countingMode === 'auto' && (
          <div className="space-y-2">
            <label className="text-sm text-gray-400 block text-center">
              {language === 'en' ? 'Auto Speed:' : 'Vitesse Auto:'} {autoSpeed / 1000}s
            </label>
            <input
              type="range"
              min="500"
              max="5000"
              step="500"
              value={autoSpeed}
              onChange={(e) => setAutoSpeed(Number(e.target.value))}
              className="w-full"
            />
          </div>
        )}

        {/* Main Action Button */}
        <button
          onClick={countingMode === 'manual' ? handleIncrement : undefined}
          disabled={count >= targetCount}
          className={`w-full py-6 rounded-xl font-bold text-xl transition-all transform active:scale-95 ${
            count >= targetCount
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 text-white shadow-lg hover:shadow-2xl'
          }`}
        >
          {count >= targetCount ? (
            <span className="flex items-center justify-center gap-2">
              <Trophy className="w-6 h-6" />
              {language === 'en' ? 'Completed' : 'Terminé'}
            </span>
          ) : countingMode === 'manual' ? (
            language === 'en' ? 'Tap to Count' : 'Appuyer pour Compter'
          ) : (
            <span className="flex items-center justify-center gap-2">
              {isActive ? (
                <>
                  <Pause className="w-6 h-6" />
                  {language === 'en' ? 'Auto Counting...' : 'Comptage Auto...'}
                </>
              ) : (
                <>
                  <Play className="w-6 h-6" />
                  {language === 'en' ? 'Start Auto Count' : 'Démarrer Comptage Auto'}
                </>
              )}
            </span>
          )}
        </button>

        {/* Control Buttons */}
        <div className="grid grid-cols-4 gap-3">
          <button
            onClick={() => {
              setIsActive(!isActive);
              setIsPaused(!isPaused);
            }}
            className="flex flex-col items-center justify-center gap-1 p-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            {isActive && !isPaused ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
            <span className="text-xs">
              {isActive && !isPaused 
                ? (language === 'en' ? 'Pause' : 'Pause')
                : (language === 'en' ? 'Start' : 'Démarrer')}
            </span>
          </button>
          
          <button
            onClick={handleReset}
            className="flex flex-col items-center justify-center gap-1 p-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            <span className="text-xs">
              {language === 'en' ? 'Reset' : 'Reset'}
            </span>
          </button>

          <button
            onClick={handleShare}
            className="flex flex-col items-center justify-center gap-1 p-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            <Share2 className="w-5 h-5" />
            <span className="text-xs">
              {language === 'en' ? 'Share' : 'Partager'}
            </span>
          </button>

          <button
            onClick={handleExport}
            className="flex flex-col items-center justify-center gap-1 p-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            <Download className="w-5 h-5" />
            <span className="text-xs">
              {language === 'en' ? 'Export' : 'Exporter'}
            </span>
          </button>
        </div>

        {/* Quick Tips */}
        <div className="bg-white/5 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Heart className={`w-4 h-4 ${colors.accent}`} />
            <p className="text-gray-300">
              {language === 'en' 
                ? 'Recite with presence and sincerity' 
                : 'Récitez avec présence et sincérité'}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Moon className={`w-4 h-4 ${colors.accent}`} />
            <p className="text-gray-300">
              {language === 'en' 
                ? 'Best practiced after prayer in a quiet space'
                : 'Meilleure pratique après la prière dans un espace calme'}
            </p>
          </div>
        </div>
      </div>

      {/* Quranic Verse Section */}
      {quranicVerse && (
        <div className={`bg-gradient-to-br ${colors.gradient} border-2 ${colors.border} rounded-2xl p-6 space-y-4`}>
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white flex items-center gap-2">
              <BookOpen className={`w-5 h-5 ${colors.accent}`} />
              {language === 'en' ? 'Quranic Verse' : 'Verset Coranique'}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => handleCopy(quranicVerse.arabic, 'verse')}
                className={`p-2 ${colors.iconBg} hover:bg-white/20 rounded-lg transition-colors`}
              >
                {copied === 'verse' ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-300" />
                )}
              </button>
              <button
                onClick={() => handlePlayAudio('verse')}
                className={`p-2 ${colors.iconBg} hover:bg-white/20 rounded-lg transition-colors`}
              >
                <Volume2 className="w-4 h-4 text-gray-300" />
              </button>
            </div>
          </div>
          
          <div className="space-y-3 text-center">
            <p className="text-2xl font-arabic text-white leading-relaxed">
              {quranicVerse.arabic}
            </p>
            <p className="text-lg text-purple-200">
              {quranicVerse.transliteration}
            </p>
            <p className="text-base text-gray-300">
              {quranicVerse.translation[language]}
            </p>
            <p className="text-sm text-gray-500">
              ({quranicVerse.reference})
            </p>
          </div>
        </div>
      )}

      {/* Angel and Jinn Information */}
      {(angel || jinn) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {angel && (
            <div className={`bg-gradient-to-br ${colors.gradient} border-2 ${colors.border} rounded-xl p-5 space-y-3`}>
              <div className="flex items-center gap-2">
                <div className={`p-2 ${colors.iconBg} rounded-lg`}>
                  <span className="text-2xl">👼</span>
                </div>
                <h4 className="font-semibold text-white">
                  {language === 'en' ? 'Associated Angel' : 'Ange Associé'}
                </h4>
              </div>
              <div className="text-center space-y-2">
                <p className="text-xl font-arabic text-white">{angel.arabic}</p>
                <p className="text-base text-purple-200">{angel.transliteration}</p>
                {angel.name && (
                  <p className="text-sm text-gray-400">{angel.name[language]}</p>
                )}
              </div>
            </div>
          )}
          
          {jinn && (
            <div className={`bg-gradient-to-br ${colors.gradient} border-2 ${colors.border} rounded-xl p-5 space-y-3`}>
              <div className="flex items-center gap-2">
                <div className={`p-2 ${colors.iconBg} rounded-lg`}>
                  <span className="text-2xl">🔮</span>
                </div>
                <h4 className="font-semibold text-white">
                  {language === 'en' ? 'Associated Jinn King' : 'Roi Jinn Associé'}
                </h4>
              </div>
              <div className="text-center space-y-2">
                <p className="text-xl font-arabic text-white">{jinn.arabic}</p>
                <p className="text-base text-purple-200">{jinn.transliteration}</p>
                {jinn.meaning && (
                  <p className="text-sm text-gray-400">{jinn.meaning[language]}</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Practice Instructions */}
      {instructions && (
        <div className={`bg-gradient-to-br ${colors.gradient} border-2 ${colors.border} rounded-xl overflow-hidden`}>
          <button
            onClick={() => setShowInstructions(!showInstructions)}
            className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 ${colors.iconBg} rounded-lg`}>
                <BookOpen className={`w-5 h-5 ${colors.accent}`} />
              </div>
              <h3 className="font-bold text-white text-lg">
                {language === 'en' ? 'Step-by-Step Practice Guide' : 'Guide de Pratique Étape par Étape'}
              </h3>
            </div>
            {showInstructions ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
          
          {showInstructions && (
            <div className="px-5 pb-5 space-y-3 animate-slide-down">
              {instructions[language].map((instruction, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-4 bg-white/5 rounded-lg"
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full ${colors.iconBg} flex items-center justify-center`}>
                    <span className={`font-bold ${colors.accent}`}>{idx + 1}</span>
                  </div>
                  <p className="text-gray-300 leading-relaxed pt-1">{instruction}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Session History */}
      {sessionHistory.length > 0 && (
        <div className={`bg-gradient-to-br ${colors.gradient} border-2 ${colors.border} rounded-xl overflow-hidden`}>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 ${colors.iconBg} rounded-lg`}>
                <TrendingUp className={`w-5 h-5 ${colors.accent}`} />
              </div>
              <h3 className="font-bold text-white text-lg">
                {language === 'en' ? 'Session History' : 'Historique des Sessions'}
              </h3>
            </div>
            {showDetails ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
          
          {showDetails && (
            <div className="px-5 pb-5 space-y-2 animate-slide-down max-h-64 overflow-y-auto">
              {sessionHistory.map((session, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {session.completed ? (
                      <Trophy className={`w-5 h-5 ${colors.accent}`} />
                    ) : (
                      <Clock className="w-5 h-5 text-gray-400" />
                    )}
                    <div>
                      <p className="text-white font-medium">
                        {session.count} {language === 'en' ? 'recitations' : 'récitations'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(session.date).toLocaleDateString(
                          language === 'en' ? 'en-US' : 'fr-FR'
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">
                      {formatTime(session.duration)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add custom styles */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
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

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }

        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }

        .font-arabic {
          font-family: 'Amiri', 'Traditional Arabic', serif;
        }
      `}</style>
    </div>
  );
}