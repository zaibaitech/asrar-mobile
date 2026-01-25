/**
 * Daily Energy Details Screen
 * ===============================
 * Detailed view of today's spiritual timing guidance
 * Shows day ruler, elemental harmony, best activities, and explanations
 * 
 * FREE: Day ruler, Element, General theme, Generic "Best for" categories
 * PREMIUM: Personal impact on user, Elemental harmony guidance, Personalized spiritual advice
 */

import { PremiumSection } from '@/components/subscription/PremiumSection';
import { TimingAnalysisSection } from '@/components/timing';
import { DailyPlanetaryAnalysisDisplay } from '@/components/timing/DailyPlanetaryAnalysisDisplay';
import { DarkTheme, Spacing, Typography } from '@/constants/DarkTheme';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProfile } from '@/contexts/ProfileContext';
import { getCosmicLunarMansionForDate, getLunarMansionByIndex, normalizeMansionIndex, type LunarMansion } from '@/data/lunarMansions';
import { getManazilGuidance, tr } from '@/data/manazilGuidance';
import {
    BADGE_CONFIG,
    getBadgeFromScore,
    type AsrariyaTimingResult,
    type UnifiedBadge,
} from '@/services/AsrariyaTimingEngine';
import { getCurrentLunarMansion } from '@/services/LunarMansionService';
import { getDayRuler, getPlanetInfo } from '@/services/PlanetaryHoursService';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type TimingQuality = 'favorable' | 'neutral' | 'delicate' | 'transformative';

// ============================================
// MANAZIL SOURCE DIFFERENTIATION SYSTEM
// ============================================
// Clear identification of where manazil data comes from:
// - CURRENT_MOON: Live real-time moon position (changes ~2.4 days)
// - FROM_NAME: Personal mansion from name calculation (static)
// - FROM_BIRTH: Personal mansion from exact birth time (static, highest precision)
// - FROM_BIRTH_APPROXIMATE: Personal mansion from approximate birth time

type ManazilSourceType = 'CURRENT_MOON' | 'FROM_NAME' | 'FROM_BIRTH' | 'FROM_BIRTH_APPROXIMATE';

interface ManazilSourceConfig {
  id: ManazilSourceType;
  icon: string;
  badgeColor: string;
  badgeTextColor: string;
  label: { en: string; fr: string; ar: string };
  shortLabel: { en: string; fr: string; ar: string };
  description: { en: string; fr: string; ar: string };
  nature: 'dynamic' | 'static';
}

const MANAZIL_SOURCES: Record<ManazilSourceType, ManazilSourceConfig> = {
  CURRENT_MOON: {
    id: 'CURRENT_MOON',
    icon: '🌙',
    badgeColor: '#3b82f6',
    badgeTextColor: '#ffffff',
    label: {
      en: "Current Moon Position",
      fr: "Position lunaire actuelle",
      ar: "موقع القمر الحالي"
    },
    shortLabel: {
      en: "LIVE",
      fr: "EN DIRECT",
      ar: "مباشر"
    },
    description: {
      en: "The lunar mansion where the Moon is right now. Changes every ~2.4 days as the Moon travels through the 28 mansions.",
      fr: "La demeure lunaire où se trouve la Lune en ce moment. Change environ tous les 2,4 jours.",
      ar: "المنزلة القمرية التي يتواجد فيها القمر الآن. تتغير كل ~2.4 يوم"
    },
    nature: 'dynamic'
  },
  FROM_NAME: {
    id: 'FROM_NAME',
    icon: '📝',
    badgeColor: '#8b5cf6',
    badgeTextColor: '#ffffff',
    label: {
      en: "Personal Mansion (Name)",
      fr: "Demeure personnelle (Nom)",
      ar: "منزلة شخصية (الاسم)"
    },
    shortLabel: {
      en: "PERSONAL",
      fr: "PERSONNEL",
      ar: "شخصي"
    },
    description: {
      en: "Your personal lunar mansion calculated from your Arabic name using traditional Abjad numerology. This is your spiritual signature.",
      fr: "Votre demeure lunaire personnelle calculée à partir de votre nom en utilisant la numérologie Abjad.",
      ar: "منزلتك القمرية الشخصية محسوبة من اسمك العربي باستخدام حساب الأبجد"
    },
    nature: 'static'
  },
  FROM_BIRTH: {
    id: 'FROM_BIRTH',
    icon: '⭐',
    badgeColor: '#f59e0b',
    badgeTextColor: '#000000',
    label: {
      en: "Birth Mansion (Precise)",
      fr: "Demeure de naissance (Précise)",
      ar: "منزلة الميلاد (دقيقة)"
    },
    shortLabel: {
      en: "PRECISE",
      fr: "PRÉCIS",
      ar: "دقيق"
    },
    description: {
      en: "Your birth lunar mansion calculated from your exact birth time and location. Highest precision for personal guidance.",
      fr: "Votre demeure lunaire de naissance calculée à partir de l'heure et du lieu exacts.",
      ar: "منزلة ميلادك القمرية المحسوبة من وقت ومكان ولادتك بدقة"
    },
    nature: 'static'
  },
  FROM_BIRTH_APPROXIMATE: {
    id: 'FROM_BIRTH_APPROXIMATE',
    icon: '🌟',
    badgeColor: '#f97316',
    badgeTextColor: '#ffffff',
    label: {
      en: "Birth Mansion (Estimated)",
      fr: "Demeure de naissance (Estimée)",
      ar: "منزلة الميلادك القمرية المقدرة من تاريخ ولادتك"
    },
    nature: 'static'
  }
};

type Element = 'fire' | 'water' | 'air' | 'earth';

// ============================================
// MANAZIL SOURCE BADGE COMPONENT
// ============================================
interface ManazilSourceBadgeProps {
  sourceType: ManazilSourceType;
  language: 'en' | 'fr' | 'ar';
  size?: 'small' | 'normal';
  showIcon?: boolean;
  onPress?: () => void;
}

