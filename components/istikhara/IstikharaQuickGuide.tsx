"use client";

import React from "react";
import { useLanguage } from "../../../contexts/LanguageContext";
import type { IstikharaCalculationResult } from "../types";

interface IstikharaQuickGuideProps {
  result: IstikharaCalculationResult;
}

/**
 * IstikharaQuickGuide - Actionable guidance cards
 * 
 * Provides quick, practical actions based on the Istikhara results:
 * - Best day for important actions
 * - Recommended spiritual practices
 * - Career direction hints
 * - Personality awareness points
 * 
 * Features:
 * - Action-oriented language
 * - Icon-based visual hierarchy
 * - Collapsible sections
 * - Print-friendly layout
 */
export function IstikharaQuickGuide({ result }: IstikharaQuickGuideProps) {
  const { language } = useLanguage();
  const profile = result.burujProfile;

  const actionCards = [
    {
      icon: "📅",
      title: language === "en" ? "Schedule Important Tasks" : "Planifier les Tâches Importantes",
      description: language === "en" 
        ? `Your blessed day is ${profile.blessed_day.day?.en}. Schedule meetings, decisions, and new projects on this day for optimal spiritual alignment.`
        : `Votre jour béni est ${profile.blessed_day.day?.fr}. Planifiez les réunions, décisions et nouveaux projets ce jour-là pour un alignement spirituel optimal.`,
      color: "blue",
    },
    {
      icon: "🤲",
      title: language === "en" ? "Daily Spiritual Practice" : "Pratique Spirituelle Quotidienne",
      description: language === "en"
        ? `Recite ${('transliteration' in profile.spiritual_practice.divine_names) ? profile.spiritual_practice.divine_names.transliteration : "the recommended Divine Names"} for spiritual balance and protection.`
        : `Récitez ${('transliteration' in profile.spiritual_practice.divine_names) ? profile.spiritual_practice.divine_names.transliteration : "les Noms Divins recommandés"} pour l'équilibre spirituel et la protection.`,
      color: "purple",
    },
    {
      icon: "💼",
      title: language === "en" ? "Career Direction" : "Direction Professionnelle",
      description: profile.career.principle?.[language as "en" | "fr"] || 
        (language === "en" 
          ? "Align your work with your elemental nature for fulfillment."
          : "Alignez votre travail avec votre nature élémentaire pour l'épanouissement."),
      color: "emerald",
    },
    {
      icon: "🎁",
      title: language === "en" ? "Monthly Sadaqah" : "Sadaqah Mensuelle",
      description: language === "en"
        ? `Give ${profile.sadaqah.monthly?.traditional?.en || "charity"} every ${profile.sadaqah.monthly?.frequency?.en || "1-2 months"} to maintain spiritual balance.`
        : `Donnez ${profile.sadaqah.monthly?.traditional?.fr || "charité"} tous les ${profile.sadaqah.monthly?.frequency?.fr || "1-2 mois"} pour maintenir l'équilibre spirituel.`,
      color: "amber",
    },
  ];

  const colorMap: Record<string, { bg: string; border: string; icon: string }> = {
    blue: {
      bg: "bg-blue-500/10",
      border: "border-blue-500/30",
      icon: "text-blue-400",
    },
    purple: {
      bg: "bg-purple-500/10",
      border: "border-purple-500/30",
      icon: "text-purple-400",
    },
    emerald: {
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
      icon: "text-emerald-400",
    },
    amber: {
      bg: "bg-amber-500/10",
      border: "border-amber-500/30",
      icon: "text-amber-400",
    },
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl drop-shadow-lg">⚡</span>
        <h3 className="text-xl font-bold text-white drop-shadow-lg">
          {language === "en" ? "Quick Action Guide" : "Guide d'Action Rapide"}
        </h3>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {actionCards.map((card, index) => {
          const colors = colorMap[card.color];
          return (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 ${colors.border} bg-gradient-to-br ${colors.bg} hover:shadow-md transition-all duration-200`}
            >
              <div className="flex items-start gap-3">
                <div className={`text-2xl ${colors.icon}`}>{card.icon}</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{card.title}</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pro Tip */}
      <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-2 border-purple-300 dark:border-purple-700">
        <div className="flex items-start gap-3">
          <span className="text-xl">💡</span>
          <div>
            <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-1">
              {language === "en" ? "Pro Tip" : "Conseil Pro"}
            </h4>
            <p className="text-sm text-purple-800 dark:text-purple-200 leading-relaxed">
              {language === "en"
                ? "Combine these practices consistently for 40 days to see meaningful spiritual and practical results. Start small and build gradually."
                : "Combinez ces pratiques de manière cohérente pendant 40 jours pour voir des résultats spirituels et pratiques significatifs. Commencez petit et progressez graduellement."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
