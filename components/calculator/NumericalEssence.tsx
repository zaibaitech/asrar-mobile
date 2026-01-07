import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ElementType } from '../../utils/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface NumericalEssenceProps {
  saghir: number;
  element: ElementType;
}

export const NumericalEssence: React.FC<NumericalEssenceProps> = ({ saghir, element }) => {
  const { t } = useLanguage();
  // Core number meanings (1-9) from numerology and Islamic tradition
  const numberMeanings: Record<number, {
    title: string;
    arabic: string;
    description: string;
    qualities: string[];
  }> = {
    1: {
      title: 'The Leader',
      arabic: 'الواحد',
      description: 'Leadership, independence, pioneering spirit. The number of divine unity (Tawḥīd).',
      qualities: ['Initiative', 'Confidence', 'Innovation', 'Self-reliance'],
    },
    2: {
      title: 'The Harmonizer',
      arabic: 'الاثنين',
      description: 'Balance, partnership, diplomacy. Represents duality seeking unity.',
      qualities: ['Cooperation', 'Sensitivity', 'Patience', 'Mediation'],
    },
    3: {
      title: 'The Creator',
      arabic: 'الثلاثة',
      description: 'Creativity, expression, joy. Sacred trinity of body, mind, and spirit.',
      qualities: ['Creativity', 'Communication', 'Optimism', 'Self-expression'],
    },
    4: {
      title: 'The Builder',
      arabic: 'الأربعة',
      description: 'Stability, foundation, discipline. Four elements, four sacred months.',
      qualities: ['Organization', 'Practicality', 'Determination', 'Trustworthiness'],
    },
    5: {
      title: 'The Adventurer',
      arabic: 'الخمسة',
      description: 'Freedom, change, versatility. Five pillars of Islam, five daily prayers.',
      qualities: ['Adaptability', 'Curiosity', 'Freedom', 'Resourcefulness'],
    },
    6: {
      title: 'The Nurturer',
      arabic: 'الستة',
      description: 'Love, responsibility, harmony. Six days of creation.',
      qualities: ['Compassion', 'Service', 'Responsibility', 'Balance'],
    },
    7: {
      title: 'The Seeker',
      arabic: 'السبعة',
      description: 'Wisdom, spirituality, introspection. Seven heavens, seven earths.',
      qualities: ['Spiritual depth', 'Analysis', 'Contemplation', 'Mysticism'],
    },
    8: {
      title: 'The Achiever',
      arabic: 'الثمانية',
      description: 'Power, abundance, manifestation. Eight angels carrying the Throne.',
      qualities: ['Ambition', 'Authority', 'Material success', 'Karma'],
    },
    9: {
      title: 'The Humanitarian',
      arabic: 'التسعة',
      description: 'Completion, universal love, enlightenment. The number of completion and perfection.',
      qualities: ['Compassion', 'Service to others', 'Wisdom', 'Completion'],
    },
  };
  
  // Element descriptions and qualities
  const elementQualities: Record<ElementType, {
    emoji: string;
    color: string;
    quality: string;
    spiritual: string;
  }> = {
    fire: {
      emoji: '🔥',
      color: '#ef4444',
      quality: 'Passionate, energetic, transformative',
      spiritual: 'Your soul carries the divine spark of transformation and purification',
    },
    water: {
      emoji: '💧',
      color: '#3b82f6',
      quality: 'Flowing, adaptive, healing',
      spiritual: 'Your essence flows with divine mercy and emotional depth',
    },
    air: {
      emoji: '🌬️',
      color: '#06b6d4',
      quality: 'Intellectual, communicative, swift',
      spiritual: 'Your spirit moves with divine inspiration and clarity of thought',
    },
    earth: {
      emoji: '🌳',
      color: '#84cc16',
      quality: 'Grounding, stable, nurturing',
      spiritual: 'Your being roots in divine stability and patient perseverance',
    },
  };
  
  const meaning = numberMeanings[saghir] || numberMeanings[9];
  const elementData = elementQualities[element];

  return (
    <View style={[styles.container, { borderColor: elementData.color }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>💫</Text>
        <Text style={styles.headerTitle}>{t('calculator.results.essence.yourNumericalEssence')}</Text>
      </View>
      
      {/* Core Number */}
      <View style={styles.numberSection}>
        <Text style={styles.label}>{t('calculator.results.essence.coreNumberMeaning')}</Text>
        <View style={styles.numberCard}>
          <Text style={styles.numberValue}>{saghir}</Text>
          <View style={styles.numberInfo}>
            <Text style={styles.numberTitle}>{meaning.title}</Text>
            <Text style={styles.numberArabic}>{meaning.arabic}</Text>
          </View>
        </View>
        <Text style={styles.description}>{meaning.description}</Text>
        
        {/* Qualities */}
        <View style={styles.qualitiesGrid}>
          {meaning.qualities.map((quality, index) => (
            <View key={index} style={styles.qualityBadge}>
              <Text style={styles.qualityText}>{quality}</Text>
            </View>
          ))}
        </View>
      </View>
      
      {/* Dominant Element */}
      <View style={[styles.elementSection, { backgroundColor: elementData.color + '15' }]}>
        <View style={styles.elementHeader}>
          <Text style={styles.elementEmoji}>{elementData.emoji}</Text>
          <Text style={styles.elementTitle}>
            {t('calculator.results.essence.dominantElement')}: {t(`calculator.results.elements.${element}`).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.elementQuality}>{elementData.quality}</Text>
        <Text style={styles.elementSpiritual}>{elementData.spiritual}</Text>
      </View>
      
      {/* Guidance */}
      <View style={styles.guidanceCard}>
        <Text style={styles.guidanceTitle}>✨ {t('calculator.results.essence.spiritualGuidance')}</Text>
        <Text style={styles.guidanceText}>
          Your path combines the essence of <Text style={styles.highlight}>{meaning.title}</Text> with the power of <Text style={styles.highlight}>{t(`calculator.results.elements.${element}`)}</Text>. 
          {'\n\n'}
          Embrace your natural {meaning.qualities[0].toLowerCase()} while balancing it with the {elementData.quality.split(',')[0]} nature of your element. 
          Seek harmony between inner contemplation and outward expression.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e293b',
    padding: 24,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#6366f1',
    gap: 20,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerEmoji: {
    fontSize: 28,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#f1f5f9',
  },
  
  // Number Section
  numberSection: {
    gap: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  numberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#0f172a',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#6366f1',
  },
  numberValue: {
    fontSize: 48,
    fontWeight: '900',
    color: '#a5b4fc',
    width: 70,
    textAlign: 'center',
  },
  numberInfo: {
    flex: 1,
  },
  numberTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: 4,
  },
  numberArabic: {
    fontSize: 18,
    color: '#cbd5e1',
  },
  description: {
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  
  // Qualities
  qualitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  qualityBadge: {
    backgroundColor: '#312e81',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#6366f1',
  },
  qualityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#c7d2fe',
  },
  
  // Element Section
  elementSection: {
    padding: 16,
    borderRadius: 14,
    gap: 10,
  },
  elementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  elementEmoji: {
    fontSize: 24,
  },
  elementTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f1f5f9',
  },
  elementQuality: {
    fontSize: 14,
    fontWeight: '600',
    color: '#cbd5e1',
    lineHeight: 20,
  },
  elementSpiritual: {
    fontSize: 13,
    color: '#94a3b8',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  
  // Guidance
  guidanceCard: {
    backgroundColor: '#0f172a',
    padding: 16,
    borderRadius: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  guidanceTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#f1f5f9',
  },
  guidanceText: {
    fontSize: 13,
    color: '#cbd5e1',
    lineHeight: 19,
  },
  highlight: {
    fontWeight: '700',
    color: '#a5b4fc',
  },
});