function ManazilSourceBadge({ 
  sourceType, 
  language, 
  size = 'normal', 
  showIcon = true,
  onPress 
}: ManazilSourceBadgeProps) {
  const source = MANAZIL_SOURCES[sourceType];
  const isSmall = size === 'small';
  
  const content = (
    <View style={[
      styles.sourceBadge,
      { backgroundColor: source.badgeColor },
      isSmall && styles.sourceBadgeSmall
    ]}>
      {showIcon && <Text style={styles.sourceBadgeIcon}>{source.icon}</Text>}
      <Text style={[
        styles.sourceBadgeText,
        { color: source.badgeTextColor },
        isSmall && styles.sourceBadgeTextSmall
      ]}>
        {source.shortLabel[language]}
      </Text>
      {source.nature === 'dynamic' && (
        <View style={styles.liveDot} />
      )}
    </View>
  );
  
  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }
  
  return content;
}

// ============================================
// MANAZIL SOURCE EXPLAINER MODAL
// ============================================
interface ManazilSourceExplainerProps {
  visible: boolean;
  onClose: () => void;
  language: 'en' | 'fr' | 'ar';
  highlightSource?: ManazilSourceType;
}

function ManazilSourceExplainer({ visible, onClose, language, highlightSource }: ManazilSourceExplainerProps) {
  const titles = {
    en: "Understanding Lunar Mansions",
    fr: "Comprendre les demeures lunaires",
    ar: "فهم المنازل القمرية"
  };
  
  const intros = {
    en: "The app shows two types of lunar mansions. Each serves a different purpose in your spiritual journey.",
    fr: "L'application affiche deux types de demeures lunaires. Chacune a un but différent dans votre cheminement spirituel.",
    ar: "يعرض التطبيق نوعين من المنازل القمرية. كل منها يخدم غرضًا مختلفًا في رحلتك الروحية."
  };

  const sourceEntries: ManazilSourceType[] = ['CURRENT_MOON', 'FROM_NAME', 'FROM_BIRTH'];
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.explainerModal}>
          <View style={styles.explainerHeader}>
            <Text style={styles.explainerTitle}>{titles[language]}</Text>
            <TouchableOpacity onPress={onClose} style={styles.explainerCloseBtn}>
              <Ionicons name="close" size={24} color={DarkTheme.textPrimary} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.explainerContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.explainerIntro}>{intros[language]}</Text>
            
            {sourceEntries.map((sourceKey) => {
              const source = MANAZIL_SOURCES[sourceKey];
              const isHighlighted = highlightSource === sourceKey;
              
              return (
                <View 
                  key={sourceKey}
                  style={[
                    styles.explainerSourceCard,
                    isHighlighted && { borderColor: source.badgeColor, borderWidth: 2 }
                  ]}
                >
                  <View style={styles.explainerSourceHeader}>
                    <Text style={styles.explainerSourceIcon}>{source.icon}</Text>
                    <View style={styles.explainerSourceTitleRow}>
                      <Text style={styles.explainerSourceLabel}>{source.label[language]}</Text>
                      <ManazilSourceBadge 
                        sourceType={sourceKey} 
                        language={language} 
                        size="small" 
                        showIcon={false}
                      />
                    </View>
                  </View>
                  <Text style={styles.explainerSourceDesc}>{source.description[language]}</Text>
                  <View style={styles.explainerSourceNature}>
                    <Text style={[
                      styles.explainerNatureText,
                      { color: source.nature === 'dynamic' ? '#3b82f6' : '#8b5cf6' }
                    ]}>
                      {source.nature === 'dynamic' 
                        ? (language === 'ar' ? '● متغير' : language === 'fr' ? '● Dynamique' : '● Changes over time')
                        : (language === 'ar' ? '● ثابت' : language === 'fr' ? '● Statique' : '● Never changes')
                      }
                    </Text>
                  </View>
                </View>
              );
            })}
            
            <View style={styles.explainerTip}>
              <Text style={styles.explainerTipIcon}>💡</Text>
              <Text style={styles.explainerTipText}>
                {language === 'ar' 
                  ? 'عندما يتطابق موقع القمر الحالي مع منزلتك الشخصية، يكون ذلك وقتًا قويًا بشكل خاص للتأمل والممارسة الروحية.'
                  : language === 'fr'
                  ? 'Quand la position actuelle de la Lune correspond à votre demeure personnelle, c\'est un moment particulièrement puissant pour la méditation.'
                  : 'When the current Moon position aligns with your personal mansion, it\'s an especially powerful time for meditation and spiritual practice.'
                }
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// ============================================
// MANSION DISPLAY CARD (Reusable)
// ============================================
interface MansionCardProps {
  mansion: LunarMansion;
  sourceType: ManazilSourceType;
  language: 'en' | 'fr' | 'ar';
  getElementIcon: (element: Element) => string;
  getElementLabel: (element: Element) => string;
  showFullDetails?: boolean;
  onSourcePress?: () => void;
  isHighlighted?: boolean;
}

