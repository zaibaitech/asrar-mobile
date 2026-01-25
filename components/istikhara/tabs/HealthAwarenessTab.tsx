import { ChevronDown, ChevronUp, HeartPulse } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    LayoutAnimation,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    UIManager,
    View,
} from 'react-native';
import Svg, { Circle, Defs, Path, Pattern, Rect } from 'react-native-svg';
import { ZODIAC_HEALTH_DATA_BY_BURUJ } from '../../../constants/zodiacHealthData';
import { useLanguage } from '../../../contexts/LanguageContext';
import type { IstikharaCalculationResult } from '../../../services/istikhara/types';

interface HealthAwarenessTabProps {
  result: IstikharaCalculationResult;
}

type ZodiacLabel = {
  en: string;
  ar: string;
  translit: string;
};

const ZODIAC_LABELS_BY_BURUJ: Record<number, ZodiacLabel> = {
  1: { en: 'Aries', ar: 'الحمل', translit: 'al-Ḥamal' },
  2: { en: 'Taurus', ar: 'الثور', translit: 'al-Thawr' },
  3: { en: 'Gemini', ar: 'الجوزاء', translit: "al-Jawzā'" },
  4: { en: 'Cancer', ar: 'السرطان', translit: 'al-Saraṭān' },
  5: { en: 'Leo', ar: 'الأسد', translit: 'al-Asad' },
  6: { en: 'Virgo', ar: 'العذراء', translit: 'al-ʿAdhrāʾ' },
  7: { en: 'Libra', ar: 'الميزان', translit: 'al-Mīzān' },
  8: { en: 'Scorpio', ar: 'العقرب', translit: 'al-ʿAqrab' },
  9: { en: 'Sagittarius', ar: 'القوس', translit: 'al-Qaws' },
  10: { en: 'Capricorn', ar: 'الجدي', translit: 'al-Jady' },
  11: { en: 'Aquarius', ar: 'الدلو', translit: 'al-Dalw' },
  12: { en: 'Pisces', ar: 'الحوت', translit: 'al-Ḥūt' },
};

type LangKey = 'en' | 'fr' | 'ar';

function toLangKey(language: string): LangKey {
  if (language === 'ar') return 'ar';
  if (language === 'fr') return 'fr';
  return 'en';
}

function localizeElement(element: 'Fire' | 'Earth' | 'Air' | 'Water', lang: LangKey): string {
  if (lang === 'fr') {
    return element === 'Fire' ? 'Feu' : element === 'Earth' ? 'Terre' : element === 'Air' ? 'Air' : 'Eau';
  }
  if (lang === 'ar') {
    return element === 'Fire' ? 'نار' : element === 'Earth' ? 'تراب' : element === 'Air' ? 'هواء' : 'ماء';
  }
  return element;
}

