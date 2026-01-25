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
import Svg, { Circle, Defs, Path, Pattern, Rect } from 'react-native-svg';
import { Spacing, Typography } from "../../../constants/DarkTheme";
import { ElementColors } from '../../../constants/IstikharaColors';
import { getZodiacSign } from '../../../constants/zodiacData';
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

function IslamicPatternOverlay({ opacity = 0.06 }: { opacity?: number }) {
  return (
    <Svg pointerEvents="none" width="100%" height="100%" style={StyleSheet.absoluteFill}>
      <Defs>
        <Pattern id="geom" patternUnits="userSpaceOnUse" width="48" height="48">
          <Path
            d="M24 6 L28 20 L42 24 L28 28 L24 42 L20 28 L6 24 L20 20 Z"
            fill={`rgba(255, 255, 255, ${opacity})`}
          />
          <Circle cx="24" cy="24" r="2.2" fill={`rgba(255, 255, 255, ${opacity + 0.01})`} />
        </Pattern>
      </Defs>
      <Rect x="0" y="0" width="100%" height="100%" fill="url(#geom)" />
    </Svg>
  );
}

function PatternCard({ children, style }: { children: React.ReactNode; style?: any }) {
  return (
    <View style={[styles.patternCard, style]}>
      <View pointerEvents="none" style={styles.patternLayer}>
        <IslamicPatternOverlay />
      </View>
      {children}
    </View>
  );
}