function MansionCard({ 
  mansion, 
  sourceType, 
  language, 
  getElementIcon, 
  getElementLabel,
  showFullDetails = false,
  onSourcePress,
  isHighlighted = false
}: MansionCardProps) {
  const [expanded, setExpanded] = useState(false);
  const source = MANAZIL_SOURCES[sourceType];
  
  const guidance = useMemo(() => {
    return getManazilGuidance({
      mansionIndex: mansion.index,
      mansionElement: mansion.element,
    });
  }, [mansion.index, mansion.element]);

  const getElementColor = (element?: Element) => {
    switch (element) {
      case 'fire': return '#fb7185';
      case 'water': return '#60a5fa';
      case 'air': return '#a78bfa';
      case 'earth': return '#4ade80';
      default: return DarkTheme.accent;
    }
  };

  const elementColor = getElementColor(mansion.element);
  const lang = language as 'en' | 'fr' | 'ar';

  return (
    <View style={[
      styles.mansionCard,
      { borderColor: `${source.badgeColor}40` },
      isHighlighted && { borderColor: source.badgeColor, borderWidth: 2 }
    ]}>
      {/* Source Badge Row */}
      <View style={styles.mansionSourceRow}>
        <ManazilSourceBadge 
          sourceType={sourceType} 
          language={language}
          onPress={onSourcePress}
        />
        {source.nature === 'dynamic' && (
          <Text style={styles.mansionUpdateText}>
            {language === 'ar' ? 'يتحدث الآن' : language === 'fr' ? 'Mise à jour en direct' : 'Updates in real-time'}
          </Text>
        )}
      </View>

      {/* Header with mansion info */}
      <View style={styles.mansionHeader}>
        <View style={[styles.mansionIndexBadge, { backgroundColor: `${elementColor}20` }]}>
          <Text style={[styles.mansionIndex, { color: elementColor }]}>
            {mansion.index + 1}
          </Text>
        </View>
        <View style={styles.mansionHeaderText}>
          <Text style={styles.mansionNameArabic}>{mansion.nameArabic}</Text>
          <Text style={styles.mansionNameTranslit}>{mansion.nameTransliteration}</Text>
          <Text style={styles.mansionNameEnglish}>
            {language === 'fr' ? mansion.nameFrench : mansion.nameEnglish}
          </Text>
        </View>
        <View style={[styles.mansionElementBadge, { backgroundColor: `${elementColor}15`, borderColor: `${elementColor}30` }]}>
          <Text style={styles.mansionElementIcon}>{getElementIcon(mansion.element)}</Text>
          <Text style={[styles.mansionElementText, { color: elementColor }]}>
            {getElementLabel(mansion.element)}
          </Text>
        </View>
      </View>

      {/* Theme & Quality */}
      {guidance && (
        <View style={styles.mansionThemeRow}>
          <View style={[styles.mansionThemeBadge, { backgroundColor: 'rgba(139, 92, 246, 0.15)' }]}>
            <Text style={styles.mansionThemeText}>
              ✦ {tr(guidance.themeLabel, lang)}
            </Text>
          </View>
          <Text style={styles.mansionQuality}>{tr(guidance.quality, lang)}</Text>
        </View>
      )}

      {/* Essence */}
      {guidance && (
        <View style={styles.mansionEssenceBox}>
          <Text style={styles.mansionEssenceLabel}>
            {language === 'ar' ? 'الجوهر' : language === 'fr' ? 'Essence' : 'Essence'}
          </Text>
          <Text style={styles.mansionEssence}>{tr(guidance.essence, lang)}</Text>
        </View>
      )}

      {/* Expandable Details (only for full details mode) */}
      {showFullDetails && (
        <>
          <TouchableOpacity 
            style={styles.mansionExpandButton}
            onPress={() => setExpanded(!expanded)}
          >
            <Text style={styles.mansionExpandText}>
              {expanded 
                ? (language === 'ar' ? 'إخفاء التفاصيل' : language === 'fr' ? 'Masquer' : 'Hide Details')
                : (language === 'ar' ? 'عرض التفاصيل' : language === 'fr' ? 'Voir plus' : 'View Details')
              }
            </Text>
            <Ionicons 
              name={expanded ? 'chevron-up' : 'chevron-down'} 
              size={16} 
              color={DarkTheme.accent} 
            />
          </TouchableOpacity>

          {expanded && guidance && (
            <View style={styles.mansionExpandedContent}>
              <View style={styles.mansionDetailBlock}>
                <Text style={styles.mansionDetailLabel}>
                  {language === 'ar' ? 'ما يتجلى' : language === 'fr' ? 'Ce qui se manifeste' : 'What Manifests'}
                </Text>
                <Text style={styles.mansionDetailText}>{tr(guidance.manifests, lang)}</Text>
              </View>

              <View style={styles.mansionDetailBlock}>
                <View style={styles.mansionDetailHeader}>
                  <Text style={styles.mansionDetailIcon}>✓</Text>
                  <Text style={[styles.mansionDetailLabel, { color: '#10b981' }]}>
                    {language === 'ar' ? 'أيسر اليوم' : language === 'fr' ? 'Plus facile aujourd\'hui' : 'Easier Today'}
                  </Text>
                </View>
                <Text style={styles.mansionDetailText}>{tr(guidance.easier, lang)}</Text>
              </View>

              <View style={styles.mansionDetailBlock}>
                <View style={styles.mansionDetailHeader}>
                  <Text style={styles.mansionDetailIcon}>⚠️</Text>
                  <Text style={[styles.mansionDetailLabel, { color: '#f59e0b' }]}>
                    {language === 'ar' ? 'حساس اليوم' : language === 'fr' ? 'Sensible aujourd\'hui' : 'Sensitive Today'}
                  </Text>
                </View>
                <Text style={styles.mansionDetailText}>{tr(guidance.sensitive, lang)}</Text>
              </View>

              {guidance.reflection && (
                <View style={[styles.mansionReflectionBox, { borderColor: `${elementColor}30` }]}>
                  <Text style={styles.mansionReflectionLabel}>
                    {language === 'ar' ? 'تأمل' : language === 'fr' ? 'Réflexion' : 'Reflection'}
                  </Text>
                  <Text style={styles.mansionReflectionText}>
                    "{tr(guidance.reflection.hikmah, lang)}"
                  </Text>
                  {guidance.reflection.ayahRef && (
                    <Text style={styles.mansionAyahRef}>📖 {guidance.reflection.ayahRef}</Text>
                  )}
                </View>
              )}
            </View>
          )}
        </>
      )}
    </View>
  );
}

// ============================================
// MANAZIL ALIGNMENT INSIGHT
// ============================================
interface ManazilAlignmentProps {
  currentMoon: LunarMansion | null;
  personalMansion: LunarMansion | null;
  language: 'en' | 'fr' | 'ar';
}

