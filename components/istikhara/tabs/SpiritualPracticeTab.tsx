import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import {
    BookOpen,
    Calendar,
    Check,
    CheckSquare,
    ChevronDown,
    ChevronUp,
    Copy,
    Gift,
    Moon,
    Shield,
    Sparkles,
    Star,
    Target,
    Zap
} from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
    Alert,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import Svg, { Circle, Defs, Path, Pattern, Rect } from 'react-native-svg';
import { getElementColors } from "../../../constants/ElementColors";
import { getZodiacSign } from '../../../constants/zodiacData';
import { useLanguage } from "../../../contexts/LanguageContext";
import NotificationService, { NotificationCategory } from '../../../services/NotificationService';
import type { IstikharaCalculationResult } from "../../../services/istikhara/types";
import { DhikrCounter } from "../DhikrCounter";

const { width } = Dimensions.get('window');

interface SpiritualPracticeTabProps {
  result: IstikharaCalculationResult;
}

type PracticeType = "monthly" | "lifetime" | "divine";

type RitualEssenceItem = {
  ar: string;
  translit: string;
  en: string;
};

type RitualEssenceByZodiac = {
  zodiacEn: string;
  zodiacAr: string;
  zodiacTranslit: string;
  items: RitualEssenceItem[];
};

// Classical Ritual Essences by Zodiac (Burj index: 1..12)
const RITUAL_ESSENCES_BY_BURUJ: Record<number, RitualEssenceByZodiac> = {
  1: {
    zodiacEn: 'Aries',
    zodiacAr: 'الحمل',
    zodiacTranslit: 'al-Ḥamal',
    items: [
      { ar: 'لُبَان ذَكَر', translit: 'Lubān Dhakr', en: 'Male Frankincense' },
      { ar: 'دَهْن العُود', translit: 'Dahn al-ʿŪd', en: 'Oud Oil' },
    ],
  },
  2: {
    zodiacEn: 'Taurus',
    zodiacAr: 'الثور',
    zodiacTranslit: 'al-Thawr',
    items: [
      { ar: 'وَرْد', translit: 'Ward', en: 'Rose' },
      { ar: 'صَنْدَل', translit: 'Sandal', en: 'Sandalwood' },
    ],
  },
  3: {
    zodiacEn: 'Gemini',
    zodiacAr: 'الجوزاء',
    zodiacTranslit: "al-Jawzā'",
    items: [
      { ar: 'مَسْتَكَى', translit: 'Mastakā', en: 'Mastic Gum' },
      { ar: 'دَهْن الزَّنْبَق', translit: 'Dahn al-Zanbaq', en: 'Lily Oil' },
    ],
  },
  4: {
    zodiacEn: 'Cancer',
    zodiacAr: 'السرطان',
    zodiacTranslit: 'al-Saraṭān',
    items: [
      { ar: 'كَافُور', translit: 'Kāfūr', en: 'Camphor' },
      { ar: 'صَنْدَل أَبْيَض', translit: 'Sandal Abyaḍ', en: 'White Sandalwood' },
    ],
  },
  5: {
    zodiacEn: 'Leo',
    zodiacAr: 'الأسد',
    zodiacTranslit: 'al-Asad',
    items: [
      { ar: 'لُبَان', translit: 'Lubān', en: 'Frankincense' },
      { ar: 'زَعْفَرَان', translit: 'Zaʿfarān', en: 'Saffron' },
      { ar: 'عَنْبَر', translit: 'ʿAnbar', en: 'Ambergris' },
    ],
  },
  6: {
    zodiacEn: 'Virgo',
    zodiacAr: 'العذراء',
    zodiacTranslit: 'al-ʿAdhrāʾ',
    items: [
      { ar: 'مَسْتَكَى', translit: 'Mastakā', en: 'Mastic' },
      { ar: 'صَنْدَل', translit: 'Sandal', en: 'Sandalwood' },
    ],
  },
  7: {
    zodiacEn: 'Libra',
    zodiacAr: 'الميزان',
    zodiacTranslit: 'al-Mīzān',
    items: [
      { ar: 'وَرْد', translit: 'Ward', en: 'Rose' },
      { ar: 'مِسْك', translit: 'Misk', en: 'Musk' },
    ],
  },
  8: {
    zodiacEn: 'Scorpio',
    zodiacAr: 'العقرب',
    zodiacTranslit: 'al-ʿAqrab',
    items: [
      { ar: 'مُرّ', translit: 'Murr', en: 'Myrrh' },
      { ar: 'مِسْك', translit: 'Misk', en: 'Musk' },
      { ar: 'عُود', translit: 'ʿŪd', en: 'Agarwood/Oud' },
    ],
  },
  9: {
    zodiacEn: 'Sagittarius',
    zodiacAr: 'القوس',
    zodiacTranslit: 'al-Qaws',
    items: [
      { ar: 'جَوْزَة الطِّيب', translit: 'Jawzat al-Ṭīb', en: 'Nutmeg' },
      { ar: 'صَنْدَل', translit: 'Sandal', en: 'Sandalwood' },
    ],
  },
  10: {
    zodiacEn: 'Capricorn',
    zodiacAr: 'الجدي',
    zodiacTranslit: 'al-Jady',
    items: [
      { ar: 'مُرّ', translit: 'Murr', en: 'Myrrh' },
      { ar: 'صَبْر', translit: 'Ṣabr', en: 'Aloe' },
    ],
  },
  11: {
    zodiacEn: 'Aquarius',
    zodiacAr: 'الدلو',
    zodiacTranslit: 'al-Dalw',
    items: [
      { ar: 'لُبَان', translit: 'Lubān', en: 'Frankincense' },
      { ar: 'صَمْغ عَرَبِي', translit: 'Ṣamgh ʿArabī', en: 'Gum Arabic' },
    ],
  },
  12: {
    zodiacEn: 'Pisces',
    zodiacAr: 'الحوت',
    zodiacTranslit: 'al-Ḥūt',
    items: [
      { ar: 'عَنْبَر', translit: 'ʿAnbar', en: 'Ambergris' },
      { ar: 'صَنْدَل', translit: 'Sandal', en: 'Sandalwood' },
    ],
  },
};

