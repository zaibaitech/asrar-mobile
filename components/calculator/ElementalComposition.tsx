import { useLanguage } from '@/contexts/LanguageContext';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ElementalAnalytics } from '../../types/calculator-enhanced';

interface ElementalCompositionProps {
  analytics: ElementalAnalytics;
}

export const ElementalComposition: React.FC<ElementalCompositionProps> = ({ analytics }) => {
  const { t } = useLanguage();
  const elementCounts: Record<'fire' | 'water' | 'air' | 'earth', number> = {
    fire: 0,
    water: 0,
    air: 0,
    earth: 0,
  };

  let totalLetters = 0;
  analytics.letterFreq.forEach(({ element, count }) => {
    elementCounts[element] += count;
    totalLetters += count;
  });

  const { elementPercents, dominantElement, weakElement, balanceScore } = analytics;
  
  // Harmonizing recommendation
  const getHarmonizingAdvice = (): string => {
    if (balanceScore >= 75) {
      return 'Your elemental balance is harmonious. Maintain equilibrium through balanced practices.';
    }

    if (weakElement === 'water' && elementPercents.water === 0) {
      return 'Your Water element (0%) could use more attention. Try: Cultivate emotional depth, intuition, and flow. Practice dhikr near water or during wuḍū.';
    }
    if (weakElement === 'fire' && elementPercents.fire === 0) {
      return 'Your Fire element (0%) could use more attention. Try: Engage passionate spiritual practices. Dhikr at dawn or sunrise to kindle inner light.';
    }
    if (weakElement === 'air' && elementPercents.air === 0) {
      return 'Your Air element (0%) could use more attention. Try: Focus on knowledge and communication. Practice dhikr with breath awareness (habs al-nafas).';
    }
    if (weakElement === 'earth' && elementPercents.earth === 0) {
      return 'Your Earth element (0%) could use more attention. Try: Ground yourself through patience and gratitude. Practice dhikr while in sujūd or standing on earth.';
    }

    return `Balance your ${dominantElement} dominance by incorporating practices from other elements.`;
  };

  const elements = [
    { name: t('calculator.results.elements.fire'), key: 'fire', color: '#ef4444', emoji: '🔥', percentage: elementPercents.fire, count: elementCounts.fire },
    { name: t('calculator.results.elements.water'), key: 'water', color: '#3b82f6', emoji: '💧', percentage: elementPercents.water, count: elementCounts.water },
    { name: t('calculator.results.elements.air'), key: 'air', color: '#06b6d4', emoji: '🌬️', percentage: elementPercents.air, count: elementCounts.air },
    { name: t('calculator.results.elements.earth'), key: 'earth', color: '#84cc16', emoji: '🌳', percentage: elementPercents.earth, count: elementCounts.earth },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>🔮 Elemental Composition</Text>
      
      {/* Balance Score */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Elemental Balance Score</Text>
        <View style={styles.balanceBar}>
          <View style={[styles.balanceFill, { width: `${balanceScore}%` }]} />
          <Text style={styles.balanceText}>{balanceScore}%</Text>
        </View>
        <Text style={styles.balanceSubtext}>
          {balanceScore >= 75 ? 'Harmonious' : balanceScore >= 50 ? 'Moderate' : 'See recommendations'}
        </Text>
      </View>
      
      {/* Element Bars */}
      {elements.map((element) => (
        <View key={element.key} style={styles.elementRow}>
          <View style={styles.elementInfo}>
            <Text style={styles.elementEmoji}>{element.emoji}</Text>
            <Text style={styles.elementName}>{element.name}</Text>
          </View>
          
          <View style={styles.barContainer}>
            <View 
              style={[
                styles.bar, 
                { width: `${element.percentage}%`, backgroundColor: element.color }
              ]} 
            />
            <Text style={styles.percentageText}>
              {element.count} letter{element.count !== 1 ? 's' : ''} ({element.percentage}%)
            </Text>
          </View>
        </View>
      ))}
      
      {/* Harmonizing Recommendation */}
      {balanceScore < 75 && (
        <View style={styles.recommendationCard}>
          <Text style={styles.recommendationTitle}>💡 Harmonizing Recommendation</Text>
          <Text style={styles.recommendationText}>{getHarmonizingAdvice()}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 16,
  },
  
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: 4,
  },
  
  // Balance Card
  balanceCard: {
    backgroundColor: '#0f172a',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  balanceLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94a3b8',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  balanceBar: {
    height: 32,
    backgroundColor: '#1e293b',
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center',
    marginBottom: 8,
  },
  balanceFill: {
    position: 'absolute',
    height: '100%',
    backgroundColor: '#f59e0b',
    borderRadius: 8,
  },
  balanceText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f1f5f9',
    textAlign: 'center',
    zIndex: 1,
  },
  balanceSubtext: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  
  // Element Rows
  elementRow: {
    gap: 10,
  },
  elementInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  elementEmoji: {
    fontSize: 18,
  },
  elementName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f1f5f9',
  },
  barContainer: {
    height: 28,
    backgroundColor: '#0f172a',
    borderRadius: 6,
    overflow: 'hidden',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  bar: {
    position: 'absolute',
    height: '100%',
    borderRadius: 6,
  },
  percentageText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#f1f5f9',
    zIndex: 1,
  },
  
  // Recommendation Card
  recommendationCard: {
    backgroundColor: '#fef3c7',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#f59e0b',
    marginTop: 4,
  },
  recommendationTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#78350f',
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 13,
    color: '#78350f',
    lineHeight: 18,
  },
});
