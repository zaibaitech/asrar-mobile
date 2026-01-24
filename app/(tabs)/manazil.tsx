import { ConstellationMap } from '@/components/manazil/ConstellationMap';
import { ElementalSigil } from '@/components/manazil/ElementalSigil';
import { LunarPhaseIndicator } from '@/components/manazil/LunarPhaseIndicator';
import { MysticalCorrespondencesCard } from '@/components/manazil/MysticalCorrespondencesCard';
import { PlanetaryHoursCard } from '@/components/manazil/PlanetaryHoursCard';
import { SpiritualPracticesCard } from '@/components/manazil/SpiritualPracticesCard';
import { PremiumSection } from '@/components/subscription/PremiumSection';
import { TimingAnalysisSection } from '@/components/timing';
import { Borders, DarkTheme, ElementAccents, Spacing, Typography } from '@/constants/DarkTheme';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProfile } from '@/contexts/ProfileContext';
import {
  BADGE_CONFIG,
  getBadgeFromScore,
  type AsrariyaTimingResult,
  type UnifiedBadge,
} from '@/services/AsrariyaTimingEngine';
import { getLunarMansionByIndex, normalizeMansionIndex } from '@/data/lunarMansions';
import { getManazilGuidance, tr, type ManazilLanguage } from '@/data/manazilGuidance';
import { getManzilPracticePack } from '@/data/manazilPractices';
import { useManazilPracticeTracking } from '@/hooks/useManazilPracticeTracking';
import { calculateElementalHarmony } from '@/services/ElementalHarmonyService';
import { getCurrentLunarMansion } from '@/services/LunarMansionService';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Element = 'fire' | 'water' | 'air' | 'earth';
type ResonanceLevel = 'supportive' | 'harmonious' | 'neutral' | 'challenging' | 'transformative';

// ============================================
// MANAZIL SOURCE DIFFERENTIATION SYSTEM
// ============================================
type ManazilSourceType = 'CURRENT_MOON' | 'FROM_NAME';

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
      en: "Your personal lunar mansion calculated from your Arabic name using traditional Abjad numerology. This is your spiritual signature that never changes.",
      fr: "Votre demeure lunaire personnelle calculée à partir de votre nom en utilisant la numérologie Abjad traditionnelle.",
      ar: "منزلتك القمرية الشخصية محسوبة من اسمك العربي باستخدام حساب الأبجد التقليدي"
    },
    nature: 'static'
  }
};

// ============================================
// MANAZIL SOURCE BADGE COMPONENT
// ============================================
interface ManazilSourceBadgeProps {
  sourceType: ManazilSourceType;
  language: ManazilLanguage;
  isRealTime?: boolean;
  onPress?: () => void;
}