function withAlpha(color: string, alpha01: number): string {
  const alpha = Math.max(0, Math.min(1, alpha01));
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

const PRACTICE_WINDOW_DURATION_MINUTES = 6 * 60;

const DAY_TO_INDEX: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,

  // French
  dimanche: 0,
  lundi: 1,
  mardi: 2,
  mercredi: 3,
  jeudi: 4,
  vendredi: 5,
  samedi: 6,
};

function parsePracticeDays(text: string | undefined | null): number[] {
  if (!text) return [];
  const lowered = text.toLowerCase();
  const found = new Set<number>();

  // Match day words as whole words.
  for (const [day, idx] of Object.entries(DAY_TO_INDEX)) {
    const re = new RegExp(`\\b${day}\\b`, 'i');
    if (re.test(lowered)) found.add(idx);
  }

  return Array.from(found);
}

function nextOccurrenceAtMidnight(now: Date, targetDow: number): Date {
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  const todayDow = startOfToday.getDay();
  const delta = (targetDow - todayDow + 7) % 7;
  const next = new Date(startOfToday);
  next.setDate(startOfToday.getDate() + delta);
  next.setHours(0, 0, 0, 0);
  return next;
}

function formatCountdown(ms: number, language: string): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (language === 'ar') {
    if (days > 0) return `${days}ي ${hours}س ${minutes}د`;
    if (hours > 0) return `${hours}س ${minutes}د`;
    return `${minutes}د`;
  }

  // en/fr compact
  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
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

