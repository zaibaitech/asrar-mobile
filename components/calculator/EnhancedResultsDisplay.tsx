/**
 * Enhanced Results Display with Type-Specific Sections
 * Reorganized with jump navigation
 */

import { useLanguage } from '@/contexts/LanguageContext';
import { useProfile } from '@/contexts/ProfileContext';
import { enhanceCalculatorWithAI, isAIAvailable, loadAISettings } from '@/services/AIReflectionService';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { EnhancedCalculationResult } from '../../types/calculator-enhanced';
import { AIBadge } from '../divine-timing/AIBadge';
import { CoreResultsGrid } from '../results/CoreResultsGrid';
import { PremiumSection } from '../subscription/PremiumSection';
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
  const { t } = useLanguage();
  const scrollViewRef = useRef<ScrollView>(null);
  const [sectionOffsets, setSectionOffsets] = useState<{ [key: string]: number }>({});
  
  // AI enhancement state
  const [aiAvailable, setAiAvailable] = useState(false);
  const [aiEnhanced, setAiEnhanced] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [enhancedNumerical, setEnhancedNumerical] = useState('');
  const [enhancedElement, setEnhancedElement] = useState('');
  const [enhancedBurj, setEnhancedBurj] = useState('');
  const [enhancedTypeInsight, setEnhancedTypeInsight] = useState('');
  const [personalizedInsight, setPersonalizedInsight] = useState('');
  
  const { profile } = useProfile();
  
  // Check if AI is available on mount
  useEffect(() => {
    checkAIAvailability();
  }, []);
  
  const checkAIAvailability = async () => {
    const available = await isAIAvailable();
    setAiAvailable(available);
  };
  
  const handleEnhanceWithAI = async () => {
    if (!aiAvailable || aiEnhanced || aiLoading) return;
    
    setAiLoading(true);
    
    try {
      const settings = await loadAISettings();
      
      // Build context based on calculation type
      const context: any = {};
      if (result.type === 'lineage' && result.lineageInsights) {
        context.yourName = result.input.sourceMeta?.yourName;
        context.motherName = result.input.sourceMeta?.motherName;
      } else if (result.type === 'quran' && result.quranInsights) {
        context.surahName = result.input.sourceMeta?.surahName;
        context.ayahNumber = result.input.sourceMeta?.ayahNumber;
      } else if (result.type === 'dhikr' && result.dhikrInsights) {
        context.divineName = result.input.sourceMeta?.divineName;
      }
      
      const response = await enhanceCalculatorWithAI({
        calculationType: result.type,
        inputText: result.input.raw,
        kabir: result.core.kabir,
        saghir: result.core.saghir,
        element: result.core.element,
        burj: result.core.burj,
        userElement: profile?.derived?.element,
        userBurj: profile?.derived?.burj,
        context: Object.keys(context).length > 0 ? context : undefined,
        tone: settings.tone,
        language: 'en',
      });
      
      if (response.aiAssisted) {
        setEnhancedNumerical(response.enhancedNumericalExplanation);
        setEnhancedElement(response.enhancedElementExplanation);
        setEnhancedBurj(response.enhancedBurjExplanation);
        setEnhancedTypeInsight(response.enhancedTypeInsight || '');
        setPersonalizedInsight(response.personalizedInsight || '');
        setAiEnhanced(true);
      }
    } catch (error) {
      // Silent fallback - do nothing
    } finally {
      setAiLoading(false);
    }
  };
  
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
            <Text style={styles.jumpText}>{t('calculator.results.tabs.core')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.jumpButton} onPress={() => scrollToSection('insights')}>
            <Text style={styles.jumpText}>{t('calculator.results.tabs.insights')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.jumpButton} onPress={() => scrollToSection('elements')}>
            <Text style={styles.jumpText}>{t('calculator.results.tabs.elements')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.jumpButton} onPress={() => scrollToSection('advanced')}>
            <Text style={styles.jumpText}>{t('calculator.results.tabs.advanced')}</Text>
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
                <Text style={styles.metaLabel}>{t('calculator.results.labels.calculatedFrom')}</Text>
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
                <Text style={styles.badgeText}>{result.system === 'maghribi' ? `🌙 ${t('calculator.results.badges.maghribi')}` : `☀️ ${t('calculator.results.badges.mashriqi')}`}</Text>
              </View>
              <View style={[styles.badge, styles.typeBadge]}>
                <Text style={styles.badgeText}>{getTypeLabel(result.type, t)}</Text>
              </View>
            </View>
          </LinearGradient>
        </View>
        
        {/* Core Results Section */}
        <View onLayout={(e) => handleSectionLayout('core', e.nativeEvent.layout.y)}>
          <Text style={styles.sectionTitle}>📊 {t('calculator.results.sections.coreResults')}</Text>
          <CoreResultsGrid
            t={t}
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
        
        {/* Premium Section: AI Enhancement + Insights + Elemental + Advanced */}
        <PremiumSection
          featureId="advancedCalculator"
          title={t('premiumSections.deepNumerologicalAnalysis.title')}
          description={t('premiumSections.deepNumerologicalAnalysis.description')}
          icon="🔮"
        >
          {/* AI Enhancement Button */}
          {aiAvailable && !aiEnhanced && (
            <TouchableOpacity 
              onPress={handleEnhanceWithAI}
              activeOpacity={0.8}
              disabled={aiLoading}
            >
              <LinearGradient
                colors={['#6366f1', '#8b5cf6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.aiEnhanceButton}
              >
                {aiLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Ionicons name="sparkles" size={18} color="#fff" />
              )}
              <Text style={styles.aiEnhanceButtonText}>
                {aiLoading ? 'Enhancing...' : '✨ Personalize Explanation'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
        
        {/* AI Enhanced Explanations */}
        {aiEnhanced && enhancedNumerical && (
          <View style={styles.aiEnhancedCard}>
            <View style={styles.enhancedHeader}>
              <Ionicons name="calculator" size={20} color="#6366f1" />
              <Text style={styles.enhancedTitle}>✨ Enhanced Numerical Insight</Text>
            </View>
            <Text style={styles.enhancedText}>{enhancedNumerical}</Text>
            <View style={{ alignSelf: 'flex-start', marginTop: 8 }}><AIBadge show={true} /></View>
          </View>
        )}
        
        {aiEnhanced && enhancedElement && (
          <View style={styles.aiEnhancedCard}>
            <View style={styles.enhancedHeader}>
              <Ionicons name="flame" size={20} color="#6366f1" />
              <Text style={styles.enhancedTitle}>✨ Enhanced Element Insight</Text>
            </View>
            <Text style={styles.enhancedText}>{enhancedElement}</Text>
            <View style={{ alignSelf: 'flex-start', marginTop: 8 }}><AIBadge show={true} /></View>
          </View>
        )}
        
        {aiEnhanced && enhancedBurj && (
          <View style={styles.aiEnhancedCard}>
            <View style={styles.enhancedHeader}>
              <Ionicons name="planet" size={20} color="#6366f1" />
              <Text style={styles.enhancedTitle}>✨ Enhanced Burj Insight</Text>
            </View>
            <Text style={styles.enhancedText}>{enhancedBurj}</Text>
            <View style={{ alignSelf: 'flex-start', marginTop: 8 }}><AIBadge show={true} /></View>
          </View>
        )}
        
        {aiEnhanced && enhancedTypeInsight && (
          <View style={styles.aiEnhancedCard}>
            <View style={styles.enhancedHeader}>
              <Ionicons name="bulb" size={20} color="#6366f1" />
              <Text style={styles.enhancedTitle}>✨ {getTypeLabel(result.type)} Insight</Text>
            </View>
            <Text style={styles.enhancedText}>{enhancedTypeInsight}</Text>
            <View style={{ alignSelf: 'flex-start', marginTop: 8 }}><AIBadge show={true} /></View>
          </View>
        )}
        
        {aiEnhanced && personalizedInsight && (
          <View style={styles.personalizedInsightCard}>
            <View style={styles.insightHeader}>
              <Ionicons name="person" size={20} color="#8b5cf6" />
              <Text style={styles.insightTitle}>💫 Your Personal Insight</Text>
            </View>
            <Text style={styles.insightText}>{personalizedInsight}</Text>
            <View style={{ alignSelf: 'flex-start', marginTop: 8 }}><AIBadge show={true} /></View>
          </View>
        )}
        
        {/* Type-Specific Insights Section */}
        <View onLayout={(e) => handleSectionLayout('insights', e.nativeEvent.layout.y)}>
          <Text style={styles.sectionTitle}>✨ {getInsightsTitle(result.type, t)}</Text>
          {renderTypeSpecificInsights(result)}
        </View>
        
        {/* Elemental Composition Section */}
        <View onLayout={(e) => handleSectionLayout('elements', e.nativeEvent.layout.y)}>
          <Text style={styles.sectionTitle}>🔮 {t('calculator.results.sections.elementalAnalysis')}</Text>
          <ElementalComposition analytics={result.analytics} />
        </View>
        
        {/* Advanced Methods Section */}
        <View onLayout={(e) => handleSectionLayout('advanced', e.nativeEvent.layout.y)}>
          <Text style={styles.sectionTitle}>🔬 {t('calculator.results.sections.advancedMethods')}</Text>
          <AdvancedMethods 
            kabir={result.core.kabir}
            saghir={result.core.saghir}
          />
        </View>
        </PremiumSection>
        
        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            ℹ️ {t('calculator.results.disclaimer')}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

function getTypeLabel(type: string, t: (key: string) => string): string {
  const icons: { [key: string]: string } = {
    name: '👤',
    lineage: '🌳',
    phrase: '📝',
    quran: '📖',
    dhikr: '🤲',
    general: '🔤',
  };
  const icon = icons[type] || '';
  const label = t(`calculator.results.types.${type}`);
  return icon ? `${icon} ${label}` : label;
}

function getInsightsTitle(type: string, t: (key: string) => string): string {
  const sectionKeys: { [key: string]: string } = {
    name: 'nameInsights',
    lineage: 'lineageInsights',
    phrase: 'phraseAnalysis',
    quran: 'quranResonance',
    dhikr: 'dhikrPractice',
    general: 'generalInsights',
  };
  const key = sectionKeys[type] || 'nameInsights';
  return t(`calculator.results.sections.${key}`);
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
  
  // AI Enhancement Styles
  aiEnhanceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  aiEnhanceButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  aiEnhancedCard: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
    borderRadius: 12,
    padding: 16,
    gap: 8,
    marginBottom: 12,
  },
  enhancedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  enhancedTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#f1f5f9',
  },
  enhancedText: {
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 20,
  },
  personalizedInsightCard: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    borderRadius: 12,
    padding: 16,
    gap: 8,
    marginBottom: 12,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  insightTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#f1f5f9',
  },
  insightText: {
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 20,
  },
});
