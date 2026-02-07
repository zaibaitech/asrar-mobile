/**
 * Today's Details Card
 * ====================
 * Clean, organized display of today's astrological details
 * Consolidates day ruler, element, and quality into one card
 * 
 * Shows:
 * - Day ruling planet
 * - Today's element
 * - Day quality
 * - Element power
 */

import { DarkTheme } from '@/constants/DarkTheme';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Planet } from '@/services/PlanetaryHoursService';
import type { ElementalTone } from '@/types/divine-timing';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface TodayDetailsCardProps {
  dayRuler: Planet;
  userRuler?: Planet;
  dayElement?: ElementalTone;
  userElement?: ElementalTone;
  alignmentScore?: number;
  elementalHarmonyScore?: number;
  planetaryHarmonyScore?: number;
  verdict?: string;
  /** Accent color that reflects the screen's final day window tone (e.g. delicate = red). */
  toneColor?: string;
}

function getPlanetEmoji(planet: Planet): string {
  const emojiMap: Record<Planet, string> = {
    Sun: '☀️',
    Moon: '🌙',
    Mars: '♂️',
    Mercury: '☿️',
    Jupiter: '♃',
    Venus: '♀️',
    Saturn: '♄',
  };
  return emojiMap[planet] || '⭐';
}

function getElementEmoji(element: ElementalTone): string {
  const emojiMap: Record<ElementalTone, string> = {
    fire: '🔥',
    water: '💧',
    air: '🌬️',
    earth: '🌱',
  };
  return emojiMap[element] || '⚪';
}

// Get authentic ilm il nujum guidance for each planetary ruler
function getPlanetaryGuidance(planet: Planet, lang: 'en' | 'fr' | 'ar'): { essence: string; recommendation: string; practice: string } {
  const guidance: Record<Planet, Record<'en' | 'fr', { essence: string; recommendation: string; practice: string }>> = {
    Sun: {
      en: {
        essence: "Solar energy brings leadership, clarity, and radiant power. A day for visibility and vital expression.",
        recommendation: "Best aligned with: clear decisions, leadership, and honorable beginnings done with steadiness.",
        practice: "🌞 Solar Practice: Perform intentional actions at solar noon. Practice the discipline of clarity and direct action.",
      },
      fr: {
        essence: "L'énergie solaire apporte leadership, clarté et pouvoir rayonnant. Un jour pour la visibilité et l'expression vitale.",
        recommendation: "Meilleur pour : décisions claires, leadership, et débuts honorables avec constance.",
        practice: "🌞 Pratique solaire : Effectuez des actions intentionnelles à midi solaire. Pratiquez la discipline et l'action directe.",
      },
    },
    Moon: {
      en: {
        essence: "Lunar energy brings intuition, emotion, and cyclical wisdom. A day for inner work and emotional attunement.",
        recommendation: "Best aligned with: reflection, repair, emotional clarity, and gentle pacing.",
        practice: "🌙 Lunar Practice: Attune to lunar rhythms. Practice gratitude and emotional awareness throughout the day.",
      },
      fr: {
        essence: "L'énergie lunaire apporte intuition, émotion et sagesse cyclique. Un jour pour le travail intérieur et l'attunement émotionnel.",
        recommendation: "Meilleur pour : réflexion, réparation, clarté émotionnelle et rythme doux.",
        practice: "🌙 Pratique lunaire : Accordez-vous aux rythmes lunaires. Pratiquez la gratitude et la conscience émotionnelle.",
      },
    },
    Mercury: {
      en: {
        essence: "Mercurial energy brings communication, learning, and intellectual clarity. A day for exchange and connection.",
        recommendation: "Best aligned with: writing, learning, negotiation, and careful planning.",
        practice: "☿️ Mercury Practice: Engage in clear communication. Practice swift thinking and expressive clarity.",
      },
      fr: {
        essence: "L'énergie mercurienne apporte communication, apprentissage et clarté intellectuelle. Un jour pour l'échange et la connexion.",
        recommendation: "Meilleur pour : écrire, apprendre, négocier et planifier avec soin.",
        practice: "☿️ Pratique mercurienne : Engagez la communication claire. Pratiquez la pensée rapide et la clarté expressive.",
      },
    },
    Venus: {
      en: {
        essence: "Venusian energy brings beauty, harmony, and attraction. A day for relationships and aesthetic refinement.",
        recommendation: "Best aligned with: reconciliation, beauty, and agreements made with clean intention.",
        practice: "♀️ Venus Practice: Cultivate beauty in your space and relationships. Practice grace and receptivity.",
      },
      fr: {
        essence: "L'énergie vénusienne apporte beauté, harmonie et attraction. Un jour pour les relations et le raffinement esthétique.",
        recommendation: "Meilleur pour : réconciliation, beauté, et accords avec une intention claire.",
        practice: "♀️ Pratique vénusienne : Cultivez la beauté dans votre espace et vos relations. Pratiquez la grâce et la réceptivité.",
      },
    },
    Mars: {
      en: {
        essence: "Martian energy brings action, courage, and dynamic force. A day for overcoming obstacles and bold movement.",
        recommendation: "Best aligned with: disciplined effort, training, and decisive completion — avoid haste and conflict.",
        practice: "♂️ Mars Practice: Channel courage into purposeful action. Practice strength with wisdom and restraint.",
      },
      fr: {
        essence: "L'énergie martienne apporte action, courage et force dynamique. Un jour pour surmonter les obstacles et le mouvement audacieux.",
        recommendation: "Meilleur pour : effort discipliné, entraînement et achèvement décisif — évitez la précipitation et le conflit.",
        practice: "♂️ Pratique martienne : Canalisez le courage en action intentionnelle. Pratiquez la force avec sagesse et retenue.",
      },
    },
    Jupiter: {
      en: {
        essence: "Jupiterian energy brings expansion, wisdom, and spiritual growth. A day for abundance and enlightenment.",
        recommendation: "Best aligned with: learning, wise counsel, generosity, and opening doors with good adab.",
        practice: "♃ Jupiter Practice: Expand your perspective. Practice generosity and seek higher understanding.",
      },
      fr: {
        essence: "L'énergie jupitérienne apporte expansion, sagesse et croissance spirituelle. Un jour pour l'abondance et l'illumination.",
        recommendation: "Meilleur pour : apprendre, conseil sage, générosité et ouverture avec bon adab.",
        practice: "♃ Pratique jupitérienne : Élargissez votre perspective. Pratiquez la générosité et cherchez la compréhension supérieure.",
      },
    },
    Saturn: {
      en: {
        essence: "Saturnian energy brings discipline, structure, and karmic lessons. A day for building lasting foundations.",
        recommendation: "Best aligned with: protection, tawbah, patience, study, and structured long-term work — not rushed beginnings.",
        practice: "♄ Saturn Practice: Practice discipline and patience. Build structures with careful attention and respect.",
      },
      fr: {
        essence: "L'énergie saturnienne apporte discipline, structure et leçons karmiques. Un jour pour construire des fondations durables.",
        recommendation: "Meilleur pour : protection, tawbah, patience, étude et travail structuré — pas de débuts précipités.",
        practice: "♄ Pratique saturnienne : Pratiquez la discipline et la patience. Construisez des structures avec soin et respect.",
      },
    },
  };
  
  const langKey = lang === 'ar' ? 'en' : lang; // Fallback to English for Arabic
  return guidance[planet]?.[langKey] || guidance[planet]?.['en'] || {
    essence: "Planetary energy shapes today's cosmic influence.",
    recommendation: "Use this day wisely for aligned endeavors.",
    practice: "⭐ Practice: Align your intentions with today's planetary nature.",
  };
}