function ManazilAlignmentInsight({ currentMoon, personalMansion, language }: ManazilAlignmentProps) {
  if (!currentMoon || !personalMansion) return null;
  
  const isAligned = currentMoon.index === personalMansion.index;
  const sameElement = currentMoon.element === personalMansion.element;
  
  const getInsight = () => {
    if (isAligned) {
      return {
        icon: '✨',
        color: '#10b981',
        title: {
          en: "Perfect Alignment!",
          fr: "Alignement parfait !",
          ar: "توافق تام!"
        },
        message: {
          en: "The Moon is in your personal mansion today. This is a powerful time for inner work, meditation, and connecting with your deepest intentions.",
          fr: "La Lune est dans votre demeure personnelle aujourd'hui. C'est un moment puissant pour le travail intérieur et la méditation.",
          ar: "القمر في منزلتك الشخصية اليوم. هذا وقت قوي للعمل الداخلي والتأمل."
        }
      };
    } else if (sameElement) {
      return {
        icon: '🌟',
        color: '#8b5cf6',
        title: {
          en: "Elemental Harmony",
          fr: "Harmonie élémentaire",
          ar: "انسجام عنصري"
        },
        message: {
          en: `Both mansions share the ${currentMoon.element} element. You'll feel naturally attuned to today's cosmic energies.`,
          fr: `Les deux demeures partagent l'élément ${currentMoon.element}. Vous vous sentirez naturellement en harmonie.`,
          ar: `كلا المنزلتين تشتركان في عنصر ${currentMoon.element}. ستشعر بالتناغم الطبيعي مع طاقات اليوم.`
        }
      };
    } else {
      return {
        icon: '🔄',
        color: '#3b82f6',
        title: {
          en: "Cosmic Conversation",
          fr: "Dialogue cosmique",
          ar: "حوار كوني"
        },
        message: {
          en: `Today's ${currentMoon.element} Moon energy interacts with your ${personalMansion.element} nature. Notice how these energies blend.`,
          fr: `L'énergie lunaire ${currentMoon.element} d'aujourd'hui interagit avec votre nature ${personalMansion.element}.`,
          ar: `طاقة القمر ${currentMoon.element} اليوم تتفاعل مع طبيعتك ${personalMansion.element}.`
        }
      };
    }
  };
  
  const insight = getInsight();
  
  return (
    <View style={[styles.alignmentCard, { borderColor: `${insight.color}40` }]}>
      <View style={styles.alignmentHeader}>
        <Text style={styles.alignmentIcon}>{insight.icon}</Text>
        <Text style={[styles.alignmentTitle, { color: insight.color }]}>{insight.title[language]}</Text>
      </View>
      <Text style={styles.alignmentMessage}>{insight.message[language]}</Text>
    </View>
  );
}

// ============================================
// ENHANCED MANAZIL SECTION (Main Component)
// ============================================
interface ManazilSectionProps {
  manazilBaseline: ReturnType<typeof getLunarMansionByIndex>;
  language: 'en' | 'fr' | 'ar';
  t: (key: string, params?: Record<string, string>) => string;
  getElementIcon: (element: Element) => string;
  getElementLabel: (element: Element) => string;
}

function ManazilSection({ manazilBaseline, language, t, getElementIcon, getElementLabel }: ManazilSectionProps) {
  const [showExplainer, setShowExplainer] = useState(false);
  const [currentMoonMansion, setCurrentMoonMansion] = useState<LunarMansion | null>(null);
  const [currentMoonLoading, setCurrentMoonLoading] = useState(true);

  // Fetch current moon position on mount
  useEffect(() => {
    async function fetchCurrentMoon() {
      try {
        setCurrentMoonLoading(true);
        const result = await getCurrentLunarMansion();
        if (result && result.mansion) {
          const mansion = getLunarMansionByIndex(result.index);
          setCurrentMoonMansion(mansion);
        } else {
          // Fallback to calculated position
          const fallback = getCosmicLunarMansionForDate(new Date());
          setCurrentMoonMansion(fallback);
        }
      } catch (error) {
        console.error('Error fetching current moon:', error);
        // Use fallback calculation
        const fallback = getCosmicLunarMansionForDate(new Date());
        setCurrentMoonMansion(fallback);
      } finally {
        setCurrentMoonLoading(false);
      }
    }
    fetchCurrentMoon();
  }, []);

  const sectionTitles = {
    en: "Lunar Mansions (Manāzil)",
    fr: "Demeures lunaires (Manāzil)",
    ar: "المنازل القمرية"
  };

  const currentMoonTitles = {
    en: "Tonight's Moon",
    fr: "La Lune ce soir",
    ar: "قمر الليلة"
  };

  const personalMansionTitles = {
    en: "Your Personal Mansion",
    fr: "Votre demeure personnelle",
    ar: "منزلتك الشخصية"
  };

  const learnMoreText = {
    en: "Learn about the difference",
    fr: "En savoir plus sur la différence",
    ar: "تعرف على الفرق"
  };

  const loadingText = {
    en: "Loading current moon position...",
    fr: "Chargement de la position lunaire...",
    ar: "جاري تحميل موقع القمر..."
  };

  return (
    <View style={styles.section}>
      {/* Section Header */}
      <View style={styles.manazilSectionHeader}>
        <Text style={styles.sectionTitle}>{sectionTitles[language]}</Text>
        <TouchableOpacity 
          style={styles.learnMoreButton}
          onPress={() => setShowExplainer(true)}
        >
          <Ionicons name="help-circle-outline" size={20} color={DarkTheme.accent} />
          <Text style={styles.learnMoreText}>{learnMoreText[language]}</Text>
        </TouchableOpacity>
      </View>

      {/* Current Moon Position Section */}
      <View style={styles.manazilSubsection}>
        <Text style={styles.manazilSubsectionTitle}>
          🌙 {currentMoonTitles[language]}
        </Text>
        {currentMoonLoading ? (
          <View style={styles.loadingCard}>
            <Text style={styles.loadingText}>{loadingText[language]}</Text>
          </View>
        ) : currentMoonMansion ? (
          <MansionCard
            mansion={currentMoonMansion}
            sourceType="CURRENT_MOON"
            language={language}
            getElementIcon={getElementIcon}
            getElementLabel={getElementLabel}
            showFullDetails={false}
            onSourcePress={() => setShowExplainer(true)}
          />
        ) : null}
      </View>

      {/* Alignment Insight (when both are available) */}
      {currentMoonMansion && manazilBaseline && (
        <ManazilAlignmentInsight
          currentMoon={currentMoonMansion}
          personalMansion={manazilBaseline}
          language={language}
        />
      )}

      {/* Personal Mansion Section */}
      <View style={styles.manazilSubsection}>
        <Text style={styles.manazilSubsectionTitle}>
          📝 {personalMansionTitles[language]}
        </Text>
        {manazilBaseline ? (
          <MansionCard
            mansion={manazilBaseline}
            sourceType="FROM_NAME"
            language={language}
            getElementIcon={getElementIcon}
            getElementLabel={getElementLabel}
            showFullDetails={true}
            onSourcePress={() => setShowExplainer(true)}
          />
        ) : (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={{ fontSize: 24 }}>🌙</Text>
              <Text style={[styles.cardTitle, { color: DarkTheme.accent }]}>
                {t('home.dailyGuidanceDetails.manazil.title')}
              </Text>
            </View>
            <Text style={styles.cardText}>{t('home.dailyGuidanceDetails.manazil.missing')}</Text>
          </View>
        )}
      </View>

      {/* Info hint */}
      <Text style={styles.manazilHint}>
        {t('home.dailyGuidanceDetails.manazil.hint')}
      </Text>

      {/* Source Explainer Modal */}
      <ManazilSourceExplainer
        visible={showExplainer}
        onClose={() => setShowExplainer(false)}
        language={language}
      />
    </View>
  );
}

