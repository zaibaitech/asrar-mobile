"use client";

import { Clock, Info, MapPin, Moon, Zap } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLanguage } from "../../../contexts/LanguageContext";
import { getCurrentLunarMansion } from "../../../lib/lunarMansions";
import type { AccuratePlanetaryHour } from "../../../types/planetary";
import { calculateAccuratePlanetaryHours } from "../../../utils/planetaryHours";
import type { PracticeNight } from "../types";

interface PreciseTimingGuidanceProps {
  practiceNight: PracticeNight; // e.g., "Sunday night"
  userElement: "Fire" | "Water" | "Air" | "Earth" | "fire" | "water" | "air" | "earth";
  zodiacPlanet?: string; // e.g., "Moon" for Cancer
}

/**
 * PreciseTimingGuidance Component
 * 
 * Solves the equation: Practice Day + PRECISE TIME = Optimal Dhikr Window
 * 
 * Shows:
 * - Exact planetary hours on practice night
 * - Best hour(s) based on element/planet alignment
 * - Lunar mansion context
 * - Countdown to next optimal window
 * - Location-aware calculations
 */
export function PreciseTimingGuidance({
  practiceNight,
  userElement,
  zodiacPlanet,
}: PreciseTimingGuidanceProps) {
  const { language } = useLanguage();
  const isFr = language === 'fr';

  // Normalize element to lowercase for comparison with planetary hour elements
  const normalizedElement = userElement.toLowerCase() as "fire" | "water" | "air" | "earth";

  const [location, setLocation] = useState<{ latitude: number; longitude: number; cityName?: string } | null>(null);
  const [practiceHours, setPracticeHours] = useState<AccuratePlanetaryHour[]>([]);
  const [nextOptimalTime, setNextOptimalTime] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showFullTimeline, setShowFullTimeline] = useState(false);

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Get user location
  useEffect(() => {
    const getLocation = async () => {
      try {
        // Check saved location first
        const savedLocation = localStorage.getItem('istikhara_location');
        if (savedLocation) {
          setLocation(JSON.parse(savedLocation));
          setIsLoading(false);
          return;
        }

        // Request new location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const loc = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                cityName: 'Your Location',
              };

              // Try to get city name
              try {
                const response = await fetch(
                  `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${loc.latitude}&longitude=${loc.longitude}&localityLanguage=en`
                );
                const data = await response.json();
                loc.cityName = data.city || data.locality || 'Your Location';
              } catch (e) {
                console.log('Could not fetch city name');
              }

              setLocation(loc);
              localStorage.setItem('istikhara_location', JSON.stringify(loc));
              setIsLoading(false);
            },
            (error) => {
              console.error('Location error:', error);
              // Fallback to default location (Mecca)
              const fallback = {
                latitude: 21.4225,
                longitude: 39.8262,
                cityName: 'Mecca (default)',
              };
              setLocation(fallback);
              setIsLoading(false);
            }
          );
        }
      } catch (error) {
        console.error('Location error:', error);
        setIsLoading(false);
      }
    };

    getLocation();
  }, []);

  // Calculate practice day hours
  useEffect(() => {
    if (!location) return;

    // Get the practice day name (e.g., "Sunday")
    const practiceDayName = practiceNight.primary.en; // e.g., "Sunday night"
    const dayName = practiceDayName.split(' ')[0]; // Extract "Sunday"

    // Map day name to day number
    const dayMap: Record<string, number> = {
      'Sunday': 0,
      'Monday': 1,
      'Tuesday': 2,
      'Wednesday': 3,
      'Thursday': 4,
      'Friday': 5,
      'Saturday': 6,
    };

    const practiceDayNumber = dayMap[dayName];
    if (practiceDayNumber === undefined) return;

    // Find next occurrence of practice day
    const today = new Date();
    const currentDay = today.getDay();
    
    let daysUntilPractice = practiceDayNumber - currentDay;
    if (daysUntilPractice < 0) {
      daysUntilPractice += 7; // Next week
    } else if (daysUntilPractice === 0 && today.getHours() >= 18) {
      // If it's practice day but evening has passed, get next week
      daysUntilPractice = 7;
    }

    const practiceDate = new Date(today);
    practiceDate.setDate(today.getDate() + daysUntilPractice);

    // Calculate planetary hours for practice day
    const hours = calculateAccuratePlanetaryHours(
      practiceDate,
      location.latitude,
      location.longitude
    );

    // Filter for night hours only (practice is at night)
    // Night hours are those marked as !isDayHour
    const nightHours = hours.filter(h => !h.isDayHour);

    // Additional validation: ensure times are actually after sunset
    // Night should start around/after sunset (typically 4-7 PM depending on location/season)
    const validNightHours = nightHours.filter(h => {
      const hour = h.startTime.getHours();
      // Night hours should be either:
      // - Evening: 16:00 (4 PM) onwards, OR
      // - Early morning: before 6 AM
      return hour >= 16 || hour < 6;
    });

    console.log('=== PRACTICE NIGHT CALCULATION ===');
    console.log('Practice day:', practiceDayName);
    console.log('Practice date:', practiceDate.toDateString());
    console.log('Location:', location);
    console.log('Total hours:', hours.length);
    console.log('Night hours (isDayHour=false):', nightHours.length);
    console.log('Valid night hours (time check):', validNightHours.length);
    
    if (validNightHours.length > 0) {
      console.log('First night hour:', validNightHours[0]?.startTime.toString());
      console.log('Last night hour:', validNightHours[validNightHours.length-1]?.endTime.toString());
    }
    
    if (nightHours.length > 0 && validNightHours.length === 0) {
      console.warn('WARNING: Night hours exist but none passed time validation!');
      console.log('Sample night hour:', nightHours[0]?.startTime.toString());
    }

    setPracticeHours(validNightHours.length > 0 ? validNightHours : nightHours);

    // Find best hour(s) based on alignment
    const bestHour = findBestHour(nightHours);
    if (bestHour) {
      setNextOptimalTime(bestHour.startTime);
    }

    setIsLoading(false);
  }, [location, practiceNight, normalizedElement, zodiacPlanet]);

  // Calculate alignment score for a planetary hour
  const calculateAlignment = (hour: AccuratePlanetaryHour): number => {
    let score = 0;

    // Element alignment (most important)
    const planetElement = hour.planet.element;
    if (planetElement === normalizedElement) {
      score += 50; // Perfect match
    } else if (
      (normalizedElement === 'fire' && planetElement === 'air') ||
      (normalizedElement === 'air' && planetElement === 'fire') ||
      (normalizedElement === 'water' && planetElement === 'earth') ||
      (normalizedElement === 'earth' && planetElement === 'water')
    ) {
      score += 30; // Compatible
    } else if (
      (normalizedElement === 'fire' && planetElement === 'water') ||
      (normalizedElement === 'water' && planetElement === 'fire')
    ) {
      score += 0; // Opposing
    } else {
      score += 15; // Neutral
    }

    // Zodiac planet alignment
    if (zodiacPlanet && hour.planet.name === zodiacPlanet) {
      score += 50; // Zodiac planet match (very important)
    }

    return score;
  };

  // Find best hour for practice
  const findBestHour = (hours: AccuratePlanetaryHour[]) => {
    if (hours.length === 0) return null;

    const scored = hours.map(h => ({
      hour: h,
      score: calculateAlignment(h),
    }));

    scored.sort((a, b) => b.score - a.score);
    return scored[0].hour;
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 rounded-xl p-6 border border-indigo-200 dark:border-indigo-800">
        <div className="flex items-center justify-center gap-3 text-indigo-600 dark:text-indigo-400">
          <Clock className="w-5 h-5 animate-spin" />
          <span>{isFr ? 'Calcul du timing optimal...' : 'Calculating optimal timing...'}</span>
        </div>
      </div>
    );
  }

  if (!location) {
    return (
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50 rounded-xl p-6 border border-amber-200 dark:border-amber-800">
        <div className="flex items-center gap-3 text-amber-700 dark:text-amber-400">
          <MapPin className="w-5 h-5" />
          <div>
            <p className="font-semibold">
              {isFr ? 'Localisation requise' : 'Location Required'}
            </p>
            <p className="text-sm mt-1">
              {isFr 
                ? 'Autorisez la localisation pour calculer les heures planétaires précises.'
                : 'Allow location access to calculate precise planetary hours.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const bestHour = findBestHour(practiceHours);
  const topThreeHours = practiceHours
    .map(h => ({ hour: h, score: calculateAlignment(h) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const getAlignmentLabel = (score: number) => {
    if (score >= 80) return { label: isFr ? 'Parfait' : 'Perfect', emoji: '⭐⭐⭐⭐⭐', color: 'text-green-400' };
    if (score >= 60) return { label: isFr ? 'Excellent' : 'Excellent', emoji: '⭐⭐⭐⭐', color: 'text-blue-400' };
    if (score >= 40) return { label: isFr ? 'Bon' : 'Good', emoji: '⭐⭐⭐', color: 'text-purple-400' };
    return { label: isFr ? 'Acceptable' : 'Fair', emoji: '⭐⭐', color: 'text-gray-400' };
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(isFr ? 'fr-FR' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZoneName: 'short', // Add timezone to help debug
    });
  };

  const getTimeUntil = () => {
    if (!nextOptimalTime) return '';
    
    const diff = nextOptimalTime.getTime() - currentTime.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return isFr ? `dans ${days}j ${hours}h` : `in ${days}d ${hours}h`;
    }
    return isFr ? `dans ${hours}h` : `in ${hours}h`;
  };

  return (
    <div className="space-y-4">
      {/* Main Timing Card */}
      <div className="bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-pink-900/20 rounded-xl p-6 border border-indigo-400/50 shadow-lg shadow-indigo-500/30">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <Clock className="w-6 h-6 text-indigo-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {isFr ? '⏰ Timing Précis' : '⏰ Precise Timing'}
              </h3>
              <p className="text-sm text-indigo-300">
                {practiceNight.primary[language]}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-indigo-300 mb-1">
              <MapPin className="w-3 h-3 inline mr-1" />
              {location.cityName}
            </div>
          </div>
        </div>

        {/* Best Time Display */}
        {bestHour && (
          <div className="mb-6 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-400/30">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="text-sm font-semibold text-purple-200">
                  {isFr ? 'MEILLEUR MOMENT' : 'BEST TIME'}
                </span>
              </div>
              <div className={`text-sm ${getAlignmentLabel(calculateAlignment(bestHour)).color}`}>
                {getAlignmentLabel(calculateAlignment(bestHour)).emoji}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-white">
                    {formatTime(bestHour.startTime)} - {formatTime(bestHour.endTime)}
                  </div>
                  <div className="text-sm text-purple-300 mt-1">
                    {bestHour.planet.nameArabic} • {bestHour.planet.name} {isFr ? 'Heure' : 'Hour'}
                  </div>
                </div>
                {nextOptimalTime && (
                  <div className="text-right">
                    <div className="text-xs text-purple-300">
                      {isFr ? 'Commence' : 'Starts'}
                    </div>
                    <div className="text-sm font-semibold text-white">
                      {getTimeUntil()}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-purple-200">
                <Info className="w-4 h-4" />
                <span>
                  {isFr 
                    ? `${getAlignmentLabel(calculateAlignment(bestHour)).label} alignement avec votre élément ${userElement}`
                    : `${getAlignmentLabel(calculateAlignment(bestHour)).label} alignment with your ${userElement} element`}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Top 3 Times */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-indigo-200">
              {isFr ? '🌙 Top 3 Heures de la Nuit' : '🌙 Top 3 Night Hours'}
            </h4>
            <button
              onClick={() => setShowFullTimeline(!showFullTimeline)}
              className="text-xs text-indigo-300 hover:text-indigo-200 transition-colors"
            >
              {showFullTimeline 
                ? (isFr ? 'Masquer tout' : 'Hide all') 
                : (isFr ? 'Voir toutes les 12 heures' : 'See all 12 hours')}
            </button>
          </div>

          <div className="space-y-2">
            {topThreeHours.map(({ hour, score }, idx) => {
              const alignment = getAlignmentLabel(score);
              return (
                <div
                  key={idx}
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{hour.planet.element === 'fire' ? '🔥' : hour.planet.element === 'water' ? '💧' : hour.planet.element === 'air' ? '🌬️' : '🌍'}</span>
                        <span className="font-semibold text-white">
                          {hour.planet.name}
                        </span>
                        <span className="text-xs text-gray-400 font-arabic">
                          {hour.planet.nameArabic}
                        </span>
                      </div>
                      <div className="text-sm text-indigo-300">
                        {formatTime(hour.startTime)} - {formatTime(hour.endTime)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xs mb-1 ${alignment.color}`}>
                        {alignment.emoji}
                      </div>
                      <div className="text-xs text-gray-400">
                        {alignment.label}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Full Timeline (expandable) */}
        {showFullTimeline && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <h5 className="text-xs font-semibold text-indigo-300 mb-3 uppercase tracking-wide">
              {isFr ? 'Toutes les Heures de Nuit' : 'All Night Hours'}
            </h5>
            <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
              {practiceHours.map((hour, idx) => {
                const score = calculateAlignment(hour);
                const alignment = getAlignmentLabel(score);
                return (
                  <div
                    key={idx}
                    className="p-2 bg-white/5 rounded border border-white/5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-white font-medium">{hour.planet.name}</span>
                        <span className="text-gray-400 ml-2">{formatTime(hour.startTime)}</span>
                      </div>
                      <span className={alignment.color}>{alignment.emoji}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Lunar Mansion Context */}
        <LunarMansionContext practiceDate={nextOptimalTime} />
      </div>

      {/* Educational Note */}
      <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-purple-200">
            <p className="font-semibold mb-2">
              {isFr ? 'Comment ce timing est calculé :' : 'How this timing is calculated:'}
            </p>
            <ul className="space-y-1 text-xs text-purple-300">
              <li>✓ {isFr ? 'Heures planétaires basées sur le lever/coucher du soleil' : 'Planetary hours based on sunrise/sunset'}</li>
              <li>✓ {isFr ? 'Alignement avec votre élément' : 'Alignment with your element'} ({userElement})</li>
              {zodiacPlanet && (
                <li>✓ {isFr ? 'Résonance avec votre planète zodiacale' : 'Resonance with your zodiac planet'} ({zodiacPlanet})</li>
              )}
              <li>✓ {isFr ? 'Tradition islamique classique' : 'Classical Islamic tradition'}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper component for lunar mansion context
function LunarMansionContext({ practiceDate }: { practiceDate: Date | null }) {
  const { language } = useLanguage();
  const isFr = language === 'fr';
  const [mansion, setMansion] = useState<any>(null);

  useEffect(() => {
    if (practiceDate) {
      const currentMansion = getCurrentLunarMansion();
      setMansion(currentMansion);
    }
  }, [practiceDate]);

  if (!mansion) return null;

  return (
    <div className="mt-4 pt-4 border-t border-white/10">
      <div className="flex items-center gap-2 mb-2">
        <Moon className="w-4 h-4 text-purple-300" />
        <h5 className="text-sm font-semibold text-purple-200">
          {isFr ? 'Manoir Lunaire' : 'Lunar Mansion'}
        </h5>
      </div>
      <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
        <div className="text-center mb-2">
          <div className="text-2xl font-arabic text-purple-200 mb-1">
            {mansion.mansion.nameArabic}
          </div>
          <div className="text-sm text-purple-300">
            {mansion.mansion.nameTransliteration}
          </div>
        </div>
        <div className="text-xs text-purple-300 text-center">
          {isFr ? 'Qualité divine:' : 'Divine quality:'} {mansion.mansion.divineQuality[language]}
        </div>
      </div>
    </div>
  );
}
