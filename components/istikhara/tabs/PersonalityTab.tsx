import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { IstikharaData } from '../../../types/istikhara';

interface PersonalityTabProps {
  data: IstikharaData;
  elementColor: string;
}

export default function PersonalityTab({ data, elementColor }: PersonalityTabProps) {
  const { personality } = data.burujProfile;
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['temperament']));

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const sections = [
    { key: 'temperament', title: 'Temperament', icon: '🎭', content: personality.temperament },
    { key: 'communication', title: 'Communication Style', icon: '💬', content: personality.communication },
    { key: 'loved_by', title: 'Loved By', icon: '❤️', content: personality.loved_by },
    { key: 'challenged_by', title: 'Challenged By', icon: '⚡', content: personality.challenged_by },
    { key: 'life_blessings', title: 'Life Blessings', icon: '🌟', content: personality.life_blessings },
    { key: 'divine_support', title: 'Divine Support', icon: '🤲', content: personality.divine_support },
    { key: 'dreams', title: 'Dreams & Aspirations', icon: '💭', content: personality.dreams },
    { key: 'anger', title: 'Anger Management', icon: '😤', content: personality.anger },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.headerText}>
          Understanding your personality traits and spiritual characteristics
        </Text>

        {sections.map((section) => (
          <View key={section.key} style={[styles.card, { borderLeftColor: elementColor }]}>
            <TouchableOpacity
              onPress={() => toggleSection(section.key)}
              style={styles.cardHeader}
              activeOpacity={0.7}
            >
              <View style={styles.cardHeaderLeft}>
                <Text style={styles.sectionIcon}>{section.icon}</Text>
                <Text style={styles.sectionTitle}>{section.title}</Text>
              </View>
              <Text style={styles.expandIcon}>
                {expandedSections.has(section.key) ? '▼' : '▶'}
              </Text>
            </TouchableOpacity>

            {expandedSections.has(section.key) && (
              <View style={styles.cardContent}>
                <Text style={styles.contentText}>{section.content}</Text>
              </View>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1419',
  },
  content: {
    padding: 16,
  },
  headerText: {
    fontSize: 16,
    color: '#a8b2d1',
    marginBottom: 20,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  card: {
    backgroundColor: '#1a1f2e',
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sectionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#ffffff',
    flex: 1,
  },
  expandIcon: {
    fontSize: 14,
    color: '#8892b0',
    marginLeft: 12,
  },
  cardContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 4,
  },
  contentText: {
    fontSize: 15,
    color: '#e0e6f0',
    lineHeight: 24,
  },
});
