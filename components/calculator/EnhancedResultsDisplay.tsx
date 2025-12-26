/**
 * Enhanced Results Display with Type-Specific Sections
 * Reorganized with jump navigation
 */

import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { EnhancedCalculationResult } from '../../types/calculator-enhanced';
import { CoreResultsGrid } from '../results/CoreResultsGrid';
import { AdvancedMethods } from './AdvancedMethods';
import { BurjSign } from './BurjSign';
import { ElementalComposition } from './ElementalComposition';
import { NumericalEssence } from './NumericalEssence';

// Type-specific result components
import {
    DhikrResultSection,
    GeneralResultSection,
    LineageResultSection,
    NameResultSection,
    PhraseResultSection,
    QuranResultSection,
} from './results';

interface EnhancedResultsDisplayProps {
  result: EnhancedCalculationResult;
}

export const EnhancedResultsDisplay: React.FC<EnhancedResultsDisplayProps> = ({ result }) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [sectionOffsets, setSectionOffsets] = useState<{ [key: string]: number }>({});
  
  const scrollToSection = (section: string) => {
    if (sectionOffsets[section] !== undefined) {
      scrollViewRef.current?.scrollTo({ y: sectionOffsets[section], animated: true });
    }
  };
  
  const handleSectionLayout = (section: string, y: number) => {
    setSectionOffsets(prev => ({ ...prev, [section]: y }));
  };
  
  return (
    <View style={styles.container}>
      {/* Jump Navigation */}
      <View style={styles.jumpNav}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.jumpNavContent}>
          <TouchableOpacity style={styles.jumpButton} onPress={() => scrollToSection('core')}>
            <Text style={styles.jumpText}>Core</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.jumpButton} onPress={() => scrollToSection('insights')}>
            <Text style={styles.jumpText}>Insights</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.jumpButton} onPress={() => scrollToSection('elements')}>
            <Text style={styles.jumpText}>Elements</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.jumpButton} onPress={() => scrollToSection('advanced')}>
            <Text style={styles.jumpText}>Advanced</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      
      <ScrollView ref={scrollViewRef} style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Header Card */}
        <View style={styles.headerCard} onLayout={(e) => handleSectionLayout('header', e.nativeEvent.layout.y)}>
          <LinearGradient
            colors={['#1e293b', '#334155']}
            style={styles.headerGradient}
          >
            <Text style={styles.inputText}>{result.input.raw}</Text>
            {(result.input.calculatedFrom !== undefined || result.input.calculationNote || result.input.warning) && (
              <View style={styles.calculationMeta}>
                <Text style={styles.metaLabel}>Calculated from</Text>
                <Text style={styles.metaValue}>
                  {result.input.calculatedFrom && result.input.calculatedFrom.length > 0
                    ? result.input.calculatedFrom
                    : '—'}
                </Text>
                {result.input.calculationNote ? (
                  <Text style={styles.metaNote}>{result.input.calculationNote}</Text>
                ) : null}
                {result.input.warning ? (
                  <Text style={styles.metaWarning}>{result.input.warning}</Text>
                ) : null}
              </View>
            )}
            <View style={styles.badges}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{result.system === 'maghribi' ? '🌙 Maghribi' : '☀️ Mashriqi'}</Text>
              </View>
              <View style={[styles.badge, styles.typeBadge]}>
                <Text style={styles.badgeText}>{getTypeLabel(result.type)}</Text>
              </View>
            </View>
          </LinearGradient>
        </View>
        
        {/* Core Results Section */}
        <View onLayout={(e) => handleSectionLayout('core', e.nativeEvent.layout.y)}>
          <Text style={styles.sectionTitle}>📊 Core Results</Text>
          <CoreResultsGrid
            style={styles.coreGrid}
            results={{
              kabirTotal: result.core?.kabir,
              saghirRoot: result.core?.saghir,
              hadadMod4: result.core?.hadadMod4,
              burjName: result.core?.burj,
            }}
          />
          <NumericalEssence saghir={result.core.saghir} element={result.core.element} />
          <BurjSign kabir={result.core.kabir} />
        </View>
        
        {/* Type-Specific Insights Section */}
        <View onLayout={(e) => handleSectionLayout('insights', e.nativeEvent.layout.y)}>
          <Text style={styles.sectionTitle}>✨ {getInsightsTitle(result.type)}</Text>
          {renderTypeSpecificInsights(result)}
        </View>
        
        {/* Elemental Composition Section */}
        <View onLayout={(e) => handleSectionLayout('elements', e.nativeEvent.layout.y)}>
          <Text style={styles.sectionTitle}>🔮 Elemental Analysis</Text>
          <ElementalComposition analytics={result.analytics} />
        </View>
        
        {/* Advanced Methods Section */}
        <View onLayout={(e) => handleSectionLayout('advanced', e.nativeEvent.layout.y)}>
          <Text style={styles.sectionTitle}>🔬 Advanced Methods</Text>
          <AdvancedMethods 
            kabir={result.core.kabir}
            saghir={result.core.saghir}
          />
        </View>
        
        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            ℹ️ These insights are for spiritual reflection only. Not a substitute for qualified religious guidance.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

