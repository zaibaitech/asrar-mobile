import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { IstikharaData } from '../../../types/istikhara';

interface CareerTabProps {
  data: IstikharaData;
  elementColor: string;
}

export default function CareerTab({ data, elementColor }: CareerTabProps) {
  const { career } = data.burujProfile;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Categories */}
        <View style={[styles.card, { borderLeftColor: elementColor }]}>
          <Text style={styles.cardTitle}>🎯 Career Categories</Text>
          <View style={styles.tagsContainer}>
            {career.categories.map((category, index) => (
              <View key={index} style={[styles.tag, { borderColor: elementColor }]}>
                <Text style={[styles.tagText, { color: elementColor }]}>{category}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Recommended Industries */}
        <View style={[styles.card, { borderLeftColor: elementColor }]}>
          <Text style={styles.cardTitle}>✅ Recommended Industries</Text>
          {career.recommended_industries.map((industry, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listText}>{industry}</Text>
            </View>
          ))}
        </View>

        {/* Careers to Avoid */}
        <View style={[styles.card, { borderLeftColor: '#ef4444' }]}>
          <Text style={styles.cardTitle}>⚠️ Careers to Avoid</Text>
          {career.careers_to_avoid.map((career, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={[styles.listText, { color: '#fca5a5' }]}>{career}</Text>
            </View>
          ))}
        </View>

        {/* Guiding Principles */}
        <View style={[styles.card, { borderLeftColor: elementColor }]}>
          <Text style={styles.cardTitle}>💡 Guiding Principles</Text>
          {career.guiding_principles.map((principle, index) => (
            <View key={index} style={styles.principleItem}>
              <View style={[styles.principleNumber, { backgroundColor: elementColor }]}>
                <Text style={styles.principleNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.principleText}>{principle}</Text>
            </View>
          ))}
        </View>
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
  card: {
    backgroundColor: '#1a1f2e',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tag: {
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    fontWeight: '600',
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  bullet: {
    fontSize: 20,
    color: '#a8b2d1',
    marginRight: 12,
    marginTop: 2,
  },
  listText: {
    flex: 1,
    fontSize: 15,
    color: '#e0e6f0',
    lineHeight: 22,
  },
  principleItem: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  principleNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  principleNumberText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  principleText: {
    flex: 1,
    fontSize: 15,
    color: '#e0e6f0',
    lineHeight: 22,
  },
});
