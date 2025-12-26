/**
 * Element Composition Interpretation Card
 * Shows bars + interpretation + balancing actions
 */

import { type ElementType } from '@/utils/elementTheme';
import { LinearGradient } from 'expo-linear-gradient';
import { Info } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ElementProgressBar } from './ElementProgressBar';

interface ElementCompositionCardProps {
  distribution: {
    fire: number;
    air: number;
    water: number;
    earth: number;
  };
  dominant: ElementType;
  balancingActions: string[];
  language?: 'en' | 'fr' | 'ar';
}

export function ElementCompositionCard({
  distribution,
  dominant,
  balancingActions,
  language = 'en',
}: ElementCompositionCardProps) {
  const titles = {
    en: {
      main: 'Elemental Composition',
      subtitle: 'Based on the letters in your name',
      interpretation: 'What This Means',
      balancing: 'Balancing Actions',
    },
    fr: {
      main: 'Composition Élémentaire',
      subtitle: 'Basé sur les lettres de votre nom',
      interpretation: 'Ce Que Cela Signifie',
      balancing: 'Actions d\'Équilibrage',
    },
    ar: {
      main: 'التركيب العنصري',
      subtitle: 'بناءً على حروف اسمك',
      interpretation: 'ماذا يعني هذا',
      balancing: 'إجراءات التوازن',
    },
  };

  const interpretations = {
    en: {
      Fire: 'Your name carries strong Fire energy, suggesting passion, leadership, and transformative power. You may naturally gravitate toward action and change.',
      Air: 'Your name carries strong Air energy, suggesting intellect, communication, and adaptability. You may excel in analysis and connection.',
      Water: 'Your name carries strong Water energy, suggesting intuition, emotion, and spiritual depth. You may be naturally empathetic and reflective.',
      Earth: 'Your name carries strong Earth energy, suggesting stability, practicality, and grounding. You may excel at building and maintaining foundations.',
    },
    fr: {
      Fire: 'Votre nom porte une forte énergie de Feu, suggérant passion, leadership et pouvoir transformateur. Vous pouvez naturellement vous orienter vers l\'action et le changement.',
      Air: 'Votre nom porte une forte énergie d\'Air, suggérant intellect, communication et adaptabilité. Vous pouvez exceller dans l\'analyse et la connexion.',
      Water: 'Votre nom porte une forte énergie d\'Eau, suggérant intuition, émotion et profondeur spirituelle. Vous pouvez être naturellement empathique et réfléchi.',
      Earth: 'Votre nom porte une forte énergie de Terre, suggérant stabilité, praticité et ancrage. Vous pouvez exceller à construire et maintenir des fondations.',
    },
    ar: {
      Fire: 'يحمل اسمك طاقة نارية قوية، تشير إلى العاطفة والقيادة والقوة التحويلية. قد تنجذب بشكل طبيعي نحو العمل والتغيير.',
      Air: 'يحمل اسمك طاقة هوائية قوية، تشير إلى الفكر والتواصل والقدرة على التكيف. قد تتفوق في التحليل والاتصال.',
      Water: 'يحمل اسمك طاقة مائية قوية، تشير إلى الحدس والعاطفة والعمق الروحي. قد تكون متعاطفًا وتأمليًا بشكل طبيعي.',
      Earth: 'يحمل اسمك طاقة أرضية قوية، تشير إلى الاستقرار والعملية والتأريض. قد تتفوق في بناء الأسس والحفاظ عليها.',
    },
  };

  const t = titles[language];
  const interpretation = interpretations[language][dominant];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t.main}</Text>
      <Text style={styles.subtitle}>{t.subtitle}</Text>

      {/* Element Progress Bars */}
      <View style={styles.barsContainer}>
        <ElementProgressBar
          element="fire"
          percentage={distribution.fire}
          isDominant={dominant === 'Fire'}
          language={language}
        />
        <ElementProgressBar
          element="air"
          percentage={distribution.air}
          isDominant={dominant === 'Air'}
          language={language}
        />
        <ElementProgressBar
          element="water"
          percentage={distribution.water}
          isDominant={dominant === 'Water'}
          language={language}
        />
        <ElementProgressBar
          element="earth"
          percentage={distribution.earth}
          isDominant={dominant === 'Earth'}
          language={language}
        />
      </View>

      {/* Interpretation */}
      <View style={styles.interpretationCard}>
        <LinearGradient
          colors={['rgba(59, 130, 246, 0.1)', 'rgba(37, 99, 235, 0.05)']}
          style={styles.interpretationGradient}
        >
          <View style={styles.interpretationHeader}>
            <Info size={16} color="#60a5fa" strokeWidth={2.5} />
            <Text style={styles.interpretationTitle}>{t.interpretation}</Text>
          </View>
          <Text style={styles.interpretationText}>{interpretation}</Text>
        </LinearGradient>
      </View>

      {/* Balancing Actions */}
      {balancingActions.length > 0 && (
        <View style={styles.balancingCard}>
          <Text style={styles.balancingTitle}>{t.balancing}</Text>
          <View style={styles.balancingList}>
            {balancingActions.map((action, index) => (
              <View style={styles.balancingItem} key={index}>
                <View style={styles.balancingBullet} />
                <Text style={styles.balancingText}>{action}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 16,
    lineHeight: 18,
  },
  barsContainer: {
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.08)',
    marginBottom: 14,
  },
  interpretationCard: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    marginBottom: 14,
  },
  interpretationGradient: {
    padding: 14,
  },
  interpretationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  interpretationTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#60a5fa',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  interpretationText: {
    fontSize: 14,
    color: '#e2e8f0',
    lineHeight: 20,
  },
  balancingCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.4)',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.1)',
  },
  balancingTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#cbd5e1',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  balancingList: {
    gap: 8,
  },
  balancingItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  balancingBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10b981',
    marginTop: 7,
  },
  balancingText: {
    flex: 1,
    fontSize: 14,
    color: '#e2e8f0',
    lineHeight: 20,
  },
});