function ManazilSourceBadge({ sourceType, language, isRealTime = true, onPress }: ManazilSourceBadgeProps) {
  const source = MANAZIL_SOURCES[sourceType];
  
  const content = (
    <View style={[
      styles.sourceBadge,
      { backgroundColor: source.badgeColor }
    ]}>
      <Text style={styles.sourceBadgeIcon}>{source.icon}</Text>
      <Text style={[styles.sourceBadgeText, { color: source.badgeTextColor }]}>
        {source.shortLabel[language]}
      </Text>
      {source.nature === 'dynamic' && isRealTime && (
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
  language: ManazilLanguage;
}

function ManazilSourceExplainer({ visible, onClose, language }: ManazilSourceExplainerProps) {
  const titles = {
    en: "Understanding the Two Mansions",
    fr: "Comprendre les deux demeures",
    ar: "فهم المنزلتين"
  };
  
  const intros = {
    en: "This screen shows two different lunar mansions - each serving a unique purpose in your spiritual journey.",
    fr: "Cet écran affiche deux demeures lunaires différentes, chacune ayant un rôle unique dans votre cheminement spirituel.",
    ar: "تعرض هذه الشاشة منزلتين قمريتين مختلفتين - لكل منهما دور فريد في رحلتك الروحية."
  };

  const sourceEntries: ManazilSourceType[] = ['CURRENT_MOON', 'FROM_NAME'];
  
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
              
              return (
                <View key={sourceKey} style={styles.explainerSourceCard}>
                  <View style={styles.explainerSourceHeader}>
                    <Text style={styles.explainerSourceIcon}>{source.icon}</Text>
                    <View style={styles.explainerSourceTitleRow}>
                      <Text style={styles.explainerSourceLabel}>{source.label[language]}</Text>
                      <View style={[styles.explainerBadge, { backgroundColor: source.badgeColor }]}>
                        <Text style={[styles.explainerBadgeText, { color: source.badgeTextColor }]}>
                          {source.shortLabel[language]}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <Text style={styles.explainerSourceDesc}>{source.description[language]}</Text>
                  <View style={styles.explainerSourceNature}>
                    <Text style={[
                      styles.explainerNatureText,
                      { color: source.nature === 'dynamic' ? '#3b82f6' : '#8b5cf6' }
                    ]}>
                      {source.nature === 'dynamic' 
                        ? (language === 'ar' ? '● متغير - يتغير كل ~2.4 يوم' : language === 'fr' ? '● Dynamique - change tous les ~2.4 jours' : '● Changes every ~2.4 days')
                        : (language === 'ar' ? '● ثابت - لا يتغير أبداً' : language === 'fr' ? '● Statique - ne change jamais' : '● Never changes')
                      }
                    </Text>
                  </View>
                </View>
              );
            })}
            
            <View style={styles.explainerTip}>
              <Text style={styles.explainerTipIcon}>✨</Text>
              <Text style={styles.explainerTipText}>
                {language === 'ar' 
                  ? 'عندما يتواجد القمر في منزلتك الشخصية، يكون ذلك وقتًا قويًا بشكل خاص للتأمل والممارسة الروحية.'
                  : language === 'fr'
                  ? 'Quand la Lune se trouve dans votre demeure personnelle, c\'est un moment particulièrement puissant pour la méditation et la pratique spirituelle.'
                  : 'When the Moon is in your personal mansion, it\'s an especially powerful time for meditation and spiritual practice.'
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
// ALIGNMENT INSIGHT COMPONENT
// ============================================
interface AlignmentInsightProps {
  todayMansion: ReturnType<typeof getLunarMansionByIndex>;
  personalMansion: ReturnType<typeof getLunarMansionByIndex>;
  language: ManazilLanguage;
}

function AlignmentInsight({ todayMansion, personalMansion, language }: AlignmentInsightProps) {
  if (!todayMansion || !personalMansion) return null;
  
  const isAligned = todayMansion.index === personalMansion.index;
  const sameElement = todayMansion.element === personalMansion.element;
  
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
          en: "The Moon is in your personal mansion today! This is a rare and powerful time for inner work, meditation, and connecting with your deepest intentions.",
          fr: "La Lune est dans votre demeure personnelle aujourd'hui ! C'est un moment rare et puissant pour le travail intérieur.",
          ar: "القمر في منزلتك الشخصية اليوم! هذا وقت نادر وقوي للعمل الداخلي والتأمل."
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
          en: `Both mansions share the ${todayMansion.element} element. You'll feel naturally attuned to today's cosmic energies.`,
          fr: `Les deux demeures partagent l'élément ${todayMansion.element}. Vous vous sentirez naturellement en harmonie.`,
          ar: `كلا المنزلتين تشتركان في عنصر ${todayMansion.element}. ستشعر بالتناغم الطبيعي.`
        }
      };
    } else {
      return {
        icon: '🔄',
        color: '#3b82f6',
        title: {
          en: "Cosmic Dialogue",
          fr: "Dialogue cosmique",
          ar: "حوار كوني"
        },
        message: {
          en: `Today's ${todayMansion.element} Moon interacts with your ${personalMansion.element} nature. Notice how these energies blend in your experience.`,
          fr: `La Lune ${todayMansion.element} d'aujourd'hui interagit avec votre nature ${personalMansion.element}.`,
          ar: `قمر ${todayMansion.element} اليوم يتفاعل مع طبيعتك ${personalMansion.element}.`
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

const LABELS: Record<
  ManazilLanguage,
  {
    title: string;
    todayGate: string;
    youInGate: string;
    yourPersonalMansion: string;
    meaning: string;
    practice: string;
    innerWork: string;
    live: string;
    approx: string;
    yourGate: string;
    completeProfile: string;
    bestPractices: string;
    avoid: string;
    reflection: string;
    learnMore: string;
  }
> = {
  en: {
    title: 'Manāzil',
    todayGate: "Tonight's Moon",
    youInGate: 'Your Alignment',
    yourPersonalMansion: 'Your Personal Mansion',
    meaning: 'Meaning',
    practice: 'Practice',
    innerWork: 'Inner work',
    live: 'Live',
    approx: 'Approx',
    yourGate: 'Your gate',
    completeProfile: 'Complete your profile to discover your personal lunar mansion.',
    bestPractices: 'Best practices',
    avoid: 'Better to avoid',
    reflection: 'Reflection',
    learnMore: 'Learn more',
  },
  fr: {
    title: 'Manāzil',
    todayGate: 'La Lune ce soir',
    youInGate: 'Votre alignement',
    yourPersonalMansion: 'Votre demeure personnelle',
    meaning: 'Sens',
    practice: 'Pratique',
    innerWork: 'Travail intérieur',
    live: 'Live',
    approx: 'Approximatif',
    yourGate: 'Votre porte',
    completeProfile: 'Complétez votre profil pour découvrir votre demeure personnelle.',
    bestPractices: 'Bonnes pratiques',
    avoid: 'Mieux éviter',
    reflection: 'Réflexion',
    learnMore: 'En savoir plus',
  },
  ar: {
    title: 'المنازل',
    todayGate: 'قمر الليلة',
    youInGate: 'توافقك',
    yourPersonalMansion: 'منزلتك الشخصية',
    meaning: 'المعنى',
    practice: 'العمل',
    innerWork: 'العمل الباطن',
    live: 'مباشر',
    approx: 'تقريبي',
    yourGate: 'بابك',
    completeProfile: 'أكمل ملفك لاكتشاف منزلتك القمرية الشخصية.',
    bestPractices: 'أفضل الأعمال',
    avoid: 'يُستحسن تجنّبه',
    reflection: 'تأمل',
    learnMore: 'اعرف المزيد',
  },
};

function getElementIcon(element: Element) {
  const icons: Record<Element, string> = {
    fire: '🔥',
    water: '💧',
    air: '🌬️',
    earth: '🌱',
  };
  return icons[element];
}

function computeResonance(params: {
  todayIndex: number | null;
  todayElement: Element | null;
  personalIndex: number | null;
  personalElement: Element | null;
}): ResonanceLevel {
  const { todayIndex, todayElement, personalIndex, personalElement } = params;

  if (todayIndex === null || personalIndex === null || !todayElement || !personalElement) return 'neutral';
  if (todayIndex === personalIndex) return 'supportive';

  const forward = (todayIndex - personalIndex + 28) % 28;
  const backward = (personalIndex - todayIndex + 28) % 28;
  const distance = Math.min(forward, backward);

  if (distance === 14) return 'transformative';

  const harmony = calculateElementalHarmony(personalElement, todayElement);
  const elementScore =
    harmony.level === 'Harmonious' ? 0.35 :
    harmony.level === 'Supportive' ? 0.2 :
    harmony.level === 'Challenging' ? -0.2 :
    0;

  const distanceScore =
    distance <= 3 ? 0.2 :
    distance <= 7 ? 0.1 :
    distance <= 10 ? 0 :
    -0.1;

  const total = elementScore + distanceScore;

  if (total >= 0.35) return 'supportive';
  if (total >= 0.15) return 'harmonious';
  if (total > -0.15) return 'neutral';
  if (total > -0.35) return 'challenging';
  return 'transformative';
}

function ListLine({ text }: { text: string }) {
  return (
    <View style={styles.listItem}>
      <View style={styles.listDot} />
      <Text style={styles.listText}>{text}</Text>
    </View>
  );
}

export default function ManazilScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { language, t } = useLanguage();
  const { profile } = useProfile();

  const labels = LABELS[(language as ManazilLanguage) ?? 'en'] ?? LABELS.en;
  const lang = (language as ManazilLanguage) ?? 'en';

  const [todayIndex, setTodayIndex] = React.useState<number | null>(null);
  const [isRealTime, setIsRealTime] = React.useState(false);
  const [showSourceExplainer, setShowSourceExplainer] = React.useState(false);
  
  // Unified timing state - single source of truth for badges
  const [timingResult, setTimingResult] = React.useState<AsrariyaTimingResult | null>(null);
  
  // Get unified badge from timing analysis
  const unifiedBadge: UnifiedBadge = timingResult 
    ? getBadgeFromScore(timingResult.overallScore) 
    : 'MAINTAIN';
  const badgeConfig = BADGE_CONFIG[unifiedBadge];

  React.useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
        const result = await getCurrentLunarMansion(new Date(), timezone);
        if (cancelled) return;
        setTodayIndex(result.index);
        setIsRealTime(result.source === 'ephemeris');
      } catch {
        if (cancelled) return;
        setTodayIndex(null);
        setIsRealTime(false);
      }
    };

    void load();
    const id = setInterval(load, 60 * 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const todayMansion = typeof todayIndex === 'number' ? getLunarMansionByIndex(todayIndex) : null;

  const personalIndex = normalizeMansionIndex(
    profile?.derived?.manazilPersonal ?? profile?.derived?.manazilBaseline
  );
  const personalMansion = typeof personalIndex === 'number' ? getLunarMansionByIndex(personalIndex) : null;

  const resonance = computeResonance({
    todayIndex: todayMansion?.index ?? null,
    todayElement: (todayMansion?.element as Element) ?? null,
    personalIndex: personalMansion?.index ?? null,
    personalElement: (personalMansion?.element as Element) ?? null,
  });

  const statusTone = personalMansion
    ? (resonance === 'supportive' || resonance === 'harmonious'
        ? 'favorable'
        : resonance === 'neutral'
          ? 'balanced'
          : 'delicate')
    : 'balanced';

  const statusColor =
    statusTone === 'favorable' ? '#10b981' :
    statusTone === 'delicate' ? '#ef4444' :
    '#64B5F6';

  const statusLabel = personalMansion
    ? (statusTone === 'favorable'
        ? t('widgets.manazil.favorable')
        : statusTone === 'balanced'
          ? t('widgets.manazil.balanced')
          : t('widgets.manazil.delicate'))
    : t('widgets.manazil.completeProfile');

  const guidance = todayMansion
    ? getManazilGuidance({ mansionIndex: todayMansion.index, mansionElement: todayMansion.element })
    : null;

  const accent = todayMansion
    ? ElementAccents[(todayMansion.element as Element) ?? 'air'].primary
    : ElementAccents.air.primary;

  const practiceMansion = personalMansion ?? todayMansion;
  const practiceAccent = practiceMansion
    ? ElementAccents[(practiceMansion.element as Element) ?? 'air'].primary
    : accent;

  const practicePack = practiceMansion
    ? getManzilPracticePack(practiceMansion.index, (practiceMansion.element as Element) ?? 'air')
    : null;

  const tracking = useManazilPracticeTracking(practiceMansion?.index ?? 0);

  const now = new Date();
  const date = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={DarkTheme.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>{labels.title}</Text>
          <Text style={styles.headerSubtitle}>{date}</Text>
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
          {/* Status Badge */}
          <View style={[styles.statusBadge, { backgroundColor: `${statusColor}20`, borderColor: statusColor }]}>
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            <Text style={[styles.statusText, { color: statusColor }]}>{statusLabel}</Text>
          </View>

          {/* Today Gate - Current Moon Position */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>{labels.todayGate}</Text>
              <TouchableOpacity 
                style={styles.learnMoreBtn}
                onPress={() => setShowSourceExplainer(true)}
              >
                <Ionicons name="help-circle-outline" size={18} color={DarkTheme.accent} />
              </TouchableOpacity>
            </View>
            <View style={[styles.heroCard, { borderColor: `${accent}35` }]}> 
              {/* Source Badge */}
              <View style={styles.sourceRow}>
                <ManazilSourceBadge 
                  sourceType="CURRENT_MOON" 
                  language={lang}
                  isRealTime={isRealTime}
                  onPress={() => setShowSourceExplainer(true)}
                />
              </View>
              
              {/* background star map */}
              <View style={styles.heroBackdrop} pointerEvents="none">
                <ConstellationMap
                  seed={(todayMansion?.index ?? 0) + 1}
                  tint={`${accent}55`}
                  height={140}
                  mansionIndex={todayMansion?.index ?? null}
                />
              </View>

              <View style={styles.heroTopRow}>
                <View style={styles.heroLeftCluster}>
                  <ElementalSigil element={(todayMansion?.element as Element) ?? 'air'} accent={accent} />
                </View>

                <View style={styles.heroRightCluster}>
                  <LunarPhaseIndicator date={now} accent={accent} label={t('widgets.manazil.title')} />
                </View>
              </View>

              <View style={styles.heroHeaderRow}>
                <Ionicons name="moon-outline" size={22} color={accent} />
                <Text style={[styles.cardTitle, { color: accent }]}>{t('widgets.manazil.title')}</Text>
                <View style={styles.headerSpacer} />
              </View>

              {todayMansion ? (
                <>
                  {/* Decorative calligraphy */}
                  <Text style={[styles.calligraphy, { color: `${accent}66` }]}>{todayMansion.nameArabic}</Text>
                  <Text style={styles.heroName}>{todayMansion.nameTransliteration}</Text>
                  <Text style={styles.heroEnglishName}>
                    {lang === 'fr' ? todayMansion.nameFrench : todayMansion.nameEnglish}
                  </Text>
                  <Text style={styles.heroMeta}>
                    {getElementIcon(todayMansion.element)} {t(`elements.${todayMansion.element}`)} • #{todayMansion.index + 1}
                  </Text>

                  {guidance ? (
                    <View style={styles.heroDivider}>
                      <Text style={styles.heroLead}>
                        {tr(guidance.quality, language as ManazilLanguage)} • {tr(guidance.themeLabel, language as ManazilLanguage)}
                      </Text>
                    </View>
                  ) : null}

                  {practicePack?.constellationHint ? (
                    <Text style={styles.heroHint}>
                      {practicePack.constellationHint[(language as ManazilLanguage) ?? 'en'] ?? practicePack.constellationHint.en}
                    </Text>
                  ) : null}

                  {/* Advanced mode toggle */}
                  <Pressable
                    style={[styles.advancedToggle, { borderColor: `${accent}33` }]}
                    onPress={() => tracking.setAdvancedMode(!tracking.advancedMode)}
                    disabled={!tracking.hydrated}
                  >
                    <Ionicons name={tracking.advancedMode ? 'sparkles' : 'sparkles-outline'} size={16} color={accent} />
                    <Text style={styles.advancedToggleText}>
                      Advanced practices: {tracking.advancedMode ? 'ON' : 'OFF'}
                    </Text>
                  </Pressable>
                </>
              ) : (
                <Text style={styles.cardText}>{t('common.loading')}</Text>
              )}
            </View>
          </View>

          {/* Alignment Insight - shows when both mansions are available */}
          {todayMansion && personalMansion && (
            <AlignmentInsight
              todayMansion={todayMansion}
              personalMansion={personalMansion}
              language={lang}
            />
          )}

          {/* Your Personal Mansion - Enhanced */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{labels.yourPersonalMansion}</Text>
            {personalMansion ? (
              <View style={[styles.personalMansionCard, { borderColor: `${ElementAccents[(personalMansion.element as Element) ?? 'air'].primary}35` }]}>
                {/* Source Badge */}
                <View style={styles.sourceRow}>
                  <ManazilSourceBadge 
                    sourceType="FROM_NAME" 
                    language={lang}
                    onPress={() => setShowSourceExplainer(true)}
                  />
                </View>
                
                {/* Mansion Info */}
                <View style={styles.personalMansionContent}>
                  <View style={styles.personalMansionHeader}>
                    <View style={[styles.personalMansionIndex, { backgroundColor: `${ElementAccents[(personalMansion.element as Element) ?? 'air'].primary}20` }]}>
                      <Text style={[styles.personalMansionIndexText, { color: ElementAccents[(personalMansion.element as Element) ?? 'air'].primary }]}>
                        {personalMansion.index + 1}
                      </Text>
                    </View>
                    <View style={styles.personalMansionNames}>
                      <Text style={styles.personalMansionArabic}>{personalMansion.nameArabic}</Text>
                      <Text style={styles.personalMansionTranslit}>{personalMansion.nameTransliteration}</Text>
                      <Text style={styles.personalMansionEnglish}>
                        {lang === 'fr' ? personalMansion.nameFrench : personalMansion.nameEnglish}
                      </Text>
                    </View>
                    <View style={[styles.personalMansionElement, { backgroundColor: `${ElementAccents[(personalMansion.element as Element) ?? 'air'].primary}15` }]}>
                      <Text style={styles.personalMansionElementIcon}>{getElementIcon(personalMansion.element)}</Text>
                      <Text style={[styles.personalMansionElementText, { color: ElementAccents[(personalMansion.element as Element) ?? 'air'].primary }]}>
                        {t(`elements.${personalMansion.element}`)}
                      </Text>
                    </View>
                  </View>

                  {/* Personal Guidance */}
                  {(() => {
                    const personalGuidance = getManazilGuidance({ mansionIndex: personalMansion.index, mansionElement: personalMansion.element });
                    if (!personalGuidance) return null;
                    return (
                      <View style={styles.personalMansionGuidance}>
                        <View style={styles.personalMansionThemeRow}>
                          <View style={[styles.personalMansionThemeBadge, { backgroundColor: 'rgba(139, 92, 246, 0.15)' }]}>
                            <Text style={styles.personalMansionThemeText}>
                              ✦ {tr(personalGuidance.themeLabel, lang)}
                            </Text>
                          </View>
                          <Text style={styles.personalMansionQuality}>{tr(personalGuidance.quality, lang)}</Text>
                        </View>
                        <View style={styles.personalMansionEssence}>
                          <Text style={styles.personalMansionEssenceLabel}>
                            {lang === 'ar' ? 'جوهرك الروحي' : lang === 'fr' ? 'Votre essence spirituelle' : 'Your Spiritual Essence'}
                          </Text>
                          <Text style={styles.personalMansionEssenceText}>{tr(personalGuidance.essence, lang)}</Text>
                        </View>
                      </View>
                    );
                  })()}

                  {/* Static indicator */}
                  <View style={styles.personalMansionFooter}>
                    <Ionicons name="lock-closed" size={12} color={DarkTheme.textTertiary} />
                    <Text style={styles.personalMansionFooterText}>
                      {lang === 'ar' ? 'ثابت - محسوب من اسمك' : lang === 'fr' ? 'Statique - calculé à partir de votre nom' : 'Static - calculated from your name'}
                    </Text>
                  </View>
                </View>
              </View>
            ) : (
              <View style={styles.card}>
                <Text style={styles.cardText}>{labels.completeProfile}</Text>
              </View>
            )}
          </View>

          {/* Meaning */}
          {todayMansion && guidance && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{labels.meaning}</Text>
              <View style={styles.card}>
                <Text style={styles.cardText}>{tr(guidance.essence, language as ManazilLanguage)}</Text>
                <Text style={styles.cardText}>{tr(guidance.manifests, language as ManazilLanguage)}</Text>
                <View style={styles.subCard}>
                  <Text style={styles.subTitle}>{t('home.dailyGuidanceDetails.sections.bestFor')}</Text>
                  <Text style={styles.cardText}>{tr(guidance.easier, language as ManazilLanguage)}</Text>
                </View>
                <View style={styles.subCard}>
                  <Text style={styles.subTitle}>{t('home.dailyGuidanceDetails.sections.avoid')}</Text>
                  <Text style={styles.cardText}>{tr(guidance.sensitive, language as ManazilLanguage)}</Text>
                </View>
              </View>
            </View>
          )}

          {/* Premium Practice + Planetary Hours + Correspondences */}
          {practiceMansion && practicePack ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{labels.practice}</Text>
              {personalMansion ? (
                <Text style={styles.metaText}>
                  Personalized for: {practiceMansion.nameTransliteration} ({practiceMansion.nameArabic})
                </Text>
              ) : null}
              <PremiumSection
                featureId="manazilPractices"
                title={t('premiumSections.spiritualPractices.title')}
                description={t('premiumSections.spiritualPractices.description')}
                icon="🌙"
              >
                <SpiritualPracticesCard
                  accent={practiceAccent}
                  pack={practicePack}
                  advancedMode={tracking.advancedMode}
                  tracking={tracking}
                  language={(language as ManazilLanguage) ?? 'en'}
                />

                <PlanetaryHoursCard
                  accent={practiceAccent}
                  pack={practicePack}
                  location={
                    typeof profile?.location?.latitude === 'number' && typeof profile?.location?.longitude === 'number'
                      ? { latitude: profile.location.latitude, longitude: profile.location.longitude }
                      : undefined
                  }
                  language={(language as ManazilLanguage) ?? 'en'}
                />

                <MysticalCorrespondencesCard accent={practiceAccent} pack={practicePack} language={(language as ManazilLanguage) ?? 'en'} />
              </PremiumSection>
            </View>
          ) : null}

          {/* Asrariya Timing Analysis - Lunar Mansion Specific */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>{t('asrariya.timingAnalysis') || 'Timing Analysis For You'}</Text>
            </View>
            <TimingAnalysisSection
              context="manazil"
              practiceCategory="spiritual"
              location={
                typeof profile?.location?.latitude === 'number' && typeof profile?.location?.longitude === 'number'
                  ? { latitude: profile.location.latitude, longitude: profile.location.longitude }
                  : undefined
              }
            />
          </View>

          {/* Inner work */}
          {todayMansion && guidance && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{labels.innerWork}</Text>
              <View style={styles.card}>
                <Text style={styles.cardTitleText}>{labels.reflection}</Text>
                {guidance.reflection.ayahRef && (
                  <Text style={styles.metaText}>{guidance.reflection.ayahRef}</Text>
                )}
                <Text style={styles.cardText}>{tr(guidance.reflection.hikmah, language as ManazilLanguage)}</Text>
                <Text style={styles.cardText}>{tr(guidance.reflection.intention, language as ManazilLanguage)}</Text>
                {guidance.reflection.silentPractice && (
                  <View style={styles.subCard}>
                    <Text style={styles.subTitle}>{t('home.dailyGuidanceDetails.sections.peakHours')}</Text>
                    <Text style={styles.cardText}>{tr(guidance.reflection.silentPractice, language as ManazilLanguage)}</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          <View style={{ height: 24 }} />
        </ScrollView>
      </LinearGradient>
      
      {/* Source Explainer Modal */}
      <ManazilSourceExplainer
        visible={showSourceExplainer}
        onClose={() => setShowSourceExplainer(false)}
        language={lang}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DarkTheme.screenBackground,
  },
  gradientContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: DarkTheme.borderSubtle,
    backgroundColor: DarkTheme.screenBackground,
  },
  backButton: {
    padding: Spacing.sm,
    marginLeft: -Spacing.sm,
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Typography.h3,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
  },
  headerSubtitle: {
    fontSize: Typography.caption,
    color: DarkTheme.textSecondary,
    marginTop: 2,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.h3,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
    marginBottom: Spacing.md,
    letterSpacing: 0.3,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Borders.radiusCircle,
    borderWidth: 1,
    alignSelf: 'flex-start',
    marginBottom: Spacing.xl,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Spacing.sm,
  },
  statusText: {
    fontSize: Typography.label,
    fontWeight: Typography.weightSemibold,
  },
  card: {
    backgroundColor: DarkTheme.cardBackground,
    borderRadius: Borders.radiusLg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: DarkTheme.borderSubtle,
  },
  heroCard: {
    backgroundColor: DarkTheme.cardBackground,
    borderRadius: Borders.radiusLg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: DarkTheme.borderSubtle,
    overflow: 'hidden',
  },
  heroBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 160,
    opacity: 0.55,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  heroLeftCluster: {
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  heroRightCluster: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  heroHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  calligraphy: {
    fontSize: 44,
    fontWeight: Typography.weightBold,
    textAlign: 'right',
    marginTop: -6,
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  heroHint: {
    fontSize: Typography.caption,
    color: DarkTheme.textSecondary,
    marginTop: Spacing.sm,
    opacity: 0.9,
  },
  advancedToggle: {
    marginTop: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: Borders.radiusCircle,
    borderWidth: 1,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  advancedToggleText: {
    fontSize: Typography.caption,
    color: DarkTheme.textPrimary,
    opacity: 0.9,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  cardTitle: {
    fontSize: Typography.label,
    fontWeight: Typography.weightSemibold,
  },
  headerSpacer: {
    flex: 1,
  },
  sourcePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  sourcePillText: {
    fontSize: Typography.caption,
    fontWeight: Typography.weightSemibold,
  },
  heroName: {
    fontSize: Typography.h2,
    fontWeight: Typography.weightBold,
    color: DarkTheme.textPrimary,
    marginBottom: 2,
  },
  heroEnglishName: {
    fontSize: Typography.body,
    fontWeight: Typography.weightMedium,
    color: DarkTheme.textSecondary,
    fontStyle: 'italic',
    marginBottom: 6,
  },
  heroMeta: {
    fontSize: Typography.label,
    color: DarkTheme.textSecondary,
    marginBottom: Spacing.md,
  },
  heroDivider: {
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: DarkTheme.borderSubtle,
  },
  heroLead: {
    fontSize: Typography.label,
    color: DarkTheme.textPrimary,
    opacity: 0.9,
  },
  cardText: {
    fontSize: Typography.label,
    color: DarkTheme.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  cardTitleText: {
    fontSize: Typography.h3,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
    marginBottom: Spacing.sm,
  },
  metaText: {
    fontSize: Typography.caption,
    color: DarkTheme.textSecondary,
    marginBottom: Spacing.sm,
    opacity: 0.8,
  },
  subCard: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: DarkTheme.borderSubtle,
  },
  subTitle: {
    fontSize: Typography.label,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
    marginBottom: 6,
  },
  listCard: {
    backgroundColor: DarkTheme.cardBackground,
    borderRadius: Borders.radiusLg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: DarkTheme.borderSubtle,
    marginBottom: Spacing.md,
  },
  listCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  listCardTitle: {
    fontSize: Typography.h3,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  listDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: ElementAccents.air.primary,
    marginTop: 7,
    marginRight: Spacing.sm,
  },
  listText: {
    flex: 1,
    fontSize: Typography.label,
    color: DarkTheme.textSecondary,
    lineHeight: 20,
  },

  // ===========================================
  // SOURCE DIFFERENTIATION STYLES
  // ===========================================
  
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  learnMoreBtn: {
    padding: Spacing.xs,
  },
  sourceRow: {
    marginBottom: Spacing.sm,
  },
  sourceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  sourceBadgeIcon: {
    fontSize: 12,
  },
  sourceBadgeText: {
    fontSize: 11,
    fontWeight: '700' as any,
    letterSpacing: 0.5,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10b981',
  },

  // Personal Mansion Card
  personalMansionCard: {
    backgroundColor: DarkTheme.cardBackground,
    borderRadius: Borders.radiusLg,
    padding: Spacing.lg,
    borderWidth: 1,
  },
  personalMansionContent: {
    gap: Spacing.md,
  },
  personalMansionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  personalMansionIndex: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  personalMansionIndexText: {
    fontSize: 20,
    fontWeight: Typography.weightBold as any,
  },
  personalMansionNames: {
    flex: 1,
    gap: 2,
  },
  personalMansionArabic: {
    fontSize: Typography.h2,
    fontWeight: Typography.weightBold as any,
    color: DarkTheme.textPrimary,
  },
  personalMansionTranslit: {
    fontSize: Typography.body,
    color: DarkTheme.textSecondary,
    fontStyle: 'italic',
  },
  personalMansionEnglish: {
    fontSize: Typography.caption,
    color: DarkTheme.textTertiary,
  },
  personalMansionElement: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: Spacing.md,
    alignItems: 'center',
    gap: 2,
  },
  personalMansionElementIcon: {
    fontSize: 18,
  },
  personalMansionElementText: {
    fontSize: Typography.caption,
    fontWeight: Typography.weightMedium as any,
  },
  personalMansionGuidance: {
    gap: Spacing.sm,
  },
  personalMansionThemeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  personalMansionThemeBadge: {
    paddingVertical: 4,
    paddingHorizontal: Spacing.sm,
    borderRadius: 12,
  },
  personalMansionThemeText: {
    fontSize: Typography.caption,
    color: '#a78bfa',
    fontWeight: Typography.weightMedium as any,
  },
  personalMansionQuality: {
    fontSize: Typography.caption,
    color: DarkTheme.textTertiary,
    flex: 1,
  },
  personalMansionEssence: {
    backgroundColor: 'rgba(139, 92, 246, 0.08)',
    padding: Spacing.md,
    borderRadius: Spacing.md,
  },
  personalMansionEssenceLabel: {
    fontSize: Typography.caption,
    color: '#a78bfa',
    fontWeight: Typography.weightMedium as any,
    marginBottom: 4,
  },
  personalMansionEssenceText: {
    fontSize: Typography.label,
    lineHeight: 20,
    color: DarkTheme.textPrimary,
  },
  personalMansionFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: DarkTheme.borderSubtle,
  },
  personalMansionFooterText: {
    fontSize: Typography.caption,
    color: DarkTheme.textTertiary,
  },

  // Alignment Insight Card
  alignmentCard: {
    padding: Spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: Borders.radiusLg,
    borderWidth: 1,
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
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
    fontSize: Typography.label,
    lineHeight: 20,
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
    borderBottomColor: DarkTheme.borderSubtle,
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
    fontSize: Typography.label,
    lineHeight: 20,
    color: DarkTheme.textSecondary,
    marginBottom: Spacing.lg,
  },
  explainerSourceCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: Borders.radiusLg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: DarkTheme.borderSubtle,
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
  explainerBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  explainerBadgeText: {
    fontSize: 9,
    fontWeight: '700' as any,
    letterSpacing: 0.5,
  },
  explainerSourceDesc: {
    fontSize: Typography.label,
    lineHeight: 20,
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
    fontSize: Typography.label,
    lineHeight: 20,
    color: DarkTheme.textPrimary,
  },
});
