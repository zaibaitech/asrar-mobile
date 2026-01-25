import { LinearGradient } from 'expo-linear-gradient';
import { Award, Briefcase, Calendar, Compass, Info, Moon, Sparkles, Target, Zap } from 'lucide-react-native';
import React, { useEffect, useRef } from 'react';
import { Animated, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, G, Path, Pattern, Rect, Stop, LinearGradient as SvgLinearGradient } from 'react-native-svg';
import { ElementColors } from '../../constants/IstikharaColors';
import { ZODIAC_SIGNS } from '../../constants/zodiacData';
import { LUNAR_MANSIONS } from '../../data/lunarMansions';

interface IstikharaSummaryCardProps {
  result: any;
  language?: 'en' | 'fr';
  accentColor?: string;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

function formatGregorianDate(date: Date, language: 'en' | 'fr'): string {
  try {
    return new Intl.DateTimeFormat(language === 'fr' ? 'fr-FR' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    }).format(date);
  } catch {
    return date.toDateString();
  }
}

function formatHijriDate(date: Date, language: 'en' | 'fr'): string {
  // Best-effort: Intl Islamic calendar support varies by runtime.
  try {
    const locale = language === 'fr'
      ? 'fr-FR-u-ca-islamic'
      : 'ar-SA-u-ca-islamic';
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
    }).format(date);
  } catch {
    return '';
  }
}

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function withAlpha(color: string, alpha01: number): string {
  const alpha = Math.max(0, Math.min(1, alpha01));

  // Support #RGB and #RRGGBB. If not hex, fall back to provided string.
  if (typeof color !== 'string' || !color.startsWith('#')) return color;

  const hex = color.slice(1);
  const normalized = hex.length === 3
    ? hex.split('').map(c => c + c).join('')
    : hex.length === 6
      ? hex
      : null;

  if (!normalized) return color;

  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function percentToXY(cx: number, cy: number, r: number, pct01: number): { x: number; y: number } {
  const angle = (pct01 * Math.PI * 2) - (Math.PI / 2);
  return {
    x: cx + r * Math.cos(angle),
    y: cy + r * Math.sin(angle),
  };
}

function ParticleField({ color }: { color: string }) {
  const particles = useRef(
    Array.from({ length: 8 }).map((_, i) => {
      const progress = new Animated.Value(0);
      const x = ((i % 4) - 1.5) * 18 + (i % 2 === 0 ? 6 : -6);
      const size = 3 + (i % 3);
      const delay = i * 180;
      return { progress, x, size, delay };
    })
  ).current;

  useEffect(() => {
    const loops = particles.map(p =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(p.delay),
          Animated.timing(p.progress, { toValue: 1, duration: 2200, useNativeDriver: true }),
          Animated.timing(p.progress, { toValue: 0, duration: 0, useNativeDriver: true }),
        ])
      )
    );
    loops.forEach(l => l.start());
    return () => loops.forEach(l => l.stop());
  }, [particles]);

  return (
    <View pointerEvents="none" style={styles.particlesLayer}>
      {particles.map((p, idx) => {
        const translateY = p.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [18, -32],
        });
        const opacity = p.progress.interpolate({
          inputRange: [0, 0.15, 0.8, 1],
          outputRange: [0, 0.55, 0.35, 0],
        });
        const scale = p.progress.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0.9, 1.15, 0.9],
        });
        return (
          <Animated.View
            key={idx}
            style={[
              styles.particle,
              {
                backgroundColor: color,
                width: p.size,
                height: p.size,
                borderRadius: p.size,
                transform: [{ translateX: p.x }, { translateY }, { scale }],
                opacity,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

function IslamicPatternOverlay() {
  return (
    <Svg pointerEvents="none" width="100%" height="100%" style={StyleSheet.absoluteFill}>
      <Defs>
        <Pattern id="geom" patternUnits="userSpaceOnUse" width="48" height="48">
          {/* Simple 8-point star / rosette impression (subtle) */}
          <Path
            d="M24 6 L28 20 L42 24 L28 28 L24 42 L20 28 L6 24 L20 20 Z"
            fill="rgba(255, 255, 255, 0.03)"
          />
          <Circle cx="24" cy="24" r="2.2" fill="rgba(255, 255, 255, 0.035)" />
        </Pattern>
      </Defs>
      <Rect x="0" y="0" width="100%" height="100%" fill="url(#geom)" />
    </Svg>
  );
}

// Helper function to translate element names
function getElementName(element: string, language: 'en' | 'fr'): string {
  if (language === 'fr') {
    const elementMap: Record<string, string> = {
      fire: 'Feu',
      earth: 'Terre',
      air: 'Air',
      water: 'Eau',
    };
    return elementMap[element.toLowerCase()] || element;
  }
  return element.charAt(0).toUpperCase() + element.slice(1);
}

// Helper function to get zodiac info by burj number
function getZodiacInfo(burjNumber: number, language: 'en' | 'fr'): { name: string; nameAr: string } | null {
  const zodiac = ZODIAC_SIGNS[burjNumber];
  if (!zodiac) return null;
  
  return {
    name: language === 'en' ? zodiac.nameEn : zodiac.nameFr,
    nameAr: zodiac.nameAr,
  };
}

// Helper function to get primary mansion info by burj number
// Each zodiac sign (burj) corresponds to 2-3 lunar mansions
// We show the first (primary) mansion for each zodiac
function getMansionInfo(burjNumber: number, language: 'en' | 'fr'): { name: string; nameAr: string } | null {
  // Map burj numbers (1-12) to primary mansion index
  // Based on traditional Islamic astronomy where each zodiac spans ~2.33 mansions
  const burjToMansionMap: Record<number, number> = {
    1: 0,   // Aries → Al-Sharatān
    2: 2,   // Taurus → Al-Thurayyā
    3: 4,   // Gemini → Al-Haqʿah
    4: 7,   // Cancer → Al-Nathrah
    5: 9,   // Leo → Al-Jabhah
    6: 11,  // Virgo → Al-Ṣarfah
    7: 14,  // Libra → Al-Ghafr
    8: 16,  // Scorpio → Al-Iklīl
    9: 19,  // Sagittarius → Al-Naʿāʾim
    10: 21, // Capricorn → Saʿd al-Dhābiḥ
    11: 23, // Aquarius → Saʿd al-Suʿūd
    12: 26, // Pisces → Al-Fargh al-Muʾakhkhar
  };
  
  const mansionIndex = burjToMansionMap[burjNumber];
  if (mansionIndex === undefined) return null;
  
  const mansion = LUNAR_MANSIONS[mansionIndex];
  if (!mansion) return null;
  
  return {
    name: language === 'en' ? mansion.nameEnglish : mansion.nameFrench,
    nameAr: mansion.nameArabic,
  };
}

function shortSpiritualQuality(text: string): string {
  // Keep the first phrase to avoid overly long lines in the stat card.
  const first = text.split(',')[0]?.trim();
  if (!first) return text;
  // If it's still very long, cap it softly.
  return first.length > 38 ? `${first.slice(0, 36).trim()}…` : first;
}

function getZodiacSpiritualQuality(burjNumber: number, language: 'en' | 'fr'): string | null {
  const zodiac = ZODIAC_SIGNS[burjNumber];
  if (!zodiac) return null;
  const raw = language === 'fr' ? zodiac.spiritualQualityFr : zodiac.spiritualQuality;
  return raw ? shortSpiritualQuality(raw) : null;
}

function getElementTagline(element: string, language: 'en' | 'fr'): string {
  const taglines: Record<string, { en: string; fr: string }> = {
    water: { en: 'Governs: Emotions & intuition', fr: 'Gouverne : Émotions & intuition' },
    fire: { en: 'Governs: Will & vitality', fr: 'Gouverne : Volonté & vitalité' },
    air: { en: 'Governs: Mind & communication', fr: 'Gouverne : Esprit & communication' },
    earth: { en: 'Governs: Stability & grounding', fr: 'Gouverne : Stabilité & ancrage' },
  };
  const key = String(element || '').toLowerCase();
  return (taglines[key] ? (language === 'fr' ? taglines[key].fr : taglines[key].en) : (language === 'fr' ? 'Gouverne : Équilibre intérieur' : 'Governs: Inner balance'));
}

function getBestTimeSuggestion(element: string, language: 'en' | 'fr'): string {
  const suggestions: Record<string, { en: string; fr: string }> = {
    water: { en: 'Best time: After Fajr', fr: 'Meilleur moment : Après Fajr' },
    fire: { en: 'Best time: After Ẓuhr', fr: 'Meilleur moment : Après Ẓuhr' },
    air: { en: 'Best time: After ʿAṣr', fr: 'Meilleur moment : Après ʿAṣr' },
    earth: { en: 'Best time: After Maghrib', fr: 'Meilleur moment : Après Maghrib' },
  };
  const key = String(element || '').toLowerCase();
  return (suggestions[key] ? (language === 'fr' ? suggestions[key].fr : suggestions[key].en) : (language === 'fr' ? 'Meilleur moment : Après ʿIshāʾ' : 'Best time: After ʿIshāʾ'));
}

export function IstikharaSummaryCard({ result, language = 'en', accentColor }: IstikharaSummaryCardProps) {
  const profile = result.burujProfile;
  const element = profile.element as 'fire' | 'earth' | 'air' | 'water';
  const config = ElementColors[element];

  // Allow the Overview screen to enforce a single uniform accent.
  const accent = accentColor || config.primarySolid;
  const border = accentColor || config.border;

  // Progress animation values
  const mainProgress = useRef(new Animated.Value(0)).current;
  const careerProgress = useRef(new Animated.Value(0)).current;
  const spiritualProgress = useRef(new Animated.Value(0)).current;

  const pulse = useRef(new Animated.Value(0)).current;
  const overallRow = useRef(new Animated.Value(0)).current;
  const careerRow = useRef(new Animated.Value(0)).current;
  const spiritualRow = useRef(new Animated.Value(0)).current;
  const [infoOpen, setInfoOpen] = React.useState(false);
  const [infoKey, setInfoKey] = React.useState<'overall' | 'career' | 'spiritual'>('overall');

  // Simulated scores (in real app, these would come from API)
  const scores = {
    main: 95,
    career: 92,
    spiritual: 88,
  };

  const computedAt = (() => {
    const raw = (result?.createdAt ?? result?.calculatedAt ?? result?.updatedAt) as any;
    const d = raw ? new Date(raw) : new Date();
    return Number.isNaN(d.getTime()) ? new Date() : d;
  })();

  const cardBg = ['rgba(30, 41, 84, 0.48)', 'rgba(30, 41, 84, 0.34)'] as const;

  // Radial progress calculations
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  
  const mainStrokeDashoffset = mainProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, circumference - (scores.main / 100) * circumference],
  });
  
  const careerStrokeDashoffset = careerProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, circumference - (scores.career / 100) * circumference],
  });
  
  const spiritualStrokeDashoffset = spiritualProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, circumference - (scores.spiritual / 100) * circumference],
  });

  useEffect(() => {
    // Animate progress rings + rows on mount.
    // SVG strokeDashoffset and width animations require useNativeDriver=false.
    Animated.stagger(180, [
      Animated.timing(mainProgress, {
        toValue: 1,
        duration: 1400,
        useNativeDriver: false,
      }),
      Animated.timing(careerProgress, {
        toValue: 1,
        duration: 1400,
        useNativeDriver: false,
      }),
      Animated.timing(spiritualProgress, {
        toValue: 1,
        duration: 1400,
        useNativeDriver: false,
      }),
    ]).start();

    Animated.stagger(120, [
      Animated.timing(overallRow, { toValue: 1, duration: 900, useNativeDriver: false }),
      Animated.timing(careerRow, { toValue: 1, duration: 900, useNativeDriver: false }),
      Animated.timing(spiritualRow, { toValue: 1, duration: 900, useNativeDriver: false }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1200, useNativeDriver: false }),
        Animated.timing(pulse, { toValue: 0, duration: 1200, useNativeDriver: false }),
      ])
    ).start();
  }, [careerProgress, careerRow, mainProgress, overallRow, pulse, spiritualProgress, spiritualRow]);

  const blessedDay = profile.blessed_day;
  const personality = profile.personality?.[language];
  const zodiacInfo = getZodiacInfo(result.burujRemainder, language);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={config.bgGradient as any}
        style={styles.gradient}
      >
        <View pointerEvents="none" style={styles.patternOverlay}>
          <IslamicPatternOverlay />
        </View>
        <View style={styles.grid}>
          {/* LEFT COLUMN: Radial Progress */}
          <View style={styles.leftColumn}>
            <View style={styles.radialContainer}>
              <Text style={styles.dominantLabel}>
                {language === 'en' ? 'DOMINANT ELEMENT' : 'ÉLÉMENT DOMINANT'}
              </Text>
              <View style={styles.ringWrap}>
                <Svg width={180} height={180} viewBox="0 0 180 180">
                  <Defs>
                    <SvgLinearGradient id="ringGradient" x1="0" y1="0" x2="1" y2="1">
                      <Stop offset="0" stopColor={accent} stopOpacity="0.55" />
                      <Stop offset="0.5" stopColor={accent} stopOpacity="1" />
                      <Stop offset="1" stopColor={accent} stopOpacity="0.55" />
                    </SvgLinearGradient>
                  </Defs>
                  <G rotation="-90" origin="90, 90">
                    {/* Background circles */}
                    <Circle
                      cx="90"
                      cy="90"
                      r={radius}
                      stroke="rgba(255, 255, 255, 0.1)"
                      strokeWidth="6"
                      fill="none"
                    />
                    <Circle
                      cx="90"
                      cy="90"
                      r={radius + 8}
                      stroke="rgba(255, 255, 255, 0.1)"
                      strokeWidth="5"
                      fill="none"
                    />
                    <Circle
                      cx="90"
                      cy="90"
                      r={radius - 4}
                      stroke="rgba(255, 255, 255, 0.1)"
                      strokeWidth="4"
                      fill="none"
                    />

                    {/* Animated progress circles */}
                    <AnimatedCircle
                      cx="90"
                      cy="90"
                      r={radius}
                      stroke="url(#ringGradient)"
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray={`${circumference} ${circumference}`}
                      strokeDashoffset={mainStrokeDashoffset}
                      strokeLinecap="round"
                    />
                    <AnimatedCircle
                      cx="90"
                      cy="90"
                      r={radius + 8}
                      stroke={accent}
                      strokeWidth="5"
                      fill="none"
                      strokeDasharray={`${circumference} ${circumference}`}
                      strokeDashoffset={careerStrokeDashoffset}
                      strokeLinecap="round"
                      opacity="0.7"
                    />
                    <AnimatedCircle
                      cx="90"
                      cy="90"
                      r={radius - 4}
                      stroke={accent}
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray={`${circumference} ${circumference}`}
                      strokeDashoffset={spiritualStrokeDashoffset}
                      strokeLinecap="round"
                      opacity="0.5"
                    />

                    {/* Subtle pulsing glow ring */}
                    <AnimatedCircle
                      cx="90"
                      cy="90"
                      r={radius + 13}
                      stroke={accent}
                      strokeWidth="3"
                      fill="none"
                      opacity={pulse.interpolate({ inputRange: [0, 1], outputRange: [0.08, 0.22] }) as any}
                    />
                  </G>

                  {/* Tick marks at 25/50/75 */}
                  {([0.25, 0.5, 0.75] as const).map((p, idx) => {
                    const { x, y } = percentToXY(90, 90, radius + 2, p);
                    return (
                      <Circle
                        key={idx}
                        cx={x}
                        cy={y}
                        r={2.2}
                        fill="rgba(255, 255, 255, 0.35)"
                      />
                    );
                  })}
                </Svg>

                {/* Subtle particles around the droplet */}
                <ParticleField color={accent} />

                {/* Center Content */}
                <View pointerEvents="none" style={styles.centerContent}>
                  <Text style={styles.centerEmoji}>{profile.element_emoji}</Text>
                  <Text style={[styles.centerScore, { color: accent }]}>
                    {scores.main}%
                  </Text>
                  <Text style={styles.centerElement} numberOfLines={1}>
                    {zodiacInfo?.name || getElementName(profile.element, language)}
                  </Text>
                  {!!zodiacInfo?.nameAr && (
                    <Text style={styles.centerLabel} numberOfLines={1}>
                      {zodiacInfo.nameAr}
                    </Text>
                  )}
                </View>
              </View>

              <Text style={[styles.belowRingElement, { color: accent }]}>
                {language === 'en' ? 'Element:' : 'Élément :'} {getElementName(profile.element, language)}
              </Text>
            </View>

            {/* Context banner: Hijri + Gregorian */}
            <View style={[styles.contextBanner, { borderColor: border }]}> 
              <View style={styles.contextLeft}>
                <Text style={styles.contextTitle}>
                  {language === 'en' ? 'Calculation Date' : 'Date du calcul'}
                </Text>
                <Text style={styles.contextDate}>
                  {(() => {
                    const hijri = formatHijriDate(computedAt, language);
                    const greg = formatGregorianDate(computedAt, language);
                    return hijri ? `${hijri} • ${greg}` : greg;
                  })()}
                </Text>
              </View>
              <View style={styles.contextRight}>
                <View style={[styles.statusDot, { backgroundColor: accent }]} />
                <Text style={styles.contextStatus} numberOfLines={1}>
                  {language === 'en'
                    ? `For ${String(result?.personName ?? 'You')}`
                    : `Pour ${String(result?.personName ?? 'Vous')}`}
                </Text>
              </View>
            </View>

            {/* Score Legend */}
            <View style={styles.legendContainer}>
              {(
                [
                  {
                    key: 'overall' as const,
                    labelEn: 'Overall Alignment',
                    labelFr: 'Alignement Global',
                    value: scores.main,
                    anim: overallRow,
                    Icon: Compass,
                  },
                  {
                    key: 'career' as const,
                    labelEn: 'Career Match',
                    labelFr: 'Correspondance Carrière',
                    value: scores.career,
                    anim: careerRow,
                    Icon: Briefcase,
                  },
                  {
                    key: 'spiritual' as const,
                    labelEn: 'Spiritual Practice',
                    labelFr: 'Pratique Spirituelle',
                    value: scores.spiritual,
                    anim: spiritualRow,
                    Icon: Sparkles,
                  },
                ]
              ).map(({ key, labelEn, labelFr, value, anim, Icon }) => {
                const pct = clamp01(value / 100);
                const widthPct = anim.interpolate({ inputRange: [0, 1], outputRange: ['0%', `${Math.round(pct * 100)}%`] });
                return (
                  <Pressable
                    key={key}
                    onPress={() => {
                      setInfoKey(key);
                      setInfoOpen(true);
                    }}
                    style={({ pressed }) => [
                      styles.legendRow,
                      {
                        borderColor: border,
                        backgroundColor: pressed ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
                        transform: [{ scale: pressed ? 0.99 : 1 }],
                      },
                    ]}
                  >
                    <View style={styles.legendRowTop}>
                      <View style={styles.legendRowLeft}>
                        <View style={[styles.legendIconWrap, { backgroundColor: withAlpha(accent, 0.13), borderColor: withAlpha(accent, 0.165) }]}> 
                          <Icon size={16} color={accent} />
                        </View>
                        <Text style={styles.legendText}>{language === 'en' ? labelEn : labelFr}</Text>
                      </View>
                      <View style={styles.legendRowRight}>
                        <Text style={[styles.legendValue, { color: accent }]}>{value}%</Text>
                        <View style={styles.infoIconWrap}>
                          <Info size={16} color="rgba(255,255,255,0.6)" />
                        </View>
                      </View>
                    </View>

                    <View style={styles.legendBarTrack}>
                      <Animated.View
                        style={[
                          styles.legendBarFill,
                          {
                            width: widthPct,
                            backgroundColor: accent,
                          },
                        ]}
                      />
                    </View>
                  </Pressable>
                );
              })}
            </View>

            {/* Info modal */}
            <Modal visible={infoOpen} transparent animationType="fade" onRequestClose={() => setInfoOpen(false)}>
              <Pressable style={styles.modalBackdrop} onPress={() => setInfoOpen(false)}>
                <Pressable style={[styles.modalCard, { borderColor: border }]} onPress={() => {}}>
                  <Text style={[styles.modalTitle, { color: accent }]}>
                    {infoKey === 'overall'
                      ? (language === 'en' ? 'Overall Alignment' : 'Alignement Global')
                      : infoKey === 'career'
                        ? (language === 'en' ? 'Career Match' : 'Correspondance Carrière')
                        : (language === 'en' ? 'Spiritual Practice' : 'Pratique Spirituelle')}
                  </Text>
                  <Text style={styles.modalBody}>
                    {infoKey === 'overall'
                      ? (language === 'en'
                        ? 'A blended indicator of how well your current profile resonates with the core pattern shown above.'
                        : 'Indicateur global de la cohérence entre votre profil et le schéma spirituel affiché.')
                      : infoKey === 'career'
                        ? (language === 'en'
                          ? 'How strongly your profile supports career/mission themes associated with your Burūj and element.'
                          : 'Mesure la compatibilité de votre profil avec les thèmes professionnels liés à votre Burūj et élément.')
                        : (language === 'en'
                          ? 'How supportive the current pattern is for devotional focus and recommended spiritual practice.'
                          : 'Mesure le soutien du schéma actuel pour la pratique spirituelle et la concentration dévotionnelle.')}
                  </Text>
                  <Pressable onPress={() => setInfoOpen(false)} style={[styles.modalClose, { backgroundColor: withAlpha(accent, 0.13), borderColor: withAlpha(accent, 0.2) }]}>
                    <Text style={[styles.modalCloseText, { color: accent }]}>{language === 'en' ? 'Close' : 'Fermer'}</Text>
                  </Pressable>
                </Pressable>
              </Pressable>
            </Modal>
          </View>

          {/* MIDDLE COLUMN: Statistics */}
          <View style={styles.middleColumn}>
            <View style={styles.statsHeader}>
              <Award size={18} color={accent} />
              <Text style={styles.statsTitle}>
                {language === 'en' ? 'Your Numbers' : 'Vos Numéros'}
              </Text>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statsRow}>
                {/* Buruj Number */}
                <View style={[styles.statCard, { borderColor: withAlpha(accent, 0.3) }]}>
                  <LinearGradient colors={cardBg as any} style={styles.statGradient}>
                    <View style={[styles.statIndicator, { backgroundColor: accent }]} />
                    <Text style={styles.statIcon}>🌙</Text>
                    <Text style={[styles.statValue, { color: accent }]}>{result.burujRemainder}</Text>

                    {(() => {
                      const zodiacInfo = getZodiacInfo(result.burujRemainder, language);
                      return zodiacInfo ? (
                        <>
                          <Text style={styles.statZodiacName}>{zodiacInfo.name}</Text>
                          <Text style={styles.statZodiacArabic}>{zodiacInfo.nameAr}</Text>
                        </>
                      ) : null;
                    })()}

                    <Text style={styles.statLabel}>{language === 'en' ? 'Burūj' : 'Burūj'}</Text>

                    {(() => {
                      const mansionInfo = getMansionInfo(result.burujRemainder, language);
                      return mansionInfo ? (
                        <>
                          <Text style={styles.statMansionName}>{mansionInfo.name}</Text>
                          <Text style={styles.statMansionArabic}>{mansionInfo.nameAr}</Text>
                        </>
                      ) : null;
                    })()}

                    <Text style={styles.statSublabel}>{language === 'en' ? 'Mansion' : 'Maison'}</Text>

                    {(() => {
                      const quality = getZodiacSpiritualQuality(result.burujRemainder, language);
                      return quality ? (
                        <View style={styles.statFooter}>
                          <Text style={styles.statFooterText}>
                            {language === 'en' ? 'Spiritual Strength: ' : 'Force spirituelle : '}
                            {quality}
                          </Text>
                        </View>
                      ) : null;
                    })()}
                  </LinearGradient>
                </View>

                {/* Element Number */}
                <View style={[styles.statCard, { borderColor: withAlpha(accent, 0.3) }]}>
                  <LinearGradient colors={cardBg as any} style={styles.statGradient}>
                    <Text style={styles.statIcon}>{profile.element_emoji}</Text>
                    <Text style={[styles.statValue, { color: accent }]}>{profile.element_number}</Text>
                    <Text style={styles.statLabel}>{language === 'en' ? 'Element' : 'Élément'}</Text>
                    <Text style={styles.statSublabel}>{language === 'en' ? 'ID Number' : 'Numéro ID'}</Text>

                    <View style={styles.statFooter}>
                      <Text style={[styles.statFooterText, { color: withAlpha(accent, 0.85) }]}>
                        {getElementTagline(profile.element, language)}
                      </Text>
                    </View>
                  </LinearGradient>
                </View>
              </View>

              <View style={styles.statsRow}>
                {/* Total Hadad */}
                <View style={[styles.statCard, { borderColor: withAlpha(accent, 0.3) }]}>
                  <LinearGradient colors={cardBg as any} style={styles.statGradient}>
                    <Text style={styles.statIcon}>📊</Text>
                    <Text style={[styles.statValue, { color: accent }]}>{result.combinedTotal}</Text>
                    <Text style={styles.statLabel}>{language === 'en' ? 'Total' : 'Total'}</Text>
                    <Text style={styles.statSublabel}>{language === 'en' ? 'Ḥadad Value' : 'Valeur Ḥadad'}</Text>

                    <View style={styles.statFooter}>
                      <Text style={styles.statFooterText}>
                        {language === 'en' ? 'Divine Frequency' : 'Fréquence divine'}
                      </Text>
                      {(typeof result?.personTotal === 'number' || typeof result?.motherTotal === 'number') && (
                        <Text style={styles.statFooterSubtext}>
                          {language === 'en' ? 'You' : 'Vous'}: {typeof result?.personTotal === 'number' ? result.personTotal : 0}  ·  {language === 'en' ? 'Mother' : 'Mère'}: {typeof result?.motherTotal === 'number' ? result.motherTotal : 0}
                        </Text>
                      )}
                    </View>
                  </LinearGradient>
                </View>

                {/* Repetition Count */}
                <View style={[styles.statCard, { borderColor: withAlpha(accent, 0.3) }]}>
                  <LinearGradient colors={cardBg as any} style={styles.statGradient}>
                    <Text style={styles.statIcon}>🔢</Text>
                    <Text style={[styles.statValue, { color: accent }]}>{result.repetitionCount}</Text>
                    <Text style={styles.statLabel}>{language === 'en' ? 'Count' : 'Compteur'}</Text>
                    <Text style={styles.statSublabel}>{language === 'en' ? 'Repetitions' : 'Répétitions'}</Text>

                    <View style={styles.statFooter}>
                      <Text style={[styles.statFooterText, { color: withAlpha(accent, 0.85) }]}>
                        {language === 'en' ? 'Recommended daily recitation' : 'Récitation quotidienne recommandée'}
                      </Text>
                      <Text style={[styles.statFooterSubtext, { color: withAlpha(accent, 0.75) }]}>
                        {getBestTimeSuggestion(profile.element, language)}
                      </Text>
                    </View>
                  </LinearGradient>
                </View>
              </View>
            </View>

            {/* Blessed Day Card */}
            {blessedDay && (
              <View style={[styles.blessedDayCard, { borderColor: border }]}>
                <LinearGradient
                  colors={config.bgGradient as any}
                  style={styles.blessedDayGradient}
                >
                  <View style={styles.blessedDayHeader}>
                    <View style={[styles.blessedDayIconContainer, { backgroundColor: withAlpha(accent, 0.2) }]}>
                      <Calendar size={18} color={accent} />
                    </View>
                    <Text style={styles.blessedDayTitle}>
                      {language === 'en' ? 'Your Power Day' : 'Votre Jour de Puissance'}
                    </Text>
                  </View>
                  <View style={styles.blessedDayContent}>
                    <Text style={styles.blessedDayName}>
                      {blessedDay.day?.[language]}
                    </Text>
                    <Text style={styles.blessedDayDesc}>
                      {language === 'en' 
                        ? 'Most auspicious for important decisions' 
                        : 'Le plus propice pour les décisions importantes'}
                    </Text>
                  </View>
                </LinearGradient>
              </View>
            )}
          </View>

          {/* RIGHT COLUMN: Key Insights */}
          <View style={styles.rightColumn}>
            <View style={styles.insightsHeader}>
              <Target size={18} color={accent} />
              <Text style={styles.insightsTitle}>
                {language === 'en' ? 'Key Insights' : 'Perspectives Clés'}
              </Text>
            </View>

            {/* Career Preview */}
            {profile.career && (
              <View style={[styles.insightCard, { borderColor: border }]}>
                <LinearGradient
                  colors={config.bgGradient as any}
                  style={styles.insightGradient}
                >
                  <View style={styles.insightHeader}>
                    <View style={[styles.insightIconContainer, { backgroundColor: withAlpha(accent, 0.2) }]}>
                      <Briefcase size={18} color={accent} />
                    </View>
                    <View style={styles.insightTitleContainer}>
                      <Text style={styles.insightTitle}>
                        {language === 'en' ? 'Career Path' : 'Parcours Professionnel'}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.insightText} numberOfLines={3}>
                    {profile.career.principle?.[language] || 
                     (language === 'en' ? 'Explore career guidance in the Career tab' : 'Explorez l\'orientation professionnelle dans l\'onglet Carrière')}
                  </Text>
                </LinearGradient>
              </View>
            )}

            {/* Spiritual Practice Preview */}
            {profile.spiritual_practice && (
              <View style={[styles.insightCard, { borderColor: border }]}>
                <LinearGradient
                  colors={config.bgGradient as any}
                  style={styles.insightGradient}
                >
                  <View style={styles.insightHeader}>
                    <View style={[styles.insightIconContainer, { backgroundColor: withAlpha(accent, 0.2) }]}>
                      <Moon size={18} color={accent} />
                    </View>
                    <View style={styles.insightTitleContainer}>
                      <Text style={styles.insightTitle}>
                        {language === 'en' ? 'Daily Practice' : 'Pratique Quotidienne'}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.insightText} numberOfLines={2}>
                    {profile.spiritual_practice.divine_names?.note?.[language] || 
                     profile.spiritual_practice?.[language] ||
                     (language === 'en' ? 'Explore spiritual practices in the Spiritual tab' : 'Explorez les pratiques spirituelles dans l\'onglet Spirituel')}
                  </Text>
                  <Text style={styles.insightSubtext}>
                    {language === 'en' ? 'Recite daily for spiritual balance' : 'Récitez quotidiennement pour l\'équilibre spirituel'}
                  </Text>
                </LinearGradient>
              </View>
            )}

            {/* Core Trait */}
            {personality && (
              <View style={[styles.insightCard, { borderColor: border }]}>
                <LinearGradient
                  colors={['rgba(0, 0, 0, 0.2)', 'rgba(0, 0, 0, 0.1)']}
                  style={styles.insightGradient}
                >
                  <View style={styles.insightHeader}>
                    <Zap size={16} color={accent} />
                    <Text style={styles.insightSmallTitle}>
                      {language === 'en' ? 'Core Trait' : 'Trait Principal'}
                    </Text>
                  </View>
                  <Text style={styles.insightText} numberOfLines={3}>
                    {personality.temperament}
                  </Text>
                </LinearGradient>
              </View>
            )}
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  gradient: {
    padding: 16,
  },
  patternOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  grid: {
    gap: 16,
  },

  // Left Column - Radial Progress
  leftColumn: {
    gap: 12,
  },
  radialContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  dominantLabel: {
    fontSize: 10,
    letterSpacing: 1.2,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.85)',
    marginBottom: 10,
  },
  ringWrap: {
    width: 180,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  belowRingElement: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  centerContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  centerEmoji: {
    fontSize: 36,
    marginBottom: 4,
  },
  centerScore: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  centerElement: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  centerLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
    textAlign: 'center',
    paddingHorizontal: 8,
  },

  particlesLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  particle: {
    position: 'absolute',
    top: 90,
    left: 90,
  },

  contextBanner: {
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.18)',
  },
  contextLeft: {
    flex: 1,
    paddingRight: 10,
  },
  contextRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    maxWidth: '52%',
  },
  contextTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.75)',
    marginBottom: 2,
  },
  contextDate: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.95)',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  contextStatus: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.85)',
    flexShrink: 1,
  },

  // Legend
  legendContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 12,
    padding: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  legendRow: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 10,
  },
  legendRowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  legendRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    paddingRight: 10,
  },
  legendRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  infoIconWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  legendBarTrack: {
    height: 6,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  legendBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    flex: 1,
    fontSize: 11,
    color: '#ffffff',
  },
  legendValue: {
    fontSize: 12,
    fontWeight: 'bold',
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: 'rgba(10, 10, 10, 0.92)',
    padding: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 8,
  },
  modalBody: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 18,
  },
  modalClose: {
    marginTop: 14,
    alignSelf: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  modalCloseText: {
    fontSize: 12,
    fontWeight: '700',
  },

  // Middle Column - Stats
  middleColumn: {
    gap: 12,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  statsGrid: {
    backgroundColor: 'transparent',
    gap: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    aspectRatio: 0.85,
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  statGradient: {
    paddingVertical: 16,
    paddingHorizontal: 14,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
  },
  statIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#ffffff',
  },
  statSublabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  statFooter: {
    width: '100%',
    marginTop: 'auto',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  statFooterText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    fontWeight: '600',
  },
  statFooterSubtext: {
    marginTop: 6,
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    fontWeight: '600',
  },
  statZodiacName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  statZodiacArabic: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
    fontFamily: 'System',
  },
  statMansionName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#ffffff',
    marginTop: 8,
    marginBottom: 2,
  },
  statMansionArabic: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.75)',
    fontFamily: 'System',
  },

  // Blessed Day
  blessedDayCard: {
    borderRadius: 12,
    borderWidth: 2,
    overflow: 'hidden',
    marginTop: 4,
  },
  blessedDayGradient: {
    padding: 16,
  },
  blessedDayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  blessedDayIconContainer: {
    padding: 8,
    borderRadius: 8,
  },
  blessedDayTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  blessedDayContent: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  blessedDayName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  blessedDayDesc: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },

  // Right Column - Insights
  rightColumn: {
    gap: 12,
  },
  insightsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  insightsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  insightCard: {
    borderRadius: 12,
    borderWidth: 2,
    overflow: 'hidden',
  },
  insightGradient: {
    padding: 14,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  insightIconContainer: {
    padding: 8,
    borderRadius: 8,
  },
  insightTitleContainer: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  insightSmallTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  insightText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.95)',
    lineHeight: 19,
  },
  insightSubtext: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 6,
  },
});
