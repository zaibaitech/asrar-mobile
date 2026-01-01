/**
 * Enhanced Universal Compatibility Results View
 * Professional UI with dynamic theming and simplified explanations
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type {
    DivineNameIntentionCompatibility,
    PersonDivineNameCompatibility,
    PersonPersonCompatibility,
    UniversalCompatibilityResult
} from '../../services/compatibility/types';
import { CompatibilityGauge } from './CompatibilityGauge';

const { width } = Dimensions.get('window');

interface CompatibilityResultViewProps {
  result: UniversalCompatibilityResult;
  language: 'en' | 'ar';
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

function PersonPersonResultView({ result, language }: { result: PersonPersonCompatibility; language: 'en' | 'ar' }) {
  const { person1, person2, relationshipCompatibility, relationshipContext } = result;
  const rc = relationshipCompatibility;
  const methods = rc.methods;
  const theme = RELATIONSHIP_THEMES[relationshipContext];
  
  const [activeTab, setActiveTab] = useState<'overview' | 'spiritual' | 'elemental' | 'planetary' | 'daily' | 'advice'>('overview');

  const tabs = [
    { id: 'overview' as const, label: language === 'en' ? 'Overview' : 'نظرة عامة', icon: 'eye' },
    { id: 'spiritual' as const, label: language === 'en' ? 'Spiritual' : 'روحاني', icon: 'sparkles' },
    { id: 'elemental' as const, label: language === 'en' ? 'Elemental' : 'عنصري', icon: 'leaf' },
    { id: 'planetary' as const, label: language === 'en' ? 'Planetary' : 'كوكبي', icon: 'planet' },
    { id: 'daily' as const, label: language === 'en' ? 'Daily' : 'يومي', icon: 'calendar' },
    { id: 'advice' as const, label: language === 'en' ? 'Advice' : 'نصائح', icon: 'bulb' },
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
          {language === 'en' ? `${relationshipContext.charAt(0).toUpperCase() + relationshipContext.slice(1)} Compatibility` : 'تحليل التوافق'}
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
          />
        )}
        
        {activeTab === 'spiritual' && (
          <SpiritualTab 
            method={methods.spiritualDestiny} 
            person1Name={person1.name}
            person2Name={person2.name}
            language={language} 
          />
        )}
        
        {activeTab === 'elemental' && (
          <ElementalTab 
            method={methods.elementalTemperament} 
            language={language} 
          />
        )}
        
        {activeTab === 'planetary' && (
          <PlanetaryTab 
            method={methods.planetaryCosmic}
            person1Name={person1.name}
            person2Name={person2.name}
            language={language} 
          />
        )}
        
        {activeTab === 'daily' && (
          <DailyTab 
            method={methods.dailyInteraction}
            person1Name={person1.name}
            person2Name={person2.name}
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
// TAB COMPONENTS
// ============================================================================

function OverviewTab({ rc, theme, language, getQualityGradient }: any) {
  const modeOfUnion = getModeOfUnion(
    rc.methods.elementalTemperament.sharedElement,
    rc.methods.planetaryCosmic.relationship,
    language
  );

  return (
    <View style={styles.section}>
      {/* Overall Score */}
      <LinearGradient
        colors={getQualityGradient(rc.overallScore)}
        style={styles.overallCard}
      >
        <Text style={styles.overallLabel}>
          {language === 'en' ? 'Overall Compatibility' : 'التوافق الشامل'}
        </Text>
        <CompatibilityGauge
          score={rc.overallScore}
          label=""
          color="#fff"
          size={130}
        />
        <Text style={styles.qualityText}>
          {language === 'en' ? rc.overallQuality.toUpperCase() : rc.overallQualityArabic}
        </Text>
        <Text style={styles.scoreMicroLabel}>
          {language === 'en' ? 'Tendency, not certainty' : 'الميل، وليس اليقين'}
        </Text>
      </LinearGradient>

      {/* Mode of Union Card */}
      <View style={styles.modeOfUnionCard}>
        <Text style={styles.modeOfUnionLabel}>
          {language === 'en' ? '🜂 MODE OF UNION' : '🜂 نمط الاتحاد'}
        </Text>
        <Text style={styles.modeOfUnionText}>{modeOfUnion}</Text>
      </View>

      {/* Summary */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <Ionicons name="information-circle" size={24} color={theme.primary[0]} />
          <Text style={styles.summaryTitle}>
            {language === 'en' ? 'Summary' : 'الملخص'}
          </Text>
        </View>
        <Text style={styles.summaryText}>
          {language === 'en' ? rc.summary : rc.summaryArabic}
        </Text>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsGrid}>
        <StatCard
          title={language === 'en' ? 'Spiritual' : 'روحاني'}
          score={rc.methods.spiritualDestiny.score}
          color={METHOD_THEMES.spiritual.color}
          emoji={METHOD_THEMES.spiritual.emoji}
        />
        <StatCard
          title={language === 'en' ? 'Elemental' : 'عنصري'}
          score={rc.methods.elementalTemperament.score}
          color={METHOD_THEMES.elemental.color}
          emoji={METHOD_THEMES.elemental.emoji}
        />
        <StatCard
          title={language === 'en' ? 'Planetary' : 'كوكبي'}
          score={rc.methods.planetaryCosmic.score}
          color={METHOD_THEMES.planetary.color}
          emoji={METHOD_THEMES.planetary.emoji}
        />
        <StatCard
          title={language === 'en' ? 'Daily' : 'يومي'}
          score={rc.methods.dailyInteraction.score}
          color={METHOD_THEMES.daily.color}
          emoji={METHOD_THEMES.daily.emoji}
        />
      </View>
    </View>
  );
}

