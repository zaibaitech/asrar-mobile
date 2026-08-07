/**
 * Best Dates (Ikhtiyārāt) — Check a Date
 * =========================================
 * Ported from asrar.app's CheckDateView.tsx. On-device scoring via
 * services/ikhtiyaratEngine — a faithful port of the real, scholar-
 * reviewed engine (see that module's file headers for what was ported
 * verbatim vs. newly drafted for Arabic).
 *
 * CRITICAL: Reflective classical-astrology guidance only — not a religious
 * ruling and not a guarantee of outcome.
 */

import ResponsiveAppHeader from '@/components/AppHeader';
import AdabDisclaimer from '@/components/best-dates/AdabDisclaimer';
import BadgePills from '@/components/best-dates/BadgePills';
import ElectionTypeDropdown from '@/components/best-dates/ElectionTypeDropdown';
import RuleRow from '@/components/best-dates/RuleRow';
import SimpleModeToggle from '@/components/best-dates/SimpleModeToggle';
import TierBadge from '@/components/best-dates/TierBadge';
import UrfBadgeView from '@/components/best-dates/UrfBadge';
import LocationAutocomplete from '@/components/LocationAutocomplete';
import Colors from '@/constants/Colors';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  businessElectionConfig,
  educationElectionConfig,
  ElectionResult,
  ElectionType,
  evaluateElection,
  findNearestBetterDates,
  getDayDegradationNote,
  getMedicalBadges,
  getSunnahBadges,
  getTravelBadges,
  gregorianToHijri,
  homeElectionConfig,
  marriageElectionConfig,
  medicalElectionConfig,
  travelElectionConfig,
} from '@/services/ikhtiyaratEngine';
import { ikhtiyaratCopy, UiLang } from '@/services/ikhtiyaratEngine/copy';
import { getPlanetPosition } from '@/services/ikhtiyaratEngine/ephemeris';
import { getUrfBadgeForMonth } from '@/services/ikhtiyaratEngine/urf';
import {
  findCachedCheck,
  readSimpleMode,
  saveCheckToCache,
  writeSimpleMode,
} from '@/services/ikhtiyaratStorage';
import { getBestLocation } from '@/services/LocationCacheService';
import { getTimezoneFromLocation, LocationSearchResult } from '@/services/LocationService';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

const CONFIG_BY_ELECTION_TYPE: Record<ElectionType, typeof marriageElectionConfig> = {
  marriage: marriageElectionConfig,
  travel: travelElectionConfig,
  business: businessElectionConfig,
  medical: medicalElectionConfig,
  home: homeElectionConfig,
  education: educationElectionConfig,
};

const ELECTION_TYPES: ElectionType[] = ['marriage', 'travel', 'business', 'medical', 'home', 'education'];

const BASE_URL = 'https://www.asrar.app';

function toLocalDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Maps the app's 3-language contexts/LanguageContext.tsx locale to the engine's UiLang (same set, kept as a distinct type at the engine boundary). */
function toUiLang(language: 'en' | 'fr' | 'ar'): UiLang {
  return language;
}

