/**
 * Universal Compatibility Results View
 * Displays results for all compatibility types
 */

import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type {
    DivineNameIntentionCompatibility,
    PersonDivineNameCompatibility,
    PersonPersonCompatibility,
    UniversalCompatibilityResult
} from '../../services/compatibility/types';

interface CompatibilityResultViewProps {
  result: UniversalCompatibilityResult;
  language: 'en' | 'ar';
}

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
// PERSON ↔ PERSON RESULT VIEW
// ============================================================================

function PersonPersonResultView({ result, language }: { result: PersonPersonCompatibility; language: 'en' | 'ar' }) {
  const { person1, person2, relationshipCompatibility } = result;
  const rc = relationshipCompatibility;
  const methods = rc.methods;

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Header */}
        <Text style={styles.title}>
          {language === 'en' ? 'Relationship Compatibility' : 'توافق العلاقة'}
        </Text>

        {/* Overall Score */}
        <View style={styles.overallScoreCard}>
          <Text style={styles.scoreLabel}>
            {language === 'en' ? 'Overall Compatibility' : 'التوافق الشامل'}
          </Text>
          <Text style={styles.scoreValue}>{rc.overallScore}%</Text>
          <Text style={styles.qualityLabel}>
            {language === 'en' ? rc.overallQuality.toUpperCase() : rc.overallQualityArabic}
          </Text>
          <View style={styles.scoreBar}>
            <View style={[styles.scoreBarFill, { width: `${rc.overallScore}%` }]} />
          </View>
        </View>

        {/* Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryText}>
            {language === 'en' ? rc.summary : rc.summaryArabic}
          </Text>
        </View>

        {/* 4-METHOD ANALYSIS */}
        <Text style={styles.sectionTitle}>
          {language === 'en' ? '4-Method Analysis' : 'التحليل بأربع طرق'}
        </Text>

        {/* 1. Spiritual-Destiny */}
        <MethodCard
          methodName={language === 'en' ? 'Spiritual-Destiny' : methods.spiritualDestiny.methodArabic}
          score={methods.spiritualDestiny.score}
          quality={language === 'en' ? methods.spiritualDestiny.quality : methods.spiritualDestiny.qualityArabic}
          description={language === 'en' ? methods.spiritualDestiny.description : methods.spiritualDestiny.descriptionArabic}
          color={methods.spiritualDestiny.color}
        />

        {/* 2. Elemental-Temperament */}
        <MethodCard
          methodName={language === 'en' ? 'Elemental-Temperament' : methods.elementalTemperament.methodArabic}
          score={methods.elementalTemperament.score}
          quality={language === 'en' ? methods.elementalTemperament.quality : methods.elementalTemperament.qualityArabic}
          description={language === 'en' ? methods.elementalTemperament.description : methods.elementalTemperament.descriptionArabic}
          color={methods.elementalTemperament.color}
        />

        {/* 3. Planetary-Cosmic */}
        <MethodCard
          methodName={language === 'en' ? 'Planetary-Cosmic' : methods.planetaryCosmic.methodArabic}
          score={methods.planetaryCosmic.score}
          quality={language === 'en' ? methods.planetaryCosmic.quality : methods.planetaryCosmic.qualityArabic}
          description={language === 'en' ? methods.planetaryCosmic.description : methods.planetaryCosmic.descriptionArabic}
          color={methods.planetaryCosmic.color}
        />

        {/* 4. Daily-Interaction */}
        <MethodCard
          methodName={language === 'en' ? 'Daily-Interaction' : methods.dailyInteraction.methodArabic}
          score={methods.dailyInteraction.score}
          quality={language === 'en' ? methods.dailyInteraction.quality : methods.dailyInteraction.qualityArabic}
          description={language === 'en' ? methods.dailyInteraction.description : methods.dailyInteraction.descriptionArabic}
          color={methods.dailyInteraction.color}
        />

        {/* Recommendations */}
        <View style={styles.recommendationsCard}>
          <Text style={styles.recommendationsTitle}>
            {language === 'en' ? 'Spiritual Recommendations' : 'التوصيات الروحية'}
          </Text>
          {(language === 'en' ? rc.recommendations : rc.recommendationsArabic).map((rec, index) => (
            <View key={index} style={styles.recommendationItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.recommendationText}>{rec}</Text>
            </View>
          ))}
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            {language === 'en' 
              ? 'This analysis is for spiritual reflection within ʿIlm al-Asrār. Not for fortune-telling or guarantees.'
              : 'هذا التحليل للتأمل الروحي ضمن علم أسرار الحروف. ليس للتنبؤ أو الضمانات.'}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

// ============================================================================
// PERSON ↔ DIVINE NAME RESULT VIEW
// ============================================================================