export default function DailyGuidanceDetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t, language } = useLanguage();
  const { profile } = useProfile();
  const params = useLocalSearchParams();
  
  const [bestForExpanded, setBestForExpanded] = useState(true);
  const [whyThisExpanded, setWhyThisExpanded] = useState(false);
  
  // Parse params
  const timingQuality = (params.timingQuality as TimingQuality) || 'neutral';
  const dayElement = (params.dayElement as Element) || 'earth';
  const messageKey = (params.messageKey as string) || '';
  const messageParams = params.messageParams ? JSON.parse(params.messageParams as string) : {};
  const bestForKeys = params.bestForKeys ? JSON.parse(params.bestForKeys as string) : [];
  const avoidKeys = params.avoidKeys ? JSON.parse(params.avoidKeys as string) : [];
  const peakHoursKey = (params.peakHoursKey as string) || '';
  
  const now = new Date();
  const dayOfWeek = now.getDay();
  const dayKeys = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayKey = dayKeys[dayOfWeek];
  const dayName = t(`home.dailyGuidanceDetails.days.${dayKey}`);
  const date = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  // Ensure interpolated params contain human-readable values.
  // (The guidance service may provide a translation key for "day" since it doesn't have access to `t`.)
  const resolvedMessageParams = React.useMemo(() => {
    if (!messageParams || typeof messageParams !== 'object') return {};
    return {
      ...messageParams,
      day: dayName,
    };
  }, [messageParams, dayName]);
  
  // Get day ruler
  const dayRuler = getDayRuler(now);
  const dayRulerInfo = getPlanetInfo(dayRuler);
  
  // Unified timing state - single source of truth for badges
  const [timingResult, setTimingResult] = React.useState<AsrariyaTimingResult | null>(null);
  
  // Get unified badge from timing analysis
  const unifiedBadge: UnifiedBadge = timingResult 
    ? getBadgeFromScore(timingResult.overallScore) 
    : 'MAINTAIN';
  const badgeConfig = BADGE_CONFIG[unifiedBadge];
  
  // Use unified badge color when timing result available, otherwise fallback to old logic
  function getStatusColor() {
    if (timingResult) {
      return badgeConfig.color;
    }
    // Fallback for old system (only used before timing loads)
    switch (timingQuality) {
      case 'favorable':
        return '#10b981';
      case 'transformative':
        return '#f59e0b';
      case 'delicate':
        return '#ef4444';
      default:
        return '#64B5F6';
    }
  }
  
  function getStatusLabel() {
    // Use unified badge when timing result available
    if (timingResult) {
      return `${badgeConfig.icon} ${t(`timing.badges.${unifiedBadge.toLowerCase()}.label`) || unifiedBadge}`;
    }
    return t(`home.dailyGuidanceDetails.window.${timingQuality}`);
  }
  
  function getElementIcon(element: Element) {
    const icons = {
      fire: '🔥',
      water: '💧',
      air: '🌬️',
      earth: '🌱',
    };
    return icons[element];
  }
  
  function getElementLabel(element: Element) {
    return t(`home.dailyGuidanceDetails.elements.${element}`);
  }
  
  const statusColor = getStatusColor();

  const manazilBaselineIndex = normalizeMansionIndex(profile?.derived?.manazilBaseline);
  const manazilBaseline = manazilBaselineIndex !== null
    ? getLunarMansionByIndex(manazilBaselineIndex)
    : null;

  const ascendantBurj = profile?.derived?.ascendantBurj;
  const ascendantElement = profile?.derived?.ascendantElement as Element | undefined;

  function getElementRelationship(a?: Element, b?: Element): 'harmonious' | 'complementary' | 'transformative' | 'neutral' {
    if (!a || !b) return 'neutral';
    if (a === b) return 'harmonious';
    const active = new Set<Element>(['fire', 'air']);
    const receptive = new Set<Element>(['water', 'earth']);
    if ((active.has(a) && active.has(b)) || (receptive.has(a) && receptive.has(b))) {
      return 'complementary';
    }
    const oppositions: Record<Element, Element> = {
      fire: 'water',
      water: 'fire',
      air: 'earth',
      earth: 'air',
    };
    return oppositions[a] === b ? 'transformative' : 'neutral';
  }
  
  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={DarkTheme.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>{t('home.dailyGuidanceDetails.title')}</Text>
          <Text style={styles.headerSubtitle}>{dayName}, {date}</Text>
        </View>
        <View style={styles.placeholder} />
      </View>
      
      <LinearGradient
        colors={[`${statusColor}15`, `${statusColor}05`, DarkTheme.screenBackground]}
        style={styles.gradientContainer}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Status Badge - Uses unified badge when timing loads */}
          <View style={[styles.statusBadge, { backgroundColor: `${statusColor}20`, borderColor: statusColor }]}>
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            <Text style={[styles.statusText, { color: statusColor }]}>{getStatusLabel()}</Text>
            {timingResult && (
              <Text style={[styles.statusScore, { color: statusColor }]}>
                {timingResult.overallScore}%
              </Text>
            )}
          </View>

          {/* Asrariya Timing Analysis - Personalized */}
          <TimingAnalysisSection
            context="daily"
            hideSections={['alternatives']}
            onAnalysisComplete={setTimingResult}
          />

          {/* Enhanced Planetary Strength Analysis */}
          <DailyPlanetaryAnalysisDisplay expanded={true} />
          
          {/* Day Ruler Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('home.dailyGuidanceDetails.sections.dayRuler')}</Text>
            <View style={styles.planetCard}>
              <Text style={styles.planetSymbol}>{dayRulerInfo.symbol}</Text>
              <View style={styles.planetInfo}>
                <Text style={styles.planetName}>{dayRuler}</Text>
                <Text style={styles.planetArabic}>{dayRulerInfo.arabicName}</Text>
                <Text style={styles.planetElement}>
                  {getElementIcon(dayRulerInfo.element)} {t('home.dailyGuidanceDetails.elementText', { element: getElementLabel(dayRulerInfo.element) })}
                </Text>
              </View>
            </View>
            <Text style={styles.explainerText}>
              {t('home.dailyGuidanceDetails.dayRulerText', { 
                planet: dayRuler, 
                element: getElementLabel(dayRulerInfo.element).toLowerCase() 
              })}
            </Text>
          </View>
          
          {/* Daily Window Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('home.dailyGuidanceDetails.sections.dailyWindow')}</Text>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="compass-outline" size={24} color={statusColor} />
                <Text style={[styles.cardTitle, { color: statusColor }]}>{getStatusLabel()}</Text>
              </View>
              <Text style={styles.cardText}>
                {t(`home.dailyGuidanceDetails.windowDescription.${timingQuality}`)}
              </Text>
              {messageKey && (
                <Text style={styles.cardText}>
                  {t(messageKey, resolvedMessageParams)}
                </Text>
              )}
            </View>
          </View>

          {/* Manazil (Lunar Mansion) Section - Enhanced */}
          <ManazilSection
            manazilBaseline={manazilBaseline}
            language={language as 'en' | 'fr' | 'ar'}
            t={t}
            getElementIcon={getElementIcon}
            getElementLabel={getElementLabel}
          />

          {/* Ascendant Lens (Educational) */}
          {ascendantBurj && ascendantElement && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('home.dailyGuidanceDetails.sections.ascendantLens')}</Text>
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Ionicons name="sparkles-outline" size={24} color={DarkTheme.accent} />
                  <Text style={[styles.cardTitle, { color: DarkTheme.accent }]}>
                    {t('home.dailyGuidanceDetails.ascendant.title')}
                  </Text>
                </View>
                <Text style={styles.cardText}>
                  {t('home.dailyGuidanceDetails.ascendant.summary', {
                    sign: ascendantBurj,
                    element: getElementLabel(ascendantElement).toLowerCase(),
                  })}
                </Text>
                <Text style={styles.cardText}>
                  {t(`home.dailyGuidanceDetails.ascendant.elementHints.${ascendantElement}`)}
                </Text>
                <Text style={styles.cardText}>
                  {t(`home.dailyGuidanceDetails.ascendant.blend.${getElementRelationship(ascendantElement, dayElement)}`)}
                </Text>
              </View>
            </View>
          )}
          
          {/* PREMIUM: Best For Section - Personal action guidance */}
          {bestForKeys.length > 0 && (
            <PremiumSection
              featureId="personalGuidance"
              title={t('premiumSections.bestActionsToday.title')}
              description={t('premiumSections.bestActionsToday.description')}
              icon="✅"
              compact={false}
            >
              <View style={styles.section}>
                <TouchableOpacity 
                  style={styles.expandableHeader}
                  onPress={() => setBestForExpanded(!bestForExpanded)}
                >
                  <Text style={styles.sectionTitle}>✅ {t('home.dailyGuidanceDetails.sections.bestFor')}</Text>
                  <Ionicons 
                    name={bestForExpanded ? 'chevron-up' : 'chevron-down'} 
                    size={20} 
                    color={DarkTheme.textSecondary}
                  />
                </TouchableOpacity>
                {bestForExpanded && (
                  <View style={styles.listCard}>
                    {bestForKeys.map((key: string, index: number) => (
                      <View key={index} style={styles.listItem}>
                        <View style={[styles.listDot, { backgroundColor: '#10b981' }]} />
                        <Text style={styles.listText}>{t(key)}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </PremiumSection>
          )}
          
          {/* Why This? Section - FREE (Educational) */}
          <View style={styles.section}>
            <TouchableOpacity 
              style={styles.expandableHeader}
              onPress={() => setWhyThisExpanded(!whyThisExpanded)}
            >
              <Text style={styles.sectionTitle}>💡 {t('home.dailyGuidanceDetails.sections.whyThis')}</Text>
              <Ionicons 
                name={whyThisExpanded ? 'chevron-up' : 'chevron-down'} 
                size={20} 
                color={DarkTheme.textSecondary}
              />
            </TouchableOpacity>
            {whyThisExpanded && (
              <View style={styles.card}>
                <Text style={styles.cardText}>
                  • {t('home.dailyGuidanceDetails.whyThisContent.line1', { day: dayName, planet: dayRuler })}{'\n\n'}
                  • {t('home.dailyGuidanceDetails.whyThisContent.line2', { element: getElementLabel(dayElement).toLowerCase(), planet: dayRuler })}{'\n\n'}
                  • {t('home.dailyGuidanceDetails.whyThisContent.line4')}
                </Text>
              </View>
            )}
          </View>
          
          {/* Footer Disclaimer */}
          <View style={styles.disclaimer}>
            <Ionicons name="information-circle-outline" size={16} color={DarkTheme.textTertiary} />
            <Text style={styles.disclaimerText}>
              {t('home.dailyGuidanceDetails.disclaimer')}
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

function getHarmonyColor(level: string): string {
  switch (level) {
    case 'Harmonious':
      return '#10b981';
    case 'Supportive':
      return '#059669';
    case 'Challenging':
      return '#ef4444';
    default:
      return '#64748b';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DarkTheme.screenBackground,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  backButton: {
    padding: Spacing.xs,
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: DarkTheme.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
    marginTop: 2,
  },
  placeholder: {
    width: 40,
  },
  
  gradientContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    gap: Spacing.xl,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: Spacing.lg,
    borderWidth: 2,
    alignSelf: 'flex-start',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusText: {
    fontSize: Typography.h3,
    fontWeight: Typography.weightBold as any,
  },
  statusScore: {
    fontSize: Typography.h2,
    fontWeight: Typography.weightBold as any,
    marginLeft: 'auto',
  },
  section: {
    gap: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.h3,
    fontWeight: Typography.weightBold as any,
    color: DarkTheme.textPrimary,
  },
  expandableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  planetCard: {
    flexDirection: 'row',
    gap: Spacing.lg,
    padding: Spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  planetSymbol: {
    fontSize: 48,
  },
  planetInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  planetName: {
    fontSize: Typography.h2,
    fontWeight: Typography.weightBold as any,
    color: DarkTheme.textPrimary,
  },
  planetArabic: {
    fontSize: Typography.body,
    color: DarkTheme.textSecondary,
  },
  planetElement: {
    fontSize: Typography.label,
    color: DarkTheme.textTertiary,
  },
  card: {
    padding: Spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    gap: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  cardTitle: {
    fontSize: Typography.h3,
    fontWeight: Typography.weightBold as any,
  },
  cardText: {
    fontSize: Typography.body,
    lineHeight: Typography.body * Typography.lineHeightNormal,
    color: DarkTheme.textSecondary,
  },
  explainerText: {
    fontSize: Typography.body,
    lineHeight: Typography.body * Typography.lineHeightNormal,
    color: DarkTheme.textSecondary,
  },
  harmonyCard: {
    padding: Spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    gap: Spacing.md,
  },
  harmonyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  harmonyElementBox: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  harmonyElementIcon: {
    fontSize: 32,
  },
  harmonyElementLabel: {
    fontSize: Typography.label,
    color: DarkTheme.textSecondary,
  },
  harmonySymbol: {
    fontSize: 24,
    color: DarkTheme.textTertiary,
  },
  harmonyBadge: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: Spacing.md,
    alignSelf: 'center',
  },
  harmonyLevel: {
    fontSize: Typography.h3,
    fontWeight: Typography.weightBold as any,
    textAlign: 'center',
  },
  harmonyExplanation: {
    fontSize: Typography.body,
    lineHeight: Typography.body * Typography.lineHeightNormal,
    color: DarkTheme.textSecondary,
    textAlign: 'center',
  },
  listCard: {
    padding: Spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    gap: Spacing.md,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  listDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
  },
  listText: {
    flex: 1,
    fontSize: Typography.body,
    lineHeight: Typography.body * Typography.lineHeightNormal,
    color: DarkTheme.textSecondary,
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    justifyContent: 'center',
    paddingVertical: Spacing.md,
  },
  disclaimerText: {
    fontSize: Typography.caption,
    color: DarkTheme.textTertiary,
  },

  // Enhanced Manazil Section Styles
  manazilCard: {
    padding: Spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: Spacing.lg,
    borderWidth: 1,
    gap: Spacing.md,
  },
  manazilHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  manazilIndexBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  manazilIndex: {
    fontSize: 20,
    fontWeight: Typography.weightBold as any,
  },
  manazilHeaderText: {
    flex: 1,
    gap: 2,
  },
  manazilNameArabic: {
    fontSize: Typography.h2,
    fontWeight: Typography.weightBold as any,
    color: DarkTheme.textPrimary,
  },
  manazilNameTranslit: {
    fontSize: Typography.body,
    color: DarkTheme.textSecondary,
    fontStyle: 'italic',
  },
  manazilNameEnglish: {
    fontSize: Typography.caption,
    color: DarkTheme.textTertiary,
  },
  manazilElementBadge: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: Spacing.md,
    borderWidth: 1,
    alignItems: 'center',
    gap: 2,
  },
  manazilElementIcon: {
    fontSize: 18,
  },
  manazilElementText: {
    fontSize: Typography.caption,
    fontWeight: Typography.weightMedium as any,
  },
  manazilThemeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flexWrap: 'wrap',
    marginTop: Spacing.xs,
  },
  manazilThemeBadge: {
    paddingVertical: 4,
    paddingHorizontal: Spacing.sm,
    borderRadius: 12,
  },
  manazilThemeText: {
    fontSize: Typography.caption,
    color: '#a78bfa',
    fontWeight: Typography.weightMedium as any,
  },
  manazilQuality: {
    fontSize: Typography.caption,
    color: DarkTheme.textTertiary,
    flex: 1,
  },
  manazilEssenceBox: {
    backgroundColor: 'rgba(139, 92, 246, 0.08)',
    padding: Spacing.md,
    borderRadius: Spacing.md,
    marginTop: Spacing.xs,
  },
  manazilEssenceLabel: {
    fontSize: Typography.caption,
    color: '#a78bfa',
    fontWeight: Typography.weightMedium as any,
    marginBottom: 4,
  },
  manazilEssence: {
    fontSize: Typography.body,
    lineHeight: Typography.body * Typography.lineHeightNormal,
    color: DarkTheme.textPrimary,
  },
  manazilExpandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    marginTop: Spacing.xs,
  },
  manazilExpandText: {
    fontSize: Typography.caption,
    color: '#FFFFFF',
    fontWeight: Typography.weightMedium as any,
  },
  manazilExpandedContent: {
    gap: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  manazilDetailBlock: {
    gap: 4,
  },
  manazilDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  manazilDetailIcon: {
    fontSize: 14,
  },
  manazilDetailLabel: {
    fontSize: Typography.caption,
    fontWeight: Typography.weightMedium as any,
    color: DarkTheme.textSecondary,
  },
  manazilDetailText: {
    fontSize: Typography.body,
    lineHeight: Typography.body * Typography.lineHeightNormal,
    color: DarkTheme.textSecondary,
  },
  manazilReflectionBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    padding: Spacing.md,
    borderRadius: Spacing.md,
    borderLeftWidth: 3,
    marginTop: Spacing.xs,
  },
  manazilReflectionLabel: {
    fontSize: Typography.caption,
    color: DarkTheme.accent,
    fontWeight: Typography.weightMedium as any,
    marginBottom: 6,
  },
  manazilReflectionText: {
    fontSize: Typography.body,
    lineHeight: Typography.body * Typography.lineHeightNormal,
    color: DarkTheme.textPrimary,
    fontStyle: 'italic',
  },
  manazilAyahRef: {
    fontSize: Typography.caption,
    color: DarkTheme.textTertiary,
    marginTop: Spacing.sm,
  },
  manazilHint: {
    fontSize: Typography.caption,
    color: DarkTheme.textTertiary,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },

  // ===========================================
  // SOURCE DIFFERENTIATION STYLES
  // ===========================================
  
  // Source Badge
  sourceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  sourceBadgeSmall: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  sourceBadgeIcon: {
    fontSize: 12,
  },
  sourceBadgeText: {
    fontSize: 11,
    fontWeight: '700' as any,
    letterSpacing: 0.5,
  },
  sourceBadgeTextSmall: {
    fontSize: 9,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10b981',
  },

  // Section Header with Learn More
  manazilSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  learnMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  learnMoreText: {
    fontSize: Typography.caption,
    color: DarkTheme.accent,
  },

  // Subsection (Current Moon / Personal)
  manazilSubsection: {
    gap: Spacing.sm,
  },
  manazilSubsectionTitle: {
    fontSize: Typography.label,
    fontWeight: Typography.weightMedium as any,
    color: DarkTheme.textSecondary,
    marginBottom: 4,
  },

  // Loading State
  loadingCard: {
    padding: Spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: Typography.body,
    color: DarkTheme.textTertiary,
    fontStyle: 'italic',
  },

  // Mansion Card (replaces manazilCard for reusable component)
  mansionCard: {
    padding: Spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: Spacing.lg,
    borderWidth: 1,
    gap: Spacing.md,
  },
  mansionSourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  mansionUpdateText: {
    fontSize: Typography.caption,
    color: DarkTheme.textTertiary,
    fontStyle: 'italic',
  },
  mansionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  mansionIndexBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mansionIndex: {
    fontSize: 20,
    fontWeight: Typography.weightBold as any,
  },
  mansionHeaderText: {
    flex: 1,
    gap: 2,
  },
  mansionNameArabic: {
    fontSize: Typography.h2,
    fontWeight: Typography.weightBold as any,
    color: DarkTheme.textPrimary,
  },
  mansionNameTranslit: {
    fontSize: Typography.body,
    color: DarkTheme.textSecondary,
    fontStyle: 'italic',
  },
  mansionNameEnglish: {
    fontSize: Typography.caption,
    color: DarkTheme.textTertiary,
  },
  mansionElementBadge: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: Spacing.md,
    borderWidth: 1,
    alignItems: 'center',
    gap: 2,
  },
  mansionElementIcon: {
    fontSize: 18,
  },
  mansionElementText: {
    fontSize: Typography.caption,
    fontWeight: Typography.weightMedium as any,
  },
  mansionThemeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flexWrap: 'wrap',
    marginTop: Spacing.xs,
  },
  mansionThemeBadge: {
    paddingVertical: 4,
    paddingHorizontal: Spacing.sm,
    borderRadius: 12,
  },
  mansionThemeText: {
    fontSize: Typography.caption,
    color: '#a78bfa',
    fontWeight: Typography.weightMedium as any,
  },
  mansionQuality: {
    fontSize: Typography.caption,
    color: DarkTheme.textTertiary,
    flex: 1,
  },
  mansionEssenceBox: {
    backgroundColor: 'rgba(139, 92, 246, 0.08)',
    padding: Spacing.md,
    borderRadius: Spacing.md,
    marginTop: Spacing.xs,
  },
  mansionEssenceLabel: {
    fontSize: Typography.caption,
    color: '#a78bfa',
    fontWeight: Typography.weightMedium as any,
    marginBottom: 4,
  },
  mansionEssence: {
    fontSize: Typography.body,
    lineHeight: Typography.body * Typography.lineHeightNormal,
    color: DarkTheme.textPrimary,
  },
  mansionExpandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    marginTop: Spacing.xs,
  },
  mansionExpandText: {
    fontSize: Typography.caption,
    color: '#FFFFFF',
    fontWeight: Typography.weightMedium as any,
  },
  mansionExpandedContent: {
    gap: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  mansionDetailBlock: {
    gap: 4,
  },
  mansionDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  mansionDetailIcon: {
    fontSize: 14,
  },
  mansionDetailLabel: {
    fontSize: Typography.caption,
    fontWeight: Typography.weightMedium as any,
    color: DarkTheme.textSecondary,
  },
  mansionDetailText: {
    fontSize: Typography.body,
    lineHeight: Typography.body * Typography.lineHeightNormal,
    color: DarkTheme.textSecondary,
  },
  mansionReflectionBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    padding: Spacing.md,
    borderRadius: Spacing.md,
    borderLeftWidth: 3,
    marginTop: Spacing.xs,
  },
  mansionReflectionLabel: {
    fontSize: Typography.caption,
    color: DarkTheme.accent,
    fontWeight: Typography.weightMedium as any,
    marginBottom: 6,
  },
  mansionReflectionText: {
    fontSize: Typography.body,
    lineHeight: Typography.body * Typography.lineHeightNormal,
    color: DarkTheme.textPrimary,
    fontStyle: 'italic',
  },
  mansionAyahRef: {
    fontSize: Typography.caption,
    color: DarkTheme.textTertiary,
    marginTop: Spacing.sm,
  },

  // Alignment Insight Card
  alignmentCard: {
    padding: Spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: Spacing.lg,
    borderWidth: 1,
    gap: Spacing.sm,
    marginVertical: Spacing.sm,
  },
  alignmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  alignmentIcon: {
    fontSize: 20,
  },
  alignmentTitle: {
    fontSize: Typography.h3,
    fontWeight: Typography.weightBold as any,
  },
  alignmentMessage: {
    fontSize: Typography.body,
    lineHeight: Typography.body * Typography.lineHeightNormal,
    color: DarkTheme.textSecondary,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  explainerModal: {
    backgroundColor: DarkTheme.cardBackground,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingBottom: Spacing.xl,
  },
  explainerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  explainerTitle: {
    fontSize: Typography.h2,
    fontWeight: Typography.weightBold as any,
    color: DarkTheme.textPrimary,
  },
  explainerCloseBtn: {
    padding: Spacing.xs,
  },
  explainerContent: {
    padding: Spacing.lg,
  },
  explainerIntro: {
    fontSize: Typography.body,
    lineHeight: Typography.body * Typography.lineHeightNormal,
    color: DarkTheme.textSecondary,
    marginBottom: Spacing.lg,
  },
  explainerSourceCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: Spacing.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  explainerSourceHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  explainerSourceIcon: {
    fontSize: 28,
  },
  explainerSourceTitleRow: {
    flex: 1,
    gap: 6,
  },
  explainerSourceLabel: {
    fontSize: Typography.h3,
    fontWeight: Typography.weightBold as any,
    color: DarkTheme.textPrimary,
  },
  explainerSourceDesc: {
    fontSize: Typography.body,
    lineHeight: Typography.body * Typography.lineHeightNormal,
    color: DarkTheme.textSecondary,
  },
  explainerSourceNature: {
    marginTop: Spacing.sm,
  },
  explainerNatureText: {
    fontSize: Typography.caption,
    fontWeight: Typography.weightMedium as any,
  },
  explainerTip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    padding: Spacing.md,
    borderRadius: Spacing.md,
    marginTop: Spacing.md,
  },
  explainerTipIcon: {
    fontSize: 20,
  },
  explainerTipText: {
    flex: 1,
    fontSize: Typography.body,
    lineHeight: Typography.body * Typography.lineHeightNormal,
    color: DarkTheme.textPrimary,
  },
});
