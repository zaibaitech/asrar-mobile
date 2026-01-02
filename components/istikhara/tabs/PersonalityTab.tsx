import * as Haptics from 'expo-haptics';
import {
    AlertCircle,
    Brain,
    ChevronDown,
    ChevronUp,
    Eye,
    Heart,
    Info,
    MessageCircle,
    Shield,
    Star,
    TrendingUp,
    Users
} from "lucide-react-native";
import React, { useState } from "react";
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { DarkTheme, ElementAccents, Spacing, Typography } from "../../../constants/DarkTheme";
import { useLanguage } from "../../../contexts/LanguageContext";
import type { IstikharaData } from "../../../types/istikhara";

const { width } = Dimensions.get('window');

interface PersonalityTabProps {
  data: IstikharaData;
  elementColor: string;
}

interface PersonalityTrait {
  key: string;
  icon: React.ReactNode;
  label: string;
  color: string;
}

export default function PersonalityTab({ data, elementColor }: PersonalityTabProps) {
  const { language } = useLanguage();
  const profile = data.burujProfile;
  const elementKey = profile.element.toLowerCase() as "fire" | "earth" | "air" | "water";
  const accent = ElementAccents[elementKey];
  const personality = profile.personality[language as 'en' | 'fr'];

  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['temperament']));

  const toggleSection = async (section: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const traits: PersonalityTrait[] = [
    {
      key: 'temperament',
      icon: <Brain size={24} color={accent.primary} />,
      label: language === 'en' ? 'Temperament' : 'Tempérament',
      color: accent.primary,
    },
    {
      key: 'communication',
      icon: <MessageCircle size={24} color={accent.primary} />,
      label: language === 'en' ? 'Communication Style' : 'Style de Communication',
      color: accent.primary,
    },
    {
      key: 'anger',
      icon: <AlertCircle size={24} color={accent.primary} />,
      label: language === 'en' ? 'Anger Expression' : 'Expression de la Colère',
      color: accent.primary,
    },
    {
      key: 'social_loved',
      icon: <Heart size={24} color={accent.primary} />,
      label: language === 'en' ? 'Social Strengths' : 'Forces Sociales',
      color: accent.primary,
    },
    {
      key: 'social_challenge',
      icon: <Users size={24} color={accent.primary} />,
      label: language === 'en' ? 'Relationship Dynamics' : 'Dynamiques Relationnelles',
      color: accent.primary,
    },
    {
      key: 'social_attraction',
      icon: <Star size={24} color={accent.primary} />,
      label: language === 'en' ? 'Natural Magnetism' : 'Magnétisme Naturel',
      color: accent.primary,
    },
    {
      key: 'dreams',
      icon: <Eye size={24} color={accent.primary} />,
      label: language === 'en' ? 'Dream Patterns' : 'Motifs de Rêve',
      color: accent.primary,
    },
    {
      key: 'life_blessing',
      icon: <Shield size={24} color={accent.primary} />,
      label: language === 'en' ? 'Life Blessings' : 'Bénédictions de Vie',
      color: accent.primary,
    },
    {
      key: 'divine_support',
      icon: <Sparkles size={24} color={accent.primary} />,
      label: language === 'en' ? 'Divine Support' : 'Soutien Divin',
      color: accent.primary,
    },
    {
      key: 'challenge',
      icon: <TrendingUp size={24} color={accent.primary} />,
      label: language === 'en' ? 'Life Challenges' : 'Défis de Vie',
      color: accent.primary,
    },
  ];

  const availableTraits = traits.filter(trait => (personality as any)[trait.key]);

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>
          {language === 'en' ? 'Personality Profile' : 'Profil de Personnalité'}
        </Text>
        <Text style={styles.subtitle}>
          {language === 'en' 
            ? 'Deep insights into your character and nature' 
            : 'Aperçus profonds de votre caractère et nature'}
        </Text>
      </View>

      {/* Element Badge - Compact, not full gradient */}
      <View style={[styles.elementBadge, { 
        borderColor: `${accent.primary}33`, 
        backgroundColor: `${accent.primary}33`,
        shadowColor: accent.primary 
      }]}>
        <Text style={styles.elementEmoji}>{profile.element_emoji}</Text>
        <View style={styles.elementInfo}>
          <Text style={[styles.elementText, { color: accent.primary }]}>
            {profile.element.charAt(0).toUpperCase() + profile.element.slice(1)} Element
          </Text>
          <Text style={styles.elementNumber}>
            {language === 'en' ? 'Elemental Number' : 'Numéro Élémentaire'}: {profile.element_number}
          </Text>
        </View>
      </View>

      {/* About Profile - Dark card with accent header */}
      <View style={[styles.summaryCard, { 
        borderColor: `${accent.primary}33`, 
        backgroundColor: `${accent.primary}33`,
        shadowColor: accent.primary 
      }]}>
        <View style={styles.summaryHeader}>
          <Info size={20} color={accent.primary} />
          <Text style={[styles.summaryTitle, { color: DarkTheme.textPrimary }]}>
            {language === 'en' ? 'About This Profile' : 'À Propos de ce Profil'}
          </Text>
        </View>
        <Text style={styles.summaryText}>
          {language === 'en'
            ? `Your ${profile.element} nature reveals ${availableTraits.length} key aspects of your personality. Each trait offers insights into your character, relationships, and life path.`
            : `Votre nature ${profile.element} révèle ${availableTraits.length} aspects clés de votre personnalité. Chaque trait offre des aperçus sur votre caractère, vos relations et votre chemin de vie.`}
        </Text>
      </View>

      {/* Personality Traits - Dark with accent icons */}
      {availableTraits.map((trait, index) => {
        const isExpanded = expandedSections.has(trait.key);
        const content = (personality as any)[trait.key];
        
        return (
          <View
            key={trait.key}
            style={[styles.traitCard, { 
              borderColor: `${accent.primary}33`, 
              backgroundColor: `${accent.primary}33`,
              shadowColor: accent.primary 
            }]}
          >
            <TouchableOpacity
              style={styles.traitHeader}
              onPress={() => toggleSection(trait.key)}
              activeOpacity={0.7}
            >
              <View style={styles.traitTitleRow}>
                <View style={[styles.traitIcon, { backgroundColor: `${accent.primary}26` }]}>
                  {trait.icon}
                </View>
                <View style={styles.traitTitleContainer}>
                  <Text style={styles.traitLabel}>{trait.label}</Text>
                  {!isExpanded && (
                    <Text style={styles.traitPreview} numberOfLines={1}>
                      {content}
                    </Text>
                  )}
                </View>
              </View>
              {isExpanded ? (
                <ChevronUp size={20} color={accent.primary} />
              ) : (
                <ChevronDown size={20} color={accent.primary} />
              )}
            </TouchableOpacity>

            {isExpanded && (
              <View style={styles.traitContent}>
                <Text style={styles.traitText}>{content}</Text>
                
                {/* Special styling for specific traits */}
                {trait.key === 'life_blessing' && (
                  <View style={[styles.blessingBadge, { 
                    backgroundColor: accent.glow, 
                    borderColor: accent.primary 
                  }]}>
                    <Shield size={16} color={accent.primary} />
                    <Text style={[styles.blessingText, { color: accent.primary }]}>
                      {language === 'en' ? 'Divine Blessing' : 'Bénédiction Divine'}
                    </Text>
                  </View>
                )}
                
                {trait.key === 'challenge' && (
                  <View style={[styles.challengeBadge, { 
                    backgroundColor: accent.glow, 
                    borderColor: accent.primary 
                  }]}>
                    <AlertCircle size={16} color={accent.primary} />
                    <Text style={[styles.challengeText, { color: accent.primary }]}>
                      {language === 'en' ? 'Area for Growth' : 'Zone de Croissance'}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        );
      })}

      {/* Bottom Spacing */}
      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const Sparkles = ({ size, color }: { size: number; color: string }) => (
  <Star size={size} color={color} />
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1020',
  },
  scrollContent: {
    padding: Spacing.screenPadding,
    paddingBottom: 32,
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
    gap: Spacing.lg,
    padding: Spacing.xl,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: Spacing.xl,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  elementEmoji: {
    fontSize: 48,
  },
  elementInfo: {
    flex: 1,
  },
  elementText: {
    fontSize: Typography.h3,
    fontWeight: Typography.weightBold,
    marginBottom: 4,
  },
  elementNumber: {
    fontSize: Typography.label,
    color: '#cbd5e1',
  },
  summaryCard: {
    padding: Spacing.xl,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: Spacing.xl,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  summaryTitle: {
    fontSize: Typography.body,
    fontWeight: Typography.weightSemibold,
    color: '#fff',
  },
  summaryText: {
    fontSize: Typography.label,
    color: '#cbd5e1',
    lineHeight: Typography.label * Typography.lineHeightRelaxed,
  },
  traitCard: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  traitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    minHeight: 72,
  },
  traitTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  traitIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  traitTitleContainer: {
    flex: 1,
  },
  traitLabel: {
    fontSize: Typography.body,
    fontWeight: Typography.weightSemibold,
    color: '#fff',
    marginBottom: 4,
  },
  traitPreview: {
    fontSize: Typography.caption,
    color: '#94a3b8',
  },
  traitContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  traitText: {
    fontSize: Typography.body,
    color: '#cbd5e1',
    lineHeight: Typography.body * Typography.lineHeightRelaxed,
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  blessingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 8,
    borderWidth: 1,
  },
  blessingText: {
    fontSize: Typography.caption,
    fontWeight: Typography.weightSemibold,
  },
  challengeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 8,
    borderWidth: 1,
  },
  challengeText: {
    fontSize: Typography.caption,
    fontWeight: Typography.weightSemibold,
  },
  bottomSpacer: {
    height: 20,
  },
});
