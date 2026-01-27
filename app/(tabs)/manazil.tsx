import { ConstellationMap } from '@/components/manazil/ConstellationMap';
import { ElementalSigil } from '@/components/manazil/ElementalSigil';
import { LunarPhaseIndicator } from '@/components/manazil/LunarPhaseIndicator';
import { MysticalCorrespondencesCard } from '@/components/manazil/MysticalCorrespondencesCard';
import { PlanetaryHoursCard } from '@/components/manazil/PlanetaryHoursCard';
import { SpiritualPracticesCard } from '@/components/manazil/SpiritualPracticesCard';
import { PremiumSection } from '@/components/subscription/PremiumSection';
import { Borders, DarkTheme, ElementAccents, Spacing, Typography } from '@/constants/DarkTheme';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProfile } from '@/contexts/ProfileContext';
import { getCosmicLunarMansionForDate, getLunarMansionByIndex, normalizeMansionIndex } from '@/data/lunarMansions';
import { getManazilGuidance, tr, type ManazilLanguage } from '@/data/manazilGuidance';
import { getManzilPracticePack } from '@/data/manazilPractices';
import { useDailyPlanetaryAnalysis } from '@/hooks/useDailyPlanetaryAnalysis';
import { useManazilPracticeTracking } from '@/hooks/useManazilPracticeTracking';
import { analyzeTimingForPractice, buildCurrentMoment, profileToSpiritualProfile, quickTimingCheck } from '@/services/AsrariyaTimingEngine';
import { getCurrentLunarMansion } from '@/services/LunarMansionService';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Element = 'fire' | 'water' | 'air' | 'earth';

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
      en: 'Current Moon Position',
      fr: 'Position lunaire actuelle',
      ar: 'موقع القمر الحالي',
    },
    shortLabel: {
      en: 'LIVE',
      fr: 'EN DIRECT',
      ar: 'مباشر',
    },
    description: {
      en: 'The lunar mansion where the Moon is right now. Changes every ~2.4 days as the Moon travels through the 28 mansions.',
      fr: 'La demeure lunaire où se trouve la Lune en ce moment. Change environ tous les 2,4 jours.',
      ar: 'المنزلة القمرية التي يتواجد فيها القمر الآن. تتغير كل ~2.4 يوم',
    },
    nature: 'dynamic',
  },
  FROM_NAME: {
    id: 'FROM_NAME',
    icon: '🔤',
    badgeColor: '#8b5cf6',
    badgeTextColor: '#ffffff',
    label: {
      en: 'From Your Name',
      fr: 'De votre nom',
      ar: 'من اسمك',
    },
    shortLabel: {
      en: 'STATIC',
      fr: 'STATIQUE',
      ar: 'ثابت',
    },
    description: {
      en: 'Your personal lunar mansion, calculated from your name. This never changes unless your name changes.',
      fr: 'Votre demeure lunaire personnelle, calculée à partir de votre nom. Ne change jamais sauf si votre nom change.',
      ar: 'منزلتك القمرية الشخصية محسوبة من اسمك. لا تتغير أبداً إلا إذا تغير اسمك.',
    },
    nature: 'static',
  },
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
// PERSONAL MESSAGE CARD
// ============================================
interface PersonalMessageCardProps {
  todayMansion: ReturnType<typeof getLunarMansionByIndex>;
  personalMansion: ReturnType<typeof getLunarMansionByIndex>;
  t: (key: string, params?: Record<string, any>) => string;
}