function SpiritualTab({ method, person1Name, person2Name, language }: any) {
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
              {language === 'en' ? 'Spiritual Destiny' : 'القدر الروحاني'}
            </Text>
            <Text style={styles.detailSubtitle}>
              {language === 'en' ? 'Spiritual consonance (taʾāluf rūḥānī)' : 'التآلف الروحاني'}
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
              {language === 'en' ? '🌿 Meaning' : '🌿 المعنى'}
            </Text>
            <Text style={styles.classicalText}>
              {language === 'en' 
                ? `${person1Name} and ${person2Name}'s spiritual paths ${method.quality === 'harmonious' || method.score >= 70 ? 'align naturally' : method.score >= 40 ? 'can align through cultivation' : 'diverge, calling for patience'}. ${getSimplifiedSpiritual(method.remainder, language)}`
                : method.descriptionArabic}
            </Text>
          </View>

          <View style={styles.classicalSection}>
            <Text style={styles.classicalLabel}>
              {language === 'en' ? '⚡ Test' : '⚡ الاختبار'}
            </Text>
            <Text style={styles.classicalText}>
              {language === 'en' 
                ? method.score >= 70 ? 'Harmony may feel effortless — avoid complacency; intention preserves alignment.' : method.score >= 40 ? 'Differences surface when expectations rush or patience wanes — gentleness restores balance.' : 'Fundamental tensions arise frequently — this path requires continuous conscious effort.'
                : 'الاختلافات تظهر عندما تتسرع التوقعات أو يقل الصبر.'}
            </Text>
          </View>

          <View style={styles.classicalSection}>
            <Text style={styles.classicalLabel}>
              {language === 'en' ? '🔑 Key to Success' : '🔑 مفتاح النجاح'}
            </Text>
            <Text style={styles.classicalText}>
              {language === 'en' 
                ? method.score >= 70 ? 'Continue shared spiritual practice with gratitude and humility.' : method.score >= 40 ? 'Consistency, gentleness, and honoring each other\'s rhythm strengthen this bond.' : 'If pursuing this connection, prioritize independent spiritual cultivation first.'
                : 'الاتساق والرفق والإيقاع المشترك يقوي هذه الرابطة.'}
            </Text>
          </View>
        </View>

        {/* Metadata */}
        <View style={styles.metadataRow}>
          <View style={styles.metadataItem}>
            <Text style={styles.metadataLabel}>
              {language === 'en' ? 'Quality' : 'الجودة'}
            </Text>
            <Text style={[styles.metadataValue, { color: theme.color }]}>
              {language === 'en' ? method.quality.toUpperCase() : method.qualityArabic}
            </Text>
          </View>
          <View style={styles.metadataItem}>
            <Text style={styles.metadataLabel}>
              {language === 'en' ? 'Sacred Number' : 'الرقم المقدس'}
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
              {language === 'en' ? 'Elemental Temperament' : 'المزاج العنصري'}
            </Text>
            <Text style={styles.detailSubtitle}>
              {language === 'en' ? 'Natural energy balance' : 'توازن الطاقة الطبيعية'}
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
            {language === 'en' ? 'Balance Type' : 'نوع التوازن'}
          </Text>
          <Text style={styles.insightValue}>
            {language === 'en' 
              ? method.score >= 80 ? 'Reinforcing' : method.score >= 60 ? 'Complementary' : 'Tempering'
              : method.score >= 80 ? 'معزز' : method.score >= 60 ? 'متكامل' : 'معتدل'}
          </Text>
        </View>

        {/* Element Badge */}
        <View style={styles.elementBadgeContainer}>
          <View style={styles.elementBadge}>
            <Text style={styles.elementEmoji}>
              {elementEmoji[method.sharedElement as keyof typeof elementEmoji]}
            </Text>
            <Text style={styles.elementText}>
              {method.sharedElement.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* 3-Part Classical Structure */}
        <View style={styles.classicalStructure}>
          <View style={styles.classicalSection}>
            <Text style={styles.classicalLabel}>
              {language === 'en' ? '🌿 Meaning' : '🌿 المعنى'}
            </Text>
            <Text style={styles.classicalText}>
              {language === 'en' 
                ? getSimplifiedElemental(method.sharedElement, language)
                : method.descriptionArabic}
            </Text>
          </View>

          <View style={styles.classicalSection}>
            <Text style={styles.classicalLabel}>
              {language === 'en' ? '⚡ Test' : '⚡ الاختبار'}
            </Text>
            <Text style={styles.classicalText}>
              {language === 'en' 
                ? method.sharedElement === 'fire' ? 'Intensity may overwhelm — channel heat toward shared purpose, not conflict.' : method.sharedElement === 'water' ? 'Emotions may flood — honor boundaries while maintaining empathy.' : method.sharedElement === 'air' ? 'Mental stimulation may scatter — ground ideas in action.' : 'Routines may rigidify — preserve stability while allowing gentle adaptation.'
                : 'الاختبارات تظهر عندما تضطرب الروتين'}
            </Text>
          </View>

          <View style={styles.classicalSection}>
            <Text style={styles.classicalLabel}>
              {language === 'en' ? '🔑 Key to Success' : '🔑 مفتاح النجاح'}
            </Text>
            <Text style={styles.classicalText}>
              {language === 'en' 
                ? method.sharedElement === 'fire' ? 'Direct shared passion toward constructive goals; celebrate victories together.' : method.sharedElement === 'water' ? 'Create space for emotional expression; listen without fixing.' : method.sharedElement === 'air' ? 'Balance dialogue with silence; let ideas settle before acting.' : 'Build rhythms together; let consistency become your foundation.'
                : 'بناء الإيقاعات معًا'}
            </Text>
          </View>
        </View>

        {/* Quality Badge */}
        <View style={styles.qualityBadge}>
          <Text style={[styles.qualityBadgeText, { color: theme.color }]}>
            {language === 'en' ? method.quality.toUpperCase() : method.qualityArabic}
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
}