export default function TodayDetailsCard({
  dayRuler,
  userRuler,
  dayElement,
  userElement,
  alignmentScore,
  elementalHarmonyScore,
  planetaryHarmonyScore,
  verdict,
  toneColor,
}: TodayDetailsCardProps) {
  const { language, t } = useLanguage();
  const lang = language as 'en' | 'fr' | 'ar';
  const [showGuidance, setShowGuidance] = useState(false);
  
  const planetaryGuidance = getPlanetaryGuidance(dayRuler, lang);

  return (
    <View style={styles.card}>
      <Text style={styles.sectionLabel}>{t('dailyEnergy.alignmentOverview.title')}</Text>
      <Text style={styles.scopeText}>{t('dailyEnergy.scope.day')}</Text>

      {typeof alignmentScore === 'number' && (
        <View style={styles.meterRow}>
          <View style={styles.meterTrack}>
            <View
              style={[
                styles.meterFill,
                {
                  width: `${Math.max(0, Math.min(100, alignmentScore))}%`,
                  backgroundColor: toneColor ?? styles.meterFill.backgroundColor,
                },
              ]}
            />
          </View>
          <Text style={styles.meterValue}>{alignmentScore}%</Text>
        </View>
      )}

      <View style={styles.detailsGrid}>
        {/* Day Ruler */}
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>{t('dailyEnergy.alignmentOverview.dayRulerLabel')}</Text>
          <View style={styles.detailValueContainer}>
            <Text style={styles.detailEmoji}>{getPlanetEmoji(dayRuler)}</Text>
            <View style={styles.detailValueText}>
              <Text style={styles.detailValue}>{dayRuler}</Text>
            </View>
          </View>
        </View>

        {/* Your Ruler */}
        {userRuler && userRuler !== dayRuler && (
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>{t('dailyEnergy.alignmentOverview.yourRulerLabel')}</Text>
            <View style={styles.detailValueContainer}>
              <Text style={styles.detailEmoji}>{getPlanetEmoji(userRuler)}</Text>
              <Text style={styles.detailValue}>{userRuler}</Text>
            </View>
          </View>
        )}

        {/* Elements */}
        {dayElement && userElement && (
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>{t('dailyEnergy.alignmentOverview.elementsLabel')}</Text>
            <View style={styles.detailValueContainer}>
              <Text style={styles.detailEmoji}>{getElementEmoji(userElement)}</Text>
              <Text style={styles.detailValue}>{t(`home.dailyGuidanceDetails.elements.${userElement}`)}</Text>
              <Text style={styles.detailSeparator}>•</Text>
              <Text style={styles.detailEmoji}>{getElementEmoji(dayElement)}</Text>
              <Text style={styles.detailValue}>{t(`home.dailyGuidanceDetails.elements.${dayElement}`)}</Text>
            </View>
          </View>
        )}
      </View>

      {(typeof elementalHarmonyScore === 'number' || typeof planetaryHarmonyScore === 'number') && (
        <View style={styles.factorRow}>
          {typeof elementalHarmonyScore === 'number' && (
            <View style={[styles.factorPill, toneColor ? { borderColor: `${toneColor}55` } : null]}>
              <Text style={styles.factorLabel}>{t('dailyEnergy.alignmentOverview.elementHarmony')}</Text>
              <Text style={styles.factorValue}>{elementalHarmonyScore}%</Text>
            </View>
          )}
          {typeof planetaryHarmonyScore === 'number' && (
            <View style={[styles.factorPill, toneColor ? { borderColor: `${toneColor}55` } : null]}>
              <Text style={styles.factorLabel}>{t('dailyEnergy.alignmentOverview.planetHarmony')}</Text>
              <Text style={styles.factorValue}>{planetaryHarmonyScore}%</Text>
            </View>
          )}
        </View>
      )}

      {!!verdict && <Text style={styles.verdictText}>{verdict}</Text>}
      
      {/* Ilm il Nujum Guidance Toggle */}
      <TouchableOpacity 
        style={styles.guidanceToggle}
        onPress={() => setShowGuidance(!showGuidance)}
      >
        <View style={styles.toggleHeader}>
          <Ionicons 
            name={showGuidance ? 'chevron-down' : 'chevron-forward'} 
            size={16} 
            color="rgba(255, 255, 255, 0.6)"
            style={styles.toggleIcon}
          />
          <Text style={styles.guidanceToggleText}>
            ✨ {t('dailyEnergy.alignmentOverview.ilmGuidanceToggle')}
          </Text>
        </View>
      </TouchableOpacity>
      
      {showGuidance && (
        <View style={styles.guidanceBox}>
          <View style={styles.guidanceSection}>
            <Text style={styles.guidanceSectionLabel}>
              {t('dailyEnergy.alignmentOverview.guidance.essenceLabel')}
            </Text>
            <Text style={styles.guidanceText}>{planetaryGuidance.essence}</Text>
          </View>
          
          <View style={styles.guidanceSection}>
            <Text style={styles.guidanceSectionLabel}>
              {t('dailyEnergy.alignmentOverview.guidance.recommendationsLabel')}
            </Text>
            <Text style={styles.guidanceText}>{planetaryGuidance.recommendation}</Text>
          </View>
          
          <View style={[styles.guidanceSection, styles.practiceSection]}>
            <Text style={styles.guidanceSectionLabel}>
              {t('dailyEnergy.alignmentOverview.guidance.practiceLabel')}
            </Text>
            <Text style={styles.guidanceText}>{planetaryGuidance.practice}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 12,
  },

  sectionLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },

  scopeText: {
    color: 'rgba(255, 255, 255, 0.55)',
    fontSize: 12,
    fontWeight: '600',
    marginTop: -10,
    marginBottom: 16,
  },

  meterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  meterTrack: {
    flex: 1,
    height: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.10)',
    overflow: 'hidden',
  },
  meterFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#10b981',
  },
  meterValue: {
    color: DarkTheme.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    minWidth: 56,
    textAlign: 'right',
  },

  detailsGrid: {
    gap: 16,
  },

  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  detailLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontWeight: '500',
  },

  detailValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  detailSeparator: {
    color: 'rgba(255, 255, 255, 0.35)',
    marginHorizontal: 6,
  },

  detailEmoji: {
    fontSize: 20,
  },

  detailValueText: {
    alignItems: 'flex-end',
  },

  detailValue: {
    color: DarkTheme.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },

  detailPower: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
  },

  qualityValue: {
    color: '#3B82F6',
  },

  factorRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  factorPill: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  factorLabel: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 11,
    marginBottom: 4,
  },
  factorValue: {
    color: DarkTheme.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },

  verdictText: {
    marginTop: 12,
    color: 'rgba(255, 255, 255, 0.82)',
    fontSize: 14,
    lineHeight: 20,
  },
  
  // Guidance Styles
  guidanceToggle: {
    marginTop: 16,
    paddingVertical: 12,
  },
  
  toggleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  
  toggleIcon: {
    marginRight: 4,
  },
  
  guidanceToggleText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontWeight: '600',
  },
  
  guidanceBox: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    gap: 16,
  },
  
  guidanceSection: {
    backgroundColor: 'rgba(139, 92, 246, 0.08)',
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: 'rgba(139, 92, 246, 0.5)',
  },
  
  practiceSection: {
    borderLeftColor: 'rgba(16, 185, 129, 0.5)',
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
  },
  
  guidanceSectionLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  
  guidanceText: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 13,
    lineHeight: 18,
  },
});