function PersonDivineNameResultView({ result, language }: { result: PersonDivineNameCompatibility; language: 'en' | 'ar' }) {
  const { person, divineName, evaluation, nameAction, manifestationGuidance } = result;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {language === 'en' ? 'Divine Name Resonance' : 'رنين الاسم الإلهي'}
      </Text>

      {/* Divine Name Card */}
      <View style={styles.divineNameCard}>
        <Text style={styles.divineNameArabic}>{divineName.arabic}</Text>
        <Text style={styles.divineNameTranslit}>{divineName.transliteration}</Text>
        <Text style={styles.divineNameMeaning}>
          {language === 'en' ? divineName.meaning.en : divineName.meaning.ar}
        </Text>
      </View>

      {/* Resonance Score */}
      <View style={styles.scoreCard}>
        <Text style={styles.scoreLabel}>
          {language === 'en' ? 'Resonance Score' : 'درجة الرنين'}
        </Text>
        <Text style={styles.scoreValue}>{evaluation.resonanceScore}</Text>
        <View style={styles.scoreBar}>
          <View style={[styles.scoreBarFill, { width: `${evaluation.resonanceScore}%` }]} />
        </View>
      </View>

      {/* Name Action on Person */}
      <View style={styles.actionCard}>
        <Text style={styles.actionTitle}>
          {language === 'en' ? 'How This Name Acts Upon You' : 'كيف يعمل هذا الاسم عليك'}
        </Text>
        <Text style={styles.actionEffect}>
          {nameAction.effect.charAt(0).toUpperCase() + nameAction.effect.slice(1)}
        </Text>
        <Text style={styles.actionExplanation}>
          {language === 'en' ? nameAction.explanation.en : nameAction.explanation.ar}
        </Text>
      </View>

      {/* Manifestation Guidance */}
      <View style={styles.manifestationCard}>
        <Text style={styles.manifestationTitle}>
          {language === 'en' ? 'Manifestation Guidance' : 'إرشاد الظهور'}
        </Text>
        <Text style={styles.manifestationSpeed}>
          {language === 'en' ? 'Speed: ' : 'السرعة: '}
          {manifestationGuidance.speed.charAt(0).toUpperCase() + manifestationGuidance.speed.slice(1)}
        </Text>
        <Text style={styles.manifestationReason}>
          {language === 'en' ? manifestationGuidance.reason.en : manifestationGuidance.reason.ar}
        </Text>
      </View>

      {/* Standard Evaluation Cards */}
      <EvaluationCard
        title={language === 'en' ? 'Elemental Relationship' : 'العلاقة العنصرية'}
        type={evaluation.elementalRelationship.type}
        explanation={language === 'en' 
          ? evaluation.elementalRelationship.explanation.en 
          : evaluation.elementalRelationship.explanation.ar}
        icon="🔥"
      />

      {/* Disclaimer */}
      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>
          {language === 'en' ? evaluation.disclaimer.en : evaluation.disclaimer.ar}
        </Text>
      </View>
    </View>
  );
}

// ============================================================================
// DIVINE NAME ↔ INTENTION RESULT VIEW
// ============================================================================

