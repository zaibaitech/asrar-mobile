import { useProfile } from '@/contexts/ProfileContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { enhanceCompatibilityWithAI, isAIAvailable, loadAISettings } from '@/services/AIReflectionService';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DarkTheme } from '../../constants/DarkTheme';
import { RelationshipCompatibility } from '../../types/compatibility';
import { AIBadge } from '../divine-timing/AIBadge';
import { PremiumSection } from '../subscription/PremiumSection';
import { CompatibilityGauge } from './CompatibilityGauge';

interface RelationshipCompatibilityViewProps {
  analysis: RelationshipCompatibility;
  language?: 'en' | 'fr' | 'ar';
  onReset?: () => void;
}

const { width } = Dimensions.get('window');

export function RelationshipCompatibilityView({ 
  analysis, 
  language = 'en',
  onReset
}: RelationshipCompatibilityViewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'spiritual' | 'elemental' | 'planetary' | 'recommendations'>('overview');
  const isFrench = language === 'fr';
  const isArabic = language === 'ar';
  
  // Subscription state
  const { isPremium, isAdmin } = useSubscription();
  const hasAccess = isPremium || isAdmin;
  
  // AI enhancement state
  const [aiAvailable, setAiAvailable] = useState(false);
  const [aiEnhanced, setAiEnhanced] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [enhancedSummary, setEnhancedSummary] = useState('');
  const [enhancedSpiritualExplanation, setEnhancedSpiritualExplanation] = useState('');
  const [enhancedElementalExplanation, setEnhancedElementalExplanation] = useState('');
  const [enhancedPlanetaryExplanation, setEnhancedPlanetaryExplanation] = useState('');
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
      console.log('[Compatibility] Calling AI enhancement...');
      const response = await enhanceCompatibilityWithAI({
        person1Name: analysis.person1.name,
        person2Name: analysis.person2.name,
        person1Element: analysis.person1.element,
        person2Element: analysis.person2.element,
        overallScore: analysis.overallScore,
        overallQuality: analysis.overallQuality,
        spiritualScore: analysis.methods.spiritualDestiny.score,
        elementalScore: analysis.methods.elementalTemperament.score,
        planetaryScore: analysis.methods.planetaryCosmic.score,
        userElement: profile?.derived?.element,
        userBurj: profile?.derived?.burj,
        tone: settings.tone,
        language: language,
      });
      
      console.log('[Compatibility] AI Response:', response);
      
      if (response.aiAssisted) {
        console.log('[Compatibility] Setting enhanced content...');
        setEnhancedSummary(response.enhancedSummary);
        setEnhancedSpiritualExplanation(response.enhancedSpiritualExplanation);
        setEnhancedElementalExplanation(response.enhancedElementalExplanation);
        setEnhancedPlanetaryExplanation(response.enhancedPlanetaryExplanation);
        setPersonalizedInsight(response.personalizedInsight || '');
        setAiEnhanced(true);
        console.log('[Compatibility] Enhanced state set to true');
      } else {
        console.log('[Compatibility] AI response indicated not assisted');
      }
    } catch (error) {
      console.error('[Compatibility] AI enhancement error:', error);
    } finally {
      setAiLoading(false);
    }
  };
  
  const tabs = [
    { id: 'overview' as const, label: isFrench ? 'Vue d\'ensemble' : 'Overview', icon: 'eye' },
    { id: 'spiritual' as const, label: isFrench ? 'Spirituel' : 'Spiritual', icon: 'sparkles' },
    { id: 'elemental' as const, label: isFrench ? 'Élémental' : 'Elemental', icon: 'leaf' },
    { id: 'planetary' as const, label: isFrench ? 'Planétaire' : 'Planetary', icon: 'planet' },
    { id: 'recommendations' as const, label: isFrench ? 'Conseils' : 'Advice', icon: 'bulb' },
  ];
  
  const getQualityGradient = (score: number): readonly [string, string] => {
    if (score >= 80) return ['#10b981', '#059669'] as const;
    if (score >= 60) return ['#3b82f6', '#2563eb'] as const;
    if (score >= 40) return ['#f59e0b', '#d97706'] as const;
    return ['#ef4444', '#dc2626'] as const;
  };
  
  return (
    <View style={styles.container}>
      {/* Header Card - Compressed */}
      <LinearGradient
        colors={['rgba(236, 72, 153, 0.15)', 'rgba(244, 63, 94, 0.15)']}
        style={styles.headerCard}
      >
        <View style={styles.namesRow}>
          <View style={styles.personSection}>
            <Text style={styles.nameText}>{analysis.person1.name}</Text>
            <Text style={styles.arabicNameText}>{analysis.person1.arabicName}</Text>
          </View>
          
          <View style={styles.heartContainer}>
            <LinearGradient
              colors={['#ec4899', '#f43f5e']}
              style={styles.heartCircle}
            >
              <Ionicons name="heart" size={20} color="#fff" />
            </LinearGradient>
          </View>
          
          <View style={styles.personSection}>
            <Text style={styles.nameText}>{analysis.person2.name}</Text>
            <Text style={styles.arabicNameText}>{analysis.person2.arabicName}</Text>
          </View>
        </View>
        
        <Text style={styles.headerSubtitle}>
          {isFrench ? 'Vue de Compatibilité' : 'Compatibility Overview'}
        </Text>
      </LinearGradient>
      
      {/* Tabs - Compact Pills */}
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
                colors={['#6366f1', '#8b5cf6']}
                style={styles.tab}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Ionicons name={tab.icon as any} size={16} color="#fff" />
                <Text style={styles.tabTextActive}>{tab.label}</Text>
              </LinearGradient>
            ) : (
              <View style={styles.tabInactive}>
                <Ionicons name={`${tab.icon}-outline` as any} size={16} color={DarkTheme.textTertiary} />
                <Text style={styles.tabTextInactive}>{tab.label}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'overview' && (
          <View style={styles.section}>
            {/* Overall Score - Compressed */}
            <LinearGradient
              colors={getQualityGradient(analysis.overallScore)}
              style={styles.overallCard}
            >
              <Text style={styles.overallLabel}>
                {isFrench ? 'Score Global de Compatibilité' : 'Overall Compatibility Score'}
              </Text>
              <CompatibilityGauge
                score={analysis.overallScore}
                label=""
                color="#fff"
                size={130}
              />
              <Text style={styles.qualityText}>{analysis.overallQuality.toUpperCase()}</Text>
            </LinearGradient>
            
            {/* Summary - PREMIUM: Interpretation */}
            <PremiumSection
              featureId="compatibilityDeep"
              title={t('premiumSections.interpretation.title')}
              description={t('premiumSections.interpretation.description')}
              icon="heart"
              variant="compact"
            >
              <View style={styles.summaryCard}>
                <View style={styles.summaryHeader}>
                  <Ionicons name="information-circle" size={24} color="#6366f1" />
                  <Text style={styles.summaryTitle}>
                    {isFrench ? 'Ce que cela signifie' : 'What This Means'}
                  </Text>
                </View>
                <Text style={styles.summaryText}>
                  {aiEnhanced && enhancedSummary ? enhancedSummary : (isFrench ? analysis.summaryFrench : analysis.summary)}
                </Text>
                {aiEnhanced && enhancedSummary && <AIBadge show={true} />}
              </View>
            </PremiumSection>
            
            {/* AI Enhancement Button - PREMIUM */}
            {hasAccess && aiAvailable && !aiEnhanced && (
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
                    {aiLoading 
                      ? (isFrench ? 'Amélioration...' : 'Enhancing...') 
                      : (isFrench ? '✨ Personnaliser l\'Analyse' : '✨ Personalize Analysis')}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
            
            {/* Personalized Insight - PREMIUM */}
            {hasAccess && aiEnhanced && personalizedInsight && (
              <View style={styles.personalizedInsightCard}>
                <View style={styles.insightHeader}>
                  <Ionicons name="person" size={20} color="#8b5cf6" />
                  <Text style={styles.insightTitle}>
                    {isFrench ? '💫 Perspective Personnelle' : '💫 Your Personal Insight'}
                  </Text>
                </View>
                <Text style={styles.insightText}>{personalizedInsight}</Text>
                <AIBadge show={true} />
              </View>
            )}
            
            {/* Method Scores */}
            <View style={styles.methodsGrid}>
              <LinearGradient
                colors={['rgba(251, 146, 60, 0.1)', 'rgba(249, 115, 22, 0.1)']}
                style={styles.methodCard}
              >
                <View style={styles.methodHeader}>
                  <Ionicons name="sparkles" size={20} color="#fb923c" />
                  <Text style={styles.methodLabel}>
                    {isFrench ? 'Spirituel' : 'Spiritual'}
                  </Text>
                </View>
                <CompatibilityGauge
                  score={analysis.methods.spiritualDestiny.score}
                  label=""
                  color="#fb923c"
                  size={100}
                />
              </LinearGradient>
              
              <LinearGradient
                colors={['rgba(34, 197, 94, 0.1)', 'rgba(22, 163, 74, 0.1)']}
                style={styles.methodCard}
              >
                <View style={styles.methodHeader}>
                  <Ionicons name="leaf" size={20} color="#22c55e" />
                  <Text style={styles.methodLabel}>
                    {isFrench ? 'Élémental' : 'Elemental'}
                  </Text>
                </View>
                <CompatibilityGauge
                  score={analysis.methods.elementalTemperament.score}
                  label=""
                  color="#22c55e"
                  size={100}
                />
              </LinearGradient>
              
              <LinearGradient
                colors={['rgba(139, 92, 246, 0.1)', 'rgba(124, 58, 237, 0.1)']}
                style={styles.methodCard}
              >
                <View style={styles.methodHeader}>
                  <Ionicons name="planet" size={20} color="#8b5cf6" />
                  <Text style={styles.methodLabel}>
                    {isFrench ? 'Planétaire' : 'Planetary'}
                  </Text>
                </View>
                <CompatibilityGauge
                  score={analysis.methods.planetaryCosmic.score}
                  label=""
                  color="#8b5cf6"
                  size={100}
                />
              </LinearGradient>
            </View>
          </View>
        )}
        
        {activeTab === 'spiritual' && (
          <View style={styles.section}>
            <PremiumSection
              featureId="compatibilityDeep"
              title={t('premiumSections.spiritualAnalysis.title')}
              description={t('premiumSections.spiritualAnalysis.description')}
              icon="sparkles"
            >
              <LinearGradient
                colors={['rgba(251, 146, 60, 0.1)', 'rgba(249, 115, 22, 0.1)']}
                style={styles.detailCard}
              >
                <View style={styles.detailHeader}>
                  <View style={styles.detailIcon}>
                    <Ionicons name="sparkles" size={28} color="#fb923c" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.detailTitle}>
                      {isFrench ? 'Destinée Spirituelle' : 'Spiritual Destiny'}
                    </Text>
                    <Text style={styles.detailSubtitle}>
                      {isFrench ? 'Chemin spirituel et harmonie' : 'Spiritual path and harmony'}
                    </Text>
                  </View>
                  <CompatibilityGauge
                    score={analysis.methods.spiritualDestiny.score}
                    label=""
                    color="#fb923c"
                    size={80}
                  />
                </View>
                
                <View style={styles.dividerHorizontal} />
                
                <Text style={styles.detailDescription}>
                  {aiEnhanced && enhancedSpiritualExplanation 
                    ? enhancedSpiritualExplanation 
                    : (isFrench 
                      ? analysis.methods.spiritualDestiny.descriptionFrench 
                      : analysis.methods.spiritualDestiny.description)}
              </Text>
              {aiEnhanced && enhancedSpiritualExplanation && (
                <AIBadge show={true} />
              )}
              
              <View style={styles.metadataRow}>
                <View style={styles.metadataItem}>
                  <Text style={styles.metadataLabel}>{isFrench ? 'Qualité' : 'Quality'}</Text>
                  <Text style={[styles.metadataValue, { color: '#fb923c' }]}>
                    {analysis.methods.spiritualDestiny.quality.toUpperCase()}
                  </Text>
                </View>
                <View style={styles.metadataItem}>
                  <Text style={styles.metadataLabel}>{isFrench ? 'Nombre Sacré' : 'Sacred Number'}</Text>
                  <Text style={[styles.metadataValue, { color: '#fb923c' }]}>
                    {analysis.methods.spiritualDestiny.remainder}
                  </Text>
                </View>
              </View>
            </LinearGradient>
            </PremiumSection>
          </View>
        )}
        
        {activeTab === 'elemental' && (
          <View style={styles.section}>
            <PremiumSection
              featureId="compatibilityDeep"
              title={t('premiumSections.elementalAnalysis.title')}
              description={t('premiumSections.elementalAnalysis.description')}
              icon="leaf"
            >
              <LinearGradient
                colors={['rgba(34, 197, 94, 0.1)', 'rgba(22, 163, 74, 0.1)']}
                style={styles.detailCard}
              >
                <View style={styles.detailHeader}>
                <View style={styles.detailIcon}>
                  <Ionicons name="leaf" size={28} color="#22c55e" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.detailTitle}>
                    {isFrench ? 'Tempérament Élémental' : 'Elemental Temperament'}
                  </Text>
                  <Text style={styles.detailSubtitle}>
                    {isFrench ? 'Équilibre des énergies naturelles' : 'Balance of natural energies'}
                  </Text>
                </View>
                <CompatibilityGauge
                  score={analysis.methods.elementalTemperament.score}
                  label=""
                  color="#22c55e"
                  size={80}
                />
              </View>
              
              <View style={styles.dividerHorizontal} />
              
              <Text style={styles.detailDescription}>
                {aiEnhanced && enhancedElementalExplanation 
                  ? enhancedElementalExplanation 
                  : (isFrench 
                    ? analysis.methods.elementalTemperament.descriptionFrench 
                    : analysis.methods.elementalTemperament.description)}
              </Text>
              {aiEnhanced && enhancedElementalExplanation && (
                <AIBadge show={true} />
              )}
              
              <View style={styles.elementBadges}>
                <View style={styles.elementBadge}>
                  <Text style={styles.elementEmoji}>
                    {analysis.methods.elementalTemperament.sharedElement === 'fire' ? '🔥' : 
                     analysis.methods.elementalTemperament.sharedElement === 'water' ? '💧' :
                     analysis.methods.elementalTemperament.sharedElement === 'air' ? '💨' : '🌱'}
                  </Text>
                  <Text style={styles.elementText}>
                    {analysis.methods.elementalTemperament.sharedElement.toUpperCase()}
                  </Text>
                </View>
              </View>
            </LinearGradient>
            </PremiumSection>
          </View>
        )}
        
        {activeTab === 'planetary' && (
          <View style={styles.section}>
            <PremiumSection
              featureId="compatibilityDeep"
              title={t('premiumSections.planetaryAnalysis.title')}
              description={t('premiumSections.planetaryAnalysis.description')}
              icon="planet"
            >
              <LinearGradient
                colors={['rgba(139, 92, 246, 0.1)', 'rgba(124, 58, 237, 0.1)']}
                style={styles.detailCard}
              >
                <View style={styles.detailHeader}>
                  <View style={styles.detailIcon}>
                    <Ionicons name="planet" size={28} color="#8b5cf6" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.detailTitle}>
                      {isFrench ? 'Harmonie Cosmique' : 'Cosmic Harmony'}
                    </Text>
                    <Text style={styles.detailSubtitle}>
                      {isFrench ? 'Influences planétaires' : 'Planetary influences'}
                    </Text>
                  </View>
                  <CompatibilityGauge
                    score={analysis.methods.planetaryCosmic.score}
                    label=""
                    color="#8b5cf6"
                    size={80}
                  />
                </View>
                
                <View style={styles.dividerHorizontal} />
                
                <Text style={styles.detailDescription}>
                  {aiEnhanced && enhancedPlanetaryExplanation 
                  ? enhancedPlanetaryExplanation 
                  : (isFrench 
                    ? analysis.methods.planetaryCosmic.descriptionFrench 
                    : analysis.methods.planetaryCosmic.description)}
              </Text>
              {aiEnhanced && enhancedPlanetaryExplanation && (
                <AIBadge show={true} />
              )}
              
              <View style={styles.planetaryRow}>
                <View style={styles.planetCard}>
                  <Text style={styles.planetLabel}>{analysis.person1.name}</Text>
                  <Text style={styles.planetName}>
                    {analysis.methods.planetaryCosmic.person1Planet.name}
                  </Text>
                  <Text style={styles.planetArabic}>
                    {analysis.methods.planetaryCosmic.person1Planet.nameArabic}
                  </Text>
                </View>
                
                <View style={styles.relationshipIndicator}>
                  <Ionicons 
                    name={
                      analysis.methods.planetaryCosmic.relationship === 'friendly' ? 'heart' :
                      analysis.methods.planetaryCosmic.relationship === 'neutral' ? 'remove-circle' :
                      'alert-circle'
                    } 
                    size={24} 
                    color={
                      analysis.methods.planetaryCosmic.relationship === 'friendly' ? '#22c55e' :
                      analysis.methods.planetaryCosmic.relationship === 'neutral' ? '#f59e0b' :
                      '#ef4444'
                    }
                  />
                </View>
                
                <View style={styles.planetCard}>
                  <Text style={styles.planetLabel}>{analysis.person2.name}</Text>
                  <Text style={styles.planetName}>
                    {analysis.methods.planetaryCosmic.person2Planet.name}
                  </Text>
                  <Text style={styles.planetArabic}>
                    {analysis.methods.planetaryCosmic.person2Planet.nameArabic}
                  </Text>
                </View>
              </View>
            </LinearGradient>
            </PremiumSection>
          </View>
        )}
        
        {activeTab === 'recommendations' && (
          <View style={styles.section}>
            <PremiumSection
              featureId="compatibilityDeep"
              title={t('premiumSections.personalizedAdvice.title')}
              description={t('premiumSections.personalizedAdvice.description')}
              icon="bulb"
            >
              <View style={styles.recommendationsHeader}>
                <LinearGradient
                  colors={['#f59e0b', '#d97706']}
                  style={styles.recommendationsIcon}
                >
                  <Ionicons name="bulb" size={28} color="#fff" />
                </LinearGradient>
                <Text style={styles.recommendationsTitle}>
                  {isFrench ? 'Recommandations' : 'Recommendations'}
                </Text>
                <Text style={styles.recommendationsSubtitle}>
                  {isFrench 
                    ? 'Conseils pour améliorer votre harmonie'
                    : 'Guidance to enhance your harmony'}
                </Text>
              </View>
              
              {(isFrench ? analysis.recommendationsFrench : analysis.recommendations).map((rec, index) => (
                <View key={index} style={styles.recommendationCard}>
                  <View style={styles.recommendationNumber}>
                    <Text style={styles.recommendationNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.recommendationText}>{rec}</Text>
                </View>
              ))}
            </PremiumSection>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DarkTheme.screenBackground,
  },
  headerCard: {
    padding: 14,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: DarkTheme.borderSubtle,
  },
  namesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  personSection: {
    flex: 1,
    alignItems: 'center',
  },
  nameText: {
    fontSize: 15,
    fontWeight: '600',
    color: DarkTheme.textPrimary,
    marginBottom: 3,
  },
  arabicNameText: {
    fontSize: 13,
    color: DarkTheme.textTertiary,
  },
  heartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSubtitle: {
    fontSize: 12,
    color: DarkTheme.textMuted,
    textAlign: 'center',
    fontWeight: '500',
  },
  tabsContainer: {
    maxHeight: 50,
    borderBottomWidth: 1,
    borderBottomColor: DarkTheme.borderSubtle,
  },
  tabsContent: {
    paddingHorizontal: 12,
    gap: 6,
    paddingVertical: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
  },
  tabInactive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: DarkTheme.cardBackground,
    borderRadius: 16,
  },
  tabTextActive: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  tabTextInactive: {
    fontSize: 12,
    fontWeight: '500',
    color: DarkTheme.textTertiary,
  },
  content: {
    flex: 1,
    padding: 14,
  },
  section: {
    gap: 14,
    paddingBottom: 24,
  },
  overallCard: {
    padding: 20,
    borderRadius: 18,
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  overallLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  qualityText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 0.8,
  },
  summaryCard: {
    backgroundColor: DarkTheme.cardBackground,
    padding: 20,
    borderRadius: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: DarkTheme.borderSubtle,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: DarkTheme.textPrimary,
  },
  summaryText: {
    fontSize: 14,
    color: DarkTheme.textSecondary,
    lineHeight: 22,
  },
  methodsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  methodCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: DarkTheme.borderSubtle,
  },
  methodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  methodLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: DarkTheme.textPrimary,
  },
  detailCard: {
    padding: 20,
    borderRadius: 16,
    gap: 16,
    borderWidth: 1,
    borderColor: DarkTheme.borderSubtle,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: DarkTheme.textPrimary,
  },
  detailSubtitle: {
    fontSize: 13,
    color: DarkTheme.textTertiary,
    marginTop: 2,
  },
  dividerHorizontal: {
    height: 1,
    backgroundColor: DarkTheme.borderSubtle,
  },
  detailDescription: {
    fontSize: 14,
    color: DarkTheme.textSecondary,
    lineHeight: 22,
  },
  metadataRow: {
    flexDirection: 'row',
    gap: 16,
  },
  metadataItem: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 12,
    borderRadius: 12,
  },
  metadataLabel: {
    fontSize: 11,
    color: DarkTheme.textMuted,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  metadataValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  elementBadges: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  elementBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  elementEmoji: {
    fontSize: 20,
  },
  elementText: {
    fontSize: 14,
    fontWeight: '600',
    color: DarkTheme.textPrimary,
  },
  planetaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  planetCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  planetLabel: {
    fontSize: 11,
    color: DarkTheme.textMuted,
    marginBottom: 6,
  },
  planetName: {
    fontSize: 15,
    fontWeight: '600',
    color: DarkTheme.textPrimary,
    marginBottom: 2,
  },
  planetArabic: {
    fontSize: 13,
    color: DarkTheme.textTertiary,
  },
  relationshipIndicator: {
    padding: 8,
  },
  recommendationsHeader: {
    alignItems: 'center',
    marginBottom: 8,
  },
  recommendationsIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  recommendationsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: DarkTheme.textPrimary,
    marginBottom: 4,
  },
  recommendationsSubtitle: {
    fontSize: 13,
    color: DarkTheme.textTertiary,
  },
  recommendationCard: {
    flexDirection: 'row',
    backgroundColor: DarkTheme.cardBackground,
    padding: 16,
    borderRadius: 12,
    gap: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#f59e0b',
  },
  recommendationNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f59e0b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recommendationNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    color: DarkTheme.textSecondary,
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
  personalizedInsightCard: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    borderRadius: 12,
    padding: 16,
    gap: 8,
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
    color: DarkTheme.textPrimary,
  },
  insightText: {
    fontSize: 14,
    color: DarkTheme.textSecondary,
    lineHeight: 20,
  },
});

