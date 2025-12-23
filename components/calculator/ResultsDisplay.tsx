import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { CalculatorColors } from '../../constants/CalculatorColors';
import { CalculationResult } from '../../types/calculator';
import { AdvancedMethods } from './AdvancedMethods';
import { BurjSign } from './BurjSign';
import { DhikrRecommendation } from './DhikrRecommendation';
import { DivineNameConnection } from './DivineNameConnection';
import { ElementalComposition } from './ElementalComposition';
import { NumericalEssence } from './NumericalEssence';
import { PlanetarySignature } from './PlanetarySignature';
import { SacredResonance } from './SacredResonance';

interface ResultsDisplayProps {
  result: CalculationResult;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result }) => {
  const colors = CalculatorColors;
  
  // Element-specific border colors (minimal approach)
  const elementColors: Record<string, { border: string; emoji: string }> = {
    fire: { border: '#ef4444', emoji: '🔥' },
    water: { border: '#3b82f6', emoji: '🌊' },
    air: { border: '#06b6d4', emoji: '🌬️' },
    earth: { border: '#84cc16', emoji: '🌳' },
  };
  
  const elementStyle = elementColors[result.element] || elementColors.earth;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Input Display Card */}
      <View style={styles.headerCard}>
        <Text style={styles.inputText}>{result.input}</Text>
        <View style={styles.systemBadge}>
          <Text style={styles.systemText}>{result.system.toUpperCase()}</Text>
        </View>
      </View>

      {/* Core Results Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Core Results</Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Kabīr</Text>
            <Text style={styles.statValue}>{result.kabir}</Text>
            <Text style={styles.statSubtext}>Grand Total</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Ṣaghīr</Text>
            <Text style={styles.statValue}>{result.saghir}</Text>
            <Text style={styles.statSubtext}>Digital Root</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Ḥadath</Text>
            <Text style={styles.statValue}>{result.hadath}</Text>
            <Text style={styles.statSubtext}>Mod 4</Text>
          </View>
          {result.burj && (
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Burj</Text>
              <Text style={styles.statValueSmall}>{result.burj}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Element Card with colored border only */}
      <View style={[styles.elementCard, { borderColor: elementStyle.border }]}>
        <View style={styles.elementHeader}>
          <Text style={styles.elementEmoji}>{elementStyle.emoji}</Text>
          <View>
            <Text style={styles.elementTitle}>Element</Text>
            <Text style={[styles.elementName, { color: elementStyle.border }]}>{result.element.toUpperCase()}</Text>
          </View>
        </View>
        <Text style={styles.elementDescription}>
          {result.element === 'fire' && 'Dynamic, passionate, transformative energy'}
          {result.element === 'water' && 'Flowing, emotional, intuitive essence'}
          {result.element === 'air' && 'Intellectual, communicative, swift nature'}
          {result.element === 'earth' && 'Grounded, stable, nurturing foundation'}
        </Text>
      </View>

      {/* Rūḥ Ḥadad */}
      {result.ruh && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🌙 Rūḥ Ḥadad (Spirit)</Text>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Value:</Text>
            <Text style={styles.resultValue}>{result.ruh.value}</Text>
          </View>
          <Text style={styles.cardDescription}>{result.ruh.description}</Text>
        </View>
      )}

      {/* Sacred Resonance */}
      {result.sacred && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>⭐ Sacred Resonance</Text>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Nearest Sacred:</Text>
            <Text style={styles.resultValue}>{result.sacred.nearest}</Text>
          </View>
          <Text style={styles.cardDescription}>{result.sacred.description}</Text>
        </View>
      )}

      {/* Um Ḥadad */}
      {result.um && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🤰 Um Ḥadad (Mother)</Text>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Combined Total:</Text>
            <Text style={styles.resultValue}>{result.um.total}</Text>
          </View>
        </View>
      )}

      {/* Advanced Calculation Methods - Phase 1 */}
      <AdvancedMethods kabir={result.kabir} saghir={result.saghir} />

      {/* Elemental Composition - Phase 2 */}
      <ElementalComposition input={result.input} />

      {/* Sacred Number Resonance - Phase 3 */}
      <SacredResonance kabir={result.kabir} saghir={result.saghir} />

      {/* Your Numerical Essence - Phase 4 */}
      <NumericalEssence saghir={result.saghir} element={result.element} />

      {/* Divine Name Connection - Phase 5 */}
      <DivineNameConnection kabir={result.kabir} />

      {/* Burj (Zodiac Sign) - Phase 6 */}
      <BurjSign kabir={result.kabir} />

      {/* Planetary Signature - Phase 7 */}
      <PlanetarySignature kabir={result.kabir} />

      {/* Dhikr Recommendation - Phase 8 */}
      <DhikrRecommendation kabir={result.kabir} saghir={result.saghir} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { padding: 16, gap: 16, paddingBottom: 32 },
  
  // Header Card
  headerCard: {
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  inputText: { 
    fontSize: 22, 
    fontWeight: '700', 
    textAlign: 'center',
    color: '#f1f5f9',
    marginBottom: 12,
  },
  systemBadge: {
    alignSelf: 'center',
    backgroundColor: '#334155',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#6366f1',
  },
  systemText: { 
    fontSize: 11, 
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 1,
  },
  
  // Card
  card: {
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: 16,
  },
  cardDescription: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#94a3b8',
    lineHeight: 20,
    marginTop: 8,
  },
  
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '900',
    color: '#f1f5f9',
    marginBottom: 4,
  },
  statValueSmall: {
    fontSize: 15,
    fontWeight: '700',
    color: '#f1f5f9',
    textAlign: 'center',
  },
  statSubtext: {
    fontSize: 10,
    color: '#64748b',
  },
  
  // Element Card
  elementCard: {
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
  },
  elementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 12,
  },
  elementEmoji: {
    fontSize: 40,
  },
  elementTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  elementName: {
    fontSize: 24,
    fontWeight: '900',
  },
  elementDescription: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#94a3b8',
    lineHeight: 20,
  },
  
  // Result Row
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultLabel: {
    fontSize: 15,
    color: '#94a3b8',
  },
  resultValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f1f5f9',
  },
});