function getTypeLabel(type: string): string {
  const labels: { [key: string]: string } = {
    name: '👤 Name',
    lineage: '🌳 Lineage',
    phrase: '📝 Phrase',
    quran: '📖 Qur\'an',
    dhikr: '🤲 Dhikr',
    general: '🔤 General',
  };
  return labels[type] || type;
}

function getInsightsTitle(type: string): string {
  const titles: { [key: string]: string } = {
    name: 'Name Insights',
    lineage: 'Lineage Insights',
    phrase: 'Phrase Analysis',
    quran: 'Qur\'an Resonance',
    dhikr: 'Dhikr Practice',
    general: 'General Insights',
  };
  return titles[type] || 'Insights';
}

function renderTypeSpecificInsights(result: EnhancedCalculationResult) {
  switch (result.type) {
    case 'name':
      return result.nameInsights ? <NameResultSection insights={result.nameInsights} /> : null;
    case 'lineage':
      return result.lineageInsights ? <LineageResultSection insights={result.lineageInsights} /> : null;
    case 'phrase':
      return result.phraseInsights ? <PhraseResultSection insights={result.phraseInsights} /> : null;
    case 'quran':
      return result.quranInsights ? <QuranResultSection insights={result.quranInsights} /> : null;
    case 'dhikr':
      return result.dhikrInsights ? <DhikrResultSection insights={result.dhikrInsights} /> : null;
    case 'general':
      return result.generalInsights ? <GeneralResultSection insights={result.generalInsights} /> : null;
    default:
      return null;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  
  jumpNav: {
    backgroundColor: '#1e293b',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  
  jumpNavContent: {
    padding: 12,
    gap: 8,
  },
  
  jumpButton: {
    backgroundColor: '#334155',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  
  jumpText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#cbd5e1',
  },
  
  scrollView: {
    flex: 1,
  },
  
  content: {
    padding: 20,
    gap: 24,
  },

  coreGrid: {
    marginTop: 16,
    marginBottom: 16,
  },
  
  headerCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#334155',
  },
  
  headerGradient: {
    padding: 20,
    gap: 12,
  },
  
  inputText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#f1f5f9',
    textAlign: 'center',
  },
  
  badges: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },

  calculationMeta: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    borderWidth: 1,
    borderColor: '#3b82f6',
    gap: 4,
  },

  metaLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#93c5fd',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  metaValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f8fafc',
    textAlign: 'center',
  },

  metaNote: {
    fontSize: 12,
    color: '#bae6fd',
    textAlign: 'center',
  },

  metaWarning: {
    fontSize: 12,
    color: '#fbbf24',
    textAlign: 'center',
  },
  
  badge: {
    backgroundColor: '#334155',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  
  typeBadge: {
    backgroundColor: '#6366f1',
  },
  
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#f1f5f9',
    marginBottom: 12,
  },
  
  disclaimer: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f59e0b',
  },
  
  disclaimerText: {
    fontSize: 13,
    color: '#fbbf24',
    textAlign: 'center',
    lineHeight: 20,
  },
});