export default function BestDatesCheckScreen() {
  const { language: appLanguage, setLanguage, t } = useLanguage();
  const language = toUiLang(appLanguage);
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const c = ikhtiyaratCopy[language];
  const params = useLocalSearchParams<{ date?: string; electionType?: string }>();

  const [electionType, setElectionType] = useState<ElectionType>(
    ELECTION_TYPES.includes(params.electionType as ElectionType) ? (params.electionType as ElectionType) : 'marriage'
  );
  const config = CONFIG_BY_ELECTION_TYPE[electionType];
  const ELECTION_TYPE_OPTIONS = [
    { value: 'marriage' as ElectionType, label: c.electionTypeMarriage },
    { value: 'travel' as ElectionType, label: c.electionTypeTravel },
    { value: 'business' as ElectionType, label: c.electionTypeBusiness },
    { value: 'medical' as ElectionType, label: c.electionTypeMedical },
    { value: 'home' as ElectionType, label: c.electionTypeHome },
    { value: 'education' as ElectionType, label: c.electionTypeEducation },
  ];

  const [dateStr, setDateStr] = useState(params.date ?? toLocalDateString(new Date()));
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [locationLabel, setLocationLabel] = useState('');
  const [location, setLocation] = useState<{ latitude: number; longitude: number; tz: string } | null>(null);
  const [locatingCurrent, setLocatingCurrent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ElectionResult | null>(null);
  const [nearestBetter, setNearestBetter] = useState<ElectionResult[]>([]);
  const [bestAvailable, setBestAvailable] = useState<ElectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const [simpleMode, setSimpleModeState] = useState(true);
  useEffect(() => {
    readSimpleMode().then(setSimpleModeState);
  }, []);
  const setSimpleMode = (value: boolean) => {
    setSimpleModeState(value);
    writeSimpleMode(value);
  };

  const [disclaimerForceOpen, setDisclaimerForceOpen] = useState(false);

  const handleUseCurrentLocation = async () => {
    setLocatingCurrent(true);
    try {
      const best = await getBestLocation({ allowPrompt: false });
      if (!best) {
        setError(t('bestDates.check.locationUnavailable') || 'Location unavailable');
        return;
      }
      const tz = await getTimezoneFromLocation(best.latitude, best.longitude);
      setLocation({ latitude: best.latitude, longitude: best.longitude, tz });
      setLocationLabel(c.useMyLocation);
    } finally {
      setLocatingCurrent(false);
    }
  };

  const handleSelectLocation = async (selected: LocationSearchResult) => {
    setLocationLabel(selected.label);
    const tz = await getTimezoneFromLocation(selected.latitude, selected.longitude);
    setLocation({ latitude: selected.latitude, longitude: selected.longitude, tz });
  };

  const handleCheck = async () => {
    if (!location) {
      setError(t('bestDates.check.locationRequired') || 'Please choose a location.');
      return;
    }

    setLoading(true);
    setError(null);
    setIsOffline(false);

    // Defer so the loading state paints before the synchronous, CPU-bound
    // ephemeris computation runs — same reasoning as the web's setTimeout(0).
    setTimeout(async () => {
      try {
        const datetime = new Date(`${dateStr}T12:00:00`);
        const input = { datetime, lat: location.latitude, lon: location.longitude, tz: location.tz, electionType };
        const r = evaluateElection(input, config);
        setResult(r);
        await saveCheckToCache(electionType, dateStr, location.latitude, location.longitude, r);

        if (r.tier === 'avoid' || r.tier === 'weak') {
          const { dates, bestAvailable: fallback } = findNearestBetterDates(input, config, 3);
          setNearestBetter(dates);
          setBestAvailable(dates.length === 0 ? fallback : null);
        } else {
          setNearestBetter([]);
          setBestAvailable(null);
        }
      } catch (e) {
        const cached = await findCachedCheck(electionType, dateStr, location.latitude, location.longitude);
        if (cached) {
          setResult(cached);
          setIsOffline(true);
          setNearestBetter([]);
          setBestAvailable(null);
        } else {
          setError(t('bestDates.check.computeFailed') || 'Could not compute this date. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    }, 0);
  };

  useEffect(() => {
    if (location) handleCheck();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [electionType]);

  const handleShare = async () => {
    if (!result || !location) return;
    const tierLabel = language === 'fr' ? result.tierInfo.labelFr : language === 'ar' ? result.tierInfo.labelAr : result.tierInfo.labelEn;
    const dateOnly = result.date.toISOString().slice(0, 10);
    const url = `${BASE_URL}/ikhtiyarat/r/${dateOnly}?lat=${location.latitude}&lon=${location.longitude}&tz=${encodeURIComponent(location.tz)}&election=${electionType}${language === 'fr' ? '&lang=fr' : ''}`;
    try {
      await Share.share({ message: `${dateOnly} — ${tierLabel} (${result.score}/100)\n${url}` });
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    } catch {
      // user cancelled — no-op
    }
  };

  const hijri = result ? gregorianToHijri(result.date) : null;
  const sunnahBadges = result && electionType === 'marriage' ? getSunnahBadges(result.date) : [];
  const urfBadge = hijri && electionType === 'marriage' ? getUrfBadgeForMonth(hijri.month) : null;
  const travelBadges = result && electionType === 'travel' ? getTravelBadges(result) : [];
  const medicalBadges =
    result && electionType === 'medical'
      ? getMedicalBadges(result, getPlanetPosition('Moon', result.bestWindow.time).sign)
      : [];
  const degradationNote = result ? getDayDegradationNote(result, language) : null;
  const locale = language === 'fr' ? 'fr-FR' : language === 'ar' ? 'ar-SA' : 'en-US';

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <ResponsiveAppHeader
          currentLanguage={appLanguage === 'en' ? 'EN' : appLanguage === 'fr' ? 'FR' : 'AR'}
          onLanguageChange={(lang) => setLanguage(lang.toLowerCase() as 'en' | 'fr' | 'ar')}
          onProfilePress={() => router.push('/profile')}
          onMenuPress={() => router.back()}
        />

        <View style={styles.infoBar}>
          <Text style={[styles.screenTitle, { color: colors.text }]}>{c.title}</Text>
          <TouchableOpacity
            onPress={() => setDisclaimerForceOpen(true)}
            accessibilityLabel={c.aboutLink}
          >
            <Ionicons name="information-circle-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.modeTabRow}>
          <View style={[styles.modeTab, styles.modeTabActive, { borderColor: '#059669' }]}>
            <Text style={[styles.modeTabText, { color: '#059669' }]}>{c.tabCheck}</Text>
          </View>
          <TouchableOpacity
            style={[styles.modeTab, { borderColor: colors.border }]}
            onPress={() =>
              router.replace({
                pathname: '/best-dates-scan',
                params: { electionType },
              })
            }
          >
            <Text style={[styles.modeTabText, { color: colors.textSecondary }]}>{c.tabScan}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <ElectionTypeDropdown
            value={electionType}
            options={ELECTION_TYPE_OPTIONS}
            onChange={setElectionType}
            label={c.electionTypeLabel}
          />

          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>{c.datePickerLabel}</Text>
            <TouchableOpacity
              style={[styles.dateButton, { borderColor: colors.border }]}
              onPress={() => setShowDatePicker(true)}
            >
              <Ionicons name="calendar" size={20} color={colors.textSecondary} />
              <Text style={[styles.dateButtonText, { color: colors.text }]}>{dateStr}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={new Date(dateStr + 'T12:00:00')}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(_, date) => {
                  if (Platform.OS === 'android') setShowDatePicker(false);
                  if (date) setDateStr(toLocalDateString(date));
                }}
              />
            )}
            {Platform.OS === 'ios' && showDatePicker && (
              <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                <Text style={[styles.doneText, { color: colors.primary }]}>{t('common.done')}</Text>
              </TouchableOpacity>
            )}

            <Text style={[styles.cardLabel, { color: colors.textSecondary, marginTop: 12 }]}>{c.locationLabel}</Text>
            <LocationAutocomplete value={locationLabel} onChange={setLocationLabel} onSelect={handleSelectLocation} />
            <TouchableOpacity style={styles.currentLocationRow} onPress={handleUseCurrentLocation} disabled={locatingCurrent}>
              {locatingCurrent ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Ionicons name="locate" size={18} color={colors.primary} />
              )}
              <Text style={[styles.currentLocationText, { color: colors.primary }]}>{c.useMyLocation}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.checkButton, { backgroundColor: '#059669' }]}
              onPress={handleCheck}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.checkButtonText}>{c.checkButton}</Text>
              )}
            </TouchableOpacity>
          </View>

          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {result && (
            <View style={[styles.resultCard, { backgroundColor: colors.card }]}>
              {isOffline && (
                <View style={styles.offlineBanner}>
                  <Ionicons name="cloud-offline-outline" size={16} color="#f97316" />
                  <Text style={styles.offlineText}>Cached — reconnect to refresh</Text>
                </View>
              )}

              <View style={styles.starsHeaderRow}>
                <Text style={[styles.sectionLabel, { color: colors.textTertiary }]}>{c.starsLabel}</Text>
                <TouchableOpacity onPress={handleShare}>
                  <Text style={styles.shareLink}>{shareCopied ? c.linkCopied : c.shareButton}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.tierRow}>
                <TierBadge tierInfo={result.tierInfo} language={language} score={result.score} />
                {hijri && (
                  <Text style={[styles.hijriText, { color: colors.textSecondary }]}>
                    {c.hijriDate}: {hijri.day} {hijri.monthName[language === 'ar' ? 'ar' : language]} ({hijri.monthName.wolof}) {hijri.year} {c.hijriEra}
                  </Text>
                )}
              </View>

              {sunnahBadges.length > 0 && (
                <View>
                  <Text style={[styles.sectionLabel, { color: colors.textTertiary }]}>{c.sunnahBadge}</Text>
                  <BadgePills badges={sunnahBadges} language={language} />
                </View>
              )}
              {urfBadge && (
                <View>
                  <Text style={[styles.sectionLabel, { color: colors.textTertiary }]}>{c.urfLabel}</Text>
                  <UrfBadgeView badge={urfBadge} language={language} />
                </View>
              )}
              {travelBadges.length > 0 && (
                <View>
                  <Text style={[styles.sectionLabel, { color: colors.textTertiary }]}>{c.sunnahBadge}</Text>
                  <BadgePills badges={travelBadges} language={language} />
                </View>
              )}
              {medicalBadges.length > 0 && (
                <View>
                  <Text style={[styles.sectionLabel, { color: colors.textTertiary }]}>{c.sunnahBadge}</Text>
                  <BadgePills badges={medicalBadges} language={language} />
                </View>
              )}

              <View style={[styles.windowCard, { borderColor: colors.border }]}>
                <Text style={[styles.sectionLabel, { color: colors.textTertiary }]}>
                  {result.isLeastAfflicted ? c.leastAfflictedWindow : c.bestWindow}
                </Text>
                <Text style={[styles.windowTime, { color: colors.text }]}>
                  {result.bestWindow.time.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}
                </Text>
                {degradationNote && <Text style={styles.degradationNote}>{degradationNote}</Text>}
              </View>

              <View>
                <View style={styles.ruleHeaderRow}>
                  <Text style={[styles.sectionLabel, { color: colors.textTertiary }]}>{c.ruleBreakdown}</Text>
                  <SimpleModeToggle simple={simpleMode} onChange={setSimpleMode} language={language} />
                </View>
                <View style={[styles.rulesCard, { borderColor: colors.border }]}>
                  {result.rules.map((rule) => (
                    <RuleRow
                      key={rule.id}
                      rule={rule}
                      language={language}
                      simple={simpleMode}
                      textColor={colors.text}
                      detailColor={colors.textSecondary}
                      borderColor={colors.border}
                    />
                  ))}
                </View>
              </View>

              {nearestBetter.length > 0 && (
                <View>
                  <Text style={[styles.sectionLabel, { color: colors.textTertiary }]}>{c.nearestBetterDates}</Text>
                  {nearestBetter.map((r) => (
                    <TouchableOpacity
                      key={r.date.toISOString()}
                      style={[styles.nearestRow, { borderColor: colors.border }]}
                      onPress={() => setDateStr(toLocalDateString(r.date))}
                    >
                      <Text style={[styles.nearestDateText, { color: colors.text }]}>
                        {r.date.toLocaleDateString(locale, { weekday: 'short', month: 'short', day: 'numeric' })}
                      </Text>
                      <TierBadge tierInfo={r.tierInfo} language={language} score={r.score} />
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {nearestBetter.length === 0 && bestAvailable && (
                <View>
                  <Text style={[styles.helperText, { color: colors.textSecondary }]}>
                    {c.noAcceptableDatesFound} {c.showingBestAvailable}
                  </Text>
                  <View style={[styles.nearestRow, { borderColor: colors.border }]}>
                    <Text style={[styles.nearestDateText, { color: colors.text }]}>
                      {bestAvailable.date.toLocaleDateString(locale, { weekday: 'short', month: 'short', day: 'numeric' })}
                    </Text>
                    <TierBadge tierInfo={bestAvailable.tierInfo} language={language} score={bestAvailable.score} />
                  </View>
                </View>
              )}
            </View>
          )}
        </ScrollView>

        <AdabDisclaimer
          language={language}
          forceOpen={disclaimerForceOpen}
          onRequestClose={() => setDisclaimerForceOpen(false)}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  infoBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  screenTitle: { fontSize: 22, fontWeight: '800' },
  modeTabRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, paddingTop: 14 },
  modeTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  modeTabActive: { backgroundColor: '#05966915' },
  modeTabText: { fontSize: 14, fontWeight: '700' },
  scrollView: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 60, gap: 16 },
  card: { borderRadius: 16, padding: 16 },
  cardLabel: { fontSize: 12, fontWeight: '600', marginBottom: 6, textTransform: 'uppercase' },
  dateButton: { flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 14 },
  dateButtonText: { fontSize: 16, fontWeight: '600' },
  doneText: { textAlign: 'right', marginTop: 8, fontWeight: '700' },
  currentLocationRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 },
  currentLocationText: { fontSize: 13, fontWeight: '600' },
  checkButton: { borderRadius: 14, paddingVertical: 14, alignItems: 'center', marginTop: 14 },
  checkButtonText: { color: '#fff', fontSize: 15, fontWeight: '800' },
  errorBox: { backgroundColor: '#f9731620', borderRadius: 10, padding: 12 },
  errorText: { color: '#f97316', fontSize: 14 },
  resultCard: { borderRadius: 16, padding: 20, gap: 14 },
  offlineBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#f9731620', borderRadius: 10, padding: 10 },
  offlineText: { color: '#f97316', fontSize: 13, flex: 1 },
  starsHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionLabel: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  shareLink: { color: '#059669', fontSize: 12, fontWeight: '700' },
  tierRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  hijriText: { fontSize: 12 },
  windowCard: { borderRadius: 12, borderWidth: 1, padding: 12 },
  windowTime: { fontSize: 15, fontWeight: '600' },
  degradationNote: { fontSize: 12, color: '#D97706', marginTop: 8 },
  ruleHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  rulesCard: { borderRadius: 12, borderWidth: 1, paddingHorizontal: 12 },
  nearestRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 8 },
  nearestDateText: { fontSize: 14, fontWeight: '600' },
  helperText: { fontSize: 12, marginBottom: 8 },
});
