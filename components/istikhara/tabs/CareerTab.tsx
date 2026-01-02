import { BookOpen, CheckCircle, ChevronDown, ChevronUp, Lightbulb, XCircle } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Borders, DarkTheme, ElementAccents, Spacing, Typography } from '../../../constants/DarkTheme';
import { IstikharaData } from '../../../types/istikhara';

interface CareerTabProps {
  data: IstikharaData;
  elementColor: string;
}

export default function CareerTab({ data, elementColor }: CareerTabProps) {
  const { career } = data.burujProfile;
  const elementKey = data.burujProfile.element.toLowerCase() as "fire" | "earth" | "air" | "water";
  const accent = ElementAccents[elementKey];
  
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Career & Vocation Guidance</Text>
          <Text style={styles.subtitle}>Career paths that resonate with your spiritual energy</Text>
        </View>

        {/* Element Badge */}
        <View style={[styles.elementBadge, { borderColor: accent.primary }]}>
          <Text style={styles.elementEmoji}>{data.burujProfile.element_emoji}</Text>
          <Text style={[styles.elementText, { color: accent.primary }]}>
            {data.burujProfile.element.charAt(0).toUpperCase() + data.burujProfile.element.slice(1)} Element
          </Text>
        </View>

        {/* Traditional Wisdom - Dark card with accent border and left bar */}
        <View style={[styles.wisdomCard, { borderLeftColor: accent.primary, borderColor: accent.primary }]}>
          <View style={styles.cardHeader}>
            <BookOpen size={24} color={accent.primary} />
            <Text style={[styles.cardTitle, { color: DarkTheme.textPrimary }]}>Traditional Wisdom</Text>
          </View>
          
          <View style={[styles.quoteContainer, { borderLeftColor: accent.primary }]}>
            <Text style={styles.quoteText}>{career.traditional.en}</Text>
          </View>
          
          <Text style={styles.sourceText}>Traditional Islamic Guidance</Text>
        </View>

        {/* Career Principle */}
        <View style={[styles.card, { borderColor: accent.primary }]}>
          <View style={styles.cardHeader}>
            <Lightbulb size={24} color={accent.primary} />
            <Text style={[styles.cardTitle, { color: DarkTheme.textPrimary }]}>Guiding Principle</Text>
          </View>
          <Text style={styles.guidanceText}>{career.principle.en}</Text>
          {career.principle.fr && (
            <Text style={[styles.guidanceText, styles.frenchText]}>{career.principle.fr}</Text>
          )}
        </View>

        {/* Modern Recommended Fields */}
        {career.modern_recommended.en.length > 0 && (
          <View style={[styles.card, { borderColor: accent.primary }]}>
            <View style={styles.cardHeader}>
              <CheckCircle size={24} color={accent.primary} />
              <Text style={[styles.cardTitle, { color: DarkTheme.textPrimary }]}>Recommended Career Fields</Text>
            </View>
            
            <View style={styles.buttonGroup}>
              <TouchableOpacity 
                style={[styles.expandButton, { backgroundColor: accent.glow, borderColor: accent.primary }]}
                onPress={() => {
                  const allCategories = career.modern_recommended.en
                    .filter((item: any) => typeof item === 'object' && item.category)
                    .map((item: any) => item.category);
                  setExpandedCategories(new Set(allCategories));
                }}
              >
                <Text style={[styles.expandButtonText, { color: accent.primary }]}>Expand All</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.expandButton, { backgroundColor: DarkTheme.cardBackgroundAlt, borderColor: DarkTheme.borderSubtle }]}
                onPress={() => setExpandedCategories(new Set())}
              >
                <Text style={[styles.expandButtonText, { color: DarkTheme.textTertiary }]}>Collapse All</Text>
              </TouchableOpacity>
            </View>

            {career.modern_recommended.en.map((item: any, index: number) => {
              // Handle categorized structure (new format)
              if (typeof item === 'object' && item.category && item.items) {
                const isExpanded = expandedCategories.has(item.category);
                const itemCount = item.items.length;
                
                return (
                  <TouchableOpacity
                    key={index}
                    style={[styles.categoryCard, { 
                      borderColor: accent.primary,
                      backgroundColor: DarkTheme.cardBackgroundAlt
                    }]}
                    onPress={() => toggleCategory(item.category)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.categoryHeader}>
                      <View style={styles.categoryTitleRow}>
                        <Text style={styles.categoryIcon}>{item.icon}</Text>
                        <View style={styles.categoryInfo}>
                          <Text style={styles.categoryTitle}>{item.category}</Text>
                          <Text style={styles.opportunityCount}>{itemCount} opportunities</Text>
                        </View>
                      </View>
                      {isExpanded ? (
                        <ChevronUp size={20} color={accent.primary} />
                      ) : (
                        <ChevronDown size={20} color={accent.primary} />
                      )}
                    </View>

                    {isExpanded && (
                      <View style={styles.categoryItems}>
                        {item.items.map((subItem: string, subIndex: number) => (
                          <View key={subIndex} style={styles.listItem}>
                            <View style={[styles.bullet, { backgroundColor: accent.primary }]} />
                            <Text style={styles.listText}>{subItem}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </TouchableOpacity>
                );
              }
              // Handle flat array structure (old format) - item is a string
              return (
                <View key={index} style={styles.listItem}>
                  <View style={[styles.bullet, { backgroundColor: accent.primary }]} />
                  <Text style={styles.listText}>{String(item)}</Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Careers to Avoid */}
        {(career.avoid.traditional.en || career.avoid.modern.en) && (
          <View style={[styles.card, { borderColor: accent.secondary, borderLeftColor: accent.secondary, borderLeftWidth: Borders.accent }]}>
            <View style={styles.cardHeader}>
              <XCircle size={24} color={accent.secondary} />
              <Text style={[styles.cardTitle, { color: DarkTheme.textPrimary }]}>Careers to Avoid</Text>
            </View>
            {career.avoid.traditional.en && (
              <View style={styles.avoidSection}>
                <Text style={styles.avoidLabel}>Traditional:</Text>
                <Text style={styles.avoidText}>{career.avoid.traditional.en}</Text>
              </View>
            )}
            {career.avoid.modern.en && (
              <View style={styles.avoidSection}>
                <Text style={styles.avoidLabel}>Modern:</Text>
                <Text style={styles.avoidText}>{career.avoid.modern.en}</Text>
              </View>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1020',
  },
  content: {
    padding: Spacing.screenPadding,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.sectionGap,
  },
  title: {
    fontSize: Typography.h1,
    fontWeight: Typography.weightBold,
    color: '#fff',
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.label,
    color: '#94a3b8',
    textAlign: 'center',
    paddingHorizontal: Spacing.lg,
  },
  elementBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.lg,
    borderRadius: Borders.radiusLg,
    borderWidth: Borders.standard,
    marginBottom: Spacing.xl,
    backgroundColor: 'rgba(30, 58, 138, 0.2)',
    borderColor: 'rgba(96, 165, 250, 0.2)',
    justifyContent: 'center',
    shadowColor: '#60a5fa',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  elementEmoji: {
    fontSize: 32,
  },
  elementText: {
    fontSize: Typography.h3,
    fontWeight: Typography.weightBold,
  },
  wisdomCard: {
    backgroundColor: 'rgba(30, 58, 138, 0.2)',
    borderRadius: Borders.radiusLg,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    borderLeftWidth: Borders.accent,
    borderWidth: Borders.standard,
    borderColor: 'rgba(96, 165, 250, 0.2)',
    shadowColor: '#60a5fa',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  card: {
    backgroundColor: 'rgba(30, 58, 138, 0.2)',
    borderRadius: Borders.radiusLg,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    borderWidth: Borders.standard,
    borderColor: 'rgba(96, 165, 250, 0.2)',
    shadowColor: '#60a5fa',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  cardTitle: {
    fontSize: Typography.h3,
    fontWeight: Typography.weightSemibold,
    color: '#fff',
  },
  quoteContainer: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderLeftWidth: 4,
    borderLeftColor: '#60a5fa',
    padding: Spacing.lg,
    borderRadius: Borders.radiusSm,
    marginBottom: Spacing.md,
  },
  quoteText: {
    fontSize: Typography.body,
    color: '#cbd5e1',
    fontStyle: 'italic',
    lineHeight: Typography.body * Typography.lineHeightRelaxed,
  },
  sourceText: {
    fontSize: Typography.caption,
    color: '#94a3b8',
    textAlign: 'right',
  },
  guidanceText: {
    fontSize: Typography.body,
    color: '#cbd5e1',
    lineHeight: Typography.body * Typography.lineHeightRelaxed,
  },
  frenchText: {
    marginTop: Spacing.md,
    fontStyle: 'italic',
    color: '#94a3b8',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  expandButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: Borders.radiusMd,
    borderWidth: 1,
    alignItems: 'center',
  },
  expandButtonText: {
    fontSize: Typography.label,
    fontWeight: Typography.weightSemibold,
  },
  categoryCard: {
    borderRadius: Borders.radiusMd,
    borderWidth: Borders.standard,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    shadowColor: '#60a5fa',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
  },
  categoryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  categoryIcon: {
    fontSize: 28,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: Typography.body,
    fontWeight: Typography.weightSemibold,
    color: '#fff',
    marginBottom: 2,
  },
  opportunityCount: {
    fontSize: Typography.caption,
    color: '#64748b',
  },
  categoryItems: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(96, 165, 250, 0.1)',
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
    alignItems: 'flex-start',
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: Spacing.md,
    marginTop: 8,
  },
  listText: {
    flex: 1,
    fontSize: Typography.body,
    color: '#cbd5e1',
    lineHeight: Typography.body * Typography.lineHeightNormal,
  },
  avoidSection: {
    marginBottom: Spacing.md,
  },
  avoidLabel: {
    fontSize: Typography.label,
    fontWeight: Typography.weightSemibold,
    color: '#94a3b8',
    marginBottom: Spacing.xs,
  },
  avoidText: {
    fontSize: Typography.body,
    color: '#cbd5e1',
    lineHeight: Typography.body * Typography.lineHeightNormal,
  },
});