function PlanetaryTab({ method, person1Name, person2Name, language }: any) {
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
              {language === 'en' ? 'Cosmic Harmony' : 'الانسجام الكوني'}
            </Text>
            <Text style={styles.detailSubtitle}>
              {language === 'en' ? 'Planetary influences' : 'التأثيرات الكوكبية'}
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
            {language === 'en' ? 'Dominant Influence' : 'التأثير المهيمن'}
          </Text>
          <Text style={styles.insightValue}>
            {language === 'en' 
              ? method.relationship === 'friendly' ? `${method.person1Planet.name} & ${method.person2Planet.name} support` : method.relationship === 'neutral' ? 'Balanced influences' : `Tension requires patience`
              : method.relationship === 'friendly' ? 'تأثيرات داعمة' : 'تأثيرات متوازنة'}
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
              {language === 'en' ? '🌿 Meaning' : '🌿 المعنى'}
            </Text>
            <Text style={styles.classicalText}>
              {language === 'en' 
                ? getSimplifiedPlanetary(method.relationship, method.person1Planet.name, method.person2Planet.name, language)
                : method.descriptionArabic}
            </Text>
          </View>

          <View style={styles.classicalSection}>
            <Text style={styles.classicalLabel}>
              {language === 'en' ? '⚡ Test' : '⚡ الاختبار'}
            </Text>
            <Text style={styles.classicalText}>
              {language === 'en' 
                ? method.relationship === 'friendly' ? 'Natural ease may breed assumption — maintain gratitude and intention.' : method.relationship === 'neutral' ? 'Subtle imbalances emerge when one influence dominates — honor both energies equally.' : 'Conflicting impulses arise frequently — recognize which influence serves the moment.'
                : 'الاختبارات تظهر'}
            </Text>
          </View>

          <View style={styles.classicalSection}>
            <Text style={styles.classicalLabel}>
              {language === 'en' ? '🔑 Key to Success' : '🔑 مفتاح النجاح'}
            </Text>
            <Text style={styles.classicalText}>
              {language === 'en' 
                ? method.relationship === 'friendly' ? 'Flow with supportive influences while remaining grounded in shared values.' : method.relationship === 'neutral' ? 'Acknowledge differences without judgment; find complementary rhythms.' : 'When tension rises, pause; let patience reveal the wiser path forward.'
                : 'الصبر يكشف الطريق'}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

function DailyTab({ method, person1Name, person2Name, language }: any) {
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
              {language === 'en' ? 'Daily Interaction' : 'التفاعل اليومي'}
            </Text>
            <Text style={styles.detailSubtitle}>
              {language === 'en' ? 'Day-to-day dynamics' : 'الديناميكيات اليومية'}
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
            {language === 'en' ? 'Best Rhythm' : 'أفضل إيقاع'}
          </Text>
          <Text style={styles.insightValue}>
            {language === 'en' 
              ? 'Calm days benefit this pairing more than rushed cycles'
              : 'الأيام الهادئة تنفع هذه العلاقة'}
          </Text>
        </View>

        {/* 3-Part Classical Structure */}
        <View style={styles.classicalStructure}>
          <View style={styles.classicalSection}>
            <Text style={styles.classicalLabel}>
              {language === 'en' ? '🌿 Meaning' : '🌿 المعنى'}
            </Text>
            <Text style={styles.classicalText}>
              {language === 'en' 
                ? `In daily life, ${person1Name} and ${person2Name} experience ${method.quality} rhythms. ${method.description}`
                : method.descriptionArabic}
            </Text>
          </View>

          <View style={styles.classicalSection}>
            <Text style={styles.classicalLabel}>
              {language === 'en' ? '⚡ Test' : '⚡ الاختبار'}
            </Text>
            <Text style={styles.classicalText}>
              {language === 'en' 
                ? method.score >= 70 ? 'Routines may become mechanical — infuse intention into ordinary moments.' : 'Rushed days amplify friction — slow down when imbalance appears.'
                : 'الأيام المتسرعة تزيد التوتر'}
            </Text>
          </View>

          <View style={styles.classicalSection}>
            <Text style={styles.classicalLabel}>
              {language === 'en' ? '🔑 Key to Success' : '🔑 مفتاح النجاح'}
            </Text>
            <Text style={styles.classicalText}>
              {language === 'en' 
                ? 'Calm days benefit this pairing more than hurried cycles — protect shared stillness.'
                : 'الأيام الهادئة تنفع هـذه العلاقة'}
            </Text>
          </View>
        </View>

        {/* Interaction Type */}
        <View style={styles.qualityBadge}>
          <Text style={[styles.qualityBadgeText, { color: theme.color }]}>
            {language === 'en' ? method.interactionType.toUpperCase() : method.interactionTypeArabic}
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
}

function AdviceTab({ rc, theme, language }: any) {
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
            {language === 'en' ? 'Spiritual Guidance' : 'الإرشاد الروحي'}
          </Text>
        </View>

        <View style={styles.divider} />

        {(language === 'en' ? rc.recommendations : rc.recommendationsArabic).map((rec: string, index: number) => (
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
function TraditionalNote({ language }: { language: 'en' | 'ar' }) {
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
          {language === 'en' ? '📜 Traditional Note' : '📜 ملاحظة تقليدية'}
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
            {language === 'en' 
              ? 'Compatibility reflects tendencies of harmony, not certainty. Preservation depends on intention (niyyah), character (khuluṱ), and timing (waqt). This analysis offers reflection within ʿIlm al-Asrār — not fortune-telling, not guarantees.'
              : 'التوافق يعكس الميول المتناغمة، وليس اليقين. الحفظ يعتمد على النية والخلق والتوقيت.'}
          </Text>
        </View>
      )}
    </View>
  );
}

// Helper Components
function StatCard({ title, score, color, emoji }: any) {
  const getMicroLabel = (title: string): string => {
    if (title.includes('Spiritual') || title.includes('روحاني')) return 'Alignment, not completion';
    if (title.includes('Elemental') || title.includes('عنصري')) return 'Natural ease';
    if (title.includes('Planetary') || title.includes('كوكبي')) return 'Supportive influences';
    if (title.includes('Daily') || title.includes('يومي')) return 'Day-to-day flow';
    return '';
  };

  return (
    <View style={[styles.statCard, { borderColor: color + '40' }]}>
      <Text style={styles.statEmoji}>{emoji}</Text>
      <Text style={[styles.statScore, { color }]}>{score}%</Text>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.scoreMicroLabel}>{getMicroLabel(title)}</Text>
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
      friendly: 'Union through shared purpose',
      neutral: 'Union through directed motion',
      challenging: 'Union through constructive tension'
    },
    water: {
      friendly: 'Union through emotional depth',
      neutral: 'Union through patient flow',
      challenging: 'Union through gentle persistence'
    },
    air: {
      friendly: 'Union through dialogue',
      neutral: 'Union through mutual understanding',
      challenging: 'Union through thoughtful exchange'
    },
    earth: {
      friendly: 'Union through stability',
      neutral: 'Union through consistent rhythm',
      challenging: 'Union through gradual cultivation'
    }
  };
  return language === 'en' ? (modes[elementalElement]?.[planetaryRelationship] || 'Union through balance') : 'الاتحاد من خلال التوازن';
}