function PersonalMessageCard({ todayMansion, personalMansion, t }: PersonalMessageCardProps) {
  if (!todayMansion || !personalMansion) return null;

  const status = getMansionElementalStatus(
    personalMansion.element as Element,
    todayMansion.element as Element,
    t
  );

  const title = t('manazilScreen.personalMessage.title');

  const moonElement = t(`common.elements.${todayMansion.element}`);
  const personalElement = t(`common.elements.${personalMansion.element}`);
  const subtitle = t('manazilScreen.personalMessage.forYourNature', { element: personalElement });
  const message =
    status.status === 'harmonious'
      ? t('manazilScreen.personalMessage.messageHarmonious', { moonElement, personalElement })
      : status.status === 'tension'
        ? t('manazilScreen.personalMessage.messageTension', { moonElement, personalElement })
        : t('manazilScreen.personalMessage.messageBalanced', { moonElement, personalElement });

  return (
    <View style={[styles.personalMessageCard, { borderColor: `${status.color}40` }]}>
      <View style={styles.personalMessageHeader}>
        <Text style={styles.personalMessageTitle}>💬 {title}</Text>
      </View>
      <Text style={styles.personalMessageSubtitle}>{subtitle}</Text>
      <Text style={styles.personalMessageText}>{message}</Text>
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
    todayGate: 'Current Moon Position',
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
    todayGate: 'Position lunaire actuelle',
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
    todayGate: 'موقع القمر الحالي',
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

function getMansionElementalStatus(
  personalElement: Element,
  currentElement: Element,
  t: (key: string, params?: Record<string, any>) => string
): {
  status: 'harmonious' | 'balanced' | 'tension';
  color: string;
  icon: string;
  label: string;
  description: string;
} {
  if (personalElement === currentElement) {
    return {
      status: 'harmonious',
      color: '#4CAF50',
      icon: '✅',
      label: t('manazilScreen.elementalStatus.harmonious'),
      description: t('manazilScreen.elementalStatus.bothAre', { element: t(`common.elements.${personalElement}`) }),
    };
  }

  const oppositions: Record<Element, Element> = {
    fire: 'water',
    water: 'fire',
    air: 'earth',
    earth: 'air',
  };

  if (oppositions[personalElement] === currentElement) {
    return {
      status: 'tension',
      color: '#FF9800',
      icon: '⚠️',
      label: t('manazilScreen.elementalStatus.tension'),
      description: t('manazilScreen.elementalStatus.proceedMindfully', {
        element1: t(`common.elements.${personalElement}`),
        element2: t(`common.elements.${currentElement}`),
      }),
    };
  }

  return {
    status: 'balanced',
    color: '#2196F3',
    icon: '〰️',
    label: t('manazilScreen.elementalStatus.balanced'),
    description: t('manazilScreen.elementalStatus.neutralEnergy', {
      element1: t(`common.elements.${personalElement}`),
      element2: t(`common.elements.${currentElement}`),
    }),
  };
}

function getNavigationGuidance(
  status: 'harmonious' | 'balanced' | 'tension',
  t: (key: string, params?: Record<string, any>) => string
): string[] {
  const base = status === 'tension' ? 'tension' : status === 'harmonious' ? 'harmonious' : 'balanced';
  return [
    t(`manazilScreen.relationship.tips.${base}1`),
    t(`manazilScreen.relationship.tips.${base}2`),
    t(`manazilScreen.relationship.tips.${base}3`),
  ];
}

function findNextMatchingElementMoonDate(targetElement: Element, daysAhead: number = 60): Date | null {
  const start = new Date();
  start.setHours(12, 0, 0, 0);

  for (let i = 1; i <= daysAhead; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const m = getCosmicLunarMansionForDate(d);
    if ((m.element as Element) === targetElement) return d;
  }
  return null;
}

function getRelativeTimeText(
  futureDate: Date,
  currentDate: Date,
  t: (key: string, params?: Record<string, any>) => string
): string {
  const current = new Date(currentDate);
  current.setHours(12, 0, 0, 0);
  const future = new Date(futureDate);
  future.setHours(12, 0, 0, 0);

  const diffMs = future.getTime() - current.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return t('manazilScreen.relationship.today');
  if (diffDays === 1) return t('manazilScreen.relationship.tomorrow');
  if (diffDays < 7) return t('manazilScreen.relationship.inDays', { count: diffDays });
  if (diffDays < 14) return t('manazilScreen.relationship.nextWeek');
  if (diffDays < 30) return t('manazilScreen.relationship.inWeeks', { count: Math.floor(diffDays / 7) });
  return t('manazilScreen.relationship.inMonths', { count: Math.floor(diffDays / 30) });
}

function getScoreColor(score: number | null): string {
  if (typeof score !== 'number' || Number.isNaN(score)) return DarkTheme.textTertiary;
  if (score >= 70) return '#10b981';
  if (score >= 40) return '#f59e0b';
  return '#ef4444';
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
  const { scrollToTop } = useLocalSearchParams<{ scrollToTop?: string }>();

  const scrollViewRef = React.useRef<ScrollView>(null);
  const lastScrollTokenRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (!scrollToTop) return;
    if (lastScrollTokenRef.current === scrollToTop) return;

    lastScrollTokenRef.current = scrollToTop;

    // Ensure we scroll after the ScrollView is mounted/layouted.
    requestAnimationFrame(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    });

    // Clear param so back-navigation doesn't keep re-triggering.
    router.setParams({ scrollToTop: undefined });
  }, [router, scrollToTop]);

  // Current moment (updates every second so the timestamp matches "now")
  const [now, setNow] = React.useState(() => new Date());
  React.useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Moon strength single source of truth (rounded once)
  const { analysis: dailyPlanetAnalysis } = useDailyPlanetaryAnalysis();
  const moonStrength = React.useMemo(() => {
    const raw = dailyPlanetAnalysis?.planets?.Moon?.finalPower;
    return typeof raw === 'number' && !Number.isNaN(raw) ? Math.round(raw) : null;
  }, [dailyPlanetAnalysis]);

  const labels = LABELS[(language as ManazilLanguage) ?? 'en'] ?? LABELS.en;
  const lang = (language as ManazilLanguage) ?? 'en';

  const [todayIndex, setTodayIndex] = React.useState<number | null>(null);
  const [isRealTime, setIsRealTime] = React.useState(false);
  const [showSourceExplainer, setShowSourceExplainer] = React.useState(false);

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
    // Refresh periodically; the Moon's mansion changes slowly, but this keeps
    // the "current moment" display aligned without being too chatty.
    const id = setInterval(load, 5 * 60 * 1000);
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

  const elementalStatus = React.useMemo(() => {
    if (!todayMansion || !personalMansion) return null;
    return getMansionElementalStatus(
      personalMansion.element as Element,
      todayMansion.element as Element,
      t
    );
  }, [todayMansion?.element, personalMansion?.element, t]);

  const nextMatchingMoonDate = React.useMemo(() => {
    if (!personalMansion) return null;
    return findNextMatchingElementMoonDate(personalMansion.element as Element);
  }, [personalMansion?.element]);

  const [dailyEnergyScore, setDailyEnergyScore] = React.useState<number | null>(null);
  const [momentAlignmentScore, setMomentAlignmentScore] = React.useState<number | null>(null);

  React.useEffect(() => {
    let cancelled = false;

    const loadScores = async () => {
      if (!profile) {
        if (!cancelled) {
          setDailyEnergyScore(null);
          setMomentAlignmentScore(null);
        }
        return;
      }

      const lat = profile.location?.latitude;
      const lon = profile.location?.longitude;
      const location =
        typeof lat === 'number' && typeof lon === 'number'
          ? { latitude: lat, longitude: lon }
          : undefined;

      try {
        const lang = ((language as ManazilLanguage) ?? 'en') as 'en' | 'fr' | 'ar';

        // Moment Alignment score (same as Home strip)
        const quick = await quickTimingCheck(profile, 'general', location, lang);
        if (!cancelled) setMomentAlignmentScore(quick.score);

        // Daily Energy score (day-level: treat planetary hour as day ruler)
        const spiritual = profileToSpiritualProfile(profile);
        const built = await buildCurrentMoment(location);
        const dailyMoment = {
          ...built,
          planetaryHourPlanet: built.dayRuler,
          planetaryHourElement: built.dayElement,
          planetaryHourRemainingSeconds: 0,
        };
        const daily = await analyzeTimingForPractice(spiritual, { category: 'general' }, { location, moment: dailyMoment, language: lang });
        if (!cancelled) setDailyEnergyScore(daily.overallScore);
      } catch {
        if (!cancelled) {
          setDailyEnergyScore(null);
          setMomentAlignmentScore(null);
        }
      }
    };

    void loadScores();
    const id = setInterval(loadScores, 5 * 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [profile, language]);

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

  const dateText = now.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
  const timeText = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateTimeText = `${dateText} • ${timeText}`;

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={DarkTheme.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>{labels.title}</Text>
          <Text style={styles.headerSubtitle}>{dateTimeText}</Text>
          <Text style={styles.headerLiveIndicator}>{t('manazilScreen.liveIndicator')}</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <LinearGradient
        colors={[`${accent}15`, `${accent}05`, DarkTheme.screenBackground]}
        style={styles.gradientContainer}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Elemental Status Badge (replaces confusing "Delicate") */}
          {elementalStatus ? (
            <View style={styles.elementalStatusWrap}>
              <View style={[styles.elementalStatusBadge, { borderColor: elementalStatus.color }]}>
                <Text style={styles.elementalStatusIcon}>{elementalStatus.icon}</Text>
                <Text style={[styles.elementalStatusLabel, { color: elementalStatus.color }]}>
                  {elementalStatus.label}
                </Text>
              </View>
              <Text style={styles.elementalStatusDescription}>{elementalStatus.description}</Text>
            </View>
          ) : null}

          {/* Today Gate - Current Moon Position */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>🌙 {labels.todayGate}</Text>
              <TouchableOpacity 
                style={styles.learnMoreBtn}
                onPress={() => setShowSourceExplainer(true)}
              >
                <Ionicons name="help-circle-outline" size={18} color={accent} />
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
                <Text style={styles.heroLiveText}>{t('manazilScreen.liveIndicator')}</Text>
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
                <Text style={[styles.cardTitle, { color: accent }]}>{t('manazilScreen.currentMoonPosition')}</Text>
                <View style={styles.headerSpacer} />
              </View>

              {todayMansion ? (
                <>
                  {/* Moon Strength */}
                  {typeof moonStrength === 'number' ? (
                    <View style={styles.moonStrengthBlock}>
                      <View style={styles.moonStrengthHeaderRow}>
                        <Text style={styles.moonStrengthLabel}>{t('manazilScreen.moonStrength')}</Text>
                        <Text style={[styles.moonStrengthValue, { color: accent }]}>{moonStrength}%</Text>
                      </View>
                      <View style={styles.moonStrengthTrack}>
                        <View style={[styles.moonStrengthFill, { width: `${moonStrength}%`, backgroundColor: accent }]} />
                      </View>
                    </View>
                  ) : null}

                  {/* Decorative calligraphy */}
                  <Text style={[styles.calligraphy, { color: `${accent}66` }]}>{todayMansion.nameArabic}</Text>
                  <Text style={styles.heroName}>{todayMansion.nameTransliteration}</Text>
                  <Text style={styles.heroEnglishName}>
                    {lang === 'fr' ? todayMansion.nameFrench : todayMansion.nameEnglish}
                  </Text>
                  <Text style={styles.heroMeta}>
                    {getElementIcon(todayMansion.element)} {t(`common.elements.${todayMansion.element}`)} • {t('manazilScreen.mansion')} #{todayMansion.index + 1}
                  </Text>

                  {/* Meta: quality + cadence */}
                  <View style={styles.mansionMetaRow}>
                    {guidance ? (
                      <View style={styles.metaItemRow}>
                        <Ionicons name="sparkles" size={16} color="#FFD700" />
                        <Text style={styles.metaItemText}>
                          {t('manazilScreen.quality')}: {tr(guidance.quality, language as ManazilLanguage)}
                        </Text>
                      </View>
                    ) : null}
                    <View style={styles.metaItemRow}>
                      <Ionicons name="time" size={16} color="#4FACFE" />
                      <Text style={styles.metaItemText}>{t('manazilScreen.changesEvery')}</Text>
                    </View>
                  </View>

                  {/* Mansion Wisdom (renamed from Cosmic Dialogue) */}
                  {guidance ? (
                    <View style={styles.cosmicDialogueBlock}>
                      <Text style={styles.cosmicDialogueTitle}>{t('manazilScreen.mansionWisdomTitle')}</Text>
                      <Text style={styles.cosmicDialogueText}>
                        {tr(guidance.essence, language as ManazilLanguage)}
                      </Text>
                    </View>
                  ) : null}

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
                      {t('widgets.manazil.advancedPractices')}: {tracking.advancedMode ? t('common.on') : t('common.off')}
                    </Text>
                  </Pressable>
                </>
              ) : (
                <Text style={styles.cardText}>{t('common.loading')}</Text>
              )}
            </View>
          </View>

          {/* Your Personal Mansion - Enhanced */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📝 {labels.yourPersonalMansion}</Text>
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
                        #{personalMansion.index + 1}
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
                        {t(`common.elements.${personalMansion.element}`)}
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
                      {t('manazilScreen.fromYourName', { name: profile?.nameAr || t('common.you') })} • {t('manazilScreen.staticNeverChanges')}
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

          {/* Mansion Relationship (between Personal Mansion and Meaning) */}
          {todayMansion && personalMansion && elementalStatus ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🔗 {t('manazilScreen.relationship.title')}</Text>
              <Text style={styles.sectionSubtitle}>{t('manazilScreen.relationship.subtitle')}</Text>
              <View style={styles.relationshipCard}>
                <View style={styles.elementComparison}>
                  <View style={styles.elementBox}>
                    <Text style={styles.elementLabel}>{t('manazilScreen.relationship.yourEssence')}</Text>
                    <View style={styles.elementBadge}>
                      <Text style={styles.elementIcon}>{getElementIcon(personalMansion.element as Element)}</Text>
                      <Text style={styles.elementName}>{t(`common.elements.${personalMansion.element}`)}</Text>
                    </View>
                    <Text style={styles.mansionNameSmall}>{personalMansion.nameTransliteration}</Text>
                  </View>

                  <Ionicons name="arrow-forward" size={22} color="#4FACFE" />

                  <View style={styles.elementBox}>
                    <Text style={styles.elementLabel}>{t('manazilScreen.relationship.currentMoon')}</Text>
                    <View style={styles.elementBadge}>
                      <Text style={styles.elementIcon}>{getElementIcon(todayMansion.element as Element)}</Text>
                      <Text style={styles.elementName}>{t(`common.elements.${todayMansion.element}`)}</Text>
                    </View>
                    <Text style={styles.mansionNameSmall}>{todayMansion.nameTransliteration}</Text>
                  </View>
                </View>

                <View style={styles.relationshipAnalysis}>
                  <View style={[styles.statusIndicator, { backgroundColor: elementalStatus.color }]}
                  >
                    <Text style={styles.statusIndicatorIcon}>{elementalStatus.icon}</Text>
                    <Text style={styles.statusIndicatorText}>{elementalStatus.label}</Text>
                  </View>
                  <Text style={styles.relationshipExplanation}>
                    {elementalStatus.description}
                  </Text>
                </View>

                {elementalStatus.status !== 'harmonious' ? (
                  <View style={styles.navigationGuide}>
                    <Text style={styles.guideTitle}>💡 {t('manazilScreen.relationship.howToNavigate')}</Text>
                    {getNavigationGuidance(elementalStatus.status, t).map((tip, index) => (
                      <View key={index} style={styles.tipRow}>
                        <Text style={styles.tipBullet}>•</Text>
                        <Text style={styles.tipText}>{tip}</Text>
                      </View>
                    ))}
                  </View>
                ) : null}

                <View style={styles.bestCompatibility}>
                  <Text style={styles.compatibilityTitle}>🌟 {t('manazilScreen.relationship.bestCompatibility')}</Text>
                  <Text style={styles.compatibilityText}>
                    {t('manazilScreen.relationship.whenMoonIn', { element: t(`common.elements.${personalMansion.element}`) })}
                  </Text>
                  {nextMatchingMoonDate ? (
                    <View style={styles.nextMoonRow}>
                      <Ionicons name="calendar" size={16} color="#4FACFE" />
                      <Text style={styles.nextMoonText}>
                        {t('manazilScreen.relationship.nextMoon', {
                          element: t(`common.elements.${personalMansion.element}`),
                          relativeTime: getRelativeTimeText(nextMatchingMoonDate, now, t),
                          date: nextMatchingMoonDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
                        })}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>
            </View>
          ) : null}

          {/* Personal Message (separate from Mansion Wisdom) */}
          {todayMansion && personalMansion ? (
            <View style={styles.section}>
              <PersonalMessageCard
                todayMansion={todayMansion}
                personalMansion={personalMansion}
                t={t}
              />
            </View>
          ) : null}

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
                  {t('widgets.manazil.personalizedFor')}: {practiceMansion.nameTransliteration} ({practiceMansion.nameArabic})
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

          {/* Need Timing Guidance? (use the dedicated timing screens) */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('manazilScreen.needTimingGuidanceTitle')}</Text>
            <Text style={styles.metaText}>{t('manazilScreen.needTimingGuidanceSubtitle')}</Text>

            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.timingLinkCard}
              onPress={() => router.push('/(tabs)/daily-guidance-details')}
            >
              <View style={styles.timingLinkRow}>
                <View style={styles.timingLinkLeft}>
                  <Ionicons name="calendar" size={28} color="#4FACFE" />
                  <View style={styles.timingLinkTextCol}>
                    <Text style={styles.timingLinkTitle}>{t('manazilScreen.dailyEnergyLinkTitle')}</Text>
                    <Text style={styles.timingLinkSubtitle}>{t('manazilScreen.dailyEnergyLinkSubtitle')}</Text>
                  </View>
                </View>
                <View style={styles.timingLinkRight}>
                  <View style={[styles.scoreCircle, { borderColor: getScoreColor(dailyEnergyScore) }]}>
                    <Text style={[styles.scoreValue, { color: getScoreColor(dailyEnergyScore) }]}>
                      {typeof dailyEnergyScore === 'number' ? `${dailyEnergyScore}%` : '--'}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={DarkTheme.textSecondary} />
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.timingLinkCard}
              onPress={() => router.push('/(tabs)/moment-alignment-detail')}
            >
              <View style={styles.timingLinkRow}>
                <View style={styles.timingLinkLeft}>
                  <Ionicons name="flash" size={28} color="#9C27B0" />
                  <View style={styles.timingLinkTextCol}>
                    <Text style={styles.timingLinkTitle}>{t('manazilScreen.momentAlignmentLinkTitle')}</Text>
                    <Text style={styles.timingLinkSubtitle}>{t('manazilScreen.momentAlignmentLinkSubtitle')}</Text>
                  </View>
                </View>
                <View style={styles.timingLinkRight}>
                  <View style={[styles.scoreCircle, { borderColor: getScoreColor(momentAlignmentScore) }]}>
                    <Text style={[styles.scoreValue, { color: getScoreColor(momentAlignmentScore) }]}>
                      {typeof momentAlignmentScore === 'number' ? `${momentAlignmentScore}%` : '--'}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={DarkTheme.textSecondary} />
                </View>
              </View>
            </TouchableOpacity>

            <Text style={styles.timingGuidanceNote}>{t('manazilScreen.timingGuidanceNote')}</Text>
          </View>

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
    paddingBottom: Spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Typography.h2,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
  },
  headerSubtitle: {
    marginTop: 2,
    fontSize: Typography.caption,
    color: DarkTheme.textSecondary,
  },
  headerLiveIndicator: {
    marginTop: 2,
    fontSize: 11,
    color: '#3b82f6',
    fontWeight: Typography.weightSemibold,
    letterSpacing: 0.4,
  },
  placeholder: {
    width: 44,
    height: 44,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.h3,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
  },
  sectionSubtitle: {
    marginTop: 6,
    fontSize: Typography.label,
    color: DarkTheme.textSecondary,
    lineHeight: 20,
  },
  elementalStatusWrap: {
    marginBottom: Spacing.xl,
  },
  elementalStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Borders.radiusCircle,
    borderWidth: 1,
    alignSelf: 'flex-start',
    backgroundColor: DarkTheme.cardBackground,
  },
  elementalStatusIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  elementalStatusLabel: {
    fontSize: Typography.label,
    fontWeight: Typography.weightSemibold,
  },
  elementalStatusDescription: {
    marginTop: 8,
    fontSize: Typography.caption,
    color: DarkTheme.textSecondary,
    lineHeight: 18,
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
  relationshipCard: {
    backgroundColor: DarkTheme.cardBackground,
    borderRadius: Borders.radiusLg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: DarkTheme.borderSubtle,
  },
  elementComparison: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  elementBox: {
    flex: 1,
    alignItems: 'center',
  },
  elementLabel: {
    fontSize: Typography.caption,
    color: DarkTheme.textSecondary,
    marginBottom: 8,
  },
  elementBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Borders.radiusCircle,
    borderWidth: 1,
    borderColor: DarkTheme.borderSubtle,
    backgroundColor: DarkTheme.screenBackground,
  },
  elementIcon: {
    fontSize: 16,
  },
  elementName: {
    fontSize: Typography.label,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
  },
  mansionNameSmall: {
    marginTop: 8,
    fontSize: Typography.caption,
    color: DarkTheme.textSecondary,
  },
  relationshipAnalysis: {
    borderTopWidth: 1,
    borderTopColor: DarkTheme.borderSubtle,
    paddingTop: Spacing.md,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Borders.radiusCircle,
    marginBottom: Spacing.sm,
  },
  statusIndicatorIcon: {
    fontSize: 14,
    color: '#0b1220',
  },
  statusIndicatorText: {
    fontSize: Typography.caption,
    fontWeight: Typography.weightSemibold,
    color: '#0b1220',
  },
  relationshipExplanation: {
    fontSize: Typography.label,
    color: DarkTheme.textSecondary,
    lineHeight: 20,
  },
  navigationGuide: {
    marginTop: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: DarkTheme.borderSubtle,
  },
  guideTitle: {
    fontSize: Typography.label,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
    marginBottom: Spacing.sm,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  tipBullet: {
    width: 14,
    color: DarkTheme.textSecondary,
  },
  tipText: {
    flex: 1,
    fontSize: Typography.label,
    color: DarkTheme.textSecondary,
    lineHeight: 20,
  },
  bestCompatibility: {
    marginTop: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: DarkTheme.borderSubtle,
  },
  compatibilityTitle: {
    fontSize: Typography.label,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
    marginBottom: 6,
  },
  compatibilityText: {
    fontSize: Typography.caption,
    color: DarkTheme.textSecondary,
    lineHeight: 18,
  },
  nextMoonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: Spacing.sm,
  },
  nextMoonText: {
    fontSize: Typography.caption,
    color: DarkTheme.textSecondary,
  },

  personalMessageCard: {
    backgroundColor: DarkTheme.cardBackground,
    borderRadius: Borders.radiusLg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: DarkTheme.borderSubtle,
  },
  personalMessageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  personalMessageTitle: {
    fontSize: Typography.h3,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
  },
  personalMessageSubtitle: {
    fontSize: Typography.caption,
    color: DarkTheme.textSecondary,
    marginBottom: Spacing.sm,
  },
  personalMessageText: {
    fontSize: Typography.label,
    color: DarkTheme.textSecondary,
    lineHeight: 20,
  },
  personalMessageStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Borders.radiusCircle,
    borderWidth: 1,
    backgroundColor: DarkTheme.screenBackground,
  },
  personalMessageStatusIcon: {
    fontSize: 12,
  },
  personalMessageStatusText: {
    fontSize: Typography.caption,
    fontWeight: Typography.weightSemibold,
  },
  timingLinkCard: {
    backgroundColor: DarkTheme.cardBackground,
    borderRadius: Borders.radiusLg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: DarkTheme.borderSubtle,
    marginTop: Spacing.md,
  },
  timingLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timingLinkTextCol: {
    flex: 1,
    marginLeft: 10,
  },
  timingLinkLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  timingLinkRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timingLinkTitle: {
    fontSize: 15,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
    marginBottom: 2,
  },
  timingLinkSubtitle: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
    lineHeight: 16,
  },
  scoreCircle: {
    minWidth: 54,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DarkTheme.screenBackground,
  },
  scoreValue: {
    fontSize: Typography.caption,
    fontWeight: Typography.weightSemibold,
  },
  timingGuidanceNote: {
    marginTop: Spacing.md,
    fontSize: Typography.caption,
    color: DarkTheme.textSecondary,
    lineHeight: 18,
    opacity: 0.9,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  heroLiveText: {
    fontSize: 11,
    color: DarkTheme.textSecondary,
    opacity: 0.85,
  },

  moonStrengthBlock: {
    marginBottom: Spacing.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Borders.radiusMd,
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.18)',
  },
  moonStrengthHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  moonStrengthLabel: {
    fontSize: Typography.caption,
    color: DarkTheme.textSecondary,
  },
  moonStrengthValue: {
    fontSize: Typography.label,
    fontWeight: Typography.weightSemibold,
  },
  moonStrengthTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: DarkTheme.borderSubtle,
    overflow: 'hidden',
  },
  moonStrengthFill: {
    height: 8,
    borderRadius: 999,
  },

  mansionMetaRow: {
    marginTop: Spacing.sm,
    gap: 6,
  },
  metaItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaItemText: {
    fontSize: Typography.caption,
    color: DarkTheme.textSecondary,
    opacity: 0.9,
  },

  cosmicDialogueBlock: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: DarkTheme.borderSubtle,
  },
  cosmicDialogueTitle: {
    fontSize: Typography.label,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
    marginBottom: 6,
  },
  cosmicDialogueText: {
    fontSize: Typography.label,
    color: DarkTheme.textSecondary,
    lineHeight: 20,
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