export default function PersonalityTab({ data, elementColor }: PersonalityTabProps) {
  const { language } = useLanguage();
  const profile = data.burujProfile;
  const elementKey = (profile.element?.toLowerCase() || 'fire') as "fire" | "earth" | "air" | "water";
  const accentColor = elementColor || ElementColors[elementKey]?.primarySolid || '#93c5fd';
  const borderColor = `${accentColor}33`;
  const cardBg = `${accentColor}14`;
  const cardBgStrong = `${accentColor}1F`;
  const glowBg = `${accentColor}1A`;
  const zodiac = getZodiacSign(data.burujRemainder);
  const personality = profile.personality?.[language as 'en' | 'fr'] || profile.personality?.en;

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
      icon: <Brain size={24} color={accentColor} />,
      label: language === 'en' ? 'Temperament' : 'Tempérament',
      color: accentColor,
    },
    {
      key: 'communication',
      icon: <MessageCircle size={24} color={accentColor} />,
      label: language === 'en' ? 'Communication Style' : 'Style de Communication',
      color: accentColor,
    },
    {
      key: 'anger',
      icon: <AlertCircle size={24} color={accentColor} />,
      label: language === 'en' ? 'Anger Expression' : 'Expression de la Colère',
      color: accentColor,
    },
    {
      key: 'social_loved',
      icon: <Heart size={24} color={accentColor} />,
      label: language === 'en' ? 'Social Strengths' : 'Forces Sociales',
      color: accentColor,
    },
    {
      key: 'social_challenge',
      icon: <Users size={24} color={accentColor} />,
      label: language === 'en' ? 'Relationship Dynamics' : 'Dynamiques Relationnelles',
      color: accentColor,
    },
    {
      key: 'social_attraction',
      icon: <Star size={24} color={accentColor} />,
      label: language === 'en' ? 'Natural Magnetism' : 'Magnétisme Naturel',
      color: accentColor,
    },
    {
      key: 'dreams',
      icon: <Eye size={24} color={accentColor} />,
      label: language === 'en' ? 'Dream Patterns' : 'Motifs de Rêve',
      color: accentColor,
    },
    {
      key: 'life_blessing',
      icon: <Shield size={24} color={accentColor} />,
      label: language === 'en' ? 'Life Blessings' : 'Bénédictions de Vie',
      color: accentColor,
    },
    {
      key: 'divine_support',
      icon: <Sparkles size={24} color={accentColor} />,
      label: language === 'en' ? 'Divine Support' : 'Soutien Divin',
      color: accentColor,
    },
    {
      key: 'challenge',
      icon: <TrendingUp size={24} color={accentColor} />,
      label: language === 'en' ? 'Life Challenges' : 'Défis de Vie',
      color: accentColor,
    },
  ];

  const availableTraits = traits.filter(trait => personality && (personality as any)[trait.key]);

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
      <PatternCard style={[styles.elementBadge, {
        borderColor,
        backgroundColor: cardBg,
        shadowColor: accentColor,
      }]}>
        <Text style={styles.elementEmoji}>{profile.element_emoji}</Text>
        <View style={styles.elementInfo}>
          <Text style={[styles.elementText, { color: accentColor }]}>
            {profile.element.charAt(0).toUpperCase() + profile.element.slice(1)} Element
          </Text>
          <Text style={styles.elementNumber}>
            {language === 'en' ? 'Elemental Number' : 'Numéro Élémentaire'}: {profile.element_number}
          </Text>
          {!!zodiac && (
            <Text style={styles.elementZodiacLine}>
              {language === 'en' ? 'Burūj' : 'Burūj'}: {language === 'fr' ? zodiac.nameFr : zodiac.nameEn} · {zodiac.planetaryRuler?.[language as 'en' | 'fr'] || zodiac.planetaryRuler?.en}
            </Text>
          )}
        </View>
      </PatternCard>

      {/* About Profile - Dark card with accent header */}
      <PatternCard style={[styles.summaryCard, {
        borderColor,
        backgroundColor: cardBgStrong,
        shadowColor: accentColor,
      }]}>
        <View style={styles.summaryHeader}>
          <Info size={20} color={accentColor} />
          <Text style={styles.summaryTitle}>
            {language === 'en' ? 'About This Profile' : 'À Propos de ce Profil'}
          </Text>
        </View>
        <Text style={styles.summaryText}>
          {language === 'en'
            ? `Your ${profile.element} nature reveals ${availableTraits.length} key aspects of your personality. Each trait offers insights into your character, relationships, and life path.`
            : `Votre nature ${profile.element} révèle ${availableTraits.length} aspects clés de votre personnalité. Chaque trait offre des aperçus sur votre caractère, vos relations et votre chemin de vie.`}
        </Text>
      </PatternCard>

      {/* Personality Traits - Dark with accent icons */}
      {availableTraits.map((trait, index) => {
        const isExpanded = expandedSections.has(trait.key);
        const content = (personality as any)[trait.key];
        
        return (
          <PatternCard
            key={trait.key}
            style={[styles.traitCard, { 
              borderColor,
              backgroundColor: 'rgba(0,0,0,0.16)',
              shadowColor: accentColor,
            }]}
          >
            <TouchableOpacity
              style={styles.traitHeader}
              onPress={() => toggleSection(trait.key)}
              activeOpacity={0.7}
            >
              <View style={styles.traitTitleRow}>
                <View style={[styles.traitIcon, { backgroundColor: `${accentColor}1F`, borderColor: `${accentColor}2E` }]}>
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
                <ChevronUp size={20} color={accentColor} />
              ) : (
                <ChevronDown size={20} color={accentColor} />
              )}
            </TouchableOpacity>

            {isExpanded && (
              <View style={styles.traitContent}>
                <Text style={styles.traitText}>{content}</Text>
                
                {/* Special styling for specific traits */}
                {trait.key === 'life_blessing' && (
                  <View style={[styles.blessingBadge, { 
                    backgroundColor: glowBg,
                    borderColor: `${accentColor}40`,
                  }]}>
                    <Shield size={16} color={accentColor} />
                    <Text style={[styles.blessingText, { color: accentColor }]}>
                      {language === 'en' ? 'Divine Blessing' : 'Bénédiction Divine'}
                    </Text>
                  </View>
                )}
                
                {trait.key === 'challenge' && (
                  <View style={[styles.challengeBadge, { 
                    backgroundColor: glowBg,
                    borderColor: `${accentColor}40`,
                  }]}>
                    <AlertCircle size={16} color={accentColor} />
                    <Text style={[styles.challengeText, { color: accentColor }]}>
                      {language === 'en' ? 'Area for Growth' : 'Zone de Croissance'}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </PatternCard>
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
  patternCard: {
    position: 'relative',
    overflow: 'hidden',
  },
  patternLayer: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.55,
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
  elementZodiacLine: {
    marginTop: 6,
    fontSize: Typography.caption,
    color: '#94a3b8',
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
    borderWidth: 1,
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