export default function SpiritualPracticeTab({ result }: SpiritualPracticeTabProps) {
  const { language } = useLanguage();
  const profile = result.burujProfile;
  const elementKey = profile.element.toLowerCase() as "fire" | "earth" | "air" | "water";
  const colors = getElementColors(elementKey);
  const accentColor = colors.accent;
  const spiritual_practice = profile.spiritual_practice;
  const zodiac = getZodiacSign(result.burujRemainder);
  const totalHadadValue = result.combinedTotal;
  const ritualEssence = RITUAL_ESSENCES_BY_BURUJ[result.burujRemainder];

  const cardSurface = {
    backgroundColor: withAlpha(accentColor, 0.14),
    borderColor: withAlpha(accentColor, 0.20),
    shadowColor: accentColor,
  };
  const smallCardSurface = {
    backgroundColor: withAlpha(accentColor, 0.12),
    borderColor: withAlpha(accentColor, 0.20),
    shadowColor: accentColor,
  };
  
  const [activeType, setActiveType] = useState<PracticeType>("divine");
  const [showInstructions, setShowInstructions] = useState(false);
  const [showAngelsJinn, setShowAngelsJinn] = useState(true);
  const [showQuranicVerse, setShowQuranicVerse] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);
  const [showDhikrCounter, setShowDhikrCounter] = useState(false);
  const [showAllEssences, setShowAllEssences] = useState(false);
  const [now, setNow] = useState<Date>(() => new Date());
  const [reminderId, setReminderId] = useState<string | null>(null);
  const [reminderPending, setReminderPending] = useState(false);

  const [prepChecklist, setPrepChecklist] = useState<Record<string, boolean>>({
    intention: false,
    wudu: false,
    quietSpace: false,
    phoneSilent: false,
    incenseOrAttar: false,
    tasbih: false,
    muhasabaNotes: false,
  });

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  const practiceWindow = useMemo(() => {
    const primaryEn = spiritual_practice.practice_night?.primary?.en;
    const noteEn = spiritual_practice.practice_night?.note?.en;

    const days = [
      ...parsePracticeDays(noteEn),
      ...parsePracticeDays(primaryEn),
    ].filter((v, i, arr) => arr.indexOf(v) === i);

    if (days.length === 0) {
      return {
        nextStart: null as Date | null,
        isActiveNow: false,
        countdownMs: null as number | null,
        mode: 'none' as 'none' | 'starts' | 'ends',
      };
    }

    // Choose the earliest upcoming start among all candidate days.
    const candidates = days
      .map((dow) => {
        const start = nextOccurrenceAtMidnight(now, dow);
        const end = new Date(start);
        end.setMinutes(end.getMinutes() + PRACTICE_WINDOW_DURATION_MINUTES);

        const isToday = start.getTime() === new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).getTime();
        const isActiveNow = isToday && now.getHours() < 6; // midnight → ~Fajr (approx)

        const effectiveStart = isActiveNow ? new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000) : start;
        return { start, end, effectiveStart, isActiveNow };
      })
      .sort((a, b) => a.effectiveStart.getTime() - b.effectiveStart.getTime());

    const chosen = candidates[0];
    const countdownMs = chosen.isActiveNow
      ? (chosen.end.getTime() - now.getTime())
      : (chosen.effectiveStart.getTime() - now.getTime());

    return {
      nextStart: chosen.isActiveNow ? chosen.effectiveStart : chosen.effectiveStart,
      isActiveNow: chosen.isActiveNow,
      countdownMs,
      mode: chosen.isActiveNow ? 'ends' : 'starts',
    };
  }, [now, spiritual_practice.practice_night]);

  const onTogglePrep = (key: string) => {
    setPrepChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
  };

  const onRemindMe = async () => {
    if (!practiceWindow.nextStart) {
      Alert.alert(
        language === 'fr' ? 'Impossible de programmer' : language === 'ar' ? 'تعذّر الجدولة' : 'Unable to schedule',
        language === 'fr'
          ? 'Aucune prochaine fenêtre de pratique détectée.'
          : language === 'ar'
            ? 'لم يتم العثور على نافذة ممارسة قادمة.'
            : 'No upcoming practice window could be determined.'
      );
      return;
    }

    if (reminderPending) return;

    if (reminderId) {
      setReminderPending(true);
      try {
        await NotificationService.cancelNotification(reminderId);
        setReminderId(null);
        Alert.alert(
          language === 'fr' ? 'Rappel annulé' : language === 'ar' ? 'تم إلغاء التذكير' : 'Reminder cancelled',
          language === 'fr'
            ? 'Le rappel de pratique a été annulé.'
            : language === 'ar'
              ? 'تم إلغاء تذكير الممارسة.'
              : 'Practice reminder cancelled.'
        );
      } finally {
        setReminderPending(false);
      }
      return;
    }

    setReminderPending(true);
    try {
      const granted = await NotificationService.requestNotificationPermissions();
      if (!granted) {
        Alert.alert(
          language === 'fr' ? 'Notifications désactivées' : language === 'ar' ? 'الإشعارات معطّلة' : 'Notifications disabled',
          language === 'fr'
            ? 'Activez les notifications pour recevoir un rappel.'
            : language === 'ar'
              ? 'فعّل الإشعارات لتلقي تذكير.'
              : 'Enable notifications to receive a reminder.'
        );
        return;
      }

      const title = language === 'fr'
        ? 'Fenêtre de pratique'
        : language === 'ar'
          ? 'نافذة الممارسة'
          : 'Practice Window';
      const body = language === 'fr'
        ? 'Votre fenêtre de pratique commence maintenant (après minuit jusqu’à Fajr).'
        : language === 'ar'
          ? 'تبدأ نافذة الممارسة الآن (بعد منتصف الليل حتى الفجر).'
          : 'Your practice window begins now (after midnight until Fajr).';

      const id = await NotificationService.scheduleNotification(
        NotificationCategory.ZIKR_REMINDER,
        title,
        body,
        practiceWindow.nextStart,
        {
          type: 'practice-window',
          burujRemainder: result.burujRemainder,
        },
        {
          ignoreQuietHours: true,
          ignoreCategoryToggle: true,
        }
      );

      if (!id) {
        Alert.alert(
          language === 'fr' ? 'Rappel non programmé' : language === 'ar' ? 'لم يتم ضبط التذكير' : 'Reminder not set',
          language === 'fr'
            ? 'Vérifiez vos réglages de notifications et les heures calmes.'
            : language === 'ar'
              ? 'تحقق من إعدادات الإشعارات وساعات الهدوء.'
              : 'Check your notification settings and quiet hours.'
        );
        return;
      }

      setReminderId(id);
      Alert.alert(
        language === 'fr' ? 'Rappel programmé' : language === 'ar' ? 'تم ضبط التذكير' : 'Reminder set',
        language === 'fr'
          ? 'Nous vous rappellerons au début de la prochaine fenêtre.'
          : language === 'ar'
            ? 'سنذكّرك عند بداية النافذة القادمة.'
            : 'We’ll remind you at the start of the next window.'
      );
    } finally {
      setReminderPending(false);
    }
  };

  const handleCopy = async (text: string, type: string) => {
    try {
      await Clipboard.setStringAsync(text);
      setCopied(type);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const switchType = async (type: PracticeType) => {
    setActiveType(type);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: withAlpha(accentColor, 0.18), borderColor: withAlpha(accentColor, 0.25) }]}>
          <Moon size={32} color={accentColor} />
        </View>
        <Text style={styles.title}>
          {language === 'en' ? 'Spiritual Practices' : 'Pratiques Spirituelles'}
        </Text>
        <Text style={styles.subtitle}>
          {language === 'en' 
            ? 'Sacred practices aligned with your spiritual nature' 
            : 'Pratiques sacrées alignées avec votre nature spirituelle'}
        </Text>
      </View>

      {/* Practice Type Selector */}
      <View style={styles.typeSelector}>
        <TouchableOpacity
          style={[
            styles.typeButton,
            { backgroundColor: withAlpha(accentColor, 0.10), borderColor: withAlpha(accentColor, 0.18) },
            activeType === 'divine' && [styles.typeButtonActive, { borderColor: withAlpha(accentColor, 0.35), backgroundColor: withAlpha(accentColor, 0.18) }],
          ]}
          onPress={() => switchType('divine')}
        >
          <Sparkles size={20} color={activeType === 'divine' ? accentColor : '#9ca3af'} />
          <Text style={[styles.typeButtonText, activeType === 'divine' && { color: accentColor }]}>
            {language === 'en' ? 'Divine Names' : 'Noms Divins'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.typeButton,
            { backgroundColor: withAlpha(accentColor, 0.10), borderColor: withAlpha(accentColor, 0.18) },
            activeType === 'monthly' && [styles.typeButtonActive, { borderColor: withAlpha(accentColor, 0.35), backgroundColor: withAlpha(accentColor, 0.18) }],
          ]}
          onPress={() => switchType('monthly')}
        >
          <Calendar size={20} color={activeType === 'monthly' ? accentColor : '#9ca3af'} />
          <Text style={[styles.typeButtonText, activeType === 'monthly' && { color: accentColor }]}>
            {language === 'en' ? 'Monthly' : 'Mensuel'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.typeButton,
            { backgroundColor: withAlpha(accentColor, 0.10), borderColor: withAlpha(accentColor, 0.18) },
            activeType === 'lifetime' && [styles.typeButtonActive, { borderColor: withAlpha(accentColor, 0.35), backgroundColor: withAlpha(accentColor, 0.18) }],
          ]}
          onPress={() => switchType('lifetime')}
        >
          <Star size={20} color={activeType === 'lifetime' ? accentColor : '#9ca3af'} />
          <Text style={[styles.typeButtonText, activeType === 'lifetime' && { color: accentColor }]}>
            {language === 'en' ? 'Lifetime' : 'Vie'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Divine Names Practice */}
      {activeType === 'divine' && (
        <View>
          {/* Practice Night Info */}
          {spiritual_practice.practice_night && (
            <PatternCard style={[styles.card, cardSurface]}>
              <View style={styles.cardHeader}>
                <Moon size={24} color={accentColor} />
                <Text style={[styles.cardTitle, { color: accentColor }]}>
                  {language === 'en' ? 'Practice Night' : 'Nuit de Pratique'}
                </Text>
                {practiceWindow.isActiveNow && (
                  <View style={[styles.statusPill, { borderColor: withAlpha(accentColor, 0.35), backgroundColor: withAlpha(accentColor, 0.14) }]}>
                    <Text style={[styles.statusPillText, { color: accentColor }]}>
                      {language === 'fr' ? 'ACTIF' : language === 'ar' ? 'نشط الآن' : 'ACTIVE NOW'}
                    </Text>
                  </View>
                )}
              </View>
              <Text style={styles.practiceNight}>
                {spiritual_practice.practice_night.primary[language as 'en' | 'fr']}
              </Text>
              <Text style={styles.practiceTimingHint}>
                {language === 'fr'
                  ? 'Fenêtre : après minuit → Fajr'
                  : language === 'ar'
                    ? 'النافذة: بعد منتصف الليل → الفجر'
                    : 'Window: after midnight → Fajr'}
              </Text>

              {practiceWindow.nextStart && (
                <View style={styles.practiceNextRow}>
                  <Text style={styles.practiceNextLabel}>
                    {language === 'fr' ? 'Prochaine:' : language === 'ar' ? 'التالي:' : 'Next:'}
                  </Text>
                  <Text style={styles.practiceNextValue}>
                    {practiceWindow.nextStart.toLocaleDateString(
                      language === 'fr' ? 'fr-FR' : language === 'ar' ? 'ar' : 'en-US',
                      { weekday: 'long', month: 'short', day: 'numeric' }
                    )} • 12:00 AM – {language === 'fr' ? 'Fajr' : language === 'ar' ? 'الفجر' : 'Fajr'}
                  </Text>
                </View>
              )}

              {typeof practiceWindow.countdownMs === 'number' && practiceWindow.countdownMs >= 0 && (
                <Text style={styles.countdownText}>
                  {practiceWindow.mode === 'ends'
                    ? (language === 'fr' ? 'Se termine dans ' : language === 'ar' ? 'ينتهي خلال ' : 'Ends in ')
                    : (language === 'fr' ? 'Commence dans ' : language === 'ar' ? 'يبدأ خلال ' : 'Starts in ')}
                  {formatCountdown(practiceWindow.countdownMs, language)}
                </Text>
              )}

              <TouchableOpacity
                style={[styles.remindButton, { borderColor: withAlpha(accentColor, 0.22), backgroundColor: withAlpha(accentColor, 0.12) }]}
                onPress={onRemindMe}
                activeOpacity={0.85}
                disabled={reminderPending}
              >
                <Text style={[styles.remindButtonText, { color: accentColor }]}>
                  {reminderId
                    ? (language === 'fr' ? 'Annuler le rappel' : language === 'ar' ? 'إلغاء التذكير' : 'Cancel reminder')
                    : (language === 'fr' ? 'Me rappeler' : language === 'ar' ? 'ذكّرني' : 'Remind me')}
                </Text>
              </TouchableOpacity>

              {spiritual_practice.practice_night.note && (
                <Text style={styles.practiceNote}>
                  {spiritual_practice.practice_night.note[language as 'en' | 'fr']}
                </Text>
              )}
            </PatternCard>
          )}

          {/* Zodiac Sign (personal; always a single sign from remainder) */}
          {zodiac && (
            <PatternCard style={[styles.card, cardSurface]}>
              <View style={styles.cardHeader}>
                <Star size={24} color={accentColor} />
                <Text style={[styles.cardTitle, { color: accentColor }]}>
                  {language === 'en' ? 'Your Zodiac Sign' : 'Votre Signe Zodiacal'}
                </Text>
              </View>
              <View style={styles.zodiacContent}>
                <Text style={styles.zodiacText}>
                  {language === 'fr' ? zodiac.nameFr : zodiac.nameEn}
                </Text>
                <Text style={styles.zodiacArabic}>
                  {zodiac.nameAr}
                </Text>
              </View>
            </PatternCard>
          )}

          {/* Classical Ritual Essences by Zodiac (below zodiac card) */}
          {ritualEssence && (
            <PatternCard style={[styles.card, cardSurface]}>
              <View style={styles.cardHeader}>
                <Text style={styles.essenceEmoji}>🔥</Text>
                <View style={styles.essenceHeaderTextWrap}>
                  <Text style={[styles.cardTitle, { color: accentColor }]}>
                    {language === 'ar' ? 'جوهر الطقس' : language === 'fr' ? 'Essence rituelle' : 'Ritual Essence'}
                  </Text>
                  <Text style={styles.essenceSubtitle}>
                    {(language === 'fr' ? zodiac?.nameFr : zodiac?.nameEn) || ritualEssence.zodiacEn} ({ritualEssence.zodiacTranslit})
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => setShowAllEssences(v => !v)}
                  style={[
                    styles.essenceToggle,
                    {
                      borderColor: withAlpha(accentColor, 0.22),
                      backgroundColor: withAlpha(accentColor, 0.10),
                    },
                  ]}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.essenceToggleText, { color: accentColor }]}>
                    {showAllEssences
                      ? (language === 'ar' ? 'إخفاء' : language === 'fr' ? 'Masquer' : 'Hide')
                      : (language === 'ar' ? 'كل الأبراج' : language === 'fr' ? 'Tous' : 'All')}
                  </Text>
                  {showAllEssences ? (
                    <ChevronUp size={16} color={accentColor} />
                  ) : (
                    <ChevronDown size={16} color={accentColor} />
                  )}
                </TouchableOpacity>
              </View>

              <Text style={styles.essenceArabic}>{ritualEssence.items.map(i => i.ar).join(' • ')}</Text>
              <Text style={styles.essenceTranslit}>{ritualEssence.items.map(i => i.translit).join(' • ')}</Text>
              <Text style={styles.essenceTranslation}>{ritualEssence.items.map(i => i.en).join(' • ')}</Text>

              <Text style={styles.essenceUsageNote}>
                {language === 'ar'
                  ? 'يُستخدم كبخور أو عطر أثناء الذكر والممارسة الروحية'
                  : language === 'fr'
                    ? 'À brûler comme encens (ou utiliser en parfum) pendant la pratique spirituelle'
                    : 'Burn as incense (or wear as attar) during spiritual practice'}
              </Text>

              <Text style={styles.essenceExtraNote}>
                {language === 'ar'
                  ? 'إضافات شائعة في العطور التقليدية: بُخُور • عِطْر • ماء الورد'
                  : language === 'fr'
                    ? "Ajouts courants en parfumerie traditionnelle : Bukhūr • ʿIṭr (attar) • Eau de rose"
                    : 'Common additions in traditional perfumery: Bukhūr • ʿIṭr (attar) • Rose water'}
              </Text>

              <View style={styles.essenceHowToWrap}>
                <Text style={styles.essenceHowToTitle}>
                  {language === 'fr' ? 'Comment utiliser' : language === 'ar' ? 'طريقة الاستخدام' : 'How to use'}
                </Text>
                <Text style={styles.essenceHowToText}>
                  {language === 'fr'
                    ? '• Petite quantité (fumigation légère)\n• Intention + basmalah, puis dhikr\n• Aérez la pièce après'
                    : language === 'ar'
                      ? '• كمية قليلة (تبخير خفيف)\n• نية + بسملة ثم ذكر\n• تهوية المكان بعد ذلك'
                      : '• Use a small amount (light smoke)\n• Intention + basmalah, then dhikr\n• Ventilate afterwards'}
                </Text>
              </View>

              {showAllEssences && (
                <View style={styles.essenceAllList}>
                  {Object.entries(RITUAL_ESSENCES_BY_BURUJ).map(([idx, entry]) => {
                    const isUserSign = Number(idx) === result.burujRemainder;
                    return (
                      <View
                        key={idx}
                        style={[
                          styles.essenceRow,
                          { borderColor: isUserSign ? withAlpha(accentColor, 0.38) : withAlpha(accentColor, 0.14) },
                        ]}
                      >
                      <Text style={styles.essenceRowTitle}>
                        {entry.zodiacEn} ({entry.zodiacTranslit}){isUserSign ? ' ⭐' : ''}
                      </Text>
                      <Text style={styles.essenceRowArabic}>{entry.items.map(i => i.ar).join(' • ')}</Text>
                      <Text style={styles.essenceRowTranslit}>{entry.items.map(i => i.translit).join(' • ')}</Text>
                      <Text style={styles.essenceRowEn}>{entry.items.map(i => i.en).join(' • ')}</Text>
                      </View>
                    );
                  })}
                </View>
              )}
            </PatternCard>
          )}

          {/* Divine Names */}
          {'arabic' in spiritual_practice.divine_names && (
            <PatternCard style={[styles.card, cardSurface]}>
              <View style={styles.cardHeader}>
                <Sparkles size={24} color={accentColor} />
                <Text style={[styles.cardTitle, { color: accentColor }]}>
                  {language === 'en' ? 'Divine Names to Recite' : 'Noms Divins à Réciter'}
                </Text>
                <View style={[styles.countPill, { borderColor: colors.border }]}
                >
                  <Text style={[styles.countPillText, { color: accentColor }]}>
                    {totalHadadValue}×
                  </Text>
                </View>
              </View>
              
              <View style={styles.divineNamesContent}>
                {(() => {
                  const arabic = spiritual_practice.divine_names.arabic;
                  const names = arabic
                    .split(/[\n،,]+/g)
                    .map((s) => s.trim())
                    .filter(Boolean);

                  return (
                    <>
                      <View style={styles.arabicRow}>
                        <Text style={styles.arabicText}>{arabic}</Text>
                        <TouchableOpacity onPress={() => handleCopy(arabic, 'divineNames')}>
                          {copied === 'divineNames' ? (
                            <Check size={20} color="#4ade80" />
                          ) : (
                            <Copy size={20} color="#FFF" />
                          )}
                        </TouchableOpacity>
                      </View>

                      {names.length > 1 && (
                        <View style={styles.zikrList}>
                          {names.map((name, idx) => (
                            <View key={`${name}-${idx}`} style={[styles.zikrRow, { borderColor: colors.border }]}>
                              <Text style={styles.zikrNameArabic}>{name}</Text>
                              <View style={[styles.zikrCountBadge, { backgroundColor: withAlpha(accentColor, 0.12), borderColor: withAlpha(accentColor, 0.25) }]}>
                                <Text style={[styles.zikrCountText, { color: accentColor }]}>
                                  {totalHadadValue}
                                </Text>
                              </View>
                            </View>
                          ))}
                        </View>
                      )}

                      {names.length <= 1 && (
                        <View style={styles.singleCountRow}>
                          <Text style={styles.singleCountLabel}>
                            {language === 'en' ? 'Recite this name:' : 'Récitez ce nom :'}
                          </Text>
                          <Text style={[styles.singleCountValue, { color: colors.accent }]}>
                            {totalHadadValue}
                          </Text>
                        </View>
                      )}
                    </>
                  );
                })()}
                <Text style={[styles.transliteration, { color: withAlpha(accentColor, 0.9) }]}>{spiritual_practice.divine_names.transliteration}</Text>
                <Text style={styles.translation}>
                  {spiritual_practice.divine_names.translation[language as 'en' | 'fr']}
                </Text>
              </View>

              <TouchableOpacity
                style={[styles.dhikrButton, { backgroundColor: withAlpha(accentColor, 0.16), borderColor: withAlpha(accentColor, 0.22) }]}
                onPress={() => setShowDhikrCounter(!showDhikrCounter)}
              >
                <Target size={20} color={accentColor} />
                <Text style={[styles.dhikrButtonText, { color: accentColor }]}>
                  {showDhikrCounter 
                    ? (language === 'en' ? 'Hide Counter' : 'Masquer Compteur')
                    : (language === 'en' ? 'Start Dhikr Counter' : 'Démarrer Compteur')}
                </Text>
              </TouchableOpacity>
            </PatternCard>
          )}

          {/* Dhikr Counter */}
          {showDhikrCounter && 'arabic' in spiritual_practice.divine_names && (
            <DhikrCounter
              targetCount={totalHadadValue}
              divineNames={spiritual_practice.divine_names}
              quranicVerse={spiritual_practice.quranic_verse}
              angel={spiritual_practice.angel}
              jinn={spiritual_practice.jinn}
              practiceNight={spiritual_practice.practice_night}
              zodiacSign={zodiac ? { en: zodiac.nameEn, fr: zodiac.nameFr, arabic: zodiac.nameAr } : undefined}
              instructions={spiritual_practice.instructions}
              elementColors={colors}
            />
          )}

          {/* Quranic Verse */}
          {showQuranicVerse && spiritual_practice.quranic_verse && (
            <PatternCard style={[styles.card, cardSurface]}>
              <TouchableOpacity
                style={styles.collapsibleHeader}
                onPress={() => setShowQuranicVerse(!showQuranicVerse)}
              >
                <View style={styles.cardHeader}>
                  <BookOpen size={24} color={accentColor} />
                  <Text style={[styles.cardTitle, { color: accentColor }]}>
                    {language === 'en' ? 'Quranic Verse' : 'Verset Coranique'}
                  </Text>
                  <View style={[styles.countPill, { borderColor: colors.border }]}>
                    <Text style={[styles.countPillText, { color: accentColor }]}>
                      {totalHadadValue}×
                    </Text>
                  </View>
                </View>
                {showQuranicVerse ? <ChevronUp size={20} color="#FFF" /> : <ChevronDown size={20} color="#FFF" />}
              </TouchableOpacity>

              <View style={styles.verseContent}>
                <View style={styles.arabicRow}>
                  <Text style={styles.verseArabic}>{spiritual_practice.quranic_verse?.arabic}</Text>
                  <TouchableOpacity onPress={() => spiritual_practice.quranic_verse && handleCopy(spiritual_practice.quranic_verse.arabic, 'verse')}>
                    {copied === 'verse' ? (
                      <Check size={20} color="#4ade80" />
                    ) : (
                      <Copy size={20} color="#FFF" />
                    )}
                  </TouchableOpacity>
                </View>
                <Text style={[styles.verseTransliteration, { color: withAlpha(accentColor, 0.9) }]}>{spiritual_practice.quranic_verse?.transliteration}</Text>
                <Text style={styles.verseTranslation}>
                  {spiritual_practice.quranic_verse?.translation[language as 'en' | 'fr']}
                </Text>
                <Text style={styles.verseReference}>({spiritual_practice.quranic_verse?.reference})</Text>
              </View>
            </PatternCard>
          )}

          {/* Angels & Jinn */}
          {showAngelsJinn && (
            <View style={styles.row}>
              {spiritual_practice.angel && (
                <PatternCard style={[styles.smallCard, smallCardSurface]}>
                  <View style={styles.smallCardHeader}>
                    <Shield size={20} color={accentColor} />
                    <Text style={[styles.smallCardTitle, { color: accentColor }]}>
                      {language === 'en' ? 'Angel' : 'Ange'}
                    </Text>
                    <View style={[styles.countPill, { borderColor: colors.border }]}>
                      <Text style={[styles.countPillText, { color: accentColor }]}>
                        {totalHadadValue}×
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.angelArabic}>{spiritual_practice.angel.arabic}</Text>
                  <Text style={[styles.angelTransliteration, { color: withAlpha(accentColor, 0.9) }]}>{spiritual_practice.angel.transliteration}</Text>
                  {spiritual_practice.angel.name && (
                    <Text style={styles.angelName}>
                      {spiritual_practice.angel.name[language as 'en' | 'fr']}
                    </Text>
                  )}
                </PatternCard>
              )}

              {spiritual_practice.jinn && (
                <PatternCard style={[styles.smallCard, smallCardSurface]}>
                  <View style={styles.smallCardHeader}>
                    <Zap size={20} color={accentColor} />
                    <Text style={[styles.smallCardTitle, { color: accentColor }]}>
                      {language === 'en' ? 'Jinn' : 'Djinn'}
                    </Text>
                    <View style={[styles.countPill, { borderColor: colors.border }]}>
                      <Text style={[styles.countPillText, { color: accentColor }]}>
                        {totalHadadValue}×
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.angelArabic}>{spiritual_practice.jinn.arabic}</Text>
                  <Text style={[styles.angelTransliteration, { color: withAlpha(accentColor, 0.9) }]}>{spiritual_practice.jinn.transliteration}</Text>
                  {spiritual_practice.jinn.meaning && (
                    <Text style={styles.angelName}>
                      {spiritual_practice.jinn.meaning[language as 'en' | 'fr']}
                    </Text>
                  )}
                </PatternCard>
              )}
            </View>
          )}

          {/* Instructions */}
          <PatternCard style={[styles.card, cardSurface]}>
            <View style={styles.cardHeader}>
              <CheckSquare size={24} color={accentColor} />
              <Text style={[styles.cardTitle, { color: accentColor }]}>
                {language === 'fr' ? 'Adab & préparation' : language === 'ar' ? 'الآداب والتهيئة' : 'Adab & Preparation'}
              </Text>
            </View>

            {[
              { key: 'intention', label: language === 'fr' ? 'Définir l’intention (niyyah)' : language === 'ar' ? 'تحديد النية' : 'Set intention (niyyah)' },
              { key: 'wudu', label: language === 'fr' ? 'Ablutions (wudu)' : language === 'ar' ? 'الوضوء' : 'Wudu (ablution)' },
              { key: 'quietSpace', label: language === 'fr' ? 'Espace calme, lumière douce' : language === 'ar' ? 'مكان هادئ وإضاءة لطيفة' : 'Quiet space, dim light' },
              { key: 'phoneSilent', label: language === 'fr' ? 'Téléphone en silencieux' : language === 'ar' ? 'الهاتف على الصامت' : 'Phone on silent' },
              { key: 'incenseOrAttar', label: language === 'fr' ? 'Encens/attar prêt (optionnel)' : language === 'ar' ? 'بخور/عطر جاهز (اختياري)' : 'Incense/attar ready (optional)' },
              { key: 'tasbih', label: language === 'fr' ? 'Tasbih/compteur prêt (optionnel)' : language === 'ar' ? 'مسبحة/عداد جاهز (اختياري)' : 'Tasbih/counter ready (optional)' },
              { key: 'muhasabaNotes', label: language === 'fr' ? 'Carnet pour muhasaba (optionnel)' : language === 'ar' ? 'دفتر للمحاسبة (اختياري)' : 'Notes for muhasaba (optional)' },
            ].map((item) => {
              const checked = !!prepChecklist[item.key];
              return (
                <TouchableOpacity
                  key={item.key}
                  onPress={() => onTogglePrep(item.key)}
                  style={[styles.prepRow, { borderColor: withAlpha(accentColor, 0.14) }]}
                  activeOpacity={0.85}
                >
                  <View style={[styles.prepBox, { borderColor: withAlpha(accentColor, 0.35), backgroundColor: checked ? withAlpha(accentColor, 0.14) : 'transparent' }]}>
                    {checked ? <Check size={16} color={accentColor} /> : null}
                  </View>
                  <Text style={styles.prepLabel}>{item.label}</Text>
                </TouchableOpacity>
              );
            })}
          </PatternCard>

          {spiritual_practice.instructions && (
            <PatternCard style={[styles.card, cardSurface]}>
              <TouchableOpacity
                style={styles.collapsibleHeader}
                onPress={() => setShowInstructions(!showInstructions)}
              >
                <View style={styles.cardHeader}>
                  <CheckSquare size={24} color={accentColor} />
                  <Text style={[styles.cardTitle, { color: accentColor }]}>
                    {language === 'en' ? 'Practice Instructions' : 'Instructions de Pratique'}
                  </Text>
                </View>
                {showInstructions ? <ChevronUp size={20} color="#FFF" /> : <ChevronDown size={20} color="#FFF" />}
              </TouchableOpacity>

              {showInstructions && (
                <View style={styles.instructionsContent}>
                  {spiritual_practice.instructions[language as 'en' | 'fr'].map((instruction, idx) => (
                    <View key={idx} style={styles.instructionItem}>
                      <View style={[styles.instructionNumber, { backgroundColor: colors.background }]}>
                        <Text style={[styles.instructionNumberText, { color: accentColor }]}>
                          {idx + 1}
                        </Text>
                      </View>
                      <Text style={styles.instructionText}>{instruction}</Text>
                    </View>
                  ))}
                </View>
              )}
            </PatternCard>
          )}
        </View>
      )}

      {/* Monthly Sadaqah */}
      {activeType === 'monthly' && profile.sadaqah.monthly && (
        <View>
          <PatternCard style={[styles.card, cardSurface]}>
            <View style={styles.cardHeader}>
              <Gift size={24} color={accentColor} />
              <Text style={[styles.cardTitle, { color: accentColor }]}>
                {language === 'en' ? 'Monthly Sadaqah' : 'Sadaqah Mensuelle'}
              </Text>
            </View>

            <View style={styles.sadaqahSection}>
              <Text style={styles.sectionLabel}>
                {language === 'en' ? 'Traditional:' : 'Traditionnel:'}
              </Text>
              <Text style={styles.sadaqahText}>
                {profile.sadaqah.monthly.traditional[language as 'en' | 'fr']}
              </Text>
            </View>

            <View style={styles.sadaqahSection}>
              <Text style={styles.sectionLabel}>
                {language === 'en' ? 'Frequency:' : 'Fréquence:'}
              </Text>
              <Text style={styles.sadaqahText}>
                {profile.sadaqah.monthly.frequency[language as 'en' | 'fr']}
              </Text>
            </View>

            <View style={styles.sadaqahSection}>
              <Text style={styles.sectionLabel}>
                {language === 'en' ? 'Purpose:' : 'Objectif:'}
              </Text>
              <Text style={styles.sadaqahText}>
                {profile.sadaqah.monthly.purpose?.[language as 'en' | 'fr'] || ''}
              </Text>
            </View>

            {profile.sadaqah.monthly.modern_alternatives && (
              <View style={styles.alternativesSection}>
                <Text style={styles.alternativesTitle}>
                  {language === 'en' ? 'Modern Alternatives:' : 'Alternatives Modernes:'}
                </Text>
                {profile.sadaqah.monthly.modern_alternatives[language as 'en' | 'fr'].map((alt, idx) => (
                  <View key={idx} style={styles.alternativeItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.alternativeText}>{alt}</Text>
                  </View>
                ))}
              </View>
            )}
          </PatternCard>
        </View>
      )}

      {/* Lifetime Offering */}
      {activeType === 'lifetime' && profile.sadaqah.lifetime && (
        <View>
          <PatternCard style={[styles.card, cardSurface]}>
            <View style={styles.cardHeader}>
              <Star size={24} color={accentColor} />
              <Text style={[styles.cardTitle, { color: accentColor }]}>
                {language === 'en' ? 'Lifetime Sacred Offering' : 'Offrande Sacrée de Vie'}
              </Text>
            </View>

            <View style={styles.lifetimeContent}>
              <Text style={styles.lifetimeTraditional}>
                {profile.sadaqah.lifetime.traditional[language as 'en' | 'fr']}
              </Text>

              {profile.sadaqah.lifetime.components && (
                <View style={styles.componentsSection}>
                  <Text style={styles.componentsTitle}>
                    {language === 'en' ? 'Components:' : 'Composants:'}
                  </Text>
                  {profile.sadaqah.lifetime.components[language as 'en' | 'fr'].map((comp, idx) => (
                    <View key={idx} style={styles.componentItem}>
                      <CheckSquare size={16} color={accentColor} />
                      <Text style={styles.componentText}>{comp}</Text>
                    </View>
                  ))}
                </View>
              )}

              {profile.sadaqah.lifetime.best_timing && (
                <View style={styles.timingSection}>
                  <Text style={styles.timingTitle}>
                    ⏰ {language === 'en' ? 'Best Timing:' : 'Meilleur Moment:'}
                  </Text>
                  {profile.sadaqah.lifetime.best_timing[language as 'en' | 'fr'].map((timing, idx) => (
                    <Text key={idx} style={styles.timingText}>• {timing}</Text>
                  ))}
                </View>
              )}

              {profile.sadaqah.lifetime.significance && (
                <View style={styles.significanceSection}>
                  <Text style={styles.significanceTitle}>
                    {language === 'en' ? 'Spiritual Significance:' : 'Signification Spirituelle:'}
                  </Text>
                  <Text style={styles.significanceText}>
                    {profile.sadaqah.lifetime.significance[language as 'en' | 'fr']}
                  </Text>
                </View>
              )}
            </View>
          </PatternCard>
        </View>
      )}
    </ScrollView>
  );
}

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
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(30, 58, 138, 0.2)',
    borderWidth: 2,
    borderColor: 'rgba(96, 165, 250, 0.1)',
    minHeight: 48,
  },
  typeButtonActive: {
    borderWidth: 2,
    borderColor: 'rgba(96, 165, 250, 0.4)',
    backgroundColor: 'rgba(30, 58, 138, 0.4)',
  },
  typeButtonText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
  },
  card: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    marginBottom: 20,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  countPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
  },
  countPillText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  practiceNight: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 4,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  practiceTimingHint: {
    fontSize: 13,
    color: '#94a3b8',
    marginBottom: 10,
  },
  practiceNextRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  practiceNextLabel: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '700',
  },
  practiceNextValue: {
    fontSize: 13,
    color: '#e2e8f0',
    fontWeight: '600',
  },
  countdownText: {
    fontSize: 14,
    color: '#e2e8f0',
    fontWeight: '700',
    marginBottom: 10,
  },
  remindButton: {
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  remindButtonText: {
    fontSize: 14,
    fontWeight: '800',
  },
  practiceNote: {
    fontSize: 14,
    color: '#cbd5e1',
  },
  zodiacContent: {
    alignItems: 'center',
  },
  zodiacText: {
    fontSize: 18,
    color: '#FFF',
    marginBottom: 4,
  },
  zodiacArabic: {
    fontSize: 16,
    color: '#cbd5e1',
  },

  essenceEmoji: {
    fontSize: 22,
  },

  essenceHeaderTextWrap: {
    flex: 1,
    marginLeft: 10,
  },
  essenceSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: '#cbd5e1',
    opacity: 0.9,
  },
  essenceToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  essenceToggleText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  essenceArabic: {
    marginTop: 10,
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: 0.4,
    opacity: 0.95,
  },
  essenceTranslit: {
    marginTop: 8,
    fontSize: 13,
    color: '#e2e8f0',
    textAlign: 'center',
    opacity: 0.95,
  },
  essenceTranslation: {
    marginTop: 6,
    fontSize: 13,
    color: '#9ca3af',
    textAlign: 'center',
    opacity: 0.95,
  },
  essenceUsageNote: {
    marginTop: 12,
    fontSize: 12,
    color: '#cbd5e1',
    textAlign: 'center',
    opacity: 0.85,
  },
  essenceExtraNote: {
    marginTop: 8,
    fontSize: 12,
    color: '#e2e8f0',
    textAlign: 'center',
    opacity: 0.85,
  },

  essenceHowToWrap: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  essenceHowToTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
  },
  essenceHowToText: {
    fontSize: 13,
    color: '#e2e8f0',
    lineHeight: 18,
  },

  prepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  prepBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prepLabel: {
    flex: 1,
    fontSize: 14,
    color: '#ffffff',
  },
  essenceAllList: {
    marginTop: 14,
    gap: 10,
  },
  essenceRow: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  essenceRowTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#ffffff',
    opacity: 0.95,
  },
  essenceRowArabic: {
    marginTop: 6,
    fontSize: 15,
    color: '#ffffff',
    opacity: 0.9,
  },
  essenceRowTranslit: {
    marginTop: 4,
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.9,
  },
  essenceRowEn: {
    marginTop: 3,
    fontSize: 12,
    color: '#e2e8f0',
    opacity: 0.9,
  },
  divineNamesContent: {
    marginBottom: 16,
  },
  arabicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    minHeight: 44,
  },
  arabicText: {
    fontSize: 32,
    color: '#FFF',
    fontWeight: '600',
    flex: 1,
    lineHeight: 44,
  },
  zikrList: {
    marginTop: 12,
    gap: 8,
  },
  zikrRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  zikrNameArabic: {
    flex: 1,
    fontSize: 22,
    color: '#FFF',
    fontWeight: '600',
    textAlign: 'right',
  },
  zikrCountBadge: {
    minWidth: 56,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  zikrCountText: {
    fontSize: 14,
    fontWeight: '800',
  },
  singleCountRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.25)',
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  singleCountLabel: {
    fontSize: 14,
    color: '#cbd5e1',
  },
  singleCountValue: {
    fontSize: 16,
    fontWeight: '800',
  },
  transliteration: {
    fontSize: 18,
    color: '#93c5fd',
    marginBottom: 8,
    fontWeight: '500',
  },
  translation: {
    fontSize: 16,
    color: '#cbd5e1',
    lineHeight: 24,
  },
  dhikrButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    minHeight: 56,
  },
  dhikrButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  collapsibleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  verseContent: {
    gap: 8,
  },
  verseArabic: {
    fontSize: 28,
    color: '#FFF',
    lineHeight: 42,
    flex: 1,
    textAlign: 'right',
  },
  verseTransliteration: {
    fontSize: 16,
    color: '#93c5fd',
    fontStyle: 'italic',
  },
  verseTranslation: {
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 20,
  },
  verseReference: {
    fontSize: 12,
    color: '#94a3b8',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  smallCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    overflow: 'hidden',
  },
  smallCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  smallCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  angelArabic: {
    fontSize: 20,
    color: '#FFF',
    marginBottom: 4,
  },
  angelTransliteration: {
    fontSize: 14,
    color: '#93c5fd',
    marginBottom: 4,
  },
  angelName: {
    fontSize: 12,
    color: '#cbd5e1',
  },
  instructionsContent: {
    gap: 12,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  instructionNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructionNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 20,
    paddingTop: 6,
  },
  sadaqahSection: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#60a5fa',
    marginBottom: 4,
  },
  sadaqahText: {
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 20,
  },
  alternativesSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(96, 165, 250, 0.2)',
  },
  alternativesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#60a5fa',
    marginBottom: 8,
  },
  alternativeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  bullet: {
    fontSize: 16,
    color: '#60a5fa',
  },
  alternativeText: {
    flex: 1,
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 20,
  },
  lifetimeContent: {
    gap: 16,
  },
  lifetimeTraditional: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFF',
    lineHeight: 24,
  },
  componentsSection: {
    gap: 8,
  },
  componentsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#60a5fa',
    marginBottom: 4,
  },
  componentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  componentText: {
    flex: 1,
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 20,
  },
  timingSection: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: 12,
    padding: 12,
  },
  timingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#60a5fa',
    marginBottom: 8,
  },
  timingText: {
    fontSize: 13,
    color: '#cbd5e1',
    lineHeight: 20,
    marginBottom: 4,
  },
  significanceSection: {
    backgroundColor: 'rgba(30, 58, 138, 0.3)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.3)',
  },
  significanceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#60a5fa',
    marginBottom: 8,
  },
  significanceText: {
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 22,
  },

});