function localizePlanet(planet: string, lang: LangKey): string {
  if (lang === 'fr') {
    return planet === 'Moon'
      ? 'Lune'
      : planet === 'Sun'
        ? 'Soleil'
        : planet === 'Mercury'
          ? 'Mercure'
          : planet === 'Venus'
            ? 'Vénus'
            : planet === 'Mars'
              ? 'Mars'
              : planet === 'Jupiter'
                ? 'Jupiter'
                : planet === 'Saturn'
                  ? 'Saturne'
                  : planet;
  }
  if (lang === 'ar') {
    return planet === 'Moon'
      ? 'القمر'
      : planet === 'Sun'
        ? 'الشمس'
        : planet === 'Mercury'
          ? 'عطارد'
          : planet === 'Venus'
            ? 'الزهرة'
            : planet === 'Mars'
              ? 'المريخ'
              : planet === 'Jupiter'
                ? 'المشتري'
                : planet === 'Saturn'
                  ? 'زحل'
                  : planet;
  }
  return planet;
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

export default function HealthAwarenessTab({ result }: HealthAwarenessTabProps) {
  const { language, t } = useLanguage();
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  const burj = result.burujRemainder;
  const health = ZODIAC_HEALTH_DATA_BY_BURUJ[burj];
  const zodiacLabel = ZODIAC_LABELS_BY_BURUJ[burj];
  const langKey = toLangKey(language);

  const title =
    t('istikhara.health.title') ||
    (language === 'ar' ? 'التنبيه الصحي' : language === 'fr' ? 'Vigilance santé' : 'Health Awareness');
  const subtitle =
    t('istikhara.health.subtitle') ||
    (language === 'ar'
      ? 'حكمة تقليدية لطبيعتك الروحية (ليست نصيحة طبية)'
      : language === 'fr'
        ? 'Sagesse traditionnelle pour ta nature spirituelle (pas un avis médical)'
        : 'Traditional wisdom for your spiritual nature (not medical advice)');

  const chevron = expanded ? <ChevronUp size={20} color={stylesTokens.blue} /> : <ChevronDown size={20} color={stylesTokens.blue} />;

  if (!health || !zodiacLabel) {
    return (
      <View style={styles.emptyWrap}>
        <Text style={styles.emptyTitle}>{t('istikhara.health.empty.title') || title}</Text>
        <Text style={styles.emptyText}>
          {t('istikhara.health.empty.text') ||
            (language === 'ar'
              ? 'لا توجد بيانات لهذا البرج بعد.'
              : language === 'fr'
                ? "Aucune donnée n'est disponible pour ce signe pour l'instant."
                : 'No data is available for this sign yet.')}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <HeartPulse size={20} color={stylesTokens.blue} />
          <Text style={styles.screenTitle}>{title}</Text>
        </View>
        <Text style={styles.screenSubTitle}>{subtitle}</Text>

        <Text style={styles.zodiacLine}>
          {zodiacLabel.en} • {zodiacLabel.translit} • {zodiacLabel.ar}
        </Text>
        <Text style={styles.metaLine}>
          {localizeElement(health.element, langKey)} • {localizePlanet(health.planet, langKey)}
        </Text>
      </View>

      <PatternCard style={styles.card}>
        <TouchableOpacity
          style={styles.cardHeader}
          onPress={() => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setExpanded((v) => !v);
          }}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel={
            t('istikhara.health.a11y.toggle') ||
            (language === 'ar'
              ? 'توسيع أو طي قسم التنبيه الصحي'
              : language === 'fr'
                ? 'Développer ou réduire la section vigilance santé'
                : 'Expand or collapse health awareness')
          }
        >
          <View style={styles.cardHeaderLeft}>
            <Text style={styles.cardIcon}>⚕️</Text>
            <Text style={styles.cardTitle}>{title}</Text>
          </View>
          {chevron}
        </TouchableOpacity>

        <Text style={styles.cardSubtitle}>{subtitle}</Text>

        {expanded && (
          <View style={styles.sections}>
            <Section
              title={t('istikhara.health.sections.watchOutFor') || '⚠️ Watch Out For'}
              items={(health.watchOutFor[langKey] || health.watchOutFor.en) ?? []}
            />
            <Section
              title={t('istikhara.health.sections.thingsToAvoid') || '🚫 Things to Avoid'}
              items={(health.avoid[langKey] || health.avoid.en) ?? []}
            />
            <Section
              title={t('istikhara.health.sections.foodsThatHelpYou') || '🍎 Foods That Help You'}
              items={(health.foods[langKey] || health.foods.en) ?? []}
            />
            <Section
              title={t('istikhara.health.sections.spiritualProtection') || '🛡️ Spiritual Protection'}
              items={(health.spiritualProtection[langKey] || health.spiritualProtection.en) ?? []}
            />
            {!!health.westAfricanTraditions?.[langKey]?.length && (
              <Section
                title={t('istikhara.health.sections.westAfricanTraditions') || '🌍 West African Traditions'}
                items={(health.westAfricanTraditions?.[langKey] || health.westAfricanTraditions?.en) ?? []}
              />
            )}

            <View style={styles.disclaimer}>
              <Text style={styles.disclaimerText}>
                {t('istikhara.health.disclaimer') ||
                  '💡 This is traditional spiritual guidance, not medical advice. For health concerns, consult a qualified clinician.'}
              </Text>
            </View>
          </View>
        )}
      </PatternCard>
    </ScrollView>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {items.map((item, idx) => (
        <View key={`${title}-${idx}`} style={styles.bulletRow}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.itemText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

const stylesTokens = {
  blue: '#4FACFE',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1419',
  },
  content: {
    padding: 16,
    paddingBottom: 28,
  },
  header: {
    marginBottom: 12,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  screenSubTitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.72)',
    lineHeight: 18,
    marginBottom: 10,
  },
  zodiacLine: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.82)',
    marginBottom: 6,
  },
  metaLine: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.70)',
  },
  patternCard: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    backgroundColor: 'rgba(30, 41, 84, 0.40)',
    borderColor: 'rgba(79, 172, 254, 0.30)',
    padding: 18,
  },
  patternLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  card: {
    marginTop: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    minHeight: 44,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    paddingRight: 12,
  },
  cardIcon: {
    fontSize: 22,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cardSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.70)',
    marginBottom: 12,
  },
  sections: {
    gap: 18,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#4FACFE',
  },
  bulletRow: {
    flexDirection: 'row',
    gap: 8,
    paddingLeft: 4,
  },
  bullet: {
    color: '#4FACFE',
    fontSize: 14,
    lineHeight: 20,
  },
  itemText: {
    flex: 1,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.88)',
    lineHeight: 20,
  },
  disclaimer: {
    backgroundColor: 'rgba(79, 172, 254, 0.10)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(79, 172, 254, 0.20)',
  },
  disclaimerText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.75)',
    lineHeight: 18,
    textAlign: 'center',
  },
  emptyWrap: {
    flex: 1,
    backgroundColor: '#0f1419',
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.72)',
    textAlign: 'center',
    lineHeight: 18,
  },
});
