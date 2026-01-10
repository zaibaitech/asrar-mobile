/**
 * Enhanced Universal Compatibility Results View
 * Professional UI with dynamic theming and simplified explanations
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLanguage } from '../../contexts/LanguageContext';
import { getSeverityColor, getSoulArchetype } from '../../services/compatibility/soulArchetypes';
import { 
  getSoulMeaning, 
  getIntensityColor, 
  getArchetypeTitle,
  getSoulGlimpseKey,
  type RelationshipContext,
  type SoulNumber 
} from '../../services/compatibility/soulConnectionMeanings';
import type {
    DivineNameIntentionCompatibility,
    PersonDivineNameCompatibility,
    PersonPersonCompatibility,
    UniversalCompatibilityResult
} from '../../services/compatibility/types';
import { CompatibilityGauge } from './CompatibilityGauge';
import { SoulConnectionRing } from './SoulConnectionRing';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

// Safe translation helper - never renders raw keys
const safeT = (tFunc: (key: string, options?: any) => string, key: string, fallback: string, options?: any): string => {
  const value = tFunc(key, options);
  // If translation key is returned unchanged, use fallback
  if (value === key || !value) {
    if (__DEV__) {
      console.warn(`[Translation Missing] Key: ${key}`);
    }
    return fallback;
  }
  return value;
};

interface CompatibilityResultViewProps {
  result: UniversalCompatibilityResult;
  language: 'en' | 'fr' | 'ar';
}

// Dynamic color themes based on relationship context
const RELATIONSHIP_THEMES = {
  marriage: {
    primary: ['#ec4899', '#f43f5e'],
    light: 'rgba(236, 72, 153, 0.15)',
    icon: 'heart' as const,
    emoji: '💕'
  },
  friendship: {
    primary: ['#3b82f6', '#2563eb'],
    light: 'rgba(59, 130, 246, 0.15)',
    icon: 'people' as const,
    emoji: '🤝'
  },
  family: {
    primary: ['#22c55e', '#16a34a'],
    light: 'rgba(34, 197, 94, 0.15)',
    icon: 'home' as const,
    emoji: '👨‍👩‍👧'
  },
  work: {
    primary: ['#8b5cf6', '#7c3aed'],
    light: 'rgba(139, 92, 246, 0.15)',
    icon: 'briefcase' as const,
    emoji: '💼'
  },
  universal: {
    primary: ['#6366f1', '#8b5cf6'],
    light: 'rgba(99, 102, 241, 0.15)',
    icon: 'infinite' as const,
    emoji: '✨'
  }
};

const METHOD_THEMES = {
  spiritual: { color: '#d97706', icon: 'sparkles' as const, emoji: '✨' },
  elemental: { color: '#22c55e', icon: 'leaf' as const, emoji: '🍃' },
  planetary: { color: '#8b5cf6', icon: 'planet' as const, emoji: '🌙' },
  daily: { color: '#3b82f6', icon: 'calendar' as const, emoji: '📅' }
};

export function CompatibilityResultView({ result, language }: CompatibilityResultViewProps) {
  if (result.type === 'person-person') {
    return <PersonPersonResultView result={result} language={language} />;
  } else if (result.type === 'person-divine-name') {
    return <PersonDivineNameResultView result={result} language={language} />;
  } else {
    return <DivineIntentionResultView result={result} language={language} />;
  }
}

// ============================================================================
// PERSON ↔ PERSON RESULT VIEW (ENHANCED)
// ============================================================================

function PersonPersonResultView({ result, language }: { result: PersonPersonCompatibility; language: 'en' | 'fr' | 'ar' }) {
  const { t } = useLanguage();
  const { person1, person2, relationshipCompatibility, relationshipContext } = result;
  const rc = relationshipCompatibility;
  const methods = rc.methods;
  const theme = RELATIONSHIP_THEMES[relationshipContext];
  
  const [activeTab, setActiveTab] = useState<'overview' | 'soulConnection' | 'harmony' | 'advice'>('overview');

  const tabs = [
    { id: 'overview' as const, label: t('compatibility.results.tabs.overview'), icon: 'eye' },
    { id: 'soulConnection' as const, label: t('compatibility.results.tabs.soulConnection'), icon: 'sparkles' },
    { id: 'harmony' as const, label: t('compatibility.results.tabs.harmony'), icon: 'analytics' },
    { id: 'advice' as const, label: t('compatibility.results.tabs.advice'), icon: 'bulb' },
  ];

  const getQualityGradient = (score: number): readonly [string, string] => {
    if (score >= 80) return ['#10b981', '#059669'] as const;
    if (score >= 60) return ['#3b82f6', '#2563eb'] as const;
    if (score >= 40) return ['#f59e0b', '#d97706'] as const;
    return ['#ef4444', '#dc2626'] as const;
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#3b82f6';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <View style={styles.container}>
      {/* Header Card */}
      <LinearGradient
        colors={[theme.light, theme.light]}
        style={styles.headerCard}
      >
        <View style={styles.namesRow}>
          <View style={styles.personSection}>
            <Text style={styles.nameText}>{person1.name}</Text>
            <Text style={styles.arabicNameText}>{person1.arabicName}</Text>
          </View>
          
          <View style={styles.heartContainer}>
            <LinearGradient
              colors={theme.primary as any}
              style={styles.heartCircle}
            >
              <Text style={styles.heartEmoji}>{theme.emoji}</Text>
            </LinearGradient>
          </View>
          
          <View style={styles.personSection}>
            <Text style={styles.nameText}>{person2.name}</Text>
            <Text style={styles.arabicNameText}>{person2.arabicName}</Text>
          </View>
        </View>
        
        <Text style={styles.headerSubtitle}>
          {t('compatibility.results.header.compatibilityAnalysis', { 
            context: relationshipContext.charAt(0).toUpperCase() + relationshipContext.slice(1) 
          })}
        </Text>
      </LinearGradient>

      {/* Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.tabsContainer}
        contentContainerStyle={styles.tabsContent}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => setActiveTab(tab.id)}
            activeOpacity={0.7}
          >
            {activeTab === tab.id ? (
              <LinearGradient
                colors={theme.primary as any}
                style={styles.tab}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Ionicons name={tab.icon as any} size={16} color="#fff" />
                <Text style={styles.tabTextActive}>{tab.label}</Text>
              </LinearGradient>
            ) : (
              <View style={styles.tabInactive}>
                <Ionicons name={`${tab.icon}-outline` as any} size={16} color="#94a3b8" />
                <Text style={styles.tabTextInactive}>{tab.label}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'overview' && (
          <OverviewTab 
            rc={rc} 
            theme={theme} 
            language={language}
            getQualityGradient={getQualityGradient}
            relationshipContext={relationshipContext}
          />
        )}
        
        {activeTab === 'soulConnection' && (
          <SoulConnectionTab 
            method={methods.spiritualDestiny} 
            person1Name={person1.name}
            person2Name={person2.name}
            person1Kabir={person1.destiny.kabir}
            person2Kabir={person2.destiny.kabir}
            relationshipContext={relationshipContext}
            language={language} 
          />
        )}
        
        {activeTab === 'harmony' && (
          <HarmonyTab 
            rc={rc}
            theme={theme}
            language={language} 
          />
        )}
        
        {activeTab === 'advice' && (
          <AdviceTab 
            rc={rc} 
            theme={theme}
            language={language} 
          />
        )}
      </ScrollView>
    </View>
  );
}

// ============================================================================
// HELPER: Get field value based on language
// ============================================================================

function getLocalizedField(obj: any, baseField: string, language: 'en' | 'fr' | 'ar'): any {
  if (language === 'ar') {
    return obj[`${baseField}Arabic`] || obj[`${baseField}Ar`] || obj[baseField];
  }
  if (language === 'fr') {
    return obj[`${baseField}French`] || obj[`${baseField}Fr`] || obj[baseField];
  }
  return obj[baseField]; // Default to English
}

// ============================================================================
// TAB COMPONENTS
// ============================================================================

function OverviewTab({ rc, theme, language, getQualityGradient, relationshipContext }: any) {
  const { t } = useLanguage();
  
  // Get soul archetype
  const soulNumber = rc.methods.spiritualDestiny.remainder as SoulNumber;
  const soulArchetype = getSoulArchetype(soulNumber);
  const severityColor = getSeverityColor(soulArchetype.severity);
  
  // Get context-aware glimpse key
  const glimpseKey = getSoulGlimpseKey(soulNumber, relationshipContext as RelationshipContext);
  const glimpseText = safeT(t, glimpseKey, 'Spiritual connection pattern');

  return (
    <View style={styles.section}>
      {/* Two KPIs Side by Side */}
      <View style={styles.twoKpiContainer}>
        {/* LEFT KPI: Harmony Index */}
        <View style={styles.kpiCard}>
          <LinearGradient
            colors={getQualityGradient(rc.overallScore)}
            style={styles.kpiGradient}
          >
            <Text style={styles.kpiLabel}>
              {safeT(t, 'compatibility.results.overview.overallCompatibility', 'Overall Compatibility')}
            </Text>
            <CompatibilityGauge
              score={rc.overallScore}
              label=""
              color="#fff"
              size={100}
            />
            <Text style={styles.kpiQuality}>
              {safeT(t, `compatibility.results.enums.quality.${rc.overallQuality}`, rc.overallQuality).toUpperCase()}
            </Text>
            <Text style={styles.kpiMicroLabel}>
              {safeT(t, 'compatibility.results.overview.harmonyDesc', 'Harmony Index')}
            </Text>
          </LinearGradient>
        </View>

        {/* RIGHT KPI: Soul Connection */}
        <View style={styles.kpiCard}>
          <View style={styles.soulConnectionKpi}>
            <Text style={styles.kpiLabel}>
              {safeT(t, 'compatibility.soul.title', 'Soul Connection')}
            </Text>
            <SoulConnectionRing 
              value={soulNumber}
              size={100}
              activeColor={severityColor}
            />
            <Text style={[styles.soulConnectionNumber, { color: severityColor }]}>
              {soulNumber}
            </Text>
            <Text style={[styles.soulConnectionMeaning, { color: '#cbd5e1' }]} numberOfLines={2}>
              {glimpseText}
            </Text>
            <View style={styles.independentBadge}>
              <Text style={styles.independentBadgeText}>
                {safeT(t, 'compatibility.soul.independentChip', 'Independent metric')}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Explanation Card */}
      <View style={styles.explanationCard}>
        <Ionicons name="information-circle" size={20} color={theme.primary[0]} />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.explanationCardText}>
            {safeT(t, 'compatibility.results.overview.twoMetricsExplanation', 'Two independent compatibility metrics')}
          </Text>
        </View>
      </View>

      {/* Summary */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <Ionicons name="document-text" size={24} color={theme.primary[0]} />
          <Text style={styles.summaryTitle}>
            {safeT(t, 'compatibility.results.overview.summary', 'Summary')}
          </Text>
        </View>
        <Text style={styles.summaryText}>
          {getLocalizedField(rc, 'summary', language)}
        </Text>
      </View>

      {/* Quick Stats Grid - showing Harmony components only */}
      <Text style={styles.sectionTitle}>{safeT(t, 'compatibility.results.overview.harmony', 'Harmony Components')}</Text>
      <View style={styles.statsGrid}>
        <StatCard
          titleKey="compatibility.results.overview.elemental"
          score={rc.methods.elementalTemperament.score}
          color={METHOD_THEMES.elemental.color}
          emoji={METHOD_THEMES.elemental.emoji}
        />
        <StatCard
          titleKey="compatibility.results.overview.planetary"
          score={rc.methods.planetaryCosmic.score}
          color={METHOD_THEMES.planetary.color}
          emoji={METHOD_THEMES.planetary.emoji}
        />
        <StatCard
          titleKey="compatibility.results.overview.daily"
          score={rc.methods.dailyInteraction.score}
          color={METHOD_THEMES.daily.color}
          emoji={METHOD_THEMES.daily.emoji}
        />
      </View>
    </View>
  );
}

