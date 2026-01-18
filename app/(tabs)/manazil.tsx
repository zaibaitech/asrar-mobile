import { ConstellationMap } from '@/components/manazil/ConstellationMap';
import { ElementalSigil } from '@/components/manazil/ElementalSigil';
import { LunarPhaseIndicator } from '@/components/manazil/LunarPhaseIndicator';
import { MysticalCorrespondencesCard } from '@/components/manazil/MysticalCorrespondencesCard';
import { PlanetaryHoursCard } from '@/components/manazil/PlanetaryHoursCard';
import { SpiritualPracticesCard } from '@/components/manazil/SpiritualPracticesCard';
import { Borders, DarkTheme, ElementAccents, Spacing, Typography } from '@/constants/DarkTheme';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProfile } from '@/contexts/ProfileContext';
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
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Element = 'fire' | 'water' | 'air' | 'earth';
type ResonanceLevel = 'supportive' | 'harmonious' | 'neutral' | 'challenging' | 'transformative';

const LABELS: Record<
  ManazilLanguage,
  {
    title: string;
    todayGate: string;
    youInGate: string;
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
  }
> = {
  en: {
    title: 'Manāzil',
    todayGate: 'Today’s gate',
    youInGate: 'You in this gate',
    meaning: 'Meaning',
    practice: 'Practice',
    innerWork: 'Inner work',
    live: 'Live',
    approx: 'Approx',
    yourGate: 'Your gate',
    completeProfile: 'Complete your profile to personalize this.',
    bestPractices: 'Best practices',
    avoid: 'Better to avoid',
    reflection: 'Reflection',
  },
  fr: {
    title: 'Manāzil',
    todayGate: 'La porte du jour',
    youInGate: 'Vous dans cette porte',
    meaning: 'Sens',
    practice: 'Pratique',
    innerWork: 'Travail intérieur',
    live: 'Live',
    approx: 'Approximatif',
    yourGate: 'Votre porte',
    completeProfile: 'Complétez votre profil pour personnaliser.',
    bestPractices: 'Bonnes pratiques',
    avoid: 'Mieux éviter',
    reflection: 'Réflexion',
  },
  ar: {
    title: 'المنازل',
    todayGate: 'باب اليوم',
    youInGate: 'أنت في هذا الباب',
    meaning: 'المعنى',
    practice: 'العمل',
    innerWork: 'العمل الباطن',
    live: 'مباشر',
    approx: 'تقريبي',
    yourGate: 'بابك',
    completeProfile: 'أكمل ملفك لتفعيل التخصيص.',
    bestPractices: 'أفضل الأعمال',
    avoid: 'يُستحسن تجنّبه',
    reflection: 'تأمل',
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

  const [todayIndex, setTodayIndex] = React.useState<number | null>(null);
  const [isRealTime, setIsRealTime] = React.useState(false);

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

          {/* Today Gate */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{labels.todayGate}</Text>
            <View style={[styles.heroCard, { borderColor: `${accent}35` }]}> 
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
                <View
                  style={[
                    styles.sourcePill,
                    { backgroundColor: isRealTime ? 'rgba(16, 185, 129, 0.15)' : 'rgba(100, 181, 246, 0.15)' },
                  ]}
                >
                  <Text style={[styles.sourcePillText, { color: isRealTime ? '#10b981' : '#64B5F6' }]}>
                    {isRealTime ? labels.live : labels.approx}
                  </Text>
                </View>
              </View>

              {todayMansion ? (
                <>
                  {/* Decorative calligraphy */}
                  <Text style={[styles.calligraphy, { color: `${accent}66` }]}>{todayMansion.nameArabic}</Text>
                  <Text style={styles.heroName}>{todayMansion.nameTransliteration}</Text>
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

          {/* You in this gate */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{labels.youInGate}</Text>
            <View style={styles.card}>
              {personalMansion ? (
                <>
                  <Text style={styles.cardText}>
                    {labels.yourGate}: {personalMansion.nameTransliteration} ({personalMansion.nameArabic})
                  </Text>
                  <Text style={styles.heroMeta}>
                    {getElementIcon(personalMansion.element)} {t(`elements.${personalMansion.element}`)}
                  </Text>
                  <Text style={styles.cardText}>
                    {resonance === 'supportive' || resonance === 'harmonious'
                      ? t('widgets.manazil.favorable')
                      : resonance === 'neutral'
                        ? t('widgets.manazil.balanced')
                        : t('widgets.manazil.delicate')}
                  </Text>
                </>
              ) : (
                <Text style={styles.cardText}>{labels.completeProfile}</Text>
              )}
            </View>
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

          <View style={{ height: 24 }} />
        </ScrollView>
      </LinearGradient>
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
});