// ============================================================================
// PERSON ↔ DIVINE NAME RESULT VIEW
// ============================================================================

function PersonDivineNameResultView({ result, language }: { result: PersonDivineNameCompatibility; language: 'en' | 'ar' }) {
  const { person, divineName, evaluation, spiritualDestiny, nameAction, manifestationGuidance } = result;
  const [activeTab, setActiveTab] = useState<'resonance' | 'guidance' | 'practice'>('resonance');

  const divineTheme = {
    primary: ['#8b5cf6', '#a78bfa'],
    light: 'rgba(139, 92, 246, 0.15)',
    accent: '#a78bfa'
  };

  const tabs = [
    { id: 'resonance' as const, label: language === 'en' ? 'Resonance' : 'الرنين', icon: 'pulse' },
    { id: 'guidance' as const, label: language === 'en' ? 'Guidance' : 'الإرشاد', icon: 'compass' },
    { id: 'practice' as const, label: language === 'en' ? 'Practice' : 'الممارسة', icon: 'book' },
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
              {language === 'en' ? divineName.meaning.en : divineName.meaning.ar}
            </Text>
          </View>
        </View>
        
        <Text style={styles.headerSubtitle}>
          {language === 'en' ? 'Divine Name Resonance Analysis' : 'تحليل رنين الاسم الإلهي'}
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
                {language === 'en' ? 'Spiritual Resonance' : 'الرنين الروحاني'}
              </Text>
              <CompatibilityGauge
                score={evaluation.resonanceScore}
                label=""
                color={divineTheme.accent}
                size={130}
              />
              <Text style={styles.resonanceSubtext}>
                {language === 'en' 
                  ? `${person.name}'s energy aligns with ${divineName.transliteration}` 
                  : `طاقة ${person.name} تتوافق مع ${divineName.arabic}`}
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
                <Text style={styles.detailTitle}>
                  {language === 'en' ? 'Spiritual Destiny (Primary)' : 'القدر الروحاني (أساسي)'}
                </Text>
              </View>

              <View style={styles.divider} />

              {/* Score Display */}
              <View style={styles.spiritualDestinyBox}>
                <Text style={[styles.spiritualScore, { color: getScoreColor(spiritualDestiny.score) }]}>
                  {spiritualDestiny.score}%
                </Text>
                <Text style={[styles.spiritualQuality, { color: getScoreColor(spiritualDestiny.score) }]}>
                  {language === 'en' 
                    ? spiritualDestiny.quality.toUpperCase().replace('-', ' ')
                    : spiritualDestiny.qualityArabic}
                </Text>
                <View style={styles.remainderBadge}>
                  <Text style={styles.remainderText}>
                    {language === 'en' ? 'Mod-9 Remainder:' : 'الباقي:'} {spiritualDestiny.remainder}
                  </Text>
                </View>
              </View>

              {/* Description */}
              <View style={styles.explanationBox}>
                <Text style={styles.explanationTitle}>
                  {language === 'en' ? '✨ Spiritual Meaning' : '✨ المعنى الروحاني'}
                </Text>
                <Text style={styles.explanationText}>
                  {language === 'en' 
                    ? spiritualDestiny.description 
                    : spiritualDestiny.descriptionArabic}
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
                    {language === 'en' ? 'How This Name Acts Upon You' : 'كيف يؤثر هذا الاسم عليك'}
                  </Text>
                  <Text style={[styles.effectBadge, { color: getEffectColor(nameAction.effect) }]}>
                    {nameAction.effect.toUpperCase()}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.explanationBox}>
                <Text style={styles.explanationTitle}>
                  {language === 'en' ? '💫 Divine Influence' : '💫 التأثير الإلهي'}
                </Text>
                <Text style={styles.explanationText}>
                  {language === 'en' ? nameAction.explanation.en : nameAction.explanation.ar}
                </Text>
              </View>
            </LinearGradient>

            {/* Element & Planet Harmony */}
            <View style={styles.harmonyGrid}>
              <View style={styles.harmonyCard}>
                <Text style={styles.harmonyLabel}>
                  {language === 'en' ? 'Element' : 'العنصر'}
                </Text>
                <Text style={styles.harmonyEmoji}>
                  {divineName.element === 'fire' ? '🔥' : 
                   divineName.element === 'water' ? '💧' :
                   divineName.element === 'air' ? '💨' : '🌱'}
                </Text>
                <Text style={styles.harmonyValue}>
                  {divineName.element.toUpperCase()}
                </Text>
              </View>

              <View style={styles.harmonyCard}>
                <Text style={styles.harmonyLabel}>
                  {language === 'en' ? 'Planet' : 'الكوكب'}
                </Text>
                <Text style={styles.harmonyEmoji}>🌙</Text>
                <Text style={styles.harmonyValue}>
                  {divineName.planet}
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
                    {language === 'en' ? 'Manifestation Timeline' : 'جدول التجلي'}
                  </Text>
                  <Text style={[styles.effectBadge, { color: getSpeedColor(manifestationGuidance.speed) }]}>
                    {manifestationGuidance.speed.toUpperCase()}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.explanationBox}>
                <Text style={styles.explanationTitle}>
                  {language === 'en' ? '⏳ What to Expect' : '⏳ ما يمكن توقعه'}
                </Text>
                <Text style={styles.explanationText}>
                  {language === 'en' 
                    ? manifestationGuidance.reason.en 
                    : manifestationGuidance.reason.ar}
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
                  {language === 'en' ? 'Spiritual Wisdom' : 'الحكمة الروحانية'}
                </Text>
              </View>

              <View style={styles.divider} />

              <Text style={styles.guidanceText}>
                {language === 'en' ? evaluation.guidance.whatFlowsEasily.en : evaluation.guidance.whatFlowsEasily.ar}
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
                  {language === 'en' ? 'Traditional Uses' : 'الاستخدامات التقليدية'}
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
                      {func.charAt(0).toUpperCase() + func.slice(1)}
                    </Text>
                  </View>
                ))}
              </View>
            </LinearGradient>

            {/* Spiritual Influence */}
            <View style={styles.influenceCard}>
              <Text style={styles.influenceTitle}>
                {language === 'en' ? '🌟 Spiritual Influence' : '🌟 التأثير الروحاني'}
              </Text>
              <Text style={styles.influenceText}>
                {language === 'en' 
                  ? divineName.spiritualInfluence.en 
                  : divineName.spiritualInfluence.ar}
              </Text>
            </View>

            {/* Disclaimer */}
            <View style={styles.disclaimer}>
              <Ionicons name="information-circle-outline" size={20} color="#fbbf24" />
              <Text style={styles.disclaimerText}>
                {language === 'en' 
                  ? 'This resonance analysis is for spiritual reflection. The Divine Names belong to Allah alone. Use with reverence and pure intention.'
                  : 'هذا التحليل للتأمل الروحي. الأسماء الحسنى لله وحده. استخدمها بإجلال ونية خالصة.'}
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