function SoulConnectionTab({ method, person1Name, person2Name, person1Kabir, person2Kabir, relationshipContext, language }: any) {
  const { t } = useLanguage();
  const theme = METHOD_THEMES.spiritual;
  const [showFormula, setShowFormula] = useState(false);
  const [selectedContext, setSelectedContext] = useState<RelationshipContext>(relationshipContext);
  
  const soulNumber = method.remainder as SoulNumber;
  
  // Get meaning for selected context
  const contextMeaning = getSoulMeaning(soulNumber, selectedContext);
  
  // Fallback to archetype for marriage context or if meaning not found
  const archetype = getSoulArchetype(soulNumber);
  
  // Determine which data to use
  const useArchetype = selectedContext === 'marriage' || !contextMeaning;
  const displayColor = useArchetype 
    ? getSeverityColor(archetype.severity) 
    : getIntensityColor(contextMeaning.intensity);
  
  // Get archetype title (shared across all contexts)
  const archetypeTitleKey = getArchetypeTitle(soulNumber);
  
  // Context selector options
  const contextOptions: { value: RelationshipContext; labelKey: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { value: 'universal', labelKey: 'compatibility.universal.relationshipContext.universal', icon: 'infinite' },
    { value: 'marriage', labelKey: 'compatibility.universal.relationshipContext.marriage', icon: 'heart' },
    { value: 'friendship', labelKey: 'compatibility.universal.relationshipContext.friendship', icon: 'people' },
    { value: 'family', labelKey: 'compatibility.universal.relationshipContext.family', icon: 'home' },
    { value: 'work', labelKey: 'compatibility.universal.relationshipContext.work', icon: 'briefcase' },
  ];
  
  return (
    <View style={styles.section}>
      <View style={styles.soulConnectionCard}>
        {/* Header */}
        <View style={styles.soulConnectionHeader}>
          <View style={styles.iconBadgeContainer}>
            <Ionicons name="sparkles" size={24} color={displayColor} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.soulConnectionTitle}>
              {safeT(t, 'compatibility.soul.title', 'Soul Connection')}
            </Text>
            <Text style={styles.soulConnectionSubtitle}>
              {safeT(t, 'compatibility.soul.subtitle', 'A traditional soul-resonance marker')}
            </Text>
            <View style={styles.badgeRow}>
              <View style={[styles.badge, { backgroundColor: `${displayColor}20` }]}>
                <Text style={[styles.badgeText, { color: displayColor }]}>
                  {safeT(t, 'compatibility.soul.independentChip', 'Independent metric')}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Context Selector */}
        <View style={styles.contextSelectorContainer}>
          <Text style={styles.contextSelectorLabel}>
            {safeT(t, 'compatibility.universal.relationshipContext.title', 'Relationship Context')}
          </Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.contextChips}
          >
            {contextOptions.map((option) => {
              const isSelected = selectedContext === option.value;
              return (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => setSelectedContext(option.value)}
                  style={[
                    styles.contextChip,
                    isSelected && { backgroundColor: `${displayColor}20`, borderColor: displayColor }
                  ]}
                  activeOpacity={0.7}
                >
                  <Ionicons 
                    name={option.icon} 
                    size={16} 
                    color={isSelected ? displayColor : '#94a3b8'} 
                  />
                  <Text style={[
                    styles.contextChipText,
                    isSelected && { color: displayColor, fontWeight: '600' }
                  ]}>
                    {safeT(t, option.labelKey, option.value)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.divider} />

        {/* The Result */}
        <View style={styles.resultSection}>
          <SoulConnectionRing 
            value={soulNumber}
            size={140}
            activeColor={displayColor}
          />
          <Text style={[styles.soulConnectionBigNumber, { color: displayColor }]}>
            {soulNumber}
          </Text>
          {archetypeTitleKey && (
            <Text style={[styles.soulConnectionQuality, { color: displayColor }]}>
              {safeT(t, archetypeTitleKey, '')}
            </Text>
          )}
          <Text style={styles.oneLineInterpretation}>
            {useArchetype 
              ? safeT(t, archetype.oneLineKey, 'Spiritual resonance pattern')
              : safeT(t, contextMeaning.shortLabelKey, 'Spiritual connection pattern')
            }
          </Text>
        </View>

        {/* Tags (only for marriage/archetype view) */}
        {useArchetype && archetype.tags && (
          <>
            <View style={styles.badgeRow}>
              {archetype.tags.map((tagKey, index) => (
                <View key={index} style={[styles.badge, { backgroundColor: `${displayColor}15`, borderWidth: 1, borderColor: `${displayColor}30` }]}>
                  <Text style={[styles.badgeText, { color: displayColor }]}>
                    {safeT(t, tagKey, '')}
                  </Text>
                </View>
              ))}
            </View>
            <View style={styles.divider} />
          </>
        )}

        {/* Meaning Blocks */}
        <View style={styles.classicalStructure}>
          <View style={styles.classicalSection}>
            <Text style={[styles.classicalLabel, { color: '#3b82f6' }]}>
              {safeT(t, 'compatibility.soul.blocks.meaning', 'Meaning')}
            </Text>
            <Text style={styles.classicalText}>
              {useArchetype 
                ? safeT(t, archetype.meaningKey, 'This reflects the underlying spiritual resonance.')
                : safeT(t, contextMeaning.meaningKey, 'This reflects the connection pattern.')
              }
            </Text>
          </View>

          {/* Marriage Outlook (only in marriage context using archetype) */}
          {selectedContext === 'marriage' && useArchetype && (
            <View style={styles.classicalSection}>
              <Text style={[styles.classicalLabel, { color: '#8b5cf6' }]}>
                {safeT(t, 'compatibility.soul.blocks.marriageOutlook', 'Marriage Outlook')}
              </Text>
              <Text style={styles.classicalText}>
                {safeT(t, archetype.marriageOutlookKey, 'Every path has its lessons.')}
              </Text>
            </View>
          )}

          {/* Watch Out */}
          <View style={styles.classicalSection}>
            <Text style={[styles.classicalLabel, { color: '#f59e0b' }]}>
              {safeT(t, 'compatibility.soul.blocks.watchOut', 'Watch Out')}
            </Text>
            <Text style={styles.classicalText}>
              {useArchetype 
                ? safeT(t, archetype.watchOutKey, 'General caution and awareness.')
                : safeT(t, contextMeaning.watchOutKey, 'Be mindful of challenges.')
              }
            </Text>
          </View>

          {/* Key to Success */}
          <View style={styles.classicalSection}>
            <Text style={[styles.classicalLabel, { color: '#22c55e' }]}>
              {safeT(t, 'compatibility.soul.blocks.keyToSuccess', 'Key to Success')}
            </Text>
            <Text style={styles.classicalText}>
              {useArchetype 
                ? safeT(t, archetype.keyToSuccessKey, 'Seek wise counsel and maintain spiritual practices.')
                : safeT(t, contextMeaning.keyToSuccessKey, 'Nurture the connection with care.')
              }
            </Text>
          </View>
        </View>

        {/* Disclaimer */}
        <View style={styles.contextNote}>
          <Ionicons name="information-circle-outline" size={18} color="#94a3b8" />
          <Text style={styles.contextNoteText}>
            {safeT(t, 'compatibility.soul.disclaimer', 'A reflection tool from traditional teachings — it does not replace faith, free will, or wise counsel.')}
          </Text>
        </View>

        {/* How Calculated (Collapsible) */}
        <TouchableOpacity 
          onPress={() => setShowFormula(!showFormula)}
          style={styles.expandableHeader}
          activeOpacity={0.7}
        >
          <Text style={styles.expandableTitle}>
            {safeT(t, 'compatibility.soul.howCalculated.title', 'How this number is calculated')}
          </Text>
          <Ionicons 
            name={showFormula ? 'chevron-up' : 'chevron-down'} 
            size={20} 
            color="#94a3b8" 
          />
        </TouchableOpacity>

        {showFormula && (
          <View style={styles.formulaSection}>
            <View style={styles.formulaRow}>
              <Text style={styles.formulaLabel}>{person1Name}</Text>
              <Text style={styles.formulaValue}>{person1Kabir}</Text>
            </View>
            <View style={styles.formulaRow}>
              <Text style={styles.formulaLabel}>{person2Name}</Text>
              <Text style={styles.formulaValue}>{person2Kabir}</Text>
            </View>
            <View style={styles.formulaRow}>
              <Text style={styles.formulaLabel}>{safeT(t, 'compatibility.soul.howCalculated.constant', 'Constant')}</Text>
              <Text style={styles.formulaValue}>+7</Text>
            </View>
            <Text style={styles.formulaText}>
              ({person1Kabir} + {person2Kabir} + 7) mod 9 = {soulNumber}
            </Text>
            <Text style={styles.formulaNote}>
              {safeT(t, 'compatibility.soul.howCalculated.explanation', 'We add the two name values, add 7, then reduce to a number 1–9.')}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

function HarmonyTab({ rc, theme, language }: any) {
  const { t } = useLanguage();
  const methods = rc.methods;
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  
  return (
    <View style={styles.section}>
      {/* Page Title */}
      <View style={styles.harmonyHeader}>
        <Text style={styles.harmonyPageTitle}>
          {t('compatibility.results.harmony.title')}
        </Text>
        <Text style={styles.harmonyPageSubtitle}>
          {t('compatibility.results.harmony.subtitle')}
        </Text>
      </View>

      {/* Compact Harmony Cards - Web-Inspired Layout */}
      <View style={styles.harmonyCardsContainer}>
        
        {/* Elemental Harmony Card */}
        <CompactHarmonyCard
          title={safeT(t, 'compatibility.results.elemental.title', 'Elemental Harmony')}
          subtitle={safeT(t, 'compatibility.results.elemental.shortDesc', 'Natural energetic balance')}
          score={methods.elementalTemperament.score}
          emoji="🌿"
          description={getLocalizedField(methods.elementalTemperament, 'description', language)}
          gradient={['rgba(34, 197, 94, 0.15)', 'rgba(22, 163, 74, 0.08)']}
          accentColor="#22c55e"
          isExpanded={expandedCard === 'elemental'}
          onToggle={() => setExpandedCard(expandedCard === 'elemental' ? null : 'elemental')}
          chips={[
            `🔥 ${safeT(t, `compatibility.results.enums.element.${methods.elementalTemperament.sharedElement}`, methods.elementalTemperament.sharedElement)}`,
            safeT(t, `compatibility.results.enums.elementalQuality.${methods.elementalTemperament.quality}`, methods.elementalTemperament.quality)
          ]}
          detailContent={
            <ElementalDetailContent method={methods.elementalTemperament} language={language} />
          }
        />

        {/* Cosmic Harmony Card */}
        <CompactHarmonyCard
          title={safeT(t, 'compatibility.results.planetary.title', 'Cosmic Harmony')}
          subtitle={safeT(t, 'compatibility.results.planetary.shortDesc', 'Planetary influences')}
          score={methods.planetaryCosmic.score}
          emoji="🌙"
          description={getLocalizedField(methods.planetaryCosmic, 'description', language)}
          gradient={['rgba(139, 92, 246, 0.15)', 'rgba(124, 58, 237, 0.08)']}
          accentColor="#8b5cf6"
          isExpanded={expandedCard === 'planetary'}
          onToggle={() => setExpandedCard(expandedCard === 'planetary' ? null : 'planetary')}
          chips={[
            `${methods.planetaryCosmic.person1Planet.name} × ${methods.planetaryCosmic.person2Planet.name}`,
            safeT(t, `compatibility.results.enums.planetaryRelationship.${methods.planetaryCosmic.relationship}`, methods.planetaryCosmic.relationship)
          ]}
          detailContent={
            <PlanetaryDetailContent 
              method={methods.planetaryCosmic} 
              person1Name={rc.person1.name}
              person2Name={rc.person2.name}
              language={language} 
            />
          }
        />

        {/* Daily Life Harmony Card */}
        <CompactHarmonyCard
          title={safeT(t, 'compatibility.results.daily.title', 'Daily Life Together')}
          subtitle={safeT(t, 'compatibility.results.daily.shortDesc', 'Day-to-day rhythm')}
          score={methods.dailyInteraction.score}
          emoji="📆"
          description={getLocalizedField(methods.dailyInteraction, 'description', language)}
          gradient={['rgba(59, 130, 246, 0.15)', 'rgba(37, 99, 235, 0.08)']}
          accentColor="#3b82f6"
          isExpanded={expandedCard === 'daily'}
          onToggle={() => setExpandedCard(expandedCard === 'daily' ? null : 'daily')}
          chips={[
            safeT(t, `compatibility.results.enums.interactionType.${methods.dailyInteraction.interactionType}`, methods.dailyInteraction.interactionType),
            methods.dailyInteraction.score >= 70 ? safeT(t, 'compatibility.tags.active', 'Active') : safeT(t, 'compatibility.tags.growing', 'Growing')
          ]}
          detailContent={
            <DailyDetailContent 
              method={methods.dailyInteraction} 
              language={language} 
            />
          }
        />
      </View>
    </View>
  );
}

// ============================================================================
// COMPACT HARMONY CARD COMPONENT (Web-Inspired Premium Mobile UI)
// ============================================================================

interface CompactHarmonyCardProps {
  title: string;
  subtitle: string;
  score: number;
  emoji: string;
  description: string;
  gradient: [string, string];
  accentColor: string;
  isExpanded: boolean;
  onToggle: () => void;
  chips: string[];
  detailContent: React.ReactNode;
}

function CompactHarmonyCard({
  title,
  subtitle,
  score,
  emoji,
  description,
  gradient,
  accentColor,
  isExpanded,
  onToggle,
  chips,
  detailContent
}: CompactHarmonyCardProps) {
  return (
    <View style={styles.compactCardWrapper}>
      {/* Inner constrained container - THE KEY FIX */}
      <View style={styles.compactCardInner}>
        <LinearGradient
          colors={gradient}
          style={styles.compactCard}
        >
          {/* TOP ROW: Horizontal Layout (Icon + Title) | (Ring %) */}
          <View style={styles.compactCardTop}>
            {/* LEFT: Icon + Title */}
            <View style={styles.compactCardLeft}>
              <Text style={styles.compactCardEmoji}>{emoji}</Text>
              <View style={styles.compactCardTitleContainer}>
                <Text style={styles.compactCardTitle}>{title}</Text>
                <Text style={styles.compactCardSubtitle}>{subtitle}</Text>
              </View>
            </View>

            {/* RIGHT: Percentage Ring */}
            <View style={styles.compactCardRight}>
              <CompatibilityGauge
                score={score}
                label=""
                color={accentColor}
                size={70}
              />
            </View>
          </View>

          {/* ONE-SENTENCE INTERPRETATION */}
          <Text style={styles.compactCardDescription} numberOfLines={isExpanded ? undefined : 2}>
            {description}
          </Text>

          {/* CHIPS ROW */}
          <View style={styles.compactCardChips}>
            {chips.map((chip, index) => (
              <View key={index} style={[styles.compactChip, { borderColor: accentColor + '60' }]}>
                <Text style={[styles.compactChipText, { color: accentColor }]}>
                  {chip}
                </Text>
              </View>
            ))}
          </View>

          {/* EXPAND BUTTON */}
          <TouchableOpacity 
            style={styles.compactCardExpandButton}
            onPress={onToggle}
            activeOpacity={0.7}
          >
            <Text style={[styles.compactCardExpandText, { color: accentColor }]}>
              {isExpanded ? '△ Hide details' : '▽ View details'}
            </Text>
          </TouchableOpacity>

          {/* EXPANDED DETAIL CONTENT */}
          {isExpanded && (
            <View style={styles.compactCardExpanded}>
              <View style={styles.expandedDivider} />
              {detailContent}
            </View>
          )}
        </LinearGradient>
      </View>
    </View>
  );
}

// ============================================================================
// DETAIL CONTENT COMPONENTS
// ============================================================================

function ElementalDetailContent({ method, language }: any) {
  const { t } = useLanguage();
  return (
    <View style={styles.detailContentContainer}>
      <DetailSection
        label={t('compatibility.results.spiritual.meaning')}
        text={getLocalizedField(method, 'description', language)}
      />
      <DetailSection
        label={t('compatibility.results.spiritual.watchOut')}
        text={t(`compatibility.results.elemental.watchOut_${method.sharedElement}`)}
      />
      <DetailSection
        label={t('compatibility.results.spiritual.keyToSuccess')}
        text={t(`compatibility.results.elemental.success_${method.sharedElement}`)}
      />
    </View>
  );
}

function PlanetaryDetailContent({ method, person1Name, person2Name, language }: any) {
  const { t } = useLanguage();
  return (
    <View style={styles.detailContentContainer}>
      <View style={styles.planetaryDetailRow}>
        <View style={styles.planetDetailCard}>
          <Text style={styles.planetDetailLabel}>{person1Name}</Text>
          <Text style={styles.planetDetailName}>{method.person1Planet.name}</Text>
          <Text style={styles.planetDetailArabic}>{method.person1Planet.nameArabic}</Text>
        </View>
        <View style={styles.planetDetailIndicator}>
          <Ionicons 
            name={method.relationship === 'friendly' ? 'heart' : method.relationship === 'neutral' ? 'remove-circle' : 'alert-circle'} 
            size={20} 
            color={method.relationship === 'friendly' ? '#22c55e' : method.relationship === 'neutral' ? '#f59e0b' : '#ef4444'}
          />
        </View>
        <View style={styles.planetDetailCard}>
          <Text style={styles.planetDetailLabel}>{person2Name}</Text>
          <Text style={styles.planetDetailName}>{method.person2Planet.name}</Text>
          <Text style={styles.planetDetailArabic}>{method.person2Planet.nameArabic}</Text>
        </View>
      </View>
      <DetailSection
        label={t('compatibility.results.spiritual.meaning')}
        text={getLocalizedField(method, 'description', language)}
      />
      <DetailSection
        label={t('compatibility.results.spiritual.watchOut')}
        text={t(`compatibility.results.planetary.watchOut_${method.relationship}`)}
      />
      <DetailSection
        label={t('compatibility.results.spiritual.keyToSuccess')}
        text={t(`compatibility.results.planetary.success_${method.relationship}`)}
      />
    </View>
  );
}

function DailyDetailContent({ method, language }: any) {
  const { t } = useLanguage();
  return (
    <View style={styles.detailContentContainer}>
      <DetailSection
        label={t('compatibility.results.spiritual.meaning')}
        text={getLocalizedField(method, 'description', language)}
      />
      <DetailSection
        label={t('compatibility.results.spiritual.watchOut')}
        text={t(method.score >= 70 ? 'compatibility.results.daily.watchOut_high' : 'compatibility.results.daily.watchOut_low')}
      />
      <DetailSection
        label={t('compatibility.results.spiritual.keyToSuccess')}
        text={t(method.score >= 70 ? 'compatibility.results.daily.success_high' : 'compatibility.results.daily.success_low')}
      />
    </View>
  );
}

function DetailSection({ label, text }: { label: string; text: string }) {
  return (
    <View style={styles.detailSectionContainer}>
      <Text style={styles.detailSectionLabel}>{label}</Text>
      <Text style={styles.detailSectionText}>{text}</Text>
    </View>
  );
}

function SpiritualTab({ method, person1Name, person2Name, language }: any) {
  const { t } = useLanguage();
  const theme = METHOD_THEMES.spiritual;
  
  return (
    <View style={styles.section}>
      <LinearGradient
        colors={['rgba(251, 146, 60, 0.1)', 'rgba(249, 115, 22, 0.1)']}
        style={styles.detailCard}
      >
        <View style={styles.detailHeader}>
          <View style={styles.detailIconContainer}>
            <Ionicons name={theme.icon} size={28} color={theme.color} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.detailTitle}>
              {t('compatibility.results.spiritual.title')}
            </Text>
            <Text style={styles.detailSubtitle}>
              {t('compatibility.results.spiritual.subtitle')}
            </Text>
          </View>
          <CompatibilityGauge
            score={method.score}
            label=""
            color={theme.color}
            size={80}
          />
        </View>

        <View style={styles.divider} />

        {/* 3-Part Classical Structure */}
        <View style={styles.classicalStructure}>
          <View style={styles.classicalSection}>
            <Text style={styles.classicalLabel}>
              {t('compatibility.results.spiritual.meaning')}
            </Text>
            <Text style={styles.classicalText}>
              {getLocalizedField(method, 'description', language)}
            </Text>
          </View>

          <View style={styles.classicalSection}>
            <Text style={styles.classicalLabel}>
              {t('compatibility.results.spiritual.watchOut')}
            </Text>
            <Text style={styles.classicalText}>
              {t(method.score >= 70 ? 'compatibility.results.spiritual.watchOut_high' : method.score >= 40 ? 'compatibility.results.spiritual.watchOut_medium' : 'compatibility.results.spiritual.watchOut_low')}
            </Text>
          </View>

          <View style={styles.classicalSection}>
            <Text style={styles.classicalLabel}>
              {t('compatibility.results.spiritual.keyToSuccess')}
            </Text>
            <Text style={styles.classicalText}>
              {t(method.score >= 70 ? 'compatibility.results.spiritual.success_high' : method.score >= 40 ? 'compatibility.results.spiritual.success_medium' : 'compatibility.results.spiritual.success_low')}
            </Text>
          </View>
        </View>

        {/* Metadata */}
        <View style={styles.metadataRow}>
          <View style={styles.metadataItem}>
            <Text style={styles.metadataLabel}>
              {t('compatibility.results.overview.quality')}
            </Text>
            <Text style={[styles.metadataValue, { color: theme.color }]}>
              {t(`compatibility.results.enums.quality.${method.quality}`)?.toUpperCase() || method.quality.toUpperCase()}
            </Text>
          </View>
          <View style={styles.metadataItem}>
            <Text style={styles.metadataLabel}>
              {t('compatibility.results.overview.sacredNumber')}
            </Text>
            <Text style={[styles.metadataValue, { color: theme.color }]}>
              {method.remainder}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

function ElementalTab({ method, language }: any) {
  const { t } = useLanguage();
  const theme = METHOD_THEMES.elemental;
  const elementEmoji = {
    fire: '🔥',
    water: '💧',
    air: '💨',
    earth: '🌱'
  };

  return (
    <View style={styles.section}>
      <LinearGradient
        colors={['rgba(34, 197, 94, 0.1)', 'rgba(22, 163, 74, 0.1)']}
        style={styles.detailCard}
      >
        <View style={styles.detailHeader}>
          <View style={styles.detailIconContainer}>
            <Ionicons name={theme.icon} size={28} color={theme.color} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.detailTitle}>
              {t('compatibility.results.elemental.title')}
            </Text>
            <Text style={styles.detailSubtitle}>
              {t('compatibility.results.elemental.subtitle')}
            </Text>
          </View>
          <CompatibilityGauge
            score={method.score}
            label=""
            color={theme.color}
            size={80}
          />
        </View>

        <View style={styles.divider} />

        {/* Asrār-Authentic Insight */}
        <View style={styles.insightCard}>
          <Text style={styles.insightLabel}>
            {t('compatibility.results.elemental.balanceType')}
          </Text>
          <Text style={styles.insightValue}>
            {t(method.score >= 80 ? 'compatibility.results.elemental.balanceType_high' : method.score >= 60 ? 'compatibility.results.elemental.balanceType_medium' : 'compatibility.results.elemental.balanceType_low')}
          </Text>
        </View>

        {/* Element Badge */}
        <View style={styles.elementBadgeContainer}>
          <View style={styles.elementBadge}>
            <Text style={styles.elementEmoji}>
              {elementEmoji[method.sharedElement as keyof typeof elementEmoji]}
            </Text>
            <Text style={styles.elementText}>
              {t(`compatibility.results.enums.element.${method.sharedElement}`).toUpperCase()}
            </Text>
          </View>
        </View>

        {/* 3-Part Classical Structure */}
        <View style={styles.classicalStructure}>
          <View style={styles.classicalSection}>
            <Text style={styles.classicalLabel}>
              {t('compatibility.results.spiritual.meaning')}
            </Text>
            <Text style={styles.classicalText}>
              {getLocalizedField(method, 'description', language)}
            </Text>
          </View>

          <View style={styles.classicalSection}>
            <Text style={styles.classicalLabel}>
              {t('compatibility.results.spiritual.watchOut')}
            </Text>
            <Text style={styles.classicalText}>
              {t(`compatibility.results.elemental.watchOut_${method.sharedElement}`)}
            </Text>
          </View>

          <View style={styles.classicalSection}>
            <Text style={styles.classicalLabel}>
              {t('compatibility.results.spiritual.keyToSuccess')}
            </Text>
            <Text style={styles.classicalText}>
              {t(`compatibility.results.elemental.success_${method.sharedElement}`)}
            </Text>
          </View>
        </View>

        {/* Quality Badge */}
        <View style={styles.qualityBadge}>
          <Text style={[styles.qualityBadgeText, { color: theme.color }]}>
            {t(`compatibility.results.enums.elementalQuality.${method.quality}`)?.toUpperCase() || method.quality.toUpperCase()}
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
}

function PlanetaryTab({ method, person1Name, person2Name, language }: any) {
  const { t } = useLanguage();
  const theme = METHOD_THEMES.planetary;

  return (
    <View style={styles.section}>
      <LinearGradient
        colors={['rgba(139, 92, 246, 0.1)', 'rgba(124, 58, 237, 0.1)']}
        style={styles.detailCard}
      >
        <View style={styles.detailHeader}>
          <View style={styles.detailIconContainer}>
            <Ionicons name={theme.icon} size={28} color={theme.color} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.detailTitle}>
              {t('compatibility.results.planetary.title')}
            </Text>
            <Text style={styles.detailSubtitle}>
              {t('compatibility.results.planetary.subtitle')}
            </Text>
          </View>
          <CompatibilityGauge
            score={method.score}
            label=""
            color={theme.color}
            size={80}
          />
        </View>

        <View style={styles.divider} />

        {/* Asrār-Authentic Insight */}
        <View style={styles.insightCard}>
          <Text style={styles.insightLabel}>
            {t('compatibility.results.planetary.dominantInfluence')}
          </Text>
          <Text style={styles.insightValue}>
            {t(`compatibility.results.planetary.dominantInfluence_${method.relationship}`)}
          </Text>
        </View>

        {/* Planet Cards */}
        <View style={styles.planetaryRow}>
          <View style={styles.planetCard}>
            <Text style={styles.planetLabel}>{person1Name}</Text>
            <Text style={styles.planetName}>
              {method.person1Planet.name}
            </Text>
            <Text style={styles.planetArabic}>
              {method.person1Planet.nameArabic}
            </Text>
          </View>
          
          <View style={styles.relationshipIndicator}>
            <Ionicons 
              name={
                method.relationship === 'friendly' ? 'heart' :
                method.relationship === 'neutral' ? 'remove-circle' :
                'alert-circle'
              } 
              size={24} 
              color={
                method.relationship === 'friendly' ? '#22c55e' :
                method.relationship === 'neutral' ? '#f59e0b' :
                '#ef4444'
              }
            />
          </View>
          
          <View style={styles.planetCard}>
            <Text style={styles.planetLabel}>{person2Name}</Text>
            <Text style={styles.planetName}>
              {method.person2Planet.name}
            </Text>
            <Text style={styles.planetArabic}>
              {method.person2Planet.nameArabic}
            </Text>
          </View>
        </View>

        {/* 3-Part Classical Structure */}
        <View style={styles.classicalStructure}>
          <View style={styles.classicalSection}>
            <Text style={styles.classicalLabel}>
              {t('compatibility.results.spiritual.meaning')}
            </Text>
            <Text style={styles.classicalText}>
              {getLocalizedField(method, 'description', language)}
            </Text>
          </View>

          <View style={styles.classicalSection}>
            <Text style={styles.classicalLabel}>
              {t('compatibility.results.spiritual.watchOut')}
            </Text>
            <Text style={styles.classicalText}>
              {t(`compatibility.results.planetary.watchOut_${method.relationship}`)}
            </Text>
          </View>

          <View style={styles.classicalSection}>
            <Text style={styles.classicalLabel}>
              {t('compatibility.results.spiritual.keyToSuccess')}
            </Text>
            <Text style={styles.classicalText}>
              {t(`compatibility.results.planetary.success_${method.relationship}`)}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

function DailyTab({ method, person1Name, person2Name, language }: any) {
  const { t } = useLanguage();
  const theme = METHOD_THEMES.daily;

  return (
    <View style={styles.section}>
      <LinearGradient
        colors={['rgba(59, 130, 246, 0.1)', 'rgba(37, 99, 235, 0.1)']}
        style={styles.detailCard}
      >
        <View style={styles.detailHeader}>
          <View style={styles.detailIconContainer}>
            <Ionicons name={theme.icon} size={28} color={theme.color} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.detailTitle}>
              {t('compatibility.results.daily.title')}
            </Text>
            <Text style={styles.detailSubtitle}>
              {t('compatibility.results.daily.subtitle')}
            </Text>
          </View>
          <CompatibilityGauge
            score={method.score}
            label=""
            color={theme.color}
            size={80}
          />
        </View>

        <View style={styles.divider} />

        {/* Asrār-Authentic Insight */}
        <View style={styles.insightCard}>
          <Text style={styles.insightLabel}>
            {t('compatibility.results.daily.bestRhythm')}
          </Text>
          <Text style={styles.insightValue}>
            {t('compatibility.results.daily.bestRhythm_value')}
          </Text>
        </View>

        {/* 3-Part Classical Structure */}
        <View style={styles.classicalStructure}>
          <View style={styles.classicalSection}>
            <Text style={styles.classicalLabel}>
              {t('compatibility.results.spiritual.meaning')}
            </Text>
            <Text style={styles.classicalText}>
              {getLocalizedField(method, 'description', language)}
            </Text>
          </View>

          <View style={styles.classicalSection}>
            <Text style={styles.classicalLabel}>
              {t('compatibility.results.spiritual.watchOut')}
            </Text>
            <Text style={styles.classicalText}>
              {t(method.score >= 70 ? 'compatibility.results.daily.watchOut_high' : 'compatibility.results.daily.watchOut_low')}
            </Text>
          </View>

          <View style={styles.classicalSection}>
            <Text style={styles.classicalLabel}>
              {t('compatibility.results.spiritual.keyToSuccess')}
            </Text>
            <Text style={styles.classicalText}>
              {t(method.score >= 70 ? 'compatibility.results.daily.success_high' : 'compatibility.results.daily.success_low')}
            </Text>
          </View>
        </View>

        {/* Interaction Type */}
        <View style={styles.qualityBadge}>
          <Text style={[styles.qualityBadgeText, { color: theme.color }]}>
            {t(`compatibility.results.enums.interactionType.${method.interactionType}`).toUpperCase()}
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
}

function AdviceTab({ rc, theme, language }: any) {
  const { t } = useLanguage();
  return (
    <View style={styles.section}>
      {/* Recommendations */}
      <LinearGradient
        colors={['rgba(34, 197, 94, 0.1)', 'rgba(22, 163, 74, 0.1)']}
        style={styles.adviceCard}
      >
        <View style={styles.adviceHeader}>
          <Ionicons name="bulb" size={28} color="#22c55e" />
          <Text style={styles.adviceTitle}>
            {t('compatibility.results.advice.title')}
          </Text>
        </View>

        <View style={styles.divider} />

        {getLocalizedField(rc, 'recommendations', language).map((rec: string, index: number) => (
          <View key={index} style={styles.recommendationItem}>
            <View style={styles.recommendationBullet}>
              <Text style={styles.recommendationBulletText}>✓</Text>
            </View>
            <Text style={styles.recommendationText}>{rec}</Text>
          </View>
        ))}
      </LinearGradient>

      {/* Traditional Note (Collapsible) */}
      <TraditionalNote language={language} />
    </View>
  );
}

// Traditional Note Component
function TraditionalNote({ language }: { language: 'en' | 'fr' | 'ar' }) {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.traditionalNote}>
      <TouchableOpacity 
        onPress={() => setExpanded(!expanded)}
        style={styles.traditionalNoteHeader}
        activeOpacity={0.7}
      >
        <Ionicons name="book-outline" size={20} color="#d97706" />
        <Text style={styles.traditionalNoteTitle}>
          {t('compatibility.results.advice.traditionalNote')}
        </Text>
        <Ionicons 
          name={expanded ? 'chevron-up' : 'chevron-down'} 
          size={20} 
          color="#94a3b8" 
        />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.traditionalNoteContent}>
          <Text style={styles.traditionalNoteText}>
            {t('compatibility.results.disclaimer.body')}
          </Text>
        </View>
      )}
    </View>
  );
}

// Helper Components
function StatCard({ titleKey, score, color, emoji }: any) {
  const { t } = useLanguage();
  
  const getMicroLabelKey = (key: string): string => {
    if (key.includes('spiritual')) return 'compatibility.results.microLabels.spiritual';
    if (key.includes('elemental')) return 'compatibility.results.microLabels.elemental';
    if (key.includes('planetary')) return 'compatibility.results.microLabels.planetary';
    if (key.includes('daily')) return 'compatibility.results.microLabels.daily';
    return '';
  };

  const microLabelKey = getMicroLabelKey(titleKey);

  return (
    <View style={[styles.statCard, { borderColor: color + '40' }]}>
      <Text style={styles.statEmoji}>{emoji}</Text>
      <Text style={[styles.statScore, { color }]}>{score}%</Text>
      <Text style={styles.statTitle}>{t(titleKey)}</Text>
      {microLabelKey && <Text style={styles.scoreMicroLabel}>{t(microLabelKey)}</Text>}
    </View>
  );
}

// Simplified Explanations
function getSimplifiedSpiritual(remainder: number, language: string): string {
  const explanations: Record<number, string> = {
    1: "New beginnings align — potential emerges through fresh intention.",
    2: "Balance exists — harmony requires gentle cultivation.",
    3: "Friction appears — patience transforms tension into strength.",
    4: "Stability grounds — consistency preserves what is built.",
    5: "Change flows — adaptability sustains connection through motion.",
    6: "Responsibility calls — commitment deepens through shared effort.",
    7: "Spiritual harmony resides — understanding flows with minimal resistance.",
    8: "Abundance aligns — prosperity follows mutual support.",
    9: "Completion emerges — this bond reflects a cycle's natural end."
  };
  return language === 'en' ? explanations[remainder] : '';
}

function getSimplifiedElemental(element: string, language: string): string {
  const explanations: Record<string, string> = {
    fire: "Shared warmth and vitality align naturally — direct this energy toward unified purpose.",
    water: "Emotional depth connects — empathy flows when both honor the other's current.",
    air: "Mental clarity converges — dialogue thrives when both listen as they speak.",
    earth: "Practical grounding meets — stability strengthens through consistent rhythm."
  };
  return language === 'en' ? explanations[element] : '';
}

function getSimplifiedPlanetary(relationship: string, planet1: string, planet2: string, language: string): string {
  if (relationship === 'friendly') {
    return `${planet1} and ${planet2} align supportively — their influences complement naturally.`;
  } else if (relationship === 'neutral') {
    return `${planet1} and ${planet2} remain balanced — conscious intention preserves equilibrium.`;
  } else {
    return `${planet1} and ${planet2} generate tension — patience transforms friction into fortitude.`;
  }
}

function getModeOfUnion(elementalElement: string, planetaryRelationship: string, language: string): string {
  const modes: Record<string, Record<string, string>> = {
    fire: {
      friendly: 'dynamic',
      neutral: 'dynamic',
      challenging: 'complementary'
    },
    water: {
      friendly: 'balance',
      neutral: 'balance',
      challenging: 'balance'
    },
    air: {
      friendly: 'complementary',
      neutral: 'complementary',
      challenging: 'complementary'
    },
    earth: {
      friendly: 'balance',
      neutral: 'balance',
      challenging: 'balance'
    }
  };
  return modes[elementalElement]?.[planetaryRelationship] || 'balance';
}

// ============================================================================
// PERSON ↔ DIVINE NAME RESULT VIEW
// ============================================================================

function PersonDivineNameResultView({ result, language }: { result: PersonDivineNameCompatibility; language: 'en' | 'fr' | 'ar' }) {
  const { t } = useLanguage();
  const { person, divineName, evaluation, spiritualDestiny, nameAction, manifestationGuidance } = result;
  const [activeTab, setActiveTab] = useState<'resonance' | 'guidance' | 'practice'>('resonance');

  const divineTheme = {
    primary: ['#8b5cf6', '#a78bfa'],
    light: 'rgba(139, 92, 246, 0.15)',
    accent: '#a78bfa'
  };

  const tabs = [
    { id: 'resonance' as const, label: t('compatibility.divineNameResults.tabs.resonance'), icon: 'pulse' },
    { id: 'guidance' as const, label: t('compatibility.divineNameResults.tabs.guidance'), icon: 'compass' },
    { id: 'practice' as const, label: t('compatibility.divineNameResults.tabs.practice'), icon: 'book' },
  ];

  const getEffectColor = (effect: string) => {
    if (effect === 'strengthens') return '#22c55e';
    if (effect === 'stabilizes') return '#3b82f6';
    if (effect === 'tempers') return '#f59e0b';
    return '#ef4444';
  };

  const getSpeedColor = (speed: string) => {
    if (speed === 'fast') return '#22c55e';
    if (speed === 'subtle') return '#8b5cf6';
    return '#f59e0b';
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#3b82f6';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <View style={styles.container}>
      {/* Header Card */}
      <LinearGradient
        colors={[divineTheme.light, divineTheme.light]}
        style={styles.headerCard}
      >
        <View style={styles.divineHeader}>
          <View style={styles.personDivineSection}>
            <Text style={styles.nameText}>{person.name}</Text>
            <Text style={styles.arabicNameText}>{person.arabicName}</Text>
          </View>
          
          <View style={styles.heartContainer}>
            <LinearGradient
              colors={divineTheme.primary as any}
              style={styles.heartCircle}
            >
              <Ionicons name="star" size={24} color="#fff" />
            </LinearGradient>
          </View>
          
          <View style={styles.divineNameSection}>
            <Text style={styles.divineNameArabic}>{divineName.arabic}</Text>
            <Text style={styles.divineNameTranslit}>{divineName.transliteration}</Text>
            <Text style={styles.divineNameMeaning}>
              {language === 'ar' ? divineName.meaning.ar : divineName.meaning.en}
            </Text>
          </View>
        </View>
        
        <Text style={styles.headerSubtitle}>
          {t('compatibility.divineNameResults.subtitle')}
        </Text>
      </LinearGradient>

      {/* Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.tabsContainer}
        contentContainerStyle={styles.tabsContent}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => setActiveTab(tab.id)}
            activeOpacity={0.7}
          >
            {activeTab === tab.id ? (
              <LinearGradient
                colors={divineTheme.primary as any}
                style={styles.tab}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Ionicons name={tab.icon as any} size={16} color="#fff" />
                <Text style={styles.tabTextActive}>{tab.label}</Text>
              </LinearGradient>
            ) : (
              <View style={styles.tabInactive}>
                <Ionicons name={`${tab.icon}-outline` as any} size={16} color="#94a3b8" />
                <Text style={styles.tabTextInactive}>{tab.label}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'resonance' && (
          <View style={styles.section}>
            {/* Resonance Score */}
            <LinearGradient
              colors={['rgba(139, 92, 246, 0.2)', 'rgba(167, 139, 250, 0.2)']}
              style={styles.resonanceCard}
            >
              <Text style={styles.resonanceTitle}>
                {t('compatibility.divineNameResults.resonance.title')}
              </Text>
              <CompatibilityGauge
                score={evaluation.resonanceScore}
                label=""
                color={divineTheme.accent}
                size={130}
              />
              <Text style={styles.resonanceSubtext}>
                {t('compatibility.divineNameResults.resonance.subtitle', { person: person.name, name: divineName.transliteration })}
              </Text>
            </LinearGradient>

            {/* Spiritual Destiny (Mod-9) - PRIMARY METRIC */}
            <LinearGradient
              colors={['rgba(139, 92, 246, 0.15)', 'rgba(167, 139, 250, 0.15)']}
              style={styles.detailCard}
            >
              <View style={styles.detailHeader}>
                <View style={styles.detailIconContainer}>
                  <Ionicons name="sparkles" size={28} color="#8b5cf6" />
                </View>
                <Text 
                  style={styles.detailTitle}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {t('compatibility.divineNameResults.resonance.spiritualDestiny.title')}
                </Text>
              </View>

              <View style={styles.divider} />

              {/* Score Display */}
              <View style={styles.spiritualDestinyBox}>
                <Text style={[styles.spiritualScore, { color: getScoreColor(spiritualDestiny.score) }]}>
                  {spiritualDestiny.score}%
                </Text>
                <Text style={[styles.spiritualQuality, { color: getScoreColor(spiritualDestiny.score) }]}>
                  {t(`compatibility.divineNameResults.qualityLabels.${spiritualDestiny.quality}`)}
                </Text>
                <View style={styles.remainderBadge}>
                  <Text style={styles.remainderText}>
                    {t('compatibility.divineNameResults.sacredNumber', { value: spiritualDestiny.remainder })}
                  </Text>
                </View>
              </View>

              {/* Description */}
              <View style={styles.explanationBox}>
                <Text style={styles.explanationTitle}>
                  ✨ {t('compatibility.divineNameResults.explanations.spiritualMeaning.title')}
                </Text>
                <Text style={styles.explanationText}>
                  {t('compatibility.divineNameResults.explanations.spiritualMeaning.description')}
                </Text>
              </View>
            </LinearGradient>

            {/* Name Action */}
            <LinearGradient
              colors={['rgba(34, 197, 94, 0.1)', 'rgba(22, 163, 74, 0.1)']}
              style={styles.detailCard}
            >
              <View style={styles.detailHeader}>
                <View style={styles.detailIconContainer}>
                  <Ionicons name="flash" size={28} color={getEffectColor(nameAction.effect)} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.detailTitle}>
                    {t('compatibility.divineNameResults.resonance.nameAction.title')}
                  </Text>
                  <Text style={[styles.effectBadge, { color: getEffectColor(nameAction.effect) }]}>
                    {t(`compatibility.divineNameResults.effects.${nameAction.effect}`)}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.explanationBox}>
                <Text style={styles.explanationTitle}>
                  {t('compatibility.divineNameResults.resonance.nameAction.divineInfluence')}
                </Text>
                <Text style={styles.explanationText}>
                  {t(`compatibility.divineNameResults.nameActions.${nameAction.effect}.description`, { element: t(`compatibility.divineNameResults.elementLabels.${nameAction.personElement}`) })}
                </Text>
              </View>
            </LinearGradient>

            {/* Element & Planet Harmony */}
            <View style={styles.harmonyGrid}>
              <View style={styles.harmonyCard}>
                <Text style={styles.harmonyLabel}>
                  {t('compatibility.divineNameResults.resonance.profile.element')}
                </Text>
                <Text style={styles.harmonyEmoji}>
                  {divineName.element === 'fire' ? '🔥' : 
                   divineName.element === 'water' ? '💧' :
                   divineName.element === 'air' ? '💨' : '🌱'}
                </Text>
                <Text style={styles.harmonyValue}>
                  {t(`compatibility.divineNameResults.elements.${divineName.element}`)}
                </Text>
              </View>

              <View style={styles.harmonyCard}>
                <Text style={styles.harmonyLabel}>
                  {t('compatibility.divineNameResults.resonance.profile.planet')}
                </Text>
                <Text style={styles.harmonyEmoji}>🌙</Text>
                <Text style={styles.harmonyValue}>
                  {t(`compatibility.divineNameResults.planets.${divineName.planet}`)}
                </Text>
              </View>
            </View>
          </View>
        )}

        {activeTab === 'guidance' && (
          <View style={styles.section}>
            {/* Manifestation Guidance */}
            <LinearGradient
              colors={['rgba(251, 146, 60, 0.1)', 'rgba(249, 115, 22, 0.1)']}
              style={styles.detailCard}
            >
              <View style={styles.detailHeader}>
                <View style={styles.detailIconContainer}>
                  <Ionicons name="hourglass" size={28} color={getSpeedColor(manifestationGuidance.speed)} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.detailTitle}>
                    {t('compatibility.divineNameResults.guidance.manifestation.title')}
                  </Text>
                  <Text style={[styles.effectBadge, { color: getSpeedColor(manifestationGuidance.speed) }]}>
                    {t(`compatibility.divineNameResults.speed.${manifestationGuidance.speed}`)}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.explanationBox}>
                <Text style={styles.explanationTitle}>
                  {t('compatibility.divineNameResults.guidance.manifestation.whatToExpect')}
                </Text>
                <Text style={styles.explanationText}>
                  {manifestationGuidance.speed === 'fast' 
                    ? t(`compatibility.divineNameResults.manifestationSpeed.fast.${manifestationGuidance.personElement}`)
                    : manifestationGuidance.speed === 'delayed' 
                      ? manifestationGuidance.personElement === 'earth'
                        ? t('compatibility.divineNameResults.manifestationSpeed.gradual.earth')
                        : t('compatibility.divineNameResults.manifestationSpeed.gradual.default')
                      : t('compatibility.divineNameResults.manifestationSpeed.subtle.default')
                  }
                </Text>
              </View>
            </LinearGradient>

            {/* Spiritual Guidance */}
            <LinearGradient
              colors={['rgba(139, 92, 246, 0.1)', 'rgba(124, 58, 237, 0.1)']}
              style={styles.adviceCard}
            >
              <View style={styles.adviceHeader}>
                <Ionicons name="bulb" size={28} color="#8b5cf6" />
                <Text style={styles.adviceTitle}>
                  {t('compatibility.divineNameResults.guidance.spiritualWisdom.title')}
                </Text>
              </View>

              <View style={styles.divider} />

              <Text style={styles.guidanceText}>
                {t('compatibility.divineNameResults.spiritualWisdomText')}
              </Text>
            </LinearGradient>
          </View>
        )}

        {activeTab === 'practice' && (
          <View style={styles.section}>
            {/* Classical Function */}
            <LinearGradient
              colors={['rgba(59, 130, 246, 0.1)', 'rgba(37, 99, 235, 0.1)']}
              style={styles.detailCard}
            >
              <View style={styles.detailHeader}>
                <View style={styles.detailIconContainer}>
                  <Ionicons name="book" size={28} color="#3b82f6" />
                </View>
                <Text style={styles.detailTitle}>
                  {t('compatibility.divineNameResults.practice.traditionalUses.title')}
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.functionList}>
                {divineName.classicalFunction.map((func, index) => (
                  <View key={index} style={styles.functionItem}>
                    <View style={styles.functionBullet}>
                      <Text style={styles.functionBulletText}>✓</Text>
                    </View>
                    <Text style={styles.functionText}>
                      {t(`compatibility.divineNameResults.intentions.${func}`)}
                    </Text>
                  </View>
                ))}
              </View>
            </LinearGradient>

            {/* Spiritual Influence */}
            <View style={styles.influenceCard}>
              <Text style={styles.influenceTitle}>
                {t('compatibility.divineNameResults.practice.spiritualInfluence.title')}
              </Text>
              <Text style={styles.influenceText}>
                {language === 'ar' 
                  ? divineName.spiritualInfluence.ar 
                  : divineName.spiritualInfluence.en}
              </Text>
            </View>

            {/* Disclaimer */}
            <View style={styles.disclaimer}>
              <Ionicons name="information-circle-outline" size={20} color="#fbbf24" />
              <Text style={styles.disclaimerText}>
                {t('compatibility.divineNameResults.practice.disclaimer')}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

// ============================================================================
// DIVINE NAME ↔ INTENTION RESULT VIEW
// ============================================================================

function DivineIntentionResultView({ result, language }: { result: DivineNameIntentionCompatibility; language: 'en' | 'fr' | 'ar' }) {
  const { t } = useLanguage();
  
  // Safe translation helper - returns empty string if missing (allows hiding sections)
  const tr = (key: string, params?: any) => {
    try {
      const translated = t(key, params);
      // If translation returns the key itself (meaning it's missing), return empty string
      if (translated === key || !translated) {
        return '';
      }
      return translated;
    } catch {
      return '';
    }
  };
  
  const { divineName, intention, alignment, guidance, alternativeSuggestions } = result;
  const [activeTab, setActiveTab] = useState<'alignment' | 'alternatives' | 'guidance'>('alignment');

  const intentionTheme = {
    primary: ['#f59e0b', '#d97706'],
    light: 'rgba(245, 158, 11, 0.15)',
    accent: '#f59e0b'
  };

  const tabs = [
    { id: 'alignment' as const, label: tr('compatibility.form.divineNameIntention.results.tabs.alignment'), icon: 'checkmark-circle' },
    ...(alternativeSuggestions && alternativeSuggestions.length > 0 
      ? [{ id: 'alternatives' as const, label: tr('compatibility.form.divineNameIntention.results.tabs.alternatives'), icon: 'options' }] 
      : []),
    { id: 'guidance' as const, label: tr('compatibility.form.divineNameIntention.results.tabs.guidance'), icon: 'compass' },
  ];

  const getAlignmentColor = (align: string) => {
    if (align === 'optimal') return '#22c55e';
    if (align === 'suitable') return '#3b82f6';
    if (align === 'neutral') return '#f59e0b';
    return '#ef4444';
  };

  const getAlignmentIcon = (align: string) => {
    if (align === 'optimal') return 'star';
    if (align === 'suitable') return 'checkmark-circle';
    if (align === 'neutral') return 'remove-circle';
    return 'alert-circle';
  };

  const getIntentionEmoji = (intent: string) => {
    const emojiMap: Record<string, string> = {
      clarity: '💡',
      patience: '🕊️',
      provision: '🌾',
      healing: '💚',
      protection: '🛡️',
      guidance: '🧭',
      strength: '💪',
      peace: '☮️',
      knowledge: '📚',
      forgiveness: '🤲'
    };
    return emojiMap[intent] || '✨';
  };

  const getIntentionLabel = (intent: string) => {
    return tr(`compatibility.form.divineNameIntention.results.intentions.${intent}`);
  };
  
  // Helper to convert divine name to translation key format
  const getDivineNameKey = (transliteration: string) => {
    // Convert transliteration to camelCase key format
    const nameMap: Record<string, string> = {
      'Ar-Rahman': 'arRahman',
      'Ar-Raheem': 'arRaheem',
      'Ar-Razzaaq': 'arRazzaaq',
      'Al-Azeez': 'alAzeez',
      'Al-Fattaah': 'alFattaah',
      'Al-Khaliq': 'alKhaliq',
      'Ash-Shafi': 'asShafi',
      'Al-Hakim': 'alHakim',
      'Al-Aleem': 'alAleem',
      'Ash-Shakur': 'asShakur',
      'Al-Hafiz': 'alHafiz',
      'Al-Muqeet': 'alMuqeet',
      'Al-Wahhaab': 'alWahhaab',
      'Al-Haadi': 'alHaadi',
      'As-Subbooh': 'asSubbooh',
      'As-Sabur': 'asSabur',
      'Al-Mujeeb': 'alMujeeb',
      'Al-Wadud': 'alWadud',
      'Al-Ghaffar': 'alGhaffar',
      'Al-Haafiz': 'alHaafiz',
    };
    return nameMap[transliteration] || 'arRahman';
  };

  return (
    <View style={styles.container}>
      {/* Header Card */}
      <LinearGradient
        colors={[intentionTheme.light, intentionTheme.light]}
        style={styles.headerCard}
      >
        <View style={styles.intentionHeader}>
          <View style={styles.intentionBadge}>
            <Text style={styles.intentionEmoji}>
              {getIntentionEmoji(intention)}
            </Text>
            <Text style={styles.intentionLabel}>
              {getIntentionLabel(intention)}
            </Text>
          </View>
          
          <View style={styles.heartContainer}>
            <LinearGradient
              colors={intentionTheme.primary as any}
              style={styles.heartCircle}
            >
              <Ionicons name="arrow-down" size={24} color="#fff" />
            </LinearGradient>
          </View>
          
          <View style={styles.divineNameSection}>
            <Text style={styles.divineNameArabic}>{divineName.arabic}</Text>
            <Text style={styles.divineNameTranslit}>{divineName.transliteration}</Text>
            {(() => {
              const meaning = tr(`compatibility.divineNames.${getDivineNameKey(divineName.transliteration)}.meaning`);
              return meaning ? (
                <Text style={styles.divineNameMeaning}>{meaning}</Text>
              ) : null;
            })()}
          </View>
        </View>
        
        <Text style={styles.headerSubtitle}>
          {tr('compatibility.form.divineNameIntention.results.title')}
        </Text>
      </LinearGradient>

      {/* Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.tabsContainer}
        contentContainerStyle={styles.tabsContent}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => setActiveTab(tab.id)}
            activeOpacity={0.7}
          >
            {activeTab === tab.id ? (
              <LinearGradient
                colors={intentionTheme.primary as any}
                style={styles.tab}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Ionicons name={tab.icon as any} size={16} color="#fff" />
                <Text style={styles.tabTextActive}>{tab.label}</Text>
              </LinearGradient>
            ) : (
              <View style={styles.tabInactive}>
                <Ionicons name={`${tab.icon}-outline` as any} size={16} color="#94a3b8" />
                <Text style={styles.tabTextInactive}>{tab.label}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'alignment' && (
          <View style={styles.section}>
            {/* Alignment Badge */}
            <LinearGradient
              colors={[`${getAlignmentColor(alignment)}20`, `${getAlignmentColor(alignment)}10`]}
              style={styles.alignmentCard}
            >
              <Ionicons 
                name={getAlignmentIcon(alignment) as any} 
                size={64} 
                color={getAlignmentColor(alignment)} 
              />
              <Text style={[styles.alignmentText, { color: getAlignmentColor(alignment) }]}>
                {tr(`compatibility.form.divineNameIntention.results.alignment.${alignment === 'not-recommended' ? 'notRecommended' : alignment}`)}
              </Text>
              <Text style={styles.alignmentSubtext}>
                {tr(`compatibility.form.divineNameIntention.results.alignmentSubtext.${alignment === 'not-recommended' ? 'notRecommended' : alignment}`)}
              </Text>
            </LinearGradient>

            {/* Divine Name Details */}
            <LinearGradient
              colors={['rgba(139, 92, 246, 0.1)', 'rgba(124, 58, 237, 0.1)']}
              style={styles.detailCard}
            >
              <View style={styles.detailHeader}>
                <View style={styles.detailIconContainer}>
                  <Ionicons name="book" size={28} color="#8b5cf6" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.detailTitle}>
                    {tr('compatibility.form.divineNameIntention.results.sections.aboutName')}
                  </Text>
                  <Text style={styles.detailSubtitle}>
                    {divineName.transliteration}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              {/* Classical Functions */}
              <View style={styles.explanationBox}>
                <Text style={styles.explanationTitle}>
                  {tr('compatibility.form.divineNameIntention.results.sections.traditionalUses')}
                </Text>
                <View style={styles.functionList}>
                  {divineName.classicalFunction.map((func, index) => (
                    <View key={index} style={styles.functionItem}>
                      <View style={styles.functionBullet}>
                        <Text style={styles.functionBulletText}>✓</Text>
                      </View>
                      <Text style={styles.functionText}>
                        {tr(`compatibility.form.divineNameIntention.results.intentions.${func}`)}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Element & Planet */}
              <View style={styles.harmonyGrid}>
                <View style={styles.harmonyCard}>
                  <Text style={styles.harmonyLabel}>
                    {tr('compatibility.divineNameResults.resonance.profile.element')}
                  </Text>
                  <Text style={styles.harmonyEmoji}>
                    {divineName.element === 'fire' ? '🔥' : 
                     divineName.element === 'water' ? '💧' :
                     divineName.element === 'air' ? '💨' : '🌱'}
                  </Text>
                  <Text style={styles.harmonyValue}>
                    {tr(`compatibility.divineNameResults.elements.${divineName.element}`)}
                  </Text>
                </View>

                <View style={styles.harmonyCard}>
                  <Text style={styles.harmonyLabel}>
                    {tr('compatibility.form.divineNameIntention.results.expectation.title')}
                  </Text>
                  <Text style={styles.harmonyEmoji}>
                    {divineName.modeOfAction === 'fast' ? '⚡' : 
                     divineName.modeOfAction === 'gradual' ? '🌱' : '💧'}
                  </Text>
                  <Text style={styles.harmonyValue}>
                    {tr(`compatibility.form.divineNameIntention.results.speed.${divineName.modeOfAction}`)}
                  </Text>
                </View>
              </View>
            </LinearGradient>

            {/* Spiritual Influence */}
            {(() => {
              const nameKey = `compatibility.form.divineNames.${getDivineNameKey(divineName.transliteration)}.meaning`;
              const nameMeaning = tr(nameKey);
              const influenceText = nameMeaning ? t('compatibility.form.divineNameIntention.results.spiritualInfluence.body', { name: nameMeaning }) : '';
              
              return influenceText && influenceText !== 'compatibility.form.divineNameIntention.results.spiritualInfluence.body' ? (
                <View style={styles.influenceCard}>
                  <Text style={styles.influenceTitle}>
                    {tr('compatibility.form.divineNameIntention.results.sections.spiritualInfluence')}
                  </Text>
                  <Text style={styles.influenceText}>{influenceText}</Text>
                </View>
              ) : null;
            })()}
          </View>
        )}

        {activeTab === 'alternatives' && alternativeSuggestions && alternativeSuggestions.length > 0 && (
          <View style={styles.section}>
            <View style={styles.alternativesHeader}>
              <Ionicons name="bulb" size={28} color="#f59e0b" />
              <Text style={styles.alternativesTitle}>
                {tr('compatibility.form.divineNameIntention.results.alternatives.title')}
              </Text>
            </View>

            <Text style={styles.alternativesSubtext}>
              {tr('compatibility.form.divineNameIntention.results.alternatives.subtitle')}
            </Text>

            {alternativeSuggestions.map((name, index) => (
              <LinearGradient
                key={name.number}
                colors={['rgba(34, 197, 94, 0.1)', 'rgba(22, 163, 74, 0.1)']}
                style={styles.alternativeCard}
              >
                <View style={styles.alternativeHeader}>
                  <View>
                    <Text style={styles.alternativeArabic}>{name.arabic}</Text>
                    <Text style={styles.alternativeTranslit}>{name.transliteration}</Text>
                  </View>
                  <View style={styles.recommendedBadge}>
                    <Ionicons name="star" size={16} color="#22c55e" />
                    <Text style={styles.recommendedText}>
                      {tr('compatibility.form.divineNameIntention.results.alternatives.recommended')}
                    </Text>
                  </View>
                </View>

                <Text style={styles.alternativeMeaning}>
                  {tr(`compatibility.form.divineNames.${getDivineNameKey(name.transliteration)}.meaning`)}
                </Text>

                <View style={styles.divider} />

                {(() => {
                  const influenceKey = `compatibility.form.divineNames.${getDivineNameKey(name.transliteration)}.shortInfluence`;
                  const influence = tr(influenceKey);
                  return influence ? (
                    <Text style={styles.alternativeInfluence}>
                      {influence}
                    </Text>
                  ) : null;
                })()}

                {/* Functions */}
                {name.classicalFunction && name.classicalFunction.length > 0 && (
                <View style={styles.alternativeFunctions}>
                  {name.classicalFunction.map((func, idx) => {
                    const tagLabel = tr(`compatibility.form.divineNameIntention.results.intentions.${func}`);
                    return tagLabel ? (
                      <View key={idx} style={styles.alternativeFunctionTag}>
                        <Text style={styles.alternativeFunctionText}>
                          {tagLabel}
                        </Text>
                      </View>
                    ) : null;
                  })}
                </View>
                )}
              </LinearGradient>
            ))}
          </View>
        )}

        {activeTab === 'guidance' && (
          <View style={styles.section}>
            {/* Main Guidance */}
            <LinearGradient
              colors={['rgba(59, 130, 246, 0.1)', 'rgba(37, 99, 235, 0.1)']}
              style={styles.guidanceCard}>
              <View style={styles.guidanceHeader}>
                <Ionicons name="compass" size={28} color="#3b82f6" />
                <Text style={styles.guidanceTitle}>
                  {tr('compatibility.form.divineNameIntention.results.guidance.title')}
                </Text>
              </View>

              <View style={styles.divider} />

              <Text style={styles.guidanceMainText}>
                {t(result.guidanceKey, { 
                  name: divineName.transliteration,
                  intention: tr(`compatibility.form.divineNameIntention.results.intentions.${intention}`)
                })}
              </Text>
            </LinearGradient>

            {/* How to Use */}
            <View style={styles.howToUseCard}>
              <Text style={styles.howToUseTitle}>
                {tr('compatibility.form.divineNameIntention.results.practice.title')}
              </Text>
              
              <View style={styles.stepsList}>
                <View style={styles.stepItem}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>1</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>
                      {tr('compatibility.form.divineNameIntention.results.practice.step1.title')}
                    </Text>
                    <Text style={styles.stepText}>
                      {tr('compatibility.form.divineNameIntention.results.practice.step1.desc')}
                    </Text>
                  </View>
                </View>

                <View style={styles.stepItem}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>2</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>
                      {tr('compatibility.form.divineNameIntention.results.practice.step2.title')}
                    </Text>
                    <Text style={styles.stepText}>
                      {tr('compatibility.form.divineNameIntention.results.practice.step2.desc')}
                    </Text>
                  </View>
                </View>

                <View style={styles.stepItem}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>3</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>
                      {tr('compatibility.form.divineNameIntention.results.practice.step3.title')}
                    </Text>
                    <Text style={styles.stepText}>
                      {tr('compatibility.form.divineNameIntention.results.practice.step3.desc')}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Disclaimer */}
            <View style={styles.disclaimer}>
              <Ionicons name="information-circle-outline" size={20} color="#fbbf24" />
              <Text style={styles.disclaimerText}>
                {tr('compatibility.form.divineNameIntention.results.practice.disclaimer')}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  headerCard: {
    padding: 16,
    marginBottom: 12,
  },
  namesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  personSection: {
    flex: 1,
    alignItems: 'center',
  },
  nameText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  arabicNameText: {
    color: '#cbd5e1',
    fontSize: 14,
  },
  heartContainer: {
    marginHorizontal: 16,
  },
  heartCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartEmoji: {
    fontSize: 24,
  },
  headerSubtitle: {
    color: '#94a3b8',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
  tabsContainer: {
    maxHeight: 56,
    marginBottom: 12,
  },
  tabsContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  tabInactive: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    gap: 6,
  },
  tabTextActive: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  tabTextInactive: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 20,
  },
  overallCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  overallLabel: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  qualityText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
  },
  summaryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  summaryTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  summaryText: {
    color: '#cbd5e1',
    fontSize: 15,
    lineHeight: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  statScore: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statTitle: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
  },
  detailCard: {
    borderRadius: 16,
    padding: 16,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 10,
  },
  detailIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  detailTitle: {
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
  },
  detailSubtitle: {
    color: '#94a3b8',
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 14,
  },
  explanationBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 14,
    marginTop: 4,
  },
  explanationTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
  },
  explanationText: {
    color: '#e2e8f0',
    fontSize: 14,
    lineHeight: 21,
  },
  classicalStructure: {
    marginTop: 8,
  },
  classicalSection: {
    marginBottom: 16,
  },
  classicalLabel: {
    color: '#d97706',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  classicalText: {
    color: '#e2e8f0',
    fontSize: 15,
    lineHeight: 24,
  },
  scoreMicroLabel: {
    color: '#94a3b8',
    fontSize: 11,
    fontStyle: 'italic',
    marginTop: 4,
  },
  modeOfUnionCard: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderLeftWidth: 3,
    borderLeftColor: '#8b5cf6',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  modeOfUnionLabel: {
    color: '#a78bfa',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  modeOfUnionText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  insightCard: {
    backgroundColor: 'rgba(217, 119, 6, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  insightLabel: {
    color: '#d97706',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  insightValue: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  traditionalNote: {
    backgroundColor: 'rgba(217, 119, 6, 0.05)',
    borderLeftWidth: 3,
    borderLeftColor: '#d97706',
    borderRadius: 8,
    marginTop: 16,
    overflow: 'hidden',
  },
  traditionalNoteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  traditionalNoteTitle: {
    color: '#d97706',
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
  traditionalNoteContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  traditionalNoteText: {
    color: '#cbd5e1',
    fontSize: 14,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  metadataRow: {
    flexDirection: 'row',
    gap: 12,
  },
  metadataItem: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  metadataLabel: {
    color: '#94a3b8',
    fontSize: 12,
    marginBottom: 4,
  },
  metadataValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  elementBadgeContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  elementBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  elementEmoji: {
    fontSize: 24,
  },
  elementText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  qualityBadge: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 12,
  },
  qualityBadgeText: {
    fontSize: 16,
    fontWeight: '700',
  },
  planetaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  planetCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  planetLabel: {
    color: '#94a3b8',
    fontSize: 12,
    marginBottom: 4,
  },
  planetName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  planetArabic: {
    color: '#cbd5e1',
    fontSize: 14,
  },
  relationshipIndicator: {
    marginHorizontal: 12,
  },
  adviceCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  adviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  adviceTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  recommendationItem: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 12,
  },
  recommendationBullet: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#22c55e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recommendationBulletText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  recommendationText: {
    flex: 1,
    color: '#cbd5e1',
    fontSize: 15,
    lineHeight: 22,
  },
  disclaimer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.3)',
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  disclaimerText: {
    flex: 1,
    color: '#cbd5e1',
    fontSize: 13,
    lineHeight: 20,
  },
  title: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 16,
  },
  placeholderText: {
    color: '#94a3b8',
    fontSize: 16,
    textAlign: 'center',
  },
  // Person-Divine Name specific styles
  divineHeader: {
    alignItems: 'center',
    marginBottom: 12,
  },
  personDivineSection: {
    alignItems: 'center',
    marginBottom: 12,
  },
  divineNameSection: {
    alignItems: 'center',
    marginTop: 12,
  },
  divineNameArabic: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  divineNameTranslit: {
    color: '#a78bfa',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  divineNameMeaning: {
    color: '#cbd5e1',
    fontSize: 14,
    textAlign: 'center',
  },
  resonanceCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  resonanceTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  resonanceSubtext: {
    color: '#cbd5e1',
    fontSize: 15,
    marginTop: 16,
    textAlign: 'center',
  },
  effectBadge: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
  },
  harmonyGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  harmonyCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  harmonyLabel: {
    color: '#94a3b8',
    fontSize: 12,
    marginBottom: 8,
  },
  harmonyEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  harmonyValue: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  guidanceText: {
    color: '#cbd5e1',
    fontSize: 15,
    lineHeight: 24,
  },
  functionList: {
    gap: 10,
  },
  functionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  functionBullet: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  functionBulletText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  functionText: {
    flex: 1,
    color: '#cbd5e1',
    fontSize: 15,
  },
  influenceCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  influenceTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  influenceText: {
    color: '#cbd5e1',
    fontSize: 15,
    lineHeight: 24,
  },
  // Divine Name-Intention specific styles
  intentionHeader: {
    alignItems: 'center',
    marginBottom: 12,
  },
  intentionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 10,
    marginBottom: 12,
  },
  intentionEmoji: {
    fontSize: 24,
  },
  intentionLabel: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  alignmentCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  alignmentText: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  alignmentSubtext: {
    color: '#cbd5e1',
    fontSize: 15,
    textAlign: 'center',
  },
  alternativesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  alternativesTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
  },
  alternativesSubtext: {
    color: '#94a3b8',
    fontSize: 14,
    marginBottom: 16,
  },
  alternativeCard: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  alternativeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  alternativeArabic: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  alternativeTranslit: {
    color: '#22c55e',
    fontSize: 14,
    fontWeight: '600',
  },
  recommendedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
    flexShrink: 1,
  },
  recommendedText: {
    color: '#22c55e',
    fontSize: 12,
    fontWeight: '700',
  },
  alternativeMeaning: {
    color: '#cbd5e1',
    fontSize: 14,
    marginBottom: 12,
  },
  alternativeInfluence: {
    color: '#e2e8f0',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  alternativeFunctions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  alternativeFunctionTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  alternativeFunctionText: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '600',
  },
  guidanceCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  guidanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  guidanceTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  guidanceMainText: {
    color: '#cbd5e1',
    fontSize: 15,
    lineHeight: 24,
  },
  howToUseCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  howToUseTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 14,
  },
  stepsList: {
    gap: 14,
  },
  stepItem: {
    flexDirection: 'row',
    gap: 12,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f59e0b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  stepText: {
    color: '#cbd5e1',
    fontSize: 14,
    lineHeight: 20,
  },
  spiritualDestinyBox: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingBottom: 16,
  },
  spiritualScore: {
    fontSize: 48,
    fontWeight: '700',
    marginBottom: 4,
  },
  spiritualQuality: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  remainderBadge: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'center',
  },
  remainderText: {
    color: '#a78bfa',
    fontSize: 14,
    fontWeight: '600',
  },
  // Two-KPI Layout Styles
  twoKpiContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  kpiCard: {
    flex: 1,
  },
  kpiGradient: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  
  // ============================================================================
  // COMPACT HARMONY CARD STYLES (Premium Mobile UI - Web-Inspired)
  // ============================================================================
  
  harmonyHeader: {
    marginBottom: 20,
  },
  harmonyPageTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 6,
  },
  harmonyPageSubtitle: {
    color: '#94a3b8',
    fontSize: 15,
    lineHeight: 22,
  },
  harmonyCardsContainer: {
    gap: 16,
  },
  
  // Card wrapper (full-width background)
  compactCardWrapper: {
    width: '100%',
  },
  
  // Inner container - constrained only on tablets for readability
  compactCardInner: {
    width: '100%',
    maxWidth: isTablet ? 520 : undefined,
    alignSelf: isTablet ? 'center' : 'stretch',
  },
  
  compactCard: {
    borderRadius: 20,
    padding: 20,
    gap: 16,
  },
  
  // TOP ROW: Horizontal layout (Left: icon+title | Right: ring)
  compactCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  
  compactCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  
  compactCardEmoji: {
    fontSize: 32,
  },
  
  compactCardTitleContainer: {
    flex: 1,
  },
  
  compactCardTitle: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 2,
  },
  
  compactCardSubtitle: {
    color: '#94a3b8',
    fontSize: 13,
    lineHeight: 18,
  },
  
  compactCardRight: {
    flexShrink: 0,
  },
  
  // One-sentence interpretation
  compactCardDescription: {
    color: '#e2e8f0',
    fontSize: 14,
    lineHeight: 21,
  },
  
  // Chips row
  compactCardChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  
  compactChip: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  
  compactChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  
  // Expand button
  compactCardExpandButton: {
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  
  compactCardExpandText: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  
  // Expanded detail area
  compactCardExpanded: {
    gap: 12,
  },
  
  expandedDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 8,
  },
  
  // Detail content styles
  detailContentContainer: {
    gap: 16,
  },
  
  detailSectionContainer: {
    gap: 6,
  },
  
  detailSectionLabel: {
    color: '#d97706',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  
  detailSectionText: {
    color: '#e2e8f0',
    fontSize: 14,
    lineHeight: 22,
  },
  
  // Planetary detail row
  planetaryDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  
  planetDetailCard: {
    flex: 1,
    alignItems: 'center',
  },
  
  planetDetailLabel: {
    color: '#94a3b8',
    fontSize: 11,
    marginBottom: 4,
  },
  
  planetDetailName: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  
  planetDetailArabic: {
    color: '#cbd5e1',
    fontSize: 12,
  },
  
  planetDetailIndicator: {
    paddingHorizontal: 12,
  },
  kpiLabel: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  kpiQuality: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 8,
  },
  kpiMicroLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 6,
  },
  soulConnectionKpi: {
    backgroundColor: 'rgba(217, 119, 6, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(217, 119, 6, 0.3)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  soulConnectionNumber: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 8,
  },
  soulConnectionMeaning: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 4,
    paddingHorizontal: 8,
  },
  independentBadge: {
    backgroundColor: 'rgba(217, 119, 6, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  independentBadgeText: {
    color: '#d97706',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  explanationCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  explanationCardText: {
    color: '#cbd5e1',
    fontSize: 13,
    lineHeight: 20,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  // Soul Connection Tab Styles
  soulConnectionCard: {
    backgroundColor: 'rgba(217, 119, 6, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(217, 119, 6, 0.2)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  soulConnectionHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  iconBadgeContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(217, 119, 6, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  soulConnectionTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  soulConnectionSubtitle: {
    color: '#94a3b8',
    fontSize: 14,
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  contextSelectorContainer: {
    marginBottom: 16,
  },
  contextSelectorLabel: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  contextChips: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 4,
  },
  contextChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  contextChipText: {
    color: '#cbd5e1',
    fontSize: 13,
    fontWeight: '500',
  },
  resultSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  soulConnectionBigNumber: {
    fontSize: 48,
    fontWeight: '700',
    marginTop: -50,
    marginBottom: 8,
  },
  soulConnectionQuality: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  oneLineInterpretation: {
    color: '#cbd5e1',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  expandableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    marginTop: 16,
  },
  expandableTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  formulaSection: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
  },
  formulaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  formulaLabel: {
    color: '#94a3b8',
    fontSize: 14,
  },
  formulaValue: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  formulaText: {
    color: '#d97706',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 12,
  },
  formulaNote: {
    color: '#94a3b8',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  contextNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(217, 119, 6, 0.1)',
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
  },
  contextNoteText: {
    flex: 1,
    color: '#cbd5e1',
    fontSize: 13,
    lineHeight: 18,
  },
  // Harmony Tab Styles (Legacy - keeping for other tabs)
  harmonyScoreCard: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  harmonyTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  harmonySubtitle: {
    color: '#94a3b8',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  harmonyDescription: {
    color: '#cbd5e1',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 16,
  },
  componentsTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
});