function DivineIntentionResultView({ result, language }: { result: DivineNameIntentionCompatibility; language: 'en' | 'ar' }) {
  const { divineName, intention, alignment, guidance, alternativeSuggestions } = result;

  const alignmentColors: Record<string, string> = {
    optimal: '#10b981',
    suitable: '#3b82f6',
    neutral: '#fbbf24',
    'not-recommended': '#ef4444'
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {language === 'en' ? 'Name-Intention Alignment' : 'توافق الاسم والنية'}
      </Text>

      {/* Divine Name */}
      <View style={styles.divineNameCard}>
        <Text style={styles.divineNameArabic}>{divineName.arabic}</Text>
        <Text style={styles.divineNameTranslit}>{divineName.transliteration}</Text>
      </View>

      {/* Alignment Badge */}
      <View style={[styles.alignmentBadge, { borderColor: alignmentColors[alignment] }]}>
        <Text style={[styles.alignmentText, { color: alignmentColors[alignment] }]}>
          {alignment.toUpperCase().replace('-', ' ')}
        </Text>
      </View>

      {/* Guidance */}
      <View style={styles.guidanceCard}>
        <Text style={styles.guidanceText}>
          {language === 'en' ? guidance.en : guidance.ar}
        </Text>
      </View>

      {/* Alternative Suggestions */}
      {alternativeSuggestions && alternativeSuggestions.length > 0 && (
        <View style={styles.alternativesCard}>
          <Text style={styles.alternativesTitle}>
            {language === 'en' ? 'Recommended Alternatives' : 'البدائل الموصى بها'}
          </Text>
          {alternativeSuggestions.map((name) => (
            <View key={name.number} style={styles.alternativeItem}>
              <Text style={styles.alternativeArabic}>{name.arabic}</Text>
              <Text style={styles.alternativeTranslit}>{name.transliteration}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

function EvaluationCard({ title, type, explanation, icon }: any) {
  return (
    <View style={styles.evalCard}>
      <View style={styles.evalHeader}>
        <Text style={styles.evalIcon}>{icon}</Text>
        <Text style={styles.evalTitle}>{title}</Text>
      </View>
      <Text style={styles.evalType}>{type.replace('-', ' ').toUpperCase()}</Text>
      <Text style={styles.evalExplanation}>{explanation}</Text>
    </View>
  );
}

function GuidanceItem({ icon, title, text }: any) {
  return (
    <View style={styles.guidanceItem}>
      <Text style={styles.guidanceIcon}>{icon}</Text>
      <View style={styles.guidanceContent}>
        <Text style={styles.guidanceItemTitle}>{title}</Text>
        <Text style={styles.guidanceItemText}>{text}</Text>
      </View>
    </View>
  );
}

function MethodCard({ methodName, score, quality, description, color }: any) {
  const getColorCode = (colorName: string) => {
    const colors: Record<string, string> = {
      green: '#22c55e',
      blue: '#3b82f6',
      yellow: '#eab308',
      orange: '#f97316',
      red: '#ef4444',
      cyan: '#06b6d4'
    };
    return colors[colorName] || '#8b5cf6';
  };

  return (
    <View style={[styles.methodCard, { borderColor: getColorCode(color) + '40' }]}>
      <View style={styles.methodHeader}>
        <Text style={styles.methodName}>{methodName}</Text>
        <Text style={[styles.methodScore, { color: getColorCode(color) }]}>{score}%</Text>
      </View>
      <Text style={styles.methodQuality}>{quality}</Text>
      <Text style={styles.methodDescription}>{description}</Text>
    </View>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
  title: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  scoreCard: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreLabel: {
    color: '#cbd5e1',
    fontSize: 14,
    marginBottom: 8,
  },
  scoreValue: {
    color: '#a78bfa',
    fontSize: 48,
    fontWeight: '700',
    marginBottom: 12,
  },
  scoreBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    backgroundColor: '#8b5cf6',
    borderRadius: 4,
  },
  evalCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  evalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  evalIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  evalTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  evalType: {
    color: '#a78bfa',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  evalExplanation: {
    color: '#cbd5e1',
    fontSize: 14,
    lineHeight: 20,
  },
  guidanceCard: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  guidanceTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  guidanceItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  guidanceIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  guidanceContent: {
    flex: 1,
  },
  guidanceItemTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  guidanceItemText: {
    color: '#cbd5e1',
    fontSize: 14,
    lineHeight: 20,
  },
  guidanceText: {
    color: '#cbd5e1',
    fontSize: 14,
    lineHeight: 20,
  },
  divineNameCard: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  divineNameArabic: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
  divineNameTranslit: {
    color: '#a78bfa',
    fontSize: 18,
    marginBottom: 8,
  },
  divineNameMeaning: {
    color: '#cbd5e1',
    fontSize: 14,
    textAlign: 'center',
  },
  actionCard: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  actionTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  actionEffect: {
    color: '#60a5fa',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  actionExplanation: {
    color: '#cbd5e1',
    fontSize: 14,
    lineHeight: 20,
  },
  manifestationCard: {
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.3)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  manifestationTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  manifestationSpeed: {
    color: '#fbbf24',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  manifestationReason: {
    color: '#cbd5e1',
    fontSize: 14,
    lineHeight: 20,
  },
  alignmentBadge: {
    borderWidth: 2,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  alignmentText: {
    fontSize: 18,
    fontWeight: '700',
  },
  alternativesCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  alternativesTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  alternativeItem: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  alternativeArabic: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  alternativeTranslit: {
    color: '#a78bfa',
    fontSize: 14,
  },
  disclaimer: {
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.3)',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
  },
  disclaimerText: {
    color: '#cbd5e1',
    fontSize: 13,
    lineHeight: 18,
  },
  // Person-Person specific styles
  scrollContainer: {
    flex: 1,
  },
  overallScoreCard: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderWidth: 2,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  qualityLabel: {
    color: '#a78bfa',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 16,
  },
  summaryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  summaryText: {
    color: '#e2e8f0',
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'center',
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    marginTop: 8,
  },
  methodCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  methodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  methodName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  methodScore: {
    fontSize: 24,
    fontWeight: '700',
  },
  methodQuality: {
    color: '#a78bfa',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  methodDescription: {
    color: '#cbd5e1',
    fontSize: 14,
    lineHeight: 20,
  },
  recommendationsCard: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
    borderRadius: 12,
    padding: 20,
    marginTop: 8,
    marginBottom: 20,
  },
  recommendationsTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  recommendationItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  bullet: {
    color: '#22c55e',
    fontSize: 18,
    marginRight: 12,
    fontWeight: '700',
  },
  recommendationText: {
    flex: 1,
    color: '#cbd5e1',
    fontSize: 14,
    lineHeight: 20,
  },
});