function DivineIntentionResultView({ result, language }: { result: DivineNameIntentionCompatibility; language: 'en' | 'ar' }) {
  const { divineName, intention, alignment, guidance, alternativeSuggestions } = result;
  const [activeTab, setActiveTab] = useState<'alignment' | 'alternatives' | 'guidance'>('alignment');

  const intentionTheme = {
    primary: ['#f59e0b', '#d97706'],
    light: 'rgba(245, 158, 11, 0.15)',
    accent: '#f59e0b'
  };

  const tabs = [
    { id: 'alignment' as const, label: language === 'en' ? 'Alignment' : 'التوافق', icon: 'checkmark-circle' },
    ...(alternativeSuggestions && alternativeSuggestions.length > 0 
      ? [{ id: 'alternatives' as const, label: language === 'en' ? 'Alternatives' : 'البدائل', icon: 'options' }] 
      : []),
    { id: 'guidance' as const, label: language === 'en' ? 'Guidance' : 'الإرشاد', icon: 'compass' },
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
    const labels: Record<string, { en: string; ar: string }> = {
      clarity: { en: 'Clarity', ar: 'الوضوح' },
      patience: { en: 'Patience', ar: 'الصبر' },
      provision: { en: 'Provision', ar: 'الرزق' },
      healing: { en: 'Healing', ar: 'الشفاء' },
      protection: { en: 'Protection', ar: 'الحماية' },
      guidance: { en: 'Guidance', ar: 'الهداية' },
      strength: { en: 'Strength', ar: 'القوة' },
      peace: { en: 'Peace', ar: 'السلام' },
      knowledge: { en: 'Knowledge', ar: 'العلم' },
      forgiveness: { en: 'Forgiveness', ar: 'المغفرة' }
    };
    return language === 'en' ? labels[intent]?.en || intent : labels[intent]?.ar || intent;
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
            <Text style={styles.divineNameMeaning}>
              {language === 'en' ? divineName.meaning.en : divineName.meaning.ar}
            </Text>
          </View>
        </View>
        
        <Text style={styles.headerSubtitle}>
          {language === 'en' ? 'Divine Name for Your Intention' : 'الاسم الإلهي لنيتك'}
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
                {alignment.toUpperCase()}
              </Text>
              <Text style={styles.alignmentSubtext}>
                {language === 'en' 
                  ? alignment === 'optimal' 
                    ? 'Perfect Match for Your Intention'
                    : alignment === 'suitable' 
                      ? 'Good Choice for Your Intention'
                      : alignment === 'neutral'
                        ? 'May Work, But Consider Alternatives'
                        : 'Not Recommended for This Intention'
                  : alignment === 'optimal'
                    ? 'توافق مثالي لنيتك'
                    : alignment === 'suitable'
                      ? 'خيار جيد لنيتك'
                      : alignment === 'neutral'
                        ? 'قد يعمل، لكن فكر في البدائل'
                        : 'غير موصى به لهذه النية'}
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
                    {language === 'en' ? 'About This Divine Name' : 'عن هذا الاسم الإلهي'}
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
                  {language === 'en' ? '📖 Traditional Uses' : '📖 الاستخدامات التقليدية'}
                </Text>
                <View style={styles.functionList}>
                  {divineName.classicalFunction.map((func, index) => (
                    <View key={index} style={styles.functionItem}>
                      <View style={styles.functionBullet}>
                        <Text style={styles.functionBulletText}>✓</Text>
                      </View>
                      <Text style={styles.functionText}>
                        {func.charAt(0).toUpperCase() + func.slice(1)}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Element & Planet */}
              <View style={styles.harmonyGrid}>
                <View style={styles.harmonyCard}>
                  <Text style={styles.harmonyLabel}>
                    {language === 'en' ? 'Element' : 'العنصر'}
                  </Text>
                  <Text style={styles.harmonyEmoji}>
                    {divineName.element === 'fire' ? '🔥' : 
                     divineName.element === 'water' ? '💧' :
                     divineName.element === 'air' ? '💨' : '🌱'}
                  </Text>
                  <Text style={styles.harmonyValue}>
                    {divineName.element.toUpperCase()}
                  </Text>
                </View>

                <View style={styles.harmonyCard}>
                  <Text style={styles.harmonyLabel}>
                    {language === 'en' ? 'Action' : 'الفعل'}
                  </Text>
                  <Text style={styles.harmonyEmoji}>
                    {divineName.modeOfAction === 'fast' ? '⚡' : 
                     divineName.modeOfAction === 'gradual' ? '🌱' : '💧'}
                  </Text>
                  <Text style={styles.harmonyValue}>
                    {divineName.modeOfAction.toUpperCase()}
                  </Text>
                </View>
              </View>
            </LinearGradient>

            {/* Spiritual Influence */}
            <View style={styles.influenceCard}>
              <Text style={styles.influenceTitle}>
                {language === 'en' ? '🌟 Spiritual Influence' : '🌟 التأثير الروحاني'}
              </Text>
              <Text style={styles.influenceText}>
                {language === 'en' 
                  ? divineName.spiritualInfluence.en 
                  : divineName.spiritualInfluence.ar}
              </Text>
            </View>
          </View>
        )}

        {activeTab === 'alternatives' && alternativeSuggestions && alternativeSuggestions.length > 0 && (
          <View style={styles.section}>
            <View style={styles.alternativesHeader}>
              <Ionicons name="bulb" size={28} color="#f59e0b" />
              <Text style={styles.alternativesTitle}>
                {language === 'en' ? 'Traditionally More Aligned Names' : 'أسماء أكثر توافقاً تقليدياً'}
              </Text>
            </View>

            <Text style={styles.alternativesSubtext}>
              {language === 'en' 
                ? 'According to classical teachings, these Names open doors traditionally more aligned with your intention:'
                : 'وفقاً للتعاليم الكلاسيكية، هذه الأسماء تفتح أبواباً أكثر توافقاً تقليدياً مع نيتك:'}
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
                      {language === 'en' ? 'Recommended' : 'موصى به'}
                    </Text>
                  </View>
                </View>

                <Text style={styles.alternativeMeaning}>
                  {language === 'en' ? name.meaning.en : name.meaning.ar}
                </Text>

                <View style={styles.divider} />

                <Text style={styles.alternativeInfluence}>
                  {language === 'en' ? name.spiritualInfluence.en : name.spiritualInfluence.ar}
                </Text>

                {/* Functions */}
                <View style={styles.alternativeFunctions}>
                  {name.classicalFunction.map((func, idx) => (
                    <View key={idx} style={styles.alternativeFunctionTag}>
                      <Text style={styles.alternativeFunctionText}>
                        {func.charAt(0).toUpperCase() + func.slice(1)}
                      </Text>
                    </View>
                  ))}
                </View>
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
                  {language === 'en' ? 'Spiritual Guidance' : 'الإرشاد الروحاني'}
                </Text>
              </View>

              <View style={styles.divider} />

              <Text style={styles.guidanceMainText}>
                {language === 'en' ? guidance.en : guidance.ar}
              </Text>
            </LinearGradient>

            {/* How to Use */}
            <View style={styles.howToUseCard}>
              <Text style={styles.howToUseTitle}>
                {language === 'en' ? '🙏 How to Engage with This Name' : '🙏 كيف تتفاعل مع هذا الاسم'}
              </Text>
              
              <View style={styles.stepsList}>
                <View style={styles.stepItem}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>1</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>
                      {language === 'en' ? 'Purify Your Intention' : 'صفِّ نيتك'}
                    </Text>
                    <Text style={styles.stepText}>
                      {language === 'en' 
                        ? 'Begin with sincere intention (niyyah) seeking only Allah\'s pleasure.'
                        : 'ابدأ بنية صادقة تبتغي مرضاة الله فقط.'}
                    </Text>
                  </View>
                </View>

                <View style={styles.stepItem}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>2</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>
                      {language === 'en' ? 'Reflect on the Meaning' : 'تأمل في المعنى'}
                    </Text>
                    <Text style={styles.stepText}>
                      {language === 'en' 
                        ? 'Contemplate how this Name manifests in your life and creation.'
                        : 'تأمل كيف يتجلى هذا الاسم في حياتك وفي الخلق.'}
                    </Text>
                  </View>
                </View>

                <View style={styles.stepItem}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>3</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>
                      {language === 'en' ? 'Invoke with Reverence' : 'ادعُ بإجلال'}
                    </Text>
                    <Text style={styles.stepText}>
                      {language === 'en' 
                        ? 'Call upon Allah using this Name with humility and trust.'
                        : 'ادع الله بهذا الاسم بتواضع وثقة.'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Disclaimer */}
            <View style={styles.disclaimer}>
              <Ionicons name="information-circle-outline" size={20} color="#fbbf24" />
              <Text style={styles.disclaimerText}>
                {language === 'en' 
                  ? 'This is spiritual guidance only. The Divine Names belong to Allah alone. Results depend on sincerity, patience, and Allah\'s wisdom.'
                  : 'هذا إرشاد روحي فقط. الأسماء الحسنى لله وحده. النتائج تعتمد على الإخلاص والصبر وحكمة الله.'}
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
    padding: 20,
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
    padding: 16,
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
    padding: 20,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  detailTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  detailSubtitle: {
    color: '#94a3b8',
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 16,
  },
  explanationBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  explanationTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
  },
  explanationText: {
    color: '#cbd5e1',
    fontSize: 15,
    lineHeight: 24,
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
    padding: 16,
    gap: 12,
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
    fontSize: 24,
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
    gap: 12,
  },
  harmonyCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
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
    gap: 12,
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
    padding: 16,
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
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 12,
    marginBottom: 12,
  },
  intentionEmoji: {
    fontSize: 28,
  },
  intentionLabel: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  alignmentCard: {
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  alignmentText: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
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
    padding: 16,
    marginBottom: 12,
  },
  alternativeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  alternativeArabic: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  alternativeTranslit: {
    color: '#22c55e',
    fontSize: 15,
    fontWeight: '600',
  },
  recommendedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
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
    gap: 8,
  },
  alternativeFunctionTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  alternativeFunctionText: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '600',
  },
  guidanceCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  guidanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  guidanceTitle: {
    color: '#ffffff',
    fontSize: 18,
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
    padding: 20,
    marginBottom: 16,
  },
  howToUseTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
  },
  stepsList: {
    gap: 16,
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
    fontSize: 15,
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
    paddingVertical: 16,
  },
  spiritualScore: {
    fontSize: 48,
    fontWeight: '700',
    marginBottom: 8,
  },
  spiritualQuality: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  remainderBadge: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  remainderText: {
    color: '#a78bfa',
    fontSize: 14,
    fontWeight: '600',
  },
});